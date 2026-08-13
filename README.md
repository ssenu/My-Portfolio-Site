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
포트 8080에서 서비스된다 (컨테이너 내부 80 → 호스트 8080).

## 콘텐츠 추가
프로젝트/자격증/수상/교육/소개글 추가·수정 규칙은 [CLAUDE.md](./CLAUDE.md) 참조.
