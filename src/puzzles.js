export const puzzles = [
  {
    id: 'pin-001',
    category: '핀과 압박',
    difficulty: '초급',
    title: '고정된 나이트를 공격하기',
    goal: '백 차례입니다. f6 나이트가 핀에 걸린 약점을 이용해 결정적인 전술을 찾으세요.',
    fen: 'r2q1rk1/ppp2ppp/2n2n2/3p4/3P2b1/2N1PN2/PPQ2PPP/R1B2RK1 w - - 0 1',
    answer: ['1. Ne5! challenges the pinned defender and increases pressure.', 'If Black trades, White recaptures and keeps the initiative against the weakened center.'],
    note: '핀에 걸린 말은 실제 방어력이 낮습니다. 먼저 압박을 추가한 뒤 구조를 열어 이득을 확정합니다.'
  },
  {
    id: 'fork-001',
    category: '포크',
    difficulty: '초급',
    title: '나이트 포크로 룩 획득',
    goal: '백 차례입니다. 나이트가 왕과 룩을 동시에 공격할 수 있는 칸을 찾으세요.',
    fen: '2r3k1/8/8/3N4/8/8/5PPP/6K1 w - - 0 1',
    answer: ['1. Ne7+! forks the king on g8 and the rook on c8.', 'After the king moves, 2. Nxc8 wins the rook.'],
    note: '나이트 포크는 서로 떨어진 두 목표를 동시에 때릴 때 강력합니다. 체크가 포함되면 상대는 먼저 왕을 움직여야 합니다.'
  },
  {
    id: 'mate-001',
    category: '체크메이트',
    difficulty: '중급',
    title: '후방 약점을 찌르는 메이트',
    goal: '백 차례입니다. 흑 왕 주변의 탈출 칸이 막혀 있습니다. 메이트 수순을 찾으세요.',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    answer: ['1. Re8#'],
    note: '왕 뒤쪽 랭크가 폰으로 막혀 있으면 룩 침투 한 수가 바로 메이트가 될 수 있습니다.'
  },
  {
    id: 'discovery-001',
    category: '디스커버드 어택',
    difficulty: '중급',
    title: '비숍 라인을 열어 퀸 공격',
    goal: '백 차례입니다. 말을 움직여 숨겨진 비숍의 공격선을 열어보세요.',
    fen: 'r2q1rk1/pp3ppp/2n1bn2/3p4/3P4/2N1PN2/PPQB1PPP/R4RK1 w - - 0 1',
    answer: ['1. Ng5! attacks e6 and uncovers pressure on h7.', 'If 1... Qd7, 2. Nxe6 wins after the discovered pressure.'],
    note: '디스커버드 어택은 움직이는 말도 위협을 만들고, 뒤의 말도 동시에 공격에 참여하게 만드는 전술입니다.'
  },
  {
    id: 'skewer-001',
    category: '스큐어',
    difficulty: '중급',
    title: '킹 뒤의 룩을 겨냥하기',
    goal: '백 차례입니다. 먼저 더 가치 있는 말을 공격해 뒤의 기물을 얻는 수를 찾으세요.',
    fen: '2q5/3k4/8/8/6B1/8/8/6K1 w - - 0 1',
    answer: ['1. Bg4+! skewers the king on d7 to the queen on c8.', 'After the king moves, 2. Bxc8+ wins the queen.'],
    note: '스큐어는 강한 기물을 먼저 공격해 이동을 강제하고, 그 뒤에 놓인 기물을 잡는 전술입니다.'
  },
  {
    id: 'sacrifice-001',
    category: '희생 공격',
    difficulty: '고급',
    title: '왕 앞 폰 구조 파괴',
    goal: '백 차례입니다. 흑 왕의 방어 폰을 깨뜨리는 희생 수를 고려해보세요.',
    fen: 'r4rk1/ppp2ppp/2n2n2/3p4/3P2b1/2N1PN2/PPQB1PPP/R4RK1 w - - 0 1',
    answer: ['1. Bxh7+! Kxh7', '2. Ng5+ Kg8', '3. Qh7# or decisive attack depending on the defense.'],
    note: '희생 전술은 후속 체크와 주요 기물의 합류가 있을 때만 강력합니다. Chess.com 분석 버튼으로 변화를 확인해보세요.'
  },
  {
    id: 'deflection-001',
    category: '디플렉션',
    difficulty: '고급',
    title: '수비자를 끌어내기',
    goal: '백 차례입니다. 핵심 방어 기물을 다른 임무로 유도해 킹을 노출시키세요.',
    fen: '4r1k1/5ppp/8/8/8/8/5PPP/4RQK1 w - - 0 1',
    answer: ['1. Rxe8+! Qxe8 is impossible because there is no queen defender.', 'After the rook is deflected, White controls the e-file and wins the attack.'],
    note: '디플렉션은 방어자의 위치나 역할을 바꿔 원래 지키던 약점을 무너뜨리는 전술입니다.'
  },
  {
    id: 'endgame-001',
    category: '엔드게임 전술',
    difficulty: '중급',
    title: '패스 폰을 만드는 체크',
    goal: '백 차례입니다. 오포지션으로 왕을 밀어내고 폰 전진을 보장하는 계획을 찾으세요.',
    fen: '8/8/8/4k3/4P3/8/4K3/8 w - - 0 1',
    answer: ['1. Ke3! keeps opposition.', 'If 1... Kf6 2. Kf4 and White supports the passer.'],
    note: '엔드게임에서도 전술의 핵심은 템포입니다. 체크와 오포지션으로 상대 왕을 밀어냅니다.'
  }
];
