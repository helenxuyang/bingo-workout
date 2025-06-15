import type { Board } from "./types";

export const DATE_GENERATED = 'dateGenerated';
export const BOARD = 'board';
export const BINGOS = 'bingos';
export const FULL_BOARD_BINGOS = 'fullBoardBingos';

export const getBoard = (): Board | null => {
  const boardJson = window.localStorage.getItem(BOARD);
  return boardJson ? JSON.parse(boardJson) : null;
}

export const saveBoard = (board: Board) => {
  window.localStorage.setItem(BOARD, JSON.stringify(board));
}

export const getBingos = (): number => {
  return parseInt(window.localStorage.getItem(BINGOS) ?? '0');
}

export const setBingos = (bingos: number) => {
  window.localStorage.setItem(BINGOS, bingos.toString());
}

export const getFullBoardBingos = (): number => {
  return parseInt(window.localStorage.getItem(FULL_BOARD_BINGOS) ?? '0');
}

export const setFullBoardBingos = (bingos: number) => {
  window.localStorage.setItem(FULL_BOARD_BINGOS, bingos.toString());
}

export const clearStats = () => {
  window.localStorage.setItem(BINGOS, '0');
  window.localStorage.setItem(FULL_BOARD_BINGOS, '0');
}