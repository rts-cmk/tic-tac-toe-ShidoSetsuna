import "./reset.scss";

export default function Reset({ onReset }) {
  return (
    <button className="reset-button" onClick={onReset}>
      Reset Game
    </button>
  );
}
