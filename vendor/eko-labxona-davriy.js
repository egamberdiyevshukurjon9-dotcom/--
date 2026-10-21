/* Экомун — ⚛️ «Лаборатория хонаси»: Менделеев жадвали (118 элемент) ва реакция столи.
   Моддалар рўйхати эрувчанлик жадвалидан ҳосил қилинади: 23 катион × 17 анион (тузлар, кислоталар,
   асослар) + металлар, оксидлар, газлар ва оддий моддалар. Реакция турлари: нейтраллаш, алмашиниш
   (чўкма, газ, кучсиз электролит), металл + кислота / туз / сув, оксидлар, гидролиз, галогенлар
   ўрин алмашиши, ёниш ва қиздиришда парчаланиш. Тенгламалар матрица усули билан тенглаштирилади
   (атомлар балансининг бутун сонли ечими), ионли тенглама кучли электролитлардан тузилади.
   Манбалар: IUPAC атом массалари (2021), Pauling электрманфийлиги, мактаб эрувчанлик жадвали
   (25 °C), металлар фаоллик қатори, ЖССТ ичимлик суви меъёрлари (GDWQ, 2022).
   UI'сиз ядро Node'да ҳам синалади (module.exports). Матнлар uz/ru/en. */
(() => {
  "use strict";
  const t3 = (uz, ru, en) => ({ uz, ru, en });

  /* ---------- 1. Элементлар ---------- */
  /* Z тартибида: белги|инглизча|русча|масса|электрманфийлик */
  const RAW = "H|Hydrogen|Водород|1.008|2.20;He|Helium|Гелий|4.0026|;Li|Lithium|Литий|6.94|0.98;Be|Beryllium|Бериллий|9.0122|1.57;B|Boron|Бор|10.81|2.04;C|Carbon|Углерод|12.011|2.55;N|Nitrogen|Азот|14.007|3.04;O|Oxygen|Кислород|15.999|3.44;F|Fluorine|Фтор|18.998|3.98;Ne|Neon|Неон|20.180|;" +
    "Na|Sodium|Натрий|22.990|0.93;Mg|Magnesium|Магний|24.305|1.31;Al|Aluminium|Алюминий|26.982|1.61;Si|Silicon|Кремний|28.085|1.90;P|Phosphorus|Фосфор|30.974|2.19;S|Sulfur|Сера|32.06|2.58;Cl|Chlorine|Хлор|35.45|3.16;Ar|Argon|Аргон|39.948|;" +
    "K|Potassium|Калий|39.098|0.82;Ca|Calcium|Кальций|40.078|1.00;Sc|Scandium|Скандий|44.956|1.36;Ti|Titanium|Титан|47.867|1.54;V|Vanadium|Ванадий|50.942|1.63;Cr|Chromium|Хром|51.996|1.66;Mn|Manganese|Марганец|54.938|1.55;Fe|Iron|Железо|55.845|1.83;Co|Cobalt|Кобальт|58.933|1.88;Ni|Nickel|Никель|58.693|1.91;Cu|Copper|Медь|63.546|1.90;Zn|Zinc|Цинк|65.38|1.65;Ga|Gallium|Галлий|69.723|1.81;Ge|Germanium|Германий|72.630|2.01;As|Arsenic|Мышьяк|74.922|2.18;Se|Selenium|Селен|78.971|2.55;Br|Bromine|Бром|79.904|2.96;Kr|Krypton|Криптон|83.798|3.00;" +
    "Rb|Rubidium|Рубидий|85.468|0.82;Sr|Strontium|Стронций|87.62|0.95;Y|Yttrium|Иттрий|88.906|1.22;Zr|Zirconium|Цирконий|91.224|1.33;Nb|Niobium|Ниобий|92.906|1.6;Mo|Molybdenum|Молибден|95.95|2.16;Tc|Technetium|Технеций|[98]|1.9;Ru|Ruthenium|Рутений|101.07|2.2;Rh|Rhodium|Родий|102.91|2.28;Pd|Palladium|Палладий|106.42|2.20;Ag|Silver|Серебро|107.87|1.93;Cd|Cadmium|Кадмий|112.41|1.69;In|Indium|Индий|114.82|1.78;Sn|Tin|Олово|118.71|1.96;Sb|Antimony|Сурьма|121.76|2.05;Te|Tellurium|Теллур|127.60|2.1;I|Iodine|Иод|126.90|2.66;Xe|Xenon|Ксенон|131.29|2.60;" +
    "Cs|Caesium|Цезий|132.91|0.79;Ba|Barium|Барий|137.33|0.89;La|Lanthanum|Лантан|138.91|1.10;Ce|Cerium|Церий|140.12|1.12;Pr|Praseodymium|Празеодим|140.91|1.13;Nd|Neodymium|Неодим|144.24|1.14;Pm|Promethium|Прометий|[145]|;Sm|Samarium|Самарий|150.36|1.17;Eu|Europium|Европий|151.96|;Gd|Gadolinium|Гадолиний|157.25|1.20;Tb|Terbium|Тербий|158.93|;Dy|Dysprosium|Диспрозий|162.50|1.22;Ho|Holmium|Гольмий|164.93|1.23;Er|Erbium|Эрбий|167.26|1.24;Tm|Thulium|Тулий|168.93|1.25;Yb|Ytterbium|Иттербий|173.05|;Lu|Lutetium|Лютеций|174.97|1.27;" +
    "Hf|Hafnium|Гафний|178.49|1.3;Ta|Tantalum|Тантал|180.95|1.5;W|Tungsten|Вольфрам|183.84|2.36;Re|Rhenium|Рений|186.21|1.9;Os|Osmium|Осмий|190.23|2.2;Ir|Iridium|Иридий|192.22|2.20;Pt|Platinum|Платина|195.08|2.28;Au|Gold|Золото|196.97|2.54;Hg|Mercury|Ртуть|200.59|2.00;Tl|Thallium|Таллий|204.38|1.62;Pb|Lead|Свинец|207.2|2.33;Bi|Bismuth|Висмут|208.98|2.02;Po|Polonium|Полоний|[209]|2.0;At|Astatine|Астат|[210]|2.2;Rn|Radon|Радон|[222]|2.2;" +
    "Fr|Francium|Франций|[223]|0.7;Ra|Radium|Радий|[226]|0.9;Ac|Actinium|Актиний|[227]|1.1;Th|Thorium|Торий|232.04|1.3;Pa|Protactinium|Протактиний|231.04|1.5;U|Uranium|Уран|238.03|1.38;Np|Neptunium|Нептуний|[237]|1.36;Pu|Plutonium|Плутоний|[244]|1.28;Am|Americium|Америций|[243]|1.3;Cm|Curium|Кюрий|[247]|1.3;Bk|Berkelium|Берклий|[247]|1.3;Cf|Californium|Калифорний|[251]|1.3;Es|Einsteinium|Эйнштейний|[252]|1.3;Fm|Fermium|Фермий|[257]|1.3;Md|Mendelevium|Менделевий|[258]|1.3;No|Nobelium|Нобелий|[259]|1.3;Lr|Lawrencium|Лоуренсий|[266]|;" +
    "Rf|Rutherfordium|Резерфордий|[267]|;Db|Dubnium|Дубний|[268]|;Sg|Seaborgium|Сиборгий|[269]|;Bh|Bohrium|Борий|[270]|;Hs|Hassium|Хассий|[269]|;Mt|Meitnerium|Мейтнерий|[278]|;Ds|Darmstadtium|Дармштадтий|[281]|;Rg|Roentgenium|Рентгений|[282]|;Cn|Copernicium|Коперниций|[285]|;Nh|Nihonium|Нихоний|[286]|;Fl|Flerovium|Флеровий|[289]|;Mc|Moscovium|Московий|[290]|;Lv|Livermorium|Ливерморий|[293]|;Ts|Tennessine|Теннессин|[294]|;Og|Oganesson|Оганесон|[294]|";
  /* Ўзбек тилида русчадан фарқ қиладиган номлар */
  const UZN = { S: "Олтингугурт", Fe: "Темир", Cu: "Мис", Zn: "Рух", Ag: "Кумуш", Sn: "Қалай", Au: "Олтин", Hg: "Симоб", Pb: "Қўрғошин", I: "Йод", As: "Мишьяк (маргимуш)" };
  const CATS = {
    alk: t3("Ишқорий металл", "Щелочной металл", "Alkali metal"),
    ae: t3("Ишқорий-ер металл", "Щёлочноземельный металл", "Alkaline earth metal"),
    tm: t3("Ўтиш металли", "Переходный металл", "Transition metal"),
    pt: t3("Ўтишдан кейинги металл", "Постпереходный металл", "Post-transition metal"),
    md: t3("Металлоид", "Металлоид", "Metalloid"),
    nm: t3("Нометалл", "Неметалл", "Nonmetal"),
    hal: t3("Галоген", "Галоген", "Halogen"),
    ng: t3("Инерт газ", "Благородный газ", "Noble gas"),
    lan: t3("Лантаноид", "Лантаноид", "Lanthanide"),
    act: t3("Актиноид", "Актиноид", "Actinide")
  };
  const CAT_COL = { alk: "#dc2626", ae: "#ea580c", tm: "#ca8a04", pt: "#0d9488", md: "#0891b2", nm: "#16a34a", hal: "#2563eb", ng: "#7c3aed", lan: "#db2777", act: "#9f1239" };
  const inSet = (s) => new Set(s.split(",").map(Number));
  const C_ALK = inSet("3,11,19,37,55,87"), C_AE = inSet("4,12,20,38,56,88"), C_MD = inSet("5,14,32,33,51,52"), C_NM = inSet("1,6,7,8,15,16,34"), C_HAL = inSet("9,17,35,53,85,117"), C_NG = inSet("2,10,18,36,54,86,118"), C_PT = inSet("13,31,49,50,81,82,83,84,113,114,115,116");
  const catOf = (z) => C_ALK.has(z) ? "alk" : C_AE.has(z) ? "ae" : C_MD.has(z) ? "md" : C_NM.has(z) ? "nm" : C_HAL.has(z) ? "hal" : C_NG.has(z) ? "ng" : C_PT.has(z) ? "pt" : z >= 57 && z <= 71 ? "lan" : z >= 89 && z <= 103 ? "act" : "tm";
  /* Жадвалдаги ўрни: период ва гуруҳ; f-блок алоҳида 2 қаторда (9 ва 10-қатор) */
  function place(z) {
    const ends = [2, 10, 18, 36, 54, 86, 118];
    const p = ends.findIndex((e) => z <= e) + 1, s = p === 1 ? 1 : ends[p - 2] + 1, i = z - s;
    if (p === 1) return { p, g: z === 1 ? 1 : 18, r: 1, c: z === 1 ? 1 : 18 };
    if (p <= 3) { const g = i < 2 ? i + 1 : i + 11; return { p, g, r: p, c: g }; }
    if (p <= 5) return { p, g: i + 1, r: p, c: i + 1 };
    if (i < 2) return { p, g: i + 1, r: p, c: i + 1 };
    if (i < 17) return { p, g: 3, r: p + 3, c: i + 1 };
    return { p, g: i - 13, r: p, c: i - 13 };
  }
  /* Электрон конфигурация: Клечковский қоидаси + асосий истиснолар */
  const ORB = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"];
  const CAP = { s: 2, p: 6, d: 10, f: 14 };
  const EXC = { 24: { "4s": 1, "3d": 5 }, 29: { "4s": 1, "3d": 10 }, 41: { "5s": 1, "4d": 4 }, 42: { "5s": 1, "4d": 5 }, 44: { "5s": 1, "4d": 7 }, 45: { "5s": 1, "4d": 8 }, 46: { "5s": 0, "4d": 10 }, 47: { "5s": 1, "4d": 10 }, 57: { "4f": 0, "5d": 1 }, 58: { "4f": 1, "5d": 1 }, 64: { "4f": 7, "5d": 1 }, 78: { "6s": 1, "5d": 9 }, 79: { "6s": 1, "5d": 10 }, 89: { "5f": 0, "6d": 1 }, 90: { "5f": 0, "6d": 2 }, 91: { "5f": 2, "6d": 1 }, 92: { "5f": 3, "6d": 1 }, 93: { "5f": 4, "6d": 1 }, 96: { "5f": 7, "6d": 1 } };
  const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "+": "⁺", "-": "⁻" };
  const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };
  const sup = (s) => String(s).replace(/[0-9+-]/g, (c) => SUP[c]);
  function config(z) {
    let left = z; const occ = {};
    for (const o of ORB) { if (left <= 0) break; const n = Math.min(left, CAP[o[1]]); occ[o] = n; left -= n; }
    if (EXC[z]) Object.assign(occ, EXC[z]);
    const order = Object.keys(occ).filter((o) => occ[o] > 0).sort((a, b) => (+a[0] - +b[0]) || ("spdf".indexOf(a[1]) - "spdf".indexOf(b[1])));
    const shells = []; order.forEach((o) => { const n = +o[0]; shells[n - 1] = (shells[n - 1] || 0) + occ[o]; });
    return { txt: order.map((o) => o + sup(occ[o])).join(" "), shells: Array.from(shells, (x) => x || 0) };
  }
  const ELS = RAW.split(";").map((row, i) => {
    const [s, en, ru, m, x] = row.split("|"), z = i + 1;
    return Object.assign({ z, s, n: t3(UZN[s] || ru, ru, en), m, x: x ? +x : null, cat: catOf(z) }, place(z));
  });
  const ELID = Object.fromEntries(ELS.map((e) => [e.s, e]));
  const RADIO = (z) => z >= 84 || z === 43 || z === 61;

  /* Экологик аҳамият ва ЖССТ ичимлик суви меъёри (мг/л) */
  const ECO = {
    H: [t3("Сувнинг асоси; водород — тоза ёқилғи (ёнганда фақат сув ҳосил бўлади).", "Основа воды; водород — чистое топливо (при горении даёт только воду).", "Part of water; hydrogen is a clean fuel (burns to water only).")],
    C: [t3("Ҳаёт асоси. CO₂ — асосий иссиқхона гази (2025 йилда ≈ 425 ppm).", "Основа жизни. CO₂ — главный парниковый газ (≈ 425 ppm в 2025 г.).", "Basis of life. CO₂ is the main greenhouse gas (≈ 425 ppm in 2025).")],
    N: [t3("Макро-озуқа элементи. Ортиқча нитрат сувни ифлослайди ва эвтрофикацияга сабаб бўлади.", "Макроэлемент питания. Избыток нитратов загрязняет воду и вызывает эвтрофикацию.", "Macronutrient. Excess nitrate pollutes water and drives eutrophication."), "NO₃⁻ 50"],
    O: [t3("Нафас олиш учун зарур. Сувда эриган O₂ < 4 мг/л бўлса, балиқлар қийналади.", "Нужен для дыхания. При растворённом O₂ < 4 мг/л рыбе тяжело.", "Needed for respiration. Fish struggle when dissolved O₂ < 4 mg/L.")],
    F: [t3("Тишлар учун оз миқдорда фойдали, кўпи флюороз касаллигига олиб келади.", "В малых дозах полезен зубам, избыток вызывает флюороз.", "Small amounts protect teeth; excess causes fluorosis."), "1,5"],
    Na: [t3("Шўрланган тупроқ ва Орол бўйи чанг бўронларидаги тузларнинг асосий катиони.", "Главный катион засолённых почв и солевых бурь Приаралья.", "Main cation of saline soils and Aral salt-dust storms.")],
    Mg: [t3("Хлорофилл маркази. Сув қаттиқлигини Ca билан бирга ҳосил қилади.", "Центр хлорофилла. Вместе с Ca создаёт жёсткость воды.", "Centre of chlorophyll. Makes water hard together with Ca.")],
    Al: [t3("Кислотали тупроқда (pH < 5) эрувчан Al³⁺ илдизларни заҳарлайди. Қайта ишлаш 95 % энергия тежайди.", "В кислых почвах (pH < 5) растворимый Al³⁺ отравляет корни. Переработка экономит 95 % энергии.", "In acid soils (pH < 5) soluble Al³⁺ poisons roots. Recycling saves 95 % of energy.")],
    P: [t3("Макро-озуқа. Кўлларда фосфат ортиши сувўтлари гуллашига олиб келади.", "Макроэлемент. Избыток фосфатов в озёрах вызывает цветение воды.", "Macronutrient. Excess phosphate in lakes triggers algal blooms.")],
    S: [t3("SO₂ кислотали ёмғирнинг асосий сабабчиси (кўмир ва мазут ёнганда).", "SO₂ — главная причина кислотных дождей (при сжигании угля и мазута).", "SO₂ is the main cause of acid rain (coal and fuel-oil burning).")],
    Cl: [t3("Ичимлик сувини зарарсизлантиради (қолдиқ хлор 0,3–0,5 мг/л). Шўрланиш кўрсаткичи.", "Обеззараживает питьевую воду (остаточный хлор 0,3–0,5 мг/л). Показатель засоления.", "Disinfects drinking water (residual chlorine 0.3–0.5 mg/L). A salinity indicator.")],
    K: [t3("Макро-озуқа (NPK). Ўсимлик сув балансини бошқаради.", "Макроэлемент (NPK). Регулирует водный баланс растений.", "Macronutrient (NPK). Controls plant water balance.")],
    Ca: [t3("Тупроқ структурасини яхшилайди; гипс шўр тупроқни мелиорациялашда ишлатилади.", "Улучшает структуру почвы; гипс применяют для мелиорации солонцов.", "Improves soil structure; gypsum reclaims sodic soils.")],
    Cr: [t3("Cr(VI) — канцероген (тери ошлаш ва гальваника оқоваси). Cr(III) кам заҳарли.", "Cr(VI) — канцероген (сточные воды кожевенных и гальванических цехов). Cr(III) малотоксичен.", "Cr(VI) is a carcinogen (tannery and plating effluent); Cr(III) is far less toxic."), "0,05"],
    Mn: [t3("Микро-озуқа. Ичимлик сувида кўп бўлса, қора доғ ва нерв тизимига таъсир.", "Микроэлемент. В избытке в питьевой воде — тёмные пятна и влияние на нервную систему.", "Micronutrient. Too much in drinking water stains and affects the nervous system."), "0,08"],
    Fe: [t3("Микро-озуқа. Сувда > 0,3 мг/л бўлса, сариқ-қўнғир ранг ва металл таъми.", "Микроэлемент. При > 0,3 мг/л вода желтеет и имеет металлический вкус.", "Micronutrient. Above 0.3 mg/L water turns yellow-brown and tastes metallic.")],
    Co: [t3("B₁₂ витамини таркибида. Олмалиқ МКК чиқиндиларида учрайди.", "Входит в витамин B₁₂. Встречается в отходах Алмалыкского ГМК.", "Part of vitamin B₁₂. Found in Almalyk mining waste.")],
    Ni: [t3("Аллерген; тупроқда ПДК 80 мг/кг (ялпи).", "Аллерген; ПДК в почве 80 мг/кг (валовое).", "An allergen; soil limit 80 mg/kg (total)."), "0,07"],
    Cu: [t3("Микро-озуқа, лекин кўпи сув жониворлари учун заҳарли. Олмалиқда мис қазиб олинади.", "Микроэлемент, но в избытке токсичен для водных организмов. В Алмалыке добывают медь.", "Micronutrient but toxic to aquatic life in excess. Copper is mined at Almalyk."), "2"],
    Zn: [t3("Микро-озуқа. Рух етишмаса, ғўза ва буғдой ҳосили камаяди.", "Микроэлемент. При дефиците цинка падают урожаи хлопка и пшеницы.", "Micronutrient. Zinc deficiency lowers cotton and wheat yields.")],
    As: [t3("Кучли заҳар ва канцероген; ер ости сувларида табиий манбадан ҳам бўлади.", "Сильный яд и канцероген; бывает в подземных водах природного происхождения.", "Strong poison and carcinogen; also occurs naturally in groundwater."), "0,01"],
    Se: [t3("Оз миқдорда зарур, кўпи заҳарли. Коллектор-дренаж сувларида тўпланади.", "Нужен в малых дозах, в избытке ядовит. Накапливается в коллекторно-дренажных водах.", "Essential in traces, toxic in excess. Builds up in drainage water."), "0,04"],
    Cd: [t3("Ўта заҳарли оғир металл: буйрак ва суякка таъсир (батареялар, фосфорли ўғитлар).", "Очень токсичный тяжёлый металл: поражает почки и кости (батарейки, фосфорные удобрения).", "Highly toxic heavy metal: harms kidneys and bones (batteries, phosphate fertiliser)."), "0,003"],
    Ag: [t3("Бактерияларни ўлдиради; нано-кумуш оқова сув тозалашдаги микробларга зарар қилади.", "Убивает бактерии; наносеребро вредит микробам очистных сооружений.", "Kills bacteria; nano-silver can harm wastewater-treatment microbes.")],
    Hg: [t3("Нерв тизими заҳари (Минамата фожиаси). Симобли лампаларни махсус пунктга топширинг.", "Нейротоксин (трагедия Минаматы). Ртутные лампы сдавайте в спецпункт.", "Neurotoxin (Minamata disaster). Take mercury lamps to a collection point."), "0,006"],
    Pb: [t3("Болалар ақлий ривожига зарар; бензиндан чиқарилган. Аккумуляторларни қайта ишлаш шарт.", "Вредит умственному развитию детей; удалён из бензина. Аккумуляторы — только в переработку.", "Harms children's brain development; removed from petrol. Batteries must be recycled."), "0,01"],
    U: [t3("Радиоактив ва кимёвий заҳарли; Ўзбекистонда қазиб олинади (Навоий).", "Радиоактивен и химически токсичен; добывается в Узбекистане (Навои).", "Radioactive and chemically toxic; mined in Uzbekistan (Navoi)."), "0,03"],
    Rn: [t3("Радиоактив газ: ертўлаларда тўпланади, ўпка саратонининг иккинчи сабаби.", "Радиоактивный газ: накапливается в подвалах, вторая причина рака лёгких.", "Radioactive gas: collects in basements, second cause of lung cancer.")],
    B: [t3("Микро-озуқа; суғориш сувида кўп бўлса, ўсимликка зарар.", "Микроэлемент; в избытке в поливной воде вредит растениям.", "Micronutrient; harmful to plants if irrigation water has too much."), "2,4"],
    Ba: [t3("Эрувчан тузлари заҳарли; BaSO₄ эса эримайди ва рентгенда ишлатилади.", "Растворимые соли ядовиты; BaSO₄ нерастворим и применяется в рентгене.", "Soluble salts are toxic; insoluble BaSO₄ is used in X-rays."), "1,3"],
    Sb: [t3("Пластик (PET) идишлардан сувга ўтиши мумкин.", "Может переходить в воду из пластиковых (ПЭТ) бутылок.", "Can leach into water from PET bottles."), "0,02"],
    Tl: [t3("Ўта заҳарли металл (каламуш заҳари бўлган); ҳозир тақиқланган.", "Крайне ядовитый металл (бывший крысиный яд); сейчас запрещён.", "Extremely toxic (former rat poison); now banned.")],
    Ti: [t3("TiO₂ — фотокатализатор: қуёш нурида ҳаводаги ифлосликни парчалайди.", "TiO₂ — фотокатализатор: на свету разлагает загрязнения воздуха.", "TiO₂ is a photocatalyst that breaks down air pollutants in sunlight.")],
    Li: [t3("Электромобил батареялари; уларни қайта ишлаш — «яшил» иқтисодиёт.", "Батареи электромобилей; их переработка — «зелёная» экономика.", "EV batteries; recycling them is part of the green economy.")],
    Si: [t3("Қуёш панеллари асоси; тупроқнинг асосий элементи (кварц, SiO₂).", "Основа солнечных панелей; главный элемент почвы (кварц, SiO₂).", "Basis of solar panels; main element of soil (quartz, SiO₂).")]
  };
  const NUTR = { N: "M", P: "M", K: "M", Ca: "M", Mg: "M", S: "M", Fe: "m", Mn: "m", Zn: "m", Cu: "m", B: "m", Mo: "m", Cl: "m", Ni: "m" };
  const HEAVY = new Set(["Pb", "Cd", "Hg", "As", "Cr", "Tl", "Ni", "Cu", "Zn", "Co", "Sb", "Se", "Ba"]);

  /* ---------- 2. Ионлар ва эрувчанлик жадвали ---------- */
  /* Катионлар: код, формула, заряд, номлар (uz, ru — қаратқич келишиги, en), эритма ранги */
  const CA = [
    ["H", "H", 1, "водород", "водорода", "hydrogen", ""],
    ["Li", "Li", 1, "литий", "лития", "lithium", ""],
    ["K", "K", 1, "калий", "калия", "potassium", ""],
    ["Na", "Na", 1, "натрий", "натрия", "sodium", ""],
    ["NH4", "NH4", 1, "аммоний", "аммония", "ammonium", ""],
    ["Ba", "Ba", 2, "барий", "бария", "barium", ""],
    ["Ca", "Ca", 2, "кальций", "кальция", "calcium", ""],
    ["Mg", "Mg", 2, "магний", "магния", "magnesium", ""],
    ["Sr", "Sr", 2, "стронций", "стронция", "strontium", ""],
    ["Al", "Al", 3, "алюминий", "алюминия", "aluminium", ""],
    ["Cr", "Cr", 3, "хром(III)", "хрома(III)", "chromium(III)", "#4d7c0f"],
    ["Fe2", "Fe", 2, "темир(II)", "железа(II)", "iron(II)", "#a7f3d0"],
    ["Fe3", "Fe", 3, "темир(III)", "железа(III)", "iron(III)", "#d97706"],
    ["Ni", "Ni", 2, "никель", "никеля", "nickel", "#4ade80"],
    ["Co", "Co", 2, "кобальт", "кобальта", "cobalt", "#f9a8d4"],
    ["Mn", "Mn", 2, "марганец(II)", "марганца(II)", "manganese(II)", "#fce7f3"],
    ["Zn", "Zn", 2, "рух", "цинка", "zinc", ""],
    ["Ag", "Ag", 1, "кумуш", "серебра", "silver", ""],
    ["Hg", "Hg", 2, "симоб(II)", "ртути(II)", "mercury(II)", ""],
    ["Pb", "Pb", 2, "қўрғошин", "свинца", "lead(II)", ""],
    ["Sn", "Sn", 2, "қалай(II)", "олова(II)", "tin(II)", ""],
    ["Cu", "Cu", 2, "мис(II)", "меди(II)", "copper(II)", "#3b82f6"],
    ["Cd", "Cd", 2, "кадмий", "кадмия", "cadmium", ""]
  ].map(([c, f, q, uz, ru, en, col]) => ({ c, f, q, n: t3(uz, ru, en), col }));
  /* Анионлар: код, формула, заряд, туз номи (uz, ru, en), кислота номи, эритма ранги */
  const AN = [
    ["OH", "OH", 1, "гидроксид", "гидроксид", "hydroxide", null, ""],
    ["F", "F", 1, "фторид", "фторид", "fluoride", t3("фторид кислота", "плавиковая кислота", "hydrofluoric acid"), ""],
    ["Cl", "Cl", 1, "хлорид", "хлорид", "chloride", t3("хлорид кислота", "соляная кислота", "hydrochloric acid"), ""],
    ["Br", "Br", 1, "бромид", "бромид", "bromide", t3("бромид кислота", "бромоводородная кислота", "hydrobromic acid"), ""],
    ["I", "I", 1, "йодид", "иодид", "iodide", t3("йодид кислота", "иодоводородная кислота", "hydroiodic acid"), ""],
    ["NO3", "NO3", 1, "нитрат", "нитрат", "nitrate", t3("нитрат кислота", "азотная кислота", "nitric acid"), ""],
    ["NO2", "NO2", 1, "нитрит", "нитрит", "nitrite", t3("нитрит кислота", "азотистая кислота", "nitrous acid"), ""],
    ["SO4", "SO4", 2, "сульфат", "сульфат", "sulfate", t3("сульфат кислота", "серная кислота", "sulfuric acid"), ""],
    ["SO3", "SO3", 2, "сульфит", "сульфит", "sulfite", t3("сульфит кислота", "сернистая кислота", "sulfurous acid"), ""],
    ["S", "S", 2, "сульфид", "сульфид", "sulfide", t3("сульфид кислота (водород сульфид)", "сероводород", "hydrogen sulfide"), ""],
    ["CO3", "CO3", 2, "карбонат", "карбонат", "carbonate", t3("карбонат кислота", "угольная кислота", "carbonic acid"), ""],
    ["HCO3", "HCO3", 1, "гидрокарбонат", "гидрокарбонат", "hydrogen carbonate", null, ""],
    ["PO4", "PO4", 3, "фосфат", "фосфат", "phosphate", t3("фосфат кислота", "фосфорная кислота", "phosphoric acid"), ""],
    ["SiO3", "SiO3", 2, "силикат", "силикат", "silicate", t3("силикат кислота", "кремниевая кислота", "silicic acid"), ""],
    ["CH3COO", "CH3COO", 1, "ацетат", "ацетат", "acetate", t3("сирка кислота", "уксусная кислота", "acetic acid"), ""],
    ["CrO4", "CrO4", 2, "хромат", "хромат", "chromate", null, "#facc15"],
    ["MnO4", "MnO4", 1, "перманганат", "перманганат", "permanganate", null, "#7e22ce"]
  ].map(([c, f, q, uz, ru, en, acid, col]) => ({ c, f, q, n: t3(uz, ru, en), acid, col }));
  const CAID = Object.fromEntries(CA.map((x) => [x.c, x])), ANID = Object.fromEntries(AN.map((x) => [x.c, x]));
  /* Эрувчанлик: R — эрийди, M — кам эрийди, N — эримайди, - — мавжуд эмас ёки сувда парчаланади.
     Устунлар тартиби CA: H Li K Na NH4 Ba Ca Mg Sr Al Cr Fe2 Fe3 Ni Co Mn Zn Ag Hg Pb Sn Cu Cd */
  const SOL = {
    OH: "-RRRRRMNMNNNNNNNN--NNNN",
    F: "RMRRRMNNNMMMMMMMMR-MRMR",
    Cl: "RRRRRRRRRRRRRRRRRNRMRRR",
    Br: "RRRRRRRRRRRRRRRRRNMMRRR",
    I: "RRRRRRRRRRRR-RRRRNNNM-R",
    NO3: "RRRRRRRRRRRRRRRRRRRRRRR",
    NO2: "RRRRRRRRR--R-RRRRM-R-RR",
    SO4: "RRRRRNMRNRRRRRRRRMMNRRR",
    SO3: "RRRRRNNMN--N-NNNNN-N--N",
    S: "MRRRRRM-R--N-NNNNNNNNNN",
    CO3: "-MRRRNNNN--N-NNNNN-N--N",
    HCO3: "-RRRRRRRR--------------",
    PO4: "RNRRRNNNNNNNNNNNNNNNNNN",
    SiO3: "NNRR-NNNN--N-NNNN--N-NN",
    CH3COO: "RRRRRRRRRRRRRRRRRMRRRRR",
    CrO4: "-RRRRNMRM----NNNNNNN-NN",
    MnO4: "-RRRRRRRR-----------R--"
  };
  const solOf = (ca, an) => { const i = CA.findIndex((x) => x.c === ca); return SOL[an] ? SOL[an][i] || "-" : "-"; };
  /* Чўкма ранглари (адабиёт): калит — катион+анион */
  const PPT = {
    AgCl: "#f8fafc", AgBr: "#fef9c3", AgI: "#fde047", Ag3PO4: "#facc15", Ag2CrO4: "#b45309", Ag2S: "#111827", Ag2CO3: "#fef3c7", Ag2SO3: "#f8fafc", Ag2SiO3: "#fef3c7",
    PbI2: "#facc15", PbCrO4: "#eab308", PbS: "#111827", BaCrO4: "#fde047", CuS: "#111827", FeS: "#111827", NiS: "#111827", CoS: "#111827", HgS: "#111827", CdS: "#facc15", MnS: "#fbcfe8", ZnS: "#f8fafc", SnS: "#78350f", HgI2: "#dc2626",
    "Cu(OH)2": "#3b82f6", "Fe(OH)2": "#bbf7d0", "Fe(OH)3": "#9a3412", "Ni(OH)2": "#22c55e", "Co(OH)2": "#f472b6", "Mn(OH)2": "#fef3c7", "Cr(OH)3": "#65a30d", "Cd(OH)2": "#f8fafc",
    Ag2O: "#57534e", HgO: "#facc15", "(CuOH)2CO3": "#0d9488", CuI: "#fef3c7", "Fe3(PO4)2": "#f8fafc", FePO4: "#fef3c7", "Ni3(PO4)2": "#86efac", "Co3(PO4)2": "#e879f9", "Cu3(PO4)2": "#60a5fa", NiCO3: "#86efac", CoCO3: "#f9a8d4", FeCO3: "#d6d3d1", CuCO3: "#2dd4bf", H2SiO3: "#f1f5f9"
  };

  /* ---------- 3. Формулалар: тузиш, кўрсатиш, таҳлил ---------- */
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const isPoly = (f) => (f.match(/[A-Z]/g) || []).length > 1 || /\d/.test(f);
  function saltF(ca, an) {
    const a = CAID[ca], b = ANID[an], l = (a.q * b.q) / gcd(a.q, b.q), nc = l / a.q, na = l / b.q;
    const grp = (f, n, p) => (n === 1 ? f : p ? "(" + f + ")" + n : f + n);
    if (an === "CH3COO") return ca === "H" ? "CH3COOH" : (na === 1 ? "CH3COO" : "(CH3COO)" + na) + grp(a.f, nc, ca === "NH4");
    return grp(a.f, nc, ca === "NH4") + grp(b.f, na, isPoly(b.f));
  }
  const fixAcid = (f) => f;
  /* Кўриниш: рақамлар индексга, «·» ва зарядлар */
  function pretty(f) {
    return String(f).replace(/([A-Za-z)\]])(\d+)/g, (m, a, d) => a + d.replace(/\d/g, (c) => SUB[c]));
  }
  /* Формуладаги атомлар сони: қавслар () ва [] ҳамда «·» кристаллогидрат */
  function parse(f) {
    const out = {};
    const parts = String(f).replace(/\s/g, "").split(/[·*.]/);
    parts.forEach((p) => {
      let mul = 1; const m0 = p.match(/^(\d+)(.*)$/); if (m0) { mul = +m0[1]; p = m0[2]; }
      const st = [{}]; let i = 0;
      while (i < p.length) {
        const ch = p[i];
        if (ch === "(" || ch === "[") { st.push({}); i++; continue; }
        if (ch === ")" || ch === "]") {
          i++; let n = ""; while (i < p.length && /\d/.test(p[i])) n += p[i++];
          const top = st.pop(), k = n ? +n : 1;
          Object.entries(top).forEach(([e, c]) => { st[st.length - 1][e] = (st[st.length - 1][e] || 0) + c * k; }); continue;
        }
        const m = p.slice(i).match(/^([A-Z][a-z]?)(\d*)/);
        if (!m) throw new Error("formula");
        if (!ELID[m[1]]) throw new Error("element " + m[1]);
        st[st.length - 1][m[1]] = (st[st.length - 1][m[1]] || 0) + (m[2] ? +m[2] : 1);
        i += m[0].length;
      }
      if (st.length !== 1) throw new Error("brackets");
      Object.entries(st[0]).forEach(([e, c]) => { out[e] = (out[e] || 0) + c * mul; });
    });
    return out;
  }
  function molarMass(f) { const a = parse(f); let m = 0; for (const [e, n] of Object.entries(a)) { const v = parseFloat(String(ELID[e].m).replace(/[[\]]/g, "")); m += v * n; } return m; }

  /* ---------- 4. Тенглаштириш: бутун сонли нул-фазо (рационал Гаусс) ---------- */
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]), fsub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]), fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
  function balance(lhs, rhs) {
    const sp = lhs.concat(rhs), comp = sp.map(parse);
    const els = [...new Set(comp.flatMap((c) => Object.keys(c)))];
    const n = sp.length;
    const A = els.map((e) => sp.map((_, j) => fr((comp[j][e] || 0) * (j < lhs.length ? 1 : -1))));
    /* Охирги коэффициентни 1 деб олиб, қолганларини ечамиз */
    const rows = A.length; let r = 0; const piv = [];
    for (let c = 0; c < n && r < rows; c++) {
      let p = r; while (p < rows && A[p][c][0] === 0) p++;
      if (p === rows) continue;
      [A[r], A[p]] = [A[p], A[r]];
      const pv = A[r][c]; A[r] = A[r].map((x) => fdiv(x, pv));
      for (let i = 0; i < rows; i++) if (i !== r && A[i][c][0] !== 0) { const k = A[i][c]; A[i] = A[i].map((x, j) => fsub(x, fmul(k, A[r][j]))); }
      piv.push(c); r++;
    }
    const free = [...Array(n).keys()].filter((c) => !piv.includes(c));
    if (free.length !== 1) return null;
    const f = free[0], x = Array(n).fill(null); x[f] = fr(1);
    piv.forEach((c, i) => { x[c] = fr(-A[i][f][0], A[i][f][1]); });
    if (x.some((v) => v[0] <= 0)) return null;
    const L = x.reduce((l, v) => (l * v[1]) / gcd(l, v[1]), 1);
    let ints = x.map((v) => (v[0] * L) / v[1]);
    const g = ints.reduce((a, b) => gcd(a, b)); ints = ints.map((v) => v / g);
    return ints;
  }
  /* «Fe + O2 = Fe3O4» ёки «Fe + O2 -> Fe3O4» матнини тенглаштириш */
  function balanceText(s) {
    const t = String(s).replace(/→|=+>|->|⟶/g, "=").replace(/[₀-₉]/g, (c) => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(c)]);
    const [l, r] = t.split("="); if (!l || !r) return null;
    const side = (x) => x.split("+").map((y) => y.trim().replace(/^\d+(?=[A-Z(\[])/, "").replace(/[↑↓]/g, "")).filter(Boolean);
    const lhs = side(l), rhs = side(r);
    try { const k = balance(lhs, rhs); return k ? { lhs, rhs, k } : null; } catch (e) { return null; }
  }
  const eqStr = (lhs, rhs, k, marks = {}) => {
    const term = (f, i) => (k[i] > 1 ? k[i] : "") + pretty(f) + (marks[f] || "");
    return lhs.map((f, i) => term(f, i)).join(" + ") + " → " + rhs.map((f, i) => term(f, i + lhs.length)).join(" + ");
  };

  /* ---------- 5. Моддалар каталоги ---------- */
  const SUBS = [], SID = {};
  const addS = (o) => { if (SID[o.f]) return SID[o.f]; SUBS.push(o); SID[o.f] = o; return o; };
  const STRONG_ACID = new Set(["Cl", "Br", "I", "NO3", "SO4"]);
  const STRONG_BASE = new Set(["Li", "K", "Na", "Ba", "Ca", "Sr"]);
  CA.forEach((ca) => AN.forEach((an) => {
    const s = solOf(ca.c, an.c); if (s === "-") return;
    if (ca.c === "H" && !an.acid) return;
    const f = fixAcid(saltF(ca.c, an.c));
    let k = "salt", n;
    if (ca.c === "H") { k = "acid"; n = an.acid; }
    else if (an.c === "OH") { k = "base"; n = t3(ca.n.uz + " гидроксид", "гидроксид " + ca.n.ru, ca.n.en + " hydroxide"); }
    else n = t3(ca.n.uz + " " + an.n.uz, an.n.ru + " " + ca.n.ru, ca.n.en + " " + an.n.en);
    addS({ f, k, ca: ca.c, an: an.c, sol: s, n });
  }));
  /* Металлар (фаоллик қатори бўйича), оддий моддалар, оксидлар */
  const ACT = ["Li", "K", "Ba", "Sr", "Ca", "Na", "Mg", "Al", "Mn", "Zn", "Cr", "Fe", "Cd", "Co", "Ni", "Sn", "Pb", "H", "Cu", "Hg", "Ag", "Pt", "Au"];
  const MET_ION = { Li: "Li", K: "K", Ba: "Ba", Sr: "Sr", Ca: "Ca", Na: "Na", Mg: "Mg", Al: "Al", Mn: "Mn", Zn: "Zn", Fe: "Fe2", Cd: "Cd", Co: "Co", Ni: "Ni", Sn: "Sn", Pb: "Pb", Cu: "Cu", Hg: "Hg", Ag: "Ag" };
  ["Li", "Na", "K", "Ca", "Ba", "Mg", "Al", "Mn", "Zn", "Fe", "Cd", "Co", "Ni", "Sn", "Pb", "Cu", "Hg", "Ag", "Pt", "Au"].forEach((m) => addS({ f: m, k: "metal", n: ELID[m].n }));
  const SIMPLE = [
    ["H2", "gas", t3("Водород", "Водород", "Hydrogen")], ["O2", "gas", t3("Кислород", "Кислород", "Oxygen")], ["N2", "gas", t3("Азот", "Азот", "Nitrogen")],
    ["Cl2", "hal", t3("Хлор", "Хлор", "Chlorine")], ["Br2", "hal", t3("Бром", "Бром", "Bromine")], ["I2", "hal", t3("Йод", "Иод", "Iodine")], ["F2", "hal", t3("Фтор", "Фтор", "Fluorine")],
    ["C", "nonmetal", t3("Кўмир (углерод)", "Уголь (углерод)", "Carbon (charcoal)")], ["S", "nonmetal", t3("Олтингугурт", "Сера", "Sulfur")], ["P", "nonmetal", t3("Фосфор (қизил)", "Фосфор (красный)", "Phosphorus (red)")], ["Si", "nonmetal", t3("Кремний", "Кремний", "Silicon")],
    ["H2O", "water", t3("Сув", "Вода", "Water")], ["H2O2", "perox", t3("Водород пероксид", "Пероксид водорода", "Hydrogen peroxide")], ["NH3", "gas", t3("Аммиак", "Аммиак", "Ammonia")], ["CH4", "org", t3("Метан (табиий газ)", "Метан (природный газ)", "Methane (natural gas)")],
    ["C2H5OH", "org", t3("Этанол", "Этанол", "Ethanol")], ["C6H12O6", "org", t3("Глюкоза", "Глюкоза", "Glucose")], ["C3H8", "org", t3("Пропан", "Пропан", "Propane")], ["CO", "gas", t3("Углерод(II) оксид (ис гази)", "Угарный газ", "Carbon monoxide")], ["KClO3", "salt", t3("Калий хлорат (Бертолле тузи)", "Хлорат калия (бертолетова соль)", "Potassium chlorate")], ["MnO2", "oxide", t3("Марганец(IV) оксид", "Оксид марганца(IV)", "Manganese(IV) oxide")], ["K2Cr2O7", "salt", t3("Калий дихромат", "Дихромат калия", "Potassium dichromate")], ["CaSO4·2H2O", "salt", t3("Гипс", "Гипс", "Gypsum")], ["CuSO4·5H2O", "salt", t3("Мис купороси", "Медный купорос", "Copper(II) sulfate pentahydrate")]
  ];
  SIMPLE.forEach(([f, k, n]) => addS({ f, k, n }));
  /* Оксидлар: b — асосли, a — кислотали, am — амфотер, n — туз ҳосил қилмайдиган */
  const OX = [
    ["Li2O", "b", "Li"], ["Na2O", "b", "Na"], ["K2O", "b", "K"], ["BaO", "b", "Ba"], ["CaO", "b", "Ca"], ["MgO", "b", "Mg"], ["SrO", "b", "Sr"], ["FeO", "b", "Fe2"], ["CuO", "b", "Cu"], ["NiO", "b", "Ni"], ["MnO", "b", "Mn"], ["HgO", "b", "Hg"], ["Ag2O", "b", "Ag"], ["CdO", "b", "Cd"], ["CoO", "b", "Co"],
    ["Al2O3", "am", "Al"], ["ZnO", "am", "Zn"], ["Fe2O3", "b", "Fe3"], ["Cr2O3", "am", "Cr"], ["PbO", "am", "Pb"], ["SnO", "am", "Sn"], ["Fe3O4", "b", ""],
    ["CO2", "a", "CO3"], ["SO2", "a", "SO3"], ["SO3", "a", "SO4"], ["P2O5", "a", "PO4"], ["SiO2", "a", "SiO3"], ["N2O5", "a", "NO3"], ["NO2", "n", ""], ["NO", "n", ""], ["N2O", "n", ""], ["CrO3", "a", "CrO4"]
  ];
  const OXN = { Fe3O4: t3("Темир қуюндиси (Fe₃O₄, магнетит)", "Железная окалина (Fe₃O₄, магнетит)", "Magnetite (Fe₃O₄)"), NO2: t3("Азот(IV) оксид (қўнғир газ)", "Оксид азота(IV) (бурый газ)", "Nitrogen dioxide (brown gas)"), NO: t3("Азот(II) оксид", "Оксид азота(II)", "Nitric oxide"), N2O: t3("Азот(I) оксид (кулдирувчи газ)", "Оксид азота(I) (веселящий газ)", "Nitrous oxide"), CO2: t3("Карбонат ангидрид (CO₂)", "Углекислый газ (CO₂)", "Carbon dioxide"), SO2: t3("Олтингугурт(IV) оксид", "Сернистый газ", "Sulfur dioxide"), SO3: t3("Олтингугурт(VI) оксид", "Оксид серы(VI)", "Sulfur trioxide"), P2O5: t3("Фосфор(V) оксид", "Оксид фосфора(V)", "Phosphorus pentoxide"), SiO2: t3("Кремний(IV) оксид (кварц, қум)", "Оксид кремния (кварц, песок)", "Silicon dioxide (quartz, sand)"), N2O5: t3("Азот(V) оксид", "Оксид азота(V)", "Dinitrogen pentoxide"), CrO3: t3("Хром(VI) оксид", "Оксид хрома(VI)", "Chromium(VI) oxide") };
  OX.forEach(([f, t, ion]) => { const ca = CAID[ion]; addS({ f, k: "oxide", ot: t, ion, n: OXN[f] || t3(ca.n.uz + " оксид", "оксид " + ca.n.ru, ca.n.en + " oxide") }); });
  addS({ f: "NH4OH", k: "base", ca: "NH4", an: "OH", sol: "R", n: t3("Аммиакли сув (NH₃·H₂O)", "Нашатырный спирт (NH₃·H₂O)", "Aqueous ammonia (NH₃·H₂O)") });
  addS({ f: "KMnO4", k: "salt", ca: "K", an: "MnO4", sol: "R", n: t3("Калий перманганат", "Перманганат калия", "Potassium permanganate") });

  /* ---------- 6. Реакция қоидалари ---------- */
  const isSol = (s) => s && (s.sol === "R" || s.k === "water");
  const salt = (ca, an) => SID[fixAcid(saltF(ca, an))];
  const actIx = (m) => ACT.indexOf(m);
  /* Газлар ва уларнинг белгиси */
  const GAS = { CO2: t3("CO₂ пуфакчалари (ҳидсиз)", "пузырьки CO₂ (без запаха)", "CO₂ bubbles (odourless)"), H2: t3("H₂ пуфакчалари (ёнади — «пақ» этади)", "пузырьки H₂ (горит с хлопком)", "H₂ bubbles (pops when lit)"), SO2: t3("SO₂ — бўғувчи ўткир ҳид", "SO₂ — удушливый резкий запах", "SO₂ — choking sharp smell"), H2S: t3("H₂S — палағда тухум ҳиди, заҳарли!", "H₂S — запах тухлых яиц, ядовит!", "H₂S — rotten-egg smell, toxic!"), NH3: t3("NH₃ — ўткир нашатир ҳиди", "NH₃ — резкий запах нашатыря", "NH₃ — sharp ammonia smell"), NO: t3("NO — ҳавода қўнғир NO₂ га айланади, заҳарли!", "NO — на воздухе буреет (NO₂), ядовит!", "NO — turns brown NO₂ in air, toxic!"), NO2: t3("NO₂ — қўнғир заҳарли газ", "NO₂ — бурый ядовитый газ", "NO₂ — brown toxic gas"), O2: t3("O₂ — чўғланган чўп аланга олади", "O₂ — тлеющая лучинка вспыхивает", "O₂ — a glowing splint relights"), Cl2: t3("Cl₂ — сарғиш-яшил заҳарли газ", "Cl₂ — жёлто-зелёный ядовитый газ", "Cl₂ — yellow-green toxic gas"), HCl: t3("HCl — ўткир ҳид, нам ҳавода «тутун»", "HCl — резкий запах, «дымит» во влажном воздухе", "HCl — sharp smell, fumes in moist air"), H2O: null, N2: t3("N₂ — рангсиз газ", "N₂ — бесцветный газ", "N₂ — colourless gas") };
  const TOXIC_GAS = new Set(["H2S", "SO2", "NO", "NO2", "Cl2", "HCl", "NH3", "CO"]);
  const HEAVY_CA = new Set(["Pb", "Hg", "Cd", "Cr", "Ag", "Ba", "Ni", "Co", "Cu"]);

  function R_(type, lhs, rhs, extra = {}) { return Object.assign({ type, lhs: [...new Set(lhs)], rhs: [...new Set(rhs)] }, extra); }
  function react(fa, fb) {
    const A = SID[fa], B = SID[fb];
    if (!A || !B) return null;
    const pair = (k1, k2) => (A.k === k1 && B.k === k2 ? [A, B] : B.k === k1 && A.k === k2 ? [B, A] : null);
    let p;
    /* Сув билан */
    if ((p = pair("metal", "water"))) {
      const m = p[0].f;
      if (["Li", "Na", "K", "Ca", "Ba"].includes(m)) { const b = salt(MET_ION[m], "OH"); return R_("redox", [m, "H2O"], [b.f, "H2"], { heat: true, why: t3("Фаол металл сувни парчалайди ва ишқор ҳосил қилади.", "Активный металл разлагает воду с образованием щёлочи.", "An active metal splits water, forming an alkali.") }); }
      if (m === "Mg") return R_("redox", ["Mg", "H2O"], ["Mg(OH)2", "H2"], { slow: true, why: t3("Магний фақат иссиқ сув билан секин реакцияга киришади.", "Магний медленно реагирует только с горячей водой.", "Magnesium reacts slowly, only with hot water.") });
      return null;
    }
    if ((p = pair("oxide", "water"))) {
      const o = p[0];
      if (o.ot === "b" && STRONG_BASE.has(o.ion)) return R_("comb", [o.f, "H2O"], [salt(o.ion, "OH").f], { heat: true, why: t3("Асосли оксид + сув → ишқор (сўндирилган оҳак шундай олинади).", "Основный оксид + вода → щёлочь (так гасят известь).", "Basic oxide + water → alkali (this is how lime is slaked).") });
      if (o.ot === "a" && o.f !== "SiO2") { const ac = salt("H", o.ion); return R_("comb", [o.f, "H2O"], [ac.f], { why: t3("Кислотали оксид + сув → кислота (кислотали ёмғир механизми).", "Кислотный оксид + вода → кислота (механизм кислотных дождей).", "Acidic oxide + water → acid (how acid rain forms).") }); }
      return null;
    }
    /* Ёниш: O₂ билан */
    if ((p = pair("gas", "metal")) && p[0].f === "O2") {
      const m = p[1].f, OXP = { Mg: "MgO", Ca: "CaO", Ba: "BaO", Li: "Li2O", Na: "Na2O2", K: "KO2", Al: "Al2O3", Zn: "ZnO", Fe: "Fe3O4", Cu: "CuO", Ni: "NiO", Mn: "MnO2", Sn: "SnO2", Pb: "PbO", Hg: "HgO", Co: "Co3O4", Cd: "CdO" };
      if (!OXP[m]) return R_("none", [m, "O2"], [], { why: t3("Нодир металл кислородда ёнмайди.", "Благородный металл не горит в кислороде.", "A noble metal does not burn in oxygen.") });
      return R_("comb", [m, "O2"], [OXP[m]], { heat: true, flame: m === "Mg" ? "#ffffff" : m === "Na" ? "#facc15" : m === "Cu" ? "#22c55e" : m === "K" ? "#c084fc" : "#fb923c", why: t3("Металл кислородда ёниб оксид ҳосил қилади.", "Металл сгорает в кислороде, образуя оксид.", "The metal burns in oxygen to form an oxide.") });
    }
    if (A.f === "O2" || B.f === "O2") {
      const o = A.f === "O2" ? B : A, NM = { C: ["CO2"], S: ["SO2"], P: ["P2O5"], H2: ["H2O"], Si: ["SiO2"], CH4: ["CO2", "H2O"], C2H5OH: ["CO2", "H2O"], C6H12O6: ["CO2", "H2O"], C3H8: ["CO2", "H2O"], CO: ["CO2"], NH3: ["N2", "H2O"], NO: ["NO2"], SO2: ["SO3"], H2S: ["SO2", "H2O"] };
      if (NM[o.f]) return R_("comb", [o.f, "O2"], NM[o.f], { heat: true, flame: o.f === "S" ? "#60a5fa" : o.f === "H2" ? "#bae6fd" : "#fb923c", why: o.f === "C6H12O6" ? t3("Нафас олишдаги каби: глюкоза оксидланиб энергия беради.", "Как при дыхании: глюкоза окисляется с выделением энергии.", "As in respiration: glucose is oxidised, releasing energy.") : t3("Ёниш — кислород билан тез оксидланиш, иссиқлик ва ёруғлик чиқади.", "Горение — быстрое окисление кислородом с выделением тепла и света.", "Combustion is fast oxidation releasing heat and light.") });
    }
    /* Галогенлар */
    if ((p = pair("hal", "metal"))) {
      const h = p[0].f.slice(0, -1), m = p[1].f, ion = m === "Fe" ? "Fe3" : MET_ION[m];
      if (!ion || ["Au", "Pt"].includes(m)) return null;
      const s = salt(ion, h); if (!s) return null;
      return R_("redox", [m, p[0].f], [s.f], { heat: true, why: t3("Галоген металлни оксидлайди (темир FeCl₃ гача).", "Галоген окисляет металл (железо — до FeCl₃).", "The halogen oxidises the metal (iron to FeCl₃).") });
    }
    if ((p = pair("hal", "salt")) && p[1].an && ["Cl", "Br", "I"].includes(p[1].an)) {
      const order = ["F", "Cl", "Br", "I"], h = p[0].f.slice(0, -1), x = p[1].an;
      if (order.indexOf(h) < order.indexOf(x) && h !== "F") { const ns = salt(p[1].ca, h); if (!ns) return null; return R_("redox", [p[0].f, p[1].f], [ns.f, x + "2"], { col: x === "I" ? "#92400e" : "#d97706", why: t3("Фаолроқ галоген камроқ фаолини тузидан сиқиб чиқаради.", "Более активный галоген вытесняет менее активный из соли.", "A more reactive halogen displaces a less reactive one from its salt.") }); }
      return R_("none", [p[0].f, p[1].f], [], { why: t3("Камроқ фаол галоген фаолроғини сиқиб чиқара олмайди.", "Менее активный галоген не вытесняет более активный.", "A less reactive halogen cannot displace a more reactive one.") });
    }
    if ((p = pair("hal", "gas")) && p[1].f === "H2") return R_("comb", ["H2", p[0].f], ["H" + p[0].f.slice(0, -1)], { heat: true, why: t3("Водород галоген билан водород галогенид ҳосил қилади.", "Водород с галогеном образует галогеноводород.", "Hydrogen and a halogen form a hydrogen halide.") });
    /* Пероксид парчаланиши (MnO₂ катализатор) */
    if ((A.f === "H2O2" && B.f === "MnO2") || (B.f === "H2O2" && A.f === "MnO2")) return R_("decomp", ["H2O2"], ["H2O", "O2"], { cat: "MnO₂", why: t3("MnO₂ катализатор: ўзи сарфланмайди, лекин парчаланишни тезлаштиради.", "MnO₂ — катализатор: не расходуется, но ускоряет разложение.", "MnO₂ is a catalyst: it is not used up but speeds up decomposition.") });
    /* Металл + кислота */
    if ((p = pair("metal", "acid"))) {
      const m = p[0].f, ac = p[1];
      if (ac.an === "NO3") {
        if (["Au", "Pt"].includes(m)) return R_("none", [m, ac.f], [], { why: t3("Олтин ва платина нитрат кислотада эримайди (фақат «шоҳ ароғи»да).", "Золото и платина не растворяются в азотной кислоте (только в «царской водке»).", "Gold and platinum resist nitric acid (only aqua regia dissolves them).") });
        if (["Al", "Cr"].includes(m)) return R_("none", [m, ac.f], [], { why: t3("Пассивланиш: сиртда зич оксид парда ҳосил бўлади.", "Пассивация: на поверхности образуется плотная оксидная плёнка.", "Passivation: a dense oxide film forms on the surface.") });
        const ion = m === "Fe" ? "Fe3" : MET_ION[m]; const s = salt(ion, "NO3"); if (!s) return null;
        return R_("redox", [m, "HNO3"], [s.f, "NO", "H2O"], { why: t3("Нитрат кислота оксидловчи: водород эмас, азот оксидлари ажралади.", "Азотная кислота — окислитель: выделяется не водород, а оксиды азота.", "Nitric acid is an oxidiser: nitrogen oxides form, not hydrogen.") });
      }
      if (actIx(m) > actIx("H")) return R_("none", [m, ac.f], [], { why: t3("Металл фаоллик қаторида водороддан кейин — кислотадан H₂ ни сиқиб чиқара олмайди.", "Металл стоит в ряду активности после водорода — не вытесняет H₂ из кислоты.", "The metal is below hydrogen in the activity series — it cannot displace H₂.") });
      const s = salt(MET_ION[m], ac.an); if (!s || ac.an === "SiO3") return null;
      if (s.sol === "N" || s.sol === "M") return R_("none", [m, ac.f], [], { why: t3("Сиртда эримайдиган туз пардаси ҳосил бўлиб, реакция тўхтайди (" + pretty(s.f) + ").", "На поверхности образуется плёнка нерастворимой соли, и реакция останавливается (" + pretty(s.f) + ").", "An insoluble salt film (" + pretty(s.f) + ") forms and stops the reaction.") });
      return R_("redox", [m, ac.f], [s.f, "H2"], { heat: true, why: t3("Водороддан олдинги металл кислотадан водородни сиқиб чиқаради.", "Металл, стоящий до водорода, вытесняет водород из кислоты.", "A metal above hydrogen displaces hydrogen from the acid.") });
    }
    /* Металл + туз эритмаси */
    if ((p = pair("metal", "salt")) && p[1].ca && p[1].sol === "R") {
      const m = p[0].f, s = p[1], m2 = CAID[s.ca].f;
      if (["Li", "Na", "K", "Ca", "Ba"].includes(m)) return R_("none", [m, s.f], [], { why: t3("Жуда фаол металл аввал сув билан реакцияга киришади (ишқор + H₂), тузни сиқиб чиқармайди.", "Очень активный металл сначала реагирует с водой (щёлочь + H₂), а не с солью.", "A very active metal reacts with the water first (alkali + H₂), not with the salt.") });
      if (["NH4", "H"].includes(s.ca) || actIx(m2) < 0) return null;
      if (actIx(m) >= actIx(m2)) return R_("none", [m, s.f], [], { why: t3("Металл тузидаги металлдан фаол эмас — ўрин алмашмайди.", "Металл не активнее металла соли — замещения нет.", "The metal is not more reactive than the one in the salt — no displacement.") });
      const ion = MET_ION[m]; const ns = salt(ion, s.an); if (!ns) return null;
      const out = s.ca === "Fe3" ? [ns.f, salt("Fe2", s.an).f] : [ns.f, m2];
      return R_("redox", [m, s.f], out, { metalOut: s.ca === "Fe3" ? null : m2, why: s.ca === "Fe3" ? t3("Fe³⁺ фаол металл билан Fe²⁺ гача қайтарилади.", "Fe³⁺ восстанавливается активным металлом до Fe²⁺.", "Fe³⁺ is reduced to Fe²⁺ by the active metal.") : t3("Фаолроқ металл камроқ фаол металлни тузидан сиқиб чиқаради (мис ғиштранг қопланади).", "Более активный металл вытесняет менее активный из соли.", "A more reactive metal displaces a less reactive one from its salt.") });
    }
    /* Кислота + асос */
    if ((p = pair("acid", "base"))) {
      const ac = p[0], b = p[1], s = salt(b.ca, ac.an); if (!s) return null;
      if (b.sol === "N" && s.sol === "N") return R_("none", [ac.f, b.f], [], { why: t3("Эримайдиган асос ва ҳосил бўладиган туз ҳам эримайди — реакция деярли бормайди.", "Нерастворимое основание, и соль тоже нерастворима — реакция почти не идёт.", "Insoluble base and insoluble salt — the reaction barely proceeds.") });
      return R_("neut", [ac.f, b.f], [s.f, "H2O"], { heat: true, why: t3("Нейтраллаш: H⁺ + OH⁻ → H₂O, иссиқлик ажралади.", "Нейтрализация: H⁺ + OH⁻ → H₂O, выделяется тепло.", "Neutralisation: H⁺ + OH⁻ → H₂O, heat is released.") });
    }
    /* Оксидлар + кислота/асос */
    if ((p = pair("oxide", "acid")) && ["b", "am"].includes(p[0].ot) && p[0].ion) {
      const s = salt(p[0].ion, p[1].an); if (!s) return null;
      return R_("neut", [p[0].f, p[1].f], [s.f, "H2O"], { why: t3("Асосли оксид кислота билан туз ва сув ҳосил қилади.", "Основный оксид с кислотой даёт соль и воду.", "A basic oxide and an acid give a salt and water.") });
    }
    if ((p = pair("oxide", "base")) && p[0].ot === "a" && STRONG_BASE.has(p[1].ca)) {
      const s = salt(p[1].ca, p[0].ion); if (!s) return null;
      return R_("neut", [p[0].f, p[1].f], [s.f, "H2O"], { ppt: s.sol === "N" ? s.f : null, why: p[0].f === "CO2" && p[1].ca === "Ca" ? t3("Оҳак суви лойқаланади — CO₂ ни аниқлаш реакцияси.", "Известковая вода мутнеет — качественная реакция на CO₂.", "Limewater turns milky — the classic test for CO₂.") : t3("Кислотали оксид ишқор билан туз ва сув ҳосил қилади (газларни тутиш).", "Кислотный оксид со щёлочью даёт соль и воду (улавливание газов).", "An acidic oxide and an alkali give a salt and water (gas scrubbing).") });
    }
    if ((p = pair("oxide", "oxide")) && ((p[0].ot === "b" && p[1].ot === "a") || (p[0].ot === "a" && p[1].ot === "b"))) {
      const b = p[0].ot === "b" ? p[0] : p[1], a = p[0].ot === "a" ? p[0] : p[1], s = salt(b.ion, a.ion); if (!s) return null;
      return R_("comb", [b.f, a.f], [s.f], { heat: true, why: t3("Асосли ва кислотали оксид бирикиб туз ҳосил қилади.", "Основный и кислотный оксиды соединяются в соль.", "A basic and an acidic oxide combine into a salt.") });
    }
    /* Амфотерлик: Al(OH)₃ / Zn(OH)₂ + ишқор */
    if ((p = pair("base", "base")) && ["Al", "Zn", "Cr"].includes(p[0].ca) !== ["Al", "Zn", "Cr"].includes(p[1].ca)) {
      const am = ["Al", "Zn", "Cr"].includes(p[0].ca) ? p[0] : p[1], al = am === p[0] ? p[1] : p[0];
      if (!["Na", "K"].includes(al.ca)) return null;
      const M = CAID[am.ca].f, X = al.ca, prod = am.ca === "Zn" ? X + "2[Zn(OH)4]" : X + "[" + M + "(OH)4]";
      return R_("comb", [am.f, al.f], [prod], { why: t3("Амфотер гидроксид ишқорда эриб, гидроксокомплекс ҳосил қилади.", "Амфотерный гидроксид растворяется в щёлочи, образуя гидроксокомплекс.", "An amphoteric hydroxide dissolves in alkali, forming a hydroxo complex.") });
    }
    /* Ион алмашиниш: кислота/асос/туз аралашмаси */
    const ion = (x) => x && x.ca && x.an;
    if (ion(A) && ion(B)) {
      if (A.ca === B.ca || A.an === B.an) return R_("none", [A.f, B.f], [], { why: t3("Бир хил ион — янги модда ҳосил бўлмайди.", "Общий ион — новых веществ не образуется.", "A common ion — no new substance forms.") });
      if (A.sol === "N" && B.sol === "N") return R_("none", [A.f, B.f], [], { why: t3("Иккала модда ҳам эримайди — ионлар учрашмайди.", "Оба вещества нерастворимы — ионы не встречаются.", "Both are insoluble — the ions never meet.") });
      const acid = A.ca === "H" ? A : B.ca === "H" ? B : null, other = acid === A ? B : A;
      /* Кислота + туз: газ ёки кучсиз кислота */
      if (acid && other.k !== "base") {
        const GA = { CO3: ["CO2", "H2O"], HCO3: ["CO2", "H2O"], SO3: ["SO2", "H2O"], S: ["H2S"] };
        if (GA[other.an] && STRONG_ACID.has(acid.an) || (GA[other.an] && ["CH3COO", "PO4"].includes(acid.an) && other.an !== "S")) {
          const s = salt(other.ca, acid.an); if (!s) return null;
          if (s.sol === "N" && other.sol === "N") return R_("none", [A.f, B.f], [], { why: t3("Сиртда эримайдиган туз пардаси реакцияни тўхтатади.", "Плёнка нерастворимой соли останавливает реакцию.", "An insoluble salt film stops the reaction.") });
          return R_("gas", [acid.f, other.f], [s.f].concat(GA[other.an]), { ppt: s.sol === "N" ? s.f : null, why: other.an === "S" ? t3("Кучли кислота сульфиддан H₂S ни сиқиб чиқаради (заҳарли!).", "Сильная кислота вытесняет H₂S из сульфида (ядовит!).", "A strong acid releases toxic H₂S from a sulfide.") : t3("Кучли кислота кучсиз ва беқарор кислотани сиқиб чиқаради — газ ажралади.", "Сильная кислота вытесняет слабую неустойчивую кислоту — выделяется газ.", "A strong acid displaces a weak, unstable acid — gas is released.") });
        }
        if (other.an === "SiO3" && other.sol === "R") { const s = salt(other.ca, acid.an); return R_("ppt", [acid.f, other.f], [s.f, "H2SiO3"], { ppt: "H2SiO3", why: t3("Силикат кислота — эримайдиган оқ ивиқ (гел).", "Кремниевая кислота — нерастворимый белый студень (гель).", "Silicic acid forms an insoluble white gel.") }); }
        if (other.an === "CH3COO" && STRONG_ACID.has(acid.an)) { const s = salt(other.ca, acid.an); return R_("weak", [acid.f, other.f], [s.f, "CH3COOH"], { smell: t3("сирка ҳиди", "запах уксуса", "vinegar smell"), why: t3("Кучли кислота кучсиз сирка кислотасини сиқиб чиқаради.", "Сильная кислота вытесняет слабую уксусную кислоту.", "A strong acid displaces weak acetic acid.") }); }
      }
      /* Ишқор + аммоний тузи → NH₃ */
      const base = A.an === "OH" ? A : B.an === "OH" ? B : null, sl = base === A ? B : A;
      if (base && STRONG_BASE.has(base.ca) && sl.ca === "NH4") { const s = salt(base.ca, sl.an); if (!s) return null; return R_("gas", [base.f, sl.f], [s.f, "NH3", "H2O"], { ppt: s.sol === "N" ? s.f : null, why: t3("Ишқор аммоний тузидан аммиакни сиқиб чиқаради — нам лакмус кўкаради.", "Щёлочь вытесняет аммиак из соли аммония — влажный лакмус синеет.", "An alkali releases ammonia from an ammonium salt — damp litmus turns blue.") }); }
      /* Ишқор + Ag⁺/Hg²⁺ → оксид */
      if (base && STRONG_BASE.has(base.ca) && ["Ag", "Hg"].includes(sl.ca)) { const s = salt(base.ca, sl.an); const ox = sl.ca === "Ag" ? "Ag2O" : "HgO"; return R_("ppt", [sl.f, base.f], [ox, s.f, "H2O"], { ppt: ox, why: t3("AgOH ва Hg(OH)₂ беқарор — дарров оксидга айланади.", "AgOH и Hg(OH)₂ неустойчивы — сразу переходят в оксид.", "AgOH and Hg(OH)₂ are unstable and turn straight into the oxide.") }); }
      /* Гидролиз: Al³⁺/Fe³⁺/Cr³⁺ + CO₃²⁻/S²⁻/SO₃²⁻ */
      const tri = ["Al", "Fe3", "Cr"].includes(A.ca) ? A : ["Al", "Fe3", "Cr"].includes(B.ca) ? B : null, wk = tri === A ? B : A;
      if (tri && wk.ca !== "H" && ["CO3", "S", "SO3"].includes(wk.an) && wk.sol === "R" && tri.sol === "R") {
        const hy = salt(tri.ca, "OH"), sp = salt(wk.ca, tri.an), g = { CO3: "CO2", S: "H2S", SO3: "SO2" }[wk.an];
        return R_("hyd", [tri.f, wk.f, "H2O"], [hy.f, g, sp.f], { ppt: hy.f, why: t3("Биргаликдаги гидролиз: " + CAID[tri.ca].n.uz + " карбонати/сульфиди сувда мавжуд эмас — гидроксид чўкади ва газ чиқади.", "Совместный гидролиз: карбонат/сульфид " + CAID[tri.ca].n.ru + " в воде не существует — выпадает гидроксид и выделяется газ.", "Mutual hydrolysis: the carbonate/sulfide does not exist in water — the hydroxide precipitates and gas escapes.") });
      }
      if ((A.ca === "Cu" && B.an === "CO3") || (B.ca === "Cu" && A.an === "CO3")) { const cu = A.ca === "Cu" ? A : B, co = cu === A ? B : A; if (cu.sol !== "R" || co.sol !== "R") return null; return R_("hyd", [cu.f, co.f, "H2O"], ["(CuOH)2CO3", "CO2", salt(co.ca, cu.an).f], { ppt: "(CuOH)2CO3", why: t3("Мис(II) карбонати ўрнига асосли туз — малахит (CuOH)₂CO₃ чўкади.", "Вместо карбоната меди(II) осаждается основная соль — малахит (CuOH)₂CO₃.", "Instead of copper(II) carbonate, basic copper carbonate (malachite) precipitates.") }); }
      /* Оксидланиш-қайтарилиш: Fe³⁺ / Cu²⁺ + I⁻ */
      if ((A.ca === "Fe3" && B.an === "I") || (B.ca === "Fe3" && A.an === "I")) { const fe = A.ca === "Fe3" ? A : B, io = fe === A ? B : A; if (fe.sol !== "R") return null; return R_("redox", [fe.f, io.f], [salt("Fe2", fe.an).f, "I2", salt(io.ca, fe.an).f], { col: "#92400e", why: t3("Fe³⁺ йодидни эркин йодгача оксидлайди — эритма қўнғир бўлади.", "Fe³⁺ окисляет иодид до свободного иода — раствор буреет.", "Fe³⁺ oxidises iodide to free iodine — the solution turns brown.") }); }
      if ((A.ca === "Cu" && B.an === "I") || (B.ca === "Cu" && A.an === "I")) { const cu = A.ca === "Cu" ? A : B, io = cu === A ? B : A; if (cu.sol !== "R") return null; return R_("redox", [cu.f, io.f], ["CuI", "I2", salt(io.ca, cu.an).f], { ppt: "CuI", col: "#92400e", why: t3("Cu²⁺ йодидни оксидлайди: CuI оқ чўкмаси ва I₂ (йодометрия асоси).", "Cu²⁺ окисляет иодид: белый осадок CuI и I₂ (основа иодометрии).", "Cu²⁺ oxidises iodide: white CuI and I₂ (basis of iodometry).") }); }
      /* Оддий алмашиниш */
      const p1 = salt(A.ca, B.an), p2 = salt(B.ca, A.an);
      if (!p1 || !p2) return R_("none", [A.f, B.f], [], { why: t3("Бундай модда сувли эритмада мавжуд эмас (парчаланади).", "Такое вещество в водном растворе не существует (разлагается).", "Such a substance does not exist in water (it decomposes).") });
      const prods = [p1, p2], solid = prods.filter((x) => x.sol === "N" || (x.sol === "M" && !(A.sol === "M" || B.sol === "M")));
      const water = prods.some((x) => x.f === "H2O");
      if (solid.length) {
        return R_("ppt", [A.f, B.f], [p1.f, p2.f], { ppt: solid[0].f, ppt2: solid[1] ? solid[1].f : null, why: t3("Ион алмашиниш: эримайдиган модда ҳосил бўлиб, чўкмага тушади.", "Ионный обмен: образуется нерастворимое вещество и выпадает в осадок.", "Ion exchange: an insoluble product forms and precipitates.") });
      }
      void water;
      return R_("none", [A.f, B.f], [], { why: t3("Барча ҳосил бўлиши мумкин бўлган моддалар эрийди — ионлар фақат аралашади (чўкма, газ ёки сув йўқ).", "Все возможные продукты растворимы — ионы просто смешиваются (нет осадка, газа или воды).", "All possible products are soluble — the ions just mix (no precipitate, gas or water).") });
    }
    return R_("none", [A.f, B.f], [], { why: t3("Бу шароитда реакция кузатилмайди.", "В этих условиях реакция не наблюдается.", "No reaction is observed under these conditions.") });
  }
  /* Қиздиришда парчаланиш */
  function heat(f) {
    const S = SID[f]; if (!S) return null;
    const T = {
      CaCO3: ["CaO", "CO2"], MgCO3: ["MgO", "CO2"], BaCO3: ["BaO", "CO2"], ZnCO3: ["ZnO", "CO2"], FeCO3: ["FeO", "CO2"], PbCO3: ["PbO", "CO2"], "(CuOH)2CO3": ["CuO", "CO2", "H2O"],
      NaHCO3: ["Na2CO3", "CO2", "H2O"], KHCO3: ["K2CO3", "CO2", "H2O"], "Ca(HCO3)2": ["CaCO3", "CO2", "H2O"],
      KMnO4: ["K2MnO4", "MnO2", "O2"], KClO3: ["KCl", "O2"], H2O2: ["H2O", "O2"], HgO: ["Hg", "O2"], Ag2O: ["Ag", "O2"],
      NH4Cl: ["NH3", "HCl"], "(NH4)2CO3": ["NH3", "CO2", "H2O"], NH4NO3: ["N2O", "H2O"], NH4NO2: ["N2", "H2O"],
      KNO3: ["KNO2", "O2"], NaNO3: ["NaNO2", "O2"], AgNO3: ["Ag", "NO2", "O2"], "Cu(NO3)2": ["CuO", "NO2", "O2"], "Pb(NO3)2": ["PbO", "NO2", "O2"], "Zn(NO3)2": ["ZnO", "NO2", "O2"], "Mg(NO3)2": ["MgO", "NO2", "O2"], "Ca(NO3)2": ["CaO", "NO2", "O2"],
      "CaSO4·2H2O": ["CaSO4", "H2O"], "CuSO4·5H2O": ["CuSO4", "H2O"], "K2Cr2O7": null, H2SiO3: ["SiO2", "H2O"]
    };
    let out = T[f];
    if (!out && S.k === "base" && S.sol === "N") { const ox = OX.find(([, , ion]) => ion === S.ca); if (ox) out = [ox[0], "H2O"]; }
    if (!out) return R_("none", [f], [], { why: t3("Бу модда оддий қиздиришда парчаланмайди (ёки эрийди/суюқланади).", "Это вещество при обычном нагревании не разлагается (плавится или испаряется).", "This substance does not decompose on ordinary heating (it melts or evaporates).") });
    return R_("decomp", [f], out, { heat: true, endo: true, why: f === "CaCO3" ? t3("Оҳак тошни куйдириш — цемент ишлаб чиқаришда CO₂ нинг асосий манбаи.", "Обжиг известняка — главный источник CO₂ при производстве цемента.", "Burning limestone is the main CO₂ source in cement making.") : f === "CuSO4·5H2O" ? t3("Кўк кристаллар сувини йўқотиб оқаради; сув қўшилса яна кўкаради.", "Синие кристаллы теряют воду и белеют; с водой снова синеют.", "Blue crystals lose water and turn white; adding water makes them blue again.") : t3("Қиздирилганда мураккаб модда оддийроқ моддаларга парчаланади.", "При нагревании сложное вещество разлагается на более простые.", "Heating breaks the compound into simpler substances.") });
  }
  /* Тенгламани тўлдириш: коэффициентлар, белгилар, ионли тенглама */
  const STRONG_EL = (f) => { const s = SID[f]; if (!s || !s.ca) return false; if (s.ca === "H") return STRONG_ACID.has(s.an); if (s.an === "OH") return STRONG_BASE.has(s.ca) && s.sol !== "N" && s.ca !== "NH4"; return s.sol === "R"; };
  const ionsOf = (f) => { const s = SID[f], a = CAID[s.ca], b = ANID[s.an], l = (a.q * b.q) / gcd(a.q, b.q); return [[pretty(a.f) + (a.q > 1 ? sup(a.q + "+") : sup("+")), l / a.q], [pretty(b.f) + (b.q > 1 ? sup(b.q + "-") : sup("-")), l / b.q]]; };
  function finish(r) {
    if (!r || r.type === "none") return r;
    const k = balance(r.lhs, r.rhs);
    if (!k) return Object.assign(r, { k: null });
    r.k = k;
    const marks = {};
    r.rhs.forEach((f) => { const aqGas = GAS[f] !== undefined && f !== "H2O" && !(f === "HCl" && r.type !== "decomp"); if (aqGas) { marks[f] = "↑"; return; } if (GAS[f] !== undefined) return; if ((SID[f] && (SID[f].sol === "N" || SID[f].sol === "M") && SID[f].k !== "water") || f === r.ppt || f === r.ppt2 || (r.metalOut === f)) marks[f] = "↓"; });
    if (r.type === "comb" || r.type === "decomp") r.rhs.forEach((f) => { if (marks[f] === "↓" && r.type === "comb") delete marks[f]; });
    r.marks = marks;
    r.eq = eqStr(r.lhs, r.rhs, k, marks);
    /* Ионли тенглама (сувли эритмадаги реакциялар учун) */
    if (["ppt", "gas", "neut", "weak", "hyd"].includes(r.type) || (r.type === "redox" && r.lhs.some((f) => SID[f] && SID[f].k === "salt"))) {
      const side = (arr, off) => { const m = new Map(); arr.forEach((f, i) => { const c = k[i + off]; if (STRONG_EL(f) && !(marks[f] === "↓")) ionsOf(f).forEach(([ion, n]) => m.set(ion, (m.get(ion) || 0) + n * c)); else m.set(pretty(f) + (marks[f] || ""), (m.get(pretty(f) + (marks[f] || "")) || 0) + c); }); return m; };
      const L = side(r.lhs, 0), R = side(r.rhs, r.lhs.length);
      const full = (m) => [...m].map(([s, c]) => (c > 1 ? c : "") + s).join(" + ");
      r.ionFull = full(L) + " → " + full(R);
      const Ln = new Map(L), Rn = new Map(R);
      [...Ln.keys()].forEach((s) => { if (Rn.has(s)) { const c = Math.min(Ln.get(s), Rn.get(s)); Ln.set(s, Ln.get(s) - c); Rn.set(s, Rn.get(s) - c); } });
      const clean = (m) => new Map([...m].filter(([, c]) => c > 0));
      let Lc = clean(Ln), Rc = clean(Rn);
      const g = [...Lc.values(), ...Rc.values()].reduce((a, b) => gcd(a, b), 0) || 1;
      Lc = new Map([...Lc].map(([s, c]) => [s, c / g])); Rc = new Map([...Rc].map(([s, c]) => [s, c / g]));
      if (Lc.size && Rc.size) r.ionNet = full(Lc) + " → " + full(Rc);
    }
    /* Кузатувлар */
    const obs = [];
    const gases = r.rhs.filter((f) => marks[f] === "↑");
    gases.forEach((g) => { if (GAS[g]) obs.push(["gas", GAS[g]]); });
    const ppts = r.rhs.filter((f) => marks[f] === "↓");
    ppts.forEach((p) => obs.push(["ppt", p, PPT[p] || "#f8fafc"]));
    r.obs = obs;
    r.toxic = gases.some((g) => TOXIC_GAS.has(g)) || r.lhs.concat(r.rhs).some((f) => ["Cl2", "Br2", "H2S", "CO", "NO2", "SO2"].includes(f));
    r.heavy = r.lhs.concat(r.rhs).some((f) => { const s = SID[f]; return s && ((s.ca && HEAVY_CA.has(s.ca)) || (s.k === "metal" && ["Pb", "Hg", "Cd"].includes(f)) || (s.k === "oxide" && HEAVY_CA.has(s.ion))); }) || r.lhs.concat(r.rhs).some((f) => /Cr2O7|CrO4/.test(f));
    /* Эритма ранги */
    const colOf = (f) => { const s = SID[f]; if (!s) return ""; const a = s.ca && CAID[s.ca], b = s.an && ANID[s.an]; return (b && b.col) || (a && a.col) || ""; };
    r.solCol = r.col || r.rhs.filter((f) => marks[f] !== "↓" && marks[f] !== "↑").map(colOf).find(Boolean) || "";
    return r;
  }

  function safe(fn) { try { const r = fn(); if (r && r.lhs.concat(r.rhs).some((x) => !x)) return null; return r; } catch (e) { return null; } }
  const api = { ELS, ELID, CATS, CAT_COL, ECO, NUTR, HEAVY, RADIO, config, SUBS, SID, CA, AN, SOL, solOf, parse, molarMass, balance, balanceText, pretty, react: (a, b) => finish(safe(() => react(a, b))), heat: (f) => finish(safe(() => heat(f))), PPT, t3 };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }
  window.EkoDavriy = api;
})();
