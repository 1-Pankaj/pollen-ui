"use client";

import { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "pollen-ui";

export function DropdownCheckableDemo() {
  const [density, setDensity] = useState("Comfortable");

  return (
    <DropdownMenu
      trigger={
        <Button variant="outline" aria-label="Row density">
          Density: {density}
        </Button>
      }
    >
      <DropdownMenuLabel>Row density</DropdownMenuLabel>
      {["Comfortable", "Compact"].map((option) => (
        <DropdownMenuItem
          key={option}
          selected={density === option}
          onSelect={() => setDensity(option)}
        >
          {option}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
