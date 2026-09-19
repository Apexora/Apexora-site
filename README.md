# Apexora — sitio de lore

Sitio estático (HTML + CSS + JS puro, sin frameworks ni build) para documentar el lore del mundo de Apexora. Empieza con la Mitología y Teogonía, pensado para ir creciendo con más secciones.

## Estructura

```
apexora-site/
├── index.html            → portada
├── mitologia.html         → Mitología y Teogonía (Espacio y sus diez hijos)
├── mundo.html             → naciones, razas, bestias dormidas y temas clave
├── mapa.html              → mapa del continente e índice de territorios
├── linea-tiempo.html      → cronología de eventos clave (año 0 al 912)
├── personajes.html        → Guardianes de Apexora, linaje de Zarick, familia de Markivton
├── historias.html         → relatos completos (Destinos Entrelazados, Guardianes I-III)
├── css/style.css          → todo el diseño (colores, tipografía, layout)
├── js/orbit.js            → dibuja el diagrama orbital de Espacio y sus hijos
├── js/main.js             → menú móvil
└── assets/
    ├── logo-original.png  → emblema de Apexora, resolución completa (1024×1024, para uso futuro)
    ├── logo-360.png        → emblema, usado en el header de Mitología y el hero de la portada
    ├── logo-96.png         → emblema, usado en la barra de navegación
    ├── favicon.png         → ícono de pestaña del navegador
    ├── hero-landscape.jpg  → ilustración general del mundo, usada de fondo en el hero de la portada
    ├── mapa-apexora.jpg    → mapa del continente, usado en Mapa
    └── linea-tiempo.png    → infografía de eventos clave, usada en Cronología
```

No hay proceso de build: son archivos estáticos que podés abrir directamente con doble clic (`index.html`) para previsualizar, o publicar tal cual.

## Publicar en GitHub Pages (gratis)

1. Creá un repositorio nuevo en GitHub (puede ser público o privado si tenés GitHub Pro; Pages gratis en cuentas free requiere que el repo sea **público**).
2. Subí el contenido de esta carpeta a la raíz del repositorio.
3. En GitHub: **Settings → Pages**.
4. En "Build and deployment" → Source, elegí **Deploy from a branch**.
5. Elegí la branch `main` y la carpeta `/ (root)`, guardá.
6. Esperá 1–2 minutos: tu sitio va a quedar publicado en `https://tu-usuario.github.io/nombre-del-repo/`.

Cada vez que subas un cambio (`git push`) a esa branch, el sitio se actualiza solo.

### Alternativas igual de gratuitas

- **Netlify** o **Vercel**: arrastrás la carpeta a su panel (drag & drop) y listo, sin necesidad de Git. Dan un dominio `algo.netlify.app` / `algo.vercel.app`, y podés conectar un dominio propio después.
- **Cloudflare Pages**: similar a Netlify, conectado a un repo de GitHub.

Cualquiera de las tres funciona perfecto para este sitio porque no necesita servidor ni base de datos.

## Cómo agregar más lore

- **Una nueva nación en Mundo**: copiá un bloque `<article class="nation-card">...</article>` en `mundo.html` como modelo, y sumá su nombre a la lista de `mapa.html` si corresponde.
- **Un nuevo personaje**: copiá un bloque `<article class="char-card">...</article>` en `personajes.html`.
- **Un nuevo relato**: agregá una nueva `<section>` en `historias.html` siguiendo el patrón de `.story-block`, y sumalo al `<nav class="toc">` de arriba.
- **Una página nueva por completo** (por ejemplo para una nación con su propia página): copiá cualquiera de las páginas existentes como base (ya trae el `<nav>`, el `<footer>` y los estilos), reemplazá el contenido de `<main>`, y agregá el link en el `<ul class="nav-links">` de **las siete páginas** del sitio.
- **Más arte**: guardalo en `assets/` con los otros archivos. Para cambiar la imagen de fondo del hero, reemplazá `assets/hero-landscape.jpg` por otra (mismo nombre) o editá la propiedad `background-image` de `.hero` en `css/style.css`.

## Notas de diseño

- Tipografías: **Cinzel** (títulos, nombres de deidades) y **EB Garamond** (texto de lectura), ambas de Google Fonts, cargadas por CDN.
- Paleta: fondo casi negro con tinte violeta (`#08070d`), dorado (`#cf9d4f`) para todo lo asociado a Xora/orden/luz, vino-violeta (`#6f2f52`) para Ape/caos/oscuridad, y un tono neutro para Tapiem/Dacama (fuerzas que no toman bando).
- El diagrama orbital de "Espacio y sus diez hijos" se genera con JavaScript (`js/orbit.js`) a partir de un array de datos — para editar nombres, epítetos o la frase corta de cada hijo, se edita ese archivo, no el HTML.
