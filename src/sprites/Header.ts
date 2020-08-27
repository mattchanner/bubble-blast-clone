import GameStats from "../model/GameStats";
import Rect from "../model/Rect";
import { setStrokeAndFill } from "./SVGHelper";

export default class Header {

    private group: SVGGElement;

    private header: SVGRectElement;

    private clickCounter: SVGTextElement;

    private bounds: Rect = Rect.EMPTY;

    constructor(private parent: SVGElement, private gameStats: GameStats) {
        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.header = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.clickCounter = document.createElementNS("http://www.w3.org/2000/svg", "text");

        this.parent.appendChild(this.group);
        this.group.appendChild(this.header);
        this.group.appendChild(this.clickCounter);
    }

    setBounds(bounds: Rect) {
        this.bounds = bounds;
        this.header.x.baseVal.value = bounds.getX();
        this.header.y.baseVal.value = bounds.getY();
        this.header.rx.baseVal.value = 15;
        this.header.width.baseVal.value = bounds.getWidth();
        this.header.height.baseVal.value = bounds.getHeight();
        this.clickCounter.setAttribute("x", String(bounds.getCenterX()));
        this.clickCounter.setAttribute("y", String(bounds.getCenterY()));
        this.clickCounter.setAttribute("dominant-baseline", "middle");
        this.clickCounter.setAttribute("text-anchor", "middle");
        this.clickCounter.style.fontSize = "25px";
        this.clickCounter.style.fontWeight = "400";
                
        setStrokeAndFill(this.header, "#222", 0, "rgba(255, 255, 255, 0.54)");
        setStrokeAndFill(this.clickCounter, "rgb(131, 117, 149)", 1, "rgb(69, 12, 108)");
    }

    refresh() {
        this.clickCounter.textContent = `TOUCHES: ${this.gameStats.clicks}, COMBOS: ${this.gameStats.combos}`;
    }

    getBounds() {
        return this.bounds;
    }
    destroy() {
        this.parent.removeChild(this.group);
    }
}