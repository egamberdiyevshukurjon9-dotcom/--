/* zaxira.js синови: GitHub API сохта fetch билан алмаштирилади — шифрлаш, ёзиш, sha янгиланиши ва тиклаш. */
"use strict";
const assert = require("node:assert");
process.env.GITHUB_BACKUP_REPO = "test/ekomun-data";
process.env.GITHUB_BACKUP_TOKEN = "t0k3n";
process.env.GITHUB_BACKUP_KEY = "sir";
const files = new Map(); let shaN = 0, puts = 0;
globalThis.fetch = async (url, opt = {}) => {
  assert.ok(url.startsWith("https://api.github.com/repos/test/ekomun-data/contents/ekomun-db.bin"), url);
  assert.strictEqual(opt.headers.Authorization, "Bearer t0k3n");
  const f = files.get("db");
  const res = (status, body, raw) => ({ ok: status < 300, status, json: async () => body, text: async () => JSON.stringify(body), arrayBuffer: async () => raw });
  if (opt.method === "PUT") {
    const b = JSON.parse(opt.body);
    if (f && b.sha !== f.sha) return res(409, { message: "sha" });
    puts++;
    const sha = "s" + (++shaN);
    files.set("db", { sha, buf: Buffer.from(b.content, "base64") });
    return res(201, { content: { sha } });
  }
  if (!f) return res(404, { message: "Not Found" });
  if (opt.headers.Accept === "application/vnd.github.raw") return res(200, null, f.buf.buffer.slice(f.buf.byteOffset, f.buf.byteOffset + f.buf.length));
  return res(200, { sha: f.sha });
};
(async () => {
  let db = { users: [{ id: "u1", email: "a@b.uz" }], events: [{ type: "login" }], sessions: { x: 1 } };
  let ver = 1, restored = null;
  const z = require("../zaxira")({ backupData: () => JSON.stringify({ ...db, sessions: {}, savedAt: "now" }), restoreDb: (d) => { restored = d; }, getVersion: () => ver, now: Date.now });
  assert.ok(z.enabled);
  assert.strictEqual(await z.boot(true), false, "файл йўқ — тиклаш йўқ");
  assert.strictEqual(await z.push(false), true);
  assert.strictEqual(await z.push(false), false, "ўзгариш йўқ — ёзилмайди");
  assert.ok(!files.get("db").buf.toString("latin1").includes("a@b.uz"), "шифрланган бўлиши керак");
  ver++; db.events.push({ type: "logout" });
  assert.strictEqual(await z.push(false), true);
  assert.strictEqual(puts, 2);
  /* Янги сервер (бўш диск) — GitHub'дан тиклайди */
  delete require.cache[require.resolve("../zaxira")];
  const z2 = require("../zaxira")({ backupData: () => "{}", restoreDb: (d) => { restored = d; }, getVersion: () => 0, now: Date.now });
  assert.strictEqual(await z2.boot(true), true);
  assert.deepStrictEqual(restored.events.map((e) => e.type), ["login", "logout"]);
  assert.deepStrictEqual(restored.sessions, {});
  /* Бошқа калит билан очиб бўлмайди */
  process.env.GITHUB_BACKUP_KEY = "boshqa";
  delete require.cache[require.resolve("../zaxira")];
  const z3 = require("../zaxira")({ backupData: () => "{}", restoreDb: () => { throw new Error("чақирилмаслиги керак"); }, getVersion: () => 0, now: Date.now });
  assert.strictEqual(await z3.boot(true), false);
  assert.match(z3.status().lastError, /калит/);
  console.log("✓ zaxira-test: шифрлаш, ёзиш ва тиклаш ишлайди");
})().catch((e) => { console.error(e); process.exit(1); });
