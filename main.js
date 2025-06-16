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
        this._generateNodeTemplate();
    }

    _generateNodeTemplate() {
        container.classList.add("node");

        const nodeMoverFunction = this._moveNode.bind(this);

        container.addEventListener("mousedown", () =>  container.addEventListener("mousemove", nodeMoverFunction));
        container.addEventListener("mouseup", () => container.removeEventListener("mousemove", nodeMoverFunction));
    }

    _moveNode({movementX, movementY}) {
        const style = window.getComputedStyle(this._nodeContainer);

        this._nodeContainer.style.top = `${parseInt(style.top) + movementY}px`;
        this._nodeContainer.style.left = `${parseInt(style.left) + movementX}px`;
    }

    getNodeElement() {
        return this._nodeContainer;
    }
}

const e = new Editor();
e.insertNode(new Node());
