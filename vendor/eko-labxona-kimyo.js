/* Экомун — 🧪 «Лаборатория хонаси»: кимёвий ҳисоблаш ядроси (UI'сиз, Node'да ҳам синалади).
   Модель: сувли эритма, 25 °C. pH заряд мувозанати (электронейтраллик) тенгламасидан топилади:
     Σ(кучли катионлар) + [H⁺] + [NH₄⁺] = Σ(кучли анионлар) + Kw/[H⁺] + Σ(кучсиз кислота анионлари) + 2·[MY²⁻].
   Кучли кислота (HCl, H₂SO₄) — жуфтсиз анион, кучли асос (NaOH, Ca(OH)₂) — жуфтсиз катион
   сифатида ҳисобланади. Кучсиз тизимлар: сирка (pKa 4,76), лимон (3,13; 4,76; 6,40),
   карбонат (6,35; 10,33), аскорбин (4,10), совун/стеарин (≈ 8,5), Fe³⁺ гидролизи (2,2),
   аммоний (9,25), фосфат (2,15; 7,20; 12,35), сульфит (1,86; 7,17), ЭДТА (2,0; 2,67; 6,16; 10,26).
   ЭДТА комплекслари: lg K(CaY²⁻) = 10,69, lg K(MgY²⁻) = 8,79 (шартли доимий α(Y⁴⁻) орқали).
   Икки зарядли ионлар учун Дэвис активлик тузатмаси (CaCO₃, Mg(OH)₂, Mn(OH)₂); Al³⁺ гидролизи pKa 4,97.
   Чўкмалар эрувчанлик кўпайтмаси (Ksp) бўйича: AgCl 1,8·10⁻¹⁰, Ag₂CrO₄ 1,1·10⁻¹², BaSO₄ 1,1·10⁻¹⁰,
   CaCO₃ 3,3·10⁻⁹, Cu(OH)₂ 2,2·10⁻²⁰, Fe(OH)₃ 2,8·10⁻³⁹, Mg(OH)₂ 5,6·10⁻¹², Mn(OH)₂ 1,9·10⁻¹³
   (CRC Handbook, 25 °C; Harris, «Quantitative Chemical Analysis»). CO₂ эрувчанлиги ≈ 0,034 моль/л
   (Генри қонуни, 1 атм). Нейтраллаш иссиқлиги 55,8 кЖ/моль; сода + сирка эндотермик (≈ +18 кЖ/моль CO₂).
   Электр ўтказувчанлик — Кольрауш қонуни (чексиз суюлтиришдаги моляр ўтказувчанликлар, 25 °C)
   ва ион кучига оддий тузатма. Ютилиш спектри — Бугер–Ламберт–Бер қонуни (1 см кювета),
   хромофорларнинг максимум тўлқин узунлиги ва моляр ютилиш коэффициенти адабиётдан тахминий.
   Эритиб олинган кислород — Benson–Krause яқинлашуви (тоза сув, 1 атм).
   Бу ўқув модели: активлик коэффициентлари ва бошқа комплекслар соддалаштирилган. */
(() => {
  "use strict";
  const KW = 1e-14;
  const pK = { ac: [4.76], cit: [3.13, 4.76, 6.40], c: [6.35, 10.33], vc: [4.10], soap: [8.5], fe: [2.2], al: [4.97], nh: [9.25], p: [2.15, 7.20, 12.35], so3: [1.86, 7.17], y: [2.0, 2.67, 6.16, 10.26] };
  const KSP = { agcl: 1.8e-10, ag2cro4: 1.1e-12, baso4: 1.1e-10, caco3: 3.3e-9, cuoh: 2.2e-20, feoh: 2.8e-39, mgoh: 5.61e-12, mnoh: 1.9e-13, aloh: 1.3e-33 };
  const KF = { cay: Math.pow(10, 10.69), mgy: Math.pow(10, 8.79) };
  const CO2SAT = 0.034;
  /* Табиий сувлар CaCO₃ га нисбатан метастабил ўта тўйинган бўлади (SI ≈ 0,5–0,8) — чўкма фақат SI > 0,7 да */
  const CC_META = 0.7;
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
    const cat = (c.Na || 0) + (c.K || 0) + 2 * (c.Ca || 0) + 2 * (c.Mg || 0) + 2 * (c.Cu || 0) + (c.Ag || 0) + 2 * (c.Ba || 0) + 3 * (c.Fe || 0) + 3 * (c.Al || 0) + 2 * (c.Mn2 || 0);
    const an = (c.Cl || 0) + 2 * (c.SO4 || 0) + (c.NO3 || 0) + (c.NO2 || 0) + (c.SCN || 0) + (c.Mn || 0) + (c.I || 0) + (c.A || 0)
      + 2 * (c.CrO4 || 0) + 2 * (c.S2O3 || 0) + 2 * (c.S4O6 || 0) + 2 * (c.CaY || 0) + 2 * (c.MgY || 0);
    const f = (h) => cat + h - an - KW / h
      + (c.NH || 0) * (1 - negCharge(pK.nh, h))
      - (c.Ac || 0) * negCharge(pK.ac, h) - (c.Cit || 0) * negCharge(pK.cit, h)
      - (c.C || 0) * negCharge(pK.c, h) - (c.Vc || 0) * negCharge(pK.vc, h)
      - (c.Soap || 0) * negCharge(pK.soap, h) - (c.Fe || 0) * negCharge(pK.fe, h) - (c.Al || 0) * negCharge(pK.al, h)
      - (c.P || 0) * negCharge(pK.p, h) - (c.SO3 || 0) * negCharge(pK.so3, h)
      - (c.Y || 0) * negCharge(pK.y, h);
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
  /* 1:1 комплекс: (M − x)(L − x)·K' = x */
  function bind(M, Lg, Kc) {
    if (M <= 0 || Lg <= 0 || Kc <= 0) return 0;
    const b = M + Lg + 1 / Kc;
    return (b - Math.sqrt(Math.max(0, b * b - 4 * M * Lg))) / 2;
  }

  /* Тўлиқ мувозанат: умумий миқдорлар (ммоль) ва ҳажм (мл) → эриган ионлар, чўкмалар, pH.
     Чўкмалар ҳар сафар умумий миқдордан қайта ҳисобланади (кислота қўшилса эрийди). */
  function equil(tot, Vml) {
    const V = Math.max(Vml, 0.001) / 1000; // л
    const c = {};
    for (const k in tot) c[k] = (tot[k] || 0) / 1000 / V; // моль/л
    const ppt = { agcl: 0, ag2cro4: 0, baso4: 0, caco3: 0, cuoh: 0, feoh: 0, casoap: 0, mgoh: 0, mnoh: 0, aloh: 0 };
    /* Ион кучи ва Дэвис тенгламаси: икки зарядли ионлар активлиги (табиий сувларда CaCO₃ ўта тўйинмасин) */
    let I = 0;
    const zz = { Na: 1, K: 1, Ca: 4, Mg: 4, Cu: 4, Fe: 9, Al: 9, Ag: 1, Ba: 4, Mn2: 4, Cl: 1, SO4: 4, NO3: 1, NO2: 1, SCN: 1, I: 1, A: 1, CrO4: 4, S2O3: 4, C: 1, NH: 1, Ac: 1, P: 1 };
    for (const k in zz) I += 0.5 * (c[k] || 0) * zz[k];
    I = Math.min(I, 0.7);
    const sI = Math.sqrt(I), lg1 = -0.51 * (sI / (1 + sI) - 0.3 * I), g1 = Math.pow(10, lg1), g2 = Math.pow(10, 4 * lg1);
    /* AgCl, кейин қолган Ag⁺ хромат билан (Мор усули: AgCl тўлиқ чўккандан кейин қизил-қўнғир Ag₂CrO₄) */
    let x = pairPpt(c.Ag || 0, c.Cl || 0, KSP.agcl); c.Ag = (c.Ag || 0) - x; c.Cl = (c.Cl || 0) - x; ppt.agcl = x;
    if ((c.Ag || 0) > 0 && (c.CrO4 || 0) > 0 && c.Ag * c.Ag * c.CrO4 > KSP.ag2cro4) {
      let lo = 0, hi = Math.min(c.Ag / 2, c.CrO4);
      for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; const a = c.Ag - 2 * m; if (a * a * (c.CrO4 - m) > KSP.ag2cro4) lo = m; else hi = m; }
      c.Ag -= 2 * hi; c.CrO4 -= hi; ppt.ag2cro4 = hi;
    }
    x = pairPpt(c.Ba || 0, c.SO4 || 0, KSP.baso4); c.Ba = (c.Ba || 0) - x; c.SO4 = (c.SO4 || 0) - x; ppt.baso4 = x;
    /* Кальций совун (кальций стеарати) — амалда эримайди: Ca²⁺ + 2 St⁻ → Ca(St)₂↓ */
    if ((c.Soap || 0) > 0 && (c.Ca || 0) > 0) { const y = Math.min(c.Ca, c.Soap / 2); c.Ca -= y; c.Soap -= 2 * y; ppt.casoap = y; }
    /* ЭДТА: аввал Ca²⁺ (кучлироқ), кейин Mg²⁺ билан боғланади; шартли доимий pH га боғлиқ */
    if ((c.Y || 0) > 0 && ((c.Ca || 0) > 0 || (c.Mg || 0) > 0)) {
      const Y0 = c.Y, Ca0 = c.Ca || 0, Mg0 = c.Mg || 0;
      for (let it = 0; it < 3; it++) {
        const a4 = alphas(pK.y, solveH(c))[4];
        const xc = bind(Ca0, Y0, KF.cay * a4), xm = bind(Mg0, Y0 - xc, KF.mgy * a4);
        c.Ca = Ca0 - xc; c.Mg = Mg0 - xm; c.CaY = xc; c.MgY = xm; c.Y = Y0 - xc - xm;
      }
    }
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
    const lg = (v) => Math.log10(Math.max(v, 1e-300));
    for (let it = 0; it < 3; it++) {
      fit("feoh", "Fe", (fe, h) => lg(fe * alphas(pK.fe, h)[0]) + 3 * lg(KW / h) - lg(KSP.feoh));
      fit("cuoh", "Cu", (cu, h) => lg(cu) + 2 * lg(KW / h) - lg(KSP.cuoh));
      fit("mgoh", "Mg", (mg, h) => lg(mg * g2) + 2 * lg(KW / h) - lg(KSP.mgoh));
      fit("aloh", "Al", (al, h) => lg(al * alphas(pK.al, h)[0]) + 3 * lg(KW / h) - lg(KSP.aloh));
      fit("mnoh", "Mn2", (mn, h) => lg(mn * g2) + 2 * lg(KW / h) - lg(KSP.mnoh));
      /* CaCO₃: Ca ва C бир хил миқдорда чўкади — Ca ни бисекция қиламиз, C ни мос камайтирамиз */
      const Ca0 = c.Ca || 0, C0 = c.C || 0;
      if (Ca0 > 0 && C0 > 0) {
        const chk = (m) => { c.Ca = Ca0 - m; c.C = C0 - m; const h = solveH(c); return lg(c.Ca * g2) + lg(c.C * alphas(pK.c, h)[2] * g2) - lg(KSP.caco3) - CC_META; };
        if (chk(0) > 0) {
          let lo = 0, hi = Math.min(Ca0, C0);
          for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (chk(m) > 0) lo = m; else hi = m; }
          c.Ca = Ca0 - hi; c.C = C0 - hi; ppt.caco3 += hi;
        } else { c.Ca = Ca0; c.C = C0; }
      }
    }
    const h = solveH(c);
    const out = { c, h, pH: -Math.log10(h), ppt: {}, I };
    for (const k in ppt) out.ppt[k] = ppt[k] * V * 1000; // ммоль
    out.co2aq = (c.C || 0) * alphas(pK.c, h)[0]; // моль/л H₂CO₃*
    /* ЭДТА билан боғланмаган металл (эритмада + чўкмада) — металлоиндикатор ранги учун, моль/л */
    out.freeCa = (c.Ca || 0) + ppt.caco3 + ppt.casoap;
    out.freeM = out.freeCa + (c.Mg || 0) + ppt.mgoh;
    return out;
  }

  /* ---------- Электр ўтказувчанлик (Кольрауш) ----------
     λ° (См·см²/моль, 25 °C, бир мол ионга): H⁺ 349,8; OH⁻ 198,6; Na⁺ 50,1; K⁺ 73,5; Ca²⁺ 119,0; Mg²⁺ 106,0;
     Cl⁻ 76,3; NO₃⁻ 71,4; SO₄²⁻ 160,0; HCO₃⁻ 44,5; CO₃²⁻ 138,6; CH₃COO⁻ 40,9; NH₄⁺ 73,5; Cu²⁺ 107,2;
     Fe³⁺ 204; Ag⁺ 61,9; Ba²⁺ 127,2; I⁻ 76,8; H₂PO₄⁻ 36; HPO₄²⁻ 114 (CRC Handbook). */
  const LAM = { Na: 50.1, K: 73.5, Ca: 119.0, Mg: 106.0, Al: 183, Cu: 107.2, Fe: 204, Ag: 61.9, Ba: 127.2, Mn2: 107, Cl: 76.3, NO3: 71.4, NO2: 71.8, SO4: 160.0, SCN: 66, I: 76.8, Mn: 61.3, A: 70, CrO4: 170, S2O3: 170, S4O6: 110, CaY: 90, MgY: 90 };
  function conductivity(eq) {
    const c = eq.c, h = eq.h;
    let s = 349.8 * h + 198.6 * KW / h, I = 0;
    const z = { Na: 1, K: 1, Ca: 2, Mg: 2, Al: 3, Cu: 2, Fe: 3, Ag: 1, Ba: 2, Mn2: 2, Cl: 1, NO3: 1, NO2: 1, SO4: 2, SCN: 1, I: 1, Mn: 1, A: 1, CrO4: 2, S2O3: 2, S4O6: 2, CaY: 2, MgY: 2 };
    for (const k in LAM) { const v = Math.max(0, c[k] || 0); s += LAM[k] * v; I += 0.5 * v * z[k] * z[k]; }
    const ac = c.C || 0, ca = alphas(pK.c, h); s += ac * (44.5 * ca[1] + 138.6 * ca[2]); I += 0.5 * ac * (ca[1] + 4 * ca[2]);
    const nh = (c.NH || 0) * (1 - negCharge(pK.nh, h)); s += 73.5 * nh; I += 0.5 * nh;
    const pa = alphas(pK.p, h), P = c.P || 0; s += P * (36 * pa[1] + 114 * pa[2] + 207 * pa[3]); I += 0.5 * P * (pa[1] + 4 * pa[2] + 9 * pa[3]);
    const aa = (c.Ac || 0) * alphas(pK.ac, h)[1]; s += 40.9 * aa; I += 0.5 * aa;
    const cit = (c.Cit || 0) * negCharge(pK.cit, h); s += 60 * cit; I += 0.5 * cit * 2;
    I += 0.5 * (h + KW / h);
    /* См·см²/моль × моль/л → мкСм/см: ×1000; ион кучи тузатмаси 1/(1+0,6√I) (0,01 М KCl → ≈ 1410 мкСм/см) */
    return Math.max(0.05, 1000 * s / (1 + 0.6 * Math.sqrt(I)) + 0.055);
  }

  /* ---------- Хромофорлар (моль/л) ва спектр ---------- */
  function chromo(st, eq) {
    const c = eq.c, ex = st.extra || {}, V = Math.max(st.V, 1e-3) / 1000, ind = st.ind || {};
    const o = {};
    const fe = c.Fe || 0, scn = c.SCN || 0;
    if (fe > 0 && scn > 0) o.fescn = fe * (140 * scn / (1 + 140 * scn)); // [Fe(SCN)]²⁺, K ≈ 140
    if (fe > 0) o.fe3 = fe - (o.fescn || 0);
    if ((c.Mn || 0) > 0) o.mno4 = c.Mn;
    if ((c.Cu || 0) > 0) o.cu = c.Cu;
    if ((c.CrO4 || 0) > 0) o.cro4 = c.CrO4;
    const i2 = (ex.I2 || 0) / 1000 / V;
    if (i2 > 0) { if ((ex.starch || 0) > 0 && st.T < 60) o.i2s = i2; else o.i2 = i2; }
    /* Молибден кўки: 12 Mo + PO₄³⁻ → гетерополикислота, аскорбин кислота билан қайтарилади */
    if ((ex.moly || 0) > 0 && (c.P || 0) > 0) o.moblue = Math.min(c.P, ex.moly / 12 / 1000 / V);
    /* Несслер: 2[HgI₄]²⁻ + NH₃ + 3OH⁻ → сариқ-қўнғир коллоид (ишқорий муҳитда) */
    if ((ex.ness || 0) > 0 && (c.NH || 0) > 0 && eq.pH > 11) o.ness = Math.min(c.NH, ex.ness / 2 / 1000 / V);
    if ((ex.azo || 0) > 0) o.azo = ex.azo / 1000 / V;
    if ((ex.dpa || 0) > 0 && (c.NO3 || 0) + (c.NO2 || 0) > 2e-5) o.dpa = Math.min(1e-3, (c.NO3 || 0) + (c.NO2 || 0));
    if ((ex.cr6 || 0) > 0) o.cr6 = ex.cr6 / 1000 / V;
    if ((ex.cr3 || 0) > 0) o.cr3 = ex.cr3 / 1000 / V;
    if ((ex.mnooh || 0) > 0) o.mnooh = ex.mnooh / 1000 / V;
    /* Металлоиндикаторлар (pH 8–11): металл билан — вино-қизил, эркин — кўк */
    if ((ind.ebt || 0) > 0) { const e = (ind.ebt / 1000 / V) * 2e-3; if (eq.pH > 6.3 && eq.pH < 11.6) o[eq.freeM > 2e-6 ? "ebtM" : "ebtF"] = e; else o.ebtM = e; }
    if ((ind.mur || 0) > 0) { const e = (ind.mur / 1000 / V) * 2e-3; o[eq.freeCa > 2e-6 ? "murM" : "murF"] = e; }
    return o;
  }
  /* Ютилиш тасмалари: [λmax, кенглик, ε (л/(моль·см))] */
  const BANDS = {
    fescn: [[480, 55, 4700]], fe3: [[340, 45, 3000]], mno4: [[525, 40, 2455], [545, 25, 2000]], cu: [[810, 140, 12]], cro4: [[372, 40, 4800]],
    i2s: [[615, 95, 35000]], i2: [[353, 35, 26400], [460, 55, 900]], moblue: [[880, 160, 20000], [710, 90, 9000]], ness: [[410, 70, 6000]],
    azo: [[540, 45, 45000]], dpa: [[590, 80, 10000]], cr6: [[350, 40, 3000], [440, 50, 370]], cr3: [[590, 60, 14], [410, 50, 15]],
    mnooh: [[450, 200, 1500]], ebtM: [[530, 60, 22000]], ebtF: [[615, 60, 9000]], murM: [[506, 60, 15000]], murF: [[540, 60, 9000]]
  };
  function absorb(st, eq, lam) {
    const o = chromo(st, eq);
    let A = 0;
    for (const k in o) for (const [l0, w, e] of BANDS[k] || []) A += e * o[k] * Math.exp(-Math.pow((lam - l0) / w, 2));
    const col = color(st, eq);
    A += col.tur * 1.6 * Math.pow(550 / lam, 1.5); // лойқалик ёруғликни сочади
    return Math.max(0, A);
  }

  /* ---------- Эриган кислород ----------
     Тўйиниш (мг/л, 1 атм, тоза сув): 14,62 − 0,3898·T + 0,006969·T² − 5,897·10⁻⁵·T³ */
  const doSat = (T) => 14.62 - 0.3898 * T + 0.006969 * T * T - 0.00005897 * T * T * T;

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
    const V = Math.max(st.V, 1e-3) / 1000;
    const o = chromo(st, eq);
    if (ex.org > 0) layer([0.62, 0.52, 0.32], Math.min(0.55, ex.org / V * 0.12));
    if (ex.lemon > 0) layer([0.98, 0.93, 0.55], Math.min(0.5, ex.lemon / V * 0.004));
    if (o.cu) layer([0.25, 0.62, 0.95], Math.min(0.85, o.cu * 9));
    if (o.fe3 && !o.fescn) layer([0.93, 0.62, 0.15], Math.min(0.8, o.fe3 * 120));
    if (o.fescn) layer([0.62, 0.02, 0.05], Math.min(0.95, o.fescn * 900));
    if (o.cro4) layer([0.98, 0.84, 0.1], Math.min(0.85, o.cro4 * 60));
    if (o.cr6) layer([0.95, 0.5, 0.08], Math.min(0.9, o.cr6 * 25));
    if (o.cr3) layer([0.2, 0.55, 0.35], Math.min(0.8, o.cr3 * 8));
    if (o.mno4) layer([0.62, 0.1, 0.55], Math.min(0.92, o.mno4 * 4000));
    if (o.i2s) layer([0.08, 0.1, 0.32], Math.min(0.95, o.i2s * 2500 / 1));
    if (o.i2) layer([0.72, 0.45, 0.12], Math.min(0.85, o.i2 * 600));
    if (o.moblue) layer([0.12, 0.35, 0.82], Math.min(0.9, o.moblue * 25000));
    if (o.ness) layer([0.85, 0.55, 0.12], Math.min(0.9, o.ness * 9000));
    if (o.azo) layer([0.9, 0.12, 0.45], Math.min(0.92, o.azo * 60000));
    if (o.dpa) layer([0.15, 0.2, 0.75], Math.min(0.92, o.dpa * 3000));
    if (o.ebtM) layer([0.62, 0.08, 0.25], Math.min(0.85, o.ebtM * 400000));
    if (o.ebtF) layer([0.15, 0.3, 0.85], Math.min(0.85, o.ebtF * 400000));
    if (o.murM) layer([0.92, 0.3, 0.5], Math.min(0.85, o.murM * 400000));
    if (o.murF) layer([0.5, 0.2, 0.7], Math.min(0.85, o.murF * 400000));
    const ind = st.ind || {};
    if (ind.cab > 0) layer(cabbage(eq.pH), Math.min(0.9, ind.cab / V * 0.9));
    if (ind.uni > 0) layer(universal(eq.pH), Math.min(0.9, ind.uni / V * 1.6));
    if (ind.php > 0 && eq.pH > 8.2) layer([0.93, 0.18, 0.55], Math.min(0.9, (ind.php / V * 6) * Math.min(1, (eq.pH - 8.2) / 1.2)));
    if (ind.mo > 0) layer(eq.pH < 3.1 ? [0.88, 0.15, 0.15] : eq.pH > 4.4 ? [0.98, 0.78, 0.12] : mix([0.88, 0.15, 0.15], [0.98, 0.78, 0.12], (eq.pH - 3.1) / 1.3), Math.min(0.85, ind.mo / V * 4));
    /* Чўкма ва лойқалик */
    const p = eq.ppt, Vl = Math.max(V, 1e-6);
    const soil = (st.soilTur || 0);
    const tur = Math.min(1, (p.agcl * 0.06 + p.ag2cro4 * 0.08 + p.baso4 * 0.06 + p.caco3 * 0.05 + p.cuoh * 0.08 + p.feoh * 0.1 + p.casoap * 0.08 + p.mgoh * 0.07 + p.mnoh * 0.07 + p.aloh * 0.07 + (ex.mnooh || 0) * 0.1 + (st.cuo || 0) * 0.1 + soil * 2.2) / (Vl * 1000) * 40);
    let pcol = [0.96, 0.96, 0.94];
    const pw = [[p.cuoh, [0.25, 0.55, 0.95]], [st.cuo || 0, [0.12, 0.12, 0.12]], [p.feoh, [0.62, 0.32, 0.1]], [p.ag2cro4, [0.62, 0.2, 0.12]], [ex.mnooh || 0, [0.5, 0.3, 0.12]], [soil * 2, [0.45, 0.33, 0.2]], [p.agcl + p.baso4 + p.caco3 + p.casoap + p.mgoh + p.mnoh + p.aloh, [0.97, 0.97, 0.95]]];
    const sw = pw.reduce((a, [w]) => a + w, 0);
    if (sw > 0) pcol = pw.reduce((acc, [w, col]) => acc.map((v, i) => v + col[i] * w / sw), [0, 0, 0]);
    if (tur > 0.02) rgb = mix(rgb, pcol, Math.min(0.75, tur));
    return { rgb, op: Math.min(0.95, 0.35 + cov * 0.5 + tur * 0.5), tur, pcol, pptAmt: sw };
  }

  window.EkoKimyo = { solveH, equil, alphas, color, cabbage, universal, conductivity, chromo, absorb, BANDS, doSat, pK, KSP, CO2SAT, KW };
  if (typeof module !== "undefined") module.exports = window.EkoKimyo;
})();
