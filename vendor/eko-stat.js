/* Экомун — анонимлаштирилган фойдаланиш статистикаси (бошқарув маркази учун).
   Серверга фақат: тасодифий қурилма коди, босқич, ёш гуруҳи, тил, қайси бўлим неча сония
   очиқ тургани, очилган ва тугатилган дарслар рақами, тест саволларига биринчи жавоб тўғри ёки
   хатолиги, якуний тест фоизи ва воронка қадамлари (якуний тест, сертификат) юборилади. Исм ва профил юборилмайди.
   Сервер бўлмаса (Android илова, файлдан очилганда) ҳеч нарса қилмайди. */
"use strict";
(() => {
  if (!/^https?:$/.test(location.protocol)) return;
  const VKEY = "ekotalim:vid";
  let vid = "";
  try { vid = localStorage.getItem(VKEY) || ""; } catch (e) { /* хотира йўқ */ }
  if (!/^[a-z0-9]{12,32}$/.test(vid)) {
    const a = new Uint8Array(10);
    crypto.getRandomValues(a);
    vid = [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
    try { localStorage.setItem(VKEY, vid); } catch (e) { /* ignore */ }
  }

  const BANDS = [[7, "5–7"], [10, "8–10"], [13, "11–13"], [15, "14–15"], [17, "16–17"], [24, "18–24"], [34, "25–34"], [44, "35–44"], [60, "45–60"], [999, "60+"]];
  function profileInfo() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem("ekotalim:profile") || "null"); } catch (e) { /* ignore */ }
    const cls = document.documentElement.classList;
    const stage = cls.contains("stage-maktab") ? "maktab" : cls.contains("stage-uni") ? "uni" : "";
    let ag = "";
    if (p && p.by && p.bm) {
      const d = new Date(), age = d.getFullYear() - p.by - (d.getMonth() + 1 <= p.bm ? 1 : 0);
      ag = (BANDS.find(([m]) => age <= m) || [0, ""])[1];
    }
    const lang = (window.EkoLang && EkoLang.lang) || "";
    return { stage, ag, lang };
  }
  const sectionOf = () => {
    const id = decodeURIComponent(location.hash.slice(1)).split(/[/?&:]/)[0];
    return /^[a-z0-9-]{1,24}$/.test(id) ? id : "bosh";
  };

  let sid = null, stopped = false, cur = sectionOf(), since = Date.now();
  let visible = document.visibilityState === "visible";
  let acc = {}, path = [cur], lessons = [], done = [], qa = [], fn = [], ex = [];

  function tick() {
    const t = Date.now();
    if (visible) acc[cur] = (acc[cur] || 0) + Math.round((t - since) / 1000);
    since = t;
  }
  function body(end) {
    tick();
    const b = { vid, sid, ...profileInfo(), sec: acc, path, lessons, done, qa, fn, ex, end: !!end };
    acc = {}; path = []; lessons = []; done = []; qa = []; fn = []; ex = [];
    return b;
  }
  function blocked(msg) {
    stopped = true;
    if (document.getElementById("ekoBlocked")) return;
    const d = document.createElement("div");
    d.id = "ekoBlocked";
    d.setAttribute("role", "alertdialog");
    d.style.cssText = "position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:rgba(2,6,23,.92);color:#fff;padding:16px;text-align:center;font:16px/1.5 system-ui,sans-serif";
    d.innerHTML = '<div style="max-width:440px"><div style="font-size:48px">⛔</div><h2 style="margin:8px 0">Кириш чекланган</h2><p></p></div>';
    d.querySelector("p").textContent = msg || "";
    document.body.appendChild(d);
  }
  async function send(end) {
    if (stopped) return;
    const b = body(end);
    if (end && navigator.sendBeacon) {
      navigator.sendBeacon("/api/visit", new Blob([JSON.stringify(b)], { type: "application/json" }));
      return;
    }
    try {
      const res = await fetch("/api/visit", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(b), keepalive: true });
      if (res.status === 404 || res.status === 503) { stopped = true; return; } // сервер йўқ
      const d = await res.json().catch(() => ({}));
      if (d.blocked) return blocked(d.message);
      if (d.sid) sid = d.sid;
    } catch (e) { /* интернет йўқ — кейинги сафар */ }
  }

  /* Бўлим ўзгаришини кузатиш (навигация pushState орқали бўлгани учун соатлаб текширамиз) */
  function checkSection() {
    const s = sectionOf();
    if (s === cur) return;
    tick();
    cur = s;
    if (path[path.length - 1] !== s) path.push(s);
  }
  setInterval(checkSection, 1000);
  window.addEventListener("popstate", checkSection);
  window.addEventListener("hashchange", checkSection);
  window.addEventListener("eko:lesson", (e) => { if (e.detail && e.detail.key) lessons.push(e.detail.key); });
  window.addEventListener("eko:lessondone", (e) => { if (e.detail && e.detail.key) done.push([e.detail.key, e.detail.secs || 0]); });
  window.addEventListener("eko:q", (e) => { if (e.detail && e.detail.k && qa.length < 60) qa.push([e.detail.k, e.detail.ok ? 1 : 0]); });
  window.addEventListener("eko:fn", (e) => {
    const d = e.detail || {}, k = d.k;
    if (k && !fn.includes(k)) fn.push(k);
    if (k === "exam" && d.cid && ex.length < 10) ex.push([d.cid, d.pct]);
  });
  window.addEventListener("eko:user", (e) => { if (e.detail && e.detail.user && !fn.includes("account")) fn.push("account"); });
  document.addEventListener("visibilitychange", () => {
    tick();
    visible = document.visibilityState === "visible";
    if (!visible) send(false);
  });
  window.addEventListener("pagehide", () => send(true));
  setInterval(() => { if (visible) send(false); }, 60 * 1000);
  /* Профил ва тил аниқланиши учун бироз кутамиз */
  setTimeout(() => send(false), 1500);
})();
