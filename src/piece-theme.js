const pieceImages = {
  '♔': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_klt45.svg',
  '♕': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_qlt45.svg',
  '♖': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_rlt45.svg',
  '♗': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_blt45.svg',
  '♘': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_nlt45.svg',
  '♙': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_plt45.svg',
  '♚': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_kdt45.svg',
  '♛': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_qdt45.svg',
  '♜': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_rdt45.svg',
  '♝': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_bdt45.svg',
  '♞': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_ndt45.svg',
  '♟': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_pdt45.svg'
};

const pieceNames = {
  '♔': 'white king',
  '♕': 'white queen',
  '♖': 'white rook',
  '♗': 'white bishop',
  '♘': 'white knight',
  '♙': 'white pawn',
  '♚': 'black king',
  '♛': 'black queen',
  '♜': 'black rook',
  '♝': 'black bishop',
  '♞': 'black knight',
  '♟': 'black pawn'
};

function renderPieceTheme() {
  document.querySelectorAll('.piece').forEach((piece) => {
    if (piece.dataset.svgPiece === 'true') {
      return;
    }

    const glyph = piece.textContent.trim();
    const imageUrl = pieceImages[glyph];
    if (!imageUrl) {
      return;
    }

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = pieceNames[glyph];
    image.loading = 'eager';
    image.decoding = 'async';
    image.draggable = false;

    piece.dataset.svgPiece = 'true';
    piece.replaceChildren(image);
  });
}

const board = document.querySelector('#board');
if (board) {
  const observer = new MutationObserver(() => requestAnimationFrame(renderPieceTheme));
  observer.observe(board, { childList: true });
}

renderPieceTheme();
