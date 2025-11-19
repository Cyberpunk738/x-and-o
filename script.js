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
    const themeToggle = document.getElementById('themeToggle');
    const coinCountEl = document.getElementById('coinCount');
    const energyCountEl = document.getElementById('energyCount');
    const gemCountEl = document.getElementById('gemCount');
    const shop = document.getElementById('shop');
    const closeShop = document.getElementById('closeShop');
    const shopButtons = document.querySelectorAll('.btn-buy');
    const hudPlusButtons = document.querySelectorAll('.hud-plus');
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
    const installBtn = document.getElementById('installBtn');
    const onboarding = document.getElementById('onboarding');
    const settingsModal = document.getElementById('settingsModal');
    const settingsToggle = document.getElementById('settingsToggle');
    const closeSettings = document.getElementById('closeSettings');
    const settingSound = document.getElementById('settingSound');
    const settingTheme = document.getElementById('settingTheme');
    const settingMusic = document.getElementById('settingMusic');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Game State
    let gameActive = true;
    let currentPlayer = 'X'; // Human is X, Computer is O
    let humanPlayer = 'X';
    let computerPlayer = 'O';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let isComputerThinking = false;
    let difficulty = 'easy'; // 'easy', 'medium', or 'hard'
    let soundEnabled = true; // Sound enabled by default
    let activeTheme = 'classic';
    let coins = 0;
    let energy = 20;
    let maxEnergy = 20;
    let gems = 0;

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
        // Play coin sound
        playCoin() {
            this.playTone(880, 0.08, 'sine', 0.25);
            setTimeout(() => this.playTone(1200, 0.08, 'sine', 0.2), 80);
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

    // Coins
    function loadCoins() {
        const saved = localStorage.getItem('ticTacToeCoins');
        coins = saved ? parseInt(saved, 10) || 0 : 0;
        updateCoinsUI();
    }

    function saveCoins() {
        localStorage.setItem('ticTacToeCoins', coins.toString());
        updateCoinsUI();
    }

    function addCoins(amount) {
        coins += amount;
        saveCoins();
        SoundManager.playCoin();
    }

    function updateCoinsUI() {
        if (coinCountEl) {
            coinCountEl.textContent = coins.toString();
        }
    }

    function loadEnergy() {
        const saved = localStorage.getItem('ticTacToeEnergy');
        energy = saved ? parseInt(saved, 10) || 0 : 20;
        const savedMax = localStorage.getItem('ticTacToeMaxEnergy');
        maxEnergy = savedMax ? parseInt(savedMax, 10) || 20 : 20;
        updateEnergyUI();
    }
    function saveEnergy() {
        localStorage.setItem('ticTacToeEnergy', energy.toString());
        localStorage.setItem('ticTacToeMaxEnergy', maxEnergy.toString());
        updateEnergyUI();
    }
    function addEnergy(amount) {
        energy = Math.min(maxEnergy, energy + amount);
        saveEnergy();
    }
    function spendEnergy(amount) {
        energy = Math.max(0, energy - amount);
        saveEnergy();
    }
    function updateEnergyUI() {
        if (energyCountEl) energyCountEl.textContent = energy.toString();
    }

    function loadGems() {
        const saved = localStorage.getItem('ticTacToeGems');
        gems = saved ? parseInt(saved, 10) || 0 : 0;
        updateGemsUI();
    }
    function saveGems() {
        localStorage.setItem('ticTacToeGems', gems.toString());
        updateGemsUI();
    }
    function addGems(amount) {
        gems += amount;
        saveGems();
    }
    function updateGemsUI() {
        if (gemCountEl) gemCountEl.textContent = gems.toString();
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
        spawnParticles(cell, player);

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
        drawWinLine(winningCells);
    }

    function drawWinLine(winningCells) {
        const rectBoard = gameBoard.getBoundingClientRect();
        const startCell = cells[winningCells[0]];
        const endCell = cells[winningCells[2]];
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
        line.style.transform = 'translateY(-3px) rotate(' + angle + 'deg)';
        gameBoard.appendChild(line);
    }

    // Show notification modal
    function showNotification(type, player = null) {
        notification.classList.remove('hidden');

        if (type === 'win') {
            if (player === humanPlayer) {
                notificationIcon.innerHTML = '<i class="fas fa-trophy"></i>';
                notificationTitle.textContent = 'Congratulations!';
                notificationMessage.textContent = 'You won the game!';
                SoundManager.playWin();
                updateLeaderboard('win');
                addCoins(10);
                if (typeof addGems === 'function') addGems(1);
            } else {
                notificationIcon.innerHTML = '<i class="fas fa-robot"></i>';
                notificationTitle.textContent = 'Computer Wins!';
                notificationMessage.textContent = 'Better luck next time!';
                SoundManager.playTone(300, 0.3, 'sawtooth', 0.2);
                updateLeaderboard('loss');
                addCoins(1);
            }
        } else if (type === 'draw') {
            notificationIcon.innerHTML = '<i class="fas fa-handshake"></i>';
            notificationTitle.textContent = "It's a Draw!";
            notificationMessage.textContent = 'Well played by both sides!';
            SoundManager.playDraw();
            updateLeaderboard('draw');
            addCoins(3);
            if (typeof addGems === 'function') addGems(1);
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
        statusDisplay.classList.add('thinking');

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
                    statusDisplay.classList.remove('thinking');
                    setTimeout(() => showNotification('win', result.player), 500);
                } else if (result.status === 'draw') {
                    gameActive = false;
                    gameBoard.classList.add('disabled');
                    statusDisplay.textContent = "It's a Draw!";
                    statusDisplay.classList.remove('thinking');
                    setTimeout(() => showNotification('draw'), 500);
                } else {
                    currentPlayer = humanPlayer;
                    statusDisplay.textContent = 'Your Turn';
                    statusDisplay.classList.remove('thinking');
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

        placeMark(clickedCell, clickedCellIndex, humanPlayer);
        addCoins(1);
        if (typeof spendEnergy === 'function') spendEnergy(1);

        const result = checkGameStatus();

        if (result.status === 'win') {
            highlightWinningCells(result.cells);
            gameActive = false;
            gameBoard.classList.add('disabled');
            statusDisplay.textContent = 'You Win!';
            statusDisplay.classList.remove('thinking');
            setTimeout(() => showNotification('win', result.player), 500);
        } else if (result.status === 'draw') {
            gameActive = false;
            gameBoard.classList.add('disabled');
            statusDisplay.textContent = "It's a Draw!";
            statusDisplay.classList.remove('thinking');
            setTimeout(() => showNotification('draw'), 500);
        } else {
            currentPlayer = computerPlayer;
            computerMove();
            statusDisplay.classList.add('thinking');
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
        const existingLine = gameBoard.querySelector('.win-line');
        if (existingLine) existingLine.remove();
        gameBoard.querySelectorAll('.particle').forEach(p => p.remove());

        if (currentPlayer === humanPlayer) {
            statusDisplay.textContent = 'Your Turn';
            statusDisplay.classList.remove('thinking');
            gameBoard.classList.remove('disabled');
        } else {
            statusDisplay.textContent = "Computer's Turn...";
            statusDisplay.classList.add('thinking');
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

    // Onboarding Logic
    function initOnboarding() {
        if (!localStorage.getItem('hasSeenOnboarding')) {
            onboarding.classList.remove('hidden');
            let currentSlide = 0;

            function updateSlide(index) {
                slides.forEach(s => s.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                slides[index].classList.add('active');
                dots[index].classList.add('active');

                if (index === slides.length - 1) {
                    nextSlideBtn.textContent = 'Start Playing';
                } else {
                    nextSlideBtn.textContent = 'Next';
                }
            }

            nextSlideBtn.addEventListener('click', () => {
                if (currentSlide < slides.length - 1) {
                    currentSlide++;
                    updateSlide(currentSlide);
                } else {
                    onboarding.classList.add('hidden');
                    localStorage.setItem('hasSeenOnboarding', 'true');
                    SoundManager.ensureAudioContext();
                    SoundManager.playButtonClick();
                }
            });
        }
    }

    // Settings Logic
    function initSettings() {
        // Sync toggles with current state
        if (settingSound) settingSound.checked = soundEnabled;
        if (settingTheme) settingTheme.checked = activeTheme === 'neon';

        settingsToggle.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
            SoundManager.playButtonClick();
        });

        closeSettings.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
            SoundManager.playButtonClick();
        });

        settingSound.addEventListener('change', (e) => {
            soundEnabled = e.target.checked;
            localStorage.setItem('ticTacToeSoundEnabled', soundEnabled.toString());
            if (soundEnabled) {
                SoundManager.ensureAudioContext();
                SoundManager.playButtonClick();
            }
        });

        settingTheme.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'neon' : 'classic';
            if (newTheme === 'neon' && localStorage.getItem('ticTacToeNeonUnlocked') !== 'true') {
                // If neon is locked, revert toggle and show shop or message
                e.target.checked = false;
                alert('Unlock Neon Theme in the Shop first!');
                return;
            }
            applyTheme(newTheme);
            SoundManager.playButtonClick();
        });
    }

    // Initialize new features
    initOnboarding();
    initSettings();

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

    function applyTheme(theme) {
        const body = document.body;
        const t = theme === 'neon' && localStorage.getItem('ticTacToeNeonUnlocked') !== 'true' ? 'classic' : theme;
        body.classList.toggle('theme-neon', t === 'neon');
        activeTheme = t;
        if (settingTheme) settingTheme.checked = t === 'neon';
        localStorage.setItem('ticTacToeTheme', t);
    }

    function addRipple(e) {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        const maxDim = Math.max(rect.width, rect.height);
        ripple.style.width = maxDim + 'px';
        ripple.style.height = maxDim + 'px';
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    }

    function spawnParticles(cell, player) {
        const rect = cell.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const angle = Math.random() * Math.PI * 2;
            const distance = 24 + Math.random() * 24;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            p.style.setProperty('--dx', dx + 'px');
            p.style.setProperty('--dy', dy + 'px');
            p.style.left = rect.width / 2 + 'px';
            p.style.top = rect.height / 2 + 'px';
            cell.appendChild(p);
            setTimeout(() => p.remove(), 650);
        }
    }

    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        // Initialize audio on first interaction (cell click)
        cell.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
        }, { once: true });
        cell.addEventListener('click', addRipple);
    });

    restartButton.addEventListener('click', () => {
        SoundManager.ensureAudioContext();
        resetGame();
    });
    restartButton.addEventListener('click', addRipple);

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
        btn.addEventListener('click', addRipple);
    });

    // Sound toggle button
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
            toggleSound();
        });
        soundToggleBtn.addEventListener('click', addRipple);

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
        chooseXBtn.addEventListener('click', addRipple);
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
        chooseOBtn.addEventListener('click', addRipple);
    }

    // Leaderboard functionality
    if (leaderboardToggle) {
        leaderboardToggle.addEventListener('click', showLeaderboard);
        leaderboardToggle.addEventListener('click', addRipple);
    }

    if (closeLeaderboard) {
        closeLeaderboard.addEventListener('click', hideLeaderboard);
        closeLeaderboard.addEventListener('click', addRipple);
    }

    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
            resetLeaderboard();
        });
        resetStatsBtn.addEventListener('click', addRipple);
    }

    function isNeonUnlocked() {
        return localStorage.getItem('ticTacToeNeonUnlocked') === 'true';
    }
    function unlockNeon() {
        localStorage.setItem('ticTacToeNeonUnlocked', 'true');
    }
    function openShop(context) {
        if (shop) shop.classList.remove('hidden');
    }
    function closeShopModal() {
        if (shop) shop.classList.add('hidden');
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
            if (!isNeonUnlocked()) {
                openShop('neon');
                return;
            }
            const current = document.body.classList.contains('theme-neon') ? 'neon' : 'classic';
            const next = current === 'neon' ? 'classic' : 'neon';
            applyTheme(next);
        });
    }
    if (closeShop) {
        closeShop.addEventListener('click', closeShopModal);
    }
    if (shop) {
        shop.addEventListener('click', (e) => {
            if (e.target === shop) closeShopModal();
        });
    }
    hudPlusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            SoundManager.ensureAudioContext();
            openShop(btn.dataset.openShop);
        });
    });
    shopButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'buyEnergy10') {
                if (coins >= 5) { coins -= 5; addEnergy(10); saveCoins(); }
            } else if (action === 'buyGem1') {
                if (coins >= 10) { coins -= 10; addGems(1); saveCoins(); }
            } else if (action === 'unlockNeon') {
                if (coins >= 30) { coins -= 30; unlockNeon(); saveCoins(); }
            }
            closeShopModal();
        });
    });

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
    loadLeaderboard();
    loadCoins();
    loadEnergy();
    setInterval(() => { if (energy < maxEnergy) addEnergy(1); }, 60000);
    loadGems();
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
    const savedTheme = localStorage.getItem('ticTacToeTheme');
    applyTheme(savedTheme === 'neon' ? 'neon' : 'classic');
    (function grantDailyBonus() {
        const key = 'ticTacToeDailyLast';
        const last = localStorage.getItem(key);
        const today = new Date().toDateString();
        if (last !== today) {
            addCoins(20);
            addEnergy(5);
            addGems(1);
            localStorage.setItem(key, today);
        }
    })();
});

// Hide preloader when page is fully loaded (outside DOMContentLoaded for immediate execution)
(function () {
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
// PWA: Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(console.error);
}

// PWA: Install prompt handling
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-flex';
});
window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBtn) installBtn.style.display = 'none';
});
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        installBtn.style.display = 'none';
    });
}
