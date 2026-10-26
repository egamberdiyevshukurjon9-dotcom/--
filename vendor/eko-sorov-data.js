/* Экомун — «Сўровнома» саволлари (Tally услубида: битта экранда битта савол).
   Сайт (vendor/eko-sorov.js) ва Бошқарув маркази (admin/startap.js) шу файлни ишлатади.
   Саволни ўзгартирсангиз, id ни ҳам янгиланг (2026-1 → 2026-2): эски жавоблар аралашмайди.
   Турлари: one — битта танлов, many — бир нечта (max гача), scale — 0…10 шкала, text — эркин матн (ихтиёрий).
   kid:false — мактаб босқичидаги болаларга берилмайди (тўлов ва нарх саволлари). */
window.EKO_SOROV = {
  id: "2026-1",
  title: { uz: "Ekomun ҳақида 2 дақиқалик сўровнома", ru: "Опрос об Ekomun на 2 минуты", en: "A 2-minute survey about Ekomun" },
  questions: [
    { id: "role", type: "one", q: { uz: "Ekomun'дан ким сифатида фойдаланасиз?", ru: "Кем вы пользуетесь Ekomun?", en: "How do you use Ekomun?" },
      opts: [
        ["pupil", { uz: "Мактаб ўқувчиси", ru: "Школьник", en: "School pupil" }],
        ["student", { uz: "Талаба (ОТМ, коллеж)", ru: "Студент", en: "University / college student" }],
        ["teacher", { uz: "Ўқитувчи / домла", ru: "Учитель / преподаватель", en: "Teacher / lecturer" }],
        ["parent", { uz: "Ота-она", ru: "Родитель", en: "Parent" }],
        ["pro", { uz: "Эколог, мутахассис, корхона", ru: "Эколог, специалист, предприятие", en: "Ecologist, specialist, company" }],
        ["other", { uz: "Бошқа", ru: "Другое", en: "Other" }]
      ] },
    { id: "source", type: "one", q: { uz: "Ekomun ҳақида қаердан билдингиз?", ru: "Откуда вы узнали об Ekomun?", en: "Where did you hear about Ekomun?" },
      opts: [
        ["teacher", { uz: "Ўқитувчи ёки мактаб / ОТМ", ru: "Учитель, школа или вуз", en: "Teacher, school or university" }],
        ["telegram", { uz: "Telegram", ru: "Telegram", en: "Telegram" }],
        ["instagram", { uz: "Instagram / TikTok", ru: "Instagram / TikTok", en: "Instagram / TikTok" }],
        ["friend", { uz: "Дўстим айтди", ru: "От друзей", en: "A friend" }],
        ["search", { uz: "Google / Яндекс қидирув", ru: "Поиск Google / Яндекс", en: "Google / Yandex search" }],
        ["event", { uz: "Танлов, тадбир, кўргазма", ru: "Конкурс, мероприятие", en: "Contest or event" }],
        ["other", { uz: "Бошқа", ru: "Другое", en: "Other" }]
      ] },
    { id: "useful", type: "many", max: 3, q: { uz: "Энг фойдали бўлимлар қайсилар? (3 тагача)", ru: "Самые полезные разделы? (до 3)", en: "Most useful sections? (up to 3)" },
      opts: [
        ["kurslar", { uz: "Курслар ва дарслар", ru: "Курсы и уроки", en: "Courses and lessons" }],
        ["lab", { uz: "Лабораториялар (3D, лаб хонаси)", ru: "Лаборатории (3D, лаб. комната)", en: "Labs (3D, lab room)" }],
        ["oyin", { uz: "Ўйинлар ва кроссвордлар", ru: "Игры и кроссворды", en: "Games and crosswords" }],
        ["video", { uz: "Видео дарслар", ru: "Видеоуроки", en: "Video lessons" }],
        ["qonun", { uz: "Экологик ҳуқуқ ва қонунлар", ru: "Экологическое право", en: "Environmental law" }],
        ["sertifikat", { uz: "Тест ва сертификат", ru: "Тесты и сертификат", en: "Tests and certificate" }],
        ["ai", { uz: "AI ёрдамчи ва Эко-кўз", ru: "AI-помощник и Эко-глаз", en: "AI assistant and Eco-eye" }],
        ["xarita", { uz: "Эко-харита ва ҳашар", ru: "Эко-карта и хашар", en: "Eco-map and clean-ups" }],
        ["ustoz", { uz: "Ўқитувчи устахонаси", ru: "Мастерская учителя", en: "Teacher workshop" }]
      ] },
    { id: "nps", type: "scale", min: 0, max: 10, q: { uz: "Ekomun'ни дўстингиз ёки ҳамкасбингизга тавсия қилиш эҳтимоли қанча?", ru: "Насколько вероятно, что вы порекомендуете Ekomun другу или коллеге?", en: "How likely are you to recommend Ekomun to a friend or colleague?" },
      lo: { uz: "Ҳеч қачон", ru: "Ни за что", en: "Not at all" }, hi: { uz: "Албатта", ru: "Обязательно", en: "Definitely" } },
    { id: "pmf", type: "one", q: { uz: "Эртадан Ekomun ёпилса, қанчалик хафа бўласиз?", ru: "Если Ekomun завтра закроется, насколько вы расстроитесь?", en: "How would you feel if you could no longer use Ekomun?" },
      opts: [
        ["very", { uz: "Жуда хафа бўламан", ru: "Очень расстроюсь", en: "Very disappointed" }],
        ["some", { uz: "Бироз хафа бўламан", ru: "Немного расстроюсь", en: "Somewhat disappointed" }],
        ["not", { uz: "Хафа бўлмайман", ru: "Не расстроюсь", en: "Not disappointed" }]
      ] },
    { id: "alt", type: "one", q: { uz: "Ekomun бўлмаса, экологияни қаердан ўрганардингиз?", ru: "Где бы вы изучали экологию без Ekomun?", en: "Without Ekomun, where would you learn ecology?" },
      opts: [
        ["book", { uz: "Дарслик ва китоблар", ru: "Учебники и книги", en: "Textbooks" }],
        ["youtube", { uz: "YouTube ва ижтимоий тармоқлар", ru: "YouTube и соцсети", en: "YouTube and social media" }],
        ["other_app", { uz: "Бошқа илова ёки сайт", ru: "Другое приложение или сайт", en: "Another app or site" }],
        ["teacher", { uz: "Фақат дарсда, ўқитувчидан", ru: "Только на уроке", en: "Only in class" }],
        ["none", { uz: "Умуман ўрганмасдим", ru: "Вообще бы не изучал(а)", en: "I wouldn’t learn it at all" }]
      ] },
    { id: "pay", type: "one", kid: false, q: { uz: "Ekomun PRO (шахсий AI агент, чексиз тестлар, PDF) учун ойига қанча тўлашга тайёрсиз?", ru: "Сколько вы готовы платить в месяц за Ekomun PRO?", en: "How much would you pay per month for Ekomun PRO?" },
      opts: [
        ["0", { uz: "Тўламайман, бепул етарли", ru: "Не буду платить", en: "Nothing, free is enough" }],
        ["10", { uz: "10 000 сўмгача", ru: "До 10 000 сумов", en: "Up to 10,000 UZS" }],
        ["25", { uz: "25 000 сўм (ҳозирги нарх)", ru: "25 000 сумов (текущая цена)", en: "25,000 UZS (current price)" }],
        ["50", { uz: "50 000 сўм ва ундан кўп", ru: "50 000 сумов и больше", en: "50,000 UZS or more" }],
        ["org", { uz: "Мактаб / ОТМ / иш жойим тўласин", ru: "Пусть платит школа / вуз / работодатель", en: "My school / employer should pay" }]
      ] },
    { id: "b2b", type: "one", kid: false, q: { uz: "Мактабингиз ёки ташкилотингиз Ekomun'ни расман ишлатишини хоҳлайсизми?", ru: "Хотели бы вы, чтобы ваша школа или организация официально использовала Ekomun?", en: "Would you like your school or organisation to use Ekomun officially?" },
      opts: [
        ["yes", { uz: "Ҳа, раҳбариятга таклиф қилардим", ru: "Да, предложил(а) бы руководству", en: "Yes, I’d suggest it to management" }],
        ["maybe", { uz: "Балки, кўпроқ маълумот керак", ru: "Возможно, нужна информация", en: "Maybe, I need more information" }],
        ["no", { uz: "Йўқ", ru: "Нет", en: "No" }]
      ] },
    { id: "missing", type: "text", q: { uz: "Ekomun'да нима етишмаяпти ёки нимани яхшилаш керак?", ru: "Чего не хватает в Ekomun или что улучшить?", en: "What is missing in Ekomun or should be improved?" },
      ph: { uz: "Масалан: ўзбек тилидаги видео кўпроқ бўлсин…", ru: "Например: больше видео на узбекском…", en: "E.g. more videos in Uzbek…" } }
  ]
};
