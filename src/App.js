import React, { Component } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./styles/reset.scss";
import "./styles/styles.scss";
import MainPage from "./Components/MainPage/mainPage";
import TicTacToe from "./Games/9 TicTacToe/script";
import ThreeJSGame from "./Games/Stack Game/Stack Game";
import BreakBricks from "./Games/1 Break Bricks/script";
import FlappyDuck from "./Games/2 Flappy Duck/script";
import Memory from "./Games/3 Memory/script";
import PingPong from "./Games/4 Ping Pong/script";
import QuizComponent from "./Games/5 Quiz/script";
import Snake from "./Games/6 Snake/script";
import Tetris from "./Games/8 Tetris/script";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/TicTacToe" element={<TicTacToe />} />
          <Route path="/BreakBricks" element={<BreakBricks />} />
          <Route path="/FlappyDuck" element={<FlappyDuck />} />
          <Route path="/Memory" element={<Memory />} />
          <Route path="/PingPong" element={<PingPong />} />
          <Route path="/Quiz" element={<QuizComponent />} />
          <Route path="/Snake" element={<Snake />} />
          <Route path="/Tetris" element={<Tetris />} />
          <Route path="/StackGame" element={<ThreeJSGame />} />
        </Routes>
      </HashRouter>
    );
  }
}

export default App;
