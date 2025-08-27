import Node from "./Node.js";

export default class EntryNode extends Node {
    public _nodeStyleClass: string;
    public _nodeTitle: string;
    public _nodeBodyTemplate: string;

    constructor () {
        super();

        this._nodeStyleClass = "node__entry";
        this._nodeTitle = "EntryNode";
        this._nodeBodyTemplate = ``;

        this.addConnector("control-flow", "", "output", "CONTROL_FLOW");
    }

    public async execute(): Promise<void> { }
}