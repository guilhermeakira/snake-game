import { DIRECTION } from './constants';

export const getBoard = (boardSize: number): number[][] => {
  const board = [];
  let counter = 1;
  for (let row = 0; row < boardSize; row++) {
    const currentRow = [];
    for (let column = 0; column < boardSize; column++) {
      currentRow.push(counter++);
    }
    board.push(currentRow);
  }
  return board;
}

export const getRandomCell = (boardSize: number): number => Math.floor(Math.random() * boardSize * boardSize) + 1;

export const getRandomFreeCell = (boardSize: number, blackList?: Set<number>): number => {
  let possibleValue = getRandomCell(boardSize);
  if (!blackList) {
    return possibleValue;
  }
  while (blackList.has(possibleValue)) {
    possibleValue = getRandomCell(boardSize);
  }
  return possibleValue;
}


export const getCellValueInDirection = (currentHeadValue: number, direction: DIRECTION, boardSize: number): number => {
  if (direction === DIRECTION.UP) {
    return currentHeadValue - boardSize;
  }
  if (direction === DIRECTION.DOWN) {
    return currentHeadValue + boardSize;
  }
  if (direction === DIRECTION.RIGHT) {
    return currentHeadValue + 1;
  }
  if (direction === DIRECTION.LEFT) {
    return currentHeadValue - 1;
  }
  return currentHeadValue;
}

