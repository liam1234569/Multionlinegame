/**
 * WORLD_PARKOUR.JS
 * Erstellt schwebende Plattformen für Mensch & Auto
 */
const WorldParkour = {
    init(scene, world, mode) {
        console.log("WorldParkour: Baue Level für " + mode);

        // Start-Plattform
        this.createPlatform(scene, world, 0, 0, 0, 10, 1, 10, 0x00ff00);

        // Eine Reihe von Sprüngen
        for(let i = 1; i <= 5; i++) {
            let zPos = i * -15;
            let xPos = (Math.random() - 0.5) * 10;
            let color = (mode === 'parkour_car') ? 0x3366ff : 0xffcc00;
            
            // Für Autos machen wir die Plattformen breiter
            let width = (mode === 'parkour_car') ? 8 : 4;
            
            this.createPlatform(scene, world, xPos, i * 2, zPos, width, 0.5, 6, color);
        }

        console.log("WorldParkour: Parcours bereit.");
    },

    createPlatform(scene, world, x, y, z, w, h, d, color) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({ color: color });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        scene.add(mesh);

        const body = new CANNON.Body({
            mass: 0, // Plattformen schweben fest in der Luft
            shape: new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2))
        });
        body.position.set(x, y, z);
        world.addBody(body);
    }
};

window.WorldParkour = WorldParkour;
