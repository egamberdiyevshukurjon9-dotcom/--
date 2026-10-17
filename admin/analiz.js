/* Экомун — Бошқарув маркази: «Таҳлил ва ҳисобот» бўлими.
   Барча фойдаланувчилар таҳлили (/api/admin/analytics) ва PDF / Word / CSV юклаб олиш (/api/admin/report). */
"use strict";
(() => {
  const A = window.EkoAdmin;
  if (!A) return;
  const $ = (s) => document.querySelector(s);
  const { esc, nf, fmt, dur } = A;
  const SEG = { faol: ["ok", "🟢 Фаол", "var(--c1)"], susaygan: ["warn", "🟡 Сусайган", "#eab308"], xavf: ["bad", "🟠 Кетиш хавфи", "#f97316"], nofaol: ["", "⚪ Нофаол", "var(--muted)"] };
  const SEG_HINT = { faol: "сўнгги 7 кунда", susaygan: "8–30 кун олдин", xavf: "31–90 кун олдин", nofaol: "90 кундан кўп / кирмаган" };
  const STAGE = { maktab: "🎒 Мактаб", uni: "🎓 Университет", "": "Профилсиз" };
  let data = null, show = 100, seq = 0;

  const params = () => {
    const p = new URLSearchParams({ days: $("#range").value });
    for (const [k, id] of [["stage", "#anStage"], ["kind", "#anKind"], ["seg", "#anSeg"], ["q", "#anSearch"]]) { const v = $(id).value.trim(); if (v) p.set(k, v); }
    return p;
  };
  function links() {
    const p = params();
    $("#anPdf").href = "/api/admin/report?format=pdf&" + p;
    $("#anDocx").href = "/api/admin/report?format=docx&" + p;
    $("#anCsv").href = "/api/admin/export?type=analytics&" + p;
  }
  async function load() {
    links();
    const my = ++seq;
    try {
      const d = await A.api("/api/admin/analytics?" + params());
      if (my !== seq) return; // эскироқ сўровнинг жавоби
      data = d; show = 100; render();
    } catch (e) { if (e.message !== "auth") A.toast(e.message); }
  }

  const pctOf = (v, total) => (total ? Math.round((v / total) * 100) : 0);
  const countBars = (obj, names = {}, color = "var(--c1)") => {
    const total = Object.values(obj).reduce((a, b) => a + b, 0);
    return Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ n: names[k] != null ? names[k] : k || "—", v, pct: pctOf(v, total), c: color }));
  };
  const pctF = (i) => `${nf(i.v)} · ${i.pct}%`;
  const scoreHtml = (s) => `<span class="meter${s >= 50 ? " good" : ""}"><i style="width:${s}%"></i></span><b>${s}</b>`;
  const segTag = (k) => `<span class="tag ${SEG[k][0]}">${esc(SEG[k][1])}</span>`;
  const personCell = (r) => r.userId
    ? `<button class="link" data-person-user="${esc(r.userId)}"><div class="who"><b>${esc(r.name || "—")}${r.pro ? ' <span class="tag info">PRO</span>' : ""}</b><small>${esc(r.email)}</small></div></button>`
    : `<button class="link" data-person-vid="${esc(r.vid)}"><div class="who"><b>Меҳмон <span class="mono">${esc(String(r.vid).slice(0, 8))}</span></b><small>ҳисобсиз</small></div></button>`;

  function render() {
    if (!data) return;
    const a = data, t = a.totals;
    A.kpis($("#anKpis"), [
      [nf(t.people), "жами фойдаланувчи", true], [nf(t.accounts), "рўйхатдан ўтган ҳисоб"], [nf(t.guests), "меҳмон қурилма"], [nf(t.newPeople), `янги (${a.days} кун)`],
      [nf(a.segments.faol), "фаол (сўнгги 7 кун)"], [nf(t.pro), "PRO обуначи"], [t.avgScore + " / 100", "ўртача фаоллик балли"], [dur(t.avgSecs), "бир кишига ўртача вақт"],
      [nf(t.done), "тугатилган дарс"], [t.qaPct == null ? "—" : t.qaPct + "%", "тўғри жавоблар"], [nf(t.certs), "сертификат"], [nf(t.blocked), "блокланган"]
    ]);
    $("#anInsights").innerHTML = a.insights.map((x) => `<li>${esc(x)}</li>`).join("");
    const segTotal = Object.values(a.segments).reduce((x, y) => x + y, 0);
    $("#anSegs").innerHTML = `<div class="bars">${Object.entries(a.segments).map(([k, v]) => `<button type="button" class="bar seg-btn${a.filters.seg === k ? " on" : ""}" data-seg="${k}" title="${esc(SEG_HINT[k])}"><span>${esc(SEG[k][1])}<small class="muted"> · ${esc(SEG_HINT[k])}</small></span><span class="track"><span class="fill" style="width:${segTotal ? ((v / Math.max(...Object.values(a.segments))) * 100).toFixed(1) : 0}%;background:${SEG[k][2]}"></span></span><span class="v">${nf(v)} · ${pctOf(v, segTotal)}%</span></button>`).join("")}</div>`;
    A.bars($("#anScore"), Object.entries(a.scoreBands).map(([k, v]) => ({ n: k + " балл", v, pct: pctOf(v, t.people), c: "var(--c6)" })), { f: pctF });
    A.line($("#anDaily"), a.daily, [{ k: "active", n: "Фаол одамлар", c: "var(--c1)" }, { k: "accounts", n: "Янги ҳисоблар", c: "var(--c3)" }, { k: "guests", n: "Янги меҳмонлар", c: "var(--c2)" }]);
    A.bars($("#anStages"), countBars(a.stages, STAGE, "var(--c2)"), { f: pctF });
    A.bars($("#anAges"), Object.entries(a.ages).map(([k, v]) => ({ n: k === "Номаълум" ? k : k + " ёш", v, pct: pctOf(v, t.people), c: "var(--c4)" })), { f: pctF });
    const top = Math.max(1, a.funnel[0] ? a.funnel[0].n : 1, ...a.funnel.map((s) => s.n));
    $("#anFunnel").innerHTML = `<div class="funnel">${a.funnel.map((s, i) => {
      const prev = i ? a.funnel[i - 1].n : 0, drop = i && prev && prev > s.n ? Math.round(((prev - s.n) / prev) * 100) : 0;
      return `<div class="step"><span>${esc(s.l)}</span><span class="track"><span class="fill" style="width:${((s.n / top) * 100).toFixed(1)}%;display:block"></span></span><span class="v">${nf(s.n)}${drop ? ` <span class="drop">−${drop}%</span>` : ""}</span></div>`;
    }).join("")}</div>`;
    A.bars($("#anRegions"), countBars(a.regions).slice(0, 14).map((i) => ({ ...i, n: "📍 " + i.n })), { f: pctF });
    A.bars($("#anDev"), countBars(a.devTypes, {}, "var(--c6)").map((i) => ({ ...i, n: A.devIcon(i.n) + " " + i.n })), { f: pctF });
    A.bars($("#anOs"), countBars(a.os, {}, "var(--c4)").slice(0, 8), { f: pctF });
    $("#anRisk").innerHTML = A.table(["Ким", "Босқич", "Охирги фаоллик", "#Дарс", "Балл", "Ҳолат"],
      a.risk.map((r) => `<tr><td>${personCell(r)}</td><td>${esc(STAGE[r.stage || ""])}</td><td>${fmt(r.last)}</td><td class="num">${nf(r.done)}</td><td class="nw">${scoreHtml(r.score)}</td><td>${segTag(r.seg)}</td></tr>`),
      "Ҳозирча бундай ҳисоб йўқ. 👍");
    renderPeople();
  }

  function renderPeople() {
    const a = data, sort = $("#anSort").value;
    const list = a.people.slice().sort((x, y) => sort === "last" ? y.last - x.last : sort === "done" ? y.done - x.done || y.score - x.score
      : sort === "secs" ? y.secs - x.secs : sort === "new" ? (y.registered || y.first) - (x.registered || x.first) : y.score - x.score || y.last - x.last);
    $("#anCount").textContent = `${nf(a.totals.people)} та фойдаланувчи` + (a.people.length < a.totals.people ? ` (рўйхатда биринчи ${nf(a.people.length)})` : "");
    $("#anPeople").innerHTML = A.table(["Ким", "Босқич · ёш", "Ҳудуд · қурилма", "Рўйхатдан / биринчи", "Охирги фаоллик", "#Ташриф", "#Вақт", "#Дарс", "Тест", "Балл", "Сегмент"],
      list.slice(0, show).map((r) => `<tr><td>${personCell(r)}${r.blocked ? ' <span class="tag bad">блок</span>' : ""}</td>
        <td>${esc(STAGE[r.stage || ""])}${r.age || r.ag ? `<br><small class="muted">${esc(r.age || r.ag)} ёш</small>` : ""}</td>
        <td>${A.placeHtml(r.place || (r.region !== "Аниқланмоқда" ? r.region : ""))}<br>${A.devHtml(r.device)}</td>
        <td>${fmt(r.registered || r.first)}</td><td>${fmt(r.last)}</td><td class="num">${nf(r.visits)}<br><small class="muted">${r.activeDays} кун</small></td><td class="num">${dur(r.secs)}</td>
        <td class="num">${nf(r.done)}<br><small class="muted">очди: ${r.opened}</small></td>
        <td class="nw">${r.qaN ? `${r.qaPct}%<br><small class="muted">${r.qaOk}/${r.qaN}</small>` : "—"}${r.examBest != null ? `<br><small class="muted">якуний: ${r.examBest}%</small>` : ""}</td>
        <td class="nw">${scoreHtml(r.score)}</td><td>${segTag(r.seg)}</td></tr>`),
      "Танланган филтр бўйича фойдаланувчи йўқ.");
    $("#anMoreWrap").hidden = list.length <= show;
    $("#anMore").textContent = `Яна кўрсатиш (${nf(list.length - show)})`;
  }

  let typing = 0;
  $("#anSearch").addEventListener("input", () => { clearTimeout(typing); typing = setTimeout(load, 300); });
  ["#anStage", "#anKind", "#anSeg"].forEach((s) => $(s).addEventListener("change", load));
  $("#anSort").addEventListener("change", () => { show = 100; data && renderPeople(); });
  $("#anMore").addEventListener("click", () => { show += 100; renderPeople(); });
  $("#anSegs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-seg]"); if (!b) return;
    $("#anSeg").value = $("#anSeg").value === b.dataset.seg ? "" : b.dataset.seg;
    load();
  });
  /* Юклаб олиш: файл тайёрлангунча тугма «тайёрланмоқда» бўлиб туради */
  ["#anPdf", "#anDocx", "#anCsv"].forEach((s) => $(s).addEventListener("click", (e) => {
    links();
    const b = e.currentTarget;
    if (b.dataset.busy) { e.preventDefault(); return; }
    b.dataset.busy = "1";
    const txt = b.textContent;
    b.textContent = "⏳ Тайёрланмоқда…";
    setTimeout(() => { b.textContent = txt; delete b.dataset.busy; }, 2500);
  }));
  links();
  window.EkoAnaliz = { load };
})();
