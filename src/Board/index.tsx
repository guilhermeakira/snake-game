import React, { FC, useCallback, useState } from 'react';

import { DEFAULT_BOARD_SIZE, DIRECTION } from './constants';

import './Board.css';

const getBoard = (boardSize: number): number[][] => {
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

const getRandomCell = (boardSize: number): number => Math.floor(Math.random() * boardSize * boardSize) + 1;

const getRandomFreeCell = (boardSize: number, blackList?: Set<number>): number => {
  let possibleValue = getRandomCell(boardSize);
  if (!blackList) {
    return possibleValue;
  }
  while (blackList.has(possibleValue)) {
    possibleValue = getRandomCell(boardSize);
  }
  return possibleValue;
}

const Board: FC = () => {
  const [boardSize] = useState(DEFAULT_BOARD_SIZE);
  const [board] = useState(getBoard(boardSize));
  const [snake] = useState(new Set([getRandomFreeCell(boardSize)]));
  const [food] = useState(new Set([getRandomFreeCell(boardSize, snake)]));
  const [direction] = useState(DIRECTION.UP);

  const getClassName: (cellValue: number) => string = useCallback((cellValue) => {
    if (food.has(cellValue)) {
      return 'food';
    }

    if (snake.has(cellValue)) {
      return 'snake';
    }

    return '';
  }, [snake, food])

  return (
    <>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cellValue) => (
            <div key={cellValue} className={`cell ${getClassName(cellValue)}`}>{cellValue}</div>
          ))}
        </div>
      ))}
    </>
  )
}

export default Board;
