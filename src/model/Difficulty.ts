export class BubbleTypeRange {
    constructor(public lower: number, public upper: number){}

    inRange = (num: number) => num >= this.lower && num < this.upper;
}

export default class Difficulty {
    
    constructor(
        public sparsity: number,
        public redRange: BubbleTypeRange,
        public greenRange: BubbleTypeRange,
        public yellowRange: BubbleTypeRange,
        public blueRange: BubbleTypeRange) {}
}