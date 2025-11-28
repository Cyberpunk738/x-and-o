import { checkGameStatus } from './gameLogic';

// Heuristic evaluation for non-terminal states
const evaluateBoard = (board, aiPlayer, humanPlayer) => {
    const size = Math.sqrt(board.length);
    let score = 0;

    // Helper to score a line (row, col, diag)
    const scoreLine = (line) => {
        let aiCount = 0;
        let humanCount = 0;
        let emptyCount = 0;

        line.forEach(index => {
            if (board[index] === aiPlayer) aiCount++;
            else if (board[index] === humanPlayer) humanCount++;
            else emptyCount++;
        });

        if (aiCount === size) return 1000; // Win
        if (humanCount === size) return -1000; // Loss

        // Heuristics for partial lines
        if (aiCount === size - 1 && emptyCount === 1) return 10;
        if (humanCount === size - 1 && emptyCount === 1) return -10;
        if (aiCount === size - 2 && emptyCount === 2) return 5;
        if (humanCount === size - 2 && emptyCount === 2) return -5;

        return 0;
    };

    // Generate lines (rows, cols, diags)
    const lines = [];
    // Rows
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) row.push(i * size + j);
        lines.push(row);
    }
    // Cols
    for (let i = 0; i < size; i++) {
        const col = [];
        for (let j = 0; j < size; j++) col.push(j * size + i);
        lines.push(col);
    }
    // Diags
    const diag1 = [], diag2 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
        diag2.push(i * size + (size - 1 - i));
    }
    lines.push(diag1, diag2);

    lines.forEach(line => {
        score += scoreLine(line);
    });

    return score;
};

export const easyAIMove = (board) => {
    const emptyIndices = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    if (emptyIndices.length === 0) return -1;
    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    return emptyIndices[randomIndex];
};

export const mediumAIMove = (board, aiPlayer, humanPlayer) => {
    // 1. Try to win
    const winMove = findBestMove(board, aiPlayer);
    if (winMove !== -1) return winMove;

    // 2. Block human win
    const blockMove = findBestMove(board, humanPlayer);
    if (blockMove !== -1) return blockMove;

    // 3. For larger boards, maybe pick center or corners if available
    const size = Math.sqrt(board.length);
    if (size >= 4) {
        const center = Math.floor(board.length / 2);
        if (board[center] === '') return center;
    }

    // 4. Random move
    return easyAIMove(board);
};

export const hardAIMove = (board, aiPlayer, humanPlayer) => {
    const size = Math.sqrt(board.length);
    // Depth limit depends on board size to keep performance acceptable
    // 3x3: Unlimited (small state space)
    // 4x4: Depth 4-5
    // 5x5: Depth 3-4
    let maxDepth = 10;
    if (size === 4) maxDepth = 4;
    if (size === 5) maxDepth = 3;

    return minimax(board, aiPlayer, humanPlayer, 0, true, -Infinity, Infinity, maxDepth).index;
};

export const impossibleAIMove = (board, aiPlayer, humanPlayer) => {
    const size = Math.sqrt(board.length);
    // Deeper search for impossible
    let maxDepth = 10;
    if (size === 4) maxDepth = 6;
    if (size === 5) maxDepth = 4;

    return minimax(board, aiPlayer, humanPlayer, 0, true, -Infinity, Infinity, maxDepth).index;
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

const minimax = (board, aiPlayer, humanPlayer, depth, isMaximizing, alpha, beta, maxDepth) => {
    const result = checkGameStatus(board);
    if (result.status === 'win') {
        return { score: result.winner === aiPlayer ? 1000 - depth : depth - 1000 };
    }
    if (result.status === 'draw') {
        return { score: 0 };
    }
    if (depth >= maxDepth) {
        return { score: evaluateBoard(board, aiPlayer, humanPlayer) };
    }

    const emptyIndices = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);

    // Optimization: For large boards, maybe only consider moves near existing pieces if board is empty?
    // For now, standard minimax with alpha-beta

    if (isMaximizing) {
        let bestScore = -Infinity;
        let bestMove = -1;
        for (let i = 0; i < emptyIndices.length; i++) {
            const index = emptyIndices[i];
            const newBoard = [...board];
            newBoard[index] = aiPlayer;
            const score = minimax(newBoard, aiPlayer, humanPlayer, depth + 1, false, alpha, beta, maxDepth).score;
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }
        return { score: bestScore, index: bestMove };
    } else {
        let bestScore = Infinity;
        let bestMove = -1;
        for (let i = 0; i < emptyIndices.length; i++) {
            const index = emptyIndices[i];
            const newBoard = [...board];
            newBoard[index] = humanPlayer;
            const score = minimax(newBoard, aiPlayer, humanPlayer, depth + 1, true, alpha, beta, maxDepth).score;
            if (score < bestScore) {
                bestScore = score;
                bestMove = index;
            }
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }
        return { score: bestScore, index: bestMove };
    }
};
