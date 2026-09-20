/* =========================================================
   APEXORA — mapa 3D
   Renderiza el mapa como un plano texturizado dentro de una
   escena WebGL real, con un marcador 3D (punto de referencia)
   por nación: se puede arrastrar para mirar alrededor, tocar
   cada marcador para ver su ficha, y hay una animación de
   selección + una cámara que se acerca al elegir una nación.
   ========================================================= */

const APEXORA_MAP3D = (function () {

  function init(container, opts) {
    const nations = opts.nations || [];
    const imageUrl = opts.imageUrl;
    const onSelect = opts.onSelect || function () {};
    const onHover = opts.onHover || function () {};

    let renderer, scene, camera, raycaster, mouse;
    let planeW = 16, planeH = 9;
    let markers = [];
    let activeId = null;
    let ready = false;

    // --- estado de cámara orbital (esférico, con destino animado) ---
    const cam = {
      theta: 0.25, phi: 1.02, radius: 13.5,
      target: new THREE.Vector3(0, 0, 0),
    };
    const camGoal = {
      theta: cam.theta, phi: cam.phi, radius: cam.radius,
      target: cam.target.clone(),
    };

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2(-10, -10);
      container.appendChild(renderer.domElement);
      ready = true;
    } catch (e) {
      return null;
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffe9c4, 0.9);
    key.position.set(6, 10, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fb7ff, 0.35);
    rim.position.set(-6, 4, -5);
    scene.add(rim);

    // --- plano del mapa ---
    const loader = new THREE.TextureLoader();
    const planeGeo = new THREE.PlaneGeometry(planeW, planeH, 1, 1);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    loader.load(imageUrl, (tex) => {
      if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
      planeMat.map = tex;
      planeMat.needsUpdate = true;
      render();
    });

    // borde sutil del continente (marco)
    const frameGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(planeW, planeH));
    const frame = new THREE.LineSegments(frameGeo, new THREE.LineBasicMaterial({ color: 0xcf9d4f, transparent: true, opacity: 0.35 }));
    frame.rotation.x = -Math.PI / 2;
    frame.position.y = 0.01;
    scene.add(frame);

    // --- marcadores (un punto de referencia por país) ---
    const gemGeo = new THREE.OctahedronGeometry(0.16, 0);
    const stemGeo = new THREE.CylinderGeometry(0.012, 0.02, 0.55, 6);
    const hitGeo = new THREE.SphereGeometry(0.42, 10, 10);

    nations.forEach((nation, i) => {
      const worldX = (nation.x / 100 - 0.5) * planeW;
      const worldZ = (nation.y / 100 - 0.5) * planeH;

      const group = new THREE.Group();
      group.position.set(worldX, 0, worldZ);

      const color = new THREE.Color(nation.color || "#e8c789");

      const stem = new THREE.Mesh(stemGeo, new THREE.MeshStandardMaterial({ color: 0xcf9d4f, roughness: 0.4, metalness: 0.4 }));
      stem.position.y = 0.275;
      group.add(stem);

      const gem = new THREE.Mesh(gemGeo, new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.55, roughness: 0.3, metalness: 0.2,
      }));
      gem.position.y = 0.62;
      group.add(gem);

      const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.y = 0.5;
      group.add(hit);

      scene.add(group);

      const marker = {
        nation, group, gem, hit,
        hoverT: 0, phase: Math.random() * Math.PI * 2, baseY: 0.62,
      };
      hit.userData.marker = marker;
      markers.push(marker);
    });

    // --- interacción de puntero (arrastrar para orbitar, tocar para elegir) ---
    let dragging = false, dragMoved = false, lastX = 0, lastY = 0;

    function onPointerDown(e) {
      dragging = true;
      dragMoved = false;
      lastX = e.clientX;
      lastY = e.clientY;
    }

    function onPointerMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (dragging) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
        camGoal.theta -= dx * 0.006;
        camGoal.phi = Math.max(0.42, Math.min(1.35, camGoal.phi - dy * 0.006));
        lastX = e.clientX;
        lastY = e.clientY;
      }
    }

    function onPointerUp(e) {
      if (!dragMoved) {
        const hitMarker = pickMarker();
        if (hitMarker) selectMarker(hitMarker);
      }
      dragging = false;
    }

    function onWheel(e) {
      e.preventDefault();
      camGoal.radius = Math.max(7, Math.min(20, camGoal.radius + e.deltaY * 0.012));
    }

    function pickMarker() {
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(markers.map((m) => m.hit));
      if (hits.length) return hits[0].object.userData.marker;
      return null;
    }

    renderer.domElement.style.touchAction = "none";
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    let hoveredMarker = null;
    function updateHoverState() {
      if (dragging) return;
      const m = pickMarker();
      if (m !== hoveredMarker) {
        hoveredMarker = m;
        renderer.domElement.style.cursor = m ? "pointer" : dragging ? "grabbing" : "grab";
        onHover(m ? m.nation : null);
      }
    }

    function selectMarker(marker) {
      activeId = marker.nation.id;
      camGoal.target.set(marker.group.position.x, 0.3, marker.group.position.z);
      camGoal.radius = 6.5;
      onSelect(marker.nation);
    }

    function selectById(id) {
      const m = markers.find((mk) => mk.nation.id === id);
      if (m) selectMarker(m);
    }

    function resetView() {
      activeId = null;
      camGoal.target.set(0, 0, 0);
      camGoal.theta = 0.25;
      camGoal.phi = 1.02;
      camGoal.radius = 13.5;
    }

    function updateCameraPosition() {
      cam.theta += (camGoal.theta - cam.theta) * 0.08;
      cam.phi += (camGoal.phi - cam.phi) * 0.08;
      cam.radius += (camGoal.radius - cam.radius) * 0.08;
      cam.target.lerp(camGoal.target, 0.08);

      const x = cam.target.x + cam.radius * Math.sin(cam.phi) * Math.sin(cam.theta);
      const y = cam.target.y + cam.radius * Math.cos(cam.phi);
      const z = cam.target.z + cam.radius * Math.sin(cam.phi) * Math.cos(cam.theta);
      camera.position.set(x, y, z);
      camera.lookAt(cam.target);
    }

    function animateMarkers(t) {
      markers.forEach((m) => {
        const isActive = m.nation.id === activeId;
        const wantHover = (m === hoveredMarker || isActive) ? 1 : 0;
        m.hoverT += (wantHover - m.hoverT) * 0.15;
        const bob = Math.sin(t * 0.0015 + m.phase) * 0.05;
        m.gem.position.y = m.baseY + bob + m.hoverT * 0.12;
        m.gem.rotation.y += 0.01;
        const scale = 1 + m.hoverT * 0.45;
        m.gem.scale.setScalar(scale);
        m.gem.material.emissiveIntensity = 0.5 + m.hoverT * 0.9;
      });
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

    function loop(t) {
      updateHoverState();
      updateCameraPosition();
      animateMarkers(t || 0);
      render();
      requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(loop);

    return { ready, selectById, resetView, resize };
  }

  return { init };
})();
