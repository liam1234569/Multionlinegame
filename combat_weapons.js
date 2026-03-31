/**
 * COMBAT_WEAPONS.JS
 * Zuständig für das Erzeugen von Projektilen und Schuss-Logik.
 */

const CombatWeapons = {
    bullets: [],
    lastShotTime: 0,
    fireRate: 200, // Zeit in Millisekunden zwischen Schüssen

    // Hauptfunktion zum Schießen
    shoot(scene, player, camera, currentMode) {
        const now = Date.now();
        if (now - this.lastShotTime < this.fireRate) return; // Verhindert zu schnelles Schießen
        this.lastShotTime = now;

        // 1. Kugel-Objekt erstellen
        const bulletGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const bulletMat = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Leuchtendes Gelb
        const bullet = new THREE.Mesh(bulletGeo, bulletMat);

        // 2. Startposition (direkt bei der Waffe des Spielers)
        bullet.position.copy(player.position);
        bullet.position.y += 1.3; // Höhe der Waffe

        // 3. Schussrichtung berechnen
        // Wir schießen in die Richtung, in die die Kamera schaut
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        // Speichere die Richtung in den UserData der Kugel für das Update
        bullet.userData.velocity = direction.multiplyScalar(1.5); // Geschwindigkeit der Kugel

        // 4. Zur Szene und zum Array hinzufügen
        scene.add(bullet);
        this.bullets.push(bullet);

        // 5. Mündungsfeuer-Effekt (kurzes Aufblitzen)
        this.createMuzzleFlash(scene, bullet.position);
    },

    // Bewegt alle aktiven Kugeln (wird in der Engine-Main aufgerufen)
    updateBullets(scene) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.position.add(b.userData.velocity);

            // Kugel löschen, wenn sie zu weit weg ist (Performance!)
            if (b.position.length() > 100) {
                scene.remove(b);
                this.bullets.splice(i, 1);
            }
        }
    },

    createMuzzleFlash(scene, position) {
        const flashLight = new THREE.PointLight(0xffaa00, 2, 3);
        flashLight.position.copy(position);
        scene.add(flashLight);

        // Blitz nach 50ms wieder entfernen
        setTimeout(() => {
            scene.remove(flashLight);
        }, 50);
    }
};