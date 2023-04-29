import * as THREE from "three";
import { Group } from "./Group";

/**
 * An instance of this class knows how to manage multiple groups of domain and non-domain objects within it.
 *
 * It forms a root of the graph scene.
 *
 * **An instance of this class must NOT be a child node of any other {@link Group}**
 */
export class World extends Group {
    /** here goes any game-specific character, such as a player, a starship, an astro body, etc.  */
    private mainGroup: Group;
    /** here goes a Heads-Up Display (HUD) specific instances, such as compass, score display, health points display, etc. */
    private hudGroup: Group;
    constructor(props: { mainGroup: Group, hudGroup: Group }) {
        super({node: new THREE.Scene()});
        const { mainGroup, hudGroup } = props;
        this.add(this.mainGroup = mainGroup);
        this.add(this.hudGroup = hudGroup);
    }
    public getMainGroup(): Group {
        return this.mainGroup;
    }
}