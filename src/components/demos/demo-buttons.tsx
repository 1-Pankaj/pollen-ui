"use client";

import { useState } from "react";
import { Button, toast, IconDeploy as Rocket } from "pollen-ui";

/**
 * Home page tile: buttons with the deep features in the open -
 * icon slots, an async action that swaps its own label while it
 * runs, and a completion toast with an action button.
 */
export function DemoButtons() {
  const [deploying, setDeploying] = useState(false);

  const deploy = () => {
    setDeploying(true);
    window.setTimeout(() => {
      setDeploying(false);
      toast.success("Deployment complete", {
        description: "pollen-web is live on production.",
        action: { label: "View logs", onClick: () => toast("Log stream opened") },
      });
    }, 1600);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button
        leftIcon={<Rocket />}
        loading={deploying}
        loadingText="Deploying"
        onClick={deploy}
      >
        Deploy project
      </Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  );
}
