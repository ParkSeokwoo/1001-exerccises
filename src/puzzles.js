export const puzzles = [
  {
    id: 'mate-in-1-001',
    category: '메이트 인 1',
    difficulty: '초급',
    title: '메이트 인 1 - 1번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: 'kr6/1p6/p7/4b3/8/8/1P4BP/R6K w - - 0 1',
    answer: ['1. Rxa6#'],
    note: '룩이 a파일의 방해물을 제거하면서 a8의 흑 왕을 직접 공격합니다.'
  },
  {
    id: 'mate-in-1-002',
    category: '메이트 인 1',
    difficulty: '초급',
    title: '메이트 인 1 - 2번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: 'r2B3k/5p1p/8/8/8/b7/7P/K5R1 w - - 0 1',
    answer: ['1. Bf6#'],
    note: '비숍이 f6으로 이동해 h8 왕을 대각선으로 공격하고, 룩이 탈출 칸을 막습니다.'
  },
  {
    id: 'mate-in-1-003',
    category: '메이트 인 1',
    difficulty: '초급',
    title: '메이트 인 1 - 3번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: '8/R6p/4pkp1/3rN3/3P3P/6P1/2n3K1/8 w - - 0 1',
    answer: ['1. Rf7#'],
    note: '룩이 7랭크에서 f파일로 들어가고 나이트가 룩을 보호합니다.'
  },
  {
    id: 'mate-in-1-004',
    category: '메이트 인 1',
    difficulty: '초급',
    title: '메이트 인 1 - 4번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: '7k/2r1n1p1/4Bp2/3P4/5Kp1/6P1/2p2PP1/R7 w - - 0 1',
    answer: ['1. Rh1#'],
    note: '룩이 h파일을 장악하고, 비숍이 g8 탈출 칸을 통제합니다.'
  },
  {
    id: 'mate-in-1-005',
    category: '메이트 인 1',
    difficulty: '초급',
    title: '메이트 인 1 - 5번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: '1k1r4/1bNr4/3P1p2/6p1/7p/8/6PP/RR5K w - - 0 1',
    answer: ['1. Na6#'],
    note: 'c7 백 나이트가 a6으로 이동해 b8 왕을 체크메이트합니다.'
  },
  {
    id: 'mate-in-1-006',
    category: '메이트 인 1',
    difficulty: '초급',
    title: '메이트 인 1 - 6번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: 'r6R/ppk1b3/2p1P3/P7/3N4/4q3/6PP/2R4K w - - 0 1',
    answer: ['1. Rxc6#'],
    note: '룩이 c6의 방해물을 제거하면서 c파일로 왕을 공격합니다. d4 나이트가 c6을 지켜 줍니다.'
  },
  {
    id: 'mate-in-1-007',
    category: '메이트 인 1',
    difficulty: '중급',
    title: '메이트 인 1 - 7번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: '2rrk1n1/1nQ1p2N/pB5p/6p1/qP3p2/2P4P/P3BPP1/3R2K1 w - - 0 1',
    answer: ['1. Bh5#'],
    note: '비숍이 h5로 이동해 e8 왕을 대각선으로 공격합니다. 주변 기물들이 탈출 칸을 막고 있습니다.'
  },
  {
    id: 'mate-in-1-008',
    category: '메이트 인 1',
    difficulty: '초급',
    title: '메이트 인 1 - 8번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: '8/P7/2b1n3/2bk1N2/5P2/3P2Pp/4P2P/7K w - - 0 1',
    answer: ['1. Ne7#'],
    note: '나이트가 e7로 이동해 d5 왕을 공격하고 주변 칸을 동시에 통제합니다.'
  },
  {
    id: 'mate-in-1-009',
    category: '메이트 인 1',
    difficulty: '초급',
    title: '메이트 인 1 - 9번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: '6kb/p3p2p/5P1B/4Nn2/8/8/7P/R6K w - - 0 1',
    answer: ['1. f7#'],
    note: 'f폰이 전진해 g8 왕을 공격하고, 비숍과 나이트가 탈출 칸을 통제합니다.'
  },
  {
    id: 'mate-in-1-010',
    category: '메이트 인 1',
    difficulty: '초급',
    title: '메이트 인 1 - 10번',
    goal: '백 차례입니다. 흑 왕을 1수 만에 체크메이트하는 수를 찾으세요.',
    fen: 'r2B3k/5p1p/7N/8/8/b7/7P/K7 w - - 0 1',
    answer: ['1. Bf6#'],
    note: '비숍이 f6으로 이동해 h8 왕을 대각선으로 공격하고, h6 나이트가 g8 탈출 칸을 막습니다.'
  }
];
