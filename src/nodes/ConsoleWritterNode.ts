import Node from "./Node";

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
        this.addConnector("printable-data", "data", "input", "DATA");
        this.addConnector("control-flow", "", "output", "CONTROL_FLOW");
    }

   protected renderConnectors() {
        if (!this._nodeBody) return;

        const inputs = document.createElement("div");
        const outputs = document.createElement("div");

        inputs.classList.add("inputs");
        outputs.classList.add("outputs");

        this._nodeConnectors.input.forEach(input => inputs.insertAdjacentElement("beforeend", input));
        this._nodeConnectors.output.forEach(output => outputs.insertAdjacentElement("beforeend", output)); 

        this._nodeBody.insertAdjacentElement("beforeend", inputs);
        this._nodeBody.insertAdjacentElement("beforeend", outputs);
    } 

    protected onElementInsert(): void {
        const input = this._nodeBody?.querySelector<HTMLInputElement>("#format")!;
        input.addEventListener("change", (e) => this._formatString = input.value || "");
    }

    public async execute(): Promise<void> {
        const inputs = this.evaluateInput();
        const printableData = inputs["printable-data"]?.value?.toString?.();

        if (printableData) {
            const outputString = this._formatString.replace("%d", printableData);
            console.log(outputString);

            return;
        }

        console.log(this._formatString);
    }
}