import "./style.css";

const NUM_X = 7;
const NUM_Y = 6;
const FRAMERATE = 1;
let isRedTurn = true;
let isResolving = false;
let isEndGame = false;
let tickCount = 0;

let board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

//create container
const container = document.createElement("div");
container.classList.add("container");
document.body.appendChild(container);

//create engame
const endgame = document.createElement("div");
endgame.classList.add("endgame");
document.body.appendChild(endgame);

const endgameText = document.createElement("h1");
endgameText.classList.add("endgame-text");
endgame.appendChild(endgameText);

const endgameButton = document.createElement("button");
endgameButton.classList.add("endgame-button");
endgameButton.innerText = "Play Again";
endgame.appendChild(endgameButton);

const showEndGame = () => {
  isEndGame = true;
  endgameText.innerText = isRedTurn ? "Jaune gagne" : "Rouge gagne";
  endgame.style.display = "flex";
  console.table(board);
};

const resetGame = () => {
  isEndGame = false;
  isRedTurn = true;
  for (let i = NUM_Y - 1; i >= 0; i--) {
    for (let j = 0; j < NUM_X; j++) {
      board[i][j] = 0;
    }
  }
  endgame.style.display = "none";
};
endgameButton.addEventListener("click", resetGame);

const onClickPion = (event) => {
  if (isResolving) {
    return;
  }

  const pion = event.target;

  if (pion.classList.contains("red") || pion.classList.contains("yellow")) {
    return;
  }

  board[pion.dataset.y][pion.dataset.x] = isRedTurn ? 1 : 2;

  isRedTurn = !isRedTurn;
};

//create pion
for (let i = 0; i < NUM_Y; i++) {
  const row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  for (let j = 0; j < NUM_X; j++) {
    const pion = document.createElement("div");
    pion.classList.add("pion");

    pion.dataset.x = j;
    pion.dataset.y = i;

    row.appendChild(pion);

    if (i === 0) {
      pion.classList.add("top");
      pion.addEventListener("click", onClickPion);
    }
  }
}

const updateBoard = () => {
  for (let i = 0; i < NUM_Y; i++) {
    for (let j = 0; j < NUM_X; j++) {
      const pion = document.querySelector(
        `.pion[data-x="${j}"][data-y="${i}"]`
      );

      const cell = board[i][j];

      switch (cell) {
        case 0:
          pion.classList.remove("red");
          pion.classList.remove("yellow");
          break;
        case 1:
          pion.classList.add("red");
          break;
        case 2:
          pion.classList.add("yellow");
          break;
      }
    }
  }
};

const checkVictory = () => {
  if (isResolving || isEndGame) {
    return;
  }

  //check horizontal
  for (let i = 0; i < NUM_Y; i++) {
    for (let j = 0; j < NUM_X - 3; j++) {
      const cell = board[i][j];

      if (cell === 0) {
        continue;
      }

      if (
        cell === board[i][j + 1] &&
        cell === board[i][j + 2] &&
        cell === board[i][j + 3]
      ) {
        console.log("victory");
        showEndGame();
        return;
      }
    }
  }

  //check vertical
  for (let i = 0; i < NUM_Y - 3; i++) {
    for (let j = 0; j < NUM_X; j++) {
      const cell = board[i][j];

      if (cell === 0) {
        continue;
      }

      if (
        cell === board[i + 1][j] &&
        cell === board[i + 2][j] &&
        cell === board[i + 3][j]
      ) {
        console.log("victory");
        showEndGame();
        return;
      }
    }
  }

  //check diagonal
  for (let i = 0; i < NUM_Y - 3; i++) {
    for (let j = 0; j < NUM_X - 3; j++) {
      const cell = board[i][j];

      if (cell === 0) {
        continue;
      }

      if (
        cell === board[i + 1][j + 1] &&
        cell === board[i + 2][j + 2] &&
        cell === board[i + 3][j + 3]
      ) {
        console.log("victory");
        showEndGame();
        return;
      }
    }
  }

  //check diagonal
  for (let i = 0; i < NUM_Y - 3; i++) {
    for (let j = 3; j < NUM_X; j++) {
      const cell = board[i][j];

      if (cell === 0) {
        continue;
      }

      if (
        cell === board[i + 1][j - 1] &&
        cell === board[i + 2][j - 2] &&
        cell === board[i + 3][j - 3]
      ) {
        console.log("victory");
        showEndGame();
        return;
      }
    }
  }
};

const tick = () => {
  requestAnimationFrame(tick);

  if (isEndGame) {
    return;
  }

  if (tickCount < FRAMERATE) {
    tickCount++;
    return;
  } else {
    tickCount = 0;
  }

  //check board if empty cell below
  for (let i = NUM_Y - 1; i >= 0; i--) {
    for (let j = 0; j < NUM_X; j++) {
      const cell = board[i][j];

      if (cell === 0 || i === NUM_Y - 1) {
        continue;
      }

      if (board[i + 1][j] === 0) {
        board[i][j] = 0;
        board[i + 1][j] = cell;
        isResolving = true;
      }
    }
  }

  updateBoard();

  if (!isResolving) {
    checkVictory();
  }

  isResolving = false;
};

tick();
