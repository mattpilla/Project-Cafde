new p5(sketch => {
    const Timer = require('./timer');

    let mode; // string to track game "mode" (title screen, gameplay, game over)
    let images = {}; // object containing all game images
    let music = {}; // object containing all game music
    let sfx = {}; // object containing all game sound effects
    let bgColor; // background color during gameplay
    let cafde = {width: 200, height: 200}; // object containing properties on cafde the hedgehog
    let cup = {width: 120, height: 120}; // object containing properties on cafde's mug
    let cubes = []; // array of objects containing properties on sugar cubes
    let groundY = 400; // y-coordinate of the floor
    let timer = new Timer(sketch.millis); // game timer
    let pb; // personal best time

    sketch.preload = () => {
        /* load images and music */
        images.start = sketch.loadImage('img/start.png');
        images.end = sketch.loadImage('img/end.png');
        images.cafde = sketch.loadImage('img/cafde.png');
        images.cup = sketch.loadImage('img/cafdeMug.PNG');
        images.hearttrue = sketch.loadImage('img/hearttrue.png');
        images.heartfalse = sketch.loadImage('img/heartfalse.png');
        images.sugar = sketch.loadImage('img/sugar.png');
        music.title = sketch.loadSound('sound/ponponpon.ogg');
        music.game = sketch.loadSound('sound/coffee.ogg');
        music.end = sketch.loadSound('sound/sayonara.ogg');
        sfx.failure = sketch.loadSound('sound/failure.ogg');
        sfx.newrecord = sketch.loadSound('sound/newrecord.ogg');
    }

    sketch.setup = () => {
        sketch.createCanvas(640, 480);
        sketch.stroke(0);
        sketch.textSize(20);
        sketch.textFont('monospace');

        /* these songs are loud AF, so courteously lower the volume (lol) */
        music.game.setVolume(0.3);
        music.end.setVolume(0.5);

        reset();
    }

    sketch.draw = () => {
        if (mode === 'start') { // title screen
            sketch.image(images.start, 0, 0);
        } else if (mode === 'play') { // gameplay
            /* set background color, and change it every 30 frames */
            sketch.background(bgColor);
            if (sketch.frameCount % 30 === 0) {
                bgColor = randColor();
            }

            /* draw cafde and have him follow his mug */
            sketch.image(images.cafde, cafde.x, cafde.y, cafde.width, cafde.height);
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
            sketch.fill(137, 81, 14);
            sketch.rect(0, groundY, 640, 80);
            sketch.fill(100, 64, 18);
            sketch.rect(0, 320, 640, 80);

            /* draw and move the mug */
            if (cup.invincible) {
                sketch.tint('#f77');
            }
            sketch.image(images.cup, cup.x, cup.y, cup.width, cup.height);
            sketch.noTint();
            if (cup.left && cup.x > 0) {
                cup.x -= 5;
            }
            if (cup.right && cup.x <= sketch.width - cup.width) {
                cup.x += 5;
            }
            if (cup.jump) {
                cup.y > 5 ? cup.y -= 5 : cup.y = 0;
            } else if (cup.y + cup.height < groundY) {
                cup.y += 5;
            }

            /* display health */
            for (let i = 0; i < 10; i++) {
                sketch.image(images['heart' + (i < cup.health)], 10 + 25 * i, 10);
            }

            /* draw and move sugar cubes */
            for (let i = 0; i < cubes.length; i++) {
                let cube = cubes[i];
                sketch.image(images.sugar, cube.x, cube.y);
                cube.x += Math.floor(sketch.random(6 * i + 6)) * cube.xDir;
                cube.y += Math.floor(sketch.random(6 * i + 6)) * cube.yDir;
                if (cube.x > sketch.width - cube.width) {
                    cube.x = sketch.width - cube.width;
                    cube.xDir = -cube.xDir;
                } else if (cube.x < 0) {
                    cube.x = 0;
                    cube.xDir = -cube.xDir;
                }
                if (cube.y > sketch.height - cube.width) {
                    cube.y = sketch.height - cube.width;
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
                music.game.stop();

                /* Check for PB */
                let time = timer.getTime();
                if (time > pb) {
                    sfx.newrecord.play();
                    localStorage.setItem('pb', time);
                } else {
                    sfx.failure.play();
                }

                music.end.loop();
            }
        } else if (mode === 'end') { // game over
            sketch.image(images.end, 0, 0);
        }

        /* update timer */
        sketch.strokeWeight(3);
        if (mode === 'start') {
            /* show PB */
            sketch.fill('#fff');
            sketch.text('BEST TIME: ' + Timer.readTime(pb), 4, sketch.height - 4);
        } else {
            if (timer.paused) {
                sketch.fill('#f77');
            } else {
                sketch.fill('#7f7');
            }
            sketch.text(Timer.readTime(timer.getTime()), 4, sketch.height - 4);
        }
        sketch.strokeWeight(1);
    }

    sketch.keyPressed = () => {
        if (sketch.key === ' ') {
            cup.jump = true;
        }
        if (sketch.keyCode === sketch.LEFT_ARROW) {
            cup.left = true;
        }
        if (sketch.keyCode === sketch.RIGHT_ARROW) {
            cup.right = true;
        }
    }

    sketch.keyReleased = () => {
        /* "C" is used to both start the game and reset it. not sure why that was my choice, but I'm staying faithful to the original */
        if (sketch.key === 'C') {
            if (mode !== 'start') { // Reset the game
                music.game.stop();
                music.end.stop();
                reset();
            } else { // Start the game
                music.title.stop();
                mode = 'play';
                timer.start();
                music.game.loop();
            }
        }

        if (sketch.key === ' ') {
            cup.jump = false;
        }
        if (sketch.keyCode === sketch.LEFT_ARROW) {
            cup.left = false;
        }
        if (sketch.keyCode === sketch.RIGHT_ARROW) {
            cup.right = false;
        }
    }

    function reset() {
        /* set all initial conditions */
        mode = 'start';
        timer.reset();
        pb = localStorage.getItem('pb') || 0;
        music.title.loop();
        bgColor = randColor();
        cafde.x = 440;
        cafde.y = 0;
        cup.x = sketch.width / 2;
        cup.y = groundY - cup.height;
        cup.jump = false;
        cup.left = false;
        cup.right = false;
        cup.health = 10;
        cup.invincible = false;
        for (let i = 0; i < 3; i++) {
            cubes[i] = {
                x: 0,
                y: Math.floor(sketch.random(sketch.height - 40)),
                xDir: 1,
                yDir: 1,
                width: 40
            };
        }
    }

    /* returns random 6 character hex color */
    function randColor() {
        return `#${sketch.random().toString(16).substr(2, 6)}`;
    }
});
