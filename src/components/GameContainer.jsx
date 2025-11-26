import GameBoard from './GameBoard';
import DifficultySelector from './DifficultySelector';
import './GameContainer.css';

const GameContainer = ({
    gameState,
    currentPlayer,
    gameActive,
    isComputerThinking,
    difficulty,
    boardSize,
    winningCells,
    onCellClick,
    onDifficultyChange,
    onRestart,
    onOpenSettings,
    onOpenLeaderboard
}) => {
    return (
        <div className="game-arena">
            {/* Header / Top Bar */}
            <div className="arena-header">
                <div className="mode-badge">
                    MODE: {difficulty.toUpperCase()} | {boardSize}
                </div>
            </div>

            {/* Main Content: 3-Column Layout */}
            <div className="arena-content">

                {/* Left Column: Player Profile */}
                <div className={`player-card player-x ${currentPlayer === 'X' ? 'active-turn' : ''}`}>
                    {currentPlayer === 'X' && !gameActive && winningCells.length === 0 && (
                        <div className="turn-indicator"> &gt; Your Turn</div>
                    )}
                    <div className="avatar-container">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="Player"
                            className="player-avatar"
                        />
                        <div className="player-mark">X</div>
                    </div>
                    <div className="player-name">You</div>
                </div>

                {/* Center Column: Game Board */}
                <div className="board-section">
                    <GameBoard
                        gameState={gameState}
                        onCellClick={onCellClick}
                        winningCells={winningCells}
                        disabled={!gameActive || isComputerThinking}
                        boardSize={boardSize}
                    />

                    <div className="game-controls">
                        <button className="btn-restart" onClick={onRestart}>
                            <i className="fas fa-redo"></i>
                        </button>
                    </div>
                </div>

                {/* Right Column: AI Profile */}
                <div className={`player-card player-o ${currentPlayer === 'O' ? 'active-turn' : ''}`}>
                    {isComputerThinking && (
                        <div className="turn-indicator">Thinking...</div>
                    )}
                    <div className="avatar-container">
                        <img
                            src="https://api.dicebear.com/7.x/bottts/svg?seed=Robot"
                            alt="AI"
                            className="player-avatar"
                        />
                        <div className="player-mark">O</div>
                    </div>
                    <div className="player-name">AI Bot</div>
                </div>

            </div>
        </div>
    );
};

export default GameContainer;
