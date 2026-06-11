/**
 * Genera la imagen Open Graph (public/og.png, 1200×630) con Playwright.
 * Uso: node scripts/generate-og.mjs
 * Requiere Playwright global (instalado vía Homebrew) o local.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';

async function loadChromium() {
	try {
		const pw = await import('playwright');
		return pw.chromium;
	} catch {
		const pw = await import('/opt/homebrew/lib/node_modules/playwright/index.mjs');
		return pw.chromium;
	}
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../public/og.png');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@300;400;500&display=swap">
<style>
	:root {
		--ink: #0a0a0c;
		--ink-2: #131318;
		--line: #2a2a32;
		--text: #f5f1e8;
		--text-dim: #8a8680;
		--acid: #c8ff00;
		--ember: #ff6b35;
	}
	* { margin: 0; padding: 0; box-sizing: border-box; }
	body {
		width: 1200px;
		height: 630px;
		background: var(--ink);
		color: var(--text);
		font-family: 'Manrope', sans-serif;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 64px 72px;
	}
	/* Grain sutil */
	body::before {
		content: "";
		position: absolute;
		inset: 0;
		opacity: 0.05;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}
	/* Vignette */
	body::after {
		content: "";
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%);
		pointer-events: none;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: 'JetBrains Mono', monospace;
		font-size: 20px;
		letter-spacing: 0.05em;
	}
	.mark .bracket { color: var(--acid); }
	.status {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text-dim);
		font-size: 16px;
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}
	.dot {
		width: 10px; height: 10px;
		background: var(--acid);
		border-radius: 50%;
		box-shadow: 0 0 16px var(--acid);
	}
	.name {
		font-family: 'Instrument Serif', serif;
		font-weight: 400;
		font-size: 150px;
		line-height: 0.92;
		letter-spacing: -0.03em;
	}
	.name .last {
		font-style: italic;
		color: var(--acid);
		display: block;
	}
	.cursor { color: var(--acid); font-style: normal; }
	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}
	.role {
		font-family: 'JetBrains Mono', monospace;
		font-size: 26px;
		color: var(--text-dim);
		letter-spacing: 0.04em;
	}
	.role .bracket { color: var(--acid); }
	.url {
		font-family: 'JetBrains Mono', monospace;
		font-size: 22px;
		color: var(--text);
		border-bottom: 2px solid var(--acid);
		padding-bottom: 4px;
	}
	.rule {
		position: absolute;
		left: 72px; right: 72px;
		top: 142px;
		height: 1px;
		background: var(--line);
	}
</style>
</head>
<body>
	<div class="top">
		<span class="mark"><span class="bracket">[</span> K.S <span class="bracket">]</span></span>
		<span class="status"><span class="dot"></span> Disponible para trabajar</span>
	</div>
	<div class="rule"></div>
	<h1 class="name">Kilian<span class="last">Sánchez<span class="cursor">_</span></span></h1>
	<div class="bottom">
		<span class="role"><span class="bracket">[</span> Desarrollador Web · Front-End <span class="bracket">]</span></span>
		<span class="url">idankest.dev</span>
	</div>
</body>
</html>`;

const chromium = await loadChromium();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: OUT });
await browser.close();
console.log(`OG image generada en ${OUT}`);
