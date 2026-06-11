// @ts-check

import rooftopRush from '../assets/projects/rooftop-rush.png';
import galagame from '../assets/projects/galagame.png';
import gameFinder from '../assets/projects/game-finder.png';
import cripto from '../assets/projects/cripto.png';
import adminGastos from '../assets/projects/admin-gastos.png';
import guitarra from '../assets/projects/guitarra.png';
import orbix from '../assets/projects/orbix.png';
import prismacrawler from '../assets/projects/prismacrawler.png';
import reelify from '../assets/projects/reelify.png';
import voiceprompt from '../assets/projects/voiceprompt.png';

/**
 * @typedef {Object} Project
 * @property {string} name
 * @property {string} tag            Categoría corta ("Game", "Web App"…)
 * @property {string} tagline        Frase corta para la portada
 * @property {ImageMetadata} cover   Imagen de portada (procesada por Astro)
 * @property {string} coverAlt       Descripción accesible de la captura
 * @property {'web' | 'app'} kind    Tipo de chrome del mockup (browser vs ventana macOS)
 * @property {Array<keyof import('./techs').techs>} tech
 * @property {string} description
 * @property {string} [github]       Repo público (omitir si es privado)
 * @property {string} [url]
 * @property {string} [video]        Ruta del video de preview en hover (public/videos/)
 * @property {boolean} [featured]    Si true, se muestra como proyecto destacado
 */

/** @type {Project[]} */
export const projects = [
    {
        name: "Reelify",
        tag: "Featured · macOS App",
        tagline: "Record. Post. Ship. — grabación de pantalla cinemática",
        cover: reelify,
        coverAlt: "Landing de Reelify: grabadora de pantalla cinemática para desarrolladores en Apple Silicon",
        kind: "app",
        tech: ["swift", "rust", "astro", "tailwind"],
        description: "Grabadora de pantalla, capturas y editor nativo para macOS. Swift para la experiencia nativa, Rust para el servicio local, y una IA que escribe el post de LinkedIn y X mientras exporta tu demo.",
        featured: true,
    },
    {
        name: "VoicePrompt",
        tag: "macOS App · IA",
        tagline: "Habla en español, pega un prompt perfecto en inglés",
        cover: voiceprompt,
        coverAlt: "Landing de VoicePrompt: dictado por voz que se convierte en prompts perfectos para IA",
        kind: "app",
        tech: ["swift", "python", "docker", "astro"],
        description: "App nativa de dictado por voz: pulsas un atajo, hablas en español, y VoicePrompt lo transcribe, lo traduce y lo convierte en un prompt impecable sin salir del editor. Server propio con FastAPI + Ollama.",
    },
    {
        name: "Orbix",
        tag: "React + IA",
        tagline: "Visualización de datos espaciales con Gemini AI",
        cover: orbix,
        coverAlt: "Interfaz de Orbix mostrando telemetría orbital, astronautas activos y próximos lanzamientos",
        kind: "web",
        tech: ["react", "tailwind", "framer", "gemini", "axios", "git", "github"],
        description: "Aplicación web que consulta APIs de la NASA en tiempo real: asteroides, misiones y astronautas. UI animada con Framer Motion y asistente IA con Gemini Flash.",
        github: "https://github.com/iDankest/Orbix",
        url: "https://orbixpro.netlify.app/",
        video: "/videos/orbix.webm",
    },
    {
        name: "PrismaCrawler",
        tag: "Full Stack · Game",
        tagline: "Roguelike Dungeon Crawler con Phaser y Prisma",
        cover: prismacrawler,
        coverAlt: "Partida de PrismaCrawler: mazmorra pixel-art con el héroe, enemigos, inventario y registro de eventos",
        kind: "web",
        tech: ["react", "vite", "phaser", "node", "express", "prisma", "postgresql", "jest", "tailwind", "git", "github"],
        description: "Juego roguelike full-stack: motor gráfico con Phaser, API REST en Node/Express, persistencia con Prisma y PostgreSQL. Auth JWT, leaderboard y tests E2E.",
        github: "https://github.com/iDankest/PrismaCrawler",
        video: "/videos/prismacrawler.webm",
    },
    {
        name: "Criptomoneda",
        tag: "API · Vue 3",
        tagline: "Tracker de precios en tiempo real con composables",
        cover: cripto,
        coverAlt: "Cotizador de criptomonedas en Vue mostrando el precio de Bitcoin en tiempo real",
        kind: "web",
        tech: ["html", "css", "js", "vue", "git", "github"],
        description: "Proyecto donde principalmente es el manejo de APIs con Vue.js con composables y manejo de datos.",
        github: "https://github.com/iDankest/crypto-vue",
        url: "https://cryptovueapi.netlify.app/",
        video: "/videos/cripto.webm",
    },
    {
        name: "Admin Gastos",
        tag: "Dashboard · Vue 3",
        tagline: "Reactividad al servicio del control financiero",
        cover: adminGastos,
        coverAlt: "Panel de administración de gastos con gráfico de presupuesto y listado de movimientos",
        kind: "web",
        tech: ["html", "css", "js", "vue", "git", "github"],
        description: "Proyecto frontend de administración de gastos poniendo a prueba la reactividad de Vue.js.",
        github: "https://github.com/iDankest/admin-gastos",
        url: "https://adgastos.netlify.app/",
        video: "/videos/admin-gastos.webm",
    },
    {
        name: "Tu Guitarra Online",
        tag: "E-commerce",
        tagline: "Tienda, carrito y persistencia con localStorage",
        cover: guitarra,
        coverAlt: "Tienda online de guitarras con catálogo de productos y carrito de compra",
        kind: "web",
        tech: ["html", "css", "js", "vue", "git", "github"],
        description: "Tienda Online de venta de guitarras con un carrito de compras, guardado en localStorage y trabajo frontend.",
        github: "https://github.com/iDankest/guitarla-vue",
        url: "https://gitardankest.netlify.app/",
        video: "/videos/guitarra.webm",
    },
    {
        name: "Game Finder",
        tag: "Full Stack",
        tagline: "Buscador de videojuegos con la API de Steam",
        cover: gameFinder,
        coverAlt: "Buscador de videojuegos con resultados de la API de Steam en una interfaz con Tailwind",
        kind: "web",
        tech: ["html", "css", "js", "php", "symfony", "tailwind", "mysql", "git", "github"],
        description: "Participación en proyecto web de búsqueda de videojuegos utilizando una API de Steam con Symfony.",
        github: "https://github.com/iDankest/Proyecto-Symfony",
    },
    {
        name: "Rooftop Rush",
        tag: "Web Game",
        tagline: "Plataformas minimalistas en HTML Canvas",
        cover: rooftopRush,
        coverAlt: "Juego de plataformas Rooftop Rush con personaje saltando entre azoteas en Canvas",
        kind: "web",
        tech: ["html", "css", "js", "git", "github"],
        description: "Proyecto colaborativo: mi mayor aporte es la parte visual y el movimiento de las plataformas.",
        github: "https://github.com/jlld47/Roof-Rush",
        url: "https://jlld47.github.io/Roof-Rush/",
        video: "/videos/rooftop-rush.webm",
    },
    {
        name: "GalaGame",
        tag: "Arcade",
        tagline: "Shoot 'em up de corte espacial en vanilla JS",
        cover: galagame,
        coverAlt: "Shoot 'em up espacial GalaGame con nave disparando a enemigos en vanilla JS",
        kind: "web",
        tech: ["html", "css", "js", "git", "github"],
        description: "Proyecto de juego gala realizado en solitario: manejo de colisiones y movimiento de personajes.",
        github: "https://github.com/iDankest/GalaGame",
        url: "https://mygalagame.netlify.app/",
        video: "/videos/galagame.webm",
    },
];
