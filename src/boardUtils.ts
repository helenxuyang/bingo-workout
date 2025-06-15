import type { Square, Board } from "./types";

const isBingo = (line: Square[]) => {
  return line.filter(square => !square.checked).length === 0;
}

export const countBingos = (board: Board): number => {
  let bingos = 0;
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    const col = board.map(row => row[i]);
    if (isBingo(row)) {
      bingos++;
    }
    if (isBingo(col)) {
      bingos++;
    }
  }
  const diagonal1 = board.map((row, rowIndex) => row[rowIndex]);
  const diagonal2 = board.map((row, rowIndex) => row[board.length - rowIndex - 1]);
  if (isBingo(diagonal1)) {
    bingos++;
  }
  if (isBingo(diagonal2)) {
    bingos++;
  }
  return bingos;
}

export const isFullBoardBingo = (board: Board): boolean => {
  for (const row of board) {
    for (const square of row) {
      if (!square.checked) {
        return false;
      }
    }
  }
  return true;
}