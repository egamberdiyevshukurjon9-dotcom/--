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
    { id: "tahlil", ic: "fa-microscope", c: "#6d28d9", t: t("Тупроқ, сув ва ҳаво таҳлили", "Анализ почвы, воды и воздуха", "Soil, water and air analysis") },
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
      task: t("«Мактаб томига қуёш панели» мавзусида дебат ўтказинг: 3 афзаллик ва 3 камчиликни ёзиб, хулоса чиқаринг.", "Проведите дебаты «Солнечные панели на крыше школы»: 3 плюса, 3 минуса и вывод.", "Hold a debate on “solar panels on the school roof”: 3 pros, 3 cons and a verdict.") },

    /* ---------- Ekomun 3.2: 40 та янги видео (26 таси ўзбекча), 2026-10-17 да oEmbed орқали текширилди ---------- */
/* ---------- Янги видеолар (2026-10-17): ўзбек тилида ---------- */
    { id: "v-organizm-uz", yt: "it6OQ1MkY-4", top: "asos", st: "m", lng: "uz", ch: "BIOLOG UZ", orig: "ORGANIZM VA TASHQI MUHIT HAQIDA | ОРГАНИЗМ ВА ТАШҚИ МУҲИТ ҲАҚИДА.", ck: "2026-10-17",
      t: t("Организм ва ташқи муҳит", "Организм и внешняя среда", "The organism and its environment"),
      sum: t("Ҳар бир организм атроф-муҳит омиллари таъсирида яшайди: абиотик, биотик ва антропоген. Ҳар бир омил учун организмнинг чидамлилик чегараси бор.", "Каждый организм живёт под действием факторов среды: абиотических, биотических и антропогенных. Для каждого фактора у организма есть пределы выносливости.", "Every organism lives under the influence of environmental factors: abiotic, biotic and human-made. For each factor an organism has limits of tolerance."),
      pre: t("Нега кактус чўлда яшай олади-ю, ботқоқда ўлиб қолади?", "Почему кактус живёт в пустыне, но гибнет на болоте?", "Why can a cactus live in a desert but die in a swamp?"),
      k: [
        t("Экологик омиллар уч гуруҳга бўлинади: абиотик (ҳарорат, намлик, ёруғлик), биотик (бошқа организмлар) ва антропоген (инсон фаолияти).", "Экологические факторы делят на три группы: абиотические (температура, влажность, свет), биотические (другие организмы) и антропогенные (деятельность человека).", "Ecological factors fall into three groups: abiotic (temperature, moisture, light), biotic (other organisms) and anthropogenic (human activity)."),
        t("Организм ҳар бир омилнинг маълум оралиғида (чидамлилик чегарасида) яшай олади; энг қулай нуқта — оптимум.", "Организм может жить лишь в определённом диапазоне каждого фактора (пределы выносливости); самая благоприятная точка — оптимум.", "An organism can live only within a certain range of each factor (its tolerance limits); the most favourable point is the optimum."),
        t("Энг етишмайдиган омил ўсишни чеклайди (Либих минимум қонуни) — масалан, чўлда сув.", "Рост ограничивает фактор, находящийся в наибольшем недостатке (закон минимума Либиха), — например, вода в пустыне.", "Growth is limited by the scarcest factor (Liebig’s law of the minimum) — for example, water in a desert.")
      ],
      q: [
        q(t("Қайси бири антропоген омил?", "Какой фактор антропогенный?", "Which factor is anthropogenic?"),
          [t("Ёмғир", "Дождь", "Rain"), t("Заводдан чиқадиган тутун", "Дым завода", "Smoke from a factory"), t("Тулки овлаши", "Охота лисы", "A fox hunting")], 1,
          t("Антропоген омил — инсон фаолияти натижаси.", "Антропогенный фактор — результат деятельности человека.", "An anthropogenic factor results from human activity.")),
        q(t("Либих минимум қонунига кўра ўсишни нима чеклайди?", "Что ограничивает рост по закону минимума Либиха?", "Under Liebig’s law, what limits growth?"),
          [t("Энг кўп бўлган омил", "Фактор, которого больше всего", "The most abundant factor"), t("Энг етишмайдиган омил", "Фактор в наибольшем недостатке", "The scarcest factor"), t("Фақат ҳарорат", "Только температура", "Only temperature")], 1,
          t("Бочканинг энг калта тахтаси сингари, энг етишмайдиган омил чегара қўяди.", "Как самая короткая доска бочки, недостающий фактор задаёт предел.", "Like the shortest stave of a barrel, the scarcest factor sets the limit."))
      ],
      task: t("Уй ўсимлигини танланг ва унинг учун 3 та абиотик омилни (ёруғлик, сув, ҳарорат) кузатиб, қайси бири чекловчи эканини ёзинг.", "Выберите комнатное растение, понаблюдайте 3 абиотических фактора (свет, вода, температура) и напишите, какой из них ограничивающий.", "Pick a house plant, observe 3 abiotic factors (light, water, temperature) and write which one is limiting.") },

    { id: "v-orol-kema-uz", yt: "ShMweQybvoY", top: "orol", st: "m", lng: "uz", ch: "JC CameraMan", orig: "Orol dengizi fojiasi, kemalar qabristoni", ck: "2026-10-17",
      t: t("Орол фожиаси: кемалар қабристони", "Трагедия Арала: кладбище кораблей", "The Aral tragedy: a ship graveyard"),
      sum: t("Бир вақтлар порт бўлган Мўйноқда энди қумда занглаган кемалар турибди. Улар Орол денгизи қанчалик тез чекинганининг жонли гувоҳи.", "В Муйнаке, бывшем порту, теперь на песке стоят ржавые корабли — живые свидетели того, как быстро отступило Аральское море.", "In Muynak, once a port, rusting ships now stand on sand — living witnesses of how fast the Aral Sea retreated."),
      pre: t("Нега кемалар сувсиз, қум устида қолиб кетган бўлиши мумкин? Тахминингизни ёзинг.", "Почему корабли могли остаться на песке без воды? Запишите догадку.", "Why might ships be left stranded on sand with no water? Write down your guess."),
      k: [
        t("Мўйноқ шаҳри 1960-йилларгача балиқчилик порти эди; ҳозир денгиз соҳили ундан 100 км дан ҳам узоқда.", "Муйнак до 1960-х был рыболовецким портом; сейчас берег моря более чем в 100 км от него.", "Muynak was a fishing port until the 1960s; today the shoreline is more than 100 km away."),
        t("Денгиз асосан Амударё ва Сирдарё сувининг пахта суғоришига олиниши туфайли қуриди.", "Море высохло главным образом из-за забора воды Амударьи и Сырдарьи на орошение хлопка.", "The sea dried up mainly because Amu Darya and Syr Darya water was taken to irrigate cotton."),
        t("Кемалар қабристони бугун эслатма ва туризм объекти: у сувни оқилона ишлатиш зарурлигини кўрсатади.", "Кладбище кораблей сегодня — памятник и туристический объект, напоминающий о бережном отношении к воде.", "The ship graveyard is now a memorial and tourist site reminding us to use water wisely.")
      ],
      q: [
        q(t("Мўйноқ олдин қандай шаҳар эди?", "Каким городом был раньше Муйнак?", "What kind of town was Muynak before?"),
          [t("Балиқчилик порти", "Рыболовецкий порт", "A fishing port"), t("Тоғ курорти", "Горный курорт", "A mountain resort"), t("Нефть шаҳри", "Нефтяной город", "An oil town")], 0,
          t("Мўйноқда балиқ консерва заводи ва флот бўлган.", "В Муйнаке были рыбоконсервный завод и флот.", "Muynak had a fish cannery and a fishing fleet.")),
        q(t("Орол қуришининг асосий сабаби нима?", "Главная причина высыхания Арала?", "What is the main cause of the Aral drying up?"),
          [t("Дарё сувининг суғоришга олиниши", "Забор речной воды на орошение", "River water taken for irrigation"), t("Зилзила", "Землетрясение", "An earthquake"), t("Денгизга метеорит тушиши", "Падение метеорита", "A meteorite impact")], 0,
          t("Амударё ва Сирдарё суви далаларга бурилгач, денгизга оз сув етиб борди.", "Когда воду рек отвели на поля, до моря стало доходить мало воды.", "Once river water was diverted to fields, little reached the sea."))
      ],
      task: t("Орол харитасини 1960 ва бугунги ҳолатда чизинг ва Мўйноқни белгиланг.", "Нарисуйте карту Арала в 1960 году и сегодня и отметьте Муйнак.", "Draw the Aral Sea in 1960 and today and mark Muynak.") },

    { id: "v-orol-undp-uz", yt: "l3b5OxXkpDA", top: "orol", st: "u", lng: "uz", ch: "UNDP Uzbekistan", orig: "Akiko Fujii Orol dengizi fojiasi va uning atrof-muhit, iqtisodiyot va aholi hayotiga ta’siri haqida", ck: "2026-10-17",
      t: t("БМТТД: Орол фожиасининг табиат, иқтисод ва аҳолига таъсири", "ПРООН: влияние трагедии Арала на природу, экономику и людей", "UNDP: how the Aral disaster affects nature, the economy and people"),
      sum: t("БМТ Тараққиёт дастури вакили Орол фожиаси уч томонлама — экологик, иқтисодий ва ижтимоий муаммо эканини тушунтиради.", "Представитель ПРООН объясняет, что трагедия Арала — проблема сразу экологическая, экономическая и социальная.", "A UNDP representative explains that the Aral disaster is at once an environmental, economic and social problem."),
      pre: t("Денгизнинг қуриши одамларнинг соғлиғи ва иш жойларига қандай таъсир қилиши мумкин?", "Как высыхание моря может повлиять на здоровье и работу людей?", "How might a drying sea affect people’s health and jobs?"),
      k: [
        t("Экологик таъсир: туз ва чанг бўронлари, тупроқ шўрланиши, тўқай ва дельта экотизимларининг йўқолиши.", "Экологические последствия: солевые и пыльные бури, засоление почв, гибель тугаев и дельтовых экосистем.", "Environmental impact: salt and dust storms, soil salinisation, loss of tugai and delta ecosystems."),
        t("Иқтисодий таъсир: балиқчилик ва у билан боғлиқ саноат йўқолди, ишсизлик ва миграция кучайди.", "Экономические последствия: исчезли рыболовство и связанная промышленность, выросли безработица и миграция.", "Economic impact: fishing and related industry vanished, unemployment and migration rose."),
        t("Ижтимоий таъсир: ичимлик суви сифати ва аҳоли соғлиғи ёмонлашди; БМТ ва ҳукумат ҳудудни тиклаш дастурларини олиб бормоқда.", "Социальные последствия: ухудшились качество питьевой воды и здоровье людей; ООН и правительство ведут программы восстановления региона.", "Social impact: drinking-water quality and public health declined; the UN and government run programmes to restore the region.")
      ],
      q: [
        q(t("Қайси бири Орол фожиасининг иқтисодий оқибати?", "Что является экономическим последствием?", "Which is an economic consequence?"),
          [t("Балиқчиликнинг йўқолиши", "Исчезновение рыболовства", "The loss of fishing"), t("Туз бўронлари", "Солевые бури", "Salt storms"), t("Ҳаво ҳароратининг ўзгариши", "Изменение температуры", "A change in temperature")], 0,
          t("Балиқчилик ҳудуднинг асосий даромад манбаи эди.", "Рыболовство было главным источником дохода региона.", "Fishing was the region’s main source of income.")),
        q(t("Нега Орол муаммоси «уч томонлама» дейилади?", "Почему проблему Арала называют «тройной»?", "Why is the Aral problem called “three-sided”?"),
          [t("У экология, иқтисод ва ижтимоий соҳага тегади", "Она затрагивает экологию, экономику и общество", "It touches ecology, the economy and society"), t("Учта давлатда бор", "Она есть в трёх странах", "It exists in three countries"), t("Уч йилда бошланган", "Началась за три года", "It began in three years")], 0,
          t("Барқарор ривожланиш ҳам худди шу уч устунга таянади.", "Устойчивое развитие опирается на те же три опоры.", "Sustainable development rests on the same three pillars."))
      ],
      task: t("Орол бўйи аҳолиси учун 3 та ёрдам лойиҳасини (экологик, иқтисодий, ижтимоий) таклиф қилинг.", "Предложите 3 проекта помощи жителям Приаралья: экологический, экономический и социальный.", "Propose 3 projects to help people of the Aral region: environmental, economic and social.") },

    { id: "v-orol-sabab-uz", yt: "fIMwKCrDZc8", top: "orol", st: "m", lng: "uz", ch: "GEO OLAM", orig: "OROL DENGIZI QURISH SABABLARI VA OQIBATI", ck: "2026-10-17",
      t: t("Орол денгизи қуришининг сабаблари ва оқибатлари", "Причины и последствия высыхания Арала", "Why the Aral Sea dried up and what followed"),
      sum: t("География нуқтаи назаридан Орол қуришининг сабаблари (дарё сувининг суғоришга олиниши) ва оқибатлари (Оролқум чўли, шўрланиш, иқлим ўзгариши) кўриб чиқилади.", "С точки зрения географии разбираются причины (забор речной воды на орошение) и последствия (пустыня Аралкум, засоление, изменение климата) высыхания Арала.", "From a geography viewpoint: the causes (river water taken for irrigation) and consequences (the Aralkum desert, salinisation, local climate change) of the Aral’s drying."),
      pre: t("Сабаб ва оқибатни ажратинг: «пахта майдонлари кенгайди» ва «чанг бўронлари кўпайди» — қайси бири сабаб?", "Различите причину и следствие: «расширились хлопковые поля» и «участились пыльные бури» — что из них причина?", "Separate cause and effect: “cotton fields expanded” and “dust storms increased” — which is the cause?"),
      k: [
        t("Орол 1960 йилда дунёдаги тўртинчи энг катта кўл эди (≈68 минг км²).", "В 1960 году Арал был четвёртым по площади озером мира (≈68 тыс. км²).", "In 1960 the Aral was the world’s fourth-largest lake (≈68,000 km²)."),
        t("Амударё ва Сирдарё суви каналлар орқали суғоришга олингач, денгиз сувининг катта қисми йўқолди ва шўрлиги кескин ошди.", "Когда воду Амударьи и Сырдарьи отвели каналами на орошение, море потеряло бо́льшую часть воды, а солёность резко выросла.", "When Amu Darya and Syr Darya water was channelled to irrigation, the sea lost most of its water and its salinity soared."),
        t("Қуриган тубда Оролқум чўли пайдо бўлди; ундан кўтариладиган туз ва чанг минглаб километрга тарқалади.", "На осушенном дне возникла пустыня Аралкум; соль и пыль с неё разносятся на тысячи километров.", "The exposed bed became the Aralkum desert; salt and dust from it spread for thousands of kilometres.")
      ],
      q: [
        q(t("1960 йилда Орол дунёдаги нечанчи энг катта кўл эди?", "Каким по площади озером мира был Арал в 1960 году?", "How did the Aral rank among the world’s lakes in 1960?"),
          [t("Тўртинчи", "Четвёртым", "Fourth"), t("Биринчи", "Первым", "First"), t("Йигирманчи", "Двадцатым", "Twentieth")], 0,
          t("Каспий, Юқори кўл ва Виктория кўлидан кейин.", "После Каспия, Верхнего озера и Виктории.", "After the Caspian, Lake Superior and Lake Victoria.")),
        q(t("Оролқум нима?", "Что такое Аралкум?", "What is the Aralkum?"),
          [t("Денгизнинг қуриган тубида пайдо бўлган чўл", "Пустыня на осушенном дне моря", "A desert on the dried sea bed"), t("Янги сув омбори", "Новое водохранилище", "A new reservoir"), t("Тоғ тизмаси", "Горный хребет", "A mountain range")], 0,
          t("Оролқум — дунёдаги энг ёш чўллардан бири.", "Аралкум — одна из самых молодых пустынь мира.", "The Aralkum is one of the youngest deserts on Earth."))
      ],
      task: t("«Сабаб → оқибат» занжирини тузинг: суғориш → … → чанг бўронлари → … (камида 5 бўғин).", "Составьте цепочку «причина → следствие»: орошение → … → пыльные бури → … (не меньше 5 звеньев).", "Build a cause → effect chain: irrigation → … → dust storms → … (at least 5 links).") },

    { id: "v-moynoq-uz", yt: "dy1Fs0fUjQE", top: "orol", st: "m", lng: "uz", ch: "Davronbek Tojialiyev", orig: "Moʻynoq, Orol dengizi tubiga sayohat | Мўйноқ, Орол денгизи тубига саёҳат", ck: "2026-10-17",
      t: t("Мўйноқ: Орол денгизи тубига саёҳат", "Муйнак: путешествие по дну Аральского моря", "Muynak: a trip across the Aral Sea bed"),
      sum: t("Саёҳатчи Мўйноқдан денгизнинг собиқ тубига йўл олади: бир вақтлар сув бўлган жой энди қум, туз ва чўл ўсимликлари билан қопланган.", "Путешественник едет из Муйнака по бывшему дну моря: там, где была вода, теперь песок, соль и пустынные растения.", "A traveller heads out from Muynak across the former sea bed: where there was water there is now sand, salt and desert plants."),
      pre: t("Денгиз туби қуригач, у ерда биринчи бўлиб қандай ўсимликлар пайдо бўлиши мумкин?", "Какие растения могут первыми появиться на высохшем дне моря?", "Which plants might appear first on a dried-out sea bed?"),
      k: [
        t("Собиқ денгиз тубида шўрга чидамли ўсимликлар — саксовул, шўра, юлғун — ўсади.", "На бывшем дне растут солеустойчивые растения — саксаул, солянки, тамариск.", "Salt-tolerant plants — saxaul, saltworts, tamarisk — grow on the former sea bed."),
        t("Қуруқ, шўр юза шамолда чанг ва туз кўтаради — бу аҳоли ва экинлар учун хавфли.", "Сухая солёная поверхность поднимает на ветру пыль и соль — это опасно для людей и посевов.", "The dry, salty surface lifts dust and salt in the wind — a hazard for people and crops."),
        t("Мўйноқ бугун эко-туризм ва «Stihia» каби тадбирлар орқали ҳудудга эътибор қаратмоқда.", "Сегодня Муйнак привлекает внимание к региону через экотуризм и события вроде фестиваля «Stihia».", "Today Muynak draws attention to the region through eco-tourism and events such as the Stihia festival.")
      ],
      q: [
        q(t("Қайси ўсимлик шўр қумда яхши ўсади?", "Какое растение хорошо растёт на солёном песке?", "Which plant grows well on salty sand?"),
          [t("Саксовул", "Саксаул", "Saxaul"), t("Шолғом", "Репа", "Turnip"), t("Гилос", "Черешня", "Cherry")], 0,
          t("Саксовулнинг илдизлари чуқур ва у шўрга чидамли.", "У саксаула глубокие корни и он солеустойчив.", "Saxaul has deep roots and tolerates salt.")),
        q(t("Қуриган денгиз тубининг асосий хавфи нима?", "Главная опасность высохшего дна?", "What is the main hazard of a dried sea bed?"),
          [t("Туз ва чанг бўронлари", "Солевые и пыльные бури", "Salt and dust storms"), t("Сув тошқини", "Наводнение", "Flooding"), t("Вулқон", "Вулкан", "A volcano")], 0,
          t("Шамол тузни узоқ масофаларга олиб кетади.", "Ветер уносит соль на большие расстояния.", "Wind carries the salt over long distances."))
      ],
      task: t("Видеода кўрган 3 та манзарани тасвирланг ва ҳар бирини Орол фожиасининг қайси оқибатига боғланг.", "Опишите 3 увиденных в видео пейзажа и свяжите каждый с последствием трагедии Арала.", "Describe 3 scenes from the video and link each to a consequence of the Aral disaster.") },

    { id: "v-orol-yolchi-uz", yt: "aLlIAjDumwY", top: "orol", st: "", lng: "uz", ch: "Yo'lchi TV", orig: "Orol dengizi", ck: "2026-10-17",
      t: t("Орол денгизи бугун", "Аральское море сегодня", "The Aral Sea today"),
      sum: t("Йўл-видео бугунги Орол денгизи ва унинг атрофини кўрсатади. Кўриш давомида денгизнинг катталиги, сув ва соҳил ҳолатига эътибор беринг.", "Видео-путешествие показывает сегодняшнее Аральское море и его окрестности. Обратите внимание на размеры моря, воду и берега.", "A travel video shows the Aral Sea and its surroundings today. Pay attention to the size of the sea, the water and the shores."),
      pre: t("Сизнингча, Оролнинг ҳали ҳам сув бор қисмлари қаерда?", "Как вы думаете, где у Арала ещё осталась вода?", "Where do you think the Aral still has water?"),
      k: [
        t("1980-йиллар охирида Орол Шимолий (Кичик) ва Жанубий (Катта) Оролга бўлиниб кетди.", "В конце 1980-х Арал разделился на Северный (Малый) и Южный (Большой).", "In the late 1980s the Aral split into the North (Small) and South (Large) Aral."),
        t("Қозоғистондаги Кўкарал тўғони (2005) туфайли Кичик Оролда сув сатҳи кўтарилиб, балиқчилик қисман тикланди.", "Благодаря Кокаральской плотине (2005) в Казахстане уровень Малого Арала поднялся и рыболовство частично восстановилось.", "Thanks to the Kokaral Dam (2005) in Kazakhstan, the Small Aral’s level rose and fishing partly recovered."),
        t("Жанубий Оролнинг шарқий қисми деярли қуриган, ғарбий қисмида эса жуда шўр сув сақланиб қолган.", "Восточная часть Южного Арала почти высохла, а в западной сохранилась очень солёная вода.", "The eastern South Aral has almost dried out, while the western part keeps very salty water.")
      ],
      q: [
        q(t("Кичик Оролни қутқаришга нима ёрдам берди?", "Что помогло спасти Малый Арал?", "What helped save the Small Aral?"),
          [t("Кўкарал тўғони", "Кокаральская плотина", "The Kokaral Dam"), t("Янги канал қазиш", "Новый оросительный канал", "A new irrigation canal"), t("Кўпроқ пахта экиш", "Больше хлопка", "Planting more cotton")], 0,
          t("Тўғон Сирдарё сувини Кичик Оролда ушлаб қолди.", "Плотина удержала воду Сырдарьи в Малом Арале.", "The dam held Syr Darya water in the Small Aral.")),
        q(t("Орол қачон иккига бўлинди?", "Когда Арал разделился надвое?", "When did the Aral split in two?"),
          [t("1980-йиллар охирида", "В конце 1980-х", "In the late 1980s"), t("1900 йилда", "В 1900 году", "In 1900"), t("2020 йилда", "В 2020 году", "In 2020")], 0,
          t("Сув сатҳи пасайгач, денгиз туби орол бўлиб чиқди.", "Когда уровень упал, дно разделило море на части.", "As the level dropped, the sea bed split it into parts."))
      ],
      task: t("Харитада Шимолий ва Жанубий Оролни, Сирдарё ва Амударёни белгиланг ва Кўкарал тўғонини кўрсатинг.", "Отметьте на карте Северный и Южный Арал, Сырдарью, Амударью и Кокаральскую плотину.", "On a map, mark the North and South Aral, the Syr Darya, the Amu Darya and the Kokaral Dam.") },

    { id: "v-orol-ormon-uz", yt: "Xl7IJq2rozs", top: "yer", st: "", lng: "uz", ch: "BBC News Uzbek", orig: "Ўзбекистон Орол тубини ўрмонга айлантирмоқда", ck: "2026-10-17",
      t: t("Орол тубида ўрмон барпо қилиш", "Лес на дне Арала", "Growing a forest on the Aral sea bed"),
      sum: t("Ўзбекистон қуриган Орол тубида саксовул ва бошқа чўл ўсимликлари экиб, туз-чанг бўронларини камайтириш ва қумни мустаҳкамлашга ҳаракат қилмоқда.", "Узбекистан сажает саксаул и другие пустынные растения на высохшем дне Арала, чтобы закрепить пески и ослабить солевые бури.", "Uzbekistan is planting saxaul and other desert plants on the dried Aral bed to fix the sand and reduce salt-dust storms."),
      pre: t("Нега чўлда айнан саксовул экилади, терак эмас?", "Почему в пустыне сажают именно саксаул, а не тополь?", "Why plant saxaul in the desert rather than poplar?"),
      k: [
        t("Саксовул қурғоқчилик ва шўрга чидамли, илдизлари қумни ушлаб туради.", "Саксаул устойчив к засухе и засолению, его корни удерживают песок.", "Saxaul tolerates drought and salt, and its roots hold the sand."),
        t("Ўсимлик қоплами шамол тезлигини пасайтиради ва туз-чанг кўтарилишини камайтиради.", "Растительный покров снижает скорость ветра и вынос соли и пыли.", "Plant cover lowers wind speed and reduces salt and dust uplift."),
        t("Экилган кўчатларнинг ҳаммаси ҳам кўкармайди: муваффақият уруғ сифати, экиш вақти ва парваришга боғлиқ.", "Приживаются не все посадки: успех зависит от качества семян, сроков и ухода.", "Not all plantings survive: success depends on seed quality, timing and care.")
      ],
      q: [
        q(t("Орол тубига кўпинча қайси ўсимлик экилади?", "Что чаще всего сажают на дне Арала?", "What is most often planted on the Aral bed?"),
          [t("Саксовул", "Саксаул", "Saxaul"), t("Шоли", "Рис", "Rice"), t("Олма", "Яблоня", "Apple trees")], 0,
          t("Саксовул — чўл шароитига мослашган бута-дарахт.", "Саксаул — кустарник-дерево, приспособленное к пустыне.", "Saxaul is a desert-adapted shrubby tree.")),
        q(t("Ўрмон полосалари бу ерда асосан нима учун керак?", "Зачем здесь в основном нужны лесополосы?", "What are the plantations mainly for?"),
          [t("Қум ва тузни ушлаб, бўронларни камайтириш", "Закрепить песок и соль, ослабить бури", "To fix sand and salt and reduce storms"), t("Ёғоч сотиш", "Продажа древесины", "To sell timber"), t("Денгизни тўлдириш", "Наполнить море", "To refill the sea")], 0,
          t("Ўсимликлар денгизни қайтармайди, лекин чангни камайтиради.", "Растения не вернут море, но уменьшат пыль.", "Plants will not bring the sea back, but they cut the dust."))
      ],
      task: t("Мактаб ҳовлиси учун «шамолдан ҳимоя полосаси» схемасини чизинг: қайси ўсимликларни, қаерга экардингиз?", "Нарисуйте схему ветрозащитной полосы для школы: какие растения и где бы вы посадили?", "Sketch a windbreak plan for your school: which plants would you plant, and where?") },

    { id: "v-iqlim-fantex-uz", yt: "Qi8E5Kto_4c", top: "iqlim", st: "", lng: "uz", ch: "FANTEX", orig: "Global Iqlim O'zgarishi: Insoniyat Omon Qoladimi?", ck: "2026-10-17",
      t: t("Глобал иқлим ўзгариши: инсоният омон қоладими?", "Глобальное изменение климата: выживет ли человечество?", "Global climate change: will humanity survive?"),
      sum: t("Илмий-оммабоп видео иқлим ўзгаришининг хавфлари ҳақида. Олимлар фикрича, иқлим ўзгариши жиддий хавф, лекин инсониятни «йўқ қилмайди» — оқибатлар биз ҳозир қиладиган танловга боғлиқ.", "Научно-популярное видео о рисках изменения климата. По оценкам учёных, это серьёзная угроза, но не «конец человечества» — последствия зависят от наших сегодняшних решений.", "A popular-science video on climate risks. Scientists see climate change as a serious threat but not the “end of humanity” — the outcome depends on choices we make now."),
      pre: t("Иқлим ўзгариши ҳақида эшитган энг қўрқинчли гапингиз нима? Видеодан кейин у қанчалик илмий эканини текширинг.", "Какое самое страшное утверждение о климате вы слышали? После видео проверьте, насколько оно научно.", "What is the scariest climate claim you have heard? After the video, check how scientific it is."),
      k: [
        t("IPCC маълумотига кўра, Ер саноатлашувдан олдинги даврга нисбатан тахминан 1,1 °C га исиган.", "По данным МГЭИК, Земля потеплела примерно на 1,1 °C по сравнению с доиндустриальной эпохой.", "According to the IPCC, Earth has warmed by about 1.1 °C since pre-industrial times."),
        t("Хавфлар: иссиқ тўлқинлар, қурғоқчилик, денгиз сатҳи кўтарилиши, ҳосилдорликнинг пасайиши.", "Риски: волны жары, засухи, подъём уровня моря, снижение урожаев.", "Risks: heatwaves, droughts, sea-level rise, falling crop yields."),
        t("Ҳар бир даража ўндан бир қисми муҳим: исишни 1,5 °C да тўхтатиш 2 °C га нисбатан зарарни сезиларли камайтиради.", "Важна каждая десятая градуса: остановить потепление на 1,5 °C гораздо лучше, чем на 2 °C.", "Every tenth of a degree matters: stopping at 1.5 °C avoids much more damage than 2 °C.")
      ],
      q: [
        q(t("Ер саноатлашувдан бери тахминан қанча исиди?", "Насколько потеплела Земля с доиндустриальной эпохи?", "How much has Earth warmed since pre-industrial times?"),
          [t("≈1,1 °C", "≈1,1 °C", "≈1.1 °C"), t("≈10 °C", "≈10 °C", "≈10 °C"), t("Умуман исимаган", "Не потеплела", "Not at all")], 0,
          t("Бу IPCC AR6 (2021) баҳоси.", "Это оценка МГЭИК AR6 (2021).", "This is the IPCC AR6 (2021) estimate.")),
        q(t("Нима учун 1,5 °C ва 2 °C ўртасидаги фарқ муҳим?", "Почему важна разница между 1,5 °C и 2 °C?", "Why does the gap between 1.5 °C and 2 °C matter?"),
          [t("Ҳар бир қўшимча исиш хавфларни оширади", "Каждое дополнительное потепление увеличивает риски", "Each extra bit of warming raises risks"), t("Фарқи йўқ", "Разницы нет", "There is no difference"), t("2 °C хавфсизроқ", "2 °C безопаснее", "2 °C is safer")], 0,
          t("Масалан, 2 °C да маржон рифларининг деярли барчаси йўқолиши мумкин.", "Например, при 2 °C могут погибнуть почти все коралловые рифы.", "For example, at 2 °C nearly all coral reefs could be lost."))
      ],
      task: t("Видеодаги битта даъвони танланг ва уни NASA ёки IPCC сайтидаги маълумот билан солиштиринг.", "Выберите одно утверждение из видео и сверьте его с данными NASA или МГЭИК.", "Pick one claim from the video and check it against NASA or IPCC data.") },

    { id: "v-iqlim-daryo-uz", yt: "Z8P-c2xeqFs", top: "iqlim", st: "", lng: "uz", ch: "Daryo", orig: "Iqlim oʻzgarishi: Oʻzbekistonda endi qor yogʻmasligi, qurgʻoqchilik avj olishi rostmi?", ck: "2026-10-17",
      t: t("Ўзбекистонда қор камаяди, қурғоқчилик кучаяди — ростми?", "В Узбекистане исчезнет снег и усилится засуха — правда ли?", "Will Uzbekistan lose its snow and face more drought — is it true?"),
      sum: t("Daryo репортажи Ўзбекистонда иқлим ўзгариши — қорнинг камайиши ва қурғоқчилик хавфи ҳақидаги саволларни муҳокама қилади.", "Репортаж Daryo обсуждает вопросы изменения климата в Узбекистане — сокращение снега и риск засух.", "A Daryo report discusses climate change in Uzbekistan — less snow and the risk of drought."),
      pre: t("Сиз эслаган қишлар билан ҳозирги қишлар орасида фарқ борми?", "Есть ли разница между зимами, которые помните вы, и нынешними?", "Do the winters you remember differ from today’s?"),
      k: [
        t("Марказий Осиё жаҳон ўртачасидан тезроқ исимоқда.", "Центральная Азия нагревается быстрее среднемирового.", "Central Asia is warming faster than the global average."),
        t("Амударё ва Сирдарё тоғлардаги қор ва музликлардан озиқланади; қор камайса, ёзда дарё суви ҳам камаяди.", "Амударья и Сырдарья питаются снегом и ледниками гор; меньше снега — меньше воды летом.", "The Amu Darya and Syr Darya are fed by mountain snow and glaciers; less snow means less summer river water."),
        t("Бир йиллик об-ҳаво (масалан, қорсиз қиш) иқлим эмас — иқлим 30 йиллик ўртача кўрсаткич.", "Погода одного года (например, бесснежная зима) — ещё не климат; климат — это среднее за 30 лет.", "One year’s weather (say, a snowless winter) is not climate — climate is the 30-year average.")
      ],
      q: [
        q(t("Ўзбекистон дарёлари асосан нимадан озиқланади?", "Чем в основном питаются реки Узбекистана?", "What mainly feeds Uzbekistan’s rivers?"),
          [t("Тоғ қорлари ва музликлардан", "Горными снегами и ледниками", "Mountain snow and glaciers"), t("Денгиз сувидан", "Морской водой", "Sea water"), t("Фақат ёмғирдан", "Только дождём", "Only rain")], 0,
          t("Шунинг учун тоғларда қор камайиши хавфли.", "Поэтому сокращение снега в горах опасно.", "That is why less mountain snow is dangerous.")),
        q(t("Иқлим ва об-ҳаво фарқи нимада?", "Чем климат отличается от погоды?", "How does climate differ from weather?"),
          [t("Иқлим — узоқ муддатли ўртача, об-ҳаво — ҳозирги ҳолат", "Климат — многолетнее среднее, погода — текущее состояние", "Climate is the long-term average; weather is the current state"), t("Улар бир хил", "Это одно и то же", "They are the same"), t("Об-ҳаво узоқроқ давом этади", "Погода длится дольше", "Weather lasts longer")], 0,
          t("ЖМТ (WMO) иқлимни 30 йиллик давр бўйича ҳисоблайди.", "ВМО считает климат по 30-летним периодам.", "The WMO defines climate over 30-year periods."))
      ],
      task: t("Оила аъзоларингиздан 20–30 йил олдинги қишлар ҳақида сўраб, 3 та фарқни ёзинг.", "Расспросите родных о зимах 20–30 лет назад и запишите 3 отличия.", "Ask relatives about winters 20–30 years ago and write down 3 differences.") },

    { id: "v-iqlim-voa-uz", yt: "lFPd4NgPswU", top: "iqlim", st: "", lng: "uz", ch: "Amerika Ovozi", orig: "Iqlim o'zgarishi qanchalar xavotirli?", ck: "2026-10-17",
      t: t("Иқлим ўзгариши қанчалик хавотирли?", "Насколько тревожно изменение климата?", "How worrying is climate change?"),
      sum: t("«Америка овози» иқлим ўзгаришининг жиддийлиги ҳақида сўз юритади. Асосий хулоса: исиш инсон фаолияти туфайли, хавф реал, лекин чоралар ҳали ҳам ёрдам беради.", "«Голос Америки» рассказывает о серьёзности изменения климата. Главный вывод: потепление вызвано человеком, риск реален, но меры ещё помогают.", "Voice of America discusses how serious climate change is. Key point: warming is human-caused, the risk is real, but action still helps."),
      pre: t("Иқлим ўзгариши сизнинг шаҳрингизга қандай таъсир қилиши мумкин? 2 та фикр ёзинг.", "Как изменение климата может повлиять на ваш город? Запишите 2 мысли.", "How might climate change affect your town? Write down 2 ideas."),
      k: [
        t("Исишнинг асосий сабаби — кўмир, нефть ва газ ёқишдан чиқадиган CO₂.", "Главная причина потепления — CO₂ от сжигания угля, нефти и газа.", "The main cause of warming is CO₂ from burning coal, oil and gas."),
        t("Атмосферадаги CO₂ миқдори 280 ppm дан 420 ppm дан ортиққа кўтарилди.", "Концентрация CO₂ в атмосфере выросла с 280 до более чем 420 ppm.", "Atmospheric CO₂ has risen from 280 ppm to over 420 ppm."),
        t("Париж келишуви (2015) исишни 2 °C дан анча паст, имкон қадар 1,5 °C да ушлашни мақсад қилган.", "Парижское соглашение (2015) ставит цель удержать потепление намного ниже 2 °C, по возможности на 1,5 °C.", "The Paris Agreement (2015) aims to keep warming well below 2 °C, ideally 1.5 °C.")
      ],
      q: [
        q(t("Ҳозирги исишнинг асосий сабаби нима?", "Главная причина нынешнего потепления?", "What is the main cause of current warming?"),
          [t("Қазилма ёқилғиларни ёқиш", "Сжигание ископаемого топлива", "Burning fossil fuels"), t("Қуёш фаоллигининг кескин ошиши", "Резкий рост активности Солнца", "A sharp rise in solar activity"), t("Вулқонлар", "Вулканы", "Volcanoes")], 0,
          t("Қуёш фаоллиги охирги ўн йилликларда деярли ўзгармаган.", "Активность Солнца в последние десятилетия почти не менялась.", "Solar activity has barely changed in recent decades.")),
        q(t("Париж келишувининг мақсади қайси?", "Какова цель Парижского соглашения?", "What is the Paris Agreement goal?"),
          [t("Исишни 2 °C дан паст, имкон бўлса 1,5 °C да ушлаш", "Удержать потепление ниже 2 °C, по возможности 1,5 °C", "Keep warming below 2 °C, ideally 1.5 °C"), t("Ҳароратни 5 °C га тушириш", "Снизить температуру на 5 °C", "Cut temperature by 5 °C"), t("Нефть қазишни ошириш", "Увеличить добычу нефти", "Increase oil drilling")], 0,
          t("Келишув 2015 йилда Парижда қабул қилинган.", "Соглашение принято в Париже в 2015 году.", "It was adopted in Paris in 2015."))
      ],
      task: t("Оилангиз бир кунда энергия ишлатадиган 5 та ҳолатни ёзинг ва уларнинг қайси бирида тежаш мумкинлигини белгиланг.", "Запишите 5 случаев, когда ваша семья тратит энергию за день, и отметьте, где можно сэкономить.", "List 5 ways your family uses energy in a day and mark where you could save.") },

    { id: "v-iqlim-kun-uz", yt: "o6eKf2Ebxh4", top: "iqlim", st: "u", lng: "uz", ch: "KunUZ", orig: "Iqlim o‘zgarishiga qarshi kurash: dunyo nimaga erishdi?", ck: "2026-10-17",
      t: t("Иқлим ўзгаришига қарши кураш: дунё нимага эришди?", "Борьба с изменением климата: чего добился мир?", "Fighting climate change: what has the world achieved?"),
      sum: t("Kun.uz иқлим ўзгаришига қарши халқаро саъй-ҳаракатлар натижаларини таҳлил қилади: келишувлар, ваъдалар ва ҳақиқий натижалар ўртасидаги фарқ.", "Kun.uz разбирает итоги международной борьбы с изменением климата: соглашения, обещания и реальные результаты.", "Kun.uz reviews the results of international climate action: agreements, pledges and actual outcomes."),
      pre: t("Сизнингча, давлатлар иқлим бўйича ўз ваъдаларини бажармоқдами?", "Как вы думаете, выполняют ли страны свои климатические обещания?", "Do you think countries are keeping their climate promises?"),
      k: [
        t("Асосий ҳужжатлар: БМТ Иқлим конвенцияси (1992), Киото протоколи (1997), Париж келишуви (2015).", "Ключевые документы: Рамочная конвенция ООН (1992), Киотский протокол (1997), Парижское соглашение (2015).", "Key documents: the UN Framework Convention (1992), the Kyoto Protocol (1997), the Paris Agreement (2015)."),
        t("Ютуқлар: қуёш ва шамол энергияси кескин арзонлашиб, жуда тез ўсмоқда.", "Достижения: солнечная и ветровая энергия резко подешевели и быстро растут.", "Achievements: solar and wind power have become much cheaper and are growing fast."),
        t("Муаммо: жаҳон чиқиндилари ҳали ҳам юқори; UNEP «тафовут ҳисоботи»га кўра ҳозирги ваъдалар 1,5 °C учун етарли эмас.", "Проблема: мировые выбросы всё ещё высоки; по «Докладу о разрыве» UNEP нынешних обещаний недостаточно для 1,5 °C.", "Problem: global emissions are still high; UNEP’s Emissions Gap Report finds current pledges are not enough for 1.5 °C.")
      ],
      q: [
        q(t("Париж келишуви қачон қабул қилинган?", "Когда принято Парижское соглашение?", "When was the Paris Agreement adopted?"),
          [t("2015 йил", "2015 год", "2015"), t("1972 йил", "1972 год", "1972"), t("2030 йил", "2030 год", "2030")], 0,
          t("COP21 конференциясида.", "На конференции COP21.", "At the COP21 conference.")),
        q(t("UNEP «тафовут ҳисоботи» нимани кўрсатади?", "Что показывает «Доклад о разрыве» UNEP?", "What does UNEP’s Emissions Gap Report show?"),
          [t("Ваъдалар ва зарур қисқартириш ўртасидаги фарқни", "Разрыв между обещаниями и нужным сокращением выбросов", "The gap between pledges and the cuts needed"), t("Бой ва камбағал ўртасидаги фарқни", "Разрыв между богатыми и бедными", "The gap between rich and poor"), t("Музликлар орасидаги масофани", "Расстояние между ледниками", "The distance between glaciers")], 0,
          t("Ҳисобот ҳар йили чиқади.", "Доклад выходит ежегодно.", "The report is published every year."))
      ],
      task: t("Ўзбекистоннинг иқлим бўйича битта миллий мақсадини топинг (масалан, қайта тикланувчи энергия улуши) ва унинг бажарилишини баҳоланг.", "Найдите одну национальную климатическую цель Узбекистана (например, долю ВИЭ) и оцените её выполнение.", "Find one national climate target of Uzbekistan (e.g. renewable share) and assess progress on it.") },

    { id: "v-isish-uz", yt: "UvQKzv4DT7M", top: "iqlim", st: "m", lng: "uz", ch: "Bugun UZ", orig: "Dunyo boʻylab global isish jarayoni kuzatilmoqda. Bunga kim sababchi?", ck: "2026-10-17",
      t: t("Глобал исиш: бунга ким сабабчи?", "Глобальное потепление: кто виноват?", "Global warming: who is to blame?"),
      sum: t("Янгиликлар лавҳаси бутун дунёда кузатилаётган исиш ва унинг сабабларини муҳокама қилади. Илм хулосаси аниқ: асосий сабаб — инсон фаолиятидан чиқадиган иссиқхона газлари.", "Новостной сюжет о потеплении по всему миру и его причинах. Вывод науки однозначен: главная причина — парниковые газы от деятельности человека.", "A news piece on warming worldwide and its causes. The science is clear: the main cause is greenhouse gases from human activity."),
      pre: t("Иссиқхона ичида нега ташқаридан иссиқроқ бўлади?", "Почему в теплице теплее, чем снаружи?", "Why is it warmer inside a greenhouse than outside?"),
      k: [
        t("Иссиқхона газлари (CO₂, метан, азот оксиди) Ердан қайтган иссиқликни ушлаб қолади.", "Парниковые газы (CO₂, метан, закись азота) удерживают тепло, уходящее от Земли.", "Greenhouse gases (CO₂, methane, nitrous oxide) trap heat leaving the Earth."),
        t("Табиий иссиқхона эффекти ҳаёт учун зарур, муаммо — унинг инсон томонидан кучайтирилиши.", "Естественный парниковый эффект нужен для жизни; проблема — его усиление человеком.", "The natural greenhouse effect is needed for life; the problem is humans strengthening it."),
        t("Манбалар: энергетика, транспорт, саноат, чорвачилик ва ўрмонларни кесиш.", "Источники: энергетика, транспорт, промышленность, животноводство, вырубка лесов.", "Sources: power, transport, industry, livestock and deforestation.")
      ],
      q: [
        q(t("Қайси газ иссиқхона гази эмас?", "Какой газ не парниковый?", "Which gas is not a greenhouse gas?"),
          [t("Азот (N₂)", "Азот (N₂)", "Nitrogen (N₂)"), t("Метан", "Метан", "Methane"), t("Карбонат ангидрид", "Углекислый газ", "Carbon dioxide")], 0,
          t("N₂ ҳаво таркибида 78%, лекин иссиқликни ютмайди.", "N₂ составляет 78% воздуха, но тепло не поглощает.", "N₂ makes up 78% of air but does not absorb heat.")),
        q(t("Табиий иссиқхона эффекти бўлмаса нима бўларди?", "Что было бы без естественного парникового эффекта?", "What would happen without the natural greenhouse effect?"),
          [t("Ер жуда совуқ бўларди (≈ −18 °C)", "Земля была бы очень холодной (≈ −18 °C)", "Earth would be very cold (≈ −18 °C)"), t("Ер исиб кетарди", "Земля перегрелась бы", "Earth would overheat"), t("Ҳеч нарса ўзгармасди", "Ничего бы не изменилось", "Nothing would change")], 0,
          t("Ҳозирги ўртача ҳарорат ≈ +15 °C.", "Сейчас средняя температура ≈ +15 °C.", "Today’s average is ≈ +15 °C."))
      ],
      task: t("Иккита шиша идиш олинг, бирини плёнка билан ёпиб қуёшга қўйинг ва 20 дақиқадан сўнг ичидаги ҳароратни солиштиринг.", "Возьмите две банки, одну накройте плёнкой, поставьте на солнце и через 20 минут сравните температуру внутри.", "Take two jars, cover one with film, put both in the sun and compare inside temperatures after 20 minutes.") },
    { id: "v-aydarkol-uz", yt: "mq4wiSqxIjU", top: "suv", st: "", lng: "uz", ch: "Daryo", orig: "Iqlim o‘zgarishining ayanchli oqibatlari: Aydarko‘l ham quriydimi?", ck: "2026-10-17",
      t: t("Айдаркўл ҳам қурийдими?", "Высохнет ли Айдаркуль?", "Will Lake Aydarkul dry up too?"),
      sum: t("Daryo репортажи Айдар–Арнасой кўллар тизимининг келажаги ҳақида: иссиқ ва қурғоқчил йилларда сув камайиши кўлни хавф остига қўяди.", "Репортаж Daryo о будущем Айдаро-Арнасайской системы озёр: в жаркие и засушливые годы нехватка воды ставит озеро под угрозу.", "A Daryo report on the future of the Aydar–Arnasay lake system: in hot, dry years water shortage puts the lake at risk."),
      pre: t("Айдаркўл табиий кўлми ёки инсон фаолияти туфайли пайдо бўлганми? Тахмин қилинг.", "Айдаркуль — природное озеро или возникшее из-за человека? Угадайте.", "Is Aydarkul a natural lake or one created by human activity? Guess."),
      k: [
        t("Айдаркўл 1969 йилда Чордара сув омборидан Сирдарёнинг тошқин суви Арнасой пастқамлигига ташлангач пайдо бўлган.", "Айдаркуль возник в 1969 году, когда паводковые воды Сырдарьи из Чардаринского водохранилища сбросили в Арнасайскую низменность.", "Aydarkul formed in 1969 when Syr Darya flood water from the Chardara reservoir was released into the Arnasay depression."),
        t("Кўл балиқчилик, қушлар (сув қушлари учун муҳим ҳудуд) ва туризм учун аҳамиятли.", "Озеро важно для рыболовства, птиц (важное место для водоплавающих) и туризма.", "The lake matters for fishing, birds (an important wetland for waterbirds) and tourism."),
        t("Иссиқ ҳаво буғланишни кучайтиради, сув кам келса кўл кичраяди ва шўрлашади.", "Жара усиливает испарение; при малом притоке озеро мелеет и засоляется.", "Heat speeds evaporation; with low inflow the lake shrinks and grows saltier.")
      ],
      q: [
        q(t("Айдаркўл қачон пайдо бўлган?", "Когда возник Айдаркуль?", "When did Aydarkul appear?"),
          [t("1969 йилда", "В 1969 году", "In 1969"), t("Музлик даврида", "В ледниковый период", "In the Ice Age"), t("2010 йилда", "В 2010 году", "In 2010")], 0,
          t("У Сирдарё тошқин сувидан ҳосил бўлган.", "Он образовался из паводковых вод Сырдарьи.", "It formed from Syr Darya flood water.")),
        q(t("Нима учун иссиқ ёзда кўл сатҳи тез пасаяди?", "Почему жарким летом уровень озера быстро падает?", "Why does the lake level fall fast in hot summers?"),
          [t("Буғланиш кучаяди", "Усиливается испарение", "Evaporation increases"), t("Сув музлайди", "Вода замерзает", "The water freezes"), t("Ёмғир кўпаяди", "Больше дождей", "More rain falls")], 0,
          t("Чўл иқлимида буғланиш жуда юқори.", "В пустынном климате испарение очень велико.", "Evaporation is very high in a desert climate."))
      ],
      task: t("Айдар–Арнасой тизимини харитада топинг ва у Орол билан қандай ўхшаш ёки фарқли эканини 3 жумлада ёзинг.", "Найдите систему Айдар–Арнасай на карте и в 3 предложениях сравните её с Аралом.", "Find the Aydar–Arnasay system on a map and compare it with the Aral in 3 sentences.") },

    { id: "v-chiqindi-uz", yt: "j0Xf4WFcRQI", top: "ifl", st: "", lng: "uz", ch: "UZREPORT TV", orig: "Chiqindilar — insoniyatning global muammosi", ck: "2026-10-17",
      t: t("Чиқиндилар — инсониятнинг глобал муаммоси", "Отходы — глобальная проблема человечества", "Waste — a global problem for humanity"),
      sum: t("UzReport кўрсатуви маиший чиқиндилар ҳажми, полигонлар ва қайта ишлаш ҳақида ҳикоя қилади. Чиқиндини камайтиришнинг энг яхши йўли — уни умуман ҳосил қилмаслик.", "Передача UzReport о количестве бытовых отходов, полигонах и переработке. Лучший способ сократить мусор — не создавать его вовсе.", "A UzReport programme on household waste, landfills and recycling. The best way to cut waste is not to create it at all."),
      pre: t("Оилангиз бир ҳафтада неча халта чиқинди чиқаради? Тахмин қилинг.", "Сколько пакетов мусора выносит ваша семья за неделю? Прикиньте.", "How many bags of rubbish does your family throw out a week? Estimate."),
      k: [
        t("Жаҳон банки маълумотига кўра, дунёда йилига 2 млрд тоннадан ортиқ маиший қаттиқ чиқинди ҳосил бўлади.", "По данным Всемирного банка, в мире ежегодно образуется более 2 млрд т твёрдых бытовых отходов.", "According to the World Bank, the world produces over 2 billion tonnes of municipal solid waste a year."),
        t("Очиқ полигонлар тупроқ ва ер ости сувини ифлослайди, метан гази чиқаради.", "Открытые свалки загрязняют почву и грунтовые воды и выделяют метан.", "Open dumps pollute soil and groundwater and release methane."),
        t("Чиқинди иерархияси: камайтириш → қайта фойдаланиш → қайта ишлаш → энергия олиш → кўмиш.", "Иерархия отходов: сократить → использовать повторно → переработать → получить энергию → захоронить.", "The waste hierarchy: reduce → reuse → recycle → recover energy → dispose.")
      ],
      q: [
        q(t("Чиқинди иерархиясида биринчи ўринда нима туради?", "Что на первом месте в иерархии отходов?", "What comes first in the waste hierarchy?"),
          [t("Камайтириш", "Сокращение", "Reduce"), t("Кўмиш", "Захоронение", "Landfill"), t("Ёқиш", "Сжигание", "Burning")], 0,
          t("Ҳосил бўлмаган чиқинди — энг яхши чиқинди.", "Лучший мусор — тот, что не появился.", "The best waste is the waste never made.")),
        q(t("Полигонлардан қайси иссиқхона гази чиқади?", "Какой парниковый газ выделяют свалки?", "Which greenhouse gas do landfills release?"),
          [t("Метан", "Метан", "Methane"), t("Кислород", "Кислород", "Oxygen"), t("Гелий", "Гелий", "Helium")], 0,
          t("Органик чиқинди кислородсиз чириганда метан ҳосил бўлади.", "Органика, гниющая без кислорода, выделяет метан.", "Organic waste rotting without oxygen produces methane."))
      ],
      task: t("Бир ҳафта давомида уйдаги чиқиндини 4 турга (органик, пластик, қоғоз, бошқа) ажратиб, ҳар бирини тортинг ёки санаб ёзинг.", "Неделю сортируйте домашний мусор на 4 вида (органика, пластик, бумага, прочее) и взвешивайте или считайте каждый.", "For a week, sort home waste into 4 types (organic, plastic, paper, other) and weigh or count each.") },

    { id: "v-ifl-uz", yt: "mZ0vOjpfzDw", top: "ifl", st: "m", lng: "uz", ch: "Asadulla Maxammadiyev", orig: "Atrof-muhitning ifloslanishi va chiqindilar muammosi", ck: "2026-10-17",
      t: t("Атроф-муҳитнинг ифлосланиши ва чиқиндилар муаммоси", "Загрязнение окружающей среды и проблема отходов", "Environmental pollution and the waste problem"),
      sum: t("Видео ифлосланишнинг асосий турлари — ҳаво, сув ва тупроқ ифлосланиши ҳамда чиқиндилар муаммосини тушунтиради.", "Видео объясняет основные виды загрязнения — воздуха, воды и почвы — и проблему отходов.", "The video explains the main types of pollution — air, water and soil — and the waste problem."),
      pre: t("Уйингиз атрофида ифлосланишнинг қайси турини кўрасиз?", "Какой вид загрязнения вы видите рядом с домом?", "Which kind of pollution do you see near your home?"),
      k: [
        t("Ҳаво ифлосланиши: транспорт, саноат ва иситишдан чиқадиган чанг (PM2.5), азот ва олтингугурт оксидлари.", "Загрязнение воздуха: пыль (PM2.5), оксиды азота и серы от транспорта, промышленности и отопления.", "Air pollution: dust (PM2.5), nitrogen and sulphur oxides from transport, industry and heating."),
        t("Сув ифлосланиши: тозаланмаган оқова сув, ўғит ва пестицидлар, саноат чиқиндилари.", "Загрязнение воды: неочищенные стоки, удобрения и пестициды, промышленные отходы.", "Water pollution: untreated sewage, fertilisers and pesticides, industrial waste."),
        t("Тупроқ ифлосланиши: чиқинди полигонлари, оғир металлар ва пластик.", "Загрязнение почвы: свалки, тяжёлые металлы и пластик.", "Soil pollution: dumps, heavy metals and plastic.")
      ],
      q: [
        q(t("Қайси бири сув ифлосланишининг манбаи?", "Что является источником загрязнения воды?", "Which is a source of water pollution?"),
          [t("Тозаланмаган оқова сув", "Неочищенные стоки", "Untreated sewage"), t("Қуёш нури", "Солнечный свет", "Sunlight"), t("Шамол", "Ветер", "Wind")], 0,
          t("Оқова сувни тозалаш иншоотлари бу хавфни камайтиради.", "Очистные сооружения снижают эту опасность.", "Treatment plants reduce this risk.")),
        q(t("PM2.5 нима?", "Что такое PM2.5?", "What is PM2.5?"),
          [t("Жуда майда чанг заррачалари", "Очень мелкие частицы пыли", "Very fine dust particles"), t("Сув тури", "Вид воды", "A type of water"), t("Дарахт тури", "Вид дерева", "A tree species")], 0,
          t("Улар 2,5 мкм дан кичик ва ўпкага чуқур киради.", "Они меньше 2,5 мкм и проникают глубоко в лёгкие.", "They are smaller than 2.5 µm and reach deep into the lungs."))
      ],
      task: t("Маҳаллангиздаги битта ифлосланиш манбаини суратга олинг ва уни камайтириш учун 2 та таклиф ёзинг.", "Сфотографируйте источник загрязнения в вашем районе и напишите 2 предложения, как его уменьшить.", "Photograph one pollution source in your neighbourhood and write 2 ideas to reduce it.") },

    { id: "v-okeanplastik-uz", yt: "cpDgDW4_ldU", top: "ifl", st: "m", lng: "uz", ch: "Yerdan gapiramiz", orig: "Okeanda qancha plastik chiqindi bor?", ck: "2026-10-17",
      t: t("Океанда қанча пластик чиқинди бор?", "Сколько пластика в океане?", "How much plastic is in the ocean?"),
      sum: t("Видео океанга тушаётган пластик миқдори ва унинг денгиз ҳаётига таъсири ҳақида. Пластик парчаланмайди, балки микропластикка майдаланади.", "Видео о том, сколько пластика попадает в океан и как он влияет на морскую жизнь. Пластик не разлагается, а крошится в микропластик.", "A video on how much plastic enters the ocean and how it affects sea life. Plastic does not decompose; it breaks into microplastics."),
      pre: t("Пластик бутилка табиатда неча йилда йўқолади деб ўйлайсиз?", "За сколько лет, по-вашему, пластиковая бутылка исчезает в природе?", "How many years do you think a plastic bottle takes to disappear in nature?"),
      k: [
        t("UNEP баҳосига кўра, ҳар йили сув экотизимларига тахминан 11 млн тонна пластик тушади.", "По оценке UNEP, ежегодно в водные экосистемы попадает около 11 млн т пластика.", "UNEP estimates that about 11 million tonnes of plastic enter aquatic ecosystems each year."),
        t("Пластик қуёш ва тўлқин таъсирида 5 мм дан кичик микропластикка майдаланади.", "Под действием солнца и волн пластик крошится в микропластик меньше 5 мм.", "Sun and waves break plastic into microplastics smaller than 5 mm."),
        t("Тошбақа, қуш ва балиқлар пластикни ютиб ёки унга ўралиб нобуд бўлади.", "Черепахи, птицы и рыбы гибнут, глотая пластик или запутываясь в нём.", "Turtles, birds and fish die by swallowing plastic or getting entangled in it.")
      ],
      q: [
        q(t("Микропластик нима?", "Что такое микропластик?", "What is microplastic?"),
          [t("5 мм дан кичик пластик бўлаклари", "Частицы пластика меньше 5 мм", "Plastic pieces smaller than 5 mm"), t("Биологик парчаланадиган пластик", "Биоразлагаемый пластик", "Biodegradable plastic"), t("Пластик ишлаб чиқарадиган завод", "Завод пластика", "A plastic factory")], 0,
          t("Улар сув, тупроқ ва ҳатто инсон танасида топилган.", "Их находят в воде, почве и даже в теле человека.", "They have been found in water, soil and even the human body.")),
        q(t("Нима учун пластик океанда узоқ сақланади?", "Почему пластик долго остаётся в океане?", "Why does plastic persist in the ocean?"),
          [t("Микроблар уни деярли парчалай олмайди", "Микробы почти не могут его разложить", "Microbes can barely break it down"), t("У сувда эрийди", "Он растворяется в воде", "It dissolves in water"), t("Уни балиқлар ҳазм қилади", "Его переваривают рыбы", "Fish digest it")], 0,
          t("Пластик фақат майдаланади, лекин йўқолмайди.", "Пластик лишь измельчается, но не исчезает.", "Plastic only fragments; it does not vanish."))
      ],
      task: t("Бир кун давомида ишлатган бир марталик пластик буюмларингизни ёзинг ва уларнинг 3 тасига кўп марталик ўриндош топинг.", "Запишите одноразовый пластик, которым пользовались за день, и найдите многоразовую замену для 3 предметов.", "List the single-use plastics you used in a day and find reusable swaps for 3 of them.") },

    { id: "v-suv90-uz", yt: "j7JH-Z6l5xA", top: "suv", st: "", lng: "uz", ch: "Daryo", orig: "O‘zbekistonda ichimlik suvining 90 foizi hali ham qishloq xo‘jaligiga yo‘naltirilmoqda", ck: "2026-10-17",
      t: t("Ўзбекистонда сувнинг 90 фоизи қишлоқ хўжалигига кетади", "В Узбекистане 90% воды уходит в сельское хозяйство", "In Uzbekistan 90% of water goes to farming"),
      sum: t("Репортаж Ўзбекистонда олинадиган чучук сувнинг катта қисми суғоришга сарфланишини кўрсатади. Сувни тежайдиган технологиялар — томчилатиб суғориш ва каналларни таъмирлаш — муҳим ечим.", "Репортаж показывает, что бо́льшая часть забираемой пресной воды в Узбекистане уходит на орошение. Важное решение — водосберегающие технологии: капельный полив и ремонт каналов.", "The report shows most freshwater withdrawn in Uzbekistan goes to irrigation. Key solutions are water-saving technologies: drip irrigation and repaired canals."),
      pre: t("Сизнингча, сув кўпроқ уйларда сарфланадими ёки далаларда?", "Как вы думаете, больше воды тратят дома или на полях?", "Do you think more water is used in homes or in fields?"),
      k: [
        t("FAO маълумотига кўра, дунёда олинадиган чучук сувнинг ≈70 фоизи қишлоқ хўжалигига кетади; Ўзбекистонда бу улуш ≈90%.", "По данным ФАО, в мире ≈70% забираемой пресной воды идёт в сельское хозяйство; в Узбекистане — ≈90%.", "According to FAO, ≈70% of freshwater withdrawals worldwide go to agriculture; in Uzbekistan it is ≈90%."),
        t("Эски тупроқ каналларда сувнинг катта қисми шимилиш ва буғланишга йўқолади.", "В старых земляных каналах много воды теряется на фильтрацию и испарение.", "Old earthen canals lose much water to seepage and evaporation."),
        t("Томчилатиб суғориш эгатлаб суғоришга нисбатан сувни сезиларли тежайди.", "Капельное орошение заметно экономит воду по сравнению с бороздковым.", "Drip irrigation saves a lot of water compared with furrow irrigation.")
      ],
      q: [
        q(t("Ўзбекистонда олинадиган сувнинг қанча қисми қишлоқ хўжалигига кетади?", "Какая доля воды в Узбекистане идёт на сельское хозяйство?", "What share of water in Uzbekistan goes to agriculture?"),
          [t("≈90%", "≈90%", "≈90%"), t("≈10%", "≈10%", "≈10%"), t("≈40%", "≈40%", "≈40%")], 0,
          t("Шунинг учун суғоришдаги тежаш энг катта самара беради.", "Поэтому экономия в орошении даёт наибольший эффект.", "So saving in irrigation has the biggest effect.")),
        q(t("Қайси усул сувни энг кўп тежайди?", "Какой способ больше всего экономит воду?", "Which method saves the most water?"),
          [t("Томчилатиб суғориш", "Капельное орошение", "Drip irrigation"), t("Далани бостириб суғориш", "Затопление поля", "Flooding the field"), t("Очиқ тупроқ каналлар", "Открытые земляные каналы", "Open earthen canals")], 0,
          t("Сув тўғридан-тўғри илдизга етказилади.", "Вода подаётся прямо к корням.", "Water goes straight to the roots."))
      ],
      task: t("Уйдаги битта жўмракдан 1 дақиқада қанча сув оқишини ўлчанг ва бир йилда қанча бўлишини ҳисобланг.", "Измерьте, сколько воды течёт из крана за 1 минуту, и посчитайте объём за год.", "Measure how much water a tap runs in 1 minute and calculate the yearly total.") },

    { id: "v-suvhayot-uz", yt: "uv5lnog6lmc", top: "suv", st: "m", lng: "uz", ch: "IMRS  MHTI  ИМРИ", orig: "Suv — hayot manbai!", ck: "2026-10-17",
      t: t("Сув — ҳаёт манбаи!", "Вода — источник жизни!", "Water is the source of life!"),
      sum: t("Қисқа ижтимоий ролик сувнинг ҳаёт учун аҳамиятини ва уни асраш зарурлигини эслатади.", "Короткий социальный ролик напоминает о значении воды для жизни и о необходимости её беречь.", "A short public-awareness clip reminds us how vital water is and why we must protect it."),
      pre: t("Инсон сувсиз неча кун яшай олади? Тахмин қилинг.", "Сколько дней человек может прожить без воды? Угадайте.", "How many days can a person live without water? Guess."),
      k: [
        t("Ердаги сувнинг фақат ≈2,5 фоизи чучук, унинг ҳам кўп қисми музликлар ва ер ости сувларида.", "Лишь ≈2,5% воды на Земле пресная, и бо́льшая её часть — в ледниках и под землёй.", "Only ≈2.5% of Earth’s water is fresh, and most of that is in glaciers and underground."),
        t("Инсон танасининг тахминан 60 фоизи сувдан иборат; сувсиз инсон бир неча кун яшай олади.", "Тело человека примерно на 60% состоит из воды; без воды человек живёт лишь несколько дней.", "The human body is about 60% water; without water a person survives only a few days."),
        t("ЖССТ маълумотига кўра, дунёда ҳали ҳам 2 млрд га яқин одам хавфсиз ичимлик сувидан бебаҳра.", "По данным ВОЗ, около 2 млрд человек всё ещё лишены безопасной питьевой воды.", "According to WHO, around 2 billion people still lack safely managed drinking water.")
      ],
      q: [
        q(t("Ердаги сувнинг қанча қисми чучук?", "Какая доля воды на Земле пресная?", "What share of Earth’s water is fresh?"),
          [t("≈2,5%", "≈2,5%", "≈2.5%"), t("≈50%", "≈50%", "≈50%"), t("≈97%", "≈97%", "≈97%")], 0,
          t("≈97% — океанлардаги шўр сув.", "≈97% — солёная вода океанов.", "≈97% is salty ocean water.")),
        q(t("Чучук сувнинг энг катта захираси қаерда?", "Где самые большие запасы пресной воды?", "Where is most fresh water stored?"),
          [t("Музликлар ва қутб музларида", "В ледниках и полярных льдах", "In glaciers and polar ice"), t("Дарёларда", "В реках", "In rivers"), t("Булутларда", "В облаках", "In clouds")], 0,
          t("Дарё ва кўллардаги сув жуда оз улушни ташкил қилади.", "Вода рек и озёр составляет совсем малую долю.", "Rivers and lakes hold only a tiny share."))
      ],
      task: t("«Сувни асранг» мавзусида синфингиз учун қисқа плакат ёки 30 сониялик видео шиор тайёрланг.", "Подготовьте для класса плакат или 30-секундный ролик на тему «Берегите воду».", "Make a poster or a 30-second clip for your class on “Save water”.") },

    { id: "v-suvtejang-uz", yt: "_AoqQfOrZPg", top: "suv", st: "m", lng: "uz", ch: "Qarshi shahridagi Prezident maktabi", orig: "Suvni tejang!", ck: "2026-10-17",
      t: t("Сувни тежанг!", "Экономьте воду!", "Save water!"),
      sum: t("Қаршидаги Президент мактаби ўқувчилари тайёрлаган ролик кундалик ҳаётда сувни тежашга чақиради — тенгдошлардан тенгдошларга ўрнак.", "Ролик учеников Президентской школы в Карши призывает экономить воду в быту — пример от сверстников.", "A clip by students of the Presidential School in Karshi urges saving water in daily life — a peer-to-peer example."),
      pre: t("Уйда сувни қаерда беҳуда сарфлаймиз? 3 та мисол ёзинг.", "Где дома мы тратим воду впустую? Запишите 3 примера.", "Where do we waste water at home? Write down 3 examples."),
      k: [
        t("Тиш ювишда жўмракни ёпиб қўйиш ҳар сафар бир неча литр сувни тежайди.", "Закрытый кран во время чистки зубов экономит несколько литров каждый раз.", "Turning off the tap while brushing saves several litres each time."),
        t("Томчилаётган жўмрак бир йилда минглаб литр сувни исроф қилиши мумкин.", "Капающий кран может терять тысячи литров воды в год.", "A dripping tap can waste thousands of litres a year."),
        t("Душ ваннага нисбатан одатда камроқ сув сарфлайди.", "Душ обычно расходует меньше воды, чем ванна.", "A shower usually uses less water than a bath.")
      ],
      q: [
        q(t("Қайси одат сувни тежайди?", "Какая привычка экономит воду?", "Which habit saves water?"),
          [t("Тиш ювишда жўмракни ёпиш", "Закрывать кран при чистке зубов", "Turning off the tap while brushing"), t("Идишни оқар сув остида узоқ ювиш", "Долго мыть посуду под струёй", "Washing dishes under running water"), t("Томчилаётган жўмракни тузатмаслик", "Не чинить капающий кран", "Ignoring a dripping tap")], 0,
          t("Кичик одатлар йилига катта тежамга айланади.", "Мелкие привычки дают большую экономию за год.", "Small habits add up to big savings over a year.")),
        q(t("Томчилаётган жўмрак бир йилда қанча сувни йўқотиши мумкин?", "Сколько воды может потерять капающий кран за год?", "How much water can a dripping tap lose in a year?"),
          [t("Минглаб литр", "Тысячи литров", "Thousands of litres"), t("Бир стакан", "Один стакан", "One glass"), t("Ҳеч қанча", "Нисколько", "None")], 0,
          t("Сония сайин томчи — йилига тонналаб сув.", "Капля в секунду — тонны воды в год.", "A drop a second becomes tonnes a year."))
      ],
      task: t("Уйингиздаги барча жўмракларни текширинг; томчилаётганини ота-онангизга айтиб, тузатишга ёрдам беринг.", "Проверьте все краны дома; о капающих скажите родителям и помогите починить.", "Check every tap at home; report any drips to your parents and help fix them.") },

    { id: "v-toshhavo-uz", yt: "-ylSbcqez_A", top: "ifl", st: "", lng: "uz", ch: "Daryo", orig: "Toshkent havosining ifloslanishiga qarshi keskin choralar koʻriladi", ck: "2026-10-17",
      t: t("Тошкент ҳавосини тозалаш чоралари", "Меры против загрязнения воздуха в Ташкенте", "Measures against air pollution in Tashkent"),
      sum: t("Репортаж Тошкентда ҳаво ифлосланишига қарши кўриладиган чоралар ҳақида. Асосий манбалар — транспорт, қурилиш чанги, иситиш ва табиий чанг.", "Репортаж о мерах против загрязнения воздуха в Ташкенте. Основные источники — транспорт, строительная пыль, отопление и природная пыль.", "A report on measures against air pollution in Tashkent. Main sources are traffic, construction dust, heating and natural dust."),
      pre: t("Ҳаво сифатини қандай билса бўлади? Қайси иловалар ёки кўрсаткичларни биласиз?", "Как узнать качество воздуха? Какие приложения или индексы вы знаете?", "How can you tell air quality? Which apps or indices do you know?"),
      k: [
        t("ЖССТ (2021) PM2.5 учун йиллик тавсия чегарасини 5 мкг/м³ қилиб белгилаган.", "ВОЗ (2021) установила годовой ориентир для PM2.5 в 5 мкг/м³.", "WHO (2021) set the annual PM2.5 guideline at 5 µg/m³."),
        t("Шаҳарда чангнинг манбалари: автомобиль, қурилиш, кўмир ва газ ёқиш, чўллардан келадиган чанг.", "Источники пыли в городе: автомобили, стройки, сжигание угля и газа, пыль из пустынь.", "Urban dust sources: cars, construction, burning coal and gas, and desert dust."),
        t("Чоралар: қурилиш майдонларини ёпиш, жамоат транспортини ривожлантириш, кўкаламзорлаштириш, мониторинг станциялари.", "Меры: укрытие строек, развитие общественного транспорта, озеленение, станции мониторинга.", "Measures: covering building sites, better public transport, greening and monitoring stations.")
      ],
      q: [
        q(t("ЖССТ бўйича PM2.5 нинг йиллик тавсия чегараси қанча?", "Каков годовой ориентир ВОЗ для PM2.5?", "What is WHO’s annual PM2.5 guideline?"),
          [t("5 мкг/м³", "5 мкг/м³", "5 µg/m³"), t("500 мкг/м³", "500 мкг/м³", "500 µg/m³"), t("Чегара йўқ", "Ориентира нет", "There is none")], 0,
          t("Бу чегара 2021 йилда 10 дан 5 гача туширилган.", "В 2021 году ориентир снизили с 10 до 5.", "It was lowered from 10 to 5 in 2021.")),
        q(t("Қайси чора ҳаводаги чангни камайтиради?", "Какая мера уменьшает пыль в воздухе?", "Which measure reduces dust in the air?"),
          [t("Қурилиш майдонларини ёпиш ва сувлаш", "Укрытие и полив строек", "Covering and wetting building sites"), t("Дарахтларни кесиш", "Вырубка деревьев", "Cutting trees"), t("Кўпроқ кўмир ёқиш", "Больше сжигать угля", "Burning more coal")], 0,
          t("Кўкаламзорлаштириш ҳам чангни ушлайди.", "Озеленение тоже задерживает пыль.", "Greening also traps dust."))
      ],
      task: t("Бир ҳафта давомида шаҳрингиз ҳаво сифати индексини (AQI) ҳар куни ёзиб, график чизинг.", "Неделю записывайте индекс качества воздуха (AQI) вашего города и постройте график.", "Record your city’s air quality index (AQI) daily for a week and draw a graph.") },

    { id: "v-havoilm-uz", yt: "fQxI47qq_dM", top: "ifl", st: "u", lng: "uz", ch: "KunUZ", orig: "“O‘zbekistonga havo ifloslanishi bo‘yicha ilmiy tadqiqotlar kerak” — amerikalik olim", ck: "2026-10-17",
      t: t("Ҳаво ифлосланишини илмий ўрганиш нега керак?", "Зачем нужны научные исследования загрязнения воздуха?", "Why air pollution needs scientific research"),
      sum: t("Америкалик олим Ўзбекистонда ҳаво ифлосланиши манбаларини аниқ билиш учун илмий тадқиқот ва мониторинг зарурлигини айтади: тўғри маълумотсиз тўғри чора бўлмайди.", "Американский учёный говорит, что Узбекистану нужны исследования и мониторинг, чтобы точно знать источники загрязнения воздуха: без данных нет верных мер.", "An American scientist says Uzbekistan needs research and monitoring to pin down air-pollution sources: without data there are no right measures."),
      pre: t("Шаҳарда чангнинг қанча қисми машиналардан, қанчаси табиатдан келишини қандай аниқлаш мумкин?", "Как определить, сколько пыли в городе от машин, а сколько от природы?", "How could you tell how much city dust comes from cars versus nature?"),
      k: [
        t("Манбаларни аниқлаш (source apportionment) учун заррачаларнинг кимёвий таркиби ўрганилади.", "Для определения источников (source apportionment) изучают химический состав частиц.", "Source apportionment studies the chemical make-up of particles to identify sources."),
        t("Доимий мониторинг станциялари ва очиқ маълумотлар жамоатчилик ва сиёсат учун асос.", "Постоянные станции мониторинга и открытые данные — основа для общества и политики.", "Continuous monitoring stations and open data underpin public awareness and policy."),
        t("ЖССТ баҳосига кўра, ташқи ва уй ичидаги ҳаво ифлосланиши йилига ≈7 млн муддатидан олдинги ўлимга сабаб бўлади.", "По оценке ВОЗ, загрязнение наружного и домашнего воздуха приводит к ≈7 млн преждевременных смертей в год.", "WHO estimates outdoor and household air pollution cause ≈7 million premature deaths a year.")
      ],
      q: [
        q(t("Ифлосланиш манбаини аниқлаш учун олимлар нимани ўрганади?", "Что изучают учёные, чтобы найти источник загрязнения?", "What do scientists study to find pollution sources?"),
          [t("Заррачаларнинг кимёвий таркибини", "Химический состав частиц", "The chemical make-up of particles"), t("Фақат ҳаво ҳароратини", "Только температуру воздуха", "Only air temperature"), t("Булутлар шаклини", "Форму облаков", "Cloud shapes")], 0,
          t("Масалан, тупроқ чанги ва ёнилғи қурумининг «излари» турлича.", "Например, «следы» почвенной пыли и сажи различаются.", "For example, soil dust and soot leave different chemical fingerprints.")),
        q(t("ЖССТ бўйича ҳаво ифлосланиши йилига тахминан неча ўлимга сабаб бўлади?", "Сколько смертей в год, по ВОЗ, вызывает загрязнение воздуха?", "About how many deaths a year does air pollution cause, per WHO?"),
          [t("≈7 млн", "≈7 млн", "≈7 million"), t("≈7 минг", "≈7 тыс.", "≈7 thousand"), t("≈700", "≈700", "≈700")], 0,
          t("Бу — энг катта экологик соғлиқ хавфи.", "Это крупнейший экологический риск для здоровья.", "It is the largest environmental health risk."))
      ],
      task: t("Шаҳрингизда ҳаво сифатини ўлчайдиган станциялар қаерда жойлашганини аниқлаб, ўз маҳаллангиз учун тадқиқот режасини тузинг.", "Выясните, где в вашем городе станции мониторинга воздуха, и составьте план исследования для своего района.", "Find where air monitoring stations are in your city and draft a research plan for your neighbourhood.") },

    { id: "v-qizilkitob-uz", yt: "VMLpiHatV6c", top: "bio", st: "m", lng: "uz", ch: "BIOLOG UZ", orig: "O'zbekiston Qizil Kitobiga Kiritilgan O'simliklar, Hayvonlar Ro'yhati.", ck: "2026-10-17",
      t: t("Ўзбекистон Қизил китобига киритилган ўсимлик ва ҳайвонлар", "Растения и животные Красной книги Узбекистана", "Plants and animals in Uzbekistan’s Red Data Book"),
      sum: t("Видео Ўзбекистон Қизил китобига киритилган ўсимлик ва ҳайвонлар рўйхатини таништиради. Қизил китоб — йўқолиб кетиш хавфи остидаги турлар рўйхати ва уларни муҳофаза қилиш асоси.", "Видео знакомит со списком растений и животных Красной книги Узбекистана. Красная книга — перечень видов под угрозой и основа для их охраны.", "The video introduces the plants and animals listed in Uzbekistan’s Red Data Book — the list of threatened species and the basis for protecting them."),
      pre: t("Ўзбекистонда яшайдиган қайси ноёб ҳайвонни биласиз?", "Какое редкое животное Узбекистана вы знаете?", "Which rare animal of Uzbekistan do you know?"),
      k: [
        t("Қизил китоб турларни хавф даражасига кўра тоифаларга ажратади (йўқолиб кетган, хавф остида, камёб ва ҳ.к.).", "Красная книга делит виды на категории по степени угрозы (исчезнувшие, под угрозой, редкие и т. д.).", "The Red Data Book groups species by threat level (extinct, endangered, rare, etc.)."),
        t("Ўзбекистондаги мисоллар: қор қоплони, Бухоро буғуси, сайғоқ, йўрға тувалоқ.", "Примеры в Узбекистане: снежный барс, бухарский олень, сайгак, джек (дрофа-красотка).", "Examples in Uzbekistan: snow leopard, Bukhara deer, saiga, houbara bustard."),
        t("Турлар йўқолишининг асосий сабаблари: яшаш жойининг бузилиши, браконьерлик, ортиқча фойдаланиш.", "Главные причины исчезновения: разрушение мест обитания, браконьерство, чрезмерное использование.", "Main causes of loss: habitat destruction, poaching and overuse.")
      ],
      q: [
        q(t("Қизил китоб нима?", "Что такое Красная книга?", "What is the Red Data Book?"),
          [t("Хавф остидаги турлар рўйхати", "Список видов под угрозой", "A list of threatened species"), t("Ошпазлик китоби", "Кулинарная книга", "A cookbook"), t("Ов қоидалари", "Правила охоты", "Hunting rules")], 0,
          t("Китобга киритилган турларни овлаш ва йиғиш тақиқланади.", "Добыча и сбор занесённых видов запрещены.", "Hunting or collecting listed species is prohibited.")),
        q(t("Қайси ҳайвон Ўзбекистон Қизил китобида?", "Какое животное занесено в Красную книгу Узбекистана?", "Which animal is in Uzbekistan’s Red Data Book?"),
          [t("Қор қоплони", "Снежный барс", "Snow leopard"), t("Уй мушуги", "Домашняя кошка", "House cat"), t("Чумчуқ", "Воробей", "Sparrow")], 0,
          t("Қор қоплони Ҳисор ва Чотқол тоғларида учрайди.", "Снежный барс встречается в Гиссарских и Чаткальских горах.", "Snow leopards live in the Hissar and Chatkal mountains."))
      ],
      task: t("Қизил китобдаги битта турни танлаб, у ҳақида паспорт-карточка тузинг: яшаш жойи, сони, хавфлар, ҳимоя чоралари.", "Выберите вид из Красной книги и сделайте карточку: ареал, численность, угрозы, меры охраны.", "Choose one Red Data Book species and make a fact card: habitat, numbers, threats, protection.") },

    { id: "v-qk-osimlik-uz", yt: "lmQbL_jQQ50", top: "bio", st: "m", lng: "uz", ch: "BIOLOGIYA MARKAZI", orig: "Qizil kitobga kiritilgan o'simliklar", ck: "2026-10-17",
      t: t("Қизил китобга киритилган ўсимликлар", "Растения Красной книги", "Plants in the Red Data Book"),
      sum: t("Видео Қизил китобга киритилган ноёб ўсимликлар билан таништиради. Ўсимликлар экотизимнинг асоси, уларнинг йўқолиши бутун озиқ занжирига таъсир қилади.", "Видео знакомит с редкими растениями Красной книги. Растения — основа экосистемы, их исчезновение затрагивает всю пищевую цепь.", "The video presents rare plants from the Red Data Book. Plants are the base of ecosystems; losing them affects the whole food chain."),
      pre: t("Баҳорда тоғларда лола териш нега тақиқланган бўлиши мумкин?", "Почему весной в горах может быть запрещено собирать тюльпаны?", "Why might picking wild tulips in the mountains be banned?"),
      k: [
        t("Ўзбекистон ёввойи лолаларнинг ватанларидан бири; уларнинг бир неча тури Қизил китобга киритилган.", "Узбекистан — одна из родин диких тюльпанов; несколько их видов занесены в Красную книгу.", "Uzbekistan is one of the homelands of wild tulips; several species are in the Red Data Book."),
        t("Ўсимликларга асосий хавф: ортиқча ўтлатиш, гул ва пиёзларни териш, ерларни ўзлаштириш.", "Главные угрозы растениям: перевыпас, сбор цветов и луковиц, распашка земель.", "Main threats to plants: overgrazing, picking flowers and bulbs, and land conversion."),
        t("Ҳимоя йўллари: қўриқхона ва миллий боғлар, ботаника боғларида кўпайтириш, уруғ банклари.", "Способы охраны: заповедники и нацпарки, размножение в ботсадах, банки семян.", "Protection: reserves and national parks, propagation in botanical gardens, seed banks.")
      ],
      q: [
        q(t("Ноёб ўсимликларни сақлашнинг қайси йўли тўғри?", "Какой способ сохранить редкие растения верный?", "Which is a valid way to conserve rare plants?"),
          [t("Уруғ банки ва ботаника боғлари", "Банки семян и ботсады", "Seed banks and botanical gardens"), t("Гулларни териб сотиш", "Собирать и продавать цветы", "Picking and selling flowers"), t("Ортиқча ўтлатиш", "Перевыпас", "Overgrazing")], 0,
          t("Ex situ (табиатдан ташқарида) муҳофаза — қўшимча кафолат.", "Охрана ex situ — дополнительная страховка.", "Ex situ conservation is an extra safeguard.")),
        q(t("Ўсимлик тури йўқолса, нима бўлиши мумкин?", "Что может случиться, если исчезнет вид растения?", "What can happen if a plant species disappears?"),
          [t("Унга боғлиқ ҳашарот ва ҳайвонлар ҳам зарар кўради", "Пострадают зависящие от него насекомые и животные", "Insects and animals that depend on it suffer too"), t("Ҳеч нарса", "Ничего", "Nothing"), t("Ҳаво тозароқ бўлади", "Воздух станет чище", "The air gets cleaner")], 0,
          t("Ўсимликлар озиқ занжирининг биринчи бўғини.", "Растения — первое звено пищевой цепи.", "Plants are the first link of the food chain."))
      ],
      task: t("Ҳудудингиздаги битта ноёб ўсимлик ҳақида маълумот тўплаб, «Термайлик, суратга олайлик» шиорли плакат чизинг.", "Соберите сведения о редком растении вашего края и нарисуйте плакат «Не рвать — фотографировать».", "Research one rare local plant and draw a “Photograph, don’t pick” poster.") },

    { id: "v-qk-qush-uz", yt: "AfWpNNzVzaY", top: "bio", st: "m", lng: "uz", ch: "BIOLOGIYA MARKAZI", orig: "Qizil kitobga kiritilgan qushlar", ck: "2026-10-17",
      t: t("Қизил китобга киритилган қушлар", "Птицы Красной книги", "Birds in the Red Data Book"),
      sum: t("Видео Қизил китобга киритилган ноёб қушларни кўрсатади. Йиртқич қушлар ва тувалоқлар айниқса хавф остида.", "Видео показывает редких птиц Красной книги. Особенно уязвимы хищные птицы и дрофиные.", "The video shows rare birds of the Red Data Book. Birds of prey and bustards are especially threatened."),
      pre: t("Нега баъзи қушлар учун хавф бир неча мамлакатда бир вақтда пайдо бўлади?", "Почему угрозы для некоторых птиц возникают сразу в нескольких странах?", "Why do threats to some birds arise in several countries at once?"),
      k: [
        t("Мисоллар: итолғи (лочин тури) ва йўрға тувалоқ — овчилик ва ноқонуний савдо туфайли камайган.", "Примеры: балобан и джек (дрофа-красотка) — сократились из-за охоты и незаконной торговли.", "Examples: the saker falcon and houbara bustard — declined through hunting and illegal trade."),
        t("Кўчиб юрувчи қушлар учун сув-ботқоқ ерлар (масалан, Айдаркўл, Тудакўл) муҳим дам олиш жойлари.", "Для перелётных птиц важны водно-болотные угодья (например, Айдаркуль, Тудакуль).", "Wetlands such as Aydarkul and Tudakul are vital stopovers for migratory birds."),
        t("Кўчиб юрувчи турларни ҳимоя қилиш учун халқаро ҳамкорлик (масалан, Бонн конвенцияси) зарур.", "Для охраны перелётных видов нужна международная кооперация (например, Боннская конвенция).", "Protecting migratory species needs international cooperation (e.g. the Bonn Convention).")
      ],
      q: [
        q(t("Итолғи сонининг камайишига асосий сабаб нима?", "Главная причина сокращения балобана?", "Main reason the saker falcon declined?"),
          [t("Ноқонуний тутиш ва савдо", "Незаконный отлов и торговля", "Illegal capture and trade"), t("Ортиқча ем", "Избыток корма", "Too much food"), t("Совуқ қишлар", "Холодные зимы", "Cold winters")], 0,
          t("Итолғилар овчилик учун ноқонуний тутилади.", "Балобанов незаконно ловят для соколиной охоты.", "Sakers are illegally caught for falconry.")),
        q(t("Кўчиб юрувчи қушларни ҳимоя қилиш учун нима керак?", "Что нужно для охраны перелётных птиц?", "What is needed to protect migratory birds?"),
          [t("Мамлакатлараро ҳамкорлик", "Сотрудничество стран", "Cooperation between countries"), t("Фақат битта давлат қонуни", "Закон одной страны", "Just one country’s law"), t("Ҳеч нарса", "Ничего", "Nothing")], 0,
          t("Қушлар чегарани билмайди.", "Птицы не знают границ.", "Birds ignore borders."))
      ],
      task: t("Бир ҳафта мактаб атрофида учратган қушларни кузатиб, рўйхатини тузинг ва уларни аниқлаш учун илова ёки аниқлагичдан фойдаланинг.", "Неделю наблюдайте птиц у школы, составьте список и определите их по приложению или определителю.", "Watch birds around school for a week, list them and identify them with an app or field guide.") },

    { id: "v-qtem-uz", yt: "tQCIqs_ogfs", top: "energ", st: "u", lng: "uz", ch: "TIIAME", orig: "QAYTA TIKLANUVCHI ENERGIYA MANBALARI", ck: "2026-10-17",
      t: t("Қайта тикланувчи энергия манбалари", "Возобновляемые источники энергии", "Renewable energy sources"),
      sum: t("ТИҚХММИ (TIIAME) университети маърузаси қайта тикланувчи энергия манбаларини — қуёш, шамол, сув, биомасса ва геотермал энергияни таништиради.", "Лекция университета ТИИИМСХ (TIIAME) знакомит с возобновляемыми источниками энергии — солнцем, ветром, водой, биомассой и геотермальной энергией.", "A TIIAME university lecture introduces renewable energy sources — solar, wind, hydro, biomass and geothermal."),
      pre: t("Нима учун кўмир «қайта тикланмайдиган», қуёш эса «қайта тикланувчи» манба дейилади?", "Почему уголь — «невозобновляемый», а солнце — «возобновляемый» источник?", "Why is coal “non-renewable” while sunlight is “renewable”?"),
      k: [
        t("Қайта тикланувчи манбалар табиатда инсон ҳаёти миқёсида тикланади: қуёш, шамол, сув оқими, биомасса, ер иссиқлиги.", "Возобновляемые источники восполняются в масштабе жизни человека: солнце, ветер, течение воды, биомасса, тепло Земли.", "Renewable sources replenish on a human timescale: sun, wind, flowing water, biomass, Earth’s heat."),
        t("Қуёш ва шамол ўзгарувчан, шунинг учун энергия сақлаш (аккумулятор, ГАЭС) ва ақлли тармоқлар керак.", "Солнце и ветер переменчивы, поэтому нужны накопители (аккумуляторы, ГАЭС) и умные сети.", "Sun and wind are variable, so storage (batteries, pumped hydro) and smart grids are needed."),
        t("Ўзбекистонда йилига 300 га яқин қуёшли кун бор — қуёш энергетикаси учун катта салоҳият.", "В Узбекистане около 300 солнечных дней в году — большой потенциал для солнечной энергетики.", "Uzbekistan has around 300 sunny days a year — great potential for solar power.")
      ],
      q: [
        q(t("Қайси манба қайта тикланмайди?", "Какой источник невозобновляемый?", "Which source is non-renewable?"),
          [t("Табиий газ", "Природный газ", "Natural gas"), t("Шамол", "Ветер", "Wind"), t("Қуёш", "Солнце", "Sunlight")], 0,
          t("Газ миллионлаб йилда ҳосил бўлган.", "Газ образовывался миллионы лет.", "Gas formed over millions of years.")),
        q(t("Қуёш ва шамол энергиясининг асосий камчилиги нима?", "Главный недостаток солнца и ветра?", "Main drawback of solar and wind?"),
          [t("Ўзгарувчанлик (кечаси, шамолсиз кунлар)", "Непостоянство (ночь, безветрие)", "Variability (night, calm days)"), t("Кўп CO₂ чиқаради", "Много CO₂", "High CO₂ emissions"), t("Тугаб қолади", "Заканчиваются", "They run out")], 0,
          t("Бу муаммо энергия сақлаш билан ҳал қилинади.", "Эта проблема решается накопителями.", "Storage addresses this."))
      ],
      task: t("Мактабингиз томи учун қуёш панели лойиҳасини таклиф қилинг: майдон, панеллар сони ва тахминий фойда.", "Предложите проект солнечных панелей на крыше школы: площадь, число панелей, примерная польза.", "Propose a solar-panel project for your school roof: area, number of panels, rough benefit.") },

    { id: "v-ilkqes-uz", yt: "_qQAXJmTgdo", top: "energ", st: "", lng: "uz", ch: "KunUZ", orig: "O‘zbekistondagi ilk quyosh elektr stansiyasi — eksklyuziv reportaj", ck: "2026-10-17",
      t: t("Ўзбекистондаги илк қуёш электр станцияси", "Первая солнечная электростанция Узбекистана", "Uzbekistan’s first solar power plant"),
      sum: t("Kun.uz репортажи Ўзбекистондаги илк йирик қуёш электр станциясини кўрсатади: панеллар қуёш нурини тўғридан-тўғри электрга айлантиради.", "Репортаж Kun.uz показывает первую крупную солнечную электростанцию Узбекистана: панели напрямую превращают солнечный свет в электричество.", "A Kun.uz report shows Uzbekistan’s first large solar power plant: panels turn sunlight directly into electricity."),
      pre: t("Қуёш панели кечаси ишлайдими? Нега?", "Работает ли солнечная панель ночью? Почему?", "Does a solar panel work at night? Why?"),
      k: [
        t("Фотоэлектрик (PV) панеллар кремний ярим ўтказгичида фотоэффект ёрдамида ток ҳосил қилади.", "Фотоэлектрические (PV) панели создают ток за счёт фотоэффекта в кремниевом полупроводнике.", "Photovoltaic (PV) panels generate current via the photovoltaic effect in silicon semiconductors."),
        t("Қуёш станцияси ишлаганда CO₂ чиқармайди ва сув деярли талаб қилмайди.", "Солнечная станция при работе не выбрасывает CO₂ и почти не требует воды.", "A solar plant emits no CO₂ while operating and needs almost no water."),
        t("Панеллар чангланса самарадорлиги пасаяди, шунинг учун чўл ҳудудларида уларни тозалаб туриш керак.", "Запылённые панели теряют эффективность, поэтому в пустынных районах их нужно чистить.", "Dusty panels lose efficiency, so in desert areas they must be cleaned regularly.")
      ],
      q: [
        q(t("Қуёш панели қайси ҳодисага асосланган?", "На каком явлении основана солнечная панель?", "What effect does a solar panel rely on?"),
          [t("Фотоэффект", "Фотоэффект", "The photovoltaic effect"), t("Ёниш", "Горение", "Combustion"), t("Ядро парчаланиши", "Деление ядра", "Nuclear fission")], 0,
          t("Ёруғлик фотонлари электронларни ҳаракатга келтиради.", "Фотоны света приводят электроны в движение.", "Photons of light set electrons moving.")),
        q(t("Чўлдаги қуёш станцияси учун қандай қўшимча иш керак?", "Что нужно дополнительно для солнечной станции в пустыне?", "What extra upkeep does a desert solar plant need?"),
          [t("Панелларни чангдан тозалаш", "Очищать панели от пыли", "Cleaning dust off panels"), t("Кўмир ташиш", "Подвоз угля", "Delivering coal"), t("Совутиш учун кўп сув", "Много воды на охлаждение", "Lots of cooling water")], 0,
          t("Чанг ёруғликни тўсади.", "Пыль закрывает свет.", "Dust blocks the light."))
      ],
      task: t("Кичик қуёш панели ёки калькулятор панелини турли бурчакда қуёшга қаратиб, қайси ҳолатда кўпроқ ишлашини текширинг.", "Поверните маленькую солнечную панель (или панель калькулятора) под разными углами и проверьте, когда она работает лучше.", "Tilt a small solar panel (or a calculator cell) at different angles and test when it works best.") },
    /* ---------- Янги видеолар (2026-10-17): рус ва инглиз тилида ---------- */
    { id: "v-rgo-aral-ru", yt: "xpDzVP0N9VQ", top: "orol", st: "", lng: "ru", ch: "Русское географическое общество", orig: "Фильм РГО: Страсти по Аралу | @Русское географическое общество", ck: "2026-10-17",
      t: t("«Орол ҳасрати» — РГЖ ҳужжатли фильми", "«Страсти по Аралу» — фильм РГО", "“Passions of the Aral” — an RGS documentary"),
      sum: t("Рус география жамияти фильми Орол денгизининг ўтмиши, қуриши ва бугунги Оролбўйи ҳаётини кўрсатади.", "Фильм Русского географического общества о прошлом Аральского моря, его высыхании и сегодняшней жизни Приаралья.", "A Russian Geographical Society film on the Aral Sea’s past, its drying and life in the Aral region today."),
      pre: t("Фильмни кўришдан олдин: Орол фожиасида ким ёки нима айбдор деб ўйлайсиз?", "До просмотра: кто или что, по-вашему, виноват в трагедии Арала?", "Before watching: who or what do you think is to blame for the Aral disaster?"),
      k: [
        t("1960-йилларда суғориладиган ерлар кескин кенгайтирилиб, Амударё ва Сирдарё суви денгизга етмай қолди.", "В 1960-е резко расширили орошаемые земли, и вода Амударьи и Сырдарьи перестала доходить до моря.", "In the 1960s irrigated land expanded sharply and Amu Darya and Syr Darya water stopped reaching the sea."),
        t("Денгиз ҳажмининг 90% га яқини йўқолди, шўрлик бир неча баравар ошиб, маҳаллий балиқ турлари йўқолди.", "Море потеряло около 90% объёма, солёность выросла в разы, местные виды рыб исчезли.", "The sea lost about 90% of its volume, salinity rose several-fold and native fish vanished."),
        t("Оролбўйи аҳолиси учун оқибатлар бугун ҳам давом этмоқда: соғлиқ, иш ва миграция муаммолари.", "Последствия для жителей Приаралья продолжаются: здоровье, работа, миграция.", "Consequences for Aral residents continue today: health, jobs and migration.")
      ],
      q: [
        q(t("Орол ҳажмининг тахминан қанча қисми йўқолди?", "Какую часть объёма потерял Арал?", "About how much of its volume has the Aral lost?"),
          [t("≈90%", "≈90%", "≈90%"), t("≈10%", "≈10%", "≈10%"), t("≈30%", "≈30%", "≈30%")], 0,
          t("Майдони эса 1960 йилга нисбатан тахминан 10 баравар кичрайди.", "Площадь сократилась примерно в 10 раз к уровню 1960 года.", "Its area shrank roughly tenfold from 1960.")),
        q(t("Нима учун маҳаллий балиқлар йўқолди?", "Почему исчезли местные рыбы?", "Why did native fish disappear?"),
          [t("Сув жуда шўрланиб кетди", "Вода стала слишком солёной", "The water became too salty"), t("Сув жуда совиб кетди", "Вода слишком остыла", "The water got too cold"), t("Уларни қушлар еб битирди", "Их съели птицы", "Birds ate them all")], 0,
          t("Шўрлик чучук сув балиқлари чидамлилик чегарасидан ошиб кетди.", "Солёность превысила предел выносливости пресноводных рыб.", "Salinity exceeded freshwater fish tolerance."))
      ],
      task: t("Фильмдан 3 та фактни ёзиб, уларни Орол ҳақидаги бошқа манба (масалан, NASA сунъий йўлдош суратлари) билан текширинг.", "Выпишите 3 факта из фильма и проверьте их по другому источнику (например, снимкам NASA).", "Note 3 facts from the film and check them against another source (e.g. NASA satellite images).") },

    { id: "v-aral1963-ru", yt: "Q5SnoR5Ddes", top: "orol", st: "", lng: "ru", ch: "Майя Бекбаева", orig: "Когда жило Аральское море. Документальный фильм, 1963 г. Казахфильм", ck: "2026-10-17",
      t: t("Орол тирик пайтида: 1963 йилги ҳужжатли фильм", "Когда жило Аральское море: фильм 1963 года", "When the Aral Sea was alive: a 1963 documentary"),
      sum: t("«Қозоғистонфильм»нинг 1963 йилги ҳужжатли фильми — Орол ҳали тўла, балиқчилик ва кемачилик гуллаган даврнинг ноёб тарихий гувоҳи.", "Документальный фильм «Казахфильма» 1963 года — редкое свидетельство эпохи, когда Арал был полноводен, а рыболовство и судоходство процветали.", "A 1963 Kazakhfilm documentary — a rare record of the time when the Aral was full and fishing and shipping thrived."),
      pre: t("1963 ва бугунги Оролни солиштириш учун фильмда нималарга эътибор берасиз?", "На что обратить внимание в фильме, чтобы сравнить Арал 1963 года и сегодняшний?", "What will you look for in the film to compare the Aral of 1963 with today?"),
      k: [
        t("1960-йиллар бошида Оролда йилига ўн минглаб тонна балиқ овланган.", "В начале 1960-х на Арале вылавливали десятки тысяч тонн рыбы в год.", "In the early 1960s tens of thousands of tonnes of fish were caught on the Aral each year."),
        t("Орол атрофдаги иқлимни юмшатган: ёзни салқинроқ, қишни илиқроқ қилган.", "Арал смягчал климат региона: летом было прохладнее, зимой теплее.", "The Aral moderated the regional climate: cooler summers, milder winters."),
        t("Тарихий фильмлар ўзгаришни «олдин ва кейин» таққослаш орқали кўришга ёрдам беради.", "Исторические фильмы помогают увидеть перемены через сравнение «до и после».", "Historical films help us see change through “before and after” comparison.")
      ],
      q: [
        q(t("Катта сув ҳавзаси иқлимга қандай таъсир қилади?", "Как большой водоём влияет на климат?", "How does a large body of water affect climate?"),
          [t("Ҳароратни юмшатади", "Смягчает температуру", "It moderates temperature"), t("Ҳароратни кескинлаштиради", "Делает её резче", "It makes it more extreme"), t("Таъсир қилмайди", "Не влияет", "No effect")], 0,
          t("Сув секин исийди ва секин совийди.", "Вода медленно нагревается и медленно остывает.", "Water heats and cools slowly.")),
        q(t("1963 йилда Орол қандай эди?", "Каким был Арал в 1963 году?", "What was the Aral like in 1963?"),
          [t("Тўла, балиқчилик ривожланган", "Полноводным, с развитым рыболовством", "Full, with thriving fisheries"), t("Аллақачон қуриган", "Уже высохшим", "Already dry"), t("Муз билан қопланган", "Покрытым льдом", "Covered in ice")], 0,
          t("Кескин қисқариш 1960-йиллар ўрталаридан бошланган.", "Резкое падение началось с середины 1960-х.", "The sharp decline began in the mid-1960s."))
      ],
      task: t("Фильмдан 2 та кадр танлаб, уларни бугунги Мўйноқ ёки Арал (Қозоғистон) шаҳри суратлари билан «олдин–кейин» коллажига жойланг.", "Выберите 2 кадра из фильма и составьте коллаж «до–после» со снимками сегодняшнего Муйнака или Аральска.", "Pick 2 frames from the film and make a before/after collage with photos of Muynak or Aralsk today.") },

    { id: "v-klimatkurs-ru", yt: "7HWESh7Wrvc", top: "iqlim", st: "u", lng: "ru", ch: "ПостНаука", orig: "Изменение климата — курс на ПостНауке", ck: "2026-10-17",
      t: t("Иқлим ўзгариши — ПостНаука курси", "Изменение климата — курс ПостНауки", "Climate change — a PostNauka course"),
      sum: t("Олимлар курси иқлим тизими қандай ишлаши, ўтмишдаги иқлим ўзгаришлари ва ҳозирги исишнинг инсон фаолияти билан боғлиқлигини тушунтиради.", "Курс учёных объясняет, как устроена климатическая система, как менялся климат в прошлом и почему нынешнее потепление связано с человеком.", "A course by scientists explaining how the climate system works, past climate changes and why today’s warming is linked to humans."),
      pre: t("Ер иқлими ўтмишда ҳам ўзгарган бўлса, ҳозирги ўзгариш нима билан фарқ қилади?", "Если климат Земли менялся и раньше, чем отличается нынешнее изменение?", "If Earth’s climate changed before, how is today’s change different?"),
      k: [
        t("Иқлим тизими: атмосфера, океан, музликлар (криосфера), қуруқлик ва биосфера ўзаро таъсирда.", "Климатическая система: атмосфера, океан, криосфера, суша и биосфера во взаимодействии.", "The climate system: atmosphere, ocean, cryosphere, land and biosphere interacting."),
        t("Ўтмишдаги ўзгаришлар минг йиллар давомида рўй берган; ҳозирги исиш эса бир неча ўн йилликда тез кечмоқда.", "Прошлые изменения шли тысячелетиями; нынешнее потепление идёт за десятилетия.", "Past changes unfolded over millennia; today’s warming is happening within decades."),
        t("Музлик намуналари (керн) ўтмишдаги CO₂ ва ҳароратни 800 минг йил орқага тиклашга имкон беради.", "Ледовые керны позволяют восстановить CO₂ и температуру на 800 тыс. лет назад.", "Ice cores let us reconstruct CO₂ and temperature back 800,000 years.")
      ],
      q: [
        q(t("Ўтмишдаги иқлимни нима орқали билиб оламиз?", "Как мы узнаём о климате прошлого?", "How do we learn about past climates?"),
          [t("Музлик кернлари", "Ледовые керны", "Ice cores"), t("Об-ҳаво прогнози", "Прогноз погоды", "Weather forecasts"), t("Телефон GPS", "GPS телефона", "Phone GPS")], 0,
          t("Музда ўтмиш ҳавосининг пуфакчалари сақланган.", "Во льду сохранились пузырьки древнего воздуха.", "Ice traps bubbles of ancient air.")),
        q(t("Ҳозирги исишнинг ўзига хослиги нимада?", "В чём особенность нынешнего потепления?", "What is special about today’s warming?"),
          [t("У жуда тез ва инсон фаолияти билан боғлиқ", "Оно очень быстрое и связано с человеком", "It is very fast and human-caused"), t("У секин ва табиий", "Оно медленное и естественное", "It is slow and natural"), t("Ҳеч фарқи йўқ", "Ничем не отличается", "Nothing")], 0,
          t("IPCC: инсон таъсири «шубҳасиз».", "МГЭИК: влияние человека «однозначно».", "IPCC: human influence is “unequivocal”."))
      ],
      task: t("Курсдан битта маърузани кўриб, унинг асосий ғоясини 5 жумлада ёзинг ва битта савол тузинг.", "Посмотрите одну лекцию курса, изложите главную мысль в 5 предложениях и сформулируйте вопрос.", "Watch one lecture of the course, summarise its main idea in 5 sentences and write one question.") },

    { id: "v-3sabab-ru", yt: "wVMqI570ak8", top: "iqlim", st: "", lng: "ru", ch: "Телеканал 24kz", orig: "Три главные причины глобального потепления", ck: "2026-10-17",
      t: t("Глобал исишнинг уч асосий сабаби", "Три главные причины глобального потепления", "Three main causes of global warming"),
      sum: t("Қозоғистоннинг 24kz телеканали глобал исишнинг асосий сабаблари ҳақида гапиради. Илмий манбаларга кўра, асосий сабаблар инсон фаолиятидан чиқадиган иссиқхона газлари билан боғлиқ.", "Казахстанский телеканал 24kz рассказывает о главных причинах глобального потепления. По научным данным, они связаны с парниковыми газами от деятельности человека.", "Kazakhstan’s 24kz channel discusses the main causes of global warming. Scientific sources link them to greenhouse gases from human activity."),
      pre: t("Видеодан олдин ўзингиз 3 та сабабни тахмин қилиб ёзинг, кейин солиштиринг.", "До просмотра запишите свои 3 причины, потом сравните.", "Before watching, write your own 3 causes, then compare."),
      k: [
        t("Энергетика ва транспортда кўмир, нефть ва газ ёқиш — CO₂ нинг асосий манбаи.", "Сжигание угля, нефти и газа в энергетике и транспорте — главный источник CO₂.", "Burning coal, oil and gas for power and transport is the main CO₂ source."),
        t("Ўрмонларни кесиш CO₂ ютадиган «ўпка»ни йўқ қилади ва карбонни ҳавога чиқаради.", "Вырубка лесов уничтожает поглотители CO₂ и выпускает углерод в воздух.", "Deforestation removes CO₂ sinks and releases carbon."),
        t("Қишлоқ хўжалиги (чорва, шоли) ва чиқинди полигонлари кучли иссиқхона гази — метанни чиқаради.", "Сельское хозяйство (скот, рис) и свалки выделяют метан — мощный парниковый газ.", "Farming (livestock, rice) and landfills emit methane — a potent greenhouse gas.")
      ],
      q: [
        q(t("Қайси бири CO₂ нинг энг катта манбаи?", "Крупнейший источник CO₂?", "Largest source of CO₂?"),
          [t("Қазилма ёқилғиларни ёқиш", "Сжигание ископаемого топлива", "Burning fossil fuels"), t("Нафас олиш", "Дыхание людей", "Human breathing"), t("Кўллар", "Озёра", "Lakes")], 0,
          t("Улар инсон CO₂ чиқиндиларининг катта қисмини беради.", "Они дают бо́льшую часть антропогенного CO₂.", "They account for most human CO₂ emissions.")),
        q(t("Чорвачилик асосан қайси газни чиқаради?", "Какой газ в основном выделяет скот?", "Which gas does livestock mainly emit?"),
          [t("Метан", "Метан", "Methane"), t("Кислород", "Кислород", "Oxygen"), t("Неон", "Неон", "Neon")], 0,
          t("Метан CO₂ дан 20 йиллик даврда 80 баравар кучли.", "За 20 лет метан примерно в 80 раз сильнее CO₂.", "Over 20 years methane is about 80 times stronger than CO₂."))
      ],
      task: t("Учта сабабнинг ҳар бири учун Ўзбекистонда қўлланиши мумкин бўлган битта ечим ёзинг.", "Для каждой из трёх причин запишите одно решение, применимое в Узбекистане.", "For each of the three causes, write one solution that could work in Uzbekistan.") },

    { id: "v-pustyni-ru", yt: "zl-QWTAYEwo", top: "yer", st: "", lng: "ru", ch: "CGTN на русском", orig: "Как исчезают пустыни?", ck: "2026-10-17",
      t: t("Чўллар қандай чекинади?", "Как исчезают пустыни?", "How do deserts retreat?"),
      sum: t("CGTN сюжети қумни мустаҳкамлаш ва кўкаламзорлаштириш орқали чўлланишни тўхтатиш тажрибасини кўрсатади.", "Сюжет CGTN показывает опыт остановки опустынивания через закрепление песков и озеленение.", "A CGTN piece shows experience in halting desertification by fixing sand and planting vegetation."),
      pre: t("Чўлни «қайтариш» учун биринчи навбатда нима қилиш керак: дарахт экиш, сув олиб келиш ёки қумни тўхтатиш?", "Что сделать первым, чтобы «отодвинуть» пустыню: посадить деревья, привести воду или остановить песок?", "What comes first in pushing back a desert: planting trees, bringing water or stopping the sand?"),
      k: [
        t("Қумни тўхтатиш учун кўпинча похол ёки шох-шаббадан «катак» (шахмат тўри) ясалади, кейин чидамли ўсимликлар экилади.", "Для закрепления песка часто делают «клетки» из соломы или веток, затем сажают стойкие растения.", "Sand is often fixed with straw or brush checkerboards before hardy plants are sown."),
        t("Хитойнинг «Яшил девор» (Уч шимол ҳимоя ўрмони) дастури 1978 йилдан бери давом этмоқда.", "Китайская программа «Зелёной стены» (лесозащитный пояс «Три Севера») идёт с 1978 года.", "China’s “Green Wall” (Three-North Shelterbelt) programme has run since 1978."),
        t("Муваффақият учун маҳаллий, сувни кам талаб қиладиган турлар ва ўтлатишни назорат қилиш зарур.", "Для успеха нужны местные засухоустойчивые виды и контроль выпаса.", "Success needs local drought-hardy species and grazing control.")
      ],
      q: [
        q(t("Қумни мустаҳкамлашнинг оддий усули қайси?", "Простой способ закрепить песок?", "A simple way to fix sand?"),
          [t("Похол катаклари ва чидамли ўсимликлар", "Соломенные клетки и стойкие растения", "Straw checkerboards and hardy plants"), t("Қумни асфальт билан қоплаш", "Залить песок асфальтом", "Paving the sand"), t("Барча ўсимликларни олиб ташлаш", "Убрать все растения", "Removing all plants")], 0,
          t("Катаклар шамолни сусайтиради, ўсимликлар илдиз отишга улгуради.", "Клетки гасят ветер, растения успевают укорениться.", "Checkerboards slow the wind so plants can take root.")),
        q(t("Чўлга дарахт экишда нима муҳим?", "Что важно при посадках в пустыне?", "What matters when planting in deserts?"),
          [t("Маҳаллий қурғоқчиликка чидамли турлар", "Местные засухоустойчивые виды", "Local drought-tolerant species"), t("Кўп сув талаб қиладиган турлар", "Влаголюбивые виды", "Thirsty species"), t("Фақат мевали дарахтлар", "Только плодовые деревья", "Only fruit trees")], 0,
          t("Нотўғри тур ер ости сувини тугатиши мумкин.", "Неподходящие виды могут истощить грунтовые воды.", "The wrong species can drain groundwater."))
      ],
      task: t("Қум, похол ва фен (шамол) билан модел ясаб, катаклар қумнинг учишини қанчалик камайтиришини синаб кўринг.", "Сделайте модель из песка, соломы и фена и проверьте, насколько «клетки» уменьшают вынос песка.", "Build a model with sand, straw and a hair dryer to test how much checkerboards reduce blowing sand.") },

    { id: "v-krugovorot-ru", yt: "tjJcZdu3aEY", top: "suv", st: "m", lng: "ru", ch: "Умные Пластилинки", orig: "Про круговорот воды в природе. Познавательный мультик", ck: "2026-10-17",
      t: t("Табиатда сувнинг айланиши — мультфильм", "Круговорот воды в природе — мультфильм", "The water cycle — a cartoon"),
      sum: t("Пластилин мультфильм болаларга сув айланишини тушунтиради: буғланиш, конденсация, ёғин ва сувнинг дарё ҳамда денгизга қайтиши.", "Пластилиновый мультфильм объясняет детям круговорот воды: испарение, конденсацию, осадки и возвращение воды в реки и моря.", "A clay-animation cartoon explains the water cycle to children: evaporation, condensation, precipitation and water returning to rivers and seas."),
      pre: t("Кўлмак қуриганда сув қаерга кетади?", "Куда девается вода, когда высыхает лужа?", "Where does the water go when a puddle dries up?"),
      k: [
        t("Қуёш иссиғи сувни буғлатади — сув буғи ҳавога кўтарилади.", "Солнце нагревает воду, и она испаряется — пар поднимается в воздух.", "The Sun heats water and it evaporates — vapour rises into the air."),
        t("Юқорида буғ совиб, томчиларга айланади ва булут ҳосил бўлади (конденсация).", "Наверху пар остывает, превращается в капли и образует облака (конденсация).", "Higher up the vapour cools into droplets and forms clouds (condensation)."),
        t("Томчилар оғирлашгач ёмғир ёки қор бўлиб ёғади ва дарё, кўл, ер ости орқали денгизга қайтади.", "Тяжёлые капли выпадают дождём или снегом и через реки, озёра и подземные воды возвращаются в море.", "Heavy drops fall as rain or snow and return to the sea via rivers, lakes and groundwater.")
      ],
      q: [
        q(t("Булут қандай ҳосил бўлади?", "Как образуется облако?", "How does a cloud form?"),
          [t("Сув буғи совиб томчиларга айланади", "Пар остывает и превращается в капли", "Vapour cools into droplets"), t("Шамол чангни йиғади", "Ветер собирает пыль", "Wind gathers dust"), t("Қуёш нурини ютади", "Поглощает солнечный свет", "It absorbs sunlight")], 0,
          t("Бу жараён конденсация дейилади.", "Этот процесс — конденсация.", "This process is condensation.")),
        q(t("Сув айланишини нима ҳаракатга келтиради?", "Что приводит в движение круговорот воды?", "What drives the water cycle?"),
          [t("Қуёш энергияси ва оғирлик кучи", "Энергия Солнца и сила тяжести", "Solar energy and gravity"), t("Ой нури", "Свет Луны", "Moonlight"), t("Инсонлар", "Люди", "People")], 0,
          t("Қуёш буғлатади, оғирлик кучи ёмғирни туширади.", "Солнце испаряет, тяжесть опускает дождь.", "The Sun evaporates; gravity brings rain down."))
      ],
      task: t("Шиша идишга иссиқ сув қуйиб, устини муз солинган ликопча билан ёпинг: «ёмғир» ҳосил бўлишини кузатинг ва расмини чизинг.", "Налейте в банку горячую воду и накройте тарелкой со льдом: понаблюдайте «дождь» и нарисуйте схему.", "Pour hot water into a jar and cover it with a plate of ice: watch the “rain” form and draw it.") },

    { id: "v-invaziv-en", yt: "spTWwqVP_2s", top: "bio", st: "", lng: "en", ch: "TED-Ed", orig: "The threat of invasive species - Jennifer Klos", ck: "2026-10-17",
      t: t("Инвазив турлар хавфи", "Угроза инвазивных видов", "The threat of invasive species"),
      sum: t("TED-Ed дарси инвазив (бегона) турлар нима эканини ва улар янги жойда табиий душмани йўқлиги учун қандай тез кўпайиб, маҳаллий турларни сиқиб чиқаришини тушунтиради.", "Урок TED-Ed объясняет, что такое инвазивные виды и как они, не имея врагов на новом месте, быстро размножаются и вытесняют местные виды.", "A TED-Ed lesson explaining what invasive species are and how, lacking natural enemies in a new place, they spread fast and push out native species."),
      pre: t("Бошқа қитъадан келтирилган ҳайвон янги жойда нега жуда кўпайиб кетиши мумкин?", "Почему завезённое с другого континента животное может сильно размножиться?", "Why might an animal brought from another continent multiply out of control?"),
      k: [
        t("Инвазив тур — инсон томонидан янги ҳудудга олиб келинган ва у ерда зарар келтираётган тур.", "Инвазивный вид — занесённый человеком в новый регион и наносящий там вред.", "An invasive species is one introduced by humans to a new area where it causes harm."),
        t("Янги жойда йиртқич, касаллик ва рақобатчи бўлмагани учун у тез кўпаяди.", "На новом месте нет хищников, болезней и конкурентов, поэтому он быстро размножается.", "With no predators, diseases or competitors in the new place, it multiplies quickly."),
        t("Энг яхши ҳимоя — олдини олиш: юк, кема ва саёҳатчилар орқали тасодифий олиб киришни назорат қилиш.", "Лучшая защита — профилактика: контроль случайного завоза с грузами, судами и туристами.", "The best defence is prevention: controlling accidental transport via cargo, ships and travellers.")
      ],
      q: [
        q(t("Инвазив тур нега тез тарқалади?", "Почему инвазивный вид быстро распространяется?", "Why does an invasive species spread fast?"),
          [t("Янги жойда табиий душмани йўқ", "На новом месте нет естественных врагов", "No natural enemies in the new place"), t("У жуда секин кўпаяди", "Он медленно размножается", "It breeds slowly"), t("Уни ҳамма ейди", "Его все едят", "Everything eats it")], 0,
          t("Масалан, Австралиядаги қамиш қурбақаси (ага).", "Например, жаба-ага в Австралии.", "For example, the cane toad in Australia.")),
        q(t("Инвазив турларга қарши энг арзон усул?", "Самый дешёвый способ борьбы с инвазивными видами?", "The cheapest approach to invasive species?"),
          [t("Олдини олиш", "Профилактика", "Prevention"), t("Кейинчалик йўқ қилиш", "Уничтожение потом", "Eradication later"), t("Эътибор бермаслик", "Игнорирование", "Ignoring them")], 0,
          t("Тарқалгандан кейин йўқ қилиш жуда қиммат ва қийин.", "После распространения уничтожить очень дорого и трудно.", "Eradication after spread is very costly and hard."))
      ],
      task: t("Ўзбекистонда учрайдиган битта бегона турни (масалан, оқ амур, амброзия ёки майна) ўрганиб, унинг келиб чиқиши ва таъсирини ёзинг.", "Изучите один чужеродный вид в Узбекистане (например, белый амур, амброзия или майна) и опишите происхождение и влияние.", "Research one alien species in Uzbekistan (e.g. grass carp, ragweed or the common myna) and describe its origin and impact.") },

    { id: "v-detrit-en", yt: "KI7u_pcfAQE", top: "asos", st: "", lng: "en", ch: "TED-Ed", orig: "Dead stuff: The secret ingredient in our food chain - John C. Moore", ck: "2026-10-17",
      t: t("Ўлик органика — озиқ занжирининг яширин таркиби", "Мёртвая органика — секретный ингредиент пищевой цепи", "Dead stuff: the secret ingredient in our food chain"),
      sum: t("TED-Ed дарси детрит (ўлик органик модда) ва уни парчаловчи организмлар озиқ занжирида қандай муҳим ўрин тутишини кўрсатади: ўлим — моддалар айланишининг бошланиши.", "Урок TED-Ed показывает роль детрита (мёртвой органики) и разлагающих его организмов в пищевой цепи: смерть — начало круговорота веществ.", "A TED-Ed lesson on detritus (dead organic matter) and the decomposers that process it: death is where nutrient cycling begins."),
      pre: t("Ўрмондаги барг ва ўлик ҳайвонлар нега «тўпланиб» қолмайди?", "Почему листья и мёртвые животные в лесу не накапливаются горами?", "Why don’t dead leaves and animals pile up forever in a forest?"),
      k: [
        t("Детрит — ўлик ўсимлик, ҳайвон қолдиқлари ва ахлат; у бактерия, замбуруғ ва ёмғир чувалчанглари учун озиқ.", "Детрит — мёртвые остатки растений и животных, экскременты; это пища для бактерий, грибов и червей.", "Detritus is dead plant and animal remains and waste; it feeds bacteria, fungi and earthworms."),
        t("Парчаловчилар озиқ моддаларни (азот, фосфор) тупроққа қайтаради, ўсимликлар уларни яна ишлатади.", "Редуценты возвращают в почву азот и фосфор, и растения используют их вновь.", "Decomposers return nutrients (nitrogen, phosphorus) to the soil for plants to reuse."),
        t("Детрит асосидаги «қўнғир» озиқ тармоғи яшил ўсимликлар асосидаги «яшил» тармоқ билан боғланган.", "«Бурая» пищевая сеть на основе детрита связана с «зелёной», основанной на растениях.", "The detritus-based “brown” food web links to the plant-based “green” web.")
      ],
      q: [
        q(t("Детритни ким парчалайди?", "Кто разлагает детрит?", "Who breaks down detritus?"),
          [t("Бактерия ва замбуруғлар", "Бактерии и грибы", "Bacteria and fungi"), t("Бургутлар", "Орлы", "Eagles"), t("Қуёш панеллари", "Солнечные панели", "Solar panels")], 0,
          t("Улар редуцентлар дейилади.", "Их называют редуцентами.", "They are called decomposers.")),
        q(t("Парчаловчилар бўлмаса нима бўларди?", "Что было бы без редуцентов?", "What would happen without decomposers?"),
          [t("Озиқ моддалар тупроққа қайтмасди", "Питательные вещества не возвращались бы в почву", "Nutrients would not return to the soil"), t("Ўсимликлар тезроқ ўсарди", "Растения росли бы быстрее", "Plants would grow faster"), t("Ҳеч нарса ўзгармасди", "Ничего бы не изменилось", "Nothing would change")], 0,
          t("Моддалар айланиши тўхтаб қоларди.", "Круговорот веществ бы остановился.", "Nutrient cycling would stop."))
      ],
      task: t("Компост идиши ясанг: озиқ-овқат қолдиқлари ва қуруқ баргни аралаштириб, 4 ҳафта давомида ўзгаришни кузатинг.", "Сделайте компостер: смешайте пищевые очистки и сухие листья и 4 недели наблюдайте изменения.", "Start a compost bin: mix food scraps and dry leaves and observe changes for 4 weeks.") },

    { id: "v-feedback-en", yt: "inVZoI1AkC8", top: "asos", st: "u", lng: "en", ch: "TED-Ed", orig: "Feedback loops: How nature gets its rhythms - Anje-Margriet Neutel", ck: "2026-10-17",
      t: t("Тескари алоқа ҳалқалари: табиат ритми", "Петли обратной связи: ритмы природы", "Feedback loops: how nature gets its rhythms"),
      sum: t("TED-Ed дарси экотизимлардаги тескари алоқа ҳалқаларини тушунтиради: йиртқич ва ўлжа сонининг даврий тебраниши ва барқарорликнинг сири.", "Урок TED-Ed объясняет петли обратной связи в экосистемах: циклические колебания численности хищника и жертвы и секрет устойчивости.", "A TED-Ed lesson explaining feedback loops in ecosystems: predator–prey population cycles and the secret of stability."),
      pre: t("Қуёнлар кўпайса, тулкилар сони нима бўлади? Кейин қуёнлар-чи?", "Если зайцев станет больше, что будет с лисами? А потом с зайцами?", "If hares increase, what happens to foxes? And then to hares?"),
      k: [
        t("Манфий (баланслаштирувчи) тескари алоқа тизимни мувозанатда ушлайди: ўлжа кўпайса — йиртқич кўпаяди — ўлжа камаяди.", "Отрицательная (балансирующая) обратная связь держит систему в равновесии: жертв больше — хищников больше — жертв меньше.", "Negative (balancing) feedback keeps a system in balance: more prey → more predators → fewer prey."),
        t("Мусбат (кучайтирувчи) тескари алоқа ўзгаришни кучайтиради — масалан, муз эриши → Ер кўпроқ иссиқлик ютади → яна эриш.", "Положительная (усиливающая) связь усиливает изменения — например, таяние льда → Земля поглощает больше тепла → таяние сильнее.", "Positive (reinforcing) feedback amplifies change — e.g. ice melts → Earth absorbs more heat → more melting."),
        t("Йиртқич–ўлжа сони кечикиш билан даврий тебранади (Лотка–Вольтерра модели).", "Численности хищника и жертвы колеблются с запаздыванием (модель Лотки–Вольтерры).", "Predator and prey numbers oscillate with a lag (the Lotka–Volterra model).")
      ],
      q: [
        q(t("Қайси мисол мусбат тескари алоқа?", "Какой пример — положительная обратная связь?", "Which is an example of positive feedback?"),
          [t("Муз эриши → кўпроқ иссиқлик ютилиши → яна эриш", "Таяние льда → больше поглощения тепла → ещё таяние", "Ice melt → more heat absorbed → more melt"), t("Ўлжа кўпайса йиртқич кўпайиб, ўлжани камайтиради", "Больше жертв → больше хищников → меньше жертв", "More prey → more predators → fewer prey"), t("Термостат иситишни ўчиради", "Термостат выключает отопление", "A thermostat switching off heating")], 0,
          t("Мусбат алоқа ўзгаришни кучайтиради.", "Положительная связь усиливает изменения.", "Positive feedback amplifies change.")),
        q(t("Йиртқич сони ўлжа сонига нисбатан қандай ўзгаради?", "Как меняется численность хищника относительно жертвы?", "How do predator numbers change relative to prey?"),
          [t("Кечикиш билан ортидан эргашади", "Следует с запаздыванием", "They follow with a lag"), t("Ҳар доим тенг", "Всегда равна", "They are always equal"), t("Ҳеч боғлиқ эмас", "Не связана", "They are unrelated")], 0,
          t("Классик мисол — Канададаги силовсин ва қуён маълумотлари.", "Классика — данные о рыси и зайце в Канаде.", "The classic case is lynx and hare records from Canada."))
      ],
      task: t("Қуён ва тулки сони ўзгаришининг 10 йиллик тахминий графигини чизиб, ҳар бир чўққининг сабабини изоҳланг.", "Нарисуйте примерный график численности зайцев и лис за 10 лет и объясните каждый пик.", "Sketch a 10-year graph of hare and fox numbers and explain each peak.") },

    { id: "v-rewild-en", yt: "t3I9gDocYdk", top: "bio", st: "", lng: "en", ch: "TED-Ed", orig: "From the top of the food chain down: Rewilding our world - George Monbiot", ck: "2026-10-17",
      t: t("Озиқ занжирининг тепасидан: табиатни ёввойилаштириш", "С вершины пищевой цепи: «ревайлдинг»", "From the top of the food chain down: rewilding"),
      sum: t("Жорж Монбио «ревайлдинг» — йирик йиртқичлар ва табиий жараёнларни қайтариш орқали экотизимни тиклаш ғоясини тушунтиради. Йеллоустондаги бўрилар машҳур мисол.", "Джордж Монбио объясняет «ревайлдинг» — восстановление экосистем через возвращение крупных хищников и природных процессов. Известный пример — волки Йеллоустона.", "George Monbiot explains rewilding — restoring ecosystems by bringing back large predators and natural processes. The famous example is Yellowstone’s wolves."),
      pre: t("Бўриларнинг қайтиши дарёларнинг шаклини ўзгартириши мумкинми? Нега?", "Может ли возвращение волков изменить форму рек? Почему?", "Could bringing back wolves change the shape of rivers? Why?"),
      k: [
        t("Трофик каскад: йиртқич ўлжанинг сони ва хулқини ўзгартиради, бу эса ўсимлик ва ландшафтга таъсир қилади.", "Трофический каскад: хищник меняет численность и поведение жертв, а это влияет на растения и ландшафт.", "Trophic cascade: a predator changes prey numbers and behaviour, which affects plants and landscape."),
        t("1995 йилда Йеллоустонга бўрилар қайтарилгач, буғулар айрим водийлардан қочиб, у ердаги ўсимликлар тиклана бошлади.", "После возвращения волков в Йеллоустон в 1995 году олени стали избегать некоторых долин, и растительность там начала восстанавливаться.", "After wolves returned to Yellowstone in 1995, elk avoided some valleys and vegetation there began to recover."),
        t("Олимлар каскаднинг кучини муҳокама қилишади: бошқа омиллар ҳам таъсир қилган.", "Учёные спорят о силе каскада: влияли и другие факторы.", "Scientists still debate how strong the cascade was: other factors also played a role.")
      ],
      q: [
        q(t("Трофик каскад нима?", "Что такое трофический каскад?", "What is a trophic cascade?"),
          [t("Йиртқичнинг таъсири озиқ занжири бўйлаб пастга тарқалиши", "Влияние хищника, распространяющееся вниз по пищевой цепи", "A predator’s effect rippling down the food chain"), t("Шаршара тури", "Вид водопада", "A type of waterfall"), t("Ўсимлик касаллиги", "Болезнь растений", "A plant disease")], 0,
          t("Йиртқич → ўтхўр → ўсимлик → тупроқ ва дарё қирғоғи.", "Хищник → травоядное → растения → почва и берега.", "Predator → herbivore → plants → soil and riverbanks.")),
        q(t("Бўрилар Йеллоустонга қачон қайтарилган?", "Когда волков вернули в Йеллоустон?", "When were wolves returned to Yellowstone?"),
          [t("1995 йилда", "В 1995 году", "In 1995"), t("1850 йилда", "В 1850 году", "In 1850"), t("2020 йилда", "В 2020 году", "In 2020")], 0,
          t("Улар Канададан келтирилган.", "Их привезли из Канады.", "They were brought from Canada."))
      ],
      task: t("Ўзбекистон учун ревайлдинг лойиҳасини ўйлаб топинг (масалан, Бухоро буғуси ёки жайронни қайтариш) ва унинг 3 та кутилган таъсирини ёзинг.", "Придумайте проект ревайлдинга для Узбекистана (например, возвращение бухарского оленя или джейрана) и опишите 3 ожидаемых эффекта.", "Design a rewilding project for Uzbekistan (e.g. bringing back Bukhara deer or goitered gazelle) and list 3 expected effects.") },

    { id: "v-yadro-en", yt: "EhAemz1v7dQ", top: "energ", st: "u", lng: "en", ch: "Kurzgesagt – In a Nutshell", orig: "Do we Need Nuclear Energy to Stop Climate Change?", ck: "2026-10-17",
      t: t("Иқлимни сақлаш учун атом энергияси керакми?", "Нужна ли атомная энергия для борьбы с изменением климата?", "Do we need nuclear energy to stop climate change?"),
      sum: t("Kurzgesagt атом энергиясининг афзаллик ва камчиликларини таҳлил қилади: кам углеродли ва барқарор, лекин қиммат, қурилиши узоқ ва радиоактив чиқинди муаммоси бор.", "Kurzgesagt разбирает плюсы и минусы атомной энергии: низкоуглеродная и стабильная, но дорогая, долго строится и оставляет радиоактивные отходы.", "Kurzgesagt weighs nuclear power’s pros and cons: low-carbon and steady, but costly, slow to build and with radioactive waste."),
      pre: t("Атом электр станцияси ҳақида биринчи хаёлингизга келган сўз қайси — «хавф» ёки «тоза энергия»?", "Какое слово первым приходит на ум про АЭС — «опасность» или «чистая энергия»?", "What word first comes to mind about nuclear plants — “danger” or “clean energy”?"),
      k: [
        t("Ҳаёт цикли бўйича атом энергияси CO₂ чиқиндиси шамол энергиясига яқин ва кўмирдан ўнлаб баравар кам.", "За жизненный цикл выбросы CO₂ атомной энергии близки к ветровой и в десятки раз ниже угольной.", "Over its life cycle nuclear power’s CO₂ is close to wind’s and dozens of times lower than coal’s."),
        t("Атом станцияси об-ҳавога боғлиқ бўлмай, кечаю кундуз барқарор энергия беради.", "АЭС даёт стабильную энергию днём и ночью, независимо от погоды.", "A nuclear plant provides steady power day and night, regardless of weather."),
        t("Камчиликлар: юқори нарх, қурилиш узоқ давом этиши, радиоактив чиқиндини узоқ муддат сақлаш.", "Минусы: высокая цена, долгое строительство, долгосрочное хранение радиоактивных отходов.", "Drawbacks: high cost, long construction times, long-term storage of radioactive waste.")
      ],
      q: [
        q(t("Атом энергиясининг асосий афзаллиги нима?", "Главное преимущество атомной энергии?", "Main advantage of nuclear power?"),
          [t("Кам CO₂ ва барқарор ишлаш", "Мало CO₂ и стабильная работа", "Low CO₂ and steady output"), t("Арзон ва тез қурилади", "Дёшево и быстро строится", "Cheap and quick to build"), t("Чиқинди йўқ", "Нет отходов", "No waste")], 0,
          t("Нарх ва қурилиш муддати — аксинча, заиф томонлари.", "Цена и сроки строительства — наоборот, слабые стороны.", "Cost and build time are actually weak points.")),
        q(t("Қайси муаммо атом энергиясига хос?", "Какая проблема характерна для атомной энергии?", "Which problem is specific to nuclear power?"),
          [t("Радиоактив чиқиндини сақлаш", "Хранение радиоактивных отходов", "Storing radioactive waste"), t("Кечаси ишламаслик", "Не работает ночью", "Not working at night"), t("Шамолга боғлиқлик", "Зависимость от ветра", "Dependence on wind")], 0,
          t("Баъзи чиқиндилар минг йиллар давомида хавфли.", "Некоторые отходы опасны тысячи лет.", "Some waste stays hazardous for thousands of years."))
      ],
      task: t("«Ўзбекистонга АЭС керакми?» мавзусида мунозара учун 3 та «тарафдор» ва 3 та «қарши» далил тайёрланг.", "Подготовьте для дебатов «Нужна ли Узбекистану АЭС?» по 3 аргумента «за» и «против».", "Prepare 3 arguments for and 3 against for a debate: “Does Uzbekistan need a nuclear plant?”") },

    { id: "v-dwchol-en", yt: "D6Kz_OcOgvE", top: "yer", st: "", lng: "en", ch: "DW Planet A", orig: "Can we stop the deserts from spreading?", ck: "2026-10-17",
      t: t("Чўлларнинг кенгайишини тўхтата оламизми?", "Можно ли остановить наступление пустынь?", "Can we stop the deserts from spreading?"),
      sum: t("DW Planet A чўлланиш — қуруқ ерларнинг инсон фаолияти ва иқлим туфайли деградацияси ва уни тўхтатиш усулларини, жумладан Африкадаги «Буюк яшил девор»ни кўриб чиқади.", "DW Planet A разбирает опустынивание — деградацию засушливых земель из-за человека и климата — и способы его остановить, включая «Великую зелёную стену» в Африке.", "DW Planet A examines desertification — the degradation of drylands by human activity and climate — and ways to stop it, including Africa’s Great Green Wall."),
      pre: t("Чўлланиш — бу чўлнинг ўз-ўзидан кенгайишими ёки ернинг бузилишими?", "Опустынивание — это само расширение пустыни или деградация земли?", "Is desertification deserts expanding on their own, or land being degraded?"),
      k: [
        t("БМТ чўлланишга қарши конвенцияси (UNCCD) бўйича чўлланиш — қуруқ ҳудудларда ер деградацияси.", "По Конвенции ООН по борьбе с опустыниванием (КБО), опустынивание — деградация земель в засушливых районах.", "Under the UNCCD, desertification means land degradation in drylands."),
        t("Сабаблар: ортиқча ўтлатиш, ўрмон кесиш, нотўғри суғориш, қурғоқчилик ва исиш.", "Причины: перевыпас, вырубка, неправильное орошение, засухи и потепление.", "Causes: overgrazing, deforestation, poor irrigation, drought and warming."),
        t("Ечимлар: ерни тиклаш, агроўрмончилик, «Буюк яшил девор» каби минтақавий лойиҳалар.", "Решения: восстановление земель, агролесоводство, региональные проекты вроде «Великой зелёной стены».", "Solutions: land restoration, agroforestry and regional projects like the Great Green Wall.")
      ],
      q: [
        q(t("UNCCD бўйича чўлланиш нима?", "Что такое опустынивание по КБО ООН?", "What is desertification per the UNCCD?"),
          [t("Қуруқ ҳудудларда ер деградацияси", "Деградация земель в засушливых районах", "Land degradation in drylands"), t("Қумнинг кўпайиши", "Рост количества песка", "More sand appearing"), t("Ёмғирнинг кўпайиши", "Рост осадков", "More rain")], 0,
          t("Унинг асосий сабаблари инсон фаолияти ва иқлим.", "Главные причины — деятельность человека и климат.", "Its main drivers are human activity and climate.")),
        q(t("«Буюк яшил девор» қайси қитъада?", "На каком континенте «Великая зелёная стена»?", "On which continent is the Great Green Wall?"),
          [t("Африка", "Африка", "Africa"), t("Европа", "Европа", "Europe"), t("Антарктида", "Антарктида", "Antarctica")], 0,
          t("У Сахел минтақаси бўйлаб Сенегалдан Жибутигача чўзилади.", "Она тянется через Сахель от Сенегала до Джибути.", "It runs across the Sahel from Senegal to Djibouti."))
      ],
      task: t("Ҳудудингиздаги бир ер участкасини (яйлов, дала ёки бўш ер) кузатиб, деградация белгиларини (эрозия, шўр доғлар, ўсимликсизлик) қайд қилинг.", "Осмотрите участок земли рядом (пастбище, поле, пустырь) и отметьте признаки деградации: эрозию, солевые пятна, голую почву.", "Survey a nearby plot (pasture, field or empty lot) and record signs of degradation: erosion, salt patches, bare soil.") },

    { id: "v-quyoshted-en", yt: "k8d5Pf7VIiU", top: "energ", st: "", lng: "en", ch: "TED-Ed", orig: "Why aren't we only using solar power? - Alexandros George Charalambides", ck: "2026-10-17",
      t: t("Нега фақат қуёш энергиясидан фойдаланмаймиз?", "Почему мы не используем только солнечную энергию?", "Why aren’t we only using solar power?"),
      sum: t("TED-Ed дарси қуёш энергиясининг улкан салоҳияти ва уни ягона манбага айлантиришга халақит берадиган омилларни — ўзгарувчанлик, самарадорлик ва энергия сақлаш муаммоларини тушунтиради.", "Урок TED-Ed объясняет огромный потенциал солнечной энергии и что мешает сделать её единственным источником — непостоянство, КПД и хранение энергии.", "A TED-Ed lesson on solar power’s huge potential and what stops it being our only source — variability, efficiency and energy storage."),
      pre: t("Агар Ерга бир соатда тушадиган қуёш энергияси бутун дунёга бир йилга етса, нега биз ҳали ҳам кўмир ёқамиз?", "Если солнечной энергии, падающей на Землю за час, хватило бы миру на год, почему мы всё ещё жжём уголь?", "If an hour of sunlight on Earth could power the world for a year, why do we still burn coal?"),
      k: [
        t("Ерга тушадиган қуёш энергияси инсоният эҳтиёжидан минглаб баравар кўп.", "Солнечной энергии на Землю приходит в тысячи раз больше, чем нужно человечеству.", "The solar energy reaching Earth is thousands of times greater than humanity’s needs."),
        t("Тижорат панеллари қуёш нурининг тахминан 15–22 фоизини электрга айлантиради.", "Коммерческие панели превращают в электричество примерно 15–22% солнечного света.", "Commercial panels convert roughly 15–22% of sunlight into electricity."),
        t("Тун, булут ва мавсумлар туфайли энергия сақлаш ва тармоқларни боғлаш зарур.", "Из-за ночи, облаков и сезонов нужны накопители и объединение сетей.", "Night, clouds and seasons mean storage and connected grids are needed.")
      ],
      q: [
        q(t("Тижорат қуёш панелларининг самарадорлиги тахминан қанча?", "Каков КПД коммерческих солнечных панелей?", "Typical efficiency of commercial solar panels?"),
          [t("15–22%", "15–22%", "15–22%"), t("90–100%", "90–100%", "90–100%"), t("1–2%", "1–2%", "1–2%")], 0,
          t("Лаборатория рекордлари юқорироқ, лекин нархи баланд.", "Лабораторные рекорды выше, но дороже.", "Lab records are higher but costlier.")),
        q(t("Қуёш энергиясининг асосий техник муаммоси?", "Главная техническая проблема солнечной энергии?", "Main technical challenge of solar power?"),
          [t("Энергияни сақлаш (кечаси учун)", "Хранение энергии (на ночь)", "Storing energy (for night)"), t("Қуёш тугаб қолиши", "Солнце закончится", "The Sun running out"), t("Кўп CO₂ чиқариши", "Много CO₂", "High CO₂ emissions")], 0,
          t("Аккумуляторлар тез арзонлашмоқда.", "Аккумуляторы быстро дешевеют.", "Batteries are getting cheaper fast."))
      ],
      task: t("Уйингиз бир кунда қанча электр (кВт·соат) ишлатишини ҳисоблагичдан аниқлаб, уни қоплаш учун нечта 400 Вт ли панел кераклигини ҳисобланг (кунига 5 соат қуёш).", "По счётчику узнайте суточное потребление дома (кВт·ч) и посчитайте, сколько панелей по 400 Вт нужно (5 солнечных часов в день).", "Read your home’s daily use (kWh) from the meter and calculate how many 400 W panels would cover it (5 sun-hours a day).") },

    { id: "v-100vie-en", yt: "rQVGI9fZYqU", top: "energ", st: "u", lng: "en", ch: "TED Podcasts", orig: "Can 100% renewable energy power the world? | TED Climate", ck: "2026-10-17",
      t: t("100% қайта тикланувчи энергия дунёни таъминлай оладими?", "Может ли мир жить на 100% возобновляемой энергии?", "Can 100% renewable energy power the world?"),
      sum: t("TED Climate эпизоди дунёни тўлиқ қайта тикланувчи энергияга ўтказиш мумкинлиги ва бунинг учун зарур шартларни — электрлаштириш, энергия сақлаш ва тармоқларни муҳокама қилади.", "Эпизод TED Climate обсуждает, возможно ли перевести мир полностью на ВИЭ и что для этого нужно — электрификация, накопители, сети.", "A TED Climate episode on whether the world can run fully on renewables and what it takes — electrification, storage and grids."),
      pre: t("Энергиянинг қайси соҳасини (электр, транспорт, иситиш, саноат) қайта тикланувчига ўтказиш энг қийин деб ўйлайсиз?", "Какую сферу (электричество, транспорт, отопление, промышленность) труднее всего перевести на ВИЭ?", "Which sector (power, transport, heating, industry) do you think is hardest to switch to renewables?"),
      k: [
        t("Электр соҳасини қуёш, шамол ва сув билан таъминлаш нисбатан осон; транспорт ва иситишни аввал электрлаштириш керак.", "Электроэнергетику проще перевести на солнце, ветер и воду; транспорт и отопление нужно сначала электрифицировать.", "Power is the easiest to supply with sun, wind and water; transport and heating must be electrified first."),
        t("Пўлат, цемент ва авиация каби «қийин» соҳалар учун водород ва янги технологиялар керак.", "Для «трудных» отраслей — сталь, цемент, авиация — нужны водород и новые технологии.", "Hard sectors like steel, cement and aviation need hydrogen and new technologies."),
        t("Тизим барқарорлиги учун энергия сақлаш, кенг тармоқ ва талабни бошқариш зарур.", "Для устойчивости системы нужны накопители, широкие сети и управление спросом.", "System reliability needs storage, wide grids and demand management.")
      ],
      q: [
        q(t("Қайси соҳани қайта тикланувчига ўтказиш энг осон?", "Какую сферу проще всего перевести на ВИЭ?", "Which sector is easiest to switch to renewables?"),
          [t("Электр ишлаб чиқариш", "Производство электроэнергии", "Electricity generation"), t("Авиация", "Авиация", "Aviation"), t("Цемент саноати", "Цементная промышленность", "Cement industry")], 0,
          t("Қуёш ва шамол бевосита электр беради.", "Солнце и ветер напрямую дают электричество.", "Sun and wind produce electricity directly.")),
        q(t("Электрлаштириш нима?", "Что такое электрификация?", "What is electrification?"),
          [t("Ёқилғи ёқадиган қурилмаларни электр билан ишлайдиганларга алмаштириш", "Замена устройств на топливе электрическими", "Replacing fuel-burning devices with electric ones"), t("Кўпроқ кўмир станциялари қуриш", "Строить больше угольных станций", "Building more coal plants"), t("Электрни ўчириш", "Отключать свет", "Switching power off")], 0,
          t("Масалан, электромобиль ва иссиқлик насоси.", "Например, электромобиль и тепловой насос.", "For example, electric cars and heat pumps."))
      ],
      task: t("Уйингиздаги ёқилғи ёқадиган 3 та қурилмани топиб, ҳар бирининг электр ўриндошини ёзинг.", "Найдите дома 3 устройства на топливе и запишите для каждого электрическую замену.", "Find 3 fuel-burning devices at home and write an electric alternative for each.") },

    /* ---------- Тупроқ, сув ва ҳаво таҳлили (2026-10-17 oEmbed орқали текширилди) ---------- */
    { id: "v-winkler-carolina", yt: "FKdzbgHaQQM", top: "tahlil", st: "m", lng: "en", ch: "Carolina Science", orig: "The Winkler Method", ck: "2026-10-17",
      t: t("Винклер усули: эриган кислородни аниқлаш", "Метод Винклера: определение растворённого кислорода", "The Winkler method for dissolved oxygen"),
      sum: t("Видеода сув намунасидаги эриган кислородни Винклер усулида — кислородни марганец билан боғлаб, сўнг йодометрик титрлаш орқали аниқлаш кўрсатилади.", "В видео показано, как определить растворённый кислород в пробе воды методом Винклера: кислород фиксируют марганцем, а затем титруют йодометрически.", "The video shows how dissolved oxygen in a water sample is determined by the Winkler method: oxygen is fixed with manganese and then measured by iodometric titration."),
      pre: t("Нима учун кислородни намуна олинган жойнинг ўзида «боғлаб» қўйиш керак?", "Почему кислород нужно «зафиксировать» сразу на месте отбора пробы?", "Why must the oxygen be «fixed» right where the sample is taken?"),
      k: [ t("Mn(II) ишқорий йодид–азид муҳитида O₂ билан MnO(OH)₂ ҳосил қилади; кислоталанганда кислородга эквивалент миқдорда I₂ ажралади.", "Mn(II) в щелочной иодид-азидной среде связывает O₂ в MnO(OH)₂; при подкислении выделяется I₂ в количестве, эквивалентном кислороду.", "In alkaline iodide–azide medium Mn(II) binds O₂ as MnO(OH)₂; on acidification I₂ is released in an amount equivalent to the oxygen."),
           t("Ажралган йод натрий тиосульфат билан крахмал индикатори иштирокида титрланади: 1 моль O₂ ≡ 4 моль S₂O₃²⁻.", "Выделившийся йод титруют тиосульфатом натрия с крахмалом: 1 моль O₂ ≡ 4 моль S₂O₃²⁻.", "The liberated iodine is titrated with sodium thiosulfate using starch: 1 mol O₂ ≡ 4 mol S₂O₃²⁻."),
           t("20 °C да тоза чучук сувда кислород эрувчанлиги тахминан 9 мг/л; 5 мг/л дан пасайиши кўпчилик балиқлар учун хавфли.", "При 20 °C растворимость кислорода в пресной воде около 9 мг/л; снижение ниже 5 мг/л опасно для большинства рыб.", "At 20 °C oxygen solubility in fresh water is about 9 mg/L; levels below 5 mg/L stress most fish.") ],
      q: [
        q(t("Винклер усулида ажралган йод нима билан титрланади?", "Чем титруют выделившийся йод в методе Винклера?", "What is the liberated iodine titrated with in the Winkler method?"), [t("Натрий гидроксид", "Гидроксид натрия", "Sodium hydroxide"), t("Натрий тиосульфат", "Тиосульфат натрия", "Sodium thiosulfate"), t("ЭДТА", "ЭДТА", "EDTA")], 1, t("I₂ тиосульфат билан I⁻ гача қайтарилади; охирги нуқта крахмалнинг кўк ранги йўқолиши билан аниқланади.", "I₂ восстанавливается тиосульфатом до I⁻; конечная точка — исчезновение синей окраски крахмала.", "I₂ is reduced to I⁻ by thiosulfate; the end point is the disappearance of the blue starch colour.")),
        q(t("Сув иситилганда эриган кислород миқдори қандай ўзгаради?", "Как меняется содержание растворённого кислорода при нагревании воды?", "How does dissolved oxygen change when water warms up?"), [t("Камаяди", "Уменьшается", "It decreases"), t("Ортади", "Увеличивается", "It increases"), t("Ўзгармайди", "Не меняется", "It stays the same")], 0, t("Газларнинг сувда эрувчанлиги ҳарорат кўтарилиши билан камаяди.", "Растворимость газов в воде падает с ростом температуры.", "Gas solubility in water falls as temperature rises."))
      ],
      task: t("Жадвалдан 10, 20 ва 30 °C даги кислород эрувчанлигини топиб, графигини чизинг.", "Найдите в таблице растворимость кислорода при 10, 20 и 30 °C и постройте график.", "Look up oxygen solubility at 10, 20 and 30 °C and plot a graph.") },

    { id: "v-hardness-complexometric", yt: "ppTS0lUNifs", top: "tahlil", st: "u", lng: "en", ch: "Apoptosis", orig: "Determining Water Hardness by Complexometric Titration", ck: "2026-10-17",
      t: t("Сув қаттиқлигини комплексонометрик титрлаш", "Жёсткость воды комплексонометрическим титрованием", "Water hardness by complexometric titration"),
      sum: t("Видеода сувдаги кальций ва магний ионлари ЭДТА эритмаси билан металл-индикатор иштирокида титрланиб, умумий қаттиқлик ҳисобланади.", "В видео ионы кальция и магния в воде титруют раствором ЭДТА с металлоиндикатором и рассчитывают общую жёсткость.", "The video titrates calcium and magnesium ions in water with EDTA using a metal indicator and calculates total hardness."),
      pre: t("Қаттиқ сув нима учун чойнакда қасмоқ ҳосил қилади?", "Почему жёсткая вода образует накипь в чайнике?", "Why does hard water leave scale in a kettle?"),
      k: [ t("ЭДТА Ca²⁺ ва Mg²⁺ билан 1:1 нисбатда барқарор комплекс ҳосил қилади.", "ЭДТА образует с Ca²⁺ и Mg²⁺ прочные комплексы в соотношении 1:1.", "EDTA forms stable 1:1 complexes with Ca²⁺ and Mg²⁺."),
           t("Эриохром қора Т индикатори pH≈10 (аммиакли буфер) да ишлатилади; охирги нуқтада ранг қизил-бинафшадан кўкка ўтади.", "Индикатор эриохром чёрный Т применяют при pH≈10 (аммиачный буфер); в конечной точке окраска меняется с винно-красной на синюю.", "Eriochrome Black T is used at pH≈10 (ammonia buffer); at the end point the colour turns from wine-red to blue."),
           t("USGS шкаласи бўйича 0–60 мг/л CaCO₃ — юмшоқ, 121–180 — қаттиқ, 180 дан юқори — жуда қаттиқ сув.", "По шкале USGS 0–60 мг/л CaCO₃ — мягкая вода, 121–180 — жёсткая, выше 180 — очень жёсткая.", "On the USGS scale 0–60 mg/L as CaCO₃ is soft, 121–180 hard and above 180 very hard.") ],
      q: [
        q(t("ЭДТА билан титрлашда pH нима учун 10 атрофида ушлаб турилади?", "Зачем при титровании ЭДТА поддерживают pH около 10?", "Why is pH kept near 10 in EDTA titration?"), [t("Сувни стерилизация қилиш учун", "Чтобы стерилизовать воду", "To sterilise the water"), t("Кислородни чиқариб юбориш учун", "Чтобы удалить кислород", "To drive out oxygen"), t("Комплекс барқарор ва индикатор ранги аниқ бўлиши учун", "Чтобы комплексы были прочными, а переход индикатора чётким", "So the complexes are stable and the indicator change is sharp")], 2, t("Паст pH да ЭДТА протонланади ва Mg²⁺ комплекси беқарор бўлади; буфер буни олдини олади.", "При низком pH ЭДТА протонируется и комплекс с Mg²⁺ непрочен; буфер это предотвращает.", "At low pH EDTA is protonated and the Mg²⁺ complex is weak; the buffer prevents this.")),
        q(t("ЭДТА металл ионлари билан қандай нисбатда бирикади?", "В каком соотношении ЭДТА связывает ионы металлов?", "In what ratio does EDTA bind metal ions?"), [t("1:1", "1:1", "1:1"), t("1:2", "1:2", "1:2"), t("2:3", "2:3", "2:3")], 0, t("Икки, уч ёки тўрт зарядли иондан қатъи назар ЭДТА 1:1 комплекс ҳосил қилади, шу сабабли ҳисоб оддий.", "Независимо от заряда иона ЭДТА образует комплекс 1:1, поэтому расчёт прост.", "Regardless of the ion's charge EDTA forms a 1:1 complex, which keeps the calculation simple."))
      ],
      task: t("Агар 50 мл сув учун 0,01 М ЭДТА дан 6,0 мл сарфланса, қаттиқликни мг/л CaCO₃ да ҳисобланг (жавоб: 120 мг/л).", "Если на 50 мл воды ушло 6,0 мл 0,01 М ЭДТА, рассчитайте жёсткость в мг/л CaCO₃ (ответ: 120 мг/л).", "If 6.0 mL of 0.01 M EDTA is used for 50 mL of water, calculate hardness in mg/L as CaCO₃ (answer: 120 mg/L).") },

    { id: "v-soil-ph-meter-strips", yt: "ULm_gbigMAc", top: "tahlil", st: "", lng: "en", ch: "Steven Vanek", orig: "Soil pH measurement using a portable pH meter and pH indicator strips", ck: "2026-10-17",
      t: t("Тупроқ pH ини кўчма pH-метр ва индикатор қоғоз билан ўлчаш", "Измерение pH почвы портативным pH-метром и индикаторными полосками", "Measuring soil pH with a portable meter and indicator strips"),
      sum: t("Видеода тупроқ ва сув суспензиясини тайёрлаб, унинг pH ини кўчма pH-метр ва индикатор чизиқчалари билан ўлчаш кўрсатилади.", "В видео готовят суспензию почвы в воде и измеряют её pH портативным pH-метром и индикаторными полосками.", "The video prepares a soil–water suspension and measures its pH with a portable pH meter and with indicator strips."),
      pre: t("Нима учун тупроқ pH и тўғридан-тўғри қуруқ тупроқда эмас, суспензияда ўлчанади?", "Почему pH почвы измеряют в суспензии, а не в сухой почве?", "Why is soil pH measured in a suspension rather than in dry soil?"),
      k: [ t("ISO 10390 стандарти бўйича тупроқ pH и сув, 1 М KCl ёки 0,01 М CaCl₂ даги 1:5 суспензияда ўлчанади.", "По ISO 10390 pH почвы измеряют в суспензии 1:5 в воде, 1 М KCl или 0,01 М CaCl₂.", "ISO 10390 measures soil pH in a 1:5 suspension in water, 1 M KCl or 0.01 M CaCl₂."),
           t("Туз эритмасида ўлчанган pH одатда сувдагидан 0,5–1 бирлик паст бўлади.", "pH в солевой вытяжке обычно на 0,5–1 единицы ниже, чем в водной.", "pH measured in a salt solution is usually 0.5–1 unit lower than in water."),
           t("Кўпчилик экинлар учун мақбул тупроқ pH и тахминан 6,0–7,5.", "Для большинства культур оптимальный pH почвы около 6,0–7,5.", "Most crops grow best at a soil pH of roughly 6.0–7.5.") ],
      q: [
        q(t("Индикатор қоғоз ва pH-метрни солиштирганда қайси бири аниқроқ?", "Что точнее: индикаторные полоски или pH-метр?", "Which is more precise: indicator strips or a pH meter?"), [t("Индикатор қоғоз", "Индикаторные полоски", "Indicator strips"), t("Калибрланган pH-метр", "Откалиброванный pH-метр", "A calibrated pH meter"), t("Улар бир хил", "Одинаково", "They are the same")], 1, t("Калибрланган метр 0,01–0,1 аниқликда ўлчайди, чизиқчалар эса одатда 0,5–1 бирлик қадам билан.", "Откалиброванный метр даёт точность 0,01–0,1, полоски — обычно шаг 0,5–1 единицы.", "A calibrated meter reads to 0.01–0.1 units, strips usually only in 0.5–1 unit steps.")),
        q(t("pH = 5 бўлган тупроқ қандай тупроқ?", "Почва с pH = 5 — это какая почва?", "A soil with pH 5 is…"), [t("Ишқорий", "Щелочная", "Alkaline"), t("Нейтрал", "Нейтральная", "Neutral"), t("Кислотали", "Кислая", "Acidic")], 2, t("pH 7 дан паст — кислотали; pH 5 кучли кислотали ҳисобланади ва оҳаклашни талаб қилиши мумкин.", "pH ниже 7 — кислая; pH 5 — сильнокислая почва, может требоваться известкование.", "Below 7 is acidic; pH 5 is strongly acidic and may need liming."))
      ],
      task: t("Уч хил жойдан тупроқ олиб, 1:5 сувли суспензияда pH ни индикатор қоғоз билан ўлчанг ва солиштиринг.", "Возьмите почву из трёх мест, приготовьте суспензию 1:5 в воде и сравните pH по индикаторной бумаге.", "Collect soil from three places, make 1:5 water suspensions and compare their pH with indicator paper.") },

    { id: "v-soil-jar-texture", yt: "PJSNn3fl5kg", top: "tahlil", st: "m", lng: "en", ch: "UW Ecology Lab", orig: "Classifying Soil Texture Using the Mason Jar Soil Test", ck: "2026-10-17",
      t: t("Банка синови орқали тупроқ гранулометрик таркибини аниқлаш", "Определение механического состава почвы методом банки", "Classifying soil texture with the jar test"),
      sum: t("Видеода тупроқ сув билан банкада чайқатилиб, қум, чанг (лой) ва гил заррачаларининг қатлам-қатлам чўкиши орқали тупроқ тури аниқланади.", "В видео почву взбалтывают с водой в банке и по оседанию слоёв песка, пыли и глины определяют её механический состав.", "The video shakes soil with water in a jar and uses the settled layers of sand, silt and clay to classify soil texture."),
      pre: t("Сизнингча, сувда энг тез қайси заррачалар чўкади — қумми ёки гил?", "Как вы думаете, какие частицы оседают быстрее — песок или глина?", "Which particles do you think settle fastest — sand or clay?"),
      k: [ t("USDA таснифи: қум 2–0,05 мм, чанг 0,05–0,002 мм, гил 0,002 мм дан кичик.", "Классификация USDA: песок 2–0,05 мм, пыль 0,05–0,002 мм, глина менее 0,002 мм.", "USDA classes: sand 2–0.05 mm, silt 0.05–0.002 mm, clay smaller than 0.002 mm."),
           t("Стокс қонунига кўра, заррача чўкиш тезлиги унинг диаметри квадратига пропорционал.", "По закону Стокса скорость оседания частицы пропорциональна квадрату её диаметра.", "By Stokes' law a particle's settling velocity is proportional to the square of its diameter."),
           t("Қум бир неча дақиқада, чанг бир неча соатда, гил эса бир неча кунгача чўкади; фоизлар тупроқ текстура учбурчагига қўйилади.", "Песок оседает за минуты, пыль — за часы, глина — до нескольких суток; доли наносят на треугольник текстуры.", "Sand settles in minutes, silt in hours and clay can take days; the percentages are plotted on the soil texture triangle.") ],
      q: [
        q(t("Банкада энг юқори қатламда қайси заррачалар тўпланади?", "Какие частицы оказываются в самом верхнем слое?", "Which particles end up in the top layer of the jar?"), [t("Гил", "Глина", "Clay"), t("Қум", "Песок", "Sand"), t("Шағал", "Гравий", "Gravel")], 0, t("Гил заррачалари энг майда бўлгани учун энг секин чўкади ва юқорида қолади.", "Частицы глины самые мелкие, оседают медленнее всего и ложатся сверху.", "Clay particles are the smallest, settle slowest and form the top layer.")),
        q(t("Тупроқ текстура учбурчагида қайси уч кўрсаткич ишлатилади?", "Какие три показателя используются в треугольнике текстуры?", "Which three fractions are used in the soil texture triangle?"), [t("pH, N, P", "pH, N, P", "pH, N, P"), t("Гумус, сув, ҳаво", "Гумус, вода, воздух", "Humus, water, air"), t("Қум, чанг, гил фоизи", "Доля песка, пыли и глины", "Percent sand, silt and clay")], 2, t("Учта фракция йиғиндиси 100% бўлиб, кесишиш нуқтаси текстура синфини беради.", "Сумма трёх фракций равна 100%, пересечение линий даёт класс текстуры.", "The three fractions add up to 100% and their intersection gives the texture class."))
      ],
      task: t("Банка синовини ўтказинг, 1 дақиқа, 2 соат ва 2 кундан кейин қатлам қалинлигини ўлчаб, фоизларни ҳисобланг.", "Проведите тест в банке, измерьте толщину слоёв через 1 минуту, 2 часа и 2 суток и рассчитайте доли.", "Run a jar test, measure layer thickness after 1 minute, 2 hours and 2 days, and calculate the percentages.") },

    { id: "v-secchi-explainer", yt: "hTwTHWqh7-w", top: "tahlil", st: "u", lng: "en", ch: "Hilary Dugan", orig: "Secchi disk explainer", ck: "2026-10-17",
      t: t("Секки диски: сув тиниқлигини ўлчаш", "Диск Секки: измерение прозрачности воды", "The Secchi disk: measuring water clarity"),
      sum: t("Лимнолог олима видеода Секки диски нима эканлиги ва у билан кўл сувининг тиниқлигини қандай ўлчаш мумкинлигини тушунтиради.", "Лимнолог объясняет, что такое диск Секки и как с его помощью измеряют прозрачность воды в озере.", "A limnologist explains what a Secchi disk is and how it is used to measure the clarity of lake water."),
      pre: t("Нима учун тиниқлик сувдаги сувўтлар миқдорини билвосита кўрсатади?", "Почему прозрачность косвенно говорит о количестве водорослей?", "Why does water clarity indirectly indicate the amount of algae?"),
      k: [ t("Стандарт Секки диски — диаметри 20 см, оқ-қора чорак бўлакларга бўлинган диск.", "Стандартный диск Секки — диск диаметром 20 см с чёрно-белыми секторами.", "A standard Secchi disk is 20 cm across with alternating black and white quadrants."),
           t("Секки чуқурлиги — диск кўздан ғойиб бўладиган чуқурлик; соя томонда, кўзойнаксиз ўлчанади.", "Глубина Секки — глубина, на которой диск перестаёт быть виден; измеряют с теневой стороны, без солнцезащитных очков.", "Secchi depth is where the disk disappears from view; it is read on the shady side without sunglasses."),
           t("Ёруғ (эвфотик) зона чуқурлиги тахминан Секки чуқурлигидан 2–3 баравар катта.", "Глубина фотической зоны примерно в 2–3 раза больше глубины Секки.", "The euphotic zone is roughly 2–3 times the Secchi depth.") ],
      q: [
        q(t("Эвтрофикацияда Секки чуқурлиги қандай ўзгаради?", "Как меняется глубина Секки при эвтрофикации?", "How does Secchi depth change with eutrophication?"), [t("Ортади", "Увеличивается", "It increases"), t("Камаяди", "Уменьшается", "It decreases"), t("Ўзгармайди", "Не меняется", "It does not change")], 1, t("Озуқа моддалар сувўтлар кўпайишига олиб келади, сув лойқаланади ва диск тезроқ кўринмай қолади.", "Биогены вызывают рост водорослей, вода мутнеет и диск исчезает быстрее.", "Nutrients fuel algal growth, the water clouds and the disk vanishes sooner.")),
        q(t("Секки диски асосан нимани ўлчайди?", "Что в первую очередь измеряет диск Секки?", "What does a Secchi disk primarily measure?"), [t("Сув тиниқлигини", "Прозрачность воды", "Water transparency"), t("Сув ҳароратини", "Температуру воды", "Water temperature"), t("Сув pH ини", "pH воды", "Water pH")], 0, t("Диск ёруғликнинг сувга қанча кира олишини, яъни тиниқликни баҳолайди.", "Диск оценивает, насколько глубоко проникает свет, то есть прозрачность.", "The disk gauges how far light penetrates, i.e. transparency."))
      ],
      task: t("Қопқоқдан оқ-қора диск ясаб, ипга боғланг ва ҳовуз ёки ариқда кўринмай қоладиган чуқурликни ўлчанг.", "Сделайте чёрно-белый диск из крышки, привяжите к верёвке и измерьте глубину исчезновения в пруду.", "Make a black-and-white disk from a lid, tie it to a cord and measure the disappearance depth in a pond.") },

    { id: "v-bod5-unimas", yt: "qrNLZJ_6FPA", top: "tahlil", st: "u", lng: "en", ch: "Environmental Lab UNIMAS", orig: "BIOCHEMICAL OXYGEN DEMAND (B.O.D) (5 DAYS BOD TEST)", ck: "2026-10-17",
      t: t("Биокимёвий кислород сарфи (БКС₅) синови", "Биохимическое потребление кислорода (БПК₅)", "Biochemical oxygen demand: the 5-day BOD test"),
      sum: t("Университет лабораторияси видеосида сув намунасининг 5 кунлик биокимёвий кислород сарфини аниқлаш тартиби кўрсатилади.", "В видео университетской лаборатории показан порядок определения пятисуточного биохимического потребления кислорода пробы воды.", "A university environmental lab demonstrates the procedure for the 5-day biochemical oxygen demand test of a water sample."),
      pre: t("Нима учун БКС шишалари қоронғида сақланади?", "Почему склянки для БПК держат в темноте?", "Why are BOD bottles kept in the dark?"),
      k: [ t("БКС₅ — намунани 20 °C да, қоронғида 5 кун сақлаганда микроорганизмлар сарфлаган кислород миқдори.", "БПК₅ — количество кислорода, израсходованного микроорганизмами за 5 суток при 20 °C в темноте.", "BOD₅ is the oxygen consumed by microorganisms over 5 days at 20 °C in the dark."),
           t("БКС = (DO₀ − DO₅) × суюлтириш коэффициенти; ифлос сувлар кислородга тўйинган суюлтириш суви билан суюлтирилади.", "БПК = (DO₀ − DO₅) × коэффициент разбавления; загрязнённые пробы разбавляют насыщенной кислородом водой.", "BOD = (DO₀ − DO₅) × dilution factor; polluted samples are diluted with oxygen-saturated dilution water."),
           t("ЕИ 91/271/EEC директивасига кўра тозаланган оқова сувда БКС₅ 25 мг/л O₂ дан ошмаслиги керак.", "По директиве ЕС 91/271/EEC БПК₅ очищенных сточных вод не должно превышать 25 мг/л O₂.", "Under EU Directive 91/271/EEC treated wastewater should not exceed 25 mg/L O₂ BOD₅.") ],
      q: [
        q(t("Стандарт БКС синови неча кун давом этади?", "Сколько суток длится стандартный тест БПК?", "How many days does the standard BOD test last?"), [t("1 кун", "1 сутки", "1 day"), t("3 кун", "3 суток", "3 days"), t("5 кун", "5 суток", "5 days")], 2, t("Шунинг учун у БКС₅ деб аталади; инкубация 20 °C да ўтказилади.", "Отсюда название БПК₅; инкубация идёт при 20 °C.", "Hence the name BOD₅; incubation is at 20 °C.")),
        q(t("Юқори БКС нимани англатади?", "Что означает высокое БПК?", "What does a high BOD indicate?"), [t("Кўп органик ифлосланиш", "Много органического загрязнения", "Much organic pollution"), t("Сув жуда тоза", "Вода очень чистая", "Very clean water"), t("Сув жуда қаттиқ", "Вода очень жёсткая", "Very hard water")], 0, t("Органик модда кўп бўлса, уни парчалайдиган бактериялар кўп кислород сарфлайди.", "Чем больше органики, тем больше кислорода тратят разлагающие её бактерии.", "More organic matter means bacteria use more oxygen to break it down."))
      ],
      task: t("Агар DO₀ = 8,6 мг/л, DO₅ = 4,1 мг/л ва суюлтириш 10 марта бўлса, БКС₅ ни ҳисобланг (45 мг/л).", "Если DO₀ = 8,6 мг/л, DO₅ = 4,1 мг/л и разбавление в 10 раз, рассчитайте БПК₅ (45 мг/л).", "If DO₀ = 8.6 mg/L, DO₅ = 4.1 mg/L and the dilution is 10-fold, calculate BOD₅ (45 mg/L).") },

    { id: "v-pm-monitoring-epa-ie", yt: "U7jtvGQKtmM", top: "tahlil", st: "", lng: "en", ch: "EPA Ireland", orig: "Monitoring of Fine Particulate Matter", ck: "2026-10-17",
      t: t("Майда чанг заррачалари (PM2.5) мониторинги", "Мониторинг мелкодисперсных частиц (PM2.5)", "Monitoring fine particulate matter"),
      sum: t("Ирландия атроф-муҳит агентлиги видеосида ҳаводаги майда чанг заррачалари қандай кузатилиши ва ўлчаниши ҳақида сўз боради.", "В видео Агентства по охране окружающей среды Ирландии рассказано, как ведётся мониторинг мелкодисперсных частиц в воздухе.", "Ireland's Environmental Protection Agency explains how fine particulate matter in the air is monitored and measured."),
      pre: t("PM2.5 даги «2,5» рақами нимани билдиради?", "Что означает число «2,5» в обозначении PM2.5?", "What does the «2.5» in PM2.5 stand for?"),
      k: [ t("PM2.5 — аэродинамик диаметри 2,5 мкм ва ундан кичик заррачалар; улар ўпканинг чуқур қисмларига етиб боради.", "PM2.5 — частицы с аэродинамическим диаметром до 2,5 мкм; они проникают в глубокие отделы лёгких.", "PM2.5 are particles with an aerodynamic diameter of 2.5 µm or less; they reach deep into the lungs."),
           t("ЖССТ 2021 йилги кўрсатмаси: PM2.5 учун йиллик ўртача 5 мкг/м³, суткалик 15 мкг/м³.", "Рекомендации ВОЗ 2021 г.: PM2.5 — 5 мкг/м³ в среднем за год и 15 мкг/м³ за сутки.", "WHO 2021 guidelines: PM2.5 annual mean 5 µg/m³ and 24-hour mean 15 µg/m³."),
           t("Эталон усул — гравиметрик (EN 12341): фильтр орқали маълум ҳажмдаги ҳаво ўтказилиб, фильтр олдин ва кейин тортилади.", "Эталонный метод — гравиметрический (EN 12341): через фильтр прокачивают известный объём воздуха и взвешивают фильтр до и после.", "The reference method is gravimetric (EN 12341): a known air volume is drawn through a filter that is weighed before and after.") ],
      q: [
        q(t("Гравиметрик усулда PM массаси қандай аниқланади?", "Как определяют массу PM в гравиметрическом методе?", "How is PM mass determined gravimetrically?"), [t("Рангини солиштириб", "По цвету", "By comparing colour"), t("Фильтрни тортиб", "Взвешиванием фильтра", "By weighing the filter"), t("Ҳидига қараб", "По запаху", "By smell")], 1, t("Масса фарқи ўтказилган ҳаво ҳажмига бўлиниб, мкг/м³ да концентрация олинади.", "Разность масс делят на объём воздуха и получают концентрацию в мкг/м³.", "The mass difference divided by the air volume gives the concentration in µg/m³.")),
        q(t("ЖССТ нинг PM2.5 учун йиллик кўрсатма қиймати қанча?", "Каково годовое рекомендуемое значение ВОЗ для PM2.5?", "What is the WHO annual guideline value for PM2.5?"), [t("5 мкг/м³", "5 мкг/м³", "5 µg/m³"), t("50 мкг/м³", "50 мкг/м³", "50 µg/m³"), t("500 мкг/м³", "500 мкг/м³", "500 µg/m³")], 0, t("2021 йилда ЖССТ йиллик кўрсатмани 10 дан 5 мкг/м³ га туширди.", "В 2021 г. ВОЗ снизила годовое значение с 10 до 5 мкг/м³.", "In 2021 WHO lowered the annual guideline from 10 to 5 µg/m³."))
      ],
      task: t("Шаҳрингиз учун онлайн ҳаво сифати харитасидан бир ҳафталик PM2.5 қийматларини ёзиб, ЖССТ кўрсатмаси билан солиштиринг.", "Запишите значения PM2.5 вашего города за неделю по онлайн-карте и сравните с рекомендацией ВОЗ.", "Record a week of PM2.5 values for your city from an online map and compare them with the WHO guideline.") },

    { id: "v-air-quality-britannica", yt: "YHrqlmoffic", top: "tahlil", st: "m", lng: "en", ch: "Encyclopaedia Britannica", orig: "How Is Air Quality Measured?", ck: "2026-10-17",
      t: t("Ҳаво сифати қандай ўлчанади?", "Как измеряют качество воздуха?", "How is air quality measured?"),
      sum: t("Британника видеоси ҳаво сифатини ўлчаш усуллари ва асосий ифлослантирувчи моддалар ҳақида қисқача тушунтиради.", "Видео Britannica кратко объясняет, как измеряют качество воздуха и какие загрязнители учитывают.", "A short Britannica video explains how air quality is measured and which pollutants are tracked."),
      pre: t("Ҳавонинг ифлосланганлигини қайси моддалар бўйича баҳолаш мумкин?", "По каким веществам можно оценить загрязнение воздуха?", "Which substances can be used to judge air pollution?"),
      k: [ t("Ҳаво сифати индекси (AQI) PM2.5, PM10, O₃, NO₂, SO₂ ва CO концентрацияларидан ҳисобланади.", "Индекс качества воздуха (AQI) рассчитывают по концентрациям PM2.5, PM10, O₃, NO₂, SO₂ и CO.", "The Air Quality Index (AQI) is calculated from PM2.5, PM10, O₃, NO₂, SO₂ and CO concentrations."),
           t("Станцияларда NO₂ хемилюминесценция, SO₂ ультрабинафша флуоресценция, O₃ эса УБ ютилиш усулида ўлчанади.", "На станциях NO₂ измеряют хемилюминесценцией, SO₂ — УФ-флуоресценцией, O₃ — по поглощению УФ.", "Monitoring stations measure NO₂ by chemiluminescence, SO₂ by UV fluorescence and O₃ by UV absorption."),
           t("ЖССТ 2021: NO₂ учун йиллик ўртача кўрсатма 10 мкг/м³.", "ВОЗ 2021: годовое рекомендуемое значение для NO₂ — 10 мкг/м³.", "WHO 2021: the annual guideline for NO₂ is 10 µg/m³.") ],
      q: [
        q(t("AQI нинг қайси қиймати ҳавонинг тоза эканини билдиради?", "Какое значение AQI соответствует чистому воздуху?", "Which AQI value means clean air?"), [t("300", "300", "300"), t("150", "150", "150"), t("0–50", "0–50", "0–50")], 2, t("АҚШ EPA шкаласида 0–50 «яхши», 151–200 «носоғлом», 301+ «хавфли».", "По шкале EPA США 0–50 — «хорошо», 151–200 — «вредно», 301+ — «опасно».", "On the US EPA scale 0–50 is «good», 151–200 «unhealthy» and 301+ «hazardous».")),
        q(t("Қайси газ асосан автомобиль двигателларидан чиқади ва хемилюминесценция билан ўлчанади?", "Какой газ в основном выделяют двигатели автомобилей и измеряют хемилюминесценцией?", "Which gas comes mainly from car engines and is measured by chemiluminescence?"), [t("NO₂", "NO₂", "NO₂"), t("O₂", "O₂", "O₂"), t("Ar", "Ar", "Ar")], 0, t("Азот оксидлари юқори ҳароратдаги ёнишда ҳосил бўлади.", "Оксиды азота образуются при высокотемпературном горении.", "Nitrogen oxides form during high-temperature combustion."))
      ],
      task: t("Бир кун давомида уч марта AQI қийматини текшириб, қайси ифлослантирувчи устунлик қилганини ёзинг.", "Проверьте AQI трижды за день и запишите, какой загрязнитель был основным.", "Check the AQI three times in one day and note which pollutant dominated.") },

    { id: "v-membrane-filtration-wedc", yt: "B1AVxzccS5Q", top: "tahlil", st: "u", lng: "en", ch: "WEDC Publications", orig: "Membrane filtration to test for faecal contamination of water samples", ck: "2026-10-17",
      t: t("Мембрана фильтрлаш: сувнинг фекал ифлосланишини текшириш", "Мембранная фильтрация: проверка воды на фекальное загрязнение", "Membrane filtration to test water for faecal contamination"),
      sum: t("Видеода сув намунаси мембрана фильтр орқали ўтказилиб, озуқа муҳитида ўстириш ва фекал индикатор бактериялар колонияларини санаш кўрсатилади.", "В видео пробу воды пропускают через мембранный фильтр, инкубируют на питательной среде и подсчитывают колонии фекальных индикаторных бактерий.", "The video filters a water sample through a membrane, incubates it on growth medium and counts colonies of faecal indicator bacteria."),
      pre: t("Нима учун касаллик қўзғатувчиларнинг ўзи эмас, «индикатор» бактериялар изланади?", "Почему ищут «индикаторные» бактерии, а не сами патогены?", "Why do labs look for «indicator» bacteria instead of the pathogens themselves?"),
      k: [ t("Одатда 100 мл сув 0,45 мкм тешикли мембранадан ўтказилади; бактериялар фильтр юзасида қолади.", "Обычно 100 мл воды фильтруют через мембрану с порами 0,45 мкм; бактерии остаются на поверхности.", "Typically 100 mL of water is passed through a 0.45 µm membrane, which retains the bacteria."),
           t("Термотолерант (фекал) колиформлар 44–44,5 °C да 18–24 соат инкубацияда аниқланади (ISO 9308-1 га яқин усуллар).", "Термотолерантные (фекальные) колиформы выявляют инкубацией при 44–44,5 °C 18–24 ч (методы, близкие к ISO 9308-1).", "Thermotolerant (faecal) coliforms are detected by incubation at 44–44.5 °C for 18–24 h (methods akin to ISO 9308-1)."),
           t("ЖССТ: ичимлик сувининг ҳеч бир 100 мл намунасида E. coli аниқланмаслиги керак.", "ВОЗ: E. coli не должна обнаруживаться ни в одной пробе питьевой воды объёмом 100 мл.", "WHO: E. coli must not be detectable in any 100 mL sample of drinking water.") ],
      q: [
        q(t("Фекал ифлосланишнинг энг ишончли индикатори қайси?", "Какой показатель — самый надёжный индикатор фекального загрязнения?", "Which organism is the most reliable indicator of faecal contamination?"), [t("Escherichia coli", "Escherichia coli", "Escherichia coli"), t("Хлорелла сувўти", "Водоросль хлорелла", "Chlorella algae"), t("Ачитқи", "Дрожжи", "Yeast")], 0, t("E. coli фақат иссиқ қонли ҳайвонлар ичагида кўп учрайди, шунинг учун фекал ифлосланишни аниқ кўрсатади.", "E. coli обитает в кишечнике теплокровных, поэтому прямо указывает на фекальное загрязнение.", "E. coli lives in the guts of warm-blooded animals, so it points directly to faecal contamination.")),
        q(t("Мембрана фильтр тешикларининг одатий ўлчами қанча?", "Каков типичный размер пор мембранного фильтра?", "What is the usual pore size of the membrane?"), [t("45 мм", "45 мм", "45 mm"), t("0,45 мкм", "0,45 мкм", "0.45 µm"), t("4,5 см", "4,5 см", "4.5 cm")], 1, t("0,45 мкм бактерияларни ушлаб қолади, сув эса ўтиб кетади.", "Поры 0,45 мкм задерживают бактерии и пропускают воду.", "0.45 µm pores trap bacteria while letting water through."))
      ],
      task: t("Агар 100 мл намунадан 12 та колония ўсса, натижани КҲБ/100 мл да ёзинг ва ЖССТ талабига мувофиқлигини баҳоланг.", "Если из 100 мл выросло 12 колоний, запишите результат в КОЕ/100 мл и оцените соответствие требованиям ВОЗ.", "If 12 colonies grew from 100 mL, report the result in CFU/100 mL and judge it against the WHO requirement.") },

    { id: "v-beer-lambert-oct", yt: "rllHziqWlgU", top: "tahlil", st: "m", lng: "en", ch: "The Organic Chemistry Tutor", orig: "Beer Lambert's Law, Absorbance & Transmittance - Spectrophotometry, Basic Introduction - Chemistry", ck: "2026-10-17",
      t: t("Бугер–Ламберт–Бер қонуни: оптик зичлик ва ўтказувчанлик", "Закон Бугера–Ламберта–Бера: оптическая плотность и пропускание", "Beer–Lambert law: absorbance and transmittance"),
      sum: t("Видеода спектрофотометриянинг асоси — Бугер–Ламберт–Бер қонуни, оптик зичлик ва ўтказувчанлик тушунчалари ҳамда улар бўйича ҳисоб-китоблар тушунтирилади.", "В видео объясняются основа спектрофотометрии — закон Бугера–Ламберта–Бера, понятия оптической плотности и пропускания и расчёты по ним.", "The video explains the basis of spectrophotometry — the Beer–Lambert law, absorbance and transmittance — with worked calculations."),
      pre: t("Нима учун тўқроқ рангли эритма кўпроқ ёруғлик ютади?", "Почему более окрашенный раствор поглощает больше света?", "Why does a more deeply coloured solution absorb more light?"),
      k: [ t("A = ε·l·c: оптик зичлик моляр ютилиш коэффициенти, кювета қалинлиги ва концентрацияга пропорционал.", "A = ε·l·c: оптическая плотность пропорциональна молярному коэффициенту поглощения, толщине кюветы и концентрации.", "A = ε·l·c: absorbance is proportional to molar absorptivity, path length and concentration."),
           t("A = −lg T; масалан, T = 10% бўлса, A = 1.", "A = −lg T; например, при T = 10% A = 1.", "A = −log T; for example, T = 10% gives A = 1."),
           t("Сув таҳлилида нитрат, фосфат ва аммоний рангли комплекс ҳосил қилиб, калибровка графиги бўйича шу қонун асосида аниқланади.", "В анализе воды нитраты, фосфаты и аммоний переводят в окрашенные соединения и определяют по градуировочному графику на основе этого закона.", "In water analysis nitrate, phosphate and ammonium are converted to coloured compounds and quantified with a calibration curve based on this law.") ],
      q: [
        q(t("Агар концентрация икки баравар оширилса, оптик зичлик нима бўлади?", "Что будет с оптической плотностью, если удвоить концентрацию?", "What happens to absorbance if the concentration doubles?"), [t("Икки баравар камаяди", "Уменьшится вдвое", "It halves"), t("Ўзгармайди", "Не изменится", "It stays the same"), t("Икки баравар ортади", "Увеличится вдвое", "It doubles")], 2, t("Қонун чизиқли бўлгани учун A концентрацияга тўғри пропорционал.", "Закон линейный, поэтому A прямо пропорциональна концентрации.", "The law is linear, so A is directly proportional to concentration.")),
        q(t("Ўтказувчанлик T = 1% бўлса, A нечага тенг?", "Чему равна A при пропускании T = 1%?", "What is A when T = 1%?"), [t("2", "2", "2"), t("1", "1", "1"), t("0,01", "0,01", "0.01")], 0, t("A = −lg 0,01 = 2.", "A = −lg 0,01 = 2.", "A = −log 0.01 = 2."))
      ],
      task: t("ε = 15000 л·моль⁻¹·см⁻¹, l = 1 см ва A = 0,45 бўлса, концентрацияни ҳисобланг (3·10⁻⁵ моль/л).", "При ε = 15000 л·моль⁻¹·см⁻¹, l = 1 см и A = 0,45 рассчитайте концентрацию (3·10⁻⁵ моль/л).", "With ε = 15000 L·mol⁻¹·cm⁻¹, l = 1 cm and A = 0.45, calculate the concentration (3×10⁻⁵ mol/L).") },

    { id: "v-soil-ec-cropwatch", yt: "GC6485CiRQQ", top: "tahlil", st: "m", lng: "en", ch: "CropWatch - Youth", orig: "Soil Electrical Conductivity Test", ck: "2026-10-17",
      t: t("Тупроқ электр ўтказувчанлигини текшириш", "Тест электропроводности почвы", "Soil electrical conductivity test"),
      sum: t("Видеода тупроқ намунасининг электр ўтказувчанлигини (ЭЎ) ўлчаш ва унинг тупроқдаги эриган тузлар миқдори билан боғлиқлиги кўрсатилади.", "В видео измеряют электропроводность (ЭП) почвенного образца и показывают её связь с содержанием растворимых солей.", "The video measures the electrical conductivity (EC) of a soil sample and links it to the amount of soluble salts."),
      pre: t("Нима учун шўр тупроқ эритмаси электр токини яхши ўтказади?", "Почему раствор засолённой почвы хорошо проводит ток?", "Why does a salty soil solution conduct electricity well?"),
      k: [ t("ЭЎ эритмадаги ионлар миқдорига боғлиқ ва дС/м (ёки мС/см) да ифодаланади; натижа 25 °C га келтирилади.", "ЭП зависит от количества ионов в растворе, выражается в дСм/м (мСм/см) и приводится к 25 °C.", "EC depends on the ions in solution, is expressed in dS/m (mS/cm) and is corrected to 25 °C."),
           t("USDA бўйича тўйинган паста экстрактида ЭЎ 4 дС/м дан юқори тупроқ шўрланган ҳисобланади.", "По USDA почва засолена, если ЭП вытяжки из насыщенной пасты выше 4 дСм/м.", "By USDA criteria soil is saline when the saturated-paste extract EC exceeds 4 dS/m."),
           t("Пахта тузга нисбатан чидамли, ловия ва сабзи эса жуда сезгир экинлардир.", "Хлопчатник относительно солеустойчив, а фасоль и морковь очень чувствительны.", "Cotton is relatively salt-tolerant, while beans and carrots are very sensitive.") ],
      q: [
        q(t("Тупроқ ЭЎ си асосан нимани кўрсатади?", "Что в основном показывает ЭП почвы?", "What does soil EC mainly indicate?"), [t("Гумус рангини", "Цвет гумуса", "Humus colour"), t("Эриган тузлар миқдорини", "Содержание растворимых солей", "The amount of dissolved salts"), t("Чувалчанглар сонини", "Число червей", "The number of earthworms")], 1, t("Тузлар ионларга ажралади ва ток ўтказади; ЭЎ қанча юқори бўлса, тузлар шунча кўп.", "Соли диссоциируют на ионы и проводят ток; чем выше ЭП, тем больше солей.", "Salts dissociate into ions that carry current; higher EC means more salt.")),
        q(t("Қайси ЭЎ (тўйинган паста) да тупроқ шўрланган деб ҳисобланади?", "При какой ЭП (насыщенная паста) почва считается засолённой?", "At what saturated-paste EC is soil considered saline?"), [t("4 дС/м дан юқори", "Выше 4 дСм/м", "Above 4 dS/m"), t("0,1 дС/м дан паст", "Ниже 0,1 дСм/м", "Below 0.1 dS/m"), t("Аниқ 7", "Ровно 7", "Exactly 7")], 0, t("Бу USDA шўрланиш чегараси; 7 эса pH нейтрал нуқтаси, ЭЎ эмас.", "Это порог засоления USDA; 7 — нейтральный pH, а не ЭП.", "That is the USDA salinity threshold; 7 is neutral pH, not EC."))
      ],
      task: t("Дистилланган сув, водопровод суви ва тупроқ суспензиясининг ЭЎ сини (ёки TDS) ўлчаб, тартиблаб ёзинг.", "Измерьте ЭП (или TDS) дистиллированной, водопроводной воды и почвенной суспензии и расположите по возрастанию.", "Measure the EC (or TDS) of distilled water, tap water and a soil suspension and rank them.") },

    { id: "v-winkler-ru-realworld", yt: "5x9l5oWHPns", top: "tahlil", st: "u", lng: "ru", ch: "Real World Lab", orig: "Определение растворённого в воде кислорода по Винклеру / Determination of dissolved oxygen (Winkler)", ck: "2026-10-17",
      t: t("Сувда эриган кислородни Винклер бўйича аниқлаш", "Определение растворённого кислорода по Винклеру", "Determining dissolved oxygen by Winkler"),
      sum: t("Лаборатория видеосида намуна олиш, кислородни фиксациялаш ва тиосульфат билан титрлаш босқичлари рус тилида кўрсатилади.", "В лабораторном видео на русском языке показаны отбор пробы, фиксация кислорода и титрование тиосульфатом.", "A Russian-language lab video shows sampling, oxygen fixation and thiosulfate titration in the Winkler method."),
      pre: t("Нима учун кислород шишасини ҳаво пуфакчасиз тўлдириш керак?", "Почему кислородную склянку заполняют без пузырьков воздуха?", "Why must the oxygen bottle be filled without air bubbles?"),
      k: [ t("Намуна махсус кислород шишасига тўлдирилиб, ортиқча сув тошириб ҳаво пуфаксиз ёпилади.", "Пробу наливают в кислородную склянку с переливом и закрывают без пузырьков воздуха.", "The sample is filled into an oxygen bottle with overflow and stoppered without air bubbles."),
           t("Фиксация MnCl₂ (ёки MnSO₄) ва ишқорий KI эритмалари билан амалга оширилади (ГОСТ Р 55684 / ISO 5813).", "Фиксацию проводят растворами MnCl₂ (или MnSO₄) и щелочного KI (ГОСТ Р 55684 / ISO 5813).", "Fixation uses MnCl₂ (or MnSO₄) and alkaline KI solutions (GOST R 55684 / ISO 5813)."),
           t("Кислород тўйиниш даражаси (%) ўлчанган концентрацияни шу ҳароратдаги эрувчанликка бўлиб топилади.", "Степень насыщения (%) находят, деля измеренную концентрацию на растворимость при той же температуре.", "Percent saturation is the measured concentration divided by the solubility at the same temperature.") ],
      q: [
        q(t("Агар 15 °C да DO = 7 мг/л, эрувчанлик эса 10 мг/л бўлса, тўйиниш қанча?", "Если при 15 °C DO = 7 мг/л, а растворимость 10 мг/л, какова степень насыщения?", "If DO is 7 mg/L at 15 °C and solubility is 10 mg/L, what is the saturation?"), [t("143%", "143%", "143%"), t("70%", "70%", "70%"), t("17%", "17%", "17%")], 1, t("7 / 10 × 100% = 70%.", "7 / 10 × 100% = 70%.", "7 / 10 × 100% = 70%.")),
        q(t("Кислород фиксациясидан кейин қандай чўкма ҳосил бўлади?", "Какой осадок образуется после фиксации кислорода?", "What precipitate forms after oxygen fixation?"), [t("Марганец гидроксидлари (жигарранг)", "Гидроксиды марганца (бурый)", "Manganese hydroxides (brown)"), t("Кальций карбонат (оқ)", "Карбонат кальция (белый)", "Calcium carbonate (white)"), t("Мис сульфат (кўк)", "Сульфат меди (синий)", "Copper sulfate (blue)")], 0, t("Кислород Mn(II) ни Mn(III/IV) гача оксидлайди ва жигарранг чўкма ҳосил бўлади.", "Кислород окисляет Mn(II) до Mn(III/IV) с образованием бурого осадка.", "Oxygen oxidises Mn(II) to Mn(III/IV), forming a brown precipitate."))
      ],
      task: t("Видеодаги барча реакция тенгламаларини ёзиб, O₂ ва тиосульфат орасидаги мол нисбатини чиқаринг.", "Запишите все уравнения реакций из видео и выведите мольное соотношение O₂ и тиосульфата.", "Write all the reaction equations from the video and derive the mole ratio of O₂ to thiosulfate.") },

    { id: "v-hardness-total-ru", yt: "q9EKrI6Crhk", top: "tahlil", st: "m", lng: "ru", ch: "Ruslan Arinenko", orig: "Определение общей жесткости воды", ck: "2026-10-17",
      t: t("Сувнинг умумий қаттиқлигини аниқлаш", "Определение общей жёсткости воды", "Determining total water hardness"),
      sum: t("Видеода сувнинг умумий қаттиқлиги трилон Б (ЭДТА) билан титрлаш орқали аниқланади.", "В видео общую жёсткость воды определяют титрованием трилоном Б (ЭДТА).", "The video determines total water hardness by titration with Trilon B (EDTA)."),
      pre: t("Сувнинг қаттиқлигини қайси ионлар белгилайди?", "Какие ионы определяют жёсткость воды?", "Which ions make water hard?"),
      k: [ t("Умумий қаттиқлик — сувдаги Ca²⁺ ва Mg²⁺ ионлари йиғиндиси.", "Общая жёсткость — суммарное содержание ионов Ca²⁺ и Mg²⁺.", "Total hardness is the combined content of Ca²⁺ and Mg²⁺ ions."),
           t("Россияда қаттиқлик °Ж да ўлчанади: 1 °Ж = 1 ммоль-экв/л = 0,5 ммоль/л Ca²⁺ ёки Mg²⁺ (ГОСТ 31865-2012).", "В России жёсткость выражают в °Ж: 1 °Ж = 1 ммоль-экв/л = 0,5 ммоль/л Ca²⁺ или Mg²⁺ (ГОСТ 31865-2012).", "In Russia hardness is given in °Zh: 1 °Zh = 1 mmol-eq/L = 0.5 mmol/L of Ca²⁺ or Mg²⁺ (GOST 31865-2012)."),
           t("СанПиН 1.2.3685-21 бўйича ичимлик сувининг умумий қаттиқлиги 7 °Ж дан ошмаслиги керак.", "По СанПиН 1.2.3685-21 общая жёсткость питьевой воды не должна превышать 7 °Ж.", "Russian SanPiN 1.2.3685-21 limits total hardness of drinking water to 7 °Zh.") ],
      q: [
        q(t("Трилон Б нима?", "Что такое трилон Б?", "What is Trilon B?"), [t("Индикатор", "Индикатор", "An indicator"), t("ЭДТА нинг динатрий тузи", "Динатриевая соль ЭДТА", "The disodium salt of EDTA"), t("Кислота", "Кислота", "An acid")], 1, t("Трилон Б — этилендиаминтетрасирка кислотасининг динатрий тузи, металл ионлари билан комплекс ҳосил қилади.", "Трилон Б — динатриевая соль этилендиаминтетрауксусной кислоты, образует комплексы с металлами.", "Trilon B is disodium EDTA, which complexes metal ions.")),
        q(t("10 °Ж қаттиқликдаги сув СанПиН талабига жавоб берадими?", "Соответствует ли СанПиН вода жёсткостью 10 °Ж?", "Does water at 10 °Zh meet the SanPiN limit?"), [t("Ҳа", "Да", "Yes"), t("Фақат қайнатилса", "Только после кипячения", "Only after boiling"), t("Йўқ, 7 °Ж дан юқори", "Нет, выше 7 °Ж", "No, it exceeds 7 °Zh")], 2, t("Меъёр 7 °Ж; 10 °Ж ундан юқори.", "Норматив 7 °Ж; 10 °Ж его превышает.", "The limit is 7 °Zh; 10 °Zh exceeds it."))
      ],
      task: t("Водопровод сувингиз қаттиқлигини тест-тўплам ёки маҳаллий сув таъминоти маълумотидан аниқлаб, °Ж ва мг/л CaCO₃ да ифодаланг (1 °Ж ≈ 50 мг/л CaCO₃).", "Узнайте жёсткость вашей водопроводной воды по тест-набору или данным водоканала и выразите в °Ж и мг/л CaCO₃ (1 °Ж ≈ 50 мг/л CaCO₃).", "Find your tap-water hardness with a test kit or utility data and express it in °Zh and mg/L CaCO₃ (1 °Zh ≈ 50 mg/L CaCO₃).") },

    { id: "v-hardness-gost-webinar", yt: "YtXQGBzXCrc", top: "tahlil", st: "u", lng: "ru", ch: "MT Measurement", orig: "Вебинар «Комплексометрическое титрование. Определение жесткости воды на примере ГОСТ 31954-2012»", ck: "2026-10-17",
      t: t("Комплексонометрик титрлаш: ГОСТ 31954-2012 бўйича сув қаттиқлиги", "Комплексонометрическое титрование: жёсткость воды по ГОСТ 31954-2012", "Complexometric titration: water hardness per GOST 31954-2012"),
      sum: t("Вебинарда комплексонометрик титрлаш назарияси ва ГОСТ 31954-2012 бўйича сув қаттиқлигини, жумладан автоматик титраторда аниқлаш кўриб чиқилади.", "На вебинаре разбираются теория комплексонометрического титрования и определение жёсткости воды по ГОСТ 31954-2012, в том числе на автотитраторе.", "The webinar covers complexometric titration theory and determining water hardness under GOST 31954-2012, including on an autotitrator."),
      pre: t("Қўлда ва автоматик титрлашнинг афзаллик ва камчиликлари нимада?", "В чём плюсы и минусы ручного и автоматического титрования?", "What are the pros and cons of manual versus automatic titration?"),
      k: [ t("ГОСТ 31954-2012 сув қаттиқлигини аниқлашнинг бир неча усулини, жумладан ЭДТА билан титрлашни белгилайди.", "ГОСТ 31954-2012 устанавливает методы определения жёсткости воды, включая титрование ЭДТА.", "GOST 31954-2012 sets methods for water hardness including EDTA titration."),
           t("Автотитраторларда охирги нуқта индикатор ранги ўрнига потенциометрик ёки фотометрик датчик билан аниқланади.", "В автотитраторах конечную точку фиксирует потенциометрический или фотометрический датчик, а не глаз.", "Autotitrators detect the end point with a potentiometric or photometric sensor instead of the eye."),
           t("Ca²⁺ ни алоҳида аниқлаш учун pH 12–13 да мурексид ишлатилади, бунда Mg(OH)₂ чўкади.", "Для отдельного определения Ca²⁺ титруют при pH 12–13 с мурексидом, при этом Mg(OH)₂ осаждается.", "To determine Ca²⁺ alone, titration is done at pH 12–13 with murexide, where Mg(OH)₂ precipitates.") ],
      q: [
        q(t("Нима учун pH 12–13 да фақат кальций титрланади?", "Почему при pH 12–13 титруется только кальций?", "Why is only calcium titrated at pH 12–13?"), [t("Магний гидроксид кўринишида чўкади", "Магний осаждается в виде гидроксида", "Magnesium precipitates as hydroxide"), t("Кальций буғланади", "Кальций испаряется", "Calcium evaporates"), t("ЭДТА парчаланади", "ЭДТА разлагается", "EDTA decomposes")], 0, t("Юқори pH да Mg(OH)₂ чўкиб, титрлашга халақит бермайди.", "При высоком pH Mg(OH)₂ выпадает в осадок и не мешает.", "At high pH Mg(OH)₂ precipitates and no longer interferes.")),
        q(t("Автотитратор охирги нуқтани қандай аниқлайди?", "Как автотитратор определяет конечную точку?", "How does an autotitrator detect the end point?"), [t("Ҳидга қараб", "По запаху", "By smell"), t("Датчик сигналининг кескин ўзгариши бўйича", "По скачку сигнала датчика", "From a sharp jump in the sensor signal"), t("Вақт бўйича", "По времени", "By elapsed time")], 1, t("Электрод потенциали ёки оптик сигналнинг сакраши эквивалент нуқтага мос келади.", "Скачок потенциала электрода или оптического сигнала соответствует точке эквивалентности.", "A jump in electrode potential or optical signal marks the equivalence point."))
      ],
      task: t("Умумий қаттиқлик ва кальций бўйича натижалардан магний концентрациясини қандай ҳисоблашни ёзиб чиқинг.", "Опишите, как по общей жёсткости и кальцию рассчитать концентрацию магния.", "Explain how to calculate magnesium from total hardness and calcium results.") },

    { id: "v-carbonate-hardness-ru", yt: "n1GvwJk-pPo", top: "tahlil", st: "m", lng: "ru", ch: "Peter Win", orig: "Определение временной или карбонатной жесткости воды", ck: "2026-10-17",
      t: t("Сувнинг вақтинчалик (карбонат) қаттиқлигини аниқлаш", "Определение временной (карбонатной) жёсткости воды", "Determining temporary (carbonate) hardness"),
      sum: t("Видеода сувдаги гидрокарбонатлар туфайли юзага келадиган вақтинчалик қаттиқликни кислота билан титрлаб аниқлаш кўрсатилади.", "В видео временную жёсткость, обусловленную гидрокарбонатами, определяют титрованием кислотой.", "The video determines temporary hardness, caused by hydrogen carbonates, by titrating with acid."),
      pre: t("Нима учун қайнатиш қаттиқликнинг фақат бир қисмини йўқотади?", "Почему кипячение устраняет только часть жёсткости?", "Why does boiling remove only part of the hardness?"),
      k: [ t("Вақтинчалик қаттиқлик Ca(HCO₃)₂ ва Mg(HCO₃)₂ билан боғлиқ ва қайнатилганда йўқолади: Ca(HCO₃)₂ → CaCO₃↓ + CO₂ + H₂O.", "Временная жёсткость связана с Ca(HCO₃)₂ и Mg(HCO₃)₂ и устраняется кипячением: Ca(HCO₃)₂ → CaCO₃↓ + CO₂ + H₂O.", "Temporary hardness comes from Ca(HCO₃)₂ and Mg(HCO₃)₂ and is removed by boiling: Ca(HCO₃)₂ → CaCO₃↓ + CO₂ + H₂O."),
           t("Гидрокарбонатлар метилоранж индикатори билан HCl эритмасида сариқдан пушти рангга қадар титрланади.", "Гидрокарбонаты титруют раствором HCl с метиловым оранжевым до перехода окраски из жёлтой в розовую.", "Hydrogen carbonates are titrated with HCl using methyl orange until the colour turns from yellow to pink."),
           t("Доимий қаттиқлик сульфат ва хлоридлар билан боғлиқ бўлиб, қайнатишда йўқолмайди.", "Постоянная жёсткость обусловлена сульфатами и хлоридами и при кипячении не устраняется.", "Permanent hardness is due to sulfates and chlorides and is not removed by boiling.") ],
      q: [
        q(t("Чойнакдаги қасмоқ асосан қайси модда?", "Из чего в основном состоит накипь в чайнике?", "What is kettle scale mainly made of?"), [t("NaCl", "NaCl", "NaCl"), t("Шакар", "Сахар", "Sugar"), t("CaCO₃", "CaCO₃", "CaCO₃")], 2, t("Гидрокарбонатлар қайнаганда парчаланиб, кальций карбонат чўкмаси ҳосил қилади.", "При кипячении гидрокарбонаты разлагаются с образованием осадка карбоната кальция.", "On boiling, hydrogen carbonates decompose and calcium carbonate precipitates.")),
        q(t("Вақтинчалик қаттиқликни аниқлашда қайси индикатор ишлатилади?", "Какой индикатор используют при определении временной жёсткости?", "Which indicator is used for temporary hardness?"), [t("Метилоранж", "Метиловый оранжевый", "Methyl orange"), t("Крахмал", "Крахмал", "Starch"), t("Мурексид", "Мурексид", "Murexide")], 0, t("Эквивалент нуқтада pH ≈ 4,3–4,5 бўлиб, метилоранж шу соҳада ранг ўзгартиради.", "В точке эквивалентности pH ≈ 4,3–4,5, где метилоранж меняет окраску.", "The equivalence point is at pH ≈ 4.3–4.5, where methyl orange changes colour."))
      ],
      task: t("Бир хил сувнинг қайнатилгунча ва қайнатилгандан кейинги қаттиқлигини тест-чизиқча билан солиштиринг.", "Сравните жёсткость одной и той же воды до и после кипячения тест-полосками.", "Compare the hardness of the same water before and after boiling using test strips.") },

    { id: "v-ph-calibration-ru", yt: "8MQbKrabeTw", top: "tahlil", st: "", lng: "ru", ch: "Umax pro", orig: "Калибровка pH-метра, калибровочные буферные растворы  | официальный канал магазина www.umax.pro", ck: "2026-10-17",
      t: t("pH-метрни калибрлаш ва буфер эритмалар", "Калибровка pH-метра и буферные растворы", "Calibrating a pH meter with buffer solutions"),
      sum: t("Видеода pH-метрни стандарт буфер эритмалар ёрдамида калибрлаш тартиби кўрсатилади.", "В видео показано, как калибровать pH-метр по стандартным буферным растворам.", "The video shows how to calibrate a pH meter using standard buffer solutions."),
      pre: t("Нима учун pH-метр вақт ўтиши билан нотўғри кўрсата бошлайди?", "Почему pH-метр со временем начинает «врать»?", "Why does a pH meter drift over time?"),
      k: [ t("Одатий калибровка нуқталари: pH 4,01; 7,00 ва 10,01 (25 °C да); биринчи навбатда pH 7 ишлатилади.", "Типичные точки калибровки: pH 4,01; 7,00 и 10,01 (при 25 °C); первой берут pH 7.", "Typical calibration points are pH 4.01, 7.00 and 10.01 (at 25 °C); pH 7 is usually done first."),
           t("Идеал шиша электрод 25 °C да ҳар pH бирлигига 59,16 мВ сигнал беради; 95–105% қиялик мақбул ҳисобланади.", "Идеальный стеклянный электрод при 25 °C даёт 59,16 мВ на единицу pH; наклон 95–105% считается приемлемым.", "An ideal glass electrode gives 59.16 mV per pH unit at 25 °C; a slope of 95–105% is acceptable."),
           t("Электрод дистилланган сувда эмас, 3 М KCl сақлаш эритмасида сақланади.", "Электрод хранят не в дистиллированной воде, а в растворе 3 М KCl.", "Store the electrode in 3 M KCl storage solution, not distilled water.") ],
      q: [
        q(t("Калибрлашда биринчи бўлиб қайси буфер ишлатилади?", "Какой буфер обычно используют первым при калибровке?", "Which buffer is usually used first in calibration?"), [t("pH 1", "pH 1", "pH 1"), t("pH 7", "pH 7", "pH 7"), t("pH 14", "pH 14", "pH 14")], 1, t("pH 7 нуқтаси электроднинг нол (офсет) нуқтасини белгилайди.", "Точка pH 7 задаёт нулевую точку (смещение) электрода.", "The pH 7 point sets the electrode's zero (offset).")),
        q(t("Буфер эритмалар орасида электродни нима қилиш керак?", "Что делать с электродом между буферами?", "What should you do with the electrode between buffers?"), [t("Дистилланган сув билан чайиб, оҳиста қуритиш", "Ополоснуть дистиллированной водой и промокнуть", "Rinse with distilled water and blot gently"), t("Қуруқ латта билан қаттиқ артиш", "Сильно протереть сухой тряпкой", "Rub it hard with a dry cloth"), t("Ҳеч нарса қилмаслик", "Ничего не делать", "Do nothing")], 0, t("Чайиш буферлар аралашишининг олдини олади; ишқаланиш статик заряд ва шикастланишга олиб келади.", "Ополаскивание предотвращает перенос буфера; трение даёт статический заряд и повреждения.", "Rinsing prevents carry-over; rubbing causes static charge and damage."))
      ],
      task: t("Калибрлашдан кейин pH 4 буферини қайта ўлчаб, хатолик ±0,05 дан кичиклигини текширинг.", "После калибровки снова измерьте буфер pH 4 и проверьте, что ошибка меньше ±0,05.", "After calibrating, re-measure the pH 4 buffer and check the error is within ±0.05.") },

    { id: "v-titration-intro-khan-ru", yt: "Qt_DDqhBCg8", top: "tahlil", st: "m", lng: "ru", ch: "KhanAcademyRussian", orig: "Введение в титрование (видео 1)| Титриметрический анализ | Химия", ck: "2026-10-17",
      t: t("Титрлашга кириш", "Введение в титрование", "Introduction to titration"),
      sum: t("Хан Академия видеосида кислота-асос титрлаш тамойили ва эквивалент нуқта бўйича номаълум концентрацияни ҳисоблаш тушунтирилади.", "В видео Khan Academy объясняется принцип кислотно-основного титрования и расчёт неизвестной концентрации по точке эквивалентности.", "Khan Academy explains the principle of acid–base titration and how to calculate an unknown concentration at the equivalence point."),
      pre: t("Номаълум кислота концентрациясини қандай қилиб маълум ишқор билан топиш мумкин?", "Как найти концентрацию неизвестной кислоты с помощью известной щёлочи?", "How can a known base reveal the concentration of an unknown acid?"),
      k: [ t("Эквивалент нуқтада қўшилган титрант моль миқдори аниқланаётган модда билан стехиометрик тенг: c₁V₁ = c₂V₂ (1:1 реакция учун).", "В точке эквивалентности количество титранта стехиометрически равно определяемому веществу: c₁V₁ = c₂V₂ (для реакции 1:1).", "At the equivalence point moles of titrant equal the analyte stoichiometrically: c₁V₁ = c₂V₂ for a 1:1 reaction."),
           t("Фенолфталеин тахминан pH 8,2–10 оралиғида рангсиздан пуштига ўтади.", "Фенолфталеин меняет окраску с бесцветной на розовую примерно при pH 8,2–10.", "Phenolphthalein turns from colourless to pink at about pH 8.2–10."),
           t("Бюретка кўрсаткичи мениск пастки қисми бўйича, кўз сатҳида, 0,05 мл аниқликда ўқилади.", "Отсчёт по бюретке ведут по нижнему мениску на уровне глаз с точностью 0,05 мл.", "A burette is read at the bottom of the meniscus at eye level to 0.05 mL.") ],
      q: [
        q(t("20,0 мл HCl ни нейтраллаш учун 0,10 М NaOH дан 25,0 мл кетди. HCl концентрацияси?", "На 20,0 мл HCl ушло 25,0 мл 0,10 М NaOH. Концентрация HCl?", "25.0 mL of 0.10 M NaOH neutralises 20.0 mL of HCl. What is [HCl]?"), [t("0,080 М", "0,080 М", "0.080 M"), t("0,10 М", "0,10 М", "0.10 M"), t("0,125 М", "0,125 М", "0.125 M")], 2, t("c = 0,10 × 25,0 / 20,0 = 0,125 М.", "c = 0,10 × 25,0 / 20,0 = 0,125 М.", "c = 0.10 × 25.0 / 20.0 = 0.125 M.")),
        q(t("Индикатор нима учун керак?", "Зачем нужен индикатор?", "What is the indicator for?"), [t("Реакцияни тезлаштириш учун", "Ускорить реакцию", "To speed up the reaction"), t("Охирги нуқтани кўриш учун", "Увидеть конечную точку", "To show the end point"), t("Эритмани иситиш учун", "Нагреть раствор", "To heat the solution")], 1, t("Индикатор ранги эквивалент нуқта атрофида ўзгаради.", "Индикатор меняет цвет вблизи точки эквивалентности.", "The indicator changes colour near the equivalence point."))
      ],
      task: t("Учта параллел титрлаш натижасидан (мл) ўртачасини ҳисобланг ва 0,1 мл дан ортиқ фарқ қилганини ташланг.", "По трём параллельным титрованиям рассчитайте среднее, отбросив результат, отличающийся более чем на 0,1 мл.", "Average three replicate titres, discarding any that differ by more than 0.1 mL.") },

    { id: "v-lab-safety-ru", yt: "5-M5CF_eLu8", top: "tahlil", st: "m", lng: "ru", ch: "Химия – Просто", orig: "Техника безопасности в химической лаборатории. Химия – просто.", ck: "2026-10-17",
      t: t("Кимё лабораториясида хавфсизлик техникаси", "Техника безопасности в химической лаборатории", "Safety rules in the chemistry lab"),
      sum: t("Видеода кимё лабораториясида ишлашнинг асосий хавфсизлик қоидалари содда тилда тушунтирилади.", "В видео простым языком объясняются основные правила безопасной работы в химической лаборатории.", "The video explains the basic rules for working safely in a chemistry lab in simple terms."),
      pre: t("Концентрланган кислотани суюлтиришда нима учун кислотани сувга қуйиш керак?", "Почему при разбавлении концентрированной кислоты кислоту льют в воду?", "Why do you pour acid into water, not water into acid?"),
      k: [ t("Кислотани сувга оз-оздан қуйиш керак, аксинча эмас: ажралган иссиқлик сачрашга олиб келиши мумкин.", "Кислоту приливают к воде небольшими порциями, а не наоборот: выделяющееся тепло может вызвать разбрызгивание.", "Add acid to water in small portions, never the reverse: the heat released can cause spattering."),
           t("Учувчан ва заҳарли моддалар билан фақат сўрувчи шкафда ишланади; кўзойнак ва халат мажбурий.", "С летучими и ядовитыми веществами работают только в вытяжном шкафу; очки и халат обязательны.", "Volatile and toxic substances are handled only in a fume hood; goggles and a lab coat are mandatory."),
           t("GHS пиктограммалари (олов, бош суяги, коррозия ва б.) модда хавфини кўрсатади.", "Пиктограммы GHS (пламя, череп, коррозия и др.) указывают на опасность вещества.", "GHS pictograms (flame, skull, corrosion etc.) show a substance's hazards.") ],
      q: [
        q(t("Кўзга кислота тушса, биринчи навбатда нима қилиш керак?", "Что делать в первую очередь при попадании кислоты в глаза?", "What should you do first if acid gets in your eyes?"), [t("Ишқор томизиш", "Закапать щёлочь", "Add a base"), t("Кўзни ишқалаш", "Тереть глаза", "Rub the eyes"), t("Кўп миқдорда оқар сув билан камида 15 дақиқа ювиш", "Промывать проточной водой не менее 15 минут", "Rinse with running water for at least 15 minutes")], 2, t("Нейтраллаш реакцияси иссиқлик ажратиб, кўзни қўшимча шикастлайди; узоқ ювиш энг тўғри.", "Нейтрализация выделяет тепло и повреждает глаз; правильно — долго промывать водой.", "Neutralisation releases heat and harms the eye; prolonged rinsing is correct.")),
        q(t("Модда ҳидини қандай аниқлаш тўғри?", "Как правильно определять запах вещества?", "How should you smell a substance?"), [t("Ҳавони кафт билан ўзига томон ҳайдаб", "Направляя воздух ладонью к себе", "By wafting the air towards you"), t("Идишга бурунни яқинлаштириб", "Поднеся сосуд к носу", "By putting your nose over the container"), t("Татиб кўриб", "Попробовав на вкус", "By tasting it")], 0, t("Буғларни тўғридан-тўғри нафас олиш заҳарланишга олиб келиши мумкин.", "Прямое вдыхание паров может вызвать отравление.", "Inhaling vapours directly can poison you."))
      ],
      task: t("Мактаб лабораториясидаги учта реактив ёрлиғидаги GHS белгиларини топиб, нимани англатишини ёзинг.", "Найдите знаки GHS на этикетках трёх реактивов в школьной лаборатории и запишите их значение.", "Find the GHS symbols on three reagent labels in your school lab and write what they mean.") },

    { id: "v-soil-plant-analysis-latifundist", yt: "zhNKqkt80Sw", top: "tahlil", st: "", lng: "ru", ch: "Латифундист — все про агробизнес", orig: "Как делают анализ почвы и растений? | Агротест | Latifundist", ck: "2026-10-17",
      t: t("Тупроқ ва ўсимликлар таҳлили қандай ўтказилади?", "Как делают анализ почвы и растений?", "How are soil and plant analyses done?"),
      sum: t("Видеода агрокимёвий лабораторияда тупроқ ва ўсимлик намуналари қандай таҳлил қилиниши ҳақида ҳикоя қилинади.", "В видео рассказывается, как в агрохимической лаборатории анализируют образцы почвы и растений.", "The video shows how an agrochemical laboratory analyses soil and plant samples."),
      pre: t("Фермерга тупроқ таҳлили натижалари нима учун керак?", "Зачем фермеру результаты анализа почвы?", "Why does a farmer need soil test results?"),
      k: [ t("Стандарт агрокимёвий таҳлил pH, гумус, ҳаракатчан фосфор ва калий, нитрат азотини ўз ичига олади.", "Стандартный агрохимический анализ включает pH, гумус, подвижные фосфор и калий, нитратный азот.", "A standard agrochemical test covers pH, humus, available phosphorus and potassium and nitrate nitrogen."),
           t("Карбонатли тупроқларда (масалан, Ўзбекистон бўз тупроқлари) ҳаракатчан P ва K Мачигин усулида аниқланади (ГОСТ 26205-91).", "В карбонатных почвах (например, серозёмах Узбекистана) подвижные P и K определяют по Мачигину (ГОСТ 26205-91).", "In calcareous soils (e.g. Uzbekistan's serozems) available P and K are determined by the Machigin method (GOST 26205-91)."),
           t("Ўсимлик тўқималари таҳлили тупроқ таҳлилини тўлдиради ва озуқа элементлари етишмовчилигини эрта аниқлайди.", "Анализ растительной ткани дополняет анализ почвы и рано выявляет дефицит элементов питания.", "Plant tissue analysis complements soil testing and reveals nutrient deficiencies early.") ],
      q: [
        q(t("NPK ҳарфлари нимани билдиради?", "Что означают буквы NPK?", "What do the letters NPK stand for?"), [t("Азот, фосфор, калий", "Азот, фосфор, калий", "Nitrogen, phosphorus, potassium"), t("Натрий, қўрғошин, кальций", "Натрий, свинец, кальций", "Sodium, lead, calcium"), t("Неон, платина, криптон", "Неон, платина, криптон", "Neon, platinum, krypton")], 0, t("Бу ўсимликлар учун учта асосий макроэлемент.", "Это три главных макроэлемента питания растений.", "These are the three main plant macronutrients.")),
        q(t("Карбонатли тупроқларда ҳаракатчан фосфор қайси усулда аниқланади?", "Каким методом определяют подвижный фосфор в карбонатных почвах?", "Which method is used for available P in calcareous soils?"), [t("Кирсанов", "Кирсанова", "Kirsanov"), t("Мачигин", "Мачигина", "Machigin"), t("Винклер", "Винклера", "Winkler")], 1, t("Мачигин усулида 1% (NH₄)₂CO₃ экстракцияси ишлатилади; Кирсанов кислотали подзол тупроқлар учун.", "Метод Мачигина использует вытяжку 1% (NH₄)₂CO₃; метод Кирсанова — для кислых дерново-подзолистых почв.", "Machigin uses a 1% (NH₄)₂CO₃ extract; Kirsanov is for acidic podzolic soils."))
      ],
      task: t("Тупроқ таҳлили натижаси намунасини топиб, ҳар бир кўрсаткични «паст/ўрта/юқори» деб баҳоланг.", "Найдите пример протокола анализа почвы и оцените каждый показатель как «низкий/средний/высокий».", "Find a sample soil-test report and rate each value as «low/medium/high».") },

    { id: "v-permanganate-oxidizability", yt: "2x0txydlQes", top: "tahlil", st: "u", lng: "ru", ch: "Павлодарский химико-механический колледж", orig: "Определение перманганатной окисляемости воды | Технический анализ и контроль производства", ck: "2026-10-17",
      t: t("Сувнинг перманганат оксидланувчанлигини аниқлаш", "Определение перманганатной окисляемости воды", "Determining permanganate oxidisability of water"),
      sum: t("Коллеж лабораторияси видеосида сувдаги органик моддалар миқдорини перманганат оксидланувчанлиги орқали титриметрик аниқлаш кўрсатилади.", "В видео колледжа показано титриметрическое определение перманганатной окисляемости — показателя содержания органических веществ в воде.", "A college lab video demonstrates titrimetric determination of permanganate oxidisability, an indicator of organic matter in water."),
      pre: t("Сувдаги органик модда миқдорини нима учун кислород бирлигида ифодалашади?", "Почему количество органики в воде выражают в единицах кислорода?", "Why is organic content of water expressed in oxygen units?"),
      k: [ t("Намуна сульфат кислотали муҳитда KMnO₄ билан 10 дақиқа қайнатилади, ортиқча перманганат оксалат кислота билан қайта титрланади (ISO 8467).", "Пробу кипятят 10 минут с KMnO₄ в сернокислой среде, избыток перманганата оттитровывают через щавелевую кислоту (ISO 8467).", "The sample is boiled for 10 minutes with KMnO₄ in sulfuric acid, and excess permanganate is back-titrated via oxalic acid (ISO 8467)."),
           t("Натижа мг O/л да ифодаланади; СанПиН 1.2.3685-21 бўйича ичимлик суви учун меъёр 5 мг/л.", "Результат выражают в мг O/л; по СанПиН 1.2.3685-21 норматив для питьевой воды — 5 мг/л.", "Results are in mg O/L; Russian SanPiN 1.2.3685-21 sets 5 mg/L for drinking water."),
           t("Перманганат органиканинг фақат осон оксидланадиган қисмини оксидлайди, шунинг учун у ККС (бихромат) дан паст бўлади.", "Перманганат окисляет лишь легкоокисляемую органику, поэтому значение ниже ХПК (бихроматного).", "Permanganate oxidises only easily oxidisable organics, so values are lower than COD (dichromate).") ],
      q: [
        q(t("Перманганат оксидланувчанлиги юқори бўлса, бу нимани англатади?", "О чём говорит высокая перманганатная окисляемость?", "What does high permanganate oxidisability indicate?"), [t("Тузлар кам", "Мало солей", "Few salts"), t("Органик ифлосланиш кўп", "Много органических загрязнений", "Much organic pollution"), t("Сув юмшоқ", "Вода мягкая", "Soft water")], 1, t("Кўп органик модда кўп оксидловчи сарфлайди.", "Чем больше органики, тем больше расходуется окислителя.", "More organic matter consumes more oxidant.")),
        q(t("Қайси кўрсаткич одатда каттароқ: перманганат оксидланувчанлиги ёки ККС?", "Что обычно больше: перманганатная окисляемость или ХПК?", "Which is usually larger: permanganate value or COD?"), [t("ККС", "ХПК", "COD"), t("Перманганат оксидланувчанлиги", "Перманганатная окисляемость", "Permanganate value"), t("Доим тенг", "Всегда равны", "Always equal")], 0, t("Бихромат кучлироқ оксидловчи бўлиб, органикани деярли тўлиқ оксидлайди.", "Бихромат — более сильный окислитель и окисляет органику почти полностью.", "Dichromate is stronger and oxidises organics almost completely."))
      ],
      task: t("Водопровод, ҳовуз ва булоқ сувининг рангини солиштириб, қайсиларида органика кўпроқ бўлиши мумкинлигини тахмин қилинг.", "Сравните цвет водопроводной, прудовой и родниковой воды и предположите, где органики больше.", "Compare the colour of tap, pond and spring water and predict which has more organic matter.") },

    { id: "v-beer-lambert-olymp-ru", yt: "6Z-zs-g_RVU", top: "tahlil", st: "u", lng: "ru", ch: "Олимпиадная химия | Атриум", orig: "Фотохимия для олимпиад: вся теория + разбор задач (закон Бугера-Ламберта-Бера, спектрофотометрия)", ck: "2026-10-17",
      t: t("Спектрофотометрия ва Бугер–Ламберт–Бер қонуни: назария ва масалалар", "Спектрофотометрия и закон Бугера–Ламберта–Бера: теория и задачи", "Spectrophotometry and the Beer–Lambert law: theory and problems"),
      sum: t("Олимпиадага тайёрлов видеосида ёруғлик ютилиши, Бугер–Ламберт–Бер қонуни ва спектрофотометрияга оид масалалар таҳлил қилинади.", "В олимпиадном видео разбираются поглощение света, закон Бугера–Ламберта–Бера и задачи по спектрофотометрии.", "An olympiad-prep video covers light absorption, the Beer–Lambert law and spectrophotometry problems."),
      pre: t("Аралашмадаги икки рангли моддани битта спектрофотометр билан қандай аниқлаш мумкин?", "Как определить два окрашенных вещества в смеси на одном спектрофотометре?", "How can one spectrophotometer measure two coloured substances in a mixture?"),
      k: [ t("Оптик зичлик аддитив: аралашма учун A = Σ εᵢ·l·cᵢ, шунинг учун икки тўлқин узунлигида ўлчаб, икки номаълумни топиш мумкин.", "Оптическая плотность аддитивна: для смеси A = Σ εᵢ·l·cᵢ, поэтому, измерив при двух длинах волн, можно найти две концентрации.", "Absorbance is additive: A = Σ εᵢ·l·cᵢ, so measuring at two wavelengths can solve for two concentrations."),
           t("Ўлчаш одатда модданинг максимал ютилиш тўлқин узунлигида (λmax) ўтказилади — бу энг юқори сезгирлик беради.", "Измерения обычно проводят при длине волны максимума поглощения (λmax) — это даёт наибольшую чувствительность.", "Measurements are usually made at the absorption maximum (λmax) for the highest sensitivity."),
           t("Қонун суюлтирилган эритмаларда бажарилади; юқори концентрацияда чизиқлиликдан четланиш кузатилади.", "Закон выполняется для разбавленных растворов; при высоких концентрациях наблюдаются отклонения от линейности.", "The law holds for dilute solutions; at high concentrations deviations from linearity occur.") ],
      q: [
        q(t("Нима учун ўлчаш λmax да бажарилади?", "Почему измерение проводят при λmax?", "Why measure at λmax?"), [t("Ёруғлик арзонроқ", "Свет дешевле", "The light is cheaper"), t("Эритма исимайди", "Раствор не нагревается", "The solution does not heat up"), t("Сезгирлик энг юқори ва хатолик кам", "Максимальная чувствительность и минимальная ошибка", "Highest sensitivity and lowest error")], 2, t("λmax да ε энг катта ва тўлқин узунлигининг кичик силжиши натижага кам таъсир қилади.", "При λmax ε максимален, а небольшой сдвиг длины волны мало влияет на результат.", "At λmax ε is largest and small wavelength shifts barely affect the result.")),
        q(t("Кювета қалинлиги 1 дан 2 см га оширилса, A қандай ўзгаради?", "Как изменится A, если толщину кюветы увеличить с 1 до 2 см?", "How does A change if path length goes from 1 to 2 cm?"), [t("Икки баравар ортади", "Увеличится вдвое", "It doubles"), t("Икки баравар камаяди", "Уменьшится вдвое", "It halves"), t("Ўзгармайди", "Не изменится", "It does not change")], 0, t("A қатлам қалинлиги l га тўғри пропорционал.", "A прямо пропорциональна толщине слоя l.", "A is directly proportional to path length l."))
      ],
      task: t("Учта стандарт эритма учун A–c калибровка графигини чизиб, номаълум намуна концентрациясини график бўйича топинг.", "Постройте градуировочный график A–c по трём стандартам и найдите концентрацию неизвестной пробы.", "Plot an A–c calibration line from three standards and read off an unknown sample's concentration.") },

    { id: "v-soil-sampling-ru", yt: "8Tl-t1NVDcY", top: "tahlil", st: "", lng: "ru", ch: "САД, ОГОРОД,СВОИМИ РУКАМИ", orig: "Как отобрать образцы почвы для анализа в агролаборатории.", ck: "2026-10-17",
      t: t("Агролаборатория учун тупроқ намунасини олиш", "Как отобрать образцы почвы для анализа в агролаборатории", "Taking soil samples for laboratory analysis"),
      sum: t("Видеода тупроқ намунасини агрокимёвий лабораторияга юбориш учун қандай тўғри олиш кераклиги тушунтирилади.", "В видео объясняется, как правильно отобрать почвенные образцы для отправки в агрохимическую лабораторию.", "The video explains how to correctly take soil samples to send to an agrochemical laboratory."),
      pre: t("Нима учун битта нуқтадан олинган намуна бутун майдонни ифодалай олмайди?", "Почему проба из одной точки не отражает весь участок?", "Why can a single-spot sample not represent a whole field?"),
      k: [ t("Аралаш (умумлаштирилган) намуна майдон бўйича «зигзаг» шаклида 15–20 нуқтадан олинган тупроқдан тузилади.", "Смешанный образец составляют из 15–20 точечных проб, отобранных по участку «зигзагом».", "A composite sample is made from 15–20 cores taken across the plot in a zigzag pattern."),
           t("Ҳайдалма қатлам учун намуна одатда 0–20 (0–25) см чуқурликдан олинади (ГОСТ 28168-89).", "Для пахотного слоя пробы обычно берут с глубины 0–20 (0–25) см (ГОСТ 28168-89).", "For the plough layer samples are usually taken at 0–20 (0–25) cm depth (GOST 28168-89)."),
           t("Ўғит уюмлари, йўл четлари ва компост жойларидан намуна олинмайди; намуна хона ҳароратида қуритилади.", "Не берут пробы у куч удобрений, дорог и компоста; образец сушат при комнатной температуре.", "Avoid fertiliser heaps, road edges and compost spots; air-dry the sample at room temperature.") ],
      q: [
        q(t("Аралаш намуна учун тахминан нечта нуқтадан тупроқ олинади?", "Из скольких точек примерно составляют смешанный образец?", "About how many cores make up a composite sample?"), [t("1", "1", "1"), t("15–20", "15–20", "15–20"), t("1000", "1000", "1000")], 1, t("Бу майдоннинг ўзгарувчанлигини ҳисобга олиш учун етарли ва амалий сон.", "Этого достаточно, чтобы учесть неоднородность участка, и практично.", "That captures field variability while staying practical.")),
        q(t("Намунани лабораторияга юборишдан олдин қандай қуритиш керак?", "Как сушить образец перед отправкой в лабораторию?", "How should a sample be dried before sending?"), [t("Хона ҳароратида, соя жойда", "При комнатной температуре в тени", "At room temperature in the shade"), t("Духовкада 250 °C да", "В духовке при 250 °C", "In an oven at 250 °C"), t("Қуритмаслик, ҳўл ҳолда ёпиқ пакетда бир ҳафта сақлаш", "Хранить мокрым в закрытом пакете неделю", "Keep it wet in a sealed bag for a week")], 0, t("Юқори ҳарорат азот шакллари ва органик моддаларни ўзгартиради, ҳўл сақлаш эса микробиологик ўзгаришларга олиб келади.", "Высокая температура меняет формы азота и органику, а хранение во влажном виде — микробиологически.", "High heat alters nitrogen forms and organics; storing wet allows microbial changes."))
      ],
      task: t("Мактаб ёки ҳовли участкаси учун зигзаг намуна олиш схемасини чизинг ва нуқталарни белгиланг.", "Нарисуйте схему отбора проб «зигзагом» для пришкольного или дачного участка.", "Draw a zigzag sampling plan for a school or garden plot and mark the points.") },

    { id: "v-uz-soil-texture", yt: "beHaTuxjGQQ", top: "tahlil", st: "u", lng: "uz", ch: "Shohruh Abdullayev ", orig: "Tuproq mexanik tarkibi", ck: "2026-10-17",
      t: t("Тупроқнинг механик таркиби", "Механический состав почвы", "Soil mechanical composition"),
      sum: t("Ўзбек тилидаги видеода тупроқнинг механик (гранулометрик) таркиби, яъни турли катталикдаги заррачалар нисбати ҳақида гапирилади.", "В видео на узбекском языке рассказывается о механическом (гранулометрическом) составе почвы — соотношении частиц разного размера.", "An Uzbek-language video on soil mechanical (particle-size) composition — the proportions of particles of different sizes."),
      pre: t("Қумоқ ва соз тупроқ сувни қандай ушлаб туради?", "Как удерживают воду песчаная и глинистая почвы?", "How do sandy and clay soils hold water?"),
      k: [ t("Качинский таснифида 0,01 мм дан кичик заррачалар «физик лой», каттароқлари «физик қум» деб аталади.", "В классификации Качинского частицы мельче 0,01 мм называют «физической глиной», крупнее — «физическим песком».", "In Kachinsky's classification particles below 0.01 mm are «physical clay» and larger ones «physical sand»."),
           t("Физик лой миқдорига кўра тупроқлар қум, қумлоқ, енгил, ўрта ва оғир қумоқ ҳамда соз тупроқларга бўлинади.", "По содержанию физической глины почвы делят на песчаные, супесчаные, лёгко-, средне- и тяжелосуглинистые и глинистые.", "By physical clay content soils are classed as sand, sandy loam, light, medium and heavy loam, and clay."),
           t("Механик таркиб тупроқнинг сув ўтказувчанлиги, намлик сиғими ва озуқа моддаларни ушлашини белгилайди.", "Механический состав определяет водопроницаемость, влагоёмкость и поглотительную способность почвы.", "Mechanical composition controls permeability, water-holding capacity and nutrient retention.") ],
      q: [
        q(t("Қайси тупроқ сувни энг тез ўтказади?", "Какая почва быстрее всего пропускает воду?", "Which soil drains fastest?"), [t("Соз", "Глинистая", "Clay"), t("Қумли", "Песчаная", "Sandy"), t("Оғир қумоқ", "Тяжелосуглинистая", "Heavy loam")], 1, t("Қум заррачалари орасидаги йирик ғоваклар сувни тез ўтказади.", "Крупные поры между песчинками быстро пропускают воду.", "Large pores between sand grains let water pass quickly.")),
        q(t("Качинский бўйича «физик лой» қандай заррачалар?", "Что такое «физическая глина» по Качинскому?", "What is «physical clay» in Kachinsky's system?"), [t("0,01 мм дан кичик", "Частицы мельче 0,01 мм", "Particles smaller than 0.01 mm"), t("1 мм дан катта", "Крупнее 1 мм", "Larger than 1 mm"), t("Фақат органик модда", "Только органическое вещество", "Only organic matter")], 0, t("Бу чегара МДҲ тупроқшунослигида кенг қўлланилади.", "Эта граница широко используется в почвоведении стран СНГ.", "This boundary is widely used in CIS soil science."))
      ],
      task: t("Тупроқни ҳўллаб, кафтда «чилвир» ясаб кўринг ва ҳалқа бўлишига қараб механик таркибини тахмин қилинг.", "Смочите почву, скатайте «шнур» и по тому, сворачивается ли он в кольцо, оцените механический состав.", "Moisten soil, roll it into a cord and judge texture by whether it bends into a ring.") },

    { id: "v-uz-soil-humus", yt: "xiWVg69V0Rk", top: "tahlil", st: "u", lng: "uz", ch: "TIPU Masofaviy ta'lim", orig: "Mavzu: Tuproq organik moddasi, tuproq gumusi uning tarkibi va unumdorlikdagi ahamyati.", ck: "2026-10-17",
      t: t("Тупроқ органик моддаси ва гумуси, унинг унумдорликдаги аҳамияти", "Органическое вещество и гумус почвы, их роль в плодородии", "Soil organic matter and humus and their role in fertility"),
      sum: t("Масофавий таълим маърузасида тупроқ органик моддаси, гумуснинг таркиби ва унинг тупроқ унумдорлигидаги аҳамияти ёритилади.", "В дистанционной лекции освещаются органическое вещество почвы, состав гумуса и его значение для плодородия.", "A distance-learning lecture covers soil organic matter, the composition of humus and its importance for fertility."),
      pre: t("Нима учун қора тупроқлар бўз тупроқлардан унумдорроқ?", "Почему чернозёмы плодороднее серозёмов?", "Why are chernozems more fertile than serozems?"),
      k: [ t("Гумус асосан гумин кислоталар, фульвокислоталар ва гуминлардан иборат.", "Гумус состоит в основном из гуминовых кислот, фульвокислот и гуминов.", "Humus consists mainly of humic acids, fulvic acids and humins."),
           t("Тюрин усулида органик углерод K₂Cr₂O₇ ва H₂SO₄ билан оксидланади; гумус ≈ C × 1,724 (ГОСТ 26213).", "По Тюрину органический углерод окисляют K₂Cr₂O₇ в H₂SO₄; гумус ≈ C × 1,724 (ГОСТ 26213).", "In the Tyurin method organic carbon is oxidised by K₂Cr₂O₇ in H₂SO₄; humus ≈ C × 1.724 (GOST 26213)."),
           t("Ўзбекистон бўз тупроқларида гумус одатда 1–2% атрофида, қора тупроқларда эса 6–10% ва ундан кўп.", "В серозёмах Узбекистана гумуса обычно около 1–2%, в чернозёмах — 6–10% и более.", "Uzbekistan's serozems usually hold about 1–2% humus, chernozems 6–10% or more.") ],
      q: [
        q(t("Тюрин усулида гумус миқдорини топиш учун углерод нечага кўпайтирилади?", "На какой коэффициент умножают углерод, чтобы получить гумус по Тюрину?", "By what factor is carbon multiplied to get humus (Tyurin)?"), [t("0,58", "0,58", "0.58"), t("10", "10", "10"), t("1,724", "1,724", "1.724")], 2, t("Гумус таркибида ўртача 58% углерод бор деб қабул қилинади: 1/0,58 ≈ 1,724.", "Принято, что гумус содержит в среднем 58% углерода: 1/0,58 ≈ 1,724.", "Humus is assumed to be 58% carbon: 1/0.58 ≈ 1.724.")),
        q(t("Гумус тупроққа қандай фойда беради?", "Какую пользу почве приносит гумус?", "How does humus benefit soil?"), [t("Структура ва намлик сиғимини яхшилайди", "Улучшает структуру и влагоёмкость", "It improves structure and water-holding capacity"), t("Тупроқни шўрлатади", "Засоляет почву", "It makes soil saline"), t("Озуқаларни ювиб юборади", "Вымывает элементы питания", "It leaches nutrients away")], 0, t("Гумус агрегатларни ёпиштиради, сув ва катионларни ушлаб, озуқани секин ажратади.", "Гумус склеивает агрегаты, удерживает воду и катионы, постепенно высвобождает питание.", "Humus binds aggregates, holds water and cations and releases nutrients slowly."))
      ],
      task: t("Тупроқдаги органик углерод 0,8% бўлса, гумус фоизини ҳисобланг (≈1,4%).", "Если органического углерода в почве 0,8%, рассчитайте содержание гумуса (≈1,4%).", "If soil organic carbon is 0.8%, calculate the humus content (≈1.4%).") }
  ];

  window.EKO_VIDEOS = { topics: TOPICS, list: V, checked: "2026-10-17" };
})();
