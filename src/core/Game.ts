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
    private domElement: HTMLElement;
    private controls: Controls;
    private view: View;
    private world: World;
    private state: StateFlag
    private domElementSizeObserver: ResizeObserver;
    constructor() {
        this.state = StateFlag.NONE;
        this.domElement = document.querySelector<HTMLElement>('#canvas') ??
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
    }
    public end(): void {
        this.state = StateFlag.ENDED;
        this._unobserveDomElementSizeChange();
        this._destroyScene();
    }
    private _initScene(): void {
        const boxGeometry = { width: 1, height: 1, depth: 1 };
        const boxMaterial = { color: 0x00ff00 };
        const box = Factory.createBox({ geometry: boxGeometry, material: boxMaterial })
        this.world.getMainGroup().add(box);
        this.controls.getCamera().position.z = 5;
        this.view.render(this.world);
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
        this.view.setSize({ width, height });
    }
}