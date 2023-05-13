import { Graphic } from "../core/Graphic";

export class Vehicle extends Graphic {
    constructor(params?: { node?: THREE.Object3D, material?: THREE.Material; geometry?: THREE.BufferGeometry }) {
        super(params);
    }
    public moveTo(position: { x: number, y: number, z: number }): void {
        const { x, y, z } = position;
        this.getNode().position.set(x, y, z);
    }
    public rotateIn(rotation: { x: number, y: number, z: number }): void {
        const { x, y, z } = rotation;
        const node = this.getNode();
        x && node.rotateX(x);
        y && node.rotateY(y);
        z && node.rotateZ(z);
    }
}