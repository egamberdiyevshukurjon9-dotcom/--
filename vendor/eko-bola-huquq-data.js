/* Экомун — 🎒 «Табиат ҳимоячиси» (мактаб босқичи учун экологик ҳуқуқ) маълумотлари.
   Университет бўлимидаги «Экологик ҳуқуқ» (vendor/eko-qonun-data.js) асосида болалар тилига
   соддалаштирилган: ҳикоялар, Конституция моддалари, саралаш ўйини, амалий дарслар,
   болалар суди, «Сирли дарё» квести ва викторина.
   Амалий дарслар Shukurjon юборган «grok-workspace» архивидаги «Kichik ekolog», «Yosh tadqiqotchi»
   ва «STEAM-ekologiya» курсларидан олиниб, кирилл, рус ва инглиз тилларига ўгирилди.
   Ҳар бир матн t3(ўзбек кирилл, рус, инглиз); лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const LEX_CONST = "https://lex.uz/docs/6445145";

  /* ---------- 1. Ҳикоялар («ўз йўлингни танла», Choose Your Own Adventure) ---------- */
  const STORIES = [
    {
      id: "tomchi", ic: "💧", art: "68", scene: "🏡🚰💧",
      t: t3("Томчи қаерга шошяпти?", "Куда спешит Капелька?", "Where is Droplet rushing to?"),
      pages: [
        { x: t3("Эрталаб Азиз тиш ювяпти. Жўмракдан кичкина Томчи сакраб тушди: «Мени тоғдаги булоқдан узоқ йўл босиб олиб келишди. Наҳотки мен шунчаки оқиб кетаман?» Азиз нима қилади?",
            "Утром Азиз чистит зубы. Из крана выпрыгнула маленькая Капелька: «Меня везли издалека, от горного родника. Неужели я просто утеку?» Что сделает Азиз?",
            "In the morning Aziz is brushing his teeth. A tiny Droplet jumps out of the tap: “I travelled all the way from a mountain spring. Am I just going to run down the drain?” What will Aziz do?"),
          teen: t3("Билиб қўй: Конституциянинг 68-моддасида сув «умуммиллий бойлик» деб ёзилган. Ундан оқилона фойдаланиш шарт.", "Знай: в статье 68 Конституции вода названа «общенациональным богатством». Ею нужно пользоваться рационально.", "Did you know? Article 68 of the Constitution calls water “national wealth” that must be used wisely."),
          ch: [
            { t: t3("Стаканга сув олиб, жўмракни ёпади", "Наберёт воду в стакан и закроет кран", "Fill a cup and turn the tap off"), ok: true, why: t3("Офарин! Стакан билан бир неча литр сув тежалади.", "Молодец! Со стаканом экономятся несколько литров воды.", "Well done! A cup saves several litres of water.") },
            { t: t3("Жўмрак очиқ қолади — сув кўп-ку!", "Оставит кран открытым — воды ведь много!", "Leave the tap running — there is plenty of water!"), ok: false, why: t3("Тоза ичимлик суви қувур, насос ва тозалаш иншооти орқали келади. У чексиз эмас.", "Чистая питьевая вода идёт через трубы, насосы и очистные сооружения. Она не бесконечна.", "Clean drinking water comes through pipes, pumps and treatment plants. It is not endless.") }
          ] },
        { x: t3("Кечқурун Азиз ҳовлида томчилаб турган жўмракни кўрди: «тап… тап… тап». Бу кичкина товуш катта йўқотишми?",
            "Вечером Азиз увидел во дворе капающий кран: «кап… кап… кап». Этот тихий звук — большая потеря?",
            "In the evening Aziz sees a dripping tap in the yard: “drip… drip… drip”. Is this small sound a big loss?"),
          teen: t3("Ҳисобла: секундига 1 томчи ≈ 0,05 мл. Бир суткада 86 400 томчи — тахминан 4 литр!", "Посчитай: 1 капля в секунду ≈ 0,05 мл. За сутки 86 400 капель — около 4 литров!", "Work it out: 1 drop a second ≈ 0.05 ml. That is 86,400 drops a day — about 4 litres!"),
          ch: [
            { t: t3("Катталарга айтиб, жўмракни тузаттиради", "Скажет взрослым, чтобы кран починили", "Tell an adult so the tap gets fixed"), ok: true, why: t3("Тўғри! Бир йилда минглаб литр сув сақланиб қолади.", "Верно! За год сохранятся тысячи литров.", "Right! Thousands of litres are saved in a year.") },
            { t: t3("Ҳеч нарса қилмайди: бу бир томчи холос", "Ничего не сделает: это всего лишь капля", "Do nothing: it is only a drop"), ok: false, why: t3("Томчилар қўшилиб, суткасига бир челак сув бўлади.", "Капли складываются в ведро воды за сутки.", "The drops add up to a bucket of water a day.") }
          ] }
      ],
      learn: t3("Сув — ҳаммамизнинг бойлигимиз. Уни асраш — ҳар биримизнинг бурчимиз.", "Вода — наше общее богатство. Беречь её — долг каждого.", "Water is everyone’s wealth. Saving it is everyone’s duty."),
      p4c: t3("Агар сув пулсиз бўлса ҳам, уни тежаш керакми? Нега?", "Если бы вода была бесплатной, нужно ли было бы её экономить? Почему?", "If water were free, would we still need to save it? Why?")
    },
    {
      id: "chinor", ic: "🌳", art: "61", scene: "🏫🌳🪓",
      t: t3("Мактаб ҳовлисидаги кекса чинор", "Старая чинара во дворе школы", "The old plane tree in the school yard"),
      pages: [
        { x: t3("Мактаб ҳовлисида 80 ёшли чинор бор. Бир куни ишчилар келиб: «Уни кесамиз, ўрнига автотураргоҳ бўлади», дейишди. Мадина нима қилади?",
            "Во дворе школы растёт 80-летняя чинара. Однажды пришли рабочие: «Срубим её, здесь будет парковка». Что сделает Мадина?",
            "There is an 80-year-old plane tree in the school yard. One day workers arrive: “We will cut it down and build a car park.” What will Madina do?"),
          teen: t3("61-модда: фуқаролар табиий меросни асраб-авайлаши шарт. Кесиш учун ҳужжат — асос керак.", "Статья 61: граждане обязаны беречь природное наследие. Для вырубки нужен документ-основание.", "Article 61: citizens must protect natural heritage. Felling needs a legal basis document."),
          ch: [
            { t: t3("Ўқитувчи ва директорга айтади, ҳужжатни сўрашади", "Скажет учителю и директору, они спросят документ", "Tell the teacher and the head, who ask to see the permit"), ok: true, why: t3("Тўғри йўл: катталар орқали «қандай асос билан?» деб сўраш.", "Правильный путь: через взрослых спросить «на каком основании?».", "The right way: ask through adults “on what basis?”.") },
            { t: t3("Дарахтга чиқиб олади ва тушмайди", "Залезет на дерево и не слезет", "Climb the tree and refuse to come down"), ok: false, why: t3("Бу хавфли! Ҳимоя қилиш — қонуний йўл билан, ўзингни хавфга қўймасдан.", "Это опасно! Защищать нужно законным путём, не рискуя собой.", "That is dangerous! Protect nature the lawful way, without putting yourself at risk.") }
          ] },
        { x: t3("Маълум бўлдики, кесишга рухсат йўқ экан. Энди синф нима қила олади?",
            "Оказалось, разрешения на вырубку нет. Что теперь может сделать класс?",
            "It turns out there is no permit to cut the tree. What can the class do now?"),
          ch: [
            { t: t3("Чинорга ёрлиқ осиб, унинг «паспорти»ни тузади", "Повесит табличку и составит «паспорт» чинары", "Put up a sign and make the tree’s “passport”"), ok: true, why: t3("Зўр! Дарахт ёши, бўйи ва соя майдонини ёзиш — табиий меросни ҳужжатлаш.", "Отлично! Записать возраст, высоту и площадь тени — значит задокументировать природное наследие.", "Great! Recording its age, height and shade area documents natural heritage.") },
            { t: t3("Ҳамма уйига кетади", "Все разойдутся по домам", "Everyone goes home"), ok: false, why: t3("Бу сафар омад кулди, лекин кузатув давом этиши керак.", "В этот раз повезло, но наблюдение нужно продолжать.", "Lucky this time, but someone has to keep watching.") }
          ] }
      ],
      learn: t3("Кекса дарахт — табиий мерос. Уни асраш ҳам фуқаронинг, ҳам давлатнинг вазифаси.", "Старое дерево — природное наследие. Его берегут и граждане, и государство.", "An old tree is natural heritage. Citizens and the state both protect it."),
      p4c: t3("Дарахтнинг «ҳуқуқи» борми? Ким унинг номидан гапира олади?", "Есть ли у дерева «права»? Кто может говорить от его имени?", "Does a tree have “rights”? Who can speak for it?")
    },
    {
      id: "ariq", ic: "🎨", art: "66", scene: "🏭➡️🌊🐟",
      t: t3("Ариқдаги кўк сув", "Синяя вода в арыке", "Blue water in the canal"),
      pages: [
        { x: t3("Маҳалладаги ариқда сув бирдан кўкариб, ёмон ҳид келди. Балиқчалар кўринмай қолди. Сарвар ариқ бўйлаб юриб, кичик бўёқ цехидан қувур чиқиб турганини кўрди.",
            "Вода в арыке махалли вдруг посинела и плохо запахла. Рыбки пропали. Сарвар прошёл вдоль арыка и увидел трубу из маленького красильного цеха.",
            "The water in the neighbourhood canal suddenly turns blue and smells bad. The little fish disappear. Sarvar walks along the canal and sees a pipe coming from a small dye workshop."),
          teen: t3("66-модда: мулкдан фойдаланиш атроф-муҳитга зарар етказмаслиги керак. «Бу менинг цехим» деган баҳона ўтмайди.", "Статья 66: пользование собственностью не должно вредить среде. Отговорка «это мой цех» не работает.", "Article 66: using property must not harm the environment. “It’s my workshop” is no excuse."),
          ch: [
            { t: t3("Расм олиб, жой ва вақтни ёзади, катталарга кўрсатади", "Сфотографирует, запишет место и время, покажет взрослым", "Take a photo, note the place and time, and show an adult"), ok: true, why: t3("Тўғри! Бу — далил. Катталар экология инспекциясига мурожаат қилади.", "Верно! Это доказательство. Взрослые обратятся в экологическую инспекцию.", "Right! That is evidence. Adults can report it to the environmental inspectors.") },
            { t: t3("Сувни қўли билан текшириб кўради", "Потрогает воду руками", "Touch the water to check it"), ok: false, why: t3("Йўқ! Номаълум бўёқ терига зарар қилиши мумкин. Тегмасдан кузатамиз.", "Нет! Неизвестная краска может навредить коже. Наблюдаем, не трогая.", "No! An unknown dye can harm your skin. Watch without touching.") }
          ] },
        { x: t3("Инспектор келиб, сувдан намуна олди. Лабораторияда бўёқ топилди. Энди нима бўлади?",
            "Инспектор взял пробу воды. В лаборатории нашли краску. Что будет дальше?",
            "An inspector takes a water sample. The lab finds dye in it. What happens next?"),
          ch: [
            { t: t3("Цех оқизишни тўхтатади ва тозалаш қурилмаси ўрнатади", "Цех прекратит сброс и установит очистку", "The workshop stops the discharge and installs treatment"), ok: true, why: t3("Тўғри: аввал зарарни тўхтатиш, кейин тузатиш ва жавоб бериш.", "Верно: сначала остановить вред, затем исправить и отвечать по закону.", "Right: first stop the harm, then fix it and answer to the law.") },
            { t: t3("Ҳеч нарса: ахир сув оқиб кетади", "Ничего: вода ведь утечёт", "Nothing: the water flows away anyway"), ok: false, why: t3("Ифлос сув пастдаги экин, ҳайвон ва одамларга етиб боради.", "Грязная вода дойдёт до полей, животных и людей ниже по течению.", "Dirty water reaches crops, animals and people downstream.") }
          ] }
      ],
      learn: t3("Ўз мулкингдан фойдаланиб, табиатга зарар етказиш мумкин эмас. Далил тўплаш — ҳимоянинг биринчи қадами.", "Нельзя вредить природе, пользуясь своей собственностью. Сбор доказательств — первый шаг защиты.", "You may not harm nature by using your property. Gathering evidence is the first step to protect it."),
      p4c: t3("Цех ишчилари ҳам маҳалламиздан бўлса, уларни қандай қилиб адолатли ҳимоя қилиш мумкин?", "Если рабочие цеха — тоже из нашей махалли, как поступить справедливо?", "If the workshop staff live in our neighbourhood too, what would be fair?")
    },
    {
      id: "olov", ic: "🔥", art: "62", scene: "⛺🔥🌾",
      t: t3("Пикникдан кейинги олов", "Костёр после пикника", "The fire after the picnic"),
      pages: [
        { x: t3("Оила тоғ этагида пикник қилди. Кетиш вақти келди, гулханда ҳали чўғ ёниб турибди. Шамол турди. Нодира нима қилишни таклиф қилади?",
            "Семья отдыхала у подножия гор. Пора уходить, а в костре ещё тлеют угли. Поднялся ветер. Что предложит Нодира?",
            "The family had a picnic in the foothills. It is time to go, but embers are still glowing in the fire. The wind picks up. What does Nodira suggest?"),
          teen: t3("62-модда: фуқаролар табиатга эҳтиёткорона муносабатда бўлишга мажбур.", "Статья 62: граждане обязаны бережно относиться к природе.", "Article 62: citizens must treat nature with care."),
          ch: [
            { t: t3("Сув сепиб, тупроқ билан кўмиб, тегиб кўриб текширади", "Залить водой, засыпать землёй и проверить, что остыло", "Pour water, cover with soil, and check it is cold"), ok: true, why: t3("Офарин! Чўғ совуганини қўлни яқин тутиб текширамиз.", "Молодец! Проверяем, поднеся руку, что угли остыли.", "Well done! Hold your hand near to check the embers are cold.") },
            { t: t3("Ўзи ўчади, кетаверамиз", "Само погаснет, уходим", "It will go out by itself, let’s go"), ok: false, why: t3("Шамолда битта учқун қуруқ ўтни ёндириб, ёнғин бошланиши мумкин.", "На ветру одна искра может поджечь сухую траву и начать пожар.", "In the wind one spark can light dry grass and start a wildfire.") }
          ] },
        { x: t3("Қайтишда йўл бўйида пластик идишлар сочилиб ётганини кўрдилар. Ўзлариники эмас.",
            "По дороге назад они увидели разбросанные пластиковые бутылки. Не свои.",
            "On the way back they see plastic bottles scattered by the path. Not theirs."),
          ch: [
            { t: t3("Қўлқоп кийиб, йиғиб, саралаш қутисига ташлайди", "Наденут перчатки, соберут и выбросят в контейнер для сортировки", "Put on gloves, pick them up and take them to a recycling bin"), ok: true, why: t3("Бу — «Табиат ҳимоячиси» иши! Ўзгалар хатосини ҳам тузатиш мумкин.", "Это работа «Защитника природы»! Можно исправлять и чужие ошибки.", "That is a Nature Defender’s job! You can fix other people’s mistakes too.") },
            { t: t3("Бизники эмас, тегмаймиз", "Не наше, не трогаем", "Not ours, leave it"), ok: false, why: t3("Табиат ҳаммамизники. Хавфсиз бўлса, ёрдам бериш яхши.", "Природа общая. Если безопасно — лучше помочь.", "Nature belongs to all of us. If it is safe, helping is better.") }
          ] }
      ],
      learn: t3("Эҳтиёткорлик — табиатга зарарни олдиндан кўриб, олдини олиш.", "Бережность — предвидеть вред природе и не допускать его.", "Care means seeing harm coming and preventing it."),
      p4c: t3("«Эҳтиёткор бўлиш» билан «жаримадан қўрқиш» бир хил нарсами?", "«Быть бережным» и «бояться штрафа» — одно и то же?", "Is “being careful” the same as “being afraid of a fine”?")
    },
    {
      id: "paket", ic: "🛍️", art: "49", scene: "🛒🛍️🐢",
      t: t3("Бозордаги пакет ва тошбақа", "Пакет с рынка и черепаха", "The market bag and the tortoise"),
      pages: [
        { x: t3("Лола бувиси билан бозорга борди. Сотувчи ҳар бир помидорни алоҳида пакетга солмоқчи. Лоланинг сумкасида мато халта бор.",
            "Лола пошла с бабушкой на рынок. Продавец хочет положить каждый помидор в отдельный пакет. В сумке у Лолы есть тканевая сумка.",
            "Lola goes to the market with her grandmother. The seller wants to put every tomato in its own plastic bag. Lola has a cloth bag with her."),
          teen: t3("Пластик пакет табиатда юзлаб йил парчаланмайди. Чўлдаги тошбақа уни овқат деб ўйлаши мумкин.", "Пластиковый пакет разлагается в природе сотни лет. Черепаха в пустыне может принять его за еду.", "A plastic bag takes hundreds of years to break down. A desert tortoise may think it is food."),
          ch: [
            { t: t3("«Раҳмат, бизда халта бор» дейди", "Скажет: «Спасибо, у нас есть сумка»", "Say “Thank you, we have a bag”"), ok: true, why: t3("Зўр! Энг яхши чиқинди — умуман пайдо бўлмаган чиқинди.", "Отлично! Лучший мусор — тот, которого не стало.", "Great! The best waste is waste that never exists.") },
            { t: t3("Ҳар бирини алоҳида пакетга солдиради", "Попросит каждый в отдельный пакет", "Ask for each one in a separate bag"), ok: false, why: t3("Бир хариддан 5 та пакет — бир йилда юзлаб пакет бўлади.", "5 пакетов с одной покупки — сотни пакетов за год.", "Five bags from one trip become hundreds in a year.") }
          ] },
        { x: t3("Уйга келиб, Лола «Ҳавомиз қандай?» деб сўради. Бувиси: «Билмадим», деди. Бу ҳақда ким айтиши керак?",
            "Дома Лола спросила: «Какой у нас воздух?» Бабушка ответила: «Не знаю». Кто должен об этом сообщать?",
            "At home Lola asks, “How clean is our air?” Grandma says, “I don’t know.” Who should tell us?"),
          teen: t3("49-модда: ҳар ким атроф-муҳит ҳолати ҳақида ишончли ахборот олиш ҳуқуқига эга.", "Статья 49: каждый имеет право на достоверную информацию о состоянии окружающей среды.", "Article 49: everyone has the right to reliable information about the state of the environment."),
          ch: [
            { t: t3("Расмий манба: Гидромет хизмати маълумоти", "Официальный источник: данные гидрометслужбы", "An official source: the hydromet service"), ok: true, why: t3("Тўғри! Ишончли ахборот — ўлчов асбоби ва расмий манбадан.", "Верно! Достоверная информация — от приборов и официальных источников.", "Right! Reliable information comes from instruments and official sources.") },
            { t: t3("Ижтимоий тармоқдаги видео", "Видео из соцсетей", "A social media video"), ok: false, why: t3("Видео — сигнал бўлиши мумкин, лекин ўлчов эмас. Рақамни текширамиз.", "Видео может быть сигналом, но не измерением. Цифры проверяем.", "A video can be a signal, but not a measurement. We check the numbers.") }
          ] }
      ],
      learn: t3("Тоза муҳит ва у ҳақда тўғри ахборот олиш — ҳар биримизнинг ҳуқуқимиз.", "Чистая среда и правдивая информация о ней — право каждого.", "A clean environment and true information about it are everyone’s right."),
      p4c: t3("Агар ҳамма пакетдан воз кечса, сотувчи нима йўқотади ва нима топади?", "Если все откажутся от пакетов, что продавец потеряет и что приобретёт?", "If everyone gave up plastic bags, what would the seller lose and gain?")
    }
  ];

  /* ---------- 2. Конституция — болалар тилида ---------- */
  const CONST = [
    { n: "49", ic: "🌤️", t: t3("Тоза муҳит — ҳуқуқинг", "Чистая среда — твоё право", "A clean environment is your right"),
      kid: t3("Ҳар бир одам тоза ҳаво, тоза сув ва соғлом табиатда яшаши мумкин. Табиат ҳақида тўғри маълумот олиш ҳам ҳуқуқинг.", "Каждый может жить с чистым воздухом, чистой водой и здоровой природой. Получать правду о природе — тоже твоё право.", "Everyone may live with clean air, clean water and healthy nature. Getting the truth about nature is your right too."),
      teen: t3("Шаҳарсозлик лойиҳалари жамоатчилик муҳокамасидан ўтказилади. Давлат Оролбўйини тиклаш чораларини кўради.", "Проекты градостроительных документов проходят общественное обсуждение. Государство принимает меры по восстановлению Приаралья.", "Urban planning drafts go through public discussion. The state takes measures to restore the Aral Sea region."),
      who: "🙋", ex: t3("Маҳаллада янги бозор қурилмоқчи. Оилангиз лойиҳани муҳокамада кўриши мумкин.", "В махалле хотят построить рынок. Ваша семья может увидеть проект на обсуждении.", "A new market is planned nearby. Your family can see the plan in a public discussion.") },
    { n: "61", ic: "🏞️", t: t3("Табиий меросни асра", "Береги природное наследие", "Protect natural heritage"),
      kid: t3("Қадимий дарахтлар, булоқлар ва қўриқхоналар — бобо-бувиларимиздан қолган мерос. Уни асраш шарт.", "Древние деревья, родники и заповедники — наследие предков. Их нужно беречь.", "Ancient trees, springs and nature reserves are what our grandparents left us. We must protect them."),
      teen: t3("Тарихий, маданий, илмий ва табиий мерос давлат томонидан муҳофаза қилинади; фуқаролар уни асраб-авайлаши шарт.", "Историческое, культурное, научное и природное наследие охраняется государством; граждане обязаны его беречь.", "Historical, cultural, scientific and natural heritage is protected by the state; citizens must preserve it."),
      who: "🤝", ex: t3("Қўриқхонада гул узиш — «кичкина нарса» эмас, меросга зарар.", "Сорвать цветок в заповеднике — не «мелочь», а вред наследию.", "Picking a flower in a reserve is not “nothing”; it harms heritage.") },
    { n: "62", ic: "🫶", t: t3("Табиатга эҳтиёткор бўл", "Будь бережен к природе", "Be careful with nature"),
      kid: t3("Ахлат ташламаймиз, сувни исроф қилмаймиз, дарахт синдирмаймиз, оловни ўчирамиз.", "Не мусорим, не тратим воду зря, не ломаем деревья, тушим костёр.", "We don’t litter, waste water, break trees, or leave fires burning."),
      teen: t3("Фуқаролар атроф табиий муҳитга эҳтиёткорона муносабатда бўлишга мажбур. Бу 49-моддадаги ҳуқуқнинг жуфти.", "Граждане обязаны бережно относиться к окружающей природной среде. Это пара к праву из статьи 49.", "Citizens must treat the natural environment with care. It is the partner of the right in Article 49."),
      who: "🧒", ex: t3("Пикникдан кейин чўғни сув ва тупроқ билан ўчириш.", "После пикника залить угли водой и засыпать землёй.", "After a picnic, put out the embers with water and soil.") },
    { n: "66", ic: "🏭", t: t3("Мулкинг табиатга зарар бермасин", "Твоя собственность не должна вредить природе", "Your property must not harm nature"),
      kid: t3("Уй, машина ёки завод сеники бўлиши мумкин. Лекин улар билан ҳавони, сувни ёки қўшнини безовта қилиб бўлмайди.", "Дом, машина или завод могут быть твоими. Но нельзя с их помощью портить воздух, воду или мешать соседям.", "A house, car or factory may be yours. But you may not use it to spoil air, water or bother neighbours."),
      teen: t3("Мол-мулкдан фойдаланиш атроф-муҳитга зарар етказмаслиги, бошқа шахсларнинг ҳуқуқларини бузмаслиги керак.", "Пользование имуществом не должно причинять вред среде и нарушать права других лиц.", "Using property must not harm the environment or violate other people’s rights."),
      who: "🏠", ex: t3("Цех эгаси бўёқли сувни ариққа тўкса, «ўз жойим» дея олмайди.", "Хозяин цеха, сливший краску в арык, не может сказать «это моё место».", "A workshop owner who pours dye into a canal cannot say “it’s my land”.") },
    { n: "68", ic: "💧", t: t3("Сув, ер, ўрмон — ҳаммамизники", "Вода, земля, лес — общие", "Water, land and forests belong to all"),
      kid: t3("Ер, сув, ўсимлик ва ҳайвонлар — бутун халқнинг бойлиги. Улардан тежаб фойдаланамиз, давлат уларни қўриқлайди.", "Земля, вода, растения и животные — богатство всего народа. Пользуемся ими бережливо, государство их охраняет.", "Land, water, plants and animals are the whole nation’s wealth. We use them carefully and the state protects them."),
      teen: t3("Табиий ресурслар умуммиллий бойлик бўлиб, улардан оқилона фойдаланиш зарур ва улар давлат муҳофазасидадир.", "Природные ресурсы — общенациональное богатство, их нужно рационально использовать, и они под охраной государства.", "Natural resources are national wealth; they must be used rationally and are under state protection."),
      who: "🇺🇿", ex: t3("Қудуқ насосини кечаю кундуз ишлатиб қўйиш — «ўз насосим» эмас: сув ҳаммамизники.", "Гонять насос скважины день и ночь — не «мой насос»: вода общая.", "Running a well pump day and night is not “my pump”: the water belongs to all.") },
    { n: "79", ic: "🧑‍🎓", t: t3("Ёшларнинг экологик ҳуқуқлари", "Экологические права молодёжи", "Young people’s environmental rights"),
      kid: t3("Давлат ёшларнинг табиат бўйича ҳуқуқларини ҳам ҳимоя қилади ва уларнинг фаол бўлишини қўллаб-қувватлайди.", "Государство защищает и экологические права молодёжи и поддерживает её активность.", "The state protects young people’s environmental rights too and supports them in taking part."),
      teen: t3("Ёшлар ташаббуси (масалан, ноқонуний ахлат уюмини харитага белгилаш) — «ортиқча шовқин» эмас, фаол иштирок.", "Инициатива молодёжи (например, отметить на карте незаконную свалку) — не «лишний шум», а активное участие.", "Youth action (such as mapping an illegal dump) is not “noise” but active participation."),
      who: "🙌", ex: t3("Синф «Эко-харита»да ноқонуний ахлатни белгилаб, ҳокимликка хат ёзди.", "Класс отметил незаконную свалку на «Эко-карте» и написал письмо в хокимият.", "A class marked an illegal dump on the Eco-map and wrote to the local authority.") }
  ];

  /* ---------- 3. Ҳуқуқ ёки бурч (саралаш ўйини) ---------- */
  const SORT = [
    { t: t3("Тоза ҳавода нафас олиш", "Дышать чистым воздухом", "Breathing clean air"), k: "h", why: t3("49-модда: қулай муҳит — ҳуқуқ.", "Статья 49: благоприятная среда — право.", "Article 49: a good environment is a right.") },
    { t: t3("Ҳаво ҳақида тўғри маълумот олиш", "Получать правду о воздухе", "Getting true information about the air"), k: "h", why: t3("49-модда: ишончли ахборот — ҳуқуқ.", "Статья 49: достоверная информация — право.", "Article 49: reliable information is a right.") },
    { t: t3("Маҳалла лойиҳасини муҳокама қилиш", "Обсуждать проект махалли", "Discussing a neighbourhood plan"), k: "h", why: t3("49-модда: жамоатчилик муҳокамаси.", "Статья 49: общественное обсуждение.", "Article 49: public discussion.") },
    { t: t3("Ёшлар ташаббусини ҳимоя қилиш", "Защита инициатив молодёжи", "Protection of youth initiatives"), k: "h", why: t3("79-модда: ёшларнинг экологик ҳуқуқи.", "Статья 79: экологические права молодёжи.", "Article 79: youth environmental rights.") },
    { t: t3("Ахлатни йўлга ташламаслик", "Не бросать мусор на дорогу", "Not dropping litter on the road"), k: "b", why: t3("62-модда: табиатга эҳтиёткорлик — бурч.", "Статья 62: бережность — обязанность.", "Article 62: care for nature is a duty.") },
    { t: t3("Кекса дарахтни асраш", "Беречь старое дерево", "Protecting an old tree"), k: "b", why: t3("61-модда: табиий меросни асраш — бурч.", "Статья 61: беречь наследие — обязанность.", "Article 61: protecting heritage is a duty.") },
    { t: t3("Сувни тежаб ишлатиш", "Экономно расходовать воду", "Using water sparingly"), k: "b", why: t3("68-модда: оқилона фойдаланиш.", "Статья 68: рациональное использование.", "Article 68: wise use.") },
    { t: t3("Ўз ҳовлисида ҳам тутун чиқариб қўшнини безовта қилмаслик", "Не дымить во дворе, мешая соседям", "Not making smoke in your yard that bothers neighbours"), k: "b", why: t3("66-модда: мулк зарар бермаслиги керак.", "Статья 66: собственность не должна вредить.", "Article 66: property must not cause harm.") },
    { t: t3("Пикникдан кейин оловни ўчириш", "Тушить костёр после пикника", "Putting out the fire after a picnic"), k: "b", why: t3("62-модда: эҳтиёткорлик.", "Статья 62: бережность.", "Article 62: care.") },
    { t: t3("Қизил китобдаги ҳайвонни кўрганда безовта қилмаслик", "Не тревожить животное из Красной книги", "Not disturbing an animal from the Red Book"), k: "b", why: t3("68-модда: ҳайвонот дунёси — умуммиллий бойлик.", "Статья 68: животный мир — общее богатство.", "Article 68: wildlife is national wealth.") }
  ];

  /* ---------- 4. Амалий дарслар (grok-workspace: Kichik ekolog, Yosh tadqiqotchi, STEAM-ekologiya) ---------- */
  const LESSONS = [
    { id: "suv", ic: "🚰", age: t3("6–10 ёш", "6–10 лет", "ages 6–10"), min: 20,
      t: t3("Жўмрак очиқ қолса", "Если кран открыт", "When the tap is left on"),
      goal: t3("Бир оила кунига қанча сув ишлатишини ҳисоблай олиш.", "Уметь посчитать, сколько воды семья тратит в день.", "Work out how much water a family uses in a day."),
      hook: t3("Кеча жўмрак неча марта очиқ қолди?", "Сколько раз вчера кран оставался открытым?", "How many times was the tap left on yesterday?"),
      body: [
        t3("Сув чексиз эмас. Ўзбекистонда дарё ва ариқ кўп кўринади, лекин ичимлик суви қувур, насос ва тозалаш орқали келади.", "Вода не бесконечна. В Узбекистане много рек и арыков, но питьевая вода идёт через трубы, насосы и очистку.", "Water is not endless. Uzbekistan seems to have many rivers and canals, but drinking water comes through pipes, pumps and treatment."),
        t3("Конституцияда сув умуммиллий бойлик. Боланинг вазифаси кичик: томчи санаш ва очиқ жўмракни ёпиш.", "В Конституции вода — общенациональное богатство. Задача ребёнка маленькая: считать капли и закрывать кран.", "The Constitution calls water national wealth. A child’s job is small: count the drops and close the tap.")
      ],
      steps: [
        [t3("Кузат", "Наблюдай", "Observe"), t3("Бир кун давомида тиш ювиш, қўл ювиш ва идиш ювишни сананг.", "В течение дня считайте, сколько раз чистите зубы, моете руки и посуду.", "For one day count tooth-brushing, hand-washing and dish-washing.")],
        [t3("Ёз", "Запиши", "Write"), t3("Қайси ишда сув бекорга оқди?", "Где вода утекла зря?", "Where did water run for nothing?")],
        [t3("Битта чора", "Одна мера", "One change"), t3("Эртага фақат битта одатни ўзгартиринг.", "Завтра измените только одну привычку.", "Tomorrow change just one habit.")]
      ],
      tip: t3("Тиш юваётганда стакан ишлатинг. Жўмрак очиқ турса, бир дақиқада бир неча литр кетади.", "Чистя зубы, пользуйтесь стаканом. Из открытого крана за минуту уходят несколько литров.", "Use a cup when brushing your teeth. An open tap loses several litres a minute."),
      exp: t3("Стаканни жўмрак тагига 10 сония қўйинг. Сувни ўлчов идишига қуйинг. 6 марта шундай бўлса, бир дақиқада қанча литр чиқишини ҳисобланг.", "Подставьте стакан под кран на 10 секунд. Перелейте воду в мерную посуду. Умножьте на 6 — сколько литров в минуту?", "Hold a cup under the tap for 10 seconds. Pour it into a measuring jug. Multiply by 6: how many litres a minute?"),
      calc: { q: t3("Бир киши кунига 150 литр, оилада 4 киши, 30 кун. Ойига неча литр?", "Один человек — 150 литров в день, в семье 4 человека, 30 дней. Сколько литров в месяц?", "One person uses 150 litres a day, 4 people in the family, 30 days. How many litres a month?"), a: 18000, unit: t3("литр", "литров", "litres"),
        sol: t3("150 × 4 × 30 = 18 000 литр. Бу тахминий маиший меъёр, ҳисоблагичдаги рақам ундан фарқ қилиши мумкин.", "150 × 4 × 30 = 18 000 литров. Это примерная бытовая норма, на счётчике может быть иначе.", "150 × 4 × 30 = 18,000 litres. It is a rough household figure; your meter may differ.") },
      task: t3("Оиладаги ҳисоблагични бугун ва эртага бир хил соатда ўқинг. Фарқни дафтарга ёзинг.", "Снимите показания счётчика сегодня и завтра в одно время. Запишите разницу.", "Read the water meter today and tomorrow at the same time. Write down the difference."),
      quiz: [
        { q: t3("Сув кимнинг бойлиги?", "Чьё богатство вода?", "Whose wealth is water?"), o: [t3("Фақат уй эгасининг", "Только хозяина дома", "Only the homeowner’s"), t3("Умуммиллий бойлик", "Общенациональное богатство", "National wealth"), t3("Фақат заводнинг", "Только завода", "Only the factory’s")], c: 1, why: t3("68-модда: сув умуммиллий бойлик.", "Статья 68: вода — общенациональное богатство.", "Article 68: water is national wealth.") },
        { q: t3("Тиш ювишда сувни қандай тежаш мумкин?", "Как экономить воду, когда чистишь зубы?", "How can you save water when brushing teeth?"), o: [t3("Жўмракни тўлиқ очиш", "Открыть кран полностью", "Turn the tap fully on"), t3("Стакан ишлатиш", "Пользоваться стаканом", "Use a cup"), t3("Ваннани тўлдириш", "Наполнить ванну", "Fill the bath")], c: 1, why: t3("Стакан очиқ оқимдан камроқ сув олади.", "Стакану нужно меньше воды, чем открытому крану.", "A cup uses less water than a running tap.") }
      ],
      teacher: t3("Ҳисобни боланинг ўз дафтаридаги рақам билан солиштиринг, тайёр жавобни олдиндан айтманг.", "Сверяйте расчёт с цифрами в тетради ребёнка, не говорите готовый ответ заранее.", "Compare the sum with the child’s own notebook figures; don’t give the answer first."),
      src: [{ t: t3("Конституция, 68-модда", "Конституция, статья 68", "Constitution, Article 68"), u: LEX_CONST }] },
    { id: "chiqindi", ic: "🗑️", age: t3("6–10 ёш", "6–10 лет", "ages 6–10"), min: 20,
      t: t3("Уйдаги учта қути", "Три коробки дома", "Three boxes at home"),
      goal: t3("Чиқиндини қоғоз, пластик ва озиқ-овқат қолдиғига ажрата олиш.", "Уметь разделять отходы на бумагу, пластик и пищевые остатки.", "Sort waste into paper, plastic and food scraps."),
      hook: t3("Кечаги чиқинди пакетида нима энг кўп эди?", "Чего вчера было больше всего в мусорном пакете?", "What was there most of in yesterday’s rubbish bag?"),
      body: [
        t3("Чиқинди «йўқолмайди». Уни олиб кетадиган машина бор, полигон бор, баъзида эса ҳовли ортида ноқонуний уюм бор.", "Мусор не «исчезает». Есть машина, которая его увозит, есть полигон, а иногда — незаконная свалка за двором.", "Rubbish does not “disappear”. A truck takes it to a landfill — or sometimes it ends up in an illegal heap behind the yard."),
        t3("Ажратиш — қайта ишлашнинг биринчи қадами. Аралаш пакетни завод ҳам ажрата олмайди.", "Разделение — первый шаг переработки. Смешанный пакет не разберёт даже завод.", "Sorting is the first step of recycling. Even a factory cannot sort a mixed bag well.")
      ],
      tip: t3("Пластик идишни чайиб қўйинг. Ичидаги ёғ қоғозни ҳам бузади.", "Ополосните пластиковую упаковку. Жир из неё портит и бумагу.", "Rinse plastic tubs. Grease from them spoils the paper too."),
      exp: t3("Бугунги чиқиндини уч гуруҳга ажратинг. Қайси гуруҳ оғирроқ эканини қўл билан солиштиринг, тарози бўлса ёзинг.", "Разделите сегодняшний мусор на три группы. Сравните на руке, какая тяжелее; если есть весы — запишите.", "Split today’s rubbish into three groups. Compare which is heavier by hand, or weigh them."),
      task: t3("Бир ҳафта давомида фақат пластик қопқоқларни алоҳида идишга йиғинг. Жума куни санаб чиқинг.", "Неделю собирайте пластиковые крышки в отдельную банку. В пятницу посчитайте.", "For a week collect plastic bottle caps in a separate jar. Count them on Friday."),
      quiz: [
        { q: t3("Чиқиндини аралаштириб ташлаш нима учун ёмон?", "Почему плохо выбрасывать мусор смешанным?", "Why is mixing rubbish bad?"), o: [t3("Пакет чиройли эмас", "Пакет некрасивый", "The bag looks ugly"), t3("Қайта ишлаш қийинлашади", "Переработка усложняется", "Recycling gets harder"), t3("Ҳеч қандай фарқи йўқ", "Никакой разницы", "It makes no difference")], c: 1, why: t3("Аралаш оқимни саралаш қиммат ва кўпинча ҳаммаси полигонга кетади.", "Сортировать смесь дорого, и часто всё уходит на полигон.", "Sorting a mixed stream is costly, so it often all goes to landfill.") },
        { q: t3("Озиқ-овқат қолдиғи қаерга?", "Куда пищевые остатки?", "Where do food scraps go?"), o: [t3("Қоғоз қутисига", "В коробку для бумаги", "In the paper box"), t3("Алоҳида органик қутига", "В отдельный органический контейнер", "In a separate organic bin"), t3("Дарёга", "В реку", "Into the river")], c: 1, why: t3("Органик қолдиқ компост бўлиши мумкин. Дарёга ташланмайди.", "Органика может стать компостом. В реку её не бросают.", "Organic scraps can become compost. They never go in a river.") }
      ],
      teacher: t3("Хавфли чиқиндини (батарея, дори) бола қўли билан йиғмасин.", "Опасные отходы (батарейки, лекарства) ребёнок руками не собирает.", "Children must not handle hazardous waste (batteries, medicines)."),
      src: [{ t: t3("«Чиқиндилар тўғрисида»ги Қонун, №362-II", "Закон «Об отходах», №362-II", "Law “On Waste”, No. 362-II"), u: "https://lex.uz/ru/docs/44872" }] },
    { id: "havo", ic: "🌫️", age: t3("11–15 ёш", "11–15 лет", "ages 11–15"), min: 30,
      t: t3("PM2.5 ни ЖССТ билан солиштириш", "Сравниваем PM2.5 с нормой ВОЗ", "Comparing PM2.5 with the WHO guideline"),
      goal: t3("Бир лаҳзалик ҳаво рақамини 24 соатлик йўриқномадан ажрата олиш.", "Отличать мгновенное значение от 24-часового ориентира.", "Tell a one-off air reading from a 24-hour guideline."),
      hook: t3("Бугун дераза ортидаги ҳаво «яхши» дейиш учун қандай рақам керак?", "Какое число нужно, чтобы сказать, что воздух за окном «хороший»?", "What number would let you say the air outside is “good” today?"),
      body: [
        t3("PM2.5 — диаметри 2,5 микрометрдан кичик зарра. У чуқур нафас билан ўпкага киради.", "PM2.5 — частицы меньше 2,5 микрометра. С глубоким вдохом они попадают в лёгкие.", "PM2.5 are particles smaller than 2.5 micrometres. They reach deep into the lungs."),
        t3("ЖССТ 2021 йилги йўриқномасида PM2.5 нинг 24 соатлик қиймати 15 мкг/м³. Телефондаги бир лаҳзалик рақам шу меъёрнинг ўзи эмас.", "В руководстве ВОЗ 2021 года 24-часовое значение PM2.5 — 15 мкг/м³. Мгновенная цифра в телефоне — не та же норма.", "The WHO 2021 guideline for 24-hour PM2.5 is 15 µg/m³. A momentary number on your phone is not the same thing.")
      ],
      steps: [
        [t3("Манба", "Источник", "Source"), t3("«Онлайн маълумотлар» бўлимида шаҳарни танланг ёки ўзингиздаги рақамни ёзинг.", "В разделе «Онлайн-данные» выберите город или запишите своё значение.", "Pick a city in the Online data section or write down your own reading.")],
        [t3("Солиштир", "Сравни", "Compare"), t3("15 дан катта ёки кичиклигини айтинг ва бу 24 соатлик ўртача эмаслигини ёзинг.", "Скажите, больше или меньше 15, и запишите, что это не среднесуточное.", "Say if it is above or below 15, and note it is not a 24-hour average.")],
        [t3("Иккинчи манба", "Второй источник", "Second source"), t3("Гидромет огоҳлантириши борми, текширинг.", "Проверьте, есть ли предупреждение гидрометслужбы.", "Check whether the hydromet service issued a warning.")]
      ],
      tip: t3("«AQI 80» ва «PM2.5 80» — турли шкала. Қайси бирини олаётганингизни ёзинг.", "«AQI 80» и «PM2.5 80» — разные шкалы. Пишите, какую берёте.", "“AQI 80” and “PM2.5 80” are different scales. Say which one you use."),
      task: t3("Уч кун бир хил соатда PM2.5 ни ёзинг. График чизинг. Хулоса: бир кунлик рақам етадими?", "Три дня в одно время записывайте PM2.5. Постройте график. Вывод: хватит ли одного дня?", "Record PM2.5 at the same time for three days. Draw a graph. Is one day enough?"),
      quiz: [
        { q: t3("15 мкг/м³ қандай қиймат?", "Что такое 15 мкг/м³?", "What is 15 µg/m³?"), o: [t3("Бир сониялик AQI", "AQI за секунду", "A one-second AQI"), t3("ЖССТ 24 соатлик PM2.5 йўриқномаси", "Ориентир ВОЗ для PM2.5 за 24 часа", "The WHO 24-hour PM2.5 guideline"), t3("Жарима миқдори", "Размер штрафа", "A fine")], c: 1, why: t3("Бу ҳаво сифати бўйича ЖССТ йўриқномаси, жарима эмас.", "Это рекомендация ВОЗ, а не штраф.", "It is a WHO air-quality guideline, not a fine.") },
        { q: t3("Моделдаги рақам расмий ўлчовни алмаштирадими?", "Заменяет ли модельная цифра официальное измерение?", "Does a model number replace an official measurement?"), o: [t3("Ҳа, ҳар доим", "Да, всегда", "Yes, always"), t3("Йўқ, манба бошқа", "Нет, источник другой", "No, it is a different source")], c: 1, why: t3("Очиқ модел дарс учун. Расмий хулоса ваколатли ўлчовда.", "Открытая модель — для урока. Официальный вывод — по измерениям уполномоченных органов.", "Open models are for learning. Official conclusions come from authorised measurements.") }
      ],
      teacher: t3("Ўқувчи 24 соатлик ўртача билан лаҳзалик қийматни аралаштирса, қайта сўранг.", "Если ученик путает среднесуточное и мгновенное значения — переспросите.", "If a pupil mixes up the 24-hour average and a momentary value, ask again."),
      src: [{ t: t3("ЖССТ: ҳаво сифати ва соғлиқ", "ВОЗ: качество воздуха и здоровье", "WHO: ambient air quality and health"), u: "https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health" }, { t: t3("Ўзгидромет", "Узгидромет", "Uzhydromet"), u: "https://gov.uz/oz/hydromet" }] },
    { id: "daraxt", ic: "🌲", age: t3("11–15 ёш", "11–15 лет", "ages 11–15"), min: 30,
      t: t3("Маҳалладаги дарахт қоплами", "Деревья в нашей махалле", "Tree cover in our neighbourhood"),
      goal: t3("Дарахт кесишни «ободончилик» деб эмас, ҳужжат билан баҳолаш.", "Оценивать вырубку по документам, а не словами «благоустройство».", "Judge tree-felling by documents, not by the word “improvement”."),
      hook: t3("Кўчангиздаги энг қари дарахтни кесишса, қандай савол берасиз?", "Если срубят самое старое дерево на улице, какой вопрос вы зададите?", "If the oldest tree on your street is cut down, what will you ask?"),
      body: [
        t3("Дарахт соя беради, чангни ва ёзги иссиқни ушлаб туради. Кесиш баъзан керак, лекин асос ҳужжатсиз эмас.", "Дерево даёт тень, задерживает пыль и летнюю жару. Рубить иногда нужно, но не без документа.", "A tree gives shade and holds back dust and summer heat. Felling is sometimes needed, but never without a document."),
        t3("«Ўрмон тўғрисида»ги Қонун (ЎРҚ-475) ўрмон фондини тартибга солади. Шаҳар дарахти бошқа рўйхатда бўлиши мумкин. Аввал қайси ҳудуд эканини аниқланг.", "Закон «О лесе» (ЗРУ-475) регулирует лесной фонд. Городские деревья могут быть в другом перечне. Сначала узнайте, какая это территория.", "The Law “On Forests” (ZRU-475) covers the forest fund. City trees may fall under other rules. First find out what land it is.")
      ],
      tip: t3("Global Forest Watch да вилоятингиз қопламини кўринг. Бу битта теракка рухсат эмас.", "Посмотрите покров своей области на Global Forest Watch. Это не разрешение на один тополь.", "Look at your region on Global Forest Watch. It is not a permit for one poplar."),
      task: t3("10 та дарахтни санаб, турини ва ҳолатини (соғлом, қуриган, кесилган) ёзинг. Кесилган бўлса, эълон ёки асос борми?", "Посчитайте 10 деревьев: вид и состояние (здоровое, сухое, срубленное). Если срублено — есть ли объявление или основание?", "Count 10 trees: species and condition (healthy, dry, cut). If one was cut, was there a notice or basis?"),
      quiz: [
        { q: t3("Харитадаги ўрмон йўқолиши нимани билдиради?", "Что означает потеря леса на карте?", "What does forest loss on a map show?"), o: [t3("Ҳар бир дарахт ноқонуний кесилган", "Каждое дерево срублено незаконно", "Every tree was cut illegally"), t3("Қоплам ўзгарган, сабаби алоҳида текширилади", "Покров изменился, причину проверяют отдельно", "Cover changed; the cause is checked separately")], c: 1, why: t3("Сунъий йўлдош қопламни кўрсатади. Ҳуқуқий баҳо ҳужжатда.", "Спутник показывает покров. Правовая оценка — в документах.", "Satellites show cover. The legal judgement is in the documents.") },
        { q: t3("Кесишдан олдин биринчи савол?", "Первый вопрос перед вырубкой?", "The first question before felling?"), o: [t3("Ёғоч нархи", "Цена древесины", "The price of wood"), t3("Қайси ҳудуд ва қандай асос", "Какая территория и какое основание", "Which land, and on what basis")], c: 1, why: t3("Фонд, шаҳар рўйхати ва асос ҳужжат тартибни белгилайди.", "Фонд, городской перечень и документ-основание определяют порядок.", "The fund, city list and basis document set the procedure.") }
      ],
      teacher: t3("Ўқувчи аниқ тур номини билмаса, «билмайман» деб ёзиши тўғри.", "Если ученик не знает точного названия вида, правильно написать «не знаю».", "If a pupil doesn’t know the exact species, writing “I don’t know” is correct."),
      src: [{ t: t3("Global Forest Watch", "Global Forest Watch", "Global Forest Watch"), u: "https://www.globalforestwatch.org/" }, { t: t3("«Ўрмон тўғрисида»ги Қонун", "Закон «О лесе»", "Law “On Forests”"), u: "https://lex.uz/ru/docs/3683532" }] },
    { id: "energiya", ic: "⚡", age: t3("12–15 ёш", "12–15 лет", "ages 12–15"), min: 25,
      t: t3("Кундалик киловатт", "Ежедневный киловатт", "The everyday kilowatt"),
      goal: t3("Маиший асбобнинг ойлик энергиясини ҳисоблаш.", "Рассчитать месячное потребление бытового прибора.", "Calculate a home appliance’s monthly energy use."),
      hook: t3("Иситгич тун бўйи ёнса, ҳисоблагич нимани кўрсатади?", "Если обогреватель работает всю ночь, что покажет счётчик?", "If a heater runs all night, what will the meter show?"),
      body: [
        t3("Қувват (кВт) × соат = энергия (кВт·соат). Бу экологик ҳисобнинг энг содда формуласи.", "Мощность (кВт) × часы = энергия (кВт·ч). Это самая простая формула экологического расчёта.", "Power (kW) × hours = energy (kWh). It is the simplest formula in environmental accounting."),
        t3("2024 йилдан энергия самарадорлиги ЎРҚ-940 билан юритилади. 1997 йилги қонун номи эскирган.", "С 2024 года энергоэффективность регулирует ЗРУ-940. Название закона 1997 года устарело.", "Since 2024 energy efficiency has been governed by ZRU-940. The 1997 law’s name is outdated.")
      ],
      calc: { q: t3("1,5 кВт лик иситгич кунига 4 соат, 30 кун ишласа, неча кВт·соат?", "Обогреватель 1,5 кВт работает 4 часа в день 30 дней. Сколько кВт·ч?", "A 1.5 kW heater runs 4 hours a day for 30 days. How many kWh?"), a: 180, unit: t3("кВт·соат", "кВт·ч", "kWh"),
        sol: t3("1,5 × 4 × 30 = 180 кВт·соат. Нархни маҳаллий тарифдан қўйинг, тахмин ёзманг.", "1,5 × 4 × 30 = 180 кВт·ч. Цену берите из местного тарифа, не угадывайте.", "1.5 × 4 × 30 = 180 kWh. Take the price from the local tariff; don’t guess.") },
      tip: t3("Эски «Энергиядан оқилона фойдаланиш тўғрисида» номини тақдимотда қолдирманг.", "Не оставляйте в презентации старое название «Об рациональном использовании энергии».", "Don’t leave the old law name in your slides."),
      task: t3("Уйдаги битта асбоб ёрлиғидан ваттни топинг. Ҳафталик соатини ёзиб, кВт·соатга айлантиринг.", "Найдите ватты на этикетке одного прибора. Запишите часы за неделю и переведите в кВт·ч.", "Find the watts on one appliance label. Record its weekly hours and convert to kWh."),
      quiz: [
        { q: t3("180 кВт·соат қандай чиқди?", "Как получилось 180 кВт·ч?", "How did we get 180 kWh?"), o: [t3("1,5 + 4 + 30", "1,5 + 4 + 30", "1.5 + 4 + 30"), t3("1,5 × 4 × 30", "1,5 × 4 × 30", "1.5 × 4 × 30"), t3("4 × 30", "4 × 30", "4 × 30")], c: 1, why: t3("Энергия = қувват × вақт.", "Энергия = мощность × время.", "Energy = power × time.") },
        { q: t3("Энергия самарадорлиги қонуни қайси?", "Какой закон об энергоэффективности действует?", "Which energy efficiency law is in force?"), o: [t3("1997 йилги", "1997 года", "The 1997 law"), t3("ЎРҚ-940, 2024", "ЗРУ-940, 2024", "ZRU-940, 2024")], c: 1, why: t3("1997 йилги қонун ўрнига ЎРҚ-940 келган.", "Закон 1997 года заменён ЗРУ-940.", "ZRU-940 replaced the 1997 law.") }
      ],
      teacher: t3("Тарифни ўқувчи ўзи топсин, сиз нархни ўйлаб ёзманг.", "Пусть ученик сам найдёт тариф, не придумывайте цену.", "Let pupils find the tariff themselves; don’t invent prices."),
      src: [{ t: t3("ЎРҚ-940", "ЗРУ-940", "ZRU-940"), u: "https://lex.uz/docs/7052085" }] },
    { id: "filtr", ic: "🧪", age: t3("12–15 ёш", "12–15 лет", "ages 12–15"), min: 30,
      t: t3("Фильтр модели", "Модель фильтра", "A filter model"),
      goal: t3("Қум фильтри моделини йиғиш ва нима учун ундан чиққан сувни ичиб бўлмаслигини тушунтириш.", "Собрать модель песчаного фильтра и объяснить, почему эту воду нельзя пить.", "Build a sand filter model and explain why its water is not safe to drink."),
      hook: t3("Лойқа сув тиниқ чиқса, у ичимлик сувига айланадими?", "Если мутная вода стала прозрачной, она стала питьевой?", "If muddy water comes out clear, is it now drinking water?"),
      body: [
        t3("Қум ва шағал йирик заррани ушлайди. Бактерия, туз ва кўп кимёвий модда ўтиб кетиши мумкин.", "Песок и гравий задерживают крупные частицы. Бактерии, соли и многие химикаты могут пройти.", "Sand and gravel catch large particles. Bacteria, salts and many chemicals can pass through."),
        t3("Шунинг учун модел «тозаланди» дегани эмас. Ичимлик сув хулосасини санитария лабораторияси беради.", "Поэтому модель не значит «очищено». Вывод о питьевой воде даёт санитарная лаборатория.", "So the model does not mean “purified”. Only a sanitary lab can say water is drinkable.")
      ],
      exp: t3("Пластик идиш тубини тешинг. Пахта, қум, майда шағал қўйинг. Лойқа сув қуйинг. Чиққан сувни ИЧМАНГ, фақат рангини солиштиринг ва тўкинг.", "Проделайте дырку в дне пластиковой бутылки. Положите вату, песок, мелкий гравий. Налейте мутную воду. Полученную воду НЕ ПЕЙТЕ, только сравните цвет и вылейте.", "Make a hole in the bottom of a plastic bottle. Add cotton wool, sand and fine gravel. Pour in muddy water. Do NOT drink the result: just compare its colour and pour it away."),
      tip: t3("«Тиниқ» ва «хавфсиз»ни бир сўз қилманг.", "Не путайте «прозрачная» и «безопасная».", "Don’t treat “clear” and “safe” as the same word."),
      task: t3("Натижани уч жумлада ёзинг: нима ушланди, нима ушланмаган бўлиши мумкин, ким хулоса беради.", "Опишите результат в трёх предложениях: что задержалось, что могло пройти, кто даёт заключение.", "Write three sentences: what was caught, what may have passed, who gives the official verdict."),
      quiz: [
        { q: t3("Фильтрдан чиққан тиниқ сувни ичиш мумкинми?", "Можно ли пить прозрачную воду из фильтра?", "Can you drink the clear water from the filter?"), o: [t3("Ҳа, тиниқ бўлса", "Да, если прозрачная", "Yes, if it is clear"), t3("Йўқ, бу фақат модел", "Нет, это только модель", "No, it is only a model")], c: 1, why: t3("Дарсдаги фильтр ичимлик сув тайёрламайди.", "Учебный фильтр не делает питьевую воду.", "A classroom filter doesn’t make drinking water.") },
        { q: t3("Йирик лой заррасини асосан нима ушлайди?", "Что задерживает крупные частицы глины?", "What mainly catches big mud particles?"), o: [t3("Қум қатлами", "Слой песка", "The sand layer"), t3("Стакан ранги", "Цвет стакана", "The cup’s colour")], c: 0, why: t3("Механик фильтр йирик заррани ушлайди, эриган тузни эмас.", "Механический фильтр задерживает крупные частицы, а не растворённые соли.", "A mechanical filter catches large particles, not dissolved salts.") }
      ],
      teacher: t3("Сув ичилмаслигини тажрибадан олдин айтинг.", "Скажите до опыта, что воду пить нельзя.", "Say before the experiment that the water must not be drunk."),
      src: [{ t: t3("«Аҳолининг санитария-эпидемиологик осойишталиги тўғрисида»ги Қонун, ЎРҚ-393", "Закон «О санитарно-эпидемиологическом благополучии населения», ЗРУ-393", "Law on Sanitary and Epidemiological Wellbeing, ZRU-393"), u: "https://lex.uz/ru/docs/2732587" }] }
  ];

  /* ---------- 5. Болалар суди (Street Law усулида соддалаштирилган moot court) ---------- */
  const ROLES = [
    ["sudya", "👩‍⚖️", t3("Судья", "Судья", "Judge"), t3("Ҳаммани тинглайди ва қонунга қараб қарор чиқаради.", "Выслушивает всех и решает по закону.", "Listens to everyone and decides by the law.")],
    ["inspektor", "🕵️", t3("Эко-инспектор", "Эко-инспектор", "Eco-inspector"), t3("Далил келтиради: намуна, расм, дала ёзуви.", "Приносит доказательства: пробы, фото, записи.", "Brings evidence: samples, photos, notes.")],
    ["himoyachi", "🧑‍💼", t3("Ҳимоячи", "Защитник", "Defender"), t3("Айбланувчининг гапини адолатли етказади.", "Честно передаёт позицию обвиняемого.", "Fairly presents the accused side.")],
    ["guvoh", "🙋", t3("Гувоҳ", "Свидетель", "Witness"), t3("Нима кўрганини ростгўйлик билан айтади.", "Честно рассказывает, что видел.", "Honestly says what they saw.")],
    ["hakam", "👥", t3("Ҳакамлар (синф)", "Присяжные (класс)", "Jury (the class)"), t3("Далилларни тортиб, овоз беради.", "Взвешивают доказательства и голосуют.", "Weigh the evidence and vote.")]
  ];
  const CASES = [
    { id: "boyoq", ic: "🎨",
      t: t3("Бўёқ суви ариққа", "Краска в арыке", "Dye in the canal"),
      facts: t3("Бўёқ цехи кечаси кўк сувни ариққа тўкяпти. Маҳалла ҳид ҳақида ёзди. Инспектор намуна олди.", "Красильный цех по ночам сливает синюю воду в арык. Махалля жаловалась на запах. Инспектор взял пробу.", "A dye workshop pours blue water into the canal at night. Neighbours complained about the smell. An inspector took a sample."),
      steps: [
        { q: t3("Энг кучли далил қайси?", "Какое доказательство самое сильное?", "Which is the strongest evidence?"), o: [t3("Инспектор олган сув намунаси ва лаборатория хулосаси", "Проба воды, взятая инспектором, и заключение лаборатории", "The inspector’s water sample and the lab result"), t3("«Менга шундай туюлди» деган гап", "Слова «мне так показалось»", "Someone saying “I think so”")], c: 0, why: t3("Ваколатли намуна — асосий далил.", "Проба уполномоченного лица — главное доказательство.", "An authorised sample is the key evidence.") },
        { q: t3("Цех эгаси: «Бу менинг ерим, хоҳлаганимни қиламан». Тўғрими?", "Хозяин цеха: «Это моя земля, делаю что хочу». Прав ли он?", "The owner says: “It’s my land, I do what I want.” Is he right?"), o: [t3("Ҳа, мулк уники", "Да, собственность его", "Yes, it is his property"), t3("Йўқ, 66-модда: мулк табиатга зарар бермаслиги керак", "Нет, статья 66: собственность не должна вредить природе", "No, Article 66: property must not harm nature")], c: 1, why: t3("Мулк ҳуқуқининг чегараси бор.", "У права собственности есть границы.", "Property rights have limits.") },
        { q: t3("Ҳимоячи нимани сўраши адолатли?", "Что справедливо попросить защитнику?", "What is it fair for the defender to ask?"), o: [t3("Тозалаш қурилмасини ўрнатиш учун муддат", "Срок на установку очистного оборудования", "Time to install a treatment unit"), t3("Намунани йўқ қилиш", "Уничтожить пробу", "To destroy the sample")], c: 0, why: t3("Зарарни тузатиш — масъулиятли йўл.", "Исправить вред — ответственный путь.", "Fixing the harm is the responsible path.") },
        { q: t3("Адолатли қарор қайси?", "Какое решение справедливо?", "Which decision is fair?"), o: [t3("Тўкишни дарҳол тўхтатиш, ариқни тозалаш ва тозалаш қурилмаси ўрнатиш", "Немедленно прекратить сброс, очистить арык и поставить очистку", "Stop the discharge now, clean the canal and install treatment"), t3("Ҳеч нарса қилмаслик", "Ничего не делать", "Do nothing")], c: 0, why: t3("Аввал зарарни тўхтатиш, кейин тиклаш.", "Сначала остановить вред, потом восстановить.", "First stop the harm, then restore.") }
      ] },
    { id: "chinor", ic: "🌳",
      t: t3("Қатор чинорлар", "Ряд чинар", "The row of plane trees"),
      facts: t3("Кўча кенгайтириш учун 12 та кекса чинорни кесмоқчи. Аҳоли билан муҳокама бўлмаган.", "Ради расширения улицы хотят срубить 12 старых чинар. С жителями не обсуждали.", "To widen a street, 12 old plane trees are to be cut. Residents were not consulted."),
      steps: [
        { q: t3("Биринчи савол нима бўлиши керак?", "Каким должен быть первый вопрос?", "What should the first question be?"), o: [t3("Кесишга қандай ҳужжат асос бўлган?", "Какой документ стал основанием для вырубки?", "What document allows the felling?"), t3("Ёғоч кимга сотилади?", "Кому продадут древесину?", "Who will buy the wood?")], c: 0, why: t3("Асос ҳужжатсиз кесиш мумкин эмас.", "Без документа-основания рубить нельзя.", "No felling without a basis document.") },
        { q: t3("Аҳоли қайси ҳуқуқидан фойдалана олади?", "Каким правом могут воспользоваться жители?", "Which right can residents use?"), o: [t3("49-модда: лойиҳани муҳокама қилиш ва ахборот олиш", "Статья 49: обсуждать проект и получать информацию", "Article 49: discuss the plan and get information"), t3("Ҳеч қандай", "Никаким", "None")], c: 0, why: t3("Шаҳарсозлик лойиҳалари жамоатчилик муҳокамасидан ўтади.", "Градостроительные проекты проходят общественное обсуждение.", "Urban planning projects go through public discussion.") },
        { q: t3("Синф қандай ечим таклиф қилиши мумкин?", "Какое решение может предложить класс?", "What solution can the class suggest?"), o: [t3("Йўлни бошқа томондан кенгайтириш ёки дарахтларни сақлаб, тротуарни қайта режалаш", "Расширить дорогу с другой стороны или перепланировать тротуар, сохранив деревья", "Widen the road on the other side or redesign the pavement to keep the trees"), t3("Ҳамма дарахтни кесиб, бир дона кўчат экиш", "Срубить все и посадить один саженец", "Cut them all and plant one sapling")], c: 0, why: t3("Яхши ечим — ҳам йўлни, ҳам табиатни сақлайди.", "Хорошее решение сохраняет и дорогу, и природу.", "A good solution keeps both the road and nature.") }
      ] }
  ];

  /* ---------- 6. «Сирли дарё» — квест-хона (Breakout EDU усули) ---------- */
  const ESCAPE = {
    intro: t3("Дарё бўйидаги сирли сандиқда «Табиат ҳимоячиси» нишони бор. Уни очиш учун 4 та қулф кодини топинг. Ҳар бир код — экологик ҳуқуқ ҳақидаги билим. 10 дақиқа вақтингиз бор!",
      "В таинственном сундуке у реки лежит значок «Защитник природы». Чтобы открыть его, найдите коды 4 замков. Каждый код — знание об экологическом праве. У вас 10 минут!",
      "A mysterious chest by the river holds the Nature Defender badge. Find the codes for 4 locks to open it. Each code is a piece of environmental law knowledge. You have 10 minutes!"),
    locks: [
      { ic: "🔢", t: t3("Рақамли қулф", "Цифровой замок", "Number lock"),
        x: t3("Конституциянинг қайси моддаси «ҳар ким қулай атроф-муҳитга эга бўлиш ҳуқуқига эга» дейди? Рақамни ёзинг.", "Какая статья Конституции говорит: «каждый имеет право на благоприятную окружающую среду»? Введите номер.", "Which article of the Constitution says “everyone has the right to a favourable environment”? Enter the number."),
        a: ["49"], hint: t3("Бу сон 50 дан битта кам.", "Это число на один меньше 50.", "It is one less than 50.") },
      { ic: "🔤", t: t3("Ҳарфли қулф", "Буквенный замок", "Letter lock"),
        x: t3("Ҳарфларни тартибга солинг: В-У-С. Бу умуммиллий бойлик нима? (3 ҳарф)", "Составьте слово: Д-О-В-А. Что это за общенациональное богатство? (4 буквы)", "Unscramble: R-A-T-E-W. Which national wealth is it? (5 letters)"),
        a: ["сув", "suv", "вода", "water"], hint: t3("Жўмракдан оқади.", "Течёт из крана.", "It runs from the tap.") },
      { ic: "🧮", t: t3("Ҳисоб қулфи", "Замок-задача", "Maths lock"),
        x: t3("Жўмрак секундига 1 томчи оқади. 1 томчи = 0,05 мл. Бир соатда неча мл сув исроф бўлади? (60 × 60 × 0,05)", "Кран капает 1 каплю в секунду. 1 капля = 0,05 мл. Сколько мл утечёт за час? (60 × 60 × 0,05)", "A tap drips 1 drop a second. 1 drop = 0.05 ml. How many ml are lost in an hour? (60 × 60 × 0.05)"),
        a: ["180"], hint: t3("3600 × 0,05 = ?", "3600 × 0,05 = ?", "3600 × 0.05 = ?") },
      { ic: "🎨", t: t3("Ранг қулфи", "Цветной замок", "Colour lock"),
        x: t3("Ариқдаги сув кўкарди. Энг тўғри биринчи қадам қайси рангли тугмада? 🟢 — расм ва жой-вақтни ёзиб, катталарга айтиш · 🔴 — сувга тегиб кўриш · 🟡 — индамай кетиш. Ранг номини ёзинг.", "Вода в арыке посинела. Верный первый шаг — какого цвета кнопка? 🟢 — сфотографировать, записать место и время, сказать взрослым · 🔴 — потрогать воду · 🟡 — молча уйти. Напишите цвет.", "The canal water turned blue. Which colour button is the right first step? 🟢 photo + place and time + tell an adult · 🔴 touch the water · 🟡 walk away. Type the colour."),
        a: ["яшил", "yashil", "зелёный", "зеленый", "green"], hint: t3("Светофорда «юр» деган ранг.", "Цвет «иди» на светофоре.", "The “go” colour of a traffic light.") }
    ],
    win: t3("🎉 Сандиқ очилди! Ичида «Табиат ҳимоячиси» нишони ва хат: «Табиатни асраш — ҳаммамизнинг ҳуқуқимиз ва бурчимиз».", "🎉 Сундук открыт! Внутри значок «Защитник природы» и записка: «Беречь природу — наше общее право и долг».", "🎉 The chest is open! Inside is the Nature Defender badge and a note: “Protecting nature is everyone’s right and duty.”")
  };

  /* ---------- 7. Викторина (ўйин шаклида, вақт билан) ---------- */
  const QUIZ = [
    { b: "k", q: t3("Тоза ҳаво — ҳуқуқми ёки бурчми?", "Чистый воздух — право или обязанность?", "Is clean air a right or a duty?"), o: [t3("Ҳуқуқ", "Право", "A right"), t3("Бурч", "Обязанность", "A duty")], c: 0 },
    { b: "k", q: t3("Ахлатни қаерга ташлаймиз?", "Куда выбрасываем мусор?", "Where does litter go?"), o: [t3("Ариққа", "В арык", "In the canal"), t3("Саралаш қутисига", "В контейнер для сортировки", "In a sorting bin"), t3("Йўлга", "На дорогу", "On the road")], c: 1 },
    { b: "k", q: t3("Пикникдан кейин олов…", "После пикника костёр…", "After a picnic the fire…"), o: [t3("ўзи ўчади", "сам погаснет", "goes out by itself"), t3("сув ва тупроқ билан ўчирилади", "тушат водой и землёй", "is put out with water and soil")], c: 1 },
    { b: "k", q: t3("Сув кимнинг бойлиги?", "Чьё богатство вода?", "Whose wealth is water?"), o: [t3("Бутун халқнинг", "Всего народа", "The whole nation’s"), t3("Фақат меники", "Только моё", "Only mine")], c: 0 },
    { b: "k", q: t3("Номаълум рангли сувни кўрсанг…", "Если видишь воду странного цвета…", "If you see strangely coloured water…"), o: [t3("Қўлинг билан тегасан", "Трогаешь руками", "You touch it"), t3("Тегмасдан катталарга айтасан", "Не трогаешь и говоришь взрослым", "You don’t touch it and tell an adult")], c: 1 },
    { b: "k", q: t3("Энг яхши чиқинди қайси?", "Какой мусор лучший?", "What is the best waste?"), o: [t3("Пайдо бўлмаган чиқинди", "Которого не появилось", "Waste that never exists"), t3("Чиройли пакетдаги", "В красивом пакете", "Waste in a nice bag")], c: 0 },
    { b: "o", q: t3("Қулай муҳит ҳуқуқи Конституциянинг қайси моддасида?", "В какой статье Конституции право на благоприятную среду?", "Which article holds the right to a favourable environment?"), o: [t3("49", "49", "49"), t3("62", "62", "62"), t3("100", "100", "100")], c: 0 },
    { b: "o", q: t3("62-модда нимани талаб қилади?", "Чего требует статья 62?", "What does Article 62 require?"), o: [t3("Табиатга эҳтиёткорона муносабат", "Бережного отношения к природе", "Care for nature"), t3("Солиқ тўлашни", "Платить налоги", "Paying taxes")], c: 0 },
    { b: "o", q: t3("Мулкдор нима қила олмайди?", "Чего не может собственник?", "What may an owner not do?"), o: [t3("Уйини сотиш", "Продать дом", "Sell the house"), t3("Мулки билан табиатга зарар етказиш", "Вредить природе своим имуществом", "Harm nature with the property")], c: 1 },
    { b: "o", q: t3("Сув муносабатларини ҳозир қайси ҳужжат тартибга солади?", "Какой документ сейчас регулирует водные отношения?", "Which document now governs water?"), o: [t3("Сув кодекси (ЎРҚ-1076)", "Водный кодекс (ЗРУ-1076)", "The Water Code (ZRU-1076)"), t3("1993 йилги қонун", "Закон 1993 года", "The 1993 law")], c: 0 },
    { b: "o", q: t3("ЖССТ бўйича PM2.5 нинг 24 соатлик йўриқномаси?", "Ориентир ВОЗ для PM2.5 за 24 часа?", "WHO 24-hour PM2.5 guideline?"), o: [t3("15 мкг/м³", "15 мкг/м³", "15 µg/m³"), t3("150 мкг/м³", "150 мкг/м³", "150 µg/m³")], c: 0 },
    { b: "o", q: t3("Ёшларнинг экологик ҳуқуқлари қайси моддада?", "В какой статье экологические права молодёжи?", "Which article covers youth environmental rights?"), o: [t3("79", "79", "79"), t3("123", "123", "123")], c: 0 },
    { b: "o", q: t3("БМТ Бола ҳуқуқлари конвенциясининг 29-моддаси таълимдан нимани кутади?", "Чего статья 29 Конвенции ООН о правах ребёнка ждёт от образования?", "What does Article 29 of the UN Convention on the Rights of the Child expect from education?"), o: [t3("Табиий муҳитга ҳурматни тарбиялаш", "Воспитания уважения к природной среде", "Developing respect for the natural environment"), t3("Фақат математика", "Только математики", "Only maths")], c: 0 }
  ];

  /* ---------- 8. Ваъдалар (гувоҳнома учун) ---------- */
  const PLEDGE = [
    t3("Сувни тежайман ва очиқ жўмракни ёпаман", "Буду экономить воду и закрывать кран", "I will save water and turn off taps"),
    t3("Чиқиндини саралайман ва ахлат ташламайман", "Буду сортировать мусор и не мусорить", "I will sort waste and never litter"),
    t3("Дарахт ва гулларни синдирмайман", "Не буду ломать деревья и цветы", "I won’t break trees or flowers"),
    t3("Оловни ҳар доим ўчираман", "Всегда буду тушить огонь", "I will always put fires out"),
    t3("Табиатга зарар кўрсам, катталарга айтаман", "Увидев вред природе, скажу взрослым", "If I see harm to nature, I will tell an adult"),
    t3("Тўғри маълумотни расмий манбадан текшираман", "Буду проверять информацию в официальных источниках", "I will check facts in official sources")
  ];

  /* ---------- 9. Ўқитувчи ва ота-она учун: хорижий усуллар ---------- */
  const METHODS = [
    { ic: "📚", t: t3("«Ўз йўлингни танла» ҳикоялари", "Истории «Выбери свой путь»", "Choose-your-own-adventure stories"),
      who: t3("АҚШ, 1979 йилдан машҳур китоблар туркуми; таълимда «branching scenario» деб аталади", "США, серия книг с 1979 г.; в обучении — «ветвящийся сценарий»", "USA, a book series since 1979; in teaching called a “branching scenario”"),
      how: t3("Бола ҳикоя ичида қарор қабул қилади ва оқибатини дарҳол кўради. Ҳуқуқ нормаси ҳаётий танлов орқали эсда қолади.", "Ребёнок сам принимает решения в истории и сразу видит последствия. Норма права запоминается через жизненный выбор.", "The child makes decisions inside the story and sees the consequences at once. The legal rule sticks through a real-life choice."),
      use: t3("«Ҳикоялар» таби. Синфда овоз бериб танлаш мумкин.", "Вкладка «Истории». В классе можно выбирать голосованием.", "The Stories tab. In class, choose by a show of hands.") },
    { ic: "🤔", t: t3("P4C — «Болалар учун фалсафа»", "P4C — «Философия для детей»", "P4C — Philosophy for Children"),
      who: t3("Мэттью Липман, АҚШ (Монклер университети), 1970-йиллар; бугун 60 дан ортиқ мамлакатда", "Мэттью Липман, США (Монклер), 1970-е; сегодня в более чем 60 странах", "Matthew Lipman, USA (Montclair State), 1970s; now used in 60+ countries"),
      how: t3("«Изланиш жамоаси»: болалар доира бўлиб ўтиради, очиқ саволни муҳокама қилади, «нега?» ва «мисол келтир» деб сўрайди. Тўғри жавоб эмас, асосланган фикр муҳим.", "«Сообщество исследователей»: дети садятся в круг, обсуждают открытый вопрос, спрашивают «почему?» и «приведи пример». Важен не верный ответ, а обоснованная мысль.", "A “community of inquiry”: children sit in a circle, discuss an open question and ask “why?” and “give an example”. Reasoning matters more than a right answer."),
      use: t3("Ҳар ҳикоя охиридаги 🤔 савол.", "Вопрос 🤔 в конце каждой истории.", "The 🤔 question at the end of each story.") },
    { ic: "👥", t: t3("Think–Pair–Share («Ўйла — жуфтлаш — бўлиш»)", "Think–Pair–Share («Подумай — обсуди в паре — поделись»)", "Think–Pair–Share"),
      who: t3("Фрэнк Лайман, Мэриленд университети, АҚШ, 1981", "Фрэнк Лайман, Университет Мэриленда, США, 1981", "Frank Lyman, University of Maryland, USA, 1981"),
      how: t3("1 дақиқа ўзи ўйлайди → 2 дақиқа жуфти билан муҳокама → синфга айтади. Уятчан болалар ҳам гапиради.", "1 минута подумать самому → 2 минуты обсудить в паре → поделиться с классом. Говорят даже стеснительные.", "Think alone for 1 minute → discuss with a partner for 2 → share with the class. Even shy children speak."),
      use: t3("Конституция карточкаларидаги мисолларни муҳокама қилиш.", "Обсуждение примеров на карточках Конституции.", "Discussing the examples on the Constitution cards.") },
    { ic: "⚖️", t: t3("Street Law — «Ҳамма учун ҳуқуқ»", "Street Law — «Право для всех»", "Street Law"),
      who: t3("Жоржтаун университети, АҚШ, 1972 йилдан; мактабларда ўйналадиган суд мажлиси (mock trial)", "Джорджтаунский университет, США, с 1972 г.; школьные учебные суды (mock trial)", "Georgetown University, USA, since 1972; school mock trials"),
      how: t3("Ўқувчилар судья, инспектор, ҳимоячи, гувоҳ ролини ўйнайди. Синф — ҳакамлар. Ҳар ким бир дақиқа гапиради.", "Ученики играют судью, инспектора, защитника, свидетеля. Класс — присяжные. Каждому одна минута.", "Pupils play judge, inspector, defender and witness. The class is the jury. Everyone speaks for one minute."),
      use: t3("«Болалар суди» таби.", "Вкладка «Детский суд».", "The Kids’ court tab.") },
    { ic: "🔐", t: t3("Breakout EDU — квест-хона", "Breakout EDU — квест-комната", "Breakout EDU — escape room"),
      who: t3("АҚШ, 2015 йилдан; дарсда «қулфли сандиқ» ўйини", "США, с 2015 г.; игра «сундук с замками» на уроке", "USA, since 2015; the “locked box” classroom game"),
      how: t3("Гуруҳ вақт ичида топишмоқларни ечиб, қулфларни очади. Ҳамкорлик, мантиқ ва билимни бирга машқ қилади.", "Группа за отведённое время решает загадки и открывает замки. Тренирует сотрудничество, логику и знания.", "A team solves puzzles against the clock to open locks, practising teamwork, logic and knowledge."),
      use: t3("«Сирли дарё» таби. Синфда 4 гуруҳ — 4 қулф.", "Вкладка «Таинственная река». В классе 4 группы — 4 замка.", "The Mystery river tab. In class: 4 groups, 4 locks.") },
    { ic: "🎯", t: t3("Ўйинли викторина (Kahoot усули)", "Игровая викторина (как Kahoot)", "Game-based quiz (Kahoot-style)"),
      who: t3("Норвегия (NTNU), 2013; тезлик ва тўғриликка балл", "Норвегия (NTNU), 2013; баллы за скорость и точность", "Norway (NTNU), 2013; points for speed and accuracy"),
      how: t3("Ҳар савол 20 сония. Тез ва тўғри жавобга кўпроқ балл, кетма-кет тўғри жавобга бонус.", "20 секунд на вопрос. Больше баллов за быстрый верный ответ, бонус за серию.", "20 seconds per question. More points for a fast right answer, a bonus for streaks."),
      use: t3("«Викторина» таби. Ёшга қараб саволлар ўзгаради.", "Вкладка «Викторина». Вопросы зависят от возраста.", "The Quiz tab. Questions change with age.") },
    { ic: "🎟️", t: t3("«3-2-1» чиқиш чипта (exit ticket)", "«Билет на выход» 3-2-1 (exit ticket)", "3-2-1 exit ticket"),
      who: t3("АҚШ ва Буюк Британия мактабларида кенг тарқалган шакллантирувчи баҳолаш", "Формирующее оценивание, распространённое в школах США и Великобритании", "Formative assessment common in US and UK schools"),
      how: t3("Дарс охирида: 3 та янги билим, 2 та қизиқ нарса, 1 та савол. Ўқитувчи кейинги дарсни шунга қараб режалайди.", "В конце урока: 3 новых знания, 2 интересных факта, 1 вопрос. Учитель планирует следующий урок по ответам.", "At the end: 3 things learned, 2 interesting things, 1 question. The teacher plans the next lesson from them."),
      use: t3("Ҳар амалий дарс охирида.", "В конце каждого практического урока.", "At the end of every practical lesson.") },
    { ic: "🌐", t: t3("БМТ Бола ҳуқуқлари конвенцияси ва 26-умумий шарҳ", "Конвенция ООН о правах ребёнка и Замечание общего порядка № 26", "UN CRC and General Comment No. 26"),
      who: t3("БМТ, 1989; Ўзбекистон 1994 йилда қўшилган. 2023 йилда Бола ҳуқуқлари қўмитаси болаларнинг соғлом муҳит ҳуқуқи ҳақида 26-сонли шарҳни қабул қилди", "ООН, 1989; Узбекистан присоединился в 1994 г. В 2023 г. Комитет по правам ребёнка принял Замечание № 26 о праве детей на здоровую среду", "UN, 1989; Uzbekistan joined in 1994. In 2023 the Committee on the Rights of the Child adopted General Comment No. 26 on children’s right to a healthy environment"),
      how: t3("24-модда соғлиқни сақлашда атроф-муҳит ифлосланиши хавфини ҳисобга олишни, 29-модда таълимда табиий муҳитга ҳурматни тарбиялашни талаб қилади.", "Статья 24 требует учитывать риски загрязнения среды для здоровья, статья 29 — воспитывать уважение к природной среде.", "Article 24 asks health care to consider pollution risks; Article 29 asks education to build respect for the natural environment."),
      use: t3("Ўсмирлар учун: миллий ва халқаро ҳуқуқни солиштириш.", "Для подростков: сравнить национальное и международное право.", "For teens: compare national and international law.") }
  ];
  const SOURCES = [
    { t: t3("Ўзбекистон Республикаси Конституцияси (2023)", "Конституция Республики Узбекистан (2023)", "Constitution of the Republic of Uzbekistan (2023)"), u: LEX_CONST },
    { t: t3("БМТ Бола ҳуқуқлари конвенцияси", "Конвенция ООН о правах ребёнка", "UN Convention on the Rights of the Child"), u: "https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-child" },
    { t: t3("Бола ҳуқуқлари қўмитаси, 26-сонли умумий шарҳ (2023)", "Комитет по правам ребёнка, Замечание общего порядка № 26 (2023)", "CRC General Comment No. 26 (2023)"), u: "https://www.ohchr.org/en/documents/general-comments-and-recommendations/general-comment-no-26-2023-childrens-rights-and" },
    { t: t3("Street Law, Inc.", "Street Law, Inc.", "Street Law, Inc."), u: "https://www.streetlaw.org/" },
    { t: t3("IAPC — P4C (Монклер университети)", "IAPC — P4C (Университет Монклер)", "IAPC — P4C (Montclair State University)"), u: "https://www.montclair.edu/iapc/" }
  ];

  window.EKO_BOLA_HUQUQ = { STORIES, CONST, SORT, LESSONS, ROLES, CASES, ESCAPE, QUIZ, PLEDGE, METHODS, SOURCES };
})();
