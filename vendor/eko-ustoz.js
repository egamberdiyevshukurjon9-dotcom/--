/* Экомун — 👩‍🏫 «Ўқитувчи устахонаси».
   • Тест генератори: платформадаги барча курс саволлари банкидан вариантли тест тузиш,
     PDF (жавоблар калити билан) ва ўқувчиларга интерактив ҳавола/QR.
   • Дарс яратгич (Lesson builder): ўқитувчи ўз дарсини (матн, SDG, топшириқ, тест) ёзади,
     қурилмада сақлайди ва ҳавола орқали улашади. Дарс ҳаволанинг ўзида (сиқилган ҳолда)
     туради — сервер ва ҳисоб керак эмас.
   • ISO 14001:2015 (+Amd 1:2024 иқлим ўзгариши) тайёрлик текшируви — корхоналар учун.
   Ҳавола: ?ekt=<код>#ustoz (тест), ?ekd=<код>#ustoz (дарс).
   Ҳолат: localStorage «ekotalim:ustoz». */
(() => {
  "use strict";
  const SEC = document.getElementById("ustoz");
  const ROOT = document.getElementById("usRoot");
  if (!SEC || !ROOT) return;

  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const tr = (s) => (EL() ? EL().tr(s) : s);
  const lang = () => (EL() ? EL().lang : "cyr");
  const T = (s) => (EL() ? EL().t(s) : s);
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
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(typeof o === "string" ? o : L(o)); };
  const xpOnce = (k, n, why) => { const a = App(); if (!a || !a.addXp) return; a.state.flags = a.state.flags || {}; if (!a.state.flags[k]) { a.state.flags[k] = true; a.addXp(n, L(why)); } };
  const hasServer = () => /^https?:$/.test(location.protocol) && location.hostname !== "appassets.androidplatform.net";
  const site = () => (hasServer() ? location.origin : ((window.EKO_VERSION && EKO_VERSION.site) || "https://ekomun.onrender.com"));
  const courses = () => ((App() && App().courses) || []);
  const courseStage = (c) => c.stage || (c.audience === "bola" ? "maktab" : "uni");

  const KEY = "ekotalim:ustoz";
  let st = { tab: "test", lessons: [], draft: null, iso: {}, gen: { cids: [], n: 10, v: 2, title: "" } };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  st.gen = Object.assign({ cids: [], n: 10, v: 2, title: "" }, st.gen);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };

  const TX = {
    pill: t3("👩‍🏫 Ўқитувчи устахонаси · тест, дарс, ISO 14001", "👩‍🏫 Мастерская учителя · тесты, уроки, ISO 14001", "👩‍🏫 Teacher workshop · tests, lessons, ISO 14001"),
    title: t3("Ўқитувчи устахонаси", "Мастерская учителя", "Teacher workshop"),
    lead: t3("Платформадаги минглаб саволлардан бир дақиқада вариантли тест тузинг, ўз дарсингизни яратиб ўқувчиларга ҳавола ёки QR орқали юборинг. Синф натижалари учун «Мактаб» бўлимидан фойдаланинг.",
      "Соберите вариантный тест из тысяч вопросов платформы за минуту, создайте свой урок и отправьте ученикам по ссылке или QR. Для результатов класса используйте раздел «Школа».",
      "Build a multi-version test from the platform's question bank in a minute, create your own lesson and send it to students by link or QR. Use the School section for class results."),
    tabs: { test: t3("📝 Тест генератори", "📝 Генератор тестов", "📝 Test generator"), build: t3("✍️ Дарс яратиш", "✍️ Конструктор уроков", "✍️ Lesson builder"), iso: t3("🏭 ISO 14001", "🏭 ISO 14001", "🏭 ISO 14001") },
    pick: t3("1. Курсларни танланг", "1. Выберите курсы", "1. Choose courses"),
    qs: t3("савол", "вопр.", "questions"),
    n: t3("Саволлар сони", "Число вопросов", "Number of questions"),
    v: t3("Вариантлар", "Варианты", "Versions"),
    tname: t3("Тест номи", "Название теста", "Test title"),
    tnameP: t3("Масалан: 7-синф, экология, 1-чорак", "Например: 7 класс, экология, 1 четверть", "e.g. Year 7 ecology, term 1"),
    gen: t3("Тест тузиш", "Собрать тест", "Build test"),
    none: t3("Аввал камида битта курсни танланг.", "Сначала выберите хотя бы один курс.", "Choose at least one course first."),
    variant: t3("Вариант", "Вариант", "Version"),
    pdf: t3("PDF (жавоблар калити билан)", "PDF (с ключом ответов)", "PDF (with answer key)"),
    link: t3("Ўқувчиларга ҳавола", "Ссылка для учеников", "Link for students"),
    copy: t3("Нусха олиш", "Копировать", "Copy"),
    copied: t3("Ҳавола нусхаланди", "Ссылка скопирована", "Link copied"),
    share: t3("Улашиш", "Поделиться", "Share"),
    qrLong: t3("QR учун жуда узун — ҳаволани юборинг.", "Слишком длинно для QR — отправьте ссылку.", "Too long for a QR code — send the link."),
    // дарс
    bTitle: t3("Дарс мавзуси", "Тема урока", "Lesson topic"),
    bStage: t3("Ким учун", "Для кого", "Audience"),
    stages: { maktab: t3("🎒 Мактаб", "🎒 Школа", "🎒 School"), uni: t3("🎓 Университет / катталар", "🎓 Вуз / взрослые", "🎓 University / adults") },
    bGoal: t3("Дарс мақсади", "Цель урока", "Learning goal"),
    bBody: t3("Дарс матни (ҳар бир абзац — янги қаторда)", "Текст урока (каждый абзац — с новой строки)", "Lesson text (one paragraph per line)"),
    bTask: t3("Амалий топшириқ", "Практическое задание", "Hands-on task"),
    bSdg: t3("SDG мақсадлари", "Цели ЦУР", "SDG goals"),
    bQ: t3("Саволлар", "Вопросы", "Questions"),
    bQText: t3("Савол", "Вопрос", "Question"),
    bOpt: t3("Жавоб варианти", "Вариант ответа", "Answer option"),
    bRight: t3("тўғри", "верный", "correct"),
    addQ: t3("+ Савол қўшиш", "+ Добавить вопрос", "+ Add question"),
    delQ: t3("Саволни ўчириш", "Удалить вопрос", "Delete question"),
    saveL: t3("Сақлаш", "Сохранить", "Save"),
    newL: t3("Янги дарс", "Новый урок", "New lesson"),
    my: t3("Менинг дарсларим", "Мои уроки", "My lessons"),
    noMy: t3("Ҳали дарс яратмагансиз.", "Вы ещё не создали уроков.", "No lessons yet."),
    edit: t3("Таҳрир", "Изменить", "Edit"),
    del: t3("Ўчириш", "Удалить", "Delete"),
    preview: t3("Кўриш", "Просмотр", "Preview"),
    exportJ: t3("JSON файл", "Файл JSON", "JSON file"),
    importJ: t3("JSON дан юклаш", "Загрузить из JSON", "Import JSON"),
    savedOk: t3("Дарс сақланди", "Урок сохранён", "Lesson saved"),
    needTitle: t3("Мавзу ва камида битта абзац ёзинг.", "Укажите тему и хотя бы один абзац.", "Add a topic and at least one paragraph."),
    badQ: t3("Ҳар бир саволда матн ва камида 2 та жавоб бўлсин.", "В каждом вопросе нужен текст и не менее 2 ответов.", "Each question needs text and at least 2 answers."),
    // ўқувчи
    from: t3("Ўқитувчингиз юборган", "Прислал ваш учитель", "Sent by your teacher"),
    shared: t3("Улашилган дарс", "Присланный урок", "Shared lesson"),
    sharedT: t3("Улашилган тест", "Присланный тест", "Shared test"),
    yourName: t3("Исмингиз (ўқитувчига кўрсатиш учун)", "Ваше имя (чтобы показать учителю)", "Your name (to show your teacher)"),
    check: t3("Текшириш", "Проверить", "Check"),
    score: t3("Натижа", "Результат", "Score"),
    again: t3("Қайта ечиш", "Решить заново", "Try again"),
    close: t3("Ёпиш", "Закрыть", "Close"),
    badLink: t3("Ҳавола бузилган ёки бу қурилмада очилмайди.", "Ссылка повреждена или не открывается на этом устройстве.", "The link is broken or cannot be opened on this device."),
    goal: t3("🎯 Мақсад", "🎯 Цель", "🎯 Goal"),
    task: t3("🛠 Амалий топшириқ", "🛠 Практическое задание", "🛠 Hands-on task"),
    quiz: t3("✅ Ўзингизни текширинг", "✅ Проверьте себя", "✅ Check yourself"),
    ugc: t3("Бу дарсни Экомун жамоаси эмас, ўқитувчи ёзган.", "Этот урок написал учитель, а не команда Ekomun.", "This lesson was written by a teacher, not by the Ekomun team."),
    // ISO
    isoLead: t3("ISO 14001:2015 — экологик менежмент тизимининг халқаро стандарти (2024 йилги 1-ўзгартириш: иқлим ўзгаришини ҳисобга олиш). 21 та савол корхонангиз сертификатлашга қанчалик тайёрлигини кўрсатади.",
      "ISO 14001:2015 — международный стандарт системы экологического менеджмента (изменение 1 от 2024 года: учёт изменения климата). 21 вопрос покажет, насколько предприятие готово к сертификации.",
      "ISO 14001:2015 is the international standard for environmental management systems (Amendment 1, 2024: climate change considerations). 21 questions show how ready your organisation is for certification."),
    yes: t3("Ҳа", "Да", "Yes"), part: t3("Қисман", "Частично", "Partly"), no: t3("Йўқ", "Нет", "No"),
    ready: t3("Умумий тайёрлик", "Общая готовность", "Overall readiness"),
    gaps: t3("Устувор вазифалар", "Приоритетные задачи", "Priority actions"),
    noGaps: t3("Ажойиб! Сертификатлаш органига мурожаат қилиш мумкин.", "Отлично! Можно обращаться в орган по сертификации.", "Great! You can approach a certification body."),
    isoPdf: t3("Ҳисоботни PDF қилиш", "Отчёт в PDF", "Report as PDF"),
    isoReset: t3("Тозалаш", "Очистить", "Clear"),
    answered: t3("жавоб берилди", "отвечено", "answered"),
    disc: t3("Бу ўз-ўзини баҳолаш воситаси; расмий аудит ўрнини босмайди.", "Это инструмент самооценки, он не заменяет официальный аудит.", "This is a self-assessment tool and does not replace an official audit.")
  };

  /* ===================== Ҳаволани кодлаш ===================== */
  const b64u = (bytes) => { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64u = (s) => { const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)); return Uint8Array.from(b, (c) => c.charCodeAt(0)); };
  async function pipe(bytes, Stream, mode) {
    const s = new Blob([bytes]).stream().pipeThrough(new Stream(mode));
    return new Uint8Array(await new Response(s).arrayBuffer());
  }
  async function encode(obj) {
    const raw = new TextEncoder().encode(JSON.stringify(obj));
    if (typeof CompressionStream === "function") { try { return "1" + b64u(await pipe(raw, CompressionStream, "deflate-raw")); } catch (e) { /* оддий */ } }
    return "0" + b64u(raw);
  }
  async function decode(code) {
    const s = String(code || "");
    if (s.length > 12000 || !/^[01][A-Za-z0-9_-]+$/.test(s)) throw new Error("bad");
    let bytes = unb64u(s.slice(1));
    if (s[0] === "1") { if (typeof DecompressionStream !== "function") throw new Error("nodeflate"); bytes = await pipe(bytes, DecompressionStream, "deflate-raw"); }
    if (bytes.length > 200000) throw new Error("big");
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  const linkOf = (k, code) => `${site()}/?${k}=${code}#ustoz`;

  /* ===================== Савол банки ===================== */
  function bankOf(cids) {
    const out = [];
    cids.forEach((cid) => {
      const c = courses().find((x) => x.id === cid); if (!c) return;
      c.lessons.forEach((l, li) => (l.quiz || []).forEach((q, qi) => { if (Array.isArray(q.a) && q.a.length > 1 && q.a[q.c] != null) out.push([cid, li, qi]); }));
    });
    return out;
  }
  const qOf = ([cid, li, qi]) => { const c = courses().find((x) => x.id === cid); const l = c && c.lessons[li]; return l && l.quiz && l.quiz[qi]; };
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function shuffle(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  /* Вариант: саволлар тартиби ва жавоблар тартиби аралаштирилади */
  function variant(spec, v) {
    const r = rng(spec.s + v * 7919);
    const qs = v ? shuffle(spec.q, r) : spec.q;
    return qs.map((ref) => { const q = qOf(ref); if (!q) return null; const ord = shuffle(q.a.map((_, i) => i), r); return { ref, q: q.q, a: ord.map((i) => q.a[i]), c: ord.indexOf(q.c) }; }).filter(Boolean);
  }

  /* ===================== 📝 Тест генератори ===================== */
  let built = null, builtLink = "";
  function renderTest(panel) {
    const g = st.gen, byStage = { maktab: [], uni: [] };
    courses().forEach((c) => byStage[courseStage(c)].push(c));
    const grp = (k, list) => `<fieldset class="us-fs"><legend>${H(TX.stages[k])}</legend><div class="us-cks">${list.map((c) => { const n = bankOf([c.id]).length; return `<label class="vd-chk"><input type="checkbox" data-gc="${c.id}"${g.cids.includes(c.id) ? " checked" : ""}${n ? "" : " disabled"}> <span>${c.icon} ${esc(T(c.title))} <small class="muted">(${n} ${H(TX.qs)})</small></span></label>`; }).join("")}</div></fieldset>`;
    const total = bankOf(g.cids).length;
    panel.innerHTML = `<section class="ps-box"><h3>${H(TX.pick)}</h3>${grp("maktab", byStage.maktab)}${grp("uni", byStage.uni)}
      <div class="us-row"><label>${H(TX.tname)}<input type="text" maxlength="120" data-gt value="${esc(g.title)}" placeholder="${H(TX.tnameP)}"></label>
        <label>${H(TX.n)}<input type="number" min="3" max="${Math.max(3, Math.min(40, total))}" value="${Math.min(g.n, Math.max(3, total))}" data-gn></label>
        <label>${H(TX.v)}<select data-gv>${[1, 2, 3, 4].map((v) => `<option${v === g.v ? " selected" : ""}>${v}</option>`).join("")}</select></label>
        <button type="button" class="btn btn-primary" data-gen>${H(TX.gen)} (${total} ${H(TX.qs)})</button></div></section>
      <div data-gout>${built ? builtHtml() : ""}</div>`;
  }
  async function generate() {
    const g = st.gen, bank = bankOf(g.cids);
    if (!bank.length) { toast(TX.none); return; }
    const s = Math.floor(Math.random() * 1e9);
    const n = Math.max(3, Math.min(40, g.n, bank.length));
    const spec = { t: (g.title || "").slice(0, 120), s, q: shuffle(bank, rng(s)).slice(0, n) };
    built = spec;
    builtLink = linkOf("ekt", await encode(spec));
    const out = ROOT.querySelector("[data-gout]"); if (out) out.innerHTML = builtHtml();
    drawQr(builtLink);
    xpOnce("us_test", 5, TX.tabs.test);
  }
  function printable(spec, v) {
    const qs = variant(spec, v);
    return `<div class="us-print" data-var="${v}"><h2>${esc(spec.t || L(TX.sharedT))} — ${H(TX.variant)} ${String.fromCharCode(65 + v)}</h2>
      ${qs.map((q, i) => `<div class="q" data-q="${i}"><p><b>${i + 1}.</b> ${esc(T(q.q))}</p><ol type="A">${q.a.map((a) => `<li class="opt">${esc(T(a))}</li>`).join("")}</ol></div>`).join("")}</div>`;
  }
  function builtHtml() {
    const vs = Array.from({ length: st.gen.v }, (_, v) => v);
    return `<section class="ps-box"><h3>${esc(built.t || L(TX.sharedT))} · ${built.q.length} ${H(TX.qs)}</h3>
      <div class="ps-btns">${vs.map((v) => `<button type="button" class="btn btn-ghost btn-sm" data-vpdf="${v}"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.variant)} ${String.fromCharCode(65 + v)} · ${H(TX.pdf)}</button>`).join("")}</div>
      <h4>${H(TX.link)}</h4><div class="us-link"><input type="text" readonly value="${esc(builtLink)}" aria-label="${H(TX.link)}" data-sel>
        <button type="button" class="btn btn-ghost btn-sm" data-copy="${esc(builtLink)}">${H(TX.copy)}</button>${navigator.share ? `<button type="button" class="btn btn-ghost btn-sm" data-share="${esc(builtLink)}">${H(TX.share)}</button>` : ""}</div>
      <div class="us-qr" data-qr></div>
      <details><summary>${H(TX.preview)}</summary>${printable(built, 0)}</details></section>`;
  }
  let qrLib = null;
  function loadQr() {
    if (window.qrcode) return Promise.resolve(window.qrcode);
    if (!qrLib) qrLib = new Promise((ok, no) => { const s = document.createElement("script"); s.src = "/vendor/qrcode.js"; s.onload = () => (window.qrcode ? ok(window.qrcode) : no()); s.onerror = no; document.head.appendChild(s); });
    return qrLib;
  }
  async function drawQr(url) {
    const box = ROOT.querySelector("[data-qr]"); if (!box) return;
    if (url.length > 1800) { box.innerHTML = `<p class="small muted">${H(TX.qrLong)}</p>`; return; }
    try {
      const qr = (await loadQr())(0, "L"); qr.addData(url); qr.make();
      const n = qr.getModuleCount(), sz = 4, pad = 4, W = (n + pad * 2) * sz;
      let d = "";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${(c + pad) * sz} ${(r + pad) * sz}h${sz}v${sz}h-${sz}z`;
      box.innerHTML = `<svg viewBox="0 0 ${W} ${W}" width="200" height="200" role="img" aria-label="QR"><rect width="${W}" height="${W}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
    } catch (e) { box.innerHTML = ""; }
  }
  function pdfVariant(v) {
    if (!window.EkoPDF || !built) return;
    const tmp = document.createElement("div");
    tmp.style.cssText = "position:absolute;left:-9999px;top:0;width:800px";
    tmp.innerHTML = printable(built, v);
    document.body.appendChild(tmp);
    const answers = variant(built, v).map((q) => q.c);
    EkoPDF.save(tmp.firstElementChild, { title: `${built.t || L(TX.sharedT)} — ${L(TX.variant)} ${String.fromCharCode(65 + v)}`, file: `Ekomun-test-${String.fromCharCode(65 + v)}`, answers })
      .finally(() => tmp.remove());
  }

  /* ===================== ✍️ Дарс яратгич ===================== */
  const blank = () => ({ id: Date.now().toString(36), t: "", stg: "maktab", goal: "", body: "", task: "", sdg: [], q: [{ q: "", a: ["", "", ""], c: 0 }] });
  const SDGS = () => (window.EkoPassport && EkoPassport.SDG) || {};
  function renderBuild(panel) {
    const d = st.draft || (st.draft = blank());
    panel.innerHTML = `<div class="ps-grid us-build">
      <section class="ps-box"><form data-bform>
        <label>${H(TX.bTitle)}<input type="text" maxlength="120" name="t" value="${esc(d.t)}" required></label>
        <fieldset class="us-fs"><legend>${H(TX.bStage)}</legend><div class="yl-seg">${Object.entries(TX.stages).map(([k, v]) => `<label class="vd-chk"><input type="radio" name="stg" value="${k}"${d.stg === k ? " checked" : ""}> ${H(v)}</label>`).join("")}</div></fieldset>
        <label>${H(TX.bGoal)}<input type="text" maxlength="300" name="goal" value="${esc(d.goal)}"></label>
        <label>${H(TX.bBody)}<textarea name="body" rows="8" maxlength="12000">${esc(d.body)}</textarea></label>
        <label>${H(TX.bTask)}<textarea name="task" rows="3" maxlength="1000">${esc(d.task)}</textarea></label>
        <fieldset class="us-fs"><legend>${H(TX.bSdg)}</legend><div class="yl-seg">${Object.entries(SDGS()).map(([g, x]) => `<label class="ps-sdgchip ${d.sdg.includes(+g) ? "on" : ""}" style="--sc:${x.c};--si:${x.i || "#fff"}"><input type="checkbox" name="sdg" value="${g}"${d.sdg.includes(+g) ? " checked" : ""} class="sr-only"> <b>${g}</b> ${H(x.n)}</label>`).join("")}</div></fieldset>
        <fieldset class="us-fs"><legend>${H(TX.bQ)}</legend>${d.q.map((q, i) => `<div class="us-q" data-qi="${i}">
          <label>${i + 1}. ${H(TX.bQText)}<input type="text" maxlength="300" data-qt value="${esc(q.q)}"></label>
          ${q.a.map((a, j) => `<div class="us-opt"><input type="radio" name="c${i}" value="${j}"${q.c === j ? " checked" : ""} aria-label="${H(TX.bRight)}" data-qc><input type="text" maxlength="200" data-qa="${j}" value="${esc(a)}" placeholder="${H(TX.bOpt)} ${String.fromCharCode(65 + j)}"></div>`).join("")}
          <button type="button" class="linkish small" data-qdel="${i}">${H(TX.delQ)}</button></div>`).join("")}
          ${d.q.length < 15 ? `<button type="button" class="btn btn-ghost btn-sm" data-qadd>${H(TX.addQ)}</button>` : ""}</fieldset>
        <div class="ps-btns"><button type="submit" class="btn btn-primary">${H(TX.saveL)}</button><button type="button" class="btn btn-ghost" data-bnew>${H(TX.newL)}</button>
          <label class="btn btn-ghost btn-sm">${H(TX.importJ)}<input type="file" accept=".json,application/json" data-bimp hidden></label></div>
      </form></section>
      <section class="ps-box"><h3>${H(TX.my)}</h3>${st.lessons.length ? `<ul class="us-my">${st.lessons.map((l) => `<li><b>${esc(l.t)}</b> <small class="muted">${H(TX.stages[l.stg] || "")} · ${l.q.length} ${H(TX.qs)}</small>
        <div class="ps-btns"><button type="button" class="btn btn-ghost btn-sm" data-lview="${l.id}">${H(TX.preview)}</button><button type="button" class="btn btn-ghost btn-sm" data-ledit="${l.id}">${H(TX.edit)}</button><button type="button" class="btn btn-primary btn-sm" data-llink="${l.id}">${H(TX.link)}</button><button type="button" class="btn btn-ghost btn-sm" data-ljson="${l.id}">${H(TX.exportJ)}</button><button type="button" class="linkish small" data-ldel="${l.id}">${H(TX.del)}</button></div></li>`).join("")}</ul>` : `<p class="muted">${H(TX.noMy)}</p>`}
        <div data-lout></div></section></div>`;
  }
  function readForm() {
    const f = ROOT.querySelector("[data-bform]"); if (!f) return;
    const d = st.draft;
    d.t = f.t.value.trim().slice(0, 120); d.goal = f.goal.value.trim().slice(0, 300); d.body = f.body.value.slice(0, 12000); d.task = f.task.value.slice(0, 1000);
    d.stg = (f.querySelector("[name=stg]:checked") || {}).value || "maktab";
    d.sdg = [...f.querySelectorAll("[name=sdg]:checked")].map((x) => +x.value).filter((g) => SDGS()[g]);
    d.q = [...f.querySelectorAll(".us-q")].map((box, i) => ({ q: box.querySelector("[data-qt]").value.trim().slice(0, 300), a: [...box.querySelectorAll("[data-qa]")].map((x) => x.value.trim().slice(0, 200)), c: +((box.querySelector(`[name=c${i}]:checked`) || {}).value || 0) }));
  }
  /* Ташқаридан келган дарсни текшириш ва тозалаш */
  function clean(l) {
    if (!l || typeof l !== "object") return null;
    const s = (x, n) => String(x == null ? "" : x).slice(0, n);
    const q = (Array.isArray(l.q) ? l.q : []).slice(0, 15).map((x) => {
      const a = (Array.isArray(x && x.a) ? x.a : []).slice(0, 5).map((y) => s(y, 200).trim());
      const keep = a.map((y, i) => [y, i]).filter(([y]) => y);
      const c = Math.max(0, keep.findIndex(([, i]) => i === +x.c));
      return { q: s(x && x.q, 300).trim(), a: keep.map(([y]) => y), c };
    }).filter((x) => x.q && x.a.length >= 2);
    const out = { id: s(l.id, 20).replace(/[^\w-]/g, "") || Date.now().toString(36), t: s(l.t, 120).trim(), stg: l.stg === "uni" ? "uni" : "maktab", goal: s(l.goal, 300), body: s(l.body, 12000), task: s(l.task, 1000), sdg: (Array.isArray(l.sdg) ? l.sdg : []).map(Number).filter((g) => SDGS()[g]).slice(0, 6), q };
    return out.t && out.body.trim() ? out : null;
  }
  function saveDraft() {
    readForm();
    const d = st.draft;
    if (!d.t || !d.body.trim()) { toast(TX.needTitle); return; }
    if (d.q.some((x) => (x.q || x.a.some(Boolean)) && (!x.q || x.a.filter(Boolean).length < 2))) { toast(TX.badQ); return; }
    const c = clean(d); if (!c) { toast(TX.needTitle); return; }
    const i = st.lessons.findIndex((x) => x.id === c.id);
    if (i >= 0) st.lessons[i] = c; else st.lessons.unshift(c);
    st.lessons = st.lessons.slice(0, 50);
    save(); toast(TX.savedOk); xpOnce("us_lesson", 10, TX.tabs.build);
    render();
  }
  function lessonView(l, opts = {}) {
    const paras = l.body.split(/\n+/).map((p) => p.trim()).filter(Boolean);
    const sdg = window.EkoPassport && l.sdg.length ? EkoPassport.sdgChips(l.sdg) : "";
    return `<article class="ps-box us-view" data-lesson>
      ${opts.shared ? `<span class="pill">📨 ${H(TX.from)}</span>` : ""}<h3>${esc(l.t)}</h3>${sdg}
      ${l.goal ? `<p class="lesson-goal"><b>${H(TX.goal)}:</b> ${esc(l.goal)}</p>` : ""}
      ${paras.map((p) => `<p>${esc(p)}</p>`).join("")}
      ${l.task ? `<div class="lesson-task"><h4>${H(TX.task)}</h4><p>${esc(l.task)}</p></div>` : ""}
      ${l.q.length ? `<h4>${H(TX.quiz)}</h4>${quizHtml(l.q.map((x) => ({ q: x.q, a: x.a, c: x.c })), "l", false)}` : ""}
      ${opts.shared ? `<p class="small muted">${H(TX.ugc)}</p>` : ""}</article>`;
  }
  /* Умумий интерактив тест: tr — асл матн платформа луғати билан таржима қилинсинми */
  function quizHtml(qs, id, translate) {
    const tx = (s) => esc(translate ? T(s) : s);
    return `<form class="us-quiz" data-quiz="${id}">${qs.map((q, i) => `<fieldset class="us-qq" data-c="${q.c}"><legend><b>${i + 1}.</b> ${tx(q.q)}</legend>${q.a.map((a, j) => `<label class="vd-chk"><input type="radio" name="q${i}" value="${j}"> <span>${tx(a)}</span></label>`).join("")}</fieldset>`).join("")}
      <button type="submit" class="btn btn-primary">${H(TX.check)}</button><p class="us-score" aria-live="polite"></p></form>`;
  }
  function checkQuiz(form) {
    let ok = 0;
    const sets = [...form.querySelectorAll(".us-qq")];
    sets.forEach((fs, i) => {
      const pick = form.querySelector(`[name=q${i}]:checked`), c = +fs.dataset.c;
      fs.classList.remove("ok", "bad");
      fs.querySelectorAll("label").forEach((lb, j) => lb.classList.toggle("us-right", j === c));
      if (pick && +pick.value === c) { ok++; fs.classList.add("ok"); } else fs.classList.add("bad");
    });
    const pct = sets.length ? Math.round((ok / sets.length) * 100) : 0;
    const name = (ROOT.querySelector("[data-sname]") || {}).value || "";
    form.querySelector(".us-score").innerHTML = `<b>${H(TX.score)}: ${ok} / ${sets.length} (${pct} %)</b>${name ? ` · ${esc(name.slice(0, 60))}` : ""} · ${new Date().toLocaleString(lang() === "en" ? "en-GB" : "ru-RU")}`;
    if (form.dataset.quiz === "t") xpOnce("us_took_" + (sharedSpec ? sharedSpec.s : 0), Math.max(2, Math.round(pct / 10)), TX.sharedT);
    return pct;
  }

  /* ===================== 🏭 ISO 14001 ===================== */
  const ISO = [
    ["4", t3("Ташкилот контексти", "Контекст организации", "Context of the organisation"), [
      [t3("Корхонага таъсир қилувчи ички ва ташқи экологик омиллар (жумладан, иқлим ўзгариши) аниқланганми?", "Определены ли внутренние и внешние экологические факторы (включая изменение климата)?", "Have internal and external environmental issues (including climate change) been identified?"), t3("SWOT/PESTLE таҳлили қилиб, иқлим хатарларини ёзинг (Amd 1:2024).", "Проведите SWOT/PESTLE и опишите климатические риски (Amd 1:2024).", "Run a SWOT/PESTLE and document climate risks (Amd 1:2024).")],
      [t3("Манфаатдор томонлар (давлат, аҳоли, мижоз, ходим) ва уларнинг талаблари рўйхати борми?", "Есть ли перечень заинтересованных сторон и их требований?", "Is there a list of interested parties and their requirements?"), t3("Манфаатдор томонлар матрицасини тузинг.", "Составьте матрицу заинтересованных сторон.", "Build an interested-parties matrix.")],
      [t3("Экологик менежмент тизимининг доираси (қайси бино, жараён) ёзма белгиланганми?", "Определена ли письменно область применения СЭМ?", "Is the EMS scope defined in writing?"), t3("Доира ҳужжатини (сайт, жараёнлар, чегаралар) тасдиқланг.", "Утвердите документ об области применения.", "Approve a scope statement (sites, processes, boundaries).")]]],
    ["5", t3("Раҳбарият", "Лидерство", "Leadership"), [
      [t3("Раҳбар имзолаган экологик сиёсат бор ва ходимларга етказилганми?", "Есть ли подписанная руководителем экологическая политика, доведённая до персонала?", "Is there an environmental policy signed by top management and communicated to staff?"), t3("1 бетлик сиёсат ёзиб, раҳбарга имзолатинг ва осиб қўйинг.", "Напишите политику на 1 стр., подпишите у руководителя и разместите.", "Write a one-page policy, have it signed and post it.")],
      [t3("Экология бўйича масъул шахслар ва уларнинг вазифалари белгиланганми?", "Назначены ли ответственные лица и их обязанности?", "Are responsible people and their duties assigned?"), t3("Буйруқ билан эколог ва жараён масъулларини тайинланг.", "Назначьте эколога и ответственных приказом.", "Appoint an environmental lead and owners by order.")]]],
    ["6", t3("Режалаштириш", "Планирование", "Planning"), [
      [t3("Экологик жиҳатлар (чиқинди, ташлама, сув, энергия) реестри ва уларнинг аҳамияти баҳоланганми?", "Есть ли реестр экологических аспектов с оценкой значимости?", "Is there a register of environmental aspects with significance assessed?"), t3("Ҳар бир жараён учун «жиҳат → таъсир» жадвалини тузинг.", "Составьте таблицу «аспект → воздействие» для каждого процесса.", "Build an aspect → impact table for each process.")],
      [t3("Мажбурий талаблар (қонунлар, рухсатномалар, ГОСТ/O‘zDSt) рўйхати ва янгилаб борилиши борми?", "Есть ли перечень обязательных требований (законы, разрешения) и его актуализация?", "Is there an up-to-date list of compliance obligations (laws, permits, standards)?"), t3("«Экологик ҳуқуқ» бўлимидан қонунлар рўйхатини олиб, рухсатномалар муддатини ёзинг.", "Возьмите перечень законов из раздела «Экологическое право» и сроки разрешений.", "Use the Environmental Law section to list laws and permit dates.")],
      [t3("Хатар ва имкониятлар баҳоланиб, улар бўйича чоралар режаси борми?", "Оценены ли риски и возможности, есть ли план мер?", "Are risks and opportunities assessed with an action plan?"), t3("Хатарлар реестри (эҳтимол × оқибат) тузинг.", "Составьте реестр рисков (вероятность × последствия).", "Create a risk register (likelihood × consequence).")],
      [t3("Ўлчанадиган экологик мақсадлар (масалан, чиқиндини 20 % камайтириш) ва муддатлар белгиланганми?", "Установлены ли измеримые экологические цели и сроки?", "Are measurable environmental objectives and deadlines set?"), t3("SMART мақсадлар: нима, қанча, қачонгача, ким.", "Цели SMART: что, сколько, к какому сроку, кто.", "SMART objectives: what, how much, by when, who.")]]],
    ["7", t3("Таъминот", "Поддержка", "Support"), [
      [t3("Ходимлар экология бўйича ўқитилганми ва малакаси ҳужжатлаштирилганми?", "Обучен ли персонал и задокументирована ли компетентность?", "Has staff been trained and is competence documented?"), t3("Экомундаги «Корхонада экологик менежмент» курсини ходимларга беринг ва сертификатларни сақланг.", "Пройдите с персоналом курс Ekomun «Экологический менеджмент на предприятии».", "Give staff the Ekomun course “Environmental management in companies” and keep the certificates.")],
      [t3("Ички ва ташқи экологик коммуникация тартиби (кимга, нима, қачон) борми?", "Есть ли порядок внутренних и внешних коммуникаций?", "Is there a procedure for internal and external communication?"), t3("Коммуникация режасини тузинг: ҳисобот, шикоят, жавоб.", "Составьте план коммуникаций: отчёты, жалобы, ответы.", "Draw up a communication plan: reports, complaints, replies.")],
      [t3("Ҳужжатлар ва ёзувлар бошқариладими (версия, сақлаш муддати, рухсат)?", "Управляются ли документы и записи (версии, сроки хранения)?", "Are documents and records controlled (versions, retention)?"), t3("Ягона папка ва ҳужжатлар рўйхатини (реестр) юритинг.", "Ведите единую папку и реестр документов.", "Keep one shared folder and a document register.")]]],
    ["8", t3("Фаолият", "Деятельность", "Operation"), [
      [t3("Чиқинди, ташлама ва оқова сув учун иш йўриқномалари (оператив назорат) борми?", "Есть ли инструкции оперативного управления для отходов, выбросов и стоков?", "Are there operating controls for waste, emissions and wastewater?"), t3("Ҳар бир аҳамиятли жиҳат учун 1 бетлик йўриқнома ёзинг.", "Напишите краткую инструкцию на каждый значимый аспект.", "Write a one-page instruction for each significant aspect.")],
      [t3("Пудратчи ва етказиб берувчиларга экологик талаблар қўйиладими (ҳаёт цикли)?", "Предъявляются ли экотребования подрядчикам и поставщикам (жизненный цикл)?", "Are environmental requirements set for contractors and suppliers (life cycle)?"), t3("Шартномаларга экологик бандларни қўшинг.", "Добавьте экологические пункты в договоры.", "Add environmental clauses to contracts.")],
      [t3("Фавқулодда ҳолатлар (тўкилиш, ёнғин) режаси бор ва машқ қилинганми?", "Есть ли план действий в ЧС (разлив, пожар) и проводились ли учения?", "Is there an emergency plan (spill, fire) and has it been drilled?"), t3("Йилига камида 1 марта машқ ўтказиб, баённома ёзинг.", "Проводите учения не реже 1 раза в год с протоколом.", "Hold a drill at least once a year and record it.")]]],
    ["9", t3("Натижаларни баҳолаш", "Оценка результатов", "Performance evaluation"), [
      [t3("Энергия, сув, чиқинди ва ташламалар мунтазам ўлчанадими (мониторинг)?", "Регулярно ли измеряются энергия, вода, отходы и выбросы?", "Are energy, water, waste and emissions measured regularly?"), t3("Ойлик кўрсаткичлар жадвалини юритинг (Экомундаги «Чиқиндилар ҳисоби» ёрдам беради).", "Ведите ежемесячную таблицу показателей (поможет «Расчёт отходов» в Ekomun).", "Keep a monthly KPI sheet (Ekomun's Waste calculation helps).")],
      [t3("Қонун талабларига мувофиқлик даврий баҳоланадими?", "Периодически ли оценивается соответствие требованиям законодательства?", "Is legal compliance evaluated periodically?"), t3("Ярим йилда бир марта мувофиқлик текширувини ўтказинг.", "Раз в полгода проводите проверку соответствия.", "Check compliance every six months.")],
      [t3("Ички аудит дастури бор ва камида йилига бир марта ўтказиладими?", "Есть ли программа внутренних аудитов, не реже раза в год?", "Is there an internal audit programme, at least yearly?"), t3("2 ходимни ички аудитор сифатида ўқитинг.", "Обучите 2 сотрудников внутреннему аудиту.", "Train two staff as internal auditors.")],
      [t3("Раҳбарият тизимни йилда камида бир марта таҳлил қиладими (management review)?", "Проводит ли руководство анализ системы хотя бы раз в год?", "Does management review the system at least once a year?"), t3("Йиллик таҳлил йиғилиши ва қарорлар баённомасини ёзинг.", "Проводите ежегодное совещание по анализу с протоколом.", "Hold an annual review meeting with minutes.")]]],
    ["10", t3("Такомиллаштириш", "Улучшение", "Improvement"), [
      [t3("Номувофиқликлар ёзилиб, тузатиш чоралари назорат қилинадими?", "Фиксируются ли несоответствия и контролируются ли корректирующие действия?", "Are nonconformities logged and corrective actions tracked?"), t3("«Номувофиқлик → сабаб → чора → муддат» журналини юритинг.", "Ведите журнал «несоответствие → причина → мера → срок».", "Keep a nonconformity → cause → action → deadline log.")],
      [t3("Йилдан йилга экологик кўрсаткичлар яхшиланаётгани кўриниб турадими?", "Видно ли улучшение экологических показателей год к году?", "Do environmental KPIs improve year on year?"), t3("Кўрсаткичлар графигини ҳар чоракда раҳбариятга кўрсатинг.", "Показывайте график показателей руководству ежеквартально.", "Show the KPI chart to management every quarter.")]]]
  ];
  function isoScore() {
    let sum = 0, max = 0, n = 0;
    const per = ISO.map(([cl, , qs]) => { let s = 0; qs.forEach((_, i) => { const v = st.iso[cl + "." + i]; if (v != null) { s += v; n++; } }); sum += s; max += qs.length * 2; return { cl, pct: Math.round((s / (qs.length * 2)) * 100) }; });
    return { pct: Math.round((sum / max) * 100), per, n, total: ISO.reduce((a, [, , qs]) => a + qs.length, 0) };
  }
  function renderIso(panel) {
    const R = isoScore();
    const gaps = [];
    ISO.forEach(([cl, , qs]) => qs.forEach(([q, fix], i) => { const v = st.iso[cl + "." + i]; if (v != null && v < 2) gaps.push([cl, v, fix]); }));
    gaps.sort((a, b) => a[1] - b[1]);
    panel.innerHTML = `<p class="muted" style="max-width:820px">${H(TX.isoLead)}</p>
      <div class="ps-grid"><div data-isodoc>
        ${ISO.map(([cl, name, qs]) => `<section class="ps-box us-iso"><h3>${cl}. ${H(name)}</h3>${qs.map(([q], i) => { const k = cl + "." + i, v = st.iso[k]; return `<div class="us-isoq"><p>${H(q)}</p><div class="yl-seg">${[[2, TX.yes], [1, TX.part], [0, TX.no]].map(([val, lb]) => `<button type="button" class="chip ${v === val ? "active" : ""}" aria-pressed="${v === val}" data-iso="${k}" data-v="${val}">${H(lb)}</button>`).join("")}</div></div>`; }).join("")}</section>`).join("")}
      </div>
      <aside class="ps-box us-isores" data-isores>
        <h3>${H(TX.ready)}: <b>${R.pct} %</b></h3><p class="small muted">${R.n} / ${R.total} ${H(TX.answered)}</p>
        <ul class="yl-kc">${R.per.map((p) => `<li><span>${p.cl}. ${H(ISO.find((x) => x[0] === p.cl)[1])}</span><span class="ps-bar" aria-hidden="true"><i style="width:${p.pct}%;background:${p.pct >= 80 ? "#15803d" : p.pct >= 50 ? "#ca8a04" : "#dc2626"}"></i></span><b>${p.pct} %</b></li>`).join("")}</ul>
        <h4>${H(TX.gaps)}</h4>${gaps.length ? `<ol class="small">${gaps.slice(0, 12).map(([cl, v, fix]) => `<li><b>${cl}</b> ${v === 0 ? "🔴" : "🟡"} ${H(fix)}</li>`).join("")}</ol>` : R.n === R.total ? `<p>${H(TX.noGaps)}</p>` : ""}
        <p class="small muted">${H(TX.disc)}</p>
        <div class="ps-btns"><button type="button" class="btn btn-primary btn-sm" data-isopdf>${H(TX.isoPdf)}</button><button type="button" class="btn btn-ghost btn-sm" data-isoreset>${H(TX.isoReset)}</button></div>
      </aside></div>`;
  }

  /* ===================== Улашилган дарс / тест ===================== */
  let sharedLesson = null, sharedSpec = null, sharedErr = false;
  async function readShared() {
    const p = new URLSearchParams(location.search);
    const d = p.get("ekd"), t = p.get("ekt");
    if (!d && !t) return;
    try {
      if (d) sharedLesson = clean(await decode(d));
      if (t) {
        const s = await decode(t);
        const q = (Array.isArray(s.q) ? s.q : []).slice(0, 40).filter((r) => Array.isArray(r) && r.length === 3 && qOf([String(r[0]), +r[1], +r[2]])).map((r) => [String(r[0]), +r[1], +r[2]]);
        sharedSpec = q.length ? { t: String(s.t || "").slice(0, 120), s: (+s.s || 0) >>> 0, q } : null;
      }
      if (!sharedLesson && !sharedSpec) sharedErr = true;
    } catch (e) { sharedErr = true; }
    if (location.hash !== "#ustoz" && window.EkoNav) EkoNav.go("ustoz");
    render();
  }
  function sharedHtml() {
    if (sharedErr) return `<p class="vd-net">${H(TX.badLink)}</p>`;
    if (sharedLesson) return lessonView(sharedLesson, { shared: true }) + `<button type="button" class="btn btn-ghost btn-sm" data-closeshared>${H(TX.close)}</button>`;
    if (sharedSpec) {
      const qs = variant(sharedSpec, 0);
      return `<section class="ps-box"><span class="pill">📨 ${H(TX.from)}</span><h3>${esc(sharedSpec.t || L(TX.sharedT))}</h3>
        <label class="us-name">${H(TX.yourName)}<input type="text" maxlength="60" data-sname autocomplete="off"></label>
        ${quizHtml(qs, "t", true)}<button type="button" class="btn btn-ghost btn-sm" data-closeshared>${H(TX.close)}</button></section>`;
    }
    return "";
  }

  /* ===================== Асосий ===================== */
  function render() {
    const sh = sharedErr || sharedLesson || sharedSpec;
    ROOT.innerHTML = `
      <div class="qn-head"><div><span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(sh ? (sharedLesson ? TX.shared : TX.sharedT) : TX.title)}</h2>
        ${sh ? "" : `<p class="muted" style="max-width:820px">${H(TX.lead)}</p>`}</div></div>
      ${sh ? sharedHtml() : `<div class="filters sy-tabs" role="tablist">${Object.entries(TX.tabs).map(([k, v]) => `<button type="button" role="tab" class="chip ${st.tab === k ? "active" : ""}" aria-selected="${st.tab === k}" data-tab="${k}">${H(v)}</button>`).join("")}</div><div data-panel></div>`}`;
    if (sh) return;
    const panel = ROOT.querySelector("[data-panel]");
    ({ test: renderTest, build: renderBuild, iso: renderIso }[st.tab] || renderTest)(panel);
    if (st.tab === "test" && built) drawQr(builtLink);
  }
  async function linkFor(l) {
    const out = ROOT.querySelector("[data-lout]");
    const url = linkOf("ekd", await encode(l));
    out.innerHTML = `<h4>${esc(l.t)}</h4><div class="us-link"><input type="text" readonly value="${esc(url)}" data-sel aria-label="${H(TX.link)}"><button type="button" class="btn btn-ghost btn-sm" data-copy="${esc(url)}">${H(TX.copy)}</button>${navigator.share ? `<button type="button" class="btn btn-ghost btn-sm" data-share="${esc(url)}">${H(TX.share)}</button>` : ""}</div><div class="us-qr" data-qr></div>`;
    drawQr(url);
  }
  function download(text, name) {
    const a = document.createElement("a");
    a.download = name; a.href = URL.createObjectURL(new Blob([text], { type: "application/json" })); a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 20000);
  }
  ROOT.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tab]");
    if (t) { if (st.tab === "build") readForm(); st.tab = t.dataset.tab; save(); render(); const b = ROOT.querySelector(`[data-tab="${st.tab}"]`); if (b) b.focus(); return; }
    if (e.target.closest("[data-gen]")) return void generate();
    const vp = e.target.closest("[data-vpdf]"); if (vp) return void pdfVariant(+vp.dataset.vpdf);
    const cp = e.target.closest("[data-copy]");
    if (cp) { const v = cp.dataset.copy; (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => toast(TX.copied), () => { const i = cp.parentElement.querySelector("input"); if (i) { i.select(); try { document.execCommand("copy"); toast(TX.copied); } catch (err) { /* ignore */ } } }); return; }
    const sh = e.target.closest("[data-share]"); if (sh) { navigator.share({ title: "Ekomun", url: sh.dataset.share }).catch(() => {}); return; }
    if (e.target.closest("[data-sel]")) { e.target.select(); return; }
    if (e.target.closest("[data-qadd]")) { readForm(); st.draft.q.push({ q: "", a: ["", "", ""], c: 0 }); render(); return; }
    const qd = e.target.closest("[data-qdel]"); if (qd) { readForm(); st.draft.q.splice(+qd.dataset.qdel, 1); if (!st.draft.q.length) st.draft.q.push({ q: "", a: ["", "", ""], c: 0 }); render(); return; }
    if (e.target.closest("[data-bnew]")) { st.draft = blank(); save(); render(); return; }
    const lv = e.target.closest("[data-lview]"); if (lv) { const l = st.lessons.find((x) => x.id === lv.dataset.lview); if (l) ROOT.querySelector("[data-lout]").innerHTML = lessonView(l); return; }
    const le = e.target.closest("[data-ledit]"); if (le) { const l = st.lessons.find((x) => x.id === le.dataset.ledit); if (l) { st.draft = JSON.parse(JSON.stringify(l)); while (st.draft.q.length && st.draft.q.some((q) => q.a.length < 3)) { st.draft.q.forEach((q) => { while (q.a.length < 3) q.a.push(""); }); } if (!st.draft.q.length) st.draft.q.push({ q: "", a: ["", "", ""], c: 0 }); render(); ROOT.querySelector("[data-bform]").scrollIntoView({ block: "start" }); } return; }
    const ll = e.target.closest("[data-llink]"); if (ll) { const l = st.lessons.find((x) => x.id === ll.dataset.llink); if (l) linkFor(l); return; }
    const lj = e.target.closest("[data-ljson]"); if (lj) { const l = st.lessons.find((x) => x.id === lj.dataset.ljson); if (l) download(JSON.stringify(l, null, 2), `Ekomun-dars-${l.id}.json`); return; }
    const ld = e.target.closest("[data-ldel]"); if (ld) { st.lessons = st.lessons.filter((x) => x.id !== ld.dataset.ldel); save(); render(); return; }
    const iq = e.target.closest("[data-iso]");
    if (iq) { const k = iq.dataset.iso, v = +iq.dataset.v; if (st.iso[k] === v) delete st.iso[k]; else st.iso[k] = v; save(); const y = window.scrollY; render(); window.scrollTo(0, y); const b = ROOT.querySelector(`[data-iso="${k}"][data-v="${v}"]`); if (b) b.focus({ preventScroll: true }); if (Object.keys(st.iso).length >= 21) xpOnce("us_iso", 10, TX.tabs.iso); return; }
    if (e.target.closest("[data-isoreset]")) { st.iso = {}; save(); render(); return; }
    if (e.target.closest("[data-isopdf]") && window.EkoPDF) {
      const box = document.createElement("div");
      box.innerHTML = ROOT.querySelector("[data-isores]").outerHTML;
      box.style.cssText = "position:absolute;left:-9999px;top:0;width:800px";
      document.body.appendChild(box);
      EkoPDF.save(box.firstElementChild, { title: "ISO 14001 — " + L(TX.ready), file: "Ekomun-ISO14001" }).finally(() => box.remove());
      return;
    }
    if (e.target.closest("[data-closeshared]")) {
      sharedLesson = sharedSpec = null; sharedErr = false;
      try { const u = new URL(location.href); u.searchParams.delete("ekd"); u.searchParams.delete("ekt"); history.replaceState(null, "", u.pathname + u.search + u.hash); } catch (err) { /* ignore */ }
      render();
    }
  });
  ROOT.addEventListener("change", (e) => {
    const gc = e.target.closest("[data-gc]");
    if (gc) { const id = gc.dataset.gc; st.gen.cids = gc.checked ? [...new Set(st.gen.cids.concat(id))] : st.gen.cids.filter((x) => x !== id); save(); const y = window.scrollY; render(); window.scrollTo(0, y); return; }
    if (e.target.closest("[data-gn]")) { st.gen.n = Math.max(3, Math.min(40, +e.target.value || 10)); save(); return; }
    if (e.target.closest("[data-gv]")) { st.gen.v = Math.max(1, Math.min(4, +e.target.value || 1)); save(); if (built) { const o = ROOT.querySelector("[data-gout]"); o.innerHTML = builtHtml(); drawQr(builtLink); } return; }
    if (e.target.closest("[data-gt]")) { st.gen.title = e.target.value.slice(0, 120); save(); return; }
    const sd = e.target.closest("[name=sdg]"); if (sd) { sd.parentElement.classList.toggle("on", sd.checked); return; }
    const imp = e.target.closest("[data-bimp]");
    if (imp && imp.files && imp.files[0]) {
      imp.files[0].text().then((txt) => { let l = null; try { l = clean(JSON.parse(txt)); } catch (err) { l = null; } if (!l) { toast(TX.badLink); return; } l.id = Date.now().toString(36); st.lessons.unshift(l); st.lessons = st.lessons.slice(0, 50); save(); render(); toast(TX.savedOk); });
    }
  });
  ROOT.addEventListener("submit", (e) => {
    const q = e.target.closest("[data-quiz]");
    if (q) { e.preventDefault(); checkQuiz(q); return; }
    if (e.target.closest("[data-bform]")) { e.preventDefault(); saveDraft(); }
  });
  ROOT.addEventListener("focusout", (e) => { if (e.target.closest && e.target.closest("[data-bform]")) { readForm(); save(); } });
  window.addEventListener("eko:lang", () => { if (st.tab === "build" && !sharedLesson && !sharedSpec) readForm(); render(); });
  render();
  readShared();

  window.EkoTeacher = { encode, decode, variant, bankOf, clean };
})();
