import { CONNECTION_TYPE } from "../../../types";
import HeadlessNodeView from "../../views/HeadlessNodeView";
import NodeView from "../../views/NodeView";
import Node from "../Node";

export default class AndNode extends Node {
    protected _nodeTitle: string;
    protected _nodeDescription: string;

    constructor() {
        super();

        this._nodeTitle = "AND";
        this._nodeDescription = "A node that returns true only if both inputs are true";

        this.registerConnector("A", "A", "input", CONNECTION_TYPE.DATA);
        this.registerConnector("B", "B", "output", CONNECTION_TYPE.DATA);
        this.registerConnector("C", "C", "output", CONNECTION_TYPE.DATA);
    }

    execute(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    createView(): NodeView {
        return new HeadlessNodeView(this, "node__logic");
    }
}