import * as THREE from "three";

/**
 * An instance of this class perceives a user's actions within the game,
 * and controls the game input.
 */
export class Controls {
    private camera: THREE.PerspectiveCamera;
    public constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
}