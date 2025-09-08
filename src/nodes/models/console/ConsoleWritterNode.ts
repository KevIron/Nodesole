import NodeView from "../../views/NodeView";
import Node from "../Node";

export default class ConsoleWriterNode extends Node {
    protected _nodeTitle: string;
    protected _nodeDescription: string;

    constructor () {
        super();

        this._nodeTitle = "";
        this._nodeDescription = "";
    }

    execute(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    createView(): NodeView {
        throw new Error("Method not implemented.");
    }
}