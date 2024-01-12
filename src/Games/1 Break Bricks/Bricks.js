import Renderer from "./Renderer.js";

export default class Bricks {
  bricks = [];

  constructor({
    numRows = 4,
    numCols = 7,
    brickWidth = 60,
    brickHeight = 20,
    brickGap = 10,
    brickMarginTop = 30,
    brickMarginLeft = 20,
  } = {}) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.brickWidth = brickWidth;
    this.brickHeight = brickHeight;
    this.brickGap = brickGap;
    this.brickMarginTop = brickMarginTop;
    this.brickMarginLeft = brickMarginLeft;

    this.renderer = Renderer.getInstance();
    this.generateBricks();
  }

  generateBricks = () => {
    for (let r = 0; r < this.numCols; r++) {
      this.bricks[r] = [];

      for (let c = 0; c < this.numCols; c++) {
        const x = c * (this.brickWidth + this.brickGap) + this.brickMarginLeft;

        const y = r * (this.brickHeight + this.brickGap) + this.brickMarginTop;

        this.bricks[r][c] = {
          x: x,
          y: y,
          width: this.brickWidth,
          height: this.brickHeight,
          alive: true,
          color: "red",
        };
      }
    }
  };

  drawAll = () => {
    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const b = this.bricks[r][c];
        if (b.alive) {
          this.renderer.drawRect(b.x, b.y, b.width, b.height, b.color);
        }
      }
    }
  };

  detectBalCollision = (ball) => {
    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const brick = this.bricks[r][c];

        if (brick.alive) {
          if (
            ball.x > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y > brick.y &&
            ball.y < brick.y + brick.height
          ) {
            console.log("Collision with brick");
            ball.brickCollision();
            brick.alive = false;

            return true;
          }
        }
      }
    }
    return false;
  };

  checkAllBricksDestroyed = () => {
    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const b = this.bricks[r][c];
        if (b.alive) {
          return false;
        }
      }
    }
    return true;
  };

  restart = () => {
    this.generateBricks();
  };
}
