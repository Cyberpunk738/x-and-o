import React, { useState } from 'react';
import './GameSetupModal.css';

const GameSetupModal = ({ onClose, onStartGame, soundManager }) => {
    const [selectedSize, setSelectedSize] = useState('3x3');

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        soundManager?.playButtonClick();
    };

    const handleDifficultySelect = (difficulty) => {
        soundManager?.playButtonClick();
        onStartGame(difficulty, selectedSize);
    };

    return (
        <div className="game-setup-overlay" onClick={onClose}>
            <div className="game-setup-card" onClick={(e) => e.stopPropagation()}>

                <div>
                    <div className="setup-section-title">Board Size</div>
                    <div className="board-size-options">
                        {['3 x 3', '4 x 4', '5 x 5'].map((sizeLabel) => {
                            const sizeValue = sizeLabel.replace(/\s/g, '');
                            return (
                                <button
                                    key={sizeValue}
                                    className={`size-btn ${selectedSize === sizeValue ? 'active' : ''}`}
                                    onClick={() => handleSizeSelect(sizeValue)}
                                >
                                    {sizeLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="difficulty-options">
                    <button
                        className="diff-btn easy"
                        onClick={() => handleDifficultySelect('easy')}
                    >
                        Easy
                    </button>
                    <button
                        className="diff-btn medium"
                        onClick={() => handleDifficultySelect('medium')}
                    >
                        Medium
                    </button>
                    <button
                        className="diff-btn hard"
                        onClick={() => handleDifficultySelect('hard')}
                    >
                        Hard
                    </button>
                    <button
                        className="diff-btn impossible"
                        onClick={() => handleDifficultySelect('impossible')}
                    >
                        Impossible
                    </button>

                    <button
                        className="diff-btn cancel-btn"
                        onClick={() => {
                            soundManager?.playButtonClick();
                            onClose();
                        }}
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GameSetupModal;
