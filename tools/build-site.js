/* ЭкоТаълим таништирув сайтини (GitHub Pages, docs/) йиғиш.
   Ишлатиш: node tools/build-site.js
   Платформа манзили: PLATFORM_URL=https://... node tools/build-site.js
   Сайт манзили (бошқа домен бўлса): SITE_URL=https://ekotalim.uz/ node tools/build-site.js */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs");
const BASE = (process.env.SITE_URL || "https://egamberdiyevshukurjon9-dotcom.github.io/--/").replace(/\/?$/, "/");
const PLATFORM = process.env.PLATFORM_URL || fs.readFileSync(path.join(ROOT, "site-src", "platform-url.txt"), "utf8").trim();
const TODAY = new Date().toISOString().slice(0, 10);

/* Кирилл → лотин (index.html даги EkoLang.tr билан бир хил қоида) */
const MAP = { а: "a", б: "b", в: "v", г: "g", д: "d", ж: "j", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "x", ч: "ch", ш: "sh", щ: "sh", ы: "i", э: "e", ё: "yo", ю: "yu", я: "ya", ў: "oʻ", қ: "q", ғ: "gʻ", ҳ: "h", ь: "" };
const VOW = "аеёиоуэюяў";
const isCyr = (c) => !!c && /[Ѐ-ӿ]/.test(c);
const isL = (c) => !!c && /\p{L}/u.test(c);
const isU = (c) => !!c && c !== c.toLowerCase();
function tr(s) {
  let o = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i], lo = ch.toLowerCase(), p = s[i - 1], n = s[i + 1], pl = p ? p.toLowerCase() : "";
    let r;
    if (lo === "е") r = !isL(p) || VOW.includes(pl) || pl === "ъ" || pl === "ь" ? "ye" : "e";
    else if (lo === "ц") r = isL(p) && VOW.includes(pl) ? "ts" : "s";
    else if (lo === "ъ") r = n && "еёюя".includes(n.toLowerCase()) ? "" : "ʼ";
    else if (lo in MAP) r = MAP[lo];
    else { o += ch; continue; }
    if (r && isU(ch)) {
      const caps = (isCyr(n) && isU(n)) || (isCyr(p) && isU(p) && !isL(n));
      r = caps ? r.toUpperCase() : r[0].toUpperCase() + r.slice(1);
    }
    o += r;
  }
  return o;
}

const tpl = fs.readFileSync(path.join(ROOT, "site-src", "landing.html"), "utf8");
const jsonld = (url, lang) => JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: "ЭкоТаълим", alternateName: ["EkoTaʼlim", "Eko Talim"], url: BASE, inLanguage: lang },
    {
      "@type": "WebApplication", name: "ЭкоТаълим", url: PLATFORM || url, applicationCategory: "EducationalApplication", operatingSystem: "Web, Android, iOS",
      inLanguage: lang, isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "UZS" },
      description: "Аҳоли, мактаб ва корхоналар учун бепул онлайн экологик таълим платформаси."
    }
  ]
});

function page(latin) {
  const url = latin ? BASE : BASE + "kirill/";
  const lang = latin ? "uz-Latn" : "uz-Cyrl";
  let s = tpl
    .replaceAll("{{lang}}", lang).replaceAll("{{url}}", url).replaceAll("{{base}}", BASE)
    .replaceAll("{{root}}", latin ? "" : "../").replaceAll("{{oglocale}}", "uz_UZ")
    .replaceAll("{{otherurl}}", latin ? "kirill/" : "../").replaceAll("{{otherlang}}", latin ? "uz-Cyrl" : "uz-Latn")
    .replace("{{jsonld}}", jsonld(url, lang).replace(/</g, "\\u003c"))
    .replace('const PLATFORM = "";', `const PLATFORM = ${JSON.stringify(PLATFORM)};`);
  if (latin) s = tr(s);
  return s.replaceAll("{{othername}}", latin ? "Кирилл" : "Lotin");
}

fs.mkdirSync(path.join(OUT, "kirill"), { recursive: true });
fs.writeFileSync(path.join(OUT, "index.html"), page(true));
fs.writeFileSync(path.join(OUT, "kirill", "index.html"), page(false));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
const alt = `\n    <xhtml:link rel="alternate" hreflang="uz-Latn" href="${BASE}"/>\n    <xhtml:link rel="alternate" hreflang="uz-Cyrl" href="${BASE}kirill/"/>`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${BASE}</loc>
    <lastmod>${TODAY}</lastmod>${alt}
  </url>
  <url>
    <loc>${BASE}kirill/</loc>
    <lastmod>${TODAY}</lastmod>${alt}
  </url>
</urlset>
`);
fs.writeFileSync(path.join(OUT, "favicon.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#17803d"/><path d="M9 21c0-7 5-12 14-12-1 9-6 13-12 13" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M10 22l7-7" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>\n');
console.log("built", BASE, "platform:", PLATFORM || "(йўқ)");
