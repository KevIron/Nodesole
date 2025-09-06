export interface IEditorAction {
    onClick?(e: PointerEvent): void
    onRelease?(e: PointerEvent): void
    onMove(e: PointerEvent): void
}

export enum CONNECTION_TYPE {
    IGNORED,
    DATA,
    CONTROL_FLOW
}
