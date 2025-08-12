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

const challengeSetup = document.getElementById('challengeSetup');

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

  // Clear all crossed classes
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
      statusDiv.textContent = `Time's up! Opponent team wins this round!`;
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
    statusDiv.textContent = `Team ${currentTeam} wins this round! +1 point`;
    if (currentTeam === 1) {
      scoreTeam1Span.textContent = +scoreTeam1Span.textContent + 1;
    } else {
      scoreTeam2Span.textContent = +scoreTeam2Span.textContent + 1;
    }
  } else {
    statusDiv.textContent = `Opponent team wins this round!`;
  }

  guessBtn.disabled = true;

  setTimeout(() => {
    alert(statusDiv.textContent + '\n\nSet new challenge for next round.');
    resetGameForNextRound();
  }, 2000);
}

function resetGameForNextRound() {
  challengeSetup.style.display = 'block';
  plusContainer.style.display = 'none';
  turnInfo.style.display = 'none';
  timerDisplay.style.display = 'none';
  guessSection.style.display = 'none';
  gridContainer.style.display = 'none';
  scoreboard.style.display = 'block';
  statusDiv.textContent = '';
  guessBtn.disabled = false;

  // Reset guesses & counters
  guessedCorrectly = { hero: false, heroine: false, movie: false, song: false };
  crossedInitialsCount = 0;
  crossedKollywoodCount = 0;

  // Clear input fields
  heroInput.value = '';
  heroineInput.value = '';
  movieInput.value = '';
  songInput.value = '';
  timerInput.value = '60';

  currentTeam = currentTeam === 1 ? 2 : 1;
  updateTurnInfo();
}

setChallengeBtn.addEventListener('click', () => {
  const h = heroInput.value.trim();
  const hr = heroineInput.value.trim();
  const m = movieInput.value.trim();
  const s = songInput.value.trim();
  let timeSeconds = parseInt(timerInput.value);

  if (!h || !hr || !m || !s) {
    alert('Please fill all fields to set the challenge.');
    return;
  }

  if (isNaN(timeSeconds) || timeSeconds < 10 || timeSeconds > 300) {
    alert('Please enter a valid timer between 10 and 300 seconds.');
    return;
  }

  challenge = { hero: h, heroine: hr, movie: m, song: s };

  updatePlusInitials();

  challengeSetup.style.display = 'none';  // Hide inputs
  plusContainer.style.display = 'block';
  turnInfo.style.display = 'block';
  guessSection.style.display = 'block';
  gridContainer.style.display = 'block';
  scoreboard.style.display = 'block';

  resetGuessInputs();
  guessedCorrectly = { hero: false, heroine: false, movie: false, song: false };

  updateTurnInfo();

  startTimer(timeSeconds);
  statusDiv.textContent = '';
  guessBtn.disabled = false;
});

guessBtn.addEventListener('click', () => {
  if (allInitialsCrossed() || allKollywoodCrossed()) return; // Round ended

  const gHero = guessHero.value.trim().toLowerCase();
  const gHeroine = guessHeroine.value.trim().toLowerCase();
  const gMovie = guessMovie.value.trim().toLowerCase();
  const gSong = guessSong.value.trim().toLowerCase();

  let correctGuessThisTurn = false;
  let wrongGuessThisTurn = true;

  if (!guessedCorrectly.hero && gHero && gHero === challenge.hero.toLowerCase()) {
    guessedCorrectly.hero = true;
    crossInitialLetter('hero');
    correctGuessThisTurn = true;
    wrongGuessThisTurn = false;
  }
  if (!guessedCorrectly.heroine && gHeroine && gHeroine === challenge.heroine.toLowerCase()) {
    guessedCorrectly.heroine = true;
    crossInitialLetter('heroine');
    correctGuessThisTurn = true;
    wrongGuessThisTurn = false;
  }
  if (!guessedCorrectly.movie && gMovie && gMovie === challenge.movie.toLowerCase()) {
    guessedCorrectly.movie = true;
    crossInitialLetter('movie');
    correctGuessThisTurn = true;
    wrongGuessThisTurn = false;
  }
  if (!guessedCorrectly.song && gSong && gSong === challenge.song.toLowerCase()) {
    guessedCorrectly.song = true;
    crossInitialLetter('song');
    correctGuessThisTurn = true;
    wrongGuessThisTurn = false;
  }

  if (correctGuessThisTurn) {
    statusDiv.textContent = 'Correct guess! Letter crossed in initials.';
  } else if (wrongGuessThisTurn) {
    crossKollywoodLetter();
    statusDiv.textContent = 'Wrong guess! Letter crossed in KOLLYWOOD.';
  }

  resetGuessInputs();

  if (allInitialsCrossed()) {
    endRound(true);
  } else if (allKollywoodCrossed()) {
    endRound(false);
  }
});
