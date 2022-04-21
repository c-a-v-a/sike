import type { coords } from './events';
import { emptyCells } from './board';
import { BOARD_SIZE, renderStaticBoard, renderBoard } from './board';

/** Type for searching function */
type searchFunction = (coord: number, offset: number) => number;

// CONSTANTS
const COLORS = ['red', 'green', 'blue', 'purple', 'pink', 'black', 'yellow'];
const PREDICTION_CONTAINERS = [
  document.getElementById('p1'),
  document.getElementById('p2'),
  document.getElementById('p3')
];
const SCORE_CONTAINER = document.getElementById('score') as HTMLDivElement;
const BALLS_CONTAINER = document.getElementById('ball-count') as HTMLDivElement;
const BALLS_TRESHOLD = 3;

/**
 * Decorator funtction couting amount of total spawned balls
 */
function count(target: Object, name: string, descriptior: PropertyDescriptor) {
  let o = descriptior.value;

  descriptior.value = function(...args: Array<any>) {
    window.ballsCount++;
    BALLS_CONTAINER.innerText = `balls: ${window.ballsCount}`;

    let res = o.apply(this, args);
    return res;
  }
}

/** Class representing a ball */
export class Ball {
  color: string;
  x: number;
  y: number;
  path: boolean;

  constructor(color: string, x: number, y: number, path: boolean) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.path = path;

    if (!path)
      this.notPath();
  }

  @count
  notPath() {
    console.log('new ball');
  }
}

/**
 * Gets 3 next balls that will be spawned
 * @returns array of those balls
 */
export function getPrediction(): Array<string> {
  return [randomColor(COLORS), randomColor(COLORS), randomColor(COLORS)];
}

/**
 * Renders predicted balls into 'helper' field
 * @param predictions array of predicted balls
 */
export function renderPredictions(predictions: Array<string>) {
  predictions.map((value, index) => {
    PREDICTION_CONTAINERS[index]!.style.backgroundColor = value;
  })
}

/**
 * Picks random color from color list
 * @param colors array of colors
 * @returns picked color
 */
function randomColor(colors: Array<string>): string {
  return colors[Math.floor(Math.random() * 7)];
}

/**
 * Creates predicted balls and puts them on game board
 * @param prediction array of predicted balls
 * @returns true if game is lost
 */
export function createBalls(prediction: Array<string>): boolean {
  let empty = emptyCells(window.board);

  if (empty.length < 3) {
    window.alert('u loose')
    renderStaticBoard();
    return true;
  }

  for (let color of prediction) {
    let index = Math.floor(Math.random() * empty.length);

    let ball = new Ball(color, empty[index][0], empty[index][1], false);
    window.board[empty[index][1]][empty[index][0]] = ball;

    setTimeout(() => {
      removeBalls({ x: empty[index][0], y: empty[index][1] }, ball);
      window.valueToSwap = null;
      renderBoard();
    }, 1000)

    empty.splice(index, 1);
  }

  return false;
}

/**
 * Function that removes balls (ouch!)
 * @param coords coordinates of starting ball
 * @param ball Ball object
 */
export function removeBalls(coords: coords, ball: Ball) {
  // horizontal
  let points = [ball]
  let firstArr = ballSearch(ball, (coord, offset) => coord, leftSearch);
  let secondArr = ballSearch(ball, (coord, offset) => coord, rightSearch);

  points = [...points, ...clean([ball, ...firstArr, ...secondArr])];

  // Vertical
  firstArr = ballSearch(ball, leftSearch, (coord, offset) => coord);
  secondArr = ballSearch(ball, rightSearch, (coord, offset) => coord);

  points = [...points, ...clean([ball, ...firstArr, ...secondArr])];
  clean([ball, ...firstArr, ...secondArr]);

  // diagonal up to down
  firstArr = ballSearch(ball, leftSearch, leftSearch);
  secondArr = ballSearch(ball, rightSearch, rightSearch);

  points = [...points, ...clean([ball, ...firstArr, ...secondArr])];
  clean([ball, ...firstArr, ...secondArr]);

  // diagonal down to up
  firstArr = ballSearch(ball, rightSearch, leftSearch);
  secondArr = ballSearch(ball, leftSearch, rightSearch);

  points = [...points, ...clean([ball, ...firstArr, ...secondArr])];
  clean([ball, ...firstArr, ...secondArr]);

  if (points.length >= BALLS_TRESHOLD)
    calcPoints(points);
}

/** 
 * Calculates points from removed balls (ouch!)
 * @param points array of removed balls
 */
function calcPoints(points: Array<Ball>) {
  let secondArr: Array<Ball> = [];

  points.map((value) => {
    let x = false;

    secondArr.map((ball) => {
      if (ball.x === value.x && ball.y === value.y && ball.color === value.color)
        x = true;
    })

    if (!x) secondArr.push(value);
  });

  window.score += secondArr.length;
  SCORE_CONTAINER.innerText = `Score: ${window.score}`;
}

/**
 * Search function that goes left (or up)
 * @param coord current coordinates
 * @param offset current offset
 * @returns new coordinate
 */
function leftSearch(coord: number, offset: number): number {
  return coord - offset;
}

/**
 * Search function that goes left (or up)
 * @param coord current coordinates
 * @param offset current offset
 * @returns new coordinate
 */
function rightSearch(coord: number, offset: number): number {
  return coord + offset
}

/**
 * Finds ball of the same color
 * @param ball starting ball
 * @param ySearch search function used for searching i y axis
 * @param xSearch search function used for searching i x axis
 * @returns array of found balls
 */
function ballSearch(ball: Ball, ySearch: searchFunction, xSearch: searchFunction): Array<Ball> {
  let arr: Array<Ball> = []

  for (let i = 1; ; i++) {
    if (ySearch(ball.y, i) < 0 || ySearch(ball.y, i) >= BOARD_SIZE) break;
    if (xSearch(ball.x, i) < 0 || xSearch(ball.x, i) >= BOARD_SIZE) break;

    let b = window.board[ySearch(ball.y, i)][xSearch(ball.x, i)];
  
    if (!b) break;
    if (b.color === ball.color) arr.push(b);
  }

  return arr;
}

/**
 * Remove balls from board
 * @param arr array of balls to remove
 * @returns array of removed balls
 */
function clean(arr: Array<Ball>): Array<Ball> {
  let x = false;

  if (arr.length >= BALLS_TRESHOLD) {
    arr.map((value) => {
      x = true;
      window.board[value.y][value.x] = null;
    });
  }

  return x ? arr : [];
}
