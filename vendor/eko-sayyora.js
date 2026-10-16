/* Экомун — 🌍 «Сайёра саломатлиги» (Planetary Health) дашборди.
   1) Сайёра чегаралари: Planetary Health Check 2025 (Потсдам иқлим институти, PIK) ва
      Richardson ва б., Science Advances, 2023 — 9 чегарадан 7 таси бузилган.
   2) Жонли кўрсаткичлар: CO₂, метан, ҳарорат аномалияси («Онлайн маълумотлар» кеши),
      Ўзбекистоннинг 14 шаҳрида ҳаво сифати (Open-Meteo · Copernicus CAMS) харитада,
      NASA EONET табиий ҳодисалари.
   3) COP иқлим музокаралари симулятори — соддалаштирилган модел (En-ROADS ғоясида).
   4) Фуқаро илми: iNaturalist, eBird, GLOBE Observer, Zooniverse ва б.
   5) Мактаб сенсори: ESP32 + DHT22 + SDS011 қўлланмаси ва CSV натижаларини график қилиш.
   Кеш: localStorage «ekotalim:net:uzaqi», ҳолат «ekotalim:sayyora». */
(() => {
  "use strict";
  const SEC = document.getElementById("sayyora");
  const ROOT = document.getElementById("syRoot");
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
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(typeof o === "string" ? o : L(o)); };
  const xpOnce = (k, n, why) => { const a = App(); if (!a || !a.addXp) return; a.state.flags = a.state.flags || {}; if (!a.state.flags[k]) { a.state.flags[k] = true; a.addXp(n, L(why)); } };
  const num = (n, d = 0) => { const s = Number(n).toFixed(d); return lang() === "en" ? s : s.replace(".", ","); };
  const online = () => navigator.onLine !== false;
  const lite = () => !!(window.EkoModes && EkoModes.lite);

  const KEY = "ekotalim:sayyora";
  let st = { tab: "dash", cop: null, best: null };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };

  const TX = {
    pill: t3("🌍 Сайёра саломатлиги · жонли мониторинг", "🌍 Здоровье планеты · живой мониторинг", "🌍 Planetary Health · live monitoring"),
    title: t3("Сайёра саломатлиги", "Здоровье планеты", "Planetary Health"),
    lead: t3("Ер сайёраси ва Ўзбекистоннинг экологик ҳолати бир жойда: илмий «сайёра чегаралари», жонли ҳаво сифати, иссиқхона газлари ва табиий ҳодисалар. Музокаралар симуляторида иқлим сиёсатини ўзингиз синаб кўринг.",
      "Экологическое состояние Земли и Узбекистана в одном месте: научные «планетарные границы», живое качество воздуха, парниковые газы и природные события. Испытайте климатическую политику в симуляторе переговоров.",
      "The state of the Earth and Uzbekistan in one place: the scientific planetary boundaries, live air quality, greenhouse gases and natural events. Try out climate policy in the negotiation simulator."),
    tabs: { dash: t3("📊 Дашборд", "📊 Дашборд", "📊 Dashboard"), cop: t3("🤝 COP симулятори", "🤝 Симулятор COP", "🤝 COP simulator"), sci: t3("🔭 Фуқаро илми", "🔭 Гражданская наука", "🔭 Citizen science"), iot: t3("📡 Мактаб сенсори", "📡 Школьный датчик", "📡 School sensor") },
    pb: t3("🧭 Сайёранинг 9 чегараси", "🧭 9 планетарных границ", "🧭 The 9 planetary boundaries"),
    pbLead: t3("Олимлар инсоният хавфсиз яшаши мумкин бўлган 9 та чегарани белгилаган. 2025 йилги ҳисоботга кўра, улардан 7 таси бузилган.", "Учёные определили 9 границ безопасного существования человечества. По отчёту 2025 года, 7 из них пройдены.", "Scientists define 9 boundaries of a safe operating space for humanity. According to the 2025 report, 7 of them have been crossed."),
    safe: t3("хавфсиз доирада", "в безопасных пределах", "within the safe zone"),
    over: t3("чегара бузилган", "граница пройдена", "boundary crossed"),
    live: t3("📈 Жонли кўрсаткичлар", "📈 Живые показатели", "📈 Live indicators"),
    co2: t3("CO₂", "CO₂", "CO₂"), ch4: t3("Метан", "Метан", "Methane"), temp: t3("Ҳарорат аномалияси", "Аномалия температуры", "Temperature anomaly"),
    safeCo2: t3("хавфсиз чегара 350 ppm", "безопасная граница 350 ppm", "safe limit 350 ppm"),
    vsBase: t3("1951–1980 га нисбатан", "к 1951–1980", "vs 1951–1980"),
    evN: t3("та фаол табиий ҳодиса (NASA)", "активных природных событий (NASA)", "active natural events (NASA)"),
    noLive: t3("Ҳали юкланмаган. Интернетга уланиб «Янгилаш» тугмасини босинг.", "Ещё не загружено. Подключитесь и нажмите «Обновить».", "Not loaded yet. Connect and tap Refresh."),
    refresh: t3("Янгилаш", "Обновить", "Refresh"),
    loading: t3("Юкланмоқда…", "Загрузка…", "Loading…"),
    saved: t3("Сақланган маълумот", "Сохранённые данные", "Saved data"),
    uz: t3("🇺🇿 Ўзбекистон: ҳаво сифати харитаси", "🇺🇿 Узбекистан: карта качества воздуха", "🇺🇿 Uzbekistan: air quality map"),
    uzLead: t3("US AQI индекси: 0–50 яхши, 51–100 ўртача, 101–150 сезгирлар учун зарарли, 150+ зарарли. Нуқтани босинг.", "Индекс US AQI: 0–50 хорошо, 51–100 умеренно, 101–150 вредно для чувствительных, 150+ вредно. Нажмите на точку.", "US AQI: 0–50 good, 51–100 moderate, 101–150 unhealthy for sensitive groups, 150+ unhealthy. Tap a dot."),
    who: t3("ЖССТ тавсияси: PM2.5 — кунлик 15 мкг/м³ дан ошмаслиги керак.", "Рекомендация ВОЗ: PM2.5 — не выше 15 мкг/м³ в сутки.", "WHO guideline: PM2.5 should not exceed 15 µg/m³ per day."),
    cop: t3("🏛 COP: охирги қарорлар", "🏛 COP: последние решения", "🏛 COP: latest decisions"),
    copItems: [
      t3("COP29 (Боку, 2024): ривожланаётган давлатлар учун иқлим молияси — 2035 йилгача йилига камида 300 млрд $, умумий мақсад — 1,3 трлн $.", "COP29 (Баку, 2024): климатическое финансирование развивающихся стран — не менее 300 млрд $ в год к 2035 году, общая цель — 1,3 трлн $.", "COP29 (Baku, 2024): climate finance for developing countries — at least $300 bn a year by 2035, with a $1.3 trillion overall goal."),
      t3("COP30 (Белен, Бразилия, 2025): мослашиш молиясини 2035 йилгача уч баробар ошириш чақириғи, тропик ўрмонлар учун «Абадий тропик ўрмонлар» фонди (TFFF).", "COP30 (Белен, Бразилия, 2025): призыв утроить финансирование адаптации к 2035 году, фонд «Тропические леса навсегда» (TFFF).", "COP30 (Belém, Brazil, 2025): a call to triple adaptation finance by 2035 and the Tropical Forest Forever Facility (TFFF)."),
      t3("COP31 (2026): Туркиянинг Анталия шаҳрида. Барча давлатлар 2035 йилгача бўлган янги миллий мақсадларини (NDC 3.0) топширмоқда.", "COP31 (2026): в Анталье, Турция. Страны представляют новые национальные цели до 2035 года (NDC 3.0).", "COP31 (2026): in Antalya, Türkiye. Countries are submitting new national targets to 2035 (NDC 3.0).")
    ],
    src: t3("Манбалар", "Источники", "Sources"),
    // COP
    simLead: t3("Сиз — COP раисисиз. Ҳар бир давлат гуруҳи 2035 йилгача чиқиндини қанча камайтиришини ва бой давлатлар қанча иқлим молияси беришини таклиф қилинг. Келишув консенсус билан қабул қилинади: биронта гуруҳ рози бўлмаса, келишув йўқ.",
      "Вы — председатель COP. Предложите, насколько каждая группа стран сократит выбросы к 2035 году и сколько климатического финансирования дадут богатые страны. Решение принимается консенсусом: если хоть одна группа против — соглашения нет.",
      "You chair the COP. Propose how much each group cuts emissions by 2035 and how much climate finance rich countries provide. Decisions need consensus: if any group objects, there is no deal."),
    cut: t3("2035 гача камайтириш", "Сокращение к 2035", "Cut by 2035"),
    share: t3("дунё чиқиндисидаги улуши", "доля мировых выбросов", "share of global emissions"),
    fin: t3("💰 Иқлим молияси (млрд $ / йил)", "💰 Климатическое финансирование (млрд $ в год)", "💰 Climate finance ($ bn / year)"),
    finD: t3("Ривожланаётган давлатлар кўпроқ молия бўлса, чуқурроқ камайтиришга рози бўлади. Донорларнинг ҳам бюджет чегараси бор.", "Развивающиеся страны соглашаются на большие сокращения при большем финансировании. У доноров тоже есть предел бюджета.", "Developing countries accept deeper cuts with more finance, but donors have budget limits too."),
    result: t3("Натижа", "Результат", "Result"),
    warm: t3("2100 йилгача исиш (тахмин)", "Потепление к 2100 году (оценка)", "Warming by 2100 (estimate)"),
    deal: t3("✅ Консенсус! Келишув қабул қилинди.", "✅ Консенсус! Соглашение принято.", "✅ Consensus! The agreement is adopted."),
    nodeal: t3("❌ Келишув йўқ — қарши:", "❌ Соглашения нет — против:", "❌ No deal — objecting:"),
    tooMuch: t3("камайтириш жуда катта", "слишком большое сокращение", "cut too deep"),
    noMoney: t3("бюджети етмайди", "не хватает бюджета", "budget exceeded"),
    pace: t3("Тўғри йўлдасиз", "Вы на верном пути", "On track"),
    g15: t3("1,5 °C — Париж келишувининг энг яхши мақсади. Музокаралар ўзи етмайди: технология, ўрмонлар ва ҳар бир инсон ҳаракати керак.", "1,5 °C — лучшая цель Парижского соглашения. Одних переговоров мало: нужны технологии, леса и действия каждого.", "1.5 °C is the Paris Agreement's best goal. Negotiations alone are not enough: technology, forests and everyone's action are needed."),
    g2: t3("2 °C дан паст — Париж келишувининг асосий мақсади бажарилди.", "Ниже 2 °C — основная цель Парижского соглашения выполнена.", "Below 2 °C — the Paris Agreement's main goal is met."),
    g3: t3("Ҳозирги сиёсат давом этса, дунё 2,8 °C га исиши мумкин (БМТ UNEP, 2025): кучли иссиқ, сув танқислиги ва музликлар эриши.", "При нынешней политике мир может нагреться на 2,8 °C (ЮНЕП ООН, 2025): жара, нехватка воды и таяние ледников.", "With current policies the world could warm by 2.8 °C (UN UNEP, 2025): heatwaves, water shortages and melting glaciers."),
    model: t3("Модел соддалаштирилган: исиш = 2,8 °C − 1,3 °C × (дунё бўйича камайтириш / 60 %). IPCC: 1,5 °C учун 2035 йилгача ≈ 60 % камайтириш керак. Ўқув мақсадида.", "Модель упрощена: потепление = 2,8 °C − 1,3 °C × (мировое сокращение / 60 %). МГЭИК: для 1,5 °C к 2035 году нужно ≈ 60 % сокращения. Для обучения.", "Simplified model: warming = 2.8 °C − 1.3 °C × (global cut / 60 %). IPCC: 1.5 °C needs ≈ 60 % cuts by 2035. For learning only."),
    gcut: t3("дунё бўйича камайтириш", "мировое сокращение", "global cut"),
    best: t3("Энг яхши натижангиз", "Ваш лучший результат", "Your best result"),
    reset: t3("Бошидан", "Сначала", "Reset"),
    xpWhy: t3("COP келишуви", "Соглашение COP", "COP agreement"),
    // фуқаро илми
    sciLead: t3("Ҳақиқий олимлар билан бирга маълумот йиғинг: кузатувларингиз халқаро илмий базаларга тушади. 13 ёшгача бўлса — ота-она ёки ўқитувчи ҳисоби орқали.", "Собирайте данные вместе с настоящими учёными: наблюдения попадают в международные научные базы. До 13 лет — через аккаунт родителя или учителя.", "Collect data with real scientists: your observations go into international science databases. Under 13 — through a parent or teacher account."),
    open: t3("Сайтни очиш", "Открыть сайт", "Open site"),
    how: t3("Қандай қатнашаман?", "Как участвовать?", "How to take part"),
    // сенсор
    iotLead: t3("Мактабда ўзингиз ҳаво сифатини ўлчанг: 15–25 $ лик плата ва датчиклардан оддий станция. Натижани CSV файл қилиб шу ерга юкланг — график ва ЖССТ меъёри билан солиштириш чиқади.", "Измерьте качество воздуха в школе сами: простая станция из платы и датчиков за 15–25 $. Загрузите результат в CSV — получите график и сравнение с нормой ВОЗ.", "Measure air quality at school yourself: a simple station from a $15–25 board and sensors. Upload the CSV here to get a chart and a WHO comparison."),
    kit: t3("🧰 Керакли қисмлар", "🧰 Что нужно", "🧰 Parts list"),
    wire: t3("🔌 Улаш схемаси", "🔌 Схема подключения", "🔌 Wiring"),
    code: t3("💻 Arduino коди (ESP32)", "💻 Код Arduino (ESP32)", "💻 Arduino code (ESP32)"),
    copy: t3("Нусха олиш", "Копировать", "Copy"),
    copied: t3("Нусха олинди", "Скопировано", "Copied"),
    safety: t3("⚠️ Хавфсизлик: фақат USB (5 В) орқали ишлатинг, симларни катталар назоратида уланг, датчикни ёмғирдан сақланг.", "⚠️ Безопасность: только питание от USB (5 В), подключайте под присмотром взрослых, берегите датчик от дождя.", "⚠️ Safety: USB (5 V) power only, wire it with an adult, keep the sensor out of the rain."),
    csv: t3("📈 CSV натижаларини юклаш", "📈 Загрузить результаты CSV", "📈 Upload CSV results"),
    csvD: t3("Сериал мониторидан нусха олинган ёки SD картадаги CSV файл. Биринчи қатор — устун номлари.", "CSV из монитора порта или с SD-карты. Первая строка — названия столбцов.", "A CSV copied from the serial monitor or saved on an SD card. The first row holds column names."),
    sample: t3("Намуна маълумот", "Пример данных", "Sample data"),
    col: t3("Кўрсаткич", "Показатель", "Measure"),
    min: t3("энг кам", "мин.", "min"), max: t3("энг кўп", "макс.", "max"), avg: t3("ўртача", "среднее", "average"),
    rows: t3("та ўлчов", "измерений", "readings"),
    overWho: t3("ЖССТ кунлик меъёридан юқори ўлчовлар", "Замеры выше суточной нормы ВОЗ", "Readings above the WHO daily guideline"),
    bad: t3("Файлда рақамли устунлар топилмади.", "В файле нет числовых столбцов.", "No numeric columns found in the file.")
  };

  /* ===================== Сайёра чегаралари ===================== */
  const PB = [
    ["🌡", t3("Иқлим ўзгариши", "Изменение климата", "Climate change"), 1],
    ["🦋", t3("Биосфера яхлитлиги", "Целостность биосферы", "Biosphere integrity"), 1],
    ["🌲", t3("Ер тизими ўзгариши (ўрмонлар)", "Изменение землепользования (леса)", "Land-system change (forests)"), 1],
    ["💧", t3("Чучук сув ўзгариши", "Изменение пресной воды", "Freshwater change"), 1],
    ["🧪", t3("Азот ва фосфор оқими", "Потоки азота и фосфора", "Nitrogen and phosphorus flows"), 1],
    ["🧴", t3("Янги моддалар (пластик, кимёвий)", "Новые вещества (пластик, химия)", "Novel entities (plastics, chemicals)"), 1],
    ["🌊", t3("Океан кислоталаниши", "Закисление океана", "Ocean acidification"), 1],
    ["🌫", t3("Атмосфера аэрозоллари", "Аэрозоли в атмосфере", "Atmospheric aerosols"), 0],
    ["🛡", t3("Озон қатлами", "Озоновый слой", "Stratospheric ozone"), 0]
  ];
  function donut() {
    const R = 92, r = 44, cx = 110, cy = 110, n = PB.length, gap = 0.035;
    const arc = (a0, a1, rr) => [cx + rr * Math.sin(a0), cy - rr * Math.cos(a0), cx + rr * Math.sin(a1), cy - rr * Math.cos(a1)];
    return `<svg class="sy-donut" viewBox="0 0 220 220" role="img" aria-label="${H(TX.pb)}">${PB.map(([i, n2, bad], k) => {
      const a0 = (k / n) * 2 * Math.PI + gap, a1 = ((k + 1) / n) * 2 * Math.PI - gap;
      const Ro = bad ? R + 14 : R - 12;
      const [x0, y0, x1, y1] = arc(a0, a1, Ro), [x2, y2, x3, y3] = arc(a1, a0, r);
      const mid = (a0 + a1) / 2, lr = (Ro + r) / 2;
      return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${Ro} ${Ro} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} A${r} ${r} 0 0 0 ${x3.toFixed(1)} ${y3.toFixed(1)}Z" class="${bad ? "bad" : "ok"}"><title>${H(n2)}: ${H(bad ? TX.over : TX.safe)}</title></path>
        <text x="${(cx + lr * Math.sin(mid)).toFixed(1)}" y="${(cy - lr * Math.cos(mid) + 5).toFixed(1)}" text-anchor="middle" font-size="15">${i}</text>`;
    }).join("")}<circle cx="${cx}" cy="${cy}" r="${R - 12}" fill="none" class="sy-ring"/><text x="${cx}" y="${cy + 2}" text-anchor="middle" class="sy-dn">7/9</text></svg>`;
  }

  /* ===================== Ўзбекистон ҳаво сифати ===================== */
  const CITIES = [
    ["Тошкент", "Ташкент", "Tashkent", 41.31, 69.28], ["Самарқанд", "Самарканд", "Samarkand", 39.65, 66.96],
    ["Бухоро", "Бухара", "Bukhara", 39.77, 64.42], ["Нукус", "Нукус", "Nukus", 42.46, 59.6],
    ["Фарғона", "Фергана", "Fergana", 40.39, 71.78], ["Наманган", "Наманган", "Namangan", 41.0, 71.67],
    ["Андижон", "Андижан", "Andijan", 40.78, 72.34], ["Қарши", "Карши", "Karshi", 38.86, 65.79],
    ["Термиз", "Термез", "Termez", 37.22, 67.28], ["Урганч", "Ургенч", "Urgench", 41.55, 60.63],
    ["Навоий", "Навои", "Navoi", 40.1, 65.38], ["Жиззах", "Джизак", "Jizzakh", 40.12, 67.84],
    ["Гулистон", "Гулистан", "Gulistan", 40.49, 68.78], ["Мўйноқ", "Муйнак", "Muynak", 43.77, 59.02]
  ].map(([uz, ru, en, la, lo]) => ({ n: t3(uz, ru, en), la, lo }));
  const BOX = { w: 55.5, e: 73.7, s: 36.6, n: 46.0 }, MW = 400, MH = Math.round(MW * ((BOX.n - BOX.s) / ((BOX.e - BOX.w) * Math.cos((41 * Math.PI) / 180))));
  const px = (lo) => ((lo - BOX.w) / (BOX.e - BOX.w)) * MW, py = (la) => ((BOX.n - la) / (BOX.n - BOX.s)) * MH;
  const aqC = (v) => (v == null ? "#94a3b8" : v <= 50 ? "#16a34a" : v <= 100 ? "#ca8a04" : v <= 150 ? "#ea580c" : "#dc2626");
  let border = null, borderP = null;
  function loadBorder() {
    if (!borderP) borderP = fetch("/vendor/uz-border.json").then((r) => r.json()).then((g) => {
      const polys = g.geometry.type === "MultiPolygon" ? g.geometry.coordinates : [g.geometry.coordinates];
      border = polys.map((poly) => poly.map((ring) => "M" + ring.map(([lo, la]) => `${px(lo).toFixed(1)} ${py(la).toFixed(1)}`).join("L") + "Z").join("")).join("");
      if (st.tab === "dash") renderMap();
    }).catch(() => { borderP = null; });
    return borderP;
  }
  const PFX = "ekotalim:net:";
  const getC = (k) => { try { return JSON.parse(localStorage.getItem(PFX + k) || "null"); } catch (e) { return null; } };
  const putC = (k, d) => { try { localStorage.setItem(PFX + k, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* ignore */ } };
  async function getJSON(url, ms = 15000) {
    const ac = typeof AbortController === "function" ? new AbortController() : null;
    const tm = setTimeout(() => ac && ac.abort(), ms);
    try { const r = await fetch(url, { signal: ac ? ac.signal : undefined, cache: "no-store" }); if (!r.ok) throw new Error("HTTP " + r.status); return await r.json(); }
    finally { clearTimeout(tm); }
  }
  let busy = false, selCity = 0;
  async function refresh(manual) {
    if (busy || !online()) { if (manual && !online()) toast(TX.noLive); return; }
    busy = true; renderDash();
    try {
      const la = CITIES.map((c) => c.la).join(","), lo = CITIES.map((c) => c.lo).join(",");
      const j = await getJSON(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${la}&longitude=${lo}&current=us_aqi,pm2_5,pm10&timezone=Asia%2FTashkent`);
      const arr = Array.isArray(j) ? j : [j];
      putC("uzaqi", arr.map((x) => (x && x.current ? { a: x.current.us_aqi, p: x.current.pm2_5, q: x.current.pm10, t: x.current.time } : null)));
    } catch (e) { /* кеш қолади */ }
    try { if (window.EkoOnline && (manual || !getC("planet"))) await EkoOnline.refresh(); } catch (e) { /* ignore */ }
    busy = false; xpOnce("sy_live", 3, TX.title);
    if (st.tab === "dash") renderDash();
  }
  function renderMap() {
    const box = ROOT.querySelector("[data-map]");
    if (!box) return;
    const c = getC("uzaqi"), d = c ? c.d : [];
    const dots = CITIES.map((ct, i) => {
      const v = d[i] ? d[i].a : null;
      return `<g class="sy-dot ${i === selCity ? "on" : ""}" data-city="${i}" tabindex="0" role="button" aria-label="${H(ct.n)}: AQI ${v == null ? "—" : Math.round(v)}">
        <circle cx="${px(ct.lo).toFixed(1)}" cy="${py(ct.la).toFixed(1)}" r="${i === selCity ? 13 : 10}" fill="${aqC(v)}"/>
        <text x="${px(ct.lo).toFixed(1)}" y="${(py(ct.la) + 4).toFixed(1)}" text-anchor="middle">${v == null ? "·" : Math.round(v)}</text></g>`;
    }).join("");
    const s = d[selCity], ct = CITIES[selCity];
    box.innerHTML = `<svg class="sy-map" viewBox="0 0 ${MW} ${MH}" role="group" aria-label="${H(TX.uz)}">${border ? `<path d="${border}" class="sy-uz"/>` : ""}${dots}</svg>
      <p class="sy-city"><b>${H(ct.n)}</b> · AQI <b style="color:${aqC(s && s.a)}">${s && s.a != null ? Math.round(s.a) : "—"}</b> · PM2.5 ${s && s.p != null ? num(s.p, 1) : "—"} · PM10 ${s && s.q != null ? num(s.q, 0) : "—"} µg/m³</p>
      <p class="small muted">${H(TX.who)} ${c ? `· ${H(TX.saved)}: ${new Date(c.t).toLocaleString(lang() === "en" ? "en-GB" : "ru-RU")}` : ""}</p>`;
    if (!border) loadBorder();
  }
  function liveHtml() {
    const p = window.EkoOnline ? EkoOnline.cacheGet("planet") : getC("planet"), ev = window.EkoOnline ? EkoOnline.cacheGet("events") : getC("events");
    const d = p && p.d;
    if (!d && !ev) return `<p class="muted">${H(TX.noLive)}</p>`;
    const card = (i, t, v, sub) => `<div class="sy-kpi"><span aria-hidden="true">${i}</span><b>${v}</b><small>${t}</small>${sub ? `<small class="muted">${sub}</small>` : ""}</div>`;
    return `<div class="sy-kpis">${d && d.co2 ? card("🏭", H(TX.co2), num(d.co2.v, 1) + " ppm", H(TX.safeCo2)) : ""}${d && d.ch4 ? card("🐄", H(TX.ch4), num(d.ch4.v, 0) + " ppb", d.ch4.old ? "+" + num(d.ch4.v - d.ch4.old, 0) + " / 10 y" : "") : ""}${d && d.temp ? card("🌡", H(TX.temp), (d.temp.avg >= 0 ? "+" : "") + num(d.temp.avg, 2) + " °C", H(TX.vsBase)) : ""}${ev && ev.d ? card("🛰", H(TX.evN), String(ev.d.length), "") : ""}</div>
      <p class="small muted">${p && p.t ? `${H(TX.saved)}: ${new Date(p.t).toLocaleString(lang() === "en" ? "en-GB" : "ru-RU")} · ` : ""}NOAA · NASA GISS · NASA EONET</p>`;
  }
  function renderDash() {
    const panel = ROOT.querySelector("[data-panel]");
    if (!panel || st.tab !== "dash") return;
    panel.innerHTML = `
      <div class="ps-grid">
        <section class="ps-box"><h3>${H(TX.pb)}</h3><p class="small muted">${H(TX.pbLead)}</p>
          <div class="sy-pb">${donut()}<ul class="sy-pbl">${PB.map(([i, n, bad]) => `<li class="${bad ? "bad" : "ok"}"><span aria-hidden="true">${i}</span> ${H(n)} <small>${H(bad ? TX.over : TX.safe)}</small></li>`).join("")}</ul></div>
          <p class="small muted">${H(TX.src)}: <a href="https://www.planetaryhealthcheck.org/" target="_blank" rel="noopener">Planetary Health Check 2025 (PIK)</a> · <a href="https://www.science.org/doi/10.1126/sciadv.adh2458" target="_blank" rel="noopener">Richardson et al., 2023</a></p></section>
        <section class="ps-box"><h3>${H(TX.uz)}</h3><p class="small muted">${H(TX.uzLead)}</p><div data-map></div>
          <button type="button" class="btn btn-ghost btn-sm" data-refresh ${busy ? "disabled" : ""}><i class="fa-solid fa-rotate" aria-hidden="true"></i> ${H(busy ? TX.loading : TX.refresh)}</button>
          <p class="small muted">${H(TX.src)}: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> · Copernicus CAMS</p></section>
      </div>
      <section class="ps-box"><h3>${H(TX.live)}</h3>${liveHtml()}</section>
      <section class="ps-box"><h3>${H(TX.cop)}</h3><ul class="sy-cop">${TX.copItems.map((x) => `<li>${H(x)}</li>`).join("")}</ul>
        <p class="small muted">${H(TX.src)}: <a href="https://unfccc.int/" target="_blank" rel="noopener">UNFCCC</a> · <a href="https://www.unep.org/resources/emissions-gap-report-2025" target="_blank" rel="noopener">UNEP Emissions Gap Report 2025</a></p></section>`;
    renderMap();
  }

  /* ===================== COP симулятори ===================== */
  const BLOCS = [
    { id: "cn", f: "🇨🇳", n: t3("Хитой", "Китай", "China"), s: 30, base: 35, ff: 15, dev: 1 },
    { id: "us", f: "🇺🇸", n: t3("АҚШ", "США", "USA"), s: 11, base: 45, ff: 0, donor: 500 },
    { id: "in", f: "🇮🇳", n: t3("Ҳиндистон", "Индия", "India"), s: 8, base: 15, ff: 35, dev: 1 },
    { id: "eu", f: "🇪🇺", n: t3("Европа Иттифоқи", "Евросоюз", "European Union"), s: 6, base: 60, ff: 0, donor: 900 },
    { id: "ru", f: "🇷🇺", n: t3("Россия", "Россия", "Russia"), s: 5, base: 15, ff: 0 },
    { id: "ca", f: "🇺🇿", n: t3("Марказий Осиё (Ўзбекистон)", "Центральная Азия (Узбекистан)", "Central Asia (Uzbekistan)"), s: 1, base: 20, ff: 35, dev: 1 },
    { id: "ot", f: "🌍", n: t3("Бошқа давлатлар", "Остальные страны", "Rest of the world"), s: 39, base: 20, ff: 40, dev: 1 }
  ];
  const copDefault = () => ({ cut: Object.fromEntries(BLOCS.map((b) => [b.id, 0])), fin: 300 });
  function copEval(c) {
    const g = BLOCS.reduce((a, b) => a + (b.s / 100) * (c.cut[b.id] / 100), 0);
    const warm = Math.max(1.4, 2.8 - 1.3 * (g / 0.6));
    const obj = [];
    BLOCS.forEach((b) => {
      const max = b.base + b.ff * (c.fin / 1300);
      if (c.cut[b.id] > max + 0.01) obj.push([b, TX.tooMuch]);
      if (b.donor && c.fin > b.donor) obj.push([b, TX.noMoney]);
    });
    return { g, warm, obj, deal: !obj.length };
  }
  function renderCop() {
    const panel = ROOT.querySelector("[data-panel]");
    if (!panel || st.tab !== "cop") return;
    const c = st.cop || (st.cop = copDefault());
    panel.innerHTML = `<p class="muted" style="max-width:820px">${H(TX.simLead)}</p>
      <div class="sy-sim">
        <div class="sy-sliders">${BLOCS.map((b) => `<label class="sy-sl"><span><b>${b.f} ${H(b.n)}</b> <small class="muted">${b.s} % ${H(TX.share)}</small></span>
          <span class="sy-slr"><input type="range" min="-10" max="80" step="5" value="${c.cut[b.id]}" data-cut="${b.id}" aria-label="${H(b.n)}: ${H(TX.cut)}"><output data-o="${b.id}">${c.cut[b.id]} %</output></span></label>`).join("")}
          <label class="sy-sl"><span><b>${H(TX.fin)}</b> <small class="muted">${H(TX.finD)}</small></span>
          <span class="sy-slr"><input type="range" min="0" max="1300" step="50" value="${c.fin}" data-fin aria-label="${H(TX.fin)}"><output data-o="fin">${c.fin}</output></span></label>
          <button type="button" class="btn btn-ghost btn-sm" data-copreset>${H(TX.reset)}</button>
        </div>
        <div class="sy-res" data-res aria-live="polite"></div>
      </div>
      <p class="small muted">${H(TX.model)}</p>`;
    copResult();
  }
  function copResult() {
    const box = ROOT.querySelector("[data-res]");
    if (!box) return;
    const c = st.cop, r = copEval(c);
    const pctT = Math.max(0, Math.min(100, ((r.warm - 1.2) / (3.2 - 1.2)) * 100));
    const col = r.warm <= 1.6 ? "#15803d" : r.warm <= 2 ? "#65a30d" : r.warm <= 2.5 ? "#ca8a04" : "#dc2626";
    box.innerHTML = `<h3>${H(TX.result)}</h3>
      <div class="sy-therm" aria-hidden="true"><i style="height:${pctT.toFixed(0)}%;background:${col}"></i></div>
      <p class="sy-warm"><small>${H(TX.warm)}</small><b style="color:${col}">+${num(r.warm, 1)} °C</b></p>
      <p class="small">${Math.round(r.g * 100)} % — ${H(TX.gcut)}</p>
      <p class="${r.deal ? "sy-ok" : "sy-no"}">${r.deal ? H(TX.deal) : `${H(TX.nodeal)} ${r.obj.map(([b, why]) => `${b.f} ${H(b.n)} (${H(why)})`).join(", ")}`}</p>
      <p class="small">${H(r.warm <= 1.6 ? TX.g15 : r.warm < 2 ? TX.g2 : TX.g3)}</p>
      ${st.best ? `<p class="small muted">${H(TX.best)}: +${num(st.best, 1)} °C</p>` : ""}`;
    if (r.deal && (st.best == null || r.warm < st.best)) { st.best = Math.round(r.warm * 10) / 10; save(); }
    if (r.deal && r.warm < 2.05) xpOnce("sy_cop2", 20, TX.xpWhy);
  }

  /* ===================== Фуқаро илми ===================== */
  const SCI = [
    { i: "🌿", n: "iNaturalist", u: "https://www.inaturalist.org/", d: t3("Ўсимлик, ҳашарот ва ҳайвонни суратга олинг — сунъий интеллект ва олимлар турини аниқлайди.", "Сфотографируйте растение или животное — ИИ и учёные определят вид.", "Photograph a plant or animal — AI and scientists identify the species."), s: t3("Илова → «Observe» → сурат → жойлашув → юбориш.", "Приложение → «Observe» → фото → место → отправить.", "App → Observe → photo → location → submit.") },
    { i: "🐦", n: "eBird", u: "https://ebird.org/", d: t3("Корнелл университетининг қушлар кузатуви базаси: Ўзбекистон қушларини ҳам белгиланг.", "База наблюдений за птицами Корнелльского университета.", "Cornell University's bird observation database."), s: t3("Сайр давомида кўрган қушларни санаб, рўйхатни юборинг.", "Считайте птиц на прогулке и отправьте список.", "Count the birds on a walk and submit a checklist.") },
    { i: "🛰", n: "GLOBE Observer (NASA)", u: "https://observer.globe.gov/", d: t3("Булутлар, дарахтлар ва ер қопламини кузатиб, NASA сунъий йўлдош маълумотини текширишга ёрдам беринг.", "Наблюдайте облака, деревья и покров земли — помогите проверить спутниковые данные NASA.", "Observe clouds, trees and land cover to help check NASA satellite data."), s: t3("Сунъий йўлдош ўтиш вақтида осмонни суратга олинг.", "Сфотографируйте небо во время пролёта спутника.", "Photograph the sky when a satellite passes over.") },
    { i: "🔬", n: "Zooniverse", u: "https://www.zooniverse.org/", d: t3("Интернетда ҳақиқий тадқиқотлар: ҳайвонлар суратлари, музликлар, океан тасвирларини саралаш.", "Онлайн-исследования: сортировка снимков животных, ледников, океана.", "Real research online: classify images of animals, glaciers and oceans."), s: t3("Лойиҳани танланг ва 10 дақиқа расмларни белгиланг.", "Выберите проект и 10 минут размечайте снимки.", "Pick a project and tag images for 10 minutes.") },
    { i: "🌳", n: "Global Forest Watch", u: "https://www.globalforestwatch.org/", d: t3("Ўрмонлар кесилиши ва ёнғинлар ҳақида сунъий йўлдош огоҳлантиришлари харитаси.", "Карта спутниковых оповещений о вырубке лесов и пожарах.", "A map of satellite alerts on deforestation and fires."), s: t3("Ўз вилоятингизни топиб, сўнгги огоҳлантиришларни кўринг.", "Найдите свой регион и посмотрите последние оповещения.", "Find your region and check the latest alerts.") },
    { i: "🌫", n: "OpenAQ", u: "https://openaq.org/", d: t3("Дунёдаги ҳаво сифати станциялари очиқ маълумотлари.", "Открытые данные станций качества воздуха мира.", "Open data from air quality stations worldwide."), s: t3("Шаҳрингиздаги станцияни топиб, маълумотларни юклаб олинг.", "Найдите станцию в своём городе и скачайте данные.", "Find a station in your city and download the data.") },
    { i: "🗺", n: "NASA Worldview", u: "https://worldview.earthdata.nasa.gov/", d: t3("Ҳар куни янгиланадиган сунъий йўлдош суратлари: Орол, чанг бўронлари, ёнғинлар.", "Ежедневные спутниковые снимки: Арал, пыльные бури, пожары.", "Daily satellite imagery: the Aral Sea, dust storms, fires."), s: t3("Сана танлаб, Оролни 2000 ва бугун солиштиринг.", "Сравните Арал в 2000 году и сегодня.", "Compare the Aral Sea in 2000 and today.") },
    { i: "☁️", n: "Copernicus CAMS", u: "https://atmosphere.copernicus.eu/", d: t3("Европа Иттифоқи атмосфера прогнози: чанг, озон, PM2.5.", "Прогноз атмосферы ЕС: пыль, озон, PM2.5.", "EU atmosphere forecasts: dust, ozone, PM2.5."), s: t3("Прогноз харитасида Марказий Осиёни очинг.", "Откройте Центральную Азию на карте прогноза.", "Open Central Asia on the forecast map.") }
  ];
  function renderSci() {
    const panel = ROOT.querySelector("[data-panel]");
    if (!panel || st.tab !== "sci") return;
    panel.innerHTML = `<p class="muted" style="max-width:820px">${H(TX.sciLead)}</p>
      <div class="sy-sci">${SCI.map((x) => `<article class="ps-box sy-scic"><h3><span aria-hidden="true">${x.i}</span> ${esc(x.n)}</h3><p class="small">${H(x.d)}</p>
        <p class="small"><b>${H(TX.how)}</b> ${H(x.s)}</p><a class="btn btn-ghost btn-sm" href="${x.u}" target="_blank" rel="noopener" data-sci="${esc(x.n)}">${H(TX.open)} ↗</a></article>`).join("")}</div>`;
  }

  /* ===================== Мактаб сенсори ===================== */
  const SKETCH = `// Ekomun maktab sensori: ESP32 + DHT22 (harorat, namlik) + SDS011 (PM2.5, PM10)
// Kutubxona: "DHT sensor library" (Adafruit). Serial monitor: 115200 baud.
#include <DHT.h>
#define DHTPIN 4
DHT dht(DHTPIN, DHT22);
HardwareSerial sds(2);           // RX2 = GPIO16, TX2 = GPIO17
float pm25 = NAN, pm10 = NAN;
unsigned long last = 0;

void readSDS() {
  while (sds.available() >= 10) {
    if (sds.read() != 0xAA) continue;   // kadr boshi
    uint8_t b[9];
    sds.readBytes(b, 9);
    if (b[0] != 0xC0 || b[8] != 0xAB) continue;
    uint8_t sum = 0;
    for (int i = 1; i <= 6; i++) sum += b[i];
    if (sum != b[7]) continue;          // nazorat yig'indisi
    pm25 = (b[1] | (b[2] << 8)) / 10.0;
    pm10 = (b[3] | (b[4] << 8)) / 10.0;
  }
}

void setup() {
  Serial.begin(115200);
  sds.begin(9600, SERIAL_8N1, 16, 17);
  dht.begin();
  Serial.println("vaqt_s,harorat_C,namlik_pct,pm25,pm10");
}

void loop() {
  readSDS();
  if (last == 0 || millis() - last >= 60000UL) {   // har daqiqada bir o'lchov
    last = millis() | 1;
    float t = dht.readTemperature(), h = dht.readHumidity();
    Serial.printf("%lu,%.1f,%.0f,%.1f,%.1f\\n", millis() / 1000, t, h, pm25, pm10);
  }
}`;
  const KIT = [
    ["ESP32 DevKit (Wi-Fi плата)", "ESP32 DevKit (плата с Wi-Fi)", "ESP32 DevKit (Wi-Fi board)", "≈ 5 $"],
    ["DHT22 — ҳарорат ва намлик", "DHT22 — температура и влажность", "DHT22 — temperature and humidity", "≈ 3 $"],
    ["SDS011 — PM2.5 ва PM10 чанг датчиги", "SDS011 — датчик пыли PM2.5 и PM10", "SDS011 — PM2.5 and PM10 dust sensor", "≈ 12 $"],
    ["Симлар (Dupont), USB кабел, 10 кОм резистор", "Провода Dupont, USB-кабель, резистор 10 кОм", "Dupont wires, USB cable, 10 kΩ resistor", "≈ 2 $"]
  ].map(([uz, ru, en, p]) => [t3(uz, ru, en), p]);
  const WIRE = [["DHT22 VCC", "3V3"], ["DHT22 DATA", "GPIO 4 (+10 kΩ → 3V3)"], ["DHT22 GND", "GND"], ["SDS011 5V", "VIN / 5V"], ["SDS011 GND", "GND"], ["SDS011 TXD", "GPIO 16 (RX2)"], ["SDS011 RXD", "GPIO 17 (TX2)"]];
  let csv = null, csvCol = 0;
  function parseCsv(text) {
    const lines = String(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 20001);
    if (lines.length < 2) return null;
    const sep = (lines[0].match(/;/g) || []).length > (lines[0].match(/,/g) || []).length ? ";" : ",";
    const head = lines[0].split(sep).map((h) => h.trim().slice(0, 40));
    const rows = lines.slice(1).map((l) => l.split(sep).map((x) => parseFloat(String(x).replace(",", "."))));
    const cols = head.map((h, i) => ({ h, i, v: rows.map((r) => r[i]).filter((x) => Number.isFinite(x)) })).filter((c) => c.v.length >= 2 && !/^(vaqt|time|t|sana|date|вақт)/i.test(c.h));
    return cols.length ? { cols, n: rows.length } : null;
  }
  const SAMPLE = "vaqt_s,harorat_C,namlik_pct,pm25,pm10\n" + Array.from({ length: 48 }, (_, i) => {
    const h = i / 2, rush = Math.exp(-((h - 8) ** 2) / 3) + Math.exp(-((h - 19) ** 2) / 4);
    return `${i * 1800},${(14 + 9 * Math.sin(((h - 9) / 24) * 2 * Math.PI)).toFixed(1)},${(55 - 20 * Math.sin(((h - 9) / 24) * 2 * Math.PI)).toFixed(0)},${(11 + 28 * rush + (i % 5)).toFixed(1)},${(30 + 55 * rush + (i % 7) * 2).toFixed(1)}`;
  }).join("\n");
  function csvChart() {
    if (!csv) return "";
    const c = csv.cols[csvCol] || csv.cols[0], v = c.v;
    const mn = Math.min(...v), mx = Math.max(...v), avg = v.reduce((a, x) => a + x, 0) / v.length;
    const lim = /pm\s*2[._]?5|pm25/i.test(c.h) ? 15 : /pm\s*10/i.test(c.h) ? 45 : null;
    const top = Math.max(mx, lim || 0) * 1.08 || 1, bot = Math.min(0, mn);
    const W = 600, Hh = 200, P = 6;
    const X = (i) => P + (i / Math.max(1, v.length - 1)) * (W - 2 * P), Y = (x) => Hh - P - ((x - bot) / (top - bot)) * (Hh - 2 * P);
    const step = Math.max(1, Math.floor(v.length / 600));
    const pts = v.filter((_, i) => i % step === 0).map((x, i) => `${X(i * step).toFixed(1)},${Y(x).toFixed(1)}`).join(" ");
    const over = lim ? v.filter((x) => x > lim).length : 0;
    return `<div class="sy-csv">
      <label class="small"><b>${H(TX.col)}:</b> <select data-csvcol>${csv.cols.map((k, i) => `<option value="${i}"${i === csvCol ? " selected" : ""}>${esc(k.h)}</option>`).join("")}</select></label>
      <svg class="sy-line" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${esc(c.h)}">${lim ? `<line x1="0" x2="${W}" y1="${Y(lim).toFixed(1)}" y2="${Y(lim).toFixed(1)}" class="sy-lim"/><text x="${W - 4}" y="${(Y(lim) - 4).toFixed(1)}" text-anchor="end" class="sy-limt">WHO ${lim}</text>` : ""}<polyline points="${pts}" class="sy-pl"/></svg>
      <div class="sy-kpis">${[[TX.min, mn], [TX.avg, avg], [TX.max, mx]].map(([t, x]) => `<div class="sy-kpi"><b>${num(x, 1)}</b><small>${H(t)}</small></div>`).join("")}<div class="sy-kpi"><b>${v.length}</b><small>${H(TX.rows)}</small></div>
      ${lim ? `<div class="sy-kpi"><b style="color:${over ? "#dc2626" : "#15803d"}">${Math.round((over / v.length) * 100)} %</b><small>${H(TX.overWho)}</small></div>` : ""}</div></div>`;
  }
  function renderIot() {
    const panel = ROOT.querySelector("[data-panel]");
    if (!panel || st.tab !== "iot") return;
    panel.innerHTML = `<p class="muted" style="max-width:820px">${H(TX.iotLead)}</p>
      <div class="ps-grid">
        <section class="ps-box"><h3>${H(TX.kit)}</h3><ul class="sy-kit">${KIT.map(([n, p]) => `<li><span>${H(n)}</span><b>${p}</b></li>`).join("")}</ul><p class="small">${H(TX.safety)}</p></section>
        <section class="ps-box"><h3>${H(TX.wire)}</h3><table class="sy-wire"><tbody>${WIRE.map(([a, b]) => `<tr><td>${esc(a)}</td><td aria-hidden="true">→</td><td><b>${esc(b)}</b></td></tr>`).join("")}</tbody></table></section>
      </div>
      <section class="ps-box"><h3>${H(TX.code)}</h3><pre class="sy-code" data-notr><code>${esc(SKETCH)}</code></pre><button type="button" class="btn btn-ghost btn-sm" data-copy><i class="fa-regular fa-copy" aria-hidden="true"></i> ${H(TX.copy)}</button></section>
      <section class="ps-box"><h3>${H(TX.csv)}</h3><p class="small muted">${H(TX.csvD)}</p>
        <div class="ps-btns"><label class="btn btn-primary btn-sm"><i class="fa-solid fa-file-csv" aria-hidden="true"></i> CSV<input type="file" accept=".csv,.txt,text/csv,text/plain" data-csv hidden></label><button type="button" class="btn btn-ghost btn-sm" data-sample>${H(TX.sample)}</button></div>
        <div data-csvout>${csvChart()}</div></section>`;
  }

  /* ===================== Асосий ===================== */
  function render() {
    ROOT.innerHTML = `
      <div class="qn-head"><div><span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(TX.title)}</h2>
        <p class="muted" style="max-width:820px">${H(TX.lead)}</p></div></div>
      <div class="filters sy-tabs" role="tablist">${Object.entries(TX.tabs).map(([k, v]) => `<button type="button" role="tab" class="chip ${st.tab === k ? "active" : ""}" aria-selected="${st.tab === k}" data-tab="${k}">${H(v)}</button>`).join("")}</div>
      <div data-panel></div>`;
    ({ dash: renderDash, cop: renderCop, sci: renderSci, iot: renderIot }[st.tab] || renderDash)();
  }
  ROOT.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tab]");
    if (t) { st.tab = t.dataset.tab; save(); render(); const b = ROOT.querySelector(`[data-tab="${st.tab}"]`); if (b) b.focus(); return; }
    if (e.target.closest("[data-refresh]")) return void refresh(true);
    const c = e.target.closest("[data-city]");
    if (c) { selCity = +c.dataset.city; renderMap(); return; }
    if (e.target.closest("[data-copreset]")) { st.cop = copDefault(); save(); renderCop(); return; }
    if (e.target.closest("[data-copy]")) {
      const done = () => toast(TX.copied);
      if (navigator.clipboard) navigator.clipboard.writeText(SKETCH).then(done, () => {}); return;
    }
    if (e.target.closest("[data-sample]")) { csv = parseCsv(SAMPLE); csvCol = csv ? Math.max(0, csv.cols.findIndex((k) => /pm25/.test(k.h))) : 0; ROOT.querySelector("[data-csvout]").innerHTML = csvChart(); return; }
    if (e.target.closest("[data-sci]")) xpOnce("sy_sci", 3, TX.tabs.sci);
  });
  ROOT.addEventListener("keydown", (e) => {
    const c = e.target.closest && e.target.closest("[data-city]");
    if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); selCity = +c.dataset.city; renderMap(); const n = ROOT.querySelector(`[data-city="${selCity}"]`); if (n) n.focus(); }
  });
  ROOT.addEventListener("input", (e) => {
    const s = e.target.closest("[data-cut]");
    if (s) { st.cop.cut[s.dataset.cut] = +s.value; ROOT.querySelector(`[data-o="${s.dataset.cut}"]`).textContent = s.value + " %"; save(); copResult(); return; }
    const f = e.target.closest("[data-fin]");
    if (f) { st.cop.fin = +f.value; ROOT.querySelector('[data-o="fin"]').textContent = f.value; save(); copResult(); }
  });
  ROOT.addEventListener("change", (e) => {
    const f = e.target.closest("[data-csv]");
    if (f && f.files && f.files[0]) {
      const file = f.files[0];
      if (file.size > 3 * 1024 * 1024) { toast(TX.bad); return; }
      file.text().then((txt) => {
        csv = parseCsv(txt); csvCol = 0;
        if (!csv) { toast(TX.bad); return; }
        const i = csv.cols.findIndex((k) => /pm\s*2/i.test(k.h)); if (i >= 0) csvCol = i;
        ROOT.querySelector("[data-csvout]").innerHTML = csvChart();
        xpOnce("sy_csv", 10, TX.csv);
      });
      return;
    }
    const sc = e.target.closest("[data-csvcol]");
    if (sc) { csvCol = +sc.value; ROOT.querySelector("[data-csvout]").innerHTML = csvChart(); }
  });
  let shown = false;
  function onShow() {
    render();
    if (!shown) { shown = true; const c = getC("uzaqi"); if (!lite() && (!c || Date.now() - c.t > 30 * 60e3)) refresh(false); }
  }
  window.addEventListener("hashchange", () => { if (location.hash === "#sayyora") onShow(); });
  window.addEventListener("eko:lang", render);
  window.addEventListener("online", () => { if (location.hash === "#sayyora" && !lite()) refresh(false); });
  if (location.hash === "#sayyora") onShow(); else render();

  window.EkoPlanet = { refresh: () => refresh(true), copEval, BLOCS };
})();
