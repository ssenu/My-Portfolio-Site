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
