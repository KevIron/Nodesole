import Vec2 from "./Vector.ts";

export function browserToViewportPos(pos: Vec2, params: { zoomFactor: number, offset: Vec2, containerPos: Vec2 }): Vec2 {
    const containerRelativePos = pos.distanceVector(params.containerPos);
    const viewportRelativePos = containerRelativePos.subtract(params.offset);

    const x = viewportRelativePos.x / params.zoomFactor;
    const y = viewportRelativePos.y / params.zoomFactor;

    return new Vec2(x, y);
}