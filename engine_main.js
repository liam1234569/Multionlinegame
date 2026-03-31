/**
 * ENGINE_MAIN.JS - Finale, sichere Version
 */
const Engine = {
    isRunning: false,
    lastTime: 0,
    
    init() {
        console.log("Engine: Initialisiere Systeme...");
        
        // Renderer & Physik starten
        if (typeof Renderer !== 'undefined' && Renderer.init) Renderer.init();
        if (typeof PhysicCore !== 'undefined' && PhysicCore.init) PhysicCore.init();
        
        console.log("Engine: Bereit für Spielstart.");

        // Menü anzeigen
        const loader = document.getElementById('loader-screen');
        if (loader) loader.classList.add('hidden');
        
        const menu = document.getElementById('main-menu');
        if (menu) menu.classList.remove('hidden');
    },

    start(mode) {
        if (this.isRunning) return;
        console.log("Engine: Starte Modus -> " + mode);
        this.isRunning = true;
        window.currentMode = mode;

        // 1. Menü verstecken
        const menu = document.getElementById('main-menu');
        if (menu) menu.classList.add('hidden');

        // 2. HUD (Lebensanzeige) anzeigen
        const hud = document.getElementById('ui-hud');
        if (hud) hud.classList.remove('hidden');

        // 3. WELT LADEN (Hier fangen wir Fehler ab!)
        try {
            if (mode === 'zombies' && typeof WorldAlley !== 'undefined') {
                WorldAlley.init(Renderer.scene, PhysicCore.world);
            } else if (typeof WorldParkour !== 'undefined') {
                WorldParkour.init(Renderer.scene, PhysicCore.world, mode);
            } else {
                console.warn("Warnung: Welt-Datei nicht gefunden!");
            }
        } catch (error) {
            // Falls in deiner Gasse ein Fehler ist, stürzt nicht alles ab, 
            // sondern er schreibt es uns in die Konsole!
            console.error("FEHLER BEIM BAUEN DER 3D-WELT:", error);
        }

        // 4. Game Loop starten (Sorgt dafür, dass du nicht nur schwarz siehst)
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    },

    loop(time) {
        if (!this.isRunning) return;

        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        // Physik berechnen
        if (typeof PhysicCore !== 'undefined' && PhysicCore.world) {
            PhysicCore.world.step(1/60);
        }

        // Bild zeichnen
        if (typeof Renderer !== 'undefined' && Renderer.render) {
            Renderer.render();
        }

        requestAnimationFrame((t) => this.loop(t));
    }
};

window.Engine = Engine;
window.addEventListener('load', () => Engine.init());
