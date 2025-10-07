import ConsoleView from "../../../core/panels/ConsoleView";
import { CONNECTION_TYPE } from "../../../types";
import StandardNodeView from "../../views/StandardNodeView";
import Node from "../Node";

export default class ConsoleReaderNode extends Node {
    protected _nodeTitle: string;
    protected _nodeDescription: string;

    private _console: ConsoleView;

    constructor (console: ConsoleView) {
        super();

        this._console = console;

        this._nodeTitle = "ConsoleReader";
        this._nodeDescription = "Reads data from the console and outputs it as a string";

        this.registerConnector("A", "", "input", CONNECTION_TYPE.CONTROL_FLOW);
        this.registerConnector("B", "", "output", CONNECTION_TYPE.CONTROL_FLOW);

        this.registerConnector("DATA", "Data", "output", CONNECTION_TYPE.DATA);
    }

    async execute(): Promise<void> {
        const inputText = await this._console.requestInput();
        this.setConnectorValue("DATA", { value: inputText });
    }

    public createView() {
        return new StandardNodeView(this, "node__data")
    }
}