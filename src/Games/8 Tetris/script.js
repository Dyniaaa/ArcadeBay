import { useEffect, useRef } from "react";
import Block from "./block.js";
import Board from "./board.js";
import Renderer from "./renderer.js";
import { NavLink } from "react-router-dom";

function Tetris() {
  let game = useRef(null);

  useEffect(() => {
    if (!game.current) {
      game.current = new Game();
      game.current.init();
    }

    return () => {
      if (game.current) {
        game.current.cleanup();
      }
    };
  });

  class Game {
    intervalId = null;

    init = async () => {
      this.renderer = Renderer.getInstance();

      this.board = new Board({
        width: this.renderer.getWidth(),
        height: this.renderer.getHeight(),
        sqrSize: 20,
      });
      this.block = await new Block(this.board).init();

      this.block.nextBlock();
      this.initControls();
      this.startGame();
    };

    initControls = () => {
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          if (!this.block.checkCollision(-1, 0)) {
            this.block.moveLeft();
          }
        } else if (e.key === "ArrowUp") {
          this.block.rotateRight();
          if (this.block.checkCollision(0, 0)) {
            this.block.rotajsoteLeft();
          }
        } else if (e.key === "ArrowRight") {
          if (!this.block.checkCollision(1, 0)) {
            this.block.moveRight();
          }
        } else if (e.key === "ArrowDown") {
          this.moveDown();
        }
      });
    };

    moveDown = () => {
      if (!this.block.checkCollision(0, 1)) {
        this.block.moveDown();
      } else {
        this.block.lockOnBoard();
        this.board.removeFullRows();
        this.block.nextBlock();
      }
    };

    startGame = () => {
      this.lastDropTime = Date.now();

      const fps = 30;
      this.intervalId = setInterval(() => this.updateGame(), 1000 / fps);
    };

    updateGame = () => {
      //logika
      if (Date.now() - this.lastDropTime > 1000) {
        this.lastDropTime = Date.now();

        this.moveDown();
      }

      this.render();
    };

    render = () => {
      this.board.draw();
      this.block.drawOnBoard(this.board);
    };

    cleanup = () => {
      clearInterval(this.intervalId);
      console.log("CleanUp");
    };
  }

  return (
    <div className="gameContainer">
      <NavLink className={"returnButton"} to={"/"}>
        Return
      </NavLink>
      <canvas className="canvas" width="200" height="400"></canvas>
    </div>
  );
}
export default Tetris;
