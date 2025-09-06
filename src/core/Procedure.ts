import EntryNode from "../nodes/models/special/EntryNode";
import Node from "../nodes/models/Node";
import { CONNECTION_TYPE } from "../types";

export type ConnectedNode = {
    id: string,
    connections: Array<string>
}

export type Connection = {
    node1: string,
    node2: string,
    connector1: string,
    connector2: string, 
    connType: CONNECTION_TYPE
}

type ProcedureEvents = 
    "nodeAdded" |
    "nodeRemoved" |
    "nodeConnected" |
    "nodeDisconnected" |
    string & {}

export default class Procedure {
    private _eventListeners: Map<ProcedureEvents, Array<Function>>;

    private _nodes: Map<string, Node>;
    private _connections: Map<string, Connection>;

    private _graph: Map<string, Array<ConnectedNode>>;

    private _entryNode: Node; 

    constructor () {
        this._eventListeners = new Map<string, Array<Function>>;

        this._nodes = new Map<string, Node>();
        this._connections = new Map<string, Connection>();

        this._graph = new Map<string, Array<ConnectedNode>>();

        this._entryNode = new EntryNode();
        this.insertNode(this._entryNode);
    }

    private emit(event: ProcedureEvents, ...args: any[]): void {
        this._eventListeners.get(event)?.forEach(callback => callback(...args));
    }

    public on(event: ProcedureEvents, callback: Function): void {
        const eventListeners = this._eventListeners.get(event);
        if (!eventListeners) this._eventListeners.set(event, []);

        this._eventListeners.get(event)?.push(callback);
    }

    public insertNode(node: Node): void {
        const nodeID = node.getID();

        this._nodes.set(nodeID, node);
        this._graph.set(nodeID, []);
        
        this.emit("nodeAdded", node);
    }

    public connect(connDetails: Connection): void {
        if (!this._graph.has(connDetails.node1)) throw new Error(`Node with ID - ${connDetails.node1}, doesn't exist!`);
        if (!this._graph.has(connDetails.node2)) throw new Error(`Node with ID - ${connDetails.node2}, doesn't exist!`);

        const node1Connections = this._graph.get(connDetails.node1)!;
        const connectionID = crypto.randomUUID();
        
        let isFound = false;

        node1Connections.forEach(node => {
            if (node.id !== connDetails.node2 ) return;
            node.connections.push(connectionID);
            isFound = true;
        });

        if (!isFound) node1Connections.push({ 
            id: connDetails.node2, 
            connections: [connectionID] 
        });

        this._connections.set(connectionID, connDetails);
        this.emit("nodeConnected", connDetails);
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