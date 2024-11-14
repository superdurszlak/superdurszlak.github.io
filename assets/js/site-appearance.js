const themeChoiceMapping = {
  browser: getDefaultPreference,
  light: () => "light",
  dark: () => "dark",
};

const giscusThemeMapping = {
  light: "light",
  dark: "dark_dimmed",
  "dark-contrast": "dark_high_contrast",
  "light-contrast": "light_high_contrast",
};

const defaultChoice = "browser";

const themeKey = "theme";
const contrastKey = "contrast";
const fontSizeKey = "fontSize";

loadAppearanceFromLocalStorage();

document.addEventListener("DOMContentLoaded", () => {
  enableThemeDropdown();

  enableA11yDropdown();

  toggleInputsOnButtonClick();
});

function toggleInputsOnButtonClick() {
  const allButtons = document.querySelectorAll(".menu-item");

  allButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (!button.contains(event.target)) {
        return;
      }
      const input = button.querySelector(".menu-option");
      if (input) {
        if(input.type === "radio") {
          input.checked = true;
        } else if (input.type === "checkbox") {
          input.value = !(input.value === "true");
        }
        input.click();
      }
      reloadAppearance();
    });
  });
}

function reloadAppearance() {
  updateLocalStorageState();

  loadAppearanceFromLocalStorage();
}

function updateLocalStorageState() {
  const theme = getSelectedTheme();
  localStorage.setItem(themeKey, theme);

  const contrastEnabled = isContrastEnabled();
  localStorage.setItem(contrastKey, contrastEnabled);

  const largeFontEnabled = isLargeFontEnabled();
  localStorage.setItem(fontSizeKey, largeFontEnabled);
}

function loadAppearanceFromLocalStorage() {
  const themeSelection = localStorage.getItem(themeKey) || defaultChoice;
  const contrastSelection = localStorage.getItem(contrastKey) === "true";
  const fontSizeSelection = localStorage.getItem(fontSizeKey) === "true";

  setThemeChoice(themeSelection);
  setContrastChoice(contrastSelection);
  setFontSizeChoice(fontSizeSelection);

  document.documentElement.setAttribute(
    "data-theme",
    getThemeFromChoice(themeSelection)
  );
  document.documentElement.setAttribute("data-contrast", contrastSelection);
  document.documentElement.setAttribute("data-large-font", fontSizeSelection);

  setThemes(themeSelection, contrastSelection);
}

function getSelectedTheme() {
  const selection = document.querySelector(
    '#theme-menu input[name="theme"]:checked'
  );
  const choice = selection ? selection.value : defaultChoice;
  return getThemeFromChoice(choice);
}

function getThemeFromChoice(choice) {
  return (themeChoiceMapping[choice] || getDefaultPreference)();
}

function isContrastEnabled() {
  const toggle = getContrastToggle();
  return toggle ? toggle.value : false;
}

function isLargeFontEnabled() {
  const toggle = getFontSizeToggle();
  return toggle ? toggle.value : false;
}

function setThemeChoice(choice) {
  const toggle = document.querySelector(`#theme-menu input[name="${choice}"]`);
  if (toggle) {
    toggle.checked = true;
  }
}

function setContrastChoice(choice) {
  const toggle = getContrastToggle();
  if (toggle) {
    toggle.value = choice;
  }
}

function setFontSizeChoice(choice) {
  const toggle = getFontSizeToggle();
  if (toggle) {
    toggle.value = choice;
  }
}

function getContrastToggle() {
  return document.getElementById("contrast-setting");
}

function getFontSizeToggle() {
  return document.getElementById("font-size-setting");
}

function setThemes(themeSelection, contrastEnabled) {
  const theme = (themeChoiceMapping[themeSelection] || getDefaultPreference)();
  const giscusThemeKey = contrastEnabled ? `${theme}-contrast` : theme;
  const giscusTheme = giscusThemeMapping[giscusThemeKey];

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

function enableA11yDropdown() {
  const menu = document.getElementById("a11y-menu");
  if (menu) {
    menu.style.display = "block";
  }
}
