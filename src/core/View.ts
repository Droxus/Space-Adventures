import * as THREE from "three";
import { Controls } from "./Controls";
import { Graphic } from "./Graphic";

/** An instance of this class knows how to render an object to a DOM element specified */
export class View {
    private renderer: THREE.WebGLRenderer;
    private controls: Controls;
    constructor(params: { domElement?: HTMLElement, controls: Controls }) {
        let { domElement, controls } = params;
        this.controls = controls;
        domElement ??= document.body.appendChild(document.createElement('canvas'));
        this.renderer = new THREE.WebGLRenderer({ canvas: domElement });
    }
    /**
     * Access the DOM element used to render the graph scene image to
     * @returns an instance of the DOM element used to render the image to (typically {@link HTMLCanvasElement})
     */
    public getDomElement(): HTMLElement {
        return this.renderer.domElement;
    }
    /**
     * Render {@link object} to {@link domElement} with {@link controls}
     * @param object an objec to start a graph scene's rendering from (root of the scene)
     */
    public render(object: Graphic): void {
        this.renderer.render(object.getNode(), this.controls.getCamera());
    }
    public setSize({ width, height }: { width: number, height: number }): void {
        const needResize = this.renderer.domElement.width !== width || this.renderer.domElement.height !== height;
        needResize && this.renderer.setSize(width, height, true);
        needResize && this.controls.update({ viewport: { width, height } })
    }
}