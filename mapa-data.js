/* =========================================================
   APEXORA — datos del mapa interactivo
   Un punto de referencia (x%, y% sobre la imagen del mapa)
   por nación, más la info que se muestra al tocarla.
   ========================================================= */

const APEXORA_NATIONS = [
  {
    id: "negatt", name: "Negatt", tagline: "La Sombra Sabia",
    x: 25.7, y: 41.8, color: "#7a5a9e",
    facts: [["Gobierno", "Consejos oscuros"], ["Religión", "Magia negra, pactos, inmortalidad"]],
    desc: "Bibliotecas ruinosas y palacios corruptos, bajo el liderazgo de Raulo Casa III.",
    link: "mundo.html#nacion-negatt", sound: "negatt",
  },
  {
    id: "arboris", name: "Arboris", tagline: "El Bosque",
    x: 28.2, y: 48.7, color: "#5fb86a",
    facts: [["Habitantes", "Tribus nómades, incluida Zudodh Ez"]],
    desc: "El corazón verde del oeste de Apexora, hogar de las tribus y sus tradiciones.",
    link: "historias.html#linaje-zarick", sound: "arboris",
  },
  {
    id: "luminarae", name: "Luminarae Luxor", tagline: "Reino de Fe y Elevación",
    x: 38.2, y: 31.5, color: "#e8d15a",
    facts: [["Gobierno", "Teocracia jerárquica"], ["Religión", "Xora, diosa de la pureza espiritual"]],
    desc: "Torres flotantes y templos suspendidos, gobernados por la Reina Luminara IV.",
    link: "mundo.html#nacion-luminarae", sound: "luminarae",
  },
  {
    id: "skaldrak", name: "Tribus Skaldrak", tagline: "Por explorar",
    x: 42.5, y: 41.5, color: "#b9b3a6",
    facts: [],
    desc: "Las tribus de las montañas homónimas — su historia todavía no se ha contado.",
    link: "", sound: "skaldrak",
  },
  {
    id: "boro", name: "Boro", tagline: "El Refugio de los Restos",
    x: 25.8, y: 59.2, color: "#c07fc2",
    facts: [["Gobierno", "Fragmentado — mafias, clanes y resistencias"], ["Lugar de interés", "Tharnok, un templo en ruinas"]],
    desc: "Post-industrial, oscuro y contaminado; el refugio de quienes no encajan en ningún otro lado.",
    link: "mundo.html#nacion-boro", sound: "boro",
  },
  {
    id: "skaldrum", name: "Reino de Skaldrum", tagline: "El Reino de Hierro y Honor",
    x: 31.2, y: 61.3, color: "#e8b4ad",
    facts: [["Gobierno", "Feudalismo extremo"], ["Religión", "Ape, dios del dominio oscuro"]],
    desc: "Arquitectura grecorromana con tecnología rústica, bajo el inmortal Oci.",
    link: "mundo.html#nacion-skaldrum", sound: "skaldrum",
  },
  {
    id: "lumis", name: "Lumis", tagline: "Ciudad de Sol y Cables",
    x: 25.9, y: 69.6, color: "#5ec9c2",
    facts: [["Gobierno", "Tecnocracia — la IA Inargo"]],
    desc: "Torres solares, drones y redes de datos; ciencia y razón por sobre todo.",
    link: "mundo.html#nacion-lumis", sound: "lumis",
  },
  {
    id: "markivton", name: "Markivton", tagline: "Nación de piratas y anarquía",
    x: 31.0, y: 72.8, color: "#3f9c92",
    facts: [],
    desc: "Hogar de la familia Dust-Clement — sin ley formal, pero con su propio código.",
    link: "personajes.html#markivton", sound: "markivton",
  },
  {
    id: "umbra", name: "Umbra", tagline: "El Imperio del Martillo",
    x: 41.4, y: 68.7, color: "#c65454",
    facts: [["Gobierno", "Dictadura absoluta"], ["Líderes", "Dictador Puj, General Reggina Markvon"]],
    desc: "Ciudades-fortaleza y campos devastados; cree en el dominio del más fuerte.",
    link: "mundo.html#nacion-umbra", sound: "umbra",
  },
  {
    id: "psybernia", name: "Psybernia", tagline: "El Horror Bajo el Silencio",
    x: 54.4, y: 51.7, color: "#c9a876",
    facts: [["Gobierno", "Autocracia hermética bajo Valeria"], ["Reputación", "Macabra y secreta — experimentos con seres vivos"]],
    desc: "Nadie entra ni sale sin permiso de la Soberana. Lo poco que se sabe basta para no querer saber más.",
    link: "mundo.html#nacion-psybernia", sound: "psybernia",
  },
  {
    id: "sinfalia", name: "Sinfalía", tagline: "La Nación de la Alegría Obligada",
    x: 66.8, y: 38.1, color: "#7fd8d8",
    facts: [["Religión", "Ganore, dios de la Nada"], ["Economía", "Sin dinero — todo se rige por dones"]],
    desc: "La felicidad como ley no escrita. Once pueblos, tres facciones, un asteroide sagrado.",
    link: "mundo.html#nacion-sinfalia", sound: "sinfalia",
  },
  {
    id: "ostraca", name: "Ostraca", tagline: "Kakistocracia de clones cíclicos",
    x: 68.3, y: 29.3, color: "#8f7fd8",
    facts: [],
    desc: "Un desierto de coral y sal gobernado por una incompetencia sistémica.",
    link: "mundo.html#nacion-ostraca", sound: "ostraca",
  },
  {
    id: "krahn", name: "El Presidio de Krahn", tagline: "Gerontocracia de silenciadores",
    x: 60.7, y: 51.4, color: "#d9945a",
    facts: [],
    desc: "Custodia el estrecho con anclas de antimagia, vigilando a Psybernia sin descanso.",
    link: "mundo.html#nacion-krahn", sound: "krahn",
  },
  {
    id: "pongi", name: "Pongí", tagline: "El Recreo de Apexora",
    x: 68.5, y: 58.4, color: "#d99ad9",
    facts: [["Reputación", "Sencillamente, un lugar divertido"]],
    desc: "Ferias, juegos y una reputación de anfitrión — mientras el resto del continente arde.",
    link: "mundo.html#nacion-pongi", sound: "pongi",
  },
  {
    id: "sylvaris", name: "La Urdimbre de Sylvaris", tagline: "Necrocracia de mente colmena",
    x: 75.8, y: 56.4, color: "#5ccfa0",
    facts: [],
    desc: "Ancestros incorpóreos dirigen una mente colmena vegetal, obsesionada con la asimilación.",
    link: "mundo.html#nacion-sylvaris", sound: "sylvaris",
  },
  {
    id: "disnjav", name: "Disnjav", tagline: "La Tierra Enferma",
    x: 70.1, y: 74.6, color: "#d99a4a",
    facts: [["Reputación", "Asociada a lo tóxico"]],
    desc: "Aire, agua o tierra — nadie sabe con certeza qué es lo que envenena Disnjav.",
    link: "mundo.html#nacion-disnjav", sound: "disnjav",
  },
];
