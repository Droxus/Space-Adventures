import * as THREE from "three";
/**
 * An instance of this class perceives a user's actions within the game,
 * and this the game input.
 */
type ListenerType = (...args: any[]) => any;
export class Controls {
  private camera: THREE.PerspectiveCamera;
  private euler: THREE.Euler;
  private controlsSpeed: number;
  private sensitivity: number;
  private canvas: HTMLCanvasElement;
  public cameraSpeed: THREE.Vector3;
  private listeners: ListenerType[] = [];
  public constructor(params: {canvas: HTMLCanvasElement}) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.euler = new THREE.Euler(0, 0, 0, "YXZ");
    this.controlsSpeed = 1;
    this.sensitivity = 1000;
    this.cameraSpeed = new THREE.Vector3(0, 0, 0);
    this.canvas = params.canvas;
    this.createControls();
  }
  public getCamera(): THREE.Camera {
    return this.camera;
  }
  /**
   * Update this this within the {@link context} specified.
   * @param context a context object to update the this with
   */
  public update(context: {
    viewport: { width: number; height: number };
  }): void {
    const { width, height } = context.viewport;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
  private _onDomElementClick(): void {
    this.canvas.requestPointerLock();
  }
  private createControls(): void {
    this.canvas.addEventListener("click", this._onDomElementClick.bind(this));
    window.addEventListener("keydown", this._onKeyDown.bind(this));
    window.addEventListener("keyup", this._onKeyUp.bind(this));
    this.canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
  }
  private keydowns = new Map([
    ["KeyW", () => (this.cameraSpeed.z = -1)],
    ["KeyA", () => (this.cameraSpeed.x = -1)],
    ["KeyS", () => (this.cameraSpeed.z = 1)],
    ["KeyD", () => (this.cameraSpeed.x = 1)],
    ["Space", () => (this.cameraSpeed.y = 1)],
    ["ShiftLeft", () => (this.cameraSpeed.y = -1)],
  ]);
  private keyup = new Map([
    ["KeyW", () => (this.cameraSpeed.z = Math.max(0, this.cameraSpeed.z))],
    ["KeyA", () => (this.cameraSpeed.x = Math.max(0, this.cameraSpeed.x))],
    ["KeyS", () => (this.cameraSpeed.z = Math.min(0, this.cameraSpeed.z))],
    ["KeyD", () => (this.cameraSpeed.x = Math.min(0, this.cameraSpeed.x))],
    ["Space", () => (this.cameraSpeed.y = Math.min(0, this.cameraSpeed.y))],
    ["ShiftLeft", () => (this.cameraSpeed.y = Math.max(0, this.cameraSpeed.y))],
  ]);
  public translateCamera(
    params: Partial<{ x: number; y: number; z: number }>
  ): void {
    const { x, y, z } = params;
    x && this.camera.translateX(x);
    y && this.camera.translateY(y);
    z && this.camera.translateZ(z);
    const fireListeners = x || y || z;
    fireListeners && this._fireChangeEvent();
  }
  private _onKeyDown(event: KeyboardEvent): void {
    if (this.keydowns.has(event.code)) {
      const processThisEventCode = this.keydowns.get(event.code);
      if (processThisEventCode) processThisEventCode();
    }
    this._fireChangeEvent();
  }
  private _onKeyUp(event: KeyboardEvent): void {
    if (this.keyup.has(event.code)) {
      const processThisEventCode = this.keyup.get(event.code);
      if (processThisEventCode) processThisEventCode();
    }
  }
  private _fireChangeEvent(): void {
    this.listeners.forEach((listener) => listener());
  }
  public addListener(listener: ListenerType): void {
    this.listeners.push(listener);
  }
  public removeListener(listener: ListenerType): void {
    let index = this.listeners.findIndex((element) => element == listener);
    index > -1 && this.listeners.splice(index, 1);
  }
  private _onMouseMove(event: MouseEvent): void {
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    this.euler.x -= movementY / this.sensitivity;
    this.euler.y -= movementX / this.sensitivity;

    this.euler.x = Math.max(Math.min(Math.PI / 2, this.euler.x), -Math.PI / 2);
    this.camera.quaternion.setFromEuler(this.euler);
    this._fireChangeEvent();
  }
}
