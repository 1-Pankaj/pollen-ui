"use client";

/**
 * Everything user code can import inside the playground.
 *
 * User code is transpiled with Sucrase and evaluated with a
 * require shim, so `import { Button } from "pollen-ui"` and
 * `import { useState } from "react"` work exactly like they do
 * in a real project. Icons come from Pollen's own set; the
 * familiar lucide names are aliased so existing snippets keep
 * running, and the full list is documented on the page.
 */

import * as React from "react";
import { Fragment as JsxFragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import * as PollenUI from "pollen-ui";
import {
  IconArrowRight as ArrowRight,
  IconBell as Bell,
  IconCheck as Check,
  IconCircleCheck as CheckCircle2,
  IconChevronDown as ChevronDown,
  IconChevronRight as ChevronRight,
  IconAlert as CircleAlert,
  IconCopy as Copy,
  IconCard as CreditCard,
  IconDownload as Download,
  IconExternal as ExternalLink,
  IconEye as Eye,
  IconGithub as Github,
  IconHeart as Heart,
  IconInfo as Info,
  IconLayers as Layers,
  IconLoader as Loader2,
  IconLock as Lock,
  IconMail as Mail,
  IconMinus as Minus,
  IconMoon as Moon,
  IconPackage as Package,
  IconPencil as Pencil,
  IconPlus as Plus,
  IconDeploy as Rocket,
  IconSearch as Search,
  IconSettings as Settings,
  IconPetal as Star,
  IconSun as Sun,
  IconTrash as Trash2,
  IconTrend as TrendingUp,
  IconUser as User,
  IconUsers as Users,
  IconClose as X,
  IconBolt as Zap,
} from "pollen-ui";

export const reactScope = {
  __esModule: true,
  default: React,
  ...React,
  Fragment: React.Fragment,
};

export const iconsScope = {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  Github,
  Heart,
  Info,
  Layers,
  Loader2,
  Lock,
  Mail,
  Minus,
  Moon,
  Package,
  Pencil,
  Plus,
  Rocket,
  Search,
  Settings,
  Star,
  Sun,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
};

export const motionScope = {
  AnimatePresence,
  animate,
  motion,
  useInView,
};

export const jsxRuntimeScope = {
  Fragment: JsxFragment,
  jsx,
  jsxs,
};

export const pollenScope = PollenUI;

export function resolveRequire(name: string): Record<string, unknown> {
  switch (name) {
    case "react":
      return reactScope;
    case "react/jsx-runtime":
    case "react/jsx-dev-runtime":
      return jsxRuntimeScope;
    case "pollen-ui":
      return pollenScope;
    case "lucide-react":
      return iconsScope;
    case "framer-motion":
      return motionScope;
    default:
      throw new Error(
        `Module "${name}" is not available in the playground. Try "react", "pollen-ui", "lucide-react" (aliased to Pollen icons) or "framer-motion".`,
      );
  }
}
