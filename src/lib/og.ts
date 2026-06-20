// Generación de portadas/OG por post en BUILD con Satori (HTML/CSS → SVG) + resvg (→ PNG).
// Da una imagen real por artículo (título + sección + degradado de marca), on-brand y nítida,
// que sirve a la vez de portada del blog y de imagen social (OG). Sin IA, sin trabajo manual.
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { blogCategories } from "../data/blog-categories";

const fontDir = path.join(process.cwd(), "src/assets/fonts");
const serif = fs.readFileSync(path.join(fontDir, "InstrumentSerif-Regular.ttf"));
const mono = fs.readFileSync(path.join(fontDir, "JetBrainsMono-Regular.ttf"));
const monoBold = fs.readFileSync(path.join(fontDir, "JetBrainsMono-Bold.ttf"));

// Hex reales por categoría (Satori no entiende var(--token)). Basados en la marca
// (acid/ember/rust) + dos tonos propios para dar variedad a Desarrollo y Otros.
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

interface OgInput {
	title: string;
	category?: string | null;
	date?: string;
}

// Nodo estilo React que consume Satori (type/props/children).
const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
	type,
	props: { style, ...(children !== undefined ? { children } : {}) },
});

export async function renderOgPng({ title, category, date = "" }: OgInput): Promise<Buffer> {
	const a = accentFor(category);

	const tree = el(
		"div",
		{
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			width: "100%",
			height: "100%",
			padding: "76px 80px",
			position: "relative",
			backgroundColor: "#0b0b0d",
			backgroundImage: "linear-gradient(135deg, #0b0b0d 0%, #15151b 100%)",
			fontFamily: "JetBrains Mono",
		},
		[
			// Resplandor del acento (esquina superior derecha)
			el("div", {
				position: "absolute",
				top: "-200px",
				right: "-160px",
				width: "640px",
				height: "640px",
				backgroundImage: `radial-gradient(circle at center, ${a}33 0%, ${a}00 70%)`,
			}),
			// Círculo decorativo inferior izquierda
			el("div", {
				position: "absolute",
				bottom: "-240px",
				left: "-140px",
				width: "520px",
				height: "520px",
				border: `1px solid ${a}33`,
				borderRadius: "9999px",
			}),
			// Fila superior: sección + marca
			el(
				"div",
				{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					fontSize: "24px",
					letterSpacing: "2px",
				},
				[
					el(
						"div",
						{ color: a, textTransform: "uppercase", fontFamily: "JetBrains Mono", fontWeight: 700 },
						`// ${labelFor(category)}`,
					),
					el("div", { color: "#56544f" }, "idankest.dev"),
				],
			),
			// Título
			el(
				"div",
				{ display: "flex", flexDirection: "column" },
				el(
					"div",
					{
						fontFamily: "Instrument Serif",
						fontSize: "70px",
						lineHeight: 1.06,
						letterSpacing: "-1px",
						color: "#f5f1e8",
						maxWidth: "1000px",
					},
					title,
				),
			),
			// Fila inferior: regla de acento + fecha
			el(
				"div",
				{ display: "flex", alignItems: "center" },
				[
					el("div", { width: "56px", height: "4px", backgroundColor: a, marginRight: "20px" }),
					el("div", { color: "#8a8680", fontSize: "22px", letterSpacing: "1px" }, date),
				],
			),
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

	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
	return resvg.render().asPng();
}
