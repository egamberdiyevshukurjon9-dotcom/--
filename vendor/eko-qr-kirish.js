/* Экомун — QR код орқали кириш (сервер қисми: qr.js).

   Кирмаган қурилмада (кириш ойнаси → «QR код билан кириш»):
     • «Телефонда тасдиқлаш» — экранда QR кўрсатилади. Ҳисобга кирган телефон уни сканер қилиб
       «Тасдиқлаш» ни босади → шу қурилма ҳисобга киради (WhatsApp Web, Telegram, Google каби).
       QR муддати тугаса, ўзи янгиланади.
     • «QR'ни сканер қилиш» — бошқа қурилмадаги «Кириш QR'и» ни камера билан ўқиш.
   Кирган қурилмада (профил → Онлайн ҳисоб ёки «Ҳисоб созламалари» → «QR код орқали кириш»):
     • «Кириш QR'ини кўрсатиш» — бир марталик QR (3 дақиқа). Телефоннинг оддий камераси билан сканер
       қилинса ҳам ҳавола очилиб, ҳисобга кириб кетади.
     • «QR'ни сканер қилиш» — компьютердаги QR ни ўқиб, киришни тасдиқлаш.
   Ҳаволалар: /?qr=ТОКЕН (бир марталик кириш) ва /?qra=ТОКЕН (телефонда тасдиқлаш).

   Сканер: аввал браузернинг ўз BarcodeDetector'и (Chrome Android, macOS), бўлмаса jsQR (vendor, оффлайн).
   Камерага рухсат берилмаса ёки камера бўлмаса — «Расмдан ўқиш» (скриншот ёки фото). */
(() => {
  "use strict";
  if (!/^https?:$/.test(location.protocol) || location.hostname === "appassets.androidplatform.net") return;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const toast = (m) => { if (window.EkoApp && EkoApp.toast) EkoApp.toast(m); };
  const isPhone = () => matchMedia("(pointer: coarse)").matches && Math.min(screen.width, screen.height) < 600;

  /* ---------- Услублар ---------- */
  const css = document.createElement("style");
  css.textContent = `
#qrDlg { width: min(480px, calc(100% - 24px)); }
#qrDlg .modal-inner { padding: 24px 22px 22px; }
#qrDlg h2 { display: flex; align-items: center; gap: 10px; font-size: 1.25rem; }
.qrk-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 4px; border-radius: 14px; background: var(--bg-alt); margin: 4px 0 16px; }
.qrk-tabs button { border: 0; background: none; color: inherit; font: inherit; font-weight: 600; font-size: .9rem; padding: 10px 8px; border-radius: 10px; cursor: pointer; min-height: 44px; }
.qrk-tabs button[aria-selected="true"] { background: var(--card); box-shadow: 0 1px 4px rgba(0,0,0,.12); color: var(--primary); }
.qrk-tabs button:focus-visible, .qrk-btn:focus-visible { outline: 3px solid var(--primary); outline-offset: 2px; }
.qrk-box { display: grid; justify-items: center; gap: 12px; text-align: center; }
.qrk-code { position: relative; width: min(260px, 72vw); aspect-ratio: 1; background: #fff; border-radius: 16px; padding: 10px; box-shadow: 0 0 0 1px var(--line); display: grid; place-items: center; }
.qrk-code svg { width: 100%; height: 100%; display: block; }
.qrk-code .qrk-logo { position: absolute; left: 50%; top: 50%; translate: -50% -50%; width: 44px; height: 44px; border-radius: 12px; background: #fff; display: grid; place-items: center; font-size: 26px; box-shadow: 0 0 0 4px #fff; }
.qrk-code.dim svg, .qrk-code.dim .qrk-logo { opacity: .12; filter: blur(2px); }
.qrk-over { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 10px; color: #14532d; font-weight: 700; padding: 16px; }
.qrk-timer { font-variant-numeric: tabular-nums; font-size: .9rem; color: var(--muted, #667); }
.qrk-timer b { color: var(--text); }
.qrk-steps { text-align: left; margin: 0; padding-left: 22px; font-size: .92rem; line-height: 1.5; }
.qrk-steps li + li { margin-top: 4px; }
.qrk-status { min-height: 1.4em; font-weight: 600; margin: 0; }
.qrk-status.ok { color: #15803d; } .qrk-status.bad { color: #b91c1c; }
.qrk-cam { position: relative; width: min(320px, 82vw); aspect-ratio: 1; border-radius: 18px; overflow: hidden; background: #0b1410; display: grid; place-items: center; }
.qrk-cam video { width: 100%; height: 100%; object-fit: cover; }
.qrk-cam .qrk-frame { position: absolute; inset: 14%; border-radius: 16px; box-shadow: 0 0 0 9999px rgba(0,0,0,.35); pointer-events: none; }
.qrk-cam .qrk-frame::before { content: ""; position: absolute; inset: 0; border-radius: 16px; border: 3px solid #4ade80; }
.qrk-cam .qrk-line { position: absolute; left: 16%; right: 16%; height: 2px; top: 20%; background: #4ade80; box-shadow: 0 0 12px #4ade80; animation: qrkScan 2.2s ease-in-out infinite alternate; }
@keyframes qrkScan { to { top: 80%; } }
@media (prefers-reduced-motion: reduce) { .qrk-cam .qrk-line { animation: none; top: 50%; } }
.qrk-cam .qrk-ph { color: #d1fae5; display: grid; gap: 10px; justify-items: center; padding: 20px; font-size: .95rem; }
.qrk-cam .qrk-ph i { font-size: 44px; }
.qrk-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.qrk-file { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.qrk-dev { width: 100%; text-align: left; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; display: grid; gap: 6px; font-size: .95rem; }
.qrk-dev div { display: flex; gap: 10px; align-items: baseline; } .qrk-dev div > i { width: 18px; text-align: center; color: var(--primary); }
.qrk-warn { background: color-mix(in srgb, #f59e0b 14%, transparent); border-radius: 12px; padding: 10px 12px; font-size: .88rem; text-align: left; }
.qrk-note { font-size: .85rem; color: var(--muted, #667); margin: 0; }
.qrk-big { font-size: 46px; line-height: 1; }
#qrDlg .g-check { display: flex; gap: 8px; align-items: center; font-weight: 500; font-size: .92rem; cursor: pointer; min-height: 32px; }
@media (max-height: 760px) { .qrk-cam { width: min(250px, 70vw); } .qrk-code { width: min(210px, 60vw); } .qrk-steps { font-size: .86rem; } }
.g-qr { display: flex; align-items: center; justify-content: center; gap: 8px; }
`;
  document.head.appendChild(css);

  /* ---------- Ёрдамчилар ---------- */
  async function call(url, body) {
    const opts = { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body || {}) };
    const res = window.ekoFetch ? await window.ekoFetch(url, opts) : await fetch(url, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { const e = new Error(data.error || "Хатолик юз берди"); e.status = res.status; e.auth = !!data.auth; throw e; }
    return data;
  }
  function loadScript(src, ready) {
    if (ready()) return Promise.resolve(ready());
    return new Promise((ok, no) => {
      const s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = () => (ready() ? ok(ready()) : no(new Error(src)));
      s.onerror = () => no(new Error(src));
      document.head.appendChild(s);
    });
  }
  const loadGen = () => loadScript("/vendor/qrcode.js", () => window.qrcode);
  const loadJsQR = () => loadScript("/vendor/jsqr/jsQR.min.js", () => window.jsQR);
  async function qrSvg(text) {
    const qrcode = await loadGen();
    const q = qrcode(0, "M"); // M — 15% тикланиш: ўртадаги белги QR ўқилишига халақит бермайди
    q.addData(text); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true, alt: "QR" });
  }
  const mmss = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;

  /* QR матнидан токенни олиш. Фақат шу сайтнинг ҳаволалари қабул қилинади. */
  function parseQr(text) {
    let u;
    try { u = new URL(String(text || "").trim(), location.origin); } catch (e) { return { bad: "Бу QR код Экомунга тегишли эмас" }; }
    const t = u.searchParams.get("qr"), a = u.searchParams.get("qra");
    if (!t && !a) return { bad: "Бу QR код Экомунга кириш учун эмас" };
    if (u.host !== location.host) return { bad: "Бу QR код бошқа сайтга тегишли: " + u.host };
    const ok = (x) => /^[A-Za-z0-9_-]{40,64}$/.test(x || "");
    if (t) return ok(t) ? { kind: "link", t } : { bad: "QR код нотўғри" };
    return ok(a) ? { kind: "approve", t: a } : { bad: "QR код нотўғри" };
  }
  const cleanUrl = () => { try { history.replaceState(history.state, "", location.pathname + location.hash); } catch (e) { /* ignore */ } };
  const signedIn = (user) => {
    if (window.EkoGate && EkoGate.signedIn) return EkoGate.signedIn(user);
    location.reload();
  };

  /* ---------- Камера сканери ---------- */
  const Cam = {
    stream: null, timer: 0, busy: false,
    async start(video, onCode, onErr) {
      this.stop();
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return onErr(window.isSecureContext === false ? "Камера фақат HTTPS (хавфсиз) сайтда ишлайди. «Расмдан ўқиш» ни танланг" : "Бу браузерда камера ишламайди. «Расмдан ўқиш» ни танланг");
      }
      let detector = null;
      try {
        if ("BarcodeDetector" in window) {
          const f = await window.BarcodeDetector.getSupportedFormats();
          if (f.includes("qr_code")) detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        }
      } catch (e) { detector = null; }
      try {
        if (!detector) await loadJsQR();
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } });
      } catch (e) {
        this.stop();
        const n = e && e.name;
        return onErr(n === "NotAllowedError" || n === "SecurityError" ? "Камерага рухсат берилмади. Манзил сатридаги 🔒 белгидан рухсат беринг ёки «Расмдан ўқиш» ни танланг"
          : n === "NotFoundError" || n === "OverconstrainedError" ? "Камера топилмади. «Расмдан ўқиш» ни танланг"
          : n === "NotReadableError" ? "Камера бошқа илова томонидан банд. Уни ёпиб, қайта уриниб кўринг"
          : /jsqr/i.test(String(e && e.message)) ? "Сканер юкланмади. Интернетни текшириб, қайта уриниб кўринг" : "Камерани ёқиб бўлмади. «Расмдан ўқиш» ни танланг");
      }
      video.setAttribute("playsinline", ""); video.muted = true;
      video.srcObject = this.stream;
      try { await video.play(); } catch (e) { /* iOS: автоматик ишга тушмаса ҳам кадрлар келади */ }
      const cv = document.createElement("canvas"), cx = cv.getContext("2d", { willReadFrequently: true });
      const tick = async () => {
        if (!this.stream) return;
        if (!this.busy && video.readyState >= 2 && video.videoWidth) {
          this.busy = true;
          try {
            let txt = "";
            if (detector) { const r = await detector.detect(video); if (r && r[0]) txt = r[0].rawValue; }
            else {
              const k = Math.min(1, 720 / Math.max(video.videoWidth, video.videoHeight));
              cv.width = Math.round(video.videoWidth * k); cv.height = Math.round(video.videoHeight * k);
              cx.drawImage(video, 0, 0, cv.width, cv.height);
              const img = cx.getImageData(0, 0, cv.width, cv.height);
              const c = window.jsQR(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
              if (c && c.data) txt = c.data;
            }
            if (txt) { if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) { /* ignore */ } this.stop(); this.busy = false; onCode(txt); return; }
          } catch (e) { /* кейинги кадр */ }
          this.busy = false;
        }
        this.timer = setTimeout(tick, detector ? 180 : 220);
      };
      tick();
    },
    stop() {
      clearTimeout(this.timer); this.timer = 0;
      if (this.stream) { this.stream.getTracks().forEach((t) => t.stop()); this.stream = null; }
    }
  };
  /* Расм (скриншот ёки фото) дан QR ўқиш */
  async function decodeImage(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
      if ("BarcodeDetector" in window) {
        try { const r = await new window.BarcodeDetector({ formats: ["qr_code"] }).detect(img); if (r && r[0]) return r[0].rawValue; } catch (e) { /* jsQR га ўтамиз */ }
      }
      const jsQR = await loadJsQR();
      for (const max of [1200, 800, 1800]) {
        const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const cv = document.createElement("canvas"); cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
        const cx = cv.getContext("2d", { willReadFrequently: true }); cx.drawImage(img, 0, 0, cv.width, cv.height);
        const d = cx.getImageData(0, 0, cv.width, cv.height), c = jsQR(d.data, d.width, d.height, { inversionAttempts: "attemptBoth" });
        if (c && c.data) return c.data;
      }
      return "";
    } finally { URL.revokeObjectURL(url); }
  }

  /* ---------- Ойна ---------- */
  let dlg = null, timers = [], gen = 0, mode = "login", tab = "";
  const clearTimers = () => { timers.forEach((t) => clearTimeout(t)); timers = []; };
  const later = (fn, ms) => { const g = gen, t = setTimeout(() => { if (g === gen && dlg && dlg.open) fn(); }, ms); timers.push(t); };
  function ensureDlg() {
    if (dlg) return dlg;
    dlg = document.createElement("dialog");
    dlg.className = "modal"; dlg.id = "qrDlg"; dlg.setAttribute("aria-labelledby", "qrTitle");
    dlg.innerHTML = `<div class="modal-inner">
      <button class="modal-close" type="button" data-qrk-close aria-label="Ёпиш">✕</button>
      <h2 id="qrTitle"><i class="fa-solid fa-qrcode" aria-hidden="true"></i> <span></span></h2>
      <div class="qrk-tabs" role="tablist" hidden></div>
      <div id="qrBody" role="tabpanel" aria-live="polite"></div>
    </div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener("close", () => { gen++; clearTimers(); Cam.stop(); });
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-qrk-close]")) dlg.close();
      const tb = e.target.closest("[data-qrk-tab]");
      if (tb) showTab(tb.dataset.qrkTab);
    });
    /* Чап-ўнг стрелкалар билан табларни алмаштириш (WAI-ARIA Tabs) */
    dlg.addEventListener("keydown", (e) => {
      const tb = e.target.closest("[data-qrk-tab]");
      if (!tb || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
      const all = [...dlg.querySelectorAll("[data-qrk-tab]")], i = all.indexOf(tb);
      const nx = all[(i + (e.key === "ArrowRight" ? 1 : all.length - 1)) % all.length];
      showTab(nx.dataset.qrkTab); nx.focus();
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden && Cam.stream) { Cam.stop(); if (dlg.open && /scan/.test(tab)) showTab(tab); } });
    return dlg;
  }
  const TABS = {
    login: [["show", "📱 Телефонда тасдиқлаш"], ["scan", "📷 QR'ни сканер қилиш"]],
    account: [["link", "🔳 Кириш QR'ини кўрсатиш"], ["ascan", "📷 QR'ни сканер қилиш"]]
  };
  function open(m, t) {
    ensureDlg();
    mode = m;
    $("#qrTitle span", dlg).textContent = m === "account" ? "QR код орқали кириш" : m === "approve" ? "Киришни тасдиқлаш" : "QR код билан кириш";
    const tabs = $(".qrk-tabs", dlg);
    tabs.hidden = !TABS[m];
    tabs.innerHTML = (TABS[m] || []).map(([k, n]) => `<button type="button" role="tab" id="qrkT-${k}" data-qrk-tab="${k}" aria-selected="false" tabindex="-1">${n}</button>`).join("");
    if (!dlg.open) dlg.showModal();
    if (TABS[m]) showTab(t || TABS[m][0][0]);
  }
  function body(html) { gen++; clearTimers(); Cam.stop(); const b = $("#qrBody", dlg); b.innerHTML = html; return b; }
  function showTab(k) {
    tab = k;
    dlg.querySelectorAll("[data-qrk-tab]").forEach((b) => { const on = b.dataset.qrkTab === k; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    $("#qrBody", dlg).setAttribute("aria-labelledby", "qrkT-" + k);
    if (k === "show") return showLoginQr(0);
    if (k === "scan" || k === "ascan") return showScanner(k);
    if (k === "link") return showLinkQr();
  }

  /* 1-усул, янги қурилма: QR кўрсатиш ва телефондан тасдиқни кутиш */
  async function showLoginQr(round) {
    const b = body(`<div class="qrk-box">
      <div class="qrk-code dim" id="qrkCode"><div class="qrk-over"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i></div></div>
      <p class="qrk-status" id="qrkSt">QR тайёрланмоқда…</p>
      <span class="qrk-timer" id="qrkTm"></span>
      <ol class="qrk-steps">
        <li>Ҳисобингизга кирган телефонда Экомунни очинг.</li>
        <li><b>Профил → Онлайн ҳисоб → «QR код орқали кириш» → «QR'ни сканер қилиш»</b> ни босинг ёки телефон камерасини шу QR га қаратинг.</li>
        <li>Телефонда <b>«Тасдиқлаш»</b> ни босинг — шу қурилма ҳисобингизга киради.</li>
      </ol>
      <label class="g-check"><input type="checkbox" id="qrkRem" checked> Мени шу қурилмада эслаб қол</label>
    </div>`);
    const g = gen, st = $("#qrkSt", b), code = $("#qrkCode", b), tm = $("#qrkTm", b);
    let d;
    try {
      d = await call("/api/qr/start");
      if (g !== gen) return;
      code.innerHTML = (await qrSvg(d.url)) + `<span class="qrk-logo" aria-hidden="true">🌱</span>`;
      code.classList.remove("dim");
      code.setAttribute("role", "img"); code.setAttribute("aria-label", "Кириш учун QR код");
      st.textContent = "Телефонингиз билан сканер қилинг"; st.className = "qrk-status";
    } catch (e) {
      if (g !== gen) return;
      code.innerHTML = `<div class="qrk-over"><button type="button" class="btn btn-primary btn-sm" id="qrkRe">Қайта уриниш</button></div>`;
      st.textContent = e.message; st.className = "qrk-status bad";
      $("#qrkRe", b).addEventListener("click", () => showLoginQr(0));
      return;
    }
    const end = Date.now() + d.ttl * 1000;
    const clock = () => { tm.innerHTML = `QR амал қилади: <b>${mmss(Math.round((end - Date.now()) / 1000))}</b>`; later(clock, 1000); };
    clock();
    const poll = async () => {
      let r;
      try { r = await call("/api/qr/poll", { t: d.t, s: d.s, remember: $("#qrkRem", b).checked }); }
      catch (e) { if (g !== gen) return; if (e.status === 403) { st.textContent = e.message; st.className = "qrk-status bad"; return; } return later(poll, 4000); }
      if (g !== gen) return;
      if (r.status === "ok") {
        clearTimers();
        code.classList.add("dim");
        code.insertAdjacentHTML("beforeend", `<div class="qrk-over"><span class="qrk-big">✅</span>Кирилди!</div>`);
        st.textContent = "Хуш келибсиз, " + r.user.name + "!"; st.className = "qrk-status ok";
        setTimeout(() => { if (dlg.open) dlg.close(); signedIn(r.user); }, 700);
        return;
      }
      if (r.status === "scanned") { st.textContent = "📱 Телефонда сканер қилинди — «Тасдиқлаш» ни босинг"; st.className = "qrk-status ok"; code.classList.add("dim"); }
      if (r.status === "denied") {
        clearTimers(); code.classList.add("dim");
        code.insertAdjacentHTML("beforeend", `<div class="qrk-over"><span class="qrk-big">⛔</span><button type="button" class="btn btn-primary btn-sm" id="qrkRe">Янги QR</button></div>`);
        st.textContent = "Кириш телефонда рад этилди"; st.className = "qrk-status bad";
        $("#qrkRe", b).addEventListener("click", () => showLoginQr(0));
        return;
      }
      if (r.status === "expired") {
        /* WhatsApp Web каби: QR 5 мартагача ўзи янгиланади, кейин тугма билан */
        if (round < 4 && !document.hidden) return showLoginQr(round + 1);
        clearTimers(); code.classList.add("dim");
        code.insertAdjacentHTML("beforeend", `<div class="qrk-over"><button type="button" class="btn btn-primary btn-sm" id="qrkRe"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> QR ни янгилаш</button></div>`);
        st.textContent = "QR муддати тугади"; st.className = "qrk-status"; tm.textContent = "";
        $("#qrkRe", b).addEventListener("click", () => showLoginQr(0));
        return;
      }
      later(poll, document.hidden ? 5000 : 2000);
    };
    later(poll, 1500);
  }

  /* 2-усул, кирган қурилма: бир марталик кириш QR'и */
  async function showLinkQr() {
    const b = body(`<div class="qrk-box">
      <div class="qrk-code dim" id="qrkCode"><div class="qrk-over"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i></div></div>
      <p class="qrk-status" id="qrkSt">QR тайёрланмоқда…</p>
      <span class="qrk-timer" id="qrkTm"></span>
      <ol class="qrk-steps">
        <li>Иккинчи телефон ёки планшетнинг <b>камерасини</b> шу QR га қаратинг (ёки Экомундаги «QR код билан кириш» → «QR'ни сканер қилиш»).</li>
        <li>Очилган ҳаволани босинг — қурилма дарҳол ҳисобингизга киради.</li>
      </ol>
      <p class="qrk-warn"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Бу QR — ҳисобингиз калити. У бир марта ишлайди ва 3 дақиқада тугайди. Уни фақат ўз қурилмангизда сканер қилинг, бегоналарга юборманг.</p>
    </div>`);
    const g = gen, st = $("#qrkSt", b), code = $("#qrkCode", b), tm = $("#qrkTm", b);
    const again = (txt, icon, cls) => {
      clearTimers(); code.classList.add("dim"); tm.textContent = "";
      code.insertAdjacentHTML("beforeend", `<div class="qrk-over">${icon ? `<span class="qrk-big">${icon}</span>` : ""}<button type="button" class="btn btn-primary btn-sm" id="qrkRe"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Янги QR</button></div>`);
      st.textContent = txt; st.className = "qrk-status " + (cls || "");
      $("#qrkRe", b).addEventListener("click", showLinkQr);
    };
    let d;
    try {
      d = await call("/api/qr/link");
      if (g !== gen) return;
      code.innerHTML = (await qrSvg(d.url)) + `<span class="qrk-logo" aria-hidden="true">🌱</span>`;
      code.classList.remove("dim");
      code.setAttribute("role", "img"); code.setAttribute("aria-label", "Бир марталик кириш QR коди");
      st.textContent = "Бошқа қурилма билан сканер қилинг";
    } catch (e) {
      if (g !== gen) return;
      if (e.auth) { code.innerHTML = ""; st.textContent = e.message; st.className = "qrk-status bad"; return; }
      return again(e.message, "", "bad");
    }
    const end = Date.now() + d.ttl * 1000;
    const clock = () => { const s = Math.round((end - Date.now()) / 1000); tm.innerHTML = `QR амал қилади: <b>${mmss(s)}</b>`; if (s <= 0) return again("QR муддати тугади", "⌛"); later(clock, 1000); };
    clock();
    const poll = async () => {
      let r;
      try { r = await call("/api/qr/link-state", { id: d.id }); } catch (e) { if (g === gen) later(poll, 5000); return; }
      if (g !== gen) return;
      if (r.status === "used") return again("✅ " + (r.device || "Бошқа қурилма") + (r.place ? " (" + r.place + ")" : "") + " ҳисобингизга кирди", "✅", "ok");
      if (r.status === "expired") return again("QR муддати тугади", "⌛");
      later(poll, document.hidden ? 6000 : 2500);
    };
    later(poll, 2500);
  }

  /* Сканер: k = "scan" (кирмаган қурилма) ёки "ascan" (кирган қурилма, тасдиқлаш учун) */
  function showScanner(k) {
    const b = body(`<div class="qrk-box">
      <div class="qrk-cam" id="qrkCam">
        <div class="qrk-ph"><i class="fa-solid fa-camera" aria-hidden="true"></i><span>${k === "scan" ? "Ҳисобингизга кирган қурилмадаги «Кириш QR'и» ни сканер қилинг" : "Компьютер ёки планшетдаги кириш QR'ини сканер қилинг"}</span></div>
      </div>
      <p class="qrk-status" id="qrkSt"></p>
      <div class="qrk-row">
        <button type="button" class="btn btn-primary" id="qrkGo"><i class="fa-solid fa-camera" aria-hidden="true"></i> Камерани ёқиш</button>
        <label class="btn btn-ghost" for="qrkFile" tabindex="0" id="qrkFileL"><i class="fa-solid fa-image" aria-hidden="true"></i> Расмдан ўқиш</label>
        <input type="file" id="qrkFile" class="qrk-file" accept="image/*">
      </div>
      ${k === "scan" ? `<label class="g-check"><input type="checkbox" id="qrkRem" checked> Мени шу қурилмада эслаб қол</label>
      <p class="qrk-note">QR кодни ҳисобга кирган қурилмада оласиз: Профил → Онлайн ҳисоб → «QR код орқали кириш».</p>`
      : `<p class="qrk-note">Компьютерда: «Кириш» → «QR код билан кириш». Сканер қилгач, қайси қурилма кираётганини кўриб тасдиқлайсиз.</p>`}
    </div>`);
    const st = $("#qrkSt", b), cam = $("#qrkCam", b), goBtn = $("#qrkGo", b);
    const fail = (m) => { st.textContent = m; st.className = "qrk-status bad"; };
    const got = (text) => {
      const p = parseQr(text);
      if (p.bad) { fail(p.bad); goBtn.hidden = false; goBtn.innerHTML = `<i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Қайта сканер қилиш`; return; }
      if (p.kind === "approve") {
        if (k === "scan") { fail("Бу QR'ни ҳисобингизга кирган телефон билан сканер қилинг. Бу қурилмада «Телефонда тасдиқлаш» ёки кириш QR'идан фойдаланинг"); goBtn.hidden = false; return; }
        return showApprove(p.t);
      }
      return redeem(p.t, k === "scan" ? $("#qrkRem", b).checked : true);
    };
    const start = () => {
      st.textContent = ""; st.className = "qrk-status"; goBtn.hidden = true;
      cam.innerHTML = `<video aria-label="Камера"></video><span class="qrk-frame" aria-hidden="true"></span><span class="qrk-line" aria-hidden="true"></span>`;
      st.textContent = "QR кодни рамка ичига жойлаштиринг";
      Cam.start($("video", cam), got, (m) => {
        cam.innerHTML = `<div class="qrk-ph"><i class="fa-solid fa-video-slash" aria-hidden="true"></i></div>`;
        fail(m); goBtn.hidden = false;
      });
    };
    goBtn.addEventListener("click", start);
    $("#qrkFileL", b).addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("#qrkFile", b).click(); } });
    $("#qrkFile", b).addEventListener("change", async (e) => {
      const f = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!f) return;
      Cam.stop();
      st.textContent = "Расм ўқилмоқда…"; st.className = "qrk-status";
      try { const txt = await decodeImage(f); if (txt) got(txt); else fail("Расмда QR код топилмади. Аниқроқ сурат олинг"); }
      catch (x) { fail("Расмни ўқиб бўлмади"); }
    });
    /* Камера аввал рухсат этилган бўлса — дарҳол ёқилади (такрор босиш шарт эмас) */
    if (navigator.permissions && navigator.permissions.query) navigator.permissions.query({ name: "camera" }).then((p) => { if (p.state === "granted" && dlg.open && tab === k && goBtn.isConnected) start(); }).catch(() => {});
  }

  /* 2-усул: QR'даги бир марталик токен билан кириш */
  async function redeem(t, remember) {
    ensureDlg();
    if (!dlg.open) open("redeem");
    const b = body(`<div class="qrk-box"><span class="qrk-big"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i></span><p class="qrk-status" id="qrkSt">Ҳисобга кирилмоқда…</p></div>`);
    const st = $("#qrkSt", b);
    try {
      const d = await call("/api/qr/redeem", { t, remember });
      b.innerHTML = `<div class="qrk-box"><span class="qrk-big">✅</span><p class="qrk-status ok">Хуш келибсиз, ${esc(d.user.name)}!</p></div>`;
      setTimeout(() => { if (dlg.open) dlg.close(); signedIn(d.user); }, 700);
    } catch (e) {
      $(".qrk-big", b).textContent = "⚠️";
      st.textContent = e.message; st.className = "qrk-status bad";
      b.firstElementChild.insertAdjacentHTML("beforeend", `<p class="qrk-note">Ҳисобингизга кирган қурилмада янги QR олинг: Профил → Онлайн ҳисоб → «QR код орқали кириш».</p>
        <div class="qrk-row"><button type="button" class="btn btn-primary" id="qrkScanAgain"><i class="fa-solid fa-camera" aria-hidden="true"></i> Қайта сканер қилиш</button><button type="button" class="btn btn-ghost" id="qrkPw">Парол билан кириш</button></div>`);
      $("#qrkScanAgain", b).addEventListener("click", () => open("login", "scan"));
      $("#qrkPw", b).addEventListener("click", () => { dlg.close(); if (window.EkoGate) EkoGate.open("signin"); });
    }
  }

  /* 1-усул, телефон: кирмоқчи бўлган қурилмани кўрсатиш ва тасдиқлаш */
  const PEND = "eko_qra";
  async function showApprove(t) {
    ensureDlg();
    if (mode !== "account" || !dlg.open) open("approve");
    const b = body(`<div class="qrk-box"><span class="qrk-big"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i></span><p class="qrk-status">Текширилмоқда…</p></div>`);
    let d;
    try { d = await call("/api/qr/peek", { t }); }
    catch (e) {
      if (e.auth) {
        try { sessionStorage.setItem(PEND, JSON.stringify({ t, at: Date.now() })); } catch (x) { /* ignore */ }
        b.innerHTML = `<div class="qrk-box"><span class="qrk-big">🔐</span><p class="qrk-status">Компьютерда киришни тасдиқлаш учун аввал шу телефонда ҳисобингизга киринг.</p>
          <div class="qrk-row"><button type="button" class="btn btn-primary" id="qrkIn">Ҳисобга кириш</button></div>
          <p class="qrk-note">Кирганингиздан сўнг тасдиқлаш ойнаси ўзи очилади.</p></div>`;
        $("#qrkIn", b).addEventListener("click", () => { dlg.close(); if (window.EkoGate) EkoGate.open("signin"); });
        return;
      }
      b.innerHTML = `<div class="qrk-box"><span class="qrk-big">⚠️</span><p class="qrk-status bad">${esc(e.message)}</p>
        <p class="qrk-note">Компьютердаги QR ўзи янгиланади — янгисини сканер қилинг.</p>
        <div class="qrk-row"><button type="button" class="btn btn-primary" id="qrkAg"><i class="fa-solid fa-camera" aria-hidden="true"></i> Қайта сканер қилиш</button></div></div>`;
      $("#qrkAg", b).addEventListener("click", () => open("account", "ascan"));
      return;
    }
    const g = gen;
    b.innerHTML = `<div class="qrk-box">
      <span class="qrk-big">💻</span>
      <p class="qrk-status">Шу қурилмада <b>${esc(d.name)}</b> ҳисобига кирилсинми?</p>
      <div class="qrk-dev">
        <div><i class="fa-solid fa-display" aria-hidden="true"></i><span>${esc(d.device || "Номаълум қурилма")}</span></div>
        <div><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>${esc(d.place || "Ҳудуд аниқланмади")} · <span data-notr>${esc(d.ip || "")}</span></span></div>
        <div><i class="fa-solid fa-clock" aria-hidden="true"></i><span>${new Date(d.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
      </div>
      ${d.same ? "" : `<p class="qrk-warn"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Бу қурилма бошқа тармоқда. QR кодни ўзингиз очмаган бўлсангиз ёки кимдир юборган бўлса — <b>рад этинг</b>.</p>`}
      <div class="qrk-row"><button type="button" class="btn btn-primary" id="qrkYes"><i class="fa-solid fa-check" aria-hidden="true"></i> Тасдиқлаш</button><button type="button" class="btn btn-ghost" id="qrkNo">Рад этиш</button></div>
    </div>`;
    const answer = async (ok) => {
      $("#qrkYes", b).disabled = true; $("#qrkNo", b).disabled = true;
      try {
        await call("/api/qr/approve", { t, ok });
        if (g !== gen) return;
        b.innerHTML = ok ? `<div class="qrk-box"><span class="qrk-big">✅</span><p class="qrk-status ok">Тасдиқланди! Компьютерда ҳисобингиз очилмоқда.</p></div>`
          : `<div class="qrk-box"><span class="qrk-big">⛔</span><p class="qrk-status">Кириш рад этилди.</p></div>`;
        later(() => dlg.close(), 2200);
      } catch (e) {
        if (g !== gen) return;
        b.innerHTML = `<div class="qrk-box"><span class="qrk-big">⚠️</span><p class="qrk-status bad">${esc(e.message)}</p></div>`;
      }
    };
    $("#qrkYes", b).addEventListener("click", () => answer(true));
    $("#qrkNo", b).addEventListener("click", () => answer(false));
    setTimeout(() => { const y = $("#qrkYes", b); if (y) y.focus(); }, 50);
  }

  /* ---------- Тугмалар: [data-qr-open="login|show|scan|link|ascan"] ---------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qr-open]");
    if (!btn) return;
    e.preventDefault();
    const k = btn.dataset.qrOpen;
    const host = btn.closest("dialog[open]");
    if (host && host !== dlg) host.close();
    if (k === "login" || k === "show" || k === "scan") open("login", k === "login" ? (isPhone() ? "scan" : "show") : k);
    else open("account", k === "ascan" ? "ascan" : "link");
  });

  window.EkoQR = { open, redeem, approve: showApprove, parse: parseQr };

  /* ---------- Ҳаволадан келганда: /?qr=… ёки /?qra=… ---------- */
  function fromUrl() {
    const q = new URLSearchParams(location.search);
    const t = q.get("qr"), a = q.get("qra");
    /* Иловадаги ёрлиқ (manifest shortcuts): «QR код билан кириш» */
    if (q.get("qrlogin")) {
      cleanUrl();
      fetch("/api/me", { credentials: "same-origin" }).then((r) => r.json()).then((d) => open(d.user ? "account" : "login", d.user ? "link" : isPhone() ? "scan" : "show")).catch(() => toast("QR орқали кириш учун интернет керак"));
      return;
    }
    if (!t && !a) {
      /* Тасдиқлаш учун аввал ҳисобга кирилган бўлса — сақланган QR ни давом эттирамиз */
      let p = null;
      try { p = JSON.parse(sessionStorage.getItem(PEND) || "null"); } catch (e) { /* ignore */ }
      if (p && p.t && Date.now() - p.at < 5 * 60 * 1000) {
        fetch("/api/me", { credentials: "same-origin" }).then((r) => r.json()).then((d) => {
          if (!d.user) return;
          try { sessionStorage.removeItem(PEND); } catch (e) { /* ignore */ }
          showApprove(p.t);
        }).catch(() => {});
      }
      return;
    }
    cleanUrl(); // токен манзил сатрида, тарихда ва скриншотларда қолмасин
    const p = parseQr(location.origin + "/?" + (t ? "qr=" + encodeURIComponent(t) : "qra=" + encodeURIComponent(a)));
    if (p.bad) { toast(p.bad); return; }
    if (p.kind === "link") redeem(p.t, true);
    else showApprove(p.t);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fromUrl); else fromUrl();
})();
