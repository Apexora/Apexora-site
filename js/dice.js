/* =========================================================
   APEXORA — tirador de dados
   Selector de dado, cantidad, modificador, ventaja/desventaja
   (disponible para cualquier dado), animación 3D e historial.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const dieButtons = document.querySelectorAll(".die-btn");
  const advButtons = document.querySelectorAll(".adv-btn");
  const qtyInput = document.getElementById("qty");
  const modInput = document.getElementById("mod");
  const rollBtn = document.getElementById("roll-btn");
  const resultBox = document.getElementById("roll-result");
  const resultText = document.getElementById("roll-result-text");
  const viewportEl = document.getElementById("dice-viewport");
  const historyList = document.getElementById("roll-history");
  const clearBtn = document.getElementById("clear-history");
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const modMinus = document.getElementById("mod-minus");
  const modPlus = document.getElementById("mod-plus");

  if (!rollBtn || !resultBox) return; // esta página no tiene tirador

  const state = { die: 20, mode: null };
  let viewport = null;
  let rolling = false;

  const HISTORY_KEY = "apexora-dice-history";
  let historyData = [];
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    if (Array.isArray(saved)) historyData = saved.slice(0, 20);
  } catch (e) {
    historyData = [];
  }

  function saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historyData));
    } catch (e) {
      /* localStorage puede fallar en modo privado; el historial sigue funcionando en memoria */
    }
  }

  function renderHistory() {
    if (!historyData.length) {
      historyList.innerHTML = '<li class="hint" style="border:none;">Todavía no tiraste ningún dado.</li>';
      return;
    }
    historyList.innerHTML = historyData
      .map((h) => `<li><span>${h.label}</span><span class="rh-total">${h.total}</span></li>`)
      .join("");
  }

  if (viewportEl && typeof THREE !== "undefined" && typeof APEXORA_DICE !== "undefined") {
    viewport = APEXORA_DICE.createViewport(viewportEl);
    if (viewport && viewport.ready) {
      viewport.setDice(20, 1);
    } else {
      viewport = null;
    }
  }
  if (!viewport && viewportEl) {
    viewportEl.classList.add("no-webgl");
  }

  function rollOne(sides) {
    return 1 + Math.floor(Math.random() * sides);
  }

  // Percentil: se resuelve como decenas (00-90) + unidades (0-9), como en mesa.
  function rollPercentileOne() {
    const tensDigit = Math.floor(Math.random() * 10); // 0..9 → 00..90
    const units = Math.floor(Math.random() * 10); // 0..9
    let value = tensDigit * 10 + units;
    if (value === 0) value = 100;
    return { tensDigit, units, value };
  }

  function rollDieValue(die) {
    if (die === 100) return rollPercentileOne().value;
    return rollOne(die);
  }

  function setDie(die) {
    state.die = die;
    dieButtons.forEach((b) => {
      const isActive = Number(b.dataset.die) === die;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    updateViewportForCurrentState();
  }

  function updateViewportForCurrentState() {
    if (!viewport) return;
    const count = state.mode ? 2 : Math.max(1, Math.min(4, parseInt(qtyInput.value, 10) || 1));
    if (state.die === 100) {
      viewport.setDice("d10tens", 2); // muestra decenas + unidades del primer d100
    } else {
      viewport.setDice(state.die, count);
    }
  }

  dieButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (rolling) return;
      setDie(Number(btn.dataset.die));
    });
  });

  advButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => {
      if (rolling) return;
      const mode = btn.dataset.mode;
      if (state.mode === mode) {
        state.mode = null;
        advButtons.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
        if (qtyInput) qtyInput.disabled = false;
      } else {
        state.mode = mode;
        advButtons.forEach((b) => {
          const isActive = b.dataset.mode === mode;
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        qtyInput.value = 1;
        if (qtyInput) qtyInput.disabled = true;
      }
      updateViewportForCurrentState();
    });
  });

  function step(input, delta, min, max) {
    let v = parseInt(input.value, 10);
    if (isNaN(v)) v = 0;
    v += delta;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    input.value = v;
    updateViewportForCurrentState();
  }

  if (qtyMinus) qtyMinus.addEventListener("click", () => { if (!rolling) step(qtyInput, -1, 1, 20); });
  if (qtyPlus) qtyPlus.addEventListener("click", () => { if (!rolling) step(qtyInput, 1, 1, 20); });
  if (modMinus) modMinus.addEventListener("click", () => { if (!rolling) step(modInput, -1, -99, 99); });
  if (modPlus) modPlus.addEventListener("click", () => { if (!rolling) step(modInput, 1, -99, 99); });

  function modSuffix(mod) {
    if (!mod) return "";
    return mod > 0 ? ` + ${mod}` : ` − ${Math.abs(mod)}`;
  }

  function computeRoll() {
    const die = state.die;
    const qty = state.mode ? 1 : Math.max(1, Math.min(20, parseInt(qtyInput.value, 10) || 1));
    const mod = parseInt(modInput.value, 10) || 0;
    const dieLabel = die === 100 ? "d100" : `d${die}`;

    if (state.mode) {
      const a = rollDieValue(die);
      const b = rollDieValue(die);
      const kept = state.mode === "advantage" ? Math.max(a, b) : Math.min(a, b);
      const label = state.mode === "advantage" ? "Ventaja" : "Desventaja";
      return {
        die, qty: 1, mod, mode: state.mode,
        rolls: [a, b],
        kept,
        total: kept + mod,
        breakdown: `${dieLabel} (${label}): ${a}, ${b} → se queda con ${kept}${modSuffix(mod)}`,
        historyLabel: `${dieLabel} (${state.mode === "advantage" ? "ventaja" : "desventaja"})`,
      };
    }

    const rolls = [];
    for (let i = 0; i < qty; i++) rolls.push(rollDieValue(die));
    const sum = rolls.reduce((a, b) => a + b, 0);
    return {
      die, qty, mod, mode: null,
      rolls,
      kept: sum,
      total: sum + mod,
      breakdown: `${qty}${dieLabel}: [${rolls.join(", ")}]${modSuffix(mod)}`,
      historyLabel: `${qty}${dieLabel}`,
    };
  }

  // Traduce el resultado numérico a los valores que hay que mostrar
  // en el visor 3D (hasta 4 dados, o el par decenas/unidades del d100).
  function visualValuesFor(roll) {
    if (roll.die === 100) {
      const v = roll.mode ? roll.kept : roll.rolls[0];
      const asVal = v === 100 ? 0 : v;
      const tensDigit = Math.floor(asVal / 10);
      const units = asVal % 10;
      return [tensDigit, units];
    }
    return roll.rolls.slice(0, 4);
  }

  function renderBreakdown(roll) {
    resultText.innerHTML =
      `<div class="roll-total" id="roll-total-num">${roll.total}</div>` +
      `<p class="roll-breakdown">${roll.breakdown}</p>`;
    const totalEl = document.getElementById("roll-total-num");
    if (roll.die === 20 && roll.qty === 1 && !roll.mode) {
      if (roll.rolls[0] === 20) totalEl.classList.add("roll-crit");
      if (roll.rolls[0] === 1) totalEl.classList.add("roll-fail");
    }
  }

  function addHistoryEntry(roll) {
    const modText = roll.mod ? (roll.mod > 0 ? ` + ${roll.mod}` : ` − ${Math.abs(roll.mod)}`) : "";
    historyData.unshift({ label: `${roll.historyLabel}${modText}`, total: roll.total, rolls: roll.rolls.join(", ") });
    historyData = historyData.slice(0, 20);
    saveHistory();
    renderHistory();
  }

  async function doRoll() {
    if (rolling) return;
    rolling = true;
    rollBtn.disabled = true;
    rollBtn.classList.add("is-rolling");

    const roll = computeRoll();

    if (viewport) {
      const shapeKind = roll.die === 100 ? "d10tens" : roll.die;
      const visualCount = roll.die === 100 ? 2 : Math.min(4, roll.mode ? 2 : roll.rolls.length);
      viewport.setDice(shapeKind, visualCount);
      resultText.innerHTML = '<p class="hint">Tirando…</p>';
      const values = visualValuesFor(roll);
      await viewport.rollAll(values.slice(0, visualCount), 1150);
    } else {
      resultText.innerHTML = '<p class="hint">Tirando…</p>';
      await new Promise((r) => setTimeout(r, 350));
    }

    renderBreakdown(roll);
    addHistoryEntry(roll);

    rolling = false;
    rollBtn.disabled = false;
    rollBtn.classList.remove("is-rolling");
  }

  rollBtn.addEventListener("click", doRoll);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      historyData = [];
      saveHistory();
      renderHistory();
    });
  }

  // Accesos rápidos de tirada
  const PRESETS = {
    attack: { die: 20, qty: 1, mod: null }, // conserva el modificador que ya haya cargado
    "dmg-1d6-3": { die: 6, qty: 1, mod: 3 },
    "dmg-2d6": { die: 6, qty: 2, mod: 0 },
    "dmg-1d8-2": { die: 8, qty: 1, mod: 2 },
    save: { die: 20, qty: 1, mod: null },
  };

  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (rolling) return;
      const preset = PRESETS[btn.dataset.preset];
      if (!preset) return;
      if (state.mode) {
        state.mode = null;
        advButtons.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
        qtyInput.disabled = false;
      }
      setDie(preset.die);
      qtyInput.value = preset.qty;
      if (preset.mod !== null) modInput.value = preset.mod;
      updateViewportForCurrentState();
      doRoll();
    });
  });

  renderHistory();
  setDie(20);
});
