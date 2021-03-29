import { Direction } from './constants';

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


export const getCellValueInDirection = (currentHeadValue: number, direction: Direction, boardSize: number): number => {
  if (direction === Direction.Up) {
    return currentHeadValue - boardSize;
  }
  if (direction === Direction.Down) {
    return currentHeadValue + boardSize;
  }
  if (direction === Direction.Right) {
    return currentHeadValue + 1;
  }
  if (direction === Direction.Left) {
    return currentHeadValue - 1;
  }
  return currentHeadValue;
}

export const isOutOfBounds = (previousHeadValue: number, nextHeadValue: number, boardSize: number): boolean => {
  const isOutOfBoundsUp = nextHeadValue < 1;
  if (isOutOfBoundsUp) {
    return true;
  }

  const isOutOfBoundsDown = nextHeadValue > boardSize * boardSize;
  if (isOutOfBoundsDown) {
    return true;
  }

  const currentHeadValueIsFarLeft = previousHeadValue % boardSize === 1;
  const nextHeadValueIsFarRight = nextHeadValue % boardSize === 0;
  const isOutOfBoundsLeft = currentHeadValueIsFarLeft && nextHeadValueIsFarRight;
  if (isOutOfBoundsLeft) {
    return true;
  }

  const currentHeadValueIsFarRight = previousHeadValue % boardSize === 0;
  const nextHeadValueIsFarLeft = nextHeadValue % boardSize === 1;
  const isOutOfBoundsRight = currentHeadValueIsFarRight && nextHeadValueIsFarLeft;
  if (isOutOfBoundsRight) {
    return true;
  }

  return false;
}
