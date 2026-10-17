/* Экомун — ⭐ PRO обуна ва 🤖 шахсий AI агент.
   • #pro: тарифлар (даромад режасидаги нархлар), тўлов (Payme, Click, қўлда тасдиқлаш, синов режими),
     буюртмалар тарихи, ташкилотлар учун ариза. Тўлов фақат 18 ёшдан катталарга кўрсатилади;
     13–17 ёшлиларга фақат «ота-онангиз совға қилиши мумкин» деган изоҳ, 13 ёшгача — PRO ҳақида ҳеч нарса.
   • Android илова ичида (User-Agent «EkomunApp/» ёки оффлайн нусха) нарх, тўлов тугмаси ва ташқи ҳавола
     йўқ (Google Play қоидаси): PRO фақат сайтда сотиб олинган бўлса, иловада ўзи очилади.
   • #agent: PRO фойдаланувчининг шахсий AI агенти. Босқичга мос (мактаб — «Эко-устоз», университет —
     илмий маслаҳатчи). Суҳбат фақат шу қурилмада сақланади (localStorage «ekotalim:agent:<id>»). */
(() => {
  "use strict";
  const PRO_SEC = document.getElementById("pro");
  const AG_SEC = document.getElementById("agent");
  const PRO_ROOT = document.getElementById("proRoot");
  const AG_ROOT = document.getElementById("agRoot");
  if (!PRO_ROOT || !AG_ROOT) return;
  const root = document.documentElement;

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
  const App = () => window.EkoApp;
  const toast = (o) => { const a = App(); if (a && a.toast) a.toast(typeof o === "string" ? o : L(o)); };
  const hasServer = () => /^https?:$/.test(location.protocol) && location.hostname !== "appassets.androidplatform.net";
  const inApp = () => /EkomunApp\//.test(navigator.userAgent) || !!window.EkoAndroid || !hasServer();
  const nf = (n) => Number(n || 0).toLocaleString("ru-RU").replace(/,/g, " ");
  const fmtDate = (t) => (t ? new Date(t).toLocaleDateString(lang() === "en" ? "en-GB" : "ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—");
  const devAge = () => (window.EkoProfile && EkoProfile.profile ? EkoProfile.age : 0);
  const stage = () => (root.classList.contains("stage-maktab") ? "maktab" : "uni");
  async function api(path, body) {
    const r = await fetch(path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body) } : { credentials: "same-origin" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || "HTTP " + r.status); e.status = r.status; throw e; }
    return d;
  }

  const TX = {
    pill: t3("⭐ Ekomun PRO", "⭐ Ekomun PRO", "⭐ Ekomun PRO"),
    title: t3("PRO: шахсий агент ва VIP имкониятлар", "PRO: личный агент и VIP-возможности", "PRO: a personal agent and VIP features"),
    lead: t3("Таълим доим бепул қолади. PRO — платформадан янада кенгайтирилган фойдаланиш учун: ҳар бир босқичда сизга шахсий AI агент ва VIP имкониятлар.",
      "Обучение всегда остаётся бесплатным. PRO — для расширенного использования платформы: личный AI-агент и VIP-возможности на каждом этапе.",
      "Learning always stays free. PRO is for extended use of the platform: a personal AI agent and VIP features at every stage."),
    perks: [
      ["🤖", t3("Шахсий AI агент", "Личный AI-агент", "Personal AI agent"), t3("Босқичингизга мос: мактабда «Эко-устоз», университетда илмий маслаҳатчи. Ўқув режа, тушунтириш, тест, лойиҳа.", "Под ваш этап: в школе «Эко-наставник», в вузе научный консультант. План обучения, объяснения, тесты, проекты.", "Matched to your stage: an “Eco tutor” at school, a science adviser at university. Study plans, explanations, quizzes, projects.")],
      ["📷", t3("Эко-кўз 3 баробар кўп", "Эко-глаз в 3 раза больше", "3× more Eco-eye"), t3("Кунига кўпроқ расмни AI билан таҳлил қилиш ва мурожаат матни тузиш.", "Больше фото в день для AI-анализа и составления обращений.", "More photos per day for AI analysis and complaint letters.")],
      ["🧭", t3("Шахсий ўқув режа", "Личный план обучения", "Personal study plan"), t3("Агент натижаларингизга қараб ҳафталик режа ва такрорлаш жадвалини тузади.", "Агент составит недельный план и график повторения.", "The agent builds a weekly plan and a review schedule.")],
      ["👑", t3("PRO нишони ва олтин мавзу", "Значок PRO и золотая тема", "PRO badge and gold theme"), t3("Профилда PRO белгиси, иловада махсус олтин безак.", "Значок PRO в профиле и особое золотое оформление.", "A PRO mark on your profile and a special gold look.")],
      ["⚡", t3("Устувор ёрдам", "Приоритетная поддержка", "Priority support"), t3("Фикр-мулоҳазангиз бошқарув марказида биринчи кўриб чиқилади.", "Ваши отзывы рассматриваются первыми.", "Your feedback is reviewed first.")]
    ],
    active: t3("PRO фаол", "PRO активен", "PRO is active"),
    until: t3("Муддати", "Действует до", "Valid until"),
    daysLeft: t3("кун қолди", "дн. осталось", "days left"),
    expSoon: t3("Муддат тугашига оз қолди — узайтиришни унутманг.", "Срок скоро закончится — не забудьте продлить.", "It ends soon — don't forget to renew."),
    openAgent: t3("🤖 Агентни очиш", "🤖 Открыть агента", "🤖 Open the agent"),
    plans: t3("Тарифлар", "Тарифы", "Plans"),
    month: t3("ой", "мес", "month"), year: t3("йил", "год", "year"),
    som: t3("сўм", "сум", "UZS"),
    save: t3("≈34 % арзон", "≈34 % выгоднее", "≈34% cheaper"),
    forWhom: t3("Кимга", "Для кого", "For whom"),
    forMe: t3("Ўзимга", "Себе", "For me"),
    forGift: t3("Фарзанд ёки ўқувчига совға", "В подарок ребёнку или ученику", "Gift to a child or student"),
    giftPh: t3("Унинг почтаси ёки телефони (ҳисоби 13+ ёшда очилган бўлсин)", "Его почта или телефон (аккаунт с 13 лет)", "Their email or phone (account opened at 13+)"),
    pay: t3("Тўлов усули", "Способ оплаты", "Payment method"),
    payme: t3("Payme орқали тўлаш", "Оплатить через Payme", "Pay with Payme"),
    click: t3("Click орқали тўлаш", "Оплатить через Click", "Pay with Click"),
    manual: t3("Карта орқали (чек юбориш)", "Переводом на карту (отправить чек)", "Card transfer (send receipt)"),
    test: t3("🧪 Синов тўлови (sandbox)", "🧪 Тестовый платёж (sandbox)", "🧪 Test payment (sandbox)"),
    soon: t3("Онлайн тўлов тез орада уланади. Ҳозирча PRO ни ташкилотингиз орқали ёки бизга ёзиб олишингиз мумкин.", "Онлайн-оплата скоро подключится. Пока PRO можно получить через организацию или написав нам.", "Online payment is coming soon. For now, get PRO through your organisation or by writing to us."),
    login: t3("PRO ни расмийлаштириш учун ҳисобингизга киринг (18 ёшдан катталар).", "Чтобы оформить PRO, войдите в аккаунт (18+).", "Sign in to get PRO (18+)."),
    loginBtn: t3("Кириш / Рўйхатдан ўтиш", "Войти / Регистрация", "Sign in / Register"),
    teen: t3("PRO ни ота-онангиз ёки ўқитувчингиз ўз ҳисобидан сизнинг почта ёки телефонингизни кўрсатиб совға қилиши мумкин.", "Родители или учитель могут подарить вам PRO, указав вашу почту или телефон.", "A parent or teacher can gift you PRO by entering your email or phone."),
    history: t3("Тўловлар тарихи", "История платежей", "Payment history"),
    noOrders: t3("Ҳали тўлов йўқ.", "Платежей пока нет.", "No payments yet."),
    st: { new: t3("Тўлов кутилмоқда", "Ожидает оплаты", "Awaiting payment"), paid: t3("Тўланди ✓", "Оплачено ✓", "Paid ✓"), review: t3("Текширилмоқда", "На проверке", "Under review"),
      rejected: t3("Рад этилди", "Отклонено", "Rejected"), cancelled: t3("Бекор қилинди", "Отменено", "Cancelled"), refunded: t3("Қайтарилди", "Возвращено", "Refunded") },
    prov: { payme: "Payme", click: "Click", manual: t3("Карта", "Карта", "Card"), test: t3("Синов", "Тест", "Test"), admin: t3("Админ", "Админ", "Admin") },
    cancel: t3("Бекор қилиш", "Отменить", "Cancel"),
    sendReceipt: t3("Чекни юбориш", "Отправить чек", "Send receipt"),
    manualHow: t3("Қуйидаги ҳисобга аниқ суммани ўтказинг, кейин чек рақами ёки тўлов вақтини юборинг. Админ текшириб, PRO ни улайди.", "Переведите точную сумму на счёт ниже и отправьте номер чека или время платежа. Админ проверит и подключит PRO.", "Transfer the exact amount to the account below, then send the receipt number or payment time. An admin will check and enable PRO."),
    order: t3("Буюртма", "Заказ", "Order"),
    amount: t3("Сумма", "Сумма", "Amount"),
    ref: t3("Чек рақами ёки тўлов вақти", "Номер чека или время платежа", "Receipt number or payment time"),
    method: t3("Қаердан тўладингиз (Payme, Click, Uzum, банк…)", "Откуда оплатили (Payme, Click, Uzum, банк…)", "Paid from (Payme, Click, Uzum, bank…)"),
    note: t3("Изоҳ (ихтиёрий)", "Комментарий (необязательно)", "Note (optional)"),
    photo: t3("Чек расми (ихтиёрий, 1,5 МБ гача)", "Фото чека (необязательно, до 1,5 МБ)", "Receipt photo (optional, up to 1.5 MB)"),
    sent: t3("Чек юборилди. Админ текширгач PRO уланади.", "Чек отправлен. После проверки PRO подключится.", "Receipt sent. PRO turns on once an admin checks it."),
    redirect: t3("Тўлов саҳифаси очилмоқда…", "Открывается страница оплаты…", "Opening the payment page…"),
    waiting: t3("Тўлов тасдиқланишини кутяпмиз…", "Ждём подтверждения оплаты…", "Waiting for payment confirmation…"),
    gotPro: t3("🎉 PRO уланди! Шахсий агентингиз тайёр.", "🎉 PRO подключён! Ваш личный агент готов.", "🎉 PRO is on! Your personal agent is ready."),
    gold: t3("Олтин мавзу", "Золотая тема", "Gold theme"),
    org: t3("Мактаб, ОТМ ва корхоналар учун", "Для школ, вузов и предприятий", "For schools, universities and companies"),
    orgLead: t3("Ташкилотлар шартнома ва банк ўтказмаси орқали тўлайди. Барча ўқувчи ва ходимлар учун PRO, ҳисобот ва сертификатлар. Янги мактаб ва ОТМ учун 3 ой бепул синов.", "Организации платят по договору банковским переводом. PRO для всех учеников и сотрудников, отчёты и сертификаты. Для новых школ и вузов — 3 месяца бесплатно.", "Organisations pay by contract and bank transfer. PRO for all students and staff, reports and certificates. New schools and universities get 3 months free."),
    orgSend: t3("Ариза юбориш", "Отправить заявку", "Send request"),
    orgName: t3("Ташкилот номи", "Название организации", "Organisation name"),
    orgWho: t3("Масъул шахс", "Контактное лицо", "Contact person"),
    orgContact: t3("Телефон ёки почта", "Телефон или почта", "Phone or email"),
    orgCount: t3("Ўқувчи/ходимлар сони", "Число учеников/сотрудников", "Number of students/staff"),
    orgOk: t3("Ариза қабул қилинди. Тез орада боғланамиз.", "Заявка принята. Мы скоро свяжемся.", "Request received. We'll be in touch soon."),
    per: { "йил": t3("йил", "год", "year"), "мактаб/йил": t3("мактаб/йил", "школа/год", "school/year"), "ходим": t3("ходим", "сотрудник", "employee") },
    orgNames: { maktab: t3("Мактаб", "Школа", "School"), tuman: t3("Туман (20+ мактаб)", "Район (20+ школ)", "District (20+ schools)"), kafedra: t3("ОТМ кафедраси", "Кафедра вуза", "University department"), otm: t3("Университет (ОТМ)", "Университет", "University"), korxona: t3("Корхона курси", "Курс для предприятия", "Company course") },
    offline: t3("PRO ҳолатини кўриш учун интернетга уланинг.", "Подключитесь к интернету, чтобы увидеть статус PRO.", "Connect to the internet to see your PRO status."),
    appNoPro: t3("PRO ҳисобингизда фаол эмас.", "PRO в вашем аккаунте не активен.", "PRO isn't active on your account."),
    sandbox: t3("🧪 Синов режими: тўловлар ҳақиқий эмас.", "🧪 Тестовый режим: платежи ненастоящие.", "🧪 Test mode: payments are not real."),
    terms: t3("Обуна ўзи янгиланмайди: муддат тугагач, хоҳласангиз қайта тўлайсиз. Тўлов Payme/Click ҳимояланган саҳифасида амалга оширилади, карта маълумотлари бизга келмайди.", "Подписка не продлевается автоматически. Оплата проходит на защищённой странице Payme/Click, данные карты к нам не попадают.", "The subscription doesn't auto-renew. Payment happens on the secure Payme/Click page; card data never reaches us.")
  };
  const AG = {
    pill: t3("🤖 Шахсий агент · PRO", "🤖 Личный агент · PRO", "🤖 Personal agent · PRO"),
    titleK: t3("Эко-устоз: шахсий ёрдамчингиз", "Эко-наставник: ваш помощник", "Eco tutor: your helper"),
    titleU: t3("Шахсий AI агент", "Личный AI-агент", "Personal AI agent"),
    leadK: t3("Табиат ва экология ҳақида сўранг: тушунтириб беради, топишмоқ ва кичик тест тузади, уй вазифасини ўзингиз бажаришингизга ёрдам беради.", "Спрашивайте о природе и экологии: объяснит, загадает загадку, составит мини-тест и поможет сделать домашнее задание самому.", "Ask about nature and ecology: it explains, makes riddles and mini-quizzes, and helps you do homework yourself."),
    leadU: t3("Экология, экологик ҳуқуқ, чиқиндилар, сув, ҳаво ва иқлим бўйича илмий маслаҳатчи: ўқув режа, тест, курс иши ва лойиҳа режаси.", "Научный консультант по экологии, экоправу, отходам, воде, воздуху и климату: план обучения, тесты, курсовая и проект.", "A science adviser on ecology, environmental law, waste, water, air and climate: study plans, quizzes, coursework and project plans."),
    ph: t3("Саволингизни ёзинг…", "Напишите вопрос…", "Type your question…"),
    send: t3("Юбориш", "Отправить", "Send"),
    clear: t3("Суҳбатни тозалаш", "Очистить чат", "Clear chat"),
    used: t3("Бу ойда", "В этом месяце", "This month"),
    think: t3("Ўйлаяпман…", "Думаю…", "Thinking…"),
    needPro: t3("Шахсий агент PRO обунада ишлайди.", "Личный агент работает в подписке PRO.", "The personal agent comes with PRO."),
    seePro: t3("⭐ PRO ҳақида", "⭐ О PRO", "⭐ About PRO"),
    needLogin: t3("Агентдан фойдаланиш учун ҳисобингизга киринг.", "Войдите в аккаунт, чтобы пользоваться агентом.", "Sign in to use the agent."),
    notReady: t3("AI ҳали созланмаган (админ ANTHROPIC_API_KEY ни қўшиши керак).", "AI ещё не настроен (админ должен добавить ANTHROPIC_API_KEY).", "AI isn't configured yet (the admin must add ANTHROPIC_API_KEY)."),
    privacy: t3("Суҳбат фақат шу қурилмада сақланади. Шахсий маълумот (тўлиқ исм, манзил, телефон) ёзманг. AI хато қилиши мумкин — муҳим фактларни текширинг.", "Чат хранится только на этом устройстве. Не пишите личные данные (полное имя, адрес, телефон). AI может ошибаться — проверяйте важные факты.", "The chat is stored only on this device. Don't share personal data (full name, address, phone). AI can make mistakes — check key facts."),
    qK: [t3("Нега дарахтлар муҳим?", "Почему деревья важны?", "Why are trees important?"), t3("Чиқиндини қандай саралайман?", "Как сортировать мусор?", "How do I sort waste?"), t3("Сув ҳақида 5 та саволли тест туз", "Составь тест из 5 вопросов о воде", "Make a 5-question quiz about water"), t3("Менга экологик топишмоқ айт", "Загадай экологическую загадку", "Tell me an eco riddle")],
    qU: [t3("Менга 4 ҳафталик экология ўқув режасини туз", "Составь мне 4-недельный план изучения экологии", "Make me a 4-week ecology study plan"), t3("ПДК ва ЧММ фарқини тушунтир", "Объясни разницу ПДК и ПДВ", "Explain MPC vs. emission limits"), t3("«Чиқиндилар тўғрисида»ги қонуннинг асосий талаблари", "Основные требования закона «Об отходах»", "Key requirements of the Waste law"), t3("Курс иши мавзуси ва режасини таклиф қил", "Предложи тему и план курсовой", "Suggest a coursework topic and outline")]
  };

  let info = null, busy = false, pollT = null;
  const proOn = () => !!(info && info.me && info.me.pro && info.me.pro.active);

  /* Илдиз класслари: илова, PRO, 13 ёшгача — CSS PRO плиткаларини шунга қараб яширади */
  function flags() {
    root.classList.toggle("eko-app", inApp());
    root.classList.toggle("is-pro", proOn());
    const age = info && info.me ? info.me.age : devAge();
    root.classList.toggle("pro-kid", !proOn() && age > 0 && age < 13);
    root.classList.toggle("pro-teen", !proOn() && age >= 13 && age < 18);
    let gold = false; try { gold = localStorage.getItem("ekotalim:gold") === "1"; } catch (e) { /* ignore */ }
    root.classList.toggle("pro-gold", proOn() && gold);
  }

  async function load() {
    if (!hasServer()) { info = null; flags(); renderPro(); renderAgent(); return; }
    try { info = await api("/api/pro"); } catch (e) { info = null; }
    flags(); renderPro(); renderAgent();
  }

  function perksHtml() {
    return `<div class="pr-perks">${TX.perks.map(([i, t, d]) => `<div class="pr-perk"><span aria-hidden="true">${i}</span><div><b>${H(t)}</b><small>${H(d)}</small></div></div>`).join("")}</div>`;
  }
  function statusHtml() {
    const p = info.me.pro, left = Math.max(0, Math.ceil((p.until - Date.now()) / 864e5));
    let gold = false; try { gold = localStorage.getItem("ekotalim:gold") === "1"; } catch (e) { /* ignore */ }
    return `<div class="pr-status"><div class="pr-crown" aria-hidden="true">👑</div><div><b>${H(TX.active)}</b>
      <div class="small">${H(TX.until)}: ${fmtDate(p.until)} · ${left} ${H(TX.daysLeft)}</div>${left <= 5 ? `<div class="small pr-warn">${H(TX.expSoon)}</div>` : ""}</div>
      <div class="pr-acts"><a class="btn btn-primary btn-sm" href="#agent">${H(TX.openAgent)}</a><label class="small pr-gold"><input type="checkbox" data-gold ${gold ? "checked" : ""}> ✨ ${H(TX.gold)}</label></div></div>`;
  }
  function plansHtml() {
    const pv = info.providers || {}, any = pv.payme || pv.click || pv.manual || pv.test;
    const plans = info.plans || [];
    return `<h3>${H(TX.plans)}</h3>
      <form class="pr-buy" data-buy>
        <div class="pr-plans">${plans.map((p, i) => `<label class="pr-plan"><input type="radio" name="plan" value="${esc(p.id)}" ${i === 0 ? "checked" : ""}>
          <span><b>${nf(p.price)} ${H(TX.som)}</b><small>/ ${p.days >= 365 ? H(TX.year) : H(TX.month)}</small>${p.days >= 365 ? `<em>${H(TX.save)}</em>` : ""}</span></label>`).join("")}</div>
        <fieldset class="pr-who"><legend class="small">${H(TX.forWhom)}</legend>
          <label><input type="radio" name="who" value="me" checked> ${H(TX.forMe)}</label>
          <label><input type="radio" name="who" value="gift"> 🎁 ${H(TX.forGift)}</label>
          <input type="text" name="gift" maxlength="120" placeholder="${H(TX.giftPh)}" hidden autocomplete="off">
        </fieldset>
        ${any ? `<div class="pr-pay"><span class="small muted">${H(TX.pay)}:</span>
          ${pv.payme ? `<button class="btn btn-primary pr-payme" type="submit" value="payme">${H(TX.payme)}</button>` : ""}
          ${pv.click ? `<button class="btn btn-primary pr-click" type="submit" value="click">${H(TX.click)}</button>` : ""}
          ${pv.manual ? `<button class="btn btn-ghost" type="submit" value="manual">💳 ${H(TX.manual)}</button>` : ""}
          ${pv.test ? `<button class="btn btn-ghost" type="submit" value="test">${H(TX.test)}</button>` : ""}</div>` : `<p class="pr-soon">⏳ ${H(TX.soon)}</p>`}
        <p class="small muted">${H(TX.terms)}</p>
      </form>`;
  }
  function manualBox(o) {
    return `<form class="pr-receipt" data-receipt="${esc(o.id)}">
      <p class="small">${H(TX.manualHow)}</p>
      <div class="pr-req"><div><span class="small muted">${H(TX.order)}</span><b>№ ${esc(o.id)}</b></div><div><span class="small muted">${H(TX.amount)}</span><b>${nf(o.amount)} ${H(TX.som)}</b></div><div class="pr-req-acc"><span class="small muted">💳</span><b data-notr>${esc(info.manualInfo || "")}</b></div></div>
      <input type="text" name="method" maxlength="30" placeholder="${H(TX.method)}">
      <input type="text" name="ref" maxlength="80" required placeholder="${H(TX.ref)}">
      <input type="text" name="note" maxlength="300" placeholder="${H(TX.note)}">
      <label class="small">${H(TX.photo)} <input type="file" name="img" accept="image/jpeg,image/png,image/webp"></label>
      <button class="btn btn-primary btn-sm" type="submit">${H(TX.sendReceipt)}</button></form>`;
  }
  function ordersHtml() {
    const list = info.orders || [];
    if (!list.length) return "";
    return `<h3>${H(TX.history)}</h3><ul class="pr-orders">${list.map((o) => `<li class="pr-order st-${esc(o.status)}">
      <div><b>${esc(o.name)}</b> · ${nf(o.amount)} ${H(TX.som)}${o.gift ? ` · 🎁 ${esc(o.forName)}` : ""}<div class="small muted">№ ${esc(o.id)} · ${fmtDate(o.createdAt)} · ${H(TX.prov[o.provider] || o.provider)}</div>${o.note ? `<div class="small pr-warn">${esc(o.note)}</div>` : ""}</div>
      <span class="pr-st">${H(TX.st[o.status] || o.status)}</span>
      ${["new", "review", "rejected"].includes(o.status) && o.provider !== "payme" && o.provider !== "click" ? `<button class="btn btn-ghost btn-sm" type="button" data-cancel="${esc(o.id)}">${H(TX.cancel)}</button>` : ""}
      ${o.provider === "manual" && (o.status === "new" || o.status === "rejected") && info.manualInfo ? manualBox(o) : ""}</li>`).join("")}</ul>`;
  }
  function orgHtml() {
    if (stage() === "maktab") return "";
    return `<details class="pr-org"><summary><b>🏫 ${H(TX.org)}</b></summary>
      <p class="small">${H(TX.orgLead)}</p>
      <div class="pr-orgs">${(info.org || []).map((p) => `<div class="pr-orgp"><b>${H(TX.orgNames[p.id] || p.name)}</b><span>${nf(p.price)} ${H(TX.som)} / ${H(TX.per[p.per] || p.per)}</span></div>`).join("")}</div>
      <form class="pr-lead" data-lead>
        <select name="kind">${(info.org || []).map((p) => `<option value="${esc(p.id)}">${H(TX.orgNames[p.id] || p.name)}</option>`).join("")}</select>
        <input name="org" maxlength="120" required placeholder="${H(TX.orgName)}">
        <input name="name" maxlength="80" placeholder="${H(TX.orgWho)}">
        <input name="contact" maxlength="100" required placeholder="${H(TX.orgContact)}">
        <input name="count" type="number" min="0" max="1000000" placeholder="${H(TX.orgCount)}">
        <textarea name="note" maxlength="600" rows="2" placeholder="${H(TX.note)}"></textarea>
        <button class="btn btn-ghost btn-sm" type="submit">${H(TX.orgSend)}</button></form></details>`;
  }

  function renderPro() {
    const head = `<span class="pill">${H(TX.pill)}</span><h2 class="section-title">${H(TX.title)}</h2>`;
    if (!info) { PRO_ROOT.innerHTML = head + `<p class="muted">${H(TX.offline)}</p>`; return; }
    const me = info.me, app = inApp();
    let body = "";
    if (me && me.pro.active) body += statusHtml();
    if (app) {
      /* Илова: нарх ва тўлов йўқ */
      if (!(me && me.pro.active)) body += `<p class="muted">${H(TX.appNoPro)}</p>`;
      PRO_ROOT.innerHTML = head + body + perksHtml();
      return;
    }
    body += `<p class="muted">${H(TX.lead)}</p>` + perksHtml();
    if (info.sandbox) body += `<p class="pr-sandbox small">${H(TX.sandbox)}</p>`;
    const age = me ? me.age : devAge();
    if (!me) {
      if (devAge() && devAge() < 18) body += devAge() >= 13 ? `<p class="pr-teen-note">👨‍👩‍👧 ${H(TX.teen)}</p>` : "";
      else body += `<div class="pr-login"><p>${H(TX.login)}</p><button class="btn btn-primary btn-sm" type="button" data-login>${H(TX.loginBtn)}</button></div>`;
    } else if (me.canBuy) body += plansHtml();
    else if (age >= 13) body += `<p class="pr-teen-note">👨‍👩‍👧 ${H(TX.teen)}</p>`;
    if (me) body += ordersHtml();
    if (!me || me.canBuy) body += orgHtml();
    PRO_ROOT.innerHTML = head + body;
  }

  /* ---------- Тўлов ---------- */
  PRO_ROOT.addEventListener("change", (e) => {
    const t = e.target;
    if (t.name === "who") { const g = PRO_ROOT.querySelector("[name=gift]"); if (g) { g.hidden = t.value !== "gift"; if (!g.hidden) g.focus(); } }
    if (t.matches("[data-gold]")) { try { localStorage.setItem("ekotalim:gold", t.checked ? "1" : "0"); } catch (x) { /* ignore */ } flags(); }
  });
  PRO_ROOT.addEventListener("click", async (e) => {
    if (e.target.closest("[data-login]")) { const b = document.getElementById("authBtn"); if (b) b.click(); return; }
    const c = e.target.closest("[data-cancel]");
    if (c) { try { await api("/api/pro/cancel", { id: c.dataset.cancel }); await load(); } catch (x) { toast(x.message); } }
  });
  PRO_ROOT.addEventListener("submit", async (e) => {
    const f = e.target;
    e.preventDefault();
    if (busy) return;
    busy = true;
    try {
      if (f.matches("[data-buy]")) {
        const provider = (e.submitter && e.submitter.value) || "";
        const gift = f.who.value === "gift" ? f.gift.value.trim() : "";
        if (f.who.value === "gift" && gift.length < 5) { f.gift.focus(); return; }
        const d = await api("/api/pro/order", { plan: f.plan.value, provider, gift });
        if (d.url) { toast(TX.redirect); try { sessionStorage.setItem("ekotalim:payorder", d.order.id); } catch (x) { /* ignore */ } location.href = d.url; return; }
        if (provider === "test") toast(TX.gotPro);
        await load();
        if (provider === "manual") { const r = PRO_ROOT.querySelector(`[data-receipt="${d.order.id}"]`); if (r) r.scrollIntoView({ behavior: "smooth", block: "center" }); }
      } else if (f.matches("[data-receipt]")) {
        const file = f.img.files && f.img.files[0];
        let image = "";
        if (file) {
          if (file.size > 1.5 * 1024 * 1024) { toast(TX.photo); return; }
          image = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
        }
        await api("/api/pro/receipt", { id: f.dataset.receipt, method: f.method.value, ref: f.ref.value, note: f.note.value, image });
        toast(TX.sent); await load();
      } else if (f.matches("[data-lead]")) {
        await api("/api/pro/lead", { kind: f.kind.value, org: f.org.value, name: f.name.value, contact: f.contact.value, count: f.count.value, note: f.note.value });
        f.reset(); toast(TX.orgOk);
      }
    } catch (x) { toast(x.message); }
    finally { busy = false; }
  });

  /* Payme/Click дан қайтилганда: тўлов тасдиқланишини бир неча марта текширамиз */
  function pollReturn() {
    let id = ""; try { id = sessionStorage.getItem("ekotalim:payorder") || ""; } catch (e) { /* ignore */ }
    if (!id || !hasServer()) return;
    let n = 0;
    toast(TX.waiting);
    clearInterval(pollT);
    pollT = setInterval(async () => {
      n++;
      await load();
      const o = info && (info.orders || []).find((x) => x.id === id);
      if ((o && o.status !== "new") || n >= 12) {
        clearInterval(pollT);
        try { sessionStorage.removeItem("ekotalim:payorder"); } catch (e) { /* ignore */ }
        if (o && o.status === "paid") toast(TX.gotPro);
      }
    }, 5000);
  }

  /* ---------- Шахсий агент ---------- */
  const chatKey = () => "ekotalim:agent:" + ((info && info.me && info.me.id) || "me");
  let chat = [];
  const loadChat = () => { try { chat = JSON.parse(localStorage.getItem(chatKey()) || "[]"); if (!Array.isArray(chat)) chat = []; } catch (e) { chat = []; } };
  const saveChat = () => { try { localStorage.setItem(chatKey(), JSON.stringify(chat.slice(-40))); } catch (e) { /* ignore */ } };
  /* Оддий markdown: **қалин**, рўйхатлар ва қаторлар (ҳаммаси аввал escape қилинади) */
  function md(s) {
    const lines = esc(s).split(/\n/);
    let out = "", list = false;
    for (const ln of lines) {
      const m = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/.exec(ln);
      if (m) { if (!list) { out += "<ul>"; list = true; } out += `<li>${m[1]}</li>`; continue; }
      if (list) { out += "</ul>"; list = false; }
      const h = /^#{1,4}\s+(.*)$/.exec(ln);
      out += h ? `<p><b>${h[1]}</b></p>` : ln.trim() ? `<p>${ln}</p>` : "";
    }
    if (list) out += "</ul>";
    return out.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  }
  function renderAgent() {
    const kid = stage() === "maktab";
    const head = `<span class="pill">${H(AG.pill)}</span><h2 class="section-title">${H(kid ? AG.titleK : AG.titleU)}</h2><p class="muted">${H(kid ? AG.leadK : AG.leadU)}</p>`;
    const me = info && info.me;
    if (!me) { AG_ROOT.innerHTML = head + `<p class="muted">${H(info ? AG.needLogin : TX.offline)}</p>${info && !inApp() ? `<button class="btn btn-primary btn-sm" type="button" data-login>${H(TX.loginBtn)}</button>` : ""}`; return; }
    if (!me.pro.active) { AG_ROOT.innerHTML = head + `<p class="muted">${H(AG.needPro)}</p>${inApp() ? "" : `<a class="btn btn-primary btn-sm" href="#pro">${H(AG.seePro)}</a>`}`; return; }
    if (!me.agent.ready) { AG_ROOT.innerHTML = head + `<p class="pr-warn">${H(AG.notReady)}</p>`; return; }
    loadChat();
    const qs = kid ? AG.qK : AG.qU;
    AG_ROOT.innerHTML = head + `<div class="ag-box">
      <div class="ag-top"><span class="small muted">${H(AG.used)}: <b data-used>${me.agent.used}</b> / ${me.agent.limit}</span><button class="btn btn-ghost btn-sm" type="button" data-clear>🧹 ${H(AG.clear)}</button></div>
      <div class="ag-log" data-log aria-live="polite">${chat.map(bubble).join("")}</div>
      <div class="ag-q">${qs.map((q) => `<button type="button" class="chip" data-q>${H(q)}</button>`).join("")}</div>
      <form class="ag-form" data-ask><textarea name="q" rows="2" maxlength="2000" placeholder="${H(AG.ph)}" required></textarea><button class="btn btn-primary" type="submit">${H(AG.send)}</button></form>
      <p class="small muted">🔒 ${H(AG.privacy)}</p></div>`;
    const log = AG_ROOT.querySelector("[data-log]"); log.scrollTop = log.scrollHeight;
  }
  const bubble = (m) => `<div class="ag-msg ${m.role === "user" ? "me" : "ai"}" data-notr>${m.role === "user" ? esc(m.content).replace(/\n/g, "<br>") : md(m.content)}</div>`;
  async function ask(text) {
    if (busy || !text.trim()) return;
    busy = true;
    chat.push({ role: "user", content: text.trim() });
    saveChat();
    const log = AG_ROOT.querySelector("[data-log]");
    log.insertAdjacentHTML("beforeend", bubble(chat[chat.length - 1]) + `<div class="ag-msg ai ag-wait">${H(AG.think)}</div>`);
    log.scrollTop = log.scrollHeight;
    try {
      const d = await api("/api/agent", { messages: chat.slice(-12) });
      chat.push({ role: "assistant", content: d.text });
      saveChat();
      if (info && info.me) info.me.agent.used = d.used;
    } catch (e) {
      chat.pop(); saveChat();
      toast(e.message);
    } finally {
      busy = false;
      renderAgent();
      const ta = AG_ROOT.querySelector("textarea"); if (ta && !chat.length) ta.focus();
    }
  }
  AG_ROOT.addEventListener("click", (e) => {
    if (e.target.closest("[data-login]")) { const b = document.getElementById("authBtn"); if (b) b.click(); return; }
    if (e.target.closest("[data-clear]")) { chat = []; saveChat(); renderAgent(); return; }
    const q = e.target.closest("[data-q]");
    if (q) ask(q.textContent);
  });
  AG_ROOT.addEventListener("submit", (e) => {
    e.preventDefault();
    const ta = e.target.q;
    const v = ta.value; ta.value = "";
    ask(v);
  });
  AG_ROOT.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && e.target.matches("textarea[name=q]")) { e.preventDefault(); e.target.form.requestSubmit(); }
  });

  /* ---------- Безак ---------- */
  const css = document.createElement("style");
  css.textContent = `
html.eko-app:not(.is-pro) .pro-sell, html.pro-kid .pro-sell, html.pro-kid .pro-agent, html.eko-app:not(.is-pro) .pro-agent{display:none!important}
.pr-perks{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:16px 0}
.pr-perk{display:flex;gap:12px;padding:14px;border:1px solid var(--line);border-radius:16px;background:var(--card)}
.pr-perk>span{font-size:1.7rem}.pr-perk b{display:block}.pr-perk small{color:var(--muted)}
.pr-status{display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:16px 18px;border-radius:18px;margin:12px 0;background:linear-gradient(135deg,rgba(245,158,11,.18),rgba(234,179,8,.08));border:1px solid rgba(217,119,6,.45)}
.pr-crown{font-size:2.2rem}.pr-acts{margin-left:auto;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.pr-warn{color:#b45309}.pr-soon,.pr-teen-note,.pr-sandbox,.pr-login{padding:12px 14px;border-radius:14px;background:var(--primary-soft);margin:12px 0}
.pr-sandbox{background:rgba(234,179,8,.18)}
.pr-buy{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;padding:16px;border:1px solid var(--line);border-radius:18px;background:var(--card)}
.pr-plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
.pr-plan{position:relative;display:block;cursor:pointer}.pr-plan input{position:absolute;opacity:0}
.pr-plan span{display:grid;gap:2px;padding:14px;border:2px solid var(--line);border-radius:14px}.pr-plan b{font-size:1.25rem}
.pr-plan em{font-style:normal;font-size:.8rem;color:var(--primary);font-weight:700}
.pr-plan input:checked+span{border-color:var(--primary);background:var(--primary-soft)}.pr-plan input:focus-visible+span{outline:3px solid var(--primary-2)}
.pr-who{border:0;padding:0;margin:0;display:grid;gap:6px}.pr-who input[type=text]{padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--text)}
.pr-pay{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.pr-payme{background:#00b4c8!important;border-color:#00b4c8!important;color:#fff!important}.pr-click{background:#0073ff!important;border-color:#0073ff!important;color:#fff!important}
.pr-orders{list-style:none;padding:0;display:grid;gap:10px}
.pr-order{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:12px 14px;border:1px solid var(--line);border-radius:14px;background:var(--card)}
.pr-order>div:first-child{flex:1 1 220px}.pr-st{font-weight:700;font-size:.85rem;padding:4px 10px;border-radius:99px;background:var(--bg-alt)}
.st-paid .pr-st{background:var(--primary-soft);color:var(--primary)}.st-rejected .pr-st,.st-refunded .pr-st{color:#b91c1c}
.pr-receipt{flex:1 1 100%;display:grid;gap:8px;padding-top:8px;border-top:1px dashed var(--line)}
.pr-receipt input[type=text],.pr-lead input,.pr-lead select,.pr-lead textarea,.ag-form textarea{padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--text);font:inherit}
.pr-req{display:flex;flex-wrap:wrap;gap:12px}.pr-req>div{display:grid;padding:8px 12px;border-radius:12px;background:var(--bg-alt)}.pr-req-acc{flex:1 1 220px}
.pr-org{margin-top:18px;padding:14px 16px;border:1px solid var(--line);border-radius:18px;background:var(--card)}.pr-org summary{cursor:pointer}
.pr-orgs{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin:10px 0}.pr-orgp{display:grid;padding:10px 12px;border-radius:12px;background:var(--bg-alt)}
.pr-lead{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px}.pr-lead textarea,.pr-lead button{grid-column:1/-1}
.ag-box{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;padding:14px;border:1px solid var(--line);border-radius:18px;background:var(--card)}
.ag-top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.ag-log{display:flex;flex-direction:column;gap:10px;max-height:60vh;min-height:120px;overflow:auto;padding:4px}
.ag-msg{max-width:85%;padding:10px 14px;border-radius:16px;line-height:1.5;overflow-wrap:anywhere}.ag-msg p{margin:.25em 0}.ag-msg ul{margin:.3em 0;padding-left:1.2em}
.ag-msg.me{align-self:flex-end;background:var(--primary);color:var(--on-primary);border-bottom-right-radius:4px}
.ag-msg.ai{align-self:flex-start;background:var(--bg-alt);border-bottom-left-radius:4px}.ag-wait{opacity:.7;font-style:italic}
.ag-q{display:flex;flex-wrap:wrap;gap:6px}.ag-q .chip{white-space:normal;text-align:left;max-width:100%}.ag-form{display:flex;gap:8px;align-items:flex-end}.ag-form textarea{flex:1;resize:vertical;min-height:48px}
html.is-pro #userChip::after{content:"PRO";margin-left:2px;font-size:.62rem;font-weight:800;padding:2px 6px;border-radius:99px;background:linear-gradient(135deg,#f59e0b,#eab308);color:#3b2400}
html.pro-gold{--primary:#b45309;--primary-soft:rgba(245,158,11,.16);--btn-grad:linear-gradient(135deg,#d97706,#ca8a04);--grad:linear-gradient(135deg,#f59e0b 0%,#eab308 50%,#d97706 100%)}
@media (prefers-color-scheme:dark){html.pro-gold:not([data-theme=light]){--primary:#fbbf24;--on-primary:#2a1a00}}
html[data-theme=dark].pro-gold{--primary:#fbbf24;--on-primary:#2a1a00}
@media (max-width:560px){.pr-acts{margin-left:0}.ag-msg{max-width:95%}}`;
  document.head.appendChild(css);

  window.addEventListener("eko:user", () => load());
  window.addEventListener("eko:lang", () => { renderPro(); renderAgent(); });
  window.addEventListener("eko:stage", () => { flags(); renderPro(); renderAgent(); });
  window.addEventListener("hashchange", () => { if (location.hash === "#pro" || location.hash === "#agent") load(); });
  flags();
  load().then(pollReturn);
  window.EkoPro = { reload: load, get active() { return proOn(); } };
})();
