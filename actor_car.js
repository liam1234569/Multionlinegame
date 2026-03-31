/**
 * ACTOR_CAR.JS
 * Zuständig für das visuelle 3D-Modell des Fahrzeugs.
 */

const ActorCar = {
    // Diese Funktion wird von der Engine aufgerufen, um das Auto in die Szene zu setzen
    create() {
        const carGroup = new THREE.Group();

        // 1. DAS CHASSIS (Hauptkörper)
        const bodyGeo = new THREE.BoxGeometry(2.2, 0.6, 4.5);
        const bodyMat = new THREE.MeshStandardMaterial({ 
            color: 0xcc0000, // Sportliches Rot
            metalness: 0.5, 
            roughness: 0.2 
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.7;
        body.castShadow = true;
        carGroup.add(body);

        // 2. DIE KABINE (Fenster & Dach)
        const cabinGeo = new THREE.BoxGeometry(1.8, 0.6, 2.2);
        const cabinMat = new THREE.MeshStandardMaterial({ 
            color: 0x333333, 
            transparent: true, 
            opacity: 0.8 
        });
        const cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.set(0, 1.3, -0.3); // Etwas nach hinten versetzt
        cabin.castShadow = true;
        carGroup.add(cabin);

        // 3. DIE RÄDER
        const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 24);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        
        // Positionen für die 4 Räder [x, y, z]
        const wheelPositions = [
            [-1.1, 0.45, 1.4],  // Vorne Links
            [1.1, 0.45, 1.4],   // Vorne Rechts
            [-1.1, 0.45, -1.4], // Hinten Links
            [1.1, 0.45, -1.4]   // Hinten Rechts
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI / 2; // Rad auf die Seite legen
            wheel.position.set(pos[0], pos[1], pos[2]);
            wheel.castShadow = true;
            carGroup.add(wheel);
        });

        // 4. SCHEINWERFER (Vorne)
        const lightGeo = new THREE.BoxGeometry(0.5, 0.2, 0.1);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Leuchtendes Weiß
        
        const leftLight = new THREE.Mesh(lightGeo, lightMat);
        leftLight.position.set(-0.7, 0.8, 2.25);
        carGroup.add(leftLight);

        const rightLight = new THREE.Mesh(lightGeo, lightMat);
        rightLight.position.set(0.7, 0.8, 2.25);
        carGroup.add(rightLight);

        // 5. RÜCKLICHTER (Hinten)
        const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rotes Licht
        
        const leftTail = new THREE.Mesh(lightGeo, tailLightMat);
        leftTail.position.set(-0.7, 0.8, -2.25);
        carGroup.add(leftTail);

        const rightTail = new THREE.Mesh(lightGeo, tailLightMat);
        rightTail.position.set(0.7, 0.8, -2.25);
        carGroup.add(rightTail);

        return carGroup;
    }
};