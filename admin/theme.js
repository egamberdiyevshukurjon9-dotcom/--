/* Мавзуни саҳифа чизилишидан олдин қўйиш (CSP туфайли алоҳида файл) */
try { var t = localStorage.getItem("eko-admin-theme"); if (t === "light" || t === "dark") document.documentElement.dataset.theme = t; } catch (e) { /* ignore */ }
