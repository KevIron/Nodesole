"use strict";

class Editor {
    constructor() {
        this._nodeGrid = document.querySelector(".nodes-container");
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
