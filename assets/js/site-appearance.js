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

const defaultThemeChoice = "browser";
const defaultColorFilterChoice = "default";

const themeKey = "theme";
const contrastKey = "contrast";
const fontSizeKey = "fontSize";
const colorFilterKey = "colorFilter";

loadAppearanceFromLocalStorage();

onTerminalElementLoaded(loadAppearanceFromLocalStorage);

document.addEventListener("DOMContentLoaded", () => {
  enableThemeDropdown();

  enableA11yDropdown();

  toggleInputsOnButtonClick();
});

function onTerminalElementLoaded(action) {
  const observer = new MutationObserver((mutationsList) => {
    const terminalElementLoaded = mutationsList
      .filter((mutation) => mutation.type === "childList")
      .map((mutation) => Array.from(mutation.addedNodes))
      .flat()
      .find((node) => node.id === "end-of-doc-marker");

    if (terminalElementLoaded) {
      action();
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function toggleInputsOnButtonClick() {
  const allButtons = document.querySelectorAll(".menu-item");

  allButtons.forEach((button) => {
    button.removeEventListener("click", (_) => {});
    button.addEventListener("click", (event) => {
      if (!button.contains(event.target)) {
        return;
      }
      const input = button.querySelector(".menu-option");
      if (input) {
        if (input.type === "radio") {
          input.checked = true;
        } else if (input.type === "checkbox") {
          input.value = !(input.value === "true");
        }
        reloadAppearance();
      }
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

  const colorFilter = getSelectedColorFilter();
  localStorage.setItem(colorFilterKey, colorFilter);
}

function loadAppearanceFromLocalStorage() {
  const themeSelection = localStorage.getItem(themeKey) || defaultThemeChoice;
  const contrastSelection = localStorage.getItem(contrastKey) === "true";
  const fontSizeSelection = localStorage.getItem(fontSizeKey) === "true";
  const colorFilterSelection = localStorage.getItem(colorFilterKey) || defaultColorFilterChoice;

  setThemeChoice(themeSelection);
  setContrastChoice(contrastSelection);
  setFontSizeChoice(fontSizeSelection);
  setColorFilterChoice(colorFilterSelection);

  document.documentElement.setAttribute(
    "data-theme",
    getThemeFromChoice(themeSelection)
  );
  document.documentElement.setAttribute("data-contrast", contrastSelection);
  document.documentElement.setAttribute("data-large-font", fontSizeSelection);
  document.documentElement.setAttribute("data-color-filter", colorFilterSelection);

  setThemes(themeSelection, contrastSelection);
  setDiagramsSize(fontSizeSelection);
}

function getSelectedTheme() {
  const selection = document.querySelector(
    '#theme-menu input[name="theme"]:checked'
  );
  const choice = selection ? selection.value : defaultThemeChoice;
  return choice;
}

function getThemeFromChoice(choice) {
  return (themeChoiceMapping[choice] || getDefaultPreference)();
}

function getSelectedColorFilter() {
  const selection = document.querySelector(
    '#color-filters-menu input[name="color-filter"]:checked'
  );
  const choice = selection ? selection.value : defaultColorFilterChoice;
  return choice;
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
  const toggle = document.querySelector(`#theme-menu input[value="${choice}"]`);
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

function setColorFilterChoice(choice) {
  const toggle = document.querySelector(`#color-filters-menu input[value="${choice}"]`);
  if (toggle) {
    toggle.checked = true;
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

function setDiagramsSize(useLargeFont) {
  const ratio = useLargeFont ? 2.0 : 1.0;
  document.querySelectorAll(".plantuml").forEach((diagram) => {
    diagram.style.width = `calc(${ratio} * ${
      diagram.width?.baseVal?.valueAsString || 0
    })`;
    diagram.style.height = `calc(${ratio} * ${
      diagram.height?.baseVal?.valueAsString || 0
    })`;
  });
}

function setSiteTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function setGiscusTheme(giscusTheme) {
  if (!giscusTheme) return;

  const script = document.getElementById("giscus-script");

  if (script) {
    script.setAttribute("data-theme", giscusTheme);
  }

  const iframe = document.querySelector("iframe.giscus-frame");

  if (iframe) {
    const message = {
      giscus: {
        setConfig: {
          theme: giscusTheme,
        },
      },
    };

    iframe.contentWindow.postMessage(message, "https://giscus.app");
  }
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
