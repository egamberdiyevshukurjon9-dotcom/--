/* Экомун — 🧭 «Шахсий йўл»: мослашувчан ўқитиш (Adaptive Learning) ва қулай режимлар.
   • Билимни кузатиш (Bayesian Knowledge Tracing, Corbett & Anderson, 1994): ҳар бир курс —
     битта билим тугуни. Ҳар бир жавобдан кейин «ўзлаштирилган бўлиш эҳтимоли» P(L) янгиланади.
   • Кейинги дарс тавсияси: қизиқиш (SDG), бошланган курс, билимдаги бўшлиқ ва мақсад асосида;
     ҳар бир тавсия «нега?» изоҳи билан (шаффоф қоидалар, ташқи СИ ишлатилмайди).
   • 7 кунлик шахсий режа: кунлик вақт, ёқтирган формат ва мақсадга қараб.
   • Танаффусни олдиндан сезиш (dropout prevention): 3 кундан ортиқ кирилмаса — бош саҳифада
     қисқа «қайтиш режаси».
   • Қулай режимлар: «Тежамкор трафик» (2G / Data Saver), «Диққат режими» (СДВГ, аутизм
     спектри учун — безаксиз, ҳаракатсиз, бир вазифа), ўқиш чизғичи ва диққат таймери.
   Ҳолат фақат қурилмада: localStorage «ekotalim:yol» ва «ekotalim:modes». */
(() => {
  "use strict";
  const SEC = document.getElementById("yol");
  const ROOT = document.getElementById("ylRoot");
  const root = document.documentElement;

  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const tr = (s) => (EL() ? EL().tr(s) : s);
  const lang = () => (EL() ? EL().lang : "cyr");
  const T = (s) => (EL() ? EL().t(s) : s);
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
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const reduce = () => root.classList.contains("a11y-rm") || root.classList.contains("eko-focus") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ===================== ⚙️ Қулай режимлар ===================== */
  const MK = "ekotalim:modes";
  const M = { lite: "auto", focus: false, ruler: false };
  try { Object.assign(M, JSON.parse(localStorage.getItem(MK)) || {}); } catch (e) { /* ignore */ }
  const saveM = () => { try { localStorage.setItem(MK, JSON.stringify(M)); } catch (e) { /* ignore */ } };
  const conn = () => navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  const slowNet = () => { const c = conn(); return !!c && (c.saveData === true || /(^|-)2g$/.test(String(c.effectiveType || ""))); };
  const liteOn = () => M.lite === "on" || (M.lite === "auto" && slowNet());
  let rulerEl = null;
  function moveRuler(y) { if (rulerEl) rulerEl.style.transform = `translateY(${Math.max(0, y - 22)}px)`; }
  const onPtr = (e) => moveRuler(e.clientY);
  const onTouch = (e) => { if (e.touches && e.touches[0]) moveRuler(e.touches[0].clientY); };
  function applyModes() {
    root.classList.toggle("eko-lite", liteOn());
    root.classList.toggle("eko-focus", !!M.focus);
    if (M.ruler && !rulerEl) {
      rulerEl = document.createElement("div");
      rulerEl.className = "yl-ruler"; rulerEl.setAttribute("aria-hidden", "true");
      document.body.appendChild(rulerEl);
      window.addEventListener("pointermove", onPtr, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
      moveRuler(window.innerHeight / 2);
    } else if (!M.ruler && rulerEl) {
      rulerEl.remove(); rulerEl = null;
      window.removeEventListener("pointermove", onPtr);
      window.removeEventListener("touchmove", onTouch);
    }
  }
  applyModes();
  const c0 = conn();
  if (c0 && c0.addEventListener) c0.addEventListener("change", () => { applyModes(); if (SEC && !SEC.hidden) render(); });
  window.EkoModes = { get lite() { return liteOn(); }, get focus() { return !!M.focus; }, apply: applyModes };

  /* ===================== Матнлар ===================== */
  const TX = {
    pill: t3("🧭 Шахсий йўл · мослашувчан ўқитиш", "🧭 Личный маршрут · адаптивное обучение", "🧭 My path · adaptive learning"),
    title: t3("Шахсий йўл", "Личный маршрут", "My learning path"),
    lead: t3("Платформа жавобларингиздан ҳар бир мавзуни қанчалик ўзлаштирганингизни ҳисоблайди (Bayesian Knowledge Tracing) ва кейинги қадамни таклиф қилади. Ҳисоб-китоб фақат қурилмангизда бажарилади.",
      "Платформа по вашим ответам оценивает, насколько усвоена каждая тема (Bayesian Knowledge Tracing), и предлагает следующий шаг. Все расчёты — только на вашем устройстве.",
      "From your answers the platform estimates how well you know each topic (Bayesian Knowledge Tracing) and suggests the next step. All calculations stay on your device."),
    prefs: t3("🎯 Менинг мақсадим", "🎯 Моя цель", "🎯 My goal"),
    mins: t3("Кунига қанча вақт?", "Сколько времени в день?", "How much time a day?"),
    min: t3("дақ", "мин", "min"),
    fmt: t3("Қайси формат ёқади?", "Какой формат нравится?", "Favourite format?"),
    fmts: { text: t3("📖 Матн", "📖 Текст", "📖 Reading"), video: t3("🎬 Видео", "🎬 Видео", "🎬 Video"), lab: t3("🧊 Лаборатория", "🧊 Лаборатория", "🧊 Lab"), game: t3("🎮 Ўйин", "🎮 Игра", "🎮 Games") },
    goal: t3("Мақсад", "Цель", "Goal"),
    goals: { cert: t3("🏆 Сертификат олиш", "🏆 Получить сертификат", "🏆 Earn a certificate"), curious: t3("🌱 Қизиқиш учун", "🌱 Для интереса", "🌱 Curiosity"), exam: t3("📝 Имтиҳонга тайёрланиш", "📝 Подготовка к экзамену", "📝 Exam prep"), work: t3("💼 Иш учун", "💼 Для работы", "💼 For work") },
    sdg: t3("Қайси мавзу қизиқ? (SDG)", "Какие темы интересны? (ЦУР)", "Which topics interest you? (SDG)"),
    next: t3("✨ Сизга тавсия", "✨ Рекомендуем вам", "✨ Recommended for you"),
    why: t3("Нега?", "Почему?", "Why?"),
    start: t3("Бошлаш", "Начать", "Start"),
    rStarted: t3("бу курсни бошлагансиз", "вы начали этот курс", "you have started this course"),
    rSdg: t3("сиз танлаган мавзуга мос", "соответствует выбранной теме", "matches your chosen topic"),
    rGap: t3("бу мавзуда билим ҳали мустаҳкам эмас", "знания по теме ещё не закреплены", "this topic is not yet secure"),
    rNew: t3("янги мавзу — билим доирасини кенгайтиради", "новая тема расширит кругозор", "a new topic broadens your knowledge"),
    rExam: t3("барча дарслар тугади — якуний тест сертификат беради", "все уроки пройдены — итоговый тест даст сертификат", "all lessons done — the final test gives a certificate"),
    rShort: t3("кунлик вақтингизга мос қисқа дарс", "короткий урок под ваше время", "a short lesson that fits your time"),
    exam: t3("Якуний тест", "Итоговый тест", "Final test"),
    mastery: t3("📈 Билим харитаси", "📈 Карта знаний", "📈 Knowledge map"),
    masteryLead: t3("P(L) — мавзу ўзлаштирилган бўлиш эҳтимоли. 95 % дан юқори — мустаҳкам.", "P(L) — вероятность, что тема усвоена. Выше 95 % — прочно.", "P(L) is the probability that you have mastered the topic. Above 95 % is secure."),
    answers: t3("жавоб", "ответов", "answers"),
    noData: t3("Ҳали жавоблар йўқ. Биринчи дарсни ўқиб, саволларга жавоб беринг.", "Ответов пока нет. Пройдите первый урок и ответьте на вопросы.", "No answers yet. Take a first lesson and answer its questions."),
    review: t3("Такрорлаш керак", "Нужно повторить", "Needs review"),
    toReview: t3("Такрорлаш хонасига", "В комнату повторения", "To the review room"),
    plan: t3("🗓 7 кунлик режа", "🗓 План на 7 дней", "🗓 7-day plan"),
    planNew: t3("Режани янгилаш", "Обновить план", "Refresh plan"),
    today: t3("Бугун", "Сегодня", "Today"),
    pVideo: t3("1 та видео дарс", "1 видеоурок", "1 video lesson"),
    pLab: t3("3D лабораторияда 1 тажриба", "1 опыт в 3D-лаборатории", "1 experiment in the 3D lab"),
    pGame: t3("Ўйин марказида 1 вазифа", "1 задание в игровом центре", "1 quest in the game centre"),
    pText: t3("Кутубхонадан 1 материал", "1 материал из библиотеки", "1 library article"),
    pReview: t3("Такрорлаш хонасида 5 карта", "5 карточек в комнате повторения", "5 cards in the review room"),
    pTour: t3("Ҳафталик турнирда қатнашиш", "Участие в еженедельном турнире", "Join the weekly tournament"),
    planDone: t3("Режа бандини бажардингиз", "Пункт плана выполнен", "Plan step done"),
    twin: t3("🤖 Шахсий ёрдамчи хулосалари", "🤖 Выводы личного помощника", "🤖 Your study assistant says"),
    twinLead: t3("Оддий ва очиқ қоидалар асосида — қурилмадаги жавобларингиздан.", "На основе простых открытых правил — по вашим ответам на устройстве.", "Based on simple, open rules — from your answers on this device."),
    tBest: t3("Энг яхши ўқийдиган вақтингиз", "Лучшее время для учёбы", "Your best study time"),
    tTrend: t3("Охирги 7 кунда аниқлик", "Точность за последние 7 дней", "Accuracy in the last 7 days"),
    tUp: t3("ошди — зўр!", "выросла — отлично!", "is up — great!"),
    tDown: t3("пасайди — қисқа такрорлаш ёрдам беради", "снизилась — поможет короткое повторение", "is down — a short review will help"),
    tSame: t3("барқарор", "стабильна", "is steady"),
    tStreak: t3("Кетма-кет фаол кунлар", "Активных дней подряд", "Active days in a row"),
    tRest: t3("Узоқ танаффус бўлди — 5 дақиқадан бошлаймиз.", "Был долгий перерыв — начнём с 5 минут.", "It has been a while — let's start with 5 minutes."),
    tFew: t3("Маълумот кам: бир неча дарсдан кейин хулосалар аниқлашади.", "Мало данных: выводы уточнятся после нескольких уроков.", "Not much data yet: insights get sharper after a few lessons."),
    morning: t3("эрталаб", "утром", "in the morning"), day: t3("кундузи", "днём", "in the afternoon"), evening: t3("кечқурун", "вечером", "in the evening"), night: t3("тунда", "ночью", "at night"),
    back: t3("👋 Қайтганингиздан хурсандмиз!", "👋 Рады вашему возвращению!", "👋 Welcome back!"),
    backTxt: t3("кун танаффус бўлди. 5 дақиқалик қисқа режа:", "дн. перерыва. Короткий план на 5 минут:", "days away. A 5-minute plan:"),
    later: t3("Кейинроқ", "Позже", "Later"),
    modes: t3("♿ Қулай режимлар", "♿ Удобные режимы", "♿ Comfort modes"),
    modesLead: t3("Секин интернет, диққатни жамлаш қийин бўлса ёки матнни ўқиш оғир бўлса — платформани ўзингизга мослаб олинг.", "Медленный интернет, трудно сосредоточиться или читать — настройте платформу под себя.", "Slow internet, trouble focusing or reading? Adapt the platform to you."),
    lite: t3("📶 Тежамкор трафик (2G)", "📶 Экономия трафика (2G)", "📶 Low-bandwidth (2G)"),
    liteD: t3("Безак ва анимациялар ўчади, онлайн маълумотлар ўзи юкланмайди (фақат «Янгилаш» босилганда), видео расмлари ва 3D сифати пасаяди.", "Отключаются украшения и анимации, онлайн-данные загружаются только по кнопке «Обновить», превью видео скрываются, 3D проще.", "Decorations and animations off, live data loads only when you tap Refresh, video thumbnails hidden, lighter 3D."),
    auto: t3("Автомат", "Авто", "Auto"), on: t3("Ёқиқ", "Вкл", "On"), off: t3("Ўчиқ", "Выкл", "Off"),
    autoNow: t3("Ҳозир секин тармоқ аниқланди — режим ёқилган.", "Обнаружена медленная сеть — режим включён.", "Slow network detected — the mode is on."),
    focus: t3("🧘 Диққат режими (нейрохилма-хиллик)", "🧘 Режим концентрации (нейроразнообразие)", "🧘 Focus mode (neurodiversity)"),
    focusD: t3("СДВГ, аутизм спектри ва тез чалғийдиганлар учун: ҳаракат ва безаклар йўқ, «Янги» белгилари ва ортиқча блоклар яширинади, матн кенг оралиқ билан, ранглар юмшоқ.", "Для СДВГ, расстройств аутистического спектра и тех, кто легко отвлекается: без анимаций и украшений, скрыты метки «Новое» и лишние блоки, текст с увеличенными интервалами, мягкие цвета.", "For ADHD, autism and anyone easily distracted: no motion or decoration, “New” labels and extra blocks hidden, wider text spacing, softer colours."),
    ruler: t3("📏 Ўқиш чизғичи", "📏 Линейка для чтения", "📏 Reading ruler"),
    rulerD: t3("Кўрсаткич ёки бармоқ турган қатор ёритилади — дислексия ва диққат учун ёрдам.", "Подсвечивается строка под курсором или пальцем — помогает при дислексии.", "Highlights the line under your pointer or finger — helps with dyslexia and focus."),
    more: t3("Шрифт ўлчами, контраст ва ҳарф оралиғи", "Размер шрифта, контраст и интервалы", "Font size, contrast and spacing"),
    timer: t3("⏱ Диққат таймери", "⏱ Таймер концентрации", "⏱ Focus timer"),
    timerD: t3("Қисқа вақт битта ишга диққат қилинг, кейин дам олинг (Pomodoro усули). Товуш чиқармайди.", "Сосредоточьтесь на одном деле на короткое время, затем отдохните (метод Pomodoro). Без звука.", "Focus on one thing for a short while, then rest (Pomodoro method). Silent."),
    stop: t3("Тўхтатиш", "Стоп", "Stop"),
    pause: t3("Пауза", "Пауза", "Pause"),
    resume: t3("Давом", "Продолжить", "Resume"),
    rest: t3("☕ Вақт тугади! 5 дақиқа дам олинг: кўзингизни узоққа қаратинг, сув ичинг.", "☕ Время вышло! Отдохните 5 минут: посмотрите вдаль, выпейте воды.", "☕ Time's up! Rest for 5 minutes: look into the distance, drink some water."),
    timerXp: t3("Диққат сессияси", "Сессия концентрации", "Focus session")
  };

  /* ===================== BKT ===================== */
  const P = { T: 0.12, S: 0.1, G: 0.25 };
  const KEY = "ekotalim:yol";
  let st = { kc: {}, pref: { mins: 10, fmt: "text", goal: "cert", sdg: [] }, plan: null, last: 0, hours: {}, back: "" };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  st.pref = Object.assign({ mins: 10, fmt: "text", goal: "cert", sdg: [] }, st.pref);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };

  const courses = () => ((App() && App().courses) || []);
  const S = () => ((App() && App().state) || { correct: {}, exams: {}, certs: {} });
  const stage = () => (root.classList.contains("stage-maktab") ? "maktab" : "uni");
  const courseStage = (c) => c.stage || (c.audience === "bola" ? "maktab" : "uni");
  const lessonDone = (c, li) => (c.lessons[li].quiz || []).every((_, qi) => S().correct[`${c.id}:${li}:${qi}`]);
  const progress = (c) => { let d = 0; c.lessons.forEach((_, i) => { if (lessonDone(c, i)) d++; }); return d; };
  function kc(cid) {
    if (!st.kc[cid]) {
      const c = courses().find((x) => x.id === cid);
      const f = c ? progress(c) / c.lessons.length : 0;
      st.kc[cid] = { p: 0.2 + 0.6 * f, n: 0, ok: 0, h: [] };
    }
    return st.kc[cid];
  }
  function observe(cid, ok) {
    const k = kc(cid), p = k.p;
    const post = ok ? (p * (1 - P.S)) / (p * (1 - P.S) + (1 - p) * P.G) : (p * P.S) / (p * P.S + (1 - p) * (1 - P.G));
    k.p = Math.min(0.999, post + (1 - post) * P.T);
    k.n++; if (ok) k.ok++;
    k.h.push(ok ? 1 : 0); if (k.h.length > 20) k.h.shift();
  }
  function touch() {
    st.last = Date.now();
    const h = new Date().getHours();
    st.hours[h] = (st.hours[h] || 0) + 1;
  }
  window.addEventListener("eko:q", (e) => {
    const k = String((e.detail && e.detail.k) || ""), cid = k.split(":")[0];
    if (!courses().some((c) => c.id === cid)) return;
    observe(cid, !!e.detail.ok); touch(); save(); later();
  });
  window.addEventListener("eko:fn", (e) => {
    const d = e.detail || {};
    if (d.k === "exam" && d.cid) { const k = kc(d.cid); k.p = Math.min(0.999, 0.5 * k.p + 0.5 * (Math.max(0, Math.min(100, d.pct)) / 100)); touch(); save(); later(); }
  });
  window.addEventListener("eko:lessondone", () => { touch(); save(); later(); });
  window.addEventListener("eko:lesson", () => { touch(); save(); });

  /* ===================== Тавсия ===================== */
  function recommend(n = 3) {
    const stg = stage(), meta = (window.EkoPassport && EkoPassport.META) || {}, s = S();
    const out = [];
    courses().filter((c) => courseStage(c) === stg).forEach((c) => {
      const done = progress(c), total = c.lessons.length, k = kc(c.id);
      const next = c.lessons.findIndex((_, i) => !lessonDone(c, i));
      const sdgHit = (meta[c.id] ? meta[c.id][0] : []).some((g) => st.pref.sdg.includes(g));
      const why = [];
      let score = 0;
      if (next < 0) {
        if (s.exams && s.exams[c.id] != null && s.exams[c.id] >= 60) return;
        score = 2.2 + (st.pref.goal === "cert" || st.pref.goal === "exam" ? 1 : 0); why.push(TX.rExam);
        out.push({ c, li: -1, score, why }); return;
      }
      if (done > 0) { score += 1.4; why.push(TX.rStarted); } else { score += 0.3; why.push(TX.rNew); }
      if (sdgHit) { score += 1.5; why.push(TX.rSdg); }
      if (k.n >= 3 && k.p < 0.6) { score += 0.8 * (1 - k.p); why.push(TX.rGap); }
      const mins = +c.lessons[next].minutes || 8;
      if (mins <= st.pref.mins) { score += 0.4; why.push(TX.rShort); }
      if (st.pref.goal === "work" && c.audience === "korxona") score += 1;
      if (st.pref.goal === "exam" && done > 0) score += 0.4;
      score += (done / total) * 0.6;
      out.push({ c, li: next, score, why });
    });
    return out.sort((a, b) => b.score - a.score).slice(0, n);
  }

  /* ===================== Режа ===================== */
  function makePlan() {
    const recs = recommend(3), days = [];
    const fmtItem = { video: [TX.pVideo, "#video"], lab: [TX.pLab, "#lab3d"], game: [TX.pGame, "#oyinmarkaz"], text: [TX.pText, "#kutubxona"] }[st.pref.fmt];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const items = [];
      const r = recs.length ? recs[i % recs.length] : null;
      if (r) items.push(r.li < 0 ? { k: "x", cid: r.c.id } : { k: "l", cid: r.c.id, li: r.li });
      if (st.pref.mins >= 10) items.push({ k: "go", t: fmtItem[0], h: fmtItem[1] });
      if (st.pref.mins >= 20) items.push({ k: "go", t: TX.pReview, h: "#takror" });
      if (i === 2 || i === 6) items.push({ k: "go", t: TX.pTour, h: "#turnir" });
      days.push({ d: dayKey(d), items: items.map((x, j) => ({ ...x, id: dayKey(d) + ":" + j, done: false })) });
    }
    st.plan = { at: dayKey(), days };
    save();
  }
  function planValid() {
    if (!st.plan || !st.plan.days || !st.plan.days.length) return false;
    const last = st.plan.days[st.plan.days.length - 1].d;
    return last >= dayKey();
  }
  function itemLabel(it) {
    if (it.k === "go") return L(it.t);
    const c = courses().find((x) => x.id === it.cid);
    if (!c) return "";
    if (it.k === "x") return `📝 ${L(TX.exam)}: ${T(c.title)}`;
    const l = c.lessons[it.li];
    return l ? `${c.icon} ${T(l.title)} · ${l.minutes || 8} ${L(TX.min)}` : "";
  }

  /* ===================== Ёрдамчи хулосалари ===================== */
  function insights() {
    const out = [], log = (() => { try { return (JSON.parse(localStorage.getItem("ekotalim:pasport")) || {}).d || {}; } catch (e) { return {}; } })();
    const total = Object.values(st.kc).reduce((a, k) => a + k.n, 0);
    if (total < 6) out.push(["ℹ️", L(TX.tFew)]);
    const hrs = Object.entries(st.hours).map(([h, n]) => [+h, n]);
    if (hrs.length && total >= 6) {
      const part = [0, 0, 0, 0];
      hrs.forEach(([h, n]) => { part[h >= 5 && h < 12 ? 0 : h >= 12 && h < 17 ? 1 : h >= 17 && h < 22 ? 2 : 3] += n; });
      const bi = part.indexOf(Math.max(...part));
      out.push(["🕒", `${L(TX.tBest)}: <b>${H([TX.morning, TX.day, TX.evening, TX.night][bi])}</b>`]);
    }
    const sum = (from, to) => { let q = 0, ok = 0; for (let i = from; i < to; i++) { const d = new Date(); d.setDate(d.getDate() - i); const v = log[dayKey(d)]; if (v) { q += v.q; ok += v.ok; } } return q ? ok / q : null; };
    const a7 = sum(0, 7), a14 = sum(7, 14);
    if (a7 != null) {
      const trend = a14 == null ? TX.tSame : a7 - a14 > 0.05 ? TX.tUp : a14 - a7 > 0.05 ? TX.tDown : TX.tSame;
      out.push(["🎯", `${L(TX.tTrend)}: <b>${Math.round(a7 * 100)} %</b> — ${H(trend)}`]);
    }
    let streak = 0;
    for (let i = 0; i < 400; i++) { const d = new Date(); d.setDate(d.getDate() - i); const v = log[dayKey(d)]; if (v && (v.q || v.l)) streak++; else if (i > 0) break; }
    if (streak) out.push(["🔥", `${L(TX.tStreak)}: <b>${streak}</b>`]);
    if (gapDays() >= 3) out.push(["👋", L(TX.tRest)]);
    return out;
  }
  const gapDays = () => (st.last ? Math.floor((Date.now() - st.last) / 864e5) : 0);

  /* ===================== Бош саҳифада «қайтиш режаси» ===================== */
  function welcomeBack() {
    const old = document.getElementById("ylBack");
    const g = gapDays();
    if (g < 3 || st.back === dayKey()) { if (old) old.remove(); return; }
    const r = recommend(1)[0];
    if (!r) return;
    const grid = document.querySelector("#apps .app-grid");
    if (!grid) return;
    const box = old || document.createElement("div");
    box.id = "ylBack"; box.className = "yl-back"; box.setAttribute("role", "status"); box.setAttribute("data-notr", "");
    box.innerHTML = `<b>${H(TX.back)}</b> <span>${g} ${H(TX.backTxt)}</span> <span class="yl-back-l">${esc(r.li < 0 ? `📝 ${L(TX.exam)}: ${T(r.c.title)}` : `${r.c.icon} ${T(r.c.lessons[r.li].title)}`)}</span>
      <span class="yl-back-b"><button type="button" class="btn btn-primary btn-sm" data-ygo>${H(TX.start)} →</button><button type="button" class="btn btn-ghost btn-sm" data-ylater>${H(TX.later)}</button></span>`;
    if (!old) grid.before(box);
    box.onclick = (e) => {
      if (e.target.closest("[data-ylater]")) { st.back = dayKey(); save(); box.remove(); return; }
      if (e.target.closest("[data-ygo]")) { st.back = dayKey(); save(); box.remove(); openRec(r.c.id, r.li); }
    };
  }
  function openRec(cid, li) {
    const a = App(); if (!a) return;
    if (li >= 0 && a.openLesson) { a.openLesson(cid, li); return; }
    if (window.EkoNav) EkoNav.go("kurslar");
    setTimeout(() => { const b = document.querySelector(`[data-exam="${cid}"]`); if (b) { b.scrollIntoView({ block: "center" }); b.focus(); } }, 400);
  }

  /* ===================== Диққат таймери ===================== */
  let tmr = null;
  function timerHtml() {
    if (!tmr) return `<div class="ps-btns">${[10, 15, 25].map((m) => `<button type="button" class="btn btn-ghost btn-sm" data-tstart="${m}">▶ ${m} ${H(TX.min)}</button>`).join("")}</div>`;
    return `<p class="yl-tleft"><b data-tleft>${fmtT(tmr.left)}</b></p><div class="ps-btns"><button type="button" class="btn btn-ghost btn-sm" data-tpause>${H(tmr.run ? TX.pause : TX.resume)}</button><button type="button" class="btn btn-ghost btn-sm" data-tstop>${H(TX.stop)}</button></div>`;
  }
  const fmtT = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  let pill = null;
  function pillSync() {
    if (!tmr) { if (pill) { pill.remove(); pill = null; } return; }
    if (!pill) {
      pill = document.createElement("button");
      pill.type = "button"; pill.className = "yl-pill"; pill.setAttribute("data-notr", "");
      pill.addEventListener("click", () => { if (window.EkoNav) EkoNav.go("yol"); });
      document.body.appendChild(pill);
    }
    const f = 1 - tmr.left / tmr.total;
    pill.style.setProperty("--f", (f * 360).toFixed(1) + "deg");
    pill.textContent = "⏱ " + fmtT(tmr.left);
    pill.setAttribute("aria-label", L(TX.timer) + " " + fmtT(tmr.left));
    const t = ROOT && ROOT.querySelector("[data-tleft]"); if (t) t.textContent = fmtT(tmr.left);
  }
  function tick() {
    if (!tmr || !tmr.run) return;
    tmr.left = Math.max(0, tmr.total - Math.round((Date.now() - tmr.t0) / 1000) - tmr.paid);
    if (tmr.left <= 0) {
      clearInterval(tmr.iv); const m = tmr.total / 60; tmr = null; pillSync(); toast(TX.rest);
      const a = App(); if (a && a.addXp) a.addXp(m >= 25 ? 5 : 3, L(TX.timerXp));
      if (SEC && !SEC.hidden) render();
      return;
    }
    pillSync();
  }

  /* ===================== Чизиш ===================== */
  function render() {
    if (!ROOT) return;
    if (!planValid()) makePlan();
    const recs = recommend(3), meta = (window.EkoPassport && EkoPassport.META) || {}, SDG = (window.EkoPassport && EkoPassport.SDG) || {};
    const seg = (name, opts, cur) => `<div class="yl-seg" role="radiogroup">${opts.map(([v, l]) => `<button type="button" role="radio" aria-checked="${String(cur) === String(v)}" class="chip ${String(cur) === String(v) ? "active" : ""}" data-pref="${name}" data-v="${v}">${l}</button>`).join("")}</div>`;
    const stg = stage();
    const mine = courses().filter((c) => courseStage(c) === stg);
    const kcs = mine.map((c) => ({ c, k: st.kc[c.id] })).filter((x) => x.k && x.k.n > 0).sort((a, b) => b.k.n - a.k.n);
    const weak = kcs.filter((x) => x.k.p < 0.5 && x.k.n >= 3);
    const usedSdg = [...new Set(mine.flatMap((c) => (meta[c.id] ? meta[c.id][0] : [])))].sort((a, b) => a - b);
    const today = dayKey();
    const plan = st.plan.days.map((d) => `<li class="yl-day ${d.d === today ? "today" : ""}"><b>${d.d === today ? H(TX.today) : esc(d.d.slice(5).split("-").reverse().join("."))}</b>
      <ul>${d.items.map((it) => { const lbl = itemLabel(it); return lbl ? `<li><label class="vd-chk"><input type="checkbox" data-plan="${esc(it.id)}"${it.done ? " checked" : ""}> <span>${esc(lbl)}</span></label>${it.k === "go" ? ` <a href="${esc(it.h)}" class="small">→</a>` : ` <button type="button" class="linkish small" data-open="${esc(it.cid)}" data-li="${it.k === "x" ? -1 : it.li}">→</button>`}</li>` : ""; }).join("")}</ul></li>`).join("");
    const live = liteOn();
    ROOT.innerHTML = `
      <div class="qn-head"><div><span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(TX.title)}</h2>
        <p class="muted" style="max-width:820px">${H(TX.lead)}</p></div></div>
      <div class="ps-grid">
        <section class="ps-box"><h3>${H(TX.next)}</h3>
          ${recs.length ? `<ol class="yl-recs">${recs.map((r) => `<li><div><b>${r.c.icon} ${esc(r.li < 0 ? `${L(TX.exam)}: ${T(r.c.title)}` : T(r.c.lessons[r.li].title))}</b>
            <small class="muted">${esc(T(r.c.title))}</small>
            <small><b>${H(TX.why)}</b> ${r.why.map((w) => H(w)).join("; ")}.</small></div>
            <button type="button" class="btn btn-primary btn-sm" data-open="${r.c.id}" data-li="${r.li}">${H(TX.start)} →</button></li>`).join("")}</ol>` : `<p class="muted">${H(TX.noData)}</p>`}
        </section>
        <section class="ps-box"><h3>${H(TX.prefs)}</h3>
          <p class="small"><b>${H(TX.mins)}</b></p>${seg("mins", [5, 10, 20, 30].map((m) => [m, `${m} ${L(TX.min)}`]), st.pref.mins)}
          <p class="small"><b>${H(TX.fmt)}</b></p>${seg("fmt", Object.entries(TX.fmts).map(([k, v]) => [k, L(v)]), st.pref.fmt)}
          <p class="small"><b>${H(TX.goal)}</b></p>${seg("goal", Object.entries(TX.goals).map(([k, v]) => [k, L(v)]), st.pref.goal)}
          <p class="small"><b>${H(TX.sdg)}</b></p><div class="yl-seg">${usedSdg.filter((g) => SDG[g]).map((g) => `<button type="button" class="ps-sdgchip ${st.pref.sdg.includes(g) ? "on" : ""}" style="--sc:${SDG[g].c};--si:${SDG[g].i || "#fff"}" aria-pressed="${st.pref.sdg.includes(g)}" data-sdgp="${g}"><b>${g}</b> ${H(SDG[g].n)}</button>`).join("")}</div>
        </section>
      </div>
      <section class="ps-box"><h3>${H(TX.plan)}</h3><ol class="yl-plan">${plan}</ol>
        <button type="button" class="btn btn-ghost btn-sm" data-replan><i class="fa-solid fa-rotate" aria-hidden="true"></i> ${H(TX.planNew)}</button></section>
      <div class="ps-grid">
        <section class="ps-box"><h3>${H(TX.mastery)}</h3><p class="small muted">${H(TX.masteryLead)}</p>
          ${kcs.length ? `<ul class="yl-kc">${kcs.map(({ c, k }) => `<li><span>${c.icon} ${esc(T(c.title))}</span><span class="ps-bar" aria-hidden="true"><i style="width:${(k.p * 100).toFixed(0)}%;background:${k.p >= 0.95 ? "#15803d" : k.p >= 0.6 ? "#0369a1" : "#b45309"}"></i></span><b>${Math.round(k.p * 100)} %</b><small class="muted">${k.n} ${H(TX.answers)}</small></li>`).join("")}</ul>` : `<p class="muted">${H(TX.noData)}</p>`}
          ${weak.length ? `<p class="small"><b>${H(TX.review)}:</b> ${weak.map((x) => esc(T(x.c.title))).join(", ")} · <a href="#takror">${H(TX.toReview)} →</a></p>` : ""}
        </section>
        <section class="ps-box"><h3>${H(TX.twin)}</h3><p class="small muted">${H(TX.twinLead)}</p>
          <ul class="yl-ins">${insights().map(([i, t]) => `<li><span aria-hidden="true">${i}</span> <span>${t}</span></li>`).join("")}</ul></section>
      </div>
      <section class="ps-box" id="ylModes"><h3>${H(TX.modes)}</h3><p class="small muted">${H(TX.modesLead)}</p>
        <div class="yl-modes">
          <div class="yl-mode"><b>${H(TX.lite)}</b><small>${H(TX.liteD)}</small>${seg("lite", [["auto", L(TX.auto)], ["on", L(TX.on)], ["off", L(TX.off)]], M.lite)}${M.lite === "auto" && live ? `<small class="yl-note">${H(TX.autoNow)}</small>` : ""}</div>
          <div class="yl-mode"><b>${H(TX.focus)}</b><small>${H(TX.focusD)}</small>${seg("focus", [["1", L(TX.on)], ["0", L(TX.off)]], M.focus ? "1" : "0")}</div>
          <div class="yl-mode"><b>${H(TX.ruler)}</b><small>${H(TX.rulerD)}</small>${seg("ruler", [["1", L(TX.on)], ["0", L(TX.off)]], M.ruler ? "1" : "0")}</div>
          <div class="yl-mode"><b>${H(TX.timer)}</b><small>${H(TX.timerD)}</small><div data-timer>${timerHtml()}</div></div>
        </div>
        ${window.EkoPlus ? `<button type="button" class="btn btn-ghost btn-sm" data-a11y><i class="fa-solid fa-universal-access" aria-hidden="true"></i> ${H(TX.more)}</button>` : ""}
      </section>`;
  }
  let tm = 0;
  function later() { clearTimeout(tm); tm = setTimeout(() => { if (SEC && !SEC.hidden && SEC.offsetParent !== null) render(); }, 500); }

  if (ROOT) {
    ROOT.addEventListener("click", (e) => {
      const p = e.target.closest("[data-pref]");
      if (p) {
        const k = p.dataset.pref, v = p.dataset.v;
        if (k === "mins") st.pref.mins = +v;
        else if (k === "fmt" || k === "goal") st.pref[k] = v;
        else if (k === "lite") { M.lite = v; saveM(); applyModes(); render(); return; }
        else if (k === "focus" || k === "ruler") { M[k] = v === "1"; saveM(); applyModes(); render(); return; }
        if (k === "mins" || k === "fmt" || k === "goal") makePlan();
        save(); render(); return;
      }
      const g = e.target.closest("[data-sdgp]");
      if (g) { const n = +g.dataset.sdgp; st.pref.sdg = st.pref.sdg.includes(n) ? st.pref.sdg.filter((x) => x !== n) : st.pref.sdg.concat(n); makePlan(); save(); render(); return; }
      if (e.target.closest("[data-replan]")) { makePlan(); render(); return; }
      const o = e.target.closest("[data-open]");
      if (o) { openRec(o.dataset.open, +o.dataset.li); return; }
      if (e.target.closest("[data-a11y]")) { EkoPlus.settings(); return; }
      const ts = e.target.closest("[data-tstart]");
      if (ts) { const total = +ts.dataset.tstart * 60; tmr = { total, left: total, t0: Date.now(), paid: 0, run: true }; tmr.iv = setInterval(tick, 1000); pillSync(); ROOT.querySelector("[data-timer]").innerHTML = timerHtml(); return; }
      if (e.target.closest("[data-tpause]") && tmr) {
        if (tmr.run) { tmr.run = false; tmr.pausedAt = Date.now(); } else { tmr.paid += Math.round((Date.now() - tmr.pausedAt) / 1000); tmr.run = true; }
        ROOT.querySelector("[data-timer]").innerHTML = timerHtml(); return;
      }
      if (e.target.closest("[data-tstop]") && tmr) { clearInterval(tmr.iv); tmr = null; pillSync(); ROOT.querySelector("[data-timer]").innerHTML = timerHtml(); }
    });
    ROOT.addEventListener("change", (e) => {
      const c = e.target.closest("[data-plan]");
      if (!c || !st.plan) return;
      for (const d of st.plan.days) for (const it of d.items) if (it.id === c.dataset.plan) {
        it.done = c.checked;
        if (it.done && !it.xp) { it.xp = 1; const a = App(); if (a && a.addXp) a.addXp(2, L(TX.planDone)); }
      }
      save();
    });
  }
  window.addEventListener("hashchange", () => { if (location.hash === "#yol") render(); if (!location.hash || location.hash === "#bosh") welcomeBack(); });
  window.addEventListener("eko:lang", () => { render(); welcomeBack(); });
  window.addEventListener("eko:stage", () => { makePlan(); render(); });
  render();
  /* Танаффусни аниқлаш учун олдинги ташриф вақти керак: биринчи ишга тушишда ҳозирги вақт ёзилади */
  if (!st.last) { st.last = Date.now(); save(); }
  welcomeBack();

  window.EkoPath = { recommend, mastery: (cid) => kc(cid).p, render, observe };
})();
