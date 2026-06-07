import { puzzles as defaultPuzzles } from './puzzles.js?v=20260607-mate2';

const pieceGlyphs = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
};

const STORAGE_KEY = 'chess-tactics-study-records-v1';
const CUSTOM_PUZZLES_KEY = 'chess-tactics-custom-puzzles-v2';
const REVIEW_CATEGORY = '복습 문제';
const ALL_CATEGORY = '전체';
const fenPattern = /^([pnbrqkPNBRQK1-8]+\/){7}[pnbrqkPNBRQK1-8]+\s[wb]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s\d+\s\d+$/;

const categorySelect = document.querySelector('#category-select');
const resetCategory = document.querySelector('#reset-category');
const puzzleImport = document.querySelector('#puzzle-import');
const restoreDefaultPuzzles = document.querySelector('#restore-default-puzzles');
const downloadSampleJson = document.querySelector('#download-sample-json');
const importStatus = document.querySelector('#import-status');
const studyTab = document.querySelector('#study-tab');
const summaryTab = document.querySelector('#summary-tab');
const reviewTab = document.querySelector('#review-tab');
const studyView = document.querySelector('#study-view');
const summaryView = document.querySelector('#summary-view');
const reviewView = document.querySelector('#review-view');
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
const resetCurrent = document.querySelector('#reset-current');
const previousPuzzle = document.querySelector('#previous-puzzle');
const nextPuzzle = document.querySelector('#next-puzzle');
const analysisLink = document.querySelector('#analysis-link');
const solvedCount = document.querySelector('#solved-count');
const recentSolvedDate = document.querySelector('#recent-solved-date');
const reviewCount = document.querySelector('#review-count');
const solvedList = document.querySelector('#solved-list');
const reviewList = document.querySelector('#review-list');
const topicRates = document.querySelector('#topic-rates');
const resetStats = document.querySelector('#reset-stats');
const startReviewSession = document.querySelector('#start-review-session');

let activePuzzles = loadCustomPuzzles() ?? defaultPuzzles;
let categories = buildCategories(activePuzzles);
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

function loadCustomPuzzles() {
  try {
    const storedPuzzles = localStorage.getItem(CUSTOM_PUZZLES_KEY);
    return storedPuzzles ? normalizePuzzleData(JSON.parse(storedPuzzles)) : null;
  } catch {
    localStorage.removeItem(CUSTOM_PUZZLES_KEY);
    return null;
  }
}

function saveCustomPuzzles(nextPuzzles) {
  localStorage.setItem(CUSTOM_PUZZLES_KEY, JSON.stringify(nextPuzzles));
}

function buildCategories(puzzleSet) {
  return [ALL_CATEGORY, ...new Set(puzzleSet.map((puzzle) => puzzle.category))];
}

function usingCustomPuzzles() {
  return localStorage.getItem(CUSTOM_PUZZLES_KEY) !== null;
}

function updateImportStatus(message = null, isError = false) {
  const source = usingCustomPuzzles() ? `개인 JSON ${activePuzzles.length}문제 사용 중` : `기본 샘플 ${defaultPuzzles.length}문제 사용 중`;
  importStatus.textContent = message ?? source;
  importStatus.classList.toggle('error', isError);
  restoreDefaultPuzzles.disabled = !usingCustomPuzzles();
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
    return activePuzzles.filter((puzzle) => getRecord(puzzle.id).needsReview);
  }

  return currentCategory === ALL_CATEGORY
    ? activePuzzles
    : activePuzzles.filter((puzzle) => puzzle.category === currentCategory);
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
  categorySelect.replaceChildren();
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  });
}

function selectCategoryOption(category) {
  if (![...categorySelect.options].some((option) => option.value === category)) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  }

  categorySelect.value = category;
}

function refreshPuzzleSet(nextPuzzles) {
  activePuzzles = nextPuzzles;
  categories = buildCategories(activePuzzles);
  currentCategory = categories[0];
  currentIndex = 0;
  answerWasViewed = false;
  renderCategoryOptions();
  renderPuzzle();
  updateImportStatus();
}

function showView(viewName) {
  const isStudy = viewName === 'study';
  const isSummary = viewName === 'summary';
  const isReview = viewName === 'review';

  studyView.hidden = !isStudy;
  summaryView.hidden = !isSummary;
  reviewView.hidden = !isReview;
  studyTab.classList.toggle('active', isStudy);
  summaryTab.classList.toggle('active', isSummary);
  reviewTab.classList.toggle('active', isReview);
  studyTab.classList.toggle('secondary', !isStudy);
  summaryTab.classList.toggle('secondary', !isSummary);
  reviewTab.classList.toggle('secondary', !isReview);
  renderDashboard();
}

function renderBoard(fen) {
  const [placement] = fen.split(' ');
  const fragment = document.createDocumentFragment();

  placement.split('/').forEach((rank, rankIndex) => {
    let fileIndex = 0;
    for (const token of rank) {
      if (/\d/.test(token)) {
        const emptyCount = Number(token);
        for (let i = 0; i < emptyCount; i += 1) {
          fragment.append(createSquare('', '', rankIndex, fileIndex));
          fileIndex += 1;
        }
      } else {
        fragment.append(createSquare(pieceGlyphs[token], token, rankIndex, fileIndex));
        fileIndex += 1;
      }
    }
  });

  board.replaceChildren(fragment);
}

function createSquare(piece, token, rankIndex, fileIndex) {
  const square = document.createElement('div');
  const isLight = (rankIndex + fileIndex) % 2 === 0;
  const file = String.fromCharCode(97 + fileIndex);
  const rank = 8 - rankIndex;
  const label = `${file}${rank}`;

  square.className = `square ${isLight ? 'light' : 'dark'}`;
  square.setAttribute('aria-label', label);

  const pieceLabel = document.createElement('span');
  pieceLabel.className = `piece ${token ? (token === token.toUpperCase() ? 'white-piece' : 'black-piece') : ''}`.trim();
  pieceLabel.textContent = piece;

  const coordinate = document.createElement('small');
  coordinate.textContent = label;

  square.append(pieceLabel, coordinate);
  return square;
}

function renderEmptyReviewState() {
  const emptyMessage = document.createElement('div');
  emptyMessage.className = 'empty-board-message';
  emptyMessage.textContent = '복습할 문제가 없습니다';
  board.replaceChildren(emptyMessage);
  progressCount.textContent = '0 / 0';
  sideToMove.textContent = '복습 필요로 저장한 문제가 여기에 모입니다.';
  puzzleCategory.textContent = REVIEW_CATEGORY;
  puzzleDifficulty.textContent = '완료';
  puzzleTitle.textContent = '복습할 문제가 없습니다';
  puzzleGoal.textContent = '문제 화면에서 복습 필요로 저장한 문제만 이 창에서 다시 풀 수 있습니다.';
  puzzleFen.textContent = '-';
  analysisLink.removeAttribute('href');
  answerPanel.hidden = true;
  showAnswer.disabled = true;
  markFirstTry.disabled = true;
  markReview.disabled = true;
  resetCurrent.disabled = true;
  previousPuzzle.disabled = true;
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
  resetCurrent.disabled = false;
  previousPuzzle.disabled = false;
  nextPuzzle.disabled = false;
  showAnswer.textContent = '답안 보기';
  answerWasViewed = false;
  renderAnswerLines(puzzle.answer);
  answerNote.textContent = puzzle.note;
  renderDashboard();
}

function renderAnswerLines(lines) {
  answerLines.replaceChildren();
  lines.forEach((line) => {
    const item = document.createElement('li');
    item.textContent = line;
    answerLines.append(item);
  });
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
    needsReview: false,
    lastSolvedAt: solvedAt
  };

  setRecord(puzzle.id, nextRecord);
  renderPuzzle();
}

function resetCurrentPuzzleRecord() {
  const puzzle = getCurrentPuzzle();
  if (!puzzle) {
    return;
  }

  delete studyRecords[puzzle.id];
  saveStudyRecords();
  currentCategory = puzzle.category;
  selectCategoryOption(puzzle.category);
  currentIndex = Math.max(0, getVisiblePuzzles().findIndex((candidate) => candidate.id === puzzle.id));
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

function moveToPreviousPuzzle() {
  const visiblePuzzles = getVisiblePuzzles();
  if (visiblePuzzles.length === 0) {
    renderPuzzle();
    return;
  }

  currentIndex = (currentIndex - 1 + visiblePuzzles.length) % visiblePuzzles.length;
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

function openPuzzleById(puzzleId, targetCategory = null) {
  const puzzle = activePuzzles.find((candidate) => candidate.id === puzzleId);
  if (!puzzle) {
    return;
  }

  currentCategory = targetCategory ?? (getRecord(puzzle.id).needsReview ? REVIEW_CATEGORY : puzzle.category);
  selectCategoryOption(currentCategory);
  const visiblePuzzles = getVisiblePuzzles();
  currentIndex = Math.max(0, visiblePuzzles.findIndex((candidate) => candidate.id === puzzle.id));
  renderPuzzle();
  showView('study');
  document.querySelector('.trainer-grid').scrollIntoView({ behavior: 'smooth' });
}

function renderDashboard() {
  const records = Object.entries(studyRecords);
  const solvedRecords = records.filter(([, record]) => record.solved);
  const solvedPuzzles = activePuzzles.filter((puzzle) => getRecord(puzzle.id).solved);
  const reviewPuzzles = activePuzzles.filter((puzzle) => getRecord(puzzle.id).needsReview);
  const lastSolvedAt = solvedRecords
    .map(([, record]) => record.lastSolvedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  solvedCount.textContent = `${solvedPuzzles.length} / ${activePuzzles.length}`;
  recentSolvedDate.textContent = formatDate(lastSolvedAt);
  reviewCount.textContent = reviewPuzzles.length;
  startReviewSession.disabled = reviewPuzzles.length === 0;
  renderSolvedList(solvedPuzzles);
  renderReviewList(reviewPuzzles);
  renderTopicRates();
}

function renderSolvedList(solvedPuzzles) {
  renderNumberedPuzzleList({
    container: solvedList,
    puzzlesToRender: solvedPuzzles,
    emptyText: '아직 푼 문제가 없습니다. 한 번에 해결 또는 답안 확인 후 해결을 누르면 여기에 저장됩니다.',
    targetCategory: (puzzle) => puzzle.category
  });
}

function renderReviewList(reviewPuzzles) {
  renderNumberedPuzzleList({
    container: reviewList,
    puzzlesToRender: reviewPuzzles,
    emptyText: '아직 복습할 문제가 없습니다. 문제 화면에서 “복습 필요로 저장”을 누른 문제만 여기에 저장됩니다.',
    targetCategory: () => REVIEW_CATEGORY
  });
}

function renderNumberedPuzzleList({ container, puzzlesToRender, emptyText, targetCategory }) {
  container.replaceChildren();

  if (puzzlesToRender.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-state';
    emptyMessage.textContent = emptyText;
    container.append(emptyMessage);
    return;
  }

  puzzlesToRender.forEach((puzzle) => {
    const record = getRecord(puzzle.id);
    const originalNumber = activePuzzles.findIndex((candidate) => candidate.id === puzzle.id) + 1;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'numbered-puzzle-item';
    item.addEventListener('click', () => openPuzzleById(puzzle.id, targetCategory(puzzle)));

    const number = document.createElement('span');
    number.className = 'puzzle-number';
    number.textContent = originalNumber;
    const text = document.createElement('span');
    text.className = 'puzzle-list-text';
    const title = document.createElement('strong');
    title.textContent = puzzle.title;
    const meta = document.createElement('small');
    meta.textContent = `${puzzle.category} · 시도 ${record.attempts}회 · 최근 ${formatDate(record.lastSolvedAt)}`;

    text.append(title, meta);
    item.append(number, text);
    container.append(item);
  });
}

function renderTopicRates() {
  topicRates.replaceChildren();

  [...new Set(activePuzzles.map((puzzle) => puzzle.category))].forEach((category) => {
    const categoryPuzzles = activePuzzles.filter((puzzle) => puzzle.category === category);
    const attempts = categoryPuzzles.reduce((sum, puzzle) => sum + getRecord(puzzle.id).attempts, 0);
    const firstTrySolves = categoryPuzzles.reduce((sum, puzzle) => sum + getRecord(puzzle.id).firstTrySolves, 0);
    const rate = attempts === 0 ? 0 : Math.round((firstTrySolves / attempts) * 100);
    const latestSolvedAt = categoryPuzzles
      .map((puzzle) => getRecord(puzzle.id).lastSolvedAt)
      .filter(Boolean)
      .sort()
      .at(-1);

    const row = document.createElement('div');
    row.className = 'topic-rate-row';

    const label = document.createElement('div');
    label.className = 'topic-rate-label';
    const categoryName = document.createElement('strong');
    categoryName.textContent = category;
    const detail = document.createElement('span');
    detail.textContent = `${firstTrySolves}/${attempts} 성공 · 최근 ${formatDate(latestSolvedAt)}`;
    label.append(categoryName, detail);

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

function validateFen(fen) {
  if (!fenPattern.test(fen)) {
    return false;
  }

  const ranks = fen.split(' ')[0].split('/');
  return ranks.every((rank) => {
    const width = [...rank].reduce((sum, token) => sum + (/\d/.test(token) ? Number(token) : 1), 0);
    return width === 8;
  });
}

function normalizePuzzleData(rawData) {
  const rawPuzzles = Array.isArray(rawData) ? rawData : rawData?.puzzles;
  if (!Array.isArray(rawPuzzles) || rawPuzzles.length === 0) {
    throw new Error('JSON은 퍼즐 배열이거나 { "puzzles": [...] } 형식이어야 합니다.');
  }

  const ids = new Set();
  return rawPuzzles.map((puzzle, index) => {
    const normalized = {
      id: String(puzzle.id ?? `custom-${index + 1}`).trim(),
      category: String(puzzle.category ?? '개인 문제').trim(),
      difficulty: String(puzzle.difficulty ?? '개인').trim(),
      title: String(puzzle.title ?? `문제 ${index + 1}`).trim(),
      goal: String(puzzle.goal ?? '최선의 수를 찾으세요.').trim(),
      fen: String(puzzle.fen ?? '').trim(),
      answer: Array.isArray(puzzle.answer) ? puzzle.answer.map((line) => String(line)) : [],
      note: String(puzzle.note ?? '').trim()
    };

    for (const field of ['id', 'category', 'difficulty', 'title', 'goal', 'fen', 'note']) {
      if (!normalized[field]) {
        throw new Error(`${index + 1}번 문제에 ${field} 값이 없습니다.`);
      }
    }

    if (ids.has(normalized.id)) {
      throw new Error(`중복된 id가 있습니다: ${normalized.id}`);
    }
    ids.add(normalized.id);

    if (!validateFen(normalized.fen)) {
      throw new Error(`${normalized.id}의 FEN 형식이 올바르지 않습니다.`);
    }

    if (normalized.answer.length === 0 || normalized.answer.some((line) => !line.trim())) {
      throw new Error(`${normalized.id}에는 비어 있지 않은 answer 배열이 필요합니다.`);
    }

    return normalized;
  });
}

async function importPuzzleJson(file) {
  const text = await file.text();
  const nextPuzzles = normalizePuzzleData(JSON.parse(text));
  saveCustomPuzzles(nextPuzzles);
  refreshPuzzleSet(nextPuzzles);
  updateImportStatus(`${file.name}에서 ${nextPuzzles.length}문제를 불러왔습니다.`);
}

function downloadSamplePuzzleJson() {
  const sample = {
    puzzles: defaultPuzzles.slice(0, 2)
  };
  const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'puzzles-sample.json';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

categorySelect.addEventListener('change', (event) => {
  currentCategory = event.target.value;
  currentIndex = 0;
  renderPuzzle();
});

resetCategory.addEventListener('click', () => {
  if (currentCategory === REVIEW_CATEGORY) {
    currentCategory = ALL_CATEGORY;
    selectCategoryOption(currentCategory);
  }

  currentIndex = 0;
  renderPuzzle();
});

puzzleImport.addEventListener('change', async (event) => {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  try {
    await importPuzzleJson(file);
  } catch (error) {
    updateImportStatus(error.message, true);
  } finally {
    puzzleImport.value = '';
  }
});

restoreDefaultPuzzles.addEventListener('click', () => {
  localStorage.removeItem(CUSTOM_PUZZLES_KEY);
  refreshPuzzleSet(defaultPuzzles);
});

downloadSampleJson.addEventListener('click', downloadSamplePuzzleJson);

showAnswer.addEventListener('click', () => {
  answerPanel.hidden = !answerPanel.hidden;
  answerWasViewed = answerWasViewed || !answerPanel.hidden;
  showAnswer.textContent = answerPanel.hidden ? '답안 보기' : '답안 숨기기';
});

markFirstTry.addEventListener('click', () => {
  recordPuzzleResult({ solvedFirstTry: !answerWasViewed });
});

markReview.addEventListener('click', markCurrentPuzzleForReview);
resetCurrent.addEventListener('click', resetCurrentPuzzleRecord);
previousPuzzle.addEventListener('click', moveToPreviousPuzzle);
nextPuzzle.addEventListener('click', moveToNextPuzzle);

resetStats.addEventListener('click', () => {
  studyRecords = {};
  saveStudyRecords();
  currentIndex = 0;
  renderPuzzle();
  renderDashboard();
});

studyTab.addEventListener('click', () => showView('study'));
summaryTab.addEventListener('click', () => showView('summary'));
reviewTab.addEventListener('click', () => showView('review'));

startReviewSession.addEventListener('click', () => {
  currentCategory = REVIEW_CATEGORY;
  selectCategoryOption(REVIEW_CATEGORY);
  currentIndex = 0;
  renderPuzzle();
  showView('study');
});

renderCategoryOptions();
renderPuzzle();
showView('study');
updateImportStatus();
