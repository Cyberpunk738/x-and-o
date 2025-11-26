// ============================================
// TIC TAC TOE GAME - CLEAN REBUILD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // DOM ELEMENTS
    // ============================================
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const gameBoard = document.getElementById('gameBoard');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');

    // Modals
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationTitle = document.getElementById('notificationTitle');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationBtn = document.getElementById('notificationBtn');

    const shop = document.getElementById('shop');
    const closeShop = document.getElementById('closeShop');
    const shopButtons = document.querySelectorAll('.btn-buy');
    const hudPlusButtons = document.querySelectorAll('.hud-plus');

    const leaderboard = document.getElementById('leaderboard');
    const leaderboardToggle = document.getElementById('leaderboardToggle');
    const closeLeaderboard = document.getElementById('closeLeaderboard');
    const resetStatsBtn = document.getElementById('resetStats');
    const statWins = document.getElementById('statWins');
    const statLosses = document.getElementById('statLosses');
    const statDraws = document.getElementById('statDraws');
    const statWinRate = document.getElementById('statWinRate');

    const onboarding = document.getElementById('onboarding');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    const settingsModal = document.getElementById('settingsModal');
    const settingsToggle = document.getElementById('settingsToggle');
    const closeSettings = document.getElementById('closeSettings');
    const settingSound = document.getElementById('settingSound');
    const settingTheme = document.getElementById('settingTheme');
    const settingMusic = document.getElementById('settingMusic');

    // HUD
    const coinCountEl = document.getElementById('coinCount');
    const energyCountEl = document.getElementById('energyCount');
    const gemCountEl = document.getElementById('gemCount');

    const installBtn = document.getElementById('installBtn');
    const preloader = document.getElementById('preloader');

    // ============================================
    // GAME STATE
    // ============================================
    let gameActive = true;
    let currentPlayer = 'X';
    let humanPlayer = 'X';
    let computerPlayer = 'O';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let isComputerThinking = false;
    let difficulty = 'easy';
    let soundEnabled = true;
    let activeTheme = 'classic';
    let coins = 0;
    let energy = 20;
    let maxEnergy = 20;
    let gems = 0;

    let leaderboardData = {
        wins: 0,
        losses: 0,
        draws: 0
    };

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // ============================================
    // SOUND MANAGER
    // ============================================
    const SoundManager = {
        audioContext: null,
        audioInitialized: false,

        init() {
            return true;
        },

        ensureAudioContext() {
            if (!this.audioContext) {
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.audioInitialized = true;
                } catch (e) {
                    console.warn('Web Audio API not supported');
                    return false;
                }
            }

            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(e => {
                    console.warn('Could not resume audio context:', e);
                });
            }

            return true;
        },

        playTone(frequency, duration, type = 'sine', volume = 0.3) {
            if (!soundEnabled) return;
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

        playClick(player = 'X') {
            if (player === 'X') {
                this.playTone(600, 0.1, 'sine', 0.2);
            } else {
                this.playTone(400, 0.1, 'sine', 0.2);
            }
        },

        playWin() {
            this.playTone(523, 0.1, 'sine', 0.3);
            setTimeout(() => this.playTone(659, 0.1, 'sine', 0.3), 100);
            setTimeout(() => this.playTone(784, 0.2, 'sine', 0.3), 200);
        },

        playDraw() {
            this.playTone(440, 0.3, 'sine', 0.2);
            setTimeout(() => this.playTone(392, 0.3, 'sine', 0.2), 150);
        },

        playButtonClick() {
            this.playTone(300, 0.05, 'square', 0.15);
        },

        playCoin() {
            this.playTone(880, 0.08, 'sine', 0.25);
            setTimeout(() => this.playTone(1200, 0.08, 'sine', 0.2), 80);
        },

        playError() {
            this.playTone(200, 0.2, 'sawtooth', 0.2);
        }
    };

    SoundManager.init();

    // ============================================
    // LOCAL STORAGE FUNCTIONS
    // ============================================
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

    function saveLeaderboard() {
        localStorage.setItem('ticTacToeLeaderboard', JSON.stringify(leaderboardData));
        updateLeaderboardDisplay();
    }

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
        if (coinCountEl) coinCountEl.textContent = coins.toString();
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

    function resetLeaderboard() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            leaderboardData = { wins: 0, losses: 0, draws: 0 };
            saveLeaderboard();
        }
    }

    // ============================================
    // THEME FUNCTIONS
    // ============================================
    function applyTheme(theme) {
        activeTheme = theme;
        if (theme === 'neon') {
            document.body.classList.add('theme-neon');
            localStorage.setItem('ticTacToeTheme', 'neon');
        } else {
            document.body.classList.remove('theme-neon');
            localStorage.setItem('ticTacToeTheme', 'classic');
        }
    }

    function loadTheme() {
        const saved = localStorage.getItem('ticTacToeTheme');
        if (saved === 'neon' && localStorage.getItem('ticTacToeNeonUnlocked') === 'true') {
            applyTheme('neon');
            if (settingTheme) settingTheme.checked = true;
        }
    }

    // ============================================
    // GAME LOGIC
    // ============================================
    function placeMark(cell, cellIndex, player) {
        gameState[cellIndex] = player;
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        spawnParticles(cell, player);
        SoundManager.playClick(player);
    }

    function spawnParticles(cell, player) {
        const rect = cell.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();
        const centerX = cellRect.width / 2;
        const centerY = cellRect.height / 2;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const angle = (Math.PI * 2 * i) / 8;
            const distance = 40;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');

            cell.appendChild(particle);

            setTimeout(() => particle.remove(), 600);
        }
    }

    function checkGameStatus() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return { status: 'win', player: gameState[a], cells: [a, b, c] };
            }
        }

        if (!gameState.includes('')) {
            return { status: 'draw' };
        }

        return { status: 'continue' };
    }

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
                addGems(1);
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
            addGems(1);
        }
    }

    function hideNotification() {
        notification.classList.add('hidden');
    }

    // ============================================
    // AI LOGIC
    // ============================================
    function getAvailableMoves(board) {
        const moves = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') moves.push(i);
        }
        return moves;
    }

    function wouldWin(board, player, move) {
        const testBoard = [...board];
        testBoard[move] = player;

        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (testBoard[a] && testBoard[a] === testBoard[b] && testBoard[a] === testBoard[c]) {
                return testBoard[a] === player;
            }
        }
        return false;
    }

    function easyAIMove(board) {
        const availableMoves = getAvailableMoves(board);
        if (availableMoves.length === 0) return -1;
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    function mediumAIMove(board) {
        const availableMoves = getAvailableMoves(board);
        if (availableMoves.length === 0) return -1;

        const shouldPlayOptimally = Math.random() < 0.7;

        if (shouldPlayOptimally) {
            for (let move of availableMoves) {
                if (wouldWin(board, computerPlayer, move)) return move;
            }

            for (let move of availableMoves) {
                if (wouldWin(board, humanPlayer, move)) return move;
            }

            if (board[4] === '') return 4;

            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(idx => board[idx] === '');
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }

            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        } else {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    }

    function minimax(board, depth, isMaximizing) {
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

    function hardAIMove(board) {
        return minimax([...board], 0, true).index;
    }

    function computerMove() {
        if (!gameActive || isComputerThinking) return;

        isComputerThinking = true;
        gameBoard.classList.add('disabled');
        statusDisplay.textContent = "Computer's Turn";
        statusDisplay.classList.add('thinking');

        const delay = difficulty === 'easy' ? 300 : difficulty === 'medium' ? 500 : 600;

        setTimeout(() => {
            let move = -1;

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

    function handleCellClick(e) {
        if (!gameActive || currentPlayer !== humanPlayer || isComputerThinking) return;

        const clickedCell = e.target;
        if (!clickedCell.classList.contains('cell')) return;

        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '') {
            SoundManager.playError();
            return;
        }

        placeMark(clickedCell, clickedCellIndex, humanPlayer);
        addCoins(1);
        spendEnergy(1);

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
        }
    }

    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        isComputerThinking = false;
        hideNotification();

        SoundManager.playButtonClick();

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });

        const existingLine = gameBoard.querySelector('.win-line');
        if (existingLine) existingLine.remove();
        gameBoard.querySelectorAll('.particle').forEach(p => p.remove());

        if (currentPlayer === humanPlayer) {
            statusDisplay.textContent = 'Your Turn';
            statusDisplay.classList.remove('thinking');
            gameBoard.classList.remove('disabled');
        } else {
            statusDisplay.textContent = "Computer's Turn";
            statusDisplay.classList.add('thinking');
            gameBoard.classList.add('disabled');
            setTimeout(computerMove, 400);
        }
    }

    // ============================================
    // DIFFICULTY SELECTION
    // ============================================
    function handleDifficultyChange(selectedDifficulty) {
        difficulty = selectedDifficulty;
        SoundManager.playButtonClick();

        difficultyButtons.forEach(btn => {
            if (btn.dataset.difficulty === selectedDifficulty) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (gameActive || !gameState.every(cell => cell === '')) {
            resetGame();
        }
    }

    // ============================================
    // ONBOARDING
    // ============================================
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

    // ============================================
    // SETTINGS
    // ============================================
    function initSettings() {
        const savedSound = localStorage.getItem('ticTacToeSoundEnabled');
        if (savedSound !== null) {
            soundEnabled = savedSound === 'true';
            if (settingSound) settingSound.checked = soundEnabled;
        }

        if (settingsToggle) {
            settingsToggle.addEventListener('click', () => {
                settingsModal.classList.remove('hidden');
                SoundManager.playButtonClick();
            });
        }

        if (closeSettings) {
            closeSettings.addEventListener('click', () => {
                settingsModal.classList.add('hidden');
                SoundManager.playButtonClick();
            });
        }

        if (settingSound) {
            settingSound.addEventListener('change', (e) => {
                soundEnabled = e.target.checked;
                localStorage.setItem('ticTacToeSoundEnabled', soundEnabled.toString());
                if (soundEnabled) {
                    SoundManager.ensureAudioContext();
                    SoundManager.playButtonClick();
                }
            });
        }

        if (settingTheme) {
            settingTheme.addEventListener('change', (e) => {
                const newTheme = e.target.checked ? 'neon' : 'classic';
                if (newTheme === 'neon' && localStorage.getItem('ticTacToeNeonUnlocked') !== 'true') {
                    e.target.checked = false;
                    alert('Unlock Neon Theme in the Shop first!');
                    return;
                }
                applyTheme(newTheme);
                SoundManager.playButtonClick();
            });
        }
    }

    // ============================================
    // SHOP
    // ============================================
    function initShop() {
        hudPlusButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                shop.classList.remove('hidden');
                SoundManager.playButtonClick();
            });
        });

        if (closeShop) {
            closeShop.addEventListener('click', () => {
                shop.classList.add('hidden');
                SoundManager.playButtonClick();
            });
        }

        shopButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;

                if (action === 'buyEnergy10') {
                    if (coins >= 5) {
                        coins -= 5;
                        addEnergy(10);
                        saveCoins();
                        SoundManager.playCoin();
                    } else {
                        alert('Not enough coins!');
                        SoundManager.playError();
                    }
                } else if (action === 'buyGem1') {
                    if (coins >= 10) {
                        coins -= 10;
                        addGems(1);
                        saveCoins();
                        SoundManager.playCoin();
                    } else {
                        alert('Not enough coins!');
                        SoundManager.playError();
                    }
                } else if (action === 'unlockNeon') {
                    if (localStorage.getItem('ticTacToeNeonUnlocked') === 'true') {
                        alert('Already unlocked!');
                        return;
                    }
                    if (coins >= 30) {
                        coins -= 30;
                        saveCoins();
                        localStorage.setItem('ticTacToeNeonUnlocked', 'true');
                        btn.textContent = 'Unlocked';
                        btn.disabled = true;
                        SoundManager.playCoin();
                        alert('Neon theme unlocked! Enable it in Settings.');
                    } else {
                        alert('Not enough coins!');
                        SoundManager.playError();
                    }
                }
            });
        });
    }

    // ============================================
    // LEADERBOARD
    // ============================================
    function initLeaderboard() {
        if (leaderboardToggle) {
            leaderboardToggle.addEventListener('click', () => {
                leaderboard.classList.remove('hidden');
                SoundManager.playButtonClick();
            });
        }

        if (closeLeaderboard) {
            closeLeaderboard.addEventListener('click', () => {
                leaderboard.classList.add('hidden');
                SoundManager.playButtonClick();
            });
        }

        if (resetStatsBtn) {
            resetStatsBtn.addEventListener('click', resetLeaderboard);
        }
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    gameBoard.addEventListener('click', handleCellClick);
    restartButton.addEventListener('click', resetGame);
    notificationBtn.addEventListener('click', resetGame);

    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleDifficultyChange(btn.dataset.difficulty);
        });
    });

    // ============================================
    // PWA INSTALL
    // ============================================
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) installBtn.style.display = 'flex';
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Explicitly hide all modals on init
        const allModals = [shop, leaderboard, notification, settingsModal];
        allModals.forEach(modal => {
            if (modal) modal.classList.add('hidden');
        });

        // Hide preloader
        setTimeout(() => {
            if (preloader) preloader.classList.add('hidden');
        }, 1000);

        // Load saved data
        loadLeaderboard();
        loadCoins();
        loadEnergy();
        loadGems();
        loadTheme();

        // Initialize features
        initOnboarding();
        initSettings();
        initShop();
        initLeaderboard();

        // Add click-outside-to-close for all modals
        [shop, leaderboard, settingsModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.add('hidden');
                        SoundManager.playButtonClick();
                    }
                });
            }
        });

        console.log('Tic Tac Toe game initialized successfully!');
    }

    init();
});
