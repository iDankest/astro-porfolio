# idankest.dev — Portfolio de Kilian Sánchez

Portfolio one-page construido con **Astro 5** (SSR con `@astrojs/node`, página principal prerenderizada), **Tailwind CSS v4** y formulario de contacto vía **Resend**.

## Stack

- Astro 5 · output `server` + `prerender` en el index (el endpoint `/api/contact` es la única ruta dinámica)
- Tailwind v4 (plugin de Vite) + design tokens propios en `src/styles/global.css`
- `astro-icon` con colecciones devicon / simple-icons
- Resend para el email del formulario (`src/pages/api/contact.ts`)

## Comandos

| Comando | Acción |
| :-- | :-- |
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Dev server en `localhost:4321` |
| `pnpm build` | Build de producción a `./dist/` |
| `pnpm preview` | Previsualiza el build |
| `pnpm sync-reviews` | Regenera `src/data/reviews.ts` desde la exportación de LinkedIn |
| `node scripts/generate-og.mjs` | Regenera la imagen Open Graph (`public/og.png`, 1200×630) |
| `node scripts/record-previews.mjs [slug]` | Regraba los videos de hover de los proyectos live (`public/videos/*.webm`) |

> Los scripts de Playwright usan la instalación global de Homebrew (`/opt/homebrew/lib/node_modules/playwright`).

## Estructura de datos

- `src/data/proyects.js` — proyectos del bento grid. Campos clave: `kind` (`web` | `app`, decide el chrome del mockup), `video` (preview en hover), `coverAlt`, `github` (omitir si el repo es privado), `featured`.
- `src/data/techs.js` — mapeo tech → icono Iconify (añadir también el icono al `include` de `astro.config.mjs`).
- `src/data/reviews.ts` — generado por `scripts/parse-reviews.js`.

## Videos de preview

Los `.webm` de `public/videos/` se reproducen al hacer hover en cada card. Son reemplazables sin tocar código: graba una demo mejor (p. ej. con Reelify) y sobreescribe el archivo con el mismo nombre.

## Variables de entorno

Ver `.env.example`: `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL`, `FROM_NAME`, `AUTO_REPLY_EVENT`.

## Pendiente

- Migración a Astro 6 / `@astrojs/node` 10 (majors; resolverían los avisos de `pnpm audit` del toolchain de build).
- Covers/videos de Reelify y VoicePrompt grabados desde la app nativa cuando salgan de beta.
- Enlace al certificado de Ironhack cuando esté finalizado (`src/components/Certificados.astro`).
