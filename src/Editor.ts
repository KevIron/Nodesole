import Procedure from "./core/Procedure.ts";
import ViewportManager from "./core/ViewportManager.ts";
import ConditionNode from "./nodes/models/special/ConditionNode";
import Vec2 from "./utils/Vector.ts";

export default class Editor {
    private _currentProcedure: Procedure;

    constructor() {
        this._currentProcedure = new Procedure();
    }

    public displayProcedure() {
        const container = document.querySelector(".editor-tabs");
        const viewport = new ViewportManager(this._currentProcedure);
        container?.insertAdjacentElement("afterbegin", viewport.getElement());
        viewport.setOffset(new Vec2(0, 0));
        this._currentProcedure.insertNode(new ConditionNode())
    }
}

const editor = new Editor();
editor.displayProcedure()