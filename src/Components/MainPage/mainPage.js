import React, { Component } from "react";
import "./mainPageStyles.scss";
import { NavLink } from "react-router-dom";

class MainPage extends Component {
  render() {
    return (
      <section className="mainPage">
        <div className="pageLogoDiv">
          <div className="pageLogo"></div>
        </div>
        <div className="gamesDiv">
          <p>1p</p>
          <div className="gamesRow">
            <NavLink to={"/BreakBricks"} className={"navlink"}>
              <div className="breakBricks gameLogo"></div>
              Break Bricks
            </NavLink>
            <NavLink to={"/FlappyDuck"} className={"navlink"}>
              <div className="flappyDuck gameLogo"></div>
              Flappy Duck
            </NavLink>
            <NavLink to={"/Memory"} className={"navlink"}>
              <div className="memory gameLogo"></div>
              Memory
            </NavLink>
          </div>
          <div className="gamesRow">
            <NavLink to={"/PingPong"} className={"navlink"}>
              <div className="pingPong gameLogo"></div>
              Ping Pong
            </NavLink>
            <NavLink to={"/Quiz"} className={"navlink"}>
              <div className="quiz gameLogo"></div>
              Quiz
            </NavLink>
            <NavLink to={"/Snake"} className={"navlink"}>
              <div className="snake gameLogo"></div>
              Snake
            </NavLink>
          </div>
          <div className="gamesRow">
            <NavLink to={"/Tetris"} className={"navlink"}>
              <div className="tetris gameLogo"></div>
              Tetris
            </NavLink>
            <NavLink to={"/StackGame"} className={"navlink"}>
              <div className="stackGame gameLogo"></div>
              Stack Game
            </NavLink>
          </div>
          <p>2p</p>
          <div className="gamesRow">
            <NavLink to={"/TicTacToe"} className={"navlink"}>
              <div className="ticTacToe gameLogo"></div>
              Tic Tac Toe
            </NavLink>
          </div>
        </div>
      </section>
    );
  }
}

export default MainPage;
