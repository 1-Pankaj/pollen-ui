"use client";

import { Button, toast } from "pollen-ui";

/** Home page tile: fires real toasts so motion can be judged live. */
export function FireToast() {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <Button
        size="sm"
        onClick={() =>
          toast.success("Deployment complete", {
            description: "pollen-web is live on production.",
            action: {
              label: "View logs",
              onClick: () => toast("Log stream opened"),
            },
          })
        }
      >
        Deploy pollen-web
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast("Report queued", {
            description: "We will email you when it is ready.",
          })
        }
      >
        Queue report
      </Button>
    </div>
  );
}
