document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Aparición suave de tarjetas y bloques al entrar en pantalla.
  const revealSelector =
    ".nation-card, .char-card, .panel, .deity, .timeline-item, " +
    ".region-list li, .chip, .duality, .lore-table-scroll, .story-block > p";
  const revealEls = document.querySelectorAll(revealSelector);

  if (revealEls.length) {
    revealEls.forEach((el) => el.classList.add("reveal"));

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // En móvil, los índices laterales arrancan colapsados para no alargar el scroll.
  if (window.matchMedia("(max-width: 780px)").matches) {
    document.querySelectorAll("details.ix-group[open]").forEach((d) => d.removeAttribute("open"));
  }

  // Barra de progreso de lectura + botón "volver arriba"
  const progress = document.createElement("div");
  progress.className = "reading-progress";
  document.body.appendChild(progress);

  const backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Volver arriba");
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(backToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + "%";
    backToTop.classList.toggle("show", scrollTop > 600);
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();
});
