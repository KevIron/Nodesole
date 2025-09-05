import Node from "../models/Node";
import NodeView from "./NodeView";

export default class EntryNodeView extends NodeView {
    public generateTemplate(): string {
        return `
            <div class="node__entry">
                <span></span>
                ${ this.getConnectorMarkup("A") }
            </div>
        `;
    }
}