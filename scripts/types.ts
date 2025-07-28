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