// ==========================
// VARIABLES
// ==========================

let fontBold;
let fontLight;

let letters = [];
let slots = [];
let hearts = [];
let bursts = [];

let dragging = null;
let allLocked = false;

// ==========================
// SETUP
// ==========================

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  textAlign(CENTER, CENTER);

  let word = "YAMNA";

  fontBold = 'Arial Black';
  fontLight = 'Arial';

  let colors = [
    color(255, 140, 0),
    color(255, 80, 120),
    color(255, 180, 0),
    color(255, 140, 0),
    color(255, 80, 120)
  ];

  let gap = 125;
  let startX = width / 2 - (word.length - 1) * gap / 2;
  let y = height / 2 - 40;

  for (let i = 0; i < word.length; i++) {

    let x = startX + i * gap;

    slots.push({
      char: word[i],
      x: x,
      y: y
    });

    let pos = getRandomPosition();

    letters.push({
      char: word[i],
      x: pos.x,
      y: pos.y,
      col: colors[i],
      locked: false,
      baseX: x,
      baseY: y,
      offset: random(1000)
    });
  }

  for (let i = 0; i < 40; i++) {
    hearts.push({
      x: random(width),
      y: random(height),
      size: random(10, 18),
      speed: random(0.2, 0.5),
      drift: random(-0.3, 0.3),
      alpha: random(20, 70)
    });
  }
}

// ==========================
// LOOP
// ==========================

function draw() {
  background(255);

  drawHearts();
  drawSlots();
  drawLetters();
  drawBursts();
  drawInfo();
  drawCursor();

  checkAllLocked();
}

// ==========================
// CORAZONES
// ==========================

function drawHearts() {
  textFont(fontLight);

  for (let h of hearts) {

    h.y -= h.speed;
    h.x += sin(frameCount * 0.01 + h.y) * h.drift;

    if (h.y < -20) {
      h.y = height + 20;
      h.x = random(width);
    }

    fill(255, 80, 120, h.alpha);
    noStroke();
    textSize(h.size);
    text("<3", h.x, h.y);
  }
}

// ==========================
// SLOTS
// ==========================

function drawSlots() {
  if (allLocked) return;

  textFont(fontBold);

  for (let s of slots) {
    fill(0, 15);
    noStroke();
    textSize(120);
    text(s.char, s.x, s.y);
  }
}

// ==========================
// LETRAS
// ==========================

function drawLetters() {
  textFont(fontBold);

  for (let l of letters) {

    if (dragging === l) {
      l.x = mouseX;
      l.y = mouseY;
    }

    if (allLocked) {

      let speed = 0.02 + (l.offset % 0.02);

      let nX = noise(frameCount * speed, l.offset);
      let nY = noise(frameCount * speed + 500, l.offset);

      let chaos = 100;

      let waveX = sin(frameCount * 0.03 + l.offset) * 30;
      let waveY = cos(frameCount * 0.025 + l.offset) * 30;

      let targetX = l.baseX + map(nX, 0, 1, -chaos, chaos) + waveX;
      let targetY = l.baseY + map(nY, 0, 1, -chaos, chaos) + waveY;

      l.x = lerp(l.x, targetX, 0.09);
      l.y = lerp(l.y, targetY, 0.09);
    }

    fill(l.col);
    noStroke();
    textSize(120);
    text(l.char, l.x, l.y);
  }
}

// ==========================
// INPUT
// ==========================

function mousePressed() {

  if (allLocked) return;

  for (let l of letters) {
    if (dist(mouseX, mouseY, l.x, l.y) < 60) {
      dragging = l;
      break;
    }
  }
}

function mouseReleased() {
  dragging = null;
}

// ==========================
// UTIL
// ==========================

function getRandomPosition() {
  return {
    x: random(width),
    y: random(height)
  };
}

function checkAllLocked() {
  allLocked = letters.every(l => l.locked);
}

// ==========================
// CURSOR
// ==========================

function drawCursor() {
  fill(255, 80, 120);
  noStroke();
  ellipse(mouseX, mouseY, 10, 10);
}
