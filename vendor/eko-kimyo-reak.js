/* Экомун — ⚗️ «Лаборатория хонаси»: Менделеев жадвалидаги 118 элемент, моддалар ва реакциялар ядроси
   (UI'сиз, Node'да ҳам синалади: `node tools/reak-test.js`).
   Элементлар маълумоти: mendeleev (MIT лицензия, L. M. Mentel) маълумотлар базасидан — атом массаси (IUPAC),
   электроманфийлик (Полинг), зичлик, суюқланиш/қайнаш ҳарорати, асосий оксидланиш даражалари, электрон тузилиш.
   Моддалар: катион × анион комбинациялари (эрувчанлик жадвали бўйича), кислота, асос, оксид, оддий ва органик моддалар.
   Реакция мантиқи (мактаб ва ОТМ дарсликлари, Ходаков/Глинка, CRC Handbook):
     • ион алмашиниш — Бертолле қоидаси: чўкма ↓, газ ↑ ёки кучсиз электролит (сув) ҳосил бўлсагина боради;
     • кучли кислота кучсиз кислотани тузидан сиқиб чиқаради (pKa бўйича), кислотада эримайдиган чўкмалар рўйхати;
     • металл + кислота / туз — стандарт электрод потенциаллари (E°) бўйича активлик қатори;
     • оксидловчи кислоталар (HNO₃, конц. H₂SO₄): NO/NO₂/SO₂, пассивланиш (Fe, Al, Cr совуқда);
     • оксидлар (асосли/кислотали/амфотер), гидратланиш, ёниш, қайтарилиш, термик парчаланиш;
     • махсус сифат реакциялари (Fe³⁺ + SCN⁻, Берлин зангориси, кумуш кўзгу, перманганат ва бихромат ва б.).
   Тенгламалар матрица усулида (Гаусс, рационал сонлар) тенглаштирилади, ионли тенгламалар автомат тузилади.
   Номаълум жуфтлик учун ҳеч қачон «уйдирма» маҳсулот берилмайди: «реакция бормайди» ёки «модель киритилмаган». */
(() => {
  "use strict";
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const W = typeof window !== "undefined" ? window : globalThis;

  /* ---------- 1. Элементлар ----------
     [Z, белги, en, ru, uz, масса, гуруҳ, давр, тур, ҳолат(s/l/g/u), χ, t суюқ °C, t қайнаш °C, ρ (г/см³; газ — г/л), оксидланиш, электрон тузилиш, кашф йили, радиоактив] */
  const ROWS = [
    [1, "H", "Hydrogen", "Водород", "Водород", 1.008, 1, 1, "nm", "g", 2.2, -259.2, -252.9, 0.082, "-1,+1", "1s", 1766, 0],
    [2, "He", "Helium", "Гелий", "Гелий", 4.003, 18, 1, "ng", "g", null, null, -268.9, 0.164, "0", "1s2", 1895, 0],
    [3, "Li", "Lithium", "Литий", "Литий", 6.94, 1, 2, "am", "s", 0.98, 180.5, 1342.0, 0.534, "+1", "[He] 2s", 1817, 0],
    [4, "Be", "Beryllium", "Бериллий", "Бериллий", 9.012, 2, 2, "ae", "s", 1.57, 1287.0, 2468.0, 1.85, "+2", "[He] 2s2", 1798, 0],
    [5, "B", "Boron", "Бор", "Бор", 10.81, 13, 2, "md", "s", 2.04, 2077.0, 4000.0, 2.34, "+3", "[He] 2s2 2p", 1808, 0],
    [6, "C", "Carbon", "Углерод", "Углерод", 12.011, 14, 2, "nm", "s", 2.55, null, 3825.0, 2.2, "-4,+4", "[He] 2s2 2p2", null, 0],
    [7, "N", "Nitrogen", "Азот", "Азот", 14.007, 15, 2, "nm", "g", 3.04, -210.0, -195.8, 1.145, "-3,+3,+5", "[He] 2s2 2p3", 1772, 0],
    [8, "O", "Oxygen", "Кислород", "Кислород", 15.999, 16, 2, "nm", "g", 3.44, -218.8, -183.0, 1.308, "-2", "[He] 2s2 2p4", 1774, 0],
    [9, "F", "Fluorine", "Фтор", "Фтор", 18.998, 17, 2, "hl", "g", 3.98, -219.7, -188.1, 1.553, "-1", "[He] 2s2 2p5", 1886, 0],
    [10, "Ne", "Neon", "Неон", "Неон", 20.18, 18, 2, "ng", "g", null, -248.6, -246.0, 0.825, "0", "[He] 2s2 2p6", 1898, 0],
    [11, "Na", "Sodium", "Натрий", "Натрий", 22.99, 1, 3, "am", "s", 0.93, 97.8, 882.9, 0.97, "+1", "[Ne] 3s", 1807, 0],
    [12, "Mg", "Magnesium", "Магний", "Магний", 24.305, 2, 3, "ae", "s", 1.31, 650.0, 1090.0, 1.74, "+2", "[Ne] 3s2", 1808, 0],
    [13, "Al", "Aluminum", "Алюминий", "Алюминий", 26.982, 13, 3, "pm", "s", 1.61, 660.3, 2519.0, 2.7, "+3", "[Ne] 3s2 3p", 1825, 0],
    [14, "Si", "Silicon", "Кремний", "Кремний", 28.085, 14, 3, "md", "s", 1.9, 1414.0, 3265.0, 2.33, "-4,+4", "[Ne] 3s2 3p2", 1824, 0],
    [15, "P", "Phosphorus", "Фосфор", "Фосфор", 30.974, 15, 3, "nm", "s", 2.19, 44.1, 280.5, 1.823, "-3,+3,+5", "[Ne] 3s2 3p3", 1669, 0],
    [16, "S", "Sulfur", "Сера", "Олтингугурт", 32.06, 16, 3, "nm", "s", 2.58, 95.2, 444.6, 2.07, "-2,+2,+4,+6", "[Ne] 3s2 3p4", null, 0],
    [17, "Cl", "Chlorine", "Хлор", "Хлор", 35.45, 17, 3, "hl", "g", 3.16, -101.5, -34.0, 2.898, "-1,+1,+3,+5,+7", "[Ne] 3s2 3p5", 1774, 0],
    [18, "Ar", "Argon", "Аргон", "Аргон", 39.948, 18, 3, "ng", "g", null, -189.3, -185.8, 1.633, "0", "[Ne] 3s2 3p6", 1894, 0],
    [19, "K", "Potassium", "Калий", "Калий", 39.098, 1, 4, "am", "s", 0.82, 63.5, 759.0, 0.89, "+1", "[Ar] 4s", 1807, 0],
    [20, "Ca", "Calcium", "Кальций", "Кальций", 40.078, 2, 4, "ae", "s", 1.0, 842.0, 1484.0, 1.54, "+2", "[Ar] 4s2", 1808, 0],
    [21, "Sc", "Scandium", "Скандий", "Скандий", 44.956, 3, 4, "tm", "s", 1.36, 1541.0, 2836.0, 2.99, "+3", "[Ar] 3d 4s2", 1879, 0],
    [22, "Ti", "Titanium", "Титан", "Титан", 47.867, 4, 4, "tm", "s", 1.54, 1670.0, 3287.0, 4.506, "+4", "[Ar] 3d2 4s2", 1791, 0],
    [23, "V", "Vanadium", "Ванадий", "Ванадий", 50.941, 5, 4, "tm", "s", 1.63, 1910.0, 3407.0, 6.0, "+5", "[Ar] 3d3 4s2", 1830, 0],
    [24, "Cr", "Chromium", "Хром", "Хром", 51.996, 6, 4, "tm", "s", 1.66, 1907.0, 2671.0, 7.15, "+3,+6", "[Ar] 3d5 4s", 1797, 0],
    [25, "Mn", "Manganese", "Марганец", "Марганец", 54.938, 7, 4, "tm", "s", 1.55, 1246.0, 2061.0, 7.3, "+2,+4,+7", "[Ar] 3d5 4s2", 1774, 0],
    [26, "Fe", "Iron", "Железо", "Темир", 55.845, 8, 4, "tm", "s", 1.83, 1538.0, 2861.0, 7.87, "+2,+3", "[Ar] 3d6 4s2", null, 0],
    [27, "Co", "Cobalt", "Кобальт", "Кобальт", 58.933, 9, 4, "tm", "s", 1.88, 1495.0, 2927.0, 8.86, "+2,+3", "[Ar] 3d7 4s2", 1739, 0],
    [28, "Ni", "Nickel", "Никель", "Никель", 58.693, 10, 4, "tm", "s", 1.91, 1455.0, 2913.0, 8.9, "+2", "[Ar] 3d8 4s2", 1751, 0],
    [29, "Cu", "Copper", "Медь", "Мис", 63.546, 11, 4, "tm", "s", 1.9, 1084.6, 2560.0, 8.96, "+1,+2", "[Ar] 3d10 4s", null, 0],
    [30, "Zn", "Zinc", "Цинк", "Рух", 65.38, 12, 4, "tm", "s", 1.65, 419.5, 907.0, 7.134, "+2", "[Ar] 3d10 4s2", null, 0],
    [31, "Ga", "Gallium", "Галлий", "Галлий", 69.723, 13, 4, "pm", "s", 1.81, 29.8, 2229.0, 5.91, "+3", "[Ar] 3d10 4s2 4p", 1875, 0],
    [32, "Ge", "Germanium", "Германий", "Германий", 72.63, 14, 4, "md", "s", 2.01, 938.3, 2833.0, 5.323, "-4,+2,+4", "[Ar] 3d10 4s2 4p2", 1886, 0],
    [33, "As", "Arsenic", "Мышьяк", "Маргимуш", 74.922, 15, 4, "md", "s", 2.18, null, 616.0, 5.75, "-3,+3,+5", "[Ar] 3d10 4s2 4p3", null, 0],
    [34, "Se", "Selenium", "Селен", "Селен", 78.971, 16, 4, "nm", "s", 2.55, 180.0, 685.0, 4.809, "-2,+2,+4,+6", "[Ar] 3d10 4s2 4p4", 1818, 0],
    [35, "Br", "Bromine", "Бром", "Бром", 79.904, 17, 4, "hl", "l", 2.96, -7.2, 58.8, 3.103, "-1,+1,+3,+5", "[Ar] 3d10 4s2 4p5", 1826, 0],
    [36, "Kr", "Krypton", "Криптон", "Криптон", 83.798, 18, 4, "ng", "g", null, -157.4, -153.4, 3.425, "+2", "[Ar] 3d10 4s2 4p6", 1898, 0],
    [37, "Rb", "Rubidium", "Рубидий", "Рубидий", 85.468, 1, 5, "am", "s", 0.82, 39.3, 688.0, 1.53, "+1", "[Kr] 5s", 1861, 0],
    [38, "Sr", "Strontium", "Стронций", "Стронций", 87.62, 2, 5, "ae", "s", 0.95, 777.0, 1377.0, 2.64, "+2", "[Kr] 5s2", 1790, 0],
    [39, "Y", "Yttrium", "Иттрий", "Иттрий", 88.906, 3, 5, "tm", "s", 1.22, 1522.0, 3345.0, 4.47, "+3", "[Kr] 4d 5s2", 1789, 0],
    [40, "Zr", "Zirconium", "Цирконий", "Цирконий", 91.224, 4, 5, "tm", "s", 1.33, 1854.0, 4406.0, 6.52, "+4", "[Kr] 4d2 5s2", 1789, 0],
    [41, "Nb", "Niobium", "Ниобий", "Ниобий", 92.906, 5, 5, "tm", "s", 1.6, 2477.0, 4741.0, 8.57, "+5", "[Kr] 4d4 5s", 1801, 0],
    [42, "Mo", "Molybdenum", "Молибден", "Молибден", 95.95, 6, 5, "tm", "s", 2.16, 2622.0, 4639.0, 10.2, "+4,+6", "[Kr] 4d5 5s", 1778, 0],
    [43, "Tc", "Technetium", "Технеций", "Технеций", 97.907, 7, 5, "tm", "s", 2.1, 2157.0, 4262.0, 11.0, "+4,+7", "[Kr] 4d5 5s2", 1937, 1],
    [44, "Ru", "Ruthenium", "Рутений", "Рутений", 101.07, 8, 5, "tm", "s", 2.2, 2333.0, 4147.0, 12.1, "+3,+4", "[Kr] 4d7 5s", 1844, 0],
    [45, "Rh", "Rhodium", "Родий", "Родий", 102.906, 9, 5, "tm", "s", 2.28, 1963.0, 3695.0, 12.4, "+3", "[Kr] 4d8 5s", 1803, 0],
    [46, "Pd", "Palladium", "Палладий", "Палладий", 106.42, 10, 5, "tm", "s", 2.2, 1554.8, 2963.0, 12.0, "+2,+4", "[Kr] 4d10", 1803, 0],
    [47, "Ag", "Silver", "Серебро", "Кумуш", 107.868, 11, 5, "tm", "s", 1.93, 961.8, 2162.0, 10.5, "+1", "[Kr] 4d10 5s", null, 0],
    [48, "Cd", "Cadmium", "Кадмий", "Кадмий", 112.414, 12, 5, "tm", "s", 1.69, 321.1, 767.0, 8.69, "+2", "[Kr] 4d10 5s2", 1817, 0],
    [49, "In", "Indium", "Индий", "Индий", 114.818, 13, 5, "pm", "s", 1.78, 156.6, 2027.0, 7.31, "+3", "[Kr] 4d10 5s2 5p", 1863, 0],
    [50, "Sn", "Tin", "Олово", "Қалай", 118.71, 14, 5, "pm", "s", 1.96, 231.9, 2602.0, 7.287, "+2,+4", "[Kr] 4d10 5s2 5p2", null, 0],
    [51, "Sb", "Antimony", "Сурьма", "Сурма", 121.76, 15, 5, "md", "s", 2.05, 630.6, 1587.0, 6.68, "-3,+3,+5", "[Kr] 4d10 5s2 5p3", null, 0],
    [52, "Te", "Tellurium", "Теллур", "Теллур", 127.6, 16, 5, "md", "s", 2.1, 449.5, 988.0, 6.232, "-2,+2,+4,+6", "[Kr] 4d10 5s2 5p4", 1782, 0],
    [53, "I", "Iodine", "Иод", "Йод", 126.904, 17, 5, "hl", "s", 2.66, 113.7, 184.4, 4.933, "-1,+1,+3,+5,+7", "[Kr] 4d10 5s2 5p5", 1811, 0],
    [54, "Xe", "Xenon", "Ксенон", "Ксенон", 131.293, 18, 5, "ng", "g", 2.6, -111.8, -108.1, 5.366, "+2,+4,+6", "[Kr] 4d10 5s2 5p6", 1898, 0],
    [55, "Cs", "Cesium", "Цезий", "Цезий", 132.905, 1, 6, "am", "s", 0.79, 28.5, 671.0, 1.873, "+1", "[Xe] 6s", 1860, 0],
    [56, "Ba", "Barium", "Барий", "Барий", 137.327, 2, 6, "ae", "s", 0.89, 727.0, 1845.0, 3.62, "+2", "[Xe] 6s2", 1808, 0],
    [57, "La", "Lanthanum", "Лантан", "Лантан", 138.905, 3, 6, "ln", "s", 1.1, 920.0, 3464.0, 6.15, "+3", "[Xe] 5d 6s2", 1839, 0],
    [58, "Ce", "Cerium", "Церий", "Церий", 140.116, 0, 6, "ln", "s", 1.12, 799.0, 3443.0, 6.77, "+3,+4", "[Xe] 4f 5d 6s2", 1803, 0],
    [59, "Pr", "Praseodymium", "Празеодим", "Празеодим", 140.908, 0, 6, "ln", "s", 1.13, 931.0, 3520.0, 6.773, "+3", "[Xe] 4f3 6s2", 1885, 0],
    [60, "Nd", "Neodymium", "Неодим", "Неодим", 144.242, 0, 6, "ln", "s", 1.14, 1016.0, 3074.0, 7.01, "+3", "[Xe] 4f4 6s2", 1925, 0],
    [61, "Pm", "Promethium", "Прометий", "Прометий", 144.913, 0, 6, "ln", "s", null, 1042.0, null, 7.26, "+3", "[Xe] 4f5 6s2", 1945, 1],
    [62, "Sm", "Samarium", "Самарий", "Самарий", 150.36, 0, 6, "ln", "s", 1.17, 1072.0, 1794.0, 7.52, "+3", "[Xe] 4f6 6s2", 1879, 0],
    [63, "Eu", "Europium", "Европий", "Европий", 151.964, 0, 6, "ln", "s", null, 822.0, 1529.0, 5.24, "+2,+3", "[Xe] 4f7 6s2", 1901, 0],
    [64, "Gd", "Gadolinium", "Гадолиний", "Гадолиний", 157.25, 0, 6, "ln", "s", 1.2, 1313.0, 3273.0, 7.9, "+3", "[Xe] 4f7 5d 6s2", 1880, 0],
    [65, "Tb", "Terbium", "Тербий", "Тербий", 158.925, 0, 6, "ln", "s", null, 1359.0, 3230.0, 8.23, "+3", "[Xe] 4f9 6s2", 1843, 0],
    [66, "Dy", "Dysprosium", "Диспрозий", "Диспрозий", 162.5, 0, 6, "ln", "s", 1.22, 1412.0, 2567.0, 8.55, "+3", "[Xe] 4f10 6s2", 1886, 0],
    [67, "Ho", "Holmium", "Гольмий", "Гольмий", 164.93, 0, 6, "ln", "s", 1.23, 1472.0, 2700.0, 8.8, "+3", "[Xe] 4f11 6s2", 1878, 0],
    [68, "Er", "Erbium", "Эрбий", "Эрбий", 167.259, 0, 6, "ln", "s", 1.24, 1529.0, 2868.0, 9.07, "+3", "[Xe] 4f12 6s2", 1843, 0],
    [69, "Tm", "Thulium", "Тулий", "Тулий", 168.934, 0, 6, "ln", "s", 1.25, 1545.0, 1950.0, 9.321, "+3", "[Xe] 4f13 6s2", 1879, 0],
    [70, "Yb", "Ytterbium", "Иттербий", "Иттербий", 173.045, 0, 6, "ln", "s", null, 824.0, 1196.0, 6.9, "+3", "[Xe] 4f14 6s2", 1878, 0],
    [71, "Lu", "Lutetium", "Лютеций", "Лютеций", 174.967, 0, 6, "ln", "s", 1.0, 1663.0, 3402.0, 9.84, "+3", "[Xe] 4f14 5d 6s2", 1907, 0],
    [72, "Hf", "Hafnium", "Гафний", "Гафний", 178.49, 4, 6, "tm", "s", 1.3, 2233.0, 4600.0, 13.3, "+4", "[Xe] 4f14 5d2 6s2", 1923, 0],
    [73, "Ta", "Tantalum", "Тантал", "Тантал", 180.948, 5, 6, "tm", "s", 1.5, 3017.0, 5455.0, 16.4, "+5", "[Xe] 4f14 5d3 6s2", 1802, 0],
    [74, "W", "Tungsten", "Вольфрам", "Вольфрам", 183.84, 6, 6, "tm", "s", 1.7, 3414.0, 5555.0, 19.3, "+4,+6", "[Xe] 4f14 5d4 6s2", 1783, 0],
    [75, "Re", "Rhenium", "Рений", "Рений", 186.207, 7, 6, "tm", "s", 1.9, 3185.0, 5590.0, 20.8, "+4", "[Xe] 4f14 5d5 6s2", 1925, 0],
    [76, "Os", "Osmium", "Осмий", "Осмий", 190.23, 8, 6, "tm", "s", 2.2, 3033.0, 5008.0, 22.59, "+4", "[Xe] 4f14 5d6 6s2", 1804, 0],
    [77, "Ir", "Iridium", "Иридий", "Иридий", 192.217, 9, 6, "tm", "s", 2.2, 2446.0, 4428.0, 22.56, "+3,+4", "[Xe] 4f14 5d7 6s2", 1804, 0],
    [78, "Pt", "Platinum", "Платина", "Платина", 195.084, 10, 6, "tm", "s", 2.2, 1768.2, 3825.0, 21.5, "+2,+4", "[Xe] 4f14 5d9 6s", 1735, 0],
    [79, "Au", "Gold", "Золото", "Олтин", 196.967, 11, 6, "tm", "s", 2.4, 1064.2, 2836.0, 19.3, "+1,+3", "[Xe] 4f14 5d10 6s", null, 0],
    [80, "Hg", "Mercury", "Ртуть", "Симоб", 200.592, 12, 6, "tm", "l", 1.9, -38.8, 356.6, 13.53, "+1,+2", "[Xe] 4f14 5d10 6s2", null, 0],
    [81, "Tl", "Thallium", "Таллий", "Таллий", 204.38, 13, 6, "pm", "s", 1.8, 304.0, 1473.0, 11.8, "+1,+3", "[Xe] 4f14 5d10 6s2 6p", 1861, 0],
    [82, "Pb", "Lead", "Свинец", "Қўрғошин", 207.2, 14, 6, "pm", "s", 1.8, 327.5, 1749.0, 11.3, "+2,+4", "[Xe] 4f14 5d10 6s2 6p2", null, 0],
    [83, "Bi", "Bismuth", "Висмут", "Висмут", 208.98, 15, 6, "pm", "s", 1.9, 271.4, 1564.0, 9.79, "+3", "[Xe] 4f14 5d10 6s2 6p3", null, 0],
    [84, "Po", "Polonium", "Полоний", "Полоний", 209.0, 16, 6, "md", "s", 2.0, 254.0, 962.0, 9.2, "-2,+2,+4", "[Xe] 4f14 5d10 6s2 6p4", 1898, 1],
    [85, "At", "Astatine", "Астат", "Астат", 210.0, 17, 6, "hl", "s", 2.2, 302.0, null, 7.0, "-1,+1", "[Xe] 4f14 5d10 6s2 6p5", 1940, 1],
    [86, "Rn", "Radon", "Радон", "Радон", 222.0, 18, 6, "ng", "g", null, -71.0, -61.7, 9.074, "0", "[Xe] 4f14 5d10 6s2 6p6", 1898, 1],
    [87, "Fr", "Francium", "Франций", "Франций", 223.0, 1, 7, "am", "s", 0.7, 21.0, null, null, "+1", "[Rn] 7s", 1939, 1],
    [88, "Ra", "Radium", "Радий", "Радий", 226.0, 2, 7, "ae", "s", 0.9, 696.0, null, 5.0, "+2", "[Rn] 7s2", 1898, 1],
    [89, "Ac", "Actinium", "Актиний", "Актиний", 227.0, 3, 7, "ac", "s", 1.1, 1050.0, 3200.0, 10.0, "+3", "[Rn] 6d 7s2", 1899, 1],
    [90, "Th", "Thorium", "Торий", "Торий", 232.038, 0, 7, "ac", "s", 1.3, 1750.0, 4785.0, 11.7, "+4", "[Rn] 6d2 7s2", 1828, 1],
    [91, "Pa", "Protactinium", "Протактиний", "Протактиний", 231.036, 0, 7, "ac", "s", 1.5, 1572.0, null, 15.4, "+5", "[Rn] 5f2 6d 7s2", 1917, 1],
    [92, "U", "Uranium", "Уран", "Уран", 238.029, 0, 7, "ac", "s", 1.7, 1135.0, 4131.0, 19.1, "+6", "[Rn] 5f3 6d 7s2", 1789, 1],
    [93, "Np", "Neptunium", "Нептуний", "Нептуний", 237.0, 0, 7, "ac", "s", 1.3, 644.0, null, 20.2, "+5", "[Rn] 5f4 6d 7s2", 1940, 1],
    [94, "Pu", "Plutonium", "Плутоний", "Плутоний", 244.0, 0, 7, "ac", "s", 1.3, 640.0, 3228.0, 19.7, "+4", "[Rn] 5f6 7s2", 1940, 1],
    [95, "Am", "Americium", "Америций", "Америций", 243.0, 0, 7, "ac", "s", null, 1176.0, null, 12.0, "+3", "[Rn] 5f7 7s2", 1945, 1],
    [96, "Cm", "Curium", "Кюрий", "Кюрий", 247.0, 0, 7, "ac", "s", null, 1345.0, null, 13.51, "+3", "[Rn] 5f7 6d 7s2", 1944, 1],
    [97, "Bk", "Berkelium", "Берклий", "Берклий", 247.0, 0, 7, "ac", "s", null, 986.0, null, 14.78, "+3", "[Rn] 5f9 7s2", 1949, 1],
    [98, "Cf", "Californium", "Калифорний", "Калифорний", 251.0, 0, 7, "ac", "s", null, 900.0, null, 15.1, "+3", "[Rn] 5f10 7s2", 1950, 1],
    [99, "Es", "Einsteinium", "Эйнштейний", "Эйнштейний", 252.0, 0, 7, "ac", "s", null, 860.0, null, 8.84, "+3", "[Rn] 5f11 7s2", 1952, 1],
    [100, "Fm", "Fermium", "Фермий", "Фермий", 257.0, 0, 7, "ac", "u", null, null, null, 9.7, "+3", "[Rn] 5f12 7s2", 1953, 1],
    [101, "Md", "Mendelevium", "Менделевий", "Менделевий", 258.0, 0, 7, "ac", "u", null, null, null, 10.3, "+3", "[Rn] 5f13 7s2", 1955, 1],
    [102, "No", "Nobelium", "Нобелий", "Нобелий", 259.0, 0, 7, "ac", "u", null, null, null, 9.9, "+3", "[Rn] 5f14 7s2", 1957, 1],
    [103, "Lr", "Lawrencium", "Лоуренсий", "Лоуренсий", 262.0, 0, 7, "ac", "u", null, null, null, 15.6, "+3", "[Rn] 5f14 7s2 7p1", 1961, 1],
    [104, "Rf", "Rutherfordium", "Резерфордий", "Резерфордий", 267.0, 4, 7, "tm", "u", null, null, null, null, "+4", "[Rn] 5f14 6d2 7s2", 1969, 1],
    [105, "Db", "Dubnium", "Дубний", "Дубний", 268.0, 5, 7, "tm", "u", null, null, null, null, "", "[Rn] 5f14 6d3 7s2", 1970, 1],
    [106, "Sg", "Seaborgium", "Сиборгий", "Сиборгий", 271.0, 6, 7, "tm", "u", null, null, null, null, "", "[Rn] 5f14 6d4 7s2", 1974, 1],
    [107, "Bh", "Bohrium", "Борий", "Борий", 274.0, 7, 7, "tm", "u", null, null, null, null, "", "[Rn] 5f14 6d5 7s2", 1976, 1],
    [108, "Hs", "Hassium", "Хассий", "Хассий", 269.0, 8, 7, "tm", "u", null, null, null, null, "", "[Rn] 5f14 6d6 7s2", 1984, 1],
    [109, "Mt", "Meitnerium", "Мейтнерий", "Мейтнерий", 276.0, 9, 7, "tm", "u", null, null, null, null, "", "[Rn] 5f14 6d7 7s2", 1982, 1],
    [110, "Ds", "Darmstadtium", "Дармштадтий", "Дармштадтий", 281.0, 10, 7, "tm", "u", null, null, null, null, "", "[Rn] 5f14 6d9 7s1", 1994, 1],
    [111, "Rg", "Roentgenium", "Рентгений", "Рентгений", 281.0, 11, 7, "tm", "u", null, null, null, null, "", "[Rn] 5f14 6d10 7s1", 1994, 1],
    [112, "Cn", "Copernicium", "Коперниций", "Коперниций", 285.0, 12, 7, "tm", "u", null, null, null, null, "", "[Rn] 5f14 6d10 7s2", 1996, 1],
    [113, "Nh", "Nihonium", "Нихоний", "Нихоний", 286.0, 13, 7, "pm", "u", null, null, null, null, "", "[Rn] 5f14 6d10 7s2 7p1", 2015, 1],
    [114, "Fl", "Flerovium", "Флеровий", "Флеровий", 289.0, 14, 7, "pm", "u", null, null, null, null, "", "[Rn] 5f14 6d10 7s2 7p2", 1998, 1],
    [115, "Mc", "Moscovium", "Московий", "Московий", 288.0, 15, 7, "pm", "u", null, null, null, null, "", "[Rn] 5f14 6d10 7s2 7p3", 2003, 1],
    [116, "Lv", "Livermorium", "Ливерморий", "Ливерморий", 293.0, 16, 7, "pm", "u", null, null, null, null, "", "[Rn] 5f14 6d10 7s2 7p4", 2000, 1],
    [117, "Ts", "Tennessine", "Теннессин", "Теннессин", 294.0, 17, 7, "hl", "u", null, null, null, null, "", "[Rn] 5f14 6d10 7s2 7p5", 2010, 1],
    [118, "Og", "Oganesson", "Оганесон", "Оганесон", 294.0, 18, 7, "ng", "u", null, null, null, null, "0", "[Rn] 5f14 6d10 7s2 7p6", 2002, 1]
  ];
  const EL = ROWS.map((r) => ({ z: r[0], s: r[1], en: r[2], ru: r[3], uz: r[4], m: r[5], g: r[6], p: r[7], cat: r[8], ph: r[9], chi: r[10], mp: r[11], bp: r[12], d: r[13], ox: r[14], cfg: r[15], yr: r[16], rad: !!r[17] }));
  const ES = Object.fromEntries(EL.map((e) => [e.s, e]));
  const CATN = {
    am: t3("Ишқорий металлар", "Щелочные металлы", "Alkali metals"),
    ae: t3("Ишқорий-ер металлари", "Щёлочноземельные металлы", "Alkaline-earth metals"),
    tm: t3("Ўтиш металлари", "Переходные металлы", "Transition metals"),
    pm: t3("Бошқа металлар", "Постпереходные металлы", "Post-transition metals"),
    md: t3("Металлоидлар", "Металлоиды", "Metalloids"),
    nm: t3("Нометаллар", "Неметаллы", "Non-metals"),
    hl: t3("Галогенлар", "Галогены", "Halogens"),
    ng: t3("Инерт газлар", "Благородные газы", "Noble gases"),
    ln: t3("Лантаноидлар", "Лантаноиды", "Lanthanides"),
    ac: t3("Актиноидлар", "Актиноиды", "Actinides")
  };
  const isMetal = (e) => ["am", "ae", "tm", "pm", "ln", "ac"].includes(e.cat);

  /* ---------- 2. Формула: таҳлил, масса, кўриниш ---------- */
  function parse(f) {
    const tot = {};
    String(f).split(/[·*]/).forEach((part, i) => {
      let p = part, mult = 1;
      const m = /^(\d+)(.*)$/.exec(p);
      if (i > 0 && m) { mult = +m[1]; p = m[2]; }
      let pos = 0;
      const num = () => { let s = ""; while (pos < p.length && /\d/.test(p[pos])) s += p[pos++]; return s ? +s : 1; };
      const group = () => {
        const c = {};
        while (pos < p.length) {
          const ch = p[pos];
          if (ch === "(" || ch === "[") { pos++; const g = group(); pos++; const n = num(); for (const k in g) c[k] = (c[k] || 0) + g[k] * n; }
          else if (ch === ")" || ch === "]") break;
          else if (/[A-Z]/.test(ch)) { let s = ch; pos++; while (pos < p.length && /[a-z]/.test(p[pos])) s += p[pos++]; if (!ES[s]) throw new Error("element " + s); const n = num(); c[s] = (c[s] || 0) + n; }
          else throw new Error("formula " + f);
        }
        return c;
      };
      const g = group();
      for (const k in g) tot[k] = (tot[k] || 0) + g[k] * mult;
    });
    return tot;
  }
  const molar = (f) => { const c = parse(f); let m = 0; for (const k in c) m += ES[k].m * c[k]; return m; };
  const SUB = "₀₁₂₃₄₅₆₇₈₉", SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "+": "⁺", "-": "⁻" };
  /* «Fe2(SO4)3» → «Fe₂(SO₄)₃»; «·5H2O» коэффициенти оддий рақам қолади; «SO4^2-» → «SO₄²⁻» */
  function pretty(f) {
    let [base, ch] = String(f).split("^");
    base = base.replace(/(^|·)(\d+)/g, "$1\u0000$2\u0001").replace(/(\d+)/g, (d, _x, off, s) => (s[off - 1] === "\u0000" ? d : d.replace(/\d/g, (x) => SUB[x]))).replace(/[\u0000\u0001]/g, "");
    return base + (ch ? ch.replace(/^1(?=[+-])/, "").replace(/./g, (c) => SUP[c] || c) : "");
  }

  /* ---------- 3. Тенгламани тенглаштириш (Гаусс, рационал сонлар) ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => a / gcd(a, b) * b;
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
  const fsub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
  const chargeOf = (f) => { const m = /\^(\d*)([+-])$/.exec(f); return m ? (m[2] === "-" ? -1 : 1) * (m[1] ? +m[1] : 1) : 0; };
  /* r, p — формулалар рўйхати; натижа — энг кичик мусбат бутун коэффициентлар ёки null */
  function balance(r, p) {
    const sp = r.concat(p), n = sp.length;
    const comp = sp.map((f) => parse(f.split("^")[0]));
    const els = [...new Set(comp.flatMap((c) => Object.keys(c)))];
    const rows = els.map((e) => sp.map((f, j) => (j < r.length ? 1 : -1) * (comp[j][e] || 0)));
    if (sp.some((f) => chargeOf(f))) rows.push(sp.map((f, j) => (j < r.length ? 1 : -1) * chargeOf(f)));
    const A = rows.map((row) => row.map((v) => fr(v)));
    const piv = [];
    let rI = 0;
    for (let c = 0; c < n && rI < A.length; c++) {
      let k = A.findIndex((row, i) => i >= rI && row[c][0] !== 0);
      if (k < 0) continue;
      [A[rI], A[k]] = [A[k], A[rI]];
      const pv = A[rI][c];
      A[rI] = A[rI].map((v) => fdiv(v, pv));
      for (let i = 0; i < A.length; i++) if (i !== rI && A[i][c][0] !== 0) { const f = A[i][c]; A[i] = A[i].map((v, j) => fsub(v, fmul(f, A[rI][j]))); }
      piv.push(c); rI++;
    }
    const free = [...Array(n).keys()].filter((c) => !piv.includes(c));
    if (!free.length || free.length > 3) return null;
    /* Эркин ўзгарувчилар учун 1..8 оралиғида энг кичик мусбат ечим */
    const tryVals = (vals) => {
      const x = Array(n).fill(null);
      free.forEach((c, i) => { x[c] = fr(vals[i]); });
      piv.forEach((c, i) => { let s = fr(0); free.forEach((fc) => { s = fsub(s, fmul(A[i][fc], x[fc])); }); x[c] = s; });
      const L = x.reduce((a, v) => lcm(a, v[1]), 1), ints = x.map((v) => v[0] * (L / v[1]));
      if (ints.some((v) => v <= 0)) return null;
      const g = ints.reduce((a, v) => gcd(a, v), 0);
      return ints.map((v) => v / g);
    };
    let best = null;
    const rec = (i, vals) => {
      if (i === free.length) { const s = tryVals(vals); if (s && (!best || s.reduce((a, b) => a + b) < best.reduce((a, b) => a + b))) best = s; return; }
      for (let v = 1; v <= (free.length === 1 ? 1 : 8); v++) rec(i + 1, vals.concat(v));
    };
    rec(0, []);
    return best;
  }

  /* ---------- 4. Ионлар ва эрувчанлик жадвали ---------- */
  /* Катионлар: f — формула бирлиги, q — заряд, n — [uz, ru (қаратқич), en], poly — кўп атомли, col — эритма ранги */
  const CAT = {
    H: { f: "H", q: 1, n: ["водород", "водорода", "hydrogen"] },
    Li: { f: "Li", q: 1, n: ["литий", "лития", "lithium"] },
    Na: { f: "Na", q: 1, n: ["натрий", "натрия", "sodium"] },
    K: { f: "K", q: 1, n: ["калий", "калия", "potassium"] },
    NH4: { f: "NH4", q: 1, poly: true, n: ["аммоний", "аммония", "ammonium"] },
    Ag: { f: "Ag", q: 1, n: ["кумуш", "серебра", "silver"] },
    Mg: { f: "Mg", q: 2, n: ["магний", "магния", "magnesium"] },
    Ca: { f: "Ca", q: 2, n: ["кальций", "кальция", "calcium"] },
    Sr: { f: "Sr", q: 2, n: ["стронций", "стронция", "strontium"] },
    Ba: { f: "Ba", q: 2, n: ["барий", "бария", "barium"] },
    Zn: { f: "Zn", q: 2, n: ["рух", "цинка", "zinc"] },
    Cu: { f: "Cu", q: 2, rn: 2, n: ["мис", "меди", "copper"], col: "#38bdf8" },
    Fe2: { f: "Fe", q: 2, rn: 2, n: ["темир", "железа", "iron"], col: "#bbf7d0" },
    Fe3: { f: "Fe", q: 3, rn: 3, n: ["темир", "железа", "iron"], col: "#d97706" },
    Al: { f: "Al", q: 3, n: ["алюминий", "алюминия", "aluminium"] },
    Pb: { f: "Pb", q: 2, rn: 2, n: ["қўрғошин", "свинца", "lead"] },
    Mn: { f: "Mn", q: 2, rn: 2, n: ["марганец", "марганца", "manganese"], col: "#fce7f3" },
    Ni: { f: "Ni", q: 2, rn: 2, n: ["никель", "никеля", "nickel"], col: "#4ade80" },
    Co: { f: "Co", q: 2, rn: 2, n: ["кобальт", "кобальта", "cobalt"], col: "#f9a8d4" },
    Cr: { f: "Cr", q: 3, rn: 3, n: ["хром", "хрома", "chromium"], col: "#4d7c0f" },
    Hg: { f: "Hg", q: 2, rn: 2, n: ["симоб", "ртути", "mercury"] },
    Sn: { f: "Sn", q: 2, rn: 2, n: ["қалай", "олова", "tin"] },
    Cd: { f: "Cd", q: 2, n: ["кадмий", "кадмия", "cadmium"] }
  };
  const CK = Object.keys(CAT);
  /* Анионлар: pre — органик анион формулада олдин ёзилади (CH₃COONa) */
  const AN = {
    OH: { f: "OH", q: 1, poly: true, n: ["гидроксид", "гидроксид", "hydroxide"] },
    F: { f: "F", q: 1, n: ["фторид", "фторид", "fluoride"] },
    Cl: { f: "Cl", q: 1, n: ["хлорид", "хлорид", "chloride"] },
    Br: { f: "Br", q: 1, n: ["бромид", "бромид", "bromide"] },
    I: { f: "I", q: 1, n: ["йодид", "иодид", "iodide"] },
    S: { f: "S", q: 2, n: ["сульфид", "сульфид", "sulfide"] },
    SO3: { f: "SO3", q: 2, poly: true, n: ["сульфит", "сульфит", "sulfite"] },
    SO4: { f: "SO4", q: 2, poly: true, n: ["сульфат", "сульфат", "sulfate"] },
    NO3: { f: "NO3", q: 1, poly: true, n: ["нитрат", "нитрат", "nitrate"] },
    NO2: { f: "NO2", q: 1, poly: true, n: ["нитрит", "нитрит", "nitrite"] },
    PO4: { f: "PO4", q: 3, poly: true, n: ["фосфат", "фосфат", "phosphate"] },
    CO3: { f: "CO3", q: 2, poly: true, n: ["карбонат", "карбонат", "carbonate"] },
    HCO3: { f: "HCO3", q: 1, poly: true, n: ["гидрокарбонат", "гидрокарбонат", "hydrogen carbonate"] },
    SiO3: { f: "SiO3", q: 2, poly: true, n: ["силикат", "силикат", "silicate"] },
    Ac: { f: "CH3COO", q: 1, poly: true, pre: true, n: ["ацетат", "ацетат", "acetate"] },
    CrO4: { f: "CrO4", q: 2, poly: true, n: ["хромат", "хромат", "chromate"], col: "#facc15" },
    Cr2O7: { f: "Cr2O7", q: 2, poly: true, n: ["дихромат", "дихромат", "dichromate"], col: "#f97316" },
    MnO4: { f: "MnO4", q: 1, poly: true, n: ["перманганат", "перманганат", "permanganate"], col: "#7e22ce" },
    SCN: { f: "SCN", q: 1, poly: true, n: ["роданид", "роданид (тиоцианат)", "thiocyanate"] },
    ClO3: { f: "ClO3", q: 1, poly: true, n: ["хлорат", "хлорат", "chlorate"] },
    S2O3: { f: "S2O3", q: 2, poly: true, n: ["тиосульфат", "тиосульфат", "thiosulfate"] }
  };
  /* Эрувчанлик жадвали (20 °C): R — эрийди, M — кам эрийди, N — эримайди, «-» — сувда мавжуд эмас (гидролиз/оксидланиш),
     «x» — бу ерда киритилмаган. Тартиб: H Li Na K NH4 Ag Mg Ca Sr Ba Zn Cu Fe2 Fe3 Al Pb Mn Ni Co Cr Hg Sn Cd */
  const SOLT = {
    OH: "-RRRR-NMMRNNNNNNNNNN-NN",
    F: "RMRRRRMNMMMMMMMMMRRMxRM",
    Cl: "RRRRRNRRRRRRRRRMRRRRRRR",
    Br: "RRRRRNRRRRRRRRRMRRRRMRR",
    I: "RRRRRNRRRRR-R-RNRRRRNMR",
    S: "RRRRRN---RNNN--NNNN-NNN",
    SO3: "RRRRRNMNNNM-N--NNNN--xN",
    SO4: "RRRRRMRMNNRRRRRNRRRRRRR",
    NO3: "RRRRRRRRRRRRRRRRRRRRRRR",
    NO2: "xRRRRMRRRRRRxxxRxRxxxxR",
    PO4: "RNRRRNNNNNNNNNNNNNNNNNN",
    CO3: "xMRRRNNNNNN-N--NNNN--xN",
    HCO3: "xRRRRxRRRRxxxxxxxxxxxxx",
    SiO3: "NxRRxxNNxNNNN--NNxx-xxx",
    Ac: "RRRRRMRRRRRRRxxRRRRxRxR",
    CrO4: "xRRRRNRMMNNNxxxNxNNxNxN",
    Cr2O7: "xxRRRxxxxxxxxxxxxxxxxxx",
    MnO4: "xxRRxxxxxxxxxxxxxxxxxxx",
    SCN: "xxRRRxxxxxxxxxxxxxxxxxx",
    ClO3: "xxRRxxxxxxxxxxxxxxxxxxx",
    S2O3: "xxRxxxxxxxxxxxxxxxxxxxx"
  };
  const sol = (ck, ak) => { const i = CK.indexOf(ck), s = SOLT[ak]; if (i >= 0 && s) return s[i]; return dynSol(ak); };
  /* Жадвалда йўқ металл катионлари учун умумий қоида (нитрат, хлорид, сульфат, ацетат — эрийди) */
  const dynSol = (ak) => (["NO3", "Cl", "Br", "I", "SO4", "Ac"].includes(ak) ? "R" : ak === "F" ? "M" : ["OH", "CO3", "PO4"].includes(ak) ? "N" : "x");

  /* Кислоталарнинг кучи (pKa₁); кучли кислоталар — манфий */
  const PKA = { Cl: -6, Br: -9, I: -10, NO3: -1.4, SO4: -3, ClO3: -1, MnO4: -2, SCN: -1, Cr2O7: 0.2, CrO4: 0.7, SO3: 1.86, PO4: 2.15, NO2: 3.3, F: 3.17, Ac: 4.76, CO3: 6.35, HCO3: 6.35, S: 7.0, SiO3: 9.8, S2O3: 0.6 };
  const STRONG_AC = ["Cl", "Br", "I", "NO3", "SO4", "ClO3", "MnO4"];
  /* Кислотада эримайдиган чўкмалар (кучли кислота иштирокида ҳам қолади) */
  const ACIDSTABLE = ["AgCl", "AgBr", "AgI", "BaSO4", "SrSO4", "PbSO4", "CaSO4", "PbCl2", "PbBr2", "PbI2", "CuS", "PbS", "Ag2S", "HgS", "CdS", "SnS", "H2SiO3", "Ag2SO4", "HgI2", "NiS", "CoS"];

  const RN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  /* Динамик катион (жадвалда бўлмаган металл учун) */
  function ruGen(n) { const w = n.toLowerCase(); if (/ий$/.test(w)) return w.replace(/ий$/, "ия"); if (/ь$/.test(w)) return w.replace(/ь$/, "и"); if (/о$/.test(w)) return w.replace(/о$/, "а"); if (/а$/.test(w)) return w.replace(/а$/, "ы"); return w + "а"; }
  function cation(sym, q) {
    for (const k of CK) if (CAT[k].f === sym && CAT[k].q === q) return k;
    const k = sym + q, e = ES[sym];
    if (!CAT[k]) {
      const multi = (e.ox.match(/\+/g) || []).length > 1;
      CAT[k] = { f: sym, q, dyn: true, rn: multi ? q : 0, n: [e.uz.toLowerCase(), ruGen(e.ru), e.en.toLowerCase()] };
    }
    return k;
  }
  const solOf = (ck, ak) => (CAT[ck].dyn ? dynSol(ak) : sol(ck, ak));

  /* Туз (ёки кислота, асос) формуласи */
  function saltF(ck, ak) {
    const c = CAT[ck], a = AN[ak];
    if (ck === "NH4" && ak === "OH") return "NH3·H2O";
    const g = gcd(c.q, a.q), nc = a.q / g, na = c.q / g;
    const cf = c.poly && nc > 1 ? "(" + c.f + ")" + nc : c.f + (nc > 1 ? nc : "");
    const af = a.poly && na > 1 ? "(" + a.f + ")" + na : a.f + (na > 1 ? na : "");
    return a.pre ? af + cf : cf + af;
  }
  const ACIDN = {
    F: t3("Фторид кислота", "Фтороводородная (плавиковая) кислота", "Hydrofluoric acid"),
    Cl: t3("Хлорид кислота", "Соляная кислота", "Hydrochloric acid"),
    Br: t3("Бромид кислота", "Бромоводородная кислота", "Hydrobromic acid"),
    I: t3("Йодид кислота", "Иодоводородная кислота", "Hydroiodic acid"),
    S: t3("Сульфид кислота (водород сульфид эритмаси)", "Сероводородная кислота", "Hydrosulfuric acid"),
    SO3: t3("Сульфит кислота", "Сернистая кислота", "Sulfurous acid"),
    SO4: t3("Сульфат кислота (суюлтирилган)", "Серная кислота (разбавленная)", "Sulfuric acid (dilute)"),
    NO3: t3("Нитрат кислота (суюлтирилган)", "Азотная кислота (разбавленная)", "Nitric acid (dilute)"),
    NO2: t3("Нитрит кислота", "Азотистая кислота", "Nitrous acid"),
    PO4: t3("Фосфат кислота", "Фосфорная кислота", "Phosphoric acid"),
    SiO3: t3("Силикат кислота", "Кремниевая кислота", "Silicic acid"),
    Ac: t3("Сирка кислота", "Уксусная кислота", "Acetic acid")
  };
  function saltName(ck, ak) {
    const c = CAT[ck], a = AN[ak], r = c.rn ? " (" + RN[c.rn] + ")" : "", re = c.rn ? "(" + RN[c.rn] + ")" : "";
    if (ck === "H") return ACIDN[ak] || t3(cap(a.n[0]) + " кислота", cap(a.n[1]) + " кислота", cap(a.n[2]) + " acid");
    if (ck === "NH4" && ak === "OH") return t3("Аммиакли сув (NH₃·H₂O)", "Нашатырный спирт (NH₃·H₂O)", "Aqueous ammonia (NH₃·H₂O)");
    return t3(cap(c.n[0] + r + " " + a.n[0]), cap(a.n[1] + " " + c.n[1] + r), cap(c.n[2] + re + " " + a.n[2]));
  }

  /* Чўкма ва қаттиқ модда ранглари */
  const COL = {
    AgCl: "#f8fafc", AgBr: "#fef9c3", AgI: "#fde047", Ag2S: "#111827", Ag3PO4: "#facc15", Ag2CO3: "#fefce8", Ag2O: "#78350f", Ag2CrO4: "#b91c1c",
    BaCrO4: "#facc15", "Cu(OH)2": "#3b82f6", CuS: "#111827", "Cu3(PO4)2": "#2dd4bf", "(CuOH)2CO3": "#16a34a", CuSiO3: "#60a5fa", CuCrO4: "#92400e", CuI: "#e7e5e4", Cu2O: "#b91c1c",
    "Fe(OH)2": "#a7f3d0", FeS: "#111827", FeCO3: "#d6d3d1", "Fe3(PO4)2": "#bfdbfe", FeSiO3: "#a8a29e", FeSO3: "#e7e5e4", "Fe(OH)3": "#9a3412", FePO4: "#fef3c7",
    "Fe4[Fe(CN)6]3": "#1e3a8a", "Fe3[Fe(CN)6]2": "#1e40af", PbS: "#111827", PbI2: "#facc15", PbCrO4: "#eab308",
    "Mn(OH)2": "#fde4cf", MnS: "#fecaca", MnCO3: "#fce7f3", "Mn3(PO4)2": "#fbcfe8", MnSiO3: "#fbcfe8", MnSO3: "#fce7f3", MnO2: "#292524",
    "Ni(OH)2": "#86efac", NiS: "#111827", NiCO3: "#4ade80", "Ni3(PO4)2": "#86efac", NiSO3: "#bbf7d0", NiCrO4: "#a16207", NiF2: "#bbf7d0",
    "Co(OH)2": "#f9a8d4", CoS: "#111827", CoCO3: "#f9a8d4", "Co3(PO4)2": "#c084fc", CoSO3: "#fbcfe8", CoCrO4: "#a16207",
    "Cr(OH)3": "#4d7c0f", CrPO4: "#65a30d", CrF3: "#86efac", HgO: "#facc15", HgS: "#111827", HgI2: "#ea580c", HgCrO4: "#c2410c", "Hg3(PO4)2": "#fef9c3",
    SnS: "#78350f", CdS: "#facc15", CdCrO4: "#facc15", ZnCrO4: "#facc15", "H2SiO3": "#f1f5f9",
    S: "#facc15", C: "#1c1917", I2: "#4c1d95", Cu: "#c2410c", Ag: "#cbd5e1", Fe: "#57534e", Pb: "#64748b", Hg: "#cbd5e1", Zn: "#94a3b8", Sn: "#d4d4d8", Au: "#eab308", Br2: "#9a3412", P: "#dc2626",
    "CuSO4·5H2O": "#2563eb", CuSO4: "#f5f5f4", CuCl2: "#0d9488", "Cu(NO3)2": "#2563eb", "(CH3COO)2Cu": "#0e7490", FeCl3: "#a16207", FeSO4: "#bbf7d0", FeCl2: "#86efac", "Fe(NO3)3": "#e9d5ff", "Fe2(SO4)3": "#fde68a",
    NiCl2: "#22c55e", NiSO4: "#22c55e", "Ni(NO3)2": "#22c55e", CoCl2: "#f472b6", CoSO4: "#f472b6", "Co(NO3)2": "#e11d48", CrCl3: "#7c3aed", "Cr2(SO4)3": "#166534", "Cr(NO3)3": "#6d28d9",
    MnSO4: "#fbcfe8", MnCl2: "#fbcfe8", KMnO4: "#581c87", NaMnO4: "#581c87", K2CrO4: "#facc15", Na2CrO4: "#facc15", "(NH4)2CrO4": "#facc15", K2Cr2O7: "#f97316", Na2Cr2O7: "#f97316", "(NH4)2Cr2O7": "#ea580c",
    "K4[Fe(CN)6]": "#fde047", "K3[Fe(CN)6]": "#dc2626", "Fe(SCN)3": "#991b1b", "[Cu(NH3)4]SO4": "#1d4ed8", CuO: "#1c1917", FeO: "#1c1917", Fe2O3: "#9a3412", Fe3O4: "#292524", Cr2O3: "#15803d", PbO: "#facc15",
    Ag2O_: "#78350f", NiO: "#166534", CoO: "#365314", MnO: "#4d7c0f", CdO: "#92400e", HgO_: "#facc15", SnO2: "#f5f5f4", NO2: "#b45309", Cl2: "#bef264", "(C17H35COO)2Ca": "#f5f5f4", "Na2[Zn(OH)4]": "#ffffff"
  };
  /* Эритма ранги: катион ёки анион бўйича */
  const aqCol = (ck, ak) => (AN[ak] && AN[ak].col) || (CAT[ck] && CAT[ck].col) || null;

  /* ---------- 5. Моддалар рўйхати ---------- */
  const SUBS = [], BY = {};
  const addS = (o) => { if (BY[o.id]) return BY[o.id]; SUBS.push(o); BY[o.id] = o; return o; };
  /* Мактабда очиқ (хавфсиз) моддалар; қолганлари 🔒 */
  const SAFE = new Set(["H2O", "NaCl", "KCl", "NaHCO3", "Na2CO3", "CaCO3", "MgSO4", "MgCO3", "CaSO4", "Na2SO4", "K2SO4", "KNO3", "NH4Cl", "CaCl2", "MgCl2", "CH3COOH", "CH3COONa", "C6H12O6", "C12H22O11", "(C6H10O5)n", "C6H8O7", "H2O2", "Ca(OH)2", "Mg(OH)2", "CO2", "O2", "N2", "He", "Ne", "Ar", "C", "S", "Fe", "Cu", "Zn", "Al", "Mg", "Sn", "Ag", "Au", "Si", "Ca3(PO4)2", "Na3PO4", "SiO2", "Al2O3", "Fe2O3", "CuO", "MgO", "ZnO", "C17H35COONa", "KHCO3", "Na2SiO3", "Ca(HCO3)2", "CaF2", "NaF", "BaSO4", "Ti", "Pt", "Ni", "Cr", "Mn", "Co", "Pb", "H2", "I2", "CuSO4·5H2O", "CuSO4", "FeSO4", "Al(OH)3", "Zn(OH)2", "Cu(OH)2", "Fe(OH)3", "CH3COOK", "(CH3COO)2Ca", "KI", "NaBr", "KBr", "NaI", "CO(NH2)2", "C3H8O3", "Ca(NO3)2", "NH4NO3", "(NH4)2SO4", "Ca(H2PO4)2", "MnO2"]);
  /* Хавф белгилари (GHS) — катион ва анион бўйича */
  const HZC = { Ba: ["tox"], Pb: ["tox", "env", "hp"], Hg: ["tox", "env"], Cd: ["tox", "env", "hp"], Ag: ["cor", "env"], Cu: ["irr", "env"], Ni: ["irr", "hp"], Co: ["irr", "hp"], Cr: ["irr"], Sn: ["irr"], Li: ["irr"], Sr: [], Fe3: ["irr"], Mn: ["irr"] };
  const HZA = { OH: ["cor"], MnO4: ["ox", "env"], ClO3: ["ox"], NO2: ["tox", "ox"], F: ["tox"], CrO4: ["tox", "hp", "env"], Cr2O7: ["tox", "ox", "hp", "env"], SCN: ["irr"], S: ["irr"], I: [] };
  const uniq = (a) => [...new Set(a)];

  /* 5.1 Оддий моддалар (118 элемент) */
  const DI = { H: "H2", N: "N2", O: "O2", F: "F2", Cl: "Cl2", Br: "Br2", I: "I2" };
  const HZE = { Li: ["flam", "cor"], Na: ["flam", "cor"], K: ["flam", "cor"], Rb: ["flam", "cor"], Cs: ["flam", "cor"], Ca: ["flam"], Sr: ["flam"], Ba: ["flam", "tox"], Mg: ["flam"], P: ["flam", "tox"], F: ["tox", "ox", "cor"], Cl: ["tox", "ox", "env"], Br: ["tox", "cor", "env"], I: ["irr", "env"], Hg: ["tox", "env"], As: ["tox", "hp"], Be: ["tox", "hp"], Tl: ["tox"], Pb: ["tox", "hp"], Cd: ["tox", "hp"], Se: ["tox"], Te: ["tox"], Sb: ["tox"], Os: ["tox"], H: ["flam"], O: ["ox"], Ni: ["hp"], Co: ["hp"], Cr: [], Ga: [], S: ["irr"] };
  EL.forEach((e) => {
    const f = DI[e.s] || e.s;
    const cls = e.cat === "ng" ? "noble" : isMetal(e) ? "metal" : "nonmetal";
    addS({ id: f, f, cls, el: e.s, st: e.ph === "u" ? "u" : e.ph, n: t3(e.uz, e.ru, e.en), col: COL[f] || (e.cat === "ng" ? "#e0f2fe" : isMetal(e) ? "#cbd5e1" : "#e5e7eb"), haz: uniq((HZE[e.s] || []).concat(e.rad ? ["rad"] : [])), rad: e.rad });
  });
  /* 5.2 Кислоталар, асослар, тузлар (катион × анион) */
  CK.forEach((ck) => Object.keys(AN).forEach((ak) => {
    const s = sol(ck, ak);
    if (s === "-" || s === "x") return;
    if (ck === "H" && ak === "OH") return;
    const f = saltF(ck, ak);
    const cls = ck === "H" ? "acid" : ak === "OH" ? "base" : "salt";
    const haz = ck === "H" ? (STRONG_AC.includes(ak) ? ["cor"] : ak === "F" ? ["tox", "cor"] : ak === "S" ? ["tox", "flam"] : ["irr"]) : uniq((HZC[ck] || []).concat(HZA[ak] || []).concat(ak === "OH" && s !== "R" ? [] : []));
    if (cls === "base" && s !== "R" && haz.includes("cor")) haz.splice(haz.indexOf("cor"), 1);
    const st = ck === "H" ? (ak === "SiO3" ? "s" : ak === "Ac" ? "l" : "aq") : ck === "NH4" && ak === "OH" ? "aq" : "s";
    addS({ id: f, f, cls, cat: ck, an: ak, sol: s, st, n: saltName(ck, ak), col: COL[f] || (s === "R" ? aqCol(ck, ak) || "#ffffff" : "#ffffff"), aq: s === "R" ? aqCol(ck, ak) : null, haz });
  }));
  /* Концентрланган кислоталар */
  addS({ id: "H2SO4c", f: "H2SO4", cls: "acid", cat: "H", an: "SO4", sol: "R", st: "l", conc: true, n: t3("Сульфат кислота (концентрланган, 98 %)", "Серная кислота (концентрированная, 98 %)", "Sulfuric acid (concentrated, 98 %)"), col: "#f8fafc", haz: ["cor", "ox"] });
  addS({ id: "HNO3c", f: "HNO3", cls: "acid", cat: "H", an: "NO3", sol: "R", st: "l", conc: true, n: t3("Нитрат кислота (концентрланган, 65 %)", "Азотная кислота (концентрированная, 65 %)", "Nitric acid (concentrated, 65 %)"), col: "#fef9c3", haz: ["cor", "ox", "tox"] });
  /* 5.3 Оксидлар: k — b асосли, a кислотали, am амфотер, n туз ҳосил қилмайдиган, p пероксид; m — металл/нометалл, q — заряд */
  const OX = [
    ["Li2O", "b", "Li", 1], ["Na2O", "b", "Na", 1], ["K2O", "b", "K", 1], ["MgO", "b", "Mg", 2], ["CaO", "b", "Ca", 2], ["SrO", "b", "Sr", 2], ["BaO", "b", "Ba", 2],
    ["CuO", "b", "Cu", 2], ["Cu2O", "b", "Cu", 1], ["FeO", "b", "Fe", 2], ["Fe2O3", "b", "Fe", 3], ["Fe3O4", "b", "Fe", 0], ["NiO", "b", "Ni", 2], ["CoO", "b", "Co", 2], ["MnO", "b", "Mn", 2], ["Ag2O", "b", "Ag", 1], ["HgO", "b", "Hg", 2], ["CdO", "b", "Cd", 2], ["La2O3", "b", "La", 3],
    ["Al2O3", "am", "Al", 3], ["ZnO", "am", "Zn", 2], ["BeO", "am", "Be", 2], ["Cr2O3", "am", "Cr", 3], ["PbO", "am", "Pb", 2], ["SnO", "am", "Sn", 2], ["SnO2", "am", "Sn", 4], ["MnO2", "am", "Mn", 4], ["TiO2", "am", "Ti", 4],
    ["CO2", "a", "CO3"], ["SO2", "a", "SO3"], ["SO3", "a", "SO4"], ["P2O5", "a", "PO4"], ["N2O5", "a", "NO3"], ["NO2", "a", "NO3"], ["SiO2", "a", "SiO3"], ["CrO3", "a", "CrO4"], ["Cl2O7", "a", "ClO4"], ["B2O3", "a", "BO3"], ["SeO2", "a", "SeO3"],
    ["CO", "n"], ["NO", "n"], ["N2O", "n"], ["H2O2", "p"], ["Na2O2", "p", "Na", 1], ["BaO2", "p", "Ba", 2]
  ];
  const OXN = {
    Li2O: ["Литий оксид", "Оксид лития", "Lithium oxide"], Na2O: ["Натрий оксид", "Оксид натрия", "Sodium oxide"], K2O: ["Калий оксид", "Оксид калия", "Potassium oxide"], MgO: ["Магний оксид", "Оксид магния", "Magnesium oxide"], CaO: ["Кальций оксид (сўндирилмаган оҳак)", "Оксид кальция (негашёная известь)", "Calcium oxide (quicklime)"], SrO: ["Стронций оксид", "Оксид стронция", "Strontium oxide"], BaO: ["Барий оксид", "Оксид бария", "Barium oxide"],
    CuO: ["Мис (II) оксид", "Оксид меди (II)", "Copper(II) oxide"], Cu2O: ["Мис (I) оксид", "Оксид меди (I)", "Copper(I) oxide"], FeO: ["Темир (II) оксид", "Оксид железа (II)", "Iron(II) oxide"], Fe2O3: ["Темир (III) оксид (занг)", "Оксид железа (III) (ржавчина)", "Iron(III) oxide (rust)"], Fe3O4: ["Темир қуруми (Fe₃O₄, магнетит)", "Железная окалина (Fe₃O₄, магнетит)", "Magnetite (Fe₃O₄)"], NiO: ["Никель (II) оксид", "Оксид никеля (II)", "Nickel(II) oxide"], CoO: ["Кобальт (II) оксид", "Оксид кобальта (II)", "Cobalt(II) oxide"], MnO: ["Марганец (II) оксид", "Оксид марганца (II)", "Manganese(II) oxide"], Ag2O: ["Кумуш оксид", "Оксид серебра", "Silver oxide"], HgO: ["Симоб (II) оксид", "Оксид ртути (II)", "Mercury(II) oxide"], CdO: ["Кадмий оксид", "Оксид кадмия", "Cadmium oxide"], La2O3: ["Лантан оксид", "Оксид лантана", "Lanthanum oxide"],
    Al2O3: ["Алюминий оксид (глинозём)", "Оксид алюминия (глинозём)", "Aluminium oxide (alumina)"], ZnO: ["Рух оксид", "Оксид цинка", "Zinc oxide"], BeO: ["Бериллий оксид", "Оксид бериллия", "Beryllium oxide"], Cr2O3: ["Хром (III) оксид", "Оксид хрома (III)", "Chromium(III) oxide"], PbO: ["Қўрғошин (II) оксид", "Оксид свинца (II)", "Lead(II) oxide"], SnO: ["Қалай (II) оксид", "Оксид олова (II)", "Tin(II) oxide"], SnO2: ["Қалай (IV) оксид", "Оксид олова (IV)", "Tin(IV) oxide"], MnO2: ["Марганец (IV) оксид (пиролюзит)", "Оксид марганца (IV) (пиролюзит)", "Manganese(IV) oxide"], TiO2: ["Титан (IV) оксид", "Оксид титана (IV)", "Titanium dioxide"],
    CO2: ["Углерод (IV) оксид (карбонат ангидрид)", "Оксид углерода (IV) (углекислый газ)", "Carbon dioxide"], SO2: ["Олтингугурт (IV) оксид (сульфит ангидрид)", "Оксид серы (IV) (сернистый газ)", "Sulfur dioxide"], SO3: ["Олтингугурт (VI) оксид", "Оксид серы (VI)", "Sulfur trioxide"], P2O5: ["Фосфор (V) оксид", "Оксид фосфора (V)", "Phosphorus pentoxide"], N2O5: ["Азот (V) оксид", "Оксид азота (V)", "Dinitrogen pentoxide"], NO2: ["Азот (IV) оксид (қўнғир газ)", "Оксид азота (IV) (бурый газ)", "Nitrogen dioxide"], SiO2: ["Кремний (IV) оксид (кварц, қум)", "Оксид кремния (IV) (кварц, песок)", "Silicon dioxide (quartz, sand)"], CrO3: ["Хром (VI) оксид", "Оксид хрома (VI)", "Chromium(VI) oxide"], Cl2O7: ["Хлор (VII) оксид", "Оксид хлора (VII)", "Dichlorine heptoxide"], B2O3: ["Бор оксид", "Оксид бора", "Boron trioxide"], SeO2: ["Селен (IV) оксид", "Оксид селена (IV)", "Selenium dioxide"],
    CO: ["Углерод (II) оксид (ис гази)", "Оксид углерода (II) (угарный газ)", "Carbon monoxide"], NO: ["Азот (II) оксид", "Оксид азота (II)", "Nitric oxide"], N2O: ["Азот (I) оксид (кулдирувчи газ)", "Оксид азота (I) (веселящий газ)", "Nitrous oxide"], H2O2: ["Водород пероксид (3 %)", "Пероксид водорода (3 %)", "Hydrogen peroxide (3 %)"], Na2O2: ["Натрий пероксид", "Пероксид натрия", "Sodium peroxide"], BaO2: ["Барий пероксид", "Пероксид бария", "Barium peroxide"]
  };
  const OXST = { CO2: "g", SO2: "g", NO2: "g", CO: "g", NO: "g", N2O: "g", SO3: "l", Cl2O7: "l", H2O2: "aq" };
  const OXHZ = { CaO: ["cor"], Na2O: ["cor"], K2O: ["cor"], Li2O: ["cor"], BaO: ["tox", "cor"], SO2: ["tox"], SO3: ["cor"], P2O5: ["cor"], N2O5: ["cor", "ox"], NO2: ["tox", "ox"], CO: ["tox", "flam"], NO: ["tox", "ox"], CrO3: ["tox", "ox", "hp", "env"], Cl2O7: ["ox", "cor"], HgO: ["tox", "env"], CdO: ["tox", "hp"], PbO: ["tox", "hp"], BeO: ["tox", "hp"], Na2O2: ["ox", "cor"], BaO2: ["ox", "tox"], H2O2: ["irr"], Ag2O: ["ox"], SeO2: ["tox"], MnO2: ["irr"], CuO: ["env"], N2O: ["ox"], Cr2O3: [], NiO: ["hp"], CoO: ["hp"] };
  OX.forEach(([f, k, x, q]) => addS({ id: f, f, cls: "oxide", ok: k, m: k === "a" ? null : x, q, aan: k === "a" ? x : null, st: OXST[f] || "s", n: t3(...OXN[f]), col: COL[f] || COL[f + "_"] || "#f5f5f4", haz: OXHZ[f] || [] }));
  /* 5.4 Сув, газлар ва бошқа моддалар */
  const OTH = [
    ["H2O", "water", "l", "#e0f2fe", ["Сув", "Вода", "Water"], []],
    ["NH3", "gas", "g", "#f8fafc", ["Аммиак (газ)", "Аммиак (газ)", "Ammonia (gas)"], ["tox", "cor", "env"]],
    ["H2S", "gas", "g", "#f8fafc", ["Водород сульфид (газ)", "Сероводород (газ)", "Hydrogen sulfide (gas)"], ["tox", "flam", "env"]],
    ["CH4", "org", "g", "#f8fafc", ["Метан (табиий газ)", "Метан (природный газ)", "Methane (natural gas)"], ["flam"]],
    ["C3H8", "org", "g", "#f8fafc", ["Пропан", "Пропан", "Propane"], ["flam"]],
    ["C2H4", "org", "g", "#f8fafc", ["Этилен", "Этилен", "Ethylene"], ["flam"]],
    ["C2H2", "org", "g", "#f8fafc", ["Ацетилен", "Ацетилен", "Acetylene"], ["flam"]],
    ["C6H6", "org", "l", "#f8fafc", ["Бензол", "Бензол", "Benzene"], ["flam", "tox", "hp"]],
    ["C2H5OH", "org", "l", "#f8fafc", ["Этил спирти (этанол)", "Этиловый спирт (этанол)", "Ethanol"], ["flam"]],
    ["CH3OH", "org", "l", "#f8fafc", ["Метил спирти (метанол)", "Метиловый спирт (метанол)", "Methanol"], ["flam", "tox"]],
    ["C3H8O3", "org", "l", "#f8fafc", ["Глицерин", "Глицерин", "Glycerol"], []],
    ["C3H6O", "org", "l", "#f8fafc", ["Ацетон", "Ацетон", "Acetone"], ["flam", "irr"]],
    ["C6H12O6", "org", "s", "#ffffff", ["Глюкоза", "Глюкоза", "Glucose"], []],
    ["C12H22O11", "org", "s", "#ffffff", ["Сахароза (шакар)", "Сахароза (сахар)", "Sucrose (sugar)"], []],
    ["(C6H10O5)n", "org", "s", "#ffffff", ["Крахмал", "Крахмал", "Starch"], []],
    ["C6H8O7", "org", "s", "#ffffff", ["Лимон кислота", "Лимонная кислота", "Citric acid"], ["irr"]],
    ["CO(NH2)2", "org", "s", "#ffffff", ["Мочевина (карбамид)", "Мочевина (карбамид)", "Urea"], []],
    ["C17H35COONa", "org", "s", "#fefce8", ["Совун (натрий стеарат)", "Мыло (стеарат натрия)", "Soap (sodium stearate)"], []],
    ["H2C2O4", "org", "s", "#ffffff", ["Оксалат (шовул) кислота", "Щавелевая кислота", "Oxalic acid"], ["tox", "cor"]],
    ["CaC2", "other", "s", "#57534e", ["Кальций карбид", "Карбид кальция", "Calcium carbide"], ["flam"]],
    ["K4[Fe(CN)6]", "other", "s", "#fde047", ["Сариқ қон тузи K₄[Fe(CN)₆]", "Жёлтая кровяная соль K₄[Fe(CN)₆]", "Potassium ferrocyanide"], ["irr"]],
    ["K3[Fe(CN)6]", "other", "s", "#dc2626", ["Қизил қон тузи K₃[Fe(CN)₆]", "Красная кровяная соль K₃[Fe(CN)₆]", "Potassium ferricyanide"], ["irr"]],
    ["CuSO4·5H2O", "other", "s", "#2563eb", ["Мис купороси (CuSO₄·5H₂O)", "Медный купорос (CuSO₄·5H₂O)", "Copper sulfate pentahydrate"], ["irr", "env"]],
    ["Ca(H2PO4)2", "other", "s", "#f5f5f4", ["Оддий суперфосфат (ўғит)", "Суперфосфат (удобрение)", "Superphosphate (fertiliser)"], ["irr"]],
    ["NaClO", "other", "aq", "#f7fee7", ["Натрий гипохлорит (оқартиргич)", "Гипохлорит натрия (отбеливатель)", "Sodium hypochlorite (bleach)"], ["cor", "env"]]
  ];
  OTH.forEach(([f, cls, st, col, n, haz]) => addS({ id: f, f, cls, st, col, n: t3(...n), haz }));
  /* Мактаб босқичи қулфи */
  SUBS.forEach((s) => { s.safe = SAFE.has(s.id) && !s.rad; });

  /* ---------- 6. Ёрдамчилар: модда ҳолати, газлар ---------- */
  const GAS = {
    H2: t3("рангсиз, ҳидсиз; ёнади — «тарс» овоз", "бесцветный, без запаха; горит с хлопком", "colourless, odourless; burns with a squeaky pop"),
    O2: t3("рангсиз; чўғланган чўпни алангалатади", "бесцветный; разжигает тлеющую лучинку", "colourless; relights a glowing splint"),
    CO2: t3("рангсиз; оҳак сувини лойқалатади", "бесцветный; мутит известковую воду", "colourless; turns limewater milky"),
    SO2: t3("рангсиз, ўткир бўғувчи ҳид", "бесцветный, резкий удушливый запах", "colourless, sharp choking smell"),
    H2S: t3("палағда тухум ҳиди, заҳарли", "запах тухлых яиц, ядовит", "rotten-egg smell, toxic"),
    NH3: t3("нашатир ҳиди; ҳўл қизил лакмусни кўкартиради", "запах нашатыря; синит влажный красный лакмус", "pungent; turns damp red litmus blue"),
    NO2: t3("қўнғир-малла, заҳарли", "бурый, ядовит", "brown, toxic"),
    NO: t3("рангсиз, ҳавода қўнғирлашади (NO₂)", "бесцветный, на воздухе буреет (NO₂)", "colourless, turns brown in air (NO₂)"),
    Cl2: t3("сариқ-яшил, бўғувчи, заҳарли", "жёлто-зелёный, удушливый, ядовит", "yellow-green, choking, toxic"),
    N2: t3("рангсиз, ҳидсиз", "бесцветный, без запаха", "colourless, odourless"),
    N2O: t3("рангсиз, ширинроқ ҳид", "бесцветный, сладковатый запах", "colourless, sweetish smell"),
    CO: t3("рангсиз, ҳидсиз, жуда заҳарли", "бесцветный, без запаха, очень ядовит", "colourless, odourless, very toxic"),
    CH4: t3("рангсиз, ёнувчан", "бесцветный, горючий", "colourless, flammable"),
    C2H2: t3("рангсиз, ёнувчан (ис чиқариб ёнади)", "бесцветный, горит коптящим пламенем", "colourless, burns with a sooty flame"),
    C2H4: t3("рангсиз, ёнувчан", "бесцветный, горючий", "colourless, flammable"),
    HCl: t3("рангсиз, нам ҳавода оқ туман", "бесцветный, во влажном воздухе дымит", "colourless, fumes in moist air"),
    Br2: t3("қизил-қўнғир буғ", "красно-бурые пары", "red-brown vapour"),
    I2: t3("бинафша буғ", "фиолетовые пары", "violet vapour")
  };
  const GASCOL = { NO2: "#b45309", Cl2: "#a3e635", Br2: "#c2410c", I2: "#7c3aed" };
  const isSolubleStrong = (s) => s && ((s.cls === "salt" && s.sol === "R") || (s.cls === "acid" && STRONG_AC.includes(s.an)) || (s.cls === "base" && s.sol === "R" && s.cat !== "NH4"));
  /* Маҳсулот ҳолати: ↓ чўкма, ↑ газ */
  function prodInfo(f, aqMedium) {
    const s = SUBS.find((x) => x.f === f && !x.conc);
    if (GAS[f] && f !== "Br2" && f !== "I2" && !(aqMedium && f === "HCl")) return { mark: "↑", gas: true, col: GASCOL[f] || null };
    if (f === "H2O") return { mark: "", col: null };
    if (s && (s.cls === "salt" || s.cls === "base" || s.cls === "acid")) {
      if ((s.sol === "N" || s.sol === "M") && aqMedium) return { mark: "↓", ppt: true, col: s.col, m: s.sol === "M" };
      if (s.sol === "N" || s.sol === "M") return { mark: "", col: s.col };
      return { mark: "", aq: aqMedium, col: s.aq };
    }
    if (s && s.cls === "metal") return { mark: aqMedium ? "↓" : "", ppt: aqMedium, metal: true, col: s.col };
    if (s && s.cls === "oxide" && s.st === "s") return { mark: aqMedium ? "↓" : "", ppt: aqMedium, col: s.col };
    if (f === "S" || f === "C" || f === "CuI" || f === "Cu2O" || f === "Ag2O" || f === "HgO" || f === "MnO2" || /\[Fe\(CN\)6\]/.test(f) || /^\(C17H35COO\)2/.test(f)) return { mark: aqMedium ? "↓" : "", ppt: aqMedium, col: COL[f] || "#e5e7eb" };
    if (f === "I2" || f === "Br2") return { mark: "", col: f === "I2" ? "#b45309" : "#ea580c", halo: true };
    return { mark: "", col: COL[f] || null, aq: aqMedium };
  }

  /* ---------- 7. Металлар активлиги (E°, В; асосий катион заряди) ---------- */
  const E0 = { Li: [-3.04, 1], Cs: [-3.03, 1], Rb: [-2.98, 1], K: [-2.93, 1], Ba: [-2.91, 2], Sr: [-2.89, 2], Ca: [-2.87, 2], Na: [-2.71, 1], La: [-2.38, 3], Ce: [-2.34, 3], Pr: [-2.35, 3], Nd: [-2.32, 3], Sm: [-2.30, 3], Eu: [-1.99, 3], Gd: [-2.28, 3], Tb: [-2.31, 3], Dy: [-2.29, 3], Ho: [-2.33, 3], Er: [-2.33, 3], Tm: [-2.32, 3], Yb: [-2.22, 3], Lu: [-2.28, 3], Y: [-2.37, 3], Sc: [-2.08, 3], Mg: [-2.37, 2], Be: [-1.85, 2], Al: [-1.66, 3], Ti: [-1.63, 2], Zr: [-1.45, 4], Hf: [-1.55, 4], Mn: [-1.18, 2], V: [-1.18, 2], Nb: [-1.1, 3], Zn: [-0.76, 2], Cr: [-0.91, 2], Ga: [-0.53, 3], Fe: [-0.44, 2], Cd: [-0.40, 2], In: [-0.34, 3], Tl: [-0.34, 1], Co: [-0.28, 2], Ni: [-0.25, 2], Mo: [-0.2, 3], Sn: [-0.14, 2], Pb: [-0.13, 2], W: [-0.12, 3], Ge: [0.12, 2], Sb: [0.15, 3], Bi: [0.31, 3], Cu: [0.34, 2], Re: [0.3, 3], Ru: [0.45, 2], Ag: [0.80, 1], Hg: [0.85, 2], Rh: [0.76, 3], Pd: [0.95, 2], Os: [0.85, 2], Ir: [1.16, 3], Pt: [1.18, 2], Au: [1.50, 3] };
  const WATER_M = ["Li", "Na", "K", "Rb", "Cs", "Ca", "Sr", "Ba"];
  /* Совуқ суюлтирилган кислоталарда ҳам оксид парда туфайли сезиларли реакция бермайдиган металлар */
  const PASSIVE = ["Ti", "Zr", "Hf", "Nb", "Ta", "W", "Mo", "V"];
  /* Ёнганда ҳосил бўладиган оксид (металл) */
  const BURN = { Li: "Li2O", Na: "Na2O2", K: "KO2", Mg: "MgO", Ca: "CaO", Sr: "SrO", Ba: "BaO", Al: "Al2O3", Zn: "ZnO", Fe: "Fe3O4", Cu: "CuO", Pb: "PbO", Sn: "SnO2", Ni: "NiO", Co: "CoO", Mn: "MnO2", Cr: "Cr2O3", Ti: "TiO2", Hg: "HgO", Be: "BeO", Cd: "CdO", La: "La2O3", Ce: "CeO2", Zr: "ZrO2", W: "WO3", Mo: "MoO3", V: "V2O5", Bi: "Bi2O3", Sb: "Sb2O3", Ga: "Ga2O3", In: "In2O3", Tl: "Tl2O", Ge: "GeO2", Rb: "RbO2", Cs: "CsO2", Sc: "Sc2O3", Y: "Y2O3", Nd: "Nd2O3", Gd: "Gd2O3" };
  const NOBLE_M = ["Ag", "Au", "Pt", "Pd", "Ir", "Rh", "Os", "Ru"];
  /* Нометаллнинг ёниш маҳсулоти */
  const NBURN = { H2: "H2O", C: "CO2", S: "SO2", P: "P2O5", Si: "SiO2", B: "B2O3", Se: "SeO2", As: "As2O3", N2: null };

  /* ---------- 8. Махсус реакциялар (сифат ва классик тажрибалар) ---------- */
  /* r — моддалар (id), e — [реагентлар, маҳсулотлар] [[k, f]], h — қиздириш керак, cat — катализатор (стрелка устида), t — тур, o — кузатув */
  const SP = [
    { r: ["H2O2", "MnO2"], e: [[[2, "H2O2"]], [[2, "H2O"], [1, "O2"]]], cat: "MnO2", t: ["decomp", "cat"], o: t3("Шиддатли кўпик ва пуфакчалар — кислород ажралади; MnO₂ ўзгармайди (катализатор).", "Бурное выделение пузырьков кислорода; MnO₂ не расходуется (катализатор).", "Vigorous fizzing as oxygen forms; MnO₂ is unchanged (catalyst).") },
    { r: ["KClO3", "MnO2"], h: 1, e: [[[2, "KClO3"]], [[2, "KCl"], [3, "O2"]]], cat: "MnO2", t: ["decomp", "cat"], o: t3("Қиздирилганда кислород ажралади (лабораторияда O₂ олиш).", "При нагревании выделяется кислород (лабораторное получение O₂).", "On heating oxygen is released (lab preparation of O₂).") },
    { r: ["KMnO4", "HCl"], u: 1, e: [[[2, "KMnO4"], [16, "HCl"]], [[2, "KCl"], [2, "MnCl2"], [5, "Cl2"], [8, "H2O"]]], t: ["redox"], o: t3("Бинафша ранг йўқолади, сариқ-яшил хлор гази ажралади (тортиш шкафида!).", "Фиолетовая окраска исчезает, выделяется жёлто-зелёный хлор (под тягой!).", "Purple colour vanishes; yellow-green chlorine gas forms (fume hood!).") },
    { r: ["MnO2", "HCl"], h: 1, u: 1, e: [[[1, "MnO2"], [4, "HCl"]], [[1, "MnCl2"], [1, "Cl2"], [2, "H2O"]]], t: ["redox"], o: t3("Қиздирилганда хлор ажралади (Шееле усули, 1774).", "При нагревании выделяется хлор (способ Шееле, 1774).", "On heating chlorine is evolved (Scheele, 1774).") },
    { r: ["KMnO4", "H2O2", "H2SO4"], e: [[[2, "KMnO4"], [5, "H2O2"], [3, "H2SO4"]], [[1, "K2SO4"], [2, "MnSO4"], [5, "O2"], [8, "H2O"]]], t: ["redox"], o: t3("Бинафша эритма рангсизланади, кислород пуфакчалари чиқади.", "Фиолетовый раствор обесцвечивается, выделяются пузырьки кислорода.", "The purple solution turns colourless; oxygen bubbles form.") },
    { r: ["KMnO4", "FeSO4", "H2SO4"], e: [[[2, "KMnO4"], [10, "FeSO4"], [8, "H2SO4"]], [[1, "K2SO4"], [2, "MnSO4"], [5, "Fe2(SO4)3"], [8, "H2O"]]], t: ["redox"], o: t3("Перманганат рангсизланади, эритма сарғаяди (Fe³⁺) — перманганатометрия асоси.", "Перманганат обесцвечивается, раствор желтеет (Fe³⁺) — основа перманганатометрии.", "Permanganate decolourises and the solution turns yellow (Fe³⁺) — basis of permanganometry.") },
    { r: ["KMnO4", "Na2SO3", "H2SO4"], e: [[[2, "KMnO4"], [5, "Na2SO3"], [3, "H2SO4"]], [[1, "K2SO4"], [2, "MnSO4"], [5, "Na2SO4"], [3, "H2O"]]], t: ["redox"], o: t3("Кислотали муҳитда: бинафша → рангсиз (Mn²⁺).", "В кислой среде: фиолетовый → бесцветный (Mn²⁺).", "Acidic medium: purple → colourless (Mn²⁺).") },
    { r: ["KMnO4", "Na2SO3", "H2O"], e: [[[2, "KMnO4"], [3, "Na2SO3"], [1, "H2O"]], [[2, "MnO2"], [3, "Na2SO4"], [2, "KOH"]]], t: ["redox"], o: t3("Нейтрал муҳитда: қўнғир MnO₂ чўкмаси.", "В нейтральной среде: бурый осадок MnO₂.", "Neutral medium: brown MnO₂ precipitate.") },
    { r: ["KMnO4", "Na2SO3", "NaOH"], e: [[[2, "KMnO4"], [1, "Na2SO3"], [2, "NaOH"]], [[1, "K2MnO4"], [1, "Na2MnO4"], [1, "Na2SO4"], [1, "H2O"]]], t: ["redox"], o: t3("Ишқорий муҳитда: бинафша → яшил (манганат MnO₄²⁻).", "В щелочной среде: фиолетовый → зелёный (манганат MnO₄²⁻).", "Alkaline medium: purple → green (manganate MnO₄²⁻).") },
    { r: ["K2Cr2O7", "C2H5OH", "H2SO4"], e: [[[1, "K2Cr2O7"], [3, "C2H5OH"], [4, "H2SO4"]], [[1, "Cr2(SO4)3"], [3, "CH3CHO"], [1, "K2SO4"], [7, "H2O"]]], t: ["redox"], o: t3("Тўқ сариқ эритма яшилланади (Cr³⁺) — эски «алкотестер» принципи.", "Оранжевый раствор зеленеет (Cr³⁺) — принцип старого «алкотестера».", "Orange turns green (Cr³⁺) — the classic breathalyser reaction.") },
    { r: ["Na2S2O3", "HCl"], e: [[[1, "Na2S2O3"], [2, "HCl"]], [[2, "NaCl"], [1, "S"], [1, "SO2"], [1, "H2O"]]], t: ["exch", "redox"], o: t3("Эритма аста-секин сариқ-оқ лойқаланади (олтингугурт), SO₂ ҳиди.", "Раствор постепенно мутнеет (жёлто-белая сера), запах SO₂.", "The solution slowly turns cloudy yellow-white (sulfur); smell of SO₂.") },
    { r: ["Na2S2O3", "H2SO4"], e: [[[1, "Na2S2O3"], [1, "H2SO4"]], [[1, "Na2SO4"], [1, "S"], [1, "SO2"], [1, "H2O"]]], t: ["exch", "redox"], o: t3("Олтингугурт лойқаси пайдо бўлади — реакция тезлигини ўрганишда ишлатилади.", "Появляется муть серы — опыт для изучения скорости реакции.", "Sulfur cloudiness appears — classic rate-of-reaction experiment.") },
    { r: ["FeCl3", "K4[Fe(CN)6]"], e: [[[4, "FeCl3"], [3, "K4[Fe(CN)6]"]], [[1, "Fe4[Fe(CN)6]3"], [12, "KCl"]]], t: ["exch", "complex"], o: t3("Тўқ кўк «Берлин зангориси» чўкмаси — Fe³⁺ га сифат реакцияси.", "Тёмно-синий осадок «берлинской лазури» — качественная реакция на Fe³⁺.", "Deep-blue Prussian blue precipitate — test for Fe³⁺.") },
    { r: ["FeSO4", "K3[Fe(CN)6]"], e: [[[3, "FeSO4"], [2, "K3[Fe(CN)6]"]], [[1, "Fe3[Fe(CN)6]2"], [3, "K2SO4"]]], t: ["exch", "complex"], o: t3("Кўк «Турнбулл кўки» чўкмаси — Fe²⁺ га сифат реакцияси.", "Синий осадок «турнбулевой сини» — качественная реакция на Fe²⁺.", "Blue Turnbull's blue precipitate — test for Fe²⁺.") },
    { r: ["I2", "(C6H10O5)n"], q: 1, t: ["complex"], col: "#1e3a8a", o: t3("Тўқ кўк ранг — йод-крахмал комплекси (крахмалга сифат реакция). Қиздирилса ранг йўқолади, совуганда қайтади.", "Тёмно-синее окрашивание — иод-крахмальный комплекс. При нагревании исчезает, при охлаждении возвращается.", "Deep blue — the iodine–starch complex. Fades on heating, returns on cooling.") },
    { r: ["CuSO4", "NH3·H2O"], e: [[[1, "CuSO4"], [4, "NH3·H2O"]], [[1, "[Cu(NH3)4]SO4"], [4, "H2O"]]], t: ["complex"], col: "#1d4ed8", o: t3("Аввал мовий Cu(OH)₂ чўкмаси, ортиқча аммиакда эриб тўқ кўк комплекс ҳосил бўлади.", "Сначала голубой осадок Cu(OH)₂, в избытке аммиака — ярко-синий комплекс.", "First a pale-blue Cu(OH)₂ precipitate, then a deep-blue complex in excess ammonia.") },
    { r: ["C6H12O6", "Cu(OH)2"], h: 1, e: [[[1, "C6H12O6"], [2, "Cu(OH)2"]], [[1, "C6H12O7"], [1, "Cu2O"], [2, "H2O"]]], t: ["redox"], o: t3("Қиздирилганда кўк чўкма → сариқ → ғишт-қизил Cu₂O (альдегид гуруҳига сифат реакция).", "При нагревании голубой осадок → жёлтый → кирпично-красный Cu₂O (реакция на альдегидную группу).", "On heating blue → yellow → brick-red Cu₂O (test for the aldehyde group).") },
    { r: ["C6H12O6", "CuSO4", "NaOH"], h: 1, e: [[[1, "C6H12O6"], [2, "CuSO4"], [4, "NaOH"]], [[1, "C6H12O7"], [1, "Cu2O"], [2, "Na2SO4"], [2, "H2O"]]], t: ["redox"], o: t3("Аввал кўк Cu(OH)₂, қиздирилганда ғишт-қизил Cu₂O чўкмаси (Троммер синови — қанд аниқлаш).", "Сначала голубой Cu(OH)₂, при нагревании — кирпично-красный Cu₂O (проба Троммера).", "First blue Cu(OH)₂, then brick-red Cu₂O on heating (Trommer's test for sugar).") },
    { r: ["C6H12O6", "AgNO3", "NH3·H2O"], h: 1, e: [[[1, "C6H12O6"], [2, "[Ag(NH3)2]OH"]], [[1, "C6H11O7NH4"], [2, "Ag"], [3, "NH3"], [1, "H2O"]]], t: ["redox"], o: t3("Идиш деворида ялтироқ «кумуш кўзгу» ҳосил бўлади (Толленс реакцияси).", "На стенках сосуда образуется блестящее «серебряное зеркало» (реакция Толленса).", "A shiny silver mirror forms on the glass (Tollens' test).") },
    { r: ["C12H22O11", "H2SO4c"], e: [[[1, "C12H22O11"]], [[12, "C"], [11, "H2O"]]], cat: "H₂SO₄ (конц.)", t: ["decomp"], o: t3("Шакар қораяди, кўпчиб «кўмир илони» ўсади, буғ ва SO₂ ҳиди (сувни тортиб олиш).", "Сахар чернеет, вспучивается «угольная змея», пар и запах SO₂ (водоотнимающее действие).", "The sugar blackens and a carbon 'snake' grows, with steam and an SO₂ smell (dehydration).") },
    { r: ["CaC2", "H2O"], e: [[[1, "CaC2"], [2, "H2O"]], [[1, "Ca(OH)2"], [1, "C2H2"]]], t: ["exch"], o: t3("Шиддатли пуфакчалар — ацетилен гази ажралади.", "Бурное выделение ацетилена.", "Vigorous fizzing as acetylene gas forms.") },
    { r: ["Na2O2", "H2O"], e: [[[2, "Na2O2"], [2, "H2O"]], [[4, "NaOH"], [1, "O2"]]], t: ["redox"], o: t3("Кислород ажралади, эритма ишқорий бўлади.", "Выделяется кислород, раствор становится щелочным.", "Oxygen is released and the solution turns alkaline.") },
    { r: ["Na2O2", "CO2"], e: [[[2, "Na2O2"], [2, "CO2"]], [[2, "Na2CO3"], [1, "O2"]]], t: ["redox"], o: t3("CO₂ ютилиб O₂ ажралади — сув ости кемаларида ҳавони тиклаш.", "CO₂ поглощается, выделяется O₂ — регенерация воздуха в подводных лодках.", "CO₂ is absorbed and O₂ released — air regeneration in submarines.") },
    { r: ["CH3COOH", "C2H5OH", "H2SO4c"], h: 1, e: [[[1, "CH3COOH"], [1, "C2H5OH"]], [[1, "CH3COOC2H5"], [1, "H2O"]]], cat: "H₂SO₄ (конц.)", eqm: 1, t: ["exch"], o: t3("Ёқимли мевали ҳид — этилацетат (эфирланиш, қайтар реакция).", "Приятный фруктовый запах — этилацетат (этерификация, обратимая реакция).", "A pleasant fruity smell — ethyl acetate (esterification, reversible).") },
    { r: ["Na", "C2H5OH"], e: [[[2, "Na"], [2, "C2H5OH"]], [[2, "C2H5ONa"], [1, "H2"]]], t: ["subst"], o: t3("Натрий тинч эриб водород чиқаради (сувга қараганда секинроқ).", "Натрий спокойно растворяется с выделением водорода (медленнее, чем в воде).", "Sodium dissolves calmly, releasing hydrogen (slower than in water).") },
    { r: ["C2H5OH", "H2SO4c"], h: 1, e: [[[1, "C2H5OH"]], [[1, "C2H4"], [1, "H2O"]]], cat: "H₂SO₄ (конц.), t > 170 °C", t: ["decomp"], o: t3("Этилен гази ажралади (дегидратация).", "Выделяется этилен (дегидратация).", "Ethylene gas is evolved (dehydration).") },
    { r: ["CH3COONa", "NaOH"], h: 1, e: [[[1, "CH3COONa"], [1, "NaOH"]], [[1, "CH4"], [1, "Na2CO3"]]], t: ["exch"], o: t3("Қуруқ аралашма қиздирилганда метан ажралади (лабораторияда CH₄ олиш).", "При нагревании сухой смеси выделяется метан (лабораторное получение CH₄).", "Heating the dry mixture gives methane (lab preparation of CH₄).") },
    { r: ["C17H35COONa", "CaCl2"], e: [[[2, "C17H35COONa"], [1, "CaCl2"]], [[1, "(C17H35COO)2Ca"], [2, "NaCl"]]], t: ["exch"], o: t3("Совун кўпикламайди, оқ «оҳак совуни» лойқаси — қаттиқ сув белгиси.", "Мыло не пенится, белые хлопья «известкового мыла» — признак жёсткой воды.", "No lather; white scum of 'lime soap' — sign of hard water.") },
    { r: ["C17H35COONa", "MgSO4"], e: [[[2, "C17H35COONa"], [1, "MgSO4"]], [[1, "(C17H35COO)2Mg"], [1, "Na2SO4"]]], t: ["exch"], o: t3("Оқ парчалар — магний совуни (қаттиқ сув).", "Белые хлопья — магниевое мыло (жёсткая вода).", "White flakes — magnesium soap (hard water).") },
    { r: ["Cu", "FeCl3"], e: [[[1, "Cu"], [2, "FeCl3"]], [[1, "CuCl2"], [2, "FeCl2"]]], t: ["redox"], o: t3("Мис эрийди, эритма яшил-кўк тусга киради (босма платаларни едириш).", "Медь растворяется, раствор зеленеет (травление печатных плат).", "Copper dissolves and the solution turns green-blue (etching circuit boards).") },
    { r: ["Fe", "FeCl3"], e: [[[1, "Fe"], [2, "FeCl3"]], [[3, "FeCl2"]]], t: ["redox", "comb"], o: t3("Сариқ-қўнғир эритма оч яшилга ўтади (Fe³⁺ → Fe²⁺).", "Жёлто-бурый раствор становится светло-зелёным (Fe³⁺ → Fe²⁺).", "Yellow-brown turns pale green (Fe³⁺ → Fe²⁺).") },
    { r: ["SO2", "H2S"], e: [[[1, "SO2"], [2, "H2S"]], [[3, "S"], [2, "H2O"]]], t: ["redox"], o: t3("Сариқ олтингугурт ажралади.", "Выделяется жёлтая сера.", "Yellow sulfur forms.") },
    { r: ["Cl2", "H2O"], e: [[[1, "Cl2"], [1, "H2O"]], [[1, "HCl"], [1, "HClO"]]], eqm: 1, t: ["redox"], o: t3("«Хлорли сув»: HClO рангли матони оқартиради ва микробларни ўлдиради.", "«Хлорная вода»: HClO отбеливает ткани и убивает микробов.", "'Chlorine water': HClO bleaches dyes and kills germs.") },
    { r: ["NO2", "H2O"], e: [[[3, "NO2"], [1, "H2O"]], [[2, "HNO3"], [1, "NO"]]], t: ["redox"], o: t3("Қўнғир газ ютилади — кислотали ёмғир ҳосил бўлиш йўли.", "Бурый газ поглощается — путь образования кислотных дождей.", "The brown gas dissolves — how acid rain forms.") },
    { r: ["NO2", "O2", "H2O"], e: [[[4, "NO2"], [1, "O2"], [2, "H2O"]], [[4, "HNO3"]]], t: ["comb", "redox"], o: t3("Нитрат кислота ҳосил бўлади (саноатда HNO₃ олиш).", "Образуется азотная кислота (промышленное получение HNO₃).", "Nitric acid forms (industrial HNO₃ production).") },
    { r: ["Mg", "CO2"], h: 1, e: [[[2, "Mg"], [1, "CO2"]], [[2, "MgO"], [1, "C"]]], t: ["redox", "burn"], o: t3("Магний CO₂ да ҳам ёнади: оқ MgO ва қора кўмир доғлари. Шунинг учун Mg ни CO₂ ўт ўчиргич билан ўчириб бўлмайди!", "Магний горит и в CO₂: белый MgO и чёрная сажа. Поэтому Mg нельзя тушить углекислотным огнетушителем!", "Magnesium burns even in CO₂: white MgO and black soot. Never fight a Mg fire with a CO₂ extinguisher!") },
    { r: ["CO2", "C"], h: 1, e: [[[1, "CO2"], [1, "C"]], [[2, "CO"]]], t: ["comb", "redox"], o: t3("Чўғланган кўмир устида CO₂ ис газига айланади (печда ис чиқишининг сабаби).", "Над раскалённым углём CO₂ превращается в угарный газ (причина угара в печах).", "Over hot coal CO₂ becomes carbon monoxide (why stoves produce CO).") },
    { r: ["N2", "H2"], h: 1, e: [[[1, "N2"], [3, "H2"]], [[2, "NH3"]]], cat: "Fe, 450 °C, 200 атм", eqm: 1, t: ["comb"], o: t3("Габер–Бош жараёни: аммиак (ўғитлар асоси).", "Процесс Габера–Боша: аммиак (основа удобрений).", "The Haber–Bosch process: ammonia (basis of fertilisers).") },
    { r: ["NH3", "O2"], h: 1, e: [[[4, "NH3"], [5, "O2"]], [[4, "NO"], [6, "H2O"]]], cat: "Pt", t: ["redox", "burn"], o: t3("Каталитик оксидланиш — нитрат кислота ишлаб чиқаришнинг 1-босқичи.", "Каталитическое окисление — 1-я стадия производства азотной кислоты.", "Catalytic oxidation — first step of nitric-acid production.") },
    { r: ["KI", "H2O2", "H2SO4"], e: [[[2, "KI"], [1, "H2O2"], [1, "H2SO4"]], [[1, "I2"], [1, "K2SO4"], [2, "H2O"]]], t: ["redox"], o: t3("Эритма сарғиш-қўнғир тусга киради (йод ажралади); крахмал қўшилса — кўк.", "Раствор буреет (выделяется иод); с крахмалом — синий.", "The solution turns yellow-brown (iodine); with starch — blue.") },
    { r: ["(NH4)2Cr2O7"], h: 1, e: [[[1, "(NH4)2Cr2O7"]], [[1, "Cr2O3"], [1, "N2"], [4, "H2O"]]], t: ["decomp", "redox"], o: t3("«Вулқон»: учқунлар отилиб, тўқ сариқ кристаллар яшил Cr₂O₃ «кулига» айланади.", "«Вулкан»: с искрами оранжевые кристаллы превращаются в зелёный «пепел» Cr₂O₃.", "The 'volcano': sparks fly and orange crystals turn into green Cr₂O₃ 'ash'.") },
    { r: ["CuSO4", "H2O"], e: [[[1, "CuSO4"], [5, "H2O"]], [[1, "CuSO4·5H2O"]]], t: ["comb"], col: "#2563eb", o: t3("Оқ сувсиз CuSO₄ сувдан кўкаради — сувни аниқлаш реакцияси.", "Белый безводный CuSO₄ синеет от воды — обнаружение воды.", "White anhydrous CuSO₄ turns blue with water — a test for water.") },
    { r: ["Al", "I2"], e: [[[2, "Al"], [3, "I2"]], [[2, "AlI3"]]], cat: "H₂O (томчи)", t: ["comb", "redox"], o: t3("Бир томчи сувдан сўнг бинафша йод буғи кўтарилади ва аралашма алангаланади.", "После капли воды поднимаются фиолетовые пары иода и смесь вспыхивает.", "After a drop of water violet iodine vapour rises and the mix flares up.") },
    { r: ["Hg", "S"], e: [[[1, "Hg"], [1, "S"]], [[1, "HgS"]]], t: ["comb"], o: t3("Тўкилган симобни олтингугурт кукуни билан «демеркуризация» қилиш: қора HgS.", "Демеркуризация пролитой ртути порошком серы: чёрный HgS.", "Cleaning up spilled mercury with sulfur powder: black HgS.") },
    { r: ["NH3", "HCl"], e: [[[1, "NH3"], [1, "HCl"]], [[1, "NH4Cl"]]], t: ["comb"], o: t3("Оқ «тутунсиз тутун» — NH₄Cl нинг майда кристаллари.", "Белый «дым без огня» — мелкие кристаллы NH₄Cl.", "White 'smoke without fire' — tiny NH₄Cl crystals.") },
    { r: ["C6H12O6"], h: 1, e: [[[1, "C6H12O6"]], [[6, "C"], [6, "H2O"]]], t: ["decomp"], o: t3("Аввал карамелланади, кейин қораяди — кўмирланиш.", "Сначала карамелизуется, затем обугливается.", "First it caramelises, then chars to carbon.") },
    { r: ["C12H22O11"], h: 1, e: [[[1, "C12H22O11"]], [[12, "C"], [11, "H2O"]]], t: ["decomp"], o: t3("Шакар эриб карамелга, кейин кўмирга айланади.", "Сахар плавится в карамель, затем обугливается.", "Sugar melts to caramel, then chars.") }
  ];

  /* ---------- 9. Реакция натижасини йиғиш ---------- */
  const fmtEq = (r, p, arrow) => r.map(([k, f]) => (k > 1 ? k : "") + pretty(f)).join(" + ") + " " + (arrow || "→") + " " + p.map(([k, f, mk]) => (k > 1 ? k : "") + pretty(f) + (mk || "")).join(" + ");
  const TYPEN = {
    neut: t3("Нейтралланиш", "Нейтрализация", "Neutralisation"), exch: t3("Алмашиниш", "Обмен", "Exchange"), subst: t3("Ўрин олиш", "Замещение", "Displacement"),
    comb: t3("Бирикиш", "Соединение", "Combination"), decomp: t3("Парчаланиш", "Разложение", "Decomposition"), redox: t3("Оксидланиш-қайтарилиш", "Окислительно-восстановительная", "Redox"),
    burn: t3("Ёниш", "Горение", "Combustion"), complex: t3("Комплекс ҳосил бўлиши", "Комплексообразование", "Complex formation"), cat: t3("Каталитик", "Каталитическая", "Catalytic"), hydr: t3("Гидролиз / гидратланиш", "Гидролиз / гидратация", "Hydrolysis / hydration")
  };

  /* Тенгламани тузиш: реагент ва маҳсулот формулалари → коэффициентлар; керак бўлса сув қўшилади */
  function mkEq(rf, pf) {
    let k = balance(rf, pf);
    if (k) return [rf.map((f, i) => [k[i], f]), pf.map((f, i) => [k[rf.length + i], f])];
    if (!rf.includes("H2O")) { k = balance(rf.concat("H2O"), pf); if (k) return [rf.concat("H2O").map((f, i) => [k[i], f]), pf.map((f, i) => [k[rf.length + 1 + i], f])]; }
    if (!pf.includes("H2O")) { k = balance(rf, pf.concat("H2O")); if (k) return [rf.map((f, i) => [k[i], f]), pf.concat("H2O").map((f, i) => [k[rf.length + i], f])]; }
    return null;
  }
  /* Ион шакли: эрийдиган кучли электролит → ионлар */
  function ionsOf(f) {
    const s = SUBS.find((x) => x.f === f && !x.conc);
    if (!s || !(s.cat && s.an)) return null;
    if (!(isSolubleStrong(s) || (s.cls === "base" && s.sol === "M" && s.cat === "Ca"))) return null;
    const c = CAT[s.cat], a = AN[s.an], g = gcd(c.q, a.q);
    const ionF = (x, q, sg) => x.f + "^" + (q > 1 ? q : "") + sg;
    return [[a.q / g, ionF(c, c.q, "+")], [c.q / g, ionF(a, a.q, "-")]];
  }
  /* Тўлиқ ва қисқа ионли тенглама */
  function ionic(eq) {
    const side = (list) => { const out = []; list.forEach(([k, f, mk]) => { const io = mk ? null : ionsOf(f); if (io) io.forEach(([n, x]) => out.push([k * n, x])); else out.push([k, f, mk]); }); return out; };
    const L = side(eq[0]), Rr = side(eq[1]);
    if (L.length === eq[0].length && Rr.length === eq[1].length) return null;
    const cnt = (arr) => { const m = {}; arr.forEach(([k, f, mk]) => { const key = f + "|" + (mk || ""); m[key] = (m[key] || 0) + k; }); return m; };
    const a = cnt(L), b = cnt(Rr);
    for (const key in a) if (b[key] && key.includes("^")) { const m = Math.min(a[key], b[key]); a[key] -= m; b[key] -= m; }
    const toArr = (m) => Object.entries(m).filter(([, k]) => k > 0).map(([key, k]) => { const [f, mk] = key.split("|"); return [k, f, mk]; });
    let sa = toArr(a), sb = toArr(b);
    if (!sa.length || !sb.length) return { full: fmtEq(L, Rr) };
    const g = sa.concat(sb).reduce((x, [k]) => gcd(x, k), 0);
    sa = sa.map(([k, f, mk]) => [k / g, f, mk]); sb = sb.map(([k, f, mk]) => [k / g, f, mk]);
    return { full: fmtEq(L, Rr), net: fmtEq(sa, sb) };
  }
  function result(rf, pf, types, opt = {}) {
    const eq = opt.eq ? [opt.eq[0].map((x) => x.slice()), opt.eq[1].map((x) => x.slice())] : mkEq(rf, pf);
    if (!eq) return { ok: false, why: "bal" };
    const aqm = !!opt.aq;
    eq[1].forEach((x) => { const inf = prodInfo(x[1], aqm); x[2] = opt.plain && !inf.gas ? "" : inf.mark; x.push(inf); });
    const out = { ok: true, eq, types, obs: opt.obs ? [opt.obs] : [], heat: opt.heat, cat: opt.cat, eqm: opt.eqm, col: opt.col, note: opt.note || null, exo: opt.exo };
    out.text = fmtEq(eq[0], eq[1].map(([k, f, mk]) => [k, f, mk]), opt.eqm ? "⇄" : opt.cat || opt.heat ? "→" : "→");
    if (aqm && !opt.noIon) out.ion = ionic([eq[0], eq[1].map(([k, f, mk]) => [k, f, mk])]);
    return out;
  }
  const NO = (why, extra) => Object.assign({ ok: false, why }, extra || {});

  /* ---------- 10. Умумий реакция қоидалари ---------- */
  const aqLike = (s) => s.cls === "acid" || ((s.cls === "salt" || s.cls === "base") && s.sol === "R") || s.id === "NH3·H2O";
  const metalE = (s) => s && s.cls === "metal" && E0[s.el];
  const halogenRank = { F2: 0, Cl2: 1, Br2: 2, I2: 3 };
  const halideAn = { F2: "F", Cl2: "Cl", Br2: "Br", I2: "I" };

  function exchange(A, B, cond = {}) {
    /* Иккита эрувчан (ёки кислота билан эрийдиган) модда орасидаги ион алмашиниш */
    const c1 = A.cat, a1 = A.an, c2 = B.cat, a2 = B.an;
    if (!c1 || !c2) return null;
    const isAcid = (s) => s.cat === "H";
    const isBase = (s) => s.an === "OH";
    if (isAcid(A) && isAcid(B)) return NO("acids");
    if (isBase(A) && isBase(B)) return NO("bases");
    if (c1 === c2 && !((a1 === "HCO3" && a2 === "OH") || (a2 === "HCO3" && a1 === "OH"))) return NO("common");
    if (a1 === a2) return NO("common");
    /* Махсус ион жуфтликлари (гидролиз, оксидланиш-қайтарилиш, комплекс) */
    const pair = (ck, ak) => (c1 === ck && a2 === ak) || (c2 === ck && a1 === ak);
    const other = (ck) => (c1 === ck ? [c2, a1, A, B] : [c1, a2, B, A]);
    const sp = (rf, pf, types, obs, o2) => result(rf, pf, types, Object.assign({ obs, aq: true }, o2 || {}));
    if (A.sol === "R" && B.sol === "R" && !isAcid(A) && !isAcid(B) && !isBase(A) && !isBase(B)) {
      for (const m of ["Fe3", "Al", "Cr"]) {
        if (pair(m, "CO3") || pair(m, "HCO3")) { const [oc, , ms, cs] = other(m); return sp([ms.f, cs.f], [saltF(m, "OH"), "CO2", saltF(oc, ms.an)], ["exch", "hydr"], t3("Чўкма ва CO₂ пуфакчалари: карбонат ҳосил бўлмайди — тўлиқ гидролиз.", "Осадок и пузырьки CO₂: карбонат не образуется — полный гидролиз.", "A precipitate and CO₂ bubbles: no carbonate forms — complete hydrolysis.")); }
        if (pair(m, "S") && m !== "Fe3") { const [oc, , ms, cs] = other(m); return sp([ms.f, cs.f], [saltF(m, "OH"), "H2S", saltF(oc, ms.an)], ["exch", "hydr"], t3("Оқ/яшил чўкма ва H₂S ҳиди — тўлиқ гидролиз.", "Осадок и запах H₂S — полный гидролиз.", "A precipitate and H₂S smell — complete hydrolysis.")); }
        if (pair(m, "SO3")) { const [oc, , ms, cs] = other(m); return sp([ms.f, cs.f], [saltF(m, "OH"), "SO2", saltF(oc, ms.an)], ["exch", "hydr"], t3("Чўкма ва SO₂ — тўлиқ гидролиз.", "Осадок и SO₂ — полный гидролиз.", "A precipitate and SO₂ — complete hydrolysis.")); }
      }
      if (pair("Fe3", "S")) { const [oc, , ms, cs] = other("Fe3"); return sp([ms.f, cs.f], ["FeS", "S", saltF(oc, ms.an)], ["exch", "redox"], t3("Қора FeS ва сариқ олтингугурт: Fe³⁺ сульфидни оксидлайди.", "Чёрный FeS и жёлтая сера: Fe³⁺ окисляет сульфид.", "Black FeS and yellow sulfur: Fe³⁺ oxidises sulfide.")); }
      if (pair("Cu", "CO3")) { const [oc, , ms, cs] = other("Cu"); return sp([ms.f, cs.f], ["(CuOH)2CO3", "CO2", saltF(oc, ms.an)], ["exch", "hydr"], t3("Яшил асосли мис карбонати (малахит) чўкмаси ва CO₂.", "Зелёный осадок основного карбоната меди (малахит) и CO₂.", "Green basic copper carbonate (malachite) and CO₂.")); }
      if (pair("Cu", "I")) { const [oc, , ms, cs] = other("Cu"); return sp([ms.f, cs.f], ["CuI", "I2", saltF(oc, ms.an)], ["exch", "redox"], t3("Оқиш CuI чўкмаси ва қўнғир йод: Cu²⁺ йодидни оксидлайди.", "Белёсый осадок CuI и бурый иод: Cu²⁺ окисляет иодид.", "Off-white CuI and brown iodine: Cu²⁺ oxidises iodide.")); }
      if (pair("Fe3", "I")) { const [oc, , ms, cs] = other("Fe3"); return sp([ms.f, cs.f], [saltF("Fe2", ms.an), "I2", saltF(oc, ms.an)], ["redox"], t3("Эритма қўнғирлашади — йод ажралади (Fe³⁺ → Fe²⁺).", "Раствор буреет — выделяется иод (Fe³⁺ → Fe²⁺).", "The solution browns — iodine forms (Fe³⁺ → Fe²⁺).")); }
      if (pair("Fe3", "SCN")) { const [oc, , ms, cs] = other("Fe3"); return sp([ms.f, cs.f], ["Fe(SCN)3", saltF(oc, ms.an)], ["complex"], t3("Қон-қизил ранг — Fe³⁺ га энг сезгир сифат реакция.", "Кроваво-красное окрашивание — самая чувствительная реакция на Fe³⁺.", "Blood-red colour — the most sensitive test for Fe³⁺."), { col: "#991b1b" }); }
    }
    /* Кумуш ва симоб гидроксидлари беқарор → оксид */
    for (const [m, ox] of [["Ag", "Ag2O"], ["Hg", "HgO"]]) {
      if ((c1 === m && a2 === "OH" && A.sol === "R" && B.sol === "R") || (c2 === m && a1 === "OH" && A.sol === "R" && B.sol === "R")) {
        const [oc, , ms, cs] = other(m);
        return sp([ms.f, cs.f], [ox, saltF(oc, ms.an), "H2O"], ["exch"], m === "Ag" ? t3("Қўнғир Ag₂O чўкмаси (AgOH беқарор).", "Бурый осадок Ag₂O (AgOH неустойчив).", "Brown Ag₂O precipitate (AgOH is unstable).") : t3("Сариқ HgO чўкмаси.", "Жёлтый осадок HgO.", "Yellow HgO precipitate."));
      }
    }
    /* Маҳсулотлар: c1+a2, c2+a1 */
    const s1 = solOf(c1, a2), s2 = solOf(c2, a1);
    const f1 = c1 === "H" ? saltF("H", a2) : saltF(c1, a2), f2 = c2 === "H" ? saltF("H", a1) : saltF(c2, a1);
    const prods = [];
    let driving = [], types = ["exch"], exo = false, notes = [];
    const addP = (ck, ak, f, s) => {
      if (ck === "H" && ak === "OH") { prods.push("H2O"); driving.push("water"); return; }
      if (ck === "H") { const d = { CO3: ["CO2", "H2O"], HCO3: ["CO2", "H2O"], SO3: ["SO2", "H2O"] }[ak]; if (d) { prods.push(...d); driving.push("gas"); return; } if (ak === "S") { prods.push("H2S"); driving.push("gas"); return; } prods.push(f); if (ak === "SiO3") driving.push("ppt"); else if ((PKA[ak] ?? -9) > 1) driving.push("weak"); return; }
      if (ck === "NH4" && ak === "OH") { prods.push("NH3", "H2O"); driving.push("gas"); notes.push(t3("NH₃ айниқса қиздирилганда ажралади.", "NH₃ выделяется особенно при нагревании.", "NH₃ is released especially on heating.")); return; }
      if (s === "-" || s === "x") { prods.push(null); return; }
      prods.push(f);
      if (s === "N" || s === "M") driving.push("ppt");
    };
    addP(c1, a2, f1, s1); addP(c2, a1, f2, s2);
    if (prods.includes(null)) return NO("model");
    const acidOf = (s) => (s.cat === "H" ? s : null);
    const acid = acidOf(A) || acidOf(B), base = isBase(A) ? A : isBase(B) ? B : null;
    const salt = !isAcid(A) && !isBase(A) ? A : !isAcid(B) && !isBase(B) ? B : null;
    /* Кислота + асос — нейтралланиш */
    if (acid && base) {
      if (base.sol !== "R" && acid.an === "SiO3") return NO("weak");
      if (base.sol !== "R" && acid.an === "CO3") return NO("weak");
      types = ["neut", "exch"]; exo = true;
      if (base.sol !== "R") notes.push(t3("Эримайдиган асос кислотада эрийди.", "Нерастворимое основание растворяется в кислоте.", "The insoluble base dissolves in the acid."));
    } else if (acid && salt) {
      /* Кислота + туз; оксидловчи кислоталар сульфид, сульфит ва йодидни оксидлайди */
      if (acid.an === "NO3" && ["S", "SO3", "I"].includes(salt.an) && salt.sol === "R") {
        const pf = salt.an === "S" ? [saltF(salt.cat, "NO3"), "S", acid.conc ? "NO2" : "NO", "H2O"] : salt.an === "SO3" ? [saltF(salt.cat, "SO4"), acid.conc ? "NO2" : "NO", "H2O"] : [saltF(salt.cat, "NO3"), "I2", acid.conc ? "NO2" : "NO", "H2O"];
        const r = result([salt.f, "HNO3"], pf, ["redox"], { aq: true, noIon: true, obs: t3("Нитрат кислота оксидловчи: H₂S/SO₂/HI ўрнига S, SO₄²⁻ ёки I₂ ҳосил бўлади.", "Азотная кислота — окислитель: вместо H₂S/SO₂/HI образуются S, SO₄²⁻ или I₂.", "Nitric acid is an oxidant: S, SO₄²⁻ or I₂ form instead of H₂S/SO₂/HI.") });
        return r;
      }
      if (acid.conc) {
        if (["Br", "I", "S", "SO3"].includes(salt.an)) return NO("model");
        if (["Cl", "F", "NO3"].includes(salt.an) && acid.an === "SO4") {
          if (!cond.heat) return NO("needheat");
          return result([salt.f, "H2SO4"], [saltF(salt.cat, "SO4"), "H" + (salt.an === "NO3" ? "NO3" : salt.an)], ["exch"], { heat: 1, obs: t3("Қаттиқ туз + конц. H₂SO₄ қиздирилганда учувчан кислота ажралади (лабораторияда HCl/HF/HNO₃ олиш).", "Твёрдая соль + конц. H₂SO₄ при нагревании: выделяется летучая кислота (получение HCl/HF/HNO₃).", "Solid salt + conc. H₂SO₄ on heating releases a volatile acid (lab HCl/HF/HNO₃).") });
        }
      }
      const newAcid = a1 === acid.an ? a2 : a1; /* тузнинг аниони */
      const ppt = c1 === "H" ? [c2, acid.an] : [c1, acid.an];
      const pptF = saltF(ppt[0], ppt[1]), pptS = solOf(ppt[0], ppt[1]);
      const gas = ["CO3", "HCO3", "SO3", "S"].includes(newAcid);
      const weaker = (PKA[acid.an] ?? 0) < (PKA[newAcid] ?? 0) - 0.5;
      const pptStable = (pptS === "N" || pptS === "M") && (ACIDSTABLE.includes(pptF) || !STRONG_AC.includes(newAcid) && (PKA[newAcid] ?? 0) > (PKA[acid.an] ?? 0));
      if (salt.sol !== "R") {
        /* Эримайдиган туз фақат кучлироқ кислотада эрийди */
        if (ACIDSTABLE.includes(salt.f)) return NO("acidstable", { f: salt.f });
        if (!(gas || weaker)) return NO("weak");
        if ((pptS === "N" || pptS === "M") && !ACIDSTABLE.includes(pptF)) return NO("weak");
        if (pptS === "N" && ACIDSTABLE.includes(pptF)) notes.push(t3("Сиртда эримайдиган қатлам ҳосил бўлиб, реакция секинлашади.", "На поверхности образуется нерастворимый слой — реакция замедляется.", "An insoluble layer forms on the surface and slows the reaction."));
      } else if (!(gas || weaker || pptStable)) return NO("ions");
      if (ACIDSTABLE.indexOf(pptF) < 0 && (pptS === "N" || pptS === "M") && STRONG_AC.includes(newAcid)) return NO("ions");
    } else if (base && salt) {
      /* Ишқор + туз: ишқор эрувчан, туз эрувчан бўлиши шарт */
      if (base.sol === "N") return NO("insbase");
      if (salt.sol !== "R") return NO("inssalt");
      if (salt.an === "HCO3") {
        /* Нордон туз + ишқор → ўрта туз (карбонат) */
        const pf = uniq([saltF(salt.cat, "CO3"), saltF(base.cat, "CO3")]).concat("H2O");
        const r = result([salt.f, base.f], pf, ["neut"], { aq: true, obs: salt.cat === "Ca" || salt.cat === "Mg" ? t3("Оҳак ёки ишқор қўшилганда CaCO₃ чўкади — сувни юмшатиш (вақтинчалик қаттиқлик).", "При добавлении извести или щёлочи выпадает CaCO₃ — умягчение воды.", "Adding lime or alkali precipitates CaCO₃ — water softening.") : t3("Нордон туз ишқор билан ўрта тузга айланади.", "Кислая соль со щёлочью превращается в среднюю.", "The acid salt becomes a normal salt with the alkali.") });
        return r;
      }
      if (!driving.length) return NO("ions");
      if (["Al", "Zn", "Cr", "Pb", "Sn"].includes(salt.cat)) notes.push(t3("Амфотер гидроксид: ортиқча ишқорда қайта эрийди.", "Амфотерный гидроксид: растворяется в избытке щёлочи.", "Amphoteric hydroxide: redissolves in excess alkali."));
      if (base.id === "NH3·H2O" && ["Cu", "Ni", "Zn", "Ag", "Co", "Cd"].includes(salt.cat)) notes.push(t3("Ортиқча аммиакда чўкма эриб, аммиакат комплекс ҳосил бўлади.", "В избытке аммиака осадок растворяется с образованием аммиаката.", "In excess ammonia the precipitate dissolves as an ammine complex."));
    } else {
      /* Туз + туз */
      if (A.sol !== "R" || B.sol !== "R") return NO("inssalt");
      if (!driving.length) return NO("ions");
    }
    if (!driving.length && !(acid && base)) return NO("ions");
    const obs = [];
    const r = result([A.f, B.f], prods, types, { aq: true, exo, note: notes });
    if (!r.ok) return r;
    r.notes = notes;
    if (acid && base) obs.push(t3("Иссиқлик ажралади (нейтралланиш: −57 кЖ/моль H₂O, кучли кислота + ишқор).", "Выделяется тепло (нейтрализация: −57 кДж/моль H₂O для сильных кислоты и щёлочи).", "Heat is released (neutralisation: −57 kJ per mol H₂O for strong acid + strong base)."));
    r.obs = obs.concat(r.obs);
    return r;
  }

  /* Металл + модда */
  function metalWith(M, X, cond) {
    const e = M.el, [E, q] = E0[e] || [];
    if (E == null) return NO("model");
    const ck = cation(e, q);
    /* Сув */
    if (X.id === "H2O") {
      if (WATER_M.includes(e)) return result([M.f, "H2O"], [saltF(ck, "OH"), "H2"], ["subst", "redox"], { aq: true, exo: true, plain: true, obs: ["Na", "K", "Rb", "Cs"].includes(e) ? t3("Металл сув юзасида чопиб юради, вишиллайди; K — бинафша алангада ёнади. Эритма ишқорий.", "Металл бегает по воде с шипением; K загорается фиолетовым пламенем. Раствор щелочной.", "The metal darts on the water and fizzes; K ignites with a lilac flame. The solution is alkaline.") : t3("Водород пуфакчалари, эритма ишқорий бўлади.", "Пузырьки водорода, раствор становится щелочным.", "Hydrogen bubbles; the solution turns alkaline.") });
      if (e === "Mg") return cond.heat ? result(["Mg", "H2O"], ["Mg(OH)2", "H2"], ["subst", "redox"], { aq: true, obs: t3("Қайноқ сувда секин водород ажралади.", "В горячей воде медленно выделяется водород.", "Hydrogen slowly forms in hot water.") }) : NO("needheat");
      if (["La", "Ce", "Pr", "Nd", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Y", "Sc"].includes(e)) return result([M.f, "H2O"], [saltF(ck, "OH"), "H2"], ["subst", "redox"], { aq: true, obs: t3("Секин водород ажралади (совуқ сувда суст).", "Медленно выделяется водород.", "Hydrogen forms slowly.") });
      if (e === "Fe") return NO("slow", { obs: t3("Совуқ сувда сезиларли реакция йўқ; намлик ва O₂ иштирокида аста-секин занглайди: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃.", "В холодной воде заметной реакции нет; во влажном воздухе медленно ржавеет: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃.", "No visible reaction in cold water; in moist air it slowly rusts: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃.") });
      return NO("noreact", { obs: t3("Металл сув билан реакцияга киришмайди (активлик қаторида Mg дан кейин).", "Металл с водой не реагирует (в ряду активности правее Mg).", "The metal does not react with water (it is below Mg in the activity series).") });
    }
    /* Кислоталар */
    if (X.cls === "acid") {
      const an = X.an;
      if (X.conc && an === "NO3") {
        if (["Fe", "Al", "Cr"].includes(e) && !cond.heat) return NO("passive");
        if (["Au", "Pt", "Ir", "Rh", "Os", "Ru"].includes(e)) return NO("noble");
        const c2 = e === "Fe" ? "Fe3" : e === "Cr" ? "Cr" : ck;
        if (e === "Sn") return result(["Sn", "HNO3"], ["H2SnO3", "NO2", "H2O"], ["redox"], { aq: true, noIon: true, obs: t3("Қўнғир NO₂ гази, оқ β-қалай кислотаси.", "Бурый NO₂, белая β-оловянная кислота.", "Brown NO₂ and white β-stannic acid.") });
        return result([M.f, "HNO3"], [saltF(c2, "NO3"), "NO2", "H2O"], ["redox"], { aq: true, noIon: true, exo: true, obs: t3("Шиддатли реакция, қўнғир NO₂ гази чиқади (заҳарли — тортиш шкафида!).", "Бурная реакция, выделяется бурый NO₂ (ядовит — под тягой!).", "Vigorous reaction with brown NO₂ gas (toxic — use a fume hood!).") });
      }
      if (an === "NO3") {
        if (["Au", "Pt", "Ir", "Rh", "Os", "Ru", "Pd"].includes(e)) return NO("noble");
        const c2 = e === "Fe" ? "Fe3" : e === "Cr" ? "Cr" : ck;
        return result([M.f, "HNO3"], [saltF(c2, "NO3"), "NO", "H2O"], ["redox"], { aq: true, noIon: true, obs: t3("Рангсиз NO ажралади, идиш оғзида ҳаво билан қўнғирлашади. Нитрат кислота металлар билан водород бермайди!", "Выделяется бесцветный NO, буреющий на воздухе у горлышка. Азотная кислота с металлами водород не даёт!", "Colourless NO forms and browns in air at the mouth. Nitric acid never gives hydrogen with metals!"), note: [t3("Суюлтириш даражаси ва металл активлигига қараб NO₂, NO, N₂O, N₂ ёки NH₄NO₃ ҳам ҳосил бўлиши мумкин; бу ерда асосий маҳсулот кўрсатилган.", "В зависимости от концентрации и активности металла возможны NO₂, NO, N₂O, N₂ или NH₄NO₃; здесь показан основной продукт.", "Depending on dilution and metal activity NO₂, NO, N₂O, N₂ or NH₄NO₃ may form; the main product is shown.")] });
      }
      if (X.conc && an === "SO4") {
        if (["Fe", "Al", "Cr"].includes(e) && !cond.heat) return NO("passive");
        if (["Au", "Pt", "Ir", "Rh", "Os", "Ru"].includes(e)) return NO("noble");
        if (!cond.heat && E > 0) return NO("needheat");
        const c2 = e === "Fe" ? "Fe3" : e === "Cr" ? "Cr" : ck;
        return result([M.f, "H2SO4"], [saltF(c2, "SO4"), "SO2", "H2O"], ["redox"], { noIon: true, obs: t3("SO₂ гази ажралади (ўткир ҳид); водород эмас!", "Выделяется SO₂ (резкий запах); не водород!", "SO₂ gas forms (sharp smell) — not hydrogen!"), note: [t3("Актив металлар (Zn, Mg) билан S ёки H₂S ҳам ҳосил бўлиши мумкин.", "С активными металлами (Zn, Mg) возможны также S или H₂S.", "With active metals (Zn, Mg) S or H₂S may also form.")] });
      }
      if (E >= 0) return NO("afterH", { e });
      if (PASSIVE.includes(e)) return NO("film");
      if (an === "SiO3") return NO("weak");
      const sOut = solOf(ck, an);
      if (sOut === "N" && ["Pb"].includes(e)) return NO("film", { obs: t3("Қўрғошин сиртида эримайдиган PbCl₂/PbSO₄ қатлами ҳосил бўлиб, реакция деярли тўхтайди.", "На свинце образуется нерастворимый слой PbCl₂/PbSO₄ — реакция почти сразу прекращается.", "An insoluble PbCl₂/PbSO₄ layer forms on lead and the reaction stops almost at once.") });
      const r = result([M.f, X.f], [saltF(ck, an), "H2"], ["subst", "redox"], { aq: true, exo: true, obs: e === "Al" ? t3("Аввал оксид парда эриши учун бироз кутилади, кейин шиддатли водород чиқади.", "Сначала растворяется оксидная плёнка, затем бурно выделяется водород.", "After a short delay (oxide film) hydrogen bubbles vigorously.") : t3("Водород пуфакчалари ажралади, металл эрийди.", "Выделяются пузырьки водорода, металл растворяется.", "Hydrogen bubbles form and the metal dissolves.") });
      if (WATER_M.includes(e)) r.obs.push(t3("Жуда шиддатли — ишқорий металлни кислотага ташлаш хавфли!", "Очень бурно — бросать щелочной металл в кислоту опасно!", "Extremely violent — never drop an alkali metal into acid!"));
      return r;
    }
    /* Туз эритмаси */
    if (X.cls === "salt" && X.sol === "R" && X.cat) {
      const sc = CAT[X.cat], sm = sc.f;
      if (sm === "NH4") return NO("ions");
      const E2 = E0[sm] ? (sm === "Fe" && sc.q === 3 ? 0.77 : E0[sm][0]) : null;
      if (E2 == null) return NO("model");
      if (WATER_M.includes(e)) {
        /* Ишқорий металл аввал сув билан реакцияга киришади */
        const oh = saltF(ck, "OH"), s = solOf(X.cat, "OH");
        if (s === "N") return result([M.f, "H2O", X.f], [saltF(X.cat, "OH"), saltF(ck, X.an), "H2"], ["subst", "exch"], { aq: true, noIon: true, obs: t3("Металл тузни эмас, аввал сувни сиқиб чиқаради: водород ва гидроксид чўкмаси.", "Металл сначала реагирует с водой: водород и осадок гидроксида.", "The metal reacts with the water first: hydrogen plus a hydroxide precipitate.") });
        return result([M.f, "H2O"], [oh, "H2"], ["subst"], { aq: true, obs: t3("Металл сув билан реакцияга киришади, туз ўзгармайди.", "Металл реагирует с водой, соль не меняется.", "The metal reacts with the water; the salt is unchanged.") });
      }
      if (sm === e) return NO("same");
      if (sc.q === 3 && sm === "Fe" && E < 0.77 && E >= -0.44 && !["Fe"].includes(e)) {
        /* Fe³⁺ — оксидловчи: Cu, Ni ва б. ни эритади (Fe²⁺ га айланади) */
        return result([M.f, X.f], [saltF(ck, X.an), saltF("Fe2", X.an)], ["redox"], { aq: true, obs: t3("Металл эрийди, Fe³⁺ қайтарилиб Fe²⁺ га айланади.", "Металл растворяется, Fe³⁺ восстанавливается до Fe²⁺.", "The metal dissolves and Fe³⁺ is reduced to Fe²⁺.") });
      }
      if (E >= E2 - 0.1) return NO("lessactive", { e, m: sm });
      if (PASSIVE.includes(e)) return NO("film");
      const prodSalt = saltF(ck, X.an), ps = solOf(ck, X.an);
      if (ps === "N" || ps === "M") return NO("film");
      const r = result([M.f, X.f], [prodSalt, sm], ["subst", "redox"], { aq: true, obs: { Cu: t3("Металл сирти қизғиш мис билан қопланади, кўк ранг сусаяди.", "Поверхность металла покрывается красной медью, синий цвет бледнеет.", "The metal gets a red-brown copper coat and the blue colour fades."), Ag: t3("Ялтироқ кумуш кристаллари «дарахт» бўлиб ўсади, эритма кўкаради.", "Растут блестящие кристаллы серебра («дерево»), раствор синеет.", "Shiny silver crystals grow like a tree; the solution turns blue."), Pb: t3("Кулранг қўрғошин «Сатурн дарахти» ўсади.", "Растёт серое «сатурново дерево» из свинца.", "A grey lead 'tree of Saturn' grows."), Hg: t3("Металл сиртида симоб томчилари (заҳарли!).", "На металле — капли ртути (ядовито!).", "Mercury droplets on the metal (toxic!).") }[sm] || t3("Фаолроқ металл тузидаги камроқ фаол металлни сиқиб чиқаради.", "Более активный металл вытесняет менее активный из соли.", "The more active metal displaces the less active one from its salt.") });
      return r;
    }
    if (X.cls === "salt" && X.sol !== "R") return NO("inssalt");
    /* Ишқор (амфотер металл) */
    if (X.cls === "base" && X.sol === "R" && ["Na", "K"].includes(X.cat)) {
      if (e === "Al") return result(["Al", X.f, "H2O"], [X.cat + "[Al(OH)4]", "H2"], ["redox"], { aq: true, noIon: true, obs: t3("Алюминий ишқорда эрийди, водород чиқади (амфотерлик).", "Алюминий растворяется в щёлочи с выделением водорода (амфотерность).", "Aluminium dissolves in alkali releasing hydrogen (amphoteric).") });
      if (e === "Zn") return result(["Zn", X.f, "H2O"], [X.cat + "2[Zn(OH)4]", "H2"], ["redox"], { aq: true, noIon: true, obs: t3("Рух ишқорда эрийди, водород чиқади.", "Цинк растворяется в щёлочи с выделением водорода.", "Zinc dissolves in alkali releasing hydrogen.") });
      if (e === "Be") return result(["Be", X.f, "H2O"], [X.cat + "2[Be(OH)4]", "H2"], ["redox"], { aq: true, noIon: true });
      return NO("noreact");
    }
    /* Кислород */
    if (X.id === "O2") {
      if (["Au", "Pt", "Ag", "Pd", "Ir", "Rh"].includes(e)) return NO("noble");
      const ox = BURN[e];
      if (!ox) return NO("model");
      if (!cond.heat && !["Li", "Na", "K", "Rb", "Cs"].includes(e)) return NO("needheat");
      return result([M.f, "O2"], [ox], ["comb", "redox", "burn"], { exo: true, heat: 1, obs: { Mg: t3("Кўзни қамаштирувчи оқ аланга, оқ MgO кукуни.", "Ослепительно белое пламя, белый порошок MgO.", "A blinding white flame and white MgO powder."), Fe: t3("Учқунлар сочилади (темир қуруми Fe₃O₄).", "Сыплются искры (железная окалина Fe₃O₄).", "Showers of sparks (magnetite Fe₃O₄)."), Na: t3("Сариқ аланга; асосий маҳсулот — пероксид Na₂O₂.", "Жёлтое пламя; основной продукт — пероксид Na₂O₂.", "Yellow flame; the main product is the peroxide Na₂O₂."), K: t3("Бинафша аланга; маҳсулот — супероксид KO₂.", "Фиолетовое пламя; продукт — надпероксид KO₂.", "Lilac flame; product is the superoxide KO₂."), Cu: t3("Мис сирти қораяди (CuO).", "Медь чернеет (CuO).", "Copper turns black (CuO)."), Ca: t3("Ғишт-қизил аланга.", "Кирпично-красное пламя.", "Brick-red flame."), Sr: t3("Тўқ қизил аланга (мушакбозлик).", "Карминово-красное пламя (фейерверки).", "Crimson flame (fireworks)."), Ba: t3("Оч яшил аланга.", "Светло-зелёное пламя.", "Pale green flame."), Li: t3("Тўқ қизил (карамин) аланга.", "Карминово-красное пламя.", "Crimson flame.") }[e] || t3("Металл ёниб оксидга айланади.", "Металл сгорает до оксида.", "The metal burns to its oxide.") });
    }
    /* Галогенлар */
    if (halogenRank[X.id] != null) {
      if (["Au", "Pt"].includes(e) && X.id !== "Cl2") return NO("noble");
      let q2 = q;
      if (["Fe", "Cr", "Co"].includes(e) && X.id !== "I2") q2 = 3;
      if (e === "Cu" && X.id !== "I2") q2 = 2;
      if (e === "Fe" && X.id === "I2") q2 = 2;
      if (e === "Sn" && X.id === "Cl2") q2 = 4;
      const ck2 = cation(e, q2);
      if (!cond.heat && !["Na", "K", "Rb", "Cs", "Al", "Sb"].includes(e)) return NO("needheat");
      const pf = saltF(ck2, halideAn[X.id]);
      return result([M.f, X.f], [pf], ["comb", "redox"], { exo: true, heat: 1, obs: t3("Металл галоген буғида ёниб, туз ҳосил қилади (оқ ёки рангли тутун).", "Металл горит в парах галогена с образованием соли (дым).", "The metal burns in the halogen forming a salt (smoke).") });
    }
    /* Олтингугурт */
    if (X.id === "S") {
      const pf = { Fe: "FeS", Zn: "ZnS", Cu: "Cu2S", Na: "Na2S", K: "K2S", Al: "Al2S3", Mg: "MgS", Ag: "Ag2S", Pb: "PbS", Ca: "CaS", Mn: "MnS", Ni: "NiS", Sn: "SnS", Cd: "CdS", Li: "Li2S", Ba: "BaS" }[e];
      if (!pf) return NO("model");
      if (!cond.heat) return NO("needheat");
      return result([M.f, "S"], [pf], ["comb", "redox"], { exo: true, heat: 1, obs: t3("Аралашма қизиб чўғланади — сульфид ҳосил бўлади (масса бўйича моддалар бирлашди).", "Смесь раскаляется — образуется сульфид.", "The mixture glows red-hot as the sulfide forms.") });
    }
    /* Азот, водород */
    if (X.id === "N2") { if (e === "Li") return result(["Li", "N2"], ["Li3N"], ["comb"], { obs: t3("Литий хона ҳароратида ҳам азот билан бирикади.", "Литий соединяется с азотом даже при комнатной температуре.", "Lithium combines with nitrogen even at room temperature.") }); if (e === "Mg" && cond.heat) return result(["Mg", "N2"], ["Mg3N2"], ["comb"], { heat: 1 }); return NO(cond.heat ? "noreact" : "needheat"); }
    if (X.id === "H2") { if (["Li", "Na", "K", "Ca"].includes(e)) return cond.heat ? result([M.f, "H2"], [e === "Ca" ? "CaH2" : e + "H"], ["comb", "redox"], { heat: 1, obs: t3("Металл гидриди ҳосил бўлади.", "Образуется гидрид металла.", "A metal hydride forms.") }) : NO("needheat"); return NO("noreact"); }
    /* Металл оксиди (металлотермия) */
    if (X.cls === "oxide" && X.m && E0[X.m]) {
      if (E >= E0[X.m][0] - 0.3 || X.m === e) return NO("lessactive", { e, m: X.m });
      if (!cond.heat) return NO("needheat");
      const ox = BURN[e];
      if (!ox) return NO("model");
      return result([M.f, X.f], [ox, X.m], ["subst", "redox"], { exo: true, heat: 1, obs: e === "Al" ? t3("Термит: оқ-сариқ аланга, 2500 °C, суюқ темир томчилари (рельс пайвандлаш).", "Термит: ослепительное пламя, 2500 °C, капли жидкого железа (сварка рельсов).", "Thermite: dazzling flame at 2500 °C with drops of molten iron (rail welding).") : t3("Фаолроқ металл оксиддан металлни қайтаради.", "Более активный металл восстанавливает металл из оксида.", "The more active metal reduces the oxide to metal.") });
    }
    if (X.id === "CO2" && e !== "Mg" && WATER_M.concat(["Al"]).includes(e)) return cond.heat ? NO("model") : NO("needheat");
    if (X.cls === "metal") return NO("alloy");
    if (X.cls === "noble") return NO("inert");
    return NO("model");
  }

  /* Нометалл + модда */
  function nonmetalWith(N, X, cond) {
    if (X.id === "O2") {
      if (N.id === "N2") return NO("lightning");
      if (halogenRank[N.id] != null) return NO("noreact", { obs: t3("Галогенлар кислород билан бевосита бирикмайди.", "Галогены с кислородом напрямую не соединяются.", "Halogens do not combine directly with oxygen.") });
      const ox = NBURN[N.id];
      if (!ox) return NO("model");
      if (!cond.heat) return NO("needheat");
      return result([N.f, "O2"], [ox], ["comb", "redox", "burn"], { exo: true, heat: 1, obs: { H2: t3("«Тарс» этган портлаш (қалдироқ газ 2:1) ёки рангсиз аланга; идиш деворида сув томчилари.", "Хлопок (гремучий газ 2:1) или бесцветное пламя; капли воды на стенках.", "A pop (2:1 oxyhydrogen) or a colourless flame; water droplets on the glass."), C: t3("Кўмир чўғланиб ёнади; кислород етишмаса — ис гази CO!", "Уголь горит; при недостатке кислорода — угарный газ CO!", "Carbon glows and burns; with too little oxygen — deadly CO!"), S: t3("Ҳаворанг кичик аланга, ўткир SO₂ ҳиди.", "Голубоватое пламя, резкий запах SO₂.", "A small blue flame and a sharp SO₂ smell."), P: t3("Ёрқин аланга ва қалин оқ тутун (P₂O₅).", "Яркое пламя и густой белый дым (P₂O₅).", "A bright flame and thick white smoke (P₂O₅).") }[N.id] || null });
    }
    if (halogenRank[N.id] != null) {
      if (halogenRank[X.id] != null) return NO("noreact");
      if (X.id === "H2") return result(["H2", N.f], ["H" + halideAn[N.id]], ["comb", "redox"], { exo: N.id !== "I2", obs: N.id === "Cl2" ? t3("Ёруғликда ёки қиздирилганда портлаш билан HCl ҳосил бўлади.", "На свету или при нагревании — со взрывом образуется HCl.", "In light or on heating HCl forms explosively.") : N.id === "F2" ? t3("Қоронғида ҳам портлаш билан.", "Со взрывом даже в темноте.", "Explosive even in the dark.") : null });
      if (X.cls === "salt" && X.sol === "R" && ["Cl", "Br", "I"].includes(X.an)) {
        const xr = { Cl: 1, Br: 2, I: 3 }[X.an];
        if (halogenRank[N.id] < xr) {
          const nh = { 1: "Cl2", 2: "Br2", 3: "I2" }[xr];
          return result([N.f, X.f], [saltF(X.cat, halideAn[N.id]), nh], ["subst", "redox"], { aq: true, obs: nh === "I2" ? t3("Эритма қўнғирлашади — йод ажралади (крахмал билан кўк).", "Раствор буреет — выделяется иод (с крахмалом синий).", "The solution turns brown — iodine is released (blue with starch).") : t3("Эритма тўқ сариқ-қўнғир — бром ажралади.", "Раствор оранжево-бурый — выделяется бром.", "The solution turns orange-brown — bromine is released.") });
        }
        return NO("lesshal");
      }
      if (X.cls === "base" && X.sol === "R" && N.id === "Cl2" && ["Na", "K"].includes(X.cat)) return result(["Cl2", X.f], [X.cat + "Cl", X.cat + "ClO", "H2O"], ["redox"], { aq: true, noIon: true, obs: t3("Совуқ ишқорда гипохлорит — «Жавел суви» (оқартиргич).", "В холодной щёлочи — гипохлорит, «жавелевая вода» (отбеливатель).", "Cold alkali gives hypochlorite — bleach.") });
    }
    if (N.id === "C" || N.id === "H2") {
      if (X.cls === "oxide" && X.m && E0[X.m]) {
        if (E0[X.m][0] < -0.8) return NO("lessactive", { e: N.id === "C" ? "C" : "H₂", m: X.m });
        if (!cond.heat) return NO("needheat");
        return result([N.f, X.f], [X.m, N.id === "C" ? "CO2" : "H2O"], ["redox"], { heat: 1, obs: X.m === "Cu" ? t3("Қора CuO қизғиш мисга айланади.", "Чёрный CuO превращается в красную медь.", "Black CuO turns into red copper.") : t3("Оксиддан металл қайтарилади (металлургия асоси).", "Металл восстанавливается из оксида (основа металлургии).", "The metal is reduced from its oxide (the basis of metallurgy).") });
      }
    }
    if (N.id === "C" && X.id === "H2SO4c") return cond.heat ? result(["C", "H2SO4"], ["CO2", "SO2", "H2O"], ["redox"], { heat: 1 }) : NO("needheat");
    if (N.id === "C" && X.id === "HNO3c") return cond.heat ? result(["C", "HNO3"], ["CO2", "NO2", "H2O"], ["redox"], { heat: 1 }) : NO("needheat");
    if (N.id === "S" && X.id === "HNO3c") return cond.heat ? result(["S", "HNO3"], ["H2SO4", "NO2", "H2O"], ["redox"], { heat: 1 }) : NO("needheat");
    if (N.id === "Si" && X.cls === "base" && ["Na", "K"].includes(X.cat)) return result(["Si", X.f, "H2O"], [X.cat + "2SiO3", "H2"], ["redox"], { aq: true, noIon: true });
    if (X.cls === "metal") return metalWith(X, N, cond);
    if (X.id === "H2O") return NO("noreact");
    return NO("model");
  }

  /* Оксидлар */
  function oxideWith(O, X, cond) {
    const k = O.ok;
    if (k === "n") return NO("neutralox");
    if (X.id === "H2O") {
      if (k === "b") {
        if (!WATER_M.concat(["Li"]).includes(O.m)) return NO("noreact", { obs: t3("Бу асосли оксид сувда эримайди ва у билан реакцияга киришмайди.", "Этот основный оксид в воде не растворяется и с ней не реагирует.", "This basic oxide is insoluble and does not react with water.") });
        return result([O.f, "H2O"], [saltF(O.m, "OH")], ["comb", "hydr"], { exo: true, aq: true, noIon: true, plain: true, obs: O.m === "Ca" ? t3("Оҳак «сўнади»: кучли қизиш, буғ (CaO + H₂O → Ca(OH)₂).", "Известь «гасится»: сильный разогрев, пар.", "Lime is slaked: strong heating and steam.") : t3("Ишқор ҳосил бўлади, иссиқлик ажралади.", "Образуется щёлочь, выделяется тепло.", "An alkali forms and heat is released.") });
      }
      if (k === "a") {
        if (O.f === "SiO2") return NO("noreact", { obs: t3("SiO₂ (қум) сувда эримайди — силикат кислота бевосита олинмайди.", "SiO₂ (песок) в воде не растворяется — кремниевую кислоту так не получить.", "SiO₂ (sand) does not dissolve — silicic acid cannot be made this way.") });
        if (O.f === "NO2") return react(["NO2", "H2O"], cond);
        const af = { CO2: "H2CO3", SO2: "H2SO3", SO3: "H2SO4", P2O5: "H3PO4", N2O5: "HNO3", CrO3: "H2CrO4", Cl2O7: "HClO4", B2O3: "H3BO3", SeO2: "H2SeO3" }[O.f];
        if (!af) return NO("model");
        return result([O.f, "H2O"], [af], ["comb", "hydr"], { eqm: O.f === "CO2" || O.f === "SO2", noIon: true, exo: O.f === "SO3" || O.f === "P2O5", obs: O.f === "CO2" ? t3("Кучсиз, беқарор карбонат кислота (газли сув); лакмус бироз қизаради.", "Слабая неустойчивая угольная кислота (газировка); лакмус слегка краснеет.", "Weak, unstable carbonic acid (soda water); litmus turns slightly red.") : t3("Кислота ҳосил бўлади — кислотали ёмғир шундай пайдо бўлади.", "Образуется кислота — так возникают кислотные дожди.", "An acid forms — this is how acid rain arises.") });
      }
      if (k === "am") return NO("noreact");
      return NO("model");
    }
    if (X.cls === "acid") {
      if (k === "b" || k === "am") {
        if (O.f === "Fe3O4" && !STRONG_AC.includes(X.an)) return NO("model");
        if (O.f === "Fe3O4") return result(["Fe3O4", X.f], [saltF("Fe2", X.an), saltF("Fe3", X.an), "H2O"], ["exch"], { aq: true, noIon: true });
        if (X.an === "SiO3" || X.an === "CO3") return NO("weak");
        if (O.f === "MnO2" || O.f === "TiO2" || O.f === "SnO2") return NO("model");
        const ck = cation(O.m, O.q);
        const ps = solOf(ck, X.an);
        if ((ps === "N") && !ACIDSTABLE.includes(saltF(ck, X.an))) return NO("weak");
        return result([O.f, X.f], [saltF(ck, X.an), "H2O"], ["exch"], { aq: true, exo: true, obs: O.f === "CuO" ? t3("Қора кукун эриб, мовий эритма ҳосил бўлади (қиздирилса тезроқ).", "Чёрный порошок растворяется, раствор голубеет (при нагревании быстрее).", "The black powder dissolves into a blue solution (faster when warm).") : O.f === "Fe2O3" ? t3("Занг эрийди, эритма сариқ-қўнғир.", "Ржавчина растворяется, раствор жёлто-бурый.", "Rust dissolves; the solution is yellow-brown.") : t3("Асосли оксид кислотада эриб туз ва сув ҳосил қилади.", "Основный оксид растворяется в кислоте с образованием соли и воды.", "The basic oxide dissolves in the acid giving a salt and water.") });
      }
      return NO("acidox");
    }
    if (X.cls === "base") {
      if (k === "a") {
        if (X.sol === "N") return NO("insbase");
        const an = O.aan;
        if (!AN[an]) return NO("model");
        if (O.f === "NO2") return result(["NO2", X.f], [saltF(X.cat, "NO3"), saltF(X.cat, "NO2"), "H2O"], ["redox"], { aq: true, noIon: true });
        if (O.f === "SiO2" && !cond.heat) return NO("needheat");
        const r = result([O.f, X.f], [saltF(X.cat, an), "H2O"], ["exch"], { aq: true, obs: O.f === "CO2" && X.cat === "Ca" ? t3("Оҳак суви лойқаланади (CaCO₃) — CO₂ га сифат реакция. Ортиқча CO₂ да лойқа яна эрийди (Ca(HCO₃)₂).", "Известковая вода мутнеет (CaCO₃) — качественная реакция на CO₂. В избытке CO₂ муть исчезает (Ca(HCO₃)₂).", "Limewater turns milky (CaCO₃) — the test for CO₂. With excess CO₂ it clears again (Ca(HCO₃)₂).") : t3("Кислотали оксид ишқор билан туз ва сув ҳосил қилади.", "Кислотный оксид с щёлочью даёт соль и воду.", "The acidic oxide and the alkali give a salt and water.") });
        return r;
      }
      if (k === "am" && X.sol === "R" && ["Na", "K"].includes(X.cat)) {
        if (O.f === "Al2O3") return result(["Al2O3", X.f, "H2O"], [X.cat + "[Al(OH)4]"], ["complex"], { aq: true, noIon: true, obs: t3("Амфотер оксид ишқорда эрийди (гидроксоалюминат).", "Амфотерный оксид растворяется в щёлочи (гидроксоалюминат).", "The amphoteric oxide dissolves in alkali (hydroxoaluminate).") });
        if (O.f === "ZnO") return result(["ZnO", X.f, "H2O"], [X.cat + "2[Zn(OH)4]"], ["complex"], { aq: true, noIon: true, obs: t3("Амфотер оксид ишқорда эрийди (гидроксоцинкат).", "Амфотерный оксид растворяется в щёлочи (гидроксоцинкат).", "The amphoteric oxide dissolves in alkali (hydroxozincate).") });
        return NO("model");
      }
      return NO("basicox");
    }
    if (X.cls === "oxide") {
      if (k === "b" && X.ok === "a" || k === "a" && X.ok === "b") {
        const b = k === "b" ? O : X, a = k === "b" ? X : O;
        if (b.f === "Fe3O4") return NO("model");
        if (!AN[a.aan]) return NO("model");
        if (!WATER_M.concat(["Li", "Mg"]).includes(b.m) && !cond.heat) return NO("needheat");
        if (a.f === "NO2") return NO("model");
        return result([b.f, a.f], [saltF(cation(b.m, b.q), a.aan)], ["comb"], { heat: cond.heat ? 1 : 0, obs: t3("Асосли ва кислотали оксид бирикиб туз ҳосил қилади.", "Основный и кислотный оксиды соединяются в соль.", "A basic and an acidic oxide combine into a salt.") });
      }
      return NO("noreact");
    }
    if (X.cls === "metal") return metalWith(X, O, cond);
    if (X.cls === "nonmetal") return nonmetalWith(X, O, cond);
    return NO("model");
  }

  /* Органик моддалар: ёниш */
  function organicBurn(Og) {
    const c = parse(Og.f.replace("(C6H10O5)n", "C6H10O5"));
    const keys = Object.keys(c);
    if (keys.some((k) => !["C", "H", "O", "N"].includes(k))) return NO("model");
    const pf = ["CO2", "H2O"].concat(c.N ? ["N2"] : []);
    const f = Og.f === "(C6H10O5)n" ? "C6H10O5" : Og.f;
    return result([f, "O2"], pf, ["burn", "redox"], { exo: true, heat: 1, obs: { C2H2: t3("Ёрқин, ис чиқарувчи аланга; кислородда 3000 °C (газ пайвандлаш).", "Яркое коптящее пламя; в кислороде 3000 °C (газовая сварка).", "A bright, sooty flame; 3000 °C in oxygen (gas welding)."), C2H5OH: t3("Кўкиш, деярли кўринмас аланга.", "Голубоватое, почти невидимое пламя.", "A bluish, almost invisible flame."), CH4: t3("Ҳаворанг аланга — газ плитаси.", "Голубое пламя — газовая плита.", "A blue flame — a gas cooker.") }[Og.f] || t3("Органик модда ёниб CO₂ ва H₂O га айланади.", "Органическое вещество сгорает до CO₂ и H₂O.", "The organic substance burns to CO₂ and H₂O.") });
  }

  /* Битта модда қиздирилганда (термик парчаланиш) */
  const DEC = {
    CaCO3: [["CaO", "CO2"], t3("900 °C: оҳак ва CO₂ (оҳак куйдириш, цемент саноати).", "900 °C: известь и CO₂ (обжиг извести, цемент).", "900 °C: lime and CO₂ (lime kilns, cement).")],
    MgCO3: [["MgO", "CO2"]], BaCO3: [["BaO", "CO2"]], ZnCO3: [["ZnO", "CO2"]], FeCO3: [["FeO", "CO2"]], PbCO3: [["PbO", "CO2"]], CdCO3: [["CdO", "CO2"]], MnCO3: [["MnO", "CO2"]], Ag2CO3: [["Ag", "CO2", "O2"]], SrCO3: [["SrO", "CO2"]],
    "(CuOH)2CO3": [["CuO", "CO2", "H2O"], t3("Яшил малахит қораяди (CuO), буғ ва CO₂.", "Зелёный малахит чернеет (CuO), пар и CO₂.", "Green malachite turns black (CuO) with steam and CO₂.")],
    NaHCO3: [["Na2CO3", "CO2", "H2O"], t3("Сода парчаланади — хамирни кўпчитиш шу реакцияга асосланган.", "Сода разлагается — на этом основан разрыхлитель теста.", "Baking soda decomposes — this is how it raises dough.")],
    KHCO3: [["K2CO3", "CO2", "H2O"]], "Ca(HCO3)2": [["CaCO3", "CO2", "H2O"], t3("Қайнатилганда қасмоқ (CaCO₃) чўкади — вақтинчалик қаттиқлик йўқолади.", "При кипячении выпадает накипь (CaCO₃) — устраняется временная жёсткость.", "Boiling deposits scale (CaCO₃) — removing temporary hardness.")], "Mg(HCO3)2": [["MgCO3", "CO2", "H2O"]],
    NH4Cl: [["NH3", "HCl"], t3("Возгонка каби: совуқ жойда яна NH₄Cl оқ қатлами ҳосил бўлади.", "Похоже на возгонку: в холодной части снова оседает белый NH₄Cl.", "Looks like sublimation: white NH₄Cl re-forms in the cool part.")],
    NH4HCO3: [["NH3", "CO2", "H2O"], t3("Қолдиқсиз парчаланади (қандолатчилик кўпчитгичи).", "Разлагается без остатка (кондитерский разрыхлитель).", "Decomposes completely (baker's ammonia).")],
    "(NH4)2CO3": [["NH3", "CO2", "H2O"]], NH4NO3: [["N2O", "H2O"], t3("Эҳтиёт бўлинг: кучли қизитилганда портлаши мумкин!", "Осторожно: при сильном нагреве может взорваться!", "Careful: strong heating can make it explode!")], NH4NO2: [["N2", "H2O"]],
    KMnO4: [["K2MnO4", "MnO2", "O2"], t3("Кислород ажралади (лабораторияда O₂ олиш).", "Выделяется кислород (лабораторное получение O₂).", "Oxygen is released (lab preparation of O₂).")],
    KClO3: [["KCl", "O2"], t3("400 °C дан юқорида (MnO₂ катализаторида 200 °C).", "Выше 400 °C (с катализатором MnO₂ — 200 °C).", "Above 400 °C (200 °C with MnO₂ catalyst).")],
    HgO: [["Hg", "O2"], t3("Пристли тажрибаси (1774): кислород кашфиёти. Симоб буғи заҳарли!", "Опыт Пристли (1774): открытие кислорода. Пары ртути ядовиты!", "Priestley's experiment (1774): discovery of oxygen. Mercury vapour is toxic!")],
    Ag2O: [["Ag", "O2"]], H2O2: [["H2O", "O2"], t3("Қиздирилганда ёки ёруғликда секин парчаланади.", "Медленно разлагается при нагревании или на свету.", "Slowly decomposes when heated or in light.")],
    "Cu(OH)2": [["CuO", "H2O"], t3("Мовий чўкма қораяди (CuO).", "Голубой осадок чернеет (CuO).", "The blue precipitate turns black (CuO).")], "Fe(OH)3": [["Fe2O3", "H2O"]], "Fe(OH)2": [["FeO", "H2O"]], "Al(OH)3": [["Al2O3", "H2O"]], "Zn(OH)2": [["ZnO", "H2O"]], "Mg(OH)2": [["MgO", "H2O"]], "Ca(OH)2": [["CaO", "H2O"]], "Ni(OH)2": [["NiO", "H2O"]], "Co(OH)2": [["CoO", "H2O"]], "Cr(OH)3": [["Cr2O3", "H2O"]], "Pb(OH)2": [["PbO", "H2O"]], "Mn(OH)2": [["MnO", "H2O"]], "Cd(OH)2": [["CdO", "H2O"]], "Sn(OH)2": [["SnO", "H2O"]],
    H2SiO3: [["SiO2", "H2O"]], "CuSO4·5H2O": [["CuSO4", "H2O"], t3("Кўк кристаллар оқаради — кристаллизация суви чиқиб кетади.", "Синие кристаллы белеют — уходит кристаллизационная вода.", "Blue crystals turn white as the water of crystallisation leaves.")],
    CuCO3: [["CuO", "CO2"]], Fe2O3: null
  };
  function decompose(s, cond) {
    if (!cond.heat) return NO("one");
    const sp = SP.find((x) => x.r.length === 1 && x.r[0] === s.id);
    if (sp) return fromSP(sp, cond);
    if (s.cls === "salt" && s.an === "NO3") {
      const m = CAT[s.cat].f, E = E0[m] ? E0[m][0] : null;
      if (s.cat === "NH4") return result([s.f], DEC.NH4NO3[0], ["decomp", "redox"], { heat: 1, obs: DEC.NH4NO3[1] });
      if (E == null) return NO("model");
      if (["Na", "K", "Rb", "Cs", "Ca", "Sr", "Ba"].includes(m)) return result([s.f], [saltF(s.cat, "NO2"), "O2"], ["decomp", "redox"], { heat: 1, obs: t3("Нитрит ва кислород (ишқорий металл нитрати).", "Нитрит и кислород (нитрат щелочного металла).", "A nitrite and oxygen (alkali-metal nitrate).") });
      if (E <= 0.34 || m === "Li") { const ox = { Mg: "MgO", Zn: "ZnO", Cu: "CuO", Pb: "PbO", Fe: s.cat === "Fe3" ? "Fe2O3" : "Fe2O3", Al: "Al2O3", Ni: "NiO", Co: "Co3O4", Mn: "MnO2", Cr: "Cr2O3", Cd: "CdO", Li: "Li2O", Sn: "SnO2" }[m]; if (!ox) return NO("model"); return result([s.f], [ox, "NO2", "O2"], ["decomp", "redox"], { heat: 1, obs: t3("Металл оксиди, қўнғир NO₂ ва O₂.", "Оксид металла, бурый NO₂ и O₂.", "Metal oxide, brown NO₂ and O₂.") }); }
      return result([s.f], [m, "NO2", "O2"], ["decomp", "redox"], { heat: 1, obs: t3("Соф металл, NO₂ ва O₂ (Cu дан ўнгдаги металлар нитрати).", "Чистый металл, NO₂ и O₂ (нитраты металлов правее Cu).", "The free metal, NO₂ and O₂ (nitrates of metals after Cu).") });
    }
    const d = DEC[s.f];
    if (d) return result([s.f], d[0], ["decomp"], { heat: 1, obs: d[1] || t3("Қиздирилганда парчаланади.", "При нагревании разлагается.", "Decomposes on heating.") });
    if (s.cls === "metal" || s.cls === "nonmetal") return NO("melt");
    if (s.cls === "salt" && s.sol === "R" && ["Cl", "Br", "SO4", "CO3", "PO4", "SiO3", "F", "I"].includes(s.an)) return NO("stable");
    if (s.cls === "oxide") return NO("stable");
    return NO("model");
  }
  function fromSP(sp, cond) {
    if (sp.h && !cond.heat) return NO("needheat");
    if (sp.q) return { ok: true, eq: null, types: sp.t, obs: [sp.o], col: sp.col, qual: true };
    const rf = sp.e[0].map(([, f]) => f), pf = sp.e[1].map(([, f]) => f);
    const aq = !["burn"].some((t) => sp.t.includes(t));
    return result(rf, pf, sp.t, { eq: sp.e, obs: sp.o, cat: sp.cat, heat: sp.h, eqm: sp.eqm, col: sp.col, aq: aq && rf.some((f) => SUBS.find((s) => s.f === f && aqLike(s))), noIon: true });
  }

  /* Эриш (сув + модда) */
  function dissolve(s) {
    if (s.cls === "salt" || s.cls === "base") {
      if (s.sol === "R") {
        const c = CAT[s.cat], a = AN[s.an], g = gcd(c.q, a.q);
        const wA = s.an && (PKA[s.an] ?? -9) > 2 && s.an !== "OH", wC = s.cat && ["NH4", "Fe3", "Fe2", "Al", "Cu", "Zn", "Pb", "Cr", "Mn", "Ni", "Co", "Hg", "Sn", "Cd", "Ag", "Mg"].includes(s.cat);
        const env = s.an === "OH" ? "alk" : wA && !wC ? "alk" : wC && !wA ? "acid" : wA && wC ? "both" : "neut";
        const diss = pretty(s.f) + " → " + (a.q / g > 1 ? a.q / g : "") + pretty(c.f + "^" + (c.q > 1 ? c.q : "") + "+") + " + " + (c.q / g > 1 ? c.q / g : "") + pretty(a.f + "^" + (a.q > 1 ? a.q : "") + "-");
        const hyd = env === "alk" && s.an !== "OH" ? pretty(a.f + "^" + (a.q > 1 ? a.q : "") + "-") + " + H₂O ⇄ " + (a.q > 1 ? pretty("H" + a.f + "^" + (a.q > 2 ? a.q - 1 : "") + "-") : pretty("H" + a.f)) + " + OH⁻" : env === "acid" ? pretty(c.f + "^" + (c.q > 1 ? c.q : "") + "+") + " + H₂O ⇄ " + (c.f === "NH4" ? "NH₃·H₂O" : pretty(c.f + "OH^" + (c.q > 2 ? c.q - 1 : "") + "+")) + " + H⁺" : null;
        return { ok: false, why: "dissolve", diss, env, hyd, exo: s.f === "NaOH" || s.f === "KOH" || s.f === "CaCl2", endo: s.f === "NH4NO3" || s.f === "KNO3" || s.f === "NH4Cl" };
      }
      return NO("insoluble");
    }
    if (s.cls === "acid") return s.an === "SiO3" ? NO("insoluble") : { ok: false, why: "dissolve", diss: null, env: "acid", exo: s.conc };
    if (s.cls === "org") return NO(["C6H12O6", "C12H22O11", "C2H5OH", "CH3OH", "C3H8O3", "C3H6O", "C6H8O7", "CO(NH2)2", "C17H35COONa", "H2C2O4"].includes(s.f) ? "dissolve" : "insoluble");
    if (s.cls === "gas") return NO("dissolve", { env: s.f === "NH3" ? "alk" : s.f === "H2S" ? "acid" : "neut" });
    return NO("insoluble");
  }

  /* ---------- 11. Асосий функция: аралаштириш ---------- */
  function pair(A, B, cond) {
    if (A.id === B.id) return NO("same");
    if (A.rad || B.rad) return NO("rad");
    if (A.cls === "noble" || B.cls === "noble") return NO("inert");
    if (A.st === "u" || B.st === "u") return NO("rad");
    const W2 = A.id === "H2O" ? B : B.id === "H2O" ? A : null;
    if (W2) {
      if (W2.cls === "metal") return metalWith(W2, BY.H2O, cond);
      if (W2.cls === "oxide") return oxideWith(W2, BY.H2O, cond);
      if (W2.cls === "nonmetal") return nonmetalWith(W2, BY.H2O, cond);
      return dissolve(W2);
    }
    const o = (cls) => (A.cls === cls ? [A, B] : B.cls === cls ? [B, A] : null);
    let m;
    if ((m = o("org")) && m[1].id === "O2") return organicBurn(m[0]);
    if ((m = o("gas")) && (m[1].id === "O2" || m[1].cls === "acid")) {
      const [g, x] = m;
      if (g.id === "NH3" && x.cls === "acid") return result(["NH3", x.f], [saltF("NH4", x.an)], ["comb"], { aq: true, noIon: true, obs: t3("Аммиак кислотани нейтраллайди — аммоний тузи (ўғит).", "Аммиак нейтрализует кислоту — соль аммония (удобрение).", "Ammonia neutralises the acid — an ammonium salt (fertiliser).") });
      if (g.id === "NH3" && x.id === "O2") return cond.heat ? result(["NH3", "O2"], ["N2", "H2O"], ["burn", "redox"], { heat: 1, obs: t3("Катализаторсиз ёнганда азот ҳосил бўлади.", "Без катализатора горит до азота.", "Without a catalyst it burns to nitrogen.") }) : NO("needheat");
      return NO("model");
    }
    if (A.id === "H2S" && B.id === "O2" || B.id === "H2S" && A.id === "O2") return cond.heat ? result(["H2S", "O2"], ["SO2", "H2O"], ["burn", "redox"], { heat: 1, obs: t3("Ҳаворанг аланга, SO₂ ҳиди.", "Голубоватое пламя, запах SO₂.", "A bluish flame and SO₂ smell.") }) : NO("needheat");
    if ((m = o("metal"))) return metalWith(m[0], m[1], cond);
    if ((m = o("oxide"))) return oxideWith(m[0], m[1], cond);
    if ((m = o("nonmetal"))) return nonmetalWith(m[0], m[1], cond);
    if (o("org") || o("gas")) return NO("model");
    if (A.cat && B.cat) return exchange(A, B, cond) || NO("model");
    return NO("model");
  }
  /* ids — 1–3 модда, cond {heat} */
  function react(ids, cond = {}) {
    const subs = ids.map((id) => BY[id]).filter(Boolean);
    if (!subs.length) return NO("empty");
    if (subs.some((s) => s.rad || s.st === "u")) return NO("rad");
    /* Махсус реакциялар — энг кўп моддани қамраган */
    const set = new Set(ids);
    const sps = SP.filter((sp) => sp.r.every((r) => set.has(r)) && (sp.r.length > 1 || ids.length === 1)).sort((a, b) => b.r.length - a.r.length);
    if (sps.length) {
      const sp = sps[0];
      const r = fromSP(sp, cond);
      if (r.ok || sp.r.length === ids.length) return Object.assign(r, { sp: true, used: sp.r });
    }
    if (subs.length === 1) return decompose(subs[0], cond);
    if (subs.length === 2) return pair(subs[0], subs[1], cond);
    /* 3 модда: барча жуфтликлар */
    const out = [];
    for (let i = 0; i < subs.length; i++) for (let j = i + 1; j < subs.length; j++) { const r = pair(subs[i], subs[j], cond); if (r.ok) out.push(Object.assign(r, { pairIds: [subs[i].id, subs[j].id] })); }
    if (!out.length) return NO("ions3");
    return { ok: true, multi: out };
  }

  W.EkoReak = { EL, ES, CATN, SUBS, BY, CAT, AN, SP, GAS, TYPEN, parse, molar, pretty, balance, react, ionsOf, isMetal, solOf, saltF, E0 };
  if (typeof module !== "undefined") module.exports = W.EkoReak;
})();
