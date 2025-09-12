import Procedure from "../../../core/Procedure";
import { CONNECTION_TYPE } from "../../../types";
import NodeView from "../../views/NodeView";
import StandardNodeView from "../../views/StandardNodeView";
import ExecutionAlteringNode from "../ExecutionAlteringNode";

export default class ConditionNode extends ExecutionAlteringNode {
    public _nodeTitle: string;
    public _nodeDescription: string;

    constructor (procedure: Procedure) {
        super(procedure);

        this._nodeTitle = "If Statement";
        this._nodeDescription = "A node that executes different actions based on the input condition";

        this.registerConnector("A", "", "input", CONNECTION_TYPE.CONTROL_FLOW);
        this.registerConnector("B", "", "output", CONNECTION_TYPE.CONTROL_FLOW);

        this.registerConnector("CONDITION", "Condition", "input", CONNECTION_TYPE.DATA);
        this.registerConnector("THEN", "Then", "output", CONNECTION_TYPE.IGNORED);
        this.registerConnector("ELSE", "Else", "output", CONNECTION_TYPE.IGNORED);
    }

    async execute(): Promise<void> {
        const condition = this.getConnectorValue("CONDITION");

        const thenNode = this.getConnectedNode("THEN");
        const elseNode = this.getConnectedNode("ELSE");

        if (!thenNode || !condition) throw new Error("Not all required connector are connected!");
        if (typeof condition.value !== "boolean") throw new Error("Condition must be of type boolean!");

        if (condition.value) this._procedure.executeFromRoot(thenNode);
        else if (elseNode) this._procedure.executeFromRoot(elseNode);
    }
    
    createView(): NodeView {
        return new StandardNodeView(this, "node__condition");
    }
}