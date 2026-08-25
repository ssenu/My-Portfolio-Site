# 포트폴리오 사이트 — 콘텐츠 추가 가이드

이 저장소는 Astro 정적 포트폴리오다. 콘텐츠 추가/수정은 아래 규칙만 따르면 된다.
**모든 텍스트는 ko/en 두 언어 필수. 작업 후 `npm run check && npm run build` 통과 확인 후 커밋.**

## 프로젝트 추가
**원본 소스는 Obsidian 볼트다: `C:\mainVault\00_개인\포트폴리오\<프로젝트명>.md` (프로젝트 하나당 파일 하나, 이미지는 같은 폴더의 `첨부파일/`에 `![[파일명]]`으로 임베드).** 프로젝트 추가/갱신 요청이 오면 해당 볼트 md를 읽고 아래 규칙으로 사이트 콘텐츠로 변환한다:
- 볼트의 표(깃허브 링크)·개요·내용·배운점을 frontmatter와 ko 본문으로 옮기고, en 본문은 번역해서 작성.
- `![[이미지]]`는 `첨부파일/`에서 `public/images/projects/<slug>/`로 복사(1MB 이상이면 900px 내외로 리사이즈) 후 frontmatter `images[]`에 등록. **볼트에 등장하는 첫 이미지가 대표사진 = images[0] = thumbnail.**

1. `src/content/projects/<slug>.md` 생성 (slug는 kebab-case 영문).
2. frontmatter 필수 필드: title{ko,en}, summary{ko,en}, thumbnail, github, tech[], period, order. 선택: images[], demo, featured.
   - `images[]`는 프로젝트 모달의 사진 캐러셀에 순서대로 표시된다 (첫 장 = 대표사진). 비어 있으면 thumbnail 한 장만 표시.
3. 본문은 `<!-- ko -->` 섹션 다음 `<!-- en -->` 섹션 순서로 작성 (마커 필수, ko가 먼저).
4. 이미지는 `public/images/projects/<slug>/`에 배치. 썸네일 권장 800×600 webp.
5. `featured: true`면 히어로 회전 갤러리에 노출된다. featured는 3~8개 유지.
6. `order`는 그리드 정렬 순서 (낮을수록 앞).

## 자격증 추가
`src/content/data/certifications.yaml`에 항목 추가: id(kebab-case 고유값), issuer{ko,en}, name{ko,en}, date("YYYY.MM.DD").

## 수상(Awards) / 교육(Programs) 추가
`src/content/data/awards.yaml` 또는 `programs.yaml`에 항목 추가: id, name{ko,en}(상 종류), detail{ko,en}(선택 — 작품명·주제, 작은 글씨), org{ko,en}, period("YYYY.MM.DD ~ YYYY.MM.DD"), scan(선택 — 상장/수료증 스캔본 경로).
스캔본은 `public/images/achievements/<id>.webp`(권장 세로형 3:4)에 배치. scan이 있으면 오른쪽 그리드에 표시되고 목록과 hover 연동된다.

## 소개글/연락처 수정
`src/content/data/site.yaml`의 `main` 항목 수정.

## 하지 말 것
- `src/content.config.ts` 스키마를 콘텐츠에 맞춰 완화하지 말 것 (빌드 실패는 콘텐츠 오류 신호).
- placeholder SVG 이미지를 실제 콘텐츠에 재사용하지 말 것.
- 새 의존성 추가 금지.

## 배포 (RPi)
git pull 후 `docker compose up -d --build`. 호스트 포트는 `.env`의 `HOST_PORT`(기본 8001)로 결정되며, 환경변수 `HOST_PORT`로 덮어쓸 수 있다.
