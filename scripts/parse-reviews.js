#!/usr/bin/env node
/**
 * Script para parsear la exportación de LinkedIn y generar src/data/reviews.ts
 *
 * Uso:
 *   1. Exportar datos de LinkedIn (solo "Recomendaciones recibidas").
 *   2. Descomprimir el ZIP.
 *   3. Copiar el archivo HTML (ej. Recommendations_Received.html) a este directorio.
 *   4. Ejecutar: node scripts/parse-reviews.js <ruta-al-html>
 *
 * El script extrae autor, cargo, foto, fecha, relación y texto, y regenera
 * src/data/reviews.ts con los datos obtenidos.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_PATH = process.argv[2];
if (!INPUT_PATH) {
  console.error("❌ Uso: node scripts/parse-reviews.js <ruta-a-Recommendations_Received.html>");
  process.exit(1);
}

const html = fs.readFileSync(path.resolve(INPUT_PATH), "utf-8");

/**
 * Extrae todas las reseñas del HTML de LinkedIn.
 * LinkedIn exporta cada reseña dentro de un bloque <a> que contiene:
 *  - Un <img> con el avatar (class que contiene '_74f0f608')
 *  - Un <a> con el nombre del autor
 *  - Párrafos con cargo, fecha/relación y texto.
 */
const reviews = [];

// LinkedIn exporta cada reseña dentro de un bloque grande que contiene un enlace al perfil
// Usamos una estrategia de extracción por bloques
const recommendationBlocks = html.split(/<div class="bc5bd56d _4478d674 _55b164b4 _35b38a5c /g);
// El primer split es basura, los demás son bloques
for (let i = 1; i < recommendationBlocks.length; i++) {
  const block = recommendationBlocks[i];

  try {
    // Extraer enlace al perfil
    const profileMatch = block.match(/href="(https:\/\/www\.linkedin\.com\/in\/[^"]+)"/);
    const linkedInUrl = profileMatch ? profileMatch[1] : "";

    // Extraer nombre
    const nameMatch = block.match(/<a class="[^"]*_8c8f5ead[^"]*"[^>]*>([^<]+)<\/a>/);
    const author = nameMatch ? nameMatch[1].trim() : "";

    // Extraer avatar
    const imgMatch = block.match(/src="(https:\/\/media\.licdn\.com\/dms\/image\/[^"]+)"/);
    const avatarUrl = imgMatch ? imgMatch[1] : "";

    // Extraer todos los párrafos de clase aaff4988 (metadatos y texto)
    const paraMatches = [...block.matchAll(/<p class="[^"]*aaff4988[^"]*">[\s\S]*?<\/p>/g)];
    let role = "";
    let company = "";
    let dateRel = "";
    let text = "";

    paraMatches.forEach((match) => {
      const clean = match[0]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (clean.includes("· 1er")) {
        // Es el separador de metadatos, lo ignoramos
        return;
      }
      if (!role && clean.length > 10 && !clean.includes("trabajó") && !clean.includes("supervisaba")) {
        role = clean;
      } else if (clean.includes("trabajó") || clean.includes("supervisaba") || clean.match(/\d+ de \w+ de \d{4}/)) {
        dateRel = clean;
      } else if (clean.length > 30) {
        text = clean;
      }
    });

    // Extraer fecha y relación por separado
    const dateMatch = dateRel.match(/(\d+ de \w+ de \d{4})/);
    const dateStr = dateMatch ? dateMatch[1] : "";
    const relationship = dateRel.replace(dateStr, "").replace(",", "").trim();

    // Convertir fecha a ISO (español)
    const meses = { "enero": "01", "febrero": "02", "marzo": "03", "abril": "04", "mayo": "05", "junio": "06", "julio": "07", "agosto": "08", "septiembre": "09", "octubre": "10", "noviembre": "11", "diciembre": "12" };
    let isoDate = "";
    if (dateStr) {
      const [d, m, y] = dateStr.split(" de ");
      isoDate = `${y}-${meses[m.toLowerCase()] || "01"}-${d.padStart(2, "0")}`;
    }

    // Descargar avatar localmente
    let localAvatar = "";
    if (avatarUrl) {
      const safeName = author.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "").substring(0, 30);
      const ext = ".jpg";
      const reviewsDir = path.join(__dirname, "..", "public", "assets", "reviews");
      if (!fs.existsSync(reviewsDir)) fs.mkdirSync(reviewsDir, { recursive: true });
      const localPath = path.join(reviewsDir, `${safeName}${ext}`);
      try {
        const res = await fetch(avatarUrl);
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(localPath, buf);
          localAvatar = `/assets/reviews/${safeName}${ext}`;
        }
      } catch (e) {
        console.warn(`⚠️ No se pudo descargar avatar de ${author}: ${e.message}`);
      }
    }

    if (author && text) {
      reviews.push({
        author,
        role,
        company: "",
        avatar: localAvatar || avatarUrl,
        text,
        date: isoDate,
        linkedInUrl,
        relationship,
      });
    }
  } catch (err) {
    console.warn("⚠️ Error parseando un bloque:", err.message);
  }
}

if (reviews.length === 0) {
  console.error("❌ No se encontraron reseñas en el archivo proporcionado.");
  process.exit(1);
}

// Generar el archivo TypeScript
const fileContent = `/**
 * Datos de reseñas de LinkedIn.
 * Generado automáticamente desde la exportación de LinkedIn.
 * Para actualizar: ejecutar \`pnpm sync-reviews\` tras exportar de nuevo.
 */

export interface Review {
  /** Nombre completo del autor */
  author: string;
  /** Cargo o rol del autor */
  role: string;
  /** Empresa o contexto (opcional) */
  company?: string;
  /** URL relativa o absoluta del avatar (guardado en public/assets/reviews/) */
  avatar: string;
  /** Texto completo de la recomendación */
  text: string;
  /** Fecha en formato ISO o string legible */
  date: string;
  /** URL pública del perfil de LinkedIn del autor */
  linkedInUrl: string;
  /** Relación con Kilian (ej. "trabajó en el mismo equipo", "supervisaba directamente") */
  relationship: string;
}

export const reviews: Review[] = ${JSON.stringify(reviews, null, 2).replace(/"([^"]+)":/g, "$1:")};
`;

const outputPath = path.join(__dirname, "..", "src", "data", "reviews.ts");
fs.writeFileSync(outputPath, fileContent, "utf-8");

console.log(`✅ ${reviews.length} reseña(s) procesada(s) y guardadas en src/data/reviews.ts`);
reviews.forEach((r) => console.log(`   · ${r.author}`));
