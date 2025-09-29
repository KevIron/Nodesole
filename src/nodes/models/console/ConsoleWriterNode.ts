import ConsoleView from "../../../core/Console";
import { CONNECTION_TYPE } from "../../../types";
import ConsoleWriterNodeView from "../../views/specific/ConsoleWriterNodeView";
import Node from "../Node";

export default class ConsoleWriterNode extends Node{
    protected _nodeTitle: string;
    protected _nodeDescription: string;

    private _formatString: string = "";
    private _console: ConsoleView;

    constructor (console: ConsoleView) {
        super();

        this._console = console;

        this._nodeTitle = "Console Writer";
        this._nodeDescription = "Writes the received data in a specified format to the console";

        this.registerConnector("A", "", "input", CONNECTION_TYPE.CONTROL_FLOW);
        this.registerConnector("B", "", "output", CONNECTION_TYPE.CONTROL_FLOW);

        this.registerConnector("DATA", "Data", "input", CONNECTION_TYPE.DATA);
    }

    async execute(): Promise<void> {
        const Data = this.getConnectorValue("DATA");
        const formatText = this._formatString;

        if (formatText === null) throw new Error("Cannot get the format text!");

        const outputText = formatText.replace("%d", Data?.value.toString() || "%d");
        this._console.printMessage(outputText);
    }

    public setFormatString(format: string) {
        this._formatString = format;
    }

    public createView() {
        return new ConsoleWriterNodeView(this, "node__data");
    }
}