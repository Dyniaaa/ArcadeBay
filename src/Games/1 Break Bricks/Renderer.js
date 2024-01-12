class Renderer {
  constructor() {
    this.canvas = document.querySelector(".canvas");
    this.context = this.canvas.getContext("2d");
  }

  getCanvas = () => {
    return this.canvas;
  };

  getContext = () => {
    return this.context;
  };

  clearCanva = (clearColor = "white") => {
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, clearColor);
  };

  drawRect = (x, y, width, height, color) => {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  };

  drawCircle = (x, y, radius, color) => {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2, false);
    this.context.closePath();
    this.context.fill();
  };

  drawText = (str, x, y, color, font = "40px verdana") => {
    this.context.fillStyle = color;
    this.context.font = font;
    this.context.fillText(str, x, y);
  };

  static getInstance() {
    if (!this.instance) {
      this.instance = new Renderer();
    }
    return this.instance;
  }
}

export default Renderer;
