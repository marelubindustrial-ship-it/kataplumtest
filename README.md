# Kataplum · Sitio web del parque de diversiones

Rediseño conceptual del sitio de Kataplum (kataplum.com.mx): una experiencia tipo parque
Disneyland con mapa interactivo, venta de boletos en la misma página y asistente virtual.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** con sistema de diseño "sticker" (bordes gruesos, sombras duras, paleta amarillo/morado/rosa)
- **GSAP + ScrollTrigger**: parallax en el hero y sección de historia con scroll anclado (pin + scrub)
- **Lucide React**: iconos
- Video del hero: reproducción automática, sin sonido, en bucle

## Qué incluye

| Módulo | Descripción |
|---|---|
| Hero | Video de fondo con autoplay silencioso, parallax y marquesina animada |
| Atracciones | Carrusel horizontal filtrable por zona con ilustraciones SVG generadas por código |
| Mapa interactivo | Mapa SVG del parque con arrastre, zoom (rueda + botones), 4 zonas, marcadores de 12 atracciones, filtro por estatura y ficha de detalle |
| Historia | Sección anclada con narrativa "Explora → Vive → Regresa" controlada por scroll |
| Boletos | Flujo de compra de 4 pasos: Boleto de 1 Día / Pase Anual, tipo de visitante, extras (Fast Pass, locker), fecha, datos y confirmación con folio |
| Asistente virtual "Kati" | Botón flotante estilo WhatsApp con chat que responde preguntas del parque (horarios, precios, estaturas, cómo llegar, etc.) |
| Cómo llegar | Dirección, horarios, estacionamiento y opciones de transporte |

## Cómo correrlo

```bash
npm install
npm run dev      # desarrollo en http://localhost:3000
npm run build    # build de producción (genera dist/ como sitio estático)
npm start        # sirve la carpeta dist/ en el puerto 3000
```

También incluye un `Dockerfile` (build multi-etapa con nginx) para desplegarlo como contenedor.

## Estructura

```
app/            layout, página principal y estilos globales
components/     Header, Hero, Attractions, ParkMap, Story, Tickets, Visit, Footer, ChatBot, Loader
data/           park.ts (zonas y atracciones), tickets.ts (productos y extras), bot.ts (base de conocimiento)
hooks/          useReveal.ts (revelado al hacer scroll)
public/assets/  video del hero
```

## Notas

- La compra de boletos es una **simulación de front-end** (no procesa pagos reales); genera un
  folio de confirmación local. Para producción habría que conectar una pasarela de pago.
- La asistente virtual usa una base de conocimiento local con coincidencia por palabras clave;
  para producción puede conectarse a un modelo de IA.
- El contenido (precios, horarios, atracciones) es de demostración para el rediseño.
- Todos los efectos de scroll respetan `prefers-reduced-motion` y funcionan con táctil.
