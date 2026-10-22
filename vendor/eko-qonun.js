/* Экомун — 🎓 «Экологик ҳуқуқ» бўлими (университет босқичи).
   Конституциянинг экологик моддалари, экологик қонунлар кутубхонаси ва уларни интерактив
   усулларда ўргатиш: экологик суд (moot court), кейс-стади (Гарвард кейс методи), Оксфорд дебати,
   эко-детектив (inquiry-based learning), корхона симулятори, хорижий очиқ маълумот платформалари
   (NASA Worldview, Global Forest Watch, OpenAQ, Google Earth Engine) ва якуний тест.
   Ҳар бир қисмни PDF қилиб олиш мумкин (vendor/eko-pdf.js).
   Ҳуқуқий маълумот: vendor/eko-qonun-data.js (lex.uz ва constitution.uz бўйича текширилган).
   Натижалар фақат қурилмада сақланади (localStorage «ekotalim:qonun»).
   Матнлар uz/ru/en кўринишида; лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const SEC = document.getElementById("qonun");
  const ROOT = document.getElementById("qnRoot");
  if (!SEC || !ROOT) return;

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
  const App = () => window.EkoApp;
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(L(o)); };
  const D = () => window.EKO_QONUN || { CONST: [], CONST_OLD: [], LAWS: [], TOPICS: [], ASOF: "" };
  const ext = (u, label) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label || u.replace(/^https?:\/\//, "").replace(/\/$/, ""))} ↗</a>`;

  /* ---------- Ҳолат ---------- */
  const KEY = "ekotalim:qonun";
  let st = { done: {}, best: {}, notes: {}, xp: {} };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  const xp = (k, n, why) => {
    if (st.xp[k]) return;
    st.xp[k] = 1; save();
    const a = App(); if (a && a.addXp) a.addXp(n, L(why));
  };
  const mark = (k) => { st.done[k] = 1; save(); };

  /* ---------- Матнлар ---------- */
  const TX = {
    pill: t3("🎓 Университет босқичи · экологик ҳуқуқ", "🎓 Университет · экологическое право", "🎓 University stage · environmental law"),
    title: t3("Экологик ҳуқуқ: Конституция ва қонунлар", "Экологическое право: Конституция и законы", "Environmental law: the Constitution and laws"),
    lead: t3("Қонунни ёд олиш эмас, ишлатиш: модда → ҳаётий вазият → далил → қарор. Хорижий университетлардаги усуллар (moot court, кейс-метод, дебат, inquiry) асосида.",
      "Не зубрить закон, а применять: статья → жизненная ситуация → доказательства → решение. По методам зарубежных вузов (moot court, кейс-метод, дебаты, inquiry).",
      "Not memorising the law but using it: article → real situation → evidence → decision. Built on methods from foreign universities (moot court, case method, debate, inquiry)."),
    asof: t3("Ҳуқуқий маълумот ҳолати", "Правовая информация по состоянию на", "Legal information as of"),
    verify: t3("Расмий матн ва охирги таҳрирни ҳар доим lex.uz да текширинг: қонунлар ўзгариб туради.", "Официальный текст и последнюю редакцию всегда проверяйте на lex.uz: законы меняются.", "Always check the official text and latest version on lex.uz: laws change."),
    pdf: t3("PDF", "PDF", "PDF"),
    pdfAll: t3("Бу бўлимни PDF қилиш", "Этот раздел в PDF", "Save this part as PDF"),
    progress: t3("Ўзлаштириш", "Прогресс", "Progress"),
    tabs: [
      ["yol", "fa-route", t3("Йўл харитаси", "Маршрут", "Roadmap")],
      ["alifbo", "fa-bullhorn", t3("🆕 Янги алифбо", "🆕 Новый алфавит", "🆕 New alphabet")],
      ["darslik", "fa-book-open", t3("Дарслик", "Учебник", "Textbook")],
      ["amaliy", "fa-person-chalkboard", t3("Амалий дарслар", "Практические уроки", "Hands-on lessons")],
      ["kons", "fa-landmark", t3("Конституция", "Конституция", "Constitution")],
      ["lib", "fa-book-bookmark", t3("Қонунлар", "Законы", "Laws")],
      ["sud", "fa-gavel", t3("Экологик суд", "Экосуд", "Eco-court")],
      ["keys", "fa-magnifying-glass-chart", t3("Кейс", "Кейс", "Case study")],
      ["debat", "fa-comments", t3("Дебат", "Дебаты", "Debate")],
      ["detektiv", "fa-user-secret", t3("Эко-детектив", "Эко-детектив", "Eco-detective")],
      ["sim", "fa-industry", t3("Симулятор", "Симулятор", "Simulator")],
      ["xorij", "fa-satellite", t3("Хорижий технологиялар", "Зарубежные технологии", "Global tools")],
      ["test", "fa-brain", t3("Тест", "Тест", "Test")]
    ],
    check: t3("Текшириш", "Проверить", "Check"),
    next: t3("Кейингиси →", "Дальше →", "Next →"),
    again: t3("Қайтадан", "Заново", "Start again"),
    right: t3("✓ Тўғри!", "✓ Верно!", "✓ Correct!"),
    wrong: t3("✕ Унчалик эмас.", "✕ Не совсем.", "✕ Not quite."),
    saved: t3("Сақланди", "Сохранено", "Saved"),
    saveNote: t3("💾 Жавобни сақлаш", "💾 Сохранить ответ", "💾 Save answer"),
    model: t3("👀 Намунавий жавоб", "👀 Образец ответа", "👀 Model answer"),
    official: t3("Расмий манба", "Официальный источник", "Official source")
  };

  /* ========== 1. Йўл харитаси: teskari sinf (flipped classroom) режаси ========== */
  const ROAD = [
    { k: "darslik", ic: "📖", t: t3("Интерактив дарслик: қонунлар моддама-модда", "Интерактивный учебник: законы постатейно", "Interactive textbook: laws article by article"),
      before: t3("Уйда: навбатдаги дарсни ўқинг, атамалар ва моддалар шарҳини кўриб чиқинг, квизни ечинг.", "Дома: прочитайте очередной урок, термины и комментарий к статьям, решите квиз.", "At home: read the next lesson, its terms and article notes, and do the quiz."),
      during: t3("Аудиторияда: дарсдаги казус ва мунозара, ўқитувчи учун берилган интерактив усул бўйича.", "В аудитории: казус и дискуссия урока по предложенному интерактивному методу.", "In class: the lesson's case and debate, using the suggested interactive method.") },
    { k: "kons", ic: "📜", t: t3("Конституция: ҳуқуқ ва бурчлар", "Конституция: права и обязанности", "Constitution: rights and duties"),
      before: t3("Уйда: экологик моддаларни ўқинг ва «ким? нимага ҳақли? ким кафолатлайди?» жадвалини тўлдиринг.", "Дома: прочитайте экологические статьи и заполните таблицу «кто? на что вправе? кто гарантирует?».", "At home: read the environmental articles and fill in the table “who? what right? who guarantees it?”."),
      during: t3("Аудиторияда: «Ҳуқуқми ёки мажбуриятми?» саралаш ўйини ва жуфтликда муҳокама.", "В аудитории: игра «Право или обязанность?» и обсуждение в парах.", "In class: the “Right or duty?” sorting game and pair discussion.") },
    { k: "lib", ic: "📚", t: t3("Қонунлар кутубхонаси", "Библиотека законов", "Law library"),
      before: t3("Уйда: битта қонун карточкасини танлаб, асосий моддаларини 5 жумлада конспект қилинг.", "Дома: выберите карточку закона и законспектируйте ключевые статьи в 5 предложениях.", "At home: pick one law card and summarise its key articles in 5 sentences."),
      during: t3("Аудиторияда: «эксперт гуруҳлар» (Jigsaw) — ҳар гуруҳ ўз қонунини бошқаларга тушунтиради.", "В аудитории: «экспертные группы» (Jigsaw) — каждая группа объясняет свой закон другим.", "In class: Jigsaw expert groups — each group teaches its law to the others.") },
    { k: "sud", ic: "⚖️", t: t3("Экологик суд (moot court)", "Экосуд (moot court)", "Eco-court (moot court)"),
      before: t3("Уйда: иш материалини ўқинг ва ролингиз учун 3 та далил тайёрланг.", "Дома: прочитайте материалы дела и подготовьте 3 довода для своей роли.", "At home: read the case file and prepare 3 arguments for your role."),
      during: t3("Аудиторияда: суд мажлиси — ҳар бир тараф 3 дақиқа, суд қарорини асослаш.", "В аудитории: судебное заседание — каждой стороне 3 минуты, мотивировка решения.", "In class: the hearing — 3 minutes per side, then a reasoned judgment.") },
    { k: "keys", ic: "🔍", t: t3("Кейс-стади", "Кейс-стади", "Case study"),
      before: t3("Уйда: кейсни ўқиб, манфаатдор томонлар рўйхатини тузинг.", "Дома: прочитайте кейс и составьте список заинтересованных сторон.", "At home: read the case and list the stakeholders."),
      during: t3("Аудиторияда: Гарвард кейс-методи — муаммо, вариантлар, тавсия.", "В аудитории: гарвардский кейс-метод — проблема, варианты, рекомендация.", "In class: Harvard case method — problem, options, recommendation.") },
    { k: "debat", ic: "🗣", t: t3("Оксфорд дебати", "Оксфордские дебаты", "Oxford-style debate"),
      before: t3("Уйда: «тарафдор» ва «қарши» далилларни манбалари билан топинг.", "Дома: найдите доводы «за» и «против» с источниками.", "At home: find arguments for and against, with sources."),
      during: t3("Аудиторияда: жамоалар 2 дақиқадан чиқади, якунда овоз бериш.", "В аудитории: команды выступают по 2 минуты, в конце голосование.", "In class: teams speak for 2 minutes each, then a vote.") },
    { k: "detektiv", ic: "🕵️", t: t3("Эко-детектив", "Эко-детектив", "Eco-detective"),
      before: t3("Уйда: ЧЙК (чегаравий йўл қўйиладиган концентрация) тушунчасини такрорланг.", "Дома: повторите понятие ПДК (предельно допустимая концентрация).", "At home: revise the idea of maximum permissible concentration (MPC)."),
      during: t3("Аудиторияда: намуна олиш нуқталарини танлаб, ифлослантирувчини аниқлаш.", "В аудитории: выбрать точки отбора проб и найти загрязнителя.", "In class: choose sampling points and identify the polluter.") },
    { k: "sim", ic: "🏭", t: t3("Корхона симулятори", "Симулятор предприятия", "Enterprise simulator"),
      before: t3("Уйда: экологик экспертиза ва экологик назорат ҳақидаги карточкаларни ўқинг.", "Дома: прочитайте карточки об экологической экспертизе и контроле.", "At home: read the cards on environmental expertise and control."),
      during: t3("Аудиторияда: гуруҳ корхона директори сифатида қарор қабул қилади ва натижани ҳимоя қилади.", "В аудитории: группа как директор предприятия принимает решения и защищает результат.", "In class: the group acts as the plant director, decides and defends the result.") },
    { k: "xorij", ic: "🛰️", t: t3("Сунъий йўлдош маълумотлари", "Спутниковые данные", "Satellite data"),
      before: t3("Уйда: NASA Worldview ёки Global Forest Watch да битта ҳудудни топинг.", "Дома: найдите один район в NASA Worldview или Global Forest Watch.", "At home: find one area in NASA Worldview or Global Forest Watch."),
      during: t3("Аудиторияда: «олдин/кейин» расмлари асосида ҳуқуқий хулоса ёзиш.", "В аудитории: правовой вывод по снимкам «до/после».", "In class: write a legal conclusion from before/after images.") },
    { k: "test", ic: "🧠", t: t3("Якуний тест", "Итоговый тест", "Final test"),
      before: t3("Уйда: «Такрорлаш хонаси»да калит тушунчаларни такрорланг.", "Дома: повторите ключевые понятия в «Комнате повторения».", "At home: revise key terms in the Review room."),
      during: t3("Аудиторияда: тест ва хатолар устида ишлаш.", "В аудитории: тест и работа над ошибками.", "In class: the test and a review of mistakes.") }
  ];
  function roadView() {
    const n = ROAD.filter((r) => st.done[r.k]).length;
    const pct = Math.round((n / ROAD.length) * 100);
    return `<div class="qn-card qn-box pdf-skip">
        <h3>🆕 ${H(t3("Қонунчилик янгилиги: ЎРҚ-1184 (21.10.2026)", "Новости законодательства: ЗРУ-1184 (21.10.2026)", "Legislation news: ZRU-1184 (21.10.2026)"))}</h3>
        <p>${H(t3("Ўзбек лотин алифбоси 28 ҳарф ва 1 тутуқ белгисидан иборат бўлади: Oʻ → Ö, Gʻ → Ğ, Sh → Ş, Ch → Ç. Қонун расмий эълондан 6 ой ўтгач кучга киради.", "Узбекский латинский алфавит будет состоять из 28 букв и 1 знака тутук: Oʻ → Ö, Gʻ → Ğ, Sh → Ş, Ch → Ç. Закон вступит в силу через 6 месяцев после опубликования.", "The Uzbek Latin alphabet will have 28 letters and 1 tutuq sign: Oʻ → Ö, Gʻ → Ğ, Sh → Ş, Ch → Ç. The law takes effect 6 months after publication."))}</p>
        <div class="qn-acts"><button class="btn btn-primary btn-sm" data-go="alifbo">${H(t3("Батафсил ва конвертер →", "Подробнее и конвертер →", "Details and converter →"))}</button></div>
      </div>
      <div class="qn-card">
        <h3>🧭 ${H(t3("Ўқиш йўли: «тескари синф» (Flipped Classroom)", "Маршрут: «перевёрнутый класс» (Flipped Classroom)", "Learning path: Flipped Classroom"))}</h3>
        <p class="muted">${H(t3("Назарияни уйда ўқийсиз, аудиторияда эса уни амалда ишлатасиз. Ҳар бир қадам учун «уйда» ва «аудиторияда» топшириғи бор. Ўқитувчи шу режани дарс жадвали сифатида ишлатиши мумкин.",
          "Теорию читаете дома, а в аудитории применяете её на практике. Для каждого шага есть задание «дома» и «в аудитории». Преподаватель может использовать этот план как расписание занятий.",
          "You read the theory at home and apply it in class. Each step has an at-home and an in-class task. A teacher can use this plan as the course schedule."))}</p>
        <div class="qn-prog"><span class="small">${H(TX.progress)}: <b>${n}/${ROAD.length}</b></span><div class="qn-meter"><i style="width:${pct}%;background:var(--btn-grad, var(--primary))"></i></div></div>
      </div>
      <div class="qn-grid">${ROAD.map((r, i) => `<div class="qn-card">
        <h3>${i + 1}. ${r.ic} ${H(r.t)} ${st.done[r.k] ? `<span class="qn-tag">✓</span>` : ""}</h3>
        <p><b>${H(t3("🏠 Уйда:", "🏠 Дома:", "🏠 At home:"))}</b> ${H(r.before)}</p>
        <p><b>${H(t3("🏫 Аудиторияда:", "🏫 В аудитории:", "🏫 In class:"))}</b> ${H(r.during)}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-go="${r.k}">${H(t3("Очиш →", "Открыть →", "Open →"))}</button></div>
      </div>`).join("")}</div>`;
  }

  /* ========== 2. Конституция ========== */
  const SORT_RD = [
    [t3("Қулай атроф-муҳитга эга бўлиш", "Иметь благоприятную окружающую среду", "To have a favourable environment"), "r"],
    [t3("Атроф-муҳит ҳолати ҳақида ишончли ахборот олиш", "Получать достоверную информацию о состоянии среды", "To receive reliable information about the state of the environment"), "r"],
    [t3("Атроф табиий муҳитга эҳтиёткорона муносабатда бўлиш", "Бережно относиться к окружающей природной среде", "To treat the natural environment with care"), "d"],
    [t3("Мулкдан атроф-муҳитга зарар етказмай фойдаланиш", "Пользоваться собственностью, не причиняя вреда среде", "To use property without harming the environment"), "d"],
    [t3("Шаҳарсозлик ҳужжатлари лойиҳаларини жамоатчилик муҳокамасида кўриб чиқиш", "Обсуждать проекты градостроительных документов публично", "To take part in public discussion of urban planning drafts"), "r"],
    [t3("Табиий ресурслардан оқилона фойдаланиш", "Рационально использовать природные ресурсы", "To use natural resources rationally"), "d"]
  ];
  function consView() {
    const d = D();
    return `<div class="qn-card qn-box">
        <h3>📜 ${H(t3("Конституция — экологик ҳуқуқнинг пойдевори", "Конституция — фундамент экологического права", "The Constitution — the foundation of environmental law"))}</h3>
        <p>${H(t3("2023 йил 30 апрелдаги референдумда қабул қилинган янги таҳрирдаги Конституция экологик нормаларни кенгайтирди: ҳар кимнинг қулай атроф-муҳитга бўлган ҳуқуқи, давлатнинг Оролбўйини тиклаш мажбурияти, мулкдан атроф-муҳитга зарар етказмай фойдаланиш ва бошқалар. Ҳар бир моддани «ким? нимага ҳақли ёки нимага мажбур? ким кафолатлайди?» деган саволлар билан ўқинг.",
          "Новая редакция Конституции, принятая на референдуме 30 апреля 2023 года, расширила экологические нормы: право каждого на благоприятную среду, обязанность государства восстанавливать Приаралье, использование собственности без вреда среде и другое. Читайте каждую статью через вопросы «кто? на что вправе или что обязан? кто гарантирует?».",
          "The new Constitution adopted by referendum on 30 April 2023 widened the environmental norms: everyone's right to a favourable environment, the state's duty to restore the Aral Sea region, using property without harming the environment and more. Read each article through the questions “who? what right or duty? who guarantees it?”."))}</p>
        <p class="small muted">${H(TX.verify)}</p>
      </div>
      ${(d.CONST || []).map((a, i) => artCard(a, i)).join("")}
      ${d.CONST_OLD && d.CONST_OLD.length ? `<div class="qn-card">
        <h3>🕰 ${H(t3("Таққосланг: 1992 йилги таҳрир", "Сравните: редакция 1992 года", "Compare: the 1992 version"))}</h3>
        <ul>${d.CONST_OLD.map((o) => `<li><b>${H(o.n)}</b> — ${H(o.t)}</li>`).join("")}</ul>
        <p class="small muted">${H(t3("Савол: янги таҳрирда нималар қўшилди ва бу фуқаро учун нимани ўзгартиради?", "Вопрос: что добавлено в новой редакции и что это меняет для гражданина?", "Question: what was added in the new version and what does it change for a citizen?"))}</p>
      </div>` : ""}
      <div class="qn-card" data-game="rd">
        <h3>🎯 ${H(t3("Ўйин: ҳуқуқми ёки мажбуриятми?", "Игра: право или обязанность?", "Game: right or duty?"))}</h3>
        <p class="small muted">${H(t3("Ҳар бир жумла Конституциядаги ҳуқуқми ёки мажбуриятми — танланг ва текширинг.", "Определите, право это по Конституции или обязанность, и проверьте.", "Decide whether each statement is a constitutional right or a duty, then check."))}</p>
        <ol class="qn-sort">${SORT_RD.map(([t], i) => `<li data-i="${i}"><span>${H(t)}</span><div class="seg" role="group"><button type="button" data-v="r">${H(t3("Ҳуқуқ", "Право", "Right"))}</button><button type="button" data-v="d">${H(t3("Мажбурият", "Обязанность", "Duty"))}</button></div></li>`).join("")}</ol>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="rd-check">${H(TX.check)}</button></div>
        <p class="small" data-out="rd" aria-live="polite"></p>
      </div>`;
  }
  function artCard(a, i) {
    return `<article class="qn-card" id="qn-art-${i}">
      <h3>${H(a.n)} ${a.tag ? `<span class="qn-tag">${H(a.tag)}</span>` : ""}</h3>
      <div class="qn-quote">${H(a.text)}</div>
      ${a.simple ? `<h4>💬 ${H(t3("Содда тилда", "Простыми словами", "In plain words"))}</h4><p>${H(a.simple)}</p>` : ""}
      ${a.who ? `<h4>👥 ${H(t3("Ким учун: ҳуқуқ / мажбурият", "Для кого: право / обязанность", "Who: right / duty"))}</h4><p>${H(a.who)}</p>` : ""}
      ${a.ex ? `<h4>🏙 ${H(t3("Ҳаётий мисол", "Пример из жизни", "Real-life example"))}</h4><p>${H(a.ex)}</p>` : ""}
      ${a.q ? `<h4>❓ ${H(t3("Муҳокама учун савол", "Вопрос для обсуждения", "Discussion question"))}</h4><p>${H(a.q)}</p>` : ""}
      <p class="qn-src">${H(TX.official)}: ${ext(a.url || "https://lex.uz/docs/6445145")}</p>
      <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-pdf="#qn-art-${i}"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdf)}</button></div>
    </article>`;
  }

  /* ========== 3. Қонунлар кутубхонаси ========== */
  let libTopic = "all", libQ = "";
  function libView() {
    const d = D();
    const norm = (s) => String(s).toLowerCase();
    const list = (d.LAWS || []).map((l, i) => [l, i]).filter(([l]) => (libTopic === "all" || (l.topics || []).includes(libTopic)) &&
      (!libQ || norm(L(l.title) + " " + L(l.short) + " " + L(l.no || "")).includes(norm(libQ)) || (EL() && EL().matches && EL().matches(L(l.title), libQ))));
    return `<div class="qn-card">
        <h3>📚 ${H(t3("Экологик қонунчилик кутубхонаси", "Библиотека экологического законодательства", "Environmental legislation library"))}</h3>
        <p class="muted">${H(t3("Ҳар бир карточкада: ҳужжат тури, қабул қилинган сана ва рақам, амалдаги ҳолат, муҳим моддалар, кимга қандай ҳуқуқ ёки мажбурият, амалий мисол, муҳокама саволи ва расмий ҳавола.",
          "В каждой карточке: вид документа, дата и номер принятия, статус, ключевые статьи, чьи права и обязанности, практический пример, вопрос для обсуждения и официальная ссылка.",
          "Each card shows: document type, adoption date and number, current status, key articles, whose rights or duties, a practical example, a discussion question and the official link."))}</p>
        <p class="small muted">${H(TX.asof)}: <b>${esc(d.ASOF || "")}</b>. ${H(TX.verify)}</p>
        <input type="search" class="qn-ta" style="min-height:44px" data-lib-q value="${esc(libQ)}" placeholder="${H(t3("Қонун қидириш…", "Поиск закона…", "Search laws…"))}" aria-label="${H(t3("Қонун қидириш", "Поиск закона", "Search laws"))}">
        <div class="filters qn-chips pdf-skip" style="margin:10px 0 0">${[["all", t3("Барчаси", "Все", "All")], ...(d.TOPICS || [])].map(([k, t]) => `<button type="button" class="chip ${k === libTopic ? "active" : ""}" data-topic="${k}">${H(t)}</button>`).join("")}</div>
      </div>
      <div class="qn-grid">${list.length ? list.map(([l, i]) => lawCard(l, i)).join("") : `<p class="muted">${H(t3("Ҳеч нарса топилмади.", "Ничего не найдено.", "Nothing found."))}</p>`}</div>`;
  }
  const noL = (n) => { const v = L(n); return lang() === "ru" ? v.replace(/ЎРҚ/g, "ЗРУ") : lang() === "en" ? v.replace(/ЎРҚ/g, "ZRU") : v; };
  function lawCard(l, i) {
    const status = l.status === "old" ? "old" : l.status === "check" ? "warn" : "";
    return `<article class="qn-card" id="qn-law-${i}">
      <h3>${l.icon || "📘"} ${H(l.title)}</h3>
      <div class="qn-meta"><span class="qn-tag">${H(l.kind)}</span>${l.date ? `<span class="qn-tag">${esc(l.date)}${l.no ? " · " + esc(noL(l.no)) : ""}</span>` : ""}<span class="qn-tag ${status}">${H(l.state)}</span></div>
      ${l.short ? `<p>${H(l.short)}</p>` : ""}
      ${l.arts && l.arts.length ? `<h4>📌 ${H(t3("Муҳим моддалар", "Ключевые статьи", "Key articles"))}</h4><ul>${l.arts.map(([n, t]) => `<li><b>${H(n)}</b> — ${H(t)}</li>`).join("")}</ul>` : ""}
      ${l.who ? `<h4>👥 ${H(t3("Кимга қандай ҳуқуқ ёки мажбурият", "Чьи права и обязанности", "Whose rights and duties"))}</h4><p>${H(l.who)}</p>` : ""}
      ${l.ex ? `<h4>🏙 ${H(t3("Амалий мисол", "Практический пример", "Practical example"))}</h4><p>${H(l.ex)}</p>` : ""}
      ${l.q ? `<h4>❓ ${H(t3("Муҳокама саволи", "Вопрос для обсуждения", "Discussion question"))}</h4><p>${H(l.q)}</p>` : ""}
      ${l.url ? `<p class="qn-src">${H(TX.official)}: ${ext(l.url)}</p>` : ""}
      <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-pdf="#qn-law-${i}"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdf)}</button></div>
    </article>`;
  }

  /* ========== 4. Экологик суд (moot court) ========== */
  const ROLES = [
    ["judge", "👩‍⚖️", t3("Судья", "Судья", "Judge")],
    ["insp", "🧑‍🔬", t3("Эколог-инспектор", "Эколог-инспектор", "Environmental inspector")],
    ["firm", "🏭", t3("Корхона вакили", "Представитель предприятия", "Company representative")],
    ["pub", "🙋", t3("Жамоатчилик вакили", "Представитель общественности", "Community representative")],
    ["exp", "🧪", t3("Эксперт", "Эксперт", "Expert")]
  ];
  const CASES = [
    { id: "suv", icon: "💧",
      t: t3("Иш №1. Ариққа тозаланмаган оқова сув", "Дело №1. Неочищенные стоки в канал", "Case 1. Untreated wastewater in a canal"),
      facts: t3("«Сутли водий» МЧЖ сут заводи (тўқима корхона) тунда оқова сувни тозаламасдан суғориш ариғига ташлайди. Пастки оқимдаги маҳалла аҳолиси сувнинг ҳиди ва балиқларнинг нобуд бўлганидан шикоят қилди. Корхона: «сув табиий ифлосланган, бизнинг айбимиз йўқ», дейди.",
        "Молочный завод ООО «Сутли водий» (вымышленное предприятие) ночью сбрасывает неочищенные стоки в оросительный канал. Жители махалли ниже по течению жалуются на запах воды и гибель рыбы. Предприятие: «вода загрязнена естественно, мы не виноваты».",
        "A dairy plant, “Sutli Vodiy” LLC (a fictional company), discharges untreated wastewater into an irrigation canal at night. Residents downstream complain about the smell and dead fish. The company says: “the water is naturally polluted, it's not our fault”."),
      steps: [
        { q: t3("Қайси далил энг кучли?", "Какое доказательство самое сильное?", "Which piece of evidence is strongest?"),
          o: [t3("Ижтимоий тармоқдаги ўлик балиқлар видеоси", "Видео с мёртвой рыбой из соцсетей", "A social media video of dead fish"),
            t3("Чиқиш жойидан юқори ва пастдан олинган сув намуналарининг аккредитланган лаборатория хулосаси (ЧЙК билан таққослаб) ва оқова сув ташлаш рухсатномаси текшируви", "Заключение аккредитованной лаборатории по пробам выше и ниже выпуска (в сравнении с ПДК) и проверка разрешения на сброс", "An accredited lab report on samples above and below the outlet (compared to MPCs) plus a check of the discharge permit"),
            t3("Қўшниларнинг «ҳамма билади» деган гаплари", "Слова соседей «все знают»", "Neighbours saying “everyone knows”")], c: 1,
          why: t3("Суд ўлчанган ва такрорланадиган далилга таянади: чиқиш жойидан юқори ва пастдаги фарқ ифлосланиш манбасини кўрсатади. Видео ва гувоҳлар фақат қўшимча далил.", "Суд опирается на измеренные и воспроизводимые доказательства: разница выше и ниже выпуска показывает источник. Видео и свидетели — лишь дополнительные доказательства.", "Courts rely on measured, repeatable evidence: the difference above and below the outlet shows the source. Videos and witnesses are only supporting evidence.") },
        { q: t3("Қайси нормалар асосий?", "Какие нормы основные?", "Which norms apply first?"),
          o: [t3("Фақат Ер кодекси", "Только Земельный кодекс", "Only the Land Code"),
            t3("Конституциянинг 49-моддаси (қулай атроф-муҳит ҳуқуқи), Сув кодекси ва «Табиатни муҳофаза қилиш тўғрисида»ги қонун", "Статья 49 Конституции (право на благоприятную среду), Водный кодекс и закон «Об охране природы»", "Article 49 of the Constitution (right to a favourable environment), the Water Code and the Nature Protection Law"),
            t3("Фақат Солиқ кодекси", "Только Налоговый кодекс", "Only the Tax Code")], c: 1,
          why: t3("Сув объектларини ифлослантириш Сув кодекси (2025) ва табиатни муҳофаза қилиш тўғрисидаги қонунда тақиқланган, МЖтК 72-моддаси бўйича жарима солинади; Конституция ҳар кимнинг қулай атроф-муҳитга бўлган ҳуқуқини кафолатлайди.", "Загрязнение водных объектов запрещено Водным кодексом (2025) и законом об охране природы, штраф — по ст. 72 КоАО; Конституция гарантирует право на благоприятную среду.", "Polluting water bodies is banned by the Water Code (2025) and the Nature Protection Law and fined under Admin Code Art. 72; the Constitution guarantees the right to a favourable environment.") },
        { q: t3("Қандай жавобгарлик тўғри?", "Какая ответственность правильна?", "Which liability fits?"),
          o: [t3("Мансабдор шахсга маъмурий жарима ва етказилган зарарни қоплаш; оғир оқибат исботланса — жиноий жавобгарлик масаласи", "Административный штраф должностному лицу и возмещение ущерба; при доказанных тяжких последствиях — вопрос уголовной ответственности", "An administrative fine for the official and compensation for the damage; if serious consequences are proven, criminal liability is considered"),
            t3("Ҳеч қандай: балиқлар ўзи нобуд бўлган", "Никакой: рыба погибла сама", "None: the fish died on their own"),
            t3("Фақат огоҳлантириш", "Только предупреждение", "Only a warning")], c: 0,
          why: t3("Экологик ҳуқуқбузарлик учун маъмурий жавобгарлик (МЖтК) билан бирга табиатга етказилган зарар алоҳида қопланади. Инсон соғлиғига зарар ёки оммавий нобуд бўлиш каби оғир оқибатлар Жиноят кодексининг экология соҳасидаги жиноятлар бобида кўрилади.", "Наряду с административной ответственностью (КоАО) вред природе возмещается отдельно. Тяжкие последствия (вред здоровью, массовая гибель) рассматриваются по главе УК об экологических преступлениях.", "Alongside administrative liability (Administrative Code), damage to nature is compensated separately. Serious consequences (harm to health, mass deaths) fall under the Criminal Code chapter on environmental crimes.") },
        { q: t3("Суд қандай чора кўради?", "Какие меры примет суд?", "What remedy should the court order?"),
          o: [t3("Корхонани абадий ёпиш", "Закрыть предприятие навсегда", "Close the plant forever"),
            t3("Тозалаш иншооти қурилгунча ташламани тўхтатиш, зарарни қоплаш, мунтазам мониторинг ва натижани аҳолига очиқ эълон қилиш", "Прекратить сброс до постройки очистных, возместить ущерб, регулярный мониторинг и открытая публикация результатов", "Stop the discharge until a treatment plant is built, compensate the damage, monitor regularly and publish the results"),
            t3("Аҳолига бошқа ариқдан фойдаланишни тавсия қилиш", "Посоветовать жителям пользоваться другим каналом", "Tell residents to use another canal")], c: 1,
          why: t3("Мутаносиблик тамойили: чора қонунбузарликни тўхтатиши ва зарарни тиклаши керак. Натижаларни очиқ эълон қилиш — экологик ахборот олиш ҳуқуқини амалга оширади.", "Принцип соразмерности: мера должна прекратить нарушение и восстановить ущерб. Открытая публикация реализует право на экологическую информацию.", "Proportionality: the remedy must stop the violation and restore the damage. Publishing the results gives effect to the right to environmental information.") }
      ] },
    { id: "daraxt", icon: "🌳",
      t: t3("Иш №2. Маҳалладаги дарахтлар кесилди", "Дело №2. Вырубка деревьев в махалле", "Case 2. Trees felled in a neighbourhood"),
      facts: t3("Қурилиш компанияси турар жой қуриш учун маҳалла ҳовлисидаги 40 туп чинор ва тутни рухсатсиз кесди. Аҳоли буни телефонга олиб, туман экология бўлимига мурожаат қилди. Компания: «ер бизга ажратилган, дарахт ҳам бизники», дейди.",
        "Строительная компания без разрешения вырубила 40 платанов и тутовников во дворе махалли ради жилого дома. Жители сняли это на телефон и обратились в районный отдел экологии. Компания: «земля выделена нам, деревья тоже наши».",
        "A construction company felled 40 plane and mulberry trees in a neighbourhood yard without a permit to build housing. Residents filmed it and complained to the district ecology office. The company says: “the land was allocated to us, so the trees are ours too”."),
      steps: [
        { q: t3("Компаниянинг даъвоси тўғрими?", "Прав ли довод компании?", "Is the company's claim right?"),
          o: [t3("Ҳа, ер берилса, дарахтни хоҳлаганча кесиш мумкин", "Да, если земля выделена, деревья можно рубить как угодно", "Yes, once land is allocated trees can be cut freely"),
            t3("Йўқ: ер ажратилиши дарахт кесишга рухсат эмас; кесиш алоҳида рухсат ва белгиланган тартибда компенсация тўлови билан бўлади", "Нет: выделение земли не равно разрешению на вырубку; вырубка требует отдельного разрешения и компенсационной оплаты в установленном порядке", "No: a land allocation is not a felling permit; felling needs a separate permit and compensation paid under the established procedure")], c: 1,
          why: t3("Ўсимлик дунёсини муҳофаза қилиш тўғрисидаги қонунга кўра дарахт ва буталарни кесиш белгиланган тартибда рухсат асосида амалга оширилади; Конституциянинг 66-моддасига кўра мулкдан фойдаланиш атроф-муҳитга зарар етказмаслиги керак.", "По закону об охране растительного мира рубка деревьев производится по разрешению в установленном порядке; по статье 66 Конституции пользование собственностью не должно вредить среде.", "Under the plant life protection law, felling trees requires a permit under the established procedure; under Article 66 of the Constitution, using property must not harm the environment.") },
        { q: t3("Аҳоли қандай далил тўплаши керак?", "Какие доказательства собрать жителям?", "What evidence should residents collect?"),
          o: [t3("Сана ва жойи кўринган фото/видео, қолган тўнкалар сони ва диаметри, гувоҳлар, рухсатнома бор-йўқлиги бўйича расмий жавоб", "Фото/видео с датой и местом, число и диаметр пней, свидетели, официальный ответ о наличии разрешения", "Photos/videos with date and place, the number and diameter of stumps, witnesses, an official reply on whether a permit exists"),
            t3("Фақат ижтимоий тармоқдаги пост", "Только пост в соцсетях", "Only a social media post")], c: 0,
          why: t3("Тўнка диаметри компенсация ҳисоби учун асос бўлади; расмий жавоб рухсатнома йўқлигини исботлайди.", "Диаметр пней — основа расчёта компенсации; официальный ответ доказывает отсутствие разрешения.", "Stump diameter is the basis for calculating compensation; an official reply proves there was no permit.") },
        { q: t3("Адолатли қарор қайси?", "Какое решение справедливо?", "Which decision is fair?"),
          o: [t3("Маъмурий жарима, табиатга етказилган зарарни қоплаш ва ҳар бир кесилган дарахт ўрнига бир неча кўчат экиш ва парваришлаш мажбурияти", "Административный штраф, возмещение вреда природе и обязанность посадить и выходить несколько саженцев вместо каждого срубленного дерева", "An administrative fine, compensation for damage to nature and a duty to plant and care for several saplings for each felled tree"),
            t3("Аҳоли янги дарахт экиши керак", "Жители сами должны посадить новые деревья", "Residents should plant new trees themselves")], c: 0,
          why: t3("«Ифлослантирувчи тўлайди» тамойили: зарар етказган тараф уни қоплайди ва тиклайди.", "Принцип «загрязнитель платит»: кто причинил вред, тот его возмещает и восстанавливает.", "The polluter-pays principle: whoever caused the damage compensates and restores it.") }
      ] },
    { id: "ekspertiza", icon: "🏗",
      t: t3("Иш №3. Экспертизасиз қурилиш", "Дело №3. Стройка без экспертизы", "Case 3. Building without an environmental review"),
      facts: t3("Туман четида цемент заводи қурилиши бошланди. Аҳоли лойиҳа муҳокама қилинмаганини, давлат экологик экспертизаси хулосаси йўқлигини айтмоқда. Инвестор: «иш ўрни яратамиз, экспертиза кейин ҳам бўлаверади», дейди.",
        "На окраине района началось строительство цементного завода. Жители говорят, что проект не обсуждался и заключения государственной экологической экспертизы нет. Инвестор: «создадим рабочие места, экспертиза может быть и потом».",
        "Construction of a cement plant has begun at the edge of a district. Residents say the project was never discussed and there is no state environmental review. The investor says: “we're creating jobs, the review can come later”."),
      steps: [
        { q: t3("Экспертиза «кейин» бўлиши мумкинми?", "Может ли экспертиза быть «потом»?", "Can the review happen “later”?"),
          o: [t3("Ҳа, асосийси — иш ўрни", "Да, главное — рабочие места", "Yes, jobs come first"),
            t3("Йўқ: давлат экологик экспертизасининг ижобий хулосасисиз лойиҳани молиялаштириш ва амалга ошириш тақиқланади", "Нет: без положительного заключения государственной экологической экспертизы финансирование и реализация проекта запрещены", "No: without a positive state environmental review the project may not be financed or carried out")], c: 1,
          why: t3("«Экологик экспертиза, атроф-муҳитга таъсирни баҳолаш ва стратегик экологик баҳолаш тўғрисида»ги қонун (ЎРҚ-1036, 2025) давлат экспертизасини мажбурий қилади (11-модда), буюртмачи олдиндан жамоатчилик тингловини ўтказади (17-модда), ижобий хулосасиз лойиҳани молиялаштириш мумкин эмас (22-модда). ОВОС тартиби ВМнинг 11.05.2026 йилдаги 234-сон қарори билан белгиланган.", "Закон «Об экологической экспертизе, ОВОС и СЭО» (ЗРУ-1036, 2025) делает госэкспертизу обязательной (ст. 11), заказчик заранее проводит общественные слушания (ст. 17), без положительного заключения финансирование запрещено (ст. 22). Порядок ОВОС — постановление КМ №234 от 11.05.2026.", "The law on environmental review, EIA and SEA (ZRU-1036, 2025) makes the state review mandatory (Art. 11), requires prior public hearings (Art. 17) and bans financing without a positive opinion (Art. 22). The EIA procedure is set by Cabinet Resolution No. 234 of 11.05.2026.") },
        { q: t3("Аҳолининг қайси ҳуқуқи бузилган?", "Какое право жителей нарушено?", "Which right of the residents was violated?"),
          o: [t3("Ахборот олиш ва қарор қабул қилишда иштирок этиш (жамоатчилик муҳокамаси, жамоатчилик экологик экспертизаси)", "Право на информацию и участие в принятии решений (общественное обсуждение, общественная экологическая экспертиза)", "The right to information and to take part in decisions (public hearings, public environmental review)"),
            t3("Ҳеч қандай ҳуқуқ бузилмаган", "Никакое право не нарушено", "No right was violated")], c: 0,
          why: t3("Конституциянинг 49-моддаси ишончли экологик ахборот олиш ҳуқуқини ва шаҳарсозликда жамоатчилик назоратини кафолатлайди; қонун жамоатчилик экологик экспертизасини ҳам назарда тутади.", "Статья 49 Конституции гарантирует право на достоверную экологическую информацию и общественный контроль в градостроительстве; закон предусматривает и общественную экологическую экспертизу.", "Article 49 of the Constitution guarantees reliable environmental information and public oversight in urban planning; the law also provides for a public environmental review.") },
        { q: t3("Тўғри қарор қайси?", "Какое решение верное?", "Which decision is right?"),
          o: [t3("Қурилишни экспертиза ижобий хулосасигача тўхтатиш, жамоатчилик муҳокамасини ўтказиш, лойиҳада чанг ушлагич ва яшил ҳимоя минтақасини назарда тутиш", "Остановить стройку до положительного заключения экспертизы, провести общественное обсуждение, предусмотреть пылеуловители и санитарно-защитную зелёную зону", "Halt construction until a positive review, hold a public hearing, require dust filters and a green buffer zone"),
            t3("Қурилишни давом эттириб, кейин жарима тўлаш", "Продолжать стройку и потом заплатить штраф", "Keep building and pay a fine later")], c: 0,
          why: t3("Эҳтиёткорлик тамойили: зарарни олдини олиш уни кейин тузатишдан арзон ва самаралироқ.", "Принцип предосторожности: предотвратить вред дешевле и эффективнее, чем исправлять.", "The precautionary principle: preventing harm is cheaper and more effective than fixing it.") }
      ] }
  ];
  let sudCase = null, sudStep = 0, sudRole = "judge", sudPts = 0, sudPick = null;
  function sudView() {
    if (!sudCase) {
      return `<div class="qn-card">
          <h3>⚖️ ${H(t3("Экологик суд — moot court", "Экосуд — moot court", "Eco-court — moot court"))}</h3>
          <p>${H(t3("Moot court — АҚШ ва Европа ҳуқуқ мактабларида анъанавий усул: талабалар ўйлаб топилган, лекин ҳаётий иш бўйича суд мажлисини ўтказади. Ролни танланг, иш материалини ўқинг ва ҳар бир босқичда қонунга асосланган қарор қабул қилинг. Гуруҳда ўйнаганда ҳар бир рол 3 дақиқа сўзга чиқади.",
            "Moot court — традиционный метод юридических школ США и Европы: студенты проводят заседание по вымышленному, но жизненному делу. Выберите роль, изучите материалы и на каждом этапе примите решение, основанное на законе. В группе каждая роль выступает 3 минуты.",
            "Moot court is a classic method in US and European law schools: students hold a hearing on a fictional but realistic case. Choose a role, study the file and make a law-based decision at each stage. In a group, each role speaks for 3 minutes."))}</p>
          <h4>${H(t3("Ролингиз", "Ваша роль", "Your role"))}</h4>
          <div class="qn-roles pdf-skip">${ROLES.map(([k, i, t]) => `<button type="button" class="chip ${k === sudRole ? "active" : ""}" data-role="${k}">${i} ${H(t)}</button>`).join("")}</div>
          <p class="small muted">${H(roleHint(sudRole))}</p>
        </div>
        <div class="qn-grid">${CASES.map((c) => `<div class="qn-card">
          <h3>${c.icon} ${H(c.t)} ${st.best["sud:" + c.id] != null ? `<span class="qn-tag">${st.best["sud:" + c.id]}/${c.steps.length}</span>` : ""}</h3>
          <p>${H(c.facts)}</p>
          <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-case="${c.id}">${H(t3("Мажлисни бошлаш →", "Начать заседание →", "Start the hearing →"))}</button></div>
        </div>`).join("")}</div>`;
    }
    const c = CASES.find((x) => x.id === sudCase);
    const steps = `<ol class="qn-steps">${c.steps.map((_, i) => `<li class="${i < sudStep ? "ok" : i === sudStep ? "on" : ""}">${i + 1}</li>`).join("")}</ol>`;
    if (sudStep >= c.steps.length) {
      return `<div class="qn-card">
        <h3>${c.icon} ${H(c.t)}</h3>${steps}
        <p class="qn-score">${sudPts} / ${c.steps.length}</p>
        <h4>📝 ${H(t3("Суд қарорини ёзинг (резолютив қисм)", "Напишите решение суда (резолютивная часть)", "Write the judgment (operative part)"))}</h4>
        <p class="small muted">${H(t3("Тузилма: 1) аниқланган ҳолатлар; 2) қўлланган нормалар; 3) қарор ва муддатлар.", "Структура: 1) установленные обстоятельства; 2) применённые нормы; 3) решение и сроки.", "Structure: 1) facts established; 2) norms applied; 3) the decision and deadlines."))}</p>
        <textarea class="qn-ta" data-note="sud:${c.id}" rows="5">${esc(st.notes["sud:" + c.id] || "")}</textarea>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="note" data-k="sud:${c.id}">${H(TX.saveNote)}</button><button class="btn btn-ghost btn-sm" data-act="sud-back">${H(t3("← Ишлар рўйхати", "← Список дел", "← All cases"))}</button></div>
      </div>`;
    }
    const s = c.steps[sudStep];
    return `<div class="qn-card">
      <h3>${c.icon} ${H(c.t)}</h3>${steps}
      <p class="small muted">${H(c.facts)}</p>
      <p><b>${H(ROLES.find((r) => r[0] === sudRole)[2])}:</b> ${H(s.q)}</p>
      <div class="qn-opts">${s.o.map((o, i) => `<button type="button" class="sg-opt ${sudPick != null ? (i === s.c ? "ok" : i === sudPick ? "bad" : "") : ""}" data-sud="${i}" ${sudPick != null ? "disabled" : ""}>${H(o)}</button>`).join("")}</div>
      ${sudPick != null ? `<p class="qn-fb ${sudPick === s.c ? "" : "bad"}">${H(sudPick === s.c ? TX.right : TX.wrong)} ${H(s.why)}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="sud-next">${H(TX.next)}</button></div>` : ""}
    </div>`;
  }
  function roleHint(r) {
    return {
      judge: t3("Судья: далилларни баҳолайди ва қонунга асосланган қарор чиқаради.", "Судья: оценивает доказательства и выносит решение на основе закона.", "Judge: weighs the evidence and gives a law-based decision."),
      insp: t3("Инспектор: намуна олиш, далолатнома тузиш ва қонунбузарликни исботлаш.", "Инспектор: отбор проб, составление акта и доказывание нарушения.", "Inspector: takes samples, writes the report and proves the violation."),
      firm: t3("Корхона вакили: ҳимоя қилади, лекин қонунга зид даъволар суд ишончини йўқотади.", "Представитель предприятия: защищает, но доводы против закона подрывают доверие суда.", "Company representative: defends, but arguments against the law cost credibility."),
      pub: t3("Жамоатчилик вакили: аҳолининг экологик ахборот ва қулай муҳит ҳуқуқларини ҳимоя қилади.", "Представитель общественности: защищает права жителей на информацию и благоприятную среду.", "Community representative: defends residents' rights to information and a favourable environment."),
      exp: t3("Эксперт: ўлчов натижалари, ЧЙК ва зарар миқдори ҳақида холис хулоса беради.", "Эксперт: даёт объективное заключение об измерениях, ПДК и размере ущерба.", "Expert: gives an impartial opinion on measurements, MPCs and the size of the damage.")
    }[r];
  }

  /* ========== 5. Кейс-стади (Гарвард кейс-методи) ========== */
  const KEYS = [
    { id: "orol", icon: "🏜",
      t: t3("Кейс: Оролбўйида чанг бўронлари ва аҳоли саломатлиги", "Кейс: пыльные бури в Приаралье и здоровье населения", "Case: dust storms in the Aral Sea region and public health"),
      text: t3("Орол денгизининг қуриган тубидан кўтарилаётган туз ва чанг бўронлари Қорақалпоғистон ва Хоразм аҳолиси саломатлигига таъсир қилмоқда. Ҳокимликка уч вариант таклиф қилинди: А) қуриган тубда саксовул ўрмонлари барпо қилишни кенгайтириш; Б) чанг мониторинги станцияларини кўпайтириш ва аҳолини огоҳлантириш тизимини яратиш; В) коллектор-дренаж сувларини тозалаб, кичик сув ҳавзаларини тиклаш. Бюджет фақат иккитасига етади.",
        "Солевые и пыльные бури с осушенного дна Аральского моря влияют на здоровье жителей Каракалпакстана и Хорезма. Хокимияту предложены три варианта: А) расширить посадки саксаула на осушенном дне; Б) увеличить число станций мониторинга пыли и создать систему оповещения; В) очищать коллекторно-дренажные воды и восстанавливать малые водоёмы. Бюджета хватает только на два.",
        "Salt and dust storms from the dried Aral seabed affect the health of people in Karakalpakstan and Khorezm. The regional administration has three options: A) expand saxaul plantations on the dry seabed; B) add dust monitoring stations and an alert system; C) treat drainage water and restore small lakes. The budget covers only two."),
      qs: [t3("Ким манфаатдор томонлар ва уларнинг манфаатлари қандай?", "Кто заинтересованные стороны и каковы их интересы?", "Who are the stakeholders and what do they want?"),
        t3("Конституциянинг қайси моддаси давлатга Оролбўйи бўйича мажбурият юклайди?", "Какая статья Конституции обязывает государство в отношении Приаралья?", "Which article of the Constitution places a duty on the state regarding the Aral region?"),
        t3("Қайси иккита вариантни танлайсиз ва нега? Далилингиз нима?", "Какие два варианта выберете и почему? Каковы доказательства?", "Which two options would you choose and why? What is your evidence?")],
      model: t3("Намуна: Конституциянинг 49-моддасига кўра давлат Оролбўйи минтақасининг экологик тизимини муҳофаза қилади ва тиклайди. А вариант чанг манбасини камайтиради (дарсликка кўра 2018–2021 йилларда 1,7 млн га яшил қоплама барпо қилинган), Б вариант аҳолининг экологик ахборот олиш ҳуқуқини таъминлайди ва соғлиқни дарҳол ҳимоя қилади. В вариант қиммат ва секин натижа беради. Тавсия: А + Б, натижани мониторинг маълумотлари билан ҳар йили баҳолаш.",
        "Образец: по статье 49 Конституции государство охраняет и восстанавливает экосистему Приаралья. Вариант А уменьшает источник пыли (по учебнику, в 2018–2021 гг. создано 1,7 млн га зелёных покрытий), вариант Б обеспечивает право на экологическую информацию и сразу защищает здоровье. Вариант В дорогой и даёт медленный результат. Рекомендация: А + Б с ежегодной оценкой по данным мониторинга.",
        "Model: under Article 49 of the Constitution the state protects and restores the Aral region's ecosystem. Option A reduces the dust source (per the textbook, 1.7 million ha of green cover were planted in 2018–2021), option B delivers the right to environmental information and protects health at once. Option C is costly and slow. Recommendation: A + B, evaluated yearly with monitoring data.") },
    { id: "plastik", icon: "🛍",
      t: t3("Кейс: шаҳар бозорида пластик пакетлар", "Кейс: пластиковые пакеты на городском рынке", "Case: plastic bags at a city market"),
      text: t3("Шаҳар бозорида кунига ўн минглаб юпқа пластик пакет тарқатилади. Улар ариқларни тўсиб, сел пайтида сув тошқинига сабаб бўлмоқда. Савдогарлар «харидор пакетсиз келмайди» дейди, экофаоллар тўлиқ тақиқни талаб қилади.",
        "На городском рынке ежедневно раздают десятки тысяч тонких пластиковых пакетов. Они забивают арыки и во время селей вызывают подтопления. Торговцы говорят «покупатель без пакета не придёт», экоактивисты требуют полного запрета.",
        "Tens of thousands of thin plastic bags are handed out at a city market every day. They clog the ditches and cause flooding during mudflows. Traders say “customers won't come without bags”; eco-activists demand a full ban."),
      qs: [t3("Муаммонинг ҳуқуқий томони: чиқиндилар тўғрисидаги қонун кимга қандай мажбурият юклайди?", "Правовая сторона: какие обязанности возлагает закон об отходах и на кого?", "The legal side: what duties does the waste law place, and on whom?"),
        t3("Хорижий тажриба: Руанда, Кения, Европа Иттифоқида пакетлар бўйича қандай чоралар бор?", "Зарубежный опыт: какие меры по пакетам в Руанде, Кении, ЕС?", "Foreign experience: what bag measures exist in Rwanda, Kenya and the EU?"),
        t3("Бозор учун 3 босқичли ҳуқуқий ва иқтисодий ечим таклиф қилинг.", "Предложите рынку трёхэтапное правовое и экономическое решение.", "Propose a three-step legal and economic solution for the market.")],
      model: t3("Намуна: 1) бозор маъмурияти чиқиндиларни алоҳида йиғишни ташкил қилиши ва ариқларни тозалаши; 2) юпқа пакетлар учун пулли тизим ва қайта ишлатиладиган халтани арзон нархда сотиш (ЕИ: 2019/904 директиваси ва пакетлар бўйича 2015/720 директиваси); 3) 6 ойдан кейин тақиқ ва назорат. Руанда 2008 йилда тўлиқ тақиқ киритган. Натижани ариқлардаги чиқинди ҳажми билан ўлчаш.",
        "Образец: 1) администрация рынка организует раздельный сбор отходов и очистку арыков; 2) платные тонкие пакеты и дешёвые многоразовые сумки (ЕС: директивы 2019/904 и 2015/720 о пакетах); 3) через 6 месяцев — запрет и контроль. Руанда ввела полный запрет в 2008 году. Результат измерять объёмом мусора в арыках.",
        "Model: 1) the market administration organises separate waste collection and ditch cleaning; 2) charge for thin bags and sell cheap reusable bags (EU: Directives 2019/904 and 2015/720 on bags); 3) after 6 months, a ban with enforcement. Rwanda introduced a full ban in 2008. Measure success by the volume of litter in the ditches.") }
  ];
  function keysView() {
    return `<div class="qn-card">
        <h3>🔍 ${H(t3("Кейс-стади: Гарвард кейс-методи", "Кейс-стади: гарвардский кейс-метод", "Case study: the Harvard case method"))}</h3>
        <p class="muted">${H(t3("Ҳақиқий ҳаётдаги муаммо: 1) кейсни ўқинг; 2) саволларга ўзингиз жавоб ёзинг; 3) намунавий жавоб билан таққосланг. Гуруҳда: 15 дақиқа муҳокама, 5 дақиқа тавсия.", "Реальная проблема: 1) прочитайте кейс; 2) ответьте на вопросы сами; 3) сравните с образцом. В группе: 15 минут обсуждения, 5 минут рекомендации.", "A real-world problem: 1) read the case; 2) answer the questions yourself; 3) compare with the model. In a group: 15 minutes of discussion, 5 minutes for the recommendation."))}</p>
      </div>
      ${KEYS.map((k) => `<article class="qn-card" id="qn-keys-${k.id}">
        <h3>${k.icon} ${H(k.t)}</h3>
        <p>${H(k.text)}</p>
        ${k.qs.map((q, i) => `<h4>${i + 1}. ${H(q)}</h4><textarea class="qn-ta pdf-skip" data-note="keys:${k.id}:${i}" rows="3">${esc(st.notes[`keys:${k.id}:${i}`] || "")}</textarea>`).join("")}
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="note" data-k="keys:${k.id}">${H(TX.saveNote)}</button><button class="btn btn-ghost btn-sm" data-act="model" data-k="${k.id}" aria-expanded="false">${H(TX.model)}</button><button class="btn btn-ghost btn-sm" data-pdf="#qn-keys-${k.id}"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdf)}</button></div>
        <div class="qn-fb" data-model="${k.id}" hidden>${H(k.model)}</div>
      </article>`).join("")}`;
  }

  /* ========== 6. Дебат ========== */
  const DEB = [
    { t: t3("Бир марталик пластик пакетларни тўлиқ тақиқлаш керак", "Одноразовые пластиковые пакеты нужно полностью запретить", "Single-use plastic bags should be fully banned"),
      a: [[t3("Ариқ ва сув ҳавзаларини тўсади, тошқин хавфини оширади", "Засоряют арыки и водоёмы, повышают риск подтоплений", "They clog ditches and waters, raising flood risk"), "p"],
        [t3("Микропластик тупроқ ва озиқ-овқатга ўтади", "Микропластик попадает в почву и пищу", "Microplastics get into soil and food"), "p"],
        [t3("Камбағал оилалар учун муқобил халта қиммат бўлиши мумкин", "Альтернативные сумки могут быть дороги для бедных семей", "Alternative bags may be costly for poor families"), "c"],
        [t3("Пакет ишлаб чиқарувчи корхоналарда иш ўринлари қисқаради", "Сократятся рабочие места на заводах пакетов", "Jobs at bag factories will be lost"), "c"],
        [t3("Руанда ва Кения тажрибаси тақиқ ишлашини кўрсатди", "Опыт Руанды и Кении показал, что запрет работает", "Rwanda and Kenya show bans can work"), "p"],
        [t3("Тақиқ ўрнига пулли пакет ва қайта ишлаш ҳам самарали бўлиши мумкин", "Вместо запрета эффективны могут быть платные пакеты и переработка", "Charging and recycling may work as well as a ban"), "c"]] },
    { t: t3("Экологик жарималарни кескин ошириш ифлосланишни камайтиради", "Резкое повышение экологических штрафов снизит загрязнение", "Sharply raising environmental fines will cut pollution"),
      a: [[t3("Жарима ифлослантиришдан арзон бўлса, корхона тўлаб давом этаверади", "Если штраф дешевле очистки, предприятие продолжит платить и загрязнять", "If fines are cheaper than treatment, firms just pay and keep polluting"), "p"],
        [t3("Назорат бўлмаса, катта жарима ҳам қўлланмайди", "Без контроля и большой штраф не применяется", "Without inspections even big fines are never applied"), "c"],
        [t3("Юқори жарима коррупция хавфини ошириши мумкин", "Высокие штрафы могут повысить риск коррупции", "High fines may increase the risk of corruption"), "c"],
        [t3("«Ифлослантирувчи тўлайди» тамойилига мос", "Соответствует принципу «загрязнитель платит»", "It fits the polluter-pays principle"), "p"],
        [t3("Кичик бизнес учун ҳалокатли бўлиши мумкин", "Может разорить малый бизнес", "It may ruin small businesses"), "c"],
        [t3("Жарима пули экологик фондга тушиб, тиклашга сарфланади", "Штрафы идут в экофонд и на восстановление", "Fine revenue can go to an ecological fund for restoration"), "p"]] },
    { t: t3("Конституцияга «экологик хавфсиз муҳитда яшаш ҳуқуқи» алоҳида киритилиши керак", "В Конституцию нужно отдельно включить «право жить в экологически безопасной среде»", "The Constitution should add a separate “right to live in an ecologically safe environment”"),
      a: [[t3("Дарслик муаллифлари (Нигматов, Пулатов, 2026) шундай таклиф қилади", "Это предлагают авторы учебника (Нигматов, Пулатов, 2026)", "The textbook authors (Nigmatov, Pulatov, 2026) propose it"), "p"],
        [t3("49-моддадаги «қулай атроф-муҳит» ҳуқуқи буни аллақачон қамраб олади", "Право на «благоприятную среду» в ст. 49 уже это охватывает", "The “favourable environment” right in Art. 49 already covers it"), "c"],
        [t3("Аниқ ифода судда ҳимоя қилишни осонлаштиради", "Чёткая формулировка облегчает судебную защиту", "Precise wording makes court protection easier"), "p"],
        [t3("Конституцияни тез-тез ўзгартириш барқарорликка зарар", "Частые поправки вредят стабильности Конституции", "Frequent amendments harm constitutional stability"), "c"],
        [t3("БМТ 2022 йилда соғлом атроф-муҳит ҳуқуқини инсон ҳуқуқи деб тан олди", "ООН в 2022 году признала право на здоровую среду правом человека", "The UN recognised the right to a healthy environment as a human right in 2022"), "p"],
        [t3("Муаммо қонунда эмас, ижрода", "Проблема не в законе, а в исполнении", "The problem is enforcement, not wording"), "c"]] }
  ];
  let debI = 0, debPick = {}, debChecked = false, timerT = null, timerLeft = 120;
  function debatView() {
    const m = DEB[debI];
    return `<div class="qn-card">
        <h3>🗣 ${H(t3("Оксфорд дебати", "Оксфордские дебаты", "Oxford-style debate"))}</h3>
        <p class="muted">${H(t3("Формат: «Ҳукумат» (тарафдор) ва «Мухолифат» (қарши) жамоалари навбат билан 2 дақиқадан сўзга чиқади, кейин саволлар ва якуний овоз бериш. Аввал далилларни саралаб машқ қилинг.", "Формат: команды «Правительство» (за) и «Оппозиция» (против) выступают по очереди по 2 минуты, затем вопросы и итоговое голосование. Сначала потренируйтесь сортировать доводы.", "Format: the Government (for) and Opposition (against) teams speak in turns for 2 minutes, then questions and a final vote. First practise sorting the arguments."))}</p>
        <div class="filters pdf-skip">${DEB.map((d, i) => `<button type="button" class="chip ${i === debI ? "active" : ""}" data-deb="${i}">${i + 1}</button>`).join("")}</div>
      </div>
      <div class="qn-card">
        <h3>«${H(m.t)}»</h3>
        <ol class="qn-sort">${m.a.map(([t, v], i) => `<li data-i="${i}" class="${debChecked ? (debPick[i] === v ? "ok" : "bad") : ""}"><span>${H(t)}</span><div class="seg" role="group"><button type="button" data-dv="p" class="${debPick[i] === "p" ? "on" : ""}">${H(t3("Тарафдор", "За", "For"))}</button><button type="button" data-dv="c" class="${debPick[i] === "c" ? "on" : ""}">${H(t3("Қарши", "Против", "Against"))}</button></div></li>`).join("")}</ol>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="deb-check">${H(TX.check)}</button></div>
        ${debChecked ? `<p class="qn-fb">${H(t3("Ҳар бир далилни манба билан мустаҳкамланг: рақам, қонун моддаси ёки тадқиқот.", "Подкрепите каждый довод источником: цифрой, статьёй закона или исследованием.", "Back every argument with a source: a figure, a law article or a study."))} ${m.a.filter(([, v], i) => debPick[i] === v).length}/${m.a.length}</p>` : ""}
        <h4>⏱ ${H(t3("Нутқ таймери", "Таймер выступления", "Speech timer"))}</h4>
        <div class="qn-acts pdf-skip"><span class="qn-timer" data-timer>${fmtT(timerLeft)}</span><button class="btn btn-ghost btn-sm" data-act="timer">${H(timerT ? t3("⏸ Тўхтатиш", "⏸ Пауза", "⏸ Pause") : t3("▶ Бошлаш", "▶ Старт", "▶ Start"))}</button><button class="btn btn-ghost btn-sm" data-act="timer-reset">↺ 2:00</button></div>
        <h4>✍️ ${H(t3("Ўз нутқингиз режаси", "План вашего выступления", "Your speech outline"))}</h4>
        <textarea class="qn-ta" data-note="deb:${debI}" rows="4" placeholder="${H(t3("Тезис → далил → мисол → хулоса", "Тезис → довод → пример → вывод", "Claim → evidence → example → conclusion"))}">${esc(st.notes["deb:" + debI] || "")}</textarea>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="note" data-k="deb:${debI}">${H(TX.saveNote)}</button></div>
      </div>`;
  }
  const fmtT = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ========== 7. Эко-детектив (Inquiry-Based Learning) ========== */
  /* Дарё бўйлаб 5 та нуқта; ифлослантирувчилар нуқталар орасида. ЧЙК (балиқчилик сув ҳавзаси учун шартли): нитрат 40, бўёқ (ранглилик) 20, нефть 0,05, БПК5 3 мг/л — ўқув мисоли. */
  const POINTS = [
    { n: "P1", d: t3("Шаҳардан юқори", "Выше города", "Upstream of town"), v: [6, 4, 0.01, 2] },
    { n: "P2", d: t3("Ферма ортидан", "После фермы", "After the farm"), v: [52, 5, 0.01, 4] },
    { n: "P3", d: t3("Автоювиш шохобчасидан кейин", "После автомойки", "After the car wash"), v: [50, 5, 0.03, 4] },
    { n: "P4", d: t3("Тўқимачилик фабрикасидан кейин", "После текстильной фабрики", "After the textile mill"), v: [49, 64, 0.03, 9] },
    { n: "P5", d: t3("Шаҳардан пастда", "Ниже города", "Downstream of town"), v: [47, 58, 0.03, 8] }
  ];
  const MPC = [40, 20, 0.05, 3];
  const PAR = [t3("Нитрат", "Нитраты", "Nitrate"), t3("Бўёқ (ранглилик)", "Красители (цветность)", "Dyes (colour)"), t3("Нефть маҳсулотлари", "Нефтепродукты", "Oil products"), t3("БПК₅", "БПК₅", "BOD₅")];
  const SUSPECTS = [
    ["farm", "🐄", t3("Чорвачилик фермаси", "Животноводческая ферма", "Livestock farm")],
    ["wash", "🚗", t3("Автоювиш шохобчаси", "Автомойка", "Car wash")],
    ["mill", "🧵", t3("Тўқимачилик фабрикаси", "Текстильная фабрика", "Textile mill")]
  ];
  let detTaken = [], detAccuse = null;
  const detTaken0 = () => detTaken.length;
  function detView() {
    const left = 3 - detTaken0();
    return `<div class="qn-card">
        <h3>🕵️ ${H(t3("Эко-детектив: дарёни ким ифлослантирмоқда?", "Эко-детектив: кто загрязняет реку?", "Eco-detective: who is polluting the river?"))}</h3>
        <p>${H(t3("Шаҳардан пастда сув ранги ўзгарди ва балиқлар камайди. Сизда фақат 3 та лаборатория таҳлили бор. Намуна олиш нуқталарини ақл билан танланг, натижаларни ЧЙК билан таққосланг ва айбдорни аниқланг. Бу — тадқиқотга асосланган таълим (Inquiry-Based Learning): савол → гипотеза → маълумот → хулоса.",
          "Ниже города изменился цвет воды и стало меньше рыбы. У вас только 3 лабораторных анализа. Выберите точки отбора проб с умом, сравните результаты с ПДК и найдите виновника. Это обучение через исследование (Inquiry-Based Learning): вопрос → гипотеза → данные → вывод.",
          "Below the town the water changed colour and fish declined. You have only 3 lab tests. Choose sampling points wisely, compare results with MPCs and find the culprit. This is Inquiry-Based Learning: question → hypothesis → data → conclusion."))}</p>
        <p class="small muted">${H(t3("Ўқув мисоли: рақамлар ва ЧЙК шартли.", "Учебный пример: цифры и ПДК условные.", "Training example: figures and MPCs are illustrative."))}</p>
        <p><b>${H(t3("Таҳлиллар қолди", "Осталось анализов", "Tests left"))}: ${left}</b></p>
        <div class="qn-river pdf-skip">${POINTS.map((p, i) => `<button type="button" data-pt="${i}" ${detTaken.includes(i) || !left || detAccuse ? "disabled" : ""}>💧 ${p.n}<small>${H(p.d)}</small></button>`).join("")}</div>
        ${detTaken.length ? `<div class="qn-wrap-x"><table class="qn-table"><thead><tr><th>${H(t3("Нуқта", "Точка", "Point"))}</th>${PAR.map((x, k) => `<th>${H(x)}<br><small class="muted">${H(t3("ЧЙК", "ПДК", "MPC"))} ${MPC[k]}</small></th>`).join("")}</tr></thead>
          <tbody>${detTaken.slice().sort((a, b) => a - b).map((i) => `<tr><td><b>${POINTS[i].n}</b> ${H(POINTS[i].d)}</td>${POINTS[i].v.map((v, k) => `<td class="${v > MPC[k] ? "hi" : ""}">${String(v).replace(".", lang() === "en" ? "." : ",")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""}
      </div>
      <div class="qn-card">
        <h4>${H(t3("Айбдор ким?", "Кто виновник?", "Who is the culprit?"))}</h4>
        <div class="qn-opts">${SUSPECTS.map(([k, i, t]) => `<button type="button" class="sg-opt ${detAccuse ? (k === "mill" ? "ok" : k === detAccuse ? "bad" : "") : ""}" data-sus="${k}" ${detAccuse || detTaken.length < 2 ? "disabled" : ""}>${i} ${H(t)}</button>`).join("")}</div>
        ${detTaken.length < 2 && !detAccuse ? `<p class="small muted">${H(t3("Айблашдан олдин камида 2 та намуна олинг.", "Прежде чем обвинять, возьмите хотя бы 2 пробы.", "Take at least 2 samples before accusing anyone."))}</p>` : ""}
        ${detAccuse ? `<p class="qn-fb ${detAccuse === "mill" ? "" : "bad"}">${H(detAccuse === "mill" ? TX.right : TX.wrong)} ${H(t3("Бўёқ ва БПК₅ P4 нуқтасида (фабрикадан кейин) кескин ошади ва ЧЙК дан 3 баробардан кўп. Нитрат P2 да (ферма) ошган — бу алоҳида муаммо, лекин сув рангининг сабаби эмас. Кейинги ҳуқуқий қадамлар: экологик назорат органи текширув ўтказади, далолатнома тузади, маъмурий жарима ва зарарни қоплаш талаб қилинади, фабрика тозалаш иншоотини ўрнатиши керак. Ферма бўйича эса алоҳида текширув лозим.",
          "Красители и БПК₅ резко растут в точке P4 (после фабрики) и превышают ПДК более чем в 3 раза. Нитраты выросли в P2 (ферма) — это отдельная проблема, но не причина цвета воды. Дальнейшие правовые шаги: орган экоконтроля проводит проверку, составляет акт, требует административный штраф и возмещение ущерба, фабрика должна установить очистные. По ферме нужна отдельная проверка.",
          "Dyes and BOD₅ jump at P4 (after the mill) and exceed the MPC more than threefold. Nitrate rose at P2 (the farm) — a separate problem, but not why the water changed colour. Next legal steps: the environmental control body inspects, writes a report, seeks an administrative fine and compensation, and the mill must install treatment. The farm needs a separate inspection."))}</p>
          <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-act="det-reset">${H(TX.again)}</button></div>` : ""}
      </div>`;
  }

  /* ========== 8. Корхона симулятори ========== */
  const SIM = [
    { k: "exp", t: t3("Давлат экологик экспертизаси", "Государственная экологическая экспертиза", "State environmental review"), o: [
      [t3("Ўтказилмаган", "Не проводилась", "Not done"), { p: 0, c: 0, r: 3, law: t3("ЎРҚ-1036 (экологик экспертиза ва ОВОС): хулосасиз лойиҳани амалга ошириш ва молиялаштириш тақиқланади; МЖтК 96-модда", "ЗРУ-1036 (экоэкспертиза и ОВОС): реализация и финансирование без заключения запрещены; ст. 96 КоАО", "ZRU-1036 (review and EIA): no implementation or financing without a positive opinion; Admin Code Art. 96") }],
      [t3("Ижобий хулоса олинган, жамоатчилик муҳокамаси ўтказилган", "Получено положительное заключение, проведено общественное обсуждение", "Positive opinion obtained, public hearing held"), { p: 0, c: 1, r: 0 }]] },
    { k: "water", t: t3("Оқова сув", "Сточные воды", "Wastewater"), o: [
      [t3("Тозаламасдан ариққа", "В арык без очистки", "Into the canal untreated"), { p: 35, c: 0, r: 3, law: t3("Сув кодекси (2025) ва МЖтК 72-модда: сув объектларини ифлослантириш тақиқланади", "Водный кодекс (2025) и ст. 72 КоАО: загрязнение водных объектов запрещено", "Water Code (2025) and Admin Code Art. 72: polluting water bodies is prohibited") }],
      [t3("Механик тозалаш", "Механическая очистка", "Mechanical treatment"), { p: 15, c: 2, r: 1 }],
      [t3("Механик + биологик тозалаш ва сувни қайта ишлатиш", "Механическая + биологическая очистка и оборотное водоснабжение", "Mechanical + biological treatment and water reuse"), { p: 4, c: 4, r: 0 }]] },
    { k: "air", t: t3("Ҳавога чиқиндилар", "Выбросы в атмосферу", "Air emissions"), o: [
      [t3("Фильтрсиз", "Без фильтров", "No filters"), { p: 30, c: 0, r: 3, law: t3("Атмосфера ҳавосини муҳофаза қилиш тўғрисидаги қонун: чиқиндилар нормативлари ва рухсатнома", "Закон об охране атмосферного воздуха: нормативы выбросов и разрешение", "Air protection law: emission limits and permits") }],
      [t3("Циклон", "Циклон", "Cyclone"), { p: 14, c: 1, r: 1 }],
      [t3("Енгли (қопли) фильтр ва узлуксиз мониторинг", "Рукавный фильтр и непрерывный мониторинг", "Bag filter and continuous monitoring"), { p: 4, c: 3, r: 0 }]] },
    { k: "waste", t: t3("Қаттиқ чиқиндилар", "Твёрдые отходы", "Solid waste"), o: [
      [t3("Очиқ жойга ташлаш ёки ёқиш", "Свалка на открытой площадке или сжигание", "Open dumping or burning"), { p: 20, c: 0, r: 3, law: t3("Чиқиндилар тўғрисидаги қонун: чиқиндиларни рухсат этилмаган жойга ташлаш ва ёқиш тақиқланади", "Закон об отходах: запрещены сброс в неустановленных местах и сжигание", "Waste law: dumping in unauthorised places and burning are prohibited") }],
      [t3("Лицензияли оператор билан шартнома", "Договор с лицензированным оператором", "Contract with a licensed operator"), { p: 6, c: 1, r: 0 }],
      [t3("Саралаш ва қайта ишлашга топшириш", "Сортировка и передача на переработку", "Sorting and recycling"), { p: 3, c: 1, r: 0, g: 1 }]] },
    { k: "energy", t: t3("Энергия", "Энергия", "Energy"), o: [
      [t3("Фақат умумий тармоқ", "Только общая сеть", "Grid only"), { p: 8, c: 0, r: 0 }],
      [t3("Томда 30 % қуёш панели", "30 % солнечных панелей на крыше", "30 % rooftop solar"), { p: 4, c: 2, r: 0, g: 1 }]] }
  ];
  let simPick = {};
  function simCalc() {
    let p = 0, c = 0, r = 0, g = 0; const laws = [];
    SIM.forEach((s) => { const o = s.o[simPick[s.k] ?? 0][1]; p += o.p; c += o.c; r += o.r; g += o.g || 0; if (o.law) laws.push(o.law); });
    return { p: Math.min(100, p), c, r, g, laws, ok: laws.length === 0 };
  }
  function simView() {
    const v = simCalc();
    const risk = v.r >= 6 ? t3("Юқори", "Высокий", "High") : v.r >= 2 ? t3("Ўрта", "Средний", "Medium") : t3("Паст", "Низкий", "Low");
    const bar = (pct, col) => `<div class="qn-meter"><i style="width:${pct}%;background:${col}"></i></div>`;
    return `<div class="qn-card">
        <h3>🏭 ${H(t3("Симулятор: сиз — тўқимачилик фабрикаси директори", "Симулятор: вы — директор текстильной фабрики", "Simulator: you run a textile mill"))}</h3>
        <p class="muted">${H(t3("Ҳар бир қарор ифлосланиш, харажат ва ҳуқуқий хавфни ўзгартиради. Мақсад: ифлосланишни камайтириш, қонунни бузмаслик ва харажатни оқилона ушлаш. Рақамлар шартли — улар қарорлар орасидаги боғлиқликни кўрсатади.", "Каждое решение меняет загрязнение, затраты и правовой риск. Цель: снизить загрязнение, не нарушать закон и разумно держать затраты. Цифры условные — они показывают связь между решениями.", "Each decision changes pollution, cost and legal risk. Goal: cut pollution, stay within the law and keep costs reasonable. Figures are illustrative and show how decisions interact."))}</p>
      </div>
      <div class="qn-card qn-sim">${SIM.map((s) => `<fieldset><legend>${H(s.t)}</legend>${s.o.map(([t], i) => `<label><input type="radio" name="sim-${s.k}" data-sim="${s.k}" value="${i}" ${(simPick[s.k] ?? 0) === i ? "checked" : ""}> <span>${H(t)}</span></label>`).join("")}</fieldset>`).join("")}</div>
      <div class="qn-card">
        <div class="qn-kpi">
          <div><span class="small muted">${H(t3("Ифлосланиш индекси", "Индекс загрязнения", "Pollution index"))}</span><b>${v.p}/100</b>${bar(v.p, v.p > 50 ? "#dc2626" : v.p > 20 ? "#d97706" : "#16a34a")}</div>
          <div><span class="small muted">${H(t3("Йиллик харажат", "Годовые затраты", "Annual cost"))}</span><b>${v.c} / 11</b>${bar(Math.round((v.c / 11) * 100), "#0284c7")}</div>
          <div><span class="small muted">${H(t3("Ҳуқуқий хавф", "Правовой риск", "Legal risk"))}</span><b>${H(risk)}</b>${bar(Math.min(100, v.r * 8), v.r >= 6 ? "#dc2626" : v.r >= 2 ? "#d97706" : "#16a34a")}</div>
          <div><span class="small muted">${H(t3("Яшил иқтисодиёт балли", "Балл «зелёной экономики»", "Green economy score"))}</span><b>${v.g}/2</b>${bar(v.g * 50, "#16a34a")}</div>
        </div>
        ${v.laws.length ? `<h4>⚠️ ${H(t3("Бузилган нормалар", "Нарушенные нормы", "Norms violated"))}</h4><ul>${v.laws.map((l) => `<li>${H(l)}</li>`).join("")}</ul>
          <p class="small muted">${H(t3("Оқибат: экологик назорат текшируви, маъмурий жарима, зарарни қоплаш, фаолиятни тўхтатиш хавфи.", "Последствия: проверка экоконтроля, административный штраф, возмещение ущерба, риск приостановки деятельности.", "Consequences: an environmental inspection, administrative fines, compensation for damage and a risk of suspension."))}</p>`
          : `<p class="qn-fb">${H(t3("✓ Қонун талаблари бажарилди. Энди харажатни камайтириш йўлларини муҳокама қилинг: сувни қайта ишлатиш, энергия тежаш, «яшил» кредитлар.", "✓ Требования закона соблюдены. Теперь обсудите, как снизить затраты: оборотная вода, энергосбережение, «зелёные» кредиты.", "✓ The legal requirements are met. Now discuss how to cut costs: water reuse, energy saving, green loans."))}</p>`}
        <h4>✍️ ${H(t3("Директор сифатида қарорингизни асосланг", "Обоснуйте решение как директор", "Justify your decision as director"))}</h4>
        <textarea class="qn-ta" data-note="sim" rows="3">${esc(st.notes.sim || "")}</textarea>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="note" data-k="sim">${H(TX.saveNote)}</button></div>
      </div>`;
  }

  /* ========== 9. Хорижий технологиялар ва методлар ========== */
  const TOOLS = [
    { ic: "🛰️", t: "NASA Worldview", u: "https://worldview.earthdata.nasa.gov/",
      d: t3("Сунъий йўлдош суратлари деярли реал вақтда: чанг бўронлари, ёнғинлар, сув тошқинлари.", "Спутниковые снимки почти в реальном времени: пыльные бури, пожары, наводнения.", "Near-real-time satellite imagery: dust storms, fires, floods."),
      task: t3("Топшириқ: Орол денгизини топинг ва 2000 ҳамда охирги йил расмини таққосланг. Конституциянинг 49-моддаси нуқтаи назаридан 5 жумлали хулоса ёзинг.", "Задание: найдите Аральское море и сравните снимки 2000 и последнего года. Напишите вывод из 5 предложений с точки зрения ст. 49 Конституции.", "Task: find the Aral Sea and compare images from 2000 and the latest year. Write a 5-sentence conclusion in light of Article 49 of the Constitution.") },
    { ic: "🌍", t: "NASA Earth Observatory", u: "https://earthobservatory.nasa.gov/",
      d: t3("Илмий изоҳли «Кун тасвири» мақолалари ва вақт кетма-кетликлари.", "Статьи «Снимок дня» с научными пояснениями и временные ряды.", "Image-of-the-day articles with scientific explanations and time series."),
      task: t3("Топшириқ: «Aral Sea» бўйича мақолани топинг ва ундаги битта рақамни манбаси билан дебатда ишлатинг.", "Задание: найдите статью «Aral Sea» и используйте одну цифру из неё со ссылкой в дебатах.", "Task: find the “Aral Sea” article and use one figure from it, with its source, in the debate.") },
    { ic: "🌳", t: "Global Forest Watch", u: "https://www.globalforestwatch.org/",
      d: t3("Дунё бўйича ўрмон қопламининг йўқолиши ва тикланиши харитаси.", "Карта потери и восстановления лесного покрова по всему миру.", "A world map of tree cover loss and gain."),
      task: t3("Топшириқ: Ўзбекистон ёки ўз вилоятингизни танлаб, дарахт қопламининг ўзгаришини аниқланг ва ўсимлик дунёси тўғрисидаги қонун билан боғланг.", "Задание: выберите Узбекистан или свою область, определите изменение древесного покрова и свяжите с законом о растительном мире.", "Task: choose Uzbekistan or your region, find the tree cover change and link it to the plant life law.") },
    { ic: "💨", t: "OpenAQ", u: "https://explore.openaq.org/",
      d: t3("Ҳаво сифати бўйича очиқ маълумотлар: PM2.5, NO₂ ва бошқалар.", "Открытые данные о качестве воздуха: PM2.5, NO₂ и другие.", "Open air quality data: PM2.5, NO₂ and more."),
      task: t3("Топшириқ: Тошкентдаги станцияни топинг, бир ҳафталик PM2.5 ни ЖССТ тавсияси (кунлик 15 мкг/м³) билан таққосланг.", "Задание: найдите станцию в Ташкенте и сравните недельные PM2.5 с рекомендацией ВОЗ (15 мкг/м³ в сутки).", "Task: find a station in Tashkent and compare a week of PM2.5 with the WHO guideline (15 µg/m³ daily).") },
    { ic: "🗺️", t: "Google Earth Engine · Timelapse", u: "https://earthengine.google.com/timelapse/",
      d: t3("1984 йилдан бугунгача Ер юзасининг ўзгариши видеоси; илғор талабалар учун масофадан зондлаш лабораторияси.", "Видео изменений поверхности Земли с 1984 года; лаборатория дистанционного зондирования для продвинутых.", "Videos of Earth's surface since 1984; a remote-sensing lab for advanced students."),
      task: t3("Топшириқ: Тошкент ёки Самарқанд атрофидаги қурилиш ўсишини кузатинг ва яшил ҳудудлар ҳақида таклиф ёзинг.", "Задание: проследите рост застройки вокруг Ташкента или Самарканда и напишите предложение о зелёных зонах.", "Task: track urban growth around Tashkent or Samarkand and write a proposal on green areas.") }
  ];
  const METHODS = [
    ["🔄", t3("Тескари синф (Flipped Classroom)", "Перевёрнутый класс", "Flipped Classroom"), t3("Назария — уйда, амалиёт — аудиторияда. «Йўл харитаси» шу усулда тузилган.", "Теория — дома, практика — в аудитории. «Маршрут» построен по этому методу.", "Theory at home, practice in class. The Roadmap follows this method.")],
    ["❓", t3("Тадқиқотга асосланган таълим (Inquiry, 5E)", "Обучение через исследование (Inquiry, 5E)", "Inquiry-based learning (5E)"), t3("Қизиқтириш → тадқиқ → тушунтириш → кенгайтириш → баҳолаш. «Эко-детектив» шу усулда.", "Вовлечение → исследование → объяснение → расширение → оценка. Так устроен «Эко-детектив».", "Engage → explore → explain → elaborate → evaluate. The Eco-detective uses it.")],
    ["🧩", t3("Лойиҳага асосланган таълим (PBL)", "Проектное обучение (PBL)", "Project-based learning (PBL)"), t3("Маҳалладаги ҳақиқий муаммо бўйича узоқ муддатли лойиҳа — «Лойиҳалар» бўлимида.", "Долгий проект по реальной проблеме махалли — в разделе «Проекты».", "A long project on a real local problem — in the Projects section.")],
    ["⚖️", t3("Moot court (ўқув суди)", "Moot court (учебный суд)", "Moot court"), t3("Ҳуқуқ мактабларида (масалан, Jessup мусобақаси) анъанавий усул.", "Традиционный метод юрфаков (например, конкурс Jessup).", "A classic law school method (e.g. the Jessup competition).")],
    ["🌐", t3("Model UN / COP симуляцияси", "Модель ООН / симуляция COP", "Model UN / COP simulation"), t3("Талабалар давлатлар номидан иқлим музокарасини ўтказади.", "Студенты ведут климатические переговоры от имени стран.", "Students negotiate on climate on behalf of countries.")],
    ["🏅", t3("Геймификация ва ўзаро баҳолаш", "Геймификация и взаимооценивание", "Gamification and peer assessment"), t3("XP, нишонлар, жамоа топшириқлари ва рубрика асосида бир-бирини баҳолаш.", "XP, значки, командные задания и взаимная оценка по рубрике.", "XP, badges, team tasks and rubric-based peer review.")]
  ];
  function xorijView() {
    return `<div class="qn-card">
        <h3>🛰️ ${H(t3("Хорижий очиқ маълумот платформалари", "Зарубежные платформы открытых данных", "Foreign open-data platforms"))}</h3>
        <p class="muted">${H(t3("Платформалар интернетда (браузерда) очилади. Уларнинг маълумотлари ҳуқуқий хулоса учун далил бўлади: «олдин/кейин» расми, ўлчов, вақт қатори.", "Платформы открываются в интернете (в браузере). Их данные — доказательства для правового вывода: снимки «до/после», измерения, временные ряды.", "The platforms open on the internet (in the browser). Their data serve as evidence for legal conclusions: before/after images, measurements, time series."))}</p>
      </div>
      <div class="qn-grid">${TOOLS.map((x) => `<div class="qn-card">
        <h3>${x.ic} ${esc(x.t)}</h3><p>${H(x.d)}</p><p><b>${H(x.task)}</b></p>
        <p class="qn-src">${ext(x.u)}</p>
        <div class="qn-acts pdf-skip"><a class="btn btn-primary btn-sm" href="${esc(x.u)}" target="_blank" rel="noopener">${H(t3("Очиш ↗", "Открыть ↗", "Open ↗"))}</a></div>
      </div>`).join("")}</div>
      <div class="qn-card">
        <h3>🎓 ${H(t3("Хорижий таълим методлари бу бўлимда", "Зарубежные методы обучения в этом разделе", "Foreign teaching methods used here"))}</h3>
        <ul>${METHODS.map(([i, t, d]) => `<li>${i} <b>${H(t)}</b> — ${H(d)}</li>`).join("")}</ul>
      </div>`;
  }

  /* ========== 10. Тест ========== */
  function testQs() { return (D().QUIZ || []); }
  let tI = 0, tPick = null, tOk = 0, tDone = false;
  function testView() {
    const qs = testQs();
    if (!qs.length) return `<p class="muted">…</p>`;
    if (tDone) {
      const pct = Math.round((tOk / qs.length) * 100);
      return `<div class="qn-card"><h3>🧠 ${H(t3("Натижа", "Результат", "Result"))}</h3><p class="qn-score">${tOk}/${qs.length} · ${pct}%</p>
        <p>${H(pct >= 80 ? t3("Аъло! Сиз экологик ҳуқуқни амалда ишлата оласиз.", "Отлично! Вы умеете применять экологическое право.", "Excellent! You can apply environmental law in practice.") : pct >= 50 ? t3("Яхши. Хато қилган мавзуларингиз бўйича кутубхона карточкаларини қайта ўқинг.", "Хорошо. Перечитайте карточки по темам, где были ошибки.", "Good. Re-read the library cards on the topics you missed.") : t3("Конституция ва Қонунлар бўлимларини қайта кўриб чиқинг ва яна уриниб кўринг.", "Повторите разделы «Конституция» и «Законы» и попробуйте снова.", "Review the Constitution and Laws parts and try again."))}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="t-reset">${H(TX.again)}</button></div></div>`;
    }
    const q = qs[tI];
    return `<div class="qn-card">
      <h3>🧠 ${H(t3("Якуний тест", "Итоговый тест", "Final test"))} · ${tI + 1}/${qs.length}</h3>
      <div class="qn-meter"><i style="width:${Math.round((tI / qs.length) * 100)}%;background:var(--primary)"></i></div>
      <p><b>${H(q.q)}</b></p>
      <div class="qn-opts">${q.a.map((o, i) => `<button type="button" class="sg-opt ${tPick != null ? (i === q.c ? "ok" : i === tPick ? "bad" : "") : ""}" data-t="${i}" ${tPick != null ? "disabled" : ""}>${H(o)}</button>`).join("")}</div>
      ${tPick != null ? `<p class="qn-fb ${tPick === q.c ? "" : "bad"}">${H(tPick === q.c ? TX.right : TX.wrong)} ${H(q.why)}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="t-next">${H(TX.next)}</button></div>` : ""}
    </div>
    <div class="qn-card pdf-skip"><details><summary>${H(t3("Барча саволлар ва жавоблар (PDF учун)", "Все вопросы и ответы (для PDF)", "All questions and answers (for PDF)"))}</summary>
      <ol>${qs.map((x) => `<li>${H(x.q)} — <b>${H(x.a[x.c])}</b>. ${H(x.why)}</li>`).join("")}</ol></details></div>`;
  }

  /* ---------- Чизиш ---------- */
  let tab = "yol";
  const VIEWS = { yol: roadView, alifbo: () => (window.EkoAlifbo ? EkoAlifbo.html() : `<p class="muted">…</p>`), darslik: () => (window.EkoDarslik ? EkoDarslik.html() : `<p class="muted">…</p>`), amaliy: () => (window.EkoAmaliy ? EkoAmaliy.html() : `<p class="muted">…</p>`), kons: consView, lib: libView, sud: sudView, keys: keysView, debat: debatView, detektiv: detView, sim: simView, xorij: xorijView, test: testView };
  function render() {
    const name = (TX.tabs.find((x) => x[0] === tab) || TX.tabs[0])[2];
    ROOT.innerHTML = `
      <div class="qn-head">
        <div><span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(TX.title)}</h2>
        <p class="muted" style="max-width:760px">${H(TX.lead)}</p></div>
      </div>
      <div class="qn-tabs" role="tablist">${TX.tabs.map(([k, ic, t]) => `<button type="button" role="tab" aria-selected="${k === tab}" class="chip ${k === tab ? "active" : ""}" data-tab="${k}"><i class="fa-solid ${ic}" aria-hidden="true"></i>${H(t)}</button>`).join("")}</div>
      <div class="qn-panel" id="qnPanel" role="tabpanel" aria-label="${H(name)}">${VIEWS[tab]()}</div>
      ${tab === "darslik" || tab === "amaliy" ? "" : `<div class="qn-acts"><button class="btn btn-ghost btn-sm" data-pdf="#qnPanel"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdfAll)}: ${H(name)}</button></div>`}`;
  }
  function rerender(keepY) {
    const y = window.scrollY;
    render();
    if (keepY) window.scrollTo(0, y);
  }
  function pdf(sel) {
    const el = ROOT.querySelector(sel);
    if (!el || !window.EkoPDF) return;
    const name = (TX.tabs.find((x) => x[0] === tab) || TX.tabs[0])[2];
    const h = el.querySelector("h3");
    const title = sel === "#qnPanel" ? `${L(TX.title)}: ${L(name)}` : (h ? h.textContent : L(name));
    EkoPDF.save(el, { title, sub: L(TX.title) + " · Ekomun", file: "Ekomun-huquq-" + title });
  }

  ROOT.addEventListener("click", (e) => {
    const b = e.target.closest("button, a");
    if (!b || !ROOT.contains(b)) return;
    const ds = b.dataset;
    if (ds.tab) { tab = ds.tab; render(); ROOT.querySelector(".qn-tabs .active").scrollIntoView({ block: "nearest", inline: "center" }); return; }
    if (ds.go) { tab = ds.go; render(); SEC.scrollIntoView({ behavior: "smooth" }); return; }
    if (ds.pdf) { pdf(ds.pdf); return; }
    if (ds.topic) { libTopic = ds.topic; rerender(true); return; }
    if (ds.role) { sudRole = ds.role; rerender(true); return; }
    if (ds.case) { sudCase = ds.case; sudStep = 0; sudPts = 0; sudPick = null; render(); ROOT.querySelector("#qnPanel").scrollIntoView({ behavior: "smooth" }); return; }
    if (ds.sud != null) {
      const c = CASES.find((x) => x.id === sudCase);
      sudPick = +ds.sud;
      if (sudPick === c.steps[sudStep].c) sudPts++;
      rerender(true); return;
    }
    if (ds.v) { const li = b.closest("li"); li.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); li.dataset.pick = ds.v; li.classList.remove("ok", "bad"); return; }
    if (ds.dv) { const li = b.closest("li"); debPick[li.dataset.i] = ds.dv; debChecked = false; li.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); li.classList.remove("ok", "bad"); return; }
    if (ds.deb != null) { debI = +ds.deb; debPick = {}; debChecked = false; rerender(true); return; }
    if (ds.pt != null) { const i = +ds.pt; if (!detTaken.includes(i) && detTaken.length < 3) detTaken.push(i); rerender(true); return; }
    if (ds.sus) { detAccuse = ds.sus; if (ds.sus === "mill") { mark("detektiv"); xp("qn:det", 10, t3("эко-детектив", "эко-детектив", "eco-detective")); } rerender(true); return; }
    if (ds.t != null) {
      const q = testQs()[tI]; tPick = +ds.t; if (tPick === q.c) tOk++; rerender(true); return;
    }
    if (ds.model) {
      const box = ROOT.querySelector(`[data-model="${ds.model}"]`); box.hidden = !box.hidden; b.setAttribute("aria-expanded", String(!box.hidden));
      if (!box.hidden) { mark("keys"); xp("qn:keys:" + ds.model, 5, t3("кейс-стади", "кейс-стади", "case study")); }
      return;
    }
    switch (ds.act) {
      case "rd-check": {
        let ok = 0;
        ROOT.querySelectorAll('[data-game="rd"] li').forEach((li) => { const good = li.dataset.pick === SORT_RD[+li.dataset.i][1]; li.classList.toggle("ok", good); li.classList.toggle("bad", !good); if (good) ok++; });
        ROOT.querySelector('[data-out="rd"]').textContent = `${ok}/${SORT_RD.length}. ` + L(ok === SORT_RD.length ? t3("Аъло: ҳуқуқ ва мажбурият фарқини тушундингиз!", "Отлично: вы различаете права и обязанности!", "Excellent: you can tell rights from duties!") : t3("Қизил белгиланганларни Конституция моддалари билан солиштиринг.", "Сверьте красные пункты со статьями Конституции.", "Check the red items against the Constitution's articles."));
        if (ok === SORT_RD.length) { mark("kons"); xp("qn:rd", 10, t3("ҳуқуқ ва мажбурият", "права и обязанности", "rights and duties")); }
        return;
      }
      case "sud-next": {
        const c = CASES.find((x) => x.id === sudCase);
        sudStep++; sudPick = null;
        if (sudStep >= c.steps.length) { st.best["sud:" + c.id] = Math.max(st.best["sud:" + c.id] || 0, sudPts); mark("sud"); save(); xp("qn:sud:" + c.id, 10, t3("экологик суд", "экосуд", "eco-court")); }
        rerender(true); return;
      }
      case "sud-back": sudCase = null; rerender(false); return;
      case "deb-check": {
        debChecked = true; mark("debat"); xp("qn:deb:" + debI, 5, t3("дебат", "дебаты", "debate")); rerender(true); return;
      }
      case "timer": {
        if (timerT) { clearInterval(timerT); timerT = null; }
        else timerT = setInterval(() => {
          timerLeft = Math.max(0, timerLeft - 1);
          const el = ROOT.querySelector("[data-timer]");
          if (el) el.textContent = fmtT(timerLeft);
          if (!timerLeft) { clearInterval(timerT); timerT = null; toast(t3("⏰ Вақт тугади!", "⏰ Время вышло!", "⏰ Time's up!")); if (navigator.vibrate) navigator.vibrate(300); }
        }, 1000);
        b.textContent = L(timerT ? t3("⏸ Тўхтатиш", "⏸ Пауза", "⏸ Pause") : t3("▶ Бошлаш", "▶ Старт", "▶ Start"));
        return;
      }
      case "timer-reset": { if (timerT) clearInterval(timerT); timerT = null; timerLeft = 120; rerender(true); return; }
      case "det-reset": detTaken = []; detAccuse = null; rerender(true); return;
      case "note": {
        const k = ds.k;
        ROOT.querySelectorAll(`[data-note^="${k}"]`).forEach((t) => { st.notes[t.dataset.note] = t.value.trim(); });
        save(); toast(TX.saved);
        if (k === "sim") { mark("sim"); xp("qn:sim", 5, t3("симулятор", "симулятор", "simulator")); }
        return;
      }
      case "t-next": {
        tI++; tPick = null;
        if (tI >= testQs().length) {
          tDone = true; st.best.test = Math.max(st.best.test || 0, tOk); mark("test"); save();
          if (tOk / testQs().length >= 0.8) xp("qn:test", 20, t3("экологик ҳуқуқ тести", "тест по экоправу", "environmental law test"));
        }
        rerender(true); return;
      }
      case "t-reset": tI = 0; tPick = null; tOk = 0; tDone = false; rerender(true); return;
    }
  });
  ROOT.addEventListener("change", (e) => {
    const r = e.target.closest("[data-sim]");
    if (r) { simPick[r.dataset.sim] = +r.value; if (simCalc().ok) mark("sim"); rerender(true); }
  });
  ROOT.addEventListener("input", (e) => {
    if (e.target.matches("[data-lib-q]")) {
      libQ = e.target.value;
      const pos = e.target.selectionStart;
      rerender(true);
      const inp = ROOT.querySelector("[data-lib-q]");
      if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (x) { /* ignore */ } }
    }
  });
  /* Кутубхона ва Конституция бўлимини очганда «кўрилди» деб белгилаймиз */
  const seen = () => { if (tab === "darslik" && window.EkoDarslik && EkoDarslik.done() > 0) mark("darslik"); if (tab === "lib") mark("lib"); if (tab === "xorij") mark("xorij"); };
  ROOT.addEventListener("click", seen);

  render();
  if (window.EkoAlifbo) EkoAlifbo.onChange(() => { if (tab === "alifbo") rerender(true); });
  window.addEventListener("eko:lang", render);
  window.EkoQonun = { open: (k) => { tab = k || "yol"; render(); } };
})();
