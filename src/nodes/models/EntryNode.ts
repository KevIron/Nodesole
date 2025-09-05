import { CONNECTION_TYPE } from "../../types";
import EntryNodeView from "../views/EntryNodeView";
import NodeView from "../views/NodeView";
import Node from "./Node";

export default class EntryNode extends Node {
    public _nodeDescription: string;
    public _nodeTitle: string;

    constructor () {
        super();

        this._nodeTitle = "EntryNode";
        this._nodeDescription = "A node that's a starting point to the program";

        this.registerConnector("A", "output", CONNECTION_TYPE.CONTROL_FLOW);
    }

    public async execute(): Promise<void> { }

    public createView(): NodeView {
        return new EntryNodeView(this);
    }
}