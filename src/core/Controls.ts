import * as THREE from "three";
import { Game } from "./Game";
import { View } from "./View";
/**
 * An instance of this class perceives a user's actions within the game,
 * and this the game input.
 */
export class Controls {
    private camera: THREE.PerspectiveCamera;
    public this: any;
    public euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
    private thisSpeed: number = 150;
    private sensitivity: number = 1;
    private canvas: HTMLCanvasElement = (document.querySelector('#canvas') as HTMLCanvasElement);
    public cameraSpeed = {x: 0, y: 0, z: 0};
    public constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.createthis()
    }
    public getCamera(): THREE.Camera {
        return this.camera;
    }
    /**
     * Update this this within the {@link context} specified.
     * @param context a context object to update the this with
     */
    public update(context: { viewport: { width: number, height: number } }): void {
        const { width, height } = context.viewport;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
    private  _onDomElementClick(): void {
        this.canvas.requestPointerLock();
    }
    public  createthis(): void {
        // flythis for comfortable devloping   
        document.addEventListener('pointerlockchange', () => {console.log('Pointer has been changed')}, false);
        this.canvas.addEventListener('click', this._onDomElementClick.bind(this));
        window.addEventListener('keydown', this._onKeyDown.bind(this))
        window.addEventListener('keyup', this._onKeyUp.bind(this))
        this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this))
    }
    private  keydowns = new Map([
        ['KeyW', () => this.cameraSpeed.z = -1],
        ['KeyA', () => this.cameraSpeed.x = -1],
        ['KeyS', () => this.cameraSpeed.z = 1],
        ['KeyD', () => this.cameraSpeed.x = 1],
        ['Space', () => this.cameraSpeed.y = 1],
        ['ShiftLeft', () => this.cameraSpeed.y = -1],
    ]);
    private  keyup = new Map([
        ['KeyW', () => this.cameraSpeed.z = Math.max(0, this.cameraSpeed.z)],
        ['KeyA', () => this.cameraSpeed.x = Math.max(0, this.cameraSpeed.x)],
        ['KeyS', () => this.cameraSpeed.z = Math.min(0, this.cameraSpeed.z)],
        ['KeyD', () => this.cameraSpeed.x = Math.min(0, this.cameraSpeed.x)],
        ['Space', () => this.cameraSpeed.y = Math.min(0, this.cameraSpeed.y)],
        ['ShiftLeft', () => this.cameraSpeed.y = Math.max(0, this.cameraSpeed.y)],
    ]);
    private  translateCameraTo(params: Partial<{ x: number, y: number, z: number }>): void {
        const { x, y, z } = params;
        x && this.camera.translateX(x);
        y && this.camera.translateY(y);
        z && this.camera.translateZ(z);
    }
    private  _onKeyDown(event: KeyboardEvent): void {
        if (this.keydowns.has(event.code)){
            const processThisEventCode = this.keydowns.get(event.code);
            if (processThisEventCode) processThisEventCode();
        }
        this._fireChangeEvent()
    }
    private  _onKeyUp(event: KeyboardEvent): void {
        if (this.keyup.has(event.code)){
            const processThisEventCode = this.keyup.get(event.code);
            if (processThisEventCode) processThisEventCode();
        }
    }
    private  _fireChangeEvent(): void {
        Game.makeRender()
        // call the callback received in the addListener(callback) method of this class,
        // which would make the Game class's instance to re-render its scene
    }
    private   _onMouseMove(event: MouseEvent): void {
            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;

            this.euler.x -= movementY / (1 / this.sensitivity * 1000)
            this.euler.y -= movementX / (1 / this.sensitivity * 1000) 
        
            this.euler.x = Math.max(Math.min(Math.PI/2, this.euler.x), -Math.PI/2)
            this.camera.quaternion.setFromEuler( this.euler );
            Game.makeRender()
    }
    public  makeObjectMove(params: {obj: THREE.Object3D, diffPosition: {x: number, y: number, z: number}}){
        this.translateCameraTo({ x: params.diffPosition.x * this.thisSpeed * Game.deltaTime})
        this.translateCameraTo({ y: params.diffPosition.y * this.thisSpeed * Game.deltaTime})
        this.translateCameraTo({ z: params.diffPosition.z * this.thisSpeed * Game.deltaTime})
        if (params.diffPosition.x || params.diffPosition.y || params.diffPosition.z){
            this._fireChangeEvent()
        }
    }
}