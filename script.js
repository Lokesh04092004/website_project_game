const setChallengeBtn = document.getElementById('setChallengeBtn');
const heroInput = document.getElementById('heroInput');
const heroineInput = document.getElementById('heroineInput');
const movieInput = document.getElementById('movieInput');
const songInput = document.getElementById('songInput');
const timerInput = document.getElementById('timerInput');

const plusContainer = document.querySelector('.plus-container');
const initHero = document.getElementById('initHero');
const initHeroine = document.getElementById('initHeroine');
const initMovie = document.getElementById('initMovie');
const initSong = document.getElementById('initSong');

const turnInfo = document.querySelector('.turn-info');
const currentTeamSpan = document.getElementById('currentTeam');
const timerDisplay = document.querySelector('.timer');
const timerSpan = document.getElementById('timer');

const guessSection = document.querySelector('.guess-section');
const guessHero = document.getElementById('guessHero');
const guessHeroine = document.getElementById('guessHeroine');
const guessMovie = document.getElementById('guessMovie');
const guessSong = document.getElementById('guessSong');
const guessBtn = document.getElementById('guessBtn');
const statusDiv = document.getElementById('status');

const gridContainer = document.querySelector('.grid-container');
const gridHero = document.getElementById('gridHero');
const gridHeroine = document.getElementById('gridHeroine');
const gridMovie = document.getElementById('gridMovie');
const gridSong = document.getElementById('gridSong');

const kollywoodLetters = document.querySelectorAll('.kollywood-letter');

const scoreboard = document.querySelector('.scoreboard');
const scoreTeam1Span = document.getElementById('scoreTeam1');
const scoreTeam2Span = document.getElementById('scoreTeam2');

let currentTeam = 1;
const maxKollywoodLetters = kollywoodLetters.length; // 9
let crossedKollywoodCount = 0;
let crossedInitialsCount = 0;

let timer = 60;
let timerInterval = null;

let challenge = {
  hero: '',
  heroine: '',
  movie: '',
  song: '',
};

let guessedCorrectly = {
  hero: false,
  heroine: false,
  movie: false,
  song: false,
};

function resetGuessInputs() {
  guessHero.value = '';
  guessHeroine.value = '';
  guessMovie.value = '';
  guessSong.value = '';
  statusDiv.textContent = '';
}

function updatePlusInitials() {
  initHero.textContent = challenge.hero ? challenge.hero[0].toUpperCase() : 'H';
  initHeroine.textContent = challenge.heroine ? challenge.heroine[0].toUpperCase() : 'R';
  initMovie.textContent = challenge.movie ? challenge.movie[0].toUpperCase() : 'M';
  initSong.textContent = challenge.song ? challenge.song[0].toUpperCase() : 'S';

  gridHero.textContent = initHero.textContent;
  gridHeroine.textContent = initHeroine.textContent;
  gridMovie.textContent = initMovie.textContent;
  gridSong.textContent = initSong.textContent;

  // Remove any crossed classes if present
  [gridHero, gridHeroine, gridMovie, gridSong].forEach(e => e.classList.remove('crossed'));
  kollywoodLetters.forEach(e => e.classList.remove('crossed'));

  crossedInitialsCount = 0;
  crossedKollywoodCount = 0;
}

function updateTurnInfo() {
  currentTeamSpan.textContent = currentTeam;
}

function startTimer(seconds) {
  timer = seconds;
  timerSpan.textContent = timer;
  timerDisplay.style.display = 'block';
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    timerSpan.textContent = timer;
    if (timer <= 0) {
      clearInterval(timerInterval);
      statusDiv.textContent = `Time's up! The opponent team wins this round!`;
      endRound(false);
    }
  }, 1000);
}

function crossKollywoodLetter() {
  if (crossedKollywoodCount < maxKollywoodLetters) {
    kollywoodLetters[crossedKollywoodCount].classList.add('crossed');
    crossedKollywoodCount++;
  }
}

function crossInitialLetter(type) {
  switch (type) {
    case 'hero': gridHero.classList.add('crossed'); break;
    case 'heroine': gridHeroine.classList.add('crossed'); break;
    case 'movie': gridMovie.classList.add('crossed'); break;
    case 'song': gridSong.classList.add('crossed'); break;
  }
  crossedInitialsCount++;
}

function allInitialsCrossed() {
  return crossedInitialsCount >= 4;
}

function allKollywoodCrossed() {
  return crossedKollywoodCount >= maxKollywoodLetters;
}

function endRound(wonByCurrentTeam) {
  clearInterval(timerInterval);
  if (wonByCurrentTeam) {
    statusDiv.textContent = `Team ${currentTeam} wins
