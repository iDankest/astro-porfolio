// Sincroniza las imágenes del blog (public/blog/**) desde el repo de contenido
// PRIVADO `iDankest/blog-content` al sitio, ANTES del build.
//
// Por qué: como el repo de contenido es privado, sus imágenes no son servibles
// por URL pública de GitHub. En el build (SSG) las materializamos como assets
// estáticos en `public/blog/` para que se sirvan desde idankest.dev/blog/...
//
// Solo se ejecuta cuando hay GITHUB_PAT (producción / Netlify). En local sin
// token es un no-op: el blog se previsualiza con las imágenes locales.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const token = process.env.GITHUB_PAT;
const REPO = process.env.BLOG_CONTENT_REPO ?? "iDankest/blog-content";
const BRANCH = process.env.BLOG_CONTENT_BRANCH ?? "main";
const PREFIX = "public/blog";

if (!token) {
	console.log("[sync-blog-assets] Sin GITHUB_PAT: se omite (modo local).");
	process.exit(0);
}

const api = (path) =>
	fetch(`https://api.github.com/repos/${REPO}/${path}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github+json",
			"User-Agent": "idankest-blog-sync",
		},
	});

try {
	const branchRes = await api(`branches/${BRANCH}`);
	if (!branchRes.ok) {
		console.warn(
			`[sync-blog-assets] No se pudo leer la rama ${BRANCH} (${branchRes.status}). Se omite.`,
		);
		process.exit(0);
	}
	const treeSha = (await branchRes.json()).commit.commit.tree.sha;

	const treeRes = await api(`git/trees/${treeSha}?recursive=1`);
	const tree = (await treeRes.json()).tree ?? [];
	const images = tree.filter(
		(t) => t.type === "blob" && t.path.startsWith(`${PREFIX}/`),
	);

	if (images.length === 0) {
		console.log("[sync-blog-assets] No hay imágenes que sincronizar.");
		process.exit(0);
	}

	for (const img of images) {
		const blobRes = await api(`git/blobs/${img.sha}`);
		const blob = await blobRes.json();
		const buf = Buffer.from(blob.content, blob.encoding ?? "base64");
		const dest = join(process.cwd(), img.path);
		await mkdir(dirname(dest), { recursive: true });
		await writeFile(dest, buf);
		console.log(`[sync-blog-assets] ✓ ${img.path}`);
	}
	console.log(`[sync-blog-assets] ${images.length} imagen(es) sincronizada(s).`);
} catch (err) {
	// No bloquear el build por un fallo de sincronización de imágenes.
	console.warn("[sync-blog-assets] Error al sincronizar:", err?.message ?? err);
	process.exit(0);
}
