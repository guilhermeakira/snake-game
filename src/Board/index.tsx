import React, { FC, useState } from 'react';

import useInterval from '../Hooks/useInterval';
import { DEFAULT_BOARD_SIZE, DIRECTION } from './constants';
import { getBoard, getRandomFreeCell, getCellValueInDirection } from './boardFunctions';
import { LinkedList } from '../LinkedList';

import './Board.css';

const Board: FC = () => {
  const [boardSize] = useState(DEFAULT_BOARD_SIZE);
  const [board] = useState(getBoard(boardSize));
  const [snake] = useState(new LinkedList(getRandomFreeCell(boardSize)));
  const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value]));
  const [foodCell] = useState(new Set([getRandomFreeCell(boardSize, snakeCells)]));
  const [direction] = useState(DIRECTION.UP);

  const getClassName = (cellValue: number): string => {
    if (foodCell.has(cellValue)) {
      return 'food';
    }

    if (snakeCells.has(cellValue)) {
      return 'snake';
    }

    return '';
  };

  const handleSnakeMovement = (): void => {
    const previousTailValue = snake.tail.value;
    const nextHeadValue = getCellValueInDirection(snake.head.value, direction, boardSize);

    snake.head.value = nextHeadValue;

    const nextSnakeCells = new Set(snakeCells);
    nextSnakeCells.delete(previousTailValue);
    nextSnakeCells.add(nextHeadValue);

    setSnakeCells(nextSnakeCells);
  };

  useInterval(() => {
    handleSnakeMovement();
  }, 500);

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
