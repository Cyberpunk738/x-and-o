import { checkGameStatus } from './gameLogic';

export const easyAIMove = (board) => {
    const emptyIndices = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    if (emptyIndices.length === 0) return -1;
    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    return emptyIndices[randomIndex];
};

export const mediumAIMove = (board, aiPlayer, humanPlayer) => {
    // Try to win
    const winMove = findBestMove(board, aiPlayer);
    if (winMove !== -1) return winMove;

    // Block human win
    const blockMove = findBestMove(board, humanPlayer);
    if (blockMove !== -1) return blockMove;

    // Random move
    return easyAIMove(board);
};

export const hardAIMove = (board, aiPlayer, humanPlayer) => {
    return minimax(board, aiPlayer, humanPlayer).index;
};

const findBestMove = (board, player) => {
    const emptyIndices = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    for (let index of emptyIndices) {
        const newBoard = [...board];
        newBoard[index] = player;
        if (checkGameStatus(newBoard).status === 'win') {
            return index;
        }
    }
    return -1;
};

const minimax = (board, aiPlayer, humanPlayer, depth = 0, isMaximizing = true) => {
    const result = checkGameStatus(board);
    if (result.status === 'win') {
        return { score: result.winner === aiPlayer ? 10 - depth : depth - 10 };
    }
    if (result.status === 'draw') {
        return { score: 0 };
    }

    const emptyIndices = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    const moves = [];

    for (let i = 0; i < emptyIndices.length; i++) {
        const index = emptyIndices[i];
        const newBoard = [...board];
        newBoard[index] = isMaximizing ? aiPlayer : humanPlayer;

        const score = minimax(newBoard, aiPlayer, humanPlayer, depth + 1, !isMaximizing).score;
        moves.push({ index, score });
    }

    if (isMaximizing) {
        return moves.reduce((best, move) => (move.score > best.score ? move : best), { score: -Infinity });
    } else {
        return moves.reduce((best, move) => (move.score < best.score ? move : best), { score: Infinity });
    }
};
