import { CONNECTION_TYPE } from "../../../types";
import HeadlessNodeView from "../../views/HeadlessNodeView";
import NodeView from "../../views/NodeView";
import Node from "../Node";

export default class ConsoleWriterNode extends Node {
    protected _nodeTitle: string;
    protected _nodeDescription: string;

    constructor () {
        super();

        this._nodeTitle = "Console Writer";
        this._nodeDescription = "Writes the received data in a specified format to the console";

        this.registerConnector("A", "data", "input", CONNECTION_TYPE.DATA);
        this.registerConnector("B", "", "input", CONNECTION_TYPE.CONTROL_FLOW);
    }

    async execute(): Promise<void> {
        console.log("XD");
    }

    createView(): NodeView {
        return new HeadlessNodeView(this, "node__data");
    }
}