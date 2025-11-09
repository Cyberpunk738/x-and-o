// Tic Tac Toe Game - Professional Implementation
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const gameBoard = document.getElementById('gameBoard');
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationTitle = document.getElementById('notificationTitle');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationBtn = document.getElementById('notificationBtn');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const soundToggleBtn = document.getElementById('soundToggle');
    const leaderboardToggle = document.getElementById('leaderboardToggle');
    const leaderboard = document.getElementById('leaderboard');
    const closeLeaderboard = document.getElementById('closeLeaderboard');
    const resetStatsBtn = document.getElementById('resetStats');
    const statWins = document.getElementById('statWins');
    const statLosses = document.getElementById('statLosses');
    const statDraws = document.getElementById('statDraws');
    const statWinRate = document.getElementById('statWinRate');
    const markSelect = document.getElementById('markSelect');
    const chooseXBtn = document.getElementById('chooseX');
    const chooseOBtn = document.getElementById('chooseO');
    const playerXSpan = document.querySelector('.player-x');
    const playerOSpan = document.querySelector('.player-o');
    
    // Game State
    let gameActive = true;
    let currentPlayer = 'X'; // Human is X, Computer is O
    let humanPlayer = 'X';
    let computerPlayer = 'O';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let isComputerThinking = false;
    let difficulty = 'easy'; // 'easy', 'medium', or 'hard'
    let soundEnabled = true; // Sound enabled by default

    // Leaderboard Data
    let leaderboardData = {
        wins: 0,
        losses: 0,
        draws: 0
    };

    // Sound Manager using Web Audio API
    const SoundManager = {
        audioContext: null,
        audioInitialized: false,
        
        init() {
            // AudioContext will be initialized on first user interaction
            // This is required by browser autoplay policies
            return true;
        },
        
        ensureAudioContext() {
            // Initialize AudioContext on first user interaction
            if (!this.audioContext) {
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.audioInitialized = true;
                } catch (e) {
                    console.warn('Web Audio API not supported');
                    return false;
                }
            }
            
            // Resume AudioContext if it's suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(e => {
                    console.warn('Could not resume audio context:', e);
                });
            }
            
            return true;
        },
        
        // Generate a tone
        playTone(frequency, duration, type = 'sine', volume = 0.3) {
            if (!soundEnabled) return;
            
            // Initialize audio context on first use (user interaction required)
            if (!this.ensureAudioContext()) return;
            
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + duration);
            } catch (e) {
                console.warn('Error playing sound:', e);
            }
        },
        
        // Play a click sound (for placing marks)
        playClick(player = 'X') {
            if (player === 'X') {
                // Higher pitch for X
                this.playTone(600, 0.1, 'sine', 0.2);
            } else {
                // Lower pitch for O
                this.playTone(400, 0.1, 'sine', 0.2);
            }
        },
        
        // Play win sound
        playWin() {
            // Play a celebratory sequence
            this.playTone(523, 0.1, 'sine', 0.3); // C
            setTimeout(() => {
                this.playTone(659, 0.1, 'sine', 0.3); // E
            }, 100);
            setTimeout(() => {
                this.playTone(784, 0.2, 'sine', 0.3); // G
            }, 200);
        },
        
        // Play draw sound
        playDraw() {
            // Neutral sound
            this.playTone(440, 0.3, 'sine', 0.2);
            setTimeout(() => {
                this.playTone(392, 0.3, 'sine', 0.2);
            }, 150);
        },
        
        // Play button click sound
        playButtonClick() {
            this.playTone(300, 0.05, 'square', 0.15);
        },
        
        // Play notification sound
        playNotification() {
            this.playTone(800, 0.15, 'sine', 0.25);
            setTimeout(() => {
                this.playTone(600, 0.15, 'sine', 0.25);
            }, 100);
        },
        
        // Play error/warning sound
        playError() {
            this.playTone(200, 0.2, 'sawtooth', 0.2);
        }
    };

    // Initialize sound manager
    SoundManager.init();

    // Load leaderboard from localStorage
    function loadLeaderboard() {
        const saved = localStorage.getItem('ticTacToeLeaderboard');
        if (saved) {
            try {
                leaderboardData = JSON.parse(saved);
            } catch (e) {
                console.warn('Error loading leaderboard:', e);
            }
        }
        updateLeaderboardDisplay();
    }

    // Save leaderboard to localStorage
    function saveLeaderboard() {
        localStorage.setItem('ticTacToeLeaderboard', JSON.stringify(leaderboardData));
        updateLeaderboardDisplay();
    }

    // Update leaderboard display
    function updateLeaderboardDisplay() {
        if (statWins && statLosses && statDraws && statWinRate) {
            statWins.textContent = leaderboardData.wins;
            statLosses.textContent = leaderboardData.losses;
            statDraws.textContent = leaderboardData.draws;
            
            const totalGames = leaderboardData.wins + leaderboardData.losses + leaderboardData.draws;
            if (totalGames > 0) {
                const winRate = Math.round((leaderboardData.wins / totalGames) * 100);
                statWinRate.textContent = winRate + '%';
            } else {
                statWinRate.textContent = '0%';
            }
        }
    }

    // Update leaderboard based on game result
    function updateLeaderboard(result) {
        if (result === 'win') {
            leaderboardData.wins++;
        } else if (result === 'loss') {
            leaderboardData.losses++;
        } else if (result === 'draw') {
            leaderboardData.draws++;
        }
        saveLeaderboard();
    }

    // Reset leaderboard
    function resetLeaderboard() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            leaderboardData = { wins: 0, losses: 0, draws: 0 };
            saveLeaderboard();
        }
    }

    // Show leaderboard
    function showLeaderboard() {
        if (leaderboard) {
            leaderboard.classList.remove('hidden');
            SoundManager.ensureAudioContext();
            SoundManager.playButtonClick();
        }
    }

    // Hide leaderboard
    function hideLeaderboard() {
        if (leaderboard) {
            leaderboard.classList.add('hidden');
            SoundManager.playButtonClick();
        }
    }
    
    // Winning Combinations
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Place a mark on the board
    function placeMark(cell, cellIndex, player) {
        gameState[cellIndex] = player;
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        
        // Add glow effect
        cell.classList.add('glow');
        
        // Remove glow after animation completes (800ms for the animation)
        setTimeout(() => {
            cell.classList.remove('glow');
        }, 800);
        
        // Play click sound
        SoundManager.playClick(player);
    }

    // Check for winner or draw
    function checkGameStatus() {
        // Check for winner
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return { status: 'win', player: gameState[a], cells: [a, b, c] };
            }
        }
        
        // Check for draw
        if (!gameState.includes('')) {
            return { status: 'draw' };
        }
        
        return { status: 'continue' };
    }

    // Highlight winning cells
    function highlightWinningCells(winningCells) {
        winningCells.forEach(index => {
            cells[index].classList.add('winner');
        });
    }

    // Show notification modal
    function showNotification(type, player = null) {
        notification.classList.remove('hidden');
        
        if (type === 'win') {
            if (player === humanPlayer) {
                notificationIcon.innerHTML = '<i class="fas fa-trophy"></i>';
                notificationTitle.textContent = 'Congratulations!';
                notificationMessage.textContent = 'You won the game!';
                // Play celebratory win sound
                SoundManager.playWin();
                // Update leaderboard
                updateLeaderboard('win');
            } else {
                notificationIcon.innerHTML = '<i class="fas fa-robot"></i>';
                notificationTitle.textContent = 'Computer Wins!';
                notificationMessage.textContent = 'Better luck next time!';
                // Play a different sound for computer win (lower tone)
                SoundManager.playTone(300, 0.3, 'sawtooth', 0.2);
                // Update leaderboard
                updateLeaderboard('loss');
            }
        } else if (type === 'draw') {
            notificationIcon.innerHTML = '<i class="fas fa-handshake"></i>';
            notificationTitle.textContent = "It's a Draw!";
            notificationMessage.textContent = 'Well played by both sides!';
            // Play draw sound
            SoundManager.playDraw();
            // Update leaderboard
            updateLeaderboard('draw');
        }
    }

    // Hide notification modal
    function hideNotification() {
        notification.classList.add('hidden');
    }

    // Get available moves
    function getAvailableMoves(board) {
        const moves = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                moves.push(i);
            }
        }
        return moves;
    }

    // Check if a move would result in a win
    function wouldWin(board, player, move) {
        const testBoard = [...board];
        testBoard[move] = player;
        
        // Check for winner directly without modifying global state
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (testBoard[a] && testBoard[a] === testBoard[b] && testBoard[a] === testBoard[c]) {
                return testBoard[a] === player;
            }
        }
        return false;
    }

    // Easy AI: Random moves
    function easyAIMove(board) {
        const availableMoves = getAvailableMoves(board);
        if (availableMoves.length === 0) return -1;
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
    }

    // Medium AI: Blocks wins, tries to win, but makes occasional mistakes
    function mediumAIMove(board) {
        const availableMoves = getAvailableMoves(board);
        if (availableMoves.length === 0) return -1;

        // 70% chance to play optimally, 30% chance to make a mistake
        const shouldPlayOptimally = Math.random() < 0.7;

        if (shouldPlayOptimally) {
            // Try to win
            for (let move of availableMoves) {
                if (wouldWin(board, computerPlayer, move)) {
                    return move;
                }
            }

            // Block player from winning
            for (let move of availableMoves) {
                if (wouldWin(board, humanPlayer, move)) {
                    return move;
                }
            }

            // Take center if available
            if (board[4] === '') {
                return 4;
            }

            // Take a corner
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(idx => board[idx] === '');
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }

            // Take any available move
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        } else {
            // Make a random move (mistake)
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    }

    // Minimax Algorithm for Hard AI (Perfect play)
    function minimax(board, depth, isMaximizing) {
        // Create a temporary game state for evaluation
        const tempState = gameState;
        gameState = board;
        const result = checkGameStatus();
        gameState = tempState;
        
        if (result.status === 'win') {
            if (result.player === computerPlayer) return { score: 10 - depth };
            if (result.player === humanPlayer) return { score: depth - 10 };
        }
        if (result.status === 'draw') return { score: 0 };

        if (isMaximizing) {
            let bestScore = -Infinity;
            let bestMove = -1;
            
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = computerPlayer;
                    let score = minimax(board, depth + 1, false).score;
                    board[i] = '';
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            return { score: bestScore, index: bestMove };
        } else {
            let bestScore = Infinity;
            let bestMove = -1;
            
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = humanPlayer;
                    let score = minimax(board, depth + 1, true).score;
                    board[i] = '';
                    
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            return { score: bestScore, index: bestMove };
        }
    }

    // Hard AI: Perfect play using minimax
    function hardAIMove(board) {
        return minimax([...board], 0, true).index;
    }

    // Computer makes a move based on difficulty
    function computerMove() {
        if (!gameActive || isComputerThinking) return;
        
        isComputerThinking = true;
        gameBoard.classList.add('disabled');
        statusDisplay.textContent = "Computer's Turn...";
        
        // Delay for better UX (shorter delay for easy mode)
        const delay = difficulty === 'easy' ? 300 : difficulty === 'medium' ? 500 : 600;
        
        setTimeout(() => {
            let move = -1;
            
            // Choose AI strategy based on difficulty
            switch (difficulty) {
                case 'easy':
                    move = easyAIMove(gameState);
                    break;
                case 'medium':
                    move = mediumAIMove(gameState);
                    break;
                case 'hard':
                    move = hardAIMove(gameState);
                    break;
            }
            
            if (move !== -1 && gameState[move] === '') {
                const cell = cells[move];
                placeMark(cell, move, computerPlayer);
                
                const result = checkGameStatus();
                
                if (result.status === 'win') {
                    highlightWinningCells(result.cells);
                    gameActive = false;
                    gameBoard.classList.add('disabled');
                    statusDisplay.textContent = 'Computer Wins!';
                    setTimeout(() => showNotification('win', result.player), 500);
                } else if (result.status === 'draw') {
                    gameActive = false;
                    gameBoard.classList.add('disabled');
                    statusDisplay.textContent = "It's a Draw!";
                    setTimeout(() => showNotification('draw'), 500);
                } else {
                    currentPlayer = humanPlayer;
                    statusDisplay.textContent = 'Your Turn';
                    gameBoard.classList.remove('disabled');
                }
            }
            
            isComputerThinking = false;
        }, delay);
    }

    // Handle player's move
    function handleCellClick(e) {
        if (!gameActive || currentPlayer !== humanPlayer || isComputerThinking) return;
        
        const clickedCell = e.target;
        if (!clickedCell.classList.contains('cell')) return;
        
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '') {
            // Play error sound if clicking on occupied cell
            SoundManager.playError();
            return;
        }
        
        // Player makes move
        placeMark(clickedCell, clickedCellIndex, humanPlayer);
        
        const result = checkGameStatus();
        
        if (result.status === 'win') {
            highlightWinningCells(result.cells);
            gameActive = false;
            gameBoard.classList.add('disabled');
            statusDisplay.textContent = 'You Win!';
            setTimeout(() => showNotification('win', result.player), 500);
        } else if (result.status === 'draw') {
            gameActive = false;
            gameBoard.classList.add('disabled');
            statusDisplay.textContent = "It's a Draw!";
            setTimeout(() => showNotification('draw'), 500);
        } else {
            currentPlayer = computerPlayer;
            computerMove();
        }
    }

    // Reset the game
    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        isComputerThinking = false;
        hideNotification();
        
        // Play button click sound
        SoundManager.playButtonClick();
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner', 'glow');
        });
        
        if (currentPlayer === humanPlayer) {
            statusDisplay.textContent = 'Your Turn';
            gameBoard.classList.remove('disabled');
        } else {
            statusDisplay.textContent = "Computer's Turn...";
            gameBoard.classList.add('disabled');
            setTimeout(computerMove, 400);
        }
    }

    // Handle difficulty selection
    function handleDifficultyChange(selectedDifficulty) {
        difficulty = selectedDifficulty;
        
        // Play button click sound
        SoundManager.playButtonClick();
        
        // Update active button
        difficultyButtons.forEach(btn => {
            if (btn.dataset.difficulty === selectedDifficulty) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Reset game when difficulty changes
        if (gameActive || !gameState.every(cell => cell === '')) {
            resetGame();
        }
    }

    // Toggle sound on/off
    function toggleSound() {
        soundEnabled = !soundEnabled;
        const icon = soundToggleBtn.querySelector('i');
        if (icon) {
            icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
        soundToggleBtn.classList.toggle('sound-off', !soundEnabled);
        
        // Initialize audio context when toggling sound on
        if (soundEnabled) {
            SoundManager.ensureAudioContext();
            // Play a sound to indicate toggle
            setTimeout(() => SoundManager.playButtonClick(), 50);
        }
        
        // Save preference to localStorage
        localStorage.setItem('ticTacToeSoundEnabled', soundEnabled.toString());
    }

    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        // Initialize audio on first interaction (cell click)
        cell.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
        }, { once: true });
    });
    
    restartButton.addEventListener('click', () => {
        SoundManager.ensureAudioContext();
        resetGame();
    });
    
    notificationBtn.addEventListener('click', () => {
        SoundManager.ensureAudioContext();
        resetGame();
    });
    
    // Difficulty button listeners
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
            handleDifficultyChange(btn.dataset.difficulty);
        });
    });
    
    // Sound toggle button
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
            toggleSound();
        });
        
        // Load sound preference from localStorage
        const savedSoundPreference = localStorage.getItem('ticTacToeSoundEnabled');
        if (savedSoundPreference !== null) {
            soundEnabled = savedSoundPreference === 'true';
            const icon = soundToggleBtn.querySelector('i');
            if (icon) {
                icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            }
            soundToggleBtn.classList.toggle('sound-off', !soundEnabled);
        }
    }

    if (chooseXBtn) {
        chooseXBtn.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
            humanPlayer = 'X';
            computerPlayer = 'O';
            if (playerXSpan && playerOSpan) {
                playerXSpan.textContent = humanPlayer;
                playerOSpan.textContent = computerPlayer;
            }
            localStorage.setItem('ticTacToeHumanMark', humanPlayer);
            if (markSelect) markSelect.classList.add('hidden');
            resetGame();
        });
    }

    if (chooseOBtn) {
        chooseOBtn.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
            humanPlayer = 'O';
            computerPlayer = 'X';
            if (playerXSpan && playerOSpan) {
                playerXSpan.textContent = humanPlayer;
                playerOSpan.textContent = computerPlayer;
            }
            localStorage.setItem('ticTacToeHumanMark', humanPlayer);
            if (markSelect) markSelect.classList.add('hidden');
            resetGame();
        });
    }

    // Leaderboard functionality
    if (leaderboardToggle) {
        leaderboardToggle.addEventListener('click', showLeaderboard);
    }

    if (closeLeaderboard) {
        closeLeaderboard.addEventListener('click', hideLeaderboard);
    }

    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
            resetLeaderboard();
        });
    }

    // Close leaderboard when clicking outside
    if (leaderboard) {
        leaderboard.addEventListener('click', (e) => {
            if (e.target === leaderboard) {
                hideLeaderboard();
            }
        });
    }
    
    // Close notification when clicking outside
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            hideNotification();
        }
    });
    
    // Initialize game
    loadLeaderboard(); // Load leaderboard data
    const savedHuman = localStorage.getItem('ticTacToeHumanMark');
    if (savedHuman === 'X' || savedHuman === 'O') {
        humanPlayer = savedHuman;
        computerPlayer = savedHuman === 'X' ? 'O' : 'X';
        if (playerXSpan && playerOSpan) {
            playerXSpan.textContent = humanPlayer;
            playerOSpan.textContent = computerPlayer;
        }
        resetGame();
    } else {
        if (markSelect) markSelect.classList.remove('hidden');
        gameActive = false;
        gameBoard.classList.add('disabled');
        statusDisplay.textContent = 'Choose your mark';
    }
    console.log('Tic Tac Toe Game Initialized');
    console.log('You are X, Computer is O');
});

// Hide preloader when page is fully loaded (outside DOMContentLoaded for immediate execution)
(function() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    const loadStartTime = performance.now();
    const minDisplayTime = 1000; // Minimum 1 second display for better UX
    
    function hidePreloader() {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.style.display = 'none';
                }
            }, 500);
        }
    }
    
    function handleLoad() {
        const elapsed = performance.now() - loadStartTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsed);
        setTimeout(hidePreloader, remainingTime);
    }
    
    // Handle different loading states
    if (document.readyState === 'complete') {
        // Page already loaded
        handleLoad();
    } else if (document.readyState === 'interactive') {
        // DOM is ready, wait for resources
        window.addEventListener('load', handleLoad);
    } else {
        // Still loading
        window.addEventListener('load', handleLoad);
        // Fallback: hide after max time even if load event doesn't fire
        setTimeout(hidePreloader, minDisplayTime + 2000);
    }
})();
