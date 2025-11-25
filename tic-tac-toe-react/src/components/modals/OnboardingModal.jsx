import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Modal from './Modal';

function OnboardingModal({ onClose, soundManager }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [, setHasSeenOnboarding] = useLocalStorage('hasSeenOnboarding', false);

    const slides = [
        {
            icon: 'fas fa-gamepad',
            title: 'Welcome to Tic Tac Toe!',
            description: 'Experience the classic game with a modern twist. Play against our smart AI and climb the leaderboard.'
        },
        {
            icon: 'fas fa-trophy',
            title: 'Earn & Upgrade',
            description: 'Win games to earn coins and gems. Use them to unlock cool themes and power-ups in the shop.'
        },
        {
            icon: 'fas fa-volume-up',
            title: 'Sound Effects',
            description: 'Enable sound effects for an immersive experience. Toggle them anytime in settings.'
        },
        {
            icon: 'fas fa-chart-line',
            title: 'Compete',
            description: 'Track your stats and aim for the highest win rate!'
        }
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            setHasSeenOnboarding(true);
            soundManager.ensureAudioContext();
            soundManager.playButtonClick();
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} className="onboarding-modal">
            <div className="onboarding-content">
                <div className="onboarding-slides">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            <div className="slide-icon">
                                <i className={slide.icon}></i>
                            </div>
                            <h2>{slide.title}</h2>
                            <p>{slide.description}</p>
                        </div>
                    ))}
                </div>
                <div className="onboarding-controls">
                    <div className="slide-dots">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                            ></div>
                        ))}
                    </div>
                    <button className="btn-primary" onClick={handleNext}>
                        {currentSlide < slides.length - 1 ? 'Next' : 'Start Playing'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default OnboardingModal;
