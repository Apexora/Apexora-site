/* =========================================================
   APEXORA — tirador de dados
   Lógica del selector de dado, ventaja/desventaja,
   animación de tirada e historial.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const dieButtons = document.querySelectorAll(".die-btn");
  const advButtons = document.querySelectorAll(".adv-btn");
  const qtyInput = document.getElementById("qty");
  const modInput = document.getElementById("mod");
  const rollBtn = document.getElementById("roll-btn");
  const resultBox = document.getElementById("roll-result");
  const historyList = document.getElementById("roll-history");
  const clearBtn = document.getElementById("clear-history");
  const advField = document.getElementById("adv-field");

  if (!rollBtn || !resultBox) return; // esta página no tiene tirador

  const state = { die: 20, mode: null };

  function rollOne(sides) {
    return 1 + Math.floor(Math.random() * sides);
  }

  function setDie(die) {
    state.die = die;
    dieButtons.forEach((b) =>
      b.classList.toggle("active", Number(b.dataset.die) === die)
    );
    if (die !== 20) {
      state.mode = null;
      advButtons.forEach((b) => b.classList.remove("active"));
      if (advField) {
        advField.style.opacity = "0.35";
        advField.style.pointerEvents = "none";
      }
    } else if (advField) {
      advField.style.opacity = "1";
      advField.style.pointerEvents = "auto";
    }
  }

  dieButtons.forEach((btn) => {
    btn.addEventListener("click", () => setDie(Number(btn.dataset.die)));
  });

  advButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      if (state.mode === mode) {
        state.mode = null;
        advButtons.forEach((b) => b.classList.remove("active"));
      } else {
        state.mode = mode;
        advButtons.forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
        qtyInput.value = 1;
      }
    });
  });

  function step(input, delta, min, max) {
    let v = parseInt(input.value, 10);
    if (isNaN(v)) v = 0;
    v += delta;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    input.value = v;
  }

  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const modMinus = document.getElementById("mod-minus");
  const modPlus = document.getElementById("mod-plus");

  if (qtyMinus) qtyMinus.addEventListener("click", () => step(qtyInput, -1, 1, 20));
  if (qtyPlus) qtyPlus.addEventListener("click", () => step(qtyInput, 1, 1, 20));
  if (modMinus) modMinus.addEventListener("click", () => step(modInput, -1, -99, 99));
  if (modPlus) modPlus.addEventListener("click", () => step(modInput, 1, -99, 99));

  function modSuffix(mod) {
    if (!mod) return "";
    return mod > 0 ? ` + ${mod}` : ` − ${Math.abs(mod)}`;
  }

  function computeRoll() {
    const die = state.die;
    const qty = Math.max(1, Math.min(20, parseInt(qtyInput.value, 10) || 1));
    const mod = parseInt(modInput.value, 10) || 0;

    if (die === 20 && state.mode) {
      const a = rollOne(20);
      const b = rollOne(20);
      const kept = state.mode === "advantage" ? Math.max(a, b) : Math.min(a, b);
      const label = state.mode === "advantage" ? "Ventaja" : "Desventaja";
      return {
        die, qty: 1, mod, mode: state.mode,
        rolls: [a, b],
        kept,
        total: kept + mod,
        breakdown: `d20 (${label}): ${a}, ${b} → se queda con ${kept}${modSuffix(mod)}`,
        historyLabel: `d20 (${state.mode === "advantage" ? "ventaja" : "desventaja"})`,
      };
    }

    const rolls = [];
    for (let i = 0; i < qty; i++) rolls.push(rollOne(die));
    const sum = rolls.reduce((a, b) => a + b, 0);
    return {
      die, qty, mod, mode: null,
      rolls,
      kept: sum,
      total: sum + mod,
      breakdown: `${qty}d${die}: [${rolls.join(", ")}]${modSuffix(mod)}`,
      historyLabel: `${qty}d${die}`,
    };
  }

  function animateResult(roll) {
    resultBox.innerHTML =
      '<div class="roll-total rolling" id="roll-total-num">–</div>' +
      '<p class="roll-breakdown" id="roll-breakdown-text"></p>';
    const totalEl = document.getElementById("roll-total-num");
    const breakdownEl = document.getElementById("roll-breakdown-text");
    const flickerMax = Math.max(roll.die, 20);
    let ticks = 0;

    const interval = setInterval(() => {
      totalEl.textContent = rollOne(flickerMax);
      ticks++;
      if (ticks > 8) {
        clearInterval(interval);
        totalEl.textContent = roll.total;
        totalEl.classList.remove("rolling");
        breakdownEl.textContent = roll.breakdown;

        if (roll.die === 20 && roll.qty === 1 && !roll.mode) {
          if (roll.rolls[0] === 20) totalEl.classList.add("roll-crit");
          if (roll.rolls[0] === 1) totalEl.classList.add("roll-fail");
        }
      }
    }, 60);
  }

  function addHistoryEntry(roll) {
    const emptyMsg = historyList.querySelector(".hint");
    if (emptyMsg) emptyMsg.remove();

    const li = document.createElement("li");
    const modText = roll.mod ? (roll.mod > 0 ? ` + ${roll.mod}` : ` − ${Math.abs(roll.mod)}`) : "";
    li.innerHTML =
      `<span>${roll.historyLabel}${modText}</span><span class="rh-total">${roll.total}</span>`;
    historyList.prepend(li);

    while (historyList.children.length > 20) {
      historyList.removeChild(historyList.lastChild);
    }
  }

  function doRoll() {
    const roll = computeRoll();
    animateResult(roll);
    addHistoryEntry(roll);
  }

  rollBtn.addEventListener("click", doRoll);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      historyList.innerHTML =
        '<li class="hint" style="border:none;">Todavía no tiraste ningún dado.</li>';
    });
  }

  setDie(20);
});
