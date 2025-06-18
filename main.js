"use strict";

class Editor {
    constructor() {
        this._nodeGrid = document.querySelector(".nodes-container");
        this._canvas = document.querySelector(".editor-grid");

        this._drawGrid();
        window.addEventListener("resize", this._drawGrid.bind(this))
    }

    _drawGrid() {
        const ctx = this._canvas.getContext("2d");
        const rect = this._nodeGrid.getBoundingClientRect();
        
        ctx.canvas.width  = rect.width;
        ctx.canvas.height = rect.height;
        
        ctx.strokeStyle = "gray";

        for (let i = 0; i < rect.width; i += 16) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, ctx.canvas.height);
            ctx.stroke()
        }
        
        for (let j = 0; j < rect.height; j += 16) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(ctx.canvas.width, j);
            ctx.stroke()
        }
    }

    insertNode(node) {
        this._nodeGrid.insertAdjacentElement('beforeend', node.getNodeElement());
    }
}

class Node {
    constructor() {
        this._nodeContainer = document.createElement("div");
        this._attachNodeEventListeners();
    }

    _attachNodeEventListeners() {
        this._nodeContainer.classList.add("node");

        const nodeMoverFunction = this._moveNode.bind(this);

        this._nodeContainer.addEventListener("mousedown", () =>  document.addEventListener("mousemove", nodeMoverFunction));
        this._nodeContainer.addEventListener("mouseup", () => document.removeEventListener("mousemove", nodeMoverFunction));
    }

    _moveNode({movementX, movementY}) {
        const style = window.getComputedStyle(this._nodeContainer);

        const newTopPos = parseInt(style.top) + movementY;
        const newLeftPos = parseInt(style.left) + movementX;

        this._nodeContainer.style.top = `${newTopPos}px`;
        this._nodeContainer.style.left = `${newLeftPos}px`;
    }

    getNodeElement() {
        return this._nodeContainer;
    }
}

const e = new Editor();
e.insertNode(new Node());
