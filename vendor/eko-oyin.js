/* Ekomun — 🏆 «Ўйин маркази» ва 🧠 «Такрорлаш хонаси» (Ekomun 2.0 режаси, II ва III қисм).
   Илмий асос:
     • Aktiv esga olish (Retrieval Practice, Dunlosky et al., 2013) — карталар, аралаш машқ, босс жанги;
     • Vaqt oralig‘i bilan takrorlash (Spaced Repetition, SM-2; Cepeda et al., 2006) — 1→3→7→16→35 кун;
     • Aralash mashq (Interleaving, Rohrer & Taylor, 2007) — турли курс саволлари аралаш;
     • O‘yinlashtirish (Gamification, Hamari et al., 2014) — серия, вазифалар, тангалар, нишонлар, босс.
   Ҳолат қурилмада сақланади (localStorage «ekotalim:game»; эски калит номи фойдаланувчи натижалари
   йўқолмаслиги учун ўзгартирилмаган). Матнлар ўзбек кирилл тилида; лотин, рус ва инглиз тилига
   EkoLang (vendor/i18n) ўзи ўгиради. */
(() => {
  "use strict";
  const App = window.EkoApp;
  const ROOT_G = document.getElementById("gameRoot");
  const ROOT_T = document.getElementById("takrorRoot");
  if (!App) return;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const dk = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (k, n) => { const d = new Date(k + "T12:00:00"); d.setDate(d.getDate() + n); return dk(d); };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toast = (m) => App.toast(m);

  /* ===================== Ҳолат ===================== */
  const KEY = "ekotalim:game";
  const fresh = () => ({
    v: 1, days: {}, frozen: {}, freezes: 0, coins: 0, earned: 0, owned: {}, frame: "",
    quests: {}, questsDone: 0, srs: {}, mist: {}, fixed: 0, reviews: 0, boss: {}, bossWins: 0,
    mix100: false, secret: {}, lvl: 0, imported: false
  });
  let G = fresh();
  try { G = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* хотира йўқ */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(G)); } catch (e) { /* тўлиб қолса — эътибор бермаймиз */ } };
  const day = (k = dk()) => G.days[k] || (G.days[k] = { v: 0, a: {} });
  const acts = (k) => (G.days[k] && G.days[k].a) || {};
  const active = (k) => !!((G.days[k] && G.days[k].v) || G.frozen[k]);

  function coins(n, why) {
    G.coins = Math.max(0, G.coins + n);
    if (n > 0) G.earned += n;
    save();
    if (n > 0 && why) toast(`🪙 +${n} · ${why}`);
  }

  /* ===================== Серия (streak) ===================== */
  function streak() {
    let n = 0, k = dk();
    if (!active(k)) k = addDays(k, -1);
    while (active(k) && n < 2000) { n++; k = addDays(k, -1); }
    return n;
  }

  function visit() {
    const today = dk();
    if (day(today).v) return;
    // Серияни ҳимоя қилиш: ўтказиб юборилган кунлар учун «🧊 муз» сарфланади
    let gap = 0, k = addDays(today, -1);
    while (!active(k) && gap <= G.freezes && gap < 7) { gap++; k = addDays(k, -1); }
    if (gap > 0 && gap <= G.freezes && active(k)) {
      for (let i = 1; i <= gap; i++) G.frozen[addDays(today, -i)] = true;
      G.freezes -= gap;
      setTimeout(() => toast(`🧊 Серия ҳимояси ишлади: ${gap} кун сақлаб қолинди`), 2800);
    }
    day(today).v = 1;
    seasonal(today);
    save();
    App.addXp(10, "кунлик кириш");
    coins(2);
  }

  function seasonal(k) {
    const md = k.slice(5), h = new Date().getHours();
    if (md >= "03-19" && md <= "03-23") G.secret.navruz = true;
    if (md === "04-22") G.secret.earth = true;
    if (md === "06-05") G.secret.envday = true;
    if (h >= 5 && h < 7) G.secret.early = true;
  }

  /* ===================== Фаоллик ===================== */
  function track(kind, n = 1, info) {
    const a = day().a;
    a[kind] = (a[kind] || 0) + n;
    const h = new Date().getHours();
    if (kind === "lesson") {
      if (h >= 22 || h < 5) G.secret.night = true;
      if (info && info.cid != null) addLessonCards(info.cid, info.li, 1);
    }
    seasonal(dk());
    save();
    scheduleRender();
  }

  /* ===================== Саволлар манбаи ===================== */
  const courses = () => App.courses || [];
  const courseOf = (cid) => courses().find((c) => c.id === cid);
  function getQ(ref) {
    if (!ref) return null;
    if (ref.t === "l") {
      const c = courseOf(ref.cid), l = c && c.lessons[ref.li], q = l && l.quiz && l.quiz[ref.qi];
      return q ? { q: q.q, a: q.a, c: q.c, src: `${c.icon || "📘"} ${c.title}`, cid: c.id } : null;
    }
    if (ref.t === "x") {
      const bank = (window.EKO_EXAMS || {})[ref.cid], q = bank && bank[ref.i], c = courseOf(ref.cid);
      return q ? { q: q.q, a: q.a, c: q.c, src: `${c ? (c.icon || "📘") + " " + c.title : ""} · якуний тест`, cid: ref.cid } : null;
    }
    return null;
  }
  const refId = (r) => r.t === "l" ? `l:${r.cid}:${r.li}:${r.qi}` : `x:${r.cid}:${r.i}`;
  const lessonRefs = (cid, li) => { const c = courseOf(cid), l = c && c.lessons[li]; return l && l.quiz ? l.quiz.map((_, qi) => ({ t: "l", cid, li, qi })) : []; };
  const courseRefs = (cid) => { const c = courseOf(cid); return c ? c.lessons.flatMap((_, li) => lessonRefs(cid, li)) : []; };
  const doneLessons = () => Object.keys(App.state.perfect || {}).map((k) => { const i = k.lastIndexOf(":"); return { cid: k.slice(0, i), li: +k.slice(i + 1) }; }).filter((x) => courseOf(x.cid));

  /* ===================== SM-2 карталар ===================== */
  const SCHED = [1, 3, 7, 16, 35];
  function addCard(ref, dueIn) {
    const id = refId(ref);
    if (G.srs[id] || !getQ(ref)) return false;
    G.srs[id] = { r: ref, ef: 2.5, iv: 0, reps: 0, due: addDays(dk(), dueIn), n: 0, ok: 0 };
    return true;
  }
  function addLessonCards(cid, li, dueIn) { lessonRefs(cid, li).forEach((r) => addCard(r, dueIn)); }
  function grade(card, q) {
    // q: 0–5 (SM-2). 3 дан паст — карта бошидан, эртага яна келади.
    card.n++; if (q >= 3) card.ok++;
    if (q < 3) { card.reps = 0; card.iv = 1; }
    else {
      card.reps++;
      card.iv = card.reps <= SCHED.length ? Math.max(1, Math.round(SCHED[card.reps - 1] * card.ef / 2.5)) : Math.round(card.iv * card.ef);
    }
    card.ef = Math.max(1.3, +(card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))).toFixed(2));
    card.due = addDays(dk(), card.iv);
  }
  const mastered = (c) => c.reps >= 3 && c.n > 0 && c.ok / c.n >= 0.8;
  const dueCards = () => Object.entries(G.srs).filter(([, c]) => c.due <= dk() && getQ(c.r)).sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : a[1].ef - b[1].ef));

  function importOld() {
    if (G.imported) return;
    G.imported = true;
    Object.entries(App.state.challenges || {}).forEach(([k, v]) => { if (Array.isArray(v) && v.length) day(k).v = 1; });
    // Олдин тугатилган дарслар карталари: бугун 10 таси, қолгани кейинги кунларга тақсимланади
    let n = 0;
    doneLessons().forEach(({ cid, li }) => lessonRefs(cid, li).forEach((r) => { if (addCard(r, Math.floor(n / 10))) n++; }));
    save();
  }

  /* ===================== Хатолар дафтари ===================== */
  function addMistake(ref) {
    const id = refId(ref);
    if (!getQ(ref)) return;
    const m = G.mist[id] || (G.mist[id] = { r: ref, n: 0, t: Date.now() });
    m.n++; m.t = Date.now();
    // Хато қилинган савол карта сифатида эртага такрорланади
    if (G.srs[id]) { G.srs[id].reps = 0; G.srs[id].iv = 1; G.srs[id].due = addDays(dk(), 1); } else addCard(ref, 1);
    save();
    scheduleRender();
  }
  function fixMistake(id) {
    if (!G.mist[id]) return;
    delete G.mist[id];
    G.fixed++;
    track("fix");
  }
  window.addEventListener("eko:answer", (e) => { const d = e.detail || {}; if (d.ref && !d.ok) addMistake(d.ref); });

  /* ===================== Вазифалар (questлар) ===================== */
  const DAILY = [
    { id: "review3", icon: "🧠", text: "3 та картани такрорланг", k: "review", need: 3 },
    { id: "fact1", icon: "📰", text: "1 та экофакт ёки мақола ўқинг", k: "fact", need: 1 },
    { id: "lesson1", icon: "📘", text: "1 та дарсни тугатинг", k: "lesson", need: 1 },
    { id: "correct5", icon: "✅", text: "5 та саволга биринчи уринишда тўғри жавоб беринг", k: "correct", need: 5 },
    { id: "habit1", icon: "🌱", text: "1 та яшил одатни белгиланг", k: "habit", need: 1 },
    { id: "mix1", icon: "🔀", text: "Аралаш машқни бажаринг", k: "mix", need: 1 },
    { id: "fix1", icon: "🩹", text: "1 та хатони тузатинг", k: "fix", need: 1 }
  ];
  const WEEKLY = [
    { id: "labtest", icon: "🧪", text: "1 та 3D лаб тажрибаси ва 1 та тест", prog: (w) => Math.min(w.lab || 0, 1) + Math.min(w.test || 0, 1), need: 2 },
    { id: "air", icon: "🌫️", text: "Шаҳрингиз ҳаво сифатини (AQI) текширинг", k: "air", need: 1 },
    { id: "days5", icon: "🔥", text: "Ҳафтада 5 кун платформага киринг", prog: (w, days) => days.filter(active).length, need: 5 },
    { id: "review20", icon: "🃏", text: "20 та картани такрорланг", k: "review", need: 20 },
    { id: "boss1", icon: "⚔️", text: "1 та босс жангида ғалаба қозонинг", k: "boss", need: 1 }
  ];
  const SEASONS = [
    { id: "chinor", from: "10-01", to: "11-30", icon: "🌳", title: "Чинор экиш ойлиги", text: "Кўчат экинг ёки ҳашарда қатнашиб, «олдин ва кейин» суратини Ҳашар бўлимида тайёрланг", k: "hashar", need: 1 },
    { id: "navruz", from: "03-10", to: "03-31", icon: "🌷", title: "Наврўз эко-ойлиги", text: "Наврўз ҳашарида қатнашинг ва «олдин ва кейин» суратини тайёрланг", k: "hashar", need: 1 },
    { id: "earth", from: "04-15", to: "04-30", icon: "🌍", title: "Ер куни", text: "Ер куни муносабати билан 3 та дарсни тугатинг", k: "lesson", need: 3 },
    { id: "water", from: "03-01", to: "03-09", icon: "💧", title: "Сув куни олди", text: "Сув ҳақида 5 та картани такрорланг", k: "review", need: 5 },
    { id: "summer", from: "06-01", to: "08-31", icon: "☀️", title: "Ёзги эко-лагерь", text: "Ёз давомида 3 та 3D лаб тажрибасини бажаринг", k: "lab", need: 3 },
    { id: "school", from: "09-01", to: "09-30", icon: "🎒", title: "Янги ўқув йили", text: "Ўқув йили бошида 5 та дарсни тугатинг", k: "lesson", need: 5 }
  ];
  const REWARD = { d: { xp: 20, coin: 5 }, w: { xp: 80, coin: 20 }, s: { xp: 100, coin: 40 } };
  const hash = (s) => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
  function todaysDaily() {
    const k = dk(), list = DAILY.slice(), out = [];
    let h = hash(k);
    while (out.length < 3) { out.push(list.splice(h % list.length, 1)[0]); h = hash(String(h)); }
    return out;
  }
  function weekDays() {
    const d = new Date(dk() + "T12:00:00"), wd = (d.getDay() + 6) % 7; // душанба = 0
    const mon = addDays(dk(), -wd);
    return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  }
  const sumActs = (days) => days.reduce((s, k) => { Object.entries(acts(k)).forEach(([x, v]) => { s[x] = (s[x] || 0) + v; }); return s; }, {});
  function season() {
    const md = dk().slice(5);
    return SEASONS.find((s) => md >= s.from && md <= s.to) || null;
  }
  function seasonDays(s) {
    const y = dk().slice(0, 4), out = [];
    for (let k = `${y}-${s.from}`; k <= `${y}-${s.to}` && k <= dk(); k = addDays(k, 1)) out.push(k);
    return out;
  }
  function questList() {
    const days = weekDays(), w = sumActs(days), t = acts(dk());
    const mk = (kind, key, q, have) => ({ ...q, kind, key, have: Math.min(have, q.need), done: have >= q.need, claimed: !!G.quests[key] });
    const list = todaysDaily().map((q) => mk("d", `d:${dk()}:${q.id}`, q, t[q.k] || 0));
    WEEKLY.forEach((q) => list.push(mk("w", `w:${days[0]}:${q.id}`, q, q.prog ? q.prog(w, days) : w[q.k] || 0)));
    const s = season();
    if (s) { const sa = sumActs(seasonDays(s)); list.push(mk("s", `s:${dk().slice(0, 4)}:${s.id}`, { ...s, text: `${s.title}: ${s.text}` }, sa[s.k] || 0)); }
    return list;
  }
  function claim(key) {
    const q = questList().find((x) => x.key === key);
    if (!q || !q.done || q.claimed) return;
    G.quests[key] = Date.now();
    G.questsDone++;
    if (q.kind === "s") G.secret["season_" + q.id] = true;
    // эски (30 кундан ўтган) кунлик вазифа ёзувларини тозалаш
    const old = addDays(dk(), -30);
    Object.keys(G.quests).forEach((k) => { if (k.startsWith("d:") && k.slice(2, 12) < old) delete G.quests[k]; });
    save();
    const r = REWARD[q.kind];
    App.addXp(r.xp, "вазифа бажарилди");
    coins(r.coin, "вазифа");
  }

  /* ===================== Дўкон ===================== */
  const SHOP = [
    { id: "freeze", type: "freeze", icon: "🧊", name: "Серия ҳимояси", desc: "Бир кун кирмасангиз ҳам серия узилмайди (кўпи билан 2 та)", price: 50 },
    { id: "a_fox", type: "avatar", icon: "🦊", name: "Тулки", price: 30 },
    { id: "a_turtle", type: "avatar", icon: "🐢", name: "Тошбақа", price: 30 },
    { id: "a_owl", type: "avatar", icon: "🦉", name: "Бойқуш", price: 40 },
    { id: "a_bee", type: "avatar", icon: "🐝", name: "Ари", price: 40 },
    { id: "a_dolphin", type: "avatar", icon: "🐬", name: "Дельфин", price: 60 },
    { id: "a_butterfly", type: "avatar", icon: "🦋", name: "Капалак", price: 60 },
    { id: "a_deer", type: "avatar", icon: "🦌", name: "Буғу", price: 80 },
    { id: "a_leopard", type: "avatar", icon: "🐆", name: "Қор барси", price: 120 },
    { id: "f_dawn", type: "frame", icon: "🌅", name: "Тонг", price: 60, css: "linear-gradient(135deg,#fde68a,#fca5a5)" },
    { id: "f_sea", type: "frame", icon: "🌊", name: "Денгиз", price: 60, css: "linear-gradient(135deg,#a5f3fc,#93c5fd)" },
    { id: "f_forest", type: "frame", icon: "🌲", name: "Ўрмон", price: 60, css: "linear-gradient(135deg,#bbf7d0,#86efac)" },
    { id: "f_aurora", type: "frame", icon: "🌌", name: "Қутб шафағи", price: 90, css: "linear-gradient(135deg,#c4b5fd,#6ee7b7)" }
  ];
  function buy(id) {
    const it = SHOP.find((x) => x.id === id);
    if (!it) return;
    if (it.type !== "freeze" && G.owned[id]) return use(id);
    if (it.type === "freeze" && G.freezes >= 2) return toast("🧊 Кўпи билан 2 та серия ҳимояси сақлаш мумкин");
    if (G.coins < it.price) return toast(`🪙 Тангалар етмайди: яна ${it.price - G.coins} та керак`);
    G.coins -= it.price;
    if (it.type === "freeze") G.freezes++;
    else G.owned[id] = true;
    save();
    toast(`✅ Сотиб олинди: ${it.icon} ${it.name}`);
    if (it.type !== "freeze") use(id); else render();
  }
  function use(id) {
    const it = SHOP.find((x) => x.id === id);
    if (!it || !G.owned[id]) return;
    if (it.type === "avatar") { App.state.avatar = App.state.avatar === it.icon ? "" : it.icon; App.save(); App.renderGamification(); }
    if (it.type === "frame") { G.frame = G.frame === id ? "" : id; save(); }
    render();
  }

  /* ===================== Савол ойнаси (такрорлаш, хато, аралаш, босс) ===================== */
  let run = null; // { mode, items:[{id, ref}], i, ok, wrong, t0, cid, hp, lives }
  const BOSSES = [
    ["😶‍🌫️", "Смог Дев"], ["🧴", "Пластик Ажина"], ["🛢️", "Нефть Ҳаюло"], ["🏭", "Тутун Бош"],
    ["🦠", "Ифлос Сув Махлуқи"], ["🔥", "Иссиқлик Аждаҳоси"], ["🗑️", "Чиқинди Қироли"], ["🌪️", "Чанг Бўрони"]
  ];
  const bossOf = (cid) => { const i = courses().findIndex((c) => c.id === cid); return BOSSES[(i < 0 ? hash(cid) : i) % BOSSES.length]; };

  function start(mode, opt = {}) {
    let items = [];
    if (mode === "review") items = dueCards().slice(0, 10).map(([id, c]) => ({ id, ref: c.r }));
    else if (mode === "fix") items = Object.entries(G.mist).sort((a, b) => a[1].t - b[1].t).slice(0, 10).map(([id, m]) => ({ id, ref: m.r }));
    else if (mode === "mix") {
      // Аралаш машқ: камида 3 хил курсдан 10 та савол
      const done = doneLessons();
      const byCourse = {};
      (done.length ? done : []).forEach(({ cid, li }) => (byCourse[cid] = byCourse[cid] || []).push(...lessonRefs(cid, li)));
      if (Object.keys(byCourse).length < 3) courses().forEach((c) => { if (!byCourse[c.id] && Object.keys(byCourse).length < 6) byCourse[c.id] = courseRefs(c.id); });
      const pools = shuffle(Object.values(byCourse).map(shuffle).filter((p) => p.length));
      for (let k = 0; items.length < 10 && pools.some((p) => p.length); k++) { const p = pools[k % pools.length]; if (p.length) { const r = p.pop(); items.push({ id: refId(r), ref: r }); } }
    } else if (mode === "boss") items = shuffle(courseRefs(opt.cid)).slice(0, 14).map((r) => ({ id: refId(r), ref: r }));
    items = items.filter((x) => getQ(x.ref));
    if (!items.length) { toast(mode === "review" ? "Бугун такрорлаш учун карта йўқ 👏" : "Савол топилмади"); return; }
    run = { mode, items, i: 0, ok: 0, wrong: 0, cid: opt.cid, hp: 100, lives: 3, answered: false };
    renderRun();
  }

  function renderRun() {
    const box = run.mode === "boss" ? ROOT_G : ROOT_T;
    const host = box && box.querySelector("[data-run]");
    if (!host) return;
    const it = run.items[run.i], q = getQ(it.ref);
    const order = shuffle(q.a.map((_, i) => i));
    run.order = order; run.t0 = Date.now(); run.answered = false;
    const titles = { review: "🧠 Такрорлаш", fix: "🩹 Хатоларни тузатиш", mix: "🔀 Аралаш машқ", boss: "⚔️ Босс жанги" };
    let head = `<div class="gm-run-top"><b>${titles[run.mode]}</b><span class="muted small">${run.i + 1} / ${run.items.length}</span><button type="button" class="btn btn-ghost btn-sm" data-act="stop">✕ Тўхтатиш</button></div>`;
    if (run.mode === "boss") {
      const [bi, bn] = bossOf(run.cid);
      head += `<div class="gm-boss"><div class="gm-boss-face" id="gmBossFace" aria-hidden="true">${bi}</div><div class="gm-boss-info"><b>${esc(bn)}</b>
        <div class="gm-hp" role="progressbar" aria-label="Босс кучи" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${run.hp}"><div style="width:${run.hp}%"></div></div>
        <span class="small">❤️ ${"♥".repeat(run.lives)}${"♡".repeat(3 - run.lives)} · <span class="muted">Тўғри жавоб — зарба, хато — босс ҳужуми</span></span></div></div>`;
    } else head += `<div class="progress gm-prog"><div style="width:${(run.i / run.items.length) * 100}%"></div></div>`;
    host.innerHTML = `${head}<div class="gm-q"><p class="gm-src small muted">${esc(q.src)}</p><h3>${esc(q.q)}</h3>
      <div class="gm-opts">${order.map((oi, k) => `<button type="button" class="opt" data-o="${k}">${esc(q.a[oi])}</button>`).join("")}</div>
      <p class="gm-fb" aria-live="polite"></p><div class="gm-next" hidden><button type="button" class="btn btn-primary" data-act="next">Давом этиш →</button></div></div>`;
    host.hidden = false;
    host.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  }

  function answer(k) {
    if (!run || run.answered) return;
    run.answered = true;
    const box = run.mode === "boss" ? ROOT_G : ROOT_T, host = box.querySelector("[data-run]");
    const it = run.items[run.i], q = getQ(it.ref), ok = run.order[k] === q.c;
    host.querySelectorAll(".opt").forEach((b, i) => { b.disabled = true; if (run.order[i] === q.c) b.classList.add("right"); else if (i === k) b.classList.add("wrong"); });
    const fb = host.querySelector(".gm-fb");
    fb.textContent = ok ? "✓ Тўғри!" : `✗ Тўғри жавоб: ${q.a[q.c]}`;
    fb.className = "gm-fb " + (ok ? "ok" : "bad");
    if (ok) run.ok++; else run.wrong++;
    if (run.mode === "review") {
      const c = G.srs[it.id];
      if (c) grade(c, ok ? (Date.now() - run.t0 < 10000 ? 5 : 4) : 1);
      G.reviews++;
      track("review");
      if (ok) App.addXp(2, "такрорлаш");
      else addMistake(it.ref);
    } else if (run.mode === "fix") {
      if (ok) { fixMistake(it.id); coins(1); } else G.mist[it.id] && (G.mist[it.id].n++);
    } else {
      if (ok) { track("correct"); if (run.mode === "mix") App.addXp(5, "аралаш машқ"); }
      else addMistake(it.ref);
      if (run.mode === "boss") {
        const hit = Math.ceil(100 / Math.min(8, run.items.length));
        if (ok) run.hp = Math.max(0, run.hp - hit); else run.lives--;
        const face = document.getElementById("gmBossFace");
        if (face && !reduced()) { face.classList.remove("hit", "atk"); void face.offsetWidth; face.classList.add(ok ? "hit" : "atk"); }
        const bar = host.querySelector(".gm-hp div"); if (bar) bar.style.width = run.hp + "%";
      }
    }
    save();
    const over = run.mode === "boss" ? run.hp <= 0 || run.lives <= 0 || run.i >= run.items.length - 1 : run.i >= run.items.length - 1;
    const nx = host.querySelector(".gm-next");
    nx.hidden = false;
    nx.querySelector("button").textContent = over ? "Натижани кўриш" : "Давом этиш →";
    nx.querySelector("button").focus({ preventScroll: true });
    run.over = over;
  }

  function next() {
    if (!run) return;
    if (!run.over) { run.i++; renderRun(); return; }
    finish();
  }

  function finish() {
    const r = run; run = null;
    const n = r.ok + r.wrong, pct = n ? Math.round((r.ok / n) * 100) : 0;
    let msg = "";
    if (r.mode === "review") { App.addXp(10, "такрорлаш сессияси"); coins(3); msg = `${r.ok} / ${n} тўғри. Карталар келгусида ўз вақтида қайтади.`; }
    if (r.mode === "fix") msg = `${r.ok} та хато тузатилди. Хатодан ўрганиш — энг кучли ўрганиш!`;
    if (r.mode === "mix") {
      track("mix"); track("test");
      if (pct === 100) { G.mix100 = true; App.addXp(50, "аралаш машқ · 100%"); }
      else if (pct >= 90) App.addXp(30, "аралаш машқ · 90%+");
      msg = `${r.ok} / ${n} тўғри (${pct}%). Турли мавзулар аралаш келгани учун билим мустаҳкамроқ эсда қолади.`;
    }
    if (r.mode === "boss") {
      const win = r.hp <= 0;
      const [bi, bn] = bossOf(r.cid);
      if (win) {
        track("boss"); track("test");
        const first = !G.boss[r.cid];
        G.boss[r.cid] = (G.boss[r.cid] || 0) + 1;
        G.bossWins++;
        save();
        App.addXp(first ? 100 : 20, "босс енгилди");
        coins(first ? 30 : 5, "босс");
        msg = `🏆 ${bi} ${bn} енгилди! ${first ? "Биринчи ғалаба учун +100 XP." : ""}`;
      } else msg = `${bi} ${bn} бу сафар кучли чиқди. Дарсларни такрорлаб, яна уриниб кўринг!`;
    }
    save();
    const box = r.mode === "boss" ? ROOT_G : ROOT_T, host = box.querySelector("[data-run]");
    host.innerHTML = `<div class="gm-done"><div class="gm-big" aria-hidden="true">${r.mode === "boss" ? (r.hp <= 0 ? "🏆" : "💪") : pct >= 80 ? "🎉" : "👍"}</div>
      <p>${esc(msg)}</p><button type="button" class="btn btn-primary" data-act="close">Тайёр</button></div>`;
    render();
  }

  /* ===================== Нишонлар (40+) ===================== */
  const lessonsIn = (ids) => doneLessons().filter((x) => ids.includes(x.cid)).length;
  const L3 = ["issiq", "molekula", "tindir", "quyosh", "daraxt", "flotatsiya", "liniya", "tutun", "daryo", "piramida"];
  const masteredN = () => Object.values(G.srs).filter(mastered).length;
  const NEW_BADGES = [
    { id: "s30", icon: "🌟", name: "30 кун серия", test: () => streak() >= 30 },
    { id: "s100", icon: "💯", name: "100 кун серия", test: () => streak() >= 100 },
    { id: "air5", icon: "🌬️", name: "Ҳаво мутахассиси", hint: "Ҳаво ва иқлим курсларидан 5 та дарс", test: () => lessonsIn(["iqlim", "monitoring"]) >= 5 },
    { id: "water5", icon: "🚰", name: "Сув ҳимоячиси", hint: "Сув курсларидан 5 та дарс", test: () => lessonsIn(["suvhavo", "biotoza"]) >= 5 },
    { id: "waste5", icon: "🗑️", name: "Чиқинди мутахассиси", hint: "Қайта ишлаш курсидан 5 та дарс", test: () => lessonsIn(["qayta"]) >= 5 },
    { id: "eco5", icon: "🌐", name: "Экотизим билимдони", hint: "Экология курсларидан 5 та дарс", test: () => lessonsIn(["asoslar", "ekologiya"]) >= 5 },
    { id: "xw10", icon: "🧩", name: "Кроссворд устаси", hint: "10 та кроссворд", test: () => Object.keys(App.state.xw || {}).length >= 10 },
    { id: "lab3d", icon: "🧊", name: "3D тадқиқотчи", hint: "Барча 3D лабораториялар", test: () => L3.every((id) => (App.state.flags || {})["l3t_" + id] || (App.state.flags || {})["l3k_" + id]) },
    { id: "hashar3", icon: "🦸", name: "Ҳашар қаҳрамони", hint: "3 та ҳашар", test: () => ((App.state.games || {}).hasharN || 0) >= 3 },
    { id: "boss1", icon: "⚔️", name: "Босс енгувчи", test: () => G.bossWins >= 1 },
    { id: "boss5", icon: "🛡️", name: "Ифлосланиш кушандаси", hint: "5 та курс боссини енгинг", test: () => Object.keys(G.boss).length >= 5 },
    { id: "srs50", icon: "🧠", name: "Хотира устаси", hint: "50 та карта ўзлаштирилган", test: () => masteredN() >= 50 },
    { id: "rev100", icon: "🃏", name: "Такрорлаш чемпиони", hint: "100 марта такрорлаш", test: () => G.reviews >= 100 },
    { id: "fix10", icon: "🩹", name: "Хатодан ўрганувчи", hint: "10 та хатони тузатинг", test: () => G.fixed >= 10 },
    { id: "mix100", icon: "🔀", name: "Ҳар томонлама билимдон", hint: "Аралаш машқда 100%", test: () => G.mix100 },
    { id: "q10", icon: "📋", name: "Вазифачи", hint: "10 та вазифа", test: () => G.questsDone >= 10 },
    { id: "coin200", icon: "🪙", name: "Яшил хазина", hint: "200 та танга йиғинг", test: () => G.earned >= 200 },
    { id: "lv21", icon: "🌲", name: "Чинор", hint: "21-даража", test: () => App.levelOf(App.state.xp).n >= 21 },
    { id: "lv51", icon: "🌍", name: "Сайёра қоровули", hint: "51-даража", test: () => App.levelOf(App.state.xp).n >= 51 },
    { id: "night", icon: "🦉", name: "Тунги ўрганувчи", secret: true, test: () => G.secret.night },
    { id: "early", icon: "🐓", name: "Эрта турувчи", secret: true, test: () => G.secret.early },
    { id: "navruz", icon: "🌷", name: "Наврўз эко-қаҳрамони", secret: true, test: () => G.secret.navruz || G.secret.season_navruz },
    { id: "earth", icon: "🌎", name: "Ер куни иштирокчиси", secret: true, test: () => G.secret.earth || G.secret.season_earth },
    { id: "chinor", icon: "🌳", name: "Чинор экувчи", secret: true, test: () => G.secret.season_chinor },
    { id: "envday", icon: "🌿", name: "Атроф-муҳит куни", secret: true, test: () => G.secret.envday }
  ];
  const known = new Set(App.badges.map((b) => b.id));
  NEW_BADGES.forEach((b) => { if (!known.has(b.id)) App.badges.push(b); });

  /* ===================== Чизиш ===================== */
  let renderTimer = 0;
  function scheduleRender() { clearTimeout(renderTimer); renderTimer = setTimeout(render, 60); }

  function levelBox() {
    const lv = App.levelOf(App.state.xp), nx = App.levels[App.levels.indexOf(lv) + 1];
    const pct = nx ? ((App.state.xp - lv.min) / (nx.min - lv.min)) * 100 : 100;
    const fr = SHOP.find((x) => x.id === G.frame);
    return `<div class="gm-hero" style="${fr ? `--gm-frame:${fr.css}` : ""}">
      <div class="gm-ava" aria-hidden="true">${App.state.avatar || lv.icon}</div>
      <div class="gm-hero-main"><b class="gm-lv">${esc(lv.tier)} · ${lv.n}-даража</b>
        <div class="progress"><div style="width:${pct.toFixed(1)}%"></div></div>
        <span class="small muted">${App.state.xp} XP${nx ? ` · кейинги даражагача ${nx.min - App.state.xp} XP` : ""}</span></div>
      <div class="gm-stats"><span title="Серия"><b>🔥 ${streak()}</b><small>кун серия</small></span><span title="Тангалар"><b>🪙 ${G.coins}</b><small>танга</small></span><span title="Серия ҳимояси"><b>🧊 ${G.freezes}</b><small>ҳимоя</small></span></div>
    </div>`;
  }

  function questHtml(q) {
    const r = REWARD[q.kind];
    return `<li class="gm-quest ${q.claimed ? "claimed" : q.done ? "ready" : ""}"><span class="gm-qi" aria-hidden="true">${q.icon}</span>
      <div class="gm-qt"><span>${esc(q.text)}</span><div class="progress"><div style="width:${(q.have / q.need) * 100}%"></div></div><small class="muted">${q.have} / ${q.need} · +${r.xp} XP, 🪙 ${r.coin}</small></div>
      ${q.claimed ? `<span class="gm-ok">✓</span>` : q.done ? `<button type="button" class="btn btn-primary btn-sm" data-claim="${q.key}">Олиш</button>` : ""}</li>`;
  }

  function render() {
    if (ROOT_G && !(run && run.mode === "boss")) renderGame();
    if (ROOT_T && !(run && run.mode !== "boss")) renderTakror();
  }

  function renderGame() {
    const qs = questList();
    const tabs = [["d", "☀️ Бугун"], ["w", "📅 Ҳафта"], ["s", "🎉 Мавсумий"]];
    const cs = courses().filter((c) => c.lessons && c.lessons.some((l) => l.quiz && l.quiz.length));
    const started = new Set(doneLessons().map((x) => x.cid));
    const order = cs.slice().sort((a, b) => (started.has(b.id) ? 1 : 0) - (started.has(a.id) ? 1 : 0));
    ROOT_G.innerHTML = `
      <div class="section-head"><div><h2 class="section-title">🏆 Ўйин маркази</h2>
        <p class="muted">XP, 60 та даража, кунлик серия, вазифалар, яшил тангалар ва босс жанглари. Ҳар бир ўйин элементи илмий асосланган ўрганиш усулига боғланган.</p></div></div>
      ${levelBox()}
      <div class="gm-grid">
        <article class="gm-card"><h3>📋 Вазифалар</h3>
          ${tabs.map(([k, t]) => { const l = qs.filter((q) => q.kind === k); return l.length ? `<h4 class="gm-sub">${t}</h4><ul class="gm-quests">${l.map(questHtml).join("")}</ul>` : ""; }).join("")}
        </article>
        <article class="gm-card"><h3>⚔️ Босс жанглари</h3>
          <p class="small muted">Ҳар курс охирида «Ифлосланиш боши» билан жанг: тўғри жавоб — зарба, хато — босс ҳужуми. 3 та юрагингиз бор.</p>
          <div class="gm-bosses">${order.slice(0, 40).map((c) => { const [bi, bn] = bossOf(c.id); const w = G.boss[c.id]; return `<button type="button" class="gm-bossbtn ${w ? "won" : ""}" data-boss="${esc(c.id)}"><span aria-hidden="true">${bi}</span><b>${esc(bn)}</b><small>${esc((c.icon || "") + " " + c.title)}</small>${w ? `<em>🏆 ×${w}</em>` : ""}</button>`; }).join("")}</div>
          <div class="gm-run" data-run hidden></div>
        </article>
        <article class="gm-card"><h3>🛒 Эко-дўкон</h3>
          <p class="small muted">Яшил тангалар вазифа, босс ва кунлик киришдан йиғилади. Аватар ва фон фақат кўриниш учун; таълим доим бепул.</p>
          <div class="gm-shop">${SHOP.map((it) => { const own = it.type !== "freeze" && G.owned[it.id]; const on = (it.type === "avatar" && App.state.avatar === it.icon) || (it.type === "frame" && G.frame === it.id);
            return `<button type="button" class="gm-item ${own ? "own" : ""} ${on ? "on" : ""}" data-buy="${it.id}" title="${esc(it.desc || it.name)}"${it.css ? ` style="--gm-sw:${it.css}"` : ""}><span class="gm-ii" aria-hidden="true">${it.icon}</span><b>${esc(it.name)}</b><small>${on ? "✓ Танланган" : own ? "Танлаш" : `🪙 ${it.price}`}</small></button>`; }).join("")}</div>
        </article>
        <article class="gm-card"><h3>🏅 Рейтинг ва нишонлар</h3>
          <p class="small">Нишонларнинг тўлиқ рўйхати ва даражангиз — <a href="#chellenj">Челленж</a> бўлимида. Синф рейтинги — <a href="#maktab">Мактаб</a> бўлимида (ўқитувчи синф очади).</p>
          <p class="small muted">Олинган нишонлар: <b>${App.badges.filter((b) => { try { return b.test(); } catch (e) { return false; } }).length} / ${App.badges.length}</b></p>
        </article>
      </div>`;
  }

  function weekChart() {
    const days = weekDays(), labels = ["Ду", "Се", "Чо", "Па", "Жу", "Ша", "Як"];
    const vals = days.map((k) => { const a = acts(k); return (a.review || 0) + (a.correct || 0) + (a.fix || 0); });
    const max = Math.max(5, ...vals);
    const open = Object.keys(G.mist).length, fixedW = sumActs(days).fix || 0, tot = open + fixedW;
    const C = 2 * Math.PI * 42, part = tot ? fixedW / tot : 0;
    return `<div class="gm-week">
      <svg viewBox="0 0 100 100" class="gm-donut" role="img" aria-label="Шу ҳафта тузатилган хатолар: ${fixedW}, қолган: ${open}">
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--line)" stroke-width="12"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--primary)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(C * part).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 50 50)"/>
        <text x="50" y="47" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">${fixedW}</text><text x="50" y="64" text-anchor="middle" font-size="9" fill="currentColor">тузатилди</text></svg>
      <div class="gm-bars" role="img" aria-label="Ҳафталик фаоллик">${vals.map((v, i) => `<div><span style="height:${(v / max) * 100}%" title="${v}"></span><small>${labels[i]}</small></div>`).join("")}</div>
    </div>`;
  }

  function renderTakror() {
    const due = dueCards().length, all = Object.keys(G.srs).length, mN = masteredN(), mist = Object.entries(G.mist).sort((a, b) => b[1].t - a[1].t);
    const nextDue = Object.values(G.srs).map((c) => c.due).filter((d) => d > dk()).sort()[0];
    ROOT_T.innerHTML = `
      <div class="section-head"><div><h2 class="section-title">🧠 Такрорлаш хонаси</h2>
        <p class="muted">Ўқиганингизни унутмаслик учун: карталар SM-2 алгоритми бўйича 1 → 3 → 7 → 16 → 35 кундан кейин қайтади. Кунига 5–10 та карта, тахминан 3 дақиқа.</p></div></div>
      <div class="gm-run" data-run hidden></div>
      <div class="gm-grid">
        <article class="gm-card gm-main"><h3>🃏 Бугунги карталар</h3>
          <div class="gm-nums"><span><b>${due}</b><small>бугун</small></span><span><b>${all}</b><small>жами карта</small></span><span><b>${mN}</b><small>ўзлаштирилган</small></span></div>
          ${all ? "" : `<p class="small muted">Карталар дарсни тугатганингизда ўзи пайдо бўлади. <a href="#kurslar">Курслар</a> бўлимидан бошланг.</p>`}
          <button type="button" class="btn btn-primary" data-act="review" ${due ? "" : "disabled"}>▶ Такрорлашни бошлаш${due ? ` (${Math.min(due, 10)})` : ""}</button>
          ${!due && nextDue ? `<p class="small muted">Кейинги карталар: ${nextDue.split("-").reverse().join(".")}</p>` : ""}
          <p class="small muted">Ўзлаштирилган — камида 3 марта такрорланган ва 80% дан кўп тўғри жавоб берилган карта.</p>
        </article>
        <article class="gm-card"><h3>🔀 Аралаш машқ</h3>
          <p class="small muted">Турли курслардан 10 та савол аралаш келади: тадқиқотларга кўра бундай машқ натижани сезиларли оширади (Rohrer & Taylor, 2007). 90% дан юқори — +30 XP, 100% — +50 XP.</p>
          <button type="button" class="btn btn-primary" data-act="mix">▶ Бошлаш</button>
        </article>
        <article class="gm-card"><h3>📓 Хатолар дафтари</h3>
          <p class="small muted">Ҳар бир хато жавоб шу ерга ёзилади. Тўғри жавоб берсангиз, дафтардан ўчади.</p>
          ${weekChart()}
          <button type="button" class="btn btn-primary" data-act="fix" ${mist.length ? "" : "disabled"}>🩹 Хатоларни тузатиш${mist.length ? ` (${Math.min(mist.length, 10)})` : ""}</button>
          ${mist.length ? `<ul class="gm-mist">${mist.slice(0, 12).map(([, m]) => { const q = getQ(m.r); return q ? `<li><b>${esc(q.q)}</b><span class="small">✓ ${esc(q.a[q.c])}</span><small class="muted">${esc(q.src)}${m.n > 1 ? ` · ${m.n} марта` : ""}</small></li>` : ""; }).join("")}</ul>` : `<p class="small">Ҳозирча хато йўқ 👏</p>`}
        </article>
      </div>`;
  }

  /* ===================== Ҳодисалар ===================== */
  function onClick(e) {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.claim) return claim(b.dataset.claim), render();
    if (b.dataset.buy) return buy(b.dataset.buy);
    if (b.dataset.boss) return start("boss", { cid: b.dataset.boss });
    if (b.dataset.o != null && run) return answer(+b.dataset.o);
    const a = b.dataset.act;
    if (a === "review" || a === "mix" || a === "fix") return start(a);
    if (a === "next") return next();
    if (a === "stop") { if (run) { run = null; render(); } return; }
    if (a === "close") { const host = b.closest("[data-run]"); if (host) host.hidden = true; render(); }
  }
  [ROOT_G, ROOT_T].forEach((r) => r && r.addEventListener("click", onClick));

  // «Шаҳрингиз AQI сини текширинг»: ҳаво сифати бўлими очилганда (кунига бир марта)
  function hashSeen() {
    const h = location.hash.slice(1);
    if (h === "havo" && !acts(dk()).air) track("air");
    if ((h === "takror" || h === "oyinmarkaz") && !run) render();
  }
  window.addEventListener("hashchange", hashSeen);

  // Даража ошганда тангалар (ҳар янги даража учун 10 та)
  window.addEventListener("eko:xp", () => {
    const n = App.levelOf(App.state.xp).n;
    if (!G.lvl) { G.lvl = n; save(); return; }
    if (n > G.lvl) { coins(10 * (n - G.lvl), "янги даража"); G.lvl = n; save(); }
    scheduleRender();
  });
  window.addEventListener("eko:reset", () => { G = fresh(); G.imported = true; save(); render(); });
  window.addEventListener("eko:lang", () => { if (!run) render(); });

  /* ===================== Услублар ===================== */
  const css = document.createElement("style");
  css.textContent = `
.gm-hero{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;padding:16px 18px;border-radius:22px;margin:6px 0 18px;background:var(--gm-frame,var(--glass,var(--card)));border:1px solid var(--glass-line,var(--line));box-shadow:var(--shadow)}
.gm-hero[style*="--gm-frame"]{color:#0b1f17}.gm-hero[style*="--gm-frame"] .muted{color:#334155}
.gm-ava{width:64px;height:64px;border-radius:20px;display:grid;place-items:center;font-size:2.3rem;background:var(--card);border:1px solid var(--line)}
.gm-hero-main{flex:1 1 220px;min-width:0}.gm-lv{display:block;font-size:1.08rem;margin-bottom:6px}
.gm-stats{display:flex;gap:10px}.gm-stats span{display:flex;flex-direction:column;align-items:center;min-width:64px;padding:8px 10px;border-radius:14px;background:var(--card);border:1px solid var(--line);color:var(--text)}
.gm-stats small{font-size:.72rem;color:var(--muted)}
.gm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:16px}
.gm-card{padding:16px 18px;border-radius:20px;background:var(--glass,var(--card));border:1px solid var(--glass-line,var(--line));box-shadow:var(--shadow);min-width:0}
.gm-card h3{margin:0 0 8px}.gm-sub{margin:12px 0 6px;font-size:.92rem}
.gm-quests{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.gm-quest{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;border:1px solid var(--line);background:var(--card)}
.gm-quest.ready{border-color:var(--primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--primary) 25%,transparent)}
.gm-quest.claimed{opacity:.7}.gm-qi{font-size:1.4rem}.gm-qt{flex:1;min-width:0;display:grid;gap:4px}.gm-qt .progress{height:6px}
.gm-ok{color:var(--primary);font-weight:800;font-size:1.2rem}
.gm-bosses{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;max-height:340px;overflow:auto;padding:2px}
.gm-bossbtn{position:relative;display:grid;justify-items:center;gap:2px;padding:10px 8px;border-radius:14px;border:1px solid var(--line);background:var(--card);color:var(--text);cursor:pointer;text-align:center;font:inherit}
.gm-bossbtn span{font-size:1.8rem}.gm-bossbtn small{color:var(--muted);font-size:.72rem;line-height:1.25}.gm-bossbtn em{font-style:normal;font-size:.75rem;color:var(--primary);font-weight:700}
.gm-bossbtn.won{border-color:var(--primary)}.gm-bossbtn:hover{border-color:var(--primary)}
.gm-shop{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
.gm-item{display:grid;justify-items:center;gap:2px;padding:10px 6px;border-radius:14px;border:1px solid var(--line);background:var(--card);color:var(--text);cursor:pointer;font:inherit}
.gm-item[style*="--gm-sw"] .gm-ii{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:var(--gm-sw)}
.gm-item .gm-ii{font-size:1.6rem}.gm-item b{font-size:.82rem}.gm-item small{font-size:.74rem;color:var(--muted)}
.gm-item.own{border-style:dashed}.gm-item.on{border-color:var(--primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--primary) 30%,transparent)}
.gm-run{margin:12px 0;padding:16px;border-radius:20px;border:1px solid var(--line);background:var(--card);scroll-margin-top:90px}
.gm-run-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}.gm-run-top b{flex:1}
.gm-prog{height:6px;margin-bottom:12px}.gm-q h3{margin:4px 0 12px;font-size:1.08rem;line-height:1.4}.gm-src{margin:0}
.gm-opts{display:grid;gap:8px}.gm-fb{min-height:1.4em;margin:10px 0 6px;font-weight:600}.gm-fb.ok{color:var(--primary)}.gm-fb.bad{color:#b91c1c}
:root[data-theme="dark"] .gm-fb.bad{color:#fca5a5}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .gm-fb.bad{color:#fca5a5}}
.gm-boss{display:flex;align-items:center;gap:14px;margin-bottom:12px;padding:10px;border-radius:16px;background:color-mix(in srgb,#ef4444 8%,var(--card))}
.gm-boss-face{font-size:3rem;line-height:1}.gm-boss-info{flex:1;display:grid;gap:4px}
.gm-hp{height:10px;border-radius:99px;background:var(--line);overflow:hidden}.gm-hp div{height:100%;background:linear-gradient(90deg,#dc2626,#f97316);transition:width .4s}
.gm-boss-face.hit{animation:gmHit .45s}.gm-boss-face.atk{animation:gmAtk .45s}
@keyframes gmHit{30%{transform:translateX(-8px) rotate(-8deg);filter:brightness(1.6)}60%{transform:translateX(6px) rotate(5deg)}}
@keyframes gmAtk{40%{transform:scale(1.35)}}
.gm-done{text-align:center;display:grid;justify-items:center;gap:6px}.gm-big{font-size:3rem}
.gm-nums{display:flex;gap:10px;margin:6px 0 12px}.gm-nums span{flex:1;display:grid;justify-items:center;padding:10px;border-radius:14px;background:var(--card);border:1px solid var(--line)}
.gm-nums b{font-size:1.5rem}.gm-nums small{color:var(--muted);font-size:.76rem}
.gm-week{display:flex;align-items:flex-end;gap:14px;margin:6px 0 12px}.gm-donut{width:96px;height:96px;flex:none;color:var(--text)}
.gm-bars{flex:1;display:grid;grid-template-columns:repeat(7,1fr);gap:6px;height:96px;align-items:end}
.gm-bars div{display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end}
.gm-bars span{width:100%;min-height:3px;border-radius:6px 6px 2px 2px;background:linear-gradient(180deg,var(--primary),var(--primary-2,var(--primary)))}
.gm-bars small{font-size:.7rem;color:var(--muted)}
.gm-mist{list-style:none;padding:0;margin:12px 0 0;display:grid;gap:8px;max-height:360px;overflow:auto}
.gm-mist li{display:grid;gap:2px;padding:8px 10px;border-radius:12px;border:1px solid var(--line);background:var(--card)}
@media (prefers-reduced-motion:reduce){.gm-boss-face.hit,.gm-boss-face.atk{animation:none}.gm-hp div{transition:none}}`;
  document.head.appendChild(css);

  /* ===================== Ишга тушириш ===================== */
  window.EkoGame = { track, streak, get coins() { return G.coins; }, get state() { return G; }, render };
  importOld();
  visit();
  if (!G.lvl) { G.lvl = App.levelOf(App.state.xp).n; save(); }
  render();
  App.renderGamification();
  if (App.renderChallenges) App.renderChallenges();
  hashSeen();
})();
