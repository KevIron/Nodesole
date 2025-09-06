import NodeView from "./NodeView";

export default class HeadlessNodeView extends NodeView {
    public generateBodyMarkup() {
        const connectors = Array.from(this._model.getConnectors().entries());

        const inputConnectors = connectors.filter((conn) => conn[1].type == "input").map((conn) => this.getConnectorMarkup(conn[0]));
        const outputConnectors = connectors.filter((conn) => conn[1].type == "output").map((conn) => this.getConnectorMarkup(conn[0]));

        return [ inputConnectors.join("\n"), outputConnectors.join("\n") ];
    }

    public generateTemplate(): string {
        const bodyMarkup = this.generateBodyMarkup();

        return `
            <div class="node__headless ${ this._styleClass }">
                <div class="node_body">
                    <div class="column">${ bodyMarkup[0] }</div>
                    <span class="name">${ this._model.getTitle() }</span>
                    <div class="column">${ bodyMarkup[1] }</div>
                </div>
            </div>
        `;
    }
}