import "./tile.scss";

export default function Tile({ value, onClick, playerTurn }) {
  let tileClass = "tile";

  if (value === "X") {
    tileClass += " tile-x";
  } else if (value === "O") {
    tileClass += " tile-o";
  } else if (playerTurn === "X") {
    tileClass += " tile-hover-x";
  }

  return (
    <div className={tileClass} onClick={onClick}>
      {value}
    </div>
  );
}
