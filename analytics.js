/* Экомун — барча фойдаланувчилар таҳлили ва юклаб олинадиган ҳисобот (PDF / Word).
   server.js томонидан ишлатилади: require("./analytics")(ctx) → { compute, document }.

   Ҳар бир одам — рўйхатдан ўтган ҳисоб (u:…) ёки ҳисобсиз қурилма (v:…). Улар учун:
   фаоллик (ташриф, вақт, фаол кунлар), ўқиш (дарслар, тест, якуний тест, сертификат), босқич,
   ёш, ҳудуд, қурилма, PRO ва сегмент (фаол / сусайган / кетиш хавфи / нофаол) ҳисобланади.
   Фаоллик балли 0–100: фаол кунлар 30, вақт 20, тугатилган дарслар 25, тўғри жавоблар 15, ютуқлар 10. */
"use strict";

const report = require("./report");

const DAY = 864e5;
const SEGMENTS = {
  faol: "Фаол (7 кун ичида)",
  susaygan: "Сусайган (8–30 кун)",
  xavf: "Кетиш хавфи (31–90 кун)",
  nofaol: "Нофаол (90 кундан кўп / кирмаган)"
};
const STAGE = { maktab: "Мактаб", uni: "Университет", "": "Профилсиз" };
const KIND = { acc: "Ҳисоби бор", guest: "Меҳмон (қурилма)" };
const SCORE_BANDS = ["0–19", "20–39", "40–59", "60–79", "80–100"];
const COURSES = { kichik: "Кичик эколог", yosh: "Ёш тадқиқотчи", tabiat: "Табиат сирлари", steam: "Эко-STEAM лойиҳачи", asoslar: "Экология асослари", korxona: "Корхонада экологик менежмент",
  talaba: "Барқарор ривожланиш", suvhavo: "Сув ва ҳаво", biotoza: "Микроблар сувни тозалайди", monitoring: "Экологик мониторинг", iqlim: "Иқлим ўзгаришини бошқариш",
  qayta: "Қайта ишлаш", ekologiya: "Экология", qollanma: "Амалий қўлланмалар", tadqiqot: "Илмий тадқиқот методологияси", litosfera: "Литосферани ҳимоя қилиш", yerqalqon: "Ер қалқони",
  xalqaro: "Халқаро экологик тажриба", dunyo: "Дунё бўйлаб эко-саёҳат" };
const SECTIONS = { bosh: "Бош саҳифа", kurslar: "Курслар", onlayn: "Онлайн дарсликлар", monografiya: "Сув ва ҳаво", krossvord: "Кроссвордлар", kutubxona: "Кутубхона",
  yangiliklar: "Янгиликлар", adabiyot: "Хорижий адабиёт", sayohat: "Эко-саёҳат", oyinlar: "Ўйинлар", dunyo3d: "3D Эко-дунё", lab3d: "3D лаборатория", lab: "Лаборатория",
  vlab: "Виртуал лаборатория", ilmiy: "Илмий лаборатория", loyiha: "Лойиҳалар", chellenj: "Челленж", hashar: "Ҳашар", ekokoz: "Эко-кўз", xarita: "Эко-харита",
  oyinmarkaz: "Ўйин маркази", takror: "Такрорлаш хонаси", video: "Видео дарслар", fikr: "Фикр-мулоҳаза", sorov: "Сўровнома", internet: "Онлайн маълумотлар", havo: "Ҳаво сифати",
  kalkulyator: "Калькулятор", yordamchi: "Ёрдамчи", maktab: "Мактаб (синф)", qonun: "Экологик ҳуқуқ", pro: "PRO", agent: "AI агент" };
const courseName = (c) => COURSES[c] || c;
const secName = (k) => SECTIONS[k] || k;

module.exports = function analytics(ctx) {
  const { db, now, placeOf, geoOf, deviceParts, proActive, STATS_TZ_MS, AGE_BANDS, EXAM_PASS } = ctx;

  const bandOfAge = (age) => {
    if (!age || age < 5) return "";
    const lim = [[7, "5–7"], [10, "8–10"], [13, "11–13"], [15, "14–15"], [17, "16–17"], [24, "18–24"], [34, "25–34"], [44, "35–44"], [60, "45–60"]];
    const f = lim.find(([m]) => age <= m);
    return f ? f[1] : "60+";
  };
  const ageOf = (u) => { if (!u || !u.by) return 0; const d = new Date(); return d.getFullYear() - u.by - (d.getMonth() + 1 <= (u.bm || 1) ? 1 : 0); };
  const regionOf = (ip) => {
    const g = geoOf(ip);
    return !g ? "Аниқланмоқда" : g.local ? "Локал тармоқ" : g.err ? "Номаълум" : g.cc === "UZ" ? g.region || "Ўзбекистон" : g.country || "Номаълум";
  };
  const segOf = (last, t) => (!last ? "nofaol" : t - last <= 7 * DAY ? "faol" : t - last <= 30 * DAY ? "susaygan" : t - last <= 90 * DAY ? "xavf" : "nofaol");
  const dayKey = (x) => new Date(x + STATS_TZ_MS).toISOString().slice(0, 10);

  function scoreOf(p, days) {
    const span = Math.max(1, Math.min(days, 30));
    const a = Math.min(1, p.activeDays / Math.max(1, span / 3)) * 30;
    const tm = Math.min(1, p.secs / 7200) * 20;
    const ln = Math.min(1, p.done / 10) * 25;
    const q = p.qaPct == null ? 0 : (p.qaPct / 100) * 15 * Math.min(1, p.qaN / 10);
    const ach = Math.min(1, (p.examsPassed + p.certs) / 2) * 10;
    return Math.round(a + tm + ln + q + ach);
  }

  /* filters: { stage: "maktab"|"uni"|"", kind: "acc"|"guest"|"", seg: SEGMENTS калити | "", q: қидирув } */
  function compute(days, filters = {}) {
    const t = now(), from = t - days * DAY;
    const people = new Map();
    const usersById = new Map(db.users.map((u) => [u.id, u]));
    const get = (key, init) => { let p = people.get(key); if (!p) people.set(key, (p = init())); return p; };
    const blank = (key, u, vid) => ({
      key, userId: u ? u.id : null, vid: vid || "", first: 0, last: 0, visitsAll: 0, visits: 0, secs: 0, days: new Set(),
      stage: "", ag: "", lang: "", ip: "", device: "", sec: {}, opened: new Set(), done: new Set(), qaOk: 0, qaN: 0, exams: {}, devices: new Set()
    });
    /* 1) Ҳисоблар (ҳеч кирмаганлари ҳам рўйхатда бўлсин) */
    for (const u of db.users) get("u:" + u.id, () => blank("u:" + u.id, u, ""));
    /* 2) Ташрифлар */
    for (const v of db.visits) {
      const u = v.userId ? usersById.get(v.userId) : null;
      const key = u ? "u:" + u.id : "v:" + v.vid;
      const p = get(key, () => blank(key, u, v.vid));
      if (!p.vid) p.vid = v.vid;
      p.devices.add(v.vid);
      p.visitsAll++;
      if (!p.first || v.start < p.first) p.first = v.start;
      if (v.last >= p.last) { p.last = v.last; p.ip = v.ip; p.device = v.device; }
      if (v.stage) p.stage = v.stage;
      if (v.ag) p.ag = v.ag;
      if (v.lang) p.lang = v.lang;
      if (v.start < from && v.last < from) continue;
      p.visits++;
      const secs = Object.values(v.sec || {}).reduce((a, b) => a + b, 0);
      p.secs += secs;
      p.days.add(dayKey(v.start));
      for (const [k, s] of Object.entries(v.sec || {})) p.sec[k] = (p.sec[k] || 0) + s;
      for (const k of v.lessons || []) p.opened.add(k);
      for (const [k] of v.done || []) p.done.add(k);
      for (const [, ok] of v.qa || []) { p.qaN++; if (ok) p.qaOk++; }
      for (const [cid, pct] of v.ex || []) { const e = p.exams[cid] || (p.exams[cid] = { best: 0, tries: 0 }); e.tries++; e.best = Math.max(e.best, pct); }
    }
    const certsBy = new Map();
    for (const c of db.certs) if (c.userId) certsBy.set(c.userId, (certsBy.get(c.userId) || 0) + 1);

    /* 3) Ҳар бир одам учун якуний қатор */
    let rows = [];
    for (const p of people.values()) {
      const u = p.userId ? usersById.get(p.userId) : null;
      const age = u ? ageOf(u) : 0;
      const exams = Object.entries(p.exams).map(([cid, e]) => ({ cid, best: e.best, tries: e.tries }));
      const last = Math.max(p.last, u ? u.lastLogin || 0 : 0);
      const dp = deviceParts(String(p.device || ""));
      const r = {
        key: p.key, userId: p.userId, vid: p.vid, kind: u ? "acc" : "guest",
        name: u ? u.name : "", email: u ? u.email : "",
        age, ag: (u && bandOfAge(age)) || p.ag || "", stage: p.stage || (u && age ? (age >= 16 ? "uni" : "maktab") : ""), lang: p.lang,
        place: placeOf(p.ip), region: p.ip ? regionOf(p.ip) : "Номаълум", device: p.device, devType: p.device ? dp.type || "Номаълум" : "Номаълум", os: dp.os || "",
        registered: u ? u.createdAt : 0, first: p.first || (u ? u.createdAt : 0), last, loginCount: u ? u.loginCount || 0 : 0,
        visitsAll: p.visitsAll, visits: p.visits, secs: p.secs, activeDays: p.days.size, devices: p.devices.size,
        opened: p.opened.size, done: p.done.size, qaOk: p.qaOk, qaN: p.qaN, qaPct: p.qaN ? Math.round((p.qaOk / p.qaN) * 100) : null,
        exams, examBest: exams.length ? Math.max(...exams.map((e) => e.best)) : null, examsPassed: exams.filter((e) => e.best >= EXAM_PASS).length,
        certs: u ? certsBy.get(u.id) || 0 : 0, pro: !!(u && proActive(u)), adult: !!(u && u.adult), blocked: !!(u ? u.blocked : db.blockedVids[p.vid]) || !!(p.ip && db.blockedIps[p.ip]),
        approved: u ? u.approved || 0 : 0,
        top: Object.entries(p.sec).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k),
        isNew: !!(p.first || (u && u.createdAt)) && (p.first || u.createdAt) >= from
      };
      r.seg = segOf(last, t);
      r.score = scoreOf(r, days);
      rows.push(r);
    }
    /* Фақат даврга алоқадор одамлар: ҳисоблар доим, меҳмонлар — даврда кирганлари */
    rows = rows.filter((r) => r.kind === "acc" || r.visits > 0);
    const allCount = rows.length;
    const q = String(filters.q || "").trim().toLowerCase();
    rows = rows.filter((r) => (!filters.stage || r.stage === filters.stage) && (!filters.kind || r.kind === filters.kind) && (!filters.seg || r.seg === filters.seg) &&
      (!q || `${r.name} ${r.email} ${r.vid} ${r.place} ${r.device}`.toLowerCase().includes(q)));
    rows.sort((a, b) => b.score - a.score || b.last - a.last);

    /* 4) Йиғма кўрсаткичлар */
    const count = (fn) => { const o = {}; for (const r of rows) { const k = fn(r); if (k != null) o[k] = (o[k] || 0) + 1; } return o; };
    const sum = (fn) => rows.reduce((a, r) => a + (fn(r) || 0), 0);
    const acc = rows.filter((r) => r.kind === "acc");
    const n = rows.length || 1;
    const dayList = [];
    for (let i = days - 1; i >= 0; i--) dayList.push(dayKey(t - i * DAY));
    const daily = Object.fromEntries(dayList.map((d) => [d, { d, accounts: 0, guests: 0, active: 0 }]));
    for (const r of rows) {
      const f = r.kind === "acc" ? r.registered : r.first;
      const d = f >= from && daily[dayKey(f)];
      if (d) r.kind === "acc" ? d.accounts++ : d.guests++;
    }
    /* Ҳар куни нечта одам фаол бўлди */
    const keys = new Set(rows.map((r) => r.key));
    const activeByDay = {};
    for (const v of db.visits) {
      if (v.start < from) continue;
      const key = v.userId && usersById.has(v.userId) ? "u:" + v.userId : "v:" + v.vid;
      if (!keys.has(key)) continue;
      const d = dayKey(v.start);
      (activeByDay[d] || (activeByDay[d] = new Set())).add(key);
    }
    for (const [d, s] of Object.entries(activeByDay)) if (daily[d]) daily[d].active = s.size;
    const scoreBands = Object.fromEntries(SCORE_BANDS.map((b) => [b, 0]));
    for (const r of rows) scoreBands[SCORE_BANDS[Math.min(4, Math.floor(r.score / 20))]]++;
    const courses = {};
    for (const r of rows) for (const e of r.exams) { const c = courses[e.cid] || (courses[e.cid] = { cid: e.cid, people: 0, sum: 0, passed: 0 }); c.people++; c.sum += e.best; if (e.best >= EXAM_PASS) c.passed++; }
    const funnel = [
      ["all", "Жами (ҳисоб ва меҳмонлар)", rows.length],
      ["acc", "Ҳисоб очди", acc.length],
      ["lesson", "Дарс очди", rows.filter((r) => r.opened > 0 || r.done > 0).length],
      ["done", "Камида 1 дарс тугатди", rows.filter((r) => r.done > 0).length],
      ["exam", "Якуний тест топширди", rows.filter((r) => r.exams.length).length],
      ["pass", `Тестдан ўтди (${EXAM_PASS}%+)`, rows.filter((r) => r.examsPassed > 0).length],
      ["cert", "Сертификат олди", rows.filter((r) => r.certs > 0).length]
    ].map(([k, l, v]) => ({ k, l, n: v }));
    const ages = count((r) => r.ag || "Номаълум");
    const agesSorted = Object.fromEntries([...AGE_BANDS, "Номаълум"].filter((k) => ages[k]).map((k) => [k, ages[k]]));
    const risk = acc.filter((r) => r.seg === "xavf" || (r.seg === "susaygan" && r.score >= 20)).sort((a, b) => b.score - a.score || b.last - a.last).slice(0, 30);

    const totals = {
      people: rows.length, all: allCount, accounts: acc.length, guests: rows.length - acc.length,
      newPeople: rows.filter((r) => r.isNew).length, newAccounts: acc.filter((r) => r.registered >= from).length,
      faol: rows.filter((r) => r.seg === "faol").length, pro: acc.filter((r) => r.pro).length, adult: acc.filter((r) => r.adult).length,
      blocked: rows.filter((r) => r.blocked).length, avgScore: rows.length ? Math.round(sum((r) => r.score) / n) : 0,
      secs: sum((r) => r.secs), avgSecs: rows.length ? Math.round(sum((r) => r.secs) / n) : 0, visits: sum((r) => r.visits),
      done: sum((r) => r.done), qaN: sum((r) => r.qaN), qaPct: sum((r) => r.qaN) ? Math.round((sum((r) => r.qaOk) / sum((r) => r.qaN)) * 100) : null,
      certs: sum((r) => r.certs), learners: rows.filter((r) => r.done > 0).length
    };
    const out = {
      now: t, days, from, filters: { stage: filters.stage || "", kind: filters.kind || "", seg: filters.seg || "", q: filters.q || "" }, pass: EXAM_PASS,
      totals,
      segments: Object.fromEntries(Object.keys(SEGMENTS).map((k) => [k, rows.filter((r) => r.seg === k).length])),
      stages: count((r) => r.stage || ""), kinds: count((r) => r.kind), ages: agesSorted, regions: count((r) => r.region), devTypes: count((r) => r.devType),
      os: count((r) => r.os || "Номаълум"), scoreBands,
      daily: dayList.map((d) => daily[d]),
      funnel,
      courses: Object.values(courses).map((c) => ({ cid: c.cid, name: courseName(c.cid), people: c.people, avg: Math.round(c.sum / c.people), passPct: Math.round((c.passed / c.people) * 100) })).sort((a, b) => b.people - a.people),
      top: rows.slice(0, 20), risk,
      people: rows.slice(0, 2000)
    };
    out.insights = insights(out);
    return out;
  }

  function insights(a) {
    const t = a.totals, out = [], pct = (x, y) => (y ? Math.round((x / y) * 100) : 0);
    if (!t.people) return ["Танланган давр ва филтр бўйича фойдаланувчи йўқ."];
    out.push(`Жами ${t.people} та фойдаланувчи таҳлил қилинди: ${t.accounts} та ҳисоб ва ${t.guests} та меҳмон қурилма.`);
    out.push(`Сўнгги 7 кунда фаол бўлганлар — ${a.segments.faol} та (${pct(a.segments.faol, t.people)}%). Кетиш хавфидагилар — ${a.segments.xavf} та, нофаол — ${a.segments.nofaol} та.`);
    if (t.newPeople) out.push(`Танланган даврда ${t.newPeople} та янги фойдаланувчи келди, улардан ${t.newAccounts} таси ҳисоб очди.`);
    if (t.guests && t.accounts) out.push(`Фойдаланувчилар орасида ҳисоб очганлар улуши — ${pct(t.accounts, t.people)}%. ${pct(t.accounts, t.people) < 20 ? "Бу паст: сертификат ва натижаларни сақлаш учун ҳисоб очишни кўпроқ тавсия этиш керак." : ""}`.trim());
    const f = a.funnel, les = f.find((x) => x.k === "lesson").n, done = f.find((x) => x.k === "done").n;
    if (les) out.push(`Дарс очганларнинг ${pct(done, les)}% и камида битта дарсни охиригача ўқиди.`);
    if (t.qaPct != null) out.push(`Тест саволларига тўғри жавоблар улуши — ${t.qaPct}% (${t.qaN} та жавоб).`);
    const rg = Object.entries(a.regions).filter(([k]) => !/Аниқланмоқда|Номаълум|Локал/.test(k)).sort((x, y) => y[1] - x[1]);
    if (rg.length) out.push(`Энг кўп фойдаланувчи: ${rg.slice(0, 3).map(([k, v]) => `${k} (${v})`).join(", ")}.`);
    const st = a.stages;
    if ((st.maktab || 0) + (st.uni || 0)) out.push(`Босқичлар: мактаб — ${st.maktab || 0}, университет — ${st.uni || 0}${st[""] ? `, профилсиз — ${st[""]}` : ""}.`);
    const dv = a.devTypes, dvt = Object.values(dv).reduce((x, y) => x + y, 0);
    if (dv["Телефон"]) out.push(`Фойдаланувчиларнинг ${pct(dv["Телефон"], dvt)}% и телефондан киради — мобил кўриниш устувор бўлиши керак.`);
    if (t.accounts) out.push(`PRO обуначилар — ${t.pro} та (ҳисобларнинг ${pct(t.pro, t.accounts)}%).`);
    out.push(`Ўртача фаоллик балли — ${t.avgScore} / 100. ${t.avgScore < 30 ? "Қайтиш учун эслатма, кунлик челленж ва ҳафталик турнирни фаолроқ эълон қилиш тавсия этилади." : "Яхши кўрсаткич."}`);
    if (a.risk.length) out.push(`${a.risk.length} та ҳисоб илгари фаол бўлиб, ҳозир сусайган — уларга эълон ёки хабар орқали мурожаат қилиш мумкин (рўйхат ҳисоботда).`);
    return out;
  }

  /* ---------- PDF / Word учун ҳужжат ---------- */
  const fmtDate = (x) => (x ? new Date(x + STATS_TZ_MS).toISOString().slice(0, 16).replace("T", " ").replace(/^(\d{4})-(\d\d)-(\d\d)/, "$3.$2.$1") : "—");
  const fmtDay = (x) => (x ? fmtDate(x).slice(0, 10) : "—");
  const dur = (s) => { s = Math.round(s || 0); if (s < 60) return s + " с"; const m = Math.round(s / 60); return m < 60 ? m + " дақ" : Math.floor(m / 60) + " соат " + (m % 60) + " дақ"; };
  const who = (r) => (r.kind === "acc" ? r.name || "—" : "Меҳмон " + String(r.vid).slice(0, 8));
  const barsOf = (obj, names = {}, limit = 12) => {
    const total = Object.values(obj).reduce((x, y) => x + y, 0) || 1;
    return Object.entries(obj).sort((x, y) => y[1] - x[1]).slice(0, limit).map(([k, v]) => ({ n: names[k] != null ? names[k] : k || "—", v, label: `${v} · ${Math.round((v / total) * 100)}%` }));
  };

  function document(a, opts = {}) {
    const t = a.totals, f = a.filters;
    const filt = [f.stage ? "босқич: " + STAGE[f.stage] : "", f.kind ? KIND[f.kind] : "", f.seg ? SEGMENTS[f.seg] : "", f.q ? `қидирув: «${f.q}»` : ""].filter(Boolean).join(", ") || "йўқ (ҳамма фойдаланувчилар)";
    const created = fmtDate(a.now);
    const maxRows = opts.maxRows || 500;
    const blocks = [
      { t: "h1", text: "1. Асосий кўрсаткичлар" },
      { t: "kpis", items: [
        [t.people, "жами фойдаланувчи"], [t.accounts, "рўйхатдан ўтган ҳисоб"], [t.guests, "меҳмон қурилма"], [t.newPeople, `янги (${a.days} кунда)`],
        [a.segments.faol, "фаол (сўнгги 7 кун)"], [t.pro, "PRO обуначи"], [t.avgScore + " / 100", "ўртача фаоллик балли"], [dur(t.avgSecs), "бир кишига ўртача вақт"],
        [t.done, "тугатилган дарс"], [t.qaPct == null ? "—" : t.qaPct + "%", "тўғри жавоблар"], [t.certs, "сертификат"], [t.blocked, "блокланган"]
      ] },
      { t: "h1", text: "2. Хулоса ва тавсиялар" },
      { t: "list", items: a.insights },
      { t: "h1", text: "3. Фаоллик сегментлари" },
      { t: "p", text: "Охирги фаолликка қараб: фаол — сўнгги 7 кунда кирган, сусайган — 8–30 кун олдин, кетиш хавфи — 31–90 кун олдин, нофаол — 90 кундан кўп ёки умуман кирмаган.", muted: true },
      { t: "bars", items: barsOf(a.segments, SEGMENTS) },
      { t: "h2", text: "Фаоллик балли бўйича тақсимот" },
      { t: "bars", items: SCORE_BANDS.map((b) => ({ n: b + " балл", v: a.scoreBands[b], label: `${a.scoreBands[b]} · ${Math.round((a.scoreBands[b] / (t.people || 1)) * 100)}%` })) },
      { t: "h1", text: "4. Ким фойдаланмоқда" },
      { t: "h2", text: "Босқич" }, { t: "bars", items: barsOf(a.stages, STAGE) },
      { t: "h2", text: "Ёш гуруҳи" }, { t: "bars", items: Object.entries(a.ages).map(([k, v]) => ({ n: k === "Номаълум" ? k : k + " ёш", v, label: `${v} · ${Math.round((v / (t.people || 1)) * 100)}%` })) },
      { t: "h2", text: "Ҳудуд" }, { t: "bars", items: barsOf(a.regions, {}, 16) },
      { t: "h2", text: "Қурилма" }, { t: "bars", items: barsOf(a.devTypes) },
      { t: "h2", text: "Операцион тизим" }, { t: "bars", items: barsOf(a.os, {}, 8) },
      { t: "h1", text: "5. Ўқиш воронкаси ва курслар" },
      { t: "bars", items: a.funnel.map((s) => ({ n: s.l, v: s.n, label: `${s.n} · ${Math.round((s.n / (a.funnel[0].n || t.people || 1)) * 100)}%` })) },
      { t: "table", head: ["Курс", "Тест топширди", "Ўртача натижа", "Ўтганлар"], widths: [4, 1.4, 1.4, 1.2], align: ["l", "r", "r", "r"],
        rows: a.courses.map((c) => [c.name, c.people, c.avg + "%", c.passPct + "%"]), empty: "Бу даврда якуний тест топширилмаган." },
      { t: "h1", text: "6. Энг фаол 20 фойдаланувчи" },
      { t: "table", head: ["№", "Ким", "Босқич", "Ҳудуд", "Фаол кун", "Вақт", "Дарс", "Тест", "Балл"], widths: [0.45, 2.4, 1.45, 1.75, 0.75, 1.55, 0.6, 0.65, 0.7], align: ["r", "l", "l", "l", "r", "r", "r", "r", "r"],
        rows: a.top.map((r, i) => [i + 1, who(r) + (r.email ? "\n" + r.email : ""), STAGE[r.stage || ""], r.place || r.region, r.activeDays, dur(r.secs), r.done, r.qaPct == null ? "—" : r.qaPct + "%", r.score]), empty: "Фойдаланувчи йўқ." },
      { t: "h1", text: "7. Эътибор талаб қиладиганлар (сусайган ҳисоблар)" },
      { t: "p", text: "Илгари фаол бўлиб, сўнгги вақтда кирмаётган ҳисоблар. Уларни «Эълон ва турнир» бўлими орқали қайтаришга ҳаракат қилинг.", muted: true },
      { t: "table", head: ["Ким", "Почта / телефон", "Охирги фаоллик", "Дарс", "Балл", "Ҳолат"], widths: [2.2, 2.6, 1.6, 0.8, 0.8, 1.6], align: ["l", "l", "l", "r", "r", "l"],
        rows: a.risk.map((r) => [who(r), r.email, fmtDate(r.last), r.done, r.score, SEGMENTS[r.seg].split(" (")[0]]), empty: "Ҳозирча бундай ҳисоб йўқ." },
      { t: "landscape" },
      { t: "h1", text: `8. Барча фойдаланувчилар (${Math.min(maxRows, a.people.length)} / ${t.people})` },
      { t: "table", size: 7.5, head: ["№", "Ким", "Босқич", "Ёш", "Ҳудуд", "Қурилма", "Охирги фаоллик", "Ташриф", "Вақт", "Дарс", "Тест", "Балл", "Сегмент"],
        widths: [0.45, 2.6, 1.15, 0.65, 1.7, 1.05, 1.35, 0.7, 1.15, 0.6, 0.65, 0.6, 1.05], align: ["r", "l", "l", "l", "l", "l", "l", "r", "r", "r", "r", "r", "l"],
        rows: a.people.slice(0, maxRows).map((r, i) => [i + 1, who(r) + (r.email ? "\n" + r.email : "") + (r.pro ? "\nPRO" : "") + (r.blocked ? "\nблокланган" : ""), STAGE[r.stage || ""], r.age || r.ag || "—",
          r.place || r.region, r.devType, fmtDate(r.last), r.visits, dur(r.secs), r.done, r.qaPct == null ? "—" : r.qaPct + "%", r.score, SEGMENTS[r.seg].split(" (")[0]]),
        empty: "Фойдаланувчи йўқ." }
    ];
    if (a.people.length > maxRows) blocks.push({ t: "p", text: `Ҳисоботда биринчи ${maxRows} та фойдаланувчи (балл бўйича). Тўлиқ рўйхат учун филтрлардан ёки CSV юклашдан фойдаланинг.`, muted: true });
    blocks.push({ t: "p", text: "Изоҳ: ҳудуд IP манзил бўйича тахминий аниқланади. Меҳмонларнинг исми сақланмайди (болалар махфийлиги) — улар қурилма коди билан кўрсатилади. Фаоллик балли: фаол кунлар (30), вақт (20), тугатилган дарслар (25), тўғри жавоблар (15), якуний тест ва сертификат (10).", muted: true });
    return {
      title: "Фойдаланувчилар таҳлили",
      subtitle: `Ekomun платформаси · ${a.days === 1 ? "бугун" : `сўнгги ${a.days} кун`} · ${fmtDay(a.from)} — ${fmtDay(a.now)}`,
      note: "Махфий ҳужжат: фойдаланувчиларнинг шахсий маълумотлари бор. Фақат платформа эгаси ва ваколатли ходимлар учун; учинчи шахсларга берманг.",
      meta: [["Давр", a.days === 1 ? "бугун" : `${a.days} кун`], ["Яратилди", created + " (Тошкент)"], ["Филтр", filt], ["Фойдаланувчилар", String(t.people)]],
      footer: `Ekomun · фойдаланувчилар таҳлили · ${created}`,
      blocks
    };
  }

  return {
    compute,
    pdf: (a) => report.pdf(document(a)),
    docx: (a) => report.docx(document(a)),
    SEGMENTS
  };
};
