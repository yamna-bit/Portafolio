// ==========================
// VARIABLES
// ==========================

let letters = [];
let slots = [];
let hearts = [];
let bursts = [];

let dragging = null;
let allLocked = false;

let fontBold;
let fontLight;

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
    textSize(120);
    text(s.char, s.x, s.y);
  }
}

// ==========================
// LETRAS (DRAG + ANIMACIÓN FINAL)
// ==========================
function drawLetters() {
  textFont(fontBold);

  for (let l of letters) {

    if (dragging === l) {
      l.x = mouseX;
      l.y = mouseY;
    }

    if (allLocked) {
      let targetX = l.baseX + sin(frameCount * 0.02 + l.offset) * 40;
      let targetY = l.baseY + cos(frameCount * 0.02 + l.offset) * 40;

      l.x = lerp(l.x, targetX, 0.08);
      l.y = lerp(l.y, targetY, 0.08);
    }

    fill(l.col);
    textSize(120);
    text(l.char, l.x, l.y);
  }
}

// ==========================
// INTERACCIÓN DRAG
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
// INFO CENTRAL
// ==========================
function drawInfo() {
  fill(255, 140, 0);
  textSize(26);
  text("CARRIÓN", width/2, height/2 + 60);

  fill(255, 80, 120);
  textSize(14);
  text("PORTAFOLIO 2026", width/2, height/2 + 90);
}

// ==========================
// CURSOR
// ==========================
function drawCursor() {
  fill(255, 45, 120);
  noStroke();
  ellipse(mouseX, mouseY, 10, 10);
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
