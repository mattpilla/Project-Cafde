/* globals (nasty, but who cares) */
var mode; // string to track game "mode" (title screen, gameplay, game over)
var images = {}; // object containing all game images
var music = {}; // object containing all game music
var bgColor; // background color during gameplay
var cafde = {width: 200, height: 200}; // object containing properties on cafde the hedgehog
var cup = {width: 120, height: 120}; // object containing properties on cafde's mug
var cubes = []; // array of objects containing properties on sugar cubes
var groundY = 400; // y-coordinate of the floor
var timer = new Timer(); // game timer

function preload() {
    /* load images and music */
    images.start = loadImage('images/start.png');
    images.end = loadImage('images/end.png');
    images.cafde = loadImage('images/cafde.png');
    images.cup = loadImage('images/cafdeMug.PNG');
    images.hearttrue = loadImage('images/hearttrue.png');
    images.heartfalse = loadImage('images/heartfalse.png');
    images.sugar = loadImage('images/sugar.png');
    music.title = loadSound('music/ponponpon.mp3');
    music.game = loadSound('music/coffee.mp3');
}

function setup() {
    createCanvas(640, 480);
    // this song is loud AF, so courteously lower the volume (lol)
    music.game.setVolume(0.3);
    stroke(0);
    textSize(20);
    textFont('monospace');
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
        if (cup.invincible) {
            tint('#f77');
        }
        image(images.cup, cup.x, cup.y, cup.width, cup.height);
        noTint();
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

        /* display health */
        for (let i = 0; i < 10; i++) {
            image(images['heart' + (i < cup.health)], 10 + 25 * i, 10);
        }

        /* draw and move sugar cubes */
        for (let i = 0; i < cubes.length; i++) {
            let cube = cubes[i];
            image(images.sugar, cube.x, cube.y);
            cube.x += floor(random(6 * i + 6)) * cube.xDir;
            cube.y += floor(random(6 * i + 6)) * cube.yDir;
            if (cube.x > width - cube.width) {
                cube.x = width - cube.width;
                cube.xDir = -cube.xDir;
            } else if (cube.x < 0) {
                cube.x = 0;
                cube.xDir = -cube.xDir;
            }
            if (cube.y > height - cube.width) {
                cube.y = height - cube.width;
                cube.yDir = -cube.yDir;
            } else if (cube.y < 0) {
                cube.y = 0;
                cube.yDir = -cube.yDir;
            }

            /* Check if sugar hits the mug */
            if (cube.x > cup.x && cube.x < cup.x + cup.width && cube.y > cup.y && cube.y < cup.y + cup.height) {
                if (!cup.invincible) {
                    cup.invincible = true;
                    setTimeout(() => cup.invincible = false, 2000);
                    cup.health--;
                }
            }
        }

        /* end the game if you're dead */
        if (cup.health <= 0) {
            timer.pause();
            mode = 'end';
        }
    } else if (mode === 'end') { // game over
        image(images.end, 0, 0);
    }

    /* update timer */
    strokeWeight(3);
    if (timer.stopped) {
        fill('#fff');
    } else if (timer.paused) {
        fill('#f77');
    } else {
        fill('#7f7');
    }
    text(timer.readTime(), 20, 450);
    strokeWeight(1);
}

function reset() {
    /* set all initial conditions */
    mode = 'start';
    timer.reset();
    music.title.loop();
    bgColor = randColor();
    cafde.x = 440;
    cafde.y = 0;
    cup.x = width / 2;
    cup.y = groundY - cup.height;
    cup.jump = false;
    cup.left = false;
    cup.right = false;
    cup.health = 10;
    cup.invincible = false;
    for (let i = 0; i < 3; i++) {
        cubes[i] = {
            x: 0,
            y: floor(random(height - 40)),
            xDir: 1,
            yDir: 1,
            width: 40
        };
    }
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
            timer.start();
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
