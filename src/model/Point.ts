export default class Point {
    constructor(private x: number, private y: number) {}

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    equals(other: Point) : boolean {
        return this.x === other.x 
            && this.y === other.y;
    }
}