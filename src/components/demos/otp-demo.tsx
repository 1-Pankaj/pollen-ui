"use client";

import { useState } from "react";
import { OTPInput, Badge } from "pollen-ui";

/** Live demo: the badge reports completion, exactly like a real form. */
export function OTPInputDemo() {
  const [code, setCode] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <OTPInput
        length={6}
        value={code}
        onChange={(next) => {
          setCode(next);
          setDone(false);
        }}
        onComplete={() => setDone(true)}
        aria-label="Verification code"
      />
      <Badge variant={done ? "success" : "neutral"} dot>
        {done ? "Code verified" : "Waiting for six digits"}
      </Badge>
    </div>
  );
}
