"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

export interface TypewriterProps {
  /** Text to type. Re-types when it changes. */
  text: string;
  /** Milliseconds per character. */
  speed?: number;
  /** Milliseconds to wait once the line is complete. */
  holdTime?: number;
  /** Restart after holding, for headlines that cycle. */
  loop?: boolean;
  /** Blinking caret while typing. */
  caret?: boolean;
  /** Start typing when scrolled into view. */
  startOnView?: boolean;
  className?: string;
}

/**
 * Types text one character at a time with a steady caret.
 * With reduced motion the full text simply appears.
 */
export function Typewriter({
  text,
  speed = 34,
  holdTime = 2400,
  loop = false,
  caret = true,
  startOnView = false,
  className,
}: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewFlag(ref);
  const active = startOnView ? inView : true;
  const reduce = !!useReducedMotion();
  const [count, setCount] = useState(active && text ? 0 : text.length);

  // Restart the typing pass whenever its inputs change. Adjusting
  // during render (not in an effect) keeps the reset on the same
  // commit; reduced motion never enters the typing pass.
  const runKey = `${active}|${reduce}|${text}`;
  const [lastRunKey, setLastRunKey] = useState(runKey);
  if (lastRunKey !== runKey) {
    setLastRunKey(runKey);
    if (active && !reduce) setCount(0);
  }

  useEffect(() => {
    if (!active) return;
    if (reduce) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < text.length) {
        timer = setTimeout(tick, speed);
      } else if (loop) {
        timer = setTimeout(() => {
          i = 0;
          setCount(0);
          timer = setTimeout(tick, speed);
        }, holdTime);
      }
    };
    timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [text, speed, holdTime, loop, active, reduce]);

  // Reduced motion: the full line renders immediately, no typing pass.
  const shownCount = reduce ? text.length : count;

  return (
    <span ref={ref} className={className}>
      {text.slice(0, shownCount)}
      {caret && (
        <span
          aria-hidden="true"
          className="ml-px inline-block h-[1em] w-[2px] translate-y-[0.12em] animate-[pollen-caret_1s_steps(2)_infinite] bg-accent"
        />
      )}
    </span>
  );
}

function useInViewFlag(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-40px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}
