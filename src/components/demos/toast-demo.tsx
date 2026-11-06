"use client";

import { toast } from "pollen-ui";
import { Button } from "pollen-ui";

export function ToastDemo() {
  const deploy = () =>
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1600)),
      {
        loading: "Deploying pollen-web",
        success: "Deployed to production",
        error: "Deployment failed",
      },
    );

  const pile = () => {
    toast.success("Deployment complete", {
      description: "pollen-web is live on production.",
    });
    setTimeout(
      () =>
        toast("Report queued", {
          description: "We will email you when it is ready.",
        }),
      220,
    );
    setTimeout(
      () =>
        toast.warning("Approaching build limit", {
          description: "9 of 10 builds used this month.",
        }),
      440,
    );
    setTimeout(
      () =>
        toast("Project deleted", {
          description: "You can undo this for the next 30 days.",
          action: { label: "Undo", onClick: () => toast.success("Restored") },
        }),
      660,
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Settings saved", {
            description: "Your changes are live for your team.",
          })
        }
      >
        Save changes
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Project deleted", {
            description: "You can undo this for the next 30 days.",
            action: {
              label: "Undo",
              onClick: () => toast.success("Project restored"),
            },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Upload failed", {
            description: "The file is larger than 50 MB.",
          })
        }
      >
        Error
      </Button>
      <Button variant="outline" onClick={deploy}>
        Promise
      </Button>
      <Button variant="outline" onClick={pile}>
        Fire a pile
      </Button>
    </div>
  );
}
