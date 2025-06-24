"use strict";

import Editor from "./scripts/Editor.js"
import EntryNode from "./scripts/EntryNode.js"
import OutputNode from "./scripts/OutputNode.js"

const e = new Editor();
e.insertNode(new EntryNode());
e.insertNode(new OutputNode());
e.insertNode(new EntryNode());
e.insertNode(new OutputNode());
