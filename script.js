const grid = document.getElementById('grid');
const errorMessage = document.getElementById('error-message');
const clockElement = document.getElementById('clock');
const undoCounterElement = document.getElementById('undo-counter');
const newGameButton = document.getElementById('new-game');

let currentNumber = 1;
let undoCount = 0;
const moveStack = [];
let timerInterval;
let seconds = 0;

const buttons = [];
createGrid();

// Luo ruudukko ja aseta tapahtumakuuntelijat
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
        grid.appendChild(button);
        buttons.push(button);
    }
}

// Käsittele vasen klikkaus
function handleLeftClick(button, index) {
    if (button.innerText || !isMoveValid(index)) return showError("Siirto ei mahdollinen");
    if (currentNumber === 1) startClock();
    button.innerText = currentNumber++;
    moveStack.push(index);
    highlightLastMove();
    if (currentNumber > 100) stopClock();
}

// Käsittele oikea klikkaus koko ruudukossa
grid.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (moveStack.length === 0) return; // Ei tehdä mitään, jos ei ole siirtoja peruttavana

    const lastMove = moveStack.pop();
    buttons[lastMove].innerText = '';
    currentNumber--;
    highlightLastMove();
    clearError();

    // Kasvata peruutuslaskuria ja päivitä näyttö
    undoCount++;
    undoCounterElement.textContent = `Perutut siirrot: ${undoCount}`;
});

// Tarkista siirron kelvollisuus
function isMoveValid(targetIndex) {
    if (moveStack.length === 0) return true;
    const lastIndex = moveStack[moveStack.length - 1];
    const [row1, col1] = [Math.floor(lastIndex / 10), lastIndex % 10];
    const [row2, col2] = [Math.floor(targetIndex / 10), targetIndex % 10];
    const [rowDiff, colDiff] = [Math.abs(row1 - row2), Math.abs(col1 - col2)];
    return (rowDiff === 0 && colDiff === 3) || (rowDiff === 3 && colDiff === 0) || (rowDiff === 2 && colDiff === 2);
}

// Korosta viimeisin siirto
function highlightLastMove() {
    buttons.forEach(button => button.classList.remove('active'));
    if (moveStack.length > 0) buttons[moveStack[moveStack.length - 1]].classList.add('active');
}

// Näytä virheilmoitus
function showError(message) { errorMessage.textContent = message; }
function clearError() { errorMessage.textContent = ''; }

// Aloita ajastin
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

// Pysäytä ajastin
function stopClock() { clearInterval(timerInterval); }

// Aloita uusi peli
newGameButton.addEventListener('click', () => {
    stopClock();
    currentNumber = 1;
    moveStack.length = 0;
    createGrid();
    clockElement.textContent = "Aika: 00:00";
    clearError();

    // Nollaa laskuri
    undoCount = 0;
    undoCounterElement.textContent = "Perutut siirrot: 0";
});
