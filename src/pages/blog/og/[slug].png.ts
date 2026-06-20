import type { APIRoute } from "astro";
import { getPublishedPosts } from "../../../lib/reader";
import { renderOgPng } from "../../../lib/og";

export const prerender = true;

// Una imagen por post, generada en el build (1200×630). Sirve de portada y de OG social.
export async function getStaticPaths() {
	const posts = await getPublishedPosts();
	return posts.map((p) => ({
		params: { slug: p.slug },
		props: {
			title: p.entry.title,
			category: p.entry.category ?? "otros",
			date: p.entry.publishedDate ?? "",
		},
	}));
}

export const GET: APIRoute = async ({ props }) => {
	const { title, category, date } = props as {
		title: string;
		category: string;
		date: string;
	};
	const dateStr = date
		? new Date(date).toLocaleDateString("es-ES", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "";

	const png = await renderOgPng({ title, category, date: dateStr });

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
