import './DifficultySelector.css';

function DifficultySelector({ difficulty, onDifficultyChange }) {
    return (
        <div className="difficulty-selector">
            <label>Difficulty:</label>
            <div className="difficulty-buttons">
                <button
                    className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                    onClick={() => onDifficultyChange('easy')}
                >
                    Easy
                </button>
                <button
                    className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                    onClick={() => onDifficultyChange('medium')}
                >
                    Medium
                </button>
                <button
                    className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                    onClick={() => onDifficultyChange('hard')}
                >
                    Hard
                </button>
            </div>
        </div>
    );
}

export default DifficultySelector;
