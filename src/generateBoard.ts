import { allExercises } from "./exercises";
import type { Exercise, Square, Board } from "./types";

const generateSquare = (exercise: Exercise): Square => {
  const { min: minNum, max: maxNum } = exercise;
  const num = Math.floor(minNum + Math.random() * (maxNum - minNum));
  return {
    exercise,
    num,
    checked: false
  };
}

export const generateBoard = (exercises: Exercise[] = allExercises, size: number = 4): Board => {
  const board: Board = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      const randomIndex = Math.floor(Math.random() * exercises.length);
      const randomExercise = exercises[randomIndex];
      const square = generateSquare(randomExercise);
      row.push(square);
    }
    board.push(row);
  }

  const centerIndex = Math.floor(size / 2);
  const freeSquare = {
    exercise: {
      name: 'FREE',
      min: 1,
      max: 1,
      units: 'freebie'
    },
    num: 1,
    checked: true
  };
  board[centerIndex][centerIndex] = freeSquare;
  return board;
}