import { puzzles } from './puzzles.js';

const pieceGlyphs = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
};

const categorySelect = document.querySelector('#category-select');
const resetCategory = document.querySelector('#reset-category');
const board = document.querySelector('#board');
const progressCount = document.querySelector('#progress-count');
const sideToMove = document.querySelector('#side-to-move');
const puzzleCategory = document.querySelector('#puzzle-category');
const puzzleDifficulty = document.querySelector('#puzzle-difficulty');
const puzzleTitle = document.querySelector('#puzzle-title');
const puzzleGoal = document.querySelector('#puzzle-goal');
const puzzleFen = document.querySelector('#puzzle-fen');
const answerPanel = document.querySelector('#answer-panel');
const answerLines = document.querySelector('#answer-lines');
const answerNote = document.querySelector('#answer-note');
const showAnswer = document.querySelector('#show-answer');
const nextPuzzle = document.querySelector('#next-puzzle');
const analysisLink = document.querySelector('#analysis-link');

const categories = ['전체', ...new Set(puzzles.map((puzzle) => puzzle.category))];
let currentCategory = categories[0];
let currentIndex = 0;

function getVisiblePuzzles() {
  return currentCategory === '전체'
    ? puzzles
    : puzzles.filter((puzzle) => puzzle.category === currentCategory);
}

function chessComAnalysisUrl(fen) {
  return `https://www.chess.com/analysis?fen=${encodeURIComponent(fen)}`;
}

function renderCategoryOptions() {
  categorySelect.innerHTML = categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join('');
}

function renderBoard(fen) {
  const [placement] = fen.split(' ');
  const squares = [];

  placement.split('/').forEach((rank, rankIndex) => {
    let fileIndex = 0;
    for (const token of rank) {
      if (/\d/.test(token)) {
        const emptyCount = Number(token);
        for (let i = 0; i < emptyCount; i += 1) {
          squares.push(createSquare('', rankIndex, fileIndex));
          fileIndex += 1;
        }
      } else {
        squares.push(createSquare(pieceGlyphs[token], rankIndex, fileIndex));
        fileIndex += 1;
      }
    }
  });

  board.innerHTML = squares.join('');
}

function createSquare(piece, rankIndex, fileIndex) {
  const isLight = (rankIndex + fileIndex) % 2 === 0;
  const file = String.fromCharCode(97 + fileIndex);
  const rank = 8 - rankIndex;
  const label = `${file}${rank}`;
  return `<div class="square ${isLight ? 'light' : 'dark'}" aria-label="${label}">
    <span class="piece">${piece}</span>
    <small>${label}</small>
  </div>`;
}

function renderPuzzle() {
  const visiblePuzzles = getVisiblePuzzles();
  const puzzle = visiblePuzzles[currentIndex];
  const [, turn] = puzzle.fen.split(' ');

  renderBoard(puzzle.fen);
  progressCount.textContent = `${currentIndex + 1} / ${visiblePuzzles.length}`;
  sideToMove.textContent = `${turn === 'w' ? '백' : '흑'} 차례`;
  puzzleCategory.textContent = puzzle.category;
  puzzleDifficulty.textContent = puzzle.difficulty;
  puzzleTitle.textContent = puzzle.title;
  puzzleGoal.textContent = puzzle.goal;
  puzzleFen.textContent = puzzle.fen;
  analysisLink.href = chessComAnalysisUrl(puzzle.fen);
  answerPanel.hidden = true;
  showAnswer.textContent = '답안 보기';
  answerLines.innerHTML = puzzle.answer.map((line) => `<li>${line}</li>`).join('');
  answerNote.textContent = puzzle.note;
}

function moveToNextPuzzle() {
  const visiblePuzzles = getVisiblePuzzles();
  currentIndex = (currentIndex + 1) % visiblePuzzles.length;
  renderPuzzle();
}

categorySelect.addEventListener('change', (event) => {
  currentCategory = event.target.value;
  currentIndex = 0;
  renderPuzzle();
});

resetCategory.addEventListener('click', () => {
  currentIndex = 0;
  renderPuzzle();
});

showAnswer.addEventListener('click', () => {
  answerPanel.hidden = !answerPanel.hidden;
  showAnswer.textContent = answerPanel.hidden ? '답안 보기' : '답안 숨기기';
});

nextPuzzle.addEventListener('click', moveToNextPuzzle);

renderCategoryOptions();
renderPuzzle();
