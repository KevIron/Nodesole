import Node, { NodeDataTypes, NodeValue } from "./Node.ts";

export default class EqualsToNode extends Node {
    _nodeStyleClass: string;
    _nodeTitle: string;
    _nodeBodyTemplate: string;

    constructor() {
        super();

        this._nodeStyleClass = "node__equals-to";
        this._nodeTitle = "EqualsTo";
        this._nodeBodyTemplate = `
            <div class='body-text'>
                <p>EQUALS</p>
            </div>
        `;

        this.addConnector("a", "A", "input", "DATA");
        this.addConnector("b", "B", "input", "DATA");
        this.addConnector("c", "C", "output", "DATA");
    }
    
    public async execute(): Promise<void> {
        const inputData = this.evaluateInput();

        const inputA = inputData["a"];
        const inputB = inputData["b"];
        
        if (!inputA || !inputB) return;

        let returnValue: NodeValue = {
            valueType: "boolean",
            value: ""
        };

        returnValue.value = (inputA.value === inputB.value) ? true : false;
        
        this.setOutputData("c", returnValue);
    }
}