import { DifficultyLevel } from "./DifficultyLevel";
import Stopwatch from "./Stopwatch";

export default class GameStats {

    public clicks = 0;

    public combos = 0;

    public stopwatch: Stopwatch;
    
    constructor(public level: DifficultyLevel) {
        this.stopwatch = new Stopwatch();
    }

    public click() {
        this.clicks++;
    }

    public combo() {
        this.combos++;
    }

    public start() {
        this.stopwatch.start();
    }

    public elapsed() {
        return this.stopwatch.elapsed();
    }
}