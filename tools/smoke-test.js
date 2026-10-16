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

async function start() {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ekomun-"));
  const port = 3100 + Math.floor(Math.random() * 800);
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
