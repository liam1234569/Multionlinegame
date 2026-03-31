/**
 * ENGINE MAIN
 * Das Herzstück des Spiels. Koordiniert Renderer, Physik und Welten.
 */
const Engine = {
    isRunning: false,
    entities: {
        player: null,
        zombies: [],
        cars: [],
        environment: []
    },
    lastTime: 0,

    init() {
        console.log("Engine: Initialisiere Systeme...");
        
        // 1. Renderer starten
        if (window.Renderer) {
            Renderer.init();
        } else {
            console.error("Engine Fehler: Renderer nicht gefunden!");
        }

        // 2. Physik starten
        if (window.PhysicCore) {
            PhysicCore.init();
        }

        // 3. Inputs aktivieren
        if (window.InputKeyboard) InputKeyboard.init();
        if (window.InputJoystick) InputJoystick.init();

        console.log("Engine: Bereit.");
    },

    /**
     * Startet ein Level basierend auf der Auswahl im Menü
     */
    start(mode) {
        console.log("Engine: Starte Modus -> " + mode);
        this.isRunning = true;
        window.currentMode = mode;

        // Falls noch alte Reste da sind, Szene leeren
        this.clearScene();

        // 1. WELT LADEN
        if (mode === 'zombies') {
            if (window.WorldAlley) {
                WorldAlley.init(Renderer.scene, PhysicCore.world);
            }
        } else {
            if (window.WorldParkour) {
                WorldParkour.init(Renderer.scene, PhysicCore.world, mode);
            }
        }

        // 2. SPIELER ERSTELLEN
        this.entities.player = new ActorPlayer(Renderer.scene, PhysicCore.world);

        // 3. KAMERA UND LICHT EINSTELLEN
        this.setupEnvironment();

        // Ladebildschirm ausblenden
        const loader = document.getElementById('loader-screen');
        if (loader) loader.classList.add('hidden');

        // Game Loop starten
        requestAnimationFrame((t) => this.loop(t));
    },

    setupEnvironment() {
        // Umgebungslicht (damit nichts schwarz ist)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        Renderer.scene.add(ambientLight);

        // Sonnenlicht
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(10, 20, 10);
        Renderer.scene.add(sunLight);

        // Hintergrundfarbe (Himmelblau)
        Renderer.scene.background = new THREE.Color(0x87ceeb);
    },

    clearScene() {
        // Logik zum Säubern der Szene bei Neustart
        this.entities.zombies = [];
        this.entities.cars = [];
    },

    loop(time) {
        if (!this.isRunning) return;

        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        // Physik-Update
        if (PhysicCore.world) {
            PhysicCore.world.step(1/60);
        }

        // Spieler-Update
        if (this.entities.player) {
            this.entities.player.update(dt);
        }

        // Alle anderen Wesen updaten
        this.entities.zombies.forEach(z => z.update(dt));

        // Rendern
        Renderer.render();

        requestAnimationFrame((t) => this.loop(t));
    }
};

// Global verfügbar machen
window.Engine = Engine;

// Warten bis alle Scripte geladen sind, dann init
window.addEventListener('load', () => {
    Engine.init();
});
