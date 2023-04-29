import { Graphic } from "./Graphic";

/**
 * This class carries over semantics over grouping of {@link Graphic},
 * and lets create more complex graphic objects on the scene.
 */
export class Group extends Graphic {
    private children: Graphic[];
    constructor(params?: ConstructorParameters<typeof Graphic>[0]) {
        super(params);
        this.children = [];
    }
    /**
     * Add a {@link child} to the scene graph.
     * @param child a node to be added
     */
    public add(child: Graphic): void {
        this.children.push(child);
        this.getNode().add(child.getNode());
    }
    /**
     * Access the children of this node.
     * @returns the list (in the order of addtion) of all the children nodes in this group node
     */
    public getChildren(): Graphic[] {
        return this.children;
    }
}