/* ЭкоТаълим Android илова ёрдамчиси: WebView'да <a download> ишламайди,
   шунинг учун бундай ҳаволалар илова орқали сақланади. */
(function () {
  if (window.__ekoAndroid || !window.EkoAndroid) return;
  window.__ekoAndroid = true;
  document.documentElement.classList.add("in-app");

  function save(a) {
    var href = a.href || "";
    if (!a.hasAttribute("download") || !/^(data|blob):/.test(href)) return false;
    var name = a.getAttribute("download") || "EkoTalim";
    fetch(href).then(function (r) { return r.blob(); }).then(function (b) {
      var fr = new FileReader();
      fr.onload = function () {
        var s = String(fr.result);
        window.EkoAndroid.save(name, b.type || "", s.slice(s.indexOf(",") + 1));
      };
      fr.readAsDataURL(b);
    }).catch(function () {});
    return true;
  }

  var click = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (!save(this)) click.call(this);
  };
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[download]") : null;
    if (a && save(a)) e.preventDefault();
  }, true);
})();

/* Автоматик янгиланиш ойнаси. Илова (MainActivity) янги версия ёки янги контент
   топса, EkoUpdate.apk(...) ёки EkoUpdate.content() ни чақиради. Дизайн 2.0 ранглари. */
(function () {
  if (window.EkoUpdate || !window.EkoAndroid) return;
  var card = null, bar = null;

  function css() {
    if (document.getElementById("eko-upd-css")) return;
    var s = document.createElement("style");
    s.id = "eko-upd-css";
    s.textContent =
      ".eko-upd{position:fixed;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:2147483000;" +
      "max-width:440px;margin:0 auto;padding:16px 16px 14px;border-radius:20px;font-family:var(--eko-font,system-ui,sans-serif);" +
      "color:#0b2a1f;background:rgba(255,255,255,.86);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);" +
      "border:1px solid rgba(4,120,87,.18);box-shadow:0 18px 50px -12px rgba(6,78,59,.35);animation:eko-upd-in .35s cubic-bezier(.2,.9,.3,1.2)}" +
      ".eko-upd-h{display:flex;gap:12px;align-items:center}" +
      ".eko-upd-i{flex:none;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font-size:22px;" +
      "background:linear-gradient(135deg,#34d399,#047857);color:#fff;box-shadow:0 6px 16px -6px #047857}" +
      ".eko-upd b{display:block;font-size:16px;font-weight:700;line-height:1.25}" +
      ".eko-upd small{display:block;margin-top:2px;font-size:13px;opacity:.72;line-height:1.35}" +
      ".eko-upd p{margin:10px 0 0;font-size:13px;line-height:1.45;opacity:.85;white-space:pre-line;max-height:7.5em;overflow:auto}" +
      ".eko-upd-bar{height:6px;margin-top:12px;border-radius:9px;background:rgba(4,120,87,.12);overflow:hidden;display:none}" +
      ".eko-upd-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#34d399,#047857);transition:width .2s}" +
      ".eko-upd-b{display:flex;gap:8px;margin-top:14px}" +
      ".eko-upd-b button{flex:1;min-height:44px;border-radius:14px;font:inherit;font-size:15px;font-weight:600;cursor:pointer;border:0}" +
      ".eko-upd-go{background:#047857;color:#fff}" +
      ".eko-upd-go:disabled{opacity:.6}" +
      ".eko-upd-no{background:transparent;color:inherit;border:1px solid rgba(4,120,87,.25)!important}" +
      "@keyframes eko-upd-in{from{transform:translateY(24px);opacity:0}}" +
      "@media (prefers-reduced-motion:reduce){.eko-upd{animation:none}}" +
      "@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .eko-upd{color:#e6fff4;background:rgba(10,28,22,.86);border-color:rgba(52,211,153,.25)}" +
      ":root:not([data-theme=light]) .eko-upd-go{background:#34d399;color:#06281c}}" +
      ":root[data-theme=dark] .eko-upd{color:#e6fff4;background:rgba(10,28,22,.86);border-color:rgba(52,211,153,.25)}" +
      ":root[data-theme=dark] .eko-upd-go{background:#34d399;color:#06281c}";
    (document.head || document.documentElement).appendChild(s);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function show(icon, title, sub, notes, go, onGo, onNo) {
    if (!document.body) return;
    css();
    close();
    card = el("div", "eko-upd");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-live", "polite");
    var h = el("div", "eko-upd-h");
    h.appendChild(el("div", "eko-upd-i", icon));
    var t = el("div");
    t.appendChild(el("b", "", title));
    t.appendChild(el("small", "", sub));
    h.appendChild(t);
    card.appendChild(h);
    if (notes) card.appendChild(el("p", "", notes));
    var b = el("div", "eko-upd-bar");
    bar = el("i");
    b.appendChild(bar);
    card.appendChild(b);
    var row = el("div", "eko-upd-b");
    var no = el("button", "eko-upd-no", "Кейинроқ");
    var yes = el("button", "eko-upd-go", go);
    no.type = yes.type = "button";
    no.onclick = function () { close(); onNo(); };
    yes.onclick = function () { onGo(yes, b); };
    row.appendChild(no);
    row.appendChild(yes);
    card.appendChild(row);
    document.body.appendChild(card);
  }

  function close() {
    if (card && card.parentNode) card.parentNode.removeChild(card);
    card = bar = null;
  }

  function mb(n) { return n ? " · " + (n / 1048576).toFixed(1) + " МБ" : ""; }

  window.EkoUpdate = {
    apk: function (info) {
      var cur = window.EkoAndroid.version ? window.EkoAndroid.version() : "";
      show("⬆️", "ЭкоТаълим " + info.versionName + " чиқди",
        (cur ? "Сизда " + cur + " ўрнатилган" : "Янги версия") + mb(info.size), info.notes || "",
        "Янгилаш",
        function (btn, b) {
          btn.disabled = true;
          btn.textContent = "Юкланмоқда…";
          b.style.display = "block";
          window.EkoAndroid.installUpdate();
        },
        function () { window.EkoAndroid.dismissUpdate(true); });
    },
    content: function () {
      show("🌱", "Янги маълумотлар тайёр", "Платформа янгиланди. Кўриш учун саҳифани янгиланг.", "",
        "Янгилаш",
        function () { close(); window.EkoAndroid.applyContent(); },
        function () { window.EkoAndroid.dismissUpdate(false); });
    },
    progress: function (p) {
      if (bar) bar.style.width = p + "%";
      var btn = card && card.querySelector(".eko-upd-go");
      if (btn) btn.textContent = p + "%";
    },
    downloaded: function () {
      var btn = card && card.querySelector(".eko-upd-go");
      if (btn) { btn.disabled = false; btn.textContent = "Ўрнатиш"; btn.onclick = function () { window.EkoAndroid.installUpdate(); }; }
    },
    failed: function () {
      var btn = card && card.querySelector(".eko-upd-go");
      if (btn) { btn.disabled = false; btn.textContent = "Қайта уриниш"; }
      var sub = card && card.querySelector("small");
      if (sub) sub.textContent = "Юклаб бўлмади. Интернетни текшириб, қайта уриниб кўринг.";
    }
  };
})();
