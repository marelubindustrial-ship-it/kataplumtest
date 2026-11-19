export type ZonaId = "fantasia" | "extrema" | "infantil" | "acuatica";

export interface Zona {
  id: ZonaId;
  nombre: string;
  color: string;
  colorSuave: string;
  descripcion: string;
}

export interface Atraccion {
  id: string;
  nombre: string;
  zona: ZonaId;
  estaturaMin: number; // cm, 0 = sin restricción
  emocion: 1 | 2 | 3 | 4 | 5;
  descripcion: string;
  esperaMin: number;
  x: number; // posición en el mapa (viewBox 1000x700)
  y: number;
}

export const ZONAS: Zona[] = [
  {
    id: "fantasia",
    nombre: "Mundo Fantasía",
    color: "#974292",
    colorSuave: "#e9d3f5",
    descripcion: "El corazón mágico del parque: carruseles, trenes y luces de colores.",
  },
  {
    id: "extrema",
    nombre: "Zona Extrema",
    color: "#e0492e",
    colorSuave: "#fadcd4",
    descripcion: "Montañas rusas y adrenalina pura para los valientes.",
  },
  {
    id: "infantil",
    nombre: "Rincón Infantil",
    color: "#f0a208",
    colorSuave: "#fdeec9",
    descripcion: "Atracciones suaves y seguras para los más pequeños.",
  },
  {
    id: "acuatica",
    nombre: "Mundo Acuático",
    color: "#3d9be9",
    colorSuave: "#d4ecfd",
    descripcion: "Toboganes, albercas de olas y diversión mojada.",
  },
];

export const ATRACCIONES: Atraccion[] = [
  {
    id: "rusa-kataplum",
    nombre: "Rusa Kataplum",
    zona: "extrema",
    estaturaMin: 130,
    emocion: 5,
    descripcion: "Nuestra montaña rusa insignia: 3 loopings, una caída de 40 metros y velocidades de hasta 90 km/h.",
    esperaMin: 35,
    x: 762,
    y: 178,
  },
  {
    id: "torre-del-rayo",
    nombre: "Torre del Rayo",
    zona: "extrema",
    estaturaMin: 120,
    emocion: 5,
    descripcion: "Cae en caída libre desde 60 metros con una vista espectacular de todo el parque.",
    esperaMin: 25,
    x: 664,
    y: 262,
  },
  {
    id: "ciclón",
    nombre: "El Ciclón",
    zona: "extrema",
    estaturaMin: 140,
    emocion: 4,
    descripcion: "Giros de 360° y cambios de dirección que te dejarán sin aliento.",
    esperaMin: 20,
    x: 838,
    y: 288,
  },
  {
    id: "noria-magica",
    nombre: "Noria Mágica",
    zona: "fantasia",
    estaturaMin: 90,
    emocion: 2,
    descripcion: "La noria más grande de la ciudad: 45 metros de altura con cabinas cerradas con aire acondicionado.",
    esperaMin: 15,
    x: 388,
    y: 190,
  },
  {
    id: "carrusel-real",
    nombre: "Carrusel Real",
    zona: "fantasia",
    estaturaMin: 0,
    emocion: 1,
    descripcion: "Caballos tallados a mano y música clásica. Un clásico para todas las edades.",
    esperaMin: 5,
    x: 268,
    y: 262,
  },
  {
    id: "tren-fantasma",
    nombre: "Tren Fantasma",
    zona: "fantasia",
    estaturaMin: 110,
    emocion: 3,
    descripcion: "Recorre un castillo embrujado lleno de sorpresas y personajes que cobran vida.",
    esperaMin: 18,
    x: 452,
    y: 328,
  },
  {
    id: "rio-lento",
    nombre: "Río Lento",
    zona: "acuatica",
    estaturaMin: 90,
    emocion: 1,
    descripcion: "Flota en llantas gigantes por un río tropical rodeado de cascadas y jardines.",
    esperaMin: 10,
    x: 592,
    y: 478,
  },
  {
    id: "tobogán-titan",
    nombre: "Tobogán Titán",
    zona: "acuatica",
    estaturaMin: 120,
    emocion: 4,
    descripcion: "Un tobogán de 25 metros con tramos cerrados y una caída final espectacular.",
    esperaMin: 22,
    x: 716,
    y: 522,
  },
  {
    id: "ola-perfecta",
    nombre: "Ola Perfecta",
    zona: "acuatica",
    estaturaMin: 100,
    emocion: 3,
    descripcion: "Alberca de olas con playa de arena, cada hora en punto las olas alcanzan 2 metros.",
    esperaMin: 8,
    x: 492,
    y: 562,
  },
  {
    id: "avioncitos",
    nombre: "Escuela de Aviación",
    zona: "infantil",
    estaturaMin: 0,
    emocion: 1,
    descripcion: "Avioncitos que suben y bajan controlados por los pequeños pilotos.",
    esperaMin: 5,
    x: 172,
    y: 442,
  },
  {
    id: "castillo-suave",
    nombre: "Castillo de los Duendes",
    zona: "infantil",
    estaturaMin: 0,
    emocion: 2,
    descripcion: "Laberinto de túneles, resbaladillas suaves y pelotas gigantes.",
    esperaMin: 7,
    x: 296,
    y: 522,
  },
  {
    id: "mini-tren",
    nombre: "Mini Tren del Parque",
    zona: "infantil",
    estaturaMin: 0,
    emocion: 1,
    descripcion: "Un recorrido tranquilo en trenecito alrededor de todo el Jardín de los Duendes.",
    esperaMin: 6,
    x: 148,
    y: 566,
  },
];

export const ENTRADA = {
  nombre: "Kataplum",
  horarioSemana: "Lunes a viernes · 10:00 a 20:00",
  horarioFin: "Sábados, domingos y vacaciones · 9:00 a 22:00",
  direccion: "Av. de los Parques 123, Col. Del Valle, Ciudad de México",
  estacionamiento: "Estacionamiento general $80 por día · preferente $150",
};

export const precioMXN = (n: number) =>
  `$${n.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;
