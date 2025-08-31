import Node from "./Node.ts";

type NodeConstructor = new (...args: any[]) => Node

export default class NodeFactory {
    private static _registry: Map<string, NodeConstructor> = new Map();

    public static register(id: string, constructor: NodeConstructor) {
        this._registry.set(id, constructor);
    }

    public static create(id: string, ...args: any[]) {
        const constructor = this._registry.get(id);
        if (!constructor) throw new Error("Node type doesn't exist");

        return new constructor(...args);
    }
}