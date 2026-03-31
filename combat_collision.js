/**
 * COMBAT_COLLISION.JS
 * Die Logik für Trefferabfrage und Schadensberechnung.
 */

const CombatCollision = {
    
    // Prüft, ob Kugeln Gegner treffen
    checkBulletHits(bullets, enemies, scene) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                
                // Distanz-Check zwischen Kugel und Gegner
                // Wir nutzen .distanceTo für 3D-Kollision
                const dist = bullet.position.distanceTo(enemy.position);
                
                if (dist < 1.2) { // Trefferradius
                    this.handleEnemyHit(enemy, j, enemies, scene);
                    this.removeBullet(bullet, i, bullets, scene);
                    
                    // Punkte erhöhen (Greift auf ui_hud.js zu)
                    if (window.UI_HUD) UI_HUD.addScore(100);
                    break;
                }
            }
        }
    },

    // Prüft, ob Zombies den Spieler oder den Zaun erreichen
    checkEnemyAttack(enemies, player, deltaTime) {
        enemies.forEach((enemy, index) => {
            const distToPlayer = enemy.position.distanceTo(player.position);
            
            if (distToPlayer < 1.5) {
                // Spieler nimmt Schaden
                if (window.UI_HUD) UI_HUD.updateHealth(-0.5); 
            }
            
            // Check für die Gasse/Zaun (Zombie-Modus)
            if (window.currentMode === 'zombies' && enemy.position.z > 0) {
                this.handleFenceDamage(enemy, index, enemies);
            }
        });
    },

    handleEnemyHit(enemy, index, enemies, scene) {
        // Effekt: Kleiner Rückstoß oder Partikel (später)
        scene.remove(enemy);
        enemies.splice(index, 1);
        
        // Sound-Effekt Trigger (optional)
        // Utils.playSound('squish'); 
    },

    removeBullet(bullet, index, bullets, scene) {
        scene.remove(bullet);
        bullets.splice(index, 1);
    },

    handleFenceDamage(enemy, index, enemies) {
        // Wenn ein Zombie den Zaun erreicht
        if (window.UI_HUD) UI_HUD.updateHealth(-10);
        
        // Zombie verschwindet nach dem Angriff auf den Zaun
        const scene = enemy.parent;
        if (scene) scene.remove(enemy);
        enemies.splice(index, 1);
    }
};