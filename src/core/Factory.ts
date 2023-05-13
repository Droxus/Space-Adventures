import * as THREE from "three";
import { Controls } from "./Controls";
import { Graphic } from "./Graphic";
import { View } from "./View";
import { Group } from "./Group";
import { World } from "./World";
import { Game } from "./Game";

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
    public static createView(props: { domElement?: HTMLElement, controls: Controls}): View {
        return new View(props);
    }
    public static createControls(params: { canvas: HTMLCanvasElement }): Controls {
        return new Controls(params);
    }
    public static createBox(params: { material: { color: string | number }; geometry: {width: number, height: number, depth: number} }): Graphic {
        const { material: { color }, geometry: { width, height, depth }} = params;
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial( { color } );
        return new Graphic({ material, geometry });
    }
    public static createSphere(params: { material: { color: string | number }; geometry: {radius: number, width: number, height: number} }){
        const { material: { color }, geometry: { radius, width, height }} = params;
        const geometry = new THREE.SphereGeometry(radius, width, height);
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
    /**
     * Create a configured {@link Game} to play.
     *
     * @returns an object which the game can be controlled through
     */
    public static createGame(): Game {
        return new Game();
    }
}