// Categorías ("secciones") del blog. Fuente única usada por el panel de Keystatic,
// la paleta de comandos (⌘K) y los filtros del índice del blog.
export interface BlogCategory {
	value: string;
	label: string;
	/** Descripción corta para la paleta de comandos. */
	hint: string;
}

export const blogCategories: BlogCategory[] = [
	{ value: "desarrollo", label: "Desarrollo", hint: "Código, arquitectura y buenas prácticas" },
	{ value: "frontend", label: "Front-end", hint: "Astro, Vue, React e interfaces" },
	{ value: "diseno", label: "Diseño", hint: "UI, motion y detalle visual" },
	{ value: "seo", label: "SEO", hint: "Posicionamiento y rendimiento web" },
	{ value: "otros", label: "Otros", hint: "Notas y cosas que no encajan en lo demás" },
];

export const DEFAULT_CATEGORY = "desarrollo";
