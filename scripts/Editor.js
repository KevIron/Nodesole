"use strict";

export default class Editor {
    constructor() {
        this._editorContainer = document.querySelector(".editor-container");
        this._viewport = this._editorContainer.querySelector(".viewport");

        this._nodes = document.querySelector(".nodes");
        this._connections = document.querySelector(".connections");
        this._grid = document.querySelector(".grid");

        this.dragStartPos = {x: 0, y: 0 }
        this.viewportOffset = { x: 0, y: 0 };
        this.zoom = 1;

        this.gridSize = 16;

        this._drawGrid();
        this._attachEventListeners();
    }

    _convertToViewportPos({x, y}) {
        const mainContainerPos = this._editorContainer.getBoundingClientRect();
        const clickedPos = { x: x - mainContainerPos.x, y: y - mainContainerPos.y }
        return { x: clickedPos.x - this.viewportOffset.x, y: clickedPos.y - this.viewportOffset.y }
    }

    _attachEventListeners() {
        window.addEventListener("resize", this._drawGrid.bind(this))
        this._editorContainer.addEventListener("mousedown", this._handleClick.bind(this));
    }

    /**
     * This function handles a click event inside of the editor
     * it figures out what part of the editor was clicked and activates an approperiate functionality
     * @param {PointerEvent} e - Click Event 
     */
    _handleClick(e) {
        const closestNode = e.target.closest(".node");
        const closestSVG = e.target.closest("svg");

        let handler = undefined;

        if (closestSVG) handler = this._drawConnection;
        else if (closestNode) handler = (e) => this._moveNode(e, closestNode);
        else if (e.target.classList.contains("editor-container")) handler = this._moveVieport;
        
        wthis._convertToViewportPos({x: e.clientX, y: e.clientY})

        handler = handler.bind(this);

        document.addEventListener("mousemove", handler);
        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", handler), { once: true });
    }

    _moveVieport({movementX, movementY}) {
        this.viewportOffset.y += movementY;
        this.viewportOffset.x += movementX;

        this._viewport.style.transform = `translate(${this.viewportOffset.x}px, ${this.viewportOffset.y}px)`;
        this._drawGrid();
    }

    _moveNode({movementX, movementY}, node) {
        const style = window.getComputedStyle(node);

        const newTopPos = parseInt(style.top) + movementY;
        const newLeftPos = parseInt(style.left) + movementX;

        node.style.top = `${newTopPos}px`;
        node.style.left = `${newLeftPos}px`;
    }

    _drawConnection() {
        
    }

    _insertConnectorSVG({x, y}) {
        const newConnection = document.createElement(svg);

        newConnection.
        newConnection.classList.add("connection");
    }

    _drawGrid() {
        const ctx = this._grid.getContext("2d");
        const rect = this._nodes.getBoundingClientRect();

        ctx.canvas.width  = rect.width;
        ctx.canvas.height = rect.height;
        
        ctx.strokeStyle = "gray";

        for (let i = this.viewportOffset.x % this.gridSize; i < rect.width; i += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, ctx.canvas.height);
            ctx.stroke()
        }
        
        for (let j = this.viewportOffset.y % this.gridSize; j < rect.height; j += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(ctx.canvas.width, j);
            ctx.stroke()
        }
    }

    insertNode(node) {
        this._nodes.insertAdjacentElement('beforeend', node.getNodeElement());
    }
}