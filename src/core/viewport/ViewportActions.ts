import Vec2 from "../../utils/Vector";

import type Node from "../../nodes/models/Node";
import type { IEditorAction } from "../../types";
import ViewportManager from "./ViewportManager";

import { browserToViewportPos } from "../../utils/Converter";
import ConnectionsView from "../viewport/ConnectionsView";

export class MoveNodeAction implements IEditorAction {
    private _node: Node;
    private _lastOffset: Vec2;

    private _manager: ViewportManager;
    private _canRedraw: boolean;
    private _connView: ConnectionsView;

    constructor(manager: ViewportManager, connectionsView: ConnectionsView, node: Node) {
        this._node = node;
        this._lastOffset = new Vec2(0, 0);
        this._manager = manager;
        this._canRedraw = true;
        this._connView = connectionsView;
    }
    
    private updateConnections() {
        this._node.getConnections().forEach(conn => this._connView.updateConnectionVisual(conn));
    }

    private handleMove(e: PointerEvent) {
        const { clientX, clientY } = e;

        const pos = new Vec2(
            Math.round((clientX - this._lastOffset.x) * 1000) / 1000,
            Math.round((clientY - this._lastOffset.y) * 1000) / 1000
        );
        
        const newPos = browserToViewportPos(pos, this._manager.getViewportParams());

        this._node.getView().setPosition(newPos);
        this.updateConnections();
    }

    public onClick(e: PointerEvent): void {
        e.preventDefault();
        
        (document.activeElement as HTMLElement)?.blur();

        const clickPos = new Vec2(e.clientX, e.clientY);
        const nodePos = this._node.getView().getElement().getBoundingClientRect();
        
        const offsetX = clickPos.x - nodePos.left;
        const offsetY = clickPos.y - nodePos.top;

        this._lastOffset.x = Math.round(offsetX);
        this._lastOffset.y = Math.round(offsetY);
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