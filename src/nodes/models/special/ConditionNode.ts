import NodeView from "../views/NodeView";
import Node from "./Node"

export default class ConditionNode extends Node {
    public _nodeTitle: string;
    public _nodeDescription: string;

    constructor (existingNodes: Map<string, Node>) {
        super();

        this._nodeTitle = "If Statement";
        this._nodeDescription = "";
    }

    execute(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    createView(): NodeView {
        throw new Error("Method not implemented.");
    }

    // public async execute(): Promise<void> { 
    //     const inputData = this.evaluateInput(); 
    //     const condition = inputData["condition"];

    //     const connections = this.getConnections();
    //     const ifBlock = connections.output.get("if-block")?.nodes[0];
    //     const elseBlock = connections.output.get("else-block")?.nodes[0];

    //     if (!condition) return;

    //     const executedBlock = (condition.value) ? ifBlock : elseBlock;

    //     if (!executedBlock) return;

    //     const seenNodes = new Set<string>();
    //     const executionStack = new Array<string>();
 
    //     traverse(seenNodes, executionStack, executedBlock);
        
    //     for (const id of executionStack) {
    //         const node = this._existingNodes.get(id)!;
    //         await node.execute();
    //     }
    // }
}