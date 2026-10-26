/* Экомун — pitch deck кўриш саҳифаси (/d/<калит>, DocSend ўрнига).
   PDF саҳифама-саҳифа pdf.js билан чизилади (/vendor/pdfjs). Ҳар бир саҳифада қанча вақт турилгани
   (фақат ойна кўриниб турганда) серверга юборилади ва Бошқарув марказидаги «Pitch deck» бўлимида кўринади. */
const $ = (s) => document.querySelector(s);
const token = location.pathname.split("/").pop();
const base = "/api/deck/" + token;
const lang = /^ru/i.test(navigator.language) ? "ru" : /^uz/i.test(navigator.language) ? "uz" : "en";
const TX = {
  uz: { gateT: "Taqdimotni ochish", gateP: "Davom etish uchun elektron pochtangizni kiriting.", email: "Elektron pochta", go: "Ochish", load: "Yuklanmoqda…",
    gone: "Havola topilmadi yoki muddati tugagan. Taqdimot muallifiga murojaat qiling.", fail: "Taqdimotni ochib bo‘lmadi. Sahifani yangilang.",
    note: "Taqdimot muallifi qaysi sahifa qancha ko‘rilganini ko‘radi.", of: "/" },
  ru: { gateT: "Открыть презентацию", gateP: "Чтобы продолжить, введите e-mail.", email: "E-mail", go: "Открыть", load: "Загрузка…",
    gone: "Ссылка не найдена или срок истёк. Свяжитесь с автором.", fail: "Не удалось открыть презентацию. Обновите страницу.",
    note: "Автор презентации видит, сколько времени просмотрена каждая страница.", of: "/" },
  en: { gateT: "Open the deck", gateP: "Enter your email to continue.", email: "Email", go: "Open", load: "Loading…",
    gone: "This link was not found or has expired. Please contact the sender.", fail: "Could not open the deck. Please reload.",
    note: "The sender can see how long each page was viewed.", of: "/" }
}[lang];
document.documentElement.lang = lang;

let pdf = null, page = 1, view = "", meta = null;
let tStart = performance.now(), visible = document.visibilityState === "visible";
const msg = (t) => { $("#dkMsg").textContent = t || ""; $("#dkMsg").hidden = !t; };

/* ---------- Вақтни ҳисоблаш ---------- */
function take() {
  const t = performance.now(), ms = visible ? Math.round(t - tStart) : 0;
  tStart = t;
  return Math.min(ms, 120000);
}
function ping(beacon) {
  if (!view || !pdf) return;
  const body = JSON.stringify({ view, page, ms: take(), pages: pdf.numPages });
  if (beacon && navigator.sendBeacon) navigator.sendBeacon(base + "/ping", new Blob([body], { type: "application/json" }));
  else fetch(base + "/ping", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}
setInterval(() => { if (visible) ping(false); }, 10000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") { ping(true); visible = false; }
  else { visible = true; tStart = performance.now(); }
});
addEventListener("pagehide", () => ping(true));

/* ---------- Чизиш ---------- */
let rendering = null;
async function draw() {
  const p = await pdf.getPage(page);
  const box = $("main").getBoundingClientRect();
  const v1 = p.getViewport({ scale: 1 });
  const scale = Math.min((box.width - 32) / v1.width, (box.height - 32) / v1.height) * (window.devicePixelRatio || 1);
  const vp = p.getViewport({ scale: Math.max(0.5, scale) });
  const c = $("#dkCanvas");
  c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
  c.style.width = Math.floor(vp.width / (window.devicePixelRatio || 1)) + "px";
  c.setAttribute("aria-label", `${meta.title} — ${page} ${TX.of} ${pdf.numPages}`);
  if (rendering) { try { rendering.cancel(); } catch (e) { /* ignore */ } }
  rendering = p.render({ canvasContext: c.getContext("2d"), viewport: vp });
  try { await rendering.promise; } catch (e) { /* бекор қилинди */ }
  $("#dkN").textContent = `${page} ${TX.of} ${pdf.numPages}`;
  $("#dkPrev").disabled = page <= 1;
  $("#dkNext").disabled = page >= pdf.numPages;
}
function go(n) {
  if (!pdf || n < 1 || n > pdf.numPages || n === page) return;
  ping(false);
  page = n;
  draw();
}

async function open(email) {
  const r = await fetch(base + "/open", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || TX.fail);
  view = d.view;
  $("#dkGate").hidden = true;
  msg(TX.load);
  const lib = await import("/vendor/pdfjs/pdf.min.mjs");
  lib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.min.mjs";
  pdf = await lib.getDocument({ url: d.file, isEvalSupported: false }).promise;
  if (meta.download) { $("#dkDl").href = d.file; $("#dkDl").hidden = false; }
  msg("");
  $("#stage").hidden = false; $("#dkBar").hidden = false;
  tStart = performance.now();
  await draw();
}

async function init() {
  $("#dkNote").textContent = TX.note;
  msg(TX.load);
  try {
    const r = await fetch(base);
    if (!r.ok) { msg(TX.gone); return; }
    meta = await r.json();
  } catch (e) { msg(TX.fail); return; }
  document.title = meta.title + " · Ekomun";
  $("#dkTitle").textContent = meta.title;
  if (meta.needEmail) {
    msg("");
    $("#dkGateT").textContent = TX.gateT; $("#dkGateP").textContent = meta.note || TX.gateP;
    $("#dkEmail").placeholder = TX.email; $("#dkEmail").setAttribute("aria-label", TX.email); $("#dkGo").textContent = TX.go;
    $("#dkGate").hidden = false; $("#dkEmail").focus();
    $("#dkGate").addEventListener("submit", async (e) => {
      e.preventDefault();
      $("#dkGo").disabled = true; $("#dkErr").textContent = "";
      try { await open($("#dkEmail").value.trim()); } catch (x) { $("#dkErr").textContent = x.message; $("#dkGo").disabled = false; }
    });
  } else {
    try { await open(""); } catch (x) { msg(x.message); }
  }
}

$("#dkPrev").addEventListener("click", () => go(page - 1));
$("#dkNext").addEventListener("click", () => go(page + 1));
$("#dkFs").addEventListener("click", () => { const el = document.documentElement; if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen().catch(() => {}); });
document.addEventListener("keydown", (e) => {
  if (e.target.closest && e.target.closest("input")) return;
  if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(page + 1); }
  if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(page - 1); }
});
let sx = 0;
$("#stage").addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
$("#stage").addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(page + (dx < 0 ? 1 : -1)); }, { passive: true });
let rz;
addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => pdf && draw(), 200); });
init();
