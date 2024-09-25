const apiKey = "RN6ESWsKY8ohiMTH2zUt1kyjptBp7S2w0ODxFCb0hOw";
const board = document.getElementById('memory-board');
const resetButton = document.getElementById('reset-button');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const turnIndicator = document.getElementById('turn-indicator');
const player1NameElement = document.getElementById('player1-name');
const player2NameElement = document.getElementById('player2-name');
const gameContainer = document.getElementById('game-container');
const namePopup = document.getElementById('name-popup');
const startGameButton = document.getElementById('start-game');
const player1NameInput = document.getElementById('player1-name-input');
const player2NameInput = document.getElementById('player2-name-input');
const winnerPopup = document.getElementById('winner-popup');
const winnerMessage = document.getElementById('winner-message');
const closeWinnerPopupButton = document.getElementById('close-winner-popup');

let images = [];
let flippedCards = [];
let matchedPairs = 0;
let playerTurn = 1;
let score1 = 0;
let score2 = 0;
let player1 = "Spieler 1";
let player2 = "Spieler 2";

// Funktion um Spieler-Namen zu setzen
function setPlayerNames() {
    player1 = player1NameInput.value || "Spieler 1";
    player2 = player2NameInput.value || "Spieler 2";
    player1NameElement.textContent = player1;
    player2NameElement.textContent = player2;
    turnIndicator.textContent = `${player1} ist am Zug`;
    gameContainer.style.display = 'flex'; // Spiel-Interface anzeigen
    namePopup.style.display = 'none'; // Pop-up ausblenden
}

// API-Bilder laden
async function fetchImages() {
    const response = await fetch(`https://api.unsplash.com/photos/random?count=10&client_id=${apiKey}`);
    const data = await response.json();
    images = data.map(img => img.urls.small);
    images = [...images, ...images]; // Paare erstellen
    images.sort(() => 0.5 - Math.random()); // Mischen
    createBoard();
}

// Spielfeld erstellen
function createBoard() {
    board.innerHTML = '';
    images.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.index = index;

        const imgElement = document.createElement('img');
        imgElement.src = image;

        card.appendChild(imgElement);
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

// Karte umdrehen
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

// Überprüfen, ob ein Paar gefunden wurde
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const img1 = card1.querySelector('img').src;
    const img2 = card2.querySelector('img').src;

    if (img1 === img2) {
        matchedPairs++;
        updateScore();
        flippedCards = [];
        if (matchedPairs === images.length / 2) {
            declareWinner();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            switchTurn();
        }, 1000);
    }
}

// Sieger deklarieren
function declareWinner() {
    let winner;
    if (score1 > score2) {
        winner = player1;
    } else if (score2 > score1) {
        winner = player2;
    } else {
        winner = "Unentschieden";
    }

    winnerMessage.textContent = `${winner} hat gewonnen!`;
    winnerPopup.style.display = 'flex';
}

// Punkte aktualisieren
function updateScore() {
    if (playerTurn === 1) {
        score1++;
        player1Score.textContent = score1;
    } else {
        score2++;
        player2Score.textContent = score2;
    }
}

// Spieler wechseln
function switchTurn() {
    playerTurn = playerTurn === 1 ? 2 : 1;
    turnIndicator.textContent = `${playerTurn === 1 ? player1 : player2} ist am Zug`;
}

// Spiel zurücksetzen
resetButton.addEventListener('click', () => {
    location.reload(); // Seite neu laden
});

// Starte das Spiel nach Namenseingabe
startGameButton.addEventListener('click', () => {
    setPlayerNames();
    fetchImages();
});

// Schließe das Sieger-Pop-up
closeWinnerPopupButton.addEventListener('click', () => {
    winnerPopup.style.display = 'none';
    location.reload(); // Spiel neustarten
});

// Initiales Laden der Seite
namePopup.style.display = 'flex'; // Zeige das Pop-up an

