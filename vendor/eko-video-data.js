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
      task: t("Уйингиз томи учун қуёш панели ҳисоби: 1 кВт панел кунига ~5 кВт·соат беради. Ойлик электр ҳисобингизнинг қанчасини қоплайди?", "Посчитайте: 1 кВт панелей даёт ~5 кВт·ч в день. Какую часть вашего счёта за свет покроет?", "Estimate: 1 kW of panels gives ~5 kWh a day. How much of your electricity bill would it cover?") }
  ];

  window.EKO_VIDEOS = { topics: TOPICS, list: V, checked: "2026-10-16" };
})();
