document.addEventListener("DOMContentLoaded", function() {
    const anchors = document.querySelectorAll('a.anchor');
    anchors.forEach(function(anchor) {
        anchor.setAttribute('aria-hidden', 'false');
        anchor.setAttribute('aria-label', anchor.parentElement.textContent)
    });
  });