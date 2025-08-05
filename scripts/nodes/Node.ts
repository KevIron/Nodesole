import Vec2 from "../utils/Vector.js";
import { DATA_TYPES } from "../utils/Connections.js";

import type { Connection } from "../utils/Connections.js";

export type NodeConnection = {
    readonly connector: SVGSVGElement,
    readonly dataType: DATA_TYPES,
    
    visuals: Connection[],
    nodes: Node[],
    opositeConnectors: SVGSVGElement[],
};

export default abstract class Node {
    protected _nodeContainer: HTMLDivElement | null;
    protected _nodeBody: HTMLDivElement | null;
  
    protected _nodeConnectors: Record<"input" | "output", HTMLElement[]>;
    protected _connections: Record<"input" | "output", Map<string, NodeConnection>>;

    abstract _nodeStyleClass: string;
    abstract _nodeTitle: string;
    abstract _nodeBodyTemplate: string;
    
    private _id: string;

    protected onElementInsert?(): void;

    abstract execute(): Promise<void>;
    // abstract getNodeData();

    constructor () {
        this._nodeContainer = null;
        this._nodeBody = null;
        this._nodeConnectors = { input: [], output: [] };

        this._id = crypto.randomUUID();
        this._connections = { 
            input: new Map<string, NodeConnection>(), 
            output: new Map<string, NodeConnection>(), 
        };
    }

    protected renderConnectors() {
        if (!this._nodeBody) return;

        this._nodeConnectors.input.forEach(input => this._nodeBody!.insertAdjacentElement("beforeend", input));
        this._nodeConnectors.output.forEach(output => this._nodeBody!.insertAdjacentElement("beforeend", output));
    }

    private buildElement() {
        const nodeContainer = document.createElement("div");
        const nodeHeader = document.createElement("div");
        const nodeBody = document.createElement("div");

        nodeContainer.insertAdjacentElement("beforeend", nodeHeader);
        nodeContainer.insertAdjacentElement("beforeend", nodeBody);

        nodeContainer.classList.add("node", this._nodeStyleClass);
        nodeBody.classList.add("node-body");
        nodeHeader.classList.add("node-header");

        nodeContainer.setAttribute("data-id", this._id);
        nodeHeader.textContent = this._nodeTitle;
        nodeBody.insertAdjacentHTML("afterbegin", this._nodeBodyTemplate);

        this._nodeBody = nodeBody;
        this._nodeContainer = nodeContainer;

        this.renderConnectors();
    }

    public addConnector(name: string, description: string, type: "input" | "output", dataType: DATA_TYPES, connectorContainer?: HTMLDivElement) {
        const formatedName = name.toLowerCase().replace(/\s/g, "-");

        const container = document.createElement("div");
        const connetor = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        container.classList.add(type);
        connetor.classList.add("connector");

        connetor.dataset.type = type;
        connetor.dataset.name = formatedName;
        connetor.dataset.dataType = dataType;

        connetor.setAttribute("viewBox", "0 0 10 10");
       
        if (dataType === "CONTROL_FLOW")
            connetor.insertAdjacentHTML("afterbegin", "<rect width='10' height='10' x='0' y='0'>");
        if (dataType === "DATA")
            connetor.insertAdjacentHTML("afterbegin", "<circle cx='5' cy='5' r='4'>");

        container.insertAdjacentHTML("afterbegin", `<p>${description}</p>`);
        container.insertAdjacentElement(type === "input" ? "afterbegin" : "beforeend", connetor);
        
        this._nodeConnectors[type].push(container);
        this._connections[type].set(formatedName, {
            connector: connetor,
            dataType: dataType,
            visuals: [],
            nodes: [],
            opositeConnectors: []
        });
    }

    public connectTo(node: Node, connectionOptions: { name: string, type: "input" | "output", visual: Connection, connector: SVGSVGElement}) {
        const connection = this._connections[connectionOptions.type].get(connectionOptions.name);
        
        if (!connection) return;

        connection.nodes.push(node);
        connection.opositeConnectors.push(connectionOptions.connector);
        connection.visuals.push(connectionOptions.visual);
    }

    public insertInto(container: HTMLDivElement) {
        this.buildElement();

        container.insertAdjacentElement("beforeend", this._nodeContainer!);

        this.setPosition(new Vec2(0, 0));
        this.onElementInsert?.();
    }

    public getPosition() {
        if (!this._nodeContainer) return new Vec2(0, 0);

        const transform = window.getComputedStyle(this._nodeContainer).transform;
        const [ x, y ] = transform.replace(/[a-z(),]+/g, "").split(" ").slice(-2);

        return new Vec2(parseFloat(x), parseFloat(y));
    }

    public setPosition(pos: Vec2) {
        if (!this._nodeContainer) return;

        const nodeTransform = `translate(${pos.x}px, ${pos.y}px)`;
        this._nodeContainer.style.transform = nodeTransform;
    }

    public getConnections() {
        return this._connections;
    }

    public getConnectors() {
        return this._nodeConnectors;
    }
    
    public getID() {
        return this._id;
    }

    public getTitle() {
        return this._nodeTitle;
    }
}