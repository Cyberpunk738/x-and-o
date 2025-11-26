import { useState } from 'react';
import Modal from './Modal';

const OnboardingModal = ({ onClose, soundManager }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            icon: 'fas fa-gamepad',
            title: 'WELCOME PLAYER',
            text: 'Experience the classic game of Tic-Tac-Toe like never before with our new Neon Cyberpunk edition.'
        },
        {
            icon: 'fas fa-bolt',
            title: 'MANAGE ENERGY',
            text: 'Each move costs Energy. Win games to earn Coins and buy more Energy in the Shop.'
        },
        {
            icon: 'fas fa-trophy',
            title: 'CLIMB RANKS',
            text: 'Compete against our AI, track your stats, and become the ultimate champion.'
        }
    ];

    const nextSlide = () => {
        soundManager.playButtonClick();
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            localStorage.setItem('hasSeenOnboarding', 'true');
            onClose();
        }
    };

    return (
        <Modal title="TUTORIAL" onClose={onClose}>
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
                            <p>{slide.text}</p>
                        </div>
                    ))}
                </div>

                <div className="slide-dots">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        ></div>
                    ))}
                </div>

                <div className="onboarding-controls">
                    <button className="btn-primary" onClick={nextSlide}>
                        {currentSlide === slides.length - 1 ? 'START GAME' : 'NEXT'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default OnboardingModal;
