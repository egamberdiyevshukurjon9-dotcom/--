/* Рус ва инглиз луғатларига янги матнлар қўшади.
   Ишлатиш: node tools/i18n-add.js tarjima.json [бошқа.json ...]
   JSON: { "асл ўзбек кирилл матн": ["русча", "inglizcha"], ... }
   Янги калитлар охирига қўшилади. Мавжуд калитлар ўзгармайди; уларни ҳам янгилаш учун --update. */
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const dir = path.join(__dirname, "..", "vendor", "i18n");
function load(name, varName) {
  const src = fs.readFileSync(path.join(dir, name), "utf8");
  const nl = src.indexOf("\n");
  const head = src.slice(0, nl + 1);
  const body = src.slice(nl + 1).trim();
  const prefix = `window.${varName}=`;
  if (!body.startsWith(prefix)) throw new Error(name + ": кутилмаган формат");
  return { head, prefix, arr: JSON.parse(body.slice(prefix.length).replace(/;\s*$/, "")) };
}
const keys = load("keys.js", "EKO_I18N_KEYS"), ru = load("ru.js", "EKO_I18N_RU"), en = load("en.js", "EKO_I18N_EN");
if (keys.arr.length !== ru.arr.length || keys.arr.length !== en.arr.length) throw new Error("Луғатлар узунлиги мос эмас");
const index = new Map(keys.arr.map((k, i) => [k, i]));
let added = 0, updated = 0;
const update = process.argv.includes("--update");
for (const file of process.argv.slice(2).filter((a) => a !== "--update")) {
  const map = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [k, v] of Object.entries(map)) {
    if (!k.trim() || !Array.isArray(v) || typeof v[0] !== "string" || typeof v[1] !== "string") continue;
    if (index.has(k)) { if (!update) continue; const i = index.get(k); if (ru.arr[i] !== v[0] || en.arr[i] !== v[1]) { ru.arr[i] = v[0]; en.arr[i] = v[1]; updated++; } continue; }
    index.set(k, keys.arr.length);
    keys.arr.push(k); ru.arr.push(v[0]); en.arr.push(v[1]);
    added++;
  }
}
for (const [name, d] of [["keys.js", keys], ["ru.js", ru], ["en.js", en]]) {
  fs.writeFileSync(path.join(dir, name), d.head + d.prefix + JSON.stringify(d.arr) + ";\n");
}
console.log(`Қўшилди: ${added}, янгиланди: ${updated}, жами: ${keys.arr.length}`);
