/* Экомун — 🏆 «Ҳафталик турнир», вилоятлар рейтинги, дўстни таклиф қилиш ва жамоа эълонлари.
   • Ҳар ҳафта (ISO ҳафта, душанбадан) ҳамма учун бир хил 10 савол: босқичга қараб мактаб ёки
     университет курсларидан. Ҳар бир савол 20 сония; тўғри жавоб 100 балл + тезлик бонуси.
   • Ҳафтада битта расмий уриниш (машқ — чексиз). Натижа лақаб билан серверга юборилади:
     ҳақиқий исм, почта ёки телефон сўралмайди. Вилоятлар рейтинги — ўртача балл.
   • Дўстни таклиф қилиш: ҳавола ?ref=КОД. Дўст биринчи дарсини тугатгач, сизга +25 XP.
   • Эълонлар: бошқарув марказидан ёзилади, «Янгиликлар» бўлими ва бош саҳифада кўринади.
   Ҳолат: localStorage «ekotalim:turnir», «ekotalim:ref», «ekotalim:news». */
(() => {
  "use strict";
  const SEC = document.getElementById("turnir");
  const ROOT = document.getElementById("trRoot");
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
  const addXp = (n, why) => { const a = App(); if (a && a.addXp) a.addXp(n, L(why)); };
  const hasServer = () => /^https?:$/.test(location.protocol) && location.hostname !== "appassets.androidplatform.net";
  const site = () => (hasServer() ? location.origin : ((window.EKO_VERSION && EKO_VERSION.site) || "https://ekomun.onrender.com"));
  const vid = () => { try { const v = localStorage.getItem("ekotalim:vid") || ""; return /^[a-z0-9]{12,32}$/.test(v) ? v : ""; } catch (e) { return ""; } };
  const stage = () => (root.classList.contains("stage-maktab") ? "maktab" : "uni");
  const courseStage = (c) => c.stage || (c.audience === "bola" ? "maktab" : "uni");
  const reduce = () => root.classList.contains("a11y-rm") || root.classList.contains("eko-focus") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  async function api(path, body) {
    const r = await fetch(path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body) } : { credentials: "same-origin" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || "HTTP " + r.status); e.status = r.status; throw e; }
    return d;
  }

  /* ISO ҳафта рақами: «2026-W42» (сервер ҳам шундай ҳисоблайди) */
  function isoWeek(d = new Date()) {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
    return `${y}-W${String(w).padStart(2, "0")}`;
  }
  const prevWeek = () => { const d = new Date(); d.setDate(d.getDate() - 7); return isoWeek(d); };
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const shuffle = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const REG = [["tsh", "Тошкент шаҳри", "г. Ташкент", "Tashkent city"], ["tsv", "Тошкент вилояти", "Ташкентская обл.", "Tashkent region"], ["and", "Андижон", "Андижан", "Andijan"], ["bux", "Бухоро", "Бухара", "Bukhara"],
    ["jiz", "Жиззах", "Джизак", "Jizzakh"], ["qas", "Қашқадарё", "Кашкадарья", "Kashkadarya"], ["nav", "Навоий", "Навои", "Navoi"], ["nam", "Наманган", "Наманган", "Namangan"], ["sam", "Самарқанд", "Самарканд", "Samarkand"],
    ["sur", "Сурхондарё", "Сурхандарья", "Surkhandarya"], ["sir", "Сирдарё", "Сырдарья", "Syrdarya"], ["far", "Фарғона", "Фергана", "Fergana"], ["xor", "Хоразм", "Хорезм", "Khorezm"], ["qqr", "Қорақалпоғистон", "Каракалпакстан", "Karakalpakstan"], ["oth", "Бошқа / хориж", "Другое / за рубежом", "Other / abroad"]]
    .map(([id, uz, ru, en]) => ({ id, n: t3(uz, ru, en) }));
  const regName = (id) => { const r = REG.find((x) => x.id === id); return r ? L(r.n) : "—"; };

  const TX = {
    pill: t3("🏆 Ҳафталик турнир · рейтинг", "🏆 Еженедельный турнир · рейтинг", "🏆 Weekly tournament · leaderboard"),
    title: t3("Ҳафталик эко-турнир", "Еженедельный эко-турнир", "Weekly eco tournament"),
    lead: t3("Ҳар душанба янги 10 савол — бутун мамлакат бўйича бир хил. Тез ва тўғри жавоб беринг, вилоятингизни рейтингда кўтаринг!", "Каждый понедельник — 10 новых вопросов, одинаковых для всей страны. Отвечайте быстро и верно, поднимите свой регион в рейтинге!", "Every Monday brings 10 new questions, the same nationwide. Answer fast and right, and lift your region up the leaderboard!"),
    week: t3("Ҳафта", "Неделя", "Week"),
    rules: t3("10 савол · ҳар бирига 20 сония · тўғри жавоб 100 балл + тезлик бонуси (сонияси × 5)", "10 вопросов · по 20 секунд · верный ответ 100 баллов + бонус за скорость (секунды × 5)", "10 questions · 20 seconds each · a right answer gives 100 points + speed bonus (seconds × 5)"),
    nick: t3("Лақаб (рейтингда кўринади)", "Ник (виден в рейтинге)", "Nickname (shown on the leaderboard)"),
    nickKid: t3("Ҳақиқий исм ва фамилиянгизни ёзманг — ўйлаб топилган лақаб ёзинг.", "Не пишите настоящие имя и фамилию — придумайте ник.", "Don't use your real full name — make up a nickname."),
    region: t3("Вилоят", "Регион", "Region"),
    official: t3("Расмий уриниш", "Официальная попытка", "Official attempt"),
    practice: t3("Машқ", "Тренировка", "Practice"),
    usedUp: t3("Бу ҳафтадаги расмий уриниш ишлатилди. Машқ қилиш мумкин.", "Официальная попытка на этой неделе использована. Можно тренироваться.", "This week's official attempt is used. You can still practise."),
    needNick: t3("Лақаб 2–20 белги бўлсин.", "Ник — 2–20 символов.", "Nickname must be 2–20 characters."),
    q: t3("Савол", "Вопрос", "Question"),
    sec: t3("сония", "сек", "s"),
    right: t3("✅ Тўғри!", "✅ Верно!", "✅ Correct!"),
    wrong: t3("❌ Нотўғри. Тўғри жавоб:", "❌ Неверно. Правильный ответ:", "❌ Wrong. The right answer:"),
    timeout: t3("⏰ Вақт тугади. Тўғри жавоб:", "⏰ Время вышло. Правильный ответ:", "⏰ Time's up. The right answer:"),
    next: t3("Кейинги", "Далее", "Next"),
    finish: t3("Натижа", "Результат", "Result"),
    points: t3("балл", "баллов", "points"),
    correct: t3("тўғри жавоб", "верных ответов", "correct answers"),
    sent: t3("Натижа рейтингга юборилди", "Результат отправлен в рейтинг", "Score sent to the leaderboard"),
    offline: t3("Натижа шу қурилмада сақланди. Рейтинг веб-сайтда, интернет билан ишлайди.", "Результат сохранён на устройстве. Рейтинг работает на сайте при наличии интернета.", "Saved on this device. The leaderboard works on the website when online."),
    rank: t3("Ўрнингиз", "Ваше место", "Your rank"),
    of: t3("дан", "из", "of"),
    board: t3("📊 Рейтинг", "📊 Рейтинг", "📊 Leaderboard"),
    players: t3("Иштирокчилар", "Участники", "Players"),
    regions: t3("Вилоятлар", "Регионы", "Regions"),
    thisW: t3("Шу ҳафта", "Эта неделя", "This week"),
    lastW: t3("Ўтган ҳафта", "Прошлая неделя", "Last week"),
    empty: t3("Ҳали ҳеч ким қатнашмади — биринчи бўлинг!", "Пока никто не участвовал — будьте первым!", "No one has played yet — be the first!"),
    noNet: t3("Рейтинг интернет билан веб-сайтда кўринади.", "Рейтинг виден на сайте при наличии интернета.", "The leaderboard is visible on the website when online."),
    avg: t3("ўртача", "в среднем", "average"),
    my: t3("Менинг натижаларим", "Мои результаты", "My results"),
    again: t3("Яна машқ", "Ещё тренировка", "Practise again"),
    back: t3("← Турнирга", "← К турниру", "← Back to tournament"),
    xpWhy: t3("Ҳафталик турнир", "Еженедельный турнир", "Weekly tournament"),
    // реферал
    ref: t3("🎁 Дўстни таклиф қилиш", "🎁 Пригласить друга", "🎁 Invite a friend"),
    refLead: t3("Ҳаволани дўстингизга юборинг. У биринчи дарсини тугатганда сизга +25 XP, унга +10 XP берилади.", "Отправьте ссылку другу. Когда он пройдёт первый урок, вы получите +25 XP, а он — +10 XP.", "Send the link to a friend. When they finish their first lesson, you get +25 XP and they get +10 XP."),
    friends: t3("Таклиф билан келган дўстлар", "Друзей по приглашению", "Friends who joined"),
    copy: t3("Нусха олиш", "Копировать", "Copy"),
    share: t3("Улашиш", "Поделиться", "Share"),
    copied: t3("Ҳавола нусхаланди", "Ссылка скопирована", "Link copied"),
    refXp: t3("Дўстингиз Экомунга қўшилди", "Ваш друг присоединился к Ekomun", "Your friend joined Ekomun"),
    refIn: t3("Дўст таклифи билан келдингиз", "Вы пришли по приглашению друга", "You came by a friend's invite"),
    shareTxt: t3("Мен Экомунда экологияни ўйнаб ўрганяпман. Сен ҳам қўшил!", "Я изучаю экологию в Ekomun. Присоединяйся!", "I'm learning ecology on Ekomun. Join me!"),
    // эълонлар
    news: t3("📣 Экомун эълонлари", "📣 Объявления Ekomun", "📣 Ekomun announcements"),
    more: t3("Батафсил", "Подробнее", "More")
  };

  /* ===================== Ҳолат ===================== */
  const KEY = "ekotalim:turnir";
  let st = { nick: "", reg: "", w: {}, best: 0 };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };

  /* ===================== Саволлар ===================== */
  function bank(stg) {
    const out = [];
    ((App() && App().courses) || []).filter((c) => courseStage(c) === stg).forEach((c) => c.lessons.forEach((l, li) => (l.quiz || []).forEach((q, qi) => {
      if (Array.isArray(q.a) && q.a.length > 1 && q.a.length <= 5 && q.a[q.c] != null && String(q.q).length < 260) out.push({ cid: c.id, li, qi, q });
    })));
    return out;
  }
  function questions(week, stg, practice) {
    const b = bank(stg);
    const r = rng(practice ? (Math.random() * 4294967296) >>> 0 : hash(week + ":" + stg));
    return shuffle(b, r).slice(0, 10).map((x) => { const ord = shuffle(x.q.a.map((_, i) => i), r); return { q: x.q.q, a: ord.map((i) => x.q.a[i]), c: ord.indexOf(x.q.c) }; });
  }

  /* ===================== Ўйин ===================== */
  let game = null;
  const QT = 20;
  function start(practice) {
    const nick = String(st.nick || "").trim();
    if (!practice && (nick.length < 2 || nick.length > 20)) { toast(TX.needNick); const n = ROOT.querySelector("[data-nick]"); if (n) n.focus(); return; }
    const w = isoWeek(), stg = stage();
    if (!practice && st.w[w + ":" + stg]) { toast(TX.usedUp); return; }
    game = { practice, w, stg, qs: questions(w, stg, practice), i: 0, score: 0, ok: 0, t0: 0, ans: null, ms: 0 };
    if (!game.qs.length) { game = null; return; }
    if (!practice) { st.w[w + ":" + stg] = { score: 0, ok: 0, done: false, at: Date.now() }; save(); }
    ask();
  }
  let iv = 0;
  function ask() {
    clearInterval(iv);
    game.ans = null; game.t0 = Date.now();
    renderQ();
    iv = setInterval(() => {
      const left = QT - (Date.now() - game.t0) / 1000;
      const b = ROOT.querySelector("[data-tbar]"), s = ROOT.querySelector("[data-tsec]");
      if (b) b.style.width = Math.max(0, (left / QT) * 100) + "%";
      if (s) s.textContent = Math.max(0, Math.ceil(left));
      if (left <= 0) answer(-1);
    }, 200);
  }
  function answer(j) {
    if (!game || game.ans != null) return;
    clearInterval(iv);
    const q = game.qs[game.i], secs = Math.max(0, QT - (Date.now() - game.t0) / 1000);
    game.ms += Math.round((QT - secs) * 1000);
    game.ans = j;
    if (j === q.c) { game.ok++; game.score += 100 + Math.round(secs) * 5; }
    if (!game.practice) { const r = st.w[game.w + ":" + game.stg]; r.score = game.score; r.ok = game.ok; save(); }
    renderQ();
  }
  function renderQ() {
    const q = game.qs[game.i], done = game.ans != null;
    ROOT.querySelector("[data-panel]").innerHTML = `<section class="ps-box tr-game" aria-live="polite">
      <div class="tr-top"><span>${H(TX.q)} ${game.i + 1} / ${game.qs.length}${game.practice ? ` · ${H(TX.practice)}` : ""}</span><b>${game.score} ${H(TX.points)}</b></div>
      <div class="tr-timer" aria-hidden="true"><i data-tbar style="width:${done ? 0 : 100}%"></i></div>
      ${done ? "" : `<p class="small muted"><span data-tsec>${QT}</span> ${H(TX.sec)}</p>`}
      <h3 class="tr-q">${esc(T(q.q))}</h3>
      <div class="tr-opts">${q.a.map((a, j) => `<button type="button" class="tr-opt ${done ? (j === q.c ? "ok" : j === game.ans ? "bad" : "") : ""}" data-a="${j}"${done ? " disabled" : ""}><b>${String.fromCharCode(65 + j)}</b> ${esc(T(a))}</button>`).join("")}</div>
      ${done ? `<p class="tr-fb">${game.ans === q.c ? H(TX.right) : `${H(game.ans < 0 ? TX.timeout : TX.wrong)} <b>${esc(T(q.a[q.c]))}</b>`}</p>
        <button type="button" class="btn btn-primary" data-next>${H(game.i + 1 < game.qs.length ? TX.next : TX.finish)} →</button>` : ""}</section>`;
    const f = ROOT.querySelector(done ? "[data-next]" : ".tr-opt");
    if (f) f.focus({ preventScroll: true });
  }
  async function finish() {
    const g = game; game = null;
    let rankTxt = "", net = "";
    if (!g.practice) {
      const r = st.w[g.w + ":" + g.stg]; r.done = true; save();
      if (g.score > (st.best || 0)) st.best = g.score;
      save();
      addXp(10 + g.ok * 2, TX.xpWhy);
      if (hasServer() && navigator.onLine !== false) {
        try {
          const d = await api("/api/turnir", { vid: vid(), week: g.w, stage: g.stg, nick: st.nick.trim(), region: st.reg, score: g.score, correct: g.ok, ms: g.ms });
          r.sent = true; save(); net = L(TX.sent);
          if (d.rank) rankTxt = `${L(TX.rank)}: <b>${d.rank}</b> / ${d.total}`;
        } catch (e) { net = e.message || L(TX.offline); }
      } else net = L(TX.offline);
    }
    ROOT.querySelector("[data-panel]").innerHTML = `<section class="ps-box tr-end"><h3>🏁 ${H(TX.finish)}</h3>
      <p class="tr-big"><b>${g.score}</b> ${H(TX.points)}</p><p>${g.ok} / ${g.qs.length} ${H(TX.correct)}</p>
      ${rankTxt ? `<p>${rankTxt}</p>` : ""}${net ? `<p class="small muted">${esc(net)}</p>` : ""}
      <div class="ps-btns"><button type="button" class="btn btn-ghost" data-practice>${H(TX.again)}</button><button type="button" class="btn btn-primary" data-home>${H(TX.back)}</button></div></section>`;
    if (!g.practice) loadBoard(true);
  }

  /* ===================== Рейтинг ===================== */
  let board = { w: "this", tab: "p", data: {}, err: false };
  async function loadBoard(force) {
    if (!hasServer()) { board.err = true; renderBoard(); return; }
    const w = board.w === "this" ? isoWeek() : prevWeek(), k = w + ":" + stage();
    if (board.data[k] && !force) { renderBoard(); return; }
    try { board.data[k] = await api(`/api/turnir?w=${encodeURIComponent(w)}&stage=${stage()}&v=${vid()}`); board.err = false; }
    catch (e) { board.err = true; }
    renderBoard();
  }
  function renderBoard() {
    const box = ROOT && ROOT.querySelector("[data-board]");
    if (!box) return;
    const w = board.w === "this" ? isoWeek() : prevWeek(), d = board.data[w + ":" + stage()];
    const tabs = `<div class="yl-seg">${[["this", TX.thisW], ["last", TX.lastW]].map(([k, l]) => `<button type="button" class="chip ${board.w === k ? "active" : ""}" data-bw="${k}">${H(l)}</button>`).join("")}<span class="tr-sep"></span>${[["p", TX.players], ["r", TX.regions]].map(([k, l]) => `<button type="button" class="chip ${board.tab === k ? "active" : ""}" data-bt="${k}">${H(l)}</button>`).join("")}</div>`;
    let body;
    if (board.err && !d) body = `<p class="muted">${H(TX.noNet)}</p>`;
    else if (!d) body = `<p class="muted">…</p>`;
    else if (board.tab === "p") body = d.top && d.top.length ? `<ol class="tr-board">${d.top.map((x, i) => `<li class="${x.me ? "me" : ""}"><span class="tr-pos">${["🥇", "🥈", "🥉"][i] || i + 1}</span><b>${esc(x.nick)}</b><small class="muted">${esc(regName(x.region))}</small><span class="tr-pts">${x.score}</span></li>`).join("")}</ol>${d.me && d.me.rank > d.top.length ? `<p class="small">${H(TX.rank)}: <b>${d.me.rank}</b> / ${d.total}</p>` : ""}` : `<p class="muted">${H(TX.empty)}</p>`;
    else body = d.regions && d.regions.length ? `<ol class="tr-board">${d.regions.map((x, i) => `<li><span class="tr-pos">${["🥇", "🥈", "🥉"][i] || i + 1}</span><b>${esc(regName(x.region))}</b><small class="muted">${x.n} · ${H(TX.players).toLowerCase()}</small><span class="tr-pts">${x.avg} <small>${H(TX.avg)}</small></span></li>`).join("")}</ol>` : `<p class="muted">${H(TX.empty)}</p>`;
    box.innerHTML = tabs + body;
  }

  /* ===================== Дўстни таклиф қилиш ===================== */
  const RK = "ekotalim:ref";
  let ref = { code: "", credited: 0, count: 0, inc: "", claimed: false };
  try { ref = Object.assign(ref, JSON.parse(localStorage.getItem(RK)) || {}); } catch (e) { /* ignore */ }
  const saveRef = () => { try { localStorage.setItem(RK, JSON.stringify(ref)); } catch (e) { /* ignore */ } };
  if (!/^[A-Z2-9]{8}$/.test(ref.code)) {
    const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", b = crypto.getRandomValues(new Uint8Array(8));
    ref.code = [...b].map((x) => A[x % A.length]).join(""); saveRef();
  }
  /* Кирувчи ҳавола: ?ref=КОД */
  (() => {
    let p; try { p = new URLSearchParams(location.search).get("ref"); } catch (e) { p = null; }
    if (!p) return;
    p = p.toUpperCase();
    if (/^[A-Z2-9]{8}$/.test(p) && p !== ref.code && !ref.claimed && !ref.inc) { ref.inc = p; saveRef(); }
    try { const u = new URL(location.href); u.searchParams.delete("ref"); history.replaceState(null, "", u.pathname + u.search + u.hash); } catch (e) { /* ignore */ }
  })();
  async function claim() {
    if (!ref.inc || ref.claimed || !hasServer() || !vid()) return;
    try { await api("/api/ref/claim", { code: ref.inc, vid: vid() }); ref.claimed = true; saveRef(); addXp(10, TX.refIn); }
    catch (e) { if (e.status === 400 || e.status === 409) { ref.claimed = true; saveRef(); } }
  }
  window.addEventListener("eko:lessondone", claim);
  async function syncRef() {
    if (!hasServer() || !vid()) return;
    try {
      const d = await api(`/api/ref?c=${ref.code}&v=${vid()}`);
      ref.count = d.count || 0;
      const due = Math.min(20, ref.count) - ref.credited;
      if (due > 0) { ref.credited += due; addXp(25 * due, TX.refXp); }
      saveRef();
      const n = ROOT && ROOT.querySelector("[data-refn]"); if (n) n.textContent = ref.count;
    } catch (e) { /* ignore */ }
  }
  const refLink = () => `${site()}/?ref=${ref.code}`;

  /* ===================== Эълонлар ===================== */
  const NK = "ekotalim:news";
  let news = { items: [], seen: [], t: 0 };
  try { news = Object.assign(news, JSON.parse(localStorage.getItem(NK)) || {}); } catch (e) { /* ignore */ }
  const saveNews = () => { try { localStorage.setItem(NK, JSON.stringify(news)); } catch (e) { /* ignore */ } };
  const safeUrl = (u) => (/^https?:\/\/[^\s"'<>]+$/i.test(String(u || "")) ? String(u) : "");
  const forMe = (n) => !n.stage || n.stage === "all" || n.stage === stage();
  async function loadNews() {
    if (!hasServer() || navigator.onLine === false) return renderNews();
    try { const d = await api("/api/news"); news.items = Array.isArray(d.items) ? d.items.slice(0, 30) : []; news.t = Date.now(); saveNews(); } catch (e) { /* кеш */ }
    renderNews();
  }
  const fmtD = (t) => { const d = new Date(t); return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`; };
  function renderNews() {
    const list = news.items.filter(forMe);
    const sec = document.querySelector("#yangiliklar .wrap");
    let box = document.getElementById("ekNews");
    if (sec && list.length) {
      if (!box) { box = document.createElement("div"); box.id = "ekNews"; box.className = "tr-news"; box.setAttribute("data-notr", ""); sec.prepend(box); }
      box.innerHTML = `<h3>${H(TX.news)}</h3><ul>${list.slice(0, 6).map((n) => `<li class="${n.pinned ? "pin" : ""}"><b>${n.pinned ? "📌 " : ""}${esc(n.title)}</b> <small class="muted">${fmtD(n.at)}</small>${n.body ? `<p>${esc(n.body)}</p>` : ""}${safeUrl(n.link) ? `<a href="${esc(safeUrl(n.link))}" target="_blank" rel="noopener">${H(TX.more)} ↗</a>` : ""}</li>`).join("")}</ul>`;
    } else if (box) box.remove();
    /* Бош саҳифа: кўрилмаган энг янги муҳим эълон */
    const top = list.find((n) => n.pinned && !news.seen.includes(n.id));
    let bar = document.getElementById("ekAnn");
    const grid = document.querySelector("#apps .app-grid");
    if (top && grid) {
      if (!bar) { bar = document.createElement("div"); bar.id = "ekAnn"; bar.className = "tr-ann"; bar.setAttribute("data-notr", ""); grid.before(bar); }
      bar.innerHTML = `<a href="#yangiliklar" data-ann="${esc(top.id)}">📣 <b>${esc(top.title)}</b></a><button type="button" class="tr-x" data-annx="${esc(top.id)}" aria-label="✕">✕</button>`;
      bar.onclick = (e) => { const x = e.target.closest("[data-annx],[data-ann]"); if (!x) return; news.seen = news.seen.concat(x.dataset.annx || x.dataset.ann).slice(-100); saveNews(); bar.remove(); };
    } else if (bar) bar.remove();
  }

  /* ===================== Асосий экран ===================== */
  function render() {
    if (!ROOT) return;
    clearInterval(iv); game = null;
    const w = isoWeek(), stg = stage(), mine = st.w[w + ":" + stg];
    const kid = stg === "maktab";
    const past = Object.entries(st.w).filter(([k, v]) => v.done && k.endsWith(":" + stg)).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6);
    ROOT.innerHTML = `
      <div class="qn-head"><div><span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(TX.title)}</h2>
        <p class="muted" style="max-width:820px">${H(TX.lead)}</p></div></div>
      <div data-panel>
      <div class="ps-grid">
        <section class="ps-box"><h3>${H(TX.week)} ${esc(w)}</h3><p class="small">${H(TX.rules)}</p>
          <label class="us-name">${H(TX.nick)}<input type="text" maxlength="20" data-nick value="${esc(st.nick)}" autocomplete="nickname"></label>
          ${kid ? `<p class="small muted">🛡 ${H(TX.nickKid)}</p>` : ""}
          <label class="us-name">${H(TX.region)}<select data-reg><option value="">—</option>${REG.map((r) => `<option value="${r.id}"${st.reg === r.id ? " selected" : ""}>${H(r.n)}</option>`).join("")}</select></label>
          ${mine && mine.done ? `<p class="tr-done">✓ ${mine.score} ${H(TX.points)} · ${mine.ok}/10</p><p class="small muted">${H(TX.usedUp)}</p>` : ""}
          <div class="ps-btns">${mine ? "" : `<button type="button" class="btn btn-primary" data-official>🏁 ${H(TX.official)}</button>`}<button type="button" class="btn btn-ghost" data-practice>${H(TX.practice)}</button></div>
          ${past.length ? `<details><summary>${H(TX.my)}</summary><ul class="small">${past.map(([k, v]) => `<li>${esc(k.split(":")[0])}: <b>${v.score}</b> · ${v.ok}/10</li>`).join("")}</ul></details>` : ""}
        </section>
        <section class="ps-box"><h3>${H(TX.board)}</h3><div data-board></div></section>
      </div>
      <section class="ps-box tr-ref"><h3>${H(TX.ref)}</h3><p class="small muted">${H(TX.refLead)}</p>
        <div class="us-link"><input type="text" readonly value="${esc(refLink())}" data-sel aria-label="${H(TX.ref)}"><button type="button" class="btn btn-ghost btn-sm" data-copy>${H(TX.copy)}</button>${navigator.share ? `<button type="button" class="btn btn-primary btn-sm" data-share>${H(TX.share)}</button>` : ""}</div>
        <p class="small">${H(TX.friends)}: <b data-refn>${ref.count}</b></p></section>
      </div>`;
    renderBoard();
    loadBoard(false);
    syncRef();
  }
  if (ROOT) {
    ROOT.addEventListener("click", (e) => {
      if (e.target.closest("[data-official]")) return start(false);
      if (e.target.closest("[data-practice]")) return start(true);
      const a = e.target.closest("[data-a]"); if (a) return answer(+a.dataset.a);
      if (e.target.closest("[data-next]")) { if (game.i + 1 < game.qs.length) { game.i++; ask(); } else finish(); return; }
      if (e.target.closest("[data-home]")) return render();
      const bw = e.target.closest("[data-bw]"); if (bw) { board.w = bw.dataset.bw; loadBoard(false); return; }
      const bt = e.target.closest("[data-bt]"); if (bt) { board.tab = bt.dataset.bt; renderBoard(); return; }
      if (e.target.closest("[data-copy]")) { (navigator.clipboard ? navigator.clipboard.writeText(refLink()) : Promise.reject()).then(() => toast(TX.copied), () => {}); return; }
      if (e.target.closest("[data-share]")) { navigator.share({ title: "Ekomun", text: L(TX.shareTxt), url: refLink() }).catch(() => {}); return; }
      if (e.target.closest("[data-sel]")) e.target.select();
    });
    ROOT.addEventListener("input", (e) => {
      if (e.target.closest("[data-nick]")) { st.nick = e.target.value.slice(0, 20); save(); }
    });
    ROOT.addEventListener("change", (e) => { if (e.target.closest("[data-reg]")) { st.reg = e.target.value; save(); } });
    ROOT.addEventListener("keydown", (e) => {
      if (!game || game.ans != null) return;
      const k = e.key.toUpperCase(), j = "ABCDE".indexOf(k);
      if (j >= 0 && j < game.qs[game.i].a.length && !e.target.closest("input")) { e.preventDefault(); answer(j); }
    });
  }
  window.addEventListener("hashchange", () => { if (location.hash === "#turnir") render(); else if (game) { clearInterval(iv); game = null; } if (!location.hash || location.hash === "#bosh" || location.hash === "#yangiliklar") renderNews(); });
  window.addEventListener("eko:lang", () => { if (!game) render(); renderNews(); });
  window.addEventListener("eko:stage", () => { if (!game) render(); renderNews(); });
  window.addEventListener("online", loadNews);
  render();
  renderNews();
  loadNews();
  if (ref.inc && !ref.claimed) { const s = App() && App().state; if (s && Object.keys(s.correct || {}).length) claim(); }

  window.EkoTournament = { isoWeek, questions, render, loadNews };
})();
