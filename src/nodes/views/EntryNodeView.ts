import NodeView from "./NodeView";

export default class EntryNodeView extends NodeView {
    public generateTemplate(): string {
        return `
            <div class="node__entry">
                <div class="node_body">
                    <span>${this._model.getTitle()}</span>
                    ${ this.getConnectorMarkup("A") } 
                </div>
            </div>
        `;
    }
}