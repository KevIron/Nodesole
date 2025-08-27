import Vec2 from "./utils/Vector";
import Editor from "./Editor";
import * as Connections from "./utils/Connections";

import type Node from "./nodes/Node";
import type { Connection } from "./utils/Connections";
import type { IEditorAction } from "./types";
import { NodeConnection } from "./nodes/Node";
import ViewportManager from "./core/ViewportManager";

import { browserToViewportPos } from "./utils/Converters";

export class MoveNodeAction implements IEditorAction {
    private _node: Node;
    private _lastOffset: Vec2;

    private _manager: ViewportManager;
    private _canRedraw: boolean;

    constructor(manager: ViewportManager, node: Node) {
        this._node = node;
        this._lastOffset = new Vec2(0, 0);
        this._manager = manager;
        this._canRedraw = true;
    }

    private redrawConnection(conn: NodeConnection, type: "input" | "output") {
        const firstConnector = conn.connector;
        const firstConnectorPos = browserToViewportPos(Connections.findConnectorCenter(firstConnector), this._manager.getViewportParams());

        for (let i = 0; i < conn.visuals.length; ++i) {
            const secondConnector = conn.opositeConnectors[i];
            const secondConnectorPos = browserToViewportPos(Connections.findConnectorCenter(secondConnector), this._manager.getViewportParams());
            
            const visual = conn.visuals[i];

            const positions: [Vec2, Vec2] = [secondConnectorPos, firstConnectorPos];
            if (type === "output") positions.reverse();

            Connections.renderConnection(visual, ...positions);
        }
    }
    
    private updateConnections() {
        const connections = this._node.getConnections();

        connections.input.forEach(conn => this.redrawConnection(conn, "input"));
        connections.output.forEach(conn => this.redrawConnection(conn, "output"));
    }

    private handleMove(e: PointerEvent) {
        const { clientX, clientY } = e;

        const pos = new Vec2(
            Math.round((clientX - this._lastOffset.x) * 1000) / 1000,
            Math.round((clientY - this._lastOffset.y) * 1000) / 1000
        );
        const newPos = browserToViewportPos(pos, this._manager.getViewportParams());

        this._node.setPosition(newPos);
        this.updateConnections();
    }

    public onClick(e: PointerEvent): void {
        e.preventDefault();
        (document.activeElement as HTMLElement)?.blur();

        const { offsetX, offsetY } = e;

        this._lastOffset.x = Math.round(offsetX * this._manager.getZoomFactor());
        this._lastOffset.y = Math.round(offsetY * this._manager.getZoomFactor());
    }

    public onMove(e: PointerEvent): void {
        if (!this._canRedraw) return;

        this._canRedraw = false;

        requestAnimationFrame(() => {
            this.handleMove(e);
            this._canRedraw = true;
        })
    }
}

export class MoveViewportAction implements IEditorAction {
    private _lastPos: Vec2;
    private _manager: ViewportManager;

    constructor (manager: ViewportManager) {
        this._lastPos = new Vec2(0, 0);
        this._manager = manager;
    }

    public onClick(e: PointerEvent): void {
        e.preventDefault();
        (document.activeElement as HTMLElement)?.blur();
        
        const { clientX, clientY } = e;

        this._lastPos.x = clientX;
        this._lastPos.y = clientY;
    }

    public onMove(e: PointerEvent): void {
        const { clientX, clientY } = e;

        const curPos = new Vec2(clientX, clientY);
        const distance = curPos.distanceVector(this._lastPos);

        const offset = this._manager.getOffset();

        this._manager.setOffset(offset.add(distance));

        this._lastPos = curPos;
    }
}

export class DrawConnectionAction implements IEditorAction {
    private _node: Node;
    private _connection: Connection;

    private _clickPos: Vec2;
    private _firstConnector: SVGSVGElement | null;

    private _manager: ViewportManager;

    constructor(manager: ViewportManager, node: Node) {
        this._node = node;
        this._manager = manager;

        this._clickPos = new Vec2(0, 0);
        this._firstConnector = null;

        this._connection = Connections.createConnectionElement();
    }

    public stopDrawing() {
        this._firstConnector?.classList.remove("connected");
        this._connection.svg.remove();
    }
    
    public onClick(e: PointerEvent): void {
        e.preventDefault();
        (document.activeElement as HTMLElement)?.blur();

        const clickedElement = e.target as HTMLElement;
        const connector = clickedElement.closest("svg")!;

        if (connector.classList.contains("connected")) return;

        // Get connector center 
        const connectionPos = Connections.findConnectorCenter(connector);
        const viewportConnectorPos = browserToViewportPos(connectionPos, this._manager.getViewportParams());
        this._clickPos = viewportConnectorPos;

        this._firstConnector = connector;
        this._firstConnector.classList.add("connected");

        this._manager.insertConnection(this._connection);
    }

    public onRelease(e: PointerEvent): void {
        const target = e.target as HTMLElement;

        const firstConnector = this._firstConnector; 
        const secondConnector = target.closest("svg");

        if (
            !firstConnector || 
            !secondConnector ||
            firstConnector === secondConnector ||
            secondConnector.dataset?.type === firstConnector.dataset?.type
        ) { this.stopDrawing(); return; }

        const firstConnectorData = Connections.getConnectorData(firstConnector);
        const secondConnectorData = Connections.getConnectorData(secondConnector);
        
        if ((!((firstConnectorData.connectionType === "IGNORED" && secondConnectorData.connectionType === "CONTROL_FLOW") ||
            (firstConnectorData.connectionType === "CONTROL_FLOW" && secondConnectorData.connectionType === "IGNORED"))) &&
            (firstConnectorData.connectionType != secondConnectorData.connectionType)) { this.stopDrawing(); return; }

        const firstNode = this._node; 

        const secondNodeEl = secondConnector.closest<HTMLElement>(".node")!;        
        const secondNode = this._manager.getNodeFromElement(secondNodeEl);

        firstNode.connectTo(secondNode, {
            name: firstConnectorData.name,
            type: firstConnectorData.type,
            visual: this._connection,
            connector: secondConnector
        });

        secondNode.connectTo(firstNode, {
            name: secondConnectorData.name, 
            type: secondConnectorData.type, 
            visual: this._connection, 
            connector: firstConnector
        });

        const connectionPos = Connections.findConnectorCenter(secondConnector);
        const viewportConnectionPos = browserToViewportPos(connectionPos, this._manager.getViewportParams());

        const positions: [Vec2, Vec2] = [ viewportConnectionPos, this._clickPos ];
        if (firstConnectorData.type === "output") positions.reverse();

        Connections.renderConnection(this._connection, ...positions);

        secondConnector.classList.add("connected");
    }

    public onMove(e: PointerEvent): void {
        const curMousePos = new Vec2(e.clientX, e.clientY);
        const curPos = browserToViewportPos(curMousePos, this._manager.getViewportParams());
        
        const positions: [Vec2, Vec2] = [ curPos, this._clickPos ];
        if (this._firstConnector?.dataset.type === "output") positions.reverse();

        Connections.renderConnection(this._connection, ...positions);
   }
}