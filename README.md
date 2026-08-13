# My-Portfolio-Site

개인 포트폴리오 정적 웹사이트. Astro 5 기반으로 프로젝트, 자격증, 수상/교육 이력을 ko/en 이중 언어로 제공한다.

## 스택
- [Astro 5](https://astro.build/) — 정적 사이트 생성
- TypeScript + Zod 콘텐츠 스키마 (`src/content.config.ts`)
- YAML/Markdown 콘텐츠 컬렉션 (projects, certifications, awards, programs, site)
- Vitest — 테스트
- Docker + Nginx — 배포

## 로컬 실행
```bash
npm install
npm run dev
```

## 검증 & 빌드
```bash
npm run check   # astro check (타입/스키마 검증)
npm test        # vitest
npm run build   # 정적 빌드 → dist/
npm run preview # 빌드 결과 미리보기
```

## Docker 배포 (RPi)
```bash
git pull
docker compose up -d --build
```
호스트 포트는 `.env`의 `HOST_PORT` 값을 따른다 (기본 8001, 컨테이너 내부는 항상 80). 다른 포트로 열려면 `.env`를 수정하거나 환경변수로 덮어쓴다: `HOST_PORT=9000 docker compose up -d --build`.

## 콘텐츠 추가
프로젝트/자격증/수상/교육/소개글 추가·수정 규칙은 [CLAUDE.md](./CLAUDE.md) 참조.
