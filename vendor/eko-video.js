/* Экомун — 🎬 «Видео дарслар». Интернетдаги очиқ таълим видеолари (YouTube) асосида дарс:
   1) кўришдан олдин савол (олдиндан тахмин — anticipation guide), 2) видео, 3) конспект,
   4) текширув саволлари изоҳ билан, 5) амалий топшириқ, 6) «3-2-1» рефлексия.
   Видео фақат тугма босилгандан кейин youtube-nocookie.com орқали юкланади (махфийлик ва трафик).
   Интернет бўлмаса конспект, саволлар ва топшириқлар ишлайверади; видео «интернет керак» деб кўрсатилади.
   Ҳолат фақат қурилмада: localStorage «ekotalim:video». Маълумотлар: vendor/eko-video-data.js */
(() => {
  "use strict";
  const SEC = document.getElementById("video");
  const ROOT = document.getElementById("vdRoot");
  const DATA = window.EKO_VIDEOS;
  if (!SEC || !ROOT || !DATA) return;

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
  const ID_RE = /^[\w-]{11}$/;

  const TX = {
    pill: t3("🎬 Видео дарслар · очиқ манбалар", "🎬 Видеоуроки · открытые источники", "🎬 Video lessons · open sources"),
    title: t3("Видео дарслар", "Видеоуроки", "Video lessons"),
    lead: t3("Дунёдаги энг яхши таълим каналлари (Khan Academy, CrashCourse, TED-Ed, National Geographic, NASA, БМТ, IPCC) ва ўзбек ҳужжатли фильмлари. Ҳар бир видео — тўлиқ дарс: аввал савол, кейин видео, конспект, текширув ва амалий топшириқ.",
      "Лучшие образовательные каналы мира (Khan Academy, CrashCourse, TED-Ed, National Geographic, NASA, ООН, IPCC) и узбекские документальные фильмы. Каждое видео — полноценный урок: вопрос, видео, конспект, проверка и практика.",
      "The world’s best education channels (Khan Academy, CrashCourse, TED-Ed, National Geographic, NASA, UN, IPCC) and Uzbek documentaries. Each video is a full lesson: question, video, notes, check and hands-on task."),
    online: t3("Интернет бор — видеолар очилади", "Интернет есть — видео откроются", "Online — videos will play"),
    offline: t3("Интернет йўқ — конспект, савол ва топшириқлар ишлайди; видео уланганда очилади", "Нет интернета — конспекты, вопросы и задания работают; видео откроется при подключении", "Offline — notes, questions and tasks still work; videos play once you reconnect"),
    all: t3("Ҳаммаси", "Все", "All"),
    search: t3("Видео қидириш…", "Поиск видео…", "Search videos…"),
    lng: { uz: t3("ўзбекча", "узбекский", "Uzbek"), ru: t3("русча", "русский", "Russian"), en: t3("инглизча", "английский", "English") },
    anyLang: t3("Ҳар қандай тил", "Любой язык", "Any language"),
    unseen: t3("Фақат ўтилмаганлар", "Только непройденные", "Only not done"),
    none: t3("Бундай видео топилмади.", "Видео не найдено.", "No videos found."),
    done: t3("Ўтилди", "Пройдено", "Done"),
    seen: t3("Кўрилди", "Просмотрено", "Watched"),
    open: t3("Дарсни очиш", "Открыть урок", "Open lesson"),
    back: t3("← Барча видеолар", "← Все видео", "← All videos"),
    step1: t3("1. Кўришдан олдин ўйланг", "1. Подумайте до просмотра", "1. Think before you watch"),
    step2: t3("2. Видеони кўринг", "2. Смотрите видео", "2. Watch the video"),
    step3: t3("3. Асосий ғоялар (конспект)", "3. Главные идеи (конспект)", "3. Key ideas (notes)"),
    step4: t3("4. Ўзингизни текширинг", "4. Проверьте себя", "4. Check yourself"),
    step5: t3("5. Амалий топшириқ", "5. Практическое задание", "5. Hands-on task"),
    step6: t3("6. Рефлексия «3-2-1»", "6. Рефлексия «3-2-1»", "6. “3-2-1” reflection"),
    preHint: t3("Жавобингизни ёзинг — видеодан кейин солиштирасиз.", "Запишите ответ — сравните после видео.", "Write your answer — compare it after the video."),
    play: t3("Видеони ёқиш", "Включить видео", "Play video"),
    needNet: t3("Видео учун интернет керак. Уланиб, қайта босинг. Конспект ва саволлар пастда.", "Для видео нужен интернет. Подключитесь и нажмите снова. Конспект и вопросы ниже.", "The video needs internet. Connect and tap again. Notes and questions are below."),
    onYt: t3("YouTube’да очиш", "Открыть на YouTube", "Open on YouTube"),
    privacy: t3("Видео тугма босилгандан кейингина YouTube’дан (youtube-nocookie.com) юкланади.", "Видео загружается с YouTube (youtube-nocookie.com) только после нажатия.", "The video loads from YouTube (youtube-nocookie.com) only after you tap."),
    subs: t3("Инглизча видеоларда ⚙️ → «Субтитрлар» → «Автотаржима» орқали ўзбек ёки рус тилида субтитр ёқинг.", "В английских видео включите ⚙️ → «Субтитры» → «Автоперевод» на русский.", "Turn on subtitles via ⚙️ → Subtitles → Auto-translate if needed."),
    markSeen: t3("✓ Кўрдим", "✓ Посмотрел(а)", "✓ I watched it"),
    right: t3("✅ Тўғри!", "✅ Верно!", "✅ Correct!"),
    wrong: t3("❌ Нотўғри.", "❌ Неверно.", "❌ Not quite."),
    again: t3("Қайта ечиш", "Решить заново", "Try again"),
    score: t3("Натижа", "Результат", "Score"),
    taskDone: t3("Топшириқни бажардим", "Задание выполнено", "I did the task"),
    r3: t3("3 та янги нарса билдим:", "3 новых факта, которые я узнал(а):", "3 things I learned:"),
    r2: t3("2 та қизиқ нарса:", "2 интересные вещи:", "2 interesting things:"),
    r1: t3("1 та савол қолди:", "1 оставшийся вопрос:", "1 question I still have:"),
    saved: t3("Сақланди", "Сохранено", "Saved"),
    src: t3("Манба", "Источник", "Source"),
    checked: t3("Ҳавола текширилган", "Ссылка проверена", "Link checked"),
    progress: t3("Видео дарслар ўзлаштирилиши", "Прогресс видеоуроков", "Video lesson progress"),
    next: t3("Кейинги видео →", "Следующее видео →", "Next video →"),
    fb: t3("Видео ишламаяптими ёки хато бормi? Фикр-мулоҳаза юборинг", "Видео не работает или есть ошибка? Напишите отзыв", "Video not working or found a mistake? Send feedback"),
    pdf: t3("Конспектни PDF қилиш", "Конспект в PDF", "Notes as PDF"),
    topicDone: t3("Йўналиш тугади! +10 XP", "Направление завершено! +10 XP", "Topic complete! +10 XP")
  };

  /* ---------- Ҳолат ---------- */
  const KEY = "ekotalim:video";
  let st = { seen: {}, ans: {}, pre: {}, task: {}, ref: {}, xp: {}, f: { top: "", lng: "", un: false, q: "" } };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  st.f = Object.assign({ top: "", lng: "", un: false, q: "" }, st.f);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  const xp = (k, n, why) => {
    if (st.xp[k]) return;
    st.xp[k] = 1; save();
    const a = App(); if (a && a.addXp) a.addXp(n, L(why));
  };

  const LIST = DATA.list.filter((v) => ID_RE.test(v.yt));
  const TOP = Object.fromEntries(DATA.topics.map((x) => [x.id, x]));
  const stageNow = () => { const c = document.documentElement.classList; return c.contains("stage-maktab") ? "m" : c.contains("stage-uni") ? "u" : ""; };
  const fits = (v) => !v.st || !stageNow() || v.st === stageNow();
  const scoreOf = (v) => { const a = st.ans[v.id] || {}; return v.q.filter((qq, i) => a[i] === qq.c).length; };
  const isDone = (v) => !!st.seen[v.id] && v.q.every((qq, i) => (st.ans[v.id] || {})[i] != null) && scoreOf(v) === v.q.length;
  const thumb = (v) => `https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg`;
  const watchUrl = (v) => `https://www.youtube.com/watch?v=${v.yt}`;
  const embedUrl = (v) => {
    const hl = { ru: "ru", en: "en" }[lang()] || "uz";
    const p = new URLSearchParams({ rel: "0", modestbranding: "1", playsinline: "1", hl, autoplay: "1" });
    if (v.lng !== "uz" && v.lng !== (lang() === "ru" ? "ru" : lang() === "en" ? "en" : "")) { p.set("cc_load_policy", "1"); p.set("cc_lang_pref", hl); }
    return `https://www.youtube-nocookie.com/embed/${v.yt}?${p}`;
  };

  function checkTopic(v) {
    const all = LIST.filter((x) => x.top === v.top);
    if (all.every(isDone) && !st.xp["top:" + v.top]) { xp("top:" + v.top, 10, TOP[v.top].t); toast(TX.topicDone); }
  }

  /* ---------- Рўйхат ---------- */
  function filtered() {
    const f = st.f, qq = f.q.trim().toLowerCase();
    return LIST.filter((v) => fits(v) && (!f.top || v.top === f.top) && (!f.lng || v.lng === f.lng) && (!f.un || !isDone(v)) &&
      (!qq || [L(v.t), v.orig, v.ch, ...v.k.map(L)].join(" ").toLowerCase().includes(qq)));
  }
  function card(v) {
    const tp = TOP[v.top], d = isDone(v), s = !!st.seen[v.id];
    return `<article class="vd-card${d ? " is-done" : ""}">
      <button type="button" class="vd-thumb" data-open="${v.id}" style="--tc:${tp.c}" aria-label="${H(TX.open)}: ${H(v.t)}">
        <img src="${thumb(v)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">
        <span class="vd-ph" aria-hidden="true"><i class="fa-solid ${tp.ic}"></i></span>
        <span class="vd-playic" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
        <span class="vd-lng">${H(TX.lng[v.lng])}</span>
        ${d ? `<span class="vd-badge ok"><i class="fa-solid fa-check" aria-hidden="true"></i> ${H(TX.done)}</span>` : s ? `<span class="vd-badge">${H(TX.seen)}</span>` : ""}
      </button>
      <div class="vd-body">
        <span class="vd-top" style="--tc:${tp.c}"><i class="fa-solid ${tp.ic}" aria-hidden="true"></i> ${H(tp.t)}</span>
        <h3><button type="button" class="vd-link" data-open="${v.id}">${H(v.t)}</button></h3>
        <p class="vd-ch">${esc(v.ch)}</p>
      </div>
    </article>`;
  }
  function listView() {
    const f = st.f, list = filtered();
    const vis = LIST.filter(fits), dn = vis.filter(isDone).length;
    const pct = vis.length ? Math.round((dn / vis.length) * 100) : 0;
    return `
      <div class="vd-prog" role="group" aria-label="${H(TX.progress)}"><div class="vd-prog-txt"><b>${H(TX.progress)}</b><span>${dn} / ${vis.length} · ${pct}%</span></div>
        <div class="vd-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div></div>
      <div class="vd-tools">
        <label class="vd-search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input type="search" data-f="q" value="${esc(f.q)}" placeholder="${H(TX.search)}" aria-label="${H(TX.search)}"></label>
        <select data-f="lng" aria-label="${H(TX.anyLang)}"><option value="">${H(TX.anyLang)}</option>${["uz", "ru", "en"].map((k) => `<option value="${k}" ${f.lng === k ? "selected" : ""}>${H(TX.lng[k])}</option>`).join("")}</select>
        <label class="vd-chk"><input type="checkbox" data-f="un" ${f.un ? "checked" : ""}> ${H(TX.unseen)}</label>
      </div>
      <div class="qn-tabs vd-topics" role="group">${[{ id: "", ic: "fa-border-all", t: TX.all }, ...DATA.topics].map((x) => {
        const n = LIST.filter((v) => fits(v) && (!x.id || v.top === x.id)).length;
        return n ? `<button type="button" class="chip ${f.top === x.id ? "active" : ""}" aria-pressed="${f.top === x.id}" data-top="${x.id}"><i class="fa-solid ${x.ic}" aria-hidden="true"></i>${H(x.t)} <span class="vd-n">${n}</span></button>` : "";
      }).join("")}</div>
      ${list.length ? `<div class="vd-grid">${list.map(card).join("")}</div>` : `<p class="muted">${H(TX.none)}</p>`}`;
  }

  /* ---------- Дарс ---------- */
  function lessonView(v) {
    const tp = TOP[v.top], a = st.ans[v.id] || {}, r = st.ref[v.id] || ["", "", ""];
    const answered = v.q.every((qq, i) => a[i] != null);
    const i = LIST.indexOf(v), nx = LIST.slice(i + 1).concat(LIST.slice(0, i)).find((x) => fits(x) && !isDone(x));
    return `<div class="qn-acts pdf-skip"><button type="button" class="btn btn-ghost btn-sm" data-act="back">${H(TX.back)}</button></div>
      <article class="qn-card vd-lesson" id="vdLesson">
        <span class="vd-top" style="--tc:${tp.c}"><i class="fa-solid ${tp.ic}" aria-hidden="true"></i> ${H(tp.t)}</span>
        <h3>${H(v.t)}</h3>
        <p class="small muted">${esc(v.orig)} · <b>${esc(v.ch)}</b> · ${H(TX.lng[v.lng])}</p>

        <h4>💭 ${H(TX.step1)}</h4>
        <p>${H(v.pre)}</p>
        <textarea class="qn-ta pdf-skip" data-pre rows="2" placeholder="${H(TX.preHint)}" aria-label="${H(TX.step1)}">${esc(st.pre[v.id] || "")}</textarea>

        <h4>▶️ ${H(TX.step2)}</h4>
        <div class="vd-player pdf-skip" data-player>
          <button type="button" class="vd-start" data-play="${v.id}" style="--tc:${tp.c}">
            <img src="${thumb(v)}" alt="" referrerpolicy="no-referrer"><span class="vd-ph" aria-hidden="true"><i class="fa-solid ${tp.ic}"></i></span>
            <span class="vd-bigplay" aria-hidden="true"><i class="fa-solid fa-play"></i></span><span class="sr-only">${H(TX.play)}: ${H(v.t)}</span>
          </button>
        </div>
        <p class="vd-net pdf-skip" data-net hidden role="status"></p>
        <div class="qn-acts pdf-skip">
          <a class="btn btn-ghost btn-sm" href="${watchUrl(v)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-youtube" aria-hidden="true"></i> ${H(TX.onYt)} ↗</a>
          ${st.seen[v.id] ? `<span class="vd-badge ok static"><i class="fa-solid fa-check" aria-hidden="true"></i> ${H(TX.seen)}</span>` : `<button type="button" class="btn btn-ghost btn-sm" data-act="seen">${H(TX.markSeen)}</button>`}
        </div>
        <p class="small muted pdf-skip">${H(TX.privacy)}${v.lng === "en" ? " " + L(TX.subs) : ""}</p>

        <h4>📝 ${H(TX.step3)}</h4>
        <ul class="vd-notes">${v.k.map((x) => `<li>${H(x)}</li>`).join("")}</ul>

        <h4>🧠 ${H(TX.step4)}</h4>
        <ol class="hb-quiz">${v.q.map((qq, qi) => `<li><p>${H(qq.q)}</p>
          <div class="qn-roles" role="group">${qq.o.map((o, j) => {
            const cls = a[qi] == null ? "" : j === qq.c ? "hb-good" : j === a[qi] ? "hb-bad" : "";
            return `<button type="button" class="chip ${cls}" data-q="${qi}:${j}" ${a[qi] != null ? "disabled" : ""} aria-pressed="${a[qi] === j}">${H(o)}</button>`;
          }).join("")}</div>
          ${a[qi] != null ? `<p class="qn-fb ${a[qi] === qq.c ? "" : "bad"}" role="status">${H(a[qi] === qq.c ? TX.right : TX.wrong)} ${H(qq.e)}</p>` : ""}</li>`).join("")}</ol>
        ${answered ? `<p><b>${H(TX.score)}: ${scoreOf(v)} / ${v.q.length}</b> ${scoreOf(v) < v.q.length ? `<button type="button" class="btn btn-ghost btn-sm pdf-skip" data-act="retry">${H(TX.again)}</button>` : ""}</p>` : ""}

        <h4>🛠️ ${H(TX.step5)}</h4>
        <p>${H(v.task)}</p>
        <label class="vd-chk pdf-skip"><input type="checkbox" data-task ${st.task[v.id] ? "checked" : ""}> ${H(TX.taskDone)}</label>

        <h4>🪞 ${H(TX.step6)}</h4>
        <div class="vd-ref">${[TX.r3, TX.r2, TX.r1].map((lab, k) => `<label><span>${H(lab)}</span><textarea class="qn-ta" rows="2" data-ref="${k}">${esc(r[k] || "")}</textarea></label>`).join("")}</div>

        <p class="qn-src">🎬 ${H(TX.src)}: <a href="${watchUrl(v)}" target="_blank" rel="noopener noreferrer">${esc(v.ch)} — «${esc(v.orig)}» ↗</a> · ${H(TX.checked)}: ${esc(DATA.checked)}</p>
        <div class="qn-acts pdf-skip">
          <button type="button" class="btn btn-ghost btn-sm" data-act="pdf"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ${H(TX.pdf)}</button>
          <a class="btn btn-ghost btn-sm" href="#fikr" data-fb="${v.id}"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> ${H(TX.fb)}</a>
          ${nx ? `<button type="button" class="btn btn-primary btn-sm" data-open="${nx.id}">${H(TX.next)}</button>` : ""}
        </div>
      </article>`;
  }

  /* ---------- Чизиш ---------- */
  let cur = null;
  function render() {
    const v = cur && LIST.find((x) => x.id === cur);
    const on = navigator.onLine !== false;
    ROOT.innerHTML = `
      <div class="qn-head"><div><span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(TX.title)}</h2>
        <p class="muted" style="max-width:780px">${H(TX.lead)}</p>
        <p class="vd-status ${on ? "on" : "off"}" role="status"><i class="fa-solid ${on ? "fa-wifi" : "fa-plug-circle-xmark"}" aria-hidden="true"></i> ${H(on ? TX.online : TX.offline)}</p></div></div>
      <div id="vdPanel">${v ? lessonView(v) : listView()}</div>`;
  }
  function rerender(keepY) { const y = window.scrollY; render(); if (keepY) window.scrollTo(0, y); }
  function open(id) {
    if (!LIST.some((x) => x.id === id)) return;
    cur = id; render();
    const p = ROOT.querySelector("#vdPanel"); if (p) p.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function play(v) {
    const box = ROOT.querySelector("[data-player]"), net = ROOT.querySelector("[data-net]");
    if (!box) return;
    if (navigator.onLine === false) { net.hidden = false; net.textContent = L(TX.needNet); return; }
    const f = document.createElement("iframe");
    f.src = embedUrl(v);
    f.title = L(v.t);
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    /* YouTube 2025 йилдан embed учун Referer талаб қилади (153-хато) — сайт Referrer-Policy’си «same-origin» бўлгани учун шу ерда очиқ берилади */
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.loading = "eager";
    box.innerHTML = ""; box.appendChild(f); box.classList.add("on");
    if (!st.seen[v.id]) { st.seen[v.id] = Date.now(); save(); }
  }

  ROOT.addEventListener("click", (e) => {
    const b = e.target.closest("button, a");
    if (!b || !ROOT.contains(b)) return;
    const ds = b.dataset;
    if (ds.open) { open(ds.open); return; }
    if (ds.top != null) { st.f.top = ds.top; save(); rerender(true); return; }
    const v = cur && LIST.find((x) => x.id === cur);
    if (ds.fb) { try { sessionStorage.setItem("ekotalim:fikr-sec", "video:" + ds.fb); } catch (err) { /* ignore */ } return; }
    if (!v) return;
    if (ds.play) { play(v); return; }
    if (ds.q) {
      const [qi, j] = ds.q.split(":").map(Number);
      st.ans[v.id] = Object.assign({}, st.ans[v.id], { [qi]: j }); save();
      if (isDone(v)) { xp("vid:" + v.id, 5, v.t); checkTopic(v); }
      rerender(true); return;
    }
    switch (ds.act) {
      case "back": cur = null; rerender(false); SEC.scrollIntoView({ block: "start" }); return;
      case "seen": st.seen[v.id] = Date.now(); save(); if (isDone(v)) { xp("vid:" + v.id, 5, v.t); checkTopic(v); } rerender(true); return;
      case "retry": delete st.ans[v.id]; save(); rerender(true); return;
      case "pdf": {
        const el = ROOT.querySelector("#vdLesson");
        if (el && window.EkoPDF) EkoPDF.save(el, { title: L(v.t), sub: L(TX.title) + " · Ekomun", file: "Ekomun-video-" + v.id });
        return;
      }
    }
  });
  let qTimer = null;
  ROOT.addEventListener("input", (e) => {
    const el = e.target;
    if (el.matches("[data-f='q']")) {
      st.f.q = el.value.slice(0, 80); save();
      clearTimeout(qTimer);
      qTimer = setTimeout(() => {
        const pos = el.selectionStart; rerender(true);
        const n = ROOT.querySelector("[data-f='q']"); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (err) { /* ignore */ } }
      }, 250);
      return;
    }
    if (!cur) return;
    if (el.matches("[data-pre]")) { st.pre[cur] = el.value.slice(0, 600); save(); return; }
    if (el.matches("[data-ref]")) { const r = st.ref[cur] || ["", "", ""]; r[+el.dataset.ref] = el.value.slice(0, 600); st.ref[cur] = r; save(); }
  });
  ROOT.addEventListener("change", (e) => {
    const el = e.target;
    if (el.matches("[data-f='lng']")) { st.f.lng = el.value; save(); rerender(true); return; }
    if (el.matches("[data-f='un']")) { st.f.un = el.checked; save(); rerender(true); return; }
    if (el.matches("[data-task]") && cur) { st.task[cur] = el.checked ? Date.now() : 0; save(); if (el.checked) xp("vtask:" + cur, 3, TX.step5); }
  });
  /* Расм юкланмаса (интернет йўқ) — рангли белги кўринади */
  ROOT.addEventListener("error", (e) => { if (e.target.tagName === "IMG") e.target.remove(); }, true);
  window.addEventListener("online", () => rerender(true));
  window.addEventListener("offline", () => rerender(true));

  render();
  window.addEventListener("eko:lang", () => rerender(true));
  window.addEventListener("eko:stage", () => rerender(true));
  window.EkoVideo = { open, list: LIST, topics: DATA.topics };
})();
