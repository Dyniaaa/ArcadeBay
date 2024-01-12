import Renderer from "./renderer.js";

export default class Board {
  board = null;
  NUM_ROWS = null;
  NUM_COLS = null;
  DEFAULT = "white";
  score = 0;

  constructor({ width, height, sqrSize }) {
    this.renderer = Renderer.getInstance();

    this.NUM_ROWS = Math.floor(height / sqrSize);
    this.NUM_COLS = Math.floor(width / sqrSize);

    this.width = width;
    this.height = height;
    this.sqrSize = sqrSize;

    this.board = [];

    for (let i = 0; i < this.NUM_ROWS; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.NUM_COLS; j++) {
        this.board[i][j] = this.DEFAULT;
      }
    }
  }

  draw = () => {
    this.board.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        this.drawBoardSqr(rowIndex, colIndex, this.board[rowIndex][colIndex]);
      });
    });

    this.renderer.drawText(
      "Punkty: " + this.score,
      5,
      20,
      "black",
      "16px verdana"
    );
  };

  drawBoardSqr = (rowIndex, colIndex, color) => {
    this.renderer.drawSquare(
      colIndex * this.sqrSize,
      rowIndex * this.sqrSize,
      this.sqrSize,
      this.sqrSize,
      color
    );
  };

  lockBoardSqr = (rowIndex, colIndex, color) => {
    if (rowIndex >= this.board.length || rowIndex < 0) return;
    if (colIndex >= this.board[rowIndex].length || colIndex < 0) return;

    this.board[rowIndex][colIndex] = color;
  };

  checkSqrCollision = (x, y) => {
    if (x < 0 || x >= this.NUM_COLS || y >= this.NUM_ROWS) {
      return true;
    }

    if (y < 0) return false;

    if (this.board[y][x] === this.DEFAULT) {
      return false;
    } else {
      return true;
    }
  };

  removeFullRows = () => {
    let newScore = 0;
    let numFullRows = 0;

    for (let r = 0; r < this.NUM_ROWS; r++) {
      let isFullRow = true;
      for (let c = 0; c < this.NUM_COLS; c++) {
        if (this.board[r][c] === this.DEFAULT) {
          isFullRow = false;
        }
      }

      if (isFullRow) {
        numFullRows++;

        for (let y = r; y > 1; y--) {
          for (let x = 0; x < this.NUM_COLS; x++) {
            this.board[y][x] = this.board[y - 1][x];
          }
        }

        for (let x = 0; x < this.NUM_COLS; x++) {
          this.board[0][x] = this.DEFAULT;
        }

        newScore += 1;
      }
    }
    this.score += newScore * numFullRows;
  };
}
