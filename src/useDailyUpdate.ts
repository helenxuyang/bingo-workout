import { useEffect } from "react"
import { generateBoard } from "./generateBoard";
import type { Board } from "./types";
import { DATE_GENERATED, getBoard, getBoardSize, incrementBingos, saveBoard } from "./localStorageUtils";
import { countBingos, isFullBoardBingo } from "./boardUtils";
import { DEFAULT_BOARD_SIZE } from "./boardConstants";

export const useDailyUpdate = (today: string, setBoard: (board: Board | null) => void, forceUpdate = false): void => {
  useEffect(() => {
    const lastDate = window.localStorage.getItem(DATE_GENERATED);
    const dateChanged = !lastDate || today !== lastDate;
    if (dateChanged || forceUpdate) {
      const oldBoard = getBoard();
      // update stats
      if (oldBoard) {
        incrementBingos(countBingos(oldBoard), isFullBoardBingo(oldBoard));
      }
      // generate new board
      console.log('New day, new board!');
      const size = getBoardSize() || DEFAULT_BOARD_SIZE;
      const newBoard = generateBoard(undefined, size);
      saveBoard(newBoard);
      window.localStorage.setItem(DATE_GENERATED, today);
    }
    setBoard(getBoard());
  }, []);
}