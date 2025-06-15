export type Exercise = {
  name: string;
  min: number;
  max: number;
  units: string;
}

export type Square = {
  exercise: Exercise,
  num: number,
  checked: boolean
}

export type Board = Square[][];