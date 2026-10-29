/* Шахсий агент амалларини текшириш (pro.js): tool use цикли, амалларни тозалаш, қурилма ҳолати.
   Ҳақиқий AI чақирилмайди — сохта мижоз моделнинг жавобларини навбат билан қайтаради.
   Ишлатиш:  node tools/agent-test.js   (npm test ичида ҳам) */
"use strict";
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

let failed = 0;
const ok = (cond, name, extra = "") => { console.log(`${cond ? "✅" : "❌"} ${name}${extra ? "  " + extra : ""}`); if (!cond) failed++; };

const replies = [], calls = [];
const fakeAi = { beta: { messages: { create: async (req) => { calls.push(JSON.parse(JSON.stringify(req))); return replies.shift(); } } } };
const db = { users: [], orders: [], leads: [] };
const user = { id: "u1", by: new Date().getFullYear() - 20, bm: 1, pro: { until: Date.now() + 864e5, plan: "pro_1m" } };
let body = {};
const mod = require("../pro")({
  db, save: () => {}, now: () => Date.now(), newId: () => "x", logEvent: () => {}, clientIp: () => "127.0.0.1", publicOrigin: () => "http://t",
  send: (res, s, j) => { res.s = s; res.j = j; }, readBody: async () => body, currentUser: () => ({ user }), isAdmin: () => false,
  cleanText: (s, max) => String(s || "").replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").trim().slice(0, max),
  getAi: () => fakeAi, Anthropic: null, AI_MODEL: "test-model", DATA_DIR: fs.mkdtempSync(path.join(os.tmpdir(), "ekomun-agent-")),
  aiGlobal: { blocked: () => false, count: () => {}, refund: () => {} }
});
const { cleanAction, ctxText, AGENT_TOOLS } = mod.agentTools;
const ask = async (b) => { body = b; const res = {}; await mod.api({ method: "POST", headers: {} }, res, "/api/agent"); return res; };

(async () => {
  /* ---------- Асбоблар рўйхати ---------- */
  ok(AGENT_TOOLS.map((t) => t.name).join() === "open_lesson,add_review,make_plan,make_quiz,open_section,set_style", "6 та асбоб");
  ok(AGENT_TOOLS.every((t) => t.input_schema && t.input_schema.type === "object" && t.description), "Ҳар асбобда тавсиф ва схема");

  /* ---------- Амалларни тозалаш ---------- */
  ok(cleanAction("open_lesson", { query: "  сув ифлосланиши " }).query === "сув ифлосланиши", "open_lesson: query тозаланди");
  ok(cleanAction("open_lesson", {}) === null, "open_lesson: бўш query → ташланади");
  ok(cleanAction("open_section", { section: "../admin" }) === null, "open_section: рўйхатда йўқ бўлим → ташланади");
  ok(cleanAction("open_section", { section: "labxona" }).section === "labxona", "open_section: labxona");
  ok(cleanAction("set_style", { style: "hack" }) === null && cleanAction("set_style", { style: "simple" }).style === "simple", "set_style: фақат 4 услуб");
  ok(cleanAction("rm_rf", { x: 1 }) === null, "Номаълум асбоб → ташланади");
  const plan = cleanAction("make_plan", { title: "Сув", days: Array.from({ length: 10 }, (_, i) => ({ tasks: [{ text: "Дарс " + i, section: "nope" }, { text: "" }, { text: "a" }, { text: "b" }, { text: "c" }, { text: "d" }] })) });
  ok(plan.days.length === 7, "make_plan: кўпи билан 7 кун", plan.days.length);
  ok(plan.days.every((d) => d.tasks.length === 3 && d.tasks.every((t) => t.text && t.section === "")), "make_plan: бўш вазифа ва нотўғри бўлим тозаланди (4 тадан)");
  const quiz = cleanAction("make_quiz", { topic: "Сув", questions: [
    { q: "H₂O нима?", options: ["Сув", "Туз", "Ҳаво"], correct: 0, why: "Сув молекуласи" },
    { q: "Нотўғри индекс", options: ["a", "b"], correct: 5 },
    { q: "Битта вариант", options: ["a"], correct: 0 },
    { q: "", options: ["a", "b"], correct: 1 }
  ] });
  ok(quiz.questions.length === 1 && quiz.questions[0].correct === 0, "make_quiz: нотўғри саволлар ташланди", quiz.questions.length);
  ok(cleanAction("make_quiz", { topic: "x", questions: [] }) === null, "make_quiz: саволсиз → ташланади");

  /* ---------- Қурилма ҳолати ---------- */
  const ct = ctxText({ style: "examples", next: ["Сув ифлосланиши"], weak: ["Гидросфера"], due: 4, mist: 2, streak: 3, done: 11, mins: 15 });
  ok(/ҳаётий/.test(ct) && /Гидросфера/.test(ct) && /карталари: 4/.test(ct) && /15 дақиқа/.test(ct), "ctxText: услуб, суст курс, карталар, вақт");
  ok(ctxText(null) === "" && !/undefined|NaN/.test(ctxText({ due: "abc", style: "bad" })), "ctxText: нотўғри маълумот хавфсиз");

  /* ---------- Tool use цикли ---------- */
  replies.push(
    { stop_reason: "tool_use", content: [{ type: "text", text: "Режа тузаман." }, { type: "tool_use", id: "t1", name: "make_plan", input: { title: "Сув — 7 кун", days: [{ tasks: [{ text: "Гидросфера дарси", query: "гидросфера" }] }] } }, { type: "tool_use", id: "t2", name: "open_section", input: { section: "nope" } }] },
    { stop_reason: "end_turn", content: [{ type: "text", text: "Тайёр! Режа бош саҳифада." }] }
  );
  let r = await ask({ messages: [{ role: "user", content: "Сув бўйича режа туз" }], ctx: { style: "simple", due: 2 } });
  ok(r.s === 200, "Агент жавоби 200", r.s);
  ok(r.j.actions.length === 1 && r.j.actions[0].type === "make_plan", "Фақат тўғри амал қайтди (make_plan)");
  ok(/Режа тузаман/.test(r.j.text) && /Тайёр/.test(r.j.text), "Иккала қадам матни бирлашди");
  ok(calls.length === 2, "Модель 2 марта чақирилди (асбоб натижаси билан)", calls.length);
  ok(calls[0].tools.length === 6 && calls[0].system.length === 2 && /содда/.test(calls[0].system[1].text), "Асбоблар ва қурилма ҳолати юборилди");
  const tr = calls[1].messages[calls[1].messages.length - 1];
  ok(tr.role === "user" && tr.content.length === 2 && tr.content.every((b) => b.type === "tool_result"), "Ҳар tool_use га tool_result");
  ok(tr.content[1].is_error === true, "Нотўғри амал is_error билан қайтарилди");
  ok(r.j.used === 1, "Бир савол = 1 та ойлик чеклов", r.j.used);

  /* Оддий жавоб — асбобсиз */
  calls.length = 0;
  replies.push({ stop_reason: "end_turn", content: [{ type: "text", text: "ПДК — рухсат этилган концентрация." }] });
  r = await ask({ messages: [{ role: "user", content: "ПДК нима?" }] });
  ok(r.s === 200 && r.j.actions.length === 0 && calls.length === 1 && calls[0].system.length === 1, "Асбобсиз жавоб: 1 чақирув, амал йўқ, ҳолатсиз — 1 тизим блоки");

  /* Чексиз цикл бўлмайди */
  calls.length = 0;
  for (let i = 0; i < 5; i++) replies.push({ stop_reason: "tool_use", content: [{ type: "tool_use", id: "q" + i, name: "set_style", input: { style: "deep" } }] });
  r = await ask({ messages: [{ role: "user", content: "чуқур тушунтир" }] });
  ok(calls.length === 3 && r.j.actions.length === 3 && r.j.text === "✅", "Кўпи билан 3 қадам", calls.length);
  replies.length = 0;

  console.log(failed ? `\n❌ ${failed} та хато` : "\n✅ Агент амаллари текширувидан ўтди");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
