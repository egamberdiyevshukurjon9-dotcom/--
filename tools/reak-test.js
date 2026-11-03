/* Реакция ядроси (vendor/eko-kimyo-reak.js) синови: машҳур тажрибалар, «реакция бормайди» ҳолатлари
   ва барча жуфтликлар бўйича тенглаштириш (ҳар бир тенглама атомлар ва заряд бўйича тенг бўлиши керак). */
"use strict";
const R = require("../vendor/eko-kimyo-reak.js");
let fail = 0;
const ok = (c, m) => { if (!c) { fail++; console.error("✗ " + m); } };
ok(R.EL.length === 118, "118 элемент");
ok(R.SUBS.length > 450, "моддалар сони");
const want = [
  [["HCl", "NaOH"], 0, "HCl + NaOH → H₂O + NaCl"],
  [["CuSO4", "NaOH"], 0, "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄"],
  [["AgNO3", "NaCl"], 0, "AgNO₃ + NaCl → AgCl↓ + NaNO₃"],
  [["CaCO3", "HCl"], 0, "CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O"],
  [["Fe", "CuSO4"], 0, "Fe + CuSO₄ → FeSO₄ + Cu↓"],
  [["Al", "Fe2O3"], 1, "2Al + Fe₂O₃ → Al₂O₃ + 2Fe"],
  [["CO2", "Ca(OH)2"], 0, "CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O"],
  [["CaCO3"], 1, "CaCO₃ → CaO + CO₂↑"]
];
want.forEach(([ids, h, t]) => { const r = R.react(ids, { heat: !!h }); ok(r.ok && r.text === t, ids.join("+") + ": " + (r.text || r.why)); });
[[["NaCl", "KNO3"], "ions"], [["Cu", "HCl"], "afterH"], [["NaCl"], "one"]].forEach(([ids, w]) => { const r = R.react(ids); ok(!r.ok && r.why === w, ids.join("+") + " → " + r.why); });
/* Барча жуфтликлар: истисно йўқ, тенглама атомлар бўйича тенг */
const ids = R.SUBS.map((s) => s.id);
let n = 0, okN = 0;
const check = (r) => {
  if (!r || !r.ok || !r.eq) return;
  const tot = (side, sg) => side.forEach(([c, f]) => { const a = R.parse(f); for (const k in a) bal[k] = (bal[k] || 0) + sg * c * a[k]; });
  const bal = {}; tot(r.eq[0], 1); tot(r.eq[1], -1);
  okN++;
  for (const k in bal) if (Math.abs(bal[k]) > 1e-9) { ok(false, "тенг эмас: " + r.text); break; }
};
for (let i = 0; i < ids.length; i++) for (let j = i; j < ids.length; j++) for (const heat of [false, true]) {
  n++;
  let r; try { r = R.react([ids[i], ids[j]], { heat }); } catch (e) { ok(false, ids[i] + "+" + ids[j] + ": " + e.message); continue; }
  if (r.multi) r.multi.forEach(check); else check(r);
}
console.log(`reak-test: ${n} жуфтлик, ${okN} реакция, ${fail ? fail + " хато" : "хатосиз"}`);
process.exit(fail ? 1 : 0);
