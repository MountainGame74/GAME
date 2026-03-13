const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Variables Globales ---
let score = 0;
let gameSpeed = 5;
let isGameOver = false;

// --- Le Dino ---
let dino = { x: 50, y: 150, width: 40, height: 40, dy: 0, jumpForce: 12, grounded: false };
let gravity = 0.6;

// --- Les Obstacles (Tableau pour en avoir plusieurs) ---
let obstacles = [];

function spawnObstacle() {
    let size = 20 + Math.random() * 30; // Taille aléatoire
    obstacles.push({ x: canvas.width, y: 190 - size, width: 20, height: size });
}

// --- Contrôles ---
window.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        if (isGameOver) {
            resetGame(); // Recommencer si on a perdu
        } else if (dino.grounded) {
            dino.dy = -dino.jumpForce;
            dino.grounded = false;
        }
    }
});

function resetGame() {
    score = 0;
    obstacles = [];
    isGameOver = false;
    gameLoop();
}

function gameLoop() {
    if (isGameOver) return; // Arrête la boucle si on perd

    // 1. PHYSIQUE DU DINO
    dino.dy += gravity;
    dino.y += dino.dy;
    if (dino.y > 150) { dino.y = 150; dino.dy = 0; dino.grounded = true; }

    // 2. GESTION DES OBSTACLES
    if (Math.random() < 0.02) spawnObstacle(); // 2% de chance par image d'en créer un

    obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed; // Déplace vers la gauche

        // DETECTION DE COLLISION (AABB Collision)
        if (dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y) {
            isGameOver = true;
        }

        if (obs.x + obs.width < 0) { // Supprime si sorti de l'écran
            obstacles.splice(index, 1);
            score++;
        }
    });

    // 3. DESSIN
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dino
    ctx.fillStyle = "#535353";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Obstacles
    ctx.fillStyle = "red";
    obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.width, obs.height));

    // Score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    if (isGameOver) {
        ctx.fillText("GAME OVER - Espace pour rejouer", canvas.width/4, canvas.height/2);
    } else {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();