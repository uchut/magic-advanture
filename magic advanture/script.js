const boardSize = 8;
const colors = ["red", "blue", "green", "yellow", "purple"];

let board = [];
let draggedTile = null;
let targetTile = null;

// 게임 시작 시 보드 생성
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

// 게임 시작 시 매치된 타일 없이 보드 초기화하는 함수
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

// 타일을 생성하는 함수
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

// 드래그 시작 시 호출되는 함수
function handleDragStart(event) {
    draggedTile = event.target;
}

// 드래그된 타일이 다른 타일 위에 있을 때 호출되는 함수
function handleDragOver(event) {
    event.preventDefault();
}

// 드랍 시 호출되는 함수
function handleDrop(event) {
    targetTile = event.target;

    const row1 = parseInt(draggedTile.dataset.row);
    const col1 = parseInt(draggedTile.dataset.col);
    const row2 = parseInt(targetTile.dataset.row);
    const col2 = parseInt(targetTile.dataset.col);

    // 인접한 타일만 교환 가능하도록 설정
    if (
        (Math.abs(row1 - row2) === 1 && col1 === col2) ||
        (Math.abs(col1 - col2) === 1 && row1 === row2)
    ) {
        swapTiles(draggedTile, targetTile);
        if (!checkMatches()) {
            setTimeout(() => swapTiles(draggedTile, targetTile), 500); // 매치가 없으면 원래 위치로 복구
        }
    }
}

// 드래그 종료 시 호출되는 함수
function handleDragEnd() {
    draggedTile = null;
    targetTile = null;
}

// 두 타일을 교환하는 함수
function swapTiles(tile1, tile2) {
    const row1 = parseInt(tile1.dataset.row);
    const col1 = parseInt(tile1.dataset.col);
    const row2 = parseInt(tile2.dataset.row);
    const col2 = parseInt(tile2.dataset.col);

    // 보드 배열에서 색상 교환
    const temp = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = temp;

    // 화면 상의 타일 색상 교환
    const tempColor = tile1.style.backgroundColor;
    tile1.style.backgroundColor = tile2.style.backgroundColor;
    tile2.style.backgroundColor = tempColor;
}

// 매치가 있는지 확인하는 함수
function checkMatches() {
    let matchFound = false;
    const matchedTiles = new Set();

    // 가로 방향 매치 검사
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

    // 세로 방향 매치 검사
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

    // 매치된 타일이 있을 경우 타일 삭제 후 생성
    if (matchFound) {
        removeMatchedTiles(Array.from(matchedTiles));
        setTimeout(generateNewTiles, 500); // 매치된 자리 채우기
    }
    return matchFound;
}

// 매치된 타일을 제거하는 함수
function removeMatchedTiles(matchedTiles) {
    matchedTiles.forEach(tilePos => {
        const [row, col] = tilePos.split(',').map(Number);
        board[row][col] = null;
        const tile = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
        if (tile) {
            tile.classList.add("hidden"); // 타일 숨김 처리
        }
    });
}

// 새로운 타일을 생성하는 함수
function generateNewTiles() {
    const gameBoard = document.getElementById("game-board");

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === null) {
                const newColor = colors[Math.floor(Math.random() * colors.length)];
                board[row][col] = newColor;

                const tile = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
                tile.style.backgroundColor = newColor;
                tile.classList.remove("hidden"); // 숨김 해제
            }
        }
    }

    // 매치가 있는지 재검사 후 매치가 있으면 새로운 타일 생성
    setTimeout(() => {
        if (checkMatches()) {
            setTimeout(generateNewTiles, 500);
        }
    }, 500);
}

// 게임 초기화 함수 호출
initializeBoard();
