import { config, collection, fields } from '@keystatic/core';
import { blogCategories, DEFAULT_CATEGORY } from './src/data/blog-categories';

// Repo donde el panel desplegado (modo GitHub) edita el contenido.
// El contenido vive en este mismo repo (carpeta posts/ + src/assets/blog/).
export const CONTENT_REPO = { owner: 'iDankest', name: 'astro-porfolio' } as const;

// En desarrollo el panel escribe en archivos locales (carpeta `posts/`).
// En producción (panel desplegado en idankest.dev/keystatic) edita el repo
// privado vía GitHub App.
const storage = import.meta.env.DEV
	? ({ kind: 'local' } as const)
	: ({ kind: 'github', repo: CONTENT_REPO } as const);

export default config({
	storage,
	ui: {
		brand: { name: 'idankest.dev · Blog' },
		navigation: {
			Contenido: ['posts'],
		},
	},
	collections: {
		posts: collection({
			label: 'Artículos',
			path: 'posts/*',
			slugField: 'title',
			format: { contentField: 'content' },
			entryLayout: 'content',
			previewUrl: 'https://idankest.dev/blog/{slug}',
			columns: ['title', 'publishedDate'],
			schema: {
				title: fields.slug({
					name: {
						label: 'Título',
						validation: { isRequired: true, length: { max: 120 } },
					},
					slug: {
						label: 'Slug (URL)',
						description: 'Se usa en idankest.dev/blog/<slug>',
					},
				}),
				publishedDate: fields.date({
					label: 'Fecha de publicación',
					defaultValue: { kind: 'today' },
					validation: { isRequired: true },
				}),
				description: fields.text({
					label: 'Descripción (meta SEO)',
					description: 'Resumen para buscadores y redes sociales (150-160 caracteres).',
					multiline: true,
					validation: { isRequired: true, length: { min: 1, max: 200 } },
				}),
				cover: fields.image({
					label: 'Imagen de portada',
					directory: 'src/assets/blog',
					publicPath: '/src/assets/blog/',
				}),
				coverAlt: fields.text({
					label: 'Texto alternativo de la portada',
					description: 'Describe la imagen para accesibilidad y SEO.',
				}),
				category: fields.select({
					label: 'Categoría',
					description: 'Sección del blog a la que pertenece el artículo.',
					options: blogCategories.map((c) => ({ label: c.label, value: c.value })),
					defaultValue: DEFAULT_CATEGORY,
				}),
				tags: fields.array(fields.text({ label: 'Tag' }), {
					label: 'Tags',
					itemLabel: (props) => props.value,
				}),
				draft: fields.checkbox({
					label: 'Borrador',
					description: 'Si está marcado, no se publica en el sitio.',
					defaultValue: false,
				}),
				content: fields.document({
					label: 'Contenido',
					formatting: true,
					dividers: true,
					links: true,
					tables: true,
					images: { directory: 'public/blog/inline', publicPath: '/blog/inline/' },
				}),
			},
		}),
	},
});
