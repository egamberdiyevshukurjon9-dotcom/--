/* Экомун — «Илова ҳақида»: версия, ўзгаришлар рўйхати, ўз маълумотларини юклаб олиш
   ва хатолар журнали (бравзердаги JavaScript хатолари серверга юборилади, Sentry ўрнига).
   Хатолар журналига фақат хабар, файл, қатор, версия ва бўлим номи кетади — шахсий маълумот эмас.
   Матнлар uz/ru/en шу файлда; лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const APP = { version: "2.1", date: "2026-10-12" };
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
