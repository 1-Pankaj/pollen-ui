"use client";

import { SlideToConfirm, toast } from "pollen-ui";

export function SlideConfirmDemo() {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <SlideToConfirm
        className="w-full max-w-[360px]"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 1400));
          toast.success("pollen-web deleted", { description: "Recovery window: 30 days." });
        }}
      />
      <SlideToConfirm
        size="sm"
        className="w-full max-w-[360px]"
        label="Slide to publish"
        successLabel="Published"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 900));
          toast.success("Post published");
        }}
      />
    </div>
  );
}

export function SlideConfirmWideDemo() {
  return (
    <SlideToConfirm
      className="w-full"
      onConfirm={async () => {
        await new Promise((r) => setTimeout(r, 1300));
        toast.success("Staging environment torn down", {
          description: "Rebuild it any time from the dashboard.",
        });
      }}
    />
  );
}

export function SlideConfirmToneDemo() {
  return (
    <SlideToConfirm
      tone="danger"
      label="Slide to delete"
      successLabel="Deleted"
      className="w-full max-w-[360px]"
      onConfirm={async () => {
        await new Promise((r) => setTimeout(r, 1200));
        toast.success("pollen-web deleted", { description: "Recovery window: 30 days." });
      }}
    />
  );
}
