import Rect from '../model/Rect';

export default interface Sprite {
    
    getRect(): Rect;

    setBounds(rect: Rect) : void;

    move(newX: number, newY: number): void;

    animate(): void;

    isDestroyed(): boolean;
}