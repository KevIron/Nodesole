import NodeView from "./NodeView";

export default class HeadlessNodeView extends NodeView {
    public generateTemplate(): string {
        return `
            <div class="node__entry">
                <div class="node_body">
                    <div class="column">

                    </div>
                    <span>${this._model.getTitle()}</span>
                    <div class="column">
                    
                    </div>
                </div>
            </div>
        `;

        // ${ this.getConnectorMarkup("A") } 
    }
}