import * as THREE from "three";
import { Game } from "./Game";
import { View } from "./View";
/**
 * An instance of this class perceives a user's actions within the game,
 * and controls the game input.
 */
export class Controls {
    private static camera: THREE.PerspectiveCamera;
    public static controls: any;
    public static euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
    private static controlsSpeed: number = 150;
    private static sensitivity: number = 1;
    private static canvas: HTMLCanvasElement = (document.querySelector('#canvas') as HTMLCanvasElement);
    public static cameraSpeed = {x: 0, y: 0, z: 0};
    public constructor() {
        Controls.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        Controls.createControls()
    }
    public getCamera(): THREE.Camera {
        return Controls.camera;
    }
    /**
     * Update this controls within the {@link context} specified.
     * @param context a context object to update the controls with
     */
    public update(context: { viewport: { width: number, height: number } }): void {
        const { width, height } = context.viewport;
        Controls.camera.aspect = width / height;
        Controls.camera.updateProjectionMatrix();
    }
    private static _onDomElementClick(): void {
        Controls.canvas.requestPointerLock();
    }
    public static createControls(): void {
        // flyControls for comfortable devloping   
        document.addEventListener('pointerlockchange', () => {console.log('Pointer has been changed')}, false);
        Controls.canvas.addEventListener('click', Controls._onDomElementClick);
        window.addEventListener('keydown', this._onKeyDown)
        window.addEventListener('keyup', this._onKeyUp)
        Controls.canvas.addEventListener('mousemove', this._onMouseMove)
    }
    private static keydowns = new Map([
        ['KeyW', () => Controls.cameraSpeed.z = -1],
        ['KeyA', () => Controls.cameraSpeed.x = -1],
        ['KeyS', () => Controls.cameraSpeed.z = 1],
        ['KeyD', () => Controls.cameraSpeed.x = 1],
        ['Space', () => Controls.cameraSpeed.y = 1],
        ['ShiftLeft', () => Controls.cameraSpeed.y = -1],
    ]);
    private static keyup = new Map([
        ['KeyW', () => Controls.cameraSpeed.z = Math.max(0, Controls.cameraSpeed.z)],
        ['KeyA', () => Controls.cameraSpeed.x = Math.max(0, Controls.cameraSpeed.x)],
        ['KeyS', () => Controls.cameraSpeed.z = Math.min(0, Controls.cameraSpeed.z)],
        ['KeyD', () => Controls.cameraSpeed.x = Math.min(0, Controls.cameraSpeed.x)],
        ['Space', () => Controls.cameraSpeed.y = Math.min(0, Controls.cameraSpeed.y)],
        ['ShiftLeft', () => Controls.cameraSpeed.y = Math.max(0, Controls.cameraSpeed.y)],
    ]);
    private static translateCameraTo(params: Partial<{ x: number, y: number, z: number }>): void {
        const { x, y, z } = params;
        x && Controls.camera.translateX(x);
        y && Controls.camera.translateY(y);
        z && Controls.camera.translateZ(z);
    }
    private static _onKeyDown(event: KeyboardEvent): void {
        if (Controls.keydowns.has(event.code)){
            const processThisEventCode = Controls.keydowns.get(event.code);
            if (processThisEventCode) processThisEventCode();
        }
    }
    private static _onKeyUp(event: KeyboardEvent): void {
        if (Controls.keyup.has(event.code)){
            const processThisEventCode = Controls.keyup.get(event.code);
            if (processThisEventCode) processThisEventCode();
        }
    }
    private static _fireChangeEvent(): void {
        Game.makeRender()
        // call the callback received in the addListener(callback) method of this class,
        // which would make the Game class's instance to re-render its scene
    }
    private static  _onMouseMove(event: MouseEvent): void {
            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;

            Controls.euler.x -= movementY / (1 / Controls.sensitivity * 1000)
            Controls.euler.y -= movementX / (1 / Controls.sensitivity * 1000) 
        
            Controls.euler.x = Math.max(Math.min(Math.PI/2, Controls.euler.x), -Math.PI/2)
            Controls.camera.quaternion.setFromEuler( Controls.euler );
            Game.makeRender()
    }
    public static makeObjectMove(params: {obj: THREE.Object3D, diffPosition: {x: number, y: number, z: number}}){
        Controls.translateCameraTo({ x: params.diffPosition.x * Controls.controlsSpeed * Game.deltaTime})
        Controls.translateCameraTo({ y: params.diffPosition.y * Controls.controlsSpeed * Game.deltaTime})
        Controls.translateCameraTo({ z: params.diffPosition.z * Controls.controlsSpeed * Game.deltaTime})
        Controls._fireChangeEvent()
    }
}