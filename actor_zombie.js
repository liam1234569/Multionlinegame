/**
 * ACTOR_ZOMBIE.JS
 * Erstellt das visuelle 3D-Modell der Zombies.
 * Stil: Low-Poly / Retro-Horror
 */

const ActorZombie = {
    // Erstellt einen neuen Zombie
    create() {
        const zombieGroup = new THREE.Group();

        // Zufällige Variationen für die "Realistik" im Retro-Stil
        const skinColors = [0x668866, 0x557755, 0x779977]; // Verschiedene Verwesungs-Grüntöne
        const clothColors = [0x444444, 0x223322, 0x332222]; // Dreckige, dunkle Farben
        
        const skinMat = new THREE.MeshStandardMaterial({ 
            color: skinColors[Math.floor(Math.random() * skinColors.length)] 
        });
        const clothMat = new THREE.MeshStandardMaterial({ 
            color: clothColors[Math.floor(Math.random() * clothColors.length)] 
        });

        // 1. TORSO (Oberkörper)
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.1, 0.45), clothMat);
        torso.position.y = 1.3;
        torso.castShadow = true;
        zombieGroup.add(torso);

        // 2. KOPF
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), skinMat);
        head.position.y = 2.1;
        head.castShadow = true;
        zombieGroup.add(head);

        // Kleine gruselige Details: Dunkle Augenhöhlen
        const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.05);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.12, 2.15, 0.21);
        zombieGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.12, 2.15, 0.21);
        zombieGroup.add(rightEye);

        // 3. BEINE (Leicht asymmetrisch für den "Wackelgang")
        const legGeo = new THREE.BoxGeometry(0.32, 0.85, 0.32);
        
        const leftLeg = new THREE.Mesh(legGeo, clothMat);
        leftLeg.position.set(-0.22, 0.5, 0.05);
        leftLeg.rotation.x = 0.1; 
        leftLeg.castShadow = true;
        zombieGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, clothMat);
        rightLeg.position.set(0.22, 0.5, -0.05);
        rightLeg.rotation.x = -0.1;
        rightLeg.castShadow = true;
        zombieGroup.add(rightLeg);

        // 4. ARME (Nach vorne gestreckt wie bei einem Zombie)
        const armGeo = new THREE.BoxGeometry(0.25, 0.8, 0.25);
        
        // Linker Arm nach vorne
        const leftArm = new THREE.Mesh(armGeo, skinMat);
        leftArm.position.set(-0.55, 1.5, 0.35);
        leftArm.rotation.x = -Math.PI / 2.2; // Fast waagerecht nach vorne
        leftArm.castShadow = true;
        zombieGroup.add(leftArm);

        // Rechter Arm nach vorne (leicht versetzt)
        const rightArm = new THREE.Mesh(armGeo, skinMat);
        rightArm.position.set(0.55, 1.45, 0.4);
        rightArm.rotation.x = -Math.PI / 2; 
        rightArm.castShadow = true;
        zombieGroup.add(rightArm);

        // Ein "Target"-Punkt für die KI, um zu wissen, wo vorne ist
        const frontNode = new THREE.Object3D();
        frontNode.position.set(0, 0, 1);
        zombieGroup.add(frontNode);

        return zombieGroup;
    }
};