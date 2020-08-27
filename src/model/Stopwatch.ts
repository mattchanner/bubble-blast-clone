export default class Stopwatch {

    private startTime: Date | null = null;

    private endTime: Date | null = null;

    start() {
        this.startTime = new Date();
    }

    elapsed() {
        const now = new Date();
        const diff = now.getTime() - this.startTime!.getTime();

        return new Timespan(diff);
    }    
}

export class Timespan {

    public days: number;

    public hours: number;

    public minutes: number;

    public seconds: number;

    constructor(timespanMs: number) {
        this.days = Math.floor(timespanMs / (1000 * 60 * 60 * 24));
        timespanMs -= this.days * (1000 * 60 * 60 * 24);

        this.hours = Math.floor(timespanMs / (1000 * 60 * 60));
        timespanMs -= this.hours * (1000 * 60 * 60);

        this.minutes = Math.floor(timespanMs / (1000 * 60));
        timespanMs -= this.minutes * (1000 * 60);
        
        this.seconds = Math.floor(timespanMs / (1000));
        timespanMs -= this.seconds * (1000);
    }    

    toString() {

        let builder = "";

        if (this.days > 0) {
            builder = `${this.days} days `;
        }

        if (this.hours > 0) {
            builder += `${this.hours} hours `;
        }

        builder += `${this.seconds} seconds`;

        return builder;
    }
}