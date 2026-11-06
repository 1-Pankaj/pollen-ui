"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  Textarea,
} from "pollen-ui";

type ModalSize = "sm" | "md" | "lg";

/** Docs demo: the three modal widths, each with fitting content. */
export function ModalSizesDemo() {
  const [size, setSize] = useState<ModalSize | null>(null);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button variant="outline" size="sm" onClick={() => setSize("sm")}>
          Small
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSize("md")}>
          Medium
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSize("lg")}>
          Large
        </Button>
      </div>

      <Modal
        open={size !== null}
        onOpenChange={(o) => !o && setSize(null)}
        size={size ?? "md"}
      >
        <ModalContent>
          <ModalTitle>
            {size === "sm" && "Remove member"}
            {size === "md" && "Move project"}
            {size === "lg" && "Invite to workspace"}
          </ModalTitle>
          <ModalDescription>
            {size === "sm" &&
              "radia@pollen.dev will lose access to pollen-web and its deployments. This cannot be undone."}
            {size === "md" &&
              "Choose a workspace for pollen-web. Members keep their access."}
            {size === "lg" &&
              "They will get an email with a link to join pollen-web. You can set their role after they accept."}
          </ModalDescription>
          {size === "lg" && (
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-email">Email address</Label>
                <Input id="invite-email" placeholder="radia@pollen.dev" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-note">Welcome note</Label>
                <Textarea id="invite-note" rows={3} placeholder="Optional message" />
              </div>
            </div>
          )}
          <ModalClose />
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSize(null)}>
              Cancel
            </Button>
            <Button
              variant={size === "sm" ? "destructive" : "primary"}
              onClick={() => setSize(null)}
            >
              {size === "sm" ? "Remove member" : size === "md" ? "Move project" : "Send invite"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
