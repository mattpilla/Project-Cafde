class Timer {
    constructor(millis) {
        this.reset();
        this.millis = millis;
    }

    reset() {
        this.paused = true; // is timer paused?
        this.elapsed = 0; // time in milliseconds the timer has ran for
    }

    start() {
        this.paused = false;
        this.startTime = this.millis();
    }

    pause() {
        this.paused = true;
        this.elapsed += this.millis() - this.startTime;
        this.endTime = this.millis();
    }

    /* get current time in milliseconds */
    getTime() {
        let time = this.elapsed;
        if (!this.paused) {
            time += this.millis() - this.startTime;
        }
        return time;
    }

    /* return human readable time */
    static readTime(time) {
        let hours = '' + Math.floor(time / 3600000);
        let m = Math.floor(time / 60000) % 60;
        let minutes = (m < 10 ? '0' : '') + m;
        let s = Math.floor(time / 1000) % 60;
        let seconds = (s < 10 ? '0' : '') + s;
        return `${hours}:${minutes}:${seconds}`;
    }
}

module.exports = Timer;
