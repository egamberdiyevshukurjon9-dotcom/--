/* Экомун — «Илова ҳақида»: версия, ўзгаришлар рўйхати, ўз маълумотларини юклаб олиш
   ва хатолар журнали (бравзердаги JavaScript хатолари серверга юборилади, Sentry ўрнига).
   Хатолар журналига фақат хабар, файл, қатор, версия ва бўлим номи кетади — шахсий маълумот эмас.
   Матнлар uz/ru/en шу файлда; лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const APP = { version: "2.5", date: "2026-10-16" };
  window.EKO_VERSION = APP;

  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const lang = () => (EL() ? EL().lang : "cyr");
  const L = (o) => {
    const l = lang();
    if (l === "ru") return o.ru;
    if (l === "en") return o.en;
    return l === "lat" && EL() ? EL().tr(o.uz) : o.uz;
  };
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const H = (o) => esc(L(o));
  const hasServer = () => /^https?:$/.test(location.protocol) && location.hostname !== "appassets.androidplatform.net";
  const apkVersion = () => { try { return window.EkoAndroid && window.EkoAndroid.version ? String(window.EkoAndroid.version()) : ""; } catch (e) { return ""; } };
  const fmtDate = (d) => d.split("-").reverse().join(".");

  const TX = {
    title: t3("Илова ҳақида", "О приложении", "About the app"),
    ver: t3("Версия", "Версия", "Version"),
    apk: t3("Android илова", "Android-приложение", "Android app"),
    site: t3("веб-версия", "веб-версия", "web version"),
    what: t3("Нима янги", "Что нового", "What's new"),
    data: t3("Менинг маълумотларим", "Мои данные", "My data"),
    dataText: t3("Профилингиз, натижаларингиз ва созламаларингиз шу қурилмада сақланади. Онлайн ҳисобингиз бўлса, сервердаги маълумотларингиз ҳам қўшилади. Ҳисобни ўчириш — профил ойнасида.",
      "Профиль, результаты и настройки хранятся на этом устройстве. Если есть онлайн-аккаунт, добавятся и данные с сервера. Удалить аккаунт можно в окне профиля.",
      "Your profile, results and settings are stored on this device. If you have an online account, your server data is included too. You can delete the account from the profile window."),
    export: t3("⬇ Маълумотларимни юклаб олиш (JSON)", "⬇ Скачать мои данные (JSON)", "⬇ Download my data (JSON)"),
    exported: t3("Маълумотлар юклаб олинди", "Данные скачаны", "Data downloaded"),
    privacy: t3("Махфийлик сиёсати", "Политика конфиденциальности", "Privacy policy"),
    offline: t3("Интернетсиз ишлайди: дарслар, тестлар, ўйинлар, лабораториялар ва калькулятор. Ҳаво сифати, харита, онлайн маълумотлар ва ҳисоб учун интернет керак.",
      "Работает без интернета: уроки, тесты, игры, лаборатории и калькулятор. Для качества воздуха, карты, онлайн-данных и аккаунта нужен интернет.",
      "Works offline: lessons, tests, games, labs and the calculator. Air quality, the map, live data and accounts need the internet."),
    assistant: t3("Эко-ёрдамчи — тайёр жавоблар базасига асосланган савол-жавоб ёрдамчиси. Расм таҳлили («Эко-кўз») эса серверда сунъий интеллект (Claude) орқали ишлайди.",
      "Эко-помощник отвечает по готовой базе ответов. Анализ фото («Эко-глаз») работает на сервере через ИИ (Claude).",
      "The Eco-assistant answers from a built-in knowledge base. Photo analysis (Eco-eye) runs on the server with AI (Claude)."),
    close: t3("Ёпиш", "Закрыть", "Close")
  };
  const CHANGES = [
    { v: "2.5", d: "2026-10-16", items: [
      t3("3D лаборатория кенгайди: 16 тажриба (янги: шамол турбинаси, фотосинтез, энергия тежайдиган уй, ер ости суви, циклон, компост), мавзулар бўйича галерея ва умумий ютуқлар", "3D-лаборатория расширена: 16 опытов (новые: ветряк, фотосинтез, энергоэффективный дом, подземные воды, циклон, компост), галерея по темам и общий прогресс", "3D lab expanded: 16 experiments (new: wind turbine, photosynthesis, energy-efficient house, groundwater, cyclone, compost), a topic gallery and overall progress"),
      t3("3D лабда янги асбоблар: чизғич ва зонд (саҳнада ўлчаш), расмга олиш, катта экран, лаборатория журнали (жадвал, график, CSV), мақсадли топшириқлар, тахмин (POE) ва тест саволлари", "Новые инструменты 3D-лаборатории: линейка и зонд, снимок, полный экран, лабораторный журнал (таблица, график, CSV), целевые задания, прогноз (POE) и тесты", "New 3D-lab tools: ruler and probe, snapshot, full screen, lab notebook (table, chart, CSV), goal challenges, predictions (POE) and quizzes"),
      t3("Дизайн 3.0: жонли икки рангли иконкалар, рангли карточкалар, топографик фон ва учқунлар, тунги режим янгиланди", "Дизайн 3.0: яркие двухцветные иконки, цветные карточки, топографический фон, обновлённый ночной режим", "Design 3.0: vivid two-tone icons, tinted cards, a topographic background and a refreshed dark mode"),
      t3("Тузатиш: телефонда 3D лаборатория экрандан четга чиқмайди", "Исправление: 3D-лаборатория больше не выходит за край экрана телефона", "Fix: the 3D lab no longer overflows on phones")
    ] },
    { v: "2.4", d: "2026-10-15", items: [
      t3("Университет учун янги курс «Литосферани чиқиндилардан ҳимоя қилиш» (Ветошкин, 2005; Гарин, Хвостиков, 2010): 6 боб, технологик схемалар, ҳисоблаш масалалари, боб кроссвордлари ва якуний тест", "Новый курс для университета «Защита литосферы от отходов» (Ветошкин, 2005; Гарин, Хвостиков, 2010): 6 глав, технологические схемы, расчётные задачи, кроссворды по главам и итоговый тест", "New university course “Protecting the Lithosphere from Waste” (Vetoshkin, 2005; Garin, Khvostikov, 2010): 6 chapters, process flow diagrams, calculation problems, chapter crosswords and a final test"),
      t3("Мактаб учун янги курс «Ер қалқони»: худди шу 6 боб 11–15 ёшга мослаб, ҳар дарсда уйда хавфсиз тажриба", "Новый школьный курс «Щит Земли»: те же 6 глав для 11–15 лет, в каждом уроке безопасный домашний опыт", "New school course “Earth Shield”: the same 6 chapters for ages 11–15, with a safe home experiment in every lesson"),
      t3("Тузатиш: мактаб ўқувчисига университет курсларининг кроссвордлари кўринмайди", "Исправление: школьникам больше не показываются кроссворды университетских курсов", "Fix: school-stage users no longer see university course crosswords")
    ] },
    { v: "2.3", d: "2026-10-15", items: [
      t3("Мактаб босқичи учун «Табиат ҳимоячиси»: экологик ҳуқуқ болалар тилида — ҳикоялар, Конституция моддалари, «Ҳуқуқ ёки бурч» ўйини, болалар суди, «Сирли дарё» квести, викторина ва гувоҳнома", "«Защитник природы» для школьного этапа: экологическое право детским языком — истории, статьи Конституции, игра «Право или долг», детский суд, квест «Таинственная река», викторина и удостоверение", "Nature Defender for the school stage: environmental law for children — stories, Constitution articles, a rights-or-duties game, a kids’ court, the Mystery river escape room, a quiz and a certificate"),
      t3("Хорижий усуллар: P4C, Think–Pair–Share, Street Law, Breakout EDU, Kahoot услубидаги викторина, «3-2-1» чиқиш чиптаси; матнни овоз билан ўқиш", "Зарубежные методы: P4C, Think–Pair–Share, Street Law, Breakout EDU, викторина в стиле Kahoot, «билет на выход» 3-2-1; озвучивание текста", "Foreign methods: P4C, Think–Pair–Share, Street Law, Breakout EDU, a Kahoot-style quiz, 3-2-1 exit tickets; read-aloud"),
      t3("Университет учун «Чиқиндилар ҳисоби»: 10 та МРО методикаси, калькуляторлар, EWC кодлари, ЕИ чиқиндилар иерархияси, «сўнувчи» мисоллар ва PDF ҳисобот", "«Расчёт отходов» для университета: 10 методик МРО, калькуляторы, коды EWC, иерархия отходов ЕС, «угасающие» примеры и отчёт в PDF", "Waste calculation for university: 10 MRO methods, calculators, EWC codes, the EU waste hierarchy, faded worked examples and a PDF report"),
      t3("«Экологик ҳуқуқ»га «Амалий дарслар» таби: экотизим, Орол, экспертиза, Сув кодекси, ISO 14001 ва кампус чиқинди режаси", "Вкладка «Практические уроки» в «Экологическом праве»: экосистема, Арал, экспертиза, Водный кодекс, ISO 14001 и план отходов кампуса", "A Hands-on lessons tab in Environmental law: ecosystems, the Aral Sea, environmental review, the Water Code, ISO 14001 and a campus waste plan")
    ] },
    { v: "2.2", d: "2026-10-15", items: [
      t3("«Экологик ҳуқуқ: интерактив дарслик»: 24 та қонун ва ҳужжат бир дарсликда — 6 боб, ҳар ҳужжатга алоҳида дарс", "«Экологическое право: интерактивный учебник»: 24 закона и документа в одном учебнике — 6 глав, по уроку на документ", "“Environmental law: an interactive textbook”: 24 laws and documents in one textbook — 6 chapters, one lesson per document"),
      t3("Ҳар дарсда атамалар, моддалар шарҳи, казус, квиз, тўғри/нотўғри, мослаштириш, кроссворд ва мунозара", "В каждом уроке термины, комментарий к статьям, казус, квиз, верно/неверно, сопоставление, кроссворд и дискуссия", "Each lesson has terms, article notes, a case, quiz, true/false, matching, crossword and debate"),
      t3("Дарслик бўйича қидирув, хронология, якуний имтиҳон ва бутун дарсликни PDF қилиш", "Поиск по учебнику, хронология, итоговый экзамен и весь учебник в PDF", "Textbook search, timeline, final exam and the whole textbook as PDF"),
      t3("2025–2026 йилги янги қонунлар: ЎРҚ-1036, ЎРҚ-1073, ЎРҚ-1124, ЎРҚ-1143, ЎРҚ-1145", "Новые законы 2025–2026: ЗРУ-1036, ЗРУ-1073, ЗРУ-1124, ЗРУ-1143, ЗРУ-1145", "New 2025–2026 laws: ZRU-1036, ZRU-1073, ZRU-1124, ZRU-1143, ZRU-1145")
    ] },
    { v: "2.1", d: "2026-10-12", items: [
      t3("«Экологик ҳуқуқ» бўлими: Конституциянинг экологик моддалари, қонунлар кутубхонаси, экологик суд, кейс, дебат, эко-детектив, симулятор ва тест", "Раздел «Экологическое право»: экологические статьи Конституции, библиотека законов, экосуд, кейс, дебаты, эко-детектив, симулятор и тест", "Environmental law section: the Constitution's environmental articles, a law library, eco-court, case study, debate, eco-detective, simulator and test"),
      t3("Ҳар бир дарс матнини PDF қилиб юклаб олиш (интернетсиз ҳам)", "Скачивание текста любого урока в PDF (и без интернета)", "Download any lesson as a PDF (works offline too)"),
      t3("Хорижий очиқ маълумотлар: NASA Worldview, Global Forest Watch, OpenAQ, Google Earth Engine топшириқлари", "Зарубежные открытые данные: задания с NASA Worldview, Global Forest Watch, OpenAQ, Google Earth Engine", "Global open data: tasks with NASA Worldview, Global Forest Watch, OpenAQ and Google Earth Engine"),
      t3("Бош саҳифада «Ўқишни давом эттириш» тугмаси, иконка номлари тўғриланди", "Кнопка «Продолжить обучение» на главной, исправлены подписи иконок", "Continue-learning button on the home page; icon labels fixed")
    ] },
    { v: "2.0", d: "2026-10-12", items: [
      t3("Текшириладиган сертификат: QR код ва текшириш саҳифаси, Telegram'га улашиш", "Проверяемый сертификат: QR-код, страница проверки, отправка в Telegram", "Verifiable certificate: QR code, check page, share to Telegram"),
      t3("Ҳаво сифати: ранг билан бирга шакл белгилари (ранг кўра олмайдиганлар учун)", "Качество воздуха: к цветам добавлены значки-формы (для дальтоников)", "Air quality: shapes added next to colours (colour-blind friendly)"),
      t3("«Илова ҳақида»: версия, янгиликлар ва ўз маълумотларини юклаб олиш", "«О приложении»: версия, новости и выгрузка своих данных", "About: version, changelog and download of your own data"),
      t3("Бошқарув маркази: DAU/WAU/MAU, қайтиш, когорталар, воронка, қийин саволлар, хатолар журнали, захира нусха", "Центр управления: DAU/WAU/MAU, удержание, когорты, воронка, сложные вопросы, журнал ошибок, резервные копии", "Control centre: DAU/WAU/MAU, retention, cohorts, funnel, hardest questions, error log, backups"),
      t3("Фон, контраст ва мобил кўриниш тузатишлари", "Исправления фона, контраста и мобильного вида", "Background, contrast and mobile fixes")
    ] },
    { v: "1.9", d: "2026-10-11", items: [
      t3("Илова номи Ekomun; ўйин маркази, такрорлаш хонаси (SM-2), хатолар дафтари", "Название Ekomun; игровой центр, комната повторения (SM-2), тетрадь ошибок", "Renamed to Ekomun; game centre, review room (SM-2), mistake notebook")
    ] },
    { v: "1.8", d: "2026-10-11", items: [
      t3("Мактаб ва университет учун янги курслар, хорижий адабиёт, «Kreativ g‘oya» бўлими", "Новые курсы для школы и вуза, зарубежная литература, раздел «Kreativ g‘oya»", "New school and university courses, foreign literature, Creative idea contest tab")
    ] }
  ];

  /* ---------- Ўз маълумотларини юклаб олиш ---------- */
  async function exportData() {
    const local = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || !k.startsWith("ekotalim:")) continue;
        const v = localStorage.getItem(k);
        try { local[k] = JSON.parse(v); } catch (e) { local[k] = v; }
      }
    } catch (e) { /* хотира йўқ */ }
    const out = { app: "Ekomun", version: APP.version, exportedAt: new Date().toISOString(), device: local, server: null };
    if (hasServer() && navigator.onLine !== false) {
      try { const r = await fetch("/api/account/export", { credentials: "same-origin" }); if (r.ok) out.server = await r.json(); } catch (e) { /* ҳисоб йўқ */ }
    }
    const a = document.createElement("a");
    a.download = `ekomun-malumotlarim-${new Date().toISOString().slice(0, 10)}.json`;
    a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }));
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    if (window.EkoApp && EkoApp.toast) EkoApp.toast(L(TX.exported));
  }

  /* ---------- «Илова ҳақида» ойнаси ---------- */
  let dlg = null;
  function open() {
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.className = "modal about-modal";
      dlg.setAttribute("data-notr", "");
      document.body.appendChild(dlg);
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg || e.target.closest("[data-about-close]")) dlg.close();
        if (e.target.closest("[data-about-export]")) exportData();
      });
    }
    const apk = apkVersion();
    dlg.innerHTML = `<div class="modal-inner">
      <button class="modal-close" data-about-close aria-label="${H(TX.close)}">✕</button>
      <div class="about-head"><img src="/icons/icon-192.png" alt="" width="56" height="56"><div>
        <h2>Ekomun</h2>
        <p class="muted">${H(TX.ver)} ${APP.version} · ${fmtDate(APP.date)}${apk ? ` · ${H(TX.apk)} ${esc(apk)}` : hasServer() ? ` · ${H(TX.site)}` : ""}</p>
      </div></div>
      <p class="small muted">${H(TX.offline)}</p>
      <p class="small muted">${H(TX.assistant)}</p>
      <h3>${H(TX.what)}</h3>
      ${CHANGES.map((c) => `<div class="about-ver"><b>${c.v}</b> <span class="muted small">${fmtDate(c.d)}</span><ul>${c.items.map((i) => `<li>${H(i)}</li>`).join("")}</ul></div>`).join("")}
      <h3>${H(TX.data)}</h3>
      <p class="small muted">${H(TX.dataText)}</p>
      <div class="about-actions"><button class="btn btn-primary" type="button" data-about-export>${H(TX.export)}</button>
        <a class="btn btn-ghost" href="/privacy">${H(TX.privacy)}</a></div>
    </div>`;
    if (!dlg.open) dlg.showModal();
  }
  window.EkoAbout = { open, exportData, version: APP };
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-about]")) { e.preventDefault(); open(); }
    if (e.target.closest("[data-export-me]")) { e.preventDefault(); exportData(); }
  });
  const label = () => { document.querySelectorAll("[data-about]").forEach((b) => { b.textContent = `Ekomun v${APP.version}`; }); };
  label();
  window.addEventListener("eko:lang", () => { label(); if (dlg && dlg.open) open(); });

  /* ---------- Хатолар журнали ---------- */
  if (!hasServer()) return;
  const sent = new Set();
  let budget = 10;
  function report(msg, src, line) {
    msg = String(msg || "").slice(0, 300);
    if (!msg || budget <= 0 || /^Script error\.?$|ResizeObserver loop/i.test(msg)) return;
    if (src && !String(src).startsWith(location.origin)) return; // кенгайтмалар ва бегона скриптлар
    const key = msg + "|" + src + "|" + line;
    if (sent.has(key)) return;
    sent.add(key); budget--;
    const sec = decodeURIComponent(location.hash.slice(1)).split(/[/?&:]/)[0] || "bosh";
    const body = JSON.stringify({ msg, src: src || "", line: line || 0, ver: APP.version, sec: /^[a-z0-9-]{1,24}$/.test(sec) ? sec : "" });
    try { fetch("/api/err", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {}); } catch (e) { /* ignore */ }
  }
  window.addEventListener("error", (e) => { if (e.error || e.message) report(e.message, e.filename, e.lineno); });
  window.addEventListener("unhandledrejection", (e) => {
    const r = e.reason;
    const msg = r && r.message ? r.message : String(r || "");
    if (/Failed to fetch|NetworkError|Load failed|AbortError|aborted/i.test(msg)) return; // интернет узилиши — хато эмас
    report("Promise: " + msg, r && r.stack ? (String(r.stack).match(/https?:\/\/[^\s)]+/) || [""])[0].replace(/:\d+:\d+$/, "") : "", 0);
  });
})();
