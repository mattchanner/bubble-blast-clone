import Sprite from "./Sprite";
import Rect from "../model/Rect";
import { BubbleType, getSize, getCssName } from '../model/BubbleType';
import DefinitionsProvider from "../model/DefinitionsProvider";
import { setCoords, setStrokeAndFill } from "./SVGHelper";

export default class Bubble implements Sprite {

    private static GrowCeiling = 6;

    private boundingBox: Rect = Rect.EMPTY;

    private group : SVGGElement;

    private headElement: SVGEllipseElement;
    private leftEyeElement: SVGEllipseElement;
    private rightEyeElement: SVGEllipseElement;

    private leftPupilElement: SVGEllipseElement;
    private rightPupilElement: SVGEllipseElement;
    
    private blinkLeft: SVGEllipseElement;
    private blinkRight: SVGEllipseElement;

    private animateSequence = 0;
    private isGrowing = true;
    private bubbleType: BubbleType;
    private destroyed = false;
    private skipCount = 0;

    constructor(private parent: SVGSVGElement, definitionsProvider: DefinitionsProvider, initialType: BubbleType, seed: number) {
        this.bubbleType = initialType;

        this.group = document!.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.id = `bubble-${seed}`;

        this.headElement = document!.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        this.headElement.id = `head-${seed}`;
        this.headElement.style.cursor = "pointer";

        this.leftEyeElement = document!.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        this.leftEyeElement.id = `left-eye-${seed}`;

        this.rightEyeElement = document!.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        this.rightEyeElement.id = `right-eye-${seed}`;

        this.leftPupilElement = document!.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        this.leftPupilElement.id = `left-pupil-${seed}`;

        this.rightPupilElement = document!.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        this.rightPupilElement.id = `right-pupil-${seed}`;

        this.blinkLeft = document!.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        this.blinkLeft.id = `left-blink-${seed}`;

        this.blinkRight = document!.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        this.blinkRight.id = `right-blink-${seed}`;

        this.parent.appendChild(this.group);
        this.group.appendChild(this.headElement);
        this.group.appendChild(this.leftEyeElement);
        this.group.appendChild(this.rightEyeElement);
        this.group.appendChild(this.blinkLeft);
        this.group.appendChild(this.blinkRight);
        this.group.appendChild(this.rightPupilElement);
        this.group.appendChild(this.leftPupilElement);

        this.animateSequence = seed % Bubble.GrowCeiling;        
    }

    getType() {
        return this.bubbleType;
    }

    setType(newType: BubbleType) {
        this.bubbleType = newType;
        this.setBounds(this.boundingBox);
    }

    addClickHandler(handler: any) {
        this.headElement.addEventListener("click", handler);
    }

    getRect(): Rect {
        return this.boundingBox;
    }

    setBounds(rect: Rect): void {
        const bodyWidth = getSize(this.bubbleType) / 2;
        const bodyHeight = getSize(this.bubbleType) / 2;

        // Draw outer body
        setCoords(this.headElement, rect.getCenterX(), rect.getCenterY(), bodyWidth, bodyHeight);
        setStrokeAndFill(this.headElement, "black", 5, `url(#${getCssName(this.bubbleType)})`);

        const eyeWidth = bodyWidth * 0.3;
        const eyeHeight = bodyWidth * 0.3;

        setCoords(
            this.leftEyeElement, 
            rect.getCenterX() - (bodyWidth / 2),
            rect.getCenterY() - (bodyHeight / 1.2),
            eyeWidth,
            eyeHeight);

        setCoords(this.blinkLeft,
            rect.getCenterX() - (bodyWidth / 2),
            rect.getCenterY() - (bodyHeight / 1.2),
            eyeWidth,
            eyeHeight);

        setStrokeAndFill(this.blinkLeft, "#000", 3, `#fff`);

        setCoords(
            this.leftPupilElement,
            rect.getCenterX() - (bodyWidth / 2),
            rect.getCenterY() - (bodyHeight / 1.2),
            eyeWidth / 4,
            eyeHeight / 4);

        setStrokeAndFill(this.leftPupilElement, "#000", 3, "#000");

        setCoords(
            this.rightEyeElement, 
            rect.getCenterX() + (bodyWidth / 2),
            rect.getCenterY() - (bodyHeight / 1.2),
            eyeWidth,
            eyeHeight);

        setCoords(this.blinkRight,
            rect.getCenterX() + (bodyWidth / 2),
            rect.getCenterY() - (bodyHeight / 1.2),
            eyeWidth,
            eyeHeight);

        setCoords(
            this.rightPupilElement,
            rect.getCenterX() + (bodyWidth / 2),
            rect.getCenterY() - (bodyHeight / 1.2),
            eyeWidth / 4,
            eyeHeight / 4);

        setStrokeAndFill(this.rightPupilElement, "#000", 3, "#000");

        setStrokeAndFill(this.blinkRight, "#000", 3, `#fff`);

        this.boundingBox = rect;
    }

    move(newX: number, newY: number): void {
        this.setBounds(this.boundingBox.move(newX, newY));
    }

    animate(): void {
        this.skipCount++;
        if (this.skipCount < 6) {
            return;
        }

        this.skipCount = 0;
        this.animateSequence++;

        if (this.animateSequence === Bubble.GrowCeiling) {
            this.isGrowing = !this.isGrowing;
            this.animateSequence = 0;
        }

        this.growEl(this.headElement);
        this.moveEl(this.leftEyeElement);
        this.moveEl(this.leftPupilElement);
        this.moveEl(this.blinkLeft);

        this.moveEl(this.rightEyeElement);
        this.moveEl(this.rightPupilElement);
        this.moveEl(this.blinkRight);
    }

    destroy() {
        if (!this.destroyed) {
            this.destroyed = true;

            this.group.removeChild(this.headElement);
            this.group.removeChild(this.leftEyeElement);
            this.group.removeChild(this.rightEyeElement);
            this.group.removeChild(this.leftPupilElement);
            this.group.removeChild(this.rightPupilElement);
            this.group.removeChild(this.blinkLeft);
            this.group.removeChild(this.blinkRight);

            this.parent.removeChild(this.group);
        }
    }

    growEl(el: SVGEllipseElement) {
        let ry = el.ry.baseVal.value;
        if (this.isGrowing) {
            ry *= 1.02;
        } else {
            ry  = ry - (ry * 0.02);
        }

        el.ry.baseVal.value = ry;
    }

    moveEl(el: SVGEllipseElement) {
        let cy = el.cy.baseVal.value;

        if (this.isGrowing) {
            cy -= 1;
        } else {
            cy += 1;
        }

        el.cy.baseVal.value = cy;
    }

    isDestroyed(): boolean {
        return this.destroyed;
    }
}