
import type { Tile } from "@/components/Game";

export const BOARD_SIZE = 4;

export const initializeBoard = (): (Tile | null)[][] => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
};

export const addRandomTile = (board: (Tile | null)[][]): void => {
  const emptyCells: { row: number; col: number }[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col]) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    board[randomCell.row][randomCell.col] = {
      id: `${Date.now()}-${Math.random()}`,
      value,
      row: randomCell.row,
      col: randomCell.col,
      isNew: true,
    };
  }
};

const slideAndMergeRow = (row: (Tile | null)[]): [(Tile | null)[], number] => {
  const filtered = row.filter(tile => tile !== null) as Tile[];
  const result: Tile[] = [];
  let score = 0;
  let i = 0;

  while (i < filtered.length) {
    if (i < filtered.length - 1 && filtered[i].value === filtered[i + 1].value) {
      // Merge tiles
      const mergedValue = filtered[i].value * 2;
      result.push({
        id: filtered[i].id,
        value: mergedValue,
        row: filtered[i].row,
        col: filtered[i].col,
        isMerged: true,
      });
      score += mergedValue;
      i += 2;
    } else {
      result.push({
        ...filtered[i],
        isMerged: false,
      });
      i++;
    }
  }

  // Pad with nulls
  while (result.length < BOARD_SIZE) {
    result.push(null);
  }

  return [result, score];
};

export const moveLeft = (board: (Tile | null)[][]): [(Tile | null)[][], number, boolean] => {
  const newBoard: (Tile | null)[][] = [];
  let totalScore = 0;
  let moved = false;

  for (let row = 0; row < BOARD_SIZE; row++) {
    const [newRow, score] = slideAndMergeRow(board[row]);
    newBoard.push(newRow);
    totalScore += score;

    // Check if any tile moved
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col]?.value !== newRow[col]?.value ||
          (board[row][col] === null) !== (newRow[col] === null)) {
        moved = true;
      }
    }
  }

  return [newBoard, totalScore, moved];
};

export const moveRight = (board: (Tile | null)[][]): [(Tile | null)[][], number, boolean] => {
  const newBoard: (Tile | null)[][] = [];
  let totalScore = 0;
  let moved = false;

  for (let row = 0; row < BOARD_SIZE; row++) {
    const reversedRow = [...board[row]].reverse();
    const [newRow, score] = slideAndMergeRow(reversedRow);
    newBoard.push(newRow.reverse());
    totalScore += score;

    // Check if any tile moved
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col]?.value !== newBoard[row][col]?.value ||
          (board[row][col] === null) !== (newBoard[row][col] === null)) {
        moved = true;
      }
    }
  }

  return [newBoard, totalScore, moved];
};

export const moveUp = (board: (Tile | null)[][]): [(Tile | null)[][], number, boolean] => {
  const transposed = transposeBoard(board);
  const [movedBoard, score, moved] = moveLeft(transposed);
  return [transposeBoard(movedBoard), score, moved];
};

export const moveDown = (board: (Tile | null)[][]): [(Tile | null)[][], number, boolean] => {
  const transposed = transposeBoard(board);
  const [movedBoard, score, moved] = moveRight(transposed);
  return [transposeBoard(movedBoard), score, moved];
};

const transposeBoard = (board: (Tile | null)[][]): (Tile | null)[][] => {
  const transposed: (Tile | null)[][] = [];
  for (let col = 0; col < BOARD_SIZE; col++) {
    transposed[col] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      transposed[col][row] = board[row][col];
    }
  }
  return transposed;
};

export const canMove = (board: (Tile | null)[][]): boolean => {
  // Check for empty cells
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col]) return true;
    }
  }

  // Check for possible merges
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const current = board[row][col];
      if (current) {
        // Check right neighbor
        if (col < BOARD_SIZE - 1 && board[row][col + 1]?.value === current.value) {
          return true;
        }
        // Check bottom neighbor
        if (row < BOARD_SIZE - 1 && board[row + 1][col]?.value === current.value) {
          return true;
        }
      }
    }
  }

  return false;
};

export const isGameOver = (board: (Tile | null)[][]): boolean => {
  return !canMove(board);
};

export const hasWon = (board: (Tile | null)[][]): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col]?.value === 2048) {
        return true;
      }
    }
  }
  return false;
};
