/* =========================================================
   APEXORA — índice de búsqueda global
   Cada entrada: { title, category, page, anchor, sub }
   "sub" es una línea corta que ayuda a encontrarla y se
   muestra como subtítulo en los resultados.
   ========================================================= */

const APEXORA_SEARCH_INDEX = [
  // --- Páginas ---
  { title: "Inicio", category: "Página", page: "index.html", anchor: "", sub: "Portada de Apexora" },
  { title: "Mitología y Teogonía", category: "Página", page: "mitologia.html", anchor: "", sub: "Espacio y sus diez hijos" },
  { title: "El Mundo", category: "Página", page: "mundo.html", anchor: "", sub: "Naciones, órdenes, razas y temas" },
  { title: "Mapa de Apexora", category: "Página", page: "mapa.html", anchor: "", sub: "Mapa interactivo del continente" },
  { title: "Línea de Tiempo", category: "Página", page: "linea-tiempo.html", anchor: "", sub: "Eventos clave, año 0 al 1012" },
  { title: "Personajes", category: "Página", page: "personajes.html", anchor: "", sub: "PJ y PNJ por nación" },
  { title: "Historias", category: "Página", page: "historias.html", anchor: "", sub: "Relatos y campañas" },
  { title: "Tirar Dados", category: "Página", page: "dados.html", anchor: "", sub: "Tirador de dados estilo D&D" },

  // --- Mitología: Espacio y los diez hijos ---
  { title: "Espacio", category: "Deidad", page: "mitologia.html", anchor: "espacio", sub: "El Padre Primordial" },
  { title: "Ape", category: "Deidad", page: "mitologia.html", anchor: "deidad-ape", sub: "Entropía y Oscuridad" },
  { title: "Xora", category: "Deidad", page: "mitologia.html", anchor: "deidad-xora", sub: "Orden y Luz" },
  { title: "Millot", category: "Deidad", page: "mitologia.html", anchor: "deidad-millot", sub: "Creación" },
  { title: "Jilper", category: "Deidad", page: "mitologia.html", anchor: "deidad-jilper", sub: "Destrucción" },
  { title: "Cumacur", category: "Deidad", page: "mitologia.html", anchor: "deidad-cumacur", sub: "Infinidad" },
  { title: "Cabala", category: "Deidad", page: "mitologia.html", anchor: "deidad-cabala", sub: "Finito" },
  { title: "Ganore", category: "Deidad", page: "mitologia.html", anchor: "deidad-ganore", sub: "La Nada — el Ganorismo" },
  { title: "Kiprika", category: "Deidad", page: "mitologia.html", anchor: "deidad-kiprika", sub: "El Todo" },
  { title: "Tapiem", category: "Deidad", page: "mitologia.html", anchor: "deidad-tapiem", sub: "Gravedad" },
  { title: "Dacama", category: "Deidad", page: "mitologia.html", anchor: "deidad-dacama", sub: "Tiempo" },

  // --- Naciones ---
  { title: "Boro", category: "Nación", page: "mundo.html", anchor: "nacion-boro", sub: "El Refugio de los Restos" },
  { title: "Tharnok", category: "Lugar", page: "mundo.html", anchor: "tharnok", sub: "Templo en ruinas, Boro" },
  { title: "Umbra", category: "Nación", page: "mundo.html", anchor: "nacion-umbra", sub: "El Imperio del Martillo" },
  { title: "Reino de Skaldrum", category: "Nación", page: "mundo.html", anchor: "nacion-skaldrum", sub: "El Reino de Hierro y Honor" },
  { title: "Luminarae Luxor", category: "Nación", page: "mundo.html", anchor: "nacion-luminarae", sub: "Reino de Fe y Elevación" },
  { title: "Negatt", category: "Nación", page: "mundo.html", anchor: "nacion-negatt", sub: "La Sombra Sabia" },
  { title: "Lumis", category: "Nación", page: "mundo.html", anchor: "nacion-lumis", sub: "Ciudad de Sol y Cables" },
  { title: "Sinfalía", category: "Nación", page: "mundo.html", anchor: "nacion-sinfalia", sub: "La Nación de la Alegría Obligada" },
  { title: "El Presidio de Krahn", category: "Nación", page: "mundo.html", anchor: "nacion-krahn", sub: "Gerontocracia de silenciadores" },
  { title: "La Urdimbre de Sylvaris", category: "Nación", page: "mundo.html", anchor: "nacion-sylvaris", sub: "Necrocracia de mente colmena" },
  { title: "Ostraca", category: "Nación", page: "mundo.html", anchor: "nacion-ostraca", sub: "Kakistocracia de clones cíclicos" },
  { title: "Psybernia", category: "Nación", page: "mundo.html", anchor: "nacion-psybernia", sub: "Macabra y secreta" },
  { title: "Pongí", category: "Nación", page: "mundo.html", anchor: "nacion-pongi", sub: "Un lugar divertido" },
  { title: "Disnjav", category: "Nación", page: "mundo.html", anchor: "nacion-disnjav", sub: "Asociada a lo tóxico" },
  { title: "La Orden de los Caballeros de Luxor", category: "Facción", page: "mundo.html", anchor: "orden-ocl", sub: "OCL — Operación Negro" },
  { title: "Las Bestias Dormidas", category: "Tema", page: "mundo.html", anchor: "bestias", sub: "Entidades primordiales" },
  { title: "Razas del Mundo", category: "Tema", page: "mundo.html", anchor: "razas", sub: "Humanos, SkaNuj, orcos y más" },
  { title: "Arboris", category: "Nación", page: "mundo.html", anchor: "nacion-arboris", sub: "El Bosque" },
  { title: "Tribus Skaldrak", category: "Nación", page: "mundo.html", anchor: "nacion-skaldrak", sub: "Por explorar" },
  { title: "Markivton", category: "Nación", page: "mundo.html", anchor: "nacion-markivton", sub: "Nación de piratas y anarquía" },
  { title: "Facciones de Boro", category: "Facción", page: "mundo.html", anchor: "boro-facciones", sub: "Girax, Torzh, Sha'lok y Nokvar" },
  { title: "Orígenes de Sinfalía", category: "Tema", page: "mundo.html", anchor: "sinfalia-origenes", sub: "La ostra de la paz, Consejo de los Jóvenes, Vizlum" },
  { title: "Facciones de Sinfalía", category: "Facción", page: "mundo.html", anchor: "sinfalia-facciones", sub: "Moradores, Sobrios y Ganoristas" },
  { title: "Magia y Tecnología", category: "Tema", page: "mundo.html", anchor: "poderes", sub: "Magia natural, oscura, divina y tecnología" },
  { title: "INARGO y los Lutech", category: "Tema", page: "mundo.html", anchor: "inargo", sub: "Inteligencia artificial y humanos modificados" },
  { title: "Chunchunmaru", category: "Tema", page: "mundo.html", anchor: "chunchunmaru", sub: "Misterio abierto — androide que crece" },

  // --- Personajes Jugadores ---
  { title: "Zarick", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-zarick", sub: "Umbra — Hijo de la Sombra" },
  { title: "Bane Ironhand", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-bane", sub: "Lumis" },
  { title: "Karim Balteus", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-karim", sub: "Skaldrum — El Bailarín del Estoque" },
  { title: "Vina Miceus", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-vina", sub: "Skaldrum" },
  { title: "Seah de Pato", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-seah", sub: "Arboris" },
  { title: "Tomah de la Luz de Xora", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-tomah", sub: "Luminarae Luxor" },
  { title: "Andreas Light", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-andreas", sub: "Luxor — alias León Skyrider, OCL" },
  { title: "Pin Kuku", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-pin", sub: "Origen desconocido" },
  { title: "Gobz Gobinson", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-gobz", sub: "Sinfalía — el pequeño genio" },
  { title: "Valmey Sialí", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-valmey", sub: "Sinfalía" },
  { title: "Seilá Anamé", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-seila", sub: "Sinfalía" },
  { title: "Lael Anamé", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-lael", sub: "Sinfalía" },
  { title: "Laki Unmei", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-laki", sub: "Markivton — el hijo predestinado" },
  { title: "Zene", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-zene", sub: "Psybernia" },
  { title: "Caelum", category: "Personaje (PJ)", page: "personajes.html", anchor: "personaje-caelum", sub: "Negatt — Los Ocho de Negatt" },

  // --- Personajes No Jugadores ---
  { title: "Mit Caleus", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-caleus", sub: "Umbra — líder de Sopharum" },
  { title: "Robert Dust", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-robert", sub: "Markivton — herrero" },
  { title: "Martine \"Martina\" Clement", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-martina", sub: "Luminarae Luxor — precognitiva" },
  { title: "Rose", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-rose", sub: "Luxor — OCL" },
  { title: "Valeria", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-valeria", sub: "Psybernia — soberana" },
  { title: "ZX-51", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-zx51", sub: "Psybernia" },
  { title: "Los Ocho de Negatt", category: "Personaje (PNJ)", page: "personajes.html", anchor: "pnj-negatt", sub: "Alnasi, Azalange, Aldebaran, Fudo, Themis, Niro, Daisuke" },
  { title: "Fragua", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-fragua", sub: "El transportista" },
  { title: "Puj", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-puj", sub: "Umbra — dictador" },
  { title: "Malakar", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-malakar", sub: "Umbra — antiguo comandante" },
  { title: "Oci", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-oci", sub: "Skaldrum — el inmortal" },
  { title: "Salín", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-salin", sub: "Sinfalía — juez de Inasuno" },
  { title: "Visú", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-visu", sub: "Sinfalía — asistente de Valmey" },
  { title: "Chunchunmaru", category: "Personaje (PNJ)", page: "personajes.html", anchor: "personaje-chunchunmaru", sub: "El androide que crece" },

  // --- Linaje de Zarick (en Historias) ---
  { title: "El Linaje de Zarick", category: "Historia", page: "historias.html", anchor: "linaje-zarick", sub: "Evelyn, Zodd, Heiss y la tribu Zudodh Ez" },

  // --- Historias / Relatos ---
  { title: "Destinos Entrelazados", category: "Historia", page: "historias.html", anchor: "destinos", sub: "Cómo se conocieron Bane y Zarick" },
  { title: "El Juicio de Inasuno", category: "Historia", page: "historias.html", anchor: "juicio-inasuno", sub: "Lael, Gobz, Valmey y el nuevo régimen de Sinfalía" },
  { title: "I — El campamento de Caleus", category: "Historia", page: "historias.html", anchor: "guardianes-1", sub: "Guardianes de Apexora" },
  { title: "II — Orígenes", category: "Historia", page: "historias.html", anchor: "guardianes-2", sub: "Guardianes de Apexora" },
  { title: "III — Torneo de Umbra", category: "Historia", page: "historias.html", anchor: "guardianes-3", sub: "Guardianes de Apexora" },
  { title: "La Visión de la Nave Psybernia", category: "Historia", page: "historias.html", anchor: "vision-psybernia", sub: "Laki, Zene y Valeria" },
  { title: "Lo que quedó del Torneo", category: "Historia", page: "historias.html", anchor: "epilogo-torneo", sub: "Epílogo del Torneo de Umbra" },
  { title: "Karim Balteus — crónica extendida", category: "Historia", page: "historias.html", anchor: "karim-extenso", sub: "Boceto extenso" },
  { title: "Sombras del pasado, dudas en la luz", category: "Historia", page: "historias.html", anchor: "sombras-luz", sub: "Andreas Light y Rose" },
  { title: "Campañas y Arcos", category: "Historia", page: "historias.html", anchor: "campanas", sub: "Índice de campañas: Guardianes de Apexora y Sinfalía" },
  { title: "Campamento Sopharum", category: "Historia", page: "historias.html", anchor: "campamento-sopharum", sub: "Obra escrita — \"Campamento, familia\"" },
  { title: "Torneo de los Dos Emperadores", category: "Historia", page: "historias.html", anchor: "torneo-emperadores", sub: "Torneo Skaldrak Vlarim (TSV) — final de la campaña" },

  // --- Cronología ---
  { title: "Pacto Skaldrak", category: "Evento", page: "linea-tiempo.html", anchor: "era-0", sub: "Año 0" },
  { title: "Gran Inmigración", category: "Evento", page: "linea-tiempo.html", anchor: "era-290", sub: "Año 290" },
  { title: "Surgir de Negatt", category: "Evento", page: "linea-tiempo.html", anchor: "era-547", sub: "Año 547" },
  { title: "Erupción del Volcán Skaldrak", category: "Evento", page: "linea-tiempo.html", anchor: "era-860", sub: "Año 860" },
  { title: "Torneo de Umbra", category: "Evento", page: "linea-tiempo.html", anchor: "era-1011", sub: "Año 1011" },
  { title: "Apexora hoy", category: "Evento", page: "linea-tiempo.html", anchor: "era-1012", sub: "Año 1012 — Presente" },
  { title: "La invasión de Vasané-Nalú", category: "Evento", page: "linea-tiempo.html", anchor: "era-vasane-nalu", sub: "Tribu Zzamua toma Sinfalía" },

  // --- Antes de Apexora ---
  { title: "Unen y el Cataclismo", category: "Tema", page: "mapa.html", anchor: "antes-de-apexora", sub: "Antes de Apexora" },
];
