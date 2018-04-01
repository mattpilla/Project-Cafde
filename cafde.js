/* globals (nasty, but who cares) */
var mode; // string to track game "mode" (title screen, gameplay, game over)
var images = {}; // object containing all game images
var music = {}; // object containing all game music
var bgColor; // background color during gameplay
var cafde = {width: 200, height: 200}; // object containing properties on cafde the hedgehog
var cup = {width: 120, height: 120}; // object containing properties on cafde's mug
var groundY = 400; // y-coordinate of the floor

function preload() {
    /* load images and music */
    images.start = loadImage('images/start.png');
    images.cafde = loadImage('images/cafde.png');
    images.cup = loadImage('images/cafdeMug.PNG');
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

        /* draw cafde and have him follow his mug */
        image(images.cafde, cafde.x, cafde.y, cafde.width, cafde.height);
        if (cup.x < cafde.x) {
            cafde.x--;
        } else if (cup.x + cup.width > cafde.x + cafde.width) {
            cafde.x++;
        }
        if (cup.y < cafde.y) {
            cafde.y--;
        } else if (cup.y + cup.height > cafde.y + cafde.height) {
            cafde.y++;
        }

        /* draw the table */
        fill(137, 81, 14);
        rect(0, groundY, 640, 80);
        fill(100, 64, 18);
        rect(0, 320, 640, 80);

        /* draw and move the mug */
        image(images.cup, cup.x, cup.y, cup.width, cup.height);
        if (cup.left && cup.x > 0) {
            cup.x -= 5;
        }
        if (cup.right && cup.x <= width - cup.width) {
            cup.x += 5;
        }
        if (cup.jump) {
            cup.y > 5 ? cup.y -= 5 : cup.y = 0;
        } else if (cup.y + cup.height < groundY) {
            cup.y += 5;
        }
    }
}

function reset() {
    /* set all initial conditions */
    mode = 'start';
    music.title.loop();
    bgColor = randColor();
    cafde.x = 440;
    cafde.y = 0;
    cup.x = width/2;
    cup.y = groundY - cup.height;
    cup.jump = false;
    cup.left = false;
    cup.right = false;
}

function keyPressed() {
    if (key === ' ') {
        cup.jump = true;
    }
    if (keyCode === LEFT_ARROW) {
        cup.left = true;
    }
    if (keyCode === RIGHT_ARROW) {
        cup.right = true;
    }
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

    if (key === ' ') {
        cup.jump = false;
    }
    if (keyCode === LEFT_ARROW) {
        cup.left = false;
    }
    if (keyCode === RIGHT_ARROW) {
        cup.right = false;
    }
}

/* returns random 6 character hex color */
function randColor() {
    return '#' + random().toString(16).substr(2, 6);
}
