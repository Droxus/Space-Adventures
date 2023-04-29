import * as THREE from "three";
import { Controls } from "./Controls";
import { Graphic } from "./Graphic";

/** An instance of this class knows how to render an object to a DOM element specified */
export class View {
    private renderer: THREE.WebGLRenderer;
    private controls: Controls;
    constructor(params: { domElement: HTMLElement, controls: Controls }) {
        const { domElement, controls } = params;
        this.controls = controls;
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
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(object.getNode(), this.controls.getCamera());
    }
}