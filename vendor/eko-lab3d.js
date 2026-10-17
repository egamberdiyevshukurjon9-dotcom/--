/* Экомун — 🧊 3D виртуал лаборатория (мактаб ва университет).
   Учта ўлчамли саҳна vendor/three (Three.js r170, MIT) билан чизилади ва
   бўлим биринчи марта очилганда юкланади; интернет керак эмас.
   Ҳар бир тажриба илмий формулага асосланган:
     🌍 иссиқхона самараси — ΔF = 5,35·ln(C/C₀) (Myhre ва бошқ., 1998), ΔT = S·ΔF/F₂ₓ (IPCC AR6);
     ⚛️ молекулалар — тебраниш модалари ва ИҚ фаоллиги (диполь моменти ўзгариши);
     💧 тиндиргич — Стокс қонуни ва Хазен назарияси (идеал тиндириш ҳавзаси);
     ☀️ қуёш панели — қуёш геометрияси (Cooper, 1969), Kasten–Young ҳаво массаси, Meinel модели;
     🌳 дарахт ва CO₂ — Chave ва бошқ. (2014) аллометрик тенгламаси, IPCC углерод улуши 0,47.
     🧪 пластикни саралаш — Архимед кучи F = (ρс − ρп)·V·g, полимер зичликлари (флотация, оғир муҳит);
     ⚙️ гранулалаш линияси — модда баланси W = m₁(w₁ − w₂)/(1 − w₂), буғланиш иссиқлиги Q = W·r
        (иккаласи ҳам Клинков ва бошқ. «Рециклинг и утилизация тары и упаковки», 2010–2014 асосида);
     🏭 тутун тарқалиши — Гаусс модели, Паскуилл синфлари, Briggs σy/σz (Пулатов ва бошқ. «Экологик мониторинг», 2026, 4-боб);
     🏞 дарё мониторинги — кузатув створлари (ўша дарслик, 6.3) ва Стритер–Фелпс кислород эгри чизиғи;
     🔺 экологик пирамида — Линдеман 10 % қоидаси (Нигматов, Пулатов «Экология», 2026, 2.1).
   Ҳар бир тажрибада «Қандай фойдаланилади?» йўриқномаси бор (HOW).
   Матнлар uz/ru/en кўринишида шу файлда; лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const SEC = document.getElementById("lab3d");
  const ROOT = document.getElementById("l3Root");
  if (!SEC || !ROOT) return;

  /* ---------- Тил, формат, ёрдамчилар ---------- */
  /* EkoLang — index.html даги умумий const (window хусусияти эмас) */
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
  const fmt = (v, d = 1) => {
    if (!isFinite(v)) return "—";
    const s = Math.abs(v) >= 10000 ? Math.round(v).toLocaleString("en-US").replace(/,/g, " ") : v.toFixed(d);
    return lang() === "en" ? s : s.replace(".", ",");
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const DEG = Math.PI / 180;
  const stage = () => (window.EkoProfile && EkoProfile.stage) || "uni";
  const App = () => window.EkoApp;
  const flags = () => { const a = App(); if (!a) return {}; a.state.flags = a.state.flags || {}; return a.state.flags; };
  const once = (k, n, why) => { const a = App(); if (!a) return; const f = flags(); if (!f[k]) { f[k] = true; a.addXp(n, why); } };
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Умумий матнлар ---------- */
  const TX = {
    pill: { uz: "🧊 3D лаборатория · мактаб ва университет", ru: "🧊 3D-лаборатория · школа и университет", en: "🧊 3D lab · school and university" },
    pillK: { uz: "🧊 3D лаборатория · мактаб босқичи", ru: "🧊 3D-лаборатория · школьный этап", en: "🧊 3D lab · school stage" },
    pillU: { uz: "🧊 3D лаборатория · университет босқичи", ru: "🧊 3D-лаборатория · университетский этап", en: "🧊 3D lab · university stage" },
    title: { uz: "3D виртуал лаборатория", ru: "3D виртуальная лаборатория", en: "3D virtual laboratory" },
    leadK: { uz: "Ер, молекула ва сувни уч ўлчамда кўринг: бармоқ билан айлантиринг, сурилмаларни суринг ва нима бўлишини кузатинг. Ҳар бир тажриба учун +5 XP.", ru: "Посмотрите на Землю, молекулы и воду в трёх измерениях: вращайте пальцем, двигайте ползунки и наблюдайте. За каждый опыт +5 XP.", en: "See the Earth, molecules and water in 3D: rotate with your finger, move the sliders and watch what happens. +5 XP for each experiment." },
    leadU: { uz: "Илмий моделларга асосланган 3D тажрибалар: параметрларни ўзгартиринг, саҳнани айлантириб кузатинг, формулани текширинг ва амалий топшириқни ечинг (+10 XP).", ru: "3D-опыты на основе научных моделей: меняйте параметры, вращайте сцену, проверяйте формулу и решайте практическое задание (+10 XP).", en: "3D experiments built on scientific models: change parameters, rotate the scene, check the formula and solve the practical task (+10 XP)." },
    hint: { uz: "🖱 Суриб айлантиринг · ＋/− яқинлаштириш", ru: "🖱 Тяните для вращения · ＋/− масштаб", en: "🖱 Drag to rotate · ＋/− zoom" },
    load: { uz: "3D саҳна юкланмоқда…", ru: "Загрузка 3D-сцены…", en: "Loading the 3D scene…" },
    noGl: { uz: "Бу қурилмада 3D (WebGL) ишламади. Браузерни янгилаб кўринг ёки бошқа қурилмадан очинг. Тажриба ҳисоб-китоблари пастда ишлайверади.", ru: "На этом устройстве 3D (WebGL) не запустился. Обновите браузер или откройте на другом устройстве. Расчёты ниже работают.", en: "3D (WebGL) did not start on this device. Update the browser or try another device. The calculations below still work." },
    rot: { uz: "Айланиш", ru: "Вращение", en: "Rotate" },
    reset: { uz: "Аввалги ҳолат", ru: "Сброс вида", en: "Reset view" },
    zin: { uz: "Яқинлаштириш", ru: "Приблизить", en: "Zoom in" },
    zout: { uz: "Узоқлаштириш", ru: "Отдалить", en: "Zoom out" },
    view: { uz: "3D кўриниш", ru: "3D-вид", en: "3D view" },
    task: { uz: "📝 Амалий машғулот", ru: "📝 Практическое занятие", en: "📝 Practical task" },
    check: { uz: "Текшириш", ru: "Проверить", en: "Check" },
    ans: { uz: "Жавоб", ru: "Ответ", en: "Answer" },
    done: { uz: "✅ Бу топшириқни бажаргансиз.", ru: "✅ Вы уже выполнили это задание.", en: "✅ You have completed this task." },
    ok: { uz: "✅ Тўғри! Жавоб ≈ ", ru: "✅ Верно! Ответ ≈ ", en: "✅ Correct! Answer ≈ " },
    no: { uz: "❌ Ҳали эмас. Маслаҳат: ", ru: "❌ Пока нет. Подсказка: ", en: "❌ Not yet. Hint: " },
    src: { uz: "📎 Манба: ", ru: "📎 Источник: ", en: "📎 Source: " },
    mission: { uz: "⭐ Вазифа", ru: "⭐ Задание", en: "⭐ Mission" },
    star: { uz: "⭐ Вазифа бажарилди! +5 XP", ru: "⭐ Задание выполнено! +5 XP", en: "⭐ Mission complete! +5 XP" },
    why: "3D лаборатория тажрибаси",
    whyU: "3D лаборатория амалий машғулоти",
    method: { uz: "Қандай илмий асос ва усул ишлатилган?", ru: "Какая научная основа и методика?", en: "What science and methods are used?" }
  };
  const METHODS = [
    ["🧊", { uz: "Виртуал лаборатория (PhET, Колорадо университети)", ru: "Виртуальная лаборатория (PhET, Университет Колорадо)", en: "Virtual lab (PhET, University of Colorado)" }, { uz: "Кўринмас жараёнларни (фотон, молекула тебраниши) кўринадиган қилади; хавфсиз ва бепул.", ru: "Делает невидимое (фотоны, колебания молекул) видимым; безопасно и бесплатно.", en: "Makes invisible processes (photons, molecular vibrations) visible; safe and free." }],
    ["🔁", { uz: "5E модели (BSCS, АҚШ)", ru: "Модель 5E (BSCS, США)", en: "5E model (BSCS, USA)" }, { uz: "Қизиқтириш → тадқиқ қилиш → тушунтириш → кенгайтириш → баҳолаш: ҳар бир тажриба шу тартибда.", ru: "Вовлечение → исследование → объяснение → расширение → оценка: каждый опыт построен так.", en: "Engage → explore → explain → elaborate → evaluate: every experiment follows this order." }],
    ["🧮", { st: "uni", uz: "Модель асосидаги таълим (Modeling Instruction)", ru: "Обучение через модели (Modeling Instruction)", en: "Modeling Instruction" }, { uz: "Университет режимида формула ва параметрлар очиқ: талаба моделни ўзи синайди ва чегараларини кўради.", ru: "В университетском режиме формулы открыты: студент сам проверяет модель и её границы.", en: "In university mode formulas are open: students test the model and its limits." }],
    ["⏯️", { uz: "Вақт бошқаруви ва «яширин йўналтириш» (PhET)", ru: "Управление временем и «скрытые подсказки» (PhET)", en: "Time controls and implicit scaffolding (PhET)" }, { uz: "Пауза, қадам ва секин/тез тугмалари жараённи босқичма-босқич кузатишга ёрдам беради; интерфейснинг ўзи кейинги қадамга йўналтиради.", ru: "Пауза, шаг и замедление/ускорение помогают наблюдать процесс по шагам; сам интерфейс подсказывает следующий шаг.", en: "Pause, step and slow/fast buttons let learners follow a process step by step; the interface itself hints at the next move." }],
    ["🧪", { uz: "Очиқ виртуал лабораториялар: ChemCollective, Open Source Physics, Labster", ru: "Открытые виртуальные лаборатории: ChemCollective, Open Source Physics, Labster", en: "Open virtual labs: ChemCollective, Open Source Physics, Labster" }, { uz: "Улардан ғоялар олинди (эркин аралаштириш, ўлчов журнали, сценарийли вазифалар); моделлар ва код Экомуннинг ўзиники.", ru: "Взяты идеи (свободное смешивание, журнал измерений, сценарные задания); модели и код — Экомуна.", en: "Ideas borrowed (free mixing, measurement log, scenario missions); models and code are Ekomun's own." }],
    ["🎮", { st: "maktab", uz: "Ўйин орқали ўрганиш (мактаб)", ru: "Обучение через игру (школа)", en: "Game-based learning (school)" }, { uz: "Ҳар бир тажрибада юлдузли вазифа ва XP; хато қилиш мумкин, қайта уриниш бепул.", ru: "В каждом опыте задание со звездой и XP; ошибаться можно, повтор бесплатный.", en: "Every experiment has a star mission and XP; mistakes are fine, retries are free." }]
  ];

  /* ---------- Фойдаланиш йўриқномаси: ҳар бир тажриба учун қадамлар (k — мактаб, u — университет) ---------- */
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const HOW = {
    issiq: {
      k: [t3("Пастдаги 5 та даврдан бирини босинг: музлик даври, бугун, 2100 йил…", "Нажмите одну из 5 эпох внизу: ледниковый период, сегодня, 2100 год…", "Press one of the 5 eras below: ice age, today, year 2100…"), t3("Саҳнада сариқ нур Қуёшдан келади, қизил нур Ердан қайтади — қанчаси космосга қочишини кузатинг.", "В сцене жёлтые лучи идут от Солнца, красные — от Земли; смотрите, сколько уходит в космос.", "Yellow rays come from the Sun, red ones leave the Earth; watch how many escape to space."), t3("Ер ҳароратини (катта рақам) даврлар бўйича солиштиринг.", "Сравните температуру Земли (большое число) по эпохам.", "Compare Earth's temperature (the big number) across eras.")],
      u: [t3("CO₂ сурилмасини 180–1200 ppm оралиғида суринг ва радиацион мажбурлаш ΔF ни кузатинг.", "Двигайте ползунок CO₂ от 180 до 1200 ppm и следите за радиационным воздействием ΔF.", "Move the CO₂ slider from 180 to 1200 ppm and watch the radiative forcing ΔF."), t3("Иқлим сезгирлиги S ни 2–5 °C оралиғида ўзгартириб, мувозанат исиши ΔT қанча ноаниқ эканини баҳоланг.", "Меняйте чувствительность S от 2 до 5 °C и оцените неопределённость равновесного потепления ΔT.", "Vary sensitivity S between 2 and 5 °C to see how uncertain the equilibrium warming ΔT is."), t3("Формулани қўлда текширинг ва пастдаги амалий машғулотни ечинг.", "Проверьте формулу вручную и решите практическое задание внизу.", "Check the formula by hand and solve the practical task below.")]
    },
    molekula: {
      k: [t3("Юқоридаги тугмалардан газни танланг: CO₂, CH₄, H₂O, N₂, O₂…", "Выберите газ кнопками сверху: CO₂, CH₄, H₂O, N₂, O₂…", "Pick a gas with the buttons on top: CO₂, CH₄, H₂O, N₂, O₂…"), t3("Тебраниш турини танланг ва «ИҚ нур юбориш» тугмасини босинг.", "Выберите тип колебания и нажмите «Послать ИК-луч».", "Choose a vibration type and press “Send an IR ray”."), t3("Нур ютилдими ёки ўтиб кетдими — қизил 🔴 белги иссиқлик ушловчи газни кўрсатади.", "Луч поглощён или прошёл? Красный 🔴 значок означает газ, удерживающий тепло.", "Was the ray absorbed or did it pass? The red 🔴 mark shows a heat-trapping gas.")],
      u: [t3("Молекула ва тебраниш модасини танланг (эгилиш, симметрик ёки носимметрик чўзилиш) — тўлқин сони см⁻¹ да кўрсатилади.", "Выберите молекулу и моду (деформационная, симметричная или антисимметричная) — волновое число дано в см⁻¹.", "Choose a molecule and mode (bending, symmetric or asymmetric stretch) — the wavenumber is shown in cm⁻¹."), t3("«ИҚ нур юбориш» билан текширинг: диполь (кўк ўқ) ўзгарса, мода ИҚ фаол.", "Проверьте кнопкой «Послать ИК-луч»: если диполь (голубая стрелка) меняется, мода ИК-активна.", "Test with “Send an IR ray”: if the dipole (blue arrow) changes, the mode is IR-active."), t3("Жадвалдан ҳаводаги улуш, GWP-100 ва атмосферада яшаш вақтини солиштиринг.", "Сравните по таблице долю в воздухе, GWP-100 и время жизни в атмосфере.", "Compare share in air, GWP-100 and atmospheric lifetime in the table.")]
    },

    tindir: {
      k: [t3("Заррача турини танланг: йирик қум, майда қум, чанг ёки гил.", "Выберите частицы: крупный песок, мелкий песок, пыль или глину.", "Choose particles: coarse sand, fine sand, silt or clay."), t3("Сув оқимини секин ёки тез қилинг ва заррачалар тубга етиб улгуришини кузатинг.", "Сделайте поток медленным или быстрым и смотрите, успевают ли частицы осесть.", "Make the flow slow or fast and watch whether particles reach the bottom."), t3("Гил чўкмаса, коагулянт қўшиб кўринг — катта рақам «тозаланди» фоизини кўрсатади.", "Если глина не оседает, добавьте коагулянт — большое число покажет процент очистки.", "If clay will not settle, add coagulant — the big number shows the percent removed.")],
      u: [t3("Заррача диаметри d ва зичлиги ρₚ ни беринг — Стокс тезлиги vₛ ҳисобланади.", "Задайте диаметр d и плотность ρₚ — рассчитается скорость Стокса vₛ.", "Set diameter d and density ρₚ — Stokes velocity vₛ is computed."), t3("Сув сарфи Q ни ўзгартириб, юза юкламаси q₀ ва самарадорлик E = vₛ/q₀ қандай ўзгаришини кузатинг.", "Меняйте расход Q и следите за поверхностной нагрузкой q₀ и эффективностью E = vₛ/q₀.", "Change flow Q and follow the surface loading q₀ and efficiency E = vₛ/q₀."), t3("Re > 1 огоҳлантиришига эътибор беринг ва амалий машғулотни ечинг.", "Обратите внимание на предупреждение Re > 1 и решите задание.", "Watch for the Re > 1 warning and solve the task.")]
    },
    quyosh: {
      k: [t3("Санани танланг: 21 март, 21 июнь, 23 сентябрь ёки 21 декабрь.", "Выберите дату: 21 марта, 21 июня, 23 сентября или 21 декабря.", "Pick a date: 21 March, 21 June, 23 September or 21 December."), t3("Панел қиялиги ва йўналиши сурилмаларини суринг; ▶ «Кун ўтиши» Қуёшни осмонда юргизади.", "Двигайте ползунки наклона и направления панели; ▶ «Ход дня» ведёт Солнце по небу.", "Move the tilt and direction sliders; ▶ “Day cycle” moves the Sun across the sky."), t3("Кунлик энергия (кВт·соат) энг яхши ҳолатнинг 95 % идан ошишига эришинг.", "Добейтесь, чтобы энергия за день (кВт·ч) превысила 95 % от наилучшей.", "Get the daily energy (kWh) above 95% of the best possible.")],
      u: [t3("Санани ва панелнинг қиялиги β ҳамда йўналишини (жанубдан, °) беринг.", "Задайте дату, наклон β и направление панели (от юга, °).", "Set the date, tilt β and panel direction (from south, °)."), t3("Қуёш баландлиги, тушиш бурчаги ва кунлик энергия Тошкент (41,3° ш.к.) учун ҳисобланади — энг яхши ҳолат билан солиштиринг.", "Высота Солнца, угол падения и суточная энергия рассчитываются для Ташкента (41,3° с. ш.) — сравните с наилучшим положением.", "Solar elevation, incidence angle and daily energy are computed for Tashkent (41.3° N) — compare with the best setting."), t3("Фаслга қараб энг яхши қиялик қандай ўзгаришини ёзиб олинг ва машғулотни ечинг.", "Запишите, как оптимальный наклон меняется по сезонам, и решите задание.", "Note how the best tilt changes by season and solve the task.")]
    },

    daraxt: {
      k: [t3("Оролча устига босинг — ҳар босишда битта дарахт экилади, «+10» тугмаси тез экади.", "Нажимайте на остров — каждое нажатие сажает дерево, кнопка «+10» сажает быстрее.", "Tap the island to plant a tree; the “+10” button plants faster."), t3("Завод тутуни камайишини ва фоиз чизиғи тўлишини кузатинг.", "Смотрите, как уменьшается дым завода и заполняется полоска процентов.", "Watch the factory smoke fade and the percent bar fill up."), t3("Бир одамнинг изини қоплаш учун нечта дарахт кераклигини билиб олинг.", "Узнайте, сколько деревьев нужно, чтобы покрыть след одного человека.", "Find out how many trees offset one person's footprint.")],
      u: [t3("Битта дарахтнинг диаметри D, баландлиги H ва ёғоч зичлиги ρ ни беринг.", "Задайте диаметр D, высоту H и плотность древесины ρ одного дерева.", "Set one tree's diameter D, height H and wood density ρ."), t3("Chave (2014) аллометрик тенгламаси бўйича биомасса, углерод ва CO₂ ҳисобланади.", "По аллометрическому уравнению Chave (2014) рассчитываются биомасса, углерод и CO₂.", "Biomass, carbon and CO₂ are computed with the Chave (2014) allometric equation."), t3("Натижани ўрмонзор лойиҳаси ёки углерод изи ҳисобида ишлатинг.", "Используйте результат в проекте лесопосадки или в расчёте углеродного следа.", "Use the result in a tree-planting project or a carbon-footprint calculation.")]
    },
    flotatsiya: {
      k: [t3("Суюқликни танланг: спиртли сув, сув ёки тузли сув.", "Выберите жидкость: водно-спиртовую смесь, воду или солёную воду.", "Choose the liquid: alcohol–water, water or salt water."), t3("Қайси пластиклар сузиши ва қайсилари чўкишини кузатинг; «Аралаштириш» тугмаси бўлакларни қайта сочади.", "Смотрите, какие пластики всплывают, а какие тонут; кнопка «Перемешать» снова разбрасывает кусочки.", "Watch which plastics float and which sink; “Stir” scatters the pieces again."), t3("ПС стаканни ПЭТ бутилкадан ажратадиган суюқликни топинг.", "Найдите жидкость, которая отделит стаканчики ПС от бутылок ПЭТ.", "Find the liquid that separates PS cups from PET bottles.")],
      u: [t3("Суюқлик зичлиги ρc ни сурилма ёки тайёр эритмалар билан беринг.", "Задайте плотность жидкости ρж ползунком или готовыми растворами.", "Set liquid density ρl with the slider or the ready solutions."), t3("Жадвалда ҳар бир полимер учун натижавий куч F = (ρc − ρп)·V·g ни ўқинг: F > 0 — сузади.", "Читайте в таблице результирующую силу F = (ρж − ρп)·V·g для каждого полимера: F > 0 — всплывает.", "Read the net force F = (ρl − ρp)·V·g for each polymer in the table: F > 0 means it floats."), t3("ПЭТ ва ПВХ нега флотацияда ажралмаслигини тушунтиринг ва машғулотни ечинг.", "Объясните, почему ПЭТ и ПВХ не разделяются флотацией, и решите задание.", "Explain why PET and PVC cannot be separated by flotation and solve the task.")]
    },

    liniya: {
      k: [t3("Линиядаги машиналарни босиб ёқинг ёки ўчиринг.", "Нажимайте на машины линии, чтобы включать и выключать их.", "Tap machines on the line to switch them on or off."), t3("Бирор машина ўчса, гранула сифати қандай бузилишини кузатинг.", "Смотрите, как портится качество гранул, если машина выключена.", "Watch how pellet quality drops when a machine is off."), t3("3 та машинани навбат билан синаб, кейин ҳаммасини ёқиб «А сифат» гранула олинг.", "Испытайте по очереди 3 машины, затем включите все и получите гранулы «качества А».", "Try 3 machines one by one, then switch all on to get grade A pellets.")],
      u: [t3("Қуруқ хомашё G, аралашма улуши x ва центрифугадан кейинги намлик w₁ ни беринг.", "Задайте сухое сырьё G, долю примесей x и влажность после центрифуги w₁.", "Set dry feed G, impurity share x and moisture after the centrifuge w₁."), t3("Модда баланси W = m₁(w₁ − w₂)/(1 − w₂) ва буғланиш иссиқлиги Q = W·r ни кузатинг.", "Следите за материальным балансом W = m₁(w₁ − w₂)/(1 − w₂) и теплом испарения Q = W·r.", "Follow the mass balance W = m₁(w₁ − w₂)/(1 − w₂) and evaporation heat Q = W·r."), t3("Қуритгич қувватини баҳоланг ва машғулотни ечинг.", "Оцените мощность сушилки и решите задание.", "Estimate the dryer power and solve the task.")]
    },

    tutun: {
      k: [t3("Мўри баландлигини ва шамолни танланг.", "Выберите высоту трубы и ветер.", "Choose the stack height and the wind."), t3("Ер рангига қаранг: яшил — тоза, қизил — ифлос ҳаво; 🏘 қишлоқ қаерда эканини топинг.", "Смотрите на цвет земли: зелёный — чисто, красный — грязно; найдите посёлок 🏘.", "Look at the ground colour: green is clean, red is polluted; find the village 🏘."), t3("Фильтр қўйиб ёки мўрини баланд қилиб, қишлоқ ҳавосини тозаланг.", "Очистите воздух в посёлке фильтром или высокой трубой.", "Clean the village air with a filter or a taller stack.")],
      u: [t3("Чиқинди Q, шамол u, самарали баландлик h ва Паскуилл синфини беринг.", "Задайте выброс Q, ветер u, эффективную высоту h и класс Паскуилла.", "Set emission Q, wind u, effective height h and the Pasquill class."), t3("Ер сатҳидаги концентрация харитасини ва Cmax масофасини кузатинг; уни ЧММ билан солиштиринг.", "Следите за картой приземной концентрации и расстоянием до Cmax; сравните с ПДК.", "Follow the ground-level concentration map and the distance of Cmax; compare with the limit."), t3("Мониторинг постини (қишлоқни) Cmax жойига қўйиб, амалий машғулотни ечинг.", "Поставьте пост мониторинга (посёлок) в точку Cmax и решите задание.", "Place the monitoring post (village) at Cmax and solve the task.")]
    },
    daryo: {
      k: [t3("Дарё рангини кузатинг: кўк — кислород кўп, жигарранг — кам.", "Смотрите на цвет реки: синий — кислорода много, коричневый — мало.", "Watch the river colour: blue means lots of oxygen, brown means little."), t3("Ҳароратни ўзгартиринг ва заводга тозалаш иншооти қуриб кўринг.", "Меняйте температуру и постройте у завода очистные сооружения.", "Change the temperature and build a treatment plant at the factory."), t3("Балиқлар сонини санаб, ҳаммасини хурсанд қилинг.", "Посчитайте рыб и сделайте их всех довольными.", "Count the fish and make them all happy.")],
      u: [t3("Дарё ва оқова сув сарфи, БКИ₅, оқим тезлиги ва ҳароратни беринг.", "Задайте расходы реки и сточных вод, БПК₅, скорость течения и температуру.", "Set river and wastewater flows, BOD₅, velocity and temperature."), t3("Учта створни дарслик қоидаси бўйича жойлаштиринг: фон — 1 км юқорида, назорат — 80 % аралашган жойда (жадвалда ✅).", "Расставьте три створа по правилу учебника: фоновый — в 1 км выше, контрольный — где смешение ≥ 80 % (✅ в таблице).", "Place three sections by the textbook rule: background 1 km upstream, control where mixing ≥ 80% (✅ in the table)."), t3("Чуқурликка қараб горизонтлар сонини ва кислород энг кам бўлган масофани аниқланг; машғулотни ечинг.", "Определите число горизонтов по глубине и расстояние минимума кислорода; решите задание.", "Find the number of sampling depths and the distance of minimum oxygen; solve the task.")]
    },
    ph: {
      k: [t3("Юқоридан моддани танланг: лимон, ёмғир, сут, совун…", "Выберите вещество сверху: лимон, дождь, молоко, мыло…", "Pick a substance on top: lemon, rain, milk, soap…"), t3("Қизил шарчалар — кислота (H₃O⁺), кўклари — ишқор (OH⁻). Қайси бири кўп?", "Красные шарики — кислота (H₃O⁺), синие — щёлочь (OH⁻). Каких больше?", "Red balls are acid (H₃O⁺), blue ones are alkali (OH⁻). Which are more?"), t3("Сув қўшиб, ранг ва pH қандай ўзгаришини кузатинг.", "Добавляйте воду и смотрите, как меняются цвет и pH.", "Add water and watch the colour and pH change.")],
      u: [t3("Эритмани танланг ва сув қўшиш сурилмасини суринг.", "Выберите раствор и двигайте ползунок воды.", "Choose a solution and move the water slider."), t3("10 марта суюлтиришда pH қанча ўзгаришини графикдан ўлчанг.", "Измерьте по графику, как меняется pH при 10-кратном разбавлении.", "Use the graph to measure the pH change for a 10-fold dilution."), t3("Нега pH 7 дан ўтмаслигини тушунтиринг; машғулотни ечинг.", "Объясните, почему pH не переходит 7; решите задание.", "Explain why the pH never crosses 7; solve the task.")]
    },
    yirtqich: {
      k: [t3("Пастдаги вақт тугмалари билан симуляцияни тезлаштиринг ёки тўхтатинг.", "Ускоряйте или останавливайте модель кнопками времени.", "Speed up or pause the model with the time buttons."), t3("🐇 ва 🦊 қўшинг ёки «Ов» тугмасини босиб, нима бўлишини кузатинг.", "Добавляйте 🐇 и 🦊 или нажмите «Охота» и наблюдайте.", "Add 🐇 and 🦊 or press “Hunt” and watch."), t3("Графикда тўлқинлар: аввал қуёнлар, кейин тулкилар кўпаяди.", "На графике волны: сначала растут зайцы, потом лисы.", "The graph shows waves: rabbits rise first, then foxes.")],
      u: [t3("α, β, γ, δ параметрларини ўзгартиринг ва фаза силжишини кузатинг.", "Меняйте α, β, γ, δ и наблюдайте сдвиг фаз.", "Change α, β, γ, δ and watch the phase shift."), t3("Мувозанат x* = γ/δ, y* = α/β ни ҳисобланг ва бошланғич қийматни унга яқин қўйинг.", "Вычислите равновесие x* = γ/δ, y* = α/β и задайте близкие начальные значения.", "Compute x* = γ/δ, y* = α/β and start near it."), t3("Модель чекловларини муҳокама қилинг (ўт ресурси йўқ, тасодифийлик йўқ).", "Обсудите ограничения модели (нет ресурса травы, нет случайности).", "Discuss the model's limits (no grass resource, no randomness).")]
    },
    piramida: {
      k: [t3("Жонзотларни тартиб билан босинг: ўсимликдан бошланг, кейин уни ким ейди?", "Нажимайте живых существ по порядку: начните с растения, а кто его ест?", "Tap the living things in order: start with the plant — who eats it?"), t3("Пирамида қаватлари қандай кичрайиб боришини кузатинг.", "Смотрите, как уменьшаются этажи пирамиды.", "Watch the pyramid floors get smaller."), t3("Сариқ учқун — энергия, қизили — иссиқлик бўлиб йўқолган энергия.", "Жёлтая искра — энергия, красная — энергия, потерянная в виде тепла.", "Yellow sparks are energy; red ones are energy lost as heat.")],
      u: [t3("Продуцентлар энергияси, экологик самарадорлик η ва поғоналар сонини беринг.", "Задайте энергию продуцентов, экологическую эффективность η и число уровней.", "Set producer energy, ecological efficiency η and the number of levels."), t3("Ҳар бир поғонадаги энергияни жадвалдан ўқинг ва иссиқлик йўқотилишини ҳисобланг.", "Читайте энергию каждого уровня в таблице и рассчитайте потери тепла.", "Read each level's energy from the table and work out the heat loss."), t3("Нега озиқ занжирлари одатда 4–5 поғонадан узун бўлмаслигини тушунтиринг; машғулотни ечинг.", "Объясните, почему пищевые цепи редко длиннее 4–5 звеньев; решите задание.", "Explain why food chains rarely exceed 4–5 links; solve the task.")]
    }
  };
  const GUIDE = [
    ["fa-hand-pointer", t3("Тажрибани танланг", "Выберите опыт", "Pick an experiment"), t3("Юқоридаги тугмалардан", "Кнопками сверху", "Using the buttons above")],
    ["fa-rotate", t3("Саҳнани айлантиринг", "Вращайте сцену", "Rotate the scene"), t3("Бармоқ ёки сичқонча билан; ＋/− яқинлаштиради", "Пальцем или мышью; ＋/− масштаб", "Finger or mouse; ＋/− to zoom")],
    ["fa-sliders", t3("Параметрни ўзгартиринг", "Меняйте параметры", "Change parameters"), t3("Ўнгдаги панелда — натижа дарров ўзгаради", "На панели справа — результат меняется сразу", "In the side panel — results update instantly")],
    ["fa-star", t3("Вазифани бажаринг", "Выполните задание", "Complete the task"), { k: t3("⭐ Вазифани бажаринг — XP берилади", "⭐ Выполните задание — получите XP", "⭐ Complete the star mission to earn XP"), u: t3("📝 Амалий машғулотни бажаринг — XP берилади", "📝 Выполните практическое задание — получите XP", "📝 Complete the practical task to earn XP"), x: t3("Мактабда ⭐ вазифа, университетда 📝 машғулот — XP берилади", "В школе ⭐ задание, в вузе 📝 практика — даётся XP", "School ⭐ missions, university 📝 tasks — earn XP") }]
  ];
  const HOWT = {
    title: t3("📖 Бу тажрибадан қандай фойдаланилади?", "📖 Как пользоваться этим опытом?", "📖 How to use this experiment"),
    guide: t3("Лабораториядан фойдаланиш — 4 қадам", "Как работать в лаборатории — 4 шага", "Using the lab — 4 steps"),
    teach: t3("👩‍🏫 Ўқитувчи учун: тажрибани проекторда кўрсатинг, аввал ўқувчилардан «нима бўлади?» деб тахмин сўранг, кейин параметрни ўзгартиринг (5E модели).", "👩‍🏫 Для учителя: покажите опыт на проекторе, сначала спросите «что произойдёт?», затем меняйте параметр (модель 5E).", "👩‍🏫 For teachers: show the experiment on a projector, ask students to predict ‘what will happen?’ first, then change the parameter (5E model).")
  };

  /* ---------- Three.js юклаш ---------- */
  let THREE = null, threeP = null;
  function loadThree() {
    if (!threeP) threeP = import("/vendor/three/three.module.min.js").then((m) => (THREE = m));
    return threeP;
  }

  /* ---------- 3D кўрувчи: рендер, камера, айлантириш ---------- */
  class View {
    constructor(host, opts = {}) {
      const T = THREE;
      this.host = host;
      /* Тежамкор трафик режимида (eko-yol.js) 3D енгилроқ: антиалиассиз ва пиксел зичлиги 1 */
      const lite = !!(window.EkoModes && window.EkoModes.lite);
      this.renderer = new T.WebGLRenderer({ antialias: !lite, alpha: false, powerPreference: "low-power" });
      this.renderer.setPixelRatio(lite ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      this.canvas = this.renderer.domElement;
      this.canvas.className = "l3-canvas";
      this.canvas.tabIndex = 0;
      this.canvas.setAttribute("role", "img");
      host.appendChild(this.canvas);
      this.scene = new T.Scene();
      this.scene.background = new T.Color(opts.bg || "#0b1324");
      this.camera = new T.PerspectiveCamera(45, 4 / 3, 0.05, 200);
      this.target = new T.Vector3(...(opts.target || [0, 0, 0]));
      this.home = { th: opts.th ?? 0.6, ph: opts.ph ?? 1.15, d: opts.d ?? 4 };
      Object.assign(this, { th: this.home.th, ph: this.home.ph, d: this.home.d });
      this.minD = opts.minD || 1.5; this.maxD = opts.maxD || 14;
      this.auto = !reduce && opts.auto !== false;
      this.updaters = [];
      /* Вақт бошқаруви (PhET услубида): пауза, қадам, секин/тез */
      this.speed = 1; this.paused = false; this.st = 0;
      this.running = false; this.raf = 0; this.last = 0; this.t = 0;
      this.scene.add(new T.HemisphereLight(0xffffff, 0x334155, 1.1));
      const sun = new T.DirectionalLight(0xffffff, 1.6);
      sun.position.set(5, 8, 6);
      this.scene.add(sun);
      this.bindInput();
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(host);
      /* Кириш анимацияси: камера узоқдан айланиб, саҳнага «учиб киради» */
      if (!reduce) { this.fly = { t: 0, d0: this.d * 1.9, th0: this.th - 1.1, ph0: Math.max(0.3, this.ph - 0.45) }; Object.assign(this, { d: this.fly.d0, th: this.fly.th0, ph: this.fly.ph0 }); }
      this.resize();
      this.place();
    }
    bindInput() {
      const c = this.canvas, pts = new Map();
      let lx = 0, ly = 0;
      c.addEventListener("pointerdown", (e) => {
        pts.set(e.pointerId, e); lx = e.clientX; ly = e.clientY; this.moved = 0;
        if (e.pointerType === "mouse") c.setPointerCapture(e.pointerId);
      });
      c.addEventListener("pointermove", (e) => {
        if (!pts.has(e.pointerId)) return;
        const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
        this.moved += Math.abs(dx) + Math.abs(dy); this.fly = null;
        this.th -= dx * 0.008;
        if (e.pointerType === "mouse") this.ph = clamp(this.ph - dy * 0.008, 0.15, 1.52);
        this.auto = false; this.syncAuto(); this.place();
      });
      const up = (e) => { pts.delete(e.pointerId); };
      c.addEventListener("pointerup", (e) => { up(e); if (this.moved < 6) { if (this.tool && this.tool(e)) return; if (this.onTap) this.onTap(e); } });
      c.addEventListener("pointercancel", up);
      c.addEventListener("wheel", (e) => { e.preventDefault(); this.zoom(e.deltaY > 0 ? 1.1 : 0.9); }, { passive: false });
      c.addEventListener("keydown", (e) => {
        const k = { ArrowLeft: [0.12, 0], ArrowRight: [-0.12, 0], ArrowUp: [0, 0.08], ArrowDown: [0, -0.08] }[e.key];
        if (k) { e.preventDefault(); this.fly = null; this.th += k[0]; this.ph = clamp(this.ph + k[1], 0.15, 1.52); this.auto = false; this.syncAuto(); this.place(); }
        if (e.key === "+" || e.key === "=") this.zoom(0.9);
        if (e.key === "-") this.zoom(1.1);
      });
    }
    syncAuto() { if (this.autoBtn) this.autoBtn.classList.toggle("on", this.auto); }
    /* Экрандаги нуқта остидаги биринчи 3D объект (ўлчов асбоби ва зонд учун) */
    pick(e, objs) {
      const T = THREE, r = this.canvas.getBoundingClientRect();
      this.ray = this.ray || new T.Raycaster();
      this.ray.setFromCamera(new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), this.camera);
      const hits = this.ray.intersectObjects(objs || this.scene.children, true).filter((h) => h.object.visible && !h.object.isSprite && !h.object.isPoints && !h.object.isLine && !(h.object.userData && h.object.userData.noPick));
      return hits[0] || null;
    }
    /* Расм олиш: шу кадрни қайта чизиб PNG қилиш */
    snapshot() { this.render(); return this.canvas.toDataURL("image/png"); }
    /* Пауза пайтида битта қадам (1/30 с) */
    stepOnce() { const h = 1 / 30 * this.speed; this.st += h; this.updaters.forEach((f) => f(h, this.st)); this.render(); }
    zoom(f) { this.fly = null; this.d = clamp(this.d * f, this.minD, this.maxD); this.place(); }
    resetView() { this.fly = null; Object.assign(this, { th: this.home.th, ph: this.home.ph, d: this.home.d }); this.place(); }
    place() {
      const s = Math.sin(this.ph);
      this.camera.position.set(this.target.x + this.d * s * Math.sin(this.th), this.target.y + this.d * Math.cos(this.ph), this.target.z + this.d * s * Math.cos(this.th));
      this.camera.lookAt(this.target);
      if (!this.running) this.render();
    }
    resize() {
      const w = this.host.clientWidth || 320, h = this.host.clientHeight || 240;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.render();
    }
    render() {
      const r = this.renderer;
      if (!this.stereo || (r.xr && r.xr.isPresenting)) { r.render(this.scene, this.camera); return; }
      /* Стерео (картон VR кўзойнак): экран иккига бўлинади, ҳар кўзга алоҳида камера */
      const T = THREE, size = r.getSize(this.v2 || (this.v2 = new T.Vector2())), w = size.x / 2, h = size.y;
      if (!this.camL) { this.camL = new T.PerspectiveCamera(); this.camR = new T.PerspectiveCamera(); }
      this.camera.updateMatrixWorld();
      r.setScissorTest(true);
      [[this.camL, 0, -1], [this.camR, w, 1]].forEach(([cam, x, sgn]) => {
        cam.copy(this.camera); cam.aspect = w / h; cam.updateProjectionMatrix();
        cam.translateX(sgn * 0.032 * Math.max(1, this.d / 3));
        r.setScissor(x, 0, w, h); r.setViewport(x, 0, w, h);
        r.render(this.scene, cam);
      });
      r.setScissorTest(false);
      r.setViewport(0, 0, size.x, size.y);
    }
    /* WebXR: VR кўзойнак (Meta Quest, Pico ва б.) браузерида тўлиқ иммерсив режим */
    async enterXR(onEnd) {
      const r = this.renderer;
      if (r.xr.isPresenting) { r.xr.getSession().end(); return; }
      const session = await navigator.xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor"] });
      const was = this.running;
      this.stop();
      r.xr.enabled = true;
      r.xr.setReferenceSpaceType("local");
      /* Саҳна томошабиннинг олдига, 1,6 м узоқликка, ярим ўлчамда жойлашади */
      this.scene.scale.setScalar(0.5);
      this.scene.position.set(-this.target.x * 0.5, -this.target.y * 0.5 - 0.25, -this.target.z * 0.5 - 1.6);
      await r.xr.setSession(session);
      let last = performance.now();
      r.setAnimationLoop((now) => {
        const dt = clamp((now - last) / 1000, 0, 0.1); last = now; this.t += dt;
        const sdt = this.paused ? 0 : dt * this.speed; this.st += sdt;
        this.updaters.forEach((f) => f(sdt, this.st));
        r.render(this.scene, this.camera);
      });
      session.addEventListener("end", () => {
        r.setAnimationLoop(null);
        r.xr.enabled = false;
        this.scene.scale.setScalar(1);
        this.scene.position.set(0, 0, 0);
        this.resize(); this.place();
        if (was) this.start();
        if (onEnd) onEnd();
      });
    }
    start() {
      if (this.running) return;
      this.running = true; this.last = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        const dt = clamp((now - this.last) / 1000, 0, 0.1); this.last = now; this.t += dt;
        if (this.fly) {
          const f = this.fly; f.t = Math.min(1, f.t + dt / 1.6); const k = 1 - Math.pow(1 - f.t, 3);
          this.d = lerp(f.d0, this.home.d, k); this.th = lerp(f.th0, this.home.th, k); this.ph = lerp(f.ph0, this.home.ph, k);
          if (f.t >= 1) this.fly = null;
          this.place();
        } else if (this.auto) { this.th += dt * 0.25; this.place(); }
        const sdt = this.paused ? 0 : dt * this.speed; this.st += sdt;
        this.updaters.forEach((f) => f(sdt, this.st));
        this.render();
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }
    stop() { this.running = false; cancelAnimationFrame(this.raf); }
    dispose() {
      this.stop();
      this.ro.disconnect();
      this.scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        const m = o.material;
        (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => { if (x.map) x.map.dispose(); x.dispose(); });
      });
      this.renderer.dispose();
      if (this.renderer.forceContextLoss) this.renderer.forceContextLoss();
      this.canvas.remove();
    }
  }

  /* ---------- Саҳна ёрдамчилари ---------- */
  function textSprite(text, color = "#ffffff", size = 0.32) {
    const T = THREE, c = document.createElement("canvas"), g = c.getContext("2d");
    const font = "700 56px Onest, system-ui, sans-serif";
    g.font = font;
    const w = Math.ceil(g.measureText(text).width) + 24;
    c.width = w; c.height = 76;
    g.font = font; g.textAlign = "center"; g.textBaseline = "middle";
    g.lineWidth = 8; g.strokeStyle = "rgba(0,0,0,.55)"; g.strokeText(text, w / 2, 40);
    g.fillStyle = color; g.fillText(text, w / 2, 40);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    s.scale.set((size * w) / 76, size, 1);
    s.renderOrder = 10;
    return s;
  }
  function cylinderBetween(a, b, r, mat) {
    const T = THREE, dir = new T.Vector3().subVectors(b, a), len = dir.length();
    const m = new T.Mesh(new T.CylinderGeometry(r, r, len, 14), mat);
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize());
    return m;
  }
  function setCyl(m, a, b) {
    const T = THREE, dir = new T.Vector3().subVectors(b, a), len = dir.length() || 1e-6;
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.scale.set(1, len / m.geometry.parameters.height, 1);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize());
  }
  /* Сфера юзасидаги қитъалар учун 3D қиймат шовқини (тикувсиз текстура) */
  function earthTexture() {
    const T = THREE, W = 384, Hh = 192, c = document.createElement("canvas");
    c.width = W; c.height = Hh;
    const g = c.getContext("2d"), img = g.createImageData(W, Hh);
    const hash = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
    const sm = (t) => t * t * (3 - 2 * t);
    const noise = (x, y, z) => {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
      let v = 0;
      for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++)
        v += hash(xi + dx, yi + dy, zi + dz) * (dx ? xf : 1 - xf) * (dy ? yf : 1 - yf) * (dz ? zf : 1 - zf);
      return v;
    };
    for (let j = 0; j < Hh; j++) {
      const lat = (0.5 - j / Hh) * Math.PI;
      for (let i = 0; i < W; i++) {
        const lon = (i / W) * 2 * Math.PI, x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
        let n = 0, a = 0.5, f = 1.6;
        for (let o = 0; o < 4; o++) { n += a * noise(x * f + 11, y * f + 7, z * f + 3); a *= 0.5; f *= 2.1; }
        const k = (j * W + i) * 4, polar = Math.abs(y) > 0.86;
        let r, gg, b;
        if (polar) { r = 236; gg = 244; b = 250; }
        else if (n > 0.52) { const d = Math.abs(y) < 0.35 && n < 0.6 ? 1 : 0; r = d ? 196 : 70; gg = d ? 170 : 140; b = d ? 110 : 70; if (n > 0.66) { r = 150; gg = 130; b = 100; } }
        else { r = 20; gg = 80 + n * 120; b = 150 + n * 120; }
        img.data[k] = r; img.data[k + 1] = gg; img.data[k + 2] = b; img.data[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }

  /* ---------- Амалий топшириқ ва мактаб вазифаси ---------- */
  function taskBox(box, id, q, ans, tol, unit, hint, dec = 2) {
    const done = flags()["l3t_" + id];
    box.innerHTML = `<h4>${H(TX.task)}</h4><p>${H(q)}</p>
      <div class="ev-tools"><input class="l3-in" inputmode="decimal" placeholder="${H(TX.ans)}, ${esc(unit)}" aria-label="${H(TX.ans)}"><button class="btn btn-primary btn-sm" type="button">${H(TX.check)}</button></div>
      <p class="small" aria-live="polite">${done ? H(TX.done) : ""}</p>`;
    const inp = box.querySelector("input"), msg = box.querySelector("p.small");
    const go = () => {
      const v = parseFloat(inp.value.replace(/\s/g, "").replace(",", "."));
      const ok = isFinite(v) && Math.abs(v - ans) <= tol;
      msg.textContent = ok ? L(TX.ok) + fmt(ans, dec) + " " + unit : L(TX.no) + L(hint);
      if (ok) { if (!flags()["l3t_" + id] && window.EkoGame) EkoGame.track("lab"); once("l3t_" + id, 60, TX.whyU); }
    };
    box.querySelector("button").addEventListener("click", go);
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
  }
  function star(id, el) {
    if (!flags()["l3k_" + id]) { if (window.EkoGame) EkoGame.track("lab"); once("l3k_" + id, 5, TX.why); }
    if (el) { el.textContent = L(TX.star); el.classList.add("l3-star-on"); }
  }

  /* =====================================================================
     1) 🌍 Иссиқхона самараси
     ===================================================================== */
  const GH = {
    id: "issiq", icon: "🌍",
    name: { uz: "Иссиқхона самараси", ru: "Парниковый эффект", en: "Greenhouse effect" },
    q: { uz: "Ҳавода CO₂ кўпайса, Ердан чиқаётган иссиқлик нурлари қаерга кетади?", ru: "Куда уходят тепловые лучи Земли, если в воздухе становится больше CO₂?", en: "Where does Earth's heat radiation go when there is more CO₂ in the air?" },
    src: "Myhre et al., 1998 (GRL 25:2715); IPCC AR6 WG1, 2021, ch. 7; NOAA Mauna Loa CO₂",
    view: { bg: "#050b1a", d: 5.2, ph: 1.25, th: 0.9 },
    presets: [
      [180, { uz: "Музлик даври", ru: "Ледниковый период", en: "Ice age" }, { uz: "20 минг йил олдин", ru: "20 тыс. лет назад", en: "20,000 years ago" }],
      [280, { uz: "Саноатгача", ru: "Доиндустриальный", en: "Pre-industrial" }, { uz: "1750 йил", ru: "1750 год", en: "year 1750" }],
      [425, { uz: "Бугун", ru: "Сегодня", en: "Today" }, { uz: "2024 йил, NOAA", ru: "2024 год, NOAA", en: "2024, NOAA" }],
      [560, { uz: "Икки баравар", ru: "Удвоение", en: "Doubled" }, { uz: "2×280 ppm", ru: "2×280 ppm", en: "2×280 ppm" }],
      [870, { uz: "2100 (юқори эмиссия)", ru: "2100 (высокие выбросы)", en: "2100 (high emissions)" }, { uz: "SSP3-7.0 сценарийси", ru: "сценарий SSP3-7.0", en: "SSP3-7.0 scenario" }]
    ],
    build(v, ui) {
      const T = THREE, S = { C: 425, ecs: 3, seen: new Set([425]) };
      ui.goals = [
        { id: "ice", t: t3("Музлик даврида (180 ppm) Ер совишини кўринг", "Посмотрите, как Земля остывает в ледниковый период (180 ppm)", "See the Earth cool in the ice age (180 ppm)"), ok: () => S.C <= 180 },
        { id: "two", t: t3("Исиш +2 °C дан ошадиган CO₂ миқдорини топинг", "Найдите уровень CO₂, при котором потепление больше +2 °C", "Find the CO₂ level where warming passes +2 °C"), ok: () => dT() >= 2 },
        stage() === "uni" ? { id: "ecs", t: t3("S = 4,5 °C да 560 ppm учун ΔT ни кўринг (юқори сезгирлик)", "Посмотрите ΔT при 560 ppm и S = 4,5 °C (высокая чувствительность)", "Check ΔT at 560 ppm with S = 4.5 °C (high sensitivity)"), ok: () => S.ecs >= 4.5 && S.C === 560 } : null
      ];
      const earth = new T.Mesh(new T.SphereGeometry(1, 64, 48), new T.MeshStandardMaterial({ map: earthTexture(), roughness: 0.9, emissive: new T.Color(0xff3300), emissiveIntensity: 0 }));
      v.scene.add(earth);
      const atm = new T.Mesh(new T.SphereGeometry(1.18, 48, 32), new T.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.12, depthWrite: false, side: T.DoubleSide }));
      v.scene.add(atm);
      const sunM = new T.Mesh(new T.SphereGeometry(0.35, 24, 16), new T.MeshBasicMaterial({ color: 0xffd34d }));
      sunM.position.set(4.2, 0.6, 0); v.scene.add(sunM);
      const starsG = new T.BufferGeometry(), sp = [];
      for (let i = 0; i < 400; i++) { const u = Math.random() * 2 - 1, a = Math.random() * 6.283, r = 30; sp.push(r * Math.sqrt(1 - u * u) * Math.cos(a), r * u, r * Math.sqrt(1 - u * u) * Math.sin(a)); }
      starsG.setAttribute("position", new T.Float32BufferAttribute(sp, 3));
      v.scene.add(new T.Points(starsG, new T.PointsMaterial({ color: 0xffffff, size: 0.08 })));
      /* Фотонлар: сариқ — қуёш нури, қизил — Ердан чиқадиган инфрақизил нур */
      const geo = new T.SphereGeometry(0.026, 8, 6);
      const mSun = new T.MeshBasicMaterial({ color: 0xfde047 }), mIr = new T.MeshBasicMaterial({ color: 0xef4444 }), mBack = new T.MeshBasicMaterial({ color: 0xfb923c });
      const ph = [];
      for (let i = 0; i < 70; i++) { const m = new T.Mesh(geo, mSun); v.scene.add(m); ph.push({ m, p: new T.Vector3(), d: new T.Vector3(), k: 0 }); }
      let trapped = 0, escaped = 0;
      const spawnSun = (o) => {
        o.k = 0; o.m.material = mSun;
        const y = (Math.random() * 2 - 1) * 0.9, z = (Math.random() * 2 - 1) * 0.9;
        o.p.set(4 + Math.random() * 1.5, y, z); o.d.set(-1, 0, 0);
      };
      const emitIr = (o, n) => {
        o.k = 1; o.m.material = mIr;
        o.d.copy(n).add(new T.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.2)).normalize();
        if (o.d.dot(n) < 0.1) o.d.add(n).normalize();
        o.p.copy(n).multiplyScalar(1.01);
      };
      ph.forEach((o, i) => { spawnSun(o); o.p.x += i * 0.07; });
      const forcing = () => 5.35 * Math.log(S.C / 280);
      const dT = () => (S.ecs * forcing()) / (5.35 * Math.LN2);
      const trapP = () => clamp(0.18 + 0.55 * Math.log(S.C / 150) / Math.log(1200 / 150), 0.1, 0.8);
      v.updaters.push((dt) => {
        const sp = 1.8 * dt;
        ph.forEach((o) => {
          o.p.addScaledVector(o.d, sp);
          const r = o.p.length();
          if (o.k === 0 && r <= 1) {
            if (Math.random() < 0.3) { o.k = 3; o.d.reflect(o.p.clone().normalize()); o.m.material = mSun; }
            else emitIr(o, o.p.clone().normalize());
          } else if (o.k === 1 && r >= 1.18 && r < 1.22) {
            if (Math.random() < trapP()) { o.k = 2; o.m.material = mBack; o.d.copy(o.p).normalize().negate().add(new T.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.6)).normalize(); trapped++; }
            else { o.k = 4; escaped++; }
          } else if (o.k === 2 && r <= 1) emitIr(o, o.p.clone().normalize());
          if (r > 6.5) spawnSun(o);
          o.m.position.copy(o.p);
        });
        earth.rotation.y += dt * 0.15;
      });
      const draw = () => {
        const f = clamp((S.C - 180) / (1000 - 180), 0, 1), t = dT();
        atm.material.opacity = 0.06 + f * 0.34;
        atm.material.color.setHSL(lerp(0.56, 0.06, f * f), 0.85, lerp(0.72, 0.58, f));
        earth.material.emissiveIntensity = clamp((t - 0.8) / 8, 0, 0.35);
        ui.render();
      };
      ui.html = () => {
        const t = dT(), uni = stage() === "uni";
        const pre = this.presets.map(([c, n, d]) => `<button type="button" class="sg-opt l3-pre ${c === S.C ? "sel" : ""}" data-c="${c}"><b>${c} ppm</b><span>${H(n)}</span><small>${H(d)}</small></button>`).join("");
        const face = t < -1 ? "🥶" : t < 0.8 ? "😊" : t < 2.2 ? "😓" : t < 3.5 ? "🥵" : "🔥";
        const kid = {
          uz: t < -1 ? "CO₂ кам — иссиқлик осонгина космосга қочади, Ер совийди." : t < 0.8 ? "Табиий иссиқхона самараси: ҳаво «адёл» каби Ерни иситади (усиз Ер −18 °C бўларди)." : t < 2.2 ? "Адёл қалинлашди: қизил нурларнинг кўпроғи Ерга қайтмоқда, Ер исимоқда." : "Жуда қалин адёл! Иссиқ кунлар, қурғоқчилик, музликлар эриши кучаяди. Энергияни тежаш ва дарахт экиш ёрдам беради.",
          ru: t < -1 ? "Мало CO₂ — тепло легко уходит в космос, Земля остывает." : t < 0.8 ? "Естественный парниковый эффект: воздух греет Землю как «одеяло» (без него было бы −18 °C)." : t < 2.2 ? "Одеяло стало толще: больше красных лучей возвращается к Земле, она нагревается." : "Очень толстое одеяло! Больше жары, засух и таяния ледников. Помогают экономия энергии и посадка деревьев.",
          en: t < -1 ? "Little CO₂: heat escapes to space easily and the Earth cools." : t < 0.8 ? "The natural greenhouse effect: air keeps the Earth warm like a blanket (without it, −18 °C)." : t < 2.2 ? "The blanket got thicker: more red rays return to the Earth and it warms." : "A very thick blanket! More heat waves, droughts and melting glaciers. Saving energy and planting trees help."
        };
        const legend = `<div class="l3-legend"><span><i style="background:#fde047"></i>${H({ uz: "Қуёш нури", ru: "Солнечный свет", en: "Sunlight" })}</span><span><i style="background:#ef4444"></i>${H({ uz: "Иссиқлик (ИҚ) нури", ru: "Тепловое (ИК) излучение", en: "Heat (IR) radiation" })}</span><span><i style="background:#fb923c"></i>${H({ uz: "Ерга қайтган иссиқлик", ru: "Тепло, вернувшееся к Земле", en: "Heat sent back to Earth" })}</span></div>`;
        if (!uni) return `<div class="l3-pres">${pre}</div>${legend}
          <div class="l3-big"><span>${face}</span><b>${t >= 0 ? "+" : ""}${fmt(t, 1)} °C</b></div>
          <p class="lab-out">${H(kid)}</p>
          <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "5 та даврни ҳам босиб кўринг ва Ер ҳароратини солиштиринг.", ru: "Нажмите все 5 эпох и сравните температуру Земли.", en: "Press all 5 eras and compare Earth's temperature." })} (${S.seen.size}/5)</p>`;
        return `<label>CO₂: <b>${S.C} ppm</b><input type="range" data-k="C" min="180" max="1200" step="5" value="${S.C}"></label>
          <label>${H({ uz: "Иқлим сезгирлиги S (ECS)", ru: "Чувствительность климата S (ECS)", en: "Climate sensitivity S (ECS)" })}: <b>${fmt(S.ecs, 1)} °C</b><input type="range" data-k="ecs" min="2" max="5" step="0.1" value="${S.ecs}"></label>
          <div class="l3-pres mini">${pre}</div>${legend}
          <div class="lab-formula">ΔF = 5,35 · ln(C / 280) = <b>${fmt(forcing(), 2)}</b> W/m²<br>ΔT<sub>eq</sub> = S · ΔF / F<sub>2×</sub> = <b>${t >= 0 ? "+" : ""}${fmt(t, 2)}</b> °C &nbsp;(F<sub>2×</sub> = 5,35·ln2 ≈ 3,71 W/m²)</div>
          <p class="small muted">${H({ uz: "Бу фақат CO₂ нинг мувозанат таъсири. Ҳақиқий исиш метан, аэрозоллар ва океан инерциясига ҳам боғлиқ. IPCC AR6: S = 3 °C (жуда эҳтимолли оралиқ 2–5 °C). Саҳнада ушланган нурлар улуши сифатий кўрсатилган.", ru: "Это только равновесный эффект CO₂. Реальное потепление зависит ещё от метана, аэрозолей и инерции океана. IPCC AR6: S = 3 °C (очень вероятно 2–5 °C). Доля задержанных лучей в сцене показана качественно.", en: "This is CO₂'s equilibrium effect only. Real warming also depends on methane, aerosols and ocean inertia. IPCC AR6: S = 3 °C (very likely 2–5 °C). The trapped-ray share in the scene is qualitative." })}</p>
          <p class="small">${H({ uz: "Саҳна ҳисобчиси", ru: "Счётчик сцены", en: "Scene counter" })}: ${H({ uz: "қайтган", ru: "вернулось", en: "returned" })} <b data-tr>${trapped}</b> · ${H({ uz: "қочган", ru: "ушло", en: "escaped" })} <b data-es>${escaped}</b></p>`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => {
          S.C = +b.dataset.c; S.seen.add(S.C); draw();
          if (S.seen.size >= 5 && stage() !== "uni") star("issiq", ui.el.querySelector("[data-star]"));
        }));
        el.querySelectorAll("input[data-k]").forEach((r) => r.addEventListener("input", () => { S[r.dataset.k] = +r.value; draw(); }));
      };
      ui.task = () => ({ q: { uz: "Бугун C = 425 ppm, иқлим сезгирлиги S = 3 °C. Фақат CO₂ ҳисобига мувозанат исиши ΔT неча °C? (C₀ = 280 ppm, F₂× = 5,35·ln2)", ru: "Сегодня C = 425 ppm, чувствительность S = 3 °C. Каково равновесное потепление ΔT только от CO₂, °C? (C₀ = 280 ppm, F₂× = 5,35·ln2)", en: "Today C = 425 ppm and sensitivity S = 3 °C. What is the equilibrium warming ΔT from CO₂ alone, °C? (C₀ = 280 ppm, F₂× = 5.35·ln2)" }, a: (3 * Math.log(425 / 280)) / Math.LN2, tol: 0.05, unit: "°C", hint: { uz: "ΔT = S · ln(C/C₀) / ln2", ru: "ΔT = S · ln(C/C₀) / ln2", en: "ΔT = S · ln(C/C₀) / ln2" } });
      let tick = 0;
      v.updaters.push((dt) => { tick += dt; if (tick < 1) return; tick = 0; const a = ui.el.querySelector("[data-tr]"), b = ui.el.querySelector("[data-es]"); if (a) { a.textContent = trapped; b.textContent = escaped; } });
      draw();
    }
  };

  /* =====================================================================
     2) ⚛️ Молекулалар ва инфрақизил нур
     ===================================================================== */
  const A = { C: [0x3f3f46, 0.36], O: [0xef4444, 0.34], H: [0xf8fafc, 0.24], N: [0x3b82f6, 0.35] };
  const r3 = (x, y, z) => [x, y, z];
  const tet = 1.087 / Math.sqrt(3);
  const MOL = {
    co2: { f: "CO₂", n: { uz: "Карбонат ангидрид", ru: "Углекислый газ", en: "Carbon dioxide" }, at: [["C", r3(0, 0, 0), 0.7], ["O", r3(-1.16, 0, 0), -0.35], ["O", r3(1.16, 0, 0), -0.35]], b: [[0, 1, 2], [0, 2, 2]],
      gwp: "1", life: { uz: "юзлаб–минглаб йил", ru: "сотни–тысячи лет", en: "centuries to millennia" }, share: "≈ 0,042% (420+ ppm)", gh: true,
      modes: [["bend", 667, true, [[0, 0.25, 0], [0, -0.125, 0], [0, -0.125, 0]]], ["asym", 2349, true, [[0.2, 0, 0], [-0.1, 0, 0], [-0.1, 0, 0]]], ["sym", 1388, false, [[0, 0, 0], [-0.18, 0, 0], [0.18, 0, 0]]]] },
    ch4: { f: "CH₄", n: { uz: "Метан", ru: "Метан", en: "Methane" }, at: [["C", r3(0, 0, 0), -0.4], ["H", r3(tet, tet, tet), 0.1], ["H", r3(tet, -tet, -tet), 0.1], ["H", r3(-tet, tet, -tet), 0.1], ["H", r3(-tet, -tet, tet), 0.1]], b: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
      gwp: "27,9 (fossil 29,8)", life: { uz: "≈ 11,8 йил", ru: "≈ 11,8 года", en: "≈ 11.8 years" }, share: "≈ 1,9 ppm", gh: true,
      modes: [["bend", 1306, true, [[0, 0.1, 0], [0.2, 0, -0.2], [-0.2, 0, 0.2], [0.2, 0, 0.2], [-0.2, 0, -0.2]]], ["asym", 3019, true, [[0.08, 0, 0], [-0.22, 0, 0], [-0.22, 0, 0], [0.12, 0, 0], [0.12, 0, 0]]]] },
    n2o: { f: "N₂O", n: { uz: "Азот (I) оксиди", ru: "Закись азота", en: "Nitrous oxide" }, at: [["N", r3(-1.128, 0, 0), -0.15], ["N", r3(0, 0, 0), 0.45], ["O", r3(1.184, 0, 0), -0.3]], b: [[0, 1, 3], [1, 2, 1]],
      gwp: "273", life: { uz: "≈ 109 йил", ru: "≈ 109 лет", en: "≈ 109 years" }, share: "≈ 0,34 ppm", gh: true,
      modes: [["bend", 589, true, [[0, -0.12, 0], [0, 0.24, 0], [0, -0.12, 0]]], ["sym", 1285, true, [[-0.14, 0, 0], [0, 0, 0], [0.14, 0, 0]]], ["asym", 2224, true, [[-0.16, 0, 0], [0.2, 0, 0], [-0.04, 0, 0]]]] },
    h2o: { f: "H₂O", n: { uz: "Сув буғи", ru: "Водяной пар", en: "Water vapour" }, at: [["O", r3(0, 0.12, 0), -0.8], ["H", r3(-0.757, -0.466, 0), 0.4], ["H", r3(0.757, -0.466, 0), 0.4]], b: [[0, 1, 1], [0, 2, 1]],
      gwp: { uz: "— (қайтар алоқа)", ru: "— (обратная связь)", en: "— (feedback)" }, life: { uz: "≈ 9 кун", ru: "≈ 9 дней", en: "≈ 9 days" }, share: "0–4%", gh: true,
      modes: [["bend", 1595, true, [[0, 0, 0], [0.18, -0.12, 0], [-0.18, -0.12, 0]]], ["sym", 3657, true, [[0, 0.04, 0], [-0.15, -0.1, 0], [0.15, -0.1, 0]]], ["asym", 3756, true, [[0.03, 0, 0], [-0.17, 0.1, 0], [-0.17, -0.1, 0]]]] },
    o3: { f: "O₃", n: { uz: "Озон", ru: "Озон", en: "Ozone" }, at: [["O", r3(0, 0.45, 0), 0.2], ["O", r3(-1.089, -0.22, 0), -0.1], ["O", r3(1.089, -0.22, 0), -0.1]], b: [[0, 1, 1.5], [0, 2, 1.5]],
      gwp: { uz: "— (қисқа яшайди)", ru: "— (короткоживущий)", en: "— (short-lived)" }, life: { uz: "кунлар–ҳафталар", ru: "дни–недели", en: "days to weeks" }, share: "≈ 0,03 ppm", gh: true,
      modes: [["asym", 1042, true, [[0.12, 0, 0], [-0.06, 0.08, 0], [-0.06, -0.08, 0]]], ["bend", 701, true, [[0, -0.2, 0], [0.12, 0.1, 0], [-0.12, 0.1, 0]]]] },
    n2: { f: "N₂", n: { uz: "Азот", ru: "Азот", en: "Nitrogen" }, at: [["N", r3(-0.549, 0, 0), 0], ["N", r3(0.549, 0, 0), 0]], b: [[0, 1, 3]],
      gwp: "0", life: "—", share: "78,08%", gh: false, modes: [["sym", 2331, false, [[-0.16, 0, 0], [0.16, 0, 0]]]] },
    o2: { f: "O₂", n: { uz: "Кислород", ru: "Кислород", en: "Oxygen" }, at: [["O", r3(-0.604, 0, 0), 0], ["O", r3(0.604, 0, 0), 0]], b: [[0, 1, 2]],
      gwp: "0", life: "—", share: "20,95%", gh: false, modes: [["sym", 1556, false, [[-0.16, 0, 0], [0.16, 0, 0]]]] }
  };
  const MODE_N = {
    bend: { uz: "эгилиш", ru: "деформационное", en: "bending" },
    sym: { uz: "симметрик чўзилиш", ru: "симметричное валентное", en: "symmetric stretch" },
    asym: { uz: "носимметрик чўзилиш", ru: "антисимметричное валентное", en: "asymmetric stretch" }
  };
  const MOLS = {
    id: "molekula", icon: "⚛️",
    name: { uz: "Молекулалар ва ИҚ нур", ru: "Молекулы и ИК-излучение", en: "Molecules and IR light" },
    q: { uz: "Нега азот ва кислород Ерни иситмайди, CO₂ ва метан эса иситади?", ru: "Почему азот и кислород не греют Землю, а CO₂ и метан греют?", en: "Why don't nitrogen and oxygen warm the Earth, while CO₂ and methane do?" },
    src: "NIST Chemistry WebBook (bond lengths, vibrational frequencies); IPCC AR6 WG1, 2021, Table 7.15 (GWP-100, lifetimes); NOAA GML",
    view: { bg: "#0b1220", d: 4.4, ph: 1.3, th: 0.5, minD: 2.2, maxD: 9 },
    build(v, ui) {
      const T = THREE, S = { m: "co2", mode: 0, tried: new Set(), photon: -1, absorbed: false, amp: 1 };
      ui.goals = [
        { id: "three", t: t3("Камида 3 та газга ИҚ нур юбориб кўринг", "Пошлите ИК-луч хотя бы в 3 газа", "Fire IR at 3 or more gases"), ok: () => S.tried.size >= 3 },
        { id: "n2", t: t3("Азот (N₂) ИҚ нурни ютмаслигини текширинг", "Проверьте, что азот (N₂) не поглощает ИК", "Check that nitrogen (N₂) doesn't absorb IR"), ok: () => S.tried.has("n2") },
        { id: "ch4", t: t3("Метан (CH₄) молекуласини синаб кўринг", "Испытайте молекулу метана (CH₄)", "Test the methane (CH₄) molecule"), ok: () => S.tried.has("ch4") }
      ];
      const grp = new T.Group(); v.scene.add(grp);
      const SC = 1.25;
      let atoms = [], bonds = [], dip, base = [];
      const wave = new T.Line(new T.BufferGeometry(), new T.LineBasicMaterial({ color: 0xf87171 }));
      v.scene.add(wave);
      const bondMat = new T.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 });
      const dipMat = new T.MeshBasicMaterial({ color: 0x22d3ee });
      function make() {
        while (grp.children.length) { const c = grp.children.pop(); c.geometry && c.geometry.dispose(); }
        const M = MOL[S.m];
        base = M.at.map(([, p]) => new T.Vector3(...p).multiplyScalar(SC));
        atoms = M.at.map(([el], i) => { const [col, r] = A[el]; const m = new T.Mesh(new T.SphereGeometry(r, 32, 24), new T.MeshStandardMaterial({ color: col, roughness: 0.35, metalness: 0.05 })); m.position.copy(base[i]); grp.add(m); const lb = textSprite(el, "#fff", 0.28); lb.position.set(0, r + 0.18, 0); m.add(lb); return m; });
        bonds = [];
        M.b.forEach(([a, b, o]) => {
          const n = Math.round(o) || 1, off = n === 1 ? [0] : n === 2 ? [-0.07, 0.07] : [-0.1, 0, 0.1];
          off.forEach((dz) => { const c = cylinderBetween(base[a], base[b], n === 1 ? 0.07 : 0.045, bondMat); grp.add(c); bonds.push([c, a, b, dz]); });
        });
        dip = new T.ArrowHelper(new T.Vector3(0, 1, 0), new T.Vector3(0, 0, 0.9), 0.5, 0x22d3ee, 0.2, 0.14);
        dip.line.material = dipMat; dip.cone.material = dipMat;
        grp.add(dip);
      }
      const tmpA = new T.Vector3(), tmpB = new T.Vector3(), side = new T.Vector3();
      v.updaters.push((dt, t) => {
        const M = MOL[S.m], md = M.modes[S.mode], disp = md[3];
        const w = Math.sin(t * 6) * S.amp * (S.absorbed ? 1.8 : 1);
        atoms.forEach((a, i) => { const d = disp[i] || [0, 0, 0]; a.position.set(base[i].x + d[0] * w, base[i].y + d[1] * w, base[i].z + d[2] * w); });
        bonds.forEach(([c, a, b, dz]) => {
          tmpA.copy(atoms[a].position); tmpB.copy(atoms[b].position);
          side.set(0, 0, dz); tmpA.add(side); tmpB.add(side);
          setCyl(c, tmpA, tmpB);
        });
        /* Диполь моменти μ = Σ qᵢ·rᵢ (қисман зарядлар билан) */
        const mu = new T.Vector3();
        M.at.forEach(([, , q], i) => mu.addScaledVector(atoms[i].position, q));
        const len = mu.length();
        dip.visible = len > 0.02;
        if (dip.visible) { dip.setDirection(mu.clone().normalize()); dip.setLength(0.35 + len * 2.2, 0.2, 0.14); }
        /* ИҚ фотони (тўлқин чизиғи) */
        if (S.photon >= 0) {
          S.photon += dt * 1.6;
          const z0 = -4 + S.photon * 2.2, pts = [];
          const active = md[2];
          const stopAt = active ? 0 : 99;
          for (let i = 0; i <= 60; i++) { const z = z0 - i * 0.04; if (z > stopAt) continue; pts.push(new T.Vector3(0.18 * Math.sin(z * 9), 0, z)); }
          wave.geometry.dispose(); wave.geometry = new T.BufferGeometry().setFromPoints(pts.length > 1 ? pts : [new T.Vector3(), new T.Vector3()]);
          if (active && z0 > 0.1 && !S.absorbed) { S.absorbed = true; ui.after(true); }
          if (!active && z0 > 4) { S.photon = -1; ui.after(false); }
          if (active && z0 - 2.4 > 0) { S.photon = -1; setTimeout(() => { S.absorbed = false; }, 1600); }
        } else if (wave.geometry.attributes.position && wave.geometry.attributes.position.count > 2) { wave.geometry.dispose(); wave.geometry = new T.BufferGeometry(); }
      });
      ui.html = () => {
        const M = MOL[S.m], uni = stage() === "uni";
        const tabs = Object.entries(MOL).map(([k, m]) => `<button type="button" class="chip ${k === S.m ? "active" : ""}" data-m="${k}">${m.f}</button>`).join("");
        const modes = M.modes.map(([n, nu, act], i) => `<button type="button" class="chip ${i === S.mode ? "active" : ""}" data-mode="${i}">${H(MODE_N[n])}${uni ? ` · ${nu} cm⁻¹` : ""} ${act ? "🔴" : "⚪"}</button>`).join("");
        const md = M.modes[S.mode];
        const act = md[2];
        const info = uni
          ? `<table class="lab-table l3-tab"><tr><th>${H({ uz: "Ҳаводаги улуши", ru: "Доля в воздухе", en: "Share in air" })}</th><td>${esc(M.share)}</td></tr><tr><th>GWP-100 (AR6)</th><td>${H(M.gwp)}</td></tr><tr><th>${H({ uz: "Атмосферада яшаш", ru: "Время жизни", en: "Lifetime" })}</th><td>${H(M.life)}</td></tr><tr><th>${H({ uz: "Тебраниш", ru: "Колебание", en: "Vibration" })}</th><td>ν̃ = ${md[1]} cm⁻¹ → λ = 10⁴/ν̃ = <b>${fmt(1e4 / md[1], 2)}</b> µm</td></tr></table>`
          : "";
        const verdict = act
          ? { uz: "🔴 Тебранганда диполь (кўк ўқ) ўзгаради → молекула инфрақизил нурни ютади ва иссиқликни ушлайди.", ru: "🔴 При колебании диполь (голубая стрелка) меняется → молекула поглощает ИК-излучение и удерживает тепло.", en: "🔴 The dipole (cyan arrow) changes as it vibrates → the molecule absorbs infrared light and traps heat." }
          : { uz: "⚪ Тебранганда диполь пайдо бўлмайди → ИҚ нур ўтиб кетади. Шунинг учун N₂ ва O₂ иссиқхона гази эмас.", ru: "⚪ При колебании диполь не возникает → ИК-луч проходит насквозь. Поэтому N₂ и O₂ не парниковые газы.", en: "⚪ No dipole appears as it vibrates → the IR ray passes through. That is why N₂ and O₂ are not greenhouse gases." };
        return `<div class="filters l3-chips">${tabs}</div>
          <h4 class="l3-h">${esc(M.f)} — ${H(M.n)}</h4>
          <div class="filters l3-chips">${modes}</div>
          <button class="btn btn-primary btn-sm" type="button" data-fire>🔴 ${H({ uz: "ИҚ нур юбориш", ru: "Послать ИК-луч", en: "Send an IR ray" })}</button>
          <p class="lab-out" data-res aria-live="polite">${H(verdict)}</p>
          ${info}
          ${uni ? `<p class="small muted">${H({ uz: "Қисман зарядлар ва силжишлар сифатий; боғ узунликлари ва частоталар — NIST маълумотлари. Симметрик чўзилишда CO₂ диполи нолга тенг қолади (фақат Раман спектрида кўринади).", ru: "Частичные заряды и смещения качественные; длины связей и частоты — данные NIST. При симметричном растяжении диполь CO₂ остаётся нулевым (видно только в спектре КР).", en: "Partial charges and displacements are qualitative; bond lengths and frequencies are NIST data. In the symmetric stretch CO₂'s dipole stays zero (Raman-active only)." })}</p>` : `<p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Камида 5 та молекулага ИҚ нур юбориб кўринг.", ru: "Пошлите ИК-луч хотя бы в 5 молекул.", en: "Send an IR ray to at least 5 molecules." })} (${S.tried.size}/5)</p>`}`;
      };
      ui.after = (abs) => {
        const el = ui.el && ui.el.querySelector("[data-res]");
        if (el) el.textContent = L(abs ? { uz: "💥 Ютилди! Молекула кучлироқ тебранмоқда — энергия иссиқликка айланади.", ru: "💥 Поглощено! Молекула колеблется сильнее — энергия переходит в тепло.", en: "💥 Absorbed! The molecule vibrates harder — the energy turns into heat." } : { uz: "➡️ Нур ўтиб кетди: бу тебраниш ИҚ нурни ютмайди.", ru: "➡️ Луч прошёл насквозь: это колебание не поглощает ИК.", en: "➡️ The ray passed through: this vibration does not absorb IR." });
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { S.m = b.dataset.m; S.mode = 0; S.photon = -1; S.absorbed = false; make(); ui.render(); }));
        el.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => { S.mode = +b.dataset.mode; S.photon = -1; S.absorbed = false; ui.render(); }));
        el.querySelector("[data-fire]").addEventListener("click", () => {
          S.photon = 0; S.absorbed = false; S.tried.add(S.m);
          const st = ui.el.querySelector("[data-star]");
          if (st) { st.textContent = `${L(TX.mission)}: ${L({ uz: "Камида 5 та молекулага ИҚ нур юбориб кўринг.", ru: "Пошлите ИК-луч хотя бы в 5 молекул.", en: "Send an IR ray to at least 5 molecules." })} (${S.tried.size}/5)`; if (S.tried.size >= 5) star("molekula", st); }
        });
      };
      ui.task = () => ({ q: { uz: "CO₂ нинг эгилиш тебраниши ν̃ = 667 см⁻¹. У ютадиган инфрақизил нурнинг тўлқин узунлиги неча мкм? (Ер шу соҳада энг кўп нурлайди.)", ru: "Деформационное колебание CO₂: ν̃ = 667 см⁻¹. Какова длина волны поглощаемого ИК-излучения, мкм? (Земля сильнее всего излучает именно здесь.)", en: "CO₂'s bending mode is ν̃ = 667 cm⁻¹. What wavelength of infrared light does it absorb, in µm? (Earth radiates most strongly here.)" }, a: 1e4 / 667, tol: 0.1, unit: "µm", hint: { uz: "λ (мкм) = 10 000 / ν̃ (см⁻¹)", ru: "λ (мкм) = 10 000 / ν̃ (см⁻¹)", en: "λ (µm) = 10,000 / ν̃ (cm⁻¹)" } });
      make();
    }
  };

  /* =====================================================================
     3) 💧 Тиндириш ҳавзаси — Стокс қонуни
     ===================================================================== */
  const MU = { 5: [1.519e-3, 999.97], 10: [1.307e-3, 999.7], 20: [1.002e-3, 998.2], 30: [0.798e-3, 995.7] };
  const TANK = {
    id: "tindir", icon: "💧",
    name: { uz: "Сувни тиндириш", ru: "Отстаивание воды", en: "Settling tank" },
    q: { uz: "Лойқа сувдаги қайси заррачалар тубга тез чўкади: катталарими ёки кичикларими?", ru: "Какие частицы мутной воды быстрее оседают на дно: крупные или мелкие?", en: "Which particles in muddy water sink faster: big or small ones?" },
    src: "Stokes, 1851; Hazen, 1904; Metcalf & Eddy, Wastewater Engineering, 5th ed., §5-6; «Саноат оқова сувларини тозалаш» дарслиги",
    view: { bg: "#dbeafe", d: 6.2, ph: 1.12, th: 0.55, target: [0, 0.4, 0], minD: 3, maxD: 12, unit: 4 },
    kids: [
      [{ uz: "Йирик қум", ru: "Крупный песок", en: "Coarse sand" }, 200, 2650, "🏖️"],
      [{ uz: "Майда қум", ru: "Мелкий песок", en: "Fine sand" }, 60, 2650, "⏳"],
      [{ uz: "Чанг (лёсс)", ru: "Пыль (лёсс)", en: "Silt (loess)" }, 20, 2650, "🌫️"],
      [{ uz: "Гил (лой)", ru: "Глина", en: "Clay" }, 3, 2650, "🟤"]
    ],
    build(v, ui) {
      const T = THREE, S = { d: 60, rho: 2650, temp: 20, Q: 200, k: 1, coag: false, flow: 1, done: new Set() };
      ui.goals = [
        { id: "sand", t: t3("Йирик қумни деярли тўлиқ (≥ 99 %) тиндиринг", "Осадите крупный песок почти полностью (≥ 99 %)", "Settle coarse sand almost fully (≥ 99 %)"), ok: () => S.d >= 200 && eff() >= 0.99 },
        { id: "coag", t: t3("Коагулянт билан гилни тиндиринг", "Осадите глину с коагулянтом", "Settle clay using coagulant"), ok: () => S.coag && S.d <= 5 && eff() >= 0.9 },
        stage() === "uni" ? { id: "cold", t: t3("Совуқ сувда (5 °C) чўкиш секинлашишини кўринг", "Посмотрите, как в холодной воде (5 °C) осаждение замедляется", "See settling slow down in cold water (5 °C)"), ok: () => S.temp === 5 } : null
      ];
      const Lm = 20, Wm = 5, Hm = 3, LX = 5, WZ = 1.6, HY = 1.4;
      const g = new T.Group(); g.position.set(-LX / 2, 0, -WZ / 2); v.scene.add(g);
      const box = new T.BoxGeometry(LX, HY, WZ);
      const water = new T.Mesh(box, new T.MeshStandardMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.22, depthWrite: false }));
      water.position.set(LX / 2, HY / 2, WZ / 2); g.add(water);
      const edges = new T.LineSegments(new T.EdgesGeometry(box), new T.LineBasicMaterial({ color: 0x1e3a8a }));
      edges.position.copy(water.position); g.add(edges);
      const floor = new T.Mesh(new T.BoxGeometry(LX, 0.04, WZ), new T.MeshStandardMaterial({ color: 0x94a3b8 }));
      floor.position.set(LX / 2, -0.02, WZ / 2); g.add(floor);
      const pipeM = new T.MeshStandardMaterial({ color: 0x64748b, metalness: 0.4, roughness: 0.4 });
      const pin = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.8, 16), pipeM); pin.rotation.z = Math.PI / 2; pin.position.set(-0.4, HY * 0.75, WZ / 2); g.add(pin);
      const pout = pin.clone(); pout.position.set(LX + 0.4, HY * 0.9, WZ / 2); g.add(pout);
      const lIn = textSprite("→ " + L({ uz: "кириш", ru: "вход", en: "inlet" }), "#1e3a8a", 0.26); lIn.position.set(-0.4, HY + 0.3, WZ / 2); g.add(lIn);
      const lOut = textSprite(L({ uz: "чиқиш", ru: "выход", en: "outlet" }) + " →", "#1e3a8a", 0.26); lOut.position.set(LX + 0.4, HY + 0.3, WZ / 2); g.add(lOut);
      const N = 220, geo = new T.SphereGeometry(1, 8, 6);
      const im = new T.InstancedMesh(geo, new T.MeshStandardMaterial({ color: 0xffffff }), N);
      g.add(im);
      const P = Array.from({ length: N }, () => ({ x: 0, y: 0, z: 0, st: 0 }));
      const sludge = new T.Mesh(new T.BoxGeometry(LX, 1, WZ), new T.MeshStandardMaterial({ color: 0x92400e, roughness: 1 }));
      sludge.position.set(LX / 2, 0, WZ / 2); g.add(sludge);
      let rem = 0, esc_ = 0, mud = 0;
      const dEff = () => (S.coag && S.d < 20 ? S.d * 20 : S.d);
      const rhoEff = () => (S.coag && S.d < 20 ? 1200 : S.rho);
      const vs = () => { const [mu, rw] = MU[S.temp]; const d = dEff() * 1e-6; return (9.81 * (rhoEff() - rw) * d * d) / (18 * mu); };
      const q0 = () => S.Q / 3600 / (Lm * Wm);
      const eff = () => clamp(vs() / q0(), 0, 1);
      const tr = () => (Lm * Wm * Hm) / (S.Q / 3600);
      const re = () => { const [mu, rw] = MU[S.temp]; return (rw * vs() * dEff() * 1e-6) / mu; };
      const col = new T.Color(), mtx = new T.Matrix4();
      const spawn = (p) => { p.x = -0.3; p.y = 0.05 + Math.random() * (HY - 0.1); p.z = 0.1 + Math.random() * (WZ - 0.2); p.st = 0; p.w = Math.random() * 3; };
      P.forEach((p) => { spawn(p); p.x = Math.random() * LX; p.w = 0; });
      v.updaters.push((dt) => {
        /* Визуал вақт: сув ҳавзадан ~7 с да ўтади; чўкиш тезлиги шу масштабда */
        const ux = LX / 7, vy = (vs() / Hm) * tr() * (HY / 7);
        const r = 0.012 + Math.sqrt(dEff()) * 0.0045;
        P.forEach((p, i) => {
          if (p.w > 0) { p.w -= dt; mtx.makeScale(0, 0, 0); im.setMatrixAt(i, mtx); return; }
          if (p.st === 0) {
            p.x += ux * dt; if (p.x > 0) p.y -= vy * dt;
            if (p.y <= 0.02 + mud) { p.st = 1; p.y = 0.02 + mud; rem++; mud = Math.min(0.12, mud + 0.0003); setTimeout(() => spawn(p), 900); }
            else if (p.x >= LX) { esc_++; spawn(p); }
          }
          mtx.makeScale(r, r, r); mtx.setPosition(clamp(p.x, -0.6, LX), p.y, p.z);
          im.setMatrixAt(i, mtx);
          col.set(p.st ? 0x78350f : 0xb45309); im.setColorAt(i, col);
        });
        im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
        sludge.visible = mud > 0.002; sludge.scale.y = Math.max(0.001, mud); sludge.position.y = mud / 2;
        water.material.color.setHSL(0.6 - 0.5 * (1 - eff()) * 0.18, 0.7, 0.62);
      });
      const draw = () => { rem = 0; esc_ = 0; ui.render(); };
      ui.html = () => {
        const uni = stage() === "uni", E = eff() * 100;
        const kids = this.kids.map(([n, d, rho, i]) => `<button type="button" class="sg-opt ${d === S.d ? "sel" : ""}" data-d="${d}" data-rho="${rho}"><span class="e" aria-hidden="true">${i}</span>${H(n)}</button>`).join("");
        const coag = `<label class="l3-check"><input type="checkbox" data-coag ${S.coag ? "checked" : ""}> 🧪 ${H({ uz: "Коагулянт (алюмин сульфат) қўшиш — майда заррачалар бирлашиб йирик «пага» ҳосил қилади", ru: "Добавить коагулянт (сульфат алюминия) — мелкие частицы слипаются в крупные хлопья", en: "Add coagulant (aluminium sulphate) — fine particles clump into large flocs" })}</label>`;
        if (!uni) {
          const msg = E >= 90 ? { uz: "👏 Деярли барча заррачалар тубга чўкди — сув тиниқ!", ru: "👏 Почти все частицы осели — вода прозрачная!", en: "👏 Almost all particles settled — the water is clear!" } : E >= 40 ? { uz: "🙂 Ярми чўкди. Оқимни секинлатинг ёки коагулянт қўшинг.", ru: "🙂 Осела половина. Замедлите поток или добавьте коагулянт.", en: "🙂 Half settled. Slow the flow or add coagulant." } : { uz: "😕 Майда заррачалар сув билан оқиб кетмоқда. Улар жуда секин чўкади!", ru: "😕 Мелкие частицы уносит водой. Они оседают очень медленно!", en: "😕 Tiny particles are washed out with the water. They sink very slowly!" };
          return `<div class="lab-opts">${kids}</div>
            <label>🚰 ${H({ uz: "Сув оқими", ru: "Поток воды", en: "Water flow" })}: <b>${H([{ uz: "секин", ru: "медленно", en: "slow" }, { uz: "ўртача", ru: "средне", en: "medium" }, { uz: "тез", ru: "быстро", en: "fast" }][S.flow])}</b><input type="range" data-flow min="0" max="2" step="1" value="${S.flow}"></label>
            ${coag}
            <div class="l3-big"><span>${E >= 90 ? "💧" : E >= 40 ? "🥤" : "🟫"}</span><b>${fmt(E, 0)}%</b><small>${H({ uz: "тозаланди", ru: "очищено", en: "removed" })}</small></div>
            <p class="lab-out">${H(msg)}</p>
            <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Гил заррачаларини 90% дан кўп тиндиринг (маслаҳат: тажрибачилар нима қўшади?).", ru: "Осадите больше 90% частиц глины (подсказка: что добавляют технологи?).", en: "Settle more than 90% of the clay particles (hint: what do engineers add?)." })}</p>`;
        }
        const reW = re() > 1;
        return `<label>${H({ uz: "Заррача диаметри d", ru: "Диаметр частицы d", en: "Particle diameter d" })}: <b>${S.d} µm</b><input type="range" data-k="d" min="1" max="300" step="1" value="${S.d}"></label>
          <label>${H({ uz: "Заррача зичлиги ρₚ", ru: "Плотность частицы ρₚ", en: "Particle density ρₚ" })}: <b>${S.rho} kg/m³</b><input type="range" data-k="rho" min="1050" max="2650" step="50" value="${S.rho}"></label>
          <label>${H({ uz: "Сув ҳарорати", ru: "Температура воды", en: "Water temperature" })}: <select data-temp>${[5, 10, 20, 30].map((t) => `<option value="${t}" ${t === S.temp ? "selected" : ""}>${t} °C</option>`).join("")}</select></label>
          <label>${H({ uz: "Сув сарфи Q", ru: "Расход Q", en: "Flow Q" })}: <b>${S.Q} m³/h</b><input type="range" data-k="Q" min="20" max="1000" step="10" value="${S.Q}"></label>
          ${coag}
          <div class="lab-formula">v<sub>s</sub> = g(ρₚ − ρ<sub>w</sub>)d² / 18μ = <b>${fmt(vs() * 1000, 3)}</b> mm/s<br>q₀ = Q / (L·B) = <b>${fmt(q0() * 1000, 3)}</b> mm/s (${fmt(q0() * 3600, 2)} m/h)<br>E = v<sub>s</sub> / q₀ = <b>${fmt(E, 1)}%</b> · t = V/Q = <b>${fmt(tr() / 3600, 2)}</b> h<br>Re = ρ<sub>w</sub>v<sub>s</sub>d/μ = <b>${fmt(re(), 3)}</b></div>
          ${reW ? `<p class="small" style="color:#b45309">⚠️ ${H({ uz: "Re > 1: Стокс қонуни аниқ эмас — оралиқ режим формуласидан фойдаланинг.", ru: "Re > 1: закон Стокса неточен — используйте формулу переходного режима.", en: "Re > 1: Stokes' law is inaccurate — use a transitional-regime drag formula." })}</p>` : ""}
          <p class="small muted">${H({ uz: `Ҳавза: L = ${Lm} м, B = ${Wm} м, H = ${Hm} м. Идеал ҳавза (Хазен): самарадорлик ҳавза чуқурлигига эмас, юзасига боғлиқ.`, ru: `Отстойник: L = ${Lm} м, B = ${Wm} м, H = ${Hm} м. Идеальный отстойник (Хазен): эффективность зависит от площади, а не от глубины.`, en: `Tank: L = ${Lm} m, B = ${Wm} m, H = ${Hm} m. Ideal (Hazen) tank: efficiency depends on surface area, not depth.` })}</p>`;
      };
      ui.bind = (el) => {
        const check = () => { if (stage() !== "uni" && S.d <= 5 && eff() >= 0.9) star("tindir", ui.el.querySelector("[data-star]")); };
        el.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { S.d = +b.dataset.d; S.rho = +b.dataset.rho; draw(); check(); }));
        const fl = el.querySelector("[data-flow]");
        if (fl) fl.addEventListener("input", () => { S.flow = +fl.value; S.Q = [60, 200, 700][S.flow]; draw(); check(); });
        const cg = el.querySelector("[data-coag]");
        cg.addEventListener("change", () => { S.coag = cg.checked; draw(); check(); });
        el.querySelectorAll("input[data-k]").forEach((r) => r.addEventListener("change", () => { S[r.dataset.k] = +r.value; draw(); }));
        el.querySelectorAll("input[data-k]").forEach((r) => r.addEventListener("input", () => { S[r.dataset.k] = +r.value; const b = r.parentElement.querySelector("b"); if (b) b.textContent = r.value + (r.dataset.k === "d" ? " µm" : r.dataset.k === "rho" ? " kg/m³" : " m³/h"); }));
        const tp = el.querySelector("[data-temp]");
        if (tp) tp.addEventListener("change", () => { S.temp = +tp.value; draw(); });
      };
      ui.task = () => {
        const [mu, rw] = MU[20];
        return { q: { uz: "Қум заррачаси: d = 50 мкм, ρₚ = 2650 кг/м³, сув 20 °C (μ = 1,002·10⁻³ Па·с, ρw = 998,2 кг/м³). Стокс қонуни бўйича чўкиш тезлиги неча мм/с?", ru: "Песчинка: d = 50 мкм, ρₚ = 2650 кг/м³, вода 20 °C (μ = 1,002·10⁻³ Па·с, ρw = 998,2 кг/м³). Какова скорость осаждения по Стоксу, мм/с?", en: "A sand grain: d = 50 µm, ρₚ = 2650 kg/m³, water at 20 °C (μ = 1.002·10⁻³ Pa·s, ρw = 998.2 kg/m³). What is its Stokes settling velocity in mm/s?" }, a: (9.81 * (2650 - rw) * 2.5e-9) / (18 * mu) * 1000, tol: 0.05, unit: "mm/s", hint: { uz: "v = 9,81·(2650−998,2)·(50·10⁻⁶)² / (18·1,002·10⁻³), сўнг ×1000", ru: "v = 9,81·(2650−998,2)·(50·10⁻⁶)² / (18·1,002·10⁻³), затем ×1000", en: "v = 9.81·(2650−998.2)·(50·10⁻⁶)² / (18·1.002·10⁻³), then ×1000" } };
      };
      draw();
    }
  };

  /* =====================================================================
     4) ☀️ Қуёш панели — Тошкент (φ = 41,3° ш.к.)
     ===================================================================== */
  const LAT = 41.3;
  const sunPos = (n, h) => {
    const dec = 23.44 * Math.sin((2 * Math.PI * (284 + n)) / 365) * DEG, w = 15 * (h - 12) * DEG, f = LAT * DEG;
    const sa = Math.sin(f) * Math.sin(dec) + Math.cos(f) * Math.cos(dec) * Math.cos(w);
    const alt = Math.asin(clamp(sa, -1, 1));
    const az = Math.atan2(Math.sin(w), Math.cos(w) * Math.sin(f) - Math.tan(dec) * Math.cos(f)); // жанубдан, ғарб томонга мусбат
    return { alt, az, dec };
  };
  const dni = (alt) => {
    if (alt <= 0) return 0;
    const ad = alt / DEG, am = 1 / (Math.sin(alt) + 0.50572 * Math.pow(ad + 6.07995, -1.6364));
    return 1353 * Math.pow(0.7, Math.pow(am, 0.678));
  };
  const poa = (alt, az, tilt, paz) => {
    const I = dni(alt); if (!I) return 0;
    const c = Math.sin(alt) * Math.cos(tilt) + Math.cos(alt) * Math.sin(tilt) * Math.cos(az - paz);
    return I * Math.max(0, c) + 0.1 * I * (1 + Math.cos(tilt)) / 2;
  };
  const dayKwh = (n, tilt, paz) => { let e = 0; for (let h = 4; h <= 20; h += 0.25) { const s = sunPos(n, h); e += poa(s.alt, s.az, tilt, paz) * 0.25; } return (e * 1.7 * 0.21) / 1000; };
  const SOLAR = {
    id: "quyosh", icon: "☀️",
    name: { uz: "Қуёш панели", ru: "Солнечная панель", en: "Solar panel" },
    q: { uz: "Қуёш панелини қайси томонга ва қандай бурчакда ўрнатсак, кўпроқ электр беради?", ru: "Куда и под каким углом поставить солнечную панель, чтобы она давала больше энергии?", en: "Which way and at what angle should a solar panel face to make the most electricity?" },
    src: "Cooper, 1969 (declination); Kasten & Young, 1989 (air mass); Meinel & Meinel, 1976 (clear-sky DNI); Duffie & Beckman, Solar Engineering of Thermal Processes",
    view: { bg: "#bfdbfe", d: 10, ph: 1.3, th: 0.5, target: [0, 1.6, 0], minD: 3, maxD: 16 },
    days: [[80, { uz: "21 март", ru: "21 марта", en: "21 March" }], [172, { uz: "21 июнь", ru: "21 июня", en: "21 June" }], [266, { uz: "23 сентябрь", ru: "23 сентября", en: "23 September" }], [355, { uz: "21 декабрь", ru: "21 декабря", en: "21 December" }]],
    build(v, ui) {
      const T = THREE, S = { n: 172, h: 12, tilt: 20, paz: 40, best: null, play: true };
      ui.goals = [
        { id: "dec", t: t3("21 декабрни танлаб, қишда Қуёш қанчалик паст эканини кўринг", "Выберите 21 декабря и посмотрите, как низко зимнее Солнце", "Pick 21 December and see how low the winter Sun is"), ok: () => S.n === 355 },
        { id: "south", t: t3("Панелни тўғри жанубга буринг (йўналиш 0°)", "Поверните панель строго на юг (азимут 0°)", "Turn the panel due south (azimuth 0°)"), ok: () => Math.abs(S.paz) <= 2 },
        { id: "wint", t: t3("Қишда панелни тикроқ (≥ 55°) қўйинг", "Зимой поставьте панель круче (≥ 55°)", "Tilt the panel steeper (≥ 55°) in winter"), ok: () => S.n === 355 && S.tilt >= 55 }
      ];
      const ground = new T.Mesh(new T.CircleGeometry(6, 64), new T.MeshStandardMaterial({ color: 0x86efac, roughness: 1 }));
      ground.rotation.x = -Math.PI / 2; v.scene.add(ground);
      const dirs = [[{ uz: "Ж", ru: "Ю", en: "S" }, 0, 5.4], [{ uz: "Ш", ru: "С", en: "N" }, 0, -5.4], [{ uz: "Шқ", ru: "В", en: "E" }, 5.4, 0], [{ uz: "Ғ", ru: "З", en: "W" }, -5.4, 0]];
      dirs.forEach(([t, x, z]) => { const s = textSprite(L(t), "#14532d", 0.45); s.position.set(x, 0.3, z); v.scene.add(s); });
      const stand = new T.Mesh(new T.CylinderGeometry(0.06, 0.08, 0.8, 12), new T.MeshStandardMaterial({ color: 0x475569 }));
      stand.position.y = 0.4; v.scene.add(stand);
      const panel = new T.Group(); panel.position.y = 0.85; v.scene.add(panel);
      const cells = document.createElement("canvas"); cells.width = 256; cells.height = 160;
      const cg = cells.getContext("2d"); cg.fillStyle = "#1e3a8a"; cg.fillRect(0, 0, 256, 160); cg.strokeStyle = "#93c5fd"; cg.lineWidth = 2;
      for (let x = 0; x <= 256; x += 32) { cg.beginPath(); cg.moveTo(x, 0); cg.lineTo(x, 160); cg.stroke(); }
      for (let y = 0; y <= 160; y += 32) { cg.beginPath(); cg.moveTo(0, y); cg.lineTo(256, y); cg.stroke(); }
      const ctex = new T.CanvasTexture(cells); ctex.colorSpace = T.SRGBColorSpace;
      const pm = [new T.MeshStandardMaterial({ color: 0x94a3b8 }), new T.MeshStandardMaterial({ color: 0x94a3b8 }), new T.MeshStandardMaterial({ map: ctex, roughness: 0.25, metalness: 0.3 }), new T.MeshStandardMaterial({ color: 0xcbd5e1 }), new T.MeshStandardMaterial({ color: 0x94a3b8 }), new T.MeshStandardMaterial({ color: 0x94a3b8 })];
      const slab = new T.Mesh(new T.BoxGeometry(1.7, 0.05, 1.0), pm); panel.add(slab);
      const nArrow = new T.ArrowHelper(new T.Vector3(0, 1, 0), new T.Vector3(0, 0.03, 0), 0.9, 0x16a34a, 0.18, 0.1); panel.add(nArrow);
      const sun = new T.Mesh(new T.SphereGeometry(0.28, 24, 16), new T.MeshBasicMaterial({ color: 0xfacc15 })); v.scene.add(sun);
      const sunL = new T.DirectionalLight(0xfff3c4, 1.4); v.scene.add(sunL);
      const ray = new T.Line(new T.BufferGeometry(), new T.LineDashedMaterial({ color: 0xf59e0b, dashSize: 0.2, gapSize: 0.12 })); v.scene.add(ray);
      const path = new T.Line(new T.BufferGeometry(), new T.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.6 })); v.scene.add(path);
      const R = 5;
      const dirOf = (alt, az) => new T.Vector3(-Math.sin(az) * Math.cos(alt), Math.sin(alt), Math.cos(az) * Math.cos(alt));
      const setPath = () => {
        const pts = [];
        for (let h = 4; h <= 20; h += 0.25) { const s = sunPos(S.n, h); if (s.alt > 0) pts.push(dirOf(s.alt, s.az).multiplyScalar(R)); }
        path.geometry.dispose(); path.geometry = new T.BufferGeometry().setFromPoints(pts.length > 1 ? pts : [new T.Vector3(), new T.Vector3()]);
      };
      const place = () => {
        const s = sunPos(S.n, S.h), up = s.alt > 0;
        const p = dirOf(s.alt, s.az).multiplyScalar(R);
        sun.position.copy(p); sun.visible = up; sunL.position.copy(p); sunL.intensity = up ? 1.4 : 0;
        panel.rotation.set(S.tilt * DEG, -S.paz * DEG, 0, "YXZ");
        ray.visible = up;
        ray.geometry.dispose(); ray.geometry = new T.BufferGeometry().setFromPoints([p, new T.Vector3(0, 0.85, 0)]); ray.computeLineDistances();
        v.scene.background.set(up ? "#bfdbfe" : "#1e293b");
      };
      const findBest = () => { let b = { e: 0 }; for (let t = 0; t <= 90; t += 5) for (let a = -90; a <= 90; a += 10) { const e = dayKwh(S.n, t * DEG, a * DEG); if (e > b.e) b = { e, t, a }; } S.best = b; };
      v.updaters.push((dt) => {
        if (!S.play) return;
        S.h += dt * 0.8; if (S.h > 20) S.h = 4;
        place();
        const out = ui.el && ui.el.querySelector("[data-now]");
        if (out) out.innerHTML = nowHtml();
      });
      const nowHtml = () => {
        const s = sunPos(S.n, S.h), P = poa(s.alt, s.az, S.tilt * DEG, S.paz * DEG) * 1.7 * 0.21;
        const hh = Math.floor(S.h), mm = Math.round((S.h - hh) * 60) % 60;
        return `🕒 ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")} · ${H({ uz: "қуёш баландлиги", ru: "высота солнца", en: "sun elevation" })} <b>${fmt(Math.max(0, s.alt / DEG), 1)}°</b> · ⚡ <b>${fmt(P, 0)} W</b>`;
      };
      ui.html = () => {
        const uni = stage() === "uni", E = dayKwh(S.n, S.tilt * DEG, S.paz * DEG), pct = S.best ? (E / S.best.e) * 100 : 0;
        const days = this.days.map(([n, t]) => `<button type="button" class="chip ${n === S.n ? "active" : ""}" data-n="${n}">${H(t)}</button>`).join("");
        const dirName = (a) => (Math.abs(a) < 15 ? { uz: "жанубга", ru: "на юг", en: "south" } : a < 0 ? { uz: "жануби-шарққа", ru: "на юго-восток", en: "south-east" } : { uz: "жануби-ғарбга", ru: "на юго-запад", en: "south-west" });
        const common = `<div class="filters l3-chips">${days}</div>
          <label>📐 ${H({ uz: "Панел қиялиги β", ru: "Наклон панели β", en: "Panel tilt β" })}: <b>${S.tilt}°</b><input type="range" data-k="tilt" min="0" max="90" step="1" value="${S.tilt}"></label>
          <label>🧭 ${H({ uz: "Панел йўналиши (жанубдан)", ru: "Направление панели (от юга)", en: "Panel direction (from south)" })}: <b>${S.paz > 0 ? "+" : ""}${S.paz}° · ${H(dirName(S.paz))}</b><input type="range" data-k="paz" min="-90" max="90" step="5" value="${S.paz}"></label>
          <p class="small" data-now>${nowHtml()}</p>
          <button class="btn btn-ghost btn-sm" type="button" data-play>${S.play ? "⏸" : "▶️"} ${H({ uz: "Кун ўтиши", ru: "Ход дня", en: "Day cycle" })}</button>
          <div class="l3-big"><span>🔋</span><b>${fmt(E, 2)} kWh</b><small>${H({ uz: "кунига (1 панел)", ru: "в день (1 панель)", en: "per day (1 panel)" })}</small></div>
          <div class="pc-bar" aria-hidden="true"><i style="width:${clamp(pct, 0, 100).toFixed(0)}%"></i></div>
          <p class="small">${H({ uz: "Энг яхши ҳолатга нисбатан", ru: "От наилучшего положения", en: "Of the best position" })}: <b>${fmt(pct, 0)}%</b></p>`;
        if (!uni) return `${common}
          <p class="lab-out">${H(pct >= 95 ? { uz: "🌞 Зўр! Панел қуёшга тўғри қаради.", ru: "🌞 Отлично! Панель смотрит прямо на солнце.", en: "🌞 Great! The panel faces the sun well." } : { uz: "Панелни жанубга буринг: Ўзбекистонда қуёш кун бўйи жануб томонда юради.", ru: "Поверните панель на юг: в Узбекистане солнце весь день идёт по южной стороне неба.", en: "Turn the panel south: in Uzbekistan the sun travels across the southern sky all day." })}</p>
          <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Панелни шундай буринги, у энг яхши ҳолатнинг 95% идан кўп энергия берсин.", ru: "Поверните панель так, чтобы она давала больше 95% от наилучшего.", en: "Turn the panel to get more than 95% of the best possible energy." })}</p>`;
        const s = sunPos(S.n, 12);
        return `${common}
          <div class="lab-formula">δ = 23,44°·sin(360°·(284+n)/365) = <b>${fmt(s.dec / DEG, 2)}°</b> (n = ${S.n})<br>sin α = sin φ sin δ + cos φ cos δ cos ω, φ = ${fmt(LAT, 1)}°<br>${H({ uz: "туш пайти", ru: "в полдень", en: "at solar noon" })}: α = 90° − φ + δ = <b>${fmt(s.alt / DEG, 1)}°</b><br>cos θ = sin α cos β + cos α sin β cos(γₛ − γₚ)<br>DNI = 1353·0,7^(AM^0,678); P = G·A·η, A = 1,7 m², η = 21%</div>
          <p class="small muted">${H({ uz: "Энг яхши шу кун учун", ru: "Лучшее для этого дня", en: "Best for this day" })}: β ≈ ${S.best ? S.best.t : "—"}°, γ ≈ ${S.best ? S.best.a : "—"}° → ${S.best ? fmt(S.best.e, 2) : "—"} kWh. ${H({ uz: "Йил бўйи қўзғалмас панел учун қиялик ≈ кенглик (≈ 35–41°). Модель тиниқ осмон учун; булут ва чанг ҳисобга олинмаган.", ru: "Для неподвижной панели на весь год наклон ≈ широте (≈ 35–41°). Модель ясного неба; облака и пыль не учтены.", en: "For a fixed all-year panel, tilt ≈ latitude (≈ 35–41°). Clear-sky model; clouds and dust not included." })}</p>`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-n]").forEach((b) => b.addEventListener("click", () => { S.n = +b.dataset.n; findBest(); setPath(); place(); ui.render(); }));
        el.querySelectorAll("input[data-k]").forEach((r) => {
          r.addEventListener("input", () => { S[r.dataset.k] = +r.value; place(); const b = r.parentElement.querySelector("b"); if (b) b.textContent = (r.dataset.k === "paz" && S.paz > 0 ? "+" : "") + r.value + "°"; });
          r.addEventListener("change", () => { ui.render(); const E = dayKwh(S.n, S.tilt * DEG, S.paz * DEG); if (stage() !== "uni" && S.best && E / S.best.e >= 0.95) star("quyosh", ui.el.querySelector("[data-star]")); });
        });
        el.querySelector("[data-play]").addEventListener("click", () => { S.play = !S.play; ui.render(); });
      };
      ui.task = () => {
        const d = sunPos(172, 12);
        return { q: { uz: "21 июнда (n = 172) Тошкентда (φ = 41,3°) қуёш туш пайтида уфқдан неча градус баландликда бўлади? (δ ни формуладан ҳисобланг)", ru: "На какой высоте над горизонтом солнце в полдень 21 июня (n = 172) в Ташкенте (φ = 41,3°), в градусах? (δ вычислите по формуле)", en: "How many degrees above the horizon is the sun at solar noon on 21 June (n = 172) in Tashkent (φ = 41.3°)? (compute δ from the formula)" }, a: d.alt / DEG, tol: 0.3, unit: "°", hint: { uz: "α = 90° − φ + δ, δ ≈ 23,44°", ru: "α = 90° − φ + δ, δ ≈ 23,44°", en: "α = 90° − φ + δ, δ ≈ 23.44°" }, dec: 1 };
      };
      findBest(); setPath(); place();
    }
  };

  /* =====================================================================
     5) 🌳 Дарахт ва CO₂
     ===================================================================== */
  const TREE = {
    id: "daraxt", icon: "🌳",
    name: { uz: "Дарахт ва CO₂", ru: "Деревья и CO₂", en: "Trees and CO₂" },
    q: { uz: "Битта одамнинг йиллик CO₂ изини қоплаш учун нечта дарахт керак?", ru: "Сколько деревьев нужно, чтобы покрыть годовой CO₂-след одного человека?", en: "How many trees does it take to offset one person's yearly CO₂?" },
    src: "Chave et al., 2014 (Global Change Biology 20:3177); IPCC 2006 Guidelines, Vol. 4 (carbon fraction 0.47); Global Carbon Budget (Uzbekistan ≈ 3.5 t CO₂/person)",
    view: { bg: "#e0f2fe", d: 9, ph: 1.0, th: 0.7, target: [0, 0.5, 0], minD: 4, maxD: 16 },
    build(v, ui) {
      const T = THREE, S = { n: 0, D: 30, Hh: 15, rho: 0.6 }, MAX = 160, KG = 22, PERSON = 3500;
      ui.goals = [
        { id: "20", t: t3("20 та дарахт экинг", "Посадите 20 деревьев", "Plant 20 trees"), ok: () => S.n >= 20 },
        { id: "person", t: t3("Бир кишининг йиллик CO₂ изини қоплайдиган ўрмон экинг", "Посадите лес, покрывающий годовой CO₂-след одного человека", "Plant a forest that offsets one person's yearly CO₂"), ok: () => S.n * KG >= PERSON },
        { id: "full", t: t3("Оролни ўрмонга айлантиринг (100+ дарахт)", "Превратите остров в лес (100+ деревьев)", "Turn the island into a forest (100+ trees)"), ok: () => S.n >= 100 }
      ];
      const island = new T.Mesh(new T.CylinderGeometry(5, 5.4, 0.5, 48), new T.MeshStandardMaterial({ color: 0x65a30d, roughness: 1 }));
      island.position.y = -0.25; v.scene.add(island);
      const factory = new T.Group(); factory.position.set(-2.8, 0, -2.2); v.scene.add(factory);
      const fb = new T.Mesh(new T.BoxGeometry(1.4, 0.8, 0.9), new T.MeshStandardMaterial({ color: 0x94a3b8 })); fb.position.y = 0.4; factory.add(fb);
      const ch = new T.Mesh(new T.CylinderGeometry(0.12, 0.15, 1.3, 12), new T.MeshStandardMaterial({ color: 0x64748b })); ch.position.set(0.4, 1.3, 0); factory.add(ch);
      const house = new T.Mesh(new T.BoxGeometry(0.8, 0.6, 0.8), new T.MeshStandardMaterial({ color: 0xfcd34d })); house.position.set(-1.4, 0.3, -2.8); v.scene.add(house);
      const roof = new T.Mesh(new T.ConeGeometry(0.65, 0.45, 4), new T.MeshStandardMaterial({ color: 0xb91c1c })); roof.position.set(-1.4, 0.82, -2.8); roof.rotation.y = Math.PI / 4; v.scene.add(roof);
      const smokeM = new T.MeshStandardMaterial({ color: 0x6b7280, transparent: true, opacity: 0.55, depthWrite: false });
      const smoke = Array.from({ length: 14 }, (_, i) => { const m = new T.Mesh(new T.SphereGeometry(0.22, 12, 8), smokeM); m.userData.t = i / 14; v.scene.add(m); return m; });
      const trunkG = new T.CylinderGeometry(0.05, 0.07, 0.4, 6), crownG = new T.ConeGeometry(0.28, 0.7, 8);
      const trunks = new T.InstancedMesh(trunkG, new T.MeshStandardMaterial({ color: 0x78350f }), MAX);
      const crowns = new T.InstancedMesh(crownG, new T.MeshStandardMaterial({ color: 0x15803d }), MAX);
      trunks.count = crowns.count = 0; v.scene.add(trunks, crowns);
      const trees = [], mtx = new T.Matrix4(), q = new T.Quaternion(), one = new T.Vector3(1, 1, 1);
      const big = new T.Group(); big.position.set(2.4, 0, 1.2); v.scene.add(big);
      const bT = new T.Mesh(new T.CylinderGeometry(1, 1.15, 1, 16), new T.MeshStandardMaterial({ color: 0x7c2d12 })); big.add(bT);
      const bC = new T.Mesh(new T.SphereGeometry(1, 20, 14), new T.MeshStandardMaterial({ color: 0x166534, roughness: 0.9 })); big.add(bC);
      const sizeBig = () => { const r = S.D / 100 / 2 * 2.2, h = S.Hh / 10; bT.scale.set(r, h * 0.55, r); bT.position.y = h * 0.275; bC.scale.set(h * 0.32 + r, h * 0.4, h * 0.32 + r); bC.position.y = h * 0.55 + h * 0.3; };
      const addTree = (x, z) => {
        if (trees.length >= MAX) return;
        if (Math.hypot(x + 2.8, z + 2.2) < 1.2 || Math.hypot(x + 1.4, z + 2.8) < 0.7 || Math.hypot(x - 2.4, z - 1.2) < 1.3) return;
        trees.push({ x, z, s: 0.05 }); S.n = trees.length;
      };
      const ray = new T.Raycaster(), ndc = new T.Vector2();
      v.onTap = (e) => {
        const r = v.canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, v.camera);
        const hit = ray.intersectObject(island)[0];
        if (hit && hit.point.y > -0.05) { addTree(hit.point.x, hit.point.z); ui.render(); }
      };
      v.updaters.push((dt) => {
        trees.forEach((t, i) => {
          t.s = Math.min(1, t.s + dt * 1.5);
          mtx.compose(new T.Vector3(t.x, 0.2 * t.s, t.z), q, one.clone().multiplyScalar(t.s)); trunks.setMatrixAt(i, mtx);
          mtx.compose(new T.Vector3(t.x, (0.4 + 0.3) * t.s, t.z), q, one.clone().multiplyScalar(t.s)); crowns.setMatrixAt(i, mtx);
        });
        trunks.count = crowns.count = trees.length;
        trunks.instanceMatrix.needsUpdate = crowns.instanceMatrix.needsUpdate = true;
        const off = clamp((S.n * KG) / PERSON, 0, 1);
        smokeM.opacity = 0.6 * (1 - off) + 0.05;
        smoke.forEach((m) => { m.userData.t = (m.userData.t + dt * 0.18) % 1; const t = m.userData.t; m.position.set(-2.4 + t * 2.6, 2 + t * 2.2, -2.2 + Math.sin(t * 7 + m.id) * 0.5); m.scale.setScalar((0.5 + t * 2.2) * (1 - off * 0.7)); });
      });
      const agb = () => 0.0673 * Math.pow(S.rho * S.D * S.D * S.Hh, 0.976);
      ui.html = () => {
        const uni = stage() === "uni", abs = S.n * KG, pct = (abs / PERSON) * 100;
        const kid = `<p class="small">👆 ${H({ uz: "Оролча устига босинг — дарахт экилади.", ru: "Нажмите на остров — посадите дерево.", en: "Tap the island to plant a tree." })}</p>
          <div class="ev-tools"><button class="btn btn-primary btn-sm" type="button" data-add="10">🌱 +10 ${H({ uz: "дарахт", ru: "деревьев", en: "trees" })}</button><button class="btn btn-ghost btn-sm" type="button" data-clear>↺</button></div>
          <div class="l3-big"><span>🌳</span><b>${S.n}</b><small>${H({ uz: "дарахт", ru: "деревьев", en: "trees" })} · ${fmt(abs / 1000, 2)} ${H({ uz: "т CO₂/йил", ru: "т CO₂/год", en: "t CO₂/yr" })}</small></div>
          <div class="pc-bar" aria-hidden="true"><i style="width:${clamp(pct, 0, 100).toFixed(0)}%"></i></div>
          <p class="small">${H({ uz: "Бир кишининг йиллик изи (≈ 3,5 т CO₂) қопланди", ru: "Покрыт годовой след одного человека (≈ 3,5 т CO₂)", en: "One person's yearly footprint (≈ 3.5 t CO₂) offset" })}: <b>${fmt(Math.min(pct, 999), 0)}%</b></p>
          <p class="small muted">${H({ uz: "Катта дарахт йилига ўртача ≈ 22 кг CO₂ ютади (тури, ёши ва иқлимга қараб 10–40 кг). Дарахт экиш муҳим, лекин чиқиндини камайтиришнинг ўрнини босмайди.", ru: "Взрослое дерево поглощает в среднем ≈ 22 кг CO₂ в год (10–40 кг в зависимости от вида, возраста и климата). Посадка деревьев важна, но не заменяет сокращение выбросов.", en: "A mature tree absorbs ≈ 22 kg CO₂ a year on average (10–40 kg by species, age and climate). Planting matters but does not replace cutting emissions." })}</p>`;
        if (!uni) return kid + `<p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Бир кишининг изини тўлиқ қоплаш учун етарли дарахт экинг (≈ 160 та).", ru: "Посадите столько деревьев, чтобы покрыть след одного человека (≈ 160).", en: "Plant enough trees to offset one person's footprint (≈ 160)." })}</p>`;
        const a = agb(), c = a * 0.47, co2 = (c * 44) / 12;
        return kid + `<h4 class="l3-h">🌲 ${H({ uz: "Битта дарахтдаги углерод (аллометрия)", ru: "Углерод в одном дереве (аллометрия)", en: "Carbon in one tree (allometry)" })}</h4>
          <label>${H({ uz: "Диаметр D (1,3 м баландликда)", ru: "Диаметр D (на высоте 1,3 м)", en: "Diameter D (at 1.3 m)" })}: <b>${S.D} cm</b><input type="range" data-k="D" min="5" max="80" step="1" value="${S.D}"></label>
          <label>${H({ uz: "Баландлик H", ru: "Высота H", en: "Height H" })}: <b>${S.Hh} m</b><input type="range" data-k="Hh" min="3" max="30" step="1" value="${S.Hh}"></label>
          <label>${H({ uz: "Ёғоч зичлиги ρ", ru: "Плотность древесины ρ", en: "Wood density ρ" })}: <b>${fmt(S.rho, 2)} g/cm³</b><input type="range" data-k="rho" min="0.3" max="0.9" step="0.05" value="${S.rho}"></label>
          <div class="lab-formula">AGB = 0,0673·(ρD²H)^0,976 = <b>${fmt(a, 0)}</b> kg<br>C = 0,47·AGB = <b>${fmt(c, 0)}</b> kg · CO₂ = C·44/12 = <b>${fmt(co2, 0)}</b> kg</div>`;
      };
      ui.bind = (el) => {
        const chk = () => { if (stage() !== "uni" && S.n * KG >= PERSON) star("daraxt", ui.el.querySelector("[data-star]")); };
        el.querySelector("[data-add]").addEventListener("click", () => { for (let i = 0, k = 0; i < 10 && k < 200; k++) { const r = 1 + Math.random() * 3.6, a = Math.random() * 6.283, before = trees.length; addTree(r * Math.cos(a), r * Math.sin(a)); if (trees.length > before) i++; } ui.render(); chk(); });
        el.querySelector("[data-clear]").addEventListener("click", () => { trees.length = 0; S.n = 0; ui.render(); });
        el.querySelectorAll("input[data-k]").forEach((r) => {
          r.addEventListener("input", () => { S[r.dataset.k] = +r.value; sizeBig(); });
          r.addEventListener("change", () => ui.render());
        });
        chk();
      };
      ui.task = () => ({ q: { uz: "Дарахт: D = 30 см, H = 15 м, ёғоч зичлиги ρ = 0,6 г/см³. Chave (2014) формуласи бўйича ер усти биомассаси AGB неча кг?", ru: "Дерево: D = 30 см, H = 15 м, плотность ρ = 0,6 г/см³. Какова надземная биомасса AGB по формуле Chave (2014), кг?", en: "A tree: D = 30 cm, H = 15 m, wood density ρ = 0.6 g/cm³. What is its above-ground biomass AGB by the Chave (2014) formula, in kg?" }, a: 0.0673 * Math.pow(0.6 * 900 * 15, 0.976), tol: 8, unit: "kg", hint: { uz: "AGB = 0,0673·(0,6·30²·15)^0,976", ru: "AGB = 0,0673·(0,6·30²·15)^0,976", en: "AGB = 0.0673·(0.6·30²·15)^0.976" }, dec: 0 });
      sizeBig();
    }
  };

  /* =====================================================================
     6) 🧪 Пластикни суюқликда саралаш — Архимед кучи (сузиш–чўкиш)
     ===================================================================== */
  const POLY = [
    ["pp", 5, 0.905, 0xf97316, { uz: "ПП", ru: "ПП", en: "PP" }, { uz: "қопқоқ, контейнер", ru: "крышки, контейнеры", en: "caps, containers" }],
    ["ldpe", 4, 0.92, 0xfacc15, { uz: "ПЭНП", ru: "ПЭНП", en: "LDPE" }, { uz: "пакет, плёнка", ru: "пакеты, плёнка", en: "bags, film" }],
    ["hdpe", 2, 0.955, 0xf1f5f9, { uz: "ПЭВП", ru: "ПЭВП", en: "HDPE" }, { uz: "шампун ва сут идиши", ru: "флаконы, бутылки для молока", en: "shampoo and milk bottles" }],
    ["ps", 6, 1.05, 0xa855f7, { uz: "ПС", ru: "ПС", en: "PS" }, { uz: "бир марталик стакан", ru: "одноразовые стаканы", en: "disposable cups" }],
    ["pet", 1, 1.38, 0x38bdf8, { uz: "ПЭТ", ru: "ПЭТ", en: "PET" }, { uz: "ичимлик бутилкаси", ru: "бутылки для напитков", en: "drink bottles" }],
    ["pvc", 3, 1.4, 0x475569, { uz: "ПВХ", ru: "ПВХ", en: "PVC" }, { uz: "қувур, дераза профили", ru: "трубы, оконный профиль", en: "pipes, window profiles" }]
  ];
  const FLOT = {
    id: "flotatsiya", icon: "🧪",
    name: { uz: "Пластикни сувда саралаш", ru: "Сортировка пластика в жидкости", en: "Sink–float plastic sorting" },
    q: { uz: "Майдаланган пластик бўлакларини сувга солсак, қайсилари сузади ва қайсилари чўкади? Буни саралашда қандай ишлатса бўлади?", ru: "Если бросить измельчённый пластик в воду, какие кусочки всплывут, а какие утонут? Как это использовать для сортировки?", en: "If we drop shredded plastic into water, which pieces float and which sink? How can we use this for sorting?" },
    src: {
      uz: "Клинков А.С. ва бошқ. «Рециклинг и утилизация тары и упаковки», ТГТУ, 2010 (флотация, оғир муҳитда ажратиш); полимер зичликлари — Brandrup & Immergut, Polymer Handbook, 4th ed.; NaCl эритмаси зичлиги — CRC Handbook of Chemistry and Physics",
      ru: "Клинков А.С. и др. «Рециклинг и утилизация тары и упаковки», ТГТУ, 2010 (флотация, разделение в тяжёлых средах); плотности полимеров — Brandrup & Immergut, Polymer Handbook, 4th ed.; плотность раствора NaCl — CRC Handbook of Chemistry and Physics",
      en: "Klinkov A.S. et al. Recycling and Disposal of Containers and Packaging, TSTU, 2010 (flotation, heavy-media separation); polymer densities — Brandrup & Immergut, Polymer Handbook, 4th ed.; NaCl solution density — CRC Handbook of Chemistry and Physics",
    },
    view: { bg: "#e0f2fe", d: 5.4, ph: 1.2, th: 0.5, target: [0, 0.75, 0], minD: 2.5, maxD: 10 },
    presets: [
      [0.93, { uz: "Спирт + сув", ru: "Спирт + вода", en: "Alcohol + water" }, { uz: "≈ 45 % спирт", ru: "≈ 45 % спирта", en: "≈ 45% alcohol" }, "🥃"],
      [1.0, { uz: "Тоза сув", ru: "Чистая вода", en: "Plain water" }, { uz: "20 °C", ru: "20 °C", en: "20 °C" }, "💧"],
      [1.1, { uz: "Тузли сув", ru: "Солёная вода", en: "Salt water" }, { uz: "≈ 14 % NaCl", ru: "≈ 14 % NaCl", en: "≈ 14% NaCl" }, "🧂"],
      [1.2, { uz: "Тўйинган туз эритмаси", ru: "Насыщенный рассол", en: "Saturated brine" }, { uz: "≈ 26 % NaCl", ru: "≈ 26 % NaCl", en: "≈ 26% NaCl" }, "🌊"]
    ],
    build(v, ui) {
      const T = THREE, S = { rho: 1.0, seen: new Set([1.0]) };
      ui.goals = [
        { id: "three", t: t3("Учта суюқликни ҳам синаб кўринг", "Попробуйте все три жидкости", "Try all three liquids"), ok: () => S.seen.size >= 3 },
        { id: "sep", t: t3("Пластикларни сузувчи ва чўкувчига ажратинг", "Разделите пластики на всплывающие и тонущие", "Split the plastics into floaters and sinkers"), ok: () => sep() }
      ];
      const LX = 3, HY = 1.7, WZ = 1.5, NPER = 14;
      const g = new T.Group(); g.position.set(-LX / 2, 0, -WZ / 2); v.scene.add(g);
      const box = new T.BoxGeometry(LX, HY, WZ);
      const liquid = new T.Mesh(box, new T.MeshStandardMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.2, depthWrite: false }));
      liquid.position.set(LX / 2, HY / 2, WZ / 2); g.add(liquid);
      const edges = new T.LineSegments(new T.EdgesGeometry(box), new T.LineBasicMaterial({ color: 0x1e3a8a }));
      edges.position.copy(liquid.position); g.add(edges);
      const surf = new T.Mesh(new T.PlaneGeometry(LX, WZ), new T.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.35, side: T.DoubleSide, depthWrite: false }));
      surf.rotation.x = -Math.PI / 2; surf.position.set(LX / 2, HY - 0.001, WZ / 2); g.add(surf);
      const floor = new T.Mesh(new T.BoxGeometry(LX + 0.2, 0.06, WZ + 0.2), new T.MeshStandardMaterial({ color: 0x94a3b8 }));
      floor.position.set(LX / 2, -0.03, WZ / 2); g.add(floor);
      const lTop = textSprite("⬆ " + L({ uz: "сузади", ru: "всплывает", en: "floats" }), "#047857", 0.24); lTop.position.set(LX + 0.55, HY - 0.1, WZ / 2); g.add(lTop);
      const lBot = textSprite("⬇ " + L({ uz: "чўкади", ru: "тонет", en: "sinks" }), "#b91c1c", 0.24); lBot.position.set(LX + 0.55, 0.15, WZ / 2); g.add(lBot);
      let lRho = null;
      const label = () => {
        if (lRho) { g.remove(lRho); lRho.material.map.dispose(); lRho.material.dispose(); }
        lRho = textSprite("ρ = " + fmt(S.rho, 2) + (lang() === "en" ? " g/cm³" : " г/см³"), "#1e3a8a", 0.3); lRho.position.set(LX / 2, HY + 0.35, WZ / 2); g.add(lRho);
      };
      /* Бўлаклар: ҳар полимердан NPER та ясси бўлак (флекс) */
      const N = POLY.length * NPER, im = new T.InstancedMesh(new T.BoxGeometry(0.16, 0.025, 0.11), new T.MeshStandardMaterial({ roughness: 0.55 }), N);
      g.add(im);
      const col = new T.Color(), mtx = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), sc = new T.Vector3(1, 1, 1), pos = new T.Vector3();
      const F = Array.from({ length: N }, (_, i) => ({ t: Math.floor(i / NPER), x: 0, y: 0, z: 0, a: 0, b: 0, s: 0 }));
      const stir = () => F.forEach((f) => { f.x = 0.15 + Math.random() * (LX - 0.3); f.z = 0.12 + Math.random() * (WZ - 0.24); f.y = 0.3 + Math.random() * (HY - 0.6); f.a = Math.random() * 6.28; f.b = Math.random() * 6.28; f.s = Math.random(); });
      stir();
      F.forEach((f, i) => { col.setHex(POLY[f.t][3]); im.setColorAt(i, col); });
      v.updaters.push((dt, t) => {
        F.forEach((f, i) => {
          const d = S.rho - POLY[f.t][2];
          /* Сузиш тезлиги (визуал): Архимед кучи фарқи |Δρ| га мутаносиб */
          const sp = Math.sign(d) * clamp(Math.abs(d) * 4, 0.12, 1.1);
          const top = HY - 0.02 - f.s * 0.05, bot = 0.03 + f.s * 0.09;
          f.y = clamp(f.y + sp * dt, bot, top);
          const moving = f.y > bot + 0.001 && f.y < top - 0.001;
          if (moving) { f.a += dt * 1.6; f.b += dt * 1.1; }
          const bob = f.y >= top - 0.001 ? Math.sin(t * 2 + f.s * 6) * 0.008 : 0;
          e.set(moving ? Math.sin(f.a) * 0.6 : 0.05 * Math.sin(f.s * 9), f.b, moving ? Math.cos(f.a) * 0.4 : 0);
          q.setFromEuler(e); pos.set(f.x, f.y + bob, f.z);
          mtx.compose(pos, q, sc); im.setMatrixAt(i, mtx);
        });
        im.instanceMatrix.needsUpdate = true;
      });
      const floats = () => POLY.filter((p) => p[2] < S.rho);
      const draw = () => {
        const k = clamp((S.rho - 0.85) / 0.55, 0, 1);
        liquid.material.color.setHSL(lerp(0.6, 0.47, k), 0.75, lerp(0.7, 0.55, k));
        liquid.material.opacity = 0.16 + k * 0.14;
        label(); ui.render();
      };
      const sep = () => S.rho > 1.05 && S.rho < 1.38;
      ui.html = () => {
        const uni = stage() === "uni", fl = floats();
        const nm = (p) => `<span class="l3-dot" style="background:#${p[3].toString(16).padStart(6, "0")}"></span>${H(p[4])}`;
        const legend = `<div class="l3-legend">${POLY.map((p) => `<span><i style="background:#${p[3].toString(16).padStart(6, "0")}"></i>${p[1]} ${H(p[4])}</span>`).join("")}</div>`;
        const pre = this.presets.map(([r, n, d, i]) => `<button type="button" class="sg-opt l3-pre ${Math.abs(r - S.rho) < 0.001 ? "sel" : ""}" data-r="${r}"><b>${i} ${fmt(r, 2)}</b><span>${H(n)}</span><small>${H(d)}</small></button>`).join("");
        const res = `<p class="lab-out">⬆ <b>${H({ uz: "Сузади", ru: "Всплывают", en: "Float" })}:</b> ${fl.length ? fl.map(nm).join(", ") : "—"}<br>⬇ <b>${H({ uz: "Чўкади", ru: "Тонут", en: "Sink" })}:</b> ${POLY.filter((p) => p[2] >= S.rho).map(nm).join(", ") || "—"}</p>`;
        const stirB = `<button type="button" class="btn btn-ghost btn-sm" data-stir>🥄 ${H({ uz: "Аралаштириш", ru: "Перемешать", en: "Stir" })}</button>`;
        if (!uni) {
          const tip = S.rho < 0.95 ? { uz: "Спиртли сувда фақат энг енгил ПП ва ПЭНП сузади: улар бир-биридан ҳам ажрайди.", ru: "В спиртовой воде всплывают только самые лёгкие ПП и ПЭНП.", en: "In alcohol–water only the lightest PP and LDPE float." } : S.rho < 1.04 ? { uz: "Сувда полиолефинлар (ПП, ПЭ) сузади, қолганлари чўкади. Заводда шу усул билан ПЭТ бутилкадан қопқоқ ажратилади!", ru: "В воде всплывают полиолефины (ПП, ПЭ), остальное тонет. Так на заводе отделяют крышки от ПЭТ-бутылок!", en: "In water polyolefins (PP, PE) float and the rest sinks. Plants separate caps from PET bottles this way!" } : { uz: "Тузли сув оғирроқ: энди ПС ҳам сузади, ПЭТ ва ПВХ эса чўкади.", ru: "Солёная вода тяжелее: теперь всплывает и ПС, а ПЭТ и ПВХ тонут.", en: "Salt water is heavier: now PS floats too, while PET and PVC sink." };
          return `<div class="l3-pres">${pre}</div>${legend}${res}
            <p class="small">💡 ${H(tip)}</p>${stirB}
            <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "ПС стаканни (6) ПЭТ бутилкадан (1) ажратадиган суюқликни топинг: ПС сузсин, ПЭТ чўксин.", ru: "Найдите жидкость, которая отделит стаканчики ПС (6) от бутылок ПЭТ (1): ПС всплывает, ПЭТ тонет.", en: "Find the liquid that separates PS cups (6) from PET bottles (1): PS floats, PET sinks." })}</p>`;
        }
        const rows = POLY.map((p) => { const d = S.rho - p[2]; return `<tr><td>${p[1]} ${nm(p)}</td><td>${fmt(p[2], 3)}</td><td>${d > 0 ? "⬆" : "⬇"} ${fmt(Math.abs(d) * 9.81, 2)}</td></tr>`; }).join("");
        return `<label>${H({ uz: "Суюқлик зичлиги", ru: "Плотность жидкости", en: "Liquid density" })} ρ<sub>c</sub>: <b>${fmt(S.rho, 2)} g/cm³</b><input type="range" data-k="rho" min="0.8" max="1.5" step="0.01" value="${S.rho}"></label>
          <div class="l3-pres mini">${pre}</div>
          <table class="l3-tbl"><thead><tr><th>${H({ uz: "Полимер", ru: "Полимер", en: "Polymer" })}</th><th>ρ, g/cm³</th><th>${H({ uz: "Натижавий куч, мН/см³", ru: "Результирующая сила, мН/см³", en: "Net force, mN/cm³" })}</th></tr></thead><tbody>${rows}</tbody></table>
          <div class="lab-formula">F = (ρ<sub>c</sub> − ρ<sub>p</sub>) · V · g &nbsp;→&nbsp; F &gt; 0 ⬆, F &lt; 0 ⬇</div>
          ${res}${stirB}
          <p class="small muted">${H({ uz: "ПЭТ (1,33–1,40) ва ПВХ (1,35–1,45) зичликлари устма-уст тушади, шунинг учун уларни флотация билан ажратиб бўлмайди: бунинг учун ИҚ ёки рентген сканерли автоматик саралаш керак. Ҳақиқий бўлакларда ҳаво пуфакчалари, ёрлиқ ва тўлдирувчилар зичликни ўзгартиради, шу сабабли суюқлик сирт фаол модда билан аралаштирилади.", ru: "Плотности ПЭТ (1,33–1,40) и ПВХ (1,35–1,45) перекрываются, поэтому флотацией их не разделить: нужна автоматическая сортировка с ИК- или рентгеновским сканером. В реальности пузырьки воздуха, этикетки и наполнители меняют плотность, поэтому в жидкость добавляют ПАВ.", en: "PET (1.33–1.40) and PVC (1.35–1.45) densities overlap, so flotation cannot separate them: automatic sorting with NIR or X-ray scanners is needed. In real flakes, air bubbles, labels and fillers shift the density, so a surfactant is added to the liquid." })}</p>`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => {
          S.rho = +b.dataset.r; S.seen.add(S.rho); draw();
          if (stage() !== "uni" && sep()) star("flotatsiya", ui.el.querySelector("[data-star]"));
        }));
        const r = el.querySelector("input[data-k]");
        if (r) {
          r.addEventListener("input", () => { S.rho = +r.value; const b = r.parentElement.querySelector("b"); if (b) b.textContent = fmt(S.rho, 2) + " g/cm³"; });
          r.addEventListener("change", () => { S.rho = +r.value; draw(); });
        }
        el.querySelector("[data-stir]").addEventListener("click", stir);
      };
      ui.task = () => ({ q: { uz: "ПЭТ бўлаги: V = 1 см³, ρ = 1,38 г/см³, сувда (ρ = 1,00 г/см³). Бўлакни тубга тортувчи натижавий куч неча мН? (g = 9,81 м/с²)", ru: "Кусочек ПЭТ: V = 1 см³, ρ = 1,38 г/см³, в воде (ρ = 1,00 г/см³). Какова результирующая сила, тянущая его на дно, мН? (g = 9,81 м/с²)", en: "A PET flake: V = 1 cm³, ρ = 1.38 g/cm³, in water (ρ = 1.00 g/cm³). What net force pulls it to the bottom, in mN? (g = 9.81 m/s²)" }, a: 0.38 * 9.81, tol: 0.05, unit: "mN", hint: { uz: "F = (1380 − 1000) кг/м³ · 10⁻⁶ м³ · 9,81, сўнг ×1000", ru: "F = (1380 − 1000) кг/м³ · 10⁻⁶ м³ · 9,81, затем ×1000", en: "F = (1380 − 1000) kg/m³ · 10⁻⁶ m³ · 9.81, then ×1000" } });
      draw();
    }
  };

  /* =====================================================================
     7) ⚙️ Полиолефин чиқиндисини гранулалаш линияси — модда баланси
     ===================================================================== */
  const ST = [
    ["sort", "🧺", { uz: "Саралаш", ru: "Сортировка", en: "Sorting" }, 0x22c55e],
    ["shred", "✂️", { uz: "Майдалаш", ru: "Измельчение", en: "Shredding" }, 0xf59e0b],
    ["wash", "🫧", { uz: "Ювиш", ru: "Мойка", en: "Washing" }, 0x3b82f6],
    ["cent", "🌀", { uz: "Центрифуга", ru: "Центрифуга", en: "Centrifuge" }, 0x06b6d4],
    ["dry", "♨️", { uz: "Қуритиш", ru: "Сушка", en: "Drying" }, 0xef4444],
    ["extr", "⚙️", { uz: "Экструдер", ru: "Экструдер", en: "Extruder" }, 0x8b5cf6]
  ];
  const LINE = {
    id: "liniya", icon: "⚙️",
    name: { uz: "Гранулалаш линияси", ru: "Линия грануляции", en: "Pelletizing line" },
    q: { uz: "Ифлос пластик идишдан тоза гранула олиш учун қайси машиналар керак ва биттаси ўчирилса нима бўлади?", ru: "Какие машины нужны, чтобы из грязной пластиковой тары получить чистые гранулы, и что будет, если выключить одну из них?", en: "Which machines turn dirty plastic packaging into clean pellets, and what happens if one is switched off?" },
    src: {
      uz: "Клинков А.С. ва бошқ. «Рециклинг и утилизация тары и упаковки», ТГТУ, 2010, 2-боб (полиолефин чиқиндисини тайёрлаш: аралашма ≤ 5 %, бўлак 2–9 мм, центрифугадан кейин намлик 10–15 %, қуритгичдан кейин 0,2 %); буғланиш иссиқлиги r = 2257 кЖ/кг",
      ru: "Клинков А.С. и др. «Рециклинг и утилизация тары и упаковки», ТГТУ, 2010, гл. 2 (подготовка отходов полиолефинов: примеси ≤ 5 %, хлопья 2–9 мм, влажность после центрифуги 10–15 %, после сушилки 0,2 %); теплота парообразования r = 2257 кДж/кг",
      en: "Klinkov A.S. et al. Recycling and Disposal of Containers and Packaging, TSTU, 2010, ch. 2 (polyolefin waste preparation: impurities ≤ 5%, flakes 2–9 mm, moisture 10–15% after the centrifuge and 0.2% after the dryer); heat of vaporisation r = 2257 kJ/kg",
    },
    view: { bg: "#e2e8f0", d: 12.5, ph: 1.12, th: 0.18, target: [0.6, 0.7, 0], minD: 4, maxD: 20, auto: false },
    msgs: {
      sort: { uz: "Саралаш ўчиқ: ПВХ ва ПЭТ бўлаклари аралашди — гранула ранги ҳар хил ва мўрт.", ru: "Сортировка выключена: примешались ПВХ и ПЭТ — гранулы разноцветные и хрупкие.", en: "Sorting is off: PVC and PET got mixed in — pellets are multicoloured and brittle." },
      shred: { uz: "Майдалагич ўчиқ: бутун идишлар экструдерга сиғмайди — линия тиқилиб қолди!", ru: "Дробилка выключена: целая тара не проходит в экструдер — линия забилась!", en: "The shredder is off: whole containers do not fit the extruder — the line is jammed!" },
      wash: { uz: "Ювиш ўчиқ: ёрлиқ, ёғ ва қум қолди — гранула кир ва жигарранг.", ru: "Мойка выключена: остались этикетки, жир и песок — гранулы грязные, бурые.", en: "Washing is off: labels, grease and sand remain — pellets are dirty and brown." },
      cent: { uz: "Центрифуга ўчиқ: бўлакларда сув жуда кўп, қуритгич улгурмайди — гранулада ғоваклар.", ru: "Центрифуга выключена: воды слишком много, сушилка не справляется — в гранулах поры.", en: "The centrifuge is off: too much water, the dryer cannot cope — pellets have pores." },
      dry: { uz: "Қуритиш ўчиқ: намлик 10–15 % — экструдерда буғ пуфакчалари ҳосил бўлади, гранула ғовак.", ru: "Сушка выключена: влажность 10–15 % — в экструдере образуется пар, гранулы пористые.", en: "Drying is off: 10–15% moisture turns to steam in the extruder — pellets are porous." },
      extr: { uz: "Экструдер ўчиқ: тоза флекс бор, лекин гранула чиқмаяпти.", ru: "Экструдер выключен: чистые хлопья есть, но гранул нет.", en: "The extruder is off: clean flakes are ready, but no pellets come out." }
    },
    build(v, ui) {
      const T = THREE, S = { on: ST.map(() => true), tried: new Set(), G: 1000, x: 5, w1: 12, eta: 60 };
      ui.goals = [
        { id: "off", t: t3("Камида 3 та машинани ўчириб, нима бузилишини кўринг", "Выключите хотя бы 3 машины и посмотрите, что сломается", "Switch off 3 or more machines and see what breaks"), ok: () => S.tried.size >= 3 },
        { id: "best", t: t3("Энг юқори сифатли гранула олинг", "Получите гранулы высшего качества", "Make top-quality pellets"), ok: () => S.tried.size >= 1 && grade() === 3 }
      ];
      /* Тор (телефон) экранда бутун линия кўринсин */
      if (v.camera && v.camera.aspect < 1.2) { v.home.d = v.d = 12.5 * 1.3 / Math.max(0.6, v.camera.aspect); v.place(); }
      const XS = [-5, -3, -1, 1, 3, 5], BY = 0.42, END = 6.2;
      const belt = new T.Mesh(new T.BoxGeometry(END + 6.6, 0.06, 0.62), new T.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }));
      belt.position.set((END - 6.6) / 2, BY - 0.04, 0); v.scene.add(belt);
      for (let x = -6.2; x <= END; x += 1.1) { const leg = new T.Mesh(new T.BoxGeometry(0.06, BY - 0.07, 0.06), new T.MeshStandardMaterial({ color: 0x64748b })); leg.position.set(x, (BY - 0.07) / 2, 0.26); v.scene.add(leg); const l2 = leg.clone(); l2.position.z = -0.26; v.scene.add(l2); }
      const floor = new T.Mesh(new T.PlaneGeometry(16, 5), new T.MeshStandardMaterial({ color: 0xcbd5e1 }));
      floor.rotation.x = -Math.PI / 2; v.scene.add(floor);
      /* Машиналар: танага қараб шакл, ўчирилса кулранг ва ярим шаффоф */
      const bodies = [], spin = [];
      ST.forEach(([id, ic, nm, c], i) => {
        const gr = new T.Group(); gr.position.x = XS[i]; v.scene.add(gr);
        const mat = new T.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.15, transparent: true, opacity: 0.92 });
        let body;
        if (id === "wash") { body = new T.Mesh(new T.BoxGeometry(1.2, 0.75, 1.0), mat); body.position.y = 0.42; }
        else if (id === "cent") { body = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 0.95, 28), mat); body.position.y = 0.8; }
        else if (id === "extr") { body = new T.Mesh(new T.CylinderGeometry(0.26, 0.26, 1.3, 24), mat); body.rotation.z = Math.PI / 2; body.position.y = 0.62; }
        else { body = new T.Mesh(new T.BoxGeometry(1.05, 0.85, 0.95), mat); body.position.y = 0.85; }
        gr.add(body); bodies.push(body);
        if (id === "shred") for (let k = -1; k <= 1; k += 2) { const kn = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.8, 6), new T.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.8, roughness: 0.3 })); kn.rotation.x = Math.PI / 2; kn.position.set(k * 0.16, 1.32, 0); gr.add(kn); spin.push([kn, "y", k * 6, i]); }
        if (id === "cent") spin.push([body, "y", 5, i]);
        if (id === "extr") {
          const hop = new T.Mesh(new T.CylinderGeometry(0.34, 0.1, 0.5, 20, 1, true), new T.MeshStandardMaterial({ color: 0xa78bfa, side: T.DoubleSide })); hop.position.set(-0.4, 1.05, 0); gr.add(hop);
          for (let k = 0; k < 4; k++) { const rg = new T.Mesh(new T.TorusGeometry(0.27, 0.025, 8, 24), new T.MeshStandardMaterial({ color: 0x4c1d95 })); rg.rotation.y = Math.PI / 2; rg.position.set(-0.45 + k * 0.3, 0.62, 0); gr.add(rg); }
          const die = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.08, 24), new T.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.6 })); die.rotation.z = Math.PI / 2; die.position.set(0.68, 0.62, 0); gr.add(die); spin.push([die, "x", 4, i]);
        }
        if (id === "sort") { const bin = new T.Mesh(new T.BoxGeometry(0.7, 0.4, 0.5), new T.MeshStandardMaterial({ color: 0x15803d })); bin.position.set(0, 0.2, -0.85); gr.add(bin); }
        const lb = textSprite(`${i + 1}. ${L(nm)}`, "#0f172a", 0.3); lb.position.set(0, i % 2 ? 2.05 : 1.6, 0); gr.add(lb);
      });
      const pile = new T.Mesh(new T.CircleGeometry(0.6, 32), new T.MeshStandardMaterial({ color: 0x94a3b8 })); pile.rotation.x = -Math.PI / 2; pile.position.set(END + 0.35, 0.005, 0); pile.visible = false; v.scene.add(pile);
      /* Буюмлар: 0 — идиш, 1 — бўлак (флекс), 2 — гранула */
      const N = 90, IT = Array.from({ length: N }, () => ({})), flake = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial({ roughness: 0.6 }), N);
      const PN = 160, pel = new T.InstancedMesh(new T.SphereGeometry(0.045, 8, 6), new T.MeshStandardMaterial({ roughness: 0.4 }), PN);
      v.scene.add(flake, pel);
      const BASE = [0xf8fafc, 0xfef08a, 0xbae6fd], ODD = [0x38bdf8, 0x475569, 0xa855f7], DIRT = new T.Color(0x92400e);
      const col = new T.Color(), mtx = new T.Matrix4(), zero = new T.Matrix4().makeScale(0, 0, 0);
      const spawn = (o, x) => { o.x = x ?? -6.6 - Math.random() * 0.4; o.z = (Math.random() - 0.5) * 0.36; o.st = 0; o.odd = Math.random() < 0.18; o.c = o.odd ? ODD[Math.floor(Math.random() * 3)] : BASE[Math.floor(Math.random() * 3)]; o.dirty = true; o.wet = 0; o.out = 0; o.pass = 0; o.r = Math.random() * 6.28; };
      IT.forEach((o, i) => spawn(o, -6.6 + i * (12.6 / N)));
      let pi = 0, made = 0;
      const vs = new T.Vector3();
      for (let i = 0; i < PN; i++) pel.setMatrixAt(i, zero);
      const addPellet = (o) => {
        const a = Math.random() * 6.28, rr = Math.sqrt(Math.random()) * 0.5, h = (0.5 - rr) * 0.55 * Math.random() + 0.04;
        mtx.makeTranslation(END + 0.35 + rr * Math.cos(a), h, rr * Math.sin(a)); pel.setMatrixAt(pi, mtx);
        col.setHex(S.on[0] ? 0xe2e8f0 : o.c); if (o.dirty) col.lerp(DIRT, 0.65);
        if (o.wet > 0.5) col.offsetHSL(0, -0.3, 0.12);
        pel.setColorAt(pi, col); pi = (pi + 1) % PN; made++;
        pel.instanceMatrix.needsUpdate = true; if (pel.instanceColor) pel.instanceColor.needsUpdate = true;
      };
      IT.forEach((o, i) => { col.setHex(o.c); flake.setColorAt(i, col); });
      pel.setColorAt(0, col.setHex(0xe2e8f0));
      v.updaters.push((dt) => {
        spin.forEach(([m, ax, w, i]) => { if (S.on[i]) m.rotation[ax] += w * dt; });
        IT.forEach((o, i) => {
          if (o.out) { /* саралашда ажратилган бўлак қутига тушади */
            o.z -= dt * 1.6; o.y = Math.max(0.3, (o.y ?? BY) - dt * 1.2);
            if (o.z < -0.85) spawn(o);
          } else {
            o.x += dt * 1.15;
            for (let k = 0; k < 6; k++) {
              if (o.pass > k || o.x < XS[k] + 0.3) continue;
              o.pass = k + 1;
              if (!S.on[k]) continue;
              if (k === 0 && o.odd) { o.out = 1; o.y = BY; }
              if (k === 1) o.st = 1;
              if (k === 2) { o.dirty = false; o.wet = 1; }
              if (k === 3 && o.wet) o.wet = 0.6;
              if (k === 4 && o.wet) o.wet = S.on[3] ? 0 : 0.6;
              if (k === 5) { if (o.st === 0) { spawn(o); return; } addPellet(o); spawn(o); return; }
            }
            if (o.x > END) { spawn(o); return; }
          }
          const sz = o.st === 0 ? [0.2, 0.3, 0.2] : [0.1, 0.025, 0.08];
          mtx.makeRotationY(o.r); mtx.scale(vs.set(sz[0], sz[1], sz[2])); mtx.setPosition(o.x, (o.out ? o.y : BY) + sz[1] / 2, o.z);
          flake.setMatrixAt(i, mtx);
          col.setHex(o.c); if (o.dirty) col.lerp(DIRT, 0.55); if (o.wet >= 1) col.offsetHSL(0, 0, -0.08);
          flake.setColorAt(i, col);
        });
        flake.instanceMatrix.needsUpdate = true; if (flake.instanceColor) flake.instanceColor.needsUpdate = true;
        pile.visible = made > 0;
      });
      const paint = () => ST.forEach((s, i) => { bodies[i].material.color.setHex(S.on[i] ? s[3] : 0x9ca3af); bodies[i].material.opacity = S.on[i] ? 0.92 : 0.45; });
      const issues = () => ST.map((s, i) => (S.on[i] ? null : s[0])).filter(Boolean);
      const grade = () => { const is = issues(); if (!S.on[5]) return 0; if (!S.on[1]) return 1; return is.length ? 2 : 3; };
      /* Модда баланси: G — қуруқ хомашё, x — аралашма, w1 — центрифугадан кейин, w2 — қуритгичдан кейин */
      const W2 = 0.2;
      const bal = () => { const P = S.G * (1 - S.x / 100), m1 = P / (1 - S.w1 / 100), W = (m1 * (S.w1 - W2) / 100) / (1 - W2 / 100), Q = (W * 2257) / 3600, m2 = P / (1 - W2 / 100); return { P, m1, W, Q, Pn: Q / (S.eta / 100), m2 }; };
      const draw = () => { paint(); ui.render(); };
      ui.html = () => {
        const uni = stage() === "uni", gr = grade(), is = issues();
        const sw = ST.map(([id, ic, nm], i) => `<button type="button" class="sg-opt ${S.on[i] ? "sel" : ""}" data-st="${i}" aria-pressed="${S.on[i]}"><span class="e" aria-hidden="true">${ic}</span>${i + 1}. ${H(nm)}<small>${S.on[i] ? H({ uz: "ёқиқ", ru: "вкл.", en: "on" }) : H({ uz: "ўчиқ", ru: "выкл.", en: "off" })}</small></button>`).join("");
        const big = [["⛔", { uz: "Гранула йўқ", ru: "Гранул нет", en: "No pellets" }], ["🚫", { uz: "Линия тиқилди", ru: "Линия забита", en: "Line jammed" }], ["⚠️", { uz: "Сифатсиз гранула", ru: "Некачественные гранулы", en: "Poor-quality pellets" }], ["🏆", { uz: "А сифат: тоза гранула", ru: "Качество А: чистые гранулы", en: "Grade A: clean pellets" }]][gr];
        const msg = is.length ? is.map((k) => `<li>${H(this.msgs[k])}</li>`).join("") : `<li>${H({ uz: "Барча машиналар ишламоқда: бўлак 2–9 мм, аралашма ≤ 5 %, намлик 0,2 % — гранула янги буюм учун тайёр.", ru: "Все машины работают: хлопья 2–9 мм, примесей ≤ 5 %, влажность 0,2 % — гранулы готовы для новых изделий.", en: "All machines run: 2–9 mm flakes, ≤ 5% impurities, 0.2% moisture — pellets are ready for new products." })}</li>`;
        const head = `<p class="small">${H({ uz: "Машинани босиб ёқинг ёки ўчиринг ва гранула сифати қандай ўзгаришини кузатинг.", ru: "Нажмите на машину, чтобы включить или выключить её, и следите за качеством гранул.", en: "Tap a machine to switch it on or off and watch how the pellet quality changes." })}</p><div class="lab-opts l3-line">${sw}</div>
          <div class="l3-big ${gr < 3 ? "warn" : ""}"><span>${big[0]}</span><b>${H(big[1])}</b></div><ul class="lab-out l3-list">${msg}</ul>`;
        if (!uni) return head + `<p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Камида 3 та машинани навбат билан ўчириб кўринг, кейин ҳаммасини ёқиб, «А сифат» гранула олинг.", ru: "Выключите по очереди хотя бы 3 машины, затем включите все и получите гранулы «качества А».", en: "Switch off at least 3 machines one by one, then switch all on and get grade A pellets." })} (${Math.min(3, S.tried.size)}/3)</p>`;
        const b = bal();
        return head + `<label>${H({ uz: "Хомашё (қуруқ) G", ru: "Сырьё (сухое) G", en: "Dry feed G" })}: <b>${S.G} kg/h</b><input type="range" data-k="G" min="200" max="3000" step="50" value="${S.G}"></label>
          <label>${H({ uz: "Аралашма улуши x", ru: "Доля примесей x", en: "Impurity share x" })}: <b>${S.x} %</b><input type="range" data-k="x" min="0" max="15" step="1" value="${S.x}"></label>
          <label>${H({ uz: "Центрифугадан кейин намлик w₁", ru: "Влажность после центрифуги w₁", en: "Moisture after centrifuge w₁" })}: <b>${S.w1} %</b><input type="range" data-k="w1" min="10" max="15" step="0.5" value="${S.w1}"></label>
          <label>${H({ uz: "Қуритгич ФИК η", ru: "КПД сушилки η", en: "Dryer efficiency η" })}: <b>${S.eta} %</b><input type="range" data-k="eta" min="30" max="90" step="5" value="${S.eta}"></label>
          <div class="lab-formula">P = G·(1 − x) = <b>${fmt(b.P, 0)}</b> kg/h<br>m₁ = P / (1 − w₁) = <b>${fmt(b.m1, 0)}</b> kg/h<br>W = m₁·(w₁ − w₂) / (1 − w₂) = <b>${fmt(b.W, 1)}</b> kg/h &nbsp;(w₂ = 0,2 %)<br>Q = W·r = <b>${fmt(b.Q, 1)}</b> kW &nbsp;→&nbsp; Q/η = <b>${fmt(b.Pn, 1)}</b> kW</div>
          ${S.x > 5 ? `<p class="small" style="color:#b45309">⚠️ ${H({ uz: "x > 5 %: дарсликка кўра бундай аралашмани қайта саралаш керак.", ru: "x > 5 %: по учебнику такую смесь нужно досортировать.", en: "x > 5%: per the textbook, such a mix must be re-sorted." })}</p>` : ""}
          <p class="small muted">${H({ uz: "Q — фақат сувни буғлатиш иссиқлиги (r = 2257 кЖ/кг); бўлакни ва ҳавони иситиш ҳисобга олинмаган. Солиштиринг: дарсликдаги ПЭТ линиясида қуритиш иситгичлари 4 × 30 кВт.", ru: "Q — только теплота испарения воды (r = 2257 кДж/кг); нагрев хлопьев и воздуха не учтён. Сравните: в ПЭТ-линии из учебника нагреватели сушки 4 × 30 кВт.", en: "Q covers only the heat to evaporate water (r = 2257 kJ/kg); heating the flakes and air is ignored. Compare: the textbook PET line has 4 × 30 kW dryer heaters." })}</p>`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-st]").forEach((bt) => bt.addEventListener("click", () => {
          const i = +bt.dataset.st; S.on[i] = !S.on[i]; if (!S.on[i]) S.tried.add(i); draw();
          if (stage() !== "uni" && S.tried.size >= 3 && grade() === 3) star("liniya", ui.el.querySelector("[data-star]"));
        }));
        el.querySelectorAll("input[data-k]").forEach((r) => {
          r.addEventListener("input", () => { S[r.dataset.k] = +r.value; const b = r.parentElement.querySelector("b"); if (b) b.textContent = r.value + (r.dataset.k === "G" ? " kg/h" : " %"); });
          r.addEventListener("change", () => { S[r.dataset.k] = +r.value; draw(); });
        });
      };
      ui.task = () => ({ q: { uz: "Центрифугадан 1000 кг/соат ҳўл флекс чиқмоқда, намлиги 12 %. Қуритгичдан кейин намлик 0,2 % бўлиши керак. Қуритгичда соатига неча кг сув буғланади?", ru: "После центрифуги выходит 1000 кг/ч влажных хлопьев с влажностью 12 %. После сушилки влажность должна быть 0,2 %. Сколько килограммов воды в час испаряется в сушилке?", en: "1000 kg/h of wet flakes with 12% moisture leave the centrifuge. After the dryer the moisture must be 0.2%. How many kg of water per hour evaporate in the dryer?" }, a: (1000 * (0.12 - 0.002)) / 0.998, tol: 0.6, unit: "kg/h", hint: { uz: "W = m₁·(w₁ − w₂)/(1 − w₂) = 1000·(0,12 − 0,002)/0,998", ru: "W = m₁·(w₁ − w₂)/(1 − w₂) = 1000·(0,12 − 0,002)/0,998", en: "W = m₁·(w₁ − w₂)/(1 − w₂) = 1000·(0.12 − 0.002)/0.998" }, dec: 1 });
      draw();
    }
  };

  /* =====================================================================
     8) 🏭 Тутун тарқалиши — Гаусс модели ва Паскуилл барқарорлик синфлари
     ===================================================================== */
  /* Briggs (1973) очиқ жой учун σy, σz (x — метр), Turner (1970) иш китоби бўйича */
  const SIGMA = {
    A: (x) => [0.22 * x / Math.sqrt(1 + 1e-4 * x), 0.20 * x],
    B: (x) => [0.16 * x / Math.sqrt(1 + 1e-4 * x), 0.12 * x],
    C: (x) => [0.11 * x / Math.sqrt(1 + 1e-4 * x), 0.08 * x / Math.sqrt(1 + 2e-4 * x)],
    D: (x) => [0.08 * x / Math.sqrt(1 + 1e-4 * x), 0.06 * x / Math.sqrt(1 + 1.5e-3 * x)],
    E: (x) => [0.06 * x / Math.sqrt(1 + 1e-4 * x), 0.03 * x / (1 + 3e-4 * x)],
    F: (x) => [0.04 * x / Math.sqrt(1 + 1e-4 * x), 0.016 * x / (1 + 3e-4 * x)]
  };
  const CLS = {
    A: { uz: "A — кучли беқарор (иссиқ кун, кучсиз шамол)", ru: "A — сильно неустойчивая (жаркий день, слабый ветер)", en: "A — very unstable (hot day, light wind)" },
    B: { uz: "B — ўртача беқарор", ru: "B — умеренно неустойчивая", en: "B — moderately unstable" },
    C: { uz: "C — кучсиз беқарор", ru: "C — слабо неустойчивая", en: "C — slightly unstable" },
    D: { uz: "D — нейтрал (булутли, шамолли)", ru: "D — нейтральная (облачно, ветрено)", en: "D — neutral (cloudy, windy)" },
    E: { uz: "E — кучсиз барқарор (тун)", ru: "E — слабо устойчивая (ночь)", en: "E — slightly stable (night)" },
    F: { uz: "F — барқарор (тинч тун, инверсия)", ru: "F — устойчивая (тихая ночь, инверсия)", en: "F — stable (calm night, inversion)" }
  };
  const PDK_SO2 = 0.5; // мг/м³, бир марталик максимал (ГН 2.1.6.3492-17)
  /* Ер сатҳидаги концентрация, мг/м³: C = Q/(π·u·σy·σz)·exp(−y²/2σy²)·exp(−H²/2σz²) */
  const plumeC = (Q, u, Hm, cls, x, y = 0) => {
    if (x <= 1) return 0;
    const [sy, sz] = SIGMA[cls](x);
    return (Q / (Math.PI * u * sy * sz)) * Math.exp(-(y * y) / (2 * sy * sy)) * Math.exp(-(Hm * Hm) / (2 * sz * sz)) * 1000;
  };
  const plumeMax = (Q, u, Hm, cls) => { let best = [0, 0]; for (let x = 20; x <= 20000; x *= 1.03) { const c = plumeC(Q, u, Hm, cls, x); if (c > best[0]) best = [c, x]; } return best; };
  const PLUME = {
    id: "tutun", icon: "🏭",
    name: { uz: "Тутун тарқалиши", ru: "Рассеивание дыма", en: "Smoke dispersion" },
    q: { uz: "Завод мўрисидан чиққан тутун шамолда қаерга ва қанча узоққа боради? Мўри баланд бўлса, қишлоқ ҳавоси тозароқ бўладими?", ru: "Куда и как далеко ветер уносит дым из заводской трубы? Станет ли воздух в посёлке чище, если трубу сделать выше?", en: "Where and how far does the wind carry smoke from a factory stack? Is the village air cleaner if the stack is taller?" },
    src: {
      uz: "Пулатов Х.Л. ва бошқ. «Экологик мониторинг», 2026, 4.1–4.3 (Паскуилл бўйича атмосфера барқарорлиги синфлари, шлейф турлари, hэфф = H + Δh); Turner D.B., Workbook of Atmospheric Dispersion Estimates, 1970; Briggs G.A., 1973 (σy, σz)",
      ru: "Пулатов Х.Л. и др. «Экологический мониторинг», 2026, 4.1–4.3 (классы устойчивости атмосферы по Паскуиллу, типы шлейфов, hэфф = H + Δh); Turner D.B., Workbook of Atmospheric Dispersion Estimates, 1970; Briggs G.A., 1973 (σy, σz)",
      en: "Pulatov Kh.L. et al. «Ecological Monitoring», 2026, 4.1–4.3 (Pasquill stability classes, plume types, h_eff = H + Δh); Turner D.B., Workbook of Atmospheric Dispersion Estimates, 1970; Briggs G.A., 1973 (σy, σz)"
    },
    view: { bg: "#bae6fd", d: 10.5, ph: 1.08, th: 0.32, target: [1.2, 0.9, 0], minD: 4, maxD: 20 },
    build(v, ui) {
      const T = THREE, S = { Q: 100, u: 5, H: 50, cls: "D", x: 1000, filt: false, kidH: 1, kidW: 1, seen: new Set() };
      ui.goals = [
        { id: "filt", t: t3("Мўрига тутун фильтрини ўрнатинг", "Установите фильтр на трубу", "Fit a filter on the stack"), ok: () => !!S.filt },
        { id: "calm", t: t3("Шамолсиз ҳавода (u ≤ 1,5 м/с) қишлоқда ПДК бузилмасин", "В безветрие (u ≤ 1,5 м/с) ПДК в деревне не превышена", "In calm air (u ≤ 1.5 m/s) keep the village under the limit"), ok: () => S.u <= 1.5 && plumeC(Qeff(), S.u, effH(), S.cls, S.x) < PDK_SO2 }
      ];
      const KM = 1.6; // 1 км = 1,6 саҳна бирлиги
      const SCX = -2.6; // мўри жойи
      /* Ер ва иссиқлик харитаси (концентрация) */
      const TW = 128, TH = 64, cnv = document.createElement("canvas"); cnv.width = TW; cnv.height = TH;
      const g2 = cnv.getContext("2d"), tex = new T.CanvasTexture(cnv); tex.colorSpace = T.SRGBColorSpace;
      const GW = 10, GD = 5;
      const ground = new T.Mesh(new T.PlaneGeometry(GW, GD), new T.MeshStandardMaterial({ map: tex, roughness: 1 }));
      ground.rotation.x = -Math.PI / 2; ground.position.set(SCX + GW / 2 - 0.6, 0, 0); v.scene.add(ground);
      const effH = () => S.H;
      /* Мактаб режимида чиқинди 90 г/с (баланд мўри шабадада ҳам ЧММ дан паст бўлиши учун) */
      const Qeff = () => (stage() === "uni" ? S.Q : 90) * (S.filt ? 0.1 : 1);
      const heat = () => {
        const img = g2.createImageData(TW, TH), cmax = PDK_SO2 * 2;
        for (let j = 0; j < TH; j++) for (let i = 0; i < TW; i++) {
          const xs = (i / TW) * GW - 0.6, zs = (j / TH - 0.5) * GD;
          const xm = (xs / KM) * 1000, ym = (zs / KM) * 1000;
          const c = plumeC(Qeff(), S.u, effH(), S.cls, xm, ym), f = clamp(c / cmax, 0, 1);
          const k = (j * TW + i) * 4;
          /* яшил → сариқ → қизил */
          const r = f < 0.5 ? 120 + f * 2 * 135 : 255, gg = f < 0.5 ? 190 : 190 - (f - 0.5) * 2 * 150, b = 90 - f * 60;
          img.data[k] = r; img.data[k + 1] = gg; img.data[k + 2] = b; img.data[k + 3] = 255;
        }
        g2.putImageData(img, 0, 0); tex.needsUpdate = true;
      };
      /* Завод ва мўри */
      const fac = new T.Mesh(new T.BoxGeometry(0.9, 0.5, 0.7), new T.MeshStandardMaterial({ color: 0x94a3b8 })); fac.position.set(SCX - 0.35, 0.25, 0); v.scene.add(fac);
      const stackM = new T.MeshStandardMaterial({ color: 0xb91c1c });
      const stack = new T.Mesh(new T.CylinderGeometry(0.07, 0.1, 1, 14), stackM); v.scene.add(stack);
      const stackH = () => clamp(S.H / 40, 0.4, 4.5);
      const setStack = () => { const h = stackH(); stack.scale.y = h; stack.position.set(SCX, h / 2, 0); };
      /* Қишлоқ уйлари (1 км да) */
      const houseM = new T.MeshStandardMaterial({ color: 0xfde68a }), roofM = new T.MeshStandardMaterial({ color: 0xb45309 });
      const village = new T.Group(); v.scene.add(village);
      [[0, -0.35], [0.3, 0.25], [-0.3, 0.3], [0.05, 0.75]].forEach(([dx, dz]) => {
        const hs = new T.Mesh(new T.BoxGeometry(0.22, 0.18, 0.22), houseM); hs.position.set(dx, 0.09, dz); village.add(hs);
        const rf = new T.Mesh(new T.ConeGeometry(0.19, 0.14, 4), roofM); rf.position.set(dx, 0.25, dz); rf.rotation.y = Math.PI / 4; village.add(rf);
      });
      const vLabel = textSprite("🏘", "#ffffff", 0.4); village.add(vLabel); vLabel.position.set(0, 0.6, 0);
      const setVillage = () => village.position.set(SCX + (S.x / 1000) * KM, 0, 0);
      /* Шамол стрелкаси */
      const arrow = new T.ArrowHelper(new T.Vector3(1, 0, 0), new T.Vector3(SCX - 0.4, 3.2, -1.8), 1.2, 0x0ea5e9, 0.3, 0.18); v.scene.add(arrow);
      const wl = textSprite("💨", "#ffffff", 0.35); wl.position.set(SCX + 0.2, 3.6, -1.8); v.scene.add(wl);
      /* Тутун заррачалари */
      const N = 260, im = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), new T.MeshStandardMaterial({ color: 0x6b7280, transparent: true, opacity: 0.5, depthWrite: false }), N);
      v.scene.add(im);
      const P = Array.from({ length: N }, () => ({ t: Math.random() * 6, y: 0, z: 0, gy: 0, gz: 0 }));
      const randn = () => { let a = 0; for (let i = 0; i < 4; i++) a += Math.random(); return (a - 2) * 1.7; };
      P.forEach((p) => { p.gy = randn(); p.gz = randn(); });
      const mtx = new T.Matrix4();
      v.updaters.push((dt) => {
        const sp = (S.u / 5) * 0.9, hs = stackH();
        P.forEach((p, i) => {
          p.t += dt;
          let x = p.t * sp;
          if (x > GW - 0.8) { p.t = 0; p.gy = randn(); p.gz = randn(); x = 0; }
          const xm = Math.max(5, (x / KM) * 1000), [sy, sz] = SIGMA[S.cls](xm);
          let y = hs + (p.gz * sz / 1000) * KM; if (y < 0.03) y = -y + 0.03; // ердан қайтиш (акс эттириш)
          const z = (p.gy * sy / 1000) * KM;
          const r = 0.035 + Math.min(0.16, x * 0.022);
          mtx.makeScale(r, r, r); mtx.setPosition(SCX + x, Math.min(y, 6), clamp(z, -GD / 2, GD / 2));
          im.setMatrixAt(i, mtx);
        });
        im.instanceMatrix.needsUpdate = true;
        im.material.opacity = S.filt ? 0.1 : 0.38;
      });
      const draw = () => { setStack(); setVillage(); heat(); ui.render(); };
      ui.html = () => {
        const uni = stage() === "uni", C = plumeC(Qeff(), S.u, effH(), S.cls, S.x), [cm, xm] = plumeMax(Qeff(), S.u, effH(), S.cls), r = C / PDK_SO2;
        const face = r < 0.5 ? "😊" : r < 1 ? "😐" : r < 3 ? "😷" : "🤢";
        if (!uni) {
          const hOpt = [[20, { uz: "Паст мўри", ru: "Низкая труба", en: "Short stack" }, "🏭"], [60, { uz: "Ўртача", ru: "Средняя", en: "Medium" }, "🏗️"], [150, { uz: "Баланд мўри", ru: "Высокая труба", en: "Tall stack" }, "🗼"]];
          const wOpt = [[1.5, { uz: "Енгил шабада", ru: "Лёгкий ветерок", en: "Light breeze" }, "🍃"], [5, { uz: "Шамол", ru: "Ветер", en: "Wind" }, "💨"], [10, { uz: "Кучли шамол", ru: "Сильный ветер", en: "Strong wind" }, "🌬️"]];
          const msg = r < 1 ? { uz: "Қишлоқда ҳаво тоза! Тутун юқорида тарқалиб кетди.", ru: "В посёлке чистый воздух! Дым рассеялся высоко.", en: "The village air is clean! The smoke spread out high up." } : { uz: "Қишлоқда тутун ҳиди бор. Мўрини баландроқ қилинг ёки фильтр қўйинг.", ru: "В посёлке пахнет дымом. Сделайте трубу выше или поставьте фильтр.", en: "The village smells of smoke. Make the stack taller or add a filter." };
          return `<p class="small"><b>${H({ uz: "Мўри баландлиги", ru: "Высота трубы", en: "Stack height" })}</b></p>
            <div class="lab-opts">${hOpt.map(([h, n, e]) => `<button type="button" class="sg-opt ${S.H === h ? "sel" : ""}" data-kh="${h}"><span class="e" aria-hidden="true">${e}</span>${H(n)}</button>`).join("")}</div>
            <p class="small"><b>${H({ uz: "Шамол", ru: "Ветер", en: "Wind" })}</b></p>
            <div class="lab-opts">${wOpt.map(([u, n, e]) => `<button type="button" class="sg-opt ${S.u === u ? "sel" : ""}" data-kw="${u}"><span class="e" aria-hidden="true">${e}</span>${H(n)}</button>`).join("")}</div>
            <label class="l3-check"><input type="checkbox" data-filt ${S.filt ? "checked" : ""}> 🧯 ${H({ uz: "Мўрига фильтр ўрнатиш (тутуннинг 90 % ини ушлайди)", ru: "Поставить на трубу фильтр (задерживает 90 % дыма)", en: "Put a filter on the stack (catches 90% of the smoke)" })}</label>
            <div class="l3-big ${r >= 1 ? "warn" : ""}"><span>${face}</span><b>${H(r < 1 ? { uz: "Тоза ҳаво", ru: "Чистый воздух", en: "Clean air" } : { uz: "Ифлос ҳаво", ru: "Грязный воздух", en: "Polluted air" })}</b><small>🏘 1 ${H({ uz: "км узоқликдаги қишлоқ", ru: "км — посёлок", en: "km away — village" })}</small></div>
            <p class="lab-out">${H(msg)}</p>
            <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Енгил шабадада ҳам қишлоқ ҳавосини тоза қилинг (иккита усулни синанг).", ru: "Сделайте воздух в посёлке чистым даже при лёгком ветерке (попробуйте два способа).", en: "Make the village air clean even in a light breeze (try two ways)." })}</p>`;
        }
        return `<label>${H({ uz: "Чиқинди миқдори Q (SO₂)", ru: "Выброс Q (SO₂)", en: "Emission rate Q (SO₂)" })}: <b>${S.Q} g/s</b><input type="range" data-k="Q" min="10" max="500" step="10" value="${S.Q}"></label>
          <label>${H({ uz: "Шамол тезлиги u (мўри баландлигида)", ru: "Скорость ветра u (на высоте трубы)", en: "Wind speed u (at stack height)" })}: <b>${fmt(S.u, 1)} m/s</b><input type="range" data-k="u" min="1" max="15" step="0.5" value="${S.u}"></label>
          <label>${H({ uz: "Самарали баландлик hэфф = H + Δh", ru: "Эффективная высота hэфф = H + Δh", en: "Effective height h_eff = H + Δh" })}: <b>${S.H} m</b><input type="range" data-k="H" min="10" max="250" step="5" value="${S.H}"></label>
          <label>${H({ uz: "Атмосфера барқарорлиги (Паскуилл)", ru: "Устойчивость атмосферы (Паскуилл)", en: "Atmospheric stability (Pasquill)" })}: <select data-cls>${Object.keys(CLS).map((k) => `<option value="${k}" ${k === S.cls ? "selected" : ""}>${H(CLS[k])}</option>`).join("")}</select></label>
          <label>${H({ uz: "Қишлоқгача масофа x", ru: "Расстояние до посёлка x", en: "Distance to village x" })}: <b>${S.x} m</b><input type="range" data-k="x" min="100" max="5000" step="50" value="${S.x}"></label>
          <label class="l3-check"><input type="checkbox" data-filt ${S.filt ? "checked" : ""}> 🧯 ${H({ uz: "Газ тозалаш қурилмаси (самарадорлик 90 %)", ru: "Газоочистная установка (эффективность 90 %)", en: "Gas cleaning unit (90% efficiency)" })}</label>
          <div class="lab-formula">σ<sub>y</sub>, σ<sub>z</sub> (${S.cls}, x = ${S.x} m) = <b>${fmt(SIGMA[S.cls](S.x)[0], 1)}</b>, <b>${fmt(SIGMA[S.cls](S.x)[1], 1)}</b> m<br>C(x,0,0) = Q / (π·u·σ<sub>y</sub>·σ<sub>z</sub>) · e<sup>−h²/2σz²</sup> = <b>${fmt(C, 3)}</b> mg/m³<br>C<sub>max</sub> = <b>${fmt(cm, 3)}</b> mg/m³ ${H({ uz: "масофада", ru: "на расстоянии", en: "at" })} x ≈ <b>${fmt(xm, 0)}</b> m</div>
          <div class="l3-big ${r >= 1 ? "warn" : ""}"><span>${face}</span><b>${fmt(r, 2)} ${H({ uz: "ЧММ", ru: "ПДК", en: "× limit" })}</b><small>${H({ uz: "SO₂ бир марталик ЧММ = 0,5 мг/м³", ru: "ПДК м.р. SO₂ = 0,5 мг/м³", en: "SO₂ one-time limit = 0.5 mg/m³" })}</small></div>
          <p class="small muted">${H({ uz: "Дарслик (4.3-расм) бўйича: инверсияда (F синф) шлейф юқорида «елпиғич» каби тарқалади, лекин кўтарилган инверсия ер усти концентрациясини 1,5–2 марта оширади. Беқарор об-ҳавода (A) тутун мўри яқинида ерга «босилади». Модель текис жой ва ўзгармас шамол учун; ер юзасидан тўлиқ қайтиш ҳисобга олинмаган.", ru: "По учебнику (рис. 4.3): при инверсии (класс F) шлейф расходится «веером» наверху, но приподнятая инверсия повышает приземную концентрацию в 1,5–2 раза. При неустойчивой погоде (A) дым «прижимается» к земле у трубы. Модель для ровной местности и постоянного ветра; отражение от поверхности не учтено.", en: "Per the textbook (fig. 4.3): in an inversion (class F) the plume fans out aloft, but an elevated inversion raises ground concentration 1.5–2 times. In unstable weather (A) smoke loops down to the ground near the stack. The model assumes flat terrain and steady wind; ground reflection is ignored." })}</p>`;
      };
      ui.bind = (el) => {
        const chk = () => { if (stage() !== "uni" && S.u <= 1.5 && plumeC(Qeff(), S.u, effH(), S.cls, S.x) < PDK_SO2) { S.seen.add(S.filt ? "filter" : "tall"); if (S.seen.size >= 2) star("tutun", ui.el.querySelector("[data-star]")); } };
        el.querySelectorAll("[data-kh]").forEach((b) => b.addEventListener("click", () => { S.H = +b.dataset.kh; draw(); chk(); }));
        el.querySelectorAll("[data-kw]").forEach((b) => b.addEventListener("click", () => { S.u = +b.dataset.kw; S.cls = S.u <= 1.5 ? "B" : S.u >= 10 ? "D" : "C"; draw(); chk(); }));
        const f = el.querySelector("[data-filt]"); f.addEventListener("change", () => { S.filt = f.checked; draw(); chk(); });
        const c = el.querySelector("[data-cls]"); if (c) c.addEventListener("change", () => { S.cls = c.value; draw(); });
        el.querySelectorAll("input[data-k]").forEach((r) => {
          r.addEventListener("input", () => { S[r.dataset.k] = +r.value; const b = r.parentElement.querySelector("b"); if (b) b.textContent = (r.dataset.k === "u" ? fmt(S.u, 1) : r.value) + { Q: " g/s", u: " m/s", H: " m", x: " m" }[r.dataset.k]; setStack(); setVillage(); });
          r.addEventListener("change", () => draw());
        });
      };
      ui.task = () => ({ q: { uz: "Q = 100 г/с SO₂, шамол u = 5 м/с, самарали баландлик h = 50 м, D синф (нейтрал). x = 1000 м да σy = 76,3 м, σz = 37,9 м. Шлейф ўқи остида ер сатҳидаги концентрация неча мг/м³?", ru: "Q = 100 г/с SO₂, ветер u = 5 м/с, эффективная высота h = 50 м, класс D (нейтральный). При x = 1000 м σy = 76,3 м, σz = 37,9 м. Какова приземная концентрация под осью шлейфа, мг/м³?", en: "Q = 100 g/s SO₂, wind u = 5 m/s, effective height h = 50 m, class D (neutral). At x = 1000 m σy = 76.3 m, σz = 37.9 m. What is the ground-level concentration under the plume axis, in mg/m³?" }, a: (100 / (Math.PI * 5 * 76.3 * 37.9)) * Math.exp(-2500 / (2 * 37.9 * 37.9)) * 1000, tol: 0.03, unit: "mg/m³", hint: { uz: "C = 100/(π·5·76,3·37,9)·e^(−50²/(2·37,9²)) г/м³, сўнг ×1000", ru: "C = 100/(π·5·76,3·37,9)·e^(−50²/(2·37,9²)) г/м³, затем ×1000", en: "C = 100/(π·5·76.3·37.9)·e^(−50²/(2·37.9²)) g/m³, then ×1000" }, dec: 2 });
      draw();
    }
  };

  /* =====================================================================
     9) 🏞 Дарё мониторинги — кузатув створлари ва эриган кислород (Стритер–Фелпс)
     ===================================================================== */
  const DO_SAT = { 10: 11.29, 20: 9.09, 25: 8.26, 30: 7.56 }; // мг/л, тоза сув (APHA)
  const RIVER = {
    id: "daryo", icon: "🏞",
    name: { uz: "Дарё мониторинги", ru: "Мониторинг реки", en: "River monitoring" },
    q: { uz: "Завод оқова суви дарёга тушса, сувдаги кислород қаерда энг кам бўлади? Намунани қаердан ва қандай чуқурликдан олиш керак?", ru: "Если сточные воды завода попадают в реку, где кислорода в воде будет меньше всего? Откуда и с какой глубины брать пробу?", en: "When factory wastewater enters a river, where is dissolved oxygen lowest? Where and at what depth should samples be taken?" },
    src: {
      uz: "Пулатов Х.Л. ва бошқ. «Экологик мониторинг», 2026, 6.3 (кузатув пунктлари ва створлар: фон створи манбадан 1 км юқорида, назорат створи 80 % аралашган жойда, горизонтлар сони чуқурликка қараб); Streeter H.W., Phelps E.B., 1925 (кислород тақчиллиги эгри чизиғи); кислород эрувчанлиги — APHA Standard Methods 4500-O",
      ru: "Пулатов Х.Л. и др. «Экологический мониторинг», 2026, 6.3 (пункты наблюдений и створы: фоновый створ в 1 км выше источника, контрольный — там, где смешение ≥ 80 %, число горизонтов по глубине); Streeter H.W., Phelps E.B., 1925 (кривая дефицита кислорода); растворимость кислорода — APHA Standard Methods 4500-O",
      en: "Pulatov Kh.L. et al. «Ecological Monitoring», 2026, 6.3 (monitoring points and cross-sections: background section 1 km upstream, control section where mixing ≥ 80%, number of sampling depths by river depth); Streeter H.W., Phelps E.B., 1925 (oxygen sag curve); oxygen solubility — APHA Standard Methods 4500-O"
    },
    view: { bg: "#d1fae5", d: 10, ph: 0.95, th: 0.35, target: [0.5, 0, 0], minD: 4, maxD: 18 },
    build(v, ui) {
      const T = THREE, S = { Qr: 20, Qw: 2, L: 200, kd: 0.3, ka: 0.6, temp: 20, u: 0.3, depth: 3, filt: false, posts: [-1, 0.5, 5] };
      ui.goals = [
        { id: "filt", t: t3("Заводга оқова сув тозалаш иншоотини қўйинг", "Поставьте очистные сооружения на заводе", "Add wastewater treatment at the factory"), ok: () => !!S.filt },
        { id: "summer", t: t3("Ёзги иссиқда (≥ 30 °C) ҳам дарёда O₂ ≥ 6 мг/л сақлансин", "В летнюю жару (≥ 30 °C) удержите O₂ ≥ 6 мг/л", "Keep O₂ ≥ 6 mg/L even in summer heat (≥ 30 °C)"), ok: () => S.temp >= 30 && DOat(crit()[1]) >= 6 }
      ];
      const KM = 0.25, X0 = -3.2, LEN = 32; // саҳнада 1 км = 0,25 бирлик, дарё −4 … +28 км
      const toS = (km) => X0 + km * KM;
      const Lw = () => (S.filt ? S.L * 0.1 : S.L);
      /* Аралашма: Q·c баланс; кислород тақчиллиги D = DOsat − DO */
      const mix = () => {
        const sat = DO_SAT[S.temp], DOr = sat * 0.95, DOw = 1, BODr = 2;
        const Qt = S.Qr + S.Qw;
        return { sat, L0: (S.Qr * BODr + S.Qw * Lw()) / Qt, DO0: (S.Qr * DOr + S.Qw * DOw) / Qt };
      };
      const kT = (k20, th) => k20 * Math.pow(th, S.temp - 20);
      const DOat = (km) => {
        const m = mix();
        if (km < 0) return m.sat * 0.95;
        const t = (km * 1000) / S.u / 86400, kd = kT(S.kd, 1.047), ka = kT(S.ka, 1.024), D0 = m.sat - m.DO0;
        const D = Math.abs(ka - kd) < 1e-6 ? kd * m.L0 * t * Math.exp(-kd * t) + D0 * Math.exp(-ka * t) : (kd * m.L0 / (ka - kd)) * (Math.exp(-kd * t) - Math.exp(-ka * t)) + D0 * Math.exp(-ka * t);
        return clamp(m.sat - D, 0, m.sat);
      };
      const crit = () => { let best = [99, 0]; for (let km = 0; km <= 120; km += 0.25) { const d = DOat(km); if (d < best[0]) best = [d, km]; } return best; };
      const mixPct = (km) => (km <= 0 ? 0 : 100 * (1 - Math.exp(-km / 0.6)));
      /* Дарё сатҳи (ранг — кислород) */
      const NX = 160, geo = new T.PlaneGeometry(LEN * KM, 1.6, NX, 1);
      const cols = new Float32Array(geo.attributes.position.count * 3);
      geo.setAttribute("color", new T.BufferAttribute(cols, 3));
      const river = new T.Mesh(geo, new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.05 }));
      river.rotation.x = -Math.PI / 2; river.position.set(X0 + (LEN * KM) / 2 - 4 * KM, 0.01, 0); v.scene.add(river);
      const bankM = new T.MeshStandardMaterial({ color: 0x65a30d, roughness: 1 });
      [-1.6, 1.6].forEach((z) => { const b = new T.Mesh(new T.BoxGeometry(LEN * KM, 0.12, 1.6), bankM); b.position.set(river.position.x, 0.02, z); v.scene.add(b); });
      const colAt = new T.Color();
      const paint = () => {
        const pos = geo.attributes.position, sat = DO_SAT[S.temp];
        for (let i = 0; i < pos.count; i++) {
          const xs = pos.getX(i) + river.position.x, km = (xs - X0) / KM, d = DOat(km);
          const f = clamp(d / sat, 0, 1);
          colAt.setHSL(0.03 + f * 0.52, 0.75, 0.42 + f * 0.1);
          cols[i * 3] = colAt.r; cols[i * 3 + 1] = colAt.g; cols[i * 3 + 2] = colAt.b;
        }
        geo.attributes.color.needsUpdate = true;
      };
      /* Завод ва оқова қувури */
      const fac = new T.Mesh(new T.BoxGeometry(0.7, 0.5, 0.5), new T.MeshStandardMaterial({ color: 0x94a3b8 })); fac.position.set(toS(0), 0.27, -1.3); v.scene.add(fac);
      const pipe = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.6, 10), new T.MeshStandardMaterial({ color: 0x475569 })); pipe.rotation.x = Math.PI / 2; pipe.position.set(toS(0), 0.08, -0.85); v.scene.add(pipe);
      const plume = new T.Mesh(new T.CircleGeometry(0.35, 24), new T.MeshBasicMaterial({ color: 0x78350f, transparent: true, opacity: 0.45 })); plume.rotation.x = -Math.PI / 2; plume.position.set(toS(0) + 0.2, 0.03, -0.55); v.scene.add(plume);
      /* Створлар (кузатув кесимлари) */
      const postM = new T.MeshStandardMaterial({ color: 0xf59e0b });
      const posts = S.posts.map(() => { const g = new T.Group(); const pole = new T.Mesh(new T.BoxGeometry(0.05, 0.04, 3.2), postM); pole.position.y = 0.08; g.add(pole); const lb = textSprite("•", "#7c2d12", 0.32); lb.position.set(0, 0.55, -1.75); g.add(lb); v.scene.add(g); g.userData.lb = lb; return g; });
      const setPosts = () => posts.forEach((g, i) => { g.position.x = toS(S.posts[i]); const t = textSprite(`${i + 1}`, "#7c2d12", 0.32); g.remove(g.userData.lb); g.userData.lb = t; t.position.set(0, 0.55, -1.75); g.add(t); });
      /* Балиқлар (кислород 6 мг/л дан юқори бўлган жойда) */
      const fishM = new T.MeshStandardMaterial({ color: 0xf97316 }), fish = [];
      for (let i = 0; i < 18; i++) { const f = new T.Mesh(new T.ConeGeometry(0.06, 0.2, 8), fishM); f.rotation.z = -Math.PI / 2; f.userData = { km: -3 + Math.random() * 27, z: (Math.random() - 0.5) * 1.1, ph: Math.random() * 6 }; v.scene.add(f); fish.push(f); }
      /* Оқим заррачалари */
      const flowM = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }), flow = [];
      for (let i = 0; i < 40; i++) { const m = new T.Mesh(new T.SphereGeometry(0.025, 6, 4), flowM); m.userData = { x: Math.random() * LEN * KM, z: (Math.random() - 0.5) * 1.4 }; v.scene.add(m); flow.push(m); }
      v.updaters.push((dt, t) => {
        flow.forEach((m) => { m.userData.x = (m.userData.x + dt * (0.2 + S.u)) % (LEN * KM); m.position.set(X0 - 4 * KM + m.userData.x, 0.04, m.userData.z); });
        fish.forEach((f) => {
          const ok = DOat(f.userData.km) >= 6;
          f.visible = ok;
          f.position.set(toS(f.userData.km) + Math.sin(t + f.userData.ph) * 0.15, 0.05 + Math.abs(Math.sin(t * 2 + f.userData.ph)) * 0.06, f.userData.z);
        });
        plume.material.opacity = S.filt ? 0.12 : 0.45;
      });
      const horizons = () => (S.depth <= 5 ? 1 : S.depth <= 10 ? 2 : 3);
      const postOk = (i, km) => (i === 0 ? km <= -0.9 && km >= -1.5 : mixPct(km) >= 80);
      const draw = () => { setPosts(); paint(); ui.render(); };
      ui.html = () => {
        const uni = stage() === "uni", m = mix(), [cDO, cKm] = crit();
        const pr = S.posts.map((km, i) => `<tr><td>${i + 1}</td><td>${fmt(km, 1)} km</td><td>${fmt(DOat(km), 2)}</td><td>${km < 0 ? "—" : fmt(mixPct(km), 0) + "%"}</td><td>${postOk(i, km) ? "✅" : "⚠️"}</td></tr>`).join("");
        if (!uni) {
          const happy = DOat(cKm) >= 6, nf = fish.filter((f) => DOat(f.userData.km) >= 6).length;
          return `<p class="small">${H({ uz: "Дарёнинг ранги — сувдаги кислород: кўк — кўп, жигарранг — кам. Балиқлар кислород етарли жойда яшайди.", ru: "Цвет реки — кислород в воде: синий — много, коричневый — мало. Рыбы живут там, где кислорода хватает.", en: "River colour shows oxygen in the water: blue means plenty, brown means little. Fish live where there is enough oxygen." })}</p>
            <label class="l3-check"><input type="checkbox" data-filt ${S.filt ? "checked" : ""}> 🧪 ${H({ uz: "Заводга тозалаш иншооти қуриш", ru: "Построить очистные сооружения у завода", en: "Build a treatment plant at the factory" })}</label>
            <label>🌡 ${H({ uz: "Ҳаво ҳарорати", ru: "Температура", en: "Temperature" })}: <select data-temp>${[10, 20, 25, 30].map((t) => `<option value="${t}" ${t === S.temp ? "selected" : ""}>${t} °C</option>`).join("")}</select></label>
            <div class="l3-big ${happy ? "" : "warn"}"><span>${happy ? "🐟" : "😵"}</span><b>${nf} / ${fish.length}</b><small>${H({ uz: "балиқ хурсанд", ru: "рыб довольны", en: "happy fish" })}</small></div>
            <p class="lab-out">${H(happy ? { uz: "Зўр! Дарё бутун узунлиги бўйлаб тоза — балиқлар қайтди.", ru: "Отлично! Река чистая по всей длине — рыбы вернулись.", en: "Great! The river is clean all the way — the fish are back." } : { uz: "Завод сувидан кейин кислород камайди, балиқлар кетиб қолди. Ёзда (иссиқда) сувда кислород яна ҳам кам бўлади.", ru: "После сброса завода кислорода стало мало, рыбы уплыли. Летом (в жару) кислорода в воде ещё меньше.", en: "Below the factory outlet oxygen dropped and the fish left. In summer heat water holds even less oxygen." })}</p>
            <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Иссиқ ёз кунида (30 °C) ҳам ҳамма балиқларни хурсанд қилинг.", ru: "Сделайте всех рыб довольными даже в жаркий летний день (30 °C).", en: "Make every fish happy even on a hot summer day (30 °C)." })}</p>`;
        }
        return `<label>${H({ uz: "Дарё сарфи Q<sub>д</sub>", ru: "Расход реки Q<sub>р</sub>", en: "River flow Q<sub>r</sub>" }).replace(/&lt;(\/?)sub&gt;/g, "<$1sub>")}: <b>${S.Qr} m³/s</b><input type="range" data-k="Qr" min="2" max="100" step="1" value="${S.Qr}"></label>
          <label>${H({ uz: "Оқова сув сарфи q", ru: "Расход сточных вод q", en: "Wastewater flow q" })}: <b>${fmt(S.Qw, 1)} m³/s</b><input type="range" data-k="Qw" min="0.2" max="10" step="0.2" value="${S.Qw}"></label>
          <label>${H({ uz: "Оқова сувдаги БКИ₅ (L<sub>w</sub>)", ru: "БПК₅ сточных вод (L<sub>w</sub>)", en: "Wastewater BOD₅ (L<sub>w</sub>)" }).replace(/&lt;(\/?)sub&gt;/g, "<$1sub>")}: <b>${S.L} mg/l</b><input type="range" data-k="L" min="10" max="600" step="10" value="${S.L}"></label>
          <label>${H({ uz: "Оқим тезлиги u", ru: "Скорость течения u", en: "Flow velocity u" })}: <b>${fmt(S.u, 2)} m/s</b><input type="range" data-k="u" min="0.1" max="1.5" step="0.05" value="${S.u}"></label>
          <label>${H({ uz: "Сув ҳарорати", ru: "Температура воды", en: "Water temperature" })}: <select data-temp>${[10, 20, 25, 30].map((t) => `<option value="${t}" ${t === S.temp ? "selected" : ""}>${t} °C</option>`).join("")}</select></label>
          <label>${H({ uz: "Дарё чуқурлиги", ru: "Глубина реки", en: "River depth" })}: <b>${S.depth} m</b><input type="range" data-k="depth" min="1" max="30" step="1" value="${S.depth}"></label>
          <label class="l3-check"><input type="checkbox" data-filt ${S.filt ? "checked" : ""}> 🧪 ${H({ uz: "Биологик тозалаш (БКИ 90 % камаяди)", ru: "Биологическая очистка (БПК снижается на 90 %)", en: "Biological treatment (BOD cut by 90%)" })}</label>
          <p class="small"><b>📍 ${H({ uz: "Створлар (км, 0 — оқова сув тушадиган жой)", ru: "Створы (км, 0 — место выпуска)", en: "Sampling sections (km, 0 = outfall)" })}</b></p>
          ${S.posts.map((km, i) => `<label>${i + 1}: <b>${fmt(km, 1)} km</b><input type="range" data-post="${i}" min="-3" max="25" step="0.1" value="${km}"></label>`).join("")}
          <div class="ly-rtable"><table class="l3-tbl"><tr><th>№</th><th>x</th><th>DO, mg/l</th><th>${H({ uz: "аралашиш", ru: "смешение", en: "mixing" })}</th><th></th></tr>${pr}</table></div>
          <div class="lab-formula">L₀ = (Q·L<sub>д</sub> + q·L<sub>w</sub>)/(Q + q) = <b>${fmt(m.L0, 1)}</b> mg/l · DO₀ = <b>${fmt(m.DO0, 2)}</b> mg/l<br>D(t) = k<sub>d</sub>L₀/(k<sub>a</sub>−k<sub>d</sub>)·(e<sup>−k<sub>d</sub>t</sup> − e<sup>−k<sub>a</sub>t</sup>) + D₀e<sup>−k<sub>a</sub>t</sup><br>DO<sub>min</sub> = <b>${fmt(cDO, 2)}</b> mg/l, x<sub>кр</sub> ≈ <b>${fmt(cKm, 1)}</b> km · ${H({ uz: "горизонтлар", ru: "горизонтов", en: "sampling depths" })}: <b>${horizons()}</b></div>
          <p class="small muted">${H({ uz: "Дарслик (6.3) қоидалари: 1-створ — манбадан 1 км юқорида (фон); кейингилари — оқова сув дарё суви билан камида 80 % аралашган жойда. Чуқурлик 5 м гача — 1 горизонт (юзадан 0,3 м), 5–10 м — 2 та (юза ва тубдан 0,5 м), 10–100 м — 3 та (юза, ўрта, туб). Балиқчилик сувлари учун эриган кислород одатда ≥ 6 мг/л. k<sub>d</sub> = 0,3, k<sub>a</sub> = 0,6 сут⁻¹ (20 °C) — намунавий қийматлар.", ru: "Правила учебника (6.3): створ 1 — в 1 км выше источника (фон); следующие — там, где сточные воды смешались с речной водой не менее чем на 80 %. Глубина до 5 м — 1 горизонт (0,3 м от поверхности), 5–10 м — 2 (поверхность и 0,5 м от дна), 10–100 м — 3 (поверхность, середина, дно). Для рыбохозяйственных вод растворённый кислород обычно ≥ 6 мг/л. k<sub>d</sub> = 0,3, k<sub>a</sub> = 0,6 сут⁻¹ (20 °C) — типовые значения.", en: "Textbook rules (6.3): section 1 is 1 km upstream of the source (background); the others are where wastewater has mixed with river water by at least 80%. Depth up to 5 m — 1 sampling depth (0.3 m below surface), 5–10 m — 2 (surface and 0.5 m above bed), 10–100 m — 3 (surface, middle, bed). Fishery waters usually need dissolved oxygen ≥ 6 mg/l. k<sub>d</sub> = 0.3, k<sub>a</sub> = 0.6 d⁻¹ (20 °C) are typical values." }).replace(/&lt;(\/?)sub&gt;/g, "<$1sub>")}</p>`;
      };
      ui.bind = (el) => {
        const chk = () => { if (stage() !== "uni" && S.temp >= 30 && DOat(crit()[1]) >= 6) star("daryo", ui.el.querySelector("[data-star]")); };
        const f = el.querySelector("[data-filt]"); f.addEventListener("change", () => { S.filt = f.checked; draw(); chk(); });
        const tp = el.querySelector("[data-temp]"); tp.addEventListener("change", () => { S.temp = +tp.value; draw(); chk(); });
        el.querySelectorAll("input[data-k]").forEach((r) => {
          r.addEventListener("input", () => { S[r.dataset.k] = +r.value; const b = r.parentElement.querySelector("b"); if (b) b.textContent = (["Qw", "u"].includes(r.dataset.k) ? fmt(+r.value, r.dataset.k === "u" ? 2 : 1) : r.value) + { Qr: " m³/s", Qw: " m³/s", L: " mg/l", u: " m/s", depth: " m" }[r.dataset.k]; });
          r.addEventListener("change", () => draw());
        });
        el.querySelectorAll("input[data-post]").forEach((r) => {
          r.addEventListener("input", () => { S.posts[+r.dataset.post] = +r.value; posts[+r.dataset.post].position.x = toS(+r.value); const b = r.parentElement.querySelector("b"); if (b) b.textContent = fmt(+r.value, 1) + " km"; });
          r.addEventListener("change", () => draw());
        });
      };
      ui.task = () => ({ q: { uz: "Дарё: Q = 20 м³/с, эриган кислород 9 мг/л. Завод q = 2 м³/с оқова сув ташлайди, унда кислород 1 мг/л. Тўлиқ аралашгандан кейин дарёда эриган кислород неча мг/л бўлади?", ru: "Река: Q = 20 м³/с, растворённый кислород 9 мг/л. Завод сбрасывает q = 2 м³/с сточных вод с кислородом 1 мг/л. Сколько мг/л растворённого кислорода будет в реке после полного смешения?", en: "A river: Q = 20 m³/s with 9 mg/l dissolved oxygen. A factory discharges q = 2 m³/s of wastewater with 1 mg/l oxygen. What is the dissolved oxygen in mg/l after complete mixing?" }, a: (20 * 9 + 2 * 1) / 22, tol: 0.03, unit: "mg/l", hint: { uz: "DO = (Q·DOд + q·DOw)/(Q + q) = (20·9 + 2·1)/22", ru: "DO = (Q·DOр + q·DOw)/(Q + q) = (20·9 + 2·1)/22", en: "DO = (Q·DOr + q·DOw)/(Q + q) = (20·9 + 2·1)/22" } });
      draw();
    }
  };

  /* =====================================================================
     10) 🔺 Экологик пирамида — энергия оқими (Линдеман, 10 % қоидаси)
     ===================================================================== */
  const TROPH = [
    ["🌿", { uz: "Продуцентлар", ru: "Продуценты", en: "Producers" }, { uz: "ўт, дарахт, сувўтлар", ru: "трава, деревья, водоросли", en: "grass, trees, algae" }, 0x16a34a],
    ["🐇", { uz: "I тартиб консументлар", ru: "Консументы I порядка", en: "Primary consumers" }, { uz: "ўтхўрлар: қуён, чигиртка", ru: "травоядные: заяц, кузнечик", en: "herbivores: hare, grasshopper" }, 0x84cc16],
    ["🦊", { uz: "II тартиб консументлар", ru: "Консументы II порядка", en: "Secondary consumers" }, { uz: "йиртқичлар: тулки, қурбақа", ru: "хищники: лиса, лягушка", en: "carnivores: fox, frog" }, 0xf59e0b],
    ["🦅", { uz: "III тартиб консументлар", ru: "Консументы III порядка", en: "Tertiary consumers" }, { uz: "юқори йиртқич: бургут", ru: "высший хищник: орёл", en: "top predator: eagle" }, 0xef4444]
  ];
  const KID_CHAIN = [["🌿", { uz: "Ўт", ru: "Трава", en: "Grass" }], ["🦗", { uz: "Чигиртка", ru: "Кузнечик", en: "Grasshopper" }], ["🐸", { uz: "Қурбақа", ru: "Лягушка", en: "Frog" }], ["🐍", { uz: "Илон", ru: "Змея", en: "Snake" }], ["🦅", { uz: "Бургут", ru: "Орёл", en: "Eagle" }]];
  const PYR = {
    id: "piramida", icon: "🔺",
    name: { uz: "Экологик пирамида", ru: "Экологическая пирамида", en: "Ecological pyramid" },
    q: { uz: "Нега табиатда бургут кам, ўт эса жуда кўп? Энергия озиқ занжирида қаерга йўқолади?", ru: "Почему в природе мало орлов и очень много травы? Куда теряется энергия в пищевой цепи?", en: "Why are there few eagles but lots of grass? Where does energy go along a food chain?" },
    src: {
      uz: "Нигматов А., Пулатов Х. «Экология», 2026, 2.1 (экотизимнинг трофик тузилиши, озиқ пирамидаси, Ю. Одум, 1986); Lindeman R.L., The trophic-dynamic aspect of ecology, Ecology 23:399, 1942",
      ru: "Нигматов А., Пулатов Х. «Экология», 2026, 2.1 (трофическая структура экосистемы, пищевая пирамида, Ю. Одум, 1986); Lindeman R.L., The trophic-dynamic aspect of ecology, Ecology 23:399, 1942",
      en: "Nigmatov A., Pulatov Kh. «Ecology», 2026, 2.1 (trophic structure of ecosystems, food pyramid, after E. Odum, 1986); Lindeman R.L., The trophic-dynamic aspect of ecology, Ecology 23:399, 1942"
    },
    view: { bg: "#ecfccb", d: 7.5, ph: 1.15, th: 0.7, target: [0, 1.2, 0], minD: 3, maxD: 14 },
    build(v, ui) {
      const T = THREE, S = { E: 10000, eff: 10, lv: 4, chain: [], drop: 0 };
      ui.goals = stage() === "uni" ? [
        { id: "e20", t: t3("Самарадорлик 20 % бўлса, юқори поғонага қанча етишини кўринг", "Посмотрите, сколько дойдёт до вершины при эффективности 20 %", "See how much reaches the top at 20 % efficiency"), ok: () => S.eff >= 20 },
        { id: "lv2", t: t3("Икки поғонали занжирда энергия йўқотишини солиштиринг", "Сравните потери энергии в двухуровневой цепи", "Compare energy loss in a two-level chain"), ok: () => S.lv === 2 }
      ] : [
        { id: "chain", t: t3("Озиқ занжирини тўғри тузинг", "Соберите пищевую цепь правильно", "Build the food chain correctly"), ok: () => S.chain.length === KID_CHAIN.length }
      ];
      const levels = TROPH.map(([e, n, d, c], i) => {
        const g = new T.Group(); v.scene.add(g);
        const m = new T.Mesh(new T.CylinderGeometry(1, 1, 0.5, 4, 1), new T.MeshStandardMaterial({ color: c, roughness: 0.7, transparent: true, opacity: 0.95 }));
        m.rotation.y = Math.PI / 4; g.add(m);
        const lb = textSprite(e, "#ffffff", 0.5); g.add(lb);
        g.userData = { m, lb, i };
        return g;
      });
      /* Энергия «учқунлари»: пастдан юқорига кўтарилади, ҳар поғонада кўпи иссиқлик бўлиб учиб кетади */
      const sparkM = new T.MeshBasicMaterial({ color: 0xfde047 }), heatM = new T.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0.7 });
      const sparks = Array.from({ length: 70 }, () => { const m = new T.Mesh(new T.SphereGeometry(0.045, 8, 6), sparkM); m.userData = { lv: 0, y: 0, a: Math.random() * 6.28, r: Math.random() * 0.6, heat: false, out: 0 }; v.scene.add(m); return m; });
      const layout = () => {
        let y = 0;
        levels.forEach((g, i) => {
          const on = i < S.lv, e = S.E * Math.pow(S.eff / 100, i), w = on ? clamp(Math.pow(e / S.E, 0.3) * 2.4, 0.18, 2.4) : 0.001;
          g.visible = on;
          g.userData.m.scale.set(w, 1, w); g.position.y = y + 0.25; g.userData.w = w; g.userData.y = y + 0.25;
          g.userData.lb.position.set(0, 0.55, 0);
          y += 0.55;
        });
      };
      v.updaters.push((dt) => {
        sparks.forEach((s) => {
          const u = s.userData;
          if (u.heat) { u.out += dt; s.position.x += Math.cos(u.a) * dt * 1.4; s.position.z += Math.sin(u.a) * dt * 1.4; s.position.y += dt * 0.4; if (u.out > 1.2) { u.heat = false; u.lv = 0; u.y = 0; s.material = sparkM; } return; }
          u.y += dt * 0.5;
          const lvNow = Math.floor(u.y / 0.55);
          if (lvNow > u.lv) { u.lv = lvNow; if (lvNow >= S.lv || Math.random() > S.eff / 100 * 2.2) { u.heat = true; u.out = 0; s.material = heatM; } }
          const g = levels[Math.min(u.lv, levels.length - 1)], w = (g.userData.w || 1) * 0.5;
          s.position.set(Math.cos(u.a) * u.r * w, u.y + 0.1, Math.sin(u.a) * u.r * w);
        });
      });
      const draw = () => { layout(); ui.render(); };
      ui.html = () => {
        const uni = stage() === "uni";
        const rows = TROPH.slice(0, S.lv).map(([e, n, d], i) => `<tr><td>${e}</td><td>${H(n)}<br><small class="muted">${H(d)}</small></td><td>${fmt(S.E * Math.pow(S.eff / 100, i), i > 1 ? 1 : 0)} kJ</td></tr>`).join("");
        if (!uni) {
          const done = S.chain.length === KID_CHAIN.length;
          const left = KID_CHAIN.map((x, i) => [x, i]).filter(([, i]) => !S.chain.includes(i)).sort((a, b) => ((a[1] * 7 + 3) % 5) - ((b[1] * 7 + 3) % 5));
          return `<p class="small">${H({ uz: "Озиқ занжирини тузинг: ким кимни ейди? Аввал ўсимликдан бошланг.", ru: "Соберите пищевую цепь: кто кого ест? Начните с растения.", en: "Build the food chain: who eats whom? Start with the plant." })}</p>
            <div class="l3-chain" aria-live="polite">${S.chain.map((i) => `<span>${KID_CHAIN[i][0]} ${H(KID_CHAIN[i][1])}</span>`).join("<b>→</b>") || "…"}</div>
            <div class="lab-opts">${left.map(([[e, n], i]) => `<button type="button" class="sg-opt" data-pick="${i}"><span class="e" aria-hidden="true">${e}</span>${H(n)}</button>`).join("")}</div>
            ${S.drop ? `<p class="small" style="color:#b45309">🤔 ${H({ uz: "Йўқ, бу ҳайвон аввалгисини емайди. Яна уриниб кўринг!", ru: "Нет, это животное не ест предыдущее. Попробуйте ещё!", en: "No, this one does not eat the previous one. Try again!" })}</p>` : ""}
            <div class="l3-big"><span>${done ? "🏆" : "🔺"}</span><b>${S.chain.length} / ${KID_CHAIN.length}</b></div>
            <p class="lab-out">${H({ uz: "Пирамидада ҳар бир қаватга пастдагининг тахминан ўндан бир қисми энергия етиб боради. Шунинг учун ўт кўп, бургут эса кам!", ru: "В пирамиде каждому этажу достаётся примерно десятая часть энергии нижнего. Поэтому травы много, а орлов мало!", en: "Each floor of the pyramid gets only about one tenth of the energy of the floor below. That's why there is lots of grass and few eagles!" })}</p>
            <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "5 та жонзотдан тўғри озиқ занжирини тузинг.", ru: "Соберите правильную пищевую цепь из 5 живых существ.", en: "Build the right food chain from 5 living things." })}</p>`;
        }
        return `<label>${H({ uz: "Продуцентлар энергияси", ru: "Энергия продуцентов", en: "Producer energy" })}: <b>${S.E} kJ</b><input type="range" data-k="E" min="1000" max="100000" step="1000" value="${S.E}"></label>
          <label>${H({ uz: "Экологик самарадорлик (поғоналар орасида)", ru: "Экологическая эффективность (между уровнями)", en: "Ecological efficiency (between levels)" })}: <b>${S.eff}%</b><input type="range" data-k="eff" min="5" max="20" step="1" value="${S.eff}"></label>
          <label>${H({ uz: "Трофик поғоналар сони", ru: "Число трофических уровней", en: "Trophic levels" })}: <b>${S.lv}</b><input type="range" data-k="lv" min="2" max="4" step="1" value="${S.lv}"></label>
          <div class="ly-rtable"><table class="l3-tbl">${rows}</table></div>
          <div class="lab-formula">E<sub>n</sub> = E₁ · (η/100)<sup>n−1</sup> → E<sub>${S.lv}</sub> = <b>${fmt(S.E * Math.pow(S.eff / 100, S.lv - 1), 2)}</b> kJ<br>${H({ uz: "Иссиқлик бўлиб йўқолган", ru: "Потеряно в виде тепла", en: "Lost as heat" })}: <b>${fmt(100 - Math.pow(S.eff / 100, S.lv - 1) * 100, 2)}%</b></div>
          <p class="small muted">${H({ uz: "Дарслик (2.1) экотизимнинг трофик тузилишини икки ярусга ажратади: юқори — автотроф «яшил камар», қуйи — гетеротроф «жигарранг камар»; озиқ пирамидасининг қуйи поғонаси камайса, юқоридагилар ҳам камаяди. Линдеман (1942) поғоналар орасида ўртача 10 % энергия ўтишини кўрсатган (табиатда 5–20 %).", ru: "Учебник (2.1) делит трофическую структуру экосистемы на два яруса: верхний — автотрофный «зелёный пояс», нижний — гетеротрофный «коричневый пояс»; если нижний уровень пищевой пирамиды сокращается, сокращаются и верхние. Линдеман (1942) показал, что между уровнями переходит в среднем 10 % энергии (в природе 5–20 %).", en: "The textbook (2.1) divides an ecosystem's trophic structure into two tiers: the upper autotrophic 'green belt' and the lower heterotrophic 'brown belt'; when the base of the food pyramid shrinks, the upper levels shrink too. Lindeman (1942) showed that on average about 10% of energy passes between levels (5–20% in nature)." })}</p>`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => {
          const i = +b.dataset.pick;
          if (i === S.chain.length) { S.chain.push(i); S.drop = 0; S.lv = Math.max(2, Math.min(4, S.chain.length)); layout(); }
          else S.drop++;
          ui.render();
          if (S.chain.length === KID_CHAIN.length) star("piramida", ui.el.querySelector("[data-star]"));
        }));
        el.querySelectorAll("input[data-k]").forEach((r) => {
          r.addEventListener("input", () => { S[r.dataset.k] = +r.value; layout(); const b = r.parentElement.querySelector("b"); if (b) b.textContent = r.value + { E: " kJ", eff: "%", lv: "" }[r.dataset.k]; });
          r.addEventListener("change", () => draw());
        });
      };
      ui.task = () => ({ q: { uz: "Ўтлоқ продуцентлари 10 000 кЖ энергия тўплади. Поғоналар орасида 10 % ўтса, III тартиб консумент (бургут) га неча кЖ етиб боради?", ru: "Продуценты луга накопили 10 000 кДж энергии. Если между уровнями переходит 10 %, сколько кДж достанется консументу III порядка (орлу)?", en: "Meadow producers stored 10,000 kJ. If 10% passes between levels, how many kJ reach a tertiary consumer (eagle)?" }, a: 10, tol: 0.01, unit: "kJ", hint: { uz: "10 000 · 0,1 · 0,1 · 0,1", ru: "10 000 · 0,1 · 0,1 · 0,1", en: "10,000 · 0.1 · 0.1 · 0.1" }, dec: 0 });
      draw();
    }
  };

    /* =====================================================================
     Ekomun 2.5 — янги тажрибалар учун умумий ёрдамчилар
     ===================================================================== */
  const rngH = (k, label, val, min, max, step, shown) => `<label>${label}: <b>${shown}</b><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  /* Сурилма: суриш пайтида рақам ва натижа ([data-out]) дарров янгиланади */
  function liveBind(el, S, show, out, after) {
    el.querySelectorAll("input[data-k]").forEach((r) => r.addEventListener("input", () => {
      S[r.dataset.k] = +r.value;
      const b = r.parentElement.querySelector("b"); if (b) b.textContent = show(r.dataset.k, +r.value);
      const o = el.querySelector("[data-out]"); if (o) o.innerHTML = out();
      if (after) after(r.dataset.k);
    }));
  }
  const optsH = (key, list, curv) => `<div class="lab-opts">${list.map(([val, ic, n]) => `<button type="button" class="sg-opt ${val === curv ? "sel" : ""}" data-o="${key}" data-v="${val}"><span class="e" aria-hidden="true">${ic}</span>${H(n)}</button>`).join("")}</div>`;
  const bindOpts = (el, S, after) => el.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => { const v = b.dataset.v; S[b.dataset.o] = isNaN(+v) ? v : +v; after(b.dataset.o); }));
  const heat = (t) => { const T = THREE, c = new T.Color(); t = clamp(t, 0, 1); return t < 0.5 ? c.setRGB(lerp(0.15, 1, t * 2), lerp(0.39, 0.85, t * 2), lerp(0.92, 0.2, t * 2)) : c.setRGB(1, lerp(0.85, 0.15, (t - 0.5) * 2), lerp(0.2, 0.1, (t - 0.5) * 2)); };
  const mat = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.75 }, o));

  /* =====================================================================
     11) 🌬️ Шамол турбинаси — P = ½ρAv³Cp, Бетц чегараси, Рэлей тақсимоти
     ===================================================================== */
  const WIND = {
    id: "shamol", icon: "🌬️",
    name: t3("Шамол турбинаси", "Ветряная турбина", "Wind turbine"),
    q: t3("Шамол икки баравар кучайса, турбина неча баравар кўп электр беради?", "Если ветер усилится вдвое, во сколько раз больше электричества даст турбина?", "If the wind doubles, how many times more electricity does a turbine make?"),
    poe: { o: [t3("2 баравар", "В 2 раза", "2 times"), t3("4 баравар", "В 4 раза", "4 times"), t3("8 баравар", "В 8 раз", "8 times")], a: 2,
      w: t3("Қувват шамол тезлигининг кубига пропорционал: P ~ v³, 2³ = 8.", "Мощность пропорциональна кубу скорости ветра: P ~ v³, 2³ = 8.", "Power grows with the cube of wind speed: P ~ v³, and 2³ = 8.") },
    src: "Betz A., 1920; Manwell J., McGowan J., Rogers A. «Wind Energy Explained», 2nd ed., Wiley, 2009, ch. 2–3, 6; IEC 61400-12-1:2022; IRENA «Renewable Power Generation Costs in 2023»",
    view: { bg: "#bfdbfe", d: 10.5, ph: 1.2, th: 0.75, target: [0.8, 2, 0], minD: 4, maxD: 22 },
    kids: [[1.5, "🏡", t3("Уй турбинаси (R = 1,5 м)", "Домашняя (R = 1,5 м)", "Home (R = 1.5 m)")], [12, "🏫", t3("Мактаб турбинаси (R = 12 м)", "Школьная (R = 12 м)", "School (R = 12 m)")], [50, "🏭", t3("Катта турбина (R = 50 м)", "Большая (R = 50 м)", "Utility (R = 50 m)")]],
    quiz: [
      { q: t3("Нима учун шамол турбиналари баланд минорага ўрнатилади?", "Почему ветряки ставят на высокие башни?", "Why are wind turbines put on tall towers?"),
        o: [t3("Юқорида шамол кучлироқ ва текисроқ", "Наверху ветер сильнее и ровнее", "The wind is stronger and smoother higher up"), t3("Қушлардан узоқ бўлиш учун", "Чтобы быть дальше от птиц", "To keep away from birds"), t3("Чиройли кўриниши учун", "Для красоты", "Because it looks nice")], a: 0,
        w: t3("Ер юзасидаги ишқаланиш шамолни секинлатади; баландлик ошган сари тезлик логарифмик қонун билан ортади (зонд билан текширинг).", "Трение о землю тормозит ветер; с высотой скорость растёт по логарифмическому закону (проверьте зондом).", "Friction with the ground slows the wind; speed grows with height along a log profile (check with the probe).") },
      { q: t3("Бетц чегараси нимани билдиради?", "Что означает предел Бетца?", "What does the Betz limit say?"),
        o: [t3("Шамол энергиясининг 59,3 % дан кўпини олиб бўлмайди", "Нельзя забрать больше 59,3 % энергии ветра", "No turbine can capture more than 59.3 % of wind energy"), t3("Турбина 25 м/с да тўхтайди", "Турбина останавливается при 25 м/с", "A turbine stops at 25 m/s"), t3("Парраклар 3 тадан ошмайди", "Лопастей не больше трёх", "There are never more than 3 blades")], a: 0,
        w: t3("1920 йили Альберт Бетц исботлаган: Cp,max = 16/27 ≈ 0,593.", "Доказано Альбертом Бетцем в 1920 г.: Cp,max = 16/27 ≈ 0,593.", "Proved by Albert Betz in 1920: Cp,max = 16/27 ≈ 0.593.") },
      { q: t3("Паррак узунлиги 2 баравар оширилса, қувват қанча ортади?", "Во сколько раз вырастет мощность, если лопасть удлинить вдвое?", "If the blade length doubles, how much does power grow?"),
        o: [t3("2 баравар", "В 2 раза", "2 times"), t3("4 баравар", "В 4 раза", "4 times"), t3("8 баравар", "В 8 раз", "8 times")], a: 1,
        w: t3("P ~ A = πR², демак R ×2 бўлса, юза ва қувват ×4.", "P ~ A = πR², значит при R ×2 площадь и мощность ×4.", "P ~ A = πR², so doubling R gives 4× the area and power.") }
    ],
    build(v, ui) {
      const T = THREE, S = { v: 8, R: 1.5, cp: 0.4, tC: 15, alt: 400, vm: 6 };
      const VIN = 3, VR = 12, VOUT = 25, HOUSE = 0.5; // кВт: битта уйнинг кечки ўртача эҳтиёжи (фараз)
      const rho = () => 101325 * Math.pow(1 - 2.25577e-5 * S.alt, 5.25588) / (287.05 * (S.tC + 273.15));
      const pAt = (w) => (w < VIN || w >= VOUT ? 0 : 0.5 * rho() * Math.PI * S.R * S.R * Math.pow(Math.min(w, VR), 3) * S.cp);
      const P = () => pAt(S.v), Pr = () => 0.5 * rho() * Math.PI * S.R * S.R * VR ** 3 * S.cp;
      const ray = (w) => (Math.PI * w / (2 * S.vm * S.vm)) * Math.exp(-Math.PI * w * w / (4 * S.vm * S.vm));
      const aep = () => { let e = 0; for (let w = 0.25; w < 30; w += 0.5) e += pAt(w) * ray(w) * 0.5; return (e * 8760) / 1000; };
      const cf = () => aep() / ((Pr() / 1000) * 8760);
      const hubH = () => Math.max(S.R * 1.35, 9);
      const rv = () => clamp(0.6 + 1.75 * Math.pow(S.R / 80, 0.55), 0.6, 2.4);
      ui.unit = () => hubH() / (rv() * 1.3 + 0.5);
      const houses = () => Math.floor(P() / 1000 / HOUSE);
      /* Саҳна: ўтлоқ, минора, гондола, ротор, қишлоқ, шамол оқими */
      const ground = new T.Mesh(new T.CircleGeometry(9, 48), mat(0x65a30d, { roughness: 1 }));
      ground.rotation.x = -Math.PI / 2; v.scene.add(ground);
      const white = mat(0xf8fafc, { roughness: 0.4 });
      const tower = new T.Mesh(new T.CylinderGeometry(0.06, 0.13, 1, 18), white); v.scene.add(tower);
      const nac = new T.Mesh(new T.BoxGeometry(0.5, 0.2, 0.22), white); v.scene.add(nac);
      const rotor = new T.Group(); v.scene.add(rotor);
      const hub = new T.Mesh(new T.SphereGeometry(0.11, 16, 12), white); rotor.add(hub);
      const blades = [0, 1, 2].map((i) => {
        const pv = new T.Group(); pv.rotation.x = (i * 2 * Math.PI) / 3; rotor.add(pv);
        const g = new T.BoxGeometry(0.03, 1, 0.1); g.translate(0, 0.5, 0);
        const b = new T.Mesh(g, white); pv.add(b);
        const tip = new T.Mesh(new T.BoxGeometry(0.031, 0.08, 0.1), mat(0xef4444)); tip.position.y = 0.96; b.add(tip);
        return b;
      });
      /* Қишлоқ: 8 та уй, ёритилган деразалар */
      const hz = [], winOff = 0x1f2937;
      for (let i = 0; i < 8; i++) {
        const g = new T.Group(), x = 3 + (i % 4) * 1.05, z = -1.6 + Math.floor(i / 4) * 1.9 + (i % 2) * 0.25;
        g.position.set(x, 0, z); v.scene.add(g);
        const body = new T.Mesh(new T.BoxGeometry(0.6, 0.45, 0.55), mat(0xfde68a)); body.position.y = 0.225; g.add(body);
        const roof = new T.Mesh(new T.ConeGeometry(0.48, 0.32, 4), mat(0xb91c1c)); roof.rotation.y = Math.PI / 4; roof.position.y = 0.61; g.add(roof);
        const wm = new T.MeshStandardMaterial({ color: winOff, emissive: 0xfacc15, emissiveIntensity: 0 });
        const win = new T.Mesh(new T.PlaneGeometry(0.2, 0.16), wm); win.position.set(-0.301, 0.25, 0); win.rotation.y = -Math.PI / 2; g.add(win);
        hz.push(wm);
      }
      const wire = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0.5, 0), new T.Vector3(3, 0.5, -1.6), new T.Vector3(6.2, 0.5, 0.5)]), new T.LineBasicMaterial({ color: 0x334155 }));
      v.scene.add(wire);
      /* Шамол «чизиқлари» */
      const NW = 160, wg = new T.BufferGeometry(), wp = new Float32Array(NW * 3);
      for (let i = 0; i < NW; i++) { wp[i * 3] = -8 + Math.random() * 16; wp[i * 3 + 1] = 0.3 + Math.random() * 4.5; wp[i * 3 + 2] = -3 + Math.random() * 6; }
      wg.setAttribute("position", new T.BufferAttribute(wp, 3));
      v.scene.add(new T.Points(wg, new T.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.85 })));
      let ang = 0;
      const layout = () => {
        const r = rv(), h = r * 1.3 + 0.5;
        tower.scale.y = h; tower.position.y = h / 2;
        nac.position.set(0.12, h, 0); rotor.position.set(-0.2, h, 0);
        blades.forEach((b) => b.scale.set(1, r, 1));
        const n = Math.min(8, houses());
        hz.forEach((m, i) => { m.emissiveIntensity = i < n ? 1.2 : 0; m.color.setHex(i < n ? 0xfef08a : winOff); });
      };
      v.updaters.push((dt) => {
        const r = rv(), h = r * 1.3 + 0.5, on = S.v >= VIN && S.v < VOUT;
        const om = on ? clamp((7 * Math.min(S.v, VR)) / S.R, 0, 7) : 0; // λ = 7
        ang += om * dt; rotor.rotation.x = ang;
        const sp = 0.28 * Math.max(S.v, 0.5) * dt;
        for (let i = 0; i < NW; i++) {
          let x = wp[i * 3]; const y = wp[i * 3 + 1], z = wp[i * 3 + 2];
          const inWake = x > -0.2 && x < 3.5 && Math.hypot(y - h, z) < r;
          x += sp * (inWake && on ? 1 - S.cp : 1);
          if (x > 8) x = -8;
          wp[i * 3] = x;
        }
        wg.attributes.position.needsUpdate = true;
      });
      ui.probe = (p) => {
        const z = Math.max(p.y * ui.unit(), 0.5), z0 = 0.03, vz = S.v * Math.log(z / z0) / Math.log(hubH() / z0);
        return `z = ${fmt(z, 0)} m: v ≈ ${fmt(Math.max(0, vz), 1)} m/s (${L(t3("логарифмик профил, z₀ = 0,03 м", "логарифмический профиль, z₀ = 0,03 м", "log profile, z₀ = 0.03 m"))})`;
      };
      const bft = () => [[1, t3("тинч", "штиль", "calm")], [5, t3("енгил шабада", "лёгкий бриз", "light breeze")], [10, t3("мўътадил шамол", "умеренный ветер", "moderate wind")], [17, t3("кучли шамол", "сильный ветер", "strong wind")], [24, t3("довул", "шторм", "gale")], [99, t3("бўрон", "ураган", "storm")]].find(([m]) => S.v <= m)[1];
      const show = (k, x) => ({ v: `${x} m/s`, R: `${x} m`, cp: fmt(x, 2), tC: `${x} °C`, alt: `${x} m`, vm: `${fmt(x, 1)} m/s` }[k]);
      const outK = () => {
        const p = P() / 1000, n = houses();
        const msg = S.v < VIN ? t3("Шамол жуда кучсиз — парраклар айланмайди (камида 3 м/с керак).", "Ветер слишком слабый — лопасти не крутятся (нужно хотя бы 3 м/с).", "The wind is too weak; the blades don't turn (at least 3 m/s needed).")
          : S.v >= VOUT ? t3("Бўрон! Турбина синмаслиги учун парракларни шамолга четга буриб тўхтайди.", "Ураган! Турбина разворачивает лопасти и останавливается, чтобы не сломаться.", "Storm! The turbine feathers its blades and stops so it doesn't break.")
          : n >= 8 ? t3("Барча уйлар ёритилди — бутун қишлоқ тоза энергияда!", "Все дома светятся — вся деревня на чистой энергии!", "Every house is lit: the whole village runs on clean energy!")
          : t3("Шамол ва парракни ўзгартириб, кўпроқ уйни ёритинг.", "Меняйте ветер и лопасти, чтобы осветить больше домов.", "Change the wind and blades to light more houses.");
        return `<div class="l3-big"><span>${n >= 1 ? "💡" : "🌑"}</span><b>${fmt(p, p < 10 ? 2 : 0)} kW</b><small>🏠 × ${n} ${H(t3("уй", "домов", "houses"))} · ${H(bft())}</small></div><p class="lab-out">${H(msg)}</p>`;
      };
      const outU = () => {
        const p = P(), A = Math.PI * S.R * S.R, rpm = S.v >= VIN && S.v < VOUT ? (60 * 7 * Math.min(S.v, VR)) / (2 * Math.PI * S.R) : 0, e = aep();
        const curve = []; for (let w = 0; w <= 30; w += 0.5) curve.push([w, pAt(w) / 1000]);
        return `<div class="lab-formula">ρ = p / (R<sub>d</sub>T) = <b>${fmt(rho(), 3)}</b> kg/m³ · A = πR² = <b>${fmt(A, 0)}</b> m²<br>P = ½ρAv³C<sub>p</sub> = <b>${fmt(p / 1000, p < 1e5 ? 1 : 0)}</b> kW ${S.v > VR && S.v < VOUT ? `(${H(t3("номинал режим", "номинальный режим", "rated"))}: v<sub>r</sub> = 12 m/s)` : ""}<br>P<sub>r</sub> = <b>${fmt(Pr() / 1000, 0)}</b> kW · C<sub>p</sub> ≤ 16/27 = 0,593 (Betz)<br>n = 60λv / (2πR) = <b>${fmt(rpm, 1)}</b> rpm (λ = 7)<br>AEP (Rayleigh, v̄ = ${fmt(S.vm, 1)} m/s) = <b>${fmt(e / 1000, 1)}</b> MWh · CF = <b>${fmt(cf() * 100, 1)}%</b><br>CO₂ ${H(t3("тежалади", "сэкономлено", "avoided"))} ≈ <b>${fmt((e * 0.45) / 1000, 1)}</b> t/${H(t3("йил", "год", "yr"))} (0,45 kg/kWh)</div>
          ${chartSvg([{ pts: curve, c: "#0891b2" }], { mark: [S.v, p / 1000], xl: "v, m/s", yl: "P, kW", x0: 0, x1: 30 })}`;
      };
      ui.html = () => {
        if (stage() !== "uni") return `${optsH("R", this.kids, S.R)}
          ${rngH("v", "💨 " + H(t3("Шамол тезлиги", "Скорость ветра", "Wind speed")), S.v, 0, 30, 1, show("v", S.v))}
          <div data-out>${outK()}</div>
          <p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Энг кичик (уй) турбинаси билан камида 3 та уйни ёритинг.", "Осветите хотя бы 3 дома самой маленькой (домашней) турбиной.", "Light at least 3 houses with the smallest (home) turbine."))}</p>`;
        return `${rngH("v", H(t3("Шамол тезлиги v", "Скорость ветра v", "Wind speed v")), S.v, 0, 30, 0.5, show("v", S.v))}
          ${rngH("R", H(t3("Паррак узунлиги R", "Длина лопасти R", "Blade length R")), S.R, 1, 80, 0.5, show("R", S.R))}
          ${rngH("cp", H(t3("Қувват коэффициенти Cp", "Коэффициент мощности Cp", "Power coefficient Cp")), S.cp, 0.2, 0.59, 0.01, show("cp", S.cp))}
          ${rngH("tC", H(t3("Ҳаво ҳарорати", "Температура воздуха", "Air temperature")), S.tC, -20, 40, 1, show("tC", S.tC))}
          ${rngH("alt", H(t3("Жой баландлиги", "Высота местности", "Site altitude")), S.alt, 0, 3000, 100, show("alt", S.alt))}
          ${rngH("vm", H(t3("Йиллик ўртача шамол v̄", "Среднегодовой ветер v̄", "Annual mean wind v̄")), S.vm, 3, 10, 0.5, show("vm", S.vm))}
          <div data-out>${outU()}</div>`;
      };
      const chk = () => { if (stage() !== "uni" && S.R === 1.5 && houses() >= 3) star("shamol", ui.el.querySelector("[data-star]")); };
      ui.bind = (el) => {
        liveBind(el, S, show, stage() === "uni" ? outU : outK, () => { layout(); chk(); });
        bindOpts(el, S, () => { layout(); ui.render(); chk(); });
      };
      ui.goals = stage() === "uni" ? [
        { id: "betz", t: t3("Бетц чегарасига етинг: Cp = 0,59", "Достигните предела Бетца: Cp = 0,59", "Reach the Betz limit: Cp = 0.59"), ok: () => S.cp >= 0.59 },
        { id: "cf", t: t3("Қувват коэффициенти CF ≥ 35 % бўладиган жойни топинг (v̄ ни ўзгартиринг)", "Найдите место, где КИУМ CF ≥ 35 % (меняйте v̄)", "Find a site with capacity factor CF ≥ 35 % (change v̄)"), ok: () => cf() >= 0.35 },
        { id: "alt", t: t3("Тоғда ҳаво сийрак: ρ < 1 кг/м³ бўлган баландликни топинг", "В горах воздух разрежен: найдите высоту, где ρ < 1 кг/м³", "Thin mountain air: find an altitude where ρ < 1 kg/m³"), ok: () => rho() < 1 },
        { id: "3mw", t: t3("R ≤ 50 м паррак билан 3 МВт номинал қувватга эришинг", "Получите 3 МВт номинала при R ≤ 50 м", "Get 3 MW rated power with R ≤ 50 m"), ok: () => S.R <= 50 && Pr() >= 3e6 }
      ] : [
        { id: "spin", t: t3("Турбинани айлантиринг (шамол ≥ 3 м/с)", "Раскрутите турбину (ветер ≥ 3 м/с)", "Make the turbine spin (wind ≥ 3 m/s)"), ok: () => P() > 0 },
        { id: "storm", t: t3("Бўронда турбина ўзини қандай ҳимоя қилишини кўринг (≥ 25 м/с)", "Посмотрите, как турбина защищается в ураган (≥ 25 м/с)", "See how the turbine protects itself in a storm (≥ 25 m/s)"), ok: () => S.v >= VOUT },
        { id: "all", t: t3("Катта турбина билан 8 та уйнинг ҳаммасини ёритинг", "Осветите все 8 домов большой турбиной", "Light all 8 houses with the big turbine"), ok: () => S.R >= 50 && houses() >= 8 }
      ];
      ui.read = () => ({ p: `v = ${fmt(S.v, 1)} m/s; R = ${fmt(S.R, 1)} m; Cp = ${fmt(S.cp, 2)}`, r: `P = ${fmt(P() / 1000, 1)} kW`, x: S.v, y: P() / 1000, xl: "v, m/s", yl: "P, kW" });
      ui.task = () => ({ q: t3("Турбина: R = 40 м, v = 10 м/с, ρ = 1,225 кг/м³, Cp = 0,45. Турбина қуввати P неча кВт?", "Турбина: R = 40 м, v = 10 м/с, ρ = 1,225 кг/м³, Cp = 0,45. Какова мощность P, кВт?", "A turbine: R = 40 m, v = 10 m/s, ρ = 1.225 kg/m³, Cp = 0.45. What is its power P in kW?"),
        a: (0.5 * 1.225 * Math.PI * 1600 * 1000 * 0.45) / 1000, tol: 20, unit: "kW", dec: 0, hint: t3("P = ½·ρ·πR²·v³·Cp, натижани 1000 га бўлинг.", "P = ½·ρ·πR²·v³·Cp, результат разделите на 1000.", "P = ½·ρ·πR²·v³·Cp, then divide by 1000.") });
      layout();
    }
  };

  /* =====================================================================
     12) 🌱 Фотосинтез — ёруғлик, CO₂ ва ҳарорат (Блэкман чекловчи омил)
     ===================================================================== */
  const PHOTO = {
    id: "fotosintez", icon: "🌱",
    name: t3("Фотосинтез лабораторияси", "Лаборатория фотосинтеза", "Photosynthesis lab"),
    q: t3("Сув ўсимлиги (элодея) қайси нурда кўпроқ кислород пуфакчаси чиқаради?", "При каком свете водное растение (элодея) выделяет больше пузырьков кислорода?", "Under which light does a water plant (Elodea) release the most oxygen bubbles?"),
    poe: { o: [t3("Яшил нурда", "При зелёном свете", "Green light"), t3("Қизил нурда", "При красном свете", "Red light"), t3("Фарқи йўқ", "Без разницы", "No difference")], a: 1,
      w: t3("Хлорофилл қизил ва кўк нурни яхши ютади, яшил нурнинг кўп қисмини қайтаради — шунинг учун барг яшил кўринади.", "Хлорофилл хорошо поглощает красный и синий свет, а зелёный в основном отражает — поэтому лист зелёный.", "Chlorophyll absorbs red and blue light well and reflects much of the green, which is why leaves look green.") },
    src: "Blackman F.F., Optima and limiting factors, Ann. Bot. 19:281, 1905; McCree K.J., Agric. Meteorol. 9:191, 1972; Taiz L., Zeiger E. «Plant Physiology and Development», 6th ed., 2015, ch. 9; Science & Plants for Schools (SAPS): Elodea bubble count",
    view: { bg: "#0f172a", d: 8.5, ph: 1.25, th: 0.35, target: [2, 1.1, 0], minD: 3, maxD: 14 },
    cols: [["w", "⚪", t3("Оқ", "Белый", "White"), 0xffffff, 0.85], ["r", "🔴", t3("Қизил", "Красный", "Red"), 0xff3b30, 1], ["b", "🔵", t3("Кўк", "Синий", "Blue"), 0x3b82f6, 0.8], ["g", "🟢", t3("Яшил", "Зелёный", "Green"), 0x22c55e, 0.6]],
    quiz: [
      { q: t3("Фотосинтез натижасида ўсимлик нима ажратади?", "Что выделяет растение при фотосинтезе?", "What does a plant release during photosynthesis?"), o: [t3("Кислород (O₂)", "Кислород (O₂)", "Oxygen (O₂)"), t3("Карбонат ангидрид (CO₂)", "Углекислый газ (CO₂)", "Carbon dioxide (CO₂)"), t3("Азот (N₂)", "Азот (N₂)", "Nitrogen (N₂)")], a: 0,
        w: t3("6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (ёруғлик энергияси ҳисобига).", "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (за счёт энергии света).", "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, powered by light.") },
      { q: t3("Блэкман қонуни бўйича фотосинтез тезлигини нима белгилайди?", "Что определяет скорость фотосинтеза по закону Блэкмана?", "By Blackman's law, what sets the rate of photosynthesis?"), o: [t3("Энг етишмайдиган (чекловчи) омил", "Самый недостающий (лимитирующий) фактор", "The scarcest (limiting) factor"), t3("Энг кўп бўлган омил", "Самый избыточный фактор", "The most abundant factor"), t3("Фақат ҳарорат", "Только температура", "Temperature only")], a: 0,
        w: t3("Ёруғлик кўп бўлса ҳам, CO₂ кам бўлса, тезликни CO₂ чеклайди (1905).", "Даже при ярком свете нехватка CO₂ ограничит скорость (1905).", "Even in bright light, low CO₂ will cap the rate (1905).") },
      { q: t3("Ҳарорат 45 °C га чиқса нима бўлади?", "Что будет при 45 °C?", "What happens at 45 °C?"), o: [t3("Ферментлар бузилиб, фотосинтез тушиб кетади", "Ферменты разрушаются, фотосинтез падает", "Enzymes break down and photosynthesis drops"), t3("Фотосинтез чексиз ортади", "Фотосинтез растёт бесконечно", "Photosynthesis grows forever"), t3("Ҳеч нарса ўзгармайди", "Ничего не меняется", "Nothing changes")], a: 0,
        w: t3("Рубиско ва бошқа ферментлар юқори ҳароратда денатурацияланади; нафас олиш эса ортади.", "Рубиско и другие ферменты денатурируют при высокой температуре, а дыхание растёт.", "Rubisco and other enzymes denature at high temperature while respiration rises.") }
    ],
    build(v, ui) {
      const T = THREE, S = { I: 600, C: 420, T: 25, col: "w", d: 30, soda: 0 };
      const PMAX = 30, KI = 300, KC = 350;
      const kid = () => stage() !== "uni";
      if (kid()) S.T = 20;
      const Iof = () => (kid() ? clamp(1800 * Math.pow(15 / S.d, 2), 0, 2000) : S.I);
      const Cof = () => (kid() ? (S.soda ? 1000 : 420) : S.C);
      const colF = () => this.cols.find((c) => c[0] === S.col)[4];
      const fT = (t) => Math.exp(-Math.pow((t - 27) / 11, 2)) * (t > 40 ? Math.max(0, (47 - t) / 7) : 1);
      const terms = (I = Iof()) => { const Ie = I * colF(); return { l: Ie / (Ie + KI), c: Cof() / (Cof() + KC), t: fT(S.T) }; };
      const Pg = (I) => { const x = terms(I); return PMAX * x.l * x.c * x.t; };
      const Rd = () => 1.2 * Math.pow(2, (S.T - 25) / 10);
      const Pn = (I = Iof()) => Pg(I) - Rd();
      const bub = () => Math.max(0, Pn()) * 2.4;
      const lim = () => { const x = terms(); return x.l <= x.c && x.l <= x.t ? "l" : x.c <= x.t ? "c" : "t"; };
      ui.unit = () => 0.1;
      /* Саҳна: стол, стакан, сув, элодея, лампа ва нур */
      const table = new T.Mesh(new T.BoxGeometry(9, 0.2, 5), mat(0x7c5a3a)); table.position.y = -0.1; v.scene.add(table);
      const glass = new T.Mesh(new T.CylinderGeometry(1, 1, 2.4, 40, 1, true), new T.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.18, side: T.DoubleSide, roughness: 0.1, depthWrite: false }));
      glass.position.y = 1.2; v.scene.add(glass);
      const water = new T.Mesh(new T.CylinderGeometry(0.97, 0.97, 2.05, 40), new T.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.22, depthWrite: false }));
      water.position.y = 1.03; v.scene.add(water);
      const sand = new T.Mesh(new T.CylinderGeometry(0.96, 0.96, 0.18, 32), mat(0xd6b98c)); sand.position.y = 0.09; v.scene.add(sand);
      const leafM = mat(0x16a34a), stemM = mat(0x15803d);
      const spots = [];
      [[-0.25, 0.1, 0.1], [0.2, -0.2, -0.15], [0.05, 0.3, 0.15]].forEach(([x, z, lean]) => {
        const pts = [0, 0.4, 0.8, 1.2, 1.6, 1.85].map((y, i) => new T.Vector3(x + Math.sin(i * 0.9) * 0.08 + lean * y * 0.3, 0.18 + y, z + Math.cos(i * 1.1) * 0.06));
        const curve = new T.CatmullRomCurve3(pts);
        v.scene.add(new T.Mesh(new T.TubeGeometry(curve, 30, 0.022, 6), stemM));
        for (let k = 0; k < 16; k++) {
          const p = curve.getPoint(0.06 + k * 0.058);
          for (let j = 0; j < 3; j++) {
            const a = (j * 2 * Math.PI) / 3 + k * 0.7;
            const lf = new T.Mesh(new T.SphereGeometry(0.1, 8, 6), leafM);
            lf.scale.set(1, 0.18, 0.38); lf.position.set(p.x + Math.cos(a) * 0.09, p.y, p.z + Math.sin(a) * 0.09); lf.rotation.y = -a; lf.rotation.z = 0.5;
            v.scene.add(lf); spots.push(lf.position);
          }
        }
      });
      const lamp = new T.Group(); v.scene.add(lamp);
      const shade = new T.Mesh(new T.ConeGeometry(0.42, 0.5, 24, 1, true), mat(0x334155, { side: T.DoubleSide, metalness: 0.4 })); shade.rotation.z = Math.PI / 2; lamp.add(shade);
      const bulbM = new T.MeshBasicMaterial({ color: 0xffffff }); const bulb = new T.Mesh(new T.SphereGeometry(0.16, 16, 12), bulbM); bulb.position.x = -0.08; lamp.add(bulb);
      const pole = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 1.3, 10), mat(0x475569)); pole.position.set(0.25, -0.65, 0); lamp.add(pole);
      const beamM = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, depthWrite: false, side: T.DoubleSide });
      const beam = new T.Mesh(new T.ConeGeometry(1.1, 1, 32, 1, true), beamM); beam.rotation.z = -Math.PI / 2; beam.userData.noPick = true; v.scene.add(beam);
      const pl = new T.PointLight(0xffffff, 3, 8); v.scene.add(pl);
      const NB = 70, bm = new T.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.8, roughness: 0.1 });
      const bubs = Array.from({ length: NB }, () => { const m = new T.Mesh(new T.SphereGeometry(0.035, 8, 6), bm); m.visible = false; m.userData.noPick = true; v.scene.add(m); return m; });
      let acc = 0, cnt = 0, rate = 0;
      const lampX = () => (kid() ? 1 + S.d / 10 : 1 + clamp(30 * Math.sqrt(600 / Math.max(S.I, 30)), 10, 70) / 10);
      const layout = () => {
        const x = lampX(), c = this.cols.find((q) => q[0] === S.col)[3];
        lamp.position.set(x + 0.3, 1.3, 0); pl.position.set(x - 0.2, 1.3, 0);
        bulbM.color.setHex(c); beamM.color.setHex(c); pl.color.setHex(c);
        beam.scale.set(1, x - 0.1, 1); beam.position.set((x + 0.1) / 2, 1.3, 0);
        beamM.opacity = 0.05 + 0.18 * (Iof() / 2000);
        pl.intensity = 0.5 + 4 * (Iof() / 2000);
        water.material.color.setHex(S.soda && kid() ? 0x67e8f9 : 0x38bdf8);
      };
      v.updaters.push((dt) => {
        rate = bub() / 60;
        acc += dt * rate * 4;
        while (acc > 1) { acc -= 1; const b = bubs.find((q) => !q.visible); if (b) { const s = spots[(Math.random() * spots.length) | 0]; b.position.copy(s); b.visible = true; b.userData.vy = 0.5 + Math.random() * 0.3; cnt++; } }
        bubs.forEach((b) => { if (!b.visible) return; b.position.y += b.userData.vy * dt; b.position.x += Math.sin(b.position.y * 9) * 0.002; if (b.position.y > 2.05) b.visible = false; });
      });
      ui.probe = (p) => {
        const lx = lampX() - 0.1, d = Math.hypot(p.x - lx, p.y - 1.3, p.z), d0 = Math.max(0.2, lx - 0);
        return `${L(t3("Ёруғлик", "Освещённость", "Light"))} ≈ ${fmt(Iof() * Math.pow(d0 / Math.max(d, 0.15), 2), 0)} µmol/(m²·s) · ${L(t3("лампагача", "до лампы", "to lamp"))} ${fmt(d * 10, 0)} cm`;
      };
      const LIM = { l: t3("ёруғлик", "свет", "light"), c: "CO₂", t: t3("ҳарорат", "температура", "temperature") };
      const show = (k, x) => ({ I: `${x} µmol/(m²·s)`, C: `${x} ppm`, T: `${x} °C`, d: `${x} cm` }[k]);
      const outK = () => {
        const b = bub();
        const msg = b < 5 ? t3("Пуфакча жуда кам — лампани яқинлаштиринг ёки ҳароратни ўзгартиринг.", "Пузырьков мало — придвиньте лампу или измените температуру.", "Few bubbles: bring the lamp closer or change the temperature.")
          : b < 40 ? t3("Ўсимлик нафас олаяпти ва кислород чиқаряпти! Яна нима ёрдам беради?", "Растение выделяет кислород! Что ещё поможет?", "The plant is making oxygen! What else could help?")
          : t3("Ажойиб! Ўсимлик максимал тезликда кислород ишлаб чиқаряпти.", "Отлично! Растение выделяет кислород на максимуме.", "Great! The plant is making oxygen at top speed.");
        return `<div class="l3-big"><span>🫧</span><b>${fmt(b, 0)}</b><small>${H(t3("пуфакча/дақиқа", "пузырьков/мин", "bubbles/min"))}</small></div><p class="lab-out">${H(msg)}</p><p class="small muted">${H(t3("Ҳозир энг кўп чеклаётган омил", "Сейчас больше всего ограничивает", "Main limiting factor now"))}: <b>${H(LIM[lim()])}</b></p>`;
      };
      const outU = () => {
        const x = terms(), a = x.c * x.t, Ie_c = PMAX * a > Rd() ? (Rd() * KI) / (PMAX * a - Rd()) : NaN, Ic = Ie_c / colF();
        const curve = []; for (let I = 0; I <= 2000; I += 50) curve.push([I, Pn(I)]);
        return `<div class="lab-formula">P<sub>g</sub> = P<sub>max</sub> · I<sub>e</sub>/(I<sub>e</sub>+K<sub>I</sub>) · C/(C+K<sub>C</sub>) · f(T) = <b>${fmt(Pg(Iof()), 2)}</b><br>R<sub>d</sub> = 1,2 · 2<sup>(T−25)/10</sup> = <b>${fmt(Rd(), 2)}</b> · P<sub>n</sub> = P<sub>g</sub> − R<sub>d</sub> = <b>${fmt(Pn(), 2)}</b> µmol O₂/(m²·s)<br>${H(t3("Чекловчи омил (Блэкман)", "Лимитирующий фактор (Блэкман)", "Limiting factor (Blackman)"))}: <b>${H(LIM[lim()])}</b> (${fmt(x.l, 2)} / ${fmt(x.c, 2)} / ${fmt(x.t, 2)})<br>${H(t3("Компенсация нуқтаси", "Точка компенсации", "Compensation point"))} I<sub>c</sub> ≈ <b>${isFinite(Ic) ? fmt(Ic, 0) : "—"}</b> µmol/(m²·s)</div>
          ${chartSvg([{ pts: curve, c: "#16a34a" }], { mark: [Iof(), Pn()], xl: "I, µmol/(m²·s)", yl: "Pn", x0: 0, x1: 2000, y0: Math.min(-2, ...curve.map((q) => q[1])) })}
          <p class="small muted">${H(t3("Модель: P_max = 30, K_I = 300, K_C = 350 ppm (C₃ ўсимлик); рангнинг квант самарадорлиги McCree (1972) бўйича: қизил 1, кўк 0,8, оқ 0,85, яшил 0,6.", "Модель: P_max = 30, K_I = 300, K_C = 350 ppm (C₃-растение); квантовая эффективность цвета по McCree (1972): красный 1, синий 0,8, белый 0,85, зелёный 0,6.", "Model: P_max = 30, K_I = 300, K_C = 350 ppm (C₃ plant); colour quantum yield after McCree (1972): red 1, blue 0.8, white 0.85, green 0.6."))}</p>`;
      };
      const temps = [[5, "❄️", t3("Совуқ 5 °C", "Холодно 5 °C", "Cold 5 °C")], [20, "🙂", t3("Хона 20 °C", "Комната 20 °C", "Room 20 °C")], [30, "🌤", t3("Илиқ 30 °C", "Тепло 30 °C", "Warm 30 °C")], [42, "🔥", t3("Иссиқ 42 °C", "Жарко 42 °C", "Hot 42 °C")]];
      ui.html = () => {
        const cols = optsH("col", this.cols.map(([id, e, n]) => [id, e, n]), S.col);
        if (kid()) return `${rngH("d", "💡 " + H(t3("Лампагача масофа", "Расстояние до лампы", "Distance to lamp")), S.d, 10, 60, 5, show("d", S.d))}
          <p class="small"><b>${H(t3("Нур ранги", "Цвет света", "Light colour"))}</b></p>${cols}
          <p class="small"><b>${H(t3("Сув ҳарорати", "Температура воды", "Water temperature"))}</b></p>${optsH("T", temps, S.T)}
          <label class="l3-check"><input type="checkbox" data-soda ${S.soda ? "checked" : ""}> 🧂 ${H(t3("Сувга бир чимдим ичимлик содаси (NaHCO₃) қўшиш — у CO₂ беради", "Добавить щепотку пищевой соды (NaHCO₃) — она даёт CO₂", "Add a pinch of baking soda (NaHCO₃), which releases CO₂"))}</label>
          <div data-out>${outK()}</div>
          <p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Дақиқасига 40 тадан кўп пуфакча олинг.", "Получите больше 40 пузырьков в минуту.", "Get more than 40 bubbles per minute."))}</p>`;
        return `${rngH("I", H(t3("Ёруғлик I (ФАР)", "Свет I (ФАР)", "Light I (PAR)")), S.I, 0, 2000, 10, show("I", S.I))}
          ${rngH("C", "CO₂", S.C, 100, 1500, 10, show("C", S.C))}
          ${rngH("T", H(t3("Ҳарорат", "Температура", "Temperature")), S.T, 0, 46, 1, show("T", S.T))}
          ${cols}<div data-out>${outU()}</div>`;
      };
      const chk = () => { if (kid() && bub() > 40) star("fotosintez", ui.el.querySelector("[data-star]")); };
      ui.bind = (el) => {
        liveBind(el, S, show, kid() ? outK : outU, () => { layout(); chk(); });
        bindOpts(el, S, () => { layout(); ui.render(); chk(); });
        const sd = el.querySelector("[data-soda]"); if (sd) sd.addEventListener("change", () => { S.soda = sd.checked ? 1 : 0; layout(); ui.render(); chk(); });
      };
      ui.goals = kid() ? [
        { id: "near", t: t3("Лампани яқинлаштириб, дақиқасига 20 тадан кўп пуфакча олинг", "Придвиньте лампу и получите больше 20 пузырьков/мин", "Move the lamp closer to get more than 20 bubbles/min"), ok: () => bub() > 20 },
        { id: "green", t: t3("Яшил нурни синаб, пуфакчалар камайишини кўринг", "Попробуйте зелёный свет и увидьте, что пузырьков меньше", "Try green light and see the bubbles drop"), ok: () => S.col === "g" },
        { id: "hot", t: t3("Жуда иссиқ сувда (42 °C) нима бўлишини текширинг", "Проверьте, что будет в очень тёплой воде (42 °C)", "Check what happens in very warm water (42 °C)"), ok: () => S.T >= 42 }
      ] : [
        { id: "comp", t: t3("Ёруғлик компенсация нуқтасини топинг: |Pn| < 0,3", "Найдите точку компенсации света: |Pn| < 0,3", "Find the light compensation point: |Pn| < 0.3"), ok: () => S.I > 0 && Math.abs(Pn()) < 0.3 },
        { id: "co2", t: t3("Ёруғлик ≥ 1 200 бўлганда CO₂ чеклайдиган ҳолат яратинг", "Создайте ситуацию, где при свете ≥ 1 200 лимитирует CO₂", "With light ≥ 1,200, make CO₂ the limiting factor"), ok: () => S.I >= 1200 && lim() === "c" },
        { id: "max", t: t3("Соф фотосинтез Pn ≥ 20 га эришинг", "Достигните Pn ≥ 20", "Reach net photosynthesis Pn ≥ 20"), ok: () => Pn() >= 20 }
      ];
      ui.read = () => ({ p: kid() ? `d = ${S.d} cm; ${L(this.cols.find((c) => c[0] === S.col)[2])}; T = ${S.T} °C${S.soda ? "; NaHCO₃" : ""}` : `I = ${S.I}; CO₂ = ${S.C} ppm; T = ${S.T} °C; ${L(this.cols.find((c) => c[0] === S.col)[2])}`, r: kid() ? `${fmt(bub(), 0)} / min` : `Pn = ${fmt(Pn(), 2)}`, x: kid() ? S.d : S.I, y: kid() ? bub() : Pn(), xl: kid() ? "d, cm" : "I", yl: kid() ? "🫧/min" : "Pn" });
      ui.task = () => ({ q: t3("P_max = 30 µmol/(м²·с), K_I = 300. Қизил нур (I_e = 900), CO₂ ва ҳарорат чекламайди (кўпайтувчилар = 1). Ялпи фотосинтез P_g = ?", "P_max = 30 µmol/(м²·с), K_I = 300. Красный свет (I_e = 900), CO₂ и температура не ограничивают (множители = 1). Валовой фотосинтез P_g = ?", "P_max = 30 µmol/(m²·s), K_I = 300. Red light (I_e = 900); CO₂ and temperature are not limiting (factors = 1). Gross photosynthesis P_g = ?"),
        a: (30 * 900) / 1200, tol: 0.3, unit: "µmol/(m²·s)", dec: 2, hint: t3("P_g = P_max · I_e / (I_e + K_I).", "P_g = P_max · I_e / (I_e + K_I).", "P_g = P_max · I_e / (I_e + K_I).") });
      layout();
    }
  };

  /* =====================================================================
     13) 🏠 Энергия тежайдиган уй — Q = Σ U·A·ΔT, иситиш даври, энергия синфи
     ===================================================================== */
  const GSOP = 2240; // К·сутка: Тошкент, иситиш даври ≈ 125 кун, ўртача +2,1 °C, ички 20 °C (ҚМҚ 2.01.01-94 асосида тахминий)
  const HOUSE = {
    id: "uy", icon: "🏠",
    name: t3("Энергия тежайдиган уй", "Энергоэффективный дом", "Energy-efficient house"),
    q: t3("Қишда уйдаги иссиқлик қаердан энг кўп чиқиб кетади: девор, дераза, томми ёки ҳаво алмашинувидан?", "Куда зимой уходит больше всего тепла: через стены, окна, крышу или с воздухом?", "Where does a house lose the most heat in winter: walls, windows, roof or air leaks?"),
    poe: { o: [t3("Деразадан", "Через окна", "Windows"), t3("Томдан", "Через крышу", "Roof"), t3("Девордан", "Через стены", "Walls")], a: 2,
      w: t3("Бир квадрат метр деразадан иссиқлик кўп ўтади, лекин деворнинг юзаси катта — оддий уйда девор, том ва дераза ҳаммаси катта улуш олади. Иссиқлик камерасида текширинг!", "Через квадратный метр окна уходит много тепла, но площадь стен больше — в обычном доме крупные доли у стен, крыши и окон. Проверьте тепловизором!", "A square metre of window leaks a lot, but walls cover far more area; in an ordinary house walls, roof and windows all take big shares. Check with the thermal camera!") },
    src: "ISO 13790 / ISO 52016-1 (heat balance); ҚМҚ 2.01.04-18 «Қурилиш иссиқлик техникаси»; Passivhaus Institut (Darmstadt), Passive House requirements; EU Directive 2024/1275 (EPBD) energy classes",
    view: { bg: "#e0f2fe", d: 9, ph: 1.05, th: 0.8, target: [0, 0.9, 0], minD: 4, maxD: 16 },
    EL: {
      w: [t3("Девор", "Стены", "Walls"), 121, [[1.5, t3("Ғишт 38 см", "Кирпич 38 см", "Brick 38 cm")], [0.55, t3("+5 см пенопласт", "+5 см пенопласт", "+5 cm EPS")], [0.32, t3("+10 см минерал пахта", "+10 см минвата", "+10 cm mineral wool")], [0.18, t3("+20 см (пассив уй)", "+20 см (пассивный дом)", "+20 cm (passive house)")]]],
      wi: [t3("Деразалар", "Окна", "Windows"), 20, [[5.8, t3("Бир қават ойна", "Одинарное стекло", "Single glazing")], [2.8, t3("Икки қават ойна", "Двойное стекло", "Double glazing")], [1.0, t3("Уч қават, low-e", "Тройной, low-e", "Triple, low-e")], [0.7, t3("Пассив уй ойнаси", "Окно пассивного дома", "Passive-house window")]]],
      r: [t3("Том", "Крыша", "Roof"), 100, [[1.6, t3("Иситилмаган", "Без утепления", "Uninsulated")], [0.4, t3("10 см пахта", "10 см минваты", "10 cm wool")], [0.2, t3("20 см пахта", "20 см минваты", "20 cm wool")], [0.12, t3("30 см пахта", "30 см минваты", "30 cm wool")]]],
      f: [t3("Пол", "Пол", "Floor"), 100, [[0.8, t3("Иситилмаган", "Без утепления", "Uninsulated")], [0.35, t3("5 см пенопласт", "5 см пенопласта", "5 cm EPS")], [0.2, t3("10 см пенопласт", "10 см пенопласта", "10 cm EPS")]]],
      v: [t3("Ҳаво алмашинуви", "Вентиляция", "Ventilation"), 0, [[1, t3("Табиий (тирқишлар)", "Естественная (щели)", "Natural (leaky)")], [0.6, t3("Зич эшик-деразалар", "Плотные окна и двери", "Air-tight")], [0.15, t3("Рекуператор (85 %)", "Рекуператор (85 %)", "Heat recovery (85 %)")]]]
    },
    quiz: [
      { q: t3("U-қиймат (иссиқлик ўтказиш коэффициенти) кичик бўлса, бу нимани билдиради?", "Что значит маленький U-коэффициент?", "What does a small U-value mean?"), o: [t3("Иссиқликни яхши сақлайди", "Хорошо сохраняет тепло", "It keeps heat in well"), t3("Иссиқликни тез чиқаради", "Быстро теряет тепло", "It leaks heat fast"), t3("Ранги оч", "Светлый цвет", "It is light-coloured")], a: 0,
        w: t3("U — 1 м² юзадан 1 °C фарқда неча Вт иссиқлик ўтиши; кичик U — яхши изоляция.", "U — сколько Вт уходит через 1 м² при разнице 1 °C; малый U — хорошая изоляция.", "U is the watts lost per m² per 1 °C; a small U means good insulation.") },
      { q: t3("Рекуператор нима қилади?", "Что делает рекуператор?", "What does a heat-recovery unit do?"), o: [t3("Чиқаётган илиқ ҳаво иссиқлигини кираётган тоза ҳавога беради", "Передаёт тепло уходящего воздуха свежему", "Passes heat from stale outgoing air to fresh incoming air"), t3("Уйни совутади", "Охлаждает дом", "Cools the house"), t3("Деразаларни тозалайди", "Моет окна", "Cleans windows")], a: 0,
        w: t3("Пассив уйларда (Германия) рекуператор вентиляция йўқотишини 75–90 % га камайтиради.", "В пассивных домах (Германия) рекуператор снижает вентиляционные потери на 75–90 %.", "In passive houses (Germany) heat recovery cuts ventilation losses by 75–90 %.") },
      { q: t3("Ташқарида −5 °C, ичкарида 20 °C. ΔT неча?", "Снаружи −5 °C, внутри 20 °C. Чему равно ΔT?", "Outside −5 °C, inside 20 °C. What is ΔT?"), o: ["15 K", "25 K", "−25 K"], a: 1, w: t3("ΔT = 20 − (−5) = 25 K.", "ΔT = 20 − (−5) = 25 K.", "ΔT = 20 − (−5) = 25 K.") }
    ],
    build(v, ui) {
      const T = THREE, S = { w: 0, wi: 0, r: 0, f: 0, v: 0, out: -5, in: 20, cam: 1 }, E = this.EL;
      const HV0 = 0.34 * 1 * 300; // Вт/К: n = 1 1/соат, V = 300 м³
      const U = (k) => E[k][2][S[k]][0];
      const HA = (k) => (k === "v" ? U("v") * HV0 : U(k) * E[k][1]);
      const Htot = () => ["w", "wi", "r", "f", "v"].reduce((s, k) => s + HA(k), 0);
      const H0 = ["w", "wi", "r", "f"].reduce((s, k) => s + E[k][2][0][0] * E[k][1], 0) + HV0;
      const dT = () => S.in - S.out;
      const Q = () => Htot() * dT();
      const kwh = () => (Htot() * GSOP * 24) / 1000;
      const spec = () => kwh() / 100;
      const cls = () => { const x = spec(); return x <= 50 ? "A" : x <= 100 ? "B" : x <= 150 ? "C" : x <= 200 ? "D" : x <= 250 ? "E" : "F"; };
      const CLC = { A: "#16a34a", B: "#65a30d", C: "#ca8a04", D: "#ea580c", E: "#dc2626", F: "#991b1b" };
      ui.unit = () => 2.9;
      const g = new T.Group(); v.scene.add(g);
      const ground = new T.Mesh(new T.BoxGeometry(12, 0.1, 9), mat(0x84cc16, { roughness: 1 })); ground.position.y = -0.05; ground.userData.ground = 1; v.scene.add(ground);
      const LX = 4, LZ = 3, HY = 1.2, th = 0.12, parts = [];
      const wallM = () => mat(0xe7d7c1);
      const mk = (geo, m, el, pos, n) => { const x = new T.Mesh(geo, m); x.position.set(...pos); x.userData.el = el; x.userData.n = n; g.add(x); parts.push(x); return x; };
      const walls = [
        mk(new T.BoxGeometry(LX, HY, th), wallM(), "w", [0, HY / 2, LZ / 2], [0, 0, 1]),
        mk(new T.BoxGeometry(LX, HY, th), wallM(), "w", [0, HY / 2, -LZ / 2], [0, 0, -1]),
        mk(new T.BoxGeometry(th, HY, LZ), wallM(), "w", [LX / 2, HY / 2, 0], [1, 0, 0]),
        mk(new T.BoxGeometry(th, HY, LZ), wallM(), "w", [-LX / 2, HY / 2, 0], [-1, 0, 0])
      ];
      const floor = mk(new T.BoxGeometry(LX, 0.1, LZ), mat(0x78716c), "f", [0, 0.05, 0], [0, -1, 0]);
      const roofGeo = new T.ConeGeometry(1, 0.9, 4, 1); roofGeo.rotateY(Math.PI / 4);
      const roof = mk(roofGeo, mat(0xb45309), "r", [0, HY + 0.45, 0], [0, 1, 0]); roof.scale.set((LX + 0.5) / Math.SQRT2, 1, (LZ + 0.5) / Math.SQRT2);
      const wins = [];
      [[-1.2, LZ / 2 + 0.07, 0], [0, LZ / 2 + 0.07, 0], [1.2, LZ / 2 + 0.07, 0], [-1.2, -LZ / 2 - 0.07, Math.PI], [1.2, -LZ / 2 - 0.07, Math.PI], [LX / 2 + 0.07, 0, Math.PI / 2]].forEach(([x, z, ry], i) => {
        const w = mk(new T.BoxGeometry(0.6, 0.5, 0.03), new T.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.15, metalness: 0.2 }), "wi", [i === 5 ? x : x, 0.65, i === 5 ? 0.6 : z], [Math.sin(ry), 0, Math.cos(ry)]);
        w.rotation.y = ry; wins.push(w);
      });
      const door = new T.Mesh(new T.BoxGeometry(0.45, 0.8, 0.03), mat(0x7c2d12)); door.position.set(-LX / 2 - 0.07, 0.4, -0.6); door.rotation.y = Math.PI / 2; g.add(door);
      const chim = new T.Mesh(new T.BoxGeometry(0.25, 0.6, 0.25), mat(0x7f1d1d)); chim.position.set(1.1, HY + 0.7, -0.5); g.add(chim);
      /* Иссиқлик «тўлқинлари»: ҳар бир элементдан Q улушига мос */
      const NP = 140, pm = new T.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.75 });
      const ps = Array.from({ length: NP }, () => { const m = new T.Mesh(new T.SphereGeometry(0.035, 6, 5), pm); m.userData = { life: 0, noPick: true }; m.visible = false; v.scene.add(m); return m; });
      const snow = new T.Color(0xf1f5f9), grass = new T.Color(0x84cc16);
      const paint = () => {
        const d = dT();
        parts.forEach((p) => {
          const k = p.userData.el, q = U(k) * d; // Вт/м²
          if (S.cam) { p.material.color.copy(heat(q / 120)); p.material.emissive = p.material.emissive || new T.Color(); p.material.emissive.copy(heat(q / 120)).multiplyScalar(0.35); }
          else { p.material.emissive && p.material.emissive.setHex(0); p.material.color.setHex(k === "w" ? [0xe7d7c1, 0xf5f5f4, 0xfef3c7, 0xfffbeb][S.w] : k === "r" ? 0xb45309 : k === "f" ? 0x78716c : 0x93c5fd); }
        });
        walls.forEach((w, i) => { const t = 1 + S.w * 0.9; if (i < 2) w.scale.z = t; else w.scale.x = t; });
        roof.scale.y = 1 + S.r * 0.12;
        ground.material.color.copy(S.out < 0 ? snow : grass);
        v.scene.background && v.scene.background.set && v.scene.background.set(S.cam ? "#0f172a" : S.out < 0 ? "#e2e8f0" : "#e0f2fe");
      };
      const sample = () => {
        const tot = Htot() - HA("v"), r = Math.random() * (tot + HA("v"));
        let acc = 0;
        for (const k of ["w", "wi", "r", "f"]) { acc += HA(k); if (r < acc) { const c = parts.filter((p) => p.userData.el === k); return c[(Math.random() * c.length) | 0]; } }
        return chim;
      };
      let spawnAcc = 0;
      v.updaters.push((dt) => {
        spawnAcc += dt * Q() / 60;
        while (spawnAcc > 1) {
          spawnAcc -= 1;
          const m = ps.find((x) => !x.visible); if (!m) break;
          const src = sample(), n = src.userData.n || [0, 1, 0];
          const bb = new T.Box3().setFromObject(src);
          m.position.set(lerp(bb.min.x, bb.max.x, Math.random()), lerp(bb.min.y, bb.max.y, Math.random()), lerp(bb.min.z, bb.max.z, Math.random()));
          m.userData.vel = new T.Vector3(n[0] * 0.5, 0.25 + n[1] * 0.3, n[2] * 0.5); m.userData.life = 0; m.visible = true;
        }
        ps.forEach((m) => { if (!m.visible) return; m.userData.life += dt; m.position.addScaledVector(m.userData.vel, dt); m.scale.setScalar(1 + m.userData.life); if (m.userData.life > 1.6) m.visible = false; });
      });
      v.onTap = (e) => {
        const h = v.pick(e, parts); if (!h) return;
        const k = h.object.userData.el; S[k] = (S[k] + 1) % E[k][2].length; paint(); ui.render(); chk();
      };
      ui.probe = (p, o) => {
        const k = o && o.userData && o.userData.el; if (!k) return `T ≈ ${S.out} °C`;
        return `${L(E[k][0])}: U = ${fmt(U(k), 2)} W/(m²·K), q = U·ΔT = ${fmt(U(k) * dT(), 1)} W/m²`;
      };
      const show = (k, x) => `${x} °C`;
      const table = () => ["w", "wi", "r", "f", "v"].map((k) => { const qk = HA(k) * dT(), sh = (HA(k) / Htot()) * 100; return `<div class="lab-bar"><span>${H(E[k][0])}</span><i style="width:${sh.toFixed(0)}%;background:${heat(sh / 45).getStyle()}"></i><b>${fmt(sh, 0)}%</b></div>${stage() === "uni" ? `<small class="muted">U·A = ${fmt(HA(k), 1)} W/K · Q = ${fmt(qk, 0)} W</small>` : ""}`; }).join("");
      const badge = () => `<span class="l3-cls" style="background:${CLC[cls()]}">${cls()}</span>`;
      const outK = () => {
        const cut = (1 - Htot() / H0) * 100;
        return `<div class="l3-big"><span>${badge()}</span><b>${fmt(Q() / 1000, 1)} kW</b><small>${H(t3("иссиқлик йўқотиш", "теплопотери", "heat loss"))} · −${fmt(Math.max(0, cut), 0)}%</small></div>${table()}
          <p class="small muted">🔥 ${H(t3("Йилига газ", "Газа в год", "Gas per year"))}: <b>${fmt(kwh() / (9.3 * 0.9), 0)} m³</b></p>`;
      };
      const outU = () => `<div class="lab-formula">H = ΣU·A + 0,34·n·V = <b>${fmt(Htot(), 1)}</b> W/K<br>Q = H·ΔT = ${fmt(Htot(), 1)} × ${dT()} = <b>${fmt(Q(), 0)}</b> W<br>Q<sub>${H(t3("йил", "год", "yr"))}</sub> = H·ГСОП·24 = <b>${fmt(kwh(), 0)}</b> kWh (ГСОП ≈ ${GSOP} K·${H(t3("сутка", "сут", "day"))})<br>q = <b>${fmt(spec(), 0)}</b> kWh/(m²·${H(t3("йил", "год", "yr"))}) ${badge()} · ${H(t3("газ", "газ", "gas"))} <b>${fmt(kwh() / (9.3 * 0.9), 0)}</b> m³ · CO₂ <b>${fmt((kwh() / (9.3 * 0.9)) * 1.96 / 1000, 2)}</b> t</div>${table()}`;
      const sel = (k) => `<label>${H(E[k][0])}<select data-el="${k}">${E[k][2].map(([u, n], i) => `<option value="${i}" ${i === S[k] ? "selected" : ""}>${H(n)}${k === "v" ? "" : ` · U = ${fmt(u, 2)}`}</option>`).join("")}</select></label>`;
      ui.html = () => {
        const cam = `<label class="l3-check"><input type="checkbox" data-cam ${S.cam ? "checked" : ""}> 🌡 ${H(t3("Иссиқлик камераси (тепловизор)", "Тепловизор", "Thermal camera"))}</label>`;
        const tip = `<p class="small">👆 ${H(t3("Уйнинг девори, деразаси ёки томини 3D саҳнада босинг — изоляция қўшилади.", "Нажимайте на стены, окна или крышу в 3D-сцене — добавится утепление.", "Tap the walls, windows or roof in the 3D scene to add insulation."))}</p>`;
        if (stage() !== "uni") return `${tip}${["w", "wi", "r", "v"].map(sel).join("")}${rngH("out", "❄️ " + H(t3("Ташқари ҳарорати", "Температура снаружи", "Outside temperature")), S.out, -20, 15, 1, show("out", S.out))}${cam}
          <div data-out>${outK()}</div><p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Уйнинг иссиқлик йўқотишини 60 % дан кўпроқ камайтиринг.", "Сократите теплопотери дома больше чем на 60 %.", "Cut the house's heat loss by more than 60 %."))}</p>`;
        return `${tip}${["w", "wi", "r", "f", "v"].map(sel).join("")}
          ${rngH("out", H(t3("Ташқари ҳарорати", "Температура снаружи", "Outside temperature")), S.out, -20, 15, 1, show("out", S.out))}
          ${rngH("in", H(t3("Ички ҳарорат", "Внутренняя температура", "Indoor temperature")), S.in, 16, 24, 1, show("in", S.in))}${cam}
          <div data-out>${outU()}</div>`;
      };
      const chk = () => { if (stage() !== "uni" && 1 - Htot() / H0 > 0.6) star("uy", ui.el.querySelector("[data-star]")); };
      ui.bind = (el) => {
        liveBind(el, S, show, stage() === "uni" ? outU : outK, () => paint());
        el.querySelectorAll("[data-el]").forEach((s) => s.addEventListener("change", () => { S[s.dataset.el] = +s.value; paint(); ui.render(); chk(); }));
        const c = el.querySelector("[data-cam]"); if (c) c.addEventListener("change", () => { S.cam = c.checked ? 1 : 0; paint(); });
      };
      ui.goals = stage() === "uni" ? [
        { id: "b", t: t3("Энергия синфи B ёки яхшироқ (≤ 100 кВт·соат/м²)", "Класс энергоэффективности B или лучше (≤ 100 кВт·ч/м²)", "Energy class B or better (≤ 100 kWh/m²)"), ok: () => spec() <= 100 },
        { id: "rec", t: t3("Рекуператор билан вентиляция йўқотишини камайтиринг", "Снизьте вентиляционные потери рекуператором", "Cut ventilation losses with heat recovery"), ok: () => S.v === 2 },
        { id: "a", t: t3("A синфли уй: ≤ 50 кВт·соат/(м²·йил)", "Дом класса A: ≤ 50 кВт·ч/(м²·год)", "Class A house: ≤ 50 kWh/(m²·yr)"), ok: () => spec() <= 50 }
      ] : [
        { id: "roof", t: t3("Томга иссиқлик изоляцияси қўйинг", "Утеплите крышу", "Insulate the roof"), ok: () => S.r > 0 },
        { id: "win", t: t3("Деразаларни уч қават ойнага алмаштиринг", "Поставьте тройные стеклопакеты", "Fit triple-glazed windows"), ok: () => S.wi >= 2 },
        { id: "a", t: t3("A синфли уй қуринг", "Постройте дом класса A", "Build a class A house"), ok: () => cls() === "A" }
      ];
      ui.read = () => ({ p: ["w", "wi", "r", "f", "v"].map((k) => `${L(E[k][0])}: ${fmt(U(k), 2)}`).join("; ") + `; t = ${S.out} °C`, r: `Q = ${fmt(Q(), 0)} W (${cls()})`, x: S.out, y: Q(), xl: "t, °C", yl: "Q, W" });
      ui.task = () => ({ q: t3("Девор юзаси A = 100 м², U = 1,5 Вт/(м²·К), ичкарида +20 °C, ташқарида −5 °C. Девор орқали иссиқлик йўқотиш Q неча Вт?", "Площадь стены A = 100 м², U = 1,5 Вт/(м²·К), внутри +20 °C, снаружи −5 °C. Теплопотери через стену Q, Вт?", "A wall of A = 100 m², U = 1.5 W/(m²·K), +20 °C inside and −5 °C outside. What is the heat loss Q in W?"),
        a: 3750, tol: 20, unit: "W", dec: 0, hint: t3("Q = U·A·ΔT, ΔT = 20 − (−5).", "Q = U·A·ΔT, ΔT = 20 − (−5).", "Q = U·A·ΔT with ΔT = 20 − (−5).") });
      paint();
    }
  };

  /* =====================================================================
     14) 🕳️ Ер ости сувининг ифлосланиши — Дарси қонуни, адвекция-дисперсия
     ===================================================================== */
  const erfc = (x) => { const z = Math.abs(x), t = 1 / (1 + 0.5 * z); const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; };
  const AQUI = {
    id: "yerosti", icon: "🕳️",
    name: t3("Ер ости суви ифлосланиши", "Загрязнение подземных вод", "Groundwater pollution"),
    q: t3("Чиқинди полигонидан сизган ифлослик қудуққа қанча вақтда етиб боради ва уни қандай тўхтатиш мумкин?", "За какое время загрязнение со свалки дойдёт до колодца и как его остановить?", "How long does pollution from a landfill take to reach a well, and how can we stop it?"),
    poe: { o: [t3("Гилда тез оқади", "В глине течёт быстро", "Fast through clay"), t3("Қум ва шағалда тез оқади", "Быстро в песке и гравии", "Fast through sand and gravel"), t3("Тупроқ тури аҳамиятсиз", "Тип грунта неважен", "Soil type doesn't matter")], a: 1,
      w: t3("Шағалнинг фильтрация коэффициенти гилдан миллион марта катта: сув ва ифлослик қум-шағалда йиллар эмас, кунлар ичида етиб боради.", "Коэффициент фильтрации гравия в миллион раз больше, чем у глины: в песке и гравии загрязнение доходит за дни, а не годы.", "Gravel conducts water a million times better than clay: in sand and gravel pollution arrives in days, not years.") },
    src: "Darcy H., 1856; Ogata A., Banks R.B., USGS Prof. Paper 411-A, 1961; Gelhar L.W. et al., Water Resour. Res. 28:1955, 1992; Freeze R.A., Cherry J.A. «Groundwater», 1979; Ветошкин А.Г. «Защита литосферы от отходов», 2005; US EPA 40 CFR 258 (landfill liners)",
    view: { bg: "#e0f2fe", d: 10, ph: 1.0, th: 0.55, target: [0, -0.8, 0], minD: 4, maxD: 18 },
    soils: [["g", "🪨", t3("Шағал", "Гравий", "Gravel"), 1e-3, 0.25, 0x9ca3af], ["s", "🏖️", t3("Қум", "Песок", "Sand"), 1e-4, 0.3, 0xfcd34d], ["l", "🟫", t3("Қумоқ", "Суглинок", "Loam"), 1e-6, 0.35, 0xb45309], ["c", "🧱", t3("Гил", "Глина", "Clay"), 1e-9, 0.05, 0x9a3412]],
    cons: [[1, "🧪", t3("Нитрат (ўғит), R = 1", "Нитрат (удобрения), R = 1", "Nitrate (fertiliser), R = 1")], [2.5, "⛽", t3("Бензол (ёқилғи), R = 2,5", "Бензол (топливо), R = 2,5", "Benzene (fuel), R = 2.5")], [60, "🔩", t3("Қўрғошин (Pb), R = 60", "Свинец (Pb), R = 60", "Lead (Pb), R = 60")]],
    quiz: [
      { q: t3("Дарси қонуни бўйича сув оқими нимага пропорционал?", "Чему пропорционален поток воды по закону Дарси?", "By Darcy's law, water flow is proportional to…"), o: [t3("Фильтрация коэффициенти ва гидравлик градиентга", "Коэффициенту фильтрации и гидравлическому градиенту", "Hydraulic conductivity and hydraulic gradient"), t3("Фақат ҳароратга", "Только температуре", "Temperature only"), t3("Қудуқ чуқурлигига", "Глубине колодца", "Well depth")], a: 0, w: t3("q = K·i; ҳақиқий тезлик v = K·i/n.", "q = K·i; действительная скорость v = K·i/n.", "q = K·i; the real (seepage) velocity is v = K·i/n.") },
      { q: t3("Полигон тагига геомембрана ва гил қатлам нима учун ётқизилади?", "Зачем под полигон укладывают геомембрану и глину?", "Why are a geomembrane and clay laid under a landfill?"), o: [t3("Фильтрат ер ости сувига сизмаслиги учун", "Чтобы фильтрат не просачивался в подземные воды", "So leachate does not seep into groundwater"), t3("Чиқинди тез чириши учун", "Чтобы отходы быстрее гнили", "So waste rots faster"), t3("Чиройли кўриниши учун", "Для красоты", "For looks")], a: 0, w: t3("US EPA 40 CFR 258: композит экран (≥ 0,75 мм мембрана + 60 см гил, K ≤ 10⁻⁹ м/с).", "US EPA 40 CFR 258: композитный экран (мембрана ≥ 0,75 мм + 60 см глины, K ≤ 10⁻⁹ м/с).", "US EPA 40 CFR 258: composite liner (≥ 0.75 mm membrane + 60 cm clay, K ≤ 10⁻⁹ m/s).") },
      { q: t3("Ретардация R = 60 нимани билдиради?", "Что значит ретардация R = 60?", "What does a retardation R = 60 mean?"), o: [t3("Модда сувдан 60 марта секин ҳаракатланади", "Вещество движется в 60 раз медленнее воды", "The substance moves 60 times slower than water"), t3("60 йилда парчаланади", "Распадается за 60 лет", "It decays in 60 years"), t3("60 марта заҳарли", "В 60 раз токсичнее", "It is 60 times more toxic")], a: 0, w: t3("Оғир металлар тупроқ заррачаларига ёпишади (сорбция), шунинг учун секин кўчади.", "Тяжёлые металлы сорбируются частицами грунта и движутся медленно.", "Heavy metals stick to soil grains (sorption), so they move slowly.") }
    ],
    build(v, ui) {
      const T = THREE, S = { s: "s", i: 0.01, n: 0.3, c: 1, t: 2, lin: 0, xw: 1.5, zw: 0.3, play: 0 };
      const U_M = 25, XS = -3; // 1 бирлик = 25 м; манба x = −3
      const soil = () => this.soils.find((x) => x[0] === S.s);
      const nEff = () => (stage() === "uni" ? S.n : soil()[4]);
      const vel = () => (soil()[3] * S.i) / nEff(); // м/с
      const vd = () => vel() * 86400; // м/сутка
      const C0 = () => (S.lin ? 0.005 : 1);
      const conc = (xm, zm, yrs) => {
        if (xm <= 0 || yrs <= 0) return 0;
        const tt = yrs * 365.25 * 86400, R = S.c, v_ = vel(), aL = 0.1 * xm, D = aL * v_;
        const a = (xm - (v_ * tt) / R) / (2 * Math.sqrt((D * tt) / R) + 1e-12);
        const sT = Math.sqrt(2 * (aL / 10) * xm), lat = Math.exp(-(zm * zm) / (2 * (sT * sT + 15 * 15)));
        return clamp(C0() * 0.5 * erfc(a) * lat, 0, 1);
      };
      const Lw = () => (S.xw - XS) * U_M, Zw = () => S.zw * U_M;
      const cw = () => conc(Lw(), Zw(), S.t);
      const tArr = () => (Lw() > 0 ? (Lw() * S.c) / vd() / 365.25 : Infinity); // йил
      ui.unit = () => U_M;
      /* Саҳна: кесилган тупроқ блоки */
      const W = 8, Dz = 4;
      const top = new T.Mesh(new T.BoxGeometry(W, 0.06, Dz), mat(0x65a30d, { roughness: 1 })); top.position.y = -0.03; top.userData.surf = 1; v.scene.add(top);
      const vad = new T.Mesh(new T.BoxGeometry(W, 0.6, Dz), mat(0xd6b98c, { transparent: true, opacity: 0.55 })); vad.position.y = -0.36; v.scene.add(vad);
      const aqM = mat(0xfcd34d, { transparent: true, opacity: 0.42, depthWrite: false });
      const aq = new T.Mesh(new T.BoxGeometry(W, 1.8, Dz), aqM); aq.position.y = -1.56; v.scene.add(aq);
      const base = new T.Mesh(new T.BoxGeometry(W, 0.3, Dz), mat(0x57534e)); base.position.y = -2.61; v.scene.add(base);
      const wt = new T.Mesh(new T.PlaneGeometry(W, Dz), new T.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.35, side: T.DoubleSide, depthWrite: false })); wt.rotation.x = -Math.PI / 2; wt.position.y = -0.66; wt.userData.noPick = true; v.scene.add(wt);
      const fill = new T.Mesh(new T.BoxGeometry(1.4, 0.35, 1.6), mat(0x44403c)); fill.position.set(XS, 0.17, 0); v.scene.add(fill);
      for (let k = 0; k < 14; k++) { const b = new T.Mesh(new T.BoxGeometry(0.16, 0.12, 0.16), mat([0xef4444, 0x3b82f6, 0xeab308, 0xa3a3a3][k % 4])); b.position.set(XS - 0.55 + Math.random() * 1.1, 0.38, -0.65 + Math.random() * 1.3); b.rotation.y = Math.random() * 3; v.scene.add(b); }
      const liner = new T.Mesh(new T.BoxGeometry(1.6, 0.04, 1.8), mat(0x111827)); liner.position.set(XS, -0.02, 0); v.scene.add(liner);
      const plM = new T.MeshStandardMaterial({ color: 0xdc2626, transparent: true, opacity: 0.5, depthWrite: false });
      const plume = new T.Mesh(new T.SphereGeometry(1, 32, 16), plM); plume.userData.noPick = true; v.scene.add(plume);
      const arrows = Array.from({ length: 10 }, (_, k) => { const a = new T.Mesh(new T.ConeGeometry(0.07, 0.22, 10), mat(0x0369a1)); a.rotation.z = -Math.PI / 2; a.position.set(-3.6 + (k % 5) * 1.7, -1.1 - Math.floor(k / 5) * 0.8, Dz / 2 + 0.01); a.userData.noPick = true; v.scene.add(a); return a; });
      const well = new T.Group(); v.scene.add(well);
      const casing = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 2.5, 16), mat(0x475569, { metalness: 0.5 })); casing.position.y = -1.05; well.add(casing);
      const head = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.3, 16), mat(0x94a3b8)); head.position.y = 0.15; well.add(head);
      let icon = null;
      const setIcon = () => { if (icon) { well.remove(icon); icon.material.map.dispose(); icon.material.dispose(); } icon = textSprite(cw() < 0.01 ? "💧" : "☠️", "#ffffff", 0.45); icon.position.y = 0.65; well.add(icon); };
      let lastSafe = null;
      const layout = () => {
        const s = soil(); aqM.color.setHex(s[5]);
        const xf = (vd() * S.t * 365.25) / S.c / U_M; // бирлик
        const len = clamp(xf, 0, 10), wid = clamp(0.6 + 0.25 * Math.sqrt(Math.max(xf, 0)), 0.6, 1.8);
        plume.visible = S.t > 0 && len > 0.02;
        plume.scale.set(Math.max(0.05, len / 2 + 0.3), 0.5, wid);
        plume.position.set(XS + len / 2, -1.2, 0);
        plM.opacity = 0.15 + 0.45 * C0();
        if (plume.position.x + plume.scale.x > W / 2) { const over = plume.position.x + plume.scale.x - W / 2; plume.scale.x -= over / 2; plume.position.x -= over / 2; }
        liner.visible = !!S.lin;
        well.position.set(S.xw, 0, S.zw);
        const safe = cw() < 0.01; if (safe !== lastSafe) { lastSafe = safe; setIcon(); }
      };
      let tick = 0;
      v.updaters.push((dt, t) => {
        arrows.forEach((a, k) => { a.position.x = -3.8 + (((k % 5) * 1.7 + t * clamp(Math.log10(vd() + 1e-9) + 6, 0.05, 6) * 0.25) % 8.2); });
        if (S.play) {
          S.t = Math.min(S.tmax || 50, S.t + dt * 2);
          tick += dt; if (tick > 0.25) { tick = 0; layout(); const o = ui.el.querySelector("[data-out]"); if (o) o.innerHTML = out(); const r = ui.el.querySelector('input[data-k="t"]'); if (r) { r.value = S.t; r.parentElement.querySelector("b").textContent = show("t", S.t); } chk(); }
          if (S.t >= (S.tmax || 50)) { S.play = 0; ui.render(); }
        }
      });
      v.onTap = (e) => { const h = v.pick(e, [top]); if (!h) return; S.xw = clamp(h.point.x, -3.8, 3.8); S.zw = clamp(h.point.z, -1.8, 1.8); layout(); ui.render(); chk(); };
      ui.probe = (p) => {
        const xm = (p.x - XS) * U_M, c = conc(xm, p.z * U_M, S.t);
        return `x = ${fmt(xm, 0)} m: C/C₀ = ${fmt(c, 3)}${xm > 0 ? ` · ${L(t3("фронт етиб келиши", "приход фронта", "front arrives"))} ≈ ${fmt((xm * S.c) / vd() / 365.25, 1)} ${L(t3("йил", "лет", "yr"))}` : ""}`;
      };
      const show = (k, x) => ({ i: fmt(x, 3), n: fmt(x, 2), t: `${fmt(x, 1)} ${L(t3("йил", "лет", "yr"))}` }[k]);
      const status = () => { const c = cw(); return c < 0.01 ? ["💧", t3("Қудуқ суви тоза", "Вода в колодце чистая", "Well water is clean")] : c < 0.1 ? ["⚠️", t3("Ифлослик етиб келмоқда", "Загрязнение приближается", "Pollution is arriving")] : ["☠️", t3("Қудуқ суви ифлосланган!", "Вода в колодце загрязнена!", "The well water is polluted!")]; };
      const out = () => {
        const [ic, msg] = status(), ta = tArr();
        if (stage() !== "uni") return `<div class="l3-big"><span>${ic}</span><b>${fmt(cw() * 100, 1)}%</b><small>${H(msg)}</small></div><p class="small muted">${H(t3("Қудуқгача", "До колодца", "To the well"))}: ${fmt(Math.hypot(Lw(), Zw()), 0)} m · ${isFinite(ta) ? `${H(t3("ифлослик", "загрязнение дойдёт за", "arrives in"))} ≈ ${fmt(ta, ta < 10 ? 1 : 0)} ${H(t3("йилда етади", "лет", "yr"))}` : H(t3("қудуқ оқимга қарши томонда", "колодец выше по потоку", "the well is upstream"))}</p>`;
        const curve = []; for (let y = 0; y <= 50; y += 1) curve.push([y, conc(Lw(), Zw(), y)]);
        return `<div class="lab-formula">v = K·i / n = ${soil()[3].toExponential(0)} × ${fmt(S.i, 3)} / ${fmt(nEff(), 2)} = <b>${fmt(vd(), vd() < 0.01 ? 5 : 3)}</b> m/${H(t3("сут", "сут", "day"))}<br>x<sub>f</sub> = v·t / R = <b>${fmt((vd() * S.t * 365.25) / S.c, 0)}</b> m · t<sub>${H(t3("етиш", "приход", "arr"))}</sub> = L·R / v = <b>${isFinite(ta) ? fmt(ta, 1) : "∞"}</b> ${H(t3("йил", "лет", "yr"))}<br>C/C₀ = ½·erfc[(L − vt/R) / 2√(Dt/R)] = <b>${fmt(cw(), 4)}</b> (α<sub>L</sub> = 0,1·L)</div>
          ${chartSvg([{ pts: curve, c: "#dc2626" }], { mark: [S.t, cw()], xl: H(t3("вақт, йил", "время, лет", "time, yr")), yl: "C/C₀", x0: 0, x1: 50, y0: 0, y1: 1 })}
          <p class="small muted">${ic} ${H(msg)} · ${H(t3("Қудуқ", "Колодец", "Well"))}: L = ${fmt(Lw(), 0)} m, z = ${fmt(Zw(), 0)} m</p>`;
      };
      ui.html = () => {
        const kid = stage() !== "uni";
        const play = `<button type="button" class="btn btn-ghost btn-sm" data-play>${S.play ? "⏸" : "▶"} ${H(S.play ? t3("Тўхтатиш", "Пауза", "Pause") : t3("Вақтни юргизиш", "Запустить время", "Run time"))}</button>`;
        const lin = `<label class="l3-check"><input type="checkbox" data-lin ${S.lin ? "checked" : ""}> 🛡 ${H(t3("Полигон тагига геомембрана + гил экран (EPA 40 CFR 258)", "Геомембрана + глиняный экран под полигоном (EPA 40 CFR 258)", "Geomembrane + clay liner under the landfill (EPA 40 CFR 258)"))}</label>`;
        const tip = `<p class="small">👆 ${H(t3("Ер юзасини босиб қудуқни кўчиринг. Сув чапдан ўнгга оқади.", "Нажмите на поверхность, чтобы перенести колодец. Вода течёт слева направо.", "Tap the ground to move the well. Water flows from left to right."))}</p>`;
        if (kid) return `${tip}<p class="small"><b>${H(t3("Тупроқ тури", "Тип грунта", "Soil type"))}</b></p>${optsH("s", this.soils.map(([id, e, n]) => [id, e, n]), S.s)}
          ${rngH("t", "⏳ " + H(t3("Вақт", "Время", "Time")), S.t, 0, 30, 0.5, show("t", S.t))}${play}${lin}<div data-out>${out()}</div>
          <p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Қудуқ полигондан оқим бўйича пастда турсин ва 10 йилдан кейин ҳам суви тоза бўлсин.", "Колодец ниже свалки по течению, и через 10 лет вода в нём чистая.", "Keep the well downstream of the landfill and its water clean after 10 years."))}</p>`;
        return `${tip}${optsH("s", this.soils.map(([id, e, n]) => [id, e, n]), S.s)}
          ${rngH("i", H(t3("Гидравлик градиент i", "Гидравлический градиент i", "Hydraulic gradient i")), S.i, 0.001, 0.05, 0.001, show("i", S.i))}
          ${rngH("n", H(t3("Самарали ғоваклик n", "Эффективная пористость n", "Effective porosity n")), S.n, 0.05, 0.45, 0.01, show("n", S.n))}
          <label>${H(t3("Ифлослантирувчи", "Загрязнитель", "Contaminant"))}<select data-c>${this.cons.map(([r, e, n]) => `<option value="${r}" ${r === S.c ? "selected" : ""}>${e} ${H(n)}</option>`).join("")}</select></label>
          ${rngH("t", H(t3("Вақт t", "Время t", "Time t")), S.t, 0, 50, 0.5, show("t", S.t))}${play}${lin}<div data-out>${out()}</div>`;
      };
      const chk = () => { if (stage() !== "uni" && S.t >= 10 && S.xw > XS + 0.8 && cw() < 0.01) star("yerosti", ui.el.querySelector("[data-star]")); };
      ui.bind = (el) => {
        liveBind(el, S, show, out, () => { layout(); chk(); });
        bindOpts(el, S, () => { layout(); ui.render(); chk(); });
        const p = el.querySelector("[data-play]"); if (p) p.addEventListener("click", () => { if (!S.play && S.t >= (stage() === "uni" ? 50 : 30)) S.t = 0; S.tmax = stage() === "uni" ? 50 : 30; S.play = S.play ? 0 : 1; ui.render(); });
        const l = el.querySelector("[data-lin]"); if (l) l.addEventListener("change", () => { S.lin = l.checked ? 1 : 0; layout(); ui.render(); chk(); });
        const c = el.querySelector("[data-c]"); if (c) c.addEventListener("change", () => { S.c = +c.value; layout(); ui.render(); });
      };
      ui.goals = stage() === "uni" ? [
        { id: "pb", t: t3("Қўрғошиннинг (R = 60) қанчалик секин кўчишини кўринг", "Посмотрите, как медленно мигрирует свинец (R = 60)", "See how slowly lead (R = 60) migrates"), ok: () => S.c === 60 },
        { id: "fast", t: t3("Ер ости суви суткасига 1 м дан тез оқадиган шароит яратинг", "Создайте условия, где подземная вода течёт быстрее 1 м/сут", "Make groundwater flow faster than 1 m/day"), ok: () => vd() > 1 },
        { id: "safe", t: t3("Қудуқ оқим бўйича ≥ 100 м пастда, 20 йилда ҳам C/C₀ < 0,01", "Колодец ≥ 100 м ниже по потоку, и через 20 лет C/C₀ < 0,01", "Well ≥ 100 m downstream with C/C₀ < 0.01 even after 20 years"), ok: () => S.t >= 20 && Lw() >= 100 && cw() < 0.01 }
      ] : [
        { id: "reach", t: t3("Ифлосликнинг қудуққа етиб боришини кузатинг", "Посмотрите, как загрязнение доходит до колодца", "Watch the pollution reach the well"), ok: () => cw() > 0.1 },
        { id: "up", t: t3("Қудуқни оқимга қарши (полигондан чапга) кўчиринг", "Перенесите колодец против течения (левее свалки)", "Move the well upstream (left of the landfill)"), ok: () => S.xw < XS },
        { id: "lin", t: t3("Полигон тагига ҳимоя экранини ётқизинг", "Положите защитный экран под полигон", "Lay a protective liner under the landfill"), ok: () => !!S.lin }
      ];
      ui.read = () => ({ p: `${L(soil()[2])}; i = ${fmt(S.i, 3)}; R = ${S.c}; t = ${fmt(S.t, 1)}; L = ${fmt(Lw(), 0)} m${S.lin ? "; liner" : ""}`, r: `C/C₀ = ${fmt(cw(), 3)}`, x: S.t, y: cw(), xl: "t, yr", yl: "C/C₀" });
      ui.task = () => ({ q: t3("Қум қатлами: K = 1·10⁻⁴ м/с, гидравлик градиент i = 0,01, самарали ғоваклик n = 0,3. Ер ости сувининг ҳақиқий тезлиги неча м/сутка?", "Песок: K = 1·10⁻⁴ м/с, градиент i = 0,01, эффективная пористость n = 0,3. Действительная скорость подземной воды, м/сут?", "Sand: K = 1·10⁻⁴ m/s, gradient i = 0.01, effective porosity n = 0.3. What is the seepage velocity in m/day?"),
        a: (1e-4 * 0.01 / 0.3) * 86400, tol: 0.01, unit: "m/day", dec: 3, hint: t3("v = K·i/n (м/с), кейин 86 400 га кўпайтиринг.", "v = K·i/n (м/с), затем умножьте на 86 400.", "v = K·i/n in m/s, then multiply by 86,400.") });
      layout();
    }
  };

  /* =====================================================================
     15) 🌪️ Циклон-чангушлагич — Лаппл модели, d₅₀, фракцион самарадорлик
     ===================================================================== */
  const CYCL = {
    id: "siklon", icon: "🌪️",
    name: t3("Циклон чангушлагич", "Циклон-пылеуловитель", "Cyclone dust collector"),
    q: t3("Циклон қайси чангни яхши ушлайди: йирикними ёки жуда майдасини (тутунни)?", "Какую пыль циклон улавливает лучше: крупную или очень мелкую (дым)?", "Which dust does a cyclone catch better: coarse or very fine (smoke)?"),
    poe: { o: [t3("Йирик чангни", "Крупную пыль", "Coarse dust"), t3("Майда тутунни", "Мелкий дым", "Fine smoke"), t3("Иккаласини бир хил", "Одинаково", "Both equally")], a: 0,
      w: t3("Марказдан қочма куч заррача массасига боғлиқ: йирик заррачалар деворга отилади, 1 мкм дан майдалари эса газ билан чиқиб кетади — улар учун енгли фильтр ёки электрофильтр керак.", "Центробежная сила зависит от массы: крупные частицы отбрасываются к стенке, а мельче 1 мкм уходят с газом — для них нужны рукавные или электрофильтры.", "Centrifugal force depends on mass: big particles are flung to the wall, while sub-micron ones escape with the gas and need bag filters or electrostatic precipitators.") },
    src: "Lapple C.E., Chem. Eng. 58:144, 1951; Shepherd C.B., Lapple C.E., Ind. Eng. Chem. 31:972, 1939; Cooper C.D., Alley F.C. «Air Pollution Control: A Design Approach», 4th ed., 2011, ch. 6; Ветошкин А.Г. «Процессы и аппараты пылеочистки», 2005",
    view: { bg: "#1e293b", d: 9, ph: 1.2, th: 0.6, target: [0, 2.2, 0], minD: 3.5, maxD: 16 },
    dusts: [[50, "🏖️", t3("Қум (50 мкм)", "Песок (50 мкм)", "Sand (50 µm)"), 2650], [10, "🧱", t3("Цемент чанги (10 мкм)", "Цементная пыль (10 мкм)", "Cement dust (10 µm)"), 3100], [5, "🌾", t3("Ун чанги (5 мкм)", "Мучная пыль (5 мкм)", "Flour dust (5 µm)"), 1500], [0.5, "🚬", t3("Тутун (0,5 мкм)", "Дым (0,5 мкм)", "Smoke (0.5 µm)"), 1200]],
    quiz: [
      { q: t3("Циклонда чанг заррачаларини нима ажратади?", "Что отделяет частицы пыли в циклоне?", "What separates dust particles in a cyclone?"), o: [t3("Марказдан қочма куч", "Центробежная сила", "Centrifugal force"), t3("Магнит", "Магнит", "A magnet"), t3("Сув", "Вода", "Water")], a: 0, w: t3("Газ спирал бўйлаб айланади, заррачалар деворга отилиб, бункерга тушади.", "Газ закручивается, частицы отбрасываются к стенке и падают в бункер.", "The gas spins; particles are flung to the wall and slide into the hopper.") },
      { q: t3("d₅₀ (кесиш диаметри) нима?", "Что такое d₅₀ (диаметр отсечки)?", "What is d₅₀ (cut size)?"), o: [t3("50 % самарадорлик билан ушланадиган заррача ўлчами", "Размер частиц, улавливаемых на 50 %", "The particle size caught with 50 % efficiency"), t3("Циклон диаметри", "Диаметр циклона", "Cyclone diameter"), t3("Ҳаво тезлиги", "Скорость воздуха", "Air speed")], a: 0, w: t3("Лаппл: η = 1 / (1 + (d₅₀/d)²).", "Лаппл: η = 1 / (1 + (d₅₀/d)²).", "Lapple: η = 1 / (1 + (d₅₀/d)²).") },
      { q: t3("Кириш тезлигини оширсак, нима ёмонлашади?", "Что ухудшится при увеличении входной скорости?", "What gets worse if we raise the inlet speed?"), o: [t3("Босим йўқотиши ва электр сарфи", "Потери давления и расход энергии", "Pressure drop and energy use"), t3("Ушлаш самарадорлиги", "Эффективность улавливания", "Collection efficiency"), t3("Ҳеч нарса", "Ничего", "Nothing")], a: 0, w: t3("ΔP ~ ρV², вентилятор қуввати тез ортади.", "ΔP ~ ρV², мощность вентилятора быстро растёт.", "ΔP ~ ρV², so fan power rises quickly.") }
    ],
    build(v, ui) {
      const T = THREE, S = { dp: 10, rp: 3100, Vi: 15, D: 1, Ne: 6, tg: 20 };
      const mu = () => 1.716e-5 * Math.pow((S.tg + 273.15) / 273.15, 1.5) * (273.15 + 110.4) / (S.tg + 273.15 + 110.4);
      const rg = () => 353 / (S.tg + 273.15);
      const d50 = () => Math.sqrt((9 * mu() * (S.D / 4)) / (2 * Math.PI * S.Ne * S.Vi * (S.rp - rg())));
      const eta = (dp = S.dp) => 1 / (1 + Math.pow(d50() / (dp * 1e-6), 2));
      const dP = () => 8 * rg() * S.Vi * S.Vi / 2;
      const Qg = () => (S.D / 2) * (S.D / 4) * S.Vi;
      ui.unit = () => S.D / 1.2;
      const glass = new T.MeshStandardMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.22, side: T.DoubleSide, depthWrite: false, metalness: 0.3, roughness: 0.2 });
      const body = new T.Mesh(new T.CylinderGeometry(0.6, 0.6, 2.4, 40, 1, true), glass); body.position.y = 3.6; v.scene.add(body);
      const cone = new T.Mesh(new T.CylinderGeometry(0.6, 0.15, 2.4, 40, 1, true), glass); cone.position.y = 1.2; v.scene.add(cone);
      const edge = new T.LineBasicMaterial({ color: 0x94a3b8 });
      [body, cone].forEach((m) => { const e = new T.LineSegments(new T.EdgesGeometry(m.geometry, 30), edge); e.position.copy(m.position); v.scene.add(e); });
      const inlet = new T.Mesh(new T.BoxGeometry(1.4, 0.6, 0.3), glass); inlet.position.set(-0.7, 4.5, 0.45); v.scene.add(inlet);
      const tube = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 1.8, 28, 1, true), new T.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.3, side: T.DoubleSide })); tube.position.y = 4.7; v.scene.add(tube);
      const hop = new T.Mesh(new T.BoxGeometry(0.7, 0.6, 0.7), mat(0x475569, { transparent: true, opacity: 0.6 })); hop.position.y = -0.3; v.scene.add(hop);
      const pile = new T.Mesh(new T.CylinderGeometry(0.3, 0.33, 1, 20), mat(0x92400e)); pile.position.y = -0.6; v.scene.add(pile);
      const lin = textSprite("→ " + L(t3("чангли ҳаво", "пыльный воздух", "dusty air")), "#e2e8f0", 0.26); lin.position.set(-1.4, 5.1, 0.45); v.scene.add(lin);
      const lout = textSprite("↑ " + L(t3("тоза ҳаво", "чистый воздух", "clean air")), "#86efac", 0.26); lout.position.set(0, 5.9, 0); v.scene.add(lout);
      const N = 180, im = new T.InstancedMesh(new T.SphereGeometry(1, 6, 5), new T.MeshBasicMaterial({ color: 0xffffff }), N); im.userData.noPick = true; v.scene.add(im);
      const P = Array.from({ length: N }, () => ({}));
      let caught = 0, lost = 0, mud = 0;
      const wallR = (y) => (y >= 2.4 ? 0.6 : 0.15 + (0.45 * y) / 2.4);
      const spawn = (p, stag) => { p.ph = 0; p.x = -1.4 - Math.random() * 0.6; p.y = 4.3 + Math.random() * 0.4; p.z = 0.35 + Math.random() * 0.2; p.cap = Math.random() < eta(); p.th = Math.PI / 2; p.r = 0.55; p.w = stag ? Math.random() * 2 : 0; };
      P.forEach((p) => spawn(p, true));
      const col = new T.Color(), mtx = new T.Matrix4();
      v.updaters.push((dt) => {
        const sp = 0.18 * S.Vi;
        const rad = clamp(0.012 + Math.sqrt(S.dp) * 0.006, 0.012, 0.05);
        P.forEach((p, i) => {
          if (p.w > 0) { p.w -= dt; mtx.makeScale(0, 0, 0); im.setMatrixAt(i, mtx); return; }
          if (p.ph === 0) { p.x += sp * dt * 0.5; if (p.x >= 0) { p.ph = 1; p.th = Math.PI / 2; } }
          else if (p.ph === 1) {
            p.th += (sp / Math.max(p.r, 0.12)) * dt * 0.35;
            if (p.cap) { p.y -= dt * 0.5; p.r = wallR(p.y) - 0.03; if (p.y <= 0.02) { p.ph = 3; caught++; mud = Math.min(1, mud + 0.002); } }
            else { p.y -= dt * 0.35; p.r = Math.max(0.12, p.r - dt * 0.08); if (p.r <= 0.32 && p.y < 3.6) p.ph = 2; }
            p.x = Math.cos(p.th) * p.r; p.z = Math.sin(p.th) * p.r;
          } else if (p.ph === 2) { p.th += dt * 6; p.y += dt * 1.2; p.r = 0.15; p.x = Math.cos(p.th) * p.r; p.z = Math.sin(p.th) * p.r; if (p.y > 5.8) { lost++; spawn(p); } }
          else if (p.ph === 3) { spawn(p); }
          mtx.makeScale(rad, rad, rad); mtx.setPosition(p.x, p.y, p.z); im.setMatrixAt(i, mtx);
          col.setHex(p.ph === 2 ? 0xf87171 : p.cap && p.ph === 1 ? 0xfbbf24 : 0xe2e8f0); im.setColorAt(i, col);
        });
        im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
        pile.scale.y = 0.05 + mud * 0.5; pile.position.y = -0.6 + pile.scale.y / 2;
      });
      const reset = () => { caught = 0; lost = 0; P.forEach((p) => spawn(p, true)); };
      ui.probe = (p) => {
        const r = Math.hypot(p.x, p.z) * ui.unit(), R0 = (S.D / 2), vt = S.Vi * Math.pow(R0 / Math.max(r, R0 * 0.25), 0.5);
        return `r = ${fmt(r, 2)} m: v<sub>t</sub> ≈ ${fmt(vt, 1)} m/s`.replace(/<\/?sub>/g, "");
      };
      const show = (k, x) => ({ dp: `${fmt(x, 1)} µm`, rp: `${x} kg/m³`, Vi: `${x} m/s`, D: `${fmt(x, 2)} m`, Ne: `${x}`, tg: `${x} °C` }[k]);
      const outK = () => {
        const e = eta() * 100;
        const msg = e >= 90 ? t3("Ажойиб! Чангнинг деярли ҳаммаси бункерга тушди.", "Отлично! Почти вся пыль попала в бункер.", "Great! Almost all the dust fell into the hopper.") : e >= 50 ? t3("Ярмидан кўпи ушланди. Тезликни ёки циклон ўлчамини ўзгартиринг.", "Поймано больше половины. Измените скорость или размер циклона.", "Over half is caught. Change the speed or cyclone size.") : t3("Чанг тоза ҳаво билан чиқиб кетяпти! Жуда майда заррачалар учун фильтр керак.", "Пыль уходит с воздухом! Для очень мелких частиц нужен фильтр.", "The dust escapes with the air! Very fine particles need a filter.");
        return `<div class="l3-big"><span>${e >= 90 ? "✅" : e >= 50 ? "🌫️" : "🚫"}</span><b>${fmt(e, 0)}%</b><small>${H(t3("ушланди", "уловлено", "caught"))}</small></div><p class="lab-out">${H(msg)}</p>`;
      };
      const outU = () => {
        const curve = []; for (let k = 0; k <= 40; k++) { const d = Math.pow(10, -0.3 + (k / 40) * 2.3); curve.push([d, eta(d) * 100]); }
        return `<div class="lab-formula">μ(T) = <b>${(mu() * 1e5).toFixed(3)}·10⁻⁵</b> Pa·s · ρ<sub>g</sub> = <b>${fmt(rg(), 3)}</b> kg/m³<br>d<sub>50</sub> = √[9μW / (2πN<sub>e</sub>V<sub>i</sub>(ρ<sub>p</sub>−ρ<sub>g</sub>))] = <b>${fmt(d50() * 1e6, 2)}</b> µm (W = D/4)<br>η(d) = 1 / (1 + (d<sub>50</sub>/d)²) = <b>${fmt(eta() * 100, 1)}%</b><br>ΔP = 8·ρ<sub>g</sub>V<sub>i</sub>²/2 = <b>${fmt(dP(), 0)}</b> Pa · Q = <b>${fmt(Qg(), 3)}</b> m³/s · N = QΔP/0,65 = <b>${fmt((Qg() * dP()) / 0.65 / 1000, 2)}</b> kW</div>
          ${chartSvg([{ pts: curve, c: "#f59e0b" }], { mark: [S.dp, eta() * 100], logx: true, x0: 0.5, x1: 100, y0: 0, y1: 100, xl: "d, µm (log)", yl: "η, %" })}`;
      };
      ui.html = () => {
        if (stage() !== "uni") return `<p class="small"><b>${H(t3("Чанг тури", "Вид пыли", "Dust type"))}</b></p>${optsH("dp", this.dusts.map(([d, e, n]) => [d, e, n]), S.dp)}
          <p class="small"><b>${H(t3("Ҳаво тезлиги", "Скорость воздуха", "Air speed"))}</b></p>${optsH("Vi", [[8, "🐢", t3("Секин 8 м/с", "Медленно 8 м/с", "Slow 8 m/s")], [15, "🚲", t3("Ўртача 15 м/с", "Средне 15 м/с", "Medium 15 m/s")], [25, "🚀", t3("Тез 25 м/с", "Быстро 25 м/с", "Fast 25 m/s")]], S.Vi)}
          <p class="small"><b>${H(t3("Циклон ўлчами", "Размер циклона", "Cyclone size"))}</b></p>${optsH("D", [[0.3, "🥤", t3("Кичик 0,3 м", "Малый 0,3 м", "Small 0.3 m")], [1, "🛢️", t3("Ўрта 1 м", "Средний 1 м", "Medium 1 m")], [2, "🏭", t3("Катта 2 м", "Большой 2 м", "Large 2 m")]], S.D)}
          <div data-out>${outK()}</div><p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Цемент чангининг 90 % дан кўпини ушланг.", "Уловите больше 90 % цементной пыли.", "Catch more than 90 % of the cement dust."))}</p>`;
        return `${rngH("dp", H(t3("Заррача диаметри d", "Диаметр частицы d", "Particle size d")), S.dp, 0.5, 100, 0.5, show("dp", S.dp))}
          ${rngH("rp", H(t3("Заррача зичлиги ρp", "Плотность частиц ρp", "Particle density ρp")), S.rp, 500, 4000, 50, show("rp", S.rp))}
          ${rngH("Vi", H(t3("Кириш тезлиги Vi", "Входная скорость Vi", "Inlet velocity Vi")), S.Vi, 5, 30, 1, show("Vi", S.Vi))}
          ${rngH("D", H(t3("Циклон диаметри D", "Диаметр циклона D", "Cyclone diameter D")), S.D, 0.2, 3, 0.05, show("D", S.D))}
          ${rngH("Ne", H(t3("Айланишлар сони Ne", "Число оборотов Ne", "Effective turns Ne")), S.Ne, 3, 10, 1, show("Ne", S.Ne))}
          ${rngH("tg", H(t3("Газ ҳарорати", "Температура газа", "Gas temperature")), S.tg, 20, 400, 10, show("tg", S.tg))}
          <div data-out>${outU()}</div>`;
      };
      const chk = () => { if (stage() !== "uni" && S.dp === 10 && eta() > 0.9) star("siklon", ui.el.querySelector("[data-star]")); };
      ui.bind = (el) => {
        liveBind(el, S, show, stage() === "uni" ? outU : outK, () => { reset(); chk(); });
        bindOpts(el, S, (k) => { if (k === "dp") S.rp = this.dusts.find((x) => x[0] === S.dp)[3]; reset(); ui.render(); chk(); });
      };
      ui.goals = stage() === "uni" ? [
        { id: "d50", t: t3("d₅₀ ≤ 3 мкм га эришинг", "Добейтесь d₅₀ ≤ 3 мкм", "Achieve d₅₀ ≤ 3 µm"), ok: () => d50() <= 3e-6 },
        { id: "hot", t: t3("Иссиқ газ (≥ 300 °C) самарадорликни қандай пасайтиришини кўринг", "Посмотрите, как горячий газ (≥ 300 °C) снижает эффективность", "See how hot gas (≥ 300 °C) lowers efficiency"), ok: () => S.tg >= 300 },
        { id: "opt", t: t3("ΔP ≤ 1 500 Па бўлсин ва 10 мкм заррачаларнинг ≥ 90 % и ушлансин", "ΔP ≤ 1 500 Па и улавливание частиц 10 мкм ≥ 90 %", "Keep ΔP ≤ 1,500 Pa while catching ≥ 90 % of 10 µm particles"), ok: () => dP() <= 1500 && eta(10) >= 0.9 }
      ] : [
        { id: "sand", t: t3("Қумнинг деярли ҳаммасини (≥ 98 %) ушланг", "Уловите почти весь песок (≥ 98 %)", "Catch almost all the sand (≥ 98 %)"), ok: () => S.dp === 50 && eta() >= 0.98 },
        { id: "smoke", t: t3("Тутунни циклон ушлай олмаслигини текширинг", "Проверьте, что циклон не ловит дым", "Check that a cyclone can't catch smoke"), ok: () => S.dp === 0.5 }
      ];
      ui.read = () => ({ p: `d = ${fmt(S.dp, 1)} µm; Vi = ${S.Vi} m/s; D = ${fmt(S.D, 2)} m`, r: `η = ${fmt(eta() * 100, 1)}%`, x: stage() === "uni" ? S.dp : S.Vi, y: eta() * 100, xl: stage() === "uni" ? "d, µm" : "Vi, m/s", yl: "η, %" });
      ui.task = () => ({ q: t3("Лаппл циклони: D = 1 м (W = 0,25 м), Vi = 15 м/с, Ne = 6, ρp = 2000 кг/м³, ҳаво μ = 1,81·10⁻⁵ Па·с, ρg ≈ 1,2 кг/м³. Кесиш диаметри d₅₀ неча мкм?", "Циклон Лаппла: D = 1 м (W = 0,25 м), Vi = 15 м/с, Ne = 6, ρp = 2000 кг/м³, воздух μ = 1,81·10⁻⁵ Па·с, ρg ≈ 1,2 кг/м³. Диаметр отсечки d₅₀, мкм?", "Lapple cyclone: D = 1 m (W = 0.25 m), Vi = 15 m/s, Ne = 6, ρp = 2000 kg/m³, air μ = 1.81·10⁻⁵ Pa·s, ρg ≈ 1.2 kg/m³. What is the cut size d₅₀ in µm?"),
        a: Math.sqrt((9 * 1.81e-5 * 0.25) / (2 * Math.PI * 6 * 15 * (2000 - 1.2))) * 1e6, tol: 0.15, unit: "µm", dec: 2, hint: t3("d₅₀ = √[9μW / (2πNeVi(ρp − ρg))], метрни мкм га ўтказинг (×10⁶).", "d₅₀ = √[9μW / (2πNeVi(ρp − ρg))], переведите в мкм (×10⁶).", "d₅₀ = √[9μW / (2πNeVi(ρp − ρg))], convert to µm (×10⁶).") });
    }
  };

  /* =====================================================================
     16) 🍂 Компост — C:N нисбати, намлик, аэрация ва ҳарорат фазалари
     ===================================================================== */
  const COMPOST = {
    id: "kompost", icon: "🍂",
    name: t3("Компост уюми", "Компостная куча", "Compost pile"),
    q: t3("Нега тўғри тайёрланган компост уюми ичида 60 °C гача қизийди?", "Почему правильная компостная куча нагревается внутри до 60 °C?", "Why does a well-made compost pile heat up to 60 °C inside?"),
    poe: { o: [t3("Қуёш иситади", "Греет солнце", "The sun heats it"), t3("Микроблар органикани парчалаб иссиқлик чиқаради", "Микробы разлагают органику и выделяют тепло", "Microbes break down organic matter and release heat"), t3("Кимёвий ёнади", "Химически горит", "It burns chemically")], a: 1,
      w: t3("Аэроб бактериялар ва замбуруғлар органик моддани CO₂ ва сувга айлантиради — бу «нафас олиш» иссиқлик чиқаради. 55 °C дан юқорида патоген ва бегона ўт уруғлари нобуд бўлади.", "Аэробные бактерии и грибы окисляют органику до CO₂ и воды — это «дыхание» выделяет тепло. Выше 55 °C гибнут патогены и семена сорняков.", "Aerobic bacteria and fungi oxidise organic matter to CO₂ and water; this respiration releases heat. Above 55 °C pathogens and weed seeds die.") },
    src: "Rynk R. (ed.) «On-Farm Composting Handbook», NRAES-54, 1992 (C:N ва намлик жадваллари); Cornell Waste Management Institute; Haug R.T. «The Practical Handbook of Compost Engineering», 1993; US EPA 40 CFR 503 (PFRP: ≥ 55 °C)",
    view: { bg: "#ecfccb", d: 7, ph: 1.12, th: 0.6, target: [0.4, 0.6, 0], minD: 3, maxD: 13 },
    MAT: [["food", "🍎", t3("Ошхона қолдиқлари", "Пищевые отходы", "Food scraps"), 2.5, 15, 80, "g"], ["grass", "🌿", t3("Кесилган ўт", "Скошенная трава", "Grass clippings"), 3.0, 17, 82, "g"], ["manure", "🐄", t3("Гўнг", "Навоз", "Manure"), 2.4, 19, 80, "g"],
      ["leaves", "🍂", t3("Қуруқ барглар", "Сухие листья", "Dry leaves"), 0.9, 54, 38, "b"], ["straw", "🌾", t3("Сомон", "Солома", "Straw"), 0.7, 80, 12, "b"], ["card", "📦", t3("Картон", "Картон", "Cardboard"), 0.1, 560, 8, "b"]],
    quiz: [
      { q: t3("Компост учун энг яхши C:N нисбати қайси?", "Какое соотношение C:N лучше всего для компоста?", "What C:N ratio is best for compost?"), o: ["5 : 1", "25–35 : 1", "200 : 1"], a: 1, w: t3("Микробларга оқсил учун азот, энергия учун углерод керак; 25–35:1 энг тез парчаланишни беради.", "Микробам нужен азот для белка и углерод для энергии; 25–35:1 даёт самое быстрое разложение.", "Microbes need nitrogen for protein and carbon for energy; 25–35:1 decomposes fastest.") },
      { q: t3("Уюм ёқимсиз ҳид чиқарса (аммиак ёки чириган тухум), сабаби нима бўлиши мумкин?", "Куча плохо пахнет (аммиак или тухлые яйца). В чём причина?", "The pile smells (ammonia or rotten eggs). What's likely wrong?"), o: [t3("Азот кўп ёки кислород кам — жигарранг материал қўшиб аралаштириш керак", "Много азота или мало кислорода — добавить «коричневых» и перемешать", "Too much nitrogen or too little oxygen: add browns and turn it"), t3("Жуда қуруқ", "Слишком сухо", "It's too dry"), t3("Ҳаммаси жойида", "Всё нормально", "All is fine")], a: 0, w: t3("Аммиак — C:N паст; водород сульфид — анаэроб шароит.", "Аммиак — низкое C:N; сероводород — анаэробные условия.", "Ammonia means low C:N; hydrogen sulphide means anaerobic conditions.") },
      { q: t3("Компост уюмини нима учун аралаштириб турилади?", "Зачем ворошить компостную кучу?", "Why turn a compost pile?"), o: [t3("Кислород бериш учун", "Чтобы дать кислород", "To add oxygen"), t3("Совутиш учун", "Чтобы охладить", "To cool it"), t3("Ҳажмини ошириш учун", "Чтобы увеличить объём", "To make it bigger")], a: 0, w: t3("Аэроб микроблар O₂ сиз ишламайди; аралаштиргандан кейин ҳарорат яна кўтарилади (графикда кўринг).", "Аэробные микробы без O₂ не работают; после ворошения температура снова растёт (см. график).", "Aerobic microbes need O₂; after turning the temperature climbs again (see the chart).") }
    ],
    build(v, ui) {
      const T = THREE, M = this.MAT;
      const S = { m: {}, water: 0, Ta: 20, day: 0, T: 20, B: 1, O2: 1, hot: 0, play: 0, turns: 0, hist: [[0, 20]] };
      M.forEach((x) => (S.m[x[0]] = 0));
      const mix = () => {
        let mt = 0, wet = 0, N = 0, C = 0, g = 0, b = 0;
        M.forEach(([id, , , n, cn, mo, k]) => { const m = S.m[id]; if (!m) return; const dry = m * (1 - mo / 100), nn = (dry * n) / 100; mt += m; wet += (m * mo) / 100; N += nn; C += nn * cn; if (k === "g") g += m; else b += m; });
        mt += S.water; wet += S.water;
        return { mt, M: mt ? (wet / mt) * 100 : 0, CN: N ? C / N : 0, g, b };
      };
      const step = (dt) => {
        const x = mix(); if (x.mt < 10) return;
        const fCN = Math.exp(-Math.pow(Math.log(x.CN / 28) / 0.55, 2)), fM = Math.exp(-Math.pow((x.M - 55) / 16, 2)), fO = S.O2 / (S.O2 + 0.2);
        const fT = S.T < 10 ? 0.2 : S.T < 40 ? 0.2 + (0.8 * (S.T - 10)) / 30 : S.T <= 62 ? 1 : Math.max(0.05, 1 - (S.T - 62) / 10);
        const k = 0.7 * Math.pow(100 / Math.max(x.mt, 10), 1 / 3), r = 0.06 * S.B * fCN * fM * fO * fT;
        S.B = Math.max(0, S.B - r * dt); S.T += (900 * r - k * (S.T - S.Ta)) * dt; S.O2 = clamp(S.O2 + (-6 * r + 0.25 * (1 - S.O2)) * dt, 0, 1);
        if (S.T >= 55) S.hot += dt; S.day += dt;
      };
      const phase = () => S.B < 0.25 ? ["🌱", t3("Етилди — тайёр компост!", "Созрел — компост готов!", "Mature: compost is ready!")] : S.T >= 45 ? ["🔥", t3("Термофил фаза (45–70 °C)", "Термофильная фаза (45–70 °C)", "Thermophilic phase (45–70 °C)")] : S.day > 3 && S.B < 0.8 ? ["🌡️", t3("Совиш ва етилиш", "Охлаждение и созревание", "Cooling and curing")] : ["🦠", t3("Мезофил фаза (20–45 °C)", "Мезофильная фаза (20–45 °C)", "Mesophilic phase (20–45 °C)")];
      /* Саҳна: ер, уюм (вертекс ранглари), термометр, буғ */
      const ground = new T.Mesh(new T.CircleGeometry(5, 40), mat(0x78716c, { roughness: 1 })); ground.rotation.x = -Math.PI / 2; v.scene.add(ground);
      const pg = new T.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
      const pc = new Float32Array(pg.attributes.position.count * 3); pg.setAttribute("color", new T.BufferAttribute(pc, 3));
      const pileM = new T.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
      const pile = new T.Mesh(pg, pileM); pile.userData.pile = 1; v.scene.add(pile);
      const crumbs = Array.from({ length: 50 }, () => { const m = new T.Mesh(new T.BoxGeometry(0.08, 0.03, 0.06), mat(0x16a34a)); m.userData.noPick = true; v.scene.add(m); return m; });
      const tg = new T.Group(); tg.position.set(1.6, 0, 0.6); v.scene.add(tg);
      const tglass = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 1.6, 16), new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })); tglass.position.y = 0.95; tg.add(tglass);
      const bulb = new T.Mesh(new T.SphereGeometry(0.12, 16, 12), mat(0xdc2626)); bulb.position.y = 0.12; tg.add(bulb);
      const col = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 1, 12), mat(0xdc2626)); tg.add(col);
      let tl = null;
      const NS = 60, sm = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false });
      const steam = Array.from({ length: NS }, () => { const m = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), sm); m.visible = false; m.userData = { noPick: true, l: 0 }; v.scene.add(m); return m; });
      ui.unit = () => 1;
      const size = () => clamp(0.35 + Math.cbrt(mix().mt) * 0.18, 0.35, 1.5);
      const C_G = new T.Color(0x4d7c0f), C_B = new T.Color(0x92400e), C_D = new T.Color(0x3f2a1d);
      const paint = () => {
        const x = mix(), s = size(), gr = x.g + x.b ? x.g / (x.g + x.b) : 0.5;
        pile.visible = x.mt > 0; pile.scale.set(s, s * 0.75, s);
        const base = C_B.clone().lerp(C_G, gr * 0.7).lerp(C_D, clamp(1 - S.B, 0, 0.9));
        const p = pg.attributes.position, c = new T.Color();
        for (let i = 0; i < p.count; i++) {
          const y = p.getY(i), r2 = 1 - y * y;
          if (S.cam) c.copy(heat((S.Ta + (S.T - S.Ta) * (0.55 + 0.45 * y) - 15) / 55)); else c.copy(base).multiplyScalar(0.85 + 0.3 * ((i * 7919) % 13) / 13 - 0.1 * r2);
          pc[i * 3] = c.r; pc[i * 3 + 1] = c.g; pc[i * 3 + 2] = c.b;
        }
        pg.attributes.color.needsUpdate = true;
        crumbs.forEach((m, i) => { const a = i * 2.39996, rr = 0.25 + ((i * 37) % 70) / 100; const yy = Math.sqrt(Math.max(0, 1 - rr * rr)) * 0.75; m.position.set(Math.cos(a) * rr * s, yy * s + 0.01, Math.sin(a) * rr * s); m.rotation.set(i, i * 2, 0); m.visible = x.mt > 0 && !S.cam; m.material.color.setHex(i % 3 === 0 && x.g ? 0x65a30d : 0xa16207); });
        const h = clamp((S.T + 10) / 90, 0.05, 1) * 1.5; col.scale.y = h; col.position.y = 0.15 + h / 2;
        if (tl) { tg.remove(tl); tl.material.map.dispose(); tl.material.dispose(); }
        tl = textSprite(fmt(S.T, 0) + " °C", S.T >= 55 ? "#fca5a5" : "#ffffff", 0.3); tl.position.y = 2; tg.add(tl);
      };
      let acc = 0, tick = 0;
      v.updaters.push((dt) => {
        if (S.play) {
          for (let k = 0; k < 6; k++) step(dt);
          tick += dt; if (tick > 0.25) { tick = 0; S.hist.push([S.day, S.T]); if (S.hist.length > 400) S.hist.splice(1, 1); paint(); const o = ui.el.querySelector("[data-out]"); if (o) o.innerHTML = out(); chk(); }
          if (S.day >= 90 || S.B < 0.05) { S.play = 0; ui.render(); }
        }
        acc += dt * Math.max(0, S.T - 42) * 0.8;
        while (acc > 1) { acc -= 1; const m = steam.find((q) => !q.visible); if (!m) break; const a = Math.random() * 6.28, r = Math.random() * size() * 0.6; m.position.set(Math.cos(a) * r, size() * 0.7, Math.sin(a) * r); m.userData.l = 0; m.visible = true; }
        steam.forEach((m) => { if (!m.visible) return; m.userData.l += dt; m.position.y += dt * 0.5; m.scale.setScalar(1 + m.userData.l * 1.5); if (m.userData.l > 2) m.visible = false; });
      });
      ui.probe = (p, o) => {
        if (!o || !o.userData.pile) return null;
        const s = size(), rel = clamp(Math.hypot(p.x, p.y / 0.75, p.z) / s, 0, 1), y = clamp(p.y / (s * 0.75), 0, 1);
        return `T ≈ ${fmt(S.Ta + (S.T - S.Ta) * (0.55 + 0.45 * y) * (1 - 0.3 * rel * rel), 0)} °C · O₂ ≈ ${fmt(S.O2 * 21, 1)}%`;
      };
      const out = () => {
        const x = mix(), [ic, ph] = phase(), uni = stage() === "uni";
        const cnOk = x.CN >= 25 && x.CN <= 35, mOk = x.M >= 50 && x.M <= 60;
        const tip = !x.mt ? t3("Уюмга материал қўшинг: яшил (азотли) ва жигарранг (углеродли).", "Добавьте материалы: «зелёные» (азот) и «коричневые» (углерод).", "Add materials: greens (nitrogen) and browns (carbon).")
          : x.CN < 20 ? t3("Азот жуда кўп — аммиак ҳиди чиқади. Жигарранг материал (барг, сомон, картон) қўшинг.", "Слишком много азота — будет запах аммиака. Добавьте «коричневых» (листья, солома, картон).", "Too much nitrogen: it will smell of ammonia. Add browns (leaves, straw, cardboard).")
          : x.CN > 40 ? t3("Углерод кўп — уюм секин ишлайди. Яшил материал қўшинг.", "Много углерода — куча работает медленно. Добавьте «зелёных».", "Too much carbon: the pile will be slow. Add greens.")
          : x.M < 45 ? t3("Жуда қуруқ — сув қўшинг (сиқилган губкадек нам бўлсин).", "Слишком сухо — добавьте воды (как отжатая губка).", "Too dry: add water (damp like a wrung-out sponge).")
          : x.M > 65 ? t3("Жуда ҳўл — ҳаво кирмайди. Қуруқ жигарранг материал қўшинг.", "Слишком мокро — нет воздуха. Добавьте сухих «коричневых».", "Too wet: no air gets in. Add dry browns.")
          : S.O2 < 0.35 && S.day > 1 ? t3("Кислород тугаяпти — уюмни аралаштиринг!", "Кислород заканчивается — переворошите кучу!", "Oxygen is running out: turn the pile!")
          : t3("Аралашма зўр! ▶ ни босиб, кунларни ўтказинг.", "Отличная смесь! Нажмите ▶ и запустите дни.", "Great mix! Press ▶ to run the days.");
        const ch = chartSvg([{ pts: S.hist.length > 1 ? S.hist : [[0, S.T], [1, S.T]], c: "#dc2626" }], { x0: 0, x1: Math.max(10, Math.ceil(S.day / 10) * 10), y0: 0, y1: 75, xl: H(t3("кун", "дни", "days")), yl: "T, °C", bands: [[55, 75, "#dc2626"], [45, 55, "#f59e0b"]] });
        return `<div class="l3-big"><span>${ic}</span><b>${fmt(S.T, 0)} °C</b><small>${H(ph)} · ${H(t3("кун", "день", "day"))} ${fmt(S.day, 0)}</small></div>
          <p class="small">C:N = <b style="color:${cnOk ? "#16a34a" : "#b45309"}">${x.mt ? fmt(x.CN, 1) : "—"}</b> · ${H(t3("намлик", "влажность", "moisture"))} <b style="color:${mOk ? "#16a34a" : "#b45309"}">${x.mt ? fmt(x.M, 0) + "%" : "—"}</b> · ${fmt(x.mt, 0)} kg · O₂ ${fmt(S.O2 * 21, 0)}%</p>
          <p class="lab-out">${H(tip)}</p>${ch}
          ${uni ? `<div class="lab-formula">C:N = Σ(m<sub>i</sub>(1−W<sub>i</sub>)N<sub>i</sub>·(C:N)<sub>i</sub>) / Σ(m<sub>i</sub>(1−W<sub>i</sub>)N<sub>i</sub>)<br>${H(t3("Парчаланган органика", "Разложено органики", "Organic matter degraded"))}: <b>${fmt((1 - S.B) * 100, 0)}%</b> · ≥ 55 °C: <b>${fmt(S.hot, 1)}</b> ${H(t3("кун", "сут", "days"))} (EPA PFRP ≥ 3)</div>` : ""}`;
      };
      ui.html = () => {
        const uni = stage() === "uni";
        const btns = M.map(([id, e, n, , cn, , k]) => `<button type="button" class="sg-opt l3-mat ${k}" data-add="${id}"><span class="e" aria-hidden="true">${e}</span>${H(n)}<small>${k === "g" ? H(t3("яшил", "зелёный", "green")) : H(t3("жигарранг", "коричневый", "brown"))} · C:N ${cn} · ${S.m[id]} kg</small></button>`).join("");
        return `<p class="small">👆 ${H(t3("Ҳар босишда 5 кг қўшилади.", "Каждое нажатие добавляет 5 кг.", "Each tap adds 5 kg."))}</p><div class="lab-opts l3-mats">${btns}</div>
          <div class="ev-tools"><button type="button" class="btn btn-ghost btn-sm" data-water>💧 +5 L</button><button type="button" class="btn btn-ghost btn-sm" data-turn>🔄 ${H(t3("Аралаштириш", "Перемешать", "Turn"))}</button><button type="button" class="btn btn-primary btn-sm" data-play>${S.play ? "⏸" : "▶"} ${H(S.play ? t3("Тўхтатиш", "Пауза", "Pause") : t3("Кунларни ўтказиш", "Запустить дни", "Run days"))}</button><button type="button" class="btn btn-ghost btn-sm" data-new>↺ ${H(t3("Янги уюм", "Новая куча", "New pile"))}</button></div>
          ${uni ? rngH("Ta", H(t3("Ҳаво ҳарорати", "Температура воздуха", "Air temperature")), S.Ta, 0, 35, 1, S.Ta + " °C") : ""}
          <label class="l3-check"><input type="checkbox" data-cam ${S.cam ? "checked" : ""}> 🌡 ${H(t3("Иссиқлик камераси", "Тепловизор", "Thermal camera"))}</label>
          <div data-out>${out()}</div>${uni ? "" : `<p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Уюмни 55 °C дан юқори қиздиринг — шунда зарарли микроблар ва бегона ўт уруғлари нобуд бўлади.", "Нагрейте кучу выше 55 °C — тогда погибнут вредные микробы и семена сорняков.", "Heat the pile above 55 °C so harmful microbes and weed seeds die."))}</p>`}`;
      };
      const chk = () => { if (stage() !== "uni" && S.T >= 55) star("kompost", ui.el.querySelector("[data-star]")); };
      const restart = () => { S.day = 0; S.T = S.Ta; S.B = 1; S.O2 = 1; S.hot = 0; S.hist = [[0, S.Ta]]; };
      ui.bind = (el) => {
        el.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => { S.m[b.dataset.add] += 5; if (S.day > 0 && !S.play) S.O2 = Math.min(1, S.O2 + 0.2); paint(); ui.render(); }));
        el.querySelector("[data-water]").addEventListener("click", () => { S.water += 5; paint(); ui.render(); });
        el.querySelector("[data-turn]").addEventListener("click", () => { S.O2 = 1; S.T -= (S.T - S.Ta) * 0.25; S.turns++; pile.rotation.y += 1.3; paint(); ui.render(); });
        el.querySelector("[data-play]").addEventListener("click", () => { if (mix().mt < 10) return; if (S.day >= 90 || S.B < 0.05) restart(); S.play = S.play ? 0 : 1; ui.render(); });
        el.querySelector("[data-new]").addEventListener("click", () => { M.forEach((x) => (S.m[x[0]] = 0)); S.water = 0; S.play = 0; S.turns = 0; restart(); paint(); ui.render(); });
        const c = el.querySelector("[data-cam]"); if (c) c.addEventListener("change", () => { S.cam = c.checked ? 1 : 0; paint(); });
        liveBind(el, S, (k, x) => x + " °C", out, () => { if (!S.play && S.day === 0) S.T = S.Ta; });
      };
      ui.goals = stage() === "uni" ? [
        { id: "cn", t: t3("C:N ни 25–35 оралиғига келтиринг", "Доведите C:N до 25–35", "Bring C:N into 25–35"), ok: () => { const x = mix(); return x.mt >= 10 && x.CN >= 25 && x.CN <= 35; } },
        { id: "m", t: t3("Намликни 50–60 % га келтиринг", "Доведите влажность до 50–60 %", "Bring moisture to 50–60 %"), ok: () => { const x = mix(); return x.mt >= 10 && x.M >= 50 && x.M <= 60; } },
        { id: "pfrp", t: t3("Патогенларни йўқотиш: ≥ 55 °C да камида 3 кун (EPA PFRP)", "Обеззараживание: ≥ 55 °C не менее 3 суток (EPA PFRP)", "Pathogen kill: ≥ 55 °C for at least 3 days (EPA PFRP)"), ok: () => S.hot >= 3 }
      ] : [
        { id: "mix", t: t3("Яшил ва жигарранг материалларни аралаштиринг", "Смешайте «зелёные» и «коричневые» материалы", "Mix greens and browns"), ok: () => { const x = mix(); return x.g > 0 && x.b > 0; } },
        { id: "turn", t: t3("Уюм совиганда аралаштириб, яна қиздиринг", "Когда куча остынет, переворошите и снова нагрейте", "Turn the pile when it cools and heat it again"), ok: () => S.turns >= 1 && S.T >= 50 && S.day > 3 },
        { id: "ripe", t: t3("Етилган компост олинг", "Получите зрелый компост", "Make mature compost"), ok: () => S.B < 0.25 }
      ];
      ui.read = () => { const x = mix(); return { p: M.filter(([id]) => S.m[id]).map(([id, , n]) => `${L(n)} ${S.m[id]} kg`).join("; ") + (S.water ? `; 💧 ${S.water} L` : "") || "—", r: `C:N = ${fmt(x.CN, 1)}; T = ${fmt(S.T, 0)} °C (${fmt(S.day, 0)} d)`, x: x.CN, y: S.T, xl: "C:N", yl: "T, °C" }; };
      const cnTask = (() => { const g = [5.4 * 0.03, 17], l = [6.2 * 0.009, 54]; return (g[0] * g[1] + l[0] * l[1]) / (g[0] + l[0]); })();
      ui.task = () => ({ q: t3("30 кг кесилган ўт (намлик 82 %, қуруқ моддада N = 3,0 %, C:N = 17) ва 10 кг қуруқ барг (намлик 38 %, N = 0,9 %, C:N = 54) аралаштирилди. Аралашманинг C:N нисбати қанча?", "Смешали 30 кг травы (влажность 82 %, N = 3,0 % сухого вещества, C:N = 17) и 10 кг сухих листьев (влажность 38 %, N = 0,9 %, C:N = 54). Каково C:N смеси?", "30 kg of grass (82 % moisture, N = 3.0 % of dry matter, C:N = 17) are mixed with 10 kg of dry leaves (38 % moisture, N = 0.9 %, C:N = 54). What is the mixture's C:N?"),
        a: cnTask, tol: 0.6, unit: ": 1", dec: 1, hint: t3("Ҳар бири учун: қуруқ масса = m(1 − W), N = қуруқ·N%, C = N·(C:N). Кейин ΣC / ΣN.", "Для каждого: сухая масса = m(1 − W), N = сухая·N%, C = N·(C:N). Затем ΣC / ΣN.", "For each: dry mass = m(1 − W), N = dry·N%, C = N·(C:N). Then ΣC / ΣN.") });
      S.cam = 0;
      paint();
    }
  };

  /* Янги тажрибалар учун йўриқномалар */
  Object.assign(HOW, {
    shamol: {
      k: [t3("Турбина ўлчамини танланг: уй, мактаб ёки катта.", "Выберите размер турбины: домашняя, школьная или большая.", "Pick a turbine size: home, school or big."), t3("Шамол сурилмасини суринг — парраклар айланади ва уйлардаги чироқлар ёнади.", "Двигайте ползунок ветра — лопасти закрутятся и в домах загорится свет.", "Move the wind slider: the blades spin and the houses light up."), t3("📏 тугмасини босиб, минора баландлигини ўлчанг ёки ҳавонинг исталган нуқтасида шамол тезлигини билинг.", "Нажмите 📏 и измерьте высоту башни или узнайте скорость ветра в любой точке.", "Press 📏 to measure the tower or read the wind speed at any point.")],
      u: [t3("v, R, Cp, ҳарорат ва баландликни беринг — ρ ва P = ½ρAv³Cp ҳисобланади.", "Задайте v, R, Cp, температуру и высоту — рассчитаются ρ и P = ½ρAv³Cp.", "Set v, R, Cp, temperature and altitude to compute ρ and P = ½ρAv³Cp."), t3("Йиллик ўртача шамол v̄ бўйича Рэлей тақсимотидан AEP ва CF ни баҳоланг.", "По среднегодовому ветру v̄ оцените AEP и КИУМ по распределению Рэлея.", "Estimate AEP and CF from the Rayleigh distribution for mean wind v̄."), t3("Қувват эгри чизиғида кесиш (3 м/с), номинал (12 м/с) ва тўхташ (25 м/с) нуқталарини кўринг; журналга ёзиб, ўз графигингизни чизинг.", "На кривой мощности найдите скорости включения (3), номинальную (12) и отключения (25 м/с); запишите в журнал и постройте свой график.", "Find cut-in (3), rated (12) and cut-out (25 m/s) on the power curve; log points to plot your own curve.")]
    },
    fotosintez: {
      k: [t3("Лампани стаканга яқинлаштиринг ёки узоқлаштиринг ва пуфакчаларни санаб кўринг.", "Двигайте лампу ближе и дальше и считайте пузырьки.", "Move the lamp nearer or farther and count the bubbles."), t3("Нур рангини ва сув ҳароратини алмаштиринг.", "Меняйте цвет света и температуру воды.", "Change the light colour and water temperature."), t3("Сода қўшиб, CO₂ кўпайса нима бўлишини кузатинг.", "Добавьте соду и посмотрите, что будет при большем CO₂.", "Add soda and see what more CO₂ does.")],
      u: [t3("I, CO₂ ва T ни ўзгартириб, Блэкман чекловчи омилини аниқланг.", "Меняя I, CO₂ и T, найдите лимитирующий фактор Блэкмана.", "Vary I, CO₂ and T to find Blackman's limiting factor."), t3("Ёруғлик эгри чизиғидан компенсация ва тўйиниш нуқталарини топинг.", "По световой кривой найдите точки компенсации и насыщения.", "Find the compensation and saturation points on the light curve."), t3("Ҳар хил CO₂ да ўлчовларни журналга ёзиб, эгри чизиқларни солиштиринг.", "Записывайте измерения при разных CO₂ в журнал и сравнивайте кривые.", "Log runs at different CO₂ and compare the curves.")]
    },
    uy: {
      k: [t3("Уйнинг девори, деразаси ёки томини 3D саҳнада босинг — изоляция қалинлашади.", "Нажимайте на стены, окна и крышу — утепление станет толще.", "Tap walls, windows or roof to thicken the insulation."), t3("Иссиқлик камерасида қизил жойлар — иссиқлик кўп чиқаётган жойлар.", "На тепловизоре красное — места, где уходит больше тепла.", "On the thermal camera, red shows where most heat escapes."), t3("Ташқари совуқлигини ўзгартириб, йўқотиш қандай ўзгаришини кўринг.", "Меняйте мороз снаружи и смотрите, как меняются потери.", "Change the outdoor cold and watch the losses change.")],
      u: [t3("Ҳар бир элемент учун конструкцияни танланг — U·A ва улуши ҳисобланади.", "Выберите конструкцию каждого элемента — рассчитаются U·A и доли.", "Choose each element's build-up to compute U·A and shares."), t3("ГСОП бўйича йиллик иситиш энергияси, газ ва CO₂ ни баҳоланг.", "Оцените годовую энергию на отопление, газ и CO₂ по ГСОП.", "Estimate annual heating energy, gas and CO₂ from degree-days."), t3("📏 зонд билан элементни босиб, иссиқлик оқими q = U·ΔT ни ўлчанг.", "Зондом 📏 нажмите на элемент и измерьте поток q = U·ΔT.", "Use the 📏 probe on an element to read the heat flux q = U·ΔT.")]
    },
    yerosti: {
      k: [t3("Тупроқ турини танланг ва ⏳ вақтни юргизинг.", "Выберите грунт и запустите ⏳ время.", "Choose the soil and run ⏳ time."), t3("Ер юзасини босиб қудуқни кўчиринг: 💧 — тоза, ☠️ — ифлос.", "Нажмите на землю, чтобы перенести колодец: 💧 — чистый, ☠️ — грязный.", "Tap the ground to move the well: 💧 clean, ☠️ polluted."), t3("Полигон тагига ҳимоя экранини қўйиб, фарқни кўринг.", "Поставьте защитный экран под полигон и сравните.", "Add a liner under the landfill and compare.")],
      u: [t3("K, i, n ни беринг — Дарси тезлиги v = K·i/n ҳисобланади.", "Задайте K, i, n — рассчитается скорость Дарси v = K·i/n.", "Set K, i, n to get the seepage velocity v = K·i/n."), t3("Ифлослантирувчини танланг (ретардация R) ва C/C₀ нинг вақт бўйича эгри чизиғини таҳлил қилинг.", "Выберите загрязнитель (ретардация R) и анализируйте кривую C/C₀ во времени.", "Pick a contaminant (retardation R) and study the C/C₀ breakthrough curve."), t3("📏 зонд билан исталган нуқтада концентрацияни ўлчанг.", "Зондом 📏 измерьте концентрацию в любой точке.", "Use the 📏 probe to read concentration anywhere.")]
    },
    siklon: {
      k: [t3("Чанг турини танланг: қум, цемент, ун ёки тутун.", "Выберите пыль: песок, цемент, мука или дым.", "Choose the dust: sand, cement, flour or smoke."), t3("Ҳаво тезлиги ва циклон ўлчамини ўзгартиринг.", "Меняйте скорость воздуха и размер циклона.", "Change the air speed and cyclone size."), t3("Сариқ заррачалар ушланади, қизиллари тоза ҳаво билан чиқиб кетади.", "Жёлтые частицы улавливаются, красные уходят с воздухом.", "Yellow particles are caught; red ones escape with the air.")],
      u: [t3("d, ρp, Vi, D, Ne ва газ ҳароратини беринг — d₅₀ ва η ҳисобланади.", "Задайте d, ρp, Vi, D, Ne и температуру газа — рассчитаются d₅₀ и η.", "Set d, ρp, Vi, D, Ne and gas temperature to get d₅₀ and η."), t3("Фракцион самарадорлик эгри чизиғини ва босим йўқотишини солиштиринг.", "Сравните кривую фракционной эффективности и потери давления.", "Compare the grade-efficiency curve with the pressure drop."), t3("Мақсад: кам энергия сарфлаб 10 мкм чангни 90 % ушлайдиган циклон лойиҳаланг.", "Цель: спроектировать циклон, ловящий 90 % пыли 10 мкм при малых затратах энергии.", "Goal: design a cyclone that catches 90 % of 10 µm dust with little energy.")]
    },
    kompost: {
      k: [t3("Яшил (ўт, овқат қолдиғи) ва жигарранг (барг, сомон, картон) материал қўшинг.", "Добавляйте «зелёные» (трава, остатки еды) и «коричневые» (листья, солома, картон).", "Add greens (grass, food scraps) and browns (leaves, straw, cardboard)."), t3("▶ ни босинг ва термометрни кузатинг.", "Нажмите ▶ и следите за термометром.", "Press ▶ and watch the thermometer."), t3("Уюм совиса, 🔄 аралаштиринг — у яна қизийди.", "Если куча остыла, 🔄 переворошите — она снова нагреется.", "If the pile cools, 🔄 turn it and it heats up again.")],
      u: [t3("Аралашманинг C:N ва намлигини 25–35 ва 50–60 % га келтиринг.", "Доведите C:N и влажность смеси до 25–35 и 50–60 %.", "Bring the mix's C:N and moisture to 25–35 and 50–60 %."), t3("Ҳарорат эгри чизиғида мезофил, термофил ва етилиш фазаларини ажратинг.", "На кривой температуры выделите мезофильную, термофильную фазы и созревание.", "Identify mesophilic, thermophilic and curing phases on the curve."), t3("EPA PFRP талабини бажаринг: ≥ 55 °C да 3 кун.", "Выполните требование EPA PFRP: ≥ 55 °C в течение 3 суток.", "Meet EPA PFRP: ≥ 55 °C for 3 days.")]
    }
  });
  METHODS.push(
    ["🎯", t3("Мақсадли топшириқлар (Labster, Дания)", "Целевые задания (Labster, Дания)", "Goal-based challenges (Labster, Denmark)"), t3("Ҳар бир тажрибада аниқ мақсадлар рўйхати: параметрни ўзгартириб, натижага ўзингиз етасиз.", "В каждом опыте список целей: вы сами добиваетесь результата, меняя параметры.", "Each experiment lists clear goals that you reach by changing parameters.")],
    ["📏", t3("Виртуал асбоблар ва журнал (ExploreLearning Gizmos, АҚШ)", "Виртуальные приборы и журнал (ExploreLearning Gizmos, США)", "Virtual instruments and notebook (ExploreLearning Gizmos, USA)"), t3("Чизғич ва зонд билан 3D саҳнада ўлчаш, ўлчовларни журналга ёзиш, график ва CSV.", "Линейка и зонд в 3D-сцене, запись измерений в журнал, график и CSV.", "Ruler and probe in the 3D scene, a notebook with charts and CSV export.")],
    ["🔮", t3("POE: Тахмин → Кузатиш → Тушунтириш (White & Gunstone, Австралия)", "POE: Предскажи → Наблюдай → Объясни (White & Gunstone, Австралия)", "POE: Predict → Observe → Explain (White & Gunstone, Australia)"), t3("Тажрибадан олдин тахмин қилиш нотўғри тасаввурларни очиб беради ва эсда қолишни кучайтиради.", "Прогноз перед опытом вскрывает ошибочные представления и улучшает запоминание.", "Predicting before the experiment exposes misconceptions and improves recall.")]
  );


  /* =====================================================================
     🌐 ХАЛҚАРО ТАЖРИБА (Ekomun 2.6): АҚШ, Германия, Япония, Корея
     Ҳар бир саҳна узлуксиз ҳаракатда: машиналар юради, парраклар айланади,
     балиқлар сузади, сув оқади — параметр ўзгарса, манзара дарров ўзгаради.
     ===================================================================== */
  /* Ўзгарувчан ёзув (спрайт): матн ўзгарсагина қайта чизилади */
  function liveLabel(v, pos, color, size) {
    let spr = null, last = "";
    return (text, col) => {
      const key = text + "|" + (col || color);
      if (key === last) return spr;
      last = key;
      if (spr) { v.scene.remove(spr); spr.material.map.dispose(); spr.material.dispose(); }
      spr = textSprite(text, col || color, size); spr.position.set(...pos); v.scene.add(spr);
      return spr;
    };
  }
  /* Оддий балиқ: тана (чўзилган шар) + дум */
  function fishMesh(len, color) {
    const T = THREE, g = new T.Group(), m = mat(color, { roughness: 0.45, metalness: 0.1 });
    const body = new T.Mesh(new T.SphereGeometry(len / 2, 14, 10), m); body.scale.set(1, 0.42, 0.28); g.add(body);
    const tail = new T.Mesh(new T.ConeGeometry(len * 0.22, len * 0.32, 4), m); tail.rotation.z = Math.PI / 2; tail.position.x = -len * 0.58; g.add(tail);
    g.userData.m = m; g.userData.tail = tail;
    return g;
  }

  /* =====================================================================
     17) 🇺🇸 Ҳаво сифати индекси — US EPA AQI (PM2.5, 2024 чегаралари), қути модели
     ===================================================================== */
  const AQI_BP = [[0, 9.0, 0, 50], [9.1, 35.4, 51, 100], [35.5, 55.4, 101, 150], [55.5, 125.4, 151, 200], [125.5, 225.4, 201, 300], [225.5, 325.4, 301, 500]];
  const AQI_CAT = [
    ["#00e400", t3("Яхши", "Хорошо", "Good")], ["#ffff00", t3("Ўртача", "Умеренно", "Moderate")], ["#ff7e00", t3("Сезгирлар учун зарарли", "Вредно для чувствительных", "Unhealthy for sensitive groups")],
    ["#ff0000", t3("Зарарли", "Вредно", "Unhealthy")], ["#8f3f97", t3("Жуда зарарли", "Очень вредно", "Very unhealthy")], ["#7e0023", t3("Хавфли", "Опасно", "Hazardous")]
  ];
  function aqiOf(c) {
    c = Math.floor(Math.max(0, c) * 10) / 10;
    if (c > 325.4) return 500;
    const b = AQI_BP.find((x) => c <= x[1]) || AQI_BP[5];
    return Math.round(((b[3] - b[2]) / (b[1] - b[0])) * (c - b[0]) + b[2]);
  }
  const aqiCat = (i) => (i <= 50 ? 0 : i <= 100 ? 1 : i <= 150 ? 2 : i <= 200 ? 3 : i <= 300 ? 4 : 5);
  const AQI = {
    id: "aqi", icon: "🌫️", flag: "🇺🇸",
    name: t3("Ҳаво сифати индекси (AQI)", "Индекс качества воздуха (AQI)", "Air Quality Index (AQI)"),
    q: t3("Нега қишда, шамолсиз кунда шаҳар ҳавоси ифлосроқ бўлади, гарчи машиналар сони ўзгармаса ҳам?", "Почему зимой в безветренный день воздух в городе грязнее, хотя машин столько же?", "Why is city air dirtier on a calm winter day even though the number of cars is the same?"),
    poe: { o: [t3("Қишда машиналар кўпроқ тутун чиқаради", "Зимой машины дымят сильнее", "Cars smoke more in winter"), t3("Шамол ва аралашув қатлами пасайиб, чанг кичик ҳажмда тўпланади", "Ветер и слой перемешивания уменьшаются, пыль копится в малом объёме", "Wind and the mixing layer shrink, so dust collects in a small volume"), t3("Қор чанг чиқаради", "Снег выделяет пыль", "Snow releases dust")], a: 1,
      w: t3("Қути моделида концентрация C = q·L / (u·H): шамол тезлиги u ва аралашув баландлиги H кичрайса, худди шу чиқинди кичик ҳаво ҳажмига тушади. Инверсия «қопқоқ» каби ҳавони босиб туради.", "В боксовой модели C = q·L / (u·H): при малых скорости ветра u и высоте перемешивания H те же выбросы попадают в меньший объём воздуха. Инверсия работает как «крышка».", "In the box model C = q·L / (u·H): with low wind u and mixing height H the same emissions go into a smaller air volume. An inversion acts like a lid.") },
    src: "U.S. EPA «Technical Assistance Document for the Reporting of Daily Air Quality — the Air Quality Index (AQI)», EPA-454/B-24-002, 2024 (PM2.5 чегаралари: 9,0 / 35,4 / 55,4 / 125,4 / 225,4 µg/m³); Seinfeld J.H., Pandis S.N. «Atmospheric Chemistry and Physics», 3rd ed., 2016 (қути модели); WHO Global Air Quality Guidelines, 2021 (PM2.5 йиллик 5 µg/m³)",
    view: { bg: "#7dd3fc", d: 13, ph: 1.08, th: 0.7, target: [0, 1.4, 0], minD: 5, maxD: 22 },
    quiz: [
      { q: t3("AQI шкаласида 0–50 қайси рангда?", "Какого цвета 0–50 на шкале AQI?", "What colour is 0–50 on the AQI scale?"), o: [t3("Яшил", "Зелёный", "Green"), t3("Сариқ", "Жёлтый", "Yellow"), t3("Қизил", "Красный", "Red")], a: 0, w: t3("Яшил — «яхши», сариқ — «ўртача», тўқ сариқ — сезгир гуруҳлар учун зарарли.", "Зелёный — «хорошо», жёлтый — «умеренно», оранжевый — вредно для чувствительных.", "Green is good, yellow moderate, orange unhealthy for sensitive groups.") },
      { q: t3("PM2.5 нима?", "Что такое PM2.5?", "What is PM2.5?"), o: [t3("Диаметри 2,5 мкм ва ундан кичик заррачалар", "Частицы диаметром 2,5 мкм и меньше", "Particles 2.5 µm across or smaller"), t3("2,5 тонна чанг", "2,5 тонны пыли", "2.5 tonnes of dust"), t3("Газ номи", "Название газа", "A gas name")], a: 0, w: t3("Улар ўпканинг чуқур қисмига ва қонга ўтади — шунинг учун энг хавфли ифлословчи ҳисобланади.", "Они проникают глубоко в лёгкие и кровь — поэтому считаются самым опасным загрязнителем.", "They reach deep into the lungs and blood, which makes them the most harmful pollutant.") },
      { q: t3("Инверсия пайтида нима бўлади?", "Что происходит при инверсии?", "What happens during an inversion?"), o: [t3("Юқоридаги илиқ қатлам ҳавони пастда ушлаб қолади", "Тёплый слой сверху удерживает воздух внизу", "A warm layer above traps air below"), t3("Шамол кучаяди", "Ветер усиливается", "The wind gets stronger"), t3("Чанг ўз-ўзидан йўқолади", "Пыль сама исчезает", "Dust disappears by itself")], a: 0, w: t3("Аралашув баландлиги H бир неча юз метргача тушади ва концентрация кўп марта ошади.", "Высота перемешивания падает до сотен метров, концентрация растёт в разы.", "Mixing height drops to a few hundred metres and concentrations multiply.") }
    ],
    build(v, ui) {
      const T = THREE, S = { veh: 400, ind: 1500, eta: 0.6, heat: 600, u: 2, Hm: 400 };
      const L0 = 20000, A0 = 4e8, Cb = 6;
      const Etot = () => S.veh * 1000 * 15 * 0.02 / 1000 + S.ind * (1 - S.eta) + S.heat; // кг/сутка
      const qf = () => (Etot() * 1e9) / 86400 / A0; // µg/(m²·s)
      const conc = () => Cb + (qf() * L0) / (S.u * S.Hm);
      ui.unit = () => 1000;
      const ground = new T.Mesh(new T.PlaneGeometry(16, 16), mat(0x94a3b8)); ground.rotation.x = -Math.PI / 2; v.scene.add(ground);
      const road = new T.Mesh(new T.PlaneGeometry(16, 1.1), mat(0x334155)); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.01, 1.6); v.scene.add(road);
      const park = new T.Mesh(new T.CircleGeometry(1.4, 24), mat(0x65a30d)); park.rotation.x = -Math.PI / 2; park.position.set(-4.5, 0.02, -3.5); v.scene.add(park);
      let sd = 7; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
      const bcol = [0xe2e8f0, 0xcbd5e1, 0xfde68a, 0xbae6fd, 0xfecaca];
      for (let i = 0; i < 26; i++) {
        const x = -6.5 + (i % 9) * 1.6 + rnd() * 0.3, z = i < 9 ? -1.2 : i < 18 ? 3.6 : -4.6;
        if (Math.hypot(x + 4.5, z + 3.5) < 1.8) continue;
        const h = 0.6 + rnd() * (i % 4 === 0 ? 3.8 : 1.8);
        const b = new T.Mesh(new T.BoxGeometry(0.9, h, 0.9), mat(bcol[i % 5], { roughness: 0.6 })); b.position.set(x, h / 2, z); v.scene.add(b);
      }
      for (let i = 0; i < 7; i++) { const tr = new T.Mesh(new T.SphereGeometry(0.32, 10, 8), mat(0x16a34a)); const a = (i / 7) * Math.PI * 2; tr.position.set(-4.5 + Math.cos(a) * 0.8, 0.45, -3.5 + Math.sin(a) * 0.8); v.scene.add(tr); }
      /* Завод ва мўри */
      const fac = new T.Mesh(new T.BoxGeometry(2, 1, 1.4), mat(0x78716c)); fac.position.set(5.4, 0.5, -3.6); v.scene.add(fac);
      const stack = new T.Mesh(new T.CylinderGeometry(0.16, 0.22, 2.6, 14), mat(0xa8a29e)); stack.position.set(6, 1.8, -3.6); v.scene.add(stack);
      const filt = new T.Mesh(new T.BoxGeometry(0.5, 0.5, 0.5), mat(0x0ea5e9, { metalness: 0.3 })); filt.position.set(4.9, 1.25, -3.6); v.scene.add(filt);
      /* Машиналар */
      const cars = [], ccol = [0xef4444, 0x3b82f6, 0xf59e0b, 0xffffff, 0x10b981, 0x111827];
      for (let i = 0; i < 24; i++) { const c = new T.Mesh(new T.BoxGeometry(0.42, 0.2, 0.22), mat(ccol[i % 6], { roughness: 0.3, metalness: 0.4 })); c.userData = { x: -8 + Math.random() * 16, lane: i % 2, sp: 1.2 + Math.random() * 0.8 }; c.position.y = 0.12; v.scene.add(c); cars.push(c); }
      /* Мўри тутуни */
      const NS = 60, smoke = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), new T.MeshStandardMaterial({ color: 0x9ca3af, transparent: true, opacity: 0.55, depthWrite: false }), NS); smoke.userData.noPick = true; v.scene.add(smoke);
      const SP = Array.from({ length: NS }, (_, i) => ({ age: (i / NS) * 4 }));
      /* Чанг-туман (haze) ва инверсия қопқоғи */
      const NH = 700, hg = new T.BufferGeometry(), hp = new Float32Array(NH * 3), hr = new Float32Array(NH);
      for (let i = 0; i < NH; i++) { hp[i * 3] = -8 + Math.random() * 16; hr[i] = Math.random(); hp[i * 3 + 2] = -8 + Math.random() * 16; }
      hg.setAttribute("position", new T.BufferAttribute(hp, 3));
      const hm = new T.PointsMaterial({ color: 0xa16207, size: 0.16, transparent: true, opacity: 0.4, depthWrite: false });
      const haze = new T.Points(hg, hm); v.scene.add(haze);
      const lid = new T.Mesh(new T.PlaneGeometry(16, 16), new T.MeshBasicMaterial({ color: 0xfb923c, transparent: true, opacity: 0.12, side: T.DoubleSide, depthWrite: false })); lid.rotation.x = -Math.PI / 2; lid.userData.noPick = true; v.scene.add(lid);
      const banner = liveLabel(v, [0, 7.4, 0], "#ffffff", 0.62);
      const lidLbl = liveLabel(v, [-6.2, 3, -7], "#fdba74", 0.3);
      const skyC = new T.Color(0x7dd3fc), dirty = new T.Color(0xb7a98b), tmpC = new T.Color();
      const lidY = () => clamp(S.Hm / 150, 1.2, 8);
      v.updaters.push((dt, t) => {
        const C = conc(), I = aqiOf(C), k = aqiCat(I), dirt = clamp((C - 5) / 150, 0, 1);
        const ncar = Math.round(clamp(S.veh / 1200, 0, 1) * cars.length);
        cars.forEach((c, i) => {
          c.visible = i < ncar; if (!c.visible) return;
          const d = c.userData; d.x += (d.lane ? -1 : 1) * d.sp * dt * 1.6; if (d.x > 8) d.x = -8; if (d.x < -8) d.x = 8;
          c.position.set(d.x, 0.12, 1.6 + (d.lane ? 0.25 : -0.25));
        });
        const mtx = new T.Matrix4(), sm = clamp(S.ind * (1 - S.eta) / 1500, 0, 1);
        SP.forEach((p, i) => {
          p.age += dt * (0.6 + S.u * 0.2); if (p.age > 4) p.age = 0;
          const a = p.age, r = sm > 0.01 ? (0.12 + a * 0.18) * (0.4 + sm) : 0;
          const top = Math.min(3 + a * 0.9, lidY());
          mtx.makeScale(r, r, r); mtx.setPosition(6 + a * S.u * 0.35, top, -3.6 + Math.sin(i + a) * 0.2); smoke.setMatrixAt(i, mtx);
        });
        smoke.instanceMatrix.needsUpdate = true;
        const ly = lidY(), pos = hg.attributes.position.array;
        for (let i = 0; i < NH; i++) { pos[i * 3] += S.u * dt * 0.25 * (0.6 + hr[i]); if (pos[i * 3] > 8) pos[i * 3] = -8; pos[i * 3 + 1] = 0.15 + hr[i] * ly + Math.sin(t * 0.7 + i) * 0.05; }
        hg.attributes.position.needsUpdate = true;
        hm.opacity = 0.08 + dirt * 0.7; hm.color.set(AQI_CAT[k][0]).lerp(dirty, 0.45); hm.size = 0.12 + dirt * 0.14;
        lid.position.y = ly; lid.visible = S.Hm <= 800;
        v.scene.background = tmpC.copy(skyC).lerp(dirty, dirt);
        filt.visible = S.eta > 0;
        banner("AQI " + I + " · " + L(AQI_CAT[k][1]), AQI_CAT[k][0]);
        lidLbl(S.Hm <= 800 ? L(t3("инверсия «қопқоғи»", "«крышка» инверсии", "inversion lid")) + " H = " + S.Hm + " m" : " ");
      });
      ui.probe = (p) => `${L(t3("Баландлик", "Высота", "Height"))} ≈ ${fmt(p.y * 150, 0)} m · PM2.5 ≈ ${fmt(p.y * 150 < S.Hm ? conc() : Cb, 1)} µg/m³`;
      const show = (k, x) => ({ veh: `${x} ${L(t3("минг/сутка", "тыс./сут", "k/day"))}`, ind: `${x} kg/d`, eta: `${Math.round(x * 100)}%`, heat: `${x} kg/d`, u: `${fmt(x, 1)} m/s`, Hm: `${x} m` }[k]);
      const bar = (I) => `<div class="l3-aqibar">${AQI_CAT.map(([c], i) => `<i style="background:${c}" class="${aqiCat(I) === i ? "on" : ""}"></i>`).join("")}</div>`;
      const outK = () => {
        const C = conc(), I = aqiOf(C), k = aqiCat(I);
        const msg = k === 0 ? t3("Ажойиб! Ҳаво тоза — ташқарида бемалол ўйнаш мумкин.", "Отлично! Воздух чистый — можно смело гулять.", "Great! The air is clean — go out and play.") : k <= 2 ? t3("Ҳаво ўртача. Астма бор болалар узоқ югурмагани маъқул.", "Воздух средний. Детям с астмой лучше не бегать долго.", "Moderate air. Kids with asthma should avoid long runs.") : t3("Ҳаво зарарли! Филтр, шамол ва камроқ машина ёрдам беради.", "Воздух вредный! Помогут фильтр, ветер и меньше машин.", "Unhealthy air! A filter, wind and fewer cars would help.");
        return `<div class="l3-big"><span>${["😀", "🙂", "😐", "😷", "🤢", "☠️"][k]}</span><b style="color:${AQI_CAT[k][0]};text-shadow:0 1px 2px #0008">${I}</b><small>AQI · ${H(AQI_CAT[k][1])}</small></div>${bar(I)}<p class="lab-out">${H(msg)}</p>`;
      };
      const outU = () => {
        const C = conc(), I = aqiOf(C), k = aqiCat(I), crv = [];
        for (let u = 0.5; u <= 8.01; u += 0.25) crv.push([u, aqiOf(Cb + (qf() * L0) / (u * S.Hm))]);
        return `<div class="lab-formula">E = <b>${fmt(Etot(), 0)}</b> kg/d → q = E/A = <b>${fmt(qf(), 3)}</b> µg/(m²·s) (A = 400 km²)<br>C = C<sub>b</sub> + q·L/(u·H) = ${Cb} + ${fmt(qf(), 3)}·20000/(${fmt(S.u, 1)}·${S.Hm}) = <b>${fmt(C, 1)}</b> µg/m³<br>AQI = (I<sub>hi</sub>−I<sub>lo</sub>)/(C<sub>hi</sub>−C<sub>lo</sub>)·(C−C<sub>lo</sub>)+I<sub>lo</sub> = <b>${I}</b> · ${H(AQI_CAT[k][1])}<br>WHO 2021: ${L(t3("суткалик", "суточная", "24-h"))} 15 µg/m³ → ×<b>${fmt(C / 15, 1)}</b></div>${bar(I)}
          ${chartSvg([{ pts: crv, c: "#a16207" }], { mark: [S.u, I], x0: 0.5, x1: 8, y0: 0, y1: 300, xl: "u, m/s", yl: "AQI", bands: [[0, 50, "#00e400"], [50, 100, "#ffff00"], [100, 150, "#ff7e00"], [150, 200, "#ff0000"], [200, 300, "#8f3f97"]] })}`;
      };
      ui.html = () => {
        if (stage() !== "uni") return `<p class="small"><b>${H(t3("Машиналар", "Машины", "Cars"))}</b></p>${optsH("veh", [[150, "🚲", t3("Кам", "Мало", "Few")], [400, "🚗", t3("Ўртача", "Средне", "Medium")], [1200, "🚙", t3("Тирбандлик", "Пробки", "Traffic jam")]], S.veh)}
          <p class="small"><b>${H(t3("Завод мўриси", "Труба завода", "Factory stack"))}</b></p>${optsH("eta", [[0, "🏭", t3("Фильтрсиз", "Без фильтра", "No filter")], [0.6, "🧰", t3("Оддий фильтр", "Простой фильтр", "Basic filter")], [0.99, "✨", t3("Электрофильтр 99 %", "Электрофильтр 99 %", "ESP 99 %")]], S.eta)}
          <p class="small"><b>${H(t3("Об-ҳаво", "Погода", "Weather"))}</b></p>${optsH("u", [[0.5, "🌫️", t3("Шамолсиз + инверсия", "Штиль + инверсия", "Calm + inversion")], [2, "🌤️", t3("Енгил шамол", "Лёгкий ветер", "Light wind")], [6, "🌬️", t3("Кучли шамол", "Сильный ветер", "Strong wind")]], S.u)}
          <div data-out>${outK()}</div><p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Шамолсиз кунда ҳам AQI ни яшил (≤ 50) қилинг.", "Даже в безветренный день сделайте AQI зелёным (≤ 50).", "Make the AQI green (≤ 50) even on a calm day."))}</p>`;
        return `${rngH("veh", H(t3("Транспорт оқими", "Транспортный поток", "Traffic flow")), S.veh, 0, 1500, 50, show("veh", S.veh))}
          ${rngH("ind", H(t3("Саноат чанги (фильтргача)", "Промышленная пыль (до фильтра)", "Industrial PM (before filter)")), S.ind, 0, 5000, 100, show("ind", S.ind))}
          ${rngH("eta", H(t3("Фильтр самарадорлиги η", "КПД фильтра η", "Filter efficiency η")), S.eta, 0, 0.99, 0.01, show("eta", S.eta))}
          ${rngH("heat", H(t3("Иситиш ва очиқ ёқиш", "Отопление и открытое сжигание", "Heating and open burning")), S.heat, 0, 3000, 100, show("heat", S.heat))}
          ${rngH("u", H(t3("Шамол тезлиги u", "Скорость ветра u", "Wind speed u")), S.u, 0.5, 8, 0.1, show("u", S.u))}
          ${rngH("Hm", H(t3("Аралашув баландлиги H", "Высота перемешивания H", "Mixing height H")), S.Hm, 100, 1500, 50, show("Hm", S.Hm))}
          <div data-out>${outU()}</div>`;
      };
      const chk = () => { if (stage() !== "uni" && S.u === 0.5 && aqiOf(conc()) <= 50) star("aqi", ui.el.querySelector("[data-star]")); };
      ui.bind = (el) => {
        liveBind(el, S, show, stage() === "uni" ? outU : outK, chk);
        bindOpts(el, S, (k) => { if (k === "u") S.Hm = S.u === 0.5 ? 150 : S.u === 2 ? 600 : 1200; ui.render(); chk(); });
      };
      if (stage() !== "uni") S.Hm = 600;
      ui.goals = stage() === "uni" ? [
        { id: "inv", t: t3("Инверсияда (H ≤ 200 м, u ≤ 1 м/с) AQI «хавфли» (> 300) бўлишини кўринг", "Увидьте «опасный» AQI (> 300) при инверсии (H ≤ 200 м, u ≤ 1 м/с)", "See a hazardous AQI (> 300) during an inversion (H ≤ 200 m, u ≤ 1 m/s)"), ok: () => S.Hm <= 200 && S.u <= 1 && aqiOf(conc()) > 300 },
        { id: "fix", t: t3("Инверсия сақланган ҳолда (H ≤ 200 м, u ≤ 1) манбаларни камайтириб AQI ≤ 100 га туширинг", "При той же инверсии (H ≤ 200 м, u ≤ 1) снизьте AQI до ≤ 100, уменьшая источники", "Keep the inversion (H ≤ 200 m, u ≤ 1) and bring AQI to ≤ 100 by cutting sources"), ok: () => S.Hm <= 200 && S.u <= 1 && aqiOf(conc()) <= 100 },
        { id: "who", t: t3("WHO суткалик меъёрига (≤ 15 µg/m³) эришинг", "Достигните суточной нормы ВОЗ (≤ 15 µg/m³)", "Meet the WHO 24-h guideline (≤ 15 µg/m³)"), ok: () => conc() <= 15 }
      ] : [
        { id: "jam", t: t3("Тирбандлик + шамолсиз кун: AQI қандай бўлишини кўринг", "Пробки + штиль: посмотрите, каким станет AQI", "Traffic jam + calm day: see what the AQI becomes"), ok: () => S.veh === 1200 && S.u === 0.5 },
        { id: "wind", t: t3("Кучли шамол ҳавони тозалашини текширинг", "Проверьте, что сильный ветер очищает воздух", "Check that strong wind cleans the air"), ok: () => S.u === 6 && aqiOf(conc()) <= 100 }
      ];
      ui.read = () => ({ p: `u = ${fmt(S.u, 1)} m/s; H = ${S.Hm} m; η = ${Math.round(S.eta * 100)}%`, r: `PM2.5 = ${fmt(conc(), 1)} µg/m³; AQI = ${aqiOf(conc())}`, x: S.u, y: aqiOf(conc()), xl: "u, m/s", yl: "AQI" });
      ui.task = () => ({ q: t3("PM2.5 суткалик концентрацияси 40,0 µg/m³. EPA 2024 чегаралари бўйича (35,5–55,4 → 101–150) AQI ни ҳисобланг.", "Суточная концентрация PM2.5 = 40,0 µg/m³. По границам EPA 2024 (35,5–55,4 → 101–150) рассчитайте AQI.", "Daily PM2.5 is 40.0 µg/m³. Using EPA 2024 breakpoints (35.5–55.4 → 101–150), compute the AQI."),
        a: aqiOf(40), tol: 1, unit: "", dec: 0, hint: t3("I = (150−101)/(55,4−35,5)·(40,0−35,5) + 101", "I = (150−101)/(55,4−35,5)·(40,0−35,5) + 101", "I = (150−101)/(55.4−35.5)·(40.0−35.5) + 101") });
      ui.render();
    }
  };

  /* =====================================================================
     18) 🇩🇪 Энергия бурилиши (Energiewende) — 24 соатлик тармоқ баланси
     ===================================================================== */
  const ENERGY = {
    id: "energiya", icon: "⚡", flag: "🇩🇪",
    name: t3("Энергия бурилиши: 24 соат", "Энергетический поворот: 24 часа", "Energy transition: 24 hours"),
    q: t3("Қуёш ва шамол ҳар доим ҳам бўлмаса, шаҳар тунда электрни қаердан олади?", "Если солнце и ветер есть не всегда, откуда город берёт электричество ночью?", "If sun and wind are not always there, where does a city get power at night?"),
    poe: { o: [t3("Фақат кўпроқ қуёш панели керак", "Нужно только больше панелей", "Just more solar panels"), t3("Аккумулятор, шамол ва захира электр станцияси бирга ишлайди", "Работают вместе аккумуляторы, ветер и резервная станция", "Batteries, wind and backup plants work together"), t3("Тунда электр керак эмас", "Ночью электричество не нужно", "No power is needed at night")], a: 1,
      w: t3("Қуёш тунда ишламайди, шамол эса ўзгарувчан. Шунинг учун Германия қуёш, шамол, аккумулятор ва газ станцияларини бирга режалаштиради; энг қийин пайт — қишда шамолсиз ва булутли «Dunkelflaute».", "Солнце ночью не работает, ветер переменчив. Поэтому Германия планирует солнце, ветер, накопители и газовые станции вместе; самое трудное — зимняя безветренная пасмурная «Dunkelflaute».", "Solar is off at night and wind varies, so Germany plans solar, wind, storage and gas plants together; the hardest case is the calm, cloudy winter Dunkelflaute.") },
    src: "Fraunhofer ISE «Energy-Charts» (2024: қуёш ≈ 99 ГВт, шамол ≈ 73 ГВт ўрнатилган қувват); BNetzA/SMARD; Umweltbundesamt «Erneuerbare Energien in Zahlen»; IPCC AR5 WGIII Annex III (газ ТЭС ≈ 0,4 кг CO₂/кВт·с)",
    view: { bg: "#bae6fd", d: 14, ph: 1.1, th: 0.5, target: [0, 1.2, 0], minD: 6, maxD: 24 },
    quiz: [
      { q: t3("«Dunkelflaute» нима?", "Что такое «Dunkelflaute»?", "What is a Dunkelflaute?"), o: [t3("Қуёш ҳам, шамол ҳам кам бўлган қоронғи, шамолсиз давр", "Тёмный безветренный период без солнца и ветра", "A dark, windless period with little sun and wind"), t3("Немис шамол турбинаси", "Немецкая ветротурбина", "A German wind turbine"), t3("Электр нархи", "Цена электроэнергии", "An electricity price")], a: 0, w: t3("Бундай кунларда аккумулятор, импорт ва газ станциялари ёрдамга келади.", "В такие дни выручают накопители, импорт и газовые станции.", "On such days storage, imports and gas plants fill the gap.") },
      { q: t3("Қуёш электр станцияси қачон энг кўп ишлайди?", "Когда солнечная станция работает больше всего?", "When does a solar plant produce most?"), o: [t3("Ёзда, туш пайти", "Летом в полдень", "At noon in summer"), t3("Қишда тунда", "Зимой ночью", "At night in winter"), t3("Эрталаб соат 5 да", "В 5 утра", "At 5 a.m.")], a: 0, w: t3("Қуёш баланд бўлса, панелга кўпроқ нур тушади.", "Чем выше солнце, тем больше света на панели.", "The higher the sun, the more light reaches the panels.") },
      { q: t3("Ортиқча қуёш электрини нима қилган маъқул?", "Что лучше делать с лишней солнечной энергией?", "What is best to do with surplus solar power?"), o: [t3("Аккумуляторда сақлаб, кечқурун ишлатиш", "Накопить в аккумуляторе и использовать вечером", "Store it and use it in the evening"), t3("Ҳамма чироқларни ёқиш", "Включить все лампы", "Switch on every lamp"), t3("Панелларни ўчириш", "Выключить панели", "Turn panels off")], a: 0, w: t3("Сақланмаса, ортиқча энергия «кесилади» (curtailment) ва бекор кетади.", "Без накопления лишняя энергия «отсекается» (curtailment) и теряется.", "Without storage, surplus is curtailed and wasted.") }
    ],
    build(v, ui) {
      const T = THREE, S = { pv: 100, wind: 70, bat: 20, sea: 1, wd: 0.25 };
      const dem = (h) => 47 + 13 * Math.exp(-((h - 12) ** 2) / 18) + 9 * Math.exp(-((h - 19) ** 2) / 5) - 6 * Math.exp(-((h - 3) ** 2) / 6);
      const sol = (h) => (S.sea ? Math.max(0, Math.sin((Math.PI * (h - 5)) / 16)) * 0.7 : Math.max(0, Math.sin((Math.PI * (h - 8)) / 8)) * 0.3);
      const wcf = (h) => clamp(S.wd * (1 + 0.35 * Math.sin((h / 24) * Math.PI * 2 + 1.3)), 0, 0.95);
      const sim = () => {
        let soc = S.bat * 0.5, re = 0, D = 0, gas = 0, cut = 0, gasH = 0; const rows = [], P = S.bat / 4;
        for (let h = 0; h < 24; h++) {
          const d = dem(h), r = S.pv * sol(h) + S.wind * wcf(h); D += d;
          let net = r - d, ch = 0, g = 0, c = 0;
          if (net > 0) { ch = Math.min(net, P, (S.bat - soc) / 0.95); soc += ch * 0.95; c = net - ch; re += d; }
          else { const dis = Math.min(-net, P, soc * 0.95); soc -= dis / 0.95; g = -net - dis; re += r + dis; if (g > 0.01) gasH++; }
          gas += g; cut += c; rows.push({ h, d, r, g, soc, c, pv: S.pv * sol(h), w: S.wind * wcf(h) });
        }
        return { rows, share: (re / D) * 100, gas, cut, D, co2: (gas * 400) / D, gasH };
      };
      let R = sim();
      ui.unit = () => 1;
      const ground = new T.Mesh(new T.PlaneGeometry(22, 14), mat(0x86efac)); ground.rotation.x = -Math.PI / 2; v.scene.add(ground);
      /* Шамол турбиналари */
      const rotors = [], wmat = mat(0xf8fafc, { roughness: 0.4 });
      for (let i = 0; i < 6; i++) {
        const x = -8.5 + (i % 3) * 2.2, z = -4 + Math.floor(i / 3) * 2.4;
        const tw = new T.Mesh(new T.CylinderGeometry(0.06, 0.12, 3.2, 10), wmat); tw.position.set(x, 1.6, z); v.scene.add(tw);
        const nac = new T.Mesh(new T.BoxGeometry(0.22, 0.2, 0.42), wmat); nac.position.set(x, 3.25, z); v.scene.add(nac);
        const rot = new T.Group(); rot.position.set(x, 3.25, z + 0.24);
        for (let b = 0; b < 3; b++) { const bl = new T.Mesh(new T.BoxGeometry(0.09, 1.3, 0.03), wmat); bl.position.y = 0.65; const arm = new T.Group(); arm.add(bl); arm.rotation.z = (b * Math.PI * 2) / 3; rot.add(arm); }
        v.scene.add(rot); rotors.push(rot);
      }
      /* Қуёш панеллари */
      const panels = [], pmat = mat(0x1e3a8a, { roughness: 0.25, metalness: 0.5, emissive: 0x0b1d4d });
      for (let i = 0; i < 30; i++) { const p = new T.Mesh(new T.BoxGeometry(0.9, 0.04, 0.55), pmat); p.position.set(1.2 + (i % 6) * 1.05, 0.35, -5 + Math.floor(i / 6) * 0.8); p.rotation.x = -0.5; v.scene.add(p); panels.push(p); }
      /* Шаҳарча: ойналари ёнадиган уйлар */
      const wins = [];
      for (let i = 0; i < 10; i++) {
        const x = -3 + (i % 5) * 1.4, z = 3 + Math.floor(i / 5) * 1.6, h = 0.8 + (i % 3) * 0.5;
        const hb = new T.Mesh(new T.BoxGeometry(1, h, 1), mat(0xfef3c7)); hb.position.set(x, h / 2, z); v.scene.add(hb);
        const roof = new T.Mesh(new T.ConeGeometry(0.8, 0.5, 4), mat(0xb91c1c)); roof.position.set(x, h + 0.25, z); roof.rotation.y = Math.PI / 4; v.scene.add(roof);
        const wm = new T.MeshStandardMaterial({ color: 0x1f2937, emissive: 0xfacc15, emissiveIntensity: 0 }), wn = new T.Mesh(new T.PlaneGeometry(0.5, 0.3), wm); wn.position.set(x, h * 0.55, z + 0.51); v.scene.add(wn); wins.push(wm);
      }
      /* Аккумулятор (тўлиш даражаси) */
      const batBox = new T.Mesh(new T.BoxGeometry(1.2, 2, 0.8), new T.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.3, depthWrite: false })); batBox.position.set(5.5, 1, 3.5); v.scene.add(batBox);
      const batFill = new T.Mesh(new T.BoxGeometry(1.1, 1, 0.7), mat(0x22c55e, { emissive: 0x14532d })); batFill.position.set(5.5, 0.5, 3.5); v.scene.add(batFill);
      /* Газ станцияси ва тутун */
      const gp = new T.Mesh(new T.BoxGeometry(1.6, 1, 1.2), mat(0x64748b)); gp.position.set(8.5, 0.5, 1); v.scene.add(gp);
      const gs = new T.Mesh(new T.CylinderGeometry(0.15, 0.2, 2, 12), mat(0x94a3b8)); gs.position.set(8.9, 1.5, 1); v.scene.add(gs);
      const NP = 40, puff = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), new T.MeshStandardMaterial({ color: 0x6b7280, transparent: true, opacity: 0.5, depthWrite: false }), NP); puff.userData.noPick = true; v.scene.add(puff);
      const PF = Array.from({ length: NP }, (_, i) => ({ a: (i / NP) * 3 }));
      /* Қуёш, электр «оқими» (ЛЭП бўйлаб ёруғ нуқталар) */
      const sun = new T.Mesh(new T.SphereGeometry(0.6, 20, 14), new T.MeshBasicMaterial({ color: 0xfde047 })); v.scene.add(sun);
      const NF = 36, flow = new T.InstancedMesh(new T.SphereGeometry(0.07, 6, 5), new T.MeshBasicMaterial({ color: 0xfacc15 }), NF); flow.userData.noPick = true; v.scene.add(flow);
      const path = [new T.Vector3(-7, 1.2, -3), new T.Vector3(3, 1.2, -3.5), new T.Vector3(0, 1.2, 3)];
      const clock = liveLabel(v, [0, 6.2, 0], "#0f172a", 0.5);
      const day = new T.Color(S.sea ? 0xbae6fd : 0xcbd5e1), night = new T.Color(0x0f172a), tc = new T.Color();
      let hour = 8;
      v.updaters.push((dt, t) => {
        hour = (hour + dt * 1.2) % 24;
        const h0 = Math.floor(hour), rw = R.rows[h0], s = sol(hour), w = wcf(hour);
        rotors.forEach((r, i) => { r.rotation.z -= dt * (0.6 + w * 9) * (1 + i * 0.03); });
        const npv = Math.round(clamp(S.pv / 200, 0, 1) * panels.length); panels.forEach((p, i) => { p.visible = i < npv; });
        pmat.emissiveIntensity = 0.2 + s * 1.6;
        const ang = ((hour - 6) / 12) * Math.PI; sun.position.set(-Math.cos(ang) * 10, Math.sin(ang) * 8, -6); sun.visible = sun.position.y > -0.5;
        const lite = clamp(Math.sin(ang) * 1.4 + 0.15, 0, 1);
        v.scene.background = tc.copy(night).lerp(day.set(S.sea ? 0xbae6fd : 0xcbd5e1), lite);
        wins.forEach((m) => { m.emissiveIntensity = (1 - lite) * 1.2; });
        const f = S.bat ? clamp(rw.soc / S.bat, 0.02, 1) : 0.02; batFill.scale.y = f * 1.9; batFill.position.y = 0.05 + (f * 1.9) / 2;
        batFill.material.color.setHex(f < 0.25 ? 0xef4444 : f < 0.6 ? 0xfacc15 : 0x22c55e);
        const gon = clamp(rw.g / 30, 0, 1), mtx = new T.Matrix4();
        PF.forEach((p, i) => { p.a += dt * 0.9; if (p.a > 3) p.a = 0; const r = gon > 0.02 ? (0.15 + p.a * 0.2) * (0.5 + gon) : 0; mtx.makeScale(r, r, r); mtx.setPosition(8.9 + p.a * 0.4, 2.6 + p.a * 0.9, 1 + Math.sin(i) * 0.2); puff.setMatrixAt(i, mtx); });
        puff.instanceMatrix.needsUpdate = true;
        const fr = clamp(rw.r / Math.max(rw.d, 1), 0, 1.5);
        for (let i = 0; i < NF; i++) {
          const u = ((i / NF) + t * 0.25 * (0.3 + fr)) % 1, seg = u < 0.5 ? 0 : 1, k = (u % 0.5) * 2;
          const pnt = new T.Vector3().lerpVectors(path[seg], path[seg + 1], k);
          const sc = i / NF < Math.min(1, fr) ? 1 : 0; mtx.makeScale(sc, sc, sc); mtx.setPosition(pnt.x, pnt.y + Math.sin(u * 20) * 0.05, pnt.z); flow.setMatrixAt(i, mtx);
        }
        flow.instanceMatrix.needsUpdate = true;
        clock(`🕒 ${String(h0).padStart(2, "0")}:00 · ☀️ ${fmt(rw.pv, 0)} · 🌬️ ${fmt(rw.w, 0)} · 🔥 ${fmt(rw.g, 0)} GW`, lite > 0.4 ? "#0f172a" : "#f8fafc");
      });
      const show = (k, x) => ({ pv: `${x} GW`, wind: `${x} GW`, bat: `${x} GWh`, wd: `${Math.round(x * 100)}%` }[k]);
      const verdict = () => (R.share >= 95 ? "🌞" : R.share >= 70 ? "🌿" : R.share >= 40 ? "⛅" : "🏭");
      const outK = () => {
        const msg = R.share >= 80 ? t3("Зўр! Шаҳарнинг деярли бутун электри тоза манбалардан.", "Супер! Почти всё электричество города — из чистых источников.", "Great! Almost all the town's power is clean.") : R.share >= 50 ? t3("Ярмидан кўпи тоза. Тунда газ станцияси ишлаяпти — аккумулятор қўшиб кўринг.", "Больше половины — чистая. Ночью работает газовая станция — добавьте аккумулятор.", "Over half is clean. The gas plant runs at night — try adding a battery.") : t3("Газ станцияси кўп ишлаяпти. Шамол ёки қуёшни кўпайтиринг.", "Газовая станция работает много. Добавьте ветер или солнце.", "The gas plant runs a lot. Add wind or solar.");
        return `<div class="l3-big"><span>${verdict()}</span><b>${fmt(R.share, 0)}%</b><small>${H(t3("тоза электр", "чистой энергии", "clean power"))}</small></div><p class="lab-out">${H(msg)}</p>`;
      };
      const chart = () => chartSvg([{ pts: R.rows.map((r) => [r.h, r.d]), c: "#0f172a" }, { pts: R.rows.map((r) => [r.h, r.pv]), c: "#f59e0b" }, { pts: R.rows.map((r) => [r.h, r.w]), c: "#0ea5e9" }, { pts: R.rows.map((r) => [r.h, r.g]), c: "#ef4444", dash: true }], { x0: 0, x1: 23, y0: 0, xl: L(t3("соат", "час", "hour")), yl: "GW" })
        + `<p class="small muted">— ${H(t3("талаб", "спрос", "demand"))} · <span style="color:#f59e0b">☀️</span> · <span style="color:#0ea5e9">🌬️</span> · <span style="color:#ef4444">- - ${H(t3("газ", "газ", "gas"))}</span></p>`;
      const outU = () => `<div class="lab-formula">E<sub>RE</sub> = Σ(P<sub>PV</sub>·CF<sub>PV</sub>(h) + P<sub>W</sub>·CF<sub>W</sub>(h)) · ${L(t3("аккумулятор", "накопитель", "storage"))}: P = E/4, η = 0,95²<br>${L(t3("Тоза улуш", "Доля ВИЭ", "RE share"))} = <b>${fmt(R.share, 1)}%</b> · ${L(t3("газ", "газ", "gas"))} = <b>${fmt(R.gas, 0)}</b> GWh (${R.gasH} h)<br>${L(t3("Кесилган ортиқча", "Отсечено излишков", "Curtailed"))} = <b>${fmt(R.cut, 0)}</b> GWh (${fmt((R.cut / R.D) * 100, 1)}%) · CO₂ ≈ <b>${fmt(R.co2, 0)}</b> g/kWh</div>${chart()}`;
      ui.html = () => {
        if (stage() !== "uni") return `<p class="small"><b>${H(t3("Фасл", "Сезон", "Season"))}</b></p>${optsH("sea", [[1, "☀️", t3("Ёз", "Лето", "Summer")], [0, "❄️", t3("Қиш", "Зима", "Winter")]], S.sea)}
          <p class="small"><b>${H(t3("Шамол", "Ветер", "Wind"))}</b></p>${optsH("wd", [[0.06, "🍃", t3("Шамолсиз", "Штиль", "Calm")], [0.25, "🌬️", t3("Ўртача", "Средний", "Average")], [0.5, "🌪️", t3("Кучли", "Сильный", "Strong")]], S.wd)}
          <p class="small"><b>${H(t3("Аккумулятор", "Аккумулятор", "Battery"))}</b></p>${optsH("bat", [[0, "🚫", t3("Йўқ", "Нет", "None")], [20, "🔋", t3("Кичик", "Малый", "Small")], [200, "🔋🔋", t3("Катта", "Большой", "Big")]], S.bat)}
          <div data-out>${outK()}</div><p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Ёзда тоза электр улушини 90 % дан оширинг.", "Летом поднимите долю чистой энергии выше 90 %.", "Get clean power above 90 % in summer."))}</p>`;
        return `${rngH("pv", H(t3("Қуёш қуввати", "Мощность СЭС", "Solar capacity")), S.pv, 0, 400, 10, show("pv", S.pv))}
          ${rngH("wind", H(t3("Шамол қуввати", "Мощность ВЭС", "Wind capacity")), S.wind, 0, 250, 5, show("wind", S.wind))}
          ${rngH("bat", H(t3("Аккумулятор сиғими", "Ёмкость накопителей", "Storage capacity")), S.bat, 0, 400, 10, show("bat", S.bat))}
          ${rngH("wd", H(t3("Шамол куни (ўртача CF)", "Ветреность дня (средний CF)", "Wind day (mean CF)")), S.wd, 0.03, 0.6, 0.01, show("wd", S.wd))}
          ${optsH("sea", [[1, "☀️", t3("Ёз куни", "Летний день", "Summer day")], [0, "❄️", t3("Қиш куни", "Зимний день", "Winter day")]], S.sea)}
          <div data-out>${outU()}</div>`;
      };
      const chk = () => { if (stage() !== "uni" && S.sea === 1 && R.share > 90) star("energiya", ui.el.querySelector("[data-star]")); };
      ui.bind = (el) => {
        liveBind(el, S, show, () => { R = sim(); return stage() === "uni" ? outU() : outK(); }, chk);
        bindOpts(el, S, () => { R = sim(); ui.render(); chk(); });
      };
      ui.goals = stage() === "uni" ? [
        { id: "s80", t: t3("Ёз кунида тоза улушни ≥ 80 % га етказинг", "Летом доведите долю ВИЭ до ≥ 80 %", "Reach ≥ 80 % renewables on a summer day"), ok: () => S.sea === 1 && R.share >= 80 },
        { id: "cut", t: t3("Тоза улуш ≥ 70 % бўлсин, лекин кесилган энергия ≤ 5 %", "Доля ВИЭ ≥ 70 % при отсечении ≤ 5 %", "≥ 70 % renewables with ≤ 5 % curtailment"), ok: () => R.share >= 70 && R.cut / R.D <= 0.05 },
        { id: "dunkel", t: t3("Қишки «Dunkelflaute» (CF ≤ 0,08) да ҳам ≥ 60 % га эришинг", "Даже в зимнюю «Dunkelflaute» (CF ≤ 0,08) достигните ≥ 60 %", "Reach ≥ 60 % even in a winter Dunkelflaute (CF ≤ 0.08)"), ok: () => S.sea === 0 && S.wd <= 0.08 && R.share >= 60 }
      ] : [
        { id: "night", t: t3("Аккумуляторсиз тунда газ станцияси ишлашини кўринг", "Посмотрите: без аккумулятора ночью работает газ", "See the gas plant run at night without a battery"), ok: () => S.bat === 0 && R.gas > 0 },
        { id: "winter", t: t3("Қишда шамолсиз кунни синаб кўринг", "Попробуйте зимний безветренный день", "Try a calm winter day"), ok: () => S.sea === 0 && S.wd === 0.06 }
      ];
      ui.read = () => ({ p: `PV = ${S.pv} GW; W = ${S.wind} GW; B = ${S.bat} GWh; ${S.sea ? "summer" : "winter"}`, r: `RE = ${fmt(R.share, 1)}%; CO₂ = ${fmt(R.co2, 0)} g/kWh`, x: S.bat, y: R.share, xl: "GWh", yl: "RE, %" });
      ui.task = () => ({ q: t3("Шамол электр станцияси қуввати 70 ГВт, ўртача фойдаланиш коэффициенти CF = 0,25. Бир суткада қанча ГВт·с электр ишлаб чиқарилади?", "Ветростанции 70 ГВт, средний КИУМ CF = 0,25. Сколько ГВт·ч выработается за сутки?", "Wind capacity is 70 GW with a mean capacity factor of 0.25. How many GWh are produced per day?"),
        a: 70 * 0.25 * 24, tol: 2, unit: "GWh", dec: 0, hint: t3("E = P · CF · 24 соат", "E = P · CF · 24 ч", "E = P · CF · 24 h") });
      ui.render();
    }
  };

  /* =====================================================================
     19) 🇯🇵 Минамата: симобнинг озиқ занжирида тўпланиши (биомагнификация)
     ===================================================================== */
  const MINA = {
    id: "minamata", icon: "🐟", flag: "🇯🇵",
    name: t3("Минамата: симоб занжири", "Минамата: цепочка ртути", "Minamata: the mercury chain"),
    q: t3("Сувда симоб жуда оз бўлса ҳам, нега катта балиқда у хавфли даражага етади?", "Почему даже при очень малом содержании ртути в воде её в крупной рыбе становится опасно много?", "Why can big fish hold dangerous mercury when there is only a trace in the water?"),
    poe: { o: [t3("Катта балиқ симобни ўзи ишлаб чиқаради", "Крупная рыба сама производит ртуть", "Big fish make mercury themselves"), t3("Ҳар бир озиқ поғонасида метилсимоб тўпланиб кўпаяди", "На каждом трофическом уровне метилртуть накапливается и умножается", "Methylmercury builds up and multiplies at each food-chain level"), t3("Катта балиқ кўп сув ичади", "Крупная рыба пьёт много воды", "Big fish drink more water")], a: 1,
      w: t3("Метилсимоб ёғ ва оқсилда ушланиб, организмдан секин чиқади. Ҳар бир йиртқич кўп ўлжа ейди, шунинг учун концентрация ҳар поғонада бир неча марта ошади. Минамата (Япония, 1956) фожиаси шундай юз берган.", "Метилртуть удерживается белками и выводится медленно. Каждый хищник съедает много добычи, и концентрация растёт в разы на каждом уровне. Так произошла трагедия Минаматы (Япония, 1956).", "Methylmercury binds to proteins and leaves the body slowly. Each predator eats lots of prey, so the level multiplies at every step — that is how the Minamata tragedy (Japan, 1956) unfolded.") },
    src: "Ministry of the Environment, Japan «Lessons from Minamata Disease and Mercury Management in Japan», 2013; UNEP Minamata Convention on Mercury (2013, 2017 йилдан кучда); Lavoie R.A. et al., Environ. Sci. Technol. 47:13385, 2013 (TMF); JECFA 2003 (MeHg PTWI 1,6 µg/kg·ҳафта); US EPA 2001 (балиқда 0,3 мг/кг)",
    view: { bg: "#0c4a6e", d: 11, ph: 1.15, th: 0.5, target: [0, 0.3, 0], minD: 4, maxD: 18 },
    LV: [["🦠", t3("Фитопланктон", "Фитопланктон", "Phytoplankton")], ["🦐", t3("Зоопланктон", "Зоопланктон", "Zooplankton")], ["🐟", t3("Майда балиқ", "Мелкая рыба", "Small fish")], ["🐠", t3("Йиртқич балиқ", "Хищная рыба", "Predatory fish")], ["🦈", t3("Катта йиртқич (тунец)", "Крупный хищник (тунец)", "Top predator (tuna)")]],
    quiz: [
      { q: t3("Биомагнификация нима?", "Что такое биомагнификация?", "What is biomagnification?"), o: [t3("Озиқ занжири бўйлаб модда концентрациясининг ортиши", "Рост концентрации вещества вверх по пищевой цепи", "Rising concentration up the food chain"), t3("Балиқнинг катталашиши", "Рост рыбы", "Fish growing bigger"), t3("Сувнинг буғланиши", "Испарение воды", "Water evaporating")], a: 0, w: t3("TMF — ҳар бир трофик поғонада неча марта ошишини кўрсатади.", "TMF показывает, во сколько раз растёт концентрация на каждом уровне.", "The TMF tells how many times it grows per trophic level.") },
      { q: t3("Минамата касаллиги қайси давлатда аниқланган?", "В какой стране выявили болезнь Минамата?", "Where was Minamata disease identified?"), o: [t3("Япония", "Япония", "Japan"), t3("Корея", "Корея", "Korea"), t3("Германия", "Германия", "Germany")], a: 0, w: t3("1956 йил, Кумамото префектураси, Минамата кўрфази.", "1956 г., префектура Кумамото, залив Минамата.", "1956, Minamata Bay, Kumamoto Prefecture.") },
      { q: t3("Ҳомиладор аёлларга қайси балиқни кам ейиш тавсия этилади?", "Какую рыбу беременным советуют есть реже?", "Which fish should pregnant women eat less of?"), o: [t3("Катта йиртқич балиқлар (акула, қилич балиқ)", "Крупных хищников (акула, меч-рыба)", "Big predators (shark, swordfish)"), t3("Майда балиқлар (сардина)", "Мелкую рыбу (сардина)", "Small fish (sardine)"), t3("Барчасини бир хил", "Всю одинаково", "All the same")], a: 0, w: t3("Улар озиқ занжири юқорисида бўлгани учун симоб кўп тўплайди.", "Они наверху пищевой цепи и накапливают больше ртути.", "They sit at the top of the chain and accumulate the most mercury.") }
    ],
    build(v, ui) {
      const T = THREE, S = { lc: 0.3, tmf: 4, baf: 5, lv: 4, eat: 50, bw: 60 };
      const Cw = () => Math.pow(10, S.lc); // нг/л метилсимоб
      const Ci = (i) => Cw() * 1e-6 * Math.pow(10, S.baf) * Math.pow(S.tmf, i); // мг/кг, i = 0..4
      const top = () => Ci(S.lv - 1);
      const intake = () => (top() * 1000 * (S.eat / 1000) * 7) / S.bw; // µg/kg·ҳафта
      ui.unit = () => 10;
      const sea = new T.Mesh(new T.BoxGeometry(14, 3, 8), new T.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.35, depthWrite: false, roughness: 0.1 })); sea.position.set(0, -0.5, 0); sea.userData.noPick = true; v.scene.add(sea);
      const surf = new T.Mesh(new T.PlaneGeometry(14, 8, 40, 20), new T.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5, side: T.DoubleSide, roughness: 0.1, metalness: 0.2 })); surf.rotation.x = -Math.PI / 2; surf.position.y = 1; surf.userData.noPick = true; v.scene.add(surf);
      const bed = new T.Mesh(new T.PlaneGeometry(14, 8), mat(0x78716c)); bed.rotation.x = -Math.PI / 2; bed.position.y = -2; v.scene.add(bed);
      const shore = new T.Mesh(new T.BoxGeometry(4, 1.6, 8), mat(0x65a30d)); shore.position.set(-9, 0.2, 0); v.scene.add(shore);
      const fac = new T.Mesh(new T.BoxGeometry(2, 1.2, 1.6), mat(0x57534e)); fac.position.set(-9, 1.6, -1.5); v.scene.add(fac);
      const chim = new T.Mesh(new T.CylinderGeometry(0.15, 0.2, 1.6, 12), mat(0xa8a29e)); chim.position.set(-8.5, 2.9, -1.5); v.scene.add(chim);
      const pipe = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 3, 10), mat(0x44403c)); pipe.rotation.z = Math.PI / 2; pipe.position.set(-6.5, 0.4, -1.5); v.scene.add(pipe);
      const boat = new T.Group(); const hull = new T.Mesh(new T.BoxGeometry(1.2, 0.3, 0.5), mat(0xb45309)); boat.add(hull); const man = new T.Mesh(new T.CapsuleGeometry(0.1, 0.25, 4, 8), mat(0xfde68a)); man.position.y = 0.35; boat.add(man); boat.position.set(3, 1.15, 2.5); v.scene.add(boat);
      /* Симоб заррачалари (оқова сувдан тарқалади) */
      const NH = 160, hgm = new T.InstancedMesh(new T.SphereGeometry(0.05, 6, 5), new T.MeshBasicMaterial({ color: 0xf87171 }), NH); hgm.userData.noPick = true; v.scene.add(hgm);
      const HP = Array.from({ length: NH }, () => ({ a: Math.random() * 6, x: 0, y: 0, z: 0, dx: Math.random() - 0.3, dz: Math.random() - 0.5, dy: -Math.random() * 0.4 }));
      /* Планктон (нуқталар) */
      const NPk = 260, pg = new T.BufferGeometry(), pp = new Float32Array(NPk * 3);
      for (let i = 0; i < NPk; i++) { pp[i * 3] = -6 + Math.random() * 12; pp[i * 3 + 1] = -1.8 + Math.random() * 2.6; pp[i * 3 + 2] = -3.6 + Math.random() * 7.2; }
      pg.setAttribute("position", new T.BufferAttribute(pp, 3));
      const pm = new T.PointsMaterial({ color: 0x86efac, size: 0.09, transparent: true, opacity: 0.85 }); v.scene.add(new T.Points(pg, pm));
      /* Балиқлар: 3 даражада */
      const school = [];
      const addFish = (n, len, lvl, R, y, sp) => { for (let i = 0; i < n; i++) { const f = fishMesh(len, 0x94a3b8); f.userData.o = { lvl, R: R * (0.7 + Math.random() * 0.5), y: y + (Math.random() - 0.5) * 0.6, sp: sp * (0.8 + Math.random() * 0.4), ph: Math.random() * 6.28, cx: (Math.random() - 0.5) * 3, cz: (Math.random() - 0.5) * 2 }; v.scene.add(f); school.push(f); } };
      addFish(14, 0.32, 2, 2.2, -0.2, 0.9); addFish(5, 0.75, 3, 3.2, -0.9, 0.5); addFish(2, 1.4, 4, 4, -1.3, 0.3);
      const lbl = [0, 1, 2, 3, 4].map((i) => liveLabel(v, [2.4, 3.5 - i * 0.48, -3.8], "#ffffff", 0.3));
      const head = liveLabel(v, [-2.6, 4.1, -3.8], "#ffffff", 0.42);
      const cBad = new T.Color(0xef4444), cOk = new T.Color(0x94a3b8);
      v.updaters.push((dt, t) => {
        const pa = surf.geometry.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i); pa.setZ(i, Math.sin(x * 0.9 + t * 1.5) * 0.06 + Math.cos(y * 1.3 + t) * 0.05); } pa.needsUpdate = true;
        boat.position.y = 1.15 + Math.sin(t * 1.4) * 0.05; boat.rotation.z = Math.sin(t * 1.1) * 0.05;
        const flowOn = S.lc > -0.6, mtx = new T.Matrix4();
        HP.forEach((p, i) => {
          p.a += dt; if (p.a > 6) { p.a = 0; }
          const a = p.a, s = flowOn ? clamp((S.lc + 1) / 2, 0.15, 1) : 0;
          mtx.makeScale(s, s, s); mtx.setPosition(-5 + a * 1.6 * (0.6 + p.dx), 0.3 + a * p.dy - a * 0.1, -1.5 + a * p.dz * 1.2); hgm.setMatrixAt(i, mtx);
        });
        hgm.instanceMatrix.needsUpdate = true;
        pm.color.copy(cOk.clone().set(0x86efac)).lerp(cBad, clamp(Ci(0) / 0.3, 0, 1) * 0.8);
        school.forEach((f) => {
          const o = f.userData.o, a = o.ph + t * o.sp; f.visible = o.lvl < S.lv;
          f.position.set(o.cx + Math.cos(a) * o.R, o.y + Math.sin(t * 2 + o.ph) * 0.08, o.cz + Math.sin(a) * o.R * 0.55);
          f.rotation.y = -a - Math.PI / 2 + Math.PI;
          f.userData.tail.rotation.y = Math.sin(t * 10 * o.sp + o.ph) * 0.5;
          f.userData.m.color.copy(cOk).lerp(cBad, clamp(Ci(o.lvl) / 0.3, 0, 1));
        });
        for (let i = 0; i < 5; i++) { const on = i < S.lv, c = Ci(i); lbl[i](on ? `${L(this.LV[i][1])}: ${fmt(c, c < 0.1 ? 3 : 2)} mg/kg` : " ", c > 0.3 ? "#fca5a5" : "#bbf7d0"); }
        head(`💧 ${L(t3("сув", "вода", "water"))}: ${fmt(Cw(), Cw() < 1 ? 2 : 1)} ng/L`, "#e0f2fe");
      });
      ui.probe = (p) => p.y > 1 ? L(t3("Ҳаво", "Воздух", "Air")) : `${L(t3("Сув", "Вода", "Water"))}: ${fmt(Cw(), 2)} ng/L MeHg`;
      const show = (k, x) => ({ lc: `${fmt(Math.pow(10, x), Math.pow(10, x) < 1 ? 2 : 1)} ng/L`, tmf: `×${fmt(x, 1)}`, baf: `10^${fmt(x, 1)} L/kg`, lv: `${x}`, eat: `${x} g/d`, bw: `${x} kg` }[k]);
      const chain = () => `<div class="l3-chain">${this.LV.slice(0, S.lv).map(([e, n], i) => { const c = Ci(i); return `<span class="${c > 0.3 ? "bad" : "ok"}"><b>${e}</b><small>${H(n)}</small><i>${fmt(c, c < 0.1 ? 3 : 2)}</i></span>`; }).join("<em>→</em>")}</div>`;
      const outK = () => {
        const c = top(), ok = c <= 0.3;
        return `<div class="l3-big"><span>${ok ? "✅" : "⚠️"}</span><b>${fmt(c, c < 1 ? 2 : 1)}</b><small>mg/kg · ${H(t3("энг катта балиқда", "в самой крупной рыбе", "in the biggest fish"))}</small></div>${chain()}<p class="lab-out">${H(ok ? t3("Балиқни ейиш хавфсиз (≤ 0,3 мг/кг).", "Рыбу есть безопасно (≤ 0,3 мг/кг).", "The fish is safe to eat (≤ 0.3 mg/kg).") : t3("Хавфли! Озиқ занжирида симоб кўпайиб кетди.", "Опасно! Ртуть умножилась по пищевой цепи.", "Danger! Mercury multiplied along the food chain."))}</p>`;
      };
      const outU = () => {
        const pts = []; for (let i = 0; i < S.lv; i++) pts.push([i + 1, Math.log10(Ci(i))]);
        return `<div class="lab-formula">C<sub>1</sub> = C<sub>w</sub>·BAF = ${fmt(Cw(), 2)}·10⁻⁶·10^${fmt(S.baf, 1)} = <b>${fmt(Ci(0), 3)}</b> mg/kg<br>C<sub>n</sub> = C<sub>1</sub>·TMF<sup>n−1</sup> → C<sub>${S.lv}</sub> = <b>${fmt(top(), 2)}</b> mg/kg (US EPA: 0,3)<br>${L(t3("Истеъмол", "Поступление", "Intake"))} = C·m·7/BW = <b>${fmt(intake(), 2)}</b> µg/kg·${L(t3("ҳафта", "нед.", "week"))} (JECFA PTWI 1,6 → ${fmt((intake() / 1.6) * 100, 0)}%)</div>${chain()}
          ${chartSvg([{ pts, c: "#ef4444", dots: true }], { x0: 1, x1: 5, y0: -4, y1: 2, xl: L(t3("трофик поғона", "трофический уровень", "trophic level")), yl: "log₁₀ C, mg/kg", bands: [[-4, Math.log10(0.3), "#22c55e"], [Math.log10(0.3), 2, "#ef4444"]] })}`;
      };
      ui.html = () => {
        if (stage() !== "uni") return `<p class="small"><b>${H(t3("Завод оқоваси", "Сброс завода", "Factory discharge"))}</b></p>${optsH("lc", [[0.3, "☠️", t3("Тозаламай ташлайди", "Сбрасывает без очистки", "Dumps untreated")], [-0.7, "🧪", t3("Тозалайди", "Очищает", "Treats it")], [-1.5, "🌊", t3("Ёпилди (табиий фон)", "Закрыт (природный фон)", "Closed (background)")]], S.lc)}
          <p class="small"><b>${H(t3("Қайси балиқни тутамиз?", "Какую рыбу ловим?", "Which fish do we catch?"))}</b></p>${optsH("lv", [[3, "🐟", t3("Майда балиқ", "Мелкая рыба", "Small fish")], [4, "🐠", t3("Йиртқич балиқ", "Хищная рыба", "Predatory fish")], [5, "🦈", t3("Тунец", "Тунец", "Tuna")]], S.lv)}
          <div data-out>${outK()}</div><p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Оқовани тўхтатинг ва ейиш хавфсиз балиқни топинг.", "Остановите сброс и найдите рыбу, безопасную для еды.", "Stop the discharge and find a fish that is safe to eat."))}</p>`;
        return `${rngH("lc", H(t3("Сувдаги метилсимоб Cw", "Метилртуть в воде Cw", "Methylmercury in water Cw")), S.lc, -2, 1, 0.05, show("lc", S.lc))}
          ${rngH("baf", H(t3("Биоаккумуляция BAF", "Биоаккумуляция BAF", "Bioaccumulation BAF")), S.baf, 4, 6, 0.1, show("baf", S.baf))}
          ${rngH("tmf", H(t3("Трофик магнификация TMF", "Трофическая магнификация TMF", "Trophic magnification TMF")), S.tmf, 1.5, 8, 0.1, show("tmf", S.tmf))}
          ${rngH("lv", H(t3("Занжир узунлиги", "Длина цепи", "Chain length")), S.lv, 3, 5, 1, show("lv", S.lv))}
          ${rngH("eat", H(t3("Балиқ истеъмоли", "Потребление рыбы", "Fish eaten")), S.eat, 0, 300, 10, show("eat", S.eat))}
          ${rngH("bw", H(t3("Тана вазни", "Масса тела", "Body weight")), S.bw, 15, 100, 5, show("bw", S.bw))}
          <div data-out>${outU()}</div>`;
      };
      const chk = () => { if (stage() !== "uni" && S.lc <= -0.7 && top() <= 0.3) star("minamata", ui.el.querySelector("[data-star]")); };
      ui.bind = (el) => { liveBind(el, S, show, stage() === "uni" ? outU : outK, chk); bindOpts(el, S, () => { ui.render(); chk(); }); };
      ui.goals = stage() === "uni" ? [
        { id: "thr", t: t3("5-поғонали занжирда энг юқори балиқ 0,3 мг/кг дан ошмайдиган Cw ни топинг (BAF 10⁵, TMF 4)", "Найдите Cw, при котором в 5-уровневой цепи верхняя рыба ≤ 0,3 мг/кг (BAF 10⁵, TMF 4)", "Find the Cw that keeps the top fish ≤ 0.3 mg/kg in a 5-level chain (BAF 10⁵, TMF 4)"), ok: () => S.lv === 5 && Math.abs(S.baf - 5) < 0.05 && Math.abs(S.tmf - 4) < 0.05 && top() <= 0.3 && top() >= 0.15 },
        { id: "ptwi", t: t3("Ҳафталик истеъмол PTWI дан 2 марта кўп бўлган ҳолатни кўринг", "Найдите случай, когда поступление вдвое выше PTWI", "Find a case where intake is twice the PTWI"), ok: () => intake() >= 3.2 },
        { id: "kid", t: t3("20 кг ли бола учун кунига 50 г балиқ хавфсиз бўлсин (≤ PTWI)", "Для ребёнка 20 кг 50 г рыбы в день — безопасно (≤ PTWI)", "Make 50 g/day of fish safe for a 20 kg child (≤ PTWI)"), ok: () => S.bw <= 20 && S.eat >= 50 && intake() <= 1.6 }
      ] : [
        { id: "dump", t: t3("Завод оқова ташлаганда тунецдаги симобни кўринг", "Посмотрите на ртуть в тунце при сбросе", "See the mercury in tuna when the factory dumps"), ok: () => S.lc >= 0.3 && S.lv === 5 },
        { id: "small", t: t3("Майда балиқ йиртқичдан хавфсизроқ эканини текширинг", "Проверьте, что мелкая рыба безопаснее хищной", "Check that small fish are safer than predators"), ok: () => S.lv === 3 }
      ];
      ui.read = () => ({ p: `Cw = ${fmt(Cw(), 2)} ng/L; TMF = ${fmt(S.tmf, 1)}; n = ${S.lv}`, r: `C_top = ${fmt(top(), 3)} mg/kg; intake = ${fmt(intake(), 2)} µg/kg/wk`, x: S.tmf, y: top(), xl: "TMF", yl: "C, mg/kg" });
      ui.task = () => ({ q: t3("Сувда метилсимоб 1 нг/л, BAF = 10⁵ л/кг (фитопланктон), TMF = 4. 4-поғонадаги (йиртқич балиқ) концентрация неча мг/кг?", "Метилртуть в воде 1 нг/л, BAF = 10⁵ л/кг (фитопланктон), TMF = 4. Концентрация на 4-м уровне (хищная рыба), мг/кг?", "Water MeHg is 1 ng/L, BAF = 10⁵ L/kg (phytoplankton), TMF = 4. What is the level-4 (predatory fish) concentration in mg/kg?"),
        a: 1e-6 * 1e5 * 64, tol: 0.1, unit: "mg/kg", dec: 1, hint: t3("C₁ = 1·10⁻⁶ мг/л · 10⁵ = 0,1 мг/кг; C₄ = C₁·4³", "C₁ = 1·10⁻⁶ мг/л · 10⁵ = 0,1 мг/кг; C₄ = C₁·4³", "C₁ = 1·10⁻⁶ mg/L · 10⁵ = 0.1 mg/kg; C₄ = C₁·4³") });
      ui.render();
    }
  };

  /* =====================================================================
     20) 🇰🇷 Чхонгечхон: шаҳар иссиқлик ороли ва дарёни тиклаш (энергия баланси)
     ===================================================================== */
  const CHEONG = {
    id: "chhonggye", icon: "🏙️", flag: "🇰🇷",
    name: t3("Чхонгечхон: салқин шаҳар", "Чхонгечхон: прохладный город", "Cheonggyecheon: a cooler city"),
    q: t3("Сеулда эстакада бузилиб, ўрнига ариқ очилгач, кўча нега бир неча градусга салқинлашди?", "Почему в Сеуле улица стала прохладнее на несколько градусов, когда эстакаду снесли и открыли ручей?", "Why did a Seoul street cool by several degrees when a highway was torn down and a stream restored?"),
    poe: { o: [t3("Сув ва дарахтлар буғлатиш орқали иссиқликни олади", "Вода и деревья забирают тепло испарением", "Water and trees remove heat by evaporation"), t3("Машиналар йўқолгани учун қуёш камроқ иситади", "Без машин солнце греет слабее", "Without cars the sun heats less"), t3("Ариқ сови ҳавони пуфлайди", "Ручей дует холодным воздухом", "The stream blows cold air")], a: 0,
      w: t3("Асфальт қуёш энергиясини иссиқликка айлантиради (сезиладиган иссиқлик H). Сув ва ўсимлик эса уни буғлатишга (яширин иссиқлик LE) сарфлайди, шамол йўлаги ҳам очилади — ҳаво салқинлашади.", "Асфальт превращает солнечную энергию в ощутимое тепло H, а вода и растения тратят её на испарение (скрытое тепло LE), к тому же открывается ветровой коридор — воздух охлаждается.", "Asphalt turns sunlight into sensible heat H, while water and plants spend it on evaporation (latent heat LE) and a wind corridor opens, so the air cools.") },
    src: "Seoul Metropolitan Government «Cheonggyecheon Restoration Project», 2006; Oke T.R. et al. «Urban Climates», Cambridge UP, 2017 (энергия баланси Rn = H + LE + G); Lee J.H. et al. «Cooling effect of the restored Cheonggyecheon stream», 2009; Santamouris M., 2014 (салқин томлар)",
    view: { bg: "#e0f2fe", d: 12, ph: 1.05, th: 0.9, target: [0, 1, 0], minD: 5, maxD: 20 },
    quiz: [
      { q: t3("Шаҳар иссиқлик ороли нима?", "Что такое городской остров тепла?", "What is an urban heat island?"), o: [t3("Шаҳар атрофидаги қишлоқдан иссиқроқ бўлиши", "Город теплее окружающей сельской местности", "A city being warmer than the countryside around it"), t3("Шаҳардаги орол", "Остров в городе", "An island in a city"), t3("Иссиқ сувли кўл", "Озеро с тёплой водой", "A warm lake")], a: 0, w: t3("Асфальт, бетон, машина ва кондиционерлар иссиқлик чиқаради, ўсимлик эса кам.", "Асфальт, бетон, машины и кондиционеры выделяют тепло, а зелени мало.", "Asphalt, concrete, cars and air conditioners add heat while greenery is scarce.") },
      { q: t3("Оқ том нега салқин?", "Почему белая крыша прохладнее?", "Why is a white roof cooler?"), o: [t3("Қуёш нурини кўпроқ қайтаради (альбедо юқори)", "Отражает больше солнца (высокое альбедо)", "It reflects more sunlight (high albedo)"), t3("Оқ бўёқ совуқ", "Белая краска холодная", "White paint is cold"), t3("Шамолни тортади", "Притягивает ветер", "It attracts wind")], a: 0, w: t3("Альбедо 0,6 бўлса, нурнинг 60 % и қайтади.", "При альбедо 0,6 отражается 60 % излучения.", "With albedo 0.6, 60 % of the light is reflected.") },
      { q: t3("Чхонгечхон қайси шаҳарда?", "В каком городе Чхонгечхон?", "Which city is Cheonggyecheon in?"), o: [t3("Сеул", "Сеул", "Seoul"), t3("Токио", "Токио", "Tokyo"), t3("Берлин", "Берлин", "Berlin")], a: 0, w: t3("2003–2005 йилларда эстакада бузилиб, 5,8 км ариқ тикланган.", "В 2003–2005 гг. снесли эстакаду и восстановили 5,8 км ручья.", "In 2003–2005 the overpass was removed and 5.8 km of stream restored.") }
    ],
    build(v, ui) {
      const T = THREE, S = { hw: 1, g: 0.05, w: 0, alb: 0.12, u: 1.5 };
      const Sd = 800, Lw = 100, rcp = 1200;
      const albE = () => (1 - S.g - S.w) * S.alb + S.g * 0.2 + S.w * 0.08;
      const Rn = () => (1 - albE()) * Sd - Lw;
      const EF = () => clamp(0.08 + 0.85 * (S.g + S.w * 1.3), 0, 0.9);
      const Qf = () => (S.hw ? 60 : 10);
      const Hs = () => (1 - EF()) * (Rn() + Qf()) * 0.85;
      const ga = () => 0.01 * (1 + S.u) * (S.hw ? 0.8 : 1.1);
      const dT = () => (0.3 * Hs()) / (rcp * ga());
      let base = null; const start = () => { if (base === null) base = dT(); };
      start();
      ui.unit = () => 10;
      const ground = new T.Mesh(new T.PlaneGeometry(18, 12), mat(0x52525b)); ground.rotation.x = -Math.PI / 2; v.scene.add(ground);
      const bmats = [];
      for (let s = -1; s <= 1; s += 2) for (let i = 0; i < 7; i++) {
        const h = 1.5 + ((i * 37) % 5) * 0.7, bm = mat(0xd6d3d1, { roughness: 0.7 }), b = new T.Mesh(new T.BoxGeometry(1.8, h, 2.4), bm); b.position.set(-7.2 + i * 2.4, h / 2, s * 3.6); v.scene.add(b);
        const rf = new T.Mesh(new T.BoxGeometry(1.82, 0.06, 2.42), mat(0x27272a)); rf.position.set(b.position.x, h + 0.03, b.position.z); v.scene.add(rf); bmats.push(rf.material);
      }
      /* Эстакада */
      const hwG = new T.Group();
      const deck = new T.Mesh(new T.BoxGeometry(18, 0.3, 2.2), mat(0x71717a)); deck.position.y = 1.6; hwG.add(deck);
      for (let i = 0; i < 8; i++) { const c = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 1.6, 10), mat(0x52525b)); c.position.set(-8 + i * 2.3, 0.8, 0); hwG.add(c); }
      const hcars = []; for (let i = 0; i < 14; i++) { const c = new T.Mesh(new T.BoxGeometry(0.5, 0.22, 0.26), mat([0xef4444, 0x3b82f6, 0xfacc15, 0xffffff][i % 4], { metalness: 0.4, roughness: 0.3 })); c.userData = { x: -9 + Math.random() * 18, l: i % 2 }; hwG.add(c); hcars.push(c); }
      v.scene.add(hwG);
      /* Ариқ ва дарахтлар */
      const strG = new T.Group();
      const water = new T.Mesh(new T.PlaneGeometry(18, 1.6, 60, 6), new T.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.9 })); water.rotation.x = -Math.PI / 2; water.position.y = 0.04; strG.add(water);
      const bank = (z) => { const b = new T.Mesh(new T.BoxGeometry(18, 0.12, 0.8), mat(0x84cc16)); b.position.set(0, 0.06, z); strG.add(b); };
      bank(1.2); bank(-1.2);
      const trees = [];
      for (let i = 0; i < 24; i++) { const tg = new T.Group(), tr = new T.Mesh(new T.CylinderGeometry(0.06, 0.08, 0.6, 6), mat(0x78350f)); tr.position.y = 0.3; tg.add(tr); const cr = new T.Mesh(new T.SphereGeometry(0.4, 10, 8), mat(0x16a34a)); cr.position.y = 0.8; tg.add(cr); tg.position.set(-8.5 + (i % 12) * 1.5, 0, i < 12 ? 1.9 : -1.9); strG.add(tg); trees.push(tg); }
      const NW = 50, ripple = new T.InstancedMesh(new T.SphereGeometry(0.05, 6, 4), new T.MeshBasicMaterial({ color: 0xe0f2fe }), NW); ripple.userData.noPick = true; strG.add(ripple);
      const RP = Array.from({ length: NW }, () => ({ x: -9 + Math.random() * 18, z: (Math.random() - 0.5) * 1.3 }));
      v.scene.add(strG);
      /* Иссиқлик тўлқинлари */
      const NHt = 120, heatI = new T.InstancedMesh(new T.SphereGeometry(0.06, 6, 4), new T.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.6 }), NHt); heatI.userData.noPick = true; v.scene.add(heatI);
      const HT = Array.from({ length: NHt }, () => ({ x: -8 + Math.random() * 16, z: (Math.random() - 0.5) * 6, y: Math.random() * 4, s: 0.5 + Math.random() }));
      const therm = liveLabel(v, [0, 5.6, 0], "#ffffff", 0.48);
      let morph = S.hw ? 1 : 0;
      const roofC = new T.Color(), dark = new T.Color(0x27272a), white = new T.Color(0xf8fafc);
      v.updaters.push((dt, t) => {
        morph = clamp(morph + (S.hw ? 1 : -1) * dt * 0.8, 0, 1);
        hwG.position.y = (morph - 1) * 2.2; hwG.visible = morph > 0.01;
        strG.visible = morph < 0.99;
        const grow = 1 - morph, ntree = Math.round(clamp(S.g / 0.5, 0, 1) * trees.length);
        trees.forEach((tg, i) => { const sc = i < ntree ? grow : 0.001; tg.scale.setScalar(Math.max(0.001, sc)); });
        water.scale.z = Math.max(0.001, grow * clamp(S.w / 0.15, 0.2, 1.3));
        const pa = water.geometry.attributes.position; for (let i = 0; i < pa.count; i++) pa.setZ(i, Math.sin(pa.getX(i) * 2 - t * 3) * 0.03); pa.needsUpdate = true;
        const mtx = new T.Matrix4();
        RP.forEach((p, i) => { p.x += dt * 1.2; if (p.x > 9) p.x = -9; const sc = grow * (S.w > 0.01 ? 1 : 0); mtx.makeScale(sc, sc, sc); mtx.setPosition(p.x, 0.08, p.z * water.scale.z); ripple.setMatrixAt(i, mtx); });
        ripple.instanceMatrix.needsUpdate = true;
        hcars.forEach((c) => { const d = c.userData; d.x += (d.l ? 1 : -1) * dt * 2.2; if (d.x > 9) d.x = -9; if (d.x < -9) d.x = 9; c.position.set(d.x, 1.86, d.l ? 0.45 : -0.45); });
        const heat = clamp(dT() / 5, 0, 1), nh = Math.round(heat * NHt);
        HT.forEach((p, i) => { p.y += dt * p.s * (0.6 + heat); if (p.y > 4.5) p.y = 0; const sc = i < nh ? 1 + Math.sin(t * 5 + i) * 0.3 : 0; mtx.makeScale(sc, sc, sc); mtx.setPosition(p.x + Math.sin(t * 2 + i) * 0.15, p.y, p.z); heatI.setMatrixAt(i, mtx); });
        heatI.instanceMatrix.needsUpdate = true;
        roofC.copy(dark).lerp(white, clamp((S.alb - 0.05) / 0.6, 0, 1)); bmats.forEach((m) => m.color.copy(roofC));
        const d = dT(); therm(`🌡️ +${fmt(d, 1)} °C ${L(t3("қишлоққа нисбатан", "к пригороду", "vs countryside"))}`, d > 3 ? "#fecaca" : d > 1.5 ? "#fde68a" : "#bbf7d0");
      });
      ui.probe = (p) => `${L(t3("Ҳаво", "Воздух", "Air"))}: +${fmt(dT() * clamp(1 - p.y / 6, 0.2, 1), 1)} °C`;
      const show = (k, x) => ({ g: `${Math.round(x * 100)}%`, w: `${Math.round(x * 100)}%`, alb: fmt(x, 2), u: `${fmt(x, 1)} m/s` }[k]);
      const outK = () => {
        const d = dT(), gain = base - d;
        const msg = gain >= 3 ? t3("Зўр! Кўча худди Сеулдаги каби анча салқинлашди.", "Отлично! Улица заметно остыла, как в Сеуле.", "Great! The street cooled down a lot, just like in Seoul.") : gain >= 1 ? t3("Салқинроқ бўлди. Яна дарахт ёки сув қўшинг.", "Стало прохладнее. Добавьте ещё деревьев или воды.", "Cooler now. Add more trees or water.") : t3("Кўча ҳали иссиқ. Эстакадани ариққа алмаштириб кўринг.", "Улица ещё горячая. Попробуйте заменить эстакаду ручьём.", "Still hot. Try replacing the highway with a stream.");
        return `<div class="l3-big"><span>${d > 3 ? "🥵" : d > 1.5 ? "😅" : "😎"}</span><b>+${fmt(d, 1)} °C</b><small>${H(t3("қишлоқдан иссиқроқ", "теплее пригорода", "warmer than countryside"))} · −${fmt(Math.max(0, gain), 1)} °C</small></div><p class="lab-out">${H(msg)}</p>`;
      };
      const outU = () => {
        const crv = []; for (let g = 0; g <= 0.6001; g += 0.05) { const s0 = S.g; S.g = g; crv.push([g * 100, dT()]); S.g = s0; }
        return `<div class="lab-formula">α<sub>eff</sub> = <b>${fmt(albE(), 3)}</b> · R<sub>n</sub> = (1−α)·${Sd} − ${Lw} = <b>${fmt(Rn(), 0)}</b> W/m² · Q<sub>F</sub> = ${Qf()} W/m²<br>EF = LE/(R<sub>n</sub>+Q<sub>F</sub>−G) = <b>${fmt(EF(), 2)}</b> → H = (1−EF)(R<sub>n</sub>+Q<sub>F</sub>)·0,85 = <b>${fmt(Hs(), 0)}</b> W/m²<br>ΔT ≈ k·H/(ρc<sub>p</sub>g<sub>a</sub>) = 0,3·${fmt(Hs(), 0)}/(1200·${fmt(ga(), 3)}) = <b>${fmt(dT(), 2)}</b> °C · β = H/LE = <b>${fmt((1 - EF()) / Math.max(EF(), 0.01), 2)}</b></div>
          ${chartSvg([{ pts: crv, c: "#16a34a" }], { mark: [S.g * 100, dT()], x0: 0, x1: 60, y0: 0, xl: L(t3("кўкаламзорлик, %", "озеленение, %", "green cover, %")), yl: "ΔT, °C" })}`;
      };
      ui.html = () => {
        if (stage() !== "uni") return `<p class="small"><b>${H(t3("Кўча ўртасида", "Посреди улицы", "Middle of the street"))}</b></p>${optsH("hw", [[1, "🛣️", t3("Эстакада", "Эстакада", "Highway")], [0, "🏞️", t3("Ариқ", "Ручей", "Stream")]], S.hw)}
          <p class="small"><b>${H(t3("Дарахтлар", "Деревья", "Trees"))}</b></p>${optsH("g", [[0.05, "🌱", t3("Кам", "Мало", "Few")], [0.25, "🌳", t3("Ўртача", "Средне", "Some")], [0.5, "🌳🌳", t3("Кўп", "Много", "Many")]], S.g)}
          <p class="small"><b>${H(t3("Томлар", "Крыши", "Roofs"))}</b></p>${optsH("alb", [[0.12, "⬛", t3("Қора", "Тёмные", "Dark")], [0.6, "⬜", t3("Оқ", "Белые", "White")]], S.alb)}
          <div data-out>${outK()}</div><p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Кўчани камида 3 °C га салқинлатинг.", "Охладите улицу хотя бы на 3 °C.", "Cool the street by at least 3 °C."))}</p>`;
        return `${optsH("hw", [[1, "🛣️", t3("Эстакада + машиналар", "Эстакада + машины", "Highway + traffic")], [0, "🏞️", t3("Тикланган ариқ", "Восстановленный ручей", "Restored stream")]], S.hw)}
          ${rngH("g", H(t3("Кўкаламзорлик улуши", "Доля озеленения", "Green cover")), S.g, 0, 0.6, 0.01, show("g", S.g))}
          ${rngH("w", H(t3("Сув юзаси улуши", "Доля водной поверхности", "Water surface")), S.w, 0, 0.3, 0.01, show("w", S.w))}
          ${rngH("alb", H(t3("Том ва йўлак альбедоси", "Альбедо крыш и тротуаров", "Roof and pavement albedo")), S.alb, 0.05, 0.7, 0.01, show("alb", S.alb))}
          ${rngH("u", H(t3("Шамол тезлиги", "Скорость ветра", "Wind speed")), S.u, 0.3, 5, 0.1, show("u", S.u))}
          <div data-out>${outU()}</div>`;
      };
      const chk = () => { if (stage() !== "uni" && base - dT() >= 3) star("chhonggye", ui.el.querySelector("[data-star]")); };
      ui.bind = (el) => {
        liveBind(el, S, show, stage() === "uni" ? outU : outK, chk);
        bindOpts(el, S, (k) => { if (k === "hw" && !S.hw && S.w < 0.1) S.w = 0.12; if (k === "hw" && S.hw) S.w = 0; ui.render(); chk(); });
      };
      ui.goals = stage() === "uni" ? [
        { id: "seoul", t: t3("Эстакадани ариққа алмаштириб, ΔT ни ≥ 2,5 °C га камайтиринг", "Заменив эстакаду ручьём, снизьте ΔT на ≥ 2,5 °C", "Replace the highway with a stream and cut ΔT by ≥ 2.5 °C"), ok: () => !S.hw && base - dT() >= 2.5 },
        { id: "roof", t: t3("Фақат салқин томлар (α ≥ 0,6) билан ΔT ≤ 2 °C", "Только прохладными крышами (α ≥ 0,6): ΔT ≤ 2 °C", "Only cool roofs (α ≥ 0.6): ΔT ≤ 2 °C"), ok: () => S.alb >= 0.6 && S.g <= 0.1 && S.w <= 0.02 && dT() <= 2 },
        { id: "bowen", t: t3("Боуэн нисбати β < 1 бўлсин (буғланиш устун)", "Пусть число Боуэна β < 1 (испарение преобладает)", "Get the Bowen ratio β < 1 (evaporation dominates)"), ok: () => (1 - EF()) / EF() < 1 }
      ] : [
        { id: "stream", t: t3("Эстакадани ариққа алмаштиринг", "Замените эстакаду ручьём", "Replace the highway with a stream"), ok: () => S.hw === 0 },
        { id: "white", t: t3("Оқ томлар ҳам ёрдам беришини текширинг", "Проверьте, помогают ли белые крыши", "Check that white roofs help too"), ok: () => S.alb === 0.6 }
      ];
      ui.read = () => ({ p: `${S.hw ? "highway" : "stream"}; green = ${Math.round(S.g * 100)}%; α = ${fmt(S.alb, 2)}`, r: `ΔT = ${fmt(dT(), 2)} °C; H = ${fmt(Hs(), 0)} W/m²`, x: S.g * 100, y: dT(), xl: "green, %", yl: "ΔT, °C" });
      ui.task = () => ({ q: t3("Радиация баланси Rn = 500 Вт/м², буғланиш улуши EF = 0,6, тупроққа кетадиган иссиқлик G = 15 %. Сезиладиган иссиқлик оқими H неча Вт/м²?", "Радиационный баланс Rn = 500 Вт/м², доля испарения EF = 0,6, поток в почву G = 15 %. Чему равен поток ощутимого тепла H, Вт/м²?", "Net radiation Rn = 500 W/m², evaporative fraction EF = 0.6, ground heat G = 15 %. What is the sensible heat flux H in W/m²?"),
        a: 500 * 0.85 * 0.4, tol: 3, unit: "W/m²", dec: 0, hint: t3("H = (1 − EF) · Rn · (1 − 0,15)", "H = (1 − EF) · Rn · (1 − 0,15)", "H = (1 − EF) · Rn · (1 − 0.15)") });
      ui.render();
    }
  };

  Object.assign(HOW, {
    aqi: {
      k: [t3("Машиналар сонини, завод фильтрини ва об-ҳавони танланг.", "Выберите число машин, фильтр завода и погоду.", "Choose the cars, factory filter and weather."), t3("Осмон ранги ва AQI рақамини кузатинг: яшил — тоза, қизил — зарарли.", "Следите за цветом неба и числом AQI: зелёный — чисто, красный — вредно.", "Watch the sky and AQI number: green is clean, red is unhealthy."), t3("Шамолсиз кунда ҳам ҳавони тоза қилиш йўлини топинг.", "Найдите, как очистить воздух даже в безветрие.", "Find a way to clean the air even on a calm day.")],
      u: [t3("Манбалар (транспорт, саноат, иситиш) ва метеошароитни (u, H) ўзгартиринг.", "Меняйте источники (транспорт, промышленность, отопление) и метеоусловия (u, H).", "Change the sources (traffic, industry, heating) and weather (u, H)."), t3("Қути модели C = Cb + qL/(uH) ва EPA 2024 чегараларида AQI ни текширинг.", "Проверьте боксовую модель C = Cb + qL/(uH) и AQI по границам EPA 2024.", "Check the box model C = Cb + qL/(uH) and the AQI using EPA 2024 breakpoints."), t3("Графикда AQI нинг шамол тезлигига боғлиқлигини таҳлил қилинг.", "Проанализируйте на графике зависимость AQI от скорости ветра.", "Analyse how AQI depends on wind speed on the chart.")]
    },
    energiya: {
      k: [t3("Фасл, шамол ва аккумуляторни танланг.", "Выберите сезон, ветер и аккумулятор.", "Pick the season, wind and battery."), t3("Соат айланаётганини кузатинг: тунда уйларда чироқ ёнади, газ станцияси тутун чиқаради.", "Следите за часами: ночью в домах горит свет, газовая станция дымит.", "Watch the clock: at night windows light up and the gas plant smokes."), t3("Тоза электр улушини 90 % дан оширинг.", "Поднимите долю чистой энергии выше 90 %.", "Get clean power above 90 %.")],
      u: [t3("Қуёш, шамол ва аккумулятор қувватини ўзгартиринг.", "Меняйте мощности СЭС, ВЭС и накопителей.", "Change solar, wind and storage capacity."), t3("Соатлик графикда талаб, қуёш, шамол ва газни солиштиринг.", "Сравните на почасовом графике спрос, солнце, ветер и газ.", "Compare hourly demand, solar, wind and gas on the chart."), t3("Кесилган энергия ва CO₂ интенсивлигини таҳлил қилинг; қишки «Dunkelflaute» ни синанг.", "Проанализируйте отсечение и углеродоёмкость; испытайте зимнюю «Dunkelflaute».", "Analyse curtailment and CO₂ intensity; try a winter Dunkelflaute.")]
    },
    minamata: {
      k: [t3("Завод оқовасини танланг: ташлайди, тозалайди ёки ёпилган.", "Выберите сброс завода: сбрасывает, очищает или закрыт.", "Pick the discharge: dumping, treated or closed."), t3("Балиқлар рангини кузатинг: қизил — симоб кўп.", "Следите за цветом рыб: красный — много ртути.", "Watch the fish colour: red means lots of mercury."), t3("Ейиш учун хавфсиз балиқни топинг.", "Найдите рыбу, безопасную для еды.", "Find a fish that is safe to eat.")],
      u: [t3("Cw, BAF ва TMF ни ўзгартириб, ҳар бир поғонадаги концентрацияни кузатинг.", "Меняйте Cw, BAF и TMF и следите за концентрацией на каждом уровне.", "Change Cw, BAF and TMF and watch each trophic level."), t3("Логарифмик графикда биомагнификацияни таҳлил қилинг.", "Проанализируйте биомагнификацию на логарифмическом графике.", "Analyse biomagnification on the log chart."), t3("Истеъмол ва тана вазни бўйича JECFA PTWI билан солиштиринг.", "Сравните поступление с PTWI JECFA с учётом массы тела.", "Compare intake with the JECFA PTWI for a given body weight.")]
    },
    chhonggye: {
      k: [t3("Кўча ўртасини танланг: эстакада ёки ариқ.", "Выберите середину улицы: эстакада или ручей.", "Choose the middle of the street: highway or stream."), t3("Дарахт ва оқ томлар қўшиб, иссиқлик тўлқинлари камайишини кузатинг.", "Добавьте деревья и белые крыши и следите, как тают волны тепла.", "Add trees and white roofs and watch the heat waves fade."), t3("Кўчани 3 °C га салқинлатинг.", "Охладите улицу на 3 °C.", "Cool the street by 3 °C.")],
      u: [t3("Кўкаламзорлик, сув, альбедо ва шамолни ўзгартиринг.", "Меняйте озеленение, воду, альбедо и ветер.", "Change green cover, water, albedo and wind."), t3("Энергия баланси Rn = H + LE + G ва Боуэн нисбатини текширинг.", "Проверьте энергобаланс Rn = H + LE + G и число Боуэна.", "Check the energy balance Rn = H + LE + G and the Bowen ratio."), t3("Ариқ, дарахт ва салқин томлар самарасини солиштиринг.", "Сравните эффект ручья, деревьев и прохладных крыш.", "Compare the effect of the stream, trees and cool roofs.")]
    }
  });
  METHODS.push(
    ["🌐", t3("Халқаро тажрибалар: АҚШ (EPA AQI), Германия (Energiewende), Япония (Минамата), Корея (Чхонгечхон)", "Международный опыт: США (EPA AQI), Германия (Energiewende), Япония (Минамата), Корея (Чхонгечхон)", "International cases: USA (EPA AQI), Germany (Energiewende), Japan (Minamata), Korea (Cheonggyecheon)"), t3("Ҳар бир тажриба шу давлатнинг ҳақиқий сиёсати ёки фожиасига асосланган ва узлуксиз анимацияда кўрсатилади.", "Каждый опыт основан на реальной политике или трагедии страны и показан в непрерывной анимации.", "Each experiment is based on a real policy or event in that country and runs as a live animation.")]
  );

  /* =====================================================================
     21) 🧫 pH шкаласи ва кислотали ёмғир — суюлтириш: [H⁺] = [H⁺]₀·V₀/(V₀+Vсув)
     (PhET «pH Scale» ғоясидан илҳомланган, ўз модели ва коди)
     ===================================================================== */
  const PH_SOL = [
    ["lemon", "🍋", t3("Лимон шарбати", "Лимонный сок", "Lemon juice"), 2.4],
    ["rainA", "🌧️", t3("Кислотали ёмғир", "Кислотный дождь", "Acid rain"), 4.2],
    ["coffee", "☕", t3("Қаҳва", "Кофе", "Coffee"), 5.0],
    ["rain", "💧", t3("Тоза ёмғир", "Чистый дождь", "Clean rain"), 5.6],
    ["milk", "🥛", t3("Сут", "Молоко", "Milk"), 6.6],
    ["water", "🚰", t3("Тоза сув", "Чистая вода", "Pure water"), 7.0],
    ["sea", "🌊", t3("Денгиз суви", "Морская вода", "Seawater"), 8.1],
    ["soda", "🧂", t3("Сода эритмаси", "Раствор соды", "Baking soda solution"), 8.3],
    ["soap", "🧼", t3("Совунли сув", "Мыльная вода", "Soapy water"), 10.0],
    ["lime", "🥣", t3("Оҳак суви", "Известковая вода", "Limewater"), 12.4]
  ];
  const phColor = (p) => { const st = [[1, [0.85, 0.1, 0.1]], [4, [0.98, 0.5, 0.1]], [6, [0.98, 0.85, 0.15]], [7, [0.35, 0.75, 0.25]], [9, [0.15, 0.45, 0.8]], [11, [0.35, 0.2, 0.65]], [14, [0.42, 0.12, 0.5]]]; let a = st[0]; for (const b of st) { if (p <= b[0]) { const k = (p - a[0]) / Math.max(1e-9, b[0] - a[0]); return a[1].map((v, i) => v + (b[1][i] - v) * clamp(k, 0, 1)); } a = b; } return st[st.length - 1][1]; };
  const PHX = {
    id: "ph", icon: "🧫",
    name: t3("pH шкаласи ва кислотали ёмғир", "Шкала pH и кислотный дождь", "pH scale and acid rain"),
    q: t3("Лимон шарбатини сув билан суюлтирсак, у нейтрал (pH 7) бўлиб қоладими?", "Если разбавлять лимонный сок водой, станет ли он нейтральным (pH 7)?", "If you keep diluting lemon juice with water, will it ever become neutral (pH 7)?"),
    poe: { o: [t3("Ҳа, сув етарли бўлса pH 7 дан ошиб кетади", "Да, при большом количестве воды pH станет выше 7", "Yes — with enough water the pH goes above 7"), t3("pH 7 га яқинлашади, лекин ундан ошмайди", "pH приближается к 7, но не превышает его", "The pH approaches 7 but never passes it"), t3("pH ўзгармайди", "pH не меняется", "The pH does not change")], a: 1,
      w: t3("Ҳар 10 марта суюлтириш pH ни тахминан 1 га оширади, лекин сувнинг ўзи pH 7 — кислота ҳеч қачон ишқорга айланмайди.", "Каждое 10-кратное разбавление повышает pH примерно на 1, но у самой воды pH 7 — кислота никогда не станет щёлочью.", "Each 10-fold dilution raises the pH by about 1, but water itself is pH 7, so an acid never turns alkaline.") },
    src: t3("pH = −lg[H⁺], Kw = 10⁻¹⁴ (25 °C); тоза ёмғир pH ≈ 5,6 (атмосфера CO₂ мувозанати); US EPA «What is Acid Rain?» (2024); ғоя: PhET «pH Scale» (Колорадо университети, CC BY 4.0) — модель ва код Экомунники", "pH = −lg[H⁺], Kw = 10⁻¹⁴ (25 °C); чистый дождь pH ≈ 5,6 (равновесие с CO₂ атмосферы); US EPA «What is Acid Rain?» (2024); идея: PhET «pH Scale» (Университет Колорадо, CC BY 4.0) — модель и код Экомуна", "pH = −log[H⁺], Kw = 10⁻¹⁴ (25 °C); clean rain pH ≈ 5.6 (equilibrium with atmospheric CO₂); US EPA “What is Acid Rain?” (2024); idea: PhET “pH Scale” (University of Colorado, CC BY 4.0) — Ekomun's own model and code"),
    view: { bg: "#e0f2fe", d: 5.6, ph: 1.2, th: 0.25, target: [0.35, 1, 0], minD: 2.5, maxD: 10 },
    quiz: [
      { q: t3("pH 4 бўлган эритмада [H⁺] pH 6 дагидан неча марта кўп?", "Во сколько раз [H⁺] при pH 4 больше, чем при pH 6?", "How many times more [H⁺] is there at pH 4 than at pH 6?"), o: [t3("2 марта", "в 2 раза", "2 times"), t3("100 марта", "в 100 раз", "100 times"), t3("20 марта", "в 20 раз", "20 times")], a: 1, w: t3("Шкала логарифмик: ҳар бир бирлик — 10 марта.", "Шкала логарифмическая: каждая единица — в 10 раз.", "The scale is logarithmic: each unit is 10 times.") },
      { q: t3("Қайси ёмғир кислотали ҳисобланади?", "Какой дождь считается кислотным?", "Which rain counts as acid rain?"), o: [t3("pH < 5,6", "pH < 5,6", "pH < 5.6"), t3("pH > 7", "pH > 7", "pH > 7"), t3("pH = 7", "pH = 7", "pH = 7")], a: 0, w: t3("Тоза ёмғир CO₂ туфайли бироз кислотали (5,6); SO₂ ва NOₓ уни янада пасайтиради.", "Чистый дождь слегка кислый из-за CO₂ (5,6); SO₂ и NOₓ понижают его ещё.", "Clean rain is slightly acidic from CO₂ (5.6); SO₂ and NOₓ push it lower.") }
    ],
    build(v, ui) {
      const T = THREE, S = { s: "lemon", w: 0, seen: new Set(["lemon"]) };
      const V0 = 50;
      const sol = () => PH_SOL.find((x) => x[0] === S.s);
      const phNow = () => {
        const p0 = sol()[3], f = V0 / (V0 + S.w);
        if (p0 < 7) { const h = Math.pow(10, -p0) * f + 1e-7 * (1 - f); return -Math.log10(Math.max(h, 1e-7)); }
        if (p0 > 7) { const oh = Math.pow(10, p0 - 14) * f + 1e-7 * (1 - f); return 14 + Math.log10(Math.max(oh, 1e-7)); }
        return 7;
      };
      ui.goals = stage() === "uni" ? [
        { id: "dil", t: t3("Лимон шарбатини суюлтириб pH ни 3 дан юқори қилинг", "Разбавьте лимонный сок до pH выше 3", "Dilute lemon juice to above pH 3"), ok: () => S.s === "lemon" && phNow() > 3 },
        { id: "base", t: t3("Оҳак сувини суюлтириб pH ни 11 дан пастга туширинг", "Разбавьте известковую воду до pH ниже 11", "Dilute limewater to below pH 11"), ok: () => S.s === "lime" && phNow() < 11 }
      ] : [
        { id: "all", t: t3("Камида 6 та модданинг pH ини текширинг", "Проверьте pH хотя бы 6 веществ", "Check the pH of at least 6 substances"), ok: () => S.seen.size >= 6 }
      ];
      /* Стакан, суюқлик, H₃O⁺ (қизил) ва OH⁻ (кўк) заррачалар */
      const glass = new T.Mesh(new T.CylinderGeometry(0.9, 0.85, 2, 40, 1, true), new T.MeshStandardMaterial({ color: 0xf0f9ff, transparent: true, opacity: 0.25, side: T.DoubleSide, roughness: 0.05 })); glass.position.y = 1; v.scene.add(glass);
      const base = new T.Mesh(new T.CylinderGeometry(1.4, 1.4, 0.08, 40), mat(0x94a3b8)); base.position.y = -0.04; v.scene.add(base);
      const liqM = new T.MeshStandardMaterial({ color: 0x22c55e, transparent: true, opacity: 0.55, roughness: 0.2 });
      const liq = new T.Mesh(new T.CylinderGeometry(0.86, 0.83, 1, 40), liqM); v.scene.add(liq);
      const hM = mat(0xef4444, { roughness: 0.3 }), oM = mat(0x2563eb, { roughness: 0.3 });
      const NP = 60, ions = Array.from({ length: NP }, (_, i) => { const m = new T.Mesh(new T.SphereGeometry(0.06, 10, 8), i % 2 ? hM : oM); m.userData = { a: Math.random() * 6.28, r: Math.random() * 0.75, y: Math.random(), s: 0.2 + Math.random() * 0.5 }; v.scene.add(m); return m; });
      const lbl = liveLabel(v, [0, 2.35, 0], "#0f172a", 0.36);
      /* pH шкаласи (рангли устун) ва кўрсатгич */
      for (let i = 0; i < 14; i++) { const c = phColor(i + 0.5); const b = new T.Mesh(new T.BoxGeometry(0.14, 0.14, 0.14), new T.MeshBasicMaterial({ color: new T.Color(c[0], c[1], c[2]) })); b.position.set(1.55, 0.1 + i * 0.15, 0.3); v.scene.add(b); }
      const ptr = new T.Mesh(new T.ConeGeometry(0.07, 0.18, 12), mat(0x0f172a)); ptr.rotation.z = Math.PI / 2; v.scene.add(ptr);
      const draw = () => {
        const p = phNow(), c = phColor(p), lv = clamp((V0 + S.w) / 550, 0.12, 1) * 1.85;
        liqM.color.setRGB(c[0], c[1], c[2]);
        liq.scale.y = lv; liq.position.y = lv / 2 + 0.02;
        /* H⁺:OH⁻ нисбати логарифмда: pH 7 да тенг; ҳар бир бирлик — улуш ўзгаради */
        const fracH = 1 / (1 + Math.pow(10, (p - 7) * 0.5));
        ions.forEach((m, i) => { m.material = i / NP < fracH ? hM : oM; m.userData.lv = lv; });
        ptr.position.set(1.75, 0.1 + p * 0.15, 0.3);
        lbl("pH " + fmt(p, 2));
      };
      v.updaters.push((dt) => ions.forEach((m) => { const u = m.userData; u.a += dt * u.s; u.y += dt * 0.05 * u.s; if (u.y > 1) u.y = 0; m.position.set(Math.cos(u.a) * u.r, 0.08 + u.y * ((u.lv || 1) - 0.12), Math.sin(u.a) * u.r); }));
      ui.read = () => ({ p: L(sol()[2]) + "; " + S.w + " ml H₂O", r: "pH " + fmt(phNow(), 2), x: S.w, y: phNow(), xl: L(t3("Қўшилган сув, мл", "Добавлено воды, мл", "Water added, mL")), yl: "pH" });
      ui.html = () => {
        const p = phNow(), uni = stage() === "uni", h = Math.pow(10, -p), oh = Math.pow(10, p - 14);
        const kind = p < 6.9 ? t3("кислота", "кислота", "acid") : p > 7.1 ? t3("асос (ишқор)", "основание (щёлочь)", "base (alkali)") : t3("нейтрал", "нейтральный", "neutral");
        const curve = uni ? chartSvg([{ pts: Array.from({ length: 41 }, (_, i) => { const w = i * 12.5, f = V0 / (V0 + w), p0 = sol()[3]; const y = p0 < 7 ? -Math.log10(Math.pow(10, -p0) * f + 1e-7 * (1 - f)) : p0 > 7 ? 14 + Math.log10(Math.pow(10, p0 - 14) * f + 1e-7 * (1 - f)) : 7; return [w, y]; }), c: "#0891b2" }], { xl: L(t3("Қўшилган сув, мл", "Добавлено воды, мл", "Water added, mL")), yl: "pH", y0: 0, y1: 14, mark: [S.w, p] }) : "";
        return `${optsH("s", PH_SOL.map(([id, e, n]) => [id, e, n]), S.s)}
          ${rngH("w", H(t3("Сув қўшиш", "Добавить воду", "Add water")), S.w, 0, 500, 10, S.w + " ml")}
          <div class="l3-big"><span>${sol()[1]}</span><b>pH ${fmt(p, 2)}</b></div>
          <p class="lab-out">${H(sol()[2])}: <b>${H(kind)}</b>${p < 5.6 && S.s.startsWith("rain") ? " · " + H(t3("кислотали ёмғир чегарасидан паст!", "ниже границы кислотного дождя!", "below the acid-rain threshold!")) : ""}</p>
          ${uni ? `<div class="lab-formula">pH = −lg[H⁺] → [H⁺] = <b>${h.toExponential(2)}</b> M · [OH⁻] = <b>${oh.toExponential(2)}</b> M<br>[H⁺]·[OH⁻] = Kw = 10⁻¹⁴ · ${H(t3("суюлтириш", "разбавление", "dilution"))} ×${fmt((V0 + S.w) / V0, 1)}</div>${curve}` : `<p class="small">🔴 H₃O⁺ · 🔵 OH⁻ — ${H(t3("қизил кўп бўлса кислота, кўк кўп бўлса ишқор.", "больше красных — кислота, больше синих — щёлочь.", "more red means acid, more blue means alkali."))}</p><p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("6 та моддани текширинг ва кислота ҳамда ишқорларни топинг.", "Проверьте 6 веществ и найдите кислоты и щёлочи.", "Test 6 substances and find the acids and alkalis."))}</p>`}`;
      };
      ui.bind = (el) => {
        bindOpts(el, S, () => { S.seen.add(S.s); S.w = 0; draw(); ui.render(); if (S.seen.size >= 6) star("ph", ui.el.querySelector("[data-star]")); });
        liveBind(el, S, (k, val) => val + " ml", () => "", () => draw());
        el.querySelectorAll("input[data-k]").forEach((r) => r.addEventListener("change", () => ui.render()));
      };
      ui.task = () => ({ q: t3("Кислотали ёмғир намунаси pH 4,2. Уни тоза ёмғир даражаси pH 5,6 гача етказиш учун тахминан неча марта суюлтириш керак? (кучли кислота деб ҳисобланг)", "Проба кислотного дождя имеет pH 4,2. Во сколько раз примерно нужно её разбавить, чтобы получить pH 5,6? (считайте кислоту сильной)", "An acid-rain sample has pH 4.2. Roughly how many times must it be diluted to reach pH 5.6? (treat it as a strong acid)"), a: 25.1, tol: 1.5, unit: "×", hint: t3("10^(5,6 − 4,2) = 10^1,4", "10^(5,6 − 4,2) = 10^1,4", "10^(5.6 − 4.2) = 10^1.4"), dec: 1 });
      draw();
    }
  };

  /* =====================================================================
     22) 🦊 Йиртқич ва ўлжа — Лотка–Вольтерра: dx/dt = αx − βxy, dy/dt = δxy − γy
     ===================================================================== */
  const LV = {
    id: "yirtqich", icon: "🦊",
    name: t3("Йиртқич ва ўлжа (популяция)", "Хищник и жертва (популяции)", "Predator and prey (populations)"),
    q: t3("Тулкиларнинг ҳаммасини овлаб йўқотсак, қуёнлар учун яхши бўладими?", "Если истребить всех лис, будет ли это хорошо для зайцев?", "If we hunt all the foxes, is that good for the rabbits?"),
    poe: { o: [t3("Ҳа, қуёнлар доим кўпайиб, бахтли яшайди", "Да, зайцы будут всегда процветать", "Yes, rabbits will thrive forever"), t3("Қуёнлар аввал кўпаяди, кейин ўт тугаб, касаллик ва очликдан камаяди", "Зайцы сначала размножатся, затем кончится трава и придут голод и болезни", "Rabbits boom, then run out of grass and crash from hunger and disease"), t3("Ҳеч нарса ўзгармайди", "Ничего не изменится", "Nothing changes")], a: 1,
      w: t3("Йиртқич популяцияни мувозанатда ушлайди. Модел шуни кўрсатади: йиртқич кам бўлса ўлжа тез кўпаяди, кейин йиртқич ҳам кўпаяди — тўлқинсимон цикл ҳосил бўлади (Ҳудсон кўрфази компаниясининг силовсин–қуён маълумотлари).", "Хищник держит популяцию в равновесии. Модель показывает: при малом числе хищников жертва быстро растёт, затем растут и хищники — возникают циклы (данные компании Гудзонова залива по рыси и зайцу).", "Predators keep populations in balance. The model shows: with few predators prey boom, then predators grow too — producing cycles (the Hudson's Bay Company lynx–hare records).") },
    src: t3("Lotka A.J. «Elements of Physical Biology», 1925; Volterra V., Nature 118:558, 1926; Elton C., Nicholson M., J. Anim. Ecol. 11:215, 1942 (силовсин–қуён циклари); ғоя: PhET «Natural Selection» ва NetLogo «Wolf Sheep Predation» — модел ва код Экомунники", "Lotka A.J. «Elements of Physical Biology», 1925; Volterra V., Nature 118:558, 1926; Elton C., Nicholson M., J. Anim. Ecol. 11:215, 1942 (циклы рыси и зайца); идея: PhET «Natural Selection» и NetLogo «Wolf Sheep Predation» — модель и код Экомуна", "Lotka A.J. “Elements of Physical Biology”, 1925; Volterra V., Nature 118:558, 1926; Elton C., Nicholson M., J. Anim. Ecol. 11:215, 1942 (lynx–hare cycles); idea: PhET “Natural Selection” and NetLogo “Wolf Sheep Predation” — Ekomun's own model and code"),
    view: { bg: "#d9f99d", d: 9, ph: 1.0, th: 0.6, target: [0, 0.4, 0], minD: 4, maxD: 16 },
    quiz: [
      { q: t3("Модельда ўлжанинг мувозанат сони нимага боғлиқ?", "От чего зависит равновесная численность жертвы в модели?", "What sets the prey equilibrium in the model?"), o: [t3("x* = γ/δ — йиртқичнинг ўлими ва овдан фойда", "x* = γ/δ — смертность хищника и польза от охоты", "x* = γ/δ — predator death rate and hunting gain"), t3("Фақат ўлжанинг кўпайиш тезлигига", "Только от скорости размножения жертвы", "Only the prey birth rate"), t3("Ҳеч нарсага", "Ни от чего", "Nothing")], a: 0, w: t3("Қизиқ натижа: ўлжа мувозанати йиртқич параметрларига боғлиқ, йиртқич мувозанати эса y* = α/β — ўлжаникига.", "Любопытно: равновесие жертвы зависит от параметров хищника, а хищника y* = α/β — от параметров жертвы.", "A curious result: prey equilibrium depends on predator parameters, and the predator's y* = α/β on the prey's.") }
    ],
    build(v, ui) {
      const T = THREE, S = { a: 1.0, b: 0.02, g: 0.6, d: 0.01, x: 40, y: 15, t: 0, hist: [], alive: 0 };
      ui.goals = stage() === "uni" ? [
        { id: "eq", t: t3("Популяцияларни мувозанат нуқтасига яқин ушланг (тебраниш кичик)", "Удержите популяции у точки равновесия (малые колебания)", "Hold populations near equilibrium (small swings)"), ok: () => S.hist.length > 40 && (() => { const xs = S.hist.slice(-40).map((h) => h[1]); return Math.max(...xs) - Math.min(...xs) < 10; })() },
        { id: "cyc", t: t3("Камида 3 та тўлиқ циклни кузатинг (30 йил)", "Пронаблюдайте не менее 3 циклов (30 лет)", "Watch at least 3 full cycles (30 years)"), ok: () => S.t > 30 }
      ] : [
        { id: "live", t: t3("Тулки ва қуёнларни 20 йил давомида сақлаб қолинг", "Сохраните лис и зайцев 20 лет", "Keep both foxes and rabbits alive for 20 years"), ok: () => S.alive > 20 }
      ];
      const ground = new T.Mesh(new T.CircleGeometry(5, 48), mat(0x84cc16)); ground.rotation.x = -Math.PI / 2; v.scene.add(ground);
      for (let i = 0; i < 18; i++) { const a = i / 18 * 6.28, r = 4 + Math.random() * 0.6; const tr = new T.Mesh(new T.ConeGeometry(0.35, 1.1, 8), mat(0x15803d)); tr.position.set(Math.cos(a) * r, 0.55, Math.sin(a) * r); v.scene.add(tr); }
      const rabM = mat(0xf8fafc), foxM = mat(0xea580c);
      const mkR = () => { const g = new T.Group(); const b = new T.Mesh(new T.SphereGeometry(0.12, 10, 8), rabM); b.scale.set(1.2, 0.9, 1); g.add(b); const e1 = new T.Mesh(new T.CylinderGeometry(0.02, 0.025, 0.16, 6), rabM); e1.position.set(0.08, 0.15, 0.03); g.add(e1); const e2 = e1.clone(); e2.position.z = -0.03; g.add(e2); return g; };
      const mkF = () => { const g = new T.Group(); const b = new T.Mesh(new T.ConeGeometry(0.14, 0.42, 10), foxM); b.rotation.z = Math.PI / 2; g.add(b); const tl = new T.Mesh(new T.ConeGeometry(0.06, 0.25, 8), mat(0xffffff)); tl.rotation.z = -Math.PI / 2; tl.position.x = -0.3; g.add(tl); const hd = new T.Mesh(new T.SphereGeometry(0.09, 10, 8), foxM); hd.position.set(0.24, 0.06, 0); g.add(hd); [-0.04, 0.04].forEach((z) => { const ear = new T.Mesh(new T.ConeGeometry(0.03, 0.08, 6), foxM); ear.position.set(0.24, 0.16, z); g.add(ear); }); const ns = new T.Mesh(new T.SphereGeometry(0.02, 6, 5), mat(0x111827)); ns.position.set(0.33, 0.05, 0); g.add(ns); return g; };
      const MAXR = 120, MAXF = 50;
      const rabs = Array.from({ length: MAXR }, () => { const m = mkR(); m.userData = { a: Math.random() * 6.28, r: Math.random() * 3.6, p: Math.random() * 6 }; v.scene.add(m); return m; });
      const foxes = Array.from({ length: MAXF }, () => { const m = mkF(); m.userData = { a: Math.random() * 6.28, r: Math.random() * 3.4, p: Math.random() * 6 }; v.scene.add(m); return m; });
      const lbl = liveLabel(v, [0, 2.6, 0], "#14532d", 0.4);
      const f = (x, y) => [S.a * x - S.b * x * y, S.d * x * y - S.g * y];
      const step = (h) => {
        const [k1x, k1y] = f(S.x, S.y), [k2x, k2y] = f(S.x + h / 2 * k1x, S.y + h / 2 * k1y), [k3x, k3y] = f(S.x + h / 2 * k2x, S.y + h / 2 * k2y), [k4x, k4y] = f(S.x + h * k3x, S.y + h * k3y);
        S.x = Math.max(0, S.x + h / 6 * (k1x + 2 * k2x + 2 * k3x + k4x)); S.y = Math.max(0, S.y + h / 6 * (k1y + 2 * k2y + 2 * k3y + k4y));
        if (S.x < 0.5) S.x = 0; if (S.y < 0.5) S.y = 0;
      };
      let acc = 0, pa = 0;
      v.updaters.push((dt, t) => {
        /* 1 сония = 1 йил (вақт тугмалари билан тезлаштириш ёки секинлаштириш мумкин) */
        const yrs = dt;
        for (let i = 0; i < 10; i++) step(yrs / 10);
        S.t += yrs; if (S.x > 0 && S.y > 0) S.alive += yrs;
        acc += yrs;
        if (acc > 0.2) { acc = 0; S.hist.push([+S.t.toFixed(2), S.x, S.y]); if (S.hist.length > 240) S.hist.shift(); }
        const nr = Math.min(MAXR, Math.round(S.x)), nf = Math.min(MAXF, Math.round(S.y));
        rabs.forEach((m, i) => { m.visible = i < nr; if (!m.visible) return; const u = m.userData; u.a += dt * 0.3; m.position.set(Math.cos(u.a) * u.r, 0.1 + Math.abs(Math.sin(t * 6 + u.p)) * 0.12, Math.sin(u.a) * u.r); m.rotation.y = -u.a; });
        foxes.forEach((m, i) => { m.visible = i < nf; if (!m.visible) return; const u = m.userData; u.a -= dt * 0.45; m.position.set(Math.cos(u.a) * u.r, 0.14, Math.sin(u.a) * u.r); m.rotation.y = -u.a + Math.PI; });
        lbl(`🐇 ${Math.round(S.x)} · 🦊 ${Math.round(S.y)} · ${Math.floor(S.t)} ${L(t3("йил", "лет", "yr"))}`);
        pa += dt; if (pa > 0.5) { pa = 0; const o = ui.el.querySelector("[data-out]"); if (o) o.innerHTML = outH(); }
      });
      const outH = () => {
        const uni = stage() === "uni";
        const ch = chartSvg([{ pts: S.hist.map((h) => [h[0], h[1]]), c: "#64748b" }, { pts: S.hist.map((h) => [h[0], h[2]]), c: "#ea580c" }], { xl: L(t3("Вақт, йил", "Время, лет", "Time, years")), yl: L(t3("Сони", "Численность", "Count")), y0: 0 });
        const dead = S.x === 0 ? t3("🐇 Қуёнлар йўқолди — тулкилар ҳам очликдан қирилади.", "🐇 Зайцы исчезли — лисы тоже вымрут от голода.", "🐇 Rabbits are gone — foxes will starve too.") : S.y === 0 ? t3("🦊 Тулкилар йўқолди — қуёнлар назоратсиз кўпаймоқда (ҳақиқатда ўт тугаб, ҳалокат бошланади).", "🦊 Лисы исчезли — зайцы размножаются бесконтрольно (в реальности кончится трава и придёт крах).", "🦊 Foxes are gone — rabbits grow unchecked (in reality the grass runs out and a crash follows).") : null;
        return `${ch}<p class="small"><span style="color:#64748b">━ 🐇</span> · <span style="color:#ea580c">━ 🦊</span>${dead ? `<br><b>${H(dead)}</b>` : ""}</p>${uni ? `<div class="lab-formula">dx/dt = αx − βxy · dy/dt = δxy − γy<br>x* = γ/δ = <b>${fmt(S.g / S.d, 0)}</b> · y* = α/β = <b>${fmt(S.a / S.b, 0)}</b></div>` : ""}`;
      };
      ui.read = () => ({ p: `α ${S.a}; β ${S.b}; γ ${S.g}; δ ${S.d}`, r: `🐇 ${Math.round(S.x)} · 🦊 ${Math.round(S.y)}`, x: +S.t.toFixed(1), y: S.x, xl: L(t3("Вақт, йил", "Время, лет", "Time, years")), yl: "🐇" });
      ui.html = () => {
        const uni = stage() === "uni";
        const btns = `<div class="lab-opts"><button type="button" class="sg-opt" data-act="r"><span class="e" aria-hidden="true">🐇</span>+10 ${H(t3("қуён", "зайцев", "rabbits"))}</button><button type="button" class="sg-opt" data-act="f"><span class="e" aria-hidden="true">🦊</span>+5 ${H(t3("тулки", "лис", "foxes"))}</button><button type="button" class="sg-opt" data-act="h"><span class="e" aria-hidden="true">🏹</span>${H(t3("Ов: тулкилар −50 %", "Охота: лисы −50 %", "Hunt: foxes −50 %"))}</button><button type="button" class="sg-opt" data-act="z"><span class="e" aria-hidden="true">↺</span>${H(t3("Қайтадан", "Заново", "Restart"))}</button></div>`;
        return `${btns}${uni ? rngH("a", "α " + H(t3("қуён кўпайиши", "рождаемость зайцев", "rabbit birth rate")), S.a, 0.4, 1.6, 0.05, S.a) + rngH("b", "β " + H(t3("овланиш", "поедание", "predation")), S.b, 0.005, 0.05, 0.005, S.b) + rngH("g", "γ " + H(t3("тулки ўлими", "смертность лис", "fox death rate")), S.g, 0.2, 1.2, 0.05, S.g) + rngH("d", "δ " + H(t3("овдан фойда", "польза от охоты", "hunting gain")), S.d, 0.002, 0.03, 0.001, S.d) : ""}
          <div data-out>${outH()}</div>
          ${uni ? "" : `<p class="l3-mission" data-star>${H(TX.mission)}: ${H(t3("Тулки ва қуёнларни 20 йил сақлаб қолинг (вақт тугмаларидан фойдаланинг).", "Сохраните лис и зайцев 20 лет (используйте кнопки времени).", "Keep foxes and rabbits alive for 20 years (use the time buttons)."))}</p>`}`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
          const k = b.dataset.act;
          if (k === "r") S.x += 10; if (k === "f") S.y += 5; if (k === "h") S.y *= 0.5;
          if (k === "z") Object.assign(S, { x: 40, y: 15, t: 0, hist: [], alive: 0 });
        }));
        liveBind(el, S, (k, val) => val, outH);
      };
      v.updaters.push(() => { if (stage() !== "uni" && S.alive > 20) star("yirtqich", ui.el.querySelector("[data-star]")); });
      ui.task = () => ({ q: t3("α = 1, β = 0,02, γ = 0,6, δ = 0,01 бўлса, қуёнларнинг мувозанат сони x* қанча?", "При α = 1, β = 0,02, γ = 0,6, δ = 0,01 какова равновесная численность зайцев x*?", "With α = 1, β = 0.02, γ = 0.6, δ = 0.01, what is the rabbit equilibrium x*?"), a: 60, tol: 0.5, unit: "", hint: t3("x* = γ/δ", "x* = γ/δ", "x* = γ/δ"), dec: 0 });
    }
  };

  const EXPS = [GH, MOLS, TANK, SOLAR, TREE, FLOT, LINE, PLUME, RIVER, PYR, WIND, PHOTO, HOUSE, AQUI, CYCL, COMPOST, AQI, ENERGY, MINA, CHEONG, PHX, LV];

  /* ---------- Бўлимни чизиш ---------- */
  /* Тажрибалар мавзу бўйича гуруҳланади (галерея) */
  const CATS = [
    ["climate", "🌍", t3("Иқлим ва энергия", "Климат и энергия", "Climate and energy"), ["issiq", "molekula", "quyosh", "shamol", "uy"]],
    ["water", "💧", t3("Сув ва тупроқ", "Вода и почва", "Water and soil"), ["tindir", "daryo", "yerosti", "ph"]],
    ["waste", "♻️", t3("Чиқинди ва ҳаво", "Отходы и воздух", "Waste and air"), ["flotatsiya", "liniya", "tutun", "siklon", "kompost"]],
    ["life", "🌿", t3("Тирик табиат", "Живая природа", "Living nature"), ["daraxt", "piramida", "fotosintez", "yirtqich"]],
    ["world", "🌐", t3("Халқаро тажриба: АҚШ, Германия, Япония, Корея", "Международный опыт: США, Германия, Япония, Корея", "International: USA, Germany, Japan, Korea"), ["aqi", "energiya", "minamata", "chhonggye"]]
  ];
  const TX2 = {
    prog: t3("Бажарилган тажрибалар", "Выполнено опытов", "Experiments completed"),
    goalsN: t3("мақсад", "целей", "goals"),
    news: t3("Янги", "Новое", "New"),
    measure: t3("Ўлчов асбоби (чизғич ва зонд)", "Измерительный инструмент (линейка и зонд)", "Measuring tool (ruler and probe)"),
    snap: t3("Расмга олиш (PNG)", "Сделать снимок (PNG)", "Take a snapshot (PNG)"),
    full: t3("Катта экран", "Во весь экран", "Full screen"),
    stereo: t3("Стерео: картон VR кўзойнак учун (телефонни ётқизинг)", "Стерео: для картонных VR-очков (поверните телефон)", "Stereo: for cardboard VR viewers (turn the phone sideways)"),
    vr: t3("VR кўзойнакда очиш (WebXR)", "Открыть в VR-очках (WebXR)", "Open in a VR headset (WebXR)"),
    stereoOn: t3("👓 Стерео режим: телефонни ётқизиб, картон VR кўзойнакка қўйинг. Саҳна ўзи айланади.", "👓 Стерео: поверните телефон и вставьте в картонные VR-очки. Сцена вращается сама.", "👓 Stereo: turn the phone sideways and place it in a cardboard viewer. The scene rotates by itself."),
    vrFail: t3("VR сессияни очиб бўлмади. Кўзойнак браузерида қайта уриниб кўринг.", "Не удалось открыть VR-сессию. Попробуйте в браузере очков.", "Could not start the VR session. Try again in the headset browser."),
    mOn: t3("📏 Ўлчов ёқилди: саҳнадаги икки нуқтани босинг — масофа ва қиймат кўрсатилади.", "📏 Измерение включено: нажмите две точки сцены — появятся расстояние и значение.", "📏 Measuring on: tap two points in the scene to see the distance and value."),
    miss: t3("Бу ерда объект йўқ — саҳнадаги жисмни босинг.", "Здесь нет объекта — нажмите на предмет сцены.", "Nothing here — tap an object in the scene."),
    dist: t3("Масофа", "Расстояние", "Distance"),
    units: t3("шартли бирлик", "усл. ед.", "units"),
    point: t3("Нуқта", "Точка", "Point"),
    goals: t3("🎯 Мақсадли топшириқлар", "🎯 Целевые задания", "🎯 Target challenges"),
    goalsSub: t3("Параметрларни ўзгартириб, ҳар бир мақсадга эришинг (+3 XP).", "Меняйте параметры и достигните каждой цели (+3 XP).", "Change the parameters to reach each goal (+3 XP)."),
    goalOk: t3("🎯 Мақсадга эришилди! +3 XP", "🎯 Цель достигнута! +3 XP", "🎯 Goal reached! +3 XP"),
    log: t3("📓 Лаборатория журнали", "📓 Лабораторный журнал", "📓 Lab notebook"),
    logAdd: t3("Ўлчовни ёзиб олиш", "Записать измерение", "Record measurement"),
    logCsv: t3("CSV (Excel)", "CSV (Excel)", "CSV (Excel)"),
    logClr: t3("Тозалаш", "Очистить", "Clear"),
    logEmpty: t3("Ҳали ёзув йўқ. Параметрни ўзгартиринг ва «Ўлчовни ёзиб олиш» ни босинг — 3 та ва ундан кўп ёзувдан график чизилади.", "Записей пока нет. Измените параметр и нажмите «Записать измерение» — по 3 и более записям строится график.", "No records yet. Change a parameter and press “Record measurement”; 3 or more records draw a chart."),
    logT: t3("Вақт", "Время", "Time"),
    logP: t3("Параметрлар", "Параметры", "Parameters"),
    logR: t3("Натижа", "Результат", "Result"),
    logSaved: t3("✅ Журналга ёзилди", "✅ Записано в журнал", "✅ Saved to the notebook"),
    quiz: t3("🧠 Ўзингизни синанг", "🧠 Проверьте себя", "🧠 Check yourself"),
    poe: t3("Аввал тахмин қилинг (Predict → Observe → Explain):", "Сначала предскажите (Predict → Observe → Explain):", "Predict first (Predict → Observe → Explain):"),
    poeYou: t3("Сизнинг тахминингиз қабул қилинди. Энди тажрибада текширинг ва кузатинг!", "Ваш прогноз принят. Теперь проверьте и понаблюдайте в опыте!", "Prediction saved. Now test it in the experiment and observe!"),
    poeShow: t3("Тўғри жавобни кўриш", "Показать правильный ответ", "Show the answer"),
    poeOk: t3("✅ Тахминингиз тўғри чиқди!", "✅ Ваш прогноз верен!", "✅ Your prediction was right!"),
    time: t3("Вақт бошқаруви", "Управление временем", "Time controls"),
    pause: t3("Пауза / давом эттириш", "Пауза / продолжить", "Pause / play"),
    step: t3("Бир қадам олдинга", "Шаг вперёд", "Step forward"),
    resetAll: t3("Тажрибани бошидан бошлаш", "Начать опыт заново", "Restart the experiment"),
    roomT: t3("🧪 Янги: Лаборатория хонаси", "🧪 Новое: Лабораторная комната", "🧪 New: the Lab room"),
    roomD: t3("Жавондаги 32 та модда билан ҳақиқий кимё тажрибалари: аралаштиринг, қиздиринг, pH ни ўлчанг.", "Настоящие химические опыты с 32 веществами с полки: смешивайте, нагревайте, измеряйте pH.", "Real chemistry with 32 substances from the shelf: mix, heat and measure pH."),
    roomGo: t3("Хонага кириш", "Войти в комнату", "Enter the room"),
    poeNo: t3("🤔 Тахмин бошқача эди — фан шундай ривожланади!", "🤔 Прогноз был другим — так и развивается наука!", "🤔 Your guess was different — that's how science works!")
  };
  const CAT_OF = {}; CATS.forEach(([c, , , ids]) => ids.forEach((id) => (CAT_OF[id] = c)));
  const isDone = (id) => { const f = flags(); return !!(f["l3k_" + id] || f["l3t_" + id]); };
  const NEWX = new Set(["ph", "yirtqich"]);
  let cur = EXPS[0].id, view = null, built = false, glFail = false;
  function shell() {
    const uni = stage() === "uni", exp = EXPS.find((x) => x.id === cur) || EXPS[0];
    const nDone = EXPS.filter((x) => isDone(x.id)).length, f = flags();
    const nGoal = Object.keys(f).filter((k) => k.startsWith("l3g_")).length;
    const card = (x) => `<button type="button" role="tab" aria-selected="${x.id === cur}" class="chip l3-card ${x.id === cur ? "active" : ""} ${isDone(x.id) ? "done" : ""}" data-x="${x.id}"><span class="l3-ci" aria-hidden="true">${x.icon}${x.flag ? `<sup class="l3-flag">${x.flag}</sup>` : ""}</span><span class="l3-cn">${H(x.name)}</span>${NEWX.has(x.id) ? `<em class="l3-new">${H(TX2.news)}</em>` : ""}${isDone(x.id) ? '<i class="fa-solid fa-circle-check l3-ok" aria-hidden="true"></i>' : ""}</button>`;
    const gallery = CATS.map(([c, ic, nm, ids]) => {
      const xs = ids.map((id) => EXPS.find((x) => x.id === id)).filter(Boolean);
      return xs.length ? `<div class="l3-cat"><h3 class="l3-cath"><span aria-hidden="true">${ic}</span> ${H(nm)} <small>${xs.filter((x) => isDone(x.id)).length}/${xs.length}</small></h3><div class="l3-rail" role="tablist">${xs.map(card).join("")}</div></div>` : "";
    }).join("");
    const rcl = document.documentElement.classList, stg = rcl.contains("stage-maktab") ? "maktab" : rcl.contains("stage-uni") ? "uni" : "";
    const pick = (d) => (d && d.x ? (stg === "maktab" ? d.k : stg === "uni" ? d.u : d.x) : d);
    ROOT.innerHTML = `<span class="pill">${H(stg === "maktab" ? TX.pillK : stg === "uni" ? TX.pillU : TX.pill)}</span>
      <h2 class="section-title">${H(TX.title)}</h2>
      <p class="muted">${H(uni ? TX.leadU : TX.leadK)}</p>
      <div class="l3-progress"><div><b>⭐ ${H(TX2.prog)}: ${nDone} / ${EXPS.length}</b><small>🎯 ${nGoal} ${H(TX2.goalsN)}</small></div><span class="l3-pbar"><i style="width:${Math.round((nDone / EXPS.length) * 100)}%"></i></span></div>
      <details class="l3-guide" ${guideOpen() ? "open" : ""}><summary><b>${H(HOWT.guide)}</b></summary>
        <ol class="l3-steps">${GUIDE.map(([ic, t, d]) => `<li><i class="fa-solid ${ic}" aria-hidden="true"></i><b>${H(t)}</b><small>${H(pick(d))}</small></li>`).join("")}</ol>
      </details>
      <a class="l3-room" href="#labxona"><span aria-hidden="true">🧪</span><div><b>${H(TX2.roomT)}</b><small>${H(TX2.roomD)}</small></div><em>${H(TX2.roomGo)} →</em></a>
      <div class="l3-gallery lab-tabs">${gallery}</div>
      <div class="lab-stage l3-stage">
        <p class="lab-q">${exp.icon} ${H(exp.name)} · 🤔 ${H(exp.q)}</p>
        ${poeHtml(exp)}
        ${howHtml(uni)}
        <div class="l3-row">
          <div class="l3-viewbox">
            <div class="l3-view" data-view><p class="l3-load">${H(TX.load)}</p></div>
            <div class="l3-tools">
              <button type="button" class="l3-tb" data-tool="auto" title="${H(TX.rot)}" aria-label="${H(TX.rot)}"><i class="fa-solid fa-rotate"></i></button>
              <button type="button" class="l3-tb" data-tool="in" title="${H(TX.zin)}" aria-label="${H(TX.zin)}"><i class="fa-solid fa-plus"></i></button>
              <button type="button" class="l3-tb" data-tool="out" title="${H(TX.zout)}" aria-label="${H(TX.zout)}"><i class="fa-solid fa-minus"></i></button>
              <button type="button" class="l3-tb" data-tool="home" title="${H(TX.reset)}" aria-label="${H(TX.reset)}"><i class="fa-solid fa-house"></i></button>
              <button type="button" class="l3-tb" data-tool="measure" title="${H(TX2.measure)}" aria-label="${H(TX2.measure)}" aria-pressed="false"><i class="fa-solid fa-ruler"></i></button>
              <button type="button" class="l3-tb" data-tool="snap" title="${H(TX2.snap)}" aria-label="${H(TX2.snap)}"><i class="fa-solid fa-camera"></i></button>
              <button type="button" class="l3-tb" data-tool="full" title="${H(TX2.full)}" aria-label="${H(TX2.full)}" aria-pressed="false"><i class="fa-solid fa-expand"></i></button>
              <button type="button" class="l3-tb" data-tool="stereo" title="${H(TX2.stereo)}" aria-label="${H(TX2.stereo)}" aria-pressed="false"><i class="fa-solid fa-glasses"></i></button>
              <button type="button" class="l3-tb" data-tool="vr" title="${H(TX2.vr)}" aria-label="${H(TX2.vr)}" aria-pressed="false" hidden><i class="fa-solid fa-vr-cardboard"></i></button>
            </div>
            <div class="l3-time" role="group" aria-label="${H(TX2.time)}">
              <button type="button" class="l3-tm" data-time="play" aria-pressed="true" title="${H(TX2.pause)}" aria-label="${H(TX2.pause)}"><i class="fa-solid fa-pause"></i></button>
              <button type="button" class="l3-tm" data-time="step" title="${H(TX2.step)}" aria-label="${H(TX2.step)}" disabled><i class="fa-solid fa-forward-step"></i></button>
              <span class="l3-spd">${[0.25, 0.5, 1, 2].map((k) => `<button type="button" class="l3-tm ${k === 1 ? "on" : ""}" data-spd="${k}" aria-pressed="${k === 1}">${String(k).replace("0.", lang() === "en" ? "0." : "0,")}×</button>`).join("")}</span>
              <button type="button" class="l3-tm l3-rst" data-time="reset" title="${H(TX2.resetAll)}" aria-label="${H(TX2.resetAll)}"><i class="fa-solid fa-arrow-rotate-left"></i></button>
            </div>
            <p class="l3-readout" data-readout aria-live="polite" hidden></p>
            <p class="small muted l3-hint">${H(TX.hint)}</p>
          </div>
          <div class="lab-ctl l3-panel" data-panel></div>
        </div>
        <div class="l3-goals" data-goals hidden></div>
        <details class="l3-log" data-log><summary><b>${H(TX2.log)}</b> <span class="l3-logn" data-logn></span></summary><div data-logbody></div></details>
        ${exp.quiz ? `<details class="l3-quiz"><summary><b>${H(TX2.quiz)}</b> <small>(${exp.quiz.length})</small></summary><div data-quiz></div></details>` : ""}
        <p class="small muted lab-src">${H(TX.src)}${esc(L(exp.src))}</p>
        ${uni ? `<div class="lab-task" data-task></div>` : ""}
      </div>
      <details class="fin-card say-method" style="margin-top:18px">
        <summary><span class="fin-flag" aria-hidden="true">🧊</span><b>${H(TX.method)}</b></summary>
        <div class="fin-grid">${METHODS.filter(([, t]) => !t.st || !stg || t.st === stg).map(([i, t, d]) => `<div class="fin-item"><span aria-hidden="true">${i}</span><div><b>${H(t)}</b><small>${H(d)}</small></div></div>`).join("")}</div>
      </details>`;
    ROOT.querySelectorAll("[data-x]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.x !== cur) { cur = b.dataset.x; mount(); const st = ROOT.querySelector(".l3-stage"); if (st && st.scrollIntoView && innerWidth < 900) st.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); } }));
    const act = ROOT.querySelector(".l3-card.active");
    if (act && act.parentElement.scrollTo) act.parentElement.scrollLeft = Math.max(0, act.offsetLeft - 40);
    const gd = ROOT.querySelector(".l3-guide");
    if (gd) gd.addEventListener("toggle", () => { try { localStorage.setItem(GKEY, gd.open ? "1" : "0"); } catch (e) { /* ignore */ } });
    bindPoe(exp);
  }

  /* Йўриқнома: биринчи марта очиқ, кейин фойдаланувчи танлови эсда қолади */
  const GKEY = "ekotalim:l3guide";
  const guideOpen = () => { try { return localStorage.getItem(GKEY) !== "0"; } catch (e) { return true; } };
  function howHtml(uni) {
    const h = HOW[cur]; if (!h) return "";
    return `<details class="l3-how" open><summary><b>${H(HOWT.title)}</b></summary>
      <ol>${(uni ? h.u : h.k).map((x) => `<li>${H(x)}</li>`).join("")}</ol>
      ${uni ? "" : `<p class="small muted">${H(HOWT.teach)}</p>`}
    </details>`;
  }

  /* POE (Predict–Observe–Explain, White & Gunstone, 1992): аввал тахмин, кейин тажриба */
  const POE = {};
  function poeHtml(exp) {
    if (!exp.poe) return "";
    const g = POE[exp.id];
    return `<div class="l3-poe" data-poe><small>${H(TX2.poe)}</small><div class="l3-poe-o">${exp.poe.o.map((o, i) => `<button type="button" class="sg-opt ${g && g.i === i ? "sel" : ""} ${g && g.show && i === exp.poe.a ? "right" : ""}" data-poe-i="${i}" ${g ? "disabled" : ""}>${H(o)}</button>`).join("")}</div>
      ${g ? `<p class="small">${g.show ? `${H(g.i === exp.poe.a ? TX2.poeOk : TX2.poeNo)} ${H(exp.poe.w)}` : `${H(TX2.poeYou)} <button type="button" class="linklike" data-poe-show>${H(TX2.poeShow)}</button>`}</p>` : ""}</div>`;
  }
  function bindPoe(exp) {
    const box = ROOT.querySelector("[data-poe]"); if (!box) return;
    const re = () => { box.outerHTML = poeHtml(exp); bindPoe(exp); };
    box.querySelectorAll("[data-poe-i]").forEach((b) => b.addEventListener("click", () => { POE[exp.id] = { i: +b.dataset.poeI }; re(); }));
    const sh = box.querySelector("[data-poe-show]");
    if (sh) sh.addEventListener("click", () => { POE[exp.id].show = true; re(); });
  }

  /* ---------- Мақсадли топшириқлар (Labster ва Gizmos услубида) ---------- */
  function goalsTick(ui) {
    const box = ROOT.querySelector("[data-goals]");
    if (!box) return;
    const gs = (ui.goals || []).filter(Boolean);
    if (!gs.length) { box.hidden = true; return; }
    box.hidden = false;
    const f = flags();
    let changed = false;
    gs.forEach((g) => { let ok = false; try { ok = !!g.ok(); } catch (e) { /* ignore */ } if (ok && !f["l3g_" + cur + "_" + g.id]) { once("l3g_" + cur + "_" + g.id, 3, TX.why); changed = true; } });
    const html = `<h4>${H(TX2.goals)}</h4><p class="small muted">${H(TX2.goalsSub)}</p><ul>${gs.map((g) => { const d = !!flags()["l3g_" + cur + "_" + g.id]; return `<li class="${d ? "ok" : ""}"><i class="fa-${d ? "solid fa-circle-check" : "regular fa-circle"}" aria-hidden="true"></i><span>${H(g.t)}</span></li>`; }).join("")}</ul>${changed ? `<p class="small l3-goal-ok" role="status">${H(TX2.goalOk)}</p>` : ""}`;
    if (box.dataset.h !== html) { box.innerHTML = html; box.dataset.h = html; }
  }

  /* ---------- Лаборатория журнали: ўлчовлар, жадвал, график, CSV ---------- */
  const LOGK = "ekotalim:l3log";
  const logGet = () => { try { const a = JSON.parse(localStorage.getItem(LOGK) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  const logSet = (a) => { try { localStorage.setItem(LOGK, JSON.stringify(a.slice(-400))); } catch (e) { /* ignore */ } };
  const num = (s) => { const m = String(s || "").replace(/\s/g, "").replace(",", ".").match(/[−-]?\d+(\.\d+)?(e[−-]?\d+)?/i); return m ? parseFloat(m[0].replace("−", "-")) : NaN; };
  function readNow(ui) {
    if (ui.read) { try { return ui.read(); } catch (e) { /* ignore */ } }
    const panel = ui.el, labs = [...panel.querySelectorAll("label")].filter((l) => l.querySelector("input[type=range],select"));
    const p = labs.map((l) => l.textContent.replace(/\s+/g, " ").trim()).join("; ");
    const firstR = panel.querySelector("input[type=range]");
    const big = panel.querySelector(".l3-big b"), fb = [...panel.querySelectorAll(".lab-formula b")].pop();
    const r = (big || fb) ? (big || fb).textContent.trim() : "";
    const xl = labs[0] ? labs[0].textContent.split(":")[0].trim() : "";
    return { p: p || "—", r: r || "—", x: firstR ? +firstR.value : NaN, y: num(r), xl, yl: "" };
  }
  function logChart(rows) {
    const pts = rows.filter((r) => isFinite(r.x) && isFinite(r.y));
    if (pts.length < 3) return "";
    return chartSvg([{ pts: pts.map((r) => [r.x, r.y]).sort((a, b) => a[0] - b[0]), c: "#0891b2", dots: true }], { xl: pts[pts.length - 1].xl, yl: pts[pts.length - 1].yl });
  }
  function logRender(ui) {
    const body = ROOT.querySelector("[data-logbody]"), n = ROOT.querySelector("[data-logn]");
    if (!body) return;
    const all = logGet(), rows = all.filter((r) => r.e === cur);
    if (n) n.textContent = rows.length ? `(${rows.length})` : "";
    body.innerHTML = `<div class="ev-tools"><button type="button" class="btn btn-primary btn-sm" data-log-add><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> ${H(TX2.logAdd)}</button>
        ${rows.length ? `<button type="button" class="btn btn-ghost btn-sm" data-log-csv><i class="fa-solid fa-file-csv" aria-hidden="true"></i> ${H(TX2.logCsv)}</button><button type="button" class="btn btn-ghost btn-sm" data-log-clr>${H(TX2.logClr)}</button>` : ""}</div>
      ${rows.length ? `<div class="ly-rtable"><table class="l3-tbl"><tr><th>#</th><th>${H(TX2.logT)}</th><th>${H(TX2.logP)}</th><th>${H(TX2.logR)}</th></tr>${rows.slice(-12).map((r, i) => `<tr><td>${rows.length > 12 ? rows.length - 12 + i + 1 : i + 1}</td><td>${esc(new Date(r.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}</td><td class="l3-logp">${esc(r.p)}</td><td><b>${esc(r.r)}</b></td></tr>`).join("")}</table></div>${logChart(rows)}` : `<p class="small muted">${H(TX2.logEmpty)}</p>`}
      <p class="small" data-log-msg aria-live="polite"></p>`;
    body.querySelector("[data-log-add]").addEventListener("click", () => {
      const r = readNow(ui), a = logGet();
      a.push({ e: cur, t: Date.now(), p: r.p, r: r.r, x: r.x, y: r.y, xl: r.xl || "", yl: r.yl || "" });
      logSet(a); logRender(ui);
      const m = ROOT.querySelector("[data-log-msg]"); if (m) m.textContent = L(TX2.logSaved);
      if (logGet().filter((x) => x.e === cur).length >= 3) once("l3j_" + cur, 3, TX.why);
    });
    const csv = body.querySelector("[data-log-csv]");
    if (csv) csv.addEventListener("click", () => {
      const q = (s) => '"' + String(s).replace(/"/g, '""') + '"';
      const exp = EXPS.find((x) => x.id === cur);
      const text = "﻿" + [[L(TX2.logT), L(TX2.logP), L(TX2.logR)].map(q).join(";")].concat(rows.map((r) => [new Date(r.t).toLocaleString(), r.p, r.r].map(q).join(";"))).join("\r\n");
      download(new Blob([text], { type: "text/csv;charset=utf-8" }), "Ekomun-3D-" + exp.id + ".csv");
    });
    const clr = body.querySelector("[data-log-clr]");
    if (clr) clr.addEventListener("click", () => { logSet(logGet().filter((r) => r.e !== cur)); logRender(ui); });
  }
  function download(blob, name) {
    const a = document.createElement("a");
    a.download = name; a.href = URL.createObjectURL(blob); a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 20000);
  }

  /* ---------- Тест саволлари ---------- */
  function quizRender(exp) {
    const box = ROOT.querySelector("[data-quiz]"); if (!box || !exp.quiz) return;
    box.innerHTML = exp.quiz.map((q, i) => `<div class="exam-q" data-qi="${i}"><p><b>${i + 1}.</b> ${H(q.q)}</p><div class="exam-opts">${q.o.map((o, j) => `<button type="button" class="sg-opt" data-j="${j}">${H(o)}</button>`).join("")}</div><p class="small" data-qw></p></div>`).join("");
    box.querySelectorAll("[data-qi]").forEach((qb) => {
      const i = +qb.dataset.qi, q = exp.quiz[i];
      qb.querySelectorAll("[data-j]").forEach((b) => b.addEventListener("click", () => {
        const j = +b.dataset.j, ok = j === q.a;
        qb.querySelectorAll("[data-j]").forEach((x) => { x.disabled = true; if (+x.dataset.j === q.a) x.classList.add("right"); });
        if (!ok) b.classList.add("wrong");
        qb.classList.add(ok ? "ok" : "bad");
        qb.querySelector("[data-qw]").textContent = (ok ? "✅ " : "❌ ") + L(q.w);
        if (ok) once("l3q_" + exp.id + "_" + i, 2, TX.why);
      }));
    });
  }

  /* ---------- Кичик SVG график (журнал ва тажрибалар учун) ---------- */
  function chartSvg(series, o = {}) {
    const W = 320, Hh = 170, pl = 44, pr = 10, pt = 10, pb = 30;
    const all = series.flatMap((s) => s.pts).filter((p) => isFinite(p[0]) && isFinite(p[1]));
    if (!all.length) return "";
    let x0 = o.x0 ?? Math.min(...all.map((p) => p[0])), x1 = o.x1 ?? Math.max(...all.map((p) => p[0]));
    let y0 = o.y0 ?? Math.min(0, ...all.map((p) => p[1])), y1 = o.y1 ?? Math.max(...all.map((p) => p[1]));
    if (x1 === x0) x1 = x0 + 1; if (y1 === y0) y1 = y0 + 1;
    const lx = (x) => (o.logx ? Math.log10(x) : x);
    const X = (x) => pl + ((lx(x) - lx(x0)) / (lx(x1) - lx(x0))) * (W - pl - pr), Y = (y) => Hh - pb - ((y - y0) / (y1 - y0)) * (Hh - pt - pb);
    const tk = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
    const xt = o.logx ? [0.1, 1, 10, 100, 1000].filter((v) => v >= x0 && v <= x1) : tk(x0, x1, 4);
    const grid = tk(y0, y1, 4).map((v) => `<line x1="${pl}" x2="${W - pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="currentColor" stroke-opacity=".15"/><text x="${pl - 4}" y="${Y(v) + 3}" text-anchor="end" font-size="9" fill="currentColor">${fmt(v, Math.abs(y1 - y0) < 5 ? 1 : 0)}</text>`).join("")
      + xt.map((v) => `<text x="${X(v)}" y="${Hh - pb + 12}" text-anchor="middle" font-size="9" fill="currentColor">${fmt(v, Math.abs(x1 - x0) < 5 ? 1 : 0)}</text>`).join("");
    const lines = series.map((s) => {
      const d = s.pts.filter((p) => isFinite(p[1])).map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(clamp(p[1], y0, y1)).toFixed(1)}`).join("");
      return `<path d="${d}" fill="none" stroke="${s.c}" stroke-width="2.2" ${s.dash ? 'stroke-dasharray="5 4"' : ""}/>` + (s.dots ? s.pts.map((p) => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3" fill="${s.c}"/>`).join("") : "");
    }).join("");
    const mk = o.mark ? `<line x1="${X(o.mark[0])}" x2="${X(o.mark[0])}" y1="${pt}" y2="${Hh - pb}" stroke="#f59e0b" stroke-dasharray="3 3"/><circle cx="${X(o.mark[0])}" cy="${Y(clamp(o.mark[1], y0, y1))}" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>` : "";
    const bands = (o.bands || []).map(([a, b, c]) => `<rect x="${pl}" width="${W - pl - pr}" y="${Y(Math.min(b, y1))}" height="${Math.max(0, Y(Math.max(a, y0)) - Y(Math.min(b, y1)))}" fill="${c}" opacity=".14"/>`).join("");
    return `<svg class="lab-chart l3-chart" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${esc(o.yl || "")}">${bands}${grid}${lines}${mk}<text x="${(W + pl) / 2}" y="${Hh - 4}" text-anchor="middle" font-size="10" fill="currentColor">${esc(o.xl || "")}</text><text x="10" y="${(Hh - pb) / 2}" font-size="10" fill="currentColor" transform="rotate(-90 10 ${(Hh - pb) / 2})" text-anchor="middle">${esc(o.yl || "")}</text></svg>`;
  }

  /* ---------- Ўлчов асбоби: чизғич (2 нуқта) ва зонд (нуқтадаги қиймат) ---------- */
  function setupMeasure(exp, ui) {
    const M = { on: false, pts: [], objs: [] }, T = THREE;
    const out = ROOT.querySelector("[data-readout]");
    const say = (t) => { if (!out) return; out.hidden = !t; out.textContent = t || ""; };
    const clear = () => { M.objs.forEach((o) => { view.scene.remove(o); if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); M.objs = []; M.pts = []; };
    const add = (o) => { o.userData.noPick = true; o.renderOrder = 12; view.scene.add(o); M.objs.push(o); };
    const unitM = () => (ui.unit ? ui.unit() : exp.view && exp.view.unit) || 0;
    view.tool = (e) => {
      if (!M.on) return false;
      const h = view.pick(e);
      if (!h) { say(L(TX2.miss)); return true; }
      if (M.pts.length >= 2) clear();
      const p = h.point.clone(); M.pts.push(p);
      const r = 0.011 * view.d;
      const dot = new T.Mesh(new T.SphereGeometry(r, 14, 10), new T.MeshBasicMaterial({ color: 0xfacc15, depthTest: false, transparent: true }));
      dot.position.copy(p); add(dot);
      let txt = "";
      if (ui.probe) { try { txt = ui.probe(p, h.object) || ""; } catch (err) { txt = ""; } }
      if (M.pts.length === 2) {
        const a = M.pts[0], b = M.pts[1], u = unitM(), dd = a.distanceTo(b);
        const ln = new T.Line(new T.BufferGeometry().setFromPoints([a, b]), new T.LineBasicMaterial({ color: 0xfacc15, depthTest: false, transparent: true }));
        add(ln);
        const ds = u ? (dd * u >= 1000 ? fmt(dd * u / 1000, 2) + " km" : fmt(dd * u, dd * u < 10 ? 2 : 1) + " m") : fmt(dd, 2) + " " + L(TX2.units);
        const sp = textSprite(ds, "#fde047", 0.04 * view.d); sp.position.copy(a).add(b).multiplyScalar(0.5); sp.position.y += r * 2; add(sp);
        txt = "📏 " + L(TX2.dist) + ": " + ds + (txt ? " · " + txt : "");
      } else if (!txt) {
        const u = unitM();
        txt = "📍 " + L(TX2.point) + (u ? `: x = ${fmt(p.x * u, 1)} m, y = ${fmt(p.y * u, 1)} m, z = ${fmt(p.z * u, 1)} m` : `: (${fmt(p.x, 2)}; ${fmt(p.y, 2)}; ${fmt(p.z, 2)})`);
      } else txt = "📍 " + txt;
      say(txt);
      if (!view.running) view.render();
      return true;
    };
    return {
      toggle(btn) { M.on = !M.on; btn.classList.toggle("on", M.on); btn.setAttribute("aria-pressed", String(M.on)); if (M.on) say(L(TX2.mOn)); else { clear(); say(""); } if (!view.running) view.render(); }
    };
  }

  let mountId = 0;
  async function mount() {
    const my = ++mountId;
    if (view) { view.dispose(); view = null; }
    document.removeEventListener("keydown", escFull);
    shell();
    const exp = EXPS.find((x) => x.id === cur);
    const panel = ROOT.querySelector("[data-panel]");
    const ui = { el: panel, html: () => "", bind: () => {}, task: null, goals: null };
    ui.render = () => { panel.innerHTML = ui.html(); ui.bind(panel); goalsTick(ui); };
    ui.check = () => goalsTick(ui);
    let gq = 0;
    panel.addEventListener("input", () => { if (!gq) gq = requestAnimationFrame(() => { gq = 0; goalsTick(ui); }); });
    panel.addEventListener("change", () => goalsTick(ui));
    const host = ROOT.querySelector("[data-view]");
    try {
      await loadThree();
      if (my !== mountId) return;
      if (glFail) throw new Error("webgl");
      view = new View(host, exp.view);
      view.canvas.setAttribute("aria-label", L(TX.view) + ": " + L(exp.name));
      const lp = host.querySelector(".l3-load"); if (lp) lp.remove();
    } catch (e) {
      if (my !== mountId) return;
      glFail = true;
      host.innerHTML = `<p class="l3-load">${H(TX.noGl)}</p>`;
      view = null;
    }
    if (view) {
      exp.build.call(exp, view, ui);
      const tools = ROOT.querySelector(".l3-tools");
      view.autoBtn = tools.querySelector('[data-tool="auto"]');
      view.syncAuto();
      const meas = setupMeasure(exp, ui);
      let tk = 0;
      view.updaters.push((dt) => { tk += dt; if (tk > 0.6) { tk = 0; goalsTick(ui); } });
      tools.addEventListener("click", (e) => {
        const b = e.target.closest("[data-tool]"); if (!b || !view) return;
        const t = b.dataset.tool;
        if (t === "auto") { view.auto = !view.auto; view.syncAuto(); }
        if (t === "in") view.zoom(0.85);
        if (t === "out") view.zoom(1.18);
        if (t === "home") view.resetView();
        if (t === "measure") meas.toggle(b);
        if (t === "snap") { try { const d = view.snapshot(); fetch(d).then((r) => r.blob()).then((bl) => download(bl, "Ekomun-3D-" + exp.id + ".png")); once("l3s_" + exp.id, 1, TX.why); } catch (err) { /* ignore */ } }
        if (t === "full") toggleFull(b);
        if (t === "stereo") {
          view.stereo = !view.stereo;
          b.setAttribute("aria-pressed", String(view.stereo)); b.classList.toggle("on", view.stereo);
          const fb = tools.querySelector('[data-tool="full"]');
          if (view.stereo && fb.getAttribute("aria-pressed") !== "true") toggleFull(fb);
          if (!view.stereo && fb.getAttribute("aria-pressed") === "true") toggleFull(fb);
          if (view.stereo) { view.auto = true; view.syncAuto(); { const a0 = App(); if (a0 && a0.toast) a0.toast(L(TX2.stereoOn)); } once("l3vr_" + exp.id, 2, TX.why); }
          view.render();
        }
        if (t === "vr") {
          view.enterXR(() => { b.setAttribute("aria-pressed", "false"); b.classList.remove("on"); })
            .then(() => { b.setAttribute("aria-pressed", "true"); b.classList.add("on"); once("l3vr_" + exp.id, 2, TX.why); })
            .catch(() => { const a0 = App(); if (a0 && a0.toast) a0.toast(L(TX2.vrFail)); });
        }
      });
      const tbar = ROOT.querySelector(".l3-time");
      if (tbar) tbar.addEventListener("click", (e) => {
        const b = e.target.closest("[data-time],[data-spd]"); if (!b || !view) return;
        if (b.dataset.spd) { view.speed = +b.dataset.spd; tbar.querySelectorAll("[data-spd]").forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", String(on)); }); return; }
        const t = b.dataset.time;
        if (t === "play") { view.paused = !view.paused; b.setAttribute("aria-pressed", String(!view.paused)); b.querySelector("i").className = "fa-solid " + (view.paused ? "fa-play" : "fa-pause"); b.classList.toggle("on", view.paused); tbar.querySelector('[data-time="step"]').disabled = !view.paused; }
        if (t === "step" && view.paused) view.stepOnce();
        if (t === "reset") mount();
      });
      /* WebXR қўллаб-қувватланса, VR тугмаси кўринади */
      if (navigator.xr && navigator.xr.isSessionSupported) {
        navigator.xr.isSessionSupported("immersive-vr").then((ok) => { const vb = tools.querySelector('[data-tool="vr"]'); if (vb) vb.hidden = !ok; }).catch(() => {});
      }
      sync();
    } else {
      /* WebGL йўқ: ҳисоблаш панели барибир ишласин */
      const stub = { scene: { add() {}, remove() {}, background: { set() {} } }, updaters: [], canvas: document.createElement("canvas"), camera: null };
      try { exp.build.call(exp, new Proxy(stub, { get: (o, k) => (k in o ? o[k] : () => {}) }), ui); } catch (e) { ui.render(); }
      ROOT.querySelector(".l3-tools").hidden = true;
    }
    if (!panel.innerHTML) ui.render();
    goalsTick(ui);
    logRender(ui);
    quizRender(exp);
    const tb = ROOT.querySelector("[data-task]");
    if (tb && ui.task) { const t = ui.task(); taskBox(tb, cur, t.q, t.a, t.tol, t.unit, t.hint, t.dec ?? 2); }
  }
  /* Катта экран: CSS орқали (WebView ва iOS да ҳам ишлайди) */
  function toggleFull(btn) {
    const vb = ROOT.querySelector(".l3-viewbox"); if (!vb) return;
    const on = !vb.classList.contains("l3-full");
    vb.classList.toggle("l3-full", on);
    document.documentElement.classList.toggle("l3-noscroll", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.querySelector("i").className = "fa-solid " + (on ? "fa-compress" : "fa-expand");
    if (on) document.addEventListener("keydown", escFull); else document.removeEventListener("keydown", escFull);
    if (view) setTimeout(() => view.resize(), 30);
  }
  function escFull(e) { if (e.key === "Escape") { const b = ROOT.querySelector('[data-tool="full"]'); if (b && b.getAttribute("aria-pressed") === "true") toggleFull(b); } }


  /* Бўлим кўринганда анимация юради, яширинса тўхтайди (батарея тежалади) */
  function visible() { return SEC.classList.contains("page-on") && !document.hidden; }
  function sync() {
    if (!visible() && view && view.stereo) { view.stereo = false; const sb = ROOT.querySelector('[data-tool="stereo"]'); if (sb) { sb.setAttribute("aria-pressed", "false"); sb.classList.remove("on"); } }
    if (!visible()) { const vb = ROOT.querySelector(".l3-viewbox.l3-full"), b = ROOT.querySelector('[data-tool="full"]'); if (vb && b) toggleFull(b); }
    if (!view) return;
    if (visible()) { view.resize(); view.start(); } else view.stop();
  }
  function onShow() {
    if (!visible()) { sync(); return; }
    if (!built) { built = true; mount(); } else sync();
  }
  new MutationObserver(onShow).observe(SEC, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", onShow);
  window.addEventListener("eko:lang", () => { if (built) mount(); else shell(); });
  window.addEventListener("eko:stage", () => { if (built) mount(); else shell(); });
  /* Синов ва ўқитувчи намойиши учун: жорий саҳна */
  window.EkoLab3D = {
    get view() { return view; },
    open: (id) => { if (EXPS.some((x) => x.id === id)) { cur = id; if (built) mount(); else shell(); } },
    ids: EXPS.map((x) => x.id),
    list: EXPS.map((x) => ({ id: x.id, icon: x.icon, flag: x.flag || "", name: x.name, q: x.q })),
    /* Бошқа 3D бўлимлар (болалар учун «3D Эко-дунё») шу кўрувчидан фойдаланади */
    lib: { loadThree: () => loadThree().then(() => THREE), View: (...a) => new View(...a), textSprite: (...a) => textSprite(...a), earthTexture: () => earthTexture() }
  };
  shell();
  onShow();
})();
