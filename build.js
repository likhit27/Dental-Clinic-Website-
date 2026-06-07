const fs = require('fs');
const CleanCSS = require('clean-css');
const Terser = require('terser');

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
    const terserResult = await Terser.minify(js, {
        ecma: 2020,       // support async/await, fetch, etc.
        module: false,
        compress: true,
        mangle: true,
    });
    if (terserResult.error) {
        console.error("Terser error:", terserResult.error);
        process.exit(1);
    }
    const minifiedJs = terserResult.code;
    console.log("JS minified, fetch present:", minifiedJs.includes('fetch'));

    // 5. Replace stylesheet link with inline CSS (if not already inlined)
    if (html.includes('<link rel="stylesheet" href="css/style.css">')) {
        html = html.replace('<link rel="stylesheet" href="css/style.css">', `<style>\n${minifiedCss}\n</style>`);
        console.log("CSS inlined from link tag.");
    } else {
        // Already inlined — replace the existing <style> block
        html = html.replace(/<style>[\s\S]*?<\/style>/, `<style>\n${minifiedCss}\n</style>`);
        console.log("CSS replaced in existing style block.");
    }

    // 6. Replace JS — handles both <script src> and already-inlined <script>
    if (html.includes('<script src="js/main.js"></script>')) {
        html = html.replace('<script src="js/main.js"></script>', `<script>\n${minifiedJs}\n</script>`);
        console.log("JS inlined from script src tag.");
    } else {
        // Already inlined — find the LAST <script>...</script> block (the main app JS)
        const lastScriptRegex = /<script>([\s\S]*?)<\/script>(?![\s\S]*<script>)/;
        if (lastScriptRegex.test(html)) {
            html = html.replace(lastScriptRegex, `<script>\n${minifiedJs}\n</script>`);
            console.log("JS replaced in existing inline script block.");
        } else {
            console.error("Could not find script block to replace!");
            process.exit(1);
        }
    }

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

    // 10. Verify
    const finalHtml = fs.readFileSync('index.html', 'utf8');
    console.log("Verification — fetch in final index.html:", finalHtml.includes('fetch'));
}

build().catch(err => console.error("Build failed:", err));