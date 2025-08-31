import EntryNode from "../nodes/EntryNode.ts";
import Node from "../nodes/Node.ts";

enum CONNECTION_TYPE {
    IGNORED, 
    DATA,
    CONTROL_FLOW
}

type ConnectedNode = {
    id: string,
    connections: Array<string>,
}

type Connection = {
    connector1: string,
    connector2: string, 
    connType: CONNECTION_TYPE
}

export default class Procedure {
    private _nodes: Map<string, Node>;
    private _connections: Map<string, Connection>;

    private _graph: Map<string, Array<ConnectedNode>>;

    private _entryNode: Node; 

    constructor () {
        this._nodes = new Map<string, Node>();
        this._connections = new Map<string, Connection>();

        this._graph = new Map<string, Array<ConnectedNode>>();

        this._entryNode = new EntryNode();
        this.insertNode(this._entryNode);
    }

    public insertNode(node: Node): void {
        const nodeID = node.getID();
        this._nodes.set(nodeID, node);
        this._graph.set(nodeID, []);
    }

    public connect(id1: string, id2: string, connDetails: Connection) {
        if (!this._graph.has(id1)) throw new Error(`Node with ID - ${id1}, doesn't exist!`);
        if (!this._graph.has(id2)) throw new Error(`Node with ID - ${id2}, doesn't exist!`);

        const node1Connections = this._graph.get(id1)!;
        const connectionID = crypto.randomUUID();
        
        let isFound = false;

        node1Connections.forEach(node => {
            if (node.id !== id2 ) return;
            node.connections.push(connectionID);
            isFound = true;
        });

        if (!isFound) node1Connections.push({ 
            id: id2, 
            connections: [connectionID] 
        });

        this._connections.set(connectionID, connDetails);
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