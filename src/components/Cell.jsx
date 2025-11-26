import './Cell.css';

const Cell = ({ value, onClick, disabled, isWinning }) => {
    return (
        <button
            className={`cell ${value ? value.toLowerCase() : ''} ${isWinning ? 'winning' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {value}
        </button>
    );
};

export default Cell;
