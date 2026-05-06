let letters = [];
let slots = [];
let hearts = [];
let dragging = null;
let allLocked = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  textAlign(CENTER, CENTER);
  textFont('Poppins');
  textStyle(BOLD);

  let word = "YAMNA";

  let gap = 120;
  let startX = width / 2 - (word.length - 1) * gap / 2;

  // 📱 FIX IMPORTANTE: más arriba en mobile
  let centerY = height * 0.45;

  for (let i = 0; i < word.length; i++) {

    let x = startX + i * gap;

    slots.push({
      char: word[i],
      x: x,
      y: centerY
    });

    letters.push({
      char: word[i],
      x: random(width),
      y: random(height),
      baseX: x,
      baseY: centerY,
      locked: false,
      col: color(255, 80, 120),
      offset: random(1000)
    });
  }

  for (let i = 0; i < 30; i++) {
    hearts.push({
      x: random(width),
      y: random(height),
      s: random(10, 16),
      speed: random(0.3, 0.7)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetLayout();
}

// 🔥 FIX CLAVE MOBILE: recalcular posiciones
function resetLayout() {
  let word = "YAMNA";
  let gap = 120;
  let startX = width / 2 - (word.length - 1) * gap / 2;
  let centerY = height * 0.45;

  for (let i = 0; i < letters.length; i++) {
    letters[i].baseX = startX + i * gap;
    letters[i].baseY = centerY;

    slots[i].x = startX + i * gap;
    slots[i].y = centerY;
  }
}

function draw() {
  background(255);

  drawHearts();
  drawSlots();
  drawLetters();
  drawCursor();
}

// corazones
function drawHearts() {
  textFont('Poppins');

  for (let h of hearts) {
    h.y -= h.speed;

    if (h.y < -20) {
      h.y = height + 20;
      h.x = random(width);
    }

    fill(255, 80, 120, 80);
    textSize(h.s);
    text("<3", h.x, h.y);
  }
}

// slots guía
function drawSlots() {
  textFont('Poppins');

  for (let s of slots) {
    fill(0, 20);
    textSize(100);
    text(s.char, s.x, s.y);
  }
}

// letras
function drawLetters() {
  textFont('Poppins');

  for (let l of letters) {

    if (dragging === l) {
      l.x = mouseX;
      l.y = mouseY;
    }

    fill(l.col);
    textSize(100);
    text(l.char, l.x, l.y);
  }
}

// cursor
function drawCursor() {
  fill(255, 80, 120);
  noStroke();
  ellipse(mouseX, mouseY, 8, 8);
}

// interacción
function mousePressed() {
  for (let l of letters) {
    if (dist(mouseX, mouseY, l.x, l.y) < 60) {
      dragging = l;
      break;
    }
  }
}

function mouseReleased() {
  if (dragging) {
    for (let s of slots) {
      if (dragging.char === s.char) {
        if (dist(dragging.x, dragging.y, s.x, s.y) < 80) {
          dragging.x = s.x;
          dragging.y = s.y;
          dragging.locked = true;
        }
      }
    }
  }

  dragging = null;
}

// botones
function openAbout() {
  alert("ABOUT");
}

function openProjects() {
  alert("PROJECTS");
}
