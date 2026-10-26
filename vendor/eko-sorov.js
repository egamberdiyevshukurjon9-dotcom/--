/* Экомун — 📋 «Сўровнома» (Tally услубида): битта экранда битта савол, клавиатура билан ҳам
   (A, B, C… ёки 0–9 танлайди, Enter — кейингиси). Саволлар vendor/eko-sorov-data.js да.
   Жавоблар серверга аноним юборилади (қурилма коди серверда хэшланади: бир қурилмадан битта жавоб),
   натижалар Бошқарув марказидаги «Сўровнома» бўлимида: NPS, PMF (Шон Эллис тести), нарх ва B2B гипотезалари.
   Платформадан 3 кун фойдаланган одамга бир марта таклиф карточкаси чиқади. Интернет бўлмаса жавоб навбатда туради.
   Қурилмада: localStorage «ekotalim:sorov». */
(() => {
  "use strict";
  const SEC = document.getElementById("sorov");
  const ROOT = document.getElementById("svRoot");
  const S = window.EKO_SOROV;
  if (!SEC || !ROOT || !S) return;

  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const lang = () => (EL() ? EL().lang : "cyr");
  const L = (o) => {
    if (o == null) return "";
    if (typeof o === "string") return lang() === "lat" && EL() ? EL().tr(o) : o;
    const l = lang();
    if (l === "ru") return o.ru || o.uz;
    if (l === "en") return o.en || o.uz;
    if (l === "lat" && EL()) return EL().tr(o.uz);
    return o.uz;
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const H = (o) => esc(L(o));
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const App = () => window.EkoApp;
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(L(o)); };
  const kid = () => document.documentElement.classList.contains("stage-maktab");
  const stage = () => (kid() ? "maktab" : document.documentElement.classList.contains("stage-uni") ? "uni" : "");
  const LETTERS = "ABCDEFGHIJ";

  const TX = {
    pill: t3("📋 2 дақиқа · аноним", "📋 2 минуты · анонимно", "📋 2 minutes · anonymous"),
    lead: t3("Жавобларингиз Ekomun'ни кимлар учун ва қандай ривожлантиришни ҳал қилишга ёрдам беради. Исмингиз сўралмайди.",
      "Ваши ответы помогут решить, как развивать Ekomun. Имя не спрашиваем.", "Your answers help us decide how to grow Ekomun. We don’t ask for your name."),
    start: t3("Бошлаш", "Начать", "Start"),
    next: t3("Кейингиси", "Далее", "Next"),
    back: t3("Орқага", "Назад", "Back"),
    skip: t3("Ўтказиб юбориш", "Пропустить", "Skip"),
    send: t3("Юбориш", "Отправить", "Submit"),
    hint: t3("Ҳарф ёки рақам тугмаси билан танланг, Enter — кейингиси", "Выбирайте клавишами-буквами или цифрами, Enter — далее", "Press a letter or number key to choose, Enter for next"),
    many: t3("{n} тагача танланг", "Выберите до {n}", "Choose up to {n}"),
    of: t3("{i} / {n}", "{i} из {n}", "{i} of {n}"),
    thanks: t3("Раҳмат! Жавобларингиз юборилди.", "Спасибо! Ответы отправлены.", "Thank you! Your answers were sent."),
    thanksLead: t3("Сиз Ekomun'ни яхшилашга ёрдам бердингиз. +20 XP.", "Вы помогли улучшить Ekomun. +20 XP.", "You helped improve Ekomun. +20 XP."),
    queued: t3("Интернет йўқ — жавоблар сақланди ва алоқа тиклангач ўзи юборилади.", "Нет связи — ответы сохранены и отправятся автоматически.", "No connection — answers are saved and will be sent automatically."),
    again: t3("Жавобларни ўзгартириш", "Изменить ответы", "Change my answers"),
    fikr: t3("Батафсил ёзмоқчимисиз? Фикр-мулоҳаза бўлими", "Хотите написать подробнее? Раздел «Отзывы»", "Want to write more? Feedback section"),
    need: t3("Камида 2 та саволга жавоб беринг.", "Ответьте хотя бы на 2 вопроса.", "Please answer at least 2 questions."),
    invite: t3("Ekomun ҳақида 2 дақиқалик сўровномага жавоб берасизми? +20 XP", "Ответите на опрос об Ekomun (2 минуты)? +20 XP", "Take a 2-minute survey about Ekomun? +20 XP"),
    later: t3("Кейинроқ", "Позже", "Later"),
    never: t3("Кўрсатма", "Не показывать", "Don’t show again"),
    uxOn: t3("Аноним фойдаланиш таҳлили ёқилган: қайси тугмалар босилгани ва бўлимлар қанча кўрилгани (матн, исм ва киритилган қийматларсиз) — сайтни қулайроқ қилиш учун.",
      "Анонимная аналитика включена: какие кнопки нажимают и сколько смотрят разделы (без текста, имени и введённых данных).", "Anonymous usage analytics is on: which buttons are pressed and how far sections are read (no text, names or typed values)."),
    uxOff: t3("Аноним фойдаланиш таҳлили ўчирилган.", "Анонимная аналитика выключена.", "Anonymous usage analytics is off."),
    uxDnt: t3("Браузерингизда «Do Not Track» ёқилган — таҳлил юритилмайди.", "В браузере включён «Do Not Track» — аналитика не ведётся.", "Your browser sends “Do Not Track”, so no analytics is collected."),
    uxBtnOff: t3("Ўчириш", "Выключить", "Turn off"),
    uxBtnOn: t3("Ёқиш", "Включить", "Turn on")
  };
  function uxLine() {
    const U = window.EkoUx;
    if (!U) return "";
    const txt = U.dnt ? TX.uxDnt : U.enabled ? TX.uxOn : TX.uxOff;
    return `<p class="small muted sv-ux">🛡️ ${H(txt)}${U.dnt ? "" : ` <button type="button" class="btn btn-ghost btn-sm" data-act="ux">${H(U.enabled ? TX.uxBtnOff : TX.uxBtnOn)}</button>`}</p>`;
  }

  /* ---------- Ҳолат ---------- */
  const KEY = "ekotalim:sorov";
  let st = { sv: S.id, i: -1, ans: {}, done: 0, queued: false, days: [], snooze: 0, never: false };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  if (st.sv !== S.id) st = Object.assign(st, { sv: S.id, i: -1, ans: {}, done: 0, queued: false });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  const vid = () => { try { const v = localStorage.getItem("ekotalim:vid") || ""; return /^[a-z0-9]{12,32}$/.test(v) ? v : ""; } catch (e) { return ""; } };
  const QS = () => S.questions.filter((q) => !(kid() && q.kid === false));
  const answered = (q) => { const v = st.ans[q.id]; return v != null && v !== "" && !(Array.isArray(v) && !v.length); };

  /* ---------- Юбориш ---------- */
  async function send() {
    if (!/^https?:$/.test(location.protocol)) { st.queued = true; save(); return "queue"; }
    const ans = {};
    for (const q of QS()) if (answered(q)) ans[q.id] = st.ans[q.id];
    try {
      const r = await fetch("/api/survey", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ sv: S.id, vid: vid(), ans, stage: stage(), lang: lang() }) });
      if (r.status === 400 || r.status === 429) { st.queued = false; save(); return "bad"; }
      if (!r.ok) throw new Error("HTTP " + r.status);
      st.queued = false; save();
      return "ok";
    } catch (e) { st.queued = true; save(); return "queue"; }
  }

  /* ---------- Чизиш ---------- */
  function render() {
    const qs = QS(), n = qs.length;
    if (st.done) {
      ROOT.innerHTML = `<div class="sv-card sv-end" role="status">
        <div class="sv-big" aria-hidden="true">🌱</div>
        <h2 class="section-title">${H(TX.thanks)}</h2>
        <p class="muted">${H(st.queued ? TX.queued : TX.thanksLead)}</p>
        <div class="sv-acts"><button class="btn btn-ghost" type="button" data-act="again"><i class="fa-solid fa-pen" aria-hidden="true"></i> ${H(TX.again)}</button>
        <a class="btn btn-ghost" href="#fikr"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> ${H(TX.fikr)}</a></div>${uxLine()}</div>`;
      return;
    }
    if (st.i < 0 || st.i >= n) {
      ROOT.innerHTML = `<div class="sv-card sv-intro">
        <span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(S.title)}</h2>
        <p class="muted">${H(TX.lead)}</p>
        <div class="sv-acts"><button class="btn btn-primary" type="button" data-act="start">${H(TX.start)} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
        <span class="small muted">${n} ${H(t3("савол", "вопросов", "questions"))}</span></div>${uxLine()}</div>`;
      return;
    }
    const q = qs[st.i], v = st.ans[q.id], last = st.i === n - 1;
    let body = "";
    if (q.type === "one" || q.type === "many") {
      const many = q.type === "many", sel = many ? (Array.isArray(v) ? v : []) : v;
      body = `${many ? `<p class="small muted">${esc(L(TX.many).replace("{n}", q.max || 3))}</p>` : ""}
        <div class="sv-opts" role="${many ? "group" : "radiogroup"}" aria-labelledby="svQ">${q.opts.map(([k, lab], i) => {
          const on = many ? sel.includes(k) : sel === k;
          return `<button type="button" class="sv-opt${on ? " on" : ""}" role="${many ? "checkbox" : "radio"}" aria-checked="${on}" data-opt="${esc(k)}"><kbd aria-hidden="true">${LETTERS[i]}</kbd><span>${H(lab)}</span>${on ? `<i class="fa-solid fa-check" aria-hidden="true"></i>` : ""}</button>`;
        }).join("")}</div>`;
    } else if (q.type === "scale") {
      body = `<div class="sv-scale" role="radiogroup" aria-labelledby="svQ">${Array.from({ length: q.max - q.min + 1 }, (_, i) => i + q.min).map((x) =>
        `<button type="button" role="radio" aria-checked="${v === x}" class="sv-num${v === x ? " on" : ""}${x <= 6 ? " lo" : x >= 9 ? " hi" : ""}" data-num="${x}">${x}</button>`).join("")}</div>
        <div class="sv-scale-l small muted"><span>${H(q.lo)}</span><span>${H(q.hi)}</span></div>`;
    } else {
      body = `<textarea class="sv-text" rows="4" maxlength="600" aria-labelledby="svQ" placeholder="${H(q.ph)}">${esc(typeof v === "string" ? v : "")}</textarea>`;
    }
    ROOT.innerHTML = `<div class="sv-card">
      <div class="sv-top"><span class="small muted">${esc(L(TX.of).replace("{i}", st.i + 1).replace("{n}", n))}</span>
        <div class="sv-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${st.i + 1}"><span style="width:${((st.i + 1) / n) * 100}%"></span></div></div>
      <h2 class="sv-q" id="svQ" tabindex="-1">${H(q.q)}</h2>
      ${body}
      <p class="fk-err" role="alert" data-err></p>
      <div class="sv-acts">
        ${st.i > 0 ? `<button class="btn btn-ghost" type="button" data-act="back"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> ${H(TX.back)}</button>` : ""}
        <button class="btn btn-primary" type="button" data-act="${last ? "send" : "next"}">${H(last ? TX.send : answered(q) ? TX.next : TX.skip)} <i class="fa-solid ${last ? "fa-paper-plane" : "fa-arrow-right"}" aria-hidden="true"></i></button>
      </div>
      <p class="small muted sv-hint">${H(TX.hint)}</p></div>`;
  }
  const focusQ = () => { const h = ROOT.querySelector("#svQ, .section-title"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } };
  const go = (i) => { st.i = i; save(); render(); focusQ(); };

  function pick(q, k) {
    if (q.type === "many") {
      const cur = Array.isArray(st.ans[q.id]) ? st.ans[q.id].slice() : [];
      const j = cur.indexOf(k);
      if (j >= 0) cur.splice(j, 1); else if (cur.length < (q.max || 3)) cur.push(k);
      st.ans[q.id] = cur; save(); render();
      return;
    }
    st.ans[q.id] = k; save(); render();
    /* Битта танловда автоматик кейинги саволга (Tally каби) */
    clearTimeout(pick.t);
    pick.t = setTimeout(() => { if (st.i < QS().length - 1 && QS()[st.i] === q) go(st.i + 1); }, 320);
  }

  async function finish() {
    const qs = QS();
    if (qs.filter(answered).length < 2) { const e = ROOT.querySelector("[data-err]"); if (e) e.textContent = L(TX.need); return; }
    const btn = ROOT.querySelector("[data-act=send]"); if (btn) btn.disabled = true;
    const r = await send();
    const first = !st.done;
    st.done = Date.now(); st.never = true; save();
    if (first) { const a = App(); if (a && a.addXp) a.addXp(20, L(S.title)); }
    toast(r === "queue" ? TX.queued : TX.thanks);
    hideInvite(); render(); focusQ();
  }

  ROOT.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const q = QS()[st.i];
    if (b.dataset.act === "start") return go(0);
    if (b.dataset.act === "back") return go(Math.max(0, st.i - 1));
    if (b.dataset.act === "next") return go(st.i + 1);
    if (b.dataset.act === "send") return finish();
    if (b.dataset.act === "ux" && window.EkoUx) { if (EkoUx.enabled) EkoUx.off(); else EkoUx.on(); return render(); }
    if (b.dataset.act === "again") { st.done = 0; save(); return go(0); }
    if (b.dataset.opt && q) return pick(q, b.dataset.opt);
    if (b.dataset.num && q) return pick(q, +b.dataset.num);
  });
  ROOT.addEventListener("input", (e) => {
    const q = QS()[st.i];
    if (q && e.target.classList.contains("sv-text")) { st.ans[q.id] = e.target.value.slice(0, 600); save(); const n = ROOT.querySelector("[data-act=next]"); if (n) n.firstChild.textContent = L(st.ans[q.id].trim() ? TX.next : TX.skip) + " "; }
  });
  document.addEventListener("keydown", (e) => {
    if (location.hash.slice(1).split(/[/?&]/)[0] !== "sorov" || e.ctrlKey || e.metaKey || e.altKey) return;
    const q = QS()[st.i];
    if (!q || st.done) return;
    const typing = e.target.closest && e.target.closest("textarea, input, select");
    if (e.key === "Enter") {
      if (typing && e.target.tagName === "TEXTAREA" && e.shiftKey) return; // Shift+Enter — янги қатор
      if (!typing && e.target.closest("button")) return; // тугманинг ўзи Enter ни бажаради
      e.preventDefault();
      return st.i === QS().length - 1 ? finish() : go(st.i + 1);
    }
    if (typing) return;
    if ((q.type === "one" || q.type === "many") && e.key.length === 1) {
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i >= 0 && q.opts[i]) { e.preventDefault(); pick(q, q.opts[i][0]); }
    } else if (q.type === "scale" && /^\d$/.test(e.key)) { e.preventDefault(); pick(q, +e.key); }
  });

  /* ---------- Таклиф карточкаси: 3 хил кунда кирган, ҳали жавоб бермаган одамга ---------- */
  let inviteEl = null;
  function hideInvite() { if (inviteEl) { inviteEl.remove(); inviteEl = null; } }
  function maybeInvite() {
    const today = new Date().toISOString().slice(0, 10);
    if (!st.days.includes(today)) { st.days = st.days.concat(today).slice(-10); save(); }
    if (st.done || st.never || st.snooze > Date.now() || st.days.length < 3 || inviteEl) return;
    const h = location.hash.slice(1);
    if (h === "sorov" || document.querySelector(".plus-dlg:not([hidden]), dialog[open]")) return;
    inviteEl = document.createElement("aside");
    inviteEl.className = "sv-invite";
    inviteEl.setAttribute("role", "dialog");
    inviteEl.setAttribute("aria-label", L(S.title));
    inviteEl.setAttribute("data-notr", "");
    inviteEl.innerHTML = `<p><b>📋 ${H(TX.invite)}</b></p><div class="sv-acts"><a class="btn btn-primary btn-sm" href="#sorov" data-inv="go">${H(TX.start)}</a>
      <button class="btn btn-ghost btn-sm" type="button" data-inv="later">${H(TX.later)}</button><button class="btn btn-ghost btn-sm" type="button" data-inv="never">${H(TX.never)}</button></div>`;
    inviteEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-inv]"); if (!b) return;
      if (b.dataset.inv === "later") st.snooze = Date.now() + 5 * 864e5;
      if (b.dataset.inv === "never") st.never = true;
      save(); hideInvite();
    });
    document.body.appendChild(inviteEl);
  }

  function onRoute() {
    if (location.hash.slice(1).split(/[/?&]/)[0] === "sorov") { hideInvite(); if (st.queued) send().then(render); }
  }
  render();
  window.addEventListener("hashchange", onRoute);
  window.addEventListener("eko:lang", render);
  window.addEventListener("eko:stage", render);
  window.addEventListener("online", () => { if (st.queued) send().then(render); });
  onRoute();
  setTimeout(maybeInvite, 45000);
  window.EkoSorov = { reset: () => { st = Object.assign(st, { i: -1, ans: {}, done: 0, never: false, snooze: 0 }); save(); render(); } };
})();
