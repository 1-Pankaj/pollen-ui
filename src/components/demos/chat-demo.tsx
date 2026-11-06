"use client";

import {
  ChatInput,
  ChatThread,
  useChat,
  type ChatAuthor,
} from "pollen-ui";

const AVA: ChatAuthor = {
  name: "Ava Chen",
  avatar: "/avatars/mia.jpg",
};

/** Live chat: sends through the full delivery lifecycle, the other
    side types back, and every message accepts reactions. Seed
    timestamps sit on a fixed epoch so server and client render the
    exact same strings on first paint. */
const SEED_BASE = Date.UTC(2026, 0, 15, 10, 38, 0);
const MIN = 60_000;

export function ChatDemo({ className }: { className?: string }) {
  const chat = useChat({
    seed: [
      {
        id: "seed-1",
        author: AVA,
        content: "Morning! The stacked toasts just landed in the review.",
        timestamp: SEED_BASE - 9 * MIN,
      },
      {
        id: "seed-2",
        author: { name: "You" },
        content: "Saw it. The pile physics feel great.",
        timestamp: SEED_BASE - 7 * MIN,
        own: true,
        status: "read",
        reactions: [{ emoji: "🔥", count: 1, own: true }],
      },
      {
        id: "seed-3",
        author: AVA,
        content: "Wait until you try slide to confirm. Very satisfying.",
        timestamp: SEED_BASE - 6 * MIN,
        reactions: [{ emoji: "👍", count: 2 }],
      },
    ],
    autoReply: {
      author: AVA,
      messages: [
        "Shipped. The stacked toasts are my favorite part.",
        "Nice. Did the reaction bursts land in the review?",
        "Ha, the bot just got a reaction before I could type.",
        "Try the slide to confirm after this. Very satisfying.",
        "Open source is undefeated.",
      ],
    },
  });

  return (
    <div
      className={
        className ??
        "flex h-[440px] w-full max-w-[440px] flex-col overflow-hidden rounded-3xl bg-card shadow-[var(--pollen-shadow-lg)]"
      }
    >
      <div className="flex items-center gap-3 border-none px-4 pb-3 pt-4">
        <img
          src={AVA.avatar}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-tight text-foreground">{AVA.name}</p>
          <p className="text-[12.5px] leading-tight text-faint">Product engineer</p>
        </div>
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Online
        </span>
      </div>
      <div className="h-px w-full bg-[var(--pollen-border)]" />
      <ChatThread
        messages={chat.messages}
        typing={chat.typing ? { name: chat.typing.name, avatar: chat.typing.avatar } : null}
        onReact={chat.react}
        emptyState={
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <p className="text-[15px] font-medium text-foreground">Say something</p>
            <p className="max-w-[240px] text-[13.5px] leading-relaxed text-faint">
              Ava replies on her own clock. Hover a bubble to react
              on desktop, tap one on touch.
            </p>
          </div>
        }
      />
      <ChatInput onSend={chat.send} placeholder="Message Ava" maxLength={280} />
    </div>
  );
}
