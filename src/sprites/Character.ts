import { generateUUID } from "three/src/math/MathUtils.js";
import { Graphic } from "../core/Graphic";

export class Character extends Graphic {
    private name: string;
    constructor(params?: { name: string, node?: THREE.Object3D, material?: THREE.Material; geometry?: THREE.BufferGeometry }) {
        super(params);
        this.name = params?.name ?? generateUUID();
    }
    public getName(): string {
        return this.name;
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