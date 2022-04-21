import type { board } from './board';
import type { coords } from './events';
import { createBoard, renderBoard } from './board';
import { getPrediction, createBalls, Ball, renderPredictions } from './ball';

/** Global window interface */
declare global {
  interface Window {
    startCoords: coords|null;
    endCoords: coords|null;
    valueToSwap: Ball|null;
    board: board;
    canMove: boolean;
    score: number;
    ballsCount: number;
    selected: coords|null;
  }
}
window.startCoords = null;
window.canMove = false;
window.valueToSwap = null;
window.board = createBoard();
window.score = 0;
window.ballsCount = 0;
window.selected = null;
renderBoard();
let prediction = getPrediction();

mainLoop();

/** Main game loop */
export function mainLoop() {
  let fail = createBalls(prediction);

  if (fail) return;

  renderBoard();
  prediction = getPrediction();
  renderPredictions(prediction);
}
