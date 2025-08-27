export type NodeStructure = {
    title: string, 
    styleClass: string
}

export interface IEditorAction {
    onClick?(e: PointerEvent): void
    onRelease?(e: PointerEvent): void
    onMove(e: PointerEvent): void
}

export type ConnectorData = {
    name: string,
    type: "input" | "output",
}

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