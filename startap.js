/* Экомун — стартап воситалари платформа ичида (ташқи хизматларсиз, шахсий маълумот чиқмайди):
   • Сўровнома (Tally ўрнига): фойдаланувчилар фикри ва бизнес гипотезалари — NPS, PMF, нарх, B2B.
   • UX таҳлили (Hotjar ўрнига): аноним кликлар (heatmap), «жаҳл» ва «бефойда» кликлар, айланиш чуқурлиги,
     сессия йўллари. Матн, киритилган қиймат, исм ёки қурилма коди сақланмайди.
   • Тақдимот ҳаволалари (DocSend ўрнига): pitch deck PDF ни инвесторга алоҳида ҳавола билан бериш ва
     ким, қачон, қайси саҳифада қанча вақт ўтказганини кўриш.
   server.js томонидан ишлатилади: require("./startap")(ctx) → { api, adminApi, stats }. */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DAY = 864e5;
const MAX_SURVEY = 5000, MAX_CLICKS = 20000, MAX_SESS = 3000, MAX_VIEWS = 3000;
const SEC_RE = /^[a-z0-9-]{1,24}$/;
const KEY_RE = /^[a-z0-9_]{1,24}$/;
const TOKEN_RE = /^[A-Za-z0-9_-]{16,40}$/;
const DC = ["m", "t", "d"]; // телефон, планшет, компьютер

module.exports = function startap(ctx) {
  const { db, save, send, readBody, isAdmin, now, newId, clientIp, devOf, placeOf, cleanText, DATA_DIR, adminLog, publicOrigin, deck } = ctx;
  const DECK_DIR = path.join(DATA_DIR, "decks");
  const DECK_MAX = (deck && deck.maxMb ? deck.maxMb : 30) * 1024 * 1024;

  db.survey = Array.isArray(db.survey) ? db.survey : [];
  db.ux = Object.assign({ clicks: [], scroll: {}, sessions: [] }, db.ux || {});
  db.decks = Object.assign({ files: [], links: [], views: [] }, db.decks || {});

  /* Оддий чеклов: бир IP дан 10 дақиқада N та сўров */
  const hits = new Map();
  const tooMany = (ip, kind, n) => {
    const k = kind + "|" + ip, t = now(), h = hits.get(k);
    if (!h || t - h.at > 10 * 60 * 1000) { hits.set(k, { at: t, n: 1 }); return false; }
    h.n++;
    return h.n > n;
  };
  setInterval(() => { const t = now(); for (const [k, h] of hits) if (t - h.at > 10 * 60 * 1000) hits.delete(k); }, 10 * 60 * 1000).unref();

  /* Тежамкор сақлаш: UX маълумотлари тез-тез келади, db.json ни ҳар сафар ёзмаймиз */
  let lazyDirty = false;
  setInterval(() => { if (lazyDirty) { lazyDirty = false; save(); } }, 20 * 1000).unref();

  const num = (v, lo, hi) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : lo; };
  const vidOk = (v) => (/^[a-z0-9]{12,32}$/.test(String(v || "")) ? String(v) : "");
  const vidHash = (v) => (v ? crypto.createHash("sha256").update("ekomun-sorov|" + v).digest("hex").slice(0, 20) : "");

  /* ---------- Сўровнома ---------- */
  function cleanAnswers(a) {
    const out = {};
    if (!a || typeof a !== "object" || Array.isArray(a)) return out;
    for (const [k, v] of Object.entries(a).slice(0, 20)) {
      if (!KEY_RE.test(k)) continue;
      if (typeof v === "number") out[k] = num(v, 0, 10);
      else if (Array.isArray(v)) { const l = v.filter((x) => typeof x === "string" && KEY_RE.test(x)).slice(0, 6); if (l.length) out[k] = l; }
      else if (typeof v === "string") { const s = cleanText(v, 600); if (s) out[k] = KEY_RE.test(s) ? s : { t: s }; }
    }
    return out;
  }

  /* ---------- UX ---------- */
  function addUx(body, req) {
    const t = now();
    const dc = DC.includes(body.dc) ? body.dc : "d";
    const stage = ["maktab", "uni"].includes(body.stage) ? body.stage : "";
    const U = db.ux;
    let n = 0;
    for (const c of (Array.isArray(body.c) ? body.c : []).slice(0, 120)) {
      if (!Array.isArray(c) || !SEC_RE.test(String(c[0]))) continue;
      const tgt = cleanText(c[3], 80);
      /* [вақт, бўлим, қурилма, x (0–1000 бўлим энига нисбатан), y (px бўлим тепасидан), нишон, белгилар: 1 жаҳл, 2 бефойда] */
      U.clicks.push([t, c[0], dc, num(c[1], 0, 1000), num(c[2], 0, 60000), tgt, num(c[4], 0, 3)]);
      n++;
    }
    if (U.clicks.length > MAX_CLICKS) U.clicks.splice(0, U.clicks.length - MAX_CLICKS);
    for (const s of (Array.isArray(body.s) ? body.s : []).slice(0, 60)) {
      if (!Array.isArray(s) || !SEC_RE.test(String(s[0]))) continue;
      const k = s[0] + "|" + dc, d = num(s[1], 0, 100), ms = num(s[2], 0, 30 * 60 * 1000);
      const o = U.scroll[k] || (U.scroll[k] = { n: 0, depth: 0, ms: 0, b: [0, 0, 0, 0] });
      o.n++; o.depth += d; o.ms += ms; o.b[Math.min(3, Math.floor(d / 25.0001))]++;
      n++;
    }
    if (Array.isArray(body.p) && body.p.length) {
      const pathArr = body.p.slice(0, 40).filter((x) => Array.isArray(x) && SEC_RE.test(String(x[0]))).map((x) => [x[0], num(x[1], 0, 60 * 60 * 1000)]);
      if (pathArr.length) {
        U.sessions.push({ t, dc, stage, src: /^[\w.-]{1,30}$/.test(String(body.src || "")) ? String(body.src).toLowerCase() : "", lang: ["cyr", "lat", "ru", "en"].includes(body.lang) ? body.lang : "", p: pathArr, dev: devOf(req).split(" · ").slice(1).join(" · ") });
        if (U.sessions.length > MAX_SESS) U.sessions.splice(0, U.sessions.length - MAX_SESS);
        n++;
      }
    }
    if (n) lazyDirty = true;
    return n;
  }

  function uxReport(q) {
    const days = num(q.get("days") || 30, 1, 365), dc = DC.includes(q.get("dc")) ? q.get("dc") : "", sec = SEC_RE.test(q.get("sec") || "") ? q.get("sec") : "";
    const from = now() - days * DAY, U = db.ux;
    const clicks = U.clicks.filter((c) => c[0] >= from && (!dc || c[2] === dc));
    const bySec = {};
    for (const c of clicks) {
      const o = bySec[c[1]] || (bySec[c[1]] = { sec: c[1], clicks: 0, rage: 0, dead: 0 });
      o.clicks++; if (c[6] & 1) o.rage++; if (c[6] & 2) o.dead++;
    }
    for (const [k, o] of Object.entries(U.scroll)) {
      const [s, d] = k.split("|");
      if (dc && d !== dc) continue;
      const r = bySec[s] || (bySec[s] = { sec: s, clicks: 0, rage: 0, dead: 0 });
      r.views = (r.views || 0) + o.n; r.depthSum = (r.depthSum || 0) + o.depth; r.ms = (r.ms || 0) + o.ms;
      r.b = (r.b || [0, 0, 0, 0]).map((v, i) => v + o.b[i]);
    }
    const sections = Object.values(bySec).map((o) => ({ sec: o.sec, clicks: o.clicks, rage: o.rage, dead: o.dead, views: o.views || 0,
      depth: o.views ? Math.round(o.depthSum / o.views) : 0, avgMs: o.views ? Math.round(o.ms / o.views) : 0, b: o.b || [0, 0, 0, 0] }))
      .sort((a, b) => b.clicks + b.views - (a.clicks + a.views));
    const sc = sec ? clicks.filter((c) => c[1] === sec) : [];
    const tally = (list) => {
      const m = new Map();
      for (const c of list) { const k = c[5] || "(бўш жой)"; m.set(k, (m.get(k) || 0) + 1); }
      return [...m].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([t, n]) => ({ t, n }));
    };
    /* Сессия йўллари: бўлимдан бўлимга ўтишлар ва чиқиш нуқталари */
    const sess = U.sessions.filter((s) => s.t >= from && (!dc || s.dc === dc));
    const trans = new Map(), exits = new Map(), entries = new Map(), srcs = new Map();
    let totalMs = 0, depth = 0;
    for (const s of sess) {
      const p = s.p;
      totalMs += p.reduce((a, x) => a + x[1], 0); depth += p.length;
      entries.set(p[0][0], (entries.get(p[0][0]) || 0) + 1);
      const sk = s.src || "(тўғридан-тўғри)"; srcs.set(sk, (srcs.get(sk) || 0) + 1);
      exits.set(p[p.length - 1][0], (exits.get(p[p.length - 1][0]) || 0) + 1);
      for (let i = 1; i < p.length; i++) { const k = p[i - 1][0] + "→" + p[i][0]; trans.set(k, (trans.get(k) || 0) + 1); }
    }
    const top = (m, n = 15) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ k, v }));
    return {
      days, dc, sec, totalClicks: clicks.length, sessions: sess.length,
      avgSessionMs: sess.length ? Math.round(totalMs / sess.length) : 0, avgDepth: sess.length ? +(depth / sess.length).toFixed(1) : 0,
      rage: clicks.filter((c) => c[6] & 1).length, dead: clicks.filter((c) => c[6] & 2).length,
      sections,
      points: sc.length > 6000 ? sc.filter((_, i) => i % Math.ceil(sc.length / 6000) === 0).map((c) => [c[2], c[3], c[4], c[6]]) : sc.map((c) => [c[2], c[3], c[4], c[6]]),
      targets: tally(sc), rageTargets: tally(sc.filter((c) => c[6] & 1)), deadTargets: tally(sc.filter((c) => c[6] & 2)),
      transitions: top(trans), entries: top(entries, 10), sources: top(srcs, 12), exits: top(exits, 10),
      recent: sess.slice(-40).reverse().map((s) => ({ t: s.t, dc: s.dc, stage: s.stage, lang: s.lang, dev: s.dev, p: s.p }))
    };
  }

  /* ---------- Тақдимот ҳаволалари ---------- */
  const D = () => db.decks;
  const deckFile = (id) => path.join(DECK_DIR, id + ".pdf");
  const linkStats = (l) => {
    const v = D().views.filter((x) => x.link === l.token);
    const people = new Set(v.map((x) => x.email || x.ipHash));
    return { views: v.length, people: people.size, ms: v.reduce((a, x) => a + x.ms, 0), last: v.reduce((a, x) => Math.max(a, x.last || x.at), 0),
      done: v.filter((x) => x.pages && x.maxPage >= x.pages).length };
  };
  const linkOpen = (l) => l && l.on && (!l.until || l.until > now()) && D().files.some((f) => f.id === l.deck);
  function readRaw(req, limit) {
    return new Promise((resolve, reject) => {
      let size = 0; const chunks = [];
      req.on("data", (c) => { size += c.length; if (size > limit) { req.removeAllListeners("data"); req.resume(); reject(new Error("too_large")); return; } chunks.push(c); });
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });
  }

  /* ---------- Оммавий API ---------- */
  async function api(req, res, pathname) {
    const method = req.method, ip = clientIp(req);

    if (pathname === "/api/survey" && method === "POST") {
      if (tooMany(ip, "sv", 20)) return send(res, 429, { error: "Жуда кўп сўров. Бироздан сўнг уриниб кўринг" });
      const body = await readBody(req, 16 * 1024);
      const sv = cleanText(body.sv, 20);
      if (!/^[\w.-]{1,20}$/.test(sv)) return send(res, 400, { error: "Нотўғри сўров" });
      const ans = cleanAnswers(body.ans);
      if (Object.keys(ans).length < 2) return send(res, 400, { error: "Камида 2 та саволга жавоб беринг" });
      const vh = vidHash(vidOk(body.vid));
      const stage = ["maktab", "uni"].includes(body.stage) ? body.stage : "";
      /* Мактаб босқичидаги болалардан тўлов саволига жавоб олинмайди */
      if (stage === "maktab") { delete ans.pay; delete ans.b2b; }
      const rec = { id: newId(), sv, at: now(), vh, stage, lang: ["cyr", "lat", "ru", "en"].includes(body.lang) ? body.lang : "", ans,
        dev: devOf(req).split(" · ")[0].split(" ")[0], place: placeOf(ip) || "" };
      /* Бир қурилмадан битта жавоб: қайта юборилса — янгиланади */
      const old = vh ? db.survey.findIndex((x) => x.vh === vh && x.sv === sv) : -1;
      if (old >= 0) db.survey.splice(old, 1);
      db.survey.push(rec);
      if (db.survey.length > MAX_SURVEY) db.survey.splice(0, db.survey.length - MAX_SURVEY);
      save();
      return send(res, 201, { ok: true, updated: old >= 0 });
    }

    if (pathname === "/api/ux" && method === "POST") {
      if (tooMany(ip, "ux", 120)) return send(res, 429, { error: "Жуда кўп сўров" });
      const body = await readBody(req, 48 * 1024);
      return send(res, 200, { ok: true, n: addUx(body, req) });
    }

    const dm = /^\/api\/deck\/([A-Za-z0-9_-]{16,40})(\/open|\/file|\/ping)?$/.exec(pathname);
    if (dm) {
      const l = D().links.find((x) => x.token === dm[1]);
      if (!linkOpen(l)) return send(res, 404, { error: "Ҳавола топилмади ёки муддати тугаган" });
      const f = D().files.find((x) => x.id === l.deck);
      if (!dm[2] && method === "GET") return send(res, 200, { title: f.name, needEmail: !!l.email, download: !!l.download, note: l.note || "" });
      if (dm[2] === "/open" && method === "POST") {
        if (tooMany(ip, "dk", 40)) return send(res, 429, { error: "Жуда кўп сўров" });
        const body = await readBody(req, 4 * 1024);
        const email = cleanText(body.email, 120).toLowerCase();
        if (l.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return send(res, 400, { error: "Электрон почтангизни киритинг" });
        const v = { id: newId(), link: l.token, deck: l.deck, at: now(), last: now(), email: l.email ? email : "", ipHash: crypto.createHash("sha256").update("dk|" + ip).digest("hex").slice(0, 16),
          place: placeOf(ip) || "", dev: devOf(req), pages: 0, maxPage: 0, ms: 0, per: {} };
        D().views.push(v);
        if (D().views.length > MAX_VIEWS) D().views.splice(0, D().views.length - MAX_VIEWS);
        save();
        return send(res, 201, { view: v.id, file: `/api/deck/${l.token}/file?v=${v.id}` });
      }
      if (dm[2] === "/file" && (method === "GET" || method === "HEAD")) {
        const vid = new URL(req.url, "http://x").searchParams.get("v") || "";
        if (!D().views.some((x) => x.id === vid && x.link === l.token)) return send(res, 403, { error: "Аввал ҳаволани очинг" });
        return fs.readFile(deckFile(f.id), (err, data) => {
          if (err) return send(res, 404, { error: "Файл топилмади (сервер диски тозаланган бўлиши мумкин)" });
          res.writeHead(200, { "Content-Type": "application/pdf", "Cache-Control": "private, no-store", "Content-Disposition": `${l.download ? "attachment" : "inline"}; filename="${f.id}.pdf"`, "X-Robots-Tag": "noindex" });
          res.end(method === "HEAD" ? undefined : data);
        });
      }
      if (dm[2] === "/ping" && method === "POST") {
        if (tooMany(ip, "dp", 600)) return send(res, 429, { error: "Жуда кўп сўров" });
        const body = await readBody(req, 4 * 1024);
        const v = D().views.find((x) => x.id === String(body.view || "") && x.link === l.token);
        if (!v) return send(res, 404, { error: "Кўриш топилмади" });
        const pages = num(body.pages, 0, 500), page = num(body.page, 1, Math.max(1, pages || 500)), ms = num(body.ms, 0, 120000);
        if (pages) v.pages = pages;
        v.maxPage = Math.max(v.maxPage, page);
        v.per[page] = (v.per[page] || 0) + ms;
        v.ms += ms; v.last = now();
        lazyDirty = true;
        return send(res, 200, { ok: true });
      }
      return send(res, 405, { error: "Method not allowed" });
    }
    return null;
  }

  /* ---------- Бошқарув маркази API ---------- */
  async function adminApi(req, res, pathname) {
    if (!isAdmin(req)) return send(res, 401, { error: "Админ сифатида киринг" });
    const method = req.method, q = new URL(req.url, "http://x").searchParams;

    if (pathname === "/api/admin/survey" && method === "GET") {
      return send(res, 200, { responses: db.survey.slice().reverse().map(({ vh, ...r }) => r), total: db.survey.length });
    }
    if (pathname === "/api/admin/survey/delete" && method === "POST") {
      const body = await readBody(req, 2 * 1024);
      const n = db.survey.length;
      db.survey = db.survey.filter((x) => x.id !== String(body.id || ""));
      save();
      return send(res, 200, { ok: true, removed: n - db.survey.length });
    }

    if (pathname === "/api/admin/ux" && method === "GET") return send(res, 200, uxReport(q));
    if (pathname === "/api/admin/ux/clear" && method === "POST") {
      db.ux = { clicks: [], scroll: {}, sessions: [] };
      save();
      adminLog(req, true, "UX маълумотлари тозаланди");
      return send(res, 200, { ok: true });
    }

    if (pathname === "/api/admin/deck" && method === "GET") {
      const origin = publicOrigin(req);
      return send(res, 200, {
        files: D().files.map((f) => ({ ...f, exists: fs.existsSync(deckFile(f.id)) })),
        links: D().links.map((l) => ({ ...l, url: origin + "/d/" + l.token, open: linkOpen(l), ...linkStats(l) })).reverse(),
        recentViews: D().views.filter((v) => v.at > now() - DAY).length
      });
    }
    if (pathname === "/api/admin/deck/upload" && method === "POST") {
      const name = cleanText(q.get("name"), 120) || "Pitch deck";
      let buf;
      try { buf = await readRaw(req, DECK_MAX); } catch (e) { return send(res, 413, { error: `Файл жуда катта (энг кўпи ${Math.round(DECK_MAX / 1048576)} МБ)` }); }
      if (buf.length < 100 || buf.slice(0, 5).toString("latin1") !== "%PDF-") return send(res, 400, { error: "Фақат PDF файл юкланг" });
      fs.mkdirSync(DECK_DIR, { recursive: true });
      const id = newId();
      fs.writeFileSync(deckFile(id), buf);
      D().files.push({ id, name, at: now(), size: buf.length });
      save();
      adminLog(req, true, "тақдимот юкланди: " + name);
      return send(res, 201, { ok: true, id });
    }
    const fm = /^\/api\/admin\/deck\/file\/([a-f0-9]{16})$/.exec(pathname);
    if (fm && method === "POST") {
      const body = await readBody(req, 4 * 1024);
      const f = D().files.find((x) => x.id === fm[1]);
      if (!f) return send(res, 404, { error: "Топилмади" });
      if (body.action === "rename") { const n = cleanText(body.name, 120); if (!n) return send(res, 400, { error: "Номини киритинг" }); f.name = n; }
      else if (body.action === "delete") {
        D().files = D().files.filter((x) => x !== f);
        D().links.forEach((l) => { if (l.deck === f.id) l.on = false; });
        try { fs.unlinkSync(deckFile(f.id)); } catch (e) { /* йўқ */ }
        adminLog(req, true, "тақдимот ўчирилди: " + f.name);
      } else return send(res, 400, { error: "Нотўғри амал" });
      save();
      return send(res, 200, { ok: true });
    }
    if (pathname === "/api/admin/deck/link" && method === "POST") {
      const body = await readBody(req, 4 * 1024);
      if (!D().files.some((f) => f.id === body.deck)) return send(res, 400, { error: "Аввал тақдимот (PDF) юкланг ва танланг" });
      const label = cleanText(body.label, 120);
      if (!label) return send(res, 400, { error: "Кимга берилаётганини ёзинг (масалан: «UzVC фонди, Азиз»)" });
      const days = num(body.days, 0, 365);
      const l = { token: crypto.randomBytes(12).toString("base64url"), deck: body.deck, label, at: now(), on: true, email: !!body.email, download: !!body.download,
        until: days ? now() + days * DAY : 0, note: cleanText(body.note, 300) };
      D().links.push(l);
      save();
      return send(res, 201, { ok: true, token: l.token, url: publicOrigin(req) + "/d/" + l.token });
    }
    const lm = /^\/api\/admin\/deck\/link\/([A-Za-z0-9_-]{16,40})$/.exec(pathname);
    if (lm) {
      const l = D().links.find((x) => x.token === lm[1]);
      if (!l) return send(res, 404, { error: "Ҳавола топилмади" });
      if (method === "GET") {
        const views = D().views.filter((v) => v.link === l.token).slice().reverse();
        const pages = Math.max(0, ...views.map((v) => v.pages || 0));
        const per = Array.from({ length: pages }, (_, i) => {
          const ms = views.map((v) => v.per[i + 1] || 0);
          const seen = ms.filter((x) => x > 0).length;
          return { page: i + 1, seen, avgMs: seen ? Math.round(ms.reduce((a, b) => a + b, 0) / seen) : 0 };
        });
        return send(res, 200, { link: { ...l, url: publicOrigin(req) + "/d/" + l.token, ...linkStats(l) }, per,
          views: views.map(({ ipHash, per: p, ...v }) => v) });
      }
      if (method === "POST") {
        const body = await readBody(req, 2 * 1024);
        if (body.action === "on" || body.action === "off") l.on = body.action === "on";
        else if (body.action === "delete") { D().links = D().links.filter((x) => x !== l); D().views = D().views.filter((v) => v.link !== l.token); }
        else return send(res, 400, { error: "Нотўғри амал" });
        save();
        return send(res, 200, { ok: true });
      }
    }
    return null;
  }

  return {
    api, adminApi,
    isDeckPage: (pathname) => /^\/d\/[A-Za-z0-9_-]{16,40}$/.test(pathname),
    stats: () => ({ survey: db.survey.length, uxClicks: db.ux.clicks.length, uxSessions: db.ux.sessions.length, decks: db.decks.files.length, deckLinks: db.decks.links.length, deckViews: db.decks.views.length })
  };
};
module.exports.TOKEN_RE = TOKEN_RE;
