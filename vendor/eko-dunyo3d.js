/* ЭкоТаълим — 🎮 «3D Эко-дунё» (мактаб босқичи, 5–15 ёш).
   Учта 3D ўйин: ♻️ ахлатни саралаш, 🏝 эко-оролни яшартириш ва 🌍 Ер шари саёҳати.
   3D кўрувчи ва Three.js «3D лаборатория» модулидан олинади (window.EkoLab3D.lib).
   Ер шари харитаси: Natural Earth (public domain) → world-atlas land-110m, vendor/world-land.json.
   Матнлар uz/ru/en кўринишида шу файлда; лотин алифбоси EkoLang.tr орқали олинади. */
(() => {
  "use strict";
  const SEC = document.getElementById("dunyo3d");
  const ROOT = document.getElementById("d3Root");
  if (!SEC || !ROOT) return;

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
  const t3 = (uz, ru, en) => ({ uz, ru, en });
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const App = () => window.EkoApp;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stars = () => { const a = App(); if (!a) return {}; a.state.d3 = a.state.d3 || {}; return a.state.d3; };
  const saveStars = (id, n) => {
    const a = App(); if (!a) return;
    const s = stars(); if ((s[id] || 0) < n) s[id] = n;
    a.state.flags = a.state.flags || {};
    if (!a.state.flags["d3_" + id]) { a.state.flags["d3_" + id] = true; a.addXp(10, "3D Эко-дунё ўйини"); }
    if (a.save) a.save();
  };
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const TX = {
    pill: t3("🎮 Мактаб босқичи · 3D ўйинлар", "🎮 Школьный этап · 3D-игры", "🎮 School stage · 3D games"),
    title: t3("3D Эко-дунё", "3D Эко-мир", "3D Eco-world"),
    lead: t3("Уч ўлчамли дунёда ўйнаб ўрганинг: ахлатни сараланг, оролни яшартиринг ва Ер шари бўйлаб саёҳат қилинг. Ҳар бир ўйин учун 3 тагача юлдуз ва +10 XP!", "Учитесь, играя в трёхмерном мире: сортируйте мусор, оживите остров и путешествуйте по земному шару. До 3 звёзд и +10 XP за каждую игру!", "Learn by playing in a 3D world: sort the waste, bring an island back to life and travel around the globe. Up to 3 stars and +10 XP for each game!"),
    load: t3("3D дунё юкланмоқда…", "Загрузка 3D-мира…", "Loading the 3D world…"),
    noGl: t3("Бу қурилмада 3D (WebGL) ишламади. Тугмалар билан ўйнашингиз мумкин.", "На этом устройстве 3D (WebGL) не запустился. Можно играть кнопками.", "3D (WebGL) did not start on this device. You can still play with the buttons."),
    again: t3("🔁 Яна ўйнаш", "🔁 Играть снова", "🔁 Play again"),
    hint: t3("👆 Саҳнадаги нарсага босинг ёки пастдаги тугмалардан фойдаланинг · бармоқ билан айлантиринг", "👆 Нажмите на объект в сцене или используйте кнопки ниже · вращайте пальцем", "👆 Tap an object in the scene or use the buttons below · drag to rotate"),
    best: t3("Энг яхши натижа", "Лучший результат", "Best result"),
    how: t3("📖 Қандай ўйналади?", "📖 Как играть?", "📖 How to play?"),
    parents: t3("👨‍👩‍👧 Ота-оналар ва ўқитувчилар учун: ўйиндан кейин болангиз билан уйда ҳам ахлатни саралаб кўринг ёки глобусдаги жойлар ҳақида гаплашинг.", "👨‍👩‍👧 Для родителей и учителей: после игры попробуйте вместе с ребёнком рассортировать мусор дома или поговорите о местах на глобусе.", "👨‍👩‍👧 For parents and teachers: after the game, try sorting waste at home together or talk about the places on the globe.")
  };

  /* ===================== 1) ♻️ Ахлатни саралаш ===================== */
  const BINS = [
    ["paper", 0x2563eb, "📄", t3("Қоғоз", "Бумага", "Paper")],
    ["plastic", 0xeab308, "🧴", t3("Пластик", "Пластик", "Plastic")],
    ["glass", 0x16a34a, "🍾", t3("Шиша", "Стекло", "Glass")],
    ["organic", 0x92400e, "🍂", t3("Органик", "Органика", "Organic")],
    ["danger", 0xdc2626, "⚠️", t3("Хавфли", "Опасные", "Hazardous")]
  ];
  const ITEMS = [
    ["📰", "paper", t3("Эски газета", "Старая газета", "Old newspaper"), "box", 0xe5e7eb],
    ["📦", "paper", t3("Картон қути", "Картонная коробка", "Cardboard box"), "box", 0xc08457],
    ["📒", "paper", t3("Эски дафтар", "Старая тетрадь", "Old notebook"), "box", 0x60a5fa],
    ["🧴", "plastic", t3("Шампун идиши", "Флакон от шампуня", "Shampoo bottle"), "cyl", 0xf472b6],
    ["🥤", "plastic", t3("Пластик стакан", "Пластиковый стакан", "Plastic cup"), "cyl", 0xf8fafc],
    ["🛍️", "plastic", t3("Пластик пакет", "Пластиковый пакет", "Plastic bag"), "box", 0xfde047],
    ["🍾", "glass", t3("Шиша бутилка", "Стеклянная бутылка", "Glass bottle"), "cyl", 0x15803d],
    ["🫙", "glass", t3("Шиша банка", "Стеклянная банка", "Glass jar"), "cyl", 0xbae6fd],
    ["🍌", "organic", t3("Банан пўчоғи", "Банановая кожура", "Banana peel"), "sph", 0xfacc15],
    ["🍎", "organic", t3("Олма қолдиғи", "Огрызок яблока", "Apple core"), "sph", 0xef4444],
    ["🍂", "organic", t3("Тўкилган барглар", "Опавшие листья", "Fallen leaves"), "sph", 0xd97706],
    ["🥚", "organic", t3("Тухум пўчоғи", "Яичная скорлупа", "Eggshells"), "sph", 0xfef3c7],
    ["🔋", "danger", t3("Батарейка", "Батарейка", "Battery"), "cyl", 0x1f2937],
    ["💡", "danger", t3("Энергия тежовчи лампа", "Энергосберегающая лампа", "Energy-saving lamp"), "sph", 0xfef9c3],
    ["🌡️", "danger", t3("Симобли термометр", "Ртутный градусник", "Mercury thermometer"), "cyl", 0xe2e8f0]
  ];
  const WHY = {
    paper: t3("Қоғоз ва картондан янги қоғоз ясалади — дарахтлар асралади.", "Из бумаги и картона делают новую бумагу — деревья сохраняются.", "Paper and cardboard become new paper — trees are saved."),
    plastic: t3("Пластик эритилиб, янги буюмлар ва тола ясалади.", "Пластик переплавляют в новые вещи и волокно.", "Plastic is melted into new things and fibres."),
    glass: t3("Шишани чексиз қайта эритиш мумкин!", "Стекло можно переплавлять бесконечно!", "Glass can be melted again and again forever!"),
    organic: t3("Овқат қолдиқлари ва барглардан компост — ўғит бўлади.", "Из остатков еды и листьев получается компост — удобрение.", "Food scraps and leaves turn into compost — fertiliser."),
    danger: t3("Батарейка, лампа ва термометрда заҳарли моддалар бор — махсус пунктга топширилади.", "В батарейках, лампах и градусниках ядовитые вещества — их сдают в специальный пункт.", "Batteries, lamps and thermometers contain toxic substances — take them to a special collection point.")
  };
  const SORT = {
    id: "saralash", icon: "♻️",
    name: t3("Ахлатни сарала", "Сортируй мусор", "Sort the waste"),
    desc: t3("Ҳар бир нарсани тўғри қутига ташланг", "Бросьте каждый предмет в нужный контейнер", "Drop each item into the right bin"),
    how: [t3("Ўртада айланиб турган нарсага қаранг.", "Посмотрите на вращающийся предмет в центре.", "Look at the item spinning in the middle."), t3("У қайси қутига тушишини ўйланг ва шу қутини босинг.", "Подумайте, в какой контейнер его бросить, и нажмите на него.", "Think which bin it belongs in and tap that bin."), t3("10 та нарсани хатосиз саралаб, 3 юлдуз олинг.", "Рассортируйте 10 предметов без ошибок и получите 3 звезды.", "Sort 10 items with no mistakes to earn 3 stars.")],
    view: { bg: "#e0f2fe", d: 7.2, ph: 1.2, th: 0, target: [0, 0.9, 0], minD: 4, maxD: 12, auto: false },
    build(v, ui, lib) {
      const T = lib.T, S = { list: shuffle(ITEMS.slice()).slice(0, 10), i: 0, ok: 0, bad: 0, last: null, busy: false };
      const floor = new T.Mesh(new T.CircleGeometry(7, 48), new T.MeshStandardMaterial({ color: 0x86efac, roughness: 1 })); floor.rotation.x = -Math.PI / 2; v.scene.add(floor);
      const belt = new T.Mesh(new T.BoxGeometry(2.2, 0.18, 1), new T.MeshStandardMaterial({ color: 0x334155 })); belt.position.set(0, 0.6, 1.3); v.scene.add(belt);
      const leg = new T.Mesh(new T.BoxGeometry(1.8, 0.5, 0.7), new T.MeshStandardMaterial({ color: 0x64748b })); leg.position.set(0, 0.25, 1.3); v.scene.add(leg);
      const bins = BINS.map(([id, c, e, n], k) => {
        const g = new T.Group(); g.position.set((k - 2) * 1.45, 0, -0.6); v.scene.add(g);
        const body = new T.Mesh(new T.CylinderGeometry(0.5, 0.4, 1.1, 24, 1, true), new T.MeshStandardMaterial({ color: c, roughness: 0.5, side: T.DoubleSide })); body.position.y = 0.55; g.add(body);
        const bottom = new T.Mesh(new T.CircleGeometry(0.4, 24), body.material); bottom.rotation.x = -Math.PI / 2; bottom.position.y = 0.02; g.add(bottom);
        const rim = new T.Mesh(new T.TorusGeometry(0.5, 0.05, 8, 32), new T.MeshStandardMaterial({ color: 0xffffff })); rim.rotation.x = Math.PI / 2; rim.position.y = 1.1; g.add(rim);
        const ic = lib.textSprite(e, "#ffffff", 0.5); ic.position.set(0, 0.6, 0.55); g.add(ic);
        const nm = lib.textSprite(L(n), "#0f172a", 0.24); nm.position.set(0, 1.45, 0); g.add(nm);
        g.userData = { k, body, flash: 0 };
        return g;
      });
      /* Ҳозирги нарса: оддий шакл + катта эмодзи */
      let item = null;
      const makeItem = (it) => {
        if (item) { v.scene.remove(item); item.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); }
        const [e, , , shape, col] = it, g = new T.Group();
        const m = new T.MeshStandardMaterial({ color: col, roughness: 0.5 });
        const geo = shape === "box" ? new T.BoxGeometry(0.42, 0.3, 0.32) : shape === "cyl" ? new T.CylinderGeometry(0.14, 0.17, 0.55, 18) : new T.SphereGeometry(0.22, 18, 12);
        g.add(new T.Mesh(geo, m));
        const sp = lib.textSprite(e, "#ffffff", 0.62); sp.position.y = 0.55; g.add(sp);
        g.position.set(0, 1.0, 1.3); v.scene.add(g);
        g.userData = { t: 0, fly: null, shake: 0 };
        item = g;
      };
      /* Конфетти */
      const conf = [], cM = [0xf43f5e, 0x22c55e, 0x3b82f6, 0xfacc15, 0xa855f7].map((c) => new T.MeshBasicMaterial({ color: c }));
      const burst = (p) => { for (let i = 0; i < 26; i++) { const m = new T.Mesh(new T.BoxGeometry(0.06, 0.06, 0.02), cM[i % cM.length]); m.position.copy(p); m.userData = { v: new T.Vector3((Math.random() - 0.5) * 3, 2 + Math.random() * 2.5, (Math.random() - 0.5) * 3), life: 1.4 }; v.scene.add(m); conf.push(m); } };
      v.updaters.push((dt) => {
        if (item) {
          const u = item.userData; u.t += dt;
          if (u.fly) {
            u.fly.t += dt / 0.6; const k = Math.min(1, u.fly.t);
            item.position.lerpVectors(u.fly.a, u.fly.b, k); item.position.y += Math.sin(k * Math.PI) * 1.4; item.scale.setScalar(1 - k * 0.6);
            if (k >= 1) { const done = u.fly.done; u.fly = null; done(); }
          } else {
            item.position.y = 1.0 + Math.sin(u.t * 2.2) * 0.08; item.rotation.y += dt * 1.2;
            if (u.shake > 0) { u.shake -= dt; item.position.x = Math.sin(u.shake * 50) * 0.12; } else item.position.x = 0;
          }
        }
        bins.forEach((b) => { if (b.userData.flash > 0) { b.userData.flash -= dt; b.scale.setScalar(1 + Math.sin(b.userData.flash * 20) * 0.04); } else b.scale.setScalar(1); });
        for (let i = conf.length - 1; i >= 0; i--) { const m = conf[i], u = m.userData; u.v.y -= 9 * dt; m.position.addScaledVector(u.v, dt); m.rotation.x += dt * 8; m.rotation.y += dt * 6; u.life -= dt; if (u.life <= 0 || m.position.y < 0) { v.scene.remove(m); m.geometry.dispose(); conf.splice(i, 1); } }
      });
      const choose = (k) => {
        if (S.busy || S.i >= S.list.length) return;
        const it = S.list[S.i], right = BINS[k][0] === it[1];
        if (right) {
          S.busy = true; S.ok++; S.last = { ok: true, why: WHY[it[1]] };
          const b = bins[k];
          item.userData.fly = { t: 0, a: item.position.clone(), b: new T.Vector3(b.position.x, 1.0, b.position.z), done: () => { burst(new T.Vector3(b.position.x, 1.2, b.position.z)); S.i++; S.busy = false; if (S.i < S.list.length) makeItem(S.list[S.i]); else { v.scene.remove(item); item = null; finish(); } ui.render(); } };
          ui.render();
        } else {
          S.bad++; S.last = { ok: false, why: t3(`«${it[2].uz}» бу қутига тушмайди. Яна ўйлаб кўринг!`, `«${it[2].ru}» не подходит для этого контейнера. Подумайте ещё!`, `“${it[2].en}” does not go in this bin. Think again!`) };
          if (item) item.userData.shake = 0.4; bins[k].userData.flash = 0.4;
          ui.render();
        }
      };
      const starsN = () => (S.bad <= 1 ? 3 : S.bad <= 3 ? 2 : 1);
      const finish = () => saveStars("saralash", starsN());
      const ray = new T.Raycaster(), ndc = new T.Vector2();
      v.onTap = (e) => {
        const r = v.canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, v.camera);
        const hit = ray.intersectObjects(bins, true)[0];
        if (hit) { let o = hit.object; while (o && o.userData.k == null) o = o.parent; if (o) choose(o.userData.k); }
      };
      ui.html = () => {
        const end = S.i >= S.list.length, it = S.list[Math.min(S.i, S.list.length - 1)];
        const btns = BINS.map(([id, c, e, n], k) => `<button type="button" class="sg-opt d3-bin" data-bin="${k}" style="--bc:#${c.toString(16).padStart(6, "0")}" ${end ? "disabled" : ""}><span class="e" aria-hidden="true">${e}</span>${H(n)}</button>`).join("");
        const fb = S.last ? `<p class="lab-out ${S.last.ok ? "" : "d3-bad"}" aria-live="polite">${S.last.ok ? "✅ " : "🤔 "}${H(S.last.why)}</p>` : "";
        if (end) return `<div class="d3-end"><div class="d3-stars" aria-label="${starsN()} / 3">${"⭐".repeat(starsN())}${"☆".repeat(3 - starsN())}</div>
          <p><b>${S.ok} / ${S.list.length}</b> · ${H(t3("хато", "ошибок", "mistakes"))}: ${S.bad}</p>${fb}
          <button class="btn btn-primary" type="button" data-again>${H(TX.again)}</button></div>`;
        return `<div class="d3-now"><span class="d3-big" aria-hidden="true">${it[0]}</span><div><small class="muted">${S.i + 1} / ${S.list.length}</small><b>${H(it[2])}</b></div></div>
          <div class="pc-bar" aria-hidden="true"><i style="width:${(S.i / S.list.length) * 100}%"></i></div>
          <p class="small">${H(t3("Қайси қутига ташлаймиз?", "В какой контейнер бросим?", "Which bin does it go in?"))}</p>
          <div class="lab-opts d3-bins">${btns}</div>${fb}`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-bin]").forEach((b) => b.addEventListener("click", () => choose(+b.dataset.bin)));
        const ag = el.querySelector("[data-again]"); if (ag) ag.addEventListener("click", () => ui.restart());
      };
      makeItem(S.list[0]);
    }
  };

  /* ===================== 2) 🏝 Эко-орол ===================== */
  const TOOLS = [
    ["clean", "🧹", t3("Тозалаш", "Убрать", "Clean up")],
    ["tree", "🌳", t3("Дарахт", "Дерево", "Tree")],
    ["flower", "🌸", t3("Гул", "Цветы", "Flowers")],
    ["solar", "☀️", t3("Қуёш панели", "Солнечная панель", "Solar panel")],
    ["wind", "🌬️", t3("Шамол тегирмони", "Ветряк", "Wind turbine")],
    ["filter", "🧯", t3("Заводга фильтр", "Фильтр на завод", "Factory filter")]
  ];
  const PTS = { trashGone: 10, filter: 20, tree: 8, flower: 4, solar: 9, wind: 9 };
  const CAP = { tree: 3, flower: 2, solar: 1, wind: 1 };
  const ISLAND = {
    id: "orol", icon: "🏝",
    name: t3("Эко-орол", "Эко-остров", "Eco-island"),
    desc: t3("Оролни тозалаб, яшил ва тоза қилинг", "Очистите остров и сделайте его зелёным", "Clean the island and make it green"),
    how: [t3("Пастдан асбобни танланг: 🧹, 🌳, 🌸, ☀️, 🌬️ ёки 🧯.", "Выберите инструмент внизу: 🧹, 🌳, 🌸, ☀️, 🌬️ или 🧯.", "Pick a tool below: 🧹, 🌳, 🌸, ☀️, 🌬️ or 🧯."), t3("Ороддаги доирачага босинг: ахлатни тозаланг ёки бўш жойга экинг.", "Нажмите на кружок на острове: уберите мусор или посадите что-то на пустом месте.", "Tap a circle on the island: clean up the trash or plant on an empty spot."), t3("Заводга фильтр қўйинг ва орол соғлиғини 100 % га етказинг — қушлар ва камалак қайтади!", "Поставьте фильтр на завод и доведите здоровье острова до 100 % — вернутся птицы и радуга!", "Put a filter on the factory and bring the island's health to 100% — birds and a rainbow return!")],
    view: { bg: "#94a3b8", d: 8.5, ph: 1.0, th: 0.5, target: [0, 0.3, 0], minD: 4, maxD: 14 },
    build(v, ui, lib) {
      const T = lib.T, S = { tool: "clean", cnt: { tree: 0, flower: 0, solar: 0, wind: 0 }, trashGone: 0, filter: false, msg: null, won: false };
      const sea = new T.Mesh(new T.CircleGeometry(12, 48), new T.MeshStandardMaterial({ color: 0x0e7490, roughness: 0.3 })); sea.rotation.x = -Math.PI / 2; sea.position.y = -0.05; v.scene.add(sea);
      const island = new T.Mesh(new T.CylinderGeometry(3.4, 3.8, 0.5, 40), new T.MeshStandardMaterial({ color: 0xa3a3a3, roughness: 1 })); island.position.y = -0.2; v.scene.add(island);
      const POS = [[-1.9, -1.3], [0, -1.8], [1.9, -1.3], [-2.3, 0.4], [0, 0], [2.3, 0.4], [-1.3, 1.9], [1.3, 1.9], [0, 2.6]];
      /* 0,2,7 — ахлат уюми; 4 — завод; қолгани бўш */
      const slots = POS.map(([x, z], i) => {
        const g = new T.Group(); g.position.set(x, 0.06, z); v.scene.add(g);
        const ring = new T.Mesh(new T.RingGeometry(0.45, 0.55, 32), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, side: T.DoubleSide })); ring.rotation.x = -Math.PI / 2; g.add(ring);
        const pad = new T.Mesh(new T.CircleGeometry(0.45, 32), new T.MeshStandardMaterial({ color: 0x9a7b4f, roughness: 1 })); pad.rotation.x = -Math.PI / 2; pad.position.y = -0.005; g.add(pad);
        g.userData = { i, kind: i === 4 ? "factory" : [0, 2, 7].includes(i) ? "trash" : "empty", obj: null, pop: 1, ring, pad };
        return g;
      });
      const smokeM = new T.MeshStandardMaterial({ color: 0x4b5563, transparent: true, opacity: 0.6, depthWrite: false });
      const smoke = [];
      const build3 = (slot) => {
        const u = slot.userData;
        if (u.obj) { slot.remove(u.obj); u.obj = null; }
        const g = new T.Group(), M = (c) => new T.MeshStandardMaterial({ color: c, roughness: 0.8 });
        if (u.kind === "trash") {
          [[0, 0.12, 0, 0x78716c], [0.18, 0.1, 0.1, 0x57534e], [-0.15, 0.09, 0.12, 0xa8a29e], [0.05, 0.25, -0.05, 0x44403c]].forEach(([x, y, z, c], k) => { const m = new T.Mesh(k % 2 ? new T.BoxGeometry(0.22, 0.18, 0.2) : new T.SphereGeometry(0.16, 10, 8), M(c)); m.position.set(x, y, z); g.add(m); });
          const s = lib.textSprite("🗑️", "#fff", 0.4); s.position.y = 0.65; g.add(s);
        } else if (u.kind === "factory") {
          const b = new T.Mesh(new T.BoxGeometry(0.8, 0.55, 0.6), M(0x9ca3af)); b.position.y = 0.28; g.add(b);
          const ch = new T.Mesh(new T.CylinderGeometry(0.08, 0.1, 0.9, 12), M(S.filter ? 0x16a34a : 0x7f1d1d)); ch.position.set(0.25, 0.85, 0); g.add(ch);
          if (S.filter) { const f = lib.textSprite("🧯", "#fff", 0.35); f.position.set(0.25, 1.45, 0); g.add(f); }
        } else if (u.kind === "tree") {
          const tr_ = new T.Mesh(new T.CylinderGeometry(0.06, 0.09, 0.5, 8), M(0x78350f)); tr_.position.y = 0.25; g.add(tr_);
          const c1 = new T.Mesh(new T.SphereGeometry(0.34, 14, 10), M(0x16a34a)); c1.position.y = 0.7; g.add(c1);
          const c2 = new T.Mesh(new T.SphereGeometry(0.24, 12, 8), M(0x22c55e)); c2.position.set(0.15, 0.92, 0.05); g.add(c2);
        } else if (u.kind === "flower") {
          [0xf472b6, 0xfacc15, 0xa78bfa, 0xfb7185, 0x60a5fa].forEach((c, k) => { const a = (k / 5) * Math.PI * 2; const st = new T.Mesh(new T.CylinderGeometry(0.015, 0.015, 0.22, 4), M(0x15803d)); st.position.set(Math.cos(a) * 0.22, 0.11, Math.sin(a) * 0.22); g.add(st); const h = new T.Mesh(new T.SphereGeometry(0.07, 8, 6), M(c)); h.position.set(Math.cos(a) * 0.22, 0.25, Math.sin(a) * 0.22); g.add(h); });
        } else if (u.kind === "solar") {
          const p = new T.Mesh(new T.BoxGeometry(0.8, 0.04, 0.5), new T.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.5, roughness: 0.25 })); p.position.y = 0.35; p.rotation.x = -0.5; g.add(p);
          const l = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.35, 6), M(0x94a3b8)); l.position.y = 0.17; g.add(l);
        } else if (u.kind === "wind") {
          const tw = new T.Mesh(new T.CylinderGeometry(0.04, 0.07, 1.4, 10), M(0xf8fafc)); tw.position.y = 0.7; g.add(tw);
          const rot = new T.Group(); rot.position.set(0, 1.4, 0.08); g.add(rot);
          for (let k = 0; k < 3; k++) { const bl = new T.Mesh(new T.BoxGeometry(0.06, 0.6, 0.02), M(0xffffff)); bl.position.y = 0.3; const arm = new T.Group(); arm.add(bl); arm.rotation.z = (k * 2 * Math.PI) / 3; rot.add(arm); }
          g.userData.rot = rot;
        }
        slot.add(g); u.obj = g; u.pop = 0;
        u.pad.material.color.setHex(u.kind === "empty" ? 0x9a7b4f : u.kind === "trash" ? 0x78716c : 0x4d7c0f);
      };
      slots.forEach(build3);
      /* Қушлар ва камалак */
      const birds = Array.from({ length: 5 }, (_, k) => { const b = lib.textSprite("🕊️", "#fff", 0.35); b.userData = { a: k * 1.25, r: 3 + k * 0.4, h: 2.4 + (k % 2) * 0.4 }; b.visible = false; v.scene.add(b); return b; });
      const rainbow = new T.Group(); v.scene.add(rainbow); rainbow.visible = false;
      [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x3b82f6, 0x8b5cf6].forEach((c, k) => { const m = new T.Mesh(new T.TorusGeometry(4.6 - k * 0.14, 0.07, 6, 48, Math.PI), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.75 })); rainbow.add(m); });
      rainbow.position.set(0, 0, -4);
      const health = () => Math.min(100, S.trashGone * PTS.trashGone + (S.filter ? PTS.filter : 0) + Math.min(S.cnt.tree, CAP.tree) * PTS.tree + Math.min(S.cnt.flower, CAP.flower) * PTS.flower + Math.min(S.cnt.solar, CAP.solar) * PTS.solar + Math.min(S.cnt.wind, CAP.wind) * PTS.wind);
      const sky = new T.Color(), skyBad = new T.Color(0x94a3b8), skyGood = new T.Color(0x7dd3fc), grass = new T.Color(), gBad = new T.Color(0xa3a3a3), gGood = new T.Color(0x65a30d);
      const recolor = () => { const h = health() / 100; sky.copy(skyBad).lerp(skyGood, h); v.scene.background = sky.clone(); island.material.color.copy(gBad).lerp(gGood, h); sea.material.color.setHSL(0.53, 0.5 + h * 0.3, 0.3 + h * 0.12); };
      v.updaters.push((dt, t) => {
        slots.forEach((s) => { const u = s.userData; if (u.pop < 1) { u.pop = Math.min(1, u.pop + dt * 3); if (u.obj) u.obj.scale.setScalar(0.2 + 0.8 * (1 - Math.pow(1 - u.pop, 3)) + Math.sin(u.pop * Math.PI) * 0.15); } if (u.obj && u.obj.userData.rot) u.obj.userData.rot.rotation.z -= dt * 3; u.ring.material.opacity = 0.35 + Math.sin(t * 3 + u.i) * 0.2; });
        /* Тутун */
        if (smoke.length < 10 && Math.random() < dt * 4) { const m = new T.Mesh(new T.SphereGeometry(0.12, 8, 6), smokeM); m.position.set(slots[4].position.x + 0.25, 1.4, slots[4].position.z); m.userData.t = 0; v.scene.add(m); smoke.push(m); }
        for (let i = smoke.length - 1; i >= 0; i--) { const m = smoke[i]; m.userData.t += dt; m.position.y += dt * 0.5; m.position.x += dt * 0.25; m.scale.setScalar(1 + m.userData.t * 1.5); if (m.userData.t > 2.5) { v.scene.remove(m); m.geometry.dispose(); smoke.splice(i, 1); } }
        smokeM.opacity = S.filter ? 0.08 : 0.55;
        const hb = health() >= 60;
        birds.forEach((b) => { b.visible = hb; b.userData.a += dt * 0.5; b.position.set(Math.cos(b.userData.a) * b.userData.r, b.userData.h + Math.sin(t * 2 + b.userData.a) * 0.15, Math.sin(b.userData.a) * b.userData.r); });
        rainbow.visible = health() >= 100;
      });
      const act = (i) => {
        const s = slots[i], u = s.userData, tool = S.tool;
        S.msg = null;
        if (u.kind === "factory") {
          if (tool === "filter" && !S.filter) { S.filter = true; build3(s); S.msg = t3("🧯 Фильтр ўрнатилди — тутун деярли йўқолди!", "🧯 Фильтр установлен — дыма почти нет!", "🧯 Filter fitted — the smoke is almost gone!"); }
          else S.msg = S.filter ? t3("Заводда фильтр бор.", "На заводе уже есть фильтр.", "The factory already has a filter.") : t3("Заводга 🧯 фильтр асбобини танлаб босинг.", "Выберите инструмент 🧯 фильтр и нажмите на завод.", "Choose the 🧯 filter tool and tap the factory.");
        } else if (u.kind === "trash") {
          if (tool === "clean") { u.kind = "empty"; S.trashGone++; build3(s); S.msg = t3("🧹 Ахлат йиғиштирилди! Энди бу ерга бирор нарса экинг.", "🧹 Мусор убран! Теперь посадите здесь что-нибудь.", "🧹 Trash cleared! Now plant something here."); }
          else S.msg = t3("Аввал ахлатни 🧹 тозаланг.", "Сначала уберите мусор 🧹.", "Clean up the trash 🧹 first.");
        } else if (u.kind === "empty") {
          if (tool === "clean" || tool === "filter") S.msg = t3("Бу жой бўш. Дарахт, гул ёки панел танланг.", "Это место пустое. Выберите дерево, цветы или панель.", "This spot is empty. Pick a tree, flowers or a panel.");
          else { u.kind = tool; S.cnt[tool]++; build3(s); if (S.cnt[tool] > CAP[tool]) S.msg = t3("Зўр! Энди бошқа турдагисини ҳам қўшиб кўринг — хилма-хиллик муҳим.", "Здорово! Теперь добавьте что-нибудь другое — важно разнообразие.", "Great! Now try adding something different — variety matters."); }
        } else if (tool === "clean") { S.cnt[u.kind]--; u.kind = "empty"; build3(s); }
        else S.msg = t3("Бу жой банд. Бўш доирачани танланг.", "Это место занято. Выберите пустой кружок.", "This spot is taken. Pick an empty circle.");
        recolor();
        if (health() >= 100 && !S.won) { S.won = true; saveStars("orol", 3); S.msg = t3("🌈 Орол яшарди! Қушлар қайтди. +10 XP", "🌈 Остров ожил! Птицы вернулись. +10 XP", "🌈 The island is alive again! The birds are back. +10 XP"); }
        ui.render();
      };
      const ray = new T.Raycaster(), ndc = new T.Vector2();
      v.onTap = (e) => {
        const r = v.canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, v.camera);
        const hit = ray.intersectObjects(slots, true)[0];
        if (hit) { let o = hit.object; while (o && o.userData.i == null) o = o.parent; if (o) act(o.userData.i); return; }
        const hi = ray.intersectObject(island)[0];
        if (hi) { let best = -1, bd = 9; slots.forEach((s, i) => { const d = Math.hypot(s.position.x - hi.point.x, s.position.z - hi.point.z); if (d < bd) { bd = d; best = i; } }); if (bd < 0.8) act(best); }
      };
      ui.html = () => {
        const h = health();
        const tools = TOOLS.map(([id, e, n]) => `<button type="button" class="sg-opt ${S.tool === id ? "sel" : ""}" data-tool="${id}" aria-pressed="${S.tool === id}"><span class="e" aria-hidden="true">${e}</span>${H(n)}</button>`).join("");
        const slotsB = slots.map((s, i) => { const k = s.userData.kind, e = { trash: "🗑️", factory: "🏭", empty: "⭕", tree: "🌳", flower: "🌸", solar: "☀️", wind: "🌬️" }[k]; return `<button type="button" class="d3-slot" data-slot="${i}" aria-label="${i + 1}">${e}</button>`; }).join("");
        return `<div class="l3-big ${h < 100 ? "" : ""}"><span>${h >= 100 ? "🌈" : h >= 60 ? "🐦" : h >= 30 ? "🌱" : "😟"}</span><b>${h}%</b><small>${H(t3("орол соғлиғи", "здоровье острова", "island health"))}</small></div>
          <div class="pc-bar" aria-hidden="true"><i style="width:${h}%"></i></div>
          <p class="small"><b>${H(t3("1. Асбобни танланг", "1. Выберите инструмент", "1. Pick a tool"))}</b></p>
          <div class="lab-opts d3-tools">${tools}</div>
          <p class="small"><b>${H(t3("2. Ороддаги жойни босинг (ёки шу ердан)", "2. Нажмите на место на острове (или здесь)", "2. Tap a spot on the island (or here)"))}</b></p>
          <div class="d3-slots">${slotsB}</div>
          ${S.msg ? `<p class="lab-out" aria-live="polite">${H(S.msg)}</p>` : ""}
          ${S.won ? `<div class="d3-stars">⭐⭐⭐</div><button class="btn btn-ghost btn-sm" type="button" data-again>${H(TX.again)}</button>` : ""}`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-tool]").forEach((b) => b.addEventListener("click", () => { S.tool = b.dataset.tool; S.msg = null; ui.render(); }));
        el.querySelectorAll("[data-slot]").forEach((b) => b.addEventListener("click", () => act(+b.dataset.slot)));
        const ag = el.querySelector("[data-again]"); if (ag) ag.addEventListener("click", () => ui.restart());
      };
      recolor();
    }
  };

  /* ===================== 3) 🌍 Ер шари саёҳати ===================== */
  const PLACES = [
    ["orol", 45, 59.5, "🏜️", t3("Орол денгизи", "Аральское море", "Aral Sea"), t3("Орол денгизи 1960-йиллардан бери жуда саёзлашди: дарё сувлари далаларга кетди ва денгиз ўрнида Оролқум чўли пайдо бўлди.", "С 1960-х годов Аральское море сильно обмелело: воду рек забрали на поля, и на месте моря появилась пустыня Аралкум.", "Since the 1960s the Aral Sea has shrunk badly: river water went to the fields, and the Aralkum desert appeared where the sea was."), t3("Орол денгизи ўрнида нима пайдо бўлди?", "Что появилось на месте Аральского моря?", "What appeared where the Aral Sea used to be?"), [t3("Оролқум чўли", "Пустыня Аралкум", "The Aralkum desert"), t3("Катта ўрмон", "Большой лес", "A big forest")]],
    ["amazon", -4, -62, "🌳", t3("Амазония ўрмонлари", "Леса Амазонии", "Amazon rainforest"), t3("Амазония — дунёдаги энг катта тропик ўрмон. У ерда миллионлаб турдаги ҳайвон ва ўсимлик яшайди, дарахтлар эса кўп карбонат ангидрид ютади.", "Амазония — крупнейший тропический лес мира. Там живут миллионы видов животных и растений, а деревья поглощают много углекислого газа.", "The Amazon is the world's largest tropical rainforest. Millions of kinds of animals and plants live there, and the trees absorb lots of carbon dioxide."), t3("Амазония нима?", "Что такое Амазония?", "What is the Amazon?"), [t3("Энг катта тропик ўрмон", "Крупнейший тропический лес", "The largest tropical rainforest"), t3("Музлик", "Ледник", "A glacier")]],
    ["antarktida", -78, 30, "🐧", t3("Антарктида", "Антарктида", "Antarctica"), t3("Антарктида — қалин муз билан қопланган қитъа. Унда пингвинлар яшайди. Иқлим исиса, муз эриб, денгиз сатҳи кўтарилади.", "Антарктида — континент, покрытый толстым льдом. Там живут пингвины. Если климат теплеет, лёд тает и уровень моря поднимается.", "Antarctica is a continent covered in thick ice. Penguins live there. When the climate warms, ice melts and the sea level rises."), t3("Антарктидада ким яшайди?", "Кто живёт в Антарктиде?", "Who lives in Antarctica?"), [t3("Пингвинлар", "Пингвины", "Penguins"), t3("Туялар", "Верблюды", "Camels")]],
    ["sahara", 23, 12, "🐪", t3("Сахара", "Сахара", "Sahara"), t3("Сахара — дунёдаги энг катта иссиқ чўл. У ерда ёмғир жуда кам ёғади, кундузи жуда иссиқ, кечаси эса салқин бўлади.", "Сахара — самая большая жаркая пустыня в мире. Дождей там очень мало, днём очень жарко, а ночью прохладно.", "The Sahara is the world's largest hot desert. It hardly ever rains, days are very hot and nights are cool."), t3("Сахара қандай жой?", "Что такое Сахара?", "What kind of place is the Sahara?"), [t3("Иссиқ чўл", "Жаркая пустыня", "A hot desert"), t3("Чучук кўл", "Пресное озеро", "A freshwater lake")]],
    ["rif", -18, 147, "🐠", t3("Буюк тўсиқ рифи", "Большой Барьерный риф", "Great Barrier Reef"), t3("Австралия ёнидаги Буюк тўсиқ рифи — дунёдаги энг катта маржон рифи. Сув жуда исиб кетса, маржонлар оқариб касал бўлади.", "Большой Барьерный риф у берегов Австралии — крупнейший коралловый риф в мире. Если вода сильно нагревается, кораллы белеют и болеют.", "The Great Barrier Reef near Australia is the world's largest coral reef. When the water gets too warm, corals turn white and get sick."), t3("Сув исиб кетса, маржонларга нима бўлади?", "Что происходит с кораллами, если вода перегревается?", "What happens to corals when the water gets too warm?"), [t3("Оқариб касал бўлади", "Белеют и болеют", "They turn white and get sick"), t3("Тезроқ ўсади", "Растут быстрее", "They grow faster")]],
    ["himolay", 28, 86.9, "🏔️", t3("Ҳимолай тоғлари", "Гималаи", "Himalayas"), t3("Ҳимолайда дунёнинг энг баланд тоғи — Эверест (8849 м) бор. Тоғ музликлари кўплаб дарёларга сув беради.", "В Гималаях находится самая высокая гора мира — Эверест (8849 м). Горные ледники питают водой многие реки.", "The Himalayas hold the world's highest mountain, Everest (8,849 m). Mountain glaciers feed many rivers with water."), t3("Дунёнинг энг баланд тоғи қайси?", "Какая гора самая высокая в мире?", "Which is the world's highest mountain?"), [t3("Эверест", "Эверест", "Everest"), t3("Чимён", "Чимган", "Chimgan")]],
    ["uzb", 41.3, 69.3, "🐆", t3("Ўзбекистон қўриқхоналари", "Заповедники Узбекистана", "Uzbekistan's nature reserves"), t3("Ўзбекистонда Чотқол ва Зарафшон каби қўриқхоналар бор. Улар ноёб ҳайвон ва ўсимликларни асрайди.", "В Узбекистане есть заповедники, например Чаткальский и Зарафшанский. Они охраняют редких животных и растения.", "Uzbekistan has nature reserves such as Chatkal and Zarafshan. They protect rare animals and plants."), t3("Қўриқхона нима учун керак?", "Зачем нужен заповедник?", "Why do we need a nature reserve?"), [t3("Ноёб ҳайвон ва ўсимликларни асраш учун", "Чтобы охранять редких животных и растения", "To protect rare animals and plants"), t3("Завод қуриш учун", "Чтобы строить заводы", "To build factories")]],
    ["tinch", 32, -140, "🧴", t3("Тинч океан", "Тихий океан", "Pacific Ocean"), t3("Тинч океанда оқимлар пластик чиқиндиларни тўплаб, катта «ахлат доғи»ни ҳосил қилган. Пластикни денизчилар ва балиқлар ҳам ютиб юборади.", "В Тихом океане течения собрали пластиковый мусор в огромное «мусорное пятно». Пластик проглатывают морские птицы и рыбы.", "In the Pacific Ocean, currents have gathered plastic waste into a huge ‘garbage patch’. Seabirds and fish swallow the plastic."), t3("Денгизга ташланган пластик нимага олиб келади?", "К чему приводит пластик, выброшенный в море?", "What does plastic thrown into the sea lead to?"), [t3("Катта ахлат доғига", "К огромному мусорному пятну", "A huge garbage patch"), t3("Балиқлар кўпаяди", "Рыбы размножаются", "More fish")]]
  ];
  let LAND = null;
  const loadLand = () => LAND || (LAND = fetch("/vendor/world-land.json").then((r) => r.json()).catch(() => []));
  function landTexture(T, rings) {
    const W = 1024, Hh = 512, c = document.createElement("canvas"); c.width = W; c.height = Hh;
    const g = c.getContext("2d");
    const grd = g.createLinearGradient(0, 0, 0, Hh); grd.addColorStop(0, "#1e3a8a"); grd.addColorStop(0.5, "#2563eb"); grd.addColorStop(1, "#1e3a8a");
    g.fillStyle = grd; g.fillRect(0, 0, W, Hh);
    const X = (lon) => ((lon + 180) / 360) * W, Y = (lat) => ((90 - lat) / 180) * Hh;
    rings.forEach((r) => {
      /* антимеридиандан ўтадиган ҳалқалар учун узунликни узлуксиз қилиб, уч марта (−360, 0, +360) чизамиз */
      const pts = []; let prev = null, off = 0;
      for (let i = 0; i < r.length; i += 2) { let lon = r[i] + off; if (prev != null && lon - prev > 180) { off -= 360; lon -= 360; } else if (prev != null && prev - lon > 180) { off += 360; lon += 360; } pts.push([lon, r[i + 1]]); prev = lon; }
      const polar = pts.some(([, la]) => la < -60);
      [-360, 0, 360].forEach((sh) => {
        g.beginPath();
        pts.forEach(([lo, la], k) => (k ? g.lineTo(X(lo + sh), Y(la)) : g.moveTo(X(lo + sh), Y(la))));
        if (polar && Math.abs(pts[0][0] - pts[pts.length - 1][0]) > 300) { g.lineTo(X(pts[pts.length - 1][0] + sh), Hh); g.lineTo(X(pts[0][0] + sh), Hh); }
        g.closePath();
        g.fillStyle = polar ? "#f1f5f9" : "#4d9b45"; g.fill();
        g.lineWidth = 1.2; g.strokeStyle = "rgba(15, 60, 20, .55)"; g.stroke();
      });
    });
    /* Шимолий қутб музлиги */
    g.fillStyle = "rgba(241, 245, 249, .9)"; g.fillRect(0, 0, W, Y(80));
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }
  /* Three.js SphereGeometry UV ига мос: u = (λ + 180)/360 */
  const ll2v = (T, lat, lon, r) => { const u = ((lon + 180) / 360) * Math.PI * 2, f = (lat * Math.PI) / 180; return new T.Vector3(-Math.cos(u) * Math.cos(f) * r, Math.sin(f) * r, Math.sin(u) * Math.cos(f) * r); };
  const GLOBE = {
    id: "globus", icon: "🌍",
    name: t3("Ер шари саёҳати", "Путешествие по Земле", "Around the globe"),
    desc: t3("8 та жойга бориб, муҳр йиғинг", "Посетите 8 мест и соберите печати", "Visit 8 places and collect stamps"),
    how: [t3("Глобусни бармоқ билан айлантиринг ва қизил байроқчани босинг (ёки пастдаги рўйхатдан танланг).", "Вращайте глобус пальцем и нажмите на красный флажок (или выберите из списка ниже).", "Spin the globe with your finger and tap a red flag (or pick from the list below)."), t3("Жой ҳақидаги қизиқ фактни ўқинг ва саволга жавоб беринг.", "Прочитайте интересный факт о месте и ответьте на вопрос.", "Read the fun fact about the place and answer the question."), t3("Тўғри жавоб — олтин муҳр. 8 та муҳрни йиғинг!", "Правильный ответ — золотая печать. Соберите 8 печатей!", "A right answer earns a gold stamp. Collect all 8!")],
    view: { bg: "#020617", d: 3.4, ph: 1.15, th: 0.6, target: [0, 0, 0], minD: 1.8, maxD: 6 },
    build(v, ui, lib) {
      const T = lib.T, S = { open: null, got: new Set(), wrong: false };
      const earth = new T.Mesh(new T.SphereGeometry(1, 64, 48), new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }));
      v.scene.add(earth);
      loadLand().then((rings) => { if (rings && rings.length) { earth.material.map = landTexture(T, rings); earth.material.needsUpdate = true; v.render(); } });
      const glow = new T.Mesh(new T.SphereGeometry(1.06, 48, 32), new T.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.12, side: T.BackSide })); v.scene.add(glow);
      const sg = new T.BufferGeometry(), sp = [];
      for (let i = 0; i < 500; i++) { const u = Math.random() * 2 - 1, a = Math.random() * 6.283, r = 25; sp.push(r * Math.sqrt(1 - u * u) * Math.cos(a), r * u, r * Math.sqrt(1 - u * u) * Math.sin(a)); }
      sg.setAttribute("position", new T.Float32BufferAttribute(sp, 3)); v.scene.add(new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 0.06 })));
      const red = new T.MeshStandardMaterial({ color: 0xef4444, emissive: 0x7f1d1d }), gold = new T.MeshStandardMaterial({ color: 0xfacc15, emissive: 0x854d0e, metalness: 0.4 });
      const pins = PLACES.map(([id, la, lo, e], k) => {
        const g = new T.Group(), base = ll2v(T, la, lo, 1);
        g.position.copy(base); g.lookAt(base.clone().multiplyScalar(2)); v.scene.add(g);
        const stem = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, 0.16, 6), new T.MeshStandardMaterial({ color: 0xffffff })); stem.rotation.x = Math.PI / 2; stem.position.z = 0.08; g.add(stem);
        const head = new T.Mesh(new T.SphereGeometry(0.04, 12, 8), red); head.position.z = 0.17; g.add(head);
        const lab = lib.textSprite(e, "#ffffff", 0.14); lab.position.z = 0.27; g.add(lab);
        g.userData = { k, head };
        return g;
      });
      v.updaters.push((dt, t) => { pins.forEach((p, i) => { const s = 1 + Math.sin(t * 3 + i) * 0.15; p.userData.head.scale.setScalar(S.got.has(PLACES[i][0]) ? 1.2 : s); }); });
      const focus = (k) => { const p = ll2v(T, PLACES[k][1], PLACES[k][2], 1); v.th = Math.atan2(p.x, p.z); v.ph = clamp(Math.acos(p.y), 0.25, 2.9); v.auto = false; v.syncAuto(); v.place(); };
      const openP = (k) => { S.open = k; S.wrong = false; focus(k); ui.render(); };
      const answer = (ok) => {
        const id = PLACES[S.open][0];
        if (ok) { S.got.add(id); pins[S.open].userData.head.material = gold; S.wrong = false; if (S.got.size === PLACES.length) saveStars("globus", 3); }
        else S.wrong = true;
        ui.render();
      };
      const ray = new T.Raycaster(), ndc = new T.Vector2();
      v.onTap = (e) => {
        const r = v.canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, v.camera);
        const hits = ray.intersectObjects([earth, ...pins], true);
        const h = hits.find((x) => x.object !== earth);
        if (h && (!hits[0] || hits[0].object !== earth || hits[0].distance > h.distance - 0.05)) { let o = h.object; while (o && o.userData.k == null) o = o.parent; if (o) openP(o.userData.k); }
      };
      ui.html = () => {
        const list = PLACES.map(([id, , , e, n], k) => `<button type="button" class="chip ${S.open === k ? "active" : ""}" data-place="${k}">${S.got.has(id) ? "🏅" : e} ${H(n)}</button>`).join("");
        let card = `<p class="small muted">${H(t3("Байроқчани ёки жой номини босинг.", "Нажмите на флажок или название места.", "Tap a flag or a place name."))}</p>`;
        if (S.open != null) {
          const [id, , , e, n, f, q, opts] = PLACES[S.open], has = S.got.has(id);
          const order = (S.open % 2) ? [1, 0] : [0, 1];
          card = `<div class="d3-card"><h4>${e} ${H(n)}</h4><p>${H(f)}</p>
            ${has ? `<p class="lab-out">🏅 ${H(t3("Муҳр олинди!", "Печать получена!", "Stamp collected!"))}</p>` : `<p><b>${H(q)}</b></p><div class="lab-opts">${order.map((i) => `<button type="button" class="sg-opt" data-ans="${i}">${H(opts[i])}</button>`).join("")}</div>${S.wrong ? `<p class="small d3-bad">🤔 ${H(t3("Яна бир бор ўйлаб кўринг — фактни қайта ўқинг.", "Подумайте ещё раз — перечитайте факт.", "Think again — read the fact once more."))}</p>` : ""}`}
          </div>`;
        }
        return `<div class="l3-big"><span>${S.got.size === PLACES.length ? "🏆" : "🧭"}</span><b>${S.got.size} / ${PLACES.length}</b><small>${H(t3("муҳр", "печатей", "stamps"))}</small></div>
          <div class="filters l3-chips">${list}</div>${card}`;
      };
      ui.bind = (el) => {
        el.querySelectorAll("[data-place]").forEach((b) => b.addEventListener("click", () => openP(+b.dataset.place)));
        el.querySelectorAll("[data-ans]").forEach((b) => b.addEventListener("click", () => answer(b.dataset.ans === "0")));
      };
    }
  };

  const GAMES = [SORT, ISLAND, GLOBE];

  /* ===================== Бўлимни чизиш ===================== */
  let cur = GAMES[0].id, view = null, built = false, glFail = false, mountId = 0;
  function shell() {
    const st = stars();
    ROOT.innerHTML = `<span class="pill">${H(TX.pill)}</span>
      <h2 class="section-title">${H(TX.title)}</h2>
      <p class="muted">${H(TX.lead)}</p>
      <div class="d3-games" role="tablist">${GAMES.map((g) => `<button type="button" role="tab" aria-selected="${g.id === cur}" class="d3-game ${g.id === cur ? "on" : ""}" data-g="${g.id}"><span class="d3-gi" aria-hidden="true">${g.icon}</span><b>${H(g.name)}</b><small>${H(g.desc)}</small><span class="d3-gs" aria-label="${st[g.id] || 0} / 3">${"⭐".repeat(st[g.id] || 0)}${"☆".repeat(3 - (st[g.id] || 0))}</span></button>`).join("")}</div>
      <details class="l3-how" open><summary><b>${H(TX.how)}</b></summary><ol>${GAMES.find((g) => g.id === cur).how.map((x) => `<li>${H(x)}</li>`).join("")}</ol></details>
      <div class="lab-stage l3-stage">
        <div class="l3-row">
          <div class="l3-viewbox">
            <div class="l3-view d3-view" data-view><p class="l3-load">${H(TX.load)}</p></div>
            <div class="l3-tools">
              <button type="button" class="l3-tb" data-tool="in" title="＋" aria-label="＋"><i class="fa-solid fa-plus"></i></button>
              <button type="button" class="l3-tb" data-tool="out" title="−" aria-label="−"><i class="fa-solid fa-minus"></i></button>
              <button type="button" class="l3-tb" data-tool="home" title="⟲" aria-label="⟲"><i class="fa-solid fa-house"></i></button>
            </div>
            <p class="small muted l3-hint">${H(TX.hint)}</p>
          </div>
          <div class="lab-ctl l3-panel" data-panel aria-live="polite"></div>
        </div>
      </div>
      <p class="small muted" style="margin-top:14px">${H(TX.parents)}</p>`;
    ROOT.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.g !== cur) { cur = b.dataset.g; mount(); } }));
  }
  async function mount() {
    const my = ++mountId;
    if (view) { view.dispose(); view = null; }
    shell();
    const game = GAMES.find((g) => g.id === cur);
    const panel = ROOT.querySelector("[data-panel]");
    const ui = { el: panel, html: () => "", bind: () => {} };
    ui.render = () => { panel.innerHTML = ui.html(); ui.bind(panel); };
    ui.restart = () => mount();
    const host = ROOT.querySelector("[data-view]");
    const L3 = window.EkoLab3D && window.EkoLab3D.lib;
    let lib = null;
    try {
      if (!L3) throw new Error("lib");
      const T = await L3.loadThree();
      if (my !== mountId) return;
      if (glFail) throw new Error("webgl");
      lib = { T, textSprite: L3.textSprite };
      view = L3.View(host, game.view);
      view.canvas.setAttribute("aria-label", L(TX.title) + ": " + L(game.name));
      const lp = host.querySelector(".l3-load"); if (lp) lp.remove();
    } catch (e) {
      glFail = !!L3;
      host.innerHTML = `<p class="l3-load">${H(TX.noGl)}</p>`;
      view = null;
    }
    if (view) {
      game.build.call(game, view, ui, lib);
      ROOT.querySelector(".l3-tools").addEventListener("click", (e) => {
        const b = e.target.closest("[data-tool]"); if (!b || !view) return;
        if (b.dataset.tool === "in") view.zoom(0.85);
        if (b.dataset.tool === "out") view.zoom(1.18);
        if (b.dataset.tool === "home") view.resetView();
      });
      sync();
    } else {
      ROOT.querySelector(".l3-tools").hidden = true;
      /* WebGL йўқ: ўйин тугмалар орқали ишлайверади */
      const T0 = { Mesh: function () {}, Group: function () {} };
      try {
        const stub = new Proxy({ scene: { add() {}, remove() {} }, updaters: [], canvas: document.createElement("canvas") }, { get: (o, k) => (k in o ? o[k] : () => {}) });
        const fake = new Proxy(function () {}, { get: () => fake, apply: () => fake, construct: () => fake });
        game.build.call(game, stub, ui, { T: fake, textSprite: () => fake });
      } catch (e) { /* ignore */ }
      void T0;
    }
    if (!panel.innerHTML) ui.render();
  }
  function visible() { return SEC.classList.contains("page-on") && !document.hidden; }
  function sync() { if (!view) return; if (visible()) { view.resize(); view.start(); } else view.stop(); }
  function onShow() { if (!visible()) { sync(); return; } if (!built) { built = true; mount(); } else sync(); }
  new MutationObserver(onShow).observe(SEC, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", onShow);
  window.addEventListener("eko:lang", () => { if (built) mount(); else shell(); });
  window.EkoDunyo3D = { get view() { return view; }, open: (id) => { if (GAMES.some((g) => g.id === id)) { cur = id; if (built) mount(); else shell(); } } };
  shell();
  onShow();
})();
