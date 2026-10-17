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
    leadU: t3("Виртуал кимё хонаси: 32 та реагент ва намуна, идишлар ва асбоблар. pH заряд мувозанатидан, чўкмалар Ksp дан ҳисобланади. Сув сифати таҳлили, титрлаш ва экологик намуналар билан ишланг.", "Виртуальная химическая комната: 32 реагента и пробы, посуда и приборы. pH считается из баланса зарядов, осадки — по Ksp. Анализ качества воды, титрование и экологические пробы.", "A virtual chemistry room: 32 reagents and samples, glassware and instruments. pH is solved from the charge balance, precipitates from Ksp. Water-quality analysis, titration and environmental samples."),
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
    hint: t3("🖱 Айлантиринг · жавондаги шишани босинг — идишга қуйилади", "🖱 Вращайте · нажмите на склянку на полке — она нальётся в сосуд", "🖱 Rotate · tap a bottle on the shelf to pour it"),
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
    env: ["fa-fish", t3("Табиат учун хавфли: раковинага тўкманг", "Опасно для природы: не сливать в раковину", "Harmful to nature: not down the drain")]
  };

  /* ---------- Реагентлар ва намуналар ----------
     c — ионлар (суюқлик: моль/л; қаттиқ модда: ммоль/г), ex — бошқа моддалар, ind — индикатор.
     st: "m" — мактаб ва университет, "u" — фақат университет. */
  const R = [
    /* Уй-рўзғор моддалари (хавфсиз) */
    { id: "water", g: "base", st: "m", k: "l", f: "H₂O", col: "#e0f2fe", n: t3("Дистилланган сув", "Дистиллированная вода", "Distilled water"), c: {}, d: t3("Тоза сув: ионлар йўқ, pH 7.", "Чистая вода: ионов нет, pH 7.", "Pure water: no ions, pH 7.") },
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
    /* Экологик намуналар */
    { id: "rain", g: "eco", st: "m", k: "l", f: "pH≈4,3", col: "#e0f2fe", n: t3("Кислотали ёмғир намунаси", "Проба кислотного дождя", "Acid-rain sample"), c: { SO4: 0.000025, NO3: 0.00001 }, d: t3("SO₂ ва NOₓ дан ҳосил бўлган сульфат ва нитрат кислоталари. Тоза ёмғир pH ≈ 5,6.", "Серная и азотная кислоты из SO₂ и NOₓ. Чистый дождь pH ≈ 5,6.", "Sulfuric and nitric acids from SO₂ and NOₓ. Clean rain has pH ≈ 5.6.") },
    { id: "tap", g: "eco", st: "m", k: "l", f: "H₂O + Ca²⁺", col: "#e0f2fe", n: t3("Водопровод суви", "Водопроводная вода", "Tap water"), c: { Ca: 0.0015, Na: 0.001, Cl: 0.001, C: 0.0032 }, d: t3("Ўртача қаттиқ сув: Ca²⁺ ≈ 1,5 ммоль/л (3 °Ж).", "Вода средней жёсткости: Ca²⁺ ≈ 1,5 ммоль/л (3 °Ж).", "Moderately hard water: Ca²⁺ ≈ 1.5 mmol/L.") },
    { id: "river", g: "eco", st: "m", k: "l", f: "Cl⁻ SO₄²⁻", col: "#dbeafe", n: t3("Сирдарё суви намунаси", "Проба воды Сырдарьи", "Syr Darya water sample"), c: { Na: 0.0085, Ca: 0.004, Cl: 0.005, SO4: 0.005, C: 0.0032 }, d: t3("Минераллашган дарё суви (≈ 1 г/л): сульфат ва хлорид кўп — суғоришдан қайтган сув таъсири.", "Минерализованная речная вода (≈ 1 г/л): много сульфатов и хлоридов — влияние возвратных вод орошения.", "Mineralised river water (≈ 1 g/L): high sulfate and chloride from irrigation return flow.") },
    { id: "wastew", g: "eco", st: "m", k: "l", f: "🏭", col: "#d6c7a1", n: t3("Оқова сув (ифлосланган)", "Сточная вода (загрязнённая)", "Wastewater (polluted)"), c: { Na: 0.002, Cl: 0.002, C: 0.004, Ca: 0.001 }, ex: { org: 0.05 }, d: t3("Органик моддалар (ювинди, озиқ қолдиқлари) бор. Перманганат билан аниқланади.", "Содержит органику (стоки, остатки пищи). Определяется перманганатом.", "Contains organic matter (sewage, food waste). Detected with permanganate.") },
    { id: "well", g: "eco", st: "u", k: "l", f: "Fe³⁺", col: "#fde68a", n: t3("Темирли қудуқ суви (кислоталанган)", "Железистая вода из колодца (подкислена)", "Iron-rich well water (acidified)"), c: { Fe: 0.0005, Cl: 0.0015, NO3: 0.01 }, d: t3("Намуна сақлаш учун HNO₃ билан кислоталанган. Темир сувга занг ранги ва таъм беради.", "Проба подкислена HNO₃ для хранения. Железо даёт воде ржавый цвет и привкус.", "Acidified with HNO₃ for storage. Iron gives water a rusty colour and taste.") },
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
    { id: "kmno4", g: "lab", st: "u", k: "l", f: "KMnO₄", col: "#a21caf", haz: ["ox", "env"], n: t3("Калий перманганат (0,0002 М)", "Перманганат калия (0,0002 М)", "Potassium permanganate (0.0002 M)"), c: { K: 0.0002, Mn: 0.0002 }, d: t3("Кучли оксидловчи. Органик ифлосликни оксидлаб рангсизланади (перманганат индекси).", "Сильный окислитель. Обесцвечивается, окисляя органику (перманганатная окисляемость).", "A strong oxidiser. Loses colour as it oxidises organic matter (permanganate index).") }
  ];
  const RG = [
    ["base", "fa-house", t3("Уй-рўзғор", "Бытовые", "Household")],
    ["ind", "fa-palette", t3("Индикаторлар", "Индикаторы", "Indicators")],
    ["eco", "fa-water", t3("Экологик намуналар", "Экопробы", "Eco samples")],
    ["lab", "fa-flask-vial", t3("Лаборатория реагентлари", "Лабораторные реактивы", "Lab reagents")]
  ];
  const RID = Object.fromEntries(R.map((r) => [r.id, r]));
  const VES = {
    beaker: { max: 250, ic: "fa-glass-water", n: t3("Стакан 250 мл", "Стакан 250 мл", "Beaker 250 mL") },
    flask: { max: 250, ic: "fa-flask", n: t3("Колба 250 мл", "Колба 250 мл", "Flask 250 mL") },
    tube: { max: 20, ic: "fa-vial", n: t3("Пробирка 20 мл", "Пробирка 20 мл", "Test tube 20 mL") }
  };
  const AMT_L = [0.05, 1, 5, 20], AMT_S = [0.1, 1];

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
    ["heat", "🌡️", "u", t3("Нейтраллашда иссиқлик ажралди (термометр кўтарилди)", "При нейтрализации выделилось тепло (термометр поднялся)", "Neutralisation released heat (the thermometer rose)"), "H⁺ + OH⁻ → H₂O, ΔH = −55,8 кЖ/моль"]
  ];
  const MIS = [
    ["rainph", "m", t3("Кислотали ёмғир намунасининг pH ини индикатор билан аниқланг", "Определите pH кислотного дождя с индикатором", "Find the pH of the acid-rain sample with an indicator"), (s, e) => s.used.has("rain") && (s.ind.cab > 0 || s.ind.uni > 0 || s.paper) && e.pH < 5.6],
    ["rainfix", "m", t3("Кислотали ёмғирни сода ёки оҳак суви билан нейтралланг (pH 6,5–7,5)", "Нейтрализуйте кислотный дождь содой или известковой водой (pH 6,5–7,5)", "Neutralise the acid rain with soda or limewater (pH 6.5–7.5)"), (s, e) => s.used.has("rain") && (s.used.has("soda") || s.used.has("lime") || s.used.has("marble")) && e.pH >= 6.5 && e.pH <= 7.5],
    ["breath", "m", t3("Нафасимизда CO₂ борлигини оҳак суви билан исботланг", "Докажите известковой водой, что в дыхании есть CO₂", "Prove with limewater that our breath contains CO₂"), (s) => s.disc.has("lime") && s.breath > 0],
    ["hardw", "m", t3("Водопровод ёки дарё суви қаттиқлигини совун билан текширинг", "Проверьте жёсткость водопроводной или речной воды мылом", "Test the hardness of tap or river water with soap"), (s) => s.disc.has("hard") && (s.used.has("tap") || s.used.has("river"))],
    ["river", "u", t3("Сирдарё сувида хлорид ва сульфат ионларини аниқланг", "Обнаружьте хлорид и сульфат в воде Сырдарьи", "Detect chloride and sulfate in the Syr Darya sample"), (s) => s.used.has("river") && s.seen.has("agcl") && s.seen.has("baso4")],
    ["cod", "u", t3("Оқова сувдаги органик ифлосликни перманганат билан исботланг", "Докажите органическое загрязнение сточной воды перманганатом", "Prove organic pollution in the wastewater with permanganate"), (s) => s.used.has("wastew") && s.disc.has("mn")],
    ["titr", "u", t3("0,1 М HCl ни 0,1 М NaOH билан фенолфталеин иштирокида титрланг (биринчи барқарор пушти ранг)", "Оттитруйте 0,1 М HCl раствором 0,1 М NaOH с фенолфталеином (первая устойчивая розовая окраска)", "Titrate 0.1 M HCl with 0.1 M NaOH using phenolphthalein (first lasting pink)"), (s, e) => s.used.has("hcl") && s.used.has("naoh") && s.ind.php > 0 && e.pH > 8.2 && e.pH < 12],
    ["iron", "u", t3("Қудуқ сувида темир (III) ионларини роданид билан аниқланг", "Обнаружьте ионы железа (III) в колодезной воде роданидом", "Detect iron(III) in the well water with thiocyanate"), (s) => s.used.has("well") && s.seen.has("fescn")]
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
    { id: "perm", st: "u", ic: "🟣", n: t3("Перманганат индекси", "Перманганатная окисляемость", "Permanganate index"), v: "tube", s: [["wastew", 10], ["h2so4", 1], ["kmno4", 1], ["@heat"]], w: t3("Органика кўп бўлса, пушти ранг тез йўқолади. Дистилланган сувда пушти қолади.", "При большом количестве органики розовый цвет быстро исчезает. В дистиллированной воде остаётся розовым.", "With lots of organics the pink fades fast; in distilled water it stays pink.") }
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

  /* ---------- Ҳолат ---------- */
  const PKEY = "ekotalim:lx-ppe", LKEY = "ekotalim:lx-log";
  const getJ = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } };
  const putJ = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  let ppe = Object.assign({ coat: false, gog: false, glo: false }, getJ(PKEY, {}));
  const ppeOk = () => ppe.coat && ppe.gog && ppe.glo;
  let S = null, EQ = null, grp = "base", amtIx = 2, sel = null, recipe = null, quizA = {};
  const newState = (v) => ({ ves: v || (S ? S.ves : "beaker"), V: 0, T: 22, tot: {}, extra: {}, ind: {}, used: new Set(), seen: new Set(), disc: new Set(), heat: false, gasCO2: 0, gasO2: 0, rateCO2: 0, rateO2: 0, breath: 0, cuo: 0, paper: null, stirT: 0, log: [], obs: [], lastT: 22 });
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
    const liq = r.k === "l";
    if (liq && S.V + amt > VES[S.ves].max + 1e-9) { toast(L(TX.full)); return; }
    const before = S.V > 0 ? freeHOH(EQ || recompute(), S.V) : 0;
    let stock = 0;
    if (liq) { const eq0 = K.equil(Object.fromEntries(Object.entries(r.c).map(([k, v]) => [k, v * 10])), 10); stock = freeHOH(eq0, amt); }
    const co2Before = S.gasCO2;
    for (const k in r.c) S.tot[k] = (S.tot[k] || 0) + r.c[k] * amt; // моль/л × мл = ммоль; ммоль/г × г = ммоль
    for (const k in r.ex || {}) S.extra[k] = (S.extra[k] || 0) + r.ex[k] * amt;
    for (const k in r.ind || {}) S.ind[k] = (S.ind[k] || 0) + r.ind[k] * amt;
    const T0 = S.T;
    if (liq) { S.T = (S.T * S.V + 22 * amt) / (S.V + amt); S.V += amt; }
    S.used.add(id);
    recompute();
    /* Иссиқлик: эркин H⁺/OH⁻ камайиши — нейтраллаш (55,8 кЖ/моль); CO₂ ажралиши — эндотермик (+18 кЖ/моль) */
    const nW = Math.max(0, before + stock - freeHOH(EQ, S.V));
    const nCO2 = S.gasCO2 - co2Before;
    if (S.V > 0) { const q = 55.8 * nW - 18 * nCO2; S.T = clamp(S.T + q / (S.V * 4.18), 0, 100); }
    if (S.T - T0 > 0.5 && nW > 0.5) discover("heat");
    reactInstant(id);
    const shown = r.k === "l" ? (amt < 0.1 ? L(TX.drop) : fmt(amt, amt < 1 ? 2 : 0) + " " + (lang() === "en" ? "mL" : lang() === "ru" ? "мл" : "мл")) : (amt < 0.5 ? L(TX.pinch) + " " : "") + fmt(amt, amt < 1 ? 1 : 0) + " " + (lang() === "en" || lang() === "lat" ? "g" : "г");
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
    void id; void V;
  }

  /* ---------- Асбоблар ---------- */
  function tool(t) {
    if (t === "empty") { askWaste(); return; }
    if (!ppeOk()) { warnPpe(); return; }
    if (t !== "heat" && S.V <= 0 && !hasSolids()) { toast(L(TX.empty)); return; }
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
    if (t === "filter") {
      const p = EQ.ppt, any = Object.values(p).some((v) => v > 1e-4) || S.cuo > 0;
      if (!any) { note(L(t3("Чўкма йўқ — фильтр қоғози тоза қолди.", "Осадка нет — фильтр чистый.", "No precipitate — the filter paper stays clean."))); return; }
      /* Чўкма ионларини умумий миқдордан чиқариб ташлаймиз */
      const sub = (k, n) => { S.tot[k] = Math.max(0, (S.tot[k] || 0) - n); };
      sub("Ag", p.agcl); sub("Cl", p.agcl); sub("Ba", p.baso4); sub("SO4", p.baso4);
      sub("Ca", p.caco3); sub("C", p.caco3); sub("Cu", p.cuoh); sub("Fe", p.feoh);
      sub("Ca", p.casoap); sub("Soap", 2 * p.casoap);
      /* Гидроксид чўкмаси билан бирга OH⁻ ҳам кетади: заряд мувозанати учун мос Na ни қолдирамиз — эритма pH и ўзгармайди */
      S.cuo = 0; recompute();
      note(L(t3("Фильтрланди: чўкма фильтр қоғозида қолди, тиниқ фильтрат идишда.", "Отфильтровано: осадок на фильтре, прозрачный фильтрат в сосуде.", "Filtered: the precipitate stays on the paper, clear filtrate in the vessel.")));
      logStep("⧩ filter");
    }
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

  /* ---------- Вақт бўйича жараёнлар (кинетика) ---------- */
  function tick(dt) {
    if (!S) return;
    let ch = false;
    const x = S.extra, fast = S.stirT > 0 ? 2.5 : 1;
    if (S.stirT > 0) S.stirT -= dt;
    /* Иситгич: 1,5 кВт (вақт тезлаштирилган), 100 °C да буғланиш (2260 Ж/г) */
    if (S.heat && S.V > 0) {
      const P = S.ves === "tube" ? 150 : 900;
      if (S.T < 100) S.T = Math.min(100, S.T + P * dt / (S.V * 4.18));
      else { const dv = P * dt / 2260; S.V = Math.max(0, S.V - dv); ch = true; if (S.V < VES[S.ves].max * 0.04 + 0.5) { S.heat = false; note(L(TX.dry)); } }
    } else if (S.T !== 22) { S.T += (22 - S.T) * Math.min(1, dt * 0.02); if (Math.abs(S.T - 22) < 0.05) S.T = 22; }
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
    /* Хона: пол, деворлар, дераза */
    box(9, 0.05, 6, M(0xb08968), 0, -0.025, 0.5);
    box(9, 3.6, 0.05, M(0xe7efe9), 0, 1.8, -1.6);
    box(0.05, 3.6, 6, M(0xdbe7df), -4.5, 1.8, 0.5);
    const win = box(1.6, 1.1, 0.02, new T.MeshBasicMaterial({ color: 0xbae6fd }), -3.4, 2.15, -1.57);
    box(1.7, 0.06, 0.06, M(0xffffff), -3.4, 1.58, -1.55); box(0.05, 1.1, 0.04, M(0xffffff), -3.4, 2.15, -1.55);
    void win;
    /* Плитка (кафель) йўли девор бўйлаб */
    for (let i = -4; i <= 4; i++) box(0.98, 0.5, 0.01, M(i % 2 ? 0xffffff : 0xf1f5f9), i, 1.2, -1.56);
    /* Лаборатория столи */
    box(4.6, 0.08, 1.3, M(0x1f2937, { roughness: 0.5 }), 0, 0.9, -0.1);
    box(4.5, 0.86, 1.2, M(0xf8fafc), 0, 0.43, -0.12);
    [-1.5, 0, 1.5].forEach((x) => box(1.38, 0.7, 0.01, M(0xe2e8f0), x, 0.45, 0.49));
    /* Раковина ва жўмрак */
    box(0.6, 0.02, 0.45, M(0x94a3b8, { metalness: 0.6, roughness: 0.3 }), -1.75, 0.945, -0.2);
    const tap = new T.Mesh(new T.TorusGeometry(0.12, 0.02, 8, 16, Math.PI), M(0x94a3b8, { metalness: 0.7, roughness: 0.3 })); tap.position.set(-1.75, 1.05, -0.45); sc.add(tap);
    /* Жавонлар */
    const shelfY = [1.45, 1.95, 2.45];
    shelfY.forEach((y) => box(4.4, 0.04, 0.32, M(0x8b5e34), 0.1, y - 0.02, -1.42));
    /* Шишалар */
    const bottles = [];
    const isU = uni();
    R.forEach((r, i) => {
      const row = Math.floor(i / 12), col = i % 12;
      const x = -2.0 + col * 0.37, y = shelfY[row], z = -1.42;
      const g = new T.Group(); g.position.set(x, y, z);
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
      g.userData = { rid: r.id, locked };
      g.traverse((o) => { o.userData.rid = r.id; });
      sc.add(g); bottles.push(g);
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
    const burner = new T.Mesh(new T.CylinderGeometry(0.12, 0.15, 0.1, 20), M(0x475569, { metalness: 0.5 })); burner.position.set(0.2, 0.0, 0.15); vesG.parent.add(burner);
    burner.position.y = 0.0; burner.visible = false;
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
    const meter = box(0.34, 0.22, 0.14, M(0x0f766e), 0.95, 1.05, 0.1);
    const scr = box(0.26, 0.12, 0.01, new T.MeshBasicMaterial({ color: 0x052e2b }), 0.95, 1.07, 0.175);
    void scr;
    let phSpr = null, tSpr = null, phTxt = "";
    const meterText = () => {
      const t = EQ && (S.V > 0) ? "pH " + fmt(EQ.pH, 1) : "pH —";
      if (t === phTxt) return; phTxt = t;
      if (phSpr) { sc.remove(phSpr); phSpr.material.map.dispose(); phSpr.material.dispose(); }
      phSpr = lib.textSprite(t, "#34d399", 0.13); phSpr.position.set(0.95, 1.32, 0.2); sc.add(phSpr);
    };
    let tTxt = "";
    const tempText = () => {
      const t = fmt(S.T, 0) + " °C";
      if (t === tTxt) return; tTxt = t;
      if (tSpr) { vesG.remove(tSpr); tSpr.material.map.dispose(); tSpr.material.dispose(); }
      tSpr = lib.textSprite(t, "#b91c1c", 0.08); tSpr.position.set(0.26, 0.82, 0.08); vesG.add(tSpr);
    };
    void meter;
    /* Хавфсизлик буюмлари: ўт ўчиргич, кўз ювгич, биринчи ёрдам, чиқинди идишлари */
    const ext = new T.Mesh(new T.CylinderGeometry(0.11, 0.11, 0.5, 16), M(0xdc2626, { roughness: 0.4 })); ext.position.set(3.2, 0.25, -1.3); sc.add(ext);
    [["🧯", 3.2, 0.8, -1.3], ["👁️💧", 2.6, 1.55, -1.55], ["⛑️", 3.4, 1.55, -1.55], ["🥼", -4.1, 1.7, -0.6], ["🥽", -4.1, 1.35, -0.3], ["🧤", -4.1, 1.05, 0]].forEach(([e, x, y, z]) => { const s = lib.textSprite(e, "#fff", 0.32); s.position.set(x, y, z); sc.add(s); });
    const binY = box(0.45, 0.6, 0.45, M(0xfacc15), 2.75, 0.3, 0.7);
    const binS = lib.textSprite("☣️", "#fff", 0.3); binS.position.set(2.75, 0.8, 0.7); sc.add(binS);
    void binY;
    /* Қуйиш анимацияси */
    let pour = null;
    const pourM = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    const stream = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 1, 8), pourM); stream.visible = false; sc.add(stream);
    let tagSpr = null, tagId = "";
    const showTag = (id) => {
      if (id === tagId) return; tagId = id;
      if (tagSpr) { sc.remove(tagSpr); tagSpr.material.map.dispose(); tagSpr.material.dispose(); tagSpr = null; }
      const g = bottles.find((b) => b.userData.rid === id); if (!g) return;
      tagSpr = lib.textSprite(RID[id].f, "#0f172a", 0.14); tagSpr.position.set(g.position.x, g.position.y + 0.42, g.position.z + 0.1); sc.add(tagSpr);
    };
    R3 = {
      showTag,
      startPour(id) {
        const g = bottles.find((b) => b.userData.rid === id); if (!g) return;
        pour = { g, t: 0, home: g.position.clone(), rot: g.rotation.z };
        pourM.color.set(RID[id].col); stream.visible = false;
      },
      vesselChanged: rebuildVessel
    };
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
      const bub = clamp(S.rateCO2 * 6 + S.rateO2 * 10 + (S.heat && S.T >= 99.5 ? 0.8 : 0), 0, 1);
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
    const t = S.tot, p = EQ ? EQ.ppt : {};
    return ((t.Cu || 0) + (t.Ag || 0) + (t.Ba || 0) + (t.Mn || 0) + (t.Fe || 0) + (t.SCN || 0) + S.cuo + (p.agcl || 0) + (p.baso4 || 0)) > 1e-5;
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
  const curAmt = (r) => (r && r.k === "s" ? AMT_S[Math.min(amtIx, 1) === 0 ? 0 : 1] : AMT_L[amtIx]);
  function selectR(id) { sel = id; if (R3) R3.showTag(id); const p = ROOT.querySelector("[data-info]"); if (p) p.innerHTML = infoHtml(); ROOT.querySelectorAll("[data-r]").forEach((b) => b.classList.toggle("sel", b.dataset.r === id)); }
  function infoHtml() {
    const r = RID[sel]; if (!r) return `<p class="small muted">${H(t3("Жавондан модда танланг — бу ерда унинг хоссалари ва хавфсизлик белгилари кўринади.", "Выберите вещество на полке — здесь появятся его свойства и знаки опасности.", "Pick a substance on the shelf to see its properties and hazard signs here."))}</p>`;
    const hz = (r.haz || []).map((h) => `<span class="lx-ghs" title="${H(HAZ[h][1])}"><i class="fa-solid ${HAZ[h][0]}" aria-hidden="true"></i></span> <small>${H(HAZ[h][1])}</small>`).join("<br>");
    return `<p><b>${H(r.n)}</b> <code>${esc(r.f)}</code></p><p class="small">${H(r.d)}</p>${hz ? `<p class="small">${hz}</p>` : `<p class="small lx-ok">✅ ${H(t3("Хавфсиз модда", "Безопасное вещество", "Safe substance"))}</p>`}${r.st === "u" && !uni() ? `<p class="small lx-bad">${H(TX.lock)}</p>` : ""}`;
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
    setT("[data-v]", fmt(S.V, S.V < 10 && S.V > 0 ? 1 : 0) + "/" + VES[S.ves].max + (lang() === "en" ? " mL" : " мл"));
    const sw = q("[data-sw]");
    if (sw) { const c = K.color(S, e); sw.style.background = has ? `rgb(${c.rgb.map((v) => Math.round(v * 255)).join(",")})` : "transparent"; }
    const phb = q("[data-phbar] i"); if (phb) phb.style.left = (has ? clamp(e.pH / 14 * 100, 0, 100) : 50) + "%";
    const ob = q("[data-obs]"); if (ob) { const h = observe().map((x) => `<li>${esc(x)}</li>`).join(""); if (ob.dataset.h !== h) { ob.innerHTML = h; ob.dataset.h = h; } }
    const hb = q('[data-tool="heat"]'); if (hb) { hb.classList.toggle("on", S.heat); hb.setAttribute("aria-pressed", String(S.heat)); }
    if (uni()) {
      const sp = q("[data-spec]");
      if (sp) {
        const c = e.c, rows = [["H⁺", Math.pow(10, -e.pH)], ["Na⁺", c.Na], ["Ca²⁺", c.Ca], ["Cu²⁺", c.Cu], ["Fe³⁺", c.Fe], ["Ag⁺", c.Ag], ["Ba²⁺", c.Ba], ["Cl⁻", c.Cl], ["SO₄²⁻", c.SO4], ["NO₃⁻", c.NO3], ["HCO₃⁻/CO₃²⁻", (c.C || 0) * (1 - K.alphas(K.pK.c, Math.pow(10, -e.pH))[0])], ["CO₂(aq)", e.co2aq], ["CH₃COO⁻", (c.Ac || 0) * K.alphas(K.pK.ac, Math.pow(10, -e.pH))[1]]].filter(([, v]) => v > 1e-7);
        const h = has ? `<table class="l3-tbl lx-spec">${rows.map(([n, v]) => `<tr><td>${n}</td><td>${v.toExponential(2).replace("e", "·10^")} M</td></tr>`).join("")}${Object.entries(e.ppt).filter(([, v]) => v > 1e-5).map(([k, v]) => `<tr><td>↓ ${({ agcl: "AgCl", baso4: "BaSO₄", caco3: "CaCO₃", cuoh: "Cu(OH)₂", feoh: "Fe(OH)₃", casoap: "Ca(St)₂" })[k]}</td><td>${fmt(v, 3)} ${lang() === "en" ? "mmol" : "ммоль"}</td></tr>`).join("")}${S.gasCO2 > 1e-3 ? `<tr><td>↑ CO₂</td><td>${fmt(S.gasCO2, 2)} ${lang() === "en" ? "mmol" : "ммоль"}</td></tr>` : ""}${S.gasO2 > 1e-3 ? `<tr><td>↑ O₂</td><td>${fmt(S.gasO2, 2)} ${lang() === "en" ? "mmol" : "ммоль"}</td></tr>` : ""}</table>` : "";
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
    const list = sol ? AMT_S.map((a, i) => [i, (a < 1 ? L(TX.pinch) + " " : "") + fmt(a, a < 1 ? 1 : 0) + (lang() === "en" ? " g" : " г")]) : AMT_L.map((a, i) => [i, a < 0.1 ? L(TX.drop) : fmt(a, 0) + (lang() === "en" ? " mL" : " мл")]);
    const curI = sol ? (amtIx >= 1 ? 1 : 0) : amtIx;
    return list.map(([i, n]) => `<button type="button" class="chip ${i === curI ? "active" : ""}" data-amt="${i}">${esc(n)}</button>`).join("");
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
    const stp = r.s.map(([id, a]) => {
      if (id[0] === "@") { const tl = TOOLS.find((x) => x[0] === id.slice(1)); return `<li><i class="fa-solid ${tl[1]}" aria-hidden="true"></i> ${H(tl[2])} <button type="button" class="linkish" data-do="${id.slice(1)}">▶</button></li>`; }
      const rr = RID[id], sol = rr.k === "s";
      return `<li><span class="lx-dot sm ${sol ? "s" : ""}" style="--bc:${rr.col}" aria-hidden="true"></span> ${H(rr.n)} — ${sol ? fmt(a, a < 1 ? 1 : 0) + (lang() === "en" ? " g" : " г") : a < 0.1 ? H(TX.drop) : fmt(a, 0) + (lang() === "en" ? " mL" : " мл")} <button type="button" class="linkish" data-add="${id}" data-a="${a}" aria-label="${H(TX.start)}">▶</button></li>`;
    }).join("");
    return `<div class="lx-recb"><p class="small"><b>${H(TX.steps)}</b> · ${H(VES[r.v].n)}</p><ol>${stp}</ol><p class="small muted">💡 ${H(r.w)}</p></div>`;
  }
  function bindRecipes() {
    const box = ROOT.querySelector("[data-recs]"); if (!box) return;
    box.innerHTML = recipeHtml();
    box.querySelectorAll("[data-rec]").forEach((b) => b.addEventListener("click", () => {
      recipe = b.dataset.rec; const r = RECIPES.find((x) => x.id === recipe);
      resetVessel(r.v); syncVes(); bindRecipes();
      note(`${r.ic} ${L(r.n)}: ${L(t3("ҳар бир қадамдаги ▶ ни босинг", "нажимайте ▶ на каждом шаге", "press ▶ on each step"))}`);
    }));
    box.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => { selectR(b.dataset.add); add(b.dataset.add, +b.dataset.a); b.textContent = "✓"; }));
    box.querySelectorAll("[data-do]").forEach((b) => b.addEventListener("click", () => { tool(b.dataset.do); b.textContent = "✓"; }));
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

  function shell() {
    const isU = uni();
    ROOT.innerHTML = `<span class="pill">${H(TX.pill)}</span>
      <h2 class="section-title">${H(TX.title)}</h2>
      <p class="muted">${H(isU ? TX.leadU : TX.leadK)}</p>
      ${ppeHtml()}
      <div class="l3-row lx-row">
        <div class="l3-viewbox">
          <div class="l3-view lx-view" data-view><p class="l3-load">${H(TX.load)}</p></div>
          <div class="l3-tools">
            <button type="button" class="l3-tb" data-vt="in" title="+" aria-label="+"><i class="fa-solid fa-plus"></i></button>
            <button type="button" class="l3-tb" data-vt="out" title="−" aria-label="−"><i class="fa-solid fa-minus"></i></button>
            <button type="button" class="l3-tb" data-vt="home" title="${H(t3("Аввалги ҳолат", "Сброс вида", "Reset view"))}" aria-label="${H(t3("Аввалги ҳолат", "Сброс вида", "Reset view"))}"><i class="fa-solid fa-house"></i></button>
          </div>
          <p class="small muted l3-hint">${H(TX.hint)}</p>
        </div>
        <div class="lab-ctl lx-panel">
          <div class="lx-read">
            <div><small>pH</small><b data-ph>—</b><span class="lx-phbar" data-phbar><i></i></span></div>
            <div><small>T</small><b data-t>22 °C</b></div>
            <div><small>V</small><b data-v>0</b></div>
            <div><small>${H(t3("Ранг", "Цвет", "Colour"))}</small><span class="lx-sw" data-sw></span></div>
          </div>
          <div><small class="muted">${H(TX.obs)}</small><ul class="lx-obs" data-obs aria-live="polite"></ul></div>
          <div><small class="muted">${H(TX.vessel)}</small><div class="lx-chips">${Object.entries(VES).map(([k, v]) => `<button type="button" class="chip" data-ves="${k}" aria-pressed="false"><i class="fa-solid ${v.ic}" aria-hidden="true"></i> ${H(v.n)}</button>`).join("")}</div></div>
          <div><small class="muted">${H(TX.amount)}</small><div class="lx-chips" data-amts>${amtHtml()}</div></div>
          <div><small class="muted">${H(TX.tools)}</small><div class="lx-tools">${TOOLS.map(([k, ic, n]) => `<button type="button" class="lx-tool" data-tool="${k}" title="${H(n)}"><i class="fa-solid ${ic}" aria-hidden="true"></i><span>${H(n)}</span></button>`).join("")}</div></div>
          <div class="lx-waste" data-waste hidden></div>
          <ul class="lx-notes small" data-notes></ul>
          ${isU ? `<details class="lx-specd"><summary><b>${H(t3("Эритма таркиби (мувозанат)", "Состав раствора (равновесие)", "Solution composition (equilibrium)"))}</b></summary><div data-spec></div></details>` : ""}
        </div>
      </div>
      <div class="lx-shelfbox">
        <h3><i class="fa-solid fa-flask-vial" aria-hidden="true"></i> ${H(TX.shelf)}</h3>
        <div data-shelf>${shelfHtml()}</div>
        <div class="lx-info" data-info>${infoHtml()}</div>
      </div>
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
    ROOT.querySelectorAll("[data-vt]").forEach((b) => b.addEventListener("click", () => { if (!view) return; const t = b.dataset.vt; if (t === "in") view.zoom(0.85); if (t === "out") view.zoom(1.18); if (t === "home") view.resetView(); }));
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
    const bindAmt = () => ROOT.querySelectorAll("[data-amt]").forEach((b) => b.addEventListener("click", () => { amtIx = +b.dataset.amt; const am = ROOT.querySelector("[data-amts]"); am.innerHTML = amtHtml(); bindAmt(); }));
    bindShelf(); bindAmt();
    ROOT.querySelectorAll(".lx-tools [data-tool]").forEach((b) => b.addEventListener("click", () => tool(b.dataset.tool)));
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
    shell();
    const host = ROOT.querySelector("[data-view]");
    const L3 = window.EkoLab3D && window.EkoLab3D.lib;
    try {
      if (!L3) throw new Error("lib");
      const T = await L3.loadThree();
      if (my !== mountId) return;
      if (glFail) throw new Error("webgl");
      const narrow = (host.clientWidth || innerWidth) < 600;
      view = L3.View(host, { bg: "#e2e8f0", d: narrow ? 4.4 : 3.3, th: 0.25, ph: narrow ? 1.3 : 1.2, target: narrow ? [0.05, 1.3, -0.45] : [0.1, 1.25, -0.3], minD: 1.2, maxD: 8, auto: false });
      view.canvas.setAttribute("aria-label", L(TX.title));
      const lp = host.querySelector(".l3-load"); if (lp) lp.remove();
      build3d(view, { T, textSprite: L3.textSprite });
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
  function visible() { return SEC.classList.contains("page-on") && !document.hidden; }
  function sync() { if (!view) return; if (visible()) { view.resize(); view.start(); } else view.stop(); }
  function onShow() { if (!visible()) { sync(); return; } if (!built) { built = true; recompute(); mount(); } else sync(); }
  new MutationObserver(onShow).observe(SEC, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", onShow);
  window.addEventListener("eko:lang", () => { if (built) mount(); });
  window.addEventListener("eko:stage", () => { if (built) mount(); });
  /* Синов ва ўқитувчи намойиши учун */
  window.EkoLabXona = { get state() { return S; }, get eq() { return EQ; }, add: (id, a) => add(id, a), tool: (t) => tool(t), tick: (dt) => tick(dt), reset: (v) => resetVessel(v), ppe: (on) => { ppe = { coat: on, gog: on, glo: on }; putJ(PKEY, ppe); if (built) mount(); }, reagents: R.map((r) => r.id), get view() { return view; } };
  recompute();
  onShow();
})();
