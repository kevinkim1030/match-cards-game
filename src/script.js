const cards = document.querySelectorAll('.memory-card');
const top = document.getElementById("top");
const enterUsername = document.getElementById('enter-username');
const changeNameBtn = document.getElementById('change-name');
const usernameSpanClose = document.getElementById("close");
const starter = document.getElementById("starter");
const counter = document.getElementById("counter");
const congratsModal = document.getElementById("congratsModal");
const congratsContent = document.getElementById("congrats-content");

let hasFlippedCard = false;
let lockBoard = true;
let firstCard, secondCard;
let currentGame = {};
let matchCounter = 0;
let counterId;
let rainingHearts;
counter.style.visibility = 'hidden';
enterUsername.style.display = "block";

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');
  
  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  // second click
  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  checkMatchCounter(isMatch);
  isMatch ? disableCards() : unflipCards();
}

function checkMatchCounter(isMatch) {
  if (isMatch) {
    matchCounter++;
    if (matchCounter === 12) {
      congrats();
      rainingHearts = setInterval(createHearts, 300);
    }
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoardState();
}

function unflipCards() {
  lockBoard = true;
  
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoardState();
  }, 1000);
}

function resetBoardState() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle() {
  cards.forEach(card => {
    card.classList.remove('flip');
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
    card.addEventListener('click', flipCard);
  });
  matchCounter = 0;
  currentGame.duration = 0;
  resetBoardState();
};

changeNameBtn.onclick = function () {
  enterUsername.style.display = "block";
}

usernameSpanClose.onclick = function () {
  enterUsername.style.display = "none";
}

function turnOnBtnPointerEvents() {
  starter.style.pointerEvents = "auto";
  changeNameBtn.style.pointerEvents = "auto";
}
function turnOffBtnPointerEvents() {
  starter.style.pointerEvents = "none";
  changeNameBtn.style.pointerEvents = "none";
}

function congrats(){
  currentGame.duration = timer;
  stopTimer();
  congratsContent.innerHTML = `
  <div class="congrats-container">
    <h2> Congratulations ${currentGame.username.toUpperCase()}!</h2>
    <br>
    <h2> You finished in ${currentGame.duration} seconds!</h2>
    <br>
    <h2> Can you beat your best time? </h2>
  </div>
  <span id="congrats-span" class="close">&times;</span>
  `
  congratsModal.style.display = "block";
  // starter.classList.remove("hidden")
  let congratsSpan = document.getElementById("congrats-span")
  congratsSpan.onclick = function () {
    counter.innerHTML = 0;
    congratsModal.style.display = "none"
    counter.style.visibility = 'hidden';
    starter.innerText = 'Start Game';
    turnOnBtnPointerEvents();
    removeHearts();
  }
}

function createHearts() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerText = '🧡';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = Math.random() * 2 + 3 + "s";
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove()
  }, 5000);
}

function removeHearts() {
  clearInterval(rainingHearts);
}

document.getElementById('username-btn').onclick = () => {
  enterUsername.style.display = "none";
  let username = document.getElementById("username").value.toUpperCase();
  currentGame.username = username;
  top.innerHTML = `
    <strong><h1>Press Start Game!</h1></strong>
  `;
  starter.style.pointerEvents = "auto";
  document.getElementById("username").value = '';
}

// Timer 
let timer = parseInt(counter.innerHTML);
function startTimer() {
  timer = 0;
  counterId = setInterval(increaseCounter, 1000);
}
function increaseCounter() {
  timer++;
  counter.innerHTML = timer;
}
function stopTimer(){
  clearInterval(counterId);
}

//START GAME
starter.onclick = function () {
  starter.innerText = 'Good Luck!!!';
  turnOffBtnPointerEvents();
  counter.style.visibility = "visible";
  shuffle();
  startTimer();
  lockBoard = false;
}
