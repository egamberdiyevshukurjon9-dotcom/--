/* Экомун — Бошқарув маркази: «Эко-оқим» бўлими (расмий манбалардан автоматик олинадиган видео, қонун ва янгиликлар).
   Манбаларни ёқиш/ўчириш, янгисини қўшиш, қўлда янгилаш, ёзувларни яшириш, тасдиқлаш ва маҳкамлаш. Сервер: feeds.js */
"use strict";
(() => {
  const A = window.EkoAdmin;
  if (!A) return;
  const $ = (s) => document.querySelector(s);
  const { esc, nf, fmt } = A;
  const TYPE = { yt: "▶️ YouTube", tg: "✈️ Telegram", govlaws: "⚖️ gov.uz қонунлар", govnews: "🏛️ gov.uz янгиликлар", rss: "📰 RSS" };
  const KIND = { video: "🎬 Видео", law: "⚖️ Қонун", news: "📰 Янгилик" };
  const ST = { ok: ["ok", "кўринади"], new: ["warn", "тасдиқ кутмоқда"], hidden: ["", "яширилган"] };
  let data = null;
  const err = (e) => { if (e.message !== "auth") A.toast(e.message); };

  async function load() {
    try { data = await A.api("/api/admin/feed"); render(); } catch (e) { err(e); }
  }
  function render() {
    if (!data) return;
    const c = data.counts || {};
    const sum = (k) => Object.entries(c).filter(([x]) => x.startsWith(k + ":")).reduce((a, [, v]) => a + v, 0);
    const pending = Object.entries(c).filter(([x]) => x.endsWith(":new")).reduce((a, [, v]) => a + v, 0);
    $("#bOqim").hidden = !pending; $("#bOqim").textContent = pending;
    A.kpis($("#oqKpis"), [[nf(sum("video")), "видео"], [nf(sum("law")), "қонун"], [nf(sum("news")), "янгилик"], [nf(pending), "тасдиқ кутмоқда", pending > 0],
      [data.lastRun ? fmt(data.lastRun) : "—", data.off ? "автоматик олиш ЎЧИРИЛГАН (FEED_OFF)" : `охирги текширув · ҳар ${data.hours} соатда`]]);
    $("#oqAuto").checked = !!data.auto;
    $("#oqSources").innerHTML = A.table(["Манба", "Тури", "#Ёзувлар", "Охирги текширув", ""], data.sources.map((s) => {
      const l = s.last || {};
      return `<tr><td><b>${esc(s.name)}</b><br><a class="small mono" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.url)}</a>${s.keys ? `<br><small class="muted">фильтр: ${esc(s.keys)}</small>` : ""}</td>
        <td>${esc(TYPE[s.type] || s.type)}</td><td class="num">${nf(s.count)}</td>
        <td>${l.at ? `${fmt(l.at)}<br>${l.ok ? `<span class="tag ok">✓ ${nf(l.n)} та, янги ${nf(l.added || 0)}</span>` : `<span class="tag bad" title="${esc(l.err)}">хато: ${esc(l.err)}</span>`}` : `<span class="muted">${s.on ? "ҳали текширилмаган" : "—"}</span>`}</td>
        <td class="acts"><button class="btn sm ${s.on ? "ghost" : "primary"}" data-src="toggle" data-id="${esc(s.id)}">${s.on ? "Ўчириш" : "Ёқиш"}</button>${s.on ? `<button class="btn sm ghost" data-src="run" data-id="${esc(s.id)}" title="Фақат шу манбани текшириш">🔄</button>` : ""}<button class="btn sm ghost" data-src="delete" data-id="${esc(s.id)}" title="Манбани олиб ташлаш">🗑️</button></td></tr>`;
    }), "Манба йўқ.");
    renderItems();
  }
  function renderItems() {
    const k = $("#oqKind").value, s = $("#oqState").value, q = $("#oqSearch").value.trim().toLowerCase();
    const list = data.items.filter((x) => (!k || x.kind === k) && (!s || x.status === s) && (!q || (x.title + " " + x.text).toLowerCase().includes(q)));
    $("#oqItems").innerHTML = A.table(["Сана", "Тури", "Сарлавҳа", "Манба", "Ҳолат", ""], list.slice(0, 300).map((x) => {
      const [c, l] = ST[x.status] || ["", x.status];
      return `<tr><td>${x.date ? fmt(x.date) : fmt(x.at)}</td><td>${esc(KIND[x.kind] || x.kind)}</td>
        <td>${x.pin ? "📌 " : ""}<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"><b>${esc(x.title)}</b></a>${x.text ? `<br><small class="muted">${esc(x.text.slice(0, 160))}</small>` : ""}</td>
        <td class="small">${esc(x.srcName)}</td><td><span class="tag ${c}">${esc(l)}</span></td>
        <td class="acts">${x.status !== "ok" ? `<button class="btn sm primary" data-it="show" data-id="${x.id}">✓ Кўрсатиш</button>` : `<button class="btn sm ghost" data-it="hide" data-id="${x.id}">Яшириш</button>`}<button class="btn sm ghost" data-it="${x.pin ? "unpin" : "pin"}" data-id="${x.id}" title="${x.pin ? "Маҳкамлашни олиш" : "Юқорига маҳкамлаш"}">${x.pin ? "📍" : "📌"}</button></td></tr>`;
    }), "Ҳали ёзув йўқ. «🔄 Ҳозир янгилаш» тугмасини босинг (сервер интернетга чиқа олиши керак).");
  }

  $("#oqKind").addEventListener("change", () => data && renderItems());
  $("#oqState").addEventListener("change", () => data && renderItems());
  $("#oqSearch").addEventListener("input", () => data && renderItems());
  $("#oqAuto").addEventListener("change", async (e) => {
    try { await A.api("/api/admin/feed/settings", { auto: e.target.checked }); A.toast(e.target.checked ? "Янги ёзувлар дарҳол кўринади" : "Янги ёзувлар тасдиқдан кейин кўринади"); await load(); } catch (x) { err(x); }
  });
  async function runNow(source, btn) {
    if (btn) btn.disabled = true;
    A.toast("Манбалар текширилмоқда…");
    try {
      const r = await A.api("/api/admin/feed/run", source ? { source } : {});
      const added = r.result.reduce((a, x) => a + (x.added || 0), 0), bad = r.result.filter((x) => !x.ok).length;
      A.toast(`Янги ёзувлар: ${added}${bad ? ` · ${bad} та манбада хато` : ""}`);
      await load();
    } catch (x) { err(x); } finally { if (btn) btn.disabled = false; }
  }
  $("#oqRun").addEventListener("click", (e) => runNow("", e.currentTarget));
  $("#oqSources").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-src]"); if (!b) return;
    const a = b.dataset.src;
    if (a === "run") return runNow(b.dataset.id, b);
    if (a === "delete" && !(await A.confirm("Манбани олиб ташлаш", "Манба рўйхатдан олинади. Ундан олинган ёзувлар қолади (уларни алоҳида яшириш мумкин).", false))) return;
    try { await A.api("/api/admin/feed/source", { action: a, id: b.dataset.id }); await load(); } catch (x) { err(x); }
  });
  $("#oqItems").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-it]"); if (!b) return;
    try { await A.api("/api/admin/feed/item/" + b.dataset.id, { action: b.dataset.it }); await load(); } catch (x) { err(x); }
  });
  $("#oqAdd").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, btn = f.querySelector("button");
    btn.disabled = true;
    try {
      const r = await A.api("/api/admin/feed/source", { action: "add", type: f.elements.type.value, ref: f.elements.ref.value, name: f.elements.name.value, keys: f.elements.keys.value });
      const res = (r.result || [])[0];
      A.toast(res && !res.ok ? "Манба қўшилди, лекин ўқиб бўлмади: " + res.err : "Манба қўшилди");
      f.reset(); await load();
    } catch (x) { err(x); } finally { btn.disabled = false; }
  });
  window.EkoOqimAdmin = { load };
})();
