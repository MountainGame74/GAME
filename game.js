const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- CHARGEMENT DE L'IMAGE ---
const sprite = new Image();
sprite.crossOrigin = "Anonymous"; 
sprite.src = 'https://raw.githubusercontent.com/wayou/t-rex-runner/master/assets/default_100_percent/100-offline-sprite.png';

// --- VARIABLES DU JEU ---
let gameSpeed = 6;
let isGameOver = false;
let score = 0;
let frame = 0;
let groundX = 0;

let dino = {
    x: 50,
    y: 150,
    width: 44,
    height: 47,
    dy: 0,
    jumpForce: 12,
    gravity: 0.6,
    grounded: false,
    animFrame: 0
};

let obstacles = [];

// --- CONTRÔLES ---
function handleInput() {
    if (isGameOver) {
        resetGame();
    } else if (dino.grounded) {
        dino.dy = -dino.jumpForce;
        dino.grounded = false;
    }
}

window.addEventListener('keydown', (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') handleInput(); });
window.addEventListener('touchstart', (e) => { handleInput(); e.preventDefault(); }, {passive: false});
window.addEventListener('mousedown', handleInput);

function resetGame() {
    score = 0;
    gameSpeed = 6;
    obstacles = [];
    isGameOver = false;
    dino.y = 150;
    dino.dy = 0;
    frame = 0;
    gameLoop();
}

function spawnObstacle() {
    let type = Math.random() > 0.5 
        ? {w: 25, h: 50, sx: 446}  // Petit cactus
        : {w: 50, h: 50, sx: 652}; // Gros cactus
    obstacles.push({ x: canvas.width, y: 150, ...type });
}

// --- BOUCLE PRINCIPALE ---
function gameLoop() {
    if (isGameOver) {
        draw(); // On dessine une dernière fois pour l'écran de fin
        return;
    }

    frame++;

    // 1. Physique du Dino
    dino.dy += dino.gravity;
    dino.y += dino.dy;
    if (dino.y > 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.grounded = true;
    }

    // 2. Animation (pattes du dino)
    if (frame % 8 === 0) dino.animFrame = dino.animFrame === 0 ? 1 : 0;

    // 3. Sol et Obstacles
    groundX -= gameSpeed;
    if (groundX <= -600) groundX = 0;

    if (frame % 100 === 0) spawnObstacle();

    obstacles.forEach((obs, i) => {
        obs.x -= gameSpeed;
        
        // Collision (un peu réduite pour être juste)
        if (dino.x + 5 < obs.x + obs.w - 5 &&
            dino.x + dino.width - 5 > obs.x + 5 &&
            dino.y + 5 < obs.y + obs.h - 5 &&
            dino.y + dino.height - 5 > obs.y + 5) {
            isGameOver = true;
        }

        if (obs.x + obs.w < 0) {
            obstacles.splice(i, 1);
            score++;
            gameSpeed += 0.05;
        }
    });

    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // DESSIN DU SOL
    if (sprite.complete && sprite.width > 0) {
        ctx.drawImage(sprite, 2, 54, 1200, 12, groundX, 185, 1200, 12);
        ctx.drawImage(sprite, 2, 54, 1200, 12, groundX + 1200, 185, 1200, 12);
    } else {
        ctx.fillStyle = "#535353";
        ctx.fillRect(0, 185, canvas.width, 2);
    }

    // DESSIN DU DINO
    if (sprite.complete && sprite.width > 0) {
        let dinoSX = 1338; // Statique / Saut
        if (isGameOver) dinoSX = 1514;
        else if (!dino.grounded) dinoSX = 1338;
        else dinoSX = 1514 + (dino.animFrame * 88);
        
        ctx.drawImage(sprite, dinoSX, 2, 88, 94, dino.x, dino.y, dino.width, dino.height);
    } else {
        ctx.fillStyle = "#535353";
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }

    // DESSIN DES OBSTACLES
    obstacles.forEach(obs => {
        if (sprite.complete && sprite.width > 0) {
            ctx.drawImage(sprite, obs.sx, 2, obs.w*2, obs.h*2, obs.x, obs.y, obs.w, obs.h);
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        }
    });

    // SCORE
    ctx.fillStyle = '#535353';
    ctx.font = '20px "Courier New"';
    ctx.fillText(score.toString().padStart(5, '0'), 520, 30);

    if (isGameOver) {
        ctx.textAlign = "center";
        if (sprite.complete && sprite.width > 0) {
            ctx.drawImage(sprite, 954, 29, 381, 21, canvas.width/2 - 95, 80, 190, 11);
        } else {
            ctx.fillText("GAME OVER", canvas.width/2, 80);
        }
        ctx.font = "14px Arial";
        ctx.fillText("CLIQUE OU ESPACE POUR REJOUER", canvas.width/2, 110);
        ctx.textAlign = "start";
    }
}

// Lancement
if (sprite.complete) {
    gameLoop();
} else {
    sprite.onload = gameLoop;
    // Si l'image ne charge pas après 2 secondes, on lance quand même avec les carrés
    setTimeout(() => { if (frame === 0) gameLoop(); }, 2000);
}
