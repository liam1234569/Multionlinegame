/**
 * PHYSIC_CORE.JS
 * Das Fundament der Welt: Schwerkraft, Kollisionen und Zeitberechnung.
 */

const PhysicCore = {
    world: null,
    fixedTimeStep: 1 / 60, // 60 FPS Physik-Update
    maxSubSteps: 3,

    // 1. INITIALISIERUNG DER PHYSIK-WELT
    init() {
        console.log("PhysicCore: Erschaffe Gravitation...");

        // Erstelle die Cannon.js Welt
        this.world = new CANNON.World();

        // Erdähnliche Schwerkraft (x, y, z) -> -9.82 m/s² nach unten
        this.world.gravity.set(0, -9.82, 0);

        // Broadphase: Algorithmus zur Erkennung, welche Objekte nah beieinander sind
        // NaiveBroadphase ist stabil für unsere Gassen- und Parkour-Level
        this.world.broadphase = new CANNON.NaiveBroadphase();

        // Iterationen: Je höher, desto genauer (aber langsamer). 7 ist ein guter Mix.
        this.world.solver.iterations = 7;

        // Standard-Materialien für die Welt definieren
        this.initDefaultMaterials();
        
        console.log("PhysicCore: Weltgesetze aktiv.");
    },

    // 2. MATERIAL-EIGENSCHAFTEN (Reibung & Abprall)
    initDefaultMaterials() {
        const groundMaterial = new CANNON.Material("groundMaterial");
        const slippyMaterial = new CANNON.Material("slippyMaterial");

        // Kontakt-Definition: Wie rutschig ist der Boden?
        const ground_ground = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
            friction: 0.4,
            restitution: 0.3, // Ein bisschen Sprungkraft
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        });

        this.world.addContactMaterial(ground_ground);
    },

    /**
     * 3. DAS ZEIT-UPDATE
     * Wird 60x pro Sekunde von der engine_main.js aufgerufen.
     */
    update(deltaTime) {
        if (!this.world) return;

        // Schrittweise Berechnung der Physik
        // deltaTime sorgt dafür, dass die Physik bei Lag nicht "springt"
        this.world.step(this.fixedTimeStep, deltaTime, this.maxSubSteps);
    },

    // 4. HILFSFUNKTION: STATISCHE BOX ERSTELLEN (Für Parkour-Plattformen)
    createStaticBox(width, height, depth, x, y, z) {
        const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const body = new CANNON.Body({
            mass: 0, // Mass 0 bedeutet: Unbeweglich (statisch)
            shape: shape
        });
        body.position.set(x, y, z);
        this.world.addBody(body);
        return body;
    },

    // 5. HILFSFUNKTION: DYNAMISCHE KUGEL (Für Granaten oder Trümmer)
    createDynamicSphere(radius, x, y, z, mass = 1) {
        const shape = new CANNON.Sphere(radius);
        const body = new CANNON.Body({
            mass: mass,
            shape: shape
        });
        body.position.set(x, y, z);
        this.world.addBody(body);
        return body;
    }
};