/* ЭкоТаълим — 🌐 «Онлайн маълумотлар» бўлими ва интернетсиз режим кўрсаткичи.
   Интернет бўлса, очиқ ва бепул манбалардан экологияга доир жонли маълумот олинади:
     • Open-Meteo — шаҳар об-ҳавоси, УБ индекси ва ҳаво сифати;
     • global-warming.org (NOAA, NASA GISS маълумотлари) — CO₂, метан, ҳарорат аномалияси;
     • NASA EONET — дунёдаги ёнғин, бўрон, вулқон, сув тошқини каби табиий ҳодисалар;
     • USGS — охирги ҳафтадаги кучли зилзилалар;
     • Википедия — экология мавзуларидаги мақолалар (ўзбек, рус, инглиз).
   Ҳар бир жавоб қурилмада сақланади (localStorage «ekotalim:net:*»), шунинг учун
   интернет ўчганда охирги маълумот кўрсатилади. Платформанинг қолган қисми
   (дарслар, ўйинлар, лабораториялар) интернетсиз тўлиқ ишлайди.
   Матнлар uz/ru/en кўринишида шу файлда; лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const SEC = document.getElementById("internet");
  const ROOT = document.getElementById("netRoot");

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
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const H = (o) => esc(L(o));
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const App = () => window.EkoApp;
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(L(o)); };
  const xpOnce = (k, n, why) => { const a = App(); if (!a || !a.addXp) return; a.state.flags = a.state.flags || {}; if (!a.state.flags[k]) { a.state.flags[k] = true; a.addXp(n, why); } };
  const online = () => navigator.onLine !== false;

  /* ===================== Матнлар ===================== */
  const TX = {
    title: t3("🌐 Онлайн маълумотлар", "🌐 Онлайн-данные", "🌐 Live data"),
    lead: t3("Интернет уланганда платформа ишончли очиқ манбалардан экологияга доир энг сўнгги маълумотларни олади ва қурилмада сақлаб қўяди. Интернет ўчса, охирги сақланган маълумот кўрсатилади, дарслар, ўйинлар ва лабораториялар эса аввалгидек ишлайверади.",
      "При подключении к интернету платформа получает свежие экологические данные из надёжных открытых источников и сохраняет их на устройстве. Без интернета показываются последние сохранённые данные, а уроки, игры и лаборатории продолжают работать.",
      "When online, the platform pulls the latest ecology data from trusted open sources and saves it on the device. Offline, the last saved data is shown, and lessons, games and labs keep working."),
    on: t3("Интернет бор — маълумотлар жонли", "Интернет есть — данные обновляются", "Online — data is live"),
    off: t3("Интернет йўқ — сақланган маълумотлар кўрсатилмоқда", "Нет интернета — показаны сохранённые данные", "Offline — showing saved data"),
    refresh: t3("Янгилаш", "Обновить", "Refresh"),
    loading: t3("Юкланмоқда…", "Загрузка…", "Loading…"),
    saved: t3("Сақланган", "Сохранено", "Saved"),
    updated: t3("Янгиланди", "Обновлено", "Updated"),
    never: t3("Ҳали юкланмаган. Интернетга уланиб, «Янгилаш» тугмасини босинг.", "Ещё не загружено. Подключитесь к интернету и нажмите «Обновить».", "Not loaded yet. Connect to the internet and press “Refresh”."),
    fail: t3("Манба ҳозир жавоб бермади.", "Источник сейчас не ответил.", "The source did not respond."),
    src: t3("Манба", "Источник", "Source"),
    open: t3("Батафсил", "Подробнее", "Details"),
    // об-ҳаво
    wTitle: t3("Об-ҳаво ва ҳаво сифати", "Погода и качество воздуха", "Weather and air quality"),
    city: t3("Шаҳар", "Город", "City"),
    feels: t3("сезилади", "ощущается", "feels like"),
    wind: t3("Шамол", "Ветер", "Wind"),
    hum: t3("Намлик", "Влажность", "Humidity"),
    uv: t3("УБ индекси", "УФ-индекс", "UV index"),
    aqi: t3("Ҳаво сифати (AQI)", "Качество воздуха (AQI)", "Air quality (AQI)"),
    days: t3("3 кунлик", "На 3 дня", "3 days"),
    uvTip: [t3("Паст — қуёшда хавфсиз.", "Низкий — на солнце безопасно.", "Low — safe in the sun."),
      t3("Ўртача — шляпа ва кўзойнак тавсия этилади.", "Умеренный — рекомендуется шляпа и очки.", "Moderate — hat and sunglasses advised."),
      t3("Юқори — 11:00–16:00 да сояда юринг, крем суртинг.", "Высокий — с 11:00 до 16:00 держитесь в тени, используйте крем.", "High — stay in shade 11:00–16:00, use sunscreen."),
      t3("Жуда юқори — очиқ ҳавода узоқ қолманг.", "Очень высокий — не оставайтесь долго на открытом солнце.", "Very high — limit time outdoors.")],
    aqTip: [t3("Ҳаво тоза — сайр қилиш учун яхши кун.", "Воздух чистый — хороший день для прогулки.", "Clean air — a good day for a walk."),
      t3("Ҳаво ўртача — сезгир одамлар эҳтиёт бўлсин.", "Воздух умеренный — чувствительным людям осторожнее.", "Moderate — sensitive people take care."),
      t3("Ҳаво ифлос — очиқ ҳавода спортни камайтиринг.", "Воздух загрязнён — сократите спорт на улице.", "Polluted — reduce outdoor exercise."),
      t3("Ҳаво жуда ифлос — деразаларни ёпинг, ниқоб тақинг.", "Воздух очень грязный — закройте окна, носите маску.", "Very polluted — close windows, wear a mask.")],
    // сайёра
    pTitle: t3("Сайёра кўрсаткичлари", "Показатели планеты", "Planet vital signs"),
    co2: t3("Атмосферадаги CO₂", "CO₂ в атмосфере", "Atmospheric CO₂"),
    ch4: t3("Атмосферадаги метан", "Метан в атмосфере", "Atmospheric methane"),
    temp: t3("Ер ҳарорати аномалияси", "Аномалия температуры Земли", "Global temperature anomaly"),
    vs10: t3("10 йил олдинга нисбатан", "по сравнению с 10 годами ранее", "vs 10 years earlier"),
    vsBase: t3("1951–1980 йиллар ўртачасига нисбатан", "относительно среднего за 1951–1980", "vs the 1951–1980 average"),
    co2Safe: t3("Хавфсиз чегара деб 350 ppm ҳисобланади.", "Безопасным пределом считают 350 ppm.", "350 ppm is considered the safe limit."),
    // ҳодисалар
    eTitle: t3("Табиий ҳодисалар (NASA)", "Природные события (NASA)", "Natural events (NASA)"),
    eLead: t3("Сунъий йўлдошлар кузатаётган, ҳали тугамаган ҳодисалар.", "Продолжающиеся события, за которыми следят спутники.", "Ongoing events tracked by satellites."),
    near: t3("Марказий Осиёга яқин", "Рядом с Центральной Азией", "Near Central Asia"),
    all: t3("Барчаси", "Все", "All"),
    none: t3("Ҳозирча ҳодиса йўқ.", "Пока событий нет.", "No events right now."),
    // зилзилалар
    qTitle: t3("Охирги ҳафтадаги зилзилалар (USGS)", "Землетрясения за неделю (USGS)", "Earthquakes this week (USGS)"),
    qLead: t3("4,5 ва ундан кучли зилзилалар. Ўзбекистон ва қўшни ҳудудлардагилари белгиланган.", "Землетрясения магнитудой 4,5 и выше. Отмечены события в Узбекистане и соседних регионах.", "Magnitude 4.5 and above. Events in and around Uzbekistan are highlighted."),
    mag: t3("Магнитуда", "Магнитуда", "Magnitude"),
    depth: t3("чуқурлик", "глубина", "depth"),
    qCount: t3("та зилзила", "землетрясений", "earthquakes"),
    // википедия
    kTitle: t3("Википедиядан экология", "Экология из Википедии", "Ecology from Wikipedia"),
    kLead: t3("Мавзуни танланг ёки ўзингиз излаб кўринг. Очилган мақолалар интернетсиз ҳам ўқиш учун сақланади.", "Выберите тему или найдите свою. Открытые статьи сохраняются для чтения без интернета.", "Pick a topic or search. Opened articles are saved for offline reading."),
    kSearch: t3("Википедиядан излаш…", "Поиск в Википедии…", "Search Wikipedia…"),
    kSaved: t3("Сақланган мақолалар", "Сохранённые статьи", "Saved articles"),
    kNo: t3("Ҳеч нарса топилмади.", "Ничего не найдено.", "Nothing found."),
    kOffline: t3("Излаш учун интернет керак. Сақланган мақолаларни ўқишингиз мумкин.", "Для поиска нужен интернет. Сохранённые статьи можно читать.", "Search needs the internet. You can read saved articles."),
    kRead: t3("Википедияда ўқиш", "Читать в Википедии", "Read on Wikipedia"),
    xp: t3("Онлайн маълумот ўрганилди", "Изучены онлайн-данные", "Live data explored"),
    // умумий кўрсаткич
    badgeOff: t3("Интернетсиз режим — дарслар, ўйинлар ва лабораториялар ишлайди", "Офлайн-режим — уроки, игры и лаборатории работают", "Offline mode — lessons, games and labs still work"),
    backOn: t3("Интернет қайта уланди — онлайн маълумотлар янгиланади", "Интернет снова подключён — онлайн-данные обновятся", "Back online — live data will refresh"),
    offlineReady: t3("Платформа интернетсиз ишлашга тайёр", "Платформа готова к работе без интернета", "The platform is ready to work offline")
  };

  /* ===================== Кеш ===================== */
  const PFX = "ekotalim:net:";
  const getC = (k) => { try { return JSON.parse(localStorage.getItem(PFX + k) || "null"); } catch (e) { return null; } };
  const putC = (k, d) => { try { localStorage.setItem(PFX + k, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* тўлиб қолса — эътибор бермаймиз */ } };

  async function getJSON(url, ms = 15000) {
    const ac = typeof AbortController === "function" ? new AbortController() : null;
    const tm = setTimeout(() => ac && ac.abort(), ms);
    try {
      const r = await fetch(url, { signal: ac ? ac.signal : undefined, cache: "no-store" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } finally { clearTimeout(tm); }
  }

  /* Манбадан олиб, кешга ёзади; бўлмаса кешни қайтаради */
  async function load(key, fetcher) {
    if (online()) {
      try { const d = await fetcher(); putC(key, d); return { d, t: Date.now(), live: true }; } catch (e) { /* кешга тушамиз */ }
    }
    const c = getC(key);
    return c ? { d: c.d, t: c.t, live: false } : { d: null, t: 0, live: false, err: true };
  }

  const fmtTime = (t) => {
    if (!t) return "";
    const d = new Date(t), p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };
  const stamp = (r) => r.t ? `<span class="net-stamp ${r.live ? "live" : ""}">${r.live ? "🟢 " + H(TX.updated) : "📦 " + H(TX.saved)}: ${fmtTime(r.t)}</span>` : "";
  const fmtNum = (n, d = 0) => { const s = Number(n).toFixed(d); return lang() === "en" ? s : s.replace(".", ","); };

  /* ===================== 1. Об-ҳаво ва ҳаво сифати ===================== */
  const CITIES = [
    ["Тошкент", "Ташкент", "Tashkent", 41.31, 69.28], ["Самарқанд", "Самарканд", "Samarkand", 39.65, 66.96],
    ["Бухоро", "Бухара", "Bukhara", 39.77, 64.42], ["Нукус", "Нукус", "Nukus", 42.46, 59.6],
    ["Фарғона", "Фергана", "Fergana", 40.39, 71.78], ["Наманган", "Наманган", "Namangan", 41.0, 71.67],
    ["Андижон", "Андижан", "Andijan", 40.78, 72.34], ["Қарши", "Карши", "Karshi", 38.86, 65.79],
    ["Термиз", "Термез", "Termez", 37.22, 67.28], ["Урганч", "Ургенч", "Urgench", 41.55, 60.63],
    ["Навоий", "Навои", "Navoi", 40.1, 65.38], ["Жиззах", "Джизак", "Jizzakh", 40.12, 67.84],
    ["Гулистон", "Гулистан", "Gulistan", 40.49, 68.78], ["Мўйноқ", "Муйнак", "Muynak", 43.77, 59.02]
  ].map(([uz, ru, en, la, lo]) => ({ n: t3(uz, ru, en), la, lo }));
  let cityI = 0;
  try { cityI = Math.max(0, Math.min(CITIES.length - 1, +localStorage.getItem(PFX + "city") || 0)); } catch (e) { /* ignore */ }

  /* WMO об-ҳаво кодлари */
  const WMO = (c) => {
    if (c === 0) return ["☀️", t3("Очиқ осмон", "Ясно", "Clear sky")];
    if (c <= 2) return ["🌤", t3("Қисман булутли", "Переменная облачность", "Partly cloudy")];
    if (c === 3) return ["☁️", t3("Булутли", "Пасмурно", "Overcast")];
    if (c <= 48) return ["🌫", t3("Туман", "Туман", "Fog")];
    if (c <= 57) return ["🌦", t3("Майда ёмғир", "Морось", "Drizzle")];
    if (c <= 67) return ["🌧", t3("Ёмғир", "Дождь", "Rain")];
    if (c <= 77) return ["🌨", t3("Қор", "Снег", "Snow")];
    if (c <= 82) return ["🌧", t3("Жала", "Ливень", "Showers")];
    if (c <= 86) return ["🌨", t3("Қор ёғиши", "Снегопад", "Snow showers")];
    return ["⛈", t3("Момақалдироқ", "Гроза", "Thunderstorm")];
  };
  const aqLevel = (v) => v == null ? -1 : v <= 50 ? 0 : v <= 100 ? 1 : v <= 150 ? 2 : 3;
  const AQC = ["#22c55e", "#eab308", "#f97316", "#ef4444"];
  const uvLevel = (v) => v == null ? -1 : v < 3 ? 0 : v < 6 ? 1 : v < 8 ? 2 : 3;

  function fetchWeather(c) {
    const q = `latitude=${c.la}&longitude=${c.lo}&timezone=Asia%2FTashkent`;
    return Promise.all([
      getJSON(`https://api.open-meteo.com/v1/forecast?${q}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3`),
      getJSON(`https://air-quality-api.open-meteo.com/v1/air-quality?${q}&current=us_aqi,pm2_5,pm10`).catch(() => null)
    ]).then(([w, a]) => ({ w, a }));
  }

  function weatherHTML(r) {
    if (!r.d) return `<p class="muted">${H(r.err && online() ? TX.fail : TX.never)}</p>`;
    const w = r.d.w || {}, cur = w.current || {}, a = (r.d.a && r.d.a.current) || {};
    const [ic, nm] = WMO(cur.weather_code);
    const ul = uvLevel(cur.uv_index), al = aqLevel(a.us_aqi);
    const dl = w.daily || {};
    const days = (dl.time || []).map((d, i) => {
      const [di] = WMO((dl.weather_code || [])[i]);
      return `<div class="net-day"><span>${esc(d.slice(8, 10) + "." + d.slice(5, 7))}</span><b>${di}</b><span>${Math.round(dl.temperature_2m_max[i])}° / ${Math.round(dl.temperature_2m_min[i])}°</span></div>`;
    }).join("");
    return `<div class="net-weather">
        <div class="net-now"><span class="net-big">${ic}</span><div><b class="net-temp">${Math.round(cur.temperature_2m)}°C</b><span>${H(nm)} · ${H(TX.feels)} ${Math.round(cur.apparent_temperature)}°</span></div></div>
        <dl class="net-kv">
          <dt>${H(TX.wind)}</dt><dd>${Math.round(cur.wind_speed_10m)} ${lang() === "en" ? "km/h" : lang() === "ru" ? "км/ч" : L("км/соат")}</dd>
          <dt>${H(TX.hum)}</dt><dd>${Math.round(cur.relative_humidity_2m)}%</dd>
          <dt>${H(TX.uv)}</dt><dd>${cur.uv_index == null ? "—" : fmtNum(cur.uv_index, 1)}</dd>
          <dt>${H(TX.aqi)}</dt><dd>${a.us_aqi == null ? "—" : `<b style="color:${AQC[al]}">${Math.round(a.us_aqi)}</b> · PM2.5 ${Math.round(a.pm2_5)}`}</dd>
        </dl>
      </div>
      ${days ? `<div class="net-days" aria-label="${H(TX.days)}">${days}</div>` : ""}
      <ul class="net-tips">${al >= 0 ? `<li>💨 ${H(TX.aqTip[al])}</li>` : ""}${ul >= 0 ? `<li>🧴 ${H(TX.uvTip[ul])}</li>` : ""}</ul>
      <p class="net-src">${H(TX.src)}: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> · Copernicus CAMS</p>`;
  }

  /* ===================== 2. Сайёра кўрсаткичлари ===================== */
  async function fetchPlanet() {
    const [co2, ch4, tmp] = await Promise.all([
      getJSON("https://global-warming.org/api/co2-api").catch(() => null),
      getJSON("https://global-warming.org/api/methane-api").catch(() => null),
      getJSON("https://global-warming.org/api/temperature-api").catch(() => null)
    ]);
    const out = {};
    if (co2 && Array.isArray(co2.co2) && co2.co2.length) {
      const arr = co2.co2, last = arr[arr.length - 1];
      const y = +last.year - 10;
      const old = arr.find((x) => +x.year === y && +x.month === +last.month) || arr.find((x) => +x.year === y);
      out.co2 = { v: +last.trend || +last.cycle, d: `${last.day}.${last.month}.${last.year}`, old: old ? +old.trend || +old.cycle : null };
    }
    if (ch4 && Array.isArray(ch4.methane) && ch4.methane.length) {
      const arr = ch4.methane.filter((x) => +x.average > 0), last = arr[arr.length - 1];
      const ld = parseFloat(last.date);
      const old = arr.find((x) => Math.abs(parseFloat(x.date) - (ld - 10)) < 0.1);
      out.ch4 = { v: +last.average, d: String(last.date), old: old ? +old.average : null };
    }
    if (tmp && Array.isArray(tmp.result) && tmp.result.length) {
      const arr = tmp.result, last = arr[arr.length - 1];
      const yr = Math.floor(parseFloat(last.time));
      // Охирги 12 ойлик ўртача — тасодифий тебранишни текислайди
      const tail = arr.slice(-12).map((x) => +x.station).filter((x) => !isNaN(x));
      out.temp = { v: +last.station, avg: tail.reduce((s, x) => s + x, 0) / (tail.length || 1), d: String(yr) };
    }
    if (!out.co2 && !out.ch4 && !out.temp) throw new Error("empty");
    return out;
  }

  function planetHTML(r) {
    if (!r.d) return `<p class="muted">${H(r.err && online() ? TX.fail : TX.never)}</p>`;
    const d = r.d, cards = [];
    const delta = (v, o, u, dp) => o == null ? "" : `<small class="net-up">▲ ${v - o >= 0 ? "+" : ""}${fmtNum(v - o, dp)} ${u} ${H(TX.vs10)}</small>`;
    if (d.co2) cards.push(`<div class="net-vital"><span>🏭 ${H(TX.co2)}</span><b>${fmtNum(d.co2.v, 1)} <i>ppm</i></b>${delta(d.co2.v, d.co2.old, "ppm", 1)}<small>${H(TX.co2Safe)}</small></div>`);
    if (d.ch4) cards.push(`<div class="net-vital"><span>🐄 ${H(TX.ch4)}</span><b>${fmtNum(d.ch4.v, 0)} <i>ppb</i></b>${delta(d.ch4.v, d.ch4.old, "ppb", 0)}</div>`);
    if (d.temp) cards.push(`<div class="net-vital"><span>🌡 ${H(TX.temp)}</span><b>+${fmtNum(d.temp.avg, 2)} <i>°C</i></b><small>${H(TX.vsBase)} (${esc(d.temp.d)})</small></div>`);
    return `<div class="net-vitals">${cards.join("")}</div>
      <p class="net-src">${H(TX.src)}: <a href="https://global-warming.org/" target="_blank" rel="noopener">global-warming.org</a> · NOAA ESRL, NASA GISS</p>`;
  }

  /* ===================== 3. NASA EONET ҳодисалари ===================== */
  const ECAT = {
    wildfires: ["🔥", t3("Ёнғин", "Пожар", "Wildfire")],
    severeStorms: ["🌀", t3("Кучли бўрон", "Сильный шторм", "Severe storm")],
    volcanoes: ["🌋", t3("Вулқон", "Вулкан", "Volcano")],
    seaLakeIce: ["🧊", t3("Денгиз ва кўл музи", "Морской и озёрный лёд", "Sea and lake ice")],
    floods: ["🌊", t3("Сув тошқини", "Наводнение", "Flood")],
    drought: ["🏜", t3("Қурғоқчилик", "Засуха", "Drought")],
    dustHaze: ["🌫", t3("Чанг ва туман", "Пыль и дымка", "Dust and haze")],
    earthquakes: ["🌐", t3("Зилзила", "Землетрясение", "Earthquake")],
    landslides: ["⛰", t3("Кўчки", "Оползень", "Landslide")],
    manmade: ["🏭", t3("Инсон фаолияти", "Техногенное", "Manmade")],
    snow: ["❄️", t3("Қор", "Снег", "Snow")],
    tempExtremes: ["🌡", t3("Кескин ҳарорат", "Экстремальная температура", "Temperature extreme")],
    waterColor: ["💧", t3("Сув ранги ўзгариши", "Изменение цвета воды", "Water colour")]
  };
  /* Марказий Осиё (тахминий чегара) */
  const nearCA = (lat, lon) => lat >= 34 && lat <= 48 && lon >= 50 && lon <= 82;
  let eCat = "all";

  async function fetchEvents() {
    const j = await getJSON("https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=60&limit=150");
    return (j.events || []).map((e) => {
      const g = (e.geometry || [])[e.geometry.length - 1] || {};
      let c = g.coordinates || [];
      while (Array.isArray(c[0])) c = c[0];
      return { id: e.id, t: e.title, c: (e.categories[0] || {}).id || "", d: g.date || "", lon: +c[0], lat: +c[1], u: ((e.sources || [])[0] || {}).url || e.link || "" };
    }).sort((a, b) => (b.d || "").localeCompare(a.d || ""));
  }

  function eventsHTML(r) {
    if (!r.d) return `<p class="muted">${H(r.err && online() ? TX.fail : TX.never)}</p>`;
    const counts = {};
    r.d.forEach((e) => { counts[e.c] = (counts[e.c] || 0) + 1; });
    const chips = [`<button class="chip ${eCat === "all" ? "active" : ""}" data-ecat="all">${H(TX.all)} · ${r.d.length}</button>`]
      .concat(Object.keys(counts).sort((a, b) => counts[b] - counts[a]).map((k) => `<button class="chip ${eCat === k ? "active" : ""}" data-ecat="${esc(k)}">${(ECAT[k] || ["📍"])[0]} ${H((ECAT[k] || [0, k])[1])} · ${counts[k]}</button>`));
    const list = r.d.filter((e) => eCat === "all" || e.c === eCat)
      .sort((a, b) => (nearCA(b.lat, b.lon) - nearCA(a.lat, a.lon)))
      .slice(0, 24);
    return `<div class="filters net-chips">${chips.join("")}</div>
      ${list.length ? `<ul class="net-list">${list.map((e) => {
        const [ic, nm] = ECAT[e.c] || ["📍", t3(e.c, e.c, e.c)];
        const near = nearCA(e.lat, e.lon);
        return `<li class="${near ? "near" : ""}"><span class="net-ic">${ic}</span><div><b>${esc(e.t)}</b>
          <small>${H(nm)} · ${esc((e.d || "").slice(0, 10).split("-").reverse().join("."))}${isNaN(e.lat) ? "" : ` · ${fmtNum(e.lat, 1)}°, ${fmtNum(e.lon, 1)}°`}${near ? ` · <em>📍 ${H(TX.near)}</em>` : ""}</small></div>
          ${e.u ? `<a class="net-go" href="${esc(e.u)}" target="_blank" rel="noopener" aria-label="${H(TX.open)}">↗</a>` : ""}</li>`;
      }).join("")}</ul>` : `<p class="muted">${H(TX.none)}</p>`}
      <p class="net-src">${H(TX.src)}: <a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noopener">NASA EONET</a></p>`;
  }

  /* ===================== 4. USGS зилзилалари ===================== */
  async function fetchQuakes() {
    const j = await getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
    return (j.features || []).map((f) => ({
      m: f.properties.mag, p: f.properties.place || "", t: f.properties.time, u: f.properties.url || "",
      lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], dp: f.geometry.coordinates[2]
    }));
  }

  function quakesHTML(r) {
    if (!r.d) return `<p class="muted">${H(r.err && online() ? TX.fail : TX.never)}</p>`;
    const near = r.d.filter((q) => nearCA(q.lat, q.lon));
    const big = r.d.filter((q) => !nearCA(q.lat, q.lon)).sort((a, b) => b.m - a.m).slice(0, Math.max(4, 10 - near.length));
    const list = near.sort((a, b) => b.t - a.t).concat(big);
    const col = (m) => m >= 7 ? "#ef4444" : m >= 6 ? "#f97316" : m >= 5 ? "#eab308" : "#22c55e";
    return `<p class="muted small">${H(TX.qLead)} <b>${r.d.length} ${H(TX.qCount)}</b>.</p>
      <ul class="net-list">${list.map((q) => `<li class="${nearCA(q.lat, q.lon) ? "near" : ""}">
        <span class="net-mag" style="--m:${col(q.m)}" title="${H(TX.mag)}">${fmtNum(q.m, 1)}</span>
        <div><b>${esc(q.p)}</b><small>${fmtTime(q.t)} · ${H(TX.depth)} ${Math.round(q.dp)} ${lang() === "en" ? "km" : "км"}${nearCA(q.lat, q.lon) ? ` · <em>📍 ${H(TX.near)}</em>` : ""}</small></div>
        ${q.u ? `<a class="net-go" href="${esc(q.u)}" target="_blank" rel="noopener" aria-label="${H(TX.open)}">↗</a>` : ""}</li>`).join("")}</ul>
      <p class="net-src">${H(TX.src)}: <a href="https://earthquake.usgs.gov/" target="_blank" rel="noopener">USGS Earthquake Hazards Program</a></p>`;
  }

  /* ===================== 5. Википедия ===================== */
  const WTOP = [
    ["🌿", "Ekologiya", "Экология", "Ecology"],
    ["🌊", "Orol dengizi", "Аральское море", "Aral Sea"],
    ["🌡", "Global isish", "Глобальное потепление", "Global warming"],
    ["🦋", "Biologik xilma-xillik", "Биоразнообразие", "Biodiversity"],
    ["♻️", "Qayta ishlash", "Переработка отходов", "Recycling"],
    ["💨", "Havoning ifloslanishi", "Загрязнение атмосферы", "Air pollution"],
    ["💧", "Suv resurslari", "Водные ресурсы", "Water resources"],
    ["☀️", "Quyosh energiyasi", "Солнечная энергия", "Solar energy"],
    ["🏜", "Choʻllanish", "Опустынивание", "Desertification"],
    ["🌳", "Oʻrmon", "Лес", "Forest"],
    ["🐆", "Qor qoploni", "Снежный барс", "Snow leopard"],
    ["🧪", "Parnik effekti", "Парниковый эффект", "Greenhouse effect"]
  ];
  const wLang = () => (lang() === "ru" ? "ru" : lang() === "en" ? "en" : "uz");
  const wIdx = () => (wLang() === "ru" ? 2 : wLang() === "en" ? 3 : 1);
  const wGet = () => getC("wiki") || { d: {} };
  let wArt = null, wRes = null, wQ = "", wBusy = false;

  async function wikiOpen(title) {
    const wl = wLang(), key = wl + ":" + title, store = wGet().d || {};
    wBusy = true; renderWiki();
    let art = null;
    if (online()) {
      try {
        const j = await getJSON(`https://${wl}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`);
        if (j && j.extract) {
          art = { k: key, t: j.title, x: j.extract, u: (j.content_urls && j.content_urls.mobile && j.content_urls.mobile.page) || `https://${wl}.wikipedia.org/wiki/${encodeURIComponent(title)}`, img: j.thumbnail ? j.thumbnail.source : "", at: Date.now() };
          store[key] = art;
          const keys = Object.keys(store).sort((a, b) => store[b].at - store[a].at);
          keys.slice(40).forEach((k) => delete store[k]);
          putC("wiki", store);
          xpOnce("net_wiki", 5, L(TX.xp));
        }
      } catch (e) { /* кешдан */ }
    }
    if (!art) art = store[key] || null;
    wBusy = false;
    wArt = art || { k: key, t: title, x: L(online() ? TX.fail : TX.kOffline), u: "", img: "" };
    renderWiki();
  }

  async function wikiSearch(q) {
    wQ = q; wArt = null;
    if (!q) { wRes = null; renderWiki(); return; }
    if (!online()) { wRes = "off"; renderWiki(); return; }
    wBusy = true; renderWiki();
    try {
      const j = await getJSON(`https://${wLang()}.wikipedia.org/w/api.php?action=query&list=search&srlimit=10&format=json&origin=*&srsearch=${encodeURIComponent(q)}`);
      wRes = ((j.query && j.query.search) || []).map((s) => ({ t: s.title, s: String(s.snippet || "").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&") }));
    } catch (e) { wRes = "fail"; }
    wBusy = false; renderWiki();
  }

  function renderWiki() {
    const box = ROOT && ROOT.querySelector("[data-wiki]");
    if (!box) return;
    const store = wGet().d || {}, wl = wLang();
    const saved = Object.values(store).filter((a) => a.k.startsWith(wl + ":")).sort((a, b) => b.at - a.at);
    let body = "";
    if (wBusy) body = `<p class="muted">${H(TX.loading)}</p>`;
    else if (wArt) {
      body = `<article class="net-art">${wArt.img ? `<img src="${esc(wArt.img)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
        <h4>${esc(wArt.t)}</h4><p>${esc(wArt.x)}</p>
        ${wArt.u ? `<a class="btn btn-ghost" href="${esc(wArt.u)}" target="_blank" rel="noopener">📖 ${H(TX.kRead)}</a>` : ""}</article>`;
    } else if (wRes === "off") body = `<p class="muted">${H(TX.kOffline)}</p>`;
    else if (wRes === "fail") body = `<p class="muted">${H(TX.fail)}</p>`;
    else if (Array.isArray(wRes)) body = wRes.length ? `<ul class="net-list">${wRes.map((s) => `<li><span class="net-ic">📄</span><div><b>${esc(s.t)}</b><small>${esc(s.s)}…</small></div><button type="button" class="net-go" data-wopen="${esc(s.t)}" aria-label="${H(TX.open)}">→</button></li>`).join("")}</ul>` : `<p class="muted">${H(TX.kNo)}</p>`;
    box.innerHTML = `
      <div class="filters net-chips">${WTOP.map((w) => `<button class="chip ${wArt && wArt.k === wl + ":" + w[wIdx()] ? "active" : ""}" data-wopen="${esc(w[wIdx()])}">${w[0]} ${esc(wl === "uz" && lang() === "cyr" ? WTOP_CYR[w[1]] || w[1] : w[wIdx()])}</button>`).join("")}</div>
      <form class="net-search" data-wform><input type="search" class="search" name="q" value="${esc(wQ)}" placeholder="${H(TX.kSearch)}" aria-label="${H(TX.kSearch)}"><button class="btn btn-primary" type="submit">🔍</button></form>
      ${body}
      ${saved.length ? `<h4 class="net-sub">📦 ${H(TX.kSaved)} · ${saved.length}</h4><div class="filters net-chips">${saved.slice(0, 20).map((a) => `<button class="chip" data-wopen="${esc(a.k.slice(wl.length + 1))}">${esc(a.t)}</button>`).join("")}</div>` : ""}
      <p class="net-src">${H(TX.src)}: <a href="https://${wl}.wikipedia.org/" target="_blank" rel="noopener">Wikipedia</a> (CC BY-SA 4.0)</p>`;
    box.querySelectorAll("[data-wopen]").forEach((b) => b.addEventListener("click", () => wikiOpen(b.dataset.wopen)));
    box.querySelector("[data-wform]").addEventListener("submit", (e) => { e.preventDefault(); wikiSearch(e.target.q.value.trim()); });
  }
  /* Ўзбек Википедияси лотинда; кирилл режимида мавзу номлари кириллда кўрсатилади */
  const WTOP_CYR = {
    "Ekologiya": "Экология", "Orol dengizi": "Орол денгизи", "Global isish": "Глобал исиш", "Biologik xilma-xillik": "Биологик хилма-хиллик",
    "Qayta ishlash": "Қайта ишлаш", "Havoning ifloslanishi": "Ҳавонинг ифлосланиши", "Suv resurslari": "Сув ресурслари",
    "Quyosh energiyasi": "Қуёш энергияси", "Choʻllanish": "Чўлланиш", "Oʻrmon": "Ўрмон", "Qor qoploni": "Қор қоплони", "Parnik effekti": "Парник эффекти"
  };

  /* ===================== Бўлимни чизиш ===================== */
  const BLOCKS = [
    { k: "weather", ic: "🌤", tt: TX.wTitle, f: () => fetchWeather(CITIES[cityI]), h: weatherHTML, key: () => "weather:" + cityI },
    { k: "planet", ic: "🌍", tt: TX.pTitle, f: fetchPlanet, h: planetHTML },
    { k: "events", ic: "🛰", tt: TX.eTitle, f: fetchEvents, h: eventsHTML, lead: TX.eLead },
    { k: "quakes", ic: "📈", tt: TX.qTitle, f: fetchQuakes, h: quakesHTML }
  ];
  const res = {};
  const keyOf = (b) => (b.key ? b.key() : b.k);
  let lastFetch = 0;

  function statusHTML() {
    const on = online();
    return `<div class="net-status ${on ? "on" : "off"}" role="status"><span class="net-dot"></span>${H(on ? TX.on : TX.off)}
      <button type="button" class="btn btn-ghost net-refresh" data-refresh ${on ? "" : "disabled"}>↻ ${H(TX.refresh)}</button></div>`;
  }

  function cardHTML(b) {
    const r = res[keyOf(b)] || (getC(keyOf(b)) ? { d: getC(keyOf(b)).d, t: getC(keyOf(b)).t, live: false } : { d: null });
    const extra = b.k === "weather" ? `<label class="net-city">${H(TX.city)}: <select data-city>${CITIES.map((c, i) => `<option value="${i}" ${i === cityI ? "selected" : ""}>${H(c.n)}</option>`).join("")}</select></label>` : "";
    return `<article class="net-card" data-blk="${b.k}">
      <header><h3>${b.ic} ${H(b.tt)}</h3>${stamp(r)}</header>
      ${b.lead ? `<p class="muted small">${H(b.lead)}</p>` : ""}${extra}
      <div class="net-body">${r.loading ? `<p class="muted">${H(TX.loading)}</p>` : b.h(r)}</div></article>`;
  }

  function render() {
    if (!ROOT) return;
    ROOT.innerHTML = `
      <div class="section-head"><div><h2 class="section-title">${H(TX.title)}</h2><p class="muted">${H(TX.lead)}</p></div></div>
      <div data-status>${statusHTML()}</div>
      <div class="net-grid">${BLOCKS.map(cardHTML).join("")}
        <article class="net-card net-wide"><header><h3>📚 ${H(TX.kTitle)}</h3></header><p class="muted small">${H(TX.kLead)}</p><div data-wiki></div></article>
      </div>`;
    bind();
    renderWiki();
  }

  function renderBlock(b) {
    const el = ROOT && ROOT.querySelector(`[data-blk="${b.k}"]`);
    if (!el) return;
    el.outerHTML = cardHTML(b);
    bind();
  }

  function bind() {
    const rb = ROOT.querySelector("[data-refresh]");
    if (rb) rb.onclick = () => refreshAll(true);
    const cs = ROOT.querySelector("[data-city]");
    if (cs) cs.onchange = () => { cityI = +cs.value; try { localStorage.setItem(PFX + "city", cityI); } catch (e) { /* ignore */ } refreshBlock(BLOCKS[0]); };
    ROOT.querySelectorAll("[data-ecat]").forEach((c) => (c.onclick = () => { eCat = c.dataset.ecat; renderBlock(BLOCKS[2]); }));
  }

  async function refreshBlock(b) {
    const k = keyOf(b);
    res[k] = Object.assign({}, res[k] || {}, { loading: true });
    renderBlock(b);
    res[k] = await load(k, b.f);
    renderBlock(b);
    return res[k];
  }

  async function refreshAll(manual) {
    if (!ROOT) return;
    lastFetch = Date.now();
    const out = await Promise.all(BLOCKS.map(refreshBlock));
    if (out.some((r) => r.live)) xpOnce("net_live", 10, L(TX.xp));
    if (manual && !online()) toast(TX.off);
  }

  const visible = () => SEC && SEC.classList.contains("page-on");
  /* Бўлим очилганда: 20 дақиқадан эски бўлса янгилаймиз */
  function maybeRefresh() { if (visible() && online() && Date.now() - lastFetch > 20 * 60e3) refreshAll(false); }

  /* ===================== Умумий интернет кўрсаткичи ===================== */
  function injectCSS() {
    if (document.getElementById("eko-net-css")) return;
    const st = document.createElement("style");
    st.id = "eko-net-css";
    st.textContent = `
.net-status{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0 18px;padding:10px 14px;border-radius:14px;background:var(--glass);border:1px solid var(--glass-line);box-shadow:var(--shadow);font-weight:600}
.net-status .net-dot{width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.2)}
.net-status.off .net-dot{background:#f59e0b;box-shadow:0 0 0 4px rgba(245,158,11,.2)}
.net-refresh{margin-left:auto;min-height:40px;padding:8px 16px}
.net-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:16px}
.net-card{background:var(--glass);border:1px solid var(--glass-line);border-radius:var(--radius);box-shadow:var(--shadow);padding:18px;min-width:0}
.net-card.net-wide{grid-column:1/-1}
.net-card header{display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap}
.net-card h3{margin:0 0 6px;font-size:1.08rem}
.net-stamp{font-size:.78rem;color:var(--muted)}
.net-stamp.live{color:var(--primary)}
.net-src{font-size:.78rem;color:var(--muted);margin:12px 0 0}
.net-src a{color:var(--primary)}
.net-city{display:inline-flex;gap:8px;align-items:center;font-size:.9rem;margin:4px 0 10px}
.net-city select{font:inherit;padding:6px 10px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--text)}
.net-weather{display:flex;gap:16px;flex-wrap:wrap;align-items:center}
.net-now{display:flex;gap:12px;align-items:center}
.net-big{font-size:3rem;line-height:1}
.net-temp{display:block;font-size:2rem}
.net-now span{color:var(--muted);font-size:.9rem}
.net-kv{display:grid;grid-template-columns:auto auto;gap:4px 14px;margin:0;font-size:.9rem}
.net-kv dt{color:var(--muted)}.net-kv dd{margin:0;font-weight:650}
.net-days{display:flex;gap:8px;margin-top:12px}
.net-day{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px;border-radius:12px;background:var(--primary-soft);font-size:.82rem}
.net-day b{font-size:1.4rem}
.net-tips{margin:10px 0 0;padding-left:0;list-style:none;font-size:.9rem}
.net-tips li{margin:4px 0}
.net-vitals{display:grid;gap:10px}
.net-vital{display:flex;flex-direction:column;gap:2px;padding:12px;border-radius:14px;background:var(--primary-soft)}
.net-vital span{font-size:.88rem;color:var(--muted)}
.net-vital b{font-size:1.6rem}.net-vital b i{font-style:normal;font-size:.9rem;color:var(--muted)}
.net-vital small{font-size:.8rem;color:var(--muted)}.net-vital .net-up{color:#dc2626;font-weight:600}
.net-chips{margin:6px 0 10px;gap:6px}
.net-chips .chip{min-height:34px;padding:5px 12px;font-size:.84rem}
.net-list{list-style:none;margin:0;padding:0;display:grid;gap:6px;max-height:440px;overflow:auto}
.net-list li{display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:12px;border:1px solid var(--line);background:var(--card)}
.net-list li.near{border-color:#f59e0b;background:color-mix(in srgb,#f59e0b 10%,var(--card))}
.net-list li>div{flex:1;min-width:0}
.net-list b{display:block;font-size:.92rem;overflow-wrap:anywhere}
.net-list small{color:var(--muted);font-size:.78rem}.net-list em{color:#b45309;font-style:normal;font-weight:650}
.net-ic{font-size:1.4rem}
.net-mag{min-width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-weight:800;color:#fff;background:var(--m)}
.net-go{flex:none;width:36px;height:36px;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line);background:var(--glass);color:var(--primary);text-decoration:none;font-weight:700;cursor:pointer;font:inherit}
.net-search{display:flex;gap:8px;margin:0 0 12px}.net-search .search{flex:1;min-width:0}
.net-search .btn{min-height:44px;padding:8px 16px}
.net-art{display:grid;gap:8px}.net-art img{max-width:220px;max-height:200px;border-radius:12px;object-fit:cover}
.net-art h4{margin:0;font-size:1.15rem}.net-art p{margin:0;line-height:1.6}.net-art .btn{justify-self:start}
.net-sub{margin:16px 0 4px;font-size:.95rem}
#netBadge{position:fixed;left:16px;right:16px;margin:0 auto;width:fit-content;bottom:calc(12px + env(safe-area-inset-bottom));z-index:9000;display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:16px;background:#78350f;color:#fff;font-size:.85rem;font-weight:600;box-shadow:0 10px 30px -10px rgba(0,0,0,.5)}
#netBadge[hidden]{display:none}
#netBadge button{background:none;border:0;color:inherit;font:inherit;cursor:pointer;padding:0 0 0 6px;opacity:.8}
@media (max-width:560px){.net-card{padding:14px}.net-big{font-size:2.4rem}.net-temp{font-size:1.6rem}}`;
    document.head.appendChild(st);
  }

  let badge = null, badgeHidden = false;
  function updateBadge() {
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "netBadge";
      badge.setAttribute("role", "status");
      badge.setAttribute("data-notr", "");
      document.body.appendChild(badge);
    }
    const off = !online();
    if (!off) badgeHidden = false;
    badge.hidden = !off || badgeHidden;
    badge.innerHTML = `📴 <span>${H(TX.badgeOff)}</span><button type="button" aria-label="×">✕</button>`;
    badge.querySelector("button").onclick = () => { badgeHidden = true; badge.hidden = true; };
    document.documentElement.classList.toggle("is-offline", off);
    const s = ROOT && ROOT.querySelector("[data-status]");
    if (s) { s.innerHTML = statusHTML(); bind(); }
  }

  injectCSS();
  window.addEventListener("online", () => { updateBadge(); toast(TX.backOn); lastFetch = 0; maybeRefresh(); });
  window.addEventListener("offline", updateBadge);
  window.addEventListener("eko:lang", () => { render(); updateBadge(); });
  if (SEC) new MutationObserver(maybeRefresh).observe(SEC, { attributes: true, attributeFilter: ["class"] });
  render();
  updateBadge();
  maybeRefresh();

  /* Service worker барча файлларни сақлаб бўлгач, бир марта хабар берамиз */
  if ("serviceWorker" in navigator && navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener("message", (e) => {
      if (e.data && e.data.type === "eko-offline-ready") {
        try { if (localStorage.getItem(PFX + "ready") === e.data.cache) return; localStorage.setItem(PFX + "ready", e.data.cache); } catch (er) { /* ignore */ }
        toast(TX.offlineReady);
      }
    });
  }

  window.EkoOnline = { refresh: () => refreshAll(true), online, cacheGet: getC };
})();
