const giscusThemeMapping = {
  light: "light",
  dark: "dark_dimmed",
  "dark-contrast": "dark_high_contrast",
  "light-contrast": "light_high_contrast"
};

const themeKey = "theme";

document.addEventListener("DOMContentLoaded", () => {
  const themeButtons = document.querySelectorAll(".theme-option");

  const preSelected = localStorage.getItem(themeKey) || getDefaultPreference();
  setThemes(preSelected);

  themeButtons.forEach((button) => {
    button.addEventListener("change", (event) => setThemes(event.target.value));
  });

  function setThemes(theme) {
    localStorage.setItem(themeKey, theme)
    const giscusTheme = giscusThemeMapping[theme];
    setSiteTheme(theme);
    setGiscusTheme(giscusTheme);
  }

  function setSiteTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function setGiscusTheme(giscusTheme) {
    if (!giscusTheme) return;

    const iframe = document.querySelector("iframe.giscus-frame");

    if (!iframe) return;

    const message = {
      giscus: {
        setConfig: {
          theme: giscusTheme,
        },
      },
    };
    iframe.contentWindow.postMessage(message, "https://giscus.app");
    console.log("done setting theme to ", giscusTheme);
  }

  function getDefaultPreference() {
    var mode = "light";

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      mode = "dark";
    }

    if (highContrastHeuristicMatches()) {
      mode += "-contrast";
    }

    return mode;
  }

  function browserDarkModeMatches() {}

  function highContrastHeuristicMatches() {
    const heuristicColor = "rgb(0, 0, 0)";
    const div = document.createElement("div");
    div.style.backgroundColor = heuristicColor;
    document.body.appendChild(div);

    const computedColor = window.getComputedStyle(div).backgroundColor;
    document.body.removeChild(div);

    // If the computed color has changed, it indicates the browser forces high contrast or other mode
    return computedColor !== heuristicColor;
  }
});
