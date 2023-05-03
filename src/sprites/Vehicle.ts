import { Graphic } from "../core/Graphic";

export class Vehicle extends Graphic {
    constructor(params?: { node?: THREE.Object3D, material?: THREE.Material; geometry?: THREE.BufferGeometry}) {
        super(params);
    }
}