/**
 * Graba videos cortos de preview (webm) de los proyectos live con Playwright.
 * Salida: public/videos/<slug>.webm — el campo `video` de src/data/proyects.js apunta aquí.
 *
 * Uso: node scripts/record-previews.mjs [slug...]   (sin args graba todos)
 *
 * Los videos son reemplazables: si grabas una demo mejor (p.ej. con Reelify),
 * sobreescribe el archivo con el mismo nombre y no hay que tocar código.
 */
import { mkdirSync, renameSync, rmSync } from 'node:fs';
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
const OUT_DIR = path.resolve(__dirname, '../public/videos');
mkdirSync(OUT_DIR, { recursive: true });

/** Recorrido genérico: scroll suave por la página con pausas. */
const scrollTour = async (page) => {
	await page.waitForTimeout(1800);
	for (let i = 0; i < 3; i++) {
		await page.mouse.wheel(0, 600);
		await page.waitForTimeout(1400);
	}
	await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
	await page.waitForTimeout(1500);
};

const targets = [
	{ slug: 'orbix', url: 'https://orbixpro.netlify.app/', tour: scrollTour },
	{ slug: 'cripto', url: 'https://cryptovueapi.netlify.app/', tour: scrollTour },
	{ slug: 'admin-gastos', url: 'https://adgastos.netlify.app/', tour: scrollTour },
	{ slug: 'guitarra', url: 'https://gitardankest.netlify.app/', tour: scrollTour },
	{ slug: 'rooftop-rush', url: 'https://jlld47.github.io/Roof-Rush/', tour: scrollTour },
	{ slug: 'galagame', url: 'https://mygalagame.netlify.app/', tour: scrollTour },
];

const only = process.argv.slice(2);
const chromium = await loadChromium();
const browser = await chromium.launch();

for (const t of targets) {
	if (only.length && !only.includes(t.slug)) continue;
	const ctx = await browser.newContext({
		viewport: { width: 1280, height: 720 },
		recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 720 } },
	});
	const page = await ctx.newPage();
	try {
		await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30000 });
		await t.tour(page);
		const video = page.video();
		await ctx.close();
		const tmpPath = await video.path();
		renameSync(tmpPath, path.join(OUT_DIR, `${t.slug}.webm`));
		console.log(`OK ${t.slug}`);
	} catch (e) {
		await ctx.close().catch(() => {});
		console.log(`FAIL ${t.slug}: ${String(e).slice(0, 120)}`);
	}
}

await browser.close();
// Limpia restos de grabaciones con nombre aleatorio que hayan quedado
import { readdirSync } from 'node:fs';
for (const f of readdirSync(OUT_DIR)) {
	if (/^[0-9a-f]{32}\.webm$/.test(f)) rmSync(path.join(OUT_DIR, f));
}
