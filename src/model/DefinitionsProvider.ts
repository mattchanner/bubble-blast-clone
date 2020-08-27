export default class DefinitionsProvider {

    public static CSS_BODY_YELLOW = "body_grad_yellow";
    public static CSS_BODY_RED = "body_grad_red";
    public static CSS_BODY_GREEN = "body_grad_green";
    public static CSS_BODY_BLUE = "body_grad_blue";

    public static CSS_BULLET = "bullet";

    private defsEl: SVGDefsElement;

    constructor(doc: Document, svg: SVGSVGElement) {
        this.defsEl = doc.createElementNS("http://www.w3.org/2000/svg", "defs");
        svg.appendChild(this.defsEl);

        this.createRadialGradient(this.makeGradient(doc, DefinitionsProvider.CSS_BODY_YELLOW, "#F2F75D", "#CACF00"));
        this.createRadialGradient(this.makeGradient(doc, DefinitionsProvider.CSS_BODY_RED, "#E88792", "#D50100"));
        this.createRadialGradient(this.makeGradient(doc, DefinitionsProvider.CSS_BODY_GREEN, "#94FB4A", "#47CE0F"));
        this.createRadialGradient(this.makeGradient(doc, DefinitionsProvider.CSS_BODY_BLUE, "#6B9CE9", "#0348C9"));

        this.createRadialGradient(this.makeGradient(doc, DefinitionsProvider.CSS_BULLET, "rgb(204, 149, 230)", "rgb(238, 216, 249)"));
    }

    createRadialGradient(gradient: SVGRadialGradientElement) {
        this.defsEl.appendChild(gradient);
    }

    makeGradient(doc: Document, id: string, startColour: string, stopColour: string) {
        const radial = doc.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
        radial.id = id;
        radial.cx.baseVal.valueAsString = "0%";
        radial.cy.baseVal.valueAsString = "0%";

        radial.fx.baseVal.valueAsString = "30%";
        radial.fy.baseVal.valueAsString = "30%";

        radial.r.baseVal.valueAsString = "100%";

        const start = doc.createElementNS("http://www.w3.org/2000/svg", "stop");
        radial.appendChild(start);        
        start.offset.baseVal = 0;
        start.style.stopColor = startColour;

        const stop = doc.createElementNS("http://www.w3.org/2000/svg", "stop");
        radial.appendChild(stop);        
        stop.offset.baseVal = 100;
        stop.style.stopColor = stopColour;

        return radial;
    }
}