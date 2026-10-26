/* Экомун — аноним UX таҳлили (Hotjar ўрнига, ўз серверимизда). Бошқарув марказидаги «UX харита» учун йиғилади:
   • кликлар: бўлим, клик нуқтаси (бўлим энига нисбатан x, бўлим тепасидан y), тугма ёки ҳавола номи;
   • «жаҳл» кликлари (бир жойни тез-тез 3+ марта босиш) ва «бефойда» кликлар (босиладигандек кўринади, лекин ҳеч нарса бўлмади);
   • ҳар бир бўлимда қанча вақт ва қанча чуқур (%) айлантирилгани, бўлимдан бўлимга ўтиш йўли.
   ЮБОРИЛМАЙДИ: киритилган матн ва қийматлар, исм, қурилма коди, IP (сервер сақламайди), экран тасвири.
   Ўчириш: «Do Not Track» / «Global Privacy Control» ёқилган бўлса ёки localStorage «ekotalim:ux-off» = "1"
   (Сўровнома бўлими пастида тугма бор). Сервер бўлмаса (Android илованинг оффлайн нусхаси) ҳеч нарса қилмайди. */
(() => {
  "use strict";
  if (!/^https?:$/.test(location.protocol)) return;
  let framed = false;
  try { framed = window.top !== window.self; } catch (e) { framed = true; }
  const OFF_KEY = "ekotalim:ux-off";
  const optedOut = () => { try { return localStorage.getItem(OFF_KEY) === "1"; } catch (e) { return false; } };
  const dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
  const api = window.EkoUx = {
    get enabled() { return !framed && !dnt && !optedOut(); },
    get dnt() { return dnt; },
    off() { try { localStorage.setItem(OFF_KEY, "1"); } catch (e) { /* ignore */ } q.c.length = 0; q.s.length = 0; path.length = 0; },
    on() { try { localStorage.removeItem(OFF_KEY); } catch (e) { /* ignore */ } }
  };
  if (framed) return; // Бошқарув марказидаги heatmap кўриниши ичида ўзини ўзи ёзмасин

  const dc = () => (innerWidth < 720 ? "m" : innerWidth < 1100 ? "t" : "d");
  const secId = () => { const h = location.hash.slice(1).split(/[/?&:]/)[0]; return /^[a-z0-9-]{1,24}$/.test(h) && document.getElementById(h) ? h : "bosh"; };
  const secEl = (id) => document.getElementById(id) || document.querySelector("main") || document.body;
  const stage = () => { const c = document.documentElement.classList; return c.contains("stage-maktab") ? "maktab" : c.contains("stage-uni") ? "uni" : ""; };
  const lang = () => (window.EkoLang && EkoLang.lang) || "";

  /* Сессия қаердан келди: ?utm_source=tg|ig|producthunt… ёки бошқа сайт (фақат домен номи) */
  const src = (() => {
    try {
      const u = new URLSearchParams(location.search).get("utm_source");
      if (u && /^[\w.-]{1,30}$/.test(u)) return u.toLowerCase();
      const r = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
      return r && r !== location.hostname ? r.slice(0, 30) : "";
    } catch (e) { return ""; }
  })();
  const q = { c: [], s: [] };
  const path = [];
  let cur = { id: secId(), t: Date.now(), depth: 0 };

  /* Нишон номи: фақат интерфейс матни (тугма, ҳавола), ҳеч қачон киритилган қиймат эмас */
  const INTER = "a[href], button, summary, label, select, input, textarea, [role=button], [role=tab], [role=radio], [role=checkbox], [role=link], [data-act]";
  function describe(t) {
    const el = t.closest(INTER);
    if (!el) {
      const c = [...(t.classList || [])].filter((x) => !/^(on|active|open|show|fa-solid|fa-regular)$/.test(x)).slice(0, 1).join(".");
      return (t.tagName || "").toLowerCase() + (t.id ? "#" + t.id : c ? "." + c : "");
    }
    const tag = el.tagName.toLowerCase();
    if (/^(input|textarea|select)$/.test(tag)) return tag + (el.type && tag === "input" ? "[" + el.type + "]" : "") + (el.id ? "#" + el.id : el.name ? "[" + el.name + "]" : "");
    let txt = (el.getAttribute("aria-label") || el.title || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);
    const href = tag === "a" ? el.getAttribute("href") || "" : "";
    if (href.startsWith("#")) txt += " → " + href.slice(0, 24);
    else if (/^https?:/.test(href)) { try { txt += " ↗ " + new URL(href).hostname; } catch (e) { /* ignore */ } }
    return (tag + (el.id ? "#" + el.id : "") + (txt ? " «" + txt + "»" : "")).slice(0, 80);
  }

  /* «Бефойда» кликни аниқлаш учун: кликдан кейин саҳифада бирор нарса ўзгардими */
  let lastMut = 0;
  try { new MutationObserver(() => { lastMut = Date.now(); }).observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true }); } catch (e) { /* ignore */ }
  let lastScroll = 0;
  const recent = [];

  document.addEventListener("click", (e) => {
    if (!api.enabled || !e.isTrusted || !(e.target instanceof Element)) return;
    const t = e.target, now = Date.now();
    let sec = secId(), x, y;
    if (t.closest(".topbar, header, .plus-nav, .sv-invite, .plus-dlg, dialog")) { sec = "ui"; x = Math.round((e.clientX / innerWidth) * 1000); y = 0; }
    else {
      const r = secEl(sec).getBoundingClientRect();
      x = Math.round(((e.clientX - r.left) / Math.max(1, r.width)) * 1000); y = Math.round(e.clientY - r.top);
      if (y < 0 || x < 0 || x > 1000) { sec = "ui"; x = Math.round((e.clientX / innerWidth) * 1000); y = 0; }
    }
    /* Жаҳл: 0,8 сония ичида 40 px доирада 3+ клик */
    recent.push([now, e.clientX, e.clientY]);
    while (recent.length && now - recent[0][0] > 800) recent.shift();
    const rage = recent.filter((r) => Math.hypot(r[1] - e.clientX, r[2] - e.clientY) < 40).length >= 3;
    const rec = [sec, x, y, describe(t), rage ? 1 : 0];
    q.c.push(rec);
    if (q.c.length > 300) q.c.splice(0, q.c.length - 300);
    const looksClickable = !!t.closest(INTER) || getComputedStyle(t).cursor === "pointer" || /^(img|svg|i|path)$/i.test(t.tagName);
    if (looksClickable && !t.closest("input, textarea, select, label")) {
      const h0 = location.href;
      setTimeout(() => { if (lastMut < now && location.href === h0 && lastScroll < now && !document.hidden) rec[4] |= 2; }, 700);
    }
  }, { capture: true, passive: true });

  function depthNow() {
    const el = secEl(cur.id), r = el.getBoundingClientRect();
    if (r.height < 10) return 0;
    return Math.max(0, Math.min(100, Math.round(((innerHeight - r.top) / r.height) * 100)));
  }
  addEventListener("scroll", () => { lastScroll = Date.now(); cur.depth = Math.max(cur.depth, depthNow()); }, { passive: true });

  function leave() {
    const ms = Date.now() - cur.t;
    if (ms > 800) { q.s.push([cur.id, Math.max(cur.depth, depthNow()), ms]); path.push([cur.id, ms]); if (path.length > 40) path.shift(); }
  }
  addEventListener("hashchange", () => {
    const id = secId();
    if (id === cur.id) return;
    if (api.enabled) leave();
    cur = { id, t: Date.now(), depth: 0 };
    setTimeout(() => { cur.depth = Math.max(cur.depth, depthNow()); }, 600);
  });

  function payload(withPath) {
    const b = { dc: dc(), stage: stage(), lang: lang(), c: q.c.splice(0), s: q.s.splice(0) };
    if (withPath && path.length) { b.p = path.splice(0); if (src) b.src = src; }
    return b;
  }
  /* Кликнинг «бефойда» белгиси 0,7 сонияда аниқланади — шунинг учун 1 сониядан эски кликлар юборилади */
  async function flush() {
    if (!api.enabled || !q.c.length && !q.s.length || navigator.onLine === false) return;
    const b = payload(false);
    try { await fetch("/api/ux", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(b), keepalive: true }); }
    catch (e) { /* йўқолса майли — таҳлил учун муҳим эмас */ }
  }
  function beacon() {
    if (!api.enabled) return;
    leave();
    cur = { id: secId(), t: Date.now(), depth: 0 };
    const b = payload(true);
    if (!b.c.length && !b.s.length && !b.p) return;
    try { navigator.sendBeacon("/api/ux", new Blob([JSON.stringify(b)], { type: "application/json" })); } catch (e) { /* ignore */ }
  }
  setInterval(() => setTimeout(flush, 1000), 20000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") beacon(); else cur.t = Date.now(); });
  addEventListener("pagehide", beacon);
})();
