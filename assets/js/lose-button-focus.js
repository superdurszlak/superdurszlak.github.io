const eventsOfInterest = ["mousedown", "pointerdown"];

document.addEventListener("DOMContentLoaded", () => {
  eventsOfInterest.forEach((eventType) => {
    document.addEventListener(eventType, (event) => {
      document.querySelectorAll(".menu-button").forEach((button) => {
        if (!button.contains(event.target)) {
          checkbox = button.querySelector('input[type="checkbox"]');

          if (checkbox) {
            checkbox.checked = false;
          }
        }
      });
    });
  });
});
