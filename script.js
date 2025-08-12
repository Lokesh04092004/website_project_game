const setChallengeBtn = document.getElementById('setChallengeBtn');
const heroInput = document.getElementById('heroInput');
const heroineInput = document.getElementById('heroineInput');
const movieInput = document.getElementById('movieInput');
const songInput = document.getElementById('songInput');
const timerInput = document.getElementById('timerInput');

const plusGrid = document.querySelector('.plus-grid');
const gridHero = document.getElementById('gridHero');
const gridHeroine = document.getElementById('gridHeroine');
const gridMovie = document.getElementById('gridMovie');
const gridSong = document.getElementById('gridSong');

const kollywoodLetters = document.querySelectorAll('.kollywood-letter');

const turnInfo = document.querySelector('.turn-info');
const currentTeamSpan = document.getElementById('currentTeam');
const timerDisplay = document.querySelector('.timer');
const timerSpan = document.getElementById('timer');

const categorySelect = document.querySelector('.category-select');
const categoryButtons = document.querySelectorAll('.category-btn');

const guessInputSection = document.querySelector('.guess-input-section');
const selectedCategoryName = document.getElementById('selectedCategoryName');
const guessInput = document.getElementById('guessInput');
const submitGuessBtn = document.getElementById('submitGuessBtn');

const statusDiv = document.getElementById('status');

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

let selectedCategory = null;

function updateGridInitials() {
  gridHero.textContent = challenge.hero[0].toUpperCase();
  gridHeroine.textContent = challenge.heroine[0].toUpperCase();
  gridMovie.textContent = challenge.movie[0].toUpperCase();
  gridSong.textContent = challenge.song[0].toUpperCase();

  // Clear crossed styles
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

  submitGuessBtn.disabled = true;
  categoryButtons.forEach(btn => btn.disabled = true);

  setTimeout(() => {
    alert(statusDiv.textContent + '\n\nSet new challenge for next round.');
    resetGameForNextRound();
  }, 2000);
}

function resetGameForNextRound() {
  challengeSetup.style.display = 'block';
  plusGrid.style.display = 'none';
  categorySelect.style.display = 'none';
  guessInputSection.style.display = 'none';
  turnInfo.style.display = 'none';
  timerDisplay.style.display = 'none';
  scoreboard.style.display = 'block';
  statusDiv.textContent = '';
  submitGuessBtn.disabled = false;

  guessedCorrectly = { hero: false, heroine: false, movie: false, song: false };
  crossedInitialsCount = 0;
  crossedKollywoodCount = 0;

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

  if (isNaN(timeSeconds) || timeSeconds < 10 || timeSeconds > 900) {
    alert('Please enter a valid timer between 10 and 900 seconds.');
    return;
  }

  challenge = { hero: h, heroine: hr, movie: m, song: s };

  updateGridInitials();

  challengeSetup.style.display = 'none';
  plusGrid.style.display = 'grid';
  categorySelect.style.display = 'block';
  guessInputSection.style.display = 'none'; // hidden until category chosen
  turnInfo.style.display = 'block';
  scoreboard.style.display = 'block';

  resetGuessInputs();

  guessedCorrectly = { hero: false, heroine: false, movie: false, song: false };

  updateTurnInfo();

  startTimer(timeSeconds);
  statusDiv.textContent = '';
});

function resetGuessInputs() {
  guessInput.value = '';
  statusDiv.textContent = '';
}

categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedCategory = btn.dataset.cat;
    selectedCategoryName.textContent = btn.textContent;
    guessInputSection.style.display = 'block';
    resetGuessInputs();
    guessInput.focus();
  });
});

submitGuessBtn.addEventListener('click', () => {
  if (!selectedCategory) {
    statusDiv.textContent = 'Please select a category first.';
    return;
  }
  if (guessedCorrectly[selectedCategory]) {
    statusDiv.textContent = `You already guessed ${selectedCategory} correctly! Choose another category.`;
    return;
  }

  const guess = guessInput.value.trim().toLowerCase();
  if (!guess) {
    statusDiv.textContent = 'Please enter a guess.';
    return;
  }

  let correctAnswer = challenge[selectedCategory].toLowerCase();

  if (guess === correctAnswer) {
    guessedCorrectly[selectedCategory] = true;
    crossInitialLetter(selectedCategory);
    statusDiv.textContent = `Correct! ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} guessed.`;

    // Disable that category button
    categoryButtons.forEach(btn => {
      if (btn.dataset.cat === selectedCategory) btn.disabled = true;
    });

  } else {
    crossKollywoodLetter();
    statusDiv.textContent = `Wrong guess! Letter crossed in KOLLYWOOD.`;
  }

  resetGuessInputs();

  if (allInitialsCrossed()) {
    endRound(true);
  } else if (allKollywoodCrossed()) {
    endRound(false);
  }
});
