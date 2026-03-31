const Engine = {
    isRunning: false,
    init() {
        console.log("Engine: Initialisiere Systeme...");
        
        // Prüfen, ob der Renderer geladen ist
        if (typeof Renderer !== 'undefined' && Renderer.init) {
            Renderer.init();
            console.log("Renderer bereit.");
        } else {
            console.error("Engine Fehler: Renderer oder Renderer.init nicht gefunden!");
            return;
        }

        // Ladebildschirm weg, Menü her
        document.getElementById('loader-screen').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
    },

    start(mode) {
        this.isRunning = true;
        console.log("Starte Modus: " + mode);
        // Hier folgen deine Welt-Lade-Befehle
        this.gameLoop();
    },

    gameLoop() {
        if (!this.isRunning) return;
        
        // Nutzt webGLRenderer aus deinem Screenshot
        if (Renderer.webGLRenderer && Renderer.scene && Renderer.camera) {
            Renderer.webGLRenderer.render(Renderer.scene, Renderer.camera);
        }
        requestAnimationFrame(() => this.gameLoop());
    }
};

window.addEventListener('load', () => Engine.init());
