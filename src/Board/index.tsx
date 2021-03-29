import React, { FC, useEffect, useState } from 'react';

import useInterval from '../Hooks/useInterval';
import { DEFAULT_BOARD_SIZE, Direction, ArrowKeyDirectionMap } from './constants';
import { getBoard, getRandomFreeCell, getCellValueInDirection } from './boardFunctions';
import { LinkedList } from '../LinkedList';

import './Board.css';

const Board: FC = () => {
  const [boardSize] = useState(DEFAULT_BOARD_SIZE);
  const [board] = useState(getBoard(boardSize));
  const [snake] = useState(new LinkedList(getRandomFreeCell(boardSize)));
  const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value]));
  const [foodCell] = useState(new Set([getRandomFreeCell(boardSize, snakeCells)]));
  const [direction, setDirection] = useState(Direction.Up);
  const [hasStarted, setHasStarted] = useState(false);

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
    if (!hasStarted) {
      return;
    }
    const previousTailValue = snake.tail.value;
    const nextHeadValue = getCellValueInDirection(snake.head.value, direction, boardSize);

    snake.head.value = nextHeadValue;

    const nextSnakeCells = new Set(snakeCells);
    nextSnakeCells.delete(previousTailValue);
    nextSnakeCells.add(nextHeadValue);

    setSnakeCells(nextSnakeCells);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    setHasStarted(true);
    const newDirection: Direction = ArrowKeyDirectionMap[event.key];
    if (!newDirection) {
      return;
    }
    setDirection(newDirection);
  }

  useInterval(() => {
    handleSnakeMovement();
  }, 500);

  useEffect(() => {
    window.addEventListener('keydown', (e) => handleKeyDown(e));
  }, []);

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
