import type { ReactNode } from "react";
import { DocsMobileNav, DocsSidebar } from "@/components/site/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-0 px-4 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <DocsSidebar />
      <div className="min-w-0 py-10 lg:py-12 lg:pl-14">
        <div className="mb-8 lg:hidden">
          <DocsMobileNav />
        </div>
        {children}
      </div>
    </div>
  );
}
