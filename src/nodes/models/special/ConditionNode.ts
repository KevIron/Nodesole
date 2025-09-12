import { CONNECTION_TYPE } from "../../../types";
import NodeView from "../../views/NodeView";
import StandardNodeView from "../../views/StandardNodeView";
import Node from "../Node"

export default class ConditionNode extends Node {
    public _nodeTitle: string;
    public _nodeDescription: string;

    constructor () {
        super();

        this._nodeTitle = "If Statement";
        this._nodeDescription = "A node that executes different actions based on the input condition";

        this.registerConnector("A", "", "input", CONNECTION_TYPE.CONTROL_FLOW);
        this.registerConnector("B", "", "output", CONNECTION_TYPE.CONTROL_FLOW);

        this.registerConnector("CONDITION", "Condition", "input", CONNECTION_TYPE.DATA);
        this.registerConnector("THEN", "Then", "output", CONNECTION_TYPE.IGNORED);
        this.registerConnector("ELSE", "Else", "output", CONNECTION_TYPE.IGNORED);
    }

    async execute(): Promise<void> {
        const A = this.getConnectorValue("CONDITION");
        if (!A) return;
        console.log(A);
    }
    
    createView(): NodeView {
        return new StandardNodeView(this, "node__condition");
    }
}