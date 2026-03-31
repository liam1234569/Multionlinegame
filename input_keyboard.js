/**
 * INPUT_KEYBOARD.JS
 * Steuerung für PC (Tastatur und Maus-Rotation).
 */

const InputKeyboard = {
    keys: {},
    mouse: {
        yaw: 0,   // Drehung links/rechts
        pitch: 0, // Drehung oben/unten
        sensitivity: 0.002
    },

    init() {
        // 1. Tasten-Abfrage
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Leertaste für Sprung-Trigger
            if (e.code === 'Space' && window.currentMode === 'parkour_human') {
                if (window.PhysicHuman) PhysicHuman.jump();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // 2. Maus-Bewegung (First/Third Person Look)
        window.addEventListener('mousemove', (e) => {
            // Nur drehen, wenn die Maus im Browser gefangen ist
            if (document.pointerLockElement === document.body) {
                this.mouse.yaw -= e.movementX * this.mouse.sensitivity;
                this.mouse.pitch -= e.movementY * this.mouse.sensitivity;

                // Begrenzung: Nicht den Kopf um 360 Grad nach hinten klappen (Genickbruch-Schutz)
                this.mouse.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.mouse.pitch));
            }
        });

        // 3. Linksklick zum Schießen
       // 3. Linksklick Logik
        window.addEventListener('mousedown', (e) => {
            // Prüfen, ob das Spiel überhaupt schon gestartet wurde
            if (window.Engine && Engine.isRunning) {
                
                if (document.pointerLockElement !== document.body) {
                    // Erst jetzt wird die Maus gefangen
                    document.body.requestPointerLock();
                } else {
                    // Wenn die Maus schon gefangen ist -> Schießen (nur im Zombie-Modus)
                    if (window.currentMode === 'zombies') {
                        CombatWeapons.shoot(Renderer.scene, Engine.entities.player, Renderer.camera);
                    }
                }
                
            } else {
                // Wenn wir noch im Menü sind, lassen wir die Maus in Ruhe.
                // So kannst du die Buttons für PC/Handy und den Modus normal anklicken.
                console.log("Menü-Modus: Maus bleibt frei für Klicks.");
            }
      }
        });
    },

    /**
     * Berechnet die Bewegungsrichtung basierend auf der Kameradrehung.
     * Wird 60x pro Sekunde von engine_main.js aufgerufen.
     */
    getMovement() {
        let x = 0;
        let z = 0;

        if (this.keys['KeyW'] || this.keys['ArrowUp']) z -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) z += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) x -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) x += 1;

        // Normalisieren, damit man diagonal nicht schneller läuft
        const length = Math.sqrt(x * x + z * z);
        if (length > 0) {
            x /= length;
            z /= length;
        }

        return { x, z };
    },

    // Gibt die aktuelle Maus-Rotation zurück, damit die Engine den Spieler drehen kann
    getRotation() {
        return {
            yaw: this.mouse.yaw,
            pitch: this.mouse.pitch
        };
    }
};

// Modul sofort initialisieren
InputKeyboard.init();
