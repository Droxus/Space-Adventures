import * as THREE from "three";

/**
 * The smallest building block of the game.
 * Extend this class to let your entity be added to the {@link World} scene graph.
 */
export class Graphic {
    private node: THREE.Object3D;
    public constructor(params?: { node?: THREE.Object3D, material?: THREE.Material; geometry?: THREE.BufferGeometry}) {
        const { node, material, geometry } = params ?? {};
        this.node = node ?? new THREE.Mesh(geometry, material);
    }
    /**
     * Access the node object responsible for holding the geometry, material, etc.
     * @returns this object's THREE.js representation of the node in the THREE.js scene graph
     */
    public getNode(): THREE.Object3D {
        return this.node;
    }
}