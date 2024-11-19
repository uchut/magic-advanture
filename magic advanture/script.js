const colors = ["red", "blue", "green", "yellow", "purple"];
const score = [50, 100, 200];

let curScore = 0; //현재 점수
const firstTimeLeft = 45; //1스테이지 제한시간
let timeLeft = 45; //실제 카운트다운용 변수
let timerInterval; //간격

let stageNum = 1; //단계
let clearScore = 1000; //목표 점수
let isCleared = false;

let boardSize = 6; // 초기 크기를 6로 설정 (스테이지에 따라 증가)
let board = [];
let draggedTile = null;
let targetTile = null;

let isGameActive = false;

function startGame() {
    const timerBoard = document.getElementById("timer-board");
    const startButton = document.getElementById("timer-button");
    timerBoard.style.display = "block";
    startButton.style.display = "none";

    updateBoardSize(); // 스테이지에 맞게 보드 크기 업데이트
    initializeBoard(); // 보드 초기화
    isCleared = false;
    isGameActive = true;
    startTimer(); 
}

function updateBoardSize() {
    switch (stageNum) {
        case 1:
            boardSize = 6; // 1스테이지: 6x6
            break;
        case 2:
            boardSize = 6; // 2스테이지: 6x6
            break;
        case 3:
            boardSize = 8; // 3스테이지: 8x8
            break;
        case 4:
            boardSize = 8; // 4스테이지: 8x8
            break;
        case 5:
            boardSize = 10; // 5스테이지: 10x10
            break;
        default:
            boardSize = 5; // 기본값 (예외 처리)
    }
}

function initializeBoard() {
    updateBoardSize(); // 스테이지에 따라 보드 크기 업데이트

    const gameBoard = document.getElementById("game-board");
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

    board = Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => null));
    populateBoardWithoutMatches();

    gameBoard.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((color, colIndex) => {
            const tile = createTileElement(color, rowIndex, colIndex);
            gameBoard.appendChild(tile);
        });
    });

    const scoreBoard = document.getElementById("score-board");
    scoreBoard.innerText = "score: " + 0;
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

    const tempColor = tile1.style.backgroundColor;
    tile1.style.backgroundColor = tile2.style.backgroundColor;
    tile2.style.backgroundColor = tempColor;
}

function checkMatches() {
    if(!isGameActive)
        return false;

    let matchFound = false;
    const matchedTiles = new Set();
    let tempScore = 0;

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
        tempScore = score[Math.min(matchedTiles.size - 3, score.length - 1)];
        curScore += tempScore;
        const scoreBoard = document.getElementById("score-board");
        scoreBoard.innerText = 'score: ' + curScore;

        removeMatchedTiles(Array.from(matchedTiles));
        setTimeout(generateNewTiles, 500);
    }

    console.log(matchedTiles);

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



function startTimer() {
    const timerBoard = document.getElementById("timer-board");
    timerInterval = setInterval(() => {
        timeLeft--;
        timerBoard.innerText = `time: ${timeLeft}`;
        checkIsCleared();
        if(isCleared == true)
        {
            timerBoard.style.display = "none";
            clearInterval(timerInterval);
            return;
        }  
    }, 1000);
}

function checkIsCleared() {
    if(curScore >= clearScore)
    {
        curScore = 0;
        stageNum++;
        clearScore = stageNum * 1000;
        isCleared = true;
        endGame();
        return;
    }
    else
    {
        if (timeLeft <= 0) {
            endGame();
            return;
        } 
        return;
    }
}

function endGame() {
    const stageBoard = document.getElementById("stage-board");
    const timerBoard = document.getElementById("timer-board");
    const startButton = document.getElementById("timer-button");
    const scoreBoard = document.getElementById("score-board");

    scoreBoard.innerText = "score: " + 0;

    if (isCleared == true)
    {
        alert("클리어");
        stageBoard.innerText = "stage: " + stageNum;
        timeLeft = firstTimeLeft + (15 * (stageNum - 1));
        timerBoard.innerText = `time: ${timeLeft}`;
        startButton.style.display = "block";
    }

    else
    {
        alert("타임아웃");
        stageBoard.innerText = "stage: " + stageNum;
        timeLeft = firstTimeLeft;
        timerBoard.innerText = `time: ${timeLeft}`;
        startButton.style.display = "block";
    }

    isGameActive = false;
}


