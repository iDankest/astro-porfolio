// Generación de portadas/OG por post en BUILD con Satori (HTML/CSS → SVG) + resvg (→ PNG).
// La portada es un GRÁFICO propio (no repite el título): sección + iconos de la
// tecnología que toca el post + un resumen corto. Sirve de portada del blog y de OG social.
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { blogCategories } from "../data/blog-categories";
import { wordmarkForCategory } from "./cover-art";
import { techs } from "../data/techs";
import devicon from "@iconify-json/devicon/icons.json";
import simple from "@iconify-json/simple-icons/icons.json";

const fontDir = path.join(process.cwd(), "src/assets/fonts");
const serif = fs.readFileSync(path.join(fontDir, "InstrumentSerif-Regular.ttf"));
const mono = fs.readFileSync(path.join(fontDir, "JetBrainsMono-Regular.ttf"));
const monoBold = fs.readFileSync(path.join(fontDir, "JetBrainsMono-Bold.ttf"));

const OG_ACCENT: Record<string, string> = {
	all: "#c8ff00",
	frontend: "#c8ff00",
	diseno: "#ff6b35",
	seo: "#d4a574",
	desarrollo: "#5eead4",
	otros: "#b8b0a4",
};
const accentFor = (cat?: string | null) => OG_ACCENT[cat ?? "otros"] ?? "#c8ff00";
const labelFor = (cat?: string | null) =>
	blogCategories.find((c) => c.value === cat)?.label ?? "Blog";

// --- Iconos de tecnología desde los packs Iconify, como data URI para <img> ---
const PACKS: Record<string, any> = { devicon, "simple-icons": simple };

function iconDataUri(spec: string, color: string): string | null {
	const [set, name] = spec.split(":");
	const pack = PACKS[set];
	const icon = pack?.icons?.[name];
	if (!icon) return null;
	const w = icon.width ?? pack.width ?? 24;
	const h = icon.height ?? pack.height ?? 24;
	// simple-icons son monocromos y usan fill="currentColor"; lo sustituimos por el
	// color claro para que se vean sobre el fondo oscuro (resvg no resuelve currentColor).
	const body = set === "simple-icons"
		? icon.body.replace(/currentColor/g, color)
		: icon.body;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body}</svg>`;
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function iconsFor(tech: string[] | undefined): string[] {
	return (tech ?? [])
		.map((slug) => {
			const t = (techs as Record<string, { icon: string | null }>)[slug];
			return t?.icon ? iconDataUri(t.icon, "#ece8df") : null;
		})
		.filter((x): x is string => Boolean(x))
		.slice(0, 4);
}

const truncate = (s: string, n: number) =>
	!s ? "" : s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;

interface OgInput {
	category?: string | null;
	date?: string;
	description?: string;
	tech?: string[];
}

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
	type,
	props: { style, ...(children !== undefined ? { children } : {}) },
});
const img = (src: string, size: number) => ({
	type: "img",
	props: { src, width: size, height: size, style: { width: `${size}px`, height: `${size}px` } },
});

export async function renderOgPng({ category, date = "", description = "", tech }: OgInput): Promise<Buffer> {
	const a = accentFor(category);
	const icons = iconsFor(tech);
	const summary = truncate(description, 116);

	const summaryEl = el(
		"div",
		{ fontFamily: "Instrument Serif", fontSize: "40px", lineHeight: 1.18, color: "#d8d2c6", maxWidth: "960px" },
		summary,
	);

	// Foco central: fila de iconos si hay tecnología; si no, el wordmark de la sección.
	const focus = icons.length
		? el("div", { display: "flex", flexDirection: "column" }, [
				el(
					"div",
					{ display: "flex", alignItems: "center", marginBottom: "40px" },
					icons.map((src) => img(src, 96)),
				),
				summaryEl,
			])
		: el("div", { display: "flex", flexDirection: "column" }, [
				el(
					"div",
					{ fontFamily: "Instrument Serif", fontSize: "128px", lineHeight: 0.95, color: a, letterSpacing: "-2px", marginBottom: "26px" },
					wordmarkForCategory(category),
				),
				summaryEl,
			]);

	const tree = el(
		"div",
		{
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			width: "100%",
			height: "100%",
			padding: "74px 80px",
			position: "relative",
			backgroundColor: "#0b0b0d",
			backgroundImage: "linear-gradient(135deg, #0b0b0d 0%, #15151b 100%)",
			fontFamily: "JetBrains Mono",
		},
		[
			el("div", {
				position: "absolute",
				top: "-200px",
				right: "-160px",
				width: "640px",
				height: "640px",
				backgroundImage: `radial-gradient(circle at center, ${a}33 0%, ${a}00 70%)`,
			}),
			el("div", {
				position: "absolute",
				bottom: "-260px",
				left: "-140px",
				width: "540px",
				height: "540px",
				border: `1px solid ${a}30`,
				borderRadius: "9999px",
			}),
			// Fila superior
			el(
				"div",
				{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "24px", letterSpacing: "2px" },
				[
					el("div", { color: a, textTransform: "uppercase", fontFamily: "JetBrains Mono", fontWeight: 700 }, `// ${labelFor(category)}`),
					el("div", { color: "#56544f" }, "idankest.dev"),
				],
			),
			// Foco
			focus,
			// Fila inferior
			el("div", { display: "flex", alignItems: "center" }, [
				el("div", { width: "56px", height: "4px", backgroundColor: a, marginRight: "20px" }),
				el("div", { color: "#8a8680", fontSize: "22px", letterSpacing: "1px" }, date),
			]),
		],
	);

	const svg = await satori(tree as any, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: "Instrument Serif", data: serif, weight: 400, style: "normal" },
			{ name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
			{ name: "JetBrains Mono", data: monoBold, weight: 700, style: "normal" },
		],
	});

	return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
