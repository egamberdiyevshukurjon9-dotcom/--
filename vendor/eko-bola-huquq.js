/* Экомун — 🎒 «Табиат ҳимоячиси»: мактаб босқичи учун экологик ҳуқуқ.
   Университетдаги «Экологик ҳуқуқ» бўлимининг болалар учун соддалаштирилган шакли.
   Ёшга қараб икки даража: 🧸 5–10 ёш (содда тил, расм ва овоз) ва 🧑 11–15 ёш (модда рақами, ҳисоб, далил).
   Усуллар: «ўз йўлингни танла» ҳикоялари, P4C (Болалар учун фалсафа), Think–Pair–Share,
   Street Law (болалар суди), Breakout EDU (квест-хона), Kahoot услубидаги викторина, «3-2-1» чиқиш чиптаси.
   Матнлар овоз билан ўқиб берилади (Web Speech API, қурилмада овоз бўлса).
   Маълумот: vendor/eko-bola-huquq-data.js. Натижалар фақат қурилмада (localStorage «ekotalim:bolahuquq»). */
(() => {
  "use strict";
  const SEC = document.getElementById("bolahuquq");
  const ROOT = document.getElementById("bhRoot");
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
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(L(o)); };
  const D = () => window.EKO_BOLA_HUQUQ || { STORIES: [], CONST: [], SORT: [], LESSONS: [], ROLES: [], CASES: [], ESCAPE: { locks: [] }, QUIZ: [], PLEDGE: [], METHODS: [], SOURCES: [] };
  const ext = (u, label) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;

  /* ---------- Ҳолат ---------- */
  const KEY = "ekotalim:bolahuquq";
  let st = { band: null, done: {}, xp: {}, seen: {}, lessons: {}, notes: {}, best: {}, pledge: {}, story: {} };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  const xp = (k, n, why) => {
    if (st.xp[k]) return;
    st.xp[k] = 1; save();
    const a = App(); if (a && a.addXp) a.addXp(n, L(why));
  };
  const mark = (k) => { if (!st.done[k]) { st.done[k] = 1; save(); } };
  /* Ёш гуруҳи: профилдаги ёшдан (10 гача — «k», 11–15 — «o»), фойдаланувчи ўзгартириши мумкин */
  const band = () => {
    if (st.band) return st.band;
    const age = window.EkoProfile && EkoProfile.age;
    return age && age >= 11 ? "o" : "k";
  };
  const teen = () => band() === "o";

  /* ---------- Овоз билан ўқиш (Web Speech API) ---------- */
  const canSpeak = "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function";
  function speak(text) {
    if (!canSpeak) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const vs = speechSynthesis.getVoices();
      const l = lang();
      const re = l === "ru" ? /^ru/i : l === "en" ? /^en/i : /^uz/i;
      const v = vs.find((x) => re.test(x.lang)) || (l === "cyr" || l === "lat" ? vs.find((x) => /^(tr|kk|ru)/i.test(x.lang)) : null);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = l === "ru" ? "ru-RU" : l === "en" ? "en-GB" : "uz-UZ";
      u.rate = band() === "k" ? 0.85 : 0.95;
      speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }
  const sayBtn = (id) => (canSpeak ? `<button type="button" class="btn btn-ghost btn-sm pdf-skip" data-say="${id}" aria-label="${H(TX.listen)}">🔊 ${H(TX.listen)}</button>` : "");

  /* ---------- Матнлар ---------- */
  const TX = {
    pill: t3("🎒 Мактаб босқичи · экологик ҳуқуқ", "🎒 Школьный этап · экологическое право", "🎒 School stage · environmental law"),
    title: t3("Табиат ҳимоячиси: болалар учун экологик ҳуқуқ", "Защитник природы: экологическое право для детей", "Nature Defender: environmental law for children"),
    lead: t3("Конституция ва қонунлар оддий тилда: ҳикоя ўқиймиз, ўйнаймиз, суд ўтказамиз ва сирли сандиқни очамиз. Ҳар бир қадам — битта юлдузча.",
      "Конституция и законы простыми словами: читаем истории, играем, проводим суд и открываем таинственный сундук. Каждый шаг — звёздочка.",
      "The Constitution and laws in simple words: read stories, play, hold a court and open the mystery chest. Every step earns a star."),
    bandK: t3("🧸 5–10 ёш", "🧸 5–10 лет", "🧸 ages 5–10"),
    bandO: t3("🧑 11–15 ёш", "🧑 11–15 лет", "🧑 ages 11–15"),
    bandL: t3("Даража", "Уровень", "Level"),
    listen: t3("Тинглаш", "Слушать", "Listen"),
    know: t3("💡 Билиб қўй", "💡 Знай", "💡 Did you know?"),
    next: t3("Кейингиси →", "Дальше →", "Next →"),
    again: t3("Қайтадан", "Заново", "Start again"),
    retry: t3("🤔 Яна бир ўйлаб кўр", "🤔 Подумай ещё", "🤔 Think again"),
    back: t3("← Рўйхат", "← К списку", "← Back to list"),
    check: t3("Текшириш", "Проверить", "Check"),
    right: t3("✓ Тўғри!", "✓ Верно!", "✓ Correct!"),
    wrong: t3("✕ Унчалик эмас.", "✕ Не совсем.", "✕ Not quite."),
    saved: t3("Сақланди", "Сохранено", "Saved"),
    save: t3("💾 Сақлаш", "💾 Сохранить", "💾 Save"),
    pdfAll: t3("PDF қилиш", "Сохранить в PDF", "Save as PDF"),
    open: t3("Очиш →", "Открыть →", "Open →"),
    stars: t3("Юлдузча", "Звёзды", "Stars"),
    tabs: [
      ["yol", "fa-route", t3("Йўл", "Путь", "Path")],
      ["hikoya", "fa-book-open", t3("Ҳикоялар", "Истории", "Stories")],
      ["konst", "fa-landmark", t3("Конституция", "Конституция", "Constitution")],
      ["saralash", "fa-scale-balanced", t3("Ҳуқуқ ёки бурч", "Право или долг", "Right or duty")],
      ["dars", "fa-flask", t3("Амалий дарслар", "Практические уроки", "Hands-on lessons")],
      ["sud", "fa-gavel", t3("Болалар суди", "Детский суд", "Kids’ court")],
      ["qochish", "fa-key", t3("Сирли дарё", "Таинственная река", "Mystery river")],
      ["kviz", "fa-bolt", t3("Викторина", "Викторина", "Quiz")],
      ["guvohnoma", "fa-award", t3("Гувоҳнома", "Удостоверение", "Certificate")],
      ["ustoz", "fa-chalkboard-user", t3("Ўқитувчи ва ота-она", "Учителю и родителям", "Teachers & parents")]
    ]
  };
  const tabName = (k) => (TX.tabs.find((x) => x[0] === k) || TX.tabs[0])[2];

  /* ========== 1. Йўл ========== */
  const ROAD = [
    ["hikoya", "📖", t3("3 та ҳикояни ўқи", "Прочитай 3 истории", "Read 3 stories")],
    ["konst", "🏛️", t3("4 та моддани ўрган", "Изучи 4 статьи", "Learn 4 articles")],
    ["saralash", "⚖️", t3("Ҳуқуқ ва бурчни ажрат", "Отличи право от долга", "Sort rights and duties")],
    ["dars", "🧪", t3("2 та амалий дарсни бажар", "Пройди 2 практических урока", "Do 2 hands-on lessons")],
    ["sud", "👩‍⚖️", t3("Болалар судида қатнаш", "Поучаствуй в детском суде", "Take part in the kids’ court")],
    ["qochish", "🔐", t3("Сирли сандиқни оч", "Открой таинственный сундук", "Open the mystery chest")],
    ["kviz", "⚡", t3("Викторинада 70% тўпла", "Набери 70% в викторине", "Score 70% in the quiz")],
    ["guvohnoma", "🏅", t3("Ваъда бериб, гувоҳнома ол", "Дай обещание и получи удостоверение", "Make a pledge and get your certificate")]
  ];
  const starCount = () => ROAD.filter(([k]) => st.done[k]).length;
  const RANKS = [
    [0, "🌱", t3("Куртак", "Росток", "Sprout")],
    [2, "🌿", t3("Ниҳол", "Саженец", "Sapling")],
    [4, "🌳", t3("Дарахт", "Дерево", "Tree")],
    [6, "🦸", t3("Табиат ҳимоячиси", "Защитник природы", "Nature Defender")]
  ];
  const rank = () => RANKS.filter((r) => starCount() >= r[0]).pop();
  function yolView() {
    const n = starCount(), r = rank();
    return `<div class="qn-card hb-hero">
        <div class="hb-rank" aria-hidden="true">${r[1]}</div>
        <div><h3>${H(t3("Сенинг даражанг", "Твой уровень", "Your rank"))}: ${H(r[2])}</h3>
        <p class="hb-stars" aria-label="${H(TX.stars)}: ${n}/${ROAD.length}">${ROAD.map(([k]) => (st.done[k] ? "⭐" : "☆")).join("")}</p>
        <p class="muted small">${H(t3("Ҳар бир қадам — битта юлдузча. 6 та юлдузчада «Табиат ҳимоячиси» бўласан!", "Каждый шаг — звёздочка. С 6 звёздами станешь «Защитником природы»!", "Each step is a star. With 6 stars you become a Nature Defender!"))}</p></div>
      </div>
      <ol class="hb-road">${ROAD.map(([k, ic, t], i) => `<li class="${st.done[k] ? "ok" : ""}">
        <button type="button" data-go="${k}"><span class="hb-road-n">${st.done[k] ? "✓" : i + 1}</span><span class="hb-road-ic" aria-hidden="true">${ic}</span><span>${H(t)}</span></button>
      </li>`).join("")}</ol>`;
  }

  /* ========== 2. Ҳикоялар ========== */
  let story = null, sPage = 0, sPick = null;
  function hikoyaView() {
    const S = D().STORIES;
    if (!story) {
      return `<div class="qn-card"><h3>📖 ${H(t3("«Ўз йўлингни танла» ҳикоялари", "Истории «Выбери свой путь»", "Choose-your-path stories"))}</h3>
          <p class="muted">${H(t3("Ҳикоя қаҳрамони қандай йўл тутишини сен танлайсан. Тўғри танлов табиатни асрайди!", "Ты выбираешь, как поступит герой. Правильный выбор бережёт природу!", "You choose what the hero does. The right choice protects nature!"))}</p></div>
        <div class="qn-grid">${S.map((s) => `<div class="qn-card hb-scard">
          <div class="hb-scene" aria-hidden="true">${s.scene}</div>
          <h3>${s.ic} ${H(s.t)} ${st.story[s.id] ? `<span class="qn-tag">✓</span>` : ""}</h3>
          <p class="small muted">${H(t3("Конституция", "Конституция", "Constitution"))}, ${esc(s.art)}-${H(t3("модда", "статья", "article"))}</p>
          <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-story="${s.id}">${H(t3("Ўқиш →", "Читать →", "Read →"))}</button></div>
        </div>`).join("")}</div>`;
    }
    const s = S.find((x) => x.id === story);
    const steps = `<ol class="qn-steps">${s.pages.map((_, i) => `<li class="${i < sPage ? "ok" : i === sPage ? "on" : ""}">${i + 1}</li>`).concat(`<li class="${sPage >= s.pages.length ? "on" : ""}">🏁</li>`).join("")}</ol>`;
    if (sPage >= s.pages.length) {
      return `<div class="qn-card">
        <div class="hb-scene" aria-hidden="true">${s.scene}</div>
        <h3>${s.ic} ${H(s.t)}</h3>${steps}
        <p class="qn-quote">🌟 ${H(s.learn)}</p>
        <h4>🤔 ${H(t3("Ўйлаб кўр (P4C саволи)", "Подумай (вопрос P4C)", "Think about it (P4C question)"))}</h4>
        <p>${H(s.p4c)}</p>
        <textarea class="qn-ta" data-note="st:${s.id}" rows="3" placeholder="${H(t3("Менимча…, чунки…", "Я думаю…, потому что…", "I think…, because…"))}">${esc(st.notes["st:" + s.id] || "")}</textarea>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="note" data-k="st:${s.id}">${H(TX.save)}</button><button class="btn btn-ghost btn-sm" data-act="story-back">${H(TX.back)}</button></div>
      </div>`;
    }
    const p = s.pages[sPage];
    const pick = sPick != null ? p.ch[sPick] : null;
    return `<div class="qn-card">
      <div class="hb-scene" aria-hidden="true">${s.scene}</div>
      <h3>${s.ic} ${H(s.t)}</h3>${steps}
      <p class="hb-text" data-say-text="p">${H(p.x)}</p>
      ${sayBtn("p")}
      ${p.teen && teen() ? `<p class="qn-quote">${H(TX.know)}: ${H(p.teen)}</p>` : ""}
      <div class="qn-opts">${p.ch.map((c, i) => `<button type="button" class="sg-opt ${pick ? (i === sPick ? (c.ok ? "ok" : "bad") : "") : ""}" data-ch="${i}" ${pick && pick.ok ? "disabled" : ""}>${H(c.t)}</button>`).join("")}</div>
      ${pick ? `<p class="qn-fb ${pick.ok ? "" : "bad"}">${H(pick.ok ? TX.right : TX.wrong)} ${H(pick.why)}</p>
        <div class="qn-acts pdf-skip">${pick.ok ? `<button class="btn btn-primary btn-sm" data-act="story-next">${H(TX.next)}</button>` : `<button class="btn btn-ghost btn-sm" data-act="story-retry">${H(TX.retry)}</button>`}</div>` : ""}
    </div>`;
  }

  /* ========== 3. Конституция ========== */
  function konstView() {
    const C = D().CONST;
    const n = C.filter((a) => st.seen[a.n]).length;
    return `<div class="qn-card"><h3>🏛️ ${H(t3("Конституция — содда тилда", "Конституция простыми словами", "The Constitution in simple words"))}</h3>
        <p class="muted">${H(t3("Ўзбекистон Конституциясида табиат ҳақида муҳим моддалар бор. Ҳар бирини ўқиб, «Тушундим» тугмасини бос. Дўстинг билан мисолни муҳокама қил: 1 дақиқа ўйла, 2 дақиқа жуфтинг билан гаплаш, кейин синфга айт (Think–Pair–Share).",
          "В Конституции Узбекистана есть важные статьи о природе. Прочитай каждую и нажми «Понятно». Обсуди пример с другом: минуту подумай, 2 минуты поговори в паре, потом расскажи классу (Think–Pair–Share).",
          "Uzbekistan’s Constitution has important articles about nature. Read each one and press “Got it”. Discuss the example with a friend: think for a minute, talk in pairs for 2, then tell the class (Think–Pair–Share)."))}</p>
        <div class="qn-prog"><span class="small"><b>${n}/${C.length}</b></span><div class="qn-meter"><i style="width:${Math.round((n / C.length) * 100)}%;background:var(--btn-grad, var(--primary))"></i></div></div></div>
      <div class="qn-grid">${C.map((a) => `<div class="qn-card hb-art">
        <div class="hb-art-n">${esc(a.n)}</div>
        <h3>${a.ic} ${H(a.t)}</h3>
        <p data-say-text="a${a.n}">${H(a.kid)}</p>
        ${teen() ? `<p class="qn-quote small">${H(a.teen)}</p>` : ""}
        <p class="small"><b>${H(t3("Мисол", "Пример", "Example"))}:</b> ${H(a.ex)}</p>
        <div class="qn-acts pdf-skip">${sayBtn("a" + a.n)}<button type="button" class="btn ${st.seen[a.n] ? "btn-ghost" : "btn-primary"} btn-sm" data-seen="${a.n}">${st.seen[a.n] ? "✓ " + H(t3("Тушундим", "Понятно", "Got it")) : H(t3("Тушундим 👍", "Понятно 👍", "Got it 👍"))}</button></div>
      </div>`).join("")}</div>
      <p class="small muted">${H(t3("Расмий матн", "Официальный текст", "Official text"))}: ${ext("https://lex.uz/docs/6445145", "lex.uz")}</p>`;
  }

  /* ========== 4. Ҳуқуқ ёки бурч ========== */
  let sortPick = {}, sortChecked = false;
  function saralashView() {
    const S = D().SORT;
    const ok = sortChecked ? S.filter((c, i) => sortPick[i] === c.k).length : 0;
    return `<div class="qn-card"><h3>⚖️ ${H(t3("Ҳуқуқ ёки бурч?", "Право или обязанность?", "Right or duty?"))}</h3>
      <p class="muted">${H(t3("Ҳуқуқ — сенга берилган имконият (масалан, тоза ҳаво). Бурч — сен бажарадиган иш (масалан, ахлат ташламаслик). Ҳар бир карточкани жойига қўй.",
        "Право — то, что тебе дано (например, чистый воздух). Обязанность — то, что ты делаешь (например, не мусорить). Разложи карточки.",
        "A right is something you are given (like clean air). A duty is something you do (like not littering). Sort each card."))}</p>
      <ul class="qn-sort">${S.map((c, i) => `<li class="${sortChecked ? (sortPick[i] === c.k ? "ok" : "bad") : ""}">
        <span>${H(c.t)}${sortChecked ? `<br><small class="muted">${H(c.why)}</small>` : ""}</span>
        <span class="hb-two"><button type="button" class="chip ${sortPick[i] === "h" ? "active" : ""}" data-sp="${i}:h">🙋 ${H(t3("Ҳуқуқ", "Право", "Right"))}</button><button type="button" class="chip ${sortPick[i] === "b" ? "active" : ""}" data-sp="${i}:b">🫶 ${H(t3("Бурч", "Долг", "Duty"))}</button></span>
      </li>`).join("")}</ul>
      ${sortChecked ? `<p class="qn-score">${ok} / ${S.length}</p><p>${H(ok === S.length ? t3("🎉 Аъло! Сен ҳуқуқ ва бурчни яхши ажратасан.", "🎉 Отлично! Ты хорошо различаешь права и обязанности.", "🎉 Excellent! You can tell rights from duties.") : t3("Қизил карточкаларни яна бир кўриб чиқ.", "Посмотри ещё раз на красные карточки.", "Have another look at the red cards."))}</p>` : ""}
      <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="sort-check" ${Object.keys(sortPick).length < S.length ? "disabled" : ""}>${H(TX.check)}</button><button class="btn btn-ghost btn-sm" data-act="sort-reset">${H(TX.again)}</button></div>
    </div>`;
  }

  /* ========== 5. Амалий дарслар ========== */
  let lesson = null, lqPick = {}, lqChecked = false, calcRes = null;
  function darsView() {
    const LS = D().LESSONS;
    if (!lesson) {
      return `<div class="qn-card"><h3>🧪 ${H(t3("Амалий дарслар: кузат, ўлча, ҳисобла", "Практические уроки: наблюдай, измеряй, считай", "Hands-on lessons: observe, measure, calculate"))}</h3>
          <p class="muted">${H(t3("Ҳар дарсда кичик тажриба, ҳисоб, топшириқ ва савол бор. Охирида «3-2-1» чиқиш чиптасини тўлдир.", "В каждом уроке — опыт, расчёт, задание и вопросы. В конце заполни «билет на выход» 3-2-1.", "Each lesson has an experiment, a sum, a task and questions. Finish with a 3-2-1 exit ticket."))}</p></div>
        <div class="qn-grid">${LS.map((l) => `<div class="qn-card">
          <h3>${l.ic} ${H(l.t)} ${st.lessons[l.id] ? `<span class="qn-tag">✓</span>` : ""}</h3>
          <div class="qn-meta"><span class="qn-tag">${H(l.age)}</span><span class="qn-tag">⏱ ${l.min} ${H(t3("дақиқа", "мин", "min"))}</span></div>
          <p>${H(l.goal)}</p>
          <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-lesson="${l.id}">${H(TX.open)}</button></div>
        </div>`).join("")}</div>`;
    }
    const l = LS.find((x) => x.id === lesson);
    const q = l.quiz || [];
    const okN = lqChecked ? q.filter((x, i) => lqPick[i] === x.c).length : 0;
    return `<div class="qn-card" id="bhLesson">
      <h3>${l.ic} ${H(l.t)}</h3>
      <div class="qn-meta"><span class="qn-tag">${H(l.age)}</span><span class="qn-tag">⏱ ${l.min} ${H(t3("дақиқа", "мин", "min"))}</span></div>
      <p><b>🎯 ${H(t3("Мақсад", "Цель", "Goal"))}:</b> ${H(l.goal)}</p>
      <p class="qn-quote">❓ ${H(l.hook)}</p>
      <div data-say-text="l">${l.body.map((b) => `<p>${H(b)}</p>`).join("")}</div>
      ${sayBtn("l")}
      ${l.steps ? `<h4>👣 ${H(t3("Қадамлар", "Шаги", "Steps"))}</h4><ol>${l.steps.map(([a, b]) => `<li><b>${H(a)}.</b> ${H(b)}</li>`).join("")}</ol>` : ""}
      ${l.exp ? `<h4>🧪 ${H(t3("Тажриба", "Опыт", "Experiment"))}</h4><p>${H(l.exp)}</p>` : ""}
      ${l.calc ? `<h4>🧮 ${H(t3("Ҳисобла", "Посчитай", "Calculate"))}</h4><p>${H(l.calc.q)}</p>
        <div class="hb-calc pdf-skip"><input type="number" inputmode="decimal" data-calc aria-label="${H(t3("Жавоб", "Ответ", "Answer"))}"> <span>${H(l.calc.unit)}</span> <button type="button" class="btn btn-primary btn-sm" data-act="calc">${H(TX.check)}</button></div>
        ${calcRes != null ? `<p class="qn-fb ${calcRes ? "" : "bad"}">${H(calcRes ? TX.right : TX.wrong)} ${H(l.calc.sol)}</p>` : ""}` : ""}
      <p><b>💡</b> ${H(l.tip)}</p>
      <h4>📝 ${H(t3("Уйга топшириқ", "Задание", "Task"))}</h4><p>${H(l.task)}</p>
      <h4>🧠 ${H(t3("Саволлар", "Вопросы", "Questions"))}</h4>
      <ol class="hb-quiz">${q.map((x, i) => `<li><p>${H(x.q)}</p><div class="qn-roles">${x.o.map((o, j) => `<button type="button" class="chip ${lqPick[i] === j ? "active" : ""} ${lqChecked ? (j === x.c ? "hb-good" : lqPick[i] === j ? "hb-bad" : "") : ""}" data-lq="${i}:${j}">${H(o)}</button>`).join("")}</div>
        ${lqChecked ? `<p class="small muted">${H(x.why)}</p>` : ""}</li>`).join("")}</ol>
      ${lqChecked ? `<p class="qn-score">${okN} / ${q.length}</p>` : ""}
      <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="lq-check" ${Object.keys(lqPick).length < q.length ? "disabled" : ""}>${H(TX.check)}</button></div>
      <h4>🎟️ ${H(t3("«3-2-1» чиқиш чиптаси", "«Билет на выход» 3-2-1", "3-2-1 exit ticket"))}</h4>
      <label class="small">${H(t3("3 та янги билим", "3 новых знания", "3 things I learned"))}<textarea class="qn-ta" rows="2" data-note="ex:${l.id}:3">${esc(st.notes["ex:" + l.id + ":3"] || "")}</textarea></label>
      <label class="small">${H(t3("2 та қизиқ нарса", "2 интересные вещи", "2 interesting things"))}<textarea class="qn-ta" rows="2" data-note="ex:${l.id}:2">${esc(st.notes["ex:" + l.id + ":2"] || "")}</textarea></label>
      <label class="small">${H(t3("1 та савол", "1 вопрос", "1 question"))}<textarea class="qn-ta" rows="1" data-note="ex:${l.id}:1">${esc(st.notes["ex:" + l.id + ":1"] || "")}</textarea></label>
      <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-act="note" data-k="ex:${l.id}">${H(TX.save)}</button></div>
      <details class="hb-teacher"><summary>👩‍🏫 ${H(t3("Ўқитувчи учун", "Для учителя", "For the teacher"))}</summary><p>${H(l.teacher)}</p></details>
      <p class="qn-src">📚 ${l.src.map((s) => ext(s.u, L(s.t))).join(" · ")}</p>
      <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-pdf="#bhLesson"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdfAll)}</button><button class="btn btn-ghost btn-sm" data-act="lesson-back">${H(TX.back)}</button></div>
    </div>`;
  }

  /* ========== 6. Болалар суди ========== */
  let cs = null, cStep = 0, cPick = null, cPts = 0, role = "sudya", votes = { a: 0, b: 0 };
  function sudView() {
    const R = D().ROLES, C = D().CASES;
    if (!cs) {
      return `<div class="qn-card"><h3>👩‍⚖️ ${H(t3("Болалар суди", "Детский суд", "Kids’ court"))}</h3>
          <p class="muted">${H(t3("АҚШдаги Street Law дастуридаги каби мактаб суди: ҳар ким бир ролни олади ва бир дақиқа гапиради. Синф — ҳакамлар.", "Школьный суд, как в американской программе Street Law: каждый берёт роль и говорит минуту. Класс — присяжные.", "A school court like the US Street Law programme: everyone takes a role and speaks for a minute. The class is the jury."))}</p>
          <h4>${H(t3("Ролингни танла", "Выбери роль", "Choose your role"))}</h4>
          <div class="qn-roles pdf-skip">${R.map(([k, i, t]) => `<button type="button" class="chip ${k === role ? "active" : ""}" data-role="${k}">${i} ${H(t)}</button>`).join("")}</div>
          <p class="small muted">${H((R.find((r) => r[0] === role) || R[0])[3])}</p></div>
        <div class="qn-grid">${C.map((c) => `<div class="qn-card">
          <h3>${c.ic} ${H(c.t)} ${st.best["sud:" + c.id] != null ? `<span class="qn-tag">${st.best["sud:" + c.id]}/${c.steps.length}</span>` : ""}</h3>
          <p>${H(c.facts)}</p>
          <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-case="${c.id}">${H(t3("Судни бошлаш →", "Начать суд →", "Start the court →"))}</button></div>
        </div>`).join("")}</div>`;
    }
    const c = C.find((x) => x.id === cs);
    const steps = `<ol class="qn-steps">${c.steps.map((_, i) => `<li class="${i < cStep ? "ok" : i === cStep ? "on" : ""}">${i + 1}</li>`).join("")}</ol>`;
    if (cStep >= c.steps.length) {
      return `<div class="qn-card"><h3>${c.ic} ${H(c.t)}</h3>${steps}
        <p class="qn-score">${cPts} / ${c.steps.length}</p>
        <h4>👥 ${H(t3("Ҳакамлар овози (синфда)", "Голосование присяжных (в классе)", "Jury vote (in class)"))}</h4>
        <div class="qn-kpi pdf-skip"><div><b>${votes.a}</b><button type="button" class="btn btn-ghost btn-sm" data-vote="a">✅ ${H(t3("Қарорга розиман", "Согласен с решением", "I agree with the decision"))}</button></div>
          <div><b>${votes.b}</b><button type="button" class="btn btn-ghost btn-sm" data-vote="b">🤔 ${H(t3("Бошқа фикрим бор", "У меня другое мнение", "I think differently"))}</button></div></div>
        <h4>📝 ${H(t3("Судья қарори", "Решение судьи", "The judge’s decision"))}</h4>
        <textarea class="qn-ta" data-note="sud:${c.id}" rows="3" placeholder="${H(t3("Суд қарор қилди: …", "Суд решил: …", "The court decided: …"))}">${esc(st.notes["sud:" + c.id] || "")}</textarea>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="note" data-k="sud:${c.id}">${H(TX.save)}</button><button class="btn btn-ghost btn-sm" data-act="case-back">${H(TX.back)}</button></div></div>`;
    }
    const s = c.steps[cStep];
    return `<div class="qn-card"><h3>${c.ic} ${H(c.t)}</h3>${steps}
      <p class="small muted">${H(c.facts)}</p>
      <p><b>${(R.find((r) => r[0] === role) || R[0])[1]} ${H((R.find((r) => r[0] === role) || R[0])[2])}:</b> ${H(s.q)}</p>
      <div class="qn-opts">${s.o.map((o, i) => `<button type="button" class="sg-opt ${cPick != null ? (i === s.c ? "ok" : i === cPick ? "bad" : "") : ""}" data-cp="${i}" ${cPick != null ? "disabled" : ""}>${H(o)}</button>`).join("")}</div>
      ${cPick != null ? `<p class="qn-fb ${cPick === s.c ? "" : "bad"}">${H(cPick === s.c ? TX.right : TX.wrong)} ${H(s.why)}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="case-next">${H(TX.next)}</button></div>` : ""}
    </div>`;
  }

  /* ========== 7. Сирли дарё (квест-хона) ========== */
  let eI = 0, eLeft = 600, eT = null, eHint = {}, eMsg = null, eOn = false;
  const norm = (s) => (EL() && EL().fold ? EL().fold(tr(String(s || ""))) : tr(String(s || ""))).toLowerCase().replace(/[\s.,'ʻʼ’`-]/g, "").replace(/ё/g, "е");
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  function stopTimer() { if (eT) clearInterval(eT); eT = null; }
  function qochishView() {
    const E = D().ESCAPE, Ls = E.locks;
    if (eI >= Ls.length) {
      return `<div class="qn-card hb-win"><div class="hb-chest" aria-hidden="true">🎁</div>
        <h3>${H(E.win)}</h3>
        <p class="qn-score">⏱ ${fmt(600 - eLeft)}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-act="esc-reset">${H(TX.again)}</button></div></div>`;
    }
    if (!eOn) {
      return `<div class="qn-card"><div class="hb-chest" aria-hidden="true">🧰</div>
        <h3>🔐 ${H(t3("Сирли дарё: 4 қулфли сандиқ", "Таинственная река: сундук с 4 замками", "Mystery river: a chest with 4 locks"))}</h3>
        <p>${H(E.intro)}</p>
        <p class="hb-locks" aria-hidden="true">${Ls.map((l) => l.ic).join(" ")}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary" data-act="esc-start">▶ ${H(t3("Бошлаш", "Начать", "Start"))}</button></div></div>`;
    }
    const lk = Ls[eI];
    return `<div class="qn-card">
      <div class="hb-esc-top"><span class="qn-timer" data-etimer>${fmt(eLeft)}</span>
        <span class="hb-locks">${Ls.map((l, i) => `<span class="${i < eI ? "open" : i === eI ? "on" : ""}" title="${H(l.t)}">${i < eI ? "🔓" : "🔒"}</span>`).join("")}</span></div>
      <h3>${lk.ic} ${H(lk.t)} · ${eI + 1}/${Ls.length}</h3>
      <p class="hb-text">${H(lk.x)}</p>
      <form class="hb-calc" data-esc>
        <input type="text" autocomplete="off" autocapitalize="off" data-eans aria-label="${H(t3("Код", "Код", "Code"))}">
        <button class="btn btn-primary btn-sm" type="submit">🔑 ${H(t3("Очиш", "Открыть", "Unlock"))}</button>
        <button class="btn btn-ghost btn-sm" type="button" data-act="esc-hint">💡 ${H(t3("Ёрдам (−30 с)", "Подсказка (−30 с)", "Hint (−30 s)"))}</button>
      </form>
      ${eHint[eI] ? `<p class="qn-quote small">💡 ${H(lk.hint)}</p>` : ""}
      ${eMsg ? `<p class="qn-fb bad">${H(eMsg)}</p>` : ""}
      ${eLeft <= 0 ? `<p class="qn-fb bad">${H(t3("⏰ Вақт тугади, лекин давом этишинг мумкин!", "⏰ Время вышло, но можно продолжать!", "⏰ Time is up, but you can keep going!"))}</p>` : ""}
    </div>`;
  }

  /* ========== 8. Викторина (Kahoot услуби) ========== */
  let kQs = [], kI = 0, kPick = null, kPts = 0, kOk = 0, kStreak = 0, kLeft = 20, kT = null, kOn = false;
  const KCOL = ["#e21b3c", "#1368ce", "#d89e00", "#26890c"];
  const KSHAPE = ["▲", "◆", "●", "■"];
  function kStop() { if (kT) clearInterval(kT); kT = null; }
  function kStart() {
    const all = D().QUIZ;
    kQs = (teen() ? all : all.filter((q) => q.b === "k")).slice().sort(() => Math.random() - 0.5).slice(0, 8);
    kI = 0; kPick = null; kPts = 0; kOk = 0; kStreak = 0; kOn = true; kTick();
  }
  function kTick() {
    kStop(); kLeft = 20;
    kT = setInterval(() => {
      kLeft = Math.max(0, kLeft - 1);
      const el = ROOT.querySelector("[data-ktimer]");
      if (el) { el.textContent = kLeft; el.parentElement.style.setProperty("--p", kLeft / 20); }
      if (!kLeft) { kStop(); if (kPick == null) { kPick = -1; kStreak = 0; rerender(true); } }
    }, 1000);
  }
  function kvizView() {
    if (!kOn) {
      return `<div class="qn-card"><h3>⚡ ${H(t3("Тезкор викторина", "Быстрая викторина", "Speed quiz"))}</h3>
        <p>${H(t3("8 та савол, ҳар бирига 20 сония. Тез ва тўғри жавоб — кўпроқ балл, кетма-кет тўғри жавоб — бонус! Синфда проектор орқали ўйнаш мумкин.", "8 вопросов, по 20 секунд. Быстрый верный ответ — больше баллов, серия — бонус! В классе можно играть через проектор.", "8 questions, 20 seconds each. Fast right answers score more, streaks give a bonus! Play on a projector in class."))}</p>
        ${st.best.kviz != null ? `<p class="small">${H(t3("Энг яхши натижа", "Лучший результат", "Best score"))}: <b>${st.best.kviz}</b></p>` : ""}
        <div class="qn-acts pdf-skip"><button class="btn btn-primary" data-act="k-start">▶ ${H(t3("Бошлаш", "Начать", "Start"))}</button></div></div>`;
    }
    if (kI >= kQs.length) {
      const pct = Math.round((kOk / kQs.length) * 100);
      return `<div class="qn-card hb-win"><div class="hb-chest" aria-hidden="true">${pct >= 70 ? "🏆" : "💪"}</div>
        <h3>${H(t3("Натижа", "Результат", "Result"))}: ${kOk}/${kQs.length} (${pct}%)</h3>
        <p class="qn-score">${kPts} ${H(t3("балл", "баллов", "points"))}</p>
        <p>${H(pct >= 70 ? t3("Зўр! Сен ҳақиқий Табиат ҳимоячисисан.", "Здорово! Ты настоящий Защитник природы.", "Great! You are a true Nature Defender.") : t3("Яна бир марта уриниб кўр — ҳикоялар ва Конституция табига қара.", "Попробуй ещё раз — загляни в истории и Конституцию.", "Try again — look at the Stories and Constitution tabs."))}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="k-start">${H(TX.again)}</button></div></div>`;
    }
    const q = kQs[kI];
    return `<div class="qn-card">
      <div class="hb-esc-top"><span class="small">${kI + 1}/${kQs.length} · ${kPts} ${H(t3("балл", "баллов", "pts"))}${kStreak > 1 ? ` · 🔥${kStreak}` : ""}</span><span class="hb-ring" style="--p:${kLeft / 20}"><b data-ktimer>${kLeft}</b></span></div>
      <h3 class="hb-kq">${H(q.q)}</h3>
      <div class="hb-kopts">${q.o.map((o, i) => `<button type="button" style="--k:${KCOL[i]}" class="${kPick != null ? (i === q.c ? "ok" : i === kPick ? "bad" : "dim") : ""}" data-kp="${i}" ${kPick != null ? "disabled" : ""}><span aria-hidden="true">${KSHAPE[i]}</span> ${H(o)}</button>`).join("")}</div>
      ${kPick != null ? `<p class="qn-fb ${kPick === q.c ? "" : "bad"}">${H(kPick === q.c ? TX.right : kPick === -1 ? t3("⏰ Вақт тугади.", "⏰ Время вышло.", "⏰ Time’s up.") : TX.wrong)}</p>
        <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-act="k-next">${H(TX.next)}</button></div>` : ""}
    </div>`;
  }

  /* ========== 9. Гувоҳнома ========== */
  function guvohnomaView() {
    const P = D().PLEDGE;
    const n = P.filter((_, i) => st.pledge[i]).length;
    const name = (window.EkoProfile && EkoProfile.profile && EkoProfile.profile.name) || (App() && App().state && App().state.name) || "";
    const ready = n >= 4;
    const date = new Date().toLocaleDateString(lang() === "en" ? "en-GB" : lang() === "ru" ? "ru-RU" : "uz-UZ");
    return `<div class="qn-card"><h3>🏅 ${H(t3("Табиат ҳимоячисининг ваъдаси", "Обещание Защитника природы", "The Nature Defender’s pledge"))}</h3>
        <p class="muted">${H(t3("Камида 4 та ваъдани белгила — гувоҳноманг тайёр бўлади.", "Отметь хотя бы 4 обещания — и удостоверение готово.", "Tick at least 4 promises and your certificate is ready."))}</p>
        <ul class="hb-pledge">${P.map((p, i) => `<li><label><input type="checkbox" data-pl="${i}" ${st.pledge[i] ? "checked" : ""}> ${H(p)}</label></li>`).join("")}</ul></div>
      ${ready ? `<div class="qn-card hb-cert" id="bhCert">
        <div class="hb-cert-in">
          <p class="hb-cert-top">Ekomun · ${H(t3("экологик таълим платформаси", "платформа экологического образования", "environmental education platform"))}</p>
          <h3>🦸 ${H(t3("ГУВОҲНОМА", "УДОСТОВЕРЕНИЕ", "CERTIFICATE"))}</h3>
          <p>${H(t3("Ушбу гувоҳнома", "Настоящее удостоверение выдано", "This certificate is awarded to"))}</p>
          <p class="hb-cert-name">${esc(name || L(t3("Табиат ҳимоячиси", "Защитник природы", "Nature Defender")))}</p>
          <p>${H(t3("га «Табиат ҳимоячиси» курсида қатнашгани ва қуйидаги ваъдаларни бергани учун берилди:", "за участие в курсе «Защитник природы» и данные обещания:", "for taking part in the Nature Defender course and making these promises:"))}</p>
          <ul>${P.filter((_, i) => st.pledge[i]).map((p) => `<li>${H(p)}</li>`).join("")}</ul>
          <p class="hb-stars">${ROAD.map(([k]) => (st.done[k] ? "⭐" : "☆")).join("")} · ${H(rank()[2])}</p>
          <p class="small">${esc(date)}</p>
        </div></div>
        <div class="qn-acts"><button class="btn btn-primary btn-sm" data-pdf="#bhCert"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(t3("Гувоҳномани PDF қилиш", "Удостоверение в PDF", "Certificate as PDF"))}</button></div>` : ""}`;
  }

  /* ========== 10. Ўқитувчи ва ота-она ========== */
  function ustozView() {
    const M = D().METHODS;
    const PLAN = [
      ["5", t3("Ҳикоя ёки савол билан бошлаш (ҳикоялар таби)", "Начать с истории или вопроса (вкладка «Истории»)", "Start with a story or question (Stories tab)")],
      ["10", t3("Конституция карточкаси: Think–Pair–Share", "Карточка Конституции: Think–Pair–Share", "Constitution card: Think–Pair–Share")],
      ["10", t3("«Ҳуқуқ ёки бурч» ўйини жуфтликда", "Игра «Право или долг» в парах", "“Right or duty” game in pairs")],
      ["12", t3("Болалар суди ёки «Сирли дарё» гуруҳларда", "Детский суд или «Таинственная река» в группах", "Kids’ court or Mystery river in groups")],
      ["5", t3("Тезкор викторина (проектор)", "Быстрая викторина (проектор)", "Speed quiz (projector)")],
      ["3", t3("«3-2-1» чиқиш чиптаси", "«Билет на выход» 3-2-1", "3-2-1 exit ticket")]
    ];
    return `<div class="qn-card"><h3>🗓️ ${H(t3("45 дақиқалик дарс режаси", "План урока на 45 минут", "A 45-minute lesson plan"))}</h3>
        <table class="qn-table"><tbody>${PLAN.map(([m, t]) => `<tr><td><b>${m}′</b></td><td>${H(t)}</td></tr>`).join("")}</tbody></table>
        <p class="small muted">${H(t3("Кичик синфларда (5–10 ёш) суд ўрнига ҳикояни саҳнада ўйнаш мумкин. Ота-оналар учун: ҳар куни битта ҳикояни бирга ўқинг ва 🤔 саволни кечки овқатда муҳокама қилинг.", "В младших классах (5–10 лет) вместо суда можно разыграть историю. Родителям: читайте по одной истории в день и обсуждайте вопрос 🤔 за ужином.", "With younger pupils (5–10) act out a story instead of the court. Parents: read one story a day together and discuss the 🤔 question at dinner."))}</p></div>
      <div class="qn-grid">${M.map((m) => `<div class="qn-card"><h3>${m.ic} ${H(m.t)}</h3>
        <p class="small muted">${H(m.who)}</p><p>${H(m.how)}</p><p class="small"><b>${H(t3("Платформада", "На платформе", "On the platform"))}:</b> ${H(m.use)}</p></div>`).join("")}</div>
      <div class="qn-card"><h3>📚 ${H(t3("Манбалар", "Источники", "Sources"))}</h3><ul class="qn-src">${D().SOURCES.map((s) => `<li>${ext(s.u, L(s.t))}</li>`).join("")}</ul>
        <p class="small muted">${H(t3("Университет босқичидаги «Экологик ҳуқуқ» бўлимида қонунларнинг тўлиқ кутубхонаси ва дарслиги бор.", "В разделе «Экологическое право» университетского этапа — полная библиотека законов и учебник.", "The university-stage Environmental law section has the full law library and textbook."))}</p></div>`;
  }

  /* ---------- Чизиш ---------- */
  let tab = "yol";
  const VIEWS = { yol: yolView, hikoya: hikoyaView, konst: konstView, saralash: saralashView, dars: darsView, sud: sudView, qochish: qochishView, kviz: kvizView, guvohnoma: guvohnomaView, ustoz: ustozView };
  function render() {
    const name = tabName(tab);
    ROOT.innerHTML = `
      <div class="qn-head">
        <div><span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(TX.title)}</h2>
        <p class="muted" style="max-width:760px">${H(TX.lead)}</p></div>
        <div class="hb-band" role="group" aria-label="${H(TX.bandL)}">
          <button type="button" class="chip ${band() === "k" ? "active" : ""}" data-band="k" aria-pressed="${band() === "k"}">${H(TX.bandK)}</button>
          <button type="button" class="chip ${band() === "o" ? "active" : ""}" data-band="o" aria-pressed="${band() === "o"}">${H(TX.bandO)}</button>
        </div>
      </div>
      <div class="qn-tabs" role="tablist">${TX.tabs.map(([k, ic, t]) => `<button type="button" role="tab" aria-selected="${k === tab}" class="chip ${k === tab ? "active" : ""}" data-tab="${k}"><i class="fa-solid ${ic}" aria-hidden="true"></i>${H(t)}${st.done[k] ? " ⭐" : ""}</button>`).join("")}</div>
      <div class="qn-panel" id="bhPanel" role="tabpanel" aria-label="${H(name)}">${VIEWS[tab]()}</div>
      ${["yol", "qochish", "kviz", "guvohnoma"].includes(tab) || (tab === "dars" && lesson) ? "" : `<div class="qn-acts"><button class="btn btn-ghost btn-sm" data-pdf="#bhPanel"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdfAll)}: ${H(name)}</button></div>`}`;
  }
  function rerender(keepY) {
    const y = window.scrollY;
    render();
    if (keepY) window.scrollTo(0, y);
  }
  function pdf(sel) {
    const el = ROOT.querySelector(sel);
    if (!el || !window.EkoPDF) return;
    const h = el.querySelector("h3");
    const title = sel === "#bhPanel" ? `${L(TX.title)}: ${L(tabName(tab))}` : (h ? h.textContent.trim() : L(tabName(tab)));
    EkoPDF.save(el, { title, sub: L(TX.title) + " · Ekomun", file: "Ekomun-tabiat-himoyachisi-" + tab });
  }
  function leaveTab() { stopTimer(); kStop(); try { if (canSpeak) speechSynthesis.cancel(); } catch (e) { /* ignore */ } }

  ROOT.addEventListener("click", (e) => {
    const b = e.target.closest("button, a");
    if (!b || !ROOT.contains(b)) return;
    const ds = b.dataset;
    if (ds.tab || ds.go) { leaveTab(); tab = ds.tab || ds.go; eOn = false; kOn = false; render(); if (ds.go) SEC.scrollIntoView({ behavior: "smooth" }); else ROOT.querySelector(".qn-tabs .active").scrollIntoView({ block: "nearest", inline: "center" }); return; }
    if (ds.band) { st.band = ds.band; save(); rerender(true); return; }
    if (ds.pdf) { pdf(ds.pdf); return; }
    if (ds.say) { const el = ROOT.querySelector(`[data-say-text="${ds.say}"]`); if (el) speak(el.textContent.trim()); return; }
    if (ds.story) { story = ds.story; sPage = 0; sPick = null; render(); ROOT.querySelector("#bhPanel").scrollIntoView({ behavior: "smooth" }); return; }
    if (ds.ch != null) { sPick = +ds.ch; rerender(true); return; }
    if (ds.seen) {
      st.seen[ds.seen] = 1; save();
      if (D().CONST.filter((a) => st.seen[a.n]).length >= 4) { mark("konst"); xp("bh:konst", 10, t3("Конституция", "Конституция", "Constitution")); }
      rerender(true); return;
    }
    if (ds.sp) { const [i, k] = ds.sp.split(":"); sortPick[i] = k; sortChecked = false; rerender(true); return; }
    if (ds.lesson) { lesson = ds.lesson; lqPick = {}; lqChecked = false; calcRes = null; render(); ROOT.querySelector("#bhPanel").scrollIntoView({ behavior: "smooth" }); return; }
    if (ds.lq) { const [i, j] = ds.lq.split(":").map(Number); lqPick[i] = j; lqChecked = false; rerender(true); return; }
    if (ds.role) { role = ds.role; rerender(true); return; }
    if (ds.case) { cs = ds.case; cStep = 0; cPick = null; cPts = 0; votes = { a: 0, b: 0 }; render(); ROOT.querySelector("#bhPanel").scrollIntoView({ behavior: "smooth" }); return; }
    if (ds.cp != null) { const c = D().CASES.find((x) => x.id === cs); cPick = +ds.cp; if (cPick === c.steps[cStep].c) cPts++; rerender(true); return; }
    if (ds.vote) { votes[ds.vote]++; rerender(true); return; }
    if (ds.kp != null) {
      kStop(); kPick = +ds.kp;
      const q = kQs[kI];
      if (kPick === q.c) { kOk++; kStreak++; kPts += 500 + Math.round(500 * kLeft / 20) + (kStreak > 1 ? 100 : 0); if (navigator.vibrate) navigator.vibrate(40); }
      else { kStreak = 0; if (navigator.vibrate) navigator.vibrate([60, 40, 60]); }
      rerender(true); return;
    }
    switch (ds.act) {
      case "story-next": {
        const s = D().STORIES.find((x) => x.id === story);
        sPage++; sPick = null;
        if (sPage >= s.pages.length) {
          st.story[s.id] = 1; save(); xp("bh:st:" + s.id, 5, t3("ҳикоя", "история", "story"));
          if (D().STORIES.filter((x) => st.story[x.id]).length >= 3) mark("hikoya");
        }
        rerender(true); return;
      }
      case "story-retry": sPick = null; rerender(true); return;
      case "story-back": story = null; leaveTab(); rerender(false); return;
      case "sort-check": {
        sortChecked = true;
        const S = D().SORT;
        if (S.every((c, i) => sortPick[i] === c.k)) { mark("saralash"); xp("bh:sort", 10, t3("ҳуқуқ ва бурч", "права и обязанности", "rights and duties")); }
        rerender(true); return;
      }
      case "sort-reset": sortPick = {}; sortChecked = false; rerender(true); return;
      case "calc": {
        const l = D().LESSONS.find((x) => x.id === lesson);
        const v = parseFloat(String(ROOT.querySelector("[data-calc]").value).replace(",", ".").replace(/\s/g, ""));
        calcRes = isFinite(v) && Math.abs(v - l.calc.a) <= Math.abs(l.calc.a) * 0.01;
        rerender(true); return;
      }
      case "lq-check": {
        lqChecked = true;
        const l = D().LESSONS.find((x) => x.id === lesson);
        if (l.quiz.every((x, i) => lqPick[i] === x.c)) {
          st.lessons[l.id] = 1; save(); xp("bh:l:" + l.id, 5, L(l.t));
          if (D().LESSONS.filter((x) => st.lessons[x.id]).length >= 2) mark("dars");
        }
        rerender(true); return;
      }
      case "lesson-back": lesson = null; leaveTab(); rerender(false); return;
      case "case-next": {
        const c = D().CASES.find((x) => x.id === cs);
        cStep++; cPick = null;
        if (cStep >= c.steps.length) { st.best["sud:" + c.id] = Math.max(st.best["sud:" + c.id] || 0, cPts); mark("sud"); save(); xp("bh:sud:" + c.id, 10, t3("болалар суди", "детский суд", "kids’ court")); }
        rerender(true); return;
      }
      case "case-back": cs = null; rerender(false); return;
      case "esc-start": {
        eOn = true; eI = 0; eLeft = 600; eHint = {}; eMsg = null; stopTimer();
        eT = setInterval(() => {
          eLeft = Math.max(0, eLeft - 1);
          const el = ROOT.querySelector("[data-etimer]");
          if (el) el.textContent = fmt(eLeft);
          if (!eLeft) { stopTimer(); rerender(true); }
        }, 1000);
        rerender(true); const inp = ROOT.querySelector("[data-eans]"); if (inp) inp.focus(); return;
      }
      case "esc-hint": eHint[eI] = 1; eLeft = Math.max(0, eLeft - 30); rerender(true); return;
      case "esc-reset": eOn = false; eI = 0; stopTimer(); rerender(true); return;
      case "k-start": kStart(); rerender(true); return;
      case "k-next": {
        kI++; kPick = null;
        if (kI >= kQs.length) {
          kStop(); st.best.kviz = Math.max(st.best.kviz || 0, kPts); save();
          if (kOk / kQs.length >= 0.7) { mark("kviz"); xp("bh:kviz", 10, t3("викторина", "викторина", "quiz")); }
        } else kTick();
        rerender(true); return;
      }
      case "note": {
        const k = ds.k;
        ROOT.querySelectorAll(`[data-note^="${k}"]`).forEach((t) => { st.notes[t.dataset.note] = t.value.trim(); });
        save(); toast(TX.saved); return;
      }
    }
  });
  ROOT.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-esc]");
    if (!f) return;
    e.preventDefault();
    const Ls = D().ESCAPE.locks;
    const v = norm(f.querySelector("[data-eans]").value);
    if (Ls[eI].a.some((a) => norm(a) === v)) {
      eI++; eMsg = null;
      if (navigator.vibrate) navigator.vibrate(60);
      if (eI >= Ls.length) { stopTimer(); mark("qochish"); xp("bh:esc", 15, t3("сирли сандиқ", "таинственный сундук", "mystery chest")); }
    } else eMsg = L(t3("Код тўғри келмади. Яна бир бор ўйла!", "Код не подошёл. Подумай ещё!", "Wrong code. Think again!"));
    rerender(true);
    const inp = ROOT.querySelector("[data-eans]"); if (inp) inp.focus();
  });
  ROOT.addEventListener("change", (e) => {
    const c = e.target.closest("[data-pl]");
    if (!c) return;
    st.pledge[c.dataset.pl] = c.checked ? 1 : 0; save();
    if (D().PLEDGE.filter((_, i) => st.pledge[i]).length >= 4) { mark("guvohnoma"); xp("bh:pledge", 10, t3("Табиат ҳимоячиси ваъдаси", "обещание Защитника природы", "Nature Defender pledge")); }
    rerender(true);
  });

  render();
  window.addEventListener("eko:lang", render);
  window.addEventListener("eko:stage", render);
  window.EkoBolaHuquq = { open: (k) => { tab = k || "yol"; render(); }, stars: starCount };
})();
