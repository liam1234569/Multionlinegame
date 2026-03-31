/**
 * CITY DEFENDER 3D - ENGINE MAIN
 * Finale Version
 */

const Engine = {
    isRunning: false,
    lastTime: 0,
    entities: {
        player: null,
        zombies: [],
        cars: []
    },

    /**
     * Initialisiert die Grundsysteme beim Laden der Seite
     */
    init() {
        console.log("Engine: Initialisiere Systeme...");

        // Prüfung ob Renderer existiert (wichtig gegen den Dauer-Lade-Fehler)
        if (typeof Renderer !== 'undefined') {
            Renderer.init();
            console.log("Renderer: OK");
        } else {
            console.error("Engine Fehler: Renderer nicht gefunden! Prüfe index.html Reihenfolge.");
            return; 
        }

        if (typeof PhysicCore !== 'undefined') {
            PhysicCore.init();
            console.log("Physik: OK");
        }

        // Zeige das Hauptmenü an, sobald alles bereit ist
        const loader = document.getElementById('loader-screen');
        const mainMenu = document.getElementById('main-menu');
        
        if (loader) loader.classList.add('hidden');
        if (mainMenu) mainMenu.classList.remove('hidden');

        console.log("Engine: Bereit für Modus-Auswahl.");
    },

    /**
     * Startet das eigentliche Spiel nach Klick im Menü
     */
    start(mode) {
        if (this.isRunning) return;
        
        console.log("Engine: Starte Spiel-Modus -> " + mode);
        this.isRunning = true;
        window.currentMode = mode;

        // 1. Licht und Himmel erstellen (Gegen den schwarzen Bildschirm)
        this.setupScene();

        // 2. Welt laden
        if (mode === 'zombies' && typeof WorldAlley !== 'undefined') {
            WorldAlley.init(Renderer.scene, PhysicCore.world);
        } else if (typeof WorldParkour !== 'undefined') {
            WorldParkour.init(Renderer.scene, PhysicCore.world, mode);
        }

        // 3. Spieler spawnen
        if (typeof ActorPlayer !== 'undefined') {
            this.entities.player = new ActorPlayer(Renderer.scene, PhysicCore.world);
        }

        // HUD anzeigen
        const hud = document.getElementById('ui-hud');
        if (hud) hud.classList.remove('hidden');

        // Game Loop starten
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    },

    setupScene() {
        // Hintergrundfarbe (Himmelblau)
        Renderer.scene.background = new THREE.Color(0x87ceeb);

        // Licht hinzufügen
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        Renderer.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(10, 20, 10);
        Renderer.scene.add(sunLight);
    },

    loop(time) {
        if (!this.isRunning) return;

        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        // Physik berechnen
        if (PhysicCore.world) {
            PhysicCore.world.step(1/60);
        }

        // Spieler updaten
        if (this.entities.player) {
            this.entities.player.update(dt);
        }

        // Rendern
        Renderer.render();

        requestAnimationFrame((t) => this.loop(t));
    }
};

// Globaler Zugriff
window.Engine = Engine;

// Automatischer Start der Initialisierung
window.addEventListener('load', () => {
    Engine.init();
});
