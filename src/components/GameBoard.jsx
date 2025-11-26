import Cell from './Cell';
import './GameBoard.css';

const GameBoard = ({ gameState, onCellClick, winningCells, disabled, boardSize = '3x3' }) => {
    return (
        <div className={`game-board size-${boardSize} ${disabled ? 'disabled' : ''}`}>
            {winningCells.length > 0 && <div className="win-line" />}
            {gameState.map((cell, index) => (
                <Cell
                    key={index}
                    value={cell}
                    onClick={() => onCellClick(index)}
                    disabled={disabled || cell !== ''}
                    isWinning={winningCells.includes(index)}
                />
            ))}
        </div>
    );
};

export default GameBoard;
