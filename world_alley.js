/**
 * WORLD_ALLEY.JS
 * Erstellt die "Zombie-Gasse" inklusive Mauern, Boden und Gegner-Logik.
 */

const WorldAlley = {
    zombieSpawnInterval: null,
    alleyGroup: null,

    // 1. DAS LEVEL BAUEN
    build(scene) {
        this.alleyGroup = new THREE.Group();
        scene.add(this.alleyGroup);

        // A. DER BODEN (Asphalt)
        const groundGeo = new THREE.PlaneGeometry(20, 100);
        const groundMat = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            roughness: 0.8 
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.alleyGroup.add(ground);

        // Physikalischer Boden
        PhysicCore.createStaticBox(20, 1, 100, 0, -0.5, 0);

        // B. DIE SEITENWÄNDE (Backstein-Optik)
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x332222 });
        
        // Linke Wand
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 100), wallMat);
        leftWall.position.set(-10, 5, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        this.alleyGroup.add(leftWall);
        PhysicCore.createStaticBox(1, 10, 100, -10, 5, 0);

        // Rechte Wand
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 100), wallMat);
        rightWall.position.set(10, 5, 0);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        this.alleyGroup.add(rightWall);
        PhysicCore.createStaticBox(1, 10, 100, 10, 5, 0);

        // C. DER SCHUTZZAUN (Hinter dem Spieler)
        const fenceGeo = new THREE.BoxGeometry(20, 4, 0.5);
        const fenceMat = new THREE.MeshStandardMaterial({ 
            color: 0x555555, 
            transparent: true, 
            opacity: 0.5 
        });
        const fence = new THREE.Mesh(fenceGeo, fenceMat);
        fence.position.set(0, 2, 10);
        this.alleyGroup.add(fence);
        
        // D. LICHTQUELLEN (Flackernde Straßenlaternen)
        this.addStreetLight(scene, -8, 8, -20);
        this.addStreetLight(scene, 8, 8, 10);
    },

    // Hilfsfunktion für Laternen
    addStreetLight(scene, x, y, z) {
        const light = new THREE.PointLight(0xffaa00, 1, 15);
        light.position.set(x, y, z);
        scene.add(light);
        
        // Kleiner visueller Lampenkörper
        const lamp = new THREE.Mesh(
            new THREE.SphereGeometry(0.2), 
            new THREE.MeshBasicMaterial({ color: 0xffaa00 })
        );
        lamp.position.copy(light.position);
        scene.add(lamp);
    },

    // 2. ZOMBIE SPAWN-LOGIK
    startSpawning() {
        console.log("WorldAlley: Zombies kommen...");
        
        // Alle 3 Sekunden einen neuen Zombie schicken
        this.zombieSpawnInterval = setInterval(() => {
            if (!Engine.isRunning) return;

            const zombieModel = ActorZombie.create();
            
            // Zombies spawnen weit hinten in der Gasse
            const spawnX = Utils.randomRange(-8, 8);
            zombieModel.position.set(spawnX, 0, -40);
            
            Renderer.scene.add(zombieModel);
            Engine.entities.enemies.push(zombieModel);

            // KI-Logik: Zombie bewegt sich auf den Spieler zu
            zombieModel.userData.update = function() {
                zombieModel.position.z += 0.05; // Langsames Schlurfen
                
                // Ein bisschen Wackeln beim Gehen
                zombieModel.rotation.z = Math.sin(Date.now() * 0.005) * 0.1;
            };

        }, 3000);
    },

    // 3. LEVEL AUFRÄUMEN
    clear() {
        if (this.zombieSpawnInterval) clearInterval(this.zombieSpawnInterval);
        // Hier könnte man die alleyGroup aus der Scene entfernen
    }
};