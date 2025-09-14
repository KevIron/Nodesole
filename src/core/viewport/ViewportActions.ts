import Vec2 from "../../utils/Vector";

import type { IEditorAction } from "../../types";
import ViewportManager from "./ViewportManager";

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