/* Экомун — Бошқарув маркази. Ташқи кутубхонасиз; графиклар SVG да чизилади. */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nf = (n) => Number(n || 0).toLocaleString("ru-RU");

  /* Бўлимлар: номи ва фойдаланиш мақсади */
  const PURPOSES = {
    learn: ["📚 Ўқиш ва билим олиш", "var(--c1)"],
    play: ["🎮 Ўйин орқали ўрганиш", "var(--c3)"],
    lab: ["🧪 Тажриба ва лаборатория", "var(--c6)"],
    act: ["🌱 Амалий иш ва фуқаролик фаоллиги", "var(--c4)"],
    data: ["🛰️ Маълумот ва асбоблар", "var(--c2)"],
    school: ["🏫 Синф ва ўқитувчи", "var(--c5)"],
    home: ["🏠 Бош саҳифа", "var(--c7)"]
  };
  const SECTIONS = {
    bosh: ["Бош саҳифа", "home"], kurslar: ["Курслар", "learn"], onlayn: ["Онлайн дарсликлар", "learn"], monografiya: ["Сув ва ҳаво", "learn"],
    krossvord: ["Кроссвордлар", "learn"], kutubxona: ["Кутубхона", "learn"], yangiliklar: ["Янгиликлар", "learn"], adabiyot: ["Хорижий адабиёт", "learn"],
    sayohat: ["Эко-саёҳат", "play"], oyinlar: ["Ўйинлар", "play"], dunyo3d: ["3D Эко-дунё", "play"],
    lab3d: ["3D лаборатория", "lab"], lab: ["Лаборатория", "lab"], vlab: ["Виртуал лаборатория", "lab"], ilmiy: ["Илмий лаборатория", "lab"],
    loyiha: ["Лойиҳалар", "act"], chellenj: ["Челленж", "act"], hashar: ["Ҳашар", "act"], ekokoz: ["Эко-кўз", "act"], xarita: ["Эко-харита", "act"],
    oyinmarkaz: ["Ўйин маркази", "play"], takror: ["Такрорлаш хонаси", "learn"], video: ["Видео дарслар", "learn"], fikr: ["Фикр-мулоҳаза", "data"],
    internet: ["Онлайн маълумотлар", "data"], havo: ["Ҳаво сифати", "data"], kalkulyator: ["Калькулятор", "data"], yordamchi: ["Ёрдамчи", "data"],
    maktab: ["Мактаб (синф)", "school"]
  };
  const secName = (k) => (SECTIONS[k] ? SECTIONS[k][0] : k);
  const purposeOf = (k) => (SECTIONS[k] ? SECTIONS[k][1] : "learn");
  const STAGE = { maktab: "🎒 Мактаб", uni: "🎓 Университет", "?": "Профилсиз" };
  const LANG = { cyr: "Ўзбек (кирилл)", lat: "O‘zbek (lotin)", ru: "Русский", en: "English", "?": "Номаълум" };
  const EVENTS = {
    register: ["ok", "Рўйхатдан ўтди"], login: ["ok", "Кирди"], return: ["info", "Қайтиб келди"], logout: ["", "Чиқди"],
    timeout: ["", "Чиқди (вақт тугади)"], login_failed: ["bad", "Хато парол"], login_blocked: ["bad", "Блокланган кирмоқчи бўлди"],
    blocked: ["bad", "Блокланди"], unblocked: ["ok", "Блокдан чиқарилди"], deleted: ["warn", "Ҳисобини ўчирди"], deleted_admin: ["warn", "Админ ўчирди"], ai: ["info", "Эко-кўз"],
    pro: ["ok", "PRO обуна"], agent: ["info", "AI агент"]
  };
  const JGROUPS = { in: ["register", "login", "return"], out: ["logout", "timeout"], bad: ["login_failed", "login_blocked", "blocked", "deleted_admin"] };

  const fmt = (t) => (t ? new Date(t).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—");
  const dur = (s) => { s = Math.round(s || 0); if (s < 60) return s + " с"; const m = Math.round(s / 60); if (m < 60) return m + " дақ"; return Math.floor(m / 60) + " соат " + (m % 60) + " дақ"; };
  const ago = (t, n) => { const s = Math.max(0, Math.round((n - t) / 1000)); return s < 60 ? "ҳозиргина" : s < 3600 ? Math.round(s / 60) + " дақ олдин" : Math.round(s / 3600) + " соат олдин"; };
  const short = (v) => (v ? v.slice(0, 8) : "—");
  /* Ҳудуд ва қурилма битта катакда: «📍 Самарқанд вил. · 📱 Телефон Samsung … · IP» */
  const placeHtml = (place) => (place ? `<span class="place">📍 ${esc(place)}</span>` : `<span class="muted small">📍 аниқланмоқда…</span>`);
  const devIcon = (d) => (/^Телефон/.test(d || "") ? "📱" : /^Планшет/.test(d || "") ? "📲" : "💻");
  const devHtml = (d) => `<span class="dev">${devIcon(d)} ${esc(d || "—")}</span>`;
  const whereHtml = (o) => `${placeHtml(o.place)}<br>${devHtml(o.device)}<br><span class="mono muted small">${esc(o.ip || "")}</span>`;

  let overview = null, stats = null, security = null, reports = [], feedback = [], tab = "dash", timer = null;

  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 2600); };
  async function api(url, body) {
    const res = await fetch(url, body ? { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body) } : { credentials: "same-origin" });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && !url.endsWith("/login")) { showLogin(); throw new Error("auth"); }
    if (!res.ok) { const e = new Error(data.error || "Хато"); e.data = data; throw e; }
    return data;
  }
  function table(head, rows, empty) {
    if (!rows.length) return `<p class="empty">${esc(empty)}</p>`;
    return `<table><thead><tr>${head.map((h) => `<th class="${h.startsWith("#") ? "num" : ""}">${esc(h.replace(/^#/, ""))}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
  }
  const who = (name, email, extra = "") => `<div class="who"><b>${esc(name || "—")}</b><small>${esc(email || "")}${extra}</small></div>`;

  /* ---------- Графиклар ---------- */
  function lineChart(el, days, series, h = 220) {
    const W = 760, H = h, P = { l: 36, r: 10, t: 12, b: 26 };
    const max = Math.max(1, ...series.flatMap((s) => days.map((d) => d[s.k])));
    const x = (i) => P.l + (days.length < 2 ? (W - P.l - P.r) / 2 : (i * (W - P.l - P.r)) / (days.length - 1));
    const y = (v) => H - P.b - (v / max) * (H - P.t - P.b);
    const ticks = [0, Math.round(max / 2), max];
    const step = Math.max(1, Math.ceil(days.length / 8));
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Кунлик график">`;
    ticks.forEach((v) => { svg += `<line class="axis" x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}"/><text x="${P.l - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`; });
    days.forEach((d, i) => { if ((i % step === 0 && days.length - 1 - i >= step / 2) || i === days.length - 1) svg += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${d.d.slice(8)}.${d.d.slice(5, 7)}</text>`; });
    series.forEach((s, si) => {
      const pts = days.map((d, i) => `${x(i).toFixed(1)},${y(d[s.k]).toFixed(1)}`).join(" ");
      if (si === 0) svg += `<polygon points="${x(0)},${y(0)} ${pts} ${x(days.length - 1)},${y(0)}" fill="${s.c}" opacity=".12"/>`;
      svg += `<polyline points="${pts}" fill="none" stroke="${s.c}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
      days.forEach((d, i) => { svg += `<circle cx="${x(i)}" cy="${y(d[s.k])}" r="${days.length > 40 ? 0 : 2.6}" fill="${s.c}"><title>${d.d}: ${s.n} — ${d[s.k]}</title></circle>`; });
    });
    svg += "</svg>";
    el.innerHTML = svg + `<div class="legend">${series.map((s) => `<span><i style="background:${s.c}"></i>${esc(s.n)}</span>`).join("")}</div>`;
  }
  function bars(el, items, opts = {}) {
    const max = Math.max(1, ...items.map((i) => i.v));
    el.innerHTML = items.length ? `<div class="bars">${items.map((i) => `<div class="bar"><span>${esc(i.n)}</span><span class="track"><span class="fill" style="width:${((i.v / max) * 100).toFixed(1)}%;background:${i.c || "var(--c1)"}"></span></span><span class="v">${esc(opts.f ? opts.f(i) : nf(i.v))}</span></div>`).join("")}</div>` : `<p class="empty">Ҳали маълумот йўқ.</p>`;
  }
  const countBars = (obj, names = {}) => {
    const total = Object.values(obj).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ n: names[k] || k, v, pct: Math.round((v / total) * 100) }));
  };
  const pctF = (i) => `${nf(i.v)} · ${i.pct}%`;

  function heatmap(el, heat) {
    const max = Math.max(1, ...heat.flat());
    const D = ["Душ", "Сеш", "Чор", "Пай", "Жум", "Шан", "Якш"];
    let h = `<table><tr><th></th>${Array.from({ length: 24 }, (_, i) => `<th>${i % 3 === 0 ? i : ""}</th>`).join("")}</tr>`;
    heat.forEach((row, d) => {
      h += `<tr><th>${D[d]}</th>${row.map((v, i) => `<td title="${D[d]}, ${i}:00 — ${v} ташриф" style="background:rgba(16,185,129,${v ? (0.12 + (v / max) * 0.88).toFixed(2) : 0.05})"></td>`).join("")}</tr>`;
    });
    el.innerHTML = `<div class="heat">${h}</table></div><p class="small muted">Тошкент вақти бўйича. Тўқ рангли катак — кўп киришган вақт.</p>`;
  }

  /* ---------- Кўринишлар ---------- */
  function purposeTotals(sections) {
    const out = {};
    for (const [k, v] of Object.entries(sections)) { const p = purposeOf(k); out[p] = (out[p] || 0) + v.secs; }
    return out;
  }
  function kpis(el, list) { el.innerHTML = list.map(([v, l, hl]) => `<div class="kpi${hl ? " hl" : ""}"><b>${v}</b><span>${esc(l)}</span></div>`).join(""); }

  function renderDash() {
    if (!stats || !overview) return;
    const t = stats.totals;
    kpis($("#kpis"), [
      [nf(t.online), "ҳозир онлайн (қурилма)", true], [nf(overview.stats.online), "ҳозир онлайн (ҳисоб)"],
      [nf(t.todayVisitors), "бугун кирганлар"], [nf(t.todayNew), "бугун биринчи марта"],
      [nf(t.visitors), `ташрифчи (${stats.days} кун)`], [dur(t.avgSecs), "ўртача ташриф вақти"],
      [nf(t.users), "рўйхатдан ўтган ҳисоб"], [nf(t.blocked), "блокланган"]
    ]);
    lineChart($("#chDaily"), stats.daily, [{ k: "visitors", n: "Ташрифчилар", c: "var(--c1)" }, { k: "newV", n: "Янгилар", c: "var(--c2)" }]);
    const pt = purposeTotals(stats.sections), total = Object.values(pt).reduce((a, b) => a + b, 0) || 1;
    bars($("#chPurpose"), Object.entries(pt).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ n: PURPOSES[k][0], v, c: PURPOSES[k][1], pct: Math.round((v / total) * 100) })), { f: (i) => `${dur(i.v)} · ${i.pct}%` });
    bars($("#chSections"), Object.entries(stats.sections).sort((a, b) => b[1].secs - a[1].secs).slice(0, 10).map(([k, v]) => ({ n: secName(k), v: v.secs, c: PURPOSES[purposeOf(k)][1] })), { f: (i) => dur(i.v) });
    const el = $("#chStages");
    el.innerHTML = `<div class="split"><div id="chSt1"></div><div id="chSt2"></div></div>`;
    bars($("#chSt1"), countBars(stats.stages, STAGE).map((i) => ({ ...i, c: i.n.includes("Мактаб") ? "var(--c3)" : "var(--c2)" })), { f: pctF });
    const order = ["5–7", "8–10", "11–13", "14–15", "16–17", "18–24", "25–34", "35–44", "45–60", "60+", "?"];
    bars($("#chRegions"), countBars(stats.regions || {}).slice(0, 14).map((i) => ({ ...i, n: "📍 " + i.n, c: "var(--c1)" })), { f: pctF });
    bars($("#chDevTypes"), countBars(stats.devTypes || {}).map((i) => ({ ...i, n: devIcon(i.n) + " " + i.n, c: "var(--c6)" })), { f: pctF });
    const mt = (stats.models || []).reduce((a, [, v]) => a + v, 0) || 1;
    bars($("#chModels"), (stats.models || []).slice(0, 8).map(([n, v]) => ({ n, v, pct: Math.round((v / mt) * 100), c: "var(--c4)" })), { f: pctF });
    bars($("#chSt2"), countBars(stats.ages, { "?": "Номаълум" }).sort((a, b) => order.indexOf(a.n === "Номаълум" ? "?" : a.n) - order.indexOf(b.n === "Номаълум" ? "?" : b.n)).map((i) => ({ ...i, n: i.n === "Номаълум" ? i.n : i.n + " ёш", c: "var(--c4)" })), { f: pctF });
  }

  function personCell(p) {
    if (p.userId || p.user) {
      const u = p.user || p;
      return `<button class="link" data-person-user="${esc(u.userId || u.id)}">${who(u.name, u.email)}</button>`;
    }
    return `<button class="link" data-person-vid="${esc(p.vid)}"><div class="who"><b>Меҳмон <span class="mono">${esc(short(p.vid))}</span></b><small>ҳисобсиз</small></div></button>`;
  }
  const actBtns = (kind, id, blocked, label) => `<div class="acts">
    ${blocked ? `<button class="btn sm" data-unblock="${kind}" data-id="${esc(id)}">↺ Блокдан чиқариш</button>` : `<button class="btn sm" data-block="${kind}" data-id="${esc(id)}" data-label="${esc(label)}">⛔ Блоклаш</button>`}
    <button class="btn sm" data-del="${kind}" data-id="${esc(id)}" data-label="${esc(label)}" title="Платформадан ўчириш">🗑️</button></div>`;
  const pathHtml = (path) => `<div class="path">${(path || []).slice(-8).map(secName).map(esc).join(" → ")}</div>`;

  function renderOnline() {
    if (!overview) return;
    const n = overview.now;
    $("#onlineNote").textContent = `Охирги ${overview.onlineMinutes} дақиқада фаол бўлганлар. Ҳар 15 сонияда янгиланади.`;
    $("#tOnlineUsers").innerHTML = table(["Фойдаланувчи", "Кирган вақти", "Охирги фаоллик", "Ҳудуд · қурилма · IP"],
      overview.online.map((o) => `<tr><td>${personCell({ userId: o.id, name: o.name, email: o.email })}</td><td>${fmt(o.since)}</td><td>${ago(o.lastSeen, n)}</td><td>${whereHtml(o)}</td></tr>`),
      "Ҳозир ҳисобга кирган ҳеч ким йўқ.");
    $("#tOnlineGuests").innerHTML = table(["Ким", "Ҳозир қаерда", "Босқич", "Кирди", "#Вақт", "Ҳудуд · қурилма · IP", "Амал"],
      overview.guests.map((v) => { const cur = (v.path || [])[v.path.length - 1]; const label = v.user ? v.user.name : "Меҳмон " + short(v.vid);
        return `<tr><td>${personCell({ ...v, user: v.user })}</td><td><span class="tag info">${esc(secName(cur || "bosh"))}</span>${pathHtml(v.path)}</td><td>${esc(STAGE[v.stage || "?"])}${v.ag ? `<br><small class="muted">${esc(v.ag)} ёш</small>` : ""}</td><td>${fmt(v.start)}</td><td class="num">${dur(v.secs)}</td><td>${whereHtml(v)}</td><td>${v.user ? actBtns("user", v.user.id, false, label) : actBtns("vid", v.vid, false, label)}</td></tr>`; }),
      "Ҳозир сайтда ҳеч ким йўқ.");
  }

  function renderPeople() {
    if (!overview || !stats) return;
    const q = $("#pSearch").value.trim().toLowerCase(), kind = $("#pKind").value;
    const users = overview.users.filter((u) => (!q || `${u.name} ${u.email}`.toLowerCase().includes(q)) && (kind !== "guest") && (kind !== "blocked" || u.blocked));
    const yr = new Date().getFullYear();
    $("#tUsers").innerHTML = table(["", "Фойдаланувчи", "Ёш", "Рўйхатдан ўтган", "Охирги кириш", "#Киришлар", "Ҳолат", "Амал"],
      users.map((u) => `<tr><td><span class="dot ${u.online ? "" : "off"}"></span></td><td>${personCell({ userId: u.id, name: u.name, email: u.email })}</td><td>${u.by ? yr - u.by : "—"}</td><td>${fmt(u.createdAt)}</td><td>${fmt(u.lastLogin)}</td><td class="num">${u.loginCount}</td>
        <td>${u.blocked ? `<span class="tag bad" title="${esc(u.blocked.reason || "")}">Блокланган</span>` : `<span class="tag ok">Фаол</span>`}</td><td>${actBtns("user", u.id, !!u.blocked, u.name + " · " + u.email)}</td></tr>`),
      "Ҳисоб топилмади.");
    const people = stats.people.filter((p) => {
      if (kind === "acc" && !p.userId) return false;
      if (kind === "guest" && p.userId) return false;
      if (kind === "blocked" && !p.blocked) return false;
      return !q || `${p.name} ${p.email} ${p.vid} ${p.ip} ${p.place} ${p.device}`.toLowerCase().includes(q);
    });
    $("#tPeople").innerHTML = table(["Ким", "Босқич", "Биринчи", "Охирги", "#Ташриф", "#Жами вақт", "Кўпроқ нима қилади", "Ҳудуд · қурилма · IP", "Амал"],
      people.slice(0, 400).map((p) => { const label = p.userId ? p.name : "Меҳмон " + short(p.vid);
        return `<tr><td>${personCell(p)}</td><td>${esc(STAGE[p.stage || "?"])}${p.ag ? `<br><small class="muted">${esc(p.ag)} ёш</small>` : ""}</td><td>${fmt(p.first)}</td><td>${fmt(p.last)}</td><td class="num">${p.visits}</td><td class="num">${dur(p.secs)}</td>
        <td>${p.top.map((k) => `<span class="tag">${esc(secName(k))}</span>`).join(" ")}</td><td>${whereHtml(p)}</td>
        <td>${p.blocked ? `<span class="tag bad">Блокланган</span><br>` : ""}${p.userId ? actBtns("user", p.userId, p.blocked, label) : actBtns("vid", p.vid, p.blocked, label)}</td></tr>`; }),
      "Бу даврда ташриф йўқ.");
  }

  function renderJournal() {
    if (!overview) return;
    const q = $("#jSearch").value.trim().toLowerCase(), type = $("#jType").value;
    const evs = overview.events.filter((e) => (!type || JGROUPS[type].includes(e.type)) && (!q || `${e.name} ${e.email} ${e.ip} ${e.place} ${e.device}`.toLowerCase().includes(q)));
    $("#tEvents").innerHTML = table(["Вақт", "Ҳодиса", "Фойдаланувчи", "Ҳудуд · қурилма · IP"],
      evs.map((e) => { const [c, l] = EVENTS[e.type] || ["", e.type]; return `<tr><td>${fmt(e.at)}</td><td><span class="tag ${c}">${esc(l)}</span>${e.reason ? `<br><small class="muted">${esc(e.reason)}</small>` : ""}</td><td>${e.userId ? personCell({ userId: e.userId, name: e.name, email: e.email }) : who(e.name, e.email)}</td><td>${whereHtml(e)}</td></tr>`; }),
      "Ҳодиса йўқ.");
    $("#tVisits").innerHTML = recentVisitsHtml(q);
  }
  let recent = [];
  function recentVisitsHtml(q) {
    const list = recent.filter((v) => !q || `${v.user ? v.user.name + " " + v.user.email : ""} ${v.vid} ${v.ip} ${v.place} ${v.device}`.toLowerCase().includes(q));
    return table(["Кирди", "Чиқди", "Ким", "#Вақт", "Нималар қилди", "Ҳудуд · қурилма · IP"],
      list.map((v) => `<tr><td>${fmt(v.start)}</td><td>${v.ended ? fmt(v.last) : `<span class="tag ok">ҳозир сайтда</span>`}</td><td>${personCell(v)}</td><td class="num">${dur(v.secs)}</td><td>${pathHtml(v.path)}${v.lessons && v.lessons.length ? `<small class="muted">📖 ${v.lessons.length} та дарс очди</small>` : ""}</td><td>${whereHtml(v)}</td></tr>`),
      "Ҳали ташриф йўқ.");
  }

  function renderStats() {
    if (!stats) return;
    const t = stats.totals;
    const pages = Object.values(stats.sections).reduce((a, b) => a + b.views, 0);
    kpis($("#kpis2"), [
      [nf(t.visitors), "ноёб ташрифчи", true], [nf(t.visits), "ташриф"], [dur(t.avgSecs), "ўртача давомийлик"], [dur(t.secs), "жами вақт"],
      [t.visitors ? Math.round((t.returning / t.visitors) * 100) + "%" : "—", "қайтиб келганлар"], [nf(t.accounts), "фаол ҳисоблар"],
      [t.visits ? (pages / t.visits).toFixed(1) : "—", "бўлим / ташриф"]
    ]);
    lineChart($("#chDaily2"), stats.daily, [
      { k: "visitors", n: "Ташрифчилар", c: "var(--c1)" }, { k: "newV", n: "Янги ташрифчилар", c: "var(--c2)" },
      { k: "logins", n: "Ҳисобга киришлар", c: "var(--c3)" }, { k: "registers", n: "Рўйхатдан ўтишлар", c: "var(--c4)" }
    ], 260);
    heatmap($("#chHeat"), stats.heat);
    const DL = ["1 дақиқадан кам", "1–5 дақиқа", "5–15 дақиқа", "15–60 дақиқа", "1 соатдан кўп"];
    const dsum = stats.dur.reduce((a, b) => a + b, 0) || 1;
    bars($("#chDur"), stats.dur.map((v, i) => ({ n: DL[i], v, pct: Math.round((v / dsum) * 100), c: "var(--c2)" })), { f: pctF });
    const secs = Object.entries(stats.sections).sort((a, b) => b[1].secs - a[1].secs);
    const totalS = secs.reduce((a, [, v]) => a + v.secs, 0) || 1;
    $("#tSections").innerHTML = table(["Бўлим", "Мақсад", "#Кўришлар", "#Вақт", "#Улуши"],
      secs.map(([k, v]) => `<tr><td>${esc(secName(k))}</td><td><small>${esc(PURPOSES[purposeOf(k)][0])}</small></td><td class="num">${nf(v.views)}</td><td class="num">${dur(v.secs)}</td><td class="num">${Math.round((v.secs / totalS) * 100)}%</td></tr>`),
      "Ҳали маълумот йўқ.");
    $("#tLessons").innerHTML = table(["Дарс", "#Очилди"], stats.lessons.map(([k, n]) => `<tr><td>${esc(lessonName(k))}</td><td class="num">${n}</td></tr>`), "Ҳали дарс очилмаган.");
    bars($("#chRegions2"), countBars(stats.regions || {}).map((i) => ({ ...i, c: "var(--c1)" })), { f: pctF });
    bars($("#chCountries"), countBars(stats.countries || {}).map((i) => ({ ...i, c: "var(--c2)" })), { f: pctF });
    bars($("#chLang"), countBars(stats.langs, LANG).map((i) => ({ ...i, c: "var(--c2)" })), { f: pctF });
    bars($("#chOs"), countBars(stats.os).map((i) => ({ ...i, c: "var(--c6)" })), { f: pctF });
    bars($("#chBr"), countBars(stats.browsers).map((i) => ({ ...i, c: "var(--c4)" })), { f: pctF });
    insights();
  }
  const COURSES = { kichik: "Кичик эколог", yosh: "Ёш тадқиқотчи", tabiat: "Табиат сирлари", steam: "Эко-STEAM лойиҳачи", asoslar: "Экология асослари", korxona: "Корхонада экологик менежмент",
    talaba: "Барқарор ривожланиш", suvhavo: "Сув ва ҳаво", biotoza: "Микроблар сувни тозалайди", monitoring: "Экологик мониторинг", iqlim: "Иқлим ўзгаришини бошқариш",
    qayta: "Қайта ишлаш", ekologiya: "Экология", qollanma: "Амалий қўлланмалар", tadqiqot: "Илмий тадқиқот методологияси", litosfera: "Литосферани ҳимоя қилиш", yerqalqon: "Ер қалқони",
    xalqaro: "Халқаро экологик тажриба", dunyo: "Дунё бўйлаб эко-саёҳат" };
  const lessonName = (k) => { const [c, i, q] = k.split(":"); return `${COURSES[c] || c} · ${Number(i) + 1}-дарс` + (q != null ? ` · ${Number(q) + 1}-савол` : ""); };
  function insights() {
    const t = stats.totals, out = [];
    const d = stats.daily, half = Math.floor(d.length / 2);
    if (d.length >= 4) {
      const a = d.slice(0, half).reduce((s, x) => s + x.visitors, 0), b = d.slice(half).reduce((s, x) => s + x.visitors, 0);
      if (a || b) out.push(b >= a ? `Даврнинг иккинчи ярмида ташрифчилар ${a ? Math.round(((b - a) / a) * 100) + "% га кўпайди" : "пайдо бўлди"} (${nf(a)} → ${nf(b)}).` : `Даврнинг иккинчи ярмида ташрифчилар ${Math.round(((a - b) / a) * 100)}% га камайди (${nf(a)} → ${nf(b)}).`);
    }
    const pt = Object.entries(purposeTotals(stats.sections)).sort((a, b) => b[1] - a[1]);
    if (pt.length) out.push(`Асосий мақсад — ${PURPOSES[pt[0][0]][0].replace(/^\S+\s/, "").toLowerCase()}: вақтнинг ${Math.round((pt[0][1] / (pt.reduce((s, x) => s + x[1], 0) || 1)) * 100)}% шунга кетмоқда.`);
    const peak = stats.heat.flatMap((r, di) => r.map((v, h) => [v, di, h])).sort((a, b) => b[0] - a[0])[0];
    if (peak && peak[0]) out.push(`Энг гавжум вақт — ${["душанба", "сешанба", "чоршанба", "пайшанба", "жума", "шанба", "якшанба"][peak[1]]}, соат ${peak[2]}:00–${peak[2] + 1}:00.`);
    const rg = Object.entries(stats.regions || {}).filter(([k]) => !/Аниқланмоқда|Номаълум|Локал/.test(k)).sort((a, b) => b[1] - a[1]);
    if (rg.length) out.push(`Энг кўп ташрифчи ${rg[0][0]} дан (${rg[0][1]} та)${rg[1] ? `, кейин ${rg[1][0]} (${rg[1][1]})` : ""}.`);
    const dv = stats.devTypes || {}, dvt = Object.values(dv).reduce((a, b) => a + b, 0);
    if (dvt) out.push(`Ташрифчиларнинг ${Math.round(((dv["Телефон"] || 0) / dvt) * 100)}% и телефондан киради.`);
    const st = stats.stages;
    if ((st.maktab || 0) + (st.uni || 0)) out.push(`Ташрифчиларнинг ${Math.round(((st.maktab || 0) / ((st.maktab || 0) + (st.uni || 0))) * 100)}% и мактаб, ${Math.round(((st.uni || 0) / ((st.maktab || 0) + (st.uni || 0))) * 100)}% и университет босқичида.`);
    if (t.visitors) out.push(`Ташрифчиларнинг ${Math.round((t.returning / t.visitors) * 100)}% и платформага қайтиб келган.${t.returning / t.visitors < 0.25 ? " Бу паст: кун маслаҳати, челленж ва эслатмалар орқали қайтишни кучайтириш мумкин." : ""}`);
    const short1 = stats.dur[0] / (stats.dur.reduce((a, b) => a + b, 0) || 1);
    if (short1 > 0.4) out.push(`Ташрифларнинг ${Math.round(short1 * 100)}% и 1 дақиқадан қисқа — бош саҳифани соддалаштириш ёки биринчи қадамни аниқроқ кўрсатиш фойдали.`);
    if (security && security.suspicious.length) out.push(`Сўнгги 24 соатда ${security.suspicious.length} та шубҳали IP бор — «Блок ва хавфсизлик» бўлимини кўринг.`);
    $("#insights").innerHTML = out.length ? out.map((x) => `<li>${esc(x)}</li>`).join("") : "<li>Хулоса учун маълумот ҳали етарли эмас.</li>";
  }

  /* ---------- Ўсиш ва ўқиш ---------- */
  const FUNNEL = { visit: "👀 Платформага кирди", profile: "🪪 Профил тузди (ёш босқичи)", lesson: "📖 Дарс очди", done: "✅ Дарсни тугатди", exam: "📝 Якуний тест топширди", exampass: "🎯 Тестдан ўтди (80%+)", cert: "🏆 Сертификат олди" };
  let growth = null, system = null;

  function renderGrowth() {
    if (!growth) return;
    const g = growth, k = g.kpi;
    kpis($("#kpisG"), [
      [nf(k.dau), "DAU — бугун фаол", true], [nf(k.wau), "WAU — 7 кунда"], [nf(k.mau), "MAU — 30 кунда"],
      [k.stickiness + "%", "DAU/MAU (ёпишқоқлик)"], [dur(k.avgSecs), "ўртача сессия"], [k.bounce + "%", "дарҳол чиқиб кетганлар"],
      [nf(k.certs), `сертификат (${g.days} кун)`], [nf(k.certsAll), "жами сертификат"]
    ]);
    const top = Math.max(1, g.funnel[0] ? g.funnel[0].n : 1);
    $("#chFunnel").innerHTML = `<div class="funnel">${g.funnel.map((s, i) => {
      const prev = i ? g.funnel[i - 1].n : 0, drop = i && prev ? Math.round(((prev - s.n) / prev) * 100) : 0;
      return `<div class="step"><span>${esc(FUNNEL[s.k] || s.k)}</span><span class="track"><span class="fill" style="width:${((s.n / top) * 100).toFixed(1)}%;display:block"></span></span><span class="v">${nf(s.n)} · ${Math.round((s.n / top) * 100)}%${drop > 0 ? ` <span class="drop">−${drop}%</span>` : ""}</span></div>`;
    }).join("")}</div>`;
    bars($("#chRet"), g.retention.map((r) => ({ n: `${r.n}+ кундан кейин`, v: r.pct || 0, c: "var(--c2)", r })), { f: (i) => (i.r.pct == null ? "маълумот кам" : `${i.r.pct}% · ${nf(i.r.back)}/${nf(i.r.base)}`) });
    const maxW = Math.max(...g.cohorts.map((c) => c.cells.length), 1);
    $("#tCohort").innerHTML = table(["Ҳафта", "#Янгилар", ...Array.from({ length: maxW }, (_, i) => (i ? `+${i} ҳ` : "0-ҳафта"))],
      g.cohorts.slice().reverse().map((c) => `<tr><td>${c.week.split("-").reverse().join(".")}</td><td class="num">${nf(c.size)}</td>${Array.from({ length: maxW }, (_, i) => {
        const v = c.cells[i];
        return v == null || !c.size ? `<td class="c muted">${i < c.cells.length ? "—" : ""}</td>` : `<td class="c" style="background:rgba(16,185,129,${(0.08 + (v / 100) * 0.8).toFixed(2)})">${v}%</td>`;
      }).join("")}</tr>`), "Ҳали маълумот йўқ.");
    $("#tLessons2").innerHTML = table(["Дарс", "#Очилди", "#Тугатди", "Тугатиш", "#Ўрт. вақт"],
      g.lessons.slice(0, 40).map((l) => `<tr><td>${esc(lessonName(l.k))}</td><td class="num">${nf(l.open)}</td><td class="num">${nf(l.done)}</td><td class="nw">${l.rate == null ? "—" : `<span class="meter good"><i style="width:${l.rate}%"></i></span>${l.rate}%`}</td><td class="num">${l.avg ? dur(l.avg) : "—"}</td></tr>`),
      "Бу даврда дарс очилмаган.");
    $("#tHard").innerHTML = table(["Савол", "#Жавоблар", "Хато"],
      g.hard.map((q) => `<tr><td>${esc(lessonName(q.k))}</td><td class="num">${nf(q.n)}</td><td class="nw"><span class="meter"><i style="width:${q.err}%"></i></span>${q.err}%</td></tr>`),
      "Камида 3 та жавоб берилган савол ҳали йўқ.");
    $("#tCerts").innerHTML = table(["Сана", "Эгаси", "Курс", "#Тест", "Код"],
      g.certList.map((c) => `<tr><td>${fmt(c.at)}</td><td>${esc(c.name)}</td><td>${esc(c.title)}</td><td class="num">${({ gold: "🥇 ", silver: "🥈 ", bronze: "🥉 " })[c.grade] || ""}${c.pct ? c.pct + "%" : "—"}</td><td><a class="mono" href="/tekshir?c=${encodeURIComponent(c.code)}" target="_blank" rel="noopener">${esc(c.code)}</a></td></tr>`),
      "Бу даврда сертификат берилмаган.");
  }

  /* ---------- Тизим ва хатолар ---------- */
  const bytes = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + " МБ" : Math.max(1, Math.round(n / 1024)) + " КБ");
  function renderSystem() {
    if (!system) return;
    const s = system, c = s.counts;
    $("#sysInfo").innerHTML = [
      ["Ишлаяпти", dur(s.uptime) + ` (${fmt(s.started)} дан)`], ["Node.js", s.node], ["Хотира", bytes(s.mem.rss)],
      ["Маълумотлар файли", bytes(s.dbSize)], ["Ҳисоблар", nf(c.users)], ["Ташриф ёзувлари", nf(c.visits)], ["Журнал ёзувлари", nf(c.events)],
      ["Харита хабарлари", nf(c.reports)], ["Сертификатлар", nf(c.certs)], ["Хатолар (турлари)", nf(c.errors)]
    ].map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join("");
    $("#tBackups").innerHTML = table(["Файл", "Сана", "#Ҳажм"], s.backups.map((b) => `<tr><td class="mono">${esc(b.file)}</td><td>${fmt(b.at)}</td><td class="num">${bytes(b.size)}</td></tr>`),
      "Ҳали захира нусха йўқ (сервер ишга тушгандан 10 сония кейин биринчиси олинади).");
    $("#tErrors").innerHTML = table(["Охирги марта", "Хато", "Жой", "#Сони", "Қурилмалар"],
      s.errors.map((e) => `<tr><td>${fmt(e.last)}<br><small class="muted">биринчи: ${fmt(e.first)}</small></td><td><b>${esc(e.msg)}</b>${e.ver ? `<br><small class="muted">v${esc(e.ver)}${e.sec ? " · " + esc(secName(e.sec)) : ""}</small>` : ""}</td><td class="mono">${esc(e.src || "—")}${e.line ? ":" + e.line : ""}</td><td class="num">${nf(e.count)}</td><td>${(e.devices || []).map((d) => `<span class="tag">${esc(d)}</span>`).join(" ")}</td></tr>`),
      "Хато йўқ — ҳаммаси жойида 👍");
    $("#healthUrl").textContent = location.origin + s.health;
    const n = s.errors.filter((e) => overview && overview.now - e.last < 86400000).length;
    $("#bErr").hidden = !n; $("#bErr").textContent = n;
  }
  async function loadGrowth() { growth = await api("/api/admin/growth?days=" + $("#range").value); }
  async function loadSystem() { system = await api("/api/admin/system"); }

  /* ---------- Мавзу: авто → ёруғ → тунги ---------- */
  const THEMES = { auto: "🖥️ Авто мавзу", light: "☀️ Ёруғ мавзу", dark: "🌙 Тунги мавзу" };
  function paintTheme() {
    let t = "auto";
    try { t = localStorage.getItem("eko-admin-theme") || "auto"; } catch (e) { /* ignore */ }
    if (!THEMES[t]) t = "auto";
    if (t === "auto") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
    $("#themeBtn").textContent = THEMES[t];
    return t;
  }
  $("#themeBtn").addEventListener("click", () => {
    const order = ["auto", "light", "dark"], next = order[(order.indexOf(paintTheme()) + 1) % 3];
    try { localStorage.setItem("eko-admin-theme", next); } catch (e) { /* ignore */ }
    paintTheme();
  });
  paintTheme();
  $("#dlBackup").href = "/api/admin/backup";
  $("#clearErr").addEventListener("click", async () => {
    if (!(await confirmBox("Хатолар журналини тозалаш", "Барча хато ёзувлари ўчирилади.", false))) return;
    try { await api("/api/admin/errors/clear", {}); await loadSystem(); renderSystem(); toast("Тозаланди"); } catch (err) { if (err.message !== "auth") toast(err.message); }
  });

  function renderBlocks() {
    if (!security) return;
    $("#yourIp").textContent = `Сизнинг IP манзилингиз: ${security.yourIp} (уни блоклаб бўлмайди).`;
    const KL = { user: "Ҳисоб", vid: "Қурилма", ip: "IP" };
    $("#tBlocks").innerHTML = table(["Тури", "Ким", "Қачон", "Сабаб", "Амал"],
      security.blocks.map((b) => `<tr><td><span class="tag bad">${KL[b.kind]}</span></td><td>${b.kind === "user" ? `<button class="link" data-person-user="${esc(b.id)}">${esc(b.label)}</button>` : b.kind === "vid" ? `<button class="link" data-person-vid="${esc(b.id)}">${esc(b.label)}</button>` : `<span class="mono">${esc(b.id)}</span>`}</td><td>${fmt(b.at)}</td><td>${esc(b.reason || "—")}</td>
        <td><button class="btn sm" data-unblock="${b.kind}" data-id="${esc(b.id)}">↺ Блокдан чиқариш</button></td></tr>`),
      "Ҳеч ким блокланмаган.");
    $("#tSusp").innerHTML = table(["IP · ҳудуд", "#Хато парол", "#Янги ҳисоб", "#Ташриф", "Қайси почталарга", "Амал"],
      security.suspicious.map((s) => `<tr><td><span class="mono">${esc(s.ip)}</span><br>${placeHtml(s.place)}</td><td class="num">${s.failed}</td><td class="num">${s.registers}</td><td class="num">${s.visits}</td><td><small>${s.emails.map(esc).join(", ") || "—"}</small></td>
        <td>${s.blocked ? `<span class="tag bad">Блокланган</span>` : `<button class="btn sm" data-block="ip" data-id="${esc(s.ip)}" data-label="IP ${esc(s.ip)}">⛔ Блоклаш</button>`}</td></tr>`),
      "Шубҳали фаоллик йўқ. 👍");
    $("#tAdminLog").innerHTML = table(["Вақт", "Натижа", "Ҳудуд · қурилма · IP"],
      security.log.map((l) => `<tr><td>${fmt(l.at)}</td><td>${l.ok ? `<span class="tag ok">Кирилди</span>` : `<span class="tag bad">Рад этилди: ${esc(l.note)}</span>`}</td><td>${whereHtml(l)}</td></tr>`),
      "Журнал бўш.");
    const c = security.config;
    const li = (ok, text) => `<li>${ok ? "✅" : "⚠️"} <span>${text}</span></li>`;
    $("#secConfig").innerHTML = [
      li(true, `Парол билан ҳимояланган; 15 дақиқада 20 та хато уринишдан сўнг IP вақтинча тўхтатилади.`),
      li(c.totp, c.totp ? "Икки босқичли ҳимоя (Google Authenticator коди) ёқилган." : "Икки босқичли ҳимоя ўчиқ. <code>node tools/admin-totp.js</code> билан калит яратиб, серверга <code>ADMIN_TOTP_SECRET</code> қилиб қўшинг."),
      li(c.path !== "/admin" || !!c.host, c.host ? `Бошқарув маркази алоҳида доменда: <b>${esc(c.host)}</b>. Асосий сайтда у умуман кўринмайди.` : c.path !== "/admin" ? `Махфий манзил: <code>${esc(c.path)}/</code>` : "Манзил оддий (<code>/admin</code>). <code>ADMIN_PATH</code> орқали махфий манзил ёки <code>ADMIN_HOST</code> орқали алоҳида домен беринг."),
      li(c.allowIps > 0, c.allowIps ? `Фақат ${c.allowIps} та рухсат этилган IP дан очилади.` : "IP чеклови йўқ (ихтиёрий: <code>ADMIN_ALLOW_IPS</code>)."),
      li(c.trustProxy, c.trustProxy ? "Ҳақиқий IP манзиллар прокси орқали тўғри аниқланмоқда." : "TRUST_PROXY ўчиқ: Render каби прокси ортида IP лар нотўғри бўлиши мумкин.")
    ].join("");
    const susp = security.suspicious.filter((s) => !s.blocked).length;
    $("#bSusp").hidden = !susp; $("#bSusp").textContent = susp;
  }

  const STATUS = { pending: ["warn", "Кутилмоқда"], approved: ["ok", "Тасдиқланган"], rejected: ["bad", "Рад этилган"] };
  const CATS = { waste: "🗑️ Ахлат", water: "💧 Сув", air: "🏭 Ҳаво", tree: "🌳 Дарахт", noise: "🔊 Шовқин", other: "📍 Бошқа" };
  function renderReports() {
    const rs = $("#repStatus").value;
    const osm = (r) => `https://www.openstreetmap.org/?mlat=${r.lat}&mlon=${r.lng}#map=17/${r.lat}/${r.lng}`;
    $("#tReports").innerHTML = table(["Вақт", "Тури", "Хабар", "Жой", "Ҳолат", "Амал", "Муаллиф"],
      reports.filter((r) => !rs || r.status === rs).map((r) => { const [c, l] = STATUS[r.status] || STATUS.pending;
        return `<tr><td>${fmt(r.createdAt)}</td><td>${esc(CATS[r.category] || r.category)}</td><td class="rep-text">${esc(r.text)}</td><td><a href="${osm(r)}" target="_blank" rel="noopener noreferrer">${r.lat.toFixed(4)}, ${r.lng.toFixed(4)} ↗</a></td><td><span class="tag ${c}">${l}</span></td>
        <td><div class="acts">${r.status !== "approved" ? `<button class="btn sm" data-rep="approve" data-id="${r.id}">✓ Тасдиқлаш</button>` : ""}${r.status !== "rejected" ? `<button class="btn sm" data-rep="reject" data-id="${r.id}">✖ Рад этиш</button>` : ""}<button class="btn sm" data-rep="delete" data-id="${r.id}">🗑️</button></div></td><td>${who(r.name, r.email)}</td></tr>`; }),
      rs === "pending" ? "Текширишни кутаётган хабар йўқ. 👍" : "Хабар йўқ.");
    const p = reports.filter((r) => r.status === "pending").length;
    $("#bPending").hidden = !p; $("#bPending").textContent = p;
  }

  /* ---------- Фикр-мулоҳазалар ---------- */
  const FB_KINDS = { idea: ["info", "💡 Таклиф"], bug: ["bad", "🐞 Хато"], content: ["", "📚 Дарс/маълумот"], question: ["warn", "❓ Савол"], praise: ["ok", "❤️ Миннатдорлик"] };
  let fbShow = 50;
  const fbSecName = (k) => (!k ? "Умуман платформа" : k.startsWith("video:") ? "Видео: " + k.slice(6) : secName(k));
  function fbFiltered() {
    const st = $("#fbState").value, kind = $("#fbKind").value, rate = $("#fbRate").value, sec = $("#fbSec").value, q = $("#fbSearch").value.trim().toLowerCase();
    return feedback.filter((f) => (st === "archived" ? f.archived : !f.archived) &&
      (st !== "unread" || !f.read) && (st !== "read" || (f.read && !f.reply)) && (st !== "replied" || f.reply) &&
      (!kind || f.kind === kind) && (rate === "" || String(f.rating || 0) === rate) && (!sec || (sec === "video" ? f.sec.startsWith("video:") : f.sec === sec)) &&
      (!q || [f.text, f.email, f.name, f.contact, f.sec, fbSecName(f.sec), f.reply].join(" ").toLowerCase().includes(q)));
  }
  function renderFeedback() {
    const live = feedback.filter((f) => !f.archived), unread = live.filter((f) => !f.read).length;
    $("#bFeedback").hidden = !unread; $("#bFeedback").textContent = unread;
    const rated = live.filter((f) => f.rating), avg = rated.length ? (rated.reduce((a, f) => a + f.rating, 0) / rated.length).toFixed(1) : "—";
    const week = live.filter((f) => f.at > Date.now() - 7 * 864e5).length;
    kpis($("#fbKpis"), [[nf(live.length), "Жами мулоҳаза"], [nf(unread), "Ўқилмаган", unread > 0], [avg + (rated.length ? " ★" : ""), `Ўртача баҳо (${rated.length} та)`], [nf(week), "Охирги 7 кунда"], [nf(live.filter((f) => f.reply).length), "Жавоб берилган"]]);
    const kc = {}; live.forEach((f) => (kc[f.kind] = (kc[f.kind] || 0) + 1));
    bars($("#chFbKinds"), Object.entries(kc).sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ n: (FB_KINDS[k] || ["", k])[1], v: n })));
    const sc = {}; live.forEach((f) => { const k = f.sec.startsWith("video:") ? "video" : f.sec; sc[k] = (sc[k] || 0) + 1; });
    const secs = Object.entries(sc).sort((a, b) => b[1] - a[1]);
    bars($("#chFbSecs"), secs.slice(0, 10).map(([k, n]) => ({ n: k === "video" ? "Видео дарслар" : fbSecName(k), v: n })));
    const sel = $("#fbSec"), cur = sel.value;
    sel.innerHTML = `<option value="">Барча бўлимлар</option>` + secs.map(([k, n]) => `<option value="${esc(k)}">${esc(k === "video" ? "Видео дарслар" : fbSecName(k))} (${n})</option>`).join("");
    sel.value = cur;
    const kSel = $("#fbKind");
    if (kSel.options.length === 1) kSel.innerHTML += Object.entries(FB_KINDS).map(([k, [, l]]) => `<option value="${k}">${esc(l)}</option>`).join("");
    const list = fbFiltered();
    const STG = { maktab: "🎒 Мактаб", uni: "🎓 Университет" };
    $("#fbList").innerHTML = !list.length ? `<p class="empty">${$("#fbState").value === "unread" ? "Ўқилмаган мулоҳаза йўқ. 👍" : "Мулоҳаза йўқ."}</p>` :
      `<ul class="fb-list">${list.slice(0, fbShow).map((f) => { const [c, l] = FB_KINDS[f.kind] || ["", f.kind];
        return `<li class="fb-item${f.read ? "" : " unread"}">
          <div class="fb-head"><span class="tag ${c}">${esc(l)}</span>${f.rating ? `<span class="stars" title="${f.rating}/5">${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}</span>` : ""}<span class="tag">${esc(fbSecName(f.sec))}</span>${f.read ? "" : `<span class="tag info">янги</span>`}${f.reply ? `<span class="tag ok">жавоб берилган</span>` : ""}<span class="muted">${fmt(f.at)}</span></div>
          <p class="fb-text">${esc(f.text)}</p>
          <div class="fb-meta">${f.name || f.email ? `<span>👤 ${esc(f.name)} ${esc(f.email)}</span>` : `<span>👤 Меҳмон</span>`}${f.contact ? `<span>✉️ ${esc(f.contact)}</span>` : ""}${f.stage ? `<span>${STG[f.stage] || esc(f.stage)}</span>` : ""}${f.lang ? `<span>${esc(LANG[f.lang] || f.lang)}</span>` : ""}${f.ver ? `<span>v${esc(f.ver)}</span>` : ""}<span>${esc(f.device)}</span><span class="mono">${esc(f.ip)}</span>${f.vid ? `<a href="#" data-fbp="vid=${esc(f.vid)}">тарихи</a>` : ""}</div>
          ${f.reply ? `<div class="fb-reply"><b>Жавоб (${fmt(f.replyAt)}):</b> ${esc(f.reply)}</div>` : ""}
          <div class="acts" style="margin-top:8px">${f.read ? `<button class="btn sm ghost" data-fb="unread" data-id="${f.id}">Ўқилмаган қилиш</button>` : `<button class="btn sm" data-fb="read" data-id="${f.id}">✓ Ўқилди</button>`}<button class="btn sm" data-fbreply="${f.id}">↩ ${f.reply ? "Жавобни ўзгартириш" : "Жавоб ёзиш"}</button>${f.archived ? `<button class="btn sm ghost" data-fb="unarchive" data-id="${f.id}">Архивдан чиқариш</button>` : `<button class="btn sm ghost" data-fb="archive" data-id="${f.id}">🗄 Архив</button>`}<button class="btn sm ghost" data-fb="delete" data-id="${f.id}">🗑️</button></div>
          <form class="fb-form" data-fbform="${f.id}" hidden><textarea maxlength="1000" placeholder="Жавоб фойдаланувчининг «Менинг мулоҳазаларим» рўйхатида кўринади">${esc(f.reply)}</textarea><div class="acts"><button class="btn sm primary" type="submit">Юбориш</button><button class="btn sm ghost" type="button" data-fbcancel>Бекор қилиш</button></div></form>
        </li>`; }).join("")}</ul>${list.length > fbShow ? `<div class="fb-more"><button class="btn ghost sm" id="fbMore">Яна кўрсатиш (${list.length - fbShow})</button></div>` : ""}`;
  }
  async function loadFeedback() { feedback = (await api("/api/admin/feedback")).feedback; }

  /* ---------- Эълонлар ва турнир ---------- */
  let newsItems = [], trData = null;
  const TR_REG = { tsh: "Тошкент ш.", tsv: "Тошкент в.", and: "Андижон", bux: "Бухоро", jiz: "Жиззах", qas: "Қашқадарё", nav: "Навоий", nam: "Наманган", sam: "Самарқанд", sur: "Сурхондарё", sir: "Сирдарё", far: "Фарғона", xor: "Хоразм", qqr: "Қорақалпоғистон", oth: "Бошқа" };
  const STG_N = { all: "Ҳаммага", maktab: "🎒 Мактаб", uni: "🎓 Университет" };
  async function loadCommunity(week) {
    const [n, t] = await Promise.all([api("/api/admin/news"), api("/api/admin/turnir" + (week ? "?w=" + encodeURIComponent(week) : ""))]);
    newsItems = n.items; trData = t;
  }
  function renderCommunity() {
    if (!trData) return;
    const t = trData;
    kpis($("#cmKpis"), [[nf(newsItems.length), "Эълонлар"], [nf(t.list.length), "Шу ҳафта турнирда"], [nf(t.list.filter((e) => e.stage === "maktab").length), "🎒 Мактаб"], [nf(t.list.filter((e) => e.stage === "uni").length), "🎓 Университет"], [nf(t.refs), "Таклиф билан келганлар"]]);
    $("#newsList").innerHTML = newsItems.length ? `<ul class="fb-list">${newsItems.map((n) => `<li class="fb-item"><div class="fb-head">${n.pinned ? `<span class="tag info">📌 бош саҳифада</span>` : ""}<span class="tag">${esc(STG_N[n.stage] || n.stage)}</span><span class="muted">${fmt(n.at)}${n.until ? " → " + fmt(n.until) : ""}</span></div>
      <p class="fb-text"><b>${esc(n.title)}</b>${n.body ? "<br>" + esc(n.body) : ""}${n.link ? `<br><a href="${esc(n.link)}" target="_blank" rel="noopener">${esc(n.link)}</a>` : ""}</p>
      <div class="acts"><button class="btn sm ghost" data-nw="${n.pinned ? "unpin" : "pin"}" data-id="${n.id}">${n.pinned ? "Бош саҳифадан олиш" : "📌 Бош саҳифага"}</button><button class="btn sm ghost" data-nw="delete" data-id="${n.id}">🗑️</button></div></li>`).join("")}</ul>` : `<p class="empty">Эълон йўқ.</p>`;
    const sel = $("#trWeek");
    sel.innerHTML = (t.weeks.length ? t.weeks : [t.week]).map((w) => `<option${w === t.week ? " selected" : ""}>${esc(w)}</option>`).join("");
    $("#trList").innerHTML = t.list.length ? `<table><thead><tr><th>#</th><th>Лақаб</th><th>Босқич</th><th>Вилоят</th><th>Балл</th><th>Тўғри</th><th>Вақт</th><th>IP</th><th></th></tr></thead><tbody>${t.list.map((e, i) => `<tr class="${e.hidden ? "muted" : ""}"><td>${i + 1}</td><td>${esc(e.nick)}</td><td>${e.stage === "maktab" ? "🎒" : "🎓"}</td><td>${esc(TR_REG[e.region] || "—")}</td><td><b>${e.score}</b></td><td>${e.correct}/10</td><td>${fmt(e.at)}</td><td class="mono">${esc(e.ip)}</td><td><button class="btn sm ghost" data-trh="${e.id}">${e.hidden ? "Қайтариш" : "Яшириш"}</button></td></tr>`).join("")}</tbody></table>` : `<p class="empty">Бу ҳафта ҳали ҳеч ким қатнашмади.</p>`;
  }

  /* ---------- Натижалар ---------- */
  const GRADE = { gold: "🥇 Олтин", silver: "🥈 Кумуш", bronze: "🥉 Бронза" };
  const courseName = (c) => COURSES[c] || c;
  const pctMeter = (v, good) => (v == null ? "—" : `<span class="meter${good ? " good" : ""}"><i style="width:${v}%"></i></span>${v}%`);
  function resultsHtml(r) {
    if (!r || (!r.opened && !r.done && !r.qaN && !r.courses.length && !r.certs.length)) return `<h2>🎓 Натижалари</h2><p class="empty">Ҳали дарс ёки тест топширмаган.</p>`;
    const pass = (results && results.pass) || 80;
    return `<h2>🎓 Натижалари</h2>
      <div class="kpis">
        <div class="kpi hl"><b>${r.done}</b><span>тугатилган дарс</span></div><div class="kpi"><b>${r.opened}</b><span>очилган дарс</span></div>
        <div class="kpi"><b>${r.qaPct == null ? "—" : r.qaPct + "%"}</b><span>тўғри жавоб (${r.qaOk}/${r.qaN})</span></div><div class="kpi"><b>${r.certs.length}</b><span>сертификат</span></div>
      </div>
      <div class="table">${table(["Курс", "#Тугатилган дарс", "Якуний тест (энг яхши)", "#Уриниш", "Сертификат"], r.courses.map((c) => `<tr><td>${esc(courseName(c.cid))}</td><td class="num">${c.done}</td>
        <td class="nw">${c.exam ? pctMeter(c.exam.best, c.exam.best >= pass) + (c.exam.best >= pass ? ` <span class="tag ok">ўтди</span>` : ` <span class="tag warn">ўтмади</span>`) : "—"}</td><td class="num">${c.exam ? c.exam.tries : "—"}</td>
        <td>${c.cert ? `${GRADE[c.cert.grade] || ""} <a class="mono" href="/tekshir?c=${encodeURIComponent(c.cert.code)}" target="_blank" rel="noopener">${esc(c.cert.code)}</a>` : "—"}</td></tr>`), "Курс бошланмаган.")}</div>
      ${r.lastDone.length ? `<details style="margin-top:8px"><summary>Тугатилган дарслар рўйхати (${r.lastDone.length})</summary><div class="table">${table(["Дарс", "Қачон", "#Ўқиш вақти"], r.lastDone.map((x) => `<tr><td>${esc(lessonName(x.k))}</td><td>${fmt(x.at)}</td><td class="num">${x.secs ? dur(x.secs) : "—"}</td></tr>`), "")}</div></details>` : ""}`;
  }
  let results = null;
  async function loadResults() { results = await api("/api/admin/results?days=" + $("#range").value); }
  function renderResults() {
    if (!results) return;
    const k = results.kpi;
    $("#rPass").textContent = results.pass;
    kpis($("#kpisR"), [
      [nf(k.learners), `ўқувчи (${results.days} кун)`, true], [nf(k.done), "тугатилган дарс"], [k.qaPct == null ? "—" : k.qaPct + "%", `тўғри жавоб (${nf(k.qaN)} та)`],
      [nf(k.examPeople), "якуний тест топширди"], [k.examAvg == null ? "—" : k.examAvg + "%", "тестнинг ўртача натижаси"], [k.passPct == null ? "—" : k.passPct + "%", "тестдан ўтганлар"],
      [nf(k.certs), `сертификат · 🥇 ${k.gold} · 🥈 ${k.silver} · 🥉 ${k.bronze}`]
    ]);
    $("#tCourses").innerHTML = table(["Курс", "#Ўқувчилар", "#Тугатилган дарслар", "#Тест топширди", "Ўртача натижа", "Ўтганлар", "#Сертификат"],
      results.courses.map((c) => `<tr><td>${esc(courseName(c.cid))}</td><td class="num">${nf(c.learners)}</td><td class="num">${nf(c.done)}</td><td class="num">${nf(c.examPeople)}</td><td class="nw">${pctMeter(c.examAvg, c.examAvg >= results.pass)}</td><td class="nw">${pctMeter(c.passPct, true)}</td><td class="num">${nf(c.certs)}</td></tr>`),
      "Бу даврда курслар ўқилмаган.");
    const q = $("#rSearch").value.trim().toLowerCase(), sort = $("#rSort").value;
    const best = (p) => Math.max(-1, ...p.exams.map((e) => e.best));
    const list = results.people.filter((p) => !q || `${p.name} ${p.email} ${p.vid} ${p.place} ${p.device}`.toLowerCase().includes(q))
      .sort((a, b) => (sort === "exam" ? best(b) - best(a) : sort === "qa" ? b.qaOk - a.qaOk : sort === "last" ? b.last - a.last : b.done - a.done || b.qaN - a.qaN));
    $("#tResults").innerHTML = table(["Ким", "Босқич", "#Тугатилган дарс", "Тест жавоблари", "Якуний тестлар", "#Сертификат", "Ҳудуд · қурилма", "Охирги фаоллик"],
      list.slice(0, 500).map((p) => `<tr><td>${personCell(p)}</td><td>${esc(STAGE[p.stage || "?"])}${p.ag ? `<br><small class="muted">${esc(p.ag)} ёш</small>` : ""}</td><td class="num">${p.done}<br><small class="muted">очди: ${p.opened}</small></td>
        <td class="nw">${p.qaN ? pctMeter(p.qaPct, p.qaPct >= 70) + `<br><small class="muted">${p.qaOk} / ${p.qaN}</small>` : "—"}</td>
        <td>${p.exams.length ? p.exams.map((e) => `<span class="tag ${e.best >= results.pass ? "ok" : "warn"}" title="${e.tries} марта топширди">${esc(courseName(e.cid))}: ${e.best}%</span>`).join(" ") : "—"}</td>
        <td class="num">${p.certs || "—"}</td><td>${placeHtml(p.place)}<br>${devHtml(p.device)}</td><td>${fmt(p.last)}</td></tr>`),
      "Бу даврда ҳеч ким дарс ёки тест топширмаган.");
  }

  /* ---------- Бир одам тафсилоти ---------- */
  async function openPerson(q) {
    const d = await api("/api/admin/person?" + q);
    const u = d.user;
    $("#pTitle").textContent = u ? `${u.name} · ${u.email}` : `Меҳмон қурилмаси ${short(d.vid)}`;
    const secTotals = {};
    d.visits.forEach((v) => Object.entries(v.sec || {}).forEach(([k, s]) => (secTotals[k] = (secTotals[k] || 0) + s)));
    const total = Object.values(secTotals).reduce((a, b) => a + b, 0);
    const pt = purposeTotals(Object.fromEntries(Object.entries(secTotals).map(([k, s]) => [k, { secs: s }])));
    const yr = new Date().getFullYear();
    const blocked = u ? u.blocked : d.vidBlocked;
    const lastV = d.visits[0];
    $("#pBody").innerHTML = `
      <div class="kpis">
        <div class="kpi"><b>${d.visits.length}</b><span>ташриф</span></div>
        <div class="kpi"><b>${dur(total)}</b><span>жами вақт</span></div>
        ${u ? `<div class="kpi"><b>${u.loginCount}</b><span>ҳисобга кириш</span></div><div class="kpi"><b>${u.by ? yr - u.by : "—"}</b><span>ёши</span></div><div class="kpi"><b>${u.approved}</b><span>тасдиқланган харита хабари</span></div>` : ""}
      </div>
      <p>${blocked ? `<span class="tag bad">Блокланган ${fmt(blocked.at)}${blocked.reason ? ": " + esc(blocked.reason) : ""}</span>` : `<span class="tag ok">Фаол</span>`} ${u ? `· Рўйхатдан ўтган: ${fmt(u.createdAt)} · Охирги кириш: ${fmt(u.lastLogin)}` : `· Код: <span class="mono">${esc(d.vid)}</span>`}</p>
      ${lastV ? `<p class="small">Охирги марта: ${placeHtml(lastV.place)} · ${devHtml(lastV.device)} · <span class="mono">${esc(lastV.ip)}</span></p>` : ""}
      <div class="acts" style="margin-bottom:14px">${u ? actBtns("user", u.id, !!u.blocked, u.name + " · " + u.email) : actBtns("vid", d.vid, !!d.vidBlocked, "Меҳмон " + short(d.vid))}</div>
      ${resultsHtml(d.results)}
      <div class="split"><div><h2>Нима мақсадда</h2><div id="pPurp"></div></div><div><h2>Бўлимлар</h2><div id="pSecs"></div></div></div>
      <h2 style="margin-top:16px">Ташрифлар</h2>
      <div class="table">${table(["Кирди", "Чиқди", "#Вақт", "Йўл", "Ҳудуд · қурилма · IP"], d.visits.map((v) => `<tr><td>${fmt(v.start)}</td><td>${v.ended ? fmt(v.last) : `<span class="tag ok">сайтда</span>`}</td><td class="num">${dur(v.secs)}</td><td>${pathHtml(v.path)}</td><td>${whereHtml(v)}</td></tr>`), "Ташриф ёзилмаган.")}</div>
      ${u ? `<h2 style="margin-top:16px">Кирди-чиқди</h2><div class="table">${table(["Вақт", "Ҳодиса", "Ҳудуд · қурилма · IP"], d.events.map((e) => { const [c, l] = EVENTS[e.type] || ["", e.type]; return `<tr><td>${fmt(e.at)}</td><td><span class="tag ${c}">${esc(l)}</span></td><td>${whereHtml(e)}</td></tr>`; }), "Ҳодиса йўқ.")}</div>` : ""}`;
    const ptot = Object.values(pt).reduce((a, b) => a + b, 0) || 1;
    bars($("#pPurp"), Object.entries(pt).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ n: PURPOSES[k][0], v, c: PURPOSES[k][1], pct: Math.round((v / ptot) * 100) })), { f: (i) => `${dur(i.v)} · ${i.pct}%` });
    bars($("#pSecs"), Object.entries(secTotals).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => ({ n: secName(k), v, c: PURPOSES[purposeOf(k)][1] })), { f: (i) => dur(i.v) });
    if (!$("#person").open) $("#person").showModal();
  }

  /* ---------- Тасдиқлаш ойнаси ---------- */
  /* pay.js (Тўловлар бўлими) шу ёрдамчилардан фойдаланади */
  window.EkoAdmin = { api: (u, b) => api(u, b), esc, nf, fmt, toast: (m) => toast(m), kpis: (el, l) => kpis(el, l), bars: (el, i, o) => bars(el, i, o), table: (h, r, e) => table(h, r, e), line: (el, d, sr, h) => lineChart(el, d, sr, h), who: (n, e, x) => who(n, e, x), confirm: (t, x, r) => confirmBox(t, x, r), person: (q) => openPerson(q) };
  function confirmBox(title, text, withReason) {
    const dlg = $("#confirm");
    $("#cTitle").textContent = title; $("#cText").textContent = text;
    $("#cReasonRow").hidden = !withReason; $("#cReason").value = "";
    dlg.returnValue = "";
    dlg.showModal();
    return new Promise((resolve) => dlg.addEventListener("close", () => resolve(dlg.returnValue === "yes" ? { reason: $("#cReason").value.trim() } : null), { once: true }));
  }

  document.addEventListener("click", async (e) => {
    const b = e.target.closest("button, a");
    if (!b) return;
    try {
      if (b.dataset.personUser) return await openPerson("user=" + encodeURIComponent(b.dataset.personUser));
      if (b.dataset.personVid) return await openPerson("vid=" + encodeURIComponent(b.dataset.personVid));
      if (b.dataset.block) {
        const kind = b.dataset.block, txt = { user: "Ҳисоб блокланади: у дарҳол чиқариб юборилади ва қайта кира олмайди.", vid: "Бу қурилмада платформа очилмай қолади.", ip: "Бу IP манзилдан платформа умуман очилмайди." }[kind];
        const ok = await confirmBox(`⛔ Блоклаш: ${b.dataset.label || b.dataset.id}`, txt, true);
        if (!ok) return;
        await api("/api/admin/block", { kind, id: b.dataset.id, reason: ok.reason, on: true });
        toast("Блокланди"); return reloadAll();
      }
      if (b.dataset.unblock) {
        await api("/api/admin/block", { kind: b.dataset.unblock, id: b.dataset.id, on: false });
        toast("Блокдан чиқарилди"); return reloadAll();
      }
      if (b.dataset.del) {
        const kind = b.dataset.del;
        const ok = await confirmBox(`🗑️ Платформадан ўчириш: ${b.dataset.label || b.dataset.id}`, kind === "user" ? "Ҳисоб ва унинг барча маълумотлари (журнал, ташрифлар, харита хабарлари, синфлари) бутунлай ўчирилади. Буни қайтариб бўлмайди. Яна рўйхатдан ўтмаслиги учун аввал блоклаш тавсия этилади." : "Бу қурилманинг барча ташриф ёзувлари ўчирилади. Буни қайтариб бўлмайди.", false);
        if (!ok) return;
        await api("/api/admin/delete", { kind, id: b.dataset.id });
        $("#person").close();
        toast("Ўчирилди"); return reloadAll();
      }
      if (b.dataset.rep) {
        if (b.dataset.rep === "delete" && !(await confirmBox("Хабарни ўчириш", "Бу хабар бутунлай ўчирилади.", false))) return;
        await api("/api/admin/reports/" + b.dataset.id, { action: b.dataset.rep });
        reports = (await api("/api/admin/reports")).reports; renderReports(); return;
      }
    } catch (err) { if (err.message !== "auth") toast(err.message); }
  });

  /* ---------- Юклаш ---------- */
  async function loadOverview() {
    overview = await api("/api/admin/overview");
    $("#bOnline").textContent = overview.guests.length;
    $("#updated").textContent = "Янгиланди: " + new Date(overview.now).toLocaleTimeString("ru-RU");
  }
  async function loadStats() {
    stats = await api("/api/admin/stats?days=" + $("#range").value);
  }
  async function loadRecent() {
    recent = (await api("/api/admin/visits?days=" + $("#range").value)).visits;
  }
  async function loadSecurity() { security = await api("/api/admin/security"); }
  async function loadReports() { reports = (await api("/api/admin/reports")).reports; }

  function renderAll() { renderDash(); renderOnline(); renderPeople(); renderJournal(); renderStats(); renderResults(); renderBlocks(); renderReports(); renderFeedback(); renderGrowth(); renderSystem(); }
  async function reloadAll() {
    try {
      await Promise.all([loadOverview(), loadStats(), loadSecurity(), loadReports(), loadFeedback(), loadGrowth(), loadSystem(), loadResults()]);
      renderAll();
      if (window.EkoPay) EkoPay.load();
      if (tab === "journal") { await loadRecent(); renderJournal(); }
    } catch (e) { if (e.message !== "auth") toast(e.message); }
  }
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(async () => {
      if (document.visibilityState !== "visible" || $("#appView").hidden) return;
      try { await loadOverview(); renderOnline(); if (tab === "dash") { await loadStats(); renderDash(); } } catch (e) { /* ignore */ }
    }, 15000);
  }

  const TITLES = { dash: "Умумий ҳолат", online: "Ҳозир онлайн", people: "Фойдаланувчилар", journal: "Кирди-чиқди журнали", stats: "Статистик таҳлил", results: "Ўқувчилар натижалари", growth: "Ўсиш ва ўқиш", system: "Тизим ва хатолар", blocks: "Блок ва хавфсизлик", reports: "Эко-харита модерацияси", feedback: "Фикр-мулоҳазалар", community: "Эълонлар ва турнир", pay: "Тўловлар ва PRO" };
  $("#tabs").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    tab = b.dataset.tab;
    $$("#tabs button").forEach((x) => x.classList.toggle("on", x === b));
    try { b.scrollIntoView({ block: "nearest", inline: "center" }); } catch (err) { /* ignore */ }
    $$("[data-view]").forEach((s) => (s.hidden = s.dataset.view !== tab));
    $("#title").textContent = TITLES[tab];
    try { history.replaceState(null, "", "#" + tab); } catch (err) { /* ignore */ }
    if (tab === "journal") { try { await loadRecent(); renderJournal(); } catch (err) { /* ignore */ } }
    if (tab === "system") { try { await loadSystem(); renderSystem(); } catch (err) { /* ignore */ } }
    if (tab === "growth") { try { await loadGrowth(); renderGrowth(); } catch (err) { /* ignore */ } }
    if (tab === "results") { try { await loadResults(); renderResults(); } catch (err) { /* ignore */ } }
    if (tab === "feedback") { try { await loadFeedback(); renderFeedback(); } catch (err) { /* ignore */ } }
    if (tab === "community") { try { await loadCommunity(); renderCommunity(); } catch (err) { /* ignore */ } }
    if (tab === "pay" && window.EkoPay) EkoPay.load();
  });
  $("#newsForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    try {
      await api("/api/admin/news", { title: f.title.value, body: f.body.value, link: f.link.value, stage: f.stage.value, days: +f.days.value, pinned: f.pinned.checked });
      f.reset(); toast("Эълон қилинди"); await loadCommunity($("#trWeek").value); renderCommunity();
    } catch (err) { if (err.message !== "auth") toast(err.message); }
  });
  $("#newsList").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-nw]"); if (!b) return;
    if (b.dataset.nw === "delete" && !(await confirmBox("Эълонни ўчириш", "Эълон платформадан олиб ташланади. Давом этасизми?"))) return;
    try { await api("/api/admin/news/" + b.dataset.id, { action: b.dataset.nw }); await loadCommunity($("#trWeek").value); renderCommunity(); }
    catch (err) { if (err.message !== "auth") toast(err.message); }
  });
  $("#trWeek").addEventListener("change", async (e) => { try { await loadCommunity(e.target.value); renderCommunity(); } catch (err) { /* ignore */ } });
  $("#trList").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-trh]"); if (!b) return;
    try { await api("/api/admin/turnir/hide", { week: trData.week, id: b.dataset.trh }); await loadCommunity(trData.week); renderCommunity(); }
    catch (err) { if (err.message !== "auth") toast(err.message); }
  });
  $("#range").addEventListener("change", async () => { await Promise.all([loadStats(), loadGrowth(), loadResults()]); renderAll(); if (tab === "journal") { await loadRecent(); renderJournal(); } });
  $("#refresh").addEventListener("click", reloadAll);
  ["#pSearch", "#pKind"].forEach((s) => $(s).addEventListener("input", renderPeople));
  ["#jSearch", "#jType"].forEach((s) => $(s).addEventListener("input", renderJournal));
  ["#rSearch", "#rSort"].forEach((s) => $(s).addEventListener("input", renderResults));
  $("#expResults").href = "/api/admin/export?type=results";
  $("#repStatus").addEventListener("change", renderReports);
  ["#fbState", "#fbKind", "#fbRate", "#fbSec"].forEach((s) => $(s).addEventListener("change", () => { fbShow = 50; renderFeedback(); }));
  $("#fbSearch").addEventListener("input", () => { fbShow = 50; renderFeedback(); });
  $("#expFeedback").href = "/api/admin/export?type=feedback";
  $("#fbReadAll").addEventListener("click", async () => {
    try { const r = await api("/api/admin/feedback/read-all", {}); toast(`${r.count} та мулоҳаза ўқилди деб белгиланди`); await loadFeedback(); renderFeedback(); }
    catch (err) { if (err.message !== "auth") toast(err.message); }
  });
  $("#fbList").addEventListener("click", async (e) => {
    const t = e.target;
    if (t.id === "fbMore") { fbShow += 50; renderFeedback(); return; }
    const p = t.closest("[data-fbp]");
    if (p) { e.preventDefault(); try { await openPerson(p.dataset.fbp); } catch (err) { if (err.message !== "auth") toast(err.message); } return; }
    const rb = t.closest("[data-fbreply]");
    if (rb) { const f = $(`[data-fbform="${rb.dataset.fbreply}"]`); f.hidden = !f.hidden; if (!f.hidden) f.querySelector("textarea").focus(); return; }
    if (t.closest("[data-fbcancel]")) { t.closest("form").hidden = true; return; }
    const b = t.closest("[data-fb]");
    if (!b) return;
    if (b.dataset.fb === "delete" && !(await confirmBox("Мулоҳазани ўчириш", "Бу мулоҳаза бутунлай ўчирилади. Давом этасизми?"))) return;
    try { await api("/api/admin/feedback/" + b.dataset.id, { action: b.dataset.fb }); await loadFeedback(); renderFeedback(); }
    catch (err) { if (err.message !== "auth") toast(err.message); }
  });
  $("#fbList").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target.closest("[data-fbform]");
    if (!f) return;
    try { await api("/api/admin/feedback/" + f.dataset.fbform, { action: "reply", text: f.querySelector("textarea").value }); toast("Жавоб сақланди"); await loadFeedback(); renderFeedback(); }
    catch (err) { if (err.message !== "auth") toast(err.message); }
  });
  $("#expUsers").href = "/api/admin/export?type=users";
  $("#expEvents").href = "/api/admin/export?type=events";
  $("#expVisits").href = "/api/admin/export?type=visits";
  $("#pClose").addEventListener("click", () => $("#person").close());
  $("#ipForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await api("/api/admin/block", { kind: "ip", id: $("#ipVal").value.trim(), reason: $("#ipReason").value.trim(), on: true });
      e.target.reset(); toast("IP блокланди"); reloadAll();
    } catch (err) { if (err.message !== "auth") toast(err.message); }
  });

  /* ---------- Кириш ---------- */
  function showLogin() { $("#appView").hidden = true; $("#loginView").hidden = false; clearInterval(timer); $("#pw").focus(); }
  async function showApp() {
    $("#loginView").hidden = true; $("#appView").hidden = false;
    const h = location.hash.slice(1);
    if (TITLES[h]) $(`#tabs [data-tab="${h}"]`).click();
    await reloadAll(); startTimer();
  }
  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button"); btn.disabled = true; $("#loginErr").textContent = "";
    try {
      await api("/api/admin/login", { password: $("#pw").value, code: $("#code").value.replace(/\s/g, "") });
      e.target.reset(); await showApp();
    } catch (err) {
      $("#loginErr").textContent = err.message;
      if (err.data && err.data.needCode) { $("#codeRow").hidden = false; $("#code").focus(); }
    } finally { btn.disabled = false; }
  });
  $("#logout").addEventListener("click", async () => { await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }).catch(() => {}); showLogin(); });

  fetch("/api/admin/config", { credentials: "same-origin" }).then((r) => r.json()).then((c) => {
    $("#codeRow").hidden = !c.totp;
    if (!c.ready) $("#loginErr").textContent = "Серверда ADMIN_PASSWORD созланмаган.";
    if (c.authed) showApp(); else showLogin();
  }).catch(() => showLogin());
})();
