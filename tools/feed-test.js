/* feeds.js парсерлари синови: YouTube RSS, Telegram очиқ канали, gov.uz қонунлар ва янгиликлар, RSS.
   Намуналар ҳақиқий саҳифалар тузилишида (2026-10-23 ҳолати). */
"use strict";
const assert = require("node:assert");
const { parsers: P, DEFAULT_SOURCES } = require("../feeds");

const yt = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>Ekologiya va iqlim o‘zgarishi milliy qo‘mitasi</title>
 <entry><id>yt:video:fOMS9flYPwQ</id><yt:videoId>fOMS9flYPwQ</yt:videoId><yt:channelId>UCiaUoLECuViPTHW1X72wsrw</yt:channelId>
  <title>Matbuot anjumani &amp; savollar</title><link rel="alternate" href="https://www.youtube.com/watch?v=fOMS9flYPwQ"/>
  <published>2026-10-20T08:00:00+00:00</published><media:group><media:title>x</media:title><media:description>Chiqindilar &quot;boshqaruvi&quot; haqida</media:description></media:group></entry>
 <entry><yt:videoId>bad</yt:videoId><title>x</title></entry>
</feed>`;
const a = P.parseYouTube(yt);
assert.strictEqual(a.length, 1);
assert.strictEqual(a[0].yt, "fOMS9flYPwQ");
assert.strictEqual(a[0].title, "Matbuot anjumani & savollar");
assert.strictEqual(a[0].text, 'Chiqindilar "boshqaruvi" haqida');
assert.strictEqual(a[0].date, Date.parse("2026-10-20T08:00:00Z"));

const tg = `<section class="tgme_channel_history js-message_history">
<div class="tgme_widget_message_wrap js-widget_message_wrap"><div class="tgme_widget_message text_not_supported_wrap js-widget_message" data-post="ecogovuz/49496" data-view="x">
 <a class="tgme_widget_message_video_player js-message_video_player" href="https://t.me/ecogovuz/49496"><i class="tgme_widget_message_video_thumb" style="background-image:url('https://cdn4.telesco.pe/x.jpg')"></i><video class="tgme_widget_message_video js-message_video" src="https://cdn4.telesco.pe/v.mp4"></video></a>
 <div class="tgme_widget_message_text js-message_text" dir="auto"><b>GREEN UNIVERSITY'DA QABUL DAVOM ETMOQDA</b><br/><br/>Hujjatlar 1-noyabrgacha qabul qilinadi.<a href="https://t.me/ecogovuz">@ecogovuz</a></div>
 <div class="tgme_widget_message_footer"><a class="tgme_widget_message_date" href="https://t.me/ecogovuz/49496"><time datetime="2026-10-22T10:40:00+00:00" class="time">10:40</time></a></div></div></div>
<div class="tgme_widget_message_wrap js-widget_message_wrap"><div class="tgme_widget_message js-widget_message" data-post="ecogovuz/49497">
 <div class="tgme_widget_message_text js-message_text" dir="auto">Ertaga respublikada navbatdagi &quot;Avtomobilsiz kun&quot; aksiyasi o&#39;tkaziladi</div>
 <time datetime="2026-10-22T07:15:00+00:00" class="time">07:15</time></div></div>
<div class="tgme_widget_message_wrap js-widget_message_wrap"><div class="tgme_widget_message js-widget_message" data-post="ecogovuz/49498"><div class="tgme_widget_message_photo_wrap"></div></div></div>
</section>`;
const b = P.parseTelegram(tg, "ecogovuz");
assert.strictEqual(b.length, 2, "матнсиз фото пост ўтказиб юборилади");
assert.deepStrictEqual([b[0].kind, b[0].tg, b[0].title], ["video", "ecogovuz/49496", "GREEN UNIVERSITY'DA QABUL DAVOM ETMOQDA"]);
assert.match(b[0].text, /1-noyabrgacha/);
assert.deepStrictEqual([b[1].kind, b[1].title], ["news", 'Ertaga respublikada navbatdagi "Avtomobilsiz kun" aksiyasi o\'tkaziladi']);
assert.strictEqual(b[1].url, "https://t.me/ecogovuz/49497");

const laws = `<table><tr><th>Sana</th><th>Nomi</th></tr>
<tr><td>14 May 2026</td><td><a href="https://lex.uz/en/pdfs/8193984" target="_blank">Ekologik toza hududlarning huquqiy maqomi belgilanishi munosabati bilan "Muhofaza etiladigan tabiiy hududlar to‘g‘risida"gi Qonunga qo‘shimcha kiritish haqida O‘RQ-1145. 14.05.2026</a></td></tr>
<tr><td>09 Dekabr 1992</td><td><a href="http://lex.uz/docs/-107115">O‘zbekiston Respublikasining "Tabiatni muhofaza qilish to‘g‘risidagi" 09.12.1992 yildagi 754-XII-son qonuni</a></td></tr>
<tr><td>x</td><td><a href="https://lex.uz/docs/-107115">dublikat qator — o‘tkazib yuboriladi</a></td></tr></table>`;
const c = P.parseGovLaws(laws);
assert.strictEqual(c.length, 2);
assert.strictEqual(c[0].lex, "8193984");
assert.strictEqual(c[0].text, "O‘RQ-1145");
assert.strictEqual(c[0].date, Date.UTC(2026, 4, 14));
assert.match(c[0].title, /^Ekologik toza hududlarning/);
assert.strictEqual(c[1].text, "754-XII");
assert.strictEqual(c[1].date, Date.UTC(1992, 11, 9));

const news = `<div class="news"><a href="/oz/eco/news/view/30123"><img src="x.jpg"></a><a href="/oz/eco/news/view/30123" class="title">Samarqandda xalqaro ekologik forum boshlandi</a><span class="date">22.10.2026</span>
<a href="/oz/eco/news/view/30120">Batafsil</a><a href="https://gov.uz/oz/eco/news/view/30120">Qizilqum qo‘riqxonasida yangi monitoring kameralari o‘rnatildi</a> <span>2026-10-21</span></div>`;
const d = P.parseGovNews(news, "https://gov.uz");
assert.strictEqual(d.length, 2);
assert.strictEqual(d[0].url, "https://gov.uz/oz/eco/news/view/30123");
assert.strictEqual(d[0].date, Date.UTC(2026, 9, 22));
assert.strictEqual(d[1].title, "Qizilqum qo‘riqxonasida yangi monitoring kameralari o‘rnatildi");

const rss = `<rss><channel><item><title><![CDATA[UNEP: Plastik ifloslanish]]></title><link>https://www.youtube.com/watch?v=ZQr3oV5xfEk</link><pubDate>Tue, 21 Oct 2026 10:00:00 GMT</pubDate><description>&lt;p&gt;Matn&lt;/p&gt;</description></item>
<item><title>Yangilik</title><link>https://example.uz/a</link></item></channel></rss>`;
const e = P.parseRss(rss, "news");
assert.deepStrictEqual(e.map((x) => [x.kind, x.yt || ""]), [["video", "ZQr3oV5xfEk"], ["news", ""]]);
assert.strictEqual(e[0].title, "UNEP: Plastik ifloslanish");

assert.strictEqual(P.findDate("21 Октября 2026"), Date.UTC(2026, 9, 21));
assert.ok(DEFAULT_SOURCES.every((s) => s.id && s.type && s.ref && s.name));
/* Модуль: run() → db.feed.items, /api/feed, яшириш ва манба қўшиш */
process.env.FEED_OFF = "1";
globalThis.fetch = async (url) => {
  const body = url.includes("feeds/videos.xml?channel_id=UCiaUoLECuViPTHW1X72wsrw") ? yt : url === "https://t.me/s/ecogovuz" ? tg
    : url.endsWith("/pages/laws") ? laws : url.endsWith("/news/news") ? news : null;
  if (body === null) return { ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) };
  return { ok: true, status: 200, arrayBuffer: async () => new TextEncoder().encode(body).buffer };
};
(async () => {
  const db = {};
  const sent = [];
  const send = (res, code, body) => { sent.push([code, body]); return true; };
  const mod = require("../feeds")({ db, save: () => {}, send, readBody: async () => ({}), isAdmin: () => true, now: Date.now, adminLog: () => {} });
  const r = await mod.run();
  const ok = Object.fromEntries(r.map((x) => [x.id, x.ok]));
  assert.ok(ok["yt-ecogovuz"] && ok["tg-ecogovuz"] && ok["gov-laws"] && ok["gov-news"], JSON.stringify(r));
  assert.strictEqual(ok["yt-khan-uz"], false, "топилмаган манба хато билан белгиланади");
  assert.strictEqual(db.feed.items.length, 1 + 2 + 2 + 2);
  const res = { setHeader() {} };
  await mod.api({ method: "GET", url: "/api/feed?kind=video" }, res, "/api/feed");
  let [code, body] = sent.pop();
  assert.strictEqual(code, 200);
  assert.deepStrictEqual(body.items.map((x) => x.yt || x.tg).sort(), ["ecogovuz/49496", "fOMS9flYPwQ"]);
  /* Иккинчи марта — дубликат қўшилмайди */
  await mod.run();
  assert.strictEqual(db.feed.items.length, 7);
  /* Яшириш */
  const id = db.feed.items.find((x) => x.kind === "law").id;
  const readBody = async () => ({ action: "hide" });
  const mod2 = require("../feeds")({ db, save: () => {}, send, readBody, isAdmin: () => true, now: Date.now, adminLog: () => {} });
  await mod2.adminApi({ method: "POST", url: "" }, res, "/api/admin/feed/item/" + id);
  assert.strictEqual(sent.pop()[0], 200);
  await mod2.api({ method: "GET", url: "/api/feed?kind=law" }, res, "/api/feed");
  assert.strictEqual(sent.pop()[1].items.length, 1);
  assert.strictEqual(await mod2.adminApi({ method: "GET" }, res, "/api/admin/feedback"), null, "feedback бўлимига тегмайди");
  console.log("✓ feed-test: YouTube, Telegram, gov.uz қонунлар/янгиликлар ва RSS парсерлари ҳамда модуль ишлайди");
})().catch((e) => { console.error(e); process.exit(1); });
