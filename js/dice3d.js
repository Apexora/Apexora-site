/* =========================================================
   APEXORA — motor de dados 3D
   Construye la geometría real de cada dado (d4 a d20, y un
   d10 doble para el d100), numera sus caras y anima la tirada
   en un pequeño visor WebGL (three.js).
   ========================================================= */

const APEXORA_DICE = (function () {
  const FACE_COLOR = 0x2a2233;
  const EDGE_COLOR = 0xcf9d4f;

  // ---- utilidades geométricas ----------------------------------------

  function centroidOf(points) {
    const c = new THREE.Vector3();
    points.forEach((p) => c.add(p));
    return c.divideScalar(points.length);
  }

  // Un triángulo = una cara (tetraedro, octaedro, icosaedro sin subdividir)
  function trianglesAsFaces(geometry) {
    const geo = geometry.toNonIndexed();
    const pos = geo.attributes.position;
    const faces = [];
    for (let i = 0; i < pos.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i);
      const b = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const centroid = centroidOf([a, b, c]);
      faces.push({ centroid, normal: centroid.clone().normalize() });
    }
    return { geometry: geo, faces };
  }

  // Varios triángulos consecutivos = una cara real (dodecaedro: pentágonos)
  function groupedTrianglesAsFaces(geometry, trisPerFace) {
    const geo = geometry.toNonIndexed();
    const pos = geo.attributes.position;
    const vertsPerFace = trisPerFace * 3;
    const faces = [];
    for (let i = 0; i < pos.count; i += vertsPerFace) {
      const seen = new Map();
      for (let k = 0; k < vertsPerFace; k++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i + k);
        const key = v.x.toFixed(3) + "," + v.y.toFixed(3) + "," + v.z.toFixed(3);
        if (!seen.has(key)) seen.set(key, v);
      }
      const centroid = centroidOf(Array.from(seen.values()));
      faces.push({ centroid, normal: centroid.clone().normalize() });
    }
    return { geometry: geo, faces };
  }

  function boxFaces(geometry, halfSize) {
    const normals = [
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
    ];
    const faces = normals.map((n) => ({
      centroid: n.clone().multiplyScalar(halfSize),
      normal: n,
    }));
    return { geometry, faces };
  }

  // d10: bipirámide pentagonal construida a mano (10 caras triangulares)
  function buildD10Geometry(radius) {
    const topApex = new THREE.Vector3(0, radius, 0);
    const botApex = new THREE.Vector3(0, -radius, 0);
    const ring = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ring.push(new THREE.Vector3(Math.cos(a) * radius * 0.98, radius * 0.15, Math.sin(a) * radius * 0.98));
    }
    const ringLow = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 5;
      ringLow.push(new THREE.Vector3(Math.cos(a) * radius * 0.98, -radius * 0.15, Math.sin(a) * radius * 0.98));
    }

    const triples = [];
    for (let i = 0; i < 5; i++) {
      triples.push([topApex, ring[i], ring[(i + 1) % 5]]);
      triples.push([botApex, ringLow[i], ringLow[(i + 1) % 5]]);
    }

    const positions = [];
    const faces = triples.map(([a, b, c]) => {
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
      const centroid = centroidOf([a, b, c]);
      const normal = new THREE.Vector3()
        .crossVectors(b.clone().sub(a), c.clone().sub(a))
        .normalize();
      if (normal.dot(centroid) < 0) normal.negate();
      return { centroid, normal };
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    return { geometry, faces };
  }

  // ---- numeración de caras --------------------------------------------

  function pairOppositeFaces(faces) {
    const n = faces.length;
    const used = new Array(n).fill(false);
    const pairs = [];
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      let bestJ = -1, bestDot = Infinity;
      for (let j = 0; j < n; j++) {
        if (used[j] || j === i) continue;
        const dot = faces[i].normal.dot(faces[j].normal);
        if (dot < bestDot) { bestDot = dot; bestJ = j; }
      }
      used[i] = true; used[bestJ] = true;
      pairs.push([i, bestJ]);
    }
    return pairs;
  }

  // Caras opuestas suman (max+1), como en dados reales.
  function assignOppositeValues(faces, maxValue) {
    const pairs = pairOppositeFaces(faces);
    const values = new Array(faces.length);
    pairs.forEach((pair, idx) => {
      values[pair[0]] = idx + 1;
      values[pair[1]] = maxValue - idx;
    });
    return values;
  }

  function sequentialValues(count, offset) {
    const values = [];
    for (let i = 0; i < count; i++) values.push(i + (offset || 1));
    return values;
  }

  // ---- definición de cada tipo de dado --------------------------------

  function geometryFor(kind) {
    switch (kind) {
      case 4: {
        const g = new THREE.TetrahedronGeometry(1);
        const { geometry, faces } = trianglesAsFaces(g);
        return { geometry, faces, values: sequentialValues(4, 1) };
      }
      case 6: {
        const half = 0.66;
        const g = new THREE.BoxGeometry(half * 2, half * 2, half * 2);
        const { geometry, faces } = boxFaces(g, half);
        return { geometry, faces, values: assignOppositeValues(faces, 6) };
      }
      case 8: {
        const g = new THREE.OctahedronGeometry(1);
        const { geometry, faces } = trianglesAsFaces(g);
        return { geometry, faces, values: assignOppositeValues(faces, 8) };
      }
      case 10:
      case "d10tens": {
        const { geometry, faces } = buildD10Geometry(1);
        const values = sequentialValues(10, 0);
        return { geometry, faces, values, isTens: kind === "d10tens" };
      }
      case 12: {
        const g = new THREE.DodecahedronGeometry(1);
        const { geometry, faces } = groupedTrianglesAsFaces(g, 3);
        return { geometry, faces, values: assignOppositeValues(faces, 12) };
      }
      case 20: {
        const g = new THREE.IcosahedronGeometry(1);
        const { geometry, faces } = trianglesAsFaces(g);
        return { geometry, faces, values: assignOppositeValues(faces, 20) };
      }
      default:
        return null;
    }
  }

  // ---- etiquetas numéricas (canvas -> textura) ------------------------

  function makeLabelTexture(text) {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#f4ecd8";
    ctx.font = `700 ${text.length > 2 ? 44 : 60}px Georgia, 'Times New Roman', serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, size / 2 + 4);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function labelText(kind, value) {
    if (kind === "d10tens") return value === 0 ? "00" : String(value * 10);
    return String(value);
  }

  // ---- ensamblado del grupo 3D -----------------------------------------

  function buildDieVisual(kind) {
    const def = geometryFor(kind);
    if (!def) return null;

    const material = new THREE.MeshStandardMaterial({
      color: FACE_COLOR,
      roughness: 0.4,
      metalness: 0.25,
      flatShading: true,
    });
    const edges = new THREE.EdgesGeometry(def.geometry, 1);
    const edgeMat = new THREE.LineBasicMaterial({ color: EDGE_COLOR, transparent: true, opacity: 0.55 });

    const group = new THREE.Group();
    group.add(new THREE.Mesh(def.geometry, material));
    group.add(new THREE.LineSegments(edges, edgeMat));

    const labelGeo = new THREE.PlaneGeometry(0.5, 0.5);
    def.faces.forEach((face, i) => {
      const tex = makeLabelTexture(labelText(kind, def.values[i]));
      const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      });
      const label = new THREE.Mesh(labelGeo, mat);
      const dist = face.centroid.length() * 1.04;
      const pos = face.normal.clone().multiplyScalar(dist);
      label.position.copy(pos);
      label.lookAt(pos.clone().add(face.normal));
      group.add(label);
    });

    return { group, faces: def.faces, values: def.values };
  }

  // ---- animación (easing) ----------------------------------------------

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  // ---- visor: gestiona 1 a 4 dados en la misma escena -------------------

  function createViewport(container) {
    let renderer, scene, camera;
    let slots = []; // { group, faces, values }
    let idleRaf = null;
    let ready = false;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0.7, 3.4);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const key = new THREE.DirectionalLight(0xffe3b0, 1.15);
      key.position.set(2.2, 3, 3);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x8fb7ff, 0.45);
      rim.position.set(-3, -1.5, -2);
      scene.add(rim);

      container.appendChild(renderer.domElement);
      ready = true;
    } catch (e) {
      return null; // sin WebGL disponible
    }

    function render() {
      renderer.render(scene, camera);
    }

    function resize() {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      render();
    }

    function idleTick() {
      slots.forEach((s, i) => {
        s.group.rotation.y += 0.0035 + i * 0.0004;
        s.group.rotation.x += 0.0012;
      });
      render();
      idleRaf = requestAnimationFrame(idleTick);
    }
    idleTick();

    function setDice(kind, count) {
      slots.forEach((s) => scene.remove(s.group));
      slots = [];
      const n = Math.max(1, Math.min(4, count));
      const spacing = 1.7;
      for (let i = 0; i < n; i++) {
        const visual = buildDieVisual(kind);
        if (!visual) continue;
        visual.group.position.x = (i - (n - 1) / 2) * spacing;
        scene.add(visual.group);
        slots.push(visual);
      }
      camera.position.z = 3.0 + (n - 1) * 0.85;
      camera.updateProjectionMatrix();
      render();
      return slots.length;
    }

    function rollAll(values, duration) {
      duration = duration || 1150;
      const startTime = performance.now();
      const anims = slots.map((slot, i) => {
        const faceIdx = slot.values.indexOf(values[i]);
        const targetNormal = faceIdx >= 0 ? slot.faces[faceIdx].normal.clone() : new THREE.Vector3(0, 0, 1);
        const targetQuat = new THREE.Quaternion().setFromUnitVectors(targetNormal, new THREE.Vector3(0, 0, 1));
        const axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const turns = 2.2 + Math.random() * 1.3;
        const delay = i * 60;
        return { slot, targetQuat, axis, turns, delay };
      });

      return new Promise((resolve) => {
        if (idleRaf) cancelAnimationFrame(idleRaf);

        function frame(now) {
          let allDone = true;
          anims.forEach(({ slot, targetQuat, axis, turns, delay }) => {
            const local = Math.max(0, Math.min(1, (now - startTime - delay) / duration));
            if (local < 1) allDone = false;
            const splitAt = 0.55;
            if (local < splitAt) {
              const t = local / splitAt;
              slot.group.quaternion.setFromAxisAngle(axis, turns * Math.PI * 2 * t);
            } else {
              const t = easeOutCubic((local - splitAt) / (1 - splitAt));
              const tumbleEnd = new THREE.Quaternion().setFromAxisAngle(axis, turns * Math.PI * 2);
              slot.group.quaternion.copy(tumbleEnd).slerp(targetQuat, t);
            }
          });
          render();
          if (!allDone) {
            requestAnimationFrame(frame);
          } else {
            anims.forEach(({ slot, targetQuat }) => slot.group.quaternion.copy(targetQuat));
            render();
            idleRaf = requestAnimationFrame(idleTick);
            resolve();
          }
        }
        requestAnimationFrame(frame);
      });
    }

    resize();
    window.addEventListener("resize", resize);

    return { ready, setDice, rollAll, resize };
  }

  return { createViewport };
})();
