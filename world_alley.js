/**
 * WORLD_ALLEY.JS
 * Erstellt die 3D-Umgebung für den Zombie-Modus
 */
const WorldAlley = {
    init(scene, world) {
        console.log("WorldAlley: Baue Gasse...");

        // 1. DER BODEN (Grafik & Physik)
        const groundGeo = new THREE.PlaneGeometry(20, 100);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x222222 }); // Dunkler Asphalt
        const groundMesh = new THREE.Mesh(groundGeo, groundMat);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);

        // Physik-Boden (Cannon.js)
        const groundBody = new CANNON.Body({
            mass: 0, // Mass 0 macht das Objekt unbeweglich
            shape: new CANNON.Plane()
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        world.addBody(groundBody);

        // 2. DIE WÄNDE (Links und Rechts)
        this.createWall(scene, world, -10, 5, 0, 1, 10, 100); // Links
        this.createWall(scene, world, 10, 5, 0, 1, 10, 100);  // Rechts

        // 3. EIN PAAR HINDERNISSE (Mülltonnen/Kisten)
        this.createBox(scene, world, -3, 1, -10, 2, 2, 2, 0x555555);
        this.createBox(scene, world, 4, 0.5, -20, 1, 1, 1, 0x880000);
        
        console.log("WorldAlley: Gasse fertig gestellt.");
    },

    // Hilfsfunktion für Wände
    createWall(scene, world, x, y, z, w, h, d) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        scene.add(mesh);

        const body = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2))
        });
        body.position.set(x, y, z);
        world.addBody(body);
    },

    // Hilfsfunktion für Kisten
    createBox(scene, world, x, y, z, w, h, d, color) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({ color: color });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        scene.add(mesh);

        const body = new CANNON.Body({
            mass: 5, // Kisten können sich bewegen
            shape: new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2))
        });
        body.position.set(x, y, z);
        world.addBody(body);
    }
};

window.WorldAlley = WorldAlley;
