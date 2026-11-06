import type { ReactNode } from "react";
import {
  IconChevronRight as ChevronRight,
  IconDots as MoreHorizontal,
} from "../icons";
import { cn } from "../lib/utils";

export function Breadcrumb({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {children}
      </ol>
    </nav>
  );
}

export function BreadcrumbItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("flex items-center gap-1.5", className)}>{children}</li>
  );
}

export function BreadcrumbLink({
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn("transition-colors duration-150 hover:text-foreground", className)}
      {...props}
    >
      {children}
    </a>
  );
}

export function BreadcrumbPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span aria-current="page" className={cn("font-normal text-foreground", className)}>
      {children}
    </span>
  );
}

export function BreadcrumbSeparator({ className }: { className?: string }) {
  return (
    <li role="presentation" aria-hidden="true" className={cn("text-faint", className)}>
      <ChevronRight className="h-3.5 w-3.5" />
    </li>
  );
}

export function BreadcrumbEllipsis({ className }: { className?: string }) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-5 w-5 items-center justify-center", className)}
    >
      <MoreHorizontal className="h-3.5 w-3.5" />
    </span>
  );
}
