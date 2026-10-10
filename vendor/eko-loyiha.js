/* ЭкоТаълим — 🎓 «Лойиҳалар» бўлими (университет босқичи).
   Талаба хорижий университет методикаларидан бирини танлаб, экологик лойиҳани
   босқичма-босқич бажаради: босқич топшириқлари, канвас, Kanban тахтаси,
   рубрика бўйича ўзини баҳолаш ва ҳисобот (HTML) юклаб олиш.
   Маълумот фақат қурилмада сақланади (localStorage «ekotalim:projects»).
   Матнлар uz/ru/en кўринишида шу файлда; лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const SEC = document.getElementById("loyiha");
  const ROOT = document.getElementById("lyRoot");
  if (!SEC || !ROOT) return;

  /* EkoLang — index.html даги умумий const (window хусусияти эмас) */
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
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const H = (o) => esc(L(o));
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const App = () => window.EkoApp;
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(L(o)); };
  const xpOnce = (k, n, why) => { const a = App(); if (!a) return; a.state.flags = a.state.flags || {}; if (!a.state.flags[k]) { a.state.flags[k] = true; a.addXp(n, why); } };

  /* ===================== Методикалар ===================== */
  /* Қулайлик учун: S(номи[uz,ru,en], тавсиф[uz,ru,en], [натижалар[uz,ru,en]...]) */
  const S = (n, d, outs) => ({ t: t3(...n), d: t3(...d), o: outs.map((x) => t3(...x)) });
  const METHODS = [
    {
      id: "pbl", icon: "🛠", color: "#16a34a",
      name: t3("Лойиҳа таълими — PBL «Олтин стандарт»", "Проектное обучение — PBL «Золотой стандарт»", "Project-Based Learning — Gold Standard PBL"),
      from: t3("PBLWorks (Buck Institute), АҚШ; Финляндия мактаблари", "PBLWorks (Buck Institute), США; школы Финляндии", "PBLWorks (Buck Institute), USA; Finnish schools"),
      about: t3("Ҳақиқий муаммо атрофида узоқ муддатли тадқиқот; якунда жамоатчиликка кўрсатиладиган маҳсулот.", "Длительное исследование вокруг реальной проблемы; в конце — продукт, представленный публике.", "Sustained inquiry around a real problem, ending with a product shown to a public audience."),
      when: t3("Курс лойиҳаси, 4–8 ҳафта, 3–5 кишилик жамоа", "Курсовой проект, 4–8 недель, команда 3–5 человек", "Course project, 4–8 weeks, team of 3–5"),
      stages: [
        S(["Етакчи савол", "Ведущий вопрос", "Driving question"], ["Муаммони бир очиқ саволга айлантиринг: «Биз қандай қилиб …?»", "Превратите проблему в один открытый вопрос: «Как мы можем …?»", "Turn the problem into one open question: “How can we …?”"], [["Етакчи савол ёзилди", "Ведущий вопрос записан", "Driving question written"], ["Ким учун муҳимлиги аниқланди", "Определено, для кого это важно", "Who it matters to is defined"]]),
        S(["Узлуксиз тадқиқот", "Устойчивое исследование", "Sustained inquiry"], ["Савол → манба → янги савол циклини камида 3 марта такрорланг.", "Повторите цикл вопрос → источник → новый вопрос не менее 3 раз.", "Repeat the question → source → new question cycle at least 3 times."], [["Камида 5 та ишончли манба", "Не менее 5 надёжных источников", "At least 5 reliable sources"], ["Ўз ўлчови ёки сўровномаси", "Собственное измерение или опрос", "Own measurement or survey"]]),
        S(["Ҳақиқийлик", "Аутентичность", "Authenticity"], ["Реал маҳалла, корхона ёки университет билан боғланинг.", "Свяжитесь с реальной махаллей, предприятием или вузом.", "Connect with a real neighbourhood, company or university."], [["Ташқи ҳамкор ёки эксперт топилди", "Найден внешний партнёр или эксперт", "External partner or expert found"]]),
        S(["Танлов ва овоз", "Выбор и голос", "Voice and choice"], ["Жамоа ечимни ўзи танлайди ва роллар тақсимланади.", "Команда сама выбирает решение и распределяет роли.", "The team chooses the solution and assigns roles."], [["Роллар тақсимланди", "Роли распределены", "Roles assigned"], ["Ечим варианти танланди", "Выбран вариант решения", "Solution option chosen"]]),
        S(["Танқид ва қайта ишлаш", "Критика и доработка", "Critique and revision"], ["Бошқа жамоа ва ўқитувчидан фикр олинг («Галерея айланиши»).", "Получите отзывы других команд и преподавателя («Галерейная прогулка»).", "Get feedback from other teams and the teacher (“gallery walk”)."], [["Камида 2 та фикр олинди", "Получено не менее 2 отзывов", "At least 2 pieces of feedback"], ["2-версия тайёр", "Готова 2-я версия", "Version 2 ready"]]),
        S(["Рефлексия", "Рефлексия", "Reflection"], ["Нимани ўргандик, нима ишламади, кейинги сафар нима ўзгаради?", "Чему научились, что не сработало, что изменим?", "What did we learn, what failed, what would we change?"], [["Рефлексия ёзилди", "Рефлексия записана", "Reflection written"]]),
        S(["Оммавий маҳсулот", "Публичный продукт", "Public product"], ["Натижани маҳалла, кафедра ёки ижтимоий тармоқда тақдим этинг.", "Представьте результат махалле, кафедре или в соцсетях.", "Present the result to the community, department or online."], [["Тақдимот ўтказилди", "Презентация проведена", "Presentation given"], ["Маҳсулот (постер, видео, прототип)", "Продукт (постер, видео, прототип)", "Product (poster, video, prototype)"]])
      ],
      canvas: [["dq", t3("Етакчи савол", "Ведущий вопрос", "Driving question")], ["aud", t3("Аудитория ва ҳамкор", "Аудитория и партнёр", "Audience and partner")], ["prod", t3("Якуний маҳсулот", "Итоговый продукт", "Final product")]]
    },
    {
      id: "dt", icon: "💡", color: "#f59e0b",
      name: t3("Дизайн-фикрлаш (Design Thinking)", "Дизайн-мышление (Design Thinking)", "Design Thinking"),
      from: t3("Стэнфорд d.school ва IDEO, АҚШ", "Stanford d.school и IDEO, США", "Stanford d.school and IDEO, USA"),
      about: t3("Одамга йўналтирилган ечим: аввал фойдаланувчини тушунамиз, кейин тез прототип ясаб синаймиз.", "Решение, ориентированное на человека: сначала понимаем пользователя, затем быстро прототипируем и тестируем.", "Human-centred: first understand the user, then prototype fast and test."),
      when: t3("Хизмат, ускуна ёки илова ғояси; 1–4 ҳафта", "Идея услуги, устройства или приложения; 1–4 недели", "A service, device or app idea; 1–4 weeks"),
      stages: [
        S(["Ҳамдардлик", "Эмпатия", "Empathize"], ["5–8 нафар фойдаланувчи билан суҳбат ва кузатув.", "Интервью и наблюдение за 5–8 пользователями.", "Interview and observe 5–8 users."], [["Суҳбатлар ёзиб олинди", "Интервью записаны", "Interviews recorded"], ["Эмпатия харитаси", "Карта эмпатии", "Empathy map"]]),
        S(["Муаммони аниқлаш", "Определение", "Define"], ["POV: «[Фойдаланувчи]га [эҳтиёж] керак, чунки [сабаб]».", "POV: «[Пользователю] нужно [потребность], потому что [причина]».", "POV: “[User] needs [need] because [insight].”"], [["POV жумласи", "Формулировка POV", "POV statement"], ["«Қандай қилиб …?» саволи", "Вопрос «Как мы могли бы …?»", "“How might we …?” question"]]),
        S(["Ғоялар", "Генерация идей", "Ideate"], ["Брейншторм: 30 дақиқада камида 20 ғоя, кейин 3 тасини танланг.", "Брейншторм: не менее 20 идей за 30 минут, затем выберите 3.", "Brainstorm: 20+ ideas in 30 minutes, then pick 3."], [["20+ ғоя", "20+ идей", "20+ ideas"], ["3 та энг яхши ғоя танланди", "Выбраны 3 лучшие идеи", "Top 3 ideas chosen"]]),
        S(["Прототип", "Прототип", "Prototype"], ["Қоғоз, картон ёки оддий макет — бир кунда.", "Бумага, картон или простой макет — за один день.", "Paper, cardboard or a simple mock-up — in one day."], [["Прототип ясалди", "Прототип готов", "Prototype built"]]),
        S(["Синов", "Тестирование", "Test"], ["Фойдаланувчилар билан синанг ва ўзгартиринг.", "Протестируйте с пользователями и доработайте.", "Test with users and iterate."], [["5 фойдаланувчи синади", "Протестировали 5 пользователей", "5 users tested"], ["Ўзгаришлар рўйхати", "Список изменений", "List of changes"]])
      ],
      canvas: [["pov", t3("POV жумласи", "Формулировка POV", "POV statement")], ["hmw", t3("«Қандай қилиб …?»", "«Как мы могли бы …?»", "“How might we …?”")], ["user", t3("Асосий фойдаланувчи (персона)", "Основной пользователь (персона)", "Primary user (persona)")]]
    },
    {
      id: "cbl", icon: "🚀", color: "#ef4444",
      name: t3("Муаммога асосланган таълим — Challenge Based Learning", "Обучение через вызов — Challenge Based Learning", "Challenge Based Learning"),
      from: t3("Apple, 2008; Европа университетлари (EIT)", "Apple, 2008; университеты Европы (EIT)", "Apple, 2008; European universities (EIT)"),
      about: t3("Катта ғоя → аниқ «чақириқ» → тадқиқот → амалий ҳаракат. Натижа — ҳақиқий ўзгариш.", "Большая идея → конкретный вызов → исследование → действие. Итог — реальное изменение.", "Big idea → concrete challenge → investigation → action. The result is real change."),
      when: t3("Маҳалла ёки кампусдаги аниқ муаммо", "Конкретная проблема махалли или кампуса", "A concrete problem in the community or campus"),
      stages: [
        S(["Жалб қилиш", "Вовлечение", "Engage"], ["Катта ғоя (масалан, «сув»), асосий савол ва аниқ чақириқ.", "Большая идея (например, «вода»), главный вопрос и конкретный вызов.", "Big idea (e.g. “water”), essential question and a concrete challenge."], [["Катта ғоя", "Большая идея", "Big idea"], ["Чақириқ жумласи", "Формулировка вызова", "Challenge statement"]]),
        S(["Тадқиқ", "Исследование", "Investigate"], ["Йўналтирувчи саволлар, манбалар ва таҳлил.", "Направляющие вопросы, источники и анализ.", "Guiding questions, resources and analysis."], [["10+ йўналтирувчи савол", "10+ направляющих вопросов", "10+ guiding questions"], ["Таҳлил хулосаси", "Вывод анализа", "Analysis summary"]]),
        S(["Ҳаракат", "Действие", "Act"], ["Ечимни ишлаб чиқинг, амалга оширинг ва натижасини ўлчанг.", "Разработайте решение, внедрите и измерьте результат.", "Develop the solution, implement it and measure the result."], [["Ечим амалга оширилди", "Решение внедрено", "Solution implemented"], ["Натижа ўлчанди", "Результат измерен", "Result measured"], ["Видео ёки ҳисобот", "Видео или отчёт", "Video or report"]])
      ],
      canvas: [["big", t3("Катта ғоя", "Большая идея", "Big idea")], ["eq", t3("Асосий савол", "Главный вопрос", "Essential question")], ["ch", t3("Чақириқ", "Вызов", "Challenge")]]
    },
    {
      id: "cdio", icon: "⚙️", color: "#0ea5e9",
      name: t3("CDIO — ўйлаш, лойиҳалаш, ясаш, ишлатиш", "CDIO — задумать, спроектировать, внедрить, управлять", "CDIO — Conceive, Design, Implement, Operate"),
      from: t3("MIT (АҚШ), Chalmers ва KTH (Швеция), 2000; 200+ муҳандислик университети", "MIT (США), Chalmers и KTH (Швеция), 2000; 200+ инженерных вузов", "MIT (USA), Chalmers and KTH (Sweden), 2000; 200+ engineering schools"),
      about: t3("Муҳандислик лойиҳасининг тўлиқ ҳаёт цикли: ғоядан ишлайдиган қурилмагача.", "Полный жизненный цикл инженерного проекта: от идеи до работающего устройства.", "The full life cycle of an engineering project: from idea to a working device."),
      when: t3("Техник ечим: фильтр, датчик, суғориш тизими", "Техническое решение: фильтр, датчик, система полива", "A technical solution: filter, sensor, irrigation system"),
      stages: [
        S(["Ўйлаш (Conceive)", "Замысел (Conceive)", "Conceive"], ["Эҳтиёж, талаблар ва техник топшириқ.", "Потребность, требования и техническое задание.", "Need, requirements and specification."], [["Техник топшириқ", "Техническое задание", "Specification"]]),
        S(["Лойиҳалаш (Design)", "Проектирование (Design)", "Design"], ["Схема, ҳисоб-китоб, материаллар ва смета.", "Схема, расчёты, материалы и смета.", "Drawings, calculations, materials and budget."], [["Чизма/схема", "Чертёж/схема", "Drawing/schematic"], ["Ҳисоб-китоб", "Расчёты", "Calculations"], ["Смета", "Смета", "Budget"]]),
        S(["Ясаш (Implement)", "Изготовление (Implement)", "Implement"], ["Прототипни йиғинг ва синов режасини тузинг.", "Соберите прототип и составьте план испытаний.", "Build the prototype and write a test plan."], [["Прототип йиғилди", "Прототип собран", "Prototype built"], ["Синов натижалари", "Результаты испытаний", "Test results"]]),
        S(["Ишлатиш (Operate)", "Эксплуатация (Operate)", "Operate"], ["Реал шароитда ишлатинг, хизмат ва самарадорликни баҳоланг.", "Эксплуатируйте в реальных условиях, оцените обслуживание и эффективность.", "Run it in real conditions; assess maintenance and performance."], [["Самарадорлик кўрсаткичи", "Показатель эффективности", "Performance indicator"], ["Фойдаланиш йўриқномаси", "Инструкция по эксплуатации", "User manual"]])
      ],
      canvas: [["req", t3("Асосий талаблар", "Ключевые требования", "Key requirements")], ["kpi", t3("Самарадорлик кўрсаткичи (KPI)", "Показатель эффективности (KPI)", "Performance indicator (KPI)")]]
    },
    {
      id: "capstone", icon: "🎓", color: "#7c3aed",
      name: t3("Capstone — битирув лойиҳаси", "Capstone — выпускной проект", "Capstone project"),
      from: t3("АҚШ, Буюк Британия ва Австралия университетлари", "Университеты США, Великобритании и Австралии", "Universities in the USA, UK and Australia"),
      about: t3("Барча ўқиган фанларни бирлаштирадиган якуний лойиҳа; кўпинча буюртмачи корхона билан.", "Итоговый проект, объединяющий все изученные дисциплины; часто с заказчиком-предприятием.", "A final project bringing together everything studied; often with an industry client."),
      when: t3("Битирув иши, магистрлик диссертацияси, 1–2 семестр", "Выпускная работа, магистерская диссертация, 1–2 семестра", "Graduation thesis or master's project, 1–2 semesters"),
      stages: [
        S(["Таклиф (Proposal)", "Заявка (Proposal)", "Proposal"], ["Мавзу, мақсад, вазифалар, режа ва раҳбар.", "Тема, цель, задачи, план и руководитель.", "Topic, aims, objectives, plan and supervisor."], [["Таклиф тасдиқланди", "Заявка утверждена", "Proposal approved"], ["Гант жадвали", "Диаграмма Ганта", "Gantt chart"]]),
        S(["Адабиётлар шарҳи", "Обзор литературы", "Literature review"], ["20+ манба, илмий бўшлиқни аниқлаш.", "20+ источников, определение научного пробела.", "20+ sources; identify the research gap."], [["Шарҳ ёзилди", "Обзор написан", "Review written"]]),
        S(["Методология", "Методология", "Methodology"], ["Усул, намуна, асбоблар ва таҳлил усули.", "Метод, выборка, инструменты и анализ.", "Method, sample, tools and analysis plan."], [["Методология боби", "Глава методологии", "Methodology chapter"]]),
        S(["Бажариш ва маълумот", "Выполнение и данные", "Execution and data"], ["Тажриба, ўлчов ёки моделлаштириш.", "Эксперимент, измерения или моделирование.", "Experiment, measurement or modelling."], [["Маълумотлар тўплами", "Набор данных", "Dataset"]]),
        S(["Таҳлил ва натижалар", "Анализ и результаты", "Analysis and results"], ["Статистика, графиклар, муҳокама.", "Статистика, графики, обсуждение.", "Statistics, charts, discussion."], [["Натижалар боби", "Глава результатов", "Results chapter"]]),
        S(["Ҳимоя", "Защита", "Defence"], ["Плакат ёки тақдимот, комиссия олдида ҳимоя.", "Постер или презентация, защита перед комиссией.", "Poster or slides; defence before a panel."], [["Тақдимот", "Презентация", "Presentation"], ["Тўлиқ матн", "Полный текст", "Full text"]])
      ],
      canvas: [["aim", t3("Мақсад", "Цель", "Aim")], ["obj", t3("Вазифалар (3–5 та)", "Задачи (3–5)", "Objectives (3–5)")], ["gap", t3("Илмий бўшлиқ", "Научный пробел", "Research gap")]]
    },
    {
      id: "research", icon: "🔬", color: "#2563eb",
      name: t3("Илмий тадқиқот цикли (IMRaD)", "Цикл научного исследования (IMRaD)", "Research cycle (IMRaD)"),
      from: t3("Халқаро илмий журналлар стандарти", "Стандарт международных научных журналов", "The international journal standard"),
      about: t3("Гипотезани текшириш ва натижани мақола шаклида ёзиш: Кириш, Усуллар, Натижалар, Муҳокама.", "Проверка гипотезы и оформление статьи: Введение, Методы, Результаты, Обсуждение.", "Test a hypothesis and write it up: Introduction, Methods, Results and Discussion."),
      when: t3("Илмий мақола, конференция, талабалар илмий тўгараги", "Научная статья, конференция, студенческий кружок", "Paper, conference, student research club"),
      stages: [
        S(["Савол ва гипотеза", "Вопрос и гипотеза", "Question and hypothesis"], ["Текшириладиган гипотеза: «Агар …, у ҳолда …».", "Проверяемая гипотеза: «Если …, то …».", "Testable hypothesis: “If …, then …”."], [["H₀ ва H₁ ёзилди", "Записаны H₀ и H₁", "H₀ and H₁ written"]]),
        S(["Усуллар", "Методы", "Methods"], ["Ўлчов асбоби, намуна сони, такрорлар, назорат гуруҳи.", "Прибор, объём выборки, повторы, контрольная группа.", "Instrument, sample size, replicates, control group."], [["Тажриба дизайни", "Дизайн эксперимента", "Experimental design"]]),
        S(["Натижалар", "Результаты", "Results"], ["Жадвал ва графиклар; ўртача ± стандарт четланиш.", "Таблицы и графики; среднее ± стандартное отклонение.", "Tables and charts; mean ± standard deviation."], [["Жадвал/график", "Таблица/график", "Table/chart"], ["Статистик тест (t, χ², ANOVA)", "Статистический тест (t, χ², ANOVA)", "Statistical test (t, χ², ANOVA)"]]),
        S(["Муҳокама", "Обсуждение", "Discussion"], ["Натижани адабиёт билан солиштиринг, чекловларни ёзинг.", "Сравните с литературой, укажите ограничения.", "Compare with the literature; state limitations."], [["Муҳокама ва хулоса", "Обсуждение и вывод", "Discussion and conclusion"]]),
        S(["Нашр", "Публикация", "Publication"], ["Тезис ёки мақола; ҳамкасблар тақризи.", "Тезисы или статья; рецензирование.", "Abstract or paper; peer review."], [["Мақола юборилди", "Статья отправлена", "Paper submitted"]])
      ],
      canvas: [["h", t3("Гипотеза", "Гипотеза", "Hypothesis")], ["var", t3("Ўзгарувчилар (мустақил / боғлиқ)", "Переменные (независимая / зависимая)", "Variables (independent / dependent)")]]
    },
    {
      id: "lean", icon: "📈", color: "#db2777",
      name: t3("Lean Startup ва Lean Canvas", "Lean Startup и Lean Canvas", "Lean Startup and Lean Canvas"),
      from: t3("Эрик Рис (2011), Эш Маурья (2010), АҚШ", "Эрик Рис (2011), Эш Маурья (2010), США", "Eric Ries (2011), Ash Maurya (2010), USA"),
      about: t3("Экологик ғояни бизнесга айлантириш: «Ясаш → ўлчаш → ўрганиш» цикли ва 1 саҳифалик канвас.", "Превращение эко-идеи в бизнес: цикл «Создать → измерить → научиться» и канвас на 1 странице.", "Turn a green idea into a business: the Build → Measure → Learn loop and a one-page canvas."),
      when: t3("Яшил стартап, грант ёки инновация танлови", "Зелёный стартап, грант или конкурс инноваций", "Green start-up, grant or innovation contest"),
      stages: [
        S(["Канвас", "Канвас", "Canvas"], ["Lean Canvas нинг 9 блокини тўлдиринг (пастда).", "Заполните 9 блоков Lean Canvas (ниже).", "Fill in the 9 Lean Canvas blocks (below)."], [["Канвас тўлдирилди", "Канвас заполнен", "Canvas completed"]]),
        S(["Гипотезалар", "Гипотезы", "Hypotheses"], ["Энг хавфли 3 та фаразни танланг.", "Выберите 3 самых рискованных допущения.", "Pick the 3 riskiest assumptions."], [["3 та фараз", "3 допущения", "3 assumptions"]]),
        S(["MVP (Ясаш)", "MVP (Создать)", "MVP (Build)"], ["Энг оддий синов маҳсулоти: сайт, макет, 10 дона намуна.", "Простейший продукт для теста: сайт, макет, 10 образцов.", "Simplest test product: landing page, mock-up, 10 samples."], [["MVP тайёр", "MVP готов", "MVP ready"]]),
        S(["Ўлчаш", "Измерить", "Measure"], ["Мижоз суҳбатлари ва рақамлар: нечтаси сотиб олди/рўйхатдан ўтди?", "Интервью и цифры: сколько купили/зарегистрировались?", "Customer interviews and numbers: how many bought/signed up?"], [["20 та мижоз суҳбати", "20 интервью с клиентами", "20 customer interviews"], ["Асосий метрика", "Ключевая метрика", "Key metric"]]),
        S(["Ўрганиш: давом ёки бурилиш", "Научиться: продолжать или «пивот»", "Learn: persevere or pivot"], ["Маълумотга қараб қарор: давом этамиз ёки ғояни ўзгартирамиз.", "Решение по данным: продолжаем или меняем идею.", "Data-driven decision: keep going or change the idea."], [["Қарор ва асос", "Решение и обоснование", "Decision and rationale"], ["Питч (3 дақиқа)", "Питч (3 минуты)", "Pitch (3 minutes)"]])
      ],
      canvas: [["problem", t3("Муаммо", "Проблема", "Problem")], ["segments", t3("Мижозлар сегменти", "Сегменты клиентов", "Customer segments")], ["uvp", t3("Ноёб қиймат таклифи", "Уникальное ценностное предложение", "Unique value proposition")], ["solution", t3("Ечим", "Решение", "Solution")], ["channels", t3("Каналлар", "Каналы", "Channels")], ["revenue", t3("Даромад манбалари", "Источники дохода", "Revenue streams")], ["cost", t3("Харажатлар", "Структура затрат", "Cost structure")], ["metrics", t3("Асосий кўрсаткичлар", "Ключевые метрики", "Key metrics")], ["unfair", t3("Рақобат устунлиги", "Нечестное преимущество", "Unfair advantage")]]
    },
    {
      id: "scrum", icon: "🔄", color: "#0d9488",
      name: t3("Agile / Scrum — спринтлар билан ишлаш", "Agile / Scrum — работа спринтами", "Agile / Scrum — working in sprints"),
      from: t3("Швабер ва Сазерленд (Scrum Guide, 2020); IT ва муҳандислик жамоалари", "Швабер и Сазерленд (Scrum Guide, 2020); IT и инженерные команды", "Schwaber & Sutherland (Scrum Guide, 2020); IT and engineering teams"),
      about: t3("Иш 1–2 ҳафталик спринтларга бўлинади; ҳар спринт охирида ишлайдиган натижа кўрсатилади.", "Работа делится на спринты по 1–2 недели; в конце каждого — работающий результат.", "Work is split into 1–2 week sprints; each ends with a working increment."),
      when: t3("Илова, сайт, датчик тармоғи; жамоа 3–9 киши", "Приложение, сайт, сеть датчиков; команда 3–9 человек", "App, website, sensor network; team of 3–9"),
      stages: [
        S(["Маҳсулот рўйхати", "Бэклог продукта", "Product backlog"], ["Барча вазифаларни Kanban тахтасига ёзинг ва муҳимлиги бўйича тартибланг.", "Запишите все задачи на Kanban-доску и упорядочьте по важности.", "Put every task on the Kanban board and order by priority."], [["10+ вазифа тахтада", "10+ задач на доске", "10+ tasks on the board"]]),
        S(["Спринт режаси", "Планирование спринта", "Sprint planning"], ["Спринт мақсади ва шу спринтда бажариладиган вазифалар.", "Цель спринта и задачи на этот спринт.", "Sprint goal and the tasks for this sprint."], [["Спринт мақсади", "Цель спринта", "Sprint goal"]]),
        S(["Спринт", "Спринт", "Sprint"], ["Ҳар куни 15 дақиқалик учрашув: кеча нима қилдим, бугун нима, нима халақит беряпти.", "Ежедневная 15-минутка: что сделал вчера, что сегодня, что мешает.", "Daily 15-minute stand-up: yesterday, today, blockers."], [["Вазифалар «Тайёр» устунида", "Задачи в колонке «Готово»", "Tasks in the “Done” column"]]),
        S(["Кўрик", "Обзор спринта", "Sprint review"], ["Натижани буюртмачи ёки ўқитувчига кўрсатинг.", "Покажите результат заказчику или преподавателю.", "Demo the increment to the client or teacher."], [["Демо ўтказилди", "Демо проведено", "Demo done"]]),
        S(["Ретроспектива", "Ретроспектива", "Retrospective"], ["Нима яхши бўлди, нимани ўзгартирамиз — кейинги спринт учун.", "Что было хорошо, что изменим — для следующего спринта.", "What went well, what to change — for the next sprint."], [["3 та яхшилаш", "3 улучшения", "3 improvements"]])
      ],
      canvas: [["goal", t3("Спринт мақсади", "Цель спринта", "Sprint goal")], ["dod", t3("«Тайёр» таърифи (Definition of Done)", "Определение готовности (DoD)", "Definition of Done")]]
    },
    {
      id: "toc", icon: "🎯", color: "#ea580c",
      name: t3("Ўзгариш назарияси ва мантиқий матрица (ToC / LogFrame)", "Теория изменений и логическая рамка (ToC / LogFrame)", "Theory of Change and Logical Framework (ToC / LogFrame)"),
      from: t3("БМТ ТД (UNDP), GEF, Яшил иқлим жамғармаси, Жаҳон банки", "ПРООН (UNDP), ГЭФ, Зелёный климатический фонд, Всемирный банк", "UNDP, GEF, Green Climate Fund, World Bank"),
      about: t3("Халқаро грант лойиҳалари тили: муаммо дарахти → мақсад → натижалар → фаолият → SMART кўрсаткичлар.", "Язык международных грантов: дерево проблем → цель → результаты → мероприятия → SMART-индикаторы.", "The language of international grants: problem tree → goal → outcomes → activities → SMART indicators."),
      when: t3("Грант аризаси (масалан, GEF Кичик грантлар дастури)", "Грантовая заявка (например, Программа малых грантов ГЭФ)", "A grant proposal (e.g. GEF Small Grants Programme)"),
      stages: [
        S(["Муаммо дарахти", "Дерево проблем", "Problem tree"], ["Илдизлар — сабаблар, тана — асосий муаммо, шохлар — оқибатлар.", "Корни — причины, ствол — главная проблема, ветви — последствия.", "Roots are causes, the trunk is the core problem, branches are effects."], [["Муаммо дарахти чизилди", "Нарисовано дерево проблем", "Problem tree drawn"]]),
        S(["Узоқ муддатли мақсад", "Долгосрочная цель", "Impact"], ["5–10 йилда нима ўзгаради?", "Что изменится через 5–10 лет?", "What changes in 5–10 years?"], [["Мақсад жумласи", "Формулировка цели", "Impact statement"]]),
        S(["Натижалар ва маҳсулотлар", "Результаты и продукты", "Outcomes and outputs"], ["Лойиҳа охирида нима бўлади ва нима яратилади?", "Что будет в конце проекта и что будет создано?", "What will be true at the end and what will be produced?"], [["3 та натижа", "3 результата", "3 outcomes"], ["Маҳсулотлар рўйхати", "Список продуктов", "List of outputs"]]),
        S(["Фаолият ва бюджет", "Мероприятия и бюджет", "Activities and budget"], ["Ҳар бир маҳсулот учун фаолият, муддат, масъул ва харажат.", "Для каждого продукта — мероприятие, срок, ответственный и затраты.", "For each output: activity, timing, owner and cost."], [["Иш режаси", "План работ", "Work plan"], ["Бюджет", "Бюджет", "Budget"]]),
        S(["Кўрсаткичлар ва хатарлар", "Индикаторы и риски", "Indicators and risks"], ["SMART кўрсаткичлар, текшириш манбаи, фаразлар ва хатарлар.", "SMART-индикаторы, источники проверки, допущения и риски.", "SMART indicators, means of verification, assumptions and risks."], [["Мантиқий матрица (LogFrame)", "Логическая рамка (LogFrame)", "LogFrame matrix"], ["Хатарлар жадвали", "Таблица рисков", "Risk table"]])
      ],
      canvas: [["impact", t3("Узоқ муддатли мақсад", "Долгосрочная цель", "Impact")], ["outcome", t3("Натижалар", "Результаты", "Outcomes")], ["indic", t3("SMART кўрсаткичлар", "SMART-индикаторы", "SMART indicators")], ["assume", t3("Фаразлар ва хатарлар", "Допущения и риски", "Assumptions and risks")]]
    },
    {
      id: "lca", icon: "♻️", color: "#65a30d",
      name: t3("Ҳаёт цикли таҳлили (LCA)", "Оценка жизненного цикла (LCA)", "Life Cycle Assessment (LCA)"),
      from: t3("ISO 14040/14044 халқаро стандарти, Европа Иттифоқи", "Международный стандарт ISO 14040/14044, ЕС", "ISO 14040/14044 standard, EU"),
      about: t3("Маҳсулотнинг «бешикдан қабргача» таъсири: хомашё, ишлаб чиқариш, ташиш, фойдаланиш, чиқинди.", "Воздействие продукта «от колыбели до могилы»: сырьё, производство, транспорт, использование, отходы.", "A product's “cradle-to-grave” impact: raw materials, production, transport, use, waste."),
      when: t3("Иккита маҳсулотни солиштириш: пластик ёки шиша, қоғоз ёки мато", "Сравнение двух продуктов: пластик или стекло, бумага или ткань", "Comparing two products: plastic vs glass, paper vs cloth"),
      stages: [
        S(["Мақсад ва чегара", "Цель и границы", "Goal and scope"], ["Функционал бирлик (масалан, «1000 литр ичимлик») ва тизим чегараси.", "Функциональная единица (например, «1000 литров напитка») и границы системы.", "Functional unit (e.g. “1,000 litres of drink”) and system boundary."], [["Функционал бирлик", "Функциональная единица", "Functional unit"]]),
        S(["Инвентаризация (LCI)", "Инвентаризация (LCI)", "Inventory (LCI)"], ["Ҳар бир босқичда энергия, сув, хомашё ва чиқиндилар.", "Энергия, вода, сырьё и отходы на каждом этапе.", "Energy, water, materials and waste at each stage."], [["Инвентаризация жадвали", "Таблица инвентаризации", "Inventory table"]]),
        S(["Таъсирни баҳолаш (LCIA)", "Оценка воздействия (LCIA)", "Impact assessment (LCIA)"], ["CO₂-экв (GWP-100), сув изи ва бошқа кўрсаткичлар.", "CO₂-экв (GWP-100), водный след и другие показатели.", "CO₂-eq (GWP-100), water footprint and other categories."], [["CO₂-экв ҳисоби", "Расчёт CO₂-экв", "CO₂-eq calculation"]]),
        S(["Талқин", "Интерпретация", "Interpretation"], ["Қайси босқич энг катта таъсир беради ва нимани яхшилаш мумкин?", "Какой этап даёт наибольшее воздействие и что улучшить?", "Which stage dominates and what can be improved?"], [["Хулоса ва тавсиялар", "Выводы и рекомендации", "Conclusions and recommendations"]])
      ],
      canvas: [["fu", t3("Функционал бирлик", "Функциональная единица", "Functional unit")], ["bound", t3("Тизим чегараси", "Границы системы", "System boundary")]]
    },
    {
      id: "citsci", icon: "📡", color: "#0891b2",
      name: t3("Фуқаро илми (Citizen Science)", "Гражданская наука (Citizen Science)", "Citizen Science"),
      from: t3("NASA GLOBE дастури, iNaturalist, Европа фуқаро илми ассоциацияси", "Программа NASA GLOBE, iNaturalist, Европейская ассоциация гражданской науки", "NASA GLOBE Programme, iNaturalist, European Citizen Science Association"),
      about: t3("Кўплаб кўнгиллилар ягона протокол билан маълумот йиғади: ҳаво, сув, қушлар, дарахтлар.", "Множество волонтёров собирают данные по единому протоколу: воздух, вода, птицы, деревья.", "Many volunteers collect data with one protocol: air, water, birds, trees."),
      when: t3("Маҳалла ёки шаҳар бўйлаб мониторинг", "Мониторинг по махалле или городу", "Neighbourhood- or city-wide monitoring"),
      stages: [
        S(["Протокол", "Протокол", "Protocol"], ["Нимани, қаерда, қачон ва қандай асбоб билан ўлчаймиз?", "Что, где, когда и каким прибором измеряем?", "What, where, when and with which instrument?"], [["Ўлчов протоколи", "Протокол измерений", "Measurement protocol"]]),
        S(["Кўнгиллилар ва ўқитиш", "Волонтёры и обучение", "Volunteers and training"], ["Камида 10 кўнгиллини протокол бўйича ўқитинг.", "Обучите по протоколу не менее 10 волонтёров.", "Train at least 10 volunteers on the protocol."], [["10+ кўнгилли", "10+ волонтёров", "10+ volunteers"]]),
        S(["Маълумот йиғиш", "Сбор данных", "Data collection"], ["Ягона жадвал, вақт ва GPS билан. «Эко-харита» бўлимидан фойдаланинг.", "Единая таблица, со временем и GPS. Используйте раздел «Эко-карта».", "One shared sheet with time and GPS. Use the Eco-map section."], [["100+ ўлчов", "100+ измерений", "100+ measurements"]]),
        S(["Сифат назорати", "Контроль качества", "Quality control"], ["Шубҳали қийматларни белгиланг ва такроран текширинг.", "Отметьте сомнительные значения и перепроверьте.", "Flag outliers and re-check them."], [["Тозаланган маълумот", "Очищенные данные", "Cleaned dataset"]]),
        S(["Очиқ натижа", "Открытые результаты", "Open results"], ["Харита ва хулосани жамоатчилик ва ҳокимият билан бўлишинг.", "Поделитесь картой и выводами с обществом и хокимиятом.", "Share the map and findings with the public and local authority."], [["Харита/инфографика", "Карта/инфографика", "Map/infographic"], ["Хат ёки тақдимот", "Письмо или презентация", "Letter or presentation"]])
      ],
      canvas: [["what", t3("Нима ўлчанади", "Что измеряем", "What is measured")], ["tool", t3("Асбоб ва аниқлик", "Прибор и точность", "Instrument and accuracy")]]
    },
    {
      id: "service", icon: "🤝", color: "#6366f1",
      name: t3("Хизмат орқали ўрганиш (Service-Learning)", "Обучение через служение (Service-Learning)", "Service-Learning"),
      from: t3("АҚШ университетлари (Campus Compact), Германия ва Корея", "Университеты США (Campus Compact), Германия и Корея", "US universities (Campus Compact), Germany and Korea"),
      about: t3("Ўқув мавзуси жамиятга фойдали иш билан боғланади: ҳашар, маърифий дарс, кўнгиллилик.", "Учебная тема связывается с полезным для общества делом: хашар, просветительский урок, волонтёрство.", "Coursework is tied to real community service: clean-ups, outreach lessons, volunteering."),
      when: t3("Маҳалла, мактаб ёки нодавлат ташкилот билан ҳамкорлик", "Сотрудничество с махаллей, школой или НКО", "Partnership with a community, school or NGO"),
      stages: [
        S(["Эҳтиёжни аниқлаш", "Определение потребности", "Identify the need"], ["Ҳамкор ташкилот билан учрашинг ва эҳтиёжни сўранг.", "Встретьтесь с партнёром и спросите о потребности.", "Meet the partner and ask about the need."], [["Ҳамкор топилди", "Партнёр найден", "Partner found"]]),
        S(["Режа", "План", "Plan"], ["Ким, нима, қачон; хавфсизлик ва рухсатлар.", "Кто, что, когда; безопасность и разрешения.", "Who, what, when; safety and permissions."], [["Иш режаси", "План работ", "Work plan"]]),
        S(["Хизмат", "Служение", "Service"], ["Амалий ишни бажаринг ва «олдин/кейин» суратга олинг («Ҳашар» бўлими).", "Выполните работу и сфотографируйте «до/после» (раздел «Хашар»).", "Do the work and take before/after photos (Hashar section)."], [["Олдин/кейин суратлари", "Фото до/после", "Before/after photos"]]),
        S(["Рефлексия", "Рефлексия", "Reflection"], ["Бу иш назария билан қандай боғланди?", "Как работа связана с теорией?", "How did the work connect to theory?"], [["Рефлексив эссе", "Рефлексивное эссе", "Reflective essay"]]),
        S(["Кўрсатиш ва нишонлаш", "Демонстрация и празднование", "Demonstrate and celebrate"], ["Натижани ҳамкор билан бирга нишонланг ва ҳисобот беринг.", "Отметьте результат с партнёром и отчитайтесь.", "Celebrate with the partner and report back."], [["Ҳисобот", "Отчёт", "Report"]])
      ],
      canvas: [["partner", t3("Ҳамкор ва эҳтиёж", "Партнёр и потребность", "Partner and need")]]
    }
  ];

  /* ===================== Ғоялар банки ===================== */
  const IDEAS = [
    { id: "kampus", icon: "🏫", m: ["cdio", "pbl"], sdg: [6, 7, 13], link: "#kalkulyator",
      t: t3("Яшил кампус: энергия ва сув аудити", "Зелёный кампус: аудит энергии и воды", "Green campus: energy and water audit"),
      d: t3("Ётоқхона ёки ўқув биносидаги электр ва сув сарфини ўлчаб, 15% тежаш режасини тузинг. «Эко-маданият» дастурида 2026 йилдан олийгоҳларда «яшил кампус» лойиҳалари бошланади.", "Измерьте расход электричества и воды в общежитии или корпусе и составьте план экономии 15%. По программе «Эко-маданият» с 2026 года в вузах начинаются проекты «зелёного кампуса».", "Measure electricity and water use in a dorm or building and plan a 15% saving. Under the Eco-madaniyat programme, “green campus” projects start at universities from 2026.") },
    { id: "yomgir", icon: "🌧️", m: ["dt", "cdio"], sdg: [6, 11], link: "#monografiya",
      t: t3("Ёмғир ва кондиционер сувини йиғиш", "Сбор дождевой воды и конденсата", "Harvesting rain and AC condensate"),
      d: t3("Том майдони ва йиллик ёғин бўйича йиғиладиган сув ҳажмини ҳисобланг ва гулзорни суғориш тизимини лойиҳаланг.", "Рассчитайте объём воды по площади крыши и годовым осадкам и спроектируйте полив клумб.", "Estimate harvestable water from roof area and annual rainfall and design a garden irrigation system.") },
    { id: "kompost", icon: "🍂", m: ["lean", "cbl"], sdg: [12, 13], link: "#vlab",
      t: t3("Ошхона чиқиндисидан компост", "Компост из отходов столовой", "Compost from canteen waste"),
      d: t3("Органик чиқиндини тортиб, полигонга кетганда ҳосил бўладиган метанни ва компост билан тежалган CO₂-эквивалентни ҳисобланг.", "Взвесьте органические отходы, рассчитайте метан на полигоне и CO₂-экв, сэкономленный компостированием.", "Weigh organic waste; estimate landfill methane and the CO₂-eq saved by composting.") },
    { id: "pm25", icon: "🌫️", m: ["citsci", "research"], sdg: [3, 11], link: "#havo",
      t: t3("PM2.5 датчиклари тармоғи", "Сеть датчиков PM2.5", "A PM2.5 sensor network"),
      d: t3("Арзон датчиклар билан маҳаллада ҳаво сифатини ўлчанг ва «Ҳаво сифати» бўлимидаги модел билан солиштиринг.", "Измерьте качество воздуха недорогими датчиками и сравните с моделью в разделе «Качество воздуха».", "Measure air quality with low-cost sensors and compare with the model in the Air Quality section.") },
    { id: "issiqorol", icon: "🌡️", m: ["research", "citsci"], sdg: [11, 13], link: "#xarita",
      t: t3("Шаҳар иссиқлик ороли харитаси", "Карта городского острова тепла", "Urban heat island map"),
      d: t3("Асфальт, майса ва соядаги ҳароратни соатма-соат ўлчаб, дарахт экиш учун энг керакли жойларни топинг.", "Измерьте температуру асфальта, газона и тени по часам и найдите места, где деревья нужнее всего.", "Measure asphalt, lawn and shade temperatures hourly and find where trees are needed most.") },
    { id: "plastik", icon: "🧴", m: ["lean", "dt"], sdg: [12, 14], link: "#chellenj",
      t: t3("Пластикни қайта ишлаш стартапи", "Стартап по переработке пластика", "A plastic recycling start-up"),
      d: t3("ПЭТ идишларни йиғиш нуқталари ва улардан маҳсулот ясаш ғоясини Lean Canvas билан синанг.", "Проверьте идею пунктов сбора ПЭТ и изделий из него с помощью Lean Canvas.", "Test a PET collection-and-products idea with a Lean Canvas.") },
    { id: "tomchi", icon: "💧", m: ["cdio", "capstone"], sdg: [2, 6], link: "#monografiya",
      t: t3("Томчилатиб суғориш ва сув тежаш", "Капельное орошение и экономия воды", "Drip irrigation and water saving"),
      d: t3("Томорқада эгатли ва томчилатиб суғоришни солиштириб, сув ва ҳосилдорликни ўлчанг.", "Сравните бороздковое и капельное орошение на участке, измерьте воду и урожай.", "Compare furrow and drip irrigation on a plot; measure water use and yield.") },
    { id: "quyosh", icon: "☀️", m: ["capstone", "toc"], sdg: [7, 13], link: "#lab3d",
      t: t3("Томга қуёш панели: техник-иқтисодий асос", "Солнечные панели на крыше: ТЭО", "Rooftop solar: feasibility study"),
      d: t3("3D лабораторияда панел бурчагини танлаб, йиллик ишлаб чиқариш, нарх ва қопланиш муддатини ҳисобланг.", "Подберите угол панели в 3D-лаборатории и рассчитайте годовую выработку, стоимость и окупаемость.", "Choose the panel angle in the 3D lab and estimate annual output, cost and payback.") },
    { id: "daraxt", icon: "🌳", m: ["citsci", "research"], sdg: [13, 15], link: "#lab3d",
      t: t3("Маҳалла дарахтлари инвентаризацияси", "Инвентаризация деревьев махалли", "Neighbourhood tree inventory"),
      d: t3("Дарахтларнинг диаметри ва баландлигини ўлчаб, аллометрия билан тўпланган углеродни ҳисобланг (3D лаборатория → «Дарахт ва CO₂»).", "Измерьте диаметр и высоту деревьев и рассчитайте запас углерода по аллометрии (3D-лаборатория → «Деревья и CO₂»).", "Measure tree diameter and height and estimate stored carbon with allometry (3D lab → Trees and CO₂).") },
    { id: "botqoq", icon: "🪷", m: ["research", "capstone"], sdg: [6, 15], link: "#monografiya",
      t: t3("Сунъий ботқоқлик билан оқова сувни тозалаш", "Очистка сточных вод искусственным болотом", "Constructed wetland for wastewater"),
      d: t3("Қамиш ва қум қатламли кичик модел ясаб, кириш ва чиқишдаги лойқалик ва pH ни солиштиринг.", "Соберите малую модель с тростником и песком и сравните мутность и pH на входе и выходе.", "Build a small reed-and-sand model and compare turbidity and pH at inlet and outlet.") },
    { id: "tekstil", icon: "👕", m: ["dt", "service"], sdg: [12], link: "#hashar",
      t: t3("Кийим алмашиш ва upcycling", "Обмен одеждой и апсайклинг", "Clothes swap and upcycling"),
      d: t3("Талабалар орасида кийим алмашиш тадбирини ташкил қилиб, тежалган сув ва CO₂ ни ҳисобланг.", "Организуйте обмен одеждой среди студентов и посчитайте сэкономленные воду и CO₂.", "Run a student clothes swap and estimate the water and CO₂ saved.") },
    { id: "lcaidish", icon: "🍶", m: ["lca"], sdg: [12, 13], link: "#kalkulyator",
      t: t3("Пластик ёки шиша идиш? (LCA)", "Пластиковая или стеклянная тара? (LCA)", "Plastic or glass bottle? (LCA)"),
      d: t3("1000 литр ичимлик учун пластик, шиша ва қайта ишлатиладиган шиша идишнинг CO₂ изини солиштиринг.", "Сравните CO₂-след пластиковой, стеклянной и многоразовой стеклянной тары на 1000 литров напитка.", "Compare the CO₂ footprint of plastic, glass and refillable glass for 1,000 litres of drink.") },
    { id: "grant", icon: "🏛️", m: ["toc", "scrum"], sdg: [13, 17], link: "#onlayn",
      t: t3("Иқлим гранти аризаси", "Заявка на климатический грант", "Climate grant proposal"),
      d: t3("Маҳалла учун иқлимга мослашув лойиҳасини мантиқий матрица билан ёзинг (GEF Кичик грантлар дастури формати).", "Напишите проект адаптации к климату для махалли с логической рамкой (формат Программы малых грантов ГЭФ).", "Write a community climate-adaptation project with a LogFrame (GEF Small Grants format).") }
  ];
  const SDG = { 2: t3("Очликка барҳам", "Ликвидация голода", "Zero hunger"), 3: t3("Саломатлик", "Здоровье", "Good health"), 6: t3("Тоза сув", "Чистая вода", "Clean water"), 7: t3("Тоза энергия", "Чистая энергия", "Clean energy"), 11: t3("Барқарор шаҳарлар", "Устойчивые города", "Sustainable cities"), 12: t3("Масъулиятли истеъмол", "Ответственное потребление", "Responsible consumption"), 13: t3("Иқлим ҳаракати", "Борьба с изменением климата", "Climate action"), 14: t3("Сув ости ҳаёти", "Жизнь под водой", "Life below water"), 15: t3("Қуруқликдаги ҳаёт", "Жизнь на суше", "Life on land"), 17: t3("Ҳамкорлик", "Партнёрство", "Partnerships") };

  const ROLES = [t3("Лойиҳа раҳбари", "Руководитель проекта", "Project lead"), t3("Тадқиқотчи", "Исследователь", "Researcher"), t3("Маълумотлар таҳлилчиси", "Аналитик данных", "Data analyst"), t3("Муҳандис / дизайнер", "Инженер / дизайнер", "Engineer / designer"), t3("Коммуникация", "Коммуникации", "Communications")];
  const RUBRIC = [
    [t3("Муаммо ва савол", "Проблема и вопрос", "Problem and question"), [t3("Мавҳум", "Размыто", "Vague"), t3("Аниқ, лекин тор", "Ясно, но узко", "Clear but narrow"), t3("Аниқ ва долзарб", "Ясно и актуально", "Clear and relevant"), t3("Янги ва ўлчанадиган", "Ново и измеримо", "Original and measurable")]],
    [t3("Далиллар ва манбалар", "Доказательства и источники", "Evidence and sources"), [t3("Манбасиз", "Без источников", "No sources"), t3("1–2 манба", "1–2 источника", "1–2 sources"), t3("5+ ишончли манба", "5+ надёжных источников", "5+ reliable sources"), t3("Ўз маълумоти + манбалар", "Свои данные + источники", "Own data + sources")]],
    [t3("Ечим ва амалиёт", "Решение и практика", "Solution and practice"), [t3("Ғоя даражасида", "На уровне идеи", "Idea only"), t3("Режа бор", "Есть план", "Plan exists"), t3("Синалган", "Протестировано", "Tested"), t3("Жорий қилинган, натижа ўлчанган", "Внедрено, результат измерен", "Implemented, impact measured")]],
    [t3("Жамоавий иш", "Командная работа", "Teamwork"), [t3("Бир киши ишлади", "Работал один", "One person did it"), t3("Роллар ноаниқ", "Роли неясны", "Roles unclear"), t3("Роллар тақсимланган", "Роли распределены", "Roles shared"), t3("Ҳамма ҳисса қўшди, низолар ҳал қилинди", "Вклад всех, конфликты решены", "Everyone contributed, conflicts resolved")]],
    [t3("Тақдимот", "Презентация", "Presentation"), [t3("Тартибсиз", "Беспорядочно", "Disorganised"), t3("Тушунарли", "Понятно", "Understandable"), t3("Ишонарли, CER билан", "Убедительно, с CER", "Convincing, uses CER"), t3("Аудиторияни ҳаракатга ундайди", "Побуждает аудиторию к действию", "Moves the audience to act")]]
  ];
  const TX = {
    pill: t3("🎓 Университет босқичи · лойиҳа таълими", "🎓 Университетский этап · проектное обучение", "🎓 University stage · project-based learning"),
    title: t3("Лойиҳалар", "Проекты", "Projects"),
    lead: t3("Хорижий университетлар методикаси билан экологик лойиҳа бажаринг: методикани танланг, жамоа тузинг, босқичларни белгилаб боринг ва ҳисоботни юклаб олинг. Ҳар бир якунланган босқич учун +15 XP, лойиҳа учун +50 XP.", "Выполните эко-проект по методикам зарубежных университетов: выберите методику, соберите команду, отмечайте этапы и скачайте отчёт. За каждый этап +15 XP, за проект +50 XP.", "Run an environmental project with methods from universities abroad: pick a method, form a team, tick off stages and download a report. +15 XP per stage, +50 XP per project."),
    tabs: [["my", t3("📂 Менинг лойиҳаларим", "📂 Мои проекты", "📂 My projects")], ["ideas", t3("💡 Ғоялар банки", "💡 Банк идей", "💡 Idea bank")], ["methods", t3("🌍 Методикалар", "🌍 Методики", "🌍 Methods")], ["rubric", t3("📊 Баҳолаш рубрикаси", "📊 Рубрика оценки", "📊 Assessment rubric")]],
    newP: t3("＋ Янги лойиҳа", "＋ Новый проект", "＋ New project"),
    empty: t3("Ҳали лойиҳа йўқ. «Янги лойиҳа» тугмасини босинг ёки ғоялар банкидан танланг.", "Проектов пока нет. Нажмите «Новый проект» или выберите идею из банка.", "No projects yet. Press “New project” or pick one from the idea bank."),
    name: t3("Лойиҳа номи", "Название проекта", "Project title"),
    method: t3("Методика", "Методика", "Method"),
    idea: t3("Ғоя (ихтиёрий)", "Идея (необязательно)", "Idea (optional)"),
    none: t3("— ўз мавзуим —", "— своя тема —", "— my own topic —"),
    team: t3("Жамоа аъзолари (ҳар бир қаторга: исм — рол)", "Участники (по строке: имя — роль)", "Team members (one per line: name — role)"),
    create: t3("Яратиш", "Создать", "Create"),
    cancel: t3("Бекор қилиш", "Отмена", "Cancel"),
    open: t3("Очиш", "Открыть", "Open"),
    back: t3("← Лойиҳалар рўйхати", "← Список проектов", "← Project list"),
    stage: t3("Босқич", "Этап", "Stage"),
    deliver: t3("Натижалар (белгиланг)", "Результаты (отметьте)", "Deliverables (tick)"),
    notes: t3("Қайдлар ва ҳаволалар", "Заметки и ссылки", "Notes and links"),
    canvas: t3("🧩 Канвас", "🧩 Канвас", "🧩 Canvas"),
    board: t3("🗂 Kanban тахтаси", "🗂 Kanban-доска", "🗂 Kanban board"),
    cols: [t3("Қилиш керак", "Сделать", "To do"), t3("Жараёнда", "В работе", "Doing"), t3("Тайёр", "Готово", "Done")],
    addTask: t3("Янги вазифа…", "Новая задача…", "New task…"),
    add: t3("Қўшиш", "Добавить", "Add"),
    self: t3("📊 Ўзини баҳолаш", "📊 Самооценка", "📊 Self-assessment"),
    score: t3("Балл", "Балл", "Score"),
    report: t3("⬇️ Ҳисобот (HTML)", "⬇️ Отчёт (HTML)", "⬇️ Report (HTML)"),
    copy: t3("📋 Нусхалаш", "📋 Копировать", "📋 Copy"),
    del: t3("🗑 Ўчириш", "🗑 Удалить", "🗑 Delete"),
    delQ: t3("Лойиҳа ўчирилсинми? Бу амални қайтариб бўлмайди.", "Удалить проект? Это действие нельзя отменить.", "Delete this project? This cannot be undone."),
    copied: t3("📋 Режа нусхаланди", "📋 План скопирован", "📋 Plan copied"),
    noCopy: t3("Нусхалаб бўлмади", "Не удалось скопировать", "Could not copy"),
    useIdea: t3("Шу ғоя билан бошлаш", "Начать с этой идеи", "Start with this idea"),
    from: t3("Келиб чиқиши", "Происхождение", "Origin"),
    when: t3("Қачон мос", "Когда подходит", "Best for"),
    stagesN: t3("босқич", "этапов", "stages"),
    done: t3("✅ Лойиҳа якунланди! +50 XP", "✅ Проект завершён! +50 XP", "✅ Project complete! +50 XP"),
    local: t3("🔒 Лойиҳалар фақат шу қурилмада сақланади. Жамоа билан бўлишиш учун ҳисоботни юклаб олинг.", "🔒 Проекты хранятся только на этом устройстве. Чтобы поделиться с командой, скачайте отчёт.", "🔒 Projects are stored on this device only. Download the report to share it with your team."),
    rubricLead: t3("Лойиҳани 5 мезон бўйича 4 даражада баҳоланг (халқаро PBL рубрикалари асосида). Ўқитувчи ҳам шу жадвалдан фойдаланиши мумкин.", "Оцените проект по 5 критериям на 4 уровнях (на основе международных PBL-рубрик). Преподаватель может использовать ту же таблицу.", "Rate the project on 5 criteria at 4 levels (based on international PBL rubrics). Teachers can use the same table."),
    sdg: t3("БМТ барқарор ривожланиш мақсадлари", "Цели устойчивого развития ООН", "UN Sustainable Development Goals"),
    open2: t3("Бўлимни очиш ↗", "Открыть раздел ↗", "Open section ↗"),
    whyS: "лойиҳа босқичи",
    whyP: "лойиҳа якунланди"
  };
  const LV = [t3("Бошланғич", "Начальный", "Beginning"), t3("Ривожланаётган", "Развивающийся", "Developing"), t3("Малакали", "Компетентный", "Proficient"), t3("Намунавий", "Образцовый", "Exemplary")];

  /* ===================== Сақлаш ===================== */
  const KEY = "ekotalim:projects";
  let DB = { list: [] };
  try { DB = JSON.parse(localStorage.getItem(KEY)) || DB; } catch (e) { /* ignore */ }
  if (!Array.isArray(DB.list)) DB.list = [];
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* ignore */ } };
  const M = (id) => METHODS.find((m) => m.id === id) || METHODS[0];
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const progress = (p) => {
    const m = M(p.method); let all = 0, ok = 0;
    m.stages.forEach((s, i) => s.o.forEach((_, j) => { all++; if (p.checks[i + "-" + j]) ok++; }));
    return all ? Math.round((ok / all) * 100) : 0;
  };
  const stageDone = (p, i) => M(p.method).stages[i].o.every((_, j) => p.checks[i + "-" + j]);

  /* ===================== Чизиш ===================== */
  let tab = "my", openId = null, creating = null;
  function render() {
    ROOT.innerHTML = `<span class="pill">${H(TX.pill)}</span>
      <h2 class="section-title">${H(TX.title)}</h2>
      <p class="muted">${H(TX.lead)}</p>
      <div class="filters lab-tabs ly-tabs" role="tablist">${TX.tabs.map(([k, t]) => `<button type="button" role="tab" aria-selected="${k === tab}" class="chip ${k === tab ? "active" : ""}" data-tab="${k}">${H(t)}</button>`).join("")}</div>
      <div class="ly-body">${tab === "my" ? (openId ? projectView() : listView()) : tab === "ideas" ? ideasView() : tab === "methods" ? methodsView() : rubricView()}</div>`;
    bind();
  }

  function methodSelect(sel) { return METHODS.map((m) => `<option value="${m.id}" ${m.id === sel ? "selected" : ""}>${m.icon} ${H(m.name)}</option>`).join(""); }
  function listView() {
    const form = creating ? `<form class="lab-card ly-form" data-form>
        <label>${H(TX.name)}<input name="title" required maxlength="120" value="${esc(creating.title || "")}"></label>
        <label>${H(TX.method)}<select name="method">${methodSelect(creating.method || "pbl")}</select></label>
        <label>${H(TX.idea)}<select name="idea"><option value="">${H(TX.none)}</option>${IDEAS.map((i) => `<option value="${i.id}" ${i.id === creating.idea ? "selected" : ""}>${i.icon} ${H(i.t)}</option>`).join("")}</select></label>
        <label>${H(TX.team)}<textarea name="team" rows="3" placeholder="${esc(L(t3("Азиза — Лойиҳа раҳбари", "Азиза — Руководитель проекта", "Aziza — Project lead")))}"></textarea></label>
        <p class="small muted">${ROLES.map((r) => H(r)).join(" · ")}</p>
        <div class="ev-tools"><button class="btn btn-primary btn-sm" type="submit">${H(TX.create)}</button><button class="btn btn-ghost btn-sm" type="button" data-cancel>${H(TX.cancel)}</button></div>
      </form>` : `<button class="btn btn-primary" type="button" data-new>${H(TX.newP)}</button>`;
    const cards = DB.list.length ? `<div class="lab-grid">${DB.list.map((p) => { const m = M(p.method), pr = progress(p); return `<button type="button" class="lab-card ly-card" data-open="${p.id}" style="--c:${m.color}">
        <span class="ly-ic" aria-hidden="true">${m.icon}</span><h3>${esc(p.title)}</h3><p>${H(m.name)}</p>
        <div class="pc-bar" aria-hidden="true"><i style="width:${pr}%"></i></div><p class="small">${pr}% · ${H(TX.stage)} ${Math.min(p.stage + 1, m.stages.length)}/${m.stages.length}</p></button>`; }).join("")}</div>` : `<p class="muted">${H(TX.empty)}</p>`;
    return `${form}${cards}<p class="small muted" style="margin-top:14px">${H(TX.local)}</p>`;
  }

  function projectView() {
    const p = DB.list.find((x) => x.id === openId);
    if (!p) { openId = null; return listView(); }
    const m = M(p.method), s = m.stages[p.stage] || m.stages[0], pr = progress(p);
    const steps = m.stages.map((x, i) => `<button type="button" class="ly-step ${i === p.stage ? "on" : ""} ${stageDone(p, i) ? "ok" : ""}" data-stage="${i}" aria-current="${i === p.stage ? "step" : "false"}"><b>${stageDone(p, i) ? "✓" : i + 1}</b><span>${H(x.t)}</span></button>`).join("");
    const outs = s.o.map((o, j) => `<label class="l3-check"><input type="checkbox" data-chk="${p.stage}-${j}" ${p.checks[p.stage + "-" + j] ? "checked" : ""}> ${H(o)}</label>`).join("");
    const canvas = (m.canvas || []).map(([k, t]) => `<label class="ly-cv"><b>${H(t)}</b><textarea data-cv="${k}" rows="${m.canvas.length > 4 ? 3 : 2}">${esc(p.canvas[k] || "")}</textarea></label>`).join("");
    const cols = [0, 1, 2].map((c) => `<div class="ly-col"><h5>${H(TX.cols[c])} <span>${p.tasks.filter((t) => t.c === c).length}</span></h5>${p.tasks.filter((t) => t.c === c).map((t) => `<div class="ly-task"><span>${esc(t.t)}</span><span class="ly-tbtn">${c > 0 ? `<button type="button" data-mv="${t.id}" data-d="-1" aria-label="←">←</button>` : ""}${c < 2 ? `<button type="button" data-mv="${t.id}" data-d="1" aria-label="→">→</button>` : ""}<button type="button" data-rm="${t.id}" aria-label="✕">✕</button></span></div>`).join("")}</div>`).join("");
    const team = p.team.length ? `<p class="small">👥 ${p.team.map((x) => esc(x)).join(" · ")}</p>` : "";
    const rub = RUBRIC.map(([c, lv], i) => `<tr><th>${H(c)}</th>${lv.map((d, k) => `<td><label class="ly-rb ${p.rubric[i] === k ? "on" : ""}"><input type="radio" name="rb${i}" data-rb="${i}" value="${k}" ${p.rubric[i] === k ? "checked" : ""}><b>${k + 1}</b> ${H(d)}</label></td>`).join("")}</tr>`).join("");
    const sc = Object.values(p.rubric).reduce((a, b) => a + b + 1, 0);
    return `<button class="btn btn-ghost btn-sm" type="button" data-back>${H(TX.back)}</button>
      <div class="ly-head" style="--c:${m.color}"><span class="ly-ic" aria-hidden="true">${m.icon}</span><div><h3>${esc(p.title)}</h3><p class="small muted">${H(m.name)}${p.idea ? " · " + H((IDEAS.find((i) => i.id === p.idea) || {}).t) : ""}</p>${team}</div><b class="ly-pct">${pr}%</b></div>
      <div class="pc-bar" aria-hidden="true"><i style="width:${pr}%"></i></div>
      <div class="ly-steps">${steps}</div>
      <div class="lab-stage ly-stage">
        <h4>${H(TX.stage)} ${p.stage + 1}: ${H(s.t)}</h4><p>${H(s.d)}</p>
        <p class="small"><b>${H(TX.deliver)}</b></p><div class="lab-checks">${outs}</div>
        <label class="ly-cv"><b>${H(TX.notes)}</b><textarea data-note rows="4">${esc(p.notes[p.stage] || "")}</textarea></label>
        ${p.done ? `<p class="lab-out">${H(TX.done)}</p>` : ""}
      </div>
      ${canvas ? `<h4 style="margin-top:22px">${H(TX.canvas)}</h4><div class="ly-canvas ${m.canvas.length > 4 ? "big" : ""}">${canvas}</div>` : ""}
      <h4 style="margin-top:22px">${H(TX.board)}</h4>
      <form class="ev-tools" data-addtask><input name="t" maxlength="140" placeholder="${H(TX.addTask)}" aria-label="${H(TX.addTask)}"><button class="btn btn-primary btn-sm" type="submit">${H(TX.add)}</button></form>
      <div class="ly-board">${cols}</div>
      <h4 style="margin-top:22px">${H(TX.self)} · ${H(TX.score)}: ${sc}/20</h4>
      <div class="ly-rtable"><table class="lab-table ly-rubric">${rub}</table></div>
      <div class="ev-tools" style="margin-top:18px"><button class="btn btn-primary btn-sm" type="button" data-report>${H(TX.report)}</button><button class="btn btn-ghost btn-sm" type="button" data-copy>${H(TX.copy)}</button><button class="btn btn-ghost btn-sm" type="button" data-del>${H(TX.del)}</button></div>`;
  }

  function ideasView() {
    return `<div class="lab-grid">${IDEAS.map((i) => `<article class="lab-card ly-idea"><h3>${i.icon} ${H(i.t)}</h3><p>${H(i.d)}</p>
      <p class="small">🌍 ${i.sdg.map((n) => `<span class="ly-sdg" title="${H(TX.sdg)}">SDG ${n} · ${H(SDG[n])}</span>`).join(" ")}</p>
      <p class="small">🧭 ${i.m.map((id) => `${M(id).icon} ${H(M(id).name)}`).join("<br>")}</p>
      <div class="ev-tools"><button class="btn btn-primary btn-sm" type="button" data-use="${i.id}">${H(TX.useIdea)}</button><a class="btn btn-ghost btn-sm" href="${i.link}">${H(TX.open2)}</a></div></article>`).join("")}</div>`;
  }

  function methodsView() {
    return `<div class="ly-methods">${METHODS.map((m) => `<details class="fin-card ly-m" style="--c:${m.color}"><summary><span class="ly-ic" aria-hidden="true">${m.icon}</span><b>${H(m.name)}</b><small class="muted">${m.stages.length} ${H(TX.stagesN)}</small></summary>
      <p>${H(m.about)}</p><p class="small"><b>${H(TX.from)}:</b> ${H(m.from)}<br><b>${H(TX.when)}:</b> ${H(m.when)}</p>
      <ol class="pbl-steps">${m.stages.map((s) => `<li><div><b>${H(s.t)}</b><br><span class="small">${H(s.d)}</span></div></li>`).join("")}</ol>
      <button class="btn btn-primary btn-sm" type="button" data-usem="${m.id}">${H(TX.newP)}</button></details>`).join("")}</div>`;
  }

  function rubricView() {
    return `<p class="muted">${H(TX.rubricLead)}</p><div class="ly-rtable"><table class="lab-table ly-rubric"><tr><th></th>${LV.map((l, k) => `<th>${k + 1}. ${H(l)}</th>`).join("")}</tr>${RUBRIC.map(([c, lv]) => `<tr><th>${H(c)}</th>${lv.map((d) => `<td>${H(d)}</td>`).join("")}</tr>`).join("")}</table></div>`;
  }

  function planText(p) {
    const m = M(p.method);
    const lines = [`${L(TX.title)}: ${p.title}`, `${L(TX.method)}: ${L(m.name)}`, `${progress(p)}%`];
    if (p.team.length) lines.push("👥 " + p.team.join(", "));
    (m.canvas || []).forEach(([k, t]) => { if (p.canvas[k]) lines.push(`${L(t)}: ${p.canvas[k]}`); });
    m.stages.forEach((s, i) => {
      lines.push(`\n${i + 1}. ${L(s.t)} ${stageDone(p, i) ? "✓" : ""}`);
      s.o.forEach((o, j) => lines.push(`   [${p.checks[i + "-" + j] ? "x" : " "}] ${L(o)}`));
      if (p.notes[i]) lines.push("   " + p.notes[i]);
    });
    if (p.tasks.length) { lines.push("\n" + L(TX.board)); p.tasks.forEach((t) => lines.push(`   ${L(TX.cols[t.c])}: ${t.t}`)); }
    lines.push("\n— ЭкоТаълим");
    return lines.join("\n");
  }
  function reportHtml(p) {
    const m = M(p.method);
    const sc = Object.values(p.rubric).reduce((a, b) => a + b + 1, 0);
    return `<!doctype html><html lang="${EL() ? EL().htmlLang : "uz"}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)}</title>
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:820px;margin:24px auto;padding:0 16px;color:#0b1f17}h1{color:#047857;margin-bottom:4px}h2{color:#047857;border-bottom:2px solid #d1fae5;padding-bottom:4px;margin-top:28px}.m{color:#4a5f56}table{border-collapse:collapse;width:100%}td,th{border:1px solid #d5e6dd;padding:6px 8px;text-align:left;vertical-align:top}.ok{color:#047857}.cv{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}.cv div{border:1px solid #d5e6dd;border-radius:10px;padding:10px}pre{white-space:pre-wrap;font:inherit}</style>
<h1>${esc(p.title)}</h1><p class="m">${H(m.name)} · ${progress(p)}%${p.team.length ? "<br>👥 " + p.team.map(esc).join(", ") : ""}</p>
${(m.canvas || []).length ? `<h2>${H(TX.canvas)}</h2><div class="cv">${m.canvas.map(([k, t]) => `<div><b>${H(t)}</b><pre>${esc(p.canvas[k] || "—")}</pre></div>`).join("")}</div>` : ""}
<h2>${H(TX.stage)}</h2>${m.stages.map((s, i) => `<h3 class="${stageDone(p, i) ? "ok" : ""}">${i + 1}. ${H(s.t)} ${stageDone(p, i) ? "✓" : ""}</h3><ul>${s.o.map((o, j) => `<li>${p.checks[i + "-" + j] ? "☑" : "☐"} ${H(o)}</li>`).join("")}</ul>${p.notes[i] ? `<pre>${esc(p.notes[i])}</pre>` : ""}`).join("")}
${p.tasks.length ? `<h2>${H(TX.board)}</h2><table>${[0, 1, 2].map((c) => `<tr><th>${H(TX.cols[c])}</th><td>${p.tasks.filter((t) => t.c === c).map((t) => esc(t.t)).join("<br>") || "—"}</td></tr>`).join("")}</table>` : ""}
<h2>${H(TX.self)} · ${sc}/20</h2><table>${RUBRIC.map(([c, lv], i) => `<tr><th>${H(c)}</th><td>${p.rubric[i] != null ? `${p.rubric[i] + 1}. ${H(LV[p.rubric[i]])} — ${H(lv[p.rubric[i]])}` : "—"}</td></tr>`).join("")}</table>
<p class="m" style="margin-top:28px">ЭкоТаълим · ${new Date().toISOString().slice(0, 10)}</p></html>`;
  }

  function create(title, method, idea, teamText) {
    const p = { id: uid(), title: title.trim() || L(t3("Янги лойиҳа", "Новый проект", "New project")), method, idea: idea || "", team: teamText.split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 12), stage: 0, checks: {}, notes: {}, canvas: {}, tasks: [], rubric: {}, created: Date.now() };
    DB.list.unshift(p); save(); openId = p.id; creating = null; tab = "my";
  }
  function check(p) {
    const m = M(p.method);
    m.stages.forEach((_, i) => { if (stageDone(p, i)) xpOnce(`ly_${p.id}_${i}`, 15, TX.whyS); });
    if (!p.done && m.stages.every((_, i) => stageDone(p, i))) { p.done = true; save(); xpOnce(`ly_${p.id}_done`, 50, TX.whyP); }
  }

  function bind() {
    const $ = (s) => ROOT.querySelector(s), $$ = (s) => ROOT.querySelectorAll(s);
    $$("[data-tab]").forEach((b) => b.addEventListener("click", () => { tab = b.dataset.tab; render(); }));
    const nb = $("[data-new]"); if (nb) nb.addEventListener("click", () => { creating = {}; render(); const i = ROOT.querySelector("[data-form] input"); if (i) i.focus(); });
    const cn = $("[data-cancel]"); if (cn) cn.addEventListener("click", () => { creating = null; render(); });
    const f = $("[data-form]");
    if (f) {
      f.idea.addEventListener("change", () => { const i = IDEAS.find((x) => x.id === f.idea.value); if (i) { if (!f.title.value) f.title.value = L(i.t); f.method.value = i.m[0]; } });
      f.addEventListener("submit", (e) => { e.preventDefault(); create(f.title.value, f.method.value, f.idea.value, f.team.value); render(); window.scrollTo({ top: SEC.offsetTop - 60 }); });
    }
    $$("[data-open]").forEach((b) => b.addEventListener("click", () => { openId = b.dataset.open; render(); }));
    $$("[data-use]").forEach((b) => b.addEventListener("click", () => { const i = IDEAS.find((x) => x.id === b.dataset.use); creating = { title: L(i.t), method: i.m[0], idea: i.id }; tab = "my"; openId = null; render(); }));
    $$("[data-usem]").forEach((b) => b.addEventListener("click", () => { creating = { method: b.dataset.usem }; tab = "my"; openId = null; render(); }));
    const p = DB.list.find((x) => x.id === openId);
    if (!p || tab !== "my") return;
    const bk = $("[data-back]"); if (bk) bk.addEventListener("click", () => { openId = null; render(); });
    $$("[data-stage]").forEach((b) => b.addEventListener("click", () => { p.stage = +b.dataset.stage; save(); render(); }));
    $$("[data-chk]").forEach((c) => c.addEventListener("change", () => {
      p.checks[c.dataset.chk] = c.checked; save(); check(p);
      const i = p.stage;
      if (c.checked && stageDone(p, i) && i < M(p.method).stages.length - 1) { p.stage = i + 1; save(); }
      render();
    }));
    const note = $("[data-note]"); if (note) note.addEventListener("input", () => { p.notes[p.stage] = note.value; save(); });
    $$("[data-cv]").forEach((t) => t.addEventListener("input", () => { p.canvas[t.dataset.cv] = t.value; save(); }));
    const at = $("[data-addtask]"); if (at) at.addEventListener("submit", (e) => { e.preventDefault(); const v = at.t.value.trim(); if (!v) return; p.tasks.push({ id: uid(), t: v, c: 0 }); save(); render(); const i = ROOT.querySelector("[data-addtask] input"); if (i) i.focus(); });
    $$("[data-mv]").forEach((b) => b.addEventListener("click", () => { const t = p.tasks.find((x) => x.id === b.dataset.mv); if (t) { t.c = Math.max(0, Math.min(2, t.c + +b.dataset.d)); save(); render(); } }));
    $$("[data-rm]").forEach((b) => b.addEventListener("click", () => { p.tasks = p.tasks.filter((x) => x.id !== b.dataset.rm); save(); render(); }));
    $$("[data-rb]").forEach((r) => r.addEventListener("change", () => { p.rubric[r.dataset.rb] = +r.value; save(); render(); }));
    $("[data-report]").addEventListener("click", () => {
      const blob = new Blob([reportHtml(p)], { type: "text/html" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = (p.title.replace(/[\\/:*?"<>|]+/g, " ").trim() || "loyiha") + ".html";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    });
    $("[data-copy]").addEventListener("click", async () => { try { await navigator.clipboard.writeText(planText(p)); toast(TX.copied); } catch (e) { toast(TX.noCopy); } });
    $("[data-del]").addEventListener("click", () => { if (confirm(L(TX.delQ))) { DB.list = DB.list.filter((x) => x.id !== p.id); save(); openId = null; render(); } });
  }

  window.addEventListener("eko:lang", render);
  render();
})();
