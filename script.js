const grid = document.getElementById('grid');
const errorMessage = document.getElementById('error-message');
const clockElement = document.getElementById('clock');
const newGameButton = document.getElementById('new-game');
let currentNumber = 1;
const moveStack = [];
let timerInterval;
let seconds = 0;

const buttons = [];
createGrid();

function createGrid() {
    grid.innerHTML = '';
    buttons.length = 0;
    for (let i = 0; i < 100; i++) {
        const button = document.createElement('button');
        button.dataset.index = i;

        button.addEventListener('mouseenter', () => {
            clearError();
            if (!button.innerText) {
                button.classList.toggle('valid', isMoveValid(i));
                button.classList.toggle('invalid', !isMoveValid(i));
            }
        });

        button.addEventListener('mouseleave', () => {
            button.classList.remove('invalid', 'valid');
        });

        button.addEventListener('click', () => handleLeftClick(button, i));
        button.addEventListener('contextmenu', (e) => handleRightClick(e));
        grid.appendChild(button);
        buttons.push(button);
    }
}

function handleLeftClick(button, index) {
    if (button.innerText || !isMoveValid(index)) return showError("Siirto ei mahdollinen");
    if (currentNumber === 1) startClock();
    button.innerText = currentNumber++;
    moveStack.push(index);
    highlightLastMove();
    if (currentNumber > 100) stopClock();
}

function handleRightClick(e) {
    e.preventDefault();
    const lastMove = moveStack.pop();
    if (lastMove !== undefined) {
        buttons[lastMove].innerText = '';
        currentNumber--;
        highlightLastMove();
        clearError();
    }
}

function isMoveValid(targetIndex) {
    if (moveStack.length === 0) return true;
    const lastIndex = moveStack[moveStack.length - 1];
    const [row1, col1] = [Math.floor(lastIndex / 10), lastIndex % 10];
    const [row2, col2] = [Math.floor(targetIndex / 10), targetIndex % 10];
    const [rowDiff, colDiff] = [Math.abs(row1 - row2), Math.abs(col1 - col2)];
    return (rowDiff === 0 && colDiff === 3) || (rowDiff === 3 && colDiff === 0) || (rowDiff === 2 && colDiff === 2);
}

function highlightLastMove() {
    buttons.forEach(button => button.classList.remove('active'));
    if (moveStack.length > 0) buttons[moveStack[moveStack.length - 1]].classList.add('active');
}

function showError(message) { errorMessage.textContent = message; }
function clearError() { errorMessage.textContent = ''; }

function startClock() {
    stopClock();
    seconds = 0;
    clockElement.textContent = "Aika: 00:00";
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        clockElement.textContent = `Aika: ${minutes}:${sec}`;
    }, 1000);
}

function stopClock() { clearInterval(timerInterval); }

newGameButton.addEventListener('click', () => {
    stopClock();
    currentNumber = 1;
    moveStack.length = 0;
    createGrid();
    clockElement.textContent = "Aika: 00:00";
    clearError();
});