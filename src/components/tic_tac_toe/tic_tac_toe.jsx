import { useState, useEffect, useRef } from "react";
import Board from "../board/board.jsx";
import GameOver from "../game_over/game_over.jsx";
import gameStates from "../game_state/game_state.js";
import { getAIMove, AI_DIFFICULTY } from "../ai/ai.js";
import Reset from "../reset/reset.jsx";
import "./tic_tac_toe.scss";
import clickSound from "../../sounds/place.mp3";

const winningCombinations = [
  // Rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },

  // Columns
  { combo: [0, 3, 6], strikeClass: "strike-col-1" },
  { combo: [1, 4, 7], strikeClass: "strike-col-2" },
  { combo: [2, 5, 8], strikeClass: "strike-col-3" },

  // Diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diag-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diag-2" },
];

// Helper function to check for a winner without setting state
function checkWinnerHelper(tiles) {
  for (const { combo } of winningCombinations) {
    const [a, b, c] = combo;
    const tileValue1 = tiles[a];
    const tileValue2 = tiles[b];
    const tileValue3 = tiles[c];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      return tileValue1; // Return the winner ("X" or "O")
    }
  }
  return null; // No winner
}

function checkWinner(tiles, setStrikeClass, setGameState) {
  // Check all winning combinations
  for (const { combo, strikeClass } of winningCombinations) {
    const [a, b, c] = combo;
    const tileValue1 = tiles[a];
    const tileValue2 = tiles[b];
    const tileValue3 = tiles[c];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      setStrikeClass(strikeClass);
      if (tileValue1 === "X") {
        setGameState(gameStates.X_WINS);
      } else {
        setGameState(gameStates.O_WINS);
      }
      return;
    }
  }

  // Check for draw (all tiles filled, no winner)
  const allTilesFilled = tiles.every((tile) => tile !== null);
  if (allTilesFilled) {
    setGameState(gameStates.DRAW);
  }
}

function TicTacToe() {
  const playerX = "X";
  const playerO = "O";

  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(playerX);
  const [strikeClass, setStrikeClass] = useState(null);
  const [gameState, setGameState] = useState(gameStates.PRE_GAME);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [difficulty, setDifficulty] = useState(AI_DIFFICULTY.MEDIUM);

  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current = new Audio(clickSound);
  }, []);

  // Check for winner after tiles change
  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  const handleTileClick = (index) => {
    // Prevent clicking if game is over, tile is already filled, or computer is thinking
    if (
      gameState !== gameStates.IN_PROGRESS ||
      tiles[index] !== null ||
      playerTurn === playerO ||
      isComputerThinking
    ) {
      return;
    }

    // Player makes their move (X)
    const newTiles = [...tiles];
    newTiles[index] = playerX;
    setTiles(newTiles);
    audioRef.current.play();

    // Check if game is over after player's move
    const winner = checkWinnerHelper(newTiles);
    if (winner === null && newTiles.every((tile) => tile !== null)) {
      // Game is a draw, don't switch turns
      return;
    } else if (winner !== null) {
      // Player won, don't switch turns
      return;
    }

    // Game continues, switch to computer's turn
    setPlayerTurn(playerO);
  };

  // Computer's turn (O)
  useEffect(() => {
    if (gameState !== gameStates.IN_PROGRESS) {
      return;
    }
    if (
      playerTurn === playerO &&
      !isComputerThinking &&
      gameState === gameStates.IN_PROGRESS
    ) {
      setIsComputerThinking(true);

      // Delay computer move for better UX
      setTimeout(() => {
        makeComputerMove();
        audioRef.current.play();
        setIsComputerThinking(false);
      }, 500);
    }
  }, [playerTurn, tiles, gameState]);

  const makeComputerMove = () => {
    const moveIndex = getAIMove(tiles, difficulty);

    if (moveIndex !== null) {
      const newTiles = [...tiles];
      newTiles[moveIndex] = playerO;
      setTiles(newTiles);
      setPlayerTurn(playerX);
    }
  };

  const handleReset = () => {
    setTiles(Array(9).fill(null));
    setPlayerTurn(playerX);
    setStrikeClass(null);
    setGameState(gameStates.PRE_GAME);
  };

  const handleStartGame = () => {
    setGameState(gameStates.IN_PROGRESS);
  };

  return (
    <main className="tic-tac-toe">
      <h1>TicTacToe</h1>

      {gameState === gameStates.PRE_GAME && (
        <div className="pre-game">
          <div className="difficulty-selector">
            <label>Select Difficulty: </label>
            <div className="difficulty-buttons">
              <button
                className={`difficulty-btn ${
                  difficulty === AI_DIFFICULTY.EASY ? "active" : ""
                }`}
                onClick={() => setDifficulty(AI_DIFFICULTY.EASY)}>
                Easy
              </button>
              <button
                className={`difficulty-btn ${
                  difficulty === AI_DIFFICULTY.MEDIUM ? "active" : ""
                }`}
                onClick={() => setDifficulty(AI_DIFFICULTY.MEDIUM)}>
                Medium
              </button>
              <button
                className={`difficulty-btn ${
                  difficulty === AI_DIFFICULTY.HARD ? "active" : ""
                }`}
                onClick={() => setDifficulty(AI_DIFFICULTY.HARD)}>
                Hard
              </button>
            </div>
          </div>
          <button className="start-game-btn" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      )}

      {gameState !== gameStates.PRE_GAME && (
        <>
          <div className="game-status">
            {gameState === gameStates.IN_PROGRESS && (
              <p>
                {playerTurn === playerX
                  ? "Your turn (X)"
                  : "Computer's turn (O)"}
              </p>
            )}
          </div>
          <Board
            tiles={tiles}
            onTileClick={handleTileClick}
            playerTurn={playerTurn}
            strikeClass={strikeClass}
          />
          <GameOver gameState={gameState} />
          {gameState !== gameStates.IN_PROGRESS && (
            <Reset onReset={handleReset} />
          )}
        </>
      )}
    </main>
  );
}

export default TicTacToe;
