/* Экомун — Бошқарув маркази: стартап воситалари.
   • «Сўровнома» (Tally ўрнига): NPS, PMF (Шон Эллис тести), нарх ва B2B гипотезалари, эркин жавоблар, CSV.
   • «UX харита» (Hotjar ўрнига): бўлимлар бўйича кликлар, жаҳл/бефойда кликлар, айланиш чуқурлиги,
     клик харитаси (сайт саҳифаси устида, агар админ сайт билан бир доменда бўлса), сессия йўллари.
   • «Pitch deck» (DocSend ўрнига): PDF юклаш, инвесторга алоҳида ҳавола, ким қайси саҳифада қанча турди.
   Сервер: startap.js. Саволлар: sorov-data.js (= /vendor/eko-sorov-data.js). */
"use strict";
(() => {
  const A = window.EkoAdmin;
  if (!A) return;
  const $ = (s) => document.querySelector(s);
  const { esc, nf, fmt } = A;
  const err = (e) => { if (e.message !== "auth") A.toast(e.message); };
  const S = window.EKO_SOROV || { questions: [] };
  const uz = (o) => (o && typeof o === "object" ? o.uz : o || "");
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const sec = (ms) => { const s = Math.round(ms / 1000); return s < 60 ? s + " с" : Math.floor(s / 60) + " дақ " + (s % 60) + " с"; };
  const DCN = { m: "📱 Телефон", t: "📟 Планшет", d: "💻 Компьютер" };
  const DCW = { m: 390, t: 820, d: 1280 };
  const STG = { maktab: "🎒 Мактаб", uni: "🎓 Университет", "": "Профилсиз" };
  const csvCell = (v) => { const s = String(v ?? ""); return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  function download(name, text, type = "text/csv;charset=utf-8") {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + text], { type }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* =================== Сўровнома =================== */
  let sv = null;
  async function loadSorov() { try { sv = await A.api("/api/admin/survey"); renderSorov(); } catch (e) { err(e); } }
  function svFiltered() {
    const st = $("#svStage").value, role = $("#svRole").value, ver = $("#svVer").value;
    return sv.responses.filter((r) => (!st || r.stage === st) && (!role || r.ans.role === role) && (!ver || r.sv === ver));
  }
  function renderSorov() {
    if (!sv) return;
    const roleQ = S.questions.find((q) => q.id === "role");
    if ($("#svRole").options.length < 2 && roleQ) $("#svRole").insertAdjacentHTML("beforeend", roleQ.opts.map(([k, l]) => `<option value="${esc(k)}">${esc(uz(l))}</option>`).join(""));
    const vers = [...new Set(sv.responses.map((r) => r.sv))];
    if ($("#svVer").options.length !== vers.length + 1) $("#svVer").innerHTML = `<option value="">Барча версиялар</option>` + vers.map((v) => `<option value="${esc(v)}" ${v === S.id ? "selected" : ""}>${esc(v)}</option>`).join("");
    const list = svFiltered(), n = list.length;
    const has = (id) => list.filter((r) => r.ans[id] != null);
    const npsL = has("nps"), prom = npsL.filter((r) => r.ans.nps >= 9).length, det = npsL.filter((r) => r.ans.nps <= 6).length;
    const nps = npsL.length ? Math.round(((prom - det) / npsL.length) * 100) : null;
    const pmfL = has("pmf"), pmf = pmfL.length ? pct(pmfL.filter((r) => r.ans.pmf === "very").length, pmfL.length) : null;
    const payL = has("pay"), payers = payL.filter((r) => ["10", "25", "50"].includes(r.ans.pay)).length, p25 = payL.filter((r) => ["25", "50"].includes(r.ans.pay)).length;
    const b2bL = has("b2b"), b2b = b2bL.length ? pct(b2bL.filter((r) => r.ans.b2b === "yes").length, b2bL.length) : null;
    A.kpis($("#svKpis"), [[nf(n), "жавоб"], [nps == null ? "—" : (nps > 0 ? "+" : "") + nps, `NPS (${npsL.length} та баҳо)`, nps != null && nps >= 30],
      [pmf == null ? "—" : pmf + "%", "«жуда хафа бўламан» (PMF, мақсад ≥ 40%)", pmf != null && pmf >= 40],
      [payL.length ? pct(payers, payL.length) + "%" : "—", "PRO учун тўлашга тайёр"], [b2b == null ? "—" : b2b + "%", "ташкилотига таклиф қилади"]]);
    /* Бизнес гипотезалари */
    const roles = has("role"), teach = pct(roles.filter((r) => r.ans.role === "teacher").length, roles.length);
    const tg = pct(has("source").filter((r) => r.ans.source === "telegram" || r.ans.source === "teacher").length, has("source").length);
    const H = [
      ["Маҳсулот бозорга мос (PMF): «жуда хафа бўламан» ≥ 40%", pmf, 40, pmfL.length],
      ["Фойдаланувчилар тавсия қилади: NPS ≥ 30", nps, 30, npsL.length],
      ["PRO 25 000 сўм нархи: ≥ 20% «25 000 ва ундан кўп» деб жавоб беради", payL.length ? pct(p25, payL.length) : null, 20, payL.length],
      ["B2B: ≥ 30% ўз мактаби/ташкилотига таклиф қилади", b2b, 30, b2bL.length],
      ["Ўқитувчилар — асосий тарқатувчи: жавоб берганларнинг ≥ 15% ўқитувчи", roles.length ? teach : null, 15, roles.length],
      ["Telegram ва ўқитувчи — асосий канал: ≥ 50% шулардан келган", has("source").length ? tg : null, 50, has("source").length]
    ];
    $("#svHyp").innerHTML = A.table(["Гипотеза", "#Натижа", "#Жавоблар", "Ҳолат"], H.map(([t, v, goal, cnt]) => {
      const ok = v != null && v >= goal, few = cnt < 30;
      return `<tr><td>${esc(t)}</td><td class="num"><b>${v == null ? "—" : v + (t.includes("NPS") ? "" : "%")}</b></td><td class="num">${nf(cnt)}</td>
        <td>${v == null ? `<span class="tag">маълумот йўқ</span>` : few ? `<span class="tag warn">${ok ? "✓" : "✗"} кам (n &lt; 30)</span>` : ok ? `<span class="tag ok">✓ тасдиқланди</span>` : `<span class="tag bad">✗ тасдиқланмади</span>`}</td></tr>`;
    }), "");
    /* Ҳар бир савол бўйича */
    $("#svCharts").innerHTML = S.questions.filter((q) => q.type !== "text").map((q) => `<div class="card"><h2>${esc(uz(q.q))}</h2><div data-svq="${esc(q.id)}"></div></div>`).join("");
    for (const q of S.questions.filter((x) => x.type !== "text")) {
      const el = $(`[data-svq="${q.id}"]`), cnt = {};
      let tot = 0;
      for (const r of list) {
        const v = r.ans[q.id];
        if (v == null) continue;
        tot++;
        for (const k of Array.isArray(v) ? v : [v]) cnt[k] = (cnt[k] || 0) + 1;
      }
      const items = q.type === "scale"
        ? Array.from({ length: q.max - q.min + 1 }, (_, i) => i + q.min).map((x) => ({ n: String(x), v: cnt[x] || 0, c: x <= 6 ? "#ef4444" : x >= 9 ? "#16a34a" : "#eab308" }))
        : q.opts.map(([k, l]) => ({ n: uz(l), v: cnt[k] || 0 }));
      A.bars(el, tot ? items : [], { f: (i) => `${nf(i.v)} · ${pct(i.v, tot)}%` });
    }
    const texts = list.filter((r) => S.questions.some((q) => q.type === "text" && r.ans[q.id]));
    $("#svTexts").innerHTML = A.table(["Сана", "Ким", "Жавоб", ""], texts.slice(0, 300).map((r) => {
      const role = roleQ && roleQ.opts.find(([k]) => k === r.ans.role);
      return `<tr><td>${fmt(r.at)}</td><td class="small">${esc(role ? uz(role[1]) : "—")}<br><span class="muted">${esc(STG[r.stage] || "")} · ${esc(r.place || "")}</span></td>
        <td>${S.questions.filter((q) => q.type === "text" && r.ans[q.id]).map((q) => esc(r.ans[q.id].t || r.ans[q.id])).join("<br>")}</td>
        <td class="acts"><button class="btn sm ghost" data-svdel="${esc(r.id)}" title="Ўчириш">🗑️</button></td></tr>`;
    }), "Ҳали эркин жавоб йўқ.");
  }
  ["#svStage", "#svRole", "#svVer"].forEach((s) => $(s).addEventListener("change", renderSorov));
  $("#svTexts").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-svdel]"); if (!b) return;
    if (!(await A.confirm("Жавобни ўчириш", "Бу жавоб натижалардан бутунлай олиб ташланади.", false))) return;
    try { await A.api("/api/admin/survey/delete", { id: b.dataset.svdel }); await loadSorov(); } catch (x) { err(x); }
  });
  $("#svCsv").addEventListener("click", () => {
    if (!sv) return;
    const qs = S.questions;
    const rows = [["sana", "versiya", "bosqich", "til", "qurilma", "hudud", ...qs.map((q) => q.id)].join(";")];
    for (const r of svFiltered()) {
      rows.push([new Date(r.at).toISOString(), r.sv, r.stage, r.lang, r.dev, r.place, ...qs.map((q) => {
        const v = r.ans[q.id];
        return csvCell(v == null ? "" : Array.isArray(v) ? v.join("|") : typeof v === "object" ? v.t : v);
      })].map(csvCell).join(";"));
    }
    download(`ekomun-sorovnoma-${new Date().toISOString().slice(0, 10)}.csv`, rows.join("\n"));
  });
  $("#svLink").textContent = location.origin + "/#sorov";

  /* =================== UX харита =================== */
  let ux = null, frameSeq = 0;
  const secName = (s) => (s === "ui" ? "Юқори/пастки панел, ойналар" : s === "bosh" ? "Бош саҳифа" : "#" + s);
  /* Бўлим қайси босқичда кўринади (мактаб бўлимлари сохта «мактаб» профили билан очилади) */
  const secStage = {};
  async function loadUx() {
    const p = new URLSearchParams({ days: $("#range").value || 30 });
    if ($("#uxDc").value) p.set("dc", $("#uxDc").value);
    if ($("#uxSec").value) p.set("sec", $("#uxSec").value);
    try { ux = await A.api("/api/admin/ux?" + p); renderUx(); } catch (e) { err(e); }
  }
  function renderUx() {
    const d = ux;
    A.kpis($("#uxKpis"), [[nf(d.totalClicks), "клик"], [nf(d.sessions), "сессия йўли"], [sec(d.avgSessionMs), "ўртача сессия"], [d.avgDepth, "бўлим / сессия"],
      [nf(d.rage), "😤 жаҳл кликлари", d.rage > 0], [nf(d.dead), "🫥 бефойда кликлар", d.dead > 0]]);
    const cur = $("#uxSec").value;
    $("#uxSec").innerHTML = `<option value="">— бўлимни танланг —</option>` + d.sections.filter((s) => s.clicks).map((s) => `<option value="${esc(s.sec)}" ${s.sec === cur ? "selected" : ""}>${esc(secName(s.sec))} (${nf(s.clicks)})</option>`).join("");
    $("#uxSecs").innerHTML = A.table(["Бўлим", "#Кўришлар", "#Ўртача вақт", "#Чуқурлик", "Охиригача (25/50/75/100%)", "#Кликлар", "#😤", "#🫥", ""], d.sections.slice(0, 80).map((s) => {
      const tot = s.b.reduce((a, b) => a + b, 0) || 1;
      return `<tr><td><b>${esc(secName(s.sec))}</b></td><td class="num">${nf(s.views)}</td><td class="num">${s.views ? sec(s.avgMs) : "—"}</td><td class="num">${s.views ? s.depth + "%" : "—"}</td>
        <td><span class="ux-depth" title="${s.b.map((v, i) => `${(i + 1) * 25}%: ${v}`).join(", ")}">${s.b.map((v, i) => `<i style="width:${((v / tot) * 100).toFixed(1)}%;opacity:${0.35 + i * 0.2}"></i>`).join("")}</span></td>
        <td class="num">${nf(s.clicks)}</td><td class="num">${s.rage ? `<b class="bad-t">${nf(s.rage)}</b>` : "0"}</td><td class="num">${s.dead ? `<b class="warn-t">${nf(s.dead)}</b>` : "0"}</td>
        <td>${s.clicks ? `<button class="btn sm ghost" data-uxsec="${esc(s.sec)}">🔥 Харита</button>` : ""}</td></tr>`;
    }), "Ҳали маълумот йўқ. Фойдаланувчилар сайтда юрганда кликлар шу ерда пайдо бўлади.");
    const tl = (arr) => arr.map((x) => ({ n: x.t || x.k, v: x.n != null ? x.n : x.v }));
    $("#uxSecName").textContent = d.sec ? secName(d.sec) : "бўлимни танланг";
    if (d.sec) {
      A.bars($("#uxTop"), tl(d.targets));
      $("#uxBad").innerHTML = `<h3 class="small">😤 Жаҳл билан кўп босилган</h3><div id="uxRage"></div><h3 class="small">🫥 Босилди, лекин ҳеч нарса бўлмади</h3><div id="uxDead"></div>`;
      A.bars($("#uxRage"), tl(d.rageTargets).map((x) => ({ ...x, c: "#ef4444" })));
      A.bars($("#uxDead"), tl(d.deadTargets).map((x) => ({ ...x, c: "#a3a3a3" })));
    } else {
      $("#uxTop").innerHTML = `<p class="empty">Юқоридаги жадвалдан бўлимни танланг.</p>`; $("#uxBad").innerHTML = "";
    }
    A.bars($("#uxTrans"), d.transitions.map((x) => ({ n: x.k.split("→").map(secName).join(" → "), v: x.v })));
    $("#uxExits").innerHTML = `<h3 class="small">Қаердан келишди (utm_source ёки сайт)</h3><div id="uxSrc"></div><h3 class="small">Кириш</h3><div id="uxEn"></div><h3 class="small">Чиқиб кетиш (сессиянинг охирги бўлими)</h3><div id="uxEx"></div>`;
    A.bars($("#uxSrc"), (d.sources || []).map((x) => ({ n: x.k, v: x.v, c: "#7c3aed" })));
    A.bars($("#uxEn"), d.entries.map((x) => ({ n: secName(x.k), v: x.v })));
    A.bars($("#uxEx"), d.exits.map((x) => ({ n: secName(x.k), v: x.v, c: "#f97316" })));
    $("#uxSess").innerHTML = A.table(["Вақт", "Қурилма", "Йўл (бўлим · вақт)"], d.recent.map((s) => `<tr><td>${fmt(s.t)}</td><td class="small">${esc(DCN[s.dc] || "")}<br><span class="muted">${esc(STG[s.stage] || "")} · ${esc(s.dev || "")}</span></td>
      <td class="small">${s.p.map((x) => `<span class="ux-step">${esc(secName(x[0]))} <i>${sec(x[1])}</i></span>`).join(" → ")}</td></tr>`), "Ҳали сессия йўқ.");
    drawHeat();
  }

  /* Клик харитаси: сайт саҳифаси (iframe) устида иссиқлик қатлами */
  function drawHeat() {
    const box = $("#uxHeat"), d = ux;
    if (!d || !d.sec || !d.points.length) { box.innerHTML = `<p class="empty">${d && d.sec ? "Бу бўлимда танланган даврда клик йўқ." : "Харитани кўриш учун бўлимни танланг."}</p>`; return; }
    const counts = { m: 0, t: 0, d: 0 };
    d.points.forEach((p) => counts[p[0]]++);
    const dc = d.dc || Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    const pts = d.points.filter((p) => p[0] === dc);
    const W = DCW[dc], my = ++frameSeq;
    const showPage = $("#uxShowPage").checked && d.sec !== "ui";
    const maxY = Math.max(400, ...pts.map((p) => p[2])) + 60;
    box.innerHTML = `<p class="small muted">${esc(DCN[dc])} кўриниши (эни ${W} px) · ${nf(pts.length)} клик${d.dc ? "" : " · қурилма танланмагани учун энг кўп учрагани кўрсатилди"}. 🔴 доира — жаҳл, ⚪ доира — бефойда клик.</p>
      <div class="ux-wrap"><div class="ux-stage" style="width:${W}px"><div class="ux-page"></div><canvas width="${W}" height="${maxY}"></canvas></div></div>`;
    const stage = box.querySelector(".ux-stage"), cv = box.querySelector("canvas"), wrap = box.querySelector(".ux-wrap");
    const fit = (h) => { const s = Math.min(1, wrap.clientWidth / W); stage.style.transform = `scale(${s})`; wrap.style.height = Math.ceil(h * s) + "px"; };
    let offY = 0;
    const paint = (h) => {
      cv.height = h; fit(h);
      const g = cv.getContext("2d");
      /* Иссиқлик: аввал шаффоф доғлар, кейин рангга айлантириш */
      const off = document.createElement("canvas"); off.width = W; off.height = h;
      const o = off.getContext("2d");
      const r = dc === "m" ? 22 : 28;
      for (const p of pts) {
        const x = (p[1] / 1000) * W, y = offY + p[2];
        const gr = o.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, "rgba(0,0,0,0.18)"); gr.addColorStop(1, "rgba(0,0,0,0)");
        o.fillStyle = gr; o.fillRect(x - r, y - r, r * 2, r * 2);
      }
      const img = o.getImageData(0, 0, W, h), px = img.data;
      for (let i = 0; i < px.length; i += 4) {
        const a = px[i + 3] / 255;
        if (!a) continue;
        const t = Math.min(1, a * 1.6);
        const [R, G, B] = t < 0.33 ? [0, Math.round(t * 3 * 255), 255] : t < 0.66 ? [Math.round((t - 0.33) * 3 * 255), 255, Math.round(255 - (t - 0.33) * 3 * 255)] : [255, Math.round(255 - (t - 0.66) * 3 * 255), 0];
        px[i] = R; px[i + 1] = G; px[i + 2] = B; px[i + 3] = Math.round(Math.min(0.85, 0.25 + t * 0.7) * 255);
      }
      g.clearRect(0, 0, W, h); g.putImageData(img, 0, 0);
      g.lineWidth = 2.5;
      for (const p of pts) {
        if (!(p[3] & 3)) continue;
        g.strokeStyle = p[3] & 1 ? "#dc2626" : "#737373";
        g.beginPath(); g.arc((p[1] / 1000) * W, offY + p[2], 9, 0, Math.PI * 2); g.stroke();
      }
    };
    if (!showPage) { box.querySelector(".ux-page").innerHTML = `<div class="ux-grid" style="height:${maxY}px"></div>`; paint(maxY); return; }
    paint(maxY);
    /* Сайт шу доменда бўлса — саҳифанинг ўзи остида кўрсатилади */
    const fr = document.createElement("iframe");
    fr.title = "Сайт кўриниши"; fr.setAttribute("sandbox", "allow-same-origin allow-scripts"); fr.setAttribute("tabindex", "-1");
    fr.style.width = W + "px"; fr.style.height = maxY + 200 + "px";
    fr.src = location.origin + "/?uxpreview=" + (secStage[d.sec] || "uni") + "#" + d.sec;
    box.querySelector(".ux-page").appendChild(fr);
    fr.addEventListener("load", () => setTimeout(() => {
      if (my !== frameSeq) return;
      try {
        const doc = fr.contentDocument, root = doc.documentElement, el = doc.getElementById(d.sec);
        if (!el) throw new Error("no section");
        if (el.dataset.stage === "maktab" && !secStage[d.sec]) { secStage[d.sec] = "maktab"; return drawHeat(); }
        doc.querySelectorAll(".plus-dlg, .sv-invite, #toast, .toast").forEach((x) => x.remove());
        setTimeout(() => {
          if (my !== frameSeq) return;
          const top = el.getBoundingClientRect().top + fr.contentWindow.scrollY;
          offY = Math.round(top);
          const h = Math.min(12000, Math.max(offY + maxY, offY + el.offsetHeight));
          fr.style.height = h + "px";
          paint(h);
        }, 500);
      } catch (e) {
        box.querySelector(".ux-page").innerHTML = `<div class="ux-grid" style="height:${maxY}px"></div><p class="small muted">Сайт саҳифасини кўрсатиб бўлмади (админ сайти алоҳида доменда) — фақат кликлар чизилди.</p>`;
      }
    }, 1200));
  }
  addEventListener("resize", () => { const w = $("#uxHeat .ux-wrap"), s = $("#uxHeat .ux-stage"); if (w && s) { const W = parseInt(s.style.width, 10); const k = Math.min(1, w.clientWidth / W); s.style.transform = `scale(${k})`; w.style.height = Math.ceil(s.offsetHeight * k) + "px"; } });
  $("#uxDc").addEventListener("change", loadUx);
  $("#uxSec").addEventListener("change", loadUx);
  $("#uxShowPage").addEventListener("change", drawHeat);
  $("#uxSecs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-uxsec]"); if (!b) return;
    $("#uxSec").value = b.dataset.uxsec; loadUx().then(() => $("#uxHeatCard").scrollIntoView({ behavior: "smooth", block: "start" }));
  });
  $("#uxClear").addEventListener("click", async () => {
    if (!(await A.confirm("UX маълумотларини тозалаш", "Барча кликлар, айланиш ва сессия йўллари ўчирилади. Буни қайтариб бўлмайди.", false))) return;
    try { await A.api("/api/admin/ux/clear", {}); A.toast("Тозаланди"); await loadUx(); } catch (x) { err(x); }
  });

  /* =================== Pitch deck =================== */
  let dk = null, dkSel = "";
  async function loadDeck() { try { dk = await A.api("/api/admin/deck"); renderDeck(); if (dkSel) openLink(dkSel); } catch (e) { err(e); } }
  function renderDeck() {
    const b = $("#bDeck"); b.hidden = !dk.recentViews; b.textContent = dk.recentViews;
    const views = dk.links.reduce((a, l) => a + l.views, 0), ms = dk.links.reduce((a, l) => a + l.ms, 0);
    A.kpis($("#dkKpis"), [[nf(dk.files.length), "тақдимот"], [nf(dk.links.filter((l) => l.open).length), "фаол ҳавола"], [nf(views), "очилган"], [sec(ms), "жами кўрилган вақт"], [nf(dk.recentViews), "сўнгги 24 соатда", dk.recentViews > 0]]);
    $("#dkFiles").innerHTML = A.table(["Номи", "#Ҳажм", "Юкланган", ""], dk.files.map((f) => `<tr><td><b>${esc(f.name)}</b>${f.exists ? "" : `<br><span class="tag bad">файл серверда йўқ — қайта юкланг</span>`}</td>
      <td class="num">${(f.size / 1048576).toFixed(1)} МБ</td><td>${fmt(f.at)}</td>
      <td class="acts"><button class="btn sm ghost" data-dkf="rename" data-id="${f.id}" title="Номини ўзгартириш">✏️</button><button class="btn sm ghost" data-dkf="delete" data-id="${f.id}" title="Ўчириш">🗑️</button></td></tr>`), "Ҳали PDF юкланмаган.");
    $("#dkNew").elements.deck.innerHTML = dk.files.map((f) => `<option value="${f.id}">${esc(f.name)}</option>`).join("") || `<option value="">— аввал PDF юкланг —</option>`;
    $("#dkLinks").innerHTML = A.table(["Кимга", "Ҳавола", "#Очилган", "#Одам", "#Вақт", "#Охиригача", "Охирги марта", ""], dk.links.map((l) => {
      const f = dk.files.find((x) => x.id === l.deck);
      return `<tr class="${l.token === dkSel ? "sel" : ""}"><td><b>${esc(l.label)}</b><br><small class="muted">${esc(f ? f.name : "ўчирилган тақдимот")}${l.email ? " · 📧 почта сўралади" : ""}${l.download ? " · ⬇" : ""}${l.until ? " · " + fmt(l.until) + " гача" : ""}</small></td>
        <td><code class="small mono dk-url">${esc(l.url)}</code><br><button class="btn sm ghost" data-dkl="copy" data-url="${esc(l.url)}">📋 Нусха</button> ${l.open ? `<span class="tag ok">очиқ</span>` : `<span class="tag">ёпиқ</span>`}</td>
        <td class="num">${nf(l.views)}</td><td class="num">${nf(l.people)}</td><td class="num">${sec(l.ms)}</td><td class="num">${nf(l.done)}</td><td>${l.last ? fmt(l.last) : "—"}</td>
        <td class="acts"><button class="btn sm primary" data-dkl="view" data-t="${l.token}">📊</button><button class="btn sm ghost" data-dkl="${l.on ? "off" : "on"}" data-t="${l.token}">${l.on ? "Ёпиш" : "Очиш"}</button><button class="btn sm ghost" data-dkl="delete" data-t="${l.token}" title="Ўчириш">🗑️</button></td></tr>`;
    }), "Ҳали ҳавола йўқ. Ҳар бир инвестор учун алоҳида ҳавола яратинг — шунда ким қизиққанини кўрасиз.");
  }
  async function openLink(t) {
    dkSel = t;
    try {
      const d = await A.api("/api/admin/deck/link/" + t);
      $("#dkDetail").hidden = false;
      $("#dkDetT").textContent = "📊 " + d.link.label;
      A.bars($("#dkPer"), d.per.map((p) => ({ n: p.page + "-саҳифа", v: p.avgMs, seen: p.seen })), { f: (i) => `${sec(i.v)} · ${i.seen} киши` });
      $("#dkViews").innerHTML = A.table(["Очилган", "Ким", "Қурилма, жой", "#Вақт", "#Саҳифа"], d.views.map((v) => `<tr><td>${fmt(v.at)}<br><small class="muted">охирги: ${fmt(v.last)}</small></td>
        <td>${esc(v.email || "—")}</td><td class="small">${esc(v.dev)}<br><span class="muted">${esc(v.place || "")}</span></td><td class="num">${sec(v.ms)}</td><td class="num">${v.maxPage}/${v.pages || "?"}</td></tr>`), "Ҳали ҳеч ким очмаган.");
      renderDeck();
    } catch (e) { err(e); }
  }
  $("#dkUp").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, file = f.elements.file.files[0], btn = f.querySelector("button");
    if (!file) return;
    if (file.type && file.type !== "application/pdf") return A.toast("Фақат PDF файл");
    btn.disabled = true; A.toast("Юкланмоқда…");
    try {
      const r = await fetch("/api/admin/deck/upload?name=" + encodeURIComponent(f.elements.name.value || file.name.replace(/\.pdf$/i, "")), { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/pdf" }, body: file });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Хато");
      A.toast("Юкланди"); f.reset(); await loadDeck();
    } catch (x) { err(x); } finally { btn.disabled = false; }
  });
  $("#dkFiles").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-dkf]"); if (!b) return;
    const body = { action: b.dataset.dkf };
    if (body.action === "rename") { const n = prompt("Янги номи:"); if (!n) return; body.name = n; }
    if (body.action === "delete" && !(await A.confirm("Тақдимотни ўчириш", "PDF файл ўчирилади, унинг ҳаволалари ёпилади.", false))) return;
    try { await A.api("/api/admin/deck/file/" + b.dataset.id, body); await loadDeck(); } catch (x) { err(x); }
  });
  $("#dkNew").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    try {
      const r = await A.api("/api/admin/deck/link", { deck: f.deck.value, label: f.label.value, email: f.email.checked, download: f.download.checked, days: +f.days.value, note: f.note.value });
      try { await navigator.clipboard.writeText(r.url); A.toast("Ҳавола яратилди ва нусхаланди"); } catch (x) { A.toast("Ҳавола яратилди"); }
      e.target.reset(); dkSel = r.token; await loadDeck();
    } catch (x) { err(x); }
  });
  $("#dkLinks").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-dkl]"); if (!b) return;
    const a = b.dataset.dkl;
    if (a === "copy") { try { await navigator.clipboard.writeText(b.dataset.url); A.toast("Нусхаланди"); } catch (x) { A.toast(b.dataset.url); } return; }
    if (a === "view") return openLink(b.dataset.t);
    if (a === "delete" && !(await A.confirm("Ҳаволани ўчириш", "Ҳавола ва унинг барча кўришлар тарихи ўчирилади.", false))) return;
    try { await A.api("/api/admin/deck/link/" + b.dataset.t, { action: a }); if (a === "delete" && dkSel === b.dataset.t) { dkSel = ""; $("#dkDetail").hidden = true; } await loadDeck(); } catch (x) { err(x); }
  });

  window.EkoStartap = {
    load: (tab) => (tab === "sorov" ? loadSorov() : tab === "ux" ? loadUx() : tab === "deck" ? loadDeck() : null)
  };
})();
