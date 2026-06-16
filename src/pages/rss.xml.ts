import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts } from "../lib/reader";

export const prerender = true;

export async function GET(context: APIContext) {
	const posts = await getPublishedPosts();

	return rss({
		title: "Blog de Kilian Sánchez",
		description:
			"Artículos sobre desarrollo web front-end, Astro, rendimiento y SEO técnico.",
		site: context.site ?? "https://idankest.dev",
		items: posts.map((p) => ({
			title: p.entry.title,
			description: p.entry.description,
			pubDate: p.entry.publishedDate
				? new Date(p.entry.publishedDate)
				: new Date(),
			link: `/blog/${p.slug}/`,
		})),
		customData: `<language>es-ES</language>`,
	});
}
