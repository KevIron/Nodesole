import Vec2 from "../utils/Vector.ts";
import Node from "../nodes/Node.ts";
import Procedure from "./Procedure.ts";

import { IEditorAction as EditorAction } from "../types.ts";
import { MoveNodeAction, MoveViewportAction, DrawConnectionAction } from "../EditorActions.ts";

type ViewportElements = {
    container: HTMLDivElement,
    viewport: {
        container: HTMLDivElement,
        nodes: HTMLDivElement,
        connections: HTMLDivElement,
    }
    grid: HTMLCanvasElement
}

type ViewportParams = {
    zoomFactor: number, 
    offset: Vec2, 
    containerPos: Vec2
}

export default class ViewportManager {
    private _displayedProcedure: Procedure;
    private _viewportElements: ViewportElements;

    private _currentOffset: Vec2;
    private _zoomFactor: number;

    private _currentAction: EditorAction | null;
    private _lastMousePos: Vec2 | null;

    constructor (procedure: Procedure) {
        this._displayedProcedure = procedure;
        this._viewportElements = this.buildViewport();

        this._currentOffset = new Vec2(0, 0);
        this._zoomFactor = 1;

        this._currentAction = null;
        this._lastMousePos = null;

        this.attachEventListeners();
        this.updateViewport();
    }

    private buildViewport(): ViewportElements {
        const viewportContainer = document.createElement("div");

        viewportContainer.classList.add("viewport-container");

        const viewport = document.createElement("div");
        const grid = document.createElement("canvas");

        viewport.classList.add("viewport");
        grid.classList.add("viewport-grid");

        const nodesContainer = document.createElement("div");
        const connectionsContainer = document.createElement("div");

        nodesContainer.classList.add("nodes");
        connectionsContainer.classList.add("connections");

        viewport.insertAdjacentElement("beforeend", nodesContainer);
        viewport.insertAdjacentElement("beforeend", connectionsContainer);
        
        viewportContainer.insertAdjacentElement("beforeend", viewport);
        viewportContainer.insertAdjacentElement("beforeend", grid);

        return {
            container: viewportContainer,
            viewport: {
                container: viewport,
                nodes: nodesContainer,
                connections: connectionsContainer,
            },
            grid: grid
        }
    }

    private updateViewport(): void {
        const viewportTransform = `
            translate(${this._currentOffset.x}px, ${this._currentOffset.y}px) 
            scale(${this._zoomFactor})
        `;

        this._viewportElements.viewport.container.style.transform = viewportTransform;
        this.renderGrid();
    }

    private renderGrid(gridSpacing = 24, lineColor = "hsl(0, 0%, 20%)", lineWidth = 1): void {
        gridSpacing = gridSpacing * this._zoomFactor;

        // Resize the canvas
        const style = window.getComputedStyle(this._viewportElements.container);
        const width = parseInt(style.width);
        const height = parseInt(style.height);
        
        lineColor = style.getPropertyValue("--border-primary");

        this._viewportElements.grid.width = width;
        this._viewportElements.grid.height = height;

        // Draw the grid
        const ctx = this._viewportElements.grid.getContext("2d")!;

        ctx.clearRect(0, 0, width, height);

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;

        const startingPoint = new Vec2(
            0.5 + (this._currentOffset.x % gridSpacing),
            0.5 + (this._currentOffset.y % gridSpacing)
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

    private handleScroll(e: WheelEvent):void {
        e.preventDefault();

        const prevZoomFactor = this._zoomFactor;

        const zoomSpeed = 0.004;
        const maxZoom = 1.75;
        const minZoom = 0.5;

        // Convert deltaY to a value that multiplies the current zoom
        this._zoomFactor *= Math.exp(-e.deltaY * zoomSpeed);

        // Clamp the zoom and prevent weird decimals
        this._zoomFactor = Math.min(Math.max(minZoom, this._zoomFactor), maxZoom);
        this._zoomFactor = Math.round(this._zoomFactor * 100) / 100;

        // Calculate the percentage change in distance
        const ratio = 1 - this._zoomFactor / prevZoomFactor;

        // Change the mouse position origin to the container
        if (!this._lastMousePos) this._lastMousePos = new Vec2(0, 0);

        const containerRect = this._viewportElements.container.getBoundingClientRect();
        const containerPos = new Vec2(containerRect.left, containerRect.top);
        const containerRelativePos = new Vec2(this._lastMousePos.x - containerPos.x, this._lastMousePos.y - containerPos.y);

        // Cancel the distance removed while zooming
        this._currentOffset.x += (containerRelativePos.x - this._currentOffset.x) * ratio
        this._currentOffset.y += (containerRelativePos.y - this._currentOffset.y) * ratio

        this.updateViewport();
    }

    private determineAction(e: PointerEvent): void {
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

    private attachEventListeners(): void {
        window.addEventListener("resize", () => this.renderGrid());

        window.addEventListener("pointermove", (e) => {
            if (!this._lastMousePos) this._lastMousePos = new Vec2(0, 0);

            this._lastMousePos.x = e.clientX;
            this._lastMousePos.y = e.clientY;

            this._currentAction?.onMove(e);
            this.renderGrid();
        });

        window.addEventListener("pointerup", (e) => {
            this._currentAction?.onRelease?.(e);
            this._currentAction = null;
        });

        this._viewportElements.container.addEventListener("pointerdown", (e) => {
            this.determineAction(e);
            this._currentAction?.onClick?.(e);
        });

        this._viewportElements.container.addEventListener("wheel", (e) => {
            (document.activeElement as HTMLElement)?.blur();
            this.handleScroll(e);
        });
    }

    public getElement(): HTMLDivElement {
        return this._viewportElements.container;
    }

    public getOffset(): Vec2 {
        return this._currentOffset;
    }

    public setOffset(offset: Vec2): void {
        this._currentOffset = offset;
        this.updateViewport();
    }

    public getZoomFactor(): number {
        return this._zoomFactor;
    }

    public setZoomFactor(): void {}

    public getViewportParams(): ViewportParams {
        const containerRect = this._viewportElements.container.getBoundingClientRect();
        const containerPos = new Vec2(containerRect.left, containerRect.top)

        return { 
            zoomFactor: this._zoomFactor, 
            offset: this._currentOffset, 
            containerPos: containerPos
        };
    }

    public getNodeFromElement(element: HTMLElement): Node {
        const id = element.dataset.id;
        if (!id) throw new Error("Element is not a Node!")

        const node = this._displayedProcedure.getNodeFromId(id);
        return node;
    }
}