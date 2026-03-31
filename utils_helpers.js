/**
 * UTILS_HELPERS.JS
 * Hilfsfunktionen für Mathematik, Zufall und Distanzberechnungen.
 */

const Utils = {
    
    /**
     * Erzeugt eine Zufallszahl zwischen min und max.
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Erzeugt eine zufällige Ganzzahl (wichtig für Array-Indexe).
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Begrenzt einen Wert zwischen einem Minimum und Maximum.
     * @param {number} val 
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    /**
     * Berechnet die 2D-Distanz (Draufsicht) zwischen zwei Objekten.
     * Schneller als 3D-Distanz für einfache Kollisionen.
     */
    getDistance2D(obj1, obj2) {
        const dx = obj1.position.x - obj2.position.x;
        const dz = obj1.position.z - obj2.position.z;
        return Math.sqrt(dx * dx + dz * dz);
    },

    /**
     * Wandelt Grad in Radiant um (Three.js nutzt Radiant).
     * @param {number} degrees 
     */
    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    },

    /**
     * Wählt ein zufälliges Element aus einem Array aus.
     * @param {Array} array 
     */
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Linear Interpolation (Lerp)
     * Hilft beim sanften Annähern von Werten (z.B. Kamera-Bewegung).
     */
    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    },

    /**
     * Erzeugt eine zufällige Position am Rand eines Kreises.
     * Perfekt, um Zombies außerhalb des Sichtfeldes zu spawnen.
     * @param {number} radius 
     */
    getRandomSpawnPoint(radius) {
        const angle = Math.random() * Math.PI * 2;
        return {
            x: Math.cos(angle) * radius,
            z: Math.sin(angle) * radius
        };
    }
};

// Global verfügbar machen
window.Utils = Utils;