/* ЭкоТаълим — сервер.
   Платформани (index.html) ва админ панелни (admin.html) беради, фойдаланувчилар
   рўйхатдан ўтиши, кириши ва чиқишини қайд этади.
   Ташқи кутубхоналарсиз ишлайди: `node server.js`.

   Созламалар (муҳит ўзгарувчилари):
     PORT            — порт (асл қиймат 3000)
     ADMIN_PASSWORD  — админ панел пароли (мажбурий)
     DATA_DIR        — маълумотлар папкаси (асл қиймат ./data)
     ONLINE_MINUTES  — фойдаланувчи неча дақиқа жим турса «офлайн» ҳисобланади (асл қиймат 3)
     SESSION_DAYS    — кириш сессияси неча кун амал қилади (асл қиймат 30)
     CONTACT_EMAIL   — махфийлик сиёсатида кўрсатиладиган алоқа почтаси
     ANDROID_PACKAGE — Google Play иловасининг пакет номи (асл қиймат uz.ekotalim.app)
     ANDROID_SHA256  — илова имзо калитининг SHA-256 изи (бир нечта бўлса вергул билан)
*/
"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const ONLINE_MS = (Number(process.env.ONLINE_MINUTES) || 3) * 60 * 1000;
const SESSION_MS = (Number(process.env.SESSION_DAYS) || 30) * 24 * 60 * 60 * 1000;
const ADMIN_SESSION_MS = 12 * 60 * 60 * 1000;
const MAX_EVENTS = 20000;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "";
const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE || "uz.ekotalim.app";
const ANDROID_SHA256 = (process.env.ANDROID_SHA256 || "").split(",").map((x) => x.trim().toUpperCase()).filter(Boolean);

if (!ADMIN_PASSWORD) {
  console.warn("⚠️  ADMIN_PASSWORD берилмаган — админ панелга кириб бўлмайди.");
}

/* ---------- Маълумотлар омбори (JSON файл) ---------- */
fs.mkdirSync(DATA_DIR, { recursive: true });
let db = { users: [], sessions: {}, events: [] };
try {
  db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, "utf8")));
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
const adminSessions = new Map(); // token → муддати

let saveTimer = null;
function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    const tmp = DB_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(db));
    fs.renameSync(tmp, DB_FILE);
  }, 200);
}
function flush() {
  if (!saveTimer) return;
  clearTimeout(saveTimer);
  saveTimer = null;
  fs.writeFileSync(DB_FILE, JSON.stringify(db));
}
process.on("SIGINT", () => { flush(); process.exit(0); });
process.on("SIGTERM", () => { flush(); process.exit(0); });

/* ---------- Ёрдамчилар ---------- */
const now = () => Date.now();
const newId = () => crypto.randomBytes(8).toString("hex");
const newToken = () => crypto.randomBytes(32).toString("base64url");

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function checkPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const a = Buffer.from(hash, "hex");
  const b = crypto.scryptSync(password, salt, 64);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || "").split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}
function cookie(name, value, maxAgeMs, req) {
  const secure = req.headers["x-forwarded-proto"] === "https" || req.socket.encrypted ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(maxAgeMs / 1000)}${secure}`;
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (fwd ? String(fwd).split(",")[0] : req.socket.remoteAddress || "").trim().replace(/^::ffff:/, "");
}

function describeDevice(ua = "") {
  const os = /Android/i.test(ua) ? "Android" : /iPhone|iPad|iOS/i.test(ua) ? "iOS"
    : /Windows/i.test(ua) ? "Windows" : /Mac OS X|Macintosh/i.test(ua) ? "macOS"
    : /Linux/i.test(ua) ? "Linux" : "Номаълум";
  const br = /Edg\//.test(ua) ? "Edge" : /OPR\/|Opera/.test(ua) ? "Opera" : /YaBrowser/.test(ua) ? "Яндекс"
    : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Браузер";
  return `${br}, ${os}`;
}

function logEvent(type, user, req, extra = {}) {
  db.events.push({
    id: newId(),
    at: now(),
    type, // register | login | logout | timeout | login_failed
    userId: user ? user.id : null,
    name: user ? user.name : extra.name || "",
    email: user ? user.email : extra.email || "",
    ip: req ? clientIp(req) : "",
    device: req ? describeDevice(req.headers["user-agent"]) : "",
    ...extra
  });
  if (db.events.length > MAX_EVENTS) db.events.splice(0, db.events.length - MAX_EVENTS);
  save();
}

function send(res, status, body, headers = {}) {
  const isJson = typeof body !== "string" && !Buffer.isBuffer(body);
  res.writeHead(status, {
    "Content-Type": isJson ? "application/json; charset=utf-8" : "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(isJson ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > 64 * 1024) { reject(new Error("too_large")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {}); }
      catch (e) { reject(new Error("bad_json")); }
    });
    req.on("error", reject);
  });
}

/* Оддий ҳимоя: бир IP дан 15 дақиқада 20 тадан ортиқ муваффақиятсиз уриниш бўлмасин */
const failures = new Map();
function tooManyFailures(ip) {
  const f = failures.get(ip);
  if (!f || now() - f.first > 15 * 60 * 1000) return false;
  return f.count >= 20;
}
function noteFailure(ip) {
  const f = failures.get(ip);
  if (!f || now() - f.first > 15 * 60 * 1000) failures.set(ip, { first: now(), count: 1 });
  else f.count++;
}

/* ---------- Сессиялар ---------- */
function currentUser(req) {
  const token = parseCookies(req).eko_session;
  const s = token && db.sessions[token];
  if (!s) return null;
  const user = db.users.find((u) => u.id === s.userId);
  if (!user) return null;
  return { token, session: s, user };
}
function startSession(user, req, res) {
  const token = newToken();
  db.sessions[token] = { userId: user.id, createdAt: now(), lastSeen: now(), ip: clientIp(req), device: describeDevice(req.headers["user-agent"]), online: true };
  user.lastLogin = now();
  user.loginCount = (user.loginCount || 0) + 1;
  logEvent("login", user, req);
  res.setHeader("Set-Cookie", cookie("eko_session", token, SESSION_MS, req));
}
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

/* Жим қолган сессияларни «офлайн» деб белгилаш ва муддати ўтганларини ўчириш */
function sweep() {
  const t = now();
  let changed = false;
  for (const [token, s] of Object.entries(db.sessions)) {
    const user = db.users.find((u) => u.id === s.userId);
    if (s.online && t - s.lastSeen > ONLINE_MS) {
      s.online = false;
      changed = true;
      if (user) db.events.push({ id: newId(), at: s.lastSeen, type: "timeout", userId: user.id, name: user.name, email: user.email, ip: s.ip, device: s.device });
    }
    if (!user || t - s.createdAt > SESSION_MS) { delete db.sessions[token]; changed = true; }
  }
  for (const [token, exp] of adminSessions) if (exp < t) adminSessions.delete(token);
  if (changed) save();
}
setInterval(sweep, 30 * 1000).unref();

function isAdmin(req) {
  const token = parseCookies(req).eko_admin;
  const exp = token && adminSessions.get(token);
  return !!exp && exp > now();
}

/* ---------- API ---------- */
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

async function api(req, res, pathname) {
  const method = req.method;
  const ip = clientIp(req);

  if (pathname === "/api/health" && method === "GET") return send(res, 200, { ok: true });

  if (pathname === "/api/me" && method === "GET") {
    const cur = currentUser(req);
    return send(res, 200, { user: cur ? publicUser(cur.user) : null });
  }

  if (pathname === "/api/register" && method === "POST") {
    const body = await readBody(req);
    const name = String(body.name || "").trim().slice(0, 60);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
    const password = String(body.password || "");
    if (name.length < 2) return send(res, 400, { error: "Исмингизни киритинг" });
    if (!EMAIL_RE.test(email)) return send(res, 400, { error: "Электрон почта нотўғри" });
    if (password.length < 6) return send(res, 400, { error: "Парол камида 6 белгидан иборат бўлсин" });
    if (db.users.some((u) => u.email === email)) return send(res, 409, { error: "Бу почта билан аллақачон рўйхатдан ўтилган" });
    const user = { id: newId(), name, email, password: hashPassword(password), createdAt: now(), lastLogin: null, loginCount: 0 };
    db.users.push(user);
    logEvent("register", user, req);
    startSession(user, req, res);
    return send(res, 201, { user: publicUser(user) });
  }

  if (pathname === "/api/login" && method === "POST") {
    if (tooManyFailures(ip)) return send(res, 429, { error: "Жуда кўп уриниш. Бироздан сўнг қайта уриниб кўринг" });
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const user = db.users.find((u) => u.email === email);
    if (!user || !checkPassword(password, user.password)) {
      noteFailure(ip);
      logEvent("login_failed", null, req, { email: email.slice(0, 254) });
      return send(res, 401, { error: "Почта ёки парол нотўғри" });
    }
    startSession(user, req, res);
    return send(res, 200, { user: publicUser(user) });
  }

  if (pathname === "/api/logout" && method === "POST") {
    const cur = currentUser(req);
    if (cur) {
      delete db.sessions[cur.token];
      logEvent("logout", cur.user, req);
    }
    res.setHeader("Set-Cookie", cookie("eko_session", "", 0, req));
    return send(res, 200, { ok: true });
  }

  /* Ҳисобни бутунлай ўчириш (Google Play талаби) */
  if (pathname === "/api/account/delete" && method === "POST") {
    const cur = currentUser(req);
    if (!cur) return send(res, 401, { error: "Аввал ҳисобга киринг" });
    const body = await readBody(req);
    if (!checkPassword(String(body.password || ""), cur.user.password)) {
      noteFailure(ip);
      return send(res, 401, { error: "Парол нотўғри" });
    }
    const id = cur.user.id;
    db.users = db.users.filter((u) => u.id !== id);
    for (const [token, s] of Object.entries(db.sessions)) if (s.userId === id) delete db.sessions[token];
    db.events = db.events.filter((e) => e.userId !== id);
    db.events.push({ id: newId(), at: now(), type: "deleted", userId: null, name: "", email: "", ip: "", device: "" });
    save();
    res.setHeader("Set-Cookie", cookie("eko_session", "", 0, req));
    return send(res, 200, { ok: true });
  }

  /* Саҳифа очиқ турганда ҳар дақиқада юборилади — «ҳозир онлайн» учун */
  if (pathname === "/api/ping" && method === "POST") {
    const cur = currentUser(req);
    if (!cur) return send(res, 200, { user: null });
    const s = cur.session;
    if (!s.online) { s.online = true; logEvent("return", cur.user, req); }
    s.lastSeen = now();
    s.ip = ip;
    save();
    return send(res, 200, { user: publicUser(cur.user) });
  }

  /* ---------- Админ ---------- */
  if (pathname === "/api/admin/login" && method === "POST") {
    if (tooManyFailures(ip)) return send(res, 429, { error: "Жуда кўп уриниш. Бироздан сўнг қайта уриниб кўринг" });
    const body = await readBody(req);
    if (!ADMIN_PASSWORD || !safeEqual(String(body.password || ""), ADMIN_PASSWORD)) {
      noteFailure(ip);
      return send(res, 401, { error: ADMIN_PASSWORD ? "Парол нотўғри" : "Серверда ADMIN_PASSWORD созланмаган" });
    }
    const token = newToken();
    adminSessions.set(token, now() + ADMIN_SESSION_MS);
    res.setHeader("Set-Cookie", cookie("eko_admin", token, ADMIN_SESSION_MS, req));
    return send(res, 200, { ok: true });
  }

  if (pathname === "/api/admin/logout" && method === "POST") {
    adminSessions.delete(parseCookies(req).eko_admin);
    res.setHeader("Set-Cookie", cookie("eko_admin", "", 0, req));
    return send(res, 200, { ok: true });
  }

  if (pathname === "/api/admin/overview" && method === "GET") {
    if (!isAdmin(req)) return send(res, 401, { error: "Админ сифатида киринг" });
    sweep();
    const t = now();
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const online = Object.values(db.sessions)
      .filter((s) => s.online && t - s.lastSeen <= ONLINE_MS)
      .map((s) => {
        const u = db.users.find((x) => x.id === s.userId);
        return { name: u.name, email: u.email, since: s.createdAt, lastSeen: s.lastSeen, ip: s.ip, device: s.device };
      })
      .sort((a, b) => b.lastSeen - a.lastSeen);
    const users = db.users
      .map((u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt, lastLogin: u.lastLogin, loginCount: u.loginCount || 0,
        online: online.some((o) => o.email === u.email) }))
      .sort((a, b) => (b.lastLogin || b.createdAt) - (a.lastLogin || a.createdAt));
    const today = db.events.filter((e) => e.at >= startOfDay.getTime());
    return send(res, 200, {
      now: t,
      onlineMinutes: ONLINE_MS / 60000,
      stats: {
        users: db.users.length,
        online: online.length,
        loginsToday: today.filter((e) => e.type === "login").length,
        logoutsToday: today.filter((e) => e.type === "logout" || e.type === "timeout").length,
        registersToday: today.filter((e) => e.type === "register").length,
        failedToday: today.filter((e) => e.type === "login_failed").length
      },
      online,
      users,
      events: db.events.slice(-600).sort((a, b) => b.at - a.at).slice(0, 500)
    });
  }

  return send(res, 404, { error: "Топилмади" });
}

/* ---------- Статик файллар ---------- */
const HTML = "text/html; charset=utf-8";
const STATIC = {
  "/": { file: "index.html", type: HTML },
  "/index.html": { file: "index.html", type: HTML },
  "/admin": { file: "admin.html", type: HTML },
  "/admin.html": { file: "admin.html", type: HTML },
  "/privacy": { file: "privacy.html", type: HTML },
  "/privacy.html": { file: "privacy.html", type: HTML },
  "/manifest.webmanifest": { file: "manifest.webmanifest", type: "application/manifest+json; charset=utf-8" },
  "/sw.js": { file: "sw.js", type: "text/javascript; charset=utf-8" },
  "/icons/icon.svg": { file: "icons/icon.svg", type: "image/svg+xml", cache: true },
  "/icons/icon-192.png": { file: "icons/icon-192.png", type: "image/png", cache: true },
  "/icons/icon-512.png": { file: "icons/icon-512.png", type: "image/png", cache: true },
  "/icons/icon-maskable-512.png": { file: "icons/icon-maskable-512.png", type: "image/png", cache: true },
  "/icons/apple-touch-icon.png": { file: "icons/apple-touch-icon.png", type: "image/png", cache: true }
};

/* Android иловаси сайтни манзил сатрисиз очиши учун (Trusted Web Activity) */
function assetLinks() {
  return [{
    relation: ["delegate_permission/common.handle_all_urls"],
    target: { namespace: "android_app", package_name: ANDROID_PACKAGE, sha256_cert_fingerprints: ANDROID_SHA256 }
  }];
}

const server = http.createServer(async (req, res) => {
  let pathname;
  try { pathname = new URL(req.url, "http://x").pathname; } catch (e) { return send(res, 400, "Bad request"); }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");

  if (pathname.startsWith("/api/")) {
    try { return await api(req, res, pathname); }
    catch (e) {
      if (e.message === "bad_json" || e.message === "too_large") return send(res, 400, { error: "Нотўғри сўров" });
      console.error(e);
      return send(res, 500, { error: "Сервер хатоси" });
    }
  }

  if (pathname === "/.well-known/assetlinks.json" && (req.method === "GET" || req.method === "HEAD")) {
    if (!ANDROID_SHA256.length) return send(res, 404, "ANDROID_SHA256 созланмаган");
    return send(res, 200, assetLinks(), { "Cache-Control": "public, max-age=3600" });
  }

  const entry = STATIC[pathname];
  if (!entry || (req.method !== "GET" && req.method !== "HEAD")) return send(res, 404, "Топилмади");
  fs.readFile(path.join(__dirname, entry.file), (err, data) => {
    if (err) return send(res, 500, "Файл ўқилмади");
    const headers = { "Content-Type": entry.type, "Cache-Control": entry.cache ? "public, max-age=604800" : "no-cache" };
    if (entry.file === "admin.html") headers["X-Frame-Options"] = "DENY";
    if (entry.file === "sw.js") headers["Service-Worker-Allowed"] = "/";
    if (entry.file === "privacy.html") {
      const contact = CONTACT_EMAIL.replace(/[&<>"']/g, "") || "сайт администратори";
      data = Buffer.from(data.toString("utf8").replaceAll("{{CONTACT_EMAIL}}", contact));
    }
    res.writeHead(200, headers);
    res.end(req.method === "HEAD" ? undefined : data);
  });
});

server.listen(PORT, () => {
  console.log(`🌿 ЭкоТаълим: http://localhost:${PORT}  ·  Админ панел: http://localhost:${PORT}/admin`);
});
