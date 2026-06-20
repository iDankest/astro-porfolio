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
			category: p.entry.category ?? "otros",
			date: p.entry.publishedDate ?? "",
			description: p.entry.description ?? "",
			tech: [...(p.entry.tech ?? [])],
		},
	}));
}

export const GET: APIRoute = async ({ props }) => {
	const { category, date, description, tech } = props as {
		category: string;
		date: string;
		description: string;
		tech: string[];
	};
	const dateStr = date
		? new Date(date).toLocaleDateString("es-ES", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "";

	const png = await renderOgPng({ category, date: dateStr, description, tech });

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
