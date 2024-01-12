import Renderer from "./Renderer.js";

export default class Ball {
  x;
  y;
  dx = 2;
  dy = -2;
  color = "#" + Math.floor(Math.random() * 16777215).toString(16);

  constructor(ballRadius) {
    this.ballRadius = ballRadius;
    this.renderer = Renderer.getInstance();
    this.canvas = this.renderer.getCanvas();

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 40;
  }

  update = () => {
    if (
      this.x + this.ballRadius + this.dx > this.canvas.width ||
      this.x + this.dx - this.ballRadius < 0
    ) {
      this.dx = -this.dx;
    }

    if (this.y + this.dy - this.ballRadius <= 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  };

  draw = () => {
    this.renderer.drawCircle(this.x, this.y, this.ballRadius, this.color);
  };

  getRect = () => {
    return {
      top: this.y - this.ballRadius,
      right: this.x + this.ballRadius,
      bottom: this.y + this.ballRadius,
      left: this.x - this.ballRadius,
    };
  };

  checkPaddleCollision = (paddle) => {
    const paddleRect = paddle.getRect();
    const ballRect = this.getRect();

    if (
      ballRect.right > paddleRect.left &&
      ballRect.left < paddleRect.right &&
      ballRect.bottom > paddleRect.top
    ) {
      this.dy = -this.dy;
      return true;
    }

    return false;
  };

  checkBottomWallCollision = () => {
    if (this.y + this.ballRadius > this.canvas.height) {
      return true;
    } else {
      return false;
    }
  };

  brickCollision = () => {
    this.dy = -this.dy;
  };

  restart = () => {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 40;
    this.dx = Math.random() < 0.5 ? 2 : -2;
    this.dy = -2;
  };
}
