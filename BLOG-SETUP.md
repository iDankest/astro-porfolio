# Blog con Keystatic — Guía de configuración y uso

Blog editable en `idankest.dev/keystatic`, gestionado con **Keystatic** y renderizado de forma **estática (SSG)** con Astro. 

## Arquitectura actual (Monorepo público)

Todo el contenido del blog vive en este mismo repositorio público:
- **Textos**: Los artículos se guardan como archivos `.mdoc` en la carpeta `posts/`.
- **Imágenes**: Se guardan en `src/assets/blog/` y se optimizan automáticamente gracias al componente `<Image>` de Astro.

Ya no se utiliza un repositorio privado independiente ni scripts de sincronización (`sync-blog-assets.mjs`). Esto simplifica enormemente el despliegue y asegura que las imágenes gocen del máximo rendimiento SEO y compresión nativa.

## Desarrollo local

```bash
pnpm dev          # Levanta el servidor en http://localhost:4321
# Blog público:   http://localhost:4321/blog
# Panel de admin: http://localhost:4321/keystatic
```

En local, el panel escribe directamente en la carpeta `posts/` y en `src/assets/blog/`. Los cambios se previsualizan instantáneamente gracias al recargado en vivo de Astro.

## Puesta en producción

Dado que ahora el contenido vive en este mismo repositorio, para poder editar desde el panel en producción (`idankest.dev/keystatic`), Keystatic necesita permisos para hacer *commits* a este repositorio (`iDankest/astro-porfolio`).

### Configuración de la GitHub App (Una sola vez)
Si aún no está configurado, la primera vez que entres a `idankest.dev/keystatic` en producción, Keystatic te guiará paso a paso para crear una **GitHub App** vinculada a este repositorio.

Deberás añadir los valores generados a las variables de entorno de **Netlify**:
```
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
KEYSTATIC_SECRET
PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
```

A partir de ahí, cada vez que guardes o edites un post desde el panel en producción, Keystatic hará un commit automático en este repositorio, lo cual disparará automáticamente un nuevo *build* en Netlify y el artículo aparecerá en el blog.

## Escribir un artículo

1. Entra en el panel de Keystatic (local o en producción).
2. Ve a **Artículos** → *Create*.
3. Rellena los campos: Título, Fecha, Descripción (meta SEO, ~150-160 car.), Portada, Categoría, Tags y Contenido.
4. Si quieres ocultarlo de la web temporalmente, marca la opción **Borrador**. *(Nota: Al estar en un repo público, el archivo fuente `.mdoc` del borrador sí será visible si alguien navega por tu GitHub, pero Astro lo ignorará y no lo publicará en la web).*
5. Guarda los cambios.

## SEO Integrado

- **Rendimiento:** Al ser **estático** (SSG) y servir imágenes transformadas a WebP bajo demanda, las métricas de Core Web Vitals son excelentes.
- **Metadatos:** Por cada artículo se autogenera su `og:type=article`, etiquetas OpenGraph y nodos JSON-LD de **BlogPosting** y **BreadcrumbList**.
- **Indexación:** Generación de **Sitemap** automático (`/sitemap-index.xml`) y feed **RSS** (`/rss.xml`). El directorio `/keystatic` está completamente bloqueado a rastreadores mediante `robots.txt`.
- **Navegación:** Tabla de contenidos lateral generada automáticamente en base a las etiquetas H2 y H3 del Markdown.
