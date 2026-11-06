"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  Radio,
  RadioGroup,
} from "pollen-ui";

export function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalTitle>Move project</ModalTitle>
          <ModalDescription>
            Choose a workspace for pollen-web. Members keep their access.
          </ModalDescription>
          <ModalClose />
          <RadioGroup
            defaultValue="team"
            aria-label="Workspace"
            className="mt-6"
          >
            <Radio value="personal">Personal</Radio>
            <Radio value="team">Pollen Team</Radio>
            <Radio value="org">Pollen Inc.</Radio>
          </RadioGroup>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Move project</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
