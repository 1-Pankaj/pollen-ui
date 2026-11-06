"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "pollen-ui";

/**
 * The playground ships its own editor and compiler, so it is
 * loaded on demand. The homepage stays light and the sandbox
 * appears with a skeleton first.
 */
const Playground = dynamic(
  () => import("./playground").then((mod) => mod.Playground),
  {
    ssr: false,
    loading: () => (
      <div className="overflow-hidden rounded-[20px] bg-card shadow-[var(--pollen-shadow-md)]">
        <div className="flex items-center gap-2 bg-fill/60 px-4 py-3">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="ml-auto h-8 w-24 rounded-[10px]" />
        </div>
        <div className="grid lg:grid-cols-2">
          <div className="min-h-[380px] p-6">
            <Skeleton className="h-3 w-28" />
            <div className="mt-5 space-y-2.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
          <div className="flex min-h-[380px] items-center justify-center bg-fill/40">
            <Skeleton className="h-10 w-36 rounded-[10px]" />
          </div>
        </div>
      </div>
    ),
  },
);

export default Playground;
