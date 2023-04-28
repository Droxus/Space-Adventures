import { BufferGeometry, Material, Mesh, Object3D } from "three";

export class Graphic {
    private node: Object3D;
    public constructor(params: { material: Material; geometry: BufferGeometry}) {
        const { material, geometry } = params;
        this.node = new Mesh(geometry, material);
    }
    public getNode(): Object3D {
        return this.node;
    }
}