import Node from "../../nodes/models/Node";
import NodeView from "../../nodes/views/NodeView";
import { browserToViewportPos } from "../../utils/Converter";
import Vec2 from "../../utils/Vector";
import Procedure from "../Procedure";
import ConnectionsManager from "./ConnectionsManager";
import ViewportManager from "./ViewportManager";

export default class NodesManager {
    private _manager: ViewportManager;
    private _connectionsManager: ConnectionsManager;
    private _procedure: Procedure;

    private _nodeViews: Map<string, NodeView>;

    private _movedNodeData: {
        node: Node,
        clickOffset: Vec2
    } | null;

    constructor (viewportManager: ViewportManager, connectionsManager: ConnectionsManager, procedure: Procedure) {
        this._manager = viewportManager;
        this._procedure = procedure;
        this._connectionsManager = connectionsManager;

        this._nodeViews = new Map();

        this._movedNodeData = null;

        this.attachEventListeners();
        this.renderProcedureNodes();
    }

    private attachEventListeners() {
        this._procedure.on("nodeAdded", (node: Node) => this.displayNode(node));

        this._manager.getViewportElements().container.addEventListener("pointerdown", this.startMoving.bind(this));
        document.addEventListener("pointermove", this.moveNode.bind(this));
        document.addEventListener("pointerup", this.stopMoving.bind(this));
    }

    private startMoving(e: PointerEvent) {
        const target = e.target as HTMLElement;
        const closestNode = target.closest<HTMLElement>(".node");

        if (!target.classList.contains("node")) return;
        if (!closestNode) return;

        e.preventDefault();
        (document.activeElement as HTMLElement)?.blur();

        const clickedNode = this._manager.getNodeFromElement(closestNode);

        const clickPos = new Vec2(e.clientX, e.clientY);
        const nodePos = this.getViewFromNode(clickedNode).getElement().getBoundingClientRect();
        
        const offsetX = clickPos.x - nodePos.left;
        const offsetY = clickPos.y - nodePos.top;

        this._movedNodeData = {
            clickOffset: new Vec2(
                Math.round(offsetX),
                Math.round(offsetY)
            ),
            node: clickedNode
        };
    }

    private stopMoving(e: PointerEvent) {
        if (this._movedNodeData) this._movedNodeData = null;
    }

    private moveNode(e: PointerEvent) {
        if (!this._movedNodeData) return;

        const { clientX, clientY } = e;

        const pos = new Vec2(
            Math.round((clientX - this._movedNodeData.clickOffset.x) * 1000) / 1000,
            Math.round((clientY - this._movedNodeData.clickOffset.y) * 1000) / 1000
        );
        
        console.log(pos)

        const newPos = browserToViewportPos(pos, this._manager.getViewportParams());

        this.getViewFromNode(this._movedNodeData.node).setPosition(newPos);
        this._movedNodeData.node.getConnections().forEach(conn => this._connectionsManager.updateConnectionVisual(conn));
    }

    private displayNode(node: Node) {
        const nodeView = node.createView();
        const nodeElement = nodeView.getElement();

        this._manager.getViewportElements().viewport.nodes.appendChild(nodeElement);
        this._nodeViews.set(node.getID(), nodeView);
    }

    private renderProcedureNodes() {
        const nodes = this._procedure.getNodes();
        nodes.forEach(node => this.displayNode(node));
    }

    public getViewFromNode(node: Node) {
        const nodeView = this._nodeViews.get(node.getID());
        if (!nodeView) throw new Error(`Node with id - ${node.getID()} doesn't exist!`);

        return nodeView;
    }
}