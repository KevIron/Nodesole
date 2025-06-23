"use strict";

export default class Node {
    constructor() {
        this._nodeContainer = document.createElement("div");
        this._nodeContainer.classList.add("node");
        this._nodeContainer.insertAdjacentHTML("afterbegin", this._generateNodeTemplate())
    }

    /**
     * Function that generate a string of valid HTML to use as a node body
     * @abstract
     * @returns {string}
     */
    _generateNodeTemplate() { throw new Error("Every node must contain a _generateNodeTemplate function!") }

    getNodeElement() {
        return this._nodeContainer;
    }
}
