import './DifficultySelector.css';

const DifficultySelector = ({ difficulty, onChange }) => {
    return (
        <div className="difficulty-selector">
            <label>AI DIFFICULTY</label>
            <div className="difficulty-buttons">
                {['easy', 'medium', 'hard'].map((level) => (
                    <button
                        key={level}
                        className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                        onClick={() => onChange(level)}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DifficultySelector;
