const setChallengeBtn = document.getElementById('setChallengeBtn');
const heroInput = document.getElementById('heroInput');
const heroineInput = document.getElementById('heroineInput');
const movieInput = document.getElementById('movieInput');
const songInput = document.getElementById('songInput');

const plusContainer = document.querySelector('.plus-container');
const initHero = document.getElementById('initHero');
const initHeroine = document.getElementById('initHeroine');
const initMovie = document.getElementById('initMovie');
const initSong = document.getElementById('initSong');

const turnInfo = document.querySelector('.turn-info');
const currentTeamSpan = document.getElementById('currentTeam');
const chancesLeftSpan = document.getElementById('chancesLeft');
const timerDisplay = document.querySelector('.timer');
const timerSpan = document.getElementById('timer');

const guessSection = document.querySelector('.guess-section');
const guessHero = document.getElementById('guessHero');
const guessHeroine = document.getElementById('guessHeroine');
const guessMovie = document.getElementById('guessMovie');
const guessSong = document.getElementById('guessSong');
const guessBtn = document.getElementById('guessBtn');
const statusDiv = document.getElementById('status');

const scoreboard = document.querySelector('.scoreboard');
const scoreTeam1Span = document.getElementById('scoreTeam1');
const scoreTeam2Span = document.getElementById('scoreTeam2');

let currentTeam = 1;
let chancesLeft = 9;
const maxChances = 9;
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
}

function updateTurnInfo() {
  currentTeamSpan.textContent = currentTeam;
  chancesLeftSpan.textContent = chancesLeft;
}

function startTimer() {
  timer = 60;
  timerSpan.textContent = timer;
  timerDisplay.style.display = 'block';
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    timerSpan.textContent = timer;
    if (timer <= 0) {
      clearInterval(timerInterval);
      statusDiv.textContent = `Time's up! The correct answers were shown.`;
      revealAnswers();
      setTimeout(() => {
        nextTurn();
      }, 3500);
    }
  }, 1000);
}

function revealAnswers() {
  statusDiv.innerHTML = `
    Correct Answers:<br>
    Hero: <b>${challenge.hero}</b><br>
    Heroine: <b>${challenge.heroine}</b><br>
    Movie: <b>${challenge.movie}</b><br>
    Song: <b>${challenge.song}</b>
  `;
}

function allGuessed() {
  return Object.values(guessedCorrectly).every(v => v === true);
}

function nextTurn() {
  // Reset guesses
  guessedCorrectly = { hero: false, heroine: false, movie: false, song: false };
  chancesLeft = maxChances;
  currentTeam = currentTeam === 1 ? 2 : 1;
  updateTurnInfo();
  resetGuessInputs();
  statusDiv.textContent = '';
  startTimer();
}

setChallengeBtn.addEventListener('click', () => {
  const h = heroInput.value.trim();
  const hr = heroineInput.value.trim();
  const m = movieInput.value.trim();
  const s = songInput.value.trim();

  if (!h || !hr || !m || !s) {
    alert('Please fill all fields to set the challenge.');
    return;
  }

  challenge = { hero: h, heroine: hr, movie: m, song: s };

  updatePlusInitials();

  plusContainer.style.display = 'block';
  turnInfo.style.display = 'block';
  guessSection.style.display = 'block';
  scoreboard.style.display = 'block';
  timerDisplay.style.display = 'block';

  scoreTeam1Span.textContent = '0';
  scoreTeam2Span.textContent = '0';

  currentTeam = 1;
  chancesLeft = maxChances;
  updateTurnInfo();
  resetGuessInputs();
  statusDiv.textContent = '';
  startTimer();
});

guessBtn.addEventListener('click', () => {
  if (chancesLeft <= 0) {
    statusDiv.textContent = `No chances left! Moving to next turn...`;
    revealAnswers();
    setTimeout(() => {
      nextTurn();
    }, 3500);
    return;
  }

  let gotAnyCorrect = false;
  const gHero = guessHero.value.trim().toLowerCase();
  const gHeroine = guessHeroine.value.trim().toLowerCase();
  const gMovie = guessMovie.value.trim().toLowerCase();
  const gSong = guessSong.value.trim().toLowerCase();

  // Check guesses one by one only if not already guessed correctly
  if (!guessedCorrectly.hero && gHero && gHero === challenge.hero.toLowerCase()) {
    guessedCorrectly.hero = true;
    gotAnyCorrect = true;
  }
  if (!guessedCorrectly.heroine && gHeroine && gHeroine === challenge.heroine.toLowerCase()) {
    guessedCorrectly.heroine = true;
    gotAnyCorrect = true;
  }
  if (!guessedCorrectly.movie && gMovie && gMovie === challenge.movie.toLowerCase()) {
    guessedCorrectly.movie = true;
    gotAnyCorrect = true;
  }
  if (!guessedCorrectly.song && gSong && gSong === challenge.song.toLowerCase()) {
    guessedCorrectly.song = true;
    gotAnyCorrect = true;
  }

  if (gotAnyCorrect) {
    statusDiv.textContent = 'Correct guess! Keep going!';
  } else {
    chancesLeft--;
    statusDiv.textContent = `Wrong guess! Chances left: ${chancesLeft}`;
  }

  updateTurnInfo();
  resetGuessInputs();

  if (allGuessed()) {
    statusDiv.textContent = `Team ${currentTeam} guessed all correctly! +1 point!`;
    if (currentTeam === 1) {
      scoreTeam1Span.textContent = parseInt(scoreTeam1Span.textContent) + 1;
    } else {
      scoreTeam2Span.textContent = parseInt(scoreTeam2Span.textContent) + 1;
    }
    clearInterval(timerInterval);
    setTimeout(() => {
      alert(`Team ${currentTeam} wins this round! Set next challenge for the other team.`);
      // Reset for next challenge
      plusContainer.style.display = 'none';
      turnInfo.style.display = 'none';
      guessSection.style.display = 'none';
      timerDisplay.style.display = 'none';
      statusDiv.textContent = '';
      heroInput.value = '';
      heroineInput.value = '';
      movieInput.value = '';
      songInput.value = '';
    }, 1500);
  } else if (chancesLeft <= 0) {
    statusDiv.textContent = `No chances left! The correct answers were:`;
    revealAnswers();
    clearInterval(timerInterval);
    setTimeout(() => {
      nextTurn();
    }, 3500);
  }
});
