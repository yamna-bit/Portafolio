// ==========================
// VARIABLES PRINCIPALES
// ==========================

// letras individuales (Y A M N A)
let letters = [];

// posiciones correctas (sombras / guías)
let slots = [];

// corazones de fondo
let hearts = [];

// partículas de destello al encajar
let bursts = [];

// letra que se está arrastrando
let dragging = null;

// estado: todas las letras ya encajadas
let allLocked = false;


// ==========================
// SETUP
// ==========================
function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  textAlign(CENTER, CENTER);

  let word = "YAMNA";

  // tipografías (referencia visual)
  fontBold = 'Arial Black';
  fontLight = 'Arial';

  // colores de cada letra
  let colors = [
    color(255, 140, 0),
    color(255, 80, 120),
    color(255, 180, 0),
    color(255, 140, 0),
    color(255, 80, 120)
  ];

  // espaciado entre letras
  let gap = 125;

  // centro de la palabra
  let startX = width / 2 - (word.length - 1) * gap / 2;

  let y = height / 2 - 40;

  // crear letras y slots
  for (let i = 0; i < word.length; i++) {

    let x = startX + i * gap;

    // slots (guías)
    slots.push({
      char: word[i],
      x: x,
      y: y
    });

    // posición inicial aleatoria
    let pos = getRandomPosition();

    // letras
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

  // corazones de fondo
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
// POSICIÓN ALEATORIA
// ==========================
function getRandomPosition() {
  let x, y, safe = false;

  while (!safe) {
    x = random(width);
    y = random(height);

    let d = dist(x, y, width / 2, height / 2);

    if (d > 220) {
      safe = true;

      for (let l of letters) {
        if (dist(x, y, l.x, l.y) < 120) {
          safe = false;
        }
      }
    }
  }

  return { x, y };
}


// ==========================
// DRAW LOOP
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
// SLOTS (GUÍAS)
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

    // drag
    if (dragging === l) {
      l.x = mouseX;
      l.y = mouseY;
    }

    // animación final
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
// BURSTS
// ==========================
function drawBursts() {
  textFont(fontLight);

  for (let i = bursts.length - 1; i >= 0; i--) {
    let b = bursts[i];

    for (let p of b.particles) {

      fill(255, 80, 120, p.alpha);
      textSize(p.size);
      text("<3", p.x, p.y);

      p.x += p.vx;
      p.y += p.vy;

      p.alpha -= 3;
    }

    if (b.particles[0].alpha <= 0) {
      bursts.splice(i, 1);
    }
  }
}


// ==========================
// INTERACCIÓN
// ==========================
function mousePressed() {

  if (allLocked) return;

  for (let l of letters) {
    if (dist(mouseX, mouseY, l.x, l.y) < 60 && !l.locked) {
      dragging = l;
      break;
    }
  }
}

function mouseReleased() {

  if (dragging && !allLocked) {

    for (let s of slots) {

      if (dragging.char === s.char) {

        let d = dist(dragging.x, dragging.y, s.x, s.y);

        if (d < 80) {
          dragging.x = s.x;
          dragging.y = s.y;
          dragging.locked = true;

          createBurst(s.x, s.y);
        }
      }
    }
  }

  dragging = null;
}


// ==========================
// BURST CREATION
// ==========================
function createBurst(x, y) {
  let particles = [];

  for (let i = 0; i < 12; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-2.5, 2.5),
      vy: random(-2.5, 2.5),
      alpha: 255,
      size: random(10, 18)
    });
  }

  bursts.push({ particles });
}


// ==========================
// CHECK FINAL
// ==========================
function checkAllLocked() {
  allLocked = letters.every(l => l.locked);
}


// ==========================
// INFO TEXTO
// ==========================
function drawInfo() {

  textFont(fontLight);

  fill(255, 180, 0);
  textSize(26);
  text("C A R R I Ó N", width / 2, height / 2 + 50);

  fill(255, 140, 0);
  textSize(13);
  text("Portafolio", width / 2, height / 2 + 80);
  text("2026", width / 2, height / 2 + 100);
}


// ==========================
// CURSOR
// ==========================
function drawCursor() {
  noStroke();
  fill(255, 80, 120);
  ellipse(mouseX, mouseY, 10, 10);
}

function openAbout() {
  alert("ABOUT: aquí puedes poner tu bio o abrir una sección");
}

function openProjects() {
  alert("PROJECTS: aquí van tus trabajos");
}
