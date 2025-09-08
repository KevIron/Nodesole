import { CONNECTION_TYPE } from "../../../types";
import HeadlessNodeView from "../../views/HeadlessNodeView";
import NodeView from "../../views/NodeView";
import Node from "../Node";

export default class EqualsToNode extends Node {
    protected _nodeTitle: string;
    protected _nodeDescription: string;

    constructor() {
        super();

        this._nodeTitle = "==";
        this._nodeDescription = "A node that returns true if both inputs are equal";

        this.registerConnector("A", "A", "input", CONNECTION_TYPE.DATA);
        this.registerConnector("B", "B", "input", CONNECTION_TYPE.DATA);
        this.registerConnector("C", "C", "output", CONNECTION_TYPE.DATA);
    }

    execute(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    createView(): NodeView {
        return new HeadlessNodeView(this, "node__logic");
    }
}