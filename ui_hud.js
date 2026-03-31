/**
 * UI_HUD.JS
 * Die Live-Anzeige während des Spiels (Heads-Up-Display).
 * Verwaltet Score, Lebensbalken und Benachrichtigungen.
 */

const UI_HUD = {
    score: 0,
    health: 100,
    maxHealth: 100,
    elements: {
        score: null,
        healthBar: null,
        container: null
    },

    // 1. INITIALISIERUNG
    init() {
        this.elements.score = document.getElementById('score-val');
        this.elements.healthBar = document.getElementById('health-bar');
        this.elements.container = document.getElementById('game-hud');
        
        this.reset();
    },

    // 2. ANZEIGE EINSCHALTEN
    show() {
        if (this.elements.container) {
            this.elements.container.classList.remove('hidden');
        }
    },

    // 3. PUNKTE-SYSTEM
    addScore(amount) {
        this.score += amount;
        if (this.elements.score) {
            // Ein kleiner Trick: Wir formatieren die Zahl mit Nullen davor (000100)
            this.elements.score.innerText = this.score.toString().padStart(6, '0');
            
            // Visueller Effekt: Die Zahl kurz "aufblitzen" lassen
            this.elements.score.style.color = '#f1f508'; // Gelb
            setTimeout(() => {
                this.elements.score.style.color = 'white';
            }, 100);
        }
    },

    /**
     * 4. LEBENS-LOGIK
     * @param {number} change - Positiver Wert (Heilung) oder negativer Wert (Schaden)
     */
    updateHealth(change) {
        this.health += change;
        
        // Grenzen einhalten (0 bis 100)
        this.health = Math.max(0, Math.min(this.maxHealth, this.health));

        if (this.elements.healthBar) {
            const percent = (this.health / this.maxHealth) * 100;
            this.elements.healthBar.style.width = percent + "%";

            // Farbe ändern je nach Zustand
            if (percent < 30) {
                this.elements.healthBar.style.background = "linear-gradient(to right, #ff0000, #aa0000)";
                // Alarm-Blinken bei kritischem Leben
                this.elements.healthBar.parentElement.style.boxShadow = "0 0 10px red";
            } else {
                this.elements.healthBar.style.background = "linear-gradient(to right, #ff0000, #ff7b00)";
                this.elements.healthBar.parentElement.style.boxShadow = "none";
            }
        }

        // Game Over prüfen
        if (this.health <= 0) {
            this.triggerGameOver();
        }
    },

    // 5. GAME OVER TRIGGER
    triggerGameOver() {
        console.log("HUD: Spieler ist eliminiert.");
        // Stoppt die Engine
        if (window.Engine) Engine.isRunning = false;
        
        // Zeige das Menü wieder an (mit kleiner Verzögerung für den Effekt)
        setTimeout(() => {
            alert("GAME OVER! Dein Score: " + this.score);
            location.reload(); // Einfachster Weg für einen sauberen Neustart
        }, 500);
    },

    // 6. RESET
    reset() {
        this.score = 0;
        this.health = 100;
        this.updateHealth(0);
        this.addScore(0);
    }
};

// HUD bereit machen
UI_HUD.init();