import Node from "./models/Node.js";
import traverse from "../utils/Execution.js";

export default class ConditionNode extends Node {
    public _nodeStyleClass: string;
    public _nodeTitle: string;
    public _nodeBodyTemplate: string;

    private readonly _existingNodes: Map<string, Node>;

    constructor (existingNodes: Map<string, Node>) {
        super();

        this._nodeStyleClass = "node__condition";
        this._nodeTitle = "If Statement";
        this._nodeBodyTemplate = ``;

        this.addConnector("control-flow", "", "input", "CONTROL_FLOW");
        this.addConnector("condition", "Condition", "input", "DATA");
        
        this.addConnector("control-flow", "", "output", "CONTROL_FLOW");
        this.addConnector("if-block", "Then", "output", "IGNORED");
        this.addConnector("else-block", "Else", "output", "IGNORED");

        this._existingNodes = existingNodes;
    }

    public async execute(): Promise<void> { 
        const inputData = this.evaluateInput(); 
        const condition = inputData["condition"];

        const connections = this.getConnections();
        const ifBlock = connections.output.get("if-block")?.nodes[0];
        const elseBlock = connections.output.get("else-block")?.nodes[0];

        if (!condition) return;

        const executedBlock = (condition.value) ? ifBlock : elseBlock;

        if (!executedBlock) return;

        const seenNodes = new Set<string>();
        const executionStack = new Array<string>();
 
        traverse(seenNodes, executionStack, executedBlock);
        
        for (const id of executionStack) {
            const node = this._existingNodes.get(id)!;
            await node.execute();
        }
    }
}