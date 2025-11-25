// Game logic utilities

export const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function checkGameStatus(gameState) {
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

export function getAvailableMoves(board) {
    const moves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') moves.push(i);
    }
    return moves;
}

export function wouldWin(board, player, move) {
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
