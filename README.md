# Apexora — sitio de lore

Sitio estático (HTML + CSS + JS puro, sin frameworks ni build) para documentar el lore del mundo de Apexora.

## Estructura

```
apexora-site/
├── index.html            → portada
├── mitologia.html         → Mitología y Teogonía (Espacio y sus diez hijos)
├── mundo.html             → naciones, órdenes, lugares de interés, razas y temas clave
├── mapa.html              → mapa interactivo del continente (hover, click, sonido)
├── linea-tiempo.html      → cronología de eventos clave
├── personajes.html        → Guardianes de Apexora, linajes, Sinfalía, Ocho de Negatt, OCL
├── historias.html         → relatos completos y el índice de campañas y arcos
├── dados.html             → tirador de dados estilo D&D (d4 a d100, ventaja/desventaja, historial)
├── css/style.css          → todo el diseño (colores, tipografía, layout, animaciones)
├── js/
│   ├── main.js            → menú móvil + aparición suave de contenido al hacer scroll
│   ├── orbit.js            → diagrama orbital de Espacio y sus diez hijos
│   ├── map.js              → interacción del mapa (halos, panel de info, sonido por nación)
│   ├── dice.js             → lógica del tirador de dados
│   └── dice3d.js           → visual del dado (SVG + transformación 3D en CSS)
└── assets/                → logo, ilustraciones, mapa y línea de tiempo
```

No hay proceso de build: son archivos estáticos que podés abrir directamente con doble clic (`index.html`) para previsualizar, o publicar tal cual.

## Publicar en GitHub Pages (gratis)

1. Creá un repositorio nuevo en GitHub (público, para que Pages sea gratis).
2. Subí el contenido de esta carpeta a la raíz del repositorio.
3. **Settings → Pages** → Source: **Deploy from a branch** → branch `main`, carpeta `/ (root)`.
4. Esperá 1–2 minutos: el sitio queda en `https://tu-usuario.github.io/nombre-del-repo/`.

Alternativas igual de gratuitas: **Netlify** o **Vercel** (arrastrás la carpeta), o **Cloudflare Pages**.

## El mapa interactivo

El mapa de `assets/mapa-apexora.jpg` sigue siendo la ilustración original — encima se dibuja una capa de marcadores (uno por nación) definidos directamente en `mapa.html` con variables CSS (`--x`, `--y`) que ubican cada uno en porcentaje sobre la imagen. Al pasar el cursor se enciende un halo de color sobre el territorio aproximado; al hacer clic se abre el panel de información y suena una nota generada en el momento con Web Audio (sin archivos de audio) — cada nación tiene su propia combinación de tonos en `js/map.js`, en el objeto `NATION_SOUNDS`.

Para **reubicar** una nación: ajustá `--x`/`--y` (posición) y `--rx`/`--ry` (tamaño del halo, en `.map-halo`) directamente en `mapa.html`. Para **agregar** una nación nueva: sumá su `<div class="map-halo">` y su `<button class="map-marker">`, y una entrada nueva en `APEXORA_NATIONS` y `NATION_SOUNDS` dentro de `js/map.js`.

## El tirador de dados

`dados.html` es autocontenido: elegís tipo de dado (d4 a d100), cantidad, modificador, y ventaja/desventaja (funciona con cualquier dado, no solo el d20 — tira dos veces y toma el resultado más alto o más bajo). El dado se dibuja como un SVG y tumba con una transformación 3D en CSS (no depende de librerías externas ni de WebGL). El historial vive solo en memoria: se pierde al recargar la página, tal como está pensado para una sesión de mesa.

## Cómo agregar más lore

- **Una nueva nación en Mundo**: copiá un bloque `<article class="nation-card">...</article>`, y sumala al mapa (ver arriba) y a la lista de `mapa.html`.
- **Un nuevo personaje**: copiá un bloque `<article class="char-card">...</article>` en `personajes.html`.
- **Un nuevo relato**: agregá una nueva `<section>` en `historias.html` siguiendo el patrón de `.story-block`, y sumalo al `<nav class="toc">` de arriba.
- **Una página nueva por completo**: copiá cualquiera de las páginas existentes como base, reemplazá el contenido de `<main>`, y agregá el link en el `<ul class="nav-links">` de **las ocho páginas** del sitio.

## Notas de diseño

- Tipografías: **Cinzel** (títulos) y **EB Garamond** (texto de lectura), de Google Fonts.
- Paleta: fondo casi negro (`#08070d`), dorado (`#cf9d4f`) para lo asociado a Xora/orden/luz, vino-violeta (`#6f2f52`) para Ape/caos/oscuridad, y un tono neutro para fuerzas que no toman bando.
- El índice (tabla de contenidos) de cada página se muestra apenas debajo del título, antes de la bajada de texto, para que se vea de entrada.
- Las tarjetas, paneles y bloques de contenido aparecen con una transición suave al entrar en pantalla (`IntersectionObserver` en `main.js`); si JavaScript no corre, todo el contenido es visible igual desde el principio.
