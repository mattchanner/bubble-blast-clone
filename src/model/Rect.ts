import Point from './Point';

export default class Rect {

    public static EMPTY = new Rect(0, 0, 0, 0);

    constructor(
        private x: number, 
        private y: number, 
        private width: number, 
        private height: number) {        
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getTop() {
        return this.y;
    }

    getLeft() {
        return this.x;
    }

    getBottom() {
        return this.y + this.height;
    }

    getRight() {
        return this.x + this.width;
    }

    getCenterX() {
        return (this.width / 2) + this.x;
    }

    getCenterY() {
        return (this.height / 2) + this.y;
    }

    getCenter() {
        return new Point(this.getCenterX(), this.getCenterY());
    }

    move(newX: number, newY: number) {
        return new Rect(newX, newY, this.width, this.height);
    }

    intersects(rect: Rect) {
        if (this.getBottom() <= rect.getBottom()) return false;
        if (this.getTop() >= rect.getTop())  return false;
        if (this.getRight() <= rect.getLeft()) return false;
        if (this.getLeft() >= rect.getRight()) return false;
        
        return true;
    }
    
    contains(x: number, y: number) {
        const containsX = x >= this.x && x <= this.getRight();
        const containsY = y >= this.y && y <= this.getBottom();
        
        return containsX && containsY;
    }
}