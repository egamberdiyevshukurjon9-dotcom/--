/* QR код орқали киришни текшириш (qr.js): иккала усул, бир марталиклик, муддат, CSRF ва журнал.
   Ишлатиш:  node tools/qr-test.js   (npm test ичида ҳам) */
"use strict";
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

let child, base, failed = 0;
const ok = (cond, name, extra = "") => { console.log(`${cond ? "✅" : "❌"} ${name}${extra ? "  " + extra : ""}`); if (!cond) failed++; };
const PASS = "qr-" + Math.random().toString(36).slice(2);
const ADMIN = "/boshqaruv-qr";

async function start() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ekomun-qr-"));
  const port = 3100 + Math.floor(Math.random() * 800);
  base = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, [path.join(__dirname, "..", "server.js")], {
    env: { ...process.env, PORT: String(port), DATA_DIR: tmp, ADMIN_PASSWORD: PASS, ADMIN_PATH: ADMIN, ADMIN_TOTP_SECRET: "", ADMIN_HOST: "", ADMIN_ALLOW_IPS: "", ENV_FILE: path.join(tmp, "none.env"), QR_TTL_SEC: "" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stderr.on("data", (d) => process.stderr.write(d));
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base + "/api/health")).ok) return; } catch (e) { /* кутамиз */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Сервер ишга тушмади");
}

/* Оддий «браузер»: cookie'ларни сақлайди */
function browser(ua) {
  const jar = {};
  return {
    jar,
    async post(p, body, extra = {}) {
      const r = await fetch(base + p, {
        method: "POST", redirect: "manual",
        headers: { "Content-Type": "application/json", "User-Agent": ua, Cookie: Object.entries(jar).map(([k, v]) => k + "=" + v).join("; "), ...extra },
        body: JSON.stringify(body || {})
      });
      const sc = typeof r.headers.getSetCookie === "function" ? r.headers.getSetCookie() : [];
      for (const c of sc) { const [kv] = c.split(";"); const i = kv.indexOf("="); const k = kv.slice(0, i), v = kv.slice(i + 1); if (v) jar[k] = v; else delete jar[k]; }
      let data = {};
      try { data = await r.json(); } catch (e) { /* ignore */ }
      return { status: r.status, data };
    }
  };
}

async function main() {
  await start();
  console.log("QR кириш текширилмоқда: " + base);
  const phone = browser("Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36");
  const pc = browser("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36");
  const tab = browser("Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 Chrome/130 Safari/537.36");

  let r = await phone.post("/api/register", { name: "Азиза Каримова", email: "+998 90 555 44 33", password: "parol123", birthYear: 2001, birthMonth: 5 });
  ok(r.status === 201 && phone.jar.eko_session, "Телефонда ҳисоб очилди", r.status);

  /* ---- 1-усул: компьютерда QR, телефонда тасдиқлаш ---- */
  r = await pc.post("/api/qr/start");
  const S = r.data;
  ok(r.status === 200 && S.t && S.s && /\/\?qra=/.test(S.url) && S.ttl === 180, "Компьютер QR олди (3 дақиқа)", r.status);
  r = await pc.post("/api/qr/poll", { t: S.t, s: S.s });
  ok(r.data.status === "wait", "Тасдиқ кутилмоқда", r.data.status);
  r = await pc.post("/api/qr/poll", { t: S.t, s: "x".repeat(43) });
  ok(r.data.status === "expired", "Нотўғри poll калити рад этилди", r.data.status);
  r = await tab.post("/api/qr/peek", { t: S.t });
  ok(r.status === 401 && r.data.auth, "Кирмаган қурилма тасдиқлай олмайди", r.status);
  r = await phone.post("/api/qr/approve", { t: S.t, ok: true }, { Origin: "https://evil.example" });
  ok(r.status === 403, "Бошқа сайтдан (CSRF) тасдиқлаш рад этилди", r.status);
  r = await phone.post("/api/qr/peek", { t: S.t });
  ok(r.status === 200 && /Компьютер/.test(r.data.device) && r.data.name === "Азиза Каримова", "Телефонда қурилма кўрсатилди", r.data.device);
  r = await pc.post("/api/qr/poll", { t: S.t, s: S.s });
  ok(r.data.status === "scanned", "Компьютер «сканер қилинди» ни кўрди", r.data.status);
  r = await phone.post("/api/qr/approve", { t: S.t, ok: true });
  ok(r.status === 200 && r.data.ok, "Телефонда тасдиқланди", r.status);
  r = await pc.post("/api/qr/poll", { t: S.t, s: S.s });
  ok(r.data.status === "ok" && r.data.user && r.data.user.name === "Азиза Каримова" && pc.jar.eko_session, "Компьютер ҳисобга кирди", r.data.status);
  r = await pc.post("/api/qr/poll", { t: S.t, s: S.s });
  ok(r.data.status === "expired", "QR қайта ишламайди (бир марталик)", r.data.status);
  r = await fetch(base + "/api/me", { headers: { Cookie: "eko_session=" + pc.jar.eko_session } }).then((x) => x.json());
  ok(r.user && r.user.email === "+998905554433", "/api/me компьютерда ҳисобни қайтарди");

  /* Рад этиш */
  const pc2 = browser("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Safari/605.1.15");
  r = await pc2.post("/api/qr/start"); const S2 = r.data;
  await phone.post("/api/qr/peek", { t: S2.t });
  r = await phone.post("/api/qr/approve", { t: S2.t, ok: false });
  ok(r.status === 200 && r.data.ok === false, "Телефонда рад этилди");
  r = await pc2.post("/api/qr/poll", { t: S2.t, s: S2.s });
  ok(r.data.status === "denied" && !pc2.jar.eko_session, "Рад этилган қурилма кира олмади", r.data.status);

  /* ---- 2-усул: бир марталик кириш QR'и ---- */
  r = await pc.post("/api/qr/link");
  const L = r.data;
  ok(r.status === 200 && /\/\?qr=/.test(L.url) && L.id, "Кирган қурилма кириш QR'ини яратди", r.status);
  r = await pc.post("/api/qr/link-state", { id: L.id });
  ok(r.data.status === "wait", "QR ҳолати: кутилмоқда", r.data.status);
  r = await tab.post("/api/qr/redeem", { t: L.t });
  ok(r.status === 200 && r.data.user && tab.jar.eko_session, "Планшет QR билан кирди", r.status);
  r = await pc.post("/api/qr/link-state", { id: L.id });
  ok(r.data.status === "used" && /Планшет/.test(r.data.device), "QR кўрсатган қурилма «кирилди» ни кўрди", r.data.device);
  const other = browser("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1");
  r = await other.post("/api/qr/redeem", { t: L.t });
  ok(r.status === 410 && !other.jar.eko_session, "Ишлатилган QR иккинчи марта ишламайди", r.status);
  r = await other.post("/api/qr/redeem", { t: "A".repeat(43) });
  ok(r.status === 410, "Сохта токен рад этилди", r.status);
  r = await other.post("/api/qr/link");
  ok(r.status === 401, "Кирмаган қурилма кириш QR'ини ярата олмайди", r.status);
  /* Янги QR олдингисини бекор қилади */
  const a1 = (await pc.post("/api/qr/link")).data, a2 = (await pc.post("/api/qr/link")).data;
  r = await other.post("/api/qr/redeem", { t: a1.t });
  ok(r.status === 410, "Эски кириш QR'и янгиси олинганда бекор бўлди", r.status);
  r = await other.post("/api/qr/redeem", { t: a2.t, remember: false });
  ok(r.status === 200 && other.jar.eko_session && !other.jar.eko_pass, "«Эслаб қолма» — ҳисоб калити cookie'си берилмади", r.status);

  /* ---- Журнал (бошқарув маркази) ---- */
  const adm = browser("Mozilla/5.0 (X11; Linux x86_64) Chrome/130");
  r = await adm.post("/api/admin/login", { password: PASS });
  if (r.status === 200) {
    const ov = await fetch(base + "/api/admin/overview", { headers: { Cookie: Object.entries(adm.jar).map(([k, v]) => k + "=" + v).join("; ") } }).then((x) => x.json()).catch(() => ({}));
    const ev = (ov.events || []).map((e) => e.type);
    ok(ev.includes("qr_approve") && ev.includes("qr_link") && ev.includes("qr_failed") && ev.includes("qr_denied"), "Журналда QR ҳодисалари бор");
    ok((ov.events || []).some((e) => e.type === "login" && /QR/.test(e.reason || "")), "Журналда «Кирди — QR код» ёзуви бор");
  } else ok(false, "Админга кириш", r.status);

  /* ---- Сарлавҳалар ва файллар ---- */
  const h = await fetch(base + "/");
  ok(/object-src 'none'/.test(h.headers.get("content-security-policy") || "") && h.headers.get("cross-origin-opener-policy") === "same-origin-allow-popups", "Хавфсизлик сарлавҳалари");
  for (const f of ["/vendor/eko-qr-kirish.js", "/vendor/jsqr/jsQR.min.js"]) { const x = await fetch(base + f); ok(x.ok, "Файл " + f, x.status); }
  const sw = await fetch(base + "/sw.js").then((x) => x.text());
  ok(sw.includes("/vendor/jsqr/jsQR.min.js") && sw.includes("/vendor/eko-qr-kirish.js"), "Сканер оффлайн кешда (sw.js)");
}

main().catch((e) => { console.error(e); failed++; }).finally(() => {
  if (child) child.kill();
  console.log(failed ? `\n${failed} та текширув ўтмади` : "\nQR кириш ишлаяпти ✔");
  process.exit(failed ? 1 : 0);
});
