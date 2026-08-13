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
