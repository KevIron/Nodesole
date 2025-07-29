import Node from "./Node.ts";

export default class ConsoleWritterNode extends Node {
    _nodeStyleClass: string;
    _nodeTitle: string;
    _nodeBodyTemplate: string;

    constructor () {
        super();

        this._nodeStyleClass = "node__console-writter";
        this._nodeTitle = "ConsoleWritter";
        this._nodeBodyTemplate = `
            <div class="format-input">
                <label for="format">Print format:</label>
                <input type="text" name="format" id="format">
            </div>
        `;

        this.addConnector("control-flow", "", "input", "CONTROL_FLOW");
        this.addConnector("control-flow", "", "output", "CONTROL_FLOW");
    }

    protected onElementInsert(): void {
        const inputs = this._nodeBody?.querySelectorAll(".input");
    }
}