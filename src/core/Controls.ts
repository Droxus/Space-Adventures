import * as THREE from "three";

/**
 * An instance of this class perceives a user's actions within the game,
 * and controls the game input.
 */
export class Controls {
    private camera: THREE.PerspectiveCamera;
    private cameraSpeed: number;
    private sensitivity: number;
    private readonly euler: THREE.Euler;
    private readonly listeners: Set<() => any>;
    private readonly keydowns: Map<string, () => any>
    public constructor(params: { domElement: HTMLCanvasElement }) {
        const { domElement } = params;
        this.camera = new THREE.PerspectiveCamera(75, domElement.width / domElement.height, 0.1, 1000);
        this.listeners = new Set();
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.cameraSpeed = 10;
        this.sensitivity = 1;
        this.keydowns = new Map([
            ['KeyW', () => this._translateCameraTo({ z: -this.cameraSpeed })],
            ['KeyA', () => this._translateCameraTo({ x: -this.cameraSpeed })],
            ['KeyS', () => this._translateCameraTo({ z: this.cameraSpeed })],
            ['KeyD', () => this._translateCameraTo({ x: this.cameraSpeed })],
            ['Space', () => this._translateCameraTo({ y: this.cameraSpeed })],
            ['ShiftLeft', () => this._translateCameraTo({ y: -this.cameraSpeed })],
        ]);
        domElement.addEventListener('click', this._onClick.bind(this), false);
        domElement.addEventListener('mousemove', this._onMouseMove.bind(this), false);
        window.addEventListener('keydown', this._onKeyDown.bind(this), false);
    }
    public getCamera(): THREE.Camera {
        return this.camera;
    }
    /**
     * Update this controls within the {@link context} specified.
     * @param context a context object to update the controls with
     */
    public update(context: { viewport: { width: number, height: number } }): void {
        const { width, height } = context.viewport;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
    private _translateCameraTo(params: Partial<{ x: number, y: number, z: number }>): void {
        const { x, y, z } = params;
        if (x) this.camera.translateX(x);
        if (y) this.camera.translateY(y);
        if (z) this.camera.translateZ(z);
    }
    private _onClick(event: MouseEvent): void {
        (event.target as HTMLElement).requestPointerLock();
    }
    private _onKeyDown(event: KeyboardEvent): void {
        if (!this.keydowns.has(event.code)) return;
        const processThisEventCode = this.keydowns.get(event.code);
        if (processThisEventCode) processThisEventCode();
        this.fireListeners(event.type);
    }
    private _onMouseMove(event: MouseEvent): void {
        const movementX = event.movementX || (event as any).mozMovementX || (event as any).webkitMovementX || 0;
        const movementY = event.movementY || (event as any).mozMovementY || (event as any).webkitMovementY || 0;

        this.euler.x -= movementY / (1 / this.sensitivity * 1000)
        this.euler.x = Math.max(Math.min(Math.PI / 2, this.euler.x), -Math.PI / 2)
        this.euler.y -= movementX / (1 / this.sensitivity * 1000)

        this.camera.quaternion.setFromEuler(this.euler.clone());

        this.fireListeners(event.type)
    }
    /**
     * @todo implement {@link eventType}
     *
     * Call the callback received in the addListener(callback) method of this class,
     * which would make the Game class's instance to re-render its scene
     * @param eventType an event type what listeners to get fired by
     */
    protected fireListeners(eventType?: string): void {
        this.listeners.forEach(callback => callback());
    }
    /**
     * @todo implement {@link eventType}
     *
     * Add a function that needs to be called whenever these controls are changed
     * @param callback a function to call when an event occurs on these controls
     * @param eventType an event type what listeners to get fired by
     */
    public addListener(callback: (...args: any) => any, eventType?: string): void {
        this.listeners.add(callback);
    }
    /**
     * @todo implement {@link eventType}
     *
     * Remove a function that no longer needs to be called whenever these controls are changed
     * @param callback a function to stop calling when an event occurs on these controls
     * @param eventType an event type what listeners to get fired by
     */
    public removeListener(callback: () => void, eventType?: string): void {
        this.listeners.delete(callback);
    }
}