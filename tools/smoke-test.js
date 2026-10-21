/* Серверни текшириш: вақтинчалик папкада ишга тушириб, асосий саҳифалар, API ва
   бошқарув марказига киришни синайди.
   Ишлатиш:  npm test            (ўзи сервер ишга туширади)
             node tools/smoke-test.js https://sizning-sayt.uz [ADMIN_PATH]   (жойлаштирилган сайтни текшириш) */
"use strict";
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const remote = process.argv[2];
const PASS = "smoke-" + Math.random().toString(36).slice(2);
const ADMIN = remote ? (process.argv[3] || "/admin") : "/boshqaruv-test";
let base = remote ? remote.replace(/\/+$/, "") : "";
let child, tmp, failed = 0;

const ok = (cond, name, extra = "") => {
  console.log(`${cond ? "✅" : "❌"} ${name}${extra ? "  " + extra : ""}`);
  if (!cond) failed++;
};

async function start(port = 3100 + Math.floor(Math.random() * 800)) {
  tmp = tmp || fs.mkdtempSync(path.join(os.tmpdir(), "ekomun-"));
  base = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, [path.join(__dirname, "..", "server.js")], {
    env: { ...process.env, PORT: String(port), DATA_DIR: tmp, ADMIN_PASSWORD: PASS, ADMIN_PATH: ADMIN,
      ADMIN_TOTP_SECRET: "", ADMIN_HOST: "", ADMIN_ALLOW_IPS: "", ENV_FILE: path.join(tmp, "none.env") },
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stderr.on("data", (d) => process.stderr.write(d));
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base + "/api/health")).ok) return; } catch (e) {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Сервер ишга тушмади");
}

async function main() {
  if (!remote) await start();
  console.log("Текширилмоқда: " + base);
  const get = (p, o) => fetch(base + p, { redirect: "manual", ...o });

  let r = await get("/api/health");
  ok(r.ok, "/api/health", r.status);
  for (const p of ["/", "/privacy", "/tekshir", "/manifest.webmanifest", "/sw.js"]) {
    r = await get(p);
    ok(r.status === 200, "Саҳифа " + p, r.status);
  }
  for (const f of ["eko-global.css", "eko-pasport.js", "eko-yol.js", "eko-sayyora.js", "eko-ustoz.js", "eko-turnir.js", "eko-pro.js"]) {
    r = await get("/vendor/" + f);
    ok(r.status === 200, "Файл /vendor/" + f, r.status);
  }
  r = await get("/api/ob3/jwks");
  const jw = r.ok ? await r.json() : {};
  ok(r.ok && jw.keys && jw.keys[0] && jw.keys[0].crv === "Ed25519", "Open Badges 3.0 очиқ калити", r.status);
  r = await get("/api/news");
  ok(r.ok && Array.isArray((await r.json()).items), "Эълонлар /api/news", r.status);
  r = await get("/api/turnir?w=2026-W01&stage=maktab");
  ok(r.status === 200 || r.status === 400, "Турнир рейтинги /api/turnir", r.status);
  r = await get("/api/turnir", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vid: "smoke", score: 99999, correct: 10 }) });
  ok(r.status === 400, "Нотўғри турнир натижаси рад этилди", r.status);
  r = await get("/");
  const html = await r.text();
  ok(/Ekomun|Экомун/i.test(html) && html.length > 100000, "Платформа тўлиқ юкланди", Math.round(html.length / 1024) + " KB");

  r = await get(ADMIN + "/");
  ok(r.status === 200 && /noindex/.test(r.headers.get("x-robots-tag") || ""), "Бошқарув маркази " + ADMIN + "/", r.status);
  if (!remote) {
    r = await get("/admin/");
    ok(r.status === 404, "Эски /admin манзили ёпиқ", r.status);
    r = await get("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: "xato" }) });
    ok(r.status === 401, "Нотўғри парол рад этилди", r.status);
    r = await get("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: PASS }) });
    const ck = (r.headers.get("set-cookie") || "").split(";")[0];
    ok(r.status === 200 && ck.startsWith("eko_admin="), "Админ кириши", r.status);
    r = await get("/api/admin/overview", { headers: { Cookie: ck } });
    ok(r.status === 200, "Админ маълумотлари (overview)", r.status);
    r = await get("/api/admin/overview");
    ok(r.status === 401, "Кирмасдан админ маълумоти берилмайди", r.status);
    r = await get("/api/admin/news", { method: "POST", headers: { Cookie: ck, "Content-Type": "application/json" }, body: JSON.stringify({ title: "Smoke эълон", body: "Текширув", stage: "all", days: 1 }) });
    ok(r.status === 201 || r.status === 200, "Админ эълон қўшди", r.status);
    r = await get("/api/news");
    ok((await r.json()).items.some((x) => x.title === "Smoke эълон"), "Эълон фойдаланувчига кўринади");
    r = await get("/api/admin/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "x" }) });
    ok(r.status === 401, "Кирмасдан эълон қўшиб бўлмайди", r.status);
    r = await get("/api/admin/analytics?days=30", { headers: { Cookie: ck } });
    const an = r.ok ? await r.json() : {};
    ok(r.ok && an.totals && Array.isArray(an.people) && an.segments, "Фойдаланувчилар таҳлили /api/admin/analytics", r.status);
    r = await get("/api/admin/report?days=30&format=pdf", { headers: { Cookie: ck } });
    let buf = Buffer.from(await r.arrayBuffer());
    ok(r.ok && buf.subarray(0, 5).toString() === "%PDF-" && /%%EOF\s*$/.test(buf.subarray(-8).toString()), "PDF ҳисобот", r.status + " · " + Math.round(buf.length / 1024) + " KB");
    r = await get("/api/admin/report?days=30&format=docx", { headers: { Cookie: ck } });
    buf = Buffer.from(await r.arrayBuffer());
    ok(r.ok && buf.readUInt32LE(0) === 0x04034b50 && buf.includes("word/document.xml"), "Word (DOCX) ҳисобот", r.status + " · " + Math.round(buf.length / 1024) + " KB");
    r = await get("/api/admin/report?format=pdf");
    ok(r.status === 401, "Кирмасдан ҳисобот берилмайди", r.status);
    r = await get(ADMIN + "/analiz.js");
    ok(r.status === 200, "Таҳлил бўлими скрипти", r.status);

    /* Render бепул режими: сервер ухлаб уйғонганда db.json ўчади — ҳисоб eko_pass калитидан тикланиши керак */
    const J = { "Content-Type": "application/json" };
    r = await get("/api/register", { method: "POST", headers: J, body: JSON.stringify({ name: "Синов", email: "+998 90 111 22 33", password: "parol123", birthYear: 2000, birthMonth: 4 }) });
    const sc = typeof r.headers.getSetCookie === "function" ? r.headers.getSetCookie() : [r.headers.get("set-cookie") || ""];
    const passCk = (sc.find((c) => c.startsWith("eko_pass=")) || "").split(";")[0];
    ok(r.status === 201 && passCk.length > 40, "Рўйхатдан ўтиш ва ҳисоб калити (eko_pass)", r.status);
    const port = new URL(base).port;
    child.kill("SIGTERM");
    await new Promise((res) => child.once("exit", res));
    fs.rmSync(path.join(tmp, "db.json"), { force: true });
    await start(Number(port));
    r = await get("/api/login", { method: "POST", headers: J, body: JSON.stringify({ email: "+998901112233", password: "parol123" }) });
    ok(r.status === 401, "Маълумотлар ўчгач, калитсиз ҳисоб йўқ", r.status);
    r = await get("/api/me", { headers: { Cookie: passCk } });
    const me = r.ok ? await r.json() : {};
    ok(me.user && me.user.email === "+998901112233" && me.user.by === 2000, "Ҳисоб калитдан тикланди", r.status);
    r = await get("/api/login", { method: "POST", headers: J, body: JSON.stringify({ email: "+998901112233", password: "parol123" }) });
    ok(r.status === 200, "Тикланган ҳисобга парол билан кириш", r.status);
    r = await get("/api/me", { headers: { Cookie: passCk.slice(0, -6) + "AAAAAA" } });
    ok(r.ok && !(await r.json()).user, "Сохта калит рад этилди", r.status);
  }
}

main()
  .catch((e) => { console.error("❌", e.message); failed++; })
  .finally(() => {
    if (child) child.kill("SIGTERM");
    if (tmp) setTimeout(() => fs.rmSync(tmp, { recursive: true, force: true }), 300);
    console.log(failed ? `\n${failed} та текширув ўтмади` : "\nҲаммаси ишлаяпти ✔");
    process.exitCode = failed ? 1 : 0;
  });
