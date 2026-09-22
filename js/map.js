/* =========================================================
   APEXORA — mapa interactivo
   Cada nación tiene un marcador sobre la imagen del mapa.
   Al pasar el cursor se ilumina su territorio aproximado;
   al tocarlo se abre su ficha y suena una nota sintetizada
   propia (Web Audio, sin archivos de audio externos).
   ========================================================= */

const APEXORA_NATIONS = {
  negatt: {
    name: "Negatt",
    eyebrow: "La Sombra Sabia",
    desc: "Consejos oscuros gobiernan bibliotecas ruinosas y palacios corruptos, donde se practican magia negra, pactos e inmortalidad.",
    link: "mundo.html#nacion-negatt",
  },
  luminarae: {
    name: "Luminarae Luxor",
    eyebrow: "Reino de Fe y Elevación",
    desc: "Teocracia jerárquica de torres flotantes y templos suspendidos, devota de Xora — y hogar secreto de la Orden de los Caballeros de Luxor.",
    link: "mundo.html#nacion-luminarae",
  },
  arboris: {
    name: "Arboris",
    eyebrow: "El bosque de las tribus",
    desc: "Hogar de tribus nómades como la Zudodh Ez, y de guerrilleros como Zarick, Tomah y Seah tras la caída de Sinfalía.",
    link: null,
  },
  boro: {
    name: "Boro",
    eyebrow: "El Refugio de los Restos",
    desc: "Post-industrial y fragmentado: mafias, clanes y resistencias sobreviven entre estructuras colapsadas y luces rotas.",
    link: "mundo.html#nacion-boro",
  },
  skaldrum: {
    name: "Reino de Skaldrum",
    eyebrow: "El Reino de Hierro y Honor",
    desc: "Feudalismo extremo de arquitectura grecorromana y armamento avanzado, devoto de Ape.",
    link: "mundo.html#nacion-skaldrum",
  },
  lumis: {
    name: "Lumis",
    eyebrow: "Ciudad de Sol y Cables",
    desc: "Tecnocracia neofuturista controlada por la IA Inargo. Humanos, androides y robots comparten sus torres solares.",
    link: "mundo.html#nacion-lumis",
  },
  markivton: {
    name: "Markivton",
    eyebrow: "Nación de piratas y anarquía",
    desc: "Puerto sin ley donde una herrería —'Desde el Polvo'— se convirtió en hogar para quienes no tenían ninguno.",
    link: "personajes.html#pj-markivton",
  },
  skaldrak: {
    name: "Tribus Skaldrak",
    eyebrow: "Las montañas del centro",
    desc: "Territorio montañoso todavía por explorar, frontera natural entre el oeste y Psybernia.",
    link: null,
  },
  umbra: {
    name: "Umbra",
    eyebrow: "El Imperio del Martillo",
    desc: "Dictadura absoluta de ciudades-fortaleza que cree en el dominio del más fuerte — y hogar del campamento Sopharum.",
    link: "mundo.html#nacion-umbra",
  },
  psybernia: {
    name: "Psybernia",
    eyebrow: "Lo que no debería existir",
    desc: "Un lugar macabro y secreto: se sabe que allí se experimenta en seres vivos. De ahí escapó Gobz Gobinson, y allí gobierna, con puño de hierro, la soberana Valeria.",
    link: "mundo.html#nacion-psybernia",
  },
  sinfalia: {
    name: "Sinfalía",
    eyebrow: "La alegría obligada",
    desc: "Once pueblos regidos por una economía de dones y la devoción a Ganore — hoy con Vasané-Nalú bajo el yugo de la Tribu Zzamua.",
    link: "mundo.html#nacion-sinfalia",
  },
  ostraca: {
    name: "Ostraca",
    eyebrow: "Kakistocracia de clones cíclicos",
    desc: "Un desierto de coral y sal donde los líderes olvidan sus propias reglas una y otra vez.",
    link: "mundo.html#nacion-ostraca",
  },
  krahn: {
    name: "El Presidio de Krahn",
    eyebrow: "Gerontocracia de silenciadores",
    desc: "Custodia el estrecho con anclas de antimagia, buscando frenar a Psybernia a cualquier costo.",
    link: "mundo.html#nacion-krahn",
  },
  pongi: {
    name: "Pongí",
    eyebrow: "Un lugar divertido",
    desc: "Frontera oriental con el Presidio de Krahn, entre Sylvaris y Disnjav — su fama de nación festiva la precede.",
    link: "mundo.html#nacion-pongi",
  },
  sylvaris: {
    name: "Sylvaris",
    eyebrow: "La Urdimbre",
    desc: "Necrocracia timocrática: ancestros incorpóreos dirigen una mente colmena vegetal obsesionada con la asimilación total.",
    link: "mundo.html#nacion-sylvaris",
  },
  disnjav: {
    name: "Disnjav",
    eyebrow: "Asociado a lo tóxico",
    desc: "El territorio más austral del este del continente — su nombre es sinónimo de veneno y contaminación.",
    link: "mundo.html#nacion-disnjav",
  },
};

/* ---------- audio: un sintetizador liviano por nación ---------- */

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(ctx, { freq, type = "sine", start = 0, dur = 0.25, peak = 0.18, glideTo = null }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  if (glideTo) {
    osc.frequency.linearRampToValueAtTime(glideTo, ctx.currentTime + start + dur);
  }
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.05);
}

function noiseBurst(ctx, { start = 0, dur = 0.2, peak = 0.12, filterFreq = 1200, filterType = "bandpass" }) {
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start(ctx.currentTime + start);
}

const NATION_SOUNDS = {
  negatt: (ctx) => { tone(ctx, { freq: 90, type: "sawtooth", dur: 0.9, peak: 0.1, glideTo: 55 }); noiseBurst(ctx, { start: 0.05, dur: 0.5, peak: 0.05, filterFreq: 300, filterType: "lowpass" }); },
  luminarae: (ctx) => { tone(ctx, { freq: 660, type: "sine", dur: 0.5, peak: 0.14 }); tone(ctx, { freq: 990, type: "sine", start: 0.12, dur: 0.5, peak: 0.12 }); },
  arboris: (ctx) => { noiseBurst(ctx, { dur: 0.3, peak: 0.14, filterFreq: 2200, filterType: "bandpass" }); noiseBurst(ctx, { start: 0.08, dur: 0.25, peak: 0.09, filterFreq: 3000 }); },
  boro: (ctx) => { tone(ctx, { freq: 140, type: "square", dur: 0.15, peak: 0.12 }); noiseBurst(ctx, { start: 0.03, dur: 0.15, peak: 0.1, filterFreq: 900 }); },
  skaldrum: (ctx) => { tone(ctx, { freq: 392, type: "triangle", dur: 0.18, peak: 0.14 }); tone(ctx, { freq: 523, type: "triangle", start: 0.15, dur: 0.3, peak: 0.14 }); },
  lumis: (ctx) => { tone(ctx, { freq: 880, type: "square", dur: 0.08, peak: 0.08 }); tone(ctx, { freq: 1320, type: "square", start: 0.1, dur: 0.1, peak: 0.08 }); },
  markivton: (ctx) => { tone(ctx, { freq: 300, type: "sawtooth", dur: 0.3, peak: 0.1, glideTo: 180 }); },
  skaldrak: (ctx) => { tone(ctx, { freq: 80, type: "sine", dur: 0.35, peak: 0.16 }); },
  umbra: (ctx) => { tone(ctx, { freq: 65, type: "square", dur: 0.4, peak: 0.16 }); noiseBurst(ctx, { dur: 0.1, peak: 0.08, filterFreq: 200, filterType: "lowpass" }); },
  psybernia: (ctx) => {
    tone(ctx, { freq: 130, type: "sawtooth", dur: 1.1, peak: 0.09, glideTo: 46 });
    noiseBurst(ctx, { start: 0.3, dur: 0.12, peak: 0.13, filterFreq: 3200, filterType: "highpass" });
    noiseBurst(ctx, { start: 0.55, dur: 0.08, peak: 0.1, filterFreq: 4200, filterType: "highpass" });
  },
  sinfalia: (ctx) => { tone(ctx, { freq: 587, type: "triangle", dur: 0.18, peak: 0.14 }); tone(ctx, { freq: 784, type: "triangle", start: 0.14, dur: 0.18, peak: 0.14 }); tone(ctx, { freq: 988, type: "triangle", start: 0.28, dur: 0.28, peak: 0.14 }); },
  ostraca: (ctx) => { tone(ctx, { freq: 500, type: "square", dur: 0.05, peak: 0.1 }); tone(ctx, { freq: 500, type: "square", start: 0.14, dur: 0.05, peak: 0.1 }); tone(ctx, { freq: 500, type: "square", start: 0.28, dur: 0.05, peak: 0.1 }); },
  krahn: (ctx) => { tone(ctx, { freq: 110, type: "square", dur: 0.12, peak: 0.1 }); noiseBurst(ctx, { start: 0.1, dur: 0.3, peak: 0.04, filterFreq: 500, filterType: "lowpass" }); },
  pongi: (ctx) => { tone(ctx, { freq: 523, type: "sine", dur: 0.14, peak: 0.14 }); tone(ctx, { freq: 659, type: "sine", start: 0.1, dur: 0.14, peak: 0.14 }); tone(ctx, { freq: 784, type: "sine", start: 0.2, dur: 0.22, peak: 0.14 }); },
  sylvaris: (ctx) => { tone(ctx, { freq: 220, type: "sine", dur: 0.9, peak: 0.1, glideTo: 260 }); },
  disnjav: (ctx) => { tone(ctx, { freq: 210, type: "sawtooth", dur: 0.6, peak: 0.08, glideTo: 150 }); noiseBurst(ctx, { start: 0.1, dur: 0.4, peak: 0.05, filterFreq: 1800, filterType: "bandpass" }); },
};

function playNationSound(key) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const recipe = NATION_SOUNDS[key];
  if (recipe) recipe(ctx);
}

/* ---------- interacción ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const map = document.getElementById("map-interactive");
  if (!map) return;

  const markers = map.querySelectorAll(".map-marker");
  const halos = map.querySelectorAll(".map-halo");
  const placeholder = document.getElementById("map-info-placeholder");
  const content = document.getElementById("map-info-content");
  const eyebrowEl = document.getElementById("map-info-eyebrow");
  const titleEl = document.getElementById("map-info-title");
  const descEl = document.getElementById("map-info-desc");
  const linkEl = document.getElementById("map-info-link");

  function haloFor(id) {
    return map.querySelector(`.map-halo[data-for="${id}"]`);
  }

  function setHalo(id, on) {
    const halo = haloFor(id);
    if (!halo) return;
    const align = map.querySelector(`#marker-${id}`)?.dataset.align;
    halo.classList.remove("umbra", "neutral");
    if (align === "umbra") halo.classList.add("umbra");
    if (align === "neutral") halo.classList.add("neutral");
    halo.classList.toggle("show", on);
  }

  markers.forEach((marker) => {
    const id = marker.id.replace("marker-", "");

    marker.addEventListener("mouseenter", () => setHalo(id, true));
    marker.addEventListener("mouseleave", () => { if (!marker.classList.contains("active")) setHalo(id, false); });
    marker.addEventListener("focus", () => setHalo(id, true));
    marker.addEventListener("blur", () => { if (!marker.classList.contains("active")) setHalo(id, false); });

    marker.addEventListener("click", () => {
      markers.forEach((m) => m.classList.remove("active"));
      halos.forEach((h) => h.classList.remove("show"));
      marker.classList.add("active");
      setHalo(id, true);

      const data = APEXORA_NATIONS[id];
      if (data && placeholder && content) {
        placeholder.hidden = true;
        content.hidden = false;
        eyebrowEl.textContent = data.eyebrow;
        titleEl.textContent = data.name;
        descEl.textContent = data.desc;
        if (data.link) {
          linkEl.style.display = "inline-block";
          linkEl.href = data.link;
        } else {
          linkEl.style.display = "none";
        }
      }

      playNationSound(marker.dataset.sound);
    });
  });
});
