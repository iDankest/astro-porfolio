// Portadas generativas de marca para el blog.
//
// En lugar de imágenes (IA o stock), cada artículo recibe una portada dibujada
// por código: un motivo geométrico determinista (sembrado por el slug) teñido
// con el color de su categoría. Ventajas: 0 KB de imagen, coherencia total con
// la identidad del sitio y CWV intactos. El color sale de los tokens del tema
// (`--acid`, `--ember`, …) para que funcione en Oscuro, Atenuado y Refresh.

/** Hash estable de una cadena → entero positivo. Mismo slug, mismo dibujo. */
export function seedFrom(input: string): number {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return Math.abs(h);
}

/** PRNG determinista (mulberry32) a partir de una semilla. */
export function rngFrom(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export const MOTIF_COUNT = 6;

// Cada categoría toma el rol de un token de acento del tema (no un hex fijo),
// así el color se adapta solo entre temas y nunca choca con el fondo.
const CATEGORY_ACCENT: Record<string, string> = {
	all: "var(--acid)",
	frontend: "var(--acid)",
	diseno: "var(--ember)",
	seo: "var(--rust)",
	desarrollo: "var(--text)",
	otros: "var(--text-dim)",
};

export function accentForCategory(category?: string | null): string {
	return CATEGORY_ACCENT[category ?? "otros"] ?? "var(--acid)";
}

// Logotipo tipográfico grande que actúa de fondo editorial en la portada.
// Es la identidad fuerte de cada sección; el motivo geométrico aporta la
// variación por artículo.
const CATEGORY_WORDMARK: Record<string, string> = {
	all: "TODOS",
	frontend: "FRONT",
	diseno: "DISEÑO",
	seo: "SEO",
	desarrollo: "DEV",
	otros: "OTROS",
};

export function wordmarkForCategory(category?: string | null): string {
	return CATEGORY_WORDMARK[category ?? "otros"] ?? "BLOG";
}

/** Marca del sitio, impresa en mono como sello en la portada. */
export const COVER_BRAND = "idankest.dev";
