/**
 * Datos de reseñas de LinkedIn.
 * Generado automáticamente desde la exportación de LinkedIn.
 * Para actualizar: ejecutar `pnpm sync-reviews` tras exportar de nuevo.
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

export const reviews: Review[] = [
  {
    author: "Javier Fleitas Hernández",
    role: "Desarrollador Web | Desarrollador Multiplataforma | Especialista en Sistemas Microinformáticos y Redes",
    company: "IKEA (prácticas)",
    avatar: "/assets/reviews/javier.jpg",
    text: "Tuve la oportunidad de estudiar y trabajar junto a Kilian durante nuestras prácticas en el departamento de IT de IKEA. Durante ese tiempo demostró ser una persona responsable, comprometida y con una gran capacidad de aprendizaje.\n\nDestacó por su actitud colaborativa, su disposición para ayudar al equipo y su capacidad para afrontar nuevos retos con iniciativa y profesionalidad. Además, su interés por la tecnología y su enfoque orientado a la resolución de problemas le permitieron adaptarse rápidamente al entorno de trabajo.\n\nHa sido un placer compartir esta experiencia profesional y académica con él, y estoy convencido de que será un gran profesional para cualquier equipo en el que participe. Lo recomiendo sin ninguna duda.",
    date: "2026-06-03",
    linkedInUrl: "https://www.linkedin.com/in/javierfleitashernandez/",
    relationship: "Trabajó con Kilian en el mismo equipo",
  },
  {
    author: "Carlos Garrido López",
    role: "Web developer | Full stack | #JavaScript | #TypeScript | #Vue | #Angular | #React | #Node | #Express | #Java | Spring Boot",
    company: "Reboot Academy",
    avatar: "/assets/reviews/carlos.jpg",
    text: "Kilian ha sido un alumno con una predisposición e iniciativa excepcional. Curioso, investigador y, por encima de todo, resolutivo.\n\nHa tenido un desempeño excelente y no me cabe duda de que tiene todas las capacidades para ser un programador autosuficiente capaz de aportar mucho a cualquier empresa.",
    date: "2026-06-03",
    linkedInUrl: "https://www.linkedin.com/in/carlosgalo/",
    relationship: "Supervisaba directamente a Kilian",
  },
];
