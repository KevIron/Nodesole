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

const createUndirectedGraph = function (graph: Map<string, Array<ConnectedNode>>) {
    const undirectedGraph = new Map<string, Array<ConnectedNode>>();

    for (const [ node, _ ] of graph.entries()) {
        if (!undirectedGraph.has(node)) undirectedGraph.set(node, []);

        for (const nextNode of graph.get(node)!) {
            if (!undirectedGraph.has(nextNode.id)) undirectedGraph.set(nextNode.id, []);

            undirectedGraph.get(node)?.push(nextNode);
            undirectedGraph.get(nextNode.id)?.push({ id: node, connections: nextNode.connections });
        }
    }

    return undirectedGraph;
}

const dfs = function (graph: Map<string, Array<ConnectedNode>>, visited: Set<string>, cur: string, ignored = false) {
    visited.add(cur);

    for (const next of graph.get(cur)!) {
        if (visited.has(next.id)) continue;
        if (ignored) {
            let isIgnored = false;

            for (const connection of next.connections) {
                const info = 
            }

            if (isIgnored) continue;
        }

        dfs(graph, visited, next.id, ignored);
    }
}

const createSubgraphs = function (graph: Map<string, Array<ConnectedNode>>) {
    const visited = new Set<string>();
    let cnt = 0;

    for (const node of graph.keys()) {
        if (visited.has(node)) continue;
        dfs(graph, visited, node);
        cnt++;
    }

    console.log(cnt)
}

const removeUnreachableNodes = function (graph: Map<string, Array<ConnectedNode>>, origin: Node) {
    const visited = new Set<string>();
    const unvisited = new Set<string>();

    dfs(graph, visited, origin.getID());

    for (const node of graph.keys()) {
        if (visited.has(node)) continue;
        unvisited.add(node);
    }

    for (const node of unvisited) {
        graph.delete(node);
    }

    return graph;
}

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

    public connect(connDetails: Connection): string {
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

        const node1 = this.getNodeFromId(connDetails.node1);
        const node2 = this.getNodeFromId(connDetails.node2);

        node1.addConnection(connectionID);
        node2.addConnection(connectionID);

        this._connections.set(connectionID, connDetails);
        this.emit("nodeConnected", connDetails);

        return connectionID;
    }

    public async execute() {
        const graph = createUndirectedGraph(this._graph);
        const clearGraph = removeUnreachableNodes(graph, this._entryNode);
        
        console.log(clearGraph);
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