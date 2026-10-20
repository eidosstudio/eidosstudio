# eidosstudio.co.kr (에이도스 스튜디오 포트폴리오 + 쇼핑 사이트)

에이도스 스튜디오(아트 퍼니처·소품·오브제 제작)의 공식 사이트.
사용자는 비개발자(대표 1인)이므로 설명은 쉬운 한국어로, 변경은 작고 확인 가능하게 한다.

## 구조

| 파일 | 역할 |
| --- | --- |
| `index.html` | 사이트 전체(페이지 전환형 단일 HTML). CSS·JS 모두 포함 |
| `CNAME` | 커스텀 도메인 `eidosstudio.co.kr`. 절대 지우거나 바꾸지 않는다 |
| `README.md` | GitHub 프로필에 표시되는 소개글(이 저장소 이름이 계정 이름과 같아서) |

- 빌드 도구 없음. 호스팅: GitHub Pages(`main` 브랜치), DNS는 Cloudflare, HTTPS는 Pages에서 강제.
- `main`에 머지되면 바로 실서비스에 반영된다.
- GitHub Actions는 무료 크레딧 보호를 위해 사용하지 않는다. 워크플로 파일을 추가하지 않는다.
- 디자인 참고 사이트: hpix.co.kr

## 데이터 (Firebase 프로젝트 `eidos-studio-26f16`)

- Firebase Auth: 관리자 이메일 로그인(`signInWithEmailAndPassword`). 관리자 이메일과 일치할 때만 편집 버튼이 보인다.
- Firestore 컬렉션:
  - `products_props`, `products_furniture`, `products_lighting`, `products_object`, `products_craft` — 카테고리별 상품
  - `settings/mainpage` — 메인 페이지 섹션(히어로 슬라이더, PROMOTION, CURRENT VIEW, UPCOMING) 내용
- 상품 이미지는 외부 URL을 사용한다. Firebase Storage는 유료 플랜이 필요해서 쓰지 않는다.
- 위시리스트·장바구니는 브라우저 localStorage(`eidos_wishlist`, `eidos_cart`)에 저장된다.
- 카테고리를 추가하면 위시리스트 로딩 코드의 `cats` 배열 등 카테고리 목록이 하드코딩된 곳을 모두 함께 고쳐야 한다.

## 작업 규칙 (반드시 지킬 것)

1. 수정 전에 무엇을, 어디를, 왜 바꾸는지 계획을 먼저 보여주고 승인받는다.
2. 큰 수정은 단계로 나눈다. 한 단계 = 한 가지 변경.
3. 매 단계 후 문법 검증: `python3 .claude/scripts/check-html.py index.html`
4. 관리자 에디터로 수정 가능한 영역(메인 섹션, 상품)의 내용은 코드에 하드코딩하지 않는다.
5. 요청 범위 밖의 코드는 정리·리팩터링하지 않는다.
6. 화면 변경은 데스크톱과 모바일(폭 390px) 양쪽에서 깨지지 않는지 확인 방법을 PR에 적는다.
7. 변경은 `claude/`로 시작하는 브랜치에 올리고 PR로 제안한다. `main`에 직접 푸시하지 않는다.

## 진행 중·예정

- 결제: 단기 PayApp, 장기 Toss Payments 연동 검토 중. 결제 키는 코드·채팅·커밋에 절대 넣지 않는다.
- 통신판매업 신고 완료 상태. 사업자 정보 표기를 바꿀 때는 사용자에게 확인한다.
