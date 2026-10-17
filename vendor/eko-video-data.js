/* Экомун — «Видео дарслар» маълумотлари (vendor/eko-video.js учун).
   Ҳар бир видео 2026-10-16 куни YouTube oEmbed орқали текширилди: видео мавжуд ва бошқа сайтга
   жойлаштиришга (embed) рухсат берилган. «orig» — YouTube'даги асл номи, «ch» — канал.
   Конспект ва саволлар мавзу бўйича илмий манбаларга таянади (WHO, FAO, IPCC, NASA, UNCCD).
   t(уз, ру, ен) — уч тилли матн. st: "m" — мактаб, "u" — университет, "" — иккаласи. */
(() => {
  "use strict";
  const t = (uz, ru, en) => ({ uz, ru, en });
  const q = (qq, o, c, e) => ({ q: qq, o, c, e });

  const TOPICS = [
    { id: "asos", ic: "fa-seedling", c: "#047857", t: t("Экология асослари", "Основы экологии", "Ecology basics") },
    { id: "suv", ic: "fa-droplet", c: "#0369a1", t: t("Сув ва моддалар айланиши", "Вода и круговороты", "Water and cycles") },
    { id: "iqlim", ic: "fa-temperature-arrow-up", c: "#b91c1c", t: t("Иқлим ўзгариши", "Изменение климата", "Climate change") },
    { id: "ifl", ic: "fa-smog", c: "#57534e", t: t("Ифлосланиш ва чиқинди", "Загрязнение и отходы", "Pollution and waste") },
    { id: "bio", ic: "fa-tree", c: "#15803d", t: t("Биохилма-хиллик ва ўрмон", "Биоразнообразие и леса", "Biodiversity and forests") },
    { id: "yer", ic: "fa-mountain-sun", c: "#a16207", t: t("Ер ва чўлланиш", "Земля и опустынивание", "Land and desertification") },
    { id: "orol", ic: "fa-water", c: "#0e7490", t: t("Орол фожиаси", "Трагедия Арала", "The Aral Sea disaster") },
    { id: "energ", ic: "fa-solar-panel", c: "#c2410c", t: t("Тоза энергия", "Чистая энергия", "Clean energy") }
  ];

  const V = [
    /* ---------- Экология асослари ---------- */
    { id: "v-kirish", yt: "hcQGksrP1DI", top: "asos", st: "", lng: "uz", ch: "Khan Academy Uzbek", orig: "Ekologiya mavzusiga kirish | Ekologiya | Biologiya",
      t: t("Экология мавзусига кириш", "Введение в экологию", "Introduction to ecology"),
      pre: t("Экология фақат «табиатни асраш»ми ёки фанми? Видеодан олдин ўз жавобингизни ёзиб қўйинг.", "Экология — это только «охрана природы» или наука? Запишите свой ответ до просмотра.", "Is ecology just “saving nature”, or is it a science? Write down your answer before watching."),
      k: [
        t("Экология — тирик организмларнинг бир-бири ва атроф-муҳит билан ўзаро таъсирини ўрганадиган фан.", "Экология — наука о взаимодействии организмов друг с другом и со средой.", "Ecology is the science of how organisms interact with each other and with their environment."),
        t("Ўрганиш даражалари: организм → популяция → жамоа (биоценоз) → экотизим → биосфера.", "Уровни: организм → популяция → сообщество → экосистема → биосфера.", "Levels: organism → population → community → ecosystem → biosphere."),
        t("Биотик (тирик) ва абиотик (ҳарорат, сув, ёруғлик, тупроқ) омиллар бирга таъсир қилади.", "Действуют биотические (живые) и абиотические (температура, вода, свет, почва) факторы.", "Biotic (living) and abiotic (temperature, water, light, soil) factors act together.")
      ],
      q: [
        q(t("Қайси қатор экологик даражаларни тўғри тартибда кўрсатади?", "Какой ряд верно показывает уровни?", "Which row shows the levels in the right order?"),
          [t("организм → популяция → жамоа → экотизим", "организм → популяция → сообщество → экосистема", "organism → population → community → ecosystem"), t("экотизим → организм → жамоа → популяция", "экосистема → организм → сообщество → популяция", "ecosystem → organism → community → population"), t("популяция → организм → биосфера → жамоа", "популяция → организм → биосфера → сообщество", "population → organism → biosphere → community")], 0,
          t("Ҳар бир кейинги даража олдингисини ўз ичига олади.", "Каждый следующий уровень включает предыдущий.", "Each level contains the one before it.")),
        q(t("Қайси бири абиотик омил?", "Что является абиотическим фактором?", "Which one is an abiotic factor?"),
          [t("Бўри", "Волк", "A wolf"), t("Ҳаво ҳарорати", "Температура воздуха", "Air temperature"), t("Замбуруғ", "Гриб", "A fungus")], 1,
          t("Абиотик — жонсиз табиат омили.", "Абиотический — фактор неживой природы.", "Abiotic means a non-living factor."))
      ],
      task: t("Уйингиз ёки мактабингиз атрофида 3 та биотик ва 3 та абиотик омилни ёзинг.", "Запишите 3 биотических и 3 абиотических фактора вокруг дома или школы.", "List 3 biotic and 3 abiotic factors around your home or school.") },

    { id: "v-hayot", yt: "sjE-Pkjp3u4", top: "asos", st: "u", lng: "en", ch: "CrashCourse", orig: "The History of Life on Earth - Crash Course Ecology #1",
      t: t("Ердаги ҳаёт тарихи", "История жизни на Земле", "The history of life on Earth"),
      pre: t("Ер тарихида ҳаёт неча марта оммавий қирилиб кетган деб ўйлайсиз?", "Сколько массовых вымираний было в истории Земли, как вы думаете?", "How many mass extinctions do you think Earth has had?"),
      k: [
        t("Ер тахминан 4,5 млрд йил олдин пайдо бўлган; энг қадимги ҳаёт излари 3,5 млрд йилдан ортиқ.", "Земле около 4,5 млрд лет; следам жизни более 3,5 млрд лет.", "Earth is about 4.5 billion years old; traces of life are over 3.5 billion years old."),
        t("Фотосинтез қилувчи цианобактериялар атмосферани кислород билан бойитган.", "Цианобактерии насытили атмосферу кислородом.", "Photosynthetic cyanobacteria filled the atmosphere with oxygen."),
        t("Ер тарихида 5 та катта оммавий қирилиш бўлган; олимлар ҳозирги тез йўқолишни 6-си деб огоҳлантиради.", "Было 5 крупных вымираний; учёные предупреждают о шестом — нынешнем.", "There have been 5 major mass extinctions; scientists warn today’s losses may be the sixth.")
      ],
      q: [
        q(t("Атмосферадаги кислород асосан қаердан пайдо бўлган?", "Откуда в основном появился кислород атмосферы?", "Where did most atmospheric oxygen come from?"),
          [t("Вулқонлардан", "Из вулканов", "Volcanoes"), t("Фотосинтез қилувчи организмлардан", "От фотосинтезирующих организмов", "Photosynthetic organisms"), t("Метеоритлардан", "Из метеоритов", "Meteorites")], 1,
          t("Цианобактериялар ва кейин ўсимликлар фотосинтезда O₂ ажратади.", "Цианобактерии, а затем растения выделяют O₂.", "Cyanobacteria and later plants release O₂.")),
        q(t("Ер тарихида нечта катта оммавий қирилиш бўлган?", "Сколько крупных массовых вымираний было?", "How many major mass extinctions have there been?"),
          [t("2", "2", "2"), t("5", "5", "5"), t("10", "10", "10")], 1, t("«Катта бешлик» — 5 та.", "«Большая пятёрка».", "The “Big Five”."))
      ],
      task: t("Ер тарихини 24 соатга сиқинг: одам соат нечада пайдо бўлади? Ҳисобланг ва чизинг.", "Сожмите историю Земли в 24 часа: во сколько появляется человек? Посчитайте.", "Squeeze Earth’s history into 24 hours: at what time do humans appear? Calculate it.") },

    { id: "v-populyatsiya", yt: "RBOsqmBQBQk", top: "asos", st: "u", lng: "en", ch: "CrashCourse", orig: "Population Ecology: The Texas Mosquito Mystery - Crash Course Ecology #2",
      t: t("Популяция экологияси", "Популяционная экология", "Population ecology"),
      pre: t("Нега бирор тур популяцияси чексиз ўсиб кета олмайди?", "Почему популяция не может расти бесконечно?", "Why can’t a population grow forever?"),
      k: [
        t("Популяция — бир ҳудудда яшайдиган бир турдаги организмлар гуруҳи; зичлиги ва тарқалиши ўлчанади.", "Популяция — группа особей одного вида на одной территории; измеряют плотность и распределение.", "A population is a group of one species in one area; density and dispersion are measured."),
        t("Ресурс кўп бўлса ўсиш экспоненциал (J-эгри), чекланса логистик (S-эгри) бўлади.", "При избытке ресурсов рост экспоненциальный (J), при ограничении — логистический (S).", "With plenty of resources growth is exponential (J-curve); when limited it is logistic (S-curve)."),
        t("Муҳит сиғими (K) — муҳит узоқ вақт боқа оладиган энг кўп сон.", "Ёмкость среды (K) — максимальная численность, которую среда может поддерживать.", "Carrying capacity (K) is the largest population the environment can sustain.")
      ],
      q: [
        q(t("Логистик ўсиш графиги қандай шаклда?", "Какой формы график логистического роста?", "What shape is a logistic growth curve?"),
          [t("J-шакл", "J-образный", "J-shaped"), t("S-шакл", "S-образный", "S-shaped"), t("Тўғри чизиқ", "Прямая", "A straight line")], 1,
          t("Ўсиш муҳит сиғими K га яқинлашганда секинлашади.", "Рост замедляется у предела K.", "Growth slows as it nears K.")),
        q(t("Қайси омил зичликка боғлиқ?", "Какой фактор зависит от плотности?", "Which factor is density-dependent?"),
          [t("Озиқ учун рақобат", "Конкуренция за пищу", "Competition for food"), t("Ер силкиниши", "Землетрясение", "An earthquake"), t("Совуқ қиш", "Холодная зима", "A cold winter")], 0,
          t("Популяция қанча зич бўлса, рақобат шунча кучли.", "Чем плотнее популяция, тем сильнее конкуренция.", "The denser the population, the stronger the competition."))
      ],
      task: t("Битта бактерия ҳар 20 дақиқада бўлинса, 4 соатда нечта бўлади? Нега табиатда бундай бўлмайди?", "Бактерия делится каждые 20 минут: сколько их будет через 4 часа? Почему в природе так не бывает?", "A bacterium divides every 20 minutes: how many after 4 hours? Why doesn’t that happen in nature?") },

    { id: "v-zanjir-ru", yt: "9cgzC90TH0I", top: "asos", st: "m", lng: "ru", ch: "Разумейкин", orig: "Экология - Пищевая цепочка",
      t: t("Озиқ занжири", "Пищевая цепочка", "The food chain"),
      pre: t("Нонуштангиз қайси озиқ занжирининг бир қисми?", "Частью какой пищевой цепочки является ваш завтрак?", "Which food chain is your breakfast part of?"),
      k: [
        t("Озиқ занжири: ўсимлик (продуцент) → ўтхўр → йиртқич → парчаловчилар.", "Цепь питания: растение (продуцент) → травоядное → хищник → редуценты.", "A food chain: plant (producer) → herbivore → predator → decomposers."),
        t("Энергия Қуёшдан келади ва ҳар бир босқичда камаяди.", "Энергия приходит от Солнца и убывает на каждом звене.", "Energy comes from the Sun and decreases at every link."),
        t("Бир ҳалқа йўқолса, бутун занжир бузилади.", "Если исчезнет одно звено, нарушится вся цепь.", "If one link disappears, the whole chain is disrupted.")
      ],
      q: [
        q(t("Озиқ занжири нимадан бошланади?", "С чего начинается пищевая цепь?", "What does a food chain start with?"),
          [t("Йиртқичдан", "С хищника", "A predator"), t("Ўсимликдан", "С растения", "A plant"), t("Замбуруғдан", "С гриба", "A fungus")], 1,
          t("Ўсимликлар Қуёш энергиясини озиққа айлантиради.", "Растения превращают энергию Солнца в пищу.", "Plants turn sunlight into food.")),
        q(t("Илонлар йўқолса, сичқонлар сони нима бўлади?", "Если исчезнут змеи, что будет с мышами?", "If snakes disappear, what happens to mice?"),
          [t("Кўпаяди", "Увеличится", "It grows"), t("Камаяди", "Уменьшится", "It falls"), t("Ўзгармайди", "Не изменится", "No change")], 0,
          t("Йиртқич йўқ — сичқонлар кўпаяди, кейин эса ўсимликлар камаяди.", "Нет хищника — мышей больше, а растений потом меньше.", "No predator — more mice, then fewer plants."))
      ],
      task: t("Ҳовлингиз ёки боғингиздан 4 ҳалқали озиқ занжирини чизинг.", "Нарисуйте цепь из 4 звеньев из вашего двора или сада.", "Draw a 4-link food chain from your yard or garden.") },

    { id: "v-zanjir-kids", yt: "MuKs9o1s8h8", top: "asos", st: "m", lng: "en", ch: "Crash Course Kids", orig: "Fabulous Food Chains: Crash Course Kids #7.1",
      t: t("Ажойиб озиқ занжирлари", "Удивительные пищевые цепи", "Fabulous food chains"),
      pre: t("Шер ўт емайди. Лекин у ҳам Қуёш энергиясидан фойдаланади. Қандай қилиб?", "Лев не ест траву, но тоже использует энергию Солнца. Как?", "A lion doesn’t eat grass, yet it also uses the Sun’s energy. How?"),
      k: [
        t("Продуцентлар (ўсимликлар) ўз озиғини ўзи тайёрлайди.", "Продуценты (растения) сами создают пищу.", "Producers (plants) make their own food."),
        t("Консументлар (истеъмолчилар) бошқа организмларни ейди: ўтхўр, гўштхўр, ҳаммахўр.", "Консументы едят других: травоядные, хищники, всеядные.", "Consumers eat other organisms: herbivores, carnivores, omnivores."),
        t("Стрелка «ким кимни ейди» эмас, энергия қаёққа ўтишини кўрсатади.", "Стрелка показывает, куда идёт энергия.", "The arrow shows where the energy goes.")
      ],
      q: [
        q(t("Озиқ занжиридаги стрелка нимани кўрсатади?", "Что показывает стрелка в цепи?", "What does the arrow in a food chain show?"),
          [t("Энергия қаёққа ўтишини", "Куда переходит энергия", "Where energy flows"), t("Ким катталигини", "Кто больше", "Who is bigger"), t("Ким тезроқ югуришини", "Кто быстрее", "Who runs faster")], 0, t("Ўтдан қуёнга, қуёндан тулкига.", "От травы к зайцу, от зайца к лисе.", "Grass → rabbit → fox.")),
        q(t("Одам қайси гуруҳга киради?", "К какой группе относится человек?", "Which group are humans in?"),
          [t("Продуцент", "Продуцент", "Producer"), t("Ҳаммахўр", "Всеядные", "Omnivore"), t("Парчаловчи", "Редуцент", "Decomposer")], 1, t("Одам ўсимлик ҳам, гўшт ҳам ейди.", "Человек ест и растения, и мясо.", "Humans eat both plants and meat."))
      ],
      task: t("Оилангиз билан кечки овқатдаги ҳар бир таом қайси продуцентдан бошланганини топинг.", "С семьёй найдите, с какого продуцента начинается каждое блюдо ужина.", "With your family, trace each dinner dish back to its producer.") },

    { id: "v-parchalovchi", yt: "uB61rfeeAsM", top: "asos", st: "m", lng: "en", ch: "Crash Course Kids", orig: "The Dirt on Decomposers: Crash Course Kids #7.2",
      t: t("Парчаловчилар: табиат фаррошлари", "Редуценты: уборщики природы", "Decomposers: nature’s cleaners"),
      pre: t("Кузда тўкилган барглар қаерга йўқолади?", "Куда исчезают осенние листья?", "Where do fallen autumn leaves go?"),
      k: [
        t("Парчаловчилар (бактериялар, замбуруғлар, чувалчанглар) ўлик органик моддани парчалайди.", "Редуценты (бактерии, грибы, черви) разлагают мёртвую органику.", "Decomposers (bacteria, fungi, worms) break down dead matter."),
        t("Улар озиқ моддаларни тупроққа қайтаради — ўсимликлар уни яна ишлатади.", "Они возвращают питательные вещества в почву.", "They return nutrients to the soil for plants to reuse."),
        t("Компост — парчаловчилар ёрдамида чиқиндини ўғитга айлантириш.", "Компост — превращение отходов в удобрение с помощью редуцентов.", "Compost turns waste into fertiliser with decomposers’ help.")
      ],
      q: [
        q(t("Қайси бири парчаловчи?", "Кто редуцент?", "Which is a decomposer?"),
          [t("Ёмғир чувалчанги", "Дождевой червь", "Earthworm"), t("Бургут", "Орёл", "Eagle"), t("Буғдой", "Пшеница", "Wheat")], 0, t("Чувалчанг ўлик баргларни тупроққа айлантиради.", "Червь превращает листья в почву.", "Worms turn leaves into soil.")),
        q(t("Парчаловчилар бўлмаса нима бўларди?", "Что было бы без редуцентов?", "What would happen without decomposers?"),
          [t("Ўлик модда тўпланиб, тупроқ камбағаллашарди", "Мёртвая органика копилась бы, почва беднела", "Dead matter would pile up and soil would get poorer"), t("Ҳеч нарса ўзгармасди", "Ничего", "Nothing"), t("Ўсимликлар тезроқ ўсарди", "Растения росли бы быстрее", "Plants would grow faster")], 0,
          t("Моддалар айланиши тўхтаб қоларди.", "Круговорот веществ остановился бы.", "The nutrient cycle would stop."))
      ],
      task: t("Банкада кичик компост тайёрланг: барг, мева пўчоғи, тупроқ. 3 ҳафта кузатинг ва расмга олинг.", "Сделайте мини-компост в банке: листья, очистки, земля. Наблюдайте 3 недели.", "Make a jar compost: leaves, peels, soil. Watch it for 3 weeks and take photos.") },

    /* ---------- Сув ва моддалар айланиши ---------- */
    { id: "v-suv-kids", yt: "z5G4NCwWUxY", top: "suv", st: "m", lng: "en", ch: "Crash Course Kids", orig: "The Great Aqua Adventure: Crash Course Kids #24.1",
      t: t("Сув томчисининг саёҳати", "Путешествие капли воды", "A water drop’s adventure"),
      pre: t("Сиз ичган сув томчиси илгари динозавр ичган сув бўлиши мумкинми?", "Может ли ваша вода быть той, что пил динозавр?", "Could the water you drink once have been drunk by a dinosaur?"),
      k: [
        t("Сув айланиши: буғланиш → конденсация (булут) → ёғин → оқиб йиғилиш.", "Круговорот: испарение → конденсация (облака) → осадки → сток.", "The water cycle: evaporation → condensation (clouds) → precipitation → collection."),
        t("Айланишни Қуёш иссиқлиги ва ер тортиш кучи ҳаракатлантиради.", "Его движут тепло Солнца и сила тяжести.", "It is driven by the Sun’s heat and gravity."),
        t("Ердаги сув миқдори деярли ўзгармайди — у фақат шаклини алмаштиради.", "Количество воды на Земле почти не меняется — меняется её форма.", "Earth’s amount of water barely changes — only its form does.")
      ],
      q: [
        q(t("Булут қандай жараёнда пайдо бўлади?", "При каком процессе образуются облака?", "Which process forms clouds?"),
          [t("Конденсация", "Конденсация", "Condensation"), t("Буғланиш", "Испарение", "Evaporation"), t("Эриш", "Таяние", "Melting")], 0, t("Сув буғи совиб, майда томчиларга айланади.", "Пар остывает и превращается в капли.", "Vapour cools into tiny droplets.")),
        q(t("Сув айланишини нима ҳаракатлантиради?", "Что движет круговорот воды?", "What powers the water cycle?"),
          [t("Қуёш ва ер тортиши", "Солнце и гравитация", "The Sun and gravity"), t("Шамол тегирмонлари", "Ветряки", "Windmills"), t("Ой", "Луна", "The Moon")], 0, t("Қуёш буғлантиради, тортиш кучи ёғинни ерга туширади.", "Солнце испаряет, гравитация возвращает осадки.", "The Sun evaporates, gravity brings rain down."))
      ],
      task: t("Пакетдаги сув айланиши: зич пакетга бир оз сув солиб, деразага ёпиштиринг ва 2 кун кузатинг.", "Круговорот в пакете: налейте воды в пакет, приклейте к окну, наблюдайте 2 дня.", "Water cycle in a bag: put some water in a sealed bag, tape it to a window, watch for 2 days.") },

    { id: "v-chuchuk", yt: "oaQCiwzjnCM", top: "suv", st: "m", lng: "en", ch: "Crash Course Kids", orig: "The Basics of Freshwater: Crash Course Kids 14.1",
      t: t("Чучук сув — нега кам?", "Пресная вода — почему её мало?", "Freshwater — why so little?"),
      pre: t("Ердаги сувнинг неча фоизи ичишга яроқли чучук сув деб ўйлайсиз?", "Какой процент воды на Земле пресный, как вы думаете?", "What percent of Earth’s water do you think is fresh?"),
      k: [
        t("Ердаги сувнинг тахминан 97 % и шўр (океан), фақат ~3 % и чучук.", "Около 97 % воды солёная, пресной лишь ~3 %.", "About 97% of Earth’s water is salty; only ~3% is fresh."),
        t("Чучук сувнинг катта қисми музликлар ва ер ости сувларида.", "Большая часть пресной воды — во льдах и подземных водах.", "Most freshwater is locked in ice and groundwater."),
        t("Дарё ва кўллардаги сув — жуда кичик улуш, шунинг учун уни тежаш керак.", "Реки и озёра — крошечная доля, поэтому воду надо беречь.", "Rivers and lakes are a tiny share, so water must be saved.")
      ],
      q: [
        q(t("Ердаги сувнинг қанча қисми чучук?", "Какая часть воды пресная?", "How much of Earth’s water is fresh?"),
          [t("~3 %", "~3 %", "~3%"), t("~50 %", "~50 %", "~50%"), t("~90 %", "~90 %", "~90%")], 0, t("Қолгани денгиз ва океанларда.", "Остальное — моря и океаны.", "The rest is in seas and oceans.")),
        q(t("Чучук сувнинг энг катта захираси қаерда?", "Где больше всего пресной воды?", "Where is most freshwater stored?"),
          [t("Музликларда", "В ледниках", "In glaciers and ice caps"), t("Дарёларда", "В реках", "In rivers"), t("Булутларда", "В облаках", "In clouds")], 0, t("Антарктида ва Гренландия музликлари.", "Ледники Антарктиды и Гренландии.", "Antarctic and Greenland ice."))
      ],
      task: t("Оилангиз бир кунда қанча сув ишлатишини ҳисобланг (душ, идиш, чой). 3 та тежаш усулини ёзинг.", "Посчитайте, сколько воды семья тратит за день. Предложите 3 способа экономии.", "Estimate your family’s daily water use. Write 3 ways to save it.") },

    { id: "v-suv-ru", yt: "OjCQRWvU5g0", top: "suv", st: "", lng: "ru", ch: "KhanAcademyRussian", orig: "Круговорот воды в природе (видео 1)| Экология | Биогеохимический цикл",
      t: t("Табиатда сув айланиши (биогеокимёвий цикл)", "Круговорот воды (биогеохимический цикл)", "The water cycle (biogeochemical cycle)"),
      pre: t("Ўсимликлар сув айланишида қандай иштирок этади?", "Как растения участвуют в круговороте воды?", "How do plants take part in the water cycle?"),
      k: [
        t("Транспирация — ўсимлик барглари орқали сувнинг буғланиши; бу ҳам айланишнинг бир қисми.", "Транспирация — испарение воды листьями растений.", "Transpiration is water evaporating from plant leaves."),
        t("Ер ости сувлари (аквиферлар) сувни узоқ вақт сақлайди.", "Подземные воды (водоносные слои) хранят воду долго.", "Groundwater (aquifers) stores water for a long time."),
        t("Сув айланиши иссиқликни ҳам ташийди ва иқлимга таъсир қилади.", "Круговорот переносит тепло и влияет на климат.", "The water cycle also moves heat and shapes climate.")
      ],
      q: [
        q(t("Транспирация нима?", "Что такое транспирация?", "What is transpiration?"),
          [t("Ўсимликдан сув буғланиши", "Испарение воды растениями", "Water evaporating from plants"), t("Ёмғир ёғиши", "Выпадение дождя", "Rainfall"), t("Музнинг эриши", "Таяние льда", "Ice melting")], 0, t("Барглардаги устьицалар орқали.", "Через устьица листьев.", "Through leaf stomata.")),
        q(t("Аквифер нима?", "Что такое водоносный слой?", "What is an aquifer?"),
          [t("Сув сақловчи ер ости қатлами", "Подземный слой, хранящий воду", "An underground layer holding water"), t("Булут тури", "Вид облака", "A type of cloud"), t("Сув насоси", "Насос", "A water pump")], 0, t("Қудуқлар суви шу ердан олинади.", "Отсюда берут воду колодцы.", "Wells draw water from it."))
      ],
      task: t("Боғингиздаги дарахт баргига шаффоф пакет кийгизиб 1 кун кузатинг: ичида нима пайдо бўлди?", "Наденьте прозрачный пакет на ветку дерева на сутки: что появилось внутри?", "Put a clear bag over a branch for a day: what appears inside?") },

    { id: "v-uglerod", yt: "2D7hZpIYlCA", top: "suv", st: "u", lng: "en", ch: "CrashCourse", orig: "The Hydrologic and Carbon Cycles: Always Recycle! - Crash Course Ecology #8",
      t: t("Сув ва углерод айланиши", "Круговороты воды и углерода", "The water and carbon cycles"),
      pre: t("Нефть ва кўмир ёнганда чиқадиган углерод қаердан келган?", "Откуда углерод, выделяющийся при сжигании нефти и угля?", "Where did the carbon in burning oil and coal come from?"),
      k: [
        t("Фотосинтез CO₂ ни ҳаводан олади; нафас олиш ва ёниш уни қайтаради.", "Фотосинтез забирает CO₂, дыхание и горение возвращают.", "Photosynthesis removes CO₂; respiration and burning return it."),
        t("Қазилма ёқилғилар — миллион йиллар олдинги организмлар углероди; уни ёқиб тез қайтаряпмиз.", "Ископаемое топливо — углерод древних организмов; мы быстро его возвращаем.", "Fossil fuels are ancient organisms’ carbon; burning them returns it fast."),
        t("Океан CO₂ нинг катта қисмини ютади ва бу унинг кислоталанишига олиб келади.", "Океан поглощает много CO₂, что ведёт к закислению.", "Oceans absorb much CO₂, which acidifies them.")
      ],
      q: [
        q(t("Қайси жараён ҳаводан CO₂ ни олади?", "Какой процесс убирает CO₂ из воздуха?", "Which process removes CO₂ from the air?"),
          [t("Фотосинтез", "Фотосинтез", "Photosynthesis"), t("Ёниш", "Горение", "Combustion"), t("Нафас олиш", "Дыхание", "Respiration")], 0, t("Ўсимлик CO₂ ва сувдан глюкоза ясайди.", "Растение делает глюкозу из CO₂ и воды.", "Plants build glucose from CO₂ and water.")),
        q(t("Океан кўп CO₂ ютса нима бўлади?", "Что происходит при поглощении CO₂ океаном?", "What happens when oceans absorb lots of CO₂?"),
          [t("Сув кислоталанади", "Вода закисляется", "The water acidifies"), t("Сув чучуклашади", "Вода опресняется", "The water becomes fresh"), t("Ҳеч нарса", "Ничего", "Nothing")], 0, t("CO₂ сувда карбонат кислота ҳосил қилади — маржон ва чиғаноқларга зарар.", "CO₂ образует угольную кислоту — вред кораллам.", "CO₂ forms carbonic acid, harming corals and shells."))
      ],
      task: t("Бир кунлик углерод «ҳисобингиз»: транспорт, электр, овқат. Платформадаги «Калькулятор» бўлимида текширинг.", "Посчитайте свой углеродный след за день в разделе «Калькулятор».", "Work out your one-day carbon footprint in the Calculator section.") },

    { id: "v-azot", yt: "leHy-Y_8nRs", top: "suv", st: "u", lng: "en", ch: "CrashCourse", orig: "Nitrogen & Phosphorus Cycles: Always Recycle! Part 2 - Crash Course Ecology #9",
      t: t("Азот ва фосфор айланиши", "Круговороты азота и фосфора", "Nitrogen and phosphorus cycles"),
      pre: t("Ҳаводаги азот 78 %. Нега ўсимликлар азот танқислигидан азият чекади?", "В воздухе 78 % азота. Почему растениям его не хватает?", "Air is 78% nitrogen. Why do plants still lack nitrogen?"),
      k: [
        t("Ўсимликлар N₂ ни бевосита ўзлаштира олмайди; уни бактериялар (масалан, дуккакли илдизидаги Rhizobium) боғлайди.", "Растения не усваивают N₂; его связывают бактерии (Rhizobium у бобовых).", "Plants can’t use N₂ directly; bacteria (e.g. Rhizobium in legumes) fix it."),
        t("Фосфор тоғ жинсларидан аста-секин чиқади; унинг атмосфера босқичи йўқ.", "Фосфор медленно выходит из горных пород; атмосферной фазы нет.", "Phosphorus is slowly released from rocks; it has no atmospheric phase."),
        t("Ортиқча ўғит сувга оқса эвтрофикация: сув ўтлари гуллайди, кислород тугайди.", "Избыток удобрений в воде ведёт к эвтрофикации.", "Fertiliser runoff causes eutrophication: algae bloom, oxygen runs out.")
      ],
      q: [
        q(t("Ҳаводаги азотни ким боғлайди?", "Кто связывает атмосферный азот?", "What fixes atmospheric nitrogen?"),
          [t("Азот тўпловчи бактериялар", "Азотфиксирующие бактерии", "Nitrogen-fixing bacteria"), t("Қушлар", "Птицы", "Birds"), t("Қум", "Песок", "Sand")], 0, t("Яшин ва Габер–Бош жараёни ҳам азот боғлайди.", "Также молния и процесс Габера–Боша.", "Lightning and the Haber–Bosch process too.")),
        q(t("Эвтрофикацияга нима сабаб бўлади?", "Что вызывает эвтрофикацию?", "What causes eutrophication?"),
          [t("Ортиқча азот ва фосфор", "Избыток азота и фосфора", "Excess nitrogen and phosphorus"), t("Совуқ сув", "Холодная вода", "Cold water"), t("Тузсизланиш", "Опреснение", "Desalination")], 0, t("Ўғит ва ювиш воситалари оқовалари.", "Стоки удобрений и моющих средств.", "Fertiliser and detergent runoff."))
      ],
      task: t("Яқиндаги ҳовуз ёки ариқни кузатинг: сув ўтлари кўпми? Сабабини 3 жумлада тушунтиринг.", "Понаблюдайте за ближайшим прудом: много ли водорослей? Объясните причину.", "Look at a nearby pond: is there lots of algae? Explain why in 3 sentences.") },

    /* ---------- Иқлим ўзгариши ---------- */
    { id: "v-isish", yt: "oJAbATJCugs", top: "iqlim", st: "", lng: "en", ch: "National Geographic", orig: "Global Warming 101 | National Geographic",
      t: t("Глобал исиш 101", "Глобальное потепление 101", "Global warming 101"),
      pre: t("Иссиқхона эффекти ёмонми ёки фойдалими?", "Парниковый эффект — это плохо или хорошо?", "Is the greenhouse effect bad or good?"),
      k: [
        t("Табиий иссиқхона эффекти бўлмаса, Ер ўртача −18 °C бўларди; муаммо — унинг кучайиши.", "Без естественного парникового эффекта Земля была бы около −18 °C; проблема — его усиление.", "Without the natural greenhouse effect Earth would be about −18 °C; the problem is strengthening it."),
        t("Асосий иссиқхона газлари: CO₂, метан (CH₄), азот оксиди (N₂O).", "Главные парниковые газы: CO₂, метан, закись азота.", "Main greenhouse gases: CO₂, methane, nitrous oxide."),
        t("Оқибатлар: музликлар эриши, денгиз сатҳи кўтарилиши, қурғоқчилик ва жазирама кўпайиши.", "Последствия: таяние льдов, рост уровня моря, засухи и жара.", "Effects: melting ice, rising seas, more droughts and heatwaves.")
      ],
      q: [
        q(t("Иссиқхона эффекти бўлмаса Ер қанча совуқ бўларди?", "Насколько холодной была бы Земля без парникового эффекта?", "How cold would Earth be without the greenhouse effect?"),
          [t("~−18 °C", "~−18 °C", "~−18 °C"), t("~+5 °C", "~+5 °C", "~+5 °C"), t("~−100 °C", "~−100 °C", "~−100 °C")], 0, t("Ҳозир ўртача ~+15 °C.", "Сейчас в среднем ~+15 °C.", "Today it averages ~+15 °C.")),
        q(t("Қайси бири иссиқхона гази эмас?", "Что не является парниковым газом?", "Which is NOT a greenhouse gas?"),
          [t("Азот (N₂)", "Азот (N₂)", "Nitrogen (N₂)"), t("Метан", "Метан", "Methane"), t("CO₂", "CO₂", "CO₂")], 0, t("N₂ инфрақизил нурни ютмайди.", "N₂ не поглощает ИК-излучение.", "N₂ doesn’t absorb infrared."))
      ],
      task: t("Иккита бир хил шишада термометр: бирини пакетга ўранг ва қуёшда 20 дақиқа қолдиринг. Фарқни ёзинг.", "Два термометра в банках, одну накройте пакетом, оставьте на солнце 20 минут. Сравните.", "Two jars with thermometers, cover one with a bag, leave in sun 20 min. Compare.") },

    { id: "v-sabab", yt: "G4H1N_yXBiA", top: "iqlim", st: "", lng: "en", ch: "National Geographic", orig: "Causes and Effects of Climate Change | National Geographic",
      t: t("Иқлим ўзгаришининг сабаб ва оқибатлари", "Причины и последствия изменения климата", "Causes and effects of climate change"),
      pre: t("Иқлим ва об-ҳаво бир хил нарсами?", "Климат и погода — одно и то же?", "Are climate and weather the same thing?"),
      k: [
        t("Об-ҳаво — қисқа муддатли ҳолат; иқлим — ўнлаб йиллардаги ўртача ҳолат.", "Погода — краткосрочно; климат — среднее за десятилетия.", "Weather is short-term; climate is the average over decades."),
        t("Асосий сабаб — қазилма ёқилғи ёқиш, ўрмон кесиш ва чорвачиликдан чиқадиган газлар.", "Главные причины — сжигание топлива, вырубка лесов, животноводство.", "Main causes: burning fossil fuels, deforestation and livestock."),
        t("Ўзбекистонда ҳарорат дунё ўртачасидан тезроқ ошмоқда; сув танқислиги кучаймоқда.", "В Узбекистане температура растёт быстрее средней мировой; дефицит воды усиливается.", "Uzbekistan is warming faster than the global average; water stress is growing.")
      ],
      q: [
        q(t("Иқлим нима?", "Что такое климат?", "What is climate?"),
          [t("Кўп йиллик ўртача об-ҳаво", "Многолетняя средняя погода", "Long-term average weather"), t("Бугунги ҳарорат", "Сегодняшняя температура", "Today’s temperature"), t("Ҳафталик прогноз", "Прогноз на неделю", "A weekly forecast")], 0, t("Одатда 30 йиллик ўртача олинади.", "Обычно за 30 лет.", "Usually a 30-year average.")),
        q(t("Глобал исишнинг энг катта манбаи?", "Главный источник потепления?", "The biggest source of warming?"),
          [t("Кўмир, нефть, газ ёқиш", "Сжигание угля, нефти, газа", "Burning coal, oil and gas"), t("Вулқонлар", "Вулканы", "Volcanoes"), t("Қуёш доғлари", "Солнечные пятна", "Sunspots")], 0, t("IPCC хулосаси: асосий сабаб — инсон фаолияти.", "Вывод IPCC: главная причина — человек.", "IPCC: human activity is the main cause."))
      ],
      task: t("Бувингиз ёки бобонгиздан сўранг: болалигида қиш ва ёз қандай эди? Жавобларни ҳозиргиси билан солиштиринг.", "Спросите бабушку или дедушку, какими были зимы и лета в их детстве. Сравните.", "Ask a grandparent what winters and summers were like in their childhood. Compare.") },

    { id: "v-tetris", yt: "ztWHqUFJRTs", top: "iqlim", st: "u", lng: "en", ch: "TED-Ed", orig: "Climate change: Earth's giant game of Tetris - Joss Fong",
      t: t("Иқлим ўзгариши: Ернинг улкан «Тетрис» ўйини", "Изменение климата: гигантский «Тетрис» Земли", "Climate change: Earth’s giant game of Tetris"),
      pre: t("Ваннага сув келиши кетишидан тез бўлса нима бўлади? Бу CO₂ га қандай ўхшайди?", "Если вода в ванну поступает быстрее, чем уходит — что будет? Как это похоже на CO₂?", "If water enters a bath faster than it drains, what happens? How is that like CO₂?"),
      k: [
        t("Атмосфера CO₂ ни табиий ютувчилар (ўрмон, океан) ютишидан тезроқ оляпти — газ тўпланмоқда.", "CO₂ поступает быстрее, чем его поглощают леса и океан — он накапливается.", "CO₂ is added faster than forests and oceans absorb it, so it accumulates."),
        t("Ҳатто чиқиндилар камайса ҳам, тўпланган CO₂ узоқ вақт қолади.", "Даже при снижении выбросов накопленный CO₂ остаётся надолго.", "Even if emissions fall, accumulated CO₂ stays for a long time."),
        t("Ечим — чиқиндиларни кескин камайтириш ва ютувчиларни кўпайтириш (ўрмонлар).", "Решение — резко сократить выбросы и увеличить поглотители.", "The fix: cut emissions sharply and expand sinks such as forests.")
      ],
      q: [
        q(t("CO₂ нега атмосферада тўпланмоқда?", "Почему CO₂ накапливается?", "Why is CO₂ accumulating?"),
          [t("Чиқиш ютилишдан кўп", "Выбросы больше поглощения", "Emissions exceed absorption"), t("Ўсимликлар CO₂ чиқаради", "Растения выделяют CO₂", "Plants emit CO₂"), t("Океан CO₂ ютмайди", "Океан не поглощает CO₂", "Oceans absorb none")], 0, t("Ванна мисоли.", "Пример с ванной.", "The bathtub example.")),
        q(t("Қайси бири CO₂ ютувчи (sink)?", "Что является поглотителем CO₂?", "Which is a CO₂ sink?"),
          [t("Ўрмон", "Лес", "A forest"), t("Автомобиль", "Автомобиль", "A car"), t("Цемент заводи", "Цементный завод", "A cement plant")], 0, t("Дарахтлар углеродни танасида сақлайди.", "Деревья хранят углерод.", "Trees store carbon."))
      ],
      task: t("Мактабингиз учун 5 банддан иборат «углеродни камайтириш режаси» тузинг.", "Составьте план из 5 пунктов по снижению выбросов для школы.", "Draft a 5-point carbon reduction plan for your school.") },

    { id: "v-co2", yt: "x1SgmFa0r04", top: "iqlim", st: "u", lng: "en", ch: "NASA Goddard", orig: "NASA | A Year in the Life of Earth's CO2",
      t: t("Ер CO₂ сининг бир йили (NASA модели)", "Год из жизни CO₂ Земли (модель NASA)", "A year in the life of Earth’s CO₂ (NASA)"),
      pre: t("CO₂ миқдори йил давомида ўзгарадими? Қачон кўпроқ бўлади деб ўйлайсиз?", "Меняется ли CO₂ в течение года? Когда его больше?", "Does CO₂ change during the year? When is it higher?"),
      k: [
        t("NASA GEOS-5 модели CO₂ қандай тарқалишини кўрсатади: асосий манбалар — саноат ҳудудлари.", "Модель NASA GEOS-5 показывает распространение CO₂ от промышленных районов.", "NASA’s GEOS-5 model shows CO₂ spreading from industrial regions."),
        t("Шимолий ярим шарда ёзда ўсимликлар CO₂ ни ютади, қишда концентрация ошади.", "Летом растения Северного полушария поглощают CO₂, зимой его больше.", "In northern summers plants absorb CO₂; in winter levels rise."),
        t("Шамол CO₂ ни бутун сайёра бўйлаб тарқатади — чегара йўқ.", "Ветер разносит CO₂ по всей планете — границ нет.", "Winds spread CO₂ worldwide — it knows no borders.")
      ],
      q: [
        q(t("Шимолий ярим шарда CO₂ қачон камаяди?", "Когда CO₂ снижается в Северном полушарии?", "When does CO₂ drop in the Northern Hemisphere?"),
          [t("Ёзда", "Летом", "In summer"), t("Қишда", "Зимой", "In winter"), t("Ҳеч қачон", "Никогда", "Never")], 0, t("Ўсимликлар фаол фотосинтез қилади.", "Растения активно фотосинтезируют.", "Plants photosynthesise actively.")),
        q(t("Ҳозирги атмосфера CO₂ даражаси тахминан қанча?", "Каков нынешний уровень CO₂?", "Roughly what is today’s CO₂ level?"),
          [t("420 ppm дан юқори", "Выше 420 ppm", "Above 420 ppm"), t("~280 ppm", "~280 ppm", "~280 ppm"), t("~100 ppm", "~100 ppm", "~100 ppm")], 0, t("Саноатдан олдин ~280 ppm эди (NOAA, Мауна-Лоа).", "До индустриализации ~280 ppm (NOAA, Мауна-Лоа).", "Pre-industrial was ~280 ppm (NOAA, Mauna Loa)."))
      ],
      task: t("«Онлайн маълумотлар» бўлимида бугунги CO₂ кўрсаткичини топинг ва 280 ppm билан солиштиринг (неча % ошган?).", "Найдите сегодняшний CO₂ в «Онлайн-данных» и сравните с 280 ppm.", "Find today’s CO₂ in Online data and compare with 280 ppm (percent increase?).") },

    { id: "v-dengiz", yt: "WadD54Ywvz4", top: "iqlim", st: "", lng: "en", ch: "NASA", orig: "Why is Sea Level Rising? We Asked a NASA Scientist",
      t: t("Денгиз сатҳи нега кўтарилмоқда?", "Почему растёт уровень моря?", "Why is sea level rising?"),
      pre: t("Стакандаги муз эриса, сув тошадими? Қуруқликдаги муз-чи?", "Если лёд в стакане растает, вода перельётся? А лёд на суше?", "If ice in a glass melts, does it overflow? What about ice on land?"),
      k: [
        t("Икки асосий сабаб: сувнинг исиб кенгайиши ва қуруқликдаги музликларнинг эриши.", "Две причины: тепловое расширение воды и таяние ледников на суше.", "Two main causes: warming water expands and land ice melts."),
        t("Сузувчи муз (денгиз музи) эриса сатҳ деярли ўзгармайди; Гренландия ва Антарктида музи эса сатҳни оширади.", "Плавучий лёд почти не меняет уровень; лёд Гренландии и Антарктиды — повышает.", "Floating sea ice barely changes levels; Greenland and Antarctic ice raise them."),
        t("Сунъий йўлдошлар 1993 йилдан бери денгиз сатҳини аниқ ўлчайди.", "Спутники точно измеряют уровень моря с 1993 года.", "Satellites have measured sea level precisely since 1993.")
      ],
      q: [
        q(t("Қайси муз эриса денгиз сатҳи кўтарилади?", "Таяние какого льда поднимает уровень моря?", "Melting of which ice raises sea level?"),
          [t("Қуруқликдаги музликлар", "Ледники на суше", "Land ice sheets and glaciers"), t("Сузувчи денгиз музи", "Плавучий морской лёд", "Floating sea ice"), t("Стакандаги муз", "Лёд в стакане", "Ice in a glass")], 0, t("Сузувчи муз сувни аллақачон сиқиб чиқарган.", "Плавучий лёд уже вытеснил воду.", "Floating ice already displaces its water.")),
        q(t("Сув исиганда нима бўлади?", "Что происходит с водой при нагреве?", "What happens when water warms?"),
          [t("Кенгаяди", "Расширяется", "It expands"), t("Сиқилади", "Сжимается", "It contracts"), t("Ўзгармайди", "Не меняется", "Nothing")], 0, t("Иссиқлик кенгайиши.", "Тепловое расширение.", "Thermal expansion."))
      ],
      task: t("Тажриба: икки идишга муз қўйинг — бирида сув ичида, бирида тошнинг устида. Эригач сатҳни солиштиринг.", "Опыт: лёд в воде и лёд на «суше» (камне). Сравните уровень после таяния.", "Experiment: ice floating in water vs ice on a rock above water. Compare levels after melting.") },

    { id: "v-ozon", yt: "aU6pxSNDPhs", top: "iqlim", st: "", lng: "en", ch: "National Geographic", orig: "Climate 101: Ozone Depletion | National Geographic",
      t: t("Озон қатламининг емирилиши", "Разрушение озонового слоя", "Ozone depletion"),
      pre: t("Озон қатлами ва иссиқхона эффекти бир хил муаммоми?", "Озоновый слой и парниковый эффект — одна и та же проблема?", "Are the ozone layer and the greenhouse effect the same problem?"),
      k: [
        t("Стратосферадаги озон (O₃) Қуёшнинг хавфли ультрабинафша нурларини ютади.", "Стратосферный озон поглощает опасный ультрафиолет.", "Stratospheric ozone absorbs harmful UV radiation."),
        t("Хлорфторуглеродлар (ХФУ, фреонлар) озонни парчалаган; Антарктида устида «озон тешиги» пайдо бўлган.", "Хлорфторуглероды (фреоны) разрушают озон; над Антарктидой — «озоновая дыра».", "CFCs (freons) destroyed ozone, creating the Antarctic “ozone hole”."),
        t("1987 йилги Монреал протоколи ХФУни тақиқлади — қатлам аста-секин тикланмоқда.", "Монреальский протокол 1987 г. запретил ХФУ — слой восстанавливается.", "The 1987 Montreal Protocol banned CFCs — the layer is slowly recovering.")
      ],
      q: [
        q(t("Озонни асосан нима емирган?", "Что разрушает озон?", "What mainly destroyed ozone?"),
          [t("Хлорфторуглеродлар (ХФУ)", "Хлорфторуглероды (ХФУ)", "CFCs"), t("Кислород", "Кислород", "Oxygen"), t("Сув буғи", "Водяной пар", "Water vapour")], 0, t("ХФУ совутгич ва аэрозолларда ишлатилган.", "ХФУ были в холодильниках и аэрозолях.", "CFCs were used in fridges and sprays.")),
        q(t("Қайси шартнома ХФУни тақиқлаган?", "Какой договор запретил ХФУ?", "Which treaty banned CFCs?"),
          [t("Монреал протоколи", "Монреальский протокол", "Montreal Protocol"), t("Киото протоколи", "Киотский протокол", "Kyoto Protocol"), t("Базель конвенцияси", "Базельская конвенция", "Basel Convention")], 0, t("Энг муваффақиятли экологик шартнома деб тан олинган.", "Признан самым успешным экологическим договором.", "Considered the most successful environmental treaty."))
      ],
      task: t("Уйдаги эски совутгич ёки кондиционер қандай совутувчи модда ишлатишини (ёрлиғидан) текширинг.", "Проверьте по табличке, какой хладагент в вашем холодильнике или кондиционере.", "Check the label: what refrigerant does your fridge or AC use?") },

    /* ---------- Ифлосланиш ва чиқинди ---------- */
    { id: "v-havo", yt: "e6rglsLy1Ys", top: "ifl", st: "", lng: "en", ch: "National Geographic", orig: "Air Pollution 101 | National Geographic",
      t: t("Ҳаво ифлосланиши 101", "Загрязнение воздуха 101", "Air pollution 101"),
      pre: t("Шаҳарда ҳаво қачон кўпроқ ифлос бўлади: ёзда ёки қишда? Нега?", "Когда воздух в городе грязнее: летом или зимой? Почему?", "When is city air dirtier: summer or winter? Why?"),
      k: [
        t("Асосий ифлословчилар: майда заррачалар (PM2.5, PM10), азот диоксиди, олтингугурт диоксиди, ер сатҳидаги озон.", "Главные загрязнители: PM2.5, PM10, NO₂, SO₂, приземный озон.", "Main pollutants: PM2.5, PM10, NO₂, SO₂ and ground-level ozone."),
        t("ЖССТ маълумотига кўра ҳаво ифлосланиши ҳар йили миллионлаб эрта ўлимга сабаб бўлади.", "По данным ВОЗ, загрязнение воздуха ежегодно вызывает миллионы преждевременных смертей.", "According to WHO, air pollution causes millions of premature deaths every year."),
        t("Манбалар: транспорт, иссиқлик электр станциялари, кўмир ва чиқинди ёқиш, чанг бўронлари.", "Источники: транспорт, ТЭС, сжигание угля и мусора, пыльные бури.", "Sources: traffic, power plants, burning coal and waste, dust storms.")
      ],
      q: [
        q(t("PM2.5 нима?", "Что такое PM2.5?", "What is PM2.5?"),
          [t("2,5 мкм дан кичик заррачалар", "Частицы мельче 2,5 мкм", "Particles smaller than 2.5 µm"), t("Газ тури", "Вид газа", "A gas"), t("Ёмғир тури", "Вид дождя", "A type of rain")], 0, t("Улар ўпкага чуқур киради.", "Они проникают глубоко в лёгкие.", "They go deep into the lungs.")),
        q(t("Қайси бири ҳавони энг кам ифлослайди?", "Что меньше всего загрязняет воздух?", "Which pollutes the air least?"),
          [t("Велосипед", "Велосипед", "A bicycle"), t("Кўмир печка", "Угольная печь", "A coal stove"), t("Барг ёқиш", "Сжигание листьев", "Burning leaves")], 0, t("Велосипед ёқилғи ёқмайди.", "Велосипед не сжигает топливо.", "Bikes burn no fuel."))
      ],
      task: t("«Ҳаво сифати» бўлимида шаҳрингиз AQI кўрсаткичини 5 кун ёзиб боринг ва график чизинг.", "Записывайте AQI вашего города 5 дней в разделе «Качество воздуха», постройте график.", "Log your city’s AQI for 5 days from the Air quality section and plot it.") },

    { id: "v-ifl-cc", yt: "kdDSRRCKMiI", top: "ifl", st: "u", lng: "en", ch: "CrashCourse", orig: "Pollution: Crash Course Ecology #11",
      t: t("Ифлосланиш: турлари ва манбалари", "Загрязнение: виды и источники", "Pollution: types and sources"),
      pre: t("Нуқтали ва нуқтасиз ифлосланиш манбаларига биттадан мисол келтира оласизми?", "Приведите пример точечного и диффузного источника загрязнения.", "Can you name one point and one non-point pollution source?"),
      k: [
        t("Нуқтали манба — аниқ жой (завод қувури); нуқтасиз — кенг ҳудуд (далалардан ўғит оқиши).", "Точечный источник — труба завода; диффузный — сток с полей.", "Point source: a factory pipe; non-point: runoff from fields."),
        t("Биоаккумуляция: заҳарли моддалар (симоб, ДДТ) озиқ занжири бўйлаб тўпланиб боради.", "Биоаккумуляция: токсины (ртуть, ДДТ) накапливаются по цепи питания.", "Biomagnification: toxins (mercury, DDT) build up along the food chain."),
        t("Ифлосланишни олдини олиш тозалашдан арзонроқ.", "Предотвратить загрязнение дешевле, чем очищать.", "Preventing pollution is cheaper than cleaning it up.")
      ],
      q: [
        q(t("Далалардан ўғит оқиши қандай манба?", "Сток удобрений с полей — какой источник?", "Fertiliser runoff from fields is what kind of source?"),
          [t("Нуқтасиз (диффуз)", "Диффузный", "Non-point"), t("Нуқтали", "Точечный", "Point"), t("Табиий", "Природный", "Natural")], 0, t("Аниқ битта қувури йўқ.", "Нет одной трубы.", "There is no single pipe.")),
        q(t("Биоаккумуляцияда заҳар қаерда энг кўп бўлади?", "Где больше всего токсина при биоаккумуляции?", "Where is the toxin highest in biomagnification?"),
          [t("Юқори йиртқичларда", "У высших хищников", "In top predators"), t("Ўсимликларда", "В растениях", "In plants"), t("Сувда", "В воде", "In the water")], 0, t("Ҳар бир босқичда концентрация ошади.", "Концентрация растёт на каждом звене.", "Concentration rises at each level."))
      ],
      task: t("Маҳаллангиздаги 3 та ифлосланиш манбасини топинг ва «Эко-харита»га (18+) белгиланг ёки рўйхат тузинг.", "Найдите 3 источника загрязнения в махалле и отметьте на «Эко-карте» (18+) или составьте список.", "Find 3 pollution sources in your neighbourhood; mark them on the Eco-map (18+) or list them.") },

    { id: "v-plastik", yt: "_6xlNyWPpB8", top: "ifl", st: "", lng: "en", ch: "TED-Ed", orig: "What really happens to the plastic you throw away - Emma Bryce",
      t: t("Ташланган пластик ҳақиқатан қаерга кетади?", "Куда на самом деле уходит выброшенный пластик?", "What really happens to the plastic you throw away"),
      pre: t("Пластик бутилка табиатда неча йилда парчаланади деб ўйлайсиз?", "Сколько лет разлагается пластиковая бутылка?", "How many years does a plastic bottle take to break down?"),
      k: [
        t("Пластикнинг уч йўли: қайта ишлаш, полигон ёки табиат/океан.", "Три пути пластика: переработка, полигон или природа/океан.", "Plastic has three fates: recycling, landfill or nature/ocean."),
        t("Шу пайтгача ишлаб чиқарилган пластикнинг фақат кичик қисми (~9 %) қайта ишланган.", "Переработано лишь ~9 % всего произведённого пластика.", "Only a small share (~9%) of all plastic ever made has been recycled."),
        t("Пластик йўқолмайди — микропластикка майдаланиб, балиқ ва сувга ўтади.", "Пластик не исчезает — дробится в микропластик и попадает в рыбу и воду.", "Plastic doesn’t vanish — it breaks into microplastics that enter fish and water.")
      ],
      q: [
        q(t("Пластикнинг қанча қисми қайта ишланган?", "Какая доля пластика переработана?", "How much plastic has been recycled?"),
          [t("~9 %", "~9 %", "~9%"), t("~50 %", "~50 %", "~50%"), t("~90 %", "~90 %", "~90%")], 0, t("Geyer ва б., 2017 ҳисоби.", "Оценка Geyer и др., 2017.", "Geyer et al., 2017.")),
        q(t("Микропластик нима?", "Что такое микропластик?", "What are microplastics?"),
          [t("5 мм дан кичик пластик бўлаклари", "Частицы пластика мельче 5 мм", "Plastic pieces smaller than 5 mm"), t("Янги пластик тури", "Новый вид пластика", "A new plastic type"), t("Пластик идиш", "Пластиковая посуда", "Plastic dishes")], 0, t("Улар ҳатто ичимлик сувида топилган.", "Их находят даже в питьевой воде.", "They’ve been found even in drinking water."))
      ],
      task: t("Бир ҳафта оилангиз ташлаган пластикни санаб боринг. «3D Эко-дунё»даги саралаш ўйинида машқ қилинг.", "Неделю считайте пластик, который выбрасывает семья. Потренируйтесь в сортировке в «3D Эко-мире».", "Count your family’s plastic waste for a week. Practise sorting in the 3D Eco-world game.") },

    { id: "v-inson", yt: "5eTCZ9L834s", top: "ifl", st: "u", lng: "en", ch: "CrashCourse", orig: "5 Human Impacts on the Environment: Crash Course Ecology #10",
      t: t("Инсоннинг атроф-муҳитга таъсири", "Влияние человека на окружающую среду", "Human impacts on the environment"),
      pre: t("Табиат бизга бепул қандай «хизматлар» кўрсатади? Учтасини айтинг.", "Какие бесплатные «услуги» даёт нам природа? Назовите три.", "What free “services” does nature give us? Name three."),
      k: [
        t("Экотизим хизматлари: тоза сув, чангланиш, тупроқ ҳосил бўлиши, иқлимни бошқариш.", "Экосистемные услуги: чистая вода, опыление, почвообразование, регуляция климата.", "Ecosystem services: clean water, pollination, soil formation, climate regulation."),
        t("Инсон таъсирлари: яшаш жойини йўқотиш, ифлосланиш, бегона (инвазив) турлар, ортиқча овлаш, иқлим ўзгариши.", "Воздействия: утрата местообитаний, загрязнение, инвазивные виды, перепромысел, климат.", "Impacts: habitat loss, pollution, invasive species, overharvesting, climate change."),
        t("Бу хизматларнинг иқтисодий қиймати жуда катта, лекин кўпинча ҳисобга олинмайди.", "Экономическая ценность этих услуг огромна, но её часто не учитывают.", "These services are worth enormous sums but are often ignored.")
      ],
      q: [
        q(t("Қайси бири экотизим хизмати?", "Что является экосистемной услугой?", "Which is an ecosystem service?"),
          [t("Асаларининг чанглатиши", "Опыление пчёлами", "Pollination by bees"), t("Автомобиль ишлаб чиқариш", "Производство авто", "Making cars"), t("Интернет", "Интернет", "The internet")], 0, t("Озиқ-овқатнинг катта қисми чангловчиларга боғлиқ.", "Многие продукты зависят от опылителей.", "Much of our food depends on pollinators.")),
        q(t("Инвазив тур нима?", "Что такое инвазивный вид?", "What is an invasive species?"),
          [t("Бошқа жойдан келиб, маҳаллий турларга зарар берадиган тур", "Чужеродный вид, вредящий местным", "A non-native species that harms local ones"), t("Йўқолиб кетган тур", "Вымерший вид", "An extinct species"), t("Маҳаллий тур", "Местный вид", "A native species")], 0, t("Масалан, Орол бўйидаги баъзи бегона ўтлар.", "Например, некоторые чужеродные растения.", "E.g. some alien plants."))
      ],
      task: t("Маҳаллангиз учун «экотизим хизматлари харитаси»ни чизинг: дарахтлар, ариқлар, боғлар нима беради?", "Нарисуйте карту экосистемных услуг вашей махалли.", "Draw an ecosystem-services map of your neighbourhood.") },

    /* ---------- Биохилма-хиллик ва ўрмон ---------- */
    { id: "v-bioxil", yt: "GK_vRtHJZu4", top: "bio", st: "", lng: "en", ch: "TED-Ed", orig: "Why is biodiversity so important? - Kim Preshoff",
      t: t("Биохилма-хиллик нега муҳим?", "Почему важно биоразнообразие?", "Why is biodiversity so important?"),
      pre: t("Дунёда фақат битта нав буғдой экилса нима бўлиши мумкин?", "Что будет, если во всём мире сеять только один сорт пшеницы?", "What could happen if the whole world grew only one wheat variety?"),
      k: [
        t("Биохилма-хиллик уч даражада: генетик, тур ва экотизим хилма-хиллиги.", "Три уровня: генетическое, видовое и экосистемное разнообразие.", "Three levels: genetic, species and ecosystem diversity."),
        t("Хилма-хил экотизим касаллик, қурғоқчилик каби зарбаларга чидамлироқ.", "Разнообразные экосистемы устойчивее к болезням и засухам.", "Diverse ecosystems are more resilient to disease and drought."),
        t("Таҳдидлар: яшаш жойини йўқотиш, инвазив турлар, ифлосланиш, ортиқча овлаш, иқлим ўзгариши.", "Угрозы: утрата среды, инвазивные виды, загрязнение, перепромысел, климат.", "Threats: habitat loss, invasive species, pollution, overharvesting, climate change.")
      ],
      q: [
        q(t("Биохилма-хилликнинг уч даражаси?", "Три уровня биоразнообразия?", "The three levels of biodiversity?"),
          [t("Генетик, тур, экотизим", "Генетический, видовой, экосистемный", "Genetic, species, ecosystem"), t("Ўсимлик, ҳайвон, одам", "Растения, животные, человек", "Plants, animals, people"), t("Сув, ҳаво, тупроқ", "Вода, воздух, почва", "Water, air, soil")], 0, t("Биологик хилма-хиллик конвенцияси таърифи.", "Определение Конвенции о биоразнообразии.", "Convention on Biological Diversity.")),
        q(t("Нега монокультура хавфли?", "Чем опасна монокультура?", "Why is monoculture risky?"),
          [t("Битта касаллик ҳаммасини йўқ қилиши мумкин", "Одна болезнь может уничтожить всё", "One disease can wipe it all out"), t("У жуда қиммат", "Она слишком дорогая", "It’s too expensive"), t("Ҳеч хавфи йўқ", "Никакой опасности", "It isn’t")], 0, t("Ирландиядаги картошка очарчилиги (1845–1849) мисоли.", "Пример — картофельный голод в Ирландии.", "E.g. the Irish potato famine (1845–1849)."))
      ],
      task: t("Яқин боғда 15 дақиқа давомида нечта ҳар хил ўсимлик, ҳашарот ва қуш турини кўрасиз? Рўйхат тузинг.", "За 15 минут в парке сколько разных видов растений, насекомых и птиц вы найдёте?", "In 15 minutes in a park, how many different plants, insects and birds can you find?") },

    { id: "v-ormon", yt: "Ic-J6hcSKa8", top: "bio", st: "", lng: "en", ch: "National Geographic", orig: "Climate 101: Deforestation | National Geographic",
      t: t("Ўрмонларнинг кесилиши", "Вырубка лесов", "Deforestation"),
      pre: t("Битта катта дарахт бир йилда қанча CO₂ ютиши мумкин деб ўйлайсиз?", "Сколько CO₂ поглощает одно большое дерево за год?", "How much CO₂ can one large tree absorb in a year?"),
      k: [
        t("Ўрмонлар қуруқликнинг тахминан учдан бирини эгаллайди ва катта углерод омбори.", "Леса покрывают около трети суши и хранят много углерода.", "Forests cover about a third of land and store huge amounts of carbon."),
        t("Асосий сабаблар: қишлоқ хўжалиги (яйлов, плантация), ёғоч тайёрлаш, қурилиш.", "Причины: сельское хозяйство, заготовка древесины, строительство.", "Causes: farming (pasture, plantations), logging, construction."),
        t("Кесилган ўрмон CO₂ чиқаради ва тупроқ эрозиясини кучайтиради.", "Вырубка выделяет CO₂ и усиливает эрозию почвы.", "Cutting forests releases CO₂ and speeds up soil erosion.")
      ],
      q: [
        q(t("Ўрмон кесишнинг энг катта сабаби?", "Главная причина вырубки?", "The biggest driver of deforestation?"),
          [t("Қишлоқ хўжалиги учун ер очиш", "Расчистка под сельское хозяйство", "Clearing land for farming"), t("Ўрмон ёнғини эмас, фақат шамол", "Ветер", "Wind"), t("Туризм", "Туризм", "Tourism")], 0, t("FAO маълумотига кўра асосий омил.", "Главный фактор по данным FAO.", "The main driver according to FAO.")),
        q(t("Ўрмон кесилса тупроқ билан нима бўлади?", "Что происходит с почвой после вырубки?", "What happens to soil after deforestation?"),
          [t("Эрозия кучаяди", "Усиливается эрозия", "Erosion increases"), t("Тупроқ бойийди", "Почва богатеет", "Soil gets richer"), t("Ҳеч нарса", "Ничего", "Nothing")], 0, t("Илдизлар тупроқни ушлаб турмайди.", "Корни больше не держат почву.", "No roots hold the soil."))
      ],
      task: t("Мактабингиз ҳовлисида дарахтларни санаб, «Яшил макон» учун 1 та кўчат экиш режасини тузинг.", "Посчитайте деревья во дворе школы и спланируйте посадку саженца («Яшил макон»).", "Count the trees at school and plan planting one sapling (Yashil Makon).") },

    { id: "v-tiklash", yt: "Kaeyr5-O2eU", top: "bio", st: "u", lng: "en", ch: "CrashCourse", orig: "Conservation and Restoration Ecology: Crash Course Ecology #12",
      t: t("Муҳофаза ва тиклаш экологияси", "Охрана и восстановительная экология", "Conservation and restoration ecology"),
      pre: t("Бузилган экотизимни қайта тиклаш мумкинми? Қандай мисолни биласиз?", "Можно ли восстановить разрушенную экосистему? Знаете пример?", "Can a damaged ecosystem be restored? Do you know an example?"),
      k: [
        t("Муҳофаза биологияси турларни ва яшаш жойларини сақлашга қаратилган (қўриқхоналар, Қизил китоб).", "Биология охраны сохраняет виды и местообитания (заповедники, Красная книга).", "Conservation biology protects species and habitats (reserves, Red List)."),
        t("Тиклаш экологияси бузилган ерни қайта жонлантиради: биоремедиация, маҳаллий ўсимликлар экиш.", "Восстановительная экология возрождает земли: биоремедиация, посадка местных видов.", "Restoration ecology revives damaged land: bioremediation, replanting natives."),
        t("Ўзбекистон мисоли: Орол тубида саксовул экиш — тиклаш экологиясининг амалий кўриниши.", "Пример Узбекистана: посадка саксаула на дне Арала.", "Uzbekistan’s example: planting saxaul on the dry Aral seabed.")
      ],
      q: [
        q(t("Биоремедиация нима?", "Что такое биоремедиация?", "What is bioremediation?"),
          [t("Тирик организмлар ёрдамида ифлосликни тозалаш", "Очистка с помощью живых организмов", "Cleaning pollution with living organisms"), t("Дорилар билан даволаш", "Лечение лекарствами", "Treating with medicine"), t("Бетон қуйиш", "Заливка бетона", "Pouring concrete")], 0, t("Масалан, нефтни парчаловчи бактериялар.", "Например, бактерии, разлагающие нефть.", "E.g. oil-eating bacteria.")),
        q(t("Тиклашда қайси ўсимликларни экиш маъқул?", "Какие растения лучше сажать при восстановлении?", "Which plants are best for restoration?"),
          [t("Маҳаллий турлар", "Местные виды", "Native species"), t("Ҳар қандай чиройли тур", "Любые красивые", "Any pretty plant"), t("Фақат бегона турлар", "Только чужеродные", "Only exotic species")], 0, t("Маҳаллий турлар иқлимга мослашган.", "Местные виды приспособлены к климату.", "Natives are adapted to the climate."))
      ],
      task: t("Ўзбекистон Қизил китобидан 1 та ҳайвон ва 1 та ўсимликни танлаб, уларни асраш режасини 5 жумлада ёзинг.", "Выберите из Красной книги Узбекистана 1 животное и 1 растение и напишите план их охраны.", "Pick one animal and one plant from Uzbekistan’s Red Book and write a 5-sentence protection plan.") },

    /* ---------- Ер ва чўлланиш ---------- */
    { id: "v-chol", yt: "_j1t9mdVic4", top: "yer", st: "", lng: "en", ch: "UN Expo", orig: "Desertification UNCCD (en)",
      t: t("Чўлланиш (БМТ чўлланишга қарши конвенцияси)", "Опустынивание (Конвенция ООН)", "Desertification (UNCCD)"),
      pre: t("Чўлланиш — бу чўлнинг «юриши»ми ёки ернинг бузилишими?", "Опустынивание — это «наступление пустыни» или деградация земель?", "Is desertification deserts “marching”, or land degrading?"),
      k: [
        t("Чўлланиш — қурғоқчил ҳудудларда иқлим ва инсон фаолияти таъсирида ернинг унумдорлигини йўқотиши.", "Опустынивание — деградация земель засушливых районов из-за климата и человека.", "Desertification is land degradation in drylands driven by climate and people."),
        t("Сабаблар: ортиқча мол боқиш, нотўғри суғориш (шўрланиш), ўрмон ва бутазорларни кесиш.", "Причины: перевыпас, неправильное орошение (засоление), вырубка.", "Causes: overgrazing, poor irrigation (salinisation), clearing shrubs and trees."),
        t("БМТ мақсади — «ер деградацияси нейтраллиги» (БРМ 15.3); 17 июнь — Чўлланишга қарши кураш куни.", "Цель ООН — нейтральный баланс деградации земель (ЦУР 15.3); 17 июня — День борьбы с опустыниванием.", "UN target: land degradation neutrality (SDG 15.3); 17 June is Desertification and Drought Day.")
      ],
      q: [
        q(t("Қайси бири чўлланишга олиб келади?", "Что ведёт к опустыниванию?", "Which leads to desertification?"),
          [t("Ортиқча мол боқиш", "Перевыпас скота", "Overgrazing"), t("Дарахт экиш", "Посадка деревьев", "Planting trees"), t("Томчилатиб суғориш", "Капельное орошение", "Drip irrigation")], 0, t("Ўт қоплами йўқолади, тупроқни шамол учиради.", "Травы исчезают, почву уносит ветер.", "Grass cover vanishes and wind blows soil away.")),
        q(t("Чўлланишга қарши кураш куни қачон?", "Когда День борьбы с опустыниванием?", "When is Desertification and Drought Day?"),
          [t("17 июнь", "17 июня", "17 June"), t("22 апрель", "22 апреля", "22 April"), t("5 июнь", "5 июня", "5 June")], 0, t("22 апрель — Ер куни, 5 июнь — Атроф-муҳит куни.", "22 апреля — День Земли, 5 июня — День окружающей среды.", "22 April is Earth Day, 5 June is Environment Day."))
      ],
      task: t("Вилоятингиздаги шўрланган ёки эрозияга учраган ерлар ҳақида маълумот топинг ва 2 та ечим таклиф қилинг.", "Найдите данные о засолённых землях вашей области и предложите 2 решения.", "Find data on salinised or eroded land in your region and suggest 2 solutions.") },

    { id: "v-ipcc-yer", yt: "EMFCbjPb5ng", top: "yer", st: "u", lng: "en", ch: "IPCC", orig: "Video - Special Report on Climate Change and Land",
      t: t("IPCC: Иқлим ўзгариши ва ер махсус маърузаси", "IPCC: Спецдоклад «Изменение климата и земля»", "IPCC Special Report on Climate Change and Land"),
      pre: t("Озиқ-овқат ишлаб чиқариш иқлим ўзгаришига ҳисса қўшадими?", "Влияет ли производство еды на климат?", "Does food production contribute to climate change?"),
      k: [
        t("2019 йилги маърузага кўра қишлоқ, ўрмон ва бошқа ердан фойдаланиш инсон чиқараётган иссиқхона газларининг тахминан 23 % ини беради.", "По докладу 2019 г., сельское хозяйство, леса и землепользование дают ~23 % антропогенных выбросов.", "Per the 2019 report, agriculture, forestry and other land use produce about 23% of human greenhouse emissions."),
        t("Ер ҳам манба, ҳам ютувчи: тўғри бошқарилса CO₂ ни ютади.", "Земля — и источник, и поглотитель CO₂.", "Land is both a source and a sink of CO₂."),
        t("Ечимлар: озиқ-овқат исрофини камайтириш, тупроқни асраш, ўрмонларни тиклаш.", "Решения: сократить пищевые потери, беречь почву, восстанавливать леса.", "Solutions: cut food waste, protect soil, restore forests.")
      ],
      q: [
        q(t("Ердан фойдаланиш иссиқхона газларининг тахминан қанча қисмини беради?", "Какую долю выбросов даёт землепользование?", "About what share of emissions comes from land use?"),
          [t("~23 %", "~23 %", "~23%"), t("~2 %", "~2 %", "~2%"), t("~70 %", "~70 %", "~70%")], 0, t("IPCC SRCCL, 2019.", "IPCC SRCCL, 2019.", "IPCC SRCCL, 2019.")),
        q(t("Қайси чора ер орқали иқлимга ёрдам беради?", "Какая мера помогает климату через землю?", "Which land measure helps the climate?"),
          [t("Озиқ-овқат исрофини камайтириш", "Сокращение пищевых отходов", "Reducing food waste"), t("Ўрмонни кесиш", "Вырубка леса", "Cutting forests"), t("Тупроқни ҳайдаб ташлаш", "Распахивание почвы", "Ploughing soil bare")], 0, t("Исроф бўлган озиқ ҳам ер, сув ва энергия исрофи.", "Выброшенная еда — потерянные земля, вода и энергия.", "Wasted food wastes land, water and energy too."))
      ],
      task: t("Оилангизнинг бир ҳафталик овқат исрофини тортиб ёки санаб ёзинг ва уни ярмига қисқартириш режасини тузинг.", "Взвесьте пищевые отходы семьи за неделю и составьте план сократить их вдвое.", "Track your family’s food waste for a week and plan to halve it.") },

    /* ---------- Орол фожиаси ---------- */
    { id: "v-orol-ular", yt: "Y0Z4-pRRDww", top: "orol", st: "", lng: "uz", ch: "Ular", orig: "Orol dengizi. Hujjatli film / The Aral Sea. Documentary (ENG subtitles)",
      t: t("Орол денгизи (ҳужжатли фильм)", "Аральское море (документальный фильм)", "The Aral Sea (documentary)"),
      pre: t("1960 йилда Орол дунёдаги нечанчи энг катта кўл эди?", "Каким по величине озером мира был Арал в 1960 г.?", "How large a lake was the Aral in 1960 compared with others?"),
      k: [
        t("1960 йилларда Орол дунёдаги тўртинчи энг катта кўл эди (~68 минг км²).", "В 1960-х Арал был четвёртым по величине озером мира (~68 тыс. км²).", "In the 1960s the Aral was the world’s fourth-largest lake (~68,000 km²)."),
        t("Амударё ва Сирдарё суви пахта далаларини суғоришга бурилгач, денгиз тез қуриди.", "После отвода вод Амударьи и Сырдарьи на хлопок море быстро высохло.", "After the Amu Darya and Syr Darya were diverted for cotton, the sea dried quickly."),
        t("Қуриган тубда Оролқум чўли пайдо бўлди; туз-чанг бўронлари аҳоли саломатлигига зарар бермоқда.", "На дне появилась пустыня Аралкум; солевые бури вредят здоровью.", "The Aralkum desert formed on the seabed; salt-dust storms harm people’s health.")
      ],
      q: [
        q(t("Орол қуришининг асосий сабаби?", "Главная причина высыхания Арала?", "The main reason the Aral dried up?"),
          [t("Дарёлар суви суғоришга бурилди", "Воду рек отвели на орошение", "River water was diverted for irrigation"), t("Ер силкиниши", "Землетрясение", "An earthquake"), t("Ёмғир кўпайди", "Стало больше дождей", "More rain")], 0, t("Асосан пахта монокультураси учун.", "В основном для хлопка.", "Mainly for cotton.")),
        q(t("Орол тубида қайси чўл пайдо бўлди?", "Какая пустыня возникла на дне?", "Which desert formed on the seabed?"),
          [t("Оролқум", "Аралкум", "Aralkum"), t("Қизилқум", "Кызылкум", "Kyzylkum"), t("Сахрои Кабир", "Сахара", "Sahara")], 0, t("Энг ёш чўллардан бири.", "Одна из самых молодых пустынь.", "One of the youngest deserts."))
      ],
      task: t("Мўйноқ ёки Нукусда яшовчи танишингиздан ёки манбалардан Орол ҳақида 3 та ҳаётий ҳикоя йиғинг.", "Соберите 3 жизненные истории об Арале у знакомых или из источников.", "Collect 3 real-life stories about the Aral from people or sources.") },

    { id: "v-orol-uz24", yt: "wtRHi8AAdP4", top: "orol", st: "", lng: "uz", ch: "Ministry of Foreign Affairs, Uzbekistan", orig: "Orol fojiasi - olam muammosi (O‘zbekiston24)",
      t: t("Орол фожиаси — олам муаммоси", "Трагедия Арала — проблема мира", "The Aral tragedy — a global problem"),
      pre: t("Нега Орол муаммоси фақат Ўзбекистон ва Қозоғистоннинг эмас, бутун дунёнинг муаммоси?", "Почему проблема Арала касается всего мира?", "Why is the Aral problem a global one, not just regional?"),
      k: [
        t("Орол ҳудудидан кўтарилган туз ва чанг минглаб километрга тарқалади.", "Соль и пыль с Арала разносятся на тысячи километров.", "Salt and dust from the Aral travel thousands of kilometres."),
        t("БМТ Бош Ассамблеяси 2021 йилда Орол бўйини экологик инновациялар ва технологиялар ҳудуди деб эълон қилди.", "Генассамблея ООН в 2021 г. объявила Приаралье зоной экологических инноваций и технологий.", "In 2021 the UN General Assembly declared the Aral region a zone of ecological innovations and technologies."),
        t("Орол бўйи учун Инсон хавфсизлиги бўйича кўп шерикли траст фонди ташкил этилган (2018).", "Создан Многопартнёрский трастовый фонд ООН по безопасности человека для Приаралья (2018).", "A UN Multi-Partner Human Security Trust Fund for the Aral Sea region was set up in 2018.")
      ],
      q: [
        q(t("БМТ Орол бўйини қандай ҳудуд деб эълон қилган?", "Как ООН назвала Приаралье?", "What did the UN declare the Aral region?"),
          [t("Экологик инновациялар ва технологиялар ҳудуди", "Зоной экологических инноваций и технологий", "A zone of ecological innovations and technologies"), t("Туристик зона", "Туристической зоной", "A tourist zone"), t("Ҳарбий зона", "Военной зоной", "A military zone")], 0, t("2021 йил 18 май резолюцияси.", "Резолюция от 18 мая 2021 г.", "Resolution of 18 May 2021.")),
        q(t("Нега Орол муаммоси глобал?", "Почему проблема глобальная?", "Why is the problem global?"),
          [t("Туз-чанг узоқларга тарқалади ва иқлимга таъсир қилади", "Соль и пыль разносятся далеко и влияют на климат", "Salt dust spreads far and affects climate"), t("Фақат балиқчилар учун муҳим", "Важно только рыбакам", "It only matters to fishers"), t("Глобал эмас", "Не глобальная", "It isn’t")], 0, t("Чанг ҳатто музликларга ҳам тушади.", "Пыль оседает даже на ледниках.", "Dust even settles on glaciers."))
      ],
      task: t("Орол бўйини қутқариш бўйича ўз «инновацион ғоянгиз»ни 1 саҳифада ёзинг («Лойиҳалар» бўлимидаги Lean Canvas’дан фойдаланинг).", "Опишите свою инновационную идею для Приаралья на 1 странице (используйте Lean Canvas в «Проектах»).", "Write a one-page innovative idea for the Aral region (use Lean Canvas in Projects).") },

    { id: "v-orol-xurmo", yt: "RF1luce2eS8", top: "orol", st: "", lng: "uz", ch: "XURMO", orig: "Orol dengizi fojiasi. Orol: oʻlimdan keyin hayot mavjudmi? Ekologiya.",
      t: t("Орол: ўлимдан кейин ҳаёт борми?", "Арал: есть ли жизнь после смерти?", "Aral: is there life after death?"),
      pre: t("Қуриган денгиз тубида нималар яшаши мумкин деб ўйлайсиз?", "Что может жить на высохшем дне моря?", "What do you think can live on a dried seabed?"),
      k: [
        t("Қуриган тубда тузга чидамли ўсимликлар (саксовул, қандим, черкез) ўса олади.", "На дне растут солеустойчивые растения (саксаул, джузгун, черкез).", "Salt-tolerant plants (saxaul, calligonum, salsola) can grow on the seabed."),
        t("Саксовул илдизлари қумни ушлаб, чанг бўронларини камайтиради.", "Корни саксаула закрепляют песок и уменьшают пыльные бури.", "Saxaul roots hold sand and reduce dust storms."),
        t("2018 йилдан бери Орол тубида миллион гектарлаб яшил қопламалар барпо этилмоқда.", "С 2018 года на дне Арала создаются миллионы гектаров зелёных покрытий.", "Since 2018 millions of hectares of green cover have been planted on the Aral seabed.")
      ],
      q: [
        q(t("Орол тубида қайси ўсимлик кўп экилмоқда?", "Какое растение массово сажают на дне?", "Which plant is widely planted on the seabed?"),
          [t("Саксовул", "Саксаул", "Saxaul"), t("Шолғом", "Репа", "Turnip"), t("Шоли", "Рис", "Rice")], 0, t("Қурғоқчилик ва шўрга чидамли.", "Устойчив к засухе и соли.", "Drought- and salt-tolerant.")),
        q(t("Саксовул нима учун фойдали?", "Чем полезен саксаул?", "Why is saxaul useful?"),
          [t("Қумни мустаҳкамлайди", "Закрепляет пески", "It stabilises sand"), t("Кўп сув ичади", "Пьёт много воды", "It drinks lots of water"), t("Мева беради", "Даёт фрукты", "It bears fruit")], 0, t("Чанг-туз бўронлари камаяди.", "Меньше солевых бурь.", "Fewer salt-dust storms."))
      ],
      task: t("Саксовул ва бошқа чўл ўсимликлари ҳақида 5 та қизиқ фактни ёзинг ва расм чизинг.", "Запишите 5 фактов о саксауле и пустынных растениях, нарисуйте.", "Write 5 facts about saxaul and desert plants and draw them.") },

    { id: "v-orol-ru", yt: "FR2bauNYN9w", top: "orol", st: "u", lng: "ru", ch: "Frame Studio", orig: "Последние вздохи Арала - документальный фильм об исчезновении Аральского моря.",
      t: t("Оролнинг сўнгги нафаси (ҳужжатли фильм)", "Последние вздохи Арала", "The Aral’s last breaths (documentary)"),
      pre: t("Шимолий Орол нега қисман тикланди? Тахмин қилинг.", "Почему Северный Арал частично восстановился? Предположите.", "Why did the North Aral partly recover? Guess."),
      k: [
        t("Денгиз шимолий (Кичик) ва жанубий (Катта) Оролга бўлиниб кетди.", "Море разделилось на Северный (Малый) и Южный (Большой) Арал.", "The sea split into the North (Small) and South (Large) Aral."),
        t("Қозоғистондаги Кўкарал тўғони (2005) Шимолий Оролда сув сатҳини кўтарди ва балиқчилик қайтди.", "Кокаральская плотина (2005) подняла уровень Малого Арала, вернулась рыбалка.", "Kazakhstan’s Kokaral Dam (2005) raised the North Aral and fishing returned."),
        t("Жанубий Оролни тўлиқ тиклаш реал эмас; мақсад — одамлар ҳаётини яхшилаш ва тубни яшиллаш.", "Полное восстановление Южного Арала нереально; цель — жизнь людей и озеленение дна.", "Fully restoring the South Aral is unrealistic; the goal is better lives and greening the seabed.")
      ],
      q: [
        q(t("Кўкарал тўғони қайси қисмни сақлаб қолди?", "Какую часть спасла Кокаральская плотина?", "Which part did the Kokaral Dam save?"),
          [t("Шимолий (Кичик) Орол", "Северный (Малый) Арал", "The North (Small) Aral"), t("Жанубий Орол", "Южный Арал", "The South Aral"), t("Каспий", "Каспий", "The Caspian")], 0, t("2005 йилда қурилган.", "Построена в 2005 г.", "Built in 2005.")),
        q(t("Орол сувининг шўрлиги қуриш билан қандай ўзгарди?", "Как менялась солёность при высыхании?", "How did salinity change as it dried?"),
          [t("Кескин ошди", "Резко выросла", "It rose sharply"), t("Камайди", "Снизилась", "It fell"), t("Ўзгармади", "Не изменилась", "No change")], 0, t("Сув буғланади, туз қолади.", "Вода испаряется, соль остаётся.", "Water evaporates, salt stays."))
      ],
      task: t("1960, 1990 ва бугунги Орол харитасини солиштиринг (3D лаб ёки «Онлайн маълумотлар»), майдон ўзгаришини фоизда ҳисобланг.", "Сравните карты Арала 1960, 1990 и сегодня, посчитайте изменение площади в %.", "Compare Aral maps from 1960, 1990 and today; calculate the area change in %.") },

    /* ---------- Тоза энергия ---------- */
    { id: "v-quyosh", yt: "xKxrkht7CpY", top: "energ", st: "", lng: "en", ch: "TED-Ed", orig: "How do solar panels work? - Richard Komp",
      t: t("Қуёш панеллари қандай ишлайди?", "Как работают солнечные панели?", "How do solar panels work?"),
      pre: t("Қуёш панели булутли кунда ҳам электр берадими?", "Даёт ли панель ток в облачный день?", "Does a solar panel work on a cloudy day?"),
      k: [
        t("Фотоэлектрик эффект: ёруғлик заррачалари (фотонлар) кремнийдан электронларни уриб чиқаради.", "Фотоэффект: фотоны выбивают электроны из кремния.", "Photovoltaic effect: photons knock electrons loose in silicon."),
        t("n- ва p-типли кремний қатламлари электр майдони ҳосил қилиб, электронларни бир томонга йўналтиради — ток пайдо бўлади.", "Слои n- и p-кремния создают поле и направляют электроны — возникает ток.", "n- and p-type silicon layers create a field that drives electrons — a current flows."),
        t("Ўзбекистон йилига 300 кунга яқин қуёшли — қуёш энергетикаси учун қулай.", "В Узбекистане около 300 солнечных дней в году — удобно для солнечной энергетики.", "Uzbekistan has nearly 300 sunny days a year — good for solar power.")
      ],
      q: [
        q(t("Қуёш панеллари асосан қайси материалдан?", "Из какого материала в основном делают панели?", "Solar panels are mostly made of?"),
          [t("Кремний", "Кремний", "Silicon"), t("Мис", "Медь", "Copper"), t("Темир", "Железо", "Iron")], 0, t("Кремний — ярим ўтказгич.", "Кремний — полупроводник.", "Silicon is a semiconductor.")),
        q(t("Қуёш панелида энергия қандай айланади?", "Какое превращение энергии в панели?", "What energy conversion happens in a panel?"),
          [t("Ёруғлик → электр", "Свет → электричество", "Light → electricity"), t("Иссиқлик → ёруғлик", "Тепло → свет", "Heat → light"), t("Электр → ёруғлик", "Электричество → свет", "Electricity → light")], 0, t("Фотоэлектрик эффект.", "Фотоэффект.", "The photovoltaic effect."))
      ],
      task: t("Уйингиз томи учун қуёш панели ҳисоби: 1 кВт панел кунига ~5 кВт·соат беради. Ойлик электр ҳисобингизнинг қанчасини қоплайди?", "Посчитайте: 1 кВт панелей даёт ~5 кВт·ч в день. Какую часть вашего счёта за свет покроет?", "Estimate: 1 kW of panels gives ~5 kWh a day. How much of your electricity bill would it cover?") },
    /* ================= 2026-10-17: рус ва инглиз тилидаги қўшимча видео дарслар =================
       Ҳар бир ҳавола 2026-10-17 куни YouTube oEmbed орқали текширилди (мавжуд ва embed рухсат этилган).
       «sum» — дарснинг қисқача мазмуни, «au» — маъруза муаллифи (маълум бўлса), «ck» — текширилган сана. */

    /* ---------- Экология асослари (рус/инглиз) ---------- */
    { id: "v-biotsenoz-ru", yt: "gKncIk_UJ8M", top: "asos", st: "m", lng: "ru", ch: "Разумейкин", orig: "Экосистема и биоценоз", ck: "2026-10-17",
      t: t("Экотизим ва биоценоз", "Экосистема и биоценоз", "Ecosystem and biocenosis"),
      sum: t("Биоценоз — бир жойда яшайдиган барча тирик мавжудотлар жамоаси. У жонсиз муҳит (биотоп) билан бирга экотизимни ташкил қилади.", "Биоценоз — сообщество всех живых организмов одного места. Вместе с неживой средой (биотопом) оно образует экосистему.", "A biocenosis is the community of all living things in one place. Together with the non-living habitat (biotope) it forms an ecosystem."),
      pre: t("Ҳовуз ва ундаги барча балиқ, ўсимлик ва ҳашаротлар — битта тизимми? Нега?", "Пруд со всеми рыбами, растениями и насекомыми — это одна система? Почему?", "Is a pond with all its fish, plants and insects one system? Why?"),
      k: [
        t("Биоценоз — ўсимлик, ҳайвон, замбуруғ ва микроорганизмларнинг бирга яшайдиган жамоаси.", "Биоценоз — совместно живущее сообщество растений, животных, грибов и микроорганизмов.", "A biocenosis is a community of plants, animals, fungi and microbes living together."),
        t("Биотоп — жонсиз яшаш муҳити: сув, тупроқ, ҳаво, ёруғлик, ҳарорат.", "Биотоп — неживая среда: вода, почва, воздух, свет, температура.", "A biotope is the non-living setting: water, soil, air, light, temperature."),
        t("Биоценоз + биотоп = экотизим (биогеоценоз): ўрмон, ўтлоқ, ҳовуз, тўқай.", "Биоценоз + биотоп = экосистема (биогеоценоз): лес, луг, пруд, тугай.", "Biocenosis + biotope = an ecosystem: a forest, a meadow, a pond, a riverside tugai.")
      ],
      q: [
        q(t("Биотоп нима?", "Что такое биотоп?", "What is a biotope?"),
          [t("Тирик организмлар жамоаси", "Сообщество организмов", "A community of organisms"), t("Жонсиз яшаш муҳити", "Неживая среда обитания", "The non-living habitat"), t("Битта тур", "Один вид", "A single species")], 1,
          t("Биотоп — сув, тупроқ, ҳаво каби жонсиз шароитлар.", "Биотоп — неживые условия: вода, почва, воздух.", "A biotope is the non-living conditions: water, soil, air.")),
        q(t("Қайси бири экотизим?", "Что из этого экосистема?", "Which one is an ecosystem?"),
          [t("Ҳовуз ва ундаги барча тирик мавжудотлар", "Пруд со всеми живыми существами", "A pond with all its living things"), t("Битта қурбақа", "Одна лягушка", "One frog"), t("Бир сиқим қум", "Горсть песка", "A handful of sand")], 0,
          t("Экотизимда тирик ва жонсиз қисмлар бирга бўлади.", "В экосистеме есть и живые, и неживые части.", "An ecosystem has both living and non-living parts."))
      ],
      task: t("Мактаб ҳовлиси ёки боғни кузатиб, 5 та тирик ва 3 та жонсиз компонентни ёзинг ва уларни стрелкалар билан боғланг.", "Понаблюдайте за школьным двором или парком: запишите 5 живых и 3 неживых компонента и соедините их стрелками.", "Observe your schoolyard or a park: list 5 living and 3 non-living parts and link them with arrows.") },

    { id: "v-ekotizim-ru", yt: "NJxScXaSOJA", top: "asos", st: "", lng: "ru", ch: "Творцы-Создатели Экосистем", orig: "Что такое экосистема и как она работает?", ck: "2026-10-17",
      t: t("Экотизим қандай ишлайди", "Как работает экосистема", "How an ecosystem works"),
      sum: t("Экотизимда продуцентлар, консументлар ва редуцентлар бор: энергия бир томонга оқади, моддалар эса қайта-қайта айланади.", "В экосистеме есть продуценты, консументы и редуценты: энергия течёт в одну сторону, а вещества движутся по кругу.", "An ecosystem has producers, consumers and decomposers: energy flows one way while matter cycles again and again."),
      pre: t("Ўрмонда йиллаб барг тўкилади. Нега ўрмон баргга кўмилиб кетмайди?", "В лесу годами опадают листья. Почему лес не утопает в листве?", "Leaves fall in a forest every year. Why isn’t the forest buried in leaves?"),
      k: [
        t("Продуцентлар (ўсимликлар) Қуёш энергиясидан органик модда ҳосил қилади.", "Продуценты (растения) создают органику за счёт энергии Солнца.", "Producers (plants) make organic matter using the Sun’s energy."),
        t("Консументлар (ҳайвонлар) тайёр органик модда билан озиқланади.", "Консументы (животные) питаются готовой органикой.", "Consumers (animals) feed on ready-made organic matter."),
        t("Редуцентлар (замбуруғ, бактерия) ўлик қолдиқни парчалаб, минералларни тупроққа қайтаради — моддалар айланади, энергия эса иссиқлик бўлиб тарқалади.", "Редуценты (грибы, бактерии) разлагают остатки и возвращают минералы в почву — вещества циркулируют, а энергия рассеивается теплом.", "Decomposers (fungi, bacteria) break down remains and return minerals to the soil — matter cycles while energy leaves as heat.")
      ],
      q: [
        q(t("Редуцентлар нима қилади?", "Что делают редуценты?", "What do decomposers do?"),
          [t("Ўлик органик моддани парчалайди", "Разлагают мёртвую органику", "Break down dead organic matter"), t("Фотосинтез қилади", "Фотосинтезируют", "Photosynthesise"), t("Фақат ов қилади", "Только охотятся", "Only hunt")], 0,
          t("Улар минералларни тупроққа қайтаради.", "Они возвращают минералы в почву.", "They return minerals to the soil.")),
        q(t("Экотизимда нима айланма ҳаракат қилади?", "Что в экосистеме движется по кругу?", "What cycles in an ecosystem?"),
          [t("Моддалар (C, N, P, сув)", "Вещества (C, N, P, вода)", "Matter (C, N, P, water)"), t("Қуёш энергияси", "Солнечная энергия", "Solar energy"), t("Ҳеч нарса", "Ничего", "Nothing")], 0,
          t("Энергия оқади ва йўқолади, моддалар эса қайта ишлатилади.", "Энергия течёт и теряется, а вещества используются повторно.", "Energy flows and is lost; matter is reused."))
      ],
      task: t("Шиша банкага тупроқ, барг ва мева пўсти солиб «компост ойнаси» ясанг ва 2 ҳафта давомида ўзгаришни ёзиб боринг.", "Сделайте «окно компоста»: банка с почвой, листьями и очистками. Записывайте изменения 2 недели.", "Make a “compost window”: a jar with soil, leaves and peels. Record the changes for 2 weeks.") },

    { id: "v-jonli-ru", yt: "ygFY8RNgTd8", top: "asos", st: "m", lng: "ru", ch: "Разумейкин", orig: "Живая и неживая природа. Сайт - игра Разумейкин", ck: "2026-10-17",
      t: t("Жонли ва жонсиз табиат", "Живая и неживая природа", "Living and non-living nature"),
      sum: t("Кичик ўқувчилар учун: жонли табиат белгилари (нафас олиш, озиқланиш, ўсиш, кўпайиш) ва жонсиз табиат билан боғлиқлиги.", "Для младших школьников: признаки живой природы (дыхание, питание, рост, размножение) и её связь с неживой.", "For young learners: signs of life (breathing, feeding, growing, reproducing) and how living nature depends on non-living nature."),
      pre: t("Булут жонлими? Нега шундай деб ўйлайсиз?", "Облако живое? Почему вы так думаете?", "Is a cloud alive? Why do you think so?"),
      k: [
        t("Жонли мавжудот нафас олади, озиқланади, ўсади, кўпаяди ва ўлади.", "Живое дышит, питается, растёт, размножается и умирает.", "Living things breathe, feed, grow, reproduce and die."),
        t("Жонсиз табиат: тош, сув, ҳаво, тупроқ, Қуёш, булут.", "Неживая природа: камни, вода, воздух, почва, Солнце, облака.", "Non-living nature: rocks, water, air, soil, the Sun, clouds."),
        t("Жонли табиат жонсизсиз яшай олмайди: ўсимликка сув, ёруғлик ва ҳаво керак.", "Живое не может без неживого: растению нужны вода, свет и воздух.", "Life needs non-living nature: a plant needs water, light and air.")
      ],
      q: [
        q(t("Қайси бири жонли?", "Что из этого живое?", "Which one is living?"),
          [t("Қўзиқорин", "Гриб", "A mushroom"), t("Тош", "Камень", "A rock"), t("Булут", "Облако", "A cloud")], 0,
          t("Қўзиқорин ўсади ва кўпаяди.", "Гриб растёт и размножается.", "A mushroom grows and reproduces.")),
        q(t("Ўсимлик жонсиз табиатдан нима олади?", "Что растение берёт у неживой природы?", "What does a plant take from non-living nature?"),
          [t("Сув, ёруғлик ва ҳаво", "Воду, свет и воздух", "Water, light and air"), t("Фақат тош", "Только камни", "Only rocks"), t("Ҳеч нарса", "Ничего", "Nothing")], 0,
          t("Шуларсиз фотосинтез бўлмайди.", "Без них не будет фотосинтеза.", "Without them there is no photosynthesis."))
      ],
      task: t("10 та нарсани «жонли» ва «жонсиз» деб икки устунга ажратинг ва дўстингиз билан солиштиринг.", "Разделите 10 предметов на «живое» и «неживое» и сравните с другом.", "Sort 10 things into “living” and “non-living” and compare with a friend.") },

    { id: "v-ekotizim-cc", yt: "v6ubvEJ3KGM", top: "asos", st: "u", lng: "en", ch: "CrashCourse", orig: "Ecosystem Ecology: Links in the Chain - Crash Course Ecology #7", ck: "2026-10-17",
      t: t("Экотизим экологияси: занжир ҳалқалари", "Экология экосистем: звенья цепи", "Ecosystem ecology: links in the chain"),
      sum: t("Трофик даражалар, «10 фоиз қоидаси», биомасса пирамидаси ва калит турлар экотизимни қандай бошқариши.", "Трофические уровни, «правило 10 %», пирамида биомассы и роль ключевых видов.", "Trophic levels, the 10% rule, biomass pyramids and how keystone species shape ecosystems."),
      pre: t("Нега дунёда шерлар чигирткалардан кўра анча кам?", "Почему львов в мире намного меньше, чем кузнечиков?", "Why are there far fewer lions than grasshoppers?"),
      k: [
        t("Трофик даражалар: продуцент → бирламчи консумент → иккиламчи → учламчи.", "Трофические уровни: продуцент → консумент I → II → III порядка.", "Trophic levels: producer → primary → secondary → tertiary consumer."),
        t("Ҳар бир кейинги даражага энергиянинг тахминан 10 фоизи ўтади, қолгани нафас олиш ва иссиқликка кетади.", "На следующий уровень переходит около 10 % энергии, остальное уходит на дыхание и тепло.", "About 10% of energy passes to the next level; the rest goes to respiration and heat."),
        t("Калит тур (масалан, денгиз сувсари) сонига нисбатан экотизимга жуда катта таъсир кўрсатади.", "Ключевой вид (например, калан) влияет на экосистему сильнее, чем можно ждать по его численности.", "A keystone species (e.g. the sea otter) has an effect far larger than its numbers suggest.")
      ],
      q: [
        q(t("«10 фоиз қоидаси» нима?", "Что такое «правило 10 %»?", "What is the 10% rule?"),
          [t("Ҳар бир даражага энергиянинг ~10 % ўтади", "На каждый уровень переходит ~10 % энергии", "~10% of energy passes to each level"), t("Турларнинг 10 % йиртқич", "10 % видов — хищники", "10% of species are predators"), t("Экотизимнинг 10 % сув", "10 % экосистемы — вода", "10% of an ecosystem is water")], 0,
          t("Шунинг учун озиқ занжири 4–5 ҳалқадан узун бўлмайди.", "Поэтому цепи редко длиннее 4–5 звеньев.", "That’s why food chains rarely exceed 4–5 links.")),
        q(t("Калит тур нима?", "Что такое ключевой вид?", "What is a keystone species?"),
          [t("Сонидан кўра катта таъсир кўрсатадиган тур", "Вид с влиянием больше своей численности", "A species with an impact larger than its numbers"), t("Энг кўп тур", "Самый многочисленный вид", "The most numerous species"), t("Энг катта ҳайвон", "Самое крупное животное", "The biggest animal")], 0,
          t("У йўқолса, бутун жамоа ўзгаради.", "Его исчезновение меняет всё сообщество.", "If it disappears the whole community changes."))
      ],
      task: t("Ўтлоқ пирамидасини чизинг: ўтда 10 000 кЖ энергия бўлса, учинчи даражадаги йиртқичга қанча етади?", "Нарисуйте пирамиду луга: если у травы 10 000 кДж, сколько достанется хищнику третьего порядка?", "Draw a meadow pyramid: if grass holds 10,000 kJ, how much reaches a third-level predator?") },

    { id: "v-jamoa-cc", yt: "GxE1SSqbSn4", top: "asos", st: "u", lng: "en", ch: "CrashCourse", orig: "Community Ecology: Feel the Love - Crash Course Ecology #4", ck: "2026-10-17",
      t: t("Жамоа экологияси: турлараро муносабатлар", "Экология сообществ: взаимоотношения видов", "Community ecology: how species interact"),
      sum: t("Рақобат, экологик бўшлиқ (ниша), Гаузе принципи, ресурсларни бўлишиш ва симбиоз шакллари.", "Конкуренция, экологическая ниша, принцип Гаузе, разделение ресурсов и формы симбиоза.", "Competition, niches, Gause’s principle, resource partitioning and forms of symbiosis."),
      pre: t("Бир дарахтда яшайдиган икки хил қуш нега бир-бирини қувиб чиқармайди?", "Почему два вида птиц на одном дереве не вытесняют друг друга?", "Why don’t two bird species on one tree drive each other out?"),
      k: [
        t("Конкурент истисно принципи (Гаузе): бир хил нишадаги икки тур узоқ вақт бирга яшай олмайди.", "Принцип конкурентного исключения (Гаузе): два вида с одной нишей не уживутся долго.", "Competitive exclusion (Gause): two species with the same niche cannot coexist for long."),
        t("Ресурсларни бўлишиш: турлар турли баландлик, вақт ёки озиқни танлаб рақобатдан қочади.", "Разделение ресурсов: виды уходят от конкуренции, выбирая разную высоту, время или пищу.", "Resource partitioning: species avoid competition by using different heights, times or foods."),
        t("Мутуализм — иккаласига фойда; комменсализм — бирига фойда, бошқасига фарқсиз; паразитизм — бирига зарар.", "Мутуализм — польза обоим; комменсализм — одному польза, другому всё равно; паразитизм — вред одному.", "Mutualism helps both; commensalism helps one and leaves the other unaffected; parasitism harms one.")
      ],
      q: [
        q(t("Мутуализм нима?", "Что такое мутуализм?", "What is mutualism?"),
          [t("Иккала тур фойда кўради", "Оба вида получают пользу", "Both species benefit"), t("Бири зарар кўради", "Один вид страдает", "One species is harmed"), t("Иккаласи зарар кўради", "Оба страдают", "Both are harmed")], 0,
          t("Масалан, асалари ва гул.", "Например, пчела и цветок.", "For example, a bee and a flower.")),
        q(t("Гаузе принципи нимани айтади?", "О чём принцип Гаузе?", "What does Gause’s principle say?"),
          [t("Бир хил нишадаги икки тур узоқ бирга яшай олмайди", "Два вида с одной нишей долго не уживутся", "Two species with one niche can’t coexist long"), t("Ҳамма турлар дўст", "Все виды дружат", "All species are friends"), t("Йиртқич доим ютади", "Хищник всегда побеждает", "The predator always wins")], 0,
          t("Улардан бири ютқазади ёки нишасини ўзгартиради.", "Один проиграет или сменит нишу.", "One loses or shifts its niche."))
      ],
      task: t("Ўзбекистон табиатидан мутуализм, комменсализм ва паразитизмга биттадан мисол топинг ва изоҳланг.", "Найдите в природе Узбекистана по примеру мутуализма, комменсализма и паразитизма.", "Find one Uzbek example each of mutualism, commensalism and parasitism.") },

    { id: "v-ekotizim-geo", yt: "KQF9WdZrH_c", top: "asos", st: "u", lng: "en", ch: "CrashCourse", orig: "What Are Ecosystems? Crash Course Geography #15", ck: "2026-10-17",
      t: t("Экотизимлар нима? (география нуқтаи назаридан)", "Что такое экосистемы? (взгляд географии)", "What are ecosystems? (a geography view)"),
      sum: t("Экотизим ва биом тушунчалари, иқлим (ҳарорат ва ёғин) табиат зоналарини қандай белгилаши.", "Понятия экосистемы и биома; как климат (температура и осадки) задаёт природные зоны.", "Ecosystems and biomes, and how climate (temperature and rainfall) sets natural zones."),
      pre: t("Нега Сурхондарё ва Тошкент вилоятининг тоғларида табиат шунчалик фарқ қилади?", "Почему природа Сурхандарьи и гор Ташкентской области так различается?", "Why is nature so different in Surkhandarya and in the Tashkent mountains?"),
      k: [
        t("Экотизим — организмлар ва физик муҳитнинг ўзаро боғлиқ тизими.", "Экосистема — взаимосвязанная система организмов и физической среды.", "An ecosystem is a linked system of organisms and their physical environment."),
        t("Биом — иқлим белгилайдиган катта экотизим: тундра, тайга, дашт, чўл, тропик ўрмон.", "Биом — крупная экосистема, заданная климатом: тундра, тайга, степь, пустыня, тропический лес.", "A biome is a large climate-defined ecosystem: tundra, taiga, steppe, desert, rainforest."),
        t("Ўзбекистонда чўл, дашт, тоғ ва дарё бўйи тўқай экотизимлари бор.", "В Узбекистане есть пустынные, степные, горные и тугайные экосистемы.", "Uzbekistan has desert, steppe, mountain and riverside tugai ecosystems.")
      ],
      q: [
        q(t("Биомни асосан нима белгилайди?", "Что в основном определяет биом?", "What mainly defines a biome?"),
          [t("Ҳарорат ва ёғин (иқлим)", "Температура и осадки (климат)", "Temperature and rainfall (climate)"), t("Аҳоли сони", "Численность людей", "Human population"), t("Давлат чегаралари", "Границы государств", "National borders")], 0,
          t("Иқлим қайси ўсимликлар ўсишини белгилайди.", "Климат определяет, какие растения растут.", "Climate decides which plants can grow.")),
        q(t("Тўқай экотизими қаерда бўлади?", "Где встречаются тугаи?", "Where are tugai forests found?"),
          [t("Дарё бўйларида", "По берегам рек", "Along rivers"), t("Тоғ чўққисида", "На вершинах гор", "On mountain peaks"), t("Қумли чўл ўртасида", "Среди песчаной пустыни", "In the middle of sand deserts")], 0,
          t("Тўқайлар Амударё ва Сирдарё бўйида учрайди.", "Тугаи растут вдоль Амударьи и Сырдарьи.", "Tugai grow along the Amu Darya and Syr Darya."))
      ],
      task: t("Ўзбекистон харитасида 4 экотизимни (чўл, дашт, тоғ, тўқай) белгилаб, ҳар бирига битта ўсимлик ва битта ҳайвон ёзинг.", "Отметьте на карте Узбекистана 4 экосистемы и назовите в каждой растение и животное.", "Mark 4 ecosystems on a map of Uzbekistan and name a plant and an animal for each.") },

    /* ---------- Сув ва моддалар айланиши ---------- */
    { id: "v-biosfera-ru", yt: "m2D9jHY3kJU", top: "suv", st: "u", lng: "ru", ch: "Адукар", orig: "Биосфера. Круговорот веществ в биосфере | Биология ЕГЭ, ЦТ", ck: "2026-10-17",
      t: t("Биосфера ва моддалар айланиши", "Биосфера и круговорот веществ", "The biosphere and the cycling of matter"),
      sum: t("Биосфера чегаралари, Вернадскийнинг тирик модда ҳақидаги таълимоти, катта (геологик) ва кичик (биологик) айланишлар.", "Границы биосферы, учение Вернадского о живом веществе, большой (геологический) и малый (биологический) круговороты.", "The limits of the biosphere, Vernadsky’s idea of living matter, and the large (geological) and small (biological) cycles."),
      pre: t("Сиз нафас олаётган кислород атоми илгари қаерда бўлган бўлиши мумкин?", "Где мог раньше побывать атом кислорода, которым вы дышите?", "Where might the oxygen atom you are breathing have been before?"),
      k: [
        t("Биосфера — ҳаёт тарқалган қобиқ: атмосферанинг пастки қисми, бутун гидросфера ва литосферанинг юқори қатлами.", "Биосфера — оболочка жизни: нижняя атмосфера, вся гидросфера и верх литосферы.", "The biosphere is the shell of life: the lower atmosphere, the whole hydrosphere and the upper lithosphere."),
        t("В.И. Вернадский: тирик модда — сайёрани ўзгартирадиган энг кучли геокимёвий куч.", "В.И. Вернадский: живое вещество — мощнейшая геохимическая сила планеты.", "V.I. Vernadsky: living matter is the planet’s most powerful geochemical force."),
        t("Катта айланиш минг ва миллион йиллаб давом этади; кичик (биологик) айланишни тирик организмлар ҳаракатга келтиради.", "Большой круговорот длится тысячи и миллионы лет; малый (биологический) движут организмы.", "The large cycle takes thousands to millions of years; organisms drive the small (biological) cycle.")
      ],
      q: [
        q(t("Биосфера ҳақидаги таълимот муаллифи ким?", "Кто автор учения о биосфере?", "Who developed the theory of the biosphere?"),
          [t("В.И. Вернадский", "В.И. Вернадский", "V.I. Vernadsky"), t("Ч. Дарвин", "Ч. Дарвин", "C. Darwin"), t("Д. Менделеев", "Д. Менделеев", "D. Mendeleev")], 0,
          t("Вернадскийнинг «Биосфера» китоби 1926 йилда чиққан.", "Книга Вернадского «Биосфера» вышла в 1926 году.", "Vernadsky’s book “The Biosphere” appeared in 1926.")),
        q(t("Кичик (биологик) айланишни нима ҳаракатга келтиради?", "Что движет малым (биологическим) круговоротом?", "What drives the small (biological) cycle?"),
          [t("Тирик организмлар", "Живые организмы", "Living organisms"), t("Фақат шамол", "Только ветер", "Only wind"), t("Ой тортилиши", "Притяжение Луны", "The Moon’s pull")], 0,
          t("Фотосинтез, озиқланиш ва парчаланиш моддаларни айлантиради.", "Фотосинтез, питание и разложение двигают вещества.", "Photosynthesis, feeding and decay move matter around."))
      ],
      task: t("Битта углерод атомининг «саёҳатини» ҳикоя қилиб ёзинг: ҳаво → барг → қуён → тупроқ → яна ҳаво.", "Напишите «путешествие» атома углерода: воздух → лист → заяц → почва → снова воздух.", "Write the “journey” of a carbon atom: air → leaf → hare → soil → air again.") },

    { id: "v-aylanish-ru", yt: "WhtxxFsjffo", top: "suv", st: "u", lng: "ru", ch: "Александр Колосков", orig: "Круговорот азота, углерода, воды, фосфора и серы", ck: "2026-10-17",
      t: t("Азот, углерод, сув, фосфор ва олтингугурт айланиши", "Круговороты азота, углерода, воды, фосфора и серы", "Nitrogen, carbon, water, phosphorus and sulphur cycles"),
      sum: t("Бешта асосий биогеокимёвий айланишнинг қисқа шарҳи ва инсон уларни қандай бузиши: ўғит, ёқилғи, кислотали ёмғир.", "Краткий обзор пяти главных биогеохимических круговоротов и того, как человек их нарушает: удобрения, топливо, кислотные дожди.", "A short tour of five key biogeochemical cycles and how people disturb them: fertiliser, fuel, acid rain."),
      pre: t("Ҳаво 78 фоиз азот бўлса ҳам, нега экинларга азотли ўғит солинади?", "Воздух на 78 % состоит из азота — зачем же вносить азотные удобрения?", "Air is 78% nitrogen — so why do farmers add nitrogen fertiliser?"),
      k: [
        t("Ўсимликлар ҳаводаги N₂ ни тўғридан-тўғри ололмайди; уни азот тўпловчи бактериялар (дуккаклилар илдизида) боғлайди, денитрификация эса ҳавога қайтаради.", "Растения не усваивают N₂ из воздуха; его связывают азотфиксирующие бактерии (в корнях бобовых), а денитрификация возвращает обратно.", "Plants can’t use N₂ directly; nitrogen-fixing bacteria (in legume roots) bind it and denitrification returns it to the air."),
        t("Фосфор айланиши газсиз ва секин: тоғ жинсларидан тупроққа, сувга, чўкмага; ортиқча ўғит сувни «гуллатади» (эвтрофикация).", "Круговорот фосфора без газовой фазы и медленный; избыток удобрений вызывает «цветение» воды (эвтрофикацию).", "The phosphorus cycle has no gas phase and is slow; excess fertiliser makes water bloom (eutrophication)."),
        t("Ёқилғи ёнганда SO₂ ва азот оксидлари чиқади — улар кислотали ёмғирга сабаб бўлади.", "При сжигании топлива выделяются SO₂ и оксиды азота — причина кислотных дождей.", "Burning fuel releases SO₂ and nitrogen oxides, which cause acid rain.")
      ],
      q: [
        q(t("Атмосфера азотини ўсимликлар учун ким боғлайди?", "Кто связывает атмосферный азот для растений?", "Who fixes atmospheric nitrogen for plants?"),
          [t("Азот тўпловчи бактериялар", "Азотфиксирующие бактерии", "Nitrogen-fixing bacteria"), t("Ҳайвонлар", "Животные", "Animals"), t("Ҳеч ким", "Никто", "No one")], 0,
          t("Улар дуккакли ўсимлик илдизидаги тугунакларда яшайди.", "Они живут в клубеньках бобовых.", "They live in nodules on legume roots.")),
        q(t("Кислотали ёмғирнинг асосий сабаби нима?", "Главная причина кислотных дождей?", "What mainly causes acid rain?"),
          [t("SO₂ ва азот оксидлари", "SO₂ и оксиды азота", "SO₂ and nitrogen oxides"), t("Кислород", "Кислород", "Oxygen"), t("Аргон", "Аргон", "Argon")], 0,
          t("Улар сув билан кислоталар ҳосил қилади.", "С водой они образуют кислоты.", "With water they form acids."))
      ],
      task: t("Нега нўхат ва мош ерни «ўғитлайди»? Бир абзац ёзинг; имкон бўлса дуккакли ўсимлик илдизидаги тугунакларни кузатинг.", "Почему горох и маш «удобряют» землю? Напишите абзац и, если можно, рассмотрите клубеньки на корнях.", "Why do peas and mung beans “fertilise” the soil? Write a paragraph and, if you can, look at root nodules.") },

    { id: "v-okean-ru", yt: "yMb7IyfIo0Y", top: "suv", st: "m", lng: "ru", ch: "Разумейкин", orig: "Океаны. Сайт - игра Разумейкин", ck: "2026-10-17",
      t: t("Ер океанлари", "Океаны Земли", "The Earth’s oceans"),
      sum: t("Болалар учун: Ер юзининг катта қисмини эгаллаган океанлар, уларнинг номлари ва сайёра ҳаёти учун аҳамияти.", "Для детей: океаны, покрывающие большую часть Земли, их названия и значение для жизни планеты.", "For children: the oceans that cover most of the Earth, their names and why they matter for life."),
      pre: t("Ўзбекистон океандан узоқ. Шунда ҳам океан бизга таъсир қиладими?", "Узбекистан далеко от океана. Влияет ли он на нас?", "Uzbekistan is far from any ocean. Does the ocean still affect us?"),
      k: [
        t("Ер юзининг тахминан 71 фоизи сув билан қопланган, унинг кўпи — океанлар.", "Около 71 % поверхности Земли покрыто водой, в основном океанами.", "About 71% of the Earth’s surface is water, mostly oceans."),
        t("Тинч, Атлантика, Ҳинд, Шимолий Муз океанлари; бугун кўпинча Жанубий океан ҳам ажратилади. Тинч океан энг катта ва чуқур.", "Тихий, Атлантический, Индийский, Северный Ледовитый; сейчас часто выделяют и Южный. Тихий — самый большой и глубокий.", "Pacific, Atlantic, Indian and Arctic; the Southern Ocean is now often counted too. The Pacific is the largest and deepest."),
        t("Океан фитопланктони кислороднинг катта қисмини беради, оқимлар эса бутун Ер иқлимини бошқаради.", "Фитопланктон океана даёт большую часть кислорода, а течения управляют климатом всей Земли.", "Ocean phytoplankton makes much of our oxygen, and currents drive the whole planet’s climate.")
      ],
      q: [
        q(t("Энг катта океан қайси?", "Какой океан самый большой?", "Which ocean is the largest?"),
          [t("Тинч океани", "Тихий", "The Pacific"), t("Атлантика", "Атлантический", "The Atlantic"), t("Ҳинд", "Индийский", "The Indian")], 0,
          t("Тинч океанида Мариана ботиғи ҳам бор (~11 км).", "В Тихом океане и Марианская впадина (~11 км).", "The Pacific also holds the Mariana Trench (~11 km).")),
        q(t("Ер юзининг қанча қисми сув?", "Какая часть поверхности Земли — вода?", "How much of Earth’s surface is water?"),
          [t("~71 %", "~71 %", "~71%"), t("~30 %", "~30 %", "~30%"), t("~50 %", "~50 %", "~50%")], 0,
          t("Шунинг учун Ерни «мовий сайёра» дейишади.", "Поэтому Землю зовут «голубой планетой».", "That’s why Earth is called the blue planet."))
      ],
      task: t("Дунё харитасида океанларни топиб, ҳар бирини бошқа ранг билан бўянг. Ўзбекистонга энг яқин океан қайси?", "Найдите океаны на карте мира и раскрасьте их разными цветами. Какой океан ближе всего к Узбекистану?", "Find the oceans on a world map and colour each differently. Which is closest to Uzbekistan?") },

    { id: "v-chuchuksuv-ted", yt: "otrpxtAmDAk", top: "suv", st: "", lng: "en", ch: "TED-Ed", au: "Christiana Z. Peppard", orig: "Fresh water scarcity: An introduction to the problem - Christiana Z. Peppard", ck: "2026-10-17",
      t: t("Чучук сув танқислиги", "Дефицит пресной воды", "Fresh water scarcity"),
      sum: t("Нега сайёрада сув кўп бўлса ҳам, ичишга ва суғоришга яроқли сув кам: чучук сув улуши, қишлоқ хўжалиги ва «виртуал сув».", "Почему воды на планете много, а пригодной мало: доля пресной воды, сельское хозяйство и «виртуальная вода».", "Why a watery planet is short of usable water: the share of fresh water, farming and “virtual water”."),
      pre: t("Битта пахта футболкага қанча сув кетади деб ўйлайсиз?", "Сколько воды, по-вашему, уходит на одну хлопковую футболку?", "How much water do you think one cotton T-shirt takes?"),
      k: [
        t("Ердаги сувнинг атиги ~2,5 фоизи чучук, унинг кўпи музлик ва ер ости сувида.", "Лишь ~2,5 % воды на Земле пресная, и большая её часть — в ледниках и недрах.", "Only ~2.5% of Earth’s water is fresh, and most is locked in ice or underground."),
        t("Ишлатиладиган чучук сувнинг тахминан 70 фоизи қишлоқ хўжалигига кетади.", "Около 70 % потребляемой пресной воды уходит на сельское хозяйство.", "About 70% of fresh water withdrawn goes to agriculture."),
        t("«Виртуал сув» — маҳсулот тайёрлашга кетган сув: 1 кг пахта учун ўн минг литрга яқин.", "«Виртуальная вода» — вода, ушедшая на производство: на 1 кг хлопка около десяти тысяч литров.", "“Virtual water” is the water used to make a product: around ten thousand litres per kg of cotton.")
      ],
      q: [
        q(t("Ердаги сувнинг қанча қисми чучук?", "Какая доля воды на Земле пресная?", "What share of Earth’s water is fresh?"),
          [t("~2,5 %", "~2,5 %", "~2.5%"), t("~50 %", "~50 %", "~50%"), t("~25 %", "~25 %", "~25%")], 0,
          t("Қолгани денгиз ва океанлардаги шўр сув.", "Остальное — солёная вода морей и океанов.", "The rest is salty sea water.")),
        q(t("Чучук сувнинг энг катта истеъмолчиси ким?", "Главный потребитель пресной воды?", "Who uses the most fresh water?"),
          [t("Қишлоқ хўжалиги", "Сельское хозяйство", "Agriculture"), t("Уй-рўзғор", "Быт", "Households"), t("Спорт", "Спорт", "Sport")], 0,
          t("Шунинг учун суғоришда тежаш энг катта самара беради.", "Поэтому экономия на поливе даёт больше всего.", "So saving in irrigation matters most."))
      ],
      task: t("Бир кунда сарфлаган сувингизни ҳисобланг (душ, ҳожатхона, идиш ювиш) ва уни 20 фоиз камайтириш режасини тузинг.", "Подсчитайте свой расход воды за день (душ, туалет, посуда) и составьте план сократить его на 20 %.", "Add up your daily water use (shower, toilet, dishes) and plan how to cut it by 20%.") },

    { id: "v-suvmanba-ted", yt: "Pz6AQXQGupQ", top: "suv", st: "", lng: "en", ch: "TED-Ed", au: "Christiana Z. Peppard", orig: "Where we get our fresh water - Christiana Z. Peppard", ck: "2026-10-17",
      t: t("Чучук сувни қаердан оламиз", "Откуда мы берём пресную воду", "Where we get our fresh water"),
      sum: t("Юза ва ер ости сувлари, аквиферлар нима учун секин тўлиши ва дарёлар давлатлар орасида қандай бўлинади.", "Поверхностные и подземные воды, почему водоносные горизонты наполняются медленно и как делят реки между странами.", "Surface water and groundwater, why aquifers refill slowly, and how rivers are shared between countries."),
      pre: t("Уйингиздаги жўмрак суви қаердан келади: дарёданми, қудуқданми?", "Откуда вода в вашем кране: из реки или из скважины?", "Where does your tap water come from: a river or a well?"),
      k: [
        t("Манбалар: юза сувлар (дарё, кўл, сув омбори) ва ер ости сувлари (аквиферлар).", "Источники: поверхностные воды (реки, озёра, водохранилища) и подземные (водоносные горизонты).", "Sources: surface water (rivers, lakes, reservoirs) and groundwater (aquifers)."),
        t("Аквиферлар юзлаб-минглаб йилда тўлади; ортиқча тортилса, сатҳи пасаяди ва қудуқлар қурийди.", "Водоносные горизонты наполняются веками; при перекачке уровень падает и колодцы сохнут.", "Aquifers take centuries to refill; over-pumping lowers them and wells run dry."),
        t("Йирик дарёлар бир неча давлатдан оқади: Амударё ва Сирдарё — Марказий Осиёнинг умумий бойлиги.", "Крупные реки текут через несколько стран: Амударья и Сырдарья — общее богатство Центральной Азии.", "Big rivers cross borders: the Amu Darya and Syr Darya are shared by Central Asia.")
      ],
      q: [
        q(t("Аквифер нима?", "Что такое водоносный горизонт?", "What is an aquifer?"),
          [t("Сувни ушлаб турадиган ер ости қатлами", "Подземный слой, удерживающий воду", "An underground layer that holds water"), t("Сув тозалаш ускунаси", "Водоочистная установка", "A water filter"), t("Булут тури", "Вид облака", "A type of cloud")], 0,
          t("Қум, шағал ёки ёриқли тош қатлами.", "Слой песка, гравия или трещиноватой породы.", "A layer of sand, gravel or cracked rock.")),
        q(t("Амударё ва Сирдарё нега «умумий» дарёлар?", "Почему Амударья и Сырдарья — «общие» реки?", "Why are the Amu Darya and Syr Darya “shared” rivers?"),
          [t("Бир неча давлат ҳудудидан оқади", "Текут через несколько стран", "They flow through several countries"), t("Битта шаҳар ичида", "Текут в одном городе", "They run within one city"), t("Ер остида", "Текут под землёй", "They run underground")], 0,
          t("Шунинг учун сувни бўлиш бўйича давлатлараро келишувлар зарур.", "Поэтому нужны межгосударственные соглашения о воде.", "That’s why countries need water-sharing agreements."))
      ],
      task: t("Маҳаллангиз сув манбаини аниқланг ва «манба → тозалаш → уй → оқова» схемасини чизинг.", "Узнайте источник воды в вашем районе и нарисуйте схему «источник → очистка → дом → стоки».", "Find your area’s water source and draw “source → treatment → home → wastewater”.") },

    { id: "v-tozasuv-ted", yt: "OCzYdNSJF-k", top: "suv", st: "", lng: "en", ch: "TED-Ed", au: "Balsher Singh Sidhu", orig: "Are we running out of clean water? - Balsher Singh Sidhu", ck: "2026-10-17",
      t: t("Тоза сув тугаяптими?", "Заканчивается ли чистая вода?", "Are we running out of clean water?"),
      sum: t("Ер ости сувларининг камайиши, ифлосланиш ва уларга қарши ечимлар: томчилатиб суғориш, оқова сувни қайта ишлатиш.", "Истощение подземных вод, загрязнение и решения: капельное орошение, повторное использование стоков.", "Groundwater depletion, pollution and fixes: drip irrigation and reusing treated wastewater."),
      pre: t("Жўмрак 1 дақиқа очиқ қолса, қанча сув исроф бўлади?", "Сколько воды утечёт, если кран открыт 1 минуту?", "How much water is lost if a tap runs for 1 minute?"),
      k: [
        t("ЖССТ ва ЮНИСЕФ маълумотига кўра, 2 миллиарддан ортиқ одам хавфсиз ичимлик сувидан фойдалана олмайди.", "По данным ВОЗ и ЮНИСЕФ, более 2 млрд человек лишены безопасной питьевой воды.", "According to WHO and UNICEF, over 2 billion people lack safely managed drinking water."),
        t("Ер ости сувлари тўлишидан тезроқ тортилмоқда, ўғит ва саноат чиқиндилари уларни ифлослантиради.", "Подземные воды выкачивают быстрее, чем они пополняются; их загрязняют удобрения и промышленность.", "Groundwater is pumped faster than it refills and is polluted by fertiliser and industry."),
        t("Ечимлар: томчилатиб суғориш, тозаланган оқова сувни қайта ишлатиш, қувурлардаги йўқотишларни камайтириш.", "Решения: капельный полив, повторное использование очищенных стоков, сокращение утечек.", "Fixes: drip irrigation, reusing treated wastewater, cutting pipe leaks.")
      ],
      q: [
        q(t("Нечта одам хавфсиз ичимлик сувидан маҳрум?", "Сколько людей лишены безопасной питьевой воды?", "How many people lack safe drinking water?"),
          [t("2 миллиарддан ортиқ", "Более 2 миллиардов", "Over 2 billion"), t("2 мингга яқин", "Около 2 тысяч", "About 2 thousand"), t("Ҳеч ким", "Никто", "No one")], 0,
          t("Бу дунё аҳолисининг тахминан тўртдан бири.", "Это около четверти человечества.", "That is about a quarter of humanity.")),
        q(t("Қишлоқ хўжалигида сувни қандай тежаш мумкин?", "Как сэкономить воду в сельском хозяйстве?", "How can farms save water?"),
          [t("Томчилатиб суғориш", "Капельным орошением", "Drip irrigation"), t("Кўпроқ ариқ очиш", "Копать больше арыков", "Digging more open ditches"), t("Сувни очиқ қолдириш", "Оставлять воду открытой", "Leaving the water running")], 0,
          t("Томчилатиб суғориш сувни илдизга етказади ва 30–50 фоизгача тежайди.", "Капельный полив подаёт воду к корням и экономит 30–50 %.", "Drip irrigation feeds roots directly and can save 30–50%."))
      ],
      task: t("Идиш билан 1 дақиқада жўмракдан оқадиган сувни ўлчанг ва йиллик исрофни ҳисобланг.", "Измерьте, сколько воды течёт из крана за 1 минуту, и рассчитайте годовые потери.", "Measure how much water a tap gives in 1 minute and work out the yearly waste.") },

    /* ---------- Иқлим ўзгариши ---------- */
    { id: "v-vmo-ru", yt: "fnkcNjUfSIA", top: "iqlim", st: "", lng: "ru", ch: "Служба новостей ООН", orig: "Что происходит с климатом Земли? Объясняет Всемирная метеорологическая организация.", ck: "2026-10-17",
      t: t("Ер иқлими билан нима бўляпти? (БМТ ва ЖМТ)", "Что происходит с климатом Земли? (ООН и ВМО)", "What is happening to Earth’s climate? (UN and WMO)"),
      sum: t("Жаҳон метеорология ташкилоти мутахассислари исишнинг кўламини, далилларини ва Париж келишуви мақсадларини тушунтиради.", "Специалисты Всемирной метеорологической организации объясняют масштаб потепления, его доказательства и цели Парижского соглашения.", "World Meteorological Organization experts explain how far warming has gone, the evidence, and the Paris Agreement goals."),
      pre: t("Сизнингча, ўтган 30 йилда шаҳрингиз ёзи иссиқроқ бўлдими?", "Как вы думаете, лето в вашем городе за 30 лет стало жарче?", "Do you think summers in your city got hotter over the last 30 years?"),
      k: [
        t("ЖМТ (WMO) — БМТнинг об-ҳаво, иқлим ва сув бўйича ихтисослашган ташкилоти.", "ВМО — специализированное учреждение ООН по погоде, климату и воде.", "The WMO is the UN agency for weather, climate and water."),
        t("ЖМТга кўра, 2024 йил ўртача ҳарорат саноатдан олдинги даврдан биринчи марта ~1,5 °C юқори бўлган йил.", "По данным ВМО, 2024 год стал первым годом с температурой ~на 1,5 °C выше доиндустриальной.", "According to the WMO, 2024 was the first calendar year about 1.5 °C above pre-industrial levels."),
        t("Оқибатлар: иссиқ тўлқинлари, қурғоқчилик, музликлар эриши, денгиз сатҳининг кўтарилиши.", "Последствия: волны жары, засухи, таяние ледников, подъём уровня моря.", "Effects: heatwaves, drought, melting glaciers and rising seas.")
      ],
      q: [
        q(t("ЖМТ қайси ташкилот таркибида?", "В систему какой организации входит ВМО?", "Which organisation is the WMO part of?"),
          [t("БМТ", "ООН", "The UN"), t("Европа Иттифоқи", "Евросоюз", "The EU"), t("Халқаро Олимпия қўмитаси", "МОК", "The IOC")], 0,
          t("ЖМТ — БМТнинг ихтисослашган агентлиги.", "ВМО — специализированное учреждение ООН.", "The WMO is a UN specialised agency.")),
        q(t("Париж келишувининг асосий мақсади нима?", "Главная цель Парижского соглашения?", "What is the main goal of the Paris Agreement?"),
          [t("Исишни 2 °C дан анча паст, имкон қадар 1,5 °C да ушлаш", "Удержать потепление намного ниже 2 °C, по возможности 1,5 °C", "Keep warming well below 2 °C, ideally 1.5 °C"), t("Ҳароратни 5 °C га кўтариш", "Поднять температуру на 5 °C", "Raise temperature by 5 °C"), t("Кўмирни кўпайтириш", "Увеличить добычу угля", "Burn more coal")], 0,
          t("Келишув 2015 йилда қабул қилинган.", "Соглашение принято в 2015 году.", "It was adopted in 2015."))
      ],
      task: t("«Онлайн маълумотлар» бўлимида шаҳрингиз ҳароратини кўриб, катталардан 30 йил олдинги ёз ҳақида сўранг ва солиштиринг.", "Посмотрите температуру своего города в разделе «Онлайн-данные» и расспросите старших о лете 30 лет назад.", "Check your city’s temperature in Online data and ask older relatives about summers 30 years ago.") },

    { id: "v-bmt5-ru", yt: "T9nm8oIoc-c", top: "iqlim", st: "u", lng: "ru", ch: "Служба новостей ООН", orig: "Доклад ООН об изменении климата: пять фактов", ck: "2026-10-17",
      t: t("БМТ иқлим ҳисоботи: 5 та асосий факт", "Доклад ООН о климате: пять фактов", "The UN climate report: five facts"),
      sum: t("IPCC ҳисоботининг асосий хулосалари: инсон таъсири, исиш тезлиги ва эмиссияни тез қисқартириш зарурати.", "Главные выводы доклада МГЭИК: влияние человека, темпы потепления и необходимость быстро сократить выбросы.", "Key IPCC findings: human influence, the pace of warming, and the need for rapid emission cuts."),
      pre: t("Олимлар иқлим ўзгаришининг асосий сабабига қанчалик ишонч билдиради деб ўйлайсиз?", "Насколько, по-вашему, учёные уверены в главной причине изменения климата?", "How sure do you think scientists are about the main cause of climate change?"),
      k: [
        t("IPCC — БМТнинг Иқлим ўзгариши бўйича ҳукуматлараро гуруҳи: минглаб илмий ишларни умумлаштиради.", "МГЭИК (IPCC) — межправительственная группа экспертов ООН по климату, обобщает тысячи исследований.", "The IPCC is the UN panel that assesses thousands of climate studies."),
        t("6-ҳисобот (AR6, 2021–2023): инсон таъсирида атмосфера, океан ва қуруқлик исигани «шубҳасиз».", "Шестой доклад (AR6, 2021–2023): потепление атмосферы, океана и суши под влиянием человека «однозначно».", "The 6th report (AR6, 2021–2023): it is “unequivocal” that humans have warmed the air, ocean and land."),
        t("1,5 °C ни ушлаш учун глобал эмиссия 2030 йилгача 2019 йилга нисбатан тахминан 43 фоиз камайиши керак.", "Чтобы удержать 1,5 °C, выбросы к 2030 году должны сократиться примерно на 43 % от уровня 2019 года.", "To hold 1.5 °C, global emissions must fall about 43% from 2019 levels by 2030.")
      ],
      q: [
        q(t("IPCC нима?", "Что такое МГЭИК (IPCC)?", "What is the IPCC?"),
          [t("Иқлим бўйича ҳукуматлараро экспертлар гуруҳи", "Межправительственная группа экспертов по климату", "An intergovernmental panel of climate experts"), t("Нефт компанияси", "Нефтяная компания", "An oil company"), t("Об-ҳаво сайти", "Сайт погоды", "A weather website")], 0,
          t("У 1988 йилда ЖМТ ва ЮНЕП томонидан тузилган.", "Создана ВМО и ЮНЕП в 1988 году.", "Set up by the WMO and UNEP in 1988.")),
        q(t("AR6 га кўра ҳозирги исишнинг асосий сабаби нима?", "По AR6, главная причина нынешнего потепления?", "According to AR6, what mainly causes today’s warming?"),
          [t("Инсон фаолияти", "Деятельность человека", "Human activity"), t("Қуёш доғлари", "Солнечные пятна", "Sunspots"), t("Вулқонлар", "Вулканы", "Volcanoes")], 0,
          t("Асосан қазилма ёқилғи ёқиш ва ер фойдаланишининг ўзгариши.", "Прежде всего сжигание ископаемого топлива и изменения землепользования.", "Mainly burning fossil fuels and land-use change."))
      ],
      task: t("«Ҳар бир улуш градус муҳим» деган фикрни 3 та мисол билан тушунтиринг (иссиқ кунлар, музликлар, ҳосил).", "Объясните мысль «важна каждая доля градуса» на 3 примерах (жаркие дни, ледники, урожай).", "Explain “every fraction of a degree matters” with 3 examples (hot days, glaciers, harvests).") },

    { id: "v-parnik-ru", yt: "yrPgxSSOo1s", top: "iqlim", st: "", lng: "ru", ch: "YES TOMORROW Russia", orig: "Парниковый эффект что это? Глобальное потепление и угроза для Земли. Анимация про экологию 13+", ck: "2026-10-17",
      t: t("Парник эффекти нима? (анимация)", "Что такое парниковый эффект? (анимация)", "What is the greenhouse effect? (animation)"),
      sum: t("13 ёшдан катталар учун анимация: табиий парник эффекти, нега у кучаймоқда ва бу Ер учун нима англатади.", "Анимация 13+: естественный парниковый эффект, почему он усиливается и чем это грозит Земле.", "An animation for ages 13+: the natural greenhouse effect, why it is getting stronger and what that means for Earth."),
      pre: t("Қишда ёпиқ машина ичи нега қуёшда тез исийди?", "Почему закрытая машина зимой быстро нагревается на солнце?", "Why does a closed car warm up fast in the sun, even in winter?"),
      k: [
        t("Қуёш нури Ерни иситади, Ер эса иссиқликни инфрақизил нур сифатида қайтаради.", "Солнечный свет нагревает Землю, а Земля отдаёт тепло инфракрасным излучением.", "Sunlight warms the Earth, which sends heat back out as infrared radiation."),
        t("CO₂, метан ва сув буғи бу иссиқликнинг бир қисмини ушлайди: табиий эффект бўлмаса, Ер ўртача −18 °C бўларди (ҳозир ~+15 °C).", "CO₂, метан и водяной пар задерживают часть тепла: без естественного эффекта Земля была бы около −18 °C (сейчас ~+15 °C).", "CO₂, methane and water vapour trap some heat: without the natural effect Earth would average −18 °C (today ~+15 °C)."),
        t("Ёқилғи ёқиш ва ўрмон кесиш CO₂ ни кўпайтиради ва эффектни кучайтиради.", "Сжигание топлива и вырубка лесов увеличивают CO₂ и усиливают эффект.", "Burning fuel and cutting forests add CO₂ and strengthen the effect.")
      ],
      q: [
        q(t("Табиий парник эффекти бўлмаса, Ер ўртача ҳарорати қандай бўларди?", "Какой была бы средняя температура Земли без парникового эффекта?", "Without the greenhouse effect, Earth’s average temperature would be?"),
          [t("~−18 °C", "~−18 °C", "~−18 °C"), t("~+50 °C", "~+50 °C", "~+50 °C"), t("Ўзгармасди", "Не изменилась бы", "Unchanged")], 0,
          t("Табиий эффект ҳаёт учун зарур; хавфлиси — унинг кучайиши.", "Естественный эффект нужен жизни; опасно его усиление.", "The natural effect is vital; the danger is making it stronger.")),
        q(t("Қайси газ парник гази эмас?", "Какой газ НЕ парниковый?", "Which gas is NOT a greenhouse gas?"),
          [t("Азот (N₂)", "Азот (N₂)", "Nitrogen (N₂)"), t("CO₂", "CO₂", "CO₂"), t("Метан", "Метан", "Methane")], 0,
          t("N₂ инфрақизил нурни деярли ютмайди.", "N₂ почти не поглощает инфракрасное излучение.", "N₂ barely absorbs infrared."))
      ],
      task: t("Икки банкага термометр қўйинг, бирини плёнка билан ёпинг ва иккаласини қуёшда 20 дақиқа қолдиринг. Ҳароратни солиштиринг.", "Поставьте термометры в две банки, одну накройте плёнкой, оставьте на солнце на 20 минут и сравните.", "Put thermometers in two jars, cover one with film, leave both in sun for 20 minutes and compare.") },

    { id: "v-postnauka-ru", yt: "wcVy-0IBpg4", top: "iqlim", st: "u", lng: "ru", ch: "ПостНаука", orig: "Как остановить глобальное потепление? / ПостНаука", ck: "2026-10-17",
      t: t("Глобал исишни қандай тўхтатиш мумкин?", "Как остановить глобальное потепление?", "How can we stop global warming?"),
      sum: t("Олимлар митигация (эмиссияни камайтириш), углеродни ютиш ва мослашиш йўлларини муҳокама қилади.", "Учёные обсуждают пути митигации (сокращения выбросов), поглощения углерода и адаптации.", "Scientists discuss mitigation (cutting emissions), carbon removal and adaptation."),
      pre: t("Иқлимни сақлаш учун энг кучли битта чора нима деб ўйлайсиз?", "Какая одна мера, по-вашему, сильнее всего поможет климату?", "What single measure do you think would help the climate most?"),
      k: [
        t("Митигация — эмиссияни камайтириш: қайта тикланувчи энергия, энергия тежамкорлиги, электр транспорт.", "Митигация — сокращение выбросов: ВИЭ, энергоэффективность, электротранспорт.", "Mitigation means cutting emissions: renewables, efficiency, electric transport."),
        t("Углеродни ютиш: ўрмон тиклаш, тупроқдаги углерод, CO₂ ни ушлаш технологиялари.", "Поглощение углерода: восстановление лесов, почвенный углерод, технологии улавливания CO₂.", "Carbon removal: restoring forests, soil carbon and CO₂ capture technology."),
        t("«Нетто-ноль» — чиқарилган ва ютилган парник газларининг тенглиги; мослашиш (адаптация) ҳам зарур.", "«Нетто-ноль» — баланс выбросов и поглощения; необходима и адаптация.", "“Net zero” balances emissions and removals; adaptation is needed too.")
      ],
      q: [
        q(t("«Нетто-ноль» нима?", "Что такое «нетто-ноль»?", "What is “net zero”?"),
          [t("Чиқарилган ва ютилган газлар тенглиги", "Баланс выбросов и поглощения", "Emissions balanced by removals"), t("CO₂ ни бутунлай тақиқлаш", "Полный запрет CO₂", "Banning CO₂ entirely"), t("Ҳароратни 0 °C га тушириш", "Снизить температуру до 0 °C", "Cooling to 0 °C")], 0,
          t("Қолган эмиссия ютиш билан қопланади.", "Остаточные выбросы компенсируются поглощением.", "Remaining emissions are offset by removals.")),
        q(t("Митигация ва адаптациянинг фарқи нима?", "Чем митигация отличается от адаптации?", "How does mitigation differ from adaptation?"),
          [t("Митигация — сабабни камайтириш, адаптация — оқибатга мослашиш", "Митигация — устранение причины, адаптация — приспособление к последствиям", "Mitigation tackles causes; adaptation copes with effects"), t("Иккаласи бир хил", "Это одно и то же", "They’re the same"), t("Адаптация — эмиссияни кўпайтириш", "Адаптация — рост выбросов", "Adaptation means more emissions")], 0,
          t("Иккаласи ҳам керак.", "Нужно и то, и другое.", "Both are needed."))
      ],
      task: t("Оилангиз учун 5 та митигация ва 3 та адаптация чорасини жадвалда ёзинг.", "Составьте таблицу: 5 мер митигации и 3 меры адаптации для вашей семьи.", "Make a table of 5 mitigation and 3 adaptation steps for your family.") },

    { id: "v-chernokul-ru", yt: "Rr1DyblDx0g", top: "iqlim", st: "u", lng: "ru", ch: "Pepeliaev Group", au: "Александр Чернокульский", orig: "Глобальное потепление - миф или реальность? Интервью с климатологом Александром Чернокульским", ck: "2026-10-17",
      t: t("Глобал исиш — афсонами ёки ҳақиқат? (климатолог билан суҳбат)", "Глобальное потепление — миф или реальность? (интервью с климатологом)", "Global warming: myth or reality? (interview with a climatologist)"),
      sum: t("Климатолог А. Чернокульский об-ҳаво ва иқлим фарқи, исиш далиллари ва кенг тарқалган афсоналарни таҳлил қилади.", "Климатолог А. Чернокульский разбирает разницу погоды и климата, доказательства потепления и популярные мифы.", "Climatologist A. Chernokulsky explains weather vs. climate, the evidence for warming and common myths."),
      pre: t("Агар бу қиш жуда совуқ бўлса, бу исиш йўқлигини исботлайдими?", "Если эта зима очень холодная, доказывает ли это, что потепления нет?", "If this winter is very cold, does that prove there’s no warming?"),
      k: [
        t("Об-ҳаво — кунлик ҳолат; иқлим — камида 30 йиллик ўртача кўрсаткич.", "Погода — состояние на день; климат — средние условия минимум за 30 лет.", "Weather is day-to-day; climate is the average over at least 30 years."),
        t("Далиллар: ҳарорат ўлчовлари, музликлар қисқариши, денгиз сатҳи, CO₂ эгри чизиғи (280 ppm дан 420 ppm дан ортиқгача).", "Доказательства: замеры температуры, отступание ледников, уровень моря, кривая CO₂ (с 280 до более 420 ppm).", "Evidence: temperature records, shrinking glaciers, sea level, the CO₂ curve (from 280 to over 420 ppm)."),
        t("Битта совуқ қиш тенденцияни инкор этмайди: иқлим узоқ муддатли ўртача билан баҳоланади.", "Одна холодная зима не отменяет тренд: климат оценивают по долгим средним.", "One cold winter doesn’t cancel a trend: climate is judged on long averages.")
      ],
      q: [
        q(t("Иқлим нима?", "Что такое климат?", "What is climate?"),
          [t("Камида 30 йиллик ўртача об-ҳаво", "Средняя погода минимум за 30 лет", "Average weather over 30+ years"), t("Бугунги ҳарорат", "Сегодняшняя температура", "Today’s temperature"), t("Битта бўрон", "Один шторм", "One storm")], 0,
          t("ЖМТ 30 йиллик «иқлим нормаси»дан фойдаланади.", "ВМО использует 30-летнюю «климатическую норму».", "The WMO uses 30-year climate normals.")),
        q(t("Саноатдан олдин атмосферада CO₂ қанча эди?", "Сколько CO₂ было в атмосфере до индустриализации?", "How much CO₂ was in the air before industry?"),
          [t("~280 ppm", "~280 ppm", "~280 ppm"), t("~1000 ppm", "~1000 ppm", "~1000 ppm"), t("~50 ppm", "~50 ppm", "~50 ppm")], 0,
          t("Ҳозир 420 ppm дан ошди.", "Сейчас — более 420 ppm.", "It is now over 420 ppm."))
      ],
      task: t("«Бу қиш совуқ — демак исиш йўқ» деган дўстингизга 3 жумлада илмий жавоб ёзинг.", "Ответьте другу на «зима холодная — значит, потепления нет» тремя научными фразами.", "Reply in 3 sentences to a friend who says “it’s cold, so there’s no warming”.") },

    { id: "v-kurz-fix", yt: "yiw6_JakZFc", top: "iqlim", st: "u", lng: "en", ch: "Kurzgesagt – In a Nutshell", orig: "Can YOU Fix Climate Change?", ck: "2026-10-17",
      t: t("Сиз иқлим ўзгаришини тузата оласизми?", "Можете ли ВЫ остановить изменение климата?", "Can YOU fix climate change?"),
      sum: t("Шахсий углерод изи ва тизимли ўзгаришлар (энергетика, саноат, сиёсат) ўртасидаги муносабат ҳақида анимацион видео.", "Анимация о соотношении личного углеродного следа и системных изменений (энергетика, промышленность, политика).", "An animation on how personal carbon footprints compare with system-wide change (energy, industry, policy)."),
      pre: t("Агар ҳамма велосипедга ўтса, иқлим муаммоси ҳал бўладими?", "Если все пересядут на велосипеды, проблема климата решится?", "If everyone switched to bikes, would climate change be solved?"),
      k: [
        t("Эмиссиянинг катта қисми энергетика, саноат, транспорт ва қишлоқ хўжалиги тизимларидан келади.", "Большая часть выбросов идёт от систем энергетики, промышленности, транспорта и сельского хозяйства.", "Most emissions come from energy, industry, transport and farming systems."),
        t("Шахсий танловлар муҳим, лекин тизимли ўзгаришларсиз (тоза электр, янги технологиялар, сиёсат) етарли эмас.", "Личный выбор важен, но без системных изменений (чистое электричество, технологии, политика) его мало.", "Personal choices matter, but aren’t enough without system change (clean power, technology, policy)."),
        t("Энг кучли шахсий таъсир — бошқаларга ўрнак бўлиш, овоз бериш, касб танлаш ва сўзлашиш.", "Самое сильное личное влияние — пример, голос, выбор профессии и разговор с другими.", "Your biggest personal lever: setting an example, voting, career choice and talking about it.")
      ],
      q: [
        q(t("Эмиссиянинг асосий қисми қаердан келади?", "Откуда основная часть выбросов?", "Where do most emissions come from?"),
          [t("Энергетика, саноат ва транспорт тизимларидан", "От энергетики, промышленности, транспорта", "Energy, industry and transport systems"), t("Фақат одамларнинг нафасидан", "Только от дыхания людей", "Only from people breathing"), t("Ой ва юлдузлардан", "От Луны и звёзд", "From the Moon and stars")], 0,
          t("Шунинг учун тизимларни ўзгартириш энг катта самара беради.", "Поэтому изменение систем даёт наибольший эффект.", "That’s why changing systems has the biggest effect.")),
        q(t("Энг самарали ёндашув қайси?", "Какой подход эффективнее всего?", "Which approach works best?"),
          [t("Шахсий ҳаракат ва тизимли ўзгариш бирга", "Личные действия вместе с системными изменениями", "Personal action plus system change"), t("Фақат шахсий", "Только личные действия", "Only personal action"), t("Ҳеч нарса қилмаслик", "Ничего не делать", "Doing nothing")], 0,
          t("Иккаласи бир-бирини кучайтиради.", "Они усиливают друг друга.", "They reinforce each other."))
      ],
      task: t("«Калькулятор» бўлимида углерод изингизни ҳисобланг ва уни 10 фоиз камайтириш режасини тузинг.", "Рассчитайте свой углеродный след в «Калькуляторе» и составьте план сократить его на 10 %.", "Work out your footprint in the Calculator and plan a 10% cut.") },

    { id: "v-kislota-tedx", yt: "8m1X26Auw6Q", top: "iqlim", st: "u", lng: "en", ch: "TEDx Talks", au: "Triona McGrath", orig: "Ocean acidification - the evil twin of climate change | Triona McGrath | TEDxFulbrightDublin", ck: "2026-10-17",
      t: t("Океан кислоталаниши — иқлимнинг «ёвуз эгизаги»", "Закисление океана — «злой близнец» изменения климата", "Ocean acidification: climate change’s evil twin"),
      sum: t("Денгиз кимёгари океан CO₂ ни ютиб кислоталашиши ва бу чиғаноқли организмлар ҳамда маржонларга қандай таъсир қилишини тушунтиради.", "Морской химик объясняет, как океан, поглощая CO₂, закисляется и чем это грозит моллюскам и кораллам.", "A marine chemist explains how the ocean absorbs CO₂, turns more acidic, and what that means for shellfish and corals."),
      pre: t("Газли сув нега бироз нордон таъм беради?", "Почему газированная вода слегка кисловата?", "Why does fizzy water taste slightly sour?"),
      k: [
        t("Океан инсон чиқарган CO₂ нинг тахминан тўртдан бир қисмини ютади.", "Океан поглощает около четверти антропогенного CO₂.", "The ocean absorbs about a quarter of human CO₂ emissions."),
        t("CO₂ + сув → карбонат кислота; саноат давридан бери юза сув pH ~8,2 дан ~8,1 гача тушди — кислоталик ~30 фоиз ошди.", "CO₂ + вода → угольная кислота; с доиндустриальной эпохи pH снизился с ~8,2 до ~8,1 — кислотность выросла ~на 30 %.", "CO₂ + water → carbonic acid; surface pH fell from ~8.2 to ~8.1 — about 30% more acidic."),
        t("Чиғаноқлар, маржонлар ва планктонга оҳак скелет қуриш қийинлашади — бу озиқ занжирига таъсир қилади.", "Моллюскам, кораллам и планктону труднее строить известковый скелет — страдает пищевая цепь.", "Shellfish, corals and plankton struggle to build shells, which affects the food chain.")
      ],
      q: [
        q(t("Океан инсон CO₂ сининг қанчасини ютади?", "Какую долю антропогенного CO₂ поглощает океан?", "How much human CO₂ does the ocean absorb?"),
          [t("~¼ қисмини", "~четверть", "~a quarter"), t("Ҳаммасини", "Весь", "All of it"), t("Ҳеч бирини", "Нисколько", "None")], 0,
          t("Бу исишни секинлаштиради, лекин океанни кислоталаштиради.", "Это замедляет потепление, но закисляет океан.", "That slows warming but acidifies the ocean.")),
        q(t("pH пасайиши нимани англатади?", "Что означает снижение pH?", "What does a falling pH mean?"),
          [t("Кислоталик ошди", "Кислотность выросла", "Acidity increased"), t("Ишқорийлик ошди", "Щёлочность выросла", "Alkalinity increased"), t("Сув ширин бўлди", "Вода стала пресной", "The water became fresh")], 0,
          t("pH шкаласи логарифмик: 0,1 ҳам катта ўзгариш.", "Шкала pH логарифмическая: 0,1 — заметное изменение.", "pH is logarithmic: 0.1 is a big change."))
      ],
      task: t("Стаканга сирка солиб, ичига тухум пўчоғи ёки бўр бўлагини ташланг; 1 кун кузатиб, чиғаноқлар билан солиштиринг.", "Положите в стакан с уксусом скорлупу или мел, понаблюдайте сутки и сравните с ракушками.", "Drop eggshell or chalk in vinegar, watch for a day and compare with sea shells.") },

    /* ---------- Ифлосланиш ва чиқинди ---------- */
    { id: "v-sortstan-ru", yt: "XJ2iSHWlEk8", top: "ifl", st: "", lng: "ru", ch: "Сортировочная", orig: "Сортировка и переработка мусора. Как работает сортировочная станция?", ck: "2026-10-17",
      t: t("Чиқинди саралаш станцияси қандай ишлайди?", "Как работает сортировочная станция?", "How a waste sorting plant works"),
      sum: t("Аралаш чиқинди конвейерда қандай ажратилиши: қўлда саралаш, магнит, уюрма ток сепаратори ва оптик сенсорлар.", "Как смешанные отходы разделяют на конвейере: ручная сортировка, магнит, вихретоковый сепаратор, оптические датчики.", "How mixed waste is split on a conveyor: hand picking, magnets, eddy-current separators and optical sensors."),
      pre: t("Ахлат идишига ташланган банка кейин қаерга боради?", "Куда попадает банка после мусорного бака?", "Where does a can go after the bin?"),
      k: [
        t("Магнит темир-пўлатни, уюрма ток сепаратори алюминийни ажратади.", "Магнит отделяет сталь, вихретоковый сепаратор — алюминий.", "Magnets pull out steel; an eddy-current separator removes aluminium."),
        t("Оптик сенсорлар пластик турларини (PET, HDPE ва бошқалар) ажратиб, ҳаво оқими билан учириб юборади.", "Оптические датчики распознают виды пластика (PET, HDPE и др.) и сдувают их струёй воздуха.", "Optical sensors recognise plastic types (PET, HDPE…) and blow them off with air jets."),
        t("Ифлос ва аралашган чиқинди сифатни туширади; уйда алоҳида йиғиш — энг арзон саралаш.", "Грязные и смешанные отходы снижают качество; раздельный сбор дома — самая дешёвая сортировка.", "Dirty, mixed waste lowers quality; sorting at home is the cheapest sorting of all.")
      ],
      q: [
        q(t("Темир банкаларни нима ажратади?", "Что отделяет жестяные банки?", "What separates steel cans?"),
          [t("Магнит", "Магнит", "A magnet"), t("Сув", "Вода", "Water"), t("Шамол", "Ветер", "Wind")], 0,
          t("Пўлат магнитга тортилади.", "Сталь притягивается магнитом.", "Steel is magnetic.")),
        q(t("Нега чиқиндини уйда ажратиш муҳим?", "Почему важно сортировать дома?", "Why sort at home?"),
          [t("Хом ашё тоза қолади ва кўпроқ қайта ишланади", "Сырьё остаётся чистым и больше перерабатывается", "Materials stay clean and more gets recycled"), t("Чиқинди оғирлашади", "Мусор становится тяжелее", "Waste gets heavier"), t("Фарқи йўқ", "Разницы нет", "It makes no difference")], 0,
          t("Тоза хом ашё қимматроқ ва осон қайта ишланади.", "Чистое сырьё дороже и легче перерабатывается.", "Clean material is worth more and is easier to recycle."))
      ],
      task: t("Бир ҳафта уйдаги чиқиндини 4 турга (қоғоз, пластик, шиша/метал, органик) ажратиб тортинг ва диаграмма чизинг.", "Неделю сортируйте и взвешивайте отходы по 4 видам (бумага, пластик, стекло/металл, органика), постройте диаграмму.", "For a week, sort and weigh your waste in 4 groups (paper, plastic, glass/metal, food) and chart it.") },

    { id: "v-plastsort-ru", yt: "_bB6jHxqtf8", top: "ifl", st: "", lng: "ru", ch: "Цель 99", orig: "Как сортировать пластик", ck: "2026-10-17",
      t: t("Пластикни қандай саралаш керак", "Как сортировать пластик", "How to sort plastic"),
      sum: t("Учбурчак ичидаги рақамлар (1–7) нимани билдиради ва қайси пластик қабул қилинади.", "Что означают цифры в треугольнике (1–7) и какой пластик принимают.", "What the numbers 1–7 in the triangle mean and which plastics are accepted."),
      pre: t("Шампун идишининг тагидаги учбурчак ва рақам нимани билдиради?", "Что означают треугольник и цифра на дне флакона шампуня?", "What do the triangle and number on a shampoo bottle mean?"),
      k: [
        t("1 PET — сув бутилкалари; 2 HDPE — канистра, шампун; 4 LDPE — плёнка ва пакет; 5 PP — қопқоқ ва овқат идиши.", "1 PET — бутылки; 2 HDPE — канистры, флаконы; 4 LDPE — плёнка и пакеты; 5 PP — крышки и контейнеры.", "1 PET – bottles; 2 HDPE – jugs, shampoo; 4 LDPE – film and bags; 5 PP – caps and tubs."),
        t("3 PVC ва 6 PS (пенопласт) қайта ишлаш қийин; 7 OTHER — аралаш пластик.", "3 PVC и 6 PS (пенопласт) перерабатывать сложно; 7 OTHER — смешанные.", "3 PVC and 6 PS (foam) are hard to recycle; 7 OTHER is mixed plastic."),
        t("Идишни бўшатиб, чайиб, қуруқ ҳолда ва иложи бўлса эзиб топширинг.", "Сдавайте ёмкости пустыми, ополоснутыми, сухими и по возможности сплющенными.", "Hand in containers empty, rinsed, dry and squashed if possible.")
      ],
      q: [
        q(t("Сув бутилкаси одатда қайси рақам?", "Каким номером обычно маркируют бутылку для воды?", "What number is a water bottle usually?"),
          [t("1 (PET)", "1 (PET)", "1 (PET)"), t("6 (PS)", "6 (PS)", "6 (PS)"), t("3 (PVC)", "3 (PVC)", "3 (PVC)")], 0,
          t("PET — энг кўп қайта ишланадиган пластик.", "PET — самый перерабатываемый пластик.", "PET is the most recycled plastic.")),
        q(t("Нега идишни ювиш керак?", "Зачем мыть упаковку?", "Why rinse containers?"),
          [t("Ифлос хом ашё партияни бузади", "Грязь портит партию сырья", "Dirt spoils the batch"), t("Чиройли кўриниши учун", "Для красоты", "To look nice"), t("Шарт эмас", "Не обязательно", "No need")], 0,
          t("Озиқ қолдиқлари қайта ишлашни қийинлаштиради.", "Остатки еды мешают переработке.", "Food residue makes recycling harder."))
      ],
      task: t("Уйдаги 10 та пластик буюмнинг рақамини топиб, «қабул қилинади / қийин» деб жадвал тузинг.", "Найдите номера на 10 пластиковых вещах и разделите их на «принимают / сложно».", "Find the number on 10 plastic items and sort them into “accepted / hard”.") },

    { id: "v-butilka-ru", yt: "wmfPIe46acQ", top: "ifl", st: "", lng: "ru", ch: "Скрыпник", orig: "Как перерабатывают ПЛАСТИКОВЫЕ бутылки?", ck: "2026-10-17",
      t: t("Пластик бутилкалар қандай қайта ишланади", "Как перерабатывают пластиковые бутылки", "How plastic bottles are recycled"),
      sum: t("Заводда PET бутилкалар қандай саралаш, майдалаш, ювиш ва гранулага айлантириш босқичларидан ўтиши.", "Как на заводе PET-бутылки проходят сортировку, дробление, мойку и грануляцию.", "How PET bottles go through sorting, shredding, washing and pelletising at a plant."),
      pre: t("Эски бутилкадан кийим тайёрлаш мумкин деб ўйлайсизми?", "Можно ли, по-вашему, сделать одежду из старой бутылки?", "Do you think clothes can be made from old bottles?"),
      k: [
        t("Бутилкалар рангига қараб ажратилади, ёрлиқ ва қопқоқ олиб ташланади.", "Бутылки сортируют по цвету, снимают этикетки и крышки.", "Bottles are sorted by colour; labels and caps are removed."),
        t("Майдаланиб «флекс» ҳолига келтирилади, ювилади ва қуритилади.", "Их дробят во «флекс», моют и сушат.", "They are shredded into “flakes”, washed and dried."),
        t("Флексдан тола (кийим, гилам), тасма ва янги бутилкалар тайёрланади.", "Из флекса делают волокно (одежда, ковры), ленту и новые бутылки.", "Flakes become fibre (clothes, carpets), strapping and new bottles.")
      ],
      q: [
        q(t("Майдаланган PET бўлакчаси нима дейилади?", "Как называют дроблёный PET?", "What is shredded PET called?"),
          [t("Флекс", "Флекс", "Flakes"), t("Гранит", "Гранит", "Granite"), t("Целлюлоза", "Целлюлоза", "Cellulose")], 0,
          t("Кейин флекс эритилиб, гранулага айланиши мумкин.", "Затем флекс можно расплавить в гранулы.", "Flakes can then be melted into pellets.")),
        q(t("Қайта ишланган PET дан нима қилинади?", "Что делают из переработанного PET?", "What is recycled PET used for?"),
          [t("Полиэстер тола ва янги бутилкалар", "Полиэфирное волокно и новые бутылки", "Polyester fibre and new bottles"), t("Шиша", "Стекло", "Glass"), t("Қоғоз", "Бумагу", "Paper")], 0,
          t("Флисли кофталар кўпинча қайта ишланган PET дан.", "Флисовые кофты часто из вторичного PET.", "Fleece jackets are often recycled PET."))
      ],
      task: t("1,5 литрли бутилка ~30 г. Синфингиз йилига нечта бутилка ишлатишини ҳисоблаб, килограммда ифодаланг.", "Бутылка 1,5 л весит ~30 г. Посчитайте, сколько бутылок в год использует класс, и выразите в кг.", "A 1.5 L bottle weighs ~30 g. Estimate your class’s bottles per year and convert to kg.") },

    { id: "v-mikroplast-ru", yt: "L11vgdf35rM", top: "ifl", st: "", lng: "ru", ch: "Телеканал 24kz", orig: "Пластик внутри нас | Экология", ck: "2026-10-17",
      t: t("Ичимиздаги пластик: микропластик", "Пластик внутри нас: микропластик", "Plastic inside us: microplastics"),
      sum: t("Микропластик қаердан пайдо бўлади, у сув, озиқ ва инсон организмида қандай топилган ва нима қилиш мумкин.", "Откуда берётся микропластик, где его находят — в воде, еде и организме человека — и что можно сделать.", "Where microplastics come from, how they are found in water, food and our bodies, and what we can do."),
      pre: t("Сиз бугун қанча бир марталик пластик ишлатдингиз?", "Сколько одноразового пластика вы сегодня использовали?", "How much single-use plastic have you used today?"),
      k: [
        t("Микропластик — 5 мм дан кичик пластик заррачалар.", "Микропластик — частицы пластика меньше 5 мм.", "Microplastics are plastic particles smaller than 5 mm."),
        t("Манбалар: синтетик кийим ювилиши, шина ейилиши, катта пластикнинг парчаланиши.", "Источники: стирка синтетики, износ шин, распад крупного пластика.", "Sources: washing synthetic clothes, tyre wear and larger plastic breaking down."),
        t("Улар сув, туз, денгиз маҳсулотларида ва инсон қонида топилган; соғлиққа таъсири ҳали ўрганилмоқда.", "Его находят в воде, соли, морепродуктах и крови человека; влияние на здоровье ещё изучают.", "They’ve been found in water, salt, seafood and human blood; health effects are still being studied.")
      ],
      q: [
        q(t("Микропластик ўлчами қандай?", "Каков размер микропластика?", "How big are microplastics?"),
          [t("5 мм дан кичик", "Меньше 5 мм", "Under 5 mm"), t("5 см дан катта", "Больше 5 см", "Over 5 cm"), t("1 метр", "1 метр", "1 metre")], 0,
          t("Кўпини оддий кўз билан кўриб бўлмайди.", "Многие частицы не видны глазом.", "Many can’t be seen by eye.")),
        q(t("Микропластик манбаларидан бири?", "Один из источников микропластика?", "One source of microplastics?"),
          [t("Синтетик кийимни ювиш", "Стирка синтетической одежды", "Washing synthetic clothes"), t("Пахта кўйлак", "Хлопковая рубашка", "A cotton shirt"), t("Шиша идиш", "Стеклянная банка", "A glass jar")], 0,
          t("Ҳар бир ювишда минглаб толачалар чиқади.", "При каждой стирке выделяются тысячи волокон.", "Each wash sheds thousands of fibres."))
      ],
      task: t("Бир кунда ишлатган бир марталик пластикларингиз рўйхатини тузиб, 3 тасини кўп марта ишлатиладиганига алмаштиринг.", "Составьте список одноразового пластика за день и замените 3 вещи многоразовыми.", "List your single-use plastic for a day and swap 3 items for reusable ones.") },

    { id: "v-varlamov-ru", yt: "vdyR-eN28e0", top: "ifl", st: "u", lng: "ru", ch: "Varlamov Travel", au: "Илья Варламов", orig: "Как решить проблему мусора? | Отходы, сортировка, Zero Waste, экология | Илья Варламов", ck: "2026-10-17",
      t: t("Чиқинди муаммосини қандай ҳал қилиш мумкин?", "Как решить проблему мусора?", "How can we solve the waste problem?"),
      sum: t("Шаҳарлар тажрибаси: чиқиндилар иерархияси, Zero Waste, депозит тизими ва алоҳида йиғишни ташкил қилиш.", "Опыт городов: иерархия отходов, Zero Waste, залоговая система и организация раздельного сбора.", "City experience: the waste hierarchy, zero waste, deposit schemes and separate collection."),
      pre: t("Чиқиндини ёқиш ёки кўмиш — қайси бири яхшироқ? Ёки учинчи йўл борми?", "Что лучше — сжигать или закапывать мусор? Или есть третий путь?", "Is burning or burying waste better? Or is there a third way?"),
      k: [
        t("Чиқиндилар иерархияси: олдини олиш → қайта фойдаланиш → қайта ишлаш → энергия олиш → полигон.", "Иерархия отходов: предотвращение → повторное использование → переработка → энергия → полигон.", "Waste hierarchy: prevent → reuse → recycle → recover energy → landfill."),
        t("5R тамойили: Refuse (рад этиш), Reduce (камайтириш), Reuse, Recycle, Rot (компост).", "Принцип 5R: Refuse, Reduce, Reuse, Recycle, Rot (компост).", "The 5Rs: refuse, reduce, reuse, recycle, rot (compost)."),
        t("Депозит тизими (идиш учун гаров) Германия каби давлатларда бутилкаларнинг 90 фоиздан ортиғини қайтаради.", "Залоговая система (депозит за тару) в Германии и других странах возвращает более 90 % бутылок.", "Deposit schemes (a refundable charge per container) bring back over 90% of bottles in countries like Germany.")
      ],
      q: [
        q(t("Иерархияда энг юқори ўрин нима?", "Что на вершине иерархии отходов?", "What is at the top of the waste hierarchy?"),
          [t("Олдини олиш", "Предотвращение", "Prevention"), t("Полигон", "Полигон", "Landfill"), t("Ёқиш", "Сжигание", "Burning")], 0,
          t("Энг яхши чиқинди — пайдо бўлмаган чиқинди.", "Лучший мусор — тот, что не появился.", "The best waste is waste never made.")),
        q(t("Депозит тизими нима?", "Что такое залоговая система?", "What is a deposit scheme?"),
          [t("Идиш учун гаров, қайтарганда пул берилади", "Залог за тару, возвращается при сдаче", "A refundable charge per container"), t("Янги солиқ", "Новый налог", "A new tax"), t("Жарима", "Штраф", "A fine")], 0,
          t("Пулни қайтариб олиш учун одамлар идишни топширади.", "Чтобы вернуть деньги, люди сдают тару.", "People return containers to get money back."))
      ],
      task: t("Мактабингиз учун 5R режасини тузинг: ҳар бир R га битта амалий чора ёзинг.", "Составьте план 5R для школы: по одной мере на каждую R.", "Write a 5R plan for your school: one action per R.") },

    { id: "v-ellen-en", yt: "16MJb9X21yw", top: "ifl", st: "u", lng: "en", ch: "RE:TV", orig: "Ellen MacArthur Foundation: The Circular Food Economy", ck: "2026-10-17",
      t: t("Озиқ-овқатнинг айланма иқтисодиёти", "Циркулярная экономика продовольствия", "The circular food economy"),
      sum: t("Эллен Макартур фонди «ол — ишлат — ташла» моделидан чиқиндисиз, табиатни тикловчи озиқ тизимига ўтишни тушунтиради.", "Фонд Эллен Макартур объясняет переход от модели «взял — использовал — выбросил» к безотходной, восстанавливающей системе питания.", "The Ellen MacArthur Foundation explains moving from “take–make–waste” to a waste-free, regenerative food system."),
      pre: t("Уйингизда бир ҳафтада қанча овқат ташланади деб ўйлайсиз?", "Как вы думаете, сколько еды выбрасывается у вас дома за неделю?", "How much food do you think your home throws away in a week?"),
      k: [
        t("Чизиқли модел: ол → ишлат → ташла; айланма модел: чиқиндини лойиҳалаш босқичидаёқ йўқотиш.", "Линейная модель: взял → использовал → выбросил; циркулярная — устранить отходы ещё на этапе проектирования.", "Linear: take → make → waste; circular: design waste out from the start."),
        t("FAO ҳисобига кўра, дунёда етиштирилган озиқнинг тахминан учдан бир қисми йўқотилади ёки исроф бўлади.", "По оценке ФАО, около трети производимой еды теряется или выбрасывается.", "The FAO estimates about a third of food produced is lost or wasted."),
        t("Органик қолдиқ компост ва биогазга айланиб, тупроққа озиқ сифатида қайтади.", "Органика превращается в компост и биогаз и возвращается в почву.", "Food scraps become compost and biogas, returning nutrients to soil.")
      ],
      q: [
        q(t("Айланма иқтисодиётнинг асосий ғояси?", "Главная идея циркулярной экономики?", "The core idea of a circular economy?"),
          [t("Чиқиндини лойиҳалаш босқичидаёқ йўқотиш", "Убрать отходы ещё на этапе проектирования", "Design out waste from the start"), t("Кўпроқ ишлаб чиқариб ташлаш", "Производить и выбрасывать больше", "Make and throw away more"), t("Фақат ёқиш", "Только сжигать", "Just burn it")], 0,
          t("Маҳсулот ва материаллар айланишда қолади.", "Продукты и материалы остаются в обороте.", "Products and materials stay in use.")),
        q(t("FAO га кўра озиқнинг қанчаси исроф бўлади?", "Какая доля еды теряется по данным ФАО?", "How much food is lost or wasted (FAO)?"),
          [t("~⅓", "~треть", "~a third"), t("~1 %", "~1 %", "~1%"), t("Деярли ҳеч", "Почти ничего", "Almost none")], 0,
          t("Бу ер, сув ва энергиянинг ҳам исрофи.", "Это ещё и потеря земли, воды и энергии.", "That also wastes land, water and energy."))
      ],
      task: t("Бир ҳафта оилангиз ташлаган овқатни ёзиб боринг ва исрофни камайтиришнинг 3 усулини синаб кўринг.", "Неделю записывайте, какую еду выбрасывает семья, и попробуйте 3 способа сократить потери.", "Log your family’s food waste for a week and try 3 ways to cut it.") },

    /* ---------- Биохилма-хиллик ва ўрмон ---------- */
    { id: "v-daraxt-ru", yt: "tcm6JK-PW_g", top: "bio", st: "m", lng: "ru", ch: "Разумейкин", orig: "Деревья лиственные и хвойные. Сайт - игра Разумейкин", ck: "2026-10-17",
      t: t("Баргли ва игнабаргли дарахтлар", "Лиственные и хвойные деревья", "Broadleaf and conifer trees"),
      sum: t("Болалар учун: баргли ва игнабаргли дарахтларни қандай ажратиш, улар қишда нима қилиши.", "Для детей: как отличить лиственные деревья от хвойных и что они делают зимой.", "For children: how to tell broadleaf trees from conifers and what they do in winter."),
      pre: t("Нега арча қишда ҳам яшил, терак эса барг тўкади?", "Почему ель зимой зелёная, а тополь сбрасывает листья?", "Why is a spruce green in winter while a poplar drops its leaves?"),
      k: [
        t("Баргли дарахтларнинг барги кенг ва кузда тўкилади: терак, тол, чинор, ёнғоқ.", "У лиственных широкие листья, осенью они опадают: тополь, ива, платан, орех.", "Broadleaf trees have wide leaves that fall in autumn: poplar, willow, plane, walnut."),
        t("Игнабаргли дарахтларнинг барги игна шаклида, кўпи қишда ҳам яшил: арча, қарағай. Тилоғоч (лиственница) эса игнасини тўкади.", "У хвойных листья-иголки, большинство зелёные зимой: ель, сосна. Лиственница же сбрасывает хвою.", "Conifers have needles and most stay green in winter: spruce, pine. The larch, though, drops its needles."),
        t("Ўзбекистон тоғларида арча ўрмонлари сувни ушлаб, тупроқни эрозиядан сақлайди.", "Арчовые леса в горах Узбекистана удерживают воду и защищают почву от эрозии.", "Juniper (archa) forests in Uzbekistan’s mountains hold water and protect soil.")
      ],
      q: [
        q(t("Қайси дарахт игнабаргли?", "Какое дерево хвойное?", "Which tree is a conifer?"),
          [t("Арча", "Арча (можжевельник)", "Juniper"), t("Чинор", "Платан", "Plane tree"), t("Ёнғоқ", "Орех", "Walnut")], 0,
          t("Арчанинг барги игна ёки тангача шаклида.", "Листья арчи — иголки или чешуйки.", "Juniper leaves are needles or scales.")),
        q(t("Қишда игнасини тўкадиган игнабаргли дарахт?", "Какое хвойное сбрасывает хвою на зиму?", "Which conifer drops its needles in winter?"),
          [t("Тилоғоч (лиственница)", "Лиственница", "Larch"), t("Қарағай", "Сосна", "Pine"), t("Арча", "Ель", "Spruce")], 0,
          t("Номи ҳам шундан келиб чиққан.", "Отсюда и название.", "Its Russian name even means “leaf-tree”."))
      ],
      task: t("Ҳовлидаги 5 та дарахтнинг баргини йиғиб, гербарий қилинг ва ҳар бирининг номини ёзинг.", "Соберите листья 5 деревьев во дворе, сделайте гербарий и подпишите названия.", "Collect leaves from 5 trees, press them and label each one.") },

    { id: "v-qizilkitob-ru", yt: "ggxLRGZm4zY", top: "bio", st: "", lng: "ru", ch: "КОКТЕЙЛЬ ЗНАНИЙ", orig: "КАК ПОЯВИЛАСЬ КРАСНАЯ КНИГА", ck: "2026-10-17",
      t: t("Қизил китоб қандай пайдо бўлган", "Как появилась Красная книга", "How the Red Book began"),
      sum: t("Қизил китобнинг тарихи, IUCN хавф тоифалари ва нима учун турларни рўйхатга олиш муҳим.", "История Красной книги, категории угрозы МСОП и зачем вести учёт видов.", "The history of the Red Book (Red List), IUCN threat categories and why tracking species matters."),
      pre: t("Нега китобнинг ранги айнан қизил танланган деб ўйлайсиз?", "Почему, по-вашему, книгу сделали именно красной?", "Why do you think the book was made red?"),
      k: [
        t("Биринчи халқаро Қизил китобни Табиатни муҳофаза қилиш халқаро иттифоқи (IUCN) 1960-йилларда нашр этган; қизил — хавф белгиси.", "Первую международную Красную книгу издал МСОП (IUCN) в 1960-х; красный — сигнал опасности.", "The IUCN published the first international Red Data Book in the 1960s; red signals danger."),
        t("Бугун IUCN Қизил рўйхати 160 мингдан ортиқ турни баҳолайди: CR — йўқолиш арафасида, EN — хавф остида, VU — заиф.", "Сегодня Красный список МСОП оценивает более 160 тысяч видов: CR — на грани, EN — под угрозой, VU — уязвимые.", "Today the IUCN Red List assesses over 160,000 species: CR critically endangered, EN endangered, VU vulnerable."),
        t("Ўзбекистон Қизил китобининг 2019 йилги нашрига 500 дан ортиқ ўсимлик ва ҳайвон тури киритилган.", "В издание Красной книги Узбекистана 2019 года внесено более 500 видов растений и животных.", "The 2019 Red Book of Uzbekistan lists over 500 plant and animal species.")
      ],
      q: [
        q(t("Қизил китобни биринчи бўлиб ким тузган?", "Кто первым создал Красную книгу?", "Who created the first Red Book?"),
          [t("IUCN", "МСОП (IUCN)", "The IUCN"), t("ЮНИСЕФ", "ЮНИСЕФ", "UNICEF"), t("ФИФА", "ФИФА", "FIFA")], 0,
          t("IUCN 1948 йилда тузилган.", "МСОП основан в 1948 году.", "The IUCN was founded in 1948.")),
        q(t("«CR» тоифаси нимани англатади?", "Что означает категория «CR»?", "What does “CR” mean?"),
          [t("Йўқолиб кетиш арафасида", "На грани исчезновения", "Critically endangered"), t("Хавфсиз", "Вне опасности", "Safe"), t("Аллақачон йўқолган", "Уже исчез", "Already extinct")], 0,
          t("Йўқолган турлар EX тоифасида.", "Исчезнувшие — категория EX.", "Extinct species are EX."))
      ],
      task: t("Ўзбекистон Қизил китобидан 3 тур (масалан, Бухоро буғуси, қор қоплони, Устюрт муфлони) ҳақида кичик плакат тайёрланг.", "Сделайте мини-плакат о 3 видах из Красной книги Узбекистана (бухарский олень, снежный барс, устюртский муфлон).", "Make a mini-poster on 3 species from Uzbekistan’s Red Book (Bukhara deer, snow leopard, Ustyurt urial).") },

    { id: "v-qizilrus-ru", yt: "AESgllw1Kv0", top: "bio", st: "m", lng: "ru", ch: "Вместо репетитора Елена Викторовна", orig: "Урок по окружающему миру \"Красная книга России\"", ck: "2026-10-17",
      t: t("Қизил китоб нима учун керак (табиатшунослик дарси)", "Зачем нужна Красная книга (урок окружающего мира)", "Why we need a Red Book (nature lesson)"),
      sum: t("Бошланғич синф дарси: Қизил китоб саҳифаларининг ранглари, камёб турлар ва уларни қандай асраш мумкин.", "Урок для начальной школы: цвета страниц Красной книги, редкие виды и как их беречь.", "A primary-school lesson: the coloured pages of the Red Book, rare species and how to protect them."),
      pre: t("Сизнинг ҳудудингизда қайси ҳайвон ёки ўсимлик камайиб кетди?", "Какое животное или растение стало редким в вашей местности?", "Which animal or plant has become rare where you live?"),
      k: [
        t("Қизил китоб — камёб ва йўқолиб бораётган турлар рўйхати; ҳар бир давлатнинг ўз Қизил китоби бор.", "Красная книга — список редких и исчезающих видов; у каждой страны своя.", "A Red Book lists rare and vanishing species; each country has its own."),
        t("Саҳифа ранглари: қора — йўқолган, қизил — хавф остида, сариқ — камаймоқда, оқ — камёб, яшил — тикланган.", "Цвета страниц: чёрные — исчезнувшие, красные — под угрозой, жёлтые — сокращаются, белые — редкие, зелёные — восстановленные.", "Page colours: black – extinct, red – endangered, yellow – declining, white – rare, green – recovered."),
        t("Энг яхши ҳимоя — яшаш муҳитини асраш: кўриқхоналар, миллий боғлар, ов ва йиғишни тақиқлаш.", "Лучшая защита — сохранить места обитания: заповедники, нацпарки, запрет охоты и сбора.", "The best protection is saving habitat: reserves, national parks, bans on hunting and picking.")
      ],
      q: [
        q(t("Яшил саҳифа нимани билдиради?", "Что означает зелёная страница?", "What does a green page mean?"),
          [t("Тикланган турлар", "Восстановленные виды", "Recovered species"), t("Йўқолган турлар", "Исчезнувшие виды", "Extinct species"), t("Заҳарли турлар", "Ядовитые виды", "Poisonous species")], 0,
          t("Демак, ҳимоя чоралари иш берган.", "Значит, меры охраны сработали.", "It means protection worked.")),
        q(t("Камёб турни асрашнинг энг яхши йўли?", "Лучший способ сберечь редкий вид?", "Best way to save a rare species?"),
          [t("Яшаш муҳитини асраш", "Сохранить место обитания", "Protect its habitat"), t("Уйга олиб кетиш", "Забрать домой", "Take it home"), t("Фақат расмга олиш", "Только сфотографировать", "Just take a photo")], 0,
          t("Масалан, Зомин ва Чотқол кўриқхоналари.", "Например, Зааминский и Чаткальский заповедники.", "For example, the Zaamin and Chatkal reserves."))
      ],
      task: t("Синфингиз «Қизил китоби»ни тузинг: ҳудудингиздаги 5 та камёб ўсимлик ёки ҳайвонни расм ва изоҳ билан.", "Создайте «Красную книгу класса»: 5 редких видов вашей местности с рисунком и описанием.", "Make a class Red Book: 5 rare local species with a drawing and note.") },

    { id: "v-marjon", yt: "TPmlD6demPk", top: "bio", st: "", lng: "en", ch: "TED-Ed", au: "Joshua Drew", orig: "Conserving our spectacular, vulnerable coral reefs - Joshua Drew", ck: "2026-10-17",
      t: t("Маржон рифларини асраш", "Сохранить коралловые рифы", "Conserving coral reefs"),
      sum: t("Маржонлар қандай яшайди, нега рифлар денгиз ҳаётининг «шаҳарлари» ва уларга нималар таҳдид солади.", "Как живут кораллы, почему рифы — «города» морской жизни и что им угрожает.", "How corals live, why reefs are the cities of the sea, and what threatens them."),
      pre: t("Маржон — тош, ўсимлик ёки ҳайвонми?", "Коралл — это камень, растение или животное?", "Is coral a rock, a plant or an animal?"),
      k: [
        t("Рифлар океан тубининг 1 фоиздан камини эгаллайди, лекин денгиз турларининг тахминан тўртдан бирига уй.", "Рифы занимают менее 1 % дна океана, но служат домом примерно четверти морских видов.", "Reefs cover under 1% of the seafloor but host about a quarter of marine species."),
        t("Маржон — ичида сув ўтлари (зооксантеллалар) яшайдиган ҳайвон; иссиқлик стрессида улар чиқиб кетади ва маржон оқаради.", "Коралл — животное с водорослями-зооксантеллами внутри; при перегреве они уходят, и коралл обесцвечивается.", "Coral is an animal hosting algae (zooxanthellae); under heat stress they leave and the coral bleaches."),
        t("Таҳдидлар: исиш, кислоталаниш, ифлосланиш ва ортиқча балиқ овлаш.", "Угрозы: потепление, закисление, загрязнение, перелов.", "Threats: warming, acidification, pollution and overfishing.")
      ],
      q: [
        q(t("Маржон нима?", "Что такое коралл?", "What is coral?"),
          [t("Сув ўтлари билан симбиоздаги ҳайвон", "Животное в симбиозе с водорослями", "An animal in symbiosis with algae"), t("Тош", "Камень", "A rock"), t("Ўсимлик", "Растение", "A plant")], 0,
          t("Маржон полиплари медузаларнинг қариндоши.", "Коралловые полипы — родственники медуз.", "Coral polyps are relatives of jellyfish.")),
        q(t("Маржон оқаришининг асосий сабаби?", "Главная причина обесцвечивания?", "Main cause of coral bleaching?"),
          [t("Сув ҳароратининг кўтарилиши", "Рост температуры воды", "Warmer water"), t("Ой ёруғлиги", "Лунный свет", "Moonlight"), t("Шамол", "Ветер", "Wind")], 0,
          t("1–2 °C иссиқлик ҳам бир неча ҳафтада оқаришга олиб келади.", "Даже +1–2 °C за несколько недель вызывают обесцвечивание.", "Even 1–2 °C extra for weeks can cause bleaching."))
      ],
      task: t("Нега Ўзбекистондан узоқдаги рифлар бизга ҳам муҳим? 3 та сабаб ёзинг (иқлим, озиқ, дори).", "Почему далёкие рифы важны и нам? Назовите 3 причины (климат, пища, лекарства).", "Why do faraway reefs matter to us too? Give 3 reasons (climate, food, medicine).") },

    { id: "v-suksessiya-cc", yt: "jZKIHe2LDP8", top: "bio", st: "u", lng: "en", ch: "CrashCourse", orig: "Ecological Succession: Change is Good - Crash Course Ecology #6", ck: "2026-10-17",
      t: t("Экологик сукцессия: ўзгариш — яхши", "Экологическая сукцессия: перемены — это хорошо", "Ecological succession: change is good"),
      sum: t("Ялонғоч жойда ёки ёнғиндан кейин жамоалар қандай босқичма-босқич тикланиши: бирламчи ва иккиламчи сукцессия.", "Как сообщества шаг за шагом восстанавливаются на голом месте или после пожара: первичная и вторичная сукцессия.", "How communities rebuild step by step on bare ground or after a fire: primary and secondary succession."),
      pre: t("Ташландиқ далада 20 йилдан кейин нима ўсади деб ўйлайсиз?", "Что, по-вашему, вырастет на заброшенном поле через 20 лет?", "What do you think grows on an abandoned field after 20 years?"),
      k: [
        t("Бирламчи сукцессия тупроқсиз жойда (лава, ялонғоч тош) лишайник ва мохлардан бошланади.", "Первичная сукцессия на месте без почвы (лава, скалы) начинается с лишайников и мхов.", "Primary succession on soil-less ground (lava, bare rock) starts with lichens and mosses."),
        t("Иккиламчи сукцессия тупроқ сақланган жойда (ёнғин, ташландиқ дала) тезроқ кечади.", "Вторичная — там, где почва сохранилась (пожар, заброшенное поле), идёт быстрее.", "Secondary succession, where soil remains (after fire, old fields), is faster."),
        t("Пионер турлар → оралиқ жамоалар → барқарор (климакс) жамоа; кичик бузилишлар хилма-хилликни сақлайди.", "Пионерные виды → промежуточные сообщества → климакс; небольшие нарушения поддерживают разнообразие.", "Pioneer species → intermediate stages → climax community; small disturbances keep diversity up.")
      ],
      q: [
        q(t("Бирламчи сукцессия қаерда бошланади?", "Где начинается первичная сукцессия?", "Where does primary succession start?"),
          [t("Янги лава ёки ялонғоч тошда", "На свежей лаве или голой скале", "On new lava or bare rock"), t("Ёнғиндан кейинги ўрмонда", "В лесу после пожара", "In a forest after fire"), t("Шаҳар боғида", "В городском парке", "In a city park")], 0,
          t("У ерда ҳали тупроқ йўқ.", "Там ещё нет почвы.", "There is no soil yet.")),
        q(t("Пионер турлар қайсилар?", "Какие виды пионерные?", "Which are pioneer species?"),
          [t("Лишайник ва мохлар", "Лишайники и мхи", "Lichens and mosses"), t("Эман ва қарағай", "Дуб и сосна", "Oak and pine"), t("Йиртқичлар", "Хищники", "Predators")], 0,
          t("Улар тошни емириб, биринчи тупроқни ҳосил қилади.", "Они разрушают камень и создают первую почву.", "They break rock down into the first soil."))
      ],
      task: t("Асфальт ёриғи ёки ташландиқ ердаги ўсимликларни 1 ой ҳафтада бир марта суратга олиб, ўзгаришни ёзинг.", "Месяц раз в неделю фотографируйте растения в трещине асфальта или на пустыре и описывайте изменения.", "Photograph plants in a pavement crack or empty lot weekly for a month and note the changes.") },

    /* ---------- Ер ва чўлланиш ---------- */
    { id: "v-tuproq-ru", yt: "18jITBWHKa0", top: "yer", st: "u", lng: "ru", ch: "ОмГТУ", au: "М.В. Кубарева", orig: "Почвы. Загрязнение и рекультивация почв. Лектор Кубарева М.В.", ck: "2026-10-17",
      t: t("Тупроқ ифлосланиши ва рекультивация (маъруза)", "Загрязнение и рекультивация почв (лекция)", "Soil pollution and land reclamation (lecture)"),
      sum: t("Университет маърузаси: тупроқни ифлослантирувчи моддалар, рекультивациянинг техник ва биологик босқичлари.", "Университетская лекция: загрязнители почв, технический и биологический этапы рекультивации.", "A university lecture on soil pollutants and the technical and biological stages of reclamation."),
      pre: t("Нефт тўкилган ерни қандай қилиб яна экин экишга яроқли қилиш мумкин?", "Как вернуть к жизни землю, залитую нефтью?", "How can oil-soaked land be made fit for crops again?"),
      k: [
        t("Ифлослантирувчилар: оғир металлар (Pb, Cd, Hg), нефт маҳсулотлари, пестицидлар, шўрланиш.", "Загрязнители: тяжёлые металлы (Pb, Cd, Hg), нефтепродукты, пестициды, засоление.", "Pollutants: heavy metals (Pb, Cd, Hg), oil products, pesticides and salinisation."),
        t("Техник рекультивация: ерни текислаш, унумдор қатламни қайтариш, дренаж.", "Техническая рекультивация: планировка, возврат плодородного слоя, дренаж.", "Technical reclamation: levelling, restoring topsoil, drainage."),
        t("Биологик рекультивация: ўсимлик экиш ва микроорганизмлар; фиторемедиация — ўсимликлар ёрдамида тозалаш.", "Биологическая: посадка растений и микроорганизмы; фиторемедиация — очистка растениями.", "Biological reclamation: plants and microbes; phytoremediation cleans soil with plants.")
      ],
      q: [
        q(t("Рекультивациянинг икки босқичи қайсилар?", "Какие два этапа рекультивации?", "What are the two stages of reclamation?"),
          [t("Техник ва биологик", "Технический и биологический", "Technical and biological"), t("Фақат кимёвий", "Только химический", "Chemical only"), t("Ёқиш ва кўмиш", "Сжигание и захоронение", "Burning and burying")], 0,
          t("Аввал ер тайёрланади, кейин тирик қоплама тикланади.", "Сначала готовят землю, потом восстанавливают покров.", "First the land is prepared, then living cover is restored.")),
        q(t("Фиторемедиация нима?", "Что такое фиторемедиация?", "What is phytoremediation?"),
          [t("Ўсимликлар ёрдамида тупроқни тозалаш", "Очистка почвы растениями", "Cleaning soil with plants"), t("Тупроқни асфальтлаш", "Асфальтирование", "Paving soil over"), t("Тупроқни сотиш", "Продажа почвы", "Selling soil")], 0,
          t("Масалан, кунгабоқар ва терак оғир металларни йиғади.", "Например, подсолнечник и тополь накапливают металлы.", "Sunflowers and poplars, for example, absorb metals."))
      ],
      task: t("Яқин атрофдаги бузилган ер (карьер, чиқинди уюми) учун 4 қадамли рекультивация режаси тузинг.", "Составьте 4-шаговый план рекультивации нарушенного участка поблизости (карьер, свалка).", "Draw up a 4-step reclamation plan for damaged land nearby (quarry, dump).") },

    { id: "v-pochva-ru", yt: "dY6cxqIMCeU", top: "yer", st: "", lng: "ru", ch: "Факультет почвоведения МГУ", orig: "Поговорим о почве // Let's Talk About Soil (Russian version)", ck: "2026-10-17",
      t: t("Тупроқ ҳақида гаплашайлик", "Поговорим о почве", "Let’s talk about soil"),
      sum: t("Халқаро «Let’s Talk About Soil» анимациясининг рус тилидаги нусхаси: тупроқ қандай ҳосил бўлади, нега у тугаб бормоқда.", "Русская версия международной анимации «Let’s Talk About Soil»: как образуется почва и почему она исчезает.", "The Russian version of the international “Let’s Talk About Soil” animation: how soil forms and why we are losing it."),
      pre: t("1 сантиметр тупроқ ҳосил бўлиши учун қанча вақт керак деб ўйлайсиз?", "Сколько времени нужно, чтобы образовался 1 см почвы?", "How long do you think 1 cm of soil takes to form?"),
      k: [
        t("Тупроқ — тирик ва жонсиз дунё чегарасидаги қатлам; 1 см ҳосил бўлиши юзлаб йил олиши мумкин.", "Почва — слой на границе живого и неживого; 1 см может формироваться сотни лет.", "Soil sits between the living and non-living world; 1 cm can take centuries to form."),
        t("FAO маълумотига кўра, озиқ-овқатимизнинг тахминан 95 фоизи тупроқ билан боғлиқ.", "По данным ФАО, около 95 % нашей пищи связано с почвой.", "According to the FAO, about 95% of our food depends on soil."),
        t("Эрозия, шўрланиш ва бетонлаш тупроқни йўқотади; тупроқ эса катта углерод омбори.", "Эрозия, засоление и застройка уничтожают почву, а она — крупное хранилище углерода.", "Erosion, salinity and sealing destroy soil, which is also a huge carbon store.")
      ],
      q: [
        q(t("1 см тупроқ ҳосил бўлиши учун тахминан қанча вақт керак?", "Сколько примерно формируется 1 см почвы?", "Roughly how long does 1 cm of soil take to form?"),
          [t("Юзлаб йил", "Сотни лет", "Hundreds of years"), t("1 кун", "1 день", "1 day"), t("1 ой", "1 месяц", "1 month")], 0,
          t("Шунинг учун тупроқ амалда тикланмайдиган ресурс.", "Поэтому почва — практически невозобновимый ресурс.", "So soil is practically non-renewable.")),
        q(t("Озиқнинг қанча қисми тупроққа боғлиқ?", "Какая доля пищи зависит от почвы?", "How much of our food depends on soil?"),
          [t("~95 %", "~95 %", "~95%"), t("~10 %", "~10 %", "~10%"), t("~50 %", "~50 %", "~50%")], 0,
          t("Қолгани асосан денгиз ва чучук сувдан.", "Остальное — в основном из морей и пресных вод.", "The rest comes mostly from water."))
      ],
      task: t("Шиша банкага тупроқ ва сув солиб силкитинг; бир кундан кейин қатламларни (қум, лой, гумус) чизинг.", "Налейте в банку почву с водой, встряхните; через сутки зарисуйте слои (песок, глина, гумус).", "Shake soil and water in a jar; after a day, draw the layers (sand, clay, humus).") },

    { id: "v-pustynya-ru", yt: "36YnSOIodA0", top: "yer", st: "", lng: "ru", ch: "Сортировочная", orig: "Когда Земля превратится в пустыню? | Сортировочная", ck: "2026-10-17",
      t: t("Ер қачон чўлга айланади? Чўлланиш", "Когда Земля превратится в пустыню? Опустынивание", "When will Earth turn to desert? Desertification"),
      sum: t("Чўлланиш нима, унинг табиий ва инсон сабаблари, қайси ҳудудлар хавф остида ва уни қандай тўхтатиш мумкин.", "Что такое опустынивание, его природные и антропогенные причины, какие регионы под угрозой и как это остановить.", "What desertification is, its natural and human causes, where it threatens and how to stop it."),
      pre: t("Чўл ва чўлланиш бир нарсами?", "Пустыня и опустынивание — это одно и то же?", "Are a desert and desertification the same thing?"),
      k: [
        t("Чўлланиш — қуруқ ҳудудларда иқлим ва инсон таъсирида ер унумдорлигининг йўқолиши (UNCCD таърифи).", "Опустынивание — деградация земель в засушливых районах под влиянием климата и человека (определение КБО ООН).", "Desertification is land degradation in drylands from climate and human activity (UNCCD definition)."),
        t("Сабаблар: ортиқча ўтлатиш, бутазорларни кесиш, нотўғри суғориш ва шўрланиш.", "Причины: перевыпас, вырубка кустарников, неправильный полив и засоление.", "Causes: overgrazing, cutting shrubs, poor irrigation and salinisation."),
        t("Ечимлар: ихота ўрмонлари, саксовул экиш, томчилатиб суғориш, яйловларни навбатлаб ишлатиш.", "Решения: лесополосы, посадки саксаула, капельный полив, ротация пастбищ.", "Fixes: shelterbelts, planting saxaul, drip irrigation and rotating pastures.")
      ],
      q: [
        q(t("Чўлланишга қарши БМТ конвенцияси қайси?", "Как называется конвенция ООН по борьбе с опустыниванием?", "Which UN convention fights desertification?"),
          [t("UNCCD", "КБО ООН (UNCCD)", "UNCCD"), t("UNESCO", "ЮНЕСКО", "UNESCO"), t("FIFA", "ФИФА", "FIFA")], 0,
          t("Конвенция 1994 йилда қабул қилинган.", "Конвенция принята в 1994 году.", "Adopted in 1994.")),
        q(t("Орол тубида қумни ушлаш учун нима экилмоқда?", "Что сажают на дне Арала, чтобы удержать пески?", "What is planted on the Aral seabed to hold sand?"),
          [t("Саксовул", "Саксаул", "Saxaul"), t("Банан", "Банан", "Bananas"), t("Шоли", "Рис", "Rice")], 0,
          t("Саксовул шўр ва қуруқликка чидамли.", "Саксаул устойчив к соли и засухе.", "Saxaul tolerates salt and drought."))
      ],
      task: t("Ҳудудингизда чўлланишнинг 3 белгисини топинг (шўр доғлар, қуриган бутазор, кўчма қум) ва ҳар бирига ечим ёзинг.", "Найдите в своём районе 3 признака опустынивания (солончаки, высохший кустарник, пески) и предложите решения.", "Find 3 signs of desertification near you (salt patches, dead shrubs, drifting sand) and propose fixes.") },

    /* ---------- Орол фожиаси ---------- */
    { id: "v-bbc-aral", yt: "5N-_69cWyKo", top: "orol", st: "", lng: "en", ch: "BBC News", orig: "Aral Sea: The sea that dried up in 40 years - BBC News", ck: "2026-10-17",
      t: t("Орол: 40 йилда қуриган денгиз (BBC)", "Арал: море, высохшее за 40 лет (BBC)", "Aral Sea: the sea that dried up in 40 years (BBC)"),
      sum: t("BBC репортажи: Совет даврида дарёларнинг пахтага бурилиши, Мўйноқнинг кемалар қабристони ва Шимолий Оролнинг қисман тикланиши.", "Репортаж BBC: поворот рек на хлопок в советское время, кладбище кораблей Муйнака и частичное восстановление Малого Арала.", "A BBC report: Soviet diversion of rivers for cotton, Moynaq’s ship graveyard and the partial revival of the North Aral."),
      pre: t("Денгиз 40 йилда йўқ бўлиб кетиши мумкин деб ўйлаганмисиз? Бунга нима сабаб бўлиши мумкин?", "Могли бы вы подумать, что море исчезнет за 40 лет? Что могло стать причиной?", "Would you believe a sea could vanish in 40 years? What could cause it?"),
      k: [
        t("1960-йиллардан бошлаб Амударё ва Сирдарё суви асосан пахта суғоришига олинди.", "С 1960-х воду Амударьи и Сырдарьи стали массово забирать на полив хлопка.", "From the 1960s the Amu Darya and Syr Darya were largely diverted to irrigate cotton."),
        t("Орол дастлабки ҳажмининг 10 фоизигача қисқарди, Мўйноқ денгиздан ўнлаб километр узоқда қолди.", "Арал сократился примерно до 10 % исходного объёма; Муйнак оказался в десятках километров от воды.", "The sea shrank to about 10% of its volume, leaving Moynaq tens of kilometres from water."),
        t("Кўкарал тўғони (2005) Шимолий Оролда сув сатҳи ва балиқчиликни қисман тиклади.", "Плотина Кокарал (2005) частично вернула уровень воды и рыболовство Малому Аралу.", "The Kokaral dam (2005) partly restored water levels and fishing in the North Aral.")
      ],
      q: [
        q(t("Мўйноқ нима билан машҳур бўлиб қолди?", "Чем стал известен Муйнак?", "What is Moynaq now known for?"),
          [t("Қуруқликда қолган кемалар", "Кораблями на суше", "Ships stranded on land"), t("Музликлар", "Ледниками", "Glaciers"), t("Шаршаралар", "Водопадами", "Waterfalls")], 0,
          t("Кемалар қабристони ҳозир ёдгорлик ва музей.", "Кладбище кораблей теперь памятник и музей.", "The ship graveyard is now a memorial and museum.")),
        q(t("Дарё суви асосан нимага ишлатилган?", "На что в основном забирали воду рек?", "What was the river water mainly used for?"),
          [t("Пахта суғоришига", "На полив хлопка", "Irrigating cotton"), t("Кема қуришга", "На судостроение", "Shipbuilding"), t("Фақат ичишга", "Только для питья", "Drinking only")], 0,
          t("Суғориш каналларида сувнинг катта қисми буғланиб ва сизиб йўқолган.", "В каналах много воды терялось на испарение и фильтрацию.", "Much was lost to evaporation and seepage in canals."))
      ],
      task: t("Орол ҳақида 1 дақиқалик «янгилик» матни ёзинг ва ўқиб, телефонга видео қилиб олинг.", "Напишите текст «новости» об Арале на 1 минуту и запишите видео на телефон.", "Write a 1-minute news script about the Aral Sea and record it on a phone.") },

    { id: "v-aral24-ru", yt: "T_Q7Nbmy2Tc", top: "orol", st: "", lng: "ru", ch: "Телеканал 24kz", orig: "Вернётся ли к нам Арал? Как возрождают высохшее море и людские надежды | Спецпроект", ck: "2026-10-17",
      t: t("Орол қайтадими? Шимолий Оролни тиклаш", "Вернётся ли Арал? Возрождение Малого Арала", "Will the Aral come back? Reviving the North Aral"),
      sum: t("Қозоғистон телеканали лойиҳаси: Кўкарал тўғонидан кейин Шимолий (Кичик) Оролда сув, балиқ ва одамларнинг ҳаёти қандай ўзгарди.", "Спецпроект казахстанского телеканала: как после плотины Кокарал изменились вода, рыба и жизнь людей у Малого Арала.", "A Kazakh TV special on how water, fish and people’s lives changed at the North Aral after the Kokaral dam."),
      pre: t("Қуриган денгизни қисман бўлса ҳам қайтариш мумкинми?", "Можно ли хотя бы частично вернуть высохшее море?", "Can a dried-up sea be brought back, even partly?"),
      k: [
        t("2005 йилда қурилган Кўкарал тўғони Сирдарё сувини Шимолий Оролда ушлаб қолди.", "Плотина Кокарал (2005) удержала воды Сырдарьи в Малом Арале.", "The Kokaral dam (2005) kept Syr Darya water in the North Aral."),
        t("Сув сатҳи кўтарилди, шўрлик камайди, балиқ турлари ва балиқчилик қайтди.", "Уровень воды вырос, солёность упала, вернулись рыба и промысел.", "Water rose, salinity fell, and fish and fishing returned."),
        t("Жанубий (Катта) Оролга Амударё суви деярли етиб бормайди — у асосан қуриган.", "До Большого Арала вода Амударьи почти не доходит — он в основном высох.", "Little Amu Darya water reaches the South Aral, which has largely dried up.")
      ],
      q: [
        q(t("Шимолий Оролни қайси иншоот қутқарди?", "Какое сооружение спасло Малый Арал?", "What structure saved the North Aral?"),
          [t("Кўкарал тўғони", "Плотина Кокарал", "The Kokaral dam"), t("Чорвоқ сув омбори", "Чарвакское водохранилище", "Charvak reservoir"), t("Асвон тўғони", "Асуанская плотина", "The Aswan dam")], 0,
          t("Тўғон Жаҳон банки кўмагида қурилган.", "Плотину построили при поддержке Всемирного банка.", "It was built with World Bank support.")),
        q(t("Кичик Оролни қайси дарё тўйинтиради?", "Какая река питает Малый Арал?", "Which river feeds the North Aral?"),
          [t("Сирдарё", "Сырдарья", "The Syr Darya"), t("Амударё", "Амударья", "The Amu Darya"), t("Зарафшон", "Зеравшан", "The Zarafshan")], 0,
          t("Амударё эса Жанубий Оролга оқарди.", "Амударья же текла в Большой Арал.", "The Amu Darya fed the South Aral."))
      ],
      task: t("Харитада Катта ва Кичик Орол, Сирдарё ва Амударёни белгиланг ва нега уларнинг тақдири ҳар хил бўлганини ёзинг.", "Отметьте на карте Большой и Малый Арал, Сырдарью и Амударью; объясните, почему их судьба разная.", "Mark the South and North Aral, Syr Darya and Amu Darya on a map, and explain why their fates differ.") },

    { id: "v-aralekot-ru", yt: "S02wBJ7RYzo", top: "orol", st: "", lng: "ru", ch: "Телеканал 24kz", orig: "Восстановление экосистемы Аральского моря", ck: "2026-10-17",
      t: t("Орол экотизимини тиклаш", "Восстановление экосистемы Аральского моря", "Restoring the Aral Sea ecosystem"),
      sum: t("Орол тубида чўл ўсимликлари экиш, туз-қум бўронларини камайтириш ва минтақани тиклаш бўйича ишлар.", "Посадки на дне Арала, борьба с солепылевыми бурями и восстановление региона.", "Planting on the Aral seabed, fighting salt-dust storms and restoring the region."),
      pre: t("Қуриган денгиз тубидан кўтарилган туз қаергача учиб бориши мумкин?", "Как далеко может разлетаться соль со дна высохшего моря?", "How far can salt from a dried seabed blow?"),
      k: [
        t("Орол тубида «Оролқум» деган янги чўл пайдо бўлди; ундан туз ва чанг юзлаб километрга тарқалади.", "На дне Арала возникла новая пустыня Аралкум; соль и пыль разносятся на сотни километров.", "A new desert, the Aralkum, formed on the seabed; salt and dust travel hundreds of kilometres."),
        t("Ўзбекистон ва Қозоғистон миллионлаб гектарда саксовул, қандим ва бошқа чўл ўсимликларини экмоқда.", "Узбекистан и Казахстан высаживают саксаул, джузгун и другие растения на миллионах гектаров.", "Uzbekistan and Kazakhstan are planting saxaul, calligonum and other plants across millions of hectares."),
        t("2021 йилда БМТ Бош Ассамблеяси Орол бўйини экологик инновациялар ва технологиялар ҳудуди деб эълон қилди.", "В 2021 году Генассамблея ООН объявила Приаралье зоной экологических инноваций и технологий.", "In 2021 the UN General Assembly declared the Aral region a zone of ecological innovation and technology.")
      ],
      q: [
        q(t("Орол тубидаги янги чўлнинг номи?", "Как называется новая пустыня на дне Арала?", "What is the new desert on the Aral seabed called?"),
          [t("Оролқум", "Аралкум", "Aralkum"), t("Қизилқум", "Кызылкум", "Kyzylkum"), t("Қорақум", "Каракумы", "Karakum")], 0,
          t("Бу дунёдаги энг ёш чўл.", "Это самая молодая пустыня мира.", "It is the world’s youngest desert.")),
        q(t("Саксовул экишдан мақсад нима?", "Зачем сажают саксаул?", "Why plant saxaul?"),
          [t("Туз ва қум бўронларини камайтириш", "Чтобы уменьшить солепылевые бури", "To reduce salt and sand storms"), t("Мева олиш", "Ради плодов", "For fruit"), t("Денгизни тўлдириш", "Чтобы наполнить море", "To refill the sea")], 0,
          t("Илдизлари қумни ушлайди.", "Корни удерживают песок.", "Its roots hold the sand."))
      ],
      task: t("Саксовул ҳақида маълумот йиғинг (илдиз чуқурлиги, шўрга чидамлилиги) ва нега айнан у танланганини тушунтиринг.", "Соберите сведения о саксауле (глубина корней, солеустойчивость) и объясните, почему выбрали именно его.", "Research saxaul (root depth, salt tolerance) and explain why it was chosen.") },

    { id: "v-aralpoter-ru", yt: "lODWABqsWWY", top: "orol", st: "", lng: "ru", ch: "DIIMok", orig: "Арал. Потерянное море.", ck: "2026-10-17",
      t: t("Орол — йўқотилган денгиз", "Арал. Потерянное море", "The Aral: a lost sea"),
      sum: t("Ҳужжатли видео: Орол илгари қандай бўлган, у қандай қуриди ва бу минтақа аҳолиси учун нималарга олиб келди.", "Документальное видео: каким был Арал, как он высох и к чему это привело для жителей региона.", "A documentary on what the Aral was like, how it dried up and what it meant for local people."),
      pre: t("Орол бўйида яшовчи оилаларнинг ҳаёти 1960 ва 2020 йилларда қандай фарқ қилади деб ўйлайсиз?", "Как, по-вашему, отличалась жизнь семей у Арала в 1960 и 2020 годах?", "How might life for Aral families have differed between 1960 and 2020?"),
      k: [
        t("1960 йилгача Орол майдони бўйича дунёдаги тўртинчи катта кўл эди (~68 минг км²).", "До 1960 года Арал был четвёртым по площади озером мира (~68 тыс. км²).", "Until 1960 the Aral was the world’s fourth-largest lake (~68,000 km²)."),
        t("2014 йилга келиб Жанубий Оролнинг шарқий ҳавзаси бутунлай қуриди.", "К 2014 году восточная часть Большого Арала полностью высохла.", "By 2014 the eastern basin of the South Aral had dried out completely."),
        t("Оқибатлар: шўрланиш, туз бўронлари, балиқчиликнинг йўқолиши, иқлимнинг кескинлашуви ва аҳоли соғлиғи муаммолари.", "Последствия: засоление, солевые бури, гибель рыболовства, более резкий климат и проблемы со здоровьем.", "Effects: salinity, salt storms, lost fisheries, harsher climate and health problems.")
      ],
      q: [
        q(t("1960 йилда Орол қандай эди?", "Каким был Арал в 1960 году?", "What was the Aral in 1960?"),
          [t("Дунёдаги тўртинчи катта кўл", "Четвёртым озером мира", "The world’s 4th-largest lake"), t("Кичик ҳовуз", "Маленьким прудом", "A small pond"), t("Океан қисми", "Частью океана", "Part of an ocean")], 0,
          t("У минглаб балиқчиларни боқарди.", "Он кормил тысячи рыбаков.", "It fed thousands of fishers.")),
        q(t("Қуришнинг асосий сабаби нима?", "Главная причина высыхания?", "The main cause of drying?"),
          [t("Дарё сувининг суғоришга олиниши", "Забор речной воды на полив", "River water taken for irrigation"), t("Зилзила", "Землетрясение", "An earthquake"), t("Музлаш", "Замерзание", "Freezing")], 0,
          t("Бу инсон фаолияти туфайли юз берган фожиа.", "Это катастрофа, вызванная человеком.", "It was a human-made disaster."))
      ],
      task: t("Мўйноқ ҳақида «олдин ва ҳозир» жадвалини тузинг: денгизгача масофа, балиқчилик, аҳоли, ҳаво.", "Составьте таблицу «до и после» для Муйнака: расстояние до моря, рыболовство, население, воздух.", "Make a “then and now” table for Moynaq: distance to the sea, fishing, population, air.") },

    /* ---------- Тоза энергия ---------- */
    { id: "v-shamol-ted", yt: "xy9nj94xvKA", top: "energ", st: "", lng: "en", ch: "TED-Ed", au: "Rebecca J. Barthelmie, Sara C. Pryor", orig: "How do wind turbines work? - Rebecca J. Barthelmie and Sara C. Pryor", ck: "2026-10-17",
      t: t("Шамол турбиналари қандай ишлайди", "Как работают ветряные турбины", "How do wind turbines work?"),
      sum: t("Паррак аэродинамикаси, шамол тезлиги ва қувват боғлиқлиги, Бец чегараси ва турбиналар нега баланд қурилиши.", "Аэродинамика лопастей, связь скорости ветра и мощности, предел Беца и почему турбины строят высокими.", "Blade aerodynamics, how power depends on wind speed, the Betz limit and why turbines are tall."),
      pre: t("Шамол тезлиги икки баробар ошса, турбина қувати неча баробар ошади деб ўйлайсиз?", "Если скорость ветра удвоится, во сколько раз вырастет мощность?", "If wind speed doubles, how much more power do you think a turbine makes?"),
      k: [
        t("Парраклар самолёт қаноти каби кўтарилиш кучи ҳосил қилиб айланади.", "Лопасти вращаются за счёт подъёмной силы, как крыло самолёта.", "Blades turn using lift, like an aircraft wing."),
        t("Қувват шамол тезлигининг кубига пропорционал: тезлик 2 баробар — қувват 8 баробар.", "Мощность пропорциональна кубу скорости: вдвое больше скорость — в 8 раз больше мощность.", "Power scales with the cube of wind speed: double the speed, eight times the power."),
        t("Бец чегараси: турбина шамол энергиясининг ~59 фоизидан кўпини ола олмайди.", "Предел Беца: турбина не может взять больше ~59 % энергии ветра.", "The Betz limit: a turbine can’t capture more than ~59% of the wind’s energy.")
      ],
      q: [
        q(t("Шамол тезлиги 2 марта ошса, қувват қанча ошади?", "Скорость ветра выросла вдвое. Мощность?", "Wind speed doubles. Power?"),
          [t("~8 марта", "~в 8 раз", "~8 times"), t("2 марта", "в 2 раза", "2 times"), t("Ўзгармайди", "Не изменится", "No change")], 0,
          t("P ~ v³ ⇒ 2³ = 8.", "P ~ v³ ⇒ 2³ = 8.", "P ~ v³ ⇒ 2³ = 8.")),
        q(t("Бец чегараси қанча?", "Чему равен предел Беца?", "What is the Betz limit?"),
          [t("~59 %", "~59 %", "~59%"), t("100 %", "100 %", "100%"), t("10 %", "10 %", "10%")], 0,
          t("Шамолни бутунлай тўхтатиб бўлмайди — у турбинадан ўтиб кетиши керак.", "Ветер нельзя остановить полностью — он должен пройти дальше.", "Air must keep flowing past the rotor."))
      ],
      task: t("3 м/с ва 6 м/с шамолда қувватни солиштиринг (P ~ v³) ва натижани жадвалда кўрсатинг.", "Сравните мощность при ветре 3 и 6 м/с (P ~ v³) и покажите в таблице.", "Compare power at 3 m/s and 6 m/s (P ~ v³) in a table.") },

    { id: "v-wind101", yt: "niZ_cvu9Fts", top: "energ", st: "", lng: "en", ch: "energynownews", orig: "Energy 101: Wind Power", ck: "2026-10-17",
      t: t("Энергия 101: шамол энергияси", "Энергия 101: ветроэнергетика", "Energy 101: wind power"),
      sum: t("Шамол турбинаси қисмлари, шамол фермалари ва денгиздаги (offshore) турбиналар ҳақида қисқа тушунтириш.", "Коротко об устройстве ветряка, ветропарках и морских (офшорных) турбинах.", "A short explainer on turbine parts, wind farms and offshore turbines."),
      pre: t("Шамол турбинасининг генератори қаерда жойлашган деб ўйлайсиз?", "Где, по-вашему, находится генератор ветряка?", "Where do you think a wind turbine’s generator sits?"),
      k: [
        t("Қисмлар: ротор парраклари, гондола (редуктор ва генератор), минора ва пойдевор.", "Части: лопасти ротора, гондола (редуктор и генератор), башня и фундамент.", "Parts: rotor blades, nacelle (gearbox and generator), tower and foundation."),
        t("Кўп турбиналар «шамол фермаси»га бирлаштирилиб, электр тармоғига уланади.", "Много турбин объединяют в ветропарк и подключают к сети.", "Many turbines are grouped into a wind farm connected to the grid."),
        t("Денгиздаги турбиналар кучли ва барқарор шамолдан фойдаланади, лекин қуриш қимматроқ.", "Морские турбины используют сильный и ровный ветер, но строить их дороже.", "Offshore turbines use strong, steady winds but cost more to build.")
      ],
      q: [
        q(t("Генератор турбинанинг қайси қисмида?", "В какой части турбины генератор?", "Where is the generator?"),
          [t("Гондолада", "В гондоле", "In the nacelle"), t("Пойдеворда", "В фундаменте", "In the foundation"), t("Парракнинг учида", "На кончике лопасти", "At the blade tip")], 0,
          t("Гондола минора тепасидаги «қути».", "Гондола — «коробка» на вершине башни.", "The nacelle is the box on top of the tower.")),
        q(t("Offshore турбина қаерда ўрнатилади?", "Где стоят офшорные турбины?", "Where are offshore turbines?"),
          [t("Денгизда", "В море", "At sea"), t("Тоғ ғорида", "В горной пещере", "In a mountain cave"), t("Ер остида", "Под землёй", "Underground")], 0,
          t("Денгизда шамол тўсиқсиз эсади.", "В море ветру ничто не мешает.", "At sea nothing blocks the wind."))
      ],
      task: t("Ўзбекистон харитасида шамол кучли ҳудудларни (Навоий, Қорақалпоғистон) топиб, нега станциялар ўша ерда қурилаётганини ёзинг.", "Найдите на карте Узбекистана ветреные районы (Навои, Каракалпакстан) и объясните, почему станции строят там.", "Find Uzbekistan’s windy regions (Navoi, Karakalpakstan) on a map and explain why plants are built there.") },

    { id: "v-shamol-ru", yt: "Hk-tHUMb6XM", top: "energ", st: "m", lng: "ru", ch: "Городской методический центр", orig: "Ветер как источник энергии", ck: "2026-10-17",
      t: t("Шамол — энергия манбаи", "Ветер как источник энергии", "Wind as a source of energy"),
      sum: t("Мактаб ўқувчилари учун: шамол қандай пайдо бўлади, шамол тегирмонларидан замонавий турбиналаргача.", "Для школьников: откуда берётся ветер, от ветряных мельниц до современных турбин.", "For school students: where wind comes from, from windmills to modern turbines."),
      pre: t("Шамол қаердан пайдо бўлади?", "Откуда берётся ветер?", "Where does wind come from?"),
      k: [
        t("Шамол Қуёш Ер юзасини нотекис иситганидан пайдо бўлади: иссиқ ҳаво кўтарилади, совуғи унинг ўрнига оқади.", "Ветер возникает из-за неравномерного нагрева Земли Солнцем: тёплый воздух поднимается, холодный занимает его место.", "Wind forms because the Sun heats Earth unevenly: warm air rises and cooler air rushes in."),
        t("Шамол тегирмонлари асрлар давомида дон тортиш ва сув чиқариш учун ишлатилган.", "Ветряные мельницы веками мололи зерно и качали воду.", "For centuries windmills ground grain and pumped water."),
        t("Замонавий турбина парраклари генераторни айлантириб, ҳаракат энергиясини электрга айлантиради.", "Лопасти современной турбины вращают генератор, превращая движение в электричество.", "Modern turbine blades spin a generator, turning motion into electricity.")
      ],
      q: [
        q(t("Шамол нима сабабдан пайдо бўлади?", "Почему возникает ветер?", "What causes wind?"),
          [t("Қуёш Ерни нотекис иситади", "Солнце неравномерно греет Землю", "The Sun heats Earth unevenly"), t("Дарахтлар тебранади", "Деревья качаются", "Trees sway"), t("Ой тортади", "Луна притягивает", "The Moon pulls")], 0,
          t("Дарахт тебраниши — шамолнинг натижаси, сабаби эмас.", "Качание деревьев — следствие ветра, а не причина.", "Swaying trees are an effect, not a cause.")),
        q(t("Турбинада энергия қандай айланади?", "Какое превращение энергии в турбине?", "What energy change happens in a turbine?"),
          [t("Ҳаракат → электр", "Движение → электричество", "Motion → electricity"), t("Электр → иссиқлик", "Электричество → тепло", "Electricity → heat"), t("Ёруғлик → товуш", "Свет → звук", "Light → sound")], 0,
          t("Генератор механик энергияни электрга айлантиради.", "Генератор превращает механическую энергию в электрическую.", "The generator turns mechanical energy into electricity."))
      ],
      task: t("Қоғоздан шамол парраги ясанг ва вентилятор тезлигини ўзгартириб, айланиш қандай ўзгаришини кузатинг.", "Сделайте бумажную вертушку и посмотрите, как меняется вращение при разной скорости вентилятора.", "Make a paper pinwheel and see how it spins at different fan speeds.") },

    { id: "v-quyosh-ru", yt: "cm-6ht5dnlQ", top: "energ", st: "", lng: "ru", ch: "Источники Альтернативной Энергии", orig: "Что такое солнечная энергия Солнце как самый широко используемый источник возобновляемой энергии", ck: "2026-10-17",
      t: t("Қуёш энергияси нима", "Что такое солнечная энергия", "What is solar energy?"),
      sum: t("Қуёш энергиясидан фойдаланишнинг икки йўли — фотоэлектрик панеллар ва иссиқлик коллекторлари, уларнинг афзаллик ва камчиликлари.", "Два способа использовать солнце — фотоэлектрические панели и тепловые коллекторы, их плюсы и минусы.", "Two ways to use the Sun — photovoltaic panels and solar thermal collectors — and their pros and cons."),
      pre: t("Қуёш панели ва томдаги қуёш сув иситгичи бир хил ишлайдими?", "Солнечная панель и солнечный водонагреватель работают одинаково?", "Do a solar panel and a rooftop solar water heater work the same way?"),
      k: [
        t("Ерга бир соатда тушадиган қуёш энергияси инсониятнинг бир йиллик энергия истеъмолига яқин.", "Солнечной энергии, падающей на Землю за час, почти хватило бы человечеству на год.", "The solar energy hitting Earth in one hour is close to humanity’s yearly energy use."),
        t("Фотоэлектрик (PV) панеллар электр беради, қуёш коллекторлари эса сувни иситади.", "Фотоэлектрические панели дают электричество, а коллекторы греют воду.", "PV panels make electricity; solar collectors heat water."),
        t("Камчилиги — тун ва булутли кунлар: энергияни аккумуляторда сақлаш ёки тармоқ керак.", "Минус — ночь и облака: нужны аккумуляторы или сеть.", "The catch is night and clouds: you need batteries or the grid.")
      ],
      q: [
        q(t("Қуёш иссиқлик коллектори нима беради?", "Что даёт солнечный тепловой коллектор?", "What does a solar thermal collector provide?"),
          [t("Иссиқ сув", "Горячую воду", "Hot water"), t("Фақат электр", "Только электричество", "Electricity only"), t("Шамол", "Ветер", "Wind")], 0,
          t("Электрни PV панел беради.", "Электричество даёт PV-панель.", "PV panels make the electricity.")),
        q(t("Қуёш энергиясининг асосий камчилиги?", "Главный минус солнечной энергии?", "The main drawback of solar power?"),
          [t("Тунда ишламайди — сақлаш керак", "Ночью не работает — нужно хранение", "No sun at night — storage needed"), t("Тугаб қолади", "Она закончится", "It will run out"), t("Заҳарли тутун чиқаради", "Даёт ядовитый дым", "It makes toxic smoke")], 0,
          t("Шунинг учун аккумуляторлар тез ривожланмоқда.", "Поэтому быстро развиваются аккумуляторы.", "That’s why batteries are advancing fast."))
      ],
      task: t("Қора ва оқ идишга бир хил сув солиб қуёшга қўйинг; 1 соатдан кейин ҳароратни ўлчаб солиштиринг.", "Налейте одинаково воды в чёрную и белую ёмкости, поставьте на солнце и через час сравните температуру.", "Put equal water in a black and a white container in the sun; compare temperatures after an hour.") },

    { id: "v-vie-ru", yt: "xr-DOwvin7I", top: "energ", st: "u", lng: "ru", ch: "TUK Новости", orig: "Плюсы и минусы возобновляемой энергии", ck: "2026-10-17",
      t: t("Қайта тикланувчи энергия: афзаллик ва камчиликлар", "Плюсы и минусы возобновляемой энергии", "Renewable energy: pros and cons"),
      sum: t("Қуёш ва шамол энергиясининг иқтисодий ва экологик фойдаси ҳамда муаммолари: ўзгарувчанлик, ер майдони, хом ашё.", "Экономические и экологические плюсы солнца и ветра и их проблемы: непостоянство, площадь, сырьё.", "The economic and environmental gains of solar and wind and their problems: variability, land and raw materials."),
      pre: t("Қайта тикланувчи энергиянинг ҳам экологияга зарари бўлиши мумкинми?", "Может ли возобновляемая энергия тоже вредить природе?", "Can renewable energy harm nature too?"),
      k: [
        t("Афзаллик: ишлаганда CO₂ чиқармайди, ёқилғи бепул; IRENA маълумотига кўра, қуёш электри 2010–2020 йилларда тахминан 85 фоиз арзонлашди.", "Плюсы: нет выбросов CO₂ при работе, бесплатное «топливо»; по данным IRENA, солнечная электроэнергия в 2010–2020 подешевела примерно на 85 %.", "Pros: no CO₂ in operation, free fuel; per IRENA, solar power got about 85% cheaper in 2010–2020."),
        t("Камчилик: ишлаб чиқариш ўзгарувчан (тун, шамолсиз кун), шунинг учун сақлаш ва мослашувчан тармоқ керак.", "Минусы: выработка непостоянна (ночь, штиль), нужны накопители и гибкая сеть.", "Cons: output varies (night, calm days), so storage and a flexible grid are needed."),
        t("Панел, турбина ва аккумулятор учун литий, мис каби хом ашё қазилади — қайта ишлаш муҳим.", "Для панелей, турбин и батарей добывают литий, медь и др. — важна переработка.", "Panels, turbines and batteries need mined lithium, copper and more — recycling matters.")
      ],
      q: [
        q(t("Қуёш ва шамолнинг асосий техник муаммоси?", "Главная техническая проблема солнца и ветра?", "The main technical issue with solar and wind?"),
          [t("Ўзгарувчанлик (интермиттентлик)", "Непостоянство выработки", "Variability (intermittency)"), t("Радиация", "Радиация", "Radiation"), t("Тутун", "Дым", "Smoke")], 0,
          t("Қуёш тунда, шамол эса тинч кунда ишламайди.", "Солнце не светит ночью, ветер стихает.", "No sun at night, no wind on calm days.")),
        q(t("Энергияни сақлаш учун нима ишлатилади?", "Что используют для хранения энергии?", "What is used to store energy?"),
          [t("Аккумуляторлар ва гидроаккумуляция станциялари", "Аккумуляторы и ГАЭС", "Batteries and pumped hydro"), t("Кўмир", "Уголь", "Coal"), t("Пахта", "Хлопок", "Cotton")], 0,
          t("ГАЭС сувни юқорига чиқариб, кейин туширади.", "ГАЭС закачивает воду наверх и затем сбрасывает её.", "Pumped hydro lifts water and later releases it."))
      ],
      task: t("«Мактаб томига қуёш панели» мавзусида дебат ўтказинг: 3 афзаллик ва 3 камчиликни ёзиб, хулоса чиқаринг.", "Проведите дебаты «Солнечные панели на крыше школы»: 3 плюса, 3 минуса и вывод.", "Hold a debate on “solar panels on the school roof”: 3 pros, 3 cons and a verdict.") }
  ];

  window.EKO_VIDEOS = { topics: TOPICS, list: V, checked: "2026-10-16" };
})();
