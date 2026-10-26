/* Стартап воситаларини текшириш (startap.js): сўровнома, аноним UX таҳлили ва pitch deck ҳаволалари.
   Ишлатиш:  node tools/startap-test.js   (npm test ичида ҳам) */
"use strict";
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

let child, base, failed = 0;
const ok = (cond, name, extra = "") => { console.log(`${cond ? "✅" : "❌"} ${name}${extra ? "  " + extra : ""}`); if (!cond) failed++; };
const PASS = "st-" + Math.random().toString(36).slice(2);
const ADMIN = "/boshqaruv-st";
let jar = "";

async function start() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ekomun-st-"));
  const port = 3100 + Math.floor(Math.random() * 800);
  base = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, [path.join(__dirname, "..", "server.js")], {
    env: { ...process.env, PORT: String(port), DATA_DIR: tmp, ADMIN_PASSWORD: PASS, ADMIN_PATH: ADMIN, ADMIN_TOTP_SECRET: "", ADMIN_HOST: "", ADMIN_ALLOW_IPS: "", ENV_FILE: path.join(tmp, "none.env"), FEED_OFF: "1", GEO_PROVIDER: "off" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stderr.on("data", (d) => process.stderr.write(d));
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base + "/api/health")).ok) return; } catch (e) { /* кутамиз */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Сервер ишга тушмади");
}
async function req(p, body, opt = {}) {
  const r = await fetch(base + p, {
    method: body !== undefined ? "POST" : "GET",
    headers: { ...(body !== undefined && !Buffer.isBuffer(body) ? { "Content-Type": "application/json" } : {}), Cookie: jar, "User-Agent": "Mozilla/5.0 (Linux; Android 14; SM-A546E) Chrome/130 Mobile Safari/537.36", ...(opt.headers || {}) },
    body: body === undefined ? undefined : Buffer.isBuffer(body) ? body : JSON.stringify(body)
  });
  const sc = r.headers.get("set-cookie");
  if (sc && /eko_admin=/.test(sc)) jar = sc.split(";")[0];
  const ct = r.headers.get("content-type") || "";
  return { status: r.status, data: ct.includes("json") ? await r.json() : await r.arrayBuffer(), headers: r.headers };
}

/* Энг кичик тўғри PDF (1 саҳифа) */
function tinyPdf() {
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 100] >>"];
  let out = "%PDF-1.4\n", offs = [];
  objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const x = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offs.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

async function main() {
  await start();
  console.log("Стартап воситалари текширилмоқда: " + base);
  const vid = "abc123def456abc1";

  /* ---- Сўровнома ---- */
  let r = await req("/api/survey", { sv: "2026-1", vid, stage: "uni", lang: "cyr", ans: { role: "teacher", nps: 9, pmf: "very", useful: ["kurslar", "lab", "BAD KEY"], pay: "25", missing: "Ўзбекча видео кўпроқ бўлсин <script>" } });
  ok(r.status === 201, "Сўровнома жавоби қабул қилинди", r.status);
  r = await req("/api/survey", { sv: "2026-1", vid, stage: "uni", ans: { role: "teacher", nps: 10, pmf: "very" } });
  ok(r.status === 201 && r.data.updated, "Бир қурилмадан қайта юборилса — янгиланади");
  r = await req("/api/survey", { sv: "2026-1", vid: "kid000000000kid1", stage: "maktab", ans: { role: "pupil", nps: 8, pay: "50", b2b: "yes" } });
  ok(r.status === 201, "Мактаб ўқувчиси жавоби");
  r = await req("/api/survey", { sv: "2026-1", ans: { role: "pupil" } });
  ok(r.status === 400, "1 та жавоб — рад этилди", r.status);

  /* ---- UX ---- */
  r = await req("/api/ux", { dc: "m", stage: "uni", lang: "cyr", c: [["video", 500, 120, "button «Бошлаш»", 0], ["video", 510, 125, "button «Бошлаш»", 1], ["video", 100, 900, "div.vd-card", 2], ["BAD SEC", 1, 1, "x", 0]],
    s: [["video", 80, 45000], ["bosh", 30, 8000]], p: [["bosh", 8000], ["video", 45000], ["fikr", 5000]] });
  ok(r.status === 200 && r.data.n === 6, "UX маълумотлари қабул қилинди (нотўғри бўлим ташланди)", JSON.stringify(r.data));

  /* ---- Админ ---- */
  r = await req("/api/admin/survey");
  ok(r.status === 401, "Админсиз сўровнома натижалари ёпиқ", r.status);
  r = await req("/api/admin/login", { password: PASS });
  ok(r.status === 200 && jar, "Админ кирди", r.status);
  r = await req("/api/admin/survey");
  const sv = r.data.responses || [];
  ok(r.status === 200 && sv.length === 2, "Админ: 2 та жавоб (қайта юборилган 1 та бўлиб қолди)", sv.length);
  const t = sv.find((x) => x.ans.role === "teacher"), kid = sv.find((x) => x.ans.role === "pupil");
  ok(t && t.ans.nps === 10 && !t.vh && !t.vid, "Жавоб янгиланган, қурилма коди админга берилмайди");
  ok(kid && kid.ans.pay === undefined && kid.ans.b2b === undefined, "Мактаб ўқувчисидан тўлов саволи сақланмади");
  r = await req("/api/admin/ux?days=30&sec=video&dc=m");
  const vs = (r.data.sections || []).find((s) => s.sec === "video");
  ok(r.status === 200 && vs && vs.clicks === 3 && vs.rage === 1 && vs.dead === 1 && vs.depth === 80, "UX: бўлим бўйича клик, жаҳл, бефойда, чуқурлик", JSON.stringify(vs));
  ok(r.data.points.length === 3 && r.data.targets[0].t === "button «Бошлаш»" && r.data.targets[0].n === 2, "UX: клик нуқталари ва энг кўп босилган тугма");
  ok(r.data.sessions === 1 && r.data.transitions.some((x) => x.k === "bosh→video"), "UX: сессия йўли ва ўтишлар");

  /* ---- Pitch deck ---- */
  r = await req("/api/admin/deck/upload?name=Investor%20deck", Buffer.from("salom"), { headers: { "Content-Type": "application/pdf" } });
  ok(r.status === 400, "PDF бўлмаган файл рад этилди", r.status);
  r = await req("/api/admin/deck/upload?name=Investor%20deck", tinyPdf(), { headers: { "Content-Type": "application/pdf" } });
  ok(r.status === 201 && r.data.id, "PDF юкланди", r.status);
  const deckId = r.data.id;
  r = await req("/api/admin/deck/link", { deck: deckId, label: "UzVC — Азиз", email: true, days: 30 });
  ok(r.status === 201 && /\/d\/[\w-]{16,}$/.test(r.data.url), "Инвестор ҳаволаси яратилди", r.data.url);
  const token = r.data.token;
  const saveJar = jar; jar = "";
  r = await req("/d/" + token);
  ok(r.status === 200 && r.headers.get("x-robots-tag") === "noindex, nofollow", "/d/… кўриш саҳифаси очилди (noindex)", r.status);
  r = await req("/api/deck/noto-gri-kalit-1234567");
  ok(r.status === 404, "Нотўғри калит — топилмади", r.status);
  r = await req("/api/deck/" + token);
  ok(r.status === 200 && r.data.needEmail && r.data.title === "Investor deck", "Ҳавола маълумоти: почта сўралади");
  r = await req("/api/deck/" + token + "/open", { email: "yomon" });
  ok(r.status === 400, "Нотўғри почта рад этилди", r.status);
  r = await req("/api/deck/" + token + "/file?v=xxxx");
  ok(r.status === 403, "Очмасдан файлни олиб бўлмайди", r.status);
  r = await req("/api/deck/" + token + "/open", { email: "aziz@uzvc.uz" });
  ok(r.status === 201 && r.data.view, "Инвестор ҳаволани очди");
  const view = r.data.view;
  r = await req(r.data.file);
  ok(r.status === 200 && Buffer.from(r.data).slice(0, 5).toString() === "%PDF-", "PDF файл берилди");
  await req("/api/deck/" + token + "/ping", { view, page: 1, ms: 12000, pages: 3 });
  await req("/api/deck/" + token + "/ping", { view, page: 2, ms: 30000, pages: 3 });
  r = await req("/api/deck/" + token + "/ping", { view, page: 3, ms: 999999, pages: 3 });
  ok(r.status === 200, "Саҳифа вақтлари юборилди");
  jar = saveJar;
  r = await req("/api/admin/deck/link/" + token);
  ok(r.status === 200 && r.data.link.views === 1 && r.data.link.done === 1 && r.data.per[1].avgMs === 30000 && r.data.per[2].avgMs === 120000, "Админ: кўриш, охиригача ўқиш ва саҳифа вақтлари (120 с чеклов)", JSON.stringify(r.data.per));
  ok(r.data.views[0].email === "aziz@uzvc.uz" && !r.data.views[0].ipHash, "Админ: ким очгани кўринади, IP хэши берилмайди");
  r = await req("/api/admin/deck/link/" + token, { action: "off" });
  jar = "";
  r = await req("/api/deck/" + token);
  ok(r.status === 404, "Ёпилган ҳавола очилмайди", r.status);
  jar = saveJar;
  r = await req("/api/admin/system");
  ok(r.status === 200 && r.data.startap && r.data.startap.survey === 2 && r.data.startap.deckViews === 1, "Тизим: стартап статистикаси");

  /* ---- Админ файллари ---- */
  r = await req(ADMIN + "/startap.js");
  ok(r.status === 200, "Админ: startap.js берилди", r.status);
  r = await req(ADMIN + "/sorov-data.js");
  ok(r.status === 200 && Buffer.from(r.data).toString().includes("EKO_SOROV"), "Админ: сўровнома саволлари берилди");
}

main().then(() => { child.kill(); console.log(failed ? `\n❌ ${failed} та текширув ўтмади` : "\n✓ startap-test: сўровнома, UX ва pitch deck ишлайди"); process.exit(failed ? 1 : 0); })
  .catch((e) => { console.error(e); if (child) child.kill(); process.exit(1); });
