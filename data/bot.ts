export interface ConocimientoBot {
  claves: string[];
  respuesta: string;
}

export const NOMBRE_BOT = "Kati";

export const CONOCIMIENTO: ConocimientoBot[] = [
  {
    claves: ["horario", "hora", "abre", "cierra", "abierto", "cuando abre", "que hora"],
    respuesta:
      "Nuestro horario es: lunes a viernes de 10:00 a 20:00, y sábados, domingos y periodos de vacaciones de 9:00 a 22:00. Te recomiendo llegar 30 minutos antes de la apertura para aprovechar al máximo tu día.",
  },
  {
    claves: ["precio", "cuanto cuesta", "cuesta", "costo", "cuanto vale", "vale", "tarifa", "barato"],
    respuesta:
      "El Boleto de 1 Día cuesta $349 MXN (adulto) y $279 MXN (niños de 3 a 11 años y adultos mayores de 60+). El Pase Anual cuesta $1,499 MXN e incluye entrada ilimitada por 12 meses, estacionamiento gratis y descuentos. Los menores de 3 años entran gratis.",
  },
  {
    claves: ["pase anual", "anual", "membresia", "temporada"],
    respuesta:
      "El Pase Anual ($1,499 MXN) te da entrada ilimitada por 12 meses, estacionamiento sin costo, 10% de descuento en restaurantes y tiendas, y puedes invitar a un amigo gratis durante el mes de tu cumpleaños. Lo puedes comprar aquí mismo en la sección de Boletos.",
  },
  {
    claves: ["estatura", "altura", "bajo", "pequeno", "medir", "medida", "restriccion"],
    respuesta:
      "Cada atracción tiene una estatura mínima de seguridad, por ejemplo: Rusa Kataplum 130 cm, Torre del Rayo 120 cm y El Ciclón 140 cm. Para los peques hay atracciones sin restricción como el Carrusel Real, la Escuela de Aviación y el Castillo de los Duendes. En el mapa interactivo puedes filtrar por estatura.",
  },
  {
    claves: ["donde", "ubicacion", "direccion", "llegar", "ubica", "mapa google", "como llego", "llego"],
    respuesta:
      "Estamos en Av. de los Parques 123, Col. Del Valle, Ciudad de México. Puedes llegar en auto (hay estacionamiento en la entrada principal), en metrobús Línea 3 estación Parques, o en la app de transporte. En la sección 'Cómo llegar' del sitio tienes las opciones detalladas.",
  },
  {
    claves: ["estacionamiento", "estaciona", "auto", "coche", "carro", "parqueo", "parking"],
    respuesta:
      "Contamos con estacionamiento general a $80 MXN por día y preferente (más cerca de la entrada) a $150 MXN. Si tienes Pase Anual, el estacionamiento general es gratis.",
  },
  {
    claves: ["comida", "restaurante", "comer", "cena", "almuerzo", "hambre", "snack", "antojo"],
    respuesta:
      "Tenemos más de 15 restaurantes y puestos de antojitos: hamburguesas, pizzas, tacos, paletas y dulces temáticos. En Mundo Acuático también hay snack bar junto a la alberca de olas. El agua de fuentes es gratis, ¡lleva tu termo!",
  },
  {
    claves: ["agua", "acuatico", "alberca", "piscina", "mojar", "traje de bano", "tobogan", "ola"],
    respuesta:
      "El Mundo Acuático incluye la alberca de olas Ola Perfecta, el Río Lento y el Tobogán Titán. El acceso está incluido en tu boleto, solo necesitas traje de baño (recomendamos traer el tuyo; también hay tienda dentro). Los lockers cuestan $60 MXN por día.",
  },
  {
    claves: ["lluvia", "clima", "sol", "calor", "paraguas", "que me pongo", "vestir"],
    respuesta:
      "El parque abre con lluvia o sol, pero algunas atracciones extremas se pausan durante tormentas eléctricas por seguridad. Recomendamos ropa cómoda, bloqueador y, en temporada de lluvias, un impermeable ligero. Hay áreas techadas para descansar.",
  },
  {
    claves: ["cumpleanos", "fiesta", "evento", "celebrar", "grupo", "escuela", "visita guiada"],
    respuesta:
      "¡Celebramos cumpleaños! Tenemos paquetes de fiesta que incluyen pastel, decoración y acceso prioritario a atracciones, desde $2,500 MXN para 10 personas. Para grupos escolares y eventos corporativos hay tarifas especiales; escríbenos a fiestas@kataplum.com.mx.",
  },
  {
    claves: ["bebé", "bebe", "coche", "carriola", "pañales", "lactancia", "cambio"],
    respuesta:
      "Los menores de 3 años entran gratis. Hay salas de lactancia y cambio de pañales en las 4 zonas del parque, además de renta de carriolas ($50 MXN por día) en la entrada principal.",
  },
  {
    claves: ["mascota", "perro", "animal", "gato"],
    respuesta:
      "Por seguridad de todos, las mascotas no pueden ingresar al parque, excepto perros de asistencia debidamente acreditados. Contamos con guardería de mascotas asociada a 200 m de la entrada.",
  },
  {
    claves: ["reembolso", "cancelar", "cambiar", "devolucion", "cambio de fecha", "no pude ir"],
    respuesta:
      "Puedes cambiar la fecha de tu boleto hasta 24 horas antes de tu visita sin costo desde el enlace de tu correo de confirmación. Los boletos no son reembolsables, pero la fecha sí es flexible.",
  },
  {
    claves: ["discapacidad", "silla de ruedas", "accesibilidad", "movilidad", "reducida"],
    respuesta:
      "El 95% del parque es accesible para sillas de ruedas, con rampas en todas las zonas y baños adaptados. Ofrecemos renta de sillas de ruedas ($30 MXN) y en varias atracciones hay acceso prioritario para visitantes con discapacidad y un acompañante.",
  },
  {
    claves: ["fast pass", "acceso rapido", "fila", "filas", "espera", "esperar"],
    respuesta:
      "El Fast Pass ($150 MXN por persona) te da acceso prioritario a las 5 atracciones más populares: Rusa Kataplum, Torre del Rayo, El Ciclón, Tobogán Titán y Tren Fantasma. Lo puedes agregar al comprar tu boleto aquí en el sitio.",
  },
  {
    claves: ["gratis", "menores", "niños gratis", "bebes gratis", "quien entra gratis"],
    respuesta:
      "Los menores de 3 años entran gratis al parque. También los cumpleañeros pueden invitar a un amigo gratis si tienen Pase Anual, durante el mes de su cumpleaños.",
  },
  {
    claves: ["show", "espectaculo", "desfile", "musica", "pirotecnia", "eventos"],
    respuesta:
      "Cada día hay shows en vivo en la Plaza Principal: el Desfile de Luces a las 19:00 (21:00 en fines de semana) es imperdible, con personajes, carros alegóricos y un cierre con confeti. Consulta el cartel del día al entrar.",
  },
];

export const RESPUESTA_FALLO =
  "Mmm, esa no la tengo segura, pero puedo ayudarte con horarios, precios, estaturas mínimas, cómo llegar, comida, el Mundo Acuático y eventos. ¿Sobre qué quieres saber?";

export const SUGERENCIAS = [
  "¿Qué horarios tienen?",
  "¿Cuánto cuesta el boleto?",
  "¿Hay atracciones para niños pequeños?",
  "¿Cómo llego al parque?",
  "¿Qué incluye el Pase Anual?",
  "¿Qué pasa si llueve?",
];
