import Vec2 from "./utils/Vector";
import traverse from "./utils/Execution";

import EntryNode from "./nodes/EntryNode";
import ConsoleWritterNode from "./nodes/ConsoleWritterNode";
import ConstantEmmiterNode from "./nodes/ConstantEmmiterNode";
import EqualsToNode from "./nodes/logic/EqualsToNode";
import NegationNode from "./nodes/logic/NegationNode";
import AndNode from "./nodes/logic/AndNode";
import OrNode from "./nodes/logic/OrNode";
import ConditionNode from "./nodes/ConditionNode";

import { MoveNodeAction, MoveViewportAction, DrawConnectionAction } from "./EditorActions";

import type { IEditorAction } from "./types";
import type { Connection } from "./utils/Connections";
import type Node from "./nodes/Node";

enum NODE_TYPES {
    ENTRY_NODE,
    CONSOLE_WRITTER_NODE, 
    CONSTANT_EMMITER_NODE,

    EQUALS_TO_NODE,
    NEGATION_NODE,
    AND_NODE,
    OR_NODE,

    CONDITION_NODE,
}

export default class Editor {
    private _editorContainer: HTMLDivElement;
    private _viewportContainer: HTMLDivElement;
    private _nodesContainer: HTMLDivElement;
    private _connectionsContainer: HTMLDivElement;
    
    private _editorGrid: HTMLCanvasElement;

    private _viewportOffset: Vec2;
    private _zoomFactor: number;
    private _existingNodes: Map<string, Node>;
    private _currentAction: IEditorAction | null;

    private _canDraw: boolean;
    public _lastMousePos: Vec2;

    private _entryNode!: Node;

    constructor(parentContainer: HTMLElement) {
        this._editorContainer = this.buildElement();

        this._nodesContainer = this._editorContainer.querySelector(".nodes")!;
        this._viewportContainer = this._editorContainer.querySelector(".viewport")!;
        this._connectionsContainer = this._editorContainer.querySelector(".connections")!;
        this._editorGrid = this._editorContainer.querySelector(".viewport-grid")!;

        this._viewportOffset = new Vec2(0, 0);
        this._zoomFactor = 1;
        this._existingNodes = new Map<string, Node>();
        this._currentAction = null;

        this._canDraw = true;
        this._lastMousePos = new Vec2(0, 0);

        parentContainer.appendChild(this._editorContainer);

        this.attachEventListeners();
        this.updateViewportTransform();
        this.renderGrid();

        this.inserNode(NODE_TYPES.ENTRY_NODE);
    }

    public setViewportOffset(vec: Vec2) {
        this._viewportOffset.assign(vec);
        this.updateViewportTransform();
    }

    public updateViewportTransform() {
        const viewportTransform = `translate(${this._viewportOffset.x}px, ${this._viewportOffset.y}px) scale(${this._zoomFactor})`;
        this._viewportContainer.style.transform = viewportTransform;
    }

    public getViewportOffset() {
        return this._viewportOffset;
    }

    public getZoomFactor() {
        return this._zoomFactor;
    }

    public inserNode(nodeType: NODE_TYPES) {
        let createdNode: Node;

        switch (nodeType) {
            case NODE_TYPES.ENTRY_NODE:
                createdNode = new EntryNode();
                this._entryNode = createdNode;
                break;
            case NODE_TYPES.CONSOLE_WRITTER_NODE:
                createdNode = new ConsoleWritterNode();
                break;
            case NODE_TYPES.CONSTANT_EMMITER_NODE:
                createdNode = new ConstantEmmiterNode();
                break;
            case NODE_TYPES.EQUALS_TO_NODE:
                createdNode = new EqualsToNode();
                break;
            case NODE_TYPES.NEGATION_NODE:
                createdNode = new NegationNode();
                break;
            case NODE_TYPES.AND_NODE:
                createdNode = new AndNode();
                break;
             case NODE_TYPES.OR_NODE:
                createdNode = new OrNode();
                break;
              case NODE_TYPES.CONDITION_NODE:
                createdNode = new ConditionNode(this._existingNodes);
                break;
        }

        const uuid = createdNode.getID();

        this._existingNodes.set(uuid, createdNode);

        createdNode.insertInto(this._nodesContainer);
        createdNode.setPosition(new Vec2(0, 0));
    }

    public insertConnection(conn: Connection) {
        this._connectionsContainer.insertAdjacentElement("beforeend",conn.svg);
    }

    private buildElement() {
        const viewportContainer = document.createElement("div");
        const editorMarkup = `
            <div class="viewport">
                <div class="nodes"></div>
                <div class="connections"></div>
            </div>
            <canvas class="viewport-grid"></canvas>
        `;

        viewportContainer.classList.add("viewport-container")
        viewportContainer.insertAdjacentHTML("beforeend", editorMarkup);

        return viewportContainer;
    }

    private attachEventListeners() {
        window.addEventListener("resize", () => {
            this.renderGrid();
        });

        window.addEventListener("pointermove", (e) => {
            this._currentAction?.onMove(e);

            this._lastMousePos.x = e.clientX;
            this._lastMousePos.y = e.clientY;

            if (!this._canDraw) return;
            this._canDraw = false;
            requestAnimationFrame(() => {
                this.renderGrid();
                this._canDraw = true;
            });
        });

        window.addEventListener("pointerup", (e) => {
            this._currentAction?.onRelease?.(e);
            this._currentAction = null;
        });

        this._editorContainer.addEventListener("pointerdown", (e) => {
            this.determineAction(e);
            this._currentAction?.onClick?.(e);
        });

        this._editorContainer.addEventListener("wheel", (e) => {
            (document.activeElement as HTMLElement)?.blur();
            
            if (!this._canDraw) return;
            this._canDraw = false;

            requestAnimationFrame(() => {
                this.handleScroll(e);
                this._canDraw = true;
            }); 
        });

        document.addEventListener("keydown", (e)=> {
            if (e.key === "k") {
                this.execute();
            }
        })
    }

    private handleScroll(e: WheelEvent) {
        e.preventDefault();

        const prevZoomFactor = this._zoomFactor;

        const zoomSpeed = 0.004;
        const maxZoom = 1.75;
        const minZoom = 0.5;

        // Convert deltaY to a value that multiplies the current zoom
        this._zoomFactor *= Math.exp(-e.deltaY * zoomSpeed);

        // Calmp the zoom and prevent weird decimals
        this._zoomFactor = Math.min(Math.max(minZoom, this._zoomFactor), maxZoom);
        this._zoomFactor = Math.round(this._zoomFactor * 100) / 100;

        // Calculate the percentage change in distance
        const ratio = 1 - this._zoomFactor / prevZoomFactor;

        // Change the mouse position origin to the container
        const contianerRect = this._editorContainer.getBoundingClientRect();
        const containerPos = new Vec2(contianerRect.left, contianerRect.top);
        const containerRelativePos = new Vec2(this._lastMousePos.x - containerPos.x, this._lastMousePos.y - containerPos.y);

        // Cancel the distance removed while zooming
        this._viewportOffset.x += (containerRelativePos.x - this._viewportOffset.x) * ratio
        this._viewportOffset.y += (containerRelativePos.y - this._viewportOffset.y) * ratio

        this.updateViewportTransform();
        this.renderGrid();
    }

    private determineAction(e: PointerEvent) {
        e.stopPropagation();

        const clickedElement = e.target as HTMLElement;
        
        if (clickedElement.classList.contains("node")) {
            const node = this.getNodeFromElement(clickedElement);
            node.getPosition();
            this._currentAction = new MoveNodeAction(this, node);
        }

        if (clickedElement.classList.contains("viewport-container")) {
            this._currentAction = new MoveViewportAction(this);
        }
        
        if (clickedElement.closest(".connector")) {
            const nearestNode = clickedElement.closest<HTMLElement>(".node")!;
            const node = this.getNodeFromElement(nearestNode);

            this._currentAction = new DrawConnectionAction(this, node);
        }
    }

    private renderGrid(gridSpacing = 24, lineColor = "hsl(0, 0%, 20%)", lineWidth = 1) {
        gridSpacing = gridSpacing * this._zoomFactor;

        // Resize the canvas
        const style = window.getComputedStyle(this._editorContainer);
        const width = parseInt(style.width);
        const height = parseInt(style.height);
        
        lineColor = style.getPropertyValue("--border-primary");

        this._editorGrid.width = width;
        this._editorGrid.height = height;

        // Draw the grid
        const ctx = this._editorGrid.getContext("2d")!;

        ctx.clearRect(0, 0, width, height);

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;

        const startingPoint = new Vec2(
            0.5 + (this._viewportOffset.x % gridSpacing),
            0.5 + (this._viewportOffset.y % gridSpacing)
        );

        for (let i = startingPoint.x; i < width; i += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        for (let i = startingPoint.y; i < height; i += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    }

    public async execute() {
        const seenNodes = new Set<string>();
        const executionStack: string[] = [];

        traverse(seenNodes, executionStack, this._entryNode);

        for (const id of executionStack) {
            const node = this._existingNodes.get(id)!;
            await node.execute();
        }
    }

    public convertCoordinates(pos: Vec2) {
        const contianerRect = this._editorContainer.getBoundingClientRect();
        const containerPos = new Vec2(contianerRect.left, contianerRect.top);

        const containerRelativePos = pos.subtract(containerPos);
        const viewportRelativePos = containerRelativePos.subtract(this._viewportOffset);

        const x = viewportRelativePos.x / this._zoomFactor;
        const y = viewportRelativePos.y / this._zoomFactor;

        return new Vec2(x, y);
    }

    public getNodeFromElement(element: HTMLElement) {
        const id = element.dataset.id!;
        const node = this._existingNodes.get(id)!;

        return node;
    }
}

const body = document.querySelector<HTMLElement>(".editor-tabs")!;
const editor = new Editor(body);

editor.inserNode(NODE_TYPES.CONSOLE_WRITTER_NODE);
editor.inserNode(NODE_TYPES.CONSOLE_WRITTER_NODE);
editor.inserNode(NODE_TYPES.CONSOLE_WRITTER_NODE);
editor.inserNode(NODE_TYPES.CONSTANT_EMMITER_NODE);
editor.inserNode(NODE_TYPES.CONSTANT_EMMITER_NODE);
editor.inserNode(NODE_TYPES.EQUALS_TO_NODE);
editor.inserNode(NODE_TYPES.CONDITION_NODE);
editor.inserNode(NODE_TYPES.NEGATION_NODE);
editor.inserNode(NODE_TYPES.AND_NODE);
editor.inserNode(NODE_TYPES.OR_NODE);
