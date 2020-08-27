import Rect from '../model/Rect';
import { Direction } from '../model/Direction';
import Sprite from './Sprite';
import { setCoords, setStrokeAndFill } from './SVGHelper';
import DefinitionsProvider from '../model/DefinitionsProvider';

export default class Bullet implements Sprite {
    
    private static bulletIndex = 1;

    private rect: Rect;

    private bulletRect: Rect;

    private bullet: SVGEllipseElement;

    private direction: Direction;

    private destroyed = false;

    constructor(private parent: SVGElement, bubbleColour: string) {
        this.bullet = document!.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        this.bullet.id = `bullet-${Bullet.bulletIndex++}`;
        this.parent.appendChild(this.bullet);

        this.bullet.style.opacity = "0.6";
        this.direction = Direction.East;
        this.rect = Rect.EMPTY;
        this.bulletRect = Rect.EMPTY;        
    }

    setDirection(direction: Direction) {
        this.direction = direction;
    }

    getDirection() {
        return this.direction;
    }

    getRect(): Rect {
        return this.rect;
    }

    setBounds(rect: Rect): void {
        this.rect = rect;

        const bulletWidth = rect.getWidth() / 2;
        let halfWidth = bulletWidth / 3;
        let halfHeight = bulletWidth / 3;

        if (this.direction === Direction.East || this.direction === Direction.West) {
            halfWidth *= 1.1;
        } else {
            halfHeight *= 1.1;
        }

        this.bulletRect = new Rect(this.rect.getCenterX() - halfWidth, this.rect.getCenterY() - halfHeight, bulletWidth, bulletWidth);
        setCoords(this.bullet, this.rect.getCenterX(), this.rect.getCenterY(), halfWidth, halfHeight);
        setStrokeAndFill(this.bullet, "black", 5, `url(#${DefinitionsProvider.CSS_BULLET})`);
    }

    move(newX: number, newY: number): void {
        this.setBounds(this.rect.move(newX, newY));
    }

    animate(): void {}

    destroy() {
        
        if (!this.destroyed) {
            this.destroyed = true;
            this.parent.removeChild(this.bullet);
        }
    }

    isDestroyed(): boolean {
        return this.destroyed;
    }

    moveBy(amount: number) {
        switch (this.direction) {
            case Direction.North:
                this.move(this.rect.getX(), this.rect.getY() - amount);
                break;
            case Direction.South:
                this.move(this.rect.getX(), this.rect.getY() + amount);
                break;
            case Direction.East:
                this.move(this.rect.getX() + amount, this.rect.getY());
                break;
            case Direction.West:
                this.move(this.rect.getX() - amount, this.rect.getY());
                break;
        }
    }

    getBulletRect() {
        return this.bulletRect;
    } 
}