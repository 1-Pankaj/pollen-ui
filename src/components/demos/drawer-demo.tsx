"use client";

import { useState } from "react";
import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
} from "pollen-ui";

export function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerClose onOpenChange={setOpen} />
        </DrawerHeader>
        <DrawerBody>
          <p className="mb-3 text-xs font-medium text-faint">Status</p>
          <div className="flex flex-col gap-3">
            <Checkbox defaultChecked>Published</Checkbox>
            <Checkbox defaultChecked>Draft</Checkbox>
            <Checkbox>Archived</Checkbox>
          </div>
          <p className="mb-3 mt-6 text-xs font-medium text-faint">Category</p>
          <div className="flex flex-col gap-3">
            <Checkbox defaultChecked>Marketing site</Checkbox>
            <Checkbox>Documentation</Checkbox>
            <Checkbox>Web app</Checkbox>
          </div>
          <div className="mt-6 flex justify-end gap-2 rounded-xl bg-fill/70 p-2.5">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Reset
            </Button>
            <Button onClick={() => setOpen(false)}>Apply</Button>
          </div>
        </DrawerBody>
      </Drawer>
    </>
  );
}
