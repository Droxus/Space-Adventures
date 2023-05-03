import * as THREE from "three";
import { Game } from "./Game";
/**
 * An instance of this class perceives a user's actions within the game,
 * and controls the game input.
 */
export class Controls {
    private static camera: THREE.PerspectiveCamera;
    public static controls: any;
    public static euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
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
    public static createControls(): void {
        let speed = 10, sensitivity = 1
        // flyControls for comfortable devloping   
        let canvas = document.querySelector('#canvas') as HTMLCanvasElement;
          const canvasClick = () => {
            canvas.requestPointerLock();
          };
          
          document.addEventListener('pointerlockchange', () => {console.log('sam loh')}, false);
          canvas.addEventListener('click', canvasClick, false);
          
          canvas.addEventListener("mousemove", (event: any) => {
            console.log('asd')
            const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        
            Controls.euler.x -= movementY / (1 / sensitivity * 1000)
            Controls. euler.y -= movementX / (1 / sensitivity * 1000) 
        
            Controls.euler.x = Math.max(Math.min(Math.PI/2, Controls.euler.x), -Math.PI/2)
            Controls.camera.quaternion.setFromEuler( Controls.euler );
            Game.needRender = true
        });
        window.addEventListener('keydown', (event) => {
            console.log(event.code)
            switch (event.code) {
                case 'KeyW':
                        Controls.camera.translateZ(-speed)
                    break;
                case 'KeyA':
                        Controls.camera.translateX(-speed)
                    break;
                case 'KeyS':
                        Controls.camera.translateZ(speed)
                    break;
                case 'KeyD':
                        Controls.camera.translateX(speed)
                    break;
                case 'Space':
                        Controls.camera.translateY(speed)
                    break;
                case 'ShiftLeft':
                        Controls.camera.translateY(-speed)
                    break;
            }
            Game.needRender = true
        })
    }
}