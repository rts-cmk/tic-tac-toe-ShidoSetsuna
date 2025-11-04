// AI difficulty levels
export const AI_DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

// Check if there's a winning move for a player
function findWinningMove(tiles, player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    const values = [tiles[a], tiles[b], tiles[c]];
    const playerCount = values.filter((v) => v === player).length;
    const emptyCount = values.filter((v) => v === null).length;

    // If player has 2 in a row and one empty, that's the winning/blocking move
    if (playerCount === 2 && emptyCount === 1) {
      if (tiles[a] === null) return a;
      if (tiles[b] === null) return b;
      if (tiles[c] === null) return c;
    }
  }

  return null;
}

// Get random available tile
function getRandomMove(availableTiles) {
  return availableTiles[Math.floor(Math.random() * availableTiles.length)];
}

// Easy AI: Just picks random moves
function getEasyMove(availableTiles) {
  return getRandomMove(availableTiles);
}

// Medium AI: Tries to block player, otherwise random
function getMediumMove(tiles, availableTiles) {
  // Try to block player's winning move
  const blockMove = findWinningMove(tiles, "X");
  if (blockMove !== null) {
    return blockMove;
  }

  // Otherwise random move
  return getRandomMove(availableTiles);
}

// Hard AI: Tries to win, then block, then strategic moves
function getHardMove(tiles, availableTiles) {
  // 1. Try to win
  const winMove = findWinningMove(tiles, "O");
  if (winMove !== null) {
    return winMove;
  }

  // 2. Try to block player's winning move
  const blockMove = findWinningMove(tiles, "X");
  if (blockMove !== null) {
    return blockMove;
  }

  // 3. Take center if available
  if (tiles[4] === null) {
    return 4;
  }

  // 4. Take a corner if available
  const corners = [0, 2, 6, 8].filter((i) => tiles[i] === null);
  if (corners.length > 0) {
    return getRandomMove(corners);
  }

  // 5. Take any available edge
  return getRandomMove(availableTiles);
}

// Main AI function
export function getAIMove(tiles, difficulty = AI_DIFFICULTY.EASY) {
  const availableTiles = tiles
    .map((tile, index) => (tile === null ? index : null))
    .filter((val) => val !== null);

  if (availableTiles.length === 0) {
    return null;
  }

  switch (difficulty) {
    case AI_DIFFICULTY.EASY:
      return getEasyMove(availableTiles);
    case AI_DIFFICULTY.MEDIUM:
      return getMediumMove(tiles, availableTiles);
    case AI_DIFFICULTY.HARD:
      return getHardMove(tiles, availableTiles);
    default:
      return getEasyMove(availableTiles);
  }
}
