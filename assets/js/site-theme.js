const giscusThemeMapping = {
  light: "light",
  dark: "dark_dimmed",
  "dark-contrast": "dark_high_contrast",
  "light-contrast": "light_high_contrast",
};

document.addEventListener("DOMContentLoaded", () => {
  const themeButtons = document.querySelectorAll(".theme-option");

  themeButtons.forEach((button) => {
    button.addEventListener("change", (event) => {
      const theme = event.target.value;
      const giscusTheme = giscusThemeMapping[theme];
      setSiteTheme(theme);
      setGiscusTheme(giscusTheme);
    });
  });

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
});
