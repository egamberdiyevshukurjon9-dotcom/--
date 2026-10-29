/* Экомун — ☀️ «Бугун сиз учун»: битта кундалик экран (Hyperpersonalization).
   • Бош саҳифада «Бўлимлар» устида: 1 дарс (Шахсий йўл тавсияси ёки агент режасидаги бугунги вазифа),
     бугунги SM-2 такрорлаш карталари, 1 ўйин ва агент тузган режанинг бугунги вазифалари.
   • Ҳар бир банд бажарилганда ўзи белгиланади (дарс тугади, карталар такрорланди, ўйин ўйналди).
   • Шахсий агент (#agent) учун ёрдамчи: дарс қидириш (findLessons) ва режани сақлаш (savePlan).
   Ҳолат фақат қурилмада: localStorage «ekotalim:bugun» (агент режаси, белгилар, яшириш). */
(() => {
  "use strict";
  const root = document.documentElement;
  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const tr = (s) => (EL() && EL().tr ? EL().tr(s) : s);
  const T = (s) => (EL() && EL().t ? EL().t(s) : s);
  const lang = () => (EL() ? EL().lang : "cyr");
  const L = (o) => {
    if (o == null) return "";
    if (typeof o === "string") return lang() === "lat" ? tr(o) : o;
    const l = lang();
    if (l === "ru") return o.ru || o.uz;
    if (l === "en") return o.en || tr(o.uz);
    if (l === "lat") return tr(o.uz);
    return o.uz;
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const H = (o) => esc(L(o));
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const App = () => window.EkoApp;
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return dayKey(d); };

  const TX = {
    title: t3("Бугун сиз учун", "Сегодня для вас", "Today for you"),
    lesson: t3("Дарс", "Урок", "Lesson"),
    review: t3("Такрорлаш", "Повторение", "Review"),
    cards: t3("та карта", "карт.", "cards"),
    noCards: t3("Бугун карта йўқ", "Сегодня карт нет", "No cards today"),
    game: t3("Ўйин", "Игра", "Game"),
    gameTxt: t3("1 та ўйин ёки аралаш машқ", "1 игра или смешанная тренировка", "1 game or mixed practice"),
    plan: t3("Агент режаси", "План агента", "Agent's plan"),
    day: t3("кун", "день", "day"),
    open: t3("Очиш", "Открыть", "Open"),
    start: t3("Бошлаш", "Начать", "Start"),
    hide: t3("Бугунга яшириш", "Скрыть на сегодня", "Hide for today"),
    ask: t3("Агентдан режа сўраш", "Попросить план у агента", "Ask the agent for a plan"),
    allDone: t3("Барча бугунги вазифалар бажарилди! 🎉", "Все задачи на сегодня выполнены! 🎉", "All of today's tasks are done! 🎉"),
    exam: t3("Якуний тест", "Итоговый тест", "Final test"),
    nothing: t3("Курслардан биринчи дарсни бошланг", "Начните первый урок в курсах", "Start your first lesson in Courses"),
    mark: t3("Бажарилди деб белгилаш", "Отметить выполненным", "Mark as done"),
    of: t3("дан", "из", "of")
  };

  /* ---------- Ҳолат ---------- */
  const KEY = "ekotalim:bugun";
  let st = { plan: null, marks: {}, hidden: "" };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  if (!st.marks || typeof st.marks !== "object") st.marks = {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };

  /* ---------- Дарс қидириш (агент амаллари учун) ---------- */
  const courses = () => ((App() && App().courses) || []);
  const S = () => ((App() && App().state) || { correct: {}, perfect: {} });
  const stage = () => (root.classList.contains("stage-maktab") ? "maktab" : "uni");
  const courseStage = (c) => c.stage || (c.audience === "bola" ? "maktab" : "uni");
  const lessonDone = (cid, li) => {
    const c = courses().find((x) => x.id === cid), l = c && c.lessons[li];
    if (!l) return false;
    if (S().perfect && S().perfect[`${cid}:${li}`]) return true;
    return (l.quiz || []).length > 0 && l.quiz.every((_, qi) => S().correct[`${cid}:${li}:${qi}`]);
  };
  /* Кирилл ва лотин бир хил кўринишга келтирилади: «сув» ва «suv» бир-бирини топади */
  const norm = (s) => tr(String(s || "").toLowerCase()).toLowerCase().replace(/[‘’ʻʼ`']/g, "").replace(/[^\p{L}\p{N}]+/gu, " ");
  const words = (s) => norm(s).split(" ").filter((w) => w.length >= 3);
  const stem = (w) => w.slice(0, Math.min(5, w.length));
  let index = null, indexStage = "";
  function buildIndex() {
    indexStage = stage();
    index = [];
    courses().filter((c) => courseStage(c) === indexStage).forEach((c) => c.lessons.forEach((l, li) => {
      const head = new Set(words(`${l.title} ${T(l.title)}`).map(stem));
      const body = new Set(words(`${c.title} ${T(c.title)} ${(l.body || []).slice(0, 2).join(" ")}`).map(stem));
      index.push({ cid: c.id, li, head, body });
    }));
  }
  function findLessons(query, n = 1) {
    if (!index || indexStage !== stage()) buildIndex();
    const q = [...new Set(words(query).map(stem))];
    if (!q.length) return [];
    return index.map((x) => {
      let s = 0;
      for (const w of q) { if (x.head.has(w)) s += 3; else if (x.body.has(w)) s += 1; }
      if (s && !lessonDone(x.cid, x.li)) s += 0.5;
      return { ...x, s };
    }).filter((x) => x.s >= Math.min(3, q.length)).sort((a, b) => b.s - a.s || a.li - b.li).slice(0, n).map((x) => {
      const c = courses().find((y) => y.id === x.cid);
      return { cid: x.cid, li: x.li, icon: c.icon || "📘", title: c.lessons[x.li].title, course: c.title };
    });
  }

  /* ---------- Агент режаси ---------- */
  function savePlan(act) {
    const days = act.days.map((d, i) => ({
      d: addDays(i),
      tasks: d.tasks.map((t, j) => {
        const hit = t.query ? findLessons(t.query, 1)[0] : null;
        return { id: `${i}:${j}`, text: t.text, section: t.section || "", cid: hit ? hit.cid : "", li: hit ? hit.li : -1 };
      })
    }));
    st.plan = { title: act.title, at: dayKey(), days };
    st.hidden = "";
    save(); render();
    return st.plan;
  }
  const todayPlan = () => {
    if (!st.plan || !Array.isArray(st.plan.days)) return null;
    const d = st.plan.days.find((x) => x.d === dayKey());
    return d ? { title: st.plan.title, n: st.plan.days.indexOf(d) + 1, all: st.plan.days.length, tasks: d.tasks } : null;
  };
  const taskDone = (t) => (t.cid && t.li >= 0 && lessonDone(t.cid, t.li)) || !!st.marks[dayKey() + ":" + t.id];

  /* ---------- Экран ---------- */
  function items() {
    const out = [], today = (window.EkoGame && EkoGame.today && EkoGame.today()) || {};
    const plan = todayPlan(), planLesson = plan && plan.tasks.find((t) => t.cid && t.li >= 0);
    /* 1. Дарс: агент режасида бўлса — ўша, бўлмаса Шахсий йўл тавсияси */
    let les = null;
    if (planLesson) les = { cid: planLesson.cid, li: planLesson.li };
    else if (window.EkoPath) { const r = EkoPath.recommend(1)[0]; if (r) les = { cid: r.c.id, li: r.li }; }
    if (les) {
      const c = courses().find((x) => x.id === les.cid);
      if (c) {
        const txt = les.li < 0 ? `📝 ${L(TX.exam)}: ${T(c.title)}` : `${c.icon || "📘"} ${T(c.lessons[les.li].title)}`;
        const done = les.li < 0 ? false : lessonDone(les.cid, les.li) || (!planLesson && (today.lesson || 0) > 0);
        out.push({ k: "lesson", ic: "fa-book-open", h: L(TX.lesson), txt, done, btn: `data-bles="${esc(les.cid)}:${les.li}"` });
      }
    } else out.push({ k: "lesson", ic: "fa-book-open", h: L(TX.lesson), txt: L(TX.nothing), done: false, btn: `data-bgo="kurslar"` });
    /* 2. Такрорлаш */
    const due = window.EkoGame && EkoGame.due ? EkoGame.due() : 0;
    const rev = today.review || 0;
    out.push({ k: "review", ic: "fa-brain", h: L(TX.review), txt: due ? `${due} ${L(TX.cards)}` : L(TX.noCards), done: !due, btn: due ? `data-bgo="takror"` : "", n: rev });
    /* 3. Ўйин */
    const played = ["boss", "xw", "mix", "test", "air"].some((k) => today[k]);
    out.push({ k: "game", ic: "fa-gamepad", h: L(TX.game), txt: L(TX.gameTxt), done: played, btn: `data-bgo="oyinmarkaz"` });
    /* 4. Агент режасининг бошқа вазифалари */
    if (plan) plan.tasks.filter((t) => t !== planLesson).forEach((t) => out.push({
      k: "task", ic: "fa-robot", h: `${L(TX.plan)} · ${plan.n}/${plan.all} ${L(TX.day)}`, txt: t.text, done: taskDone(t), task: t,
      btn: t.cid && t.li >= 0 ? `data-bles="${esc(t.cid)}:${t.li}"` : t.section ? `data-bgo="${esc(t.section)}"` : ""
    }));
    return out;
  }
  function render() {
    const old = document.getElementById("bgBox");
    const grid = document.querySelector("#apps .app-grid");
    if (!grid || !App() || st.hidden === dayKey()) { if (old) old.remove(); return; }
    const list = items(), done = list.filter((x) => x.done).length;
    const C = 2 * Math.PI * 16, part = list.length ? done / list.length : 0;
    const plan = todayPlan();
    const box = old || document.createElement("section");
    box.id = "bgBox"; box.className = "bg-box"; box.setAttribute("aria-labelledby", "bgTitle"); box.setAttribute("data-notr", "");
    box.innerHTML = `<div class="bg-head">
        <svg class="bg-ring" viewBox="0 0 40 40" role="img" aria-label="${done} ${H(TX.of)} ${list.length}"><circle cx="20" cy="20" r="16" fill="none" stroke="var(--line)" stroke-width="5"/><circle cx="20" cy="20" r="16" fill="none" stroke="var(--primary)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(C * part).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 20 20)"/><text x="20" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">${done}/${list.length}</text></svg>
        <div class="bg-ttl"><h3 id="bgTitle">☀️ ${H(TX.title)}</h3>${plan ? `<small class="muted">🤖 ${esc(plan.title)}</small>` : ""}</div>
        <button type="button" class="btn btn-ghost btn-sm bg-x" data-bhide aria-label="${H(TX.hide)}" title="${H(TX.hide)}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </div>
      ${done === list.length ? `<p class="bg-all">${H(TX.allDone)}</p>` : ""}
      <ul class="bg-list">${list.map((x, i) => `<li class="${x.done ? "done" : ""}">
        ${x.k === "task" && !(x.task.cid && x.task.li >= 0) ? `<button type="button" class="bg-chk" data-bmark="${i}" aria-pressed="${x.done}" aria-label="${H(TX.mark)}">${x.done ? "✓" : ""}</button>` : `<span class="bg-chk" aria-hidden="true">${x.done ? "✓" : ""}</span>`}
        <span class="bg-t"><small><i class="fa-solid ${x.ic}" aria-hidden="true"></i> ${esc(x.h)}</small><span>${esc(x.txt)}</span></span>
        ${x.btn && !x.done ? `<button type="button" class="btn btn-primary btn-sm" ${x.btn}>${H(x.k === "lesson" ? TX.start : TX.open)} →</button>` : ""}
      </li>`).join("")}</ul>
      ${plan ? "" : `<a class="bg-ask small" href="#agent"><i class="fa-solid fa-robot" aria-hidden="true"></i> ${H(TX.ask)}</a>`}`;
    if (!old) { const back = document.getElementById("ylBack"); (back && back.parentNode === grid.parentNode ? back : grid).before(box); }
    box._list = list;
  }
  document.addEventListener("click", (e) => {
    const box = e.target.closest && e.target.closest("#bgBox");
    if (!box) return;
    if (e.target.closest("[data-bhide]")) { st.hidden = dayKey(); save(); box.remove(); return; }
    const m = e.target.closest("[data-bmark]");
    if (m) { const it = box._list[+m.dataset.bmark]; if (it && it.task) { const k = dayKey() + ":" + it.task.id; if (st.marks[k]) delete st.marks[k]; else st.marks[k] = 1; save(); render(); } return; }
    const ls = e.target.closest("[data-bles]");
    if (ls) {
      const [cid, li] = [ls.dataset.bles.slice(0, ls.dataset.bles.lastIndexOf(":")), +ls.dataset.bles.slice(ls.dataset.bles.lastIndexOf(":") + 1)];
      if (li >= 0 && App() && App().openLesson) App().openLesson(cid, li);
      else if (window.EkoNav) EkoNav.go("kurslar");
      return;
    }
    const g = e.target.closest("[data-bgo]");
    if (g) { if (window.EkoNav) EkoNav.go(g.dataset.bgo); else location.hash = "#" + g.dataset.bgo; }
  });
  /* Эски белгиларни тозалаш (14 кундан эски) */
  const cut = addDays(-14);
  for (const k of Object.keys(st.marks)) if (k.slice(0, 10) < cut) delete st.marks[k];
  if (st.plan && st.plan.days && st.plan.days.length && st.plan.days[st.plan.days.length - 1].d < dayKey()) st.plan = null;
  save();

  let tm = 0;
  const later = () => { clearTimeout(tm); tm = setTimeout(render, 300); };
  ["eko:lessondone", "eko:q", "eko:answer", "eko:lang", "eko:stage"].forEach((ev) => window.addEventListener(ev, later));
  window.addEventListener("eko:stage", () => { index = null; });
  window.addEventListener("hashchange", () => { if (!location.hash || location.hash === "#bosh") later(); });
  window.addEventListener("storage", (e) => { if (e.key === KEY || e.key === "ekotalim:game") { try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (x) { /* ignore */ } later(); } });

  const css = document.createElement("style");
  css.textContent = `
.bg-box{margin:0 0 16px;padding:14px 16px;border:1px solid var(--line);border-radius:20px;background:var(--card);display:grid;gap:10px}
.bg-head{display:flex;align-items:center;gap:12px}.bg-ring{width:48px;height:48px;flex:none;color:var(--text)}
.bg-ttl{flex:1;min-width:0;display:grid}.bg-ttl h3{margin:0;font-size:1.08rem}.bg-ttl small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bg-all{margin:0;font-weight:600;color:var(--primary)}
.bg-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.bg-list li{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:14px;background:var(--bg-alt,var(--bg))}
.bg-list li.done .bg-t>span{text-decoration:line-through;opacity:.65}
.bg-chk{flex:none;width:26px;height:26px;border-radius:50%;border:2px solid var(--line);display:grid;place-items:center;font-weight:700;color:var(--on-primary,#fff);background:transparent;padding:0;font:inherit;line-height:1}
button.bg-chk{cursor:pointer}.bg-list li.done .bg-chk{background:var(--primary);border-color:var(--primary)}
.bg-t{flex:1;min-width:0;display:grid;gap:1px}.bg-t small{color:var(--muted);font-size:.76rem}.bg-t>span{overflow-wrap:anywhere}
.bg-ask{justify-self:start;color:var(--primary);font-weight:600;text-decoration:none}
@media (max-width:560px){.bg-list li{flex-wrap:wrap}.bg-t{flex:1 1 calc(100% - 40px)}.bg-list li .btn{margin-left:36px}}`;
  document.head.appendChild(css);

  window.EkoBugun = { findLessons, savePlan, render, get plan() { return st.plan; }, lessonDone };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else setTimeout(render, 0);
})();
