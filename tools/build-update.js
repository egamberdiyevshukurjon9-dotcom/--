/* ЭкоТаълим Android иловаси учун янгиланиш маълумотини (app/update.json) йиғиш.
   Ишлатиш: node tools/build-update.js          — app/update.json ни янгилайди
            node tools/build-update.js --check  — эскирган бўлса хато билан чиқади (CI учун)

   Илова интернет бўлганда шу файлни main тармоғидан ўқийди:
   - content: платформа файллари хэши. Бирортаси ўзгарса, илова фақат ўзгарган файлларни
     юклаб олади ва «Янгилаш» тугмасини кўрсатади (янги APK шарт эмас).
   - apk: app/ папкасидаги энг янги APK. Унинг VERSION_CODE и телефондагидан катта бўлса,
     илова янги APK'ни юклаб, ўрнатишни таклиф қилади. */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "app", "update.json");
const REPO = process.env.UPDATE_REPO || "egamberdiyevshukurjon9-dotcom/--";
const BRANCH = process.env.UPDATE_BRANCH || "main";
const BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/`;

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const props = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, "android", "version.properties"), "utf8")
    .split("\n").filter((l) => /^\w+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);

/* 1. Платформа файллари (android/content-files.txt билан бир хил) */
const entries = fs.readFileSync(path.join(ROOT, "android", "content-files.txt"), "utf8")
  .split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
const files = {};
function walk(rel) {
  const abs = path.join(ROOT, rel);
  if (fs.statSync(abs).isDirectory()) {
    for (const n of fs.readdirSync(abs).sort()) walk(rel + "/" + n);
  } else {
    // APK ичида файллар папка номисиз жойлашади: "icons/x.png", "index.html"
    if (!/^[A-Za-z0-9._\-/]+$/.test(rel)) throw new Error("Файл номида рухсат этилмаган белги: " + rel);
    files[rel] = sha256(fs.readFileSync(abs));
  }
}
entries.forEach(walk);
const sorted = Object.fromEntries(Object.keys(files).sort().map((k) => [k, files[k]]));
const version = sha256(Object.entries(sorted).map(([k, v]) => k + ":" + v).join("\n")).slice(0, 16);

/* 2. Энг янги APK (app/EkoTalim-<версия>.apk) */
const appDir = path.dirname(OUT);
let apk = null;
const want = `EkoTalim-${props.VERSION_NAME}.apk`;
if (fs.existsSync(path.join(appDir, want))) {
  const buf = fs.readFileSync(path.join(appDir, want));
  const notesFile = path.join(appDir, "notes.txt");
  apk = {
    versionCode: Number(props.VERSION_CODE),
    versionName: props.VERSION_NAME,
    url: BASE + "app/" + want,
    sha256: sha256(buf),
    size: buf.length,
    notes: fs.existsSync(notesFile) ? fs.readFileSync(notesFile, "utf8").trim() : "",
  };
} else {
  // version.properties даги версиянинг APK'си ҳали йиғилмаган бўлса, олдингисини қолдирамиз
  try { apk = JSON.parse(fs.readFileSync(OUT, "utf8")).apk || null; } catch (e) { apk = null; }
}

const data = {
  apk,
  content: { version, minApk: Number(props.MIN_APK_FOR_CONTENT || 1), base: BASE, files: sorted },
};
const text = JSON.stringify(data, null, 1) + "\n";

if (process.argv.includes("--check")) {
  const old = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (old !== text) {
    console.error("app/update.json эскирган: node tools/build-update.js ни ишга туширинг");
    process.exit(1);
  }
  console.log("app/update.json янги");
} else {
  fs.writeFileSync(OUT, text);
  console.log(`app/update.json: контент ${version}, ${Object.keys(sorted).length} файл` +
    (apk ? `, APK ${apk.versionName} (${apk.versionCode})` : ", APK йўқ"));
}
