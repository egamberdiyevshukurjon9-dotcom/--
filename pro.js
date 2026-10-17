/* Экомун — PRO обуна, тўлов тизими ва шахсий AI агент.
   server.js томонидан ишлатилади: require("./pro")(ctx) → { api, publicPro, aiDailyLimit, onPurge, csv }.

   Тўлов усуллари (ҳаммаси муҳит ўзгарувчилари орқали ёқилади, коддаги махфий қиймат йўқ):
     • Payme (Paycom Merchant API, JSON-RPC):  PAYME_MERCHANT_ID, PAYME_KEY (тестда PAYME_TEST_KEY)
       Payme кабинетида «Endpoint URL» = https://сайт/api/pay/payme, ҳисоб майдони: order_id
     • Click (SHOP API):  CLICK_SERVICE_ID, CLICK_MERCHANT_ID, CLICK_SECRET_KEY
       Click кабинетида Prepare URL = https://сайт/api/pay/click/prepare,
                        Complete URL = https://сайт/api/pay/click/complete
     • Қўлда тасдиқлаш: PAY_MANUAL_INFO — карта ёки ҳисоб рақами (масалан «Humo 9860 … · Ф.И.Ш.»).
       Фойдаланувчи чек маълумотини юборади, админ «Тўловлар» бўлимида тасдиқлайди.
     • PAY_SANDBOX=1 — синов режими: Payme тест кассаси (checkout.test.paycom.uz) ва PAYME_TEST_KEY,
       сайтда «🧪 Синов тўлови» тугмаси (ҳақиқий пулсиз PRO ни улайди). Ишлаб чиқаришда ёқманг!
   Нархлар: PRO_PRICE_MONTH (асл 25 000 сўм), PRO_PRICE_YEAR (асл 199 000 сўм).
   AI агент: AGENT_MONTHLY_LIMIT (асл 60 хабар/ой), AGENT_MODEL (асл ANTHROPIC_MODEL), AI_PRO_DAILY_LIMIT (Эко-кўз, асл 30/кун).

   Қоидалар: PRO ни фақат 18 ёшдан катта ҳисоб сотиб олади (ўзига ёки 13+ ёшли фарзанд/ўқувчисининг
   ҳисобига совға). Android иловасидан (User-Agent «EkomunApp/») буюртма яратилмайди — Google Play
   қоидаси: иловада ташқи тўлов йўқ, PRO фақат сайтда сотиб олинади ва иловада ўзи очилади. */
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

module.exports = function pro(ctx) {
  const { db, save, send, readBody, currentUser, isAdmin, newId, now, logEvent, clientIp, publicOrigin, cleanText, getAi, Anthropic, AI_MODEL, DATA_DIR, aiGlobal } = ctx;
  const env = process.env;
  const DAY = 864e5;
  const SANDBOX = env.PAY_SANDBOX === "1";
  const PAYME_MID = String(env.PAYME_MERCHANT_ID || "").trim();
  const PAYME_KEY = String((SANDBOX ? env.PAYME_TEST_KEY || env.PAYME_KEY : env.PAYME_KEY) || "");
  const CLICK_SID = String(env.CLICK_SERVICE_ID || "").trim();
  const CLICK_MID = String(env.CLICK_MERCHANT_ID || "").trim();
  const CLICK_KEY = String(env.CLICK_SECRET_KEY || "");
  const MANUAL_INFO = String(env.PAY_MANUAL_INFO || "").trim().slice(0, 300);
  const AGENT_LIMIT = Math.max(1, Number(env.AGENT_MONTHLY_LIMIT) || 60);
  const AGENT_MODEL = env.AGENT_MODEL || AI_MODEL;
  const AI_PRO_DAILY = Math.max(1, Number(env.AI_PRO_DAILY_LIMIT) || 30);
  const PAYME_TIMEOUT = 12 * 60 * 60 * 1000; // Payme: яратилган транзакция 12 соатда бажарилмаса бекор қилинади
  const RECEIPT_DIR = path.join(DATA_DIR, "receipts");

  for (const k of ["orders", "paymeTx", "leads"]) if (!Array.isArray(db[k])) db[k] = [];

  const PLANS = {
    pro_1m: { id: "pro_1m", days: 30, price: Math.round(Number(env.PRO_PRICE_MONTH) || 25000), name: "PRO · 1 ой" },
    pro_12m: { id: "pro_12m", days: 365, price: Math.round(Number(env.PRO_PRICE_YEAR) || 199000), name: "PRO · 1 йил" }
  };
  /* Ташкилотлар учун тарифлар (даромад режасидаги нархлар) — шартнома ва банк ўтказмаси орқали */
  const ORG_PLANS = [
    { id: "maktab", price: 2400000, per: "йил", name: "Мактаб" },
    { id: "tuman", price: 1800000, per: "мактаб/йил", name: "Туман (20+ мактаб)" },
    { id: "kafedra", price: 8000000, per: "йил", name: "ОТМ кафедраси" },
    { id: "otm", price: 30000000, per: "йил", name: "Университет (ОТМ)" },
    { id: "korxona", price: 150000, per: "ходим", name: "Корхона курси" }
  ];
  const LEAD_KINDS = ORG_PLANS.map((p) => p.id).concat("boshqa");

  const providers = () => ({ payme: !!(PAYME_MID && PAYME_KEY), click: !!(CLICK_SID && CLICK_MID && CLICK_KEY), manual: !!MANUAL_INFO, test: SANDBOX });

  /* ---------- Ёрдамчилар ---------- */
  const ageOf = (u) => { if (!u || !u.by) return 0; const d = new Date(); return d.getFullYear() - u.by - (d.getMonth() + 1 <= (u.bm || 1) ? 1 : 0); };
  const isApp = (req) => /EkomunApp\//.test(String(req.headers["user-agent"] || ""));
  const proActive = (u) => !!(u && u.pro && u.pro.until > now());
  const monthKey = () => new Date().toISOString().slice(0, 7);
  const agentUsed = (u) => (u && u.agentUse && u.agentUse.m === monthKey() ? u.agentUse.n : 0);
  const stageOf = (u) => (ageOf(u) >= 16 ? "uni" : "maktab");
  function publicPro(u) {
    if (!u) return null;
    const p = u.pro || {};
    return { active: proActive(u), until: p.until || 0, plan: p.plan || "", since: p.since || 0 };
  }
  function findUserByLogin(raw) {
    const s = String(raw || "").trim().toLowerCase();
    if (!s) return null;
    const digits = s.replace(/[^\d]/g, "");
    return db.users.find((u) => u.email === s) ||
      (digits.length >= 9 ? db.users.find((u) => u.kind === "phone" && String(u.email).replace(/[^\d]/g, "").endsWith(digits.slice(-9))) : null) || null;
  }
  function newOrderId() {
    let id;
    do id = String(Date.now()).slice(-8) + String(crypto.randomInt(100, 1000)); while (db.orders.some((o) => o.id === id));
    return id;
  }
  const userOf = (id) => db.users.find((u) => u.id === id) || null;
  const orderView = (o) => ({ id: o.id, plan: o.plan, name: (PLANS[o.plan] || {}).name || o.plan, amount: o.amount, provider: o.provider, status: o.status,
    createdAt: o.createdAt, paidAt: o.paidAt || 0, gift: !!o.gift, forName: o.gift ? ((userOf(o.uid) || {}).name || "") : "", note: o.reject || "" });

  /* PRO ни улаш: муддат охиридан (ёки ҳозирдан) қўшилади */
  function grant(o) {
    const u = userOf(o.uid);
    if (!u) return;
    const days = o.days || (PLANS[o.plan] || {}).days || 30;
    const base = Math.max(now(), (u.pro && u.pro.until) || 0);
    u.pro = { plan: o.plan, until: base + days * DAY, since: (u.pro && u.pro.since) || now() };
    logEvent("pro", u, null, { note: `${o.provider}:${o.id}:+${days}` });
  }
  function revoke(o) {
    const u = userOf(o.uid);
    if (!u || !u.pro) return;
    const days = o.days || (PLANS[o.plan] || {}).days || 30;
    u.pro.until = Math.max(now(), u.pro.until - days * DAY);
    if (u.pro.until <= now()) u.pro.until = 0;
    logEvent("pro", u, null, { note: `${o.provider}:${o.id}:-${days}` });
  }
  function markPaid(o, extra = {}) {
    if (o.status === "paid") return;
    o.status = "paid"; o.paidAt = now(); Object.assign(o, extra);
    grant(o);
    save();
  }

  /* ---------- Хом сўров танаси (Click формаси учун) ---------- */
  function readRaw(req, limit = 16 * 1024) {
    return new Promise((resolve, reject) => {
      let size = 0; const chunks = [];
      req.on("data", (c) => { size += c.length; if (size > limit) { req.removeAllListeners("data"); req.resume(); reject(new Error("too_large")); return; } chunks.push(c); });
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      req.on("error", reject);
    });
  }
  async function readForm(req) {
    const raw = await readRaw(req);
    if (/json/i.test(String(req.headers["content-type"] || ""))) { try { const v = JSON.parse(raw || "{}"); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } }
    return Object.fromEntries(new URLSearchParams(raw));
  }

  /* ---------- Payme Merchant API ---------- */
  const PM_ERR = {
    auth: [-32504, "Недостаточно привилегий", "Ruxsat yo‘q", "Insufficient privileges"],
    method: [-32601, "Метод не найден", "Metod topilmadi", "Method not found"],
    parse: [-32700, "Ошибка разбора JSON", "JSON xato", "Parse error"],
    amount: [-31001, "Неверная сумма", "Noto‘g‘ri summa", "Wrong amount"],
    notx: [-31003, "Транзакция не найдена", "Tranzaksiya topilmadi", "Transaction not found"],
    cancel: [-31007, "Невозможно отменить транзакцию", "Tranzaksiyani bekor qilib bo‘lmaydi", "Unable to cancel transaction"],
    perform: [-31008, "Невозможно выполнить операцию", "Amalni bajarib bo‘lmaydi", "Unable to perform operation"],
    order: [-31050, "Заказ не найден", "Buyurtma topilmadi", "Order not found"],
    busy: [-31051, "Заказ уже оплачен или ожидает оплаты", "Buyurtma to‘langan yoki to‘lov kutilmoqda", "Order is already paid or pending"]
  };
  const pmErr = (id, k, data) => { const [code, ru, uz, en] = PM_ERR[k]; return { jsonrpc: "2.0", id, error: { code, message: { ru, uz, en }, data: data || null } }; };
  const pmOk = (id, result) => ({ jsonrpc: "2.0", id, result });
  const pmTxView = (t) => ({ id: t.id, time: t.time, amount: t.amount, account: { order_id: t.order }, create_time: t.create_time, perform_time: t.perform_time || 0,
    cancel_time: t.cancel_time || 0, transaction: t.order, state: t.state, reason: t.reason == null ? null : t.reason });
  function pmAuthOk(req) {
    const h = String(req.headers.authorization || "");
    const m = /^Basic\s+(.+)$/i.exec(h);
    if (!m || !PAYME_KEY) return false;
    const dec = Buffer.from(m[1], "base64").toString("utf8");
    const pass = dec.slice(dec.indexOf(":") + 1);
    const a = Buffer.from(pass), b = Buffer.from(PAYME_KEY);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  function pmCheckOrder(id, params) {
    const oid = String((params.account || {}).order_id || "");
    const o = db.orders.find((x) => x.id === oid && x.provider === "payme");
    if (!o) return { err: pmErr(id, "order", "order_id") };
    if (Math.round(Number(params.amount)) !== o.amount * 100) return { err: pmErr(id, "amount") };
    if (o.status !== "new") return { err: pmErr(id, "busy", "order_id") };
    return { o };
  }
  function pmExpire(t) {
    if (t.state === 1 && now() - t.create_time > PAYME_TIMEOUT) {
      t.state = -1; t.reason = 4; t.cancel_time = now();
      const o = db.orders.find((x) => x.id === t.order);
      if (o && o.status === "new" && o.pmTx === t.id) o.pmTx = "";
      save();
      return true;
    }
    return false;
  }
  function payme(body) {
    const id = body.id == null ? null : body.id;
    const params = body.params && typeof body.params === "object" ? body.params : {};
    switch (body.method) {
      case "CheckPerformTransaction": {
        const r = pmCheckOrder(id, params);
        if (r.err) return r.err;
        if (r.o.pmTx) { const t = db.paymeTx.find((x) => x.id === r.o.pmTx); if (t && t.state === 1 && !pmExpire(t)) return pmErr(id, "busy", "order_id"); }
        const res = { allow: true };
        /* Фискал чек (ОФД) учун: Payme кабинетида фискаллаштириш ёқилган бўлса PAYME_IKPU ва PAYME_PACKAGE_CODE беринг */
        if (env.PAYME_IKPU) res.detail = { receipt_type: 0, items: [{ title: (PLANS[r.o.plan] || {}).name || "Ekomun PRO", price: r.o.amount * 100, count: 1, code: String(env.PAYME_IKPU), package_code: String(env.PAYME_PACKAGE_CODE || ""), vat_percent: Number(env.PAYME_VAT_PERCENT) || 0 }] };
        return pmOk(id, res);
      }
      case "CreateTransaction": {
        const tid = String(params.id || "");
        if (!tid) return pmErr(id, "perform");
        const ex = db.paymeTx.find((x) => x.id === tid);
        if (ex) {
          if (ex.state !== 1) return pmErr(id, "perform");
          if (pmExpire(ex)) return pmErr(id, "perform");
          return pmOk(id, { create_time: ex.create_time, transaction: ex.order, state: ex.state });
        }
        const r = pmCheckOrder(id, params);
        if (r.err) return r.err;
        if (r.o.pmTx) { const t = db.paymeTx.find((x) => x.id === r.o.pmTx); if (t && t.state === 1 && !pmExpire(t)) return pmErr(id, "busy", "order_id"); }
        const t = { id: tid, time: Math.round(Number(params.time) || now()), amount: Math.round(Number(params.amount)), order: r.o.id, create_time: now(), perform_time: 0, cancel_time: 0, state: 1, reason: null };
        db.paymeTx.push(t);
        r.o.pmTx = tid;
        save();
        return pmOk(id, { create_time: t.create_time, transaction: t.order, state: 1 });
      }
      case "PerformTransaction": {
        const t = db.paymeTx.find((x) => x.id === String(params.id || ""));
        if (!t) return pmErr(id, "notx");
        if (t.state === 2) return pmOk(id, { transaction: t.order, perform_time: t.perform_time, state: 2 });
        if (t.state !== 1 || pmExpire(t)) return pmErr(id, "perform");
        const o = db.orders.find((x) => x.id === t.order);
        if (!o || o.status !== "new") return pmErr(id, "perform");
        t.state = 2; t.perform_time = now();
        markPaid(o, { ext: "payme:" + t.id });
        return pmOk(id, { transaction: t.order, perform_time: t.perform_time, state: 2 });
      }
      case "CancelTransaction": {
        const t = db.paymeTx.find((x) => x.id === String(params.id || ""));
        if (!t) return pmErr(id, "notx");
        const o = db.orders.find((x) => x.id === t.order);
        if (t.state === 1) {
          t.state = -1; t.cancel_time = now(); t.reason = Number(params.reason) || null;
          if (o && o.status === "new") { o.status = "cancelled"; o.pmTx = ""; }
          save();
        } else if (t.state === 2) {
          /* Тўлов қайтарилди: PRO муддати шу буюртма кунларига қисқаради */
          t.state = -2; t.cancel_time = now(); t.reason = Number(params.reason) || null;
          if (o && o.status === "paid") { o.status = "refunded"; revoke(o); }
          save();
        }
        return pmOk(id, { transaction: t.order, cancel_time: t.cancel_time, state: t.state });
      }
      case "CheckTransaction": {
        const t = db.paymeTx.find((x) => x.id === String(params.id || ""));
        if (!t) return pmErr(id, "notx");
        pmExpire(t);
        const v = pmTxView(t);
        return pmOk(id, { create_time: v.create_time, perform_time: v.perform_time, cancel_time: v.cancel_time, transaction: v.transaction, state: v.state, reason: v.reason });
      }
      case "GetStatement": {
        const from = Number(params.from) || 0, to = Number(params.to) || now();
        return pmOk(id, { transactions: db.paymeTx.filter((t) => t.time >= from && t.time <= to).map(pmTxView) });
      }
      default: return pmErr(id, "method");
    }
  }
  function paymeUrl(o, back) {
    const q = `m=${PAYME_MID};ac.order_id=${o.id};a=${o.amount * 100};l=uz;c=${back}`;
    return (SANDBOX ? "https://checkout.test.paycom.uz/" : "https://checkout.paycom.uz/") + Buffer.from(q).toString("base64");
  }

  /* ---------- Click SHOP API ---------- */
  const md5 = (s) => crypto.createHash("md5").update(s).digest("hex");
  function clickSignOk(b, withPrepare) {
    const s = String(b.click_trans_id || "") + String(b.service_id || "") + CLICK_KEY + String(b.merchant_trans_id || "") +
      (withPrepare ? String(b.merchant_prepare_id || "") : "") + String(b.amount || "") + String(b.action || "") + String(b.sign_time || "");
    const got = Buffer.from(String(b.sign_string || "").toLowerCase()), want = Buffer.from(md5(s));
    return got.length === want.length && crypto.timingSafeEqual(got, want);
  }
  function click(b, stage) {
    const base = { click_trans_id: b.click_trans_id, merchant_trans_id: b.merchant_trans_id };
    const out = (error, error_note, more = {}) => ({ ...base, ...more, error, error_note });
    if (!CLICK_KEY) return out(-8, "Not configured");
    if (String(b.service_id || "") !== CLICK_SID) return out(-1, "SIGN CHECK FAILED!");
    if (!clickSignOk(b, stage === "complete")) return out(-1, "SIGN CHECK FAILED!");
    if (String(b.action) !== (stage === "prepare" ? "0" : "1")) return out(-3, "Action not found");
    const o = db.orders.find((x) => x.id === String(b.merchant_trans_id || "") && x.provider === "click");
    if (!o) return out(-5, "User does not exist");
    if (Math.abs(Number(b.amount) - o.amount) > 0.01) return out(-2, "Incorrect parameter amount");
    if (stage === "prepare") {
      if (o.status === "paid") return out(-4, "Already paid");
      if (o.status !== "new") return out(-9, "Transaction cancelled");
      o.click = { trans_id: String(b.click_trans_id), paydoc_id: String(b.click_paydoc_id || ""), prepare_id: o.click && o.click.trans_id === String(b.click_trans_id) ? o.click.prepare_id : crypto.randomInt(1e8, 2e9) };
      save();
      return out(0, "Success", { merchant_prepare_id: o.click.prepare_id });
    }
    if (!o.click || String(o.click.prepare_id) !== String(b.merchant_prepare_id || "") || o.click.trans_id !== String(b.click_trans_id)) return out(-6, "Transaction does not exist");
    if (o.status === "paid") return out(-4, "Already paid", { merchant_confirm_id: o.click.prepare_id });
    if (o.status !== "new") return out(-9, "Transaction cancelled");
    if (Number(b.error) < 0) { o.click.error = Number(b.error); save(); return out(-9, "Transaction cancelled"); }
    markPaid(o, { ext: "click:" + o.click.trans_id });
    return out(0, "Success", { merchant_confirm_id: o.click.prepare_id });
  }
  const clickUrl = (o, back) => `https://my.click.uz/services/pay?service_id=${encodeURIComponent(CLICK_SID)}&merchant_id=${encodeURIComponent(CLICK_MID)}&amount=${o.amount}&transaction_param=${o.id}&return_url=${encodeURIComponent(back)}`;

  /* ---------- Ким сотиб ола олади ---------- */
  function buyCheck(req, u) {
    if (isApp(req)) return "Илова ичида тўлов йўқ. PRO ни сайтда расмийлаштиринг";
    if (!u) return "Аввал ҳисобга киринг";
    if ((u.by ? ageOf(u) : u.adult ? 18 : 0) < 18) return "PRO ни фақат 18 ёшдан катталар (ота-она ёки ўқитувчи) сотиб олади";
    return "";
  }

  /* ---------- Тезлик чеклови ---------- */
  const rate = new Map();
  function tooMany(key, max, ms) {
    const t = now(), r = rate.get(key);
    if (!r || t - r.first > ms) { rate.set(key, { first: t, n: 1 }); return false; }
    r.n++; return r.n > max;
  }
  setInterval(() => { const t = now(); for (const [k, r] of rate) if (t - r.first > 3600e3) rate.delete(k); }, 600e3).unref();

  /* ---------- AI агент ---------- */
  const AGENT_SYSTEM = {
    uni: `Сен «Экомун» экологик таълим платформасидаги PRO фойдаланувчининг шахсий AI агентисан (университет босқичи: талаба, ўқитувчи, мутахассис, 16 ёшдан катта).
Вазифаларинг: экология, атроф-муҳит муҳофазаси, барқарор ривожланиш, экологик ҳуқуқ (Ўзбекистон қонунчилиги), чиқиндилар, сув, ҳаво, иқлим ва экологик мониторинг бўйича тушунтириш; ўқув режа тузиш; тест ва машқ тайёрлаш; курс иши, тақдимот ва лойиҳа режаси бўйича маслаҳат.
Қоидалар:
- Фойдаланувчи қайси тилда ёзса, ўша тилда жавоб бер (ўзбек кирилл, ўзбек лотин, рус ёки инглиз). Ўзбекча ёзилса, ўзбек кириллда жавоб бер, агар у лотинда ёзмаган бўлса.
- Аниқ, илмий асосланган ва қисқа жавоб бер (одатда 250 сўздан ошмасин). Рақам ва фактлар ишончсиз бўлса, буни очиқ айт.
- Ҳуқуқий саволда умумий маълумот бер ва расмий манбани (lex.uz) текширишни тавсия қил; бу юридик маслаҳат эмас.
- Мавзу экология ва таълимдан бутунлай узоқ бўлса, хушмуомалалик билан экологияга қайтар.
- Платформа бўлимларини тавсия қилиш мумкин: «Курслар», «3D лаборатория», «Экологик ҳуқуқ», «Чиқиндилар ҳисоби», «Лойиҳалар», «Эко-кўз».`,
    maktab: `Сен «Экомун» экологик таълим платформасидаги мактаб ўқувчисининг (13–15 ёш) шахсий «Эко-устоз» ёрдамчисисан.
Вазифанг: табиат, ҳайвонлар, ўсимликлар, сув, ҳаво, чиқиндиларни саралаш, энергия тежаш ва иқлим ҳақида содда, қизиқарли ва тўғри тушунтириш; уй вазифасини ўзи бажаришига ёрдам бериш (тайёр жавоб эмас, йўл-йўриқ ва савол бер); кичик тест ва топишмоқлар тузиш.
Қоидалар:
- Фақат экология, табиат ва фан мавзуларида гаплаш. Бошқа мавзуда «Келинг, табиат ҳақида гаплашамиз» деб хушмуомалалик билан қайтар.
- Шахсий маълумот (тўлиқ исм, манзил, мактаб, телефон, расм) сўрама ва ёзилса, уни такрорлама; бундай маълумотни интернетда бермасликни эслат.
- Хавфли тажриба, олов, кимёвий модда, электр билан ишлашни тавсия қилма; тажриба фақат катталар назоратида.
- Содда сўзлар, қисқа гаплар; жавоб одатда 150 сўздан ошмасин. Мақтаб, рағбатлантир.
- Фойдаланувчи қайси тилда ёзса, ўша тилда жавоб бер.`
  };
  async function agentReply(u, messages) {
    const ai = getAi();
    const response = await ai.beta.messages.create({
      model: AGENT_MODEL,
      max_tokens: 3000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: AGENT_SYSTEM[stageOf(u)], cache_control: { type: "ephemeral" } }],
      messages
    });
    if (response.stop_reason === "refusal") return { text: stageOf(u) === "maktab" ? "Бу саволга жавоб бера олмайман. Келинг, табиат ҳақида бошқа савол беринг! 🌱" : "Бу саволга жавоб бера олмайман. Илтимос, саволни бошқача беринг.", refused: true };
    const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    return { text: text || "…", cut: response.stop_reason === "max_tokens" };
  }

  /* ---------- Чек расмини сақлаш ---------- */
  function saveReceiptImage(orderId, dataUrl) {
    const m = /^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ""));
    if (!m) return "";
    const buf = Buffer.from(m[3], "base64");
    if (buf.length > 1.5 * 1024 * 1024) return "";
    fs.mkdirSync(RECEIPT_DIR, { recursive: true });
    const file = `${orderId}.${m[2] === "jpeg" ? "jpg" : m[2]}`;
    fs.writeFileSync(path.join(RECEIPT_DIR, file), buf);
    return file;
  }

  /* ================= HTTP API ================= */
  async function api(req, res, pathname) {
    const method = req.method;

    /* --- Тўлов тизимлари колбэклари (cookie йўқ, имзо/калит билан) --- */
    if (pathname === "/api/pay/payme" && method === "POST") {
      let body;
      try { body = JSON.parse(await readRaw(req, 32 * 1024) || "{}"); } catch (e) { return send(res, 200, pmErr(null, "parse")); }
      if (!pmAuthOk(req)) return send(res, 200, pmErr(body && body.id, "auth"));
      return send(res, 200, payme(body || {}));
    }
    if ((pathname === "/api/pay/click/prepare" || pathname === "/api/pay/click/complete") && method === "POST") {
      const b = await readForm(req);
      return send(res, 200, click(b, pathname.endsWith("prepare") ? "prepare" : "complete"));
    }

    /* --- Фойдаланувчи: тарифлар, ҳолат, тарих --- */
    if (pathname === "/api/pro" && method === "GET") {
      const cur = currentUser(req), u = cur && cur.user;
      const why = buyCheck(req, u);
      return send(res, 200, {
        plans: Object.values(PLANS), org: ORG_PLANS, providers: isApp(req) ? {} : providers(), sandbox: SANDBOX && !isApp(req),
        manualInfo: isApp(req) ? "" : MANUAL_INFO,
        me: u ? { id: u.id, pro: publicPro(u), age: ageOf(u), stage: stageOf(u), canBuy: !why, why, agent: { used: agentUsed(u), limit: AGENT_LIMIT, ready: !!getAi() }, ekokozDaily: proActive(u) ? AI_PRO_DAILY : null } : null,
        orders: u ? db.orders.filter((o) => o.payer === u.id || o.uid === u.id).slice(-30).reverse().map(orderView) : []
      });
    }
    if (pathname === "/api/pro/order" && method === "POST") {
      const cur = currentUser(req), u = cur && cur.user;
      const why = buyCheck(req, u);
      if (why) return send(res, u ? 403 : 401, { error: why });
      if (tooMany("o:" + u.id, 10, 3600e3)) return send(res, 429, { error: "Жуда кўп буюртма. Бироздан сўнг уриниб кўринг" });
      const body = await readBody(req, 8 * 1024);
      const plan = PLANS[String(body.plan)];
      if (!plan) return send(res, 400, { error: "Тарифни танланг" });
      const prov = String(body.provider || "");
      const pv = providers();
      if (!pv[prov]) return send(res, 400, { error: "Бу тўлов усули ҳозир ёқилмаган" });
      let target = u, gift = false;
      if (body.gift) {
        target = findUserByLogin(body.gift);
        if (!target) return send(res, 404, { error: "Бу почта ёки телефон билан ҳисоб топилмади. Фарзандингиз (13+) аввал рўйхатдан ўтсин" });
        gift = target.id !== u.id;
      }
      /* Бир фойдаланувчида бир вақтда кўпи билан битта тўланмаган онлайн буюртма — эскиси бекор қилинади */
      for (const o of db.orders) if (o.payer === u.id && o.status === "new" && (o.provider === "payme" || o.provider === "click") && !o.pmTx) o.status = "cancelled";
      const o = { id: newOrderId(), uid: target.id, payer: u.id, plan: plan.id, days: plan.days, amount: plan.price, provider: prov, status: "new", gift, createdAt: now(), paidAt: 0, ip: clientIp(req) };
      db.orders.push(o);
      if (db.orders.length > 50000) db.orders.splice(0, db.orders.length - 50000);
      const back = publicOrigin(req) + "/#pro";
      if (prov === "test") { markPaid(o, { ext: "sandbox" }); return send(res, 201, { order: orderView(o), pro: publicPro(u) }); }
      save();
      if (prov === "payme") return send(res, 201, { order: orderView(o), url: paymeUrl(o, back) });
      if (prov === "click") return send(res, 201, { order: orderView(o), url: clickUrl(o, back) });
      return send(res, 201, { order: orderView(o), manualInfo: MANUAL_INFO });
    }
    if (pathname === "/api/pro/receipt" && method === "POST") {
      const cur = currentUser(req), u = cur && cur.user;
      if (!u) return send(res, 401, { error: "Аввал ҳисобга киринг" });
      if (tooMany("r:" + u.id, 10, 3600e3)) return send(res, 429, { error: "Жуда кўп уриниш. Бироздан сўнг уриниб кўринг" });
      const body = await readBody(req, 2.2 * 1024 * 1024);
      const o = db.orders.find((x) => x.id === String(body.id || "") && x.payer === u.id && x.provider === "manual");
      if (!o) return send(res, 404, { error: "Буюртма топилмади" });
      if (o.status !== "new" && o.status !== "rejected") return send(res, 409, { error: "Бу буюртма аллақачон кўриб чиқилмоқда" });
      const ref = cleanText(body.ref, 80);
      if (ref.length < 4) return send(res, 400, { error: "Чек рақами ёки тўлов вақтини ёзинг" });
      const file = body.image ? saveReceiptImage(o.id, body.image) : "";
      o.receipt = { method: cleanText(body.method, 30), ref, note: cleanText(body.note, 300), file, at: now() };
      o.status = "review"; o.reject = "";
      save();
      return send(res, 200, { order: orderView(o) });
    }
    if (pathname === "/api/pro/cancel" && method === "POST") {
      const cur = currentUser(req), u = cur && cur.user;
      if (!u) return send(res, 401, { error: "Аввал ҳисобга киринг" });
      const body = await readBody(req, 4 * 1024);
      const o = db.orders.find((x) => x.id === String(body.id || "") && x.payer === u.id);
      if (!o) return send(res, 404, { error: "Буюртма топилмади" });
      if (!["new", "review", "rejected"].includes(o.status) || o.pmTx) return send(res, 409, { error: "Бу буюртмани бекор қилиб бўлмайди" });
      o.status = "cancelled"; save();
      return send(res, 200, { order: orderView(o) });
    }
    if (pathname === "/api/pro/lead" && method === "POST") {
      if (tooMany("l:" + clientIp(req), 5, 3600e3)) return send(res, 429, { error: "Жуда кўп ариза. Бироздан сўнг уриниб кўринг" });
      const body = await readBody(req, 8 * 1024);
      const lead = { id: newId(), at: now(), kind: LEAD_KINDS.includes(String(body.kind)) ? String(body.kind) : "boshqa", org: cleanText(body.org, 120), name: cleanText(body.name, 80),
        contact: cleanText(body.contact, 100), count: Math.max(0, Math.min(1e6, Math.floor(Number(body.count) || 0))), note: cleanText(body.note, 600), ip: clientIp(req), status: "new" };
      if (lead.org.length < 2 || lead.contact.length < 5) return send(res, 400, { error: "Ташкилот номи ва алоқа (телефон ёки почта) ни ёзинг" });
      db.leads.push(lead);
      if (db.leads.length > 5000) db.leads.splice(0, db.leads.length - 5000);
      save();
      return send(res, 201, { ok: true });
    }

    /* --- Шахсий AI агент (фақат PRO) --- */
    if (pathname === "/api/agent" && method === "POST") {
      const cur = currentUser(req), u = cur && cur.user;
      if (!u) return send(res, 401, { error: "Аввал ҳисобга киринг" });
      if (!proActive(u)) return send(res, 402, { error: "Шахсий агент PRO обунада ишлайди" });
      if (!getAi()) return send(res, 503, { error: "AI ҳали созланмаган. Админ серверга ANTHROPIC_API_KEY ни қўшиши керак" });
      if (agentUsed(u) >= AGENT_LIMIT) return send(res, 429, { error: `Бу ойлик ${AGENT_LIMIT} та савол чеклови тугади. Кейинги ой яна давом этасиз` });
      if (aiGlobal.blocked()) return send(res, 429, { error: "Бугунги умумий чеклов тугади. Эртага қайта уриниб кўринг" });
      if (tooMany("a:" + u.id, 8, 60e3)) return send(res, 429, { error: "Бироз секинроқ: бир дақиқада 8 тадан кўп савол бериб бўлмайди" });
      const body = await readBody(req, 64 * 1024);
      const raw = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
      const msgs = [];
      let total = 0;
      for (const m of raw) {
        const role = m && m.role === "assistant" ? "assistant" : "user";
        const content = cleanText(m && m.content, 2000);
        if (!content) continue;
        total += content.length;
        if (msgs.length && msgs[msgs.length - 1].role === role) msgs[msgs.length - 1].content += "\n" + content;
        else msgs.push({ role, content });
      }
      while (msgs.length && msgs[0].role !== "user") msgs.shift();
      while (total > 12000 && msgs.length > 1) { total -= msgs.shift().content.length; while (msgs.length && msgs[0].role !== "user") total -= msgs.shift().content.length; }
      if (!msgs.length || msgs[msgs.length - 1].role !== "user") return send(res, 400, { error: "Саволингизни ёзинг" });
      const m = monthKey();
      u.agentUse = { m, n: agentUsed(u) + 1 };
      aiGlobal.count();
      save();
      try {
        const out = await agentReply(u, msgs);
        logEvent("agent", u, req, { note: stageOf(u) });
        return send(res, 200, { ...out, used: agentUsed(u), limit: AGENT_LIMIT });
      } catch (e) {
        u.agentUse.n = Math.max(0, u.agentUse.n - 1); aiGlobal.refund(); save();
        console.error("Agent error:", e.status || "", e.message);
        if (Anthropic && e instanceof Anthropic.RateLimitError) return send(res, 503, { error: "AI хизмати ҳозир банд. Бироздан сўнг уриниб кўринг" });
        return send(res, 502, { error: "Жавоб олиб бўлмади. Қайта уриниб кўринг" });
      }
    }

    /* --- Админ: тўловлар --- */
    if (pathname.startsWith("/api/admin/pay")) {
      if (!isAdmin(req)) return send(res, 401, { error: "Админ сифатида киринг" });
      if (pathname === "/api/admin/pay" && method === "GET") {
        const t = now(), monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
        /* Синов (sandbox) ва админ берган PRO тушумга кирмайди */
        const paid = db.orders.filter((o) => o.status === "paid" && o.amount > 0 && o.provider !== "test" && o.provider !== "admin");
        const sum = (l) => l.reduce((a, o) => a + o.amount, 0);
        const byProv = {}; for (const o of paid) byProv[o.provider] = (byProv[o.provider] || 0) + o.amount;
        const days = []; for (let i = 29; i >= 0; i--) { const d = new Date(t - i * DAY); d.setHours(0, 0, 0, 0); const e = d.getTime() + DAY; days.push({ d: new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10), v: sum(paid.filter((o) => o.paidAt >= d.getTime() && o.paidAt < e)) }); }
        const activeUsers = db.users.filter(proActive);
        return send(res, 200, {
          sandbox: SANDBOX, providers: providers(), manualInfo: MANUAL_INFO, plans: Object.values(PLANS), agentLimit: AGENT_LIMIT,
          stats: { revenueMonth: sum(paid.filter((o) => o.paidAt >= monthStart.getTime())), revenueTotal: sum(paid), activePro: activeUsers.length,
            review: db.orders.filter((o) => o.status === "review").length, paidCount: paid.length, newLeads: db.leads.filter((l) => l.status === "new").length,
            expiring: activeUsers.filter((u) => u.pro.until - t < 7 * DAY).length, byProvider: byProv, days },
          orders: db.orders.slice(-2000).reverse().map((o) => { const u = userOf(o.uid), p = userOf(o.payer);
            return { ...orderView(o), user: u ? { id: u.id, name: u.name, email: u.email } : null, payer: p && p !== u ? { id: p.id, name: p.name, email: p.email } : null, receipt: o.receipt || null, ext: o.ext || "", ip: o.ip || "", reject: o.reject || "", by: o.by || "" }; }),
          pro: activeUsers.map((u) => ({ id: u.id, name: u.name, email: u.email, until: u.pro.until, plan: u.pro.plan, agent: agentUsed(u) })).sort((a, b) => a.until - b.until),
          leads: db.leads.slice().reverse()
        });
      }
      const rm = /^\/api\/admin\/pay\/receipt\/(\d{8,14})$/.exec(pathname);
      if (rm && method === "GET") {
        const o = db.orders.find((x) => x.id === rm[1]);
        const file = o && o.receipt && o.receipt.file;
        if (!file || !/^[\d]+\.(jpg|png|webp)$/.test(file)) return send(res, 404, { error: "Расм йўқ" });
        return fs.readFile(path.join(RECEIPT_DIR, file), (err, data) => {
          if (err) return send(res, 404, { error: "Расм йўқ" });
          res.writeHead(200, { "Content-Type": file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
          res.end(data);
        });
      }
      const om = /^\/api\/admin\/pay\/order\/(\d{8,14})$/.exec(pathname);
      if (om && method === "POST") {
        const body = await readBody(req, 4 * 1024);
        const o = db.orders.find((x) => x.id === om[1]);
        if (!o) return send(res, 404, { error: "Буюртма топилмади" });
        const action = String(body.action || "");
        if (action === "approve") {
          if (!["review", "new", "rejected"].includes(o.status)) return send(res, 409, { error: "Бу буюртмани тасдиқлаб бўлмайди" });
          if (o.provider !== "manual") return send(res, 409, { error: "Онлайн тўлов ўзи тасдиқланади" });
          markPaid(o, { by: "admin" });
        } else if (action === "reject") {
          if (o.status !== "review" && o.status !== "new") return send(res, 409, { error: "Бу буюртмани рад этиб бўлмайди" });
          o.status = "rejected"; o.reject = cleanText(body.reason, 200) || "Тўлов топилмади"; save();
        } else if (action === "refund") {
          if (o.status !== "paid" || o.provider === "payme") return send(res, 409, { error: o.provider === "payme" ? "Payme тўловини Payme кабинетида бекор қилинг" : "Фақат тўланган буюртма" });
          o.status = "refunded"; revoke(o); save();
        } else return send(res, 400, { error: "Нотўғри амал" });
        return send(res, 200, { ok: true });
      }
      if (pathname === "/api/admin/pay/grant" && method === "POST") {
        const body = await readBody(req, 4 * 1024);
        const u = db.users.find((x) => x.id === String(body.user || "")) || findUserByLogin(body.user);
        if (!u) return send(res, 404, { error: "Фойдаланувчи топилмади" });
        const days = Math.floor(Number(body.days) || 0);
        if (days === 0 || Math.abs(days) > 3660) return send(res, 400, { error: "Кунлар сони: 1–3660 (олиб ташлаш учун манфий)" });
        if (days < 0) {
          if (!u.pro) return send(res, 409, { error: "Бу фойдаланувчида PRO йўқ" });
          u.pro.until = Math.max(0, u.pro.until + days * DAY);
          if (u.pro.until <= now()) u.pro.until = 0;
          logEvent("pro", u, null, { note: `admin:${days}` }); save();
          return send(res, 200, { ok: true, pro: publicPro(u) });
        }
        const o = { id: newOrderId(), uid: u.id, payer: u.id, plan: "admin", days, amount: 0, provider: "admin", status: "new", gift: false, createdAt: now(), paidAt: 0, note: cleanText(body.note, 200) };
        db.orders.push(o);
        markPaid(o, { by: "admin" });
        return send(res, 200, { ok: true, pro: publicPro(u) });
      }
      const lm = /^\/api\/admin\/pay\/lead\/([a-f0-9]{16})$/.exec(pathname);
      if (lm && method === "POST") {
        const body = await readBody(req, 4 * 1024);
        const l = db.leads.find((x) => x.id === lm[1]);
        if (!l) return send(res, 404, { error: "Ариза топилмади" });
        const a = String(body.action || "");
        if (a === "done" || a === "new" || a === "work") l.status = a;
        else if (a === "delete") db.leads = db.leads.filter((x) => x !== l);
        else return send(res, 400, { error: "Нотўғри амал" });
        save();
        return send(res, 200, { ok: true });
      }
      return send(res, 404, { error: "Топилмади" });
    }
    return null;
  }

  /* CSV экспорт учун қаторлар */
  function exportRows(iso) {
    return [["Буюртма", "Яратилди", "Тўланди", "Тариф", "Сумма (сўм)", "Усул", "Ҳолат", "Фойдаланувчи", "Почта / телефон", "Тўловчи", "Совға", "Чек", "Ташқи ID"],
      ...db.orders.slice().reverse().map((o) => { const u = userOf(o.uid), p = userOf(o.payer);
        return [o.id, iso(o.createdAt), iso(o.paidAt), (PLANS[o.plan] || {}).name || o.plan, o.amount, o.provider, o.status, u ? u.name : "", u ? u.email : "", p && p !== u ? p.email : "", o.gift ? "ҳа" : "", o.receipt ? o.receipt.ref : "", o.ext || ""]; })];
  }

  function onPurge(user) {
    /* Тўлов ёзувлари бухгалтерия учун қолади, лекин фойдаланувчи билан алоқаси узилади */
    for (const o of db.orders) { if (o.uid === user.id) o.uid = null; if (o.payer === user.id) o.payer = null; }
  }

  return { api, publicPro, proActive, aiDailyLimit: (u) => (proActive(u) ? AI_PRO_DAILY : null), onPurge, exportRows, PLANS };
};
