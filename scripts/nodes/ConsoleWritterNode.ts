import Node from "./Node.ts";

export default class ConsoleWritterNode extends Node {
    _nodeStyleClass: string;
    _nodeTitle: string;

    constructor () {
        super();

        this._nodeStyleClass = "node__console-writter";
        this._nodeTitle = "ConsoleWritter";
    }
}