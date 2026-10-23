/* Экомун — янги видео, қонун ва янгиликларни расмий манбалардан автоматик олиш.
   server.js томонидан ишлатилади: require("./feeds")(ctx) → { api, adminApi, run, stats }.

   Сервер ҳар FEED_HOURS соатда (асл қиймат 3) манбаларни ўқиб, янги ёзувларни db.feed.items га қўшади:
     yt       — YouTube канал RSS (https://www.youtube.com/feeds/videos.xml?channel_id=UC…)
     tg       — Telegram очиқ канали (https://t.me/s/<канал>): видеоли пост → видео, қолгани → янгилик
     govlaws  — gov.uz/oz/eco/pages/laws: Экология қўмитаси сайтидаги қонунлар жадвали (lex.uz ҳаволалари)
     govnews  — gov.uz/oz/eco/news/news: қўмита янгиликлари
     rss      — исталган RSS/Atom манзили (админ қўшади)
   «auto» ёқилган бўлса янги ёзувлар дарҳол платформада кўринади, ўчирилган бўлса админ тасдиқлайди.
   Админ ҳар бир ёзувни яшириши ёки юқорига маҳкамлаши мумкин. Интернет бўлмаса ҳам охирги
   олинган рўйхат сақланиб қолади (сервер db да, мижоз localStorage да).

   Очиқ:   GET  /api/feed?kind=video|law|news&limit=N
   Админ:  GET  /api/admin/feed · POST /api/admin/feed/run · POST /api/admin/feed/item/:id {action}
           POST /api/admin/feed/source {action: add|toggle|delete, …} · POST /api/admin/feed/settings {auto}
   FEED_OFF=1 — автоматик олишни ўчириш. */
"use strict";

const crypto = require("node:crypto");

const UA = "Mozilla/5.0 (compatible; EkomunBot/1.0; +https://ekomun.onrender.com)";
const MAX_ITEMS = 800;
const MAX_BYTES = 4 * 1024 * 1024;

/* Асл манбалар — 2026-10-23 да текширилди (канал номи ва ID лари расмий саҳифалардан). */
const DEFAULT_SOURCES = [
  { id: "yt-ecogovuz", type: "yt", ref: "UCiaUoLECuViPTHW1X72wsrw", name: "Экология ва иқлим ўзгариши миллий қўмитаси · YouTube", on: true },
  { id: "tg-ecogovuz", type: "tg", ref: "ecogovuz", name: "Экология ва иқлим ўзгариши миллий қўмитаси · Telegram", on: true },
  { id: "gov-laws", type: "govlaws", ref: "https://gov.uz/oz/eco/pages/laws", name: "Экология қўмитаси сайти · Қонунлар", on: true },
  { id: "gov-news", type: "govnews", ref: "https://gov.uz/oz/eco/news/news", name: "Экология қўмитаси сайти · Янгиликлар", on: true },
  { id: "yt-khan-uz", type: "yt", ref: "UC0S2wQBD9R6wqh2WGIClAdQ", name: "Khan Academy Uzbek · YouTube (экология мавзулари)", on: true,
    keys: "ekolog|tabiat|iqlim|suv|havo|chiqindi|o‘rmon|o'rmon|tuproq|ekotizim|biosfera|populyatsiya|fotosintez|экол" },
  { id: "tg-buxoro", type: "tg", ref: "Buxoro_Eco", name: "Бухоро вилояти экология бошқармаси · Telegram", on: false },
  { id: "tg-samarqand", type: "tg", ref: "econewssamarqand", name: "Самарқанд вилояти экология бошқармаси · Telegram", on: false },
  { id: "tg-qashqadaryo", type: "tg", ref: "ekoqash", name: "Қашқадарё вилояти экология бошқармаси · Telegram", on: false },
  { id: "tg-qoraqalpoq", type: "tg", ref: "Ecokomuz", name: "Қорақалпоғистон экология қўмитаси · Telegram", on: false }
];

/* ---------- Матн ёрдамчилари ---------- */
const ENT = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ", laquo: "«", raquo: "»", mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”" };
function decode(s) {
  return String(s || "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") { const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ""; }
    return ENT[e.toLowerCase()] ?? m;
  });
}
const strip = (html) => decode(String(html || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|tr|h\d)>/gi, "\n").replace(/<[^>]+>/g, " "))
  .replace(/[ \t ]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
const oneLine = (s) => String(s || "").replace(/\s+/g, " ").trim();
const clip = (s, n) => { s = oneLine(s); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; };
const tag = (xml, name) => { const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i").exec(xml); return m ? m[1] : ""; };
const attr = (html, name) => { const m = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(html); return m ? decode(m[2] ?? m[3]) : ""; };
const hid = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
const MONTHS = { yanvar: 1, fevral: 2, mart: 3, aprel: 4, may: 5, iyun: 6, iyul: 7, avgust: 8, sentabr: 9, oktabr: 10, noyabr: 11, dekabr: 12,
  январь: 1, февраль: 2, март: 3, апрель: 4, май: 5, июнь: 6, июль: 7, август: 8, сентябрь: 9, октябрь: 10, ноябрь: 11, декабрь: 12,
  января: 1, февраля: 2, марта: 3, апреля: 4, мая: 5, июня: 6, июля: 7, августа: 8, сентября: 9, октября: 10, ноября: 11, декабря: 12 };
/* «14.05.2026», «2026-05-14», «14 May 2026», «14 Мая 2026» → мс (UTC) */
function findDate(text) {
  const s = String(text || "");
  const found = [];
  let m = /(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) found.push([m.index, Date.UTC(+m[1], +m[2] - 1, +m[3])]);
  m = /\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/.exec(s);
  if (m && +m[2] >= 1 && +m[2] <= 12) found.push([m.index, Date.UTC(+m[3], +m[2] - 1, +m[1])]);
  const re = /\b(\d{1,2})\s+([A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ‘'’]+)\s+(\d{4})/g;
  while ((m = re.exec(s))) { const mo = MONTHS[m[2].toLowerCase().replace(/[‘'’]/g, "")]; if (mo) { found.push([m.index, Date.UTC(+m[3], mo - 1, +m[1])]); break; } }
  found.sort((a, b) => a[0] - b[0]);
  return found.length ? found[0][1] : 0;
}

/* ---------- Парсерлар (tools/feed-test.js да синалади) ---------- */
/* YouTube канал RSS (Atom) */
function parseYouTube(xml) {
  const out = [];
  for (const e of String(xml).split(/<entry[\s>]/i).slice(1)) {
    const id = oneLine(tag(e, "yt:videoId"));
    if (!/^[\w-]{11}$/.test(id)) continue;
    const title = clip(strip(tag(e, "title")), 200);
    const desc = clip(strip(tag(e, "media:description")), 400);
    const pub = Date.parse(oneLine(tag(e, "published"))) || 0;
    out.push({ key: "yt:" + id, kind: "video", yt: id, title, text: desc, url: "https://www.youtube.com/watch?v=" + id, date: pub });
  }
  return out;
}
/* Telegram очиқ канали (t.me/s/<канал>) */
function parseTelegram(html, channel) {
  const out = [];
  const parts = String(html).split(/<div class="tgme_widget_message_wrap/).slice(1);
  for (const p of parts) {
    const post = /data-post="([\w]+)\/(\d+)"/.exec(p);
    if (!post) continue;
    if (channel && post[1].toLowerCase() !== channel.toLowerCase()) continue;
    const tm = /<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(p);
    const text = tm ? strip(tm[1]) : "";
    const dt = /<time[^>]*datetime="([^"]+)"/.exec(p);
    const video = /tgme_widget_message_video|message_video_player|tgme_widget_message_roundvideo/.test(p);
    if (!text && !video) continue;
    const lines = text.split("\n").map(oneLine).filter(Boolean);
    const title = clip(lines[0] || "Видео", 200);
    const rest = clip(lines.slice(1).join(" "), 400);
    const ref = post[1] + "/" + post[2];
    out.push({ key: "tg:" + ref.toLowerCase(), kind: video ? "video" : "news", tg: ref, title, text: rest, url: "https://t.me/" + ref, date: dt ? Date.parse(dt[1]) || 0 : 0 });
  }
  return out;
}
/* gov.uz «Қонунлар» жадвали: ҳар бир lex.uz ҳаволаси ва унинг қатори */
function parseGovLaws(html) {
  const s = String(html);
  const out = [], seen = new Set();
  const re = /<a\b[^>]*href\s*=\s*["'](https?:\/\/(?:www\.)?lex\.uz\/[^"'\s]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(s))) {
    const url = decode(m[1]);
    const doc = /\/(?:docs|pdfs)\/-?(\d{5,9})/.exec(url);
    if (!doc || seen.has(doc[1])) continue;
    const trStart = s.lastIndexOf("<tr", m.index), trEnd = s.indexOf("</tr>", m.index);
    const row = trStart >= 0 && trEnd > m.index && m.index - trStart < 20000 ? s.slice(trStart, trEnd) : m[2];
    let text = oneLine(strip(row));
    if (text.length < 12) text = oneLine(strip(m[2]));
    if (text.length < 12) continue;
    seen.add(doc[1]);
    const nm = /(?:O[‘'’`]?RQ|ЎРҚ|ZRU|ЗРУ)\s*[–-]\s*\d{2,5}|\b\d{2,4}-(?:I|II|XII)\b/i.exec(text);
    /* Сарлавҳа: «…қонуни» гача бўлган қисм, сана ва бошқа устунлар олиб ташланади */
    const own = oneLine(strip(m[2]));
    const title = clip(own.length >= 20 ? own : text.replace(/^\d{1,2}\s+[A-Za-zА-Яа-яЎўҚқҒғҲҳ‘'’]+\s+\d{4}\s*/, "").replace(/^\s*\d{1,3}[.)]?\s+/, ""), 300);
    out.push({ key: "lex:" + doc[1], kind: "law", title, text: nm ? nm[0].replace(/\s+/g, "") : "", url, date: findDate(text), lex: doc[1] });
  }
  return out;
}
/* gov.uz янгиликлари: /eco/news/view/NNNN ҳаволалари */
function parseGovNews(html, base) {
  const s = String(html);
  const best = new Map();
  const re = /<a\b[^>]*href\s*=\s*["']((?:https?:\/\/gov\.uz)?\/(?:oz|uz|ru|en)\/eco\/news\/view\/(\d+))["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(s))) {
    const title = clip(strip(m[3]), 240);
    if (title.length < 15) continue;
    const prev = best.get(m[2]);
    if (prev && prev.title.length >= title.length) continue;
    /* Сана одатда сарлавҳадан кейин, бўлмаса олдинда туради */
    const after = strip(s.slice(m.index + m[0].length, m.index + m[0].length + 400));
    const before = strip(s.slice(Math.max(0, m.index - 400), m.index));
    const url = m[1].startsWith("http") ? m[1] : (base || "https://gov.uz") + m[1];
    best.set(m[2], { key: "govnews:" + m[2], kind: "news", title, text: "", url, date: findDate(after) || findDate(before.split(/\n/).slice(-3).join(" ")) });
  }
  return [...best.values()];
}
/* Оддий RSS 2.0 ёки Atom */
function parseRss(xml, kind) {
  const s = String(xml), out = [];
  const items = s.split(/<item[\s>]/i).slice(1);
  const entries = items.length ? [] : s.split(/<entry[\s>]/i).slice(1);
  for (const it of items) {
    const title = clip(strip(tag(it, "title")), 240), link = oneLine(strip(tag(it, "link"))) || oneLine(tag(it, "guid"));
    if (!title || !/^https?:\/\//.test(link)) continue;
    const yt = /youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/.exec(link);
    out.push({ key: "rss:" + hid(link), kind: yt ? "video" : kind || "news", yt: yt ? yt[1] : undefined, title, text: clip(strip(tag(it, "description")), 400), url: link, date: Date.parse(oneLine(tag(it, "pubDate"))) || findDate(tag(it, "dc:date")) });
  }
  for (const e of entries) {
    const title = clip(strip(tag(e, "title")), 240);
    const lm = /<link[^>]*href="([^"]+)"/i.exec(e);
    if (!title || !lm) continue;
    const link = decode(lm[1]);
    const yt = /youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/.exec(link) || /<yt:videoId>([\w-]{11})</.exec(e);
    out.push({ key: "rss:" + hid(link), kind: yt ? "video" : kind || "news", yt: yt ? yt[1] : undefined, title, text: clip(strip(tag(e, "summary") || tag(e, "media:description")), 400), url: link, date: Date.parse(oneLine(tag(e, "published") || tag(e, "updated"))) || 0 });
  }
  return out;
}

module.exports = function feeds(ctx) {
  const { db, save, send, readBody, isAdmin, now, adminLog } = ctx;
  db.feed = Object.assign({ items: [], sources: [], auto: true, lastRun: 0, runs: [] }, db.feed || {});
  const F = () => db.feed; // db захирадан тикланганда ҳам янги объект ишлатилади
  /* Янги асл манбалар қўшилса, мавжуд рўйхатга қўшилади (админ ўчирганлари қайтмайди) */
  function ensureDefaults() {
    const f = F();
    f.removed = f.removed || [];
    for (const d of DEFAULT_SOURCES) if (!f.sources.some((x) => x.id === d.id) && !f.removed.includes(d.id)) f.sources.push({ ...d, def: true });
  }
  ensureDefaults();

  async function get(url) {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "uz,ru;q=0.8,en;q=0.6" }, redirect: "follow", signal: AbortSignal.timeout(25000) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > MAX_BYTES) throw new Error("жавоб жуда катта");
    return buf.toString("utf8");
  }
  const srcUrl = (s) => s.type === "yt" ? "https://www.youtube.com/feeds/videos.xml?channel_id=" + encodeURIComponent(s.ref)
    : s.type === "tg" ? "https://t.me/s/" + encodeURIComponent(s.ref) : s.ref;
  const srcPage = (s) => s.type === "yt" ? "https://www.youtube.com/channel/" + s.ref : s.type === "tg" ? "https://t.me/" + s.ref : s.ref;

  async function fetchSource(s) {
    const body = await get(srcUrl(s));
    let list = s.type === "yt" ? parseYouTube(body) : s.type === "tg" ? parseTelegram(body, s.ref)
      : s.type === "govlaws" ? parseGovLaws(body) : s.type === "govnews" ? parseGovNews(body, new URL(s.ref).origin) : parseRss(body, s.kind);
    if (s.keys) { const re = new RegExp(s.keys, "i"); list = list.filter((x) => re.test(x.title + " " + x.text)); }
    return list;
  }
  function merge(s, list) {
    const f = F();
    const byKey = new Map(f.items.map((x) => [x.key, x]));
    let added = 0;
    for (const x of list) {
      const old = byKey.get(x.key);
      if (old) { if (x.title && old.title !== x.title && !old.edited) old.title = x.title; if (x.date && !old.date) old.date = x.date; continue; }
      const it = { id: hid(x.key), key: x.key, src: s.id, kind: x.kind, title: x.title, text: x.text || "", url: x.url, date: x.date || 0, at: now(), status: f.auto ? "ok" : "new" };
      if (x.yt) it.yt = x.yt;
      if (x.tg) it.tg = x.tg;
      if (x.lex) it.lex = x.lex;
      /* Биринчи марта олинганда эски ёзувлар «янги» белгисиз кўринади */
      if (!s.last || !s.last.ok) it.first = true;
      f.items.push(it); byKey.set(x.key, it); added++;
    }
    if (f.items.length > MAX_ITEMS) {
      f.items.sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (b.date || b.at) - (a.date || a.at));
      f.items.length = MAX_ITEMS;
    }
    return added;
  }

  let running = null;
  function run(only) {
    if (running) return running;
    running = (async () => {
      const f = F();
      const res = [];
      for (const s of f.sources.filter((x) => x.on && (!only || x.id === only))) {
        try {
          const list = await fetchSource(s);
          const added = merge(s, list);
          s.last = { at: now(), ok: true, n: list.length, added, err: "" };
          res.push({ id: s.id, ok: true, n: list.length, added });
        } catch (e) {
          s.last = { ...(s.last || {}), at: now(), ok: false, err: String(e.message || e).slice(0, 200) };
          res.push({ id: s.id, ok: false, err: s.last.err });
        }
      }
      f.lastRun = now();
      f.runs = (f.runs || []).concat({ at: f.lastRun, added: res.reduce((a, r) => a + (r.added || 0), 0), errors: res.filter((r) => !r.ok).length }).slice(-30);
      save();
      return res;
    })().finally(() => { running = null; });
    return running;
  }

  const HOURS = Math.max(1, Number(process.env.FEED_HOURS) || 3);
  if (process.env.FEED_OFF !== "1") {
    setTimeout(() => run().catch(() => {}), 30 * 1000).unref();
    setInterval(() => run().catch(() => {}), HOURS * 60 * 60 * 1000).unref();
  }

  const srcName = (id) => { const s = F().sources.find((x) => x.id === id); return s ? s.name : ""; };
  const pub = (x) => ({ id: x.id, kind: x.kind, src: x.src, srcName: srcName(x.src), title: x.title, text: x.text, url: x.url, date: x.date, at: x.at, yt: x.yt, tg: x.tg, pin: !!x.pin, fresh: !x.first && now() - x.at < 7 * 864e5 });
  const order = (a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (b.date || b.at) - (a.date || a.at);

  /* Очиқ API */
  async function api(req, res, pathname) {
    if (pathname !== "/api/feed" || req.method !== "GET") return null;
    const q = new URL(req.url, "http://x").searchParams;
    const kind = ["video", "law", "news"].includes(q.get("kind")) ? q.get("kind") : "";
    const limit = Math.min(300, Math.max(1, Number(q.get("limit")) || 120));
    const items = F().items.filter((x) => x.status === "ok" && (!kind || x.kind === kind)).sort(order).slice(0, limit).map(pub);
    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Android иловаси (интернетсиз нусха) ҳам ўқий олсин
    return send(res, 200, { updated: F().lastRun, items });
  }

  /* Тузатилган ID: YouTube канали — UC… (24 белги), @handle ёки канал ҳаволаси */
  async function resolveYouTube(input) {
    const v = String(input || "").trim();
    let m = /(UC[\w-]{22})/.exec(v);
    if (m) return m[1];
    m = /(?:youtube\.com\/)?(@[\w.\-]{3,60})/.exec(v);
    if (!m) throw new Error("YouTube канал ID си (UC…), @номи ёки ҳаволасини киритинг");
    const html = await get("https://www.youtube.com/" + m[1]);
    const id = /"(?:channelId|externalId)":"(UC[\w-]{22})"/.exec(html) || /channel_id=(UC[\w-]{22})/.exec(html);
    if (!id) throw new Error("Канал топилмади");
    return id[1];
  }

  async function adminApi(req, res, pathname) {
    if (pathname !== "/api/admin/feed" && !pathname.startsWith("/api/admin/feed/")) return null; // /api/admin/feedback — бошқа бўлим
    if (!isAdmin(req)) return send(res, 401, { error: "Админ сифатида киринг" });
    const f = F();
    if (pathname === "/api/admin/feed" && req.method === "GET") {
      const items = f.items.slice().sort(order).slice(0, 500).map((x) => ({ ...pub(x), status: x.status }));
      const counts = {};
      for (const x of f.items) counts[x.kind + ":" + x.status] = (counts[x.kind + ":" + x.status] || 0) + 1;
      return send(res, 200, { auto: f.auto, lastRun: f.lastRun, hours: HOURS, off: process.env.FEED_OFF === "1", running: !!running, runs: f.runs.slice(-10),
        sources: f.sources.map((s) => ({ ...s, url: srcPage(s), count: f.items.filter((x) => x.src === s.id).length })), items, counts });
    }
    if (pathname === "/api/admin/feed/run" && req.method === "POST") {
      const body = await readBody(req, 4 * 1024);
      const r = await run(body.source ? String(body.source) : "");
      adminLog(req, true, "янгиликлар оқими қўлда янгиланди");
      return send(res, 200, { ok: true, result: r });
    }
    if (pathname === "/api/admin/feed/settings" && req.method === "POST") {
      const body = await readBody(req, 4 * 1024);
      f.auto = !!body.auto;
      save();
      return send(res, 200, { ok: true, auto: f.auto });
    }
    const im = /^\/api\/admin\/feed\/item\/([a-f0-9]{16})$/.exec(pathname);
    if (im && req.method === "POST") {
      const body = await readBody(req, 8 * 1024);
      const it = f.items.find((x) => x.id === im[1]);
      if (!it) return send(res, 404, { error: "Ёзув топилмади" });
      const a = String(body.action || "");
      if (a === "hide") it.status = "hidden";
      else if (a === "show" || a === "approve") it.status = "ok";
      else if (a === "pin") it.pin = true;
      else if (a === "unpin") delete it.pin;
      else if (a === "edit") { const t = oneLine(body.title).slice(0, 300); if (t.length < 3) return send(res, 400, { error: "Сарлавҳа жуда қисқа" }); it.title = t; it.edited = true; }
      else return send(res, 400, { error: "Нотўғри амал" });
      save();
      return send(res, 200, { ok: true });
    }
    if (pathname === "/api/admin/feed/source" && req.method === "POST") {
      const body = await readBody(req, 8 * 1024);
      const a = String(body.action || "");
      if (a === "toggle" || a === "delete") {
        const s = f.sources.find((x) => x.id === String(body.id || ""));
        if (!s) return send(res, 404, { error: "Манба топилмади" });
        if (a === "toggle") s.on = !s.on;
        else {
          f.sources = f.sources.filter((x) => x !== s);
          if (s.def) f.removed = (f.removed || []).concat(s.id);
          if (body.purge) f.items = f.items.filter((x) => x.src !== s.id);
        }
        save();
        return send(res, 200, { ok: true });
      }
      if (a === "add") {
        const type = String(body.type || "");
        if (!["yt", "tg", "rss"].includes(type)) return send(res, 400, { error: "Манба тури: yt, tg ёки rss" });
        let ref = String(body.ref || "").trim();
        try {
          if (type === "yt") ref = await resolveYouTube(ref);
          else if (type === "tg") {
            const m = /(?:t\.me\/(?:s\/)?|@)?([A-Za-z][\w]{3,31})\/?$/.exec(ref);
            if (!m) throw new Error("Telegram канал номини киритинг (масалан @ecogovuz ёки t.me/ecogovuz)");
            ref = m[1];
          } else if (!/^https:\/\/[^\s]+$/.test(ref)) throw new Error("RSS манзили https:// билан бошланиши керак");
        } catch (e) { return send(res, 400, { error: e.message }); }
        const id = type + "-" + hid(type + ":" + ref.toLowerCase()).slice(0, 8);
        if (f.sources.some((x) => x.type === type && x.ref.toLowerCase() === ref.toLowerCase())) return send(res, 409, { error: "Бу манба аллақачон бор" });
        const name = oneLine(body.name).slice(0, 120) || (type === "tg" ? "@" + ref : type === "yt" ? "YouTube " + ref : new URL(ref).hostname);
        const keys = oneLine(body.keys).slice(0, 300);
        if (keys) { try { new RegExp(keys, "i"); } catch (e) { return send(res, 400, { error: "Калит сўзлар нотўғри (| билан ажратинг)" }); } }
        const kind = ["news", "law", "video"].includes(body.kind) ? body.kind : "news";
        const s = { id, type, ref, name, on: true, kind, keys: keys || undefined };
        f.sources.push(s);
        save();
        adminLog(req, true, "янги манба: " + name);
        const r = await run(id);
        return send(res, 200, { ok: true, source: s, result: r });
      }
      return send(res, 400, { error: "Нотўғри амал" });
    }
    return send(res, 404, { error: "Топилмади" });
  }

  return {
    api, adminApi, run,
    stats: () => ({ items: F().items.length, sources: F().sources.filter((s) => s.on).length, lastRun: F().lastRun })
  };
};
module.exports.parsers = { parseYouTube, parseTelegram, parseGovLaws, parseGovNews, parseRss, findDate, strip, decode };
module.exports.DEFAULT_SOURCES = DEFAULT_SOURCES;
