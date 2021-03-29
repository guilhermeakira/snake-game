import React, { FC, useCallback, useEffect, useState } from 'react';

import useInterval from '../Hooks/useInterval';
import { DEFAULT_BOARD_SIZE, Direction, ArrowKeyDirectionMap } from './constants';
import { getBoard, getRandomFreeCell, getCellValueInDirection, isOutOfBounds } from './boardFunctions';
import { LinkedList } from '../LinkedList';

import './Board.css';

const Board: FC = () => {
  const [boardSize] = useState(DEFAULT_BOARD_SIZE);
  const [board] = useState(getBoard(boardSize));
  const [snake, setSnake] = useState(new LinkedList(getRandomFreeCell(boardSize)));
  const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value]));
  const [foodCell, setFoodCell] = useState(new Set([getRandomFreeCell(boardSize, snakeCells)]));
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

  const handleGameOver = (): void => {
    const snakeStartingCellValue = getRandomFreeCell(boardSize);
    setHasStarted(false);
    setSnake(new LinkedList(snakeStartingCellValue));
    setSnakeCells(new Set([snakeStartingCellValue]))
    setFoodCell(new Set([getRandomFreeCell(boardSize, snakeCells)]));
  }

  const handleSnakeMovement = (): void => {
    if (!hasStarted) {
      return;
    }
    const previousTailValue = snake.tail.value;
    const previousHeadValue = snake.head.value;
    const nextHeadValue = getCellValueInDirection(previousHeadValue, direction, boardSize);

    snake.head.value = nextHeadValue;

    if (isOutOfBounds(previousHeadValue, nextHeadValue, boardSize)) {
      handleGameOver();
      return;
    }

    const nextSnakeCells = new Set(snakeCells);
    nextSnakeCells.delete(previousTailValue);
    nextSnakeCells.add(nextHeadValue);

    setSnakeCells(nextSnakeCells);
  };

  const handleKeyDown: (event: KeyboardEvent) => void = useCallback((event) => {
    const newDirection: Direction = ArrowKeyDirectionMap[event.key];
    if (!newDirection) {
      return;
    }
    if (!hasStarted) {
      setHasStarted(true);
    }
    setDirection(newDirection);
  }, [hasStarted]);

  useInterval(() => {
    handleSnakeMovement();
  }, 500);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
