import { CONNECTION_TYPE } from "../../types";
import Vec2 from "../../utils/Vector";
import Node from "../models/Node";

const connectorSVGs = {
    [CONNECTION_TYPE.DATA]: 
        `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" xml:space="preserve">
            <path d="M150,0C67.29,0,0,67.29,0,150s67.29,150,150,150s150-67.29,150-150S232.71,0,150,0z M150,270c-66.169,0-120-53.832-120-120 S83.831,30,150,30s120,53.832,120,120S216.168,270,150,270z"/>
        </svg>`,
    [CONNECTION_TYPE.CONTROL_FLOW]: 
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-9 0 64 64"><path fill="none" fill-rule="evenodd" stroke="#6B6C6E" stroke-width="2" d="M1 61c0 1.1.8 2 1.9 2l40.2-28c1.6-1.1 1.9-2.3 1.9-3.1 0 0-.1-1.7-1.9-3L2.9 1C1.9 1 1 1.9 1 3v58Z"/></svg>`,
    [CONNECTION_TYPE.IGNORED]: 
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-9 0 64 64"><path fill="none" fill-rule="evenodd" stroke="#6B6C6E" stroke-width="2" d="M1 61c0 1.1.8 2 1.9 2l40.2-28c1.6-1.1 1.9-2.3 1.9-3.1 0 0-.1-1.7-1.9-3L2.9 1C1.9 1 1 1.9 1 3v58Z"/></svg>`,
}

export default abstract class NodeView {
    private _nodeContainer: HTMLDivElement;
    private _model: Node;

    abstract generateTemplate(): string;
    
    constructor(model: Node) {
        this._nodeContainer = document.createElement("div");
        this._model = model;

        this.initialize();
    }

    private initialize(): void {
        this._nodeContainer.dataset.id = this._model.getID();
        this._nodeContainer.classList.add("node");
        this._nodeContainer.insertAdjacentHTML("afterbegin", this.generateTemplate());

        this.setPosition(new Vec2(0, 0));
    }

    protected getConnectorMarkup(name: string): string {
        const connector = this._model.getConnector(name);
        const svg = connectorSVGs[connector.connectionType];
        
        const connectorContainer = document.createElement("div");

        connectorContainer.insertAdjacentHTML("afterbegin", svg);
        connectorContainer.classList.add("connector");

        connectorContainer.dataset.name = name;
        connectorContainer.dataset.type = connector.type;
        connectorContainer.dataset.connectionType = connector.connectionType.toString();

        return connectorContainer.outerHTML;
    }

    public getPosition(): Vec2 {
        if (!this._nodeContainer) return new Vec2(0, 0);

        const transform = window.getComputedStyle(this._nodeContainer).transform;
        const [ x, y ] = transform.replace(/[a-z(),]+/g, "").split(" ").slice(-2);

        return new Vec2(parseFloat(x), parseFloat(y));
    }

    public setPosition(pos: Vec2): void {
        if (!this._nodeContainer) return;

        const nodeTransform = `translate(${pos.x}px, ${pos.y}px)`;
        this._nodeContainer.style.transform = nodeTransform;
    }

    public getElement(): HTMLDivElement {
        return this._nodeContainer;
    }
}