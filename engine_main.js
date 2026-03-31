/**
 * ENGINE_MAIN.JS
 * Das Gehirn des Spiels. Verbindet alle Module und startet die Game-Loop.
 */

const Engine = {
    clock: new THREE.Clock(),
    isRunning: false,
    entities: {
        player: null,
        vehicle: null,
        enemies: [],
        bullets: []
    },

    // 1. INITIALISIERUNG
    init() {
        console.log("Engine: Initialisiere Systeme...");
        
        // Grafik-Setup (aus engine_render.js)
        Renderer.setup();
        
        // Physik-Setup (aus physic_core.js)
        PhysicCore.init();

        // UI Setup
        UI_Menu.show();
        
        console.log("Engine: Bereit.");
    },

    // 2. START DES LEVELS
    start(mode) {
        window.currentMode = mode;
        this.isRunning = true;

        // Welt aufbauen (je nach Modus)
        if (mode === 'zombies') {
            WorldAlley.build(Renderer.scene);
            this.entities.player = ActorPlayer.create();
            Renderer.scene.add(this.entities.player);
            // Startet Zombie-Spawning
            WorldAlley.startSpawning();
        } else if (mode === 'parkour_car') {
            WorldParkour.build(Renderer.scene);
            this.entities.player = ActorCar.create(); // Visuelles Auto
            this.entities.vehicle = PhysicCar.create(PhysicCore.world); // Physik-Auto
            Renderer.scene.add(this.entities.player);
        }

        // Loop starten
        this.gameLoop();
    },

    // 3. DIE GAME-LOOP (läuft ca. 60 mal pro Sekunde)
    gameLoop() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.gameLoop());

        const delta = this.clock.getDelta();

        // A. Physik updaten
        PhysicCore.update(delta);

        // B. Input verarbeiten (PC oder Handy)
        const move = InputKeyboard.getMovement() || InputJoystick.getMovement();

        // C. Spieler/Auto bewegen
        if (window.currentMode === 'parkour_car') {
            PhysicCar.update(move.x, move.z);
            // Grafik an Physik anpassen
            this.entities.player.position.copy(this.entities.vehicle.position);
            this.entities.player.quaternion.copy(this.entities.vehicle.quaternion);
        } else {
            this.entities.player.position.x += move.x * 0.2;
            this.entities.player.position.z += move.z * 0.2;
        }

        // D. Kampf-Logik
        CombatWeapons.updateBullets(Renderer.scene);
        CombatCollision.checkBulletHits(
            CombatWeapons.bullets, 
            this.entities.enemies, 
            Renderer.scene
        );
        CombatCollision.checkEnemyAttack(
            this.entities.enemies, 
            this.entities.player, 
            delta
        );

        // E. Kamera-Follow (GTA Style)
        Renderer.updateCamera(this.entities.player);

        // F. Rendern
        Renderer.render();
    }
};

// Sobald die Seite geladen ist, Engine zünden
window.onload = () => {
    Engine.init();
    // Loader entfernen
    document.getElementById('loader-screen').classList.add('hidden');
};