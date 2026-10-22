/* Экомун — QR код орқали кириш.
   server.js томонидан ишлатилади: require("./qr")(ctx) → { api, stats }.

   Икки усул (Google, WhatsApp Web ва Telegram'даги каби):
   1) «Телефонда тасдиқлаш». Янги қурилма (масалан, компьютер) POST /api/qr/start → QR (…/?qra=ТОКЕН) ни
      кўрсатади ва POST /api/qr/poll орқали кутади. Ҳисобга кирган телефон QR ни сканер қилади →
      /api/qr/peek (қайси қурилма, қаердан кирмоқчи) → «Тасдиқлаш» → /api/qr/approve.
      Шундан сўнг янги қурилмадаги навбатдаги poll сўрови сессия очади.
   2) «Бир марталик кириш QR'и». Ҳисобга кирган қурилма POST /api/qr/link → QR (…/?qr=ТОКЕН).
      Бошқа қурилма уни камера билан сканер қилади (телефоннинг оддий камераси ҳам бўлади) →
      POST /api/qr/redeem → сессия. QR кўрсатган қурилма /api/qr/link-state орқали «кирилди» деб билади.

   Хавфсизлик:
   • токен — 32 байт тасодифий (crypto.randomBytes), серверда фақат SHA-256 хэши сақланади (хотирада, дискка ёзилмайди);
   • бир марта ишлатилади ва 3 дақиқада тугайди (QR_TTL_SEC билан 60–300 сония);
   • янги қурилма учун алоҳида махфий калит (poll) — QR расмини кўрган бошқа одам сессияни ололмайди;
   • тасдиқлашдан олдин телефонда кирмоқчи бўлган қурилма, ҳудуд ва вақт кўрсатилади (QR фишингга қарши);
   • IP бўйича чекловлар, Origin текшируви, барча ҳодисалар журналга ёзилади (бошқарув маркази → Журнал → QR). */
"use strict";

const crypto = require("node:crypto");

module.exports = function qr(ctx) {
  const { send, readBody, currentUser, startSession, endSession, publicUser, logEvent, clientIp, devOf, placeOf, publicOrigin, now, tooManyFailures, noteFailure, BLOCK_MSG, db } = ctx;
  const TTL = Math.min(300, Math.max(60, Number(process.env.QR_TTL_SEC) || 180)) * 1000;
  const MAX = 5000;
  const hash = (t) => crypto.createHash("sha256").update("ekomun-qr|" + String(t || "")).digest("hex");
  const eqHex = (a, b) => { const x = Buffer.from(String(a || ""), "hex"), y = Buffer.from(String(b || ""), "hex"); return x.length === 32 && y.length === 32 && crypto.timingSafeEqual(x, y); };
  const okTok = (t) => typeof t === "string" && /^[A-Za-z0-9_-]{40,64}$/.test(t);
  const token = () => crypto.randomBytes(32).toString("base64url");

  /* Кутаётган QR'лар: калит — токен хэши */
  const pending = new Map(); // 1-усул: { sh, at, exp, ip, device, status, userId, by }
  const links = new Map();   // 2-усул: { userId, at, exp, id, used, usedDevice, usedPlace }
  const linkIds = new Map(); // link-state учун: id хэши → токен хэши

  /* Чекловлар: бир IP дан 10 дақиқада */
  const buckets = new Map();
  function limited(kind, key, max) {
    const k = kind + "|" + key, b = buckets.get(k);
    if (!b || now() - b.first > 10 * 60 * 1000) { buckets.set(k, { first: now(), n: 1 }); return false; }
    return ++b.n > max;
  }
  setInterval(() => {
    const t = now();
    for (const [k, v] of pending) if (v.exp < t - 60000) pending.delete(k);
    for (const [k, v] of links) if (v.exp < t - 10 * 60000) { links.delete(k); linkIds.delete(v.idh); }
    for (const [k, v] of buckets) if (t - v.first > 10 * 60 * 1000) buckets.delete(k);
  }, 60000).unref();

  /* Бошқа сайтдан юборилган сўровлар (CSRF) рад этилади */
  function sameOrigin(req) {
    const o = req.headers.origin;
    if (!o) return true;
    try { return new URL(o).host === String(req.headers.host || ""); } catch (e) { return false; }
  }
  const TOO_MANY = { error: "Жуда кўп уриниш. Бироздан сўнг қайта уриниб кўринг" };
  const EXPIRED = "QR коднинг муддати тугаган ёки у ишлатилган. Янги QR код олинг";
  const mask = (ip) => String(ip || "").replace(/(\d+)\.(\d+)$/, "$1.*").replace(/:[0-9a-f]*:[0-9a-f]*$/i, ":*");

  async function api(req, res, pathname) {
    if (!pathname.startsWith("/api/qr/") || req.method !== "POST") return null;
    if (!sameOrigin(req)) return send(res, 403, { error: "Рухсат йўқ" });
    const ip = clientIp(req);
    const body = await readBody(req, 4096);

    /* 1-усул: янги қурилма QR сўрайди */
    if (pathname === "/api/qr/start") {
      if (limited("start", ip, 40) || pending.size >= MAX) return send(res, 429, TOO_MANY);
      const t = token(), s = token(), at = now();
      pending.set(hash(t), { sh: hash(s), at, exp: at + TTL, ip, device: devOf(req), status: "wait", userId: "", by: "" });
      return send(res, 200, { t, s, url: publicOrigin(req) + "/?qra=" + t, ttl: TTL / 1000, exp: at + TTL });
    }

    /* 1-усул: янги қурилма тасдиқни кутади. Тасдиқланса — сессия очилади */
    if (pathname === "/api/qr/poll") {
      if (limited("poll", ip, 900)) return send(res, 429, TOO_MANY);
      if (!okTok(body.t) || !okTok(body.s)) return send(res, 400, { error: "Нотўғри сўров" });
      const key = hash(body.t), p = pending.get(key);
      if (!p || !eqHex(p.sh, hash(body.s))) return send(res, 200, { status: "expired" });
      if (p.status === "denied") { pending.delete(key); return send(res, 200, { status: "denied" }); }
      if (p.status === "ok") {
        pending.delete(key);
        const user = db.users.find((u) => u.id === p.userId);
        if (!user) return send(res, 200, { status: "expired" });
        if (user.blocked) return send(res, 403, { error: BLOCK_MSG, blocked: true });
        endSession(req);
        startSession(user, req, res, body.remember !== false, "QR код (телефонда тасдиқланди)");
        return send(res, 200, { status: "ok", user: publicUser(user) });
      }
      if (p.exp < now()) { pending.delete(key); return send(res, 200, { status: "expired" }); }
      return send(res, 200, { status: p.status, left: Math.max(0, Math.round((p.exp - now()) / 1000)) });
    }

    /* 1-усул: телефон QR ни сканер қилди — қайси қурилма кирмоқчи эканини кўрсатамиз */
    if (pathname === "/api/qr/peek" || pathname === "/api/qr/approve") {
      const cur = currentUser(req);
      if (!cur) return send(res, 401, { error: "Тасдиқлаш учун аввал шу қурилмада ҳисобингизга киринг", auth: true });
      if (limited("approve", ip, 60)) return send(res, 429, TOO_MANY);
      const p = okTok(body.t) && pending.get(hash(body.t));
      if (!p || p.exp < now() || p.status === "ok" || p.status === "denied") return send(res, 410, { error: EXPIRED });
      if (p.by && p.by !== cur.user.id) return send(res, 409, { error: "Бу QR кодни бошқа ҳисоб сканер қилган" });
      if (pathname === "/api/qr/peek") {
        p.status = "scanned"; p.by = cur.user.id;
        return send(res, 200, { device: p.device, place: placeOf(p.ip), ip: mask(p.ip), at: p.at, left: Math.round((p.exp - now()) / 1000), same: p.ip === ip, name: cur.user.name });
      }
      if (body.ok === true) {
        p.status = "ok"; p.userId = cur.user.id; p.by = cur.user.id;
        p.exp = Math.max(p.exp, now() + 60000); // янги қурилма сессияни олиб улгурсин
        logEvent("qr_approve", cur.user, req, { reason: "Янги қурилма: " + p.device });
        return send(res, 200, { ok: true });
      }
      p.status = "denied";
      logEvent("qr_denied", cur.user, req, { reason: p.device });
      return send(res, 200, { ok: false });
    }

    /* 2-усул: ҳисобга кирган қурилма бир марталик кириш QR'ини яратади (олдингиси бекор бўлади) */
    if (pathname === "/api/qr/link") {
      const cur = currentUser(req);
      if (!cur) return send(res, 401, { error: "Аввал ҳисобингизга киринг", auth: true });
      if (limited("link", cur.user.id, 20)) return send(res, 429, TOO_MANY);
      for (const [k, v] of links) if (v.userId === cur.user.id && !v.used) { links.delete(k); linkIds.delete(v.idh); }
      const t = token(), id = token(), at = now(), key = hash(t), idh = hash(id);
      links.set(key, { userId: cur.user.id, at, exp: at + TTL, idh, used: 0, usedDevice: "", usedPlace: "" });
      linkIds.set(idh, key);
      logEvent("qr_link", cur.user, req);
      return send(res, 200, { t, id, url: publicOrigin(req) + "/?qr=" + t, ttl: TTL / 1000, exp: at + TTL });
    }

    /* 2-усул: QR кўрсатган қурилма — QR ишлатилдими? */
    if (pathname === "/api/qr/link-state") {
      const cur = currentUser(req);
      if (!cur) return send(res, 401, { error: "Аввал ҳисобингизга киринг", auth: true });
      if (limited("lstate", ip, 900)) return send(res, 429, TOO_MANY);
      const key = okTok(body.id) && linkIds.get(hash(body.id)), l = key && links.get(key);
      if (!l || l.userId !== cur.user.id) return send(res, 200, { status: "expired" });
      if (l.used) return send(res, 200, { status: "used", device: l.usedDevice, place: l.usedPlace });
      if (l.exp < now()) return send(res, 200, { status: "expired" });
      return send(res, 200, { status: "wait", left: Math.round((l.exp - now()) / 1000) });
    }

    /* 2-усул: бошқа қурилма QR ни сканер қилди — кириш */
    if (pathname === "/api/qr/redeem") {
      if (tooManyFailures(ip)) return send(res, 429, TOO_MANY);
      const key = okTok(body.t) && hash(body.t), l = key && links.get(key);
      if (!l || l.used || l.exp < now()) {
        noteFailure(ip);
        logEvent("qr_failed", null, req, { reason: l && l.used ? "QR аввал ишлатилган" : "QR муддати тугаган ёки нотўғри" });
        return send(res, 410, { error: EXPIRED });
      }
      const user = db.users.find((u) => u.id === l.userId);
      l.used = now(); l.usedDevice = devOf(req); l.usedPlace = placeOf(ip); // бир марталик: қайта ишламайди
      if (!user) return send(res, 410, { error: EXPIRED });
      if (user.blocked) { logEvent("login_blocked", user, req); return send(res, 403, { error: BLOCK_MSG, blocked: true }); }
      endSession(req);
      startSession(user, req, res, body.remember !== false, "QR код (бир марталик)");
      return send(res, 200, { user: publicUser(user) });
    }

    return send(res, 404, { error: "Топилмади" });
  }

  return { api, stats: () => ({ pending: pending.size, links: links.size, ttl: TTL / 1000 }) };
};
