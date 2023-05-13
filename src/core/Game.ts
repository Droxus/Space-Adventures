import { Controls } from "./Controls";
import { Factory } from "./Factory";
import { View } from "./View";
import { World } from "./World";

enum StateFlag {
  NONE,
  STARTED,
  PAUSED,
  ENDED,
}

export class Game {
  private domElement: HTMLCanvasElement;
  private controls: Controls;
  private view: View;
  private world: World;
  private state: StateFlag;
  /** holds a reference to a listener of the {@link domElement} size change events */
  private domElementSizeObserver: ResizeObserver;
  /** {@link requestAnimationFrame} request ID to use with {@link cancelAnimationFrame} */
  private animationRequestId: any;
  /** tells the game loop whether its scene needs to be re-rendered (true) or not */
  private needRender: boolean;
  constructor() {
    this.state = StateFlag.NONE;
    this.needRender = false;
    this.domElement = document.querySelector("#canvas") as HTMLCanvasElement;
    this.controls = Factory.createControls({ canvas: this.domElement });
    this.view = Factory.createView({
      domElement: this.domElement,
      controls: this.controls,
    });
    this.world = Factory.createWorld();
    this.domElementSizeObserver = new ResizeObserver(
      this._onDomElementSizeChanged.bind(this)
    );
    this._onControlsChange = this._onControlsChange.bind(this);
  }
  /**
   * Starts the game with an initial setup, such as a spawn point, a level, a player, etc.
   */
  public start() {
    this.state = StateFlag.STARTED;
    this._initScene();
    this._observeDomElementSizeChange();
    this._animate();
    this.controls.addListener(this._onControlsChange);
  }
  /**
   * Ends the game by terminating its animation process, disposing the game resources, etc.
   */
  public end(): void {
    this.state = StateFlag.ENDED;
    this._disanimate();
    this._unobserveDomElementSizeChange();
    this._destroyScene();
    this.controls.removeListener(this._onControlsChange);
  }
  private _onControlsChange(): void {
    this.needRender = true;
  }
  /**
   * This game's initial setup of the scene graph.
   */
  private _initScene(): void {
    const boxGeometry = { width: 1, height: 1, depth: 1 };
    const boxMaterial = { color: 0x00ff00 };
    const box = Factory.createBox({
      geometry: boxGeometry,
      material: boxMaterial,
    });
    this._createPlanetarySystem({ x: 0, y: 0, z: 0 }, 5);
    this.world.getMainGroup().add(box);
    box.getNode().position.set(5, 5, 0);
    // comfortable poisition - not magic number
    this.controls.getCamera().position.z = 200;
    this.needRender = true;
  }
  private _createPlanetarySystem(
    center: { x: number; y: number; z: number },
    planetsNumber: number
  ): void {
    let minimumStarSize = 5;
    let sumRandomSizeFactor = 5;
    let starSize = minimumStarSize + Math.ceil(Math.random() * sumRandomSizeFactor);
    // mother star creating
    let sphereMaxWidthSegments = 64;
    let sphereMaxHeightSegments = 32;
    let starMaterialColor = 'yellow'
    const star = Factory.createSphere({
      geometry: { radius: starSize, width: sphereMaxWidthSegments, height: sphereMaxHeightSegments },
      material: { color: starMaterialColor },
    });
    this.world.getMainGroup().add(star);
    star.getNode().position.set(center.x, center.y, center.z);
    // creating planets
    for (let i = 1; i <= planetsNumber; i++) {
        let planetSizeRadiusLimit = 4;
        let planetSizeLimit = planetSizeRadiusLimit * 2;
        let planetSize = Math.ceil(Math.random() * planetSizeRadiusLimit);
        let planetMaterialColor = 'aqua'
        const planet = Factory.createSphere({
            geometry: { radius: planetSize, width: sphereMaxWidthSegments, height: sphereMaxHeightSegments },
            material: { color: planetMaterialColor },
        });
        this.world.getMainGroup().add(planet);
        let betweenFactor = planetSizeLimit;
        let sizeOfTwoPlanets = betweenFactor * 2;
        let betweenRandom = sizeOfTwoPlanets + Math.ceil(Math.random() * sizeOfTwoPlanets);
        let betweenDistance = i * (betweenRandom + (starSize + planetSize));
        // 0.5 because it's average of Math.random interval [0; 1)
        // 2 because to get random num from interval (-1; 1)
        let randomYfactor = (Math.random() - 0.5) * 2
        let y = betweenDistance * randomYfactor;
        // (x - center.x)^2 + (y - center.y)^2 = betweenDistance^2
        // x = sqrt(betweenDistance^2 - (y - center.y)^2) + center.x
        let x = Math.sqrt(Math.pow(betweenDistance, 2) - Math.pow(y - center.y, 2)) + center.x;
        // flip coin (true or false have the same chances)
        x = Math.round(Math.random()) == 0 ? x : -x;
        planet.getNode().position.set(center.x + x, center.y + y, center.z);
    }
  }
  /**
   * Describes the steps to efficiently dispose the resources, such as
   * closing websockets, ports,
   * revoking network requests,
   * stopping requests sent through {@link setTimeout}, {@link setInterval}, or {@link requestAnimationFrame}
   * removing listeners from any models events,
   * unsubscribing from any change subscriptions,
   * freeing GPU memory by disposing {@link THREE.Material}s and their textures,
   * cleaning up {@link localStorage},
   */
  private _destroyScene(): void {
    // TODO
  }
  private _observeDomElementSizeChange(): void {
    this.domElementSizeObserver.observe(this.domElement, {
      box: "content-box",
    });
  }
  private _unobserveDomElementSizeChange(): void {
    this.domElementSizeObserver.unobserve(this.domElement);
  }
  /**
   * Tries updating {@link domElement} size
   * according to the new dimensions passed as the arguments of this function.
   *
   * A callback for {@link domElementSizeObserver}
   */
  private _onDomElementSizeChanged([
    { devicePixelContentBoxSize, contentBoxSize, contentRect },
  ]: ResizeObserverEntry[]): void {
    const dpr = devicePixelContentBoxSize ? 1 : window.devicePixelRatio;
    const boxSize =
      devicePixelContentBoxSize?.[0] ?? contentBoxSize?.[0] ?? contentBoxSize;
    let width = boxSize?.inlineSize ?? contentRect.width;
    let height = boxSize?.blockSize ?? contentRect.height;
    width = Math.round(width * dpr);
    height = Math.round(height * dpr);
    const needResize =
      this.domElement.width !== width || this.domElement.height !== height;
    needResize && this.view.setSize({ width, height });
    needResize && this.controls.update({ viewport: { width, height } });
    this.needRender = needResize;
    this._render();
  }
  private _render(): void {
    this.needRender && this.view.render(this.world);
    this.needRender = false;
  }
  /**
   * Tries rendering the scene if there was any changes.
   * A callback for {@link requestAnimationFrame}
   */
  private _animate(): void {
    this._render();
    this.controls.translateCamera(this.controls.cameraSpeed);
    this.animationRequestId = requestAnimationFrame(this._animate.bind(this));
  }
  private _disanimate(): void {
    this.animationRequestId && cancelAnimationFrame(this.animationRequestId);
  }
}
