const InputKeyboard = {
    keys: {},

    init() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        window.addEventListener('mousedown', (e) => {
            if (window.Engine && Engine.isRunning) {
                if (document.pointerLockElement !== document.body) {
                    document.body.requestPointerLock();
                } else {
                    if (window.currentMode === 'zombies') {
                        CombatWeapons.shoot(Renderer.scene, Engine.entities.player, Renderer.camera);
                    }
                }
            }
        });
    },

    getMovement() {
        let x = 0;
        let z = 0;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) z -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) z += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) x -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) x += 1;

        const length = Math.sqrt(x * x + z * z);
        if (length > 0) {
            x /= length;
            z /= length;
        }
        return { x, z };
    },

    getRotation() {
        // Wird von der Engine genutzt
        return { x: 0, y: 0 };
    }
};

window.InputKeyboard = InputKeyboard;
InputKeyboard.init();
