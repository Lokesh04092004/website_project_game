// Simple theme-switching flashcard site (no build tools required)

const themes = {
  bleach: [
    { q: "Who is Ichigo Kurosaki?", a: "The main protagonist of Bleach — a Substitute Soul Reaper." },
    { q: "What is a Zanpakutō?", a: "A soul-cutting sword used by Soul Reapers." }
  ],
  got: [
    { q: "Who is Jon Snow?", a: "A member of the Night's Watch and son of Rhaegar Targaryen / Lyanna Stark (spoiler)." },
    { q: "What is the Iron Throne?", a: "The seat of power in the Seven Kingdoms." }
  ],
  bb: [
    { q: "What is Walter White's alias?", a: "Heisenberg." },
    { q: "What product made Walter White notorious?", a: "The blue meth." }
  ]
};

const container = document.getElementById('flashcardContainer');
const selector = document.getElementById('themeSelector');

function createCard(cardData){
  const el = document.createElement('article');
  el.className = 'card';
  el.tabIndex = 0;
  el.innerHTML = `<div class="q">${escapeHtml(cardData.q)}</div><div class="a">${escapeHtml(cardData.a)}</div>`;
  el.addEventListener('click', ()=> el.classList.toggle('flipped'));
  el.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') el.classList.toggle('flipped') });
  return el;
}

function render(theme){
  document.body.className = theme;
  container.innerHTML = '';
  const list = themes[theme] || [];
  list.forEach(item => container.appendChild(createCard(item)));
}

// simple HTML escaper
function escapeHtml(s){ return (s+'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

selector.addEventListener('change', (e)=> render(e.target.value));

// initial render (or load remembered theme)
const saved = localStorage.getItem('ff_theme') || 'bleach';
selector.value = saved;
render(saved);
selector.addEventListener('change', e=> localStorage.setItem('ff_theme', e.target.value));