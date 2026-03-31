/**
 * PHYSIC_HUMAN.JS
 * Die physikalische Steuerung für den menschlichen Charakter.
 * Fokus: Präzision und Sprungkraft für Parkour.
 */

const PhysicHuman = {
    body: null,
    canJump: false,
    jumpForce: 5,
    walkSpeed: 8,

    // 1. ERSTELLUNG DES MENSCHLICHEN PHYSIK-KÖRPERS
    create(world) {
        // Eine Box-Form (ähnlich wie eine Kapsel), ca. 2 Meter hoch
        const shape = new CANNON.Box(new CANNON.Vec3(0.4, 1.0, 0.4));
        
        this.body = new CANNON.Body({
            mass: 80, // Durchschnittliches Gewicht eines Menschen
            fixedRotation: true, // GANZ WICHTIG: Verhindert, dass der Mensch wie ein Stein umkippt!
            material: new CANNON.Material("humanMaterial")
        });

        this.body.addShape(shape);
        this.body.position.set(0, 2, 0); // Startposition
        this.body.linearDamping = 0.9; // Verhindert ewiges Rutschen (sofortiger Stopp)

        // Kollisions-Event: Prüfen, ob wir den Boden berühren (für den Sprung)
        this.body.addEventListener("collide", (e) => {
            // Wenn der Kontaktpunkt nach unten zeigt, sind wir auf dem Boden
            if (e.contact.ni.y > 0.5) {
                this.canJump = true;
            }
        });

        world.addBody(this.body);
        return this.body;
    },

    /**
     * 2. BEWEGUNGSLOGIK (Wird 60x pro Sekunde gerufen)
     * @param {number} inputX - Links/Rechts
     * @param {number} inputZ - Vor/Zurück
     * @param {number} rotationYaw - Blickrichtung aus der Maus-Steuerung
     */
    update(inputX, inputZ, rotationYaw) {
        if (!this.body) return;

        // A. RICHTUNG BERECHNEN
        // Wir bewegen uns relativ zur Blickrichtung (Maus)
        const forward = new CANNON.Vec3(
            Math.sin(rotationYaw) * inputZ,
            0,
            Math.cos(rotationYaw) * inputZ
        );
        
        const side = new CANNON.Vec3(
            Math.sin(rotationYaw + Math.PI / 2) * inputX,
            0,
            Math.cos(rotationYaw + Math.PI / 2) * inputX
        );

        // B. GESCHWINDIGKEIT ANWENDEN
        const moveVec = forward.vadd(side);
        this.body.velocity.x = moveVec.x * this.walkSpeed;
        this.body.velocity.z = moveVec.z * this.walkSpeed;

        // C. FALL-SCHUTZ
        // Wenn der Spieler von der Map fällt, Reset
        if (this.body.position.y < -10) {
            this.reset();
        }
    },

    // 3. SPRUNG-FUNKTION
    jump() {
        if (this.canJump) {
            this.body.velocity.y = this.jumpForce;
            this.canJump = false; // Verhindert unendliches Fliegen in der Luft
        }
    },

    reset() {
        this.body.position.set(0, 5, 0);
        this.body.velocity.set(0, 0, 0);
    }
};