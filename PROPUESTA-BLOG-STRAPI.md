# Propuesta: Blog con Strapi en idankest.dev

> ⚠️ **SUPERADO.** Finalmente NO se eligió Strapi, sino **Keystatic + repo de
> contenido privado** (más ligero, cero infraestructura, mismo dominio). La
> solución implementada y sus pasos de despliegue están en **[`BLOG-SETUP.md`](./BLOG-SETUP.md)**.
> Este documento se conserva como registro del análisis comparativo.

> Documento de decisión. Estado: **propuesta / pendiente de validar**. Fecha: 2026-06-15.

## 1. Resumen ejecutivo

Añadir un blog editable al portfolio es **viable y técnicamente sólido** con el stack
actual (Astro 5 + Netlify). La opción elegida es **Strapi Cloud (Free) como CMS +
Astro en modo SSG + webhook de rebuild**: el contenido se publica desde el panel de
Strapi y Astro lo prerenderiza a HTML estático servido desde `idankest.dev/blog`.

**Recomendación honesta:** el *frontend* del blog (rutas, SEO, sitemap) merece la pena
sí o sí. Sobre el *origen de datos*, Strapi es perfectamente válido pero es la opción
más pesada para un blog de un solo autor; un CMS git-based (Keystatic) daría el ~95%
del valor con 0 infraestructura. Como se quiere Strapi, se documenta el plan con Strapi
y se deja la alternativa explícita por si se reconsidera. **El trabajo de frontend/SEO
es el mismo en ambos casos**, así que migrar de origen de datos más adelante no tira
nada a la basura.

## 2. ¿Es buena idea? Análisis

### A favor (por qué sí)
- **SEO y autoridad de dominio:** contenido propio y fresco posiciona long-tail,
  demuestra expertise y atrae a reclutadores/clientes. Un portfolio con blog activo
  diferencia frente a uno estático.
- **Autonomía editorial:** publicar/editar sin tocar código ni hacer commits.
- **Stack ideal:** Astro + SSG genera blogs rapidísimos con SEO excelente casi gratis;
  ya hay una base de SEO sólida en `Layout.astro` (OG, Twitter, JSON-LD) que reutilizar.
- **Mismo dominio:** el contenido vive en `idankest.dev/blog`, refuerza la marca.

### En contra / cautelas (por qué quizá no, o no con Strapi)
- **Strapi es infraestructura para mantener:** servidor Node + base de datos que
  actualizar, respaldar y vigilar. Para un blog personal puede ser **sobreingeniería**.
- **Límites y cold-start del Free plan:** 500 entradas, 2.500 req/mes, 10 GB, el
  proyecto **se duerme** por inactividad (primer acceso ~1 min) y es **uso no comercial**.
  Con SSG no afecta a visitantes, pero sí al panel y a los builds.
- **Lock-in del contenido:** los posts viven en la DB de Strapi, no en el repo. Con
  git-based los posts son Markdown tuyos para siempre.
- **Dependencia externa:** si Strapi Cloud cambia/retira el Free plan, hay que migrar.
- **El coste real no es montarlo, es escribir con constancia.** Un blog abandonado
  resta. Si no hay compromiso de publicar, conviene posponerlo.

### Veredicto
Buena idea **si** hay intención real de publicar con cierta regularidad. En ese caso,
montar el frontend del blog es prioritario. Para el origen de datos, ver la comparativa.

## 3. Comparativa de orígenes de contenido

| Criterio | **Strapi Cloud (elegido)** | Keystatic / Decap (git-based) | Content Collections (Markdown) |
|---|---|---|---|
| Editar sin código | Sí (panel completo) | Sí (UI web) | No (editar archivos) |
| Infraestructura extra | Sí (CMS + DB) | No | No |
| Coste | Free plan (límites) | 0 | 0 |
| Contenido en tu repo | No | Sí | Sí |
| Curva / mantenimiento | Media-alta | Baja | Mínima |
| Potencia (roles, media, API) | Alta | Media | Baja |
| SEO (con SSG) | Excelente | Excelente | Excelente |

**Sugerencia pragmática:** empezar con git-based/Content Collections para validar el
hábito de escribir, y migrar a Strapi solo si el blog crece (multi-autor, mucho
contenido, necesidad de API). La capa de presentación no cambia. *(La opción elegida es
Strapi desde el inicio; el plan siguiente asume Strapi.)*

## 4. Arquitectura elegida (Strapi + SSG)

```
Strapi Cloud (panel en *.strapiapp.com)
   │  REST API (API token de solo lectura)
   ▼  ── solo en build time ──
Build de Astro en Netlify  ──►  HTML estático  ──►  idankest.dev/blog/*
   ▲
   └── Webhook de Strapi (publish/update/delete) → Build Hook de Netlify → rebuild
```

- **Clave:** con SSG, los visitantes nunca consultan Strapi → ni el cold-start ni los
  límites del Free plan afectan al blog público.
- **Dominio:** el blog público queda en `idankest.dev/blog`. El *panel* de Strapi se
  queda en `*.strapiapp.com` (el Free plan no permite dominio propio); `cms.idankest.dev`
  sería mejora futura con plan de pago. Irrelevante para SEO/visitantes.

## 5. Plan de implementación

### Fase A — Strapi Cloud (backend)
1. Crear proyecto en Strapi Cloud (Free plan).
2. Content-Type `Article`: `title`, `slug` (UID), `excerpt`, `content` (**Rich text
   Markdown**, no Blocks), `cover` (Media), `publishedDate`, `category`, `tags`, y
   componente `seo` (`metaTitle`, `metaDescription`, `ogImage`).
3. Crear un **API Token de solo lectura** para Astro.
4. Webhook → se configura en la Fase D.

### Fase B — Frontend Astro (SSG)
- `.env` / `.env.example`: `STRAPI_URL`, `STRAPI_API_TOKEN`.
- `src/lib/strapi.ts` (nuevo): helper `fetch` con Bearer token; normaliza el formato
  **aplanado de Strapi v5** (campos directos bajo `data`, `documentId`).
- `src/types/blog.ts` (nuevo): interfaz `Article`.
- `src/pages/blog/index.astro` (nuevo, `prerender = true`): listado de tarjetas
  reutilizando design tokens (`src/styles/global.css`) y el estilo de `CardProyect.astro`.
- `src/pages/blog/[slug].astro` (nuevo, `prerender = true`): `getStaticPaths()` +
  render de Markdown con `marked` + `sanitize-html` en un contenedor `.prose`.
- `src/components/blog/*` (nuevos): `ArticleCard`, `Prose`, `BlogHeader` (fecha,
  categoría, breadcrumb).
- `src/components/Nav.astro` (editar): enlace **Blog** a `/blog`.
- `astro.config.mjs` (editar): `image.remotePatterns` con el dominio de Strapi para
  optimizar los `cover` con `<Image>`.

### Fase C — SEO (extender lo existente, no reescribir)
- `src/layouts/Layout.astro` (editar): props de artículo → `og:type=article`,
  `article:published_time/modified_time/author/section/tag`, y nodos JSON-LD
  `BlogPosting` + `BreadcrumbList` añadidos al `@graph` actual.
- `@astrojs/sitemap`: sitemap automático que incluye `/blog` y cada post → **eliminar
  `public/sitemap.xml` manual**; actualizar `public/robots.txt`.
- `@astrojs/rss` (recomendado): feed en `src/pages/rss.xml.ts`.

### Fase D — Deploy + automatización
1. Variables de entorno en Netlify (`STRAPI_URL`, `STRAPI_API_TOKEN`).
2. Crear **Build Hook** en Netlify.
3. En Strapi Cloud: **Webhook** en publish/update/unpublish/delete del `Article` → URL
   del Build Hook.

## 6. Archivos a tocar (cuando se implemente)

`astro.config.mjs`, `src/layouts/Layout.astro` (editar) · `src/lib/strapi.ts`,
`src/types/blog.ts`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`,
`src/components/blog/*`, `src/pages/rss.xml.ts` (nuevos) · `src/components/Nav.astro`,
`public/robots.txt`, `.env.example`, `package.json` (editar) · `public/sitemap.xml`
(eliminar). Deps: `@astrojs/sitemap`, `marked`, `sanitize-html`, `@astrojs/rss`.

## 7. Verificación end-to-end (cuando se implemente)
1. Local: `.env` apuntando a Strapi Cloud → `pnpm dev` → `/blog` y `/blog/<slug>` OK.
2. Publicar un `Article` real → el webhook dispara rebuild → post en `idankest.dev/blog`.
3. SEO: Rich Results Test (`BlogPosting`+`BreadcrumbList`), sitemap incluye el post,
   preview OG, Lighthouse SEO/CWV, `/rss.xml` válido.

## 8. Notas del Free plan
- 2.500 req/mes · 500 entradas · 10 GB → de sobra para SSG (solo se consume en builds).
- Cold-start: el panel/build tras inactividad tarda ~1 min. No afecta a visitantes.
- Sin dominio propio en Free (panel en `*.strapiapp.com`). Uso personal/no comercial.

## 9. Fuentes
- Astro · Strapi: https://docs.astro.build/en/guides/cms/strapi/
- Strapi Cloud Free plan: https://strapi.io/blog/introducing-the-free-plan-for-strapi-cloud
- Strapi billing & usage: https://docs.strapi.io/cloud/getting-started/usage-billing
- Strapi & Astro (tutorial): https://strapi.io/blog/lightning-fast-building-with-strapi-and-astro
