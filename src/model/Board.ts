import { BubbleType } from "./BubbleType";

export class Board {

    private matrix = new Array<Array<BubbleType | null>>();

    constructor(public cols: number, public rows: number) {
        for (let x = 0; x < cols; x++) {
            const col = new Array<BubbleType | null>();
            this.matrix.push(col);
            for (let y = 0; y < rows; y++) {
                col.push(null);
            }
        }
    }

    set(col: number, row: number, type: BubbleType) {
        this.matrix[col][row] = type;
    }

    get(col: number, row: number) {
        return this.matrix[col][row];
    }
}