/**
 * WORLD_PARKOUR.JS
 * Erstellt die Parkour-Welt mit Rampen, Plattformen und Hindernissen.
 * Optimiert für Auto-Stunts und Präzisionssprünge.
 */

const WorldParkour = {
    parkourGroup: null,

    // 1. DIE WELT AUFBAUEN
    build(scene) {
        this.parkourGroup = new THREE.Group();
        scene.add(this.parkourGroup);

        // A. START-PLATTFORM (Große Basis)
        this.createPlatform(0, 0, 0, 30, 1, 30, 0x333333);

        // B. DIE ERSTE RAMPE (Für das Auto)
        // Eine Rampe ist eine Box, die wir neigen
        this.createRampe(0, 2, 25, 10, 1, 20, 0.3, 0x5555ff);

        // C. SCHWEBENDE PLATTFORMEN (Für Mensch & Auto)
        // Plattform 1 (Etwas höher)
        this.createPlatform(0, 10, 60, 20, 1, 20, 0xff007f); 
        
        // Plattform 2 (Seitlich versetzt für Kurven-Training)
        this.createPlatform(25, 15, 90, 15, 1, 15, 0x00d2ff);

        // D. HINDERNIS-PARCOURS (Kleine Blöcke zum Springen)
        for (let i = 0; i < 5; i++) {
            this.createPlatform(
                25, 
                16 + (i * 2), 
                115 + (i * 10), 
                5, 1, 5, 
                0xf1f508
            );
        }

        // E. DAS ZIEL (Große leuchtende Plattform)
        this.createPlatform(0, 30, 200, 40, 2, 40, 0x00ff00);

        // F. DEKO: REIFEN-STAPEL & TONNEN
        this.addDecoration(0, 1, 5);
        this.addDecoration(5, 1, -5);

        console.log("WorldParkour: Level geladen.");
    },

    /**
     * Hilfsfunktion für statische Plattformen
     */
    createPlatform(x, y, z, w, h, d, color) {
        // Grafik
        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.3, roughness: 0.4 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.parkourGroup.add(mesh);

        // Physik (Statisch)
        PhysicCore.createStaticBox(w, h, d, x, y, z);
    },

    /**
     * Hilfsfunktion für Rampen
     */
    createRampe(x, y, z, w, h, d, rotationX, color) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({ color: color });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.rotation.x = rotationX;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.parkourGroup.add(mesh);

        // Physik für die Rampe
        const shape = new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2));
        const body = new CANNON.Body({ mass: 0 }); // Statisch
        body.addShape(shape);
        body.position.set(x, y, z);
        // Rotation der Physik an Grafik anpassen
        body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), rotationX);
        PhysicCore.world.addBody(body);
    },

    addDecoration(x, y, z) {
        const decoGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
        const decoMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const deco = new THREE.Mesh(decoGeo, decoMat);
        deco.position.set(x, y, z);
        this.parkourGroup.add(deco);
    }
};