import type NodeView from "../views/NodeView";

type Connector = {
    type: "input" | "output",
    value: undefined
}

export default abstract class Node {
    abstract _nodeTitle: string;
    abstract _nodeDescription: string;

    private _id: string;
    private _connectors: Map<string, Connector>;

    abstract execute(): Promise<void>;
    abstract createView(): NodeView

    constructor () {
        this._id = crypto.randomUUID();
        this._connectors = new Map<string, Connector>();
    }

    public registerConnector(name: string, type: "input" | "output") {
        this._connectors.set(name, {
            type: type,
            value: undefined
        });
    }

    public getView() {
        return this.createView();
    }
    
    public getID() {
        return this._id;
    }

    public getTitle() {
        return this._nodeTitle;
    }
}