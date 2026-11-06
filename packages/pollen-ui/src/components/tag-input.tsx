"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import {
  IconClose as X,
} from "../icons";
import { cn } from "../lib/utils";
import { spring } from "../lib/motion";

export interface TagInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange"> {
  /** Current tags (controlled). */
  value?: string[];
  /** Initial tags (uncontrolled). */
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  placeholder?: string;
  /** Maximum number of tags; further input is ignored. */
  max?: number;
  /** Deduplicate on add. */
  unique?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Type and press Enter (or comma) to add a chip, Backspace on an
 * empty field removes the last one, and every chip removes
 * itself. Validates duplicates when unique is set.
 */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      value,
      defaultValue = [],
      onValueChange,
      placeholder = "Add tag…",
      max,
      unique = true,
      size = "md",
      className,
      id,
      disabled,
      onKeyDown: onKeyDownProp,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const [inner, setInner] = useState<string[]>(defaultValue);
    const [draft, setDraft] = useState("");
    // Duplicate attempts replay a shake on the field. Animation controls
    // (not a state key) so the subtree is never remounted: focus survives
    // and chip exit animations keep running.
    const shakeControls = useAnimationControls();
    const localRef = useRef<HTMLInputElement | null>(null);

    const tags = value ?? inner;

    const setTags = (next: string[]) => {
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    };

    const add = (raw: string) => {
      const tag = raw.trim().replace(/,+$/, "");
      if (!tag) return;
      if (max !== undefined && tags.length >= max) return;
      if (unique && tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
        void shakeControls.start({
          x: [0, -3, 3, -2, 2, 0],
          transition: { duration: 0.25 },
        });
        setDraft("");
        return;
      }
      setTags([...tags, tag]);
      setDraft("");
    };

    const remove = (index: number) => {
      setTags(tags.filter((_, i) => i !== index));
      requestAnimationFrame(() => localRef.current?.focus());
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDownProp?.(e);
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        add(draft);
      } else if (e.key === "Backspace" && !draft && tags.length > 0) {
        e.preventDefault();
        remove(tags.length - 1);
      }
    };

    return (
      <motion.div
        animate={shakeControls}
        className={cn(
          "flex w-full flex-wrap items-center gap-1.5 bg-fill px-2.5 outline-none transition-[background-color,box-shadow] duration-150 placeholder:text-faint hover:bg-fill-strong focus-within:bg-card focus-within:ring-[3px] focus-within:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
          size === "sm" ? "min-h-9 rounded-[9px] py-1" : "min-h-11 rounded-[10px] py-1.5",
          className,
        )}
      >
        <AnimatePresence initial={false}>
          {tags.map((tag, index) => (
            <motion.span
              key={`${tag}-${index}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.1 } }}
              transition={spring.snappy}
              className="inline-flex items-center gap-1 rounded-lg bg-card py-1 pl-2.5 pr-1 text-[13px] font-medium text-foreground shadow-[var(--pollen-shadow-xs)]"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => remove(index)}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-faint transition-colors hover:bg-fill hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          ref={(node) => {
            localRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          id={fieldId}
          disabled={disabled}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft && add(draft)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className={cn(
            "min-w-[6ch] flex-1 bg-transparent outline-none placeholder:text-faint",
            size === "sm" ? "h-7 text-sm" : "h-8 text-[15px]",
            // 16px on touch keeps iOS Safari from focus-zooming the draft.
            "pointer-coarse:text-base",
          )}
          {...props}
        />
      </motion.div>
    );
  },
);

TagInput.displayName = "TagInput";
