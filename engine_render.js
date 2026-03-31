/**
 * ENGINE_RENDER.JS
 * Verantwortlich für Kamera, Licht, Nebel und das Zeichnen der 3D-Szene.
 */

const Renderer = {
    scene: null,
    camera: null,
    webGLRenderer: null,
    sun: null,
    ambientLight: null,

    // 1. SETUP DER GRAFIK-ENGINE
    setup() {
        console.log("Renderer: Initialisiere Grafik...");

        // Die Szene erstellen
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e); // Tiefblaues Mitternachts-Design
        
        // Nebel für Atmosphäre (verdeckt das Ende der Map wie in alten GTA-Teilen)
        this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02);

        // Kamera Setup (Field of View, Aspect Ratio, Near, Far)
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );

        // WebGL Renderer erstellen
        this.webGLRenderer = new THREE.WebGLRenderer({
            antialias: true, // Glättet Kanten (wichtig für "realistisch")
            powerPreference: "high-performance"
        });
        
        this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        this.webGLRenderer.setPixelRatio(window.devicePixelRatio);
        
        // Schatten-Aktivierung (Das macht es realistisch!)
        this.webGLRenderer.shadowMap.enabled = true;
        this.webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Canvas an den HTML-Body hängen
        document.body.appendChild(this.webGLRenderer.domElement);

        // Beleuchtung hinzufügen
        this.initLights();

        // Fenster-Größenänderung abfangen
        window.addEventListener('resize', () => this.onWindowResize(), false);
    },

    // 2. BELEUCHTUNGSSYSTEM
    initLights() {
        // Grundhelligkeit (damit Schatten nicht komplett schwarz sind)
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.5); 
        this.scene.add(this.ambientLight);

        // Die "Sonne" oder "Mond" (Directional Light für Schatten)
        this.sun = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sun.position.set(50, 100, 50);
        this.sun.castShadow = true;

        // Schatten-Qualität optimieren
        this.sun.shadow.mapSize.width = 2048;
        this.sun.shadow.mapSize.height = 2048;
        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far = 500;
        
        // Bereich, in dem Schatten berechnet werden
        const d = 50;
        this.sun.shadow.camera.left = -d;
        this.sun.shadow.camera.right = d;
        this.sun.shadow.camera.top = d;
        this.sun.shadow.camera.bottom = -d;

        this.scene.add(this.sun);

        // Ein dezentes Punktlicht für den Spieler-Vibe
        const pointLight = new THREE.PointLight(0x3366ff, 0.5, 10);
        pointLight.position.set(0, 5, 0);
        this.scene.add(pointLight);
    },

    // 3. KAMERA-STEUERUNG (GTA / Fortnite Style)
    updateCamera(target) {
        if (!target) return;

        // Wir berechnen einen Offset (Abstand zum Spieler)
        const relativeCameraOffset = new THREE.Vector3(0, 4, 8); // 4 Einheiten hoch, 8 zurück

        // Die Kamera-Position relativ zur Rotation des Spielers berechnen
        const cameraOffset = relativeCameraOffset.applyMatrix4(target.matrixWorld);

        // Sanftes Folgen (Lerp) für ein flüssiges Gefühl
        this.camera.position.lerp(cameraOffset, 0.1);
        
        // Die Kamera schaut immer auf den Spieler (leicht über den Kopf)
        const lookTarget = new THREE.Vector3(
            target.position.x,
            target.position.y + 1.5,
            target.position.z
        );
        this.camera.lookAt(lookTarget);
    },

    // 4. RENDERN
    render() {
        this.webGLRenderer.render(this.scene, this.camera);
    },

    // Helfer für Resizing
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    }
};