# 포트폴리오 사이트 설계서

- **날짜**: 2026-08-13
- **작성 배경**: 박찬우(dev name: ssenu) 개인 포트폴리오 사이트. https://spencergabor.work/ 를 참고하되, 히어로의 원형 갤러리는 자동 회전을 추가하고, 우측 하단 테마 색 스위처를 넣는다. 초안 목업(단일 페이지: Hero → About → Certifications → Achievements → Projects → Contact)을 기준으로 한다.
- **핵심 운영 방식**: 배포 후 콘텐츠(프로젝트·자격증·수상 등) 추가는 사람이 직접 코드를 고치지 않고, Claude Code가 루트의 `CLAUDE.md` 가이드를 읽고 콘텐츠 파일을 추가/수정하는 워크플로를 전제로 한다. 따라서 "콘텐츠 = 파일 하나"가 되도록 구조를 설계한다.

## 1. 기술 스택 & 배포

| 항목 | 결정 | 이유 |
|---|---|---|
| 프레임워크 | Astro 5 + TypeScript | 콘텐츠 컬렉션(md/yaml) 기반이라 콘텐츠 추가가 파일 단위. 정적 빌드 결과물이 가장 가벼움 |
| 인터랙션 | vanilla TS 스크립트 (UI 프레임워크 없음) | 갤러리·모달·테마·hover 연동 정도는 React 불필요. 번들 최소화 |
| 스타일 | 순수 CSS + 디자인 토큰(CSS 변수) | 테마 팔레트 시스템이 CSS 변수와 자연스럽게 맞물림. 외부 의존성 없음 |
| 배포 | Docker multi-stage: `node:22-alpine`에서 `astro build` → `nginx:alpine`이 `dist/` 서빙 | RPi(ARM64) 개인 서버 + 개인 도메인. 메모리 수십 MB 수준 |
| 부속 파일 | `Dockerfile`, `docker-compose.yml`, `nginx.conf`(gzip, 캐시 헤더, 404 라우팅) | RPi에서 `docker compose up -d --build` 한 줄로 배포 |

백엔드 없음. 폼/DB 없음. Contact는 mailto 링크.

## 2. 콘텐츠 구조

```
src/content/
  projects/<slug>.md     # 프로젝트 1개 = md 파일 1개
  awards.yaml            # 수상 내역 목록
  programs.yaml          # 교육/프로그램 이수 목록
  certifications.yaml    # 자격증 목록
  site.yaml              # About 소개글, 히어로 문구, 이메일, GitHub URL 등
public/images/
  projects/<slug>/       # 프로젝트 썸네일·스크린샷
  achievements/          # 상장·수료증 스캔본
  profile/               # 내 사진
```

### 2.1 projects/<slug>.md frontmatter

```yaml
title: { ko: "...", en: "..." }
summary: { ko: "...", en: "..." }
thumbnail: /images/projects/<slug>/thumb.png   # 히어로 링·카드에 사용
images: [ /images/projects/<slug>/shot1.png, ... ]
github: https://github.com/...
demo: https://...        # 선택
tech: [ Astro, TypeScript, Docker ]
period: "2026.01 ~ 2026.03"
featured: true           # true면 히어로 회전 갤러리에 포함
order: 1                 # 카드 정렬 순서 (낮을수록 앞)
```

본문은 `<!-- ko -->` / `<!-- en -->` 구분자로 두 언어를 한 파일에 작성. 빌드 시 언어별로 분리 렌더링.

### 2.2 yaml 데이터 스키마

- `certifications.yaml`: `[{ id, issuer: {ko,en}, name: {ko,en}, date: "2025.06.12" }]`
- `awards.yaml`: `[{ id, name: {ko,en}, org: {ko,en}, period: "2026.08.11 ~ 2026.08.12", scan: /images/achievements/xxx.png }]`
- `programs.yaml`: awards와 동일 구조.
- `id`는 목록 ↔ 스캔본 hover 연동의 연결 키. 스캔본이 없는 항목은 `scan` 생략 가능(그리드에 미표시).

모든 스키마는 Astro content collections의 zod 스키마로 검증 → 필드 누락 시 빌드 실패로 즉시 발견.

### 2.3 한/영 (i18n)

- Astro i18n 라우팅: `/` = 한국어(기본), `/en/` = 영어. 헤더 우측에 KO/EN 토글 링크.
- UI 문자열(섹션 제목 등)은 `src/i18n/ui.ts` 딕셔너리로 관리.
- 콘텐츠는 위처럼 파일 하나에 두 언어를 함께 작성 — Claude Code가 추가 시 파일 하나만 만지면 됨.

### 2.4 CLAUDE.md (콘텐츠 추가 가이드)

루트 `CLAUDE.md`에 다음을 명시한다:
- 프로젝트 추가 절차: md 템플릿 복사 → frontmatter 채우기(ko/en 모두 필수) → 이미지 배치 경로 규칙 → `featured` 지정 기준
- 자격증/수상/프로그램 추가: 해당 yaml에 항목 추가, `id` 규칙(kebab-case 고유값), 스캔본 배치 경로
- 검증: `npm run check && npm run build` 통과 확인 후 커밋
- 이미지 규칙: 권장 크기·포맷(webp 우선), 파일명 규칙

## 3. 페이지 구성

단일 페이지(언어별 1장) + 404.

1. **Hero** — 3D 원형 회전 갤러리, 이름/dev name, 아래로 스크롤 유도
2. **About** — 내 사진 + 슬로건("I Build Things / Learn from them / Refine My Story") + 소개글 + GitHub·Projects 버튼
3. **Certifications** — 자격증 목록 (발급기관 / 이름 / 날짜)
4. **Achievements** — 왼쪽 Awards·Programs 목록 ↔ 오른쪽 스캔본 그리드 (양방향 hover 연동 + 라이트박스)
5. **Projects** — 카드 그리드, 클릭 시 모달
6. **Contact** — 이메일(mailto), GitHub 링크, 푸터

## 4. 히어로 회전 갤러리

- `featured: true` 프로젝트의 썸네일 카드들을 **3D 원형 띠**로 배치: 컨테이너 `transform-style: preserve-3d`, 각 카드 `rotateY(각도) translateZ(반지름)`.
- **자동 회전**: requestAnimationFrame 루프, 기본 각속도로 천천히 회전.
- **드래그/휠 가속**: 포인터 드래그(마우스·터치) 또는 휠 입력 시 해당 방향으로 각속도 가산 → 놓으면 마찰 계수로 감속하며 기본 각속도로 수렴.
- **클릭 → 모달**: 드래그 거리 임계값(예: 5px) 이하의 pointerup만 클릭으로 판정, 해당 프로젝트 모달 열기.
- **접근성/성능**: `prefers-reduced-motion`이면 자동 회전 정지(드래그는 가능). 탭이 백그라운드면 rAF 중단. 키보드 사용자를 위해 카드에 포커스 + Enter로 모달 열기 지원.
- featured가 0개면 갤러리 대신 정적 타이틀만 표시(빈 상태 처리).

## 5. 테마 스위처

- 우측 하단 고정(fixed) 버튼 — 색 점 5개 노출(또는 접힌 상태에서 펼침).
- **프리셋 팔레트 5종**: 밝은 톤 3(예: 라이트 뉴트럴 / 크림 / 페일 블루) + 어두운 톤 2(다크 / 딥 그린 등). 각 팔레트는 `--bg`, `--text`, `--accent`, `--card`, `--muted` 등 CSS 변수 세트로 정의.
- 적용: `<html data-theme="이름">` 전환. 선택은 `localStorage`에 저장.
- **FOUC 방지**: `<head>` 인라인 스크립트가 렌더 전에 localStorage를 읽어 data-theme 적용.
- 모든 팔레트에서 본문 텍스트 대비 WCAG AA 이상 확보.

## 6. Achievements 양방향 hover 연동

- 데이터의 `id`를 목록 항목(`data-id`)과 스캔본 카드(`data-id`)에 공통 부여.
- **스캔본 hover → 같은 id의 목록 항목 하이라이트**(배경·글자색 변화), **목록 hover → 같은 id의 스캔본 하이라이트**(살짝 확대 + 액센트 테두리, 나머지는 살짝 흐림).
- 구현: 섹션 단위 이벤트 위임(mouseenter/leave) + CSS 클래스 토글. 터치 기기에서는 hover 연동 없이 탭 = 라이트박스.
- **라이트박스**: 스캔본 클릭 시 확대 뷰(배경 딤, ESC/배경 클릭/닫기 버튼으로 닫음, 좌우 이동 화살표).

## 7. 프로젝트 모달

- 카드(또는 히어로 갤러리 카드) 클릭 시 스크롤 가능한 모달: 제목·기간·기술스택 태그·이미지들·본문(md 렌더링 결과)·GitHub 버튼·데모 버튼(있을 때).
- 모달 내용은 빌드 시 페이지에 `<template>` 또는 hidden 섹션으로 포함(언어별 해당 언어 본문) — 런타임 fetch 없음.
- 열릴 때 `history.pushState`로 URL에 `#project-<slug>` 반영 → **뒤로가기로 닫힘**, 해시 포함 URL 직접 진입 시 자동으로 해당 모달 열림(공유 가능).
- 열림 동안 body 스크롤 잠금, ESC/배경 클릭으로 닫기, 포커스 트랩.

## 8. 애니메이션 & 마이크로 인터랙션

- **스크롤 리빌**: IntersectionObserver로 섹션·카드가 뷰포트 진입 시 fade + translateY 등장, 그리드는 순차(stagger) 등장. 1회만 실행.
- **호버**: 버튼 들림(translateY + 그림자), 카드 이미지 줌, 링크 밑줄 슬라이드, 테마 점 확대 등.
- 트랜지션은 transform/opacity만 사용(리플로우 없는 속성). `prefers-reduced-motion` 시 리빌·회전·트랜지션 축소/비활성.

## 9. 검증 & 품질 게이트

- `npm run check`(astro check, 타입·스키마) + `npm run build` 통과가 기본 게이트. 콘텐츠 스키마 위반은 빌드 실패로 드러남.
- 인터랙션(갤러리 가속·모달·테마 저장·hover 연동)은 로컬 `docker compose up`으로 수동 확인.
- SEO/기본기: 언어별 title·description·OG 태그, sitemap, favicon, robots.txt, 404 페이지, 이미지 lazy loading, 반응형(모바일 1열 레이아웃).

## 10. 범위 제외 (YAGNI)

- CMS/관리자 페이지, 댓글, 방문자 통계 백엔드, 문의 폼(서버 필요), 블로그 — 이번 범위에서 제외. 콘텐츠 관리 방식은 §2의 파일 + Claude Code 워크플로로 충분.
