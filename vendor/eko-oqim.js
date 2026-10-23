/* Экомун — 📡 «Эко-оқим»: янги видео, қонун ва янгиликлар.
   1) Текширилган видеолар (vendor/eko-oqim-data.js) + сервер расмий манбалардан ўзи олиб турадиган
      янги видеолар (Экология қўмитаси YouTube ва Telegram каналлари) — /api/feed?kind=video
   2) Қонунлар: қўмита сайтидаги расмий рўйхат + ўша саҳифада пайдо бўлган янги ҳужжатлар (lex.uz)
   3) Янгиликлар: қўмита сайти ва Telegram каналидан
   Сервер манбаларни ҳар 3 соатда ўқийди (feeds.js), админ ёзувларни яшириши мумкин.
   Интернет бўлмаса — охирги олинган рўйхат localStorage «ekomun:oqim» дан кўрсатилади.
   Видео фақат тугма босилганда юкланади: YouTube — youtube-nocookie.com, Telegram — t.me embed. */
(() => {
  "use strict";
  const SEC = document.getElementById("ekooqim");
  const ROOT = document.getElementById("oqRoot");
  const DATA = window.EKO_OQIM;
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
  const hasServer = () => /^https?:$/.test(location.protocol) && location.hostname !== "appassets.androidplatform.net";
  const site = () => (hasServer() ? location.origin : ((window.EKO_VERSION && EKO_VERSION.site) || "https://ekomun.onrender.com"));
  const KEY = "ekomun:oqim";

  const TX = {
    pill: t3("📡 Эко-оқим · расмий манбалардан", "📡 Эко-поток · из официальных источников", "📡 Eco-stream · from official sources"),
    title: t3("Янги видео, қонун ва янгиликлар", "Новые видео, законы и новости", "New videos, laws and news"),
    lead: t3("Экология ва иқлим ўзгариши миллий қўмитасининг сайти, YouTube ва Telegram каналлари ҳамда lex.uz дан. Сервер манбаларни ҳар 3 соатда ўзи текширади — янги видео, қонун ва янгиликлар шу ерда автоматик пайдо бўлади.",
      "С сайта Национального комитета по экологии и изменению климата, его YouTube и Telegram-каналов и lex.uz. Сервер сам проверяет источники каждые 3 часа — новые видео, законы и новости появляются здесь автоматически.",
      "From the website, YouTube and Telegram channels of the National Committee for Ecology and Climate Change and from lex.uz. The server checks the sources every 3 hours, so new videos, laws and news appear here automatically."),
    tabs: { video: t3("Видеолар", "Видео", "Videos"), law: t3("Қонунлар", "Законы", "Laws"), news: t3("Янгиликлар", "Новости", "News") },
    upd: t3("Охирги текширув", "Последняя проверка", "Last checked"),
    never: t3("сервер ҳали текширмади", "сервер ещё не проверял", "not checked yet"),
    offline: t3("Интернет йўқ — охирги сақланган рўйхат кўрсатилмоқда", "Нет интернета — показан последний сохранённый список", "Offline — showing the last saved list"),
    loading: t3("Янгиликлар юкланмоқда…", "Загрузка новостей…", "Loading updates…"),
    search: t3("Қидириш…", "Поиск…", "Search…"),
    all: t3("Ҳаммаси", "Все", "All"),
    fresh: t3("Янги", "Новое", "New"),
    auto: t3("Автоматик", "Автоматически", "Automatic"),
    curated: t3("Текширилган тўплам", "Проверенная подборка", "Checked collection"),
    yt: "YouTube", tg: "Telegram",
    lng: { uz: t3("ўзбекча", "узбекский", "Uzbek"), ru: t3("русча", "русский", "Russian"), en: t3("инглизча", "английский", "English") },
    play: t3("Видеони очиш", "Открыть видео", "Play video"),
    needNet: t3("Видео учун интернет керак", "Для видео нужен интернет", "Video needs an internet connection"),
    onSrc: t3("Манбада очиш", "Открыть в источнике", "Open at source"),
    none: t3("Ҳозирча ёзув йўқ.", "Пока записей нет.", "Nothing here yet."),
    noNews: t3("Янгиликлар сервердан олинади. Интернетга уланинг ёки расмий манбаларни очинг:", "Новости загружаются с сервера. Подключитесь к интернету или откройте официальные источники:", "News comes from the server. Connect to the internet or open the official sources:"),
    lawLead: t3("Экология ва иқлим ўзгариши миллий қўмитаси сайтидаги «Қонунлар» рўйхати. Матн — lex.uz да (расмий манба). Чуқур ўрганиш учун «Экологик ҳуқуқ» бўлимига ўтинг.",
      "Список «Законы» с сайта Национального комитета по экологии и изменению климата. Тексты — на lex.uz (официальный источник). Для подробного изучения — раздел «Экологическое право».",
      "The “Laws” list from the National Committee for Ecology and Climate Change website. Full texts are on lex.uz (the official source). For in-depth study, see the Environmental law section."),
    toQonun: t3("Экологик ҳуқуқ бўлими", "Раздел «Экологическое право»", "Environmental law section"),
    srcT: t3("Манбалар", "Источники", "Sources"),
    count: t3("{n} та", "{n}", "{n}"),
    stg: { m: t3("Мактаб", "Школа", "School"), u: t3("Университет", "Университет", "University") },
    topics: {
      uzb: t3("Ўзбекистонда", "В Узбекистане", "In Uzbekistan"), asos: t3("Экология асослари", "Основы экологии", "Ecology basics"), suv: t3("Сув", "Вода", "Water"),
      iqlim: t3("Иқлим", "Климат", "Climate"), ifl: t3("Ифлосланиш ва чиқинди", "Загрязнение и отходы", "Pollution and waste"), bio: t3("Биохилма-хиллик", "Биоразнообразие", "Biodiversity"),
      yer: t3("Ер ва чўлланиш", "Земля и опустынивание", "Land and deserts"), orol: t3("Орол", "Арал", "The Aral Sea"), huquq: t3("Ҳуқуқ ва назорат", "Право и контроль", "Law and enforcement")
    }
  };

  let st = { tab: "video", q: "", lng: "", src: "" };
  try { st = Object.assign(st, JSON.parse(sessionStorage.getItem(KEY + ":ui") || "{}")); } catch (e) { /* ignore */ }
  const saveUi = () => { try { sessionStorage.setItem(KEY + ":ui", JSON.stringify(st)); } catch (e) { /* ignore */ } };
  let feed = null, loading = false, offline = false;
  try { feed = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { feed = null; }

  async function load() {
    if (loading) return;
    loading = true;
    try {
      const r = await fetch(site() + "/api/feed?limit=300", { credentials: "omit" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();
      if (d && Array.isArray(d.items)) {
        feed = { updated: d.updated || 0, items: d.items, got: Date.now() };
        try { localStorage.setItem(KEY, JSON.stringify(feed)); } catch (e) { /* ignore */ }
      }
      offline = false;
    } catch (e) { offline = true; }
    loading = false;
    render();
  }

  const stageNow = () => { const c = document.documentElement.classList; return c.contains("stage-maktab") ? "m" : c.contains("stage-uni") ? "u" : ""; };
  const fmtDate = (ms) => { if (!ms) return ""; try { return new Date(ms).toLocaleDateString(lang() === "en" ? "en-GB" : lang() === "ru" ? "ru-RU" : "uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" }); } catch (e) { return new Date(ms).toISOString().slice(0, 10); } };
  const items = (kind) => ((feed && feed.items) || []).filter((x) => x.kind === kind);

  /* ---------- Видеолар ---------- */
  function videoList() {
    const seen = new Set();
    const out = [];
    for (const x of items("video")) {
      const k = x.yt || x.tg;
      if (!k || seen.has(k)) continue;
      seen.add(k);
      out.push({ yt: x.yt, tg: x.tg, title: x.title, text: x.text, ch: x.srcName, date: x.date, fresh: x.fresh, pin: x.pin, auto: true, url: x.url });
    }
    for (const v of DATA.videos) {
      const k = v.yt || v.tg;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ ...v, title: v.t, auto: false });
    }
    const sn = stageNow(), q = st.q.trim().toLowerCase();
    return out.filter((v) => (!v.st || !sn || v.st === sn) && (!st.lng || v.lng === st.lng) &&
      (!st.src || (st.src === "auto" ? v.auto : st.src === "tg" ? !!v.tg : st.src === "yt" ? !!v.yt : true)) &&
      (!q || [L(v.title), v.orig || "", v.ch || "", v.text || ""].join(" ").toLowerCase().includes(q)));
  }
  const tgUrl = (ref) => "https://t.me/" + ref;
  const TC = { uzb: "#0f766e", asos: "#047857", suv: "#0369a1", iqlim: "#b91c1c", ifl: "#57534e", bio: "#15803d", yer: "#a16207", orol: "#0e7490", huquq: "#6d28d9" };
  function vcard(v, i) {
    const tp = v.top && TX.topics[v.top];
    const thumb = v.yt ? `<span class="vd-ph" aria-hidden="true"><i class="fa-solid fa-leaf"></i></span><img src="https://i.ytimg.com/vi/${esc(v.yt)}/hqdefault.jpg" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`
      : `<span class="oq-tgph" aria-hidden="true"><i class="fa-solid fa-paper-plane"></i></span>`;
    return `<article class="vd-card oq-card">
      <div class="oq-player" data-player="${i}">
        <button type="button" class="vd-thumb" data-play="${i}" style="--tc:${TC[v.top] || "#047857"}" aria-label="${H(TX.play)}: ${H(v.title)}">${thumb}
          <span class="vd-playic" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
          ${v.lng ? `<span class="vd-lng vd-l-${esc(v.lng)}">${esc(v.lng.toUpperCase())} · ${H(TX.lng[v.lng])}</span>` : ""}
          ${v.fresh ? `<span class="vd-badge ok">${H(TX.fresh)}</span>` : ""}
        </button>
      </div>
      <div class="vd-body">
        <span class="oq-tags">${v.yt ? `<span class="oq-tag yt"><i class="fa-solid fa-circle-play" aria-hidden="true"></i> YouTube</span>` : `<span class="oq-tag tg"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Telegram</span>`}${v.auto ? `<span class="oq-tag au"><i class="fa-solid fa-rotate" aria-hidden="true"></i> ${H(TX.auto)}</span>` : ""}${tp ? `<span class="oq-tag">${H(tp)}</span>` : ""}${v.st ? `<span class="oq-tag">${H(TX.stg[v.st])}</span>` : ""}</span>
        <h3>${H(v.title)}</h3>
        ${v.orig && v.orig !== L(v.title) ? `<p class="vd-orig" lang="${esc(v.lng || "uz")}">«${esc(v.orig)}»</p>` : ""}
        ${v.text ? `<p class="vd-sum">${esc(v.text)}</p>` : ""}
        <p class="vd-ch"><i class="fa-solid fa-circle-play" aria-hidden="true"></i> ${esc(v.ch || "")}${v.date ? ` · ${fmtDate(v.date)}` : ""} · <a href="${esc(v.yt ? "https://www.youtube.com/watch?v=" + v.yt : tgUrl(v.tg))}" target="_blank" rel="noopener noreferrer">${H(TX.onSrc)} ↗</a></p>
      </div>
    </article>`;
  }
  let shown = [];
  function videoView() {
    shown = videoList();
    const chip = (k, label, n) => `<button type="button" class="chip ${st.src === k ? "active" : ""}" aria-pressed="${st.src === k}" data-src="${k}">${label}${n != null ? ` <span class="vd-n">${n}</span>` : ""}</button>`;
    const autoN = new Set(items("video").map((x) => x.yt || x.tg)).size;
    return `<div class="vd-tools">
        <label class="vd-search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input type="search" data-q value="${esc(st.q)}" placeholder="${H(TX.search)}" aria-label="${H(TX.search)}"></label>
      </div>
      <div class="vd-langs" role="group">${["", "uz", "ru", "en"].map((k) => `<button type="button" class="chip vd-lchip${k ? " vd-l-" + k : ""} ${st.lng === k ? "active" : ""}" aria-pressed="${st.lng === k}" data-lng="${k}">${k ? `<b>${k.toUpperCase()}</b> ${H(TX.lng[k])}` : H(TX.all)}</button>`).join("")}</div>
      <div class="qn-tabs" role="group">${chip("", H(TX.all))}${chip("auto", `<i class="fa-solid fa-rotate" aria-hidden="true"></i> ${H(TX.auto)}`, autoN)}${chip("yt", `<i class="fa-solid fa-circle-play" aria-hidden="true"></i> YouTube`)}${chip("tg", `<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Telegram`)}</div>
      ${shown.length ? `<div class="vd-grid">${shown.map(vcard).join("")}</div>` : `<p class="muted">${H(TX.none)}</p>`}`;
  }
  function play(i) {
    const v = shown[i], box = ROOT.querySelector(`[data-player="${i}"]`);
    if (!v || !box) return;
    if (navigator.onLine === false) { const a = window.EkoApp; if (a && a.toast) a.toast(L(TX.needNet)); return; }
    const f = document.createElement("iframe");
    if (v.yt) {
      const hl = { ru: "ru", en: "en" }[lang()] || "uz";
      f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.yt)}?` + new URLSearchParams({ rel: "0", modestbranding: "1", playsinline: "1", hl, autoplay: "1" });
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      f.referrerPolicy = "strict-origin-when-cross-origin";
    } else {
      f.src = `https://t.me/${v.tg.split("/").map(encodeURIComponent).join("/")}?embed=1&userpic=false`;
      f.className = "oq-tgframe";
    }
    f.title = L(v.title);
    f.allowFullscreen = true;
    f.loading = "eager";
    box.innerHTML = ""; box.appendChild(f); box.classList.add("on");
    const a = window.EkoApp; if (a && a.addXp) { try { const k = "oqim:" + (v.yt || v.tg); const s = JSON.parse(localStorage.getItem(KEY + ":xp") || "{}"); if (!s[k]) { s[k] = 1; localStorage.setItem(KEY + ":xp", JSON.stringify(s)); a.addXp(1, L(v.title)); } } catch (e) { /* ignore */ } }
  }

  /* ---------- Қонунлар ---------- */
  function lawList() {
    const q = st.q.trim().toLowerCase();
    const byLex = new Map();
    const lexOf = (u) => { const m = /\/(?:docs|pdfs)\/-?(\d{5,9})/.exec(u || ""); return m ? m[1] : u; };
    for (const l of DATA.laws) byLex.set(lexOf(l.url), { n: l.n, d: Date.parse(l.d) || 0, t: l.t, url: l.url, auto: false });
    for (const x of items("law")) {
      const k = lexOf(x.url);
      const old = byLex.get(k);
      if (old) { if (x.fresh) old.fresh = true; continue; }
      byLex.set(k, { n: x.text || "", d: x.date || 0, t: x.title, url: x.url, auto: true, fresh: x.fresh, pin: x.pin });
    }
    return [...byLex.values()].filter((l) => !q || (l.n + " " + l.t).toLowerCase().includes(q))
      .sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || b.d - a.d);
  }
  function lawView() {
    const list = lawList();
    return `<p class="muted">${H(TX.lawLead)} <a href="#qonun">${H(TX.toQonun)} →</a></p>
      <div class="vd-tools"><label class="vd-search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input type="search" data-q value="${esc(st.q)}" placeholder="${H(TX.search)}" aria-label="${H(TX.search)}"></label></div>
      <ol class="oq-laws">${list.map((l) => `<li class="oq-law">
        <span class="oq-law-n">${esc(l.n || "—")}</span>
        <div><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer"><b lang="uz-Latn">${esc(l.t)}</b> ↗</a>
        <small class="muted">${l.d ? fmtDate(l.d) + " · " : ""}lex.uz${l.auto ? ` · <span class="oq-tag au">${H(TX.auto)}</span>` : ""}${l.fresh ? ` <span class="oq-tag nw">${H(TX.fresh)}</span>` : ""}</small></div></li>`).join("")}</ol>`;
  }

  /* ---------- Янгиликлар ---------- */
  function newsView() {
    const q = st.q.trim().toLowerCase();
    const list = items("news").filter((x) => !q || (x.title + " " + x.text).toLowerCase().includes(q));
    if (!items("news").length) return `<p class="muted">${H(TX.noNews)}</p>${srcList()}`;
    return `<div class="vd-tools"><label class="vd-search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input type="search" data-q value="${esc(st.q)}" placeholder="${H(TX.search)}" aria-label="${H(TX.search)}"></label></div>
      <div class="oq-news">${list.map((x) => `<article class="oq-nw">
        <p class="oq-tags">${x.tg ? `<span class="oq-tag tg"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Telegram</span>` : `<span class="oq-tag"><i class="fa-solid fa-landmark" aria-hidden="true"></i> gov.uz</span>`}${x.fresh ? `<span class="oq-tag nw">${H(TX.fresh)}</span>` : ""}<small class="muted">${fmtDate(x.date || x.at)}</small></p>
        <h3 lang="uz">${esc(x.title)}</h3>${x.text ? `<p>${esc(x.text)}</p>` : ""}
        <p class="small"><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${H(TX.onSrc)} ↗</a> · <span class="muted">${esc(x.srcName || "")}</span></p></article>`).join("") || `<p class="muted">${H(TX.none)}</p>`}</div>`;
  }
  const srcList = () => `<ul class="oq-src">${DATA.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${H(s.n)} ↗</a></li>`).join("")}</ul>`;

  function render() {
    const keep = document.activeElement && ROOT.contains(document.activeElement) && document.activeElement.matches("[data-q]");
    const vn = (() => { const s = st; const o = { ...s }; st = { ...s, q: "", lng: "", src: "" }; const c = videoList().length; st = o; return c; })();
    const ln = (() => { const o = st.q; st.q = ""; const c = lawList().length; st.q = o; return c; })();
    const upd = feed && feed.updated ? fmtDate(feed.updated) + " " + new Date(feed.updated).toTimeString().slice(0, 5) : L(TX.never);
    ROOT.innerHTML = `
      <div class="section-head"><div>
        <span class="pill">${H(TX.pill)}</span>
        <h2 class="section-title">${H(TX.title)}</h2>
        <p class="muted" style="max-width:820px">${H(TX.lead)}</p>
        <p class="vd-status ${offline ? "off" : "on"}" role="status"><i class="fa-solid ${offline ? "fa-plug-circle-xmark" : "fa-rotate"}" aria-hidden="true"></i> ${offline ? H(TX.offline) : `${H(TX.upd)}: ${esc(upd)}`}${loading && !feed ? " · " + H(TX.loading) : ""}</p></div></div>
      <div class="qn-tabs oq-tabs" role="tablist">${["video", "law", "news"].map((k) => `<button type="button" role="tab" class="chip ${st.tab === k ? "active" : ""}" aria-selected="${st.tab === k}" data-tab="${k}"><i class="fa-solid ${k === "video" ? "fa-circle-play" : k === "law" ? "fa-scale-balanced" : "fa-newspaper"}" aria-hidden="true"></i> ${H(TX.tabs[k])} <span class="vd-n">${k === "video" ? vn : k === "law" ? ln : items("news").length}</span></button>`).join("")}</div>
      <div class="oq-panel">${st.tab === "law" ? lawView() : st.tab === "news" ? newsView() : videoView()}</div>
      <details class="oq-srcbox"><summary>${H(TX.srcT)}</summary>${srcList()}</details>`;
    if (keep) { const i = ROOT.querySelector("[data-q]"); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
  }

  ROOT.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || !ROOT.contains(b)) return;
    const d = b.dataset;
    if (d.tab) { st.tab = d.tab; st.q = ""; saveUi(); render(); return; }
    if (d.lng != null) { st.lng = d.lng; saveUi(); render(); return; }
    if (d.src != null) { st.src = d.src; saveUi(); render(); return; }
    if (d.play != null) { play(Number(d.play)); }
  });
  /* Расм юкланмаса (интернет йўқ ёки блокланган) — мавзу белгиси кўринади */
  ROOT.addEventListener("error", (e) => { if (e.target && e.target.tagName === "IMG") e.target.remove(); }, true);
  let qt = null;
  ROOT.addEventListener("input", (e) => {
    if (!e.target.matches("[data-q]")) return;
    st.q = e.target.value.slice(0, 80);
    clearTimeout(qt); qt = setTimeout(render, 200);
  });

  /* Бўлим очилганда (ёки биринчи кўринганда) сервердан янгилаш; кейин ҳар 30 дақиқада */
  let started = false;
  function start() {
    if (started) return;
    started = true;
    render();
    if (navigator.onLine !== false) load(); else { offline = true; render(); }
    setInterval(() => { if (document.visibilityState === "visible" && navigator.onLine !== false) load(); }, 30 * 60 * 1000);
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { io.disconnect(); start(); } }, { rootMargin: "400px" });
    io.observe(SEC);
  } else start();
  window.addEventListener("hashchange", () => { if (location.hash === "#ekooqim") start(); });
  window.addEventListener("online", () => { if (started) load(); });
  window.addEventListener("eko:lang", () => { if (started) render(); });
  if (!started) render();
  window.EkoOqim = { load, render, items: () => (feed && feed.items) || [] };
})();
