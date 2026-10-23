/* Экомун — «Эко-оқим» маълумотлари (vendor/eko-oqim.js учун).
   1) videos — текширилган видеолар. YouTube видеолари 2026-10-23 куни YouTube oEmbed орқали биттадан
      текширилди (мавжуд ва бошқа сайтга жойлаштиришга рухсат берилган); «orig» — асл номи, «ch» — канал.
      Telegram видеолари — Экология ва иқлим ўзгариши миллий қўмитасининг очиқ каналидан (t.me/ecogovuz).
   2) laws — Экология ва иқлим ўзгариши миллий қўмитасининг расмий сайтидаги «Қонунлар» рўйхати
      (https://gov.uz/oz/eco/pages/laws, 2026-10-23 ҳолати), lex.uz ҳаволалари билан.
   Сервер (feeds.js) шу манбалардан янгиларини ҳар 3 соатда ўзи олади — улар /api/feed орқали қўшилади.
   t(уз, ру, ен) — уч тилли сарлавҳа. st: "m" — мактаб, "u" — университет, "" — иккаласи. */
(() => {
  "use strict";
  const t = (uz, ru, en) => ({ uz, ru, en });
  const V = [
    { yt: "fOMS9flYPwQ", lng: "uz", top: "uzb", st: "u", ch: "UZREPORT TV", orig: "Ekologiya, atrof-muhitni muhofaza qilish va iqlim o‘zgarishi vazirligi rahbariyati matbuot anjumani", t: t("Экология вазирлиги раҳбарияти матбуот анжумани", "Пресс-конференция руководства Минэкологии", "Ministry of Ecology leadership press conference") },
    { yt: "yA5y0r0qg7c", lng: "uz", top: "uzb", st: "u", ch: "UZREPORT TV", orig: "Ekologiya va atrof-muhitni muhofaza qilish davlat qo‘mitasi mutasaddilari matbuot anjumani", t: t("Экология давлат қўмитаси масъуллари матбуот анжумани", "Пресс-конференция Госкомэкологии", "State Ecology Committee press conference") },
    { yt: "FnQwSMBOBWc", lng: "uz", top: "uzb", st: "u", ch: "UZREPORT TV", orig: "O‘zbekiston Respublikasi Ekologiya va atrof-muhitni muhofaza qilish davlat qo‘mitasi matbuot anjuman", t: t("Экология давлат қўмитаси: матбуот анжумани", "Госкомэкологии Узбекистана: пресс-конференция", "Uzbekistan State Ecology Committee: press briefing") },
    { yt: "hMta3McWL2s", lng: "uz", top: "uzb", st: "", ch: "UZREPORT TV", orig: "2025-yilda O‘zbekistonda ekologiya sohasida nimalar o‘zgardi?", t: t("2025 йилда Ўзбекистонда экология соҳасида нималар ўзгарди?", "Что изменилось в экологии Узбекистана в 2025 году?", "What changed in Uzbekistan’s ecology in 2025?") },
    { yt: "iJGQ5uaqIaU", lng: "uz", top: "ifl", st: "u", ch: "UZREPORT TV", orig: "“Olmaliq KMK”da ekologik talablar va atrof-muhit muhofazasi meʼyorlari xalqaro standartlar.", t: t("Олмалиқ КМК: экологик талаблар ва халқаро стандартлар", "Алмалыкский ГМК: экологические требования и международные стандарты", "Almalyk MMC: environmental requirements and international standards") },
    { yt: "EFgOSBt0QXs", lng: "uz", top: "ifl", st: "", ch: "UZREPORT TV", orig: "BUXORODA CHIQINDILARNI QAYTA ISHLASH SOHASIDA AHVOL QANDAY?", t: t("Бухорода чиқиндиларни қайта ишлаш аҳволи қандай?", "Как обстоят дела с переработкой отходов в Бухаре?", "Waste recycling in Bukhara: where do things stand?") },
    { yt: "vCqfhHIOb1M", lng: "uz", top: "ifl", st: "", ch: "Chiqindilarni boshqarish agentligi", orig: "Yurtimizda chiqindilarni qayta ishlaydigan korxonalar soni oshib bormoqda", t: t("Чиқинди қайта ишловчи корхоналар сони ортмоқда", "В стране растёт число предприятий по переработке отходов", "More waste recycling plants are opening in Uzbekistan") },
    { yt: "iD8SOomJDOE", lng: "uz", top: "ifl", st: "", ch: "Chiqindilarni boshqarish agentligi", orig: "♻️ Chiqindini qayta ishlash samaradorligi", t: t("♻️ Чиқиндини қайта ишлаш самарадорлиги", "♻️ Эффективность переработки отходов", "♻️ How efficient is waste recycling?") },
    { yt: "gbIazoNvXUA", lng: "uz", top: "ifl", st: "", ch: "Farg‘ona tumani hokimligi", orig: "Chiqindilarni qayta ishlash korxonasida kuniga 4 yarim tonna chiqindi qayta ishlanmoqda", t: t("Корхонада кунига 4,5 тонна чиқинди қайта ишланмоқда", "Завод перерабатывает 4,5 тонны отходов в день", "A plant recycling 4.5 tonnes of waste a day") },
    { yt: "aZCgf0nNQVA", lng: "uz", top: "asos", st: "m", ch: "OKMK TV", orig: "Bolalarda ekologik madaniyatni shakllantirish.", t: t("Болаларда экологик маданиятни шакллантириш", "Как воспитать у детей экологическую культуру", "Building environmental culture in children") },
    { yt: "-Mxuc3Ohs98", lng: "uz", top: "asos", st: "", ch: "Respublika ta`lim markazi | Rasmiy", orig: "Ekologik madaniyat – ta’limdan boshlanadi", t: t("Экологик маданият таълимдан бошланади", "Экологическая культура начинается с образования", "Environmental culture starts with education") },
    { yt: "1_EwsO6Ih-A", lng: "uz", top: "ifl", st: "u", ch: "KunUZ", orig: "Havo ifloslanishi va aholi salomatligi bilan bog‘liq inqirozdan chiqish: Yaponiya tajribasi", t: t("Ҳаво ифлосланиши ва соғлиқ инқирозидан чиқиш: Япония тажрибаси", "Как выйти из кризиса загрязнения воздуха: опыт Японии", "Overcoming an air-pollution health crisis: Japan’s experience") },
    { yt: "9Vjotr1OuWg", lng: "uz", top: "ifl", st: "", ch: "KunUZ", orig: "Havo ifloslanishi inson sog‘lig‘ini qanday qilib yomonlashtiradi?", t: t("Ҳаво ифлосланиши соғлиққа қандай зарар қилади?", "Как загрязнение воздуха вредит здоровью?", "How does air pollution harm our health?") },
    { yt: "TsdioKKhQv8", lng: "uz", top: "suv", st: "u", ch: "Iqtisodiyot va turizm fakulteti", orig: "Suv : qayta tiklanadigan va zahira qilinadigan manbalar", t: t("Сув: қайта тикланадиган ва заҳира манбалар", "Вода: возобновляемые и запасаемые ресурсы", "Water: renewable and stored resources") },
    { yt: "yJJaLZVckQs", lng: "uz", top: "orol", st: "", ch: "Kunuz News", orig: "Tirilayotgan Orol – unga qanday jon bag‘ishlash mumkin?", t: t("Тирилаётган Орол: унга қандай жон бағишлаш мумкин?", "Оживающий Арал: как вернуть ему жизнь?", "The reviving Aral: how can it be brought back to life?") },
    { yt: "UGQUlmwYmHs", lng: "uz", top: "orol", st: "m", ch: "GEOGRAFIYA VA TA'LIM", orig: "Orol tabiiy geografik okrugi | Орол табиий географик округи", t: t("Орол табиий географик округи", "Аральский природно-географический округ", "The Aral natural-geographic district") },
    { yt: "ChaFhPxcass", lng: "ru", top: "ifl", st: "u", ch: "Док Life 2", orig: "Экология и загрязнение планеты. Влияние загрязнений на человека. Документальный фильм", t: t("Сайёра ифлосланиши ва инсон: ҳужжатли фильм", "Экология и загрязнение планеты: документальный фильм", "Pollution of the planet and people: a documentary") },
    { yt: "LqH4G8mJyNQ", lng: "ru", top: "iqlim", st: "m", ch: "Источники Альтернативной Энергии", orig: "Как сохранить окружающую среду?🌏 Как предотвратить изменение климата?🌨️🏔️🏝️ Просто об экологии🦕", t: t("Атроф-муҳитни қандай асраймиз? Экология оддий тилда", "Как сохранить окружающую среду? Просто об экологии", "How do we protect the environment? Ecology made simple") },
    { yt: "2WEFFwsJWaQ", lng: "ru", top: "ifl", st: "m", ch: "Видеоуроки", orig: "Загрязнение природной среды", t: t("Табиий муҳитнинг ифлосланиши", "Загрязнение природной среды", "Pollution of the natural environment") },
    { yt: "aqrKN-MwBSY", lng: "ru", top: "ifl", st: "m", ch: "Хочу знать | Познавательный канал для всех", orig: "Загрязнение окружающей среды (Природа) - Детская Энциклопедия", t: t("Атроф-муҳит ифлосланиши — болалар энциклопедияси", "Загрязнение окружающей среды — детская энциклопедия", "Environmental pollution — a children’s encyclopedia") },
    { yt: "ttfWKhgcvjI", lng: "ru", top: "ifl", st: "", ch: "Телеканал 24kz", orig: "Промышленное загрязнение окружающей среды | Экология", t: t("Саноат ифлосланиши", "Промышленное загрязнение окружающей среды", "Industrial pollution of the environment") },
    { yt: "OItv9ee2Yog", lng: "ru", top: "ifl", st: "", ch: "WHO European Region", orig: "Транспорт, окружающая среда и охрана здоровья: а знаете ли вы о последствиях?", t: t("Транспорт, атроф-муҳит ва соғлиқ (ЖССТ)", "Транспорт, окружающая среда и здоровье (ВОЗ)", "Transport, environment and health (WHO)") },
    { yt: "C7f7Zq-8LTc", lng: "ru", top: "ifl", st: "u", ch: "WHO European Region", orig: "Решение проблемы воздействия загрязнения окружающей среды на здоровье человека", t: t("Ифлосланишнинг соғлиққа таъсирини камайтириш (ЖССТ)", "Как снизить влияние загрязнения на здоровье (ВОЗ)", "Reducing the health impact of pollution (WHO)") },
    { yt: "ZytUtdDLaxo", lng: "ru", top: "orol", st: "", ch: "ТЕОРИЯ ВСЕГО", orig: "Гибель Арала: как моря превратились в пустыню / Советский проект, сгубивший экологию | Теория Всего", t: t("Орол ҳалокати: денгиз қандай қилиб чўлга айланди", "Гибель Арала: как море стало пустыней", "The death of the Aral: how a sea became a desert") },
    { yt: "nJZfoh1jP4g", lng: "ru", top: "orol", st: "u", ch: "UNDPKAZ", orig: "Восстановление Аральского моря: Устойчивое землеустройство и экологические меры", t: t("Орол денгизини тиклаш: барқарор ердан фойдаланиш (БМТТД)", "Восстановление Аральского моря: устойчивое землеустройство (ПРООН)", "Restoring the Aral Sea: sustainable land management (UNDP)") },
    { yt: "DwWltuoyEcI", lng: "ru", top: "orol", st: "", ch: "Almaty TV News", orig: "В Аральское море возвращается вода", t: t("Орол денгизига сув қайтмоқда", "В Аральское море возвращается вода", "Water is returning to the Aral Sea") },
    { yt: "e8eKbheR2Ww", lng: "ru", top: "orol", st: "", ch: "Khabar NEWS", orig: "Северный Арал возвращается к жизни", t: t("Шимолий Орол ҳаётга қайтмоқда", "Северный Арал возвращается к жизни", "The North Aral is coming back to life") },
    { yt: "Ld_6MfnvNGM", lng: "ru", top: "orol", st: "", ch: "Архитектура Природы", orig: "Аральское море ожило благодаря одной плотине, остановившей катастрофу века", t: t("Битта тўғон Орол денгизини қандай қутқарди", "Как одна плотина оживила Аральское море", "How one dam revived the Aral Sea") },
    { yt: "ndmrwKePQMw", lng: "ru", top: "orol", st: "", ch: "Khabar NEWS", orig: "Арал оживает: от кризиса к экспорту рыбы", t: t("Орол жонланмоқда: инқироздан балиқ экспортигача", "Арал оживает: от кризиса к экспорту рыбы", "The Aral revives: from crisis to fish exports") },
    { yt: "tPutZYHM62w", lng: "ru", top: "orol", st: "", ch: "Главные новости Казахстана / Басты жаңалықтар", orig: "Аральское море: возрождение. Помогут ли поступившие кубометры воды?", t: t("Орол денгизи: қайта тикланиш", "Аральское море: возрождение", "The Aral Sea: a revival?") },
    { yt: "ZQr3oV5xfEk", lng: "en", top: "ifl", st: "", ch: "UN Environment Programme", orig: "Together we can #beatplasticpollution this #worldenvironmentday", t: t("Пластик ифлосланишни биргаликда енгамиз (UNEP)", "Вместе победим пластиковое загрязнение (ЮНЕП)", "Together we can beat plastic pollution (UNEP)") },
    { yt: "kET-l4DbohQ", lng: "en", top: "ifl", st: "", ch: "UN Environment Programme", orig: "How can we #beatplasticpollution ?", t: t("Пластик ифлосланишни қандай енгамиз? (UNEP)", "Как победить пластиковое загрязнение? (ЮНЕП)", "How can we beat plastic pollution? (UNEP)") },
    { yt: "LIPMERHaLKM", lng: "en", top: "bio", st: "", ch: "UN Environment Programme", orig: "UN Decade on Ecosystem Restoration: 10 years to heal the planet", t: t("БМТ экотизимларни тиклаш ўн йиллиги", "Десятилетие ООН по восстановлению экосистем", "UN Decade on Ecosystem Restoration") },
    { yt: "85HvcBcLhEo", lng: "en", top: "asos", st: "", ch: "UN Environment Programme", orig: "Our planet. Our purpose.", t: t("Сайёрамиз — мақсадимиз (UNEP)", "Наша планета — наша цель (ЮНЕП)", "Our planet. Our purpose. (UNEP)") },
    { yt: "sJLJGeTEhJs", lng: "en", top: "ifl", st: "", ch: "4ocean", orig: "How Plastic Affects Climate Change", t: t("Пластик иқлимга қандай таъсир қилади", "Как пластик влияет на климат", "How plastic affects climate change") },
    { yt: "Asxg3qqkAi8", lng: "en", top: "ifl", st: "u", ch: "Our Changing Climate", orig: "Why Plastic Pollution Is Even Worse Than You Think", t: t("Пластик ифлосланиш нега ўйлаганимиздан ёмонроқ", "Почему пластиковое загрязнение хуже, чем кажется", "Why plastic pollution is even worse than you think") },
    { yt: "19zJCO1VBj4", lng: "en", top: "yer", st: "", ch: "TED", orig: "The Hidden Wonders of Soil | Jane Zelikova | TED", t: t("Тупроқнинг яширин мўъжизалари (TED)", "Скрытые чудеса почвы (TED)", "The hidden wonders of soil (TED)") },
    { yt: "N0JtOnCnqaA", lng: "en", top: "iqlim", st: "u", ch: "TED", orig: "The Unexpected, Underwater Plant Fighting Climate Change | Carlos M. Duarte | TED Countdown", t: t("Иқлим билан курашаётган сув ости ўсимлиги (TED)", "Подводное растение против изменения климата (TED)", "The underwater plant fighting climate change (TED)") },
    { yt: "ZCKRjP_DMII", lng: "en", top: "iqlim", st: "", ch: "TED-Ed", orig: "Can wildlife adapt to climate change? - Erin Eastwood", t: t("Ёввойи табиат иқлим ўзгаришига мослаша оладими?", "Может ли дикая природа приспособиться к изменению климата?", "Can wildlife adapt to climate change?") },
    { yt: "RwtO04EXgUE", lng: "en", top: "suv", st: "", ch: "TED-Ed", orig: "Where did Earth's water come from? - Zachary Metz", t: t("Ердаги сув қаердан келган?", "Откуда на Земле вода?", "Where did Earth’s water come from?") },
    { yt: "lrEM3LHvjI0", lng: "en", top: "iqlim", st: "", ch: "TED-Ed", orig: "Why the Arctic is climate change's canary in the coal mine - William Chapman", t: t("Арктика — иқлим ўзгаришининг илк белгиси", "Почему Арктика первой сигналит об изменении климата", "Why the Arctic is climate change’s early warning") },
    { yt: "sDo7saKaEys", lng: "en", top: "iqlim", st: "u", ch: "TED-Ed", orig: "Cloudy climate change: How clouds affect Earth's temperature - Jasper Kirkby", t: t("Булутлар Ер ҳароратига қандай таъсир қилади", "Как облака влияют на температуру Земли", "How clouds affect Earth’s temperature") },
    { yt: "EtW2rrLHs08", lng: "en", top: "iqlim", st: "", ch: "National Geographic", orig: "Climate Change 101 with Bill Nye | National Geographic", t: t("Иқлим ўзгариши 101 (National Geographic)", "Изменение климата 101 (National Geographic)", "Climate Change 101 (National Geographic)") },
    { yt: "n4crvs-KTBw", lng: "en", top: "yer", st: "", ch: "National Geographic", orig: "Deserts 101 | National Geographic", t: t("Чўллар 101 (National Geographic)", "Пустыни 101 (National Geographic)", "Deserts 101 (National Geographic)") },
    { yt: "WF-GNL3KfrY", lng: "en", top: "yer", st: "", ch: "The Planet Voice", orig: "Desertification Causes and Effects | Desertification | What Is Desertification", t: t("Чўлланиш: сабаблари ва оқибатлари", "Опустынивание: причины и последствия", "Desertification: causes and effects") },
    { yt: "WwhAdu0m61k", lng: "en", top: "yer", st: "m", ch: "ACCIONA", orig: "What is desertification? | ACCIONA Sustainability for all", t: t("Чўлланиш нима?", "Что такое опустынивание?", "What is desertification?") },
    { yt: "oQPS9anRLdI", lng: "en", top: "yer", st: "u", ch: "Jon Lott", orig: "5 Maps and How the World is Changing: Desertification, Deforestation, Drought, and Urbanization", t: t("5 харитада ўзгараётган дунё: чўлланиш, ўрмонлар кесилиши, қурғоқчилик", "Как меняется мир на 5 картах: опустынивание, вырубка лесов, засуха", "5 maps of a changing world: desertification, deforestation, drought") },
    { tg: "ecogovuz/44467", lng: "uz", top: "bio", st: "", ch: "Ekologiya va iqlim o‘zgarishi milliy qo‘mitasi", orig: "“Qizilqum” davlat qo‘riqxonasi", t: t("«Қизилқум» давлат қўриқхонаси (видео)", "Заповедник «Кызылкум» (видео)", "Kyzylkum State Nature Reserve (video)") },
    { tg: "ecogovuz/44468", lng: "uz", top: "ifl", st: "", ch: "Ekologiya va iqlim o‘zgarishi milliy qo‘mitasi", orig: "Chirchiq daryosi hududiga qurilish chiqindilari tashlab ketilayotganligi aniqlandi", t: t("Чирчиқ дарёси бўйига қурилиш чиқиндиси ташланаётгани аниқланди", "На берегу Чирчика выявлен сброс строительных отходов", "Construction waste dumped by the Chirchiq river") },
    { tg: "ecogovuz/44480", lng: "uz", top: "huquq", st: "", ch: "Ekologiya va iqlim o‘zgarishi milliy qo‘mitasi", orig: "Toshkentda yuqori qavatdan chiqindi tashlagan huquqbuzarga jarima belgilandi", t: t("Юқори қаватдан чиқинди ташлаган шахсга жарима", "Штраф за выброс мусора с верхнего этажа", "A fine for throwing rubbish from an upper floor") }
  ];
  const LAWS = [
    { n: "Konstitutsiya", d: "2023-05-01", t: "O‘zbekiston Respublikasi Konstitutsiyasi", url: "https://lex.uz/docs/-6445145" },
    { n: "754-XII", d: "1992-12-09", t: "«Tabiatni muhofaza qilish to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-107115" },
    { n: "837-XII", d: "1993-05-06", t: "«Suv va suvdan foydalanish to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-12328" },
    { n: "353-I", d: "1996-12-27", t: "«Atmosfera havosini muhofaza qilish to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-55561" },
    { n: "543-I", d: "1997-12-26", t: "«O‘simlik dunyosini muhofaza qilish va undan foydalanish to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-3030362" },
    { n: "O‘RQ-408", d: "2016-09-19", t: "«Hayvonot dunyosini muhofaza qilish va undan foydalanish to‘g‘risida»gi Qonun", url: "https://lex.uz/ru/docs/-3029502" },
    { n: "362-II", d: "2002-04-05", t: "«Chiqindilar to‘g‘risida»gi Qonun", url: "https://lex.uz/ru/docs/-42423" },
    { n: "O‘RQ-363", d: "2013-12-27", t: "«Ekologik nazorat to‘g‘risida»gi Qonun", url: "https://lex.uz/ru/docs/-2304953" },
    { n: "710-II", d: "2004-12-03", t: "«Muhofaza etiladigan tabiiy hududlar to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-415135" },
    { n: "73-II", d: "2000-05-25", t: "«Ekologik ekspertiza to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-32955" },
    { n: "O‘RQ-678", d: "2021-03-15", t: "«Ekologik audit to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-5331133" },
    { n: "120-II", d: "2000-08-31", t: "«Radiatsiyaviy xavfsizlik to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-26166" },
    { n: "444-II", d: "2002-12-13", t: "«Yer osti boyliklari to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-77871" },
    { n: "116-II", d: "2000-08-31", t: "«Qishloq xo‘jaligi o‘simliklarini zararkunandalar, kasalliklar va begona o‘tlardan himoya qilish to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-24780" },
    { n: "O‘RQ-475", d: "2018-04-16", t: "«O‘rmon to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-3683529" },
    { n: "O‘RQ-800", d: "2022-11-03", t: "«Standartlashtirish to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-6270526" },
    { n: "O‘RQ-819", d: "2023-02-27", t: "«Texnik jihatdan tartibga solish to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-6392312" },
    { n: "O‘RQ-354", d: "2013-10-04", t: "«Muvofiqlikni baholash to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-2248099" },
    { n: "O‘RQ-614", d: "2020-04-07", t: "«Metrologiya to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-4782808" },
    { n: "O‘RQ-745", d: "2022-01-12", t: "«Gidrometeorologiya faoliyati to‘g‘risida»gi Qonun", url: "https://lex.uz/uz/docs/-5819317" },
    { n: "O‘RQ-903", d: "2024-02-02", t: "«Tuproqni muhofaza qilish va uning unumdorligini oshirish to‘g‘risida»gi Qonun", url: "https://lex.uz/docs/-6787881" },
    { n: "O‘RQ-1036", d: "2025-02-24", t: "«Ekologik ekspertiza, atrof-muhitga ta’sirni baholash va strategik ekologik baholash to‘g‘risida»gi Qonun", url: "https://lex.uz/uz/docs/-7397280" },
    { n: "O‘RQ-1048", d: "2025-03-19", t: "«O‘zbekiston Respublikasida xizmat ko‘rsatgan ekolog» faxriy unvonini ta’sis etish to‘g‘risidagi Qonun", url: "https://lex.uz/uz/docs/-7436983" },
    { n: "O‘RQ-1073", d: "2025-07-08", t: "«Issiqxona gazlarining chiqarilishini cheklash to‘g‘risida»gi Qonun", url: "https://lex.uz/ru/pdfs/7616051" },
    { n: "O‘RQ-1124", d: "2026-03-25", t: "Atrof-muhit, hayvonot va o‘simlik dunyosi muhofazasini kuchaytirish, tabiiy resurslardan oqilona foydalanishga qaratilgan qo‘shimcha va o‘zgartirishlar to‘g‘risida Qonun", url: "https://lex.uz/docs/8099232" },
    { n: "O‘RQ-1143", d: "2026-05-04", t: "Ekologiya va tabiatdan foydalanish sohasidagi huquqbuzarliklar uchun javobgarlik kuchaytirilishi munosabati bilan qo‘shimcha va o‘zgartirishlar to‘g‘risida Qonun", url: "https://lex.uz/docs/8169998" },
    { n: "O‘RQ-1145", d: "2026-05-14", t: "Ekologik toza hududlarning huquqiy maqomi: «Muhofaza etiladigan tabiiy hududlar to‘g‘risida»gi Qonunga qo‘shimcha", url: "https://lex.uz/en/pdfs/8193984" }
  ];
  const SOURCES = [
    { n: t("Экология ва иқлим ўзгариши миллий қўмитаси — расмий сайт", "Национальный комитет по экологии и изменению климата — официальный сайт", "National Committee for Ecology and Climate Change — official site"), url: "https://gov.uz/oz/eco" },
    { n: t("Қўмита YouTube канали (@ecogovuz)", "YouTube-канал комитета (@ecogovuz)", "Committee YouTube channel (@ecogovuz)"), url: "https://www.youtube.com/channel/UCiaUoLECuViPTHW1X72wsrw" },
    { n: t("Қўмита Telegram канали (@ecogovuz)", "Telegram-канал комитета (@ecogovuz)", "Committee Telegram channel (@ecogovuz)"), url: "https://t.me/ecogovuz" },
    { n: t("Қонун ҳужжатлари маълумотлари миллий базаси — lex.uz", "Национальная база законодательства — lex.uz", "National legislation database — lex.uz"), url: "https://lex.uz" }
  ];
  /* Тавсия этилган ҳужжатлар: инфографика (расмлар vendor/img/qaror586/, асл слайдлардан сиқилган) */
  const FEATURED = [
    {
      id: "vm586", n: "ВМ-586",
      t: t("Янги қарор: қайси ташкилот нима учун масъул?", "Новое постановление: какая организация за что отвечает?", "New resolution: which body is responsible for what?"),
      sub: t("Вазирлар Маҳкамасининг 586-сонли қарори: Тошкент шаҳри ва унга туташ ҳудудларда иссиқхона хўжаликларининг экологик хавфсиз фаолият юритиши ҳақида",
        "Постановление Кабинета Министров № 586 об экологически безопасной деятельности тепличных хозяйств в городе Ташкенте и прилегающих территориях",
        "Cabinet of Ministers Resolution No. 586 on environmentally safe operation of greenhouse farms in Tashkent city and adjacent areas"),
      slides: [
        { img: "vendor/img/qaror586/1.webp", t: t("Қарор ҳақида", "О постановлении", "About the resolution"),
          p: [t("Тошкент шаҳри ва унга туташ ҳудудлардаги иссиқхона хўжаликлари экологик хавфсиз ишлаши керак.", "Тепличные хозяйства Ташкента и прилегающих территорий должны работать экологически безопасно.", "Greenhouse farms in and around Tashkent must operate in an environmentally safe way.")] },
        { img: "vendor/img/qaror586/2.webp", t: t("Экология ва иқлим ўзгариши миллий қўмитаси", "Национальный комитет по экологии и изменению климата", "National Committee for Ecology and Climate Change"),
          p: [t("Экологик назоратни ташкил этади", "Организует экологический контроль", "Organises environmental control"),
            t("Ифлослантирувчи моддалар ташламаларини мониторинг қилади", "Ведёт мониторинг выбросов загрязняющих веществ", "Monitors pollutant emissions"),
            t("Автоматлаштирилган мониторинг тизимларини жорий этади", "Внедряет автоматизированные системы мониторинга", "Introduces automated monitoring systems"),
            t("Белгиланган меъёрларга риоя этилишини назорат қилади", "Контролирует соблюдение установленных нормативов", "Checks compliance with set standards")] },
        { img: "vendor/img/qaror586/3.webp", t: t("Иқтисодиёт ва молия вазирлиги", "Министерство экономики и финансов", "Ministry of Economy and Finance"),
          p: [t("Модернизацияни молиявий қўллаб-қувватлайди", "Финансово поддерживает модернизацию", "Supports modernisation financially"),
            t("Экологик тоза технологияларга ўтишни рағбатлантиради", "Стимулирует переход на экологически чистые технологии", "Encourages the shift to clean technologies"),
            t("Иқтисодий механизмларни ишлаб чиқади", "Разрабатывает экономические механизмы", "Develops economic mechanisms")] },
        { img: "vendor/img/qaror586/4.webp", t: t("Энергетика вазирлиги", "Министерство энергетики", "Ministry of Energy"),
          p: [t("Энергия таъминоти чора-тадбирларини кўради", "Принимает меры по энергоснабжению", "Takes energy supply measures"),
            t("Самарали ва экологик тоза технологияларга ўтишга кўмаклашади", "Содействует переходу на эффективные и чистые технологии", "Helps the move to efficient, clean technologies"),
            t("Энергия самарадорлигини оширади", "Повышает энергоэффективность", "Improves energy efficiency")] },
        { img: "vendor/img/qaror586/5.webp", t: t("Тошкент шаҳри ва вилояти ҳокимликлари", "Хокимияты города Ташкента и Ташкентской области", "Tashkent city and region administrations"),
          p: [t("Иссиқхоналар билан ҳамкорлик қилади", "Сотрудничают с тепличными хозяйствами", "Work with greenhouse farms"),
            t("Чора-тадбирлар ижросини ташкил этади", "Организуют исполнение мер", "Organise implementation of measures"),
            t("Тошкент агломерациясида экологик вазиятни яхшилайди", "Улучшают экологическую ситуацию в Ташкентской агломерации", "Improve the environment of the Tashkent agglomeration")] },
        { img: "vendor/img/qaror586/6.webp", t: t("Қишлоқ хўжалиги вазирлиги", "Министерство сельского хозяйства", "Ministry of Agriculture"),
          p: [t("Иссиқхоналар фаолиятига оид масалаларни ҳал этади", "Решает вопросы деятельности теплиц", "Resolves greenhouse-related issues"),
            t("Талаблар ва шартларни такомиллаштиради", "Совершенствует требования и условия", "Improves requirements and conditions"),
            t("Бошқа идоралар билан ҳамкорлик қилади", "Взаимодействует с другими ведомствами", "Cooperates with other agencies")] },
        { img: "vendor/img/qaror586/7.webp", t: t("Бу аҳоли учун нимани англатади?", "Что это значит для населения?", "What does it mean for residents?"),
          p: [t("Атмосфера ҳавоси ифлосланишини камайтириш", "Снижение загрязнения атмосферного воздуха", "Less air pollution"),
            t("Энергия самарадорлигини ошириш", "Рост энергоэффективности", "Better energy efficiency"),
            t("Атроф-муҳитга таъсир назорати", "Контроль воздействия на окружающую среду", "Control of environmental impact"),
            t("Натижа: тоза ва қулай яшаш муҳити", "Итог: чистая и комфортная среда для жизни", "Result: a clean, comfortable living environment")] }
      ]
    }
  ];
  window.EKO_OQIM = { videos: V, laws: LAWS, sources: SOURCES, featured: FEATURED, checked: "2026-10-23" };
})();
