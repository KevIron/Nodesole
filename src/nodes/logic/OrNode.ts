import Node, { NodeValue } from "../models/Node";

export default class OrNode extends Node {
    _nodeStyleClass: string;
    _nodeTitle: string;
    _nodeBodyTemplate: string;

    constructor() {
        super();

        this._nodeStyleClass = "node__or";
        this._nodeTitle = "Or";
        this._nodeBodyTemplate = `
            <div class='body-text'>
                <p>OR</p>
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

        if (inputA.valueType !== "boolean" || inputB.valueType !== "boolean") {
            throw new Error(`Elements must be of type boolean! - NODE_ID: ${this.getID()}`);
        }

        returnValue.value = (inputA.value || inputB.value);
        
        this.setOutputData("c", returnValue);
    }
}