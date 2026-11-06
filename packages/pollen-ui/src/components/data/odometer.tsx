"use client";

import { useEffect, useRef, useState } from "react";
import { motion, animate, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";
import { springSnappy } from "../../lib/springs";

export interface OdometerProps {
  /** Target value; changes roll the digits. Negatives roll in a sign. */
  value: number;
  /** Fixed digit count for the integer part; the value is zero-padded. Default 6. */
  digits?: number;
  /** Decimal places to render. Default 0. */
  precision?: number;
  /** A separator every three integer digits, e.g. ",". */
  separator?: string;
  /** Content before the digits, e.g. "$". */
  prefix?: React.ReactNode;
  /** Content after the digits, e.g. "kg". */
  suffix?: React.ReactNode;
  /** Renders 1,234,567 as "1.23M". `digits` is ignored when on. */
  compact?: boolean;
  className?: string;
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function RollColumn({ char }: { char: string }) {
  if (!/\d/.test(char)) {
    return <span className="inline-block">{char}</span>;
  }
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-baseline">
      <motion.span
        className="absolute left-0 top-0 flex flex-col items-center"
        initial={false}
        animate={{ y: `-${Number(char)}em` }}
        transition={springSnappy}
      >
        {DIGITS.map((d) => (
          <span key={d} className="h-[1em] leading-[1em]">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Odometer - digits that roll like a mechanical counter.
 *
 * Every digit is a vertical film of 0-9 that springs to its new
 * position whenever `value` changes, the way a taxi meter or an
 * airport split-flap counts. Far sturdier than a fade swap: the
 * eye can track exactly how far a number moved. Supports decimal
 * places, a sign, prefix and suffix slots, thousand separators and
 * a compact 1.23M mode.
 *
 * @example
 * <Odometer value={downloads} digits={5} separator="," />
 * <Odometer value={revenue} prefix="$" separator="," precision={2} />
 * <Odometer value={views} compact />
 */
export function Odometer({
  value,
  digits = 6,
  precision = 0,
  separator,
  prefix,
  suffix,
  compact = false,
  className,
}: OdometerProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  // Latest displayed value, so an interrupted roll can resume from the
  // digits' real position instead of the stale origin.
  const latest = useRef(value);

  useEffect(() => {
    if (reduced) {
      prev.current = value;
      latest.current = value;
      const raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }
    const controls = animate(prev.current, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        latest.current = v;
        setDisplay(v);
      },
      onComplete: () => {
        prev.current = value;
      },
    });
    return () => {
      controls.stop();
      // Keep the interrupted position: the next roll continues from
      // where the digits actually are, no jump back to the old origin.
      prev.current = latest.current;
    };
  }, [value, reduced]);

  const settled = Math.abs(display - value) < 0.5 / Math.pow(10, precision);
  const shown = settled ? value : display;

  /* Build the digit string: optional sign, zero-padded integer
     part, then the decimal part. */
  const abs = Math.abs(shown);
  let intPart: string;
  let decPart = "";
  let sign = shown < 0 ? "-" : "";

  if (compact) {
    const units = [
      { v: 1e9, s: "B" },
      { v: 1e6, s: "M" },
      { v: 1e3, s: "K" },
    ];
    const unit = units.find((u) => abs >= u.v);
    if (unit) {
      const n = abs / unit.v;
      const places = Math.max(precision, 1);
      const [i, d = ""] = n.toFixed(places).split(".");
      const dec = /[1-9]/.test(d) ? d : "";
      const compactSuffix = (
        <span className="ml-0.5 text-[0.72em] font-semibold opacity-60">
          {unit.s}
        </span>
      );
      return (
        <OdoFrame
          sign={shown < 0 ? "-" : ""}
          intPart={i}
          decPart={dec}
          separator={separator}
          prefix={prefix}
          suffix={
            <>
              {compactSuffix}
              {suffix}
            </>
          }
          aria={String(value)}
          className={className}
        />
      );
    }
  }

  intPart = String(Math.floor(abs)).padStart(digits, "0").slice(-digits);
  if (precision > 0) {
    decPart = (abs % 1).toFixed(precision).slice(2, 2 + precision);
  }

  return (
    <OdoFrame
      sign={sign}
      intPart={intPart}
      decPart={decPart}
      separator={separator}
      prefix={prefix}
      suffix={suffix}
      aria={String(value)}
      className={className}
    />
  );
}

function OdoFrame({
  sign,
  intPart,
  decPart = "",
  separator,
  prefix,
  suffix,
  aria,
  className,
}: {
  sign: string;
  intPart: string;
  decPart?: string;
  separator?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  aria: string;
  className?: string;
}) {
  const chars = intPart.split("");

  return (
    <span
      className={cn("inline-flex items-baseline tabular-nums", className)}
      role="status"
      aria-label={aria}
    >
      {prefix}
      {sign && <span className="inline-block">{sign}</span>}
      {chars.map((c, i) => {
        const showSep =
          separator && (chars.length - i) % 3 === 0 && i !== 0;
        return (
          <span key={i} className="inline-flex items-baseline">
            {showSep && <span className="opacity-40">{separator}</span>}
            <RollColumn char={c} />
          </span>
        );
      })}
      {decPart && (
        <>
          <span className="opacity-50">.</span>
          {decPart.split("").map((c, i) => (
            <RollColumn key={`d${i}`} char={c} />
          ))}
        </>
      )}
      {suffix}
    </span>
  );
}

Odometer.displayName = "Odometer";
