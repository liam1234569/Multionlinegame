/**
 * ACTOR_PLAYER.JS
 * Erstellt das visuelle 3D-Modell des Spielers (Mensch).
 * Stil: Low-Poly / GTA 3 Style
 */

const ActorPlayer = {
    create() {
        const playerGroup = new THREE.Group();

        // Materialien (Farben für den GTA-Look)
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Hautfarbe
        const shirtMat = new THREE.MeshStandardMaterial({ color: 0x3366ff }); // Blaues Shirt
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dunkle Hose
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });  // Schwarze Schuhe

        // 1. TORSO (Oberkörper)
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.4), shirtMat);
        torso.position.y = 1.3;
        torso.castShadow = true;
        playerGroup.add(torso);

        // 2. KOPF
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), skinMat);
        head.position.y = 2.0;
        head.castShadow = true;
        playerGroup.add(head);

        // 3. BEINE
        const legGeo = new THREE.BoxGeometry(0.3, 0.8, 0.3);
        
        const leftLeg = new THREE.Mesh(legGeo, pantsMat);
        leftLeg.position.set(-0.2, 0.5, 0);
        leftLeg.castShadow = true;
        playerGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, pantsMat);
        rightLeg.position.set(0.2, 0.5, 0);
        rightLeg.castShadow = true;
        playerGroup.add(rightLeg);

        // 4. ARME
        const armGeo = new THREE.BoxGeometry(0.25, 0.8, 0.25);
        
        const leftArm = new THREE.Mesh(armGeo, shirtMat);
        leftArm.position.set(-0.55, 1.3, 0);
        leftArm.castShadow = true;
        playerGroup.add(leftArm);

        // Rechter Arm (nach vorne gestreckt, um die Waffe zu halten)
        const rightArm = new THREE.Mesh(armGeo, shirtMat);
        rightArm.position.set(0.55, 1.3, 0.2);
        rightArm.rotation.x = -Math.PI / 3; // Arm leicht anheben
        rightArm.castShadow = true;
        playerGroup.add(rightArm);

        // 5. WAFFE (Pistole / SMG Style)
        const gunGroup = new THREE.Group();
        const gunBody = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 0.5), new THREE.MeshStandardMaterial({ color: 0x222222 }));
        const gunHandle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.15), new THREE.MeshStandardMaterial({ color: 0x111111 }));
        gunHandle.position.set(0, -0.15, -0.1);
        gunGroup.add(gunBody);
        gunGroup.add(gunHandle);

        // Waffe in die rechte Hand legen
        gunGroup.position.set(0.55, 1.1, 0.6);
        playerGroup.add(gunGroup);

        // Hilfs-Objekt für das Fadenkreuz (wohin der Spieler schaut)
        const lookAtTarget = new THREE.Object3D();
        lookAtTarget.position.set(0, 1.5, 10);
        playerGroup.add(lookAtTarget);

        return playerGroup;
    }
};