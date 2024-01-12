import Renderer from "./Renderer.js";

export default class Paddle {
  constructor({ score, x, y, width, height, color, canvas }) {
    this.score = score;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.canvas = canvas;

    this.Renderer = Renderer.getInstance();
  }

  getScore = () => {
    return this.score;
  };

  addScore = () => {
    this.score++;
  };

  computAI = (ball) => {
    this.y += (ball.y - (this.y + this.height / 2)) * 0.1;
  };

  getRect = () => {
    return {
      top: this.y,
      bottom: this.y + this.height,
      left: this.x,
      right: this.x + this.width,
    };
  };

  checkCollision = (ball) => {
    const b = ball.getRect();
    const p = this.getRect();

    return (
      b.top <= p.bottom &&
      b.right >= p.left &&
      b.bottom >= p.top &&
      b.left <= p.right
    );
  };

  getCollisionPoint = (ball) => {
    let collidePoint = ball.y - (this.y + this.height / 2);

    collidePoint = collidePoint / (this.height / 2); // ograniczenie wartosci od -1 do 1
    return collidePoint;
  };

  movePaddle = (e) => {
    let rect = this.canvas.getBoundingClientRect();
    this.y = e.clientY - rect.top - this.height / 2;
  };

  draw = () => {
    this.Renderer.drawRect(this.x, this.y, this.width, this.height, this.color);
  };
}
