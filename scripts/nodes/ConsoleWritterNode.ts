import Node from "./Node.ts";

export default class ConsoleWritterNode extends Node {
    _nodeStyleClass: string;
    _nodeTitle: string;
    _nodeBodyTemplate: string;

    private _formatString: string;

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

        this._formatString = "";

        this.addConnector("control-flow", "", "input", "CONTROL_FLOW");
        this.addConnector("control-flow", "", "output", "CONTROL_FLOW");
    }

    protected onElementInsert(): void {
        const input = this._nodeBody?.querySelector("input")!;
        input.addEventListener("change", (e) => this._formatString = input.value);
    }

    public async execute(): Promise<void> {
        console.log(this._formatString);
    }
}