/* Экомун — 🧪 «Лаборатория хонаси»: болалар ва талабалар учун виртуал кимё хонаси.
   3D хона (Three.js «3D лаборатория» модулидан: window.EkoLab3D.lib), жавонда реагентлар,
   идишлар ва асбоблар; моддаларни танлаб аралаштириш, қиздириш, фильтрлаш, pH ва ҳароратни ўлчаш.
   Ҳисоблаш ядроси — vendor/eko-labxona-kimyo.js (заряд мувозанати, Ksp, CO₂, нейтраллаш иссиқлиги).
   Хавфсизлик: аввал халат, кўзойнак ва қўлқоп; мактаб босқичида фақат хавфсиз уй-рўзғор моддалари,
   хавфли реагентлар 🔒 (университет). GHS пиктограммалари, чиқиндини тўғри ташлаш, хавфсизлик тести.
   Ғоялар PhET (CC BY 4.0), ChemCollective (Carnegie Mellon), Labster ва Open Source Physics
   платформаларидан илҳомланган (кашфиёт орқали ўрганиш, «Explore → Challenge», шкала ва асбоблар);
   код ва матнлар Экомуннинг ўзиники, ҳеч қандай нусха кўчирилмаган.
   Матнлар uz/ru/en; лотин алифбоси EkoLang.tr орқали. */
(() => {
  "use strict";
  const SEC = document.getElementById("labxona");
  const ROOT = document.getElementById("lxRoot");
  if (!SEC || !ROOT) return;
  const K = window.EkoKimyo;
  if (!K) return;

  /* ---------- Тил ва ёрдамчилар ---------- */
  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const tr = (s) => (EL() ? EL().tr(s) : s);
  const lang = () => (EL() ? EL().lang : "cyr");
  const L = (o) => {
    if (o == null) return "";
    if (typeof o === "string") return lang() === "lat" || lang() === "en" ? tr(o) : o;
    const l = lang();
    if (l === "ru") return o.ru || o.uz;
    if (l === "en") return o.en || tr(o.uz);
    if (l === "lat") return tr(o.uz);
    return o.uz;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const H = (o) => esc(L(o));
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = (v, d = 1) => { if (!isFinite(v)) return "—"; const s = v.toFixed(d); return lang() === "en" ? s : s.replace(".", ","); };
  const App = () => window.EkoApp;
  const flags = () => { const a = App(); if (!a) return {}; a.state.flags = a.state.flags || {}; return a.state.flags; };
  const once = (k, n, why) => { const a = App(); if (!a) return false; const f = flags(); if (f[k]) return false; f[k] = true; a.addXp(n, why); if (a.save) a.save(); return true; };
  const toast = (m) => { const a = App(); if (a && a.toast) a.toast(m); };
  const stage = () => { const c = document.documentElement.classList; if (c.contains("stage-maktab")) return "maktab"; if (c.contains("stage-uni")) return "uni"; return (window.EkoProfile && EkoProfile.stage) || "uni"; };
  const uni = () => stage() !== "maktab";
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WHY = "Лаборатория хонаси";

  /* ---------- Матнлар ---------- */
  const TX = {
    pill: t3("🧪 Лаборатория хонаси · виртуал кимё", "🧪 Лабораторная комната · виртуальная химия", "🧪 Lab room · virtual chemistry"),
    title: t3("Лаборатория хонаси", "Лабораторная комната", "Lab room"),
    leadK: t3("Ҳақиқий лабораторияга кирдингиз! Жавондан моддани танланг, идишга қуйинг ва нима бўлишини кузатинг: ранг ўзгаради, пуфакчалар чиқади, чўкма тушади. Аввал ҳимоя кийимини кийинг.", "Вы вошли в настоящую лабораторию! Выберите вещество на полке, налейте в сосуд и наблюдайте: меняется цвет, идут пузырьки, выпадает осадок. Сначала наденьте защиту.", "Welcome to a real lab! Pick a substance from the shelf, pour it into the vessel and watch: colours change, bubbles rise, a precipitate forms. Put on your safety gear first."),
    leadU: t3("Экологик таҳлил лабораторияси: {n} та реагент ва намуна, {e} та асбоб-ускуна. Тупроқ, сув ва ҳаво таҳлили: pH, электр ўтказувчанлик, қаттиқлик (ЭДТА), эриган кислород (Винклер), БПК₅, нитрит, фосфат, аммоний, оғир металлар, гумус. pH заряд мувозанатидан, чўкмалар Ksp дан ҳисобланади.", "Лаборатория экологического анализа: {n} реактивов и проб, {e} приборов. Анализ почвы, воды и воздуха: pH, электропроводность, жёсткость (ЭДТА), растворённый кислород (Винклер), БПК₅, нитрит, фосфат, аммоний, тяжёлые металлы, гумус. pH — из баланса зарядов, осадки — по Ksp.", "An environmental analysis lab: {n} reagents and samples, {e} instruments. Soil, water and air tests: pH, conductivity, hardness (EDTA), dissolved oxygen (Winkler), BOD₅, nitrite, phosphate, ammonium, heavy metals and humus. pH is solved from the charge balance, precipitates from Ksp."),
    needHood: t3("🌬️ Бу реактив ўткир буғ чиқаради — аввал «Тортиш шкафи» ни ёқинг (Асбоб-ускуналар → Умумий).", "🌬️ Реактив даёт едкие пары — сначала включите «Вытяжной шкаф» (Приборы → Общее).", "🌬️ This reagent gives off fumes — switch on the Fume hood first (Instruments → General)."),
    acidWater: t3("⛔ Концентрланган кислотага сув қуйманг — қайнаб сачрайди! Аксинча: кислотани оз-оздан сувга қуйинг.", "⛔ Не лейте воду в концентрированную кислоту — вскипит и разбрызгается! Наоборот: кислоту понемногу в воду.", "⛔ Never pour water into concentrated acid — it boils and spits! Add acid slowly to water instead."),
    lockEq: t3("🔒 Бу жиҳоз билан фақат университет босқичида, ўқитувчи назоратида ишланади.", "🔒 С этим прибором работают только на университетском этапе под контролем преподавателя.", "🔒 This instrument is for the university stage, under supervision."),
    eqT: t3("Асбоб-ускуналар", "Приборы и оборудование", "Instruments & equipment"),
    eqHint: t3("Асбобни танланг: нима ўлчашини, қандай ишлатилишини ва хавфсизлик қоидасини ўқинг, кейин «Ўлчаш» ни босинг — натижа идишдаги эритмадан ҳисобланади.", "Выберите прибор: прочитайте, что он измеряет, как работать и правила безопасности, затем нажмите «Измерить» — результат считается по раствору в сосуде.", "Pick an instrument, read what it measures, how to use it and the safety rule, then press Measure — results come from the solution in the vessel."),
    run: t3("Ўлчаш", "Измерить", "Measure"), learnt: t3("Ўргандим", "Изучено", "Got it"), calB: t3("Калибрлаш", "Калибровать", "Calibrate"),
    safety: t3("Хавфсизлик", "Безопасность", "Safety"), aid: t3("Биринчи ёрдам ва сақлаш", "Первая помощь и хранение", "First aid & storage"), hoodNeed: t3("Тортиш шкафида ишланади", "Работать в вытяжном шкафу", "Use in the fume hood"), site: t3("Намуна жойи", "Место отбора", "Sampling site"), vol: t3("Ҳажм", "Объём", "Volume"),
    ppe: t3("Ҳимоя воситалари", "Средства защиты", "Safety gear"),
    ppeNeed: t3("⛔ Аввал халат, кўзойнак ва қўлқопни кийинг!", "⛔ Сначала наденьте халат, очки и перчатки!", "⛔ Put on the lab coat, goggles and gloves first!"),
    ppeOk: t3("✅ Ҳимоя кийилди — ишлашингиз мумкин", "✅ Защита надета — можно работать", "✅ Gear on — you can start"),
    coat: t3("Халат", "Халат", "Lab coat"), gog: t3("Кўзойнак", "Очки", "Goggles"), glo: t3("Қўлқоп", "Перчатки", "Gloves"),
    vessel: t3("Идиш", "Сосуд", "Vessel"),
    amount: t3("Миқдор", "Количество", "Amount"),
    drop: t3("1 томчи", "1 капля", "1 drop"), pinch: t3("чимдим", "щепотка", "pinch"),
    shelf: t3("Жавон", "Полка", "Shelf"),
    tools: t3("Асбоблар", "Приборы", "Tools"),
    lock: t3("🔒 Бу модда хавфли — фақат университет босқичида ўқитувчи назоратида ишлатилади.", "🔒 Это вещество опасно — используется только на университетском этапе под контролем преподавателя.", "🔒 This substance is hazardous — university stage only, under supervision."),
    full: t3("Идиш тўлди! Бошқа идиш танланг ёки бўшатинг.", "Сосуд полон! Выберите другой или опорожните.", "The vessel is full! Choose another one or empty it."),
    empty: t3("Идиш бўш. Жавондан модда қўшинг.", "Сосуд пуст. Добавьте вещество с полки.", "The vessel is empty. Add something from the shelf."),
    added: t3("қўшилди", "добавлено", "added"),
    obs: t3("Кузатув", "Наблюдение", "Observation"),
    nothing: t3("Ҳали ўзгариш йўқ", "Пока изменений нет", "No change yet"),
    heatOn: t3("🔥 Иситгич ёқилди", "🔥 Нагрев включён", "🔥 Heater on"),
    heatOff: t3("Иситгич ўчирилди", "Нагрев выключен", "Heater off"),
    boil: t3("Қайнаяпти — сув буғланмоқда", "Кипит — вода испаряется", "Boiling — water is evaporating"),
    dry: t3("⚠️ Идиш қуриб қолмаслиги учун иситгич ўчирилди.", "⚠️ Нагрев выключен, чтобы сосуд не высох.", "⚠️ Heater switched off so the vessel does not run dry."),
    disc: t3("🔬 Кашфиётлар", "🔬 Открытия", "🔬 Discoveries"),
    discNew: t3("🎉 Янги кашфиёт!", "🎉 Новое открытие!", "🎉 New discovery!"),
    mis: t3("🎯 Экологик вазифалар", "🎯 Экологические задания", "🎯 Environmental missions"),
    misOk: t3("🎯 Вазифа бажарилди! +10 XP", "🎯 Задание выполнено! +10 XP", "🎯 Mission complete! +10 XP"),
    rec: t3("📋 Тайёр тажрибалар (йўриқнома)", "📋 Готовые опыты (инструкции)", "📋 Guided experiments"),
    start: t3("Бошлаш", "Начать", "Start"),
    steps: t3("Қадамлар", "Шаги", "Steps"),
    log: t3("📓 Лаборатория журнали", "📓 Лабораторный журнал", "📓 Lab notebook"),
    logEmpty: t3("Ҳали ёзув йўқ — ҳар бир қадам шу ерда сақланади.", "Записей нет — каждый шаг сохраняется здесь.", "No entries yet — every step is recorded here."),
    csv: t3("CSV (Excel)", "CSV (Excel)", "CSV (Excel)"),
    curve: t3("pH эгри чизиғи (қўшилган ҳажм бўйича)", "Кривая pH (по добавленному объёму)", "pH curve (vs. volume added)"),
    rules: t3("🦺 Хавфсизлик қоидалари", "🦺 Правила безопасности", "🦺 Safety rules"),
    quiz: t3("🧠 Хавфсизлик тести", "🧠 Тест по безопасности", "🧠 Safety quiz"),
    quizOk: t3("✅ Барча жавоблар тўғри! +5 XP", "✅ Все ответы верны! +5 XP", "✅ All answers correct! +5 XP"),
    waste: t3("🧼 Идишни бўшатиш: суюқликни қаерга тўкасиз?", "🧼 Опорожнить сосуд: куда вылить жидкость?", "🧼 Empty the vessel: where does the liquid go?"),
    sink: t3("Раковинага (кўп сув билан)", "В раковину (с большим количеством воды)", "Down the sink (with plenty of water)"),
    bin: t3("Кимёвий чиқинди идишига", "В контейнер для химических отходов", "Into the chemical waste container"),
    cancel: t3("Бекор қилиш", "Отмена", "Cancel"),
    wOkSink: t3("✅ Тўғри: бу аралашма зарарсиз, кўп сув билан раковинага тўкиш мумкин.", "✅ Верно: смесь безвредна, её можно слить в раковину с водой.", "✅ Right: this mixture is harmless and can go down the sink with water."),
    wOkBin: t3("✅ Тўғри: оғир металлар ва кучли оксидловчилар табиатга тушмаслиги керак — улар махсус идишга йиғилади.", "✅ Верно: тяжёлые металлы и сильные окислители не должны попасть в природу — их собирают в спецконтейнер.", "✅ Right: heavy metals and strong oxidisers must not reach nature — they go into a special container."),
    wBadSink: t3("❌ Йўқ! Бу аралашмада оғир металл ёки оксидловчи бор — у дарё ва балиқларга зарар етказади. Кимёвий чиқинди идишига ташланг.", "❌ Нет! В смеси есть тяжёлый металл или окислитель — это вредит рекам и рыбам. Нужен контейнер для химотходов.", "❌ No! This mixture contains a heavy metal or oxidiser that harms rivers and fish. Use the chemical waste container."),
    wNeut: t3("❌ Аввал нейтралланг: pH 5–9 оралиғида бўлсин (кислотага сода, ишқорга сирка қўшинг).", "❌ Сначала нейтрализуйте: pH должен быть 5–9 (к кислоте — соду, к щёлочи — уксус).", "❌ Neutralise first: pH should be 5–9 (add soda to acid, vinegar to alkali)."),
    wOver: t3("👍 Бўлади, лекин бу ортиқча: зарарсиз аралашмани раковинага тўкса ҳам бўлади, махсус идишни тежанг.", "👍 Можно, но излишне: безвредную смесь можно слить в раковину, берегите спецконтейнер.", "👍 Fine, but unnecessary: a harmless mix can go down the sink — save the special container."),
    load: t3("3D хона юкланмоқда…", "Загрузка 3D-комнаты…", "Loading the 3D room…"),
    noGl: t3("Бу қурилмада 3D (WebGL) ишламади — лаборатория пастдаги тугмалар билан тўлиқ ишлайди.", "3D (WebGL) не запустился — лаборатория полностью работает через кнопки ниже.", "3D (WebGL) did not start — the lab works fully with the buttons below."),
    hint: t3("🖐 Бир бармоқ — айлантириш, икки бармоқ — яқинлаштириш ва юриш (сичқонча: ўнг тугма). Ҳар бир шиша ва асбобни ушлаб суринг; шишани идишга олиб келсангиз — қуйилади; асбобни босинг — ишлатинг.", "🖐 Один палец — вращение, два — масштаб и перемещение (мышь: правая кнопка). Любую склянку и прибор можно перетащить; поднесите склянку к сосуду — она нальётся; нажмите на прибор — используйте его.", "🖐 One finger rotates, two fingers zoom and walk (mouse: right button). Drag any bottle or instrument; bring a bottle to the vessel to pour it; tap an instrument to use it."),
    reset: t3("Янги идиш", "Новый сосуд", "New vessel"),
    src: t3("📎 Манбалар: CRC Handbook of Chemistry and Physics (Ksp, pKa); Harris D.C. «Quantitative Chemical Analysis»; GHS (БМТ, 2023) хавф белгилари; ЎзР ССВ мактаб лабораторияси хавфсизлик қоидалари. Ғоялар: PhET (Колорадо университети, CC BY 4.0), ChemCollective (Carnegie Mellon), Labster.", "📎 Источники: CRC Handbook of Chemistry and Physics (Ksp, pKa); Harris D.C. «Quantitative Chemical Analysis»; знаки опасности GHS (ООН, 2023); правила безопасности школьной лаборатории. Идеи: PhET (Университет Колорадо, CC BY 4.0), ChemCollective (Carnegie Mellon), Labster.", "📎 Sources: CRC Handbook of Chemistry and Physics (Ksp, pKa); Harris D.C. “Quantitative Chemical Analysis”; GHS hazard pictograms (UN, 2023); school lab safety rules. Ideas: PhET (University of Colorado, CC BY 4.0), ChemCollective (Carnegie Mellon), Labster."),
    model: t3("Ўқув модели: 25 °C, суюлтирилган эритмалар, активлик коэффициентлари ҳисобга олинмаган.", "Учебная модель: 25 °C, разбавленные растворы, коэффициенты активности не учитываются.", "Teaching model: 25 °C, dilute solutions, activity coefficients ignored.")
  };

  /* ---------- GHS хавф белгилари ---------- */
  const HAZ = {
    cor: ["fa-hand-dots", t3("Емирувчи: терини куйдиради", "Коррозионное: обжигает кожу", "Corrosive: burns skin")],
    tox: ["fa-skull-crossbones", t3("Заҳарли: ютиш мумкин эмас", "Токсично: не глотать", "Toxic: never swallow")],
    irr: ["fa-exclamation", t3("Таъсирловчи: кўз ва терини ачиштиради", "Раздражающее: щиплет глаза и кожу", "Irritant: stings eyes and skin")],
    flam: ["fa-fire", t3("Ёнувчан: олов яқинида сақламанг", "Горючее: держать вдали от огня", "Flammable: keep away from flames")],
    ox: ["fa-fire-flame-curved", t3("Оксидловчи: ёнишни кучайтиради", "Окислитель: усиливает горение", "Oxidiser: feeds fire")],
    env: ["fa-fish", t3("Табиат учун хавфли: раковинага тўкманг", "Опасно для природы: не сливать в раковину", "Harmful to nature: not down the drain")],
    hp: ["fa-person-rays", t3("Соғлиққа жиддий хавф: канцероген ёки мутаген", "Серьёзная опасность для здоровья: канцероген или мутаген", "Serious health hazard: carcinogen or mutagen")]
  };

  /* Биринчи ёрдам ва сақлаш (GHS хавф синфи бўйича) */
  const AID = {
    cor: t3("Терига тушса — кийимни ечиб, 15 дақиқа оқар сувда ювинг. Металл бўлмаган, ёпиқ идишда сақланг.", "При попадании на кожу снимите одежду и промывайте 15 минут проточной водой. Хранить в закрытой неметаллической таре.", "On skin: remove clothing and rinse 15 min under running water. Store closed, in non-metal containers."),
    tox: t3("Ютилса — оғизни чайинг, қустирманг, дарров шифокорга ёрлиқни кўрсатинг. Қулфли шкафда сақланг.", "При проглатывании прополоскать рот, не вызывать рвоту, сразу к врачу с этикеткой. Хранить в запираемом шкафу.", "If swallowed: rinse mouth, don't induce vomiting, see a doctor with the label. Store locked up."),
    irr: t3("Кўзга тушса — кўз ювгичда 15 дақиқа ювинг; терини совунли сув билан ювинг.", "При попадании в глаза — промывать 15 минут у фонтанчика; кожу — водой с мылом.", "Eyes: rinse 15 min at the eyewash; skin: wash with soap and water."),
    flam: t3("Оловдан узоқда, салқин жойда сақланг. Ёнса — CO₂ ўт ўчиргич ёки ёнмайдиган мато.", "Хранить вдали от огня, в прохладе. При возгорании — CO₂-огнетушитель или кошма.", "Keep cool and away from flames. If alight, use a CO₂ extinguisher or fire blanket."),
    ox: t3("Органик моддалар, қоғоз ва ёнувчилардан алоҳида сақланг.", "Хранить отдельно от органики, бумаги и горючих веществ.", "Store away from organics, paper and flammables."),
    env: t3("Раковинага тўкманг — фақат белгиланган чиқинди идишига.", "Не сливать в раковину — только в маркированный контейнер для отходов.", "Never down the drain — use the labelled waste container."),
    hp: t3("Фақат тортиш шкафида, нитрил қўлқопда; ҳомиладорлар ва ўқувчилар ишламайди.", "Только в вытяжном шкафу и нитриловых перчатках; беременным и школьникам запрещено.", "Fume hood and nitrile gloves only; not for pregnant people or school pupils.")
  };
  /* ---------- Реагентлар ва намуналар ----------
     c — ионлар (суюқлик: моль/л; қаттиқ модда: ммоль/г), ex — бошқа моддалар, ind — индикатор.
     st: "m" — мактаб ва университет, "u" — фақат университет. */
  const R = [
    /* Уй-рўзғор моддалари (хавфсиз) */
    { id: "water", g: "base", st: "m", k: "l", f: "H₂O", col: "#e0f2fe", n: t3("Дистилланган сув", "Дистиллированная вода", "Distilled water"), c: {}, ex: { DO: 0.00027 }, d: t3("Тоза сув: ионлар йўқ, pH 7.", "Чистая вода: ионов нет, pH 7.", "Pure water: no ions, pH 7.") },
    { id: "vinegar", g: "base", st: "m", k: "l", f: "CH₃COOH", col: "#f8fafc", haz: ["irr"], n: t3("Ош сиркаси 9 %", "Столовый уксус 9 %", "Table vinegar 9 %"), c: { Ac: 1.5 }, d: t3("Сирка кислотаси ≈ 1,5 моль/л. Кучсиз кислота.", "Уксусная кислота ≈ 1,5 моль/л. Слабая кислота.", "Acetic acid ≈ 1.5 mol/L. A weak acid.") },
    { id: "lemon", g: "base", st: "m", k: "l", f: "C₆H₈O₇", col: "#fef08a", n: t3("Лимон шарбати", "Лимонный сок", "Lemon juice"), c: { Cit: 0.3 }, ex: { lemon: 1 }, d: t3("Лимон кислотаси ≈ 0,3 моль/л.", "Лимонная кислота ≈ 0,3 моль/л.", "Citric acid ≈ 0.3 mol/L.") },
    { id: "soda", g: "base", st: "m", k: "s", f: "NaHCO₃", col: "#ffffff", n: t3("Ичимлик содаси", "Пищевая сода", "Baking soda"), c: { Na: 11.9, C: 11.9 }, d: t3("Натрий гидрокарбонат: 1 г = 11,9 ммоль. Кислота билан CO₂ ҳосил қилади.", "Гидрокарбонат натрия: 1 г = 11,9 ммоль. С кислотой даёт CO₂.", "Sodium bicarbonate: 1 g = 11.9 mmol. Gives CO₂ with acids.") },
    { id: "salt", g: "base", st: "m", k: "s", f: "NaCl", col: "#ffffff", n: t3("Ош тузи", "Поваренная соль", "Table salt"), c: { Na: 17.1, Cl: 17.1 }, d: t3("1 г = 17,1 ммоль. Хлорид ионини беради.", "1 г = 17,1 ммоль. Даёт хлорид-ион.", "1 g = 17.1 mmol. Supplies chloride ions.") },
    { id: "sugar", g: "base", st: "m", k: "s", f: "C₁₂H₂₂O₁₁", col: "#ffffff", n: t3("Шакар", "Сахар", "Sugar"), c: {}, ex: { sugar: 1 }, d: t3("Эрийди, лекин ион бермайди — pH ўзгармайди.", "Растворяется, но не даёт ионов — pH не меняется.", "Dissolves but gives no ions — pH stays the same.") },
    { id: "soap", g: "base", st: "m", k: "l", f: "C₁₇H₃₅COONa", col: "#fdf4ff", n: t3("Совун эритмаси", "Мыльный раствор", "Soap solution"), c: { Na: 0.02, Soap: 0.02 }, d: t3("Натрий стеарат. Қаттиқ сувда (Ca²⁺) кўпикламай, чўкма беради.", "Стеарат натрия. В жёсткой воде (Ca²⁺) не пенится, а даёт осадок.", "Sodium stearate. In hard water (Ca²⁺) it forms scum instead of foam.") },
    { id: "vitc", g: "base", st: "m", k: "s", f: "C₆H₈O₆", col: "#fff7ed", n: t3("Витамин C", "Витамин C", "Vitamin C"), c: { Vc: 5.68 }, d: t3("Аскорбин кислота: 1 г = 5,68 ммоль. Йодни рангсизлантиради (қайтарувчи).", "Аскорбиновая кислота: 1 г = 5,68 ммоль. Обесцвечивает йод (восстановитель).", "Ascorbic acid: 1 g = 5.68 mmol. Decolourises iodine (a reducing agent).") },
    { id: "h2o2", g: "base", st: "m", k: "l", f: "H₂O₂ 3%", col: "#f0f9ff", haz: ["irr"], n: t3("Водород пероксид 3 %", "Перекись водорода 3 %", "Hydrogen peroxide 3 %"), c: {}, ex: { H2O2: 0.88 }, d: t3("Дорихона пероксиди ≈ 0,88 моль/л. Ачитқи билан кислородга парчаланади.", "Аптечная перекись ≈ 0,88 моль/л. С дрожжами разлагается до кислорода.", "Pharmacy peroxide ≈ 0.88 mol/L. Yeast breaks it into oxygen.") },
    { id: "yeast", g: "base", st: "m", k: "s", f: "🍞", col: "#d6b98c", n: t3("Қуруқ ачитқи", "Сухие дрожжи", "Dry yeast"), c: {}, ex: { yeast: 1 }, d: t3("Каталаза ферменти бор — H₂O₂ ни тез парчалайди.", "Содержат фермент каталазу — быстро разлагают H₂O₂.", "Contains the catalase enzyme that splits H₂O₂ fast.") },
    { id: "marble", g: "base", st: "m", k: "s", f: "CaCO₃", col: "#f5f5f4", n: t3("Мармар (бўр) бўлакчаси", "Кусочек мрамора (мела)", "Marble (chalk) chip"), c: { Ca: 9.99, C: 9.99 }, d: t3("Кальций карбонат: ҳайкал ва бинолар тоши. Кислотали ёмғир уни емиради.", "Карбонат кальция: камень статуй и зданий. Кислотный дождь его разъедает.", "Calcium carbonate: the stone of statues and buildings. Acid rain eats it away.") },
    { id: "starch", g: "base", st: "m", k: "l", f: "(C₆H₁₀O₅)ₙ", col: "#f8fafc", n: t3("Крахмал клейстери", "Крахмальный клейстер", "Starch paste"), c: {}, ex: { starch: 1 }, d: t3("Йод билан тўқ кўк ранг беради.", "С йодом даёт тёмно-синий цвет.", "Turns dark blue with iodine.") },
    { id: "iodine", g: "base", st: "m", k: "l", f: "I₂", col: "#b45309", haz: ["irr"], n: t3("Йод эритмаси (суюлтирилган)", "Раствор йода (разбавленный)", "Iodine solution (dilute)"), c: {}, ex: { I2: 0.002 }, d: t3("Люголь эритмаси, 0,002 моль/л. Крахмални аниқлайди.", "Раствор Люголя, 0,002 моль/л. Обнаруживает крахмал.", "Lugol's solution, 0.002 mol/L. Detects starch.") },
    { id: "lime", g: "base", st: "m", k: "l", f: "Ca(OH)₂", col: "#f8fafc", haz: ["irr"], n: t3("Оҳак суви", "Известковая вода", "Limewater"), c: { Ca: 0.02 }, d: t3("Тўйинган Ca(OH)₂ ≈ 0,02 моль/л. CO₂ дан лойқаланади. Кўзга тегмасин!", "Насыщенный Ca(OH)₂ ≈ 0,02 моль/л. Мутнеет от CO₂. Беречь глаза!", "Saturated Ca(OH)₂ ≈ 0.02 mol/L. Turns milky with CO₂. Protect your eyes!") },
    /* Индикаторлар */
    { id: "cabbage", g: "ind", st: "m", k: "l", f: "🥬", col: "#7e22ce", n: t3("Қизил карам шираси", "Сок красной капусты", "Red cabbage juice"), c: {}, ind: { cab: 1 }, d: t3("Табиий индикатор (антоцианлар): кислотада қизил, нейтралда бинафша, ишқорда кўк-яшил, кучли ишқорда сариқ.", "Природный индикатор (антоцианы): в кислоте красный, в нейтральной фиолетовый, в щёлочи сине-зелёный, в сильной щёлочи жёлтый.", "Natural indicator (anthocyanins): red in acid, purple neutral, blue-green in alkali, yellow in strong alkali.") },
    { id: "univ", g: "ind", st: "m", k: "l", f: "pH 1–14", col: "#22c55e", n: t3("Универсал индикатор", "Универсальный индикатор", "Universal indicator"), c: {}, ind: { uni: 1 }, d: t3("Қизил (кислота) → сариқ → яшил (7) → кўк → бинафша (ишқор).", "Красный (кислота) → жёлтый → зелёный (7) → синий → фиолетовый (щёлочь).", "Red (acid) → yellow → green (7) → blue → violet (alkali).") },
    { id: "php", g: "ind", st: "u", k: "l", f: "C₂₀H₁₄O₄", col: "#f8fafc", haz: ["flam"], n: t3("Фенолфталеин 1 %", "Фенолфталеин 1 %", "Phenolphthalein 1 %"), c: {}, ind: { php: 1 }, d: t3("pH 8,2 дан юқорида малина рангга киради. Титрлашда ишлатилади.", "Выше pH 8,2 малиновый. Используется при титровании.", "Turns pink above pH 8.2. Used in titrations.") },
    { id: "mo", g: "ind", st: "u", k: "l", f: "C₁₄H₁₄N₃NaO₃S", col: "#f97316", haz: ["tox"], n: t3("Метилоранж", "Метиловый оранжевый", "Methyl orange"), c: {}, ind: { mo: 1 }, d: t3("pH 3,1 дан паст — қизил, 4,4 дан юқори — сариқ.", "Ниже pH 3,1 — красный, выше 4,4 — жёлтый.", "Red below pH 3.1, yellow above 4.4.") },
    { id: "ebt", g: "ind", st: "u", k: "l", f: "C₂₀H₁₂N₃NaO₇S", col: "#7f1d1d", haz: ["irr", "flam"], n: t3("Эриохром қора Т", "Эриохром чёрный Т", "Eriochrome Black T"), c: {}, ind: { ebt: 1 }, d: t3("Металлоиндикатор (pH 10): Ca²⁺/Mg²⁺ билан вино-қизил, ЭДТА уларни тортиб олгач — тоза кўк.", "Металлоиндикатор (pH 10): с Ca²⁺/Mg²⁺ винно-красный, когда ЭДТА их связывает — чисто-синий.", "Metal indicator (pH 10): wine-red with Ca²⁺/Mg²⁺, pure blue once EDTA binds them.") },
    { id: "mur", g: "ind", st: "u", k: "l", f: "C₈H₈N₆O₆", col: "#9d174d", haz: ["irr"], n: t3("Мурексид", "Мурексид", "Murexide"), c: {}, ind: { mur: 1 }, d: t3("pH 12–13 да фақат Ca²⁺ ни кўрсатади: кальций билан пушти, эркин ҳолда бинафша.", "При pH 12–13 показывает только Ca²⁺: с кальцием розовый, свободный — фиолетовый.", "At pH 12–13 it shows only Ca²⁺: pink with calcium, violet when free.") },
    /* Экологик намуналар */
    { id: "rain", g: "eco", st: "m", k: "l", f: "pH≈4,3", col: "#e0f2fe", n: t3("Кислотали ёмғир намунаси", "Проба кислотного дождя", "Acid rain sample"), c: { SO4: 0.000025, NO3: 0.00001 }, ex: { DO: 0.00028 }, sd: 0, d: t3("SO₂ ва NOₓ дан ҳосил бўлган сульфат ва нитрат кислоталари. pH ≈ 4,3.", "Серная и азотная кислоты из SO₂ и NOₓ. pH ≈ 4,3.", "Sulfuric and nitric acids formed from SO₂ and NOₓ. pH ≈ 4.3.") },
    { id: "tap", g: "eco", st: "m", k: "l", f: "H₂O + Ca²⁺ Mg²⁺", col: "#e0f2fe", n: t3("Водопровод суви", "Водопроводная вода", "Tap water"), c: { Ca: 0.0015, Mg: 0.0006, Na: 0.001, Cl: 0.0012, SO4: 0.0007, C: 0.0032 }, ex: { DO: 0.00026 }, hm: { Cu: 10, Pb: 1, Zn: 20, Cd: 0.1 }, mic: "clear", d: t3("Ўртача қаттиқ сув: Ca²⁺ ≈ 1,5 ва Mg²⁺ ≈ 0,6 ммоль/л (умумий қаттиқлик ≈ 4,2 °Ж).", "Вода средней жёсткости: Ca²⁺ ≈ 1,5 и Mg²⁺ ≈ 0,6 ммоль/л (общая жёсткость ≈ 4,2 °Ж).", "Moderately hard: Ca²⁺ ≈ 1.5 and Mg²⁺ ≈ 0.6 mmol/L (total hardness ≈ 4.2 mmol-eq/L).") },
    { id: "river", g: "eco", st: "m", k: "l", f: "Cl⁻ SO₄²⁻", col: "#dbeafe", n: t3("Сирдарё суви намунаси", "Проба воды Сырдарьи", "Syr Darya river sample"), c: { Na: 0.0085, Ca: 0.004, Mg: 0.0025, Cl: 0.005, SO4: 0.0066, NO3: 0.00015, P: 0.000005, NH: 0.00002, C: 0.0032 }, ex: { DO: 0.00027, org: 0.00012, mic: 1 }, sd: 0.6, hm: { Cu: 5, Pb: 2, Zn: 15, Cd: 0.2 }, mic: "river", d: t3("Минераллашган дарё суви (≈ 1,3 г/л): сульфат ва хлорид кўп — суғоришдан қайтган сув таъсири. Кислород ≈ 8,6 мг/л.", "Минерализованная речная вода (≈ 1,3 г/л): много сульфата и хлорида — влияние возвратных вод орошения. Кислород ≈ 8,6 мг/л.", "Mineralised river water (≈ 1.3 g/L) rich in sulfate and chloride from irrigation return flow. Oxygen ≈ 8.6 mg/L.") },
    { id: "wastew", g: "eco", st: "m", k: "l", f: "🏭", col: "#d6c7a1", n: t3("Оқова сув (ифлосланган)", "Сточная вода (загрязнённая)", "Wastewater (polluted)"), c: { Na: 0.0016, Cl: 0.002, C: 0.0036, Ca: 0.001, NH: 0.002, P: 0.00015, NO2: 0.00005 }, ex: { org: 0.05, DO: 0.00006, mic: 1 }, sd: 0.15, hm: { Cu: 80, Pb: 25, Zn: 150, Cd: 2 }, mic: "waste", d: t3("Органика (ювинди, озиқ-овқат қолдиқлари), аммоний ≈ 28 мг/л N, фосфат, кам кислород (≈ 2 мг/л). Перманганат ва БПК₅ билан баҳоланади.", "Органика (стоки, остатки пищи), аммоний ≈ 28 мг/л N, фосфат, мало кислорода (≈ 2 мг/л). Оценивается перманганатом и БПК₅.", "Organic load, ammonium ≈ 28 mg/L N, phosphate and little oxygen (≈ 2 mg/L). Assessed by permanganate and BOD₅.") },
    { id: "well", g: "eco", st: "u", k: "l", f: "Fe³⁺", col: "#fde68a", n: t3("Темирли қудуқ суви (кислоталанган)", "Железистая вода из колодца (подкислена)", "Iron-rich well water (acidified)"), c: { Fe: 0.0005, Cl: 0.0015, NO3: 0.01 }, ex: { DO: 0.00008 }, hm: { Cu: 4, Pb: 3, Zn: 40, Cd: 0.3 }, d: t3("Намуна сақлаш учун HNO₃ билан кислоталанган. Fe³⁺ ≈ 28 мг/л — меъёрдан (0,3 мг/л) кўп.", "Подкислена HNO₃ для хранения. Fe³⁺ ≈ 28 мг/л — выше нормы (0,3 мг/л).", "Acidified with HNO₃ for storage. Fe³⁺ ≈ 28 mg/L — above the 0.3 mg/L norm.") },
    { id: "aral", g: "eco", st: "m", k: "l", f: "≈ 100 г/л", col: "#cffafe", n: t3("Орол денгизи суви (Катта Орол)", "Вода Аральского моря (Большой Арал)", "Aral Sea water (Large Aral)"), c: { Na: 1.1, Mg: 0.25, Ca: 0.012, K: 0.02, Cl: 1.188, SO4: 0.226, C: 0.004 }, ex: { DO: 0.00018 }, sd: 1.5, mic: "aral", d: t3("Шўрлик 100 г/л дан юқори (океан — 35 г/л). Балиқлар қирилиб кетган, фақат артемия қисқичбақаси яшайди.", "Солёность выше 100 г/л (океан — 35 г/л). Рыба погибла, выживает лишь рачок артемия.", "Salinity above 100 g/L (ocean: 35 g/L). Fish have died out; only Artemia brine shrimp survive.") },
    { id: "kdr", g: "eco", st: "m", k: "l", f: "NO₃⁻ SO₄²⁻", col: "#e0e7ff", n: t3("Коллектор-дренаж суви", "Коллекторно-дренажная вода", "Collector-drainage water"), c: { Na: 0.012, Ca: 0.006, Mg: 0.005, Cl: 0.008, SO4: 0.0112, NO3: 0.0008, C: 0.003 }, ex: { DO: 0.0002, org: 0.0002, mic: 1 }, sd: 0.4, hm: { Cu: 8, Pb: 3, Zn: 25, Cd: 0.4 }, mic: "river", d: t3("Даладан оқиб чиққан сув: тузлар (≈ 2,5 г/л), ўғитдан нитрат ≈ 50 мг/л, пестицид қолдиқлари бўлиши мумкин.", "Сток с полей: соли (≈ 2,5 г/л), нитрат от удобрений ≈ 50 мг/л, возможны остатки пестицидов.", "Field runoff: salts (≈ 2.5 g/L), nitrate from fertiliser ≈ 50 mg/L, possible pesticide residues.") },
    { id: "pond", g: "eco", st: "m", k: "l", f: "🦠 P N", col: "#bbf7d0", n: t3("Эвтрофик кўл суви", "Вода эвтрофного озера", "Eutrophic pond water"), c: { Na: 0.002, Ca: 0.0015, Mg: 0.0008, Cl: 0.0015, SO4: 0.0012, NO3: 0.0002, NH: 0.00006, P: 0.00001, NO2: 0.000015, C: 0.0034 }, ex: { DO: 0.000125, org: 0.002, mic: 1, algae: 1 }, sd: 0.35, hm: { Cu: 6, Pb: 2, Zn: 20, Cd: 0.1 }, mic: "pond", d: t3("Фосфор ва азот кўп — сувўтлари «гуллаган». Кислород ≈ 4 мг/л, Секки чуқурлиги 0,35 м.", "Много фосфора и азота — «цветение» водорослей. Кислород ≈ 4 мг/л, прозрачность по Секки 0,35 м.", "Rich in phosphorus and nitrogen — an algal bloom. Oxygen ≈ 4 mg/L, Secchi depth 0.35 m.") },
    /* Тупроқ намуналари (1 г) — эрувчан тузлар «pool» да, чайқатганда сувга ўтади */
    { id: "soilboz", g: "soil", st: "m", k: "s", soil: { w: 12, loi: 2.6, sand: 25, silt: 55, clay: 20, cc: 10, hm: { Cu: 25, Pb: 18, Zn: 60, Cd: 0.2 } }, f: "0–20 см", col: "#c8a27a", n: t3("Оч тусли бўз тупроқ (Тошкент)", "Светлый серозём (Ташкент)", "Light serozem soil (Tashkent)"), c: { Na: 0.0015, K: 0.0006, Ca: 0.002, Mg: 0.001, NH: 0.0002, Cl: 0.0012, SO4: 0.001, NO3: 0.0006, P: 0.00012, C: 0.011 }, cc: 1.0, org: 0.6, mic: "soil", d: t3("Ўзбекистоннинг асосий суғориладиган тупроғи: CaCO₃ ≈ 10 %, гумус ≈ 1,2 %, pH ≈ 8,5. 1 г намуна + 5 мл сув = 1:5 сўрим.", "Основная орошаемая почва Узбекистана: CaCO₃ ≈ 10 %, гумус ≈ 1,2 %, pH ≈ 8,5. 1 г + 5 мл воды = вытяжка 1:5.", "Uzbekistan's main irrigated soil: CaCO₃ ≈ 10 %, humus ≈ 1.2 %, pH ≈ 8.5. 1 g + 5 mL water = 1:5 extract.") },
    { id: "soilsal", g: "soil", st: "m", k: "s", soil: { w: 18, loi: 2.0, sand: 30, silt: 50, clay: 20, cc: 8, hm: { Cu: 22, Pb: 15, Zn: 55, Cd: 0.2 } }, f: "Na⁺ Cl⁻ SO₄²⁻", col: "#d6ccc2", n: t3("Шўрланган тупроқ (Сирдарё вилояти)", "Засолённая почва (Сырдарьинская обл.)", "Saline soil (Syrdarya region)"), c: { Na: 0.08, K: 0.002, Ca: 0.012, Mg: 0.01, Cl: 0.05, SO4: 0.035, NO3: 0.0003, C: 0.004 }, cc: 0.8, org: 0.35, mic: "soil", d: t3("Юзасида оқ туз қатлами. Сувда эрийдиган тузлар ≈ 0,7 % — пахта ҳосилини икки баравар камайтиради. Шўр ювиш керак.", "Белая солевая корка. Водорастворимых солей ≈ 0,7 % — урожай хлопка снижается вдвое. Нужна промывка.", "White salt crust. Soluble salts ≈ 0.7 % halve cotton yields — leaching is needed.") },
    { id: "soilfert", g: "soil", st: "m", k: "s", soil: { w: 15, loi: 3.0, sand: 22, silt: 56, clay: 22, cc: 9, hm: { Cu: 30, Pb: 20, Zn: 70, Cd: 0.4 } }, f: "NO₃⁻ PO₄³⁻", col: "#a47148", n: t3("Ўғит кўп солинган пахта даласи", "Переудобренное хлопковое поле", "Over-fertilised cotton field"), c: { Na: 0.0015, K: 0.004, Ca: 0.0045, Mg: 0.001, NH: 0.0015, Cl: 0.0012, SO4: 0.0012, NO3: 0.004, P: 0.0004, C: 0.011 }, cc: 0.9, org: 0.65, mic: "soil", d: t3("Нитрат ≈ 250 мг/кг: ортиқчаси ер ости сувларига ювилади. Нитратни тест-тасма ёки дифениламин билан текширинг.", "Нитрат ≈ 250 мг/кг: избыток вымывается в грунтовые воды. Проверьте тест-полоской или дифениламином.", "Nitrate ≈ 250 mg/kg — the excess leaches to groundwater. Test with a strip or diphenylamine.") },
    { id: "soilacid", g: "soil", st: "m", k: "s", soil: { w: 25, loi: 8, sand: 60, silt: 30, clay: 10, cc: 0, hm: { Cu: 12, Pb: 25, Zn: 40, Cd: 0.3 } }, f: "pH≈5", col: "#6b4f3a", n: t3("Кислотали ўрмон тупроғи (таққослаш учун)", "Кислая лесная почва (для сравнения)", "Acidic forest soil (for comparison)"), c: { Na: 0.0005, K: 0.0004, Ca: 0.0006, Mg: 0.0003, Cl: 0.0013, SO4: 0.0006, NO3: 0.0002 }, cc: 0, org: 2.0, exH: 0.02, mic: "soil", d: t3("Подзол типидаги тупроқ: карбонат йўқ, алмашинувчи кислоталик 2 смоль/кг. pH(H₂O) ва pH(KCl) ни солиштиринг.", "Подзолистая почва: карбонатов нет, обменная кислотность 2 смоль/кг. Сравните pH(H₂O) и pH(KCl).", "Podzolic soil: no carbonate, exchangeable acidity 2 cmol/kg. Compare pH(H₂O) and pH(KCl).") },
    { id: "soilind", g: "soil", st: "u", k: "s", soil: { w: 10, loi: 2.2, sand: 35, silt: 45, clay: 20, cc: 7, hm: { Cu: 180, Pb: 95, Zn: 340, Cd: 2.8 } }, f: "Cu Pb Zn", col: "#78716c", n: t3("Саноат зонаси тупроғи (Олмалиқ)", "Почва промзоны (Алмалык)", "Industrial-zone soil (Almalyk)"), c: { Na: 0.002, K: 0.0006, Ca: 0.003, Mg: 0.001, Cl: 0.0015, SO4: 0.002, NO3: 0.0003, C: 0.01 }, cc: 0.7, org: 0.45, mic: "soil", d: t3("Кон-металлургия комбинати яқинида: мис, қўрғошин, рух меъёрдан юқори. Атом-абсорбцион спектрометрда текширинг.", "Рядом с горно-металлургическим комбинатом: медь, свинец, цинк выше нормы. Проверьте на атомно-абсорбционном спектрометре.", "Near a mining-metallurgical plant: copper, lead and zinc above limits. Check with the atomic absorption spectrometer.") },
    /* Лаборатория реагентлари (университет) */
    { id: "hcl", g: "lab", st: "u", k: "l", f: "HCl 0,1M", col: "#f8fafc", haz: ["cor"], n: t3("Хлорид кислота 0,1 М", "Соляная кислота 0,1 М", "Hydrochloric acid 0.1 M"), c: { Cl: 0.1 }, d: t3("Кучли кислота. Титрлашда стандарт эритма.", "Сильная кислота. Стандарт для титрования.", "Strong acid. A titration standard.") },
    { id: "h2so4", g: "lab", st: "u", k: "l", f: "H₂SO₄ 0,05M", col: "#f8fafc", haz: ["cor"], n: t3("Сульфат кислота 0,05 М", "Серная кислота 0,05 М", "Sulfuric acid 0.05 M"), c: { SO4: 0.05 }, d: t3("Суюлтиришда доим «сувга кислота» қуйилади, аксинча эмас!", "При разбавлении всегда «кислоту в воду», не наоборот!", "When diluting, always add acid to water, never the reverse!") },
    { id: "naoh", g: "lab", st: "u", k: "l", f: "NaOH 0,1M", col: "#f8fafc", haz: ["cor"], n: t3("Натрий гидроксид 0,1 М", "Гидроксид натрия 0,1 М", "Sodium hydroxide 0.1 M"), c: { Na: 0.1 }, d: t3("Кучли асос (ишқор). Кўзга тушса — 15 дақиқа сув билан ювинг.", "Сильное основание (щёлочь). При попадании в глаза — промывать 15 минут.", "Strong base. If it gets in the eyes, rinse for 15 minutes.") },
    { id: "na2co3", g: "lab", st: "u", k: "l", f: "Na₂CO₃ 0,1M", col: "#f8fafc", haz: ["irr"], n: t3("Натрий карбонат 0,1 М", "Карбонат натрия 0,1 М", "Sodium carbonate 0.1 M"), c: { Na: 0.2, C: 0.1 }, d: t3("Кир ювиш содаси. Ca²⁺ ни CaCO₃ ҳолида чўктиради (сувни юмшатиш).", "Стиральная сода. Осаждает Ca²⁺ в виде CaCO₃ (умягчение воды).", "Washing soda. Precipitates Ca²⁺ as CaCO₃ (water softening).") },
    { id: "cacl2", g: "lab", st: "u", k: "l", f: "CaCl₂ 0,1M", col: "#f8fafc", haz: ["irr"], n: t3("Кальций хлорид 0,1 М", "Хлорид кальция 0,1 М", "Calcium chloride 0.1 M"), c: { Ca: 0.1, Cl: 0.2 }, d: t3("Сувга қаттиқлик берувчи Ca²⁺ манбаи.", "Источник Ca²⁺, придающего жёсткость.", "A source of hardness-causing Ca²⁺.") },
    { id: "agno3", g: "lab", st: "u", k: "l", f: "AgNO₃ 0,05M", col: "#f8fafc", haz: ["cor", "env"], n: t3("Кумуш нитрат 0,05 М", "Нитрат серебра 0,05 М", "Silver nitrate 0.05 M"), c: { Ag: 0.05, NO3: 0.05 }, d: t3("Хлорид ионига сифат реакцияси: оқ сузмасимон AgCl. Терини қорайтиради.", "Качественная реакция на хлорид: белый творожистый AgCl. Чернит кожу.", "Test for chloride: white curdy AgCl. Stains skin black.") },
    { id: "bacl2", g: "lab", st: "u", k: "l", f: "BaCl₂ 0,1M", col: "#f8fafc", haz: ["tox"], n: t3("Барий хлорид 0,1 М", "Хлорид бария 0,1 М", "Barium chloride 0.1 M"), c: { Ba: 0.1, Cl: 0.2 }, d: t3("Сульфат ионига сифат реакцияси: оқ BaSO₄. Заҳарли!", "Качественная реакция на сульфат: белый BaSO₄. Ядовит!", "Test for sulfate: white BaSO₄. Toxic!") },
    { id: "cuso4", g: "lab", st: "u", k: "l", f: "CuSO₄ 0,1M", col: "#60a5fa", haz: ["irr", "env"], n: t3("Мис (II) сульфат 0,1 М", "Сульфат меди (II) 0,1 М", "Copper(II) sulfate 0.1 M"), c: { Cu: 0.1, SO4: 0.1 }, d: t3("Мовий эритма. Ишқор билан кўк Cu(OH)₂ чўкмаси.", "Голубой раствор. Со щёлочью — синий осадок Cu(OH)₂.", "A blue solution. Gives a blue Cu(OH)₂ precipitate with alkali.") },
    { id: "fecl3", g: "lab", st: "u", k: "l", f: "FeCl₃ 0,1M", col: "#f59e0b", haz: ["cor"], n: t3("Темир (III) хлорид 0,1 М", "Хлорид железа (III) 0,1 М", "Iron(III) chloride 0.1 M"), c: { Fe: 0.1, Cl: 0.35 }, d: t3("Сариқ-қўнғир; HCl билан барқарорлаштирилган. Ишқор билан қўнғир Fe(OH)₃.", "Жёлто-бурый; стабилизирован HCl. Со щёлочью — бурый Fe(OH)₃.", "Yellow-brown; stabilised with HCl. Brown Fe(OH)₃ with alkali.") },
    { id: "kscn", g: "lab", st: "u", k: "l", f: "KSCN 0,1M", col: "#f8fafc", haz: ["tox"], n: t3("Калий роданид 0,1 М", "Роданид калия 0,1 М", "Potassium thiocyanate 0.1 M"), c: { K: 0.1, SCN: 0.1 }, d: t3("Fe³⁺ ни аниқлайди: қон-қизил ранг.", "Обнаруживает Fe³⁺: кроваво-красный цвет.", "Detects Fe³⁺: blood-red colour.") },
    { id: "kmno4", g: "lab", st: "u", k: "l", f: "KMnO₄", col: "#a21caf", haz: ["ox", "env"], n: t3("Калий перманганат (0,0002 М)", "Перманганат калия (0,0002 М)", "Potassium permanganate (0.0002 M)"), c: { K: 0.0002, Mn: 0.0002 }, d: t3("Кучли оксидловчи. Органик ифлосликни оксидлаб рангсизланади (перманганат индекси).", "Сильный окислитель. Обесцвечивается, окисляя органику (перманганатная окисляемость).", "A strong oxidiser. Loses colour as it oxidises organic matter (permanganate index).") },
    /* Сув таҳлили реактивлари (университет) */
    { id: "edta", g: "wat", st: "u", k: "l", f: "Na₂H₂Y 0,01M", col: "#f8fafc", haz: ["irr"], n: t3("Трилон Б (ЭДТА) 0,01 М", "Трилон Б (ЭДТА) 0,01 М", "EDTA (Trilon B) 0.01 M"), c: { Na: 0.02, Y: 0.01 }, d: t3("Ca²⁺ ва Mg²⁺ билан 1:1 мустаҳкам комплекс. Умумий қаттиқлик Ж = 2·c(ЭДТА)·V(ЭДТА)/V(намуна), ммоль-экв/л.", "Прочный комплекс 1:1 с Ca²⁺ и Mg²⁺. Общая жёсткость Ж = 2·c(ЭДТА)·V(ЭДТА)/V(пробы), ммоль-экв/л.", "Forms a strong 1:1 complex with Ca²⁺ and Mg²⁺. Total hardness = 2·c(EDTA)·V(EDTA)/V(sample), mmol-eq/L.") },
    { id: "nh3buf", g: "wat", st: "u", k: "l", f: "NH₃ + NH₄Cl", col: "#f8fafc", haz: ["cor", "irr"], hood: true, n: t3("Аммиакли буфер pH 10", "Аммиачный буфер pH 10", "Ammonia buffer pH 10"), c: { NH: 1.0, Cl: 0.15 }, d: t3("pH ≈ 10 ни ушлаб туради (NH₄⁺/NH₃, pKa 9,25). Ўткир ҳид — тортиш шкафида ишланг.", "Держит pH ≈ 10 (NH₄⁺/NH₃, pKa 9,25). Резкий запах — работать в вытяжном шкафу.", "Holds pH ≈ 10 (NH₄⁺/NH₃, pKa 9.25). Pungent — use the fume hood.") },
    { id: "naoh2", g: "wat", st: "u", k: "l", f: "NaOH 2M", col: "#f8fafc", haz: ["cor"], n: t3("Натрий гидроксид 2 М", "Гидроксид натрия 2 М", "Sodium hydroxide 2 M"), c: { Na: 2 }, d: t3("Кальцийни алоҳида аниқлаш учун pH 12–13: Mg(OH)₂ чўкади, ЭДТА фақат Ca²⁺ ни титрлайди (мурексид билан).", "pH 12–13 для определения кальция: Mg(OH)₂ осаждается, ЭДТА титрует только Ca²⁺ (с мурексидом).", "pH 12–13 for calcium: Mg(OH)₂ precipitates and EDTA titrates only Ca²⁺ (with murexide).") },
    { id: "k2cro4", g: "wat", st: "u", k: "l", f: "K₂CrO₄ 5%", col: "#facc15", haz: ["tox", "hp", "env"], n: t3("Калий хромат 5 %", "Хромат калия 5 %", "Potassium chromate 5 %"), c: { K: 0.52, CrO4: 0.26 }, d: t3("Мор усули индикатори: AgCl чўккандан кейин қизил-қўнғир Ag₂CrO₄ охирги нуқтани кўрсатади (pH 6,5–10). Cr(VI) — канцероген.", "Индикатор метода Мора: после осаждения AgCl красно-бурый Ag₂CrO₄ показывает конечную точку (pH 6,5–10). Cr(VI) — канцероген.", "Mohr indicator: after AgCl, red-brown Ag₂CrO₄ marks the end point (pH 6.5–10). Cr(VI) is a carcinogen.") },
    { id: "griess", g: "wat", st: "u", k: "l", f: "сульфаниламид + НЭДА", col: "#fdf2f8", haz: ["irr"], n: t3("Грисс реактиви", "Реактив Грисса", "Griess reagent"), c: { A: 0.3 }, ex: { griess: 0.03 }, d: t3("Нитрит (NO₂⁻) билан пушти-қизил азобўёқ, λ 540 нм. Ҳаводаги NO₂ ни ҳам ютади (Зальцман усули, коэффициент 0,72).", "С нитритом (NO₂⁻) розово-красный азокраситель, λ 540 нм. Поглощает и NO₂ из воздуха (метод Зальцмана, коэффициент 0,72).", "Forms a pink azo dye with nitrite (NO₂⁻), λ 540 nm. Also absorbs NO₂ from air (Saltzman method, factor 0.72).") },
    { id: "moly", g: "wat", st: "u", k: "l", f: "(NH₄)₆Mo₇O₂₄ + C₆H₈O₆", col: "#f8fafc", haz: ["cor"], n: t3("Молибдат реактиви (аскорбинли)", "Молибдатный реактив (с аскорбиновой к-той)", "Molybdate reagent (ascorbic acid)"), c: { SO4: 1.25 }, ex: { moly: 0.06 }, d: t3("Ортофосфат билан молибден кўки, λ 880 нм. Сув ва тупроқдаги ҳаракатчан фосфорни аниқлайди.", "С ортофосфатом — молибденовая синь, λ 880 нм. Определяет подвижный фосфор в воде и почве.", "Gives molybdenum blue with orthophosphate, λ 880 nm. Measures available phosphorus in water and soil.") },
    { id: "ness", g: "wat", st: "u", k: "l", f: "K₂[HgI₄] + NaOH", col: "#fef9c3", haz: ["tox", "cor", "env"], hood: true, n: t3("Несслер реактиви", "Реактив Несслера", "Nessler's reagent"), c: { Na: 4 }, ex: { ness: 0.22 }, d: t3("Аммоний (NH₄⁺/NH₃) билан сариқ-қўнғир ранг, λ 400–425 нм. Таркибида симоб бор — фақат махсус чиқинди идишига!", "С аммонием (NH₄⁺/NH₃) жёлто-бурая окраска, λ 400–425 нм. Содержит ртуть — только в спецконтейнер!", "Yellow-brown colour with ammonium (NH₄⁺/NH₃), λ 400–425 nm. Contains mercury — special waste only!") },
    { id: "dpa", g: "wat", st: "u", k: "l", f: "(C₆H₅)₂NH / H₂SO₄", col: "#f8fafc", haz: ["cor", "tox", "env"], hood: true, dH: 1600, n: t3("Дифениламин (конц. H₂SO₄ да)", "Дифениламин (в конц. H₂SO₄)", "Diphenylamine (in conc. H₂SO₄)"), c: { SO4: 17 }, ex: { dpa: 1 }, d: t3("Нитрат ва нитрит билан тўқ кўк ранг — сифат реакцияси. Концентрланган кислота, бир томчи етади!", "С нитратом и нитритом — тёмно-синяя окраска (качественная реакция). Концентрированная кислота, хватает капли!", "Turns deep blue with nitrate and nitrite (qualitative test). Concentrated acid — one drop is enough!") },
    { id: "mnso4", g: "wat", st: "u", k: "l", f: "MnSO₄ (Винклер I)", col: "#fdf2f8", haz: ["irr", "env"], n: t3("Марганец (II) сульфат (Винклер I)", "Сульфат марганца (II) (Винклер I)", "Manganese(II) sulfate (Winkler I)"), c: { Mn2: 2.15, SO4: 2.15 }, d: t3("Кислородни «қотиришнинг» 1-босқичи: ишқорда оқ Mn(OH)₂ кислород билан қўнғир MnO(OH)₂ га айланади.", "1-й этап фиксации кислорода: в щёлочи белый Mn(OH)₂ с кислородом переходит в бурый MnO(OH)₂.", "Step 1 of oxygen fixing: in alkali, white Mn(OH)₂ reacts with oxygen to brown MnO(OH)₂.") },
    { id: "aki", g: "wat", st: "u", k: "l", f: "NaOH + KI + NaN₃", col: "#f8fafc", haz: ["cor", "tox"], n: t3("Ишқорий йодид-азид (Винклер II)", "Щелочной иодид-азид (Винклер II)", "Alkali-iodide-azide (Winkler II)"), c: { Na: 12.5, K: 0.9, I: 0.9 }, d: t3("NaOH 500 г/л + KI 150 г/л. Азид нитрит халақитини йўқотади. Жуда ўювчи — кўзойнак шарт!", "NaOH 500 г/л + KI 150 г/л. Азид устраняет мешающее влияние нитрита. Очень едкий — очки обязательны!", "NaOH 500 g/L + KI 150 g/L. Azide removes nitrite interference. Very caustic — goggles required!") },
    { id: "h2so4c", g: "wat", st: "u", k: "l", f: "H₂SO₄ 98%", col: "#f8fafc", haz: ["cor"], hood: true, dH: 1770, n: t3("Сульфат кислота, концентрланган", "Серная кислота концентрированная", "Concentrated sulfuric acid"), c: { SO4: 18.4 }, d: t3("Винклер усулида чўкмани эритиб, йодни ажратади. Доим «кислотани сувга» — тескариси қайнаб сачрайди!", "В методе Винклера растворяет осадок и выделяет иод. Всегда «кислоту в воду» — наоборот вскипает и разбрызгивается!", "Dissolves the Winkler floc and frees iodine. Always add acid to water — never the reverse!") },
    { id: "thio", g: "wat", st: "u", k: "l", f: "Na₂S₂O₃ 0,025M", col: "#f8fafc", n: t3("Натрий тиосульфат 0,025 М", "Тиосульфат натрия 0,025 М", "Sodium thiosulfate 0.025 M"), c: { Na: 0.05, S2O3: 0.025 }, d: t3("Йодни титрлайди: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻. 200 мл намунада 1 мл ≈ 1 мг/л O₂.", "Титрует иод: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻. Для 200 мл пробы 1 мл ≈ 1 мг/л O₂.", "Titrates iodine: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻. For a 200 mL sample 1 mL ≈ 1 mg/L O₂.") },
    /* Тупроқ реактивлари */
    { id: "kcl1", g: "soil", st: "m", k: "l", f: "KCl 1M", col: "#f8fafc", n: t3("Калий хлорид 1 М (ажратгич)", "Хлорид калия 1 М (экстрагент)", "Potassium chloride 1 M (extractant)"), c: { K: 1, Cl: 1 }, d: t3("Тупроқдан алмашинувчи H⁺ ни сиқиб чиқаради: pH(KCl) < pH(H₂O) бўлса, тупроқда алмашинувчи кислоталик бор.", "Вытесняет обменный H⁺ из почвы: если pH(KCl) < pH(H₂O), в почве есть обменная кислотность.", "Displaces exchangeable H⁺: if pH(KCl) < pH(H₂O), the soil has exchangeable acidity.") },
    { id: "hcl10", g: "soil", st: "u", k: "l", f: "HCl 10%", col: "#f8fafc", haz: ["cor"], hood: true, n: t3("Хлорид кислота 10 %", "Соляная кислота 10 %", "Hydrochloric acid 10 %"), c: { Cl: 2.9 }, d: t3("Тупроқ карбонатлари: «қайнаш» (CO₂) кучига қараб CaCO₃ миқдори баҳоланади.", "Карбонаты почвы: по силе «вскипания» (CO₂) оценивают содержание CaCO₃.", "Soil carbonates: the strength of fizzing (CO₂) shows the CaCO₃ content.") },
    { id: "k2cr2o7", g: "soil", st: "u", k: "l", f: "K₂Cr₂O₇ 0,4н / H₂SO₄", col: "#ea580c", haz: ["tox", "ox", "cor", "hp", "env"], hood: true, dH: 900, n: t3("Калий бихромат 0,4 н (Тюрин)", "Бихромат калия 0,4 н (Тюрин)", "Potassium dichromate 0.4 N (Tyurin)"), c: { SO4: 9 }, ex: { cr6: 0.0667 }, d: t3("Қайнатилганда тупроқ органик углеродини оксидлайди: Cr(VI) зарғалдоқ → Cr(III) яшил. Гумус = C × 1,724. Канцероген!", "При кипячении окисляет органический углерод почвы: Cr(VI) оранжевый → Cr(III) зелёный. Гумус = C × 1,724. Канцероген!", "Boiling oxidises soil organic carbon: orange Cr(VI) → green Cr(III). Humus = C × 1.724. Carcinogen!") },
    /* Ўғитлар ва қўшимча реагентлар (Ekomun 3.4) */
    { id: "kno3", g: "soil", st: "m", k: "s", f: "KNO₃", col: "#ffffff", haz: ["ox"], n: t3("Калий нитрат (калийли селитра)", "Нитрат калия (калийная селитра)", "Potassium nitrate (saltpetre)"), c: { K: 9.89, NO3: 9.89 }, d: t3("Азот-калийли ўғит: 1 г = 9,89 ммоль. Ортиқчаси ер ости сувларига нитрат бўлиб ўтади.", "Азотно-калийное удобрение: 1 г = 9,89 ммоль. Избыток уходит в грунтовые воды нитратом.", "A nitrogen-potassium fertiliser: 1 g = 9.89 mmol. The excess leaches into groundwater as nitrate.") },
    { id: "nh4cl", g: "soil", st: "m", k: "s", f: "NH₄Cl", col: "#ffffff", haz: ["irr"], n: t3("Аммоний хлорид (новшадил)", "Хлорид аммония (нашатырь)", "Ammonium chloride (sal ammoniac)"), c: { NH: 18.7, Cl: 18.7 }, d: t3("1 г = 18,7 ммоль. Эритмаси кучсиз кислотали (NH₄⁺ гидролизи); ишқор билан аммиак ҳиди.", "1 г = 18,7 ммоль. Раствор слабокислый (гидролиз NH₄⁺); со щёлочью — запах аммиака.", "1 g = 18.7 mmol. Its solution is slightly acidic (NH₄⁺ hydrolysis); with alkali it smells of ammonia.") },
    { id: "cano3", g: "soil", st: "m", k: "s", f: "Ca(NO₃)₂", col: "#ffffff", haz: ["ox", "irr"], n: t3("Кальций нитрат (кальцийли селитра)", "Нитрат кальция (кальциевая селитра)", "Calcium nitrate"), c: { Ca: 6.09, NO3: 12.19 }, d: t3("Ўғит: 1 г = 6,09 ммоль. Сувни қаттиқлаштиради (Ca²⁺) ва нитрат беради.", "Удобрение: 1 г = 6,09 ммоль. Добавляет жёсткость (Ca²⁺) и нитрат.", "Fertiliser: 1 g = 6.09 mmol. Adds hardness (Ca²⁺) and nitrate.") },
    { id: "mgso4", g: "base", st: "m", k: "s", f: "MgSO₄", col: "#ffffff", n: t3("Магний сульфат (аччиқ туз)", "Сульфат магния (английская соль)", "Magnesium sulfate (Epsom salt)"), c: { Mg: 8.31, SO4: 8.31 }, d: t3("1 г = 8,31 ммоль. Сувга доимий қаттиқлик беради (Mg²⁺).", "1 г = 8,31 ммоль. Придаёт воде постоянную жёсткость (Mg²⁺).", "1 g = 8.31 mmol. Gives water permanent hardness (Mg²⁺).") },
    { id: "na2so4", g: "base", st: "m", k: "s", f: "Na₂SO₄", col: "#ffffff", n: t3("Натрий сульфат (глаубер тузи)", "Сульфат натрия (глауберова соль)", "Sodium sulfate (Glauber's salt)"), c: { Na: 14.08, SO4: 7.04 }, d: t3("1 г = 7,04 ммоль. Орол бўйи шўрхоклари таркибида кўп.", "1 г = 7,04 ммоль. Много в солончаках Приаралья.", "1 g = 7.04 mmol. Abundant in the Aral-region salt flats.") },
    { id: "mgcl2", g: "lab", st: "m", k: "l", f: "MgCl₂ 0,1M", col: "#f8fafc", n: t3("Магний хлорид 0,1 М", "Хлорид магния 0,1 М", "Magnesium chloride 0.1 M"), c: { Mg: 0.1, Cl: 0.2 }, d: t3("Ишқор билан оқ Mg(OH)₂ чўкмаси (pH > 10).", "Со щёлочью — белый осадок Mg(OH)₂ (pH > 10).", "With alkali gives white Mg(OH)₂ (pH > 10).") },
    { id: "ki", g: "lab", st: "m", k: "l", f: "KI 0,1M", col: "#f8fafc", n: t3("Калий йодид 0,1 М", "Иодид калия 0,1 М", "Potassium iodide 0.1 M"), c: { K: 0.1, I: 0.1 }, d: t3("Йодид иони: оксидловчилар уни йодгача оксидлайди (крахмал билан кўк).", "Иодид-ион: окислители окисляют его до иода (с крахмалом синий).", "Iodide ion: oxidants turn it into iodine (blue with starch).") },
    { id: "koh", g: "lab", st: "u", k: "l", f: "KOH 0,1M", col: "#f8fafc", haz: ["cor"], n: t3("Калий гидроксид 0,1 М", "Гидроксид калия 0,1 М", "Potassium hydroxide 0.1 M"), c: { K: 0.1 }, d: t3("Кучли ишқор. Ҳаводаги CO₂ ни ютади — оғзини ёпиб сақланг.", "Сильная щёлочь. Поглощает CO₂ из воздуха — хранить закрытой.", "A strong alkali. Absorbs CO₂ from air — keep it closed.") },
    { id: "nh3aq", g: "lab", st: "u", k: "l", f: "NH₃·H₂O 1M", col: "#f8fafc", haz: ["cor", "env"], hood: true, n: t3("Аммиак эритмаси 1 М", "Раствор аммиака 1 М", "Ammonia solution 1 M"), c: { NH: 1 }, d: t3("Кучсиз асос (pKa 9,25). Мис тузи билан тўқ кўк аммиакат. Тортиш шкафида!", "Слабое основание (pKa 9,25). С солью меди — ярко-синий аммиакат. Под тягой!", "A weak base (pKa 9.25). Gives a deep-blue ammine with copper salts. Use the fume hood!") },
    { id: "h3po4", g: "lab", st: "u", k: "l", f: "H₃PO₄ 0,1M", col: "#f8fafc", haz: ["cor"], n: t3("Фосфат кислота 0,1 М", "Фосфорная кислота 0,1 М", "Phosphoric acid 0.1 M"), c: { P: 0.1 }, d: t3("Ўрта кучли уч негизли кислота (pKa 2,15; 7,20; 12,35). Ўғитлар ва ичимликлар саноатида.", "Трёхосновная кислота средней силы (pKa 2,15; 7,20; 12,35). Удобрения, напитки.", "A medium-strength triprotic acid (pKa 2.15, 7.20, 12.35). Fertilisers and soft drinks.") },
    { id: "na3po4", g: "lab", st: "u", k: "l", f: "Na₃PO₄ 0,1M", col: "#f8fafc", haz: ["irr"], n: t3("Натрий фосфат 0,1 М", "Фосфат натрия 0,1 М", "Sodium phosphate 0.1 M"), c: { Na: 0.3, P: 0.1 }, d: t3("Кучли ишқорий эритма (PO₄³⁻ гидролизи). Кир ювиш воситаларидаги фосфатлар — кўллар эвтрофикацияси сабаби.", "Сильнощелочной раствор (гидролиз PO₄³⁻). Фосфаты из моющих средств — причина эвтрофикации озёр.", "A strongly alkaline solution (PO₄³⁻ hydrolysis). Detergent phosphates drive lake eutrophication.") },
    { id: "alum", g: "wat", st: "m", k: "l", f: "Al₂(SO₄)₃ 0,05M", col: "#f8fafc", haz: ["irr"], n: t3("Алюминий сульфат 0,05 М (коагулянт)", "Сульфат алюминия 0,05 М (коагулянт)", "Aluminium sulfate 0.05 M (coagulant)"), c: { Al: 0.1, SO4: 0.15 }, d: t3("Сув тозалаш иншоотларида коагулянт: Al(OH)₃ парчалари лойқа заррачаларни ўзига ёпиштириб чўктиради.", "Коагулянт на водоочистных станциях: хлопья Al(OH)₃ захватывают муть и оседают.", "A coagulant in water-treatment plants: Al(OH)₃ flocs trap the cloudiness and settle.") },
    /* Буферлар ва стандартлар */
    { id: "buf4", g: "std", st: "m", k: "l", f: "pH 4,00", col: "#fecaca", n: t3("Буфер pH 4,0", "Буфер pH 4,0", "Buffer pH 4.0"), c: { Ac: 0.1, Na: 0.0154 }, d: t3("pH-метрни калибрлаш учун (ацетат модели). Электродни ҳар буфердан кейин дистилланган сув билан чайинг.", "Для калибровки pH-метра (ацетатная модель). Ополаскивайте электрод дистиллятом после каждого буфера.", "For pH meter calibration (acetate model). Rinse the electrode with distilled water between buffers.") },
    { id: "buf7", g: "std", st: "m", k: "l", f: "pH 7,00", col: "#bbf7d0", n: t3("Буфер pH 7,0", "Буфер pH 7,0", "Buffer pH 7.0"), c: { P: 0.05, Na: 0.0694 }, d: t3("Фосфатли буфер — калибрлашнинг биринчи нуқтаси (ноль нуқта).", "Фосфатный буфер — первая точка калибровки (нулевая точка).", "Phosphate buffer — the first (zero) calibration point.") },
    { id: "buf10", g: "std", st: "m", k: "l", f: "pH 10,00", col: "#bfdbfe", n: t3("Буфер pH 10,0", "Буфер pH 10,0", "Buffer pH 10.0"), c: { C: 0.05, Na: 0.066 }, d: t3("Карбонатли буфер — ишқорий намуналар учун калибрлаш нуқтаси.", "Карбонатный буфер — точка калибровки для щелочных проб.", "Carbonate buffer — calibration point for alkaline samples.") },
    { id: "kclstd", g: "std", st: "m", k: "l", f: "KCl 0,01M", col: "#f8fafc", n: t3("KCl 0,01 М (1413 мкСм/см)", "KCl 0,01 М (1413 мкСм/см)", "KCl 0.01 M (1413 µS/cm)"), c: { K: 0.01, Cl: 0.01 }, d: t3("Кондуктометрни текшириш учун стандарт: 25 °C да 1413 мкСм/см.", "Стандарт для проверки кондуктометра: 1413 мкСм/см при 25 °C.", "Conductivity check standard: 1413 µS/cm at 25 °C.") },
    { id: "nstd", g: "std", st: "m", k: "l", f: "NO₃⁻-N 10 мг/л", col: "#f8fafc", n: t3("Нитрат стандарти 10 мг/л N", "Стандарт нитрата 10 мг/л N", "Nitrate standard 10 mg/L N"), c: { K: 0.000714, NO3: 0.000714 }, d: t3("KNO₃ эритмаси. Тест-тасма ва калибрлаш эгри чизиғи учун.", "Раствор KNO₃. Для тест-полосок и калибровочной кривой.", "KNO₃ solution for test strips and calibration curves.") },
    { id: "no2std", g: "std", st: "m", k: "l", f: "NO₂⁻-N 0,1 мг/л", col: "#f8fafc", n: t3("Нитрит стандарти 0,1 мг/л N", "Стандарт нитрита 0,1 мг/л N", "Nitrite standard 0.1 mg/L N"), c: { Na: 0.00000714, NO2: 0.00000714 }, d: t3("NaNO₂ эритмаси. Грисс реакцияси учун калибрлаш нуқтаси.", "Раствор NaNO₂. Точка калибровки для реакции Грисса.", "NaNO₂ solution — calibration point for the Griess test.") },
    { id: "pstd", g: "std", st: "m", k: "l", f: "PO₄³⁻-P 1 мг/л", col: "#f8fafc", n: t3("Фосфат стандарти 1 мг/л P", "Стандарт фосфата 1 мг/л P", "Phosphate standard 1 mg/L P"), c: { K: 0.0000323, P: 0.0000323 }, d: t3("KH₂PO₄ эритмаси. Молибден кўки усулида калибрлаш учун.", "Раствор KH₂PO₄. Для калибровки по молибденовой сини.", "KH₂PO₄ solution for molybdenum-blue calibration.") },
    { id: "nhstd", g: "std", st: "m", k: "l", f: "NH₄⁺-N 1 мг/л", col: "#f8fafc", n: t3("Аммоний стандарти 1 мг/л N", "Стандарт аммония 1 мг/л N", "Ammonium standard 1 mg/L N"), c: { NH: 0.0000714, Cl: 0.0000714 }, d: t3("NH₄Cl эритмаси. Несслер усулида калибрлаш учун.", "Раствор NH₄Cl. Для калибровки по Несслеру.", "NH₄Cl solution for Nessler calibration.") }
  ];
  const RG = [
    ["base", "fa-house", t3("Уй-рўзғор", "Бытовые", "Household")],
    ["ind", "fa-palette", t3("Индикаторлар", "Индикаторы", "Indicators")],
    ["eco", "fa-water", t3("Сув намуналари", "Пробы воды", "Water samples")],
    ["soil", "fa-seedling", t3("Тупроқ", "Почва", "Soil")],
    ["wat", "fa-vials", t3("Сув таҳлили", "Анализ воды", "Water analysis")],
    ["lab", "fa-flask-vial", t3("Лаборатория реагентлари", "Лабораторные реактивы", "Lab reagents")],
    ["std", "fa-sliders", t3("Буфер ва стандартлар", "Буферы и стандарты", "Buffers & standards")]
  ];
  const RID = Object.fromEntries(R.map((r) => [r.id, r]));
  const VES = {
    beaker: { max: 250, ic: "fa-glass-water", n: t3("Стакан 250 мл", "Стакан 250 мл", "Beaker 250 mL") },
    flask: { max: 250, ic: "fa-flask", n: t3("Колба 250 мл", "Колба 250 мл", "Flask 250 mL") },
    bod: { max: 300, ic: "fa-bottle-water", n: t3("Кислород шишаси 300 мл", "Кислородная склянка 300 мл", "BOD bottle 300 mL") },
    tube: { max: 20, ic: "fa-vial", n: t3("Пробирка 20 мл", "Пробирка 20 мл", "Test tube 20 mL") }
  };
  const AMT_L = [0.05, 0.1, 0.5, 1, 5, 20, 50], AMT_S = [0.1, 1, 5];

  /* ---------- Кашфиётлар ва вазифалар ---------- */
  const DISC = [
    ["co2", "🫧", "m", t3("Карбонат + кислота → CO₂", "Карбонат + кислота → CO₂", "Carbonate + acid → CO₂"), "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑"],
    ["marble", "🏛️", "m", t3("Кислотали ёмғир мармарни емиради", "Кислотный дождь разъедает мрамор", "Acid rain dissolves marble"), "CaCO₃ + 2H⁺ → Ca²⁺ + H₂O + CO₂↑"],
    ["cab", "🌈", "m", t3("Карам индикатори рангини ўзгартирди", "Капустный индикатор сменил цвет", "Cabbage indicator changed colour"), "pH < 5: қизил · pH > 9: кўк-яшил"],
    ["lime", "🥛", "m", t3("Оҳак суви лойқаланди (CO₂ бор!)", "Известковая вода помутнела (есть CO₂!)", "Limewater turned milky (CO₂ present!)"), "Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O"],
    ["iod", "🟦", "m", t3("Йод + крахмал → тўқ кўк", "Йод + крахмал → тёмно-синий", "Iodine + starch → dark blue"), "I₂ + (C₆H₁₀O₅)ₙ → кўк комплекс"],
    ["vitc", "🍊", "m", t3("Витамин C йод рангини йўқотди", "Витамин C обесцветил йод", "Vitamin C removed the iodine colour"), "C₆H₈O₆ + I₂ → C₆H₆O₆ + 2HI"],
    ["o2", "🫁", "m", t3("Ачитқи H₂O₂ дан кислород ажратди", "Дрожжи выделили кислород из H₂O₂", "Yeast released oxygen from H₂O₂"), "2H₂O₂ → 2H₂O + O₂↑ (каталаза)"],
    ["hard", "🧼", "m", t3("Қаттиқ сувда совун кўпикламайди", "В жёсткой воде мыло не пенится", "Soap won't lather in hard water"), "Ca²⁺ + 2C₁₇H₃₅COO⁻ → Ca(C₁₇H₃₅COO)₂↓"],
    ["neut", "⚖️", "m", t3("Нейтраллаш: pH 6,5–7,5", "Нейтрализация: pH 6,5–7,5", "Neutralisation: pH 6.5–7.5"), "H⁺ + OH⁻ → H₂O"],
    ["agcl", "⚪", "u", t3("Хлорид аниқланди: AgCl чўкмаси", "Обнаружен хлорид: осадок AgCl", "Chloride found: AgCl precipitate"), "Ag⁺ + Cl⁻ → AgCl↓"],
    ["baso4", "🤍", "u", t3("Сульфат аниқланди: BaSO₄ чўкмаси", "Обнаружен сульфат: осадок BaSO₄", "Sulfate found: BaSO₄ precipitate"), "Ba²⁺ + SO₄²⁻ → BaSO₄↓"],
    ["cuoh", "🔵", "u", t3("Мис гидроксиди: кўк чўкма", "Гидроксид меди: синий осадок", "Copper hydroxide: blue precipitate"), "Cu²⁺ + 2OH⁻ → Cu(OH)₂↓"],
    ["cuo", "⚫", "u", t3("Қиздирилганда CuO қораяди", "При нагреве чернеет: CuO", "Heating turns it black: CuO"), "Cu(OH)₂ →(t°) CuO + H₂O"],
    ["feoh", "🟤", "u", t3("Темир (III) гидроксиди: қўнғир чўкма", "Гидроксид железа (III): бурый осадок", "Iron(III) hydroxide: brown precipitate"), "Fe³⁺ + 3OH⁻ → Fe(OH)₃↓"],
    ["fescn", "🩸", "u", t3("Темир аниқланди: қон-қизил ранг", "Обнаружено железо: кроваво-красный", "Iron found: blood-red colour"), "Fe³⁺ + SCN⁻ → [Fe(SCN)]²⁺"],
    ["mn", "🟣", "u", t3("Перманганат органикада рангсизланди", "Перманганат обесцветился органикой", "Permanganate bleached by organics"), "MnO₄⁻ + органика + H⁺ → Mn²⁺ + CO₂ + H₂O"],
    ["php", "🌸", "u", t3("Фенолфталеин: ишқорда малина ранг", "Фенолфталеин: малиновый в щёлочи", "Phenolphthalein: pink in alkali"), "pH > 8,2"],
    ["heat", "🌡️", "u", t3("Нейтраллашда иссиқлик ажралди (термометр кўтарилди)", "При нейтрализации выделилось тепло (термометр поднялся)", "Neutralisation released heat (the thermometer rose)"), "H⁺ + OH⁻ → H₂O, ΔH = −55,8 кЖ/моль"],
    ["ec", "⚡", "m", t3("Тузли сув токни яхши ўтказади (EC > 1000 мкСм/см)", "Солёная вода хорошо проводит ток (EC > 1000 мкСм/см)", "Salty water conducts well (EC > 1000 µS/cm)"), "κ = Σ λᵢ·cᵢ"],
    ["soilco2", "🟫", "m", t3("Тупроқ карбонати кислотада «қайнади»", "Карбонат почвы «вскипел» в кислоте", "Soil carbonate fizzed in acid"), "CaCO₃ + 2H⁺ → Ca²⁺ + H₂O + CO₂↑"],
    ["dust", "🌫️", "m", t3("Фильтрда ҳаводаги чанг тўпланди", "На фильтре осела пыль из воздуха", "Airborne dust collected on the filter"), "C = m / V (мкг/м³)"],
    ["strip", "🧾", "m", t3("Тест-тасма нитратни кўрсатди", "Тест-полоска показала нитрат", "The test strip showed nitrate"), "NO₃⁻ > 25 мг/л"],
    ["ebt", "💧", "u", t3("ЭДТА охирги нуқтаси: вино-қизил → кўк", "Конечная точка ЭДТА: винно-красный → синий", "EDTA end point: wine-red → blue"), "Ca²⁺ + H₂Y²⁻ → CaY²⁻ + 2H⁺"],
    ["mohr", "🟠", "u", t3("Мор усули: қизил-қўнғир Ag₂CrO₄", "Метод Мора: красно-бурый Ag₂CrO₄", "Mohr method: red-brown Ag₂CrO₄"), "2Ag⁺ + CrO₄²⁻ → Ag₂CrO₄↓"],
    ["azo", "🌺", "u", t3("Нитрит: Грисс азобўёғи", "Нитрит: азокраситель Грисса", "Nitrite: Griess azo dye"), "NO₂⁻ + ArNH₂ + H⁺ → ArN₂⁺ → азобўёқ"],
    ["moblue", "🔷", "u", t3("Фосфат: молибден кўки", "Фосфат: молибденовая синь", "Phosphate: molybdenum blue"), "PO₄³⁻ + 12MoO₄²⁻ → [PMo₁₂O₄₀]³⁻ → кўк"],
    ["ness", "🟨", "u", t3("Аммоний: Несслер ранги", "Аммоний: окраска Несслера", "Ammonium: Nessler colour"), "2[HgI₄]²⁻ + NH₃ + 3OH⁻ → Hg₂NI·H₂O↓"],
    ["win", "🟫", "u", t3("Винклер: кислород қўнғир чўкмада «қотирилди»", "Винклер: кислород «зафиксирован» в буром осадке", "Winkler: oxygen fixed in a brown floc"), "2Mn(OH)₂ + O₂ → 2MnO(OH)₂↓"],
    ["dpa", "🫐", "u", t3("Нитрат: дифениламин кўки", "Нитрат: синь дифениламина", "Nitrate: diphenylamine blue"), "NO₃⁻ + (C₆H₅)₂NH → кўк хинон-имин"],
    ["humus", "🟩", "u", t3("Тюрин: Cr(VI) → Cr(III), гумус оксидланди", "Тюрин: Cr(VI) → Cr(III), гумус окислен", "Tyurin: Cr(VI) → Cr(III), humus oxidised"), "2Cr₂O₇²⁻ + 3C + 16H⁺ → 4Cr³⁺ + 3CO₂ + 8H₂O"],
    ["so2", "🏭", "u", t3("Ҳаводаги SO₂ йодни рангсизлантирди", "SO₂ воздуха обесцветил иод", "Airborne SO₂ decolourised iodine"), "SO₂ + I₂ + 2H₂O → H₂SO₄ + 2HI"],
    ["exch", "🍂", "u", t3("KCl алмашинувчи кислоталикни сиқиб чиқарди", "KCl вытеснил обменную кислотность", "KCl released exchangeable acidity"), "[ППК]Al + 3K⁺ → [ППК]3K + Al³⁺"]
  ];
  const MIS = [
    ["rainph", "m", t3("Кислотали ёмғир намунасининг pH ини индикатор билан аниқланг", "Определите pH кислотного дождя с индикатором", "Find the pH of the acid-rain sample with an indicator"), (s, e) => s.used.has("rain") && (s.ind.cab > 0 || s.ind.uni > 0 || s.paper) && e.pH < 5.6],
    ["rainfix", "m", t3("Кислотали ёмғирни сода ёки оҳак суви билан нейтралланг (pH 6,5–7,5)", "Нейтрализуйте кислотный дождь содой или известковой водой (pH 6,5–7,5)", "Neutralise the acid rain with soda or limewater (pH 6.5–7.5)"), (s, e) => s.used.has("rain") && (s.used.has("soda") || s.used.has("lime") || s.used.has("marble")) && e.pH >= 6.5 && e.pH <= 7.5],
    ["breath", "m", t3("Нафасимизда CO₂ борлигини оҳак суви билан исботланг", "Докажите известковой водой, что в дыхании есть CO₂", "Prove with limewater that our breath contains CO₂"), (s) => s.disc.has("lime") && s.breath > 0],
    ["hardw", "m", t3("Водопровод ёки дарё суви қаттиқлигини совун билан текширинг", "Проверьте жёсткость водопроводной или речной воды мылом", "Test the hardness of tap or river water with soap"), (s) => s.disc.has("hard") && (s.used.has("tap") || s.used.has("river"))],
    ["river", "u", t3("Сирдарё сувида хлорид ва сульфат ионларини аниқланг", "Обнаружьте хлорид и сульфат в воде Сырдарьи", "Detect chloride and sulfate in the Syr Darya sample"), (s) => s.used.has("river") && s.seen.has("agcl") && s.seen.has("baso4")],
    ["cod", "u", t3("Оқова сувдаги органик ифлосликни перманганат билан исботланг", "Докажите органическое загрязнение сточной воды перманганатом", "Prove organic pollution in the wastewater with permanganate"), (s) => s.used.has("wastew") && s.disc.has("mn")],
    ["titr", "u", t3("0,1 М HCl ни 0,1 М NaOH билан фенолфталеин иштирокида титрланг (биринчи барқарор пушти ранг)", "Оттитруйте 0,1 М HCl раствором 0,1 М NaOH с фенолфталеином (первая устойчивая розовая окраска)", "Titrate 0.1 M HCl with 0.1 M NaOH using phenolphthalein (first lasting pink)"), (s, e) => s.used.has("hcl") && s.used.has("naoh") && s.ind.php > 0 && e.pH > 8.2 && e.pH < 12],
    ["iron", "u", t3("Қудуқ сувида темир (III) ионларини роданид билан аниқланг", "Обнаружьте ионы железа (III) в колодезной воде роданидом", "Detect iron(III) in the well water with thiocyanate"), (s) => s.used.has("well") && s.seen.has("fescn")],
    ["salt", "m", t3("Шўрланган тупроқ сўримининг электр ўтказувчанлигини ўлчанг", "Измерьте электропроводность вытяжки засолённой почвы", "Measure the conductivity of the saline-soil extract"), (s) => s.used.has("soilsal") && !!s.meas.cond && s.meas.cond > 1000],
    ["nitr", "m", t3("Ўғитланган тупроқ сўримида нитратни тест-тасма билан топинг", "Найдите нитрат в вытяжке удобренной почвы тест-полоской", "Find nitrate in the fertilised-soil extract with a test strip"), (s) => s.used.has("soilfert") && (s.meas.strip || 0) >= 25],
    ["room", "m", t3("Синфхона ҳавосидаги CO₂ ни газ анализатор билан ўлчанг", "Измерьте CO₂ в воздухе класса газоанализатором", "Measure classroom CO₂ with the gas analyser"), (s) => s.meas.gas === "class"],
    ["cal", "m", t3("pH-метрни икки буферда калибрланг", "Откалибруйте pH-метр по двум буферам", "Calibrate the pH meter with two buffers"), () => calPts.size >= 2],
    ["sd", "m", t3("Кўл ёки дарё сувининг тиниқлигини Секки диски билан ўлчанг", "Измерьте прозрачность воды диском Секки", "Measure lake or river transparency with the Secchi disk"), (s) => !!s.meas.secchi],
    ["hard2", "u", t3("Водопровод сувининг умумий қаттиқлигини ЭДТА билан аниқланг", "Определите общую жёсткость водопроводной воды ЭДТА", "Determine tap-water total hardness with EDTA"), (s) => s.used.has("tap") && s.disc.has("ebt")],
    ["winkler", "u", t3("Дарё сувидаги кислородни Винклер усулида титрланг", "Оттитруйте кислород в речной воде по Винклеру", "Titrate dissolved oxygen in river water (Winkler)"), (s) => s.used.has("river") && s.disc.has("win") && s.used.has("thio") && (s.extra.I2 || 0) < 2e-5 && (s.extra.mnooh || 0) < 1e-5],
    ["bod", "u", t3("Оқова сувнинг БПК₅ ини суюлтириш усулида аниқланг", "Определите БПК₅ сточной воды методом разбавления", "Measure wastewater BOD₅ by dilution"), (s) => !!s.meas.bodOk],
    ["phos", "u", t3("Кўл сувидаги фосфатни спектрофотометрда ўлчанг", "Измерьте фосфат в воде озера на спектрофотометре", "Measure pond phosphate on the spectrophotometer"), (s) => s.used.has("pond") && s.meas.spec === "moblue"],
    ["so2m", "u", t3("Саноат зонаси ҳавосидаги SO₂ ни йод-крахмал ютгичда исботланг", "Докажите SO₂ в воздухе промзоны иод-крахмальным поглотителем", "Prove industrial SO₂ with an iodine-starch absorber"), (s) => s.disc.has("so2")],
    ["humus", "u", t3("Тупроқ гумусини Тюрин усулида оксидланг", "Окислите гумус почвы по методу Тюрина", "Oxidise soil humus by the Tyurin method"), (s) => s.disc.has("humus")],
    ["acid", "u", t3("Кислотали тупроқда pH(H₂O) ва pH(KCl) ни солиштиринг", "Сравните pH(H₂O) и pH(KCl) кислой почвы", "Compare pH(H₂O) and pH(KCl) of the acidic soil"), (s) => s.disc.has("exch")],
    ["metal", "u", t3("Олмалиқ тупроғидаги оғир металларни ААС да ўлчанг", "Измерьте тяжёлые металлы почвы Алмалыка на ААС", "Measure Almalyk soil heavy metals with AAS"), (s) => s.meas.aas === "soilind"]
  ];
  const RECIPES = [
    { id: "vulkan", st: "m", ic: "🌋", n: t3("Кўпикли вулқон", "Пенный вулкан", "Foam volcano"), v: "beaker", s: [["soda", 1], ["soda", 1], ["cabbage", 5], ["vinegar", 20]], w: t3("Сода ва сирка учрашганда CO₂ гази ажралади; карам шираси муҳит кислотали бўлганини кўрсатади.", "При встрече соды и уксуса выделяется CO₂; капустный сок показывает кислую среду.", "Soda and vinegar release CO₂; cabbage juice shows the medium turned acidic.") },
    { id: "kamalak", st: "m", ic: "🌈", n: t3("pH камалаги", "Радуга pH", "pH rainbow"), v: "beaker", s: [["water", 20], ["cabbage", 5], ["lemon", 5], ["soda", 1], ["soda", 1]], w: t3("Аввал лимон — қизил-пушти, кейин сода — бинафша, кўк, яшил.", "Сначала лимон — красно-розовый, затем сода — фиолетовый, синий, зелёный.", "Lemon first — red-pink, then soda — purple, blue, green.") },
    { id: "qattiq", st: "m", ic: "🧼", n: t3("Сув қаттиқлиги", "Жёсткость воды", "Water hardness"), v: "tube", s: [["tap", 5], ["soap", 1], ["@stir"]], w: t3("Ca²⁺ совун билан эримайдиган «ғубор» ҳосил қилади. Дистилланган сувда такрорланг ва солиштиринг.", "Ca²⁺ с мылом даёт нерастворимый налёт. Повторите с дистиллированной водой и сравните.", "Ca²⁺ forms insoluble scum with soap. Repeat with distilled water and compare.") },
    { id: "nafas", st: "m", ic: "💨", n: t3("Нафас ва оҳак суви", "Дыхание и известковая вода", "Breath and limewater"), v: "tube", s: [["lime", 10], ["@breath"], ["@breath"]], w: t3("Нафасдаги CO₂ CaCO₃ ҳосил қилади. Найчадан фақат пуфланг, ҳеч қачон ичга тортманг!", "CO₂ дыхания образует CaCO₃. В трубочку только дуть, никогда не втягивать!", "CO₂ in breath forms CaCO₃. Only blow into the straw, never suck!") },
    { id: "yod", st: "m", ic: "🟦", n: t3("Йод, крахмал ва витамин C", "Йод, крахмал и витамин C", "Iodine, starch and vitamin C"), v: "beaker", s: [["water", 20], ["starch", 1], ["iodine", 1], ["vitc", 0.1]], w: t3("Крахмал йод билан кўкаради; витамин C йодни қайтариб, рангни йўқотади.", "Крахмал синеет с йодом; витамин C восстанавливает йод и убирает цвет.", "Starch turns blue with iodine; vitamin C reduces the iodine and removes the colour.") },
    { id: "fil", st: "m", ic: "🐘", n: t3("Фил тиш пастаси (кичик)", "Зубная паста слона (мини)", "Elephant toothpaste (mini)"), v: "flask", s: [["h2o2", 20], ["soap", 1], ["yeast", 1]], w: t3("Ачитқидаги каталаза H₂O₂ ни парчалайди; кислород совун билан кўпик ҳосил қилади. Чўғланган чўп билан текширинг!", "Каталаза дрожжей разлагает H₂O₂; кислород с мылом даёт пену. Проверьте тлеющей лучинкой!", "Yeast catalase splits H₂O₂; oxygen and soap make foam. Test with a glowing splint!") },
    { id: "tahlil", st: "u", ic: "🔎", n: t3("Дарё суви таҳлили", "Анализ речной воды", "River water analysis"), v: "tube", s: [["river", 10], ["agno3", 1]], w: t3("Оқ сузмасимон AgCl — хлорид бор. Янги пробиркада BaCl₂ билан сульфатни текширинг.", "Белый творожистый AgCl — есть хлорид. В новой пробирке проверьте сульфат BaCl₂.", "White curdy AgCl means chloride. In a fresh tube, test for sulfate with BaCl₂.") },
    { id: "titr", st: "u", ic: "📈", n: t3("Кислота–асос титрлаш", "Кислотно-основное титрование", "Acid–base titration"), v: "flask", s: [["hcl", 20], ["php", 0.05], ["naoh", 5], ["naoh", 5], ["naoh", 5], ["naoh", 1], ["naoh", 1], ["naoh", 1], ["naoh", 1], ["naoh", 1]], w: t3("Эквивалент нуқтада (20 мл NaOH) pH кескин сакрайди — журналдаги эгри чизиқни кўринг.", "В точке эквивалентности (20 мл NaOH) pH резко скачет — смотрите кривую в журнале.", "At the equivalence point (20 mL NaOH) the pH jumps — see the curve in the notebook.") },
    { id: "mis", st: "u", ic: "🔵", n: t3("Мис гидроксиди ва қиздириш", "Гидроксид меди и нагрев", "Copper hydroxide and heating"), v: "beaker", s: [["cuso4", 5], ["naoh", 20], ["@heat"]], w: t3("Кўк Cu(OH)₂ 80 °C дан юқорида қора CuO га айланади.", "Синий Cu(OH)₂ выше 80 °C превращается в чёрный CuO.", "Blue Cu(OH)₂ turns into black CuO above 80 °C.") },
    { id: "perm", st: "u", ic: "🟣", n: t3("Перманганат индекси", "Перманганатная окисляемость", "Permanganate index"), v: "tube", s: [["wastew", 10], ["h2so4", 1], ["kmno4", 1], ["@heat"]], w: t3("Органика кўп бўлса, пушти ранг тез йўқолади. Дистилланган сувда пушти қолади.", "При большом количестве органики розовый цвет быстро исчезает. В дистиллированной воде остаётся розовым.", "With lots of organics the pink fades fast; in distilled water it stays pink.") },
    { id: "tuproq", st: "m", ic: "🟫", n: t3("Тупроқ сув сўрими 1:5 ва шўрланиш", "Водная вытяжка 1:5 и засоление", "1:5 soil extract and salinity"), v: "tube", s: [["soilsal", 1], ["water", 5], ["@shake"], ["@filter"], ["@cond"], ["@phm"]], w: t3("EC₁:₅ > 0,9 дС/м (900 мкСм/см) — кучли шўрланган тупроқ. Шўр ювиш ва дренаж керак.", "EC₁:₅ > 0,9 дС/м (900 мкСм/см) — сильнозасолённая почва. Нужны промывки и дренаж.", "EC₁:₅ > 0.9 dS/m (900 µS/cm) means strongly saline soil — leaching and drainage are needed.") },
    { id: "karb", st: "m", ic: "🫧", n: t3("Тупроқда карбонат (сирка билан)", "Карбонаты в почве (с уксусом)", "Soil carbonate (with vinegar)"), v: "beaker", s: [["soilboz", 1], ["soilboz", 1], ["vinegar", 20], ["@stir"]], w: t3("Бўз тупроқда CaCO₃ кўп — пуфакчалар (CO₂) чиқади. Кислотали ўрмон тупроғида «қайнаш» бўлмайди.", "В серозёме много CaCO₃ — идут пузырьки CO₂. Кислая лесная почва не «вскипает».", "Serozem is rich in CaCO₃ and fizzes with CO₂; acidic forest soil does not.") },
    { id: "nitrat", st: "m", ic: "🧾", n: t3("Ўғитланган тупроқда нитрат", "Нитраты в удобренной почве", "Nitrate in fertilised soil"), v: "tube", s: [["soilfert", 1], ["water", 5], ["@shake"], ["@filter"], ["@strip"]], w: t3("1:5 сўримда NO₃⁻ ≈ 50 мг/л → тупроқда ≈ 250 мг/кг. Ортиқча нитрат ер ости сувини ифлослайди.", "В вытяжке 1:5 NO₃⁻ ≈ 50 мг/л → в почве ≈ 250 мг/кг. Избыток нитрата загрязняет грунтовые воды.", "NO₃⁻ ≈ 50 mg/L in the 1:5 extract → ≈ 250 mg/kg in soil; the excess pollutes groundwater.") },
    { id: "havo", st: "m", ic: "💨", n: t3("Синф ҳавосида CO₂ (аспиратор)", "CO₂ в воздухе класса (аспиратор)", "Classroom CO₂ (air pump)"), v: "tube", s: [["lime", 10], ["@asp:class:1", 0, 2], ["@gas:class"], ["@rinse"], ["lime", 10], ["@asp:mount:1", 0, 2]], w: t3("Синфда CO₂ ≈ 1800 ppm: оҳак суви тез лойқаланади. Танаффусда деразаларни очинг!", "В классе CO₂ ≈ 1800 ppm: известковая вода быстро мутнеет. Проветривайте на переменах!", "Classroom CO₂ ≈ 1800 ppm turns limewater milky fast. Open windows at break time!") },
    { id: "kalibr", st: "m", ic: "🎚️", n: t3("pH-метрни калибрлаш", "Калибровка pH-метра", "pH meter calibration"), v: "beaker", s: [["buf7", 20], ["@cal"], ["@rinse"], ["buf4", 20], ["@cal"], ["@rinse"], ["tap", 20], ["@phm"]], w: t3("Калибрланмаган электрод 0,2–0,5 бирликка адашади. Ҳар куни ишдан олдин калибрланг.", "Некалиброванный электрод ошибается на 0,2–0,5 ед. Калибруйте каждый день перед работой.", "An uncalibrated electrode is off by 0.2–0.5 units. Calibrate every day before work.") },
    { id: "sekki", st: "m", ic: "⚫", n: t3("Кўл тиниқлиги ва кислород", "Прозрачность и кислород озера", "Pond transparency and oxygen"), v: "beaker", s: [["pond", 20, 5], ["@secchi"], ["@oxy"], ["@aer"], ["@oxy"], ["@micro"]], w: t3("Секки чуқурлиги 0,35 м → TSI ≈ 75 (гипертрофик). Аэрация кислородни тўйиниш даражасига кўтаради.", "Прозрачность 0,35 м → TSI ≈ 75 (гипертрофный). Аэрация поднимает кислород до насыщения.", "Secchi depth 0.35 m → TSI ≈ 75 (hypertrophic). Aeration lifts oxygen to saturation.") },
    { id: "qattiq2", st: "u", ic: "💧", n: t3("Умумий қаттиқлик (ЭДТА)", "Общая жёсткость (ЭДТА)", "Total hardness (EDTA)"), v: "flask", s: [["tap", 50], ["nh3buf", 1], ["ebt", 0.05], ["edta", 5], ["edta", 5], ["edta", 0.1, 5], ["edta", 0.1, 3]], w: t3("Охирги нуқта ≈ 10,5 мл: Ж = 2 × 0,01 × 10,5 / 0,050 = 4,2 ммоль-экв/л (ўртача қаттиқ сув).", "Конечная точка ≈ 10,5 мл: Ж = 2 × 0,01 × 10,5 / 0,050 = 4,2 ммоль-экв/л (средней жёсткости).", "End point ≈ 10.5 mL: H = 2 × 0.01 × 10.5 / 0.050 = 4.2 mmol-eq/L (moderately hard).") },
    { id: "vinkler", st: "u", ic: "🫧", n: t3("Эриган кислород (Винклер)", "Растворённый кислород (Винклер)", "Dissolved oxygen (Winkler)"), v: "bod", s: [["river", 50, 4], ["mnso4", 1], ["aki", 1], ["@stir"], ["h2so4c", 1], ["@stir"], ["starch", 1], ["thio", 5], ["thio", 1, 3], ["thio", 0.1, 7], ["@oxy"]], w: t3("200 мл намунада O₂ (мг/л) ≈ сарфланган тиосульфат (мл). Кўк ранг йўқолгани — охирги нуқта (≈ 8,6 мл).", "Для 200 мл пробы O₂ (мг/л) ≈ объём тиосульфата (мл). Исчезновение синевы — конечная точка (≈ 8,6 мл).", "For 200 mL, O₂ (mg/L) ≈ thiosulfate used (mL). The blue vanishing is the end point (≈ 8.6 mL).") },
    { id: "bpk", st: "u", ic: "⏳", n: t3("БПК₅ (суюлтириш усули)", "БПК₅ (метод разбавления)", "BOD₅ (dilution method)"), v: "bod", s: [["wastew", 1], ["water", 50, 5], ["water", 20, 2], ["@aer"], ["@oxy"], ["@bod"], ["@oxy"]], w: t3("Суюлтириш 1:291. БПК₅ = (O₂₀ − O₂₅) × 291. Ифлос сув учун 100–400 мг/л, тоза дарё — 2 мг/л дан кам.", "Разбавление 1:291. БПК₅ = (O₂₀ − O₂₅) × 291. Для стоков 100–400 мг/л, чистая река — меньше 2 мг/л.", "Dilution 1:291. BOD₅ = (DO₀ − DO₅) × 291. Wastewater 100–400 mg/L, a clean river < 2 mg/L.") },
    { id: "mor", st: "u", ic: "🟠", n: t3("Хлорид (Мор усули)", "Хлорид (метод Мора)", "Chloride (Mohr method)"), v: "flask", s: [["river", 20], ["k2cro4", 0.5], ["agno3", 1], ["agno3", 0.5], ["agno3", 0.1, 6]], w: t3("Аввал оқ AgCl, кейин биринчи қизил-қўнғир тус — охирги нуқта (≈ 2 мл). Cl⁻ = c·V·35,45/V(намуна).", "Сначала белый AgCl, затем первая красно-бурая окраска — конечная точка (≈ 2 мл). Cl⁻ = c·V·35,45/V(пробы).", "White AgCl first, then the first red-brown tint is the end point (≈ 2 mL). Cl⁻ = c·V·35.45/V(sample).") },
    { id: "griss", st: "u", ic: "🌺", n: t3("Нитрит (Грисс) + спектр", "Нитрит (Грисс) + спектр", "Nitrite (Griess) + spectrum"), v: "tube", s: [["pond", 10], ["griess", 1], ["@spec:540"]], w: t3("Пушти ранг 540 нм да ўлчанади. Ичимлик суви меъёри: NO₂⁻ ≤ 3 мг/л (ЖССТ).", "Розовая окраска измеряется при 540 нм. Норма для питьевой воды: NO₂⁻ ≤ 3 мг/л (ВОЗ).", "The pink colour is read at 540 nm. WHO drinking-water limit: NO₂⁻ ≤ 3 mg/L.") },
    { id: "fosf", st: "u", ic: "🔷", n: t3("Фосфат (молибден кўки)", "Фосфат (молибденовая синь)", "Phosphate (molybdenum blue)"), v: "tube", s: [["pond", 10], ["moly", 1], ["@spec:880"]], w: t3("P > 0,1 мг/л — эвтрофикация хавфи. Манба: ўғит ва кир ювиш воситалари.", "P > 0,1 мг/л — риск эвтрофикации. Источники: удобрения и моющие средства.", "P > 0.1 mg/L means a eutrophication risk; sources are fertiliser and detergents.") },
    { id: "nessler", st: "u", ic: "🟨", n: t3("Аммоний (Несслер)", "Аммоний (Несслер)", "Ammonium (Nessler)"), v: "tube", s: [["wastew", 0.5], ["water", 5, 2], ["ness", 0.5], ["@spec:425"]], w: t3("Сариқ-қўнғир ранг аммонийни кўрсатади. Табиий сувда NH₄⁺ > 0,5 мг/л — яқинда ифлосланганлик белгиси.", "Жёлто-бурая окраска — аммоний. В природной воде NH₄⁺ > 0,5 мг/л — признак свежего загрязнения.", "Yellow-brown means ammonium; NH₄⁺ > 0.5 mg/L in natural water signals fresh pollution.") },
    { id: "tyurin", st: "u", ic: "🟩", n: t3("Гумус (Тюрин усули)", "Гумус (метод Тюрина)", "Humus (Tyurin method)"), v: "tube", s: [["soilacid", 0.1], ["k2cr2o7", 10], ["@heat"]], w: t3("Қайнатганда зарғалдоқ ранг яшилга мойил бўлади (Cr³⁺). Совитиб, 590 нм да ўлчанг.", "При кипячении оранжевый цвет зеленеет (Cr³⁺). Охладите и измерьте при 590 нм.", "Boiling turns orange towards green (Cr³⁺). Cool and read at 590 nm.") },
    { id: "so2", st: "u", ic: "🏭", n: t3("Ҳаводаги SO₂ (йод-крахмал)", "SO₂ в воздухе (иод-крахмал)", "Airborne SO₂ (iodine-starch)"), v: "tube", s: [["water", 10], ["starch", 1], ["iodine", 0.05], ["@asp:mount:100"], ["@asp:ind:100", 0, 2]], w: t3("Тоғ ҳавоси кўк рангни сақлайди, саноат ҳавоси уни 1–2 марта ўтказишда йўқотади. ЖССТ: SO₂ ≤ 40 мкг/м³ (24 соат).", "Горный воздух сохраняет синеву, воздух промзоны снимает её за 1–2 прокачки. ВОЗ: SO₂ ≤ 40 мкг/м³ (24 ч).", "Mountain air keeps the blue; industrial air bleaches it in 1–2 runs. WHO: SO₂ ≤ 40 µg/m³ (24 h).") },
    { id: "kislota", st: "u", ic: "🍂", n: t3("pH(H₂O) ва pH(KCl)", "pH(H₂O) и pH(KCl)", "pH(H₂O) vs pH(KCl)"), v: "tube", s: [["soilacid", 1], ["water", 5], ["@shake"], ["@phm"], ["@rinse"], ["soilacid", 1], ["kcl1", 5], ["@shake"], ["@phm"]], w: t3("KCl даги K⁺ тупроқдан Al³⁺ ва H⁺ ни сиқиб чиқаради — pH(KCl) ≈ 0,8 бирлик паст. Оҳаклаш керак.", "K⁺ из KCl вытесняет Al³⁺ и H⁺ — pH(KCl) ниже ≈ на 0,8 ед. Требуется известкование.", "K⁺ from KCl displaces Al³⁺ and H⁺ — pH(KCl) is ≈ 0.8 units lower; the soil needs liming.") },
    { id: "metall", st: "u", ic: "⚛️", n: t3("Оғир металлар (ААС)", "Тяжёлые металлы (ААС)", "Heavy metals (AAS)"), v: "tube", s: [["soilind", 1], ["@aas"], ["@rinse"], ["soilboz", 1], ["@aas"]], w: t3("Олмалиқ тупроғида Pb ва Zn меъёрдан 3 баравар юқори. Бундай ерда сабзавот экиш тавсия этилмайди.", "В почве Алмалыка Pb и Zn в 3 раза выше нормы. Овощи здесь выращивать не рекомендуется.", "Almalyk soil holds 3× the Pb and Zn limits — growing vegetables there is not advised.") }
  ];
  const RULES = [
    ["fa-shirt", t3("Доим халат, кўзойнак ва қўлқоп кийинг; узун сочни йиғинг.", "Всегда надевайте халат, очки и перчатки; собирайте длинные волосы.", "Always wear a lab coat, goggles and gloves; tie back long hair.")],
    ["fa-ban", t3("Лабораторияда ҳеч нарсани таъм кўрманг, емак-ичмак олиб кирманг.", "Ничего не пробуйте на вкус, не приносите еду и напитки.", "Never taste anything; no food or drink in the lab.")],
    ["fa-hand", t3("Ҳидни тўғридан-тўғри ҳидламанг — қўл билан ўзингизга елпинг.", "Не нюхайте напрямую — направляйте запах рукой.", "Never sniff directly — waft the smell towards you.")],
    ["fa-arrow-down", t3("Суюлтиришда «сувга кислота» қуйинг, аксинча эмас.", "При разбавлении — «кислоту в воду», не наоборот.", "When diluting, add acid to water, never water to acid.")],
    ["fa-tag", t3("Ҳар бир идишда ёрлиқ бўлсин; номаълум моддани ишлатманг.", "На каждой посуде — этикетка; неизвестное вещество не использовать.", "Label every container; never use an unknown substance.")],
    ["fa-fire", t3("Пробиркани қиздиришда оғзини ўзингизга ва бошқаларга қаратманг.", "При нагреве пробирки не направляйте её на себя и других.", "When heating a test tube, never point it at anyone.")],
    ["fa-eye", t3("Кўзга модда тушса — дарров кўз ювиш жойида 15 дақиқа ювинг ва ўқитувчига айтинг.", "Попало в глаза — сразу промывать 15 минут у фонтанчика и сказать учителю.", "If something gets in your eyes, rinse at the eyewash for 15 minutes and tell the teacher.")],
    ["fa-recycle", t3("Оғир металлар ва оксидловчиларни раковинага тўкманг — махсус чиқинди идишига.", "Тяжёлые металлы и окислители — не в раковину, а в спецконтейнер.", "Heavy metals and oxidisers go into the waste container, not the sink.")]
  ];
  const QUIZ = [
    [t3("Сирка ҳидини қандай ҳидлаш керак?", "Как правильно понюхать уксус?", "How should you smell vinegar?"), [t3("Идишга бурунни яқин олиб", "Поднеся нос к сосуду", "Nose right over the vessel"), t3("Қўл билан ўзимга елпиб", "Направляя запах рукой", "Wafting with my hand"), t3("Таъм кўриб", "Попробовав на вкус", "By tasting")], 1],
    [t3("Кислотани суюлтиришда нима қилинади?", "Как разбавляют кислоту?", "How do you dilute an acid?"), [t3("Кислотага сув қуйилади", "Воду льют в кислоту", "Pour water into acid"), t3("Сувга оз-оздан кислота қуйилади", "Кислоту понемногу льют в воду", "Slowly pour acid into water"), t3("Иккаласини бирдан силкитилади", "Встряхивают оба сразу", "Shake both together")], 1],
    [t3("Мис сульфати қолган эритмани қаерга тўкамиз?", "Куда вылить раствор с сульфатом меди?", "Where does a copper sulfate solution go?"), [t3("Раковинага", "В раковину", "Down the sink"), t3("Ҳовлидаги ерга", "На землю во дворе", "On the ground outside"), t3("Кимёвий чиқинди идишига", "В контейнер для химотходов", "Into the chemical waste container")], 2],
    [t3("Кўзга ишқор тушди. Биринчи қадам?", "В глаз попала щёлочь. Первое действие?", "Alkali got into an eye. First step?"), [t3("15 дақиқа сув билан ювиш", "Промывать водой 15 минут", "Rinse with water for 15 minutes"), t3("Кўзни ишқалаш", "Тереть глаз", "Rub the eye"), t3("Кутиб туриш", "Подождать", "Wait and see")], 0],
    [t3("Нафас ва оҳак суви тажрибасида найча билан…", "В опыте с дыханием и известковой водой трубочкой…", "In the breath–limewater test, the straw is used to…"), [t3("фақат пуфланади", "только дуют", "only blow"), t3("суюқлик ичга тортилади", "втягивают жидкость", "suck up the liquid"), t3("аралаштирилади ва ялаб кўрилади", "мешают и пробуют", "stir and taste")], 0]
  ];
  const TOOLS = [
    ["heat", "fa-fire-burner", t3("Қиздириш", "Нагреть", "Heat")],
    ["stir", "fa-spoon", t3("Аралаштириш", "Перемешать", "Stir")],
    ["breath", "fa-wind", t3("Найчадан пуфлаш (CO₂)", "Подуть в трубочку (CO₂)", "Blow through a straw (CO₂)")],
    ["splint", "fa-fire-flame-simple", t3("Чўғланган чўп", "Тлеющая лучинка", "Glowing splint")],
    ["paper", "fa-note-sticky", t3("pH қоғози", "pH-бумага", "pH paper")],
    ["smell", "fa-hand", t3("Ҳидлаш (елпиб)", "Понюхать (направляя)", "Smell (waft)")],
    ["filter", "fa-filter", t3("Фильтрлаш", "Фильтровать", "Filter")],
    ["empty", "fa-trash-can", t3("Бўшатиш", "Опорожнить", "Empty")]
  ];
  /* ---------- Асбоб-ускуналар ----------
     [id, тур, иконка, босқич, номи, тавсиф (нима ва қандай), хавфсизлик, амал (ёки null)] */
  const EQC = [
    ["meas", "fa-gauge-high", t3("Ўлчов", "Измерения", "Measuring")],
    ["water", "fa-water", t3("Сув", "Вода", "Water")],
    ["soil", "fa-seedling", t3("Тупроқ", "Почва", "Soil")],
    ["air", "fa-wind", t3("Ҳаво", "Воздух", "Air")],
    ["gen", "fa-flask", t3("Умумий", "Общее", "General")],
    ["safe", "fa-shield-heart", t3("Хавфсизлик", "Безопасность", "Safety")]
  ];
  const EQ_ = (id, cat, ic, st, n, d, sf, act) => ({ id, cat, ic, st, n, d, sf, act });
  const EQUIP = [
    EQ_("phm", "meas", "fa-gauge-high", "m", t3("pH-метр (шиша электрод)", "pH-метр (стеклянный электрод)", "pH meter (glass electrode)"), t3("Водород ионлари активлигини ±0,01 аниқликда ўлчайди (Нернст: 59,16 мВ/pH, 25 °C). Аввал икки буферда калибрланг, ҳар ўлчовдан кейин электродни дистиллят билан чайинг.", "Измеряет активность ионов водорода с точностью ±0,01 (Нернст: 59,16 мВ/pH, 25 °C). Сначала откалибруйте по двум буферам, после каждого измерения ополаскивайте электрод.", "Measures hydrogen-ion activity to ±0.01 (Nernst: 59.16 mV/pH at 25 °C). Calibrate with two buffers first and rinse the electrode after each reading."), t3("Шиша электрод мўрт — идиш тубига урманг; KCl эритмасида сақланг.", "Стеклянный электрод хрупкий — не ударяйте о дно; храните в растворе KCl.", "The glass bulb is fragile — don't hit the bottom; store it in KCl solution."), "phm"),
    EQ_("cond", "meas", "fa-bolt", "m", t3("Кондуктометр / TDS-метр", "Кондуктометр / TDS-метр", "Conductivity / TDS meter"), t3("Эритманинг электр ўтказувчанлиги (мкСм/см) ва эриган тузлар (TDS ≈ 0,64 × EC, мг/л). Шўрланишни баҳолашнинг энг тез усули. KCl 0,01 М стандарти = 1413 мкСм/см.", "Электропроводность раствора (мкСм/см) и сухой остаток (TDS ≈ 0,64 × EC, мг/л). Самый быстрый способ оценить засоление. Стандарт KCl 0,01 М = 1413 мкСм/см.", "Electrical conductivity (µS/cm) and dissolved solids (TDS ≈ 0.64 × EC, mg/L) — the fastest salinity check. KCl 0.01 M standard = 1413 µS/cm."), t3("Датчикни қуруқ артманг, фақат дистиллят билан чайинг.", "Не вытирайте датчик насухо — только ополаскивайте дистиллятом.", "Don't wipe the cell dry — just rinse it with distilled water."), "cond"),
    EQ_("spec", "meas", "fa-wave-square", "u", t3("Спектрофотометр (380–900 нм)", "Спектрофотометр (380–900 нм)", "Spectrophotometer (380–900 nm)"), t3("Бугер–Ламберт–Бер қонуни: A = ε·c·l. Тўлқин узунлигини рангли бирикманинг ютилиш максимумига қўйинг (фосфат 880, нитрит 540, аммоний 425, темир 480, перманганат 525 нм), 1 см кювета.", "Закон Бугера–Ламберта–Бера: A = ε·c·l. Установите длину волны на максимум поглощения окрашенного соединения (фосфат 880, нитрит 540, аммоний 425, железо 480, перманганат 525 нм), кювета 1 см.", "Beer–Lambert law: A = ε·c·l. Set the wavelength at the absorption peak of the coloured product (phosphate 880, nitrite 540, ammonium 425, iron 480, permanganate 525 nm), 1 cm cell."), t3("Кюветани қирраларидан ушланг, ташқи деворини артиб қўйинг.", "Держите кювету за матовые грани, вытирайте внешние стенки.", "Hold the cuvette by its frosted sides and wipe the outer walls."), "spec"),
    EQ_("kfk", "meas", "fa-circle-half-stroke", "m", t3("Фотоколориметр (8 та ёруғлик фильтри)", "Фотоколориметр (8 светофильтров)", "Photocolorimeter (8 filters)"), t3("Мактаб ва дала лабораторияси учун оддий асбоб: эритма рангига қўшимча рангли фильтр танланади ва оптик зичлик ўлчанади.", "Простой прибор для школьной и полевой лаборатории: выбирается светофильтр дополнительного цвета и измеряется оптическая плотность.", "A simple school/field instrument: pick the filter of the complementary colour and read the optical density."), t3("Ўлчашдан олдин дистиллят билан «ноль» қўйинг.", "Перед измерением выставьте «ноль» по дистилляту.", "Zero it with distilled water before measuring."), "kfk"),
    EQ_("turb", "meas", "fa-glass-water-droplet", "m", t3("Лойқалик ўлчагич (турбидиметр)", "Мутномер (турбидиметр)", "Turbidimeter"), t3("Сочилган ёруғлик бўйича лойқалик, NTU. Ичимлик суви учун ЖССТ тавсияси: < 1 NTU (дезинфекция учун), 5 NTU гача кўзга кўринмайди.", "Мутность по рассеянному свету, NTU. Рекомендация ВОЗ для питьевой воды: < 1 NTU (для обеззараживания), до 5 NTU незаметно глазу.", "Turbidity from scattered light, NTU. WHO advice for drinking water: < 1 NTU for disinfection; up to 5 NTU is invisible."), t3("Намунани силкитиб, пуфакчасиз қуйинг.", "Перемешайте пробу и наливайте без пузырьков.", "Mix the sample and pour it without bubbles."), "turb"),
    EQ_("oxy", "meas", "fa-droplet", "m", t3("Оксиметр (эриган кислород)", "Оксиметр (растворённый кислород)", "Dissolved-oxygen meter"), t3("Мембранали ёки оптик датчик: O₂ мг/л ва тўйиниш %. Балиқлар учун камида 5–6 мг/л керак, 2 мг/л дан пасти — «ўлик зона».", "Мембранный или оптический датчик: O₂ мг/л и % насыщения. Рыбам нужно не менее 5–6 мг/л, ниже 2 мг/л — «мёртвая зона».", "Membrane or optical probe: O₂ mg/L and % saturation. Fish need at least 5–6 mg/L; below 2 mg/L is a dead zone."), t3("Датчикни ҳаво пуфакчаларисиз, секин айлантириб ўлчанг.", "Измеряйте, медленно помешивая датчиком, без пузырьков.", "Stir gently with the probe and avoid air bubbles."), "oxy"),
    EQ_("therm", "meas", "fa-temperature-half", "m", t3("Электрон термометр", "Электронный термометр", "Digital thermometer"), t3("Ҳароратни ±0,1 °C аниқликда ўлчайди. Ҳарорат кислород эрувчанлиги, pH ва реакция тезлигига таъсир қилади.", "Измеряет температуру с точностью ±0,1 °C. Температура влияет на растворимость кислорода, pH и скорость реакций.", "Reads temperature to ±0.1 °C. Temperature affects oxygen solubility, pH and reaction rates."), t3("Симобли термометр синса — хонани шамоллатинг, ўқитувчини чақиринг.", "Если разбился ртутный термометр — проветрите и позовите учителя.", "If a mercury thermometer breaks, ventilate the room and call the teacher."), "therm"),
    EQ_("bal", "meas", "fa-scale-balanced", "m", t3("Аналитик тарози (0,0001 г)", "Аналитические весы (0,0001 г)", "Analytical balance (0.0001 g)"), t3("Идиш массаси ва ичидагисини тортади. Тарозини текис жойга қўйинг, эшикчаларни ёпиб, «тара» тугмасини босинг.", "Взвешивает сосуд с содержимым. Ставьте на ровную поверхность, закрывайте дверцы, нажимайте «тара».", "Weighs the vessel and contents. Level it, close the doors and press tare."), t3("Иссиқ идишни тортманг — конвекция натижани бузади.", "Не взвешивайте горячее — конвекция искажает результат.", "Never weigh hot items — convection spoils the reading."), "bal"),
    EQ_("aas", "meas", "fa-atom", "u", t3("Атом-абсорбцион спектрометр (ААС)", "Атомно-абсорбционный спектрометр (ААС)", "Atomic absorption spectrometer (AAS)"), t3("Оғир металлар (Cu, Pb, Zn, Cd): намуна HNO₃ билан парчаланади, алангада атомлаштирилади, ҳар бир металл ўз чироғининг нурини ютади.", "Тяжёлые металлы (Cu, Pb, Zn, Cd): проба разлагается HNO₃, атомизируется в пламени, каждый металл поглощает свет своей лампы.", "Heavy metals (Cu, Pb, Zn, Cd): the sample is digested in HNO₃, atomised in a flame and each metal absorbs light from its own lamp."), t3("Ацетилен ёнувчан — газ баллони занжирланган бўлсин, тортиш тизими ёқилган бўлсин.", "Ацетилен горюч — баллон закреплён цепью, вытяжка включена.", "Acetylene is flammable — chain the cylinder and run the extraction."), "aas"),
    EQ_("strip", "meas", "fa-list-check", "m", t3("Сув таҳлили тест-тасмалари (8 кўрсаткич)", "Тест-полоски для воды (8 показателей)", "Water test strips (8 parameters)"), t3("Тасмани 1 сония эритмага ботиринг, 60 сониядан кейин рангини шкала билан солиштиринг: pH, нитрат, нитрит, аммоний, фосфат, қаттиқлик, темир, хлорид.", "Опустите полоску на 1 секунду, через 60 секунд сравните цвета со шкалой: pH, нитрат, нитрит, аммоний, фосфат, жёсткость, железо, хлорид.", "Dip for 1 second, compare colours with the chart after 60 s: pH, nitrate, nitrite, ammonium, phosphate, hardness, iron, chloride."), t3("Хавфсиз, мактаб учун мос. Тасмаларни қуруқ, ёпиқ қутида сақланг.", "Безопасно, подходит для школы. Храните полоски в сухой закрытой тубе.", "Safe for school. Keep strips in a dry, closed tube."), "strip"),
    EQ_("secchi", "water", "fa-circle-dot", "m", t3("Секки диски", "Диск Секки", "Secchi disk"), t3("Оқ-қора дискни сувга туширинг: кўринмай қолган чуқурлик — тиниқлик. Карлсон трофик индекси TSI = 60 − 14,41·ln(SD).", "Опустите бело-чёрный диск в воду: глубина исчезновения — прозрачность. Трофический индекс Карлсона TSI = 60 − 14,41·ln(SD).", "Lower the black-and-white disk: the depth where it vanishes is the transparency. Carlson trophic index TSI = 60 − 14.41·ln(SD)."), t3("Сув бўйида қутқарув жилетида ва жуфт бўлиб ишланг.", "У воды работайте в спасательном жилете и в паре.", "Work in pairs and wear a life jacket near water."), "secchi"),
    EQ_("bat", "water", "fa-bottle-water", "m", t3("Батометр (сув намуна олгич)", "Батометр (пробоотборник)", "Water sampler (bathometer)"), t3("Белгиланган чуқурликдан намуна олади. Шиша тўлдирилиб, ҳаво қолдирмасдан ёпилади, ёрлиқ: жой, вақт, чуқурлик, ҳарорат.", "Берёт пробу с заданной глубины. Склянку заполняют доверху и закрывают без воздуха; этикетка: место, время, глубина, температура.", "Takes a sample from a set depth. Fill the bottle to the top with no air and label it: place, time, depth, temperature."), t3("Намунани +4 °C да сақланг ва 24 соат ичида таҳлил қилинг.", "Храните пробу при +4 °C и анализируйте в течение 24 часов.", "Keep samples at +4 °C and analyse within 24 h."), null),
    EQ_("bod", "water", "fa-hourglass-half", "u", t3("БПК₅ термостати (20 °C, 5 сутка)", "Термостат БПК₅ (20 °C, 5 суток)", "BOD₅ incubator (20 °C, 5 days)"), t3("Биологик кислород истеъмоли: кислород шишасидаги намуна қоронғида 20 °C да 5 кун сақланади, O₂ камайиши микроблар парчалаган органикани кўрсатади. Ифлос сув суюлтирилади (қолдиқ O₂ ≥ 1 мг/л).", "Биохимическое потребление кислорода: проба в кислородной склянке 5 суток в темноте при 20 °C; убыль O₂ показывает органику, разложенную микробами. Грязную воду разбавляют (остаток O₂ ≥ 1 мг/л).", "Biochemical oxygen demand: the sample sits in a BOD bottle in the dark at 20 °C for 5 days; the O₂ drop shows organic matter eaten by microbes. Dilute dirty water so ≥ 1 mg/L O₂ remains."), t3("Шиша тўлиқ, пуфакчасиз ёпилсин.", "Склянка заполнена полностью, без пузырьков.", "Fill the bottle completely with no bubbles."), "bod"),
    EQ_("aer", "water", "fa-fan", "m", t3("Аэратор (ҳаво компрессори)", "Аэратор (компрессор)", "Aerator (air pump)"), t3("Сувга ҳаво пуфлаб кислородни тўйиниш даражасига етказади — БПК учун суюлтирувчи сув шундай тайёрланади.", "Насыщает воду кислородом воздуха до насыщения — так готовят разбавляющую воду для БПК.", "Bubbles air to saturate water with oxygen — this is how BOD dilution water is prepared."), t3("Шлангни эритмадан чиқариб ўчиринг — тескари сўрилмасин.", "Выключайте, вынув шланг из раствора, — чтобы не было обратного подсоса.", "Lift the hose out before switching off to prevent back-siphoning."), "aer"),
    EQ_("burette", "water", "fa-eye-dropper", "m", t3("Бюретка, пипетка ва ўлчов колбалари", "Бюретка, пипетки и мерные колбы", "Burette, pipettes and volumetric flasks"), t3("Титрлашда реактивни 0,05–0,1 мл аниқликда қўшинг: миқдорда «1 томчи» ёки «0,1 мл» ни танланг. Мениск пастки чегараси бўйича ўқилади.", "При титровании добавляйте реактив с точностью 0,05–0,1 мл: выберите «1 капля» или «0,1 мл». Отсчёт по нижнему мениску.", "When titrating, add 0.05–0.1 mL at a time: pick “1 drop” or “0.1 mL”. Read the bottom of the meniscus."), t3("Пипеткани оғиз билан сўрманг — фақат груша билан.", "Никогда не набирайте пипетку ртом — только грушей.", "Never pipette by mouth — use a bulb."), null),
    EQ_("auger", "soil", "fa-ruler-vertical", "m", t3("Тупроқ пармаси (бур)", "Почвенный бур", "Soil auger"), t3("0–20 ва 20–40 см қатламлардан намуна олинади; 5–10 нуқтадан «конверт» усулида аралаш намуна тузилади (≈ 500 г).", "Берут образцы из слоёв 0–20 и 20–40 см; смешанный образец (≈ 500 г) составляют из 5–10 точек «конвертом».", "Sample the 0–20 and 20–40 cm layers; combine 5–10 points in an envelope pattern (≈ 500 g)."), t3("Ер остида кабель ва қувур йўқлигини текширинг.", "Убедитесь, что под землёй нет кабелей и труб.", "Check for buried cables and pipes."), null),
    EQ_("mortar", "soil", "fa-mortar-pestle", "m", t3("Ҳован-дастача ва 1 мм элак", "Ступка с пестиком и сито 1 мм", "Mortar, pestle and 1 mm sieve"), t3("Ҳавода қуритилган тупроқ эзилади ва 1 мм элакдан ўтказилади — шундан кейин тортиб, таҳлилга олинади.", "Воздушно-сухую почву растирают и просеивают через сито 1 мм, затем берут навеску.", "Air-dried soil is crushed and passed through a 1 mm sieve before weighing."), t3("Чанг кўтарилмасин — ниқоб кийинг.", "Не пылите — используйте маску.", "Avoid dust — wear a mask."), null),
    EQ_("sieve", "soil", "fa-layer-group", "m", t3("Элаклар тўплами ва чўктириш цилиндри", "Набор сит и цилиндр для седиментации", "Sieve set and sedimentation cylinder"), t3("Механик таркиб: қум (2–0,05 мм) элакда, чанг ва гил (< 0,002 мм) чўкиш тезлиги бўйича (Стокс қонуни). USDA учбурчаги бўйича тупроқ тури аниқланади.", "Гранулометрический состав: песок (2–0,05 мм) на ситах, пыль и глина (< 0,002 мм) по скорости оседания (закон Стокса). Тип почвы — по треугольнику USDA.", "Texture: sand (2–0.05 mm) on sieves, silt and clay (< 0.002 mm) by settling speed (Stokes' law). The USDA triangle gives the class."), t3("Элакларни қаттиқ урманг, тўр йиртилади.", "Не стучите ситами — порвётся сетка.", "Don't bang the sieves or the mesh will tear."), "sieve"),
    EQ_("oven", "soil", "fa-temperature-arrow-up", "m", t3("Қуритиш шкафи (105 °C)", "Сушильный шкаф (105 °C)", "Drying oven (105 °C)"), t3("Тупроқ намлиги: намуна 105 °C да доимий массагача қуритилади, W = (m₁ − m₂)/m₂ × 100 %.", "Влажность почвы: образец сушат при 105 °C до постоянной массы, W = (m₁ − m₂)/m₂ × 100 %.", "Soil moisture: dry at 105 °C to constant mass, W = (m₁ − m₂)/m₂ × 100 %."), t3("Иссиқ бюксларни қисқич билан олинг, эксикаторда совитинг.", "Горячие бюксы берите щипцами, охлаждайте в эксикаторе.", "Handle hot tins with tongs and cool them in a desiccator."), "oven"),
    EQ_("muffle", "soil", "fa-fire", "u", t3("Муфель печи (550 °C)", "Муфельная печь (550 °C)", "Muffle furnace (550 °C)"), t3("Қиздиришда йўқотилган масса (LOI) — органик модда миқдори. Тигелдаги қуруқ тупроқ 550 °C да 4 соат куйдирилади.", "Потери при прокаливании (LOI) — содержание органического вещества. Сухую почву в тигле прокаливают 4 часа при 550 °C.", "Loss on ignition (LOI) = organic matter. Dry soil in a crucible is ignited at 550 °C for 4 h."), t3("Иссиқликка чидамли қўлқоп ва узун қисқич; эшикни секин очинг.", "Термостойкие перчатки и длинные щипцы; дверцу открывайте медленно.", "Heat-proof gloves and long tongs; open the door slowly."), "muffle"),
    EQ_("shake", "soil", "fa-arrows-spin", "m", t3("Тебранма силкитгич (ротатор)", "Встряхиватель (ротатор)", "Orbital shaker"), t3("Тупроқ сўримини 3–5 дақиқа чайқатади — эрувчан тузлар, нитрат ва фосфат сувга тўлиқ ўтади.", "Встряхивает почвенную вытяжку 3–5 минут — растворимые соли, нитрат и фосфат полностью переходят в раствор.", "Shakes the soil extract for 3–5 min so soluble salts, nitrate and phosphate fully dissolve."), t3("Идиш қопқоғини маҳкамланг.", "Плотно закройте сосуд.", "Close the vessel tightly."), "shake"),
    EQ_("cent", "soil", "fa-rotate", "m", t3("Центрифуга (3000 айл/дақ)", "Центрифуга (3000 об/мин)", "Centrifuge (3000 rpm)"), t3("Лойқа сўримни 10 дақиқада тиндиради: заррачалар тубга, тиниқ эритма юқорида қолади (фильтрлашнинг тез йўли).", "Осветляет мутную вытяжку за 10 минут: частицы на дне, прозрачный раствор сверху (быстрая замена фильтрованию).", "Clears a cloudy extract in 10 min: particles at the bottom, clear liquid on top (a quick alternative to filtering)."), t3("Пробиркаларни қарама-қарши, тенг массада жойланг; қопқоқ ёпилмагунча ишга туширманг.", "Ставьте пробирки напротив друг друга с равной массой; не запускайте с открытой крышкой.", "Balance opposite tubes and never start with the lid open."), "cent"),
    EQ_("asp", "air", "fa-wind", "m", t3("Ҳаво аспиратори (намуна олгич)", "Аспиратор воздуха (пробоотборник)", "Air sampling pump"), t3("Ҳар босишда 100 л ҳавони фильтр ва ютувчи эритма орқали ўтказади: CO₂ оҳак сувида, SO₂ йод-крахмалда, NO₂ Грисс реактивида ушланади; чанг фильтрда қолади.", "За каждый запуск прокачивает 100 л воздуха через фильтр и поглотитель: CO₂ — в известковой воде, SO₂ — в иод-крахмальном растворе, NO₂ — в реактиве Грисса; пыль остаётся на фильтре.", "Each run pulls 100 L of air through a filter and an absorber: CO₂ in limewater, SO₂ in iodine-starch, NO₂ in Griess reagent; dust stays on the filter."), t3("Ютгич идиш тўлиб кетмасин; ҳаво йўналишини текширинг (суюқлик насосга кирмасин).", "Не переполняйте поглотитель; проверьте направление потока (жидкость не должна попасть в насос).", "Don't overfill the absorber; check the flow direction so liquid never reaches the pump."), "asp"),
    EQ_("gas", "air", "fa-cloud", "m", t3("Газ анализатор (CO₂ NDIR, CO)", "Газоанализатор (CO₂ NDIR, CO)", "Gas analyser (NDIR CO₂, CO)"), t3("Инфрақизил датчик CO₂ ни ppm да кўрсатади. Синфда 1000 ppm дан ошса — диққат пасаяди, хонани шамоллатинг.", "Инфракрасный датчик показывает CO₂ в ppm. В классе выше 1000 ppm внимание падает — проветрите.", "The infrared sensor shows CO₂ in ppm. Above 1000 ppm in a classroom attention drops — ventilate."), t3("Хавфсиз; датчикни нафас билан пуфламанг.", "Безопасно; не дышите прямо на датчик.", "Safe; don't breathe straight onto the sensor."), "gas"),
    EQ_("pm", "air", "fa-smog", "m", t3("Чанг ўлчагич (PM2,5 / PM10)", "Пылемер (PM2,5 / PM10)", "Particle counter (PM2.5 / PM10)"), t3("Лазер нури заррачаларни санайди. ЖССТ 2021 (24 соат): PM2,5 ≤ 15, PM10 ≤ 45 мкг/м³.", "Лазерный луч считает частицы. ВОЗ 2021 (24 часа): PM2,5 ≤ 15, PM10 ≤ 45 мкг/м³.", "A laser counts particles. WHO 2021 (24 h): PM2.5 ≤ 15, PM10 ≤ 45 µg/m³."), t3("Хавфсиз; чанг бўронида ниқоб (FFP2) тақинг.", "Безопасно; в пыльную бурю носите респиратор FFP2.", "Safe; wear an FFP2 mask during dust storms."), "pm"),
    EQ_("filt", "air", "fa-filter-circle-xmark", "m", t3("Фильтр-патрон ва гравиметрия", "Фильтродержатель и гравиметрия", "Filter holder and gravimetry"), t3("Аспиратордан кейин фильтрни аналитик тарозида тортинг: чанг массаси ÷ ҳаво ҳажми = концентрация (мкг/м³).", "После аспиратора взвесьте фильтр на аналитических весах: масса пыли ÷ объём воздуха = концентрация (мкг/м³).", "After sampling, weigh the filter: dust mass ÷ air volume = concentration (µg/m³)."), t3("Фильтрни пинцет билан ушланг.", "Берите фильтр пинцетом.", "Handle the filter with tweezers."), "filt"),
    EQ_("fridge", "gen", "fa-snowflake", "m", t3("Лаборатория музлатгичи (+4 °C)", "Лабораторный холодильник (+4 °C)", "Lab refrigerator (+4 °C)"), t3("Сув ва тупроқ намуналарини +4 °C да сақлайди: микроблар ва реакциялар секинлашади (нитрат, аммоний, БПК намуналари учун шарт).", "Хранит пробы воды и почвы при +4 °C: микробы и реакции замедляются (обязательно для нитратов, аммония, БПК).", "Stores water and soil samples at +4 °C, slowing microbes and reactions (required for nitrate, ammonium and BOD samples)."), t3("Озиқ-овқат ва ичимлик сақламанг! Ёнувчан эритувчилар фақат портлашдан ҳимояланган музлатгичда.", "Никакой еды и напитков! Горючие растворители — только во взрывозащищённом холодильнике.", "No food or drinks! Flammable solvents only in an explosion-proof fridge."), "fridge"),
    EQ_("auto", "gen", "fa-gauge", "u", t3("Автоклав (121 °C, 15 дақиқа)", "Автоклав (121 °C, 15 минут)", "Autoclave (121 °C, 15 min)"), t3("Буғ босими остида (≈ 1 атм ортиқча) идиш ва озуқа муҳитларини стерилизация қилади — барча микроблар ва ферментлар (каталаза ҳам) парчаланади.", "Стерилизует посуду и питательные среды паром под давлением (≈ 1 атм избыточного) — гибнут все микробы, разрушаются ферменты (и каталаза).", "Sterilises glassware and media with pressurised steam (≈ 1 atm gauge): all microbes die and enzymes (catalase too) are destroyed."), t3("Босим 0 бўлмагунча қопқоқни очманг; ёпиқ идишни солманг — портлайди.", "Не открывайте, пока давление не упало до 0; не ставьте герметично закрытые сосуды — взорвутся.", "Never open before pressure is zero; never load sealed containers — they burst."), "auto"),
    EQ_("dist", "gen", "fa-faucet-drip", "m", t3("Дистиллятор", "Дистиллятор", "Water still"), t3("Водопровод сувини буғлатиб, совитиб тоза сув олади (EC < 5 мкСм/см). Ҳар бир босишда идишга 20 мл дистиллят қўшилади.", "Испаряет и конденсирует водопроводную воду, получая чистую (EC < 5 мкСм/см). Каждое нажатие добавляет 20 мл дистиллята.", "Boils and condenses tap water into pure water (EC < 5 µS/cm). Each press adds 20 mL of distillate."), t3("Совитувчи сув оқимини аввал очинг, кейин иситгични ёқинг.", "Сначала откройте охлаждающую воду, потом включайте нагрев.", "Turn on the cooling water before the heater."), "dist"),
    EQ_("mstir", "gen", "fa-magnet", "m", t3("Магнит аралаштиргич", "Магнитная мешалка", "Magnetic stirrer"), t3("Идиш ичидаги магнит таёқча эритмани узлуксиз аралаштиради — титрлашда қўл бўш қолади.", "Магнитный якорь непрерывно перемешивает раствор — при титровании руки свободны.", "A magnetic bar stirs continuously, freeing your hands while titrating."), t3("Тезликни секин оширинг, сачрамасин.", "Увеличивайте скорость плавно, чтобы не было брызг.", "Increase the speed slowly to avoid splashing."), "mstir"),
    EQ_("plate", "gen", "fa-fire-burner", "m", t3("Иситиш плитаси", "Нагревательная плитка", "Hot plate"), t3("Эритмаларни қиздиради ва қайнатади (Тюрин усули, перманганат индекси).", "Нагревает и кипятит растворы (метод Тюрина, перманганатная окисляемость).", "Heats and boils solutions (Tyurin method, permanganate index)."), t3("Иссиқ сирт! Плита совигунча қўл теккизманг; ёнувчан моддаларни яқин қўйманг.", "Горячая поверхность! Не трогайте, пока не остынет; горючее держите подальше.", "Hot surface! Don't touch until cool; keep flammables away."), "heat"),
    EQ_("hood", "gen", "fa-house-chimney-window", "m", t3("Тортиш шкафи", "Вытяжной шкаф", "Fume hood"), t3("Ўткир ҳидли ва заҳарли буғлар (концентрланган кислоталар, аммиак, Несслер, бихромат) фақат шу ерда ишланади. Ойнани 40 см дан баланд кўтарманг.", "Едкие и ядовитые пары (концентрированные кислоты, аммиак, Несслер, бихромат) — только здесь. Не поднимайте створку выше 40 см.", "Pungent and toxic vapours (concentrated acids, ammonia, Nessler, dichromate) only here. Keep the sash below 40 cm."), t3("Шкаф ичида бош суқманг; тортиш ишлаётганини текширинг.", "Не просовывайте голову внутрь; проверьте, что тяга работает.", "Never put your head inside; check the airflow is on."), "hood"),
    EQ_("micro", "gen", "fa-microscope", "m", t3("Микроскоп (×100–×1000)", "Микроскоп (×100–×1000)", "Microscope (×100–×1000)"), t3("Бир томчи намуна предмет ойнасига олинади: сувўтлари, бактериялар, тупроқ заррачалари ва кристаллар кўринади.", "Каплю пробы помещают на предметное стекло: видны водоросли, бактерии, частицы почвы и кристаллы.", "Put one drop on a slide: algae, bacteria, soil particles and crystals become visible."), t3("Кўзгу билан қуёш нурини кўзга қаратманг.", "Не направляйте зеркалом солнечный свет в глаз.", "Never reflect direct sunlight into your eye."), "micro"),
    EQ_("desic", "gen", "fa-box-archive", "m", t3("Эксикатор", "Эксикатор", "Desiccator"), t3("Қуритилган намуналар ҳаводаги намни ютмасдан совиши учун: тубида силикагель ёки CaCl₂.", "Чтобы высушенные пробы остывали, не поглощая влагу: на дне силикагель или CaCl₂.", "Lets dried samples cool without absorbing moisture: silica gel or CaCl₂ at the bottom."), t3("Қопқоқни ён томонга суриб очинг.", "Открывайте крышку, сдвигая её в сторону.", "Slide the lid sideways to open it."), null),
    EQ_("eyew", "safe", "fa-eye", "m", t3("Кўз ювгич", "Фонтанчик для промывания глаз", "Eyewash station"), t3("Кўзга модда тушса — қовоқларни очиб, камида 15 дақиқа ювинг, кейин шифокорга.", "При попадании в глаза — раскройте веки и промывайте не менее 15 минут, затем к врачу.", "If something gets in the eyes, hold the lids open and rinse for at least 15 min, then see a doctor."), t3("Ҳар ҳафта текширилсин; йўл тўсилмаган бўлсин.", "Проверяйте еженедельно; подход не загромождать.", "Test weekly and keep the path clear."), null),
    EQ_("shower", "safe", "fa-shower", "m", t3("Авария души", "Аварийный душ", "Safety shower"), t3("Катта миқдорда кислота ёки ишқор тўкилса — кийимни ечиб, 15 дақиқа душ остида туринг.", "При обливании кислотой или щёлочью — снимите одежду и стойте под душем 15 минут.", "After a large acid or alkali splash, remove clothing and stay under the shower for 15 min."), t3("Йўлак доим бўш бўлсин.", "Проход всегда свободен.", "Keep the path clear."), null),
    EQ_("ext", "safe", "fa-fire-extinguisher", "m", t3("Ўт ўчиргич (CO₂ / кукунли)", "Огнетушитель (CO₂ / порошковый)", "Fire extinguisher (CO₂ / powder)"), t3("ПАСС: Пломбани узинг, Найчани олов асосига қаратинг, Сиқинг, Супуринг. Электр жиҳозлар ёнса — фақат CO₂.", "ПАСС: сорвите Пломбу, нАправьте раструб в основание огня, Сожмите, Сметайте. При горении электроприборов — только CO₂.", "PASS: Pull the pin, Aim at the base, Squeeze, Sweep. For electrical fires use CO₂ only."), t3("Кичик спирт ёнғинини ёнмайдиган мато билан ёпиш мумкин.", "Небольшое горение спирта можно накрыть негорючей тканью.", "A small alcohol fire can be smothered with a fire blanket."), null),
    EQ_("kit", "safe", "fa-kit-medical", "m", t3("Биринчи ёрдам қутиси", "Аптечка первой помощи", "First-aid kit"), t3("Бинт, лейкопластир, куйишга қарши гель, 2 % сода (кислота куйишига) ва 2 % сирка кислотаси (ишқор куйишига) эритмалари.", "Бинт, пластырь, гель от ожогов, 2 % раствор соды (при кислотном ожоге) и 2 % уксусной кислоты (при щелочном).", "Bandages, plasters, burn gel, 2 % soda solution (acid burns) and 2 % acetic acid (alkali burns)."), t3("Ҳар қандай жароҳатни ўқитувчига дарров айтинг.", "О любой травме сразу сообщите учителю.", "Report every injury to the teacher at once."), null),
    EQ_("bin", "safe", "fa-biohazard", "m", t3("Кимёвий чиқинди идишлари", "Контейнеры для химических отходов", "Chemical waste containers"), t3("Алоҳида: оғир металлар (Ag, Cu, Hg, Cr), органик эритувчилар, кислота/ишқор (нейтраллангандан кейин), тупроқ ва қаттиқ чиқинди.", "Раздельно: тяжёлые металлы (Ag, Cu, Hg, Cr), органические растворители, кислоты/щёлочи (после нейтрализации), почва и твёрдые отходы.", "Separate: heavy metals (Ag, Cu, Hg, Cr), organic solvents, acids/alkalis (after neutralising), soil and solid waste."), t3("Идишни 3/4 дан ортиқ тўлдирманг, ёрлиқ ёпиштиринг.", "Не заполняйте больше 3/4, наклейте этикетку.", "Never fill beyond 3/4 and always label it."), "empty"),
    EQ_("spill", "safe", "fa-bucket", "m", t3("Тўкилганда: сода, қум, адсорбент", "Набор для разливов: сода, песок, адсорбент", "Spill kit: soda, sand, absorbent"), t3("Кислота тўкилса — сода сепинг (кўпик тугагунча), ишқор — лимон кислотаси; кейин қум билан йиғинг.", "Пролита кислота — засыпьте содой (до конца вспенивания), щёлочь — лимонной кислотой; затем соберите песком.", "Acid spill: cover with soda until fizzing stops; alkali: citric acid; then collect with sand."), t3("Симоб тўкилса — хонадан чиқинг, махсус хизматни чақиринг.", "Пролита ртуть — покиньте помещение и вызовите спецслужбу.", "Mercury spill: leave the room and call specialists."), null)
  ];
  const EQID = Object.fromEntries(EQUIP.map((e) => [e.id, e]));
  /* Ҳаво намуна олиш жойлари: CO₂ ppm, PM мкг/м³, SO₂/NO₂ мкг/м³, CO мг/м³ (тахминий типик қийматлар) */
  const AIR = [
    { id: "street", ic: "fa-city", n: t3("Тошкент, гавжум кўча", "Ташкент, оживлённая улица", "Tashkent, busy street"), co2: 460, pm25: 42, pm10: 85, so2: 18, no2: 55, co: 2.5 },
    { id: "ind", ic: "fa-industry", n: t3("Саноат зонаси (Олмалиқ)", "Промзона (Алмалык)", "Industrial zone (Almalyk)"), co2: 480, pm25: 60, pm10: 140, so2: 180, no2: 70, co: 3.5 },
    { id: "class", ic: "fa-chalkboard-user", n: t3("Ёпиқ синфхона (30 ўқувчи)", "Закрытый класс (30 учеников)", "Closed classroom (30 pupils)"), co2: 1800, pm25: 25, pm10: 50, so2: 5, no2: 20, co: 0.8 },
    { id: "mount", ic: "fa-mountain-sun", n: t3("Чотқол тоғлари (Бурчмулла)", "Чаткальские горы (Бурчмулла)", "Chatkal mountains (Burchmulla)"), co2: 418, pm25: 6, pm10: 12, so2: 2, no2: 3, co: 0.2 },
    { id: "aral", ic: "fa-wind", n: t3("Орол бўйи, Мўйноқ (чанг бўрони)", "Приаралье, Муйнак (пыльная буря)", "Aral region, Moynaq (dust storm)"), co2: 420, pm25: 95, pm10: 450, so2: 5, no2: 8, co: 0.3 }
  ];
  const WHO = { pm25: 15, pm10: 45, so2: 40, no2: 25, co: 4 };

  /* ---------- Ҳолат ---------- */
  const PKEY = "ekotalim:lx-ppe", LKEY = "ekotalim:lx-log";
  const getJ = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } };
  const putJ = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  let ppe = Object.assign({ coat: false, gog: false, glo: false }, getJ(PKEY, {}));
  const ppeOk = () => ppe.coat && ppe.gog && ppe.glo;
  let S = null, EQ = null, grp = "base", amtIx = 4, amtS = 1, sel = null, recipe = null, quizA = {};
  let hood = false, airSite = "street", airVol = 100, eqCat = "meas", eqSel = "phm", lam = 540;
  const calPts = new Set();
  const newState = (v) => ({ ves: v || (S ? S.ves : "beaker"), V: 0, T: 22, tot: {}, extra: {}, ind: {}, used: new Set(), seen: new Set(), disc: new Set(), heat: false, gasCO2: 0, gasO2: 0, rateCO2: 0, rateO2: 0, breath: 0, cuo: 0, paper: null, stirT: 0, log: [], obs: [], lastT: 22, pool: {}, soilG: 0, susp: 0, soilOrg: 0, exH: 0, exHrel: 0, ext: 0, amt: {}, meas: {}, dust: 0, airV: 0, cold: false, mstir: false, shakeT: 0, aerT: 0 });
  S = newState("beaker");
  const discSaved = () => { const f = flags(); return new Set(DISC.map((d) => d[0]).filter((id) => f["lx_d_" + id])); };

  function recompute() {
    EQ = K.equil(S.tot, S.V);
    /* Тўйинишдан ортиқ CO₂ газ бўлиб чиқиб кетади */
    for (let i = 0; i < 16 && S.V > 0; i++) {
      const over = EQ.co2aq - K.CO2SAT;
      if (over <= 1e-6) break;
      const n = over * S.V; // ммоль
      S.tot.C = Math.max(0, (S.tot.C || 0) - n); S.gasCO2 += n; S.rateCO2 += n;
      EQ = K.equil(S.tot, S.V);
    }
    return EQ;
  }
  const freeHOH = (eq, V) => (Math.pow(10, -eq.pH) + K.KW / Math.pow(10, -eq.pH)) * V; // ммоль

  /* ---------- Модда қўшиш ---------- */
  function add(id, amt) {
    const r = RID[id];
    if (!r) return;
    if (!ppeOk()) { warnPpe(); return; }
    if (r.st === "u" && !uni()) { toast(L(TX.lock)); return; }
    if (r.hood && !hood) { toast(L(TX.needHood)); return; }
    const liq = r.k === "l";
    if (liq && !r.dH && S.V > 0 && (S.tot.SO4 || 0) / S.V > 5) { toast(L(TX.acidWater)); return; }
    if (liq && S.V + amt > VES[S.ves].max + 1e-9) { toast(L(TX.full)); return; }
    const before = S.V > 0 ? freeHOH(EQ || recompute(), S.V) : 0;
    let stock = 0;
    if (liq) { const eq0 = K.equil(Object.fromEntries(Object.entries(r.c).map(([k, v]) => [k, v * 10])), 10); stock = freeHOH(eq0, amt); }
    const co2Before = S.gasCO2;
    if (r.soil) {
      /* Тупроқ: эрувчан тузлар «pool» да (чайқатганда ўтади), CaCO₃ ва органика — қаттиқ фазада */
      S.soilG += amt; S.susp = Math.max(S.susp, 0.7);
      for (const k in r.c) S.pool[k] = (S.pool[k] || 0) + r.c[k] * amt;
      if (r.cc) { S.tot.Ca = (S.tot.Ca || 0) + r.cc * amt; S.tot.C = (S.tot.C || 0) + r.cc * amt; }
      S.soilOrg += (r.org || 0) * amt; S.exH += (r.exH || 0) * amt;
    } else for (const k in r.c) S.tot[k] = (S.tot[k] || 0) + r.c[k] * amt; // моль/л × мл = ммоль; ммоль/г × г = ммоль
    S.amt[id] = (S.amt[id] || 0) + amt;
    for (const k in r.ex || {}) S.extra[k] = (S.extra[k] || 0) + r.ex[k] * amt;
    for (const k in r.ind || {}) S.ind[k] = (S.ind[k] || 0) + r.ind[k] * amt;
    const T0 = S.T;
    if (liq) { S.T = (S.T * S.V + 22 * amt) / (S.V + amt); S.V += amt; }
    S.used.add(id);
    if (S.soilG > 0 && S.V > 0) soilRelease(0.3);
    recompute();
    /* Иссиқлик: эркин H⁺/OH⁻ камайиши — нейтраллаш (55,8 кЖ/моль); CO₂ ажралиши — эндотермик (+18 кЖ/моль) */
    const nW = Math.max(0, before + stock - freeHOH(EQ, S.V));
    const nCO2 = S.gasCO2 - co2Before;
    if (S.V > 0) { const q = 55.8 * nW - 18 * nCO2 + (r.dH || 0) * amt; /* dH — суюлтириш иссиқлиги, Ж/мл */ S.T = clamp(S.T + q / (S.V * 4.18), 0, 100); }
    if (S.T - T0 > 0.5 && nW > 0.5) discover("heat");
    reactInstant(id);
    const shown = amtTxt(r.k === "s", amt);
    note(`${L(r.n)} — ${shown} ${L(TX.added)}`);
    logStep(`+ ${L(r.n)} ${shown}`, id, r.k === "l" ? amt : 0);
    pourAnim(id);
    checkAll();
    paint();
  }
  /* Бир зумда кўринадиган реакциялар (ранг, газ, чўкма) */
  function reactInstant(id) {
    const x = S.extra, V = S.V;
    /* Витамин C + йод: I₂ қайтарилади, 2HI (кучли кислота) ҳосил бўлади */
    if ((x.I2 || 0) > 0 && (S.tot.Vc || 0) > 0) {
      const n = Math.min(x.I2, S.tot.Vc);
      x.I2 -= n; S.tot.Vc -= n; S.tot.Cl = (S.tot.Cl || 0) + 2 * n; /* I⁻ — Cl⁻ сингари кучли анион */
      if (n > 0.0005 && x.I2 < 1e-6) discover("vitc");
      recompute();
    }
    for (let pass = 0; pass < 2; pass++) {
      const t = S.tot;
      /* Сульфит (ҳаводан SO₂) + йод: SO₃²⁻ + I₂ + H₂O → SO₄²⁻ + 2I⁻ + 2H⁺; ёки H₂O₂ билан сульфатга */
      if ((t.SO3 || 0) > 0 && (x.I2 || 0) > 0) { const n = Math.min(t.SO3, x.I2); t.SO3 -= n; x.I2 -= n; t.SO4 = (t.SO4 || 0) + n; t.I = (t.I || 0) + 2 * n; }
      if ((t.SO3 || 0) > 0 && (x.H2O2 || 0) > 0) { const n = Math.min(t.SO3, x.H2O2); t.SO3 -= n; x.H2O2 -= n; t.SO4 = (t.SO4 || 0) + n; }
      /* Тиосульфат + йод */
      if ((t.S2O3 || 0) > 0 && (x.I2 || 0) > 0) { const n = Math.min(x.I2, t.S2O3 / 2); x.I2 -= n; t.S2O3 -= 2 * n; t.I = (t.I || 0) + 2 * n; t.S4O6 = (t.S4O6 || 0) + n; }
      /* Грисс: NO₂⁻ → азобўёқ (H⁺ сарфланади) */
      if ((x.griess || 0) > 0 && (t.NO2 || 0) > 0) { const n = Math.min(t.NO2, x.griess); t.NO2 -= n; x.griess -= n; x.azo = (x.azo || 0) + n; if (n > 1e-7) discover("azo"); }
      recompute();
      /* Винклер: 2Mn(OH)₂ + O₂ → 2MnO(OH)₂ (қўнғир); OH⁻ қаттиқ фазада қолади — Na⁺ жуфтини олиб ташлаймиз */
      if (EQ.ppt.mnoh > 1e-6 && (x.DO || 0) > 0) { const r = Math.min(x.DO, EQ.ppt.mnoh / 2); x.DO -= r; t.Mn2 -= 2 * r; t.Na = Math.max(0, (t.Na || 0) - 4 * r); x.mnooh = (x.mnooh || 0) + 2 * r; if (r > 1e-5) discover("win"); recompute(); }
      /* Кислотада: MnO(OH)₂ + 2I⁻ + 4H⁺ → Mn²⁺ + I₂ + 3H₂O */
      if ((x.mnooh || 0) > 0 && EQ.pH < 2.5 && (t.I || 0) > 0) { const r = Math.min(x.mnooh, t.I / 2); x.mnooh -= r; t.Mn2 = (t.Mn2 || 0) + r; t.I -= 2 * r; x.I2 = (x.I2 || 0) + r; t.Na = (t.Na || 0) + 2 * r; recompute(); }
    }
    void id; void V;
  }

  /* ---------- Асбоблар ---------- */
  function tool(t, arg) {
    if (t === "empty") { askWaste(); return; }
    if (t === "rinse") { if (S.V > 0 && needsBin()) { askWaste(); return; } resetVessel(); note(L(t3("Идиш дистиллят билан чайилди.", "Сосуд ополоснут дистиллятом.", "Vessel rinsed with distilled water."))); return; }
    if (t !== "heat" && (EQID[t] || t === "cal")) { eqAct(t, arg); return; }
    if (!ppeOk()) { warnPpe(); return; }
    if (t !== "heat" && S.V <= 0 && !hasSolids()) { toast(L(TX.empty)); return; }
    if (t === "stir" && S.soilG > 0) { S.susp = 1; soilRelease(0.4); recompute(); }
    if (t === "heat") {
      S.heat = !S.heat;
      note(L(S.heat ? TX.heatOn : TX.heatOff));
      if (S.heat && S.ves === "tube") note(L(t3("Пробирка оғзини ҳеч кимга қаратманг!", "Не направляйте пробирку ни на кого!", "Don't point the tube at anyone!")));
      logStep(S.heat ? "🔥 ON" : "🔥 OFF");
    }
    if (t === "stir") { S.stirT = 4; note(L(t3("Шиша таёқча билан аралаштирилди", "Перемешано стеклянной палочкой", "Stirred with a glass rod"))); stirFoam(); logStep("🥄"); }
    if (t === "breath") {
      if (S.V <= 0) { toast(L(TX.empty)); return; }
      /* Бир нафас ≈ 0,5 л ҳаво, 4 % CO₂ ≈ 0,9 ммоль; пуфакчалар тез ўтгани учун тахминан 1/10 қисми эрийди */
      S.tot.C = (S.tot.C || 0) + 0.08; S.breath++;
      recompute(); S.rateCO2 += 0.6;
      note(L(t3("Найча орқали пуфланди: CO₂ эритмага ўтди (ичга тортманг!)", "Подули в трубочку: CO₂ перешёл в раствор (не втягивайте!)", "Blew through the straw: CO₂ dissolved (never suck!)")));
      logStep("💨 CO₂");
    }
    if (t === "splint") {
      const o2 = S.rateO2 > 0.02 || S.foamO2 > 0.3, co2 = S.rateCO2 > 0.05;
      note(o2 ? L(t3("🔥 Чўғланган чўп ловуллаб ёнди — бу КИСЛОРОД!", "🔥 Тлеющая лучинка вспыхнула — это КИСЛОРОД!", "🔥 The glowing splint burst into flame — OXYGEN!")) : co2 ? L(t3("💨 Чўп ўчди — газ ёнишни қўллаб-қувватламайди (CO₂).", "💨 Лучинка погасла — газ не поддерживает горение (CO₂).", "💨 The splint went out — the gas doesn't support burning (CO₂).")) : L(t3("Чўп ўзгармади — газ ажралмаяпти.", "Лучинка не изменилась — газ не выделяется.", "Nothing happened — no gas is coming off.")));
      if (o2) once("lx_splint", 2, WHY);
    }
    if (t === "paper") {
      S.paper = EQ.pH;
      const c = K.universal(EQ.pH).map((v) => Math.round(v * 255));
      note(`<span class="lx-strip" style="background:rgb(${c.join(",")})"></span> ${L(t3("pH қоғози: тахминан", "pH-бумага: примерно", "pH paper: about"))} ${Math.round(EQ.pH)}`, true);
    }
    if (t === "smell") {
      const sm = (S.tot.Ac || 0) > 0.5 ? t3("ўткир сирка ҳиди", "резкий запах уксуса", "a sharp vinegar smell") : (S.extra.lemon || 0) > 0 ? t3("лимон ҳиди", "запах лимона", "a lemon smell") : (S.extra.org || 0) > 0 ? t3("ёқимсиз оқова ҳиди", "неприятный запах стоков", "an unpleasant sewage smell") : (S.extra.yeast || 0) > 0 ? t3("нон-ачитқи ҳиди", "запах хлеба и дрожжей", "a bready yeast smell") : t3("деярли ҳидсиз", "почти без запаха", "almost odourless");
      note(`👋 ${L(t3("Қўл билан елпиб ҳидладингиз — тўғри! Ҳид:", "Вы направили запах рукой — правильно! Запах:", "You wafted it — correct! Smell:"))} ${L(sm)}`);
      once("lx_smell", 1, WHY);
    }
    if (t === "filter") { separate(t3("Фильтрланди: чўкма фильтр қоғозида қолди, тиниқ фильтрат идишда.", "Отфильтровано: осадок на фильтре, прозрачный фильтрат в сосуде.", "Filtered: the precipitate stays on the paper, clear filtrate in the vessel.")); return; }
    checkAll(); paint();
  }
  /* Аралаштирганда совун эритмаси кўпикланади — фақат эркин (кальцийга боғланмаган) совун бўлса */
  function stirFoam() {
    if (!EQ || !(S.used.has("soap"))) return;
    const free = (EQ.c.Soap || 0) * S.V;
    if (free > 0.004) { S.foamS = Math.min(1.2, (S.foamS || 0) + free * 8); note(L(t3("🫧 Кўп кўпик ҳосил бўлди — сув юмшоқ", "🫧 Много пены — вода мягкая", "🫧 Lots of foam — the water is soft"))); }
    else note(L(t3("Кўпик деярли йўқ, оқ ғубор пайдо бўлди — сув қаттиқ", "Пены почти нет, появился белый налёт — вода жёсткая", "Hardly any foam and a white scum — the water is hard")));
  }
  const hasSolids = () => [...S.used].some((id) => RID[id] && RID[id].k === "s");

  /* ---------- Асбоб-ускуналар: ўлчаш ва амаллар ---------- */
  const mgL = (k, mw) => (S.V > 0 ? Math.max(0, S.tot[k] || 0) / S.V * mw * 1000 : 0); // умумий миқдор, мг/л
  const doMg = () => (S.V > 0 ? (S.extra.DO || 0) / S.V * 32000 : 0);
  const unit = (uz, ru, en) => L(t3(uz, ru, en));
  const row = (a, b, cls) => `<tr${cls ? ` class="${cls}"` : ""}><td>${a}</td><td><b>${b}</b></td></tr>`;
  const tbl = (rows) => `<table class="l3-tbl lx-mt">${rows.join("")}</table>`;
  const badge = (txt, lvl) => `<span class="lx-lvl lx-${lvl}">${esc(txt)}</span>`;
  function meter(id, html, short) {
    const e = EQID[id];
    const b = ROOT.querySelector("[data-meter]");
    if (b) { b.hidden = false; b.innerHTML = `<p class="lx-mh"><i class="fa-solid ${e ? e.ic : "fa-gauge"}" aria-hidden="true"></i> <b>${H(e ? e.n : "")}</b></p>${html}`; }
    if (short) note(short);
  }
  const needLiq = () => { if (S.V <= 0) { toast(L(TX.empty)); return false; } return true; };
  const soilIn = () => R.filter((r) => r.soil && S.used.has(r.id));
  const soilPick = () => soilIn()[0] || (RID[sel] && RID[sel].soil ? RID[sel] : null);
  const sampIn = (prop) => R.filter((r) => r[prop] != null && S.used.has(r.id));
  function usda(sa, si, cl) {
    if (si + 1.5 * cl < 15) return "sand";
    if (si + 2 * cl < 30) return "lsand";
    if ((cl >= 7 && cl < 20 && sa > 52) || (cl < 7 && si < 50)) return "sloam";
    if (cl >= 7 && cl < 27 && si >= 28 && si < 50 && sa <= 52) return "loam";
    if ((si >= 50 && cl >= 12 && cl < 27) || (si >= 50 && si < 80 && cl < 12)) return "siloam";
    if (si >= 80 && cl < 12) return "silt";
    if (cl >= 20 && cl < 35 && si < 28 && sa > 45) return "scloam";
    if (cl >= 27 && cl < 40 && sa > 20 && sa <= 45) return "cloam";
    if (cl >= 27 && cl < 40 && sa <= 20) return "sicloam";
    if (cl >= 35 && sa > 45) return "sclay";
    if (cl >= 40 && si >= 40) return "siclay";
    return cl >= 40 ? "clay" : "loam";
  }
  const TEXN = { sand: t3("қум", "песок", "sand"), lsand: t3("қумлоқ қум", "связный песок", "loamy sand"), sloam: t3("қумлоқ", "супесь", "sandy loam"), loam: t3("ўрта қумоқ", "суглинок", "loam"), siloam: t3("чангли қумоқ", "пылеватый суглинок", "silt loam"), silt: t3("чанг", "пыль", "silt"), scloam: t3("қумли гилли қумоқ", "песчаный глинистый суглинок", "sandy clay loam"), cloam: t3("гилли қумоқ", "глинистый суглинок", "clay loam"), sicloam: t3("чангли гилли қумоқ", "пылеватый глинистый суглинок", "silty clay loam"), sclay: t3("қумли гил", "песчаная глина", "sandy clay"), siclay: t3("чангли гил", "пылеватая глина", "silty clay"), clay: t3("гил", "глина", "clay") };
  /* Хромофор → [номи, мг/л га ўтказиш (г/моль), нима ҳисобланади] */
  const CHN = {
    azo: [t3("Грисс азобўёғи", "азокраситель Грисса", "Griess azo dye"), 14007, "NO₂⁻-N"], moblue: [t3("молибден кўки", "молибденовая синь", "molybdenum blue"), 30974, "PO₄³⁻-P"],
    ness: [t3("Несслер комплекси", "комплекс Несслера", "Nessler complex"), 14007, "NH₄⁺-N"], fescn: [t3("темир роданиди", "роданид железа", "iron thiocyanate"), 55845, "Fe"],
    mno4: [t3("перманганат", "перманганат", "permanganate"), 118937, "MnO₄⁻"], cr3: [t3("Cr(III)", "Cr(III)", "Cr(III)"), 51996, "Cr³⁺"], cr6: [t3("бихромат Cr(VI)", "бихромат Cr(VI)", "dichromate Cr(VI)"), 51996, "Cr⁶⁺"],
    i2s: [t3("йод-крахмал", "иод-крахмал", "iodine-starch"), 253809, "I₂"], i2: [t3("йод", "иод", "iodine"), 253809, "I₂"], cu: [t3("мис (II)", "медь (II)", "copper(II)"), 63546, "Cu²⁺"],
    cro4: [t3("хромат", "хромат", "chromate"), 115994, "CrO₄²⁻"], fe3: [t3("темир (III)", "железо (III)", "iron(III)"), 55845, "Fe³⁺"], dpa: [t3("дифениламин кўки", "синь дифениламина", "diphenylamine blue"), 14007, "NO₃⁻-N"],
    ebtM: [t3("Эриохром–металл", "эриохром–металл", "Eriochrome–metal"), 0, ""], ebtF: [t3("эркин эриохром", "свободный эриохром", "free Eriochrome"), 0, ""], murM: [t3("мурексид–Ca", "мурексид–Ca", "murexide–Ca"), 0, ""], murF: [t3("эркин мурексид", "свободный мурексид", "free murexide"), 0, ""], mnooh: [t3("MnO(OH)₂ чўкмаси", "осадок MnO(OH)₂", "MnO(OH)₂ floc"), 0, ""]
  };
  function specSvg(lamSel) {
    const W = 300, Hh = 120, pad = 24, pts = [];
    for (let l = 380; l <= 900; l += 10) pts.push([l, K.absorb(S, EQ, l)]);
    const mx = Math.max(0.2, ...pts.map((p) => p[1]));
    const X = (l) => pad + (l - 380) / 520 * (W - pad - 6), Y = (a) => 6 + (1 - Math.min(a, mx) / mx) * (Hh - 26);
    const d = pts.map(([l, a], i) => `${i ? "L" : "M"}${X(l).toFixed(1)},${Y(a).toFixed(1)}`).join(" ");
    const rainbow = `<defs><linearGradient id="lxRb" x1="0" x2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset=".2" stop-color="#2563eb"/><stop offset=".35" stop-color="#16a34a"/><stop offset=".45" stop-color="#facc15"/><stop offset=".55" stop-color="#f97316"/><stop offset=".7" stop-color="#dc2626"/><stop offset="1" stop-color="#7f1d1d"/></linearGradient></defs>`;
    return `<svg class="lx-specsvg" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${H(t3("Ютилиш спектри", "Спектр поглощения", "Absorption spectrum"))}">${rainbow}<rect x="${pad}" y="${Hh - 16}" width="${W - pad - 6}" height="5" fill="url(#lxRb)" rx="2"/><path d="${d}" fill="none" stroke="currentColor" stroke-width="2"/><line x1="${X(lamSel)}" x2="${X(lamSel)}" y1="4" y2="${Hh - 18}" stroke="#db2777" stroke-dasharray="3 3"/><text x="2" y="12" font-size="9" fill="currentColor">A</text><text x="${pad}" y="${Hh - 2}" font-size="9" fill="currentColor">380</text><text x="${W - 30}" y="${Hh - 2}" font-size="9" fill="currentColor">900 нм</text></svg>`;
  }
  let soilPh = {};
  const STRIP = [
    ["pH", (v) => v, [4, 5, 6, 7, 8, 9, 10], ["#ef4444", "#f97316", "#facc15", "#84cc16", "#22c55e", "#0ea5e9", "#6d28d9"], ""],
    ["NO₃⁻", () => mgL("NO3", 62.004), [0, 10, 25, 50, 100, 250, 500], ["#ffffff", "#fce7f3", "#fbcfe8", "#f9a8d4", "#ec4899", "#be185d", "#831843"], "мг/л"],
    ["NO₂⁻", () => mgL("NO2", 46.006), [0, 0.5, 1, 2, 5, 10, 20], ["#ffffff", "#fdf2f8", "#fbcfe8", "#f472b6", "#db2777", "#9d174d", "#701a75"], "мг/л"],
    ["NH₄⁺", () => mgL("NH", 18.039), [0, 0.5, 1, 3, 6, 10], ["#fefce8", "#fef08a", "#d9f99d", "#86efac", "#22c55e", "#15803d"], "мг/л"],
    ["PO₄³⁻", () => mgL("P", 94.971), [0, 0.5, 1, 2, 5, 10], ["#ffffff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#3b82f6", "#1e3a8a"], "мг/л"],
    [L(t3("Қаттиқлик", "Жёсткость", "Hardness")), () => (S.V > 0 ? 2 * ((S.tot.Ca || 0) + (S.tot.Mg || 0)) / S.V * 1000 : 0), [0, 1, 2, 4, 7, 10], ["#22c55e", "#84cc16", "#a3e635", "#a855f7", "#9333ea", "#6b21a8"], "°Ж"],
    ["Fe", () => mgL("Fe", 55.845), [0, 0.1, 0.3, 1, 3, 10], ["#ffffff", "#fef3c7", "#fde68a", "#fbbf24", "#d97706", "#92400e"], "мг/л"],
    ["Cl⁻", () => mgL("Cl", 35.453), [0, 50, 100, 250, 500, 1000], ["#ffffff", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b"], "мг/л"]
  ];
  function eqAct(id, arg) {
    const e = EQID[id] || {};
    if (e.st === "u" && !uni()) { toast(L(TX.lockEq)); return; }
    const isAqTool = !["gas", "pm", "secchi", "sieve", "oven", "muffle", "fridge", "hood", "filt", "dist", "mstir"].includes(id);
    if (isAqTool && !ppeOk() && !["aas"].includes(id)) { warnPpe(); return; }
    if (id === "heat" || id === "empty") { tool(id); return; }
    if (id === "phm") {
      if (!needLiq()) return;
      const off = calPts.size >= 2 ? 0 : 0.31;
      const v = EQ.pH + off, mv = (7 - v) * 59.16;
      const kcl = (S.tot.K || 0) / S.V > 0.1;
      const lbl = soilIn().length ? (kcl ? "pH(KCl)" : "pH(H₂O)") : "pH";
      if (S.used.has("soilacid")) { soilPh[kcl ? "kcl" : "h2o"] = v; if (soilPh.kcl != null && soilPh.h2o != null && soilPh.h2o - soilPh.kcl > 0.3) discover("exch"); }
      S.meas.ph = v;
      const cls = v < 4.5 ? t3("кучли кислотали", "сильнокислая", "strongly acidic") : v < 6.5 ? t3("кислотали", "кислая", "acidic") : v <= 7.5 ? t3("нейтрал", "нейтральная", "neutral") : v <= 8.5 ? t3("кучсиз ишқорий", "слабощелочная", "slightly alkaline") : t3("ишқорий", "щелочная", "alkaline");
      meter(id, tbl([row(lbl, fmt(v, 2)), row("E", fmt(mv, 0) + " мВ"), row("T", fmt(S.T, 1) + " °C"), row(unit("Муҳит", "Среда", "Medium"), H(cls))]) + (off ? `<p class="small lx-bad">⚠️ ${H(t3("pH-метр калибрланмаган — кўрсаткич 0,3 бирликка адашиши мумкин. «Калибрлаш» ни икки буферда бажаринг.", "pH-метр не откалиброван — ошибка до 0,3 ед. Выполните «Калибровку» по двум буферам.", "The meter isn't calibrated — it may be off by 0.3. Run Calibrate with two buffers."))}</p>` : ""), `📟 ${lbl} = ${fmt(v, 2)}`);
      logStep("📟 " + lbl + " " + fmt(v, 2)); return;
    }
    if (id === "cal") {
      if (!needLiq()) return;
      const ids = [...S.used];
      if (ids.length !== 1 || !/^buf/.test(ids[0])) { toast(L(t3("Калибрлаш учун идишда фақат битта буфер эритма бўлсин (pH 4, 7 ёки 10).", "Для калибровки в сосуде должен быть только один буфер (pH 4, 7 или 10).", "For calibration the vessel must hold one buffer only (pH 4, 7 or 10)."))); return; }
      calPts.add(ids[0]);
      meter("phm", `<p>✅ ${H(t3("Калибрлаш нуқтаси қабул қилинди:", "Принята точка калибровки:", "Calibration point accepted:"))} <b>${esc(RID[ids[0]].f)}</b> (${calPts.size}/2)</p>${calPts.size >= 2 ? `<p class="small lx-ok">${H(t3("Қиялик 99,6 % — электрод яроқли. pH-метр калибрланди!", "Крутизна 99,6 % — электрод исправен. pH-метр откалиброван!", "Slope 99.6 % — the electrode is good. Calibrated!"))}</p>` : `<p class="small muted">${H(t3("Электродни чайиб, иккинчи буферга ўтинг.", "Ополосните электрод и перейдите ко второму буферу.", "Rinse the electrode and move to the second buffer."))}</p>`}`, "🎚️ " + RID[ids[0]].f);
      logStep("🎚️ cal " + RID[ids[0]].f); checkAll(); return;
    }
    if (id === "cond") {
      if (!needLiq()) return;
      const ec = K.conductivity(EQ), tds = 0.64 * ec, soil = soilIn().length > 0;
      S.meas.cond = ec;
      let cls, lvl;
      if (soil) { const d = ec / 1000; [cls, lvl] = d < 0.15 ? [t3("шўрланмаган", "незасолённая", "non-saline"), "ok"] : d < 0.45 ? [t3("кучсиз шўрланган", "слабозасолённая", "slightly saline"), "mid"] : d < 0.9 ? [t3("ўртача шўрланган", "среднезасолённая", "moderately saline"), "warn"] : d < 2 ? [t3("кучли шўрланган", "сильнозасолённая", "strongly saline"), "bad"] : [t3("шўрхок", "солончак", "extremely saline"), "bad"]; }
      else [cls, lvl] = ec < 50 ? [t3("жуда тоза (дистиллят, ёмғир)", "очень чистая (дистиллят, дождь)", "very pure (distilled, rain)"), "ok"] : ec < 800 ? [t3("ичимлик суви учун мос", "пригодна для питья", "fine for drinking"), "ok"] : ec < 1500 ? [t3("минераллашган", "минерализованная", "mineralised"), "mid"] : ec < 3000 ? [t3("шўртоб — суғоришда эҳтиёт бўлинг", "солоноватая — осторожно для полива", "brackish — irrigate with care"), "warn"] : ec < 15000 ? [t3("шўр — суғориш учун яроқсиз", "солёная — непригодна для полива", "saline — unfit for irrigation"), "bad"] : [t3("жуда шўр (денгиз, шўрхок)", "очень солёная (море, рассол)", "very saline (sea, brine)"), "bad"];
      if (ec > 1000) discover("ec");
      meter(id, tbl([row("EC", (ec >= 10000 ? fmt(ec / 1000, 1) + " мСм/см" : fmt(ec, 0) + " мкСм/см")), row("TDS", fmt(tds >= 10000 ? tds / 1000 : tds, tds >= 10000 ? 1 : 0) + (tds >= 10000 ? " г/л" : " мг/л")), row(soil ? "EC₁:₅" : unit("Баҳо", "Оценка", "Rating"), badge(L(cls), lvl))]) + `<p class="small muted">${H(soil ? t3("1:5 сўрим, ўрта қумоқ тупроқ учун тахминий шкала.", "Вытяжка 1:5, ориентировочная шкала для суглинков.", "1:5 extract; approximate scale for loams.") : t3("FAO (Ayers & Westcot): < 700 мкСм/см — суғоришда чеклов йўқ, > 3000 — жиддий чеклов.", "FAO (Ayers & Westcot): < 700 мкСм/см — без ограничений для полива, > 3000 — жёсткие ограничения.", "FAO (Ayers & Westcot): < 700 µS/cm no irrigation limits, > 3000 severe."))}</p>`, `⚡ EC = ${fmt(ec, 0)} мкСм/см`);
      logStep("⚡ EC " + fmt(ec, 0)); checkAll(); return;
    }
    if (id === "spec" || id === "kfk") {
      if (!needLiq()) return;
      if (id === "spec" && arg) lam = +arg;
      if (id === "spec") {
        const A = K.absorb(S, EQ, lam), Tp = Math.pow(10, -A) * 100;
        const o = K.chromo(S, EQ);
        let best = null, bv = 0;
        for (const k in o) { let a = 0; for (const [l0, w, ee] of K.BANDS[k] || []) a += ee * o[k] * Math.exp(-Math.pow((lam - l0) / w, 2)); if (a > bv) { bv = a; best = k; } }
        S.meas.spec = best && bv > 0.02 ? best : "";
        const ch = best && CHN[best];
        const conc = ch && ch[1] ? `${row(unit("Модда", "Вещество", "Species"), H(ch[0]))}${row(ch[2] + " " + unit("кюветада", "в кювете", "in cuvette"), "≈ " + fmt(o[best] * ch[1], o[best] * ch[1] < 1 ? 3 : 1) + " мг/л")}` : ch ? row(unit("Модда", "Вещество", "Species"), H(ch[0])) : "";
        meter(id, `<div class="lx-lam"><label for="lxLam">λ = <b data-lamv>${lam}</b> нм</label><input id="lxLam" type="range" min="380" max="900" step="5" value="${lam}" data-lam></div>${tbl([row("A", fmt(A, 3)), row("T", fmt(Tp, 1) + " %"), conc])}${specSvg(lam)}<p class="small muted">${H(t3("ε тахминий; аниқ натижа учун стандартлар билан калибрлаш эгри чизиғини тузинг. Лойқалик ёруғликни сочиб, A ни оширади.", "ε ориентировочные; для точности постройте калибровочную кривую по стандартам. Мутность рассеивает свет и завышает A.", "ε values are approximate — build a calibration curve with standards. Turbidity scatters light and raises A."))}</p>`, `🌈 A(${lam}) = ${fmt(A, 3)}`);
        const inp = ROOT.querySelector("[data-lam]");
        if (inp) inp.addEventListener("change", () => eqAct("spec", inp.value));
        if (inp) inp.addEventListener("input", () => { const v = ROOT.querySelector("[data-lamv]"); if (v) v.textContent = inp.value; });
        logStep("🌈 A" + lam + " " + fmt(A, 3)); checkAll(); return;
      }
      const F = [400, 440, 490, 540, 590, 670, 750, 870], Av = F.map((l) => K.absorb(S, EQ, l)), mi = Av.indexOf(Math.max(...Av));
      meter(id, tbl(F.map((l, i) => row(`${l} нм`, fmt(Av[i], 3), i === mi ? "lx-max" : ""))) + `<p class="small muted">${H(t3("Энг юқори оптик зичлик — эритма рангига қўшимча ранг фильтрида.", "Наибольшая оптическая плотность — на светофильтре дополнительного цвета.", "The highest density is at the filter of the complementary colour."))}</p>`, `🎨 D(${F[mi]}) = ${fmt(Av[mi], 3)}`);
      logStep("🎨 " + F[mi] + " " + fmt(Av[mi], 3)); return;
    }
    if (id === "turb") {
      if (!needLiq()) return;
      const t = K.color(S, EQ).tur, ntu = t > 0 ? 1000 * Math.pow(t, 1.2) : 0.1;
      const [cls, lvl] = ntu < 1 ? [t3("тиниқ — ичимлик суви талабига мос", "прозрачная — соответствует питьевой", "clear — meets drinking-water advice"), "ok"] : ntu < 5 ? [t3("бироз лойқа", "слегка мутная", "slightly cloudy"), "mid"] : ntu < 50 ? [t3("лойқа", "мутная", "cloudy"), "warn"] : [t3("жуда лойқа", "очень мутная", "very turbid"), "bad"];
      S.meas.turb = ntu;
      meter(id, tbl([row(unit("Лойқалик", "Мутность", "Turbidity"), fmt(ntu, ntu < 10 ? 1 : 0) + " NTU"), row(unit("Баҳо", "Оценка", "Rating"), badge(L(cls), lvl))]), `🌫️ ${fmt(ntu, 1)} NTU`);
      logStep("🌫️ " + fmt(ntu, 1) + " NTU"); return;
    }
    if (id === "oxy") {
      if (!needLiq()) return;
      const d = doMg(), sat = K.doSat(S.T), pc = d / sat * 100;
      const [cls, lvl] = d >= 7 ? [t3("яхши — балиқлар учун етарли", "хорошо — достаточно для рыб", "good — enough for fish"), "ok"] : d >= 5 ? [t3("қониқарли", "удовлетворительно", "fair"), "mid"] : d >= 2 ? [t3("кам — балиқлар учун хавфли", "мало — опасно для рыб", "low — stressful for fish"), "warn"] : [t3("гипоксия — «ўлик зона»", "гипоксия — «мёртвая зона»", "hypoxia — a dead zone"), "bad"];
      S.meas.oxy = d;
      meter(id, tbl([row("O₂", fmt(d, 2) + " мг/л"), row(unit("Тўйиниш", "Насыщение", "Saturation"), fmt(pc, 0) + " %"), row(unit("Тўйиниш чегараси", "Предел насыщения", "Saturation limit"), fmt(sat, 2) + " мг/л (" + fmt(S.T, 1) + " °C)"), row(unit("Баҳо", "Оценка", "Rating"), badge(L(cls), lvl))]), `🫧 O₂ = ${fmt(d, 2)} мг/л`);
      logStep("🫧 O₂ " + fmt(d, 2)); checkAll(); return;
    }
    if (id === "therm") { meter(id, tbl([row("T", fmt(S.T, 1) + " °C"), row("T", fmt(S.T + 273.15, 2) + " K")]), `🌡️ ${fmt(S.T, 1)} °C`); return; }
    if (id === "bal") {
      const tare = { beaker: 102.4113, flask: 118.7052, bod: 312.4890, tube: 11.9367 }[S.ves];
      const solid = R.filter((r) => r.k === "s" && S.amt[r.id]).reduce((a, r) => a + S.amt[r.id], 0);
      const rho = 1 + 0.035 * ((EQ && EQ.I) || 0), m = S.V * rho + solid;
      meter(id, tbl([row(unit("Идиш (тара)", "Сосуд (тара)", "Vessel (tare)"), fmt(tare, 4) + " г"), row(unit("Ичидаги", "Содержимое", "Contents"), fmt(m, 4) + " г"), row(unit("Жами", "Всего", "Total"), fmt(tare + m, 4) + " г")]), `⚖️ ${fmt(m, 4)} г`);
      return;
    }
    if (id === "aas") {
      const NORM_S = { Cu: 132, Pb: 32, Zn: 220, Cd: 2 }, NORM_W = { Cu: 2000, Pb: 10, Zn: 3000, Cd: 3 };
      const soils = soilIn();
      if (soils.length) {
        const g = soils.reduce((a, r) => a + S.amt[r.id], 0), mt = {};
        soils.forEach((r) => { for (const k in r.soil.hm) mt[k] = (mt[k] || 0) + r.soil.hm[k] * S.amt[r.id] / g; });
        S.meas.aas = soils[0].id;
        meter(id, tbl(Object.keys(NORM_S).map((k) => row(k, `${fmt(mt[k], k === "Cd" ? 1 : 0)} мг/кг ${mt[k] > NORM_S[k] ? badge("× " + fmt(mt[k] / NORM_S[k], 1), "bad") : badge("✓", "ok")}`))) + `<p class="small muted">${H(t3("Меъёр (тупроқ, мг/кг): Pb 32 (ПДК), Cu 132, Zn 220, Cd 2 (ОДК, нейтрал қумоқ). Намуна HNO₃ билан парчаланган.", "Норматив (почва, мг/кг): Pb 32 (ПДК), Cu 132, Zn 220, Cd 2 (ОДК, нейтральные суглинки). Проба разложена HNO₃.", "Limits (soil, mg/kg): Pb 32 (MPC), Cu 132, Zn 220, Cd 2 (neutral loams). Sample digested with HNO₃."))}</p>`, "⚛️ AAS");
        logStep("⚛️ AAS " + soils[0].id); checkAll(); return;
      }
      if (!needLiq()) return;
      const ws = sampIn("hm"), mt = {};
      ws.forEach((r) => { for (const k in r.hm) mt[k] = (mt[k] || 0) + r.hm[k] * S.amt[r.id] / S.V; });
      if (S.tot.Cu > 0) mt.Cu = (mt.Cu || 0) + EQ.c.Cu * 63546 * 1000 + (EQ.ppt.cuoh || 0) / S.V * 63546 * 1000;
      if (!Object.keys(mt).length) { meter(id, `<p>${H(t3("Оғир металлар аниқлаш чегарасидан паст (< 0,1 мкг/л).", "Тяжёлые металлы ниже предела обнаружения (< 0,1 мкг/л).", "Heavy metals below the detection limit (< 0.1 µg/L)."))}</p>`); return; }
      meter(id, tbl(Object.keys(NORM_W).filter((k) => mt[k] != null).map((k) => row(k, `${fmt(mt[k], mt[k] < 10 ? 1 : 0)} мкг/л ${mt[k] > NORM_W[k] ? badge("× " + fmt(mt[k] / NORM_W[k], 1), "bad") : badge("✓", "ok")}`))) + `<p class="small muted">${H(t3("ЖССТ ичимлик суви: Pb 10, Cd 3, Cu 2000 мкг/л; Zn учун соғлиқ меъёри йўқ (3000 — таъм чегараси).", "ВОЗ, питьевая вода: Pb 10, Cd 3, Cu 2000 мкг/л; для Zn норматива по здоровью нет (3000 — порог вкуса).", "WHO drinking water: Pb 10, Cd 3, Cu 2000 µg/L; no health value for Zn (3000 is the taste threshold)."))}</p>`, "⚛️ AAS");
      logStep("⚛️ AAS"); return;
    }
    if (id === "strip") {
      if (!needLiq()) return;
      if (EQ.pH < 2 || EQ.pH > 12) { meter(id, `<p class="lx-bad">${H(t3("Тасма шикастланди: намуна жуда кислотали ёки ишқорий. Тест-тасмалар pH 2–12 да ишлайди.", "Полоска испорчена: проба слишком кислая или щелочная. Полоски работают при pH 2–12.", "The strip is ruined: the sample is too acidic or alkaline. Strips work at pH 2–12."))}</p>`); return; }
      const out = STRIP.map(([n, f, sc, cols, u]) => { const v = n === "pH" ? EQ.pH : f(); let k = 0; sc.forEach((s, i) => { if (Math.abs(s - v) < Math.abs(sc[k] - v)) k = i; }); return [n, v, sc[k], cols[k], u, k === sc.length - 1 && v > sc[k] ? "+" : ""]; });
      S.meas.strip = out[1][2];
      if (out[1][2] >= 25) discover("strip");
      meter(id, `<div class="lx-strippad">${out.map(([n, , s, c, u, plus]) => `<div><span style="background:${c}" aria-hidden="true"></span><small>${esc(n)}</small><b>${fmt(s, s < 1 && s > 0 ? 1 : 0)}${plus} ${esc(u)}</b></div>`).join("")}</div><p class="small muted">${H(t3("Ярим-миқдорий натижа: шкаланинг энг яқин қиймати. ЖССТ: NO₃⁻ ≤ 50, NO₂⁻ ≤ 3 мг/л.", "Полуколичественно: ближайшее значение шкалы. ВОЗ: NO₃⁻ ≤ 50, NO₂⁻ ≤ 3 мг/л.", "Semi-quantitative: nearest chart value. WHO: NO₃⁻ ≤ 50, NO₂⁻ ≤ 3 mg/L."))}</p>`, `🧾 NO₃⁻ ≈ ${out[1][2]} мг/л`);
      logStep("🧾 strip NO3 " + out[1][2]); checkAll(); return;
    }
    if (id === "secchi") {
      const w = sampIn("sd").filter((r) => r.sd > 0)[0];
      if (!w) { meter(id, `<p>${H(t3("Секки диски табиий сув ҳавзасида ишлатилади: идишга дарё, кўл, Орол ёки коллектор суви намунасини қуйинг.", "Диск Секки применяют в водоёме: налейте пробу реки, озера, Арала или коллектора.", "The Secchi disk is used in a water body: add a river, pond, Aral or drainage sample."))}</p>`); return; }
      const sd = w.sd, tsi = 60 - 14.41 * Math.log(sd);
      const [cls, lvl] = tsi < 40 ? [t3("олиготроф (тоза)", "олиготрофный (чистый)", "oligotrophic (clean)"), "ok"] : tsi < 50 ? [t3("мезотроф", "мезотрофный", "mesotrophic"), "mid"] : tsi < 70 ? [t3("эвтроф", "эвтрофный", "eutrophic"), "warn"] : [t3("гипертроф", "гипертрофный", "hypertrophic"), "bad"];
      S.meas.secchi = sd;
      meter(id, tbl([row(unit("Жой", "Место", "Site"), H(w.n)), row("SD", fmt(sd, 2) + " м"), row("TSI", fmt(tsi, 0)), row(unit("Трофик ҳолат", "Трофность", "Trophic state"), badge(L(cls), lvl))]) + `<p class="small muted">${H(t3("Лойқа дарёларда (Сирдарё, Амударё) SD паст бўлиши чўкинди ҳисобига — TSI фақат кўллар учун аниқ.", "В мутных реках (Сырдарья, Амударья) низкая прозрачность из-за взвеси — TSI точен только для озёр.", "In silty rivers (Syr Darya, Amu Darya) low SD is due to sediment — TSI is meaningful for lakes."))}</p>`, `⚫ SD = ${fmt(sd, 2)} м`);
      checkAll(); return;
    }
    if (id === "bod") {
      if (!needLiq()) return;
      if (S.ves !== "bod" || S.V < 250) { toast(L(t3("БПК учун кислород шишасини 250 мл дан кўп тўлдиринг.", "Для БПК заполните кислородную склянку более чем на 250 мл.", "For BOD, fill the BOD bottle with more than 250 mL."))); return; }
      const x = S.extra, d0 = doMg();
      const seed = R.filter((r) => r.ex && r.ex.mic && S.used.has(r.id));
      const demand = (x.mic > 0 ? 0.68 * 0.7 * (x.org || 0) : 0);
      const used = Math.min(x.DO || 0, demand);
      x.DO = Math.max(0, (x.DO || 0) - used); x.org = Math.max(0, (x.org || 0) - used); S.T = 20;
      const d5 = doMg(), sv = seed.reduce((a, r) => a + (S.amt[r.id] || 0), 0), P = sv > 0 ? S.V / sv : 1;
      const dep = d0 - d5, ok = dep >= 2 && d5 >= 1;
      const bod = dep * P;
      if (ok && S.used.has("wastew")) S.meas.bodOk = true;
      meter(id, tbl([row("O₂ (0)", fmt(d0, 2) + " мг/л"), row("O₂ (5)", fmt(d5, 2) + " мг/л"), row(unit("Суюлтириш", "Разбавление", "Dilution"), "1:" + fmt(P, 0)), row("БПК₅", fmt(bod, bod < 10 ? 1 : 0) + " мг/л O₂")]) + `<p class="small ${ok ? "lx-ok" : "lx-bad"}">${H(x.mic > 0 || demand > 0 ? (ok ? t3("✅ Натижа ишончли: O₂ камида 2 мг/л камайди ва 1 мг/л дан кўп қолди.", "✅ Результат достоверен: O₂ снизился ≥ 2 мг/л и осталось > 1 мг/л.", "✅ Valid: O₂ dropped ≥ 2 mg/L and > 1 mg/L remains.") : d5 < 1 ? t3("❌ Кислород тугаб қолди — намунани кўпроқ суюлтиринг (масалан 1 мл намуна + 290 мл аэрацияланган сув).", "❌ Кислород закончился — разбавьте сильнее (например, 1 мл пробы + 290 мл аэрированной воды).", "❌ Oxygen ran out — dilute more (e.g. 1 mL sample + 290 mL aerated water).") : t3("⚠️ O₂ 2 мг/л дан кам камайди — намунани камроқ суюлтиринг.", "⚠️ O₂ снизился менее чем на 2 мг/л — разбавляйте меньше.", "⚠️ O₂ dropped < 2 mg/L — use less dilution.")) : t3("Намунада микроблар йўқ (дистиллят ёки автоклавланган) — БПК ≈ 0.", "В пробе нет микробов (дистиллят или автоклавировано) — БПК ≈ 0.", "No microbes (distilled or autoclaved) — BOD ≈ 0."))}</p>`, `⏳ БПК₅ ≈ ${fmt(bod, 0)} мг/л`);
      logStep("⏳ BOD5 " + fmt(bod, 0)); checkAll(); paint(); return;
    }
    if (id === "aer") {
      if (!needLiq()) return;
      S.extra.DO = K.doSat(S.T) / 32000 * S.V; S.aerT = 4;
      meter(id, `<p>🫧 ${H(t3("Аэрация: 20 дақиқа ҳаво пуфланди, кислород тўйиниш даражасига етди.", "Аэрация: 20 минут продувки воздухом, кислород до насыщения.", "Aerated for 20 min: oxygen is now at saturation."))} <b>${fmt(doMg(), 2)} мг/л</b></p>`, "🫧 " + L(t3("Аэрация", "Аэрация", "Aeration")));
      logStep("🫧 aer"); paint(); return;
    }
    if (id === "sieve" || id === "oven" || id === "muffle") {
      const r = soilPick();
      if (!r) { toast(L(t3("Аввал жавондан тупроқ намунасини танланг ёки идишга қўшинг.", "Сначала выберите на полке почвенный образец или добавьте его в сосуд.", "First pick a soil sample on the shelf or add it to the vessel."))); return; }
      const so = r.soil;
      if (id === "sieve") { const tx = usda(so.sand, so.silt, so.clay); meter(id, tbl([row(unit("Намуна", "Образец", "Sample"), H(r.n)), row(unit("Қум 2–0,05 мм", "Песок 2–0,05 мм", "Sand 2–0.05 mm"), so.sand + " %"), row(unit("Чанг 0,05–0,002 мм", "Пыль 0,05–0,002 мм", "Silt 0.05–0.002 mm"), so.silt + " %"), row(unit("Гил < 0,002 мм", "Глина < 0,002 мм", "Clay < 0.002 mm"), so.clay + " %"), row("USDA", H(TEXN[tx]))]), "🧱 " + L(TEXN[tx])); logStep("🧱 " + r.id); return; }
      if (id === "oven") { const m1 = 10, m2 = m1 / (1 + so.w / 100); meter(id, tbl([row(unit("Нам намуна m₁", "Влажная навеска m₁", "Wet mass m₁"), fmt(m1, 3) + " г"), row(unit("Қуруқ m₂ (105 °C)", "Сухая m₂ (105 °C)", "Dry m₂ (105 °C)"), fmt(m2, 3) + " г"), row("W", fmt(so.w, 1) + " %")]), `🔥 W = ${fmt(so.w, 1)} %`); logStep("🌡️ W " + so.w); return; }
      const c = (r.org || 0) * 12.011 / 10, hum = c * 1.724;
      meter(id, tbl([row("LOI (550 °C)", fmt(so.loi, 1) + " %"), row(unit("Органик углерод", "Органический углерод", "Organic carbon"), fmt(c, 2) + " %"), row(unit("Гумус (C × 1,724)", "Гумус (C × 1,724)", "Humus (C × 1.724)"), fmt(hum, 2) + " %"), row("CaCO₃", so.cc + " %")]) + `<p class="small muted">${H(t3("LOI гумусдан катта чиқади: гил минераллари таркибидаги сув ҳам йўқолади. CaCO₃ 550 °C да парчаланмайди.", "LOI выше гумуса: теряется и вода глинистых минералов. CaCO₃ при 550 °C не разлагается.", "LOI exceeds humus because clay minerals also lose water; CaCO₃ stays intact at 550 °C."))}</p>`, `🔥 LOI = ${fmt(so.loi, 1)} %`);
      logStep("🔥 LOI " + so.loi); return;
    }
    if (id === "shake") {
      if (S.V <= 0 || S.soilG <= 0) { toast(L(t3("Силкитиш учун идишда тупроқ ва сув (ёки KCl) бўлсин.", "Для встряхивания в сосуде нужны почва и вода (или KCl).", "Shaking needs soil and water (or KCl) in the vessel."))); return; }
      S.shakeT = 5; S.susp = 1; soilRelease(0.97); recompute();
      meter(id, `<p>🌀 ${H(t3("5 дақиқа чайқатилди: эрувчан тузлар сувга ўтди. Энди фильтрланг ёки центрифугаланг.", "Встряхивали 5 минут: растворимые соли перешли в раствор. Теперь отфильтруйте или отцентрифугируйте.", "Shaken for 5 min: soluble salts are in solution. Now filter or centrifuge."))}</p>`, "🌀 " + L(t3("Чайқатилди", "Встряхнуто", "Shaken")));
      logStep("🌀 shake"); checkAll(); paint(); return;
    }
    if (id === "cent") { separate(t3("Центрифугаланди (3000 айл/дақ, 10 дақиқа): заррачалар тубда, тиниқ эритма юқорида.", "Отцентрифугировано (3000 об/мин, 10 минут): частицы на дне, прозрачный раствор сверху.", "Centrifuged (3000 rpm, 10 min): particles at the bottom, clear liquid on top.")); return; }
    if (id === "asp") {
      const [sid, vol] = String(arg || "").split(":");
      if (sid && AIR.some((a) => a.id === sid)) airSite = sid;
      if (vol) airVol = +vol;
      if (!needLiq()) { return; }
      const a = AIR.find((x) => x.id === airSite), m3 = airVol / 1000;
      const co2 = a.co2 * 1e-6 * airVol / 24.45 * 1000 * 0.5, so2 = a.so2 * m3 / 64.07 / 1000 * 0.95, no2 = a.no2 * m3 / 46.01 / 1000;
      S.tot.C = (S.tot.C || 0) + co2; S.tot.SO3 = (S.tot.SO3 || 0) + so2;
      const x = S.extra;
      if ((x.griess || 0) > 0) { const n = Math.min(0.72 * no2, x.griess); x.griess -= n; x.azo = (x.azo || 0) + n; }
      else { S.tot.NO2 = (S.tot.NO2 || 0) + no2 / 2; S.tot.NO3 = (S.tot.NO3 || 0) + no2 / 2; }
      S.dust += a.pm10 * m3; S.airV += airVol; S.rateCO2 += Math.min(0.5, 0.05 + co2); S.aerT = 2;
      const i2b = x.I2 || 0;
      recompute(); reactInstant(); recompute();
      if (i2b > 1e-6 && (x.I2 || 0) < i2b * 0.2 && airSite === "ind") discover("so2");
      S.meas.asp = airSite;
      meter(id, `<p>💨 ${H(t3("Ўтказилган ҳаво:", "Прокачано воздуха:", "Air drawn:"))} <b>${fmt(airVol, 0)} л</b> · ${H(a.n)} · ${H(t3("жами", "всего", "total"))} ${fmt(S.airV, 0)} л</p><p class="small muted">${H(t3("CO₂ ≈ 50 %, SO₂ ≈ 95 % ютилади; NO₂ Грисс реактивида 0,72 коэффициент билан нитритга айланади; чанг фильтрда.", "Поглощается CO₂ ≈ 50 %, SO₂ ≈ 95 %; NO₂ в реактиве Грисса переходит в нитрит с коэффициентом 0,72; пыль — на фильтре.", "CO₂ ≈ 50 % and SO₂ ≈ 95 % are absorbed; NO₂ becomes nitrite in Griess reagent (factor 0.72); dust stays on the filter."))}</p>`, `💨 ${fmt(airVol, 0)} л — ${L(a.n)}`);
      logStep("💨 " + airSite + " " + airVol + " L"); checkAll(); paint(); return;
    }
    if (id === "gas" || id === "pm") {
      if (arg && AIR.some((a) => a.id === arg)) airSite = arg;
      const a = AIR.find((x) => x.id === airSite);
      if (id === "gas") {
        S.meas.gas = a.id;
        const [cls, lvl] = a.co2 < 800 ? [t3("тоза ҳаво", "свежий воздух", "fresh air"), "ok"] : a.co2 < 1000 ? [t3("ўртача", "средне", "fair"), "mid"] : a.co2 < 1500 ? [t3("шамоллатинг", "проветрите", "ventilate"), "warn"] : [t3("ёмон — диққат пасаяди, бош оғрийди", "плохо — падает внимание, болит голова", "poor — focus drops, headaches"), "bad"];
        meter(id, tbl([row(unit("Жой", "Место", "Site"), H(a.n)), row("CO₂", a.co2 + " ppm"), row(unit("Баҳо", "Оценка", "Rating"), badge(L(cls), lvl)), row("CO", fmt(a.co, 1) + " мг/м³ " + (a.co > WHO.co ? badge("> ЖССТ", "bad") : badge("✓", "ok")))]) + `<p class="small muted">${H(t3("Табиий фон ≈ 420 ppm (2024). ЖССТ: CO ≤ 4 мг/м³ (24 соат).", "Природный фон ≈ 420 ppm (2024). ВОЗ: CO ≤ 4 мг/м³ (24 ч).", "Background ≈ 420 ppm (2024). WHO: CO ≤ 4 mg/m³ (24 h)."))}</p>`, `☁️ CO₂ ${a.co2} ppm`);
        logStep("☁️ CO2 " + a.co2); checkAll(); return;
      }
      const r25 = a.pm25 / WHO.pm25, r10 = a.pm10 / WHO.pm10;
      meter(id, tbl([row(unit("Жой", "Место", "Site"), H(a.n)), row("PM2,5", `${a.pm25} мкг/м³ ${r25 > 1 ? badge("× " + fmt(r25, 1) + " ЖССТ", r25 > 3 ? "bad" : "warn") : badge("✓", "ok")}`), row("PM10", `${a.pm10} мкг/м³ ${r10 > 1 ? badge("× " + fmt(r10, 1) + " ЖССТ", r10 > 3 ? "bad" : "warn") : badge("✓", "ok")}`), row("SO₂ / NO₂", `${a.so2} / ${a.no2} мкг/м³`)]) + `<p class="small muted">${H(t3("ЖССТ 2021 (24 соат): PM2,5 ≤ 15, PM10 ≤ 45, SO₂ ≤ 40, NO₂ ≤ 25 мкг/м³.", "ВОЗ 2021 (24 ч): PM2,5 ≤ 15, PM10 ≤ 45, SO₂ ≤ 40, NO₂ ≤ 25 мкг/м³.", "WHO 2021 (24 h): PM2.5 ≤ 15, PM10 ≤ 45, SO₂ ≤ 40, NO₂ ≤ 25 µg/m³."))}</p>`, `🌫️ PM2,5 ${a.pm25}`);
      logStep("🌫️ PM " + a.id); return;
    }
    if (id === "filt") {
      if (S.airV <= 0) { toast(L(t3("Аввал аспиратор билан ҳаво ўтказинг.", "Сначала прокачайте воздух аспиратором.", "Draw air with the sampling pump first."))); return; }
      const c = S.dust / (S.airV / 1000);
      discover("dust");
      meter(id, tbl([row(unit("Ҳаво ҳажми", "Объём воздуха", "Air volume"), fmt(S.airV / 1000, 2) + " м³"), row(unit("Чанг массаси", "Масса пыли", "Dust mass"), fmt(S.dust, 1) + " мкг"), row("PM10", fmt(c, 0) + " мкг/м³ " + (c > WHO.pm10 ? badge("> ЖССТ", "bad") : badge("✓", "ok")))]) + `<p class="small muted">${H(t3("Аниқ тортиш учун камида 1 м³ ҳаво ўтказинг: микротарози 1 мкг гача ўлчайди.", "Для точного взвешивания прокачайте не менее 1 м³: микровесы измеряют до 1 мкг.", "Draw at least 1 m³ for an accurate weighing — the microbalance resolves 1 µg."))}</p>`, `🌫️ ${fmt(S.dust, 1)} мкг`);
      logStep("🌫️ filter " + fmt(c, 0)); return;
    }
    if (id === "fridge") { S.cold = !S.cold; meter(id, `<p>${S.cold ? "❄️ " + H(t3("Намуна музлатгичда: ҳарорат +4 °C гача тушади, реакциялар ва микроблар секинлашади.", "Проба в холодильнике: охлаждается до +4 °C, реакции и микробы замедляются.", "Sample in the fridge: cooling to +4 °C slows reactions and microbes.")) : H(t3("Намуна музлатгичдан олинди.", "Проба вынута из холодильника.", "Sample taken out of the fridge."))}</p>`, S.cold ? "❄️ +4 °C" : "❄️ OFF"); logStep(S.cold ? "❄️ ON" : "❄️ OFF"); paintEq(); return; }
    if (id === "auto") {
      if (!needLiq()) return;
      const had = (S.extra.yeast || 0) > 0 || (S.extra.mic || 0) > 0;
      S.extra.mic = 0; S.extra.yeast = 0; S.T = 95; S.extra.DO = Math.min(S.extra.DO || 0, K.doSat(95) / 32000 * S.V);
      meter(id, `<p>♨️ ${H(t3("121 °C, 15 дақиқа, ≈ 1 атм ортиқча босим: намуна стерилланди.", "121 °C, 15 минут, ≈ 1 атм избыточного давления: проба стерилизована.", "121 °C, 15 min, ≈ 1 atm gauge: the sample is sterile."))}</p>${had ? `<p class="small">${H(t3("Ачитқи ва бактериялар ўлди, каталаза ферменти парчаланди — энди H₂O₂ кўпикламайди, БПК ≈ 0.", "Дрожжи и бактерии погибли, каталаза разрушена — H₂O₂ больше не пенится, БПК ≈ 0.", "Yeast and bacteria died and catalase is destroyed — H₂O₂ no longer foams, BOD ≈ 0."))}</p>` : ""}`, "♨️ 121 °C");
      logStep("♨️ autoclave"); paint(); return;
    }
    if (id === "dist") { add("water", Math.min(20, VES[S.ves].max - S.V)); return; }
    if (id === "mstir") { S.mstir = !S.mstir; note(S.mstir ? "🧲 ON" : "🧲 OFF"); paintEq(); return; }
    if (id === "hood") { hood = !hood; meter(id, `<p>${hood ? "🌬️ " + H(t3("Тортиш шкафи ёқилди — энди ўткир буғли реактивлар билан ишлаш мумкин.", "Вытяжной шкаф включён — можно работать с летучими реактивами.", "Fume hood on — volatile reagents may now be used.")) : H(t3("Тортиш шкафи ўчирилди.", "Вытяжной шкаф выключен.", "Fume hood off."))}</p>`, hood ? "🌬️ ON" : "🌬️ OFF"); if (hood) once("lx_hood", 1, WHY); paintEq(); return; }
    if (id === "micro") {
      if (!needLiq() && !S.soilG) return;
      const MIC = { soil: t3("кварц ва дала шпати доналари, гил агрегатлари, илдиз қолдиқлари, замбуруғ гифалари", "зёрна кварца и полевого шпата, глинистые агрегаты, остатки корней, гифы грибов", "quartz and feldspar grains, clay aggregates, root remains, fungal hyphae"), river: t3("диатом сувўтлари (кремний қобиқли), лой заррачалари, айрим инфузориялар", "диатомовые водоросли (кремнистые панцири), частицы ила, отдельные инфузории", "diatoms (silica shells), silt particles, a few ciliates"), pond: t3("хлорелла ва спирогира сувўтлари, цианобактериялар, туфелька ва коловраткалар", "водоросли хлорелла и спирогира, цианобактерии, инфузории-туфельки и коловратки", "Chlorella and Spirogyra algae, cyanobacteria, paramecia and rotifers"), waste: t3("фаол ил бўлакчалари, бактериялар тўдаси, киприкли инфузориялар", "хлопья активного ила, скопления бактерий, ресничные инфузории", "activated-sludge flocs, bacterial clumps, ciliates"), aral: t3("туз кристаллари ва артемия қисқичбақаси личинкалари", "кристаллы соли и личинки рачка артемии", "salt crystals and Artemia brine-shrimp larvae"), clear: t3("тиниқ — тирик организм деярли йўқ", "прозрачно — живых организмов почти нет", "clear — almost no living organisms") };
      const seen = [...new Set(R.filter((r) => r.mic && S.used.has(r.id)).map((r) => r.mic))].map((k) => L(MIC[k]));
      const p = EQ.ppt; if (p.agcl > 0.002) seen.push(L(t3("AgCl нинг майда оқ кристаллари", "мелкие белые кристаллы AgCl", "tiny white AgCl crystals"))); if (p.caco3 > 0.01) seen.push(L(t3("CaCO₃ ромбоэдр кристаллари", "ромбоэдрические кристаллы CaCO₃", "rhombohedral CaCO₃ crystals")));
      if ((S.extra.yeast || 0) > 0) seen.push(L(t3("тухумсимон ачитқи ҳужайралари (куртакланяпти)", "овальные дрожжевые клетки (почкуются)", "oval yeast cells (budding)")));
      if ((S.extra.mic || 0) <= 0 && S.used.size && R.some((r) => r.ex && r.ex.mic && S.used.has(r.id))) seen.push(L(t3("ҳужайралар ҳаракатсиз — стерилланган", "клетки неподвижны — стерилизовано", "cells are motionless — sterilised")));
      meter(id, `<p>🔬 ×400: ${esc(seen.length ? seen.join("; ") : L(MIC.clear))}.</p>`, "🔬 ×400");
      once("lx_micro", 1, WHY); return;
    }
    /* Фақат маълумот берадиган жиҳозлар */
    if (once("lx_eq_" + id, 1, WHY)) toast("✅ " + L(e.n) + " +1 XP");
  }
  /* Фильтрлаш ва центрифуга: чўкма ва тупроқ заррачаларини ажратиш */
  function separate(msg) {
    const p = EQ.ppt, any = Object.values(p).some((v) => v > 1e-4) || S.cuo > 0 || S.soilG > 0 || (S.extra.mnooh || 0) > 1e-5;
    if (!any) { note(L(t3("Чўкма йўқ — ажратиладиган нарса йўқ.", "Осадка нет — отделять нечего.", "No precipitate — nothing to separate."))); return false; }
    const sub = (k, n) => { S.tot[k] = Math.max(0, (S.tot[k] || 0) - n); };
    sub("Ag", p.agcl + 2 * (p.ag2cro4 || 0)); sub("Cl", p.agcl); sub("CrO4", p.ag2cro4 || 0); sub("Ba", p.baso4); sub("SO4", p.baso4);
    sub("Ca", p.caco3); sub("C", p.caco3); sub("Cu", p.cuoh); sub("Fe", p.feoh); sub("Mg", p.mgoh || 0); sub("Mn2", p.mnoh || 0); sub("Al", p.aloh || 0);
    sub("Ca", p.casoap); sub("Soap", 2 * p.casoap);
    S.cuo = 0; S.extra.mnooh = 0; S.soilG = 0; S.susp = 0; S.pool = {}; S.soilOrg = 0; S.exH = 0; S.exHrel = 0;
    recompute();
    note(L(msg)); logStep("⧩ " + L(t3("ажратилди", "отделено", "separated")));
    checkAll(); paint();
    return true;
  }
  /* Тупроқдан эрувчан ионлар ва алмашинувчи кислоталик ўтиши */
  function soilRelease(frac) {
    if (S.V <= 0 || !S.soilG) return false;
    let ch = false;
    for (const k in S.pool) { const n = S.pool[k] * frac; if (n > 1e-12) { S.tot[k] = (S.tot[k] || 0) + n; S.pool[k] -= n; ch = true; } }
    S.ext = 1 - (1 - (S.ext || 0)) * (1 - frac);
    if (S.exH > 0) {
      const kcl = (S.tot.K || 0) / S.V > 0.1;
      const d = S.exH * S.ext * (kcl ? 0.97 : 0.004) - S.exHrel;
      if (d > 1e-9) {
        if (kcl) { S.tot.Al = (S.tot.Al || 0) + d / 3; S.tot.K -= d; } else S.tot.A = (S.tot.A || 0) + d;
        S.exHrel += d; ch = true;
      }
    }
    return ch;
  }

  /* ---------- Вақт бўйича жараёнлар (кинетика) ---------- */
  function tick(dt) {
    if (!S) return;
    let ch = false;
    const x = S.extra;
    if (S.mstir && S.V > 0) S.stirT = Math.max(S.stirT, 0.3);
    if (S.shakeT > 0) S.shakeT -= dt;
    if (S.aerT > 0) S.aerT -= dt;
    const fast = S.stirT > 0 || S.shakeT > 0 ? 2.5 : 1;
    /* Тупроқ: аралаштирганда ионлар тезроқ ўтади, тинч турганда заррачалар чўкади */
    if (S.soilG > 0 && S.V > 0) {
      const rate = S.shakeT > 0 ? 0.8 : S.stirT > 0 ? 0.3 : 0.02;
      if (soilRelease(1 - Math.exp(-rate * dt))) ch = true;
      if (S.stirT > 0 || S.shakeT > 0) S.susp = Math.min(1, S.susp + dt); else S.susp *= Math.exp(-0.05 * dt);
    }
    if (S.stirT > 0) S.stirT -= dt;
    /* Иситгич: 1,5 кВт (вақт тезлаштирилган), 100 °C да буғланиш (2260 Ж/г) */
    if (S.heat && S.V > 0) {
      const P = S.ves === "tube" ? 150 : 900;
      if (S.T < 100) S.T = Math.min(100, S.T + P * dt / (S.V * 4.18));
      else { const dv = P * dt / 2260; S.V = Math.max(0, S.V - dv); ch = true; if (S.V < VES[S.ves].max * 0.04 + 0.5) { S.heat = false; note(L(TX.dry)); } }
    } else { const Ta = S.cold ? 4 : 22; if (S.T !== Ta) { S.T += (Ta - S.T) * Math.min(1, dt * (S.cold ? 0.08 : 0.02)); if (Math.abs(S.T - Ta) < 0.05) S.T = Ta; } }
    /* Иссиқда кислород эрувчанлиги камаяди — ортиқчаси чиқиб кетади */
    if (S.V > 0 && (x.DO || 0) > 0) { const sat = K.doSat(Math.min(S.T, 100)) / 32000 * S.V; if (x.DO > sat * 1.02 && S.T > 25) x.DO = Math.max(sat, x.DO - (x.DO - sat) * Math.min(1, 0.2 * dt)); }
    /* Тюрин: 2Cr₂O₇²⁻ + 3C + 16H⁺ → 4Cr³⁺ + 3CO₂ + 8H₂O (қайнаганда) */
    if ((x.cr6 || 0) > 0 && S.T > 90 && ((S.soilOrg || 0) + (x.org || 0)) > 0) {
      const orgT = (S.soilOrg || 0) + (x.org || 0), r = Math.min(x.cr6, orgT / 1.5, x.cr6 * 0.05 * dt * Math.pow(2, (S.T - 90) / 10));
      x.cr6 -= r; x.cr3 = (x.cr3 || 0) + 2 * r;
      let need = 1.5 * r; const a = Math.min(S.soilOrg || 0, need); S.soilOrg -= a; need -= a; x.org = Math.max(0, (x.org || 0) - need);
      if ((x.cr3 || 0) > 0.02) discover("humus");
      ch = true;
    }
    if (S.heat && S.V <= 0) S.heat = false;
    const kT = Math.pow(2, (S.T - 22) / 10); /* Вант-Гофф: ҳар 10 °C да тезлик ≈ 2 марта */
    /* Каталаза: H₂O₂ → H₂O + ½O₂ (экзотермик, 98 кЖ/моль) */
    if ((x.H2O2 || 0) > 0 && (x.yeast || 0) > 0 && S.V > 0) {
      const r = Math.min(x.H2O2, x.H2O2 * 0.35 * Math.min(1, x.yeast) * fast * Math.min(kT, 3) * dt);
      x.H2O2 -= r; S.gasO2 += r / 2; S.rateO2 += r / 2; S.foamO2 = (S.foamO2 || 0) + r / 2;
      S.T = Math.min(100, S.T + 98 * r / (S.V * 4.18));
      if (S.gasO2 > 0.5) discover("o2");
      ch = true;
    }
    /* Перманганат + органика (кислотали ва иссиқ муҳитда тезроқ) */
    if ((S.tot.Mn || 0) > 0 && (x.org || 0) > 0 && S.V > 0) {
      const acid = EQ && EQ.pH < 4 ? 4 : 1;
      const r = Math.min(S.tot.Mn, S.tot.Mn * 0.12 * acid * kT * fast * dt);
      S.tot.Mn -= r; S.tot.K = Math.max(0, (S.tot.K || 0) - r); x.org = Math.max(0, x.org - r * 1.25);
      if (S.tot.Mn < 1e-6 && S.used.has("kmno4")) discover("mn");
      ch = true;
    }
    /* Cu(OH)₂ → CuO (80 °C дан юқори) */
    if (EQ && EQ.ppt.cuoh > 1e-4 && S.T > 80) {
      const r = Math.min(EQ.ppt.cuoh, EQ.ppt.cuoh * 0.5 * dt);
      S.tot.Cu -= r; S.cuo += r; /* OH⁻ сув бўлиб чиқади: Na⁺ жуфти қолади, шунинг учун умумий заряд сақланади */
      S.tot.Na = Math.max(0, (S.tot.Na || 0) - 2 * r);
      if (S.cuo > 0.01) discover("cuo");
      ch = true;
    }
    if (S.cold) { /* +4 °C да микроблар ва ферментлар деярли ишламайди */ }
    S.rateCO2 *= Math.pow(0.35, dt); S.rateO2 *= Math.pow(0.35, dt); S.foamO2 = (S.foamO2 || 0) * Math.pow(0.85, dt); S.foamS = (S.foamS || 0) * Math.pow(0.97, dt);
    if (ch) recompute();
    return ch;
  }

  /* ---------- Кашфиётлар ва вазифаларни текшириш ---------- */
  function discover(id) {
    if (S.disc.has(id)) return;
    S.disc.add(id);
    const d = DISC.find((x) => x[0] === id);
    if (d && once("lx_d_" + id, 4, WHY)) { toast(`${L(TX.discNew)} ${d[1]} ${L(d[3])} +4 XP`); renderDisc(); }
  }
  function checkAll() {
    if (!EQ || S.V <= 0 && !hasSolids()) return;
    const p = EQ.ppt, c = EQ.c;
    if (S.gasCO2 > 0.2 && (S.used.has("soda") || S.used.has("na2co3"))) discover("co2");
    if (S.gasCO2 > 0.1 && S.used.has("marble") && (S.tot.Ca || 0) > 0 && EQ.ppt.caco3 < (S.tot.Ca || 0) * 0.95) discover("marble");
    if ((S.ind.cab || 0) > 0 && (EQ.pH < 5.5 || EQ.pH > 8.5)) discover("cab");
    if (p.caco3 > 0.02 && S.used.has("lime")) discover("lime");
    if ((S.extra.I2 || 0) > 1e-5 && (S.extra.starch || 0) > 0 && S.T < 60) discover("iod");
    if (p.casoap > 0.002) discover("hard");
    const acidUsed = ["vinegar", "lemon", "rain", "hcl", "h2so4"].some((x) => S.used.has(x)), baseUsed = ["soda", "lime", "naoh", "na2co3", "marble"].some((x) => S.used.has(x));
    if (acidUsed && baseUsed && EQ.pH >= 6.5 && EQ.pH <= 7.5) discover("neut");
    if (p.agcl > 0.002) { S.seen.add("agcl"); discover("agcl"); }
    if (p.baso4 > 0.002) { S.seen.add("baso4"); discover("baso4"); }
    if (p.cuoh > 0.005) discover("cuoh");
    if (p.feoh > 0.0005 && (S.used.has("naoh") || S.used.has("na2co3") || S.used.has("lime") || S.used.has("soda"))) discover("feoh");
    if ((c.Fe || 0) > 1e-6 && (c.SCN || 0) > 1e-6) { S.seen.add("fescn"); discover("fescn"); }
    if ((S.ind.php || 0) > 0 && EQ.pH > 8.2) discover("php");
    if (S.gasCO2 > 0.05 && soilIn().length) discover("soilco2");
    if (S.used.has("edta") && (S.ind.ebt || 0) > 0 && (S.tot.Y || 0) > 0 && EQ.pH > 8 && EQ.freeM < 2e-6 && ((S.tot.Ca || 0) + (S.tot.Mg || 0)) > 1e-4) discover("ebt");
    if (p.ag2cro4 > 1e-5 && p.agcl > 0.002) discover("mohr");
    const ch = K.chromo(S, EQ);
    if ((ch.moblue || 0) > 2e-6) discover("moblue");
    if ((ch.ness || 0) > 5e-6) discover("ness");
    if ((ch.dpa || 0) > 0) discover("dpa");
    MIS.forEach(([id, st, , ok]) => {
      if (st === "u" && !uni()) return;
      let good = false; try { good = ok(S, EQ); } catch (e) { /* ignore */ }
      if (good && once("lx_m_" + id, 10, WHY)) { toast(L(TX.misOk)); renderMis(); }
    });
  }

  /* ---------- Кузатув матни ---------- */
  function observe() {
    if (!EQ) return [];
    const o = [], p = EQ.ppt, c = EQ.c;
    if (S.V <= 0 && !hasSolids()) return [L(TX.empty)];
    if (S.rateCO2 > 0.03) o.push("🫧 " + L(t3("Пуфакчалар чиқяпти (CO₂ гази)", "Идут пузырьки (газ CO₂)", "Bubbles are rising (CO₂ gas)")));
    if (S.rateO2 > 0.01) o.push("🫧 " + L(t3("Кўпик кўтарилмоқда (O₂ гази)", "Поднимается пена (газ O₂)", "Foam is rising (O₂ gas)")));
    if (p.agcl > 0.002) o.push("⚪ " + L(t3("Оқ сузмасимон чўкма (AgCl)", "Белый творожистый осадок (AgCl)", "White curdy precipitate (AgCl)")));
    if (p.baso4 > 0.002) o.push("🤍 " + L(t3("Оқ майда кристалл чўкма (BaSO₄)", "Белый мелкокристаллический осадок (BaSO₄)", "Fine white precipitate (BaSO₄)")));
    if (p.caco3 > 0.01) o.push("🥛 " + L(t3("Сутсимон лойқа (CaCO₃)", "Молочная муть (CaCO₃)", "Milky cloudiness (CaCO₃)")));
    if (p.casoap > 0.002) o.push("🧼 " + L(t3("Совун кўпикламай, оқ ғубор ҳосил қилди", "Мыло не пенится, образуется белый налёт", "Soap doesn't lather; white scum forms")));
    if (p.cuoh > 0.005) o.push("🔵 " + L(t3("Кўк ивиқсимон чўкма (Cu(OH)₂)", "Синий студенистый осадок (Cu(OH)₂)", "Blue gelatinous precipitate (Cu(OH)₂)")));
    if (S.cuo > 0.005) o.push("⚫ " + L(t3("Қора чўкма (CuO)", "Чёрный осадок (CuO)", "Black precipitate (CuO)")));
    if (p.feoh > 0.0005) o.push("🟤 " + L(t3("Қўнғир чўкма (Fe(OH)₃)", "Бурый осадок (Fe(OH)₃)", "Brown precipitate (Fe(OH)₃)")));
    if ((c.Fe || 0) > 1e-6 && (c.SCN || 0) > 1e-6) o.push("🩸 " + L(t3("Қон-қизил ранг", "Кроваво-красная окраска", "Blood-red colour")));
    if ((S.extra.I2 || 0) > 1e-5 && (S.extra.starch || 0) > 0) o.push(S.T < 60 ? "🟦 " + L(t3("Тўқ кўк ранг", "Тёмно-синяя окраска", "Dark blue colour")) : "🌡️ " + L(t3("Иссиқда кўк ранг йўқолди (совуса қайтади)", "При нагреве синева исчезла (вернётся при охлаждении)", "The blue fades when hot (returns on cooling)")));
    if ((c.Mn || 0) > 1e-6) o.push("🟣 " + L(t3("Пушти-бинафша ранг (MnO₄⁻)", "Розово-фиолетовая окраска (MnO₄⁻)", "Pink-purple colour (MnO₄⁻)")));
    if (S.T >= 99.5 && S.heat) o.push("♨️ " + L(TX.boil));
    else if (S.T > 30) o.push("🌡️ " + L(t3("Идиш иссиқ", "Сосуд горячий", "The vessel is hot")));
    else if (S.T < 19) o.push("❄️ " + L(t3("Идиш совиди", "Сосуд охладился", "The vessel got colder")));
    const ch = K.chromo(S, EQ);
    if (S.soilG > 0) o.push("🟫 " + L(S.susp > 0.3 ? t3("Жигарранг лойқа суспензия (тупроқ заррачалари)", "Бурая мутная суспензия (частицы почвы)", "Brown cloudy suspension (soil particles)") : t3("Тупроқ тубга чўкди, устида сўрим", "Почва осела, сверху вытяжка", "Soil settled; extract above it")));
    if (p.mnoh > 1e-5) o.push("⚪ " + L(t3("Оқ ивиқсимон чўкма (Mn(OH)₂)", "Белый хлопьевидный осадок (Mn(OH)₂)", "White flocculent precipitate (Mn(OH)₂)")));
    if ((S.extra.mnooh || 0) > 1e-5) o.push("🟫 " + L(t3("Қўнғир парча-парча чўкма — кислород «қотирилди» (MnO(OH)₂)", "Бурые хлопья — кислород «зафиксирован» (MnO(OH)₂)", "Brown floc — oxygen fixed (MnO(OH)₂)")));
    if (p.mgoh > 1e-4) o.push("⚪ " + L(t3("Оқ чўкма (Mg(OH)₂)", "Белый осадок (Mg(OH)₂)", "White precipitate (Mg(OH)₂)")));
    if (p.ag2cro4 > 1e-5) o.push("🟠 " + L(t3("Қизил-қўнғир тус (Ag₂CrO₄) — охирги нуқта", "Красно-бурый оттенок (Ag₂CrO₄) — конечная точка", "Red-brown tint (Ag₂CrO₄) — end point")));
    else if (ch.cro4) o.push("🟡 " + L(t3("Сариқ ранг (хромат)", "Жёлтая окраска (хромат)", "Yellow colour (chromate)")));
    if (ch.azo) o.push("🌺 " + L(t3("Пушти-қизил ранг (азобўёқ — нитрит бор)", "Розово-красная окраска (азокраситель — есть нитрит)", "Pink-red colour (azo dye — nitrite present)")));
    if (ch.moblue) o.push("🔷 " + L(t3("Кўк ранг (молибден кўки — фосфат бор)", "Синяя окраска (молибденовая синь — есть фосфат)", "Blue colour (molybdenum blue — phosphate present)")));
    if (ch.ness) o.push("🟨 " + L(t3("Сариқ-қўнғир ранг (аммоний бор)", "Жёлто-бурая окраска (есть аммоний)", "Yellow-brown colour (ammonium present)")));
    if (ch.dpa) o.push("🫐 " + L(t3("Тўқ кўк ранг (нитрат бор)", "Тёмно-синяя окраска (есть нитрат)", "Deep blue colour (nitrate present)")));
    if (ch.cr6 || ch.cr3) o.push((ch.cr3 && ch.cr3 > ch.cr6 * 0.3 ? "🟩 " : "🟧 ") + L(ch.cr3 > 0.005 ? t3("Зарғалдоқ ранг яшилга мойил (Cr³⁺ ҳосил бўлди)", "Оранжевый цвет зеленеет (образовался Cr³⁺)", "Orange turning green (Cr³⁺ formed)") : t3("Зарғалдоқ ранг (бихромат)", "Оранжевая окраска (бихромат)", "Orange colour (dichromate)")));
    if (ch.ebtM) o.push("🍷 " + L(t3("Вино-қизил ранг (металл–индикатор)", "Винно-красная окраска (металл–индикатор)", "Wine-red (metal–indicator)")));
    if (ch.ebtF) o.push("🔵 " + L(t3("Тоза кўк ранг — эркин индикатор (охирги нуқта)", "Чисто-синяя окраска — свободный индикатор (конечная точка)", "Pure blue — free indicator (end point)")));
    if (ch.murM) o.push("🌸 " + L(t3("Пушти (Ca–мурексид)", "Розовая (Ca–мурексид)", "Pink (Ca–murexide)")));
    if (ch.murF) o.push("🟣 " + L(t3("Бинафша — кальций тўлиқ боғланди", "Фиолетовая — кальций связан полностью", "Violet — all calcium bound")));
    if (S.cold) o.push("❄️ " + L(t3("Музлатгичда (+4 °C)", "В холодильнике (+4 °C)", "In the fridge (+4 °C)")));
    if (!o.length) o.push(L(TX.nothing));
    return o;
  }

  /* ---------- Журнал ---------- */
  let addedV = 0;
  function logStep(act, id, v) {
    if (v) addedV += v;
    const row = { t: new Date().toLocaleTimeString().slice(0, 8), a: act, pH: EQ ? +EQ.pH.toFixed(2) : 7, T: +S.T.toFixed(1), V: +S.V.toFixed(2), x: +addedV.toFixed(2), id: id || "" };
    S.log.push(row);
    const all = getJ(LKEY, []); all.push(row); putJ(LKEY, all.slice(-300));
    renderLog();
  }

  /* ---------- 3D хона ---------- */
  let view = null, built = false, glFail = false, mountId = 0, R3 = null;
  const hex = (h) => parseInt(h.slice(1), 16);
  function build3d(v, lib) {
    const T = lib.T, sc = v.scene;
    const M = (color, o = {}) => new T.MeshStandardMaterial(Object.assign({ color, roughness: 0.8 }, o));
    const box = (w, h, d, m, x, y, z) => { const b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); sc.add(b); return b; };
    sc.background = new T.Color(document.documentElement.dataset.theme === "dark" ? "#1e293b" : "#e2e8f0");
    /* Хона: пол, деворлар, дераза. Кенгайтирилган хона (11 × 8 м); деворлар фақат ичкаридан кўринади —
       камера ҳар томондан айланса ҳам ичкари очиқ қолади */
    const supports = [], drags = [], eqObjs = [];
    const sup = (m) => { m.userData.support = true; supports.push(m); return m; };
    const wall = (w, h, x, y, z, ry, col) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), M(col)); m.position.set(x, y, z); m.rotation.y = ry; m.userData.noPick = true; sc.add(m); return m; };
    sup(box(10.8, 0.05, 8.2, M(0xb08968), 0.9, -0.025, 2.5));
    wall(10.8, 3.6, 0.9, 1.8, -1.6, 0, 0xe7efe9);
    wall(8.2, 3.6, -4.5, 1.8, 2.5, Math.PI / 2, 0xdbe7df);
    wall(8.2, 3.6, 6.3, 1.8, 2.5, -Math.PI / 2, 0xe2ece5);
    const win = box(1.6, 1.1, 0.02, new T.MeshBasicMaterial({ color: 0xbae6fd }), -3.4, 2.15, -1.57);
    box(1.7, 0.06, 0.06, M(0xffffff), -3.4, 1.58, -1.55); box(0.05, 1.1, 0.04, M(0xffffff), -3.4, 2.15, -1.55);
    const win2 = box(1.6, 1.1, 0.02, new T.MeshBasicMaterial({ color: 0xbae6fd }), 4.3, 2.15, -1.57);
    box(1.7, 0.06, 0.06, M(0xffffff), 4.3, 1.58, -1.55); box(0.05, 1.1, 0.04, M(0xffffff), 4.3, 2.15, -1.55);
    void win; void win2;
    /* Плитка (кафель) йўли девор бўйлаб */
    for (let i = -4; i <= 6; i++) box(0.98, 0.5, 0.01, M(i % 2 ? 0xffffff : 0xf1f5f9), i, 1.2, -1.56);
    /* Лаборатория столи (марказ) */
    sup(box(4.6, 0.08, 1.3, M(0x1f2937, { roughness: 0.5 }), 0, 0.9, -0.1));
    box(4.5, 0.86, 1.2, M(0xf8fafc), 0, 0.43, -0.12);
    [-1.5, 0, 1.5].forEach((x) => box(1.38, 0.7, 0.01, M(0xe2e8f0), x, 0.45, 0.49));
    /* Ўнг томонда асбоблар столи, чапда тупроқ ва ҳаво таҳлили столи */
    sup(box(1.15, 0.08, 3.3, M(0x1f2937, { roughness: 0.5 }), 3.55, 0.9, 1.55));
    box(1.05, 0.86, 3.2, M(0xf1f5f9), 3.55, 0.43, 1.55);
    sup(box(1.05, 0.08, 2.6, M(0x3f3f46, { roughness: 0.6 }), -3.9, 0.9, 2.5));
    box(0.95, 0.86, 2.5, M(0xe7e5e4), -3.9, 0.43, 2.5);
    /* Раковина ва жўмрак */
    box(0.6, 0.02, 0.45, M(0x94a3b8, { metalness: 0.6, roughness: 0.3 }), -1.75, 0.945, -0.2);
    const tap = new T.Mesh(new T.TorusGeometry(0.12, 0.02, 8, 16, Math.PI), M(0x94a3b8, { metalness: 0.7, roughness: 0.3 })); tap.position.set(-1.75, 1.05, -0.45); sc.add(tap);
    /* Жавонлар (5 қатор) */
    const PER = Math.ceil(R.length / 5), shelfY = [1.45, 1.9, 2.35, 2.8, 3.25].slice(0, Math.ceil(R.length / PER));
    shelfY.forEach((y) => sup(box(4.7, 0.04, 0.32, M(0x8b5e34), 0.12, y - 0.02, -1.42)));
    /* Шишалар */
    const bottles = [];
    const isU = uni();
    R.forEach((r, i) => {
      const row = Math.floor(i / PER), col = i % PER;
      const x = -2.0 + col * (4.45 / PER), y = shelfY[row], z = -1.42;
      const g = new T.Group(); g.position.set(x, y, z); g.scale.setScalar(Math.min(0.82, 0.82 * 17 / PER));
      const locked = r.st === "u" && !isU;
      const glass = new T.Mesh(r.k === "s" ? new T.CylinderGeometry(0.09, 0.09, 0.2, 16) : new T.CylinderGeometry(0.08, 0.1, 0.24, 16), new T.MeshStandardMaterial({ color: r.k === "s" ? 0xffffff : 0xdbeafe, transparent: true, opacity: 0.45, roughness: 0.1 }));
      glass.position.y = r.k === "s" ? 0.1 : 0.12; g.add(glass);
      const liq = new T.Mesh(new T.CylinderGeometry(r.k === "s" ? 0.085 : 0.075, r.k === "s" ? 0.085 : 0.095, r.k === "s" ? 0.12 : 0.17, 16), M(locked ? 0x9ca3af : hex(r.col), { roughness: 0.4 }));
      liq.position.y = r.k === "s" ? 0.07 : 0.095; g.add(liq);
      const cap = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.06, 12), M(r.k === "s" ? 0x0f766e : 0x334155)); cap.position.y = r.k === "s" ? 0.23 : 0.27; g.add(cap);
      if (r.k === "l") { const neck = new T.Mesh(new T.CylinderGeometry(0.035, 0.05, 0.05, 12), glass.material); neck.position.y = 0.245; g.add(neck); }
      /* Ёрлиқ: оқ қоғоз; номи фақат танланган шиша устида кўринади (зич жавонда матнлар устма-уст тушмасин) */
      const plate = new T.Mesh(new T.PlaneGeometry(0.1, 0.07), new T.MeshBasicMaterial({ color: locked ? 0xfca5a5 : 0xffffff })); plate.position.set(0, r.k === "s" ? 0.08 : 0.1, (r.k === "s" ? 0.091 : 0.088)); g.add(plate);
      if (locked) { const lk = lib.textSprite("🔒", "#0f172a", 0.1); lk.position.set(0, 0.36, 0.04); g.add(lk); }
      g.userData = { rid: r.id, locked, drag: "b:" + r.id };
      g.traverse((o) => { o.userData.rid = r.id; });
      sc.add(g); bottles.push(g); drags.push(g);
    });
    /* Идиш, суюқлик, чўкма, кўпик */
    const vesG = new T.Group(); vesG.position.set(0.2, 0.94, 0.15); sc.add(vesG);
    const glassM = new T.MeshPhysicalMaterial ? new T.MeshPhysicalMaterial({ color: 0xf0f9ff, transparent: true, opacity: 0.28, roughness: 0.05, side: T.DoubleSide }) : M(0xf0f9ff, { transparent: true, opacity: 0.28, side: T.DoubleSide });
    const liqM = new T.MeshStandardMaterial({ color: 0xdbeafe, transparent: true, opacity: 0.5, roughness: 0.2 });
    const pptM = M(0xffffff);
    const foamM = M(0xffffff, { transparent: true, opacity: 0.9, roughness: 1 });
    let glassMesh = null, liqMesh = null, pptMesh = null, foam = null, prof = null;
    const shape = () => {
      const ves = S.ves;
      if (ves === "tube") return { h: 0.75, r: () => 0.08 };
      if (ves === "flask") return { h: 0.62, r: (y) => (y < 0.4 ? 0.3 - 0.5 * y : 0.075) };
      if (ves === "bod") return { h: 0.7, r: (y) => (y < 0.45 ? 0.24 : y < 0.55 ? 0.24 - (y - 0.45) * 1.7 : 0.07) };
      return { h: 0.55, r: () => 0.27 };
    };
    const rebuildVessel = () => {
      [glassMesh, liqMesh, pptMesh, foam].forEach((m) => { if (m) { vesG.remove(m); m.geometry.dispose(); } });
      prof = shape();
      const pts = [];
      for (let i = 0; i <= 24; i++) { const y = prof.h * i / 24; pts.push(new T.Vector2(prof.r(y), y)); }
      glassMesh = new T.Mesh(new T.LatheGeometry(pts, 32), glassM); vesG.add(glassMesh);
      liqMesh = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.01, 32), liqM); vesG.add(liqMesh);
      pptMesh = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.01, 24), pptM); vesG.add(pptMesh);
      foam = new T.Mesh(new T.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), foamM); foam.visible = false; vesG.add(foam);
      lastLv = -1;
    };
    let lastLv = -1;
    const fillTo = (lv) => {
      /* Суюқлик шакли идиш профилига мос: кесик конус */
      const h = Math.max(0.004, lv * prof.h * 0.92), r0 = prof.r(0) * 0.94, r1 = prof.r(h) * 0.94;
      liqMesh.geometry.dispose(); liqMesh.geometry = new T.CylinderGeometry(r1, r0, h, 32); liqMesh.position.y = h / 2 + 0.005; liqMesh.visible = lv > 0.002;
      return h;
    };
    rebuildVessel();
    /* Иситгич (спиртовка) ва аланга */
    const burner = new T.Mesh(new T.CylinderGeometry(0.12, 0.15, 0.1, 20), M(0x475569, { metalness: 0.5 })); burner.position.set(0, 0.0, 0); vesG.add(burner); burner.visible = false;
    const flame = new T.Mesh(new T.ConeGeometry(0.07, 0.22, 16), new T.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.8 }));
    flame.position.set(0, -0.1, 0); vesG.add(flame); flame.visible = false;
    const stand = new T.Mesh(new T.TorusGeometry(0.29, 0.012, 6, 32), M(0x334155, { metalness: 0.6 })); stand.rotation.x = Math.PI / 2; stand.position.y = 0.0; vesG.add(stand);
    /* Пуфакчалар */
    const bubM = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
    const bubbles = Array.from({ length: 46 }, () => { const b = new T.Mesh(new T.SphereGeometry(0.012 + Math.random() * 0.012, 6, 5), bubM); b.visible = false; b.userData = { y: Math.random(), a: Math.random() * 6.28, r: Math.random() }; vesG.add(b); return b; });
    /* Буғ */
    const steamM = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
    const steam = Array.from({ length: 14 }, () => { const b = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), steamM); b.visible = false; b.userData = { t: Math.random() }; vesG.add(b); return b; });
    /* Термометр ва pH-метр */
    const thermo = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, 0.7, 8), M(0xf1f5f9, { transparent: true, opacity: 0.8 })); thermo.position.set(0.12, 0.42, 0.05); thermo.rotation.z = -0.25; vesG.add(thermo);
    const merc = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 1, 8), M(0xdc2626)); vesG.add(merc);
    let phSpr = null, tSpr = null, phTxt = "";
    const meterText = () => {
      const t = EQ && (S.V > 0) ? "pH " + fmt(EQ.pH, 1) : "pH —";
      if (t === phTxt) return; phTxt = t;
      if (phSpr) { if (phSpr.parent) phSpr.parent.remove(phSpr); phSpr.material.map.dispose(); phSpr.material.dispose(); }
      const pg = eqObjs.find((g) => g.userData.eq === "phm");
      phSpr = lib.textSprite(t, "#34d399", 0.13); phSpr.position.set(0, 0.4, 0.1); (pg || sc).add(phSpr);
    };
    let tTxt = "";
    const tempText = () => {
      const t = fmt(S.T, 0) + " °C";
      if (t === tTxt) return; tTxt = t;
      if (tSpr) { vesG.remove(tSpr); tSpr.material.map.dispose(); tSpr.material.dispose(); }
      tSpr = lib.textSprite(t, "#b91c1c", 0.08); tSpr.position.set(0.26, 0.82, 0.08); vesG.add(tSpr);
    };
    /* Хавфсизлик буюмлари ва асбоб-ускуналар: ҳар бири алоҳида гуруҳ — ушлаб суриш мумкин, босилса номи ва амали чиқади */
    const metal = M(0x94a3b8, { metalness: 0.6, roughness: 0.35 }), white = M(0xf8fafc, { roughness: 0.5 }), dark = M(0x1e293b, { roughness: 0.4 }), teal = M(0x0f766e, { roughness: 0.5 }), glassMat = new T.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.4, roughness: 0.05 });
    const gb = (g, w, h, d, m, x, y, z) => { const b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); g.add(b); return b; };
    const gc = (g, rt, rb, h, m, x, y, z, seg = 20) => { const c = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), m); c.position.set(x, y, z); g.add(c); return c; };
    const scr = (c) => new T.MeshBasicMaterial({ color: c });
    const EQG = (id, x, y, z, build, ry = 0) => {
      const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry; build(g);
      g.userData = { eq: id, drag: "e:" + id };
      g.traverse((o) => { o.userData.eq = id; });
      sc.add(g); eqObjs.push(g); drags.push(g); return g;
    };
    /* Пол ва девор ёнида */
    EQG("ext", 6.0, 0, -1.25, (g) => { gc(g, 0.11, 0.11, 0.5, M(0xdc2626, { roughness: 0.4 }), 0, 0.25, 0); gc(g, 0.03, 0.03, 0.08, dark, 0, 0.54, 0); gb(g, 0.16, 0.03, 0.03, dark, 0.06, 0.58, 0); });
    EQG("bin", 2.6, 0, 0.75, (g) => { gb(g, 0.45, 0.6, 0.45, M(0xfacc15), 0, 0.3, 0); gb(g, 0.47, 0.04, 0.47, M(0xeab308), 0, 0.62, 0); const s = lib.textSprite("☣️", "#fff", 0.26); s.position.set(0, 0.85, 0); g.add(s); });
    EQG("fridge", 4.85, 0, -1.15, (g) => { gb(g, 0.8, 1.9, 0.7, white, 0, 0.95, 0); gb(g, 0.04, 0.5, 0.04, metal, -0.35, 1.2, 0.36); gb(g, 0.78, 0.01, 0.01, M(0xcbd5e1), 0, 1.3, 0.355); const s = lib.textSprite("🧊", "#fff", 0.24); s.position.set(0, 2.05, 0.1); g.add(s); });
    EQG("auto", -4.0, 0, 0.6, (g) => { gc(g, 0.28, 0.28, 0.55, metal, 0, 0.28, 0); gc(g, 0.3, 0.3, 0.06, dark, 0, 0.58, 0); gb(g, 0.12, 0.08, 0.02, scr(0x22c55e), 0, 0.35, 0.28); });
    EQG("shower", 6.1, 0, 3.9, (g) => { gc(g, 0.03, 0.03, 2.3, metal, 0, 1.15, 0); gc(g, 0.2, 0.06, 0.08, M(0x16a34a), 0, 2.3, 0.15); gb(g, 0.3, 0.02, 0.3, M(0x22c55e), 0, 0.01, 0); });
    EQG("eyew", 6.1, 0.94, 3.0, (g) => { gc(g, 0.03, 0.03, 0.4, metal, 0, 0.2, 0); gc(g, 0.12, 0.06, 0.06, M(0x16a34a), 0, 0.42, 0); }, -Math.PI / 2);
    EQG("kit", 3.3, 1.45, -1.52, (g) => { gb(g, 0.42, 0.32, 0.12, white, 0, 0.16, 0); gb(g, 0.06, 0.2, 0.01, M(0xdc2626), 0, 0.16, 0.065); gb(g, 0.2, 0.06, 0.01, M(0xdc2626), 0, 0.16, 0.065); });
    EQG("spill", 5.6, 0, 3.6, (g) => { gc(g, 0.18, 0.15, 0.36, M(0xf97316), 0, 0.18, 0); gc(g, 0.19, 0.19, 0.03, dark, 0, 0.37, 0); });
    /* Марказий стол */
    EQG("bal", -0.95, 0.94, -0.4, (g) => { gb(g, 0.36, 0.06, 0.36, white, 0, 0.03, 0); const gl = gb(g, 0.3, 0.22, 0.3, glassMat, 0, 0.17, 0); void gl; gb(g, 0.16, 0.04, 0.01, scr(0x0f172a), 0, 0.03, 0.185); gc(g, 0.07, 0.07, 0.01, metal, 0, 0.065, 0); });
    EQG("spec", 1.65, 0.94, -0.35, (g) => { gb(g, 0.55, 0.22, 0.4, M(0x334155), 0, 0.11, 0); gb(g, 0.2, 0.1, 0.01, scr(0x22d3ee), -0.1, 0.16, 0.205); gb(g, 0.1, 0.04, 0.1, dark, 0.15, 0.23, 0); });
    /* Ўнг асбоблар столи */
    EQG("micro", 3.5, 0.94, 0.35, (g) => {
      gb(g, 0.26, 0.04, 0.34, dark, 0, 0.02, 0);
      gb(g, 0.06, 0.42, 0.08, dark, 0, 0.23, -0.12);
      gb(g, 0.2, 0.02, 0.2, M(0x334155), 0, 0.2, 0.02);
      gb(g, 0.08, 0.004, 0.05, glassMat, 0, 0.212, 0.02);
      const tube = gc(g, 0.035, 0.035, 0.24, dark, 0, 0.4, -0.02); tube.rotation.x = 0.35;
      const eye = gc(g, 0.025, 0.03, 0.08, M(0x0f172a), 0, 0.53, -0.08); eye.rotation.x = 0.35;
      gc(g, 0.02, 0.012, 0.06, metal, 0.02, 0.27, 0.03); gc(g, 0.02, 0.012, 0.06, metal, -0.02, 0.27, 0.0);
      gc(g, 0.04, 0.04, 0.03, M(0xfef08a, { emissive: 0xfde047, emissiveIntensity: 0.6 }), 0, 0.06, 0.02);
    }, -Math.PI / 2);
    EQG("turb", 3.5, 0.94, 0.85, (g) => { gb(g, 0.3, 0.16, 0.24, white, 0, 0.08, 0); gc(g, 0.03, 0.03, 0.12, glassMat, 0.08, 0.2, 0); gb(g, 0.12, 0.06, 0.01, scr(0x0e7490), -0.05, 0.1, 0.125); }, -Math.PI / 2);
    EQG("cond", 3.35, 0.94, 1.3, (g) => { gb(g, 0.16, 0.06, 0.24, M(0x1d4ed8), 0, 0.03, 0); gb(g, 0.1, 0.005, 0.08, scr(0xbae6fd), 0, 0.063, 0.04); gc(g, 0.012, 0.012, 0.28, dark, 0.12, 0.14, 0); });
    EQG("oxy", 3.75, 0.94, 1.3, (g) => { gb(g, 0.16, 0.06, 0.24, M(0x0369a1), 0, 0.03, 0); gb(g, 0.1, 0.005, 0.08, scr(0xa5f3fc), 0, 0.063, 0.04); gc(g, 0.02, 0.02, 0.22, M(0x0f172a), -0.12, 0.11, 0); });
    EQG("mstir", 3.5, 0.94, 1.8, (g) => { gb(g, 0.3, 0.07, 0.3, white, 0, 0.035, 0); gc(g, 0.1, 0.1, 0.005, M(0xcbd5e1), 0, 0.072, 0); gc(g, 0.09, 0.09, 0.16, glassMat, 0, 0.155, 0); gb(g, 0.06, 0.012, 0.012, M(0xf8fafc), 0, 0.085, 0); gc(g, 0.025, 0.025, 0.03, M(0x334155), 0.1, 0.035, 0.155); }, -Math.PI / 2);
    EQG("plate", 3.5, 0.94, 2.25, (g) => { gb(g, 0.32, 0.07, 0.32, M(0x52525b), 0, 0.035, 0); gc(g, 0.12, 0.12, 0.006, M(0x7f1d1d, { emissive: 0x7f1d1d, emissiveIntensity: 0.4 }), 0, 0.073, 0); });
    EQG("cent", 3.5, 0.94, 2.75, (g) => { gc(g, 0.17, 0.19, 0.22, M(0xe2e8f0), 0, 0.11, 0); gc(g, 0.16, 0.16, 0.03, M(0x64748b), 0, 0.235, 0); gb(g, 0.1, 0.05, 0.01, scr(0x16a34a), 0, 0.12, 0.185); }, -Math.PI / 2);
    EQG("burette", 3.85, 0.94, 3.05, (g) => { gb(g, 0.22, 0.02, 0.16, dark, 0, 0.01, 0); gc(g, 0.01, 0.01, 0.8, metal, -0.06, 0.4, 0); gb(g, 0.12, 0.02, 0.02, metal, 0, 0.62, 0); gc(g, 0.012, 0.012, 0.5, glassMat, 0.05, 0.55, 0); gc(g, 0.004, 0.004, 0.06, glassMat, 0.05, 0.27, 0); });
    EQG("phm", 0.95, 0.94, 0.1, (g) => { gb(g, 0.34, 0.22, 0.14, teal, 0, 0.11, 0); gb(g, 0.26, 0.12, 0.01, scr(0x052e2b), 0, 0.13, 0.075); gc(g, 0.01, 0.01, 0.3, dark, -0.2, 0.2, 0.02); });
    /* Чап стол: тупроқ ва ҳаво */
    EQG("sieve", -3.9, 0.94, 1.5, (g) => { [0, 1, 2, 3].forEach((i) => gc(g, 0.15, 0.15, 0.06, i % 2 ? metal : M(0xcbd5e1, { metalness: 0.5 }), 0, 0.03 + i * 0.065, 0)); });
    EQG("mortar", -3.9, 0.94, 1.9, (g) => { gc(g, 0.12, 0.08, 0.09, white, 0, 0.045, 0); const p = gc(g, 0.02, 0.03, 0.18, white, 0.03, 0.15, 0); p.rotation.z = 0.5; });
    EQG("shake", -3.9, 0.94, 2.3, (g) => { gb(g, 0.34, 0.08, 0.3, M(0x475569), 0, 0.04, 0); gb(g, 0.3, 0.01, 0.26, M(0x94a3b8), 0, 0.085, 0); gc(g, 0.04, 0.04, 0.14, glassMat, -0.07, 0.16, 0); gc(g, 0.04, 0.04, 0.14, glassMat, 0.07, 0.16, 0); }, Math.PI / 2);
    EQG("muffle", -3.9, 0.94, 2.8, (g) => { gb(g, 0.42, 0.4, 0.4, M(0x57534e), 0, 0.2, 0); gb(g, 0.2, 0.16, 0.01, M(0xf97316, { emissive: 0xea580c, emissiveIntensity: 0.6 }), 0, 0.22, 0.205); }, Math.PI / 2);
    EQG("pm", -3.95, 0.94, 3.25, (g) => { gb(g, 0.12, 0.2, 0.06, M(0x0f172a), 0, 0.1, 0); gb(g, 0.09, 0.07, 0.005, scr(0xfbbf24), 0, 0.14, 0.033); }, Math.PI / 2);
    EQG("gas", -3.8, 0.94, 3.55, (g) => { gb(g, 0.14, 0.1, 0.12, M(0x166534), 0, 0.05, 0); gb(g, 0.1, 0.05, 0.005, scr(0x86efac), 0, 0.06, 0.063); }, Math.PI / 2);
    EQG("oven", -3.95, 0, 4.4, (g) => { gb(g, 0.7, 0.75, 0.6, M(0xd6d3d1), 0, 0.375, 0); gb(g, 0.5, 0.5, 0.01, M(0x78716c), 0, 0.4, 0.305); gb(g, 0.12, 0.06, 0.01, scr(0xef4444), 0.2, 0.68, 0.305); }, Math.PI / 2);
    EQG("asp", -2.9, 0, 3.3, (g) => { gb(g, 0.3, 0.2, 0.2, M(0x2563eb), 0, 0.1, 0); gc(g, 0.012, 0.012, 1.0, dark, 0.1, 0.6, 0); gc(g, 0.05, 0.05, 0.08, M(0x334155), 0.1, 1.12, 0); });
    EQG("auger", -2.85, 0, 4.1, (g) => { const s = gc(g, 0.02, 0.02, 1.2, metal, 0, 0.62, 0); s.rotation.z = 0.12; gb(g, 0.4, 0.04, 0.04, dark, -0.07, 1.22, 0); });
    EQG("filt", -3.5, 0.94, 3.55, (g) => { gc(g, 0.05, 0.05, 0.08, M(0x94a3b8, { metalness: 0.5 }), 0, 0.04, 0); gc(g, 0.045, 0.045, 0.004, M(0xf5f5f4), 0, 0.083, 0); });
    EQG("desic", -3.45, 0.94, 1.5, (g) => { gc(g, 0.16, 0.14, 0.2, glassMat, 0, 0.1, 0); gc(g, 0.17, 0.17, 0.04, glassMat, 0, 0.22, 0); gc(g, 0.13, 0.13, 0.03, M(0x60a5fa), 0, 0.03, 0); });
    /* Сув намуна олиш (полда, ўнгда) */
    EQG("bat", 5.1, 0, 2.6, (g) => { gc(g, 0.07, 0.07, 0.5, M(0x60a5fa, { transparent: true, opacity: 0.7 }), 0, 0.3, 0); gc(g, 0.005, 0.005, 0.6, dark, 0, 0.8, 0); });
    EQG("secchi", 5.1, 0, 3.3, (g) => { const d = gc(g, 0.15, 0.15, 0.01, white, 0, 0.02, 0, 32); void d; gb(g, 0.15, 0.012, 0.15, dark, 0.075, 0.03, 0.075); gb(g, 0.15, 0.012, 0.15, dark, -0.075, 0.03, -0.075); gc(g, 0.004, 0.004, 0.5, M(0xfacc15), 0, 0.27, 0); });
    EQG("aer", 3.1, 0.94, 2.25, (g) => { gb(g, 0.16, 0.1, 0.1, M(0x0ea5e9), 0, 0.05, 0); gc(g, 0.005, 0.005, 0.25, M(0x93c5fd), 0.09, 0.12, 0); });
    EQG("bod", 3.1, 0.94, 2.75, (g) => { gb(g, 0.36, 0.5, 0.34, white, 0, 0.25, 0); gb(g, 0.28, 0.36, 0.01, glassMat, 0, 0.26, 0.175); gb(g, 0.1, 0.04, 0.01, scr(0x16a34a), 0.09, 0.47, 0.175); }, Math.PI / 2);
    EQG("aas", 2.25, 0.94, -0.45, (g) => { gb(g, 0.5, 0.28, 0.32, M(0xe2e8f0), 0, 0.14, 0); gc(g, 0.04, 0.04, 0.1, M(0x334155), 0.15, 0.33, 0); gb(g, 0.16, 0.08, 0.01, scr(0x7c3aed), -0.1, 0.18, 0.165); });
    EQG("kfk", -0.45, 0.94, -0.45, (g) => { gb(g, 0.3, 0.14, 0.24, M(0x64748b), 0, 0.07, 0); gb(g, 0.12, 0.05, 0.01, scr(0x22c55e), 0, 0.09, 0.125); });
    EQG("therm", -1.25, 0.94, 0.3, (g) => { gb(g, 0.06, 0.03, 0.12, M(0xf59e0b), 0, 0.015, 0); gc(g, 0.006, 0.006, 0.22, metal, 0, 0.03, -0.12).rotation.x = Math.PI / 2; });
    /* Деворда: тортиш шкафи ва дистиллятор (ўрнатилган, сурилмайди) */
    const hoodG = new T.Group(); hoodG.userData.eq = "hood"; sc.add(hoodG);
    gb(hoodG, 1.5, 1.4, 0.7, M(0xe2e8f0), -3.6, 1.6, -1.2);
    gb(hoodG, 1.4, 0.9, 0.02, new T.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.35, roughness: 0.05 }), -3.6, 1.55, -0.84);
    hoodG.add(sup(new T.Mesh(new T.BoxGeometry(1.5, 0.08, 0.72), dark))); hoodG.children[2].position.set(-3.6, 0.9, -1.2);
    gb(hoodG, 1.5, 0.86, 0.7, M(0xcbd5e1), -3.6, 0.43, -1.2);
    hoodG.traverse((o) => { o.userData.eq = "hood"; });
    const distG = new T.Group(); gb(distG, 0.3, 0.45, 0.18, white, -2.6, 2.4, -1.5); distG.traverse((o) => { o.userData.eq = "dist"; }); sc.add(distG);
    eqObjs.push(hoodG, distG);
    const wallLbl = [["👁️💧", 6.2, 1.75, 3.0], ["⛑️", 3.3, 1.95, -1.5], ["🥼", -4.35, 1.7, -0.6], ["🥽", -4.35, 1.35, -0.3], ["🧤", -4.35, 1.05, 0], ["🌬️", -3.6, 2.45, -1.0], ["💧", -2.6, 2.8, -1.45]];
    wallLbl.forEach(([e, x, y, z]) => { const s = lib.textSprite(e, "#fff", 0.26); s.position.set(x, y, z); sc.add(s); });
    /* Реакция колбаси ва «реакция столи» шишалари (vendor/eko-labxona-elem.js бошқаради) */
    const rxG = new T.Group(); rxG.position.set(-0.45, 0.94, 0.22); rxG.userData = { drag: "rx", rx: true }; sc.add(rxG); drags.push(rxG);
    const rxPts = []; for (let i = 0; i <= 20; i++) { const y = 0.44 * i / 20; rxPts.push(new T.Vector2(y < 0.28 ? 0.17 - y * 0.42 : 0.052, y)); }
    const rxGlass = new T.Mesh(new T.LatheGeometry(rxPts, 32), glassM); rxG.add(rxGlass);
    const rxLiqM = new T.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.55, roughness: 0.2 });
    const rxLiq = new T.Mesh(new T.CylinderGeometry(0.12, 0.16, 0.12, 32), rxLiqM); rxLiq.position.y = 0.065; rxLiq.visible = false; rxG.add(rxLiq);
    const rxPptM = M(0xffffff);
    const rxPpt = new T.Mesh(new T.CylinderGeometry(0.15, 0.16, 0.025, 24), rxPptM); rxPpt.position.y = 0.016; rxPpt.visible = false; rxG.add(rxPpt);
    const rxBubM = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const rxBub = Array.from({ length: 30 }, () => { const b = new T.Mesh(new T.SphereGeometry(0.01 + Math.random() * 0.008, 6, 5), rxBubM); b.visible = false; b.userData = { y: Math.random(), a: Math.random() * 6.28, r: Math.random() }; rxG.add(b); return b; });
    const rxGasM = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false });
    const rxGas = Array.from({ length: 12 }, (_, i) => { const b = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), rxGasM); b.visible = false; b.userData = { t: i / 12 }; rxG.add(b); return b; });
    const rxFlame = new T.Mesh(new T.ConeGeometry(0.06, 0.24, 16), new T.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.85 })); rxFlame.position.y = 0.58; rxFlame.visible = false; rxG.add(rxFlame);
    const rxBurner = new T.Mesh(new T.CylinderGeometry(0.08, 0.1, 0.07, 16), M(0x475569, { metalness: 0.5 })); rxBurner.position.set(0, -0.01, 0); rxBurner.visible = false; rxG.add(rxBurner);
    let rxA = null, rxLbl = null;
    const benchG = [];
    const benchHome = (i) => new T.Vector3(-1.45 + i * 0.27, 0.94, 0.33);
    const disposeObj = (o) => o.traverse((x) => { if (x.geometry) x.geometry.dispose(); if (x.material) { if (x.material.map) x.material.map.dispose(); if (x.material !== glassM) x.material.dispose(); } });
    const rxApi = {
      /* list: [{id, f, col, st}] — стол устидаги шишалар */
      bench(list) {
        benchG.splice(0).forEach((g) => { sc.remove(g); disposeObj(g); const k = drags.indexOf(g); if (k >= 0) drags.splice(k, 1); });
        list.forEach((it, i) => {
          const g = new T.Group(); const p = benchHome(i); g.position.copy(p);
          const solid = it.st === "s", gas = it.st === "g";
          const gl = new T.Mesh(new T.CylinderGeometry(0.075, 0.085, 0.22, 16), new T.MeshStandardMaterial({ color: gas ? 0xf1f5f9 : 0xdbeafe, transparent: true, opacity: 0.4, roughness: 0.1 })); gl.position.y = 0.11; g.add(gl);
          const fill = new T.Mesh(new T.CylinderGeometry(0.068, 0.078, solid ? 0.08 : 0.15, 16), M(hex(/^#[0-9a-f]{6}$/i.test(it.col) ? it.col : "#e5e7eb"), { transparent: gas, opacity: gas ? 0.35 : 1, roughness: 0.4 })); fill.position.y = solid ? 0.045 : 0.08; g.add(fill);
          const cap = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 0.05, 12), M(0x7c3aed)); cap.position.y = 0.245; g.add(cap);
          const lb = lib.textSprite(it.f, "#0f172a", 0.1); lb.position.set(0, 0.36, 0); g.add(lb);
          g.userData = { drag: "x:" + it.id, bench: it.id };
          g.traverse((o) => { o.userData.bench = it.id; });
          sc.add(g); benchG.push(g); drags.push(g);
        });
      },
      /* vis: {col, ppt, pptCol, gas, gasCol, flame, heat, smoke, metal} */
      react(vis) {
        rxA = Object.assign({ t: 0 }, vis || {});
        rxLiq.visible = !rxA.dry; rxPpt.visible = false;
        rxLiqM.color.set(rxA.col0 || "#e0f2fe");
        if (rxLbl) { rxG.remove(rxLbl); rxLbl.material.map.dispose(); rxLbl.material.dispose(); rxLbl = null; }
        if (rxA.label) { rxLbl = lib.textSprite(rxA.label, "#7c2d12", 0.09); rxLbl.position.set(0, 0.72, 0); rxG.add(rxLbl); }
        rxGasM.color.set(rxA.gasCol || "#ffffff");
        rxPptM.color.set(rxA.pptCol || "#ffffff");
      },
      clear() { rxA = null; rxLiq.visible = rxPpt.visible = rxFlame.visible = rxBurner.visible = false; rxBub.forEach((b) => { b.visible = false; }); rxGas.forEach((b) => { b.visible = false; }); if (rxLbl) { rxG.remove(rxLbl); rxLbl.material.map.dispose(); rxLbl.material.dispose(); rxLbl = null; } },
      get flaskPos() { return rxG.position; }
    };
    v.updaters.push((dt) => {
      if (!rxA) return;
      rxA.t += dt;
      const t = rxA.t, k = clamp(t / 1.6, 0, 1);
      if (!rxA.dry) {
        const c0 = new T.Color(rxA.col0 || "#e0f2fe"), c1 = new T.Color(rxA.col || rxA.col0 || "#e0f2fe");
        rxLiqM.color.copy(c0.lerp(c1, k)); rxLiqM.opacity = rxA.op != null ? rxA.op : 0.55;
      }
      rxBurner.visible = !!rxA.heat;
      rxFlame.visible = !!rxA.flame && t < 6;
      if (rxFlame.visible) { rxFlame.scale.set(1, 0.8 + Math.sin(t * 22) * 0.2, 1); rxFlame.material.color.set(rxA.flameCol || "#f97316"); }
      if (rxA.ppt) { rxPpt.visible = t > 0.4; const h = clamp((t - 0.4) / 2.5, 0.05, 1) * 0.035; rxPpt.scale.y = h / 0.025; rxPpt.position.y = h / 2 + 0.004; }
      const bub = rxA.gas ? clamp(1 - (t - 3) / 4, 0, 1) : 0;
      rxBub.forEach((b, i) => { const u = b.userData; b.visible = !rxA.dry && i < bub * rxBub.length; if (!b.visible) return; u.y += dt * (0.6 + u.r * 0.6); if (u.y > 1) { u.y = 0; u.a = Math.random() * 6.28; } b.position.set(Math.cos(u.a) * 0.11 * u.r, 0.01 + u.y * 0.12, Math.sin(u.a) * 0.11 * u.r); });
      const gasVis = (rxA.gasCol || rxA.smoke) && t < 9;
      rxGas.forEach((s) => { s.visible = !!gasVis; if (!s.visible) return; const u = s.userData; u.t += dt * 0.35; if (u.t > 1) u.t = 0; s.position.set(Math.sin(u.t * 8 + s.id) * 0.05, 0.42 + u.t * 0.7, Math.cos(u.t * 6) * 0.05); s.scale.setScalar(0.6 + u.t * 1.6); s.material.opacity = (rxA.smoke ? 0.5 : 0.4) * (1 - u.t); });
      if (rxA.smoke) rxGasM.color.set(rxA.smokeCol || "#f8fafc");
    });
    /* Қуйиш анимацияси */
    let pour = null;
    const pourM = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    const stream = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 1, 8), pourM); stream.visible = false; sc.add(stream);
    /* Номлар (тег): танланган шиша ёки асбоб устида */
    let tagSpr = null, tagId = "";
    const dropTag = () => { if (tagSpr) { if (tagSpr.parent) tagSpr.parent.remove(tagSpr); tagSpr.material.map.dispose(); tagSpr.material.dispose(); tagSpr = null; } };
    const showTag = (id) => {
      if (id === tagId) return; tagId = id; dropTag();
      const g = bottles.find((b) => b.userData.rid === id); if (!g) return;
      tagSpr = lib.textSprite(RID[id].f, "#0f172a", 0.14 / g.scale.x); tagSpr.position.set(0, 0.5 / g.scale.x, 0.1); g.add(tagSpr);
    };
    const showEqTag = (g) => {
      const id = g.userData.eq; tagId = "e:" + id; dropTag();
      const e = EQID[id]; if (!e) return;
      const bb = new T.Box3().setFromObject(g);
      tagSpr = lib.textSprite(L(e.n).replace(/\s*\(.*\)$/, ""), "#0f172a", 0.12); tagSpr.position.set(0, bb.max.y - g.position.y + 0.18, 0); g.add(tagSpr);
    };
    vesG.userData.drag = "ves"; drags.push(vesG);
    /* Жойлашув: localStorage да сақланади (ҳар ким ўз хонасини безайди) */
    const POSK = "ekotalim:lx-pos";
    const posSave = () => { const o = {}; drags.forEach((g) => { const k = g.userData.drag; if (k && !g.userData.bench && g.userData.home && g.position.distanceTo(g.userData.home) > 0.01) o[k] = [g.position.x, g.position.y, g.position.z].map((n) => Math.round(n * 1000) / 1000); }); putJ(POSK, o); };
    drags.forEach((g) => { g.userData.home = g.position.clone(); });
    const saved = getJ(POSK, {});
    drags.forEach((g) => { const p = saved[g.userData.drag]; if (p && p.length === 3 && p.every(isFinite)) g.position.set(p[0], p[1], p[2]); });
    R3 = {
      showTag,
      startPour(id) {
        const g = bottles.find((b) => b.userData.rid === id); if (!g) return;
        pour = { g, t: 0, home: g.position.clone(), rot: g.rotation.z };
        pourM.color.set(RID[id].col); stream.visible = false;
      },
      vesselChanged: rebuildVessel,
      rx: rxApi,
      resetLayout() { drags.forEach((g) => { if (g.userData.home) g.position.copy(g.userData.home); }); putJ(POSK, {}); },
      count: () => ({ bottles: bottles.length, equipment: eqObjs.length, movable: drags.length })
    };
    /* ---------- Бошқарув: айлантириш, суриш (pan), яқинлаштириш (pinch) ва буюмларни ушлаб суриш ----------
       Сичқонча: чап тугма — айлантириш ёки буюмни суриш, ўнг тугма / Shift — хонада юриш, ғилдирак — яқинлаштириш.
       Сенсор: бир бармоқ — айлантириш ёки буюмни суриш, икки бармоқ — яқинлаштириш ва суриш. */
    const host = v.host, cvs = v.canvas, ray = new T.Raycaster(), ndc = new T.Vector2();
    const P = new Map();
    let mode = null, dragG = null, dragOff = new T.Vector3(), moved = 0, last = null, pinch0 = null, downAt = null;
    const setNdc = (e) => { const r = cvs.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, v.camera); };
    const rootOf = (o) => { while (o && !(o.userData && o.userData.drag)) o = o.parent; return o; };
    const pickDrag = (e) => { setNdc(e); const hits = ray.intersectObjects(drags, true).filter((h) => h.object.visible && !h.object.isSprite); return hits.length ? rootOf(hits[0].object) : null; };
    const surfAt = (e, g) => {
      setNdc(e);
      const hits = ray.intersectObjects(supports, false).filter((h) => h.face && h.face.normal.y > 0.5);
      if (hits.length) return hits[0].point;
      const pl = new T.Plane(new T.Vector3(0, 1, 0), -g.position.y), pt = new T.Vector3();
      return ray.ray.intersectPlane(pl, pt) ? pt : null;
    };
    const clampRoom = (p) => { p.x = clamp(p.x, -4.3, 6.1); p.z = clamp(p.z, -1.45, 6.4); return p; };
    const pan = (dx, dy) => {
      const k = v.d * 0.0016, th = v.th;
      const rx = Math.cos(th), rz = -Math.sin(th), fx = -Math.sin(th), fz = -Math.cos(th);
      v.target.x = clamp(v.target.x - dx * k * rx + dy * k * fx, -4, 6);
      v.target.z = clamp(v.target.z - dx * k * rz + dy * k * fz, -1.4, 6);
      v.fly = null; v.place();
    };
    const stop = (e) => { e.stopPropagation(); };
    host.addEventListener("pointerdown", (e) => {
      if (e.target !== cvs) return;
      stop(e); e.preventDefault();
      try { cvs.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
      P.set(e.pointerId, { x: e.clientX, y: e.clientY });
      v.fly = null; v.auto = false; v.moved = 0;
      if (P.size === 2) {
        if (dragG) { dragG.position.y -= 0.06; dragG = null; }
        const [a, b] = [...P.values()]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), vd: v.d, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }; mode = "pinch"; return;
      }
      moved = 0; last = { x: e.clientX, y: e.clientY }; downAt = e;
      const g = e.button === 0 && !e.shiftKey ? pickDrag(e) : null;
      if (g) {
        mode = "drag"; dragG = g;
        const p = surfAt(e, g); dragOff.set(p ? g.position.x - p.x : 0, 0, p ? g.position.z - p.z : 0);
      } else mode = e.button === 2 || e.shiftKey ? "pan" : "orbit";
    }, true);
    host.addEventListener("pointermove", (e) => {
      if (!P.has(e.pointerId)) return;
      stop(e);
      P.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (mode === "pinch" && P.size >= 2) {
        const [a, b] = [...P.values()], d = Math.hypot(a.x - b.x, a.y - b.y), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        v.d = clamp(pinch0.vd * pinch0.d / Math.max(20, d), v.minD, v.maxD);
        pan(cx - pinch0.cx, cy - pinch0.cy); pinch0.cx = cx; pinch0.cy = cy;
        return;
      }
      const dx = e.clientX - last.x, dy = e.clientY - last.y; last = { x: e.clientX, y: e.clientY };
      moved += Math.abs(dx) + Math.abs(dy);
      if (mode === "drag" && dragG) {
        if (moved < 6) return;
        if (!dragG.userData.lift) { dragG.userData.lift = true; if (dragG.userData.eq) showEqTag(dragG); }
        const p = surfAt(e, dragG); if (!p) return;
        const q = clampRoom(new T.Vector3(p.x + dragOff.x, p.y, p.z + dragOff.z));
        dragG.position.set(q.x, p.y + 0.06, q.z);
        return;
      }
      if (mode === "orbit") { v.th -= dx * 0.008; v.ph = clamp(v.ph - dy * 0.006, 0.2, 1.5); v.place(); }
      if (mode === "pan") pan(dx, dy);
    }, true);
    const up = (e) => {
      if (!P.has(e.pointerId)) return;
      stop(e);
      P.delete(e.pointerId);
      if (mode === "pinch") { if (P.size === 0) mode = null; else { const [a] = [...P.values()]; last = { x: a.x, y: a.y }; mode = "orbit"; moved = 99; } return; }
      const g = dragG; dragG = null;
      if (g && g.userData.lift) {
        g.userData.lift = false; g.position.y -= 0.06;
        const near = (o, r) => o && Math.hypot(g.position.x - o.x, g.position.z - o.z) < r;
        if (g.userData.rid && near(vesG.position, 0.5) && !g.userData.locked) { const id = g.userData.rid; g.position.copy(g.userData.home); selectR(id); add(id, curAmt(RID[id])); }
        else if (g.userData.bench && near(rxG.position, 0.4)) { g.position.copy(benchHome(benchG.indexOf(g))); window.dispatchEvent(new CustomEvent("eko:lx-mix")); }
        if (g.userData.rid && near(rxG.position, 0.4)) toast(L(t3("Бу жавон шишаси асосий идиш учун. Реакция колбасига «Менделеев жадвали ва реакциялар» бўлимидан модда қўшинг.", "Эта склянка для основного сосуда. В колбу для реакций добавляйте вещества из раздела «Таблица Менделеева и реакции».", "This shelf bottle is for the main vessel. Add substances to the reaction flask from the 'Periodic table & reactions' section.")));
        if (g === vesG) { /* идиш билан иситгич бирга юради */ }
        posSave();
        mode = null; return;
      }
      mode = null;
      if (moved < 6 && downAt && e.type === "pointerup") {
        /* Босиш: шиша — идишга қуйиш; асбоб — номи ва амали; колба — аралаштириш */
        if (g && g.userData.rid) { if (v.onTap) v.onTap(downAt); return; }
        if (g && g.userData.bench) { window.dispatchEvent(new CustomEvent("eko:lx-pick", { detail: { id: g.userData.bench } })); return; }
        if (g && g.userData.rx) { window.dispatchEvent(new CustomEvent("eko:lx-mix")); return; }
        if (g && g.userData.eq) { showEqTag(g); pickEq(g.userData.eq); return; }
        if (g === vesG) { pickEq(null); return; }
        setNdc(downAt);
        const hit = ray.intersectObjects(eqObjs, true)[0];
        if (hit) { let o = hit.object; while (o && !o.userData.eq) o = o.parent; if (o) { pickEq(o.userData.eq); return; } }
        pickEq(null);
      }
    };
    host.addEventListener("pointerup", up, true);
    host.addEventListener("pointercancel", up, true);
    cvs.addEventListener("contextmenu", (e) => e.preventDefault());
    /* Шишани босиш — идишга қуйиш */
    v.onTap = (e) => {
      const hit = v.pick(e, bottles); if (!hit) return;
      let o = hit.object; while (o && !o.userData.rid) o = o.parent;
      if (o && o.userData.rid) { selectR(o.userData.rid); add(o.userData.rid, curAmt(RID[o.userData.rid])); }
    };
    let acc = 0, lastPaint = 0;
    v.updaters.push((dt, t) => {
      const changed = tick(dt);
      acc += dt;
      if (changed && acc - lastPaint > 0.25) { lastPaint = acc; checkAll(); paint(true); }
      /* Суюқлик сатҳи ва ранги */
      const lv = S.V / VES[S.ves].max;
      if (Math.abs(lv - lastLv) > 0.002) { lastLv = lv; fillTo(lv); }
      const col = EQ ? K.color(S, EQ) : { rgb: [0.86, 0.94, 1], op: 0.4, tur: 0, pcol: [1, 1, 1], pptAmt: 0 };
      liqM.color.setRGB(col.rgb[0], col.rgb[1], col.rgb[2]); liqM.opacity = col.op;
      const h = liqMesh.geometry.parameters.height || 0;
      /* Чўкма қатлами */
      const pAmt = col.pptAmt || 0;
      pptMesh.visible = pAmt > 0.001 && S.V > 0;
      if (pptMesh.visible) { const ph = clamp(Math.sqrt(pAmt) * 0.05, 0.01, h * 0.5); pptMesh.geometry.dispose(); pptMesh.geometry = new T.CylinderGeometry(prof.r(ph) * 0.93, prof.r(0) * 0.93, ph, 24); pptMesh.position.y = ph / 2 + 0.006; pptM.color.setRGB(col.pcol[0], col.pcol[1], col.pcol[2]); }
      /* Кўпик (O₂ + совун ёки кучли CO₂) */
      const fz = clamp((S.foamO2 || 0) * ((S.tot.Soap || 0) > 0 ? 0.5 : 0.15) + (S.foamS || 0) * 0.35 + S.rateCO2 * 0.15, 0, 1);
      foam.visible = fz > 0.03 && S.V > 0;
      if (foam.visible) { const r = prof.r(Math.min(h, prof.h)) * 0.95; foam.scale.set(r, clamp(fz * 0.28, 0.015, 0.3), r); foam.position.y = h; }
      /* Пуфакчалар */
      const bub = clamp(S.rateCO2 * 6 + S.rateO2 * 10 + (S.heat && S.T >= 99.5 ? 0.8 : 0) + (S.aerT > 0 ? 0.7 : 0), 0, 1);
      bubbles.forEach((b, i) => {
        const u = b.userData;
        b.visible = S.V > 0 && i < bub * bubbles.length;
        if (!b.visible) return;
        u.y += dt * (0.5 + u.r * 0.5); if (u.y > 1) { u.y = 0; u.a = Math.random() * 6.28; u.r = Math.random(); }
        const y = u.y * h, rr = prof.r(y) * 0.8 * u.r;
        b.position.set(Math.cos(u.a) * rr, y, Math.sin(u.a) * rr);
      });
      steam.forEach((s) => { s.visible = S.T > 70 && S.V > 0; if (!s.visible) return; const u = s.userData; u.t += dt * 0.4; if (u.t > 1) u.t = 0; s.position.set(Math.sin(u.t * 9 + s.id) * 0.06, prof.h + u.t * 0.6, Math.cos(u.t * 7) * 0.05); s.scale.setScalar(0.5 + u.t); s.material.opacity = 0.35 * (1 - u.t); });
      /* Иситгич */
      burner.visible = flame.visible = S.heat;
      if (S.heat) { flame.scale.set(1, 0.85 + Math.sin(t * 20) * 0.15, 1); }
      /* Термометр устуни */
      const mh = 0.08 + clamp(S.T / 100, 0, 1) * 0.5;
      merc.scale.y = mh; merc.position.set(0.12 + Math.sin(0.25) * (0.35 - mh / 2) * 0, 0.1 + mh / 2, 0.05); merc.rotation.z = -0.25;
      merc.position.x = 0.12 - Math.sin(-0.25) * (mh / 2 - 0.35 + 0.07) * 0;
      tempText(); meterText();
      /* Қуйиш */
      if (pour) {
        pour.t += dt / 0.9;
        const g = pour.g, k = Math.min(1, pour.t * 2.2), back = Math.max(0, (pour.t - 0.65) / 0.35);
        const tgt = new T.Vector3(vesG.position.x - 0.25, vesG.position.y + prof.h + 0.35, vesG.position.z);
        g.position.lerpVectors(pour.home, tgt, Math.min(1, k) * (1 - back));
        g.rotation.z = -1.9 * Math.min(1, k) * (1 - back);
        stream.visible = pour.t > 0.35 && pour.t < 0.75;
        if (stream.visible) { const top = g.position.clone(); top.x += 0.12; top.y += 0.02; const bot = new T.Vector3(vesG.position.x - 0.05, vesG.position.y + Math.max(h, 0.02), vesG.position.z); const mid = top.clone().add(bot).multiplyScalar(0.5); stream.position.copy(mid); stream.scale.y = top.distanceTo(bot); stream.lookAt(bot); stream.rotateX(Math.PI / 2); }
        if (pour.t >= 1) { g.position.copy(pour.home); g.rotation.z = 0; stream.visible = false; pour = null; }
      }
    });
  }
  function pourAnim(id) { if (R3 && !reduce) R3.startPour(id); }

  /* ---------- Хавфсизлик ва чиқинди ---------- */
  function warnPpe() {
    toast(L(TX.ppeNeed));
    const b = ROOT.querySelector("[data-ppe]"); if (b) { b.classList.remove("lx-shake"); void b.offsetWidth; b.classList.add("lx-shake"); b.scrollIntoView && b.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }); }
  }
  function needsBin() {
    const t = S.tot, p = EQ ? EQ.ppt : {}, x = S.extra;
    return S.soilG > 0 || ((t.CrO4 || 0) + (x.cr6 || 0) + (x.cr3 || 0) + (x.ness || 0) + (t.Mn2 || 0) + (x.mnooh || 0) + (p.ag2cro4 || 0)) > 1e-6 || ((t.Cu || 0) + (t.Ag || 0) + (t.Ba || 0) + (t.Mn || 0) + (t.Fe || 0) + (t.SCN || 0) + S.cuo + (p.agcl || 0) + (p.baso4 || 0)) > 1e-5;
  }
  function askWaste() {
    if (S.V <= 0 && !hasSolids()) { resetVessel(); return; }
    const box = ROOT.querySelector("[data-waste]"); if (!box) return;
    box.hidden = false;
    box.innerHTML = `<p><b>${H(TX.waste)}</b></p><div class="lx-wbtn"><button type="button" class="btn btn-ghost btn-sm" data-w="sink"><i class="fa-solid fa-sink" aria-hidden="true"></i> ${H(TX.sink)}</button><button type="button" class="btn btn-ghost btn-sm" data-w="bin"><i class="fa-solid fa-biohazard" aria-hidden="true"></i> ${H(TX.bin)}</button><button type="button" class="btn btn-ghost btn-sm" data-w="no">${H(TX.cancel)}</button></div><p class="small" data-wmsg></p>`;
    box.querySelectorAll("[data-w]").forEach((b) => b.addEventListener("click", () => {
      const w = b.dataset.w, msg = box.querySelector("[data-wmsg]");
      if (w === "no") { box.hidden = true; return; }
      const heavy = needsBin(), ph = EQ ? EQ.pH : 7;
      let ok = false, m;
      if (w === "sink") { if (heavy) m = TX.wBadSink; else if (ph < 5 || ph > 9) m = TX.wNeut; else { ok = true; m = TX.wOkSink; } }
      else { ok = true; m = heavy ? TX.wOkBin : TX.wOver; }
      msg.textContent = L(m);
      msg.className = "small " + (ok ? "lx-ok" : "lx-bad");
      if (ok) { if (heavy || w === "sink") once("lx_waste_" + (heavy ? "bin" : "sink"), 2, WHY); logStep(w === "sink" ? "🚰" : "☣️"); setTimeout(() => { box.hidden = true; resetVessel(); }, 1600); }
    }));
  }
  function resetVessel(v) {
    S = newState(v || S.ves); addedV = 0; recompute();
    if (R3) R3.vesselChanged();
    note(L(t3("Тоза идиш тайёр.", "Чистый сосуд готов.", "A clean vessel is ready.")));
    paint(); renderLog();
  }

  /* ---------- UI ---------- */
  const curAmt = (r) => (r && r.k === "s" ? AMT_S[amtS] : AMT_L[amtIx]);
  function selectR(id) { sel = id; if (R3) R3.showTag(id); const p = ROOT.querySelector("[data-info]"); if (p) p.innerHTML = infoHtml(); ROOT.querySelectorAll("[data-r]").forEach((b) => b.classList.toggle("sel", b.dataset.r === id)); }
  function infoHtml() {
    const r = RID[sel]; if (!r) return `<p class="small muted">${H(t3("Жавондан модда танланг — бу ерда унинг хоссалари ва хавфсизлик белгилари кўринади.", "Выберите вещество на полке — здесь появятся его свойства и знаки опасности.", "Pick a substance on the shelf to see its properties and hazard symbols."))}</p>`;
    const hz = (r.haz || []).map((h) => `<span class="lx-ghs" title="${H(HAZ[h][1])}"><i class="fa-solid ${HAZ[h][0]}" aria-hidden="true"></i></span> <small>${H(HAZ[h][1])}</small>`).join("<br>");
    const aid = (r.haz || []).map((h) => `<li>${H(AID[h])}</li>`).join("");
    const ppeTxt = r.haz && r.haz.length ? `🥼🥽🧤${r.hood ? " · 🌬️ " + H(TX.hoodNeed) : ""}` : "";
    return `<p><b>${H(r.n)}</b> <code>${esc(r.f)}</code></p><p class="small">${H(r.d)}</p>${hz ? `<p class="small">${hz}</p><details class="lx-aid"><summary class="small"><b>${H(TX.aid)}</b> ${ppeTxt}</summary><ul class="small">${aid}</ul></details>` : `<p class="small lx-ok">✅ ${H(t3("Хавфсиз модда", "Безопасное вещество", "Safe substance"))}</p>`}${r.st === "u" && !uni() ? `<p class="small lx-bad">${H(TX.lock)}</p>` : ""}`;
  }
  function note(m, html) {
    S.obs.unshift(html ? m : esc(m)); S.obs = S.obs.slice(0, 5);
    const b = ROOT.querySelector("[data-notes]"); if (b) b.innerHTML = S.obs.map((x) => `<li>${x}</li>`).join("");
  }
  function paint(soft) {
    const e = EQ || recompute();
    const q = (s) => ROOT.querySelector(s);
    const has = S.V > 0;
    const setT = (s, v) => { const el = q(s); if (el && el.textContent !== v) el.textContent = v; };
    setT("[data-ph]", has ? fmt(e.pH, uni() ? 2 : 1) : "—");
    setT("[data-t]", fmt(S.T, 1) + " °C");
    setT("[data-ec]", has ? (() => { const ec = K.conductivity(e); return ec >= 10000 ? fmt(ec / 1000, 1) + " mS" : fmt(ec, 0) + " µS"; })() : "—");
    setT("[data-do]", has ? fmt(doMg(), 1) + (lang() === "en" ? " mg/L" : " мг/л") : "—");
    setT("[data-v]", fmt(S.V, S.V < 10 && S.V > 0 ? 1 : 0) + "/" + VES[S.ves].max + (lang() === "en" ? " mL" : " мл"));
    const sw = q("[data-sw]");
    if (sw) { const c = K.color(S, e); sw.style.background = has ? `rgb(${c.rgb.map((v) => Math.round(v * 255)).join(",")})` : "transparent"; }
    const phb = q("[data-phbar] i"); if (phb) phb.style.left = (has ? clamp(e.pH / 14 * 100, 0, 100) : 50) + "%";
    const ob = q("[data-obs]"); if (ob) { const h = observe().map((x) => `<li>${esc(x)}</li>`).join(""); if (ob.dataset.h !== h) { ob.innerHTML = h; ob.dataset.h = h; } }
    const hb = q('[data-tool="heat"]'); if (hb) { hb.classList.toggle("on", S.heat); hb.setAttribute("aria-pressed", String(S.heat)); }
    if (uni()) {
      const sp = q("[data-spec]");
      if (sp) {
        const c = e.c, rows = [["H⁺", Math.pow(10, -e.pH)], ["Na⁺", c.Na], ["Ca²⁺", c.Ca], ["Cu²⁺", c.Cu], ["Fe³⁺", c.Fe], ["Ag⁺", c.Ag], ["Ba²⁺", c.Ba], ["Cl⁻", c.Cl], ["SO₄²⁻", c.SO4], ["NO₃⁻", c.NO3], ["HCO₃⁻/CO₃²⁻", (c.C || 0) * (1 - K.alphas(K.pK.c, Math.pow(10, -e.pH))[0])], ["CO₂(aq)", e.co2aq], ["CH₃COO⁻", (c.Ac || 0) * K.alphas(K.pK.ac, Math.pow(10, -e.pH))[1]], ["Mg²⁺", c.Mg], ["K⁺", c.K], ["NH₄⁺", (c.NH || 0) * (1 - K.alphas(K.pK.nh, e.h)[1])], ["NH₃", (c.NH || 0) * K.alphas(K.pK.nh, e.h)[1]], ["PO₄ (Σ)", c.P], ["NO₂⁻", c.NO2], ["Al³⁺", c.Al], ["Mn²⁺", c.Mn2], ["I⁻", c.I], ["CrO₄²⁻", c.CrO4], ["S₂O₃²⁻", c.S2O3], ["SO₃ (Σ)", c.SO3], ["CaY²⁻", c.CaY], ["MgY²⁻", c.MgY], ["Y (ЭДТА)", c.Y], ["O₂", (S.extra.DO || 0) / Math.max(S.V, 1e-3)]].filter(([, v]) => v > 1e-7);
        const h = has ? `<table class="l3-tbl lx-spec">${rows.map(([n, v]) => `<tr><td>${n}</td><td>${v.toExponential(2).replace("e", "·10^")} M</td></tr>`).join("")}${Object.entries(e.ppt).filter(([, v]) => v > 1e-5).map(([k, v]) => `<tr><td>↓ ${({ agcl: "AgCl", baso4: "BaSO₄", caco3: "CaCO₃", cuoh: "Cu(OH)₂", feoh: "Fe(OH)₃", casoap: "Ca(St)₂", ag2cro4: "Ag₂CrO₄", mgoh: "Mg(OH)₂", mnoh: "Mn(OH)₂", aloh: "Al(OH)₃" })[k]}</td><td>${fmt(v, 3)} ${lang() === "en" ? "mmol" : "ммоль"}</td></tr>`).join("")}${S.gasCO2 > 1e-3 ? `<tr><td>↑ CO₂</td><td>${fmt(S.gasCO2, 2)} ${lang() === "en" ? "mmol" : "ммоль"}</td></tr>` : ""}${S.gasO2 > 1e-3 ? `<tr><td>↑ O₂</td><td>${fmt(S.gasO2, 2)} ${lang() === "en" ? "mmol" : "ммоль"}</td></tr>` : ""}</table>` : "";
        if (sp.dataset.h !== h) { sp.innerHTML = h; sp.dataset.h = h; }
      }
    }
    if (!soft) { renderMis(); }
  }
  function shelfHtml() {
    const isU = uni(), list = R.filter((r) => r.g === grp);
    return `<div class="lx-tabs" role="tablist">${RG.map(([g, ic, n]) => `<button type="button" role="tab" class="chip ${g === grp ? "active" : ""}" aria-selected="${g === grp}" data-g="${g}"><i class="fa-solid ${ic}" aria-hidden="true"></i> ${H(n)}</button>`).join("")}</div>
      <div class="lx-shelf">${list.map((r) => { const lk = r.st === "u" && !isU; return `<button type="button" class="lx-btl ${lk ? "lk" : ""} ${sel === r.id ? "sel" : ""}" data-r="${r.id}" aria-label="${H(r.n)}${lk ? " 🔒" : ""}"><span class="lx-dot ${r.k === "s" ? "s" : ""}" style="--bc:${r.col}" aria-hidden="true">${lk ? "🔒" : ""}</span><b>${H(r.n)}</b><small>${esc(r.f)}</small>${(r.haz || []).length ? `<span class="lx-hz" aria-hidden="true">${r.haz.map((h) => `<i class="fa-solid ${HAZ[h][0]}"></i>`).join("")}</span>` : ""}</button>`; }).join("")}</div>`;
  }
  function amtHtml() {
    const r = RID[sel], sol = r && r.k === "s";
    const list = (sol ? AMT_S : AMT_L).map((a, i) => [i, amtTxt(sol, a)]);
    const curI = sol ? amtS : amtIx;
    return list.map(([i, n]) => `<button type="button" class="chip ${i === curI ? "active" : ""}" data-amt="${i}" data-sol="${sol ? 1 : 0}">${esc(n)}</button>`).join("");
  }
  function amtTxt(sol, a) {
    if (sol) return (a < 1 ? L(TX.pinch) + " " : "") + fmt(a, a < 1 ? 1 : 0) + (lang() === "en" || lang() === "lat" ? " g" : " г");
    return a < 0.1 ? L(TX.drop) : fmt(a, a < 1 ? 1 : 0) + (lang() === "en" ? " mL" : " мл");
  }
  function renderDisc() {
    const b = ROOT.querySelector("[data-disc]"); if (!b) return;
    const sv = discSaved(), list = DISC.filter((d) => d[2] === "m" || uni());
    b.innerHTML = `<p class="small muted">${sv.size ? list.filter((d) => sv.has(d[0])).length : 0} / ${list.length}</p><div class="lx-disc">${list.map(([id, ic, , n, eq]) => { const ok = sv.has(id); return `<div class="lx-dc ${ok ? "ok" : ""}"><span aria-hidden="true">${ok ? ic : "❔"}</span><b>${ok ? H(n) : "???"}</b>${ok && uni() ? `<code>${esc(eq)}</code>` : ok ? `<small>${esc(eq)}</small>` : ""}</div>`; }).join("")}</div>`;
  }
  function renderMis() {
    const b = ROOT.querySelector("[data-mis]"); if (!b) return;
    const f = flags(), list = MIS.filter((m) => m[1] === "m" || uni());
    const h = `<ul class="lx-mis">${list.map(([id, , n]) => { const ok = !!f["lx_m_" + id]; return `<li class="${ok ? "ok" : ""}"><i class="fa-${ok ? "solid fa-circle-check" : "regular fa-circle"}" aria-hidden="true"></i> ${H(n)}</li>`; }).join("")}</ul>`;
    if (b.dataset.h !== h) { b.innerHTML = h; b.dataset.h = h; }
  }
  function curveSvg(rows) {
    const pts = rows.filter((r) => r.x > 0);
    if (pts.length < 3) return "";
    const W = 320, Hh = 170, pad = 28, mx = Math.max(...pts.map((r) => r.x));
    const X = (x) => pad + (x / mx) * (W - pad - 8), Y = (y) => 8 + (1 - y / 14) * (Hh - pad - 8);
    const d = pts.map((r, i) => `${i ? "L" : "M"}${X(r.x).toFixed(1)},${Y(r.pH).toFixed(1)}`).join(" ");
    const grid = [0, 7, 14].map((y) => `<line x1="${pad}" x2="${W - 8}" y1="${Y(y)}" y2="${Y(y)}" stroke="currentColor" stroke-opacity=".15"/><text x="4" y="${Y(y) + 4}" font-size="10" fill="currentColor">${y}</text>`).join("");
    return `<figure class="lx-curve"><figcaption class="small"><b>${H(TX.curve)}</b></figcaption><svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${H(TX.curve)}">${grid}<path d="${d}" fill="none" stroke="#0891b2" stroke-width="2.5"/>${pts.map((r) => `<circle cx="${X(r.x).toFixed(1)}" cy="${Y(r.pH).toFixed(1)}" r="2.6" fill="#0891b2"/>`).join("")}<text x="${W - 8}" y="${Hh - 6}" font-size="10" text-anchor="end" fill="currentColor">V, ${lang() === "en" ? "mL" : "мл"}</text><text x="${pad + 2}" y="12" font-size="10" fill="currentColor">pH</text></svg></figure>`;
  }
  function renderLog() {
    const b = ROOT.querySelector("[data-log]"); if (!b) return;
    const rows = S.log;
    b.innerHTML = rows.length ? `<div class="ly-rtable"><table class="l3-tbl"><tr><th>⏱</th><th>${H(t3("Ҳаракат", "Действие", "Action"))}</th><th>pH</th><th>T, °C</th><th>V</th></tr>${rows.slice(-14).map((r) => `<tr><td>${esc(r.t)}</td><td>${esc(r.a)}</td><td>${fmt(r.pH, 2)}</td><td>${fmt(r.T, 1)}</td><td>${fmt(r.V, 1)}</td></tr>`).join("")}</table></div>${curveSvg(rows)}<p><button type="button" class="btn btn-ghost btn-sm" data-csv><i class="fa-solid fa-file-csv" aria-hidden="true"></i> ${H(TX.csv)}</button></p>` : `<p class="small muted">${H(TX.logEmpty)}</p>`;
    const c = b.querySelector("[data-csv]");
    if (c) c.addEventListener("click", () => {
      const csv = "time;action;pH;T_C;V_mL;added_mL\n" + rows.map((r) => [r.t, '"' + r.a.replace(/"/g, "'") + '"', r.pH, r.T, r.V, r.x].join(";")).join("\n");
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" })); a.download = "Ekomun-lab-xona.csv"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
  }
  function quizHtml() {
    const done = !!flags().lx_quiz;
    return `${QUIZ.map(([q, o, a], i) => `<div class="lx-q"><p><b>${i + 1}. ${H(q)}</b></p><div class="lx-qo">${o.map((x, j) => { const ch = quizA[i]; const cls = ch == null ? "" : j === a && ch === j ? "ok" : ch === j ? "bad" : ""; return `<button type="button" class="sg-opt ${cls}" data-qi="${i}" data-qj="${j}" ${ch != null ? "disabled" : ""}>${H(x)}</button>`; }).join("")}</div></div>`).join("")}${done ? `<p class="lx-ok small">${H(TX.quizOk)}</p>` : ""}`;
  }
  function recipeHtml() {
    const list = RECIPES.filter((r) => r.st === "m" || uni());
    return `<div class="lx-recs">${list.map((r) => `<button type="button" class="lx-rec ${recipe === r.id ? "sel" : ""}" data-rec="${r.id}"><span aria-hidden="true">${r.ic}</span><b>${H(r.n)}</b></button>`).join("")}</div><div data-recbody>${recipeBody()}</div>`;
  }
  function recipeBody() {
    const r = RECIPES.find((x) => x.id === recipe); if (!r) return "";
    const stp = r.s.map(([id, a, n], si) => {
      const rep = n > 1 ? ` × ${n}` : "";
      if (id[0] === "@") { const [tid, ...args] = id.slice(1).split(":"), tl = toolMeta(tid), site = AIR.find((x) => x.id === args[0]); return `<li><i class="fa-solid ${tl[0]}" aria-hidden="true"></i> ${H(tl[1])}${site ? " — " + H(site.n) : args[0] && tid === "spec" ? ` (${args[0]} нм)` : ""}${args[1] ? ` · ${args[1]} л` : ""}${rep} <button type="button" class="linkish" data-do="${si}">▶</button></li>`; }
      const rr = RID[id], sol = rr.k === "s";
      return `<li><span class="lx-dot sm ${sol ? "s" : ""}" style="--bc:${rr.col}" aria-hidden="true"></span> ${H(rr.n)} — ${amtTxt(sol, a)}${rep} <button type="button" class="linkish" data-add="${si}" aria-label="${H(TX.start)}">▶</button></li>`;
    }).join("");
    return `<div class="lx-recb"><p class="small"><b>${H(TX.steps)}</b> · ${H(VES[r.v].n)}</p><ol>${stp}</ol><p class="small muted">💡 ${H(r.w)}</p></div>`;
  }
  function toolMeta(t) {
    const a = TOOLS.find((x) => x[0] === t); if (a) return [a[1], a[2]];
    if (t === "rinse") return ["fa-faucet", t3("Дистиллят билан чайиш", "Ополоснуть дистиллятом", "Rinse with distilled water")];
    if (t === "cal") return ["fa-sliders", TX.calB];
    const e = EQID[t]; return e ? [e.ic, e.n] : ["fa-circle", t3(t, t, t)];
  }
  function bindRecipes() {
    const box = ROOT.querySelector("[data-recs]"); if (!box) return;
    box.innerHTML = recipeHtml();
    box.querySelectorAll("[data-rec]").forEach((b) => b.addEventListener("click", () => {
      recipe = b.dataset.rec; const r = RECIPES.find((x) => x.id === recipe);
      resetVessel(r.v); syncVes(); bindRecipes();
      note(`${r.ic} ${L(r.n)}: ${L(t3("ҳар бир қадамдаги ▶ ни босинг", "нажимайте ▶ на каждом шаге", "press ▶ on each step"))}`);
    }));
    const rc = RECIPES.find((x) => x.id === recipe);
    box.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => { const [id, a, n] = rc.s[+b.dataset.add]; selectR(id); for (let k = 0; k < (n || 1); k++) add(id, a); b.textContent = "✓"; }));
    box.querySelectorAll("[data-do]").forEach((b) => b.addEventListener("click", () => { const [id, , n] = rc.s[+b.dataset.do]; const [tid, ...args] = id.slice(1).split(":"); for (let k = 0; k < (n || 1); k++) tool(tid, args.join(":")); b.textContent = "✓"; }));
  }
  function syncVes() { ROOT.querySelectorAll("[data-ves]").forEach((b) => { b.classList.toggle("active", b.dataset.ves === S.ves); b.setAttribute("aria-pressed", String(b.dataset.ves === S.ves)); }); }
  function ppeHtml() {
    return `<div class="lx-ppe ${ppeOk() ? "ok" : ""}" data-ppe><b>${H(TX.ppe)}:</b> ${[["coat", "🥼", TX.coat], ["gog", "🥽", TX.gog], ["glo", "🧤", TX.glo]].map(([k, e, n]) => `<button type="button" class="chip ${ppe[k] ? "active" : ""}" aria-pressed="${ppe[k]}" data-p="${k}"><span aria-hidden="true">${e}</span> ${H(n)}</button>`).join("")}<small>${H(ppeOk() ? TX.ppeOk : TX.ppeNeed)}</small></div>`;
  }
  function bindPpe() {
    ROOT.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
      ppe[b.dataset.p] = !ppe[b.dataset.p]; putJ(PKEY, ppe);
      const box = ROOT.querySelector("[data-ppe]"); box.outerHTML = ppeHtml(); bindPpe();
      if (ppeOk()) once("lx_ppe", 1, WHY);
    }));
  }

  const QUICK = ["phm", "cond", "oxy", "strip", "spec", "shake"];
  function eqHtml() {
    const isU = uni(), list = EQUIP.filter((e) => e.cat === eqCat), e = EQID[eqSel] && EQID[eqSel].cat === eqCat ? EQID[eqSel] : list[0];
    if (e) eqSel = e.id;
    const lk = e && e.st === "u" && !isU;
    const on = (id) => (id === "hood" && hood) || (id === "fridge" && S.cold) || (id === "mstir" && S.mstir) || (id === "plate" && S.heat);
    const extra = !e ? "" : e.id === "asp" || e.id === "gas" || e.id === "pm" ? `<div class="lx-chips" role="group" aria-label="${H(TX.site)}">${AIR.map((a) => `<button type="button" class="chip ${a.id === airSite ? "active" : ""}" data-air="${a.id}" aria-pressed="${a.id === airSite}"><i class="fa-solid ${a.ic}" aria-hidden="true"></i> ${H(a.n)}</button>`).join("")}</div>${e.id === "asp" ? `<div class="lx-chips" role="group" aria-label="${H(TX.vol)}">${[1, 10, 100, 1000].map((v) => `<button type="button" class="chip ${v === airVol ? "active" : ""}" data-avol="${v}" aria-pressed="${v === airVol}">${v} ${lang() === "en" ? "L" : "л"}</button>`).join("")}</div>` : ""}` : "";
    const btn = !e ? "" : lk ? `<p class="small lx-bad">${H(TX.lockEq)}</p>` : e.act ? `<button type="button" class="btn btn-sm ${on(e.id) ? "btn-ghost" : ""}" data-eqrun="${e.act}"><i class="fa-solid ${e.ic}" aria-hidden="true"></i> ${H(["fridge", "hood", "mstir", "plate"].includes(e.id) ? (on(e.id) ? t3("Ўчириш", "Выключить", "Switch off") : t3("Ёқиш", "Включить", "Switch on")) : TX.run)}</button>${e.id === "phm" ? ` <button type="button" class="btn btn-ghost btn-sm" data-eqrun="cal"><i class="fa-solid fa-sliders" aria-hidden="true"></i> ${H(TX.calB)} (${calPts.size}/2)</button>` : ""}` : `<button type="button" class="btn btn-ghost btn-sm" data-eqrun="${e.id}"><i class="fa-solid fa-check" aria-hidden="true"></i> ${H(TX.learnt)}</button>`;
    return `<div class="lx-tabs" role="tablist">${EQC.map(([c, ic, n]) => `<button type="button" role="tab" class="chip ${c === eqCat ? "active" : ""}" aria-selected="${c === eqCat}" data-eqc="${c}"><i class="fa-solid ${ic}" aria-hidden="true"></i> ${H(n)}</button>`).join("")}</div>
      <div class="lx-eqgrid">${list.map((x) => { const l = x.st === "u" && !isU; return `<button type="button" class="lx-eq ${x.id === eqSel ? "sel" : ""} ${l ? "lk" : ""} ${on(x.id) ? "on" : ""}" data-eq="${x.id}" aria-pressed="${x.id === eqSel}"><span class="lx-eqi" aria-hidden="true"><i class="fa-solid ${x.ic}"></i></span><b>${H(x.n)}</b>${l ? `<small>🔒</small>` : ""}</button>`; }).join("")}</div>
      ${e ? `<div class="lx-eqd"><p><span class="lx-eqi" aria-hidden="true"><i class="fa-solid ${e.ic}"></i></span> <b>${H(e.n)}</b></p><p class="small">${H(e.d)}</p><p class="small lx-sf"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> <b>${H(TX.safety)}:</b> ${H(e.sf)}</p>${extra}<div class="lx-eqbtn">${btn}</div></div>` : ""}`;
  }
  function bindEq() {
    const w = ROOT.querySelector("[data-eqwrap]"); if (!w) return;
    w.innerHTML = eqHtml();
    w.querySelectorAll("[data-eqc]").forEach((b) => b.addEventListener("click", () => { eqCat = b.dataset.eqc; bindEq(); }));
    w.querySelectorAll("[data-eq]").forEach((b) => b.addEventListener("click", () => { eqSel = b.dataset.eq; bindEq(); }));
    w.querySelectorAll("[data-air]").forEach((b) => b.addEventListener("click", () => { airSite = b.dataset.air; bindEq(); }));
    w.querySelectorAll("[data-avol]").forEach((b) => b.addEventListener("click", () => { airVol = +b.dataset.avol; bindEq(); }));
    w.querySelectorAll("[data-eqrun]").forEach((b) => b.addEventListener("click", () => { const a = b.dataset.eqrun; if (EQID[a] && !EQID[a].act) eqAct(a); else tool(a, ["gas", "pm"].includes(a) ? airSite : undefined); if (["fridge", "hood", "mstir", "heat", "cal"].includes(a)) bindEq(); }));
  }
  const paintEq = () => bindEq();
  /* 3D хонада босилган асбоб: кичик карта (номи, вазифаси, «Ишлатиш» — натижа шу картада) */
  function pickEq(id) {
    const box = ROOT.querySelector("[data-pick]"); if (!box) return;
    const e = EQID[id];
    if (!e) { box.hidden = true; box.innerHTML = ""; return; }
    const lk = e.st === "u" && !uni();
    eqSel = id; eqCat = e.cat; bindEq();
    box.hidden = false;
    box.innerHTML = `<div class="lx-pickh"><span class="lx-eqi" aria-hidden="true"><i class="fa-solid ${e.ic}"></i></span><b>${H(e.n)}</b><button type="button" class="lx-pickx" data-pa="x" aria-label="${H(t3("Ёпиш", "Закрыть", "Close"))}">✕</button></div><p class="small">${H(e.d)}</p><div class="lx-pickb">${lk ? `<span class="small lx-bad">${H(TX.lockEq)}</span>` : `<button type="button" class="btn btn-sm" data-pa="run"><i class="fa-solid ${e.ic}" aria-hidden="true"></i> ${H(e.act ? TX.run : TX.learnt)}</button>`}<button type="button" class="btn btn-ghost btn-sm" data-pa="info"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> ${H(t3("Батафсил", "Подробнее", "Details"))}</button></div><div class="lx-pickr" data-pr></div>`;
    box.querySelector('[data-pa="x"]').addEventListener("click", () => { box.hidden = true; });
    box.querySelector('[data-pa="info"]').addEventListener("click", () => { const q = ROOT.querySelector("#lxEq"); if (q) q.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); });
    const run = box.querySelector('[data-pa="run"]');
    if (run) run.addEventListener("click", () => {
      const a = e.act, mb = ROOT.querySelector("[data-meter]"), before = mb ? mb.innerHTML : "";
      if (!a) eqAct(id); else if (EQID[a] && !EQID[a].act) eqAct(a); else tool(a, ["gas", "pm"].includes(a) ? airSite : undefined);
      if (["fridge", "hood", "mstir", "heat", "cal"].includes(a)) bindEq();
      const pr = box.querySelector("[data-pr]");
      if (pr && mb && mb.innerHTML !== before) pr.innerHTML = mb.innerHTML;
    });
  }
  function shell() {
    const isU = uni();
    ROOT.innerHTML = `<span class="pill">${H(TX.pill)}</span>
      <h2 class="section-title">${H(TX.title)}</h2>
      <p class="muted">${H(isU ? TX.leadU : TX.leadK).replace("{n}", R.length).replace("{e}", EQUIP.length)}</p>
      ${ppeHtml()}
      <div class="l3-row lx-row">
        <div class="l3-viewbox">
          <div class="l3-view lx-view" data-view><p class="l3-load">${H(TX.load)}</p></div>
          <div class="l3-tools">
            <button type="button" class="l3-tb" data-vt="in" title="+" aria-label="+"><i class="fa-solid fa-plus"></i></button>
            <button type="button" class="l3-tb" data-vt="out" title="−" aria-label="−"><i class="fa-solid fa-minus"></i></button>
            <button type="button" class="l3-tb" data-vt="home" title="${H(t3("Аввалги ҳолат", "Сброс вида", "Reset view"))}" aria-label="${H(t3("Аввалги ҳолат", "Сброс вида", "Reset view"))}"><i class="fa-solid fa-house"></i></button>
            <button type="button" class="l3-tb" data-vt="full" aria-pressed="false" title="${H(t3("Катта экран", "Во весь экран", "Full screen"))}" aria-label="${H(t3("Катта экран", "Во весь экран", "Full screen"))}"><i class="fa-solid fa-expand"></i></button>
            <button type="button" class="l3-tb" data-vt="lay" title="${H(t3("Буюмларни жойига қайтариш", "Вернуть предметы на места", "Put everything back"))}" aria-label="${H(t3("Буюмларни жойига қайтариш", "Вернуть предметы на места", "Put everything back"))}"><i class="fa-solid fa-rotate-left"></i></button>
          </div>
          <div class="lx-pick" data-pick hidden aria-live="polite"></div>
          <p class="small muted l3-hint">${H(TX.hint)}</p>
        </div>
        <div class="lab-ctl lx-panel">
          <div class="lx-read">
            <div><small>pH</small><b data-ph>—</b><span class="lx-phbar" data-phbar><i></i></span></div>
            <div><small>T</small><b data-t>22 °C</b></div>
            <div><small>V</small><b data-v>0</b></div>
            <div><small>${H(t3("Ранг", "Цвет", "Colour"))}</small><span class="lx-sw" data-sw></span></div>
            <div><small>EC</small><b data-ec>—</b></div>
            <div><small>O₂</small><b data-do>—</b></div>
          </div>
          <div><small class="muted">${H(TX.obs)}</small><ul class="lx-obs" data-obs aria-live="polite"></ul></div>
          <div><small class="muted">${H(TX.vessel)}</small><div class="lx-chips">${Object.entries(VES).map(([k, v]) => `<button type="button" class="chip" data-ves="${k}" aria-pressed="false"><i class="fa-solid ${v.ic}" aria-hidden="true"></i> ${H(v.n)}</button>`).join("")}</div></div>
          <div><small class="muted">${H(TX.amount)}</small><div class="lx-chips" data-amts>${amtHtml()}</div></div>
          <div><small class="muted">${H(TX.tools)}</small><div class="lx-tools">${TOOLS.concat(QUICK.map((k) => [k, EQID[k].ic, EQID[k].n])).map(([k, ic, n]) => `<button type="button" class="lx-tool${EQID[k] ? " lx-q" : ""}" data-tool="${k}" title="${H(n)}"><i class="fa-solid ${ic}" aria-hidden="true"></i><span>${H(n)}</span></button>`).join("")}</div></div>
          <div class="lx-waste" data-waste hidden></div>
          <ul class="lx-notes small" data-notes></ul>
          ${isU ? `<details class="lx-specd"><summary><b>${H(t3("Эритма таркиби (мувозанат)", "Состав раствора (равновесие)", "Solution composition (equilibrium)"))}</b></summary><div data-spec></div></details>` : ""}
        </div>
      </div>
      <nav class="lx-nav" aria-label="${H(TX.title)}">
        <button type="button" class="chip" data-go="lxShelf"><i class="fa-solid fa-flask-vial" aria-hidden="true"></i> ${H(TX.shelf)}</button>
        <button type="button" class="chip" data-go="lxElem"><i class="fa-solid fa-table-cells" aria-hidden="true"></i> ${H(t3("Менделеев жадвали ва реакциялар", "Таблица Менделеева и реакции", "Periodic table & reactions"))}</button>
        <button type="button" class="chip" data-go="lxEq"><i class="fa-solid fa-microscope" aria-hidden="true"></i> ${H(TX.eqT)}</button>
        <button type="button" class="chip" data-go="lxTahlil"><i class="fa-solid fa-clipboard-list" aria-hidden="true"></i> ${H(t3("Таҳлил жараёнлари", "Методики анализа", "Analysis procedures"))}</button>
      </nav>
      <div class="lx-shelfbox" id="lxShelf">
        <h3><i class="fa-solid fa-flask-vial" aria-hidden="true"></i> ${H(TX.shelf)}</h3>
        <div data-shelf>${shelfHtml()}</div>
        <div class="lx-info" data-info>${infoHtml()}</div>
      </div>
      <div class="lx-elembox" id="lxElem" data-lx-elem></div>
      <div class="lx-eqbox" id="lxEq">
        <h3><i class="fa-solid fa-microscope" aria-hidden="true"></i> ${H(TX.eqT)} <small class="muted">(${EQUIP.length})</small></h3>
        <p class="small muted">${H(TX.eqHint)}</p>
        <div data-eqwrap>${eqHtml()}</div>
        <div class="lx-meter" data-meter aria-live="polite" hidden></div>
      </div>
      <div class="lx-tahbox" id="lxTahlil" data-lx-tahlil></div>
      <div class="ps-grid lx-grid">
        <div class="ps-box"><h3>${H(TX.mis)}</h3><div data-mis></div></div>
        <div class="ps-box"><h3>${H(TX.disc)}</h3><div data-disc></div></div>
      </div>
      <details class="ps-box lx-d" open><summary><h3>${H(TX.rec)}</h3></summary><div data-recs></div></details>
      <details class="ps-box lx-d"><summary><h3>${H(TX.log)}</h3></summary><div data-log></div></details>
      <div class="ps-grid lx-grid">
        <details class="ps-box lx-d"><summary><h3>${H(TX.rules)}</h3></summary><ul class="lx-rules">${RULES.map(([ic, t]) => `<li><i class="fa-solid ${ic}" aria-hidden="true"></i> ${H(t)}</li>`).join("")}</ul><p class="small">${Object.entries(HAZ).map(([, [ic, d]]) => `<span class="lx-ghs" aria-hidden="true"><i class="fa-solid ${ic}"></i></span> ${H(d)}`).join("<br>")}</p></details>
        <details class="ps-box lx-d"><summary><h3>${H(TX.quiz)}</h3></summary><div data-quiz>${quizHtml()}</div></details>
      </div>
      <p class="small muted">${H(TX.src)}<br>${H(TX.model)}</p>`;
    bindPpe();
    ROOT.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => { const q = document.getElementById(b.dataset.go); if (q) q.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }));
    ROOT.querySelectorAll("[data-vt]").forEach((b) => b.addEventListener("click", () => { if (!view) return; const t = b.dataset.vt; if (t === "in") view.zoom(0.85); if (t === "out") view.zoom(1.18); if (t === "home") { view.target.set(...view.home.tg); view.resetView(); } if (t === "full") toggleFull(b); if (t === "lay" && R3) { R3.resetLayout(); toast(L(t3("Барча буюмлар жойига қайтди.", "Все предметы на местах.", "Everything is back in place."))); } }));
    ROOT.querySelectorAll("[data-ves]").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.ves === S.ves) return;
      if (S.V > VES[b.dataset.ves].max) { toast(L(TX.full)); return; }
      S.ves = b.dataset.ves; if (R3) R3.vesselChanged(); syncVes(); paint();
    }));
    const bindShelf = () => {
      ROOT.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { grp = b.dataset.g; ROOT.querySelector("[data-shelf]").innerHTML = shelfHtml(); bindShelf(); }));
      ROOT.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => {
        const id = b.dataset.r, r = RID[id];
        if (sel !== id) { selectR(id); const am = ROOT.querySelector("[data-amts]"); am.innerHTML = amtHtml(); bindAmt(); }
        if (r.st === "u" && !uni()) { toast(L(TX.lock)); return; }
        add(id, curAmt(r));
      }));
    };
    const bindAmt = () => ROOT.querySelectorAll("[data-amt]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.sol === "1") amtS = +b.dataset.amt; else amtIx = +b.dataset.amt; const am = ROOT.querySelector("[data-amts]"); am.innerHTML = amtHtml(); bindAmt(); }));
    bindShelf(); bindAmt();
    ROOT.querySelectorAll(".lx-tools [data-tool]").forEach((b) => b.addEventListener("click", () => { if (EQID[b.dataset.tool]) { eqSel = b.dataset.tool; eqCat = EQID[eqSel].cat; bindEq(); } tool(b.dataset.tool); }));
    bindEq();
    ROOT.querySelector("[data-quiz]").addEventListener("click", (e) => {
      const b = e.target.closest("[data-qi]"); if (!b) return;
      quizA[+b.dataset.qi] = +b.dataset.qj;
      if (QUIZ.every(([, , a], i) => quizA[i] === a)) once("lx_quiz", 5, WHY);
      ROOT.querySelector("[data-quiz]").innerHTML = quizHtml();
    });
    syncVes(); renderDisc(); renderMis(); renderLog(); bindRecipes();
    note(L(ppeOk() ? t3("Хуш келибсиз! Жавондан модда танланг.", "Добро пожаловать! Выберите вещество на полке.", "Welcome! Pick a substance from the shelf.") : TX.ppeNeed));
    paint();
  }

  async function mount() {
    const my = ++mountId;
    if (view) { view.dispose(); view = null; R3 = null; }
    document.documentElement.classList.remove("l3-noscroll");
    shell();
    window.dispatchEvent(new CustomEvent("eko:lx-shell"));
    const host = ROOT.querySelector("[data-view]");
    const L3 = window.EkoLab3D && window.EkoLab3D.lib;
    try {
      if (!L3) throw new Error("lib");
      const T = await L3.loadThree();
      if (my !== mountId) return;
      if (glFail) throw new Error("webgl");
      const narrow = (host.clientWidth || innerWidth) < 600;
      const tg = narrow ? [0.3, 1.15, 0.2] : [0.5, 1.05, 0.4];
      view = L3.View(host, { bg: "#e2e8f0", d: narrow ? 6.2 : 5.2, th: 0.32, ph: narrow ? 1.2 : 1.14, target: tg, minD: 0.8, maxD: 14, auto: false });
      view.home.tg = tg;
      view.canvas.setAttribute("aria-label", L(TX.title));
      const lp = host.querySelector(".l3-load"); if (lp) lp.remove();
      build3d(view, { T, textSprite: L3.textSprite });
      window.dispatchEvent(new CustomEvent("eko:lx-3d"));
      sync();
    } catch (e) {
      if (my !== mountId) return;
      glFail = !!L3;
      host.innerHTML = `<p class="l3-load">${H(TX.noGl)}</p>`;
      ROOT.querySelector(".lx-row .l3-tools").hidden = true;
      view = null;
      /* 3D йўқ: вақт жараёнлари таймер билан */
      if (!fallbackTimer) fallbackTimer = setInterval(() => { if (visible() && tick(0.25)) { checkAll(); paint(true); } }, 250);
    }
  }
  let fallbackTimer = 0;
  /* Катта экран (CSS орқали — WebView ва iOS да ҳам ишлайди) */
  function toggleFull(btn) {
    const vb = ROOT.querySelector(".lx-row .l3-viewbox"); if (!vb) return;
    const on = !vb.classList.contains("l3-full");
    vb.classList.toggle("l3-full", on);
    document.documentElement.classList.toggle("l3-noscroll", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.querySelector("i").className = "fa-solid " + (on ? "fa-compress" : "fa-expand");
    if (on) document.addEventListener("keydown", escFull); else document.removeEventListener("keydown", escFull);
    if (view) setTimeout(() => view.resize(), 30);
  }
  function escFull(e) { if (e.key === "Escape") { const b = ROOT.querySelector('[data-vt="full"]'); if (b && b.getAttribute("aria-pressed") === "true") toggleFull(b); } }
  function visible() { return SEC.classList.contains("page-on") && !document.hidden; }
  function sync() {
    if (!visible()) { const b = ROOT.querySelector('[data-vt="full"][aria-pressed="true"]'); if (b) toggleFull(b); }
    if (!view) return; if (visible()) { view.resize(); view.start(); } else view.stop();
  }
  function onShow() { if (!visible()) { sync(); return; } if (!built) { built = true; recompute(); mount(); } else sync(); }
  new MutationObserver(onShow).observe(SEC, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", onShow);
  window.addEventListener("eko:lang", () => { if (built) mount(); });
  window.addEventListener("eko:stage", () => { if (built) mount(); });
  /* Синов ва ўқитувчи намойиши учун */
  window.EkoLabXona = { get state() { return S; }, get eq() { return EQ; }, add: (id, a) => add(id, a), tool: (t) => tool(t), tick: (dt) => tick(dt), reset: (v) => resetVessel(v), ppe: (on) => { ppe = { coat: on, gog: on, glo: on }; putJ(PKEY, ppe); if (built) mount(); }, reagents: R.map((r) => r.id), equipment: EQUIP.map((e) => e.id), eq2: (id, arg) => eqAct(id, arg), hood: (on) => { hood = !!on; }, get meter() { const b = ROOT.querySelector("[data-meter]"); return b ? b.textContent : ""; }, recipes: RECIPES.map((r) => r.id), get view() { return view; },
    get rx() { return R3 && R3.rx; }, get layout() { return R3 ? R3.count() : null; }, get meterHtml() { const b = ROOT.querySelector("[data-meter]"); return b && !b.hidden ? b.innerHTML : ""; },
    ppeOk: () => ppeOk(), isUni: () => uni(), pick: (id) => pickEq(id), air: (id) => { if (AIR.some((a) => a.id === id)) airSite = id; }, airList: AIR, tool2: (t, arg) => tool(t, arg), name: (id) => (RID[id] ? L(RID[id].n) : EQID[id] ? L(EQID[id].n) : id) };
  recompute();
  onShow();
})();
