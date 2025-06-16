import type { Board } from "./types";

export const DATE_GENERATED = 'dateGenerated';
export const BOARD = 'board';
export const BOARD_SIZE = 'boardSize';
export const BINGOS = 'bingos';
export const FULL_BOARD_BINGOS = 'fullBoardBingos';

export const getBoard = (): Board | null => {
  const boardJson = window.localStorage.getItem(BOARD);
  return boardJson ? JSON.parse(boardJson) : null;
}

export const saveBoard = (board: Board) => {
  window.localStorage.setItem(BOARD, JSON.stringify(board));
}

const getNumber = (key: string): number => {
  return parseInt(window.localStorage.getItem(key) ?? '0');
}

const setNumber = (key: string, value: number) => {
  window.localStorage.setItem(key, value.toString());
}

export const getBingos = (): number => {
  return getNumber(BINGOS);
}

export const setBingos = (bingos: number) => {
  setNumber(BINGOS, bingos);
}

export const incrementBingos = (bingos: number, isFullBingo: boolean) => {
  setBingos(getBingos() + bingos);
  if (isFullBingo) {
    setFullBoardBingos(getFullBoardBingos() + 1);
  }
}

export const getBoardSize = (): number => {
  return getNumber(BOARD_SIZE);
}

export const setBoardSize = (size: number) => {
  setNumber(BOARD_SIZE, size);
}

export const getFullBoardBingos = (): number => {
  return getNumber(FULL_BOARD_BINGOS);
}

export const setFullBoardBingos = (bingos: number) => {
  setNumber(FULL_BOARD_BINGOS, bingos);
}

export const clearStats = () => {
  setNumber(BINGOS, 0);
  setNumber(FULL_BOARD_BINGOS, 0);
}