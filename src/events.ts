import { Ball, removeBalls } from './ball';
import { mainLoop } from './main';
import { renderBoard, renderStaticBoard } from './board';
import { findPath, clearPath } from './pathfinding'

/** Type for coordinates */
export type coords = {
  x: number,
  y: number,
}

/**
 * Handle click interactions on board
 * @param value value of clicked cell
 * @param coords coordinates of clicked cell
 */
export function clickEvent(value: Ball|null, coords: coords) {
  if (window.canMove && window.startCoords !== null && (value === null || value.path === true)) {
    window.valueToSwap!.x = coords.x;
    window.valueToSwap!.y = coords.y

    window.board[coords.y][coords.x] = window.valueToSwap;
    window.board[window.startCoords.y][window.startCoords.x] = new Ball('gray', window.startCoords.x, window.startCoords.y, true);

    window.startCoords = null;
    window.selected = null;

    findPath();
    renderStaticBoard();

    setTimeout(() => {
      removeBalls(coords, window.valueToSwap as Ball);

      window.valueToSwap = null;

      clearPath();
      mainLoop();
    }, 2000);
  }
  else if (window.startCoords === null && value !== null) {
    window.startCoords = coords;
    window.valueToSwap = value;

    window.selected = coords;
    renderBoard();
  }
  else if (window.startCoords !== null && value !== null) {
    window.startCoords = coords;
    window.valueToSwap = value;

    window.selected = coords;
    renderBoard();
  }
}

/**
 * Handle hover events
 * @param coords coordinates of cell
 */
export function hoverEvent(coords: coords) {
  window.endCoords = coords;
  let cell = window.board[coords.y][coords.x]

  if (cell === null || cell.path === true) {
    findPath();
  }

  renderBoard()
}
