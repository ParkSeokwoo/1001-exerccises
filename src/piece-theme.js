const solidGlyphs = {
  '♔': '♚',
  '♕': '♛',
  '♖': '♜',
  '♗': '♝',
  '♘': '♞',
  '♙': '♟',
  '♚': '♚',
  '♛': '♛',
  '♜': '♜',
  '♝': '♝',
  '♞': '♞',
  '♟': '♟'
};

const pieceNames = {
  '♔': 'king',
  '♕': 'queen',
  '♖': 'rook',
  '♗': 'bishop',
  '♘': 'knight',
  '♙': 'pawn',
  '♚': 'king',
  '♛': 'queen',
  '♜': 'rook',
  '♝': 'bishop',
  '♞': 'knight',
  '♟': 'pawn'
};

function renderPieceTheme() {
  document.querySelectorAll('.piece').forEach((piece) => {
    const original = piece.dataset.originalGlyph || piece.textContent.trim();
    if (!solidGlyphs[original]) {
      return;
    }

    piece.dataset.originalGlyph = original;
    piece.dataset.piece = pieceNames[original];
    piece.textContent = solidGlyphs[original];
  });
}

const observer = new MutationObserver(renderPieceTheme);
observer.observe(document.body, { childList: true, subtree: true });
renderPieceTheme();
