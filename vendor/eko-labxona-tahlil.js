/* Экомун — 🧾 «Лаборатория хонаси»: экологик таҳлил маркази, Менделеев жадвали, реакция столи ва микроскоп.
   Таҳлил маркази ISO/IEC 17025 тартибида ишлайди: намуна олиш ва сақлаш (ISO 5667-3, ISO 18400),
   стандарт усул (ISO / EPA / ГОСТ), асбоб ва реактивлар, ўлчаш ноаниқлиги (k = 2), аниқлаш чегараси,
   сифат назорати (бланк, қўшимча намуна, такрорий намуна, стандарт намуна, Шухарт картаси) ва
   меъёрлар билан солиштириш (O‘zDSt 950:2011 ва СанПиН, ЖССТ 2021–2022, ЕИ 2020/2184, 2024/2881).
   Индекслар: сув ифлосланиш индекси (ИЗВ), US EPA ҳаво сифати индекси (AQI, 2024), тупроқ Zc (Саэт).
   Намуна қийматлари — Ўзбекистон шароити учун типик (адабиёт ва мониторинг ҳисоботларидан тахминий),
   ҳар бир ўлчашда тасодифий хатолик қўшилади. Бу ўқув модели: расмий хулоса учун аккредитацияланган
   лаборатория керак. Матнлар uz/ru/en; лотин алифбоси EkoLang.tr орқали. */
(() => {
  "use strict";
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
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dec = (v) => (lang() === "en" ? v : v.replace(".", ","));
  const fmt = (v, d = 1) => (isFinite(v) ? dec(Number(v).toFixed(d)) : "—");
  const sig = (v) => { if (!isFinite(v)) return "—"; const a = Math.abs(v); if (a === 0) return "0"; if (a >= 1e5) return dec(v.toExponential(1)).replace("e+", "·10^"); const d = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : Math.min(5, 2 - Math.floor(Math.log10(a))); return fmt(v, d); };
  const App = () => window.EkoApp;
  const once = (k, n) => { const a = App(); if (!a) return; a.state.flags = a.state.flags || {}; if (a.state.flags[k]) return; a.state.flags[k] = true; a.addXp(n, "Лаборатория хонаси"); if (a.save) a.save(); };
  const toast = (m) => { const a = App(); if (a && a.toast) a.toast(m); };
  const getJ = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } };
  const putJ = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  const D = () => window.EkoDavriy;
  /* Детерминистик тасодифий сонлар (такрорланадиган ўлчашлар) */
  const rng = (seed) => { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const gauss = (r) => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  /* ---------- Иш тартиби шаблонлари ---------- */
  const STEP = {
    elec: [t3("Электродни стандарт буфер/эритмалар билан калибрланг (2–3 нуқта).", "Откалибруйте электрод по стандартным буферам/растворам (2–3 точки).", "Calibrate the electrode with 2–3 standard buffers/solutions."), t3("Электродни дистилланган сув билан чайинг ва қуритинг.", "Ополосните электрод дистиллированной водой и промокните.", "Rinse the electrode with distilled water and blot dry."), t3("Намунага ботиринг, магнит аралаштиргични ёқинг, ҳарорат тузатмасини (ATC) текширинг.", "Погрузите в пробу, включите мешалку, проверьте термокомпенсацию (ATC).", "Immerse in the sample, stir, check temperature compensation (ATC)."), t3("Кўрсаткич барқарорлашгач (±0,01 / 30 с) ёзиб олинг.", "Запишите показание после стабилизации (±0,01 за 30 с).", "Record once the reading is stable (±0.01 over 30 s)."), t3("Такрорий ўлчанг ва ўртачасини олинг.", "Повторите измерение и возьмите среднее.", "Repeat and average.")],
    titr: [t3("Пипетка билан аниқ ҳажмли аликвота олинг (масалан, 100 мл).", "Отберите пипеткой точную аликвоту (например, 100 мл).", "Pipette an exact aliquot (e.g. 100 mL)."), t3("Буфер ва индикатор қўшинг.", "Добавьте буфер и индикатор.", "Add buffer and indicator."), t3("Бюреткадан стандарт эритма билан ранг кескин ўзгаргунча титрланг.", "Титруйте стандартным раствором из бюретки до резкого перехода окраски.", "Titrate from the burette with the standard until the sharp colour change."), t3("Сарфланган ҳажмдан натижани ҳисобланг: C = V·N·Э·1000 / V(намуна).", "Рассчитайте: C = V·N·Э·1000 / V(пробы).", "Calculate: C = V·N·Eq·1000 / V(sample)."), t3("Параллел титрлашлар фарқи 2 % дан ошмасин.", "Расхождение параллельных титрований не более 2 %.", "Parallel titrations must agree within 2 %.")],
    photo: [t3("Намунани 0,45 мкм мембранадан фильтрланг.", "Профильтруйте пробу через мембрану 0,45 мкм.", "Filter the sample through a 0.45 µm membrane."), t3("Рангли бирикма ҳосил қилувчи реактивни қўшинг ва белгиланган вақт кутинг.", "Добавьте реактив, образующий окрашенное соединение, и выдержите время.", "Add the colour-forming reagent and wait the set time."), t3("5 та стандартдан калибрлаш эгри чизиғини тузинг (R² ≥ 0,995).", "Постройте градуировку по 5 стандартам (R² ≥ 0,995).", "Build a 5-point calibration curve (R² ≥ 0.995)."), t3("Кюветани спектрофотометрга қўйиб, оптик зичликни ўлчанг.", "Измерьте оптическую плотность в кювете на спектрофотометре.", "Measure absorbance in a cuvette on the spectrophotometer."), t3("Бланкни айиринг ва эгри чизиқдан концентрацияни топинг.", "Вычтите холостую пробу и найдите концентрацию по градуировке.", "Subtract the blank and read concentration from the curve.")],
    grav: [t3("Идиш ёки фильтрни ўзгармас массагача қуритиб тортинг.", "Высушите и взвесьте тигель/фильтр до постоянной массы.", "Dry and weigh the dish/filter to constant mass."), t3("Намунани фильтрланг ёки буғлатинг.", "Профильтруйте или выпарите пробу.", "Filter or evaporate the sample."), t3("Қуритиш шкафида 105 °C (ёки 180 °C) да қуритинг.", "Высушите в сушильном шкафу при 105 °C (или 180 °C).", "Dry in the oven at 105 °C (or 180 °C)."), t3("Эксикаторда совутиб, аналитик тарозида тортинг.", "Охладите в эксикаторе и взвесьте на аналитических весах.", "Cool in a desiccator and weigh on the analytical balance."), t3("Массалар фарқидан натижани ҳисобланг.", "Рассчитайте результат по разности масс.", "Calculate from the mass difference.")],
    met: [t3("Намунани кислотада парчаланг (HNO₃ ёки «шоҳ ароғи», микротўлқинли ҳазм).", "Минерализуйте пробу кислотой (HNO₃ или царская водка, микроволновое разложение).", "Digest the sample in acid (HNO₃ or aqua regia, microwave)."), t3("Ўлчов колбасида деионланган сув билан суюлтиринг.", "Разбавьте деионизованной водой в мерной колбе.", "Dilute with deionised water in a volumetric flask."), t3("Кўп элементли стандартлар билан калибрланг, ички стандарт қўшинг.", "Откалибруйте по многоэлементным стандартам, добавьте внутренний стандарт.", "Calibrate with multi-element standards and add an internal standard."), t3("ААС ёки ИСП-МС да ўлчанг.", "Измерьте на ААС или ИСП-МС.", "Measure by AAS or ICP-MS."), t3("Стандарт намуна (CRM) натижаси сертификатдаги ±10 % ичида бўлсин.", "Результат по стандартному образцу (CRM) в пределах ±10 % от аттестованного.", "The certified reference material must read within ±10 %.")],
    gc: [t3("Органик эритувчи билан экстракция қилинг (гексан/ацетон, Сокслет ёки қаттиқ фазали).", "Экстрагируйте органическим растворителем (гексан/ацетон, Сокслет или ТФЭ).", "Extract with organic solvent (hexane/acetone, Soxhlet or SPE)."), t3("Экстрактни тозаланг (флоризил ёки силикагел колонкаси).", "Очистите экстракт (колонка с флорисилом или силикагелем).", "Clean up the extract (Florisil or silica column)."), t3("Азот оқимида 1 мл гача концентрланг, ички стандарт қўшинг.", "Сконцентрируйте в токе азота до 1 мл, добавьте внутренний стандарт.", "Concentrate under nitrogen to 1 mL and add an internal standard."), t3("Газ хроматографга (ГХ-МС / ЭЗД) юборинг.", "Введите в газовый хроматограф (ГХ-МС / ЭЗД).", "Inject into the gas chromatograph (GC-MS / ECD)."), t3("Ушланиш вақти ва масс-спектр бўйича аниқланг, ички стандарт бўйича ҳисобланг.", "Идентифицируйте по времени удерживания и масс-спектру, рассчитайте по внутреннему стандарту.", "Identify by retention time and mass spectrum; quantify by internal standard.")],
    micro: [t3("Намунани стерил идишга олинг (хлорли сувга Na₂S₂O₃), 5 ± 3 °C да 8 соат ичида етказинг.", "Отберите в стерильную посуду (для хлорированной воды — Na₂S₂O₃), доставьте при 5 ± 3 °C за 8 ч.", "Sample into sterile bottles (Na₂S₂O₃ for chlorinated water), deliver at 5 ± 3 °C within 8 h."), t3("Ламинар бокс ичида 100 мл ни 0,45 мкм мембранадан фильтрланг.", "В ламинарном боксе профильтруйте 100 мл через мембрану 0,45 мкм.", "In the laminar hood, filter 100 mL through a 0.45 µm membrane."), t3("Мембранани селектив озуқа муҳитига (Петри ликопчаси) қўйинг.", "Перенесите мембрану на селективную питательную среду (чашка Петри).", "Place the membrane on selective agar (Petri dish)."), t3("Термостатда инкубацияланг: 36 ± 2 °C, 18–24 соат (E. coli — 44 °C).", "Инкубируйте в термостате: 36 ± 2 °C, 18–24 ч (E. coli — 44 °C).", "Incubate: 36 ± 2 °C for 18–24 h (E. coli at 44 °C)."), t3("Типик колонияларни санаб, тасдиқловчи тест ўтказинг (оксидаза, индол).", "Подсчитайте типичные колонии, проведите подтверждающие тесты (оксидаза, индол).", "Count typical colonies and confirm (oxidase, indole).")],
    bio: [t3("Янги тупроқни 2 мм элакдан ўтказинг, намлигини 60 % сув сиғимига келтиринг.", "Просейте свежую почву через 2 мм, доведите влажность до 60 % ПВ.", "Sieve fresh soil to 2 mm and set moisture to 60 % of water-holding capacity."), t3("Ёпиқ идишда 25 °C да инкубацияланг.", "Инкубируйте в закрытом сосуде при 25 °C.", "Incubate in a closed jar at 25 °C."), t3("Ажралган CO₂ ни NaOH билан тутинг ёки ферментатив реакция маҳсулотини ўлчанг.", "Улавливайте CO₂ раствором NaOH или измерьте продукт ферментативной реакции.", "Trap released CO₂ in NaOH or measure the enzymatic product."), t3("BaCl₂ қўшиб, ортиқча NaOH ни HCl билан титрланг / фотометрда ўлчанг.", "Добавьте BaCl₂ и оттитруйте избыток NaOH кислотой HCl / измерьте фотометрически.", "Add BaCl₂ and back-titrate NaOH with HCl / read photometrically."), t3("Қуруқ тупроқ массасига ҳисобланг.", "Пересчитайте на массу сухой почвы.", "Express per dry soil mass.")],
    inst: [t3("Асбобни нол ва span газлари/фильтрлари билан текширинг.", "Проверьте прибор нулевым и поверочным газом/фильтром.", "Check the analyser with zero and span gas/filters."), t3("Намуна олиш баландлиги 1,5–4 м, тўсиқлардан узоқда жойлаштиринг.", "Установите пробозаборник на высоте 1,5–4 м вдали от препятствий.", "Place the inlet 1.5–4 m high, away from obstacles."), t3("Белгиланган ўртачалаш вақтида узлуксиз ўлчанг (1 соат / 24 соат).", "Измеряйте непрерывно в течение периода осреднения (1 ч / 24 ч).", "Measure continuously over the averaging period (1 h / 24 h)."), t3("Ҳарорат ва босимни ёзиб, стандарт шароитга келтиринг.", "Запишите температуру и давление, приведите к стандартным условиям.", "Log temperature and pressure; correct to standard conditions."), t3("Маълумотларни текшириб (валидация), меъёр билан солиштиринг.", "Проверьте данные (валидация) и сравните с нормативом.", "Validate the data and compare with the limit.")],
    sorb: [t3("Аспиратор оқимини калибрланг (масалан, 0,2–1 л/мин).", "Откалибруйте расход аспиратора (например, 0,2–1 л/мин).", "Calibrate the pump flow (e.g. 0.2–1 L/min)."), t3("Ҳавони сорбент найчаси / DNPH картриджи / ютувчи эритма орқали ўтказинг.", "Прокачайте воздух через сорбционную трубку / DNPH-картридж / поглотитель.", "Draw air through a sorbent tube / DNPH cartridge / impinger."), t3("Ҳажмни ёзинг (V = оқим × вақт) ва намунани 4 °C да ташинг.", "Запишите объём (V = расход × время), транспортируйте при 4 °C.", "Record volume (V = flow × time); transport at 4 °C."), t3("Термодесорбция ёки эритувчи билан ажратиб, ГХ-МС / ЮССХ да ўлчанг.", "Десорбируйте термически или растворителем, анализируйте на ГХ-МС / ВЭЖХ.", "Desorb thermally or with solvent; analyse by GC-MS / HPLC."), t3("Концентрация = модда массаси / ҳаво ҳажми.", "Концентрация = масса вещества / объём воздуха.", "Concentration = analyte mass / air volume.")],
    field: [t3("Асбобни жойида ишга туширинг ва текширинг.", "Включите и проверьте прибор на месте.", "Switch on and check the instrument on site."), t3("Намуна олиш нуқтасини GPS билан белгиланг.", "Отметьте точку отбора по GPS.", "Mark the sampling point by GPS."), t3("Ўлчанг ва барқарор кўрсаткични ёзинг.", "Измерьте и запишите стабильное показание.", "Measure and log the stable reading."), t3("Такрорланг (камида 3 марта).", "Повторите (не менее 3 раз).", "Repeat (at least 3 times).")],
    ext: [t3("Тупроқни ҳавода қуритиб, 1–2 мм элакдан ўтказинг.", "Высушите почву на воздухе и просейте через 1–2 мм.", "Air-dry the soil and sieve to 1–2 mm."), t3("Сўрувчи эритма билан белгиланган нисбатда силкитинг (масалан, 1:5).", "Встряхните с экстрагентом в заданном соотношении (например, 1:5).", "Shake with the extractant at the set ratio (e.g. 1:5)."), t3("Фильтрланг ёки центрифугаланг.", "Отфильтруйте или отцентрифугируйте.", "Filter or centrifuge."), t3("Сўримда кўрсаткични ўлчанг (фотометр, аланга фотометри ёки электрод).", "Измерьте показатель в вытяжке (фотометр, пламенный фотометр или электрод).", "Measure in the extract (photometer, flame photometer or electrode)."), t3("Қуруқ тупроққа ҳисобланг (мг/кг).", "Пересчитайте на сухую почву (мг/кг).", "Express per dry soil (mg/kg).")]
  };

  /* ---------- Кўрсаткичлар ---------- */
  /* [id, ном, бирлик, усул, шаблон, асбоблар, реактивлар, меъёрлар, нисбий стандарт оғиш, аниқлаш чегараси] */
  const P = (id, n, u, m, tp, eq, rg, lim, rsd, lod) => ({ id, n, u, m, tp, eq, rg, lim: lim || {}, rsd: rsd || 0.03, lod: lod || 0 });
  const SOILP = [
    P("ph", t3("pH (сувли сўрим 1:5)", "pH (водная вытяжка 1:5)", "pH (water, 1:5)"), "", "ISO 10390", "elec", ["phm", "shake"], ["buf4", "buf7", "buf10"], { agro: [6.0, 8.5] }, 0.006),
    P("ece", t3("Электр ўтказувчанлик (ECe)", "Электропроводность (ECe)", "Electrical conductivity (ECe)"), "дСм/м", "ISO 11265", "elec", ["cond", "shake", "cent"], ["kclstd"], { agro: 4 }, 0.03),
    P("salt", t3("Тузлар йиғиндиси (сувли сўрим)", "Сумма солей (водная вытяжка)", "Total soluble salts"), "%", "ГОСТ 26423–26428", "grav", ["shake", "oven", "bal"], ["agno3", "bacl2", "edta"], { agro: 0.3 }, 0.04),
    P("hum", t3("Гумус (органик модда)", "Гумус (органическое вещество)", "Humus (organic matter)"), "%", "ISO 14235 / Тюрин", "titr", ["plate", "burette"], ["k2cr2o7", "h2so4c", "mohr"], { agro: { min: 1.0 } }, 0.05),
    P("ntot", t3("Умумий азот (Кьелдаль)", "Общий азот (Кьельдаль)", "Total nitrogen (Kjeldahl)"), "%", "ISO 11261", "titr", ["kjel", "burette"], ["h2so4c", "naoh", "boric"], { agro: { min: 0.1 } }, 0.05),
    P("no3", t3("Нитрат азоти (NO₃⁻)", "Нитраты (NO₃⁻)", "Nitrate (NO₃⁻)"), "мг/кг", "ГОСТ 26951 (ион-селектив)", "ext", ["shake", "phm"], ["kal", "nstd"], { uz: 130 }, 0.06, 1),
    P("p", t3("Ҳаракатчан фосфор (P₂O₅, Мачигин)", "Подвижный фосфор (P₂O₅, Мачигин)", "Available phosphorus (P₂O₅, Machigin)"), "мг/кг", "ГОСТ 26205 / ISO 11263", "photo", ["shake", "spec"], ["nh42co3", "moly", "vitc"], { agro: { min: 30 } }, 0.06, 1),
    P("k", t3("Алмашинувчи калий (K₂O, Мачигин)", "Обменный калий (K₂O, Мачигин)", "Exchangeable potassium (K₂O)"), "мг/кг", "ГОСТ 26205", "ext", ["shake", "flame"], ["nh42co3"], { agro: { min: 200 } }, 0.05, 5),
    P("caco3", t3("Карбонатлар (CaCO₃)", "Карбонаты (CaCO₃)", "Carbonates (CaCO₃)"), "%", "ISO 10693", "titr", ["burette"], ["hcl"], {}, 0.06),
    P("moist", t3("Намлик", "Влажность", "Moisture"), "%", "ISO 11465", "grav", ["oven", "bal", "desic"], [], {}, 0.02),
    P("clay", t3("Механик таркиб: гил (< 2 мкм)", "Гранулометрия: глина (< 2 мкм)", "Texture: clay (< 2 µm)"), "%", "ISO 11277", "grav", ["sieve", "bal"], ["napp"], {}, 0.06),
    P("Pb", t3("Қўрғошин (Pb)", "Свинец (Pb)", "Lead (Pb)"), "мг/кг", "EPA 3050B + ISO 11047 (ААС)", "met", ["mw", "aas", "icpms"], ["hno3", "hcl", "crm"], { uz: 32, nl: 530 }, 0.06, 0.5),
    P("Cd", t3("Кадмий (Cd)", "Кадмий (Cd)", "Cadmium (Cd)"), "мг/кг", "EPA 3050B + 6020B (ИСП-МС)", "met", ["mw", "icpms"], ["hno3", "crm"], { uz: 2, nl: 13 }, 0.08, 0.02),
    P("Cu", t3("Мис (Cu)", "Медь (Cu)", "Copper (Cu)"), "мг/кг", "EPA 3050B + ISO 11047", "met", ["mw", "aas"], ["hno3", "hcl"], { uz: 132, nl: 190 }, 0.05, 0.5),
    P("Zn", t3("Рух (Zn)", "Цинк (Zn)", "Zinc (Zn)"), "мг/кг", "EPA 3050B + ISO 11047", "met", ["mw", "aas"], ["hno3", "hcl"], { uz: 220, nl: 720 }, 0.05, 1),
    P("Ni", t3("Никель (Ni)", "Никель (Ni)", "Nickel (Ni)"), "мг/кг", "EPA 3050B + 6020B", "met", ["mw", "icpms"], ["hno3"], { uz: 80, nl: 100 }, 0.06, 0.5),
    P("As", t3("Мишьяк (As)", "Мышьяк (As)", "Arsenic (As)"), "мг/кг", "EPA 3050B + 6020B", "met", ["mw", "icpms"], ["hno3", "crm"], { uz: 2, nl: 76 }, 0.08, 0.1),
    P("Hg", t3("Симоб (Hg)", "Ртуть (Hg)", "Mercury (Hg)"), "мг/кг", "EPA 7471B (совуқ буғ ААС)", "met", ["aas"], ["hno3", "sncl2"], { uz: 2.1, nl: 36 }, 0.1, 0.005),
    P("oil", t3("Нефть маҳсулотлари (C10–C40)", "Нефтепродукты (C10–C40)", "Petroleum hydrocarbons (C10–C40)"), "мг/кг", "ISO 16703 (ГХ-АИД)", "gc", ["sox", "gcms"], ["hexane", "acetone", "silica"], { uz: 1000, nl: 5000 }, 0.1, 10),
    P("bap", t3("Бенз(а)пирен (ПАУ)", "Бенз(а)пирен (ПАУ)", "Benzo[a]pyrene (PAH)"), "мг/кг", "EPA 8270E (ГХ-МС)", "gc", ["sox", "gcms"], ["dcm", "silica", "pahstd"], { uz: 0.02 }, 0.12, 0.001),
    P("ddt", t3("ДДТ йиғиндиси (пестицид)", "Сумма ДДТ (пестицид)", "DDT sum (pesticide)"), "мг/кг", "EPA 8081B (ГХ-ЭЗД)", "gc", ["sox", "gcms"], ["hexane", "florisil", "ocpstd"], { uz: 0.1 }, 0.12, 0.001),
    P("hch", t3("ГХЦГ (линдан)", "ГХЦГ (линдан)", "HCH (lindane)"), "мг/кг", "EPA 8081B (ГХ-ЭЗД)", "gc", ["sox", "gcms"], ["hexane", "florisil", "ocpstd"], { uz: 0.1 }, 0.12, 0.001),
    P("resp", t3("Тупроқ нафас олиши (CO₂)", "Дыхание почвы (CO₂)", "Soil respiration (CO₂)"), "мг CO₂/100 г·сут", "ISO 16072", "bio", ["inc", "burette"], ["naoh", "bacl2", "hcl"], { agro: { min: 10 } }, 0.1),
    P("cfu", t3("Микроорганизмлар сони", "Численность микроорганизмов", "Microbial count"), "КОЕ/г", "ISO 18400-206 + экиш усули", "micro", ["lam", "auto", "inc", "colony"], ["agar", "nacl09"], { agro: { min: 1e6 } }, 0.15),
    P("dh", t3("Дегидрогеназа фаоллиги", "Дегидрогеназная активность", "Dehydrogenase activity"), "мкг ТФФ/г·сут", "ISO 23753-1", "bio", ["inc", "spec"], ["ttc", "acetone"], { agro: { min: 10 } }, 0.12)
  ];
  const WATP = [
    P("t", t3("Ҳарорат", "Температура", "Temperature"), "°C", "ISO 5667-1 (жойида)", "field", ["therm"], [], {}, 0.01),
    P("col", t3("Ранглилик", "Цветность", "Colour"), "°Pt-Co", "ISO 7887", "photo", ["spec"], ["ptco"], { d: { uz: 20, who: 15 } }, 0.08, 1),
    P("turb", t3("Лойқалик", "Мутность", "Turbidity"), "NTU", "ISO 7027-1", "field", ["turb"], ["formazin"], { d: { uz: 2.6, who: 5, eu: 1 } }, 0.06, 0.05),
    P("odor", t3("Ҳид (20 °C да)", "Запах (при 20 °C)", "Odour (20 °C)"), "балл", "EN 1622 / ГОСТ Р 57164", "field", [], [], { d: { uz: 2 } }, 0.001),
    P("ph", t3("pH", "pH", "pH"), "", "ISO 10523", "elec", ["phm"], ["buf4", "buf7", "buf10"], { d: { uz: [6, 9], who: [6.5, 8.5], eu: [6.5, 9.5] }, s: { uz: [6.5, 8.5] }, w: { uz: [6.5, 8.5] } }, 0.004),
    P("ec", t3("Электр ўтказувчанлик", "Электропроводность", "Electrical conductivity"), "мкСм/см", "ISO 7888", "elec", ["cond"], ["kclstd"], { d: { eu: 2500 } }, 0.02, 1),
    P("tds", t3("Қуруқ қолдиқ (TDS)", "Сухой остаток (TDS)", "Total dissolved solids"), "мг/л", "SM 2540 C (180 °C)", "grav", ["oven", "bal", "desic"], [], { d: { uz: 1000, who: 1000 }, s: { uz: 1000 } }, 0.03, 5),
    P("tss", t3("Муаллақ моддалар", "Взвешенные вещества", "Suspended solids"), "мг/л", "ISO 11923", "grav", ["vac", "oven", "bal"], [], { w: { eu: 35 } }, 0.06, 2),
    P("hard", t3("Умумий қаттиқлик", "Общая жёсткость", "Total hardness"), "ммоль/л", "ISO 6059 (ЭДТА)", "titr", ["burette"], ["edta", "nh3buf", "ebt"], { d: { uz: 7 } }, 0.02, 0.05),
    P("alk", t3("Ишқорийлик", "Щёлочность", "Alkalinity"), "ммоль/л", "ISO 9963-1", "titr", ["burette", "phm"], ["hcl", "mo", "php"], {}, 0.02, 0.05),
    P("do", t3("Эриган кислород", "Растворённый кислород", "Dissolved oxygen"), "мг/л", "ISO 5813 (Винклер) / ISO 5814", "titr", ["oxy", "burette"], ["mnso4", "aki", "h2so4c", "thio", "starch"], { s: { uz: { min: 4 } } }, 0.02, 0.1),
    P("bod", t3("БПК₅ (биокимёвий кислород талаби)", "БПК₅", "BOD₅"), "мг O₂/л", "ISO 5815-1", "titr", ["bod", "oxy"], ["dilw", "atu"], { s: { uz: 4 }, w: { eu: 25 } }, 0.1, 0.5),
    P("cod", t3("КПК (кимёвий кислород талаби)", "ХПК", "COD"), "мг O₂/л", "ISO 6060 / ISO 15705", "titr", ["plate", "burette", "spec"], ["k2cr2o7", "h2so4c", "ag2so4", "mohr"], { s: { uz: 30 }, w: { eu: 125 } }, 0.06, 5),
    P("perm", t3("Перманганат оксидланувчанлиги", "Перманганатная окисляемость", "Permanganate index"), "мг O₂/л", "ISO 8467", "titr", ["plate", "burette"], ["kmno4", "h2c2o4", "h2so4"], { d: { uz: 5, eu: 5 } }, 0.05, 0.5),
    P("nh4", t3("Аммоний (NH₄⁺)", "Аммоний (NH₄⁺)", "Ammonium (NH₄⁺)"), "мг/л", "ISO 7150-1", "photo", ["spec"], ["ness", "nhstd"], { d: { uz: 2, eu: 0.5 }, s: { uz: 2 } }, 0.06, 0.02),
    P("no3", t3("Нитрат (NO₃⁻)", "Нитраты (NO₃⁻)", "Nitrate (NO₃⁻)"), "мг/л", "ISO 7890-3", "photo", ["spec", "ic"], ["salic", "nstd"], { d: { uz: 45, who: 50, eu: 50 }, s: { uz: 45 } }, 0.05, 0.1),
    P("no2", t3("Нитрит (NO₂⁻)", "Нитриты (NO₂⁻)", "Nitrite (NO₂⁻)"), "мг/л", "ISO 6777", "photo", ["spec"], ["griess", "no2std"], { d: { uz: 3.3, who: 3, eu: 0.5 }, s: { uz: 3.3 } }, 0.06, 0.005),
    P("ntot", t3("Умумий азот", "Общий азот", "Total nitrogen"), "мг N/л", "ISO 11905-1", "photo", ["auto", "spec"], ["k2s2o8"], { w: { eu: 15 } }, 0.06, 0.2),
    P("po4", t3("Фосфат (PO₄³⁻)", "Фосфаты (PO₄³⁻)", "Phosphate (PO₄³⁻)"), "мг/л", "ISO 6878", "photo", ["spec"], ["moly", "vitc", "pstd"], { d: { uz: 3.5 }, w: { eu: 2 } }, 0.06, 0.01),
    P("cl", t3("Хлорид (Cl⁻)", "Хлориды (Cl⁻)", "Chloride (Cl⁻)"), "мг/л", "ISO 9297 (Мор)", "titr", ["burette"], ["agno3", "k2cro4"], { d: { uz: 250, who: 250, eu: 250 }, s: { uz: 350 } }, 0.03, 1),
    P("so4", t3("Сульфат (SO₄²⁻)", "Сульфаты (SO₄²⁻)", "Sulfate (SO₄²⁻)"), "мг/л", "ISO 9280 / ISO 10304-1", "grav", ["ic", "bal", "muffle"], ["bacl2"], { d: { uz: 400, who: 500, eu: 250 }, s: { uz: 500 } }, 0.04, 2),
    P("f", t3("Фторид (F⁻)", "Фториды (F⁻)", "Fluoride (F⁻)"), "мг/л", "ISO 10359-1 (ион-селектив)", "elec", ["phm", "ic"], ["tisab"], { d: { uz: 1.5, who: 1.5, eu: 1.5 }, s: { uz: 1.5 } }, 0.04, 0.02),
    P("fe", t3("Темир (Fe)", "Железо (Fe)", "Iron (Fe)"), "мг/л", "ISO 6332 (фенантролин)", "photo", ["spec"], ["phen", "hydrox"], { d: { uz: 0.3, who: 0.3, eu: 0.2 }, s: { uz: 0.3 } }, 0.05, 0.01),
    P("mn", t3("Марганец (Mn)", "Марганец (Mn)", "Manganese (Mn)"), "мг/л", "ISO 6333 / ISO 17294-2", "photo", ["spec", "icpms"], ["formald"], { d: { uz: 0.1, who: 0.08, eu: 0.05 }, s: { uz: 0.1 } }, 0.06, 0.005),
    P("fcl", t3("Эркин қолдиқ хлор", "Свободный остаточный хлор", "Free residual chlorine"), "мг/л", "ISO 7393-2 (DPD)", "photo", ["spec"], ["dpd"], { d: { uz: [0.3, 0.5], who: 5 } }, 0.06, 0.02),
    P("pb", t3("Қўрғошин (Pb)", "Свинец (Pb)", "Lead (Pb)"), "мг/л", "ISO 17294-2 (ИСП-МС)", "met", ["icpms"], ["hno3", "icpstd"], { d: { uz: 0.03, who: 0.01, eu: 0.01 }, s: { uz: 0.01 } }, 0.06, 0.0002),
    P("cd", t3("Кадмий (Cd)", "Кадмий (Cd)", "Cadmium (Cd)"), "мг/л", "ISO 17294-2", "met", ["icpms"], ["hno3", "icpstd"], { d: { uz: 0.001, who: 0.003, eu: 0.005 }, s: { uz: 0.001 } }, 0.08, 0.00005),
    P("as", t3("Мишьяк (As)", "Мышьяк (As)", "Arsenic (As)"), "мг/л", "ISO 17294-2", "met", ["icpms"], ["hno3", "icpstd"], { d: { uz: 0.05, who: 0.01, eu: 0.01 }, s: { uz: 0.01 } }, 0.07, 0.0005),
    P("hg", t3("Симоб (Hg)", "Ртуть (Hg)", "Mercury (Hg)"), "мг/л", "ISO 12846 (совуқ буғ ААС)", "met", ["aas"], ["hno3", "sncl2"], { d: { uz: 0.0005, who: 0.006, eu: 0.001 }, s: { uz: 0.0005 } }, 0.1, 0.00002),
    P("cu", t3("Мис (Cu)", "Медь (Cu)", "Copper (Cu)"), "мг/л", "ISO 17294-2", "met", ["icpms", "aas"], ["hno3", "icpstd"], { d: { uz: 1, who: 2, eu: 2 }, s: { uz: 1 } }, 0.05, 0.001),
    P("cr", t3("Хром (Cr)", "Хром (Cr)", "Chromium (Cr)"), "мг/л", "ISO 17294-2 / ISO 11083 (Cr⁶⁺)", "met", ["icpms", "spec"], ["dpc", "hno3"], { d: { uz: 0.05, who: 0.05, eu: 0.025 }, s: { uz: 0.05 } }, 0.06, 0.001),
    P("oil", t3("Нефть маҳсулотлари", "Нефтепродукты", "Hydrocarbon oil index"), "мг/л", "ISO 9377-2 (ГХ-АИД)", "gc", ["gcms"], ["hexane", "florisil"], { d: { uz: 0.1 }, s: { uz: 0.3 } }, 0.12, 0.01),
    P("coli", t3("Умумий колиформ бактериялар", "Общие колиформные бактерии", "Total coliforms"), "КОЕ/100 мл", "ISO 9308-1", "micro", ["lam", "vac", "inc", "colony"], ["endo", "thio"], { d: { uz: 0, who: 0, eu: 0 }, s: { uz: 1000 } }, 0.2),
    P("ecoli", t3("E. coli (ичак таёқчаси)", "E. coli (кишечная палочка)", "E. coli"), "КОЕ/100 мл", "ISO 9308-1", "micro", ["lam", "vac", "inc", "colony"], ["chromo", "thio"], { d: { uz: 0, who: 0, eu: 0 }, s: { uz: 1000, eu: 1000 } }, 0.2),
    P("entero", t3("Энтерококклар", "Энтерококки", "Intestinal enterococci"), "КОЕ/100 мл", "ISO 7899-2", "micro", ["lam", "vac", "inc", "colony"], ["slanetz"], { d: { eu: 0 }, s: { eu: 400 } }, 0.2),
    P("legio", t3("Легионелла (иссиқ сув тизими)", "Легионелла (система ГВС)", "Legionella (hot-water system)"), "КОЕ/л", "ISO 11731", "micro", ["lam", "vac", "inc", "colony"], ["bcye"], { d: { eu: 1000 } }, 0.25),
    P("crypto", t3("Криптоспоридия (оосисталар)", "Криптоспоридии (ооцисты)", "Cryptosporidium (oocysts)"), "дона/10 л", "EPA 1623.1", "micro", ["vac", "micro"], ["ims"], { d: { who: 0 } }, 0.3)
  ];
  const AIRP = [
    P("pm25", t3("Майда чанг PM2,5", "Мелкодисперсная пыль PM2,5", "Fine particles PM2.5"), "мкг/м³", "EN 12341 / ISO 10473", "inst", ["pm", "filt", "bal"], [], { uz: 35, who: 15, eu: 25 }, 0.08, 1),
    P("pm10", t3("Чанг PM10", "Пыль PM10", "Particles PM10"), "мкг/м³", "EN 12341 / ISO 10473", "inst", ["pm", "filt", "bal"], [], { uz: 60, who: 45, eu: 45 }, 0.08, 1),
    P("no2", t3("Азот диоксиди (NO₂)", "Диоксид азота (NO₂)", "Nitrogen dioxide (NO₂)"), "мкг/м³", "ISO 7996 / EN 14211", "inst", ["gas"], ["griess"], { uz: 100, who: 25, eu: 50 }, 0.06, 1),
    P("so2", t3("Олтингугурт диоксиди (SO₂)", "Диоксид серы (SO₂)", "Sulfur dioxide (SO₂)"), "мкг/м³", "ISO 10498 / ISO 6767", "inst", ["gas"], ["tcm"], { uz: 50, who: 40, eu: 50 }, 0.06, 1),
    P("co", t3("Углерод оксиди (CO)", "Оксид углерода (CO)", "Carbon monoxide (CO)"), "мг/м³", "ISO 4224 (NDIR)", "inst", ["gas"], [], { uz: 3, who: 4, eu: 4 }, 0.05, 0.05),
    P("o3", t3("Ер усти озони (O₃)", "Приземный озон (O₃)", "Ground-level ozone (O₃)"), "мкг/м³", "ISO 13964 (УБ фотометр)", "inst", ["gas"], [], { uz: 30, who: 100, eu: 120 }, 0.05, 2),
    P("pb", t3("Қўрғошин (аэрозол)", "Свинец (аэрозоль)", "Lead (aerosol)"), "мкг/м³", "ISO 9855 (ААС)", "met", ["asp", "filt", "aas"], ["hno3"], { uz: 0.3, who: 0.5, eu: 0.5 }, 0.08, 0.005),
    P("benz", t3("Бензол", "Бензол", "Benzene"), "мкг/м³", "ISO 16017-1 (ГХ-МС)", "sorb", ["asp", "gcms"], ["tenax", "btex"], { uz: 100, eu: 3.4 }, 0.08, 0.1),
    P("form", t3("Формальдегид (HCHO)", "Формальдегид (HCHO)", "Formaldehyde (HCHO)"), "мкг/м³", "ISO 16000-3 (DNPH, ЮССХ)", "sorb", ["asp", "hplc"], ["dnph", "acn"], { uz: 10, who: 100 }, 0.08, 0.5),
    P("tvoc", t3("Учувчан органик моддалар (TVOC)", "Летучие органические вещества (TVOC)", "Volatile organic compounds (TVOC)"), "мкг/м³", "ISO 16000-6", "sorb", ["asp", "gcms"], ["tenax"], { rec: 300 }, 0.1, 5),
    P("co2", t3("CO₂ (хона ҳавоси)", "CO₂ (воздух помещения)", "CO₂ (indoor air)"), "ppm", "ISO 16000-26 (NDIR)", "inst", ["gas"], [], { rec: 1000 }, 0.02, 1),
    P("nh3", t3("Аммиак (NH₃)", "Аммиак (NH₃)", "Ammonia (NH₃)"), "мкг/м³", "ГОСТ / Несслер", "sorb", ["asp", "spec"], ["h2so4", "ness"], { uz: 40 }, 0.08, 2),
    P("h2s", t3("Водород сульфид (H₂S)", "Сероводород (H₂S)", "Hydrogen sulfide (H₂S)"), "мкг/м³", "ГОСТ (метилен кўки)", "sorb", ["asp", "spec"], ["mbl"], { uz: 8, who: 150 }, 0.1, 0.5),
    P("bap", t3("Бенз(а)пирен", "Бенз(а)пирен", "Benzo[a]pyrene"), "нг/м³", "ISO 12884 (ГХ-МС)", "gc", ["asp", "filt", "gcms"], ["dcm", "pahstd"], { uz: 1, eu: 1 }, 0.12, 0.02),
    P("noise", t3("Шовқин даражаси", "Уровень шума", "Noise level"), "дБА", "ISO 1996-2", "field", ["noise"], [], { uz: 55, who: 53 }, 0.01),
    P("gamma", t3("Гамма-нурланиш дозаси қуввати", "Мощность дозы гамма-излучения", "Gamma dose rate"), "мкЗв/соат", "МАГАТЭ / ҳудудий назорат", "field", ["dose"], [], { rec: 0.3 }, 0.08),
    P("temp", t3("Ҳаво ҳарорати", "Температура воздуха", "Air temperature"), "°C", "WMO-No. 8", "field", ["meteo"], [], {}, 0.01),
    P("rh", t3("Нисбий намлик", "Относительная влажность", "Relative humidity"), "%", "WMO-No. 8", "field", ["meteo"], [], {}, 0.02),
    P("wind", t3("Шамол тезлиги", "Скорость ветра", "Wind speed"), "м/с", "WMO-No. 8", "field", ["meteo"], [], {}, 0.05),
    P("press", t3("Атмосфера босими", "Атмосферное давление", "Air pressure"), "гПа", "WMO-No. 8", "field", ["meteo"], [], {}, 0.001)
  ];

  /* ---------- Намуналар (типик қийматлар) ---------- */
  const S = (id, ic, n, k, v, d) => ({ id, ic, n, k, v, d });
  const SOILS = [
    S("boz", "fa-seedling", t3("Бўз тупроқ, суғориладиган (Тошкент)", "Серозём орошаемый (Ташкент)", "Irrigated serozem (Tashkent)"), "s", { ph: 8.0, ece: 1.2, salt: 0.15, hum: 1.1, ntot: 0.08, no3: 25, p: 22, k: 220, caco3: 9, moist: 14, clay: 18, Pb: 18, Cd: 0.25, Cu: 28, Zn: 62, Ni: 35, As: 7, Hg: 0.04, oil: 40, bap: 0.004, ddt: 0.02, hch: 0.005, resp: 18, cfu: 4e6, dh: 12 }),
    S("shor", "fa-water", t3("Шўрланган тупроқ (Сирдарё вил.)", "Засолённая почва (Сырдарьинская обл.)", "Saline soil (Syrdarya region)"), "s", { ph: 8.4, ece: 9.5, salt: 1.2, hum: 0.7, ntot: 0.05, no3: 15, p: 12, k: 180, caco3: 11, moist: 18, clay: 25, Pb: 14, Cd: 0.2, Cu: 22, Zn: 48, Ni: 30, As: 9, Hg: 0.03, oil: 30, bap: 0.002, ddt: 0.08, hch: 0.03, resp: 7, cfu: 8e5, dh: 4 }),
    S("otloq", "fa-leaf", t3("Ўтлоқи тупроқ, унумдор (Фарғона)", "Луговая почва, плодородная (Фергана)", "Fertile meadow soil (Fergana)"), "s", { ph: 7.4, ece: 0.8, salt: 0.08, hum: 2.6, ntot: 0.18, no3: 45, p: 48, k: 320, caco3: 5, moist: 22, clay: 22, Pb: 16, Cd: 0.3, Cu: 30, Zn: 70, Ni: 38, As: 6, Hg: 0.05, oil: 25, bap: 0.003, ddt: 0.03, hch: 0.01, resp: 32, cfu: 1.2e7, dh: 28 }),
    S("olm", "fa-industry", t3("Олмалиқ кон-металлургия комбинати яқини", "Вблизи Алмалыкского ГМК", "Near the Almalyk mining complex"), "s", { ph: 7.6, ece: 1.6, salt: 0.2, hum: 1.0, ntot: 0.07, no3: 20, p: 18, k: 210, caco3: 7, moist: 12, clay: 20, Pb: 260, Cd: 6.5, Cu: 640, Zn: 1150, Ni: 75, As: 38, Hg: 0.9, oil: 180, bap: 0.05, ddt: 0.01, hch: 0.004, resp: 6, cfu: 6e5, dh: 3 }),
    S("yol", "fa-road", t3("Катта йўл ёқаси (10 м)", "Обочина трассы (10 м)", "Highway verge (10 m)"), "s", { ph: 8.1, ece: 2.4, salt: 0.3, hum: 0.9, ntot: 0.07, no3: 30, p: 20, k: 200, caco3: 10, moist: 10, clay: 15, Pb: 85, Cd: 0.9, Cu: 55, Zn: 260, Ni: 42, As: 8, Hg: 0.08, oil: 850, bap: 0.09, ddt: 0.01, hch: 0.003, resp: 10, cfu: 2e6, dh: 8 }),
    S("qum", "fa-sun", t3("Қумли тупроқ (Қизилқум)", "Песчаная почва (Кызылкум)", "Sandy soil (Kyzylkum)"), "s", { ph: 8.3, ece: 0.6, salt: 0.1, hum: 0.3, ntot: 0.02, no3: 6, p: 6, k: 90, caco3: 4, moist: 3, clay: 4, Pb: 8, Cd: 0.1, Cu: 10, Zn: 28, Ni: 15, As: 4, Hg: 0.02, oil: 10, bap: 0.001, ddt: 0.002, hch: 0.001, resp: 3, cfu: 2e5, dh: 1.5 }),
    S("neft", "fa-oil-well", t3("Нефть тўкилган жой (Фарғона НҚИЗ яқини)", "Место разлива нефти (у Ферганского НПЗ)", "Oil-spill site (near Fergana refinery)"), "s", { ph: 7.9, ece: 2.0, salt: 0.25, hum: 3.5, ntot: 0.06, no3: 12, p: 14, k: 190, caco3: 8, moist: 9, clay: 16, Pb: 40, Cd: 0.4, Cu: 35, Zn: 110, Ni: 60, As: 9, Hg: 0.06, oil: 12500, bap: 0.35, ddt: 0.01, hch: 0.003, resp: 4, cfu: 3e5, dh: 2 }),
    S("pest", "fa-skull-crossbones", t3("Эски пестицид омбори ёни", "У бывшего склада пестицидов", "Next to an old pesticide store"), "s", { ph: 8.0, ece: 1.8, salt: 0.22, hum: 0.9, ntot: 0.06, no3: 18, p: 16, k: 200, caco3: 9, moist: 11, clay: 17, Pb: 22, Cd: 0.4, Cu: 45, Zn: 90, Ni: 36, As: 14, Hg: 0.1, oil: 120, bap: 0.01, ddt: 2.4, hch: 0.9, resp: 5, cfu: 7e5, dh: 3 })
  ];
  const WATERS = [
    S("tap", "fa-faucet", t3("Водопровод суви (Тошкент)", "Водопроводная вода (Ташкент)", "Tap water (Tashkent)"), "d", { t: 14, col: 5, turb: 0.6, odor: 0, ph: 7.6, ec: 480, tds: 310, tss: 1, hard: 4.2, alk: 3.1, do: 8.5, bod: 0.8, cod: 6, perm: 1.6, nh4: 0.05, no3: 9, no2: 0.01, ntot: 2.2, po4: 0.05, cl: 32, so4: 85, f: 0.4, fe: 0.08, mn: 0.02, fcl: 0.4, pb: 0.002, cd: 0.0002, as: 0.002, hg: 0.0001, cu: 0.03, cr: 0.004, oil: 0.01, coli: 0, ecoli: 0, entero: 0, legio: 0, crypto: 0 }),
    S("well", "fa-bucket", t3("Қишлоқ қудуғи (Хоразм)", "Сельский колодец (Хорезм)", "Village well (Khorezm)"), "d", { t: 16, col: 18, turb: 3.5, odor: 2, ph: 7.8, ec: 2600, tds: 1750, tss: 4, hard: 11.5, alk: 4.5, do: 3.5, bod: 1.5, cod: 12, perm: 4.2, nh4: 0.6, no3: 62, no2: 0.15, ntot: 15, po4: 0.3, cl: 380, so4: 620, f: 1.1, fe: 0.6, mn: 0.25, fcl: 0, pb: 0.006, cd: 0.0008, as: 0.012, hg: 0.0002, cu: 0.02, cr: 0.006, oil: 0.05, coli: 24, ecoli: 6, entero: 3, legio: 0, crypto: 1 }),
    S("chir", "fa-water", t3("Чирчиқ дарёси", "Река Чирчик", "Chirchiq river"), "s", { t: 12, col: 12, turb: 9, odor: 1, ph: 8.0, ec: 380, tds: 260, tss: 14, hard: 3.4, alk: 2.6, do: 10.2, bod: 1.8, cod: 9, perm: 3.0, nh4: 0.15, no3: 4.5, no2: 0.03, ntot: 1.4, po4: 0.12, cl: 18, so4: 70, f: 0.3, fe: 0.25, mn: 0.04, fcl: 0, pb: 0.003, cd: 0.0003, as: 0.003, hg: 0.0001, cu: 0.006, cr: 0.003, oil: 0.04, coli: 1800, ecoli: 420, entero: 110, legio: 0, crypto: 2 }),
    S("amu", "fa-water", t3("Амударё қуйи оқими (Нукус)", "Низовья Амударьи (Нукус)", "Lower Amu Darya (Nukus)"), "s", { t: 18, col: 20, turb: 85, odor: 1, ph: 8.1, ec: 1900, tds: 1350, tss: 120, hard: 9.0, alk: 3.2, do: 7.8, bod: 3.2, cod: 22, perm: 5.5, nh4: 0.4, no3: 8, no2: 0.08, ntot: 2.8, po4: 0.25, cl: 260, so4: 520, f: 0.6, fe: 0.4, mn: 0.06, fcl: 0, pb: 0.004, cd: 0.0005, as: 0.006, hg: 0.0002, cu: 0.01, cr: 0.005, oil: 0.12, coli: 2500, ecoli: 600, entero: 200, legio: 0, crypto: 3 }),
    S("hov", "fa-fish", t3("Эвтрофик балиқ ҳовузи", "Эвтрофный рыбный пруд", "Eutrophic fish pond"), "s", { t: 24, col: 45, turb: 22, odor: 3, ph: 8.9, ec: 900, tds: 600, tss: 30, hard: 6, alk: 4, do: 3.1, bod: 9.5, cod: 48, perm: 12, nh4: 2.8, no3: 12, no2: 0.6, ntot: 6.5, po4: 1.8, cl: 90, so4: 180, f: 0.5, fe: 0.5, mn: 0.3, fcl: 0, pb: 0.003, cd: 0.0003, as: 0.004, hg: 0.0001, cu: 0.01, cr: 0.003, oil: 0.08, coli: 9000, ecoli: 1500, entero: 600, legio: 0, crypto: 5 }),
    S("orol", "fa-wind", t3("Орол денгизи (ғарбий ҳавза)", "Аральское море (западный бассейн)", "Aral Sea (western basin)"), "s", { t: 20, col: 10, turb: 6, odor: 2, ph: 8.3, ec: 150000, tds: 120000, tss: 10, hard: 450, alk: 5, do: 5.5, bod: 2.5, cod: 35, perm: 6, nh4: 0.3, no3: 2, no2: 0.02, ntot: 2, po4: 0.1, cl: 48000, so4: 30000, f: 3.5, fe: 0.2, mn: 0.05, fcl: 0, pb: 0.008, cd: 0.001, as: 0.015, hg: 0.0003, cu: 0.02, cr: 0.006, oil: 0.06, coli: 50, ecoli: 10, entero: 5, legio: 0, crypto: 0 }),
    S("kds", "fa-arrow-down-long", t3("Коллектор-дренаж суви", "Коллекторно-дренажная вода", "Collector-drainage water"), "s", { t: 19, col: 15, turb: 18, odor: 2, ph: 7.9, ec: 6000, tds: 4200, tss: 25, hard: 22, alk: 4, do: 6, bod: 3.5, cod: 25, perm: 6, nh4: 0.5, no3: 35, no2: 0.2, ntot: 9, po4: 0.4, cl: 900, so4: 1600, f: 1.4, fe: 0.3, mn: 0.15, fcl: 0, pb: 0.004, cd: 0.0006, as: 0.009, hg: 0.0002, cu: 0.008, cr: 0.004, oil: 0.1, coli: 800, ecoli: 120, entero: 40, legio: 0, crypto: 1 }),
    S("raw", "fa-toilet", t3("Маиший оқова сув (тозаланмаган)", "Хозбытовые сточные воды (неочищенные)", "Raw municipal wastewater"), "w", { t: 20, col: 120, turb: 180, odor: 5, ph: 7.4, ec: 1300, tds: 800, tss: 250, hard: 5, alk: 6, do: 0.5, bod: 260, cod: 520, perm: 80, nh4: 45, no3: 1.5, no2: 0.2, ntot: 55, po4: 9, cl: 120, so4: 140, f: 0.6, fe: 1.8, mn: 0.2, fcl: 0, pb: 0.02, cd: 0.002, as: 0.005, hg: 0.0008, cu: 0.12, cr: 0.05, oil: 18, coli: 3e7, ecoli: 8e6, entero: 1e6, legio: 0, crypto: 60 }),
    S("tozal", "fa-recycle", t3("Тозаланган оқова (биологик тозалаш)", "Очищенные сточные воды (биоочистка)", "Treated effluent (biological)"), "w", { t: 21, col: 30, turb: 8, odor: 2, ph: 7.2, ec: 1100, tds: 720, tss: 22, hard: 4.8, alk: 3.5, do: 4.5, bod: 18, cod: 75, perm: 15, nh4: 6, no3: 22, no2: 0.5, ntot: 14, po4: 3.5, cl: 115, so4: 135, f: 0.6, fe: 0.3, mn: 0.08, fcl: 0, pb: 0.006, cd: 0.0006, as: 0.003, hg: 0.0002, cu: 0.03, cr: 0.01, oil: 0.9, coli: 5e4, ecoli: 1e4, entero: 2e3, legio: 0, crypto: 8 }),
    S("rain", "fa-cloud-rain", t3("Ёмғир суви (Тошкент)", "Дождевая вода (Ташкент)", "Rainwater (Tashkent)"), "s", { t: 15, col: 2, turb: 1.5, odor: 0, ph: 5.9, ec: 35, tds: 25, tss: 3, hard: 0.3, alk: 0.1, do: 9.5, bod: 1, cod: 5, perm: 1.5, nh4: 0.6, no3: 3, no2: 0.02, ntot: 1.2, po4: 0.03, cl: 2, so4: 6, f: 0.05, fe: 0.05, mn: 0.01, fcl: 0, pb: 0.003, cd: 0.0002, as: 0.0005, hg: 0.00005, cu: 0.005, cr: 0.001, oil: 0.02, coli: 5, ecoli: 0, entero: 0, legio: 0, crypto: 0 })
  ];
  const AIRS = [
    S("street", "fa-city", t3("Тошкент, гавжум кўча", "Ташкент, оживлённая улица", "Tashkent, busy street"), "o", { pm25: 42, pm10: 85, no2: 62, so2: 15, co: 2.4, o3: 55, pb: 0.05, benz: 6, form: 8, tvoc: 180, co2: 470, nh3: 20, h2s: 2, bap: 2.8, noise: 72, gamma: 0.13, temp: 24, rh: 38, wind: 1.8, press: 940 }),
    S("olm", "fa-industry", t3("Олмалиқ, саноат зонаси", "Алмалык, промзона", "Almalyk industrial zone"), "o", { pm25: 58, pm10: 135, no2: 48, so2: 185, co: 3.2, o3: 40, pb: 1.4, benz: 4, form: 9, tvoc: 150, co2: 450, nh3: 25, h2s: 6, bap: 3.5, noise: 65, gamma: 0.18, temp: 22, rh: 30, wind: 2.5, press: 920 }),
    S("sinf", "fa-chalkboard-user", t3("Ёпиқ синфхона (30 ўқувчи)", "Закрытый класс (30 учеников)", "Closed classroom (30 pupils)"), "i", { pm25: 24, pm10: 48, no2: 18, so2: 4, co: 0.7, o3: 12, pb: 0.02, benz: 3, form: 35, tvoc: 420, co2: 1850, nh3: 30, h2s: 1, bap: 0.4, noise: 58, gamma: 0.11, temp: 26, rh: 45, wind: 0, press: 945 }),
    S("tog", "fa-mountain-sun", t3("Чотқол тоғлари (Бурчмулла)", "Чаткальские горы (Бурчмулла)", "Chatkal mountains (Burchmulla)"), "o", { pm25: 6, pm10: 12, no2: 3, so2: 1.5, co: 0.2, o3: 85, pb: 0.003, benz: 0.4, form: 1.5, tvoc: 30, co2: 418, nh3: 4, h2s: 0.5, bap: 0.05, noise: 35, gamma: 0.16, temp: 17, rh: 55, wind: 3.2, press: 860 }),
    S("orol", "fa-wind", t3("Мўйноқ, туз-чанг бўрони", "Муйнак, солевая буря", "Moynaq, salt-dust storm"), "o", { pm25: 95, pm10: 460, no2: 8, so2: 5, co: 0.3, o3: 60, pb: 0.01, benz: 0.5, form: 2, tvoc: 40, co2: 420, nh3: 6, h2s: 1, bap: 0.2, noise: 50, gamma: 0.12, temp: 31, rh: 15, wind: 12, press: 1005 }),
    S("osh", "fa-fire-burner", t3("Газ плитали ошхона (тортгичсиз)", "Кухня с газовой плитой (без вытяжки)", "Kitchen with gas stove (no hood)"), "i", { pm25: 65, pm10: 90, no2: 210, so2: 6, co: 9, o3: 8, pb: 0.01, benz: 9, form: 60, tvoc: 650, co2: 2400, nh3: 35, h2s: 2, bap: 1.5, noise: 60, gamma: 0.11, temp: 28, rh: 55, wind: 0, press: 945 }),
    S("mebel", "fa-couch", t3("Янги мебелли хона (таъмирдан кейин)", "Комната с новой мебелью (после ремонта)", "Room with new furniture (after renovation)"), "i", { pm25: 15, pm10: 25, no2: 12, so2: 3, co: 0.5, o3: 10, pb: 0.01, benz: 5, form: 140, tvoc: 1200, co2: 900, nh3: 20, h2s: 1, bap: 0.2, noise: 40, gamma: 0.14, temp: 24, rh: 40, wind: 0, press: 945 }),
    S("park", "fa-square-parking", t3("Ер ости автотураргоҳи", "Подземная автостоянка", "Underground car park"), "i", { pm25: 55, pm10: 80, no2: 160, so2: 12, co: 18, o3: 5, pb: 0.03, benz: 22, form: 20, tvoc: 700, co2: 900, nh3: 15, h2s: 3, bap: 4, noise: 75, gamma: 0.12, temp: 20, rh: 50, wind: 0.5, press: 945 })
  ];
  const MX = {
    soil: { ic: "fa-seedling", n: t3("Тупроқ", "Почва", "Soil"), P: SOILP, S: SOILS, sets: [["uz", t3("ПДК/ОДК (СанПиН)", "ПДК/ОДК (СанПиН)", "MPC/ADC (SanPiN)")], ["nl", t3("Нидерландия, интервенция", "Нидерланды, интервенция", "Dutch intervention value")], ["agro", t3("Агрокимё оптимуми", "Агрохим. оптимум", "Agronomic optimum")]] },
    water: { ic: "fa-droplet", n: t3("Сув", "Вода", "Water"), P: WATP, S: WATERS, sets: [["uz", t3("Ўзбекистон (O‘zDSt 950:2011 / СанПиН)", "Узбекистан (O‘zDSt 950:2011 / СанПиН)", "Uzbekistan (O‘zDSt 950:2011 / SanPiN)")], ["who", t3("ЖССТ (2022)", "ВОЗ (2022)", "WHO (2022)")], ["eu", t3("Европа Иттифоқи", "Евросоюз", "European Union")]] },
    air: { ic: "fa-wind", n: t3("Ҳаво", "Воздух", "Air"), P: AIRP, S: AIRS, sets: [["uz", t3("ПДК с.с. (Ўзбекистон)", "ПДК с.с. (Узбекистан)", "Daily MPC (Uzbekistan)")], ["who", t3("ЖССТ AQG 2021", "ВОЗ AQG 2021", "WHO AQG 2021")], ["eu", t3("ЕИ 2024/2881 (2030)", "ЕС 2024/2881 (2030)", "EU 2024/2881 (2030)")], ["rec", t3("Тавсия қиймат", "Рекомендуемое", "Recommended")]] }
  };
  const KINDN = { d: t3("ичимлик суви", "питьевая вода", "drinking water"), s: t3("юза сув", "поверхностная вода", "surface water"), w: t3("оқова сув", "сточная вода", "wastewater"), o: t3("атмосфера ҳавоси", "атмосферный воздух", "ambient air"), i: t3("бино ичи ҳавоси", "воздух помещения", "indoor air"), s2: t3("тупроқ", "почва", "soil") };

  /* ---------- Реактивлар каталоги (жавондагилардан ташқари) ---------- */
  const RG_EXTRA = {
    mohr: ["(NH₄)₂Fe(SO₄)₂·6H₂O", t3("Мор тузи 0,1 н", "Соль Мора 0,1 н", "Mohr's salt 0.1 N"), "titr", ["irr"]],
    boric: ["H₃BO₃ 2 %", t3("Борат кислота 2 %", "Борная кислота 2 %", "Boric acid 2 %"), "titr", ["hp"]],
    kal: ["KAl(SO₄)₂ 1 %", t3("Аччиқтош сўрувчи 1 %", "Алюмокалиевые квасцы 1 %", "Potassium alum 1 %"), "ext", []],
    nh42co3: ["(NH₄)₂CO₃ 1 %", t3("Аммоний карбонат 1 % (Мачигин)", "Карбонат аммония 1 % (Мачигин)", "Ammonium carbonate 1 % (Machigin)"), "ext", ["irr"]],
    napp: ["Na₄P₂O₇", t3("Натрий пирофосфат (диспергатор)", "Пирофосфат натрия (диспергатор)", "Sodium pyrophosphate (dispersant)"), "ext", ["irr"]],
    hno3: ["HNO₃ 65 % (ўта тоза)", t3("Нитрат кислота 65 %, ўта тоза", "Азотная кислота 65 %, о.с.ч.", "Nitric acid 65 %, trace-metal grade"), "acid", ["cor", "ox"]],
    crm: ["CRM", t3("Сертификатланган стандарт намуна (тупроқ/сув)", "Стандартный образец (почва/вода)", "Certified reference material (soil/water)"), "std", []],
    sncl2: ["SnCl₂", t3("Қалай(II) хлорид (Hg қайтарувчи)", "Хлорид олова(II) (восстановитель Hg)", "Tin(II) chloride (Hg reductant)"), "salt", ["cor"]],
    hexane: ["C₆H₁₄", t3("н-Гексан (ХЧ учун)", "н-Гексан (для хроматографии)", "n-Hexane (chromatography)"), "solv", ["flam", "hp", "env"]],
    acetone: ["(CH₃)₂CO", t3("Ацетон", "Ацетон", "Acetone"), "solv", ["flam", "irr"]],
    dcm: ["CH₂Cl₂", t3("Дихлорметан", "Дихлорметан", "Dichloromethane"), "solv", ["hp"]],
    acn: ["CH₃CN", t3("Ацетонитрил (ЮССХ)", "Ацетонитрил (ВЭЖХ)", "Acetonitrile (HPLC)"), "solv", ["flam", "tox"]],
    silica: ["SiO₂", t3("Силикагел (тозалаш колонкаси)", "Силикагель (колонка очистки)", "Silica gel (clean-up)"), "sorb", []],
    florisil: ["MgSiO₃", t3("Флоризил", "Флорисил", "Florisil"), "sorb", []],
    tenax: ["Tenax TA", t3("Tenax TA сорбент найчаси", "Сорбционная трубка Tenax TA", "Tenax TA sorbent tube"), "sorb", []],
    dnph: ["DNPH", t3("2,4-ДНФГ картриджи (альдегидлар)", "Картридж 2,4-ДНФГ (альдегиды)", "2,4-DNPH cartridge (aldehydes)"), "sorb", ["irr"]],
    tcm: ["Na₂[HgCl₄]", t3("Тетрахлормеркурат (SO₂ ютувчи)", "Тетрахлормеркурат (поглотитель SO₂)", "Tetrachloromercurate (SO₂ absorber)"), "salt", ["tox", "env"]],
    mbl: ["C₁₆H₁₈ClN₃S", t3("Метилен кўки (H₂S учун)", "Метиленовый синий (для H₂S)", "Methylene blue (for H₂S)"), "ind", ["irr"]],
    pahstd: ["PAH mix 16", t3("ПАУ стандарт аралашмаси (16 модда, EPA)", "Смесь ПАУ (16 веществ, EPA)", "PAH standard mix (16 EPA)"), "std", ["hp"]],
    ocpstd: ["OCP mix", t3("Хлорорганик пестицидлар стандарти", "Стандарт хлорорганических пестицидов", "Organochlorine pesticide standard"), "std", ["tox"]],
    btex: ["BTEX", t3("BTEX газ стандарти", "Газовый стандарт BTEX", "BTEX gas standard"), "std", ["flam", "hp"]],
    icpstd: ["ICP multi", t3("ИСП кўп элементли стандарт (1000 мг/л)", "Многоэлементный стандарт ИСП (1000 мг/л)", "ICP multi-element standard (1000 mg/L)"), "std", ["cor"]],
    ptco: ["K₂PtCl₆ + CoCl₂", t3("Платина-кобальт ранг шкаласи", "Платино-кобальтовая шкала цветности", "Platinum-cobalt colour scale"), "std", ["irr"]],
    formazin: ["Formazin", t3("Формазин лойқалик стандарти", "Стандарт мутности формазин", "Formazin turbidity standard"), "std", ["hp"]],
    dilw: ["BOD dil.", t3("БПК суюлтириш суви (озуқа тузлари)", "Разбавляющая вода для БПК", "BOD dilution water (nutrients)"), "std", []],
    atu: ["ATU", t3("Аллилтиомочевина (нитрификация ингибитори)", "Аллилтиомочевина (ингибитор нитрификации)", "Allylthiourea (nitrification inhibitor)"), "salt", ["tox"]],
    ag2so4: ["Ag₂SO₄", t3("Кумуш сульфат (КПК катализатори)", "Сульфат серебра (катализатор ХПК)", "Silver sulfate (COD catalyst)"), "salt", ["cor", "env"]],
    h2c2o4: ["H₂C₂O₄", t3("Оксалат кислота 0,01 н", "Щавелевая кислота 0,01 н", "Oxalic acid 0.01 N"), "acid", ["tox"]],
    h2so4: ["H₂SO₄ 1:3", t3("Сульфат кислота 1:3", "Серная кислота 1:3", "Sulfuric acid 1:3"), "acid", ["cor"]],
    salic: ["C₇H₅NaO₃", t3("Натрий салицилат (нитрат)", "Салицилат натрия (нитраты)", "Sodium salicylate (nitrate)"), "ind", ["irr"]],
    k2s2o8: ["K₂S₂O₈", t3("Калий персульфат (умумий N)", "Персульфат калия (общий N)", "Potassium persulfate (total N)"), "salt", ["ox", "irr"]],
    tisab: ["TISAB", t3("Ион кучи буфери (фторид)", "Буфер ионной силы TISAB (фториды)", "TISAB buffer (fluoride)"), "std", []],
    phen: ["C₁₂H₈N₂", t3("1,10-фенантролин (темир)", "1,10-фенантролин (железо)", "1,10-phenanthroline (iron)"), "ind", ["tox", "env"]],
    hydrox: ["NH₂OH·HCl", t3("Гидроксиламин гидрохлорид", "Гидроксиламин солянокислый", "Hydroxylamine hydrochloride"), "salt", ["cor", "hp"]],
    formald: ["Formaldoxime", t3("Формальдоксим (марганец)", "Формальдоксим (марганец)", "Formaldoxime (manganese)"), "ind", ["tox"]],
    dpd: ["DPD", t3("DPD реактиви (хлор)", "Реактив DPD (хлор)", "DPD reagent (chlorine)"), "ind", ["irr"]],
    dpc: ["C₁₃H₁₄N₄O", t3("Дифенилкарбазид (Cr⁶⁺)", "Дифенилкарбазид (Cr⁶⁺)", "Diphenylcarbazide (Cr⁶⁺)"), "ind", ["irr"]],
    endo: ["Endo / LES", t3("Эндо агар (колиформлар)", "Агар Эндо (колиформы)", "Endo agar (coliforms)"), "bio", []],
    chromo: ["CCA", t3("Хромоген колиформ агар (ISO 9308-1)", "Хромогенный колиформный агар", "Chromogenic coliform agar"), "bio", []],
    slanetz: ["Slanetz-Bartley", t3("Сланец-Бартли агар (энтерококк)", "Агар Сланеца–Бартли (энтерококки)", "Slanetz–Bartley agar (enterococci)"), "bio", []],
    bcye: ["BCYE", t3("BCYE агар (легионелла)", "Агар BCYE (легионелла)", "BCYE agar (Legionella)"), "bio", []],
    agar: ["PCA", t3("Умумий санаш агари (PCA)", "Агар для общего счёта (PCA)", "Plate count agar"), "bio", []],
    nacl09: ["NaCl 0,9 %", t3("Физиологик эритма (суюлтириш)", "Физраствор (разведения)", "Saline 0.9 % (dilutions)"), "salt", []],
    ims: ["IMS beads", t3("Иммуномагнит зарралар (Cryptosporidium)", "Иммуномагнитные частицы (криптоспоридии)", "Immunomagnetic beads (Cryptosporidium)"), "bio", []],
    ttc: ["TTC", t3("Трифенилтетразолий хлорид", "Трифенилтетразолий хлорид", "Triphenyltetrazolium chloride"), "ind", ["irr"]]
  };
  const RG_CAT = { acid: t3("Кислоталар", "Кислоты", "Acids"), base: t3("Асослар", "Основания", "Bases"), salt: t3("Тузлар", "Соли", "Salts"), ind: t3("Индикатор ва рангли реактивлар", "Индикаторы и цветные реактивы", "Indicators & colour reagents"), std: t3("Стандарт ва калибрлаш эритмалари", "Стандарты и калибранты", "Standards & calibrants"), solv: t3("Органик эритувчилар", "Органические растворители", "Organic solvents"), sorb: t3("Сорбентлар", "Сорбенты", "Sorbents"), bio: t3("Озуқа муҳитлари (микробиология)", "Питательные среды", "Culture media"), titr: t3("Титрлаш эритмалари", "Титранты", "Titrants"), ext: t3("Тупроқ сўрувчилари", "Экстрагенты почвы", "Soil extractants") };

  /* ---------- Меъёр бўйича баҳолаш ---------- */
  const normsOf = (mx, p, smp) => {
    if (mx === "water") { const g = smp.k === "w" ? "w" : smp.k === "s" ? "s" : "d"; return p.lim[g] || {}; }
    return p.lim;
  };
  const limTxt = (x) => x == null ? "—" : Array.isArray(x) ? fmt(x[0], x[0] < 1 ? 1 : 1) + "–" + fmt(x[1], 1) : typeof x === "object" ? "≥ " + sig(x.min) : x === 0 ? "0" : "≤ " + sig(x);
  function judge(v, lim) {
    if (lim == null) return null;
    if (Array.isArray(lim)) { if (v >= lim[0] && v <= lim[1]) return "ok"; const w = (lim[1] - lim[0]) * 0.15; return v >= lim[0] - w && v <= lim[1] + w ? "warn" : "bad"; }
    if (typeof lim === "object") return v >= lim.min ? "ok" : v >= lim.min * 0.7 ? "warn" : "bad";
    if (lim === 0) return v <= 0 ? "ok" : "bad";
    return v <= lim ? "ok" : v <= lim * 2 ? "warn" : "bad";
  }
  const ST = { ok: ["lx-ok", "✓", t3("Меъёрда", "В норме", "Within limit")], warn: ["lx-warn", "!", t3("Чегарада / оз ошган", "На границе / превышение", "Borderline / slight excess")], bad: ["lx-bad", "✕", t3("Меъёрдан ташқари", "Вне нормы", "Out of limit")] };
  const badge = (s) => (s ? `<span class="lx-lvl ${ST[s][0]}" title="${H(ST[s][2])}">${ST[s][1]} <span class="lt-bt">${H(ST[s][2])}</span></span>` : `<span class="small muted">—</span>`);

  /* ---------- Ўлчаш ---------- */
  let runN = getJ("ekotalim:lt-run", 0);
  function measure(mx, smp, p, n) {
    const tv = smp.v[p.id]; if (tv == null) return null;
    const r = rng(hash(mx + smp.id + p.id + ":" + n));
    let v = tv === 0 ? 0 : tv * (1 + p.rsd * gauss(r));
    if (p.tp === "micro" && tv > 0) v = Math.max(0, Math.round(v));
    if (p.id === "odor") v = Math.round(clamp(v, 0, 5));
    if (p.id === "ph") v = tv + p.rsd * 2 * gauss(r);
    const U = Math.abs(v) * p.rsd * 2 + (p.lod || 0) / 2;
    return { v, U, lt: p.lod && v < p.lod };
  }
  /* Индекслар */
  const AQI_BP = {
    pm25: [[0, 9, 0, 50], [9.1, 35.4, 51, 100], [35.5, 55.4, 101, 150], [55.5, 125.4, 151, 200], [125.5, 225.4, 201, 300], [225.5, 325.4, 301, 500]],
    pm10: [[0, 54, 0, 50], [55, 154, 51, 100], [155, 254, 101, 150], [255, 354, 151, 200], [355, 424, 201, 300], [425, 604, 301, 500]],
    o3: [[0, 54, 0, 50], [55, 70, 51, 100], [71, 85, 101, 150], [86, 105, 151, 200], [106, 200, 201, 300]],
    no2: [[0, 53, 0, 50], [54, 100, 51, 100], [101, 360, 101, 150], [361, 649, 151, 200], [650, 1249, 201, 300], [1250, 2049, 301, 500]],
    so2: [[0, 35, 0, 50], [36, 75, 51, 100], [76, 185, 101, 150], [186, 304, 151, 200], [305, 604, 201, 300], [605, 1004, 301, 500]],
    co: [[0, 4.4, 0, 50], [4.5, 9.4, 51, 100], [9.5, 12.4, 101, 150], [12.5, 15.4, 151, 200], [15.5, 30.4, 201, 300], [30.5, 50.4, 301, 500]]
  };
  const aqiOne = (k, c) => { const t = AQI_BP[k]; for (const [cl, ch, il, ih] of t) if (c <= ch) return Math.round(((ih - il) / (ch - cl)) * (Math.max(c, cl) - cl) + il); return 500; };
  function aqi(res) {
    const c = { pm25: res.pm25, pm10: res.pm10, o3: res.o3 != null ? res.o3 / 1.96 : null, no2: res.no2 != null ? res.no2 / 1.88 : null, so2: res.so2 != null ? res.so2 / 2.62 : null, co: res.co != null ? res.co / 1.145 : null };
    let best = null; Object.entries(c).forEach(([k, v]) => { if (v == null) return; const i = aqiOne(k, Math.floor(v * 10) / 10); if (!best || i > best[1]) best = [k, i]; });
    return best;
  }
  const AQI_CL = [[50, "#15803d", t3("Яхши", "Хороший", "Good")], [100, "#a16207", t3("Ўртача", "Умеренный", "Moderate")], [150, "#c2410c", t3("Сезгирлар учун зарарли", "Вреден для чувствительных", "Unhealthy for sensitive groups")], [200, "#b91c1c", t3("Зарарли", "Вредный", "Unhealthy")], [300, "#7e22ce", t3("Жуда зарарли", "Очень вредный", "Very unhealthy")], [500, "#7f1d1d", t3("Хавфли", "Опасный", "Hazardous")]];
  const IZV_CL = [[0.3, "#15803d", t3("I — жуда тоза", "I — очень чистая", "I — very clean")], [1, "#16a34a", t3("II — тоза", "II — чистая", "II — clean")], [2.5, "#a16207", t3("III — ўртача ифлосланган", "III — умеренно загрязнённая", "III — moderately polluted")], [4, "#c2410c", t3("IV — ифлосланган", "IV — загрязнённая", "IV — polluted")], [6, "#b91c1c", t3("V — ифлос", "V — грязная", "V — dirty")], [10, "#7f1d1d", t3("VI — жуда ифлос", "VI — очень грязная", "VI — very dirty")], [1e9, "#450a0a", t3("VII — ўта ифлос", "VII — чрезвычайно грязная", "VII — extremely dirty")]];
  function izv(res) {
    const r = [];
    WATP.forEach((p) => { const lim = p.lim.s && p.lim.s.uz; if (res[p.id] == null || lim == null || typeof lim !== "number" || lim === 0 || ["do", "bod", "coli", "ecoli", "tds"].includes(p.id)) return; r.push(res[p.id] / lim); });
    r.sort((a, b) => b - a);
    const top = r.slice(0, 4);
    const doR = res.do > 0 ? 6 / res.do : 6, bodR = res.bod != null ? res.bod / 3 : 0;
    return (top.reduce((a, b) => a + b, 0) + doR + bodR) / (top.length + 2);
  }
  const BG = { Pb: 15, Cd: 0.2, Cu: 25, Zn: 60, Ni: 35, As: 6, Hg: 0.03 };
  const ZC_CL = [[16, "#15803d", t3("Йўл қўйиладиган", "Допустимая", "Acceptable")], [32, "#a16207", t3("Ўртача хавфли", "Умеренно опасная", "Moderately hazardous")], [128, "#b91c1c", t3("Хавфли", "Опасная", "Hazardous")], [1e9, "#7f1d1d", t3("Ўта хавфли", "Чрезвычайно опасная", "Extremely hazardous")]];
  function zc(res) { const k = Object.keys(BG).filter((e) => res[e] != null).map((e) => Math.max(1, res[e] / BG[e])); return k.length ? k.reduce((a, b) => a + b, 0) - (k.length - 1) : null; }
  const cls = (tbl, v) => tbl.find(([lim]) => v <= lim);

  /* ---------- Ҳолат ---------- */
  let host = null, ctx = {}, mx = "water", smpId = { soil: "boz", water: "tap", air: "street" }, prm = { soil: "ph", water: "ph", air: "pm25" }, setSel = { soil: "uz", water: "uz", air: "who" }, tab = "an", panel = null, lastOne = null, qcP = "no3";
  const LOGK = "ekotalim:lt-log";
  let LOG = getJ(LOGK, []);
  const smpOf = (m) => MX[m].S.find((s) => s.id === smpId[m]) || MX[m].S[0];
  const prmOf = (m) => MX[m].P.find((p) => p.id === prm[m]) || MX[m].P[0];
  const eqName = (id) => { const e = ctx.EQID && ctx.EQID[id]; return e ? L(e.n) : id; };
  const rgName = (id) => { const r = ctx.RID && ctx.RID[id]; if (r) return r.f; const x = RG_EXTRA[id]; return x ? x[0] : id; };

  /* ---------- HTML ---------- */
  const TX = {
    title: t3("Экологик таҳлил маркази", "Центр экологического анализа", "Environmental analysis centre"),
    lead: t3("Тупроқ, сув ва ҳаво намуналарини халқаро стандарт усуллар (ISO, EPA, ГОСТ) билан таҳлил қилинг: намуна танланг, кўрсаткични ўлчанг, натижани Ўзбекистон, ЖССТ ва Европа меъёрлари билан солиштиринг. Ҳар бир ўлчашда реал лабораториядагидек тасодифий хатолик бор.", "Анализируйте почву, воду и воздух стандартными методами (ISO, EPA, ГОСТ): выберите пробу, измерьте показатель и сравните с нормами Узбекистана, ВОЗ и Евросоюза. Каждое измерение содержит случайную погрешность, как в реальной лаборатории.", "Analyse soil, water and air with standard methods (ISO, EPA, GOST): pick a sample, measure a parameter and compare it with Uzbek, WHO and EU limits. Every measurement carries random error, just like a real lab."),
    tabs: [["an", "fa-vial-circle-check", t3("Таҳлил", "Анализ", "Analysis")], ["norm", "fa-scale-balanced", t3("Меъёрлар", "Нормативы", "Limits")], ["qc", "fa-chart-line", t3("Сифат назорати", "Контроль качества", "Quality control")], ["keep", "fa-temperature-low", t3("Намуна сақлаш", "Хранение проб", "Sample storage")], ["cat", "fa-boxes-stacked", t3("Жиҳоз ва реактивлар", "Приборы и реактивы", "Equipment & reagents")], ["log", "fa-clipboard-list", t3("Журнал", "Журнал", "Log")]],
    sample: t3("Намуна", "Проба", "Sample"), param: t3("Кўрсаткич", "Показатель", "Parameter"), set: t3("Солиштириш меъёри", "Норматив для сравнения", "Compare with"),
    run: t3("Таҳлил қилиш", "Выполнить анализ", "Run analysis"), runAll: t3("Тўлиқ панел (барча кўрсаткичлар)", "Полная панель (все показатели)", "Full panel (all parameters)"),
    method: t3("Усул", "Метод", "Method"), eq: t3("Асбоблар", "Приборы", "Instruments"), rg: t3("Реактивлар", "Реактивы", "Reagents"), steps: t3("Иш тартиби", "Порядок работы", "Procedure"),
    res: t3("Натижа", "Результат", "Result"), lim: t3("Меъёр", "Норматив", "Limit"), st: t3("Ҳолат", "Статус", "Status"), unc: t3("Ноаниқлик (k = 2)", "Неопределённость (k = 2)", "Uncertainty (k = 2)"),
    date: t3("Сана", "Дата", "Date"), lod: t3("аниқлаш чегарасидан кам", "ниже предела обнаружения", "below detection limit"),
    csv: t3("CSV юклаш", "Скачать CSV", "Download CSV"), proto: t3("Протокол (HTML)", "Протокол (HTML)", "Report (HTML)"), clear: t3("Журнални тозалаш", "Очистить журнал", "Clear log"),
    note: t3("Ўқув модели: қийматлар Ўзбекистон шароити учун типик; меъёрлар ўқув мақсадида соддалаштирилган — расмий хулоса учун амалдаги ҳужжат ва аккредитацияланган лаборатория керак.", "Учебная модель: значения типичны для Узбекистана; нормативы упрощены для обучения — для официального заключения нужны действующие документы и аккредитованная лаборатория.", "Teaching model: values are typical for Uzbekistan; limits are simplified for learning — official conclusions need current regulations and an accredited lab."),
    nA: t3("Бу намуна учун меъёр йўқ", "Для этой пробы норматива нет", "No limit for this sample type"),
    kind: t3("Тури", "Тип", "Type")
  };
  function sampleChips(m) { return `<div class="lx-chips" role="group" aria-label="${H(TX.sample)}">${MX[m].S.map((s) => `<button type="button" class="chip ${s.id === smpId[m] ? "active" : ""}" data-lts="${s.id}" aria-pressed="${s.id === smpId[m]}"><i class="fa-solid ${s.ic}" aria-hidden="true"></i> ${H(s.n)}</button>`).join("")}</div>`; }
  function paramSelect(m) { return `<select class="lt-sel" data-ltp aria-label="${H(TX.param)}">${MX[m].P.map((p) => `<option value="${p.id}" ${p.id === prm[m] ? "selected" : ""}>${H(p.n)}${p.u ? " (" + esc(p.u) + ")" : ""}</option>`).join("")}</select>`; }
  function setChips(m) { return `<div class="lx-chips" role="group" aria-label="${H(TX.set)}">${MX[m].sets.map(([k, n]) => `<button type="button" class="chip ${k === setSel[m] ? "active" : ""}" data-ltn="${k}" aria-pressed="${k === setSel[m]}">${H(n)}</button>`).join("")}</div>`; }
  function methodCard(m) {
    const p = prmOf(m);
    const eqs = p.eq.map((id) => `<span class="lt-tag"><i class="fa-solid fa-microscope" aria-hidden="true"></i> ${esc(eqName(id))}</span>`).join("");
    const rgs = p.rg.map((id) => `<span class="lt-tag lt-rg">${esc(rgName(id))}</span>`).join("");
    return `<div class="lt-method"><p><b>${H(TX.method)}:</b> <span class="lt-std">${esc(p.m)}</span></p>
      ${eqs ? `<p class="small"><b>${H(TX.eq)}:</b> ${eqs}</p>` : ""}${rgs ? `<p class="small"><b>${H(TX.rg)}:</b> ${rgs}</p>` : ""}
      <details class="lt-steps"><summary><b>${H(TX.steps)}</b></summary><ol>${(STEP[p.tp] || []).map((s) => `<li>${H(s)}</li>`).join("")}</ol></details></div>`;
  }
  function oneRow(m, smp, p, r) {
    const lim = normsOf(m, p, smp)[setSel[m]];
    const s = r ? judge(r.v, lim) : null;
    const val = !r ? "—" : r.lt ? "< " + sig(p.lod) : sig(r.v);
    return `<tr class="${s === "bad" ? "lt-rbad" : s === "warn" ? "lt-rwarn" : ""}"><td>${H(p.n)}</td><td><b>${val}</b> <small>${esc(p.u)}</small>${r && !r.lt ? `<br><small class="muted">± ${sig(r.U)}</small>` : ""}</td><td>${limTxt(lim)}</td><td>${badge(s)}</td><td class="small muted">${esc(p.m)}</td></tr>`;
  }
  function indexHtml(m, res) {
    if (m === "air") { const a = aqi(res); if (!a) return ""; const c = cls(AQI_CL, a[1]); const pn = AIRP.find((p) => p.id === a[0]); return `<p class="lt-idx" style="--ic:${c[1]}"><b>AQI ${a[1]}</b> · ${H(c[2])} <small>(${H(t3("асосий ифлослантирувчи", "основной загрязнитель", "main pollutant"))}: ${H(pn.n)}; US EPA 2024)</small></p>`; }
    if (m === "soil") { const z = zc(res); if (z == null) return ""; const c = cls(ZC_CL, z); return `<p class="lt-idx" style="--ic:${c[1]}"><b>Zc = ${fmt(z, 1)}</b> · ${H(c[2])} <small>(${H(t3("оғир металлар бўйича умумий ифлосланиш кўрсаткичи, фон — бўз тупроқ", "суммарный показатель загрязнения тяжёлыми металлами, фон — серозём", "total heavy-metal contamination index vs serozem background"))})</small></p>`; }
    const smp = smpOf("water");
    if (smp.k === "s") { const v = izv(res); const c = cls(IZV_CL, v); return `<p class="lt-idx" style="--ic:${c[1]}"><b>${H(t3("ИЗВ", "ИЗВ", "WPI"))} = ${fmt(v, 2)}</b> · ${H(c[2])} <small>(${H(t3("сув ифлосланиш индекси: O₂, БПК₅ ва энг юқори 4 та кўрсаткич", "индекс загрязнения воды: O₂, БПК₅ и 4 максимальных показателя", "water pollution index: O₂, BOD₅ and the 4 worst parameters"))})</small></p>`; }
    if (smp.k === "d") { const bad = WATP.filter((p) => { const lim = normsOf("water", p, smp)[setSel.water]; return res[p.id] != null && lim != null && judge(res[p.id], lim) === "bad"; }); const ok = !bad.length; return `<p class="lt-idx" style="--ic:${ok ? "#15803d" : "#b91c1c"}"><b>${ok ? H(t3("Ичишга яроқли", "Пригодна для питья", "Fit to drink")) : H(t3("Ичиш учун яроқсиз", "Непригодна для питья", "Not fit to drink"))}</b>${ok ? "" : ` · ${bad.map((p) => H(p.n)).join(", ")}`}</p>`; }
    const pass = ["bod", "cod", "tss", "ntot", "po4"].filter((k) => res[k] != null).map((k) => [k, judge(res[k], WATP.find((p) => p.id === k).lim.w.eu)]);
    const n = pass.filter(([, s]) => s === "ok").length;
    return `<p class="lt-idx" style="--ic:${n === pass.length ? "#15803d" : "#b91c1c"}"><b>${H(t3("ЕИ 91/271 талабларига мослик", "Соответствие директиве ЕС 91/271", "EU 91/271 compliance"))}: ${n}/${pass.length}</b></p>`;
  }
  function anHtml() {
    const m = mx, smp = smpOf(m), p = prmOf(m);
    return `${sampleChips(m)}
      <p class="small muted">${H(TX.kind)}: ${H(KINDN[m === "soil" ? "s2" : smp.k])}</p>
      <div class="lt-pick"><label class="small"><b>${H(TX.param)}</b> ${paramSelect(m)}</label></div>
      ${methodCard(m)}
      <div class="small"><b>${H(TX.set)}</b>${setChips(m)}</div>
      <div class="lx-eqbtn"><button type="button" class="btn btn-sm" data-ltrun><i class="fa-solid fa-play" aria-hidden="true"></i> ${H(TX.run)}</button><button type="button" class="btn btn-ghost btn-sm" data-ltall><i class="fa-solid fa-table-list" aria-hidden="true"></i> ${H(TX.runAll)}</button></div>
      <div class="lt-out" data-ltout aria-live="polite">${lastOne && lastOne.m === m && lastOne.s === smp.id && lastOne.p === p.id ? oneHtml(lastOne) : ""}${panel && panel.m === m && panel.s === smp.id ? panelHtml(panel) : ""}</div>`;
  }
  function oneHtml(o) {
    const m = o.m, smp = smpOf(m), p = MX[m].P.find((x) => x.id === o.p);
    return `<div class="lt-res"><table class="lx-mt lt-tbl"><thead><tr><th>${H(TX.param)}</th><th>${H(TX.res)}</th><th>${H(TX.lim)}</th><th>${H(TX.st)}</th><th>${H(TX.method)}</th></tr></thead><tbody>${oneRow(m, smp, p, o.r)}</tbody></table>
      <p class="small muted">${H(TX.date)}: ${esc(new Date(o.t).toLocaleString(lang() === "ru" ? "ru-RU" : lang() === "en" ? "en-GB" : "uz-UZ"))} · №${o.n}${normsOf(m, p, smp)[setSel[m]] == null ? " · " + H(TX.nA) : ""}</p></div>`;
  }
  function panelHtml(pn) {
    const m = pn.m, smp = smpOf(m);
    return `<div class="lt-res"><h4>${H(smp.n)} — ${H(TX.runAll)}</h4>${indexHtml(m, Object.fromEntries(Object.entries(pn.r).map(([k, r]) => [k, r.v])))}
      <div class="lt-scroll"><table class="lx-mt lt-tbl"><thead><tr><th>${H(TX.param)}</th><th>${H(TX.res)}</th><th>${H(TX.lim)}</th><th>${H(TX.st)}</th><th>${H(TX.method)}</th></tr></thead><tbody>${MX[m].P.map((p) => oneRow(m, smp, p, pn.r[p.id])).join("")}</tbody></table></div>
      <div class="lx-eqbtn"><button type="button" class="btn btn-ghost btn-sm" data-ltproto><i class="fa-solid fa-file-lines" aria-hidden="true"></i> ${H(TX.proto)}</button><button type="button" class="btn btn-ghost btn-sm" data-ltcsv="panel"><i class="fa-solid fa-file-csv" aria-hidden="true"></i> ${H(TX.csv)}</button></div></div>`;
  }
  function normHtml() {
    const m = mx;
    const groups = m === "water" ? [["d", KINDN.d], ["s", KINDN.s], ["w", KINDN.w]] : [[null, null]];
    return groups.map(([g, gn]) => {
      const sets = m === "water" ? (g === "d" ? [["uz", "O‘zDSt 950:2011"], ["who", t3("ЖССТ 2022", "ВОЗ 2022", "WHO 2022")], ["eu", "ЕИ 2020/2184"]] : g === "s" ? [["uz", t3("ПДК (сув ҳавзалари)", "ПДК (водоёмы)", "MPC (water bodies)")], ["eu", t3("ЕИ чўмилиш суви 2006/7", "ЕС купальные воды 2006/7", "EU bathing water 2006/7")]] : [["eu", "ЕИ 91/271"]]) : MX[m].sets;
      const rows = MX[m].P.filter((p) => sets.some(([k]) => (g ? p.lim[g] && p.lim[g][k] != null : p.lim[k] != null)));
      if (!rows.length) return "";
      return `${gn ? `<h4>${H(gn)}</h4>` : ""}<div class="lt-scroll"><table class="lx-mt lt-tbl"><thead><tr><th>${H(TX.param)}</th>${sets.map(([, n]) => `<th>${H(n)}</th>`).join("")}<th>${H(TX.method)}</th></tr></thead><tbody>${rows.map((p) => `<tr><td>${H(p.n)} <small class="muted">${esc(p.u)}</small></td>${sets.map(([k]) => `<td>${limTxt(g ? (p.lim[g] || {})[k] : p.lim[k])}</td>`).join("")}<td class="small muted">${esc(p.m)}</td></tr>`).join("")}</tbody></table></div>`;
    }).join("") + `<ul class="small lt-notes">
        <li>${H(t3("Барча таҳлиллар ISO/IEC 17025 талабларига мувофиқ: тасдиқланган усул, калибрланган асбоб, ўлчаш ноаниқлиги ва сифат назорати.", "Все анализы по ISO/IEC 17025: валидированный метод, поверенный прибор, неопределённость и контроль качества.", "All analyses follow ISO/IEC 17025: validated method, calibrated instrument, uncertainty and QC."))}</li>
        <li>${H(t3("Ҳаво меъёрлари ўртачалаш вақтига боғлиқ: бу ерда суткалик (24 соат), O₃ — 8 соатлик, бензол ва Pb — йиллик.", "Нормативы воздуха зависят от периода осреднения: здесь суточные (24 ч), O₃ — 8-часовой, бензол и Pb — годовые.", "Air limits depend on averaging time: daily (24 h) here, O₃ 8-hour, benzene and Pb annual."))}</li>
        <li>${H(t3("Тупроқда ПДК — ялпи миқдор учун; ОДК (Cd, Cu, Zn, Ni) — бетараф гилли тупроқ учун.", "ПДК в почве — для валового содержания; ОДК (Cd, Cu, Zn, Ni) — для нейтральных суглинистых почв.", "Soil MPC refers to total content; ADC (Cd, Cu, Zn, Ni) to neutral loamy soils."))}</li>
        <li>${H(TX.note)}</li></ul>`;
  }
  /* Сифат назорати: калибрлаш, бланк, қўшимча, такрорий намуна ва Шухарт картаси */
  function qcHtml() {
    const p = WATP.find((x) => x.id === qcP) || WATP[0];
    const r = rng(hash("qc" + p.id + runN));
    const conc = [0, 1, 2, 5, 10], slope = 0.08 + r() * 0.05;
    const absb = conc.map((c) => slope * c + 0.003 * gauss(r) + 0.002);
    const n = conc.length, mxx = conc.reduce((a, b) => a + b) / n, my = absb.reduce((a, b) => a + b) / n;
    const b1 = conc.reduce((s, x, i) => s + (x - mxx) * (absb[i] - my), 0) / conc.reduce((s, x) => s + (x - mxx) ** 2, 0), b0 = my - b1 * mxx;
    const ssr = absb.reduce((s, y, i) => s + (y - (b0 + b1 * conc[i])) ** 2, 0), sst = absb.reduce((s, y) => s + (y - my) ** 2, 0), r2 = 1 - ssr / sst;
    const blank = Math.abs(0.002 * gauss(r)), spike = 92 + 16 * r(), d1 = 4 + r(), d2 = d1 * (1 + 0.08 * gauss(r)), rpd = (Math.abs(d1 - d2) / ((d1 + d2) / 2)) * 100;
    const crmC = 5, crmM = crmC * (1 + 0.05 * gauss(r));
    const pts = Array.from({ length: 20 }, () => crmC * (1 + 0.04 * gauss(r)));
    const sd = crmC * 0.04;
    const W = 320, Hh = 150, y = (v) => Hh / 2 - ((v - crmC) / (sd * 3.5)) * (Hh / 2), x = (i) => 20 + i * ((W - 30) / 19);
    const viol = pts.map((v, i) => Math.abs(v - crmC) > 3 * sd ? i : -1).filter((i) => i >= 0);
    const chart = `<svg class="lt-chart" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Shewhart">
      ${[3, 2, 0, -2, -3].map((k) => `<line x1="20" x2="${W - 10}" y1="${y(crmC + k * sd)}" y2="${y(crmC + k * sd)}" stroke="${k === 0 ? "#0e7490" : Math.abs(k) === 2 ? "#d97706" : "#b91c1c"}" stroke-dasharray="${k ? "4 3" : "0"}" stroke-width="1"/><text x="${W - 8}" y="${y(crmC + k * sd) + 3}" font-size="8" fill="currentColor" text-anchor="end">${k ? (k > 0 ? "+" : "−") + Math.abs(k) + "σ" : "x̄"}</text>`).join("")}
      <polyline fill="none" stroke="currentColor" stroke-width="1.2" points="${pts.map((v, i) => x(i) + "," + y(v)).join(" ")}"/>
      ${pts.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="2.8" fill="${Math.abs(v - crmC) > 3 * sd ? "#b91c1c" : Math.abs(v - crmC) > 2 * sd ? "#d97706" : "#0e7490"}"/>`).join("")}</svg>`;
    const ok = (b) => badge(b ? "ok" : "bad");
    return `<p class="small">${H(t3("ISO/IEC 17025 бўйича ҳар бир серияда сифат назорати намуналари таҳлил қилинади. Кўрсаткични танланг ва «Янги серия» ни босинг.", "По ISO/IEC 17025 в каждой серии анализируют контрольные образцы. Выберите показатель и нажмите «Новая серия».", "Under ISO/IEC 17025 every batch includes QC samples. Pick a parameter and press “New batch”."))}</p>
      <div class="lt-pick"><select class="lt-sel" data-ltqc>${WATP.filter((x) => ["photo", "met", "titr", "elec"].includes(x.tp)).map((x) => `<option value="${x.id}" ${x.id === p.id ? "selected" : ""}>${H(x.n)}</option>`).join("")}</select> <button type="button" class="btn btn-ghost btn-sm" data-ltqcrun><i class="fa-solid fa-rotate" aria-hidden="true"></i> ${H(t3("Янги серия", "Новая серия", "New batch"))}</button></div>
      <div class="lt-scroll"><table class="lx-mt lt-tbl"><thead><tr><th>${H(t3("Назорат", "Контроль", "Check"))}</th><th>${H(TX.res)}</th><th>${H(t3("Талаб", "Критерий", "Criterion"))}</th><th>${H(TX.st)}</th></tr></thead><tbody>
        <tr><td>${H(t3("Калибрлаш эгри чизиғи (5 нуқта)", "Градуировка (5 точек)", "Calibration (5 points)"))}</td><td>A = ${fmt(b1, 4)}·C ${b0 >= 0 ? "+" : "−"} ${fmt(Math.abs(b0), 4)}; R² = ${fmt(r2, 4)}</td><td>R² ≥ 0,995</td><td>${ok(r2 >= 0.995)}</td></tr>
        <tr><td>${H(t3("Бланк (тоза сув)", "Холостая проба", "Method blank"))}</td><td>A = ${fmt(blank, 4)}</td><td>&lt; LOD</td><td>${ok(blank < 0.006)}</td></tr>
        <tr><td>${H(t3("Қўшимча намуна (spike) қайтими", "Возврат добавки (spike)", "Spike recovery"))}</td><td>${fmt(spike, 1)} %</td><td>80–120 %</td><td>${ok(spike >= 80 && spike <= 120)}</td></tr>
        <tr><td>${H(t3("Такрорий намуна (RPD)", "Дубликат (RPD)", "Duplicate (RPD)"))}</td><td>${fmt(rpd, 1)} %</td><td>≤ 20 %</td><td>${ok(rpd <= 20)}</td></tr>
        <tr><td>${H(t3("Сертификатланган стандарт намуна", "Стандартный образец (CRM)", "Certified reference material"))}</td><td>${fmt(crmM, 2)} / ${fmt(crmC, 2)}</td><td>±10 %</td><td>${ok(Math.abs(crmM - crmC) / crmC <= 0.1)}</td></tr>
      </tbody></table></div>
      <h4>${H(t3("Шухарт назорат картаси (стандарт намуна, 20 серия)", "Контрольная карта Шухарта (CRM, 20 серий)", "Shewhart control chart (CRM, 20 batches)"))}</h4>${chart}
      <p class="small">${viol.length ? "⚠️ " + H(t3("Ҳаракат чегараси (±3σ) бузилди — серия натижаларини чиқарманг, сабабини топинг (Westgard 1₃ₛ).", "Нарушена граница действия (±3σ) — результаты серии не выдавать, найти причину (Westgard 1₃ₛ).", "Action limit (±3σ) exceeded — do not report the batch; find the cause (Westgard 1₃ₛ).")) : "✅ " + H(t3("Жараён назорат остида: нуқталар ±3σ ичида.", "Процесс под контролем: точки в пределах ±3σ.", "Process in control: all points within ±3σ."))}</p>`;
  }
  const KEEP = [
    [t3("pH, ҳарорат, эриган O₂ (электрод)", "pH, температура, O₂ (электрод)", "pH, temperature, DO (probe)"), "P/G", t3("Йўқ — жойида ўлчанг", "Нет — измерять на месте", "None — measure on site"), t3("дарҳол (pH ≤ 6 соат)", "сразу (pH ≤ 6 ч)", "immediately (pH ≤ 6 h)")],
    [t3("Эриган O₂ (Винклер)", "Растворённый O₂ (Винклер)", "Dissolved O₂ (Winkler)"), "G (БПК шиша)", t3("MnSO₄ + ишқорий KI билан жойида қотириш", "Фиксация MnSO₄ + щелочной KI на месте", "Fix on site with MnSO₄ + alkaline KI"), t3("4 сутка, қоронғида", "4 сут, в темноте", "4 days, dark")],
    [t3("БПК₅", "БПК₅", "BOD₅"), "P/G", t3("1–5 °C, қоронғи", "1–5 °C, темнота", "1–5 °C, dark"), t3("24 соат", "24 ч", "24 h")],
    [t3("КПК", "ХПК", "COD"), "P/G", t3("H₂SO₄ билан pH < 2", "H₂SO₄ до pH < 2", "H₂SO₄ to pH < 2"), t3("1 ой", "1 мес", "1 month")],
    [t3("Аммоний", "Аммоний", "Ammonium"), "P/G", t3("H₂SO₄ билан pH < 2, 1–5 °C", "H₂SO₄ до pH < 2, 1–5 °C", "H₂SO₄ to pH < 2, 1–5 °C"), t3("21 кун", "21 сут", "21 days")],
    [t3("Нитрат, нитрит", "Нитраты, нитриты", "Nitrate, nitrite"), "P/G", t3("1–5 °C", "1–5 °C", "1–5 °C"), t3("24 соат", "24 ч", "24 h")],
    [t3("Фосфат", "Фосфаты", "Phosphate"), "G", t3("Жойида фильтрлаш, 1–5 °C", "Фильтрование на месте, 1–5 °C", "Filter on site, 1–5 °C"), t3("24 соат", "24 ч", "24 h")],
    [t3("Оғир металлар", "Тяжёлые металлы", "Heavy metals"), t3("P (кислотада ювилган)", "P (промытая кислотой)", "P (acid-washed)"), t3("HNO₃ билан pH < 2", "HNO₃ до pH < 2", "HNO₃ to pH < 2"), t3("1 ой", "1 мес", "1 month")],
    [t3("Симоб", "Ртуть", "Mercury"), t3("G ёки фторполимер", "G или фторполимер", "G or fluoropolymer"), t3("HCl билан pH < 2", "HCl до pH < 2", "HCl to pH < 2"), t3("1 ой", "1 мес", "1 month")],
    [t3("Нефть маҳсулотлари", "Нефтепродукты", "Hydrocarbon oil"), t3("G (шиша, тефлон қопқоқ)", "G (стекло, тефлоновая крышка)", "G (glass, PTFE cap)"), t3("HCl билан pH < 2", "HCl до pH < 2", "HCl to pH < 2"), t3("4 сутка", "4 сут", "4 days")],
    [t3("Микробиология (сув)", "Микробиология (вода)", "Microbiology (water)"), t3("Стерил P/G", "Стерильная P/G", "Sterile P/G"), t3("Na₂S₂O₃ (хлорли сув), 5 ± 3 °C", "Na₂S₂O₃ (хлорированная), 5 ± 3 °C", "Na₂S₂O₃ (chlorinated), 5 ± 3 °C"), t3("8 соат (энг кўпи 12)", "8 ч (максимум 12)", "8 h (max 12)")],
    [t3("Тупроқ: металлар, pH, гумус", "Почва: металлы, pH, гумус", "Soil: metals, pH, humus"), t3("Полиэтилен қоп", "Полиэтиленовый пакет", "PE bag"), t3("Ҳавода қуритиш, 2 мм элак", "Сушка на воздухе, сито 2 мм", "Air-dry, 2 mm sieve"), t3("бир неча ой", "несколько месяцев", "several months")],
    [t3("Тупроқ: нитрат, микроблар", "Почва: нитраты, микробы", "Soil: nitrate, microbes"), t3("Стерил қоп", "Стерильный пакет", "Sterile bag"), t3("4 °C (нитрат — музлатиш)", "4 °C (нитраты — заморозка)", "4 °C (nitrate — freeze)"), t3("3 кун", "3 сут", "3 days")],
    [t3("Тупроқ: органик ифлосликлар", "Почва: органические загрязнители", "Soil: organic pollutants"), t3("G (шиша банка)", "G (стеклянная банка)", "G (glass jar)"), t3("4 °C, қоронғи", "4 °C, темнота", "4 °C, dark"), t3("14 кун", "14 сут", "14 days")],
    [t3("Ҳаво: фильтрлар (PM, Pb)", "Воздух: фильтры (PM, Pb)", "Air: filters (PM, Pb)"), t3("Петри ликопчаси", "Чашка Петри", "Petri dish"), t3("Эксикатор, 24 соат кондиционерлаш", "Эксикатор, кондиционирование 24 ч", "Desiccator, 24 h conditioning"), t3("бир неча ой", "несколько месяцев", "several months")],
    [t3("Ҳаво: сорбент найчалари (VOC, бензол)", "Воздух: сорбционные трубки (ЛОС)", "Air: sorbent tubes (VOC)"), t3("Ёпиқ найча", "Закрытая трубка", "Capped tube"), t3("4 °C", "4 °C", "4 °C"), t3("28 кун", "28 сут", "28 days")]
  ];
  function keepHtml() {
    return `<p class="small">${H(t3("ISO 5667-3 (сув), ISO 18400 (тупроқ) ва ҳаво усулларига кўра: P — полиэтилен, G — шиша идиш. Сақлаш муддати ўтган намуна таҳлил қилинмайди.", "По ISO 5667-3 (вода), ISO 18400 (почва) и методам для воздуха: P — полиэтилен, G — стекло. Проба с истёкшим сроком не анализируется.", "Per ISO 5667-3 (water), ISO 18400 (soil) and air methods: P = polyethylene, G = glass. Samples past their holding time are not analysed."))}</p>
      <div class="lt-scroll"><table class="lx-mt lt-tbl"><thead><tr><th>${H(TX.param)}</th><th>${H(t3("Идиш", "Тара", "Container"))}</th><th>${H(t3("Консервация", "Консервация", "Preservation"))}</th><th>${H(t3("Муддат", "Срок", "Max time"))}</th></tr></thead><tbody>${KEEP.map(([a, b, c, d]) => `<tr><td>${H(a)}</td><td>${H(b)}</td><td>${H(c)}</td><td>${H(d)}</td></tr>`).join("")}</tbody></table></div>`;
  }
  let catQ = "";
  function catHtml() {
    const q = catQ.trim().toLowerCase();
    const hit = (s) => !q || s.toLowerCase().includes(q);
    const EQ = (ctx.EQUIP || []).filter((e) => hit(L(e.n) + " " + e.id));
    const CAT = ctx.EQC || [];
    const shelf = (ctx.R || []).filter((r) => hit(L(r.n) + " " + r.f));
    const ext = Object.entries(RG_EXTRA).filter(([, [f, n]]) => hit(L(n) + " " + f));
    const hz = (a) => (a || []).map((k) => (ctx.HAZ && ctx.HAZ[k] ? `<span class="lx-ghs" title="${H(ctx.HAZ[k][1])}" aria-label="${H(ctx.HAZ[k][1])}"><i class="fa-solid ${ctx.HAZ[k][0]}" aria-hidden="true"></i></span>` : "")).join("");
    const total = (ctx.R || []).length + Object.keys(RG_EXTRA).length;
    return `<input type="search" class="lt-q" data-ltq value="${esc(catQ)}" placeholder="${H(t3("Қидириш: pH, ИСП, нитрат…", "Поиск: pH, ИСП, нитрат…", "Search: pH, ICP, nitrate…"))}" aria-label="${H(t3("Қидириш", "Поиск", "Search"))}">
      <h4><i class="fa-solid fa-microscope" aria-hidden="true"></i> ${H(t3("Асбоб-ускуналар", "Приборы и оборудование", "Instruments & equipment"))} <small class="muted">(${(ctx.EQUIP || []).length})</small></h4>
      ${CAT.map(([c, ic, n]) => { const l = EQ.filter((e) => e.cat === c); return l.length ? `<p class="small"><b><i class="fa-solid ${ic}" aria-hidden="true"></i> ${H(n)}</b></p><ul class="lt-cat">${l.map((e) => `<li><button type="button" class="lt-link" data-lteq="${e.id}"><i class="fa-solid ${e.ic}" aria-hidden="true"></i> ${H(e.n)}</button>${e.st === "u" ? " <small>🎓</small>" : ""}</li>`).join("")}</ul>` : ""; }).join("")}
      <h4><i class="fa-solid fa-flask" aria-hidden="true"></i> ${H(t3("Реактивлар", "Реактивы", "Reagents"))} <small class="muted">(${total})</small></h4>
      <p class="small muted">${H(t3("Жавондаги реактивлар идишга қуйилади; қолганлари таҳлил марказидаги усулларда ишлатилади. Тозалик даражаси: «к.т.» (кимёвий тоза), «т.а.у.» (таҳлил учун, ACS/ISO), «ў.т.» (ўта тоза, металл излари учун).", "Реактивы с полки можно налить в сосуд; остальные используются в методах центра анализа. Квалификация: «х.ч.», «ч.д.а.» (ACS/ISO), «о.с.ч.» (для следов металлов).", "Shelf reagents can be poured into the vessel; the rest are used by the analysis-centre methods. Grades: CP, AR (ACS/ISO), trace-metal grade."))}</p>
      ${shelf.length ? `<p class="small"><b>${H(t3("Жавонда", "На полке", "On the shelf"))}</b></p><div class="lt-rgl">${shelf.map((r) => `<span class="lt-rgi"><b>${esc(r.f)}</b> ${H(r.n)} ${hz(r.haz)}</span>`).join("")}</div>` : ""}
      ${Object.entries(RG_CAT).map(([c, n]) => { const l = ext.filter(([, x]) => x[2] === c); return l.length ? `<p class="small"><b>${H(n)}</b></p><div class="lt-rgl">${l.map(([, [f, nn, , hzz]]) => `<span class="lt-rgi"><b>${esc(f)}</b> ${H(nn)} ${hz(hzz)}</span>`).join("")}</div>` : ""; }).join("")}
      <p class="small muted">${H(t3("Сақлаш: кислоталар ва ишқорлар алоҳида шкафда; оксидловчилар органик моддалардан узоқда; ёнувчан эритувчилар — ёнғинга чидамли шкафда; заҳарлилар — қулфли сейфда (ҳисоб журнали билан).", "Хранение: кислоты и щёлочи раздельно; окислители вдали от органики; ЛВЖ — в огнестойком шкафу; токсичные — в сейфе под замком с журналом учёта.", "Storage: acids and bases apart; oxidisers away from organics; flammables in a fire cabinet; toxics in a locked safe with a logbook."))}</p>`;
  }
  function logHtml() {
    if (!LOG.length) return `<p class="small muted">${H(t3("Ҳали натижа йўқ. «Таҳлил» бўлимида ўлчанг.", "Пока нет результатов. Выполните анализ.", "No results yet. Run an analysis."))}</p>`;
    return `<div class="lt-scroll"><table class="lx-mt lt-tbl"><thead><tr><th>№</th><th>${H(TX.sample)}</th><th>${H(TX.param)}</th><th>${H(TX.res)}</th><th>${H(TX.st)}</th></tr></thead><tbody>${LOG.slice().reverse().map((e) => { const m = MX[e.m]; const s = m && m.S.find((x) => x.id === e.s), p = m && m.P.find((x) => x.id === e.p); if (!s || !p) return ""; return `<tr><td>${e.n}</td><td>${H(s.n)}</td><td>${H(p.n)}</td><td>${sig(e.v)} ${esc(p.u)}</td><td>${badge(e.st)}</td></tr>`; }).join("")}</tbody></table></div>
      <div class="lx-eqbtn"><button type="button" class="btn btn-ghost btn-sm" data-ltcsv="log"><i class="fa-solid fa-file-csv" aria-hidden="true"></i> ${H(TX.csv)}</button><button type="button" class="btn btn-ghost btn-sm" data-ltclr><i class="fa-solid fa-trash" aria-hidden="true"></i> ${H(TX.clear)}</button></div>`;
  }
  function centerHtml() {
    const body = tab === "an" ? anHtml() : tab === "norm" ? normHtml() : tab === "qc" ? qcHtml() : tab === "keep" ? keepHtml() : tab === "cat" ? catHtml() : logHtml();
    const mxTabs = ["an", "norm"].includes(tab) ? `<div class="lx-tabs lt-mx" role="tablist">${Object.entries(MX).map(([k, v]) => `<button type="button" role="tab" class="chip ${k === mx ? "active" : ""}" aria-selected="${k === mx}" data-ltm="${k}"><i class="fa-solid ${v.ic}" aria-hidden="true"></i> ${H(v.n)}</button>`).join("")}</div>` : "";
    return `<h3><i class="fa-solid fa-vial-circle-check" aria-hidden="true"></i> ${H(TX.title)} <small class="muted">(${SOILP.length + WATP.length + AIRP.length} ${H(t3("кўрсаткич", "показателей", "parameters"))})</small></h3>
      <p class="small muted">${H(TX.lead)}</p>
      <div class="lx-tabs" role="tablist">${TX.tabs.map(([k, ic, n]) => `<button type="button" role="tab" class="chip ${k === tab ? "active" : ""}" aria-selected="${k === tab}" data-ltt="${k}"><i class="fa-solid ${ic}" aria-hidden="true"></i> ${H(n)}</button>`).join("")}</div>
      ${mxTabs}<div class="lt-body">${body}</div>`;
  }

  /* ---------- Ҳаракатлар ---------- */
  function runOne() {
    const m = mx, smp = smpOf(m), p = prmOf(m);
    if (ctx.ppeOk && !ctx.ppeOk()) { toast(L(t3("Аввал ҳимоя кийимини кийинг: халат, кўзойнак, қўлқоп.", "Сначала наденьте защиту: халат, очки, перчатки.", "Put on protection first: coat, goggles, gloves."))); return; }
    if (p.eq.some((id) => ctx.EQID && ctx.EQID[id] && ctx.EQID[id].st === "u") && ctx.uni && !ctx.uni() && !p.eq.some((id) => ctx.EQID[id] && ctx.EQID[id].st !== "u")) { toast(L(t3("🔒 Бу таҳлил учун университет босқичидаги асбоб керак.", "🔒 Для этого анализа нужен прибор университетского уровня.", "🔒 This analysis needs a university-level instrument."))); return; }
    runN++; putJ("ekotalim:lt-run", runN);
    const r = measure(m, smp, p, runN);
    lastOne = { m, s: smp.id, p: p.id, r, n: runN, t: Date.now() };
    const lim = normsOf(m, p, smp)[setSel[m]];
    LOG.push({ n: runN, m, s: smp.id, p: p.id, v: r ? r.v : null, st: r ? judge(r.v, lim) : null, t: Date.now() }); if (LOG.length > 120) LOG = LOG.slice(-120); putJ(LOGK, LOG);
    once("lt_an_" + m, 3);
    if (Object.keys(MX).every((k) => LOG.some((e) => e.m === k))) once("lt_all3", 5);
    paint();
  }
  function runAll() {
    const m = mx, smp = smpOf(m);
    if (ctx.ppeOk && !ctx.ppeOk()) { toast(L(t3("Аввал ҳимоя кийимини кийинг: халат, кўзойнак, қўлқоп.", "Сначала наденьте защиту: халат, очки, перчатки.", "Put on protection first: coat, goggles, gloves."))); return; }
    runN++; putJ("ekotalim:lt-run", runN);
    const r = {}; MX[m].P.forEach((p) => { const x = measure(m, smp, p, runN); if (x) r[p.id] = x; });
    panel = { m, s: smp.id, r, n: runN, t: Date.now() };
    once("lt_panel_" + m, 5);
    paint();
  }
  const dl = (name, text, type) => {
    try { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); } catch (e) { toast("⚠️"); }
  };
  const csvCell = (s) => '"' + String(s).replace(/"/g, '""') + '"';
  function csv(kind) {
    let rows;
    if (kind === "panel" && panel) {
      const m = panel.m, smp = smpOf(m);
      rows = [["sample", "parameter", "value", "U(k=2)", "unit", "limit", "status", "method"]].concat(MX[m].P.filter((p) => panel.r[p.id]).map((p) => { const r = panel.r[p.id], lim = normsOf(m, p, smp)[setSel[m]]; return [L(smp.n), L(p.n), r.v.toPrecision(4), r.U.toPrecision(2), p.u, limTxt(lim), judge(r.v, lim) || "", p.m]; }));
    } else rows = [["n", "date", "matrix", "sample", "parameter", "value", "unit", "status"]].concat(LOG.map((e) => { const M = MX[e.m], s = M.S.find((x) => x.id === e.s), p = M.P.find((x) => x.id === e.p); return [e.n, new Date(e.t).toISOString(), e.m, s ? L(s.n) : e.s, p ? L(p.n) : e.p, e.v == null ? "" : Number(e.v).toPrecision(4), p ? p.u : "", e.st || ""]; }));
    dl("ekomun-tahlil.csv", rows.map((r) => r.map(csvCell).join(";")).join("\r\n"), "text/csv;charset=utf-8");
  }
  function proto() {
    if (!panel) return;
    const m = panel.m, smp = smpOf(m);
    const res = Object.fromEntries(Object.entries(panel.r).map(([k, r]) => [k, r.v]));
    const rows = MX[m].P.filter((p) => panel.r[p.id]).map((p) => { const r = panel.r[p.id], lim = normsOf(m, p, smp)[setSel[m]], s = judge(r.v, lim); return `<tr><td>${H(p.n)}</td><td>${esc(p.m)}</td><td><b>${r.lt ? "&lt; " + sig(p.lod) : sig(r.v)}</b> ± ${sig(r.U)}</td><td>${esc(p.u)}</td><td>${limTxt(lim)}</td><td style="color:${s === "bad" ? "#b91c1c" : s === "warn" ? "#b45309" : "#15803d"}">${s ? H(ST[s][2]) : "—"}</td></tr>`; }).join("");
    const setN = (MX[m].sets.find(([k]) => k === setSel[m]) || [, ""])[1];
    const html = `<!doctype html><html lang="${lang() === "ru" ? "ru" : lang() === "en" ? "en" : "uz"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${H(t3("Синов протоколи", "Протокол испытаний", "Test report"))} №${panel.n}</title><style>body{font-family:system-ui,sans-serif;max-width:900px;margin:24px auto;padding:0 16px;color:#0f172a}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #cbd5e1;padding:6px;text-align:left}th{background:#f1f5f9}h1{font-size:20px}.m{color:#475569;font-size:13px}@media print{button{display:none}}</style></head><body>
      <h1>🧪 Ekomun — ${H(t3("Синов протоколи", "Протокол испытаний", "Test report"))} №${panel.n}</h1>
      <p class="m">${H(TX.date)}: ${esc(new Date(panel.t).toLocaleString())} · ${H(TX.sample)}: <b>${H(smp.n)}</b> (${H(KINDN[m === "soil" ? "s2" : smp.k])}) · ${H(TX.set)}: ${H(setN)}</p>
      ${indexHtml(m, res).replace(/class="lt-idx"[^>]*/, 'class="m"')}
      <table><thead><tr><th>${H(TX.param)}</th><th>${H(TX.method)}</th><th>${H(TX.res)} (± U, k=2)</th><th>${H(t3("Бирлик", "Ед.", "Unit"))}</th><th>${H(TX.lim)}</th><th>${H(TX.st)}</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="m">${H(t3("Сифат назорати: бланк, калибрлаш (R² ≥ 0,995), spike 80–120 %, такрорий намуна RPD ≤ 20 %, стандарт намуна ±10 %. Намуналар ISO 5667-3 / ISO 18400 бўйича сақланган.", "Контроль качества: холостая проба, градуировка (R² ≥ 0,995), spike 80–120 %, дубликат RPD ≤ 20 %, CRM ±10 %. Пробы хранились по ISO 5667-3 / ISO 18400.", "QC: blank, calibration (R² ≥ 0.995), spike 80–120 %, duplicate RPD ≤ 20 %, CRM ±10 %. Samples stored per ISO 5667-3 / ISO 18400."))}</p>
      <p class="m">${H(TX.note)}</p>
      <p class="m">${H(t3("Таҳлилчи: ____________   Текширди: ____________", "Аналитик: ____________   Проверил: ____________", "Analyst: ____________   Checked by: ____________"))}</p>
      <button onclick="print()">🖨️ ${H(t3("Чоп этиш", "Печать", "Print"))}</button></body></html>`;
    dl("ekomun-protokol-" + panel.n + ".html", html, "text/html;charset=utf-8");
    once("lt_proto", 2);
  }
  function paint() {
    const box = host && host.querySelector("[data-ltcenter]"); if (!box) return;
    box.innerHTML = centerHtml();
  }
  function bindCenter(box) {
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const d = b.dataset;
      if (d.ltt) { tab = d.ltt; paint(); return; }
      if (d.ltm) { mx = d.ltm; paint(); return; }
      if (d.lts) { smpId[mx] = d.lts; paint(); return; }
      if (d.ltn) { setSel[mx] = d.ltn; paint(); return; }
      if ("ltrun" in d) { runOne(); return; }
      if ("ltall" in d) { runAll(); return; }
      if ("ltproto" in d) { proto(); return; }
      if (d.ltcsv) { csv(d.ltcsv); return; }
      if ("ltclr" in d) { LOG = []; putJ(LOGK, LOG); paint(); return; }
      if ("ltqcrun" in d) { runN++; putJ("ekotalim:lt-run", runN); once("lt_qc", 3); paint(); return; }
      if (d.lteq && ctx.openEq) { ctx.openEq(d.lteq); return; }
    });
    box.addEventListener("change", (e) => {
      const s = e.target;
      if (s.matches("[data-ltp]")) { prm[mx] = s.value; paint(); }
      if (s.matches("[data-ltqc]")) { qcP = s.value; paint(); }
    });
    box.addEventListener("input", (e) => {
      if (!e.target.matches("[data-ltq]")) return;
      catQ = e.target.value; const pos = e.target.selectionStart; paint();
      const q = box.querySelector("[data-ltq]"); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (er) { /* ignore */ } }
    });
  }

  /* ---------- Менделеев жадвали ---------- */
  let elSel = 8, elCat = "", ptTab = "pt", rA = "AgNO3", rB = "NaCl", rRes = null, balIn = "Fe + O2 = Fe3O4", balOut = null, subQ = "";
  function ptHtml() {
    const d = D(); if (!d) return "";
    const cells = d.ELS.map((e) => {
      const dim = elCat && e.cat !== elCat;
      return `<button type="button" class="pt-el ${e.z === elSel ? "sel" : ""} ${dim ? "dim" : ""}" style="grid-row:${e.r + (e.r > 7 ? 1 : 0)};grid-column:${e.c};--ec:${d.CAT_COL[e.cat]}" data-ptz="${e.z}" aria-label="${e.z} ${esc(L(e.n))}" aria-pressed="${e.z === elSel}"><small>${e.z}</small><b>${e.s}</b></button>`;
    }).join("");
    const e = d.ELS[elSel - 1], cf = d.config(e.z), eco = d.ECO[e.s];
    const nut = d.NUTR[e.s], heavy = d.HEAVY.has(e.s), radio = d.RADIO(e.z);
    const comps = d.SUBS.filter((s) => { try { return d.parse(s.f)[e.s]; } catch (er) { return false; } }).slice(0, 24);
    const shells = cf.shells.map((n, i) => `<circle cx="60" cy="60" r="${14 + i * 7}" fill="none" stroke="currentColor" stroke-opacity=".25"/>` + Array.from({ length: n }, (_, j) => { const a = (j / n) * Math.PI * 2 + i * 0.4, rr = 14 + i * 7; return `<circle cx="${(60 + Math.cos(a) * rr).toFixed(1)}" cy="${(60 + Math.sin(a) * rr).toFixed(1)}" r="1.8" fill="${d.CAT_COL[e.cat]}"/>`; }).join("")).join("");
    return `<div class="lx-chips pt-cats" role="group" aria-label="${H(t3("Гуруҳлар", "Группы", "Categories"))}"><button type="button" class="chip ${!elCat ? "active" : ""}" data-ptc="">${H(t3("Барчаси", "Все", "All"))}</button>${Object.entries(d.CATS).map(([k, n]) => `<button type="button" class="chip ${k === elCat ? "active" : ""}" data-ptc="${k}" aria-pressed="${k === elCat}"><span class="pt-dot" style="background:${d.CAT_COL[k]}"></span> ${H(n)}</button>`).join("")}</div>
      <div class="pt-wrap"><div class="pt-grid" role="group" aria-label="${H(t3("Менделеев жадвали", "Таблица Менделеева", "Periodic table"))}">${cells}<span class="pt-gap" style="grid-row:8;grid-column:1/19"></span><span class="pt-fl" style="grid-row:6;grid-column:3">57–71</span><span class="pt-fl" style="grid-row:7;grid-column:3">89–103</span></div></div>
      <div class="pt-card" style="--ec:${d.CAT_COL[e.cat]}">
        <div class="pt-big"><small>${e.z}</small><b>${e.s}</b><span>${H(e.n)}</span><small>${esc(e.m)}</small></div>
        <div class="pt-info">
          <p><b>${H(e.n)}</b> · ${H(d.CATS[e.cat])}${radio ? " · ☢️ " + H(t3("радиоактив", "радиоактивен", "radioactive")) : ""}</p>
          <p class="small">${H(t3("Атом рақами", "Порядковый номер", "Atomic number"))}: <b>${e.z}</b> · ${H(t3("Нисбий атом массаси", "Атомная масса", "Atomic mass"))}: <b>${esc(e.m)}</b> · ${H(t3("Давр", "Период", "Period"))}: <b>${e.p}</b> · ${H(t3("Гуруҳ", "Группа", "Group"))}: <b>${e.g}</b>${e.x ? ` · ${H(t3("Электрманфийлик", "Электроотрицательность", "Electronegativity"))}: <b>${fmt(e.x, 2)}</b>` : ""}</p>
          <p class="small">${H(t3("Электрон конфигурация", "Электронная конфигурация", "Electron configuration"))}: <span class="pt-cfg">${esc(cf.txt)}</span> (${cf.shells.join(", ")})</p>
          ${nut ? `<p class="small">🌱 ${H(nut === "M" ? t3("Ўсимлик учун макро-озуқа элементи", "Макроэлемент питания растений", "Plant macronutrient") : t3("Ўсимлик учун микро-озуқа элементи", "Микроэлемент питания растений", "Plant micronutrient"))}</p>` : ""}
          ${heavy ? `<p class="small lx-bad">⚠️ ${H(t3("Оғир металл / заҳарли: тупроқ ва сувда назорат қилинади", "Тяжёлый металл / токсичный: контролируется в почве и воде", "Heavy metal / toxic: monitored in soil and water"))}</p>` : ""}
          ${eco ? `<p class="small">🌍 ${H(eco[0])}${eco[1] ? ` <b>${H(t3("ЖССТ ичимлик суви", "ВОЗ, питьевая вода", "WHO drinking water"))}: ${esc(eco[1])} ${H(t3("мг/л", "мг/л", "mg/L"))}</b>` : ""}</p>` : ""}
          ${comps.length ? `<p class="small"><b>${H(t3("Бирикмалари (реакция столига)", "Соединения (на стол реакций)", "Compounds (to the reaction bench)"))}:</b></p><div class="lx-chips">${comps.map((s) => `<button type="button" class="chip pt-sub" data-ptsub="${esc(s.f)}">${esc(d.pretty(s.f))}</button>`).join("")}</div>` : ""}
        </div>
        <svg class="pt-atom" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="7" fill="${d.CAT_COL[e.cat]}"/>${shells}</svg>
      </div>`;
  }
  const KIND_N = { acid: t3("Кислота", "Кислота", "Acid"), base: t3("Асос", "Основание", "Base"), salt: t3("Туз", "Соль", "Salt"), metal: t3("Металл", "Металл", "Metal"), oxide: t3("Оксид", "Оксид", "Oxide"), gas: t3("Газ", "Газ", "Gas"), hal: t3("Галоген", "Галоген", "Halogen"), nonmetal: t3("Нометалл", "Неметалл", "Nonmetal"), water: t3("Сув", "Вода", "Water"), perox: t3("Пероксид", "Пероксид", "Peroxide"), org: t3("Органик", "Органика", "Organic") };
  const TYPE_N = { neut: t3("Нейтраллаш", "Нейтрализация", "Neutralisation"), ppt: t3("Ион алмашиниш — чўкма", "Ионный обмен — осадок", "Ion exchange — precipitate"), gas: t3("Ион алмашиниш — газ", "Ионный обмен — газ", "Ion exchange — gas"), weak: t3("Кучсиз электролит ҳосил бўлиши", "Образование слабого электролита", "Weak electrolyte forms"), redox: t3("Оксидланиш-қайтарилиш", "Окислительно-восстановительная", "Redox"), comb: t3("Бирикиш / ёниш", "Соединение / горение", "Combination / combustion"), decomp: t3("Парчаланиш", "Разложение", "Decomposition"), hyd: t3("Биргаликдаги гидролиз", "Совместный гидролиз", "Mutual hydrolysis"), none: t3("Реакция бормайди", "Реакция не идёт", "No reaction") };
  function subOpts(sel) {
    const d = D();
    const groups = {}; d.SUBS.forEach((s) => { (groups[s.k] = groups[s.k] || []).push(s); });
    return Object.entries(groups).map(([k, l]) => `<optgroup label="${H(KIND_N[k] || k)}">${l.map((s) => `<option value="${esc(s.f)}" ${s.f === sel ? "selected" : ""}>${esc(d.pretty(s.f))} — ${H(s.n)}</option>`).join("")}</optgroup>`).join("");
  }
  const beaker = (col, ppt, gas, label) => `<svg class="rx-bk" viewBox="0 0 60 70" aria-hidden="true"><path d="M8 6h44v52a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" fill="none" stroke="currentColor" stroke-width="2"/><rect x="10" y="26" width="40" height="36" rx="4" fill="${col || "#bae6fd"}" opacity=".55"/>${ppt ? `<rect x="10" y="52" width="40" height="10" rx="3" fill="${ppt}" stroke="#64748b" stroke-width=".5"/>${Array.from({ length: 10 }, (_, i) => `<circle class="rx-fall" style="--d:${(i % 5) * 0.25}s" cx="${13 + i * 3.5}" cy="34" r="1.3" fill="${ppt}"/>`).join("")}` : ""}${gas ? Array.from({ length: 7 }, (_, i) => `<circle class="rx-bub" style="--d:${i * 0.2}s" cx="${15 + i * 5}" cy="58" r="2" fill="#fff" stroke="#94a3b8" stroke-width=".5"/>`).join("") : ""}<text x="30" y="20" font-size="7" text-anchor="middle" fill="currentColor">${esc(label || "")}</text></svg>`;
  function rxHtml() {
    const d = D(); if (!d) return "";
    const A = d.SID[rA], B = d.SID[rB];
    const colOf = (s) => { if (!s) return ""; const c = s.ca && d.CA.find((x) => x.c === s.ca), a = s.an && d.AN.find((x) => x.c === s.an); return (a && a.col) || (c && c.col) || (s.f === "I2" ? "#92400e" : s.f === "Br2" ? "#b45309" : s.f === "Cl2" ? "#d9f99d" : s.f === "KMnO4" ? "#7e22ce" : ""); };
    let out = "";
    if (rRes) {
      const r = rRes;
      const ppt = (r.obs || []).find((o) => o[0] === "ppt"), gas = (r.obs || []).some((o) => o[0] === "gas");
      out = `<div class="rx-res ${r.type === "none" ? "rx-none" : ""}">
        <div class="rx-vis">${r.lhs.length > 1 ? beaker(colOf(d.SID[r.lhs[0]]), null, false, d.pretty(r.lhs[0])) + "<span>+</span>" + beaker(colOf(d.SID[r.lhs[1]]), null, false, d.pretty(r.lhs[1])) : beaker(colOf(d.SID[r.lhs[0]]), null, false, d.pretty(r.lhs[0])) + "<span>🔥</span>"}<span>→</span>${r.type === "none" ? beaker(colOf(A) || colOf(B), null, false, "") : beaker(r.solCol || "#e0f2fe", ppt ? ppt[2] : null, gas, "")}</div>
        <p><span class="lx-lvl ${r.type === "none" ? "lx-mid" : "lx-ok"}">${H(TYPE_N[r.type] || r.type)}</span></p>
        ${r.eq ? `<p class="rx-eq">${esc(r.eq)}</p>` : r.type !== "none" ? `<p class="small lx-bad">${H(t3("Тенгламани автомат тенглаштириб бўлмади.", "Не удалось уравнять автоматически.", "Could not balance automatically."))}</p>` : ""}
        ${r.ionNet && (!ctx.uni || ctx.uni()) ? `<p class="small"><b>${H(t3("Тўлиқ ионли", "Полное ионное", "Full ionic"))}:</b> ${esc(r.ionFull)}<br><b>${H(t3("Қисқа ионли", "Сокращённое ионное", "Net ionic"))}:</b> <span class="rx-net">${esc(r.ionNet)}</span></p>` : ""}
        ${(r.obs || []).length ? `<ul class="small rx-obs">${r.obs.map((o) => o[0] === "gas" ? `<li>🫧 ${H(o[1])}</li>` : `<li><span class="rx-sw" style="background:${o[2]}"></span> ${H(t3("Чўкма", "Осадок", "Precipitate"))}: ${esc(d.pretty(o[1]))}</li>`).join("")}${r.heat ? `<li>🔥 ${H(r.endo ? t3("Қиздириш керак (эндотермик)", "Нужен нагрев (эндотермическая)", "Needs heating (endothermic)") : t3("Иссиқлик ажралади (экзотермик)", "Выделяется тепло (экзотермическая)", "Heat is released (exothermic)"))}</li>` : ""}${r.solCol ? `<li><span class="rx-sw" style="background:${r.solCol}"></span> ${H(t3("Эритма ранги", "Цвет раствора", "Solution colour"))}</li>` : ""}</ul>` : ""}
        <p class="small">💡 ${H(r.why)}</p>
        ${r.toxic ? `<p class="small lx-sf">🌬️ ${H(t3("Заҳарли газ/буғ: фақат тортиш шкафида ишланг!", "Ядовитый газ/пары: работайте только в вытяжном шкафу!", "Toxic gas/vapour: work only in the fume hood!"))}</p>` : ""}
        ${r.heavy ? `<p class="small lx-sf">☣️ ${H(t3("Оғир металл ёки хром бирикмаси: чиқиндини раковинага эмас, махсус идишга ташланг.", "Тяжёлый металл или соединение хрома: отходы — в специальный контейнер, не в раковину.", "Heavy metal or chromium compound: dispose in the special container, never the sink."))}</p>` : ""}
      </div>`;
    }
    return `<p class="small muted">${H(t3("Иккита моддани танланг ва аралаштиринг: дастур эрувчанлик жадвали, фаоллик қатори ва оксидланиш-қайтарилиш қоидалари бўйича маҳсулотни топади ва тенгламани тенглаштиради.", "Выберите два вещества и смешайте: программа найдёт продукты по таблице растворимости, ряду активности и правилам ОВР и уравняет реакцию.", "Choose two substances and mix: products are predicted from the solubility table, activity series and redox rules, then balanced."))} <b>${D().SUBS.length}</b> ${H(t3("модда", "веществ", "substances"))}.</p>
      <div class="rx-pick"><label class="small"><b>A</b> <select class="lt-sel" data-rxa>${subOpts(rA)}</select></label><label class="small"><b>B</b> <select class="lt-sel" data-rxb>${subOpts(rB)}</select></label></div>
      <div class="lx-eqbtn"><button type="button" class="btn btn-sm" data-rxgo><i class="fa-solid fa-flask-vial" aria-hidden="true"></i> ${H(t3("Аралаштириш", "Смешать", "Mix"))}</button><button type="button" class="btn btn-ghost btn-sm" data-rxheat><i class="fa-solid fa-fire" aria-hidden="true"></i> ${H(t3("A ни қиздириш", "Нагреть A", "Heat A"))}</button><button type="button" class="btn btn-ghost btn-sm" data-rxrnd><i class="fa-solid fa-shuffle" aria-hidden="true"></i> ${H(t3("Тасодифий реакция", "Случайная реакция", "Random reaction"))}</button></div>
      ${out}
      <details class="rx-sol"><summary><b>${H(t3("Эрувчанлик жадвали", "Таблица растворимости", "Solubility table"))}</b></summary><div class="lt-scroll">${solTable()}</div><p class="small muted">R — ${H(t3("эрийди", "растворимо", "soluble"))}, M — ${H(t3("кам эрийди", "малорастворимо", "slightly soluble"))}, N — ${H(t3("эримайди", "нерастворимо", "insoluble"))}, — ${H(t3("мавжуд эмас ёки сувда парчаланади", "не существует или разлагается водой", "does not exist / decomposes in water"))}</p></details>`;
  }
  function solTable() {
    const d = D();
    return `<table class="lt-sol"><thead><tr><th></th>${d.CA.map((c) => `<th>${esc(d.pretty(c.f))}<sup>${c.q > 1 ? c.q : ""}+</sup></th>`).join("")}</tr></thead><tbody>${d.AN.map((a) => `<tr><th>${esc(d.pretty(a.f))}<sup>${a.q > 1 ? a.q : ""}−</sup></th>${d.CA.map((c) => { const s = d.solOf(c.c, a.c); return `<td class="s-${s === "-" ? "x" : s}">${s === "-" ? "—" : s}</td>`; }).join("")}</tr>`).join("")}</tbody></table>`;
  }
  function balHtml() {
    const d = D();
    let out = "";
    if (balOut === false) out = `<p class="small lx-bad">${H(t3("Тенглаштириб бўлмади: формулаларни текширинг (масалан, Fe2O3, Ca(OH)2) ва «=» ёки «->» белгисини қўйинг.", "Не удалось уравнять: проверьте формулы (например, Fe2O3, Ca(OH)2) и знак «=» или «->».", "Could not balance: check formulas (e.g. Fe2O3, Ca(OH)2) and use “=” or “->”."))}</p>`;
    else if (balOut) {
      const all = balOut.lhs.concat(balOut.rhs);
      const mm = all.map((f, i) => [f, balOut.k[i], d.molarMass(f)]);
      out = `<p class="rx-eq">${esc(balOut.lhs.map((f, i) => (balOut.k[i] > 1 ? balOut.k[i] : "") + d.pretty(f)).join(" + ") + " → " + balOut.rhs.map((f, i) => (balOut.k[i + balOut.lhs.length] > 1 ? balOut.k[i + balOut.lhs.length] : "") + d.pretty(f)).join(" + "))}</p>
        <div class="lt-scroll"><table class="lx-mt lt-tbl"><thead><tr><th>${H(t3("Модда", "Вещество", "Substance"))}</th><th>${H(t3("Коэфф.", "Коэфф.", "Coeff."))}</th><th>M, ${H(t3("г/моль", "г/моль", "g/mol"))}</th><th>${H(t3("Масса (тенглама бўйича)", "Масса по уравнению", "Mass by equation"))}</th></tr></thead><tbody>${mm.map(([f, k, m]) => `<tr><td>${esc(d.pretty(f))}</td><td>${k}</td><td>${fmt(m, 2)}</td><td>${fmt(k * m, 2)} г</td></tr>`).join("")}</tbody></table></div>
        <p class="small muted">${H(t3("Масса сақланиш қонуни: чап ва ўнг томон массалари тенг", "Закон сохранения массы: массы слева и справа равны", "Conservation of mass: both sides are equal"))} (${fmt(mm.slice(0, balOut.lhs.length).reduce((s, [, k, m]) => s + k * m, 0), 2)} = ${fmt(mm.slice(balOut.lhs.length).reduce((s, [, k, m]) => s + k * m, 0), 2)} г).</p>`;
    }
    return `<p class="small muted">${H(t3("Исталган реакция тенгламасини ёзинг — коэффициентлар атомлар баланси бўйича топилади, моляр массалар ҳисобланади.", "Введите любую схему реакции — коэффициенты найдутся по балансу атомов, молярные массы будут рассчитаны.", "Type any reaction scheme — coefficients come from the atom balance and molar masses are computed."))}</p>
      <div class="rx-bal"><input type="text" class="lt-q" data-balin value="${esc(balIn)}" aria-label="${H(t3("Тенглама", "Уравнение", "Equation"))}" spellcheck="false" autocomplete="off"><button type="button" class="btn btn-sm" data-balgo><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i> ${H(t3("Тенглаштириш", "Уравнять", "Balance"))}</button></div>
      <div class="lx-chips">${["C6H12O6 + O2 = CO2 + H2O", "KMnO4 + HCl = KCl + MnCl2 + Cl2 + H2O", "Cu + HNO3 = Cu(NO3)2 + NO + H2O", "Al + Fe2O3 = Al2O3 + Fe", "CaCO3 + HCl = CaCl2 + CO2 + H2O", "NH3 + O2 = NO + H2O"].map((x) => `<button type="button" class="chip" data-balex="${esc(x)}">${esc(D().pretty(x.replace(/ = /, " → ")))}</button>`).join("")}</div>${out}`;
  }
  function davHtml() {
    const tabs = [["pt", "fa-table-cells", t3("Менделеев жадвали (118)", "Таблица Менделеева (118)", "Periodic table (118)")], ["rx", "fa-flask-vial", t3("Реакция столи", "Стол реакций", "Reaction bench")], ["bal", "fa-scale-balanced", t3("Тенглама тенглаштиргич", "Уравнивание", "Equation balancer")]];
    return `<h3><i class="fa-solid fa-atom" aria-hidden="true"></i> ${H(t3("Элементлар ва реакциялар", "Элементы и реакции", "Elements & reactions"))}</h3>
      <div class="lx-tabs" role="tablist">${tabs.map(([k, ic, n]) => `<button type="button" role="tab" class="chip ${k === ptTab ? "active" : ""}" aria-selected="${k === ptTab}" data-ptt="${k}"><i class="fa-solid ${ic}" aria-hidden="true"></i> ${H(n)}</button>`).join("")}</div>
      <div class="lt-body">${ptTab === "pt" ? ptHtml() : ptTab === "rx" ? rxHtml() : balHtml()}</div>`;
  }
  function paintDav() { const box = host && host.querySelector("[data-ltdav]"); if (box) box.innerHTML = davHtml(); }
  function mix() { rRes = D().react(rA, rB); if (rRes && rRes.type !== "none") { once("rx_first", 2); const k = "ekotalim:rx-done", done = new Set(getJ(k, [])); done.add([rA, rB].sort().join("+")); putJ(k, [...done]); if (done.size >= 10) once("rx_10", 5); } paintDav(); }
  function bindDav(box) {
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const d = b.dataset;
      if (d.ptt) { ptTab = d.ptt; paintDav(); return; }
      if (d.ptz) { elSel = +d.ptz; once("pt_el", 1); paintDav(); return; }
      if (d.ptc != null && "ptc" in d) { elCat = d.ptc; paintDav(); return; }
      if (d.ptsub) { if (rA === d.ptsub) return; rB = rA; rA = d.ptsub; rRes = null; ptTab = "rx"; paintDav(); return; }
      if ("rxgo" in d) { mix(); return; }
      if ("rxheat" in d) { rRes = D().heat(rA); paintDav(); return; }
      if ("rxrnd" in d) {
        const S = D().SUBS; for (let i = 0; i < 400; i++) { const a = S[Math.floor(Math.random() * S.length)].f, c = S[Math.floor(Math.random() * S.length)].f; const r = D().react(a, c); if (r && r.type !== "none" && r.eq) { rA = a; rB = c; break; } }
        mix(); return;
      }
      if ("balgo" in d) { const i = box.querySelector("[data-balin]"); balIn = i ? i.value : balIn; balOut = D().balanceText(balIn) || false; if (balOut) once("rx_bal", 2); paintDav(); return; }
      if (d.balex) { balIn = d.balex; balOut = D().balanceText(balIn) || false; paintDav(); return; }
    });
    box.addEventListener("change", (e) => { if (e.target.matches("[data-rxa]")) { rA = e.target.value; rRes = null; } if (e.target.matches("[data-rxb]")) { rB = e.target.value; rRes = null; } });
    box.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches("[data-balin]")) { e.preventDefault(); balIn = e.target.value; balOut = D().balanceText(balIn) || false; paintDav(); const i = box.querySelector("[data-balin]"); if (i) i.focus(); } });
  }

  /* ---------- Микроскоп ---------- */
  /* Объектлар: [тури, ўлчами (мкм), зичлиги (1 мм² да), ранги] */
  const MICRO = {
    soil: [["quartz", 120, 30, "#e7e5e4"], ["clay", 40, 120, "#a16207"], ["hypha", 300, 25, "#a8a29e"], ["rod", 2, 40000, "#7c3aed"], ["coccus", 1, 40000, "#7c3aed"], ["root", 600, 2, "#78350f"]],
    river: [["diatom", 40, 120, "#a16207"], ["chain", 60, 60, "#16a34a"], ["rod", 2, 15000, "#7c3aed"], ["silt", 20, 150, "#a8a29e"]],
    pond: [["spiro", 400, 20, "#22c55e"], ["eugl", 50, 80, "#16a34a"], ["param", 200, 12, "#0ea5e9"], ["chain", 60, 90, "#16a34a"], ["daph", 1500, 1, "#d97706"], ["rod", 2, 30000, "#7c3aed"]],
    waste: [["floc", 150, 60, "#78350f"], ["vort", 80, 30, "#0ea5e9"], ["fil", 300, 40, "#57534e"], ["rod", 2, 120000, "#7c3aed"], ["coccus", 1, 80000, "#7c3aed"]],
    aral: [["salt", 60, 150, "#f8fafc"], ["artemia", 2000, 0.6, "#ea580c"], ["dust", 10, 600, "#a8a29e"], ["rod", 2, 4000, "#7c3aed"]],
    clear: [["dust", 5, 20, "#cbd5e1"]],
    yeast: [["yeast", 6, 3000, "#fef3c7"]],
    agcl: [["cryst", 4, 2000, "#f8fafc"]],
    caco3: [["rhomb", 15, 900, "#f1f5f9"]]
  };
  const MICN = { quartz: t3("кварц доналари", "зёрна кварца", "quartz grains"), clay: t3("гил агрегатлари", "глинистые агрегаты", "clay aggregates"), hypha: t3("замбуруғ гифалари", "гифы грибов", "fungal hyphae"), rod: t3("таёқчасимон бактериялар", "палочковидные бактерии", "rod bacteria"), coccus: t3("кокклар", "кокки", "cocci"), root: t3("илдиз қолдиғи", "остаток корня", "root fragment"), diatom: t3("диатом сувўтлари", "диатомовые водоросли", "diatoms"), chain: t3("ипсимон яшил сувўтлари", "нитчатые зелёные водоросли", "filamentous green algae"), silt: t3("лойқа заррачалар", "частицы ила", "silt particles"), spiro: t3("спирогира", "спирогира", "Spirogyra"), eugl: t3("эвглена", "эвглена", "Euglena"), param: t3("туфелька (инфузория)", "инфузория-туфелька", "Paramecium"), daph: t3("дафния", "дафния", "Daphnia"), floc: t3("фаол лой бўлакчалари", "хлопья активного ила", "activated-sludge flocs"), vort: t3("сувойка (вортицелла)", "сувойка (вортицелла)", "Vorticella"), fil: t3("ипсимон бактериялар", "нитчатые бактерии", "filamentous bacteria"), salt: t3("туз кристаллари (куб)", "кристаллы соли (кубы)", "salt crystals (cubes)"), artemia: t3("артемия (шўр сув қисқичбақаси)", "артемия", "Artemia (brine shrimp)"), dust: t3("чанг заррачалари", "пылинки", "dust particles"), yeast: t3("ачитқи ҳужайралари", "дрожжевые клетки", "yeast cells"), cryst: t3("AgCl кристаллари", "кристаллы AgCl", "AgCl crystals"), rhomb: t3("CaCO₃ ромбоэдрлари", "ромбоэдры CaCO₃", "CaCO₃ rhombohedra") };
  const ZOOM = [[40, 4500], [100, 1800], [400, 450], [1000, 180]];
  let mic = { kinds: ["clear"], z: 2, f: 50, stain: false };
  function micShape(t, x, y, s, col, r, stain) {
    const rot = Math.floor(r() * 180), c = stain && ["rod", "coccus", "fil"].includes(t) ? "#7c3aed" : col;
    const sw = Math.max(0.4, s * 0.08);
    if (t === "rod") return `<rect x="${x - s}" y="${y - s * 0.35}" width="${s * 2}" height="${s * 0.7}" rx="${s * 0.35}" fill="${stain ? c : "#94a3b8"}" opacity=".85" transform="rotate(${rot} ${x} ${y})"/>`;
    if (t === "coccus") return `<circle cx="${x}" cy="${y}" r="${s * 0.6}" fill="${stain ? c : "#94a3b8"}" opacity=".85"/>`;
    if (t === "quartz" || t === "dust" || t === "silt") { const n = 5 + Math.floor(r() * 3); const pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, rr = s * (0.6 + r() * 0.5); return (x + Math.cos(a) * rr).toFixed(1) + "," + (y + Math.sin(a) * rr).toFixed(1); }).join(" "); return `<polygon points="${pts}" fill="${col}" stroke="#78716c" stroke-width="${sw}" opacity=".9"/>`; }
    if (t === "clay" || t === "floc") return `<g opacity=".8">${Array.from({ length: 6 }, () => `<circle cx="${(x + (r() - 0.5) * s).toFixed(1)}" cy="${(y + (r() - 0.5) * s).toFixed(1)}" r="${(s * (0.2 + r() * 0.2)).toFixed(1)}" fill="${col}"/>`).join("")}</g>`;
    if (t === "hypha" || t === "fil" || t === "root") { let d = `M${x} ${y}`; let a = r() * 6.28, px = x, py = y; for (let i = 0; i < 6; i++) { a += (r() - 0.5) * 1.2; px += Math.cos(a) * s / 6; py += Math.sin(a) * s / 6; d += ` L${px.toFixed(1)} ${py.toFixed(1)}`; } return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${t === "root" ? s * 0.08 : Math.max(0.6, s * 0.012)}" stroke-linecap="round" opacity=".8"/>`; }
    if (t === "diatom") return `<g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${s / 2}" ry="${s / 7}" fill="${col}" opacity=".55" stroke="#78350f" stroke-width="${sw}"/>${Array.from({ length: 7 }, (_, i) => `<line x1="${x - s / 2.6 + (i * s) / 8.5}" x2="${x - s / 2.6 + (i * s) / 8.5}" y1="${y - s / 9}" y2="${y + s / 9}" stroke="#78350f" stroke-width="${sw / 2}"/>`).join("")}</g>`;
    if (t === "chain" || t === "spiro") { const n = t === "spiro" ? 10 : 6, w = s / n; return `<g transform="rotate(${rot} ${x} ${y})">${Array.from({ length: n }, (_, i) => `<rect x="${x - s / 2 + i * w}" y="${y - w * 0.45}" width="${w * 0.95}" height="${w * 0.9}" rx="${w * 0.2}" fill="${col}" opacity=".55" stroke="#15803d" stroke-width="${sw / 2}"/>`).join("")}${t === "spiro" ? `<path d="M${x - s / 2} ${y} ${Array.from({ length: 12 }, (_, i) => `Q${x - s / 2 + (i + 0.5) * s / 12} ${y + (i % 2 ? w * 0.4 : -w * 0.4)} ${x - s / 2 + (i + 1) * s / 12} ${y}`).join(" ")}" fill="none" stroke="#15803d" stroke-width="${sw}"/>` : ""}</g>`; }
    if (t === "eugl") return `<g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${s / 2}" ry="${s / 6}" fill="${col}" opacity=".7"/><circle cx="${x + s / 3.5}" cy="${y}" r="${s / 18}" fill="#dc2626"/><path d="M${x + s / 2} ${y} q${s / 4} ${-s / 6} ${s / 2} 0" fill="none" stroke="${col}" stroke-width="${sw}"/></g>`;
    if (t === "param") return `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - s / 2} ${y} C${x - s / 2} ${y - s / 4} ${x + s / 2} ${y - s / 3.5} ${x + s / 2} ${y} C${x + s / 2} ${y + s / 3.5} ${x - s / 2} ${y + s / 4} ${x - s / 2} ${y}z" fill="${col}" opacity=".35" stroke="#0369a1" stroke-width="${sw}"/><circle cx="${x}" cy="${y}" r="${s / 10}" fill="#0369a1" opacity=".6"/></g>`;
    if (t === "vort") return `<g><path d="M${x} ${y} l0 ${s}" stroke="#0369a1" stroke-width="${sw}"/><path d="M${x - s / 3} ${y - s / 5} Q${x} ${y + s / 3} ${x + s / 3} ${y - s / 5}z" fill="${col}" opacity=".45" stroke="#0369a1" stroke-width="${sw}"/></g>`;
    if (t === "daph" || t === "artemia") return `<g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${s / 2}" ry="${s / (t === "daph" ? 3 : 7)}" fill="${col}" opacity=".45" stroke="#9a3412" stroke-width="${sw}"/><circle cx="${x + s / 2.6}" cy="${y}" r="${s / 18}" fill="#111827"/></g>`;
    if (t === "salt" || t === "cryst") return `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" fill="${col}" stroke="#94a3b8" stroke-width="${sw}" transform="rotate(${rot % 45} ${x} ${y})" opacity=".9"/>`;
    if (t === "rhomb") return `<polygon points="${x},${y - s / 2} ${x + s / 2},${y} ${x},${y + s / 2} ${x - s / 2},${y}" fill="${col}" stroke="#94a3b8" stroke-width="${sw}" opacity=".9" transform="rotate(${rot % 30} ${x} ${y})"/>`;
    if (t === "yeast") return `<g><ellipse cx="${x}" cy="${y}" rx="${s / 2}" ry="${s / 2.6}" fill="${col}" stroke="#a16207" stroke-width="${sw}"/>${r() < 0.4 ? `<circle cx="${x + s / 2}" cy="${y - s / 4}" r="${s / 5}" fill="${col}" stroke="#a16207" stroke-width="${sw}"/>` : ""}</g>`;
    return `<circle cx="${x}" cy="${y}" r="${s / 2}" fill="${col}"/>`;
  }
  function micSvg() {
    const [Z, fov] = ZOOM[mic.z], R = 100, r = rng(hash(mic.kinds.join() + Z)), sc = (2 * R) / fov;
    let g = "", seen = new Set();
    mic.kinds.forEach((k) => (MICRO[k] || []).forEach(([t, um, dens, col]) => {
      const px = um * sc; if (px < 0.8) return;
      const area = (Math.PI * (fov / 2000) ** 2), n = Math.min(t === "rod" || t === "coccus" ? 70 : 24, Math.round(dens * area + (r() < (dens * area) % 1 ? 1 : 0)));
      if (n > 0) seen.add(t);
      for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * (R - 4); g += micShape(t, +(100 + Math.cos(a) * d).toFixed(1), +(100 + Math.sin(a) * d).toFixed(1), Math.min(px, 260), col, r, mic.stain); }
    }));
    const blur = Math.abs(mic.f - 50) / 12;
    const barUm = fov / 5 >= 500 ? 500 : fov / 5 >= 200 ? 200 : fov / 5 >= 50 ? 50 : 20;
    return { svg: `<svg class="mic-view" viewBox="0 0 200 200" role="img" aria-label="${H(t3("Микроскоп кўриниши", "Поле зрения микроскопа", "Microscope field of view"))} ×${Z}"><defs><clipPath id="micc"><circle cx="100" cy="100" r="98"/></clipPath><filter id="micb"><feGaussianBlur stdDeviation="${blur.toFixed(2)}"/></filter><radialGradient id="micg"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs><circle cx="100" cy="100" r="99" fill="#fefce8"/><g clip-path="url(#micc)" filter="url(#micb)">${g}</g><circle cx="100" cy="100" r="99" fill="url(#micg)"/><circle cx="100" cy="100" r="99" fill="none" stroke="#111827" stroke-width="2"/><line x1="140" x2="${140 + barUm * sc}" y1="185" y2="185" stroke="#111827" stroke-width="2"/><text x="${140 + (barUm * sc) / 2}" y="181" font-size="7" text-anchor="middle" fill="#111827">${barUm} µm</text></svg>`, seen: [...seen] };
  }
  function micHtml() {
    const m = micSvg();
    return `<div class="mic-box"><div>${m.svg}</div><div class="mic-ctl">
      <div class="lx-chips" role="group" aria-label="${H(t3("Катталаштириш", "Увеличение", "Magnification"))}">${ZOOM.map(([z], i) => `<button type="button" class="chip ${i === mic.z ? "active" : ""}" data-micz="${i}" aria-pressed="${i === mic.z}">×${z}</button>`).join("")}</div>
      <label class="small mic-f">${H(t3("Фокус (микровинт)", "Фокус (микровинт)", "Focus (fine knob)"))} <input type="range" min="0" max="100" value="${mic.f}" data-micf aria-label="focus"></label>
      <label class="small"><input type="checkbox" data-mics ${mic.stain ? "checked" : ""}> ${H(t3("Метилен кўки билан бўяш", "Окраска метиленовым синим", "Methylene-blue stain"))}</label>
      <p class="small">${H(t3("Кўриниш майдони", "Поле зрения", "Field of view"))}: ⌀ ${sig(ZOOM[mic.z][1] / 1000)} мм</p>
      <p class="small"><b>${H(t3("Кўриняпти", "Видно", "Visible"))}:</b> ${m.seen.length ? m.seen.map((t) => H(MICN[t])).join(", ") : H(t3("ҳеч нарса — катталаштиришни оширинг", "ничего — увеличьте", "nothing — increase magnification"))}</p>
      <p class="small muted">${H(t3("Бактериялар (1–2 мкм) фақат ×400–×1000 да кўринади; ×1000 да иммерсион мой томизилади.", "Бактерии (1–2 мкм) видны только при ×400–×1000; для ×1000 нужна иммерсия.", "Bacteria (1–2 µm) appear only at ×400–×1000; ×1000 needs oil immersion."))}</p></div></div>`;
  }
  /* Микроскоп ойнаси идиш бўлимида (labxona meter) — ҳодисалар делегацияси */
  function bindMic(el) {
    if (el._mic) return; el._mic = true;
    const re = () => { const b = el.querySelector(".mic-box"); if (b) b.outerHTML = micHtml(); };
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-micz]"); if (!b) return; mic.z = +b.dataset.micz; if (mic.z >= 2) once("lx_mic400", 1); re(); });
    el.addEventListener("input", (e) => { if (e.target.matches("[data-micf]")) { mic.f = +e.target.value; const b = el.querySelector(".mic-view"); if (b) { const f = b.querySelector("#micb feGaussianBlur"); if (f) f.setAttribute("stdDeviation", (Math.abs(mic.f - 50) / 12).toFixed(2)); } } });
    el.addEventListener("change", (e) => { if (e.target.matches("[data-mics]")) { mic.stain = e.target.checked; re(); } });
  }

  /* ---------- Ташқи API ---------- */
  function mount(el, c) {
    host = el; ctx = c || {};
    el.innerHTML = `<div class="lt-box" id="lxTahlil" data-ltcenter></div><div class="lt-box lt-dav" id="lxDavriy" data-ltdav></div>`;
    bindCenter(el.querySelector("[data-ltcenter]")); bindDav(el.querySelector("[data-ltdav]"));
    paint(); paintDav();
  }
  window.EkoLabTahlil = {
    mount,
    focus(m, p) { if (!MX[m]) return; mx = m; tab = "an"; if (p && MX[m].P.some((x) => x.id === p)) prm[m] = p; paint(); const b = host && host.querySelector("[data-ltcenter]"); if (b && b.scrollIntoView) b.scrollIntoView({ behavior: "smooth", block: "start" }); },
    micro(kinds, el) { mic.kinds = kinds && kinds.length ? kinds : ["clear"]; if (el) bindMic(el); return micHtml(); },
    get params() { return { soil: SOILP.length, water: WATP.length, air: AIRP.length }; },
    measure: (m, s, p, n) => { const M = MX[m]; return measure(m, M.S.find((x) => x.id === s), M.P.find((x) => x.id === p), n || 1); },
    aqi, izv, zc, judge, RG_EXTRA,
    _set(o) { if (o.tab) tab = o.tab; if (o.mx) mx = o.mx; if (o.smp) smpId[mx] = o.smp; if (o.ptTab) ptTab = o.ptTab; if (o.rA) rA = o.rA; if (o.rB) rB = o.rB; paint(); paintDav(); },
    run: () => runOne(), runAll: () => runAll(), mix: () => mix()
  };
})();
