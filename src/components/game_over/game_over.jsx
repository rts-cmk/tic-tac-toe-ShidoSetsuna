import { useEffect } from "react";
import confetti from "canvas-confetti";
import gameStates from "../game_state/game_state.js";
import "./game_over.scss";

export default function GameOver({ gameState }) {
  // Trigger confetti when player wins
  useEffect(() => {
    if (gameState === gameStates.X_WINS) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Cleanup confetti on unmount
    return () => {
      confetti.reset();
    };
  }, [gameState]);

  if (gameState === gameStates.IN_PROGRESS) {
    return null; // Don't render anything if game is in progress
  }

  return (
    <div className="game-over">
      <div className="game-over-content">
        {gameState === gameStates.X_WINS && (
          <h2 className="win">You Win! 🎉</h2>
        )}
        {gameState === gameStates.O_WINS && (
          <h2 className="lose">Computer Wins!</h2>
        )}
        {gameState === gameStates.DRAW && (
          <h2 className="draw">It's a Draw!</h2>
        )}
      </div>
    </div>
  );
}
