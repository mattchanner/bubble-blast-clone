export function setStrokeAndFill(el: SVGElement, strokeColour: string, strokeWidth: number, fill: string) {
    el.style.stroke = strokeColour;
    el.style.strokeWidth = strokeWidth.toString();
    el.style.fill = fill;
}

export function setCoords(el: SVGEllipseElement, cx: number, cy: number, rx: number, ry: number) {
    el.cx.baseVal.value = cx;
    el.cy.baseVal.value = cy;
    el.rx.baseVal.value = rx;
    el.ry.baseVal.value = ry;
}