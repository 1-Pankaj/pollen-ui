"use client";

import { Button, ToastPileProvider, useToastPile } from "pollen-ui";

/**
 * The controlled pile: a ToastPileProvider scoped to your own tree,
 * driven through useToastPile instead of the global toast bus.
 */
function PileControls() {
  const { pile } = useToastPile();

  const fire = () => {
    pile({
      title: "Report queued",
      description: "We will email you when it is ready.",
      duration: 6000,
    });
    setTimeout(
      () =>
        pile({
          title: "Deployment complete",
          description: "pollen-web is live on production.",
          variant: "success",
          duration: 6000,
        }),
      240,
    );
    setTimeout(
      () =>
        pile({
          title: "Upload failed",
          description: "The file is larger than 50 MB.",
          variant: "danger",
          duration: 6000,
        }),
      480,
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button variant="outline" onClick={fire}>
        Fire a pile
      </Button>
    </div>
  );
}

export function ToastPileControlledDemo() {
  return (
    <ToastPileProvider>
      <PileControls />
    </ToastPileProvider>
  );
}
