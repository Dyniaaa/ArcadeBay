import React, { useEffect } from "react";
import "./style.scss";
import { NavLink } from "react-router-dom";

function TicTacToe() {
  useEffect(() => {
    app.init();
  });

  class App {
    winningVariants = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    currentPlayer = "X";

    init = () => {
      document
        .querySelectorAll(".cell")
        .forEach((cell) => cell.addEventListener("click", this.cellClick));

      document
        .querySelector(".restartGame")
        .addEventListener("click", this.resartClick);
    };

    cellClick = (e) => {
      this.playerTurn(e.target);
    };

    playerTurn = (el) => {
      if (el.innerHTML === "X" || el.innerHTML === "O") return;
      el.innerHTML = this.currentPlayer;

      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";

      this.checkWinner();
    };

    checkWinner = () => {
      for (let i = 0; i < this.winningVariants.length; i++) {
        const variant = this.winningVariants[i];
        const a = this.getCellValue(variant[0]);
        const b = this.getCellValue(variant[1]);
        const c = this.getCellValue(variant[2]);

        if (a === "" || b === "" || c === "") continue;
        if (a === b && b === c) {
          this.setWinner("Winner: " + a);
        }
      }
    };

    setWinner = (el) => {
      document.querySelector(".winner").innerHTML = el;
    };

    getCellValue = (index) => {
      return document.querySelector(`.cell[data-index='${index}']`).innerHTML; // X albo O
    };

    resartClick = () => {
      this.currentPlayer = "X";
      document.querySelectorAll(".cell").forEach((cell) => {
        cell.innerHTML = "";
      });
      this.setWinner("");
    };
  }

  const app = new App();

  return (
    <main className="TicTacToe">
      <p>Tic, Tac, Toe</p>
      <span className="winner"></span>

      <div className="gameGrid">
        <div className="cell" data-index="0"></div>
        <div className="cell" data-index="1"></div>
        <div className="cell" data-index="2"></div>
        <div className="cell" data-index="3"></div>
        <div className="cell" data-index="4"></div>
        <div className="cell" data-index="5"></div>
        <div className="cell" data-index="6"></div>
        <div className="cell" data-index="7"></div>
        <div className="cell" data-index="8"></div>
      </div>
      <div className="buttonsDiv">
        <button className="restartGame">Restart</button>
        <NavLink to={"/"} className={"returnButton"}>
          Return
        </NavLink>
      </div>
    </main>
  );
}

export default TicTacToe;
