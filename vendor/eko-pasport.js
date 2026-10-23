/* Экомун — 🛂 «Глобал кўникмалар паспорти» (Global Skills Passport).
   • Ҳар бир курс БМТ Барқарор ривожланиш мақсадлари (SDG) ва ЮНЕСКО ESD нинг 8 та асосий
     компетенцияси билан боғланган (UNESCO, «Education for Sustainable Development Goals:
     Learning Objectives», 2017). Курс карталарида SDG белгилари кўрсатилади.
   • Ўзлаштирилган дарс, якуний тест ва сертификатлардан «далил баллари» йиғилади ва
     компетенция даражаси (1–4) ҳисобланади.
   • Микро-сертификат зинапояси: 40 → 120 → 360 ўқув соати (Бошланғич, Профессионал, Диплом).
     Бу Экомуннинг ички даражаси; расмий кредит эмас (≈ ECTS кўрсаткичи фақат маълумот учун).
   • Сертификатларни Open Badges 3.0 (1EdTech) форматида юклаб олиш: сервер текширган
     сертификат Ed25519 (EdDSA) калити билан имзоланган VC-JWT кўринишида ҳам берилади.
   • Фаоллик кундалиги (охирги 30 кун) ва ойлик ҳисобот. Ҳамма маълумот қурилмада:
     localStorage «ekotalim:pasport». window.EkoPassport — бошқа модуллар учун. */
(() => {
  "use strict";
  const SEC = document.getElementById("pasport");
  const ROOT = document.getElementById("psRoot");

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
  const num = (n, d = 0) => { const s = Number(n).toFixed(d); return lang() === "en" ? s : s.replace(".", ","); };
  const hasServer = () => /^https?:$/.test(location.protocol) && location.hostname !== "appassets.androidplatform.net";
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  /* ===================== SDG ва ESD ===================== */
  const SDG = {
    3: { c: "#4C9F38", n: t3("Сиҳат-саломатлик", "Хорошее здоровье", "Good health") },
    4: { c: "#C5192D", n: t3("Сифатли таълим", "Качественное образование", "Quality education") },
    6: { c: "#26BDE2", n: t3("Тоза сув", "Чистая вода", "Clean water") },
    7: { c: "#FCC30B", n: t3("Тоза энергия", "Чистая энергия", "Clean energy") },
    8: { c: "#A21942", n: t3("Муносиб иш", "Достойная работа", "Decent work") },
    9: { c: "#FD6925", n: t3("Инновация ва саноат", "Индустрия и инновации", "Industry & innovation") },
    11: { c: "#FD9D24", n: t3("Барқарор шаҳарлар", "Устойчивые города", "Sustainable cities") },
    12: { c: "#BF8B2E", n: t3("Масъулиятли истеъмол", "Ответственное потребление", "Responsible consumption") },
    13: { c: "#3F7E44", n: t3("Иқлим ҳаракати", "Борьба с изменением климата", "Climate action") },
    14: { c: "#0A97D9", n: t3("Сув ости ҳаёти", "Жизнь под водой", "Life below water") },
    15: { c: "#56C02B", n: t3("Қуруқликдаги ҳаёт", "Жизнь на суше", "Life on land") },
    16: { c: "#00689D", n: t3("Адолат ва институтлар", "Мир и правосудие", "Peace & justice") },
    17: { c: "#19486A", n: t3("Ҳамкорлик", "Партнёрство", "Partnerships") }
  };
  /* Оқ матн контрасти 4,5 дан паст бўлган очиқ SDG рангларида тўқ ёзув */
  const ink = (hex) => { const v = [1, 3, 5].map((i) => { const x = parseInt(hex.slice(i, i + 2), 16) / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
    return 1.05 / (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2] + 0.05) < 4.5 ? "#0b1f17" : "#fff"; };
  for (const g in SDG) SDG[g].i = ink(SDG[g].c);
  const ESD = [
    { id: "sys", i: "🕸", n: t3("Тизимли фикрлаш", "Системное мышление", "Systems thinking"), d: t3("Табиат, жамият ва иқтисодни бир бутун тизим сифатида кўриш.", "Видеть природу, общество и экономику как единую систему.", "Seeing nature, society and economy as one system.") },
    { id: "ant", i: "🔭", n: t3("Келажакни кўра билиш", "Прогностическое мышление", "Anticipatory"), d: t3("Бир неча келажак сценарийларини тасаввур қилиш ва баҳолаш.", "Представлять и оценивать сценарии будущего.", "Imagining and assessing possible futures.") },
    { id: "norm", i: "⚖️", n: t3("Қадриятлар ва меъёрлар", "Нормативная", "Normative"), d: t3("Адолат, ҳуқуқ ва масъулият асосида қарор қабул қилиш.", "Решения на основе справедливости, права и ответственности.", "Decisions based on fairness, law and responsibility.") },
    { id: "strat", i: "🧭", n: t3("Стратегик", "Стратегическая", "Strategic"), d: t3("Барқарорлик учун ҳаракат режасини тузиш ва амалга ошириш.", "Составлять и выполнять планы действий.", "Designing and carrying out action plans.") },
    { id: "collab", i: "🤝", n: t3("Ҳамкорлик", "Сотрудничество", "Collaboration"), d: t3("Бошқалардан ўрганиш, жамоада ишлаш, турли фикрни ҳурмат қилиш.", "Учиться у других, работать в команде.", "Learning from others and working in teams.") },
    { id: "crit", i: "🔎", n: t3("Танқидий фикрлаш", "Критическое мышление", "Critical thinking"), d: t3("Далил ва манбани текшириш, ўз фикрини асослаш.", "Проверять данные и источники, аргументировать.", "Checking evidence and sources, arguing a case.") },
    { id: "self", i: "🪞", n: t3("Ўзини англаш", "Самосознание", "Self-awareness"), d: t3("Ўз ўрни, одатлари ва таъсирини англаш.", "Осознавать свою роль, привычки и влияние.", "Understanding one's own role, habits and impact.") },
    { id: "integ", i: "🧩", n: t3("Яхлит муаммо ечиш", "Комплексное решение проблем", "Integrated problem-solving"), d: t3("Мураккаб экологик муаммога амалий ечим топиш.", "Находить практические решения сложных проблем.", "Finding practical fixes for complex problems.") }
  ];
  /* Курс → SDG мақсадлари ва ESD компетенциялари (биринчи компетенция — асосий) */
  const META = {
    yerqalqon: [[12, 11, 4], ["integ", "strat", "self"]], yosh: [[4, 15, 13], ["crit", "sys"]], tabiat: [[15, 14, 4], ["sys", "self"]],
    steam: [[9, 4, 12], ["integ", "collab", "strat"]], dunyo: [[17, 11, 4], ["collab", "norm"]], kichik: [[4, 15, 12], ["self", "sys"]],
    asoslar: [[13, 15, 6, 4], ["sys", "norm"]], korxona: [[12, 9, 8, 13], ["strat", "norm", "integ"]], talaba: [[4, 7, 11, 13], ["strat", "ant"]],
    suvhavo: [[6, 3, 13], ["sys", "crit"]], biotoza: [[6, 14, 3], ["sys", "crit"]], monitoring: [[15, 3, 13, 6], ["crit", "sys"]],
    iqlim: [[13, 7, 11], ["ant", "strat", "sys"]], qayta: [[12, 9, 11], ["integ", "strat"]], ekologiya: [[15, 14, 13, 4], ["sys", "ant"]],
    litosfera: [[12, 15, 3], ["integ", "crit"]], xalqaro: [[17, 13, 12], ["collab", "norm", "ant"]], qollanma: [[16, 12, 9], ["norm", "integ"]],
    tadqiqot: [[4, 9, 17], ["crit", "self"]], binoxavf: [[11, 9, 3], ["sys", "strat", "crit"]], tibbiy: [[3, 4, 8], ["self", "crit", "collab"]]
  };
  const LEVELS = [
    { min: 0, n: t3("Бошланғич", "Начальный", "Beginner") },
    { min: 20, n: t3("Ривожланаётган", "Развивающийся", "Developing") },
    { min: 60, n: t3("Малакали", "Уверенный", "Proficient") },
    { min: 120, n: t3("Илғор", "Продвинутый", "Advanced") }
  ];
  const levelOf = (p) => LEVELS.reduce((a, l, i) => (p >= l.min ? i : a), 0);
  const LADDER = [
    { id: "found", h: 40, certs: 1, i: "🌱", n: t3("Бошланғич сертификат", "Базовый сертификат", "Foundation certificate") },
    { id: "pro", h: 120, certs: 3, i: "🌿", n: t3("Профессионал сертификат", "Профессиональный сертификат", "Professional certificate") },
    { id: "dip", h: 360, certs: 6, i: "🌳", n: t3("Диплом", "Диплом", "Diploma") }
  ];

  /* ===================== Матнлар ===================== */
  const TX = {
    pill: t3("🛂 Глобал кўникмалар паспорти · SDG · UNESCO ESD · Open Badges 3.0", "🛂 Глобальный паспорт навыков · ЦУР · ЮНЕСКО ОУР · Open Badges 3.0", "🛂 Global Skills Passport · SDG · UNESCO ESD · Open Badges 3.0"),
    title: t3("Глобал кўникмалар паспорти", "Глобальный паспорт навыков", "Global Skills Passport"),
    lead: t3("Ўзлаштирган ҳар бир дарсингиз халқаро стандартлар тилида: БМТнинг Барқарор ривожланиш мақсадлари (SDG) ва ЮНЕСКОнинг барқарор ривожланиш учун таълим (ESD) компетенциялари. Сертификатларни Open Badges 3.0 форматида юклаб олиб, электрон портфолиога қўшишингиз мумкин.",
      "Каждый пройденный урок — на языке международных стандартов: Цели устойчивого развития ООН (ЦУР) и компетенции ЮНЕСКО по образованию в интересах устойчивого развития (ОУР). Сертификаты можно скачать в формате Open Badges 3.0 и добавить в электронное портфолио.",
      "Every lesson you complete, in the language of international standards: the UN Sustainable Development Goals (SDGs) and UNESCO Education for Sustainable Development (ESD) competencies. Download certificates as Open Badges 3.0 and add them to a digital portfolio."),
    holder: t3("Паспорт эгаси", "Владелец паспорта", "Passport holder"),
    guest: t3("Меҳмон", "Гость", "Guest"),
    hours: t3("ўқув соати", "учебных часов", "study hours"),
    lessons: t3("дарс", "уроков", "lessons"),
    certs: t3("сертификат", "сертификатов", "certificates"),
    ects: t3("≈ ECTS (маълумот учун)", "≈ ECTS (для справки)", "≈ ECTS (for reference)"),
    ladder: t3("🎓 Микро-сертификат зинапояси", "🎓 Лестница микросертификатов", "🎓 Micro-credential ladder"),
    ladderLead: t3("Соатлар дарс давомийлиги, якуний тестлар, видео дарслар ва 3D лаборатория мақсадларидан ҳисобланади. Бу Экомуннинг ички даражаси — олий таълим кредити эмас.",
      "Часы считаются по длительности уроков, итоговым тестам, видеоурокам и целям 3D-лаборатории. Это внутренний уровень Ekomun, а не вузовский кредит.",
      "Hours come from lesson length, final tests, video lessons and 3D lab goals. This is an internal Ekomun level, not a university credit."),
    need: t3("керак", "нужно", "needed"),
    got: t3("олинди", "получено", "earned"),
    esd: t3("🧠 ЮНЕСКО ESD компетенциялари", "🧠 Компетенции ЮНЕСКО ОУР", "🧠 UNESCO ESD competencies"),
    esdLead: t3("Ҳар бир тугатилган дарс 2–3 далил балли, ўтилган якуний тест ва сертификат +10 балл беради.", "Каждый урок даёт 2–3 балла, сданный итоговый тест и сертификат — ещё +10.", "Each lesson gives 2–3 evidence points; a passed final test and a certificate add +10 each."),
    pts: t3("балл", "балл.", "pts"),
    sdg: t3("🌐 БМТ Барқарор ривожланиш мақсадлари бўйича", "🌐 По Целям устойчивого развития ООН", "🌐 By UN Sustainable Development Goals"),
    sdgLead: t3("Рақам — шу мақсадга тегишли курсларда тугатилган дарслар сони. Картани босинг — мос курслар очилади.", "Число — пройденные уроки в курсах этой цели. Нажмите, чтобы увидеть курсы.", "The number shows lessons completed in courses linked to the goal. Tap to see the courses."),
    sdgCourses: t3("Мос курслар", "Подходящие курсы", "Matching courses"),
    badges: t3("🏅 Сертификатлар · Open Badges 3.0", "🏅 Сертификаты · Open Badges 3.0", "🏅 Certificates · Open Badges 3.0"),
    badgesLead: t3("Open Badges 3.0 — 1EdTech халқаро стандарти: файлни LinkedIn, Credly, Europass ёки бошқа электрон портфолиога юклаш мумкин. Сервер текширган сертификат рақамли имзо (Ed25519) билан берилади.",
      "Open Badges 3.0 — международный стандарт 1EdTech: файл можно загрузить в LinkedIn, Credly, Europass и другие портфолио. Сертификат, проверенный сервером, подписывается цифровой подписью (Ed25519).",
      "Open Badges 3.0 is the 1EdTech international standard: upload the file to LinkedIn, Credly, Europass or another portfolio. Server-verified certificates come with an Ed25519 digital signature."),
    noBadges: t3("Ҳали сертификат йўқ. Курсни тугатиб, якуний тестдан камида 60 % тўпланг.", "Сертификатов пока нет. Пройдите курс и наберите не менее 60 % в итоговом тесте.", "No certificates yet. Finish a course and score at least 60 % in its final test."),
    toCourses: t3("Курсларга ўтиш", "К курсам", "Go to courses"),
    ob: t3("Open Badge (JSON)", "Open Badge (JSON)", "Open Badge (JSON)"),
    jwt: t3("Имзоланган (VC-JWT)", "Подписанный (VC-JWT)", "Signed (VC-JWT)"),
    local: t3("Интернетсиз берилган — имзо учун интернет билан курс саҳифасида сертификатни қайта очинг.", "Выдан без интернета — для подписи откройте сертификат ещё раз онлайн.", "Issued offline — reopen the certificate online to get it signed."),
    signFail: t3("Имзоланган нусха олинмади. Интернетни текшириб, қайта уриниб кўринг.", "Не удалось получить подписанную копию. Проверьте интернет.", "Could not get the signed copy. Check your connection."),
    act: t3("📅 Фаоллик кундалиги (30 кун)", "📅 Дневник активности (30 дней)", "📅 Activity log (30 days)"),
    month: t3("Шу ой", "Этот месяц", "This month"),
    prev: t3("Ўтган ой", "Прошлый месяц", "Last month"),
    acc: t3("тўғри жавоб", "верных ответов", "correct answers"),
    days: t3("фаол кун", "активных дней", "active days"),
    noAct: t3("Фаоллик шу кундан бошлаб ёзилади: дарс ўқинг ва саволларга жавоб беринг.", "Активность записывается с сегодняшнего дня: читайте уроки и отвечайте на вопросы.", "Activity is logged from today: read lessons and answer questions."),
    exp: t3("Паспорт (JSON)", "Паспорт (JSON)", "Passport (JSON)"),
    pdf: t3("PDF", "PDF", "PDF"),
    share: t3("Ўқитувчига кўрсатиш учун PDF ёки JSON сифатида сақланг.", "Сохраните как PDF или JSON, чтобы показать преподавателю.", "Save as PDF or JSON to show your teacher."),
    std: t3("Стандартлар: UN SDG (2015), UNESCO ESD Learning Objectives (2017), 1EdTech Open Badges 3.0, W3C Verifiable Credentials.", "Стандарты: ЦУР ООН (2015), ЮНЕСКО «Цели обучения ОУР» (2017), 1EdTech Open Badges 3.0, W3C Verifiable Credentials.", "Standards: UN SDG (2015), UNESCO ESD Learning Objectives (2017), 1EdTech Open Badges 3.0, W3C Verifiable Credentials."),
    lvlUp: t3("Компетенция даражаси ошди", "Уровень компетенции вырос", "Competency level up"),
    sdgTitle: t3("БМТ Барқарор ривожланиш мақсадлари", "Цели устойчивого развития ООН", "UN Sustainable Development Goals")
  };

  /* ===================== Ҳолат ===================== */
  const KEY = "ekotalim:pasport";
  let st = { d: {}, lv: {} };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  function logAct(kind, ok) {
    const k = dayKey(), d = st.d[k] || (st.d[k] = { l: 0, q: 0, ok: 0 });
    if (kind === "l") d.l++;
    if (kind === "q") { d.q++; if (ok) d.ok++; }
    /* 400 кундан эскисини тозалаш */
    const keys = Object.keys(st.d).sort();
    while (keys.length > 400) delete st.d[keys.shift()];
    save();
  }
  window.addEventListener("eko:lessondone", () => { logAct("l"); later(); });
  window.addEventListener("eko:q", (e) => { logAct("q", !!(e.detail && e.detail.ok)); later(); });
  window.addEventListener("eko:fn", () => later());

  /* ===================== Ҳисоб ===================== */
  const courses = () => ((App() && App().courses) || []);
  const S = () => ((App() && App().state) || { correct: {}, exams: {}, certs: {}, flags: {} });
  const stageNow = () => (window.EkoProfile && EkoProfile.stage) || "";
  const inStage = (c, stg) => !stg || (stg === "maktab" ? c.stage === "maktab" || c.audience === "bola" : c.stage !== "maktab" && c.audience !== "bola");
  function lessonDone(c, li) { const s = S(); return (c.lessons[li].quiz || []).every((_, qi) => s.correct[`${c.id}:${li}:${qi}`]); }
  function videoCount() { try { return Object.keys((JSON.parse(localStorage.getItem("ekotalim:video")) || {}).seen || {}).length; } catch (e) { return 0; } }
  function compute() {
    const s = S(), stg = stageNow();
    let minutes = 0, lessons = 0;
    const per = {};
    courses().forEach((c) => {
      let done = 0;
      c.lessons.forEach((l, i) => { if (lessonDone(c, i)) { done++; minutes += +l.minutes || 8; } });
      lessons += done;
      per[c.id] = { done, total: c.lessons.length, exam: s.exams ? s.exams[c.id] : null, cert: !!(s.certs && s.certs[c.id] && s.certs[c.id].grade) };
    });
    const exams = Object.keys(s.exams || {}).length;
    const goals = Object.keys(s.flags || {}).filter((k) => k.startsWith("l3g_")).length;
    minutes += exams * 20 + videoCount() * 15 + goals * 5;
    const comp = {};
    ESD.forEach((e) => (comp[e.id] = 0));
    Object.entries(META).forEach(([cid, [, cs]]) => {
      const p = per[cid]; if (!p) return;
      cs.forEach((k, i) => {
        comp[k] += p.done * (i === 0 ? 3 : 2) + (p.exam != null && p.exam >= 60 ? 10 : 0) + (p.cert ? 10 : 0);
      });
    });
    const sdg = {};
    Object.keys(SDG).forEach((g) => (sdg[g] = 0));
    Object.entries(META).forEach(([cid, [gs]]) => { const p = per[cid]; if (p) gs.forEach((g) => (sdg[g] += p.done)); });
    const certs = Object.entries(s.certs || {}).filter(([, c]) => c && c.grade);
    return { hours: minutes / 60, lessons, per, comp, sdg, certs, stg };
  }

  /* ===================== Курс карталарига SDG белгилари ===================== */
  function sdgChips(gs, cls = "") {
    return `<div class="sdg-row ${cls}" data-notr aria-label="${H(TX.sdgTitle)}">${gs.map((g) => `<span class="sdg-chip" style="--sc:${SDG[g].c};--si:${SDG[g].i}" title="SDG ${g}: ${H(SDG[g].n)}"><b>${g}</b> ${H(SDG[g].n)}</span>`).join("")}</div>`;
  }
  function decorate() {
    Object.entries(META).forEach(([cid, [gs]]) => {
      const el = document.getElementById("crs-" + cid);
      if (!el) return;
      const old = el.querySelector(".sdg-row");
      if (old && old.dataset.l === lang()) return;
      if (old) old.remove();
      const p = el.querySelector("p");
      const box = document.createElement("div");
      box.innerHTML = sdgChips(gs);
      const row = box.firstElementChild; row.dataset.l = lang();
      if (p) p.after(row); else el.appendChild(row);
    });
  }
  let obs = null;
  function watchCards() {
    const first = document.querySelector("[id^='crs-']");
    if (!first || obs) return;
    obs = new MutationObserver(() => { if (!decorating) { decorating = true; requestAnimationFrame(() => { decorate(); decorating = false; }); } });
    obs.observe(first.parentElement, { childList: true });
  }
  let decorating = false;

  /* ===================== Чизиш ===================== */
  const bar = (v, max, c) => `<span class="ps-bar" aria-hidden="true"><i style="width:${Math.max(0, Math.min(100, (v / max) * 100)).toFixed(1)}%;${c ? "background:" + c : ""}"></i></span>`;
  const holder = () => {
    const p = window.EkoProfile && EkoProfile.profile;
    return (p && (p.name || p.nick)) || S().name || L(TX.guest);
  };
  function actChart() {
    const days = [];
    for (let i = 29; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = dayKey(d); days.push([k, st.d[k] || { l: 0, q: 0, ok: 0 }]); }
    const max = Math.max(4, ...days.map(([, v]) => v.q + v.l * 3));
    const W = 300, Hh = 80, bw = W / 30;
    const bars = days.map(([k, v], i) => {
      const h = ((v.q + v.l * 3) / max) * (Hh - 12);
      return `<rect x="${(i * bw + 1).toFixed(1)}" y="${(Hh - h).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${Math.max(h, v.q || v.l ? 2 : 0.8).toFixed(1)}" rx="1.5" class="${v.q || v.l ? "on" : ""}"><title>${k}: ${v.l} ${L(TX.lessons)}, ${v.ok}/${v.q}</title></rect>`;
    }).join("");
    return `<svg class="ps-chart" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${H(TX.act)}">${bars}</svg>`;
  }
  function monthStats(off) {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - off);
    const pre = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    let l = 0, q = 0, ok = 0, days = 0;
    Object.entries(st.d).forEach(([k, v]) => { if (k.startsWith(pre)) { l += v.l; q += v.q; ok += v.ok; if (v.l || v.q) days++; } });
    return { l, q, ok, days };
  }
  function render() {
    if (!ROOT) return;
    const R = compute(), cs = courses();
    const ects = R.hours / 28;
    const ladder = LADDER.map((s, i) => {
      const okH = R.hours >= s.h, okC = R.certs.length >= s.certs, done = okH && okC;
      return `<li class="ps-step ${done ? "done" : ""}"><span class="ps-step-i" aria-hidden="true">${s.i}</span><div><b>${H(s.n)}</b>
        <small>${num(Math.min(R.hours, s.h), 1)} / ${s.h} ${H(TX.hours)} · ${Math.min(R.certs.length, s.certs)} / ${s.certs} ${H(TX.certs)}</small>
        ${bar(Math.min(R.hours / s.h, R.certs.length / s.certs), 1)}</div>${done ? `<span class="ps-ok">✓ ${H(TX.got)}</span>` : ""}</li>${i < LADDER.length - 1 ? `<li class="ps-arrow" aria-hidden="true">↓</li>` : ""}`;
    }).join("");
    const comps = ESD.map((e) => {
      const p = R.comp[e.id], lv = levelOf(p);
      return `<li class="ps-comp"><span class="ps-ci" aria-hidden="true">${e.i}</span><div><b>${H(e.n)}</b> <span class="ps-lv lv${lv}">${lv + 1}. ${H(LEVELS[lv].n)}</span>
        <small>${H(e.d)}</small>${bar(p, 120)}<small class="muted">${p} ${H(TX.pts)}${lv < 3 ? ` · ${LEVELS[lv + 1].min - p} → ${H(LEVELS[lv + 1].n)}` : ""}</small></div></li>`;
    }).join("");
    const sdgs = Object.keys(SDG).map((g) => `<button type="button" class="ps-sdg" style="--sc:${SDG[g].c};--si:${SDG[g].i}" data-sdg="${g}" aria-expanded="${openSdg === g}"><b>${g}</b><span>${H(SDG[g].n)}</span><em>${R.sdg[g]}</em></button>`).join("");
    const sdgList = openSdg ? `<div class="ps-sdglist"><b>SDG ${openSdg} · ${H(SDG[openSdg].n)} — ${H(TX.sdgCourses)}:</b><ul>${Object.entries(META).filter(([, [gs]]) => gs.includes(+openSdg)).map(([cid]) => cs.find((c) => c.id === cid)).filter((c) => c && inStage(c, R.stg)).map((c) => `<li><a href="#kurslar" data-crs="${c.id}">${c.icon} ${esc(T(c.title))}</a> <small class="muted">${R.per[c.id].done}/${R.per[c.id].total}</small></li>`).join("")}</ul></div>` : "";
    const badges = R.certs.length ? `<ul class="ps-badges">${R.certs.map(([cid, c]) => {
      const course = cs.find((x) => x.id === cid); if (!course) return "";
      const md = { gold: "🥇", silver: "🥈", bronze: "🥉" }[c.grade] || "🏅";
      return `<li class="ps-badge ${esc(c.grade)}"><span class="ps-medal" aria-hidden="true">${md}</span><div><b>${esc(T(course.title))}</b>
        <small>${esc(c.name)} · ${esc(c.date)} · ${c.pct} % · <span data-notr>${esc(c.code)}</span></small>
        <div class="ps-btns"><button type="button" class="btn btn-ghost btn-sm" data-ob="${cid}"><i class="fa-solid fa-file-code" aria-hidden="true"></i> ${H(TX.ob)}</button>${c.verified && hasServer() ? `<button type="button" class="btn btn-ghost btn-sm" data-jwt="${cid}"><i class="fa-solid fa-signature" aria-hidden="true"></i> ${H(TX.jwt)}</button>` : ""}</div>
        ${c.verified ? "" : `<small class="muted">${H(TX.local)}</small>`}</div></li>`;
    }).join("")}</ul>` : `<p class="muted">${H(TX.noBadges)} <a href="#kurslar">${H(TX.toCourses)} →</a></p>`;
    const m0 = monthStats(0), m1 = monthStats(1);
    const mrow = (n, m) => `<div class="ps-m"><b>${H(n)}</b><span>${m.l} ${H(TX.lessons)}</span><span>${m.q ? Math.round((m.ok / m.q) * 100) : 0} % ${H(TX.acc)}</span><span>${m.days} ${H(TX.days)}</span></div>`;
    const anyAct = Object.keys(st.d).length > 0;
    ROOT.innerHTML = `
      <div class="qn-head"><div><span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(TX.title)}</h2>
        <p class="muted" style="max-width:820px">${H(TX.lead)}</p></div></div>
      <div class="ps-card ps-id" id="psDoc">
        <div class="ps-idtop"><div class="ps-photo" aria-hidden="true">🌍</div>
          <div><small class="muted">${H(TX.holder)}</small><h3>${esc(holder())}</h3>
            <div class="ps-kpis"><span><b>${num(R.hours, 1)}</b> ${H(TX.hours)}</span><span><b>${R.lessons}</b> ${H(TX.lessons)}</span><span><b>${R.certs.length}</b> ${H(TX.certs)}</span><span><b>${num(ects, 1)}</b> ${H(TX.ects)}</span></div></div></div>
        <div class="ps-grid">
          <section class="ps-box"><h3>${H(TX.ladder)}</h3><p class="small muted">${H(TX.ladderLead)}</p><ol class="ps-ladder">${ladder}</ol></section>
          <section class="ps-box"><h3>${H(TX.esd)}</h3><p class="small muted">${H(TX.esdLead)}</p><ul class="ps-comps">${comps}</ul></section>
        </div>
        <section class="ps-box"><h3>${H(TX.sdg)}</h3><p class="small muted">${H(TX.sdgLead)}</p><div class="ps-sdgs">${sdgs}</div>${sdgList}</section>
        <section class="ps-box"><h3>${H(TX.badges)}</h3><p class="small muted">${H(TX.badgesLead)}</p>${badges}</section>
        <section class="ps-box"><h3>${H(TX.act)}</h3>${anyAct ? actChart() + `<div class="ps-months">${mrow(TX.month, m0)}${mrow(TX.prev, m1)}</div>` : `<p class="muted">${H(TX.noAct)}</p>`}</section>
        <p class="small muted">${H(TX.std)}</p>
      </div>
      <div class="ps-btns ps-exp"><button type="button" class="btn btn-primary" data-pdf><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdf)}</button>
        <button type="button" class="btn btn-ghost" data-json><i class="fa-solid fa-download" aria-hidden="true"></i> ${H(TX.exp)}</button>
        <span class="small muted">${H(TX.share)}</span></div>`;
    checkLevels(R);
  }
  let openSdg = "";
  function checkLevels(R) {
    let up = null;
    ESD.forEach((e) => {
      const lv = levelOf(R.comp[e.id]);
      if (st.lv[e.id] == null) st.lv[e.id] = lv;
      else if (lv > st.lv[e.id]) { st.lv[e.id] = lv; up = e; const a = App(); if (a && a.addXp) a.addXp(10 * lv, L(TX.lvlUp)); }
    });
    if (up) { save(); toast(`🧠 ${L(TX.lvlUp)}: ${L(up.n)}`); }
    else save();
  }
  let tm = 0;
  function later() { clearTimeout(tm); tm = setTimeout(() => { if (SEC && !SEC.hidden && SEC.offsetParent !== null) render(); else checkLevels(compute()); }, 400); }

  /* ===================== Open Badges 3.0 ===================== */
  const site = () => (hasServer() ? location.origin : "https://ekomun.uz");
  async function sha256(s) {
    if (!(window.crypto && crypto.subtle)) return "";
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  async function credentialOf(cid) {
    const c = S().certs[cid], course = courses().find((x) => x.id === cid);
    const salt = [...crypto.getRandomValues(new Uint8Array(8))].map((x) => x.toString(16).padStart(2, "0")).join("");
    const hash = await sha256(c.name + salt);
    const gs = (META[cid] || [[]])[0];
    return {
      "@context": ["https://www.w3.org/ns/credentials/v2", "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"],
      id: c.verified ? `${site()}/tekshir?c=${encodeURIComponent(c.code)}` : `urn:ekomun:local:${c.code}`,
      type: ["VerifiableCredential", "OpenBadgeCredential"],
      issuer: { id: `${site()}/api/ob3/issuer`, type: ["Profile"], name: "Ekomun", url: site() },
      validFrom: new Date(c.date + "T00:00:00Z").toISOString(),
      name: `Ekomun: ${course.title}`,
      credentialSubject: {
        type: ["AchievementSubject"],
        identifier: [hash ? { type: ["IdentityObject"], identityHash: "sha256$" + hash, identityType: "name", hashed: true, salt } : { type: ["IdentityObject"], identityHash: c.name, identityType: "name", hashed: false }],
        achievement: {
          id: `${site()}/api/ob3/achievement/${cid}`, type: ["Achievement"], achievementType: "Certificate",
          name: course.title, description: course.desc || course.title,
          criteria: { narrative: `${course.lessons.length} lessons completed and the final test passed (≥ 60 %).` },
          alignment: gs.map((g) => ({ type: ["Alignment"], targetName: `SDG ${g}: ${SDG[g].n.en}`, targetUrl: `https://sdgs.un.org/goals/goal${g}`, targetType: "ext:UN-SDG" })),
          resultDescription: [{ id: `urn:ekomun:result:${cid}:score`, type: ["ResultDescription"], name: "Final test score", resultType: "Percent" }],
          tag: ["ecology", "ESD"].concat(gs.map((g) => "SDG" + g)),
          inLanguage: "uz"
        },
        result: [{ type: ["Result"], resultDescription: `urn:ekomun:result:${cid}:score`, value: String(c.pct) }]
      },
      evidence: [{ type: ["Evidence"], name: c.grade, narrative: `Grade: ${c.grade}, ${c.lessons || course.lessons.length} lessons` }]
    };
  }
  function download(text, name, type) {
    const a = document.createElement("a");
    a.download = name; a.href = URL.createObjectURL(new Blob([text], { type })); a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 20000);
  }
  async function exportOb(cid) {
    try { download(JSON.stringify(await credentialOf(cid), null, 2), `Ekomun-OpenBadge-${cid}.json`, "application/ld+json"); }
    catch (e) { toast(TX.signFail); }
  }
  async function exportJwt(cid) {
    const c = S().certs[cid];
    try {
      const r = await fetch("/api/ob3?c=" + encodeURIComponent(c.code), { credentials: "same-origin" });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      download(d.jwt, `Ekomun-OpenBadge-${cid}.jwt`, "application/vc+jwt");
      download(JSON.stringify(d.credential, null, 2), `Ekomun-OpenBadge-${cid}-signed.json`, "application/ld+json");
    } catch (e) { toast(TX.signFail); }
  }
  function exportPassport() {
    const R = compute(), cs = courses();
    const data = {
      type: "EkomunSkillsPassport", version: 1, generated: new Date().toISOString(), holder: holder(), stage: R.stg || null,
      hours: Math.round(R.hours * 10) / 10, lessons: R.lessons,
      ladder: LADDER.map((s) => ({ id: s.id, name: s.n.en, hours: s.h, certificatesNeeded: s.certs, achieved: R.hours >= s.h && R.certs.length >= s.certs })),
      competencies: ESD.map((e) => ({ id: e.id, name: e.n.en, framework: "UNESCO ESD key competencies (2017)", points: R.comp[e.id], level: levelOf(R.comp[e.id]) + 1 })),
      sdg: Object.keys(SDG).map((g) => ({ goal: +g, name: SDG[g].n.en, lessons: R.sdg[g] })),
      certificates: R.certs.map(([cid, c]) => ({ course: cid, title: (cs.find((x) => x.id === cid) || {}).title, grade: c.grade, score: c.pct, date: c.date, code: c.code, verified: !!c.verified, verifyUrl: c.verified ? `${site()}/tekshir?c=${c.code}` : null }))
    };
    download(JSON.stringify(data, null, 2), "Ekomun-pasport.json", "application/json");
  }

  if (ROOT) {
    ROOT.addEventListener("click", (e) => {
      const g = e.target.closest("[data-sdg]");
      if (g) { openSdg = openSdg === g.dataset.sdg ? "" : g.dataset.sdg; render(); const b = ROOT.querySelector(`[data-sdg="${g.dataset.sdg}"]`); if (b) b.focus(); return; }
      const ob = e.target.closest("[data-ob]"); if (ob) return void exportOb(ob.dataset.ob);
      const jw = e.target.closest("[data-jwt]"); if (jw) return void exportJwt(jw.dataset.jwt);
      if (e.target.closest("[data-json]")) return exportPassport();
      if (e.target.closest("[data-pdf]")) { if (window.EkoPDF) EkoPDF.save(ROOT.querySelector("#psDoc"), { title: L(TX.title), sub: holder(), file: "Ekomun-pasport" }); }
    });
  }
  window.addEventListener("hashchange", () => { if (location.hash === "#pasport") render(); });
  window.addEventListener("eko:lang", () => { render(); decorate(); });
  window.addEventListener("eko:stage", () => render());
  render();
  decorate();
  watchCards();

  window.EkoPassport = { compute, META, SDG, ESD, render, sdgChips, logAct };
})();
