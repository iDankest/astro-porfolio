import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

// El contenido del blog vive en este repo (carpeta `posts/`). El reader lo lee
// del sistema de archivos tanto en `astro dev` como en el build (SSG).
export const reader = createReader(process.cwd(), keystaticConfig);

export type Post = Awaited<
	ReturnType<typeof reader.collections.posts.all>
>[number];

/** Devuelve los posts publicados (no borradores) ordenados por fecha descendente. */
export async function getPublishedPosts() {
	const posts = await reader.collections.posts.all();
	return posts
		.filter((p) => !p.entry.draft)
		.sort(
			(a, b) =>
				new Date(b.entry.publishedDate ?? 0).getTime() -
				new Date(a.entry.publishedDate ?? 0).getTime(),
		);
}
