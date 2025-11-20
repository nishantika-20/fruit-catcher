// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Basket properties
const basket = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 60,
    width: 80,
    height: 60,
    speed: 40
};

// Load images
const basketImg = new Image(); basketImg.src = 'basket.png';
const appleImg = new Image(); appleImg.src = 'apple.png';
const bananaImg = new Image(); bananaImg.src = 'banana.png';
const gameOverImg = new Image(); gameOverImg.src = 'gameover.png';
const restartImg = new Image(); restartImg.src = 'restart.png';
const bgImg = new Image(); bgImg.src = 'background.png';
const title = new Image(); title.src = 'title.png';
// Game variables
let fruits = [];
let score = 0;
let lives = 5;
let gameRunning = false;
let fruitInterval;

// Draw basket
function drawBasket() {
    ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);
}

// Create fruit
function createFruit() {
    const x = Math.random() * (canvas.width - 40);
    const y = -50;
    const speed = 3 + Math.random() * 2;
    const type = Math.random() < 0.5 ? 'apple' : 'banana';
    const img = type === 'apple' ? appleImg : bananaImg;
    fruits.push({ x, y, width: 60, height: 60, speed, img });
}

// Draw fruits
function drawFruits() {
    for (let i = 0; i < fruits.length; i++) {
        const f = fruits[i];
        ctx.drawImage(f.img, f.x, f.y, f.width, f.height);
        f.y += f.speed;
    }
}

// Collision check
function checkCollision() {
    for (let i = 0; i < fruits.length; i++) {
        const f = fruits[i];
        if (
            f.y + f.height >= basket.y &&
            f.x + f.width >= basket.x &&
            f.x <= basket.x + basket.width
        ) {
            score++;
            fruits.splice(i, 1);
            i--;
        } else if (f.y > canvas.height) {
            lives--;
            fruits.splice(i, 1);
            i--;
        }
    }
}

// Draw score and lives
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = ' 24px Impact';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Lives: ' + lives, 10, 60);
}

// Start screen animation variables
let pulseScale = 1;
let pulseDir = 1;
let floatOffset = 0;
let floatDir = 1;

function drawStartScreen() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;

    // Floating animation
    floatOffset += floatDir * 0.3;
    if (floatOffset > 10) floatDir = -1;
    if (floatOffset < -10) floatDir = 1;

    // Draw title image
    const titleImg = document.getElementById("titleImg");
    const imgW = 400;
    const imgH = 400;

    if (titleImg) {
        ctx.drawImage(
            titleImg,
            centerX - imgW / 2,
            300 + floatOffset - imgH / 2,
            imgW,
            imgH
        );
    }

    // Pulsing text
    pulseScale += pulseDir * 0.01;
    if (pulseScale > 1.1) pulseDir = -1;
    if (pulseScale < 0.9) pulseDir = 1;

    ctx.save();
    ctx.translate(centerX, 420);
    ctx.scale(pulseScale, pulseScale);
    ctx.font = '30px "Luckiest Guy"';
    ctx.fillStyle = '#0080FF';
    ctx.textAlign = 'center';
    ctx.fillText("Press                  to Start", 0, 0);
    ctx.fillStyle = '#ff5100ff';
    ctx.fillText("space",-18,0);
    ctx.restore();
}

// Main game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    if (!gameRunning) {
        drawStartScreen();
        requestAnimationFrame(update);
        return;
    }

    if (lives > 0) {
        drawBasket();
        drawFruits();
        checkCollision();
        drawScore();
        requestAnimationFrame(update);
    } else {
        drawGameOver();
    }
}

// Draw Game Over screen
function drawGameOver() {
    const gameOverX = canvas.width / 2 - 145;
    const gameOverY = canvas.height / 2 - 180;
    const gameOverWidth = 300;
    const gameOverHeight = 200;

    const restartX = canvas.width / 2 - 37;
    const restartY = canvas.height / 2 - 50;
    const restartWidth = 90;
    const restartHeight = 100;

    ctx.drawImage(gameOverImg, gameOverX, gameOverY, gameOverWidth, gameOverHeight);
    ctx.drawImage(restartImg, restartX, restartY, restartWidth, restartHeight);
}

// Restart click
canvas.addEventListener('click', (e) => {
    if (lives > 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const restartX = canvas.width / 2 - 37;
    const restartY = canvas.height / 2 - 50;
    const restartWidth = 90;
    const restartHeight = 100;

    if (
        mouseX >= restartX &&
        mouseX <= restartX + restartWidth &&
        mouseY >= restartY &&
        mouseY <= restartY + restartHeight
    ) {
        startGame();
    }
});

// Mouse movement for basket
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    basket.x = mouseX - basket.width / 2;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
});

// Start game
function startGame() {
    gameRunning = true;
    score = 0;
    lives = 5;
    fruits = [];

    clearInterval(fruitInterval);
    fruitInterval = setInterval(createFruit, 1000);

    update();
}

// Load tracking
let imagesLoaded = 0;
const totalImages = 6;

function checkStart() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        update();
    }
}

basketImg.onload = checkStart;
appleImg.onload = checkStart;
bananaImg.onload = checkStart;
gameOverImg.onload = checkStart;
restartImg.onload = checkStart;
bgImg.onload = checkStart;

// Key listener
document.addEventListener('keydown', function(e) {
    if (!gameRunning && e.code === 'Space') {
        startGame();
    }
});
