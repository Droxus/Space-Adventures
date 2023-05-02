import { Controls } from './Controls';
import { Factory } from './Factory';
import { View } from './View';
import { World } from './World';

enum StateFlag {
    NONE,
    STARTED,
    PAUSED,
    ENDED
}

export class Game {
    private domElement: HTMLCanvasElement;
    private controls: Controls;
    private view: View;
    private world: World;
    private state: StateFlag
    private domElementSizeObserver: ResizeObserver;
    private animationRequestId: any;
    private needRender: boolean;
    constructor() {
        this.state = StateFlag.NONE;
        this.needRender = false;
        this.domElement = document.querySelector<HTMLCanvasElement>('#canvas') ??
            document.body.appendChild(document.createElement('canvas'));
        this.controls = Factory.createControls();
        this.view = Factory.createView({ domElement: this.domElement, controls: this.controls });
        this.world = Factory.createWorld();
        this.domElementSizeObserver = new ResizeObserver(this._onDomElementSizeChanged.bind(this));
    }
    public start() {
        this.state = StateFlag.STARTED;
        this._initScene();
        this._observeDomElementSizeChange();
        this._animate();
    }
    public end(): void {
        this.state = StateFlag.ENDED;
        this._disanimate();
        this._unobserveDomElementSizeChange();
        this._destroyScene();
    }
    private _initScene(): void {
        const boxGeometry = { width: 1, height: 1, depth: 1 };
        const boxMaterial = { color: 0x00ff00 };
        const box = Factory.createBox({ geometry: boxGeometry, material: boxMaterial })
        this._createPlanetarySystem({x: 0, y: 0, z: 0}, 5)
        this.world.getMainGroup().add(box);
        box.getNode().position.set(5, 5, 0)
        this.controls.getCamera().position.z = 200;
        this.needRender = true;
    }
    private _createPlanetarySystem(center: {x: number, y: number, z: number}, planetsNumber: number): void {
        let starSize = 5 + Math.ceil(Math.random() * 5)
        // mother star creating
        const star = Factory.createSphere({ geometry: { radius: starSize, width: 32, height: 16 }, material: { color: 0xfff000 } })
        this.world.getMainGroup().add(star);
        star.getNode().position.set(center.x, center.y, center.z)
        // creating planets
        for (let i = 0; i < planetsNumber; i++){
            let planetSize = Math.ceil(Math.random() * 4)
            const planet = Factory.createSphere({ geometry: { radius: planetSize, width: 32, height: 16 }, material: { color: 0xffff0 } })
            this.world.getMainGroup().add(planet);
            let betweenRandom = 10 + Math.ceil(Math.random() * 4)
            let betweenDistance = i * (2 * betweenRandom + (starSize + planetSize) * 2)
            let y = betweenDistance * (Math.random() - 0.5) * 2
            // (x - center.x)^2 + (y - center.y)^2 = betweenDistance^2
            // x = sqrt(betweenDistance^2 - (y - center.y)^2) + center.x
            let x = Math.sqrt(Math.pow(betweenDistance, 2) - Math.pow(y - center.y, 2)) + center.x
            // flip coin (true or false have the same chances)
            x = Math.round(Math.random()) == 0 ? x : -x
            planet.getNode().position.set(center.x + x, center.y - y, center.z)
        }
    }
    /** @todo implement */
    private _destroyScene(): void {
        // TODO
    }
    private _observeDomElementSizeChange(): void {
        this.domElementSizeObserver.observe(this.domElement, { box: 'content-box' });
    }
    private _unobserveDomElementSizeChange(): void {
        this.domElementSizeObserver.unobserve(this.domElement);
    }
    private _onDomElementSizeChanged([{ devicePixelContentBoxSize, contentBoxSize, contentRect }]: ResizeObserverEntry[]): void {
        const dpr = devicePixelContentBoxSize ? 1 : window.devicePixelRatio;
        const boxSize = devicePixelContentBoxSize?.[0] ?? contentBoxSize?.[0] ?? contentBoxSize;
        let width = boxSize?.inlineSize ?? contentRect.width;
        let height = boxSize?.blockSize ?? contentRect.height;
        width = Math.round(width * dpr);
        height = Math.round(height * dpr);
        const needResize = this.domElement.width !== width || this.domElement.height !== height;
        needResize && this.view.setSize({ width, height });
        needResize && this.controls.update({ viewport: { width, height } });
        this.needRender = needResize;
    }
    private _animate(): void {
        this.needRender && this.view.render(this.world);
        this.needRender = false;
        this.animationRequestId = requestAnimationFrame(this._animate.bind(this));
    }
    private _disanimate(): void {
        this.animationRequestId && cancelAnimationFrame(this.animationRequestId);
    }
}