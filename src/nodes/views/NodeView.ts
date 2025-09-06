import { CONNECTION_TYPE } from "../../types";
import Vec2 from "../../utils/Vector";
import Node from "../models/Node";

const connectorSVGs = {
    [CONNECTION_TYPE.DATA]: 
        `<svg class="connector-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" fill="#292929" stroke="#CCCCCC"/></svg>`,
    [CONNECTION_TYPE.CONTROL_FLOW]: 
        `<svg class="connector-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.51567 1.87413L7.95756 1.8743C8.2959 1.87432 8.61129 2.04542 8.79577 2.32904L12.1297 7.45452C12.3454 7.78603 12.3454 8.21349 12.1297 8.54501L8.7958 13.6709C8.6113 13.9545 8.29586 14.1257 7.95747 14.1256L4.51558 14.1255C3.96331 14.1254 3.51562 13.6777 3.51562 13.1255V2.87413C3.51562 2.32183 3.96337 1.87411 4.51567 1.87413Z" fill="#292929" stroke="#CCCCCC"/>
        </svg>`,
    [CONNECTION_TYPE.IGNORED]: 
        `<svg class="connector-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.51567 1.87413L7.95756 1.8743C8.2959 1.87432 8.61129 2.04542 8.79577 2.32904L12.1297 7.45452C12.3454 7.78603 12.3454 8.21349 12.1297 8.54501L8.7958 13.6709C8.6113 13.9545 8.29586 14.1257 7.95747 14.1256L4.51558 14.1255C3.96331 14.1254 3.51562 13.6777 3.51562 13.1255V2.87413C3.51562 2.32183 3.96337 1.87411 4.51567 1.87413Z" fill="#292929" stroke="#CCCCCC"/>
        </svg>`,
    }

export default abstract class NodeView {
    private _nodeContainer: HTMLDivElement;
    private _isInitialized: boolean;

    protected _model: Node;
    protected _styleClass: string;

    abstract generateTemplate(): string;
    
    constructor(model: Node, styleClass: string) {
        this._nodeContainer = document.createElement("div");
        this._model = model;
        this._styleClass = styleClass;
        this._isInitialized = false;
    }

    private initialize(): void {
        this._nodeContainer.dataset.id = this._model.getID();
        this._nodeContainer.classList.add("node");
        this._nodeContainer.insertAdjacentHTML("afterbegin", this.generateTemplate());

        this.setPosition(new Vec2(0, 0));
        this._isInitialized = true;
    }

    protected getConnectorMarkup(name: string): string {
        const connector = this._model.getConnector(name);
        const svg = connectorSVGs[connector.connectionType];
        
        const connectorContainer = document.createElement("div");

        connectorContainer.insertAdjacentHTML("afterbegin", svg);
        connectorContainer.insertAdjacentHTML((connector.type == "input") ? "beforeend" : "afterbegin", `<span>${connector.description}</span>`);
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
        if (!this._isInitialized)  this.initialize();
        return this._nodeContainer;
    }
}