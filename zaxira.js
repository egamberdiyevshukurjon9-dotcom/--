/* Экомун — маълумотларнинг ташқи захираси (ЁПИҚ GitHub репозиторийда).
   server.js томонидан ишлатилади: require("./zaxira")(ctx) → { enabled, boot, push, status }.

   Нима учун: Render'да Persistent Disk уланмаган бўлса, ҳар деплой ва қайта ишга тушишда db.json
   (ҳисоблар, «Кирди-чиқди» журнали, статистика, тўловлар) ўчиб кетади. Бу модуль db ни ҳар
   ZAXIRA_MINUTES дақиқада (ўзгариш бўлса) ва сервер тўхташидан олдин GitHub'га ёзади, сервер «бўш»
   бошланганда эса ўша нусхадан ўзи тиклайди.

   Созламалар:
     GITHUB_BACKUP_REPO   — owner/repo (албатта ЁПИҚ репозиторий, масалан egamberdiyev/ekomun-data)
     GITHUB_BACKUP_TOKEN  — fine-grained token: фақат шу репозиторий, Contents: Read and write
     GITHUB_BACKUP_PATH   — файл номи (асл қиймат ekomun-db.bin)
     GITHUB_BACKUP_BRANCH — тармоқ (асл қиймат main)
     GITHUB_BACKUP_KEY    — шифр калити; бўлмаса ACCOUNT_SECRET ёки ADMIN_PASSWORD ишлатилади.
                            Калит ўзгарса, эски нусхани ўқиб бўлмайди.
     ZAXIRA_MINUTES       — неча дақиқада бир ёзилади (асл қиймат 10)

   Файл AES-256-GCM билан шифрланади (ичида пароль хэшлари ва шахсий маълумотлар бор):
   "EKZ1" + iv(12) + tag(16) + gzip(JSON) шифри. Сессия калитлари ёзилмайди. */
"use strict";

const zlib = require("node:zlib");
const crypto = require("node:crypto");

module.exports = function zaxira(ctx) {
  const { backupData, restoreDb, getVersion, now } = ctx;
  const REPO = String(process.env.GITHUB_BACKUP_REPO || "").trim().replace(/^https:\/\/github\.com\//, "").replace(/\.git$|\/+$/g, "");
  const TOKEN = String(process.env.GITHUB_BACKUP_TOKEN || "").trim();
  const FILE = String(process.env.GITHUB_BACKUP_PATH || "ekomun-db.bin").replace(/^\/+/, "");
  const BRANCH = String(process.env.GITHUB_BACKUP_BRANCH || "main");
  const SECRET = process.env.GITHUB_BACKUP_KEY || process.env.ACCOUNT_SECRET || process.env.ADMIN_PASSWORD || "";
  const EVERY = Math.max(2, Number(process.env.ZAXIRA_MINUTES) || 10) * 60 * 1000;
  const enabled = /^[\w.-]+\/[\w.-]+$/.test(REPO) && !!TOKEN && !!SECRET;
  const KEY = crypto.createHash("sha256").update("ekomun-zaxira|" + SECRET).digest();
  const API = `https://api.github.com/repos/${REPO}/contents/${FILE.split("/").map(encodeURIComponent).join("/")}`;
  const st = { enabled, repo: enabled ? REPO : "", file: FILE, lastPush: 0, lastPull: 0, restoredAt: 0, lastError: "", errorAt: 0, size: 0, pushes: 0 };
  let sha = null, pushedVersion = -1, busy = null;

  function seal(json) {
    const iv = crypto.randomBytes(12);
    const c = crypto.createCipheriv("aes-256-gcm", KEY, iv);
    const body = Buffer.concat([c.update(zlib.gzipSync(Buffer.from(json, "utf8"))), c.final()]);
    return Buffer.concat([Buffer.from("EKZ1"), iv, c.getAuthTag(), body]);
  }
  function open(buf) {
    if (buf.length < 33 || buf.subarray(0, 4).toString() !== "EKZ1") throw new Error("Захира файли таниб бўлмади");
    const d = crypto.createDecipheriv("aes-256-gcm", KEY, buf.subarray(4, 16));
    d.setAuthTag(buf.subarray(16, 32));
    let plain;
    try { plain = Buffer.concat([d.update(buf.subarray(32)), d.final()]); }
    catch (e) { throw new Error("Захирани очиб бўлмади: шифр калити (GITHUB_BACKUP_KEY / ACCOUNT_SECRET) ўзгарган"); }
    return JSON.parse(zlib.gunzipSync(plain).toString("utf8"));
  }
  const headers = (accept) => ({ Authorization: "Bearer " + TOKEN, Accept: accept || "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "ekomun-zaxira" });
  const fail = (e) => { st.lastError = String(e && e.message || e).slice(0, 300); st.errorAt = now(); console.error("Zaxira:", st.lastError); };

  async function meta() {
    const r = await fetch(`${API}?ref=${encodeURIComponent(BRANCH)}`, { headers: headers(), signal: AbortSignal.timeout(20000) });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 160)}`);
    return r.json();
  }

  /* Сервер бўш бошланганда: GitHub'даги нусхадан тиклаш */
  async function boot(fresh) {
    if (!enabled) return false;
    try {
      const m = await meta();
      if (!m) return false;
      sha = m.sha;
      if (!fresh) return false;
      const r = await fetch(`${API}?ref=${encodeURIComponent(BRANCH)}`, { headers: headers("application/vnd.github.raw"), signal: AbortSignal.timeout(60000) });
      if (!r.ok) throw new Error(`GitHub ${r.status}`);
      const data = open(Buffer.from(await r.arrayBuffer()));
      restoreDb(data);
      st.lastPull = st.restoredAt = now();
      pushedVersion = getVersion();
      console.log(`♻️  Маълумотлар GitHub захирасидан тикланди (${REPO}/${FILE}, ${data.savedAt || "?"})`);
      return true;
    } catch (e) { fail(e); return false; }
  }

  async function doPush(force) {
    const v = getVersion();
    if (!force && v === pushedVersion) return false;
    if (sha === null) { const m = await meta(); sha = m ? m.sha : ""; }
    const buf = seal(backupData());
    const body = { message: `Ekomun zaxira ${new Date().toISOString()}`, content: buf.toString("base64"), branch: BRANCH };
    if (sha) body.sha = sha;
    let r = await fetch(API, { method: "PUT", headers: { ...headers(), "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) });
    if (r.status === 409 || r.status === 422) {
      /* sha эскирган (бошқа нусха ёзган) — янгисини олиб қайта уриниш */
      const m = await meta(); body.sha = m ? m.sha : undefined;
      r = await fetch(API, { method: "PUT", headers: { ...headers(), "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) });
    }
    if (!r.ok) throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 160)}`);
    sha = (await r.json()).content.sha;
    pushedVersion = v;
    st.lastPush = now(); st.size = buf.length; st.pushes++; st.lastError = "";
    return true;
  }
  function push(force) {
    if (!enabled) return Promise.resolve(false);
    if (busy) return busy;
    busy = doPush(force).catch((e) => { fail(e); return false; }).finally(() => { busy = null; });
    return busy;
  }
  if (enabled) setInterval(() => push(false), EVERY).unref();

  return { enabled, boot, push, status: () => ({ ...st, everyMin: EVERY / 60000 }) };
};
