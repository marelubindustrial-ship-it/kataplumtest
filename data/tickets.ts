export interface ProductoBoleto {
  id: string;
  nombre: string;
  tagline: string;
  precio: number;
  color: string;
  incluye: string[];
  esPaseAnual: boolean;
}

export const PRODUCTOS: ProductoBoleto[] = [
  {
    id: "dia",
    nombre: "Boleto de 1 Día",
    tagline: "Todo el parque, un día inolvidable",
    precio: 349,
    color: "#ffd93b",
    esPaseAnual: false,
    incluye: [
      "Acceso a las 4 zonas del parque",
      "Todas las atracciones incluidas",
      "Shows y desfile vespertino",
      "Entrada a Mundo Acuático",
    ],
  },
  {
    id: "anual",
    nombre: "Pase Anual",
    tagline: "Kataplum todo el año, cuando quieras",
    precio: 1499,
    color: "#974292",
    esPaseAnual: true,
    incluye: [
      "Entrada ilimitada por 12 meses",
      "Estacionamiento gratis",
      "10% de descuento en restaurantes y tiendas",
      "Invita a un amigo gratis el mes de tu cumpleaños",
      "Acceso anticipado a eventos especiales",
    ],
  },
];

export const EXTRAS = {
  fastPass: { id: "fastpass", nombre: "Fast Pass", descripcion: "Acceso rápido a las 5 atracciones más populares", precio: 150 },
  locker: { id: "locker", nombre: "Locker grande", descripcion: "Todo el día en Mundo Acuático", precio: 60 },
};

export const TIPOS_VISITANTE = [
  { id: "adulto", nombre: "Adulto", aplica: (p: (typeof PRODUCTOS)[number]) => p.precio },
  { id: "nino", nombre: "Niño (3 a 11 años)", aplica: (p: (typeof PRODUCTOS)[number]) => Math.round(p.precio * 0.8) },
  { id: "senior", nombre: "Adulto mayor (60+)", aplica: (p: (typeof PRODUCTOS)[number]) => Math.round(p.precio * 0.8) },
];
