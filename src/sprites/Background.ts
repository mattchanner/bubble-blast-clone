import Sprite from "./Sprite";
import Rect from "../model/Rect";

export default class Background implements Sprite {

    private backgroundEl: SVGRectElement;

    private rect: Rect;

    constructor(private parentElement: SVGSVGElement) {
        this.backgroundEl = document!.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.backgroundEl.id = "background";
        
        this.backgroundEl.style.strokeWidth = "4px";
        this.backgroundEl.style.stroke = "#441E1D";
        this.backgroundEl.style.fill = "#926C69";

        this.parentElement.appendChild(this.backgroundEl);

        this.rect = Rect.EMPTY;
    }

    getRect(): Rect {
        return this.rect;
    }
    
    setBounds(rect: Rect): void {
        this.rect = rect;

        this.backgroundEl.x.baseVal.value = rect.getX();
        this.backgroundEl.y.baseVal.value = rect.getY();
        this.backgroundEl.width.baseVal.value = rect.getWidth();
        this.backgroundEl.height.baseVal.value = rect.getHeight();
    }

    move(newX: number, newY: number): void {
        this.setBounds(this.rect.move(newX, newY));
    }
    
    animate(): void {}

    isDestroyed = () => false;
}