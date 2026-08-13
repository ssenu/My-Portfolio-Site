# 포트폴리오 사이트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** spencergabor.work를 참고한 단일 페이지 포트폴리오(히어로 3D 회전 갤러리, 테마 팔레트 스위처, 한/영, 프로젝트 모달, Achievements hover 연동)를 Astro 정적 사이트로 만들어 RPi Docker(nginx)에 배포한다.

**Architecture:** Astro 5 콘텐츠 컬렉션(md/yaml)이 유일한 데이터 소스. 인터랙션은 vanilla TS 모듈(순수 로직은 vitest로 검증). 스타일은 CSS 변수 기반 디자인 토큰으로 5개 테마 팔레트를 `data-theme` 속성 전환으로 구현. 빌드 결과물은 nginx:alpine 컨테이너가 서빙.

**Tech Stack:** Astro 5, TypeScript, vanilla TS, 순수 CSS(변수), marked, js-yaml, vitest, @astrojs/check, @astrojs/sitemap, Docker(node:22-alpine → nginx:alpine)

**설계서:** `docs/superpowers/specs/2026-08-13-portfolio-site-design.md`

## Global Constraints

- Node 22+, Astro 5.x. UI 프레임워크(React 등) 금지 — 인터랙션은 vanilla TS만.
- CSS 프레임워크 금지 — 순수 CSS + CSS 변수(`--bg`, `--text`, `--muted`, `--card`, `--accent`, `--border`).
- 의존성은 다음만 허용: `astro`, `@astrojs/check`, `@astrojs/sitemap`, `typescript`, `marked`, `js-yaml`(+`@types/js-yaml`), `vitest`.
- 모든 콘텐츠 텍스트는 ko/en 두 언어 필수. 라우팅: `/` = 한국어, `/en/` = 영어.
- 사이트 도메인은 `astro.config.mjs`의 `site: 'https://ssenu.dev'` 하나로만 관리 (실제 도메인 확정 시 이 값만 교체).
- 모든 애니메이션은 transform/opacity만 사용, `prefers-reduced-motion: reduce` 대응 필수.
- 각 task 종료 시 `npm run check && npm run build`(+ vitest 있는 task는 `npm test`) 통과 후 커밋.
- 커밋 메시지: `feat:`/`chore:`/`docs:` prefix, 한국어 본문 허용.
- 테마 5종 이름: `light`(기본), `cream`, `sky`, `dark`, `forest`.

---

### Task 1: Astro 프로젝트 스캐폴딩

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `vitest.config.ts`, `src/pages/index.astro`(임시), `public/robots.txt`

**Interfaces:**
- Produces: npm scripts `dev`/`build`/`preview`/`check`/`test`, i18n 라우팅 설정(ko 기본, en prefix), `site` URL.

- [ ] **Step 1: 의존성 설치**

```bash
npm init -y
npm install astro @astrojs/check @astrojs/sitemap typescript marked js-yaml
npm install -D vitest @types/js-yaml
```

- [ ] **Step 2: 설정 파일 작성**

`package.json`의 scripts를 다음으로 교체:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  }
}
```

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ssenu.dev',
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/**/*.test.ts'] } });
```

`.gitignore`:

```
node_modules/
dist/
.astro/
```

`public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://ssenu.dev/sitemap-index.xml
```

임시 `src/pages/index.astro` (Task 4에서 교체):

```astro
<html lang="ko"><body><h1>Portfolio ParkChanWoo</h1></body></html>
```

- [ ] **Step 3: 빌드 검증**

Run: `npm run check && npm run build`
Expected: 에러 0, `dist/index.html` 생성.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: Astro 프로젝트 스캐폴딩 (i18n, sitemap, vitest)"
```

---

### Task 2: 콘텐츠 컬렉션 스키마 + 샘플 콘텐츠

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/sample-project.md`, `src/content/projects/second-project.md`, `src/content/data/site.yaml`, `src/content/data/certifications.yaml`, `src/content/data/awards.yaml`, `src/content/data/programs.yaml`
- Create: placeholder 이미지 `public/images/projects/sample-project/thumb.svg`, `public/images/projects/second-project/thumb.svg`, `public/images/achievements/award-hackathon-2026.svg`, `public/images/profile/me.svg`

**Interfaces:**
- Produces: 컬렉션 `projects`, `certifications`, `awards`, `programs`, `site`. localized 스키마 `{ ko: string, en: string }`. `site` 컬렉션은 id `main` 단일 엔트리 — `getEntry('site', 'main')`으로 조회.

- [ ] **Step 1: 스키마 작성**

`src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import yaml from 'js-yaml';

const yamlParser = (text: string) => yaml.load(text) as Record<string, unknown>;
const localized = z.object({ ko: z.string(), en: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: localized,
    summary: localized,
    thumbnail: z.string(),
    images: z.array(z.string()).default([]),
    github: z.string().url(),
    demo: z.string().url().optional(),
    tech: z.array(z.string()),
    period: z.string(),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

const achievement = z.object({
  id: z.string(),
  name: localized,
  org: localized,
  period: z.string(),
  scan: z.string().optional(),
});

const certifications = defineCollection({
  loader: file('src/content/data/certifications.yaml', { parser: yamlParser }),
  schema: z.object({ id: z.string(), issuer: localized, name: localized, date: z.string() }),
});
const awards = defineCollection({
  loader: file('src/content/data/awards.yaml', { parser: yamlParser }),
  schema: achievement,
});
const programs = defineCollection({
  loader: file('src/content/data/programs.yaml', { parser: yamlParser }),
  schema: achievement,
});
const site = defineCollection({
  loader: file('src/content/data/site.yaml', { parser: yamlParser }),
  schema: z.object({
    name: localized,
    devName: z.string(),
    email: z.string().email(),
    github: z.string().url(),
    slogan: z.array(z.string()),
    about: localized,
    profileImage: z.string(),
  }),
});

export const collections = { projects, certifications, awards, programs, site };
```

- [ ] **Step 2: 샘플 콘텐츠 작성**

`src/content/data/site.yaml` (file 로더의 record 형식 — 최상위 키가 id):

```yaml
main:
  name: { ko: "박찬우", en: "Park Chanwoo" }
  devName: "ssenu"
  email: "cwhappy123@gmail.com"
  github: "https://github.com/cwhappy"
  slogan: ["I Build Things", "Learn from them", "Refine My Story"]
  about:
    ko: "어떤 목표로 개발하고 있는지, 무엇을 배웠는지, 앞으로 무엇을 배우고 싶은지를 담은 소개글입니다."
    en: "An introduction covering my goals as a developer, what I've learned, and what I want to learn next."
  profileImage: "/images/profile/me.svg"
```

`src/content/data/certifications.yaml`:

```yaml
- id: engineer-info-processing
  issuer: { ko: "한국인터넷진흥협회", en: "Korea Internet Promotion Association" }
  name: { ko: "정보처리산업기사", en: "Industrial Engineer Information Processing" }
  date: "2025.06.12"
```

`src/content/data/awards.yaml`:

```yaml
- id: award-hackathon-2026
  name: { ko: "2026 해커톤 경진대회 대상 수상", en: "2026 Hackathon Grand Prize" }
  org: { ko: "주최 기관", en: "Host Organization" }
  period: "2026.08.11 ~ 2026.08.12"
  scan: "/images/achievements/award-hackathon-2026.svg"
```

`src/content/data/programs.yaml`:

```yaml
- id: program-ai-agent-2026
  name: { ko: "2026 AI 에이전트 교육 이수", en: "2026 AI Agent Program Completion" }
  org: { ko: "교육 기관", en: "Education Institution" }
  period: "2026.08.11 ~ 2026.08.12"
```

`src/content/projects/sample-project.md`:

```markdown
---
title: { ko: "샘플 프로젝트", en: "Sample Project" }
summary: { ko: "포트폴리오 파이프라인 검증용 샘플입니다.", en: "A sample to validate the portfolio pipeline." }
thumbnail: /images/projects/sample-project/thumb.svg
images: []
github: https://github.com/cwhappy/sample-project
tech: [Astro, TypeScript]
period: "2026.01 ~ 2026.02"
featured: true
order: 1
---

<!-- ko -->
## 개요

샘플 프로젝트 본문입니다. **마크다운**이 렌더링됩니다.

<!-- en -->
## Overview

Sample project body. **Markdown** is rendered.
```

`second-project.md`는 위와 동일 구조로 `title.ko: "두 번째 프로젝트"`, `slug` 경로·`order: 2`·`featured: true`만 다르게 작성.

placeholder 이미지 4개는 동일한 단색 SVG로 생성 (예: `public/images/profile/me.svg`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#9ca3af"/></svg>
```

- [ ] **Step 3: 스키마 위반 시 빌드가 실패하는지 검증**

`sample-project.md`에서 `github:` 줄을 잠시 지우고 `npm run build` → **실패해야 함**. 복구 후 `npm run check && npm run build` → 통과.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: 콘텐츠 컬렉션 스키마 및 샘플 콘텐츠"
```

---

### Task 3: i18n 딕셔너리 + 이중 언어 본문 유틸 (TDD)

**Files:**
- Create: `src/i18n/ui.ts`, `src/lib/bilingual.ts`
- Test: `tests/bilingual.test.ts`

**Interfaces:**
- Produces: `type Lang = 'ko' | 'en'`, `t(lang, key)`, `splitBilingual(body: string): { ko: string; en: string }` (마커 누락 시 throw), `localePath(lang: Lang): string` (`ko → '/'`, `en → '/en/'`).

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/bilingual.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { splitBilingual } from '../src/lib/bilingual';

describe('splitBilingual', () => {
  it('ko/en 마커로 본문을 분리한다', () => {
    const body = `<!-- ko -->\n## 개요\n한국어 본문\n<!-- en -->\n## Overview\nEnglish body`;
    const r = splitBilingual(body);
    expect(r.ko).toBe('## 개요\n한국어 본문');
    expect(r.en).toBe('## Overview\nEnglish body');
  });
  it('마커 대소문자/공백을 허용한다', () => {
    const r = splitBilingual(`<!--KO-->A<!-- En -->B`);
    expect(r.ko).toBe('A');
    expect(r.en).toBe('B');
  });
  it('마커가 없으면 throw', () => {
    expect(() => splitBilingual('no markers')).toThrow(/marker/i);
  });
});
```

- [ ] **Step 2: 실패 확인** — Run: `npm test` → FAIL (모듈 없음).

- [ ] **Step 3: 구현**

`src/lib/bilingual.ts`:

```ts
export function splitBilingual(body: string): { ko: string; en: string } {
  const m = body.match(/<!--\s*ko\s*-->([\s\S]*?)<!--\s*en\s*-->([\s\S]*)/i);
  if (!m) throw new Error('body must contain <!-- ko --> and <!-- en --> markers');
  return { ko: m[1].trim(), en: m[2].trim() };
}
```

`src/i18n/ui.ts`:

```ts
export const langs = ['ko', 'en'] as const;
export type Lang = (typeof langs)[number];

export const ui = {
  ko: {
    'nav.about': 'About', 'nav.projects': 'Projects', 'nav.contact': 'Contact',
    'hero.scroll': '아래로 스크롤',
    'about.github': '깃허브', 'about.projects': '프로젝트',
    'section.about': 'About', 'section.certifications': 'Certifications',
    'section.achievements': 'Achievements', 'section.awards': 'Awards',
    'section.programs': 'Programs', 'section.projects': 'Projects', 'section.contact': 'Contact',
    'modal.github': 'GitHub 보기', 'modal.demo': '데모 보기', 'modal.close': '닫기',
    'theme.label': '테마 색 변경', 'lightbox.close': '닫기',
    'notfound.title': '페이지를 찾을 수 없습니다', 'notfound.home': '홈으로',
  },
  en: {
    'nav.about': 'About', 'nav.projects': 'Projects', 'nav.contact': 'Contact',
    'hero.scroll': 'Scroll down',
    'about.github': 'GitHub', 'about.projects': 'Projects',
    'section.about': 'About', 'section.certifications': 'Certifications',
    'section.achievements': 'Achievements', 'section.awards': 'Awards',
    'section.programs': 'Programs', 'section.projects': 'Projects', 'section.contact': 'Contact',
    'modal.github': 'View on GitHub', 'modal.demo': 'Live Demo', 'modal.close': 'Close',
    'theme.label': 'Change theme color', 'lightbox.close': 'Close',
    'notfound.title': 'Page not found', 'notfound.home': 'Go home',
  },
} as const;

export type UiKey = keyof (typeof ui)['ko'];
export const t = (lang: Lang, key: UiKey): string => ui[lang][key];
export const localePath = (lang: Lang): string => (lang === 'ko' ? '/' : '/en/');
```

- [ ] **Step 4: 통과 확인** — Run: `npm test` → PASS. `npm run check` → 통과.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: i18n 딕셔너리와 이중 언어 본문 분리 유틸"
```

---

### Task 4: 디자인 토큰·테마 팔레트 CSS + Layout + 페이지 골격 + 404

**Files:**
- Create: `src/styles/global.css`, `src/layouts/Layout.astro`, `src/components/Header.astro`, `src/components/Home.astro`, `src/components/Contact.astro`, `src/pages/404.astro`
- Modify: `src/pages/index.astro` (임시 → 실제), Create: `src/pages/en/index.astro`

**Interfaces:**
- Consumes: `t`, `Lang`, `localePath` (Task 3), `site` 컬렉션 (Task 2).
- Produces: `Layout.astro` props `{ lang: Lang, title: string, description: string }` — head(FOUC 방지 스크립트, OG 태그), Header, `<slot />`, 푸터 렌더. `Home.astro` props `{ lang: Lang }` — 섹션 순서대로 조립(이후 task들이 섹션 컴포넌트를 여기에 추가). 섹션 공통 클래스 `.section`(max-width 960px, 중앙 정렬)과 `data-reveal` 속성 규약.

- [ ] **Step 1: 토큰·팔레트·베이스 스타일 작성**

`src/styles/global.css`:

```css
/* ── 디자인 토큰: 팔레트 5종 ───────────────────── */
:root {
  --bg: #fafafa; --text: #141414; --muted: #6b6b6b;
  --card: #ffffff; --accent: #2563eb; --border: #e5e5e5;
  --shadow: 0 4px 16px rgb(0 0 0 / 0.08);
}
[data-theme='cream'] {
  --bg: #f7f2e7; --text: #2b2416; --muted: #7a6f58;
  --card: #fffaf0; --accent: #c2410c; --border: #e8dfc9;
  --shadow: 0 4px 16px rgb(80 60 20 / 0.1);
}
[data-theme='sky'] {
  --bg: #eef4fa; --text: #0f2436; --muted: #5b7186;
  --card: #ffffff; --accent: #0369a1; --border: #d8e4ef;
  --shadow: 0 4px 16px rgb(20 60 100 / 0.1);
}
[data-theme='dark'] {
  --bg: #111214; --text: #ececec; --muted: #9a9a9a;
  --card: #1b1d21; --accent: #60a5fa; --border: #2a2d33;
  --shadow: 0 4px 16px rgb(0 0 0 / 0.5);
}
[data-theme='forest'] {
  --bg: #0f1a14; --text: #e6efe8; --muted: #8faa97;
  --card: #16241c; --accent: #4ade80; --border: #23392c;
  --shadow: 0 4px 16px rgb(0 0 0 / 0.5);
}

/* ── 리셋·베이스 ───────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg); color: var(--text);
  font-family: 'Pretendard Variable', Pretendard, -apple-system, 'Segoe UI', 'Malgun Gothic', sans-serif;
  line-height: 1.6; transition: background-color 0.4s, color 0.4s;
}
img { max-width: 100%; display: block; }
a { color: inherit; }
button { font: inherit; cursor: pointer; }

/* ── 공통 레이아웃·섹션 ───────────────────── */
.section { max-width: 960px; margin: 0 auto; padding: 96px 24px; }
.section-title { font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: 48px; }

/* ── 스크롤 리빌 (Task 12에서 스크립트 연결) ───────────────────── */
[data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
[data-reveal].revealed { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 2: Layout·Header·Contact 작성**

`src/layouts/Layout.astro`:

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import { getEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

interface Props { lang: Lang; title: string; description: string }
const { lang, title, description } = Astro.props;
const site = (await getEntry('site', 'main'))!.data;
---
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <script is:inline>
      const saved = localStorage.getItem('theme');
      if (saved) document.documentElement.dataset.theme = saved;
    </script>
  </head>
  <body>
    <Header lang={lang} />
    <main><slot /></main>
    <footer class="footer">
      <p>© 2026 {site.name[lang]} · {site.devName}</p>
    </footer>
  </body>
</html>
<style>
  .footer { text-align: center; padding: 32px; color: var(--muted); font-size: 0.85rem; }
</style>
```

`src/components/Header.astro` (상단 고정, KO/EN 토글은 상대 페이지로 링크):

```astro
---
import type { Lang } from '../i18n/ui';
import { t, localePath } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const other: Lang = lang === 'ko' ? 'en' : 'ko';
---
<header class="header">
  <a class="logo" href={localePath(lang)}>ssenu</a>
  <nav>
    <a href="#about">{t(lang, 'nav.about')}</a>
    <a href="#projects">{t(lang, 'nav.projects')}</a>
    <a href="#contact">{t(lang, 'nav.contact')}</a>
    <a class="lang-toggle" href={localePath(other)}>{other.toUpperCase()}</a>
  </nav>
</header>
<style>
  .header { position: sticky; top: 0; z-index: 50; display: flex; justify-content: space-between;
    align-items: center; padding: 16px 24px; background: color-mix(in srgb, var(--bg) 85%, transparent);
    backdrop-filter: blur(8px); }
  .logo { font-weight: 700; text-decoration: none; }
  nav { display: flex; gap: 20px; }
  nav a { text-decoration: none; color: var(--muted); }
  nav a:hover { color: var(--accent); }
  .lang-toggle { border: 1px solid var(--border); border-radius: 999px; padding: 2px 12px; }
</style>
```

`src/components/Contact.astro`:

```astro
---
import { getEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const site = (await getEntry('site', 'main'))!.data;
---
<section id="contact" class="section" data-reveal>
  <h2 class="section-title">{t(lang, 'section.contact')}</h2>
  <p class="email"><a href={`mailto:${site.email}`}>{site.email}</a></p>
  <p class="gh"><a href={site.github} target="_blank" rel="noopener">GitHub</a></p>
</section>
<style>
  .email, .gh { text-align: center; margin-bottom: 8px; }
  .email a { font-size: 1.1rem; }
</style>
```

`src/components/Home.astro` (섹션 조립 지점 — 이후 task가 import를 추가):

```astro
---
import Layout from '../layouts/Layout.astro';
import Contact from './Contact.astro';
import { getEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const site = (await getEntry('site', 'main'))!.data;
const title = `Portfolio ${site.name[lang]}`;
---
<Layout lang={lang} title={title} description={site.about[lang].slice(0, 150)}>
  <!-- Task 5: <Hero lang={lang} /> -->
  <!-- Task 8: <About lang={lang} /> / <Certifications lang={lang} /> -->
  <!-- Task 9: <Achievements lang={lang} /> -->
  <!-- Task 11: <Projects lang={lang} /> / <ProjectModal lang={lang} /> -->
  <Contact lang={lang} />
  <!-- Task 7: <ThemeSwitcher lang={lang} /> -->
</Layout>
```

`src/pages/index.astro`:

```astro
---
import Home from '../components/Home.astro';
---
<Home lang="ko" />
```

`src/pages/en/index.astro`:

```astro
---
import Home from '../../components/Home.astro';
---
<Home lang="en" />
```

`src/pages/404.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import { t } from '../i18n/ui';
---
<Layout lang="ko" title="404" description="Page not found">
  <section class="section" style="text-align:center">
    <h1>404</h1>
    <p>{t('ko', 'notfound.title')}</p>
    <p><a href="/">{t('ko', 'notfound.home')}</a></p>
  </section>
</Layout>
```

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🌀</text></svg>
```

- [ ] **Step 3: 검증** — Run: `npm run check && npm run build` → 통과, `dist/en/index.html`·`dist/404.html` 존재 확인.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: 디자인 토큰·팔레트, Layout, ko/en 페이지 골격, 404"
```

---

### Task 5: Hero 3D 원형 갤러리 — 마크업·CSS

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/components/Home.astro` (Hero import 추가)

**Interfaces:**
- Consumes: `projects` 컬렉션 `featured: true` 항목 (Task 2).
- Produces: DOM 구조 — `.hero-ring[data-ring]` > `.ring-stage` > `.ring-card[data-slug="<slug>"]` (버튼, 내부 `<img>`). CSS 변수 `--ring-angle`(deg)을 `.ring-stage`가 소비: `transform: rotateY(var(--ring-angle))`. 카드 배치는 Task 6 스크립트가 수행. `prefers-reduced-motion` 대응은 Task 6에서.

- [ ] **Step 1: 컴포넌트 작성**

`src/components/Hero.astro`:

```astro
---
import { getCollection, getEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const site = (await getEntry('site', 'main'))!.data;
const featured = (await getCollection('projects', (p) => p.data.featured))
  .sort((a, b) => a.data.order - b.data.order);
---
<section class="hero">
  {featured.length > 0 && (
    <div class="hero-ring" data-ring>
      <div class="ring-stage">
        {featured.map((p) => (
          <button class="ring-card" data-slug={p.id} aria-label={p.data.title[lang]}>
            <img src={p.data.thumbnail} alt={p.data.title[lang]} draggable="false" loading="eager" />
          </button>
        ))}
      </div>
    </div>
  )}
  <h1>Portfolio {site.name[lang]}</h1>
  <p class="dev-name">Dev name_ {site.devName}</p>
  <a class="scroll-hint" href="#about">{t(lang, 'hero.scroll')} ↓</a>
</section>
<style>
  .hero { min-height: 100svh; display: flex; flex-direction: column; align-items: center;
    justify-content: center; text-align: center; overflow: hidden; padding: 24px; }
  .hero-ring { perspective: 1200px; width: 100%; height: 340px; touch-action: pan-y;
    cursor: grab; user-select: none; }
  .hero-ring.dragging { cursor: grabbing; }
  .ring-stage { position: relative; width: 100%; height: 100%;
    transform-style: preserve-3d; transform: rotateY(var(--ring-angle, 0deg)); }
  .ring-card { position: absolute; left: 50%; top: 50%; width: 180px; height: 240px;
    margin: -120px 0 0 -90px; border: none; padding: 0; border-radius: 12px; overflow: hidden;
    background: var(--card); box-shadow: var(--shadow); backface-visibility: hidden; }
  .ring-card img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
  h1 { font-size: clamp(2rem, 5vw, 3rem); margin-top: 24px; }
  .dev-name { color: var(--muted); }
  .scroll-hint { margin-top: 40px; color: var(--muted); text-decoration: none; font-size: 0.9rem; }
  @media (max-width: 640px) { .ring-card { width: 130px; height: 180px; margin: -90px 0 0 -65px; } }
</style>
```

`Home.astro`에 추가: `import Hero from './Hero.astro';`, 주석 자리에 `<Hero lang={lang} />`.

- [ ] **Step 2: 검증** — Run: `npm run check && npm run build` → 통과. `npm run dev`로 카드가 중앙에 겹쳐 보이는지(배치 전 상태) 확인.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: Hero 3D 링 갤러리 마크업·CSS"
```

---

### Task 6: 갤러리 회전 물리 (TDD) + 컨트롤러

**Files:**
- Create: `src/lib/ringPhysics.ts`, `src/scripts/heroRing.ts`
- Modify: `src/components/Hero.astro` (스크립트 연결)
- Test: `tests/ringPhysics.test.ts`

**Interfaces:**
- Consumes: Task 5의 DOM 구조·`--ring-angle` 규약.
- Produces: `RingState { angle: number; velocity: number }`, `BASE_VELOCITY = 8`(deg/s), `FRICTION = 1.6`(1/s), `stepRing(state, dt, base?, friction?): RingState`, `addImpulse(state, deltaVelocity): RingState`. 카드 클릭 시 `window.dispatchEvent(new CustomEvent('open-project', { detail: { slug } }))` 발행 (Task 11이 구독).

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/ringPhysics.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { stepRing, addImpulse, BASE_VELOCITY } from '../src/lib/ringPhysics';

describe('ringPhysics', () => {
  it('기본 속도로 각도가 전진한다', () => {
    const s = stepRing({ angle: 0, velocity: BASE_VELOCITY }, 1);
    expect(s.angle).toBeCloseTo(BASE_VELOCITY, 0);
  });
  it('가속 후 기본 속도로 수렴한다', () => {
    let s = addImpulse({ angle: 0, velocity: BASE_VELOCITY }, 300);
    for (let i = 0; i < 600; i++) s = stepRing(s, 1 / 60);
    expect(Math.abs(s.velocity - BASE_VELOCITY)).toBeLessThan(0.5);
  });
  it('음의 충격도 기본 속도로 수렴한다', () => {
    let s = addImpulse({ angle: 0, velocity: BASE_VELOCITY }, -300);
    for (let i = 0; i < 600; i++) s = stepRing(s, 1 / 60);
    expect(Math.abs(s.velocity - BASE_VELOCITY)).toBeLessThan(0.5);
  });
  it('base=0이면 정지 상태를 유지한다 (reduced-motion)', () => {
    let s = { angle: 10, velocity: 0 };
    s = stepRing(s, 1, 0);
    expect(s.angle).toBeCloseTo(10, 1);
  });
});
```

- [ ] **Step 2: 실패 확인** — Run: `npm test` → FAIL.

- [ ] **Step 3: 물리 모듈 구현**

`src/lib/ringPhysics.ts`:

```ts
export interface RingState { angle: number; velocity: number }
export const BASE_VELOCITY = 8;  // deg/s — "천천히" 자동 회전
export const FRICTION = 1.6;     // 1/s — 기본 속도로의 수렴 계수

export function stepRing(
  state: RingState, dt: number,
  base: number = BASE_VELOCITY, friction: number = FRICTION,
): RingState {
  const velocity = base + (state.velocity - base) * Math.exp(-friction * dt);
  return { angle: state.angle + velocity * dt, velocity };
}

export function addImpulse(state: RingState, deltaVelocity: number): RingState {
  return { ...state, velocity: state.velocity + deltaVelocity };
}
```

- [ ] **Step 4: 통과 확인** — Run: `npm test` → PASS.

- [ ] **Step 5: DOM 컨트롤러 구현**

`src/scripts/heroRing.ts`:

```ts
import { stepRing, addImpulse, BASE_VELOCITY, type RingState } from '../lib/ringPhysics';

const DEG_PER_PX = 0.35;      // 드래그 감도
const CLICK_THRESHOLD_PX = 5; // 이하 이동이면 클릭으로 판정
const WHEEL_IMPULSE = 0.25;   // 휠 deltaY → 각속도

export function initHeroRing(root: HTMLElement): void {
  const stage = root.querySelector<HTMLElement>('.ring-stage');
  const cards = [...root.querySelectorAll<HTMLElement>('.ring-card')];
  if (!stage || cards.length === 0) return;

  // 카드 원형 배치: 반지름 = 카드폭/2 / tan(π/n) + 40
  const n = cards.length;
  const cardW = cards[0].offsetWidth;
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / Math.max(n, 3)) + 40);
  cards.forEach((c, i) => {
    c.style.transform = `translate(-50%, -50%) rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`;
    c.style.margin = '0';
    c.style.left = '50%'; c.style.top = '50%';
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let base = reduced.matches ? 0 : BASE_VELOCITY;
  reduced.addEventListener('change', () => { base = reduced.matches ? 0 : BASE_VELOCITY; });

  let state: RingState = { angle: 0, velocity: base };
  let dragging = false;
  let lastX = 0, totalMove = 0, lastDx = 0, lastT = 0;

  root.addEventListener('pointerdown', (e) => {
    dragging = true; root.classList.add('dragging');
    lastX = e.clientX; totalMove = 0; lastDx = 0;
    root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX; totalMove += Math.abs(dx); lastDx = dx;
    state = { ...state, angle: state.angle + dx * DEG_PER_PX };
  });
  root.addEventListener('pointerup', (e) => {
    dragging = false; root.classList.remove('dragging');
    if (totalMove <= CLICK_THRESHOLD_PX) {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.ring-card');
      if (card?.dataset.slug)
        window.dispatchEvent(new CustomEvent('open-project', { detail: { slug: card.dataset.slug } }));
    } else {
      state = { ...state, velocity: lastDx * DEG_PER_PX * 60 }; // 놓는 순간 속도 이어받기
    }
  });
  root.addEventListener('wheel', (e) => {
    state = addImpulse(state, e.deltaY * WHEEL_IMPULSE);
  }, { passive: true });

  // 키보드: 카드 포커스 + Enter → 모달
  cards.forEach((c) => c.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && c.dataset.slug)
      window.dispatchEvent(new CustomEvent('open-project', { detail: { slug: c.dataset.slug } }));
  }));

  const loop = (now: number) => {
    const dt = Math.min((now - lastT) / 1000, 0.05); lastT = now;
    if (!dragging && !document.hidden) state = stepRing(state, dt, base);
    stage.style.setProperty('--ring-angle', `${state.angle}deg`);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame((t) => { lastT = t; requestAnimationFrame(loop); });
}
```

`Hero.astro` 하단에 추가:

```astro
<script>
  import { initHeroRing } from '../scripts/heroRing';
  const root = document.querySelector<HTMLElement>('[data-ring]');
  if (root) initHeroRing(root);
</script>
```

- [ ] **Step 6: 검증** — `npm run check && npm test && npm run build` → 통과. `npm run dev`: 자동 회전, 드래그 가속·감속 복귀, 휠 가속, 짧은 클릭 시 콘솔에서 `open-project` 이벤트 발생 확인(`window.addEventListener('open-project', console.log)`).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: 갤러리 회전 물리(vitest) 및 드래그·휠·클릭 컨트롤러"
```

---

### Task 7: 테마 스위처

**Files:**
- Create: `src/components/ThemeSwitcher.astro`
- Modify: `src/components/Home.astro` (import 추가)

**Interfaces:**
- Consumes: Task 4의 팔레트(`[data-theme]`), FOUC 방지 스크립트(`localStorage['theme']`).
- Produces: 우측 하단 고정 위젯. 테마 이름은 Global Constraints의 5종.

- [ ] **Step 1: 컴포넌트 작성**

`src/components/ThemeSwitcher.astro`:

```astro
---
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const themes = [
  { name: 'light', color: '#fafafa' },
  { name: 'cream', color: '#f7f2e7' },
  { name: 'sky', color: '#eef4fa' },
  { name: 'dark', color: '#111214' },
  { name: 'forest', color: '#0f1a14' },
];
---
<div class="theme-switcher" role="group" aria-label={t(lang, 'theme.label')}>
  {themes.map((th) => (
    <button class="dot" data-theme-choice={th.name} style={`--dot: ${th.color}`}
      aria-label={`${t(lang, 'theme.label')}: ${th.name}`} />
  ))}
</div>
<style>
  .theme-switcher { position: fixed; right: 20px; bottom: 20px; z-index: 60;
    display: flex; gap: 8px; padding: 8px 10px; border-radius: 999px;
    background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow); }
  .dot { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--border);
    background: var(--dot); transition: transform 0.15s; }
  .dot:hover { transform: scale(1.2); }
  .dot.active { border-color: var(--accent); }
</style>
<script>
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]');
  const mark = () => {
    const cur = document.documentElement.dataset.theme ?? 'light';
    buttons.forEach((b) => b.classList.toggle('active', b.dataset.themeChoice === cur));
  };
  buttons.forEach((b) => b.addEventListener('click', () => {
    const name = b.dataset.themeChoice!;
    if (name === 'light') {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem('theme');
    } else {
      document.documentElement.dataset.theme = name;
      localStorage.setItem('theme', name);
    }
    mark();
  }));
  mark();
</script>
```

`Home.astro`에 `<ThemeSwitcher lang={lang} />` 추가 (Contact 아래 주석 자리).

- [ ] **Step 2: 검증** — `npm run check && npm run build` → 통과. dev 서버에서: 각 점 클릭 시 전체 색 전환, 새로고침 후 유지, light 복귀 시 localStorage 키 제거 확인.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: 우측 하단 테마 팔레트 스위처 (localStorage 유지)"
```

---

### Task 8: About + Certifications 섹션

**Files:**
- Create: `src/components/About.astro`, `src/components/Certifications.astro`
- Modify: `src/components/Home.astro` (import 추가)

**Interfaces:**
- Consumes: `site`·`certifications` 컬렉션, `t`/`Lang`.
- Produces: `id="about"` 섹션(헤더 네비 target).

- [ ] **Step 1: About 작성**

`src/components/About.astro`:

```astro
---
import { getEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const site = (await getEntry('site', 'main'))!.data;
---
<section id="about" class="section" data-reveal>
  <h2 class="section-title">{t(lang, 'section.about')}</h2>
  <div class="about-grid">
    <img class="photo" src={site.profileImage} alt={site.name[lang]} loading="lazy" />
    <div class="intro">
      <p class="slogan">{site.slogan.map((line) => <span>{line}</span>)}</p>
      <p class="bio">{site.about[lang]}</p>
      <div class="actions">
        <a class="btn" href={site.github} target="_blank" rel="noopener">{t(lang, 'about.github')}</a>
        <a class="btn" href="#projects">{t(lang, 'about.projects')}</a>
      </div>
    </div>
  </div>
</section>
<style>
  .about-grid { display: grid; grid-template-columns: 300px 1fr; gap: 48px; align-items: center; }
  .photo { width: 100%; border-radius: 12px; box-shadow: var(--shadow); }
  .slogan { display: flex; flex-direction: column; font-size: 1.6rem; font-weight: 700; margin-bottom: 20px; }
  .bio { color: var(--muted); white-space: pre-line; margin-bottom: 28px; }
  .actions { display: flex; gap: 12px; }
  .btn { display: inline-block; padding: 10px 24px; border-radius: 8px; text-decoration: none;
    background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow);
    transition: transform 0.15s, border-color 0.15s; }
  .btn:hover { transform: translateY(-2px); border-color: var(--accent); }
  @media (max-width: 720px) { .about-grid { grid-template-columns: 1fr; } .photo { max-width: 260px; margin: 0 auto; } }
</style>
```

- [ ] **Step 2: Certifications 작성**

`src/components/Certifications.astro`:

```astro
---
import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const certs = await getCollection('certifications');
---
<section id="certifications" class="section" data-reveal>
  <h2 class="section-title">{t(lang, 'section.certifications')}</h2>
  <ul class="cert-list">
    {certs.map((c) => (
      <li>
        <span class="issuer">{c.data.issuer[lang]}</span>
        <span class="name">{c.data.name[lang]}</span>
        <span class="date">{c.data.date}</span>
      </li>
    ))}
  </ul>
</section>
<style>
  .cert-list { list-style: none; padding: 0; max-width: 640px; margin: 0 auto; }
  .cert-list li { display: flex; gap: 16px; justify-content: space-between; padding: 12px 8px;
    border-bottom: 1px solid var(--border); }
  .issuer { color: var(--muted); }
  .name { flex: 1; }
  .date { color: var(--muted); font-variant-numeric: tabular-nums; }
  @media (max-width: 560px) { .cert-list li { flex-wrap: wrap; } }
</style>
```

`Home.astro`에 `<About lang={lang} />`, `<Certifications lang={lang} />` 추가.

- [ ] **Step 3: 검증** — `npm run check && npm run build` → 통과. dev에서 두 섹션 렌더·반응형 확인.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: About·Certifications 섹션"
```

---

### Task 9: Achievements 섹션 + 양방향 hover 연동

**Files:**
- Create: `src/components/Achievements.astro`, `src/scripts/achievementLink.ts`
- Modify: `src/components/Home.astro` (import 추가)

**Interfaces:**
- Consumes: `awards`·`programs` 컬렉션 (Task 2의 `id`, `scan` 필드).
- Produces: 목록 항목 `.ach-item[data-id]`, 스캔 카드 `.ach-scan[data-id]`. hover 시 상대편에 `.is-linked` 클래스. 스캔 카드에 `data-lightbox` 속성 (Task 10의 라이트박스가 구독).

- [ ] **Step 1: 컴포넌트 작성**

`src/components/Achievements.astro`:

```astro
---
import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const awards = await getCollection('awards');
const programs = await getCollection('programs');
const scans = [...awards, ...programs].filter((a) => a.data.scan);
---
<section id="achievements" class="section" data-reveal data-achievements>
  <h2 class="section-title">{t(lang, 'section.achievements')}</h2>
  <div class="ach-grid">
    <div class="ach-lists">
      <h3>{t(lang, 'section.awards')}</h3>
      <ul>
        {awards.map((a) => (
          <li class="ach-item" data-id={a.data.id}>
            {a.data.name[lang]} <span class="period">{a.data.period}</span>
          </li>
        ))}
      </ul>
      <h3>{t(lang, 'section.programs')}</h3>
      <ul>
        {programs.map((a) => (
          <li class="ach-item" data-id={a.data.id}>
            {a.data.name[lang]} <span class="period">{a.data.period}</span>
          </li>
        ))}
      </ul>
    </div>
    <div class="ach-scans">
      {scans.map((a) => (
        <button class="ach-scan" data-id={a.data.id} data-lightbox={a.data.scan}
          aria-label={a.data.name[lang]}>
          <img src={a.data.scan} alt={a.data.name[lang]} loading="lazy" />
        </button>
      ))}
    </div>
  </div>
</section>
<style>
  .ach-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
  .ach-lists h3 { margin: 24px 0 12px; }
  .ach-lists ul { list-style: none; padding: 0; }
  .ach-item { padding: 8px 10px; border-radius: 8px; transition: background 0.15s, color 0.15s; }
  .period { color: var(--muted); font-size: 0.85rem; margin-left: 8px; }
  .ach-item.is-linked, .ach-item:hover { background: var(--card); color: var(--accent); }
  .ach-scans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; align-content: start; }
  .ach-scan { border: 2px solid var(--border); border-radius: 8px; overflow: hidden; padding: 0;
    background: var(--card); transition: transform 0.15s, border-color 0.15s, opacity 0.15s; }
  .ach-scan img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; }
  .ach-scan.is-linked, .ach-scan:hover { transform: scale(1.06); border-color: var(--accent); }
  .ach-scans:has(.is-linked) .ach-scan:not(.is-linked) { opacity: 0.45; }
  @media (max-width: 720px) { .ach-grid { grid-template-columns: 1fr; } }
</style>
<script>
  import { initAchievementLink } from '../scripts/achievementLink';
  const section = document.querySelector<HTMLElement>('[data-achievements]');
  if (section) initAchievementLink(section);
</script>
```

- [ ] **Step 2: hover 연동 스크립트 작성**

`src/scripts/achievementLink.ts`:

```ts
// 목록(.ach-item) ↔ 스캔(.ach-scan) 양방향 hover 연동: 같은 data-id에 .is-linked 토글
export function initAchievementLink(section: HTMLElement): void {
  const setLinked = (id: string | null) => {
    section.querySelectorAll<HTMLElement>('[data-id]').forEach((el) => {
      el.classList.toggle('is-linked', id !== null && el.dataset.id === id);
    });
  };
  section.addEventListener('mouseover', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-id]');
    if (el) setLinked(el.dataset.id ?? null);
  });
  section.addEventListener('mouseleave', () => setLinked(null));
}
```

`Home.astro`에 `<Achievements lang={lang} />` 추가.

- [ ] **Step 3: 검증** — `npm run check && npm run build` → 통과. dev에서: 스캔 hover → 목록 항목 하이라이트, 목록 hover → 해당 스캔 확대+테두리, 나머지 스캔 흐려짐 확인.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: Achievements 섹션과 목록↔스캔본 양방향 hover 연동"
```

---

### Task 10: 라이트박스

**Files:**
- Create: `src/components/Lightbox.astro`, `src/scripts/lightbox.ts`
- Modify: `src/components/Home.astro` (import 추가)

**Interfaces:**
- Consumes: `[data-lightbox]` 버튼 (Task 9 — 값은 이미지 경로).
- Produces: `<dialog class="lightbox" data-lightbox-dialog>` 단일 인스턴스. 좌우 화살표로 `[data-lightbox]` 목록 순회. ESC/배경 클릭/닫기 버튼으로 닫힘.

- [ ] **Step 1: 컴포넌트·스크립트 작성**

`src/components/Lightbox.astro`:

```astro
---
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
---
<dialog class="lightbox" data-lightbox-dialog>
  <button class="lb-close" data-lb-close aria-label={t(lang, 'lightbox.close')}>×</button>
  <button class="lb-nav lb-prev" data-lb-prev aria-label="prev">‹</button>
  <img data-lb-img src="" alt="" />
  <button class="lb-nav lb-next" data-lb-next aria-label="next">›</button>
</dialog>
<style>
  .lightbox { border: none; background: transparent; padding: 0; max-width: 90vw; max-height: 90vh; }
  .lightbox::backdrop { background: rgb(0 0 0 / 0.75); }
  .lightbox img { max-width: 90vw; max-height: 85vh; border-radius: 8px; }
  .lb-close, .lb-nav { position: fixed; background: var(--card); color: var(--text);
    border: 1px solid var(--border); border-radius: 50%; width: 40px; height: 40px; font-size: 1.2rem; }
  .lb-close { top: 16px; right: 16px; }
  .lb-prev { left: 16px; top: 50%; }
  .lb-next { right: 16px; top: 50%; }
</style>
<script>
  import { initLightbox } from '../scripts/lightbox';
  initLightbox();
</script>
```

`src/scripts/lightbox.ts`:

```ts
export function initLightbox(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  if (!dialog) return;
  const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const triggers = [...document.querySelectorAll<HTMLElement>('[data-lightbox]')];
  let index = 0;

  const show = (i: number) => {
    index = (i + triggers.length) % triggers.length;
    const el = triggers[index];
    img.src = el.dataset.lightbox!;
    img.alt = el.getAttribute('aria-label') ?? '';
  };
  triggers.forEach((el, i) => el.addEventListener('click', () => { show(i); dialog.showModal(); }));
  dialog.querySelector('[data-lb-close]')!.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]')!.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lb-next]')!.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // 배경 클릭
}
```

`Home.astro`에 `<Lightbox lang={lang} />` 추가.

- [ ] **Step 2: 검증** — `npm run check && npm run build` → 통과. dev에서: 스캔 클릭 → 확대, 화살표 순회, ESC·배경·× 닫기 확인.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: 상장·수료증 라이트박스"
```

---

### Task 11: Projects 그리드 + 프로젝트 모달

**Files:**
- Create: `src/components/Projects.astro`, `src/components/ProjectModal.astro`, `src/scripts/projectModal.ts`
- Modify: `src/components/Home.astro` (import 추가)

**Interfaces:**
- Consumes: `projects` 컬렉션, `splitBilingual` (Task 3), `marked`, `open-project` CustomEvent (Task 6).
- Produces: 카드 `.project-card[data-slug]`. 모달 `<dialog data-project-modal>` + 프로젝트별 `<template data-project-tpl="<slug>">`. URL 해시 `#project-<slug>` push/pop으로 열림·닫힘 동기화.

- [ ] **Step 1: Projects 그리드 작성**

`src/components/Projects.astro`:

```astro
---
import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
---
<section id="projects" class="section" data-reveal>
  <h2 class="section-title">{t(lang, 'section.projects')}</h2>
  <div class="project-grid">
    {projects.map((p) => (
      <button class="project-card" data-slug={p.id}>
        <img src={p.data.thumbnail} alt={p.data.title[lang]} loading="lazy" />
        <div class="card-body">
          <h3>{p.data.title[lang]}</h3>
          <p>{p.data.summary[lang]}</p>
        </div>
      </button>
    ))}
  </div>
</section>
<style>
  .project-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .project-card { text-align: left; border: 1px solid var(--border); border-radius: 12px;
    overflow: hidden; background: var(--card); padding: 0; box-shadow: var(--shadow);
    transition: transform 0.15s; }
  .project-card:hover { transform: translateY(-4px); }
  .project-card img { aspect-ratio: 4 / 3; object-fit: cover; width: 100%;
    transition: transform 0.3s; }
  .project-card:hover img { transform: scale(1.05); }
  .card-body { padding: 16px; }
  .card-body p { color: var(--muted); font-size: 0.9rem; margin-top: 4px; }
  @media (max-width: 900px) { .project-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .project-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2: 모달 컴포넌트 작성**

`src/components/ProjectModal.astro`:

```astro
---
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import { splitBilingual } from '../lib/bilingual';
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
const rendered = projects.map((p) => ({
  ...p,
  html: marked.parse(splitBilingual(p.body ?? '')[lang]) as string,
}));
---
<dialog class="project-modal" data-project-modal>
  <button class="pm-close" data-pm-close aria-label={t(lang, 'modal.close')}>×</button>
  <div class="pm-content" data-pm-content></div>
</dialog>
{rendered.map((p) => (
  <template data-project-tpl={p.id}>
    <h2>{p.data.title[lang]}</h2>
    <p class="pm-period">{p.data.period}</p>
    <ul class="pm-tech">{p.data.tech.map((tech) => <li>{tech}</li>)}</ul>
    <div class="pm-actions">
      <a class="btn" href={p.data.github} target="_blank" rel="noopener">{t(lang, 'modal.github')}</a>
      {p.data.demo && <a class="btn" href={p.data.demo} target="_blank" rel="noopener">{t(lang, 'modal.demo')}</a>}
    </div>
    {p.data.images.map((src) => <img src={src} alt={p.data.title[lang]} loading="lazy" />)}
    <div class="pm-body" set:html={p.html} />
  </template>
))}
<style is:global>
  .project-modal { width: min(720px, 92vw); max-height: 88vh; border: 1px solid var(--border);
    border-radius: 16px; background: var(--bg); color: var(--text); padding: 32px; overflow-y: auto; }
  .project-modal::backdrop { background: rgb(0 0 0 / 0.6); }
  .pm-close { position: sticky; top: 0; float: right; background: var(--card);
    border: 1px solid var(--border); border-radius: 50%; width: 36px; height: 36px; }
  .pm-period { color: var(--muted); margin: 4px 0 12px; }
  .pm-tech { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .pm-tech li { background: var(--card); border: 1px solid var(--border); border-radius: 999px;
    padding: 2px 12px; font-size: 0.85rem; }
  .pm-actions { display: flex; gap: 12px; margin-bottom: 20px; }
  .pm-actions .btn { padding: 8px 20px; border: 1px solid var(--border); border-radius: 8px;
    text-decoration: none; background: var(--card); }
  .pm-actions .btn:hover { border-color: var(--accent); }
  .pm-content img { border-radius: 8px; margin-bottom: 16px; }
  .pm-body :is(h2, h3) { margin: 20px 0 8px; }
  .pm-body p { margin-bottom: 12px; }
</style>
<script>
  import { initProjectModal } from '../scripts/projectModal';
  initProjectModal();
</script>
```

- [ ] **Step 3: 모달 스크립트 작성**

`src/scripts/projectModal.ts`:

```ts
const HASH_PREFIX = '#project-';

export function initProjectModal(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-project-modal]');
  if (!dialog) return;
  const content = dialog.querySelector<HTMLElement>('[data-pm-content]')!;

  const open = (slug: string, push: boolean) => {
    const tpl = document.querySelector<HTMLTemplateElement>(`[data-project-tpl="${slug}"]`);
    if (!tpl) return;
    content.replaceChildren(tpl.content.cloneNode(true));
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (push && location.hash !== HASH_PREFIX + slug)
      history.pushState(null, '', HASH_PREFIX + slug);
  };
  const close = (back: boolean) => {
    if (dialog.open) dialog.close();
    document.body.style.overflow = '';
    if (back && location.hash.startsWith(HASH_PREFIX)) history.back();
  };

  // 카드 클릭 / 히어로 링의 open-project 이벤트
  document.querySelectorAll<HTMLElement>('.project-card[data-slug]').forEach((card) =>
    card.addEventListener('click', () => open(card.dataset.slug!, true)));
  window.addEventListener('open-project', ((e: CustomEvent<{ slug: string }>) =>
    open(e.detail.slug, true)) as EventListener);

  // 닫기: ×, 배경, ESC(cancel), 뒤로가기(popstate)
  dialog.querySelector('[data-pm-close]')!.addEventListener('click', () => close(true));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(true); });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(true); });
  window.addEventListener('popstate', () => {
    if (location.hash.startsWith(HASH_PREFIX)) open(location.hash.slice(HASH_PREFIX.length), false);
    else close(false);
  });

  // 해시 포함 URL 직접 진입
  if (location.hash.startsWith(HASH_PREFIX)) open(location.hash.slice(HASH_PREFIX.length), false);
}
```

`Home.astro`에 `<Projects lang={lang} />`, `<ProjectModal lang={lang} />` 추가.

- [ ] **Step 4: 검증** — `npm run check && npm test && npm run build` → 통과. dev에서: 카드 클릭 → 모달(제목·기간·태그·GitHub 버튼·본문), 히어로 카드 클릭 → 같은 모달, URL에 `#project-<slug>`, 뒤로가기로 닫힘, `/#project-sample-project` 직접 진입 시 자동 열림, body 스크롤 잠금 확인.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Projects 그리드와 해시 동기화 프로젝트 모달"
```

---

### Task 12: 스크롤 리빌 + 마이크로 인터랙션 마무리

**Files:**
- Create: `src/scripts/reveal.ts`
- Modify: `src/layouts/Layout.astro` (스크립트 연결), `src/styles/global.css` (stagger 규칙 추가)

**Interfaces:**
- Consumes: `[data-reveal]` 규약 (Task 4), 각 섹션의 카드 클래스.
- Produces: 뷰포트 진입 시 `.revealed` 부여(1회). 그리드 자식 stagger.

- [ ] **Step 1: 리빌 스크립트 작성**

`src/scripts/reveal.ts`:

```ts
export function initReveal(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}
```

`Layout.astro`의 `</main>` 뒤에 추가:

```astro
<script>
  import { initReveal } from '../scripts/reveal';
  initReveal();
</script>
```

- [ ] **Step 2: stagger·마이크로 인터랙션 CSS 추가**

`global.css`에 추가:

```css
/* 그리드 자식 순차 등장 */
[data-reveal] > .project-grid > *, [data-reveal] .ach-scans > * { transition-delay: 0s; }
[data-reveal]:not(.revealed) :is(.project-grid, .ach-scans) > * { opacity: 0; transform: translateY(16px); }
[data-reveal].revealed :is(.project-grid, .ach-scans) > * {
  opacity: 1; transform: none; transition: opacity 0.5s ease, transform 0.5s ease; }
[data-reveal].revealed :is(.project-grid, .ach-scans) > *:nth-child(2) { transition-delay: 0.08s; }
[data-reveal].revealed :is(.project-grid, .ach-scans) > *:nth-child(3) { transition-delay: 0.16s; }
[data-reveal].revealed :is(.project-grid, .ach-scans) > *:nth-child(4) { transition-delay: 0.24s; }
[data-reveal].revealed :is(.project-grid, .ach-scans) > *:nth-child(5) { transition-delay: 0.32s; }
[data-reveal].revealed :is(.project-grid, .ach-scans) > *:nth-child(n+6) { transition-delay: 0.4s; }

/* 링크 밑줄 슬라이드 */
.pm-actions .btn, .actions .btn { position: relative; }
a:not(.btn):not(.logo):hover { color: var(--accent); }
@media (prefers-reduced-motion: reduce) {
  [data-reveal] :is(.project-grid, .ach-scans) > * { opacity: 1 !important; transform: none !important; transition: none !important; }
}
```

- [ ] **Step 3: 검증** — `npm run check && npm run build` → 통과. dev에서: 스크롤 시 섹션 등장, 그리드 순차 등장, OS 설정 "동작 줄이기" 시 즉시 표시 확인.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: 스크롤 리빌과 stagger 마이크로 인터랙션"
```

---

### Task 13: Docker 배포 구성

**Files:**
- Create: `Dockerfile`, `deploy/nginx.conf`, `docker-compose.yml`, `.dockerignore`

**Interfaces:**
- Consumes: `npm run build` → `dist/` (Task 1).
- Produces: `docker compose up -d --build`로 8080 포트 서빙. RPi(ARM64) 호환(멀티아치 베이스 이미지만 사용).

- [ ] **Step 1: 파일 작성**

`Dockerfile`:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

`deploy/nginx.conf`:

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;

  error_page 404 /404.html;

  location /_astro/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
  location /images/ {
    add_header Cache-Control "public, max-age=604800";
  }
  location / {
    try_files $uri $uri/index.html =404;
  }
}
```

`docker-compose.yml`:

```yaml
services:
  portfolio:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

`.dockerignore`:

```
node_modules
dist
.astro
.git
docs
```

- [ ] **Step 2: 검증** — Run: `docker compose up -d --build` → `http://localhost:8080` 정상, `/en/` 정상, 없는 경로에서 404 페이지, 확인 후 `docker compose down`. (Docker 미설치 환경이면 이 step은 RPi에서 수행한다고 명시하고 빌드 파일만 커밋.)

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: Docker(nginx) 배포 구성"
```

---

### Task 14: CLAUDE.md 콘텐츠 가이드 + README

**Files:**
- Create: `CLAUDE.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: Task 2의 콘텐츠 스키마·경로 규약 전부.
- Produces: 이후 세션의 Claude Code가 콘텐츠를 추가할 때 따르는 유일한 가이드.

- [ ] **Step 1: CLAUDE.md 작성**

`CLAUDE.md`에 다음 내용을 작성 (아래 구조 그대로, 실제 스키마와 일치해야 함):

```markdown
# 포트폴리오 사이트 — 콘텐츠 추가 가이드

이 저장소는 Astro 정적 포트폴리오다. 콘텐츠 추가/수정은 아래 규칙만 따르면 된다.
**모든 텍스트는 ko/en 두 언어 필수. 작업 후 `npm run check && npm run build` 통과 확인 후 커밋.**

## 프로젝트 추가
1. `src/content/projects/<slug>.md` 생성 (slug는 kebab-case 영문).
2. frontmatter 필수 필드: title{ko,en}, summary{ko,en}, thumbnail, github, tech[], period, order. 선택: images[], demo, featured.
3. 본문은 `<!-- ko -->` 섹션 다음 `<!-- en -->` 섹션 순서로 작성 (마커 필수, ko가 먼저).
4. 이미지는 `public/images/projects/<slug>/`에 배치. 썸네일 권장 800×600 webp.
5. `featured: true`면 히어로 회전 갤러리에 노출된다. featured는 3~8개 유지.
6. `order`는 그리드 정렬 순서 (낮을수록 앞).

## 자격증 추가
`src/content/data/certifications.yaml`에 항목 추가: id(kebab-case 고유값), issuer{ko,en}, name{ko,en}, date("YYYY.MM.DD").

## 수상(Awards) / 교육(Programs) 추가
`src/content/data/awards.yaml` 또는 `programs.yaml`에 항목 추가: id, name{ko,en}, org{ko,en}, period("YYYY.MM.DD ~ YYYY.MM.DD"), scan(선택 — 상장/수료증 스캔본 경로).
스캔본은 `public/images/achievements/<id>.webp`(권장 세로형 3:4)에 배치. scan이 있으면 오른쪽 그리드에 표시되고 목록과 hover 연동된다.

## 소개글/연락처 수정
`src/content/data/site.yaml`의 `main` 항목 수정.

## 하지 말 것
- `src/content.config.ts` 스키마를 콘텐츠에 맞춰 완화하지 말 것 (빌드 실패는 콘텐츠 오류 신호).
- placeholder SVG 이미지를 실제 콘텐츠에 재사용하지 말 것.
- 새 의존성 추가 금지.

## 배포 (RPi)
git pull 후 `docker compose up -d --build`. 포트 8080.
```

- [ ] **Step 2: README 갱신**

`README.md`를 프로젝트 소개(스택, 로컬 실행 `npm install && npm run dev`, 빌드, Docker 배포, 콘텐츠 추가는 CLAUDE.md 참조)로 교체.

- [ ] **Step 3: 최종 전체 검증** — Run: `npm run check && npm test && npm run build`
Expected: 모두 통과.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs: 콘텐츠 추가 가이드(CLAUDE.md)와 README"
```

---

## 실행 후 남는 수작업 (계획 범위 밖, 사용자 작업)

- placeholder SVG → 실제 사진·스캔본·프로젝트 썸네일 교체
- `site.yaml`의 GitHub URL·소개글을 실제 내용으로 교체
- 실제 도메인 확정 시 `astro.config.mjs`의 `site`와 `public/robots.txt`의 Sitemap URL 교체
- RPi에서 리버스 프록시/HTTPS 연결 (기존 서버 구성에 따름)
