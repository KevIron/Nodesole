"use strict";

export default class Node {
    constructor() {
        this._nodeContainer = document.createElement("div");
        this._nodeContainer.classList.add("node");
        
        this._nodeTitle = "BaseNode";        
    }

    /**
     * Function that generate a string of valid HTML to use as a node body
     * @abstract
     * @returns {string}
     */
    _generateNodeTemplate() { throw new Error("Every node must contain a _generateNodeTemplate function!") }

    _generateNodeHeaderTemplate() { 
        return `
            <div class="node-header">
                <span>${this._nodeTitle}</span>
            </div>
        `;
    }

    setTitle(title) {
        this._nodeTitle = title;
    }

    setClass(classname) {
        this._nodeContainer.classList.add(classname);
    }

    getNodeElement() {
        const header = this._generateNodeHeaderTemplate();
        const body = this._generateNodeTemplate();
        
        this._nodeContainer.insertAdjacentHTML("afterbegin", header + body);

        return this._nodeContainer;
    }
}
