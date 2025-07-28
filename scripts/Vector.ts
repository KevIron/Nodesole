export default class Vec2 {
    x: number
    y: number

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public subtract(vec: Vec2) {
        this.x -= vec.x;
        this.y -= vec.y;  
        
        return this;
    }

    public add(vec: Vec2) {
        this.x += vec.x;
        this.y += vec.y;

        return this;
    }

    public assign(vec: Vec2) {
        this.x = vec.x;
        this.y = vec.y;

        return this;
    }

    public distanceVector(vec: Vec2) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }
}