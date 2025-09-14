import Node from "../models/Node";
import NodeView from "./NodeView";

export default class StandardNodeView<T extends Node = Node> extends NodeView<T> {
    constructor(model: T, styleClass: string) {
        super(model, styleClass);
    }

    public generateBodyMarkup() {
        const connectors = Array.from(this._model.getConnectors().entries());

        const inputConnectors = connectors.filter((conn) => conn[1].type == "input").map((conn) => this.getConnectorMarkup(conn[0]));
        const outputConnectors = connectors.filter((conn) => conn[1].type == "output").map((conn) => this.getConnectorMarkup(conn[0]));

        const rows = new Array<string>();

        for (let i = 0; i < Math.max(inputConnectors.length, outputConnectors.length); ++i) {
            rows.push(`
                <div class="row">
                    ${inputConnectors[i] || "<div></div>"}
                    ${outputConnectors[i] || "<div></div>"}
                </div>
            `);
        }

        return rows.join("\n");
    }

    public generateTemplate(): string {
        return `
            <div class="node__standard ${ this._styleClass }">
                <div class="node_header">${ this._model.getTitle() }</div>
                <div class="node_body">${ this.generateBodyMarkup() }</div>
            </div>
        `;
    }
}