const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Chargement de l'image (Sprite Sheet officielle)
const sprite = new Image();
sprite.src = 'https://raw.githubusercontent.com/wayou/t-rex-runner/master/assets/default_100_percent/100-offline-sprite.png';

let gameSpeed = 6;
let isGameOver = false;
let score = 0;
let frame = 0;

// Configuration du Dino
let dino = {
    x: 50, y: 150, width: 44, height: 47,
    dy: 0, jumpForce: 12, gravity: 0.6,
    grounded: false,
    status: 'running', // running, jumping, crashed
    animFrame: 0
};

let obstacles = [];
let groundX = 0;

// --- INPUTS ---
function handleInput() {
    if (isGameOver) { resetGame(); }
    else if (dino.grounded) {
        dino.dy = -dino.jumpForce;
        dino.grounded = false;
    }
}
window.addEventListener('keydown', (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') handleInput(); });
window.addEventListener('touchstart', handleInput);

function resetGame() {
    score = 0; gameSpeed = 6; obstacles = []; isGameOver = false;
    dino.y = 150; dino.dy = 0;
    requestAnimationFrame(update);
}

function spawnObstacle() {
    // Choisit au hasard entre un petit ou un grand cactus sur la sprite sheet
    let type = Math.random() > 0.5 ? {w: 25, h: 50, sx: 446} : {w: 50, h: 50, sx: 652};
    obstacles.push({ x: canvas.width, y: 150, ...type });
}

function update() {
    if (isGameOver) return;
    frame++;

    // 1. Physique Dino
    dino.dy += dino.gravity;
    dino.y += dino.dy;
    if (dino.y > 150) { dino.y = 150; dino.dy = 0; dino.grounded = true; }

    // 2. Animation Dino (change de patte toutes les 10 frames)
    if (frame % 10 === 0) dino.animFrame = dino.animFrame === 0 ? 1 : 0;

    // 3. Sol et Obstacles
    groundX -= gameSpeed;
    if (groundX <= -600) groundX = 0;

    if (frame % 100 === 0) spawnObstacle();

    obstacles.forEach((obs, i) => {
        obs.x -= gameSpeed;
        
        // Collision
        if (dino.x < obs.x + obs.w - 5 && dino.x + dino.width - 5 > obs.x &&
            dino.y < obs.y + obs.h - 5 && dino.y + dino.height - 5 > obs.y) {
            isGameOver = true;
        }
        if (obs.x + obs.w < 0) { obstacles.splice(i, 1); score++; gameSpeed += 0.1; }
    });

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le Sol (sx: 2, sy: 54 sur la sprite sheet)
    ctx.drawImage(sprite, 2, 54, 1200, 12, groundX, 185, 1200, 12);
    ctx.drawImage(sprite, 2, 54, 1200, 12, groundX + 1200, 185, 1200, 12);

    // Dessiner le Dino
    let dinoSX = 1338; // Position du Dino statique
    if (isGameOver) dinoSX = 1514;
    else if (!dino.grounded) dinoSX = 1338;
    else dinoSX = 1514 + (dino.animFrame * 88); // Alterne entre les deux frames de course

    ctx.drawImage(sprite, dinoSX, 2, 88, 94, dino.x, dino.y, dino.width, dino.height);

    // Dessiner Obstacles (Cactus)
    obstacles.forEach(obs => {
        ctx.drawImage(sprite, obs.sx, 2, obs.w*2, obs.h*2, obs.x, obs.y, obs.w, obs.h);
    });

    // Score
    ctx.fillStyle = '#535353';
    ctx.font = '16px "Press Start 2P", Courier';
    ctx.fillText(score.toString().padStart(5, '0'), 530, 30);

    if (isGameOver) {
        // Message Game Over (image sx: 954, sy: 29)
        ctx.drawImage(sprite, 954, 29, 381, 21, 150, 80, 300, 18);
    }
}

// Attendre que l'image soit chargée avant de démarrer
sprite.onload = () => { update(); };
