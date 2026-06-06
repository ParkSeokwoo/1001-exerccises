# 1001 체스 전술 트레이너

정적 웹사이트 형태의 체스 전술 문제집입니다. 문제는 `src/puzzles.js`에 분류, 난이도, 목표, FEN, 답안 수순으로 저장되며 브라우저에서 바로 학습할 수 있습니다.

## 기능

- 전술 테마별 문제 분류와 필터링
- 현재 분류 안에서 진행도 표시
- 답안 보기/숨기기 버튼
- 다음 문제 이동 버튼
- 각 문제의 FEN 표시
- FEN을 인코딩해 Chess.com 분석 보드로 여는 버튼
- FEN 배치를 시각화하는 간단한 체스판 렌더러
- 브라우저에 저장되는 학습 정리 창: 해결한 문제 수, 전체/카테고리별 최근 풀이 날짜, 다시 풀 문제, 주제별 성공률
- 푼 문제와 복습 필요 문제를 번호 목록으로 정리하고, 번호를 누르면 해당 문제로 바로 이동
- 답안 보기만으로는 복습 목록에 들어가지 않고, 복습 필요로 직접 표시한 문제만 모아 다시 푸는 별도 복습 창과 복습 모드
- 이미 푼 문제를 다시 풀 수 있도록 개별 문제 기록 리셋

## 쉽게 접속하는 공개 사이트 주소

이 저장소를 GitHub에 올리고 GitHub Pages가 활성화되면 아래 주소로 바로 접속할 수 있습니다.

```text
https://<깃허브아이디>.github.io/1001-exerccises/
```

예를 들어 GitHub 아이디가 `myname`이면 주소는 `https://myname.github.io/1001-exerccises/` 입니다.

이 프로젝트에는 GitHub Pages 자동 배포 설정이 포함되어 있어서, `main` 또는 `work` 브랜치에 푸시되면 정적 사이트가 자동으로 배포됩니다. 로컬에서 `npm run serve`를 실행하지 않아도 됩니다.


## GitHub Pages 오류 해결

Actions에서 아래 오류가 나오면 저장소의 GitHub Pages가 아직 활성화되지 않은 상태입니다.

```text
Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions
```

또는 아래 오류가 나오면 Actions 토큰이 Pages 사이트를 새로 만들 권한이 없다는 뜻입니다. 이 경우 workflow에서 자동으로 해결할 수 없고, 저장소 소유자가 GitHub 화면에서 Pages를 한 번 켜야 합니다.

```text
Create Pages site failed. Error: Resource not accessible by integration
```

해결 순서:

1. GitHub 저장소에서 `Settings` → `Pages`로 이동합니다.
2. `Build and deployment`의 `Source`를 `GitHub Actions`로 바꿉니다.
3. `Actions` 탭으로 돌아가 `Deploy static chess tactics site to GitHub Pages` workflow를 다시 실행합니다.
4. 성공하면 `https://parkseokwoo.github.io/1001-exerccises/` 주소로 접속합니다.

## 로컬에서 미리 보기

공개 배포 전에 내 컴퓨터에서만 확인하고 싶을 때만 아래 명령을 사용합니다.

```bash
npm run serve
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

## 문제 추가 방법

`src/puzzles.js`의 `puzzles` 배열에 아래 형식의 객체를 추가합니다.

```js
{
  id: 'unique-id',
  category: '체크메이트',
  difficulty: '중급',
  title: '문제 제목',
  goal: '사용자에게 보여줄 목표 설명',
  fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
  answer: ['1. Re8#'],
  note: '해설'
}
```

문제를 추가한 뒤에는 다음 명령으로 필수 필드와 FEN 형식을 확인합니다.

```bash
npm test
```
