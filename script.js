//  JavaScript Snake
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const eatingSound = new Audio('static/sounds/lunch.wav');
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let isPaused = false;

document.getElementById('up-btn').addEventListener('click', function() { changeDirection('up'); });
document.getElementById('down-btn').addEventListener('click', function() { changeDirection('down'); });
document.getElementById('left-btn').addEventListener('click', function() { changeDirection('left'); });
document.getElementById('right-btn').addEventListener('click', function() { changeDirection('right'); });
document.getElementById('enter-btn').addEventListener('click', function() {
  if (!gameStarted) {
    startGame();
  }
});
document.getElementById('pause-btn').addEventListener('click', pauseGame);

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('touchstart', () => {
    button.classList.add('hover');
  });
  button.addEventListener('touchend', () => {
    button.classList.remove('hover');
  });
});


/**
 * Changes the direction of the game.
 * 
 * @param {string} newDirection - The new direction to change to.
 */
function changeDirection(newDirection) {
  if (!isOppositeDirection(newDirection, direction) && gameStarted && !isPaused) {
    direction = newDirection;
  }
}

/**
 * Pauses or resumes the game.
 */
function pauseGame() {
  if (gameStarted && !isPaused) {
    clearInterval(gameInterval); 
    isPaused = true;
    instructionText.textContent = 'Paused. Press "Pause" to resume.'; 
    instructionText.style.display = 'block';
  } else if (isPaused) {
    isPaused = false;
    gameInterval = setInterval(gameLoop, gameSpeedDelay);
    instructionText.style.display = 'none';
  }
}

/**
 * Clears the game board and redraws the snake and food.
 * Also updates the current score.
 */
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

/**
 * Iterates through each segment of the snake and draws it on the board.
 */
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

























