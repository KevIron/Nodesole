import { CONNECTION_TYPE } from "../../../types";
import HeadlessNodeView from "../../views/HeadlessNodeView";
import NodeView from "../../views/NodeView";
import Node from "../Node";

export default class NegationNode extends Node {
    protected _nodeTitle: string;
    protected _nodeDescription: string;

    constructor() {
        super();

        this._nodeTitle = "NOT";
        this._nodeDescription = "A node that returns true if the input is false";

        this.registerConnector("A", "A", "input", CONNECTION_TYPE.DATA);
        this.registerConnector("B", "B", "output", CONNECTION_TYPE.DATA);
    }

    async execute(): Promise<void> {
        const A = this.getConnectorValue("A");

        if (!A) throw new Error("Not all necessary connectors are connected!");
        if (typeof A.value !== "boolean") throw new Error("This node accepts only boolean data!");

        this.setConnectorValue("B", { value: (A.value) ? false : true });
    }

    createView(): NodeView {
        return new HeadlessNodeView(this, "node__logic");
    }
}