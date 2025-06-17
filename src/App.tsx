import { useEffect, useRef, useState } from 'react';
import './App.css'
import { saveBoard, getFullBoardBingos, getBingos, clearStats, setBoardSize, incrementBingos } from './localStorageUtils';
import type { Board, Square } from './types';
import { useDailyUpdate } from './useDailyUpdate';
import { countBingos, isFullBoardBingo } from './boardUtils';
import { generateBoard } from './generateBoard';
import { allExercises } from './exercises';
import { LARGE_BOARD_SIZE, SMALL_BOARD_SIZE } from './boardConstants';

const FORCE_UPDATE = true;

function App() {
  const [board, setBoard] = useState<Board | null>(null);
  const [bingos, setBingos] = useState<number>(0);
  const [isFullBingo, setIsFullBingo] = useState(false);
  const [currentTimedSquare, setCurrentTimedSquare] = useState<Square | null>(null);
  const [focusedSquareIndex, setFocusedSquareIndex] = useState<{ row: number, col: number } | null>({ row: 0, col: 0 });
  const [timer, setTimer] = useState(0);
  const timerId = useRef<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[][]>([...Array(10).keys()].map(() => []));

  const totalBingos = getBingos();
  const totalFullBingos = getFullBoardBingos();

  const today = new Date(Date.now()).toLocaleDateString();
  useDailyUpdate(today, setBoard, FORCE_UPDATE);

  useEffect(() => {
    if (board) {
      saveBoard(board);
      setBingos(countBingos(board));
      setIsFullBingo(isFullBoardBingo(board));
    }
  }, [board]);

  useEffect(() => {
    if (focusedSquareIndex) {
      const { row, col } = focusedSquareIndex;
      buttonRefs.current[row][col]?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      buttonRefs.current[row][col]?.focus();
    }
  }, [focusedSquareIndex]);

  if (!board) {
    return null;
  }

  const toggleSquare = (row: number, col: number) => {
    const square = board[row][col];

    if (square.exercise.units === 'sec') {
      // cancel timer if ongoing
      if (square === currentTimedSquare) {
        if (timerId.current !== null) {
          setCurrentTimedSquare(null);
          setTimer(0);
          clearInterval(timerId.current);
        }
      }
      else {
        setCurrentTimedSquare(square);
        const ms = 10;
        const interval = setInterval(() => {
          const targetTime = square.num;
          setTimer(time => {
            if (targetTime && time >= targetTime) {
              clearInterval(interval);
              square.checked = true;
              return targetTime;
            }
            else {
              return time + (ms / 1000);
            }
          })
        }, ms);
        timerId.current = interval;
      }
    }
    else {
      setCurrentTimedSquare(null);
      setTimer(0);
      const newBoard = [...board];
      newBoard[row][col].checked = !square.checked;
      setBoard(newBoard);
    }

  }

  const handleSquareClick = (row: number, col: number) => {
    toggleSquare(row, col);
  }

  const handleArrowKeys: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (focusedSquareIndex) {
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'ArrowUp') {
        setFocusedSquareIndex((prevIndex) => {
          if (prevIndex) {
            const { row, col } = prevIndex;
            return ({ row: Math.max(0, row - 1), col });
          }
          return null;
        });
      }
      if (event.key === 'ArrowDown') {
        setFocusedSquareIndex((prevIndex) => {
          if (prevIndex) {
            const { row, col } = prevIndex;
            return ({ row: Math.min(row + 1, board.length - 1), col });
          }
          return null;
        });
      }
      if (event.key === 'ArrowLeft') {
        setFocusedSquareIndex((prevIndex) => {
          if (prevIndex) {
            const { row, col } = prevIndex;
            return ({ row, col: Math.max(0, col - 1) });
          }
          return null;
        });
      }
      if (event.key === 'ArrowRight') {
        setFocusedSquareIndex((prevIndex) => {
          if (prevIndex) {
            const { row, col } = prevIndex;
            return ({ row, col: Math.min(col + 1, board.length - 1) });
          }
          return null;
        });
      }
    }

  }

  const renderSquare = (square: Square, row: number, col: number) => {
    const { exercise, num, checked } = square;
    const { name, units } = exercise;
    const classNames = ['square', checked && 'checked', currentTimedSquare === square && 'current'];
    const calculatedClassName = classNames.filter(name => Boolean(name)).join(' ');

    return <td role="gridcell">
      <button
        ref={el => { buttonRefs.current[row][col] = el }}
        className={calculatedClassName}
        tabIndex={row === focusedSquareIndex?.row && col === focusedSquareIndex.col ? 0 : -1}
        aria-pressed={square.checked}
        onClick={() => handleSquareClick(row, col)}
        onFocus={() => setFocusedSquareIndex({ row, col })}
        onKeyDown={handleArrowKeys}
      >
        {square.checked && <svg>
          <line x1='0' y1='100%' x2='100%' y2='0' />
          <line x1='0' y1='0' x2='100%' y2='100%' />
        </svg>}
        <strong>{name}</strong>
        <p>{`${num} ${units}`}</p>
        {square === currentTimedSquare && <p>Timer: {timer.toFixed(2)}</p>}
      </button>
    </td >
  }

  const generateNewBoard = (size: number) => {
    // save any bingos from current board
    incrementBingos(countBingos(board), isFullBoardBingo(board));
    // then generate new board and save this size to use for future boards
    setBoard(generateBoard(allExercises, size));
    setBoardSize(size);
  }

  return <div className="app">
    <h1>Exercise Bingo</h1>
    <main>
      <div className="panel">
        <h2>Daily Challenge - {today}</h2>
        <div className="board">
          {bingos > 0 && <div className="bingo">
            {<span>Bingo! x{bingos}</span>} {isFullBingo && <strong>- FULL BINGO!</strong>}
          </div>}
          <table role="grid">
            <tbody>
              {board?.map((row, rowIndex) => <tr role="row">{row.map((square, colIndex) => renderSquare(square, rowIndex, colIndex))}</tr>)}
            </tbody>
          </table>
        </div>
        <div className="button-row">
          <button onClick={() => generateNewBoard(SMALL_BOARD_SIZE)}>New small board</button>
          <button onClick={() => generateNewBoard(LARGE_BOARD_SIZE)}>New large board</button>
        </div>
      </div>
      <div className="mini-panels">
        <div className="panel stats">
          <h2>Stats</h2>
          <p>Bingos: {totalBingos}</p>
          <p>Full bingos: {totalFullBingos}</p>
          <button onClick={clearStats}>Reset</button>
        </div>
      </div>
    </main>
  </div >
}

export default App
