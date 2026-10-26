/* Қурилмалар синови (BrowserStack ўрнига): платформани турли телефон, планшет ва компьютер экранларида,
   ёруғ/тунги мавзуда, мактаб ва университет босқичида очиб текширади:
     • саҳифа энига сиғадими (горизонтал айланиш йўқми) ва қайси элемент чиқиб кетяпти;
     • JavaScript хатолари ва консолдаги хатолар;
     • платформанинг ўз файллари (/vendor/…) юкланмай қолмадими;
     • тугмалар бармоқ учун етарли каттами (телефонда 24×24 px дан кичик эмас — WCAG 2.2, 2.5.8).
   Ишлатиш:  node tools/device-test.js                       (ўзи сервер ишга туширади, барча бўлимлар)
             node tools/device-test.js https://sayt.uz       (жойлаштирилган сайт)
             SECTIONS=bosh,video DEVICES=iphone-se node tools/device-test.js
   Ҳисобот: tools/out/device-report.json ва .md; SHOTS=1 бўлса скриншотлар ҳам. Playwright керак (npm i -D playwright). */
"use strict";
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

let chromium, devices;
try { ({ chromium, devices } = require("playwright")); } catch (e) {
  console.error("Playwright топилмади: npm i -D playwright && npx playwright install chromium");
  process.exit(2);
}

const ROOT = path.join(__dirname, "..");
const OUT = path.join(__dirname, "out");
const remote = process.argv[2];
let base = remote ? remote.replace(/\/+$/, "") : "";
let child, tmp;

/* Ўзбекистонда кўп учрайдиган экранлар (StatCounter 2025: 360×800, 393×873, 412×915 энг кенг тарқалган) */
const DEVICES = {
  "galaxy-a": { ...devices["Galaxy S9+"], viewport: { width: 360, height: 780 }, label: "Samsung Galaxy A (360×780, Android Chrome)" },
  "redmi": { ...devices["Pixel 7"], viewport: { width: 393, height: 851 }, label: "Xiaomi Redmi / Pixel (393×851)" },
  "iphone-se": { ...devices["iPhone SE"], label: "iPhone SE (320×568, Safari UA)" },
  "iphone-15": { ...devices["iPhone 15"], label: "iPhone 15 (393×659, Safari UA)" },
  "tab": { ...devices["Galaxy Tab S4"], label: "Android планшет (712×1138)" },
  "ipad": { ...devices["iPad (gen 7)"], label: "iPad (810×1080)" },
  "laptop": { viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1, label: "Ноутбук 1366×768" },
  "fullhd": { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, label: "Монитор 1920×1080" }
};
const PHONE = new Set(["galaxy-a", "redmi", "iphone-se", "iphone-15"]);

const env = (k) => (process.env[k] || "").split(",").map((s) => s.trim()).filter(Boolean);
const pickDevices = env("DEVICES").length ? env("DEVICES") : Object.keys(DEVICES);
const SHOTS = process.env.SHOTS === "1";

async function start(port = 3900 + Math.floor(Math.random() * 500)) {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ekomun-dev-"));
  base = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, [path.join(ROOT, "server.js")], {
    env: { ...process.env, PORT: String(port), DATA_DIR: tmp, ADMIN_PASSWORD: "device-test", FEED_OFF: "1", GEO_PROVIDER: "off", ENV_FILE: path.join(tmp, "none.env") },
    stdio: ["ignore", "ignore", "pipe"]
  });
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(base + "/api/health")).ok) return; } catch (e) { /* кутамиз */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Сервер ишга тушмади");
}

function sectionsOf(html) {
  const ids = [...html.matchAll(/<section[^>]*\bid="([a-z0-9-]+)"([^>]*)>/g)].map((m) => ({ id: m[1], uni: /data-stage="uni"/.test(m[2]), maktab: /data-stage="maktab"/.test(m[2]) }));
  const only = env("SECTIONS");
  return only.length ? ids.filter((s) => only.includes(s.id)) : ids;
}

/* Браузер ичида: энидан чиқаётган ва жуда кичик тугмалар */
function probe(isPhone) {
  const vw = document.documentElement.clientWidth;
  const sel = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) return s + "#" + el.id;
    const c = [...el.classList].slice(0, 2).join(".");
    if (c) s += "." + c;
    const p = el.closest("[id]");
    return (p && p !== el ? "#" + p.id + " " : "") + s;
  };
  const visible = (el) => { const st = getComputedStyle(el); return st.visibility !== "hidden" && st.display !== "none" && el.getClientRects().length > 0; };
  /* Элемент ота-онаси ичида айланса (overflow:auto/hidden) — бу хато эмас */
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p);
      if (/(auto|scroll|hidden|clip)/.test(o.overflowX)) return p.getBoundingClientRect().right <= vw + 1;
    }
    return false;
  };
  const over = [];
  const sec = document.querySelector("section:not([hidden]):target") || document.querySelector("main") || document.body;
  for (const el of document.querySelectorAll("body *")) {
    if (over.length >= 8) break;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right <= vw + 2 || r.left < -2 && r.right < 0) continue;
    if (!visible(el) || clipped(el)) continue;
    const st = getComputedStyle(el);
    if (st.position === "fixed" && r.left >= vw) continue; // экрандан ташқаридаги ёпиқ панел
    if (el.closest("[aria-hidden='true'], .sr-only, .visually-hidden, dialog:not([open])")) continue;
    /* Фақат «энг ташқи» айбдорни ёзамиз */
    if (over.some((o) => o.el.contains(el))) continue;
    over.push({ el, sel: sel(el), right: Math.round(r.right), w: Math.round(r.width) });
  }
  const small = [];
  if (isPhone) {
    for (const el of sec.querySelectorAll("button, a[href], [role=button], input[type=checkbox], input[type=radio], select")) {
      if (small.length >= 10) break;
      if (!visible(el) || el.closest("p, li, td, .inline-link")) continue; // матн ичидаги ҳаволалар истисно (WCAG 2.5.8)
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.bottom < 0 || r.top > innerHeight * 3) continue;
      const lab = el.closest("label");
      const rr = lab ? lab.getBoundingClientRect() : r;
      if (rr.width < 24 || rr.height < 24) small.push({ sel: sel(el), w: Math.round(rr.width), h: Math.round(rr.height) });
    }
  }
  return {
    scrollW: document.documentElement.scrollWidth, vw,
    overflow: document.documentElement.scrollWidth > vw + 1,
    offenders: over.map(({ sel, right, w }) => ({ sel, right, w })),
    small
  };
}

async function main() {
  if (!remote) await start();
  fs.mkdirSync(OUT, { recursive: true });
  const html = await (await fetch(base + "/")).text();
  const secs = sectionsOf(html);
  const browser = await chromium.launch();
  const results = [];
  const year = new Date().getFullYear();
  /* Иккала босқич: 12 ёшли ўқувчи ва 20 ёшли талаба */
  const STAGES = [["maktab", year - 12], ["uni", year - 20]];
  console.log(`Текширилмоқда: ${base} · ${pickDevices.length} қурилма × ${secs.length} бўлим × 2 босқич`);

  for (const dk of pickDevices) {
    const d = DEVICES[dk];
    if (!d) { console.warn("Номаълум қурилма: " + dk); continue; }
    const { label, ...opts } = d;
    for (const [stage, by] of STAGES) {
      const dark = stage === "uni" && !PHONE.has(dk); // компьютерда тунги мавзуни ҳам синаймиз
      const ctx = await browser.newContext({ ...opts, colorScheme: dark ? "dark" : "light", serviceWorkers: "block", locale: "uz-UZ" });
      await ctx.addInitScript(([by]) => {
        try {
          localStorage.setItem("ekotalim:onboard", "1");
          localStorage.setItem("ekotalim:profile", JSON.stringify({ name: "Синов", by, bm: 1 }));
          localStorage.setItem("ekotalim:ux-off", "1");
        } catch (e) { /* ignore */ }
      }, [by]);
      const page = await ctx.newPage();
      let errs = [];
      page.on("pageerror", (e) => errs.push("JS: " + String(e.message).slice(0, 200)));
      page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|ERR_|net::/.test(m.text())) errs.push("console: " + m.text().slice(0, 200)); });
      page.on("requestfailed", (r) => { if (r.url().startsWith(base) && !/\/api\//.test(r.url())) errs.push("404/юкланмади: " + r.url().slice(base.length)); });
      page.on("response", (r) => { if (r.url().startsWith(base) && r.status() >= 400 && !/\/api\//.test(r.url())) errs.push(`${r.status()}: ${r.url().slice(base.length)}`); });
      await page.goto(base + "/", { waitUntil: "load" });
      await page.waitForTimeout(600);
      for (const s of secs) {
        if ((s.uni && stage !== "uni") || (s.maktab && stage !== "maktab")) continue;
        errs = [];
        await page.evaluate((id) => { location.hash = id; }, s.id);
        await page.waitForTimeout(450);
        let r;
        try { r = await page.evaluate(probe, PHONE.has(dk)); } catch (e) { r = { overflow: false, offenders: [], small: [], err: String(e.message) }; }
        const row = { device: dk, label, stage, dark, sec: s.id, ...r, errors: [...new Set(errs)] };
        results.push(row);
        const bad = row.overflow || row.errors.length;
        if (bad) console.log(`❌ ${dk}/${stage}/#${s.id}: ${row.overflow ? `эни ${row.scrollW}>${row.vw} (${row.offenders.map((o) => o.sel).join(", ")}) ` : ""}${row.errors.join(" | ")}`);
        if (SHOTS && (bad || s.id === "bosh")) await page.screenshot({ path: path.join(OUT, `${dk}-${stage}-${s.id}.png`) });
      }
      await ctx.close();
    }
  }
  await browser.close();

  const fails = results.filter((r) => r.overflow || r.errors.length);
  const small = results.filter((r) => r.small && r.small.length);
  fs.writeFileSync(path.join(OUT, "device-report.json"), JSON.stringify(results, null, 1));
  const md = [`# Қурилмалар синови — ${new Date().toISOString().slice(0, 16).replace("T", " ")}`, "",
    `Сайт: ${remote || "локал сервер"} · ${results.length} текширув (${pickDevices.length} қурилма, ${secs.length} бўлим, 2 босқич)`, "",
    `**Муаммолар: ${fails.length}** (эни сиғмаслик ёки хато) · кичик тугмали бўлимлар: ${small.length}`, "",
    "| Қурилма | Босқич | Бўлим | Муаммо |", "|---|---|---|---|",
    ...fails.map((r) => `| ${r.label} | ${r.stage}${r.dark ? " (тунги)" : ""} | #${r.sec} | ${r.overflow ? `эни ${r.scrollW} px > ${r.vw} px: ${r.offenders.map((o) => "`" + o.sel + "`").join(", ")}` : ""} ${r.errors.join("; ")} |`),
    "", "## Кичик тугмалар (телефонда < 24×24 px)", "",
    ...small.slice(0, 60).map((r) => `- ${r.device} #${r.sec}: ${r.small.map((x) => `\`${x.sel}\` ${x.w}×${x.h}`).join(", ")}`)];
  fs.writeFileSync(path.join(OUT, "device-report.md"), md.join("\n") + "\n");
  console.log(`\n${fails.length ? "❌" : "✅"} ${results.length} текширув, муаммо: ${fails.length}. Ҳисобот: tools/out/device-report.md`);
  return fails.length;
}

main().then((n) => { if (child) child.kill(); process.exit(n ? 1 : 0); })
  .catch((e) => { console.error(e); if (child) child.kill(); process.exit(1); });
