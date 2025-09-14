import { CONNECTION_TYPE } from "../../types";
import type NodeView from "../views/NodeView";

export type NodeValueTypes = number | boolean | string | NodeValue[];

export type NodeValue = {
    value: NodeValueTypes
}

type Connector = {
    type: "input" | "output",
    description: string,
    connectionType: CONNECTION_TYPE,
    value: NodeValue | null
};

export default abstract class Node {
    protected abstract _nodeTitle: string;
    protected abstract _nodeDescription: string;

    private _id: string;
    private _connectors: Map<string, Connector>;

    private _connections: Set<string>;

    abstract execute(): Promise<void>;
    abstract createView(): NodeView

    constructor () {
        this._id = crypto.randomUUID();
        this._connectors = new Map<string, Connector>();

        this._connections = new Set<string>();
    }

    public registerConnector(name: string, description: string, type: "input" | "output", connectionType: CONNECTION_TYPE) {
        if (this._connectors.get(name)) throw new Error(`Connector with name: ${name}, already exists!`)

        this._connectors.set(name, {
            type: type,
            description: description,
            connectionType: connectionType,
            value: null
        });
    }

    public getConnectors() {
        return this._connectors;
    }

    public getConnector(name: string): Connector {
        const connector = this._connectors.get(name)
        if (!connector) throw new Error(`Connector ${name} doesn't exist!`);

        return connector;
    }

    public getConnectorValue(name: string): NodeValue | null {
        const connector = this._connectors.get(name)
        if (!connector) throw new Error(`Connector ${name} doesn't exist!`);

        return connector.value;
    }

    public setConnectorValue(name: string, value: NodeValue) {
        const connector = this._connectors.get(name);
        if (!connector) throw new Error(`Connector ${name} doesn't exist!`);

        connector.value = value;
    }
    
    public getID() {
        return this._id;
    }

    public getTitle() {
        return this._nodeTitle;
    }

    public addConnection(id: string) {
        this._connections.add(id);
    }

    public removeConnection(id: string) {
        this._connections.delete(id);
    }

    public getConnections() {
        return Array.from(this._connections);
    }
}