import Procedure from "./core/Procedure.ts";
import ViewportManager from "./core/viewport/ViewportManager";
import Vec2 from "./utils/Vector.ts";

import AndNode from "./nodes/models/logic/AndNode";
import EqualsToNode from "./nodes/models/logic/EqualsToNode";
import NegationNode from "./nodes/models/logic/NegationNode";
import OrNode from "./nodes/models/logic/OrNode";
import ConditionNode from "./nodes/models/special/ConditionNode";
import ConstantEmitterNode from "./nodes/models/special/ConstantEmitterNode";
import ConsoleWriterNode from "./nodes/models/console/ConsoleWriterNode";
import ConsoleView from "./core/ConsoleView";
import ConsoleReaderNode from "./nodes/models/console/ConsoleReaderNode";

export default class Editor {
    private _currentProcedure: Procedure;

    constructor() {
        this._currentProcedure = new Procedure();
    }

    public displayProcedure() {
        const container = document.querySelector(".editor-canvas");
        const viewport = new ViewportManager(this._currentProcedure);

        const consoles = document.querySelector(".console");
        const btnClear = document.querySelector(".btn-clear");
        const btnStart = document.querySelector(".action-btn__start");

        const consl = new ConsoleView();

        consoles?.insertAdjacentElement("beforeend", consl.getElement());
        btnClear?.addEventListener("click", (e) => consl.clearConsole());
        btnStart?.addEventListener("click", (e) => {
            consl.clearConsole(); 
            this._currentProcedure.execute();
        });

        container?.insertAdjacentElement("afterbegin", viewport.getElement());
        viewport.setOffset(new Vec2(0, 0));

        this._currentProcedure.insertNode(new ConditionNode(this._currentProcedure));
        this._currentProcedure.insertNode(new AndNode());
        this._currentProcedure.insertNode(new OrNode());
        this._currentProcedure.insertNode(new NegationNode());
        this._currentProcedure.insertNode(new EqualsToNode());
        this._currentProcedure.insertNode(new ConstantEmitterNode());
        this._currentProcedure.insertNode(new ConstantEmitterNode());
        this._currentProcedure.insertNode(new ConsoleWriterNode(consl));
        this._currentProcedure.insertNode(new ConsoleReaderNode(consl));
    }
}

const editor = new Editor();
editor.displayProcedure()