import { CONNECTION_TYPE } from "../../../types";
import NodeView from "../../views/NodeView";
import ConstantEmitterView from "../../views/specific/ConstantEmitterView";
import Node, { NodeValueTypes } from "../Node";
import { NodeValue } from "../Node";

export default class ConstantEmitterNode extends Node {
    protected _nodeTitle: string;
    protected _nodeDescription: string;

    private _currentValue: string;
    private _currentType: string;

    constructor () {
        super();

        this._nodeTitle = "ConstantEmitter";
        this._nodeDescription = "A node that emits a constant, preset value to the data output";

        this._currentValue = "";
        this._currentType = "boolean";

        this.registerConnector("A", "", "output", CONNECTION_TYPE.DATA);
    }

    public setCurrentValue(value: string) {
        this._currentValue = value;
    }

    public setCurrentType(type: string) {
        this._currentType = type.toLowerCase();
    }

    public getCurrentType() {
        return this._currentType;
    }


    async execute(): Promise<void> {
        if (this._currentType === "") return;

        
        let value: NodeValueTypes = "";

        if (this._currentType === "boolean") {
            value = (this._currentValue === "true") ? true : false; 
        }

        if (this._currentType === "number") {
            value = parseFloat(this._currentValue);
            if (Number.isNaN(value)) throw new Error("Incorrect Value");
        }

        if (this._currentType === "string") {
            value = this._currentValue;
        }

        this.setConnectorValue("A", { value: value });
    }
    
    createView(): NodeView {
        return new ConstantEmitterView(this, "node__data");
    }
}