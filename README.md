# Cafde's Quest for Satisfaction
Re-creation of [this game](https://kaztalek.com/games/cafde) I made in college, this time for the web.\
The original game was made in [Processing (v2)](https://processing.org/), and I'm rebuilding it in [p5.js](https://p5js.org/). The beauty of this being that p5.js is basically a re-creation of Processing for the web.

## Play
Playable in the browser, I've hosted it here: https://kaztalek.com/cafde/ \
Do you use Internet Explorer? Fuck you, you'll need a different browser to play this.
### Premise
Play as Cafde, the IRL loose cannon who loves coffee, but doesn't fuck with sugar cubes. Move his coffee mug around (telekinetically) to avoid the sugar cubes for as long as possible.
### Controls
- C - start the game, and also reset the game (lol)
- Left and Right Arrow Keys - move the mug left and right
- Spacebar - move the mug up

## Run locally
Not sure who the hell you are, but sure, you can do this.

I didn't include the music in this repo for copyright reasons, but you'll need to put `coffee.ogg`, `failure.ogg`, `newrecord.ogg`, `ponponpon.ogg`, and `sayonara.ogg` in the `app/assets/sound` folder. So yea, don't bother.

You need [node](https://nodejs.org/en/) to run this.\
Run `npm install` in the root directory for the rest of the dependencies.\
For developing, run `npm start` to run at http://localhost:3333, complete with hot reloading.\
For production, run `npm build` to build to the `public` folder.
