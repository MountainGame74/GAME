const character = document.getElementById("character");
const block = document.getElementById("block");
let score = 0;

// Lancer l'animation de l'obstacle
block.classList.add("block-move");

function jump() {
    if (character.classList != "animate") {
        character.classList.add("animate");
        setTimeout(() => {
            character.classList.remove("animate");
        }, 500);
    }
}

// Détection de collision
let checkDead = setInterval(function() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

    if (blockLeft < 50 && blockLeft > 0 && characterTop >= 130) {
        alert("Game Over ! Score: " + Math.floor(score));
        score = 0;
    } else {
        score += 0.01;
        document.getElementById("score").innerHTML = "Score: " + Math.floor(score);
    }
}, 10);

window.addEventListener("keydown", jump);
