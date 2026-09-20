/* =========================================================
   APEXORA — cableado del mapa interactivo
   Conecta el motor 3D (mapa3d.js) con el panel de información
   y el sonido de cada nación.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("map3d-viewport");
  if (!viewport) return;

  const backdrop = document.getElementById("map-info-backdrop");
  const closeBtn = document.getElementById("map-info-close");
  const titleEl = document.getElementById("map-info-title");
  const taglineEl = document.getElementById("map-info-tagline");
  const factsEl = document.getElementById("map-info-facts");
  const descEl = document.getElementById("map-info-desc");
  const linkEl = document.getElementById("map-info-link");

  let engine = null;

  function openPanel(nation) {
    titleEl.textContent = nation.name;
    taglineEl.textContent = nation.tagline || "";
    descEl.textContent = nation.desc || "";

    factsEl.innerHTML = "";
    (nation.facts || []).forEach(([k, v]) => {
      const dt = document.createElement("dt");
      dt.textContent = k;
      const dd = document.createElement("dd");
      dd.textContent = v;
      factsEl.appendChild(dt);
      factsEl.appendChild(dd);
    });

    if (nation.link) {
      linkEl.href = nation.link;
      linkEl.style.display = "";
    } else {
      linkEl.style.display = "none";
    }

    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-open"));

    if (window.APEXORA_SOUNDS) APEXORA_SOUNDS.play(nation.sound);
  }

  function closePanel() {
    backdrop.classList.remove("is-open");
    window.setTimeout(() => { backdrop.hidden = true; }, 250);
    if (engine) engine.resetView();
  }

  if (closeBtn) closeBtn.addEventListener("click", closePanel);
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closePanel();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop && !backdrop.hidden) closePanel();
  });

  if (typeof THREE === "undefined" || typeof APEXORA_MAP3D === "undefined" || typeof APEXORA_NATIONS === "undefined") {
    viewport.classList.add("no-webgl");
    return;
  }

  engine = APEXORA_MAP3D.init(viewport, {
    nations: APEXORA_NATIONS,
    imageUrl: "assets/mapa-apexora.jpg",
    onSelect: openPanel,
    onHover: (nation) => {
      if (nation && window.APEXORA_SOUNDS) APEXORA_SOUNDS.play(nation.sound);
    },
  });

  if (!engine || !engine.ready) {
    viewport.classList.add("no-webgl");
  }
});
