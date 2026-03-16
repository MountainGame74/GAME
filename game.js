const character = document.getElementById("character");
const block = document.getElementById("block");
const scoreElement = document.getElementById("score");

let score = 0;
let gameSpeed = 5; // Vitesse de base
let blockPosition = 600;
let isGameOver = false;

// --- FONCTION DE SAUT ---
function jump() {
    // On ne peut sauter que si le perso n'est pas déjà en train de sauter
    if (!character.classList.contains("animate")) {
        character.classList.add("animate");
        setTimeout(() => {
            character.classList.remove("animate");
        }, 500);
    }
}

// --- BOUCLE DE JEU (GAME LOOP) ---
function gameLoop() {
    if (isGameOver) return;

    // 1. Déplacer l'obstacle
    blockPosition -= gameSpeed;
    
    // 2. Replacer l'obstacle s'il sort de l'écran (aléatoire)
    if (blockPosition < -20) {
        blockPosition = 600 + Math.random() * 300; // Apparition aléatoire entre 600 et 900px
        score++; // On gagne un point par obstacle franchi
        gameSpeed += 0.2; // Le jeu accélère !
    }
    
    block.style.left = blockPosition + "px";
    scoreElement.innerHTML = "Score: " + score;

    // 3. Détection de collision précise
    let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
    
    // Si l'obstacle est au niveau du perso (entre 0 et 50px de large)
    // ET que le perso est à moins de 40px de hauteur (la taille du bloc)
    if (blockPosition < 50 && blockPosition > 0 && characterBottom < 40) {
        endGame();
    }

    requestAnimationFrame(gameLoop); // Relance la boucle de manière fluide
}

function endGame() {
    isGameOver = true;
    alert("Game Over ! Votre score : " + score);
    // Recharge la page pour recommencer
    location.reload();
}

// Contrôles
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
});

// Lancement du jeu
gameLoop();
