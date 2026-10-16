/* Экомун — 💬 «Фикр-мулоҳаза». Ҳар бир фойдаланувчи (ҳисобсиз ҳам) таклиф, хато, савол ёки
   миннатдорлик юбора олади. Сервер сақлайди, Бошқарув марказидаги «Фикр-мулоҳазалар» бўлимида
   кўринади; админ жавоби фойдаланувчининг «Менинг мулоҳазаларим» рўйхатида чиқади.
   Интернет ёки сервер бўлмаса (Android иловасининг оффлайн нусхаси) мулоҳаза навбатга қўйилади
   ва алоқа тиклангач ўзи юборилади. Мактаб босқичида алоқа майдони кўрсатилмайди (болалар махфийлиги).
   Қурилмада: localStorage «ekotalim:fikr». */
(() => {
  "use strict";
  const SEC = document.getElementById("fikr");
  const ROOT = document.getElementById("fkRoot");
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

  const KINDS = [
    ["idea", "fa-lightbulb", t3("Таклиф", "Предложение", "Suggestion")],
    ["bug", "fa-bug", t3("Хато / ишламаяпти", "Ошибка / не работает", "Bug / not working")],
    ["content", "fa-book", t3("Дарс ёки маълумот", "Урок или материал", "Lesson or content")],
    ["question", "fa-circle-question", t3("Савол", "Вопрос", "Question")],
    ["praise", "fa-heart", t3("Миннатдорлик", "Благодарность", "Thanks")]
  ];
  const RATE = [t3("Жуда ёмон", "Очень плохо", "Very bad"), t3("Ёмон", "Плохо", "Bad"), t3("Ўртача", "Средне", "OK"), t3("Яхши", "Хорошо", "Good"), t3("Аъло", "Отлично", "Excellent")];
  const TX = {
    pill: t3("💬 Сизнинг овозингиз", "💬 Ваш голос", "💬 Your voice"),
    title: t3("Фикр-мулоҳаза", "Отзывы и предложения", "Feedback"),
    lead: t3("Платформа сиз учун. Нима ёқди, нима ёқмади, қандай дарс ёки бўлим керак, қаерда хато бор — ёзинг. Ҳар бир мулоҳазани жамоамиз ўқийди ва жавоб беради.",
      "Платформа для вас. Напишите, что понравилось, что нет, какие уроки нужны, где ошибка. Каждый отзыв читает наша команда и отвечает.",
      "The platform is for you. Tell us what you liked, what you didn’t, which lessons you need and where something is broken. Our team reads and answers every message."),
    kind: t3("Мулоҳаза тури", "Тип отзыва", "Type"),
    rate: t3("Платформага баҳоингиз", "Ваша оценка платформы", "Your rating of the platform"),
    rateOpt: t3("(ихтиёрий)", "(необязательно)", "(optional)"),
    sec: t3("Қайси бўлим ҳақида?", "О каком разделе?", "Which section?"),
    secAny: t3("Умуман платформа", "Платформа в целом", "The platform in general"),
    text: t3("Мулоҳазангиз", "Ваш отзыв", "Your message"),
    textPh: t3("Масалан: «Видео дарслар бўлимида рус тилидаги видео кўпроқ бўлсин» ёки «3D лабораторияда тугма ишламаяпти».", "Например: «Больше видео на узбекском» или «В 3D-лаборатории не работает кнопка».", "E.g. “More videos in Uzbek, please” or “A button in the 3D lab doesn’t work”."),
    contact: t3("Жавобни қаерга юборайлик? (ихтиёрий: почта ёки Telegram)", "Куда ответить? (необязательно: почта или Telegram)", "Where can we reply? (optional: email or Telegram)"),
    contactNote: t3("Жавоб барибир шу ердаги «Менинг мулоҳазаларим» рўйхатида кўринади. Паспорт, телефон, манзил каби шахсий маълумот ёзманг.", "Ответ всё равно появится в списке «Мои отзывы». Не пишите паспортные данные, адрес и т.п.", "The reply also appears below under “My feedback”. Don’t include personal data like your address or ID."),
    kidNote: t3("Исмингиз, телефон ёки манзилингизни ёзманг. Жавобни шу ерда кўрасиз.", "Не пишите имя, телефон или адрес. Ответ увидите здесь.", "Don’t write your name, phone or address. You’ll see the reply here."),
    send: t3("Юбориш", "Отправить", "Send"),
    short: t3("Камида 10 та белги ёзинг.", "Напишите хотя бы 10 символов.", "Please write at least 10 characters."),
    sent: t3("Раҳмат! Мулоҳазангиз юборилди.", "Спасибо! Отзыв отправлен.", "Thank you! Your feedback was sent."),
    queued: t3("Интернет ёки сервер йўқ — мулоҳаза сақланди ва алоқа тиклангач ўзи юборилади.", "Нет связи — отзыв сохранён и отправится автоматически.", "No connection — your feedback is saved and will be sent automatically."),
    mine: t3("Менинг мулоҳазаларим", "Мои отзывы", "My feedback"),
    empty: t3("Ҳали мулоҳаза юбормагансиз.", "Вы ещё не отправляли отзывов.", "You haven’t sent any feedback yet."),
    st: { queue: t3("Навбатда (интернет кутилмоқда)", "В очереди (ждём интернет)", "Queued (waiting for connection)"), sent: t3("Юборилди", "Отправлено", "Sent"), read: t3("Ўқилди", "Прочитано", "Read"), replied: t3("Жавоб берилди", "Есть ответ", "Replied"), gone: t3("Ёпилди", "Закрыто", "Closed") },
    reply: t3("Жамоа жавоби", "Ответ команды", "Team reply"),
    refresh: t3("Ҳолатни янгилаш", "Обновить статус", "Refresh status"),
    del: t3("Рўйхатдан олиб ташлаш", "Убрать из списка", "Remove from list"),
    why: t3("Нега бу муҳим? Илк навбатда кўп сўралган таклифлар амалга оширилади. Ҳар бир юборилган мулоҳаза учун +3 XP.", "Почему это важно? Сначала делаем то, что просят чаще всего. За каждый отзыв +3 XP.", "Why it matters: the most requested ideas are built first. +3 XP for each message."),
    tooMany: t3("Бугун кўп мулоҳаза юбордингиз. Эртага яна ёзинг.", "Сегодня отправлено много отзывов. Напишите завтра.", "You’ve sent a lot today. Please write again tomorrow.")
  };

  /* ---------- Ҳолат ---------- */
  const KEY = "ekotalim:fikr";
  let st = { list: [], draft: { kind: "idea", rating: 0, sec: "", text: "", contact: "" } };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  st.draft = Object.assign({ kind: "idea", rating: 0, sec: "", text: "", contact: "" }, st.draft);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  const vid = () => { try { const v = localStorage.getItem("ekotalim:vid") || ""; return /^[a-z0-9]{12,32}$/.test(v) ? v : ""; } catch (e) { return ""; } };
  const kid = () => document.documentElement.classList.contains("stage-maktab");
  const stage = () => (kid() ? "maktab" : document.documentElement.classList.contains("stage-uni") ? "uni" : "");
  const ver = () => (window.EKO_VERSION && EKO_VERSION.version) || "";

  /* Бўлимлар рўйхати бош саҳифадаги плиткалардан олинади */
  function sections() {
    const out = [], seen = new Set();
    document.querySelectorAll(".app-grid a.app[href^='#']").forEach((a) => {
      const id = a.getAttribute("href").slice(1), b = a.querySelector("b");
      if (!/^[a-z0-9-]{1,24}$/.test(id) || seen.has(id) || !b || (a.dataset.stage && a.dataset.stage !== stage() && stage())) return;
      seen.add(id); out.push([id, b.textContent.trim()]);
    });
    return out;
  }

  /* ---------- Серверга юбориш ---------- */
  async function post(url, body) {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || "HTTP " + r.status); e.status = r.status; throw e; }
    return d;
  }
  let flushing = false;
  async function flush() {
    if (flushing || navigator.onLine === false) return;
    const q = st.list.filter((x) => x.status === "queue");
    if (!q.length) return;
    flushing = true;
    try {
      for (const x of q) {
        try {
          const d = await post("/api/feedback", { vid: vid(), kind: x.kind, rating: x.rating, sec: x.sec, text: x.text, contact: x.contact, stage: x.stage, lang: x.lang, ver: x.ver });
          x.id = d.id; x.key = d.key; x.status = "sent"; save();
        } catch (e) { if (e.status === 429 || e.status === 400 || e.status === 403) { x.status = "gone"; x.err = String(e.message).slice(0, 120); save(); } else break; }
      }
    } finally { flushing = false; render(); }
  }
  async function refresh(manual) {
    const items = st.list.filter((x) => x.id && x.key).slice(0, 30).map((x) => ({ id: x.id, key: x.key }));
    if (!items.length || navigator.onLine === false) return;
    try {
      const d = await post("/api/feedback/status", { items });
      (d.items || []).forEach((s) => {
        const x = st.list.find((y) => y.id === s.id);
        if (!x) return;
        if (s.gone) { x.status = "gone"; return; }
        x.status = s.reply ? "replied" : s.read ? "read" : "sent";
        x.reply = s.reply || ""; x.replyAt = s.replyAt || 0;
      });
      save(); render();
    } catch (e) { if (manual) toast(TX.queued); }
  }

  /* ---------- Чизиш ---------- */
  function render() {
    const d = st.draft, secs = sections();
    const fmt = (t) => new Date(t).toLocaleString(lang() === "en" ? "en-GB" : lang() === "ru" ? "ru-RU" : "uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    ROOT.innerHTML = `
      <div class="qn-head"><div><span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(TX.title)}</h2>
        <p class="muted" style="max-width:760px">${H(TX.lead)}</p></div></div>
      <form class="qn-card fk-form" novalidate>
        <fieldset class="fk-kinds"><legend>${H(TX.kind)}</legend>
          ${KINDS.map(([k, ic, lab]) => `<label class="fk-kind"><input type="radio" name="fkKind" value="${k}" ${d.kind === k ? "checked" : ""}><span><i class="fa-solid ${ic}" aria-hidden="true"></i> ${H(lab)}</span></label>`).join("")}
        </fieldset>
        <fieldset class="fk-rate"><legend>${H(TX.rate)} <span class="muted small">${H(TX.rateOpt)}</span></legend>
          <div class="fk-stars">${[1, 2, 3, 4, 5].map((n) => `<label title="${H(RATE[n - 1])}"><input type="radio" name="fkRate" value="${n}" ${d.rating === n ? "checked" : ""}><span class="${d.rating >= n ? "on" : ""}" aria-hidden="true">★</span><span class="sr-only">${n} — ${H(RATE[n - 1])}</span></label>`).join("")}
          ${d.rating ? `<b class="fk-rate-t">${H(RATE[d.rating - 1])}</b>` : ""}</div>
        </fieldset>
        <label class="fk-field"><span>${H(TX.sec)}</span>
          <select name="sec"><option value="">${H(TX.secAny)}</option>${secs.map(([id, n]) => `<option value="${id}" ${d.sec === id ? "selected" : ""}>${esc(n)}</option>`).join("")}${d.sec && d.sec.startsWith("video:") ? `<option value="${esc(d.sec)}" selected>🎬 ${esc(d.sec)}</option>` : ""}</select></label>
        <label class="fk-field"><span>${H(TX.text)} <span class="fk-count muted small" data-count>${d.text.length}/1000</span></span>
          <textarea name="text" rows="5" maxlength="1000" required placeholder="${H(TX.textPh)}">${esc(d.text)}</textarea></label>
        ${kid() ? `<p class="small muted">🛡️ ${H(TX.kidNote)}</p>` : `<label class="fk-field"><span>${H(TX.contact)}</span>
          <input name="contact" maxlength="100" autocomplete="email" value="${esc(d.contact)}"></label>
          <p class="small muted">🛡️ ${H(TX.contactNote)}</p>`}
        <p class="fk-err" role="alert" data-err></p>
        <div class="qn-acts"><button class="btn btn-primary" type="submit"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> ${H(TX.send)}</button></div>
        <p class="small muted">${H(TX.why)}</p>
      </form>
      <div class="qn-card fk-mine">
        <div class="fk-mine-head"><h3>${H(TX.mine)}</h3>${st.list.some((x) => x.id) ? `<button type="button" class="btn btn-ghost btn-sm" data-act="refresh"><i class="fa-solid fa-rotate" aria-hidden="true"></i> ${H(TX.refresh)}</button>` : ""}</div>
        ${st.list.length ? `<ul class="fk-list">${st.list.slice().reverse().map((x) => {
          const k = KINDS.find((y) => y[0] === x.kind) || KINDS[0];
          return `<li class="fk-item st-${x.status}">
            <div class="fk-meta"><span class="fk-tag"><i class="fa-solid ${k[1]}" aria-hidden="true"></i> ${H(k[2])}</span>${x.rating ? `<span aria-label="${x.rating}/5">${"★".repeat(x.rating)}</span>` : ""}<span class="muted small">${fmt(x.at)}</span><span class="fk-st">${H(TX.st[x.status] || TX.st.sent)}</span></div>
            <p>${esc(x.text)}</p>
            ${x.reply ? `<div class="fk-reply"><b><i class="fa-solid fa-reply" aria-hidden="true"></i> ${H(TX.reply)}</b><p>${esc(x.reply)}</p></div>` : ""}
            ${x.err ? `<p class="small fk-err">${esc(x.err)}</p>` : ""}
            <button type="button" class="btn btn-ghost btn-sm" data-del="${x.at}">${H(TX.del)}</button>
          </li>`; }).join("")}</ul>` : `<p class="muted">${H(TX.empty)}</p>`}
      </div>`;
  }

  ROOT.addEventListener("input", (e) => {
    const f = e.target.closest("form"); if (!f) return;
    const el = e.target;
    if (el.name === "text") { st.draft.text = el.value.slice(0, 1000); const c = ROOT.querySelector("[data-count]"); if (c) c.textContent = st.draft.text.length + "/1000"; }
    else if (el.name === "contact") st.draft.contact = el.value.slice(0, 100);
    else return;
    save();
  });
  ROOT.addEventListener("change", (e) => {
    const el = e.target;
    if (el.name === "fkKind") { st.draft.kind = el.value; save(); return; }
    if (el.name === "fkRate") { st.draft.rating = +el.value; save(); const y = window.scrollY; render(); window.scrollTo(0, y); const r = ROOT.querySelector(`input[name="fkRate"][value="${el.value}"]`); if (r) r.focus(); return; }
    if (el.name === "sec") { st.draft.sec = el.value; save(); }
  });
  ROOT.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = st.draft, err = ROOT.querySelector("[data-err]");
    const text = d.text.trim();
    if (text.length < 10) { err.textContent = L(TX.short); ROOT.querySelector("textarea[name=text]").focus(); return; }
    const today = new Date().toDateString();
    if (st.list.filter((x) => new Date(x.at).toDateString() === today).length >= 10) { err.textContent = L(TX.tooMany); return; }
    const item = { at: Date.now(), kind: d.kind, rating: d.rating || 0, sec: d.sec, text, contact: kid() ? "" : d.contact.trim(), stage: stage(), lang: lang(), ver: ver(), status: "queue" };
    st.list.push(item);
    if (st.list.length > 60) st.list.splice(0, st.list.length - 60);
    st.draft = { kind: d.kind, rating: 0, sec: "", text: "", contact: d.contact };
    save();
    const btn = ROOT.querySelector("button[type=submit]"); if (btn) btn.disabled = true;
    await flush();
    const a = App(); if (a && a.addXp) a.addXp(3, L(TX.title));
    toast(item.status === "sent" ? TX.sent : item.status === "gone" ? (item.err || TX.tooMany) : TX.queued);
    render();
  });
  ROOT.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.act === "refresh") { refresh(true); return; }
    if (b.dataset.del) { st.list = st.list.filter((x) => String(x.at) !== b.dataset.del); save(); render(); }
  });

  /* Бошқа бўлимдан «фикр билдириш» тугмаси орқали келинса — бўлим олдиндан танланади */
  function onOpen() {
    if (location.hash.slice(1).split(/[/?&:]/)[0] !== "fikr") return;
    try { const s = sessionStorage.getItem("ekotalim:fikr-sec"); if (s) { st.draft.sec = s.slice(0, 40); sessionStorage.removeItem("ekotalim:fikr-sec"); save(); render(); } } catch (err) { /* ignore */ }
    flush(); refresh(false);
  }
  render();
  window.addEventListener("hashchange", onOpen);
  window.addEventListener("online", flush);
  window.addEventListener("eko:lang", render);
  window.addEventListener("eko:stage", render);
  onOpen();
  setTimeout(flush, 4000);
  window.EkoFikr = { flush, refresh };
})();
