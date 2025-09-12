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
        this.registerConnector("B", "B", "input", CONNECTION_TYPE.DATA);
        this.registerConnector("C", "C", "output", CONNECTION_TYPE.DATA);
    }

    public async execute(): Promise<void> {
        const A = this.getConnectorValue("A");
        const B = this.getConnectorValue("B");

        if (!A || !B) throw new Error("Not all necessary connectors are connected!");
        if (typeof A.value !== "boolean" || typeof B.value !== "boolean") throw new Error("This node accepts only boolean data!");

        this.setConnectorValue("C", {
            value: (A.value === true && B.value === true) ? true : false
        });
    }

    public createView(): NodeView {
        return new HeadlessNodeView(this, "node__logic");
    }
}