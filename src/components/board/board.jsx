import Tile from "../tile/tile.jsx";
import Strike from "../strike/strike.jsx";
import "./board.scss";

export default function Board({ tiles, onTileClick, playerTurn, strikeClass }) {
  return (
    <div className="board">
      {tiles.map((tile, index) => (
        <Tile
          key={index}
          value={tile}
          onClick={() => onTileClick(index)}
          playerTurn={playerTurn}
        />
      ))}
      <Strike strikeClass={strikeClass} />
    </div>
  );
}
