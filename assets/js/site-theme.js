const themeChoiceMapping = {
  browser: getDefaultPreference,
  light: () => "light",
  dark: () => "dark",
  "dark-contrast": () => "dark-contrast",
  "light-contrast": () => "light-contrast",
};

const giscusThemeMapping = {
  light: "light",
  dark: "dark_dimmed",
  "dark-contrast": "dark_high_contrast",
  "light-contrast": "light_high_contrast",
};

const themeKey = "theme";

document.addEventListener("DOMContentLoaded", () => {
  enableThemeDropdown();

  const themeButtons = document.querySelectorAll(".menu-item");

  const preSelected = localStorage.getItem(themeKey) || "browser";
  setThemes(preSelected);

  themeButtons.forEach((button) => {
    const radio = button.querySelector(".theme-option");

    if (radio) {
      button.addEventListener("click", (_) => radio.click());

      radio.addEventListener("change", (event) =>
        setThemes(event.target.value)
      );
    }
  });
});

function setThemes(choice) {
  const theme = (themeChoiceMapping[choice] || getDefaultPreference)();
  localStorage.setItem(themeKey, theme);
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
}

function getDefaultPreference() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function enableThemeDropdown() {
  const menu = document.getElementById("theme-menu");
  if (menu) {
    menu.style.display = "block";
  }
}
