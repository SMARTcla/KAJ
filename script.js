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

/**
 * Creates a new game element (snake segment or food) with the specified tag and class.
 * 
 * @param {string} tag - The HTML tag for the new element (e.g., 'div').
 * @param {string} className - The class name to assign to the new element.
 * @returns {HTMLElement} The newly created game element.
 */
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

/**
 * Sets the CSS grid position of a game element (snake segment or food).
 * 
 * @param {HTMLElement} element - The game element to position.
 * @param {{x: number, y: number}} position - The grid coordinates for the element.
 */
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

/**
 * Draws the food element on the game board if the game has started.
 */
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

/**
 * Generates a new position for the food on the game board.
 * 
 * @returns {Object} An object with 'x' and 'y' properties representing the new position.
 */
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

/**
 * Moves the snake in the current direction. If the snake eats food, generates new food,
 * plays the eating sound, increases speed, and schedules the next move. If not, removes
 * the last segment to simulate movement.
 */
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }

  // Adds new head based on the current direction
  snake.unshift(head);

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    eatingSound.play();
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    // Removes the last segment if no food was eaten
    snake.pop();
  }
}

/**
 * Initializes the game start process. Validates player name input, shows the game board, 
 * hides the name input form, and prepares the game for starting.
 */
function startGame() {
  const playerNameInput = document.getElementById('playerName');
  const playerName = playerNameInput.value.trim();
  if (playerName.match(/[A-Za-z0-9]+/)) {
      document.querySelector('.game-board').style.display = 'block';
      document.querySelector('.form-group').style.display = 'none';
      instructionText.style.display = 'none'; 
      logo.style.display = 'none'; 
      gameStarted = true; 
      gameInterval = setInterval(gameLoop, gameSpeedDelay);
      updateScore(true);
  } else {
      alert('Please enter a valid name. Only English letters and numbers allowed.');
  }
}

/**
 * Handles key press events for starting the game, pausing, and resuming, as well as controlling the snake's direction.
 * @param {KeyboardEvent} event - The event object representing the key press.
 */
function handleKeyPress(event) {
    if (event.code === 'Enter' && !gameStarted) {
        if (!isPaused) {
            gameStarted = true;
            instructionText.style.display = 'none';
            logo.style.display = 'none';
            gameInterval = setInterval(gameLoop, gameSpeedDelay);
        } else {
            isPaused = false;
            gameInterval = setInterval(gameLoop, gameSpeedDelay);
        }
    } else if (event.key === 'p' || event.key === 'P') { 
        if (gameStarted && !isPaused) {
            clearInterval(gameInterval); 
            isPaused = true;
            instructionText.textContent = 'Paused. Press "P" to resume.'; 
            instructionText.style.display = 'block';
        } else if (isPaused) {
            isPaused = false;
            gameInterval = setInterval(gameLoop, gameSpeedDelay);
            instructionText.style.display = 'none';
        }
    } else if (gameStarted && !isPaused) {
        const newDirection = getNewDirection(event.key);
        if (!isOppositeDirection(newDirection, direction)) {
            direction = newDirection;
        }
    }
}

/**
 * The main game loop that moves the snake, checks for collisions, and redraws the game.
 */
function gameLoop() {
    move();
    checkCollision();
    draw();
}

/**
 * Determines the new direction of the snake based on the key pressed.
 * @param {string} key - The key pressed by the player.
 * @returns {string} The new direction of the snake.
 */
function getNewDirection(key) {
    switch (key) {
        case 'w': return 'up';
        case 's': return 'down';
        case 'a': return 'left';
        case 'd': return 'right';
        default: return direction; 
    }
}













