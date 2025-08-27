import EntryNode from "../nodes/EntryNode";
import Node from "../nodes/Node.ts";

export default class Procedure {
    private _nodes: Map<string, Node>;
    private _connections: Map<string, undefined>;

    private _entryNode: Node; 

    constructor () {
        this._nodes = new Map<string, Node>();
        this._connections = new Map<string, undefined>();

        this._entryNode = new EntryNode();
        this._nodes.set(this._entryNode.getID(), this._entryNode);
    }

    public getNodes(): Node[] {
        const nodes = Array<Node>();
        this._nodes.forEach((node) => nodes.push(node));

        return nodes;
    }

    public getNodeFromId(id: string): Node {
        const node = this._nodes.get(id);
        if (!node) throw new Error("Node with provided ID does't exist!");

        return node;
    }
}