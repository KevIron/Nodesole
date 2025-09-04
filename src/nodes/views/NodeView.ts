export default abstract class NodeView {
    // public getPosition() {
    //     if (!this._nodeContainer) return new Vec2(0, 0);

    //     const transform = window.getComputedStyle(this._nodeContainer).transform;
    //     const [ x, y ] = transform.replace(/[a-z(),]+/g, "").split(" ").slice(-2);

    //     return new Vec2(parseFloat(x), parseFloat(y));
    // }

    // public setPosition(pos: Vec2) {
    //     if (!this._nodeContainer) return;

    //     const nodeTransform = `translate(${pos.x}px, ${pos.y}px)`;
    //     this._nodeContainer.style.transform = nodeTransform;
    // }
}