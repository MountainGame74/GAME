const character = document.getElementById("character");
const block = document.getElementById("block");
const scoreElement = document.getElementById("score");

let score = 0;
let blockPosition = 600;
let gameSpeed = 5;
let isGameOver = false;

// Fonction pour faire sauter le personnage
function jump() {
    if (isGameOver) return;
    
    if (!character.classList.contains("animate")) {
        character.classList.add("animate");
        // Retire la classe après l'animation (500ms)
        setTimeout(() => {
            character.classList.remove("animate");
        }, 500);
    }
}

// Détection de la touche Espace
window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
});

// Boucle principale du jeu
function update() {
    if (isGameOver) return;

    // Déplacement du bloc vers la gauche
    blockPosition -= gameSpeed;

    // Si le bloc sort de l'écran, on le remet à droite
    if (blockPosition < -20) {
        blockPosition = 600;
        score++;
        gameSpeed += 0.2; // Le jeu accélère
    }

    block.style.left = blockPosition + "px";
    scoreElement.innerText = "Score: " + score;

    // --- LOGIQUE DE COLLISION ---
    // On récupère la position verticale du perso
    let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
    
    // Collision si :
    // 1. Le bloc est au niveau du perso (entre 50px et 100px du bord gauche)
    // 2. Le perso est assez bas pour toucher le bloc (moins de 40px de haut)
    if (blockPosition > 50 && blockPosition < 100 && characterBottom < 40) {
        isGameOver = true;
        alert("Game Over ! Score final : " + score);
        location.reload(); // Recommencer
    }

    requestAnimationFrame(update);
}

// Lancement de la boucle
update();
