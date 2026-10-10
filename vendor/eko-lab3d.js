/* ЭкоТаълим — 🧊 3D виртуал лаборатория (мактаб ва университет).
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
    ["🧮", { uz: "Модель асосидаги таълим (Modeling Instruction)", ru: "Обучение через модели (Modeling Instruction)", en: "Modeling Instruction" }, { uz: "Университет режимида формула ва параметрлар очиқ: талаба моделни ўзи синайди ва чегараларини кўради.", ru: "В университетском режиме формулы открыты: студент сам проверяет модель и её границы.", en: "In university mode formulas are open: students test the model and its limits." }],
    ["🎮", { uz: "Ўйин орқали ўрганиш (мактаб)", ru: "Обучение через игру (школа)", en: "Game-based learning (school)" }, { uz: "Ҳар бир тажрибада юлдузли вазифа ва XP; хато қилиш мумкин, қайта уриниш бепул.", ru: "В каждом опыте задание со звездой и XP; ошибаться можно, повтор бесплатный.", en: "Every experiment has a star mission and XP; mistakes are fine, retries are free." }]
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
    piramida: {
      k: [t3("Жонзотларни тартиб билан босинг: ўсимликдан бошланг, кейин уни ким ейди?", "Нажимайте живых существ по порядку: начните с растения, а кто его ест?", "Tap the living things in order: start with the plant — who eats it?"), t3("Пирамида қаватлари қандай кичрайиб боришини кузатинг.", "Смотрите, как уменьшаются этажи пирамиды.", "Watch the pyramid floors get smaller."), t3("Сариқ учқун — энергия, қизили — иссиқлик бўлиб йўқолган энергия.", "Жёлтая искра — энергия, красная — энергия, потерянная в виде тепла.", "Yellow sparks are energy; red ones are energy lost as heat.")],
      u: [t3("Продуцентлар энергияси, экологик самарадорлик η ва поғоналар сонини беринг.", "Задайте энергию продуцентов, экологическую эффективность η и число уровней.", "Set producer energy, ecological efficiency η and the number of levels."), t3("Ҳар бир поғонадаги энергияни жадвалдан ўқинг ва иссиқлик йўқотилишини ҳисобланг.", "Читайте энергию каждого уровня в таблице и рассчитайте потери тепла.", "Read each level's energy from the table and work out the heat loss."), t3("Нега озиқ занжирлари одатда 4–5 поғонадан узун бўлмаслигини тушунтиринг; машғулотни ечинг.", "Объясните, почему пищевые цепи редко длиннее 4–5 звеньев; решите задание.", "Explain why food chains rarely exceed 4–5 links; solve the task.")]
    }
  };
  const GUIDE = [
    ["fa-hand-pointer", t3("Тажрибани танланг", "Выберите опыт", "Pick an experiment"), t3("Юқоридаги тугмалардан", "Кнопками сверху", "Using the buttons above")],
    ["fa-rotate", t3("Саҳнани айлантиринг", "Вращайте сцену", "Rotate the scene"), t3("Бармоқ ёки сичқонча билан; ＋/− яқинлаштиради", "Пальцем или мышью; ＋/− масштаб", "Finger or mouse; ＋/− to zoom")],
    ["fa-sliders", t3("Параметрни ўзгартиринг", "Меняйте параметры", "Change parameters"), t3("Ўнгдаги панелда — натижа дарров ўзгаради", "На панели справа — результат меняется сразу", "In the side panel — results update instantly")],
    ["fa-star", t3("Вазифани бажаринг", "Выполните задание", "Complete the task"), t3("Мактабда ⭐ вазифа, университетда 📝 машғулот — XP берилади", "В школе ⭐ задание, в вузе 📝 практика — даётся XP", "School ⭐ missions, university 📝 tasks — earn XP")]
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
      this.renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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
      this.running = false; this.raf = 0; this.last = 0; this.t = 0;
      this.scene.add(new T.HemisphereLight(0xffffff, 0x334155, 1.1));
      const sun = new T.DirectionalLight(0xffffff, 1.6);
      sun.position.set(5, 8, 6);
      this.scene.add(sun);
      this.bindInput();
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(host);
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
        this.moved += Math.abs(dx) + Math.abs(dy);
        this.th -= dx * 0.008;
        if (e.pointerType === "mouse") this.ph = clamp(this.ph - dy * 0.008, 0.15, 1.52);
        this.auto = false; this.syncAuto(); this.place();
      });
      const up = (e) => { pts.delete(e.pointerId); };
      c.addEventListener("pointerup", (e) => { up(e); if (this.moved < 6 && this.onTap) this.onTap(e); });
      c.addEventListener("pointercancel", up);
      c.addEventListener("wheel", (e) => { e.preventDefault(); this.zoom(e.deltaY > 0 ? 1.1 : 0.9); }, { passive: false });
      c.addEventListener("keydown", (e) => {
        const k = { ArrowLeft: [0.12, 0], ArrowRight: [-0.12, 0], ArrowUp: [0, 0.08], ArrowDown: [0, -0.08] }[e.key];
        if (k) { e.preventDefault(); this.th += k[0]; this.ph = clamp(this.ph + k[1], 0.15, 1.52); this.auto = false; this.syncAuto(); this.place(); }
        if (e.key === "+" || e.key === "=") this.zoom(0.9);
        if (e.key === "-") this.zoom(1.1);
      });
    }
    syncAuto() { if (this.autoBtn) this.autoBtn.classList.toggle("on", this.auto); }
    zoom(f) { this.d = clamp(this.d * f, this.minD, this.maxD); this.place(); }
    resetView() { Object.assign(this, { th: this.home.th, ph: this.home.ph, d: this.home.d }); this.place(); }
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
    render() { this.renderer.render(this.scene, this.camera); }
    start() {
      if (this.running) return;
      this.running = true; this.last = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        const dt = clamp((now - this.last) / 1000, 0, 0.1); this.last = now; this.t += dt;
        if (this.auto) { this.th += dt * 0.25; this.place(); }
        this.updaters.forEach((f) => f(dt, this.t));
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
      if (ok) once("l3t_" + id, 10, TX.whyU);
    };
    box.querySelector("button").addEventListener("click", go);
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
  }
  function star(id, el) {
    if (!flags()["l3k_" + id]) { once("l3k_" + id, 5, TX.why); }
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
    view: { bg: "#dbeafe", d: 6.2, ph: 1.12, th: 0.55, target: [0, 0.4, 0], minD: 3, maxD: 12 },
    kids: [
      [{ uz: "Йирик қум", ru: "Крупный песок", en: "Coarse sand" }, 200, 2650, "🏖️"],
      [{ uz: "Майда қум", ru: "Мелкий песок", en: "Fine sand" }, 60, 2650, "⏳"],
      [{ uz: "Чанг (лёсс)", ru: "Пыль (лёсс)", en: "Silt (loess)" }, 20, 2650, "🌫️"],
      [{ uz: "Гил (лой)", ru: "Глина", en: "Clay" }, 3, 2650, "🟤"]
    ],
    build(v, ui) {
      const T = THREE, S = { d: 60, rho: 2650, temp: 20, Q: 200, k: 1, coag: false, flow: 1, done: new Set() };
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

  const EXPS = [GH, MOLS, TANK, SOLAR, TREE, FLOT, LINE, PLUME, RIVER, PYR];

  /* ---------- Бўлимни чизиш ---------- */
  let cur = EXPS[0].id, view = null, built = false, glFail = false;
  function shell() {
    const uni = stage() === "uni";
    ROOT.innerHTML = `<span class="pill">${H(TX.pill)}</span>
      <h2 class="section-title">${H(TX.title)}</h2>
      <p class="muted">${H(uni ? TX.leadU : TX.leadK)}</p>
      <details class="l3-guide" ${guideOpen() ? "open" : ""}><summary><b>${H(HOWT.guide)}</b></summary>
        <ol class="l3-steps">${GUIDE.map(([ic, t, d]) => `<li><i class="fa-solid ${ic}" aria-hidden="true"></i><b>${H(t)}</b><small>${H(d)}</small></li>`).join("")}</ol>
      </details>
      <div class="filters lab-tabs" role="tablist">${EXPS.map((x) => `<button type="button" role="tab" aria-selected="${x.id === cur}" class="chip ${x.id === cur ? "active" : ""}" data-x="${x.id}">${x.icon} ${H(x.name)}</button>`).join("")}</div>
      <div class="lab-stage l3-stage">
        <p class="lab-q">🤔 ${H(EXPS.find((x) => x.id === cur).q)}</p>
        ${howHtml(uni)}
        <div class="l3-row">
          <div class="l3-viewbox">
            <div class="l3-view" data-view><p class="l3-load">${H(TX.load)}</p></div>
            <div class="l3-tools">
              <button type="button" class="l3-tb" data-tool="auto" title="${H(TX.rot)}" aria-label="${H(TX.rot)}"><i class="fa-solid fa-rotate"></i></button>
              <button type="button" class="l3-tb" data-tool="in" title="${H(TX.zin)}" aria-label="${H(TX.zin)}"><i class="fa-solid fa-plus"></i></button>
              <button type="button" class="l3-tb" data-tool="out" title="${H(TX.zout)}" aria-label="${H(TX.zout)}"><i class="fa-solid fa-minus"></i></button>
              <button type="button" class="l3-tb" data-tool="home" title="${H(TX.reset)}" aria-label="${H(TX.reset)}"><i class="fa-solid fa-house"></i></button>
            </div>
            <p class="small muted l3-hint">${H(TX.hint)}</p>
          </div>
          <div class="lab-ctl l3-panel" data-panel></div>
        </div>
        <p class="small muted lab-src">${H(TX.src)}${esc(L(EXPS.find((x) => x.id === cur).src))}</p>
        ${uni ? `<div class="lab-task" data-task></div>` : ""}
      </div>
      <details class="fin-card say-method" style="margin-top:18px">
        <summary><span class="fin-flag" aria-hidden="true">🧊</span><b>${H(TX.method)}</b></summary>
        <div class="fin-grid">${METHODS.map(([i, t, d]) => `<div class="fin-item"><span aria-hidden="true">${i}</span><div><b>${H(t)}</b><small>${H(d)}</small></div></div>`).join("")}</div>
      </details>`;
    ROOT.querySelectorAll("[data-x]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.x !== cur) { cur = b.dataset.x; mount(); } }));
    const gd = ROOT.querySelector(".l3-guide");
    if (gd) gd.addEventListener("toggle", () => { try { localStorage.setItem(GKEY, gd.open ? "1" : "0"); } catch (e) { /* ignore */ } });
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
  let mountId = 0;
  async function mount() {
    const my = ++mountId;
    if (view) { view.dispose(); view = null; }
    shell();
    const exp = EXPS.find((x) => x.id === cur);
    const panel = ROOT.querySelector("[data-panel]");
    const ui = { el: panel, html: () => "", bind: () => {}, task: null };
    ui.render = () => { panel.innerHTML = ui.html(); ui.bind(panel); };
    const host = ROOT.querySelector("[data-view]");
    try {
      await loadThree();
      if (my !== mountId) return;
      if (glFail) throw new Error("webgl");
      view = new View(host, exp.view);
      view.canvas.setAttribute("aria-label", L(TX.view) + ": " + L(exp.name));
      const lp = host.querySelector(".l3-load"); if (lp) lp.remove();
    } catch (e) {
      glFail = true;
      host.innerHTML = `<p class="l3-load">${H(TX.noGl)}</p>`;
      view = null;
    }
    if (view) {
      exp.build.call(exp, view, ui);
      const tools = ROOT.querySelector(".l3-tools");
      view.autoBtn = tools.querySelector('[data-tool="auto"]');
      view.syncAuto();
      tools.addEventListener("click", (e) => {
        const b = e.target.closest("[data-tool]"); if (!b || !view) return;
        const t = b.dataset.tool;
        if (t === "auto") { view.auto = !view.auto; view.syncAuto(); }
        if (t === "in") view.zoom(0.85);
        if (t === "out") view.zoom(1.18);
        if (t === "home") view.resetView();
      });
      sync();
    } else {
      /* WebGL йўқ: ҳисоблаш панели барибир ишласин */
      const stub = { scene: { add() {}, background: { set() {} } }, updaters: [], canvas: document.createElement("canvas"), camera: null };
      try { exp.build.call(exp, new Proxy(stub, { get: (o, k) => (k in o ? o[k] : () => {}) }), ui); } catch (e) { ui.render(); }
      ROOT.querySelector(".l3-tools").hidden = true;
    }
    if (!panel.innerHTML) ui.render();
    const tb = ROOT.querySelector("[data-task]");
    if (tb && ui.task) { const t = ui.task(); taskBox(tb, cur, t.q, t.a, t.tol, t.unit, t.hint, t.dec ?? 2); }
  }

  /* Бўлим кўринганда анимация юради, яширинса тўхтайди (батарея тежалади) */
  function visible() { return SEC.classList.contains("page-on") && !document.hidden; }
  function sync() {
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
    /* Бошқа 3D бўлимлар (болалар учун «3D Эко-дунё») шу кўрувчидан фойдаланади */
    lib: { loadThree: () => loadThree().then(() => THREE), View: (...a) => new View(...a), textSprite: (...a) => textSprite(...a), earthTexture: () => earthTexture() }
  };
  shell();
  onShow();
})();
