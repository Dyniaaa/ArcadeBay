import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import bgImage from "./imagesFD/bg/1.png";
import birdImg from "./imagesFD/bird.png";
import pipeBottomImg from "./imagesFD/pipeBottom.png";
import pipeTopImg from "./imagesFD/pipeTop.png";
import sound from "./imagesFD/kwak.mp3";

function FlappyDuck() {
  const game = useRef(null);

  useEffect(() => {
    game.current = new Game();
    game.current.init();

    return () => {
      if (game.current) {
        game.current.cleanup();
      }
    };
  });

  class Game {
    posX = 30;
    posY = 240;
    gravity = 1.5;
    score = 0;
    intervalId = null;

    pipes = [];
    pipesGap = 120;

    init = () => {
      this.canvas = document.querySelector(".canvas");
      this.context = this.canvas.getContext("2d");

      this.bird = new Image();
      this.bird.src = birdImg;

      this.bg = new Image();
      this.bg.src = bgImage;

      this.pipeTop = new Image();
      this.pipeTop.src = pipeTopImg;

      this.pipeBottom = new Image();
      this.pipeBottom.src = pipeBottomImg;

      this.flyAudio = new Audio();
      this.flyAudio.src = sound;

      document.addEventListener("click", this.moveUp);
      document.addEventListener("keydown", (e) => {
        if (e.key === " ") {
          this.moveUp();
          this.flyAudio.play();
        }
      });

      this.startGame();
    };

    moveUp = () => {
      this.posY -= 40;
    };

    startGame = () => {
      const fps = 60;
      this.intervalId = setInterval(() => this.updateGame(), 1000 / fps);

      this.addPipe();
    };

    addPipe = () => {
      let x = this.canvas.width;
      let y =
        Math.floor(Math.random() * this.pipeTop.height) - this.pipeTop.height;

      this.pipes.push({
        top: {
          img: this.pipeTop,
          x: x,
          y: y,
          width: this.pipeTop.width,
          height: this.pipeTop.height,
        },
        bottom: {
          img: this.pipeBottom,
          x: x,
          y: y + this.pipeTop.height + this.pipesGap,
          width: this.pipeBottom.width,
          height: this.pipeBottom.height,
        },
      });
    };

    updateGame = () => {
      this.addGravity();
      this.checkCollision();
      this.render();
    };

    addGravity = () => {
      this.posY += this.gravity;
    };

    checkCollision = () => {
      if (this.posY > this.canvas.height - this.bird.height) {
        this.moveUp();
      }

      if (this.posY < 0) {
        this.posY = 0;
      }

      const pipesToCheck = [...this.pipes];

      const birdX = this.posX;
      const birdY = this.posY;
      const birdWidth = this.bird.width;
      const birdHeight = this.bird.height;

      pipesToCheck.forEach((pipe) => {
        if (
          birdX + birdWidth > pipe.top.x &&
          birdX <= pipe.top.x + pipe.top.width
        ) {
          if (
            birdY < pipe.top.y + pipe.top.height ||
            birdY + birdHeight > pipe.bottom.y
          ) {
            this.restart();
            console.log("Collision");
          }
        }

        if (pipe.top.x === -1) {
          this.score++;

          if (this.score % 2 === 0) {
            this.pipesGap--;
            if (this.pipesGap < 100) {
              this.pipesGap = 100;
            }
            console.log(
              "Game harder, gap between pipes reduced to " + this.pipesGap
            );
          }
        }
      });
    };

    restart = () => {
      this.posX = 30;
      this.posY = 240;
      this.score = 0;
      this.pipes = [];
      this.pipesGap = 120;
      this.addPipe();
    };

    cleanup = () => {
      clearInterval(this.intervalId);
      console.log("CleanUp");
    };

    render = () => {
      this.context.drawImage(this.bg, 0, 0);
      this.drawPipes();
      this.context.drawImage(this.bird, this.posX, this.posY);

      this.context.fillStyle = "#fff";
      this.context.font = "20px verdana";
      this.context.fillText("Score: " + this.score, 20, 20);
    };

    drawPipes = () => {
      const pipesToDraw = [...this.pipes];

      pipesToDraw.forEach((pipe) => {
        this.context.drawImage(pipe.top.img, pipe.top.x, pipe.top.y);
        pipe.top.x--;

        this.context.drawImage(pipe.bottom.img, pipe.bottom.x, pipe.bottom.y);
        pipe.bottom.x--;

        if (pipe.top.x === 150) {
          this.addPipe();
        }

        if (pipe.top.x + this.pipeTop.width < 0) {
          this.pipes.shift();
        }
      });
    };
  }

  return (
    <div className="gameContainer">
      <NavLink to={"/"} className={"returnButton"}>
        Return
      </NavLink>
      <canvas className="canvas" width="400" height="500"></canvas>
    </div>
  );
}

export default FlappyDuck;
