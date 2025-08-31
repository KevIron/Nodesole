import Node, { NodeDataTypes } from "./Node";

export default class ConstantEmitterNode extends Node {
    _nodeStyleClass: string;
    _nodeTitle: string;
    _nodeBodyTemplate: string;

    private _constantTypeInput: HTMLInputElement | null;
    private _constantValueInput: HTMLInputElement | null;

    constructor () {
        super();

        this._nodeStyleClass = "node__constant-emitter";
        this._nodeTitle = "ConstantEmitter";
        this._nodeBodyTemplate = `
            <div class="constant-frm">
                <label for="type">Constant type:</label>
                <select name="type" id="type">
                    <option value="number">Number</option>
                    <option value="string">String</option>
                    <option value="boolean">Boolean</option>
                </select>
                <label for="value">Constant Value</label>
                <input type="text" name="value" id="value">
            </div>
        `;

        this._constantTypeInput = null;
        this._constantValueInput = null;

        this.addConnector("emitted-constant", "", "output", "DATA");
    }

    protected onElementInsert(): void {
        if (!this._nodeBody) return;

        const constantValueInput = this._nodeBody.querySelector<HTMLInputElement>("#value");
        const constantTypeInput = this._nodeBody.querySelector<HTMLInputElement>("#type");

        this._constantValueInput = constantValueInput;
        this._constantTypeInput = constantTypeInput;
    }

    public async execute(): Promise<void> {
        const constantType: NodeDataTypes = this._constantTypeInput?.value! as NodeDataTypes;
        
        let constantValue: string | number | boolean = this._constantValueInput?.value!;

        switch (constantType) {
            case "string": 
                break;
            case "number": 
                constantValue = parseFloat(constantValue);
                if (Number.isNaN(constantValue)) constantValue = 0;
                break;
            case "boolean": 
                if (constantValue === "true" || constantValue === "1") constantValue = true;
                else if (constantValue === "false" || constantValue === "0") constantValue = false;
                else constantValue = Boolean(constantValue);
                break;
        }

        this.setOutputData("emitted-constant", {
            valueType: constantType,
            value: constantValue
        });
    }
}