import { Ball } from './ball';
import { BOARD_SIZE, renderBoard } from './board';

/** Type for node */
type node = {
  x: number,
  y: number,
  step: number,
}

/** Finds path from start to end coordinates */
export function findPath() {
  if (!window.startCoords || !window.endCoords) return;

  clearPath();

  let arr = bfs();
  renderPath(arr);

  console.log('dsfadsaf')
}

/** Bfs search */
function bfs() {
  let visited = [];
  let queue: Array<node> = [{ 
    x: window.startCoords!.x,
    y: window.startCoords!.y,
    step: 0
  }];

  while (queue.length > 0) {
    let node = queue.shift() as node;
    
    visited.push(node);

    if (node.x === window.endCoords!.x && node.y === window.endCoords!.y) {
      let curr = node;
      let arr = [curr];

      while (curr.step != 0) {
        visited.map((value) => {
          if (value.step === (curr.step - 1) && isConnected(curr, value)) {
            arr.push(value);
            curr = value;
          }
        });
      }

      window.canMove = true;
      return arr;
    }

    if (!includesNode({ x: node.x + 1, y: node.y, step: 0 }, visited, queue) && node.x + 1 < BOARD_SIZE) 
      queue.push({ x: node.x + 1, y: node.y, step: node.step + 1 });
    if (!includesNode({ x: node.x - 1, y: node.y, step: 0 }, visited, queue) && node.x - 1 >= 0) 
      queue.push({ x: node.x - 1, y: node.y, step: node.step + 1 });
    if (!includesNode({ x: node.x, y: node.y + 1, step: 0 }, visited, queue) && node.y + 1 < BOARD_SIZE) 
      queue.push({ x: node.x, y: node.y + 1, step: node.step + 1 });
    if (!includesNode({ x: node.x, y: node.y - 1, step: 0 }, visited, queue) && node.y - 1 >= 0) 
      queue.push({ x: node.x, y: node.y - 1, step: node.step + 1 });
  }

  window.canMove = false;
  return [];
}

/**
 * Checks if node is included in visited or queue
 * @param node checked node
 * @param visited array of visited nodes
 * @param queue node queue
 * @returns true if visited or queue includes node
 */
function includesNode(node: node, visited: Array<node>, queue: Array<node>) {
  for (let value of visited)
     if (node.x === value.x && node.y === value.y) return true;

  for (let value of queue)
     if (node.x === value.x && node.y === value.y) return true;

  if (node.y < BOARD_SIZE && node.y >= 0 && node.x >= 0 && node.x < BOARD_SIZE)
    if (window.board[node.y][node.x] !== null)
      return true;

  return false;
}

/**
 * Checks if nodes are connected
 * @param node first node
 * @param secondNode second node
 * @returns true if nodes are connected
 */
function isConnected(node: node, secondNode: node) {
  return (Math.abs(node.x - secondNode.x) <= 1 && Math.abs(node.y - secondNode.y) <= 1);
}

/**
 * Renders found path
 * @param arr found path
 */
function renderPath(arr: Array<node>) {
  arr.map((value) => {
    let b = window.board[value.y][value.x];

    if (b === null) {
      let ball = new Ball('gray', value.x, value.y, true);
      ball.path = true

      window.board[value.y][value.x] = ball;
    }
  });

  renderBoard();
}

/** Clears old path from board */
export function clearPath() {
  window.board.map((row, iRow) => {
    row.map((value, iCell) => {
      if (value?.color === 'gray')
        window.board[iRow][iCell] = null;
    });
  })
}
