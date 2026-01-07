// Juego del Laberinto (generador DFS, movimiento por celdas)

let mazeCanvas = null;
let mazeCtx = null;
let mazeCols = 21; // más difícil por defecto
let mazeRows = 15;
let cellSize = 40;
let mazeGrid = []; // celdas con paredes
let playerCol = 0;
let playerRow = 0;
let playerRadius = 10;
let mazeCompleted = false;
// Temporizador y pasos
let mazeSteps = 0;
let timerStart = null;
let timerInterval = null;

// Variables para swipe/touch
let touchStartX = null;
let touchStartY = null;

// dirección helpers
const DIRS = [
    { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
    { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
    { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
    { dx: -1, dy: 0, wall: 'left', opposite: 'right' }
];

function initMazeGame() {
    mazeCanvas = document.getElementById('mazeCanvas');
    mazeCtx = mazeCanvas.getContext('2d');

    // Ajustar tamaño de celdas para caber en canvas
    cellSize = Math.floor(Math.min(mazeCanvas.width / mazeCols, mazeCanvas.height / mazeRows));
    playerRadius = Math.max(8, Math.floor(cellSize * 0.35));

    // Generar laberinto
    generateMaze(mazeCols, mazeRows);

    playerCol = 0;
    playerRow = 0;
    mazeCompleted = false;
    document.getElementById('mazeMessage').textContent = '';

    // Evitar múltiples listeners
    document.removeEventListener('keydown', handleMazeKeyDown);
    document.addEventListener('keydown', handleMazeKeyDown);

    // Inicializar displays y listeners UI
    const regenBtn = document.getElementById('mazeRegenerateBtn');
    const restartBtn = document.getElementById('mazeRestartBtn');
    const diffSelect = document.getElementById('mazeDifficultySelect');
    const upBtn = document.getElementById('mazeUpBtn');
    const downBtn = document.getElementById('mazeDownBtn');
    const leftBtn = document.getElementById('mazeLeftBtn');
    const rightBtn = document.getElementById('mazeRightBtn');

    if (regenBtn) {
        regenBtn.onclick = () => {
            // elegir tamaño según dificultad
            const d = (diffSelect && diffSelect.value) ? diffSelect.value : 'medium';
            if (d === 'easy') newMaze(11, 7);
            else if (d === 'hard') newMaze(31, 21);
            else newMaze(21, 15);
        };
    }
    if (restartBtn) restartBtn.onclick = () => restartMaze();

    if (upBtn) upBtn.onclick = () => tryMoveBy(0, -1, 'top');
    if (downBtn) downBtn.onclick = () => tryMoveBy(0, 1, 'bottom');
    if (leftBtn) leftBtn.onclick = () => tryMoveBy(-1, 0, 'left');
    if (rightBtn) rightBtn.onclick = () => tryMoveBy(1, 0, 'right');

    // Swipe support on canvas
    if (mazeCanvas) {
        mazeCanvas.onpointerdown = (ev) => { touchStartX = ev.clientX; touchStartY = ev.clientY; };
        mazeCanvas.onpointerup = (ev) => {
            if (touchStartX === null || touchStartY === null) return;
            const dx = ev.clientX - touchStartX;
            const dy = ev.clientY - touchStartY;
            const absX = Math.abs(dx), absY = Math.abs(dy);
            const threshold = 30;
            if (absX > absY && absX > threshold) {
                if (dx > 0) tryMoveBy(1, 0, 'right'); else tryMoveBy(-1, 0, 'left');
            } else if (absY > absX && absY > threshold) {
                if (dy > 0) tryMoveBy(0, 1, 'bottom'); else tryMoveBy(0, -1, 'top');
            }
            touchStartX = null; touchStartY = null;
        };
    }

    // Reset timer and steps
    resetTimer();
    resetSteps();

    drawMaze();
}

function generateMaze(cols, rows) {
    // Inicializar celdas con todas las paredes
    mazeGrid = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push({ top: true, right: true, bottom: true, left: true, visited: false });
        }
        mazeGrid.push(row);
    }

    // Recursive backtracker
    const stack = [];
    const startC = 0, startR = 0;
    mazeGrid[startR][startC].visited = true;
    stack.push({ c: startC, r: startR });

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const { c, r } = current;
        // Buscar vecinos no visitados
        const neighbors = [];
        DIRS.forEach((d, i) => {
            const nc = c + d.dx;
            const nr = r + d.dy;
            if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && !mazeGrid[nr][nc].visited) {
                neighbors.push({ c: nc, r: nr, dirIndex: i });
            }
        });

        if (neighbors.length > 0) {
            // Elegir un vecino aleatorio
            const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
            const d = DIRS[chosen.dirIndex];
            // Quitar pared entre current y chosen
            mazeGrid[r][c][d.wall] = false;
            mazeGrid[chosen.r][chosen.c][d.opposite] = false;
            // Marcar visitado y apilar
            mazeGrid[chosen.r][chosen.c].visited = true;
            stack.push({ c: chosen.c, r: chosen.r });
        } else {
            stack.pop();
        }
    }

    // Dejar sin paredes la entrada y salida
    mazeGrid[0][0].left = false;
    mazeGrid[rows - 1][cols - 1].right = false;
}

function drawMaze() {
    // Fondo
    mazeCtx.fillStyle = '#fff';
    mazeCtx.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);

    // Dibujar celdas y paredes
    mazeCtx.strokeStyle = '#333';
    mazeCtx.lineWidth = Math.max(2, Math.floor(cellSize * 0.08));

    for (let r = 0; r < mazeRows; r++) {
        for (let c = 0; c < mazeCols; c++) {
            const cell = mazeGrid[r][c];
            const x = c * cellSize;
            const y = r * cellSize;

            // Pintar piso
            mazeCtx.fillStyle = '#f7fafc';
            mazeCtx.fillRect(x, y, cellSize, cellSize);

            mazeCtx.beginPath();
            if (cell.top) {
                mazeCtx.moveTo(x, y);
                mazeCtx.lineTo(x + cellSize, y);
            }
            if (cell.right) {
                mazeCtx.moveTo(x + cellSize, y);
                mazeCtx.lineTo(x + cellSize, y + cellSize);
            }
            if (cell.bottom) {
                mazeCtx.moveTo(x + cellSize, y + cellSize);
                mazeCtx.lineTo(x, y + cellSize);
            }
            if (cell.left) {
                mazeCtx.moveTo(x, y + cellSize);
                mazeCtx.lineTo(x, y);
            }
            mazeCtx.stroke();
        }
    }

    // Dibujar salida (última celda)
    const exitC = mazeCols - 1;
    const exitR = mazeRows - 1;
    const ex = exitC * cellSize;
    const ey = exitR * cellSize;
    mazeCtx.fillStyle = '#FFD700';
    mazeCtx.fillRect(ex + cellSize * 0.1, ey + cellSize * 0.1, cellSize * 0.8, cellSize * 0.8);
    mazeCtx.font = `${Math.floor(cellSize * 0.6)}px Arial`;
    mazeCtx.textAlign = 'center';
    mazeCtx.textBaseline = 'middle';
    mazeCtx.fillStyle = '#333';
    mazeCtx.fillText('🎯', ex + cellSize / 2, ey + cellSize / 2 + 2);

    // Dibujar jugador en el centro de la celda
    drawPlayer();
}

function drawPlayer() {
    const px = playerCol * cellSize + cellSize / 2;
    const py = playerRow * cellSize + cellSize / 2;

    mazeCtx.fillStyle = '#FF6B9D';
    mazeCtx.beginPath();
    mazeCtx.arc(px, py, playerRadius, 0, Math.PI * 2);
    mazeCtx.fill();

    // ojos y sonrisa
    mazeCtx.fillStyle = '#333';
    mazeCtx.beginPath();
    mazeCtx.arc(px - playerRadius / 3, py - playerRadius / 4, Math.max(2, Math.floor(playerRadius * 0.2)), 0, Math.PI * 2);
    mazeCtx.fill();
    mazeCtx.beginPath();
    mazeCtx.arc(px + playerRadius / 3, py - playerRadius / 4, Math.max(2, Math.floor(playerRadius * 0.2)), 0, Math.PI * 2);
    mazeCtx.fill();

    mazeCtx.strokeStyle = '#333';
    mazeCtx.lineWidth = Math.max(1, Math.floor(playerRadius * 0.15));
    mazeCtx.beginPath();
    mazeCtx.arc(px, py + playerRadius * 0.15, Math.max(2, Math.floor(playerRadius * 0.25)), 0, Math.PI);
    mazeCtx.stroke();
}
function handleMazeKeyDown(e) {
    if (mazeCompleted) return;
    let moved = false;
    switch (e.key) {
        case 'ArrowUp': tryMoveBy(0, -1, 'top'); moved = true; break;
        case 'ArrowDown': tryMoveBy(0, 1, 'bottom'); moved = true; break;
        case 'ArrowLeft': tryMoveBy(-1, 0, 'left'); moved = true; break;
        case 'ArrowRight': tryMoveBy(1, 0, 'right'); moved = true; break;
    }
    if (moved) e.preventDefault();
}

function tryMoveBy(dc, dr, wallName) {
    if (mazeCompleted) return;
    const cell = mazeGrid[playerRow][playerCol];
    if (!cell[wallName]) {
        const newCol = playerCol + dc;
        const newRow = playerRow + dr;
        if (newCol >= 0 && newCol < mazeCols && newRow >= 0 && newRow < mazeRows) {
            playerCol = newCol;
            playerRow = newRow;
            incrementStep();
            startTimer();
            if (playerCol === mazeCols - 1 && playerRow === mazeRows - 1) {
                mazeCompleted = true;
                document.getElementById('mazeMessage').textContent = '¡🎉 ¡Felicidades! ¡Completaste el laberinto! 🎉';
                stopTimer();
            }
        }
    }
    drawMaze();
}

function incrementStep() {
    mazeSteps += 1;
    const el = document.getElementById('mazeSteps');
    if (el) el.textContent = String(mazeSteps);
}

function resetSteps() {
    mazeSteps = 0;
    const el = document.getElementById('mazeSteps');
    if (el) el.textContent = '0';
}

function startTimer() {
    if (timerInterval) return; // ya iniciado
    timerStart = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 250);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timerStart = null;
    const el = document.getElementById('mazeTimer');
    if (el) el.textContent = '00:00';
}

function updateTimerDisplay() {
    if (!timerStart) return;
    const elapsed = Date.now() - timerStart;
    const s = Math.floor(elapsed / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    const el = document.getElementById('mazeTimer');
    if (el) el.textContent = `${mm}:${ss}`;
}

function restartMaze() {
    playerCol = 0;
    playerRow = 0;
    mazeCompleted = false;
    document.getElementById('mazeMessage').textContent = '';
    resetSteps();
    resetTimer();
    drawMaze();
}

// Función para regenerar el laberinto con nueva dificultad (cols, rows opcionales)
function newMaze(cols, rows) {
    if (cols) mazeCols = cols;
    if (rows) mazeRows = rows;
    initMazeGame();
    // reset counters
    resetSteps();
    resetTimer();
}
