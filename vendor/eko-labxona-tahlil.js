/* Экомун — 🔬 «Лаборатория хонаси»: микроскоп ва босқичма-босқич таҳлил жараёнлари.
   • Микроскоп: ×40 / ×100 / ×400, фокус, намуналар (дарё, кўл, оқова сув, тупроқ, чанг, кристаллар) —
     объектлар ҳақиқий ўлчамларда (мкм) чизилади, кўриш майдони ва масштаб чизиғи катталаштиришга мос.
   • Жараёнлар: сув сифати, тупроқ, ҳаво ва чанг таҳлили. Ҳар бир қадам «Лаборатория хонаси» идиши ва
     асбобларини (EkoLabXona API) ишлатади, натижалар асбоб кўрсаткичидан ҳисоботга йиғилади.
   Меъёрлар: ЖССТ (WHO) ичимлик суви ва ҳаво сифати бўйича тавсиялари (2017, 2021), O‘zDSt 950:2011.
   Матнлар uz/ru/en; мактаб босқичида фақат университетга мўлжалланган қадамлар 🔒. */
(() => {
  "use strict";
  const SEC = document.getElementById("labxona");
  if (!SEC) return;

  /* ---------- Тил ва ёрдамчилар ---------- */
  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const tr = (s) => (EL() ? EL().tr(s) : s);
  const lang = () => (EL() ? EL().lang : "cyr");
  const L = (o) => {
    if (o == null) return "";
    if (typeof o === "string") return lang() === "lat" || lang() === "en" ? tr(o) : o;
    const l = lang();
    if (l === "ru") return o.ru || o.uz;
    if (l === "en") return o.en || tr(o.uz);
    if (l === "lat") return tr(o.uz);
    return o.uz;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const H = (o) => esc(L(o));
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const fmt = (v, d = 1) => { if (!isFinite(v)) return "—"; const s = v.toFixed(d); return lang() === "en" ? s : s.replace(".", ","); };
  const App = () => window.EkoApp;
  const flags = () => { const a = App(); if (!a) return {}; a.state.flags = a.state.flags || {}; return a.state.flags; };
  const once = (k, n, why) => { const a = App(); if (!a) return false; const f = flags(); if (f[k]) return false; f[k] = true; a.addXp(n, why); if (a.save) a.save(); return true; };
  const toast = (m) => { const a = App(); if (a && a.toast) a.toast(m); };
  const LX = () => window.EkoLabXona;
  const uni = () => { const c = document.documentElement.classList; if (c.contains("stage-maktab")) return false; if (c.contains("stage-uni")) return true; return !window.EkoProfile || EkoProfile.stage !== "maktab"; };
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WHY = "Лаборатория хонаси: таҳлил";

  const TX = {
    title: t3("Таҳлил жараёнлари ва микроскоп", "Методики анализа и микроскоп", "Analysis procedures & microscope"),
    lead: t3("Ҳақиқий экологик лабораториядаги каби босқичма-босқич ишланг: намуна олинг, асбобни калибрланг, ўлчанг ва ҳисобот тузинг. Ҳар бир қадам юқоридаги идиш ва асбобларда бажарилади, натижа асбоб кўрсаткичидан олинади.", "Работайте шаг за шагом, как в настоящей экологической лаборатории: отбор пробы, калибровка, измерение, протокол. Каждый шаг выполняется в сосуде и приборах выше, результат берётся с прибора.", "Work step by step like a real environmental lab: sample, calibrate, measure, report. Every step runs in the vessel and instruments above; results come straight from the instrument."),
    micro: t3("Микроскоп", "Микроскоп", "Microscope"), water: t3("Сув сифати", "Качество воды", "Water quality"), soil: t3("Тупроқ таҳлили", "Анализ почвы", "Soil analysis"), air: t3("Ҳаво сифати", "Качество воздуха", "Air quality"), dust: t3("Чанг таҳлили", "Анализ пыли", "Dust analysis"),
    sample: t3("Намуна", "Проба", "Sample"), site: t3("Жой", "Место", "Site"),
    run: t3("Бажариш", "Выполнить", "Run"), runAll: t3("Барча қадамларни бажариш", "Выполнить все шаги", "Run all steps"), reset: t3("Қайта бошлаш", "Начать заново", "Start over"),
    done: t3("бажарилди", "выполнено", "done"), report: t3("Таҳлил баённомаси", "Протокол анализа", "Analysis report"), norms: t3("Меъёрлар", "Нормативы", "Standards"),
    uniOnly: t3("🔒 университет босқичи", "🔒 университетский этап", "🔒 university stage"),
    ppe: t3("⛔ Аввал ҳимоя кийимини кийинг (халат, кўзойнак, қўлқоп).", "⛔ Сначала наденьте халат, очки и перчатки.", "⛔ Put on the coat, goggles and gloves first."),
    wait: t3("Лаборатория юкланмоқда…", "Лаборатория загружается…", "The lab is loading…"),
    nothing: t3("Асбоб бу қадамда натижа бермади — олдинги қадамларни бажаринг.", "Прибор не дал результата — выполните предыдущие шаги.", "No reading at this step — run the earlier steps first."),
    mag: t3("Катталаштириш", "Увеличение", "Magnification"), focus: t3("Фокус", "Фокус", "Focus"), fov: t3("Кўриш майдони", "Поле зрения", "Field of view"),
    seen: t3("Кўриниб турибди", "В поле зрения", "In view"), tiny: t3("кўриш учун катталаштиринг", "увеличьте, чтобы увидеть", "zoom in to see"),
    light: t3("Ёруғлик", "Освещение", "Light"), toMicro: t3("Микроскопда кўриш", "Посмотреть в микроскоп", "View under the microscope"),
    print: t3("Чоп этиш / PDF", "Печать / PDF", "Print / PDF"),
    src: t3("Меъёрлар: ЖССТ ичимлик суви сифати бўйича қўлланма (4-нашр, 2017), ЖССТ ҳаво сифати бўйича глобал тавсиялар (2021), O‘zDSt 950:2011 «Ичимлик суви». Намуналар таркиби — типик адабиёт қийматлари асосида моделлаштирилган.", "Нормативы: Руководство ВОЗ по качеству питьевой воды (4-е изд., 2017), Глобальные рекомендации ВОЗ по качеству воздуха (2021), O‘zDSt 950:2011 «Питьевая вода». Составы проб смоделированы по типичным литературным значениям.", "Standards: WHO Guidelines for Drinking-water Quality (4th ed., 2017), WHO Global Air Quality Guidelines (2021), O‘zDSt 950:2011 Drinking water. Sample compositions are modelled from typical literature values.")
  };

  /* ---------- Микроскоп ---------- */
  /* Объект турлари: [номи, ўлчам мкм [мин, макс], зичлик (дона/мм²), чизиш тури, ранг, ҳаракат] */
  const OB = {
    silt: [t3("лой заррачалари", "частицы ила", "silt particles"), [2, 40], 60, "grain", "#a8a29e"],
    diatom: [t3("диатом сув ўтлари", "диатомовые водоросли", "diatoms"), [20, 80], 25, "diatom", "#ca8a04"],
    spiro: [t3("спирогира (ипсимон яшил сув ўти)", "спирогира (нитчатая водоросль)", "Spirogyra (filamentous alga)"), [30, 40], 2, "fil", "#16a34a"],
    rotif: [t3("коловратка", "коловратка", "rotifer"), [150, 300], 1.2, "cell", "#fda4af", 1],
    chlor: [t3("хлорелла (бир ҳужайрали сув ўти)", "хлорелла (одноклеточная водоросль)", "Chlorella (single-celled alga)"), [3, 8], 900, "dot", "#22c55e"],
    param: [t3("туфелька инфузорияси (Paramecium)", "инфузория-туфелька (Paramecium)", "Paramecium"), [180, 280], 3, "cell", "#fde68a", 1],
    micro: [t3("цианобактериялар колонияси (Microcystis)", "колония цианобактерий (Microcystis)", "cyanobacteria colony (Microcystis)"), [60, 200], 4, "cluster", "#65a30d"],
    daph: [t3("дафния (сув бургаси)", "дафния (водяная блоха)", "Daphnia (water flea)"), [1000, 2000], 0.12, "daph", "#fcd34d", 1],
    floc: [t3("фаол лой пағалари (бактериялар)", "хлопья активного ила (бактерии)", "activated-sludge flocs (bacteria)"), [80, 500], 10, "floc", "#78350f"],
    rods: [t3("таёқчасимон бактериялар", "палочковидные бактерии", "rod-shaped bacteria"), [1.5, 4], 2500, "rod", "#7c2d12", 1],
    vort: [t3("сувойка (Vorticella)", "сувойка (Vorticella)", "Vorticella"), [40, 80], 4, "bell", "#bae6fd"],
    filb: [t3("ипсимон бактериялар", "нитчатые бактерии", "filamentous bacteria"), [1, 2], 20, "hypha", "#57534e"],
    quartz: [t3("кварц доналари", "зёрна кварца", "quartz grains"), [50, 500], 18, "grain", "#e7e5e4"],
    clay: [t3("гил агрегатлари", "глинистые агрегаты", "clay aggregates"), [20, 200], 30, "grain", "#92400e"],
    hypha: [t3("замбуруғ гифалари", "гифы грибов", "fungal hyphae"), [3, 6], 15, "hypha", "#f5f5f4"],
    nema: [t3("нематода (тупроқ чувалчанги)", "нематода", "nematode"), [300, 900], 0.6, "worm", "#fef3c7", 1],
    org: [t3("ўсимлик қолдиқлари", "растительные остатки", "plant debris"), [100, 600], 4, "fiber", "#3f6212"],
    soot: [t3("қурум (PM2,5, ёниш маҳсули)", "сажа (PM2,5, продукт горения)", "soot (PM2.5, combustion)"), [1, 8], 1800, "soot", "#111827"],
    mineral: [t3("минерал чанг (PM10)", "минеральная пыль (PM10)", "mineral dust (PM10)"), [3, 40], 220, "grain", "#b45309"],
    pollen: [t3("гул чанги", "пыльца", "pollen"), [25, 40], 6, "pollen", "#facc15"],
    salt: [t3("туз кристаллари (Орол чанги)", "кристаллы соли (аральская пыль)", "salt crystals (Aral dust)"), [10, 60], 50, "cube", "#f8fafc"],
    fibre: [t3("толалар (матолар, микропластик)", "волокна (ткани, микропластик)", "fibres (textiles, microplastic)"), [300, 1200], 1, "fiber", "#3b82f6"],
    nacl: [t3("NaCl куб кристаллари", "кубические кристаллы NaCl", "cubic NaCl crystals"), [80, 400], 10, "cube", "#f1f5f9"],
    cuso4: [t3("CuSO₄·5H₂O кристаллари (триклин)", "кристаллы CuSO₄·5H₂O (триклинные)", "CuSO₄·5H₂O crystals (triclinic)"), [100, 600], 6, "rhomb", "#38bdf8"],
    tapp: [t3("ягона заррачалар (тоза сув)", "единичные частицы (чистая вода)", "a few particles (clean water)"), [2, 20], 3, "grain", "#cbd5e1"]
  };
  const MS = {
    river: [t3("Дарё суви (Сирдарё)", "Речная вода (Сырдарья)", "River water (Syr Darya)"), ["silt", "diatom", "spiro", "rotif", "chlor"], "#eef6ff"],
    pond: [t3("Эвтрофик кўл суви", "Вода эвтрофного озера", "Eutrophic pond water"), ["chlor", "param", "micro", "spiro", "daph", "diatom"], "#f0fdf4"],
    wastew: [t3("Оқова сув (фаол лой)", "Сточная вода (активный ил)", "Wastewater (activated sludge)"), ["floc", "rods", "vort", "filb", "param"], "#fef9ec"],
    tap: [t3("Водопровод суви", "Водопроводная вода", "Tap water"), ["tapp"], "#f8fafc"],
    soil: [t3("Тупроқ суспензияси", "Почвенная суспензия", "Soil suspension"), ["quartz", "clay", "hypha", "nema", "org", "rods"], "#fffbeb"],
    dust: [t3("Ҳаво чанги (фильтр)", "Пыль воздуха (фильтр)", "Airborne dust (filter)"), ["soot", "mineral", "pollen", "salt", "fibre"], "#f5f5f4"],
    cryst: [t3("Кристаллар (буғлатилган эритма)", "Кристаллы (упаренный раствор)", "Crystals (evaporated solution)"), ["nacl", "cuso4"], "#f8fafc"]
  };
  const MAGS = [[40, 4500], [100, 1800], [400, 450]];
  let mSamp = "pond", mMag = 1, mFocus = 50, mLight = 70, objs = [], raf = 0, lastT = 0, seenT = "";
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function genObjs() {
    const r = rng(mSamp.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
    objs = [];
    MS[mSamp][1].forEach((k) => {
      const [, sz, dens, kind, col, mv] = OB[k];
      const reg = sz[1] < 12 ? 600 : 4500, n = Math.min(400, Math.max(1, Math.round(dens * (reg / 1000) * (reg / 1000))));
      for (let i = 0; i < n; i++) {
        const s = sz[0] + (sz[1] - sz[0]) * r();
        objs.push({ k, kind, col, s, x: (r() - 0.5) * reg, y: (r() - 0.5) * reg, a: r() * 6.283, v: mv ? (0.15 + r() * 0.35) * s : 0, w: r(), z: r() });
      }
    });
  }
  function drawObj(c, o, px, t) {
    const s = o.s * px; if (s < 0.9) return false;
    c.save(); c.translate(o.x * px, o.y * px); c.rotate(o.a);
    c.fillStyle = o.col; c.strokeStyle = o.col; c.lineWidth = Math.max(1, s * 0.06);
    const al = (fill, a) => { c.globalAlpha = a; c.fill(); c.globalAlpha = 1; };
    switch (o.kind) {
      case "dot": c.beginPath(); c.arc(0, 0, s / 2, 0, 6.283); al(0, 0.85); if (s > 6) { c.fillStyle = "#14532d"; c.beginPath(); c.arc(s * 0.1, -s * 0.05, s * 0.18, 0, 6.283); c.fill(); } break;
      case "rod": c.beginPath(); c.ellipse(0, 0, s / 2, Math.max(0.6, s / 6), 0, 0, 6.283); al(0, 0.9); break;
      case "grain": { c.beginPath(); const n = 7; for (let i = 0; i < n; i++) { const a = i / n * 6.283, rr = s / 2 * (0.7 + 0.3 * Math.sin(i * 2.3 + o.w * 9)); c[i ? "lineTo" : "moveTo"](Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); al(0, o.k === "quartz" ? 0.55 : 0.8); c.globalAlpha = 0.5; c.strokeStyle = "#57534e"; c.stroke(); break; }
      case "diatom": c.beginPath(); c.ellipse(0, 0, s / 2, s / 7, 0, 0, 6.283); al(0, 0.7); c.strokeStyle = "#713f12"; c.globalAlpha = 0.6; for (let i = -4; i <= 4; i++) { c.beginPath(); c.moveTo(i * s / 11, -s / 9); c.lineTo(i * s / 11, s / 9); c.stroke(); } break;
      case "fil": { const len = s * 12, cw = s; c.globalAlpha = 0.6; for (let i = 0; i < 12; i++) { c.fillRect(-len / 2 + i * cw, -cw / 2, cw * 0.95, cw); } c.globalAlpha = 0.9; c.strokeStyle = "#14532d"; c.lineWidth = Math.max(1, cw * 0.12); c.beginPath(); for (let x = -len / 2; x <= len / 2; x += cw / 4) c.lineTo(x, Math.sin(x / cw * 1.6) * cw * 0.32); c.stroke(); break; }
      case "cell": c.beginPath(); c.ellipse(0, 0, s / 2, s / 4.5, 0, 0, 6.283); al(0, 0.5); c.globalAlpha = 0.8; c.strokeStyle = "#a16207"; c.stroke(); c.globalAlpha = 0.5; c.fillStyle = "#92400e"; c.beginPath(); c.arc(s * 0.05, 0, s * 0.08, 0, 6.283); c.fill(); if (s > 30) { c.strokeStyle = "#a16207"; for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283, x = Math.cos(a) * s / 2, y = Math.sin(a) * s / 4.5, k = 1 + 0.12 * Math.sin(t * 20 + i); c.beginPath(); c.moveTo(x, y); c.lineTo(x * 1.1 * k, y * 1.18 * k); c.stroke(); } } break;
      case "cluster": c.globalAlpha = 0.85; for (let i = 0; i < 60; i++) { const a = i * 2.4, rr = Math.sqrt(i / 60) * s / 2; c.beginPath(); c.arc(Math.cos(a) * rr, Math.sin(a) * rr, Math.max(0.6, s / 40), 0, 6.283); c.fill(); } c.globalAlpha = 1; break;
      case "daph": c.beginPath(); c.ellipse(0, 0, s / 2, s / 3, 0, 0, 6.283); al(0, 0.45); c.globalAlpha = 0.9; c.fillStyle = "#1f2937"; c.beginPath(); c.arc(s * 0.32, -s * 0.05, s * 0.06, 0, 6.283); c.fill(); c.strokeStyle = "#a16207"; c.beginPath(); c.moveTo(s * 0.35, -s * 0.15); c.quadraticCurveTo(s * 0.6, -s * 0.5, s * 0.75, -s * (0.3 + 0.1 * Math.sin(t * 6))); c.stroke(); break;
      case "floc": c.globalAlpha = 0.75; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(Math.cos(i * 1.9 + o.w) * s * 0.25, Math.sin(i * 2.7) * s * 0.22, s * (0.12 + 0.08 * Math.sin(i)), 0, 6.283); c.fill(); } c.fillStyle = "#451a03"; for (let i = 0; i < 30; i++) { c.beginPath(); c.arc(Math.cos(i * 2.39) * s * 0.33 * Math.sqrt(i / 30), Math.sin(i * 2.39) * s * 0.3 * Math.sqrt(i / 30), Math.max(0.5, s / 90), 0, 6.283); c.fill(); } c.globalAlpha = 1; break;
      case "bell": c.globalAlpha = 0.7; c.beginPath(); c.moveTo(-s / 2, -s / 2); c.quadraticCurveTo(0, s * 0.5, s / 2, -s / 2); c.closePath(); c.fill(); c.strokeStyle = "#0369a1"; c.lineWidth = Math.max(1, s * 0.03); c.beginPath(); c.moveTo(0, s * 0.05); c.quadraticCurveTo(s * 0.3 * Math.sin(t * 3), s * 0.8, 0, s * 1.6); c.stroke(); c.globalAlpha = 1; break;
      case "hypha": { const len = o.k === "filb" ? 60 * px : o.s * 70 * px; c.globalAlpha = 0.75; c.lineWidth = Math.max(0.8, s); c.beginPath(); c.moveTo(-len / 2, 0); c.bezierCurveTo(-len / 6, len * 0.25 * (o.w - 0.5), len / 6, -len * 0.2, len / 2, len * 0.1); c.stroke(); c.lineWidth = Math.max(0.6, s * 0.8); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * 0.1, len * 0.15, len * 0.2, len * 0.3); c.stroke(); c.globalAlpha = 1; break; }
      case "worm": c.globalAlpha = 0.8; c.lineCap = "round"; c.lineWidth = Math.max(1, s / 22); c.beginPath(); for (let i = 0; i <= 30; i++) { const x = -s / 2 + i / 30 * s; c.lineTo(x, Math.sin(i / 30 * 9 + t * 4) * s * 0.06); } c.stroke(); c.globalAlpha = 1; break;
      case "fiber": c.globalAlpha = 0.8; c.lineWidth = Math.max(0.8, s / (o.k === "fibre" ? 60 : 12)); c.beginPath(); c.moveTo(-s / 2, 0); c.bezierCurveTo(-s / 5, s * 0.2 * (o.w - 0.5), s / 5, -s * 0.15, s / 2, s * 0.05); c.stroke(); c.globalAlpha = 1; break;
      case "soot": c.globalAlpha = 0.85; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(Math.cos(i * 2.1) * s * 0.25, Math.sin(i * 1.3) * s * 0.25, s * 0.22, 0, 6.283); c.fill(); } c.globalAlpha = 1; break;
      case "pollen": c.beginPath(); c.arc(0, 0, s / 2, 0, 6.283); al(0, 0.85); c.strokeStyle = "#a16207"; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; c.beginPath(); c.moveTo(Math.cos(a) * s / 2, Math.sin(a) * s / 2); c.lineTo(Math.cos(a) * s * 0.62, Math.sin(a) * s * 0.62); c.stroke(); } break;
      case "cube": c.globalAlpha = 0.75; c.fillRect(-s / 2, -s / 2, s, s); c.globalAlpha = 0.9; c.strokeStyle = "#94a3b8"; c.strokeRect(-s / 2, -s / 2, s, s); c.beginPath(); c.moveTo(-s / 2, -s / 2); c.lineTo(-s / 3, -s * 0.66); c.lineTo(s * 0.66, -s * 0.66); c.lineTo(s / 2, -s / 2); c.stroke(); c.globalAlpha = 1; break;
      case "rhomb": c.globalAlpha = 0.75; c.beginPath(); c.moveTo(-s / 2, 0); c.lineTo(-s * 0.1, -s * 0.35); c.lineTo(s / 2, -s * 0.1); c.lineTo(s * 0.1, s * 0.3); c.closePath(); c.fill(); c.globalAlpha = 0.9; c.strokeStyle = "#0369a1"; c.stroke(); c.globalAlpha = 1; break;
    }
    c.restore();
    return true;
  }
  function drawMicro(t) {
    const cv = document.querySelector("#labxona [data-mcv]"); if (!cv) return;
    const c = cv.getContext("2d"); if (!c) return;
    const W = cv.width, R0 = W / 2, fov = MAGS[mMag][1], px = W / fov;
    c.clearRect(0, 0, W, W);
    c.save(); c.beginPath(); c.arc(R0, R0, R0 - 2, 0, 6.283); c.clip();
    c.fillStyle = MS[mSamp][2]; c.fillRect(0, 0, W, W);
    const blur = Math.abs(mFocus - 50) / 9;
    if (blur > 0.3 && "filter" in c) c.filter = `blur(${blur.toFixed(1)}px)`;
    c.translate(R0, R0);
    const vis = new Set();
    objs.forEach((o) => {
      if (Math.abs(o.x) * px > W || Math.abs(o.y) * px > W) return;
      if (drawObj(c, o, px, t)) { if (Math.hypot(o.x * px, o.y * px) < R0 + o.s * px / 2) vis.add(o.k); }
    });
    c.filter = "none";
    c.restore();
    /* Ёруғлик ва виньетка */
    const g = c.createRadialGradient(R0, R0, R0 * 0.55, R0, R0, R0);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${0.55 - mLight / 250})`);
    c.fillStyle = g; c.beginPath(); c.arc(R0, R0, R0 - 2, 0, 6.283); c.fill();
    if (mLight < 100) { c.fillStyle = `rgba(0,0,0,${(100 - mLight) / 180})`; c.beginPath(); c.arc(R0, R0, R0 - 2, 0, 6.283); c.fill(); }
    /* Масштаб чизиғи */
    const opts = [1000, 500, 200, 100, 50, 20, 10];
    const um = opts.find((u) => u * px <= W * 0.3) || 10, bw = um * px;
    c.fillStyle = "rgba(15,23,42,.75)"; c.fillRect(W - bw - 26, W - 36, bw + 16, 24);
    c.fillStyle = "#fff"; c.fillRect(W - bw - 18, W - 20, bw, 4);
    c.font = "bold 11px system-ui, sans-serif"; c.textAlign = "center"; c.fillText(um + " µm", W - 18 - bw / 2, W - 24);
    c.strokeStyle = "#1f2937"; c.lineWidth = 4; c.beginPath(); c.arc(R0, R0, R0 - 2, 0, 6.283); c.stroke();
    const txt = MS[mSamp][1].map((k) => [k, vis.has(k)]).map(([k, v]) => `<li class="${v ? "" : "muted"}"><span class="lxt-sw" style="background:${OB[k][4]}"></span>${H(OB[k][0])} <small>${OB[k][1][0]}–${OB[k][1][1]} µm${v ? "" : " · " + H(TX.tiny)}</small></li>`).join("");
    if (txt !== seenT) { seenT = txt; const ul = document.querySelector("#labxona [data-mseen]"); if (ul) ul.innerHTML = txt; }
  }
  function loop(ts) {
    raf = 0;
    const cv = document.querySelector("#labxona [data-mcv]");
    if (!cv || !SEC.classList.contains("page-on") || document.hidden) return;
    const dt = Math.min(0.05, (ts - (lastT || ts)) / 1000); lastT = ts;
    objs.forEach((o) => { if (!o.v) return; o.x += Math.cos(o.a) * o.v * dt; o.y += Math.sin(o.a) * o.v * dt; o.a += (o.z - 0.5) * dt * 0.8; if (Math.abs(o.x) > 2250) o.x = -Math.sign(o.x) * 2200; if (Math.abs(o.y) > 2250) o.y = -Math.sign(o.y) * 2200; });
    drawMicro(ts / 1000);
    if (!reduce && inView) raf = requestAnimationFrame(loop);
  }
  let inView = false, io = null;
  function startMicro() {
    const cv = document.querySelector("#labxona [data-mcv]"); if (!cv) return;
    if (!objs.length || objs.sample !== mSamp) { genObjs(); objs.sample = mSamp; }
    drawMicro(0);
    if (io) io.disconnect();
    if ("IntersectionObserver" in window) { io = new IntersectionObserver((en) => { inView = en.some((e) => e.isIntersecting); if (inView && !raf && !reduce) raf = requestAnimationFrame(loop); }); io.observe(cv); }
  }
  function microHtml() {
    return `<div class="lxt-micro">
      <div class="lxt-eye"><canvas data-mcv width="420" height="420" role="img" aria-label="${H(TX.micro)}: ${H(MS[mSamp][0])}, ×${MAGS[mMag][0]}"></canvas></div>
      <div class="lxt-ctl">
        <div><small class="muted">${H(TX.sample)}</small><div class="lx-chips">${Object.keys(MS).map((k) => `<button type="button" class="chip" data-ms="${k}" aria-pressed="${k === mSamp}">${H(MS[k][0])}</button>`).join("")}</div></div>
        <div><small class="muted">${H(TX.mag)}</small><div class="lx-chips">${MAGS.map(([m], i) => `<button type="button" class="chip" data-mm="${i}" aria-pressed="${i === mMag}">×${m}</button>`).join("")}</div>
          <p class="small muted">${H(TX.fov)}: ${fmt(MAGS[mMag][1] / 1000, 2)} мм · ${H(t3("окуляр ×10, объектив", "окуляр ×10, объектив", "eyepiece ×10, objective"))} ×${MAGS[mMag][0] / 10}</p></div>
        <label class="lxt-rng">${H(TX.focus)} <input type="range" min="0" max="100" value="${mFocus}" data-mf></label>
        <label class="lxt-rng">${H(TX.light)} <input type="range" min="20" max="100" value="${mLight}" data-ml></label>
        <h5>${H(TX.seen)}</h5><ul class="lxt-seen" data-mseen></ul>
        <p class="small muted">${H(t3("Қоида: аввал энг кичик катталаштиришда (×40) объектни марказга олинг, кейин ×100, ×400. Препарат устига қоплағич шиша ёпилади; ×400 да фақат майин фокус винти билан ишланг.", "Правило: сначала найдите объект на малом увеличении (×40), затем ×100, ×400. Препарат накрывают покровным стеклом; на ×400 работайте только микровинтом.", "Rule: find the object at the lowest power (×40) first, then ×100 and ×400. Use a cover slip, and only the fine-focus knob at ×400."))}</p>
      </div></div>`;
  }

  /* ---------- Жараёнлар ---------- */
  const O3 = { street: 70, ind: 60, class: 15, mount: 95, aral: 55 };
  const WS = [["tap", "m"], ["river", "m"], ["pond", "m"], ["wastew", "m"], ["kdr", "m"], ["aral", "m"], ["rain", "m"], ["well", "u"]];
  const SS = [["soilboz", "m"], ["soilsal", "m"], ["soilfert", "m"], ["soilacid", "m"], ["soilind", "u"]];
  const MSOF = { tap: "tap", river: "river", pond: "pond", wastew: "wastew", kdr: "river", aral: "cryst", rain: "tap", well: "tap" };
  const NAT = ["river", "pond", "aral", "kdr"];
  const sel = { water: "river", soil: "soilboz", air: "street", dust: "aral" };
  const res = { water: {}, soil: {}, air: {}, dust: {} };
  let ptab = "water";
  const api = () => LX();
  const reset = (v) => api().reset(v);
  const add = (id, a) => api().add(id, a);
  const eq = (id, arg) => api().eq2(id, arg);

  function hardCard() {
    const s = api().state, V = s.V || 0; if (!V) return "";
    const n = (s.tot.Ca || 0) + (s.tot.Mg || 0), hard = 2 * n / V * 1000, vE = n / 0.05;
    const lv = hard <= 7 ? ["ok", t3("меъёрда (≤ 7 ммоль-экв/л)", "в норме (≤ 7 ммоль-экв/л)", "within limit (≤ 7 mmol-eq/L)")] : ["bad", t3("меъёрдан юқори — қаттиқ сув", "выше нормы — жёсткая вода", "above limit — hard water")];
    return `<table class="l3-tbl lx-mt"><tr><td>${H(t3("Намуна ҳажми", "Объём пробы", "Aliquot"))}</td><td><b>${fmt(V, 0)} мл</b></td></tr><tr><td>V(ЭДТА 0,05 М)</td><td><b>${fmt(vE, 2)} мл</b></td></tr><tr><td>${H(t3("Умумий қаттиқлик", "Общая жёсткость", "Total hardness"))}</td><td><b>${fmt(hard, 2)} ммоль-экв/л</b> <span class="lx-lvl lx-${lv[0]}">${H(lv[1])}</span></td></tr></table><p class="small muted">Ж = 2·c(ЭДТА)·V(ЭДТА)·1000 / V(${H(t3("намуна", "пробы", "sample"))}); pH 10 (NH₃ буфер), ${H(t3("индикатор — эриохром қора Т: вино-қизилдан кўкка.", "индикатор эриохром чёрный Т: от винно-красного к синему.", "indicator Eriochrome Black T: wine-red to blue."))}</p>`;
  }
  function o3Card(site) {
    const v = O3[site] || 50, r = v / 100;
    return `<table class="l3-tbl lx-mt"><tr><td>O₃ (8 ${H(t3("соат", "ч", "h"))})</td><td><b>${v} мкг/м³</b> <span class="lx-lvl lx-${r > 1 ? "bad" : r > 0.6 ? "mid" : "ok"}">${r > 1 ? "> ЖССТ" : "✓"}</span></td></tr></table><p class="small muted">${H(t3("Электрокимёвий O₃ сенсори. ЖССТ: 100 мкг/м³ (8 соатлик ўртача). Озон шаҳардан ташқарида ва тоғларда юқорироқ: у NO₂ ва қуёш нуридан ҳосил бўлиб, шаҳарда NO билан парчаланади.", "Электрохимический датчик O₃. ВОЗ: 100 мкг/м³ (8 ч). Озон выше за городом и в горах: он образуется из NO₂ на солнце и разрушается NO в городе.", "Electrochemical O₃ sensor. WHO: 100 µg/m³ (8-h mean). Ozone is higher outside cities and in mountains: it forms from NO₂ in sunlight and is destroyed by NO in town."))}</p>`;
  }
  const S_ = (t, run, o) => Object.assign({ t, run }, o || {});
  const PROT = {
    water: () => {
      const w = sel.water, bod = w === "wastew" ? 30 : 280;
      return [
        S_(t3("Намуна олиш: шишани намуна суви билан 3 марта чайинг, ҳаво пуфакчасиз тўлдиринг, ёрлиқ ёпиштиринг (жой, сана, вақт). +4 °C да сақланг, 24 соат ичида таҳлил қилинг.", "Отбор пробы: ополосните склянку пробой 3 раза, наполните без пузырей, наклейте этикетку (место, дата, время). Храните при +4 °C, анализ в течение 24 ч.", "Sampling: rinse the bottle 3× with the sample, fill without bubbles and label it (site, date, time). Keep at +4 °C and analyse within 24 h."), null),
        S_(t3("pH-метрни калибрлаш: буфер pH 7 ва pH 4 эритмаларида.", "Калибровка pH-метра по буферам pH 7 и pH 4.", "Calibrate the pH meter in pH 7 and pH 4 buffers."), () => { reset("beaker"); add("buf7", 50); eq("cal"); reset("beaker"); add("buf4", 50); eq("cal"); }, { m: 1 }),
        S_(t3("Стаканга 100 мл намуна қуйинг ва ҳароратини ўлчанг.", "Налейте 100 мл пробы в стакан и измерьте температуру.", "Pour 100 mL of sample into a beaker and measure its temperature."), () => { reset("beaker"); add(w, 100); eq("therm"); }, { m: 1 }),
        S_(t3("pH ни ўлчанг (электродни дистиллят билан чайиб, намунага ботиринг).", "Измерьте pH (ополосните электрод дистиллятом и опустите в пробу).", "Measure pH (rinse the electrode with distilled water, then immerse it)."), () => eq("phm"), { m: 1 }),
        S_(t3("Электр ўтказувчанлик ва TDS (эриган тузлар).", "Электропроводность и TDS (растворённые соли).", "Conductivity and TDS (dissolved salts)."), () => eq("cond"), { m: 1 }),
        S_(t3("Лойқаликни турбидиметрда ўлчанг.", "Измерьте мутность турбидиметром.", "Measure turbidity with the turbidimeter."), () => eq("turb"), { m: 1 }),
        S_(t3("Эриган кислород (DO) — оксиметр.", "Растворённый кислород (DO) — оксиметр.", "Dissolved oxygen (DO) — oxygen meter."), () => eq("oxy"), { m: 1 }),
        S_(t3("Тест-тасма: NO₃⁻, NO₂⁻, NH₄⁺, PO₄³⁻, қаттиқлик, Fe, Cl⁻.", "Тест-полоска: NO₃⁻, NO₂⁻, NH₄⁺, PO₄³⁻, жёсткость, Fe, Cl⁻.", "Test strip: NO₃⁻, NO₂⁻, NH₄⁺, PO₄³⁻, hardness, Fe, Cl⁻."), () => eq("strip"), { m: 1 }),
        S_(t3("Умумий қаттиқлик: ЭДТА билан комплексонометрик титрлаш (бюретка).", "Общая жёсткость: комплексонометрическое титрование ЭДТА (бюретка).", "Total hardness: EDTA complexometric titration (burette)."), () => hardCard(), { u: 1, card: 1 }),
        S_(t3("Оғир металлар: атом-абсорбцион спектрометр (Cu, Pb, Zn, Cd).", "Тяжёлые металлы: атомно-абсорбционный спектрометр (Cu, Pb, Zn, Cd).", "Heavy metals: atomic absorption spectrometer (Cu, Pb, Zn, Cd)."), () => eq("aas"), { u: 1, m: 1 }),
        S_(t3(`БПК₅: кислород шишасига ${bod} мл намуна${bod < 250 ? " + суюлтирувчи сув" : ""}, аэрация, 20 °C да 5 сутка қоронғида.`, `БПК₅: в кислородную склянку ${bod} мл пробы${bod < 250 ? " + разбавляющая вода" : ""}, аэрация, 5 суток при 20 °C в темноте.`, `BOD₅: ${bod} mL of sample${bod < 250 ? " + dilution water" : ""} in a BOD bottle, aerate, 5 days at 20 °C in the dark.`), () => { reset("bod"); add(w, bod); if (bod < 250) add("water", 250); eq("aer"); eq("bod"); }, { u: 1, m: 1 }),
        S_(t3("Сув ҳавзасида тиниқлик: Секки диски.", "Прозрачность водоёма: диск Секки.", "Water-body clarity: Secchi disk."), () => { reset("beaker"); add(w, 100); eq("secchi"); }, { m: 1, skip: !NAT.includes(w) }),
        S_(t3("Бир томчи намунани микроскопда кўринг.", "Рассмотрите каплю пробы под микроскопом.", "Look at a drop of the sample under the microscope."), () => { openMicro(MSOF[w] || "river"); return ""; }, { micro: 1 })
      ];
    },
    soil: () => {
      const s = sel.soil;
      return [
        S_(t3("Намуна олиш: бур билан 0–20 см чуқурликдан «конверт» усулида 5 нуқтадан, аралаштириб 0,5 кг ўртача намуна. Ҳавода қуритинг, ҳовончада майдаланг, 1 мм элакдан ўтказинг.", "Отбор: буром с 0–20 см методом «конверта» из 5 точек, смешать — средняя проба 0,5 кг. Высушить на воздухе, растереть в ступке, просеять через сито 1 мм.", "Sampling: auger 0–20 cm at 5 points in an envelope pattern, mix into a 0.5 kg composite. Air-dry, grind in a mortar and pass through a 1 mm sieve."), null),
        S_(t3("Намлик: 10 г тупроқни 105 °C да қуритиш шкафида доимий массагача.", "Влажность: 10 г почвы в сушильном шкафу при 105 °C до постоянной массы.", "Moisture: dry 10 g of soil at 105 °C to constant mass."), () => { reset("beaker"); add(s, 10); eq("oven"); }, { m: 1 }),
        S_(t3("Механик таркиб: элаклар тўплами ва чўктириш (қум, чанг, гил).", "Гранулометрический состав: набор сит и отмучивание (песок, пыль, глина).", "Texture: sieve stack and sedimentation (sand, silt, clay)."), () => eq("sieve"), { m: 1 }),
        S_(t3("Органик модда (гумус): муфель печида 550 °C да куйдириш (LOI).", "Органическое вещество (гумус): прокаливание в муфеле при 550 °C (LOI).", "Organic matter (humus): loss on ignition at 550 °C in the muffle furnace."), () => eq("muffle"), { u: 1, m: 1 }),
        S_(t3("Сувли сўрим 1:5: 10 г тупроқ + 50 мл дистиллят, 5 дақиқа чайқатиш, центрифуга.", "Водная вытяжка 1:5: 10 г почвы + 50 мл дистиллята, встряхивание 5 мин, центрифуга.", "1:5 water extract: 10 g soil + 50 mL distilled water, shake 5 min, centrifuge."), () => { add("water", 50); eq("shake"); eq("cent"); }, { m: 1 }),
        S_(t3("Сўримда pH(H₂O).", "pH(H₂O) вытяжки.", "pH(H₂O) of the extract."), () => eq("phm"), { m: 1 }),
        S_(t3("Шўрланиш: сўримнинг электр ўтказувчанлиги EC₁:₅.", "Засолённость: электропроводность вытяжки EC₁:₅.", "Salinity: electrical conductivity EC₁:₅."), () => eq("cond"), { m: 1 }),
        S_(t3("Озиқ моддалар: тест-тасма (NO₃⁻, NH₄⁺, PO₄³⁻).", "Элементы питания: тест-полоска (NO₃⁻, NH₄⁺, PO₄³⁻).", "Nutrients: test strip (NO₃⁻, NH₄⁺, PO₄³⁻)."), () => eq("strip"), { m: 1 }),
        S_(t3("Алмашинувчи кислоталик: 10 г тупроқ + 25 мл 1 М KCl, чайқатиш, pH(KCl).", "Обменная кислотность: 10 г почвы + 25 мл 1 М KCl, встряхивание, pH(KCl).", "Exchangeable acidity: 10 g soil + 25 mL 1 M KCl, shake, pH(KCl)."), () => { reset("beaker"); add(s, 10); add("kcl1", 25); eq("shake"); eq("phm"); }, { u: 1, m: 1 }),
        S_(t3("Оғир металлар: HNO₃ билан парчалаб, ААС да.", "Тяжёлые металлы: разложение HNO₃ и ААС.", "Heavy metals: HNO₃ digestion, then AAS."), () => eq("aas"), { u: 1, m: 1 }),
        S_(t3("Тупроқ суспензиясини микроскопда кўринг: доналар, гифалар, нематодалар.", "Почвенная суспензия под микроскопом: зёрна, гифы, нематоды.", "Soil suspension under the microscope: grains, hyphae, nematodes."), () => { openMicro("soil"); return ""; }, { micro: 1 })
      ];
    },
    air: () => {
      const a = sel.air;
      return [
        S_(t3("Тайёргарлик: асбобларни ер сатҳидан 1,5–2 м баландликда, бино ва дарахтлардан узоқда ўрнатинг. Об-ҳаво (ҳарорат, шамол, намлик) ва вақтни ёзинг; ҳар бир ўлчов камида 20 дақиқа.", "Подготовка: приборы на высоте 1,5–2 м, вдали от зданий и деревьев. Запишите погоду (температура, ветер, влажность) и время; каждое измерение не менее 20 минут.", "Setup: place instruments 1.5–2 m above ground, away from buildings and trees. Record the weather (temperature, wind, humidity) and time; each reading lasts at least 20 min."), null),
        S_(t3("CO₂ ва CO: NDIR газоанализатор.", "CO₂ и CO: газоанализатор NDIR.", "CO₂ and CO: NDIR gas analyser."), () => eq("gas", a), { m: 1 }),
        S_(t3("Чанг заррачалари PM2,5 ва PM10: лазерли ҳисоблагич.", "Частицы PM2,5 и PM10: лазерный счётчик.", "PM2.5 and PM10: laser particle counter."), () => eq("pm", a), { m: 1 }),
        S_(t3("Озон O₃: электрокимёвий сенсор.", "Озон O₃: электрохимический датчик.", "Ozone O₃: electrochemical sensor."), () => o3Card(a), { card: 1 }),
        S_(t3("SO₂ ва NO₂: аспиратор билан 100 л ҳавони ютувчи эритма орқали ўтказинг.", "SO₂ и NO₂: прокачайте аспиратором 100 л воздуха через поглотительный раствор.", "SO₂ and NO₂: draw 100 L of air through an absorbing solution with the sampling pump."), () => { reset("flask"); if (uni()) add("griess", 10); add("water", 40); eq("asp", a + ":100"); }, { m: 1 }),
        S_(t3("Ютувчи эритманинг pH и: SO₂ ва NO₂ сувда кислота ҳосил қилади (кислотали ёмғир).", "pH поглотительного раствора: SO₂ и NO₂ образуют в воде кислоты (кислотные дожди).", "pH of the absorbing solution: SO₂ and NO₂ form acids in water (acid rain)."), () => eq("phm"), { m: 1 }),
        S_(t3("NO₂ — Грисс реактиви, спектрофотометр 540 нм.", "NO₂ — реактив Грисса, спектрофотометр 540 нм.", "NO₂ — Griess reagent, spectrophotometer at 540 nm."), () => eq("spec", 540), { u: 1, m: 1 })
      ];
    },
    dust: () => {
      const a = sel.dust;
      return [
        S_(t3("Фильтрни 24 соат эксикаторда сақлаб, аналитик тарозида тортинг (m₀).", "Выдержите фильтр 24 ч в эксикаторе и взвесьте на аналитических весах (m₀).", "Condition the filter 24 h in a desiccator and weigh it on the analytical balance (m₀)."), null),
        S_(t3("Аспиратор билан 1000 л (1 м³) ҳавони фильтр орқали ўтказинг.", "Прокачайте аспиратором 1000 л (1 м³) воздуха через фильтр.", "Draw 1000 L (1 m³) of air through the filter."), () => { reset("flask"); add("water", 50); eq("asp", a + ":1000"); }, { m: 1 }),
        S_(t3("Гравиметрия: фильтрни қайта тортинг, C = (m₁ − m₀) / V.", "Гравиметрия: повторно взвесьте фильтр, C = (m₁ − m₀) / V.", "Gravimetry: re-weigh the filter, C = (m₁ − m₀) / V."), () => eq("filt"), { m: 1 }),
        S_(t3("Лазерли ҳисоблагич билан таққосланг (PM2,5 / PM10).", "Сравните с лазерным счётчиком (PM2,5 / PM10).", "Compare with the laser counter (PM2.5 / PM10)."), () => eq("pm", a), { m: 1 }),
        S_(t3("Фильтрни микроскопда кўринг: қурум, минерал чанг, туз кристаллари, гул чанги, толалар.", "Фильтр под микроскопом: сажа, минеральная пыль, кристаллы соли, пыльца, волокна.", "Filter under the microscope: soot, mineral dust, salt crystals, pollen, fibres."), () => { openMicro("dust"); return ""; }, { micro: 1 }),
        S_(t3("Чанг манбаини аниқланг: Оролбўйида туз ва қум (NaCl, Na₂SO₄, пестицид қолдиқлари), шаҳарда қурум ва автомобиль чанги, саноат зонасида металл оксидлари.", "Определите источник: в Приаралье соль и песок (NaCl, Na₂SO₄, остатки пестицидов), в городе сажа и дорожная пыль, в промзоне оксиды металлов.", "Identify the source: salt and sand near the Aral (NaCl, Na₂SO₄, pesticide residues), soot and road dust in town, metal oxides in industrial zones."), null)
      ];
    }
  };
  const NORMS = {
    water: [["pH", "6,5–8,5 (O‘zDSt: 6–9)"], ["TDS", "≤ 1000 мг/л"], [t3("Лойқалик", "Мутность", "Turbidity"), "≤ 1 NTU (ЖССТ ideal), ≤ 5 NTU"], ["DO", t3("≥ 6 мг/л (балиқ хўжалиги)", "≥ 6 мг/л (рыбохозяйственные)", "≥ 6 mg/L (fisheries)")], ["NO₃⁻", "≤ 50 мг/л (O‘zDSt 45)"], ["NO₂⁻", "≤ 3 мг/л"], [t3("Қаттиқлик", "Жёсткость", "Hardness"), "≤ 7 ммоль-экв/л"], ["Pb / Cd", "≤ 10 / 3 мкг/л"], ["БПК₅", t3("≤ 3 мг/л (тоза ҳавза)", "≤ 3 мг/л (чистый водоём)", "≤ 3 mg/L (clean water body)")]],
    soil: [["pH(H₂O)", t3("6–8 кўпчилик экинлар учун қулай", "6–8 благоприятно для большинства культур", "6–8 suits most crops")], ["EC₁:₅", t3("< 0,15 мСм/см — шўрланмаган", "< 0,15 мСм/см — незасолённая", "< 0.15 mS/cm — non-saline")], [t3("Гумус", "Гумус", "Humus"), t3("бўз тупроқда 1–2 %, қора тупроқда 4–10 %", "в серозёме 1–2 %, в чернозёме 4–10 %", "1–2 % in serozem, 4–10 % in chernozem")], ["Pb", "≤ 32 мг/кг"], ["Cd", "≤ 2 мг/кг"], ["NO₃⁻", t3("≤ 130 мг/кг", "≤ 130 мг/кг", "≤ 130 mg/kg")]],
    air: [["PM2,5", t3("15 мкг/м³ (24 соат)", "15 мкг/м³ (24 ч)", "15 µg/m³ (24 h)")], ["PM10", t3("45 мкг/м³ (24 соат)", "45 мкг/м³ (24 ч)", "45 µg/m³ (24 h)")], ["NO₂", t3("25 мкг/м³ (24 соат)", "25 мкг/м³ (24 ч)", "25 µg/m³ (24 h)")], ["SO₂", t3("40 мкг/м³ (24 соат)", "40 мкг/м³ (24 ч)", "40 µg/m³ (24 h)")], ["O₃", t3("100 мкг/м³ (8 соат)", "100 мкг/м³ (8 ч)", "100 µg/m³ (8 h)")], ["CO", t3("4 мг/м³ (24 соат)", "4 мг/м³ (24 ч)", "4 mg/m³ (24 h)")], ["CO₂", t3("ёпиқ хонада < 1000 ppm", "в помещении < 1000 ppm", "indoors < 1000 ppm")]],
    dust: [["PM10", t3("45 мкг/м³ (24 соат)", "45 мкг/м³ (24 ч)", "45 µg/m³ (24 h)")], ["PM2,5", t3("15 мкг/м³ (24 соат)", "15 мкг/м³ (24 ч)", "15 µg/m³ (24 h)")], [t3("Чанг ёғилиши", "Пылевые выпадения", "Dust deposition"), t3("Оролбўйида йилига 1 га га 0,5–1 т гача", "в Приаралье до 0,5–1 т/га в год", "up to 0.5–1 t/ha a year near the Aral")]]
  };

  let BOX = null, busy = false;
  const clean = (h) => String(h || "").replace(/<div class="lx-lam">[\s\S]*?<\/div>/g, "").replace(/<(input|button|select)[^>]*>/g, "").replace(/ id="[^"]*"/g, "");
  function steps() { return PROT[ptab]().filter((s) => !s.skip); }
  function runStep(i) {
    const st = steps()[i]; if (!st || !st.run) return false;
    const x = api();
    if (!x) { toast(L(TX.wait)); return false; }
    if (st.u && !uni()) { toast(L(TX.uniOnly)); return false; }
    if (!st.micro && !st.card && !x.ppeOk()) { toast(L(TX.ppe)); return false; }
    const before = x.meterHtml;
    let out = "";
    try { out = st.run() || ""; } catch (e) { out = ""; }
    if (st.m) { const after = x.meterHtml; out = after && after !== before ? clean(after) : `<p class="small muted">${H(TX.nothing)}</p>`; }
    if (st.micro) out = `<p class="small">🔬 ${H(MS[mSamp][0])}</p>`;
    res[ptab][i] = out;
    return true;
  }
  function protHtml() {
    const list = steps(), R0 = res[ptab];
    const samples = ptab === "water" ? WS : ptab === "soil" ? SS : (LX() ? LX().airList : []).map((a) => [a.id, "m"]);
    const name = (id) => (ptab === "air" || ptab === "dust" ? L((LX().airList.find((a) => a.id === id) || {}).n) : LX() ? LX().name(id) : id);
    const doneN = Object.keys(R0).length, total = list.filter((s) => s.run && !(s.u && !uni())).length;
    const rep = list.map((s, i) => (R0[i] && !s.micro ? `<section class="lxt-rrow"><h6>${i + 1}. ${H(s.t).split(/[:.]/)[0]}</h6>${R0[i]}</section>` : "")).join("");
    return `<div class="lxt-samp"><small class="muted">${H(ptab === "air" || ptab === "dust" ? TX.site : TX.sample)}</small><div class="lx-chips">${samples.map(([id, st]) => { const lk = st === "u" && !uni(); return `<button type="button" class="chip" data-ps="${esc(id)}" aria-pressed="${sel[ptab] === id}"${lk ? " disabled" : ""}>${lk ? "🔒 " : ""}${esc(name(id))}</button>`; }).join("")}</div></div>
      <div class="lxt-bar"><button type="button" class="btn btn-primary" data-all><i class="fa-solid fa-forward" aria-hidden="true"></i> ${H(TX.runAll)}</button><button type="button" class="btn" data-preset><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> ${H(TX.reset)}</button><span class="small muted">${doneN} / ${total} ${H(TX.done)}</span></div>
      <ol class="lxt-steps">${list.map((s, i) => { const lk = s.u && !uni(); return `<li class="${R0[i] ? "is-done" : ""}${lk ? " is-lock" : ""}"><p>${H(s.t)}${lk ? ` <small class="muted">${H(TX.uniOnly)}</small>` : ""}</p>${s.run && !lk ? `<button type="button" class="chip" data-step="${i}"><i class="fa-solid ${s.micro ? "fa-microscope" : "fa-play"}" aria-hidden="true"></i> ${H(s.micro ? TX.toMicro : TX.run)}</button>` : ""}${R0[i] ? `<div class="lxt-out">${R0[i]}</div>` : ""}</li>`; }).join("")}</ol>
      ${rep ? `<details class="lxt-rep" open><summary><b><i class="fa-solid fa-file-lines" aria-hidden="true"></i> ${H(TX.report)}: ${esc(name(sel[ptab]))}</b></summary><p class="small muted">${new Date().toLocaleString(lang() === "ru" ? "ru-RU" : lang() === "en" ? "en-GB" : "uz-UZ")}</p>${rep}<button type="button" class="chip" data-print><i class="fa-solid fa-print" aria-hidden="true"></i> ${H(TX.print)}</button></details>` : ""}
      <details class="lxt-norm"><summary><b>${H(TX.norms)}</b></summary><table class="l3-tbl">${NORMS[ptab].map(([k, v]) => `<tr><td>${typeof k === "string" ? esc(k) : H(k)}</td><td>${typeof v === "string" ? esc(v) : H(v)}</td></tr>`).join("")}</table></details>`;
  }
  function body() { return ptab === "micro" ? microHtml() : protHtml(); }
  function render() {
    BOX = document.querySelector("#labxona [data-lx-tahlil]");
    if (!BOX) return;
    BOX.innerHTML = `<h3><i class="fa-solid fa-clipboard-list" aria-hidden="true"></i> ${H(TX.title)}</h3><p class="small muted">${H(TX.lead)}</p>
      <div class="lxe-tabs" role="tablist">${[["water", "fa-droplet"], ["soil", "fa-seedling"], ["air", "fa-wind"], ["dust", "fa-smog"], ["micro", "fa-microscope"]].map(([k, ic]) => `<button type="button" role="tab" class="chip" data-pt="${k}" aria-selected="${ptab === k}"><i class="fa-solid ${ic}" aria-hidden="true"></i> ${H(TX[k])}</button>`).join("")}</div>
      <div data-pbody>${body()}</div><p class="small muted">${H(TX.src)}</p>`;
    bind();
  }
  function reBody() { const b = BOX && BOX.querySelector("[data-pbody]"); if (!b) return; b.innerHTML = body(); bindBody(b); }
  function openMicro(s) { mSamp = s; ptab = "micro"; objs = []; render(); const b = BOX.querySelector("[data-pbody]"); if (b) b.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); once("lxt_micro", 1, WHY); }
  function bindBody(b) {
    if (ptab === "micro") {
      b.querySelectorAll("[data-ms]").forEach((x) => x.addEventListener("click", () => { mSamp = x.dataset.ms; objs = []; seenT = ""; reBody(); }));
      b.querySelectorAll("[data-mm]").forEach((x) => x.addEventListener("click", () => { mMag = +x.dataset.mm; seenT = ""; reBody(); }));
      const f = b.querySelector("[data-mf]"); if (f) f.addEventListener("input", () => { mFocus = +f.value; drawMicro(performance.now() / 1000); });
      const l = b.querySelector("[data-ml]"); if (l) l.addEventListener("input", () => { mLight = +l.value; drawMicro(performance.now() / 1000); });
      startMicro();
      return;
    }
    b.querySelectorAll("[data-ps]").forEach((x) => x.addEventListener("click", () => { sel[ptab] = x.dataset.ps; res[ptab] = {}; reBody(); }));
    b.querySelectorAll("[data-step]").forEach((x) => x.addEventListener("click", () => { const i = +x.dataset.step; const st = steps()[i]; if (runStep(i) && !st.micro) { reBody(); const li = BOX.querySelectorAll(".lxt-steps > li")[i]; if (li) li.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); } }));
    const all = b.querySelector("[data-all]");
    if (all) all.addEventListener("click", () => {
      if (busy) return; busy = true;
      const x = api(); if (x && !x.ppeOk()) { toast(L(TX.ppe)); busy = false; return; }
      res[ptab] = {};
      steps().forEach((s, i) => { if (s.run && !s.micro && !(s.u && !uni())) runStep(i); });
      busy = false; reBody();
      if (once("lxt_" + ptab + "_" + sel[ptab], 3, WHY)) toast("✅ " + L(TX[ptab]) + " +3 XP");
      const rep = BOX.querySelector(".lxt-rep"); if (rep) rep.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    const rs = b.querySelector("[data-preset]"); if (rs) rs.addEventListener("click", () => { res[ptab] = {}; reBody(); });
    const pr = b.querySelector("[data-print]");
    if (pr) pr.addEventListener("click", () => {
      const rep = b.querySelector(".lxt-rep"); if (!rep) return;
      const w = window.open("", "_blank"); if (!w) return;
      w.document.write(`<!doctype html><meta charset="utf-8"><title>${H(TX.report)}</title><style>body{font:14px system-ui,sans-serif;margin:24px;color:#0f172a}table{border-collapse:collapse;margin:6px 0}td{border:1px solid #cbd5e1;padding:4px 8px}h6{font-size:14px;margin:14px 0 4px}.lx-lvl{padding:1px 6px;border-radius:6px;background:#e2e8f0}.lx-ok{background:#dcfce7}.lx-bad{background:#fee2e2}.lx-warn,.lx-mid{background:#fef3c7}.lx-strippad{display:flex;flex-wrap:wrap;gap:8px}.lx-strippad span{display:inline-block;width:14px;height:14px;border:1px solid #94a3b8;margin-right:4px}button{display:none}</style><h2>Ekomun · ${H(TX.report)}</h2>${rep.innerHTML.replace(/<summary>[\s\S]*?<\/summary>/, `<h3>${H(TX[ptab])}</h3>`)}`);
      w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
    });
  }
  function bind() {
    BOX.querySelectorAll("[data-pt]").forEach((x) => x.addEventListener("click", () => { ptab = x.dataset.pt; render(); }));
    bindBody(BOX.querySelector("[data-pbody]"));
  }

  window.addEventListener("eko:lx-shell", render);
  if (document.querySelector("#labxona [data-lx-tahlil]")) render();
  window.EkoLabTahlil = { run: (p, s) => { ptab = p; if (s) sel[p] = s; res[p] = {}; steps().forEach((st, i) => { if (st.run && !st.micro && !(st.u && !uni())) runStep(i); }); render(); return res[p]; }, micro: (s, m) => { mSamp = s || mSamp; if (m != null) mMag = m; ptab = "micro"; objs = []; render(); }, get results() { return res; } };
})();
