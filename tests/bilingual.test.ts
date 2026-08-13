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
