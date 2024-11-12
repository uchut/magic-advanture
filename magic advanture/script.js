const boardSize = 8;
const colors = ["red", "blue", "green", "yellow", "purple"];
const score = 100;
let curScore = 0;
let timeLeft = 60; 
let timerInterval;

let board = [];
let draggedTile = null;
let targetTile = null;

function startGame() {
    initializeBoard(); 
    startTimer(); 
}

function initializeBoard() {
    board = Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => null));
    populateBoardWithoutMatches();

    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((color, colIndex) => {
            const tile = createTileElement(color, rowIndex, colIndex);
            gameBoard.appendChild(tile);
        });
    });
}

function populateBoardWithoutMatches() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            let color;
            do {
                color = colors[Math.floor(Math.random() * colors.length)];
            } while (
                (col >= 2 && color === board[row][col - 1] && color === board[row][col - 2]) ||
                (row >= 2 && color === board[row - 1][col] && color === board[row - 2][col])
            );
            board[row][col] = color;
        }
    }
}

function createTileElement(color, row, col) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.backgroundColor = color;
    tile.dataset.row = row;
    tile.dataset.col = col;

    tile.setAttribute("draggable", true);
    tile.addEventListener("dragstart", handleDragStart);
    tile.addEventListener("dragover", handleDragOver);
    tile.addEventListener("drop", handleDrop);
    tile.addEventListener("dragend", handleDragEnd);

    return tile;
}

function handleDragStart(event) {
    draggedTile = event.target;
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    targetTile = event.target;

    const row1 = parseInt(draggedTile.dataset.row);
    const col1 = parseInt(draggedTile.dataset.col);
    const row2 = parseInt(targetTile.dataset.row);
    const col2 = parseInt(targetTile.dataset.col);

    if (
        (Math.abs(row1 - row2) === 1 && col1 === col2) ||
        (Math.abs(col1 - col2) === 1 && row1 === row2)
    ) {
        swapTiles(draggedTile, targetTile);
        if (!checkMatches()) {
            setTimeout(() => swapTiles(draggedTile, targetTile), 500);
        }
    }
}

function handleDragEnd() {
    draggedTile = null;
    targetTile = null;
}

function swapTiles(tile1, tile2) {
    const row1 = parseInt(tile1.dataset.row);
    const col1 = parseInt(tile1.dataset.col);
    const row2 = parseInt(tile2.dataset.row);
    const col2 = parseInt(tile2.dataset.col);

    const temp = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = temp;

    const tempColor = tile1.style.backgroundColor;
    tile1.style.backgroundColor = tile2.style.backgroundColor;
    tile2.style.backgroundColor = tempColor;
}

function checkMatches() {
    let matchFound = false;
    const matchedTiles = new Set();

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize - 2; col++) {
            if (
                board[row][col] && board[row][col] === board[row][col + 1] &&
                board[row][col] === board[row][col + 2]
            ) {
                matchedTiles.add(`${row},${col}`);
                matchedTiles.add(`${row},${col + 1}`);
                matchedTiles.add(`${row},${col + 2}`);
                matchFound = true;
            }
        }
    }

    for (let col = 0; col < boardSize; col++) {
        for (let row = 0; row < boardSize - 2; row++) {
            if (
                board[row][col] && board[row][col] === board[row + 1][col] &&
                board[row][col] === board[row + 2][col]
            ) {
                matchedTiles.add(`${row},${col}`);
                matchedTiles.add(`${row + 1},${col}`);
                matchedTiles.add(`${row + 2},${col}`);
                matchFound = true;
            }
        }
    }

    if (matchFound) {
        getScore();
        removeMatchedTiles(Array.from(matchedTiles));
        setTimeout(generateNewTiles, 500);
    }

    return matchFound;
}

function removeMatchedTiles(matchedTiles) {
    matchedTiles.forEach(tilePos => {
        const [row, col] = tilePos.split(',').map(Number);
        board[row][col] = null;
        const tile = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
        if (tile) {
            tile.classList.add("hidden");
        }
    });
}

function generateNewTiles() {
    const gameBoard = document.getElementById("game-board");

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === null) {
                const newColor = colors[Math.floor(Math.random() * colors.length)];
                board[row][col] = newColor;

                const tile = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
                tile.style.backgroundColor = newColor;
                tile.classList.remove("hidden");
            }
        }
    }

    setTimeout(() => {
        if (checkMatches()) {
            setTimeout(generateNewTiles, 500);
        }
    }, 500);
}

function getScore() {
    const scoreBoard = document.getElementById("score-board");
    curScore += score;
    scoreBoard.innerText = 'score: ' + curScore;
}

function startTimer() {
    const timerBoard = document.getElementById("timer-board");
    timerInterval = setInterval(() => {
        timeLeft--;
        timerBoard.innerText = `time: ${timeLeft}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000); 
}

function endGame() {
    alert("끝");
    
}



