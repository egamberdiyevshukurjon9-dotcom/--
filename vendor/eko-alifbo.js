/* Экомун — 🔤 «Янги ўзбек лотин алифбоси» (ЎРҚ-1184, 21.10.2026).
   #qonun бўлимидаги «Қонунчилик янгилиги» таби (vendor/eko-qonun.js чақиради: EkoAlifbo.html()).
   Ичида: қонун мазмуни, 28 ҳарф + тутуқ белгиси жадвали, эски/янги ёзув солиштирмаси,
   матн конвертери (кирилл / ҳозирги лотин / янги лотин) ва платформа ёзувини танлаш.
   Қонун расмий эълон қилингандан 6 ой ўтгач кучга киради; шу вақтгача платформа
   ҳозирги (1995) лотин алифбосида қолади, янги ёзув — тил менюсидаги «Özbekça (yangi lotin)». */
(() => {
  "use strict";
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
  const as = (s, y) => (EL() && EL().trAs ? EL().trAs(s, y) : s);

  /* ---------- Конвертер ---------- */
  const OLD2NEW = { O: "Ö", o: "ö", G: "Ğ", g: "ğ" };
  // Ҳозирги лотин → янги: oʻ/gʻ (ʻ ' ‘ ` ’ билан ёзилган) → ö/ğ, sh → ş, ch → ç, sʼh → sh.
  // ʼ (тутуқ белгиси) ўзгармайди: moʻʼjiza → möʼjiza.
  function oldToNew(s) {
    return String(s || "")
      .replace(/([OoGg])[ʻ'‘`’]/g, (_, c) => OLD2NEW[c])
      .replace(/SH|Sh|sh/g, (m) => (m === "sh" ? "ş" : "Ş"))
      .replace(/CH|Ch|ch/g, (m) => (m === "ch" ? "ç" : "Ç"))
      .replace(/([Ss])[ʼ'’]([Hh])/g, "$1$2");
  }
  // Янги лотин → ҳозирги: аввал s+h (Ishoq) → sʼh, кейин ö/ğ/ş/ç → oʻ/gʻ/sh/ch
  function newToOld(s) {
    const v = String(s || "").replace(/([Ss])([Hh])/g, "$1ʼ$2");
    return EL() && EL().fold ? EL().fold(v) : v;
  }
  const isCyr = (s) => /[Ѐ-ӿ]/.test(s);

  /* ---------- Маълумот ---------- */
  const LETTERS = ["A", "B", "D", "E", "F", "G", "Ğ", "H", "I", "J", "K", "L", "M", "N", "O", "Ö", "P", "Q", "R", "S", "Ş", "Ç", "T", "U", "V", "X", "Y", "Z"];
  const CHANGED = { "Ğ": "Gʻ gʻ", "Ö": "Oʻ oʻ", "Ş": "Sh sh", "Ç": "Ch ch" };
  const CYR = { A: "А", B: "Б", D: "Д", E: "Е, Э", F: "Ф", G: "Г", "Ğ": "Ғ", H: "Ҳ", I: "И", J: "Ж", K: "К", L: "Л", M: "М", N: "Н", O: "О", "Ö": "Ў", P: "П", Q: "Қ", R: "Р", S: "С", "Ş": "Ш", "Ç": "Ч", T: "Т", U: "У", V: "В", X: "Х", Y: "Й", Z: "З" };
  const SAMPLES = ["Ўзбекистон", "ўрмон", "тоғ", "шаҳар", "чиқинди", "чўл", "ғўза", "Тошкент", "маъно", "сунъий", "Исҳоқ", "қуёш", "тупроқ", "Оролбўйи"];
  const POINTS = [
    t3("Ўзбекистон Республикасида лотин ёзувига асосланган, 28 та ҳарф ва 1 та тутуқ белгисидан иборат ўзбек алифбоси жорий этилади.",
      "В Узбекистане вводится узбекский алфавит на латинской основе из 28 букв и 1 знака тутук (апострофа).",
      "Uzbekistan introduces a Latin-based Uzbek alphabet of 28 letters and 1 tutuq sign (apostrophe)."),
    t3("Алифбо 26 та ҳарф ва 3 та ҳарф бирикмаси (sh, ch, ng) ўрнига 28 та ҳарф ва 1 та тутуқ белгисидан ташкил топади: Oʻ → Ö, Gʻ → Ğ, Sh → Ş, Ch → Ç.",
      "Вместо 26 букв и 3 буквосочетаний (sh, ch, ng) алфавит состоит из 28 букв и 1 знака: Oʻ → Ö, Gʻ → Ğ, Sh → Ş, Ch → Ç.",
      "Instead of 26 letters and 3 digraphs (sh, ch, ng) the alphabet has 28 letters and 1 sign: Oʻ → Ö, Gʻ → Ğ, Sh → Ş, Ch → Ç."),
    t3("Қонун кучга киргунига қадар эски шаклдаги ҳарфлар билан расмийлаштирилган ҳужжатлар, миллий валюта ва қимматли қоғозлар амал қилишда ва муомалада бўлишда давом этади.",
      "Документы, национальная валюта и ценные бумаги, оформленные до вступления закона в силу с прежней формой букв, продолжают действовать и находиться в обращении.",
      "Documents, national currency and securities issued with the old letter forms before the law takes effect remain valid and in circulation."),
    t3("Давлат органларининг рамзий белгилари, бинолардаги давлат герби бўртма тасвири, географик объектлар номлари туширилган пешлавҳа ва кўрсаткичлар яроқсиз ҳолга келгунича ёки Қонун ижроси дастурида белгиланган муддатгача ишлатилаверади.",
      "Символика госорганов, рельефные изображения герба на зданиях, вывески и указатели с названиями географических объектов используются до износа или до срока, установленного программой исполнения закона.",
      "State bodies' symbols, relief coats of arms on buildings, and signs with geographic names stay in use until worn out or until the deadline set by the implementation programme."),
    t3("Қонун расмий эълон қилинган кундан эътиборан олти ой ўтгач кучга киради.",
      "Закон вступает в силу по истечении шести месяцев со дня официального опубликования.",
      "The law enters into force six months after its official publication.")
  ];
  const QUIZ = [
    { q: t3("Янги алифбо нечта ҳарф ва белгидан иборат?", "Из скольких букв и знаков состоит новый алфавит?", "How many letters and signs does the new alphabet have?"),
      a: [t3("26 ҳарф ва 3 ҳарф бирикмаси", "26 букв и 3 буквосочетания", "26 letters and 3 digraphs"), t3("28 ҳарф ва 1 тутуқ белгиси", "28 букв и 1 знак тутук", "28 letters and 1 tutuq sign"), t3("29 ҳарф", "29 букв", "29 letters")], c: 1 },
    { q: t3("«Ўзбекистон» сўзи янги алифбода қандай ёзилади?", "Как пишется «Ўзбекистон» в новом алфавите?", "How is “Ўзбекистон” written in the new alphabet?"),
      a: ["Oʻzbekiston", "Özbekiston", "Uzbekiston"], c: 1 },
    { q: t3("«Шаҳар» сўзи янги алифбода қандай ёзилади?", "Как пишется «Шаҳар» в новом алфавите?", "How is “Шаҳар” written in the new alphabet?"),
      a: ["Shahar", "Sahar", "Şahar"], c: 2 },
    { q: t3("Қонун қачон кучга киради?", "Когда закон вступает в силу?", "When does the law take effect?"),
      a: [t3("Имзоланган куни", "В день подписания", "On the day it is signed"), t3("Расмий эълон қилинганидан 6 ой ўтгач", "Через 6 месяцев после официального опубликования", "6 months after official publication"), t3("2030 йил 1 январда", "1 января 2030 года", "On 1 January 2030")], c: 1 },
    { q: t3("Эски шаклдаги ҳарфлар билан чиқарилган пул ва ҳужжатлар нима бўлади?", "Что будет с деньгами и документами со старыми формами букв?", "What happens to money and documents with the old letter forms?"),
      a: [t3("Бекор қилинади", "Аннулируются", "They are cancelled"), t3("Амал қилишда ва муомалада қолади", "Остаются действительными и в обращении", "They stay valid and in circulation"), t3("Бир ойда алмаштирилиши шарт", "Должны быть заменены за месяц", "Must be replaced within a month")], c: 1 }
  ];
  const picks = {};
  let mode = "cyr", input = "";

  /* ---------- Чизиш ---------- */
  function convOut(v) {
    const src = v || "";
    if (mode === "new") return { old: newToOld(src), neu: src };
    if (mode === "old") return { old: src, neu: oldToNew(src) };
    return { old: isCyr(src) ? as(src, false) : src, neu: isCyr(src) ? as(src, true) : oldToNew(src) };
  }
  function outHtml() {
    const o = convOut(input);
    return `<div class="alf-out" data-notr>
        <div><span class="small muted">${H(t3("Ҳозирги лотин (1995)", "Действующая латиница (1995)", "Current Latin (1995)"))}</span><output data-alf-o="old">${esc(o.old)}</output><button type="button" class="btn btn-ghost btn-sm" data-alf="copy-old"><i class="fa-regular fa-copy" aria-hidden="true"></i> ${H(t3("Нусха", "Копировать", "Copy"))}</button></div>
        <div><span class="small muted">${H(t3("Янги лотин (2026)", "Новая латиница (2026)", "New Latin (2026)"))}</span><output data-alf-o="new">${esc(o.neu)}</output><button type="button" class="btn btn-ghost btn-sm" data-alf="copy-new"><i class="fa-regular fa-copy" aria-hidden="true"></i> ${H(t3("Нусха", "Копировать", "Copy"))}</button></div>
      </div>`;
  }
  function html() {
    const code = EL() ? EL().code : "cyr";
    const MODES = [["cyr", t3("Кириллдан", "С кириллицы", "From Cyrillic")], ["old", t3("Ҳозирги лотиндан", "С действующей латиницы", "From current Latin")], ["new", t3("Янги лотиндан", "С новой латиницы", "From new Latin")]];
    return `<div class="qn-card qn-box alf-news">
        <span class="qn-tag warn">🆕 ${H(t3("Қонунчилик янгилиги", "Новости законодательства", "Legislation news"))}</span>
        <h3>🔤 ${H(t3("Лотин ёзувига асосланган ўзбек алифбоси 28 та ҳарф ва 1 та тутуқ белгисидан иборат бўлади", "Узбекский алфавит на латинской основе будет состоять из 28 букв и 1 знака тутук", "The Latin-based Uzbek alphabet will have 28 letters and 1 tutuq sign"))}</h3>
        <div class="qn-meta"><span class="qn-tag">${H("ЎРҚ-1184")}</span><span class="qn-tag">21.10.2026</span><span class="qn-tag warn">⏳ ${H(t3("Кучга киради: расмий эълондан 6 ой ўтгач", "Вступает в силу: через 6 месяцев после опубликования", "Takes effect: 6 months after publication"))}</span></div>
        <p>${H(t3("Ўзбекистон Республикасининг «Лотин ёзувига асосланган ўзбек алифбосини жорий этиш тўғрисида»ги Ўзбекистон Республикаси Қонунига ўзгартириш киритиш ҳақида»ги Қонуни (ЎРҚ–1184-сон, 21.10.2026 й.) қабул қилинди.",
          "Принят Закон Республики Узбекистан «О внесении изменения в Закон Республики Узбекистан „О введении узбекского алфавита, основанного на латинской графике“» (ЗРУ–1184, 21.10.2026).",
          "The Law of the Republic of Uzbekistan “On amending the Law ‘On introducing the Uzbek alphabet based on the Latin script’” (ZRU–1184, 21.10.2026) has been adopted."))}</p>
        <ul>${POINTS.map((p) => `<li>${H(p)}</li>`).join("")}</ul>
        <p class="small muted">${H(t3("Манба: «Қонунчилик янгиликлари» расмий хабари. Тўлиқ ва расмий матнни lex.uz да текширинг.", "Источник: официальное сообщение «Новости законодательства». Полный официальный текст проверяйте на lex.uz.", "Source: official “Legislation news” post. Check the full official text on lex.uz."))} <a href="https://lex.uz" target="_blank" rel="noopener">lex.uz ↗</a></p>
      </div>

      <div class="qn-card">
        <h3>🔠 ${H(t3("Янги алифбо: 28 ҳарф + тутуқ белгиси", "Новый алфавит: 28 букв + знак тутук", "New alphabet: 28 letters + tutuq sign"))}</h3>
        <p class="small muted">${H(t3("Рангли катаклар — ўзгарган ҳарфлар; остида ҳозирги шакли ва кирилл ҳарфи.", "Цветные клетки — изменённые буквы; ниже — нынешняя форма и кириллица.", "Coloured cells are the changed letters; below are the current form and the Cyrillic letter."))}</p>
        <div class="alf-grid" data-notr>${LETTERS.map((c) => `<div class="alf-l ${CHANGED[c] ? "new" : ""}"><b>${c} ${c.toLowerCase()}</b><small>${CHANGED[c] ? esc(CHANGED[c]) + " · " : ""}${esc(CYR[c])}</small></div>`).join("")}<div class="alf-l new"><b>ʼ</b><small>${H(t3("тутуқ", "тутук", "tutuq"))} · ъ</small></div></div>
      </div>

      <div class="qn-card">
        <h3>⚖️ ${H(t3("Эски ва янги ёзув: солиштиринг", "Старое и новое написание: сравните", "Old and new spelling compared"))}</h3>
        <div class="alf-tw"><table class="alf-t" data-notr>
          <thead><tr><th>${H(t3("Кирилл", "Кириллица", "Cyrillic"))}</th><th>${H(t3("Ҳозирги лотин (1995)", "Действующая латиница (1995)", "Current Latin (1995)"))}</th><th>${H(t3("Янги лотин (2026)", "Новая латиница (2026)", "New Latin (2026)"))}</th></tr></thead>
          <tbody>${SAMPLES.map((w) => `<tr><td>${esc(w)}</td><td>${esc(as(w, false))}</td><td><b>${esc(as(w, true))}</b></td></tr>`).join("")}</tbody>
        </table></div>
        <p class="small muted">${H(t3("Эътибор беринг: янги ёзувда «s» ва «h» алоҳида ўқиладиган сўзларда (Исҳоқ) тутуқ белгиси керак бўлмайди — Ishoq, чунки «ш» энди «ş».", "Обратите внимание: в новом письме в словах, где «s» и «h» читаются раздельно (Исҳоқ), апостроф не нужен — Ishoq, ведь «ш» теперь «ş».", "Note: in the new spelling words where “s” and “h” are read separately (Исҳоқ) need no apostrophe — Ishoq, because “ш” is now “ş”."))}</p>
      </div>

      <div class="qn-card">
        <h3>🔁 ${H(t3("Матн конвертери", "Конвертер текста", "Text converter"))}</h3>
        <p class="small muted">${H(t3("Матнни ёзинг ёки қўйинг — ҳозирги ва янги лотин ёзувида бирданига кўрасиз. Инглизча сўзлар ва номлардаги «sh», «ch» ни қўлда текширинг.", "Введите или вставьте текст — увидите его сразу в действующей и новой латинице. «sh», «ch» в английских словах и именах проверяйте вручную.", "Type or paste text to see it in both current and new Latin. Check “sh” and “ch” in English words and names by hand."))}</p>
        <div class="qn-acts" role="group">${MODES.map(([k, t]) => `<button type="button" class="chip ${mode === k ? "active" : ""}" data-alf-mode="${k}" aria-pressed="${mode === k}">${H(t)}</button>`).join("")}</div>
        <textarea class="alf-in" data-alf-in data-notr rows="3" maxlength="5000" placeholder="${esc(mode === "cyr" ? "Ўзбекистон — гўзал ўлка" : mode === "old" ? "Oʻzbekiston — goʻzal oʻlka" : "Özbekiston — gözal ölka")}">${esc(input)}</textarea>
        <div data-alf-box>${outHtml()}</div>
      </div>

      <div class="qn-card pdf-skip">
        <h3>⚙️ ${H(t3("Платформа ёзуви", "Письменность платформы", "Platform script"))}</h3>
        <p>${H(t3("Қонун кучга киргунича платформа ҳозирги лотин алифбосида қолади. Янги алифбони ҳозирдан ўрганиш учун уни ёқишингиз мумкин — барча бўлимлар янги ёзувда кўрсатилади. Истаган пайт қайтариш мумкин.", "До вступления закона в силу платформа остаётся на действующей латинице. Чтобы освоить новый алфавит заранее, включите его — все разделы отобразятся в новом письме. Вернуть можно в любой момент.", "Until the law takes effect the platform stays on the current Latin alphabet. Switch the new one on to learn it early — every section will use it. You can switch back at any time."))}</p>
        <div class="qn-acts alf-set" data-notr>
          <button type="button" class="btn btn-ghost btn-sm ${code === "cyr" ? "on" : ""}" data-setlang="cyr">Ўзбекча (кирилл)</button>
          <button type="button" class="btn btn-ghost btn-sm ${code === "lat" ? "on" : ""}" data-setlang="lat">Oʻzbekcha (lotin, 1995)</button>
          <button type="button" class="btn btn-ghost btn-sm ${code === "yl" ? "on" : ""}" data-setlang="yl">Özbekça (yangi lotin, 2026)</button>
        </div>
      </div>

      <div class="qn-card">
        <h3>🧠 ${H(t3("Ўзингизни синанг", "Проверьте себя", "Check yourself"))}</h3>
        <ol class="alf-quiz">${QUIZ.map((x, i) => {
          const p = picks[i];
          return `<li><p><b>${H(x.q)}</b></p><div class="qn-opts">${x.a.map((o, j) => `<button type="button" class="sg-opt ${p != null ? (j === x.c ? "ok" : j === p ? "bad" : "") : ""}" data-alf-q="${i}" data-alf-a="${j}" ${p != null ? "disabled" : ""}>${H(o)}</button>`).join("")}</div></li>`;
        }).join("")}</ol>
        ${Object.keys(picks).length === QUIZ.length ? `<p class="qn-fb">${H(t3("Натижа", "Результат", "Result"))}: ${QUIZ.filter((x, i) => picks[i] === x.c).length}/${QUIZ.length}</p>
          <div class="qn-acts pdf-skip"><button type="button" class="btn btn-ghost btn-sm" data-alf="reset">${H(t3("Қайтадан", "Заново", "Start again"))}</button></div>` : ""}
      </div>`;
  }

  /* ---------- Ҳодисалар ---------- */
  let rerender = () => {};
  function copy(v) {
    const done = () => { if (window.EkoApp && EkoApp.toast) EkoApp.toast(L(t3("Нусха олинди", "Скопировано", "Copied"))); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, () => {});
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-alf], [data-alf-mode], [data-alf-q]");
    if (!b) return;
    const d = b.dataset;
    if (d.alfMode) { mode = d.alfMode; input = ""; rerender(); return; }
    if (d.alfQ != null) { if (picks[d.alfQ] == null) picks[d.alfQ] = +d.alfA; rerender(); return; }
    if (d.alf === "reset") { Object.keys(picks).forEach((k) => delete picks[k]); rerender(); return; }
    if (d.alf === "copy-old" || d.alf === "copy-new") {
      const o = convOut(input);
      copy(d.alf === "copy-old" ? o.old : o.neu);
    }
  });
  document.addEventListener("input", (e) => {
    if (!e.target.matches || !e.target.matches("[data-alf-in]")) return;
    input = e.target.value;
    const box = e.target.parentElement.querySelector("[data-alf-box]");
    if (box) box.innerHTML = outHtml();
  });

  window.EkoAlifbo = { html, oldToNew, newToOld, onChange: (fn) => { rerender = fn; } };
})();
