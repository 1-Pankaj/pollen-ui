"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Avatar } from "../avatar";
import { cn } from "../../lib/utils";
import { useIsClient } from "../../lib/use-is-client";
import { springSnappy } from "../../lib/springs";

/* ------------------------------------------------------------------
   Chat - a complete messaging surface, not a bubble.

   The library covers the whole conversation loop: grouped message
   history with date dividers and delivery ticks, hover or tap
   reactions with a burst animation, reply quotes, image messages, a
   self-growing composer with emoji picker, a typing indicator, and
   a useChat engine that runs the full lifecycle (sending, sent,
   delivered, read) so demos behave like real apps.
   ------------------------------------------------------------------ */

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface ChatReaction {
  emoji: string;
  count: number;
  /** True when the current user added this reaction. */
  own?: boolean;
}

export interface ChatAuthor {
  name: string;
  avatar?: string;
}

export interface ChatMessageData {
  id: string;
  author: ChatAuthor;
  content: string;
  /** Epoch milliseconds. */
  timestamp: number;
  /** True for the local user's own messages. */
  own?: boolean;
  status?: MessageStatus;
  image?: { src: string; alt?: string };
  replyTo?: { author: string; content: string };
  reactions?: ChatReaction[];
}

export const DEFAULT_QUICK_REACTIONS = ["❤️", "👍", "😂", "🔥", "🎉", "😮"];

const PICKER_EMOJI = [
  "❤️", "😂", "🔥", "👍", "🎉",
  "😮", "🙏", "👀", "💜", "✅",
  "😅", "🤔", "🙌", "💯", "⚡",
];

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function sameDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function dayLabel(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(ts, today.getTime())) return "Today";
  if (sameDay(ts, yesterday.getTime())) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

/* ------------------------------ ticks ----------------------------- */

function StatusTicks({ status }: { status: MessageStatus }) {
  if (status === "sending") {
    return (
      <svg aria-label="Sending" viewBox="0 0 14 14" className="h-3.5 w-3.5">
        <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3.4 3.4" />
      </svg>
    );
  }
  if (status === "failed") {
    return (
      <svg aria-label="Failed" viewBox="0 0 14 14" className="h-3.5 w-3.5">
        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  const read = status === "read";
  return (
    <span aria-label={status} className="relative inline-flex h-3.5 w-4">
      <svg viewBox="0 0 14 14" className="absolute left-0 top-0 h-3.5 w-3.5">
        <path d="M2.5 7.6 5.6 10.6 11.5 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={read ? 0.55 : 1} />
      </svg>
      {status !== "sent" && (
        <svg viewBox="0 0 14 14" className="absolute left-[4px] top-0 h-3.5 w-3.5">
          <path d="M2.5 7.6 5.6 10.6 11.5 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/* --------------------------- reaction burst ------------------------ */

function ReactionBurst({ emoji }: { emoji: string }) {
  const parts = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        x: (i - 2) * 11 + ((i % 2) * 8 - 4),
        y: 34 + (i % 3) * 12,
        s: 0.7 + (i % 3) * 0.22,
        d: i * 0.045,
      })),
    [],
  );
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute text-[13px] leading-none"
          initial={{ x: 0, y: 0, scale: 0.5, opacity: 0.95 }}
          animate={{ x: p.x, y: -p.y, scale: p.s, opacity: 0 }}
          transition={{ duration: 0.85, delay: p.d, ease: [0.16, 0.84, 0.44, 1] }}
        >
          {emoji}
        </motion.span>
      ))}
    </span>
  );
}

/* --------------------------- chat message -------------------------- */

export interface ChatMessageProps {
  message: ChatMessageData;
  /** Grouped under the previous message: compact corners, avatar
      slot kept but empty, so conversations breathe. */
  grouped?: boolean;
  /** Delivery ticks on own messages. Default true. */
  showStatus?: boolean;
  quickReactions?: string[];
  onReact?: (emoji: string) => void;
  onReply?: (message: ChatMessageData) => void;
  className?: string;
}

export function ChatMessage({
  message,
  grouped = false,
  showStatus = true,
  quickReactions = DEFAULT_QUICK_REACTIONS,
  onReact,
  onReply,
  className,
}: ChatMessageProps) {
  const [bursts, setBursts] = useState<{ key: number; emoji: string }[]>([]);
  const burstKey = useRef(0);
  const reduce = useReducedMotion();

  // Touch devices have no hover, so the reaction toolbar needs a
  // second way to appear: tapping the bubble toggles it, pressing
  // anywhere else closes it again.
  const [actionsOpen, setActionsOpen] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!actionsOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (actionsRef.current?.contains(target)) return;
      if (bubbleRef.current?.contains(target)) return;
      setActionsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [actionsOpen]);

  // Time labels render after mount. The server and the client can
  // sit in different timezones, and a locale-formatted clock is the
  // classic hydration mismatch: same bubble, different string.
  const mounted = useIsClient();

  const own = !!message.own;
  const time = mounted ? formatTime(message.timestamp) : "";

  const react = (emoji: string) => {
    onReact?.(emoji);
    if (!reduce) {
      const key = ++burstKey.current;
      setBursts((b) => [...b, { key, emoji }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.key !== key)), 1000);
    }
  };

  const lastOfGroup = !grouped;

  return (
    <div className={cn("group relative flex w-full items-end gap-2.5", own ? "flex-row-reverse" : "flex-row", className)}>
      {/* Avatar column: a real avatar on the last message of a
          group, a spacer within it. */}
      <div className="w-7 shrink-0">
        {lastOfGroup && !own && (
          <Avatar size={28} src={message.author.avatar} fallback={message.author.name} />
        )}
      </div>

      <div className={cn("relative flex max-w-[78%] flex-col", own ? "items-end" : "items-start")}>
        {/* Hover actions: quick reactions plus reply. The bar sits
            flush on the bubble's top edge - any gap would end the
            hover before the pointer reaches it - and its exit is
            delayed, so grazing the edge does not slam it shut. On
            touch, tapping the bubble opens it instead. */}
        <div
          ref={actionsRef}
          className={cn(
            "pointer-events-none absolute bottom-full z-20 flex items-center gap-0.5 rounded-full bg-card p-1 opacity-0 shadow-[var(--pollen-shadow-md)] ring-1 ring-[var(--pollen-border)] transition-all duration-150 delay-300 translate-y-1",
            own ? "right-0" : "left-0",
            "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-0",
            "group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:delay-0",
            actionsOpen && "pointer-events-auto translate-y-0 opacity-100 delay-0",
          )}
        >
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              aria-label={`React ${emoji}`}
              onClick={() => react(emoji)}
              className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-[14px] leading-none transition-transform duration-100 hover:scale-125 active:scale-95"
            >
              {emoji}
            </button>
          ))}
          {onReply && (
            <button
              type="button"
              aria-label="Reply"
              onClick={() => onReply(message)}
              className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.5 3 14 6.5 10.5 10" />
                <path d="M14 6.5H7a5 5 0 0 0-5 5V13" />
              </svg>
            </button>
          )}
        </div>

        {/* The bubble. Tapping it is the touch affordance for the
            reaction toolbar (hover: none pointers only). */}
        <div
          ref={bubbleRef}
          onClick={coarse ? () => setActionsOpen((o) => !o) : undefined}
          className={cn(
            "relative min-w-[52px] px-3.5 py-2 text-[14.5px] leading-relaxed",
            coarse && "cursor-pointer",
            own
              ? "rounded-2xl bg-[var(--pollen-accent)] text-white"
              : "rounded-2xl bg-[var(--pollen-fill)] text-foreground",
            lastOfGroup && (own ? "rounded-br-md" : "rounded-bl-md"),
            grouped && (own ? "rounded-tr-md" : "rounded-tl-md"),
          )}
        >
          {message.replyTo && (
            <div className={cn("mb-1.5 rounded-lg border-l-2 py-0.5 pl-2", own ? "border-white/50 bg-white/10" : "border-[var(--pollen-border-strong)] bg-[var(--pollen-fill)]")}>
              <p className={cn("text-xs font-medium", own ? "text-white/85" : "text-muted-foreground")}>
                {message.replyTo.author}
              </p>
              <p className={cn("line-clamp-2 text-xs", own ? "text-white/70" : "text-faint")}>
                {message.replyTo.content}
              </p>
            </div>
          )}
          {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
          {message.image && (
            <img
              src={message.image.src}
              alt={message.image.alt ?? ""}
              className="mt-1.5 max-h-56 rounded-xl object-cover"
              loading="lazy"
            />
          )}
          {/* Timestamp in the bubble corner, iMessage style. */}
          <span
            suppressHydrationWarning
            className={cn(
              "float-right ml-2 mt-1.5 select-none text-[10.5px] leading-none tabular-nums",
              own ? "text-white/65" : "text-faint",
            )}
          >
            {time}
          </span>

          {/* Reaction bursts float up from the bubble. */}
          {bursts.map((b) => (
            <ReactionBurst key={b.key} emoji={b.emoji} />
          ))}
        </div>

        {/* Reactions. */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={cn("-mt-1.5 z-10 flex flex-wrap gap-1", own ? "mr-1 justify-end" : "ml-1")}>
            {message.reactions.map((r) => (
              <motion.button
                key={r.emoji}
                type="button"
                layout
                aria-label={`${r.emoji} ${r.count}${r.own ? ", including you" : ""}`}
                onClick={() => onReact?.(r.emoji)}
                transition={springSnappy}
                className={cn(
                  "flex h-[22px] items-center gap-1 rounded-full px-1.5 text-[11.5px] font-medium shadow-[var(--pollen-shadow-xs)] transition-colors duration-150",
                  r.own
                    ? "bg-[color-mix(in_srgb,var(--pollen-accent)_14%,transparent)] text-foreground ring-1 ring-[color-mix(in_srgb,var(--pollen-accent)_50%,transparent)]"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-[12px] leading-none">{r.emoji}</span>
                {r.count > 1 && <span>{r.count}</span>}
              </motion.button>
            ))}
          </div>
        )}

        {/* Delivery ticks. */}
        {own && showStatus && (
          <span
            className={cn(
              "mt-1 flex h-4 items-center text-muted-foreground",
              message.status === "read" && "text-[var(--pollen-accent)]",
            )}
          >
            <StatusTicks status={message.status ?? "sent"} />
          </span>
        )}
      </div>
    </div>
  );
}

/* -------------------------- typing indicator ----------------------- */

export function TypingIndicator({
  name,
  avatar,
  className,
}: {
  name?: string;
  avatar?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-2.5", className)}>
      <div className="w-7 shrink-0">
        {name && <Avatar size={28} src={avatar} fallback={name} />}
      </div>
      <div
        role="status"
        aria-label={name ? `${name} is typing` : "Typing"}
        className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[var(--pollen-fill)] px-3.5 py-3"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70"
            animate={{ y: [0, -3, 0], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

/* --------------------------- day divider --------------------------- */

/**
 * A date divider whose label renders after mount. "Today" depends on
 * the viewer's clock and locale, so the server and the client first
 * paint the same empty line and the label fades in on the client.
 */
function DayDivider({ ts }: { ts: number }) {
  // Same hydration story as the message clock: the day label is
  // locale-formatted, so it only renders once the client is live.
  const mounted = useIsClient();
  const label = mounted ? dayLabel(ts) : "";
  return (
    <div
      className="flex items-center gap-3 py-1.5"
      role="separator"
      aria-label={label || undefined}
    >
      <span className="h-px flex-1 bg-[var(--pollen-border)]" />
      <span className="text-[11px] font-medium uppercase tracking-wide text-faint">
        {label}
      </span>
      <span className="h-px flex-1 bg-[var(--pollen-border)]" />
    </div>
  );
}

/* ----------------------------- thread ------------------------------ */

export interface ChatThreadProps {
  messages: ChatMessageData[];
  /** Author shown as typing under the thread. */
  typing?: { name: string; avatar?: string } | null;
  quickReactions?: string[];
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (message: ChatMessageData) => void;
  /** Follow new messages to the bottom. Default true. */
  autoScroll?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}

/**
 * The scrollable conversation: date dividers, consecutive messages
 * grouped under one avatar, delivery ticks on your own bubbles and
 * a typing indicator that occupies the same rhythm as a message.
 */
export function ChatThread({
  messages = [],
  typing = null,
  quickReactions,
  onReact,
  onReply,
  autoScroll = true,
  emptyState,
  className,
}: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rows = useMemo(() => {
    const out: Array<
      | { kind: "divider"; key: string; ts: number }
      | { kind: "message"; key: string; message: ChatMessageData; grouped: boolean }
    > = [];
    let prev: ChatMessageData | null = null;
    for (const m of messages) {
      if (!prev || !sameDay(prev.timestamp, m.timestamp)) {
        // The key is the raw epoch, not the formatted label: the
        // label depends on the locale and the clock, the key must
        // not.
        out.push({ kind: "divider", key: `d-${m.timestamp}`, ts: m.timestamp });
        prev = null;
      }
      const grouped =
        !!prev &&
        prev.author.name === m.author.name &&
        m.timestamp - prev.timestamp < 4 * 60 * 1000;
      out.push({ kind: "message", key: m.id, message: m, grouped });
      prev = m;
    }
    return out;
  }, [messages]);

  // Follow new messages only while the reader is already at the
  // bottom; reading history is never yanked back down. The flag
  // updates on scroll, so a manual scroll up stops the following
  // until the reader returns to the bottom.
  const stuckToBottom = useRef(true);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      stuckToBottom.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!autoScroll || !stuckToBottom.current) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages.length, typing, autoScroll, reduce]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        // pt-11 gives the first message's reaction toolbar headroom;
        // the scroll container would otherwise clip it.
        "flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-4 pt-11",
        className,
      )}
    >
      {rows.length === 0 && emptyState}
      {rows.map((row) =>
        row.kind === "divider" ? (
          <DayDivider key={row.key} ts={row.ts} />
        ) : (
          <ChatMessage
            key={row.key}
            message={row.message}
            grouped={row.grouped}
            quickReactions={quickReactions}
            onReact={(emoji) => onReact?.(row.message.id, emoji)}
            onReply={onReply}
          />
        ),
      )}
      {typing && <TypingIndicator name={typing.name} avatar={typing.avatar} />}
    </div>
  );
}

/* ------------------------------ input ------------------------------ */

export interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Show the emoji picker. Default true. */
  emojiPicker?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  className?: string;
  ariaLabel?: string;
}

function SmileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M7.2 11.6c.7.9 1.7 1.4 2.8 1.4s2.1-.5 2.8-1.4" />
      <circle cx="7.4" cy="8" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12.6" cy="8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 13V3.5" />
      <path d="M3.8 7.5 8 3.3l4.2 4.2" />
    </svg>
  );
}

/**
 * The composer: grows with the message, Enter sends and Shift +
 * Enter breaks the line, an emoji panel inserts at the caret, and
 * the send button only lights up when there is something to send.
 */
export function ChatInput({
  onSend,
  placeholder = "Write a message",
  disabled = false,
  emojiPicker = true,
  maxLength,
  autoFocus = false,
  className,
  ariaLabel = "Message input",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // A dialog needs Escape and an outside press as exits, besides
  // its toggle button.
  useEffect(() => {
    if (!pickerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPickerOpen(false);
      emojiButtonRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (pickerRef.current?.contains(target)) return;
      if (emojiButtonRef.current?.contains(target)) return;
      setPickerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [pickerOpen]);

  const grow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  useLayoutEffect(grow, [value, grow]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    requestAnimationFrame(grow);
    textareaRef.current?.focus();
  };

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setValue((v) => v + emoji);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + emoji + value.slice(end);
    setValue(next.slice(0, maxLength ?? next.length));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const nearLimit = maxLength ? value.length > maxLength * 0.8 : false;

  return (
    <div className={cn("relative px-3 pb-3", className)}>
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            ref={pickerRef}
            className="absolute bottom-[calc(100%-4px)] left-3 z-30 grid w-[228px] grid-cols-5 gap-0.5 rounded-2xl bg-card p-2 shadow-[var(--pollen-shadow-lg)]"
            role="dialog"
            aria-label="Emoji picker"
          >
            {PICKER_EMOJI.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  insertEmoji(emoji);
                  setPickerOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[19px] leading-none transition-transform duration-100 hover:scale-110 hover:bg-[var(--pollen-fill)] active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "flex items-end gap-1 rounded-[22px] bg-[var(--pollen-fill)] px-1.5 py-1.5 transition-shadow duration-200",
          "focus-within:shadow-[var(--pollen-shadow-md)]",
          disabled && "opacity-60",
        )}
      >
        {emojiPicker && (
          <button
            ref={emojiButtonRef}
            type="button"
            aria-label="Emoji"
            aria-expanded={pickerOpen}
            aria-haspopup="dialog"
            onClick={() => setPickerOpen((o) => !o)}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-[var(--pollen-fill-strong)] hover:text-foreground",
              pickerOpen && "text-foreground",
            )}
          >
            <SmileIcon className="h-[18px] w-[18px]" />
          </button>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="max-h-[120px] min-h-[32px] flex-1 resize-none self-center bg-transparent py-1.5 text-[14.5px] leading-relaxed text-foreground outline-none placeholder:text-faint"
        />
        <motion.button
          type="button"
          aria-label="Send message"
          onClick={submit}
          disabled={disabled || !value.trim()}
          whileTap={value.trim() ? { scale: 0.88 } : undefined}
          animate={{ scale: value.trim() ? 1 : 0.92 }}
          transition={springSnappy}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
            value.trim()
              ? "bg-[var(--pollen-accent)] text-white"
              : "bg-[var(--pollen-fill-strong)] text-[var(--pollen-fg-faint)]",
          )}
        >
          <ArrowUpIcon className="h-4 w-4" />
        </motion.button>
      </div>
      {maxLength && (
        <span
          className={cn(
            "absolute bottom-1 right-5 text-[10.5px] tabular-nums",
            nearLimit ? "text-warning" : "text-transparent",
          )}
        >
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

/* ------------------------------ engine ----------------------------- */

export interface UseChatOptions {
  seed?: ChatMessageData[];
  autoReply?: {
    author: ChatAuthor;
    messages: string[];
    /** Delay before the typing indicator appears. Default 700. */
    delay?: number;
    /** How long the typing indicator stays. Default 1500. */
    typingDuration?: number;
  };
}

let chatSeq = 0;
const nextId = () => `msg-${Date.now().toString(36)}-${++chatSeq}`;

/**
 * A small conversation engine for demos and prototypes: send()
 * runs the full delivery lifecycle (sending, sent, delivered,
 * read), react() toggles reactions, and with autoReply the other
 * side types back on its own clock.
 */
export function useChat({ seed = [], autoReply }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessageData[]>(seed);
  const [typing, setTyping] = useState<ChatAuthor | null>(null);
  const timers = useRef<number[]>([]);
  const replyIndex = useRef(0);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const t of pending) window.clearTimeout(t);
    };
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const send = useCallback(
    (text: string) => {
      const id = nextId();
      const message: ChatMessageData = {
        id,
        author: { name: "You" },
        content: text,
        timestamp: Date.now(),
        own: true,
        status: "sending",
      };
      setMessages((m) => [...m, message]);
      later(() => setMessages((m) => m.map((x) => (x.id === id ? { ...x, status: "sent" as const } : x))), 420);
      later(() => setMessages((m) => m.map((x) => (x.id === id ? { ...x, status: "delivered" as const } : x))), 1100);
      later(() => setMessages((m) => m.map((x) => (x.id === id ? { ...x, status: "read" as const } : x))), 1900);

      if (autoReply && autoReply.messages.length) {
        const reply = autoReply.messages[replyIndex.current % autoReply.messages.length];
        replyIndex.current += 1;
        const delay = autoReply.delay ?? 700;
        const typingFor = autoReply.typingDuration ?? 1500;
        later(() => setTyping(autoReply.author), delay);
        later(() => {
          setTyping(null);
          setMessages((m) => [
            ...m,
            {
              id: nextId(),
              author: autoReply.author,
              content: reply,
              timestamp: Date.now(),
            },
          ]);
        }, delay + typingFor);
      }
    },
    [autoReply, later],
  );

  const react = useCallback((messageId: string, emoji: string) => {
    setMessages((m) =>
      m.map((msg) => {
        if (msg.id !== messageId) return msg;
        const reactions = [...(msg.reactions ?? [])];
        const idx = reactions.findIndex((r) => r.emoji === emoji);
        if (idx === -1) {
          reactions.push({ emoji, count: 1, own: true });
        } else if (reactions[idx].own) {
          if (reactions[idx].count <= 1) reactions.splice(idx, 1);
          else reactions[idx] = { ...reactions[idx], count: reactions[idx].count - 1, own: false };
        } else {
          reactions[idx] = { ...reactions[idx], count: reactions[idx].count + 1, own: true };
        }
        return { ...msg, reactions };
      }),
    );
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return { messages, send, react, clear, typing, setMessages };
}

ChatMessage.displayName = "ChatMessage";
ChatThread.displayName = "ChatThread";
ChatInput.displayName = "ChatInput";
TypingIndicator.displayName = "TypingIndicator";
