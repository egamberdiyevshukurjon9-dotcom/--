/* Экомун — дарс матнини PDF қилиб юклаб олиш.
   Ҳужжат экрандаги (таржима қилинган) матндан тузилади: сарлавҳа, мақсад, асосий матн,
   схема, маслаҳат, тажриба, топшириқ, саволлар, жавоблар калити, манбалар ва ҳаволалар.
   jsPDF (MIT) ва «Ekomun PDF Sans» шрифти (Liberation Sans 2.1.5 қисми, SIL OFL)
   биринчи марта босилганда /vendor/pdf/ дан юкланади ва интернетсиз ҳам ишлайди.
   Матн PDF ичида танланади ва қидирилади, ҳаволалар босилади.
   Android иловада файл android-helper.js орқали «Сақлаш» ойнасида сақланади.
   Фойдаланиш: EkoPDF.save(элемент, { title, sub, file, answers, url }) */
(() => {
  "use strict";
  const BASE = "/vendor/pdf/";
  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const lang = () => (EL() ? EL().lang : "cyr");
  const L = (o) => {
    const l = lang();
    if (l === "ru") return o.ru;
    if (l === "en") return o.en;
    return l === "lat" && EL() ? EL().tr(o.uz) : o.uz;
  };
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const TX = {
    brand: t3("Ekomun · экологик таълим платформаси", "Ekomun · платформа экологического образования", "Ekomun · environmental education platform"),
    key: t3("Жавоблар калити (ўқитувчи учун)", "Ключ ответов (для преподавателя)", "Answer key (for the teacher)"),
    page: t3("бет", "стр.", "page"),
    made: t3("PDF тайёрланган сана", "Дата создания PDF", "PDF created on"),
    ver: t3("Ekomun версияси", "Версия Ekomun", "Ekomun version"),
    online: t3("Платформада интерактив машқлар билан ўқинг", "Читайте с интерактивными заданиями на платформе", "Study with interactive exercises on the platform"),
    links: t3("Ҳаволалар", "Ссылки", "Links"),
    wait: t3("PDF тайёрланмоқда…", "Готовим PDF…", "Preparing the PDF…"),
    done: t3("PDF юклаб олинди", "PDF скачан", "PDF downloaded"),
    fail: t3("PDF тайёрлаб бўлмади. Саҳифани янгилаб, қайта уриниб кўринг.", "Не удалось создать PDF. Обновите страницу и попробуйте снова.", "Could not create the PDF. Reload the page and try again.")
  };
  const site = () => (/^https?:$/.test(location.protocol) && location.hostname !== "appassets.androidplatform.net" ? location.origin + "/" : "");
  const toast = (s) => { if (window.EkoApp && EkoApp.toast) EkoApp.toast(s); };

  /* ---------- Кутубхона ва шрифтни бир марта юклаш ---------- */
  let ready = null;
  function script(src) {
    return new Promise((ok, no) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = () => no(new Error("load " + src));
      document.head.appendChild(s);
    });
  }
  async function b64(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("font " + r.status);
    const u = new Uint8Array(await r.arrayBuffer());
    let s = "";
    for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function lib() {
    if (!ready) {
      ready = (async () => {
        if (!(window.jspdf && window.jspdf.jsPDF)) await script(BASE + "jspdf.umd.min.js");
        const [r, b] = await Promise.all([b64(BASE + "ekopdf-Regular.ttf"), b64(BASE + "ekopdf-Bold.ttf")]);
        return { jsPDF: window.jspdf.jsPDF, r, b };
      })().catch((e) => { ready = null; throw e; });
    }
    return ready;
  }

  /* ---------- Матнни тозалаш: эмоджи ва шрифтда йўқ белгилар ---------- */
  const clean = (s) => String(s || "")
    .replace(/[✓✔☑]/g, "+").replace(/[✕✖✗✘]/g, "×")
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}︎️‍⃣]/gu, "")
    .replace(/[^\t\n -~ -ɏʰ-ͯͰ-ϿЀ-ԯḀ-ỿ -⅏←-⋿■-◿]/gu, "")
    .replace(/\s+/g, " ").trim();

  /* ---------- DOM дан блоклар ---------- */
  const SKIP = "button,input,textarea,select,svg,canvas,img,script,style,[hidden],[data-pdf-skip],.seg,.lesson-steps,.ins-m,.m-btns,.modal-actions,.modal-close,.self-opts,.sr-only,.pdf-skip";
  const INLINE = /^(B|I|EM|STRONG|SPAN|A|SMALL|CITE|BR|SUB|SUP|CODE|MARK|ABBR|Q|TIME|U|S|LABEL|KBD|DFN|BDI)$/;
  const BOX = /\b(lesson-goal|lesson-wonder|lesson-tip|lesson-fun|lesson-exp|lesson-calc|lesson-task|lesson-cer|lesson-ev|pdf-box|qn-box)\b/;
  const txt = (n) => {
    const c = n.cloneNode(true);
    c.querySelectorAll(SKIP).forEach((x) => x.remove());
    c.querySelectorAll("*").forEach((x) => { if (!/^(B|I|EM|STRONG|U|S|SUB|SUP|MARK|ABBR|DFN|KBD|CODE)$/.test(x.tagName)) { x.before(" "); x.after(" "); } });
    return clean(c.textContent).replace(/\s+([,.;:!?)»%])/g, "$1").replace(/([(«])\s+/g, "$1");
  };
  const linksOf = (n) => [...n.querySelectorAll("a[href^='http']")].filter((a) => !a.closest(SKIP)).map((a) => a.href);
  const inlineOnly = (n) => [...n.children].every((c) => INLINE.test(c.tagName) && inlineOnly(c));

  function blocks(root, opt) {
    const out = [];
    const push = (o, n) => { if (!o.s) return; o.links = n ? linksOf(n) : []; out.push(o); };
    const walk = (el, box, depth) => {
      for (const n of el.children) {
        if (n.matches(SKIP)) continue;
        const b = box || (BOX.test(n.className || "") ? 1 : 0);
        const tag = n.tagName;
        if (n.matches(".q[data-q], [data-pdf-q]")) {
          const opts = [...n.querySelectorAll(".opt, [data-pdf-opt]")].map((o) => clean(o.textContent));
          const q = n.querySelector("p, [data-pdf-qt]");
          out.push({ t: "q", s: txt(q || n), opts, qi: +(n.dataset.q || n.dataset.pdfQ || 0), links: [] });
        } else if (/^H[1-2]$/.test(tag)) push({ t: "title", s: txt(n) }, null);
        else if (/^H[3-6]$/.test(tag)) push({ t: "h", s: txt(n), box: b }, null);
        else if (tag === "LI") push({ t: "li", s: txt(n), box: b, num: n.parentElement && n.parentElement.tagName === "OL" ? [...n.parentElement.children].indexOf(n) + 1 : 0 }, n);
        else if (tag === "TR") push({ t: "p", s: [...n.children].map(txt).filter(Boolean).join("  |  "), box: b }, n);
        else if (tag === "DETAILS") walk(n, b, depth + 1);
        else if (/^(P|SUMMARY|BLOCKQUOTE|FIGCAPTION|DT|DD|PRE)$/.test(tag) || !n.children.length || inlineOnly(n)) {
          const s = txt(n);
          push({ t: n.classList.contains("small") || n.classList.contains("muted") ? "small" : "p", s, box: b }, n);
        } else walk(n, b, depth + 1);
      }
    };
    walk(root, 0, 0);
    /* Бир хил кетма-кет такрорлар (масалан, сарлавҳа ва pill) олиб ташланади */
    return out.filter((o, i) => !(i && out[i - 1].s === o.s && out[i - 1].t === o.t));
  }

  /* ---------- PDF чизиш ---------- */
  const GREEN = [4, 120, 87], SOFT = [236, 253, 245], INK = [17, 24, 39], MUTE = [75, 85, 99], LINK = [29, 78, 216];
  async function build(root, meta) {
    const { jsPDF, r, b } = await lib();
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
    doc.addFileToVFS("ekopdf-r.ttf", r); doc.addFont("ekopdf-r.ttf", "Eko", "normal");
    doc.addFileToVFS("ekopdf-b.ttf", b); doc.addFont("ekopdf-b.ttf", "Eko", "bold");
    const W = 210, H = 297, M = 18, CW = W - 2 * M, BOT = H - 18;
    let y = 0;
    const font = (w, size, col) => { doc.setFont("Eko", w); doc.setFontSize(size); doc.setTextColor(...(col || INK)); };
    const lh = (size) => size * 0.3528 * 1.38;
    const newPage = () => { doc.addPage(); y = M; };
    const room = (h) => { if (y + h > BOT) newPage(); };

    /* Бош қисм */
    doc.setFillColor(...GREEN); doc.rect(0, 0, W, 12, "F");
    font("bold", 9.5, [255, 255, 255]); doc.text(clean(L(TX.brand)), M, 7.8);
    y = 22;
    if (meta.sub) { font("normal", 10, GREEN); doc.splitTextToSize(clean(meta.sub), CW).forEach((l) => { doc.text(l, M, y); y += lh(10); }); y += 1; }
    font("bold", 19, INK);
    doc.splitTextToSize(clean(meta.title), CW).forEach((l) => { room(lh(19)); doc.text(l, M, y + 2); y += lh(19); });
    y += 3;
    doc.setDrawColor(...GREEN); doc.setLineWidth(0.6); doc.line(M, y, M + 30, y); y += 7;

    const para = (s, o) => {
      const size = o.size || 11, ind = o.ind || 0, w = o.bold ? "bold" : "normal";
      font(w, size, o.col);
      const lines = doc.splitTextToSize(s, CW - ind - (o.box ? 6 : 0));
      const h = lh(size);
      lines.forEach((l, i) => {
        room(h);
        if (o.box) { doc.setFillColor(...SOFT); doc.rect(M, y - h * 0.78, CW, h, "F"); doc.setFillColor(...GREEN); doc.rect(M, y - h * 0.78, 1.1, h, "F"); }
        if (o.bullet && i === 0) { font("bold", size, GREEN); doc.text(o.bullet, M + (o.box ? 4 : 0) + ind - 5, y); font(w, size, o.col); }
        doc.text(l, M + ind + (o.box ? 4 : 0), y);
        y += h;
      });
    };
    const links = (arr, box) => arr.forEach((u) => {
      font("normal", 9, LINK);
      const s = "→ " + u;
      doc.splitTextToSize(s, CW - (box ? 6 : 0)).forEach((l) => {
        room(lh(9));
        if (box) { const h = lh(9); doc.setFillColor(...SOFT); doc.rect(M, y - h * 0.78, CW, h, "F"); doc.setFillColor(...GREEN); doc.rect(M, y - h * 0.78, 1.1, h, "F"); }
        doc.textWithLink(l, M + (box ? 4 : 0), y, { url: u });
        y += lh(9);
      });
    });

    const list = blocks(root, meta);
    const qs = [];
    let prevBox = 0, skipT = false;
    for (const o of list) {
      if (o.box && !prevBox) y += 2;
      if (!o.box && prevBox) y += 3;
      prevBox = o.box ? 1 : 0;
      if ((o.t === "title" || o.t === "h") && !skipT && clean(meta.title) === o.s) { skipT = true; continue; }
      if (o.t === "title") { y += 3; para(o.s, { size: 15, bold: true }); y += 1; }
      else if (o.t === "h") { y += o.box ? 1 : 4; room(lh(13) + lh(11) * 2); para(o.s, { size: 13, bold: true, col: GREEN, box: o.box }); y += 1; }
      else if (o.t === "li") para(o.s, { ind: 6, bullet: o.num ? o.num + "." : "•", box: o.box });
      else if (o.t === "small") para(o.s, { size: 9.5, col: MUTE, box: o.box });
      else if (o.t === "q") {
        qs.push(o);
        y += 1.5; room(lh(11) * 3);
        para(o.s, { bold: true });
        o.opts.forEach((a, i) => para(a, { ind: 8, bullet: String.fromCharCode(65 + i) + ")" }));
        y += 1;
        continue;
      } else para(o.s, { box: o.box });
      if (o.links && o.links.length) links([...new Set(o.links)], o.box);
      if (!o.box) y += 1.6;
    }

    /* Жавоблар калити */
    if (qs.length && meta.answers) {
      y += 6; room(lh(13) + lh(11) * 2);
      para(L(TX.key), { size: 13, bold: true, col: GREEN });
      y += 1;
      qs.forEach((q, i) => {
        const c = meta.answers[q.qi];
        if (c == null || !q.opts[c]) return;
        para(`${i + 1}. ${String.fromCharCode(65 + c)}) ${q.opts[c]}`, { size: 10 });
      });
    }

    /* Якун: сана, версия, платформа ҳаволаси */
    y += 6; room(lh(9.5) * 3);
    const d = new Date();
    const ds = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
    para(`${L(TX.made)}: ${ds} · ${L(TX.ver)}: ${(window.EKO_VERSION && EKO_VERSION.version) || ""}`, { size: 9.5, col: MUTE });
    const url = meta.url || site();
    if (url) { para(L(TX.online) + ":", { size: 9.5, col: MUTE }); links([url], 0); }

    /* Ҳар бир бет пастида: ном ва бет рақами */
    const n = doc.getNumberOfPages();
    for (let p = 1; p <= n; p++) {
      doc.setPage(p);
      doc.setDrawColor(209, 213, 219); doc.setLineWidth(0.2); doc.line(M, H - 12, W - M, H - 12);
      font("normal", 8, MUTE);
      const ft = clean(`Ekomun · ${meta.title}`);
      doc.text(doc.splitTextToSize(ft, CW - 25)[0], M, H - 7.5);
      doc.text(`${p} / ${n} ${L(TX.page)}`, W - M, H - 7.5, { align: "right" });
    }
    doc.setProperties({ title: clean(meta.title), subject: clean(meta.sub || ""), author: "Ekomun", creator: "Ekomun", keywords: "ekologiya, Ekomun" });
    return doc;
  }

  /* Файл номи лотинча ASCII: баъзи браузер ва телефонлар кирилл номни «download» қилиб қўяди */
  const slug = (s) => {
    let v = clean(s);
    if (/[\u0400-\u04FF]/.test(v) && EL()) v = EL().tr(v);
    v = v.normalize("NFD").replace(/[\u0300-\u036f\u02BB\u02BC\u2018\u2019'`]/g, "");
    return v.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "dars";
  };
  let busy = false;
  async function save(root, meta) {
    if (busy || !root) return;
    busy = true;
    toast(L(TX.wait));
    try {
      const doc = await build(root, meta);
      const blob = doc.output("blob");
      const a = document.createElement("a");
      a.download = (meta.file ? slug(meta.file) : "Ekomun-" + slug(meta.title)) + ".pdf";
      a.href = URL.createObjectURL(blob);
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 20000);
      toast(L(TX.done));
      window.dispatchEvent(new CustomEvent("eko:pdf", { detail: { title: meta.title } }));
    } catch (e) {
      toast(L(TX.fail));
      if (window.console) console.warn("EkoPDF", e);
    } finally { busy = false; }
  }
  window.EkoPDF = { save, build, blocks, preload: () => lib().catch(() => null) };
})();
