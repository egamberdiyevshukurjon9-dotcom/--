/* Экомун — 📖 «Экологик ҳуқуқ: интерактив дарслик» (университет босқичи, #qonun ичидаги «Дарслик» бўлими).
   Фойдаланувчи юборган экологик қонунлар ва ҳужжатлар асосида: 6 боб, ҳар бир ҳужжатга алоҳида дарс.
   Ҳар дарсда: ўқув мақсадлари, кириш, атамалар, моддалар шарҳи, муҳим рақамлар, казус, квиз,
   «тўғри/нотўғри», мослаштириш, кроссворд, мунозара ва ўқитувчи учун интерактив усул.
   Дарслик бўйича қидирув, хронология, якуний имтиҳон, дарс ёки бутун дарсликни PDF қилиш.
   Маълумот: vendor/eko-qonun-darslik-data.js (window.EKO_DARSLIK). Матнлар { uz, ru, en };
   лотин алифбоси EkoLang.tr орқали. Натижалар фақат қурилмада (localStorage «ekotalim:darslik»).
   vendor/eko-qonun.js «darslik» табида window.EkoDarslik.html() ни чақиради. */
(() => {
  "use strict";
  const ROOT = document.getElementById("qnRoot");
  if (!ROOT) return;

  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const tr = (s) => (EL() ? EL().tr(s) : s);
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
  const chN = (n) => (lang() === "ru" ? "Глава " + n : lang() === "en" ? "Chapter " + n : n + "-" + L("боб"));
  const noL = (n) => { const v = L(n); return lang() === "ru" ? v.replace(/ЎРҚ/g, "ЗРУ") : lang() === "en" ? v.replace(/ЎРҚ/g, "ZRU") : v; };
  const D = () => window.EKO_DARSLIK || { CH: [], LESSONS: [], ASOF: "" };
  const LS = () => D().LESSONS || [];
  const byId = (id) => LS().find((x) => x.id === id);
  const App = () => window.EkoApp;
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(L(o)); };
  const paras = (o) => L(o).split(/\n{2,}/).map((p) => `<p>${esc(p)}</p>`).join("");

  /* ---------- Ҳолат ---------- */
  const KEY = "ekotalim:darslik";
  let st = { done: {}, quiz: {}, xp: {}, notes: {}, last: null, exam: 0 };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  const xp = (k, n, why) => {
    if (st.xp[k]) return;
    st.xp[k] = 1; save();
    const a = App(); if (a && a.addXp) a.addXp(n, L(why));
  };

  /* ---------- Матнлар ---------- */
  const TX = {
    title: t3("Экологик ҳуқуқ: интерактив дарслик", "Экологическое право: интерактивный учебник", "Environmental law: an interactive textbook"),
    lead: t3("Сиз юборган қонун ва ҳужжатлар бир дарсликка жамланди: ҳар бир ҳужжат — алоҳида дарс. Аввал ўқинг, кейин машқлар билан мустаҳкамланг, охирида имтиҳон топширинг.",
      "Присланные законы и документы собраны в один учебник: каждый документ — отдельный урок. Сначала читайте, затем закрепляйте упражнениями, в конце сдайте экзамен.",
      "The laws and documents you sent are gathered into one textbook: each document is a separate lesson. Read first, practise with the exercises, then take the exam."),
    lessons: t3("дарс", "уроков", "lessons"),
    chapters: t3("боб", "глав", "chapters"),
    arts: t3("модда шарҳи", "комментариев к статьям", "article notes"),
    terms: t3("атама", "терминов", "terms"),
    tasks: t3("машқ", "заданий", "exercises"),
    cont: t3("▶ Давом эттириш", "▶ Продолжить", "▶ Continue"),
    start: t3("▶ Биринчи дарсдан бошлаш", "▶ Начать с первого урока", "▶ Start with lesson 1"),
    exam: t3("🎓 Якуний имтиҳон", "🎓 Итоговый экзамен", "🎓 Final exam"),
    pdfAll: t3("Бутун дарслик PDF", "Весь учебник в PDF", "Whole textbook as PDF"),
    pdfLesson: t3("Дарсни PDF қилиш", "Урок в PDF", "Save lesson as PDF"),
    search: t3("Дарсликдан қидириш: атама, модда, рақам…", "Поиск по учебнику: термин, статья, число…", "Search the textbook: term, article, number…"),
    found: t3("Топилди", "Найдено", "Found"),
    none: t3("Ҳеч нарса топилмади. Бошқа сўз билан уриниб кўринг.", "Ничего не найдено. Попробуйте другое слово.", "Nothing found. Try another word."),
    all: t3("Барчаси", "Все", "All"),
    inForce: t3("Амалдаги", "Действующие", "In force"),
    hist: t3("Тарихий", "Исторические", "Historical"),
    old: t3("кучини йўқотган", "утратил силу", "no longer in force"),
    toc: t3("← Мундарижа", "← Оглавление", "← Contents"),
    prev: t3("← Олдинги", "← Назад", "← Previous"),
    next: t3("Кейингиси →", "Дальше →", "Next →"),
    lesson: t3("Дарс", "Урок", "Lesson"),
    ch: t3("боб", "глава", "chapter"),
    goals: t3("🎯 Дарс якунида сиз:", "🎯 К концу урока вы:", "🎯 By the end of the lesson you will:"),
    intro: t3("Кириш", "Введение", "Introduction"),
    termsH: t3("📘 Асосий тушунчалар", "📘 Основные понятия", "📘 Key terms"),
    termsHint: t3("Атамани босинг — таърифи очилади. Аввал ўзингиз эслашга ҳаракат қилинг.", "Нажмите на термин — откроется определение. Сначала попробуйте вспомнить сами.", "Tap a term to reveal its definition. Try to recall it first."),
    artsH: t3("⚖️ Моддалар шарҳи", "⚖️ Комментарий к статьям", "⚖️ Article-by-article notes"),
    openAll: t3("Ҳаммасини очиш", "Раскрыть все", "Expand all"),
    factsH: t3("📌 Ёдда тутинг: рақамлар ва муддатлар", "📌 Запомните: цифры и сроки", "📌 Remember: numbers and deadlines"),
    doc: t3("Ҳужжат", "Документ", "Document"),
    force: t3("кучга кирган", "вступил в силу", "in force from"),
    asof: t3("матн ҳолати", "текст по состоянию на", "text as of"),
    official: t3("Расмий матн (lex.uz)", "Официальный текст (lex.uz)", "Official text (lex.uz)"),
    verify: t3("Расмий матн ва охирги таҳрирни lex.uz да текширинг: қонунлар ўзгариб туради.", "Сверяйте официальный текст и последнюю редакцию на lex.uz: законы меняются.", "Check the official text and latest edition on lex.uz: laws change."),
    practice: t3("🧩 Машқлар", "🧩 Упражнения", "🧩 Exercises"),
    ex: {
      quiz: t3("Квиз", "Квиз", "Quiz"),
      tf: t3("Тўғри/нотўғри", "Верно/неверно", "True/false"),
      match: t3("Мослаштириш", "Сопоставление", "Matching"),
      xw: t3("Кроссворд", "Кроссворд", "Crossword"),
      kaz: t3("Казус", "Казус", "Case"),
      deb: t3("Мунозара", "Дискуссия", "Debate")
    },
    right: t3("✓ Тўғри!", "✓ Верно!", "✓ Correct!"),
    wrong: t3("✕ Унчалик эмас.", "✕ Не совсем.", "✕ Not quite."),
    yes: t3("Тўғри", "Верно", "True"),
    no: t3("Нотўғри", "Неверно", "False"),
    check: t3("Текшириш", "Проверить", "Check"),
    again: t3("Қайтадан", "Заново", "Start again"),
    pick: t3("— танланг —", "— выберите —", "— choose —"),
    matchHint: t3("Чапдаги ҳар бир бандга ўнгдан мос жавобни танланг.", "Для каждого пункта слева выберите подходящий ответ.", "For each item on the left choose the matching answer."),
    kazQ: t3("Савол", "Вопрос", "Question"),
    kazYour: t3("Жавобингиз (моддаларга таяниб ёзинг)", "Ваш ответ (со ссылками на статьи)", "Your answer (cite the articles)"),
    save: t3("💾 Сақлаш", "💾 Сохранить", "💾 Save"),
    saved: t3("Сақланди", "Сохранено", "Saved"),
    model: t3("👀 Намунавий жавоб", "👀 Образец ответа", "👀 Model answer"),
    debHint: t3("Икки томон учун далил ёзинг: ҳар бирига камида битта модда келтиринг. Кейин хулоса чиқаринг.", "Запишите доводы обеих сторон, к каждому — хотя бы одну статью. Затем сделайте вывод.", "Write arguments for both sides, citing at least one article each, then conclude."),
    pro: t3("👍 Тарафдор", "👍 За", "👍 For"),
    con: t3("👎 Қарши", "👎 Против", "👎 Against"),
    concl: t3("⚖️ Хулосам", "⚖️ Мой вывод", "⚖️ My conclusion"),
    method: t3("👩‍🏫 Аудиторияда: интерактив усул", "👩‍🏫 В аудитории: интерактивный метод", "👩‍🏫 In class: interactive method"),
    finish: t3("✅ Дарсни якунладим", "✅ Урок пройден", "✅ I've finished this lesson"),
    doneTag: t3("ўзлаштирилди", "пройден", "done"),
    score: t3("Натижа", "Результат", "Score"),
    progress: t3("Ўзлаштириш", "Прогресс", "Progress"),
    timeline: t3("🗓 Хронология: ҳужжатлар қабул қилинган йил бўйича", "🗓 Хронология: документы по году принятия", "🗓 Timeline: documents by year of adoption"),
    examLead: t3("Барча дарслардан тасодифий 20 та савол. 80% ва ундан юқори натижа — дарслик бўйича сертификат даражаси.", "20 случайных вопросов из всех уроков. 80% и выше — уровень сертификата по учебнику.", "20 random questions from all lessons. 80% or more is the textbook certificate level."),
    examQ: t3("Савол", "Вопрос", "Question"),
    examDone: t3("Имтиҳон натижаси", "Результат экзамена", "Exam result"),
    weak: t3("Такрорлаш керак бўлган дарслар:", "Уроки, которые стоит повторить:", "Lessons worth revisiting:"),
    passed: t3("🎉 Аъло! Сиз дарслик бўйича имтиҳондан ўтдингиз.", "🎉 Отлично! Вы сдали экзамен по учебнику.", "🎉 Excellent! You passed the textbook exam."),
    failed: t3("Яхши уриниш. Қуйидаги дарсларни такрорлаб, қайта топширинг.", "Хорошая попытка. Повторите уроки ниже и пересдайте.", "Good try. Revisit the lessons below and retake the exam."),
    best: t3("Энг яхши натижа", "Лучший результат", "Best result"),
    sources: t3("Манба: фойдаланувчи юборган ҳужжатлар матни (LexUZ нусхалари ва имзоланган нусхалар). Ҳар бир дарсда ҳужжат рақами, санаси ва ҳолати кўрсатилган.",
      "Источник: тексты присланных документов (копии LexUZ и подписанные экземпляры). В каждом уроке указаны номер, дата и статус документа.",
      "Source: the texts of the documents provided (LexUZ copies and signed originals). Each lesson shows the document's number, date and status."),
    fld: { title: t3("сарлавҳа", "заголовок", "title"), intro: t3("кириш", "введение", "introduction"), terms: t3("атама", "термин", "term"), arts: t3("модда", "статья", "article"), facts: t3("рақам/муддат", "цифра/срок", "number/deadline"), kazus: t3("казус", "казус", "case"), quiz: t3("савол", "вопрос", "question") },
    xwTip: t3("Кроссвордни ечинг: изоҳлар дарс матнига асосланган.", "Решите кроссворд: подсказки основаны на тексте урока.", "Solve the crossword: the clues come from the lesson text.")
  };

  /* ---------- Ёрдамчилар ---------- */
  const isOld = (l) => !!l.old;
  const order = () => {
    const ch = (D().CH || []).map((c) => c.n);
    return LS().slice().sort((a, b) => ch.indexOf(a.ch) - ch.indexOf(b.ch));
  };
  const numOf = (l) => order().indexOf(l) + 1;
  const quizMax = (l) => (l.quiz || []).length;
  const passQuiz = (l) => (st.quiz[l.id] || 0) >= Math.ceil(quizMax(l) * 0.8);
  /* Ҳар доим бир хил тасодифий тартиб (seed) */
  function rng(seed) {
    let h = 2166136261;
    for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }
  const shuffle = (arr, seed) => { const r = rng(seed); const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const crossWords = (l) => {
    const c = l.cross || {};
    const list = lang() === "ru" ? (c.ru && c.ru.length ? c.ru : c.uz) : lang() === "en" ? (c.en && c.en.length ? c.en : c.uz) : c.uz;
    return (list || []).map(([w, q]) => [String(w).toLowerCase(), q]);
  };
  const markDone = (l) => {
    if (st.done[l.id]) return;
    st.done[l.id] = 1; save();
    xp("dk:done:" + l.id, 15, t3("дарслик: дарс якунланди", "учебник: урок пройден", "textbook: lesson finished"));
    if (order().every((x) => st.done[x.id])) xp("dk:all", 50, t3("дарслик тўлиқ ўзлаштирилди", "учебник пройден полностью", "textbook completed"));
  };

  /* ---------- Кўриниш ҳолати ---------- */
  let cur = null, ex = "quiz", q = "", flt = "all", openArts = false;
  let quizPick = {}, tfPick = {}, matchPick = {}, matchChecked = false, kazShow = false;
  let exam = null; /* { qs:[{l,i}], i, pick, ok, done, wrong:{} } */

  /* ========== Мундарижа ========== */
  function stats() {
    const ls = LS();
    const sum = (f) => ls.reduce((s, l) => s + f(l), 0);
    return {
      n: ls.length, ch: (D().CH || []).length,
      arts: sum((l) => (l.arts || []).length), terms: sum((l) => (l.terms || []).length),
      tasks: sum((l) => (l.quiz || []).length + (l.tf || []).length + (l.match || []).length + ((l.cross && l.cross.uz) || []).length + 2)
    };
  }
  function tocView() {
    const s = stats();
    const done = order().filter((l) => st.done[l.id]).length;
    const pct = s.n ? Math.round((done / s.n) * 100) : 0;
    const last = st.last && byId(st.last);
    const head = `<div class="qn-card dk-hero">
      <h3>📖 ${H(TX.title)}</h3>
      <p class="muted">${H(TX.lead)}</p>
      <div class="qn-kpi">
        <div><b>${s.ch}</b>${H(TX.chapters)}</div><div><b>${s.n}</b>${H(TX.lessons)}</div>
        <div><b>${s.arts}</b>${H(TX.arts)}</div><div><b>${s.terms}</b>${H(TX.terms)}</div><div><b>${s.tasks}</b>${H(TX.tasks)}</div>
      </div>
      <div class="qn-prog" style="margin-top:12px"><span class="small">${H(TX.progress)}: ${done}/${s.n}</span><div class="qn-meter"><i style="width:${pct}%;background:var(--primary)"></i></div><b>${pct}%</b></div>
      <div class="qn-acts pdf-skip">
        <button class="btn btn-primary btn-sm" data-dk-open="${esc(last ? last.id : (order()[0] || {}).id || "")}">${H(last ? TX.cont : TX.start)}${last ? ": " + H(last.title) : ""}</button>
        <button class="btn btn-ghost btn-sm" data-dk="exam">${H(TX.exam)}${st.exam ? ` · ${H(TX.best)}: ${st.exam}%` : ""}</button>
        <button class="btn btn-ghost btn-sm" data-dk="pdf-all"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdfAll)}</button>
      </div>
      <p class="small muted">${H(TX.sources)}</p>
    </div>`;
    const search = `<div class="qn-card pdf-skip">
      <label class="dk-search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input type="search" data-dk-q value="${esc(q)}" placeholder="${H(TX.search)}" aria-label="${H(TX.search)}"></label>
      ${q.trim().length >= 2 ? searchResults() : ""}
      <div class="qn-roles" role="group">${[["all", TX.all], ["now", TX.inForce], ["old", TX.hist]].map(([k, t]) => `<button type="button" class="chip ${flt === k ? "active" : ""}" data-dk-f="${k}">${H(t)}</button>`).join("")}</div>
    </div>`;
    const chs = (D().CH || []).map((c) => {
      const ls = order().filter((l) => l.ch === c.n && (flt === "all" || (flt === "old") === isOld(l)));
      if (!ls.length) return "";
      const dn = ls.filter((l) => st.done[l.id]).length;
      return `<div class="qn-card dk-ch">
        <h3>${esc(c.ic || "")} ${chN(c.n)}. ${H(c.t)}</h3>
        <p class="small muted">${H(c.d)} · ${dn}/${ls.length}</p>
        <ol class="dk-list">${ls.map((l) => `<li><button type="button" class="dk-row ${st.done[l.id] ? "done" : ""}" data-dk-open="${esc(l.id)}">
          <span class="ly-ic" aria-hidden="true">${esc(l.icon || "📄")}</span>
          <span class="dk-row-t"><b>${numOf(l)}. ${H(l.title)}</b>
            <small>${esc(noL(l.doc.no))}${l.doc.date ? " · " + esc(l.doc.date) : ""}${isOld(l) ? ` · <span class="qn-tag old">${H(TX.old)}</span>` : ""}${st.done[l.id] ? ` · <span class="qn-tag">✓ ${H(TX.doneTag)}</span>` : ""}${st.quiz[l.id] != null ? ` · ${H(TX.ex.quiz)} ${st.quiz[l.id]}/${quizMax(l)}` : ""}</small></span>
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button></li>`).join("")}</ol>
      </div>`;
    }).join("");
    const years = {};
    order().forEach((l) => { const y = (String(l.doc.date || "").match(/(\d{4})$/) || [])[1] || "—"; (years[y] = years[y] || []).push(l); });
    const tl = `<div class="qn-card"><details><summary><b>${H(TX.timeline)}</b></summary>
      <ol class="dk-tl">${Object.keys(years).sort().map((y) => `<li><b>${esc(y)}</b> ${years[y].map((l) => `<button type="button" class="chip" data-dk-open="${esc(l.id)}">${esc(l.icon || "")} ${esc(noL(l.doc.no))}</button>`).join(" ")}</li>`).join("")}</ol>
    </details></div>`;
    return head + search + chs + tl;
  }

  /* ---------- Қидирув ---------- */
  const norm = (s) => (EL() && EL().fold ? EL().fold(String(s || "")) : String(s || "")).toLowerCase().replace(/[ʻʼ'`’‘]/g, "");
  function hits() {
    const needle = norm(q.trim());
    if (needle.length < 2) return [];
    const out = [];
    const add = (l, f, s, extra) => { const v = L(s); const i = norm(v).indexOf(needle); if (i >= 0) out.push({ l, f, v, i, extra }); };
    for (const l of order()) {
      add(l, "title", l.title);
      (l.terms || []).forEach(([a, b]) => add(l, "terms", { uz: L(a) + " — " + L(b), ru: L(a) + " — " + L(b), en: L(a) + " — " + L(b) }));
      (l.arts || []).forEach(([a, b], k) => add(l, "arts", { uz: L(a) + ": " + L(b), ru: L(a) + ": " + L(b), en: L(a) + ": " + L(b) }, k));
      (l.facts || []).forEach((f) => add(l, "facts", f));
      add(l, "intro", l.intro);
      if (l.kazus) add(l, "kazus", l.kazus.t);
      (l.quiz || []).forEach((x) => add(l, "quiz", x.q));
      if (out.length > 60) break;
    }
    return out;
  }
  function snippet(h) {
    const n = q.trim().length, a = Math.max(0, h.i - 60), b = Math.min(h.v.length, h.i + n + 90);
    return (a ? "…" : "") + esc(h.v.slice(a, h.i)) + "<mark>" + esc(h.v.slice(h.i, h.i + n)) + "</mark>" + esc(h.v.slice(h.i + n, b)) + (b < h.v.length ? "…" : "");
  }
  function searchResults() {
    const hs = hits();
    if (!hs.length) return `<p class="muted small" aria-live="polite">${H(TX.none)}</p>`;
    return `<p class="small" aria-live="polite"><b>${H(TX.found)}: ${hs.length >= 60 ? "60+" : hs.length}</b></p>
      <ul class="dk-hits">${hs.slice(0, 40).map((h) => `<li><button type="button" data-dk-open="${esc(h.l.id)}" ${h.extra != null ? `data-dk-art="${h.extra}"` : ""}>
        <span class="qn-tag">${esc(h.l.icon || "")} ${esc(noL(h.l.doc.no))} · ${H(TX.fld[h.f])}</span><br><span>${snippet(h)}</span></button></li>`).join("")}</ul>`;
  }

  /* ========== Дарс ========== */
  function metaTags(l) {
    const d = l.doc || {};
    return `<div class="qn-meta">
      <span class="qn-tag">${esc(noL(d.no))}</span>${d.date ? `<span class="qn-tag">${esc(d.date)}</span>` : ""}
      ${d.force ? `<span class="qn-tag">${H(TX.force)}: ${H(d.force)}</span>` : ""}
      ${d.status ? `<span class="qn-tag ${isOld(l) ? "old" : ""}">${H(d.status)}</span>` : ""}
      ${d.asof ? `<span class="qn-tag warn">${H(TX.asof)}: ${H(d.asof)}</span>` : ""}
      ${d.struct ? `<span class="qn-tag">${H(d.struct)}</span>` : ""}
    </div>`;
  }
  function lessonView(l) {
    const all = order(), i = all.indexOf(l);
    const p = all[i - 1], n = all[i + 1];
    const c = (D().CH || []).find((x) => x.n === l.ch) || {};
    const nav = `<div class="dk-nav pdf-skip">
      <button class="btn btn-ghost btn-sm" data-dk="toc">${H(TX.toc)}</button>
      <span class="small muted">${chN(l.ch)} · ${H(TX.lesson)} ${i + 1}/${all.length}</span>
      <span class="dk-pn">${p ? `<button class="btn btn-ghost btn-sm" data-dk-open="${esc(p.id)}" aria-label="${H(TX.prev)}">${H(TX.prev)}</button>` : ""}${n ? `<button class="btn btn-ghost btn-sm" data-dk-open="${esc(n.id)}">${H(TX.next)}</button>` : ""}</span>
    </div>`;
    const head = `<div class="qn-card" id="dkLesson">
      <p class="small muted">${esc(c.ic || "")} ${chN(l.ch)}. ${H(c.t)}</p>
      <h3 class="dk-title"><span aria-hidden="true">${esc(l.icon || "📄")}</span> ${H(TX.lesson)} ${i + 1}. ${H(l.title)}</h3>
      ${metaTags(l)}
      ${l.doc.url ? `<p class="qn-src"><a href="${esc(l.doc.url)}" target="_blank" rel="noopener">${H(TX.official)} ↗</a></p>` : ""}
      <p class="small muted">${H(TX.verify)}</p>
      <div class="lesson-goal pdf-box dk-goal"><b>${H(TX.goals)}</b><ul>${(l.goals || []).map((g) => `<li>${H(g)}</li>`).join("")}</ul></div>
      <h4>${H(TX.intro)}</h4>${paras(l.intro)}
    </div>`;
    const terms = (l.terms || []).length ? `<div class="qn-card">
      <h3>${H(TX.termsH)}</h3><p class="small muted pdf-skip">${H(TX.termsHint)}</p>
      <div class="dk-terms">${l.terms.map(([a, b]) => `<details class="dk-term"><summary>${H(a)}</summary><p>${H(b)}</p></details>`).join("")}</div>
    </div>` : "";
    const arts = (l.arts || []).length ? `<div class="qn-card">
      <div class="dk-h"><h3>${H(TX.artsH)}</h3><button class="btn btn-ghost btn-sm pdf-skip" data-dk="arts-all">${H(TX.openAll)}</button></div>
      <div class="dk-arts">${l.arts.map(([a, b], k) => `<details class="dk-art" data-k="${k}" ${openArts ? "open" : ""}><summary>${H(a)}</summary><p>${H(b)}</p></details>`).join("")}</div>
    </div>` : "";
    const facts = (l.facts || []).length ? `<div class="qn-card"><h3>${H(TX.factsH)}</h3>
      <ul class="dk-facts">${l.facts.map((f) => `<li>${H(f)}</li>`).join("")}</ul></div>` : "";
    const exs = ["quiz", "tf", "match", "xw", "kaz", "deb"].filter((k) => ({ quiz: (l.quiz || []).length, tf: (l.tf || []).length, match: (l.match || []).length, xw: crossWords(l).length >= 2, kaz: !!l.kazus, deb: !!l.debate })[k]);
    if (!exs.includes(ex)) ex = exs[0] || "quiz";
    const practice = `<div class="qn-card" id="dkPractice">
      <h3>${H(TX.practice)}</h3>
      <div class="qn-roles pdf-skip" role="tablist">${exs.map((k) => `<button type="button" role="tab" aria-selected="${k === ex}" class="chip ${k === ex ? "active" : ""}" data-dk-ex="${k}">${H(TX.ex[k])}${exDone(l, k) ? " ✓" : ""}</button>`).join("")}</div>
      <div class="dk-ex">${({ quiz: quizView, tf: tfView, match: matchView, xw: xwView, kaz: kazView, deb: debView })[ex](l)}</div>
    </div>`;
    const method = l.method ? `<div class="qn-card"><h3>${H(TX.method)}</h3><p><b>${H(l.method.n)}</b></p>${paras(l.method.d)}</div>` : "";
    const foot = `<div class="qn-acts pdf-skip">
      <button class="btn btn-primary btn-sm" data-dk="finish" ${st.done[l.id] ? "disabled" : ""}>${H(TX.finish)}${st.done[l.id] ? " ✓" : ""}</button>
      <button class="btn btn-ghost btn-sm" data-dk="pdf-lesson"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdfLesson)}</button>
      ${n ? `<button class="btn btn-ghost btn-sm" data-dk-open="${esc(n.id)}">${H(TX.next)}: ${H(n.title)}</button>` : `<button class="btn btn-ghost btn-sm" data-dk="exam">${H(TX.exam)}</button>`}
    </div>`;
    return nav + head + terms + arts + facts + practice + method + foot;
  }
  const exDone = (l, k) => !!st.xp[`dk:${k}:${l.id}`];

  /* --- Квиз --- */
  function quizView(l) {
    const qs = l.quiz || [];
    const ans = Object.keys(quizPick).length, ok = qs.filter((x, i) => quizPick[i] === x.c).length;
    return `<ol class="dk-quiz">${qs.map((x, i) => {
      const p = quizPick[i];
      return `<li data-pdf-q="${i}"><p data-pdf-qt><b>${H(x.q)}</b></p>
        <div class="qn-opts">${x.a.map((o, k) => `<button type="button" data-pdf-opt class="sg-opt ${p != null ? (k === x.c ? "ok" : k === p ? "bad" : "") : ""}" data-dk-qa="${i}:${k}" ${p != null ? "disabled" : ""}>${H(o)}</button>`).join("")}</div>
        ${p != null ? `<p class="qn-fb ${p === x.c ? "" : "bad"}">${H(p === x.c ? TX.right : TX.wrong)} ${H(x.why)}</p>` : ""}</li>`;
    }).join("")}</ol>
    ${ans === qs.length && qs.length ? `<p class="qn-score">${H(TX.score)}: ${ok}/${qs.length}</p><div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-dk="quiz-reset">${H(TX.again)}</button></div>` : ""}`;
  }
  /* --- Тўғри/нотўғри --- */
  function tfView(l) {
    return `<ul class="qn-sort">${(l.tf || []).map(([s, v, why], i) => {
      const p = tfPick[i];
      return `<li class="${p == null ? "" : p === v ? "ok" : "bad"}"><span>${H(s)}${p != null ? `<br><small class="${p === v ? "" : "dk-bad"}">${H(p === v ? TX.right : TX.wrong)} ${H(why)}</small>` : ""}</span>
        <span class="dk-tfb"><button type="button" class="btn btn-sm ${p === true ? "btn-primary" : "btn-ghost"}" data-dk-tf="${i}:1" ${p != null ? "disabled" : ""}>${H(TX.yes)}</button>
        <button type="button" class="btn btn-sm ${p === false ? "btn-primary" : "btn-ghost"}" data-dk-tf="${i}:0" ${p != null ? "disabled" : ""}>${H(TX.no)}</button></span></li>`;
    }).join("")}</ul>
    ${Object.keys(tfPick).length ? `<div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-dk="tf-reset">${H(TX.again)}</button></div>` : ""}`;
  }
  /* --- Мослаштириш --- */
  function matchView(l) {
    const m = l.match || [];
    const opts = shuffle(m.map((_, i) => i), l.id + ":m");
    return `<p class="small muted">${H(TX.matchHint)}</p>
      <ul class="qn-sort">${m.map(([a], i) => {
        const p = matchPick[i];
        const cls = matchChecked ? (p === i ? "ok" : "bad") : "";
        return `<li class="${cls}"><span><b>${H(a)}</b></span>
          <select class="dk-sel" data-dk-m="${i}" aria-label="${H(a)}"><option value="">${H(TX.pick)}</option>${opts.map((k) => `<option value="${k}" ${p === k ? "selected" : ""}>${H(m[k][1])}</option>`).join("")}</select></li>`;
      }).join("")}</ul>
      <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-dk="match-check">${H(TX.check)}</button>
      ${matchChecked ? `<span class="qn-score" style="font-size:1.1rem">${m.filter((_, i) => matchPick[i] === i).length}/${m.length}</span>` : ""}</div>`;
  }
  /* --- Кроссворд --- */
  function xwView(l) {
    queueMicrotask(() => mountXw(l));
    return `<p class="small muted">${H(TX.xwTip)}</p><div id="dkXw" class="pdf-skip"></div>`;
  }
  function mountXw(l) {
    const box = ROOT.querySelector("#dkXw");
    if (!box || typeof EkoCross === "undefined") return;
    const words = crossWords(l).map(([w, c]) => [w, L(c)]);
    try {
      EkoCross.mount(box, { id: "dk-" + l.id + ":" + lang(), words, compact: true, onSolve: () => { xp(`dk:xw:${l.id}`, 10, t3("дарслик кроссворди", "кроссворд учебника", "textbook crossword")); } });
      const XL = { ru: { "➡️ Энига": "➡️ По горизонтали", "⬇️ Бўйига": "⬇️ По вертикали", "✓ Текшириш": "✓ Проверить", "💡 Битта ҳарф": "💡 Одна буква", "👁 Жавоблар": "👁 Ответы", "↺ Тозалаш": "↺ Очистить" },
        en: { "➡️ Энига": "➡️ Across", "⬇️ Бўйига": "⬇️ Down", "✓ Текшириш": "✓ Check", "💡 Битта ҳарф": "💡 One letter", "👁 Жавоблар": "👁 Answers", "↺ Тозалаш": "↺ Clear" } }[lang()];
      if (XL) box.querySelectorAll(".xw-clues h4, .xw-actions button").forEach((el) => { const v = XL[el.textContent.trim()]; if (v) el.textContent = v; });
      if (XL) { const m = box.querySelector(".xw-msg"); if (m) m.textContent = lang() === "ru" ? "Нажмите на клетку и пишите. Нажмите номер вопроса, чтобы выбрать слово." : "Tap a cell and type. Tap a clue number to select its word."; }
    } catch (e) { box.innerHTML = `<ol>${words.map(([w, c]) => `<li>${esc(c)} — <b>${esc(L(w).toUpperCase())}</b></li>`).join("")}</ol>`; }
  }
  /* --- Казус --- */
  function kazView(l) {
    const k = l.kazus;
    return `<div class="lesson-task pdf-box"><p>${H(k.t)}</p><p><b>${H(TX.kazQ)}:</b> ${H(k.q)}</p></div>
      <label class="small" for="dkKaz">${H(TX.kazYour)}</label>
      <textarea id="dkKaz" class="qn-ta" data-dk-note="kaz:${esc(l.id)}">${esc(st.notes["kaz:" + l.id] || "")}</textarea>
      <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-dk="note" data-k="kaz:${esc(l.id)}">${H(TX.save)}</button>
      <button class="btn btn-ghost btn-sm" data-dk="kaz-model" aria-expanded="${kazShow}">${H(TX.model)}</button></div>
      <div class="qn-fb" ${kazShow ? "" : "hidden"}>${H(k.a)}</div>`;
  }
  /* --- Мунозара --- */
  function debView(l) {
    const f = (k, t) => `<label class="small" for="dkD${k}"><b>${H(t)}</b></label><textarea id="dkD${k}" class="qn-ta" data-dk-note="deb:${esc(l.id)}:${k}">${esc(st.notes[`deb:${l.id}:${k}`] || "")}</textarea>`;
    return `<p class="qn-quote">${H(l.debate)}</p><p class="small muted">${H(TX.debHint)}</p>
      <div class="dk-deb">${f("pro", TX.pro)}${f("con", TX.con)}</div>${f("end", TX.concl)}
      <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-dk="note" data-k="deb:${esc(l.id)}">${H(TX.save)}</button></div>`;
  }

  /* ========== Якуний имтиҳон ========== */
  function newExam() {
    const pool = [];
    order().forEach((l) => (l.quiz || []).forEach((_, i) => pool.push({ id: l.id, i })));
    exam = { qs: shuffle(pool, "exam:" + Date.now()).slice(0, 20), i: 0, pick: null, ok: 0, done: false, wrong: {} };
  }
  function examView() {
    if (!exam) newExam();
    const back = `<div class="dk-nav pdf-skip"><button class="btn btn-ghost btn-sm" data-dk="toc">${H(TX.toc)}</button></div>`;
    if (exam.done) {
      const pct = Math.round((exam.ok / exam.qs.length) * 100);
      const weak = Object.keys(exam.wrong).map(byId).filter(Boolean);
      return back + `<div class="qn-card"><h3>${H(TX.examDone)}</h3><p class="qn-score">${exam.ok}/${exam.qs.length} · ${pct}%</p>
        <p>${H(pct >= 80 ? TX.passed : TX.failed)}</p>
        ${weak.length ? `<p><b>${H(TX.weak)}</b></p><div class="qn-roles">${weak.map((l) => `<button class="chip" data-dk-open="${esc(l.id)}">${esc(l.icon || "")} ${H(l.title)}</button>`).join("")}</div>` : ""}
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-dk="exam-new">${H(TX.again)}</button></div></div>`;
    }
    const it = exam.qs[exam.i], l = byId(it.id), x = l.quiz[it.i];
    return back + `<div class="qn-card"><h3>${H(TX.exam)} · ${exam.i + 1}/${exam.qs.length}</h3>
      <p class="small muted">${H(TX.examLead)}</p>
      <div class="qn-meter"><i style="width:${Math.round((exam.i / exam.qs.length) * 100)}%;background:var(--primary)"></i></div>
      <p class="small muted">${esc(l.icon || "")} ${H(l.title)}</p>
      <p><b>${H(x.q)}</b></p>
      <div class="qn-opts">${x.a.map((o, k) => `<button type="button" class="sg-opt ${exam.pick != null ? (k === x.c ? "ok" : k === exam.pick ? "bad" : "") : ""}" data-dk-ea="${k}" ${exam.pick != null ? "disabled" : ""}>${H(o)}</button>`).join("")}</div>
      ${exam.pick != null ? `<p class="qn-fb ${exam.pick === x.c ? "" : "bad"}">${H(exam.pick === x.c ? TX.right : TX.wrong)} ${H(x.why)}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-dk="exam-next">${H(TX.next)}</button></div>` : ""}
    </div>`;
  }

  /* ========== PDF ========== */
  const yn = (v) => L(v ? TX.yes : TX.no);
  function printLesson(l, qi0) {
    const c = (D().CH || []).find((x) => x.n === l.ch) || {};
    let qi = qi0;
    const answers = {};
    const d = l.doc || {};
    const meta = [noL(d.no), d.date, d.force ? L(TX.force) + ": " + L(d.force) : "", L(d.status), d.asof ? L(TX.asof) + ": " + L(d.asof) : "", L(d.struct)].filter(Boolean).join(" · ");
    const quiz = (l.quiz || []).map((x) => { answers[qi] = x.c; return `<div data-pdf-q="${qi++}"><p data-pdf-qt>${H(x.q)}</p>${x.a.map((o) => `<span data-pdf-opt>${H(o)}</span>`).join("")}</div>`; }).join("");
    const cw = crossWords(l);
    const html = `<h2>${esc(l.icon || "")} ${H(TX.lesson)} ${numOf(l)}. ${H(l.title)}</h2>
      <p class="small">${chN(l.ch)}. ${H(c.t)}</p>
      <p>${H(TX.doc)}: ${esc(meta)}</p>${d.url ? `<p><a href="${esc(d.url)}">${H(TX.official)}</a></p>` : ""}
      <div class="pdf-box"><h4>${H(TX.goals)}</h4><ul>${(l.goals || []).map((g) => `<li>${H(g)}</li>`).join("")}</ul></div>
      <h3>${H(TX.intro)}</h3>${paras(l.intro)}
      <h3>${H(TX.termsH)}</h3><ul>${(l.terms || []).map(([a, b]) => `<li><b>${H(a)}</b> — ${H(b)}</li>`).join("")}</ul>
      <h3>${H(TX.artsH)}</h3>${(l.arts || []).map(([a, b]) => `<h4>${H(a)}</h4><p>${H(b)}</p>`).join("")}
      ${(l.facts || []).length ? `<h3>${H(TX.factsH)}</h3><ul>${l.facts.map((f) => `<li>${H(f)}</li>`).join("")}</ul>` : ""}
      ${l.kazus ? `<h3>${H(TX.ex.kaz)}</h3><div class="pdf-box"><p>${H(l.kazus.t)}</p><p>${H(TX.kazQ)}: ${H(l.kazus.q)}</p></div><p class="small">${H(TX.model)}: ${H(l.kazus.a)}</p>` : ""}
      ${quiz ? `<h3>${H(TX.ex.quiz)}</h3>${quiz}` : ""}
      ${(l.tf || []).length ? `<h3>${H(TX.ex.tf)}</h3><ol>${l.tf.map(([s]) => `<li>${H(s)}</li>`).join("")}</ol><p class="small">${l.tf.map(([, v, w], i) => `${i + 1}) ${yn(v)}. ${L(w)}`).map(esc).join(" ")}</p>` : ""}
      ${(l.match || []).length ? `<h3>${H(TX.ex.match)}</h3><ol>${l.match.map(([a, b]) => `<li>${H(a)} — ${H(b)}</li>`).join("")}</ol>` : ""}
      ${cw.length ? `<h3>${H(TX.ex.xw)}</h3><ol>${cw.map(([w, q2]) => `<li>${H(q2)} (${[...L(w)].length})</li>`).join("")}</ol><p class="small">${esc(cw.map(([w]) => L(w).toUpperCase()).join(", "))}</p>` : ""}
      ${l.debate ? `<h3>${H(TX.ex.deb)}</h3><p>${H(l.debate)}</p>` : ""}
      ${l.method ? `<h3>${H(TX.method)}</h3><p><b>${H(l.method.n)}</b></p>${paras(l.method.d)}` : ""}`;
    return { html, answers, qi };
  }
  function pdfLesson(l) {
    if (!window.EkoPDF) return;
    const box = document.createElement("div");
    const p = printLesson(l, 0);
    box.innerHTML = p.html;
    EkoPDF.save(box, { title: `${L(TX.lesson)} ${numOf(l)}. ${L(l.title)}`, sub: L(TX.title) + " · Ekomun", file: `Ekomun-huquq-darslik-${numOf(l)}-${l.id}`, answers: p.answers });
    xp("dk:pdf", 3, t3("дарсликдан PDF", "PDF учебника", "textbook PDF"));
  }
  function pdfAll() {
    if (!window.EkoPDF) return;
    const box = document.createElement("div");
    let qi = 0, answers = {}, html = `<p>${H(TX.lead)}</p><p class="small">${H(TX.sources)}</p>`;
    (D().CH || []).forEach((c) => {
      const ls = order().filter((l) => l.ch === c.n);
      if (!ls.length) return;
      html += `<h2>${chN(c.n)}. ${H(c.t)}</h2><p>${H(c.d)}</p><ol>${ls.map((l) => `<li>${H(l.title)} (${esc(noL(l.doc.no))})</li>`).join("")}</ol>`;
      ls.forEach((l) => { const p = printLesson(l, qi); html += p.html; Object.assign(answers, p.answers); qi = p.qi; });
    });
    box.innerHTML = html;
    EkoPDF.save(box, { title: L(TX.title), sub: "Ekomun · " + L(t3("университет босқичи", "университетский уровень", "university stage")), file: "Ekomun-ekologik-huquq-darslik", answers });
  }

  /* ========== Чизиш ва ҳодисалар ========== */
  function html() {
    let body;
    if (exam) body = examView();
    else if (cur && byId(cur)) body = lessonView(byId(cur));
    else body = tocView();
    return `<div id="dkRoot" class="dk">${body}</div>`;
  }
  function rerender(keepY) {
    const box = ROOT.querySelector("#dkRoot");
    if (!box) return;
    const y = window.scrollY;
    box.outerHTML = html();
    if (keepY) window.scrollTo(0, y);
  }
  const top = () => { const el = ROOT.querySelector("#dkRoot"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  function open(id, art) {
    const l = byId(id);
    if (!l) return;
    if (cur !== id) { quizPick = {}; tfPick = {}; matchPick = {}; matchChecked = false; kazShow = false; ex = "quiz"; openArts = false; }
    cur = id; exam = null; st.last = id; save();
    rerender(false); top();
    if (art != null) {
      const d = ROOT.querySelector(`.dk-art[data-k="${art}"]`);
      if (d) { d.open = true; setTimeout(() => d.scrollIntoView({ behavior: "smooth", block: "center" }), 250); d.classList.add("dk-flash"); }
    }
  }

  ROOT.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || !b.closest("#dkRoot")) return;
    const ds = b.dataset;
    const l = cur && byId(cur);
    if (ds.dkOpen) { open(ds.dkOpen, ds.dkArt != null ? +ds.dkArt : null); return; }
    if (ds.dkF) { flt = ds.dkF; rerender(true); return; }
    if (ds.dkEx) { ex = ds.dkEx; rerender(true); return; }
    if (ds.dkQa && l) {
      const [i, k] = ds.dkQa.split(":").map(Number);
      quizPick[i] = k;
      if (Object.keys(quizPick).length === l.quiz.length) {
        const ok = l.quiz.filter((x, j) => quizPick[j] === x.c).length;
        st.quiz[l.id] = Math.max(st.quiz[l.id] || 0, ok); save();
        if (passQuiz(l)) { xp(`dk:quiz:${l.id}`, 10, t3("дарслик квизи", "квиз учебника", "textbook quiz")); markDone(l); }
      }
      rerender(true); return;
    }
    if (ds.dkTf && l) {
      const [i, v] = ds.dkTf.split(":").map(Number);
      tfPick[i] = !!v;
      if (Object.keys(tfPick).length === l.tf.length && l.tf.every(([, val], j) => tfPick[j] === val)) xp(`dk:tf:${l.id}`, 5, t3("тўғри/нотўғри", "верно/неверно", "true/false"));
      rerender(true); return;
    }
    if (ds.dkEa != null && exam) {
      const it = exam.qs[exam.i], x = byId(it.id).quiz[it.i];
      exam.pick = +ds.dkEa;
      if (exam.pick === x.c) exam.ok++; else exam.wrong[it.id] = 1;
      rerender(true); return;
    }
    switch (ds.dk) {
      case "toc": cur = null; exam = null; rerender(false); top(); return;
      case "exam": cur = null; newExam(); rerender(false); top(); return;
      case "exam-new": newExam(); rerender(false); return;
      case "exam-next":
        exam.i++; exam.pick = null;
        if (exam.i >= exam.qs.length) {
          exam.done = true;
          const pct = Math.round((exam.ok / exam.qs.length) * 100);
          st.exam = Math.max(st.exam || 0, pct); save();
          if (pct >= 80) xp("dk:exam", 30, t3("экологик ҳуқуқ дарслиги имтиҳони", "экзамен по учебнику экоправа", "environmental law textbook exam"));
        }
        rerender(true); return;
      case "arts-all": openArts = !openArts; ROOT.querySelectorAll(".dk-art").forEach((d) => { d.open = openArts; }); return;
      case "quiz-reset": quizPick = {}; rerender(true); return;
      case "tf-reset": tfPick = {}; rerender(true); return;
      case "match-check": {
        matchChecked = true;
        if (l && l.match.every((_, i) => matchPick[i] === i)) xp(`dk:match:${l.id}`, 5, t3("мослаштириш", "сопоставление", "matching"));
        rerender(true); return;
      }
      case "kaz-model": kazShow = !kazShow; if (kazShow && l) xp(`dk:kaz:${l.id}`, 5, t3("казус", "казус", "case")); rerender(true); return;
      case "note": {
        const k = ds.k;
        ROOT.querySelectorAll(`[data-dk-note^="${k}"]`).forEach((t) => { st.notes[t.dataset.dkNote] = t.value.trim(); });
        save(); toast(TX.saved);
        if (l && k.startsWith("deb:")) xp(`dk:deb:${l.id}`, 5, t3("мунозара", "дискуссия", "debate"));
        return;
      }
      case "finish": if (l) { markDone(l); rerender(true); } return;
      case "pdf-lesson": if (l) pdfLesson(l); return;
      case "pdf-all": pdfAll(); return;
    }
  });
  ROOT.addEventListener("change", (e) => {
    const s = e.target.closest("[data-dk-m]");
    if (s) { matchPick[s.dataset.dkM] = s.value === "" ? undefined : +s.value; matchChecked = false; s.closest("li").classList.remove("ok", "bad"); }
  });
  ROOT.addEventListener("input", (e) => {
    if (!e.target.matches("[data-dk-q]")) return;
    q = e.target.value;
    const pos = e.target.selectionStart;
    rerender(true);
    const inp = ROOT.querySelector("[data-dk-q]");
    if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (x) { /* ignore */ } }
  });

  window.EkoDarslik = {
    html,
    count: () => LS().length,
    done: () => order().filter((l) => st.done[l.id]).length,
    open: (id) => { if (window.EkoQonun) window.EkoQonun.open("darslik"); if (id) open(id); }
  };
})();
