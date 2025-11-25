// AI logic for computer moves

import { getAvailableMoves, wouldWin, winningConditions, checkGameStatus } from './gameLogic';

export function easyAIMove(board) {
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) return -1;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

export function mediumAIMove(board, computerPlayer, humanPlayer) {
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) return -1;

    const shouldPlayOptimally = Math.random() < 0.7;

    if (shouldPlayOptimally) {
        // Try to win
        for (let move of availableMoves) {
            if (wouldWin(board, computerPlayer, move)) return move;
        }

        // Block human from winning
        for (let move of availableMoves) {
            if (wouldWin(board, humanPlayer, move)) return move;
        }

        // Take center
        if (board[4] === '') return 4;

        // Take corner
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

function minimax(board, depth, isMaximizing, computerPlayer, humanPlayer) {
    const tempGameState = board;
    const result = checkGameStatus(tempGameState);

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
                let score = minimax(board, depth + 1, false, computerPlayer, humanPlayer).score;
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
                let score = minimax(board, depth + 1, true, computerPlayer, humanPlayer).score;
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

export function hardAIMove(board, computerPlayer, humanPlayer) {
    return minimax([...board], 0, true, computerPlayer, humanPlayer).index;
}
