// @ts-check

import rooftopRush from '../assets/projects/rooftop-rush.png';
import galagame from '../assets/projects/galagame.png';
import gameFinder from '../assets/projects/game-finder.png';
import cripto from '../assets/projects/cripto.png';
import adminGastos from '../assets/projects/admin-gastos.png';
import guitarra from '../assets/projects/guitarra.png';
import orbix from '../assets/projects/orbix.jpg';
import prismacrawler from '../assets/projects/prismacrawler.png';

/**
 * @typedef {Object} Project
 * @property {string} name
 * @property {string} tag            Categoría corta ("Game", "Web App"…)
 * @property {string} tagline        Frase corta para la portada
 * @property {string} cover          Imagen de portada (procesada por Astro)
 * @property {Array<keyof import('./techs').techs>} tech
 * @property {string} description
 * @property {string} github
 * @property {string} [url]
 * @property {string} [video]        URL o ruta de video para reproducir en hover (opcional)
 * @property {boolean} [featured]    Si true, se muestra como proyecto destacado
 */

/** @type {Project[]} */
export const projects = [
    {
        name: "Orbix",
        tag: "Featured · React + AI",
        tagline: "Visualización de datos espaciales con Gemini AI",
        cover: orbix,
        tech: ["react", "tailwind", "framer", "gemini", "axios", "git", "github"],
        description: "Aplicación web que consulta APIs de la NASA en tiempo real: asteroides, misiones y astronautas. UI animada con Framer Motion y asistente IA con Gemini Flash.",
        github: "https://github.com/iDankest/Orbix",
        url: "https://orbixpro.netlify.app/",
        featured: true,
    },
    {
        name: "PrismaCrawler",
        tag: "Full Stack · Game",
        tagline: "Roguelike Dungeon Crawler con Phaser y Prisma",
        cover: prismacrawler,
        tech: ["react", "vite", "phaser", "node", "express", "prisma", "postgresql", "jest", "tailwind", "git", "github"],
        description: "Juego roguelike full-stack: motor gráfico con Phaser, API REST en Node/Express, persistencia con Prisma y PostgreSQL. Auth JWT, leaderboard y tests E2E.",
        github: "https://github.com/iDankest/PrismaCrawler",
    },
    {
        name: "Criptomoneda",
        tag: "API · Vue 3",
        tagline: "Tracker de precios en tiempo real con composables",
        cover: cripto,
        tech: ["html", "css", "js", "vue", "git", "github"],
        description: "Proyecto donde principalmente es el manejo de APIs con Vue.js con composables y manejo de datos.",
        github: "https://github.com/iDankest/crypto-vue",
        url: "https://cryptovueapi.netlify.app/",
    },
    {
        name: "Admin Gastos",
        tag: "Dashboard · Vue 3",
        tagline: "Reactividad al servicio del control financiero",
        cover: adminGastos,
        tech: ["html", "css", "js", "vue", "git", "github"],
        description: "Proyecto frontend de administración de gastos poniendo a prueba la reactividad de Vue.js.",
        github: "https://github.com/iDankest/admin-gastos",
        url: "https://adgastos.netlify.app/",
    },
    {
        name: "Tu Guitarra Online",
        tag: "E-commerce",
        tagline: "Tienda, carrito y persistencia con localStorage",
        cover: guitarra,
        tech: ["html", "css", "js", "vue", "git", "github"],
        description: "Tienda Online de venta de guitarras con un carrito de compras, guardado en localStorage y trabajo frontend.",
        github: "https://github.com/iDankest/guitarla-vue",
        url: "https://gitardankest.netlify.app/",
    },
    {
        name: "Game Finder",
        tag: "Full Stack",
        tagline: "Buscador de videojuegos con la API de Steam",
        cover: gameFinder,
        tech: ["html", "css", "js", "php", "symfony", "tailwind", "mysql", "git", "github"],
        description: "Participación en proyecto web de búsqueda de videojuegos utilizando una API de Steam con Symfony.",
        github: "https://github.com/iDankest/Proyecto-Symfony",
    },
    {
        name: "Rooftop Rush",
        tag: "Web Game",
        tagline: "Plataformas minimalistas en HTML Canvas",
        cover: rooftopRush,
        tech: ["html", "css", "js", "git", "github"],
        description: "Proyecto colaborativo: mi mayor aporte es la parte visual y el movimiento de las plataformas.",
        github: "https://github.com/jlld47/Roof-Rush",
        url: "https://jlld47.github.io/Roof-Rush/",
    },
    {
        name: "GalaGame",
        tag: "Arcade",
        tagline: "Shoot 'em up de corte espacial en vanilla JS",
        cover: galagame,
        tech: ["html", "css", "js", "git", "github"],
        description: "Proyecto de juego gala realizado en solitario: manejo de colisiones y movimiento de personajes.",
        github: "https://github.com/iDankest/GalaGame",
        url: "https://mygalagame.netlify.app/",
    },
];
