/* ЭкоТаълим — 🧊 3D виртуал лаборатория (мактаб ва университет).
   Учта ўлчамли саҳна vendor/three (Three.js r170, MIT) билан чизилади ва
   бўлим биринчи марта очилганда юкланади; интернет керак эмас.
   Ҳар бир тажриба илмий формулага асосланган:
     🌍 иссиқхона самараси — ΔF = 5,35·ln(C/C₀) (Myhre ва бошқ., 1998), ΔT = S·ΔF/F₂ₓ (IPCC AR6);
     ⚛️ молекулалар — тебраниш модалари ва ИҚ фаоллиги (диполь моменти ўзгариши);
     💧 тиндиргич — Стокс қонуни ва Хазен назарияси (идеал тиндириш ҳавзаси);
     ☀️ қуёш панели — қуёш геометрияси (Cooper, 1969), Kasten–Young ҳаво массаси, Meinel модели;
     🌳 дарахт ва CO₂ — Chave ва бошқ. (2014) аллометрик тенгламаси, IPCC углерод улуши 0,47.
   Матнлар uz/ru/en кўринишида шу файлда; лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const SEC = document.getElementById("lab3d");
  const ROOT = document.getElementById("l3Root");
  if (!SEC || !ROOT) return;

  /* ---------- Тил, формат, ёрдамчилар ---------- */
  /* EkoLang — index.html даги умумий const (window хусусияти эмас) */
  const EL = () => (typeof EkoLang !== "undefined" ? EkoLang : null);
  const tr = (s) => (EL() ? EL().tr(s) : s);
  const lang = () => (EL() ? EL().lang : "cyr");
  const L = (o) => {
    if (o == null) return "";
    if (typeof o === "string") return lang() === "lat" || lang() === "en" ? tr(o) : o;
    const l = lang();
    if (l === "ru") return o.ru || o.uz;
    if (l === "en") return o.en || tr(o.uz);
    if (l === "lat") return tr(o.uz);
    return o.uz;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const H = (o) => esc(L(o));
  const fmt = (v, d = 1) => {
    if (!isFinite(v)) return "—";
    const s = Math.abs(v) >= 10000 ? Math.round(v).toLocaleString("en-US").replace(/,/g, " ") : v.toFixed(d);
    return lang() === "en" ? s : s.replace(".", ",");
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const DEG = Math.PI / 180;
  const stage = () => (window.EkoProfile && EkoProfile.stage) || "uni";
  const App = () => window.EkoApp;
  const flags = () => { const a = App(); if (!a) return {}; a.state.flags = a.state.flags || {}; return a.state.flags; };
  const once = (k, n, why) => { const a = App(); if (!a) return; const f = flags(); if (!f[k]) { f[k] = true; a.addXp(n, why); } };
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Умумий матнлар ---------- */
  const TX = {
    pill: { uz: "🧊 3D лаборатория · мактаб ва университет", ru: "🧊 3D-лаборатория · школа и университет", en: "🧊 3D lab · school and university" },
    title: { uz: "3D виртуал лаборатория", ru: "3D виртуальная лаборатория", en: "3D virtual laboratory" },
    leadK: { uz: "Ер, молекула ва сувни уч ўлчамда кўринг: бармоқ билан айлантиринг, сурилмаларни суринг ва нима бўлишини кузатинг. Ҳар бир тажриба учун +5 XP.", ru: "Посмотрите на Землю, молекулы и воду в трёх измерениях: вращайте пальцем, двигайте ползунки и наблюдайте. За каждый опыт +5 XP.", en: "See the Earth, molecules and water in 3D: rotate with your finger, move the sliders and watch what happens. +5 XP for each experiment." },
    leadU: { uz: "Илмий моделларга асосланган 3D тажрибалар: параметрларни ўзгартиринг, саҳнани айлантириб кузатинг, формулани текширинг ва амалий топшириқни ечинг (+10 XP).", ru: "3D-опыты на основе научных моделей: меняйте параметры, вращайте сцену, проверяйте формулу и решайте практическое задание (+10 XP).", en: "3D experiments built on scientific models: change parameters, rotate the scene, check the formula and solve the practical task (+10 XP)." },
    hint: { uz: "🖱 Суриб айлантиринг · ＋/− яқинлаштириш", ru: "🖱 Тяните для вращения · ＋/− масштаб", en: "🖱 Drag to rotate · ＋/− zoom" },
    load: { uz: "3D саҳна юкланмоқда…", ru: "Загрузка 3D-сцены…", en: "Loading the 3D scene…" },
    noGl: { uz: "Бу қурилмада 3D (WebGL) ишламади. Браузерни янгилаб кўринг ёки бошқа қурилмадан очинг. Тажриба ҳисоб-китоблари пастда ишлайверади.", ru: "На этом устройстве 3D (WebGL) не запустился. Обновите браузер или откройте на другом устройстве. Расчёты ниже работают.", en: "3D (WebGL) did not start on this device. Update the browser or try another device. The calculations below still work." },
    rot: { uz: "Айланиш", ru: "Вращение", en: "Rotate" },
    reset: { uz: "Аввалги ҳолат", ru: "Сброс вида", en: "Reset view" },
    zin: { uz: "Яқинлаштириш", ru: "Приблизить", en: "Zoom in" },
    zout: { uz: "Узоқлаштириш", ru: "Отдалить", en: "Zoom out" },
    view: { uz: "3D кўриниш", ru: "3D-вид", en: "3D view" },
    task: { uz: "📝 Амалий машғулот", ru: "📝 Практическое занятие", en: "📝 Practical task" },
    check: { uz: "Текшириш", ru: "Проверить", en: "Check" },
    ans: { uz: "Жавоб", ru: "Ответ", en: "Answer" },
    done: { uz: "✅ Бу топшириқни бажаргансиз.", ru: "✅ Вы уже выполнили это задание.", en: "✅ You have completed this task." },
    ok: { uz: "✅ Тўғри! Жавоб ≈ ", ru: "✅ Верно! Ответ ≈ ", en: "✅ Correct! Answer ≈ " },
    no: { uz: "❌ Ҳали эмас. Маслаҳат: ", ru: "❌ Пока нет. Подсказка: ", en: "❌ Not yet. Hint: " },
    src: { uz: "📎 Манба: ", ru: "📎 Источник: ", en: "📎 Source: " },
    mission: { uz: "⭐ Вазифа", ru: "⭐ Задание", en: "⭐ Mission" },
    star: { uz: "⭐ Вазифа бажарилди! +5 XP", ru: "⭐ Задание выполнено! +5 XP", en: "⭐ Mission complete! +5 XP" },
    why: "3D лаборатория тажрибаси",
    whyU: "3D лаборатория амалий машғулоти",
    method: { uz: "Қандай илмий асос ва усул ишлатилган?", ru: "Какая научная основа и методика?", en: "What science and methods are used?" }
  };
  const METHODS = [
    ["🧊", { uz: "Виртуал лаборатория (PhET, Колорадо университети)", ru: "Виртуальная лаборатория (PhET, Университет Колорадо)", en: "Virtual lab (PhET, University of Colorado)" }, { uz: "Кўринмас жараёнларни (фотон, молекула тебраниши) кўринадиган қилади; хавфсиз ва бепул.", ru: "Делает невидимое (фотоны, колебания молекул) видимым; безопасно и бесплатно.", en: "Makes invisible processes (photons, molecular vibrations) visible; safe and free." }],
    ["🔁", { uz: "5E модели (BSCS, АҚШ)", ru: "Модель 5E (BSCS, США)", en: "5E model (BSCS, USA)" }, { uz: "Қизиқтириш → тадқиқ қилиш → тушунтириш → кенгайтириш → баҳолаш: ҳар бир тажриба шу тартибда.", ru: "Вовлечение → исследование → объяснение → расширение → оценка: каждый опыт построен так.", en: "Engage → explore → explain → elaborate → evaluate: every experiment follows this order." }],
    ["🧮", { uz: "Модель асосидаги таълим (Modeling Instruction)", ru: "Обучение через модели (Modeling Instruction)", en: "Modeling Instruction" }, { uz: "Университет режимида формула ва параметрлар очиқ: талаба моделни ўзи синайди ва чегараларини кўради.", ru: "В университетском режиме формулы открыты: студент сам проверяет модель и её границы.", en: "In university mode formulas are open: students test the model and its limits." }],
    ["🎮", { uz: "Ўйин орқали ўрганиш (мактаб)", ru: "Обучение через игру (школа)", en: "Game-based learning (school)" }, { uz: "Ҳар бир тажрибада юлдузли вазифа ва XP; хато қилиш мумкин, қайта уриниш бепул.", ru: "В каждом опыте задание со звездой и XP; ошибаться можно, повтор бесплатный.", en: "Every experiment has a star mission and XP; mistakes are fine, retries are free." }]
  ];

  /* ---------- Three.js юклаш ---------- */
  let THREE = null, threeP = null;
  function loadThree() {
    if (!threeP) threeP = import("/vendor/three/three.module.min.js").then((m) => (THREE = m));
    return threeP;
  }

  /* ---------- 3D кўрувчи: рендер, камера, айлантириш ---------- */
  class View {
    constructor(host, opts = {}) {
      const T = THREE;
      this.host = host;
      this.renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.canvas = this.renderer.domElement;
      this.canvas.className = "l3-canvas";
      this.canvas.tabIndex = 0;
      this.canvas.setAttribute("role", "img");
      host.appendChild(this.canvas);
      this.scene = new T.Scene();
      this.scene.background = new T.Color(opts.bg || "#0b1324");
      this.camera = new T.PerspectiveCamera(45, 4 / 3, 0.05, 200);
      this.target = new T.Vector3(...(opts.target || [0, 0, 0]));
      this.home = { th: opts.th ?? 0.6, ph: opts.ph ?? 1.15, d: opts.d ?? 4 };
      Object.assign(this, { th: this.home.th, ph: this.home.ph, d: this.home.d });
      this.minD = opts.minD || 1.5; this.maxD = opts.maxD || 14;
      this.auto = !reduce && opts.auto !== false;
      this.updaters = [];
      this.running = false; this.raf = 0; this.last = 0; this.t = 0;
      this.scene.add(new T.HemisphereLight(0xffffff, 0x334155, 1.1));
      const sun = new T.DirectionalLight(0xffffff, 1.6);
      sun.position.set(5, 8, 6);
      this.scene.add(sun);
      this.bindInput();
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(host);
      this.resize();
      this.place();
    }
    bindInput() {
      const c = this.canvas, pts = new Map();
      let lx = 0, ly = 0;
      c.addEventListener("pointerdown", (e) => {
        pts.set(e.pointerId, e); lx = e.clientX; ly = e.clientY; this.moved = 0;
        if (e.pointerType === "mouse") c.setPointerCapture(e.pointerId);
      });
      c.addEventListener("pointermove", (e) => {
        if (!pts.has(e.pointerId)) return;
        const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
        this.moved += Math.abs(dx) + Math.abs(dy);
        this.th -= dx * 0.008;
        if (e.pointerType === "mouse") this.ph = clamp(this.ph - dy * 0.008, 0.15, 1.52);
        this.auto = false; this.syncAuto(); this.place();
      });
      const up = (e) => { pts.delete(e.pointerId); };
      c.addEventListener("pointerup", (e) => { up(e); if (this.moved < 6 && this.onTap) this.onTap(e); });
      c.addEventListener("pointercancel", up);
      c.addEventListener("wheel", (e) => { e.preventDefault(); this.zoom(e.deltaY > 0 ? 1.1 : 0.9); }, { passive: false });
      c.addEventListener("keydown", (e) => {
        const k = { ArrowLeft: [0.12, 0], ArrowRight: [-0.12, 0], ArrowUp: [0, 0.08], ArrowDown: [0, -0.08] }[e.key];
        if (k) { e.preventDefault(); this.th += k[0]; this.ph = clamp(this.ph + k[1], 0.15, 1.52); this.auto = false; this.syncAuto(); this.place(); }
        if (e.key === "+" || e.key === "=") this.zoom(0.9);
        if (e.key === "-") this.zoom(1.1);
      });
    }
    syncAuto() { if (this.autoBtn) this.autoBtn.classList.toggle("on", this.auto); }
    zoom(f) { this.d = clamp(this.d * f, this.minD, this.maxD); this.place(); }
    resetView() { Object.assign(this, { th: this.home.th, ph: this.home.ph, d: this.home.d }); this.place(); }
    place() {
      const s = Math.sin(this.ph);
      this.camera.position.set(this.target.x + this.d * s * Math.sin(this.th), this.target.y + this.d * Math.cos(this.ph), this.target.z + this.d * s * Math.cos(this.th));
      this.camera.lookAt(this.target);
      if (!this.running) this.render();
    }
    resize() {
      const w = this.host.clientWidth || 320, h = this.host.clientHeight || 240;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.render();
    }
    render() { this.renderer.render(this.scene, this.camera); }
    start() {
      if (this.running) return;
      this.running = true; this.last = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        const dt = clamp((now - this.last) / 1000, 0, 0.1); this.last = now; this.t += dt;
        if (this.auto) { this.th += dt * 0.25; this.place(); }
        this.updaters.forEach((f) => f(dt, this.t));
        this.render();
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }
    stop() { this.running = false; cancelAnimationFrame(this.raf); }
    dispose() {
      this.stop();
      this.ro.disconnect();
      this.scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        const m = o.material;
        (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => { if (x.map) x.map.dispose(); x.dispose(); });
      });
      this.renderer.dispose();
      if (this.renderer.forceContextLoss) this.renderer.forceContextLoss();
      this.canvas.remove();
    }
  }

  /* ---------- Саҳна ёрдамчилари ---------- */
  function textSprite(text, color = "#ffffff", size = 0.32) {
    const T = THREE, c = document.createElement("canvas"), g = c.getContext("2d");
    const font = "700 56px Onest, system-ui, sans-serif";
    g.font = font;
    const w = Math.ceil(g.measureText(text).width) + 24;
    c.width = w; c.height = 76;
    g.font = font; g.textAlign = "center"; g.textBaseline = "middle";
    g.lineWidth = 8; g.strokeStyle = "rgba(0,0,0,.55)"; g.strokeText(text, w / 2, 40);
    g.fillStyle = color; g.fillText(text, w / 2, 40);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    s.scale.set((size * w) / 76, size, 1);
    s.renderOrder = 10;
    return s;
  }
  function cylinderBetween(a, b, r, mat) {
    const T = THREE, dir = new T.Vector3().subVectors(b, a), len = dir.length();
    const m = new T.Mesh(new T.CylinderGeometry(r, r, len, 14), mat);
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize());
    return m;
  }
  function setCyl(m, a, b) {
    const T = THREE, dir = new T.Vector3().subVectors(b, a), len = dir.length() || 1e-6;
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.scale.set(1, len / m.geometry.parameters.height, 1);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize());
  }
  /* Сфера юзасидаги қитъалар учун 3D қиймат шовқини (тикувсиз текстура) */
  function earthTexture() {
    const T = THREE, W = 384, Hh = 192, c = document.createElement("canvas");
    c.width = W; c.height = Hh;
    const g = c.getContext("2d"), img = g.createImageData(W, Hh);
    const hash = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
    const sm = (t) => t * t * (3 - 2 * t);
    const noise = (x, y, z) => {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
      let v = 0;
      for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++)
        v += hash(xi + dx, yi + dy, zi + dz) * (dx ? xf : 1 - xf) * (dy ? yf : 1 - yf) * (dz ? zf : 1 - zf);
      return v;
    };
    for (let j = 0; j < Hh; j++) {
      const lat = (0.5 - j / Hh) * Math.PI;
      for (let i = 0; i < W; i++) {
        const lon = (i / W) * 2 * Math.PI, x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
        let n = 0, a = 0.5, f = 1.6;
        for (let o = 0; o < 4; o++) { n += a * noise(x * f + 11, y * f + 7, z * f + 3); a *= 0.5; f *= 2.1; }
        const k = (j * W + i) * 4, polar = Math.abs(y) > 0.86;
        let r, gg, b;
        if (polar) { r = 236; gg = 244; b = 250; }
        else if (n > 0.52) { const d = Math.abs(y) < 0.35 && n < 0.6 ? 1 : 0; r = d ? 196 : 70; gg = d ? 170 : 140; b = d ? 110 : 70; if (n > 0.66) { r = 150; gg = 130; b = 100; } }
        else { r = 20; gg = 80 + n * 120; b = 150 + n * 120; }
        img.data[k] = r; img.data[k + 1] = gg; img.data[k + 2] = b; img.data[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }

  /* ---------- Амалий топшириқ ва мактаб вазифаси ---------- */
  function taskBox(box, id, q, ans, tol, unit, hint, dec = 2) {
    const done = flags()["l3t_" + id];
    box.innerHTML = `<h4>${H(TX.task)}</h4><p>${H(q)}</p>
      <div class="ev-tools"><input class="l3-in" inputmode="decimal" placeholder="${H(TX.ans)}, ${esc(unit)}" aria-label="${H(TX.ans)}"><button class="btn btn-primary btn-sm" type="button">${H(TX.check)}</button></div>
      <p class="small" aria-live="polite">${done ? H(TX.done) : ""}</p>`;
    const inp = box.querySelector("input"), msg = box.querySelector("p.small");
    const go = () => {
      const v = parseFloat(inp.value.replace(/\s/g, "").replace(",", "."));
      const ok = isFinite(v) && Math.abs(v - ans) <= tol;
      msg.textContent = ok ? L(TX.ok) + fmt(ans, dec) + " " + unit : L(TX.no) + L(hint);
      if (ok) once("l3t_" + id, 10, TX.whyU);
    };
    box.querySelector("button").addEventListener("click", go);
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
  }
  function star(id, el) {
    if (!flags()["l3k_" + id]) { once("l3k_" + id, 5, TX.why); }
    if (el) { el.textContent = L(TX.star); el.classList.add("l3-star-on"); }
  }

  /* =====================================================================
     1) 🌍 Иссиқхона самараси
     ===================================================================== */
  const GH = {
    id: "issiq", icon: "🌍",
    name: { uz: "Иссиқхона самараси", ru: "Парниковый эффект", en: "Greenhouse effect" },
    q: { uz: "Ҳавода CO₂ кўпайса, Ердан чиқаётган иссиқлик нурлари қаерга кетади?", ru: "Куда уходят тепловые лучи Земли, если в воздухе становится больше CO₂?", en: "Where does Earth's heat radiation go when there is more CO₂ in the air?" },
    src: "Myhre et al., 1998 (GRL 25:2715); IPCC AR6 WG1, 2021, ch. 7; NOAA Mauna Loa CO₂",
    view: { bg: "#050b1a", d: 5.2, ph: 1.25, th: 0.9 },
    presets: [
      [180, { uz: "Музлик даври", ru: "Ледниковый период", en: "Ice age" }, { uz: "20 минг йил олдин", ru: "20 тыс. лет назад", en: "20,000 years ago" }],
      [280, { uz: "Саноатгача", ru: "Доиндустриальный", en: "Pre-industrial" }, { uz: "1750 йил", ru: "1750 год", en: "year 1750" }],
      [425, { uz: "Бугун", ru: "Сегодня", en: "Today" }, { uz: "2024 йил, NOAA", ru: "2024 год, NOAA", en: "2024, NOAA" }],
      [560, { uz: "Икки баравар", ru: "Удвоение", en: "Doubled" }, { uz: "2×280 ppm", ru: "2×280 ppm", en: "2×280 ppm" }],
      [870, { uz: "2100 (юқори эмиссия)", ru: "2100 (высокие выбросы)", en: "2100 (high emissions)" }, { uz: "SSP3-7.0 сценарийси", ru: "сценарий SSP3-7.0", en: "SSP3-7.0 scenario" }]
    ],
    build(v, ui) {
      const T = THREE, S = { C: 425, ecs: 3, seen: new Set([425]) };
      const earth = new T.Mesh(new T.SphereGeometry(1, 64, 48), new T.MeshStandardMaterial({ map: earthTexture(), roughness: 0.9, emissive: new T.Color(0xff3300), emissiveIntensity: 0 }));
      v.scene.add(earth);
      const atm = new T.Mesh(new T.SphereGeometry(1.18, 48, 32), new T.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.12, depthWrite: false, side: T.DoubleSide }));
      v.scene.add(atm);
      const sunM = new T.Mesh(new T.SphereGeometry(0.35, 24, 16), new T.MeshBasicMaterial({ color: 0xffd34d }));
      sunM.position.set(4.2, 0.6, 0); v.scene.add(sunM);
      const starsG = new T.BufferGeometry(), sp = [];
      for (let i = 0; i < 400; i++) { const u = Math.random() * 2 - 1, a = Math.random() * 6.283, r = 30; sp.push(r * Math.sqrt(1 - u * u) * Math.cos(a), r * u, r * Math.sqrt(1 - u * u) * Math.sin(a)); }
      starsG.setAttribute("position", new T.Float32BufferAttribute(sp, 3));
      v.scene.add(new T.Points(starsG, new T.PointsMaterial({ color: 0xffffff, size: 0.08 })));
      /* Фотонлар: сариқ — қуёш нури, қизил — Ердан чиқадиган инфрақизил нур */
      const geo = new T.SphereGeometry(0.026, 8, 6);
      const mSun = new T.MeshBasicMaterial({ color: 0xfde047 }), mIr = new T.MeshBasicMaterial({ color: 0xef4444 }), mBack = new T.MeshBasicMaterial({ color: 0xfb923c });
      const ph = [];
      for (let i = 0; i < 70; i++) { const m = new T.Mesh(geo, mSun); v.scene.add(m); ph.push({ m, p: new T.Vector3(), d: new T.Vector3(), k: 0 }); }
      let trapped = 0, escaped = 0;
      const spawnSun = (o) => {
        o.k = 0; o.m.material = mSun;
        const y = (Math.random() * 2 - 1) * 0.9, z = (Math.random() * 2 - 1) * 0.9;
        o.p.set(4 + Math.random() * 1.5, y, z); o.d.set(-1, 0, 0);
      };
      const emitIr = (o, n) => {
        o.k = 1; o.m.material = mIr;
        o.d.copy(n).add(new T.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.2)).normalize();
        if (o.d.dot(n) < 0.1) o.d.add(n).normalize();
        o.p.copy(n).multiplyScalar(1.01);
      };
      ph.forEach((o, i) => { spawnSun(o); o.p.x += i * 0.07; });
      const forcing = () => 5.35 * Math.log(S.C / 280);
      const dT = () => (S.ecs * forcing()) / (5.35 * Math.LN2);
      const trapP = () => clamp(0.18 + 0.55 * Math.log(S.C / 150) / Math.log(1200 / 150), 0.1, 0.8);
      v.updaters.push((dt) => {
        const sp = 1.8 * dt;
        ph.forEach((o) => {
          o.p.addScaledVector(o.d, sp);
          const r = o.p.length();
          if (o.k === 0 && r <= 1) {
            if (Math.random() < 0.3) { o.k = 3; o.d.reflect(o.p.clone().normalize()); o.m.material = mSun; }
            else emitIr(o, o.p.clone().normalize());
          } else if (o.k === 1 && r >= 1.18 && r < 1.22) {
            if (Math.random() < trapP()) { o.k = 2; o.m.material = mBack; o.d.copy(o.p).normalize().negate().add(new T.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.6)).normalize(); trapped++; }
            else { o.k = 4; escaped++; }
          } else if (o.k === 2 && r <= 1) emitIr(o, o.p.clone().normalize());
          if (r > 6.5) spawnSun(o);
          o.m.position.copy(o.p);
        });
        earth.rotation.y += dt * 0.15;
      });
      const draw = () => {
        const f = clamp((S.C - 180) / (1000 - 180), 0, 1), t = dT();
        atm.material.opacity = 0.06 + f * 0.34;
        atm.material.color.setHSL(lerp(0.56, 0.06, f * f), 0.85, lerp(0.72, 0.58, f));
        earth.material.emissiveIntensity = clamp((t - 0.8) / 8, 0, 0.35);
        ui.render();
      };
      ui.html = () => {
        const t = dT(), uni = stage() === "uni";
        const pre = this.presets.map(([c, n, d]) => `<button type="button" class="sg-opt l3-pre ${c === S.C ? "sel" : ""}" data-c="${c}"><b>${c} ppm</b><span>${H(n)}</span><small>${H(d)}</small></button>`).join("");
        const face = t < -1 ? "🥶" : t < 0.8 ? "😊" : t < 2.2 ? "😓" : t < 3.5 ? "🥵" : "🔥";
        const kid = {
          uz: t < -1 ? "CO₂ кам — иссиқлик осонгина космосга қочади, Ер совийди." : t < 0.8 ? "Табиий иссиқхона самараси: ҳаво «адёл» каби Ерни иситади (усиз Ер −18 °C бўларди)." : t < 2.2 ? "Адёл қалинлашди: қизил нурларнинг кўпроғи Ерга қайтмоқда, Ер исимоқда." : "Жуда қалин адёл! Иссиқ кунлар, қурғоқчилик, музликлар эриши кучаяди. Энергияни тежаш ва дарахт экиш ёрдам беради.",
          ru: t < -1 ? "Мало CO₂ — тепло легко уходит в космос, Земля остывает." : t < 0.8 ? "Естественный парниковый эффект: воздух греет Землю как «одеяло» (без него было бы −18 °C)." : t < 2.2 ? "Одеяло стало толще: больше красных лучей возвращается к Земле, она нагревается." : "Очень толстое одеяло! Больше жары, засух и таяния ледников. Помогают экономия энергии и посадка деревьев.",
          en: t < -1 ? "Little CO₂: heat escapes to space easily and the Earth cools." : t < 0.8 ? "The natural greenhouse effect: air keeps the Earth warm like a blanket (without it, −18 °C)." : t < 2.2 ? "The blanket got thicker: more red rays return to the Earth and it warms." : "A very thick blanket! More heat waves, droughts and melting glaciers. Saving energy and planting trees help."
        };
        const legend = `<div class="l3-legend"><span><i style="background:#fde047"></i>${H({ uz: "Қуёш нури", ru: "Солнечный свет", en: "Sunlight" })}</span><span><i style="background:#ef4444"></i>${H({ uz: "Иссиқлик (ИҚ) нури", ru: "Тепловое (ИК) излучение", en: "Heat (IR) radiation" })}</span><span><i style="background:#fb923c"></i>${H({ uz: "Ерга қайтган иссиқлик", ru: "Тепло, вернувшееся к Земле", en: "Heat sent back to Earth" })}</span></div>`;
        if (!uni) return `<div class="l3-pres">${pre}</div>${legend}
          <div class="l3-big"><span>${face}</span><b>${t >= 0 ? "+" : ""}${fmt(t, 1)} °C</b></div>
          <p class="lab-out">${H(kid)}</p>
          <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "5 та даврни ҳам босиб кўринг ва Ер ҳароратини солиштиринг.", ru: "Нажмите все 5 эпох и сравните температуру Земли.", en: "Press all 5 eras and compare Earth's temperature." })} (${S.seen.size}/5)</p>`;
        return `<label>CO₂: <b>${S.C} ppm</b><input type="range" data-k="C" min="180" max="1200" step="5" value="${S.C}"></label>
          <label>${H({ uz: "Иқлим сезгирлиги S (ECS)", ru: "Чувствительность климата S (ECS)", en: "Climate sensitivity S (ECS)" })}: <b>${fmt(S.ecs, 1)} °C</b><input type="range" data-k="ecs" min="2" max="5" step="0.1" value="${S.ecs}"></label>
          <div class="l3-pres mini">${pre}</div>${legend}
          <div class="lab-formula">ΔF = 5,35 · ln(C / 280) = <b>${fmt(forcing(), 2)}</b> W/m²<br>ΔT<sub>eq</sub> = S · ΔF / F<sub>2×</sub> = <b>${t >= 0 ? "+" : ""}${fmt(t, 2)}</b> °C &nbsp;(F<sub>2×</sub> = 5,35·ln2 ≈ 3,71 W/m²)</div>
          <p class="small muted">${H({ uz: "Бу фақат CO₂ нинг мувозанат таъсири. Ҳақиқий исиш метан, аэрозоллар ва океан инерциясига ҳам боғлиқ. IPCC AR6: S = 3 °C (жуда эҳтимолли оралиқ 2–5 °C). Саҳнада ушланган нурлар улуши сифатий кўрсатилган.", ru: "Это только равновесный эффект CO₂. Реальное потепление зависит ещё от метана, аэрозолей и инерции океана. IPCC AR6: S = 3 °C (очень вероятно 2–5 °C). Доля задержанных лучей в сцене показана качественно.", en: "This is CO₂'s equilibrium effect only. Real warming also depends on methane, aerosols and ocean inertia. IPCC AR6: S = 3 °C (very likely 2–5 °C). The trapped-ray share in the scene is qualitative." })}</p>
          <p class="small">${H({ uz: "Саҳна ҳисобчиси", ru: "Счётчик сцены", en: "Scene counter" })}: ${H({ uz: "қайтган", ru: "вернулось", en: "returned" })} <b data-tr>${trapped}</b> · ${H({ uz: "қочган", ru: "ушло", en: "escaped" })} <b data-es>${escaped}</b></p>`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => {
          S.C = +b.dataset.c; S.seen.add(S.C); draw();
          if (S.seen.size >= 5 && stage() !== "uni") star("issiq", ui.el.querySelector("[data-star]"));
        }));
        el.querySelectorAll("input[data-k]").forEach((r) => r.addEventListener("input", () => { S[r.dataset.k] = +r.value; draw(); }));
      };
      ui.task = () => ({ q: { uz: "Бугун C = 425 ppm, иқлим сезгирлиги S = 3 °C. Фақат CO₂ ҳисобига мувозанат исиши ΔT неча °C? (C₀ = 280 ppm, F₂× = 5,35·ln2)", ru: "Сегодня C = 425 ppm, чувствительность S = 3 °C. Каково равновесное потепление ΔT только от CO₂, °C? (C₀ = 280 ppm, F₂× = 5,35·ln2)", en: "Today C = 425 ppm and sensitivity S = 3 °C. What is the equilibrium warming ΔT from CO₂ alone, °C? (C₀ = 280 ppm, F₂× = 5.35·ln2)" }, a: (3 * Math.log(425 / 280)) / Math.LN2, tol: 0.05, unit: "°C", hint: { uz: "ΔT = S · ln(C/C₀) / ln2", ru: "ΔT = S · ln(C/C₀) / ln2", en: "ΔT = S · ln(C/C₀) / ln2" } });
      let tick = 0;
      v.updaters.push((dt) => { tick += dt; if (tick < 1) return; tick = 0; const a = ui.el.querySelector("[data-tr]"), b = ui.el.querySelector("[data-es]"); if (a) { a.textContent = trapped; b.textContent = escaped; } });
      draw();
    }
  };

  /* =====================================================================
     2) ⚛️ Молекулалар ва инфрақизил нур
     ===================================================================== */
  const A = { C: [0x3f3f46, 0.36], O: [0xef4444, 0.34], H: [0xf8fafc, 0.24], N: [0x3b82f6, 0.35] };
  const r3 = (x, y, z) => [x, y, z];
  const tet = 1.087 / Math.sqrt(3);
  const MOL = {
    co2: { f: "CO₂", n: { uz: "Карбонат ангидрид", ru: "Углекислый газ", en: "Carbon dioxide" }, at: [["C", r3(0, 0, 0), 0.7], ["O", r3(-1.16, 0, 0), -0.35], ["O", r3(1.16, 0, 0), -0.35]], b: [[0, 1, 2], [0, 2, 2]],
      gwp: "1", life: { uz: "юзлаб–минглаб йил", ru: "сотни–тысячи лет", en: "centuries to millennia" }, share: "≈ 0,042% (420+ ppm)", gh: true,
      modes: [["bend", 667, true, [[0, 0.25, 0], [0, -0.125, 0], [0, -0.125, 0]]], ["asym", 2349, true, [[0.2, 0, 0], [-0.1, 0, 0], [-0.1, 0, 0]]], ["sym", 1388, false, [[0, 0, 0], [-0.18, 0, 0], [0.18, 0, 0]]]] },
    ch4: { f: "CH₄", n: { uz: "Метан", ru: "Метан", en: "Methane" }, at: [["C", r3(0, 0, 0), -0.4], ["H", r3(tet, tet, tet), 0.1], ["H", r3(tet, -tet, -tet), 0.1], ["H", r3(-tet, tet, -tet), 0.1], ["H", r3(-tet, -tet, tet), 0.1]], b: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
      gwp: "27,9 (fossil 29,8)", life: { uz: "≈ 11,8 йил", ru: "≈ 11,8 года", en: "≈ 11.8 years" }, share: "≈ 1,9 ppm", gh: true,
      modes: [["bend", 1306, true, [[0, 0.1, 0], [0.2, 0, -0.2], [-0.2, 0, 0.2], [0.2, 0, 0.2], [-0.2, 0, -0.2]]], ["asym", 3019, true, [[0.08, 0, 0], [-0.22, 0, 0], [-0.22, 0, 0], [0.12, 0, 0], [0.12, 0, 0]]]] },
    n2o: { f: "N₂O", n: { uz: "Азот (I) оксиди", ru: "Закись азота", en: "Nitrous oxide" }, at: [["N", r3(-1.128, 0, 0), -0.15], ["N", r3(0, 0, 0), 0.45], ["O", r3(1.184, 0, 0), -0.3]], b: [[0, 1, 3], [1, 2, 1]],
      gwp: "273", life: { uz: "≈ 109 йил", ru: "≈ 109 лет", en: "≈ 109 years" }, share: "≈ 0,34 ppm", gh: true,
      modes: [["bend", 589, true, [[0, -0.12, 0], [0, 0.24, 0], [0, -0.12, 0]]], ["sym", 1285, true, [[-0.14, 0, 0], [0, 0, 0], [0.14, 0, 0]]], ["asym", 2224, true, [[-0.16, 0, 0], [0.2, 0, 0], [-0.04, 0, 0]]]] },
    h2o: { f: "H₂O", n: { uz: "Сув буғи", ru: "Водяной пар", en: "Water vapour" }, at: [["O", r3(0, 0.12, 0), -0.8], ["H", r3(-0.757, -0.466, 0), 0.4], ["H", r3(0.757, -0.466, 0), 0.4]], b: [[0, 1, 1], [0, 2, 1]],
      gwp: { uz: "— (қайтар алоқа)", ru: "— (обратная связь)", en: "— (feedback)" }, life: { uz: "≈ 9 кун", ru: "≈ 9 дней", en: "≈ 9 days" }, share: "0–4%", gh: true,
      modes: [["bend", 1595, true, [[0, 0, 0], [0.18, -0.12, 0], [-0.18, -0.12, 0]]], ["sym", 3657, true, [[0, 0.04, 0], [-0.15, -0.1, 0], [0.15, -0.1, 0]]], ["asym", 3756, true, [[0.03, 0, 0], [-0.17, 0.1, 0], [-0.17, -0.1, 0]]]] },
    o3: { f: "O₃", n: { uz: "Озон", ru: "Озон", en: "Ozone" }, at: [["O", r3(0, 0.45, 0), 0.2], ["O", r3(-1.089, -0.22, 0), -0.1], ["O", r3(1.089, -0.22, 0), -0.1]], b: [[0, 1, 1.5], [0, 2, 1.5]],
      gwp: { uz: "— (қисқа яшайди)", ru: "— (короткоживущий)", en: "— (short-lived)" }, life: { uz: "кунлар–ҳафталар", ru: "дни–недели", en: "days to weeks" }, share: "≈ 0,03 ppm", gh: true,
      modes: [["asym", 1042, true, [[0.12, 0, 0], [-0.06, 0.08, 0], [-0.06, -0.08, 0]]], ["bend", 701, true, [[0, -0.2, 0], [0.12, 0.1, 0], [-0.12, 0.1, 0]]]] },
    n2: { f: "N₂", n: { uz: "Азот", ru: "Азот", en: "Nitrogen" }, at: [["N", r3(-0.549, 0, 0), 0], ["N", r3(0.549, 0, 0), 0]], b: [[0, 1, 3]],
      gwp: "0", life: "—", share: "78,08%", gh: false, modes: [["sym", 2331, false, [[-0.16, 0, 0], [0.16, 0, 0]]]] },
    o2: { f: "O₂", n: { uz: "Кислород", ru: "Кислород", en: "Oxygen" }, at: [["O", r3(-0.604, 0, 0), 0], ["O", r3(0.604, 0, 0), 0]], b: [[0, 1, 2]],
      gwp: "0", life: "—", share: "20,95%", gh: false, modes: [["sym", 1556, false, [[-0.16, 0, 0], [0.16, 0, 0]]]] }
  };
  const MODE_N = {
    bend: { uz: "эгилиш", ru: "деформационное", en: "bending" },
    sym: { uz: "симметрик чўзилиш", ru: "симметричное валентное", en: "symmetric stretch" },
    asym: { uz: "носимметрик чўзилиш", ru: "антисимметричное валентное", en: "asymmetric stretch" }
  };
  const MOLS = {
    id: "molekula", icon: "⚛️",
    name: { uz: "Молекулалар ва ИҚ нур", ru: "Молекулы и ИК-излучение", en: "Molecules and IR light" },
    q: { uz: "Нега азот ва кислород Ерни иситмайди, CO₂ ва метан эса иситади?", ru: "Почему азот и кислород не греют Землю, а CO₂ и метан греют?", en: "Why don't nitrogen and oxygen warm the Earth, while CO₂ and methane do?" },
    src: "NIST Chemistry WebBook (bond lengths, vibrational frequencies); IPCC AR6 WG1, 2021, Table 7.15 (GWP-100, lifetimes); NOAA GML",
    view: { bg: "#0b1220", d: 4.4, ph: 1.3, th: 0.5, minD: 2.2, maxD: 9 },
    build(v, ui) {
      const T = THREE, S = { m: "co2", mode: 0, tried: new Set(), photon: -1, absorbed: false, amp: 1 };
      const grp = new T.Group(); v.scene.add(grp);
      const SC = 1.25;
      let atoms = [], bonds = [], dip, base = [];
      const wave = new T.Line(new T.BufferGeometry(), new T.LineBasicMaterial({ color: 0xf87171 }));
      v.scene.add(wave);
      const bondMat = new T.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 });
      const dipMat = new T.MeshBasicMaterial({ color: 0x22d3ee });
      function make() {
        while (grp.children.length) { const c = grp.children.pop(); c.geometry && c.geometry.dispose(); }
        const M = MOL[S.m];
        base = M.at.map(([, p]) => new T.Vector3(...p).multiplyScalar(SC));
        atoms = M.at.map(([el], i) => { const [col, r] = A[el]; const m = new T.Mesh(new T.SphereGeometry(r, 32, 24), new T.MeshStandardMaterial({ color: col, roughness: 0.35, metalness: 0.05 })); m.position.copy(base[i]); grp.add(m); const lb = textSprite(el, "#fff", 0.28); lb.position.set(0, r + 0.18, 0); m.add(lb); return m; });
        bonds = [];
        M.b.forEach(([a, b, o]) => {
          const n = Math.round(o) || 1, off = n === 1 ? [0] : n === 2 ? [-0.07, 0.07] : [-0.1, 0, 0.1];
          off.forEach((dz) => { const c = cylinderBetween(base[a], base[b], n === 1 ? 0.07 : 0.045, bondMat); grp.add(c); bonds.push([c, a, b, dz]); });
        });
        dip = new T.ArrowHelper(new T.Vector3(0, 1, 0), new T.Vector3(0, 0, 0.9), 0.5, 0x22d3ee, 0.2, 0.14);
        dip.line.material = dipMat; dip.cone.material = dipMat;
        grp.add(dip);
      }
      const tmpA = new T.Vector3(), tmpB = new T.Vector3(), side = new T.Vector3();
      v.updaters.push((dt, t) => {
        const M = MOL[S.m], md = M.modes[S.mode], disp = md[3];
        const w = Math.sin(t * 6) * S.amp * (S.absorbed ? 1.8 : 1);
        atoms.forEach((a, i) => { const d = disp[i] || [0, 0, 0]; a.position.set(base[i].x + d[0] * w, base[i].y + d[1] * w, base[i].z + d[2] * w); });
        bonds.forEach(([c, a, b, dz]) => {
          tmpA.copy(atoms[a].position); tmpB.copy(atoms[b].position);
          side.set(0, 0, dz); tmpA.add(side); tmpB.add(side);
          setCyl(c, tmpA, tmpB);
        });
        /* Диполь моменти μ = Σ qᵢ·rᵢ (қисман зарядлар билан) */
        const mu = new T.Vector3();
        M.at.forEach(([, , q], i) => mu.addScaledVector(atoms[i].position, q));
        const len = mu.length();
        dip.visible = len > 0.02;
        if (dip.visible) { dip.setDirection(mu.clone().normalize()); dip.setLength(0.35 + len * 2.2, 0.2, 0.14); }
        /* ИҚ фотони (тўлқин чизиғи) */
        if (S.photon >= 0) {
          S.photon += dt * 1.6;
          const z0 = -4 + S.photon * 2.2, pts = [];
          const active = md[2];
          const stopAt = active ? 0 : 99;
          for (let i = 0; i <= 60; i++) { const z = z0 - i * 0.04; if (z > stopAt) continue; pts.push(new T.Vector3(0.18 * Math.sin(z * 9), 0, z)); }
          wave.geometry.dispose(); wave.geometry = new T.BufferGeometry().setFromPoints(pts.length > 1 ? pts : [new T.Vector3(), new T.Vector3()]);
          if (active && z0 > 0.1 && !S.absorbed) { S.absorbed = true; ui.after(true); }
          if (!active && z0 > 4) { S.photon = -1; ui.after(false); }
          if (active && z0 - 2.4 > 0) { S.photon = -1; setTimeout(() => { S.absorbed = false; }, 1600); }
        } else if (wave.geometry.attributes.position && wave.geometry.attributes.position.count > 2) { wave.geometry.dispose(); wave.geometry = new T.BufferGeometry(); }
      });
      ui.html = () => {
        const M = MOL[S.m], uni = stage() === "uni";
        const tabs = Object.entries(MOL).map(([k, m]) => `<button type="button" class="chip ${k === S.m ? "active" : ""}" data-m="${k}">${m.f}</button>`).join("");
        const modes = M.modes.map(([n, nu, act], i) => `<button type="button" class="chip ${i === S.mode ? "active" : ""}" data-mode="${i}">${H(MODE_N[n])}${uni ? ` · ${nu} cm⁻¹` : ""} ${act ? "🔴" : "⚪"}</button>`).join("");
        const md = M.modes[S.mode];
        const act = md[2];
        const info = uni
          ? `<table class="lab-table l3-tab"><tr><th>${H({ uz: "Ҳаводаги улуши", ru: "Доля в воздухе", en: "Share in air" })}</th><td>${esc(M.share)}</td></tr><tr><th>GWP-100 (AR6)</th><td>${H(M.gwp)}</td></tr><tr><th>${H({ uz: "Атмосферада яшаш", ru: "Время жизни", en: "Lifetime" })}</th><td>${H(M.life)}</td></tr><tr><th>${H({ uz: "Тебраниш", ru: "Колебание", en: "Vibration" })}</th><td>ν̃ = ${md[1]} cm⁻¹ → λ = 10⁴/ν̃ = <b>${fmt(1e4 / md[1], 2)}</b> µm</td></tr></table>`
          : "";
        const verdict = act
          ? { uz: "🔴 Тебранганда диполь (кўк ўқ) ўзгаради → молекула инфрақизил нурни ютади ва иссиқликни ушлайди.", ru: "🔴 При колебании диполь (голубая стрелка) меняется → молекула поглощает ИК-излучение и удерживает тепло.", en: "🔴 The dipole (cyan arrow) changes as it vibrates → the molecule absorbs infrared light and traps heat." }
          : { uz: "⚪ Тебранганда диполь пайдо бўлмайди → ИҚ нур ўтиб кетади. Шунинг учун N₂ ва O₂ иссиқхона гази эмас.", ru: "⚪ При колебании диполь не возникает → ИК-луч проходит насквозь. Поэтому N₂ и O₂ не парниковые газы.", en: "⚪ No dipole appears as it vibrates → the IR ray passes through. That is why N₂ and O₂ are not greenhouse gases." };
        return `<div class="filters l3-chips">${tabs}</div>
          <h4 class="l3-h">${esc(M.f)} — ${H(M.n)}</h4>
          <div class="filters l3-chips">${modes}</div>
          <button class="btn btn-primary btn-sm" type="button" data-fire>🔴 ${H({ uz: "ИҚ нур юбориш", ru: "Послать ИК-луч", en: "Send an IR ray" })}</button>
          <p class="lab-out" data-res aria-live="polite">${H(verdict)}</p>
          ${info}
          ${uni ? `<p class="small muted">${H({ uz: "Қисман зарядлар ва силжишлар сифатий; боғ узунликлари ва частоталар — NIST маълумотлари. Симметрик чўзилишда CO₂ диполи нолга тенг қолади (фақат Раман спектрида кўринади).", ru: "Частичные заряды и смещения качественные; длины связей и частоты — данные NIST. При симметричном растяжении диполь CO₂ остаётся нулевым (видно только в спектре КР).", en: "Partial charges and displacements are qualitative; bond lengths and frequencies are NIST data. In the symmetric stretch CO₂'s dipole stays zero (Raman-active only)." })}</p>` : `<p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Камида 5 та молекулага ИҚ нур юбориб кўринг.", ru: "Пошлите ИК-луч хотя бы в 5 молекул.", en: "Send an IR ray to at least 5 molecules." })} (${S.tried.size}/5)</p>`}`;
      };
      ui.after = (abs) => {
        const el = ui.el && ui.el.querySelector("[data-res]");
        if (el) el.textContent = L(abs ? { uz: "💥 Ютилди! Молекула кучлироқ тебранмоқда — энергия иссиқликка айланади.", ru: "💥 Поглощено! Молекула колеблется сильнее — энергия переходит в тепло.", en: "💥 Absorbed! The molecule vibrates harder — the energy turns into heat." } : { uz: "➡️ Нур ўтиб кетди: бу тебраниш ИҚ нурни ютмайди.", ru: "➡️ Луч прошёл насквозь: это колебание не поглощает ИК.", en: "➡️ The ray passed through: this vibration does not absorb IR." });
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { S.m = b.dataset.m; S.mode = 0; S.photon = -1; S.absorbed = false; make(); ui.render(); }));
        el.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => { S.mode = +b.dataset.mode; S.photon = -1; S.absorbed = false; ui.render(); }));
        el.querySelector("[data-fire]").addEventListener("click", () => {
          S.photon = 0; S.absorbed = false; S.tried.add(S.m);
          const st = ui.el.querySelector("[data-star]");
          if (st) { st.textContent = `${L(TX.mission)}: ${L({ uz: "Камида 5 та молекулага ИҚ нур юбориб кўринг.", ru: "Пошлите ИК-луч хотя бы в 5 молекул.", en: "Send an IR ray to at least 5 molecules." })} (${S.tried.size}/5)`; if (S.tried.size >= 5) star("molekula", st); }
        });
      };
      ui.task = () => ({ q: { uz: "CO₂ нинг эгилиш тебраниши ν̃ = 667 см⁻¹. У ютадиган инфрақизил нурнинг тўлқин узунлиги неча мкм? (Ер шу соҳада энг кўп нурлайди.)", ru: "Деформационное колебание CO₂: ν̃ = 667 см⁻¹. Какова длина волны поглощаемого ИК-излучения, мкм? (Земля сильнее всего излучает именно здесь.)", en: "CO₂'s bending mode is ν̃ = 667 cm⁻¹. What wavelength of infrared light does it absorb, in µm? (Earth radiates most strongly here.)" }, a: 1e4 / 667, tol: 0.1, unit: "µm", hint: { uz: "λ (мкм) = 10 000 / ν̃ (см⁻¹)", ru: "λ (мкм) = 10 000 / ν̃ (см⁻¹)", en: "λ (µm) = 10,000 / ν̃ (cm⁻¹)" } });
      make();
    }
  };

  /* =====================================================================
     3) 💧 Тиндириш ҳавзаси — Стокс қонуни
     ===================================================================== */
  const MU = { 5: [1.519e-3, 999.97], 10: [1.307e-3, 999.7], 20: [1.002e-3, 998.2], 30: [0.798e-3, 995.7] };
  const TANK = {
    id: "tindir", icon: "💧",
    name: { uz: "Сувни тиндириш", ru: "Отстаивание воды", en: "Settling tank" },
    q: { uz: "Лойқа сувдаги қайси заррачалар тубга тез чўкади: катталарими ёки кичикларими?", ru: "Какие частицы мутной воды быстрее оседают на дно: крупные или мелкие?", en: "Which particles in muddy water sink faster: big or small ones?" },
    src: "Stokes, 1851; Hazen, 1904; Metcalf & Eddy, Wastewater Engineering, 5th ed., §5-6; «Саноат оқова сувларини тозалаш» дарслиги",
    view: { bg: "#dbeafe", d: 6.2, ph: 1.12, th: 0.55, target: [0, 0.4, 0], minD: 3, maxD: 12 },
    kids: [
      [{ uz: "Йирик қум", ru: "Крупный песок", en: "Coarse sand" }, 200, 2650, "🏖️"],
      [{ uz: "Майда қум", ru: "Мелкий песок", en: "Fine sand" }, 60, 2650, "⏳"],
      [{ uz: "Чанг (лёсс)", ru: "Пыль (лёсс)", en: "Silt (loess)" }, 20, 2650, "🌫️"],
      [{ uz: "Гил (лой)", ru: "Глина", en: "Clay" }, 3, 2650, "🟤"]
    ],
    build(v, ui) {
      const T = THREE, S = { d: 60, rho: 2650, temp: 20, Q: 200, k: 1, coag: false, flow: 1, done: new Set() };
      const Lm = 20, Wm = 5, Hm = 3, LX = 5, WZ = 1.6, HY = 1.4;
      const g = new T.Group(); g.position.set(-LX / 2, 0, -WZ / 2); v.scene.add(g);
      const box = new T.BoxGeometry(LX, HY, WZ);
      const water = new T.Mesh(box, new T.MeshStandardMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.22, depthWrite: false }));
      water.position.set(LX / 2, HY / 2, WZ / 2); g.add(water);
      const edges = new T.LineSegments(new T.EdgesGeometry(box), new T.LineBasicMaterial({ color: 0x1e3a8a }));
      edges.position.copy(water.position); g.add(edges);
      const floor = new T.Mesh(new T.BoxGeometry(LX, 0.04, WZ), new T.MeshStandardMaterial({ color: 0x94a3b8 }));
      floor.position.set(LX / 2, -0.02, WZ / 2); g.add(floor);
      const pipeM = new T.MeshStandardMaterial({ color: 0x64748b, metalness: 0.4, roughness: 0.4 });
      const pin = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.8, 16), pipeM); pin.rotation.z = Math.PI / 2; pin.position.set(-0.4, HY * 0.75, WZ / 2); g.add(pin);
      const pout = pin.clone(); pout.position.set(LX + 0.4, HY * 0.9, WZ / 2); g.add(pout);
      const lIn = textSprite("→ " + L({ uz: "кириш", ru: "вход", en: "inlet" }), "#1e3a8a", 0.26); lIn.position.set(-0.4, HY + 0.3, WZ / 2); g.add(lIn);
      const lOut = textSprite(L({ uz: "чиқиш", ru: "выход", en: "outlet" }) + " →", "#1e3a8a", 0.26); lOut.position.set(LX + 0.4, HY + 0.3, WZ / 2); g.add(lOut);
      const N = 220, geo = new T.SphereGeometry(1, 8, 6);
      const im = new T.InstancedMesh(geo, new T.MeshStandardMaterial({ color: 0xffffff }), N);
      g.add(im);
      const P = Array.from({ length: N }, () => ({ x: 0, y: 0, z: 0, st: 0 }));
      const sludge = new T.Mesh(new T.BoxGeometry(LX, 1, WZ), new T.MeshStandardMaterial({ color: 0x92400e, roughness: 1 }));
      sludge.position.set(LX / 2, 0, WZ / 2); g.add(sludge);
      let rem = 0, esc_ = 0, mud = 0;
      const dEff = () => (S.coag && S.d < 20 ? S.d * 20 : S.d);
      const rhoEff = () => (S.coag && S.d < 20 ? 1200 : S.rho);
      const vs = () => { const [mu, rw] = MU[S.temp]; const d = dEff() * 1e-6; return (9.81 * (rhoEff() - rw) * d * d) / (18 * mu); };
      const q0 = () => S.Q / 3600 / (Lm * Wm);
      const eff = () => clamp(vs() / q0(), 0, 1);
      const tr = () => (Lm * Wm * Hm) / (S.Q / 3600);
      const re = () => { const [mu, rw] = MU[S.temp]; return (rw * vs() * dEff() * 1e-6) / mu; };
      const col = new T.Color(), mtx = new T.Matrix4();
      const spawn = (p) => { p.x = -0.3; p.y = 0.05 + Math.random() * (HY - 0.1); p.z = 0.1 + Math.random() * (WZ - 0.2); p.st = 0; p.w = Math.random() * 3; };
      P.forEach((p) => { spawn(p); p.x = Math.random() * LX; p.w = 0; });
      v.updaters.push((dt) => {
        /* Визуал вақт: сув ҳавзадан ~7 с да ўтади; чўкиш тезлиги шу масштабда */
        const ux = LX / 7, vy = (vs() / Hm) * tr() * (HY / 7);
        const r = 0.012 + Math.sqrt(dEff()) * 0.0045;
        P.forEach((p, i) => {
          if (p.w > 0) { p.w -= dt; mtx.makeScale(0, 0, 0); im.setMatrixAt(i, mtx); return; }
          if (p.st === 0) {
            p.x += ux * dt; if (p.x > 0) p.y -= vy * dt;
            if (p.y <= 0.02 + mud) { p.st = 1; p.y = 0.02 + mud; rem++; mud = Math.min(0.12, mud + 0.0003); setTimeout(() => spawn(p), 900); }
            else if (p.x >= LX) { esc_++; spawn(p); }
          }
          mtx.makeScale(r, r, r); mtx.setPosition(clamp(p.x, -0.6, LX), p.y, p.z);
          im.setMatrixAt(i, mtx);
          col.set(p.st ? 0x78350f : 0xb45309); im.setColorAt(i, col);
        });
        im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
        sludge.visible = mud > 0.002; sludge.scale.y = Math.max(0.001, mud); sludge.position.y = mud / 2;
        water.material.color.setHSL(0.6 - 0.5 * (1 - eff()) * 0.18, 0.7, 0.62);
      });
      const draw = () => { rem = 0; esc_ = 0; ui.render(); };
      ui.html = () => {
        const uni = stage() === "uni", E = eff() * 100;
        const kids = this.kids.map(([n, d, rho, i]) => `<button type="button" class="sg-opt ${d === S.d ? "sel" : ""}" data-d="${d}" data-rho="${rho}"><span class="e" aria-hidden="true">${i}</span>${H(n)}</button>`).join("");
        const coag = `<label class="l3-check"><input type="checkbox" data-coag ${S.coag ? "checked" : ""}> 🧪 ${H({ uz: "Коагулянт (алюмин сульфат) қўшиш — майда заррачалар бирлашиб йирик «пага» ҳосил қилади", ru: "Добавить коагулянт (сульфат алюминия) — мелкие частицы слипаются в крупные хлопья", en: "Add coagulant (aluminium sulphate) — fine particles clump into large flocs" })}</label>`;
        if (!uni) {
          const msg = E >= 90 ? { uz: "👏 Деярли барча заррачалар тубга чўкди — сув тиниқ!", ru: "👏 Почти все частицы осели — вода прозрачная!", en: "👏 Almost all particles settled — the water is clear!" } : E >= 40 ? { uz: "🙂 Ярми чўкди. Оқимни секинлатинг ёки коагулянт қўшинг.", ru: "🙂 Осела половина. Замедлите поток или добавьте коагулянт.", en: "🙂 Half settled. Slow the flow or add coagulant." } : { uz: "😕 Майда заррачалар сув билан оқиб кетмоқда. Улар жуда секин чўкади!", ru: "😕 Мелкие частицы уносит водой. Они оседают очень медленно!", en: "😕 Tiny particles are washed out with the water. They sink very slowly!" };
          return `<div class="lab-opts">${kids}</div>
            <label>🚰 ${H({ uz: "Сув оқими", ru: "Поток воды", en: "Water flow" })}: <b>${H([{ uz: "секин", ru: "медленно", en: "slow" }, { uz: "ўртача", ru: "средне", en: "medium" }, { uz: "тез", ru: "быстро", en: "fast" }][S.flow])}</b><input type="range" data-flow min="0" max="2" step="1" value="${S.flow}"></label>
            ${coag}
            <div class="l3-big"><span>${E >= 90 ? "💧" : E >= 40 ? "🥤" : "🟫"}</span><b>${fmt(E, 0)}%</b><small>${H({ uz: "тозаланди", ru: "очищено", en: "removed" })}</small></div>
            <p class="lab-out">${H(msg)}</p>
            <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Гил заррачаларини 90% дан кўп тиндиринг (маслаҳат: тажрибачилар нима қўшади?).", ru: "Осадите больше 90% частиц глины (подсказка: что добавляют технологи?).", en: "Settle more than 90% of the clay particles (hint: what do engineers add?)." })}</p>`;
        }
        const reW = re() > 1;
        return `<label>${H({ uz: "Заррача диаметри d", ru: "Диаметр частицы d", en: "Particle diameter d" })}: <b>${S.d} µm</b><input type="range" data-k="d" min="1" max="300" step="1" value="${S.d}"></label>
          <label>${H({ uz: "Заррача зичлиги ρₚ", ru: "Плотность частицы ρₚ", en: "Particle density ρₚ" })}: <b>${S.rho} kg/m³</b><input type="range" data-k="rho" min="1050" max="2650" step="50" value="${S.rho}"></label>
          <label>${H({ uz: "Сув ҳарорати", ru: "Температура воды", en: "Water temperature" })}: <select data-temp>${[5, 10, 20, 30].map((t) => `<option value="${t}" ${t === S.temp ? "selected" : ""}>${t} °C</option>`).join("")}</select></label>
          <label>${H({ uz: "Сув сарфи Q", ru: "Расход Q", en: "Flow Q" })}: <b>${S.Q} m³/h</b><input type="range" data-k="Q" min="20" max="1000" step="10" value="${S.Q}"></label>
          ${coag}
          <div class="lab-formula">v<sub>s</sub> = g(ρₚ − ρ<sub>w</sub>)d² / 18μ = <b>${fmt(vs() * 1000, 3)}</b> mm/s<br>q₀ = Q / (L·B) = <b>${fmt(q0() * 1000, 3)}</b> mm/s (${fmt(q0() * 3600, 2)} m/h)<br>E = v<sub>s</sub> / q₀ = <b>${fmt(E, 1)}%</b> · t = V/Q = <b>${fmt(tr() / 3600, 2)}</b> h<br>Re = ρ<sub>w</sub>v<sub>s</sub>d/μ = <b>${fmt(re(), 3)}</b></div>
          ${reW ? `<p class="small" style="color:#b45309">⚠️ ${H({ uz: "Re > 1: Стокс қонуни аниқ эмас — оралиқ режим формуласидан фойдаланинг.", ru: "Re > 1: закон Стокса неточен — используйте формулу переходного режима.", en: "Re > 1: Stokes' law is inaccurate — use a transitional-regime drag formula." })}</p>` : ""}
          <p class="small muted">${H({ uz: `Ҳавза: L = ${Lm} м, B = ${Wm} м, H = ${Hm} м. Идеал ҳавза (Хазен): самарадорлик ҳавза чуқурлигига эмас, юзасига боғлиқ.`, ru: `Отстойник: L = ${Lm} м, B = ${Wm} м, H = ${Hm} м. Идеальный отстойник (Хазен): эффективность зависит от площади, а не от глубины.`, en: `Tank: L = ${Lm} m, B = ${Wm} m, H = ${Hm} m. Ideal (Hazen) tank: efficiency depends on surface area, not depth.` })}</p>`;
      };
      ui.bind = (el) => {
        const check = () => { if (stage() !== "uni" && S.d <= 5 && eff() >= 0.9) star("tindir", ui.el.querySelector("[data-star]")); };
        el.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { S.d = +b.dataset.d; S.rho = +b.dataset.rho; draw(); check(); }));
        const fl = el.querySelector("[data-flow]");
        if (fl) fl.addEventListener("input", () => { S.flow = +fl.value; S.Q = [60, 200, 700][S.flow]; draw(); check(); });
        const cg = el.querySelector("[data-coag]");
        cg.addEventListener("change", () => { S.coag = cg.checked; draw(); check(); });
        el.querySelectorAll("input[data-k]").forEach((r) => r.addEventListener("change", () => { S[r.dataset.k] = +r.value; draw(); }));
        el.querySelectorAll("input[data-k]").forEach((r) => r.addEventListener("input", () => { S[r.dataset.k] = +r.value; const b = r.parentElement.querySelector("b"); if (b) b.textContent = r.value + (r.dataset.k === "d" ? " µm" : r.dataset.k === "rho" ? " kg/m³" : " m³/h"); }));
        const tp = el.querySelector("[data-temp]");
        if (tp) tp.addEventListener("change", () => { S.temp = +tp.value; draw(); });
      };
      ui.task = () => {
        const [mu, rw] = MU[20];
        return { q: { uz: "Қум заррачаси: d = 50 мкм, ρₚ = 2650 кг/м³, сув 20 °C (μ = 1,002·10⁻³ Па·с, ρw = 998,2 кг/м³). Стокс қонуни бўйича чўкиш тезлиги неча мм/с?", ru: "Песчинка: d = 50 мкм, ρₚ = 2650 кг/м³, вода 20 °C (μ = 1,002·10⁻³ Па·с, ρw = 998,2 кг/м³). Какова скорость осаждения по Стоксу, мм/с?", en: "A sand grain: d = 50 µm, ρₚ = 2650 kg/m³, water at 20 °C (μ = 1.002·10⁻³ Pa·s, ρw = 998.2 kg/m³). What is its Stokes settling velocity in mm/s?" }, a: (9.81 * (2650 - rw) * 2.5e-9) / (18 * mu) * 1000, tol: 0.05, unit: "mm/s", hint: { uz: "v = 9,81·(2650−998,2)·(50·10⁻⁶)² / (18·1,002·10⁻³), сўнг ×1000", ru: "v = 9,81·(2650−998,2)·(50·10⁻⁶)² / (18·1,002·10⁻³), затем ×1000", en: "v = 9.81·(2650−998.2)·(50·10⁻⁶)² / (18·1.002·10⁻³), then ×1000" } };
      };
      draw();
    }
  };

  /* =====================================================================
     4) ☀️ Қуёш панели — Тошкент (φ = 41,3° ш.к.)
     ===================================================================== */
  const LAT = 41.3;
  const sunPos = (n, h) => {
    const dec = 23.44 * Math.sin((2 * Math.PI * (284 + n)) / 365) * DEG, w = 15 * (h - 12) * DEG, f = LAT * DEG;
    const sa = Math.sin(f) * Math.sin(dec) + Math.cos(f) * Math.cos(dec) * Math.cos(w);
    const alt = Math.asin(clamp(sa, -1, 1));
    const az = Math.atan2(Math.sin(w), Math.cos(w) * Math.sin(f) - Math.tan(dec) * Math.cos(f)); // жанубдан, ғарб томонга мусбат
    return { alt, az, dec };
  };
  const dni = (alt) => {
    if (alt <= 0) return 0;
    const ad = alt / DEG, am = 1 / (Math.sin(alt) + 0.50572 * Math.pow(ad + 6.07995, -1.6364));
    return 1353 * Math.pow(0.7, Math.pow(am, 0.678));
  };
  const poa = (alt, az, tilt, paz) => {
    const I = dni(alt); if (!I) return 0;
    const c = Math.sin(alt) * Math.cos(tilt) + Math.cos(alt) * Math.sin(tilt) * Math.cos(az - paz);
    return I * Math.max(0, c) + 0.1 * I * (1 + Math.cos(tilt)) / 2;
  };
  const dayKwh = (n, tilt, paz) => { let e = 0; for (let h = 4; h <= 20; h += 0.25) { const s = sunPos(n, h); e += poa(s.alt, s.az, tilt, paz) * 0.25; } return (e * 1.7 * 0.21) / 1000; };
  const SOLAR = {
    id: "quyosh", icon: "☀️",
    name: { uz: "Қуёш панели", ru: "Солнечная панель", en: "Solar panel" },
    q: { uz: "Қуёш панелини қайси томонга ва қандай бурчакда ўрнатсак, кўпроқ электр беради?", ru: "Куда и под каким углом поставить солнечную панель, чтобы она давала больше энергии?", en: "Which way and at what angle should a solar panel face to make the most electricity?" },
    src: "Cooper, 1969 (declination); Kasten & Young, 1989 (air mass); Meinel & Meinel, 1976 (clear-sky DNI); Duffie & Beckman, Solar Engineering of Thermal Processes",
    view: { bg: "#bfdbfe", d: 10, ph: 1.3, th: 0.5, target: [0, 1.6, 0], minD: 3, maxD: 16 },
    days: [[80, { uz: "21 март", ru: "21 марта", en: "21 March" }], [172, { uz: "21 июнь", ru: "21 июня", en: "21 June" }], [266, { uz: "23 сентябрь", ru: "23 сентября", en: "23 September" }], [355, { uz: "21 декабрь", ru: "21 декабря", en: "21 December" }]],
    build(v, ui) {
      const T = THREE, S = { n: 172, h: 12, tilt: 20, paz: 40, best: null, play: true };
      const ground = new T.Mesh(new T.CircleGeometry(6, 64), new T.MeshStandardMaterial({ color: 0x86efac, roughness: 1 }));
      ground.rotation.x = -Math.PI / 2; v.scene.add(ground);
      const dirs = [[{ uz: "Ж", ru: "Ю", en: "S" }, 0, 5.4], [{ uz: "Ш", ru: "С", en: "N" }, 0, -5.4], [{ uz: "Шқ", ru: "В", en: "E" }, 5.4, 0], [{ uz: "Ғ", ru: "З", en: "W" }, -5.4, 0]];
      dirs.forEach(([t, x, z]) => { const s = textSprite(L(t), "#14532d", 0.45); s.position.set(x, 0.3, z); v.scene.add(s); });
      const stand = new T.Mesh(new T.CylinderGeometry(0.06, 0.08, 0.8, 12), new T.MeshStandardMaterial({ color: 0x475569 }));
      stand.position.y = 0.4; v.scene.add(stand);
      const panel = new T.Group(); panel.position.y = 0.85; v.scene.add(panel);
      const cells = document.createElement("canvas"); cells.width = 256; cells.height = 160;
      const cg = cells.getContext("2d"); cg.fillStyle = "#1e3a8a"; cg.fillRect(0, 0, 256, 160); cg.strokeStyle = "#93c5fd"; cg.lineWidth = 2;
      for (let x = 0; x <= 256; x += 32) { cg.beginPath(); cg.moveTo(x, 0); cg.lineTo(x, 160); cg.stroke(); }
      for (let y = 0; y <= 160; y += 32) { cg.beginPath(); cg.moveTo(0, y); cg.lineTo(256, y); cg.stroke(); }
      const ctex = new T.CanvasTexture(cells); ctex.colorSpace = T.SRGBColorSpace;
      const pm = [new T.MeshStandardMaterial({ color: 0x94a3b8 }), new T.MeshStandardMaterial({ color: 0x94a3b8 }), new T.MeshStandardMaterial({ map: ctex, roughness: 0.25, metalness: 0.3 }), new T.MeshStandardMaterial({ color: 0xcbd5e1 }), new T.MeshStandardMaterial({ color: 0x94a3b8 }), new T.MeshStandardMaterial({ color: 0x94a3b8 })];
      const slab = new T.Mesh(new T.BoxGeometry(1.7, 0.05, 1.0), pm); panel.add(slab);
      const nArrow = new T.ArrowHelper(new T.Vector3(0, 1, 0), new T.Vector3(0, 0.03, 0), 0.9, 0x16a34a, 0.18, 0.1); panel.add(nArrow);
      const sun = new T.Mesh(new T.SphereGeometry(0.28, 24, 16), new T.MeshBasicMaterial({ color: 0xfacc15 })); v.scene.add(sun);
      const sunL = new T.DirectionalLight(0xfff3c4, 1.4); v.scene.add(sunL);
      const ray = new T.Line(new T.BufferGeometry(), new T.LineDashedMaterial({ color: 0xf59e0b, dashSize: 0.2, gapSize: 0.12 })); v.scene.add(ray);
      const path = new T.Line(new T.BufferGeometry(), new T.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.6 })); v.scene.add(path);
      const R = 5;
      const dirOf = (alt, az) => new T.Vector3(-Math.sin(az) * Math.cos(alt), Math.sin(alt), Math.cos(az) * Math.cos(alt));
      const setPath = () => {
        const pts = [];
        for (let h = 4; h <= 20; h += 0.25) { const s = sunPos(S.n, h); if (s.alt > 0) pts.push(dirOf(s.alt, s.az).multiplyScalar(R)); }
        path.geometry.dispose(); path.geometry = new T.BufferGeometry().setFromPoints(pts.length > 1 ? pts : [new T.Vector3(), new T.Vector3()]);
      };
      const place = () => {
        const s = sunPos(S.n, S.h), up = s.alt > 0;
        const p = dirOf(s.alt, s.az).multiplyScalar(R);
        sun.position.copy(p); sun.visible = up; sunL.position.copy(p); sunL.intensity = up ? 1.4 : 0;
        panel.rotation.set(S.tilt * DEG, -S.paz * DEG, 0, "YXZ");
        ray.visible = up;
        ray.geometry.dispose(); ray.geometry = new T.BufferGeometry().setFromPoints([p, new T.Vector3(0, 0.85, 0)]); ray.computeLineDistances();
        v.scene.background.set(up ? "#bfdbfe" : "#1e293b");
      };
      const findBest = () => { let b = { e: 0 }; for (let t = 0; t <= 90; t += 5) for (let a = -90; a <= 90; a += 10) { const e = dayKwh(S.n, t * DEG, a * DEG); if (e > b.e) b = { e, t, a }; } S.best = b; };
      v.updaters.push((dt) => {
        if (!S.play) return;
        S.h += dt * 0.8; if (S.h > 20) S.h = 4;
        place();
        const out = ui.el && ui.el.querySelector("[data-now]");
        if (out) out.innerHTML = nowHtml();
      });
      const nowHtml = () => {
        const s = sunPos(S.n, S.h), P = poa(s.alt, s.az, S.tilt * DEG, S.paz * DEG) * 1.7 * 0.21;
        const hh = Math.floor(S.h), mm = Math.round((S.h - hh) * 60) % 60;
        return `🕒 ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")} · ${H({ uz: "қуёш баландлиги", ru: "высота солнца", en: "sun elevation" })} <b>${fmt(Math.max(0, s.alt / DEG), 1)}°</b> · ⚡ <b>${fmt(P, 0)} W</b>`;
      };
      ui.html = () => {
        const uni = stage() === "uni", E = dayKwh(S.n, S.tilt * DEG, S.paz * DEG), pct = S.best ? (E / S.best.e) * 100 : 0;
        const days = this.days.map(([n, t]) => `<button type="button" class="chip ${n === S.n ? "active" : ""}" data-n="${n}">${H(t)}</button>`).join("");
        const dirName = (a) => (Math.abs(a) < 15 ? { uz: "жанубга", ru: "на юг", en: "south" } : a < 0 ? { uz: "жануби-шарққа", ru: "на юго-восток", en: "south-east" } : { uz: "жануби-ғарбга", ru: "на юго-запад", en: "south-west" });
        const common = `<div class="filters l3-chips">${days}</div>
          <label>📐 ${H({ uz: "Панел қиялиги β", ru: "Наклон панели β", en: "Panel tilt β" })}: <b>${S.tilt}°</b><input type="range" data-k="tilt" min="0" max="90" step="1" value="${S.tilt}"></label>
          <label>🧭 ${H({ uz: "Панел йўналиши (жанубдан)", ru: "Направление панели (от юга)", en: "Panel direction (from south)" })}: <b>${S.paz > 0 ? "+" : ""}${S.paz}° · ${H(dirName(S.paz))}</b><input type="range" data-k="paz" min="-90" max="90" step="5" value="${S.paz}"></label>
          <p class="small" data-now>${nowHtml()}</p>
          <button class="btn btn-ghost btn-sm" type="button" data-play>${S.play ? "⏸" : "▶️"} ${H({ uz: "Кун ўтиши", ru: "Ход дня", en: "Day cycle" })}</button>
          <div class="l3-big"><span>🔋</span><b>${fmt(E, 2)} kWh</b><small>${H({ uz: "кунига (1 панел)", ru: "в день (1 панель)", en: "per day (1 panel)" })}</small></div>
          <div class="pc-bar" aria-hidden="true"><i style="width:${clamp(pct, 0, 100).toFixed(0)}%"></i></div>
          <p class="small">${H({ uz: "Энг яхши ҳолатга нисбатан", ru: "От наилучшего положения", en: "Of the best position" })}: <b>${fmt(pct, 0)}%</b></p>`;
        if (!uni) return `${common}
          <p class="lab-out">${H(pct >= 95 ? { uz: "🌞 Зўр! Панел қуёшга тўғри қаради.", ru: "🌞 Отлично! Панель смотрит прямо на солнце.", en: "🌞 Great! The panel faces the sun well." } : { uz: "Панелни жанубга буринг: Ўзбекистонда қуёш кун бўйи жануб томонда юради.", ru: "Поверните панель на юг: в Узбекистане солнце весь день идёт по южной стороне неба.", en: "Turn the panel south: in Uzbekistan the sun travels across the southern sky all day." })}</p>
          <p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Панелни шундай буринги, у энг яхши ҳолатнинг 95% идан кўп энергия берсин.", ru: "Поверните панель так, чтобы она давала больше 95% от наилучшего.", en: "Turn the panel to get more than 95% of the best possible energy." })}</p>`;
        const s = sunPos(S.n, 12);
        return `${common}
          <div class="lab-formula">δ = 23,44°·sin(360°·(284+n)/365) = <b>${fmt(s.dec / DEG, 2)}°</b> (n = ${S.n})<br>sin α = sin φ sin δ + cos φ cos δ cos ω, φ = ${fmt(LAT, 1)}°<br>${H({ uz: "туш пайти", ru: "в полдень", en: "at solar noon" })}: α = 90° − φ + δ = <b>${fmt(s.alt / DEG, 1)}°</b><br>cos θ = sin α cos β + cos α sin β cos(γₛ − γₚ)<br>DNI = 1353·0,7^(AM^0,678); P = G·A·η, A = 1,7 m², η = 21%</div>
          <p class="small muted">${H({ uz: "Энг яхши шу кун учун", ru: "Лучшее для этого дня", en: "Best for this day" })}: β ≈ ${S.best ? S.best.t : "—"}°, γ ≈ ${S.best ? S.best.a : "—"}° → ${S.best ? fmt(S.best.e, 2) : "—"} kWh. ${H({ uz: "Йил бўйи қўзғалмас панел учун қиялик ≈ кенглик (≈ 35–41°). Модель тиниқ осмон учун; булут ва чанг ҳисобга олинмаган.", ru: "Для неподвижной панели на весь год наклон ≈ широте (≈ 35–41°). Модель ясного неба; облака и пыль не учтены.", en: "For a fixed all-year panel, tilt ≈ latitude (≈ 35–41°). Clear-sky model; clouds and dust not included." })}</p>`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-n]").forEach((b) => b.addEventListener("click", () => { S.n = +b.dataset.n; findBest(); setPath(); place(); ui.render(); }));
        el.querySelectorAll("input[data-k]").forEach((r) => {
          r.addEventListener("input", () => { S[r.dataset.k] = +r.value; place(); const b = r.parentElement.querySelector("b"); if (b) b.textContent = (r.dataset.k === "paz" && S.paz > 0 ? "+" : "") + r.value + "°"; });
          r.addEventListener("change", () => { ui.render(); const E = dayKwh(S.n, S.tilt * DEG, S.paz * DEG); if (stage() !== "uni" && S.best && E / S.best.e >= 0.95) star("quyosh", ui.el.querySelector("[data-star]")); });
        });
        el.querySelector("[data-play]").addEventListener("click", () => { S.play = !S.play; ui.render(); });
      };
      ui.task = () => {
        const d = sunPos(172, 12);
        return { q: { uz: "21 июнда (n = 172) Тошкентда (φ = 41,3°) қуёш туш пайтида уфқдан неча градус баландликда бўлади? (δ ни формуладан ҳисобланг)", ru: "На какой высоте над горизонтом солнце в полдень 21 июня (n = 172) в Ташкенте (φ = 41,3°), в градусах? (δ вычислите по формуле)", en: "How many degrees above the horizon is the sun at solar noon on 21 June (n = 172) in Tashkent (φ = 41.3°)? (compute δ from the formula)" }, a: d.alt / DEG, tol: 0.3, unit: "°", hint: { uz: "α = 90° − φ + δ, δ ≈ 23,44°", ru: "α = 90° − φ + δ, δ ≈ 23,44°", en: "α = 90° − φ + δ, δ ≈ 23.44°" }, dec: 1 };
      };
      findBest(); setPath(); place();
    }
  };

  /* =====================================================================
     5) 🌳 Дарахт ва CO₂
     ===================================================================== */
  const TREE = {
    id: "daraxt", icon: "🌳",
    name: { uz: "Дарахт ва CO₂", ru: "Деревья и CO₂", en: "Trees and CO₂" },
    q: { uz: "Битта одамнинг йиллик CO₂ изини қоплаш учун нечта дарахт керак?", ru: "Сколько деревьев нужно, чтобы покрыть годовой CO₂-след одного человека?", en: "How many trees does it take to offset one person's yearly CO₂?" },
    src: "Chave et al., 2014 (Global Change Biology 20:3177); IPCC 2006 Guidelines, Vol. 4 (carbon fraction 0.47); Global Carbon Budget (Uzbekistan ≈ 3.5 t CO₂/person)",
    view: { bg: "#e0f2fe", d: 9, ph: 1.0, th: 0.7, target: [0, 0.5, 0], minD: 4, maxD: 16 },
    build(v, ui) {
      const T = THREE, S = { n: 0, D: 30, Hh: 15, rho: 0.6 }, MAX = 160, KG = 22, PERSON = 3500;
      const island = new T.Mesh(new T.CylinderGeometry(5, 5.4, 0.5, 48), new T.MeshStandardMaterial({ color: 0x65a30d, roughness: 1 }));
      island.position.y = -0.25; v.scene.add(island);
      const factory = new T.Group(); factory.position.set(-2.8, 0, -2.2); v.scene.add(factory);
      const fb = new T.Mesh(new T.BoxGeometry(1.4, 0.8, 0.9), new T.MeshStandardMaterial({ color: 0x94a3b8 })); fb.position.y = 0.4; factory.add(fb);
      const ch = new T.Mesh(new T.CylinderGeometry(0.12, 0.15, 1.3, 12), new T.MeshStandardMaterial({ color: 0x64748b })); ch.position.set(0.4, 1.3, 0); factory.add(ch);
      const house = new T.Mesh(new T.BoxGeometry(0.8, 0.6, 0.8), new T.MeshStandardMaterial({ color: 0xfcd34d })); house.position.set(-1.4, 0.3, -2.8); v.scene.add(house);
      const roof = new T.Mesh(new T.ConeGeometry(0.65, 0.45, 4), new T.MeshStandardMaterial({ color: 0xb91c1c })); roof.position.set(-1.4, 0.82, -2.8); roof.rotation.y = Math.PI / 4; v.scene.add(roof);
      const smokeM = new T.MeshStandardMaterial({ color: 0x6b7280, transparent: true, opacity: 0.55, depthWrite: false });
      const smoke = Array.from({ length: 14 }, (_, i) => { const m = new T.Mesh(new T.SphereGeometry(0.22, 12, 8), smokeM); m.userData.t = i / 14; v.scene.add(m); return m; });
      const trunkG = new T.CylinderGeometry(0.05, 0.07, 0.4, 6), crownG = new T.ConeGeometry(0.28, 0.7, 8);
      const trunks = new T.InstancedMesh(trunkG, new T.MeshStandardMaterial({ color: 0x78350f }), MAX);
      const crowns = new T.InstancedMesh(crownG, new T.MeshStandardMaterial({ color: 0x15803d }), MAX);
      trunks.count = crowns.count = 0; v.scene.add(trunks, crowns);
      const trees = [], mtx = new T.Matrix4(), q = new T.Quaternion(), one = new T.Vector3(1, 1, 1);
      const big = new T.Group(); big.position.set(2.4, 0, 1.2); v.scene.add(big);
      const bT = new T.Mesh(new T.CylinderGeometry(1, 1.15, 1, 16), new T.MeshStandardMaterial({ color: 0x7c2d12 })); big.add(bT);
      const bC = new T.Mesh(new T.SphereGeometry(1, 20, 14), new T.MeshStandardMaterial({ color: 0x166534, roughness: 0.9 })); big.add(bC);
      const sizeBig = () => { const r = S.D / 100 / 2 * 2.2, h = S.Hh / 10; bT.scale.set(r, h * 0.55, r); bT.position.y = h * 0.275; bC.scale.set(h * 0.32 + r, h * 0.4, h * 0.32 + r); bC.position.y = h * 0.55 + h * 0.3; };
      const addTree = (x, z) => {
        if (trees.length >= MAX) return;
        if (Math.hypot(x + 2.8, z + 2.2) < 1.2 || Math.hypot(x + 1.4, z + 2.8) < 0.7 || Math.hypot(x - 2.4, z - 1.2) < 1.3) return;
        trees.push({ x, z, s: 0.05 }); S.n = trees.length;
      };
      const ray = new T.Raycaster(), ndc = new T.Vector2();
      v.onTap = (e) => {
        const r = v.canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, v.camera);
        const hit = ray.intersectObject(island)[0];
        if (hit && hit.point.y > -0.05) { addTree(hit.point.x, hit.point.z); ui.render(); }
      };
      v.updaters.push((dt) => {
        trees.forEach((t, i) => {
          t.s = Math.min(1, t.s + dt * 1.5);
          mtx.compose(new T.Vector3(t.x, 0.2 * t.s, t.z), q, one.clone().multiplyScalar(t.s)); trunks.setMatrixAt(i, mtx);
          mtx.compose(new T.Vector3(t.x, (0.4 + 0.3) * t.s, t.z), q, one.clone().multiplyScalar(t.s)); crowns.setMatrixAt(i, mtx);
        });
        trunks.count = crowns.count = trees.length;
        trunks.instanceMatrix.needsUpdate = crowns.instanceMatrix.needsUpdate = true;
        const off = clamp((S.n * KG) / PERSON, 0, 1);
        smokeM.opacity = 0.6 * (1 - off) + 0.05;
        smoke.forEach((m) => { m.userData.t = (m.userData.t + dt * 0.18) % 1; const t = m.userData.t; m.position.set(-2.4 + t * 2.6, 2 + t * 2.2, -2.2 + Math.sin(t * 7 + m.id) * 0.5); m.scale.setScalar((0.5 + t * 2.2) * (1 - off * 0.7)); });
      });
      const agb = () => 0.0673 * Math.pow(S.rho * S.D * S.D * S.Hh, 0.976);
      ui.html = () => {
        const uni = stage() === "uni", abs = S.n * KG, pct = (abs / PERSON) * 100;
        const kid = `<p class="small">👆 ${H({ uz: "Оролча устига босинг — дарахт экилади.", ru: "Нажмите на остров — посадите дерево.", en: "Tap the island to plant a tree." })}</p>
          <div class="ev-tools"><button class="btn btn-primary btn-sm" type="button" data-add="10">🌱 +10 ${H({ uz: "дарахт", ru: "деревьев", en: "trees" })}</button><button class="btn btn-ghost btn-sm" type="button" data-clear>↺</button></div>
          <div class="l3-big"><span>🌳</span><b>${S.n}</b><small>${H({ uz: "дарахт", ru: "деревьев", en: "trees" })} · ${fmt(abs / 1000, 2)} ${H({ uz: "т CO₂/йил", ru: "т CO₂/год", en: "t CO₂/yr" })}</small></div>
          <div class="pc-bar" aria-hidden="true"><i style="width:${clamp(pct, 0, 100).toFixed(0)}%"></i></div>
          <p class="small">${H({ uz: "Бир кишининг йиллик изи (≈ 3,5 т CO₂) қопланди", ru: "Покрыт годовой след одного человека (≈ 3,5 т CO₂)", en: "One person's yearly footprint (≈ 3.5 t CO₂) offset" })}: <b>${fmt(Math.min(pct, 999), 0)}%</b></p>
          <p class="small muted">${H({ uz: "Катта дарахт йилига ўртача ≈ 22 кг CO₂ ютади (тури, ёши ва иқлимга қараб 10–40 кг). Дарахт экиш муҳим, лекин чиқиндини камайтиришнинг ўрнини босмайди.", ru: "Взрослое дерево поглощает в среднем ≈ 22 кг CO₂ в год (10–40 кг в зависимости от вида, возраста и климата). Посадка деревьев важна, но не заменяет сокращение выбросов.", en: "A mature tree absorbs ≈ 22 kg CO₂ a year on average (10–40 kg by species, age and climate). Planting matters but does not replace cutting emissions." })}</p>`;
        if (!uni) return kid + `<p class="l3-mission" data-star>${H(TX.mission)}: ${H({ uz: "Бир кишининг изини тўлиқ қоплаш учун етарли дарахт экинг (≈ 160 та).", ru: "Посадите столько деревьев, чтобы покрыть след одного человека (≈ 160).", en: "Plant enough trees to offset one person's footprint (≈ 160)." })}</p>`;
        const a = agb(), c = a * 0.47, co2 = (c * 44) / 12;
        return kid + `<h4 class="l3-h">🌲 ${H({ uz: "Битта дарахтдаги углерод (аллометрия)", ru: "Углерод в одном дереве (аллометрия)", en: "Carbon in one tree (allometry)" })}</h4>
          <label>${H({ uz: "Диаметр D (1,3 м баландликда)", ru: "Диаметр D (на высоте 1,3 м)", en: "Diameter D (at 1.3 m)" })}: <b>${S.D} cm</b><input type="range" data-k="D" min="5" max="80" step="1" value="${S.D}"></label>
          <label>${H({ uz: "Баландлик H", ru: "Высота H", en: "Height H" })}: <b>${S.Hh} m</b><input type="range" data-k="Hh" min="3" max="30" step="1" value="${S.Hh}"></label>
          <label>${H({ uz: "Ёғоч зичлиги ρ", ru: "Плотность древесины ρ", en: "Wood density ρ" })}: <b>${fmt(S.rho, 2)} g/cm³</b><input type="range" data-k="rho" min="0.3" max="0.9" step="0.05" value="${S.rho}"></label>
          <div class="lab-formula">AGB = 0,0673·(ρD²H)^0,976 = <b>${fmt(a, 0)}</b> kg<br>C = 0,47·AGB = <b>${fmt(c, 0)}</b> kg · CO₂ = C·44/12 = <b>${fmt(co2, 0)}</b> kg</div>`;
      };
      ui.bind = (el) => {
        const chk = () => { if (stage() !== "uni" && S.n * KG >= PERSON) star("daraxt", ui.el.querySelector("[data-star]")); };
        el.querySelector("[data-add]").addEventListener("click", () => { for (let i = 0, k = 0; i < 10 && k < 200; k++) { const r = 1 + Math.random() * 3.6, a = Math.random() * 6.283, before = trees.length; addTree(r * Math.cos(a), r * Math.sin(a)); if (trees.length > before) i++; } ui.render(); chk(); });
        el.querySelector("[data-clear]").addEventListener("click", () => { trees.length = 0; S.n = 0; ui.render(); });
        el.querySelectorAll("input[data-k]").forEach((r) => {
          r.addEventListener("input", () => { S[r.dataset.k] = +r.value; sizeBig(); });
          r.addEventListener("change", () => ui.render());
        });
        chk();
      };
      ui.task = () => ({ q: { uz: "Дарахт: D = 30 см, H = 15 м, ёғоч зичлиги ρ = 0,6 г/см³. Chave (2014) формуласи бўйича ер усти биомассаси AGB неча кг?", ru: "Дерево: D = 30 см, H = 15 м, плотность ρ = 0,6 г/см³. Какова надземная биомасса AGB по формуле Chave (2014), кг?", en: "A tree: D = 30 cm, H = 15 m, wood density ρ = 0.6 g/cm³. What is its above-ground biomass AGB by the Chave (2014) formula, in kg?" }, a: 0.0673 * Math.pow(0.6 * 900 * 15, 0.976), tol: 8, unit: "kg", hint: { uz: "AGB = 0,0673·(0,6·30²·15)^0,976", ru: "AGB = 0,0673·(0,6·30²·15)^0,976", en: "AGB = 0.0673·(0.6·30²·15)^0.976" }, dec: 0 });
      sizeBig();
    }
  };

  const EXPS = [GH, MOLS, TANK, SOLAR, TREE];

  /* ---------- Бўлимни чизиш ---------- */
  let cur = EXPS[0].id, view = null, built = false, glFail = false;
  function shell() {
    const uni = stage() === "uni";
    ROOT.innerHTML = `<span class="pill">${H(TX.pill)}</span>
      <h2 class="section-title">${H(TX.title)}</h2>
      <p class="muted">${H(uni ? TX.leadU : TX.leadK)}</p>
      <div class="filters lab-tabs" role="tablist">${EXPS.map((x) => `<button type="button" role="tab" aria-selected="${x.id === cur}" class="chip ${x.id === cur ? "active" : ""}" data-x="${x.id}">${x.icon} ${H(x.name)}</button>`).join("")}</div>
      <div class="lab-stage l3-stage">
        <p class="lab-q">🤔 ${H(EXPS.find((x) => x.id === cur).q)}</p>
        <div class="l3-row">
          <div class="l3-viewbox">
            <div class="l3-view" data-view><p class="l3-load">${H(TX.load)}</p></div>
            <div class="l3-tools">
              <button type="button" class="l3-tb" data-tool="auto" title="${H(TX.rot)}" aria-label="${H(TX.rot)}"><i class="fa-solid fa-rotate"></i></button>
              <button type="button" class="l3-tb" data-tool="in" title="${H(TX.zin)}" aria-label="${H(TX.zin)}"><i class="fa-solid fa-plus"></i></button>
              <button type="button" class="l3-tb" data-tool="out" title="${H(TX.zout)}" aria-label="${H(TX.zout)}"><i class="fa-solid fa-minus"></i></button>
              <button type="button" class="l3-tb" data-tool="home" title="${H(TX.reset)}" aria-label="${H(TX.reset)}"><i class="fa-solid fa-house"></i></button>
            </div>
            <p class="small muted l3-hint">${H(TX.hint)}</p>
          </div>
          <div class="lab-ctl l3-panel" data-panel></div>
        </div>
        <p class="small muted lab-src">${H(TX.src)}${esc(EXPS.find((x) => x.id === cur).src)}</p>
        ${uni ? `<div class="lab-task" data-task></div>` : ""}
      </div>
      <details class="fin-card say-method" style="margin-top:18px">
        <summary><span class="fin-flag" aria-hidden="true">🧊</span><b>${H(TX.method)}</b></summary>
        <div class="fin-grid">${METHODS.map(([i, t, d]) => `<div class="fin-item"><span aria-hidden="true">${i}</span><div><b>${H(t)}</b><small>${H(d)}</small></div></div>`).join("")}</div>
      </details>`;
    ROOT.querySelectorAll("[data-x]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.x !== cur) { cur = b.dataset.x; mount(); } }));
  }

  let mountId = 0;
  async function mount() {
    const my = ++mountId;
    if (view) { view.dispose(); view = null; }
    shell();
    const exp = EXPS.find((x) => x.id === cur);
    const panel = ROOT.querySelector("[data-panel]");
    const ui = { el: panel, html: () => "", bind: () => {}, task: null };
    ui.render = () => { panel.innerHTML = ui.html(); ui.bind(panel); };
    const host = ROOT.querySelector("[data-view]");
    try {
      await loadThree();
      if (my !== mountId) return;
      if (glFail) throw new Error("webgl");
      view = new View(host, exp.view);
      view.canvas.setAttribute("aria-label", L(TX.view) + ": " + L(exp.name));
      const lp = host.querySelector(".l3-load"); if (lp) lp.remove();
    } catch (e) {
      glFail = true;
      host.innerHTML = `<p class="l3-load">${H(TX.noGl)}</p>`;
      view = null;
    }
    if (view) {
      exp.build.call(exp, view, ui);
      const tools = ROOT.querySelector(".l3-tools");
      view.autoBtn = tools.querySelector('[data-tool="auto"]');
      view.syncAuto();
      tools.addEventListener("click", (e) => {
        const b = e.target.closest("[data-tool]"); if (!b || !view) return;
        const t = b.dataset.tool;
        if (t === "auto") { view.auto = !view.auto; view.syncAuto(); }
        if (t === "in") view.zoom(0.85);
        if (t === "out") view.zoom(1.18);
        if (t === "home") view.resetView();
      });
      sync();
    } else {
      /* WebGL йўқ: ҳисоблаш панели барибир ишласин */
      const stub = { scene: { add() {}, background: { set() {} } }, updaters: [], canvas: document.createElement("canvas"), camera: null };
      try { exp.build.call(exp, new Proxy(stub, { get: (o, k) => (k in o ? o[k] : () => {}) }), ui); } catch (e) { ui.render(); }
      ROOT.querySelector(".l3-tools").hidden = true;
    }
    if (!panel.innerHTML) ui.render();
    const tb = ROOT.querySelector("[data-task]");
    if (tb && ui.task) { const t = ui.task(); taskBox(tb, cur, t.q, t.a, t.tol, t.unit, t.hint, t.dec ?? 2); }
  }

  /* Бўлим кўринганда анимация юради, яширинса тўхтайди (батарея тежалади) */
  function visible() { return SEC.classList.contains("page-on") && !document.hidden; }
  function sync() {
    if (!view) return;
    if (visible()) { view.resize(); view.start(); } else view.stop();
  }
  function onShow() {
    if (!visible()) { sync(); return; }
    if (!built) { built = true; mount(); } else sync();
  }
  new MutationObserver(onShow).observe(SEC, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", onShow);
  window.addEventListener("eko:lang", () => { if (built) mount(); else shell(); });
  window.addEventListener("eko:stage", () => { if (built) mount(); else shell(); });
  /* Синов ва ўқитувчи намойиши учун: жорий саҳна */
  window.EkoLab3D = { get view() { return view; }, open: (id) => { if (EXPS.some((x) => x.id === id)) { cur = id; if (built) mount(); } } };
  shell();
  onShow();
})();
