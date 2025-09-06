import { CONNECTION_TYPE } from "../../types";
import HeadlessNodeView from "../views/HeadlessNodeView";
import NodeView from "../views/NodeView";
import Node from "./Node";

export default class EntryNode extends Node {
    protected _nodeDescription: string;
    protected _nodeTitle: string;

    constructor () {
        super();

        this._nodeTitle = "EntryNode";
        this._nodeDescription = "A node that's a starting point to the program";

        this.registerConnector("A", "", "output", CONNECTION_TYPE.CONTROL_FLOW);
    }

    public async execute(): Promise<void> { }

    public createView(): NodeView {
        return new HeadlessNodeView(this, "node__entry");
    }
}