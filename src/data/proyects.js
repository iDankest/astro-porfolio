// @ts-check

/** @type {Array<{
 *   name: string;
 *   img: string;
 *   tech: Array<keyof import('./techs').techs>;
 *   description: string;
 *   github: string;
 *   url?: string;
 *   styleNone: string;
 *   display: string;
 * }>} */
export const projects = [
    {
        name: "Rooftop Rush",
        img: "/assets/Rooftop-Rush.png",
        tech: ["html", "css", "js", "git"],
        description: "Proyecto colaborativo: mi mayor aporte es la parte visual y el movimiento de las plataformas",
        github: "https://github.com/jlld47/Roof-Rush",
        url: "https://jlld47.github.io/Roof-Rush/",
        styleNone: "m-2 flex justify-between items-center",
        display: "show-proyect"
    },
    {
        name: "GalaGame",
        img: "/assets/galagame.png",
        tech: ["html", "css", "js", "git"],
        description: "Proyecto de juego gala realizado en solitario manejo de colisiones y movimiento de personajes",
        github: "https://github.com/iDankest/GalaGame",
        url: "https://mygalagame.netlify.app/",
        styleNone: "m-2 flex justify-between items-center",
        display: "show-proyect"
    },
    {
        name: "Game Finder",
        img: "/assets/image.png",
        tech: ["html", "css", "js", "git", "php", "symfony", "tailwind", "mysql"],
        description: "Participación en proyecto web de búsqueda de videojuegos utilizando una API de Steam con Symfony",
        github: "https://github.com/iDankest/Proyecto-Symfony",
        styleNone: "m-2 flex justify-center items-center",
        display: "show-proyect-none"
    },
    {
        name: "Criptomoneda",
        img: "/assets/crypto.png",
        tech: ["html", "css", "js", "git", "vue"],
        description: "Proyecto donde principlamente es el manejo de APIs con Vue.js con composables y manejo de datos",
        github: "https://github.com/iDankest/crypto-vue",
        url: "https://cryptovueapi.netlify.app/",
        styleNone: "m-2 flex justify-between items-center",
        display: "show-proyect"
    },
    {
        name: "Admin Gastos",
        img: "/assets/adgastos.png",
        tech: ["html", "css", "js", "git", "vue"],
        description: "Proyecto frontend de administración de gastos poniendo a prueba la reactividad de Vue.js",
        github: "https://github.com/iDankest/admin-gastos",
        url: "https://adgastos.netlify.app/",
        styleNone: "m-2 flex justify-between items-center",
        display: "show-proyect"
    },
    {
        name: "Tu Guitarra Online",
        img: "/assets/guitarra.png",
        tech: ["html", "css", "js", "git", "vue"],
        description: "Tienda Online de venta de guitarras con un carrito de compras, guardado en localStorage y trabajo frontend",
        github: "https://github.com/iDankest/guitarla-vue",
        url: "https://gitardankest.netlify.app/",
        styleNone: "m-2 flex justify-between items-center",
        display: "show-proyect"
    }

];