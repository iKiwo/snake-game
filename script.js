const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

// Variables del juego
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let nextVelocityX = 0, nextVelocityY = 0; // Para movimiento fluido
let score = 0;
let lastRenderTime = 0;
const SNAKE_SPEED = 8;

// High Score
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;


const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Game Over
const handleGameOver = () => {
    alert("Game Over! Press OK to replay...");
    location.reload();
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        nextVelocityX = 0;
        nextVelocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        nextVelocityX = 0;
        nextVelocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        nextVelocityX = -1;
        nextVelocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        nextVelocityX = 1;
        nextVelocityY = 0;
    }
};


controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
});


const initGame = (timestamp) => {
    if (gameOver) return handleGameOver();
    
    requestAnimationFrame(initGame);
    const secondsSinceLastRender = (timestamp - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;
    
    lastRenderTime = timestamp;
    
    velocityX = nextVelocityX;
    velocityY = nextVelocityY;
    
    snakeX += velocityX;
    snakeY += velocityY;
    
    
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    
    snakeBody[0] = [snakeX, snakeY];
    
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }
    
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    
    playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
requestAnimationFrame(initGame);
document.addEventListener("keydown", changeDirection);