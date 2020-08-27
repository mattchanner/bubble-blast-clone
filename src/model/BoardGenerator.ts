import Difficulty from "./Difficulty";
import { Board } from "./Board";
import { BubbleType } from "./BubbleType";

export class BoardGenerator {
    public generate(difficulty: Difficulty): Board {

        const numRows = 8;
        const numCols = 5;
        
        const board = new Board(numCols, numRows);

        const sparsity = difficulty.sparsity;

        for (let x = 0; x < numCols; x++) {
        
            for (let y = 0; y < numRows; y++) {

                if (Math.random() > sparsity) {
                    continue;
                }

                const type = this.randomBubbleType(difficulty);
                board.set(x, y, type);                
            }
        }

        return board;
    }

    private randomBubbleType(difficulty: Difficulty) : BubbleType {
        const rand = Math.random();

        let settings = difficulty;
       
        if (settings.redRange.inRange(rand)) {
            return BubbleType.Red;
        }

        if (settings.yellowRange.inRange(rand)) {
            return BubbleType.Yellow;
        }

        if (settings.greenRange.inRange(rand)) {
            return BubbleType.Green;
        }

        if (settings.blueRange.inRange(rand)) {
            return BubbleType.Blue;
        }

        return BubbleType.Red;
    }
}