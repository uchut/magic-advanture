const boardSize = 6;
const colors = ["red", "blue", "green", "yellow", "purple"];
const score = 50;
let curScore = 0;
let timeLeft = 90; 
let timerInterval;

let board = [];
let draggedTile = null;
let targetTile = null;

const images = [
    "image/red.png",
    "image/blue.png",
    "image/yellow.png",
    "image/green.png",
];

//게임 시작 시 보드 및 타이머 초기화 함수 실행
function startGame() {
    initializeBoard(); 
    startTimer(); 
}

//보드를 
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
            let image;
            do {
                image = images[Math.floor(Math.random() * images.length)];
            } while (
                (col >= 2 && image === board[row][col - 1] && image === board[row][col - 2]) ||
                (row >= 2 && image === board[row - 1][col] && image === board[row - 2][col])
            );
            board[row][col] = image;
        }
    }
}

function createTileElement(image, row, col) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.backgroundImage = `url(${image})`; // 이미지로 배경 설정
    tile.style.backgroundSize = "cover";          // 이미지를 타일 크기에 맞게 조정
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

    // 인접한 타일만 교환 가능하도록 설정 (상하좌우 한 칸 차이만 가능)
    if (
        (Math.abs(row1 - row2) === 1 && col1 === col2) ||
        (Math.abs(col1 - col2) === 1 && row1 === row2)
    ) {
        // 타일을 교환하기 전에 참조를 저장
        const draggedTileCopy = draggedTile;
        const targetTileCopy = targetTile;

        swapTiles(draggedTile, targetTile); // 타일 교환

        if (!checkMatches()) {
            // 매치가 없으면 원래 위치로 복구
            setTimeout(() => swapTiles(draggedTileCopy, targetTileCopy), 300);
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

    const tempImage = tile1.style.backgroundImage;
    tile1.style.backgroundImage = tile2.style.backgroundImage;
    tile2.style.backgroundImage = tempImage;
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


