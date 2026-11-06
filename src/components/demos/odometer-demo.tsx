"use client";

import { useState } from "react";
import { Button, Odometer } from "pollen-ui";

const TARGETS = [24680, 90210, 51204, 73911];

export function OdometerDemo() {
  const [i, setI] = useState(0);
  return (
    <div className="flex flex-col items-center gap-5">
      <Odometer value={TARGETS[i % TARGETS.length]} digits={5} separator="," />
      <Button variant="secondary" size="sm" onClick={() => setI((v) => v + 1)}>
        Roll the counter
      </Button>
    </div>
  );
}
