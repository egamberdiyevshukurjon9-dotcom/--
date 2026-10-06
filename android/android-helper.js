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
