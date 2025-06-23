"use strict";

export default class Editor {
    constructor() {
        this._editorContainer = document.querySelector(".editor-container");
        this._viewport = this._editorContainer.querySelector(".viewport");

        this._nodes = document.querySelector(".nodes");
        this._connections = document.querySelector(".connections");
        this._grid = document.querySelector(".grid");

        this.viewportOffset = { x: 0, y: 0};
        this.zoom = 1;

        this.gridSize = 16;

        this._drawGrid();
        this._attachEventListeners();
    }

    _attachEventListeners() {
        window.addEventListener("resize", this._drawGrid.bind(this))
        
        const handler = this._handleMove.bind(this);

        this._editorContainer.addEventListener("mousedown", () => {
            document.addEventListener("mousemove", handler)}
        );

        this._editorContainer.addEventListener("mouseup", () => document.removeEventListener("mousemove", handler));
    }

    _handleMove(e) {
        e.preventDefault();
        e.stopPropagation();

        const closestNode = e.target.closest(".node");

        if (closestNode) this._moveNode(e, closestNode);
        if (e.target.classList.contains("editor-container")) this._moveVieport(e);
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