"use strict";

import Node from "./Node.js";

export default class EntryNode extends Node {
    constructor() {
        super();
    }

    _generateNodeTemplate() {
        return `
            <div class="node-header">
                <span>Starting Node</span>
            </div>
            <div class="node-body">
                <div class="input-points"></div>
                <div class="descriptions">
                    OnStart
                </div>
                <svg class="output-point" width="26" height="18" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 8H8.85742C9.01045 8 9.15518 7.92968 9.25 7.80957L11.6182 4.80957C11.7615 4.62794 11.7615 4.37206 11.6182 4.19043L9.25 1.19043C9.15518 1.07032 9.01045 1 8.85742 1H1.5C1.22386 1 1 1.22386 1 1.5V7.5C1 7.74171 1.17145 7.94371 1.39941 7.99023L1.5 8Z" stroke="#F5F5F5"/>
                </svg>
            </div>
        `;
    }
}

