/* Экомун — «Экология» курсининг интерактив амалий машғулотлари (дарсдаги lesson.lab):
   filtr   — 1-лаборатория иши: оқова сувдаги муаллақ заррачаларни фильтрлаш (гравиметрия) усулида аниқлаш;
   snellen — 2-лаборатория иши: Снеллен асбоби билан тиниқлик ва лойқаликни аниқлаш, калибрлаш графиги;
   gaz     — 7-маъруза: чиқинди газ учун тозалаш усулини танлаш (абсорбция, адсорбция, каталитик, термик);
   tutun, tahlil — 3D лаборатория ва «Лаборатория хонаси» Таҳлил марказига ҳаволалар.
   Манба: Пулатов Х.Л. «Экология» фанидан 7-маъруза ва 1–2-лаборатория ишлари, 2026.
   Калибрлаш жадвали лаборатория ишидан; иккита ёзув хатоси тузатилган: 9,5 см → 97,0 мг/л (67,0 эмас),
   42,0 см (42,6 эмас). Матнлар ўзбек кирилл ёзувида, рус ва инглиз таржимаси vendor/i18n орқали. */
(() => {
  "use strict";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const lang = () => (typeof EkoLang !== "undefined" ? EkoLang.lang : "cyr");
  const fmt = (v, d) => { const s = Number(v).toFixed(d); return lang() === "en" ? s : s.replace(".", ","); };
  const num = (s) => parseFloat(String(s).trim().replace(/\s/g, "").replace(",", "."));
  const App = () => window.EkoApp;
  const toast = (m) => { const a = App(); if (a && a.toast) a.toast(m); };
  const once = (k, n, why) => {
    const a = App(); if (!a) return false;
    a.state.flags = a.state.flags || {};
    if (a.state.flags[k]) return false;
    a.state.flags[k] = true; a.addXp(n, why); if (a.save) a.save();
    return true;
  };
  const KEY = "eko_oqlab";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const store = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* хотира йўқ — майли */ } };

  /* Матнлар (ўзбек кирилл; таржималар vendor/i18n да) */
  const S = {
    labT: "Интерактив амалий машғулот",
    fT: "1-лаборатория иши: муаллақ заррачаларни аниқлаш",
    fLead: "Намунани ва ҳажмни танланг, фильтрни тортинг, намунани чайқатиб фильтрланг, доимий массагача қуритинг ва X = (M₂ − M₁)·1000/V формуласи бўйича ҳисобланг.",
    sample: "Намуна", volume: "Ҳажм V", mlU: "мл", gU: "г", mglU: "мг/л", cmU: "см",
    s1: "Маиший оқова сув", s2: "Кимё корхонаси оқова суви", s3: "Тозаланган оқова сув",
    bW1: "M₁: фильтрни тортиш", bShake: "Намунани чайқатиш", bFilt: "Фильтрлаш", bDry: "Қуритиш ва тортиш", bReset: "Қайтадан",
    needSV: "Аввал намуна ва ҳажмни танланг.", needM1: "Аввал тоза фильтрни тортинг (M₁).", needFilt: "Аввал намунани фильтрланг.",
    shaken: "Намуна чайқатилди: заррачалар бир текис тарқалди.", filtered: "Намуна фильтрдан ўтказилди. Энди фильтрни чўкма билан қуритинг.",
    noShakeWarn: "Намуна чайқатилмасдан фильтрланди: оғир заррачалар идиш тубида қолди!",
    airDry: "Ҳавода қуритилди", ovenDry: "Шкафда қуритилди (40–50 °C)",
    constOk: "Масса ўзгармай қолди — бу M₂. Энди X ни ҳисобланг.",
    alreadyConst: "Масса аллақачон доимий. X ни ҳисобланг.",
    xLabel: "Муаллақ моддалар X =", check: "Текшириш",
    xOk: "Тўғри! Натижа жадвалга ёзилди.", xNo: "Ҳали эмас. Формулани текширинг: V ни литрга ўтказинг.",
    xHint: "Маслаҳат:", needM2: "Аввал фильтрни доимий массагача қуритинг.",
    small: "Чўкма массаси 1 мг дан кам — аниқлик паст. Тоза сув учун каттароқ ҳажм (50 мл) олинг.",
    warnRow: "чайқатилмаган — қайта бажаринг",
    tabRes: "Натижалар жадвали", colS: "Намуна", colX: "X, мг/л", colSt: "Изоҳ",
    okRow: "тўғри",
    fDone: "Учала намуна таҳлил қилинди! Энди уларни энг ифлосидан энг тозасигача тартибланг ва ҳисоботга ёзинг.",
    viz: "Фильтрлаш қурилмаси ва тарози",
    sT: "2-лаборатория иши: Снеллен асбоби",
    sLead: "Намунани танланг. Цилиндр тўла: тубидаги крест кўринмайди. Сувни оз-оздан оқизинг ва крест аниқ кўринган пайтда «Крест кўринди» ни босинг. Сўнг калибрлаш жадвалидан лойқаликни топинг.",
    fill: "Тўлдириш", drain05: "0,5 см оқизиш", drain2: "2 см оқизиш", seen: "Крест кўринди",
    col: "Сув устуни:", side: "Ён томондан", top: "Юқоридан қараганда",
    tooEarly: "Крест ҳали аниқ кўринмаяпти — яна оз-оздан оқизинг.",
    tooLate: "Сиз ортиқча сув оқиздингиз: крест анча олдин кўрина бошлаган эди. Цилиндрни қайта тўлдириб, оз-оздан оқизинг.",
    hOk: "Баландлик ёзилди. Энди калибрлаш жадвалидан шу баландликка мос лойқаликни топинг.",
    lLabel: "Лойқалик даражаси =", lOk: "Тўғри! Натижа жадвалга ва графикка қўшилди.",
    lNo: "Жадвални яна текширинг: жадвалда йўқ баландлик учун қўшни икки қиймат орасида интерполяция қилинг.",
    needH: "Аввал крест кўринган баландликни аниқланг.", needS: "Аввал намунани танланг.",
    calT: "Калибрлаш жадвали: лойқалик баландлиги (см) → лойқалик даражаси (мг/л)",
    calNote: "Лаборатория ишидаги жадвалдаги иккита ёзув хатоси тузатилган: 9,5 см → 97,0 мг/л (67,0 эмас), 42,0 см (42,6 эмас).",
    colH: "Баландлик, см", colL: "Лойқалик, мг/л",
    graph: "«Лойқалик баландлиги — лойқалик даражаси» графиги", graphCal: "калибрлаш эгри чизиғи", graphYou: "сизнинг натижаларингиз",
    sDone: "Учала намуна ўлчанди! График ҳисоботингиз учун тайёр.",
    n1: "Тиндирилган оқова сув", n2: "Маиший оқова сув", n3: "Кимё корхонаси оқова суви",
    gT: "Тозалаш усулини танланг",
    gLead: "Ҳар бир корхона чиқинди гази учун энг мос усулни танланг. Хато қилсангиз, маслаҳатни ўқиб, яна уриниб кўринг.",
    mAbs: "Абсорбция", mAds: "Адсорбция", mCat: "Каталитик", mTerm: "Термик",
    gDone: "Барча ҳолатлар тўғри ечилди! Энди ўз шаҳрингиздаги корхона учун шундай «паспорт» тузинг.",
    gScore: "Тўғри ечилди:",
    c1: "Минерал ўғит заводи", d1: "Чиқинди газда аммиак (NH₃) кўп. У сувда жуда яхши эрийди ва уни ишлаб чиқаришга қайтариш мумкин.",
    w1: "Тўғри: NH₃ сувда яхши эрийди — насадкали абсорберда ушланиб, аммиакли сув сифатида қайтарилади (регенератив усул).",
    c2: "Бўёқ цехи", d2: "Ҳавода кам концентрацияли толуол ва ксилол буғлари бор; эритувчини қайтариб олиш фойдали.",
    w2: "Тўғри: кам концентрацияли органик буғлар фаол кўмирда яхши ушланади, буғ билан десорбция қилиб эритувчи қайтарилади.",
    c3: "Нефть маҳсулотлари омбори", d3: "Кўп компонентли, ёнувчи ва ўта заҳарли органик газлар аралашмаси; ундан фойдаланиш имкони йўқ.",
    w3: "Тўғри: мураккаб ёнувчи аралашма 900–1000 °C да ёқилиб, CO₂ ва H₂O гача оксидланади (деструктив усул).",
    c4: "Метанол цехи вентиляцияси", d4: "Ҳавода оз миқдорда метанол буғи бор; газда олтингугурт бирикмалари ва чанг йўқ.",
    w4: "Тўғри: катализатор заҳарланмайди, метанол нисбатан паст ҳароратда 2CH₃OH + 3O₂ → 2CO₂ + 4H₂O бўйича оксидланади.",
    c5: "Нитрат кислота цехи", d5: "Чиқинди газда азот оксидлари (NO, NO₂) бор.",
    w5: "Тўғри: азот оксидлари икки босқичли хемосорбция билан ушланади — сувда кислотага, ишқорда NaNO₂ ва NaNO₃ тузларига айланади.",
    c6: "Иссиқлик электр станцияси", d6: "Тутунда SO₂ кўп, газ ҳажми жуда катта.",
    w6: "Тўғри: SO₂ сувли эритмаларда яхши ютилади; ИЭСларда тутун ишқорли ёки оҳакли суспензия билан ювилади (абсорбция).",
    hAbs: "Абсорбция учун газ суюқликда яхши эриши керак. Бу ерда шундайми?",
    hAds: "Адсорбция кам концентрацияли буғларни ушлаш ва қайтариш учун қулай. Бу ҳолатга мос келадими?",
    hCat: "Каталитик усул газдан фойдаланилмаганда ва катализаторни заҳарловчи моддалар бўлмаганда қўлланилади.",
    hTerm: "Термик ёқиш газни йўқ қилади ва кўп ёқилғи сарфлайди. Бу ерда газни ушлаб, фойдаланиш мумкин эмасми?",
    goT: "Давомини амалда кўринг",
    go3dTutun: "3D лаборатория: «Тутун тарқалиши» тажрибаси",
    go3dTindir: "3D лаборатория: «Сувни тиндириш» тажрибаси",
    goTahlil: "Лаборатория хонаси → Таҳлил маркази: реал намуналарда муаллақ моддалар ва лойқалик",
    why: "амалий машғулот"
  };

  /* Калибрлаш жадвали (2-лаборатория иши), хатолари тузатилган */
  const CAL = [[5, 185], [5.5, 170], [6, 155], [6.5, 142], [7, 130], [7.5, 122], [8, 114], [8.5, 108], [9, 102], [9.5, 97], [10, 92], [10.5, 87], [11, 83], [11.5, 79], [12, 76], [12.5, 73], [13, 70],
    [13.5, 67.5], [14, 65], [14.5, 63], [15, 61], [16, 56], [17, 53.1], [18, 50.4], [19, 48], [20, 45.5], [21, 43.3], [22, 41.4], [23, 39.4], [24, 38], [25, 36.5], [26, 35.1], [27, 33.8], [28, 32.6],
    [29, 31.5], [30, 30.5], [31, 29.5], [32, 28.5], [33, 27.7], [34, 26.9], [35, 26.1], [36, 25.4], [37, 24.8], [38, 24.4], [39, 23.6], [40, 23], [41, 22.4], [42, 21.8], [43, 21.2], [44, 20.7], [45, 20.2]];
  function calAt(h) {
    if (h <= CAL[0][0]) return CAL[0][1];
    for (let i = 1; i < CAL.length; i++) {
      const [h1, l1] = CAL[i - 1], [h2, l2] = CAL[i];
      if (h <= h2) return l1 + (l2 - l1) * (h - h1) / (h2 - h1);
    }
    return CAL[CAL.length - 1][1];
  }

  const linkHtml = (kinds) => `<div class="oq-go"><b>🔗 ${esc(S.goT)}</b><div>${kinds.map((k) => k === "tahlil"
    ? `<a href="#labxona" class="oq-link" data-oq-go="tahlil"><i class="fa-solid fa-flask-vial" aria-hidden="true"></i> <span>${esc(S.goTahlil)}</span></a>`
    : `<a href="#lab3d" class="oq-link" data-oq-go="${k}"><i class="fa-solid fa-cube" aria-hidden="true"></i> <span>${esc(k === "tutun" ? S.go3dTutun : S.go3dTindir)}</span></a>`).join("")}</div></div>`;
  function bindLinks(root) {
    root.querySelectorAll("[data-oq-go]").forEach((a) => a.addEventListener("click", () => {
      const k = a.dataset.oqGo, dlg = a.closest("dialog");
      if (dlg && dlg.open) dlg.close();
      if (k === "tahlil") setTimeout(() => { const el = document.querySelector("#labxona [data-tahlil]"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 700);
      else if (window.EkoLab3D && EkoLab3D.open) EkoLab3D.open(k);
    }));
  }

  /* ---------- 1-лаборатория иши: фильтрлаш ---------- */
  const FS = [{ n: S.s1, ic: "🏠", c: 260 }, { n: S.s2, ic: "🏭", c: 640 }, { n: S.s3, ic: "✨", c: 24 }];
  const VOLS = [20, 25, 50];
  const WATER = [0.12, 0.018, 0.0021, 0.0002, 0, 0, 0];
  function filtrHtml() {
    return `<div class="oq-lab" data-pdf-skip>
      <h3>🧫 <span>${esc(S.labT)}</span></h3>
      <p class="oq-sub"><b>${esc(S.fT)}</b></p>
      <p class="small muted">${esc(S.fLead)}</p>
      <div class="oq-row">
        <figure class="oq-viz" data-viz aria-label="${esc(S.viz)}"></figure>
        <div class="oq-ctl">
          <p class="oq-lbl">${esc(S.sample)}</p>
          <div class="oq-chips">${FS.map((s, i) => `<button type="button" class="chip" data-s="${i}" aria-pressed="false">${s.ic} <span>${esc(s.n)}</span> №${i + 1}</button>`).join("")}</div>
          <p class="oq-lbl">${esc(S.volume)}</p>
          <div class="oq-chips">${VOLS.map((v) => `<button type="button" class="chip" data-v="${v}" aria-pressed="false">${v} <span>${esc(S.mlU)}</span></button>`).join("")}</div>
          <div class="oq-btns">
            <button type="button" class="btn btn-ghost btn-sm" data-act="m1">⚖️ <span>${esc(S.bW1)}</span></button>
            <button type="button" class="btn btn-ghost btn-sm" data-act="shake">🔄 <span>${esc(S.bShake)}</span></button>
            <button type="button" class="btn btn-ghost btn-sm" data-act="filt">🧫 <span>${esc(S.bFilt)}</span></button>
            <button type="button" class="btn btn-ghost btn-sm" data-act="dry">♨️ <span>${esc(S.bDry)}</span></button>
            <button type="button" class="btn btn-ghost btn-sm" data-act="reset">↺ <span>${esc(S.bReset)}</span></button>
          </div>
          <ol class="oq-log small" data-log></ol>
          <div class="oq-calc"><label><span>${esc(S.xLabel)}</span> <input data-x inputmode="decimal" size="8" aria-label="X"> <span>${esc(S.mglU)}</span></label>
            <button type="button" class="btn btn-primary btn-sm" data-act="chk">${esc(S.check)}</button></div>
          <p class="oq-msg small" data-msg aria-live="polite"></p>
        </div>
      </div>
      <div data-tab></div>
      ${linkHtml(["tahlil", "tindir"])}
    </div>`;
  }
  function filtrBind(root) {
    const box = root.querySelector(".oq-lab");
    const saved = load();
    const rows = saved.filtr || {};
    let st = null, tries = 0;
    const fresh = () => ({ s: st ? st.s : null, v: st ? st.v : null, m1: null, shaken: false, filt: false, solids: 0, w: [], m2: null });
    st = fresh();
    const $ = (q) => box.querySelector(q);
    const msg = (t, cls) => { const m = $("[data-msg]"); m.textContent = t; m.className = "oq-msg small" + (cls ? " " + cls : ""); };
    function viz() {
      const tint = st.filt ? Math.min(0.85, 0.15 + st.solids * 40) : 0;
      const reading = st.w.length ? st.w[st.w.length - 1] : st.m1;
      $("[data-viz]").innerHTML = `<svg viewBox="0 0 200 190" class="oq-svg" role="img" aria-label="${esc(S.viz)}">
        <rect x="70" y="150" width="60" height="32" rx="4" fill="#cbd5e1" stroke="currentColor"/>
        <path d="M60 20 L140 20 L108 70 L108 100 L92 100 L92 70 Z" fill="#e0f2fe" stroke="currentColor" stroke-width="1.5"/>
        <path d="M70 24 L130 24 L104 64 L96 64 Z" fill="rgb(${Math.round(250 - tint * 120)},${Math.round(245 - tint * 150)},${Math.round(235 - tint * 190)})" stroke="#94a3b8"/>
        ${st.filt ? "" : st.s != null && st.m1 != null ? `<rect x="80" y="104" width="40" height="44" rx="3" fill="${st.shaken ? "#a8a29e" : "#d6d3d1"}" opacity=".85"/>` : ""}
        <rect x="74" y="104" width="52" height="46" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
        ${st.filt ? `<rect x="76" y="128" width="48" height="20" fill="#bae6fd" opacity=".8"/>` : ""}
        <rect x="20" y="152" width="44" height="22" rx="3" fill="#0f172a"/>
        <text x="42" y="167" text-anchor="middle" font-size="10" fill="#4ade80" font-family="monospace">${reading != null ? reading.toFixed(4) : "0.0000"}</text>
        <text x="42" y="186" text-anchor="middle" font-size="9" fill="currentColor">g</text>
      </svg>`;
    }
    function log(t, val) {
      const li = document.createElement("li");
      li.innerHTML = `<span>${esc(t)}</span>${val != null ? `: <b>${fmt(val, 4)}</b> <span>${esc(S.gU)}</span>` : ""}`;
      $("[data-log]").appendChild(li);
    }
    function table() {
      const ids = Object.keys(rows).map(Number).sort();
      $("[data-tab]").innerHTML = ids.length ? `<p class="oq-lbl">${esc(S.tabRes)}</p><div class="oq-tw"><table class="oq-tab"><thead><tr><th>${esc(S.colS)}</th><th>V, <span>${esc(S.mlU)}</span></th><th>M₁, <span>${esc(S.gU)}</span></th><th>M₂, <span>${esc(S.gU)}</span></th><th>${esc(S.colX)}</th><th>${esc(S.colSt)}</th></tr></thead>
        <tbody>${ids.map((i) => { const r = rows[i]; return `<tr><td>№${i + 1} <span>${esc(FS[i].n)}</span></td><td>${r.v}</td><td>${fmt(r.m1, 4)}</td><td>${fmt(r.m2, 4)}</td><td><b>${fmt(r.x, 1)}</b></td><td>${r.ok ? `✅ <span>${esc(S.okRow)}</span>` : `⚠️ <span>${esc(S.warnRow)}</span>`}</td></tr>`; }).join("")}</tbody></table></div>` : "";
    }
    function chips() {
      box.querySelectorAll("[data-s]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.s === st.s)));
      box.querySelectorAll("[data-v]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.v === st.v)));
    }
    const restart = () => { st = fresh(); tries = 0; $("[data-log]").innerHTML = ""; $("[data-x]").value = ""; chips(); viz(); };
    box.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { st.s = +b.dataset.s; restart(); msg(""); }));
    box.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => { st.v = +b.dataset.v; restart(); msg(""); }));
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      const a = b.dataset.act;
      if (a === "reset") { restart(); msg(""); return; }
      if (a === "chk") return check();
      if (st.s == null || st.v == null) return msg(S.needSV, "bad");
      if (a === "m1") {
        if (st.m1 != null) return;
        st.m1 = Math.round((0.9 + Math.random() * 0.08) * 1e4) / 1e4;
        log(S.bW1, st.m1);
      } else if (a === "shake") {
        if (st.filt) return;
        st.shaken = true; msg(S.shaken, "ok");
      } else if (a === "filt") {
        if (st.m1 == null) return msg(S.needM1, "bad");
        if (st.filt) return;
        const c = FS[st.s].c * (0.97 + Math.random() * 0.06);
        st.solids = c * st.v / 1e6 * (st.shaken ? 1 : 0.55);
        st.filt = true;
        log(S.bFilt);
        msg(st.shaken ? S.filtered : S.noShakeWarn, st.shaken ? "ok" : "bad");
      } else if (a === "dry") {
        if (!st.filt) return msg(S.needFilt, "bad");
        if (st.m2 != null) return msg(S.alreadyConst);
        const k = st.w.length;
        const m = Math.round((st.m1 + st.solids + WATER[Math.min(k, WATER.length - 1)]) * 1e4) / 1e4;
        st.w.push(m);
        log(k === 0 ? S.airDry : S.ovenDry, m);
        if (k > 0 && Math.abs(m - st.w[k - 1]) < 0.0005) {
          st.m2 = m; msg(S.constOk, "ok");
          if (st.m2 - st.m1 < 0.001) msg(S.constOk + " " + S.small, "ok");
        }
      }
      viz();
    });
    function check() {
      if (st.m2 == null) return msg(S.needM2, "bad");
      const x = num($("[data-x]").value);
      const exp = (st.m2 - st.m1) * 1000 / (st.v / 1000);
      if (isFinite(x) && Math.abs(x - exp) <= Math.max(1, exp * 0.02)) {
        rows[st.s] = { v: st.v, m1: st.m1, m2: st.m2, x: exp, ok: st.shaken };
        saved.filtr = rows; store(saved); table();
        msg(st.shaken ? S.xOk : S.noShakeWarn, st.shaken ? "ok" : "bad");
        if ([0, 1, 2].every((i) => rows[i] && rows[i].ok)) { msg(S.fDone, "ok"); once("oq_filtr", 15, S.why); }
        return;
      }
      tries++;
      msg(tries >= 2 ? `${S.xHint} X = (${fmt(st.m2, 4)} − ${fmt(st.m1, 4)}) · 1000 / ${fmt(st.v / 1000, 3)}` : S.xNo, "bad");
    }
    viz(); table();
  }

  /* ---------- 2-лаборатория иши: Снеллен ---------- */
  const SN = [{ n: S.n1, ic: "💧", h: 27 }, { n: S.n2, ic: "🏠", h: 14 }, { n: S.n3, ic: "🏭", h: 7.5 }];
  const HMAX = 46;
  function snellenHtml() {
    return `<div class="oq-lab" data-pdf-skip>
      <h3>🔭 <span>${esc(S.labT)}</span></h3>
      <p class="oq-sub"><b>${esc(S.sT)}</b></p>
      <p class="small muted">${esc(S.sLead)}</p>
      <div class="oq-chips">${SN.map((s, i) => `<button type="button" class="chip" data-s="${i}" aria-pressed="false">${s.ic} <span>${esc(s.n)}</span> №${i + 1}</button>`).join("")}</div>
      <div class="oq-row oq-row-sn">
        <div class="oq-viz oq-sn" data-viz></div>
        <div class="oq-ctl">
          <p class="oq-read"><span>${esc(S.col)}</span> <b data-h>—</b> <span>${esc(S.cmU)}</span></p>
          <div class="oq-btns">
            <button type="button" class="btn btn-ghost btn-sm" data-act="fill">💧 <span>${esc(S.fill)}</span></button>
            <button type="button" class="btn btn-ghost btn-sm" data-act="d05">⬇ <span>${esc(S.drain05)}</span></button>
            <button type="button" class="btn btn-ghost btn-sm" data-act="d2">⏬ <span>${esc(S.drain2)}</span></button>
            <button type="button" class="btn btn-primary btn-sm" data-act="seen">👁 <span>${esc(S.seen)}</span></button>
          </div>
          <div class="oq-calc"><label><span>${esc(S.lLabel)}</span> <input data-l inputmode="decimal" size="7" aria-label="L"> <span>${esc(S.mglU)}</span></label>
            <button type="button" class="btn btn-primary btn-sm" data-act="chk">${esc(S.check)}</button></div>
          <p class="oq-msg small" data-msg aria-live="polite"></p>
        </div>
      </div>
      <details class="oq-cal"><summary>${esc(S.calT)}</summary>
        <div class="oq-tw"><table class="oq-tab oq-caltab"><thead><tr>${[0, 1, 2].map(() => `<th>${esc(S.colH)}</th><th>${esc(S.colL)}</th>`).join("")}</tr></thead><tbody>${Array.from({ length: 17 }, (_, r) => `<tr>${[0, 1, 2].map((c) => { const p = CAL[c * 17 + r]; return p ? `<td data-ch="${p[0]}">${fmt(p[0], 1)}</td><td data-ch="${p[0]}">${fmt(p[1], 1)}</td>` : "<td></td><td></td>"; }).join("")}</tr>`).join("")}</tbody></table></div>
        <p class="small muted">${esc(S.calNote)}</p>
      </details>
      <div data-tab></div>
      <figure class="oq-graph" data-graph></figure>
      ${linkHtml(["tahlil", "tindir"])}
    </div>`;
  }
  function snellenBind(root) {
    const box = root.querySelector(".oq-lab");
    const saved = load();
    const rows = saved.snellen || {};
    let s = null, h = null, rec = null;
    const $ = (q) => box.querySelector(q);
    const msg = (t, cls) => { const m = $("[data-msg]"); m.textContent = t; m.className = "oq-msg small" + (cls ? " " + cls : ""); };
    function viz() {
      const tgt = s == null ? null : SN[s].h;
      const turb = tgt == null ? 0 : calAt(tgt);
      const hh = h == null ? 0 : h;
      const vis = tgt == null || h == null ? 0 : Math.max(0, Math.min(1, (tgt + 2.5 - hh) / 2.5));
      const cross = Math.pow(vis, 1.6);
      const k = 6, y0 = 300, ytop = y0 - HMAX * k;
      const water = `rgba(${120 + Math.round(turb * 0.3)},${110 + Math.round(turb * 0.1)},${60},${Math.min(0.85, 0.12 + turb / 230)})`;
      let ticks = "";
      for (let c = 0; c <= HMAX; c++) {
        const y = y0 - c * k;
        ticks += `<line x1="${c % 5 ? 70 : 64}" y1="${y}" x2="76" y2="${y}" stroke="currentColor" stroke-width=".7"/>`;
        if (c % 5 === 0) ticks += `<text x="60" y="${y + 3}" text-anchor="end" font-size="8" fill="currentColor">${c}</text>`;
      }
      $("[data-viz]").innerHTML = `<svg viewBox="0 0 250 320" class="oq-svg" role="img" aria-label="Снеллен">
        <text x="98" y="12" text-anchor="middle" font-size="9" fill="currentColor">${esc(S.side)}</text>
        ${ticks}
        <rect x="78" y="${ytop}" width="40" height="${HMAX * k}" rx="4" fill="#f8fafc" stroke="currentColor" stroke-width="1.5"/>
        ${h != null ? `<rect x="80" y="${y0 - hh * k}" width="36" height="${hh * k}" fill="${water}"/>` : ""}
        <path d="M90 ${y0 - 4} h16 M98 ${y0 - 10} v12" stroke="#0f172a" stroke-width="2.5"/>
        <path d="M118 ${y0 - 2} h14 v10" stroke="currentColor" stroke-width="2" fill="none"/>
        <text x="190" y="40" text-anchor="middle" font-size="9" fill="currentColor">${esc(S.top)}</text>
        <circle cx="190" cy="90" r="38" fill="#ffffff" stroke="currentColor" stroke-width="1.5"/>
        <g opacity="${cross.toFixed(2)}"><path d="M170 90 h40 M190 70 v40" stroke="#0f172a" stroke-width="6"/></g>
        ${h != null ? `<circle cx="190" cy="90" r="37" fill="${water}" opacity="${(1 - cross * 0.8).toFixed(2)}"/>` : ""}
      </svg>`;
      $("[data-h]").textContent = h == null ? "—" : fmt(h, 1);
    }
    function table() {
      const ids = Object.keys(rows).map(Number).sort();
      $("[data-tab]").innerHTML = ids.length ? `<p class="oq-lbl">${esc(S.tabRes)}</p><div class="oq-tw"><table class="oq-tab"><thead><tr><th>${esc(S.colS)}</th><th>${esc(S.colH)}</th><th>${esc(S.colL)}</th></tr></thead>
        <tbody>${ids.map((i) => `<tr><td>№${i + 1} <span>${esc(SN[i].n)}</span></td><td>${fmt(rows[i].h, 1)}</td><td><b>${fmt(rows[i].l, 1)}</b></td></tr>`).join("")}</tbody></table></div>` : "";
      graph();
    }
    function graph() {
      const X = (hc) => 40 + (hc - 5) * (260 / 40), Y = (l) => 170 - (l / 190) * 150;
      const pts = CAL.map(([a, b]) => `${X(a).toFixed(1)},${Y(b).toFixed(1)}`).join(" ");
      const ids = Object.keys(rows).map(Number);
      let ax = "";
      for (let c = 5; c <= 45; c += 5) ax += `<line x1="${X(c)}" y1="170" x2="${X(c)}" y2="174" stroke="currentColor"/><text x="${X(c)}" y="184" text-anchor="middle" font-size="8" fill="currentColor">${c}</text>`;
      for (let l = 0; l <= 180; l += 30) ax += `<line x1="36" y1="${Y(l)}" x2="40" y2="${Y(l)}" stroke="currentColor"/><text x="33" y="${Y(l) + 3}" text-anchor="end" font-size="8" fill="currentColor">${l}</text>`;
      $("[data-graph]").innerHTML = `<figcaption class="small"><b>📈 <span>${esc(S.graph)}</span></b></figcaption>
        <svg viewBox="0 0 320 200" class="oq-svg oq-gsvg" role="img" aria-label="${esc(S.graph)}">
          <line x1="40" y1="170" x2="305" y2="170" stroke="currentColor"/><line x1="40" y1="12" x2="40" y2="170" stroke="currentColor"/>${ax}
          <text x="300" y="196" text-anchor="end" font-size="8" fill="currentColor">T, ${esc(S.cmU)}</text>
          <text x="44" y="10" font-size="8" fill="currentColor">L, ${esc(S.mglU)}</text>
          <polyline points="${pts}" fill="none" stroke="#0ea5e9" stroke-width="2"/>
          ${ids.map((i) => `<circle cx="${X(rows[i].h).toFixed(1)}" cy="${Y(rows[i].l).toFixed(1)}" r="5" fill="#f59e0b" stroke="#7c2d12"/><text x="${(X(rows[i].h) + 7).toFixed(1)}" y="${(Y(rows[i].l) - 6).toFixed(1)}" font-size="9" fill="currentColor">№${i + 1}</text>`).join("")}
        </svg>
        <p class="small muted"><span class="oq-k" style="background:#0ea5e9"></span> <span>${esc(S.graphCal)}</span> · <span class="oq-k" style="background:#f59e0b"></span> <span>${esc(S.graphYou)}</span></p>`;
    }
    function mark() {
      box.querySelectorAll("[data-ch]").forEach((td) => td.classList.toggle("on", rec != null && Math.abs(+td.dataset.ch - rec) < 0.26));
    }
    box.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => {
      s = +b.dataset.s; h = HMAX; rec = null; $("[data-l]").value = "";
      box.querySelectorAll("[data-s]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      msg(""); mark(); viz();
    }));
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      const a = b.dataset.act;
      if (s == null) return msg(S.needS, "bad");
      if (a === "fill") { h = HMAX; rec = null; msg(""); }
      else if (a === "d05" || a === "d2") { if (rec != null) return; h = Math.max(0, h - (a === "d05" ? 0.5 : 2)); }
      else if (a === "seen") {
        const tgt = SN[s].h;
        if (h > tgt + 0.5) msg(S.tooEarly, "bad");
        else if (h < tgt - 0.5) msg(S.tooLate, "bad");
        else { rec = h; msg(S.hOk, "ok"); }
        mark();
      } else if (a === "chk") {
        if (rec == null) return msg(S.needH, "bad");
        const l = num($("[data-l]").value), exp = calAt(rec);
        if (isFinite(l) && Math.abs(l - exp) <= Math.max(0.5, exp * 0.02)) {
          rows[s] = { h: rec, l: Math.round(exp * 10) / 10 };
          saved.snellen = rows; store(saved); table();
          msg(S.lOk, "ok");
          if ([0, 1, 2].every((i) => rows[i])) { msg(S.sDone, "ok"); once("oq_snellen", 15, S.why); }
        } else msg(S.lNo, "bad");
        return;
      }
      viz();
    });
    viz(); table();
  }

  /* ---------- 7-маъруза: усулни танлаш ---------- */
  const M = [["abs", "💧", S.mAbs, S.hAbs], ["ads", "🧱", S.mAds, S.hAds], ["cat", "⚗️", S.mCat, S.hCat], ["term", "🔥", S.mTerm, S.hTerm]];
  const GC = [["🧪", S.c1, S.d1, "abs", S.w1], ["🎨", S.c2, S.d2, "ads", S.w2], ["🛢️", S.c3, S.d3, "term", S.w3], ["🔬", S.c4, S.d4, "cat", S.w4], ["🧨", S.c5, S.d5, "abs", S.w5], ["🏭", S.c6, S.d6, "abs", S.w6]];
  function gazHtml() {
    return `<div class="oq-lab" data-pdf-skip>
      <h3>⚗️ <span>${esc(S.labT)}</span></h3>
      <p class="oq-sub"><b>${esc(S.gT)}</b></p>
      <p class="small muted">${esc(S.gLead)}</p>
      <ol class="oq-cases">${GC.map(([ic, n, d], i) => `<li data-c="${i}"><p><b>${ic} <span>${esc(n)}</span></b><br><span>${esc(d)}</span></p>
        <div class="oq-chips">${M.map(([k, mi, mn]) => `<button type="button" class="chip" data-m="${k}" aria-pressed="false">${mi} <span>${esc(mn)}</span></button>`).join("")}</div>
        <p class="oq-msg small" aria-live="polite"></p></li>`).join("")}</ol>
      <p class="oq-read"><span>${esc(S.gScore)}</span> <b data-score>0</b> / ${GC.length}</p>
      ${linkHtml(["tutun"])}
    </div>`;
  }
  function gazBind(root) {
    const box = root.querySelector(".oq-lab");
    const saved = load();
    const ok = saved.gaz || {};
    const paint = () => {
      box.querySelectorAll("[data-c]").forEach((li) => {
        const i = +li.dataset.c;
        if (ok[i]) {
          li.classList.add("ok");
          li.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.m === GC[i][3])));
          li.querySelector(".oq-msg").textContent = GC[i][4];
        }
      });
      box.querySelector("[data-score]").textContent = Object.keys(ok).length;
    };
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-m]"); if (!b) return;
      const li = b.closest("[data-c]"), i = +li.dataset.c, m = li.querySelector(".oq-msg");
      li.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      if (b.dataset.m === GC[i][3]) {
        ok[i] = true; saved.gaz = ok; store(saved);
        li.classList.remove("bad"); li.classList.add("ok"); m.textContent = GC[i][4];
        if (GC.every((_, k) => ok[k])) { toast("🏅 " + S.gDone); once("oq_gaz", 10, S.why); }
      } else {
        li.classList.remove("ok"); li.classList.add("bad");
        m.textContent = M.find((x) => x[0] === b.dataset.m)[3];
      }
      box.querySelector("[data-score]").textContent = Object.keys(ok).length;
    });
    paint();
  }

  const KINDS = {
    filtr: [filtrHtml, filtrBind],
    snellen: [snellenHtml, snellenBind],
    gaz: [gazHtml, gazBind],
    tutun: [() => `<div class="oq-lab oq-only" data-pdf-skip>${linkHtml(["tutun"])}</div>`, (r) => r],
    tahlil: [() => `<div class="oq-lab oq-only" data-pdf-skip>${linkHtml(["tahlil", "tindir"])}</div>`, (r) => r]
  };
  window.EkoOqovaLab = {
    S, CAL, calAt,
    html: (k) => (KINDS[k] ? `<div class="oq-host" data-oq="${esc(k)}">${KINDS[k][0]()}</div>` : ""),
    bind: (root) => {
      root.querySelectorAll("[data-oq]").forEach((host) => {
        const k = KINDS[host.dataset.oq]; if (!k) return;
        k[1](host); bindLinks(host);
      });
    }
  };
})();
