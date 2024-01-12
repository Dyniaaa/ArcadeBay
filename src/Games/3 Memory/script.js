import { useEffect, useRef } from "react";
import "./style.scss";
import { NavLink } from "react-router-dom";

function Memory() {
  let memory = useRef(null);

  useEffect(() => {
    memory.current = new Memory();
    memory.current.init();
  });

  class Memory {
    symbols = [
      "cube",
      "cube",
      "diamond",
      "diamond",
      "anchor",
      "anchor",
      "computer",
      "computer",
      "leaf",
      "leaf",
      "house",
      "house",
      "bomb",
      "bomb",
      "car",
      "car",
    ];

    numTiles = 16;
    score = 0;
    selectedTiles = [];

    init = () => {
      this.scoreInfo = document.querySelector(".score");
      this.deck = document.querySelector(".deck");
      this.repeatButton = document.querySelector(".fa-repeat");

      this.setGameInfo();
      this.randomizeSymbols();
      this.tiles = [];
      this.addTiles();
      this.addListeners();
    };

    setGameInfo = () => {
      this.scoreInfo.innerHTML = "Punkty: " + this.score;
    };

    randomizeSymbols = () => {
      for (let i = this.symbols.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = this.symbols[i];
        this.symbols[i] = this.symbols[j];
        this.symbols[j] = temp;
      }
    };

    addTiles = () => {
      const symbolsCopy = [...this.symbols];

      for (let i = 0; i < this.numTiles; i++) {
        const t = this.addTile(i, symbolsCopy.pop());
        this.tiles.push(t);
      }
    };

    addTile = (index, symbol) => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.id = "card" + index;
      div.innerHTML = `
        <i class="fa card-face card-front"></i>
        <i data-symbol="${symbol}" class="fa fa-${symbol} card-face card-back"></i>
    `;

      this.deck.appendChild(div);
      return div;
    };

    addListeners = () => {
      this.tiles.forEach((tile) => {
        tile.addEventListener("click", () => this.tileClicked(tile));
      });
      this.repeatButton.addEventListener("click", this.restart);
    };

    tileClicked = (tile) => {
      const tileStatus = tile.getAttribute("data-status");
      if (tileStatus === "matched") return;

      tile.classList.toggle("is-flipped");

      const tileSymbol = tile
        .querySelector("i.card-back")
        .getAttribute("data-symbol");

      this.selectedTiles.push({
        div: tile,
        symbol: tileSymbol,
      });

      if (this.selectedTiles.length === 2) {
        this.checkSelection();
      }
    };

    checkSelection = () => {
      const tileA = this.selectedTiles[0];
      const tileB = this.selectedTiles[1];

      if (tileA.symbol === tileB.symbol) {
        tileA.div.setAttribute("data-status", "matched");
        tileB.div.setAttribute("data-status", "matched");
        this.score += 20;
      } else {
        this.score -= 1;
        this.noMatchAnimation(tileA, tileB);
      }

      this.selectedTiles = [];
      this.setGameInfo();
    };

    noMatchAnimation = (tileA, tileB) => {
      setTimeout(() => {
        tileA.div.classList.toggle("is-flipped");
        tileB.div.classList.toggle("is-flipped");
      }, 1000);
    };

    restart = () => {
      this.selectedTiles = [];
      this.score = 0;
      this.setGameInfo();
      this.tiles.forEach((tile) => {
        tile.classList.remove("is-flipped");
        tile.setAttribute("data-status", "");
      });
      setTimeout(() => {
        this.tiles.forEach((tile, index) => {
          const symbol = this.symbols[index];
          const cardBack = tile.querySelector("i.card-back");
          cardBack.setAttribute("data-symbol", symbol);
          cardBack.className = `fa fa-${symbol} card-face card-back`;
        });
        this.randomizeSymbols();
      }, 500);
    };
  }

  return (
    <div className="background">
      <section className="gamePanel">
        <div className="gameInfo">
          <span className="score"></span>
          <span>
            <NavLink to="/" className="fa fa-reply"></NavLink>
            <i className="fa fa-repeat"></i>
          </span>
        </div>
        <div className="deck"></div>
      </section>
    </div>
  );
}

export default Memory;
