/* Экомун — 🧪 «Лаборатория хонаси»: кимёвий ҳисоблаш ядроси (UI'сиз, Node'да ҳам синалади).
   Модель: сувли эритма, 25 °C. pH заряд мувозанати (электронейтраллик) тенгламасидан топилади:
     Σ(кучли катионлар) + [H⁺] = Σ(кучли анионлар) + Kw/[H⁺] + Σ(кучсиз кислота анионлари).
   Кучли кислота (HCl, H₂SO₄) — жуфтсиз анион, кучли асос (NaOH, Ca(OH)₂) — жуфтсиз катион
   сифатида ҳисобланади. Кучсиз тизимлар: сирка (pKa 4,76), лимон (3,13; 4,76; 6,40),
   карбонат (6,35; 10,33), аскорбин (4,10), совун/стеарин (≈ 8,5), Fe³⁺ гидролизи (2,2).
   Чўкмалар эрувчанлик кўпайтмаси (Ksp) бўйича: AgCl 1,8·10⁻¹⁰, BaSO₄ 1,1·10⁻¹⁰,
   CaCO₃ 3,3·10⁻⁹, Cu(OH)₂ 2,2·10⁻²⁰, Fe(OH)₃ 2,8·10⁻³⁹ (CRC Handbook, 25 °C; Harris,
   «Quantitative Chemical Analysis»). CO₂ эрувчанлиги ≈ 0,034 моль/л (Генри қонуни, 1 атм).
   Нейтраллаш иссиқлиги 55,8 кЖ/моль; сода + сирка эндотермик (≈ +18 кЖ/моль CO₂).
   Бу ўқув модели: активлик коэффициентлари ва комплекслар соддалаштирилган. */
(() => {
  "use strict";
  const KW = 1e-14;
  const pK = { ac: [4.76], cit: [3.13, 4.76, 6.40], c: [6.35, 10.33], vc: [4.10], soap: [8.5], fe: [2.2] };
  const KSP = { agcl: 1.8e-10, baso4: 1.1e-10, caco3: 3.3e-9, cuoh: 2.2e-20, feoh: 2.8e-39 };
  const CO2SAT = 0.034;
  /* Кўп негизли кислота: ҳар бир шаклнинг улуши α (0 — тўлиқ протонланган) */
  function alphas(pks, h) {
    const K = pks.map((p) => Math.pow(10, -p));
    const terms = [1];
    for (let i = 0; i < K.length; i++) terms.push(terms[i] * K[i] / h);
    const s = terms.reduce((a, b) => a + b, 0);
    return terms.map((x) => x / s);
  }
  /* Ўртача манфий заряд (бир молга) */
  const negCharge = (pks, h) => alphas(pks, h).reduce((a, x, i) => a + x * i, 0);

  /* Эритмадаги эриган ионлар (моль/л) бўйича pH */
  function solveH(c) {
    const cat = (c.Na || 0) + (c.K || 0) + 2 * (c.Ca || 0) + 2 * (c.Cu || 0) + (c.Ag || 0) + 2 * (c.Ba || 0) + 3 * (c.Fe || 0);
    const an = (c.Cl || 0) + 2 * (c.SO4 || 0) + (c.NO3 || 0) + (c.SCN || 0) + (c.Mn || 0);
    const f = (h) => cat + h - an - KW / h
      - (c.Ac || 0) * negCharge(pK.ac, h) - (c.Cit || 0) * negCharge(pK.cit, h)
      - (c.C || 0) * negCharge(pK.c, h) - (c.Vc || 0) * negCharge(pK.vc, h)
      - (c.Soap || 0) * negCharge(pK.soap, h) - (c.Fe || 0) * negCharge(pK.fe, h);
    let lo = -15.5, hi = 1.5;
    for (let i = 0; i < 70; i++) {
      const mid = (lo + hi) / 2;
      if (f(Math.pow(10, mid)) > 0) hi = mid; else lo = mid;
    }
    return Math.pow(10, (lo + hi) / 2);
  }

  /* Иккита ионнинг оддий чўкмаси (pH га боғлиқ эмас): a·b ≤ Ksp */
  function pairPpt(a, b, ksp) {
    if (a * b <= ksp) return 0;
    /* (a − x)(b − x) = Ksp → x = ((a + b) − √((a − b)² + 4Ksp)) / 2 */
    return ((a + b) - Math.sqrt((a - b) * (a - b) + 4 * ksp)) / 2;
  }

  /* Тўлиқ мувозанат: умумий миқдорлар (ммоль) ва ҳажм (мл) → эриган ионлар, чўкмалар, pH.
     Чўкмалар ҳар сафар умумий миқдордан қайта ҳисобланади (кислота қўшилса эрийди). */
  function equil(tot, Vml) {
    const V = Math.max(Vml, 0.001) / 1000; // л
    const c = {};
    for (const k in tot) c[k] = (tot[k] || 0) / 1000 / V; // моль/л
    const ppt = { agcl: 0, baso4: 0, caco3: 0, cuoh: 0, feoh: 0, casoap: 0 };
    /* AgCl ва BaSO₄ */
    let x = pairPpt(c.Ag || 0, c.Cl || 0, KSP.agcl); c.Ag = (c.Ag || 0) - x; c.Cl = (c.Cl || 0) - x; ppt.agcl = x;
    x = pairPpt(c.Ba || 0, c.SO4 || 0, KSP.baso4); c.Ba = (c.Ba || 0) - x; c.SO4 = (c.SO4 || 0) - x; ppt.baso4 = x;
    /* Кальций совун (кальций стеарати) — амалда эримайди: Ca²⁺ + 2 St⁻ → Ca(St)₂↓ */
    if ((c.Soap || 0) > 0 && (c.Ca || 0) > 0) { const y = Math.min(c.Ca, c.Soap / 2); c.Ca -= y; c.Soap -= 2 * y; ppt.casoap = y; }
    /* pH га боғлиқ чўкмалар: эриган улушни бисекция билан топамиз */
    const fit = (key, tk, check) => {
      const T0 = c[tk] || 0; if (T0 <= 0) return;
      if (check(T0, solveH(c)) <= 0) return;
      let lo = 0, hi = 1;
      for (let i = 0; i < 40; i++) {
        const m = (lo + hi) / 2; c[tk] = T0 * m;
        if (check(T0 * m, solveH(c)) > 0) hi = m; else lo = m;
      }
      c[tk] = T0 * lo; ppt[key] += T0 * (1 - lo);
    };
    for (let it = 0; it < 3; it++) {
      fit("feoh", "Fe", (fe, h) => Math.log10(Math.max(fe * alphas(pK.fe, h)[0], 1e-300)) + 3 * Math.log10(KW / h) - Math.log10(KSP.feoh));
      fit("cuoh", "Cu", (cu, h) => Math.log10(Math.max(cu, 1e-300)) + 2 * Math.log10(KW / h) - Math.log10(KSP.cuoh));
      /* CaCO₃: Ca ва C бир хил миқдорда чўкади — Ca ни бисекция қиламиз, C ни мос камайтирамиз */
      const Ca0 = c.Ca || 0, C0 = c.C || 0;
      if (Ca0 > 0 && C0 > 0) {
        const chk = (m) => { c.Ca = Ca0 - m; c.C = C0 - m; const h = solveH(c); return Math.log10(Math.max(c.Ca, 1e-300)) + Math.log10(Math.max(c.C * alphas(pK.c, h)[2], 1e-300)) - Math.log10(KSP.caco3); };
        if (chk(0) > 0) {
          let lo = 0, hi = Math.min(Ca0, C0);
          for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (chk(m) > 0) lo = m; else hi = m; }
          c.Ca = Ca0 - hi; c.C = C0 - hi; ppt.caco3 += hi;
        } else { c.Ca = Ca0; c.C = C0; }
      }
    }
    const h = solveH(c);
    const out = { c, h, pH: -Math.log10(h), ppt: {} };
    for (const k in ppt) out.ppt[k] = ppt[k] * V * 1000; // ммоль
    out.co2aq = (c.C || 0) * alphas(pK.c, h)[0]; // моль/л H₂CO₃*
    return out;
  }

  /* Ранг: RGB 0..1 ва лойқалик (0..1) */
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  function cabbage(pH) {
    const st = [[1, [0.86, 0.1, 0.24]], [3, [0.93, 0.25, 0.45]], [5, [0.74, 0.25, 0.6]], [7, [0.45, 0.28, 0.66]], [8, [0.23, 0.38, 0.8]], [10, [0.15, 0.62, 0.45]], [12, [0.62, 0.78, 0.16]], [14, [0.95, 0.85, 0.15]]];
    if (pH <= st[0][0]) return st[0][1];
    for (let i = 1; i < st.length; i++) if (pH <= st[i][0]) return mix(st[i - 1][1], st[i][1], (pH - st[i - 1][0]) / (st[i][0] - st[i - 1][0]));
    return st[st.length - 1][1];
  }
  function universal(pH) {
    const st = [[1, [0.85, 0.1, 0.1]], [4, [0.98, 0.5, 0.1]], [6, [0.98, 0.85, 0.15]], [7, [0.35, 0.75, 0.25]], [9, [0.15, 0.45, 0.8]], [11, [0.35, 0.2, 0.65]], [14, [0.42, 0.12, 0.5]]];
    if (pH <= 1) return st[0][1];
    for (let i = 1; i < st.length; i++) if (pH <= st[i][0]) return mix(st[i - 1][1], st[i][1], (pH - st[i - 1][0]) / (st[i][0] - st[i - 1][0]));
    return st[st.length - 1][1];
  }
  /* Эритма ранги: ҳар бир рангли модданинг «қоплаш кучи» концентрацияга боғлиқ */
  function color(st, eq) {
    const c = eq.c, ex = st.extra || {};
    let rgb = [0.86, 0.94, 1.0], cov = 0;
    const layer = (col, k) => { k = Math.max(0, Math.min(1, k)); rgb = mix(rgb, col, k); cov = Math.max(cov, k); };
    const V = st.V / 1000;
    if (ex.org > 0) layer([0.62, 0.52, 0.32], Math.min(0.55, ex.org / V * 0.12));
    if (ex.lemon > 0) layer([0.98, 0.93, 0.55], Math.min(0.5, ex.lemon / V * 0.004));
    if ((c.Cu || 0) > 0) layer([0.25, 0.62, 0.95], Math.min(0.85, c.Cu * 9));
    if ((c.Fe || 0) > 0 && !((c.SCN || 0) > 0)) layer([0.93, 0.62, 0.15], Math.min(0.8, c.Fe * 120));
    if ((c.Fe || 0) > 0 && (c.SCN || 0) > 0) layer([0.62, 0.02, 0.05], Math.min(0.95, Math.min(c.Fe, c.SCN) * 900));
    if ((c.Mn || 0) > 0) layer([0.62, 0.1, 0.55], Math.min(0.92, c.Mn * 4000));
    const io = (ex.I2 || 0) / V;
    if (io > 0) {
      if ((ex.starch || 0) > 0 && st.T < 60) layer([0.08, 0.1, 0.32], Math.min(0.95, io * 2500));
      else layer([0.72, 0.45, 0.12], Math.min(0.85, io * 600));
    }
    const ind = st.ind || {};
    if (ind.cab > 0) layer(cabbage(eq.pH), Math.min(0.9, ind.cab / V * 0.9));
    if (ind.uni > 0) layer(universal(eq.pH), Math.min(0.9, ind.uni / V * 1.6));
    if (ind.php > 0 && eq.pH > 8.2) layer([0.93, 0.18, 0.55], Math.min(0.9, (ind.php / V * 6) * Math.min(1, (eq.pH - 8.2) / 1.2)));
    if (ind.mo > 0) layer(eq.pH < 3.1 ? [0.88, 0.15, 0.15] : eq.pH > 4.4 ? [0.98, 0.78, 0.12] : mix([0.88, 0.15, 0.15], [0.98, 0.78, 0.12], (eq.pH - 3.1) / 1.3), Math.min(0.85, ind.mo / V * 4));
    /* Чўкма ва лойқалик */
    const p = eq.ppt, Vl = Math.max(V, 1e-6);
    const tur = Math.min(1, (p.agcl * 0.06 + p.baso4 * 0.06 + p.caco3 * 0.05 + p.cuoh * 0.08 + p.feoh * 0.1 + p.casoap * 0.08 + (st.cuo || 0) * 0.1) / (Vl * 1000) * 40);
    let pcol = [0.96, 0.96, 0.94];
    const pw = [[p.cuoh, [0.25, 0.55, 0.95]], [st.cuo || 0, [0.12, 0.12, 0.12]], [p.feoh, [0.62, 0.32, 0.1]], [p.agcl + p.baso4 + p.caco3 + p.casoap, [0.97, 0.97, 0.95]]];
    const sw = pw.reduce((a, [w]) => a + w, 0);
    if (sw > 0) pcol = pw.reduce((acc, [w, col]) => acc.map((v, i) => v + col[i] * w / sw), [0, 0, 0]);
    if (tur > 0.02) rgb = mix(rgb, pcol, Math.min(0.75, tur));
    return { rgb, op: Math.min(0.95, 0.35 + cov * 0.5 + tur * 0.5), tur, pcol, pptAmt: sw };
  }

  window.EkoKimyo = { solveH, equil, alphas, color, cabbage, universal, pK, KSP, CO2SAT, KW };
  if (typeof module !== "undefined") module.exports = window.EkoKimyo;
})();
