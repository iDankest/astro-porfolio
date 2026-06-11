/**
 * Auditoría SEO + UI del portfolio con Playwright.
 * Uso: arrancar `pnpm dev` y ejecutar `node scripts/audit-seo.mjs [baseUrl]`
 * (por defecto http://localhost:4321). Deja screenshots en /tmp/portfolio-*.png.
 */

async function loadChromium() {
	try {
		const pw = await import('playwright');
		return pw.chromium;
	} catch {
		const pw = await import('/opt/homebrew/lib/node_modules/playwright/index.mjs');
		return pw.chromium;
	}
}

const BASE = process.argv[2] ?? 'http://localhost:4321';
const out = { base: BASE, problemas: [] };
const problema = (msg) => out.problemas.push(msg);

const chromium = await loadChromium();
const browser = await chromium.launch();

// ---------- Desktop ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 150)); });
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${String(e).slice(0, 150)}`));

await page.goto(BASE, { waitUntil: 'networkidle' });

out.seo = await page.evaluate(() => {
	const q = (s) => document.querySelector(s);
	const meta = (n, attr = 'name') => q(`meta[${attr}="${n}"]`)?.getAttribute('content') ?? null;
	const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
		try { return JSON.parse(s.textContent)['@type'] ?? JSON.parse(s.textContent)['@graph']?.map((g) => g['@type']).join('+'); }
		catch { return 'PARSE_ERROR'; }
	});
	return {
		title: document.title,
		description: meta('description'),
		canonical: q('link[rel="canonical"]')?.href ?? null,
		ogImage: meta('og:image', 'property'),
		ogUrl: meta('og:url', 'property'),
		twitterCard: meta('twitter:card'),
		jsonLd,
		h1s: [...document.querySelectorAll('h1')].length,
	};
});

if (!out.seo.canonical) problema('falta canonical');
if (!out.seo.ogImage) problema('falta og:image');
if (!out.seo.twitterCard) problema('falta twitter:card');
if (out.seo.jsonLd.includes('PARSE_ERROR')) problema('JSON-LD inválido');
if (out.seo.h1s !== 1) problema(`h1 count = ${out.seo.h1s}`);

// LCP + CLS
out.vitals = await page.evaluate(() => new Promise((resolve) => {
	let lcp = null, cls = 0;
	new PerformanceObserver((l) => { const e = l.getEntries(); lcp = e[e.length - 1]; }).observe({ type: 'largest-contentful-paint', buffered: true });
	new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
	setTimeout(() => resolve({
		lcpMs: lcp ? Math.round(lcp.startTime) : null,
		lcpElement: lcp?.element ? `${lcp.element.tagName}.${lcp.element.className}`.slice(0, 60) : null,
		cls: Math.round(cls * 1000) / 1000,
	}), 2500);
}));
if (out.vitals.cls > 0.1) problema(`CLS alto: ${out.vitals.cls}`);

await page.screenshot({ path: '/tmp/portfolio-desktop.png' });

// Hover video en la primera card con video
await page.evaluate(() => document.getElementById('proyectos')?.scrollIntoView());
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/portfolio-projects.png' });

const videoCard = page.locator('.project-card:has(.project-video)').first();
if (await videoCard.count()) {
	await videoCard.hover();
	await page.waitForTimeout(1200);
	out.hoverVideo = await videoCard.locator('.project-video').evaluate((v) => ({ playing: !v.paused, src: v.currentSrc.split('/').pop() }));
	if (!out.hoverVideo.playing) problema('el video de hover no reproduce');
	await page.screenshot({ path: '/tmp/portfolio-hover-video.png' });
} else {
	problema('ninguna card tiene video');
}

out.consoleErrors = consoleErrors.slice(0, 10);
if (consoleErrors.length) problema(`${consoleErrors.length} errores de consola`);
await ctx.close();

// ---------- Móvil ----------
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await mctx.newPage();
await mp.goto(BASE, { waitUntil: 'networkidle' });

out.mobile = { overflow: await mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth) };
if (out.mobile.overflow) problema('overflow horizontal en móvil');

const burger = mp.locator('#nav-burger');
out.mobile.burgerVisible = await burger.isVisible();
if (!out.mobile.burgerVisible) {
	problema('hamburguesa no visible en móvil');
} else {
	await burger.tap();
	await mp.waitForTimeout(400);
	out.mobile.menuLinks = await mp.locator('#nav-mobile a:visible').count();
	if (out.mobile.menuLinks < 7) problema(`menú móvil con ${out.mobile.menuLinks} enlaces visibles (esperados 7)`);
	await mp.screenshot({ path: '/tmp/portfolio-mobile-menu.png' });
	await mp.locator('#nav-mobile a').first().tap();
	await mp.waitForTimeout(400);
	out.mobile.menuClosesOnNav = await mp.locator('#nav-mobile').isHidden();
	if (!out.mobile.menuClosesOnNav) problema('el menú móvil no se cierra al navegar');
}
await mp.screenshot({ path: '/tmp/portfolio-mobile.png' });
await mctx.close();

// ---------- Crawling ----------
out.crawl = {};
for (const p of ['/robots.txt', '/sitemap.xml', '/og.png']) {
	const r = await fetch(BASE + p).catch(() => null);
	out.crawl[p] = r ? r.status : 'ERR';
	if (!r || r.status !== 200) problema(`${p} → ${out.crawl[p]}`);
}

await browser.close();
out.ok = out.problemas.length === 0;
console.log(JSON.stringify(out, null, 2));
process.exit(out.ok ? 0 : 1);
