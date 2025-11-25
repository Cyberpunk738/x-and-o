import GameBoard from './GameBoard';
import DifficultySelector from './DifficultySelector';
import './GameContainer.css';

function GameContainer({
    gameState,
    currentPlayer,
    gameActive,
    isComputerThinking,
    difficulty,
    winningCells,
    onCellClick,
    onDifficultyChange,
    onRestart,
    onOpenSettings,
    onOpenLeaderboard
}) {
    const getStatusText = () => {
        if (!gameActive) {
            return "Game Over";
        }
        if (isComputerThinking) {
            return "Computer's Turn";
        }
        return currentPlayer === 'X' ? 'Your Turn' : "Computer's Turn";
    };

    return (
        <div className="container">
            <div className="header-controls">
                <h1>Tic Tac Toe</h1>
                <div className="header-buttons">
                    <button className="icon-btn" onClick={onOpenLeaderboard} title="Leaderboard">
                        <i className="fas fa-trophy"></i>
                    </button>
                    <button className="icon-btn" onClick={onOpenSettings} title="Settings">
                        <i className="fas fa-cog"></i>
                    </button>
                </div>
            </div>

            <p className="subtitle">
                You are <span className="player-x">X</span> | Computer is <span className="player-o">O</span>
            </p>

            <DifficultySelector
                difficulty={difficulty}
                onDifficultyChange={onDifficultyChange}
            />

            <div className={`status ${isComputerThinking ? 'thinking' : ''}`}>
                {getStatusText()}
            </div>

            <GameBoard
                gameState={gameState}
                winningCells={winningCells}
                gameActive={gameActive}
                isComputerThinking={isComputerThinking}
                onCellClick={onCellClick}
            />

            <div className="game-footer">
                <button className="btn-restart" onClick={onRestart}>
                    <i className="fas fa-redo"></i>
                    Restart Game
                </button>
            </div>
        </div>
    );
}

export default GameContainer;
