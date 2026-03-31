/**
 * PHYSIC_CAR.JS
 * Die physikalische Simulation des Fahrzeugs (Masse, Reibung, Antrieb).
 */

const PhysicCar = {
    body: null,
    wheelMaterial: null,
    
    // 1. ERSTELLUNG DES PHYSIK-KÖRPERS
    create(world) {
        // Die Form des Autos (Box)
        const shape = new CANNON.Box(new CANNON.Vec3(1.1, 0.5, 2.25));
        
        // Der physikalische Körper
        this.body = new CANNON.Body({
            mass: 150, // Gewicht in kg (leicht für Arcade-Feeling)
            material: new CANNON.Material("carMaterial")
        });
        
        this.body.addShape(shape);
        this.body.position.set(0, 5, 0); // Startet leicht in der Luft
        this.body.angularDamping = 0.5; // Verhindert unendliches Drehen nach Crash
        
        // Reibung zwischen Auto und Boden festlegen
        const groundMat = new CANNON.Material("groundMaterial");
        const contactMat = new CANNON.ContactMaterial(this.body.material, groundMat, {
            friction: 0.3,
            restitution: 0.2 // Wie stark es bei Aufprall abspringt
        });
        
        world.addContactMaterial(contactMat);
        world.addBody(this.body);
        
        return this.body;
    },

    /**
     * 2. UPDATE-LOGIK (Wird 60x pro Sekunde gerufen)
     * @param {number} moveX - Lenkung (-1 bis 1)
     * @param {number} moveZ - Gas/Bremse (-1 bis 1)
     */
    update(moveX, moveZ) {
        if (!this.body) return;

        const forwardSpeed = 60; // Max Kraft
        const turnSpeed = 2.5;

        // A. ANTRIEB (Vorwärts / Rückwärts)
        // Wir berechnen die Kraft in Blickrichtung des Autos
        const force = new CANNON.Vec3(0, 0, moveZ * forwardSpeed);
        const worldForce = this.body.quaternion.vmult(force);
        
        // Die Kraft wird nur angewendet, wenn das Auto nah am Boden ist
        if (this.body.position.y < 2) {
            this.body.applyForce(worldForce, this.body.position);
        }

        // B. LENKUNG (Rotation)
        // Nur lenken, wenn das Auto sich bewegt (wie im echten Leben)
        const velocity = this.body.velocity.length();
        if (velocity > 0.5) {
            // Umkehren beim Rückwärtsfahren
            const direction = moveZ > 0 ? -1 : 1;
            this.body.angularVelocity.y = moveX * turnSpeed * direction;
        }

        // C. KÜNSTLICHE STABILITÄT (Gegen Umkippen)
        // Zwingt das Auto, sich langsam wieder aufzurichten, falls es schief steht
        const rot = this.body.quaternion;
        if (Math.abs(rot.x) > 0.1 || Math.abs(rot.z) > 0.1) {
            this.body.angularVelocity.x *= 0.9;
            this.body.angularVelocity.z *= 0.9;
        }
        
        // D. LUFTWIDERSTAND (Damping)
        // Simuliert Windwiderstand, damit das Auto nicht unendlich rollt
        this.body.velocity.x *= 0.98;
        this.body.velocity.z *= 0.98;
    },

    // Teleportiert das Auto zurück, falls es von der Map fällt
    reset() {
        this.body.position.set(0, 5, 0);
        this.body.velocity.set(0, 0, 0);
        this.body.angularVelocity.set(0, 0, 0);
        this.body.quaternion.set(0, 0, 0, 1);
    }
};