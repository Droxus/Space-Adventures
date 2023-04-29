import * as THREE from "three";
import { Controls } from "./Controls";
import { Graphic } from "./Graphic";
import { View } from "./View";
import { Group } from "./Group";
import { World } from "./World";

/**
 * This class knows how to create an object of almost any type in the game.
 *
 * Rather than creating an object from within another object (a composition),
 * consider updating this class
 * with a respective {@link https://refactoring.guru/design-patterns/factory-method | fabric method}
 * in order to:
 * + decouple the domain entities,
 * + invert their dependencies,
 * + facilitate test suits.
 */
export class Factory {
    public static createView(domElement: HTMLElement, controls: Controls): View {
        return new View({ domElement, controls });
    }
    public static createControls(): Controls {
        return new Controls();
    }
    public static createBox(params: { material: { color: string | number }; geometry: {width: number, height: number, depth: number} }): Graphic {
        const { material: { color }, geometry: { width, height, depth }} = params;
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial( { color } );
        return new Graphic({ material, geometry });
    }
    public static createGroup(): Group {
        return new Group();
    }
    public static createWorld(): World {
        const mainGroup = Factory.createGroup();
        const hudGroup = Factory.createGroup();
        return new World({ mainGroup, hudGroup });
    }
}