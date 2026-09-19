/* =========================================================
   APEXORA — diagrama orbital
   Dibuja a Espacio en el centro y a sus diez hijos en órbita.
   Se usa tanto en la portada (modo decorativo) como en la
   página de Mitología (modo interactivo).
   ========================================================= */

const APEXORA_CHILDREN = [
  { name: "Ape",     epithet: "Entropía y Oscuridad", tone: "umbra",
    line: "Impulsa el caos y el declive: el final inevitable de todo." },
  { name: "Cumacur", epithet: "Infinidad", tone: "gold",
    line: "Lo ilimitado; el vasto espacio que se extiende eternamente." },
  { name: "Millot",  epithet: "Creación", tone: "gold",
    line: "Siembra la materia prima y las ideas para que florezcan." },
  { name: "Xora",    epithet: "Orden y Luz", tone: "gold",
    line: "Teje las leyes de la física y da forma a las primeras estrellas." },
  { name: "Ganore",  epithet: "La Nada", tone: "umbra",
    line: "El silencio absoluto entre las estrellas, el vacío primordial." },
  { name: "Tapiem",  epithet: "Gravedad", tone: "neutral",
    line: "El tejedor invisible que une el cosmos y evita que se desmorone." },
  { name: "Cabala",  epithet: "Finito", tone: "umbra",
    line: "El ancla que define los límites de sistemas y estrellas." },
  { name: "Jilper",  epithet: "Destrucción", tone: "umbra",
    line: "Elimina lo viejo y débil para hacer espacio a lo nuevo." },
  { name: "Kiprika", epithet: "El Todo", tone: "gold",
    line: "La suma de lo que es, fue y será; la conciencia cósmica." },
  { name: "Dacama",  epithet: "Tiempo", tone: "neutral",
    line: "El cronista universal: da principio y final a todas las cosas." },
];

function toneColor(tone) {
  if (tone === "gold") return { fill: "#cf9d4f", glow: "#e8c789" };
  if (tone === "umbra") return { fill: "#6f2f52", glow: "#a35a83" };
  return { fill: "#9d9686", glow: "#ece6d8" };
}

/**
 * Dibuja el diagrama orbital dentro del elemento con el id dado.
 * @param {string} containerId
 * @param {{interactive?: boolean, size?: number}} opts
 */
function buildOrbit(containerId, opts) {
  const options = opts || {};
  const interactive = options.interactive !== false;
  const size = options.size || 560;
  const container = document.getElementById(containerId);
  if (!container) return;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Espacio y sus diez hijos, dispuestos en órbita");

  // ring
  const ringGroup = document.createElementNS(svgNS, "g");
  ringGroup.setAttribute("class", "orbit-ring");
  const ring = document.createElementNS(svgNS, "circle");
  ring.setAttribute("cx", cx);
  ring.setAttribute("cy", cy);
  ring.setAttribute("r", radius);
  ring.setAttribute("fill", "none");
  ring.setAttribute("stroke", "rgba(236,230,216,0.16)");
  ring.setAttribute("stroke-dasharray", "1 10");
  ring.setAttribute("stroke-width", "1.5");
  ring.setAttribute("stroke-linecap", "round");
  ringGroup.appendChild(ring);
  svg.appendChild(ringGroup);

  // center glow
  const defs = document.createElementNS(svgNS, "defs");
  const grad = document.createElementNS(svgNS, "radialGradient");
  grad.setAttribute("id", containerId + "-glow");
  grad.innerHTML = `
    <stop offset="0%" stop-color="#ece6d8" stop-opacity="0.9"/>
    <stop offset="45%" stop-color="#cf9d4f" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#6f2f52" stop-opacity="0"/>
  `;
  defs.appendChild(grad);
  svg.appendChild(defs);

  const centerGlow = document.createElementNS(svgNS, "circle");
  centerGlow.setAttribute("cx", cx);
  centerGlow.setAttribute("cy", cy);
  centerGlow.setAttribute("r", size * 0.13);
  centerGlow.setAttribute("fill", `url(#${containerId}-glow)`);
  svg.appendChild(centerGlow);

  const centerCore = document.createElementNS(svgNS, "circle");
  centerCore.setAttribute("cx", cx);
  centerCore.setAttribute("cy", cy);
  centerCore.setAttribute("r", 5);
  centerCore.setAttribute("fill", "#ece6d8");
  svg.appendChild(centerCore);

  const centerLabel = document.createElementNS(svgNS, "text");
  centerLabel.setAttribute("x", cx);
  centerLabel.setAttribute("y", cy + size * 0.13 + 22);
  centerLabel.setAttribute("text-anchor", "middle");
  centerLabel.setAttribute("fill", "#ece6d8");
  centerLabel.setAttribute("font-size", size * 0.032);
  centerLabel.setAttribute("font-family", "Cinzel, serif");
  centerLabel.textContent = "Espacio";
  svg.appendChild(centerLabel);

  const caption = document.getElementById(containerId + "-caption");

  APEXORA_CHILDREN.forEach((child, i) => {
    const angle = (Math.PI * 2 * i) / APEXORA_CHILDREN.length - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    const colors = toneColor(child.tone);

    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("class", "orbit-node");
    g.setAttribute("tabindex", interactive ? "0" : "-1");

    const spoke = document.createElementNS(svgNS, "line");
    spoke.setAttribute("x1", cx);
    spoke.setAttribute("y1", cy);
    spoke.setAttribute("x2", x);
    spoke.setAttribute("y2", y);
    spoke.setAttribute("stroke", "rgba(236,230,216,0.08)");
    spoke.setAttribute("stroke-width", "1");
    g.appendChild(spoke);

    const halo = document.createElementNS(svgNS, "circle");
    halo.setAttribute("cx", x);
    halo.setAttribute("cy", y);
    halo.setAttribute("r", 13);
    halo.setAttribute("fill", colors.glow);
    halo.setAttribute("opacity", "0.16");
    g.appendChild(halo);

    const core = document.createElementNS(svgNS, "circle");
    core.setAttribute("class", "core");
    core.setAttribute("cx", x);
    core.setAttribute("cy", y);
    core.setAttribute("r", 6);
    core.setAttribute("fill", colors.fill);
    g.appendChild(core);

    if (size >= 400) {
      const label = document.createElementNS(svgNS, "text");
      const labelOffset = Math.cos(angle) >= 0 ? 16 : -16;
      label.setAttribute("x", x + labelOffset);
      label.setAttribute("y", y + 4);
      label.setAttribute("text-anchor", Math.cos(angle) >= 0 ? "start" : "end");
      label.setAttribute("fill", "#c9c3b4");
      label.setAttribute("font-size", size * 0.026);
      label.textContent = child.name;
      g.appendChild(label);
    }

    if (interactive && caption) {
      const show = () => {
        container.querySelectorAll(".orbit-node").forEach((n) => n.classList.remove("active"));
        g.classList.add("active");
        caption.innerHTML = `
          <div class="name">${child.name}</div>
          <div class="epithet">${child.epithet}</div>
          <p class="hint" style="margin-top:0.6rem;">${child.line}</p>
        `;
      };
      g.addEventListener("mouseenter", show);
      g.addEventListener("focus", show);
      g.addEventListener("click", () => {
        const target = document.getElementById("deidad-" + child.name.toLowerCase());
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    svg.appendChild(g);
  });

  container.appendChild(svg);
}
