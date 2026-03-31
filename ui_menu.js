/**
 * UI_MENU.JS
 * Steuert das Hauptmenü, die Geräteauswahl und den Spielstart.
 */

const UI_Menu = {
    settings: {
        device: null, // 'pc' oder 'mobile'
        mode: null    // 'zombies', 'parkour_human', 'parkour_car'
    },

    // 1. MENÜ ANZEIGEN
    show() {
        const menu = document.getElementById('main-menu');
        if (menu) {
            menu.classList.remove('hidden');
            // Zurück zum ersten Schritt, falls man neu startet
            document.getElementById('ui-step-1').classList.remove('hidden');
            document.getElementById('ui-step-2').classList.add('hidden');
        }
    },

    // 2. SCHRITT 1: GERÄT WÄHLEN
    selectDevice(deviceType) {
        this.settings.device = deviceType;
        console.log("UI_Menu: Gerät gewählt -> " + deviceType);

        // UI-Wechsel Animation
        document.getElementById('ui-step-1').classList.add('hidden');
        const step2 = document.getElementById('ui-step-2');
        step2.classList.remove('hidden');
        step2.style.animation = "fadeIn 0.5s ease";

        // Joystick nur anzeigen, wenn Mobile gewählt wurde
        const mobileUI = document.getElementById('mobile-ui');
        if (deviceType === 'mobile') {
            mobileUI.classList.remove('hidden');
        } else {
            mobileUI.classList.add('hidden');
        }
    },

    // 3. SCHRITT 2: MODUS WÄHLEN & START
    selectMode(modeType) {
        this.settings.mode = modeType;
        console.log("UI_Menu: Starte Modus -> " + modeType);

        // Menü ausblenden
        document.getElementById('main-menu').classList.add('hidden');
        
        // HUD einblenden (aus ui_hud.js)
        if (window.UI_HUD) {
            UI_HUD.show();
            UI_HUD.reset();
        }

        // ENGINE STARTEN
        if (window.Engine) {
            Engine.start(modeType);
        }

        
    },

    // 4. ZURÜCK ZUM MENÜ (z.B. nach Game Over)
    hide() {
        document.getElementById('main-menu').classList.add('hidden');
    }
};

// Falls wir Animationen in CSS haben wollen (Optionaler Bonus-Code für die Optik)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
