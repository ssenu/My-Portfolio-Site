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
