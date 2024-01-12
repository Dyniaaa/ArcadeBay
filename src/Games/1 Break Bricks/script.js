import React, { useEffect, useRef } from "react";
import Ball from "./Ball.js";
import Renderer from "./Renderer.js";
import Paddle from "./Paddle.js";
import Bricks from "./Bricks.js";
import { NavLink } from "react-router-dom";

function BreakBricks() {
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
    ballRadius = 10;
    score = 0;
    lives = 4;
    paddleBallHit = 0;
    intervalId = null;

    init = () => {
      this.Renderer = Renderer.getInstance();
      this.canvas = this.Renderer.getCanvas();
      this.context = this.Renderer.getContext();

      const canvas = document.querySelector(".canvas");
      console.log("Canvas:", canvas);

      this.ball = new Ball(this.ballRadius);
      this.paddle = new Paddle();
      this.bricks = new Bricks();

      this.startGame();
      console.log("init");
    };

    startGame = () => {
      const fps = 60;
      this.intervalId = setInterval(() => this.updateGame(), 1000 / fps);
    };

    updateGame = () => {
      this.ball.update();

      if (this.ball.checkPaddleCollision(this.paddle)) {
        console.log("Ball bounce");
        this.paddleBallHit++;
      }

      if (this.ball.checkBottomWallCollision()) {
        console.log("Losing one life");
        this.lives--;
        this.ball.restart();
      }

      if (this.bricks.detectBalCollision(this.ball)) {
        this.score++;
      }

      if (this.lives <= 0) {
        console.log("End of the game, restart!");
        this.restart();
      }

      if (this.bricks.checkAllBricksDestroyed()) {
        console.log("Player Won!!!");
        this.restart();
      }

      this.render();
    };

    render = () => {
      this.Renderer.clearCanva();
      this.bricks.drawAll();
      this.paddle.draw();
      this.ball.draw();
      this.Renderer.drawText(
        "Score: " + this.score,
        10,
        20,
        "black",
        "20px verdana"
      );
      this.Renderer.drawText(
        "Lives: " + this.lives,
        430,
        20,
        "black",
        "20px verdana"
      );
    };

    cleanup = () => {
      clearInterval(this.intervalId);
      console.log("CleanUp");
    };

    restart = () => {
      console.log("Restart");
      this.ball.restart();
      this.score = 0;
      this.lives = 4;
      this.bricks.restart();
    };
  }

  return (
    <div className="gameContainer">
      <NavLink to={"/"} className={"returnButton"}>
        Return
      </NavLink>
      <canvas className="canvas" width="520" height="400"></canvas>
    </div>
  );
}

export default BreakBricks;
