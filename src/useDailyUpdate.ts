import { useEffect } from "react"
import { generateBoard } from "./generateBoard";
import type { Board } from "./types";
import { DATE_GENERATED, getBingos, getBoard, getFullBoardBingos, saveBoard, setBingos, setFullBoardBingos } from "./localStorageUtils";
import { countBingos, isFullBoardBingo } from "./boardUtils";

export const useDailyUpdate = (today: string, setBoard: (board: Board | null) => void, boardSize: number, forceUpdate = false): void => {
  useEffect(() => {
    const lastDate = window.localStorage.getItem(DATE_GENERATED);
    const dateChanged = !lastDate || today !== lastDate;
    if (dateChanged || forceUpdate) {
      const oldBoard = getBoard();
      // update stats
      if (oldBoard) {
        const oldBingos = getBingos();
        setBingos(oldBingos + countBingos(oldBoard));
        const isFullBingo = isFullBoardBingo(oldBoard);
        if (isFullBingo) {
          const oldFullBingos = getFullBoardBingos();
          setFullBoardBingos(oldFullBingos + 1)
        }
      }
      // generate new board
      console.log('New day, new board!');
      const newBoard = generateBoard(undefined, boardSize);
      saveBoard(newBoard);
      window.localStorage.setItem(DATE_GENERATED, today);
    }
    setBoard(getBoard());
  }, []);
}