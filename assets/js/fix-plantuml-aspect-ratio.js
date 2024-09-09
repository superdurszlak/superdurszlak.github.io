document.addEventListener("DOMContentLoaded", function() {
    const svgs = document.querySelectorAll('svg.plantuml');
    svgs.forEach(function(svg) {
        // Actual width of the parent container of SVG
        const width = svg.parentElement.offsetWidth;

        // Aspect ratio of the original SVG
        const svgWidth = svg.viewBox.baseVal.width;
        const svgHeight = svg.viewBox.baseVal.height;
        const svgAspectRatio = svgWidth / svgHeight;

        // Computed height of the 
        const height = width / svgAspectRatio;

        // Set aspect ratio rules and desired height to crop excessively tall SVG viewbox
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.height = `${height}px`
    });
  });