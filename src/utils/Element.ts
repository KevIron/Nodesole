import Vec2 from "./Vector";

export function getElementCenter(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const center = new Vec2(rect.x + (rect.width / 2), rect.y + (rect.height / 2));

    return center;
}