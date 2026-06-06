import { puzzles } from '../src/puzzles.js';

const fenPattern = /^([pnbrqkPNBRQK1-8]+\/){7}[pnbrqkPNBRQK1-8]+\s[wb]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s\d+\s\d+$/;
let hasFailure = false;

function fail(message) {
  hasFailure = true;
  console.error(`✗ ${message}`);
}

if (puzzles.length === 0) {
  fail('At least one puzzle is required.');
}

const ids = new Set();
for (const puzzle of puzzles) {
  if (ids.has(puzzle.id)) {
    fail(`Duplicate puzzle id: ${puzzle.id}`);
  }
  ids.add(puzzle.id);

  for (const field of ['id', 'category', 'difficulty', 'title', 'goal', 'fen', 'note']) {
    if (!puzzle[field]) {
      fail(`${puzzle.id ?? 'unknown'} is missing ${field}.`);
    }
  }

  if (!Array.isArray(puzzle.answer) || puzzle.answer.length === 0) {
    fail(`${puzzle.id} must include at least one answer line.`);
  }

  if (!fenPattern.test(puzzle.fen)) {
    fail(`${puzzle.id} has an invalid FEN format.`);
    continue;
  }

  const ranks = puzzle.fen.split(' ')[0].split('/');
  ranks.forEach((rank, index) => {
    const width = [...rank].reduce((sum, token) => sum + (/\d/.test(token) ? Number(token) : 1), 0);
    if (width !== 8) {
      fail(`${puzzle.id} rank ${index + 1} has width ${width}, expected 8.`);
    }
  });
}

if (hasFailure) {
  process.exit(1);
}

console.log(`✓ Validated ${puzzles.length} puzzles across ${new Set(puzzles.map((puzzle) => puzzle.category)).size} categories.`);
