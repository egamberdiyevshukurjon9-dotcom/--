/* Экомун — ⚗️ «Лаборатория хонаси»: Менделеев жадвали, моддалар каталоги ва реакция столи.
   Ядро — vendor/eko-kimyo-reak.js (window.EkoReak): 118 элемент, ~500 модда, тенглаштириш, ионли тенгламалар.
   Бу модуль фақат интерфейс: жадвал, қидирув, 3 ўринли реакция столи, натижа карточкаси, стехиометрия
   калькулятори ва машҳур тажрибалар. 3D хонадаги реакция колбаси ва стол шишалари EkoLabXona.rx орқали
   бошқарилади (суриш ва колбага ташлаш — eko:lx-mix / eko:lx-pick ҳодисалари).
   Мактаб босқичида хавфли моддалар 🔒, радиоактив элементлар фақат маълумот. Матнлар uz/ru/en. */
(() => {
  "use strict";
  const RK = window.EkoReak;
  if (!RK) return;

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
  const fmt = (v, d = 2) => { if (v == null || !isFinite(v)) return "—"; const s = (+v).toFixed(d).replace(/\.?0+$/, (m) => (m.startsWith(".") ? "" : m)); return lang() === "en" ? s : s.replace(".", ","); };
  const num = (s) => parseFloat(String(s).replace(",", "."));
  const App = () => window.EkoApp;
  const flags = () => { const a = App(); if (!a) return {}; a.state.flags = a.state.flags || {}; return a.state.flags; };
  const once = (k, n, why) => { const a = App(); if (!a) return false; const f = flags(); if (f[k]) return false; f[k] = true; a.addXp(n, why); if (a.save) a.save(); return true; };
  const toast = (m) => { const a = App(); if (a && a.toast) a.toast(m); };
  const LX = () => window.EkoLabXona;
  const uni = () => { const c = document.documentElement.classList; if (c.contains("stage-maktab")) return false; if (c.contains("stage-uni")) return true; return !window.EkoProfile || EkoProfile.stage !== "maktab"; };
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getJ = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } };
  const putJ = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  const WHY = "Лаборатория хонаси: реакциялар";
  const P = (f) => esc(RK.pretty(f));
  const sub = (id) => RK.BY[id];
  const locked = (s) => !s || s.rad || (!uni() && !s.safe);

  /* ---------- Матнлар ---------- */
  const TX = {
    title: t3("Менделеев жадвали ва реакция столи", "Таблица Менделеева и стол реакций", "Periodic table & reaction bench"),
    lead: t3("Жадвалдан элементни ёки каталогдан моддани танлаб, столга қўйинг (3 тагача) ва «Аралаштириш» ни босинг. Тенглама автомат тенглаштирилади; реакция бормаса, сабаби тушунтирилади. 3D хонада шишаларни колбага суриб ташласангиз ҳам реакция бошланади.", "Выберите элемент в таблице или вещество в каталоге, поставьте на стол (до 3) и нажмите «Смешать». Уравнение уравнивается автоматически; если реакция не идёт, объясняется почему. В 3D-комнате можно перетащить склянки в колбу.", "Pick an element from the table or a substance from the catalogue, put up to 3 on the bench and press Mix. Equations are balanced automatically; if nothing happens you'll see why. In the 3D room you can also drag bottles into the flask."),
    bench: t3("Реакция столи", "Стол реакций", "Reaction bench"),
    empty: t3("Стол бўш — пастдан модда қўшинг.", "Стол пуст — добавьте вещество ниже.", "The bench is empty — add a substance below."),
    mix: t3("Аралаштириш", "Смешать", "Mix"), clear: t3("Тозалаш", "Очистить", "Clear"), heat: t3("Қиздириш", "Нагрев", "Heat"),
    add: t3("Столга қўйиш", "На стол", "Add to bench"), full: t3("Столда 3 та модда бор — бирини олиб ташланг.", "На столе уже 3 вещества — уберите одно.", "The bench already holds 3 substances — remove one."),
    lock: t3("🔒 Бу модда хавфли — у билан фақат университет босқичида, ўқитувчи назоратида ишланади.", "🔒 Вещество опасно — работа с ним только на университетском этапе под контролем преподавателя.", "🔒 This substance is hazardous — university stage only, under supervision."),
    radL: t3("☢️ Радиоактив элемент: виртуал лабораторияда фақат маълумот сифатида кўрсатилади.", "☢️ Радиоактивный элемент: в виртуальной лаборатории только справочные данные.", "☢️ Radioactive element: shown as reference data only."),
    ppe: t3("⛔ Аввал ҳимоя кийимини кийинг (халат, кўзойнак, қўлқоп) — юқоридаги «Ҳимоя воситалари».", "⛔ Сначала наденьте защиту (халат, очки, перчатки) — блок «Средства защиты» выше.", "⛔ Put on your safety gear first (coat, goggles, gloves) — see Safety gear above."),
    tabPt: t3("Менделеев жадвали", "Таблица Менделеева", "Periodic table"), tabSubs: t3("Моддалар", "Вещества", "Substances"), tabExp: t3("Машҳур тажрибалар", "Известные опыты", "Classic experiments"),
    search: t3("Қидириш: Fe, мис, sulfate…", "Поиск: Fe, медь, sulfate…", "Search: Fe, copper, sulfate…"),
    all: t3("Ҳаммаси", "Все", "All"),
    eq: t3("Тенглама", "Уравнение", "Equation"), obs: t3("Нима кузатилади", "Наблюдения", "What you observe"), ionF: t3("Тўлиқ ионли тенглама", "Полное ионное уравнение", "Full ionic equation"), ionN: t3("Қисқартирилган ионли тенглама", "Сокращённое ионное уравнение", "Net ionic equation"),
    prod: t3("Маҳсулотлар", "Продукты", "Products"), noR: t3("Реакция бормайди", "Реакция не идёт", "No reaction"), cat: t3("Катализатор", "Катализатор", "Catalyst"),
    stoich: t3("Стехиометрия калькулятори", "Калькулятор стехиометрии", "Stoichiometry calculator"),
    stoichH: t3("Ҳар бир реагентнинг массасини киритинг: модда миқдори n = m / M, чекловчи реагент — n/коэффициент энг кичиги. Газ ҳажми н.ш. да 22,4 л/моль.", "Введите массу каждого реагента: n = m / M, лимитирующий реагент — наименьшее n/коэффициент. Объём газа при н.у. 22,4 л/моль.", "Enter each reagent's mass: n = m / M; the limiting reagent has the smallest n/coefficient. Gas volume at STP is 22.4 L/mol."),
    lim: t3("чекловчи", "лимитирующий", "limiting"), exc: t3("ортиқча", "в избытке", "in excess"),
    disc: t3("Кашф қилинган реакциялар", "Открытые реакции", "Reactions discovered"),
    mass: t3("Атом массаси", "Атомная масса", "Atomic mass"), grp: t3("Гуруҳ", "Группа", "Group"), per: t3("Давр", "Период", "Period"), phase: t3("Ҳолати (20 °C)", "Состояние (20 °C)", "State (20 °C)"),
    chi: t3("Электроманфийлик (Полинг)", "Электроотрицательность (Полинг)", "Electronegativity (Pauling)"), mp: t3("Суюқланиш ҳарорати", "Температура плавления", "Melting point"), bp: t3("Қайнаш ҳарорати", "Температура кипения", "Boiling point"),
    dens: t3("Зичлик", "Плотность", "Density"), ox: t3("Оксидланиш даражалари", "Степени окисления", "Oxidation states"), cfg: t3("Электрон тузилиши", "Электронная конфигурация", "Electron configuration"), yr: t3("Кашф этилган йил", "Год открытия", "Discovered"),
    anc: t3("қадимдан маълум", "известен с древности", "known since antiquity"),
    comp: t3("Шу элемент иштирок этган моддалар", "Вещества с этим элементом", "Substances containing this element"),
    molM: t3("Молляр масса", "Молярная масса", "Molar mass"), sol: t3("Сувда эрувчанлиги", "Растворимость в воде", "Water solubility"),
    src: t3("Элементлар маълумоти: mendeleev (MIT), IUPAC атом массалари; эрувчанлик ва активлик қатори — мактаб дарсликлари ва CRC Handbook. Номаълум жуфтлик учун ўйлаб топилган маҳсулот кўрсатилмайди.", "Данные элементов: mendeleev (MIT), атомные массы IUPAC; растворимость и ряд активности — школьные учебники и CRC Handbook. Для неизвестных пар выдуманные продукты не показываются.", "Element data: mendeleev (MIT), IUPAC atomic masses; solubility and activity series from school textbooks and the CRC Handbook. No invented products are shown for unknown pairs."),
    dissT: t3("Эриш (диссоциация)", "Растворение (диссоциация)", "Dissolution (dissociation)"), hyd: t3("Гидролиз", "Гидролиз", "Hydrolysis"),
    env: { acid: t3("Муҳит кислотали (pH < 7)", "Среда кислая (pH < 7)", "Acidic (pH < 7)"), alk: t3("Муҳит ишқорий (pH > 7)", "Среда щелочная (pH > 7)", "Alkaline (pH > 7)"), neut: t3("Муҳит нейтрал (pH ≈ 7)", "Среда нейтральная (pH ≈ 7)", "Neutral (pH ≈ 7)"), both: t3("Иккала ион ҳам гидролизланади", "Гидролиз по катиону и аниону", "Both ions hydrolyse") },
    exo: t3("🌡️ Эриганда эритма исийди.", "🌡️ При растворении раствор нагревается.", "🌡️ The solution warms up as it dissolves."), endo: t3("❄️ Эриганда эритма совийди.", "❄️ При растворении раствор охлаждается.", "❄️ The solution cools as it dissolves."),
    exoR: t3("🔥 Экзотермик: иссиқлик ажралади.", "🔥 Экзотермическая: выделяется тепло.", "🔥 Exothermic: heat is released."),
    gas: t3("Газ", "Газ", "Gas"), ppt: t3("Чўкма", "Осадок", "Precipitate"),
    load: t3("Столга қўйиш ва аралаштириш", "Поставить и смешать", "Load & mix"),
    st: { s: t3("қаттиқ", "твёрдое", "solid"), l: t3("суюқ", "жидкое", "liquid"), g: t3("газ", "газ", "gas"), u: t3("номаълум", "неизвестно", "unknown"), aq: t3("эритма", "раствор", "solution") },
    solN: { R: t3("яхши эрийди", "растворимо", "soluble"), M: t3("кам эрийди", "малорастворимо", "slightly soluble"), N: t3("эримайди", "нерастворимо", "insoluble"), D: t3("сувда парчаланади", "разлагается водой", "decomposes in water") },
    cls: { metal: t3("Металлар", "Металлы", "Metals"), nonmetal: t3("Нометаллар", "Неметаллы", "Non-metals"), noble: t3("Инерт газлар", "Благородные газы", "Noble gases"), acid: t3("Кислоталар", "Кислоты", "Acids"), base: t3("Асослар", "Основания", "Bases"), salt: t3("Тузлар", "Соли", "Salts"), oxide: t3("Оксидлар", "Оксиды", "Oxides"), org: t3("Органик моддалар", "Органические вещества", "Organic"), other: t3("Бошқалар", "Другие", "Other"), water: t3("Сув", "Вода", "Water"), gas: t3("Газлар", "Газы", "Gases") },
    haz: { flam: t3("Ёнувчан", "Огнеопасно", "Flammable"), cor: t3("Ўювчи", "Едкое", "Corrosive"), tox: t3("Заҳарли", "Токсично", "Toxic"), hp: t3("Соғлиққа хавфли", "Опасно для здоровья", "Health hazard"), ox: t3("Оксидловчи", "Окислитель", "Oxidiser"), irr: t3("Таъсирловчи", "Раздражающее", "Irritant"), env: t3("Табиатга хавфли", "Опасно для природы", "Environmental hazard"), rad: t3("Радиоактив", "Радиоактивно", "Radioactive") },
    more: t3("Яна кўрсатиш", "Показать ещё", "Show more"), shown: t3("та кўрсатилди", "показано", "shown")
  };
  const HAZI = { flam: "fa-fire", cor: "fa-hand-dots", tox: "fa-skull-crossbones", hp: "fa-heart-crack", ox: "fa-fire-flame-curved", irr: "fa-triangle-exclamation", env: "fa-fish", rad: "fa-radiation" };

  /* Реакция бормаслик сабаблари */
  const WHYT = {
    same: t3("Бир хил моддалар — реакция йўқ.", "Одинаковые вещества — реакции нет.", "Identical substances — no reaction."),
    common: t3("Иккала моддада умумий ион бор — алмашиниш реакцияси бормайди.", "У веществ общий ион — реакция обмена не идёт.", "The substances share an ion — no exchange reaction."),
    acids: t3("Кислота кислота билан алмашиниш реакциясига киришмайди.", "Кислота с кислотой в реакцию обмена не вступает.", "Two acids do not undergo exchange."),
    bases: t3("Асос асос билан реакцияга киришмайди.", "Основание с основанием не реагирует.", "Two bases do not react."),
    ions: t3("Чўкма, газ ёки сув ҳосил бўлмайди — ионлар эритмада аралаш қолади (Бертолле қоидаси).", "Не образуется осадок, газ или вода — ионы просто остаются в растворе (правило Бертолле).", "No precipitate, gas or water forms — the ions just stay mixed in solution (Berthollet's rule)."),
    ions3: t3("Учта модда орасида ҳам чўкма, газ ёки сув ҳосил бўлмайди.", "И между тремя веществами не образуется осадок, газ или вода.", "Even among three substances no precipitate, gas or water forms."),
    acidstable: t3("{f} кислоталарда эримайди — реакция бормайди.", "{f} не растворяется в кислотах — реакции нет.", "{f} does not dissolve in acids — no reaction."),
    weak: t3("Кучсиз кислота кучлироқ кислотани тузидан сиқиб чиқара олмайди.", "Слабая кислота не вытесняет более сильную из её соли.", "A weak acid cannot displace a stronger one from its salt."),
    insbase: t3("Эримайдиган асос туз билан реакцияга киришмайди.", "Нерастворимое основание с солью не реагирует.", "An insoluble base does not react with a salt."),
    inssalt: t3("Эримайдиган туз бошқа туз ёки ишқор билан алмашмайди.", "Нерастворимая соль не вступает в обмен с солью или щёлочью.", "An insoluble salt does not exchange with salts or alkalis."),
    afterH: t3("{e} активлик қаторида водороддан кейин туради — кислотадан водородни сиқиб чиқармайди.", "{e} стоит в ряду активности после водорода — не вытесняет водород из кислоты.", "{e} lies after hydrogen in the activity series — it cannot displace hydrogen from the acid."),
    passive: t3("Совуқ концентрланган кислотада металл пассивланади: сиртида зич оксид пардаси ҳосил бўлади.", "В холодной концентрированной кислоте металл пассивируется плотной оксидной плёнкой.", "Cold concentrated acid passivates the metal with a dense oxide film."),
    film: t3("Металл сиртида ҳимоя пардаси ҳосил бўлиб, реакция деярли бормайди.", "На металле образуется защитная плёнка — реакция почти не идёт.", "A protective film forms on the metal and the reaction stops."),
    noble: t3("Нодир модда — оддий шароитда реакцияга киришмайди.", "Благородное вещество — в обычных условиях не реагирует.", "A noble substance — it does not react under normal conditions."),
    needheat: t3("Бу реакция фақат қиздирилганда боради — 🔥 «Қиздириш» ни ёқинг.", "Эта реакция идёт только при нагревании — включите 🔥 «Нагрев».", "This reaction needs heat — switch on 🔥 Heat."),
    lessactive: t3("{e} {m} дан кам актив — уни тузидан сиқиб чиқара олмайди.", "{e} менее активен, чем {m}, — не вытесняет его из соли.", "{e} is less active than {m} and cannot displace it from its salt."),
    lesshal: t3("Кам актив галоген активроғини тузидан сиқиб чиқармайди (F₂ > Cl₂ > Br₂ > I₂).", "Менее активный галоген не вытесняет более активный (F₂ > Cl₂ > Br₂ > I₂).", "A less active halogen cannot displace a more active one (F₂ > Cl₂ > Br₂ > I₂)."),
    inert: t3("Инерт газ — реакцияга киришмайди.", "Благородный газ — не реагирует.", "A noble gas — no reaction."),
    rad: t3("Радиоактив элемент — виртуал лабораторияда тажриба ўтказилмайди.", "Радиоактивный элемент — опыты в виртуальной лаборатории не проводятся.", "Radioactive element — no experiments in the virtual lab."),
    model: t3("Бу жуфтлик учун ишончли маълумот киритилмаган. Ўйлаб топилган маҳсулотни кўрсатмаймиз — дарслик ёки ўқитувчидан сўранг.", "Для этой пары надёжной модели нет. Выдуманных продуктов не показываем — уточните по учебнику или у преподавателя.", "There is no reliable model for this pair. We never show invented products — check a textbook or ask your teacher."),
    insoluble: t3("Модда сувда эримайди ва у билан реакцияга киришмайди.", "Вещество не растворяется в воде и не реагирует с ней.", "The substance is insoluble and does not react with water."),
    noreact: t3("Бу моддалар оддий шароитда реакцияга киришмайди.", "Эти вещества в обычных условиях не реагируют.", "These substances do not react under normal conditions."),
    slow: t3("Реакция жуда секин боради.", "Реакция идёт очень медленно.", "The reaction is very slow."),
    melt: t3("Қиздирилганда фақат суюқланади ёки буғланади — кимёвий ўзгариш йўқ.", "При нагревании только плавится или испаряется — химических изменений нет.", "Heating only melts or evaporates it — no chemical change."),
    stable: t3("Модда қиздиришга чидамли — парчаланмайди.", "Вещество термически устойчиво — не разлагается.", "The substance is heat-stable and does not decompose."),
    one: t3("Битта модда: иккинчисини қўшинг ёки 🔥 билан қиздириб кўринг (парчаланиш).", "Одно вещество: добавьте второе или попробуйте 🔥 нагреть (разложение).", "One substance: add another or try 🔥 heating it (decomposition)."),
    lightning: t3("N₂ ва O₂ фақат чақмоқда ёки 2000 °C дан юқорида NO ҳосил қилади.", "N₂ и O₂ дают NO только при разряде молнии или выше 2000 °C.", "N₂ and O₂ form NO only in lightning or above 2000 °C."),
    neutralox: t3("Туз ҳосил қилмайдиган (бефарқ) оксид — кислота ва ишқорлар билан реакцияга киришмайди.", "Несолеобразующий оксид — не реагирует с кислотами и щелочами.", "A neutral (non-salt-forming) oxide — it does not react with acids or alkalis."),
    acidox: t3("Икки кислотали оксид ўзаро реакцияга киришмайди.", "Два кислотных оксида друг с другом не реагируют.", "Two acidic oxides do not react with each other."),
    basicox: t3("Икки асосли оксид ўзаро реакцияга киришмайди.", "Два основных оксида друг с другом не реагируют.", "Two basic oxides do not react with each other."),
    alloy: t3("Металлар ўзаро реакцияга киришмайди — суюқлантирилса қотишма ҳосил бўлади.", "Металлы между собой не реагируют — при сплавлении получается сплав.", "Metals do not react with each other — melted together they form an alloy."),
    empty: t3("Столга модда қўйинг.", "Поставьте вещество на стол.", "Put a substance on the bench."),
    bal: t3("Тенгламани тенглаштириб бўлмади.", "Не удалось уравнять.", "Could not balance the equation."),
    dissolve: t3("Модда сувда эрийди — кимёвий реакция эмас, физик-кимёвий жараён.", "Вещество растворяется в воде — это физико-химический процесс, не реакция.", "The substance dissolves — a physico-chemical process, not a reaction.")
  };
  const whyText = (r) => L(WHYT[r.why] || WHYT.model).replace("{f}", RK.pretty(r.f || "")).replace("{e}", RK.pretty(r.e || "")).replace("{m}", RK.pretty(r.m || ""));

  /* Машҳур тажрибалар: [моддалар, қиздириш, номи, экология учун изоҳ?] */
  const EXP = [
    [["HCl", "NaOH"], 0, t3("Нейтралланиш", "Нейтрализация", "Neutralisation")],
    [["NaHCO3", "CH3COOH"], 0, t3("Сода ва сирка: «вулқон»", "Сода и уксус: «вулкан»", "Baking soda + vinegar volcano")],
    [["CO2", "Ca(OH)2"], 0, t3("Оҳак суви CO₂ ни аниқлайди", "Известковая вода обнаруживает CO₂", "Limewater detects CO₂")],
    [["CuSO4", "NaOH"], 0, t3("Кўк чўкма Cu(OH)₂", "Голубой осадок Cu(OH)₂", "Blue Cu(OH)₂ precipitate")],
    [["AgNO3", "NaCl"], 0, t3("Хлорид ионига сифат реакция", "Качественная реакция на хлорид", "Chloride test")],
    [["BaCl2", "Na2SO4"], 0, t3("Сульфат ионига сифат реакция", "Качественная реакция на сульфат", "Sulfate test")],
    [["CaCO3", "HCl"], 0, t3("Мармар ва кислота", "Мрамор и кислота", "Marble and acid")],
    [["Zn", "HCl"], 0, t3("Водород олиш", "Получение водорода", "Making hydrogen")],
    [["Fe", "CuSO4"], 0, t3("Темир мисни сиқиб чиқаради", "Железо вытесняет медь", "Iron displaces copper")],
    [["Na", "H2O"], 0, t3("Натрий ва сув", "Натрий и вода", "Sodium and water")],
    [["H2O2", "MnO2"], 0, t3("Каталитик парчаланиш: O₂", "Каталитическое разложение: O₂", "Catalytic decomposition: O₂")],
    [["KMnO4"], 1, t3("Перманганатдан кислород", "Кислород из перманганата", "Oxygen from permanganate")],
    [["CaCO3"], 1, t3("Оҳак куйдириш", "Обжиг известняка", "Lime burning")],
    [["Mg", "O2"], 1, t3("Магний ёниши", "Горение магния", "Burning magnesium")],
    [["Fe", "S"], 1, t3("Темир сульфид синтези", "Синтез сульфида железа", "Iron sulfide synthesis")],
    [["FeCl3", "KSCN"], 0, t3("«Қон» ранги: Fe³⁺ + SCN⁻", "«Кровь»: Fe³⁺ + SCN⁻", "Blood-red Fe³⁺ + SCN⁻")],
    [["FeCl3", "K4[Fe(CN)6]"], 0, t3("Берлин зангориси", "Берлинская лазурь", "Prussian blue")],
    [["Pb(NO3)2", "KI"], 0, t3("«Олтин ёмғир» PbI₂", "«Золотой дождь» PbI₂", "Golden rain PbI₂")],
    [["Cu", "HNO3c"], 0, t3("Мис ва концентрланган нитрат кислота", "Медь и концентрированная азотная кислота", "Copper and concentrated nitric acid")],
    [["CH4", "O2"], 1, t3("Табиий газ ёниши", "Горение природного газа", "Natural gas combustion")],
    [["C6H12O6", "CuSO4", "NaOH"], 1, t3("Троммер синови (глюкоза)", "Проба Троммера (глюкоза)", "Trommer's test (glucose)")],
    [["C6H12O6", "AgNO3", "NH3·H2O"], 1, t3("Кумуш кўзгу", "Серебряное зеркало", "Silver mirror")],
    [["I2", "(C6H10O5)n"], 0, t3("Йод ва крахмал", "Иод и крахмал", "Iodine and starch")],
    [["CuSO4", "NH3·H2O"], 0, t3("Мис аммиакати", "Аммиакат меди", "Copper ammine complex")],
    [["Na2S2O3", "HCl"], 0, t3("Олтингугурт «тумани»", "«Туман» серы", "Sulfur clock")],
    [["Al", "NaOH"], 0, t3("Алюминий ишқорда", "Алюминий в щёлочи", "Aluminium in alkali")],
    [["Cl2", "KI"], 0, t3("Галогенлар активлиги", "Активность галогенов", "Halogen activity")],
    [["Al", "Fe2O3"], 1, t3("Термит", "Термит", "Thermite")],
    [["C12H22O11", "H2SO4c"], 0, t3("Шакарнинг кўмирланиши", "Обугливание сахара", "Sugar carbonisation")],
    [["CaC2", "H2O"], 0, t3("Ацетилен олиш", "Получение ацетилена", "Making acetylene")],
    [["K2Cr2O7", "C2H5OH", "H2SO4"], 0, t3("Алкотестер реакцияси", "Реакция алкотестера", "Breathalyser reaction")],
    [["NH4Cl", "NaOH"], 1, t3("Аммиак олиш", "Получение аммиака", "Making ammonia")],
    [["CaO", "H2O"], 0, t3("Оҳак сўндириш", "Гашение извести", "Slaking lime")],
    [["SO2", "H2O"], 0, t3("Кислотали ёмғир (SO₂)", "Кислотный дождь (SO₂)", "Acid rain (SO₂)"), 1],
    [["NO2", "O2", "H2O"], 0, t3("Кислотали ёмғир (NO₂)", "Кислотный дождь (NO₂)", "Acid rain (NO₂)"), 1],
    [["Ca(HCO3)2"], 1, t3("Қуйқа: қаттиқ сувни қайнатиш", "Накипь: кипячение жёсткой воды", "Scale: boiling hard water"), 1],
    [["C17H35COONa", "CaCl2"], 0, t3("Қаттиқ сувда совун кўпирмайди", "Мыло в жёсткой воде", "Soap in hard water"), 1],
    [["Na3PO4", "CaCl2"], 0, t3("Сувни юмшатиш (фосфат)", "Умягчение воды фосфатом", "Water softening with phosphate"), 1],
    [["S", "O2"], 1, t3("Кўмир таркибидаги олтингугурт ёниши", "Горение серы из угля", "Burning sulfur from coal"), 1],
    [["Pb(NO3)2", "Na2S"], 0, t3("Оқова сувдан қўрғошинни чўктириш", "Осаждение свинца из стоков", "Removing lead from wastewater"), 1],
    [["CuO", "H2"], 1, t3("Мис оксидини қайтариш", "Восстановление оксида меди", "Reducing copper oxide")],
    [["H2", "O2"], 1, t3("«Қалдироқ газ»", "«Гремучий газ»", "Oxyhydrogen")]
  ].filter((x) => x[0].every((id) => sub(id)));

  /* ---------- Ҳолат ---------- */
  const SKEY = "ekotalim:lx-bench", DKEY = "ekotalim:lx-rx";
  const st0 = getJ(SKEY, {});
  let slots = (Array.isArray(st0.s) ? st0.s : []).filter((id) => sub(id)).slice(0, 3);
  let heat = !!st0.h, tab = st0.t || "pt", selZ = st0.z || 26, q = "", cls = "all", lim = 60, last = null, masses = {};
  let found = new Set(getJ(DKEY, []));
  const save = () => putJ(SKEY, { s: slots, h: heat, t: tab, z: selZ });
  let BOX = null;

  /* ---------- Элемент ёрдамчилари ---------- */
  const elemSub = (sym) => RK.SUBS.find((s) => s.el === sym);
  const COMP = {};
  const compOf = (sym) => {
    if (COMP[sym]) return COMP[sym];
    const out = [];
    RK.SUBS.forEach((s) => { if (s.el === sym) return; try { if (RK.parse(s.f)[sym]) out.push(s); } catch (e) { /* ignore */ } });
    return (COMP[sym] = out);
  };
  const cfgH = (c) => esc(c || "").replace(/([spdf])(\d*)/g, (m, l, n) => l + "<sup>" + (n || "1") + "</sup>");
  const phaseN = (p) => L(TX.st[p] || TX.st.u);
  const deg = (v) => (v == null ? "—" : fmt(v, 1) + " °C");

  /* ---------- HTML ---------- */
  function subChip(s, extra) {
    const lk = locked(s);
    return `<button type="button" class="lxe-s${lk ? " is-lock" : ""}" data-add="${esc(s.id)}" title="${H(s.n)}${lk ? " 🔒" : ""}"${extra || ""}><b>${P(s.f)}</b><small>${H(s.n)}</small>${lk ? '<i class="fa-solid fa-lock" aria-hidden="true"></i>' : ""}</button>`;
  }
  function hazH(s) { return (s.haz || []).map((h) => `<span class="lxe-haz" title="${H(TX.haz[h])}"><i class="fa-solid ${HAZI[h] || "fa-circle-exclamation"}" aria-hidden="true"></i> ${H(TX.haz[h])}</span>`).join(""); }

  function benchHtml() {
    const ok = LX() && LX().ppeOk ? LX().ppeOk() : true;
    return `<div class="lxe-bench">
      <div class="lxe-slots">${slots.length ? slots.map((id, i) => { const s = sub(id); return `<span class="lxe-slot" style="--sc:${esc(s.aq || s.col || "#e5e7eb")}"><span class="lxe-dot" aria-hidden="true"></span><b>${P(s.f)}</b><small>${H(s.n)}</small><button type="button" class="lxe-x" data-rm="${i}" aria-label="${H(TX.clear)}: ${esc(s.f)}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></span>` + (i < slots.length - 1 ? '<span class="lxe-plus" aria-hidden="true">+</span>' : ""); }).join("") : `<span class="muted small">${H(TX.empty)}</span>`}</div>
      <div class="lxe-act">
        <button type="button" class="chip" data-heat aria-pressed="${heat}"><i class="fa-solid fa-fire-burner" aria-hidden="true"></i> ${H(TX.heat)}</button>
        <button type="button" class="btn btn-primary" data-mix${slots.length ? "" : " disabled"}><i class="fa-solid fa-flask" aria-hidden="true"></i> ${H(TX.mix)}</button>
        <button type="button" class="btn" data-clr${slots.length ? "" : " disabled"}><i class="fa-solid fa-broom" aria-hidden="true"></i> ${H(TX.clear)}</button>
        <span class="small muted lxe-cnt"><i class="fa-solid fa-star" aria-hidden="true"></i> ${H(TX.disc)}: <b data-found>${found.size}</b></span>
      </div>
      ${ok ? "" : `<p class="small lxe-warn">${H(TX.ppe)}</p>`}
      <div class="lxe-res" data-res aria-live="polite">${last ? resHtml(last) : ""}</div>
    </div>`;
  }

  function eqHtml(r) {
    if (!r.eq) return "";
    const side = (a) => a.map(([c, f, m]) => `${c > 1 ? c : ""}${P(f)}${m ? `<span class="lxe-m">${esc(m)}</span>` : ""}`).join(" + ");
    const arrow = r.eqm ? " ⇄ " : r.heat ? ' <span class="lxe-arr">→<sup>t°</sup></span> ' : " → ";
    return `<div class="lxe-eq">${side(r.eq[0])}${arrow}${side(r.eq[1])}</div>`;
  }
  function oneRes(r, idx) {
    const types = (r.types || []).map((t) => `<span class="lxe-badge t-${esc(t)}">${H(RK.TYPEN[t] || t)}</span>`).join("");
    const obs = [].concat(r.obs || []).filter(Boolean).map((o) => `<li>${H(o)}</li>`).join("");
    const notes = [].concat(r.notes || [], r.note || []).filter(Boolean).map((o) => `<li class="muted">${H(o)}</li>`).join("");
    const prods = r.eq ? r.eq[1].map(([, f, , m]) => { const s = RK.SUBS.find((x) => x.f === f); const tag = m && m.gas ? `<span class="lxe-m">↑ ${H(TX.gas)}</span>` : m && m.ppt ? `<span class="lxe-m">↓ ${H(TX.ppt)}</span>` : ""; const g = RK.GAS[f]; return `<li><span class="lxe-dot" style="--sc:${esc((m && m.col) || (s && (s.aq || s.col)) || "#e5e7eb")}" aria-hidden="true"></span><b>${P(f)}</b> ${s ? H(s.n) : ""} ${tag}${g ? ` <small class="muted">— ${H(g)}</small>` : ""}</li>`; }).join("") : "";
    const ion = uni() && r.ion && r.ion.net && r.ion.full !== r.ion.net ? `<details class="lxe-ion" open><summary>${H(TX.ionN)}</summary><p>${esc(r.ion.net)}</p><p class="small muted">${H(TX.ionF)}: ${esc(r.ion.full)}</p></details>` : uni() && r.ion && r.ion.net ? `<p class="small"><b>${H(TX.ionN)}:</b> ${esc(r.ion.net)}</p>` : "";
    const cat = r.cat ? `<p class="small"><b>${H(TX.cat)}:</b> ${P(r.cat)}</p>` : "";
    return `<div class="lxe-card ok">
      <div class="lxe-types">${types}${r.exo ? `<span class="lxe-badge t-exo">${H(TX.exoR)}</span>` : ""}</div>
      ${eqHtml(r)}${r.col && !r.eq ? `<div class="lxe-swatch" style="--sc:${esc(r.col)}"></div>` : ""}
      ${cat}${obs ? `<h4>${H(TX.obs)}</h4><ul>${obs}</ul>` : ""}${prods ? `<h4>${H(TX.prod)}</h4><ul class="lxe-prods">${prods}</ul>` : ""}${notes ? `<ul class="small">${notes}</ul>` : ""}${ion}
      ${r.eq ? stoichHtml(r, idx) : ""}
    </div>`;
  }
  function stoichHtml(r, idx) {
    const re = r.eq[0], pr = r.eq[1];
    let M;
    try { M = re.concat(pr).map(([, f]) => RK.molar(f)); } catch (e) { return ""; }
    if (M.some((m) => !isFinite(m) || m <= 0)) return "";
    const key = (f) => idx + ":" + f;
    const nn = re.map(([c, f], i) => { const m = masses[key(f)] != null ? masses[key(f)] : 10; return { c, f, M: M[i], m, n: m / M[i], k: m / M[i] / c }; });
    const kmin = Math.min(...nn.map((x) => x.k));
    const rows = nn.map((x) => `<tr><td>${P(x.f)}</td><td>${fmt(x.M, 2)}</td><td><input type="number" min="0" step="any" inputmode="decimal" value="${x.m}" data-ms="${esc(key(x.f))}" aria-label="m(${esc(x.f)}), g"></td><td>${fmt(x.n, 4)}</td><td>${x.k === kmin ? `<b>${H(TX.lim)}</b>` : H(TX.exc) + " " + fmt(x.m - kmin * x.c * x.M, 2) + " g"}</td></tr>`).join("");
    const prow = pr.map(([c, f, , m], j) => { const n = kmin * c, g = m && m.gas; return `<tr><td>${P(f)}</td><td>${fmt(M[re.length + j], 2)}</td><td><b>${fmt(n * M[re.length + j], 2)} g</b></td><td>${fmt(n, 4)}</td><td>${g ? fmt(n * 22.4, 3) + " L" : ""}</td></tr>`; }).join("");
    return `<details class="lxe-sto"${uni() ? " open" : ""}><summary><i class="fa-solid fa-calculator" aria-hidden="true"></i> ${H(TX.stoich)}</summary><p class="small muted">${H(TX.stoichH)}</p>
      <div class="lxe-tw"><table class="lxe-t"><thead><tr><th></th><th>M, g/mol</th><th>m, g</th><th>n, mol</th><th></th></tr></thead><tbody>${rows}</tbody><tbody class="lxe-pt">${prow}</tbody></table></div></details>`;
  }
  function resHtml(r) {
    if (r.ok && r.multi) return r.multi.map((x, i) => (x.ok ? oneRes(x, i) : noHtml(x))).join("");
    if (r.ok) return oneRes(r, 0);
    return noHtml(r);
  }
  function noHtml(r) {
    if (r.why === "dissolve") {
      return `<div class="lxe-card diss"><div class="lxe-types"><span class="lxe-badge t-hydr">${H(TX.dissT)}</span></div><p>${H(WHYT.dissolve)}</p>${r.diss ? `<div class="lxe-eq">${esc(r.diss)}</div>` : ""}${r.env ? `<p><b>${H(TX.env[r.env])}</b></p>` : ""}${r.hyd ? `<p class="small"><b>${H(TX.hyd)}:</b> ${esc(r.hyd)}</p>` : ""}${r.exo ? `<p class="small">${H(TX.exo)}</p>` : ""}${r.endo ? `<p class="small">${H(TX.endo)}</p>` : ""}</div>`;
    }
    const obs = r.obs ? `<p class="small">${H(r.obs)}</p>` : "";
    return `<div class="lxe-card no"><h4><i class="fa-solid fa-ban" aria-hidden="true"></i> ${H(TX.noR)}</h4><p>${esc(whyText(r))}</p>${obs}</div>`;
  }

  /* Менделеев жадвали: 18 устун, 7 давр + лантаноид/актиноид қаторлари */
  function ptHtml() {
    const cells = RK.EL.map((e) => {
      let col = e.g, row = e.p + 1;
      if (e.cat === "ln") { col = e.z - 57 + 3; row = 10; }
      else if (e.cat === "ac") { col = e.z - 89 + 3; row = 11; }
      if (!col) { col = 3; }
      const hit = q && matchEl(e) ? " is-hit" : "";
      return `<button type="button" class="pt-c c-${e.cat}${e.z === selZ ? " is-sel" : ""}${hit}${e.rad ? " is-rad" : ""}" style="grid-column:${col};grid-row:${row}" data-z="${e.z}" aria-label="${e.z} ${esc(e.s)} ${H(nameE(e))}" aria-pressed="${e.z === selZ}"><small>${e.z}</small><b>${esc(e.s)}</b></button>`;
    }).join("");
    const gap = `<span class="pt-ln" style="grid-column:3;grid-row:7">57–71</span><span class="pt-ln" style="grid-column:3;grid-row:8">89–103</span>`;
    const head = Array.from({ length: 18 }, (_, i) => `<span class="pt-g" style="grid-column:${i + 1};grid-row:1">${i + 1}</span>`).join("");
    const legend = Object.keys(RK.CATN).map((k) => `<span class="pt-leg c-${k}"><i aria-hidden="true"></i>${H(RK.CATN[k])}</span>`).join("");
    return `<div class="pt-wrap" tabindex="0" aria-label="${H(TX.tabPt)}"><div class="pt-grid">${head}${cells}${gap}</div></div><div class="pt-legend">${legend}<span class="pt-leg is-rad"><i aria-hidden="true"></i>☢ ${H(TX.haz.rad)}</span></div><div class="pt-card" data-el>${elHtml()}</div>`;
  }
  const nameE = (e) => ({ uz: e.uz, ru: e.ru, en: e.en });
  const matchEl = (e) => { const s = q.toLowerCase(); return e.s.toLowerCase() === s || e.en.toLowerCase().includes(s) || e.ru.toLowerCase().includes(s) || e.uz.toLowerCase().includes(s) || tr(e.uz).toLowerCase().includes(s) || String(e.z) === s; };
  function elHtml() {
    const e = RK.EL[selZ - 1]; if (!e) return "";
    const s = elemSub(e.s), comp = compOf(e.s);
    const dens = e.d == null ? "—" : fmt(e.d, 3) + (e.ph === "g" ? " g/L" : " g/cm³");
    const yr = e.yr ? e.yr : L(TX.anc);
    const rows = [[TX.mass, fmt(e.m, 3)], [L(TX.grp) + " / " + L(TX.per), (e.g || "—") + " / " + e.p], [TX.phase, phaseN(e.ph)], [TX.chi, e.chi == null ? "—" : fmt(e.chi, 2)], [TX.mp, deg(e.mp)], [TX.bp, deg(e.bp)], [TX.dens, dens], [TX.ox, esc(e.ox || "—")], [TX.cfg, cfgH(e.cfg)], [TX.yr, esc(String(yr))]];
    return `<div class="pt-big c-${e.cat}${e.rad ? " is-rad" : ""}"><small>${e.z}</small><b>${esc(e.s)}</b><span>${fmt(e.m, 3)}</span></div>
      <div class="pt-info"><h4>${H(nameE(e))} <small class="muted">· ${H(RK.CATN[e.cat])}</small></h4>
      ${e.rad ? `<p class="small lxe-warn">${H(TX.radL)}</p>` : ""}
      <dl class="pt-dl">${rows.map(([k, v]) => `<div><dt>${typeof k === "string" ? esc(k) : H(k)}</dt><dd>${v}</dd></div>`).join("")}</dl>
      ${s && !e.rad ? `<p>${subChip(s)} ${hazH(s)}</p>` : ""}
      ${comp.length ? `<h5>${H(TX.comp)} (${comp.length})</h5><div class="lxe-list">${comp.slice(0, 40).map((x) => subChip(x)).join("")}</div>` : ""}</div>`;
  }

  function subsHtml() {
    const classes = ["all"].concat(Object.keys(TX.cls).filter((k) => RK.SUBS.some((s) => s.cls === k)));
    const s0 = q.toLowerCase();
    const list = RK.SUBS.filter((s) => (cls === "all" || s.cls === cls) && (!s0 || s.f.toLowerCase().includes(s0) || RK.pretty(s.f).toLowerCase().includes(s0) || ["uz", "ru", "en"].some((l) => (s.n[l] || "").toLowerCase().includes(s0)) || tr(s.n.uz).toLowerCase().includes(s0)));
    return `<div class="lx-chips lxe-cls">${classes.map((k) => `<button type="button" class="chip" data-cls="${k}" aria-pressed="${cls === k}">${k === "all" ? H(TX.all) : H(TX.cls[k])} <small>${k === "all" ? RK.SUBS.length : RK.SUBS.filter((s) => s.cls === k).length}</small></button>`).join("")}</div>
      <div class="lxe-list">${list.slice(0, lim).map((s) => subChip(s)).join("")}</div>
      <p class="small muted">${Math.min(lim, list.length)} / ${list.length} ${H(TX.shown)}${list.length > lim ? ` <button type="button" class="chip" data-more>${H(TX.more)}</button>` : ""}</p>`;
  }

  function expHtml() {
    return `<div class="lxe-exps">${EXP.map(([ids, h, n, eco], i) => { const lk = ids.some((id) => locked(sub(id))); return `<button type="button" class="lxe-exp${lk ? " is-lock" : ""}${eco ? " is-eco" : ""}" data-exp="${i}"><b>${eco ? '<i class="fa-solid fa-leaf" aria-hidden="true"></i> ' : ""}${H(n)}</b><small>${ids.map((id) => P(sub(id).f)).join(" + ")}${h ? " 🔥" : ""}</small>${lk ? '<i class="fa-solid fa-lock" aria-hidden="true"></i>' : ""}</button>`; }).join("")}</div>`;
  }

  function tabBody() { return tab === "subs" ? subsHtml() : tab === "exp" ? expHtml() : ptHtml(); }

  function render() {
    BOX = document.querySelector("#labxona [data-lx-elem]");
    if (!BOX) return;
    BOX.innerHTML = `<h3><i class="fa-solid fa-table-cells" aria-hidden="true"></i> ${H(TX.title)} <small class="muted">(${RK.EL.length} · ${RK.SUBS.length})</small></h3>
      <p class="small muted">${H(TX.lead)}</p>
      <h4 class="lxe-h"><i class="fa-solid fa-flask-vial" aria-hidden="true"></i> ${H(TX.bench)}</h4>
      <div data-bench>${benchHtml()}</div>
      <div class="lxe-tabs" role="tablist">${[["pt", "fa-table-cells", TX.tabPt], ["subs", "fa-jar", TX.tabSubs], ["exp", "fa-wand-magic-sparkles", TX.tabExp]].map(([k, ic, n]) => `<button type="button" role="tab" class="chip" data-tab="${k}" aria-selected="${tab === k}"><i class="fa-solid ${ic}" aria-hidden="true"></i> ${H(n)}</button>`).join("")}</div>
      ${tab !== "exp" ? `<input type="search" class="lxe-q" data-q value="${esc(q)}" placeholder="${H(TX.search)}" aria-label="${H(TX.search)}">` : ""}
      <div data-body>${tabBody()}</div>
      <p class="small muted">${H(TX.src)}</p>`;
    bind();
  }
  const reBench = () => { const b = BOX && BOX.querySelector("[data-bench]"); if (b) { b.innerHTML = benchHtml(); bindBench(b); } };
  const reBody = () => { const b = BOX && BOX.querySelector("[data-body]"); if (b) { b.innerHTML = tabBody(); bindBody(b); } };

  /* ---------- Амаллар ---------- */
  function addSub(id, silent) {
    const s = sub(id); if (!s) return false;
    if (s.rad) { if (!silent) toast(L(TX.radL)); return false; }
    if (locked(s)) { if (!silent) toast(L(TX.lock)); return false; }
    if (slots.length >= 3) { if (!silent) toast(L(TX.full)); return false; }
    slots.push(id); last = null; save(); push3d(); reBench();
    return true;
  }
  function mix() {
    if (!slots.length) return;
    const lx = LX();
    if (lx && lx.ppeOk && !lx.ppeOk()) { toast(L(TX.ppe)); return; }
    let r;
    try { r = RK.react(slots.slice(), { heat }); } catch (e) { r = { ok: false, why: "model" }; }
    last = r; masses = {};
    const all = r.ok ? (r.multi || [r]).filter((x) => x.ok) : [];
    all.forEach((x) => { const k = x.text || (x.used || slots).join("+"); if (k && !found.has(k)) { found.add(k); } });
    if (all.length) {
      putJ(DKEY, Array.from(found).slice(-800));
      once("lxr_first", 3, WHY);
      [10, 25, 50, 100].forEach((n) => { if (found.size >= n) once("lxr_" + n, n >= 50 ? 10 : 5, WHY); });
    }
    reBench();
    anim3d(r);
    const res = BOX && BOX.querySelector("[data-res]");
    if (res && res.getBoundingClientRect().top > innerHeight) res.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  }

  /* ---------- 3D боғланиш ---------- */
  function push3d() {
    const rx = LX() && LX().rx; if (!rx) return;
    rx.bench(slots.map((id) => { const s = sub(id); return { id, f: RK.pretty(s.f), col: s.st === "s" ? s.col : s.aq || s.col, st: s.st === "aq" ? "l" : s.st }; }));
  }
  const GASC = { NO2: "#b45309", Cl2: "#bef264", Br2: "#c2410c", I2: "#7c3aed", F2: "#fef08a" };
  function anim3d(r) {
    const rx = LX() && LX().rx; if (!rx) return;
    if (!r.ok) { rx.react({ col0: tint(), col: tint(), label: r.why === "dissolve" ? "aq" : "✕", heat }); return; }
    const x = r.multi ? r.multi.find((m) => m.ok) || {} : r;
    const pr = x.eq ? x.eq[1] : [];
    const ppt = pr.find(([, , , m]) => m && m.ppt);
    const gas = pr.find(([, , , m]) => m && m.gas);
    const aqc = pr.map(([, f, , m]) => (m && m.aq && m.col) || null).find(Boolean);
    const burn = (x.types || []).includes("burn");
    const dry = !slots.some((id) => { const s = sub(id); return s.st === "l" || s.st === "aq" || s.sol === "R" || s.cls === "acid" || s.id === "H2O"; }) && !pr.some(([, f]) => f === "H2O");
    const solidP = pr.find(([, f, , m]) => !(m && m.gas) && f !== "H2O" && f !== "CO2");
    rx.react({
      col0: tint(), col: x.col || aqc || tint(), op: x.col ? 0.75 : 0.55, ppt: !!ppt, pptCol: ppt && ppt[3].col ? ppt[3].col : "#f8fafc",
      gas: !!gas, gasCol: gas ? GASC[gas[1]] : null, flame: burn, flameCol: slots.includes("Mg") ? "#f8fafc" : null, heat: heat || !!x.heat,
      smoke: burn && !!solidP, smokeCol: "#f1f5f9", dry, label: pr.length ? RK.pretty((ppt || gas || pr[0])[1]) : "✓"
    });
  }
  function tint() { const c = slots.map((id) => sub(id)).map((s) => (s.st !== "s" || s.sol === "R" ? s.aq : null)).find((v) => v && v !== "#ffffff" && v !== "#f8fafc"); return c || "#e0f2fe"; }

  /* ---------- Ҳодисалар ---------- */
  function bindBench(b) {
    b.querySelectorAll("[data-rm]").forEach((x) => x.addEventListener("click", () => { slots.splice(+x.dataset.rm, 1); last = null; save(); push3d(); reBench(); }));
    const h = b.querySelector("[data-heat]"); if (h) h.addEventListener("click", () => { heat = !heat; save(); reBench(); });
    const m = b.querySelector("[data-mix]"); if (m) m.addEventListener("click", mix);
    const c = b.querySelector("[data-clr]"); if (c) c.addEventListener("click", () => { slots = []; last = null; save(); push3d(); const rx = LX() && LX().rx; if (rx) rx.clear(); reBench(); });
    b.querySelectorAll("[data-ms]").forEach((inp) => inp.addEventListener("change", () => { const v = num(inp.value); if (isFinite(v) && v >= 0) { masses[inp.dataset.ms] = v; const open = inp.closest("details"); reBench(); if (open) { const d = BOX.querySelectorAll("[data-res] details.lxe-sto"); d.forEach((x) => { x.open = true; }); } } }));
  }
  function bindBody(b) {
    b.querySelectorAll("[data-add]").forEach((x) => x.addEventListener("click", () => { if (addSub(x.dataset.add)) toast("+ " + RK.pretty(sub(x.dataset.add).f)); }));
    b.querySelectorAll("[data-z]").forEach((x) => x.addEventListener("click", () => { selZ = +x.dataset.z; save(); b.querySelectorAll(".pt-c.is-sel").forEach((y) => { y.classList.remove("is-sel"); y.setAttribute("aria-pressed", "false"); }); x.classList.add("is-sel"); x.setAttribute("aria-pressed", "true"); const c = b.querySelector("[data-el]"); if (c) { c.innerHTML = elHtml(); c.querySelectorAll("[data-add]").forEach((y) => y.addEventListener("click", () => { if (addSub(y.dataset.add)) toast("+ " + RK.pretty(sub(y.dataset.add).f)); })); if (matchMedia("(max-width: 720px)").matches) c.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); } }));
    b.querySelectorAll("[data-cls]").forEach((x) => x.addEventListener("click", () => { cls = x.dataset.cls; lim = 60; reBody(); }));
    const mo = b.querySelector("[data-more]"); if (mo) mo.addEventListener("click", () => { lim += 120; reBody(); });
    b.querySelectorAll("[data-exp]").forEach((x) => x.addEventListener("click", () => {
      const [ids, h] = EXP[+x.dataset.exp];
      const lk = ids.find((id) => locked(sub(id))); if (lk) { toast(L(TX.lock)); return; }
      slots = ids.slice(); heat = !!h; last = null; save(); push3d(); mix();
      const bb = BOX.querySelector("[data-bench]"); if (bb) bb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }));
  }
  function bind() {
    bindBench(BOX.querySelector("[data-bench]"));
    bindBody(BOX.querySelector("[data-body]"));
    BOX.querySelectorAll("[data-tab]").forEach((x) => x.addEventListener("click", () => { tab = x.dataset.tab; lim = 60; save(); render(); }));
    const qi = BOX.querySelector("[data-q]");
    if (qi) qi.addEventListener("input", () => {
      q = qi.value.trim(); lim = 60;
      if (tab === "pt" && q) { const e = RK.EL.find((x) => x.s.toLowerCase() === q.toLowerCase()) || RK.EL.find(matchEl); if (e) selZ = e.z; }
      reBody();
    });
  }

  window.addEventListener("eko:lx-shell", render);
  window.addEventListener("eko:lx-3d", push3d);
  window.addEventListener("eko:lx-mix", mix);
  window.addEventListener("eko:lx-pick", (ev) => { const id = ev.detail && ev.detail.id; const s = sub(id); if (!s) return; toast(RK.pretty(s.f) + " — " + L(s.n)); const e = s.el && RK.ES[s.el]; if (e && tab === "pt") { selZ = e.z; reBody(); } });
  if (document.querySelector("#labxona [data-lx-elem]")) render();

  /* Синов учун */
  window.EkoLabElem = { get slots() { return slots.slice(); }, add: (id) => addSub(id, true), clear: () => { slots = []; last = null; save(); push3d(); if (BOX) reBench(); }, mix: () => { mix(); return last; }, heat: (on) => { heat = !!on; save(); if (BOX) reBench(); }, get last() { return last; }, exps: EXP.length, render };
})();
