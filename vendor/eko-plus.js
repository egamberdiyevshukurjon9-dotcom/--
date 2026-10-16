/* Экомун 2.6 — умумий қулайликлар:
   🔍 глобал қидирув (бўлимлар, дарслар, 3D тажрибалар, луғат; овозли қидирув, тарих, таклифлар; Ctrl+K ёки «/»),
   👋 биринчи очилишдаги таништирув (онбординг, суриб варақлаш),
   ⚙️ «Кўриниш ва қулайлик»: ҳарф ўлчами, юқори контраст, ҳаракатни камайтириш, ўқиш учун оралиқ,
   📱 телефонда пастки навигация панели.
   Матнлар uz/ru/en кўринишида шу файлда; лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const lang = () => (EL() ? EL().lang : "cyr");
  const tr = (s) => (EL() ? EL().tr(s) : s);
  const t3 = (uz, ru, en) => ({ uz, ru, en });
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
  const get = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  const root = document.documentElement;
  const stage = () => (window.EkoProfile && EkoProfile.stage) || (root.classList.contains("stage-maktab") ? "maktab" : "uni");
  const reduce = () => root.classList.contains("a11y-rm") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const go = (id) => { if (window.EkoNav) EkoNav.go(id); else location.hash = "#" + id; };

  const TX = {
    search: t3("Қидириш", "Поиск", "Search"),
    ph: t3("Бўлим, дарс, тажриба ёки атама…", "Раздел, урок, опыт или термин…", "Section, lesson, experiment or term…"),
    voice: t3("Овоз билан қидириш", "Голосовой поиск", "Voice search"),
    listen: t3("Гапиринг…", "Говорите…", "Speak…"),
    close: t3("Ёпиш", "Закрыть", "Close"),
    recent: t3("Сўнгги қидирувлар", "Недавние запросы", "Recent searches"),
    clear: t3("Тозалаш", "Очистить", "Clear"),
    sugg: t3("Тавсия этилади", "Рекомендуем", "Suggestions"),
    none: t3("Ҳеч нарса топилмади. Бошқа сўз ёки лотин/кирилл ёзувида синаб кўринг.", "Ничего не найдено. Попробуйте другое слово.", "Nothing found. Try another word."),
    gSec: t3("Бўлимлар", "Разделы", "Sections"),
    gLes: t3("Дарслар", "Уроки", "Lessons"),
    gCrs: t3("Курслар", "Курсы", "Courses"),
    gLab: t3("3D тажрибалар", "3D-опыты", "3D experiments"),
    gGl: t3("Луғат", "Словарь", "Glossary"),
    keys: t3("↑↓ танлаш · Enter очиш · Esc ёпиш", "↑↓ выбор · Enter открыть · Esc закрыть", "↑↓ select · Enter open · Esc close"),
    set: t3("Кўриниш ва қулайлик", "Вид и доступность", "Display and accessibility"),
    fs: t3("Ҳарф ўлчами", "Размер шрифта", "Text size"),
    hc: t3("Юқори контраст", "Высокий контраст", "High contrast"),
    hcD: t3("Матн ва чегаралар яққолроқ (кўриши заиф фойдаланувчилар учун)", "Текст и границы чётче (для слабовидящих)", "Sharper text and borders (low vision)"),
    rm: t3("Ҳаракатни камайтириш", "Меньше анимации", "Reduce motion"),
    rmD: t3("Анимация ва ўтишлар ўчирилади", "Анимации и переходы отключаются", "Animations and transitions are turned off"),
    sp: t3("Ўқиш учун оралиқ", "Удобные интервалы", "Reading spacing"),
    spD: t3("Ҳарф ва қаторлар орасини кенгайтиради (дислексия учун қулай)", "Увеличивает межбуквенные и междустрочные интервалы (удобно при дислексии)", "Wider letter and line spacing (dyslexia-friendly)"),
    theme: t3("Тунги режим", "Тёмная тема", "Dark mode"),
    tour: t3("Таништирувни қайта кўриш", "Показать знакомство снова", "Replay the intro"),
    reset: t3("Асл ҳолига қайтариш", "Сбросить", "Reset"),
    home: t3("Бош", "Главная", "Home"),
    courses: t3("Курслар", "Курсы", "Courses"),
    lab: t3("3D лаб", "3D лаб", "3D lab"),
    me: t3("Профил", "Профиль", "Profile"),
    skip: t3("Ўтказиб юбориш", "Пропустить", "Skip"),
    next: t3("Кейинги", "Далее", "Next"),
    start: t3("Бошлаймиз!", "Начинаем!", "Let's start!")
  };

  /* ================= ⚙️ Кўриниш ва қулайлик ================= */
  const AK = "ekotalim:a11y";
  const A = Object.assign({ fs: 100, hc: false, rm: false, sp: false }, get(AK, {}));
  function applyA11y() {
    root.style.fontSize = A.fs === 100 ? "" : A.fs + "%";
    root.classList.toggle("a11y-hc", !!A.hc);
    root.classList.toggle("a11y-rm", !!A.rm);
    root.classList.toggle("a11y-sp", !!A.sp);
  }
  applyA11y();

  /* ================= Умумий диалог ================= */
  let lastFocus = null;
  function dialog(cls, label) {
    const d = document.createElement("div");
    d.className = "plus-dlg " + cls;
    d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-label", label);
    d.setAttribute("data-notr", ""); d.hidden = true;
    d.addEventListener("click", (e) => { if (e.target === d) close(d); });
    d.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); close(d); }
      if (e.key === "Tab") { const f = [...d.querySelectorAll("button, input, a[href], [tabindex='0']")].filter((x) => !x.disabled && x.offsetParent); if (!f.length) return; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    });
    document.body.appendChild(d);
    return d;
  }
  function open(d) { lastFocus = document.activeElement; d.hidden = false; root.classList.add("plus-lock"); requestAnimationFrame(() => d.classList.add("on")); }
  function close(d) { d.classList.remove("on"); root.classList.remove("plus-lock"); setTimeout(() => { d.hidden = true; }, reduce() ? 0 : 180); if (d.onclose) d.onclose(); if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  /* ================= 🔍 Глобал қидирув ================= */
  const HK = "ekotalim:search-hist";
  const SUGG = { uni: ["иқлим", "Минамата", "Energiewende", "AQI", "чиқинди", "сув сифати", "Карсон", "қонун"], maktab: ["сув", "чиқинди", "дарахт", "Япония", "Корея", "ҳаво", "компост", "ҳайвонлар"] };
  const S = dialog("plus-search", L(TX.search));
  let hits = [], sel = -1, rec = null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function renderSearchShell() {
    S.innerHTML = `<div class="plus-box">
      <div class="plus-sbar"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input type="search" id="plusQ" placeholder="${H(TX.ph)}" aria-label="${H(TX.search)}" autocomplete="off" enterkeyhint="search" role="combobox" aria-expanded="true" aria-controls="plusRes">
        ${SR ? `<button type="button" class="plus-ib" id="plusMic" aria-label="${H(TX.voice)}" title="${H(TX.voice)}"><i class="fa-solid fa-microphone"></i></button>` : ""}
        <button type="button" class="plus-ib" id="plusX" aria-label="${H(TX.close)}"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="plus-res" id="plusRes" role="listbox"></div>
      <p class="plus-keys small muted">${H(TX.keys)}</p></div>`;
    const q = S.querySelector("#plusQ");
    q.addEventListener("input", () => run(q.value));
    q.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!hits.length) return; sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length; mark(); }
      if (e.key === "Enter") { e.preventDefault(); const h = hits[sel >= 0 ? sel : 0]; if (h) pick(h, q.value); }
    });
    S.querySelector("#plusX").addEventListener("click", () => close(S));
    const mic = S.querySelector("#plusMic");
    if (mic) mic.addEventListener("click", () => voice(mic, q));
    S.querySelector("#plusRes").addEventListener("click", (e) => {
      const c = e.target.closest("[data-q]"); if (c) { q.value = c.dataset.q; run(q.value); q.focus(); return; }
      if (e.target.closest("[data-hclr]")) { put(HK, []); run(""); return; }
      const r = e.target.closest("[data-i]"); if (r) pick(hits[+r.dataset.i], q.value);
    });
  }
  function voice(btn, q) {
    if (rec) { rec.stop(); return; }
    try {
      rec = new SR(); rec.lang = { ru: "ru-RU", en: "en-US" }[lang()] || "uz-UZ"; rec.interimResults = true;
      btn.classList.add("on"); q.placeholder = L(TX.listen);
      rec.onresult = (e) => { q.value = [...e.results].map((r) => r[0].transcript).join(" "); run(q.value); };
      rec.onend = rec.onerror = () => { btn.classList.remove("on"); q.placeholder = L(TX.ph); rec = null; };
      rec.start();
    } catch (e) { rec = null; btn.classList.remove("on"); }
  }
  const has = (hay, q) => !!hay && (EL() ? EL().matches(String(hay), q) : String(hay).toLowerCase().includes(q.toLowerCase()));
  function index() {
    const out = [], st = stage();
    document.querySelectorAll(".app-grid a.app").forEach((a) => {
      const s = a.dataset.stage; if (s && s !== st) return;
      const b = a.querySelector("b"), sm = a.querySelector("small"), ic = a.querySelector(".app-ic i");
      out.push({ g: "sec", t: b ? b.textContent : "", d: sm ? sm.textContent : "", ic: ic ? `<i class="${ic.className}"></i>` : "📌", c: a.style.getPropertyValue("--c"), go: () => go(a.getAttribute("href").slice(1)) });
    });
    const app = window.EkoApp, cs = (app && app.courses) || [];
    const cst = (c) => c.stage || (c.audience === "bola" ? "maktab" : "uni");
    cs.filter((c) => cst(c) === st).forEach((c) => {
      out.push({ g: "crs", t: c.title, d: c.desc, ic: c.icon, go: () => { go("kurslar"); setTimeout(() => { const el = document.getElementById("crs-" + c.id); if (el) el.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" }); }, 120); } });
      c.lessons.forEach((l, i) => out.push({ g: "les", t: l.title, d: c.title, body: [l.goal, ...(l.body || [])].join(" "), ic: c.icon, go: () => { if (app.openLesson) app.openLesson(c.id, i); } }));
    });
    const lab = window.EkoLab3D;
    if (lab && lab.list) lab.list.forEach((x) => out.push({ g: "lab", t: L(x.name), d: L(x.q), ic: x.icon + (x.flag || ""), go: () => { go("lab3d"); setTimeout(() => lab.open(x.id), 60); } }));
    (window.EkoGloss || []).forEach((r) => out.push({ g: "gl", t: r[0], d: `${r[1]} · ${r[2]}`, alt: r[1] + " " + r[2], ic: "📖", go: null }));
    return out;
  }
  const GN = { sec: TX.gSec, crs: TX.gCrs, les: TX.gLes, lab: TX.gLab, gl: TX.gGl };
  const LIM = { sec: 6, crs: 4, les: 8, lab: 5, gl: 6 };
  function hl(s, q) {
    const e = esc(s); if (!q) return e;
    const i = s.toLowerCase().indexOf(q.toLowerCase());
    return i < 0 ? e : esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + q.length)) + "</mark>" + esc(s.slice(i + q.length));
  }
  function run(raw) {
    const box = S.querySelector("#plusRes"), q = raw.trim();
    sel = -1;
    if (q.length < 2) {
      hits = [];
      const hist = get(HK, []);
      box.innerHTML = (hist.length ? `<div class="plus-g"><h4>${H(TX.recent)} <button type="button" class="plus-link" data-hclr>${H(TX.clear)}</button></h4><div class="plus-chips">${hist.map((h) => `<button type="button" class="chip" data-q="${esc(h)}"><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> ${esc(h)}</button>`).join("")}</div></div>` : "")
        + `<div class="plus-g"><h4>${H(TX.sugg)}</h4><div class="plus-chips">${SUGG[stage()].map((h) => `<button type="button" class="chip" data-q="${esc(L(h))}">${esc(L(h))}</button>`).join("")}</div></div>`;
      return;
    }
    const all = index(), groups = {};
    all.forEach((x) => {
      let s = 0;
      if (has(x.t, q)) s = 3; else if (has(x.d, q) || has(x.alt, q)) s = 2; else if (x.body && has(x.body, q)) s = 1;
      if (s) (groups[x.g] = groups[x.g] || []).push([s, x]);
    });
    hits = [];
    const html = Object.keys(GN).filter((g) => groups[g]).map((g) => {
      const list = groups[g].sort((a, b) => b[0] - a[0]).slice(0, LIM[g]).map(([, x]) => x);
      return `<div class="plus-g"><h4>${H(GN[g])} <small>${groups[g].length}</small></h4>${list.map((x) => { hits.push(x); const i = hits.length - 1; return `<button type="button" class="plus-hit${x.go ? "" : " static"}" role="option" data-i="${i}" id="ph${i}"><span class="plus-hi" ${x.c ? `style="--c:${x.c}"` : ""}>${x.ic}</span><span><b>${hl(L(x.t), q)}</b><small>${hl(L(x.d || "").slice(0, 120), q)}</small></span>${x.go ? '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>' : ""}</button>`; }).join("")}</div>`;
    }).join("");
    box.innerHTML = html || `<p class="muted plus-none">${H(TX.none)}</p>`;
  }
  function mark() { S.querySelectorAll(".plus-hit").forEach((b) => b.classList.toggle("sel", +b.dataset.i === sel)); const b = S.querySelector("#ph" + sel); if (b) { b.scrollIntoView({ block: "nearest" }); S.querySelector("#plusQ").setAttribute("aria-activedescendant", b.id); } }
  function pick(h, q) {
    if (!h) return;
    q = q.trim();
    if (q.length >= 2) { const hist = get(HK, []).filter((x) => x.toLowerCase() !== q.toLowerCase()); hist.unshift(q); put(HK, hist.slice(0, 8)); }
    if (!h.go) return;
    close(S); setTimeout(h.go, 30);
  }
  function openSearch(q) {
    renderSearchShell(); open(S);
    const inp = S.querySelector("#plusQ"); inp.value = q || ""; run(inp.value);
    setTimeout(() => inp.focus(), 50);
  }
  S.onclose = () => { if (rec) rec.stop(); };
  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase(), typing = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
    else if (e.key === "/" && !typing && S.hidden) { e.preventDefault(); openSearch(); }
  });

  /* ================= ⚙️ Созламалар ойнаси ================= */
  const P = dialog("plus-set", L(TX.set));
  function renderSet() {
    const dark = root.dataset.theme === "dark" || (!root.dataset.theme && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
    const sw = (k, t, d, on) => `<label class="plus-sw"><span><b>${H(t)}</b>${d ? `<small>${H(d)}</small>` : ""}</span><input type="checkbox" data-a="${k}" ${on ? "checked" : ""}><i aria-hidden="true"></i></label>`;
    P.innerHTML = `<div class="plus-box plus-setbox">
      <div class="plus-head"><h3><i class="fa-solid fa-universal-access" aria-hidden="true"></i> ${H(TX.set)}</h3><button type="button" class="plus-ib" data-x aria-label="${H(TX.close)}"><i class="fa-solid fa-xmark"></i></button></div>
      <label class="plus-fs"><b>${H(TX.fs)}: <output>${A.fs}%</output></b>
        <span><small aria-hidden="true">A</small><input type="range" min="85" max="140" step="5" value="${A.fs}" data-fs aria-label="${H(TX.fs)}"><big aria-hidden="true">A</big></span></label>
      <p class="plus-prev" style="font-size:${A.fs / 100}rem">Табиатни асраш билимдан бошланади. 🌱</p>
      ${sw("dark", TX.theme, null, dark)}
      ${sw("hc", TX.hc, TX.hcD, A.hc)}
      ${sw("rm", TX.rm, TX.rmD, A.rm)}
      ${sw("sp", TX.sp, TX.spD, A.sp)}
      <div class="plus-row"><button type="button" class="btn btn-ghost" data-tour><i class="fa-solid fa-play" aria-hidden="true"></i> ${H(TX.tour)}</button><button type="button" class="btn btn-ghost" data-reset>${H(TX.reset)}</button></div>
    </div>`;
    P.querySelector("[data-x]").addEventListener("click", () => close(P));
    const fs = P.querySelector("[data-fs]");
    fs.addEventListener("input", () => { A.fs = +fs.value; P.querySelector("output").textContent = A.fs + "%"; P.querySelector(".plus-prev").style.fontSize = A.fs / 100 + "rem"; applyA11y(); put(AK, A); });
    P.querySelectorAll("[data-a]").forEach((c) => c.addEventListener("change", () => {
      if (c.dataset.a === "dark") { const b = document.getElementById("themeBtn"); const now = root.dataset.theme === "dark" || (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches); if (b && now !== c.checked) b.click(); return; }
      A[c.dataset.a] = c.checked; applyA11y(); put(AK, A);
    }));
    P.querySelector("[data-tour]").addEventListener("click", () => { close(P); setTimeout(() => tour(true), 200); });
    P.querySelector("[data-reset]").addEventListener("click", () => { Object.assign(A, { fs: 100, hc: false, rm: false, sp: false }); applyA11y(); put(AK, A); renderSet(); });
  }
  function openSet() { renderSet(); open(P); setTimeout(() => { const f = P.querySelector("[data-fs]"); if (f) f.focus(); }, 50); }

  /* ================= Юқори панелдаги тугмалар ================= */
  function topButtons() {
    const theme = document.getElementById("themeBtn");
    if (!theme || document.getElementById("plusSearchBtn")) return;
    const mk = (id, ic, t, fn) => { const b = document.createElement("button"); b.type = "button"; b.id = id; b.className = "theme-btn plus-top"; b.setAttribute("aria-label", L(t)); b.title = L(t); b.innerHTML = `<i class="fa-solid ${ic}" aria-hidden="true"></i>`; b.addEventListener("click", fn); return b; };
    theme.before(mk("plusSearchBtn", "fa-magnifying-glass", TX.search, () => openSearch()));
    theme.before(mk("plusSetBtn", "fa-universal-access", TX.set, openSet));
  }

  /* ================= 📱 Пастки навигация (телефон) ================= */
  function bottomNav() {
    if (document.getElementById("plusNav")) return;
    const n = document.createElement("nav");
    n.id = "plusNav"; n.className = "plus-nav"; n.setAttribute("aria-label", "Ekomun"); n.setAttribute("data-notr", "");
    document.body.appendChild(n);
    const draw = () => {
      const h = location.hash.slice(1) || "bosh";
      const it = [["bosh", "fa-house", TX.home], ["kurslar", "fa-graduation-cap", TX.courses], ["lab3d", "fa-cube", TX.lab], ["?s", "fa-magnifying-glass", TX.search], ["?me", "fa-user", TX.me]];
      n.innerHTML = it.map(([id, ic, t]) => id[0] === "?" ? `<button type="button" data-b="${id}"><i class="fa-solid ${ic}" aria-hidden="true"></i><span>${H(t)}</span></button>` : `<a href="#${id}" ${h === id ? 'aria-current="page"' : ""}><i class="fa-solid ${ic}" aria-hidden="true"></i><span>${H(t)}</span></a>`).join("");
    };
    draw();
    n.addEventListener("click", (e) => {
      const b = e.target.closest("[data-b]"); if (!b) return;
      if (b.dataset.b === "?s") openSearch();
      if (b.dataset.b === "?me") { const p = document.getElementById("profileBtn"); if (p && !p.hidden) p.click(); else openSet(); }
    });
    const upd = () => setTimeout(draw, 0);
    window.addEventListener("popstate", upd);
    document.addEventListener("click", (e) => { if (e.target.closest && e.target.closest("a[href^='#']")) upd(); });
    window.addEventListener("eko:lang", draw);
  }

  /* ================= 👋 Онбординг (биринчи очилишда) ================= */
  const OK = "ekotalim:onboard";
  const SLIDES = [
    ["🌱", t3("Экомунга хуш келибсиз!", "Добро пожаловать в Экомун!", "Welcome to Ekomun!"), t3("Экология бўйича бепул платформа: курслар, ўйинлар, 3D лаборатория ва ҳақиқий маълумотлар — интернетсиз ҳам ишлайди.", "Бесплатная платформа по экологии: курсы, игры, 3D-лаборатория и реальные данные — работает и без интернета.", "A free ecology platform: courses, games, a 3D lab and real data — it works offline too."), "#10b981"],
    ["🎒🎓", t3("Сизга мос босқич", "Ваш уровень", "Your stage"), t3("Мактаб ўқувчилари ўйнаб ўрганади, талабалар эса илмий далиллар, формулалар ва кейслар билан ишлайди.", "Школьники учатся играя, студенты работают с научными данными, формулами и кейсами.", "School pupils learn by playing; students work with evidence, formulas and cases."), "#6366f1"],
    ["🌐", t3("Дунё тажрибаси", "Мировой опыт", "World experience"), t3("АҚШ, Германия, Япония ва Корея тажрибаси: янги курс ва 20 та ҳаракатли 3D тажриба (AQI, Energiewende, Минамата, Чхонгечхон).", "Опыт США, Германии, Японии и Кореи: новый курс и 20 живых 3D-опытов (AQI, Energiewende, Минамата, Чхонгечхон).", "Lessons from the USA, Germany, Japan and Korea: a new course and 20 live 3D experiments."), "#0ea5e9"],
    ["🔍", t3("Тез топинг, қулай ўқинг", "Быстрый поиск, удобное чтение", "Find fast, read comfortably"), t3("Юқоридаги 🔍 тугмаси ҳамма нарсани топади (овоз билан ҳам). ♿ тугмасида ҳарф ўлчами, контраст ва тунги режим бор.", "Кнопка 🔍 вверху найдёт всё (и голосом). В кнопке ♿ — размер шрифта, контраст и тёмная тема.", "The 🔍 button finds anything (even by voice). The ♿ button has text size, contrast and dark mode."), "#f59e0b"]
  ];
  const O = dialog("plus-tour", "Ekomun");
  function tour(force) {
    if (!force && get(OK, 0)) return;
    let i = 0, x0 = null;
    const draw = () => {
      const [ic, t, d, c] = SLIDES[i], last = i === SLIDES.length - 1;
      O.innerHTML = `<div class="plus-box plus-tbox" style="--c:${c}">
        <div class="plus-tart" aria-hidden="true"><span>${ic}</span></div>
        <h3>${H(t)}</h3><p>${H(d)}</p>
        <div class="plus-dots" role="tablist">${SLIDES.map((_, k) => `<button type="button" role="tab" aria-selected="${k === i}" aria-label="${k + 1}" data-k="${k}" class="${k === i ? "on" : ""}"></button>`).join("")}</div>
        <div class="plus-row"><button type="button" class="btn btn-ghost" data-skip>${H(TX.skip)}</button><button type="button" class="btn btn-primary" data-next>${H(last ? TX.start : TX.next)} ${last ? "" : "→"}</button></div></div>`;
      O.querySelector("[data-next]").addEventListener("click", () => (last ? done() : (i++, draw())));
      O.querySelector("[data-skip]").addEventListener("click", done);
      O.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { i = +b.dataset.k; draw(); }));
      setTimeout(() => { const b = O.querySelector("[data-next]"); if (b) b.focus(); }, 30);
    };
    const done = () => { put(OK, 1); close(O); };
    O.ontouchstart = (e) => { x0 = e.touches[0].clientX; };
    O.ontouchend = (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) { i = Math.max(0, Math.min(SLIDES.length - 1, i + (dx < 0 ? 1 : -1))); draw(); } };
    O.onclose = () => put(OK, 1);
    draw(); open(O);
  }
  const hasProfile = () => { try { const p = JSON.parse(localStorage.getItem("ekotalim:profile") || "null"); return !!(p && p.by); } catch (e) { return false; } };

  /* Бош саҳифадаги курс иконкаси: курслар саҳифасини очиб, шу курсга олиб боради */
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[data-crs]"); if (!a) return;
    setTimeout(() => { const el = document.getElementById("crs-" + a.dataset.crs); if (el) el.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" }); }, 150);
  });
  function init() {
    topButtons();
    bottomNav();
    if (hasProfile()) setTimeout(() => tour(false), 900);
    else window.addEventListener("eko:stage", () => { if (hasProfile()) setTimeout(() => tour(false), 700); });
    window.addEventListener("eko:lang", () => { ["plusSearchBtn", "plusSetBtn"].forEach((id, k) => { const b = document.getElementById(id); if (b) { const t = L(k ? TX.set : TX.search); b.title = t; b.setAttribute("aria-label", t); } }); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.EkoPlus = { search: openSearch, settings: openSet, tour: () => tour(true) };
})();
