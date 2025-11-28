import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSoundManager } from '../hooks/useSoundManager';
import { checkGameStatus } from '../utils/gameLogic';
import { easyAIMove, mediumAIMove, hardAIMove, impossibleAIMove } from '../utils/aiLogic';
import Preloader from './Preloader';
import HUD from './HUD';
import GameContainer from './GameContainer';
import Home from './Home';
import OnboardingModal from './modals/OnboardingModal';
import SettingsModal from './modals/SettingsModal';
import ShopModal from './modals/ShopModal';
import LeaderboardModal from './modals/LeaderboardModal';
import NotificationModal from './modals/NotificationModal';
import GameSetupModal from './modals/GameSetupModal';
import '../styles/App.css';

function App() {
    // Game state
    const [view, setView] = useState('home'); // 'home' | 'game'
    const [gameState, setGameState] = useState(['', '', '', '', '', '', '', '', '']);
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [gameActive, setGameActive] = useState(true);
    const [isComputerThinking, setIsComputerThinking] = useState(false);
    const [difficulty, setDifficulty] = useState('easy');
    const [boardSize, setBoardSize] = useState('3x3');
    const [winningCells, setWinningCells] = useState([]);

    // Resources
    const [coins, setCoins] = useLocalStorage('ticTacToeCoins', 0);
    const [energy, setEnergy] = useLocalStorage('ticTacToeEnergy', 20);
    const [maxEnergy] = useLocalStorage('ticTacToeMaxEnergy', 20);
    const [gems, setGems] = useLocalStorage('ticTacToeGems', 0);

    // Settings
    const [soundEnabled, setSoundEnabled] = useLocalStorage('ticTacToeSoundEnabled', true);
    const [theme, setTheme] = useLocalStorage('ticTacToeTheme', 'classic');
    const [neonUnlocked] = useLocalStorage('ticTacToeNeonUnlocked', false);

    // Leaderboard
    const [leaderboard, setLeaderboard] = useLocalStorage('ticTacToeLeaderboard', {
        wins: 0,
        losses: 0,
        draws: 0
    });

    // Modals
    const [activeModal, setActiveModal] = useState(null);
    const [hasSeenOnboarding] = useLocalStorage('hasSeenOnboarding', false);
    const [showPreloader, setShowPreloader] = useState(true);
    const [notificationData, setNotificationData] = useState(null);

    // Sound manager
    const soundManager = useSoundManager(soundEnabled);

    const humanPlayer = 'X';
    const computerPlayer = 'O';

    // Apply theme
    useEffect(() => {
        if (theme === 'neon') {
            document.body.classList.add('theme-neon');
        } else {
            document.body.classList.remove('theme-neon');
        }
    }, [theme]);

    // Hide preloader
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPreloader(false);
            if (!hasSeenOnboarding) {
                setActiveModal('onboarding');
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [hasSeenOnboarding]);

    // Computer move logic
    const makeComputerMove = useCallback(() => {
        if (!gameActive || isComputerThinking) return;

        setIsComputerThinking(true);
        const delay = difficulty === 'easy' ? 300 : difficulty === 'medium' ? 500 : 600;

        setTimeout(() => {
            let move = -1;

            // TODO: Update AI logic for larger boards when implemented
            // AI Logic for all board sizes
            switch (difficulty) {
                case 'easy':
                    move = easyAIMove(gameState);
                    break;
                case 'medium':
                    move = mediumAIMove(gameState, computerPlayer, humanPlayer);
                    break;
                case 'hard':
                    move = hardAIMove(gameState, computerPlayer, humanPlayer);
                    break;
                case 'impossible':
                    move = impossibleAIMove(gameState, computerPlayer, humanPlayer);
                    break;
                default:
                    move = easyAIMove(gameState);
            }

            if (move !== -1 && gameState[move] === '') {
                const newGameState = [...gameState];
                newGameState[move] = computerPlayer;
                setGameState(newGameState);
                soundManager.playClick(computerPlayer);

                const result = checkGameStatus(newGameState);

                if (result.status === 'win') {
                    setWinningCells(result.cells);
                    setGameActive(false);
                    setLeaderboard(prev => ({ ...prev, losses: prev.losses + 1 }));
                    setCoins(prev => prev + 1);
                    setTimeout(() => {
                        soundManager.playTone(300, 0.3, 'sawtooth', 0.2);
                        setNotificationData({
                            type: 'loss',
                            icon: 'fas fa-robot',
                            title: 'Computer Wins!',
                            message: 'Better luck next time!'
                        });
                        setActiveModal('notification');
                    }, 500);
                } else if (result.status === 'draw') {
                    setGameActive(false);
                    setLeaderboard(prev => ({ ...prev, draws: prev.draws + 1 }));
                    setCoins(prev => prev + 3);
                    setGems(prev => prev + 1);
                    setTimeout(() => {
                        soundManager.playDraw();
                        setNotificationData({
                            type: 'draw',
                            icon: 'fas fa-handshake',
                            title: "It's a Draw!",
                            message: 'Well played by both sides!'
                        });
                        setActiveModal('notification');
                    }, 500);
                } else {
                    setCurrentPlayer(humanPlayer);
                }
            }

            setIsComputerThinking(false);
        }, delay);
    }, [gameState, gameActive, isComputerThinking, difficulty, boardSize, soundManager, setLeaderboard, setCoins, setGems]);

    // Trigger computer move when it's computer's turn
    useEffect(() => {
        if (currentPlayer === computerPlayer && gameActive && !isComputerThinking) {
            makeComputerMove();
        }
    }, [currentPlayer, gameActive, isComputerThinking, makeComputerMove, computerPlayer]);

    // Handle cell click
    const handleCellClick = (index) => {
        if (!gameActive || currentPlayer !== humanPlayer || isComputerThinking) {
            if (gameState[index] !== '') {
                soundManager.playError();
            }
            return;
        }

        if (gameState[index] !== '') {
            soundManager.playError();
            return;
        }

        const newGameState = [...gameState];
        newGameState[index] = humanPlayer;
        setGameState(newGameState);
        soundManager.playClick(humanPlayer);
        setCoins(prev => prev + 1);
        setEnergy(prev => Math.max(0, prev - 1));

        const result = checkGameStatus(newGameState);

        if (result.status === 'win') {
            setWinningCells(result.cells);
            setGameActive(false);
            setLeaderboard(prev => ({ ...prev, wins: prev.wins + 1 }));
            setCoins(prev => prev + 10);
            setGems(prev => prev + 1);
            setTimeout(() => {
                soundManager.playWin();
                setNotificationData({
                    type: 'win',
                    icon: 'fas fa-trophy',
                    title: 'Congratulations!',
                    message: 'You won the game!'
                });
                setActiveModal('notification');
            }, 500);
        } else if (result.status === 'draw') {
            setGameActive(false);
            setLeaderboard(prev => ({ ...prev, draws: prev.draws + 1 }));
            setCoins(prev => prev + 3);
            setGems(prev => prev + 1);
            setTimeout(() => {
                soundManager.playDraw();
                setNotificationData({
                    type: 'draw',
                    icon: 'fas fa-handshake',
                    title: "It's a Draw!",
                    message: 'Well played by both sides!'
                });
                setActiveModal('notification');
            }, 500);
        } else {
            setCurrentPlayer(computerPlayer);
        }
    };

    // Reset game
    const resetGame = () => {
        const size = boardSize === '3x3' ? 9 : boardSize === '4x4' ? 16 : 25;
        setGameState(Array(size).fill(''));
        setCurrentPlayer('X');
        setGameActive(true);
        setIsComputerThinking(false);
        setWinningCells([]);
        setActiveModal(null);
        soundManager.playButtonClick();
    };

    // Handle difficulty change
    const handleDifficultyChange = (newDifficulty) => {
        setDifficulty(newDifficulty);
        soundManager.playButtonClick();
        resetGame();
    };

    // Navigation Handlers
    const handlePlayHuman = () => {
        soundManager.playButtonClick();
        setNotificationData({
            type: 'info',
            icon: 'fas fa-user-friends',
            title: 'Coming Soon',
            message: 'Multiplayer mode is currently under development!'
        });
        setActiveModal('notification');
    };

    const handlePlayAI = () => {
        soundManager.playButtonClick();
        setActiveModal('gameSetup');
    };

    const handleStartGame = (selectedDifficulty, selectedSize) => {
        setDifficulty(selectedDifficulty);
        setBoardSize(selectedSize);

        const size = selectedSize === '3x3' ? 9 : selectedSize === '4x4' ? 16 : 25;
        setGameState(Array(size).fill(''));

        setView('game');
        setActiveModal(null);
        setGameActive(true);
        setCurrentPlayer('X');
        setWinningCells([]);
    };

    const goHome = () => {
        soundManager.playButtonClick();
        setView('home');
    };

    return (
        <>
            {showPreloader && <Preloader />}

            {view === 'home' ? (
                <Home
                    coins={coins}
                    energy={energy}
                    gems={gems}
                    onPlayAI={handlePlayAI}
                    onPlayHuman={handlePlayHuman}
                    onOpenShop={() => {
                        setActiveModal('shop');
                        soundManager.playButtonClick();
                    }}
                    onOpenLeaderboard={() => {
                        setActiveModal('leaderboard');
                        soundManager.playButtonClick();
                    }}
                    onOpenSettings={() => {
                        setActiveModal('settings');
                        soundManager.playButtonClick();
                    }}
                    onOpenProfile={() => {
                        soundManager.playButtonClick();
                    }}
                />
            ) : (
                <>
                    <HUD
                        coins={coins}
                        energy={energy}
                        gems={gems}
                        onOpenShop={() => {
                            setActiveModal('shop');
                            soundManager.playButtonClick();
                        }}
                    />

                    <GameContainer
                        gameState={gameState}
                        currentPlayer={currentPlayer}
                        gameActive={gameActive}
                        isComputerThinking={isComputerThinking}
                        difficulty={difficulty}
                        boardSize={boardSize}
                        winningCells={winningCells}
                        onCellClick={handleCellClick}
                        onDifficultyChange={handleDifficultyChange}
                        onRestart={resetGame}
                        onOpenSettings={() => {
                            setActiveModal('settings');
                            soundManager.playButtonClick();
                        }}
                        onOpenLeaderboard={() => {
                            setActiveModal('leaderboard');
                            soundManager.playButtonClick();
                        }}
                    />

                    <button
                        className="back-home-btn"
                        onClick={goHome}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            left: '20px',
                            padding: '10px 20px',
                            background: 'rgba(20, 20, 35, 0.8)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-full)',
                            color: 'var(--text-dim)',
                            zIndex: 100,
                            cursor: 'pointer'
                        }}
                    >
                        <i className="fas fa-arrow-left"></i> Home
                    </button>
                </>
            )}

            {activeModal === 'gameSetup' && (
                <GameSetupModal
                    onClose={() => setActiveModal(null)}
                    onStartGame={handleStartGame}
                    soundManager={soundManager}
                />
            )}

            {activeModal === 'onboarding' && (
                <OnboardingModal
                    onClose={() => setActiveModal(null)}
                    soundManager={soundManager}
                />
            )}

            {activeModal === 'settings' && (
                <SettingsModal
                    soundEnabled={soundEnabled}
                    theme={theme}
                    neonUnlocked={neonUnlocked}
                    onSoundToggle={(enabled) => setSoundEnabled(enabled)}
                    onThemeToggle={(newTheme) => setTheme(newTheme)}
                    onClose={() => {
                        setActiveModal(null);
                        soundManager.playButtonClick();
                    }}
                    soundManager={soundManager}
                />
            )}

            {activeModal === 'shop' && (
                <ShopModal
                    coins={coins}
                    onBuyEnergy={() => {
                        if (coins >= 5) {
                            setCoins(prev => prev - 5);
                            setEnergy(prev => Math.min(maxEnergy, prev + 10));
                            soundManager.playCoin();
                        } else {
                            alert('Not enough coins!');
                            soundManager.playError();
                        }
                    }}
                    onBuyGem={() => {
                        if (coins >= 10) {
                            setCoins(prev => prev - 10);
                            setGems(prev => prev + 1);
                            soundManager.playCoin();
                        } else {
                            alert('Not enough coins!');
                            soundManager.playError();
                        }
                    }}
                    onUnlockNeon={() => {
                        if (coins >= 30) {
                            setCoins(prev => prev - 30);
                            localStorage.setItem('ticTacToeNeonUnlocked', 'true');
                            soundManager.playCoin();
                            alert('Neon theme unlocked! Enable it in Settings.');
                        } else {
                            alert('Not enough coins!');
                            soundManager.playError();
                        }
                    }}
                    neonUnlocked={neonUnlocked}
                    onClose={() => {
                        setActiveModal(null);
                        soundManager.playButtonClick();
                    }}
                    soundManager={soundManager}
                />
            )}

            {activeModal === 'leaderboard' && (
                <LeaderboardModal
                    leaderboard={leaderboard}
                    onResetStats={() => {
                        if (window.confirm('Are you sure you want to reset all statistics?')) {
                            setLeaderboard({ wins: 0, losses: 0, draws: 0 });
                        }
                    }}
                    onClose={() => {
                        setActiveModal(null);
                        soundManager.playButtonClick();
                    }}
                    soundManager={soundManager}
                />
            )}

            {activeModal === 'notification' && notificationData && (
                <NotificationModal
                    data={notificationData}
                    onClose={() => {
                        setActiveModal(null);
                        if (notificationData.type === 'win' || notificationData.type === 'loss' || notificationData.type === 'draw') {
                            resetGame();
                        }
                    }}
                />
            )}
        </>
    );
}

export default App;
