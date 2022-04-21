import type { coords } from './events';
import { Ball } from './ball';
import { clickEvent, hoverEvent } from './events'

/** Type for game board */
export type board = Array<Array<Ball|null>>;

const TABLE = document.getElementById('table') as HTMLTableElement;
export const BOARD_SIZE = 9;

/**
 * Creates game board
 * @returns created game board
 */
export function createBoard(): board {
  let board: board = new Array(BOARD_SIZE);

  for (let i = 0; i < BOARD_SIZE; i++) {
    let row = new Array(BOARD_SIZE);
      
    for (let j = 0; j < BOARD_SIZE; j++)
      row[j] = null;

    board[i] = row;
  }

  return board;
}

/** Renders new board with event interactions */
export function renderBoard() {
  TABLE.innerHTML = '';

  for (let i = 0; i < BOARD_SIZE; i++) {
    let tr = document.createElement('tr');

    for (let j = 0; j < BOARD_SIZE; j++) {
      let td = document.createElement('td');
      let div = document.createElement('div');
      let cell = window.board[i][j];

      if (cell !== null) {
        if (cell.path)
          td.style.backgroundColor = cell.color;
        else {
          div.classList.add('ball');
          div.style.backgroundColor = cell.color;

          if (window.selected)
            if (cell.x === window.selected.x && cell.y === window.selected.y)
              div.classList.add('ball-selected');
        }
      }

      td.onmousedown = () => {
        clickEvent(cell, { x: j, y: i });
      };

      td.onmousemove = () => {
        hoverEvent({ x: j, y: i });
      }

      td.appendChild(div);
      tr.appendChild(td);
    }

    TABLE.appendChild(tr);
  }
}

/** Renders new board with no event handles */
export function renderStaticBoard() {
  TABLE.innerHTML = '';

  for (let i = 0; i < BOARD_SIZE; i++) {
    let tr = document.createElement('tr');

    for (let j = 0; j < BOARD_SIZE; j++) {
      let td = document.createElement('td');
      let div = document.createElement('div');
      let cell = window.board[i][j];

      if (cell !== null) {
        if (cell.path)
          td.style.backgroundColor = cell.color;
        else {
          div.classList.add('ball');
          div.style.backgroundColor = cell.color;

          if (window.selected)
            if (cell.x === window.selected.x && cell.y === window.selected.y)
              div.classList.add('ball-selected');
        }
      }
      td.appendChild(div);
      tr.appendChild(td);
    }

    TABLE.appendChild(tr);
  }
}

/**
 * Finds empty board cells
 * @param board game board
 * @returns empty cells coordinates
 */
export function emptyCells(board: board): Array<Array<number>> {
  let arr: Array<Array<number>> = [];

  board.map((row: Array<Ball|null>, iRow: number) => {
    row.map((cell: Ball|null, iCell: number) => {
      if (cell === null)
        arr.push([iCell, iRow]);
    });
  });

  return arr;
}
