/* Экомун — 📄 «PDF дан ўйинли дарс» (Ўқитувчи устахонасининг биринчи таби) ва дарс ўтказиш режими.
   • Ўқитувчи ўз дарслиги, амалий ёки лаборатория машғулотини PDF (ёки DOCX, TXT) қилиб юклайди.
     Файл браузерда матнга айлантирилади (pdf.js, Mozilla, Apache-2.0 — /vendor/pdfjs/, биринчи марта
     керак бўлганда юкланади), матн ўқитувчи базасига сақланади: ҳисобга кирилган бўлса — серверга
     (/api/ustoz/mats, ustoz.js), бўлмаса — шу қурилмага.
   • Матндан ўйинли дарс автоматик тузилади (СИ шарт эмас): инсерт, кластер, атамалар жуфти, кроссворд,
     Венн диаграммаси, «тўғри ёки нотўғри», тест, қадамларни тартиблаш, жиҳозлар саватчаси, синквейн,
     чиқиш варақаси (3-2-1). Серверда СИ бўлса — «СИ билан бойитиш» ва скан PDF ни ўқиш ҳам бор.
   • Дарс ўтказиш режими (проектор/доска учун): катта шрифт, таймер, 2–4 жамоа ҳисоби, тўлиқ экран.
   • Ўқувчига 6 белгили код (+ҳавола, QR) берилади: ?eku=КОД ёки бош саҳифадаги «Ўқитувчи дарси»
     (#darskod) — ҳар икки босқичда очилади, натижа ўқитувчига боради.
   Ҳолат: localStorage «ekotalim:dars». API: window.EkoDars. */
(() => {
  "use strict";
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
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(typeof o === "string" ? o : L(o)); };
  const xpOnce = (k, n, why) => { const a = App(); if (!a || !a.addXp) return; a.state.flags = a.state.flags || {}; if (!a.state.flags[k]) { a.state.flags[k] = true; a.addXp(n, L(why)); } };
  const hasServer = () => /^https?:$/.test(location.protocol) && location.hostname !== "appassets.androidplatform.net";
  const site = () => (hasServer() ? location.origin : ((window.EKO_VERSION && EKO_VERSION.site) || "https://ekomun.onrender.com"));
  const api = (p) => (hasServer() ? "" : site()) + p;
  const fmtDate = (t) => { try { return new Date(t).toLocaleDateString(lang() === "en" ? "en-GB" : "ru-RU"); } catch (e) { return ""; } };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* Дарс мазмуни материал тилида қолади; ўзбек кирилл матни лотин режимида лотинга ўгирилади */
  let curLang = "uzc";
  const Craw = (s) => (curLang === "uzc" && lang() === "lat" ? tr(String(s ?? "")) : String(s ?? ""));
  const C = (s) => esc(Craw(s));

  /* ===================== Матнлар ===================== */
  const TX = {
    tab: t3("📄 PDF → ўйинли дарс", "📄 PDF → игровой урок", "📄 PDF → game lesson"),
    lead: t3("Дарслик, амалий ёки лаборатория машғулотингизни PDF қилиб юкланг: матн базангизга сақланади ва бир дақиқада ундан ўйинли дарс тузилади — инсерт, кластер, кроссворд, Венн, синквейн, тест ва бошқалар. Дарсни синфда проектор орқали ўтказинг ёки ўқувчиларга код беринг.",
      "Загрузите учебник, практическое или лабораторное занятие в PDF: текст сохранится в вашей базе, и за минуту из него получится игровой урок — инсерт, кластер, кроссворд, Венн, синквейн, тест и др. Проводите урок через проектор или дайте ученикам код.",
      "Upload your textbook, practical or lab session as a PDF: the text is saved to your library and turned into a game lesson in a minute — INSERT, cluster, crossword, Venn, cinquain, quiz and more. Run it on a projector or give students a code."),
    s1: t3("1. Материални юкланг", "1. Загрузите материал", "1. Upload material"),
    drop: t3("PDF, DOCX ёки TXT файлни шу ерга ташланг ёки танланг", "Перетащите сюда PDF, DOCX или TXT или выберите файл", "Drop a PDF, DOCX or TXT file here or choose one"),
    choose: t3("Файл танлаш", "Выбрать файл", "Choose file"),
    paste: t3("Матнни қўлда қўйиш", "Вставить текст вручную", "Paste text instead"),
    pasteP: t3("Дарслик ёки машғулот матнини шу ерга қўйинг…", "Вставьте сюда текст учебника или занятия…", "Paste the textbook or session text here…"),
    title: t3("Мавзу (сарлавҳа)", "Тема (заголовок)", "Topic (title)"),
    kind: t3("Машғулот тури", "Тип занятия", "Session type"),
    kinds: { darslik: t3("Дарслик", "Учебник", "Textbook"), amaliy: t3("Амалий машғулот", "Практическое занятие", "Practical session"), lab: t3("Лаборатория иши", "Лабораторная работа", "Lab work") },
    stage: t3("Ким учун", "Для кого", "Audience"),
    stages: { maktab: t3("Мактаб", "Школа", "School"), uni: t3("Университет", "Вуз", "University") },
    reading: t3("Ўқилмоқда", "Читаем", "Reading"),
    page: t3("бет", "стр.", "pages"),
    chars: t3("белги", "симв.", "chars"),
    words: t3("сўз", "слов", "words"),
    make: t3("Базага сақлаш ва дарс яратиш", "Сохранить в базу и создать урок", "Save to library and build lesson"),
    noText: t3("Бу PDF да матн қатлами йўқ (скан қилинган расм). СИ орқали ўқиш мумкин ёки матнни қўлда қўйинг.", "В этом PDF нет текстового слоя (скан). Можно распознать через ИИ или вставить текст вручную.", "This PDF has no text layer (a scan). Read it with AI or paste the text manually."),
    ocr: t3("СИ орқали ўқиш (скан PDF)", "Распознать через ИИ (скан)", "Read with AI (scanned PDF)"),
    ocrWait: t3("СИ PDF ни ўқимоқда… 1–2 дақиқа", "ИИ читает PDF… 1–2 минуты", "AI is reading the PDF… 1–2 minutes"),
    badFile: t3("Файлни ўқиб бўлмади. PDF, DOCX ёки TXT танланг.", "Не удалось прочитать файл. Выберите PDF, DOCX или TXT.", "Could not read the file. Choose a PDF, DOCX or TXT."),
    tooBig: t3("Файл жуда катта (энг кўпи 40 МБ).", "Файл слишком большой (максимум 40 МБ).", "File too large (max 40 MB)."),
    short: t3("Матн жуда қисқа — камида бир неча хатбоши керак.", "Текст слишком короткий — нужно хотя бы несколько абзацев.", "The text is too short — at least a few paragraphs are needed."),
    base: t3("2. Менинг базам", "2. Моя база", "2. My library"),
    baseSrv: t3("Серверда, ҳисобингизга боғланган", "На сервере, привязано к вашему аккаунту", "On the server, linked to your account"),
    baseLoc: t3("Шу қурилмада. Бошқа қурилмада ҳам кўриш учун ҳисобга киринг.", "На этом устройстве. Войдите, чтобы видеть на других устройствах.", "On this device. Sign in to see it on other devices."),
    signin: t3("Ҳисобга кириш", "Войти", "Sign in"),
    baseNone: t3("Ҳали материал юкламагансиз.", "Вы ещё не загрузили материалы.", "No materials yet."),
    gen: t3("Ўйинли дарс", "Игровой урок", "Game lesson"),
    genAi: t3("СИ билан", "С ИИ", "With AI"),
    aiWait: t3("СИ дарс тузмоқда… 30–60 сония", "ИИ составляет урок… 30–60 секунд", "AI is building the lesson… 30–60 seconds"),
    del: t3("Ўчириш", "Удалить", "Delete"),
    delQ: t3("Материал базадан ўчирилсинми?", "Удалить материал из базы?", "Delete this material?"),
    lost: t3("Материал матни серверда йўқ — PDF ни қайта юкланг.", "Текста нет на сервере — загрузите PDF снова.", "The text is missing on the server — upload the PDF again."),
    s3: t3("3. Ўйинли дарс", "3. Игровой урок", "3. Game lesson"),
    acts: t3("Дарс босқичлари (босиб ёқинг/ўчиринг)", "Этапы урока (нажмите, чтобы вкл./выкл.)", "Lesson stages (tap to toggle)"),
    terms: t3("Калит атамалар ва таърифлар", "Ключевые термины и определения", "Key terms and definitions"),
    termsH: t3("Кроссворд, «Жуфтини топ» ва тест шу рўйхатдан тузилади. Хатони тузатиб, «Қайта тузиш»ни босинг.", "Кроссворд, «Найди пару» и тест строятся из этого списка. Исправьте и нажмите «Пересобрать».", "The crossword, matching and quiz are built from this list. Fix it and press Rebuild."),
    term: t3("Атама", "Термин", "Term"),
    def: t3("Таъриф", "Определение", "Definition"),
    addT: t3("+ Атама", "+ Термин", "+ Term"),
    rebuild: t3("Қайта тузиш", "Пересобрать", "Rebuild"),
    goal: t3("Дарс мақсади", "Цель урока", "Lesson goal"),
    run: t3("Дарсни ўтказиш", "Провести урок", "Run the lesson"),
    runH: t3("проектор ёки доска учун: таймер, жамоалар", "для проектора: таймер, команды", "for a projector: timer, teams"),
    student: t3("Ўқувчи кўриниши", "Вид ученика", "Student view"),
    publish: t3("Ўқувчиларга код бериш", "Дать ученикам код", "Give students a code"),
    update: t3("Коддаги дарсни янгилаш", "Обновить урок по коду", "Update the coded lesson"),
    sheet: t3("PDF варақа", "PDF-листок", "PDF worksheet"),
    saveG: t3("Сақлаш", "Сохранить", "Save"),
    savedG: t3("Дарс сақланди", "Урок сохранён", "Lesson saved"),
    codeT: t3("Дарс коди", "Код урока", "Lesson code"),
    codeH: t3("Ўқувчилар Экомун бош саҳифасидаги «Ўқитувчи дарси» бўлимига шу кодни киритади ёки ҳаволани/QR ни очади.", "Ученики вводят код в разделе «Урок учителя» на главной Ekomun или открывают ссылку/QR.", "Students enter this code under “Teacher's lesson” on the Ekomun home page or open the link/QR."),
    needAcc: t3("Код бериш учун ҳисобингизга киринг (18 ёшдан).", "Чтобы выдать код, войдите в аккаунт (18+).", "Sign in (18+) to give a code."),
    my: t3("4. Менинг ўйинли дарсларим", "4. Мои игровые уроки", "4. My game lessons"),
    myNone: t3("Ҳали ўйинли дарс сақланмаган.", "Пока нет сохранённых уроков.", "No saved lessons yet."),
    open: t3("Очиш", "Открыть", "Open"),
    results: t3("Натижалар", "Результаты", "Results"),
    noRes: t3("Ҳали натижа йўқ.", "Пока нет результатов.", "No results yet."),
    views: t3("очилди", "открыт", "opened"),
    copy: t3("Нусха олиш", "Копировать", "Copy"),
    copied: t3("Нусхаланди", "Скопировано", "Copied"),
    share: t3("Улашиш", "Поделиться", "Share"),
    // плеер
    start: t3("Бошлаш", "Начать", "Start"),
    next: t3("Кейинги", "Далее", "Next"),
    prev: t3("Олдинги", "Назад", "Back"),
    check: t3("Текшириш", "Проверить", "Check"),
    finish: t3("Якунлаш", "Завершить", "Finish"),
    close: t3("Ёпиш", "Закрыть", "Close"),
    min: t3("дақ", "мин", "min"),
    teams: t3("Жамоалар", "Команды", "Teams"),
    team: t3("жамоа", "команда", "team"),
    timer: t3("Таймер", "Таймер", "Timer"),
    full: t3("Тўлиқ экран", "Полный экран", "Full screen"),
    big: t3("Катта шрифт", "Крупный шрифт", "Large text"),
    score: t3("Балл", "Баллы", "Score"),
    done: t3("Дарс якунланди!", "Урок завершён!", "Lesson complete!"),
    yourName: t3("Исмингиз ва синфингиз", "Имя и класс", "Your name and class"),
    send: t3("Натижани ўқитувчига юбориш", "Отправить результат учителю", "Send result to the teacher"),
    sent: t3("Натижа ўқитувчига юборилди", "Результат отправлен учителю", "Result sent to the teacher"),
    again: t3("Қайта ўйнаш", "Сыграть снова", "Play again"),
    from: t3("Ўқитувчингиз тайёрлаган дарс", "Урок от вашего учителя", "A lesson from your teacher"),
    ugc: t3("Дарс ўқитувчи юклаган материалдан автоматик тузилган.", "Урок автоматически составлен из материала учителя.", "The lesson was generated from the teacher's material."),
    plan: t3("Дарс режаси", "План урока", "Lesson plan"),
    source: t3("Манба", "Источник", "Source"),
    right: t3("Тўғри!", "Верно!", "Correct!"),
    wrong: t3("Яна ўйлаб кўринг", "Подумайте ещё", "Think again"),
    trueB: t3("Тўғри", "Верно", "True"),
    falseB: t3("Нотўғри", "Неверно", "False"),
    answer: t3("Жавоб", "Ответ", "Answer"),
    sample: t3("Намуна", "Образец", "Example"),
    // кодни киритиш (#darskod)
    jTitle: t3("Ўқитувчи дарси", "Урок учителя", "Teacher's lesson"),
    jLead: t3("Ўқитувчингиз берган 6 белгили кодни киритинг — дарс ўйин шаклида очилади.", "Введите 6-значный код от учителя — урок откроется в игровой форме.", "Enter the 6-character code from your teacher — the lesson opens as a game."),
    jCode: t3("Дарс коди", "Код урока", "Lesson code"),
    jGo: t3("Дарсни очиш", "Открыть урок", "Open lesson"),
    jBad: t3("Код 6 та ҳарф ва рақамдан иборат (масалан, K7PX2M).", "Код состоит из 6 букв и цифр (например, K7PX2M).", "The code has 6 letters and digits (e.g. K7PX2M)."),
    jNet: t3("Дарсни очиш учун интернет керак.", "Для открытия урока нужен интернет.", "Internet is needed to open the lesson."),
    jRecent: t3("Яқинда очилган дарслар", "Недавно открытые уроки", "Recently opened"),
    jTeacher: t3("Ўқитувчимисиз? «Ўқитувчи устахонаси»да PDF дан ўйинли дарс тузинг.", "Вы учитель? Создайте игровой урок из PDF в «Мастерской учителя».", "Are you a teacher? Build a game lesson from a PDF in the Teacher workshop."),
    jToUstoz: t3("Устахонага ўтиш", "В мастерскую", "Open the workshop"),
    sinkL: [t3("1. Мавзу — 1 от", "1. Тема — 1 существительное", "1. Topic — one noun"), t3("2. Қандай? — 2 сифат", "2. Какой? — 2 прилагательных", "2. What is it like? — 2 adjectives"), t3("3. Нима қилади? — 3 феъл", "3. Что делает? — 3 глагола", "3. What does it do? — 3 verbs"), t3("4. Фикр — 4 сўзли гап", "4. Мысль — фраза из 4 слов", "4. A 4-word sentence"), t3("5. Хулоса — 1 сўз (синоним)", "5. Вывод — 1 слово (синоним)", "5. Summary — one word")],
    exitL: [t3("3 та янги билганим", "3 вещи, которые я узнал(а)", "3 things I learned"), t3("2 та қизиқ фикр", "2 интересные мысли", "2 interesting ideas"), t3("1 та саволим", "1 вопрос", "1 question I still have")],
    insM: [["v", "✓", t3("Биламан", "Знаю", "I knew it")], ["p", "+", t3("Янги", "Новое", "New")], ["m", "−", t3("Бошқача ўйлардим", "Думал(а) иначе", "I thought otherwise")], ["q", "?", t3("Саволим бор", "Есть вопрос", "I have a question")]],
    safety: t3("Хавфсизлик қоидалари", "Техника безопасности", "Safety rules"),
    safetyGen: [t3("Ҳимоя кўзойнаги, халат ва қўлқоп кийинг.", "Наденьте очки, халат и перчатки.", "Wear goggles, a lab coat and gloves."), t3("Моддаларни ҳидлаб ёки татиб кўрманг.", "Не нюхайте и не пробуйте вещества.", "Never smell or taste substances."), t3("Иш жойини тоза тутинг, тўкилганини дарҳол ўқитувчига айтинг.", "Держите место в чистоте, о проливах сразу сообщайте учителю.", "Keep the bench tidy and report spills at once."), t3("Ишдан сўнг қўлингизни совунлаб ювинг.", "После работы вымойте руки с мылом.", "Wash your hands with soap afterwards.")],
    vennAll: t3("Иккаласи", "Оба", "Both"),
    vennH: t3("Ҳар бир фикр қайси тушунчага тегишли: фақат A, фақат B ёки иккаласига?", "К чему относится каждая мысль: только A, только B или к обоим?", "Which concept does each statement fit: only A, only B or both?"),
    vennBlank: t3("Нуқталар (…) ўрнида қайси тушунча турибди: A, B ёки иккаласи ҳам?", "Какое понятие скрыто за многоточием (…): A, B или оба?", "Which concept is hidden behind the dots (…): A, B or both?"),
    picked: t3("Танланди — энди тармоқни босинг", "Выбрано — теперь нажмите на ветку", "Selected — now tap a branch"),
    stepsH: t3("Қадамни танлаб, ↑ ↓ билан жойини алмаштиринг.", "Выберите шаг и двигайте ↑ ↓.", "Pick a step and move it with ↑ ↓."),
    toolsH: t3("Бу машғулот учун керакли жиҳоз ва моддаларни танланг.", "Выберите оборудование и вещества, нужные для этого занятия.", "Choose the equipment and substances this session needs."),
    noXw: t3("Кроссворд учун атамалар етарли эмас.", "Недостаточно терминов для кроссворда.", "Not enough terms for a crossword."),
    xwOk: t3("Кроссворд ечилди!", "Кроссворд решён!", "Crossword solved!"),
    saved: t3("Сақланди", "Сохранено", "Saved"),
    sinkSave: t3("Синквейнни сақлаш", "Сохранить синквейн", "Save cinquain"),
    sinkNeed: t3("Камида 3 қаторни тўлдиринг.", "Заполните хотя бы 3 строки.", "Fill in at least 3 lines."),
    exitSave: t3("Жавобларни сақлаш", "Сохранить ответы", "Save answers"),
    offline: t3("Интернет йўқ — дарс шу қурилмага сақланди.", "Нет интернета — урок сохранён на устройстве.", "Offline — the lesson was saved on this device."),
    gameXp: t3("ўйинли дарс", "игровой урок", "game lesson")
  };
  /* Дарс босқичлари: белги, ранг, сарлавҳа, кўрсатма, тавсия этилган вақт (дақиқа) */
  const ACT = {
    insert: { i: "fa-book-open-reader", c: "#0f766e", t: t3("Инсерт: ўқи ва белгила", "Инсерт: читай и отмечай", "INSERT: read and mark"), h: t3("Ҳар бир фикрни ўқиб, белги қўйинг.", "Прочитайте каждую мысль и поставьте знак.", "Read each idea and mark it."), m: 6 },
    cluster: { i: "fa-diagram-project", c: "#7c3aed", t: t3("Кластер", "Кластер", "Cluster"), h: t3("Пастдаги сўзни танлаб, мос тармоққа жойлаштиринг.", "Выберите слово внизу и поместите на нужную ветку.", "Pick a word below and place it on the right branch."), m: 5 },
    match: { i: "fa-link", c: "#0369a1", t: t3("Жуфтини топ", "Найди пару", "Find the pair"), h: t3("Атамани, кейин унинг таърифини босинг.", "Нажмите термин, затем его определение.", "Tap a term, then its definition."), m: 4 },
    xw: { i: "fa-table-cells", c: "#b45309", t: t3("Кроссворд", "Кроссворд", "Crossword"), h: t3("Катакни босинг ва ёзинг. Савол рақамини босиб сўзни танланг.", "Нажмите клетку и пишите. Номер вопроса выбирает слово.", "Tap a cell and type. Tap a clue number to choose a word."), m: 8 },
    venn: { i: "fa-circle-half-stroke", c: "#be185d", t: t3("Венн диаграммаси", "Диаграмма Венна", "Venn diagram"), h: TX.vennH, m: 5 },
    tf: { i: "fa-scale-balanced", c: "#15803d", t: t3("Тўғри ёки нотўғри?", "Верно или неверно?", "True or false?"), h: t3("Фикрни ўқиб, тез жавоб беринг.", "Прочитайте и быстро ответьте.", "Read and answer quickly."), m: 3 },
    quiz: { i: "fa-list-check", c: "#1d4ed8", t: t3("Тест-ўйин", "Тест-игра", "Quiz game"), h: t3("Тўғри жавобни танланг.", "Выберите правильный ответ.", "Choose the right answer."), m: 6 },
    steps: { i: "fa-arrow-down-1-9", c: "#c2410c", t: t3("Қадамларни тартибла", "Расставь шаги по порядку", "Put the steps in order"), h: TX.stepsH, m: 4 },
    tools: { i: "fa-toolbox", c: "#4338ca", t: t3("Жиҳозлар саватчаси", "Корзина оборудования", "Equipment basket"), h: TX.toolsH, m: 3 },
    sink: { i: "fa-feather", c: "#0e7490", t: t3("Синквейн", "Синквейн", "Cinquain"), h: t3("Мавзуни 5 қаторли шеърда якунланг. Сўзларни босиб қўшишингиз мумкин.", "Подведите итог в 5 строках. Слова можно добавлять нажатием.", "Sum up the topic in a 5-line poem. Tap words to add them."), m: 5 },
    exit: { i: "fa-door-open", c: "#475569", t: t3("Чиқиш варақаси 3-2-1", "Лист выхода 3-2-1", "Exit ticket 3-2-1"), h: t3("Дарсдан нима олиб кетяпсиз?", "Что вы уносите с урока?", "What are you taking away from the lesson?"), m: 4 }
  };
  const ORDER = ["insert", "cluster", "match", "xw", "venn", "tf", "quiz", "steps", "tools", "sink", "exit"];
  const KIND_I = { darslik: "fa-book", amaliy: "fa-hand-holding-droplet", lab: "fa-flask" };
  const TEAM_C = ["#2563eb", "#dc2626", "#ca8a04", "#15803d"];

  /* ===================== Ҳолат ===================== */
  const KEY = "ekotalim:dars";
  let st = { mats: [], games: [], draft: null, recent: [], kind: "darslik", stg: "maktab" };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(st)); return true; } catch (e) {
      /* Хотира тўлса — маҳаллий матнларнинг энг эскисини қисқартирамиз */
      const big = st.mats.filter((m) => m.text && m.text.length > 20000).pop();
      if (big) { big.text = big.text.slice(0, 20000); try { localStorage.setItem(KEY, JSON.stringify(st)); return true; } catch (e2) { /* ignore */ } }
      return false;
    }
  };
  let srv = { ok: false, ai: false, aiLeft: 0, mats: [], games: [], checked: false, auth: false };
  let upload = null; // { title, kind, stg, file, pages, text, src, busy, pct, err, scan, fileObj }
  let pasteOpen = false;

  /* ===================== PDF / DOCX / TXT → матн ===================== */
  let pdfjs = null;
  async function pdfLib() {
    if (!pdfjs) {
      pdfjs = import("/vendor/pdfjs/pdf.min.mjs").then((m) => { m.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.min.mjs"; return m; });
      pdfjs.catch(() => { pdfjs = null; });
    }
    return pdfjs;
  }
  async function readPdf(buf, onPage) {
    const lib = await pdfLib();
    const doc = await lib.getDocument({ data: buf, isEvalSupported: false, disableFontFace: true, useSystemFonts: false }).promise;
    const n = Math.min(doc.numPages, 600);
    let title = "";
    try { const md = await doc.getMetadata(); title = (md && md.info && md.info.Title) || ""; } catch (e) { /* ignore */ }
    const pages = [];
    for (let p = 1; p <= n; p++) {
      const page = await doc.getPage(p);
      const tc = await page.getTextContent();
      const lines = [];
      let line = "", lastY = null, lastH = 10, lastX = null, gap = false;
      for (const it of tc.items) {
        if (typeof it.str !== "string") continue;
        const tf = it.transform || [];
        const y = tf.length ? tf[5] : lastY, x = tf.length ? tf[4] : null, h = Math.abs(tf[3] || it.height || lastH) || lastH;
        if (lastY != null && y != null && Math.abs(y - lastY) > Math.max(2, h * 0.5)) {
          lines.push({ s: line, gap }); gap = Math.abs(y - lastY) > h * 1.9; line = ""; lastX = null;
        }
        if (it.str) {
          /* Бир қатордаги алоҳида бўлаклар орасида бўш жой бўлса — сўзлар ёпишиб қолмасин */
          if (line && lastX != null && x != null && x - lastX > h * 0.15 && !/\s$/.test(line) && !/^\s/.test(it.str)) line += " ";
          line += it.str;
        }
        if (it.hasEOL) { lines.push({ s: line, gap }); gap = false; line = ""; lastY = null; lastX = null; continue; }
        if (y != null) { lastY = y; lastH = h; }
        if (x != null) lastX = x + (it.width || 0);
      }
      if (line) lines.push({ s: line, gap });
      pages.push(lines.map((l) => ({ s: l.s.replace(/\s+/g, " ").trim(), gap: l.gap })).filter((l) => l.s));
      page.cleanup();
      if (onPage) onPage(p, n);
    }
    try { doc.destroy(); } catch (e) { /* ignore */ }
    return { text: joinPages(pages), pages: doc.numPages, title };
  }
  /* Колонтитуллар (кўп саҳифада такрорланган биринчи/охирги қатор) ва бет рақамлари олиб ташланади,
     қаторлар хатбошиларга бирлаштирилади, сўз бўғин кўчирилиши (эколо-\nгия) тикланади */
  function joinPages(pages) {
    const freq = new Map();
    const keyOf = (s) => s.toLowerCase().replace(/\d+/g, "#");
    pages.forEach((ls) => { const seen = new Set(); [ls[0], ls[1], ls[ls.length - 1], ls[ls.length - 2]].forEach((l) => { if (l && !seen.has(l)) { seen.add(l); const k = keyOf(l.s); freq.set(k, (freq.get(k) || 0) + 1); } }); });
    const rep = (s) => pages.length >= 2 && s.length < 100 && (freq.get(keyOf(s)) || 0) >= Math.max(2, pages.length * 0.3);
    const all = [];
    pages.forEach((ls) => { ls.forEach((l, i) => { if (/^[-–—\s]*\d{1,4}[-–—\s]*$/.test(l.s)) return; if ((i < 2 || i >= ls.length - 2) && rep(l.s)) return; all.push(l); }); all.push({ s: "", gap: true, page: true }); });
    return joinLines(all);
  }
  const BULLET = /^\s*(?:\d{1,2}[.)]|[•●▪■◦○\-–—*]|[a-zа-я]\))\s+/i;
  function joinLines(lines) {
    const paras = [];
    let cur = "";
    /* Қисқа қатор (сарлавҳа ёки хатбоши охири) — ўртача қатор узунлигининг 60 % идан кам */
    const lens = lines.map((l) => l.s.length).filter((n) => n > 20).sort((a, b) => a - b);
    const med = lens.length ? lens[Math.floor(lens.length / 2)] : 80;
    const flush = () => { if (cur.trim()) paras.push(cur.trim()); cur = ""; };
    lines.forEach((l, i) => {
      const s = l.s;
      if (!s) { if (!l.page) flush(); return; }
      if (l.gap && cur && /[.!?:;»"”)]$/.test(cur.trim())) flush();
      if (BULLET.test(s) || /^(?:\d{1,2}(?:\.\d{1,2})*\.?\s+)?[A-ZА-ЯЎҚҒҲЁ][A-ZА-ЯЎҚҒҲЁ\s\-–,]{6,}$/.test(s)) flush();
      if (!cur) { cur = s; return; }
      const t = cur.trimEnd();
      if (/[\p{L}]-$/u.test(t) && /^[\p{Ll}]/u.test(s)) { cur = t.slice(0, -1) + s; return; }
      const prevShort = lines[i - 1] && lines[i - 1].s.length < med * 0.6 && !/[,\-–]$/.test(t);
      if (/^[\p{Lu}\d«"“]/u.test(s) && (prevShort || (/[.!?:;»"”]$/.test(t) && t.length < 120 && lines[i - 1] && lines[i - 1].s.length < 60))) { flush(); cur = s; return; }
      cur = t + " " + s;
    });
    flush();
    return paras.join("\n\n");
  }
  /* DOCX: ZIP ичидаги word/document.xml (DecompressionStream "deflate-raw" билан) */
  async function readDocx(buf) {
    const u8 = new Uint8Array(buf), dv = new DataView(buf);
    let eocd = -1;
    for (let i = u8.length - 22; i >= Math.max(0, u8.length - 70000); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw new Error("zip");
    const cnt = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    for (let k = 0; k < cnt; k++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
      const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nlen));
      if (name === "word/document.xml") {
        const lnl = dv.getUint16(off + 26, true), lxl = dv.getUint16(off + 28, true);
        const data = u8.subarray(off + 30 + lnl + lxl, off + 30 + lnl + lxl + csize);
        let xml;
        if (method === 0) xml = new TextDecoder().decode(data);
        else {
          if (typeof DecompressionStream !== "function") throw new Error("nodeflate");
          const s = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
          xml = await new Response(s).text();
        }
        const doc = new DOMParser().parseFromString(xml, "application/xml");
        const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
        const paras = [...doc.getElementsByTagNameNS(W, "p")].map((pp) => {
          let s = "";
          pp.querySelectorAll("*").forEach((n) => { if (n.namespaceURI !== W) return; if (n.localName === "t") s += n.textContent; else if (n.localName === "tab") s += " "; else if (n.localName === "br") s += "\n"; });
          const num = pp.getElementsByTagNameNS(W, "numPr").length ? "• " : "";
          return s.trim() ? num + s.trim() : "";
        }).filter(Boolean);
        return { text: paras.join("\n\n"), pages: 0, title: "" };
      }
      p += 46 + nlen + xlen + clen;
    }
    throw new Error("docx");
  }
  const b64 = (buf) => { const u8 = new Uint8Array(buf); let s = ""; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };

  /* ===================== Матн таҳлили ва ўйинли дарс генератори ===================== */
  const STOP_CYR = ("ва ҳам билан учун бу бир у улар бўлиб бўлган бўлади бўлса бўлиши бўлгани эса деб яъни ёки лекин аммо чунки агар каби кўра қадар сўнг кейин олдин ичида орқали ҳар барча жуда энг кўп кам ўз шу ушбу бундай шундай қандай қайси нима ким қачон қаерда нега мумкин керак эмас йўқ бор эди экан этиб этади этилади қилиш қилади қилинади қилиб қилган бўйича ҳақида тўғрисида асосида натижасида сабаб ҳисобланади иборат ташкил мавжуд ҳолда ҳолатда турли асосан айниқса масалан шунингдек жумладан бошқа баъзи ҳамда ҳамма бизнинг сизнинг уларнинг унинг ўзининг биз сиз мен сен бутун ҳозир ҳозирги янги катта кичик яхши ёмон муҳим асосий умумий фақат ҳатто балки хусусан алоҳида ортиқ кўплаб ҳамиша доим бири икки уч тўрт беш ўн юз минг бирга бирор ҳеч бирон тегишли боғлиқ қаратилган оид тўғри орасида ўртасида томонидан пайтда вақтда даражада ҳолатлар учраши ишлатилади фойдаланилади олинади берилади келтирилган кўрсатилган расм жадвал бет боб мавзу савол топшириқ мисол").split(" ");
  const STOP_RU = ("и в во не что он на я с со как а то все она так его но да ты к у же вы за бы по только ее её мне было вот от меня еще ещё нет о из ему когда даже ну ли если уже или ни быть был него до вас нибудь уж вам ведь там потом себя ничего ей может они тут где есть надо ней для мы тебя их чем была сам без будто чего раз тоже себе под будет ж тогда кто этот того потому этого какой совсем ним здесь этом один почти мой тем чтобы нее сейчас были куда всех никогда можно при два об другой хоть после над больше тот через эти нас про всего них какая много три эту моя перед лучше том нельзя такой им более всегда конечно между это также является являются которые который которая которых которое используется используют например следует данный данные данной рис таблица глава тема вопрос задание весьма очень этих этой этим таких такие такая")
    .split(" ");
  const STOP_EN = "the and of to in a is that for on are with as by be this which or from at an it its can was were has have not their these such also more than other into used use".split(" ");
  let STOP = null;
  function stopSet() {
    if (STOP) return STOP;
    STOP = new Set([...STOP_CYR, ...STOP_RU, ...STOP_EN]);
    STOP_CYR.forEach((w) => STOP.add(tr(w).toLowerCase().replace(/[ʻʼ'`’‘]/g, "'")));
    return STOP;
  }
  const SUF = {
    uzc: ["ларнинг", "лардаги", "ларидан", "ларига", "ларида", "ларини", "ларнинг", "лардан", "ларга", "ларда", "ларни", "лари", "лар", "нинг", "даги", "идан", "ига", "ида", "ини", "дан", "тан", "ни", "га", "ка", "қа", "да", "та", "си", "ги", "ки", "и"],
    uzl: ["larning", "lardagi", "laridan", "lariga", "larida", "larini", "lardan", "larga", "larda", "larni", "lari", "lar", "ning", "dagi", "idan", "iga", "ida", "ini", "dan", "tan", "ni", "ga", "ka", "qa", "da", "ta", "si", "gi", "ki", "i"],
    ru: ["ами", "ями", "ого", "его", "ому", "ему", "ыми", "ими", "иях", "ах", "ях", "ов", "ев", "ей", "ой", "ий", "ый", "ая", "яя", "ое", "ее", "ые", "ие", "ых", "их", "ом", "ем", "ам", "ям", "ия", "ию", "ии", "у", "ю", "а", "я", "ы", "и", "е", "о", "ь"],
    en: ["ations", "ation", "ings", "ing", "ies", "es", "s"]
  };
  const VERB = { uzc: /(?:ади|йди|ган|моқда|япти|ишади|ишган|майди|масдан|иб|ганда|гач|моқ|ди|миз)$/, uzl: /(?:adi|ydi|gan|moqda|yapti|ishadi|ishgan|maydi|masdan|ib|ganda|gach|moq|di|miz)$/, ru: /(?:ет|ют|ит|ят|ать|ять|ить|еть|ется|ются|ться|ется|ал|ала|али|ило|ыл|ешь)$/, en: /(?:ed|ly)$/ };
  const ADJ = { uzc: /(?:ли|сиз|вий|иий|ик|чан|кор)$/, uzl: /(?:li|siz|viy|iiy|ik|chan|kor)$/, ru: /(?:ый|ий|ой|ая|яя|ое|ее|ые|ие|ых|их|ого|его|ому|ым|им)$/, en: /(?:al|ic|ous|ive|ful|less)$/ };
  function detectLang(text) {
    const s = text.slice(0, 40000);
    const cyr = (s.match(/[Ѐ-ӿ]/g) || []).length, lat = (s.match(/[A-Za-z]/g) || []).length;
    if (cyr > lat) return /[ўқғҳЎҚҒҲ]/.test(s) ? "uzc" : (s.match(/[ыщъэ]/g) || []).length > s.length / 400 ? "ru" : "uzc";
    return /(?:o['ʻ’‘`]|g['ʻ’‘`]|\b(?:va|bilan|uchun|hamda|bo['ʻ’]lib)\b)/i.test(s) ? "uzl" : "en";
  }
  const normW = (w) => w.toLowerCase().replace(/[ʻʼ'`’‘]/g, "'");
  function stem(w, lg) {
    const min = lg === "ru" ? 4 : 3;
    for (const s of SUF[lg] || []) if (w.length - s.length >= min && w.endsWith(s)) return w.slice(0, -s.length);
    return w;
  }
  const WORD = /[\p{L}][\p{L}'ʻʼ’‘`\-]*[\p{L}]|[\p{L}]/gu;
  function sentencesOf(paras) {
    const out = [];
    paras.forEach((p, pi) => {
      const parts = p.replace(/\s+/g, " ").replace(/([.!?…])\s+(?=[\p{Lu}«"“\d(])/gu, "$1\u0001").split("\u0001");
      parts.forEach((s) => {
        s = s.trim();
        /* «Статья 5.», «5-modda.» каби модда сарлавҳаси ва БОШ ҲАРФЛИ сарлавҳалар гап ҳисобланмайди */
        s = s.replace(/^(?:статья|модда|modda|article)\s+\d+[.)]?\s*|^\d+[-‑](?:модда|modda)[.)]?\s*/iu, "");
        const ups = (s.match(/\p{Lu}/gu) || []).length, lows = (s.match(/\p{Ll}/gu) || []).length;
        if (ups > lows) return;
        /* «Хавфсизлик қоидалари: ...» каби ёрлиқ олиб ташланади */
        const lab = /^([^.:;!?]{3,40}):\s+(\S.*)$/u.exec(s);
        if (lab && lab[1].split(/\s+/).length <= 4) s = cap(lab[2]);
        if (s.length >= 25 && s.length <= 320 && (s.match(/\p{L}/gu) || []).length > s.length * 0.6) out.push({ s, pi }); });
    });
    return out;
  }
  const reEsc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  /* Атаманинг ўзи «…» билан яширилади, қўшимчаси қолади: «экологиянинг» → «…нинг» */
  const mask = (s, words) => {
    let r = s;
    words.filter(Boolean).forEach((w) => { r = r.replace(new RegExp("(^|[^\\p{L}])" + reEsc(w), "giu"), (m, a) => a + "…"); });
    return r;
  };
  function shuffle(a, r = Math.random) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rngOf(seed) { let h = 2166136261; for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
  const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
  const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s);

  const LAB_VOCAB = {
    uzc: ["колба", "пробирка", "пипетка", "бюретка", "мензурка", "ўлчов цилиндри", "кимёвий стакан", "воронка", "фильтр қоғоз", "штатив", "спиртовка", "термометр", "тарози", "микроскоп", "лупа", "Петри идиши", "чинни косача", "шиша таёқча", "индикатор қоғоз", "pH-метр", "спектрофотометр", "муфель печи", "қуритиш шкафи", "эксикатор", "дистилланган сув", "тигель", "ҳовонча", "ареометр", "секундомер", "электр плитка", "магнит аралаштиргич", "центрифуга", "предмет ойнаси", "қоплағич ойна", "колориметр", "кондуктометр", "намуна олгич", "ҳимоя кўзойнаги", "резина қўлқоп", "компас", "рулетка", "белкурак"],
    ru: ["колба", "пробирка", "пипетка", "бюретка", "мензурка", "мерный цилиндр", "химический стакан", "воронка", "фильтровальная бумага", "штатив", "спиртовка", "термометр", "весы", "микроскоп", "лупа", "чашка Петри", "фарфоровая чашка", "стеклянная палочка", "индикаторная бумага", "pH-метр", "спектрофотометр", "муфельная печь", "сушильный шкаф", "эксикатор", "дистиллированная вода", "тигель", "ступка", "ареометр", "секундомер", "электроплитка", "магнитная мешалка", "центрифуга", "предметное стекло", "покровное стекло", "колориметр", "кондуктометр", "пробоотборник", "защитные очки", "резиновые перчатки", "компас", "рулетка", "лопата"]
  };
  const vocab = (lg) => (lg === "ru" ? LAB_VOCAB.ru : lg === "uzl" || lg === "en" ? LAB_VOCAB.uzc.map((w) => tr(w)) : LAB_VOCAB.uzc);

  function analyse(text, meta) {
    const lg = detectLang(text);
    const paras = text.split(/\n\s*\n|\n(?=\s*(?:\d{1,2}[.)]|[•●▪■◦\-–—*])\s)/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
    const sents = sentencesOf(paras);
    const stop = stopSet();
    /* Сўзлар: ўзак → { n, forms } */
    const stems = new Map();
    const titleW = new Set(((meta.title || "").match(WORD) || []).map(normW));
    sents.forEach(({ s }) => (s.match(WORD) || []).forEach((raw, k) => {
      const w = normW(raw);
      if (w.length < 3 || stop.has(w) || /\d/.test(w) || w.includes("-") && w.length < 6) return;
      const st = stem(w, lg);
      if (st.length < 3 || stop.has(st)) return;
      let e = stems.get(st);
      if (!e) stems.set(st, e = { st, n: 0, forms: new Map(), cap: 0, verb: 0, adj: 0 });
      e.n++; e.forms.set(raw, (e.forms.get(raw) || 0) + 1);
      if (k > 0 && /^\p{Lu}/u.test(raw)) e.cap++;
      if (VERB[lg] && VERB[lg].test(w)) e.verb++;
      if (ADJ[lg] && ADJ[lg].test(w)) e.adj++;
    }));
    const display = (e) => {
      const forms = [...e.forms.entries()].sort((a, b) => b[1] - a[1]);
      const bare = forms.find(([f]) => normW(f) === e.st);
      let f = (bare || forms.reduce((a, b) => (b[0].length < a[0].length && b[1] * 2 >= a[1] ? b : a), forms[0]))[0];
      if (e.cap < e.n * 0.6) f = f.toLowerCase();
      e.bare = !!bare;
      return f;
    };
    /* Таърифлар */
    const defs = [];
    const P = lg === "ru"
      ? [[/^(.{2,48}?)\s+[—–-]\s+(?:это\s+)?(.{12,260})$/i, 1, 2], [/^(.{12,260}?)\s+называ(?:ется|ют|ются)\s+(.{3,48}?)\.?$/i, 2, 1], [/^под\s+(.{3,48}?)\s+понима(?:ют|ется)\s+(.{12,260})$/i, 1, 2]]
      : lg === "uzl" || lg === "en"
        ? [[/^(.{2,48}?)\s+[—–-]\s+(?:bu\s+)?(.{12,260})$/i, 1, 2], [/^(.{3,48}?)\s+deb\s+(.{12,260}?)\s+(?:aytiladi|ataladi|tushuniladi|yuritiladi)$/i, 1, 2], [/^(.{12,260}?)\s+(\S{3,30})\s+deb\s+(?:ataladi|aytiladi|yuritiladi|nomlanadi)/i, 2, 1], [/^(.{3,48}?)\s+deganda\s+(.{12,260}?)\s+tushuniladi/i, 1, 2], [/^(.{2,48}?)\s+(?:is|are)\s+(?:a|an|the)\s+(.{12,260})$/i, 1, 2]]
        : [[/^(.{2,48}?)\s+[—–-]\s+(?:бу\s+)?(.{12,260})$/i, 1, 2], [/^(.{3,48}?)\s+деб\s+(.{12,260}?)\s+(?:айтилади|аталади|тушунилади|юритилади)$/i, 1, 2], [/^(.{12,260}?)\s+(\S{3,30})\s+деб\s+(?:аталади|айтилади|юритилади|номланади)/i, 2, 1], [/^(.{3,48}?)\s+деганда\s+(.{12,260}?)\s+тушунилади/i, 1, 2]];
    sents.forEach(({ s }) => {
      for (const [re, ti, di] of P) {
        const m = re.exec(s.replace(/[.!?]+$/, ""));
        if (!m) continue;
        let term = m[ti].replace(/^[«"“(]+|[»"”),:]+$/g, "").trim(), def = m[di].trim();
        if (term.split(/\s+/).length > 4 || /\d{3,}/.test(term) || term.length < 3) continue;
        if (/^(бу|у|улар|bu|u|ular|это|он|она|они)$/i.test(term)) continue;
        def = cap(def.replace(/^[,:\s]+/, ""));
        if (!defs.some((d) => normW(d[0]) === normW(term))) defs.push([term, clip(def, 220)]);
        break;
      }
    });
    /* Калит сўзлар */
    const defStems = new Set(defs.flatMap(([t]) => (t.match(WORD) || []).map((w) => stem(normW(w), lg))));
    const scored = [...stems.values()].filter((e) => e.n >= 2 && e.verb < e.n * 0.5).map((e) => {
      let sc = e.n * (1 + Math.log(e.st.length));
      if (defStems.has(e.st)) sc += 12;
      if ([...titleW].some((w) => normW(w).startsWith(e.st))) sc += 8;
      if (e.adj > e.n * 0.6) sc *= lg === "ru" ? 0.1 : 0.35;
      return { e, sc, w: display(e) };
    }).sort((a, b) => b.sc - a.sc);
    /* Ўзбекчада фақат қўшимчасиз шакли матнда учраган сўз калит бўлади («суви», «ҳисобига» эмас — «сув», «ҳисоб») */
    const kw = scored.filter((x) => { const n = (x.w.match(/\p{L}/gu) || []).length; return (n >= 4 || (n === 3 && x.e.n >= 4)) && (lg === "ru" || lg === "en" || x.e.bare); }).slice(0, 30);
    const adjs = [...stems.values()].filter((e) => e.adj >= e.n * 0.6 && e.n >= 1 && e.st.length >= 4).sort((a, b) => b.n - a.n).slice(0, 10).map((e) => display(e).toLowerCase());
    let verbs = [];
    const vSeen = new Set();
    sents.forEach(({ s }) => (s.match(WORD) || []).forEach((raw) => {
      const w = normW(raw);
      let v = "";
      /* «-лади, -ради, -нади, -шади, -йди» ва буйруқ «-инг» шакллари → «-моқ» (масалан, тозалайди → тозаламоқ, солинг → солмоқ) */
      if (lg === "uzc" && /(?:[лрнш]ади|йди)$/.test(w) && w.length >= 6) v = w.replace(/(?:йди|ади)$/, "") + "моқ";
      else if (lg === "uzc" && /[^н]и?нг$/.test(w) && !/нинг$/.test(w) && w.length >= 5) v = w.replace(/и?нг$/, "") + "моқ";
      else if (lg === "uzl" && /(?:[lrn]adi|shadi|ydi)$/.test(w) && w.length >= 6) v = w.replace(/(?:ydi|adi)$/, "") + "moq";
      else if (lg === "uzl" && /[^n]i?ng$/.test(w) && !/ning$/.test(w) && w.length >= 5) v = w.replace(/i?ng$/, "") + "moq";
      else if (lg === "ru" && /(?:ает|яет|ует|ит|ят|ют)$/.test(w) && w.length >= 6 && !stop.has(w)) v = w;
      else if (lg === "en" && /(?:es|s)$/.test(w) && VERB.en && w.length >= 6) v = "";
      if (v && v.length >= 6 && !/^(?:қилмоқ|этмоқ|бўлмоқ|бормоқ|келмоқ|олмоқ|бермоқ|қолмоқ|турмоқ|айтилмоқ|аталмоқ|ҳисобланмоқ|ишлатилмоқ|qilmoq|etmoq|bo'lmoq|bormoq|kelmoq|olmoq|bermoq|qolmoq|turmoq|aytilmoq|atalmoq|hisoblanmoq|ishlatilmoq)$/.test(v) && !vSeen.has(v)) { vSeen.add(v); verbs.push(v); }
    }));
    verbs = verbs.slice(0, 10);
    return { lg, paras, sents, kw, defs, adjs, verbs };
  }

  function buildGame(text, meta, opts = {}) {
    const A = analyse(text, meta);
    const { lg, sents, kw, defs } = A;
    const isM = meta.stg !== "uni";
    const R = rngOf(meta.title + text.length);
    const nT = isM ? 8 : 12, nQ = isM ? 6 : 10, nTF = isM ? 5 : 6, nIns = isM ? 6 : 8;
    const kwW = kw.map((x) => x.w);
    const sentWith = (w) => sents.filter(({ s }) => !((s.match(/,/g) || []).length >= 4) && new RegExp("(^|[^\\p{L}])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "iu").test(s));
    const short = (arr) => arr.slice().sort((a, b) => Math.abs(a.s.length - 110) - Math.abs(b.s.length - 110));
    /* Атамалар: аввал таърифлар, кейин калит сўз + энг мос гап */
    const terms = [];
    const used = new Set();
    defs.forEach(([t, d]) => { if (terms.length < nT && !used.has(normW(t))) { used.add(normW(t)); terms.push([t, mask(d, [t].concat(t.split(/\s+/).filter((w) => w.length >= 5).map((w) => stem(normW(w), lg))))]); } });
    for (const w of kwW) {
      if (terms.length >= nT) break;
      if (used.has(normW(w)) || [...used].some((u) => u.includes(normW(w)) || normW(w).includes(u))) continue;
      const ss = short(sentWith(w));
      if (!ss.length) continue;
      used.add(normW(w));
      terms.push([w, clip(mask(ss[0].s, [w]), 200)]);
    }
    /* Инсерт: энг мазмунли гаплар (калит сўзлар зичлиги), матн тартибида */
    const kwSet = new Map(kw.map((x, i) => [x.e.st, 30 - i]));
    const sScore = sents.map((o, i) => {
      const ws = (o.s.match(WORD) || []).map((w) => stem(normW(w), lg));
      let sc = 0; ws.forEach((w) => { sc += kwSet.get(w) || 0; });
      if (/\d/.test(o.s)) sc += 6;
      return { i, sc: sc / Math.sqrt(ws.length + 4), o };
    }).sort((a, b) => b.sc - a.sc);
    const listy = (s) => (s.match(/,/g) || []).length >= 4 || !/[.!?…»"”)]$/.test(s);
    const insert = sScore.slice(0, nIns * 2).filter((x) => x.o.s.length <= 240 && !listy(x.o.s)).slice(0, nIns).sort((a, b) => a.i - b.i).map((x) => x.o.s);
    /* Кластер */
    const bareTitle = String(meta.title || "").replace(/^\s*(?:§\s*\d+\.?|\d+\s*[-–]?\s*(?:лаборатория\s+иши|амалий\s+машғулот|амалий\s+иш|мавзу|дарс|laboratoriya\s+ishi|amaliy\s+mashg'ulot|mavzu|dars|лабораторная\s+работа|практическое\s+занятие|тема|урок)|(?:лабораторная\s+работа|практическая\s+работа)\s*№?\s*\d+)[.:]?\s*/i, "").trim() || meta.title || "";
    const center = clip(bareTitle || (kwW[0] ? cap(kwW[0]) : ""), 48);
    const cb = [];
    kwW.forEach((w) => {
      if (cb.length >= (isM ? 5 : 7) || normW(center).includes(normW(w))) return;
      const ss = short(sentWith(w));
      if (ss.length) cb.push([w, clip(mask(ss[0].s, [w]), 160)]);
    });
    /* Тест */
    const quiz = [];
    const distract = (right, pool) => shuffle(pool.filter((x) => normW(x) !== normW(right) && !normW(x).includes(normW(right)) && !normW(right).includes(normW(x))), R).slice(0, 3);
    const termWords = terms.map((t) => t[0]);
    const Q = {
      def: lg === "ru" ? (d) => `«${d}» — о каком понятии речь?` : lg === "uzl" ? (d) => `«${d}» — bu qaysi tushuncha?` : lg === "en" ? (d) => `“${d}” — which term is this?` : (d) => `«${d}» — бу қайси тушунча?`,
      cloze: lg === "ru" ? (s) => `Вставьте пропущенное слово: ${s}` : lg === "uzl" ? (s) => `Tushirib qoldirilgan so'zni toping: ${s}` : lg === "en" ? (s) => `Fill in the blank: ${s}` : (s) => `Тушириб қолдирилган сўзни топинг: ${s}`
    };
    terms.slice(0, Math.ceil(nQ / 2)).forEach(([t, d]) => {
      const ds = distract(t, termWords.concat(kwW));
      if (ds.length < 3) return;
      const a = shuffle([t, ...ds], R);
      quiz.push({ q: Q.def(clip(d, 170)), a, c: a.indexOf(t) });
    });
    const usedS = new Set();
    for (const x of kw) {
      if (quiz.length >= nQ) break;
      const ss = short(sentWith(x.w)).filter((o) => !usedS.has(o.s) && o.s.length < 220);
      if (!ss.length) continue;
      usedS.add(ss[0].s);
      const ds = distract(x.w, kwW.concat(termWords));
      if (ds.length < 3) continue;
      const blank = ss[0].s.replace(new RegExp("(^|[^\\p{L}])" + x.w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "iu"), "$1_____");
      if (blank === ss[0].s) continue;
      const a = shuffle([x.w, ...ds], R);
      quiz.push({ q: Q.cloze(blank), a, c: a.indexOf(x.w) });
    }
    /* Тўғри / нотўғри: ярми асл гап, ярми калит сўзи алмаштирилган гап */
    const tf = [];
    const tfPool = shuffle(sScore.slice(0, 30).map((x) => x.o.s).filter((s) => s.length <= 200 && !listy(s) && !insert.includes(s)), R);
    for (const s of tfPool.concat(shuffle(insert, R))) {
      if (tf.length >= nTF) break;
      if (tf.some(([x]) => x === s)) continue;
      if (tf.length % 2 === 0) { tf.push([s, 1]); continue; }
      const hit = kwW.find((w) => new RegExp("(^|[^\\p{L}])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "iu").test(s));
      const other = hit && kwW.find((w) => w !== hit && normW(w).length >= 4 && !s.toLowerCase().includes(normW(w)));
      if (!hit || !other) continue;
      tf.push([s.replace(new RegExp("(^|[^\\p{L}])(" + reEsc(hit) + ")", "iu"), (m, a, h) => a + (/^\p{Lu}/u.test(h) ? cap(other) : other)), 0]);
    }
    /* Венн: битта гапда кам учрайдиган иккита калит сўз */
    let venn = null;
    for (let i = 0; i < Math.min(8, kwW.length) && !venn; i++) for (let j = i + 1; j < Math.min(10, kwW.length) && !venn; j++) {
      const a = kwW[i], b = kwW[j];
      if (normW(a).includes(normW(b)) || normW(b).includes(normW(a))) continue;
      const sa = sentWith(a), sb = sentWith(b);
      const onlyA = sa.filter((x) => !sb.includes(x)), onlyB = sb.filter((x) => !sa.includes(x)), both = sa.filter((x) => sb.includes(x));
      if (onlyA.length < 2 || onlyB.length < 2) continue;
      const pick = (arr, z, n) => short(arr).filter((x) => x.s.length < 200).slice(0, n).map((x) => [clip(mask(x.s, [a, b]), 170), z]);
      const items = pick(onlyA, "a", 3).concat(pick(onlyB, "b", 3), pick(both, "ab", 2));
      if (items.length >= 4) venn = { a: cap(a), b: cap(b), blank: 1, items: shuffle(items, R).slice(0, isM ? 6 : 8) };
    }
    /* Амалий / лаборатория: қадамлар, жиҳозлар, хавфсизлик */
    const steps = [];
    const P2 = A.paras;
    const headRe = /(иш(?:ни)?\s+бажариш\s+тартиби|ишнинг\s+бориши|бажариш\s+тартиби|тажриба(?:ни)?\s+(?:ўтказиш\s+)?тартиби|ish(?:ni)?\s+bajarish\s+tartibi|ishning\s+borishi|tajriba(?:ni)?\s+(?:o'tkazish\s+)?tartibi|ход\s+работы|порядок\s+(?:выполнения|проведения)|методика\s+проведения|procedure)/i;
    let from = P2.findIndex((p) => headRe.test(normW(p)));
    const runAt = (k) => { const out = []; let n = 1; for (let i = k; i < P2.length && out.length < 12; i++) { const m = /^\s*(\d{1,2})[.)]\s+(.+)$/.exec(P2[i]); if (m && +m[1] === n) { out.push(clip(m[2].replace(/([.!?])\s+/, "$1\u0001").split("\u0001")[0], 200)); n++; } else if (out.length) break; } return out; };
    if (from >= 0) { for (let k = from; k < Math.min(P2.length, from + 6) && !steps.length; k++) steps.push(...runAt(k)); }
    if (steps.length < 3) { steps.length = 0; for (let k = 0; k < P2.length && steps.length < 3; k++) { const r = runAt(k); if (r.length >= 3) steps.push(...r); } }
    if (steps.length < 3 && from >= 0 && meta.kind !== "darslik") { steps.length = 0; P2.slice(from + 1, from + 8).forEach((p) => { if (steps.length < 8 && p.length < 260 && !headRe.test(p)) steps.push(clip(p.replace(BULLET, ""), 200)); }); }
    const low = normW(text);
    const tools = [];
    const toolRe = /(?:керакли|зарур)\s+(?:асбоб|жиҳоз|материал|реактив)[^:\n]{0,40}:|асбоб(?:лар)?\s+ва\s+(?:жиҳоз|реактив|материал)[^:\n]{0,30}:|(?:kerakli|zarur)\s+(?:asbob|jihoz|material|reaktiv)[^:\n]{0,40}:|asbob(?:lar)?\s+va\s+(?:jihoz|reaktiv|material)[^:\n]{0,30}:|(?:оборудование|приборы|реактивы|материалы)(?:\s+и\s+\S+){0,2}\s*:/i;
    P2.some((p, k) => {
      const m = toolRe.exec(p);
      if (!m) return false;
      let rest = p.slice(m.index + m[0].length).trim();
      if (rest.length < 5 && P2[k + 1]) rest = P2[k + 1];
      rest.split(/\.\s/)[0].split(/[,;•\n]|\s(?=\d+[.)]\s)/).map((x) => x.replace(BULLET, "").replace(/[.]+$/, "").trim()).filter((x) => x.length >= 3 && x.length <= 60).slice(0, 12).forEach((x) => tools.push(x));
      return tools.length >= 2;
    });
    const V = vocab(lg);
    /* Луғатдаги жиҳоз матнда тўлиқ (охирги 2 ҳарфисиз) учраса қўшилади: «фильтр қоғоз» — «фильтрлари» эмас */
    const inText = (v) => { const n = normW(v); return low.includes(n.slice(0, Math.max(4, n.length - 2))); };
    V.forEach((v) => { if (tools.length < 10 && inText(v) && !tools.some((t) => normW(t).includes(normW(v).slice(0, 5)))) tools.push(v); });
    const extra = shuffle(V.filter((v) => !inText(v) && !low.includes(normW(v).split(" ")[0].slice(0, 5)) && !tools.some((t) => normW(t).includes(normW(v).slice(0, 4)))), R).slice(0, Math.max(3, Math.min(6, tools.length)));
    const safety = sents.filter(({ s }) => /(хавфсизлик|эҳтиёт|xavfsizlik|ehtiyot|безопасност|осторожн|запрещается|тақиқланади|man etiladi)/i.test(s)).slice(0, 4).map((x) => clip(x.s, 220));
    /* Синквейн */
    const topic = cap(kwW[0] || meta.title || "");
    const s4 = short(sentWith(kwW[0] || "")).find((o) => (o.s.match(WORD) || []).length <= 9);
    const sink = { ex: [topic, A.adjs.slice(0, 2).join(", "), A.verbs.slice(0, 3).join(", "), s4 ? clip(s4.s, 120) : "", cap(kwW[1] || "")], adj: A.adjs.slice(0, 6), verb: A.verbs.slice(0, 6) };
    const goal = lg === "ru" ? `Освоить тему «${meta.title}»: ключевые понятия и их связь.` : lg === "uzl" ? `«${meta.title}» mavzusini o'zlashtirish: asosiy tushunchalar va ularning bog'liqligi.` : lg === "en" ? `Master “${meta.title}”: key concepts and how they connect.` : `«${meta.title}» мавзусини ўзлаштириш: асосий тушунчалар ва уларнинг ўзаро боғлиқлиги.`;
    const g = {
      v: 1, id: opts.id || uid(), t: meta.title, stg: isM ? "maktab" : "uni", kind: meta.kind || "darslik", goal, src: meta.file || meta.title, lang: lg,
      terms, insert, cluster: cb.length >= 2 ? { c: center, b: cb } : null, venn, sink, quiz, tf, steps, tools: tools.slice(0, 10), extra, safety
    };
    g.acts = defaultActs(g);
    return g;
  }
  function defaultActs(g) {
    const has = { insert: g.insert.length >= 3, cluster: !!g.cluster, match: g.terms.length >= 3, xw: xwWords(g).length >= 3 && typeof EkoCross !== "undefined", venn: !!g.venn, tf: g.tf.length >= 3, quiz: g.quiz.length >= 3, steps: g.steps.length >= 3, tools: g.tools.length >= 2, sink: true, exit: true };
    const lab = g.kind !== "darslik";
    const order = lab ? ["insert", "tools", "steps", "match", "xw", "quiz", "tf", "sink", "exit"] : ["insert", "cluster", "match", "xw", "venn", "tf", "quiz", "sink", "exit"];
    if (!lab && has.steps) order.splice(6, 0, "steps");
    if (lab && has.venn) order.splice(5, 0, "venn");
    return order.filter((a) => has[a]);
  }
  /* Кроссворд учун: битта сўзли атамалар (3–14 ҳарф) */
  function xwWords(g) {
    const out = [];
    const seen = new Set();
    g.terms.forEach(([t, d]) => {
      const ws = t.split(/\s+/);
      const lg = g.lang || "uzc";
      /* Кўп сўзли атамада бош сўз: ўзбекчада охирги сўз (эгалик қўшимчасиз), русчада — сифат бўлмаган энг узун сўз */
      let one = ws[0];
      if (ws.length > 1) {
        if (lg === "uzc") one = ws[ws.length - 1].replace(/(?:си|и)$/i, (m, i, w) => (w.length - m.length >= 5 ? "" : m));
        else if (lg === "uzl") one = ws[ws.length - 1].replace(/(?:si|i)$/i, (m, i, w) => (w.length - m.length >= 5 ? "" : m));
        else one = ws.filter((w) => !(ADJ[lg] && ADJ[lg].test(w.toLowerCase()))).sort((a, b) => b.length - a.length)[0] || ws.slice().sort((a, b) => b.length - a.length)[0];
      }
      const letters = (one.match(/\p{L}/gu) || []).length;
      const k = normW(one);
      if (letters < 3 || letters > 14 || seen.has(k)) return;
      seen.add(k);
      out.push([one.toUpperCase(), clip(ws.length === 1 ? d : `${mask(t, [one])}: ${d}`, 110)]);
    });
    return out.slice(0, 10);
  }
  /* Атамалар таҳрирлангандан кейин: жуфт, кроссворд ва таъриф саволлари янгиланади */
  function rebuildFromTerms(g) {
    const R = rngOf(g.t + g.terms.length);
    const tw = g.terms.map((t) => t[0]);
    const old = g.quiz.filter((q) => !/(қайси тушунча|qaysi tushuncha|о каком понятии|which term)/i.test(q.q));
    const lg = g.lang || "uzc";
    const fmt = lg === "ru" ? (d) => `«${d}» — о каком понятии речь?` : lg === "uzl" ? (d) => `«${d}» — bu qaysi tushuncha?` : lg === "en" ? (d) => `“${d}” — which term is this?` : (d) => `«${d}» — бу қайси тушунча?`;
    const dq = [];
    g.terms.slice(0, 6).forEach(([t, d]) => { const ds = shuffle(tw.filter((x) => x !== t), R).slice(0, 3); if (ds.length < 3) return; const a = shuffle([t, ...ds], R); dq.push({ q: fmt(clip(d, 170)), a, c: a.indexOf(t) }); });
    g.quiz = dq.concat(old).slice(0, 12);
    g.acts = g.acts.filter((a) => a !== "match" && a !== "xw").concat([]);
    const base = defaultActs(g);
    ["match", "xw"].forEach((a) => { if (base.includes(a) && !g.acts.includes(a)) g.acts.splice(Math.min(g.acts.length, base.indexOf(a)), 0, a); });
    return g;
  }

  /* ===================== Сервер ===================== */
  async function J(path, opt = {}) {
    const r = await fetch(api(path), Object.assign({ credentials: "include", headers: opt.body ? { "Content-Type": "application/json" } : {} }, opt));
    let d = {}; try { d = await r.json(); } catch (e) { /* ignore */ }
    if (!r.ok) { const e = new Error(d.error || ("HTTP " + r.status)); e.status = r.status; e.data = d; throw e; }
    return d;
  }
  async function loadServer() {
    if (!hasServer()) { srv.checked = true; return; }
    try {
      const d = await J("/api/ustoz/mats");
      srv.ok = true; srv.auth = true; srv.mats = d.mats || []; srv.ai = !!d.ai; srv.aiLeft = d.aiLeft || 0;
      try { srv.games = (await J("/api/ustoz/games")).games || []; } catch (e) { srv.games = []; }
    } catch (e) { srv.ok = false; srv.auth = e.status !== 401; srv.mats = []; srv.games = []; }
    srv.checked = true;
  }

  /* ===================== Ўқитувчи панели ===================== */
  let panelEl = null;
  const seg = (name, cur, map, icons) => `<div class="ed-seg" role="radiogroup">${Object.entries(map).map(([k, v]) => `<label class="ed-segb${cur === k ? " on" : ""}"><input type="radio" name="${name}" value="${k}"${cur === k ? " checked" : ""} class="sr-only">${icons ? `<i class="fa-solid ${icons[k]}" aria-hidden="true"></i> ` : ""}${H(v)}</label>`).join("")}</div>`;
  function matsAll() {
    const list = srv.ok ? srv.mats.map((m) => Object.assign({ where: "srv" }, m)) : [];
    return list.concat(st.mats.map((m) => Object.assign({ where: "loc" }, m)));
  }
  function renderTeacher(panel) {
    panelEl = panel;
    if (!panel.dataset.edBound) { bindPanel(panel); panel.dataset.edBound = "1"; }
    const u = upload;
    const mats = matsAll();
    const g = st.draft;
    if (g) curLang = g.lang || "uzc";
    panel.innerHTML = `<p class="muted ed-lead">${H(TX.lead)}</p>
      <div class="ed-grid">
        <section class="ps-box ed-up">
          <h3><span class="ed-num" style="--c:#0f766e"><i class="fa-solid fa-file-arrow-up" aria-hidden="true"></i></span> ${H(TX.s1)}</h3>
          <label class="ed-drop${u && u.busy ? " busy" : ""}" data-ed-drop>
            <input type="file" accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" data-ed-file class="sr-only">
            <i class="fa-solid fa-file-pdf" aria-hidden="true"></i>
            <b>${H(TX.drop)}</b>
            <span class="btn btn-primary btn-sm">${H(TX.choose)}</span>
          </label>
          ${u && u.busy ? `<div class="ed-prog" role="progressbar" aria-valuenow="${u.pct || 0}" aria-valuemin="0" aria-valuemax="100"><i style="width:${u.pct || 0}%"></i></div><p class="small muted" aria-live="polite">${esc(u.msg || L(TX.reading))}</p>` : ""}
          ${u && u.err ? `<p class="ed-err" role="alert">${esc(u.err)}</p>` : ""}
          ${u && u.scan ? `<div class="ps-btns">${srv.ok && srv.ai ? `<button type="button" class="btn btn-ghost btn-sm" data-ed-ocr><i class="fa-solid fa-robot" aria-hidden="true"></i> ${H(TX.ocr)}</button>` : ""}<button type="button" class="btn btn-ghost btn-sm" data-ed-paste>${H(TX.paste)}</button></div>` : ""}
          <button type="button" class="linkish small" data-ed-paste aria-expanded="${pasteOpen}">${H(TX.paste)}</button>
          ${pasteOpen ? `<textarea class="ed-paste" rows="7" maxlength="400000" data-ed-ptext placeholder="${H(TX.pasteP)}">${esc(u && u.src === "text" ? u.text : "")}</textarea>` : ""}
          ${u && u.text && !u.busy ? `<div class="ed-meta">
            <p class="small"><i class="fa-solid ${u.src === "text" ? "fa-keyboard" : "fa-file-lines"}" aria-hidden="true"></i> <b>${esc(u.file || L(TX.paste))}</b> · ${u.pages ? `${u.pages} ${H(TX.page)} · ` : ""}${u.text.length.toLocaleString("ru-RU")} ${H(TX.chars)} · ${(u.text.match(/\S+/g) || []).length.toLocaleString("ru-RU")} ${H(TX.words)}</p>
            <details><summary class="small">${H(TX.sample)}</summary><p class="ed-preview">${esc(u.text.slice(0, 900))}${u.text.length > 900 ? "…" : ""}</p></details>
          </div>` : ""}
          <form class="ed-form" data-ed-form>
            <label>${H(TX.title)}<input type="text" name="title" maxlength="140" required value="${esc(u ? u.title : "")}"></label>
            <fieldset><legend>${H(TX.kind)}</legend>${seg("kind", (u && u.kind) || st.kind, TX.kinds, KIND_I)}</fieldset>
            <fieldset><legend>${H(TX.stage)}</legend>${seg("stg", (u && u.stg) || st.stg, TX.stages, { maktab: "fa-school", uni: "fa-graduation-cap" })}</fieldset>
            <button type="submit" class="btn btn-primary"${u && u.text && !u.busy ? "" : " disabled"}><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> ${H(TX.make)}</button>
          </form>
        </section>
        <section class="ps-box ed-base">
          <h3><span class="ed-num" style="--c:#4338ca"><i class="fa-solid fa-database" aria-hidden="true"></i></span> ${H(TX.base)}</h3>
          <p class="small muted">${srv.ok ? `<i class="fa-solid fa-cloud" aria-hidden="true"></i> ${H(TX.baseSrv)}` : `<i class="fa-solid fa-mobile-screen" aria-hidden="true"></i> ${H(TX.baseLoc)}${hasServer() && !srv.auth && window.EkoGate ? ` <button type="button" class="linkish" data-ed-signin>${H(TX.signin)}</button>` : ""}`}</p>
          ${mats.length ? `<ul class="ed-mats">${mats.map((m) => `<li>
            <span class="ed-mi" style="--c:${m.kind === "lab" ? "#7c3aed" : m.kind === "amaliy" ? "#c2410c" : "#0f766e"}"><i class="fa-solid ${KIND_I[m.kind] || "fa-book"}" aria-hidden="true"></i></span>
            <div><b>${esc(m.title)}</b><small class="muted">${H(TX.kinds[m.kind] || TX.kinds.darslik)} · ${H(TX.stages[m.stg] || TX.stages.maktab)}${m.pages ? ` · ${m.pages} ${H(TX.page)}` : ""} · ${fmtDate(m.at)}${m.where === "srv" ? ` · <i class="fa-solid fa-cloud" title="server" aria-hidden="true"></i>` : ""}</small></div>
            <div class="ed-mact"><button type="button" class="btn btn-primary btn-sm" data-ed-gen="${m.where}:${m.id}"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> ${H(TX.gen)}</button>${srv.ok && srv.ai ? `<button type="button" class="btn btn-ghost btn-sm" data-ed-ai="${m.where}:${m.id}" title="${esc(srv.aiLeft)}"><i class="fa-solid fa-robot" aria-hidden="true"></i> ${H(TX.genAi)}</button>` : ""}<button type="button" class="btn btn-ghost btn-sm ed-icon" data-ed-mdel="${m.where}:${m.id}" aria-label="${H(TX.del)}" title="${H(TX.del)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></div></li>`).join("")}</ul>` : `<p class="muted">${H(TX.baseNone)}</p>`}
        </section>
      </div>
      ${g ? editorHtml(g) : ""}
      ${myGamesHtml()}`;
    if (g && g.code) drawQr(panel.querySelector("[data-ed-qr]"), joinLink(g.code));
  }
  function editorHtml(g) {
    return `<section class="ps-box ed-edit" data-ed-editor>
      <h3><span class="ed-num" style="--c:#b45309"><i class="fa-solid fa-gamepad" aria-hidden="true"></i></span> ${H(TX.s3)}: ${C(g.t)}</h3>
      <div class="ed-tags"><span class="ed-tag"><i class="fa-solid ${KIND_I[g.kind]}" aria-hidden="true"></i> ${H(TX.kinds[g.kind])}</span><span class="ed-tag"><i class="fa-solid ${g.stg === "uni" ? "fa-graduation-cap" : "fa-school"}" aria-hidden="true"></i> ${H(TX.stages[g.stg])}</span>${g.ai ? `<span class="ed-tag ai"><i class="fa-solid fa-robot" aria-hidden="true"></i> AI</span>` : ""}<span class="ed-tag"><i class="fa-regular fa-clock" aria-hidden="true"></i> ~${g.acts.reduce((s, a) => s + ACT[a].m, 0)} ${H(TX.min)}</span></div>
      <label class="ed-goal">${H(TX.goal)}<input type="text" maxlength="400" data-ed-goal value="${esc(g.goal)}"></label>
      <p class="small muted">${H(TX.acts)}</p>
      <div class="ed-acts">${ORDER.map((a) => { const on = g.acts.includes(a), ok = available(g, a); return `<button type="button" class="ed-act${on ? " on" : ""}" style="--c:${ACT[a].c}" data-ed-act="${a}" aria-pressed="${on}"${ok ? "" : " disabled"}><span class="ed-ai2"><i class="fa-solid ${ACT[a].i}" aria-hidden="true"></i></span><span>${H(ACT[a].t)}<small>${countOf(g, a)}</small></span></button>`; }).join("")}</div>
      <details class="ed-terms"${g.terms.length < 4 ? " open" : ""}><summary><b>${H(TX.terms)}</b> <small class="muted">(${g.terms.length})</small></summary>
        <p class="small muted">${H(TX.termsH)}</p>
        <div class="ed-tlist">${g.terms.map(([t, d], i) => `<div class="ed-trow" data-ti="${i}"><input type="text" maxlength="40" value="${esc(t)}" aria-label="${H(TX.term)} ${i + 1}" data-ed-tt><input type="text" maxlength="240" value="${esc(d)}" aria-label="${H(TX.def)} ${i + 1}" data-ed-td><button type="button" class="btn btn-ghost btn-sm ed-icon" data-ed-tdel="${i}" aria-label="${H(TX.del)}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>`).join("")}</div>
        <div class="ps-btns">${g.terms.length < 16 ? `<button type="button" class="btn btn-ghost btn-sm" data-ed-tadd>${H(TX.addT)}</button>` : ""}<button type="button" class="btn btn-ghost btn-sm" data-ed-rebuild><i class="fa-solid fa-rotate" aria-hidden="true"></i> ${H(TX.rebuild)}</button></div>
      </details>
      <div class="ed-run">
        <button type="button" class="btn btn-primary ed-big" data-ed-run="teach"><i class="fa-solid fa-person-chalkboard" aria-hidden="true"></i> ${H(TX.run)}<small>${H(TX.runH)}</small></button>
        <button type="button" class="btn btn-ghost" data-ed-run="student"><i class="fa-solid fa-mobile-screen-button" aria-hidden="true"></i> ${H(TX.student)}</button>
        <button type="button" class="btn btn-ghost" data-ed-publish><i class="fa-solid fa-qrcode" aria-hidden="true"></i> ${H(g.code ? TX.update : TX.publish)}</button>
        <button type="button" class="btn btn-ghost" data-ed-sheet><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.sheet)}</button>
        <button type="button" class="btn btn-ghost" data-ed-saveg><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> ${H(TX.saveG)}</button>
      </div>
      ${g.code ? codeBox(g.code) : ""}
    </section>`;
  }
  const joinLink = (code) => `${site()}/?eku=${code}#darskod`;
  function codeBox(code) {
    const url = joinLink(code);
    return `<div class="ed-code"><div><p class="small muted">${H(TX.codeT)}</p><p class="ed-codev" aria-label="${H(TX.codeT)}">${code.split("").map((c) => `<span>${c}</span>`).join("")}</p><p class="small muted">${H(TX.codeH)}</p>
      <div class="us-link"><input type="text" readonly value="${esc(url)}" data-sel aria-label="URL"><button type="button" class="btn btn-ghost btn-sm" data-copy="${esc(url)}">${H(TX.copy)}</button>${navigator.share ? `<button type="button" class="btn btn-ghost btn-sm" data-share="${esc(url)}">${H(TX.share)}</button>` : ""}</div></div>
      <div class="ed-qr" data-ed-qr></div></div>`;
  }
  function available(g, a) {
    return { insert: g.insert.length >= 2, cluster: !!g.cluster, match: g.terms.length >= 3, xw: typeof EkoCross !== "undefined" && xwWords(g).length >= 3, venn: !!g.venn, tf: g.tf.length >= 2, quiz: g.quiz.length >= 2, steps: g.steps.length >= 3, tools: g.tools.length >= 2, sink: true, exit: true }[a];
  }
  function countOf(g, a) {
    const n = { insert: g.insert.length, cluster: g.cluster ? g.cluster.b.length : 0, match: Math.min(g.terms.length, matchN(g)), xw: xwWords(g).length, venn: g.venn ? g.venn.items.length : 0, tf: g.tf.length, quiz: g.quiz.length, steps: g.steps.length, tools: g.tools.length }[a];
    return n != null ? `${n} · ${ACT[a].m} ${L(TX.min)}` : `${ACT[a].m} ${L(TX.min)}`;
  }
  const matchN = (g) => (g.stg === "uni" ? 8 : 6);
  function myGamesHtml() {
    const loc = st.games;
    const remote = srv.ok ? srv.games.filter((x) => !loc.some((l) => l.game.code === x.code)) : [];
    if (!loc.length && !remote.length) return `<section class="ps-box"><h3><span class="ed-num" style="--c:#be185d"><i class="fa-solid fa-trophy" aria-hidden="true"></i></span> ${H(TX.my)}</h3><p class="muted">${H(TX.myNone)}</p></section>`;
    const sg = (code) => srv.games.find((x) => x.code === code);
    return `<section class="ps-box"><h3><span class="ed-num" style="--c:#be185d"><i class="fa-solid fa-trophy" aria-hidden="true"></i></span> ${H(TX.my)}</h3><ul class="ed-mats">
      ${loc.map((x) => { const s = x.game.code && sg(x.game.code); return `<li><span class="ed-mi" style="--c:#b45309"><i class="fa-solid fa-gamepad" aria-hidden="true"></i></span><div><b>${C(x.game.t)}</b><small class="muted">${H(TX.stages[x.game.stg])} · ${x.game.acts.length} · ${fmtDate(x.at)}${x.game.code ? ` · <b class="ed-mono">${x.game.code}</b>` : ""}${s ? ` · ${s.views} ${H(TX.views)} · ${s.results} ${H(TX.results).toLowerCase()}` : ""}</small></div>
        <div class="ed-mact"><button type="button" class="btn btn-primary btn-sm" data-ed-gopen="${x.id}">${H(TX.open)}</button><button type="button" class="btn btn-ghost btn-sm" data-ed-grun="${x.id}" aria-label="${H(TX.run)}" title="${H(TX.run)}"><i class="fa-solid fa-play" aria-hidden="true"></i></button>${x.game.code && srv.ok ? `<button type="button" class="btn btn-ghost btn-sm" data-ed-res="${x.game.code}">${H(TX.results)}</button>` : ""}<button type="button" class="btn btn-ghost btn-sm ed-icon" data-ed-gdel="${x.id}" aria-label="${H(TX.del)}" title="${H(TX.del)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></div>
        <div class="ed-res" data-ed-resbox="${x.game.code || ""}"></div></li>`; }).join("")}
      ${remote.map((x) => `<li><span class="ed-mi" style="--c:#0369a1"><i class="fa-solid fa-cloud" aria-hidden="true"></i></span><div><b>${esc(x.t)}</b><small class="muted">${H(TX.stages[x.stg] || TX.stages.maktab)} · ${fmtDate(x.at)} · <b class="ed-mono">${x.code}</b> · ${x.views} ${H(TX.views)} · ${x.results} ${H(TX.results).toLowerCase()}</small></div>
        <div class="ed-mact"><button type="button" class="btn btn-primary btn-sm" data-ed-ropen="${x.code}">${H(TX.open)}</button><button type="button" class="btn btn-ghost btn-sm" data-ed-res="${x.code}">${H(TX.results)}</button><button type="button" class="btn btn-ghost btn-sm ed-icon" data-ed-rdel="${x.code}" aria-label="${H(TX.del)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></div>
        <div class="ed-res" data-ed-resbox="${x.code}"></div></li>`).join("")}
    </ul></section>`;
  }
  const rerender = () => {
    if (!panelEl || !panelEl.isConnected) return;
    const y = window.scrollY;
    renderTeacher(panelEl); window.scrollTo(0, y);
  };
  function formMeta() {
    const f = panelEl && panelEl.querySelector("[data-ed-form]");
    if (!f) return {};
    return { title: f.title.value.trim().slice(0, 140), kind: (f.querySelector("[name=kind]:checked") || {}).value || "darslik", stg: (f.querySelector("[name=stg]:checked") || {}).value || "maktab" };
  }
  function keepForm() { if (!upload) upload = {}; Object.assign(upload, formMeta()); const p = panelEl && panelEl.querySelector("[data-ed-ptext]"); if (p && p.value.trim()) { upload.text = p.value; upload.src = "text"; upload.file = ""; upload.pages = 0; } }

  async function onFile(file) {
    if (!file) return;
    keepForm();
    const name = file.name || "file";
    const ext = (name.split(".").pop() || "").toLowerCase();
    if (file.size > 40 * 1024 * 1024) { upload = Object.assign(upload || {}, { err: L(TX.tooBig), busy: false }); rerender(); return; }
    upload = { title: (upload && upload.title) || name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").slice(0, 140), kind: upload && upload.kind, stg: upload && upload.stg, file: name, busy: true, pct: 2, text: "", fileObj: file };
    rerender();
    try {
      const buf = await file.arrayBuffer();
      let r;
      if (ext === "pdf" || file.type === "application/pdf") r = await readPdf(buf, (p, n) => { upload.pct = Math.round((p / n) * 100); upload.msg = `${L(TX.reading)}: ${p} / ${n} ${L(TX.page)}`; const bar = panelEl && panelEl.querySelector(".ed-prog i"); if (bar) { bar.style.width = upload.pct + "%"; const m = bar.parentElement.nextElementSibling; if (m) m.textContent = upload.msg; } });
      else if (ext === "docx") r = await readDocx(buf);
      else if (ext === "txt" || /^text\//.test(file.type)) r = { text: new TextDecoder().decode(buf).replace(/\r\n?/g, "\n"), pages: 0, title: "" };
      else throw new Error("type");
      const text = r.text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
      const scan = ext === "pdf" && text.replace(/\s/g, "").length < Math.max(200, (r.pages || 1) * 60);
      upload = Object.assign(upload, { busy: false, pct: 100, text: scan ? "" : text, pages: r.pages, src: "pdf", scan, err: scan ? L(TX.noText) : "" });
      /* Сарлавҳа: PDF метамаълумоти ёки матннинг биринчи қисқа хатбошиси (файл номи «scan_01», «lab» каби бўлса) */
      const fromName = name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").slice(0, 140);
      const first = (text.split(/\n\s*\n/)[0] || "").replace(/\s+/g, " ").trim();
      if (upload.title === fromName) {
        if (r.title && r.title.length > 4 && !/^(microsoft|untitled|документ|document|slide|презентация)/i.test(r.title)) upload.title = r.title.slice(0, 140);
        else if (first && first.length <= 140 && (fromName.length < 14 || !/\p{L}{4}/u.test(fromName) || /^(scan|img|doc|file|lab|dars|скан|\d)/i.test(fromName))) upload.title = first.replace(/[.:]$/, "");
      }
      if (!scan) upload.fileObj = null;
    } catch (e) {
      upload = Object.assign(upload, { busy: false, err: L(TX.badFile) });
      if (window.console) console.warn("EkoDars read", e);
    }
    rerender();
  }
  async function ocr() {
    if (!upload || !upload.fileObj) return;
    upload.busy = true; upload.pct = 30; upload.msg = L(TX.ocrWait); upload.err = ""; rerender();
    try {
      const d = await J("/api/ustoz/ocr", { method: "POST", body: JSON.stringify({ pdf: b64(await upload.fileObj.arrayBuffer()), name: upload.file }) });
      upload = Object.assign(upload, { busy: false, text: d.text, scan: false, src: "ocr", fileObj: null });
      srv.aiLeft = d.left;
    } catch (e) { upload = Object.assign(upload, { busy: false, err: e.message }); }
    rerender();
  }
  async function makeFromUpload() {
    keepForm();
    const u = upload;
    if (!u || !u.text || u.text.trim().length < 200) { toast(TX.short); return; }
    if (!u.title) { const i = panelEl.querySelector("[data-ed-form] [name=title]"); if (i) i.focus(); return; }
    st.kind = u.kind; st.stg = u.stg;
    const meta = { title: u.title, kind: u.kind, stg: u.stg, file: u.file, pages: u.pages || 0 };
    let where = "loc", id = uid();
    if (srv.ok) {
      try { const d = await J("/api/ustoz/mats", { method: "POST", body: JSON.stringify(Object.assign({ text: u.text, src: u.src || "pdf" }, meta)) }); srv.mats.unshift(d.mat); where = "srv"; id = d.mat.id; } catch (e) { toast(e.message); if (e.status !== 409 && e.status !== 413) where = "loc"; else return; }
    }
    if (where === "loc") { st.mats.unshift(Object.assign({ id, at: Date.now(), chars: u.text.length, text: u.text.slice(0, 200000) }, meta)); st.mats = st.mats.slice(0, 20); }
    st.draft = buildGame(u.text, meta);
    st.draft.mat = where + ":" + id;
    upload = null; pasteOpen = false;
    if (!save()) toast(TX.offline);
    xpOnce("ed_first", 10, TX.tab);
    rerender();
    const ed = panelEl.querySelector("[data-ed-editor]"); if (ed) ed.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function matText(ref) {
    const [where, id] = ref.split(":");
    if (where === "loc") { const m = st.mats.find((x) => x.id === id); return m ? { text: m.text || "", meta: m } : null; }
    const d = await J("/api/ustoz/mats/" + id);
    return { text: d.text, meta: d.mat };
  }
  async function genFrom(ref, ai) {
    try {
      const r = await matText(ref);
      if (!r || !r.text) { toast(TX.lost); return; }
      const meta = { title: r.meta.title, kind: r.meta.kind, stg: r.meta.stg, file: r.meta.file };
      if (ai) {
        toast(TX.aiWait);
        const b = panelEl.querySelector(`[data-ed-ai="${ref}"]`); if (b) { b.disabled = true; b.innerHTML = `<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>`; }
        const d = await J("/api/ustoz/ai", { method: "POST", body: JSON.stringify({ mat: ref.split(":")[1] }) });
        const g = Object.assign(d.game, { id: uid(), lang: detectLang(r.text), ai: true, mat: ref });
        g.extra = g.extra && g.extra.length ? g.extra : shuffle(vocab(g.lang).filter((v) => !g.tools.some((t) => normW(t).includes(normW(v).slice(0, 4)))), Math.random).slice(0, 5);
        g.acts = defaultActs(g);
        st.draft = g; srv.aiLeft = d.left;
      } else { st.draft = buildGame(r.text, meta); st.draft.mat = ref; }
      save(); rerender();
      const ed = panelEl.querySelector("[data-ed-editor]"); if (ed) ed.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) { toast(e.status === 410 ? L(TX.lost) : e.message); rerender(); }
  }
  function readEditor() {
    const g = st.draft; if (!g || !panelEl) return;
    const goal = panelEl.querySelector("[data-ed-goal]"); if (goal) g.goal = goal.value.trim().slice(0, 400);
    const rows = [...panelEl.querySelectorAll(".ed-trow")];
    if (rows.length) g.terms = rows.map((r) => [r.querySelector("[data-ed-tt]").value.trim().slice(0, 40), r.querySelector("[data-ed-td]").value.trim().slice(0, 240)]).filter(([t, d]) => t || d);
  }
  function saveGame(g) {
    const i = st.games.findIndex((x) => x.id === g.id);
    const rec = { id: g.id, at: Date.now(), game: JSON.parse(JSON.stringify(g)) };
    if (i >= 0) st.games[i] = rec; else st.games.unshift(rec);
    st.games = st.games.slice(0, 40);
    save();
  }
  async function publish() {
    readEditor();
    const g = st.draft; if (!g) return;
    if (!srv.ok) { toast(TX.needAcc); if (window.EkoGate && hasServer()) EkoGate.open("signin"); return; }
    try {
      const d = await J("/api/ustoz/games", { method: "POST", body: JSON.stringify({ game: g, code: g.code || "" }) });
      g.code = d.code; saveGame(g);
      try { srv.games = (await J("/api/ustoz/games")).games || []; } catch (e) { /* ignore */ }
      xpOnce("ed_pub", 10, TX.publish);
      rerender();
      const box = panelEl.querySelector(".ed-code"); if (box) box.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) { toast(e.message); }
  }
  async function showResults(code, box) {
    if (!box) return;
    if (box.innerHTML) { box.innerHTML = ""; return; }
    try {
      const d = await J(`/api/ustoz/games/${code}/results`);
      box.innerHTML = d.results.length ? `<table class="ed-table"><thead><tr><th>#</th><th>${H(TX.yourName)}</th><th>${H(TX.score)}</th><th>%</th><th>📅</th></tr></thead><tbody>${d.results.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.name)}</td><td>${r.score} / ${r.max}</td><td><b>${Math.round((r.score / r.max) * 100)}</b></td><td>${new Date(r.at).toLocaleString("ru-RU")}</td></tr>`).join("")}</tbody></table>` : `<p class="small muted">${H(TX.noRes)} (${d.views} ${H(TX.views)})</p>`;
    } catch (e) { box.innerHTML = `<p class="ed-err">${esc(e.message)}</p>`; }
  }
  function sheet() {
    readEditor();
    const g = st.draft; if (!g || !window.EkoPDF) return;
    const q = g.quiz.slice(0, 12);
    const tmp = document.createElement("div");
    tmp.style.cssText = "position:absolute;left:-9999px;top:0;width:800px";
    tmp.innerHTML = `<div><h1>${C(g.t)}</h1><p>${C(g.goal)}</p>
      ${g.terms.length ? `<h3>${H(ACT.match.t)}</h3><ol>${g.terms.map(([t, d]) => `<li>${C(d)} — ____________</li>`).join("")}</ol><p class="small">${g.terms.map(([t]) => C(t)).sort().join(" · ")}</p>` : ""}
      ${g.steps.length ? `<h3>${H(ACT.steps.t)}</h3><ol>${shuffle(g.steps, rngOf(g.t)).map((s) => `<li>☐ ${C(s)}</li>`).join("")}</ol>` : ""}
      ${g.tf.length ? `<h3>${H(ACT.tf.t)}</h3><ol>${g.tf.map(([s]) => `<li>${C(s)} — ☐ ${H(TX.trueB)} ☐ ${H(TX.falseB)}</li>`).join("")}</ol>` : ""}
      ${q.length ? `<h3>${H(ACT.quiz.t)}</h3>${q.map((x, i) => `<div class="q" data-q="${i}"><p>${i + 1}. ${C(x.q)}</p><ol type="A">${x.a.map((a) => `<li class="opt">${C(a)}</li>`).join("")}</ol></div>`).join("")}` : ""}
      <h3>${H(ACT.sink.t)}</h3><ol>${TX.sinkL.map((l) => `<li>${H(l)}: ________________________</li>`).join("")}</ol>
      <h3>${H(ACT.exit.t)}</h3><ol>${TX.exitL.map((l) => `<li>${H(l)}: ________________________</li>`).join("")}</ol></div>`;
    document.body.appendChild(tmp);
    EkoPDF.save(tmp.firstElementChild, { title: g.t, file: "Ekomun-varaq-" + g.t, answers: q.map((x) => x.c) }).finally(() => tmp.remove());
  }

  /* QR (vendor/qrcode.js) */
  let qrLib = null;
  function loadQr() {
    if (window.qrcode) return Promise.resolve(window.qrcode);
    if (!qrLib) qrLib = new Promise((ok, no) => { const s = document.createElement("script"); s.src = "/vendor/qrcode.js"; s.onload = () => (window.qrcode ? ok(window.qrcode) : no()); s.onerror = no; document.head.appendChild(s); });
    return qrLib;
  }
  async function drawQr(box, url, size = 168) {
    if (!box) return;
    try {
      const qr = (await loadQr())(0, "M"); qr.addData(url); qr.make();
      const n = qr.getModuleCount(), sz = 4, pad = 4, W = (n + pad * 2) * sz;
      let d = "";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${(c + pad) * sz} ${(r + pad) * sz}h${sz}v${sz}h-${sz}z`;
      box.innerHTML = `<svg viewBox="0 0 ${W} ${W}" width="${size}" height="${size}" role="img" aria-label="QR"><rect width="${W}" height="${W}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
    } catch (e) { box.innerHTML = ""; }
  }

  function bindPanel(panel) {
    panel.addEventListener("click", (e) => {
      const T = (sel) => e.target.closest(sel);
      let b;
      if (T("[data-ed-paste]")) { keepForm(); pasteOpen = !pasteOpen; rerender(); const t = panelEl.querySelector("[data-ed-ptext]"); if (t) t.focus(); return; }
      if (T("[data-ed-signin]")) { if (window.EkoGate) EkoGate.open("signin"); return; }
      if (T("[data-ed-ocr]")) return void ocr();
      if ((b = T("[data-ed-gen]"))) return void genFrom(b.dataset.edGen, false);
      if ((b = T("[data-ed-ai]"))) return void genFrom(b.dataset.edAi, true);
      if ((b = T("[data-ed-mdel]"))) {
        if (!confirm(L(TX.delQ))) return;
        const [where, id] = b.dataset.edMdel.split(":");
        if (where === "loc") { st.mats = st.mats.filter((x) => x.id !== id); save(); rerender(); }
        else J("/api/ustoz/mats/" + id, { method: "DELETE" }).then(() => { srv.mats = srv.mats.filter((x) => x.id !== id); rerender(); }, (err) => toast(err.message));
        return;
      }
      if ((b = T("[data-ed-act]"))) { readEditor(); const a = b.dataset.edAct, g = st.draft; g.acts = g.acts.includes(a) ? g.acts.filter((x) => x !== a) : ORDER.filter((x) => x === a || g.acts.includes(x)); if (!g.acts.length) g.acts = [a]; save(); rerender(); return; }
      if (T("[data-ed-tadd]")) { readEditor(); st.draft.terms.push(["", ""]); save(); rerender(); const rows = panelEl.querySelectorAll(".ed-trow [data-ed-tt]"); if (rows.length) rows[rows.length - 1].focus(); return; }
      if ((b = T("[data-ed-tdel]"))) { readEditor(); st.draft.terms.splice(+b.dataset.edTdel, 1); save(); rerender(); return; }
      if (T("[data-ed-rebuild]")) { readEditor(); st.draft.terms = st.draft.terms.filter(([t, d]) => t && d); rebuildFromTerms(st.draft); save(); rerender(); toast(TX.saved); return; }
      if ((b = T("[data-ed-run]"))) { readEditor(); save(); play(st.draft, { mode: b.dataset.edRun }); return; }
      if (T("[data-ed-publish]")) return void publish();
      if (T("[data-ed-sheet]")) return void sheet();
      if (T("[data-ed-saveg]")) { readEditor(); saveGame(st.draft); toast(TX.savedG); rerender(); return; }
      if ((b = T("[data-ed-gopen]"))) { const x = st.games.find((y) => y.id === b.dataset.edGopen); if (x) { st.draft = JSON.parse(JSON.stringify(x.game)); save(); rerender(); const ed = panelEl.querySelector("[data-ed-editor]"); if (ed) ed.scrollIntoView({ behavior: "smooth" }); } return; }
      if ((b = T("[data-ed-grun]"))) { const x = st.games.find((y) => y.id === b.dataset.edGrun); if (x) play(x.game, { mode: "teach" }); return; }
      if ((b = T("[data-ed-gdel]"))) { if (!confirm(L(TX.delQ))) return; st.games = st.games.filter((y) => y.id !== b.dataset.edGdel); save(); rerender(); return; }
      if ((b = T("[data-ed-res]"))) return void showResults(b.dataset.edRes, b.closest("li").querySelector("[data-ed-resbox]"));
      if ((b = T("[data-ed-ropen]"))) { J("/api/ustoz/g/" + b.dataset.edRopen).then((d) => { const g = Object.assign(d.game, { id: uid(), code: d.code }); st.draft = g; saveGame(g); rerender(); }, (err) => toast(err.message)); return; }
      if ((b = T("[data-ed-rdel]"))) { if (!confirm(L(TX.delQ))) return; const code = b.dataset.edRdel; J("/api/ustoz/games/" + code, { method: "DELETE" }).then(() => { srv.games = srv.games.filter((x) => x.code !== code); rerender(); }, (err) => toast(err.message)); return; }
    });
    panel.addEventListener("change", (e) => {
      const f = e.target.closest("[data-ed-file]");
      if (f && f.files && f.files[0]) { onFile(f.files[0]); f.value = ""; return; }
      const r = e.target.closest(".ed-seg input");
      if (r) { r.closest(".ed-seg").querySelectorAll(".ed-segb").forEach((l) => l.classList.toggle("on", l.contains(r) )); keepForm(); return; }
      if (e.target.closest("[data-ed-goal], .ed-trow input")) { readEditor(); save(); }
    });
    panel.addEventListener("input", (e) => {
      const p = e.target.closest("[data-ed-ptext]");
      if (p) { const v = p.value; upload = Object.assign(upload || {}, formMeta(), { text: v, src: "text", file: "", pages: 0, err: "", scan: false }); const btn = panelEl.querySelector("[data-ed-form] [type=submit]"); if (btn) btn.disabled = v.trim().length < 200; }
    });
    panel.addEventListener("submit", (e) => { if (e.target.closest("[data-ed-form]")) { e.preventDefault(); makeFromUpload(); } });
    const drop = (e) => { const d = e.target.closest && e.target.closest("[data-ed-drop]"); if (!d) return; e.preventDefault(); d.classList.toggle("over", e.type === "dragover"); if (e.type === "drop" && e.dataTransfer && e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); };
    ["dragover", "dragleave", "drop"].forEach((t) => panel.addEventListener(t, drop));
  }

  /* ===================== Дарс плеери (ўтказиш режими ва ўқувчи) ===================== */
  let P = null; // { g, mode, i, scores:{}, max:{}, teams, timer, dlg }
  function play(g, opts = {}) {
    if (!g) return;
    curLang = g.lang || "uzc";
    if (P && P.dlg) closePlayer();
    const dlg = document.createElement("dialog");
    dlg.className = "ed-play";
    dlg.setAttribute("aria-label", g.t);
    dlg.dataset.notr = "";
    document.body.appendChild(dlg);
    P = { g, mode: opts.mode || "student", code: opts.code || g.code || "", i: -1, scores: {}, max: {}, done: {}, teams: opts.mode === "teach" ? [0, 0] : null, timer: { left: 0, run: false, h: 0 }, dlg, big: opts.mode === "teach", by: opts.by || "" };
    dlg.addEventListener("cancel", (e) => { e.preventDefault(); closePlayer(); });
    dlg.addEventListener("click", onPlayClick);
    dlg.addEventListener("keydown", (e) => { if (e.target.closest("input,textarea")) return; if (e.key === "ArrowRight") go(P.i + 1); else if (e.key === "ArrowLeft") go(P.i - 1); });
    dlg.showModal();
    document.documentElement.classList.add("ed-lock");
    go(-1);
  }
  function closePlayer() {
    if (!P) return;
    clearInterval(P.timer.h);
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) { /* ignore */ }
    if (P.xw) { try { P.xw.destroy(); } catch (e) { /* ignore */ } }
    P.dlg.close(); P.dlg.remove(); P = null;
    document.documentElement.classList.remove("ed-lock");
  }
  const acts = () => P.g.acts.filter((a) => available(P.g, a));
  function total() { const a = acts(); let s = 0, m = 0; a.forEach((k) => { s += P.scores[k] || 0; m += P.max[k] || 0; }); return { s, m }; }
  function frame(body) {
    const a = acts(), g = P.g, i = P.i;
    const cur = i >= 0 && i < a.length ? a[i] : null;
    const tt = total();
    P.dlg.classList.toggle("big", !!P.big);
    P.dlg.classList.toggle("teach", P.mode === "teach");
    P.dlg.innerHTML = `<div class="ed-shell" style="--c:${cur ? ACT[cur].c : "#047857"}">
      <header class="ed-top">
        <span class="ed-brand" aria-hidden="true"><i class="fa-solid fa-leaf"></i></span>
        <div class="ed-ttl"><b>${C(g.t)}</b><small>${cur ? `${i + 1} / ${a.length} · ${H(ACT[cur].t)}` : P.i >= a.length ? H(TX.done) : H(TX.plan)}</small></div>
        <div class="ed-tools">
          ${P.mode === "teach" ? `<div class="ed-timer${P.timer.run ? " run" : ""}${P.timer.left <= 30 && P.timer.left > 0 && P.timer.run ? " low" : ""}" role="timer" aria-label="${H(TX.timer)}"><button type="button" data-p="timer" aria-label="${H(TX.timer)}"><i class="fa-solid ${P.timer.run ? "fa-pause" : "fa-play"}" aria-hidden="true"></i></button><span data-tleft>${mmss(P.timer.left)}</span><button type="button" data-p="treset" aria-label="↺"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></button></div>` : `<span class="ed-pts" title="${H(TX.score)}"><i class="fa-solid fa-star" aria-hidden="true"></i> ${tt.s}</span>`}
          <button type="button" class="ed-tb${P.big ? " on" : ""}" data-p="big" aria-pressed="${!!P.big}" title="${H(TX.big)}" aria-label="${H(TX.big)}"><i class="fa-solid fa-font" aria-hidden="true"></i></button>
          ${document.fullscreenEnabled ? `<button type="button" class="ed-tb" data-p="full" title="${H(TX.full)}" aria-label="${H(TX.full)}"><i class="fa-solid ${document.fullscreenElement ? "fa-compress" : "fa-expand"}" aria-hidden="true"></i></button>` : ""}
          <button type="button" class="ed-tb" data-p="close" title="${H(TX.close)}" aria-label="${H(TX.close)}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </div>
      </header>
      <nav class="ed-steps" aria-label="${H(TX.plan)}">${a.map((k, j) => `<button type="button" class="ed-st${j === i ? " on" : ""}${P.done[k] ? " ok" : ""}" style="--c:${ACT[k].c}" data-p="go" data-j="${j}" aria-current="${j === i ? "step" : "false"}" title="${H(ACT[k].t)}"><i class="fa-solid ${P.done[k] ? "fa-check" : ACT[k].i}" aria-hidden="true"></i><span>${H(ACT[k].t)}</span></button>`).join("")}</nav>
      <div class="ed-prog2" aria-hidden="true"><i style="width:${a.length ? Math.max(0, Math.min(100, ((i + 1) / a.length) * 100)) : 0}%"></i></div>
      <main class="ed-main">${body}</main>
      ${P.teams ? `<aside class="ed-teams" aria-label="${H(TX.teams)}">${P.teams.map((v, k) => `<div class="ed-team" style="--tc:${TEAM_C[k]}"><b>${k + 1}-${H(TX.team)}</b><span class="ed-tv">${v}</span><div><button type="button" data-p="tm" data-k="${k}" data-d="-1" aria-label="−1">−</button><button type="button" data-p="tm" data-k="${k}" data-d="1" aria-label="+1">+</button></div></div>`).join("")}${P.teams.length < 4 ? `<button type="button" class="ed-tadd" data-p="tadd" aria-label="+ ${H(TX.team)}"><i class="fa-solid fa-user-plus" aria-hidden="true"></i></button>` : ""}</aside>` : ""}
      <footer class="ed-foot">
        <button type="button" class="btn btn-ghost" data-p="prev"${i < 0 ? " disabled" : ""}><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> <span>${H(TX.prev)}</span></button>
        <span class="ed-fsc">${cur && P.max[cur] ? `${H(TX.score)}: <b>${P.scores[cur] || 0} / ${P.max[cur]}</b>` : ""}</span>
        ${i < a.length ? `<button type="button" class="btn btn-primary" data-p="next">${H(i < 0 ? TX.start : i === a.length - 1 ? TX.finish : TX.next)} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>` : `<button type="button" class="btn btn-primary" data-p="close">${H(TX.close)}</button>`}
      </footer></div>`;
  }
  const mmss = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;
  function go(i) {
    if (!P) return;
    const a = acts();
    i = Math.max(-1, Math.min(a.length, i));
    if (P.xw) { try { P.xw.destroy(); } catch (e) { /* ignore */ } P.xw = null; }
    P.i = i;
    if (P.mode === "teach") { clearInterval(P.timer.h); P.timer.run = false; P.timer.left = i >= 0 && i < a.length ? ACT[a[i]].m * 60 : 0; }
    if (i < 0) frame(introHtml());
    else if (i >= a.length) { frame(finalHtml()); finalBind(); }
    else { const k = a[i]; frame(`<section class="ed-card"><h2><span class="ed-ic" style="--c:${ACT[k].c}"><i class="fa-solid ${ACT[k].i}" aria-hidden="true"></i></span>${H(ACT[k].t)}</h2><p class="ed-how">${H(ACT[k].h)}</p><div class="ed-body" data-act="${k}"></div></section>`); RENDER[k](P.dlg.querySelector(".ed-body"), P.g); }
    const m = P.dlg.querySelector(".ed-main"); if (m) m.scrollTop = 0;
    const st2 = P.dlg.querySelector(".ed-st.on"); if (st2 && st2.scrollIntoView) st2.scrollIntoView({ block: "nearest", inline: "center" });
  }
  function introHtml() {
    const g = P.g, a = acts();
    return `<section class="ed-card ed-intro">
      ${P.mode === "student" ? `<span class="pill"><i class="fa-solid fa-chalkboard-user" aria-hidden="true"></i> ${H(TX.from)}${P.by ? ": " + esc(P.by) : ""}</span>` : ""}
      <h2 class="ed-h1">${C(g.t)}</h2>
      <div class="ed-tags"><span class="ed-tag"><i class="fa-solid ${KIND_I[g.kind]}" aria-hidden="true"></i> ${H(TX.kinds[g.kind])}</span><span class="ed-tag"><i class="fa-solid ${g.stg === "uni" ? "fa-graduation-cap" : "fa-school"}" aria-hidden="true"></i> ${H(TX.stages[g.stg])}</span><span class="ed-tag"><i class="fa-regular fa-clock" aria-hidden="true"></i> ~${a.reduce((s, k) => s + ACT[k].m, 0)} ${H(TX.min)}</span></div>
      ${g.goal ? `<p class="ed-goal2"><i class="fa-solid fa-bullseye" aria-hidden="true"></i> ${C(g.goal)}</p>` : ""}
      <ol class="ed-plan">${a.map((k, j) => `<li style="--c:${ACT[k].c}"><button type="button" data-p="go" data-j="${j}"><span class="ed-ic sm"><i class="fa-solid ${ACT[k].i}" aria-hidden="true"></i></span><b>${H(ACT[k].t)}</b><small>${ACT[k].m} ${H(TX.min)}</small></button></li>`).join("")}</ol>
      ${P.mode === "teach" && P.code ? `<div class="ed-join"><div class="ed-qr" data-ed-pqr></div><div><p class="small muted">${H(TX.codeT)}</p><p class="ed-codev">${P.code.split("").map((c) => `<span>${c}</span>`).join("")}</p><p class="small">${esc(site().replace(/^https?:\/\//, ""))} → ${H(TX.jTitle)}</p></div></div>` : ""}
      ${g.src ? `<p class="small muted"><i class="fa-solid fa-book" aria-hidden="true"></i> ${H(TX.source)}: ${C(g.src)}</p>` : ""}
      ${P.mode === "student" ? `<p class="small muted">${H(TX.ugc)}</p>` : ""}
    </section>`;
  }
  function finalHtml() {
    const tt = total(), a = acts();
    const pct = tt.m ? Math.round((tt.s / tt.m) * 100) : 100;
    const stars = pct >= 85 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
    return `<section class="ed-card ed-final">
      <div class="ed-stars" aria-label="${stars} / 3">${[0, 1, 2].map((k) => `<i class="fa-solid fa-star${k < stars ? " on" : ""}" aria-hidden="true"></i>`).join("")}</div>
      <h2 class="ed-h1">${H(TX.done)}</h2>
      <p class="ed-big2">${tt.s} / ${tt.m} <small>(${pct} %)</small></p>
      <ul class="ed-brk">${a.filter((k) => P.max[k]).map((k) => `<li style="--c:${ACT[k].c}"><span class="ed-ic sm"><i class="fa-solid ${ACT[k].i}" aria-hidden="true"></i></span>${H(ACT[k].t)}<b>${P.scores[k] || 0} / ${P.max[k]}</b></li>`).join("")}</ul>
      ${P.teams ? `<div class="ed-podium">${P.teams.map((v, k) => [v, k]).sort((x, y) => y[0] - x[0]).map(([v, k], r) => `<div style="--tc:${TEAM_C[k]}"><b>${r === 0 ? "🏆 " : ""}${k + 1}-${H(TX.team)}</b><span>${v}</span></div>`).join("")}</div>` : ""}
      ${P.mode === "student" && P.code ? `<form class="ed-send" data-p-send><label>${H(TX.yourName)}<input type="text" name="n" maxlength="60" required autocomplete="name"></label><button type="submit" class="btn btn-primary"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> ${H(TX.send)}</button><p class="small" aria-live="polite" data-p-sent></p></form>` : ""}
      <div class="ps-btns" style="justify-content:center"><button type="button" class="btn btn-ghost" data-p="again"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> ${H(TX.again)}</button></div>
    </section>`;
  }
  function finalBind() {
    const tt = total();
    const pct = tt.m ? Math.round((tt.s / tt.m) * 100) : 100;
    if (P.mode === "student") xpOnce("ed_done_" + (P.code || P.g.id), Math.max(5, Math.round(pct / 5)), TX.gameXp);
    const f = P.dlg.querySelector("[data-p-send]");
    if (f) {
      try { const n = localStorage.getItem("ekotalim:dars:name"); if (n) f.n.value = n; } catch (e) { /* ignore */ }
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = f.n.value.trim(); if (!name) return;
        try { localStorage.setItem("ekotalim:dars:name", name); } catch (err) { /* ignore */ }
        const out = f.querySelector("[data-p-sent]"), btn = f.querySelector("button");
        btn.disabled = true;
        try { await J(`/api/ustoz/g/${P.code}/result`, { method: "POST", body: JSON.stringify({ name, score: tt.s, max: Math.max(1, tt.m) }) }); out.textContent = "✅ " + L(TX.sent); }
        catch (err) { out.textContent = err.message; btn.disabled = false; }
      });
    }
  }
  function tick() {
    if (!P) return;
    P.timer.left--;
    const el = P.dlg.querySelector("[data-tleft]");
    if (el) { el.textContent = mmss(P.timer.left); el.parentElement.classList.toggle("low", P.timer.left <= 30); }
    if (P.timer.left <= 0) { clearInterval(P.timer.h); P.timer.run = false; P.timer.left = 0; const t = P.dlg.querySelector(".ed-timer"); if (t) { t.classList.remove("run"); t.classList.add("end"); const ic = t.querySelector("[data-p=timer] i"); if (ic) ic.className = "fa-solid fa-play"; } beep(); }
  }
  function beep() { try { const ac = new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), gn = ac.createGain(); o.frequency.value = 880; gn.gain.value = 0.08; o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.35); setTimeout(() => ac.close(), 600); } catch (e) { /* ignore */ } }
  function onPlayClick(e) {
    if (e.target === P.dlg) return;
    const b = e.target.closest("[data-p]"); if (!b) return;
    const k = b.dataset.p;
    if (k === "close") return closePlayer();
    if (k === "next") return go(P.i + 1);
    if (k === "prev") return go(P.i - 1);
    if (k === "go") return go(+b.dataset.j);
    if (k === "again") { P.scores = {}; P.max = {}; P.done = {}; if (P.teams) P.teams = P.teams.map(() => 0); return go(-1); }
    if (k === "big") { P.big = !P.big; P.dlg.classList.toggle("big", P.big); b.classList.toggle("on", P.big); b.setAttribute("aria-pressed", P.big); return; }
    if (k === "full") { try { if (document.fullscreenElement) document.exitFullscreen(); else P.dlg.requestFullscreen(); } catch (err) { /* ignore */ } setTimeout(() => { const ic = P && P.dlg.querySelector("[data-p=full] i"); if (ic) ic.className = "fa-solid " + (document.fullscreenElement ? "fa-compress" : "fa-expand"); }, 300); return; }
    if (k === "timer") {
      if (P.timer.run) { clearInterval(P.timer.h); P.timer.run = false; }
      else { if (P.timer.left <= 0) { const a = acts(); P.timer.left = P.i >= 0 && P.i < a.length ? ACT[a[P.i]].m * 60 : 300; } P.timer.run = true; P.timer.h = setInterval(tick, 1000); }
      const t = P.dlg.querySelector(".ed-timer"); t.classList.toggle("run", P.timer.run); t.classList.remove("end"); b.querySelector("i").className = "fa-solid " + (P.timer.run ? "fa-pause" : "fa-play");
      return;
    }
    if (k === "treset") { clearInterval(P.timer.h); P.timer.run = false; const a = acts(); P.timer.left = P.i >= 0 && P.i < a.length ? ACT[a[P.i]].m * 60 : 0; const t = P.dlg.querySelector(".ed-timer"); t.classList.remove("run", "low", "end"); t.querySelector("[data-tleft]").textContent = mmss(P.timer.left); t.querySelector("[data-p=timer] i").className = "fa-solid fa-play"; return; }
    if (k === "tm") { const j = +b.dataset.k; P.teams[j] = Math.max(0, P.teams[j] + +b.dataset.d); const v = b.closest(".ed-team").querySelector(".ed-tv"); v.textContent = P.teams[j]; v.classList.remove("pop"); void v.offsetWidth; v.classList.add("pop"); return; }
    if (k === "tadd") {
      /* Жамоа рамкага қўшилади — жорий босқич (ва ундаги жавоблар) қайта чизилмайди */
      const j = P.teams.push(0) - 1;
      const d = document.createElement("div");
      d.className = "ed-team"; d.style.setProperty("--tc", TEAM_C[j]);
      d.innerHTML = `<b>${j + 1}-${H(TX.team)}</b><span class="ed-tv">0</span><div><button type="button" data-p="tm" data-k="${j}" data-d="-1" aria-label="−1">−</button><button type="button" data-p="tm" data-k="${j}" data-d="1" aria-label="+1">+</button></div>`;
      b.before(d);
      if (P.teams.length >= 4) b.remove();
      return;
    }
  }
  function setScore(k, s, max, done) {
    P.scores[k] = s; P.max[k] = max; if (done) P.done[k] = true;
    const f = P.dlg.querySelector(".ed-fsc"); if (f) f.innerHTML = `${H(TX.score)}: <b>${s} / ${max}</b>`;
    const pts = P.dlg.querySelector(".ed-pts"); if (pts) pts.innerHTML = `<i class="fa-solid fa-star" aria-hidden="true"></i> ${total().s}`;
    if (done) { const st2 = P.dlg.querySelector(".ed-st.on"); if (st2) { st2.classList.add("ok"); st2.querySelector("i").className = "fa-solid fa-check"; } }
  }
  const fb = (box, ok) => { const m = box.querySelector(".ed-fb"); if (!m) return; m.textContent = L(ok ? TX.right : TX.wrong); m.className = "ed-fb " + (ok ? "ok" : "bad"); };

  /* ---------- Босқичлар ---------- */
  const RENDER = {
    insert(box, g) {
      const marks = P.ins || (P.ins = {});
      const draw = () => {
        const n = Object.keys(marks).length;
        box.innerHTML = `<div class="ed-inslg">${TX.insM.map(([k, i, t]) => `<span class="ed-im ${k}"><b>${i}</b> ${H(t)}</span>`).join("")}</div>
          <ol class="ed-ins">${g.insert.map((s, j) => `<li class="${marks[j] ? "m-" + marks[j] : ""}"><p>${C(s)}</p><div class="ed-imb" role="group">${TX.insM.map(([k, i, t]) => `<button type="button" class="ed-im ${k}${marks[j] === k ? " on" : ""}" data-ins="${j}:${k}" aria-pressed="${marks[j] === k}" title="${H(t)}" aria-label="${H(t)}"><b>${i}</b></button>`).join("")}</div></li>`).join("")}</ol>
          <p class="ed-sum small">${TX.insM.map(([k, i, t]) => `<span class="ed-im ${k}"><b>${i}</b> ${Object.values(marks).filter((x) => x === k).length}</span>`).join(" ")}</p>`;
        setScore("insert", n, g.insert.length, n === g.insert.length);
      };
      box.addEventListener("click", (e) => { const b = e.target.closest("[data-ins]"); if (!b) return; const [j, k] = b.dataset.ins.split(":"); marks[j] = marks[j] === k ? undefined : k; if (!marks[j]) delete marks[j]; const y = P.dlg.querySelector(".ed-main").scrollTop; draw(); P.dlg.querySelector(".ed-main").scrollTop = y; });
      draw();
    },
    cluster(box, g) {
      const cl = g.cluster, placed = {};
      let pick = null;
      const bank = shuffle(cl.b.map((x, j) => j), rngOf(g.t + "c"));
      const draw = () => {
        const ok = Object.keys(placed).length;
        box.innerHTML = `<div class="ed-clu"><div class="ed-cc">${C(cl.c)}</div>
          <div class="ed-cb">${cl.b.map(([w, h], j) => `<button type="button" class="ed-br${placed[j] ? " ok" : ""}" data-br="${j}"><span class="ed-bw">${placed[j] ? C(w) : "?"}</span><small>${C(h)}</small></button>`).join("")}</div></div>
          <div class="ed-bank">${bank.filter((j) => !placed[j]).map((j) => `<button type="button" class="ed-chip${pick === j ? " on" : ""}" data-chip="${j}">${C(cl.b[j][0])}</button>`).join("")}</div>
          <p class="ed-fb" aria-live="polite">${pick != null ? H(TX.picked) : ""}</p>`;
        setScore("cluster", ok, cl.b.length, ok === cl.b.length);
      };
      box.addEventListener("click", (e) => {
        const c = e.target.closest("[data-chip]"), br = e.target.closest("[data-br]");
        if (c) { pick = +c.dataset.chip === pick ? null : +c.dataset.chip; draw(); return; }
        if (br && pick != null) { const j = +br.dataset.br; if (j === pick || normW(cl.b[j][0]) === normW(cl.b[pick][0])) { placed[j] = true; pick = null; draw(); fb(box, true); } else { br.classList.remove("shake"); void br.offsetWidth; br.classList.add("shake"); fb(box, false); } }
      });
      draw();
    },
    match(box, g) {
      const R = rngOf(g.t + "m");
      const items = shuffle(g.terms, R).slice(0, matchN(g));
      const L1 = shuffle(items.map((x, j) => j), R), L2 = shuffle(items.map((x, j) => j), R);
      const ok = {};
      let sel = null, miss = 0;
      const draw = () => {
        const n = Object.keys(ok).length;
        box.innerHTML = `<div class="ed-match"><div>${L1.map((j) => `<button type="button" class="ed-mt${ok[j] ? " ok" : ""}${sel === j ? " on" : ""}" data-mt="${j}"${ok[j] ? " disabled" : ""}>${C(items[j][0])}</button>`).join("")}</div>
          <div>${L2.map((j) => `<button type="button" class="ed-md${ok[j] ? " ok" : ""}" data-md="${j}"${ok[j] ? " disabled" : ""}>${C(items[j][1])}</button>`).join("")}</div></div><p class="ed-fb" aria-live="polite"></p>`;
        setScore("match", Math.max(0, n - Math.floor(miss / 2)), items.length, n === items.length);
      };
      box.addEventListener("click", (e) => {
        const t = e.target.closest("[data-mt]"), d = e.target.closest("[data-md]");
        if (t) { sel = +t.dataset.mt; box.querySelectorAll(".ed-mt").forEach((x) => x.classList.toggle("on", x === t)); return; }
        if (d && sel != null) { const j = +d.dataset.md; if (j === sel) { ok[j] = true; sel = null; draw(); fb(box, true); } else { miss++; d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake"); fb(box, false); } }
      });
      draw();
    },
    xw(box, g) {
      const words = xwWords(g);
      if (!words.length || typeof EkoCross === "undefined") { box.innerHTML = `<p class="muted">${H(TX.noXw)}</p>`; return; }
      box.innerHTML = `<div data-xw></div><p class="ed-fb" aria-live="polite"></p>`;
      setScore("xw", P.done.xw ? 5 : 0, 5, !!P.done.xw);
      P.xw = EkoCross.mount(box.querySelector("[data-xw]"), { id: "ed-" + (g.code || g.id), words, compact: true, onSolve: () => { setScore("xw", 5, 5, true); const m = box.querySelector(".ed-fb"); m.textContent = "🎉 " + L(TX.xwOk); m.className = "ed-fb ok"; } });
    },
    venn(box, g) {
      const v = g.venn, ans = {};
      let checked = false;
      const draw = () => {
        const right = v.items.filter(([, z], j) => ans[j] === z).length;
        box.innerHTML = `${v.blank ? `<p class="small muted">${H(TX.vennBlank)}</p>` : ""}<div class="venn-viz" aria-hidden="true"><span class="vc va">A</span><span class="vc vb">B</span><span class="vab">A∩B</span></div>
          <div class="venn-key"><span><i style="background:#3b82f6"></i><b>A</b> — ${C(v.a)}</span><span><i style="background:#f59e0b"></i><b>B</b> — ${C(v.b)}</span></div>
          <ol class="venn-items">${v.items.map(([s, z], j) => `<li class="${checked ? (ans[j] === z ? "ok" : "bad") : ""}"><span>${C(s)}${checked && ans[j] !== z ? ` <small class="ed-ans">→ ${z === "ab" ? H(TX.vennAll) : z.toUpperCase()}</small>` : ""}</span>
            <div class="seg" role="group">${[["a", "A"], ["ab", L(TX.vennAll)], ["b", "B"]].map(([k, t]) => `<button type="button" data-z="${k}" data-vj="${j}" class="${ans[j] === k ? "on" : ""}" aria-pressed="${ans[j] === k}">${esc(t)}</button>`).join("")}</div></li>`).join("")}</ol>
          <div class="ps-btns"><button type="button" class="btn btn-primary btn-sm" data-vcheck>${H(TX.check)}</button></div>`;
        if (checked) setScore("venn", right, v.items.length, true); else setScore("venn", 0, v.items.length, false);
      };
      box.addEventListener("click", (e) => {
        const b = e.target.closest("[data-vj]");
        if (b) { ans[b.dataset.vj] = b.dataset.z; checked = false; const y = P.dlg.querySelector(".ed-main").scrollTop; draw(); P.dlg.querySelector(".ed-main").scrollTop = y; return; }
        if (e.target.closest("[data-vcheck]")) { checked = true; draw(); }
      });
      draw();
    },
    tf(box, g) {
      let j = 0, ok = 0, last = null;
      const draw = () => {
        if (j >= g.tf.length) { box.innerHTML = `<div class="ed-done"><i class="fa-solid fa-flag-checkered" aria-hidden="true"></i><p class="ed-big2">${ok} / ${g.tf.length}</p></div>`; setScore("tf", ok, g.tf.length, true); return; }
        box.innerHTML = `<div class="ed-tfc"><p class="small muted">${j + 1} / ${g.tf.length}</p><p class="ed-tfs">${C(g.tf[j][0])}</p>
          <div class="ed-tfb"><button type="button" class="ed-yes" data-tf="1"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> ${H(TX.trueB)}</button><button type="button" class="ed-no" data-tf="0"><i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> ${H(TX.falseB)}</button></div>
          <p class="ed-fb ${last == null ? "" : last ? "ok" : "bad"}" aria-live="polite">${last == null ? "" : H(last ? TX.right : TX.wrong)}</p></div>`;
        setScore("tf", ok, g.tf.length, false);
      };
      box.addEventListener("click", (e) => {
        const b = e.target.closest("[data-tf]"); if (!b || j >= g.tf.length) return;
        last = +b.dataset.tf === g.tf[j][1]; if (last) ok++;
        b.classList.add(last ? "hit" : "miss"); box.querySelectorAll("[data-tf]").forEach((x) => { x.disabled = true; });
        const m = box.querySelector(".ed-fb"); m.textContent = L(last ? TX.right : TX.wrong) + (last ? "" : ` (${L(g.tf[j][1] ? TX.trueB : TX.falseB)})`); m.className = "ed-fb " + (last ? "ok" : "bad");
        j++; setTimeout(() => { if (P && box.isConnected) { last = null; draw(); } }, last ? 900 : 1800);
      });
      draw();
    },
    quiz(box, g) {
      let j = 0, ok = 0;
      const SH = ["fa-play fa-rotate-270", "fa-diamond", "fa-circle", "fa-square"];
      const draw = () => {
        if (j >= g.quiz.length) { box.innerHTML = `<div class="ed-done"><i class="fa-solid fa-trophy" aria-hidden="true"></i><p class="ed-big2">${ok} / ${g.quiz.length}</p></div>`; setScore("quiz", ok, g.quiz.length, true); return; }
        const q = g.quiz[j];
        box.innerHTML = `<div class="ed-q"><p class="small muted">${j + 1} / ${g.quiz.length}</p><p class="ed-qq">${C(q.q)}</p>
          <div class="ed-opts">${q.a.map((a, k) => `<button type="button" class="ed-o o${k % 4}" data-o="${k}"><i class="fa-solid ${SH[k % 4]}" aria-hidden="true"></i><span>${C(a)}</span></button>`).join("")}</div><p class="ed-fb" aria-live="polite"></p></div>`;
        setScore("quiz", ok, g.quiz.length, false);
      };
      box.addEventListener("click", (e) => {
        const b = e.target.closest("[data-o]"); if (!b || b.disabled) return;
        const q = g.quiz[j], hit = +b.dataset.o === q.c;
        if (hit) ok++;
        box.querySelectorAll("[data-o]").forEach((x) => { x.disabled = true; x.classList.toggle("right", +x.dataset.o === q.c); });
        if (!hit) b.classList.add("wrongp");
        fb(box, hit);
        j++; setTimeout(() => { if (P && box.isConnected) draw(); }, hit ? 1000 : 2000);
      });
      draw();
    },
    steps(box, g) {
      const R = rngOf(g.t + "s");
      let ord = shuffle(g.steps.map((x, j) => j), R);
      if (ord.every((x, j) => x === j) && ord.length > 1) ord = ord.slice(1).concat(ord[0]);
      let sel = null, checked = false;
      const draw = () => {
        const right = ord.filter((x, j) => x === j).length;
        box.innerHTML = `<ol class="ed-steps2">${ord.map((x, j) => `<li class="${sel === j ? "on" : ""}${checked ? (x === j ? " ok" : " bad") : ""}"><button type="button" class="ed-sp" data-sp="${j}"><span class="ed-sn">${j + 1}</span>${C(g.steps[x])}</button><span class="ed-arr"><button type="button" data-mv="${j}:-1" aria-label="↑"${j ? "" : " disabled"}><i class="fa-solid fa-arrow-up" aria-hidden="true"></i></button><button type="button" data-mv="${j}:1" aria-label="↓"${j < ord.length - 1 ? "" : " disabled"}><i class="fa-solid fa-arrow-down" aria-hidden="true"></i></button></span></li>`).join("")}</ol>
          <div class="ps-btns"><button type="button" class="btn btn-primary btn-sm" data-scheck>${H(TX.check)}</button></div><p class="ed-fb ${checked ? (right === ord.length ? "ok" : "bad") : ""}" aria-live="polite">${checked ? `${right} / ${ord.length}` : ""}</p>`;
        setScore("steps", checked ? right : 0, ord.length, checked);
      };
      const mv = (j, d) => { const k = j + d; if (k < 0 || k >= ord.length) return; [ord[j], ord[k]] = [ord[k], ord[j]]; sel = k; checked = false; draw(); const b = box.querySelector(`[data-sp="${k}"]`); if (b) b.focus(); };
      box.addEventListener("click", (e) => {
        const m = e.target.closest("[data-mv]"); if (m) { const [j, d] = m.dataset.mv.split(":").map(Number); mv(j, d); return; }
        const s = e.target.closest("[data-sp]");
        if (s) { const j = +s.dataset.sp; if (sel != null && sel !== j) { [ord[j], ord[sel]] = [ord[sel], ord[j]]; sel = null; checked = false; } else sel = sel === j ? null : j; draw(); return; }
        if (e.target.closest("[data-scheck]")) { checked = true; sel = null; draw(); }
      });
      draw();
    },
    tools(box, g) {
      const need = g.tools.slice(0, 8), all = shuffle(need.concat((g.extra || []).slice(0, 5)), rngOf(g.t + "t"));
      const on = new Set();
      let checked = false;
      const safety = g.safety && g.safety.length ? g.safety.map((s) => C(s)) : TX.safetyGen.map((s) => H(s));
      const draw = () => {
        const good = [...on].filter((x) => need.includes(x)).length, bad = [...on].filter((x) => !need.includes(x)).length;
        box.innerHTML = `<div class="ed-tools2">${all.map((x, j) => `<button type="button" class="ed-tool${on.has(x) ? " on" : ""}${checked ? (need.includes(x) ? " need" : on.has(x) ? " bad" : "") : ""}" data-tool="${j}" aria-pressed="${on.has(x)}"><i class="fa-solid ${need.includes(x) && checked ? "fa-check" : on.has(x) ? "fa-basket-shopping" : "fa-flask-vial"}" aria-hidden="true"></i>${C(x)}</button>`).join("")}</div>
          <div class="ps-btns"><button type="button" class="btn btn-primary btn-sm" data-tcheck>${H(TX.check)}</button></div><p class="ed-fb ${checked ? (good === need.length && !bad ? "ok" : "bad") : ""}" aria-live="polite">${checked ? `${good} / ${need.length}${bad ? ` · −${bad}` : ""}` : ""}</p>
          ${g.kind !== "darslik" ? `<div class="ed-safe"><h4><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> ${H(TX.safety)}</h4><ul>${safety.map((s) => `<li>${s}</li>`).join("")}</ul></div>` : ""}`;
        setScore("tools", checked ? Math.max(0, good - bad) : 0, need.length, checked);
      };
      box.addEventListener("click", (e) => {
        const b = e.target.closest("[data-tool]"); if (b) { const x = all[+b.dataset.tool]; if (on.has(x)) on.delete(x); else on.add(x); checked = false; draw(); return; }
        if (e.target.closest("[data-tcheck]")) { checked = true; draw(); }
      });
      draw();
    },
    sink(box, g) {
      const s = g.sink || { ex: [], adj: [], verb: [] };
      const v = P.sinkV || (P.sinkV = [Craw(s.ex[0] || ""), "", "", "", ""]);
      box.innerHTML = `<div class="ed-sink">${TX.sinkL.map((l, k) => `<label>${H(l)}<input type="text" maxlength="120" data-sk="${k}" value="${esc(v[k] || "")}"></label>${k === 1 && s.adj.length ? `<div class="ed-bank sm">${s.adj.map((w) => `<button type="button" class="ed-chip" data-skw="1">${C(w)}</button>`).join("")}</div>` : ""}${k === 2 && s.verb.length ? `<div class="ed-bank sm">${s.verb.map((w) => `<button type="button" class="ed-chip" data-skw="2">${C(w)}</button>`).join("")}</div>` : ""}`).join("")}</div>
        <div class="ps-btns"><button type="button" class="btn btn-primary btn-sm" data-sksave>${H(TX.sinkSave)}</button>${s.ex.filter(Boolean).length >= 3 ? `<button type="button" class="btn btn-ghost btn-sm" data-skex aria-expanded="false">${H(TX.sample)}</button>` : ""}</div>
        <ol class="ed-sinkex" hidden>${s.ex.map((x) => `<li>${C(x)}</li>`).join("")}</ol><p class="ed-fb" aria-live="polite"></p>`;
      setScore("sink", P.done.sink ? 3 : 0, 3, !!P.done.sink);
      box.addEventListener("click", (e) => {
        const c = e.target.closest("[data-skw]");
        if (c) { const k = +c.dataset.skw, inp = box.querySelector(`[data-sk="${k}"]`); const w = c.textContent.trim(); if (!inp.value.includes(w)) inp.value = inp.value ? inp.value.replace(/[,\s]+$/, "") + ", " + w : w; v[k] = inp.value; c.classList.add("on"); return; }
        if (e.target.closest("[data-skex]")) { const ex = box.querySelector(".ed-sinkex"); ex.hidden = !ex.hidden; e.target.closest("[data-skex]").setAttribute("aria-expanded", !ex.hidden); return; }
        if (e.target.closest("[data-sksave]")) { box.querySelectorAll("[data-sk]").forEach((i) => { v[+i.dataset.sk] = i.value.trim(); }); const n = v.filter(Boolean).length; setScore("sink", n >= 5 ? 3 : n >= 3 ? 2 : n ? 1 : 0, 3, n >= 3); const m = box.querySelector(".ed-fb"); m.textContent = n >= 3 ? "✅ " + L(TX.saved) : L(TX.sinkNeed); m.className = "ed-fb " + (n >= 3 ? "ok" : "bad"); }
      });
      box.addEventListener("input", (e) => { const i = e.target.closest("[data-sk]"); if (i) v[+i.dataset.sk] = i.value; });
    },
    exit(box) {
      const v = P.exitV || (P.exitV = ["", "", ""]);
      box.innerHTML = `<div class="ed-exit">${TX.exitL.map((l, k) => `<label style="--c:${["#0f766e", "#b45309", "#7c3aed"][k]}"><span class="ed-exn">${3 - k}</span>${H(l)}<textarea rows="${3 - k}" maxlength="400" data-ex="${k}">${esc(v[k])}</textarea></label>`).join("")}</div>
        <div class="ps-btns"><button type="button" class="btn btn-primary btn-sm" data-exsave>${H(TX.exitSave)}</button></div><p class="ed-fb" aria-live="polite"></p>`;
      setScore("exit", P.done.exit ? 2 : 0, 2, !!P.done.exit);
      box.addEventListener("input", (e) => { const t = e.target.closest("[data-ex]"); if (t) v[+t.dataset.ex] = t.value; });
      box.addEventListener("click", (e) => { if (!e.target.closest("[data-exsave]")) return; const n = v.filter((x) => x.trim()).length; setScore("exit", n >= 3 ? 2 : n ? 1 : 0, 2, n >= 2); const m = box.querySelector(".ed-fb"); m.textContent = n ? "✅ " + L(TX.saved) : L(TX.wrong); m.className = "ed-fb " + (n ? "ok" : "bad"); });
    }
  };

  /* ===================== Ўқувчи: код билан кириш (#darskod) ===================== */
  async function openCode(code, silent) {
    code = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!/^[A-Z2-9]{6}$/.test(code)) { if (!silent) toast(TX.jBad); return false; }
    try {
      const d = await J("/api/ustoz/g/" + code);
      const g = Object.assign(d.game, { id: "c" + code, code });
      st.recent = [{ code, t: g.t, at: Date.now() }].concat((st.recent || []).filter((x) => x.code !== code)).slice(0, 8);
      save();
      play(g, { mode: "student", code, by: d.by });
      renderJoin();
      return true;
    } catch (e) { toast(e.status ? e.message : L(TX.jNet)); return false; }
  }
  function renderJoin() {
    const root = document.getElementById("dkRoot"); if (!root) return;
    const teacher = window.EkoProfile && EkoProfile.stage === "uni";
    root.innerHTML = `<div class="qn-head"><div><span class="pill"><i class="fa-solid fa-chalkboard-user" aria-hidden="true"></i> ${H(TX.jTitle)}</span><h2 class="section-title">${H(TX.jTitle)}</h2><p class="muted" style="max-width:720px">${H(TX.jLead)}</p></div></div>
      <div class="ed-grid">
        <form class="ps-box ed-joinf" data-ed-join>
          <label for="edCode">${H(TX.jCode)}</label>
          <input id="edCode" name="code" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="7" placeholder="K7PX2M" required>
          <button type="submit" class="btn btn-primary ed-big"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> ${H(TX.jGo)}</button>
          ${hasServer() ? "" : `<p class="small muted">${H(TX.jNet)}</p>`}
        </form>
        <div class="ps-box"><h3><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> ${H(TX.jRecent)}</h3>${(st.recent || []).length ? `<ul class="ed-mats">${st.recent.map((r) => `<li><span class="ed-mi" style="--c:#b45309"><i class="fa-solid fa-gamepad" aria-hidden="true"></i></span><div><b>${esc(r.t)}</b><small class="muted ed-mono">${r.code} · ${fmtDate(r.at)}</small></div><div class="ed-mact"><button type="button" class="btn btn-primary btn-sm" data-ed-rc="${r.code}"><i class="fa-solid fa-play" aria-hidden="true"></i> ${H(TX.open)}</button></div></li>`).join("")}</ul>` : `<p class="muted">—</p>`}
          ${teacher ? `<p class="small muted" style="margin-top:14px">${H(TX.jTeacher)}</p><a class="btn btn-ghost btn-sm" href="#ustoz"><i class="fa-solid fa-person-chalkboard" aria-hidden="true"></i> ${H(TX.jToUstoz)}</a>` : ""}</div>
      </div>`;
  }
  function bindJoin() {
    const root = document.getElementById("dkRoot"); if (!root) return;
    root.addEventListener("submit", (e) => { const f = e.target.closest("[data-ed-join]"); if (!f) return; e.preventDefault(); openCode(f.code.value); });
    root.addEventListener("input", (e) => { if (e.target.id === "edCode") { const p = e.target.selectionStart; e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6); try { e.target.setSelectionRange(p, p); } catch (err) { /* ignore */ } } });
    root.addEventListener("click", (e) => { const b = e.target.closest("[data-ed-rc]"); if (b) openCode(b.dataset.edRc); });
    renderJoin();
  }

  /* ===================== Ишга тушириш ===================== */
  window.addEventListener("eko:lang", () => { renderJoin(); if (P) go(P.i); });
  window.addEventListener("eko:stage", renderJoin);
  bindJoin();
  const q = new URLSearchParams(location.search).get("eku");
  if (q) {
    setTimeout(() => {
      openCode(q, false).then((ok) => { if (ok) { try { const u = new URL(location.href); u.searchParams.delete("eku"); history.replaceState(null, "", u.pathname + u.search + u.hash); } catch (e) { /* ignore */ } } });
    }, 400);
  }
  let loaded = null;
  window.EkoDars = {
    tab: TX.tab,
    renderTeacher(panel) {
      renderTeacher(panel);
      if (!loaded) loaded = loadServer().then(() => { if (panelEl && panelEl.isConnected) renderTeacher(panelEl); });
    },
    refresh: () => { loaded = loadServer().then(() => { if (panelEl && panelEl.isConnected) renderTeacher(panelEl); }); return loaded; },
    play, openCode, buildGame, analyse, readPdf, readDocx, joinPages, xwWords, defaultActs
  };
})();
