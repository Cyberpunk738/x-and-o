import { useEffect, useRef } from 'react';
import Cell from './Cell';
import './GameBoard.css';

function GameBoard({ gameState, winningCells, gameActive, isComputerThinking, onCellClick }) {
    const boardRef = useRef(null);

    useEffect(() => {
        if (winningCells.length > 0 && boardRef.current) {
            const cells = boardRef.current.querySelectorAll('.cell');
            const startCell = cells[winningCells[0]];
            const endCell = cells[winningCells[2]];

            if (startCell && endCell) {
                const rectBoard = boardRef.current.getBoundingClientRect();
                const startRect = startCell.getBoundingClientRect();
                const endRect = endCell.getBoundingClientRect();

                const startX = startRect.left + startRect.width / 2 - rectBoard.left;
                const startY = startRect.top + startRect.height / 2 - rectBoard.top;
                const endX = endRect.left + endRect.width / 2 - rectBoard.left;
                const endY = endRect.top + endRect.height / 2 - rectBoard.top;

                const dx = endX - startX;
                const dy = endY - startY;
                const length = Math.hypot(dx, dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                const line = document.createElement('div');
                line.className = 'win-line';
                line.style.left = startX + 'px';
                line.style.top = startY + 'px';
                line.style.width = length + 'px';
                line.style.transform = `translateY(-3px) rotate(${angle}deg)`;

                boardRef.current.appendChild(line);

                return () => {
                    if (line.parentNode) {
                        line.parentNode.removeChild(line);
                    }
                };
            }
        }
    }, [winningCells]);

    return (
        <div
            ref={boardRef}
            className={`game-board ${!gameActive || isComputerThinking ? 'disabled' : ''}`}
        >
            {gameState.map((value, index) => (
                <Cell
                    key={index}
                    index={index}
                    value={value}
                    isWinner={winningCells.includes(index)}
                    onClick={() => onCellClick(index)}
                />
            ))}
        </div>
    );
}

export default GameBoard;
