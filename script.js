
// VARIABLES PRINCIPALES
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



// SETUP (se ejecuta una vez)
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // canvas full pantalla
  noCursor(); // ocultamos cursor original
  textAlign(CENTER, CENTER); // texto centrado
  function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

  let word = "YAMNA";

  // tipografías
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

  // espaciado horizontal entre letras
  let gap = 125;

  // punto inicial para centrar la palabra completa
  let startX = width/2 - (word.length - 1) * gap / 2;

  // crear letras + posiciones finales (slots)
  for (let i = 0; i < word.length; i++) {

    let x = startX + i * gap;
    let y = height * 0.55;

    // guardamos posición correcta (slot)
    slots.push({
      char: word[i],
      x: x,
      y: y
    });

    // posición inicial aleatoria (dispersa)
    let pos = getRandomPosition();

    // creamos letra
    letters.push({
      char: word[i],
      x: pos.x,
      y: pos.y,
      col: colors[i],
      locked: false, // aún no encajada

      // posición final
      baseX: x,
      baseY: y,

      // offset para animación orgánica
      offset: random(1000)
    });
  }

  // crear corazones de fondo
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



// FUNCIÓN PARA POSICIÓN ALEATORIA
// evita centro + evita que se encimen
function getRandomPosition() {
  let x, y, safe = false;

  while (!safe) {
    x = random(width);
    y = random(height);

    // evitar el centro
    let d = dist(x, y, width/2, height/2);

    if (d > 220) {
      safe = true;

      // evitar que las letras se superpongan
      for (let l of letters) {
        if (dist(x, y, l.x, l.y) < 120) {
          safe = false;
        }
      }
    }
  }

  return { x, y };
}


// DRAW (loop constante)

function draw() {
  background(255); // fondo blanco

  drawHearts();   // fondo animado
  drawSlots();    // sombras guía
  drawLetters();  // letras
  drawBursts();   // destellos
  drawInfo();     // texto inferior
  drawCursor();   // cursor personalizado

  checkAllLocked(); // revisar si todo está armado
}


// CORAZONES DE FONDO
function drawHearts() {
  textFont(fontLight);

  for (let h of hearts) {

    // movimiento vertical
    h.y -= h.speed;

    // leve movimiento lateral orgánico
    h.x += sin(frameCount * 0.01 + h.y) * h.drift;

    // si sale de pantalla, reaparece abajo
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

// SOMBRAS (solo al inicio)

function drawSlots() {
  if (allLocked) return; // desaparecen al completar

  textFont(fontBold);

  for (let s of slots) {
    fill(0, 15); // gris muy suave
    noStroke();
    textSize(120);
    text(s.char, s.x, s.y);
  }
}


// DIBUJO DE LETRAS

function drawLetters() {
  textFont(fontBold);

  for (let l of letters) {

    // si se está arrastrando
    if (dragging === l) {
      l.x = mouseX;
      l.y = mouseY;
    }

    // animación final (cuando todo está armado)
    if (allLocked) {

      // velocidad distinta por letra
      let speed = 0.02 + (l.offset % 0.02);

      // ruido orgánico
      let nX = noise(frameCount * speed, l.offset);
      let nY = noise(frameCount * speed + 500, l.offset);

      // amplitud del movimiento
      let chaos = 100;

      // capa extra de movimiento (ondas)
      let waveX = sin(frameCount * 0.03 + l.offset) * 30;
      let waveY = cos(frameCount * 0.025 + l.offset) * 30;

      // posición objetivo
      let targetX = l.baseX + map(nX, 0, 1, -chaos, chaos) + waveX;
      let targetY = l.baseY + map(nY, 0, 1, -chaos, chaos) + waveY;

      // interpolación suave
      l.x = lerp(l.x, targetX, 0.09);
      l.y = lerp(l.y, targetY, 0.09);
    }

    // dibujar letra
    fill(l.col);
    noStroke();
    textSize(120);
    text(l.char, l.x, l.y);
  }
}



// DESTELLOS DE CORAZONES

function drawBursts() {
  textFont(fontLight);

  for (let i = bursts.length - 1; i >= 0; i--) {
    let b = bursts[i];

    for (let p of b.particles) {
      fill(255, 80, 120, p.alpha);
      textSize(p.size);
      text("<3", p.x, p.y);

      // movimiento
      p.x += p.vx;
      p.y += p.vy;

      // desvanecer
      p.alpha -= 3;
    }

    // eliminar cuando desaparecen
    if (b.particles[0].alpha <= 0) {
      bursts.splice(i, 1);
    }
  }
}



// CLICK (inicia drag)

function mousePressed() {
  if (allLocked) return;

  for (let l of letters) {
    if (dist(mouseX, mouseY, l.x, l.y) < 60 && !l.locked) {
      dragging = l;
      break;
    }
  }
}



// SOLTAR (encaje)

function mouseReleased() {

  if (dragging && !allLocked) {

    for (let s of slots) {

      // solo encaja si es la letra correcta
      if (dragging.char === s.char) {

        let d = dist(dragging.x, dragging.y, s.x, s.y);

        if (d < 80) {
          dragging.x = s.x;
          dragging.y = s.y;
          dragging.locked = true;

          // crear destello
          createBurst(s.x, s.y);
        }
      }
    }
  }

  dragging = null;
}



// CREAR DESTELLO

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



// CHECK SI TODO ESTÁ COMPLETO

function checkAllLocked() {
  allLocked = letters.every(l => l.locked);
}


// TEXTO INFERIOR

function drawInfo() {
  textFont(fontLight);

  fill(255, 180, 0);
  textSize(26);
  text("C A R R I Ó N", width/2, height/2 + 50);

  fill(255, 140, 0);
  textSize(13);
  text("Portafolio", width/2, height/2 + 80);
  text("2026", width/2, height/2 + 100);
}



// CURSOR PERSONALIZADO

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
