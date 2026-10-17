/* PRO ва тўлов тизимини текшириш (синов режимида, ҳақиқий пулсиз):
   Payme Merchant API (JSON-RPC), Click SHOP API (Prepare/Complete, md5 имзо), қўлда чек + админ тасдиғи,
   совға, ёш ва Android илова чекловлари, AI агентга кириш, админ «Тўловлар» бўлими.
   Ишлатиш:  node tools/pay-test.js   (npm test ичида ҳам ишлайди) */
"use strict";
const { spawn } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const PASS = "pay-" + Math.random().toString(36).slice(2);
const ADMIN = "/boshqaruv-test";
const PAYME_KEY = "test-payme-key-" + Math.random().toString(36).slice(2);
const CLICK_KEY = "click-secret-" + Math.random().toString(36).slice(2);
let base = "", child, tmp, failed = 0;
const ok = (cond, name, extra = "") => { console.log(`${cond ? "✅" : "❌"} ${name}${extra !== "" ? "  " + extra : ""}`); if (!cond) failed++; };

async function start() {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ekomun-pay-"));
  const port = 3900 + Math.floor(Math.random() * 800);
  base = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, [path.join(__dirname, "..", "server.js")], {
    env: { ...process.env, PORT: String(port), DATA_DIR: tmp, ADMIN_PASSWORD: PASS, ADMIN_PATH: ADMIN, ADMIN_TOTP_SECRET: "", ADMIN_HOST: "", ADMIN_ALLOW_IPS: "",
      ENV_FILE: path.join(tmp, "none.env"), ANTHROPIC_API_KEY: "", PAY_SANDBOX: "1", PAYME_MERCHANT_ID: "test-merchant", PAYME_TEST_KEY: PAYME_KEY, PAYME_KEY: "",
      CLICK_SERVICE_ID: "1111", CLICK_MERCHANT_ID: "2222", CLICK_SECRET_KEY: CLICK_KEY, PAY_MANUAL_INFO: "Humo 9860 0000 0000 0000 · Test" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stderr.on("data", (d) => process.stderr.write(d));
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base + "/api/health")).ok) return; } catch (e) { /* кутамиз */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Сервер ишга тушмади");
}

function client(ua) {
  let ck = "";
  return async (p, body, extra = {}) => {
    const h = { ...(ck ? { Cookie: ck } : {}), ...(ua ? { "User-Agent": ua } : {}), ...(extra.headers || {}) };
    if (body !== undefined && !extra.raw) h["Content-Type"] = "application/json";
    const r = await fetch(base + p, { method: body === undefined ? "GET" : "POST", headers: h, body: body === undefined ? undefined : extra.raw ? body : JSON.stringify(body) });
    const sc = r.headers.get("set-cookie"); if (sc) ck = sc.split(";")[0];
    const t = await r.text(); let j = {}; try { j = JSON.parse(t); } catch (e) { j = { text: t }; }
    return { s: r.status, j };
  };
}
const year = new Date().getFullYear();
async function register(c, name, email, by) {
  const r = await c("/api/register", { name, email, password: "parol123", birthYear: by, birthMonth: 1 });
  return r;
}
const paymeAuth = (key) => ({ Authorization: "Basic " + Buffer.from("Paycom:" + key).toString("base64") });

async function main() {
  await start();
  console.log("Текширилмоқда: " + base);
  const adult = client(), teen = client(), app = client("Mozilla/5.0 (Linux; Android 14) EkomunApp/3.0"), anon = client(), adm = client();

  ok((await register(adult, "Ота", "ota@test.uz", year - 35)).s === 201, "Катта ёшли ҳисоб");
  ok((await register(teen, "Ўқувчи", "oquvchi@test.uz", year - 14)).s === 201, "14 ёшли ўқувчи ҳисоби");
  await app("/api/login", { email: "ota@test.uz", password: "parol123" });

  let r = await adult("/api/pro");
  ok(r.s === 200 && r.j.me && r.j.me.canBuy && r.j.providers.payme && r.j.providers.click && r.j.providers.manual && r.j.providers.test, "Катта ёшли сотиб ола олади, 4 усул ёқилган");
  ok(r.j.plans.find((p) => p.id === "pro_1m").price === 25000 && r.j.plans.find((p) => p.id === "pro_12m").price === 199000, "Нархлар: 25 000 / 199 000 сўм");
  r = await teen("/api/pro");
  ok(r.j.me && !r.j.me.canBuy, "14 ёшлига тўлов таклифи йўқ");
  r = await teen("/api/pro/order", { plan: "pro_1m", provider: "test" });
  ok(r.s === 403, "14 ёшли буюртма яратолмайди", r.s);
  r = await app("/api/pro");
  ok(r.s === 200 && !Object.keys(r.j.providers).length && !r.j.manualInfo, "Android иловада тўлов усуллари кўрсатилмайди");
  r = await app("/api/pro/order", { plan: "pro_1m", provider: "payme" });
  ok(r.s === 403, "Android иловадан буюртма йўқ (Google Play)", r.s);
  r = await anon("/api/pro/order", { plan: "pro_1m", provider: "payme" });
  ok(r.s === 401, "Кирмасдан буюртма йўқ", r.s);
  r = await anon("/api/pro");
  ok(r.s === 200 && r.j.me === null, "Меҳмонга тарифлар кўринади");

  /* ---------- Payme ---------- */
  r = await adult("/api/pro/order", { plan: "pro_1m", provider: "payme" });
  ok(r.s === 201 && /^https:\/\/checkout\.test\.paycom\.uz\//.test(r.j.url), "Payme буюртма ва тест касса ҳаволаси");
  const pmOrder = r.j.order.id;
  const dec = Buffer.from(r.j.url.split("/").pop(), "base64").toString();
  ok(dec.includes(`ac.order_id=${pmOrder}`) && dec.includes("a=2500000") && dec.includes("m=test-merchant"), "Ҳаволада order_id ва сумма тийинда", dec.split(";").slice(0, 3).join(";"));
  const pm = (method, params, key = PAYME_KEY) => anon("/api/pay/payme", { jsonrpc: "2.0", id: 7, method, params }, { headers: paymeAuth(key) });
  r = await pm("CheckPerformTransaction", { amount: 2500000, account: { order_id: pmOrder } }, "wrong");
  ok(r.j.error && r.j.error.code === -32504, "Payme: нотўғри калит → -32504");
  r = await anon("/api/pay/payme", "{bad", { raw: true, headers: { ...paymeAuth(PAYME_KEY), "Content-Type": "application/json" } });
  ok(r.j.error && r.j.error.code === -32700, "Payme: бузуқ JSON → -32700");
  r = await pm("CheckPerformTransaction", { amount: 100, account: { order_id: pmOrder } });
  ok(r.j.error && r.j.error.code === -31001, "Payme: нотўғри сумма → -31001");
  r = await pm("CheckPerformTransaction", { amount: 2500000, account: { order_id: "999" } });
  ok(r.j.error && r.j.error.code === -31050, "Payme: йўқ буюртма → -31050");
  r = await pm("CheckPerformTransaction", { amount: 2500000, account: { order_id: pmOrder } });
  ok(r.j.result && r.j.result.allow === true, "Payme: CheckPerformTransaction allow");
  const t0 = Date.now();
  r = await pm("CreateTransaction", { id: "pm-tx-1", time: t0, amount: 2500000, account: { order_id: pmOrder } });
  ok(r.j.result && r.j.result.state === 1 && r.j.result.transaction === pmOrder, "Payme: CreateTransaction state 1");
  const ct = r.j.result.create_time;
  r = await pm("CreateTransaction", { id: "pm-tx-1", time: t0, amount: 2500000, account: { order_id: pmOrder } });
  ok(r.j.result && r.j.result.create_time === ct, "Payme: такрорий CreateTransaction — ўша жавоб");
  r = await pm("CreateTransaction", { id: "pm-tx-2", time: t0, amount: 2500000, account: { order_id: pmOrder } });
  ok(r.j.error && r.j.error.code <= -31050 && r.j.error.code >= -31099, "Payme: бошқа транзакция ўша буюртмага → банд", r.j.error && r.j.error.code);
  r = await pm("PerformTransaction", { id: "pm-tx-x" });
  ok(r.j.error && r.j.error.code === -31003, "Payme: йўқ транзакция → -31003");
  r = await pm("PerformTransaction", { id: "pm-tx-1" });
  ok(r.j.result && r.j.result.state === 2, "Payme: PerformTransaction state 2");
  r = await pm("PerformTransaction", { id: "pm-tx-1" });
  ok(r.j.result && r.j.result.state === 2, "Payme: такрорий Perform — ўша жавоб");
  r = await adult("/api/me");
  ok(r.j.user.pro && r.j.user.pro.active && r.j.user.pro.until > Date.now() + 29 * 864e5, "PRO автоматик уланди (30 кун)");
  r = await pm("CheckTransaction", { id: "pm-tx-1" });
  ok(r.j.result && r.j.result.state === 2 && r.j.result.perform_time > 0, "Payme: CheckTransaction");
  r = await pm("GetStatement", { from: t0 - 1000, to: Date.now() + 1000 });
  ok(r.j.result && r.j.result.transactions.some((x) => x.id === "pm-tx-1"), "Payme: GetStatement");
  r = await pm("CancelTransaction", { id: "pm-tx-1", reason: 5 });
  ok(r.j.result && r.j.result.state === -2, "Payme: тўловни қайтариш state -2");
  r = await adult("/api/me");
  ok(r.j.user.pro && !r.j.user.pro.active, "Қайтарилгач PRO ўчди");
  r = await pm("Foo", {});
  ok(r.j.error && r.j.error.code === -32601, "Payme: номаълум метод → -32601");

  /* Payme: тўланмасдан бекор қилиш */
  r = await adult("/api/pro/order", { plan: "pro_12m", provider: "payme" });
  const pm2 = r.j.order.id;
  await pm("CreateTransaction", { id: "pm-tx-3", time: Date.now(), amount: 19900000, account: { order_id: pm2 } });
  r = await pm("CancelTransaction", { id: "pm-tx-3", reason: 3 });
  ok(r.j.result && r.j.result.state === -1, "Payme: Perform'гача бекор → state -1");
  r = await pm("PerformTransaction", { id: "pm-tx-3" });
  ok(r.j.error && r.j.error.code === -31008, "Payme: бекор қилинганни бажариб бўлмайди → -31008");

  /* ---------- Click ---------- */
  r = await adult("/api/pro/order", { plan: "pro_1m", provider: "click" });
  ok(r.s === 201 && r.j.url.startsWith("https://my.click.uz/services/pay?service_id=1111&merchant_id=2222&amount=25000&transaction_param=" + r.j.order.id), "Click ҳаволаси");
  const ckOrder = r.j.order.id;
  const md5 = (s) => crypto.createHash("md5").update(s).digest("hex");
  const st = "2026-10-17 10:00:00";
  const prep = { click_trans_id: "555", service_id: "1111", click_paydoc_id: "777", merchant_trans_id: ckOrder, amount: "25000.00", action: "0", error: "0", error_note: "Success", sign_time: st };
  const form = (o) => new URLSearchParams(o).toString();
  const formH = { headers: { "Content-Type": "application/x-www-form-urlencoded" }, raw: true };
  r = await anon("/api/pay/click/prepare", form({ ...prep, sign_string: "bad" }), formH);
  ok(r.j.error === -1, "Click: нотўғри имзо → -1");
  r = await anon("/api/pay/click/prepare", form({ ...prep, amount: "100", sign_string: md5("555" + "1111" + CLICK_KEY + ckOrder + "100" + "0" + st) }), formH);
  ok(r.j.error === -2, "Click: нотўғри сумма → -2");
  r = await anon("/api/pay/click/prepare", form({ ...prep, sign_string: md5("555" + "1111" + CLICK_KEY + ckOrder + "25000.00" + "0" + st) }), formH);
  ok(r.j.error === 0 && r.j.merchant_prepare_id > 0, "Click: Prepare муваффақиятли");
  const prepId = String(r.j.merchant_prepare_id);
  const comp = { ...prep, action: "1", merchant_prepare_id: prepId };
  r = await anon("/api/pay/click/complete", form({ ...comp, sign_string: md5("555" + "1111" + CLICK_KEY + ckOrder + prepId + "25000.00" + "1" + st) }), formH);
  ok(r.j.error === 0 && String(r.j.merchant_confirm_id) === prepId, "Click: Complete муваффақиятли");
  r = await anon("/api/pay/click/complete", form({ ...comp, sign_string: md5("555" + "1111" + CLICK_KEY + ckOrder + prepId + "25000.00" + "1" + st) }), formH);
  ok(r.j.error === -4, "Click: такрорий тўлов → -4 (аллақачон тўланган)");
  r = await adult("/api/me");
  const untilClick = r.j.user.pro.until;
  ok(r.j.user.pro.active, "Click орқали PRO уланди");

  /* ---------- Қўлда: чек + админ тасдиғи ---------- */
  r = await adult("/api/pro/order", { plan: "pro_12m", provider: "manual" });
  ok(r.s === 201 && r.j.manualInfo.includes("Humo"), "Қўлда тўлов: реквизитлар берилди");
  const mOrder = r.j.order.id;
  r = await adult("/api/pro/receipt", { id: mOrder, method: "Payme", ref: "12" });
  ok(r.s === 400, "Чек рақами жуда қисқа — рад", r.s);
  const png = "data:image/png;base64," + Buffer.from("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8cfc0f01f0005000201a5f1bc6d0000000049454e44ae426082", "hex").toString("base64");
  r = await adult("/api/pro/receipt", { id: mOrder, method: "Payme", ref: "CHK-2026-1017", note: "тест", image: png });
  ok(r.s === 200 && r.j.order.status === "review", "Чек юборилди → текширишда");
  r = await adm("/api/admin/login", { password: PASS });
  ok(r.s === 200, "Админ кирди");
  r = await adm("/api/admin/pay");
  ok(r.s === 200 && r.j.stats.review === 1 && r.j.sandbox === true, "Админ: 1 та чек текширишда, синов режими кўринади");
  r = await anon("/api/admin/pay");
  ok(r.s === 401, "Кирмасдан тўловлар кўринмайди", r.s);
  r = await adm("/api/admin/pay/receipt/" + mOrder);
  ok(r.s === 200, "Админ чек расмини кўради", r.s);
  r = await adm("/api/admin/pay/order/" + mOrder, { action: "approve" });
  ok(r.s === 200, "Админ тасдиқлади");
  r = await adult("/api/me");
  ok(r.j.user.pro.until - untilClick > 364 * 864e5, "Йиллик PRO муддатга қўшилди (+365 кун)");

  /* ---------- Совға (ота-она → 14 ёшли) ---------- */
  r = await adult("/api/pro/order", { plan: "pro_1m", provider: "test", gift: "yoq@test.uz" });
  ok(r.s === 404, "Йўқ ҳисобга совға — 404", r.s);
  r = await adult("/api/pro/order", { plan: "pro_1m", provider: "test", gift: "oquvchi@test.uz" });
  ok(r.s === 201 && r.j.order.gift, "Ота-она 14 ёшлига PRO совға қилди");
  r = await teen("/api/me");
  ok(r.j.user.pro.active, "14 ёшлида PRO фаол");

  /* ---------- AI агент ---------- */
  r = await anon("/api/agent", { messages: [{ role: "user", content: "Салом" }] });
  ok(r.s === 401, "Агент: кирмаган → 401", r.s);
  const plain = client();
  await register(plain, "Оддий", "oddiy@test.uz", year - 25);
  r = await plain("/api/agent", { messages: [{ role: "user", content: "Салом" }] });
  ok(r.s === 402, "Агент: PRO йўқ → 402", r.s);
  r = await teen("/api/agent", { messages: [{ role: "user", content: "Салом" }] });
  ok(r.s === 503, "Агент: PRO бор, калит йўқ → 503 (созланмаган)", r.s);

  /* ---------- Админ: қўлда PRO, ариза, CSV ---------- */
  r = await adm("/api/admin/pay/grant", { user: "oddiy@test.uz", days: 7, note: "ғолиб" });
  ok(r.s === 200 && r.j.pro.active, "Админ 7 кунлик PRO берди");
  r = await adm("/api/admin/pay/grant", { user: "oddiy@test.uz", days: -7 });
  ok(r.s === 200 && !r.j.pro.active, "Админ PRO ни олиб ташлади");
  r = await anon("/api/pro/lead", { kind: "maktab", org: "12-мактаб", name: "Директор", contact: "+998901234567", count: 800 });
  ok(r.s === 201, "Мактаб аризаси қабул қилинди");
  r = await adm("/api/admin/pay");
  ok(r.j.leads.length === 1 && r.j.stats.revenueTotal === 25000 + 199000, "Админ: ариза ва тушум (тест ва қайтарилган тўловлар ҳисобланмайди)", r.j.stats.revenueTotal);
  r = await fetch(base + "/api/admin/export?type=payments", { headers: { Cookie: (await (async () => { const x = await fetch(base + "/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: PASS }) }); return x.headers.get("set-cookie").split(";")[0]; })()) } });
  const csv = await r.text();
  ok(r.ok && csv.includes(pmOrder) && csv.includes("refunded"), "Тўловлар CSV экспорти");
  r = await fetch(base + ADMIN + "/pay.js");
  ok(r.ok, "Админ pay.js файли", r.status);
  r = await fetch(base + "/vendor/eko-pro.js");
  ok(r.ok, "Платформа eko-pro.js файли", r.status);
}

main()
  .catch((e) => { console.error("❌", e.stack || e.message); failed++; })
  .finally(() => {
    if (child) child.kill("SIGTERM");
    if (tmp) setTimeout(() => fs.rmSync(tmp, { recursive: true, force: true }), 300);
    console.log(failed ? `\n${failed} та текширув ўтмади` : "\nТўлов тизими ишлаяпти ✔");
    process.exitCode = failed ? 1 : 0;
  });
