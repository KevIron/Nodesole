import Node, { NodeValue } from "../models/Node";

export default class NegationNode extends Node {
    _nodeStyleClass: string;
    _nodeTitle: string;
    _nodeBodyTemplate: string;

    constructor() {
        super();

        this._nodeStyleClass = "node__negation";
        this._nodeTitle = "Negation";
        this._nodeBodyTemplate = `
            <div class='body-text'>
                <p>NOT</p>
            </div>
        `;

        this.addConnector("a", "A", "input", "DATA");
        this.addConnector("b", "B", "output", "DATA");
    }
    
    public async execute(): Promise<void> {
        const inputData = this.evaluateInput();


        const inputA = inputData["a"];
        if (!inputA) return;

        let returnValue: NodeValue = {
            valueType: "boolean",
            value: ""
        };

        if (inputA.valueType === "boolean") returnValue.value = !inputA.value;
        
        this.setOutputData("b", returnValue);
    }
}