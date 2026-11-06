"use client";

import { Dock, IconBell, IconDeploy, IconGauge, IconTerminal, IconTicket } from "pollen-ui";

export function DockDemo({ size = 40, maxScale = 1.6 }: { size?: number; maxScale?: number }) {
  return (
    <Dock
      size={size}
      maxScale={maxScale}
      items={[
        { label: "Deploy", icon: <IconDeploy />, onClick: () => {} },
        { label: "Metrics", icon: <IconGauge />, onClick: () => {} },
        { label: "Tasks", icon: <IconTicket />, onClick: () => {} },
        { label: "Alerts", icon: <IconBell />, onClick: () => {} },
        { label: "Logs", icon: <IconTerminal />, onClick: () => {} },
      ]}
    />
  );
}
