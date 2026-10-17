/* Экомун — Бошқарув маркази: «Тўловлар ва PRO» бўлими (буюртмалар, чекни тасдиқлаш, PRO бериш, ташкилот аризалари). */
"use strict";
(() => {
  const A = window.EkoAdmin;
  if (!A) return;
  const $ = (s) => document.querySelector(s);
  const { esc, nf, fmt } = A;
  const ST = { new: ["", "Тўлов кутилмоқда"], paid: ["ok", "Тўланди"], review: ["warn", "Текширишда"], rejected: ["bad", "Рад этилди"], cancelled: ["", "Бекор"], refunded: ["bad", "Қайтарилди"] };
  const PROV = { payme: "Payme", click: "Click", manual: "💳 Карта (қўлда)", test: "🧪 Синов", admin: "🛡️ Админ" };
  const LEAD = { maktab: "Мактаб", tuman: "Туман", kafedra: "ОТМ кафедраси", otm: "ОТМ", korxona: "Корхона", boshqa: "Бошқа" };
  const LST = { new: ["warn", "янги"], work: ["info", "ишланмоқда"], done: ["ok", "якунланди"] };
  let data = null;
  const err = (e) => { if (e.message !== "auth") A.toast(e.message); };

  async function load() {
    try { data = await A.api("/api/admin/pay"); render(); } catch (e) { err(e); }
  }
  function render() {
    if (!data) return;
    const s = data.stats, pv = data.providers;
    $("#bPay").hidden = !(s.review + s.newLeads); $("#bPay").textContent = s.review + s.newLeads;
    const on = Object.entries({ Payme: pv.payme, Click: pv.click, "Қўлда (карта)": pv.manual, "Синов": pv.test }).map(([k, v]) => `${v ? "✅" : "⛔"} ${k}`).join(" · ");
    $("#payMode").innerHTML = `${data.sandbox ? "<b>🧪 СИНОВ РЕЖИМИ (PAY_SANDBOX=1)</b> · " : ""}${esc(on)} · Тарифлар: ${data.plans.map((p) => `${esc(p.name)} — ${nf(p.price)} сўм`).join(", ")} · Агент чеклови: ${data.agentLimit}/ой`;
    A.kpis($("#payKpis"), [[nf(s.revenueMonth) + " сўм", "Шу ой тушуми"], [nf(s.revenueTotal) + " сўм", "Жами тушум"], [nf(s.activePro), "Фаол PRO"], [nf(s.review), "Чек текширишда", s.review > 0], [nf(s.expiring), "7 кунда тугайди"], [nf(s.newLeads), "Янги ариза", s.newLeads > 0]]);
    A.line($("#payChart"), s.days.map((d) => ({ d: d.d, v: d.v })), [{ k: "v", n: "Тушум", c: "var(--c1)" }], 200);
    A.bars($("#payProv"), Object.entries(s.byProvider).map(([k, v]) => ({ n: PROV[k] || k, v })), { f: (i) => nf(i.v) + " сўм" });
    renderOrders();
    $("#payPro").innerHTML = A.table(["Фойдаланувчи", "Муддати", "Агент (ой)"], data.pro.map((u) => `<tr><td>${A.who(u.name, u.email)}</td><td>${fmt(u.until)}</td><td class="num">${u.agent}</td></tr>`), "Ҳали PRO фойдаланувчи йўқ.");
    $("#payLeads").innerHTML = A.table(["Вақт", "Тури", "Ташкилот", "Алоқа", "Сони", "Изоҳ", "Ҳолат", ""], data.leads.map((l) => `<tr><td>${fmt(l.at)}</td><td>${esc(LEAD[l.kind] || l.kind)}</td><td><b>${esc(l.org)}</b><br><small>${esc(l.name)}</small></td><td>${esc(l.contact)}</td><td class="num">${l.count || ""}</td><td class="small">${esc(l.note)}</td><td><span class="tag ${(LST[l.status] || [""])[0]}">${esc((LST[l.status] || ["", l.status])[1])}</span></td>
      <td class="acts">${l.status !== "work" ? `<button class="btn sm" data-lead="work" data-id="${l.id}">Ишга олиш</button>` : ""}${l.status !== "done" ? `<button class="btn sm" data-lead="done" data-id="${l.id}">✓</button>` : ""}<button class="btn sm ghost" data-lead="delete" data-id="${l.id}">🗑️</button></td></tr>`), "Ариза йўқ.");
  }
  function renderOrders() {
    const q = $("#paySearch").value.trim().toLowerCase(), st = $("#payState").value;
    const list = data.orders.filter((o) => (!st || o.status === st) && (!q || [o.id, o.user && o.user.name, o.user && o.user.email, o.payer && o.payer.email, o.receipt && o.receipt.ref, o.ext].join(" ").toLowerCase().includes(q)));
    $("#payList").innerHTML = A.table(["№", "Вақт", "Фойдаланувчи", "Тариф", "#Сумма", "Усул", "Ҳолат", "Чек / изоҳ", ""], list.slice(0, 300).map((o) => {
      const [c, l] = ST[o.status] || ["", o.status];
      const r = o.receipt;
      return `<tr><td class="mono">${esc(o.id)}</td><td>${fmt(o.createdAt)}${o.paidAt ? `<br><small class="muted">✓ ${fmt(o.paidAt)}</small>` : ""}</td>
        <td>${o.user ? A.who(o.user.name, o.user.email, o.payer ? ` · 🎁 ${esc(o.payer.email)}` : "") : "<span class='muted'>ўчирилган</span>"}</td>
        <td>${esc(o.name)}</td><td class="num">${nf(o.amount)}</td><td>${esc(PROV[o.provider] || o.provider)}</td><td><span class="tag ${c}">${esc(l)}</span></td>
        <td class="small">${r ? `${esc(r.method)} <b>${esc(r.ref)}</b>${r.note ? "<br>" + esc(r.note) : ""}${r.file ? `<br><a href="/api/admin/pay/receipt/${esc(o.id)}" target="_blank" rel="noopener">🖼 Чек расми</a>` : ""}` : esc(o.ext || "")}${o.reject ? `<br><span class="muted">Сабаб: ${esc(o.reject)}</span>` : ""}</td>
        <td class="acts">${o.provider === "manual" && ["review", "new", "rejected"].includes(o.status) ? `<button class="btn sm primary" data-po="approve" data-id="${o.id}">✓ Тасдиқлаш</button>` : ""}${["review", "new"].includes(o.status) && o.provider === "manual" ? `<button class="btn sm ghost" data-po="reject" data-id="${o.id}">Рад этиш</button>` : ""}${o.status === "paid" && o.provider !== "payme" ? `<button class="btn sm ghost" data-po="refund" data-id="${o.id}">↩ Қайтариш</button>` : ""}</td></tr>`;
    }), "Бундай буюртма йўқ.");
  }

  $("#paySearch").addEventListener("input", () => data && renderOrders());
  $("#payState").addEventListener("change", () => data && renderOrders());
  $("#payList").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-po]"); if (!b) return;
    const a = b.dataset.po;
    let reason = "";
    if (a === "approve" && !(await A.confirm("PRO ни улаш", `№ ${b.dataset.id} буюртма тўланганини текширдингизми? Тасдиқласангиз PRO дарҳол уланади.`, false))) return;
    if (a === "reject") { if (!(await A.confirm("Чекни рад этиш", "Фойдаланувчи сабабни кўради ва чекни қайта юбориши мумкин.", true))) return; reason = $("#cReason").value; }
    if (a === "refund" && !(await A.confirm("Тўловни қайтариш", "PRO муддати шу буюртма кунларига қисқаради. Пулни ўзингиз қайтарасиз.", false))) return;
    try { await A.api("/api/admin/pay/order/" + b.dataset.id, { action: a, reason }); A.toast("Сақланди"); await load(); } catch (x) { err(x); }
  });
  $("#payLeads").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-lead]"); if (!b) return;
    if (b.dataset.lead === "delete" && !(await A.confirm("Аризани ўчириш", "Ариза бутунлай ўчирилади.", false))) return;
    try { await A.api("/api/admin/pay/lead/" + b.dataset.id, { action: b.dataset.lead }); await load(); } catch (x) { err(x); }
  });
  $("#payGrant").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    try { const r = await A.api("/api/admin/pay/grant", { user: f.user.value, days: +f.days.value, note: f.note.value }); A.toast(r.pro.active ? "PRO: " + fmt(r.pro.until) + " гача" : "PRO олиб ташланди"); f.reset(); f.days.value = 30; await load(); } catch (x) { err(x); }
  });
  window.EkoPay = { load };
})();
