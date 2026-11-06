"use client";

import { useState } from "react";
import {
  IconArchive as Archive,
  IconArrowUpRight as ArrowUpRight,
  IconCopy as Copy,
  IconExternal as ExternalLink,
  IconFileCode as FileText,
  IconChat as MessageSquare,
  IconTrash as Trash2,
  IconUserPlus as UserPlus,
} from "pollen-ui";
import { Button, Command, type CommandGroup } from "pollen-ui";

export function CommandDemo() {
  const [open, setOpen] = useState(false);

  const groups: CommandGroup[] = [
    {
      heading: "Suggested",
      items: [
        { label: "Copy link", icon: <Copy />, shortcut: ["⌘", "C"] },
        { label: "Open docs", icon: <FileText />, shortcut: ["⌘", "D"] },
        { label: "Invite people", icon: <UserPlus />, shortcut: ["⌘", "I"] },
      ],
    },
    {
      heading: "Project",
      items: [
        { label: "View deployments", icon: <ArrowUpRight /> },
        { label: "Open logs", icon: <ExternalLink /> },
        { label: "Add a comment", icon: <MessageSquare /> },
        { label: "Archive project", icon: <Archive /> },
        { label: "Delete project", icon: <Trash2 /> },
      ],
    },
  ];

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command menu
      </Button>
      <Command
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        placeholder="Type a command or search"
      />
    </>
  );
}
