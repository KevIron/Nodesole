import { CONNECTION_TYPE } from "../../types";
import { browserToViewportPos } from "../../utils/Converter";
import { getElementCenter } from "../../utils/Element";
import Vec2 from "../../utils/Vector";
import Procedure from "../Procedure";
import ViewportManager, { ViewportElements } from "./ViewportManager";

type ConnectionVisual = {
    svg: SVGSVGElement, 
    path: SVGPathElement
};

type ConnectionInfo = {
    visual: ConnectionVisual,
    conn1: HTMLElement,
    conn2: HTMLElement
}

function getConnectorData(connector: HTMLElement) {
    const type = connector.dataset.type as "input" | "output";
    const name = connector.dataset.name;
    const connectionType = connector.dataset.connectionType;

    if (!type || !connectionType || !name) throw new Error("Element is not an connector!");

    return { name: name, type: type, connectionType: connectionType };
}

export default class ConnectionsView {
    private _viewportElements: ViewportElements;
    private _procedure: Procedure;
    private _manager: ViewportManager;

    private _connectionVisuals: Map<string, ConnectionInfo>;

    private _drawnConnection: { 
        visual: ConnectionVisual,
        firstConnector: HTMLElement,
    } | null;

    constructor (manager: ViewportManager, procedure: Procedure) {
        this._procedure = procedure;
        this._manager = manager;
        this._viewportElements = manager.getViewportElements();

        this._connectionVisuals = new Map<string, ConnectionInfo>();

        this._drawnConnection = null;

        this.attachEventListeners();
    }

    public updateConnectionVisual(id: string) {
        const data = this._connectionVisuals.get(id);

        if (!data) throw new Error("Cannot update a non-existent connection!");

        const firstConnectorPos = browserToViewportPos(getElementCenter(data.conn1), this._manager.getViewportParams());
        const secondConnectorPos = browserToViewportPos(getElementCenter(data.conn2), this._manager.getViewportParams());

        const firstConnectorData = getConnectorData(data.conn1);

        this.renderConnection(data.visual, firstConnectorPos, secondConnectorPos, firstConnectorData.type === "input");
    }

    private attachEventListeners() {
        this._viewportElements.container.addEventListener("pointerdown", this.startDrawing.bind(this));
        document.addEventListener("pointermove", this.drawConnection.bind(this));
        document.addEventListener("pointerup", this.stopDrawing.bind(this));
    }

    private startDrawing(e: PointerEvent) {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target as HTMLElement;
        const connectorSVG = target.closest<HTMLElement>(".connector-svg");
        
        if (!connectorSVG) return;
        if (connectorSVG.classList.contains("connected")) return;

        this._drawnConnection = { 
            visual: this.createConnectionVisual(),
            firstConnector: connectorSVG,
        };

        this.showVisual(this._drawnConnection.visual);
        connectorSVG.classList.add("connected");
    }

    private stopDrawing(e: PointerEvent) {
        if (!this._drawnConnection) return;

        const target = e.target as HTMLElement;
        const clickedSVG = target.closest<HTMLElement>(".connector-svg");
        const secondConnector = clickedSVG?.closest<HTMLElement>(".connector");

        if (!clickedSVG || !secondConnector) {
            this.removeTempVisual();
            return;
        }

        const firstConnectorPos = browserToViewportPos(getElementCenter(this._drawnConnection.firstConnector), this._manager.getViewportParams());
        const secondConnectorPos = browserToViewportPos(getElementCenter(clickedSVG), this._manager.getViewportParams());

        const firstConnectorData = getConnectorData(this._drawnConnection.firstConnector.closest(".connector")!);
        const secondConnectorData = getConnectorData(secondConnector);

        if (firstConnectorData.type === secondConnectorData.type || firstConnectorData.connectionType !== secondConnectorData.connectionType) {
            this.removeTempVisual();
            return;
        }

        clickedSVG.classList.add("connected");

        this.renderConnection(this._drawnConnection.visual, secondConnectorPos, firstConnectorPos, firstConnectorData.type === "output");

        const connectionID = this._procedure.connect({
            node1: this._drawnConnection.firstConnector.closest<HTMLElement>(".node")?.dataset.id!,
            node2: secondConnector.closest<HTMLElement>(".node")?.dataset.id!,
            connType: parseInt(firstConnectorData.connectionType)
        });

        this._connectionVisuals.set(connectionID, {
            visual: this._drawnConnection.visual,
            conn1: this._drawnConnection.firstConnector.closest(".connector")!,
            conn2: secondConnector
        });

        this._drawnConnection = null;
    }

    private drawConnection(e: PointerEvent) {
        if (!this._drawnConnection) return;

        e.preventDefault();
        e.stopPropagation();

        const connectorPos = browserToViewportPos(getElementCenter(this._drawnConnection.firstConnector), this._manager.getViewportParams());
        const mousePos = browserToViewportPos(new Vec2(e.clientX, e.clientY), this._manager.getViewportParams());

        const firstConnectorData = getConnectorData(this._drawnConnection.firstConnector.closest(".connector")!);

        this.renderConnection(this._drawnConnection.visual, connectorPos, mousePos, firstConnectorData.type === "input");
    }

    private createConnectionVisual(): ConnectionVisual {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
        path.setAttribute("d", "M 0 0 C 0 0, 0 0, 0 0");
    
        svg.classList.add("connection");
        svg.insertAdjacentElement("beforeend", path);
    
        return { svg, path };
    }

    private showVisual(visual: ConnectionVisual) {
        this._viewportElements.viewport.connections.insertAdjacentElement("beforeend", visual.svg);
    }

    private setVisualPosition(visual: ConnectionVisual, pos: Vec2) {
        const connectionStyle = visual.svg.style;
        const newTransform = `translate(${pos.x}px, ${pos.y}px)`;

        connectionStyle.transform = newTransform;
    }

    private removeTempVisual() {
        this._drawnConnection?.visual.svg.remove();
        this._drawnConnection?.firstConnector?.classList.remove("connected");
        this._drawnConnection = null;
    }

    private renderConnection(visual: ConnectionVisual, pos1: Vec2, pos2: Vec2, reverse=false) {
        if (reverse) {
            const temp = pos1;
            pos1 = pos2;
            pos2 = temp;
        }

        // Adjust the width and height
        const connectionStyle = visual.svg.style;
        
        const distance = new Vec2(
            Math.abs(pos1.x - pos2.x),
            Math.abs(pos1.y - pos2.y)
        );
    
        if (distance.x < 6) distance.x = 6;
        if (distance.y < 6) distance.y = 6;
    
        connectionStyle.width = `${2 * distance.x}px`;
        connectionStyle.height = `${2 * distance.y}px`;
            
        // Position the SVG
        const svgPos = new Vec2(
            (pos1.x < pos2.x ? pos1.x : pos2.x) - distance.x / 2,
            (pos1.y < pos2.y ? pos1.y : pos2.y) - distance.y / 2
        );
        
        this.setVisualPosition(visual, svgPos);
    
        // Render the path
        const start = new Vec2(pos1.x - svgPos.x, pos1.y - svgPos.y);
        const end = new Vec2(pos2.x - svgPos.x, pos2.y - svgPos.y);
    
        const dst = distance.x / (start.x > end.x ? 1 : 2);
    
        const ct1 = new Vec2(start.x + dst, start.y);
        const ct2 = new Vec2(end.x - dst, end.y);
        
        visual.path.setAttribute("d", `M ${start.x} ${start.y} C ${ct1.x} ${ct1.y}, ${ct2.x} ${ct2.y}, ${end.x} ${end.y}`);
    }
}