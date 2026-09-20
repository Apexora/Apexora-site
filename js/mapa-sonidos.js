/* =========================================================
   APEXORA — sonidos del mapa
   Cada nación tiene un sonido corto y característico,
   generado en el momento con Web Audio (sin archivos).
   ========================================================= */

const APEXORA_SOUNDS = (function () {
  let ctx = null;
  let lastPlayed = {};

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(t0, freq, { type = "sine", dur = 0.3, gain = 0.22, attack = 0.006, end } = {}) {
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (end) osc.frequency.exponentialRampToValueAtTime(Math.max(end, 1), t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
    return osc;
  }

  function noiseBurst(t0, { dur = 0.18, gain = 0.25, filterType = "bandpass", freq = 900, freqEnd, Q = 1.2 } = {}) {
    const c = getCtx();
    if (!c) return;
    const bufferSize = Math.max(1, Math.floor(c.sampleRate * dur));
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, t0);
    if (freqEnd) filter.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), t0 + dur);
    filter.Q.setValueAtTime(Q, t0);
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filter).connect(g).connect(c.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  function bell(t0, freqs, dur) {
    freqs.forEach((f, i) => tone(t0, f, { type: "sine", dur: dur - i * 0.02, gain: 0.16 - i * 0.03, attack: 0.004 }));
  }

  const RECIPES = {
    // Luminarae: campanita brillante, dos armónicos.
    luminarae: (t) => bell(t, [1046, 1568], 0.7),

    // Negatt: zumbido grave y desafinado.
    negatt: (t) => {
      tone(t, 92, { type: "sawtooth", dur: 0.6, gain: 0.14 });
      tone(t, 97, { type: "sawtooth", dur: 0.6, gain: 0.12 });
    },

    // Arboris: ráfaga de "viento entre hojas".
    arboris: (t) => noiseBurst(t, { dur: 0.5, gain: 0.18, filterType: "bandpass", freq: 1400, freqEnd: 500, Q: 0.8 }),

    // Tribus Skaldrak: cuerno lejano.
    skaldrak: (t) => tone(t, 155, { type: "sawtooth", dur: 0.55, gain: 0.16, attack: 0.06 }),

    // Boro: golpe metálico industrial.
    boro: (t) => {
      noiseBurst(t, { dur: 0.08, gain: 0.22, filterType: "highpass", freq: 1500 });
      tone(t, 320, { type: "square", dur: 0.22, gain: 0.1 });
    },

    // Skaldrum: choque de espadas.
    skaldrum: (t) => {
      noiseBurst(t, { dur: 0.07, gain: 0.24, filterType: "bandpass", freq: 3200, Q: 3 });
      noiseBurst(t + 0.09, { dur: 0.09, gain: 0.2, filterType: "bandpass", freq: 2600, Q: 3 });
    },

    // Lumis: blip electrónico ascendente.
    lumis: (t) => tone(t, 420, { type: "square", dur: 0.16, gain: 0.14, end: 1100 }),

    // Markivton: campana de barco.
    markivton: (t) => bell(t, [660, 990], 0.5),

    // Umbra: golpe de tambor pesado.
    umbra: (t) => tone(t, 150, { type: "sine", dur: 0.35, gain: 0.28, end: 42 }),

    // Psybernia: drone glitcheado e inquietante.
    psybernia: (t) => {
      tone(t, 180, { type: "sawtooth", dur: 0.55, gain: 0.12, end: 140 });
      tone(t + 0.1, 210, { type: "square", dur: 0.06, gain: 0.08 });
      tone(t + 0.28, 190, { type: "square", dur: 0.05, gain: 0.07 });
    },

    // Sinfalía: arpegio mayor alegre.
    sinfalia: (t) => {
      tone(t, 523.25, { type: "triangle", dur: 0.18, gain: 0.16 });
      tone(t + 0.08, 659.25, { type: "triangle", dur: 0.18, gain: 0.16 });
      tone(t + 0.16, 783.99, { type: "triangle", dur: 0.28, gain: 0.18 });
    },

    // Ostraca: eco clonado, repetido y decreciente.
    ostraca: (t) => {
      tone(t, 700, { type: "sine", dur: 0.12, gain: 0.18 });
      tone(t + 0.11, 700, { type: "sine", dur: 0.12, gain: 0.12 });
      tone(t + 0.22, 700, { type: "sine", dur: 0.12, gain: 0.07 });
    },

    // Presidio de Krahn: "shh" sordo.
    krahn: (t) => noiseBurst(t, { dur: 0.35, gain: 0.16, filterType: "lowpass", freq: 700, Q: 0.6 }),

    // Pongí: marimba juguetona.
    pongi: (t) => {
      tone(t, 523.25, { type: "triangle", dur: 0.1, gain: 0.16 });
      tone(t + 0.07, 659.25, { type: "triangle", dur: 0.1, gain: 0.16 });
      tone(t + 0.14, 880, { type: "triangle", dur: 0.16, gain: 0.16 });
    },

    // Sylvaris: zumbido de colmena.
    sylvaris: (t) => {
      const c = getCtx();
      if (!c) return;
      const osc = c.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, t);
      const lfo = c.createOscillator();
      lfo.frequency.setValueAtTime(28, t);
      const lfoGain = c.createGain();
      lfoGain.gain.setValueAtTime(0.09, t);
      const g = c.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.14, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      lfo.connect(lfoGain).connect(g.gain);
      osc.connect(g).connect(c.destination);
      osc.start(t); lfo.start(t);
      osc.stop(t + 0.55); lfo.stop(t + 0.55);
    },

    // Disnjav: burbujeo tóxico.
    disnjav: (t) => {
      [0, 0.09, 0.17, 0.24].forEach((d, i) => {
        tone(t + d, 220 + Math.random() * 260, { type: "sine", dur: 0.1, gain: 0.1, end: 90 });
      });
    },
  };

  function play(key) {
    const c = getCtx();
    if (!c || !RECIPES[key]) return;
    const now = performance.now();
    if (lastPlayed[key] && now - lastPlayed[key] < 220) return; // evita spam al pasar el mouse rápido
    lastPlayed[key] = now;
    try {
      RECIPES[key](c.currentTime + 0.01);
    } catch (e) {
      /* silencioso: el audio nunca debe romper la interacción */
    }
  }

  return { play, getCtx };
})();
