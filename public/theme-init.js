// Aplica el tema antes del primer pintado para evitar el destello del tema
// equivocado. Es un archivo aparte porque la CSP no permite scripts inline.
// Debe coincidir con src/hooks/useTheme.ts (misma clave y colores).
(function () {
  var theme;
  try {
    theme = localStorage.getItem("theme");
  } catch (e) {
    theme = null;
  }
  var saved = theme === "light" || theme === "dark";
  if (!saved) {
    theme = matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  document.documentElement.dataset.theme = theme;

  // Con una preferencia guardada, la barra del navegador sigue al tema
  // elegido y no al del sistema.
  if (saved) {
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      metas[i].removeAttribute("media");
      metas[i].setAttribute(
        "content",
        theme === "light" ? "#faf7ff" : "#050010",
      );
    }
  }
})();
