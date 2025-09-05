import { CONNECTION_TYPE } from "../../types";
import type NodeView from "../views/NodeView";

type Connector = {
    type: "input" | "output",
    connectionType: CONNECTION_TYPE
    value: undefined | null
}

export default abstract class Node {
    abstract _nodeTitle: string;
    abstract _nodeDescription: string;

    private _id: string;
    private _connectors: Map<string, Connector>;
    private _view: NodeView | null;

    abstract execute(): Promise<void>;
    abstract createView(): NodeView

    constructor () {
        this._id = crypto.randomUUID();
        this._connectors = new Map<string, Connector>();
        this._view = null;
    }

    public registerConnector(name: string, type: "input" | "output", connectionType: CONNECTION_TYPE) {
        this._connectors.set(name, {
            type: type,
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

    public setConnectorValue() {
        
    }

    public getView() {
        if (!this._view) this._view = this.createView();
        return this._view;
    }
    
    public getID() {
        return this._id;
    }

    public getTitle() {
        return this._nodeTitle;
    }
}