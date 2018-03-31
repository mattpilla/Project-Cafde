/* globals (nasty, but who cares) */
var mode; // string to track game "mode" (title screen, gameplay, game over)
var images = {}; // object containing all game images
var music = {}; // object containing all game music
var bgColor; // background color during gameplay

function preload() {
    /* load images and music */
    images.start = loadImage('images/start.png');
    music.title = loadSound('music/ponponpon.mp3');
    music.game = loadSound('music/coffee.mp3');
}

function setup() {
    createCanvas(640, 480);
    // this song is loud AF, so courteously lower the volume (lol)
    music.game.setVolume(0.3);
    reset();
}

function draw() {
    if (mode === 'start') { // title screen
        image(images.start, 0, 0);
    } else if (mode === 'play') { // gameplay
        /* set background color, and change it every 30 frames */
        background(bgColor);
        if (frameCount % 30 === 0) {
            bgColor = randColor();
        }
    }
}

function reset() {
    mode = 'start';
    music.title.loop();
    bgColor = randColor();
}

function keyReleased() {
    /* "C" is used to both start the game and reset it. not sure why that was my choice, but I'm staying faithful to the original */
    if (key === 'C') {
        if (mode !== "start") { // Reset the game
            music.game.stop();
            reset();
        } else { // Start the game
            music.title.stop();
            mode = 'play';
            music.game.loop();
        }
    }
}

/* returns random 6 character hex color */
function randColor() {
    return '#' + random().toString(16).substr(2, 6);
}
