import EntryNode from "../nodes/models/special/EntryNode";
import Node from "../nodes/models/Node";
import { CONNECTION_TYPE } from "../types";

type ProcedureEvents = 
    "nodeAdded" |
    "nodeRemoved" |
    "nodeConnected" |
    "nodeDisconnected" |
    string & {}


type NodeID = string;
type ConnectorName = string;

type ConnectionDetails = {
    node1: NodeID,
    node2: NodeID,
    conn1name: string,
    conn2name: string,
    conn1type: "input" | "output",
    conn2type: "input" | "output",
    connectionType: CONNECTION_TYPE
}

type ConnectedNodes = Map<ConnectorName, { node: NodeID, type: CONNECTION_TYPE, connectionID: string }>;

export default class Procedure {
    private _eventListeners: Map<ProcedureEvents, Array<Function>>;

    private _nodes: Map<NodeID, Node>;
    private _graph: Map<NodeID, { 
                        input: ConnectedNodes, 
                        output: ConnectedNodes
                    }>;

    private _entryNode: Node; 

    constructor () {
        this._eventListeners = new Map<string, Array<Function>>;

        this._nodes = new Map<NodeID, Node>();
        this._graph = new Map<NodeID, { 
            input: ConnectedNodes, 
            output: ConnectedNodes
        }>();

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
        this._graph.set(nodeID, { 
            input: new Map(), 
            output: new Map()
        });
        
        this.emit("nodeAdded", node);
    }


    public connect(connDetails: ConnectionDetails): string {
        if (!this._graph.has(connDetails.node1)) throw new Error(`Node with ID - ${connDetails.node1}, doesn't exist!`);
        if (!this._graph.has(connDetails.node2)) throw new Error(`Node with ID - ${connDetails.node2}, doesn't exist!`);

        const connectionID = crypto.randomUUID();

        const connections1 = this._graph.get(connDetails.node1)!
        const connections2 = this._graph.get(connDetails.node2)!

        connections1[connDetails.conn1type].set(connDetails.conn1name, {
            node: connDetails.node2,
            type: connDetails.connectionType,
            connectionID: connectionID
        })
        connections2[connDetails.conn2type].set(connDetails.conn2name, {
            node: connDetails.node1,
            type: connDetails.connectionType,
            connectionID: connectionID
        })

        const node1 = this.getNodeFromId(connDetails.node1);
        const node2 = this.getNodeFromId(connDetails.node2);

        node1.addConnection(connectionID);
        node2.addConnection(connectionID);

        this.emit("nodeConnected");

        return connectionID;
    }

    public async execute() {

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