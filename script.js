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
    
    // Game State
    let gameActive = true;
    let currentPlayer = 'X'; // Human is X, Computer is O
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let isComputerThinking = false;
    
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
            if (player === 'X') {
                notificationIcon.textContent = '🎉';
                notificationTitle.textContent = 'Congratulations!';
                notificationMessage.textContent = 'You won the game!';
            } else {
                notificationIcon.textContent = '🤖';
                notificationTitle.textContent = 'Computer Wins!';
                notificationMessage.textContent = 'Better luck next time!';
            }
        } else if (type === 'draw') {
            notificationIcon.textContent = '🤝';
            notificationTitle.textContent = "It's a Draw!";
            notificationMessage.textContent = 'Well played by both sides!';
        }
    }

    // Hide notification modal
    function hideNotification() {
        notification.classList.add('hidden');
    }

    // Minimax Algorithm for AI
    function minimax(board, depth, isMaximizing) {
        // Create a temporary game state for evaluation
        const tempState = gameState;
        gameState = board;
        const result = checkGameStatus();
        gameState = tempState;
        
        if (result.status === 'win') {
            if (result.player === 'O') return { score: 10 - depth };
            if (result.player === 'X') return { score: depth - 10 };
        }
        if (result.status === 'draw') return { score: 0 };

        if (isMaximizing) {
            let bestScore = -Infinity;
            let bestMove = -1;
            
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
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
                    board[i] = 'X';
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

    // Computer makes a move
    function computerMove() {
        if (!gameActive || isComputerThinking) return;
        
        isComputerThinking = true;
        gameBoard.classList.add('disabled');
        statusDisplay.textContent = "Computer's Turn...";
        
        // Delay for better UX
        setTimeout(() => {
            const bestMove = minimax([...gameState], 0, true).index;
            
            if (bestMove !== -1 && gameState[bestMove] === '') {
                const cell = cells[bestMove];
                placeMark(cell, bestMove, 'O');
                
                const result = checkGameStatus();
                
                if (result.status === 'win') {
                    highlightWinningCells(result.cells);
                    gameActive = false;
                    gameBoard.classList.add('disabled');
                    statusDisplay.textContent = 'Computer Wins!';
                    setTimeout(() => showNotification('win', 'O'), 500);
                } else if (result.status === 'draw') {
                    gameActive = false;
                    gameBoard.classList.add('disabled');
                    statusDisplay.textContent = "It's a Draw!";
                    setTimeout(() => showNotification('draw'), 500);
                } else {
                    currentPlayer = 'X';
                    statusDisplay.textContent = 'Your Turn';
                    gameBoard.classList.remove('disabled');
                }
            }
            
            isComputerThinking = false;
        }, 600);
    }

    // Handle player's move
    function handleCellClick(e) {
        if (!gameActive || currentPlayer !== 'X' || isComputerThinking) return;
        
        const clickedCell = e.target;
        if (!clickedCell.classList.contains('cell')) return;
        
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '') return;
        
        // Player makes move
        placeMark(clickedCell, clickedCellIndex, 'X');
        
        const result = checkGameStatus();
        
        if (result.status === 'win') {
            highlightWinningCells(result.cells);
            gameActive = false;
            gameBoard.classList.add('disabled');
            statusDisplay.textContent = 'You Win!';
            setTimeout(() => showNotification('win', 'X'), 500);
        } else if (result.status === 'draw') {
            gameActive = false;
            gameBoard.classList.add('disabled');
            statusDisplay.textContent = "It's a Draw!";
            setTimeout(() => showNotification('draw'), 500);
        } else {
            currentPlayer = 'O';
            computerMove();
        }
    }

    // Reset the game
    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        isComputerThinking = false;
        statusDisplay.textContent = 'Your Turn';
        gameBoard.classList.remove('disabled');
        hideNotification();
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
    }

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', resetGame);
    notificationBtn.addEventListener('click', resetGame);
    
    // Close notification when clicking outside
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            hideNotification();
        }
    });
    
    // Initialize game
    console.log('Tic Tac Toe Game Initialized');
    console.log('You are X, Computer is O');
});
