/* Ўқитувчи устахонасини текшириш (ustoz.js): материаллар базаси, ўйинли дарс коди, ўқувчи натижаси,
   рухсатлар (ҳисобсиз, 18 ёшгача, бегона ўқитувчи), CSRF ва СИ созланмаганда жавоб.
   Ишлатиш:  node tools/ustoz-test.js   (npm test ичида ҳам) */
"use strict";
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

let child, base, failed = 0;
const ok = (cond, name, extra = "") => { console.log(`${cond ? "✅" : "❌"} ${name}${extra ? "  " + extra : ""}`); if (!cond) failed++; };

async function start() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ekomun-ustoz-"));
  const port = 3100 + Math.floor(Math.random() * 800);
  base = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, [path.join(__dirname, "..", "server.js")], {
    env: { ...process.env, PORT: String(port), DATA_DIR: tmp, ADMIN_PASSWORD: "", ANTHROPIC_API_KEY: "", ENV_FILE: path.join(tmp, "none.env") },
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stderr.on("data", (d) => { if (!/ADMIN_PASSWORD/.test(String(d))) process.stderr.write(d); });
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base + "/api/health")).ok) return tmp; } catch (e) { /* кутамиз */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Сервер ишга тушмади");
}
function browser() {
  const jar = {};
  return async (method, p, body, extra = {}) => {
    const r = await fetch(base + p, {
      method, headers: { "Content-Type": "application/json", Cookie: Object.entries(jar).map(([k, v]) => k + "=" + v).join("; "), ...extra },
      body: body ? JSON.stringify(body) : undefined
    });
    const sc = typeof r.headers.getSetCookie === "function" ? r.headers.getSetCookie() : [];
    for (const c of sc) { const [kv] = c.split(";"); const i = kv.indexOf("="); const k = kv.slice(0, i), v = kv.slice(i + 1); if (v) jar[k] = v; else delete jar[k]; }
    let data = {};
    try { data = await r.json(); } catch (e) { /* ignore */ }
    return { status: r.status, data };
  };
}
const TEXT = "Сувнинг қаттиқлиги — бу сувда эриган кальций ва магний тузлари миқдорини кўрсатувчи хусусият. ".repeat(6);
const GAME = {
  t: "Сувнинг қаттиқлиги", stg: "maktab", kind: "lab", goal: "Қаттиқликни аниқлаш", lang: "uzc",
  terms: [["Қаттиқлик", "Сувдаги кальций ва магний тузлари"], ["Трилон", "Комплекс ҳосил қилувчи модда"], ["Бюретка", "Титрлаш асбоби"]],
  insert: ["Биринчи фикр.", "Иккинчи фикр."], cluster: { c: "Сув", b: [["қаттиқлик", "…"], ["туз", "…"]] },
  venn: { a: "A", b: "B", items: [["x", "a"], ["y", "b"], ["z", "ab"], ["w", "zz"]] },
  quiz: [{ q: "Савол?", a: ["бир", "икки", ""], c: 7 }], tf: [["Гап", true]], steps: ["1", "2", "3"], tools: ["колба"], acts: ["insert", "hack", "quiz"],
  evil: "<script>alert(1)</script>"
};

(async () => {
  const tmp = await start();
  try {
    const anon = browser(), kid = browser(), T = browser(), T2 = browser();
    let r = await anon("GET", "/api/ustoz/mats");
    ok(r.status === 401 && r.data.auth, "Ҳисобсиз: базага кириб бўлмайди", r.status);

    r = await kid("POST", "/api/register", { name: "Бола", email: "+998 90 100 00 01", password: "parol123", birthYear: new Date().getFullYear() - 15, birthMonth: 1 });
    ok(r.status === 201, "15 ёшли ўқувчи рўйхатдан ўтди", r.status);
    r = await kid("GET", "/api/ustoz/mats");
    ok(r.status === 403, "18 ёшгача: ўқитувчи базаси ёпиқ", r.status);

    r = await T("POST", "/api/register", { name: "Устоз", email: "+998 90 100 00 02", password: "parol123", birthYear: 1985, birthMonth: 2 });
    ok(r.status === 201, "Ўқитувчи рўйхатдан ўтди", r.status);
    r = await T("GET", "/api/ustoz/mats");
    ok(r.status === 200 && Array.isArray(r.data.mats) && r.data.ai === false, "Материаллар рўйхати (СИ йўқ)", JSON.stringify(r.data).slice(0, 80));

    r = await T("POST", "/api/ustoz/mats", { title: "Қисқа", text: "кам" });
    ok(r.status === 400, "Бўш матн рад этилади", r.status);
    r = await T("POST", "/api/ustoz/mats", { title: "Лаб", text: TEXT }, { Origin: "https://evil.example" });
    ok(r.status === 403, "Бегона сайтдан (CSRF) рад этилади", r.status);
    r = await T("POST", "/api/ustoz/mats", { title: "3-лаборатория иши", kind: "lab", stg: "maktab", file: "lab.pdf", pages: 2, text: TEXT });
    ok(r.status === 201 && /^[a-f0-9]{16}$/.test(r.data.mat.id) && r.data.mat.chars === TEXT.length, "Материал базага сақланди", r.status);
    const id = r.data.mat.id;
    ok(fs.existsSync(path.join(tmp, "ustoz", id + ".txt")), "Матн DATA_DIR/ustoz/ да файл");
    r = await T("GET", "/api/ustoz/mats/" + id);
    ok(r.status === 200 && r.data.text === TEXT, "Материал матни қайтарилади");

    r = await T2("POST", "/api/register", { name: "Бошқа устоз", email: "+998 90 100 00 03", password: "parol123", birthYear: 1980, birthMonth: 5 });
    r = await T2("GET", "/api/ustoz/mats/" + id);
    ok(r.status === 404, "Бошқа ўқитувчи бегона материални кўрмайди", r.status);
    r = await T2("DELETE", "/api/ustoz/mats/" + id);
    ok(r.status === 404, "Бошқа ўқитувчи бегона материални ўчиролмайди", r.status);

    r = await T("POST", "/api/ustoz/ai", { mat: id });
    ok(r.status === 503, "СИ созланмаган — 503 (дарс СИсиз ҳам тузилади)", r.status);

    r = await T("POST", "/api/ustoz/games", { game: GAME });
    ok(r.status === 201 && /^[A-Z2-9]{6}$/.test(r.data.code), "Ўйинли дарсга код берилди", r.data.code);
    const code = r.data.code;
    r = await anon("GET", "/api/ustoz/g/" + code.toLowerCase());
    const g = r.data.game || {};
    ok(r.status === 200 && r.data.by === "Устоз", "Ўқувчи кодни ҳисобсиз очади (кичик ҳарф ҳам)", r.status);
    ok(g.acts && !g.acts.includes("hack") && g.venn.items.length === 3 && g.quiz[0].a.length === 2 && g.quiz[0].c === 1 && !("evil" in g) && g.tf[0][1] === 1, "Дарс маълумоти серверда тозаланади", JSON.stringify(g.quiz));
    r = await anon("GET", "/api/ustoz/g/ZZZZZZ");
    ok(r.status === 404, "Нотўғри код — 404", r.status);
    r = await anon("POST", `/api/ustoz/g/${code}/result`, { name: "Али, 7-Б", score: 999, max: 20 });
    ok(r.status === 201, "Ўқувчи натижаси юборилди", r.status);
    r = await T2("GET", `/api/ustoz/games/${code}/results`);
    ok(r.status === 404, "Бегона ўқитувчи натижаларни кўрмайди", r.status);
    r = await T("GET", `/api/ustoz/games/${code}/results`);
    ok(r.status === 200 && r.data.results.length === 1 && r.data.results[0].score === 20 && r.data.views === 1, "Ўқитувчи натижаларни кўради (балл чегараланган)", JSON.stringify(r.data.results[0]));
    r = await T("POST", "/api/ustoz/games", { game: Object.assign({}, GAME, { t: "Янгиланган" }), code });
    ok(r.status === 200 && r.data.code === code, "Шу коддаги дарс янгиланади");
    r = await T("GET", "/api/ustoz/games");
    ok(r.status === 200 && r.data.games.length === 1 && r.data.games[0].t === "Янгиланган" && r.data.games[0].results === 1, "Менинг дарсларим рўйхати");

    r = await T("DELETE", "/api/ustoz/games/" + code);
    ok(r.status === 200, "Дарс ўчирилди");
    r = await anon("GET", "/api/ustoz/g/" + code);
    ok(r.status === 404, "Ўчирилган дарс очилмайди", r.status);
    r = await T("DELETE", "/api/ustoz/mats/" + id);
    ok(r.status === 200 && !fs.existsSync(path.join(tmp, "ustoz", id + ".txt")), "Материал ва унинг файли ўчирилди");

    for (const f of ["/vendor/eko-dars.js", "/vendor/eko-dars.css", "/vendor/pdfjs/pdf.min.mjs", "/vendor/pdfjs/pdf.worker.min.mjs"]) {
      const x = await fetch(base + f);
      ok(x.ok && /javascript|css/.test(x.headers.get("content-type") || ""), "Файл берилади: " + f, x.headers.get("content-type"));
    }
  } catch (e) { ok(false, "Кутилмаган хато", e.stack); }
  child.kill("SIGTERM");
  console.log(failed ? `\n❌ ${failed} та текширув ўтмади` : "\n✅ Ўқитувчи устахонаси: барча текширувлар ўтди");
  process.exit(failed ? 1 : 0);
})();
