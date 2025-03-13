const container = document.querySelector("#container");
const egg = document.querySelector("#egg");
let velocity = 0;
let gravity = 0.5;
let isJumping = false;
let gameStarted = false;
const platformSpeed = 0.5;
const platformGap = 250;
let platforms = [];

function createPlatform() {
    const platform = document.createElement("div");
    platform.className = "platform";
    const randomOffset = Math.random() * (container.offsetWidth - 100);
    platform.style.left = (randomOffset + 50) + "px";
    platform.style.top = Math.random() * (container.offsetHeight - 400) + "px";
    container.appendChild(platform);
    return platform;
}

function initializePlatforms() {
    // Create more platforms for added challenge
    for (let i = 0; i < 6; i++) {
        const platform = createPlatform();
        platforms.push(platform);
    }
}

function movePlatforms() {
    if (!gameStarted) return;
    platforms.forEach(platform => {
        let top = parseInt(platform.style.top) || 0;
        top += platformSpeed;
        platform.style.top = top + "px";
        // When a platform moves off the bottom, reposition it above the container
        if (top > container.offsetHeight) {
            const randomOffset = Math.random() * (container.offsetWidth - 100);
            platform.style.left = (randomOffset + 50) + "px";
            platform.style.top = (-10 - platformGap) + "px";
        }
    });
}

function checkCollision() {
    let eggBottom = parseInt(egg.style.bottom) || 50;
    let eggLeft = parseInt(egg.style.left) || (container.offsetWidth / 2 - 15);
    let eggRight = eggLeft + 30;
    platforms.forEach(platform => {
        let platformTop = parseInt(platform.style.top) || 0;
        let platformLeft = parseInt(platform.style.left) || 0;
        let platformRight = platformLeft + 100;
        if (
            eggBottom <= (platformTop + 10) &&
            eggBottom + 50 >= platformTop &&
            eggRight >= platformLeft &&
            eggLeft <= platformRight
        ) {
            velocity = 0;
            egg.style.bottom = (platformTop + 10) + "px";
            isJumping = false;
        }
    });
    if (eggBottom <= 0 && velocity < 0) {
        gameOver();
    }
}

function jump() {
    if (!isJumping) {
        velocity = 10;
        isJumping = true;
        if (!gameStarted) {
            gameStarted = true;
            gameLoop();
        }
    }
}

function applyGravity() {
    if (!gameStarted) return;
    let eggBottom = parseInt(egg.style.bottom) || 50;
    velocity -= gravity;
    let newBottom = eggBottom + velocity;
    // When the egg goes above a scroll threshold, move platforms downward instead
    const scrollThreshold = 300;
    if (newBottom > scrollThreshold) {
        let diff = newBottom - scrollThreshold;
        newBottom = scrollThreshold;
        platforms.forEach(platform => {
            let pTop = parseInt(platform.style.top) || 0;
            platform.style.top = (pTop + diff) + "px";
        });
    }
    egg.style.bottom = newBottom + "px";
    checkCollision();
}

function gameLoop() {
    if (!gameStarted) return;
    applyGravity();
    movePlatforms();
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameStarted = false;
    velocity = 0;
    egg.style.bottom = "0px";
    const gameOverMsg = document.createElement("div");
    gameOverMsg.className = "game-over";
    gameOverMsg.textContent = "Game Over! Click to Restart";
    container.appendChild(gameOverMsg);
    container.addEventListener("click", restartGame, { once: true });
}

function restartGame() {
    gameStarted = true;
    velocity = 0;
    isJumping = false;
    egg.style.bottom = "50px";
    platforms.forEach(platform => {
        const randomOffset = Math.random() * (container.offsetWidth - 100);
        platform.style.left = (randomOffset + 50) + "px";
        platform.style.top = Math.random() * (container.offsetHeight - 400) + "px";
    });
    const gameOverMsg = container.querySelector(".game-over");
    if (gameOverMsg) container.removeChild(gameOverMsg);
    gameLoop();
}

initializePlatforms();
egg.addEventListener("click", jump);
