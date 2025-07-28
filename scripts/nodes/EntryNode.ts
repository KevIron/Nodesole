import Node from "./Node.js";

export default class EntryNode extends Node {
    _nodeStyleClass: string;
    _nodeTitle: string;

    constructor () {
        super();

        this._nodeStyleClass = "node__entry";
        this._nodeTitle = "EntryNode";

        this.addConnector("INPUT 1", "", "input", "CONTROL_FLOW");
        this.addConnector("OUTPUt 2", "first", "output", "CONTROL_FLOW");
    }
}