# Firestore 보안 규칙 (eidos-studio-26f16)

- `firestore.rules`: Firebase 콘솔 → Firestore → 규칙 탭에 게시하는 규칙 원본 (기록용)
- 상품·메인 설정·공지·FAQ는 누구나 읽을 수 있고, **쓰기는 관리자 이메일(eidosstudio01@gmail.com)로 로그인했을 때만** 가능하다.
- 사이트에 회원가입 기능이 있으므로 "로그인만 하면 쓰기 허용"(`request.auth != null`)으로 두면 안 된다. 누구나 가입해서 상품을 지우거나 바꿀 수 있게 된다.
- 새 카테고리나 컬렉션을 추가하면 `isPublicCollection` 목록에도 추가해야 화면에 보인다.
