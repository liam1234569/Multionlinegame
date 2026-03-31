/**
 * INPUT_JOYSTICK.JS
 * Die Touch-Steuerung für mobile Geräte.
 * Berechnet Richtung und Stärke der Bewegung.
 */

const InputJoystick = {
    manager: {
        active: false,
        startX: 0,
        startY: 0,
        moveX: 0,
        moveY: 0,
        distance: 0,
        maxRadius: 50, // Wie weit man den Stick ziehen kann
        vector: { x: 0, z: 0 } // Die fertigen Werte für die Engine
    },

    init() {
        const base = document.getElementById('joystick-base');
        const knob = document.getElementById('joystick-knob');
        const shootBtn = document.getElementById('shoot-btn');

        if (!base || !knob) return;

        // 1. TOUCH START (Daumen wird aufgesetzt)
        base.addEventListener('touchstart', (e) => {
            this.manager.active = true;
            const touch = e.touches[0];
            const rect = base.getBoundingClientRect();
            
            // Mittelpunkt des Joysticks speichern
            this.manager.startX = rect.left + rect.width / 2;
            this.manager.startY = rect.top + rect.height / 2;
        }, { passive: false });

        // 2. TOUCH MOVE (Daumen wird bewegt)
        base.addEventListener('touchmove', (e) => {
            if (!this.manager.active) return;
            e.preventDefault(); // Verhindert das Scrollen der Seite beim Zocken

            const touch = e.touches[0];
            
            // Abstand zum Mittelpunkt berechnen
            let dx = touch.clientX - this.manager.startX;
            let dy = touch.clientY - this.manager.startY;
            
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Begrenzung: Der Knob darf nicht aus der Basis fliegen
            if (distance > this.manager.maxRadius) {
                dx *= this.manager.maxRadius / distance;
                dy *= this.manager.maxRadius / distance;
            }

            // Visuelles Update des Knobs
            knob.style.transform = `translate(${dx}px, ${dy}px)`;

            // Werte normalisieren (zwischen -1 und 1) für die Engine
            this.manager.vector.x = dx / this.manager.maxRadius;
            this.manager.vector.z = dy / this.manager.maxRadius;
        }, { passive: false });

        // 3. TOUCH END (Daumen wird losgelassen)
        base.addEventListener('touchend', () => {
            this.manager.active = false;
            this.manager.vector.x = 0;
            this.manager.vector.z = 0;
            
            // Knob zurück in die Mitte schnipsen lassen
            knob.style.transform = `translate(0px, 0px)`;
        });

        // 4. SCHIESS-BUTTON (Für Handy)
        if (shootBtn) {
            shootBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                // Ruft das Kampf-Modul auf
                if (window.CombatWeapons && window.Engine.isRunning) {
                    CombatWeapons.shoot(
                        Renderer.scene, 
                        Engine.entities.player, 
                        Renderer.camera
                    );
                }
            });
        }
    },

    // Diese Funktion wird 60x pro Sekunde von engine_main.js aufgerufen
    getMovement() {
        // Wir geben das x/z Objekt zurück, genau wie beim Keyboard
        return {
            x: this.manager.vector.x,
            z: this.manager.vector.z
        };
    }
};

// Initialisierung starten, sobald das Skript geladen ist
InputJoystick.init();