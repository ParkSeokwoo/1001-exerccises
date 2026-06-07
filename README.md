# 1001 체스 전술 트레이너

정적 웹사이트 형태의 체스 전술 문제집입니다. 기본 샘플 문제는 `src/puzzles.js`에 들어 있고, 개인 문제는 브라우저에서 JSON 파일로 불러와 로컬 저장소에만 저장할 수 있습니다.

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
- 개인 `puzzles.json` 파일을 브라우저에서 불러와 공개 저장소에 올리지 않고 학습

## 쉽게 접속하는 공개 사이트 주소

이 저장소를 GitHub에 올리고 GitHub Pages가 활성화되면 아래 주소로 바로 접속할 수 있습니다.

```text
https://<깃허브아이디>.github.io/1001-exerccises/
```

예를 들어 GitHub 아이디가 `myname`이면 주소는 `https://myname.github.io/1001-exerccises/` 입니다.

이 프로젝트에는 GitHub Pages 자동 배포 설정이 포함되어 있어서, `main` 또는 `work` 브랜치에 푸시되면 정적 사이트가 자동으로 배포됩니다. 로컬에서 `npm run serve`를 실행하지 않아도 됩니다.

## 개인 JSON 불러오기

저작권이 있거나 개인적으로만 사용할 문제는 저장소에 커밋하지 말고 사이트 화면의 `개인 JSON 불러오기` 버튼으로 불러오세요. 불러온 문제는 현재 브라우저의 `localStorage`에만 저장되고 GitHub Pages나 저장소에는 업로드되지 않습니다.

화면의 `샘플 JSON 저장` 버튼을 누르면 형식 예시 파일을 받을 수 있습니다. 개인 문제 파일은 배열 또는 `{ "puzzles": [...] }` 형식을 지원합니다.

```json
{
  "puzzles": [
    {
      "id": "custom-001",
      "category": "체크메이트",
      "difficulty": "초급",
      "title": "문제 제목",
      "goal": "백 차례입니다. 최선의 수를 찾으세요.",
      "fen": "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
      "answer": ["1. Re8#"],
      "note": "해설"
    }
  ]
}
```

필수 필드:

- `id`: 중복되지 않는 문제 ID
- `category`: 분류 이름
- `difficulty`: 난이도 표시
- `title`: 문제 제목
- `goal`: 사용자에게 보여줄 목표 설명
- `fen`: 표준 FEN 문자열
- `answer`: 하나 이상의 정답 수순 문자열 배열
- `note`: 해설

`기본 문제로 복원` 버튼을 누르면 브라우저에 저장된 개인 JSON을 지우고 기본 샘플 문제로 돌아갑니다.

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

## 기본 문제 추가 방법

공개해도 되는 문제를 저장소 기본 데이터로 추가하려면 `src/puzzles.js`의 `puzzles` 배열에 아래 형식의 객체를 추가합니다.

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
