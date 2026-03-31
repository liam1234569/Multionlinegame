/**
 * ENGINE_RENDER.JS
 * Verantwortlich für Kamera, Licht und das Zeichnen der 3D-Szene.
 */
const Renderer = {
    scene: null,
    camera: null,
    webGLRenderer: null,
    sun: null,
    ambientLight: null,

    init() {
        console.log("Renderer: Initialisiere Grafik...");

        // 1. SZENE ERSTELLEN
        this.scene = new THREE.Scene();
        // Ein schönes Himmelblau, damit es nicht mehr schwarz ist!
        this.scene.background = new THREE.Color(0x87ceeb); 
        this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.02); // Leichter Nebel in Himmelsfarbe

        // 2. KAMERA ERSTELLEN
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        // Kamera etwas nach oben und hinten setzen, damit sie nicht im Boden steckt
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // 3. WEBGL RENDERER (Die eigentliche Grafik-Engine)
        this.webGLRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        this.webGLRenderer.shadowMap.enabled = true; // Schatten aktivieren
        
        // WICHTIG: Das Canvas (Zeichenfläche) ins HTML einfügen
        document.body.appendChild(this.webGLRenderer.domElement);

        // 4. LICHT HINZUFÜGEN (Ohne Licht bleibt alles schwarz!)
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);

        this.sun = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sun.position.set(50, 100, 50);
        this.sun.castShadow = true;
        this.scene.add(this.sun);

        // 5. RESPONSIVE DESIGN (Wenn sich die Fenstergröße ändert)
        window.addEventListener('resize', () => {
            if (this.camera && this.webGLRenderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
            }
        });

        console.log("Renderer: Grafik erfolgreich geladen.");
    },

    /**
     * Diese Funktion wird jeden Frame von der engine_main.js aufgerufen!
     * Sie knipst quasi das Foto von der Szene.
     */
    render() {
        if (this.webGLRenderer && this.scene && this.camera) {
            this.webGLRenderer.render(this.scene, this.camera);
        }
    }
};

// Global verfügbar machen
window.Renderer = Renderer;
