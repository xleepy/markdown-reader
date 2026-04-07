import { useState, useRef, useCallback, useEffect } from "react";

const BOOST = 2; // velocity added per scroll event
const MAX_VELOCITY = 20; // lines/frame cap
const FRICTION = 0.82; // velocity multiplier per frame
const MIN_VELOCITY = 0.1; // stop threshold
const FRAME_MS = 16; // ~60fps

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function useInertialScroll(maxScroll: number) {
  const [scrollY, setScrollY] = useState(0);

  const posRef = useRef(0); // fractional scroll position
  const velRef = useRef(0); // current velocity (lines/frame)
  const maxRef = useRef(maxScroll);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    maxRef.current = maxScroll;
  }, [maxScroll]);

  const stopAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      clearInterval(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    velRef.current *= FRICTION;

    if (Math.abs(velRef.current) < MIN_VELOCITY) {
      velRef.current = 0;
      stopAnimation();
      return;
    }

    posRef.current = clamp(posRef.current + velRef.current, 0, maxRef.current);
    setScrollY(Math.round(posRef.current));
  }, [stopAnimation]);

  const startAnimation = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = setInterval(tick, FRAME_MS);
  }, [tick]);

  // Mouse: add velocity in the given direction and let it coast
  const addVelocity = useCallback(
    (direction: number) => {
      // Skip if already at the boundary in this direction
      if (direction < 0 && posRef.current <= 0) return;
      if (direction > 0 && posRef.current >= maxRef.current) return;

      const boosted = velRef.current + direction * BOOST;
      velRef.current = clamp(boosted, -MAX_VELOCITY, MAX_VELOCITY);
      startAnimation();
    },
    [startAnimation],
  );

  // Keyboard: instant jump to absolute position, cancels any ongoing animation
  const jumpTo = useCallback(
    (y: number) => {
      stopAnimation();
      velRef.current = 0;
      posRef.current = y;
      setScrollY(y);
    },
    [stopAnimation],
  );

  // Keyboard: instant relative scroll, reads posRef so it's never stale
  const scrollBy = useCallback(
    (delta: number) => {
      stopAnimation();
      velRef.current = 0;
      posRef.current = clamp(posRef.current + delta, 0, maxRef.current);
      setScrollY(Math.round(posRef.current));
    },
    [stopAnimation],
  );

  useEffect(() => stopAnimation, [stopAnimation]);

  return { scrollY, addVelocity, jumpTo, scrollBy };
}
