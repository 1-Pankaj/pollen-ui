"use client";

import { DataTable } from "pollen-ui";

const members = [
  { name: "Ada Lovelace", role: "Owner", seats: 24, plan: "Enterprise" },
  { name: "Grace Hopper", role: "Admin", seats: 12, plan: "Pro" },
  { name: "Alan Turing", role: "Developer", seats: 3, plan: "Hobby" },
  { name: "Katherine Johnson", role: "Developer", seats: 8, plan: "Pro" },
  { name: "Margaret Hamilton", role: "Admin", seats: 16, plan: "Pro" },
  { name: "Radia Perlman", role: "Developer", seats: 5, plan: "Hobby" },
];

/** Docs demo: click a header to sort. Seats starts descending. */
export function DataTableDemo() {
  return (
    <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-md)]">
      <DataTable
        rows={members}
        getRowId={(m) => m.name}
        initialSort={{ key: "seats", dir: "desc" }}
        columns={[
          {
            key: "name",
            header: "Name",
            sortable: true,
            value: (m) => m.name,
            cell: (m) => <span className="font-medium">{m.name}</span>,
          },
          {
            key: "role",
            header: "Role",
            value: (m) => m.role,
            cell: (m) => <span className="text-muted-foreground">{m.role}</span>,
          },
          {
            key: "seats",
            header: "Seats",
            sortable: true,
            align: "right",
            value: (m) => m.seats,
            cell: (m) => (
              <span className="font-mono text-[13px] tabular-nums text-muted-foreground">
                {m.seats}
              </span>
            ),
          },
          {
            key: "plan",
            header: "Plan",
            sortable: true,
            align: "right",
            value: (m) => m.plan,
            cell: (m) => <span className="text-muted-foreground">{m.plan}</span>,
          },
        ]}
      />
    </div>
  );
}
