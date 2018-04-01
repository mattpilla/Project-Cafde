class Timer {
    constructor() {
        this.reset();
    }

    reset() {
        this.paused = true; // is timer paused?
        this.stopped = true; // is timer stopped?
        this.elapsed = 0; // time in milliseconds the timer has ran for
    }

    start() {
        this.stopped = false;
        this.paused = false;
        this.startTime = millis();
    }

    pause() {
        this.paused = true;
        this.elapsed += millis() - this.startTime;
        this.endTime = millis();
    }

    /* return human readable time */
    readTime() {
        let time = this.elapsed;
        if (!this.paused) {
            time += millis() - this.startTime;
        }
        let hours = '' + floor(time / 3600000);
        let m = floor(time / 60000) % 60;
        let minutes = (m < 10 ? '0' : '') + m;
        let s = floor(time / 1000) % 60;
        let seconds = (s < 10 ? '0' : '') + s;
        return `${hours}:${minutes}:${seconds}`;
    }
}
