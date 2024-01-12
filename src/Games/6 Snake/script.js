import { useEffect } from "react";
import { NavLink } from "react-router-dom";

function Snake() {
  useEffect(() => {
    let canvas;
    let context2d;
    let snake = [];
    let wallSize = 10;
    let dx = 0;
    let dy = 0;
    let pauseGame = true;
    let food = {
      x: 0,
      y: 0,
      color: "green",
    };
    let score = 0;

    function clearCanvas() {
      context2d.fillStyle = "black";
      context2d.fillRect(0, 0, canvas.width, canvas.height);
    }

    function makeSnake(snakeLength) {
      for (let i = 0; i < snakeLength; i++) {
        let x = canvas.width / 2 + i * wallSize;
        let y = canvas.height / 2;
        snake.push({ x: x, y: y });
      }
    }

    function drawSnake() {
      snake.forEach(function (el) {
        context2d.strokeStyle = "red";
        context2d.lineWidth = 3.5;
        context2d.lineJoin = "bevel";
        context2d.strokeRect(el.x, el.y, wallSize, wallSize);
      });
    }

    function resetGame() {
      snake = [];
      makeSnake(5);
      randomFood();
      pauseGame = true;
      score = 0;
    }

    function moveSnake(dx, dy) {
      let headX = snake[0].x + dx;
      let headY = snake[0].y + dy;
      snake.unshift({ x: headX, y: headY });
      snake.pop();
    }

    function keyDown(e) {
      if (pauseGame) pauseGame = false;

      switch (e.keyCode) {
        case 37: // left
        case 65: // A
          dy = 0;
          dx = -10;
          break;
        case 38: // up
        case 87: // W
          dy = -10;
          dx = 0;
          break;
        case 39: // right
        case 68: // D
          dy = 0;
          dx = 10;
          break;
        case 40: // down
        case 83: // S
          dy = 10;
          dx = 0;
          break;
        default:
          break;
      }
    }

    function randomFood() {
      function randV(min, max) {
        return (
          Math.floor((Math.random() * (max - min) + min) / wallSize) * wallSize
        );
      }

      let colors = ["yellow", "green", "orange"];
      food.color = colors[Math.floor(Math.random() * colors.length)];

      food.x = randV(20, canvas.width - 20);
      food.y = randV(20, canvas.height - 20);
    }

    function drawFood() {
      context2d.fillStyle = food.color;
      context2d.fillRect(food.x, food.y, wallSize, wallSize);
    }

    function checkWallCollision() {
      snake.forEach(function (el) {
        if (el.x > canvas.width || el.x < 0 || el.y > canvas.height || el.y < 0)
          resetGame();
      });
    }

    function checkFoodCollision() {
      if (food.x === snake[0].x && food.y === snake[0].y) {
        snake.push(Object.assign({}, snake[snake.length - 1]));
        randomFood();
        score++;
      }
    }

    function drawScore() {
      context2d.font = "20px arial";
      context2d.fillStyle = "white";
      context2d.fillText("Score: " + score, 10, 20);
    }

    function startApp() {
      canvas = document.querySelector(".canvas");
      context2d = canvas.getContext("2d");
      document.addEventListener("keydown", keyDown);

      resetGame();

      setInterval(function () {
        clearCanvas();
        checkWallCollision();
        checkFoodCollision();
        if (!pauseGame) {
          moveSnake(dx, dy);
        }
        drawScore();
        drawSnake();
        drawFood();
      }, 100);
    }

    startApp();
  });

  return (
    <div className="gameContainer">
      <NavLink to="/" className={"returnButton"}>Return</NavLink>
      <canvas className="canvas" width="400" height="400"></canvas>
    </div>
  );
}

export default Snake;
