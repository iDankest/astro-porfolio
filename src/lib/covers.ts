import type { ImageMetadata } from "astro";

// Todas las portadas del blog viven en src/assets/blog para que Astro las
// optimice (WebP/AVIF + tamaños responsive). Keystatic guarda solo el nombre
// del archivo; aquí lo resolvemos a la imagen importada.
const covers = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/blog/*.{png,jpg,jpeg,webp,avif}",
	{ eager: true },
);

/** Resuelve el valor de `cover` de Keystatic (nombre o ruta) a una ImageMetadata. */
export function resolveCover(cover?: string | null): ImageMetadata | null {
	if (!cover) return null;
	const file = cover.split("/").pop();
	if (!file) return null;
	const key = Object.keys(covers).find((k) => k.endsWith("/" + file));
	return key ? covers[key].default : null;
}
