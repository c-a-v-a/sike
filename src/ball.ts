import type { coords } from './events';
import { emptyCells } from './board';
import { BOARD_SIZE, renderStaticBoard, renderBoard } from './board';

type searchFunction = (coord: number, offset: number) => number;

const COLORS = ['red', 'green', 'blue', 'purple', 'pink', 'black', 'yellow'];
const PREDICTION_CONTAINERS = [
  document.getElementById('p1'),
  document.getElementById('p2'),
  document.getElementById('p3')
];
const SCORE_CONTAINER = document.getElementById('score') as HTMLDivElement;
const BALLS_CONTAINER = document.getElementById('ball-count') as HTMLDivElement;
const BALLS_TRESHOLD = 3;

function count(target: Object, name: string, descriptior: PropertyDescriptor) {
  let o = descriptior.value;

  descriptior.value = function(...args: Array<any>) {
    window.ballsCount++;
    BALLS_CONTAINER.innerText = `balls: ${window.ballsCount}`;

    let res = o.apply(this, args);
    return res;
  }
}

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

export function getPrediction(): Array<string> {
  return [randomColor(COLORS), randomColor(COLORS), randomColor(COLORS)];
}

export function renderPredictions(predictions: Array<string>) {
  predictions.map((value, index) => {
    PREDICTION_CONTAINERS[index]!.style.backgroundColor = value;
  })
}

function randomColor(colors: Array<string>): string {
  return colors[Math.floor(Math.random() * 7)];
}

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

function leftSearch(coord: number, offset: number): number {
  return coord - offset;
}

function rightSearch(coord: number, offset: number): number {
  return coord + offset
}

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

function clean(arr: Array<Ball>) {
  let x = false;

  if (arr.length >= BALLS_TRESHOLD) {
    arr.map((value) => {
      x = true;
      window.board[value.y][value.x] = null;
    });
  }

  return x ? arr : [];
}
