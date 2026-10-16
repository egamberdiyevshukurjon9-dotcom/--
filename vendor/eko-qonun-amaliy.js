/* Экомун — «Экологик ҳуқуқ» бўлимидаги «Амалий дарслар» таби (университет босқичи).
   Shukurjon юборган «grok-workspace» архивидаги «Ekologiya asoslari», «Ekologik huquq amaliyoti»
   ва «Ekologik menejment» курсларидан 6 та дарс: кирилл, рус ва инглиз тилларига ўгирилган,
   ҳар бирида «уйда / аудиторияда» қадамлари, топшириқ, саволлар ва ўқитувчи учун изоҳ бор.
   vendor/eko-qonun.js «amaliy» табида window.EkoAmaliy.html() ни чақиради. */
(() => {
  "use strict";
  const ROOT = document.getElementById("qnRoot");
  if (!ROOT) return;
  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const tr = (s) => (EL() ? EL().tr(s) : s);
  const lang = () => (EL() ? EL().lang : "cyr");
  const L = (o) => {
    if (o == null) return "";
    if (typeof o === "string") return lang() === "lat" ? tr(o) : o;
    const l = lang();
    if (l === "ru") return o.ru || o.uz;
    if (l === "en") return o.en || tr(o.uz);
    if (l === "lat") return tr(o.uz);
    return o.uz;
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const H = (o) => esc(L(o));
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const ext = (u, label) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;

  const LESSONS = [
    { id: "ekotizim", ic: "🌿", min: 35, course: t3("Экология асослари", "Основы экологии", "Ecology basics"),
      t: t3("Экотизим ва унинг чегараси", "Экосистема и её граница", "An ecosystem and its boundary"),
      goal: t3("Экотизим, популяция ва муҳит омилини аралаштирмаслик.", "Не путать экосистему, популяцию и фактор среды.", "Keep ecosystem, population and environmental factor apart."),
      hook: t3("Ариқ бўйидаги теракзор экотизимми ёки фақат манзара?", "Тополиная роща у арыка — экосистема или просто пейзаж?", "Is the poplar grove by the canal an ecosystem or just scenery?"),
      body: [
        t3("Экотизим — организмлар ва жонсиз муҳит ўртасидаги модда ва энергия алмашинуви. Чегара тадқиқот саволига қараб чизилади.", "Экосистема — обмен веществом и энергией между организмами и неживой средой. Граница проводится по исследовательскому вопросу.", "An ecosystem is the exchange of matter and energy between organisms and the non-living environment. Its boundary follows the research question."),
        t3("«Мувозанат бузилди» деганда қайси омил (сув, туз, ов, кесиш) ўзгарганини айтинг. Умумий шиор далил эмас.", "Говоря «баланс нарушен», назовите фактор (вода, соль, охота, вырубка). Общий лозунг — не доказательство.", "When you say “the balance is broken”, name the factor (water, salt, hunting, felling). A slogan is not evidence.")
      ],
      tip: t3("Бир абзацда: объект, омил, ўлчов, манба.", "В одном абзаце: объект, фактор, измерение, источник.", "One paragraph: object, factor, measurement, source."),
      task: t3("Яқин атрофдан битта экотизим танланг. Иккита биотик ва иккита абиотик омил ёзинг. Ўлчай олмайдиган омилни «кузатув» деб белгиланг.", "Выберите ближайшую экосистему. Запишите два биотических и два абиотических фактора. Неизмеримый фактор отметьте как «наблюдение».", "Pick a nearby ecosystem. List two biotic and two abiotic factors. Mark any you cannot measure as “observation”."),
      quiz: [
        { q: t3("Экотизим чегараси қандай танланади?", "Как выбирается граница экосистемы?", "How is an ecosystem boundary chosen?"), o: [t3("Ҳар доим давлат чегараси", "Всегда по госгранице", "Always the state border"), t3("Тадқиқот саволига қараб", "По исследовательскому вопросу", "By the research question"), t3("Фақат дарё бўлса", "Только если есть река", "Only if there is a river")], c: 1, why: t3("Чегара илмий саволнинг бир қисми.", "Граница — часть научного вопроса.", "The boundary is part of the scientific question.") },
        { q: t3("«Мувозанат» даъвоси учун нима етишмайди?", "Чего не хватает утверждению о «балансе»?", "What does a “balance” claim lack?"), o: [t3("Шиор", "Лозунга", "A slogan"), t3("Қайси омил ва қандай ўлчов", "Какого фактора и какого измерения", "Which factor and what measurement"), t3("Расм", "Картинки", "A picture")], c: 1, why: t3("Ўлчовсиз мувозанат — мулоҳаза, далил эмас.", "Без измерения «баланс» — мнение, а не доказательство.", "Without measurement, “balance” is opinion, not evidence.") }
      ],
      teacher: t3("Чегарасиз «бутун сайёра» жавобини қайтаринг.", "Верните ответ «вся планета» без границы.", "Send back “the whole planet” answers with no boundary."),
      src: [{ t: t3("Конституция, 49-модда", "Конституция, статья 49", "Constitution, Article 49"), u: "https://lex.uz/docs/6445145" }] },
    { id: "orol", ic: "🏜️", min: 40, course: t3("Экология асослари", "Основы экологии", "Ecology basics"),
      t: t3("Оролбўйи чанги", "Пыль Приаралья", "Aral Sea dust"),
      goal: t3("Орол фожиасини битта сабабга қисқартирмасдан тушунтириш.", "Объяснить катастрофу Арала, не сводя её к одной причине.", "Explain the Aral disaster without reducing it to one cause."),
      hook: t3("Чанг бўрони фақат шамолми?", "Пыльная буря — это только ветер?", "Is a dust storm only about wind?"),
      body: [
        t3("Орол денгизининг қисқариши Амударё ва Сирдарё сувининг суғоришга олиниши, иқлим ва бошқарув қарорлари билан боғлиқ. Битта айбдор қулай, лекин нотўғри модел.", "Сокращение Арала связано с забором воды Амударьи и Сырдарьи на орошение, климатом и управленческими решениями. Один виновник удобен, но это неверная модель.", "The shrinking of the Aral Sea is linked to irrigation withdrawals from the Amu Darya and Syr Darya, climate and management decisions. A single culprit is convenient but wrong."),
        t3("49-модда Оролбўйини тиклаш ва ижтимоий-иқтисодий ривожлантиришни давлат чораси деб ёзади. Бу илмий баҳсни ёпмайди, ҳуқуқий рамка беради.", "Статья 49 называет восстановление и развитие Приаралья мерой государства. Это не закрывает научный спор, а задаёт правовую рамку.", "Article 49 makes restoring and developing the Aral region a state measure. It does not end the scientific debate; it gives a legal frame.")
      ],
      steps: [
        [t3("Уйда", "Дома", "At home"), t3("NASA Worldview ёки Earth Observatory да Оролнинг икки санасини топинг. Сана ва манбани ёзинг.", "Найдите в NASA Worldview или Earth Observatory снимки Арала за две даты. Запишите даты и источник.", "Find two dates of the Aral Sea in NASA Worldview or Earth Observatory. Note the dates and source.")],
        [t3("Аудиторияда", "В аудитории", "In class"), t3("Нима кўринди ва нима кўринмайди (сув сифати, туз, соғлиқ) — ажратинг.", "Разделите, что видно, а что нет (качество воды, соль, здоровье).", "Separate what is visible from what is not (water quality, salt, health).")]
      ],
      tip: t3("Сунъий йўлдош сув юзасини кўрсатади. Касаллик сабабини ўзи исботламайди.", "Спутник показывает площадь воды. Причину болезней он сам не доказывает.", "Satellites show water area. They do not by themselves prove the cause of illness."),
      task: t3("2000-йиллар ва ҳозирги тасвирни солиштириб, 8 жумлалик хулоса ёзинг: кузатув, билмайдиган жойингиз, ҳуқуқий модда.", "Сравните снимки 2000-х и нынешний, напишите вывод в 8 предложениях: наблюдение, чего вы не знаете, правовая статья.", "Compare a 2000s image with today’s and write 8 sentences: what you see, what you don’t know, the legal article."),
      quiz: [
        { q: t3("49-модда Орол ҳақида нима дейди?", "Что говорит статья 49 об Арале?", "What does Article 49 say about the Aral?"), o: [t3("Ҳеч нарса", "Ничего", "Nothing"), t3("Давлат экотизимни муҳофаза қилиш ва тиклаш чорасини кўради", "Государство принимает меры по охране и восстановлению экосистемы", "The state takes measures to protect and restore the ecosystem"), t3("Денгиз қайта тўлди", "Море наполнилось", "The sea has refilled")], c: 1, why: t3("Бу сиёсий ва ҳуқуқий мажбурият, ўлчов эмас.", "Это политическое и правовое обязательство, а не измерение.", "It is a political and legal commitment, not a measurement.") },
        { q: t3("Тасвирдаги қуруқлик нимани ўзи исботламайди?", "Что сама суша на снимке не доказывает?", "What does the dry land in the image not prove by itself?"), o: [t3("Сув юзаси камайганини", "Что площадь воды уменьшилась", "That water area shrank"), t3("Аниқ касаллик сабабини", "Точную причину болезней", "The exact cause of illness")], c: 1, why: t3("Соғлиқ алоқаси алоҳида тадқиқот талаб қилади.", "Связь со здоровьем требует отдельного исследования.", "The link to health needs separate research.") }
      ],
      teacher: t3("Битта «айбдор»га қисқартирилган жавобни қайтаринг.", "Верните ответ, сведённый к одному «виновнику».", "Send back answers that blame one single culprit."),
      src: [{ t: t3("NASA Worldview", "NASA Worldview", "NASA Worldview"), u: "https://worldview.earthdata.nasa.gov/" }, { t: t3("NASA Earth Observatory", "NASA Earth Observatory", "NASA Earth Observatory"), u: "https://earthobservatory.nasa.gov/" }] },
    { id: "ekspertiza", ic: "📑", min: 40, course: t3("Экологик ҳуқуқ амалиёти", "Практика экологического права", "Environmental law in practice"),
      t: t3("Экспертиза қачон шарт", "Когда обязательна экспертиза", "When an environmental review is required"),
      goal: t3("ЎРҚ-1036 бўйича экспертизасиз қурилиш хатосини таний олиш.", "Распознавать ошибку строительства без экспертизы по ЗРУ-1036.", "Recognise building without a review under ZRU-1036."),
      hook: t3("Цех кенгайди, хулосани «кейин олиб келамиз» дейишса, нима бузилади?", "Цех расширили и говорят «заключение принесём потом». Что нарушено?", "A workshop expanded and says “we’ll bring the conclusion later”. What is breached?"),
      body: [
        t3("2025 йил 24 февралдаги ЎРҚ-1036 эски 2000 йилги экспертиза қонуни ўрнига келган ва 25.08.2025 дан амалда.", "ЗРУ-1036 от 24 февраля 2025 г. заменил закон об экспертизе 2000 г. и действует с 25.08.2025.", "ZRU-1036 of 24 February 2025 replaced the 2000 expertise law and has applied since 25.08.2025."),
        t3("Ер ажратиш материаллари, лойиҳа, табиий ресурс меъёрлари ва зарарли ишлаб турган объект давлат экспертизасига тегишли бўлиши мумкин. АТБ хулосасининг кучи 3 йил, экологик меъёр лойиҳаси хулосаси 5 йил деб ёзилган.", "Материалы отвода земли, проекты, нормативы природопользования и действующие вредные объекты могут подлежать государственной экспертизе. Заключение ОВОС действует 3 года, по проекту экологических нормативов — 5 лет.", "Land allocation files, projects, resource-use standards and operating harmful facilities may need state review. An EIA conclusion is valid for 3 years, one on an environmental standards project for 5.")
      ],
      steps: [
        [t3("Уйда", "Дома", "At home"), t3("lex.uz даги ЎРҚ-1036 дан объектлар рўйхатини ўқинг. Учтасини ўз сўзингиз билан ёзинг.", "Прочитайте перечень объектов в ЗРУ-1036 на lex.uz. Опишите три своими словами.", "Read the list of objects in ZRU-1036 on lex.uz. Describe three in your own words.")],
        [t3("Аудиторияда", "В аудитории", "In class"), t3("«Экологик суд»даги «экспертизасиз омбор» ишини шу рўйхатга солиштиринг.", "Сопоставьте дело «склад без экспертизы» из «Экосуда» с этим перечнем.", "Compare the “warehouse without review” eco-court case with this list.")]
      ],
      tip: t3("ВМ №541 эмас, ВМ №234 (11.05.2026). Тоифа сонини қарор матнидан текширинг.", "Не ПКМ №541, а ПКМ №234 (11.05.2026). Число категорий сверяйте с текстом постановления.", "Not CM No. 541 but CM No. 234 (11.05.2026). Check the number of categories in the decree."),
      task: t3("Маҳаллангиздаги битта қурилиш учун: экспертиза керакми, қайси ҳужжат етишмаяпти, кимдан сўрайсиз — 10 жумла.", "Для одной стройки в махалле: нужна ли экспертиза, какого документа нет, у кого спросить — 10 предложений.", "For one building site nearby: is a review needed, which document is missing, whom do you ask — 10 sentences."),
      quiz: [
        { q: t3("Эски экспертиза қонуни қайси?", "Какой закон об экспертизе устарел?", "Which expertise law is outdated?"), o: [t3("ЎРҚ-1036", "ЗРУ-1036", "ZRU-1036"), t3("№73-II, 2000", "№73-II, 2000", "No. 73-II, 2000"), t3("Сув кодекси", "Водный кодекс", "Water Code")], c: 1, why: t3("№73-II ўрнига ЎРҚ-1036 келган.", "№73-II заменён ЗРУ-1036.", "ZRU-1036 replaced No. 73-II.") },
        { q: t3("АТБ хулосаси қонун бўйича неча йил кучда?", "Сколько лет действует заключение ОВОС по закону?", "How long is an EIA conclusion valid by law?"), o: [t3("1 ой", "1 месяц", "1 month"), t3("3 йил", "3 года", "3 years"), t3("Абадий", "Бессрочно", "Forever")], c: 1, why: t3("АТБ материаллари бўйича 3 йил, меъёр лойиҳаси 5 йил.", "По материалам ОВОС — 3 года, по проекту нормативов — 5 лет.", "3 years for EIA files, 5 for a standards project.") }
      ],
      teacher: t3("Талаба 541-қарорни амалдаги деб ёзса, 234 га қайтаринг.", "Если студент пишет о действующем постановлении № 541 — поправьте на № 234.", "If a student cites decree 541 as current, correct it to 234."),
      src: [{ t: t3("ЎРҚ-1036", "ЗРУ-1036", "ZRU-1036"), u: "https://lex.uz/docs/7397280" }] },
    { id: "suvkodeks", ic: "🌊", min: 35, course: t3("Экологик ҳуқуқ амалиёти", "Практика экологического права", "Environmental law in practice"),
      t: t3("Сув кодекси нимани ўзгартирди", "Что изменил Водный кодекс", "What the Water Code changed"),
      goal: t3("1993 йилги қонун ва 2025 йилги кодексни аралаштирмаслик.", "Не путать закон 1993 г. и кодекс 2025 г.", "Keep the 1993 law and the 2025 Code apart."),
      hook: t3("Слайдда «Сув ва сувдан фойдаланиш тўғрисида, 1993» қолган бўлса, нима дейсиз?", "Если на слайде осталось «О воде и водопользовании, 1993», что скажете?", "If a slide still says “On Water and Water Use, 1993”, what do you say?"),
      body: [
        t3("Сув кодекси ЎРҚ-1076 билан 30.07.2025 да тасдиқланган, 31.10.2025 дан амалда. У 1993 йилги қонун ўрнига келган.", "Водный кодекс утверждён ЗРУ-1076 30.07.2025 и действует с 31.10.2025. Он заменил закон 1993 г.", "The Water Code was approved by ZRU-1076 on 30.07.2025 and has applied since 31.10.2025, replacing the 1993 law."),
        t3("Ном янгиланган. Модда рақамини эски конспектдан кўчирманг. Амалий хато шу жойда бошланади: оқова сувни «ёмғир суви» деб аташ.", "Название обновлено. Не переписывайте номера статей из старого конспекта. Практическая ошибка начинается здесь: назвать сточные воды «дождевыми».", "The name is new. Don’t copy article numbers from old notes. The practical mistake starts here: calling wastewater “rainwater”.")
      ],
      tip: t3("Кодекс — йирик, тизимли ҳужжат. У қонун ўрнига келганда эски модда рақами автоматик сақланмайди.", "Кодекс — крупный системный документ. Старые номера статей при замене не сохраняются автоматически.", "A Code is a large systematic act. Old article numbers do not carry over automatically."),
      task: t3("Эски ва янги номни икки устунга ёзинг. Ўз тақдимотингизда қолган эскирган номни белгиланг.", "Запишите старое и новое название в два столбца. Отметьте устаревшее название в своей презентации.", "Write the old and new names in two columns. Mark any outdated name left in your slides."),
      quiz: [
        { q: t3("Сув муносабатларининг амалдаги асосий ҳужжати?", "Основной действующий документ по водным отношениям?", "The main water act in force?"), o: [t3("1993 йилги қонун", "Закон 1993 г.", "The 1993 law"), t3("Сув кодекси, ЎРҚ-1076", "Водный кодекс, ЗРУ-1076", "Water Code, ZRU-1076"), t3("ВМ №541", "ПКМ №541", "CM No. 541")], c: 1, why: t3("1993 йилги қонун кодекс билан алмаштирилган.", "Закон 1993 г. заменён кодексом.", "The Code replaced the 1993 law.") },
        { q: t3("Кодекс қачондан амалда?", "С какого числа действует кодекс?", "From when does the Code apply?"), o: ["1993", "31.10.2025", t3("Ҳали қабул қилинмаган", "Ещё не принят", "Not adopted yet")], c: 1, why: t3("Тасдиқланган 30.07.2025, амалда 31.10.2025.", "Утверждён 30.07.2025, действует с 31.10.2025.", "Approved 30.07.2025, in force 31.10.2025.") }
      ],
      teacher: t3("«Экологик кодекс»ни Сув кодекси билан адаштирган жавобни тўғриланг: экологик кодекс ҳали йўқ.", "Поправьте, если «Экологический кодекс» спутали с Водным: экологического кодекса пока нет.", "Correct anyone confusing an “Environmental Code” with the Water Code: there is no environmental code yet."),
      src: [{ t: t3("Сув кодекси (ЎРҚ-1076)", "Водный кодекс (ЗРУ-1076)", "Water Code (ZRU-1076)"), u: "https://lex.uz/docs/7655343" }] },
    { id: "iso", ic: "🔄", min: 30, course: t3("Экологик менежмент", "Экологический менеджмент", "Environmental management"),
      t: t3("Режала, бажар, текшир, тузат", "Планируй, делай, проверяй, исправляй", "Plan, do, check, act"),
      goal: t3("Атроф-муҳитни бошқариш циклини битта корхонада қўллаш.", "Применить цикл экологического менеджмента на одном предприятии.", "Apply the environmental management cycle to one plant."),
      hook: t3("Фильтр сотиб олиш бошқарув тизими бўладими?", "Покупка фильтра — это система управления?", "Is buying a filter a management system?"),
      body: [
        t3("Атроф-муҳитни бошқариш: мажбуриятни аниқлаш, чора кўриш, ўлчаш, тузатиш. Битта фильтр — чора, тизим эмас.", "Экологический менеджмент: определить обязательства, принять меры, измерить, исправить. Один фильтр — мера, а не система.", "Environmental management: identify obligations, act, measure, correct. One filter is a measure, not a system."),
        t3("ISO 14001 нашр йилини дарсда iso.org дан текширинг, йилни ёддан қўйманг.", "Год издания ISO 14001 проверяйте на iso.org, не пишите по памяти.", "Check the ISO 14001 edition year on iso.org; don’t write it from memory.")
      ],
      tip: t3("Сертификат борлиги жарима бўлмаслигини кафолатламайди.", "Сертификат не гарантирует отсутствие штрафов.", "A certificate does not guarantee there will be no fines."),
      task: t3("Тикув цехи учун тўрт қадам ёзинг: қайси қонун, қандай ўлчов, ким текширади, хато чиқса нима тузатилади.", "Для швейного цеха напишите четыре шага: какой закон, какое измерение, кто проверяет, что исправляется при ошибке.", "For a sewing workshop write four steps: which law, what measurement, who checks, what is corrected if something fails."),
      quiz: [
        { q: t3("Фильтр сотиб олиш циклнинг қайси қисми?", "Покупка фильтра — какая часть цикла?", "Which part of the cycle is buying a filter?"), o: [t3("Бутун тизим", "Вся система", "The whole system"), t3("Чоралардан биттаси", "Одна из мер", "One of the measures"), t3("Сертификатнинг ўзи", "Сам сертификат", "The certificate itself")], c: 1, why: t3("Ўлчов ва текширув бўлмаса, фильтр тизим эмас.", "Без измерения и проверки фильтр — не система.", "Without measurement and checks, a filter is not a system.") },
        { q: t3("ISO йилини қаердан оласиз?", "Откуда брать год ISO?", "Where do you get the ISO year?"), o: [t3("Эски слайддан", "Со старого слайда", "An old slide"), t3("iso.org даги саҳифадан", "Со страницы на iso.org", "The iso.org page"), t3("Ёддан", "По памяти", "From memory")], c: 1, why: t3("Нашр йили ўзгариши мумкин.", "Год издания может меняться.", "Editions change.") }
      ],
      teacher: t3("Йилни текширмасдан ёзган талабадан манба сўранг.", "Спросите источник у студента, написавшего год без проверки.", "Ask for a source when a student writes the year unchecked."),
      src: [{ t: t3("ISO 14001 (iso.org)", "ISO 14001 (iso.org)", "ISO 14001 (iso.org)"), u: "https://www.iso.org/iso-14001-environmental-management.html" }] },
    { id: "kampus", ic: "🏫", min: 35, course: t3("Экологик менежмент", "Экологический менеджмент", "Environmental management"),
      t: t3("Кампус чиқиндилари режаси", "План по отходам кампуса", "A campus waste plan"),
      goal: t3("Ўлчовли ва масъулиятли чиқинди режаси скелетини тузиш.", "Составить каркас измеримого плана по отходам с ответственными.", "Draft a measurable waste plan with named owners."),
      hook: t3("«Кўпроқ қути қўямиз» — режами?", "«Поставим больше урн» — это план?", "Is “we’ll add more bins” a plan?"),
      body: [
        t3("Режада манба (қаерда ҳосил бўлади), оқим (қаерга кетади), масъул ва ўлчов бўлиши керак.", "В плане должны быть источник (где образуется), поток (куда уходит), ответственный и измерение.", "A plan needs a source (where waste arises), a flow (where it goes), an owner and a measurement."),
        t3("«Чиқиндилар тўғрисида»ги Қонун рамка беради. Қути ранги эса ички тартиб. Ҳажмни «Чиқиндилар ҳисоби» бўлимидаги МРО-10 калькуляторида ҳисобланг.", "Закон «Об отходах» задаёт рамку, а цвет урн — внутренний порядок. Объём посчитайте калькулятором МРО-10 в разделе «Расчёт отходов».", "The Law “On Waste” sets the frame; bin colours are internal rules. Estimate the volume with the MRO-10 calculator in the Waste calculation section.")
      ],
      tip: t3("Оғирлик ёки ҳажм бўлмаса, «камайтирдик» деб бўлмайди.", "Без массы или объёма нельзя сказать «сократили».", "Without weight or volume you cannot claim a reduction."),
      task: t3("Ўз факультетингиз учун бир ҳафталик режа: нима тортилади, ким йиғади, қаерга топширилади, қандай муваффақиятсизлик ёзилади.", "Недельный план для факультета: что взвешивается, кто собирает, куда сдаётся, какие неудачи фиксируются.", "A one-week plan for your faculty: what is weighed, who collects, where it goes, which failures are logged."),
      quiz: [
        { q: t3("Режада нима бўлмаса, у шиор бўлиб қолади?", "Без чего план превращается в лозунг?", "Without what does a plan become a slogan?"), o: [t3("Рангли қути расми", "Картинки цветных урн", "A picture of coloured bins"), t3("Ўлчов ва масъул", "Измерения и ответственного", "A measurement and an owner"), t3("Логотип", "Логотипа", "A logo")], c: 1, why: t3("Масъул ва рақамсиз режа бажарилганини кўрсатмайди.", "Без ответственного и цифр нельзя показать выполнение.", "Without an owner and numbers, nobody can show it was done.") },
        { q: t3("Қути ранги нимани алмаштирмайди?", "Что не заменяет цвет урны?", "What does bin colour not replace?"), o: [t3("Ички тартибни", "Внутренний порядок", "Internal rules"), t3("Қонуний топширишни", "Законную передачу отходов", "Lawful hand-over of waste")], c: 1, why: t3("Топшириш шартномаси ва ҳисоб — қонуний занжир.", "Договор передачи и учёт — законная цепочка.", "The hand-over contract and records are the legal chain.") }
      ],
      teacher: t3("Фақат «хабардорлик» деб ёзилган режани қайтаринг.", "Верните план, где написано только «повышение осведомлённости».", "Send back plans that only say “awareness”."),
      src: [{ t: t3("«Чиқиндилар тўғрисида»ги Қонун, №362-II", "Закон «Об отходах», №362-II", "Law “On Waste”, No. 362-II"), u: "https://lex.uz/ru/docs/44872" }] }
  ];

  const KEY = "ekotalim:qonun-amaliy";
  let st = { done: {}, notes: {} };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  let cur = null, pick = {}, checked = false;

  function html() {
    if (!cur) {
      return `<div class="qn-card"><h3>🧑‍🏫 ${H(t3("Амалий дарслар: ҳуқуқ ва экология амалда", "Практические уроки: право и экология на практике", "Hands-on lessons: law and ecology in practice"))}</h3>
          <p class="muted">${H(t3("Ҳар дарс «тескари синф» тартибида: уйда ўқиш ва манба топиш, аудиторияда солиштириш ва баҳс. Охирида топшириқ ва 2 та савол.", "Каждый урок по схеме «перевёрнутого класса»: дома — чтение и поиск источников, в аудитории — сравнение и спор. В конце — задание и 2 вопроса.", "Every lesson follows the flipped classroom: read and find sources at home, compare and debate in class. Then a task and 2 questions."))}</p>
          <p class="small muted">${H(t3("Манба: Shukurjon юборган ўқув материаллари (grok-workspace).", "Источник: учебные материалы, присланные Shukurjon (grok-workspace).", "Source: teaching materials sent by Shukurjon (grok-workspace)."))}</p></div>
        <div class="qn-grid">${LESSONS.map((l) => `<div class="qn-card">
          <h3>${l.ic} ${H(l.t)} ${st.done[l.id] ? `<span class="qn-tag">✓</span>` : ""}</h3>
          <div class="qn-meta"><span class="qn-tag">${H(l.course)}</span><span class="qn-tag">⏱ ${l.min} ${H(t3("дақиқа", "мин", "min"))}</span></div>
          <p>${H(l.goal)}</p>
          <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-am-open="${l.id}">${H(t3("Очиш →", "Открыть →", "Open →"))}</button></div>
        </div>`).join("")}</div>`;
    }
    const l = LESSONS.find((x) => x.id === cur);
    const ok = checked ? l.quiz.filter((q, i) => pick[i] === q.c).length : 0;
    return `<div class="qn-card" id="amLesson">
      <h3>${l.ic} ${H(l.t)}</h3>
      <div class="qn-meta"><span class="qn-tag">${H(l.course)}</span><span class="qn-tag">⏱ ${l.min} ${H(t3("дақиқа", "мин", "min"))}</span></div>
      <p><b>🎯 ${H(t3("Мақсад", "Цель", "Goal"))}:</b> ${H(l.goal)}</p>
      <p class="qn-quote">❓ ${H(l.hook)}</p>
      ${l.body.map((b) => `<p>${H(b)}</p>`).join("")}
      ${l.steps ? `<h4>👣 ${H(t3("Қадамлар", "Шаги", "Steps"))}</h4><ul>${l.steps.map(([a, b]) => `<li><b>${H(a)}:</b> ${H(b)}</li>`).join("")}</ul>` : ""}
      <p><b>💡</b> ${H(l.tip)}</p>
      <h4>📝 ${H(t3("Топшириқ", "Задание", "Task"))}</h4><p>${H(l.task)}</p>
      <textarea class="qn-ta" rows="4" data-am-note="${l.id}">${esc(st.notes[l.id] || "")}</textarea>
      <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-am-act="note">💾 ${H(t3("Жавобни сақлаш", "Сохранить ответ", "Save answer"))}</button></div>
      <h4>🧠 ${H(t3("Саволлар", "Вопросы", "Questions"))}</h4>
      <ol class="hb-quiz">${l.quiz.map((q, i) => `<li><p>${H(q.q)}</p><div class="qn-roles">${q.o.map((o, j) => `<button type="button" class="chip ${pick[i] === j ? "active" : ""} ${checked ? (j === q.c ? "hb-good" : pick[i] === j ? "hb-bad" : "") : ""}" data-am-q="${i}:${j}">${H(o)}</button>`).join("")}</div>${checked ? `<p class="small muted">${H(q.why)}</p>` : ""}</li>`).join("")}</ol>
      ${checked ? `<p class="qn-score">${ok} / ${l.quiz.length}</p>` : ""}
      <div class="qn-acts pdf-skip"><button class="btn btn-primary btn-sm" data-am-act="check" ${Object.keys(pick).length < l.quiz.length ? "disabled" : ""}>${H(t3("Текшириш", "Проверить", "Check"))}</button></div>
      <details class="hb-teacher"><summary>👩‍🏫 ${H(t3("Ўқитувчи учун", "Для преподавателя", "For the teacher"))}</summary><p>${H(l.teacher)}</p></details>
      <p class="qn-src">📚 ${l.src.map((s) => ext(s.u, L(s.t))).join(" · ")}</p>
      <div class="qn-acts pdf-skip"><button class="btn btn-ghost btn-sm" data-am-act="pdf"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> PDF</button><button class="btn btn-ghost btn-sm" data-am-act="back">${H(t3("← Дарслар", "← Уроки", "← Lessons"))}</button></div>
    </div>`;
  }
  const refresh = (keepY) => { const y = window.scrollY; if (window.EkoQonun) EkoQonun.open("amaliy"); if (keepY) window.scrollTo(0, y); };

  ROOT.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || !ROOT.contains(b)) return;
    const ds = b.dataset;
    if (ds.amOpen) { cur = ds.amOpen; pick = {}; checked = false; refresh(false); const el = document.getElementById("amLesson"); if (el) el.scrollIntoView({ behavior: "smooth" }); return; }
    if (ds.amQ) { const [i, j] = ds.amQ.split(":").map(Number); pick[i] = j; checked = false; refresh(true); return; }
    switch (ds.amAct) {
      case "check": {
        checked = true;
        const l = LESSONS.find((x) => x.id === cur);
        if (l.quiz.every((q, i) => pick[i] === q.c) && !st.done[l.id]) {
          st.done[l.id] = 1; save();
          if (window.EkoApp && EkoApp.addXp) EkoApp.addXp(5, L(l.t));
        }
        refresh(true); return;
      }
      case "note": {
        const t = ROOT.querySelector(`[data-am-note="${cur}"]`);
        if (t) { st.notes[cur] = t.value.trim(); save(); if (window.EkoApp && EkoApp.toast) EkoApp.toast(L(t3("Сақланди", "Сохранено", "Saved"))); }
        return;
      }
      case "pdf": {
        const el = document.getElementById("amLesson");
        const l = LESSONS.find((x) => x.id === cur);
        if (el && window.EkoPDF) EkoPDF.save(el, { title: L(l.t), sub: L(l.course) + " · Ekomun", file: "Ekomun-amaliy-" + l.id });
        return;
      }
      case "back": cur = null; refresh(false); return;
    }
  });

  window.EkoAmaliy = { html, done: () => Object.keys(st.done).length, lessons: LESSONS };
})();
