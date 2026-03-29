const fs = require('fs');
const CleanCSS = require('clean-css');
const Terser = require('terser');
const path = require('path');

async function build() {
    console.log("Starting build process...");

    // 1. Read files
    let html = fs.readFileSync('index.html', 'utf8');
    let css = fs.readFileSync('css/style.css', 'utf8');
    let js = fs.readFileSync('js/main.js', 'utf8');

    // 2. Add focus-visible
    css += `
        a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
            outline: 2px solid var(--color-gold) !important;
            outline-offset: 2px !important;
            border-radius: 2px;
        }
    `;

    // 3. Minify CSS
    console.log("Minifying CSS...");
    const minifiedCss = new CleanCSS().minify(css).styles;

    // 4. Minify JS
    console.log("Minifying JS...");
    const minifiedJs = (await Terser.minify(js)).code;

    // 5. Replace stylesheet link with inline CSS
    html = html.replace('<link rel="stylesheet" href="css/style.css">', `<style>\n${minifiedCss}\n</style>`);

    // 6. Replace script tag with inline JS
    html = html.replace('<script src="js/main.js"></script>', `<script>\n${minifiedJs}\n</script>`);

    // 7. Fix internal anchors
    html = html.replace(/<section class="contact" id="contact">/g, '<section class="contact" id="appointment">');
    html = html.replace(/href="#contact"/g, 'href="#appointment"');

    // 8. Add favicon
    if (!html.includes('rel="icon"')) {
        let svgIcon = `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦷</text></svg>">`;
        html = html.replace(/<meta charset="UTF-8">/, `<meta charset="UTF-8">\n    ${svgIcon}`);
    }

    // 9. Write final file
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Build complete: index.html updated as single file.");
}

build().catch(err => console.error("Build failed:", err));
