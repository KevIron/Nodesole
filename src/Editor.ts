import traverse from "./utils/Execution";
import type Node from "./nodes/Node";

enum NODE_TYPES {
    ENTRY_NODE,
    CONSOLE_WRITER_NODE, 
    CONSTANT_EMITTER_NODE,

    EQUALS_TO_NODE,
    NEGATION_NODE,
    AND_NODE,
    OR_NODE,

    CONDITION_NODE,
}

export default class Editor {
    private _existingNodes: Map<string, Node>;
    private _entryNode!: Node;

    constructor() {
        this._existingNodes = new Map<string, Node>();

        // this.insertNode(NODE_TYPES.ENTRY_NODE);
    }

    // public insertNode(nodeType: NODE_TYPES) {
    //     let createdNode: Node;

    //     switch (nodeType) {
    //         case NODE_TYPES.ENTRY_NODE:
    //             createdNode = new EntryNode();
    //             this._entryNode = createdNode;
    //             break;
    //         case NODE_TYPES.CONSOLE_WRITER_NODE:
    //             createdNode = new ConsoleWriterNode();
    //             break;
    //         case NODE_TYPES.CONSTANT_EMITTER_NODE:
    //             createdNode = new ConstantEmitterNode();
    //             break;
    //         case NODE_TYPES.EQUALS_TO_NODE:
    //             createdNode = new EqualsToNode();
    //             break;
    //         case NODE_TYPES.NEGATION_NODE:
    //             createdNode = new NegationNode();
    //             break;
    //         case NODE_TYPES.AND_NODE:
    //             createdNode = new AndNode();
    //             break;
    //          case NODE_TYPES.OR_NODE:
    //             createdNode = new OrNode();
    //             break;
    //           case NODE_TYPES.CONDITION_NODE:
    //             createdNode = new ConditionNode(this._existingNodes);
    //             break;
    //     }

    //     const uuid = createdNode.getID();

    //     this._existingNodes.set(uuid, createdNode);

    //     // createdNode.insertInto(this._nodesContainer);
    //     // createdNode.setPosition(new Vec2(0, 0));
    // }

    public async execute() {
        const seenNodes = new Set<string>();
        const executionStack: string[] = [];

        traverse(seenNodes, executionStack, this._entryNode);

        for (const id of executionStack) {
            const node = this._existingNodes.get(id)!;
            await node.execute();
        }
    }

    public getNodeFromElement(element: HTMLElement) {
        const id = element.dataset.id!;
        const node = this._existingNodes.get(id)!;

        return node;
    }
}

const editor = new Editor();