import { puzzles } from './puzzles.js';

const pieceGlyphs = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
};

const STORAGE_KEY = 'chess-tactics-study-records-v1';
const REVIEW_CATEGORY = '복습 문제';

const categorySelect = document.querySelector('#category-select');
const resetCategory = document.querySelector('#reset-category');
const reviewOnly = document.querySelector('#review-only');
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
const markFirstTry = document.querySelector('#mark-first-try');
const markReview = document.querySelector('#mark-review');
const nextPuzzle = document.querySelector('#next-puzzle');
const analysisLink = document.querySelector('#analysis-link');
const solvedCount = document.querySelector('#solved-count');
const recentSolvedDate = document.querySelector('#recent-solved-date');
const reviewCount = document.querySelector('#review-count');
const reviewList = document.querySelector('#review-list');
const topicRates = document.querySelector('#topic-rates');
const resetStats = document.querySelector('#reset-stats');

const categories = ['전체', REVIEW_CATEGORY, ...new Set(puzzles.map((puzzle) => puzzle.category))];
let currentCategory = categories[0];
let currentIndex = 0;
let answerWasViewed = false;
let studyRecords = loadStudyRecords();

function loadStudyRecords() {
  try {
    const storedRecords = localStorage.getItem(STORAGE_KEY);
    return storedRecords ? JSON.parse(storedRecords) : {};
  } catch {
    return {};
  }
}

function saveStudyRecords() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studyRecords));
  } catch {
    // If browser storage is unavailable, keep the in-memory records for this session.
  }
}

function getRecord(puzzleId) {
  return studyRecords[puzzleId] ?? {
    attempts: 0,
    firstTrySolves: 0,
    solved: false,
    needsReview: false,
    lastSolvedAt: null
  };
}

function setRecord(puzzleId, record) {
  studyRecords[puzzleId] = record;
  saveStudyRecords();
}

function getVisiblePuzzles() {
  if (currentCategory === REVIEW_CATEGORY) {
    return puzzles.filter((puzzle) => getRecord(puzzle.id).needsReview);
  }

  return currentCategory === '전체'
    ? puzzles
    : puzzles.filter((puzzle) => puzzle.category === currentCategory);
}

function getCurrentPuzzle() {
  const visiblePuzzles = getVisiblePuzzles();
  if (visiblePuzzles.length === 0) {
    return null;
  }

  currentIndex = Math.min(currentIndex, visiblePuzzles.length - 1);
  return visiblePuzzles[currentIndex];
}

function chessComAnalysisUrl(fen) {
  return `https://www.chess.com/analysis?fen=${encodeURIComponent(fen)}`;
}

function formatDate(dateString) {
  if (!dateString) {
    return '없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
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

function renderEmptyReviewState() {
  board.innerHTML = '<div class="empty-board-message">복습할 문제가 없습니다</div>';
  progressCount.textContent = '0 / 0';
  sideToMove.textContent = '한 번에 해결하지 못한 문제를 저장하면 여기에 모입니다.';
  puzzleCategory.textContent = REVIEW_CATEGORY;
  puzzleDifficulty.textContent = '완료';
  puzzleTitle.textContent = '복습할 문제가 없습니다';
  puzzleGoal.textContent = '문제를 풀다가 답안을 먼저 봤거나, 복습 필요로 저장하면 이 분류에서 다시 풀 수 있습니다.';
  puzzleFen.textContent = '-';
  analysisLink.removeAttribute('href');
  answerPanel.hidden = true;
  showAnswer.disabled = true;
  markFirstTry.disabled = true;
  markReview.disabled = true;
  nextPuzzle.disabled = true;
}

function renderPuzzle() {
  const visiblePuzzles = getVisiblePuzzles();
  const puzzle = getCurrentPuzzle();

  if (!puzzle) {
    renderEmptyReviewState();
    renderDashboard();
    return;
  }

  const [, turn] = puzzle.fen.split(' ');
  const record = getRecord(puzzle.id);

  renderBoard(puzzle.fen);
  progressCount.textContent = `${currentIndex + 1} / ${visiblePuzzles.length}`;
  sideToMove.textContent = `${turn === 'w' ? '백' : '흑'} 차례 · 시도 ${record.attempts}회`;
  puzzleCategory.textContent = puzzle.category;
  puzzleDifficulty.textContent = record.needsReview ? `${puzzle.difficulty} · 복습 필요` : puzzle.difficulty;
  puzzleTitle.textContent = puzzle.title;
  puzzleGoal.textContent = puzzle.goal;
  puzzleFen.textContent = puzzle.fen;
  analysisLink.href = chessComAnalysisUrl(puzzle.fen);
  answerPanel.hidden = true;
  showAnswer.disabled = false;
  markFirstTry.disabled = false;
  markReview.disabled = false;
  nextPuzzle.disabled = false;
  showAnswer.textContent = '답안 보기';
  answerWasViewed = false;
  answerLines.innerHTML = puzzle.answer.map((line) => `<li>${line}</li>`).join('');
  answerNote.textContent = puzzle.note;
  renderDashboard();
}

function recordPuzzleResult({ solvedFirstTry }) {
  const puzzle = getCurrentPuzzle();
  if (!puzzle) {
    return;
  }

  const record = getRecord(puzzle.id);
  const solvedAt = new Date().toISOString();
  const nextRecord = {
    ...record,
    attempts: record.attempts + 1,
    firstTrySolves: record.firstTrySolves + (solvedFirstTry ? 1 : 0),
    solved: true,
    needsReview: !solvedFirstTry,
    lastSolvedAt: solvedAt
  };

  setRecord(puzzle.id, nextRecord);
  renderPuzzle();
}

function markCurrentPuzzleForReview() {
  const puzzle = getCurrentPuzzle();
  if (!puzzle) {
    return;
  }

  const record = getRecord(puzzle.id);
  setRecord(puzzle.id, {
    ...record,
    attempts: record.attempts + 1,
    solved: record.solved,
    needsReview: true,
    lastSolvedAt: record.lastSolvedAt
  });
  renderPuzzle();
}

function moveToNextPuzzle() {
  const visiblePuzzles = getVisiblePuzzles();
  if (visiblePuzzles.length === 0) {
    renderPuzzle();
    return;
  }

  currentIndex = (currentIndex + 1) % visiblePuzzles.length;
  renderPuzzle();
}

function openPuzzleById(puzzleId) {
  const puzzle = puzzles.find((candidate) => candidate.id === puzzleId);
  if (!puzzle) {
    return;
  }

  currentCategory = REVIEW_CATEGORY;
  categorySelect.value = REVIEW_CATEGORY;
  const reviewPuzzles = getVisiblePuzzles();
  currentIndex = Math.max(0, reviewPuzzles.findIndex((candidate) => candidate.id === puzzle.id));
  renderPuzzle();
  document.querySelector('.trainer-grid').scrollIntoView({ behavior: 'smooth' });
}

function renderDashboard() {
  const records = Object.entries(studyRecords);
  const solvedRecords = records.filter(([, record]) => record.solved);
  const reviewPuzzles = puzzles.filter((puzzle) => getRecord(puzzle.id).needsReview);
  const lastSolvedAt = solvedRecords
    .map(([, record]) => record.lastSolvedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  solvedCount.textContent = `${solvedRecords.length} / ${puzzles.length}`;
  recentSolvedDate.textContent = formatDate(lastSolvedAt);
  reviewCount.textContent = reviewPuzzles.length;
  renderReviewList(reviewPuzzles);
  renderTopicRates();
}

function renderReviewList(reviewPuzzles) {
  reviewList.innerHTML = '';

  if (reviewPuzzles.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-state';
    emptyMessage.textContent = '아직 다시 풀 문제가 없습니다. 답을 본 문제는 자동으로 여기에 저장됩니다.';
    reviewList.append(emptyMessage);
    return;
  }

  reviewPuzzles.forEach((puzzle) => {
    const record = getRecord(puzzle.id);
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'review-item';
    item.addEventListener('click', () => openPuzzleById(puzzle.id));

    const title = document.createElement('strong');
    title.textContent = puzzle.title;
    const meta = document.createElement('small');
    meta.textContent = `${puzzle.category} · 시도 ${record.attempts}회`;

    item.append(title, meta);
    reviewList.append(item);
  });
}

function renderTopicRates() {
  topicRates.innerHTML = '';

  [...new Set(puzzles.map((puzzle) => puzzle.category))].forEach((category) => {
    const categoryPuzzles = puzzles.filter((puzzle) => puzzle.category === category);
    const attempts = categoryPuzzles.reduce((sum, puzzle) => sum + getRecord(puzzle.id).attempts, 0);
    const firstTrySolves = categoryPuzzles.reduce((sum, puzzle) => sum + getRecord(puzzle.id).firstTrySolves, 0);
    const rate = attempts === 0 ? 0 : Math.round((firstTrySolves / attempts) * 100);

    const row = document.createElement('div');
    row.className = 'topic-rate-row';

    const label = document.createElement('div');
    label.className = 'topic-rate-label';
    label.innerHTML = `<strong>${category}</strong><span>${firstTrySolves}/${attempts} 성공</span>`;

    const meter = document.createElement('div');
    meter.className = 'topic-meter';
    const bar = document.createElement('span');
    bar.style.width = `${rate}%`;
    meter.append(bar);

    const percent = document.createElement('b');
    percent.textContent = `${rate}%`;

    row.append(label, meter, percent);
    topicRates.append(row);
  });
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

reviewOnly.addEventListener('click', () => {
  currentCategory = REVIEW_CATEGORY;
  categorySelect.value = REVIEW_CATEGORY;
  currentIndex = 0;
  renderPuzzle();
});

showAnswer.addEventListener('click', () => {
  answerPanel.hidden = !answerPanel.hidden;
  answerWasViewed = answerWasViewed || !answerPanel.hidden;
  showAnswer.textContent = answerPanel.hidden ? '답안 보기' : '답안 숨기기';
});

markFirstTry.addEventListener('click', () => {
  recordPuzzleResult({ solvedFirstTry: !answerWasViewed });
});

markReview.addEventListener('click', markCurrentPuzzleForReview);
nextPuzzle.addEventListener('click', moveToNextPuzzle);

resetStats.addEventListener('click', () => {
  studyRecords = {};
  saveStudyRecords();
  currentIndex = 0;
  renderPuzzle();
});

renderCategoryOptions();
renderPuzzle();
