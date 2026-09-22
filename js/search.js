/* =========================================================
   APEXORA — buscador global (Ctrl+K / Cmd+K)
   Filtra APEXORA_SEARCH_INDEX (js/search-data.js) por texto,
   con navegación por teclado y salto directo a la sección.
   ========================================================= */

function normalizeSearch(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // saca acentos para buscar sin tilde
}

document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("search-trigger");
  const overlay = document.getElementById("search-overlay");
  const input = document.getElementById("search-input");
  const resultsEl = document.getElementById("search-results");
  const emptyEl = document.getElementById("search-empty");
  if (!trigger || !overlay || typeof APEXORA_SEARCH_INDEX === "undefined") return;

  const currentPage = location.pathname.split("/").pop() || "index.html";
  let activeIndex = -1;
  let currentResults = [];

  function open() {
    overlay.hidden = false;
    input.value = "";
    renderResults("");
    document.body.style.overflow = "hidden";
    setTimeout(() => input.focus(), 10);
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    trigger.focus();
  }

  function scoreEntry(entry, needle) {
    const title = normalizeSearch(entry.title);
    const sub = normalizeSearch(entry.sub || "");
    const cat = normalizeSearch(entry.category || "");
    if (title.startsWith(needle)) return 3;
    if (title.includes(needle)) return 2;
    if (sub.includes(needle) || cat.includes(needle)) return 1;
    return 0;
  }

  function renderResults(query) {
    const needle = normalizeSearch(query.trim());
    let list;
    if (!needle) {
      // sin texto: mostrar accesos rápidos a las páginas
      list = APEXORA_SEARCH_INDEX.filter((e) => e.category === "Página");
    } else {
      list = APEXORA_SEARCH_INDEX.map((e) => ({ e, score: scoreEntry(e, needle) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 30)
        .map((x) => x.e);
    }

    currentResults = list;
    activeIndex = list.length ? 0 : -1;
    emptyEl.hidden = list.length !== 0;
    resultsEl.innerHTML = list
      .map((e, i) => {
        const href = e.anchor ? `${e.page}#${e.anchor}` : e.page;
        const isCurrent = e.page === currentPage;
        return `<li>
          <a href="${href}" class="search-result${i === 0 ? " is-active" : ""}" data-idx="${i}">
            <span class="sr-title">${e.title}</span>
            <span class="sr-meta"><span class="sr-cat">${e.category}</span>${e.sub ? ` · ${e.sub}` : ""}${isCurrent ? " · esta página" : ""}</span>
          </a>
        </li>`;
      })
      .join("");
  }

  function setActive(idx) {
    const items = resultsEl.querySelectorAll(".search-result");
    items.forEach((it) => it.classList.remove("is-active"));
    if (idx >= 0 && items[idx]) {
      items[idx].classList.add("is-active");
      items[idx].scrollIntoView({ block: "nearest" });
    }
    activeIndex = idx;
  }

  function goTo(entry) {
    const href = entry.anchor ? `${entry.page}#${entry.anchor}` : entry.page;
    close();
    if (entry.page === currentPage) {
      // navegación dentro de la misma página: scroll suave sin recargar
      if (entry.anchor) {
        const target = document.getElementById(entry.anchor);
        if (target) {
          history.pushState(null, "", `#${entry.anchor}`);
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
    }
    window.location.href = href;
  }

  trigger.addEventListener("click", open);

  document.addEventListener("keydown", (e) => {
    const isK = e.key === "k" || e.key === "K";
    if ((e.ctrlKey || e.metaKey) && isK) {
      e.preventDefault();
      overlay.hidden ? open() : close();
    } else if (e.key === "Escape" && !overlay.hidden) {
      close();
    }
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  input.addEventListener("input", () => renderResults(input.value));

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (currentResults.length) setActive(Math.min(activeIndex + 1, currentResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentResults.length) setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && currentResults[activeIndex]) goTo(currentResults[activeIndex]);
    }
  });

  resultsEl.addEventListener("click", (e) => {
    const link = e.target.closest(".search-result");
    if (!link) return;
    e.preventDefault();
    const idx = parseInt(link.dataset.idx, 10);
    if (currentResults[idx]) goTo(currentResults[idx]);
  });

  resultsEl.addEventListener("mouseover", (e) => {
    const link = e.target.closest(".search-result");
    if (!link) return;
    setActive(parseInt(link.dataset.idx, 10));
  });
});
