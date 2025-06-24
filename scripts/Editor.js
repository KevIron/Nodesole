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

        this._currentlyDrawnConnection = null;

        this.gridSize = 16;

        this._drawGrid();
        this._attachEventListeners();
    }

    _convertScreenToViewportPos({x, y}) {
        const mainContainerPos = this._editorContainer.getBoundingClientRect();

        const offsetX = x - mainContainerPos.x
        const offsetY = y - mainContainerPos.y;

        return { x: offsetX - this.viewportOffset.x, y: offsetY - this.viewportOffset.y }
    }

    _attachEventListeners() {
        window.addEventListener("resize", this._drawGrid.bind(this))
        this._editorContainer.addEventListener("mousedown", this._handleClick.bind(this));
    }

    _handleClick(e) {
        e.preventDefault();

        if (e.button != 0) return;

        let action = { onMove: undefined, onRelease: undefined }

        const closestNode = e.target.closest(".node");
        const closestConnector = e.target.closest("svg");

        if (closestConnector) action = this._handleConnectionDrawing(closestConnector);
        else if (closestNode) action = this._handleNodeDragging(closestNode);
        else if (e.target.classList.contains("editor-container"))  action = this._handlePanning();

        document.addEventListener("mousemove", action.onMove);
        document.addEventListener("mouseup", (e) => {
            action.onRelease?.(e);
            document.removeEventListener("mousemove", action.onMove);
        }, { once: true });
    }

    _handleConnectionDrawing(clickedConnector) {
        const startPos = this._getConnectionPoint(clickedConnector);
        const svg = this._createConnectorSVG(startPos);

        this._currentlyDrawnConnection = svg;

        const handler = (e) => {
            const endPos = this._convertScreenToViewportPos({x: e.clientX, y: e.clientY});
            this._drawConnection(startPos, endPos);
        }

        const remover = (e) => {
            const connectionPoint = e.target.closest(".input-point");

            if (this._currentlyDrawnConnection && !connectionPoint) {
                this._currentlyDrawnConnection.remove();
                this._currentlyDrawnConnection = null;
            } else {
                const endPos = this._getConnectionPoint(connectionPoint);
                
                this._drawConnection(startPos, endPos);

                clickedConnector.classList.add("used");
                connectionPoint.classList.add("used");

                this._currentlyDrawnConnection = null;
            }
        }

        return { onMove: handler, onRelease: remover }
    }

    _handleNodeDragging(node) {
        const handler = (e) => {
            this._moveNode(e, node);
        }

        return { onMove: handler, onRelease: undefined }
    }

    _handlePanning() {
        const handler = (e) => {
            this._moveVieport(e);
        }

        return { onMove: handler, onRelease: undefined }
    }

    _drawConnection(startPos, endPos) {
        const dst = { x: endPos.x - startPos.x, y: endPos.y - startPos.y }

        const scale = `scale(${ dst.x > 0 ? 1 : -1}, ${ dst.y > 0 ? 1 : -1})`;
        const translate = `translate(${ dst.x > 0 ? 0 : -dst.x}px, ${ dst.y > 0 ? 0 : -dst.y}px)`

        this._currentlyDrawnConnection.style.transform = `${scale} ${translate}`;

        dst.x = Math.abs(dst.x);
        dst.y = Math.abs(dst.y);

        this._currentlyDrawnConnection.style.width = `${dst.x + 2}px`;
        this._currentlyDrawnConnection.style.height = `${dst.y + 2}px`;

        const curve = this._currentlyDrawnConnection.querySelector("path");

        curve.setAttribute("d", `M 0 2 C ${dst.x / 2} 0, ${dst.x / 2} ${dst.y}, ${dst.x} ${dst.y}`);
    }

    _moveNode({movementX, movementY}, node) {
        const style = window.getComputedStyle(node);

        const newTopPos = parseInt(style.top) + movementY;
        const newLeftPos = parseInt(style.left) + movementX;

        node.style.top = `${newTopPos}px`;
        node.style.left = `${newLeftPos}px`;
    }

    _moveVieport({movementX, movementY}) {
        this.viewportOffset.y += movementY;
        this.viewportOffset.x += movementX;

        this._viewport.style.transform = `translate(${this.viewportOffset.x}px, ${this.viewportOffset.y}px)`;
        this._drawGrid();
    }

    _createConnectorSVG({x, y}) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const path = document.createElementNS('http://www.w3.org/2000/svg',"path"); 

        svg.classList.add("connection");
        svg.style.top = `${y}px`;
        svg.style.left = `${x}px`;

        svg.appendChild(path);

        this._connections.appendChild(svg);

        return svg;
    }

    _getConnectionPoint(connectorSVG) {
        const data = connectorSVG.getBoundingClientRect();
        const connectorPos = { x: data.x + data.width, y: data.y + Math.floor(data.height / 2) - 2 }

        return this._convertScreenToViewportPos(connectorPos)
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