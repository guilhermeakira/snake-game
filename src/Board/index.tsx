import React, { FC, useCallback, useEffect, useState } from 'react';

import useInterval from '../Hooks/useInterval';
import { DEFAULT_BOARD_SIZE, Direction, ArrowKeyDirectionMap } from './constants';
import { getBoard, getRandomFreeCell, getCellValueInDirection, isOutOfBounds } from './boardFunctions';
import { LinkedList, LinkedListNode } from '../LinkedList';

import './Board.css';

const Board: FC = () => {
  const [boardSize, setBoardSize] = useState(DEFAULT_BOARD_SIZE);
  const [board, setBoard] = useState(getBoard(boardSize));
  const [snake, setSnake] = useState(new LinkedList(getRandomFreeCell(boardSize)));
  const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value]));
  const [foodCell, setFoodCell] = useState(getRandomFreeCell(boardSize, snakeCells));
  const [direction, setDirection] = useState(Direction.Up);
  const [hasStarted, setHasStarted] = useState(false);

  const getClassName = (cellValue: number): string => {
    if (foodCell === cellValue) {
      return 'food';
    }

    if (snakeCells.has(cellValue)) {
      return 'snake';
    }

    return '';
  };

  const handleBoardSizeChange = (event: React.FormEvent<HTMLInputElement>) => {
    const possibleBoardSize = (parseInt(event.currentTarget.value));

    if (!possibleBoardSize || possibleBoardSize <= 1) {
      return;
    }

    setBoardSize(parseInt(event.currentTarget.value));
  }

  const handleReset: () => void = useCallback(() => {
    const snakeStartingCellValue = getRandomFreeCell(boardSize);
    setHasStarted(false);
    setSnake(new LinkedList(snakeStartingCellValue));
    setSnakeCells(new Set([snakeStartingCellValue]))
    setFoodCell(getRandomFreeCell(boardSize, new Set([snakeStartingCellValue])));
  }, [boardSize])

  const handleFoodConsumption = (): void => {
    setFoodCell(getRandomFreeCell(boardSize, snakeCells));
  }

  const growSnake = (previousTailValue: number): void => {
    const newTailNode = new LinkedListNode(previousTailValue)
    const currentTail = snake.tail;
    snake.tail = newTailNode;
    snake.tail.next = currentTail;
    const nextSnakeCells = new Set(snakeCells);
    nextSnakeCells.add(foodCell);

    setSnakeCells(nextSnakeCells);
  }

  const handleSnakeMovement = (): void => {
    if (!hasStarted) {
      return;
    }
    const previousTailValue = snake.tail.value;
    const previousHeadValue = snake.head.value;
    const nextHeadValue = getCellValueInDirection(previousHeadValue, direction, boardSize);

    const snakeOccupiedCells = new Set(snakeCells);
    snakeOccupiedCells.delete(previousTailValue);

    if (isOutOfBounds(previousHeadValue, nextHeadValue, boardSize)
      || snakeOccupiedCells.has(nextHeadValue)) {
      handleReset();
      return;
    }

    const newHeadNode = new LinkedListNode(nextHeadValue);
    const previousHeadNode = snake.head;
    snake.head = newHeadNode;
    previousHeadNode.next = newHeadNode;

    if (snake.tail.next !== null) {
      snake.tail = snake.tail.next;
    }

    const nextSnakeCells = new Set(snakeCells);
    nextSnakeCells.delete(previousTailValue);
    nextSnakeCells.add(nextHeadValue);

    setSnakeCells(nextSnakeCells);

    if (foodCell === nextHeadValue) {
      growSnake(previousTailValue);
      handleFoodConsumption();
    }
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
  }, 150);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setBoard(getBoard(boardSize));
    handleReset()
  }, [boardSize, handleReset]);

  return (
    <>
      <h1>Snake!</h1>
      <label htmlFor="boardSize">BoardSize</label>
      <input id="boardSize" value={boardSize} onChange={handleBoardSizeChange} />
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cellValue) => (
              <div key={cellValue} className={`cell ${getClassName(cellValue)}`}/>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default Board;
