#!/usr/bin/env node
/**
 * Theme CLI — Cambia los colores del portfolio de forma interactiva
 *
 * Uso:
 *   pnpm theme          → Modo interactivo
 *   pnpm theme --list   → Muestra temas predefinidos
 *   pnpm theme --preset <nombre> → Aplica un tema predefinido
 *   pnpm theme --ink <hex> --acid <hex> --text <hex> → Colores personalizados
 *
 * Ejemplo:
 *   pnpm theme --preset cyberpunk
 *   pnpm theme --ink #0a0a0c --acid #00f0ff --text #e0e0e0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GLOBAL_CSS_PATH = path.join(__dirname, "..", "src", "styles", "global.css");

// Temas predefinidos
const PRESETS = {
  default: {
    ink: "#0a0a0c",
    "ink-2": "#131318",
    "ink-3": "#1c1c22",
    "ink-4": "#25252c",
    line: "#2a2a32",
    "line-strong": "#3a3a44",
    text: "#f5f1e8",
    "text-dim": "#8a8680",
    "text-faint": "#56544f",
    acid: "#c8ff00",
    "acid-soft": "#c8ff0022",
    ember: "#ff6b35",
    rust: "#d4a574",
  },
  cyberpunk: {
    ink: "#0a0a10",
    "ink-2": "#0f0f1a",
    "ink-3": "#161625",
    "ink-4": "#1e1e30",
    line: "#2a2a40",
    "line-strong": "#3a3a55",
    text: "#e8e8f0",
    "text-dim": "#9090a0",
    "text-faint": "#606070",
    acid: "#00f0ff",
    "acid-soft": "#00f0ff22",
    ember: "#ff0055",
    rust: "#ff8c42",
  },
  sunset: {
    ink: "#1a0a0a",
    "ink-2": "#221212",
    "ink-3": "#2c1a1a",
    "ink-4": "#362020",
    line: "#4a2a2a",
    "line-strong": "#5a3535",
    text: "#f5e8e0",
    "text-dim": "#b09080",
    "text-faint": "#806050",
    acid: "#ff6b35",
    "acid-soft": "#ff6b3522",
    ember: "#ffaa33",
    rust: "#d4886a",
  },
  forest: {
    ink: "#0a100a",
    "ink-2": "#111a11",
    "ink-3": "#1a251a",
    "ink-4": "#222f22",
    line: "#2a3a2a",
    "line-strong": "#3a4a3a",
    text: "#e8f0e0",
    "text-dim": "#90a080",
    "text-faint": "#607050",
    acid: "#88ff44",
    "acid-soft": "#88ff4422",
    ember: "#ffcc00",
    rust: "#aadd66",
  },
  midnight: {
    ink: "#060612",
    "ink-2": "#0a0a1e",
    "ink-3": "#111130",
    "ink-4": "#181840",
    line: "#252555",
    "line-strong": "#333377",
    text: "#e0e0f5",
    "text-dim": "#8888aa",
    "text-faint": "#555588",
    acid: "#aa88ff",
    "acid-soft": "#aa88ff22",
    ember: "#ff4488",
    rust: "#ff88aa",
  },
  monochrome: {
    ink: "#0a0a0a",
    "ink-2": "#111111",
    "ink-3": "#1a1a1a",
    "ink-4": "#222222",
    line: "#333333",
    "line-strong": "#444444",
    text: "#e0e0e0",
    "text-dim": "#999999",
    "text-faint": "#666666",
    acid: "#ffffff",
    "acid-soft": "#ffffff18",
    ember: "#cccccc",
    rust: "#aaaaaa",
  },
  warm: {
    ink: "#140e08",
    "ink-2": "#1e1610",
    "ink-3": "#2a2018",
    "ink-4": "#342820",
    line: "#4a3a2a",
    "line-strong": "#5a4836",
    text: "#f0e8d8",
    "text-dim": "#b0a090",
    "text-faint": "#807060",
    acid: "#ffd700",
    "acid-soft": "#ffd70022",
    ember: "#ff6b35",
    rust: "#daa520",
  },
};

const args = process.argv.slice(2);

// Flag helpers
const hasFlag = (flag) => args.includes(flag) || args.includes(`-${flag}`);
const getFlagValue = (flag) => {
  const idx = args.findIndex((a) => a === `--${flag}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return null;
};

// Show presets list
if (hasFlag("list")) {
  console.log("\n🎨 Temas predefinidos disponibles:\n");
  Object.keys(PRESETS).forEach((name) => {
    const t = PRESETS[name];
    console.log(`  ${name.padEnd(12)} — Ink: ${t.ink} | Acid: ${t.acid} | Text: ${t.text}`);
  });
  console.log("\nUso: pnpm theme --preset <nombre>\n");
  process.exit(0);
}

// Apply preset
const presetName = getFlagValue("preset");
if (presetName) {
  if (!PRESETS[presetName]) {
    console.error(`❌ Tema "${presetName}" no encontrado. Usa --list para ver disponibles.`);
    process.exit(1);
  }
  applyTheme(PRESETS[presetName]);
  console.log(`✅ Tema "${presetName}" aplicado correctamente.`);
  console.log(`   Recarga la página (pnpm dev) para ver los cambios.`);
  process.exit(0);
}

// Apply custom colors
const custom = {};
["ink", "ink-2", "ink-3", "ink-4", "line", "line-strong", "text", "text-dim", "text-faint", "acid", "acid-soft", "ember", "rust"].forEach((key) => {
  const val = getFlagValue(key);
  if (val) custom[key] = val;
});

if (Object.keys(custom).length > 0) {
  // Start from default and override
  const merged = { ...PRESETS.default, ...custom };
  applyTheme(merged);
  console.log(`✅ Colores personalizados aplicados.`);
  console.log(`   Recarga la página (pnpm dev) para ver los cambios.`);
  process.exit(0);
}

// Interactive mode
async function interactive() {
  console.log("\n🎨 Theme CLI — Personaliza los colores de tu portfolio\n");
  console.log("Presiona Enter para mantener el valor actual.\n");

  const readline = await import("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = (question, current) => new Promise((resolve) => {
    rl.question(`${question} (${current}): `, (answer) => {
      resolve(answer.trim() || current);
    });
  });

  const current = parseCurrentTheme();
  const result = { ...current };

  result["ink"] = await ask("Color de fondo principal (ink)", current["ink"]);
  result["acid"] = await ask("Color de acento (acid)", current["acid"]);
  result["text"] = await ask("Color de texto principal (text)", current["text"]);
  result["text-dim"] = await ask("Color de texto secundario (text-dim)", current["text-dim"]);
  result["line"] = await ask("Color de bordes (line)", current["line"]);
  result["ember"] = await ask("Color de énfasis (ember)", current["ember"]);

  rl.close();

  // Auto-generar variantes si no se proporcionaron
  if (!result["ink-2"]) result["ink-2"] = lighten(result["ink"], 8);
  if (!result["ink-3"]) result["ink-3"] = lighten(result["ink"], 15);
  if (!result["ink-4"]) result["ink-4"] = lighten(result["ink"], 20);
  if (!result["acid-soft"]) result["acid-soft"] = result["acid"] + "22";
  if (!result["line-strong"]) result["line-strong"] = lighten(result["line"], 10);

  applyTheme(result);
  console.log(`\n✅ Tema personalizado aplicado.`);
  console.log(`   Recarga la página (pnpm dev) para ver los cambios.`);
}

function applyTheme(theme) {
  let css = fs.readFileSync(GLOBAL_CSS_PATH, "utf-8");

  Object.entries(theme).forEach(([key, value]) => {
    const regex = new RegExp(`(--${key.replace(/[-]/g, "[-]")}):\\s*[^;]+;`);
    if (regex.test(css)) {
      css = css.replace(regex, `--${key}: ${value};`);
    }
  });

  fs.writeFileSync(GLOBAL_CSS_PATH, css, "utf-8");
}

function parseCurrentTheme() {
  const css = fs.readFileSync(GLOBAL_CSS_PATH, "utf-8");
  const theme = {};
  const regex = /--([\w-]+):\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(css))) {
    theme[match[1]] = match[2].trim();
  }
  return theme;
}

function lighten(hex, percent) {
  // Very simple lighten function for auto-generation
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

interactive().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
