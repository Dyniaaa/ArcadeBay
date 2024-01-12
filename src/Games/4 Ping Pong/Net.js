import Renderer from "./Renderer.js";

export default class Net {
  constructor({
    x,
    y,
    height,
    segmentWidth,
    segmentHeight,
    segmentGap,
    color,
  }) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.segmentWidth = segmentWidth;
    this.segmentHeight = segmentHeight;
    this.segmentGap = segmentGap;
    this.color = color;

    this.Renderer = Renderer.getInstance();
  }

  draw = () => {
    let posY = this.y;
    while (posY < this.height) {
      this.Renderer.drawRect(
        this.x,
        posY,
        this.segmentWidth,
        this.segmentHeight,
        this.color
      );

      posY += this.segmentGap + this.segmentHeight;
    }
  };
}
