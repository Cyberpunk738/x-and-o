export const checkGameStatus = (board) => {
    const size = Math.sqrt(board.length);
    const winningCombinations = [];

    // Rows
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(i * size + j);
        }
        winningCombinations.push(row);
    }

    // Columns
    for (let i = 0; i < size; i++) {
        const col = [];
        for (let j = 0; j < size; j++) {
            col.push(j * size + i);
        }
        winningCombinations.push(col);
    }

    // Diagonals
    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
        diag2.push(i * size + (size - 1 - i));
    }
    winningCombinations.push(diag1);
    winningCombinations.push(diag2);

    // Check combinations
    for (let combo of winningCombinations) {
        const firstIndex = combo[0];
        const firstValue = board[firstIndex];

        if (firstValue) {
            const isWin = combo.every(index => board[index] === firstValue);
            if (isWin) {
                return { status: 'win', winner: firstValue, cells: combo };
            }
        }
    }

    if (!board.includes('')) {
        return { status: 'draw', cells: [] };
    }

    return { status: 'active', cells: [] };
};
