import React, { useEffect, useRef } from "react";
import Renderer from "./Renderer.js";
import Ball from "./Ball.js";
import Paddle from "./Paddle.js";
import Net from "./Net.js";
import { NavLink } from "react-router-dom";

function PingPong() {
  const game = useRef(null);

  useEffect(() => {
    if (!game.current) {
      game.current = new Game();
      game.current.startGame();
    }

    // Cleanup on component unmount
    return () => {
      if (game.current) {
        game.current.stopGame();
        game.current = null;
      }
    };
  });

  // Handling browser window/tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (game.current) {
        game.current.stopGame();
        game.current = null;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  class Game {
    constructor() {
      this.renderer = Renderer.getInstance();
      this.canvas = this.renderer.getCanvas();

      this.ball = new Ball({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        radius: 10,
        speedX: 5,
        speedY: 5,
        speed: 5,
        color: "white",
        canvas: this.canvas,
      });

      this.user = new Paddle({
        score: 0,
        x: 0,
        y: this.canvas.height / 2 - 50,
        width: 20,
        height: 100,
        color: "white",
        canvas: this.canvas,
      });

      this.computer = new Paddle({
        score: 0,
        x: this.canvas.width - 20,
        y: this.canvas.height / 2 - 50,
        width: 20,
        height: 100,
        color: "white",
        canvas: this.canvas,
      });

      this.net = new Net({
        x: this.canvas.width / 2,
        y: 0,
        segmentWidth: 2,
        segmentHeight: 30,
        segmentGap: 5,
        height: this.canvas.height,
        color: "white",
      });

      this.canvas.addEventListener("mousemove", this.user.movePaddle);
    }

    startGame = () => {
      this.animationFrame = requestAnimationFrame(this.updateGame);
    };

    stopGame = () => {
      cancelAnimationFrame(this.animationFrame);
    };

    updateGame = () => {
      // logika gry
      this.checkScore();
      this.ball.checkWallCollision();
      this.ball.update();
      this.computer.computAI(this.ball);

      let player = null;
      if (this.ball.x + this.ball.radius < this.canvas.width / 2) {
        player = this.user;
      } else {
        player = this.computer;
      }

      // obliczenie wektora odbicia
      if (player.checkCollision(this.ball)) {
        const collidePoint = player.getCollisionPoint(this.ball);
        const angleRad = (Math.PI / 4) * collidePoint;
        const direction = this.ball.getBallDirection();
        this.ball.speedX = direction * this.ball.speed * Math.cos(angleRad);
        this.ball.speedY = this.ball.speed * Math.sin(angleRad);

        this.ball.speed += 0.3;

        if (this.ball.speed >= 20) {
          this.ball.speed = 20;
        }
      }

      // renderowanie
      this.render();

      // kontynuuj aktualizację gry
      this.animationFrame = requestAnimationFrame(this.updateGame);
    };

    checkScore = () => {
      if (this.ball.x + this.ball.radius > this.canvas.width) {
        this.user.addScore();
        this.ball.reset();
      } else if (this.ball.x - this.ball.radius < 0) {
        this.computer.addScore();
        this.ball.reset();
      }
    };

    render = () => {
      this.renderer.drawRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
        "black"
      );

      this.renderer.drawText(
        this.user.getScore(),
        this.canvas.width / 4,
        this.canvas.height / 10,
        "white"
      );

      this.renderer.drawText(
        this.computer.getScore(),
        (3 * this.canvas.width) / 4,
        this.canvas.height / 10,
        "white"
      );

      this.ball.draw();
      this.user.draw();
      this.computer.draw();
      this.net.draw();
    };
  }

  return (
    <div className="gameContainer">
      <NavLink to={"/"} className={"returnButton"}>
        Return
      </NavLink>
      <canvas className="canvas" width="600" height="400"></canvas>
    </div>
  );
}

export default PingPong;
