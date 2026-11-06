import type { ReactNode } from "react";

export interface Demo {
  title: string;
  /** The exact code a user would paste to reproduce the demo. */
  code: string;
  component: ReactNode;
  /** Preview pane alignment. Wide content should stretch. */
  align?: "center" | "stretch";
}

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/** One row of the keyboard interactions table. */
export interface KeyboardRow {
  /** Key or key combination, e.g. "Arrow Down" or "Shift + Enter". */
  keys: string;
  action: string;
}

/** One row of controls in the playground's Props pane. */
export type PlaygroundControl =
  | {
      kind: "select";
      prop: string;
      label: string;
      options: { value: string; label: string }[];
    }
  | { kind: "boolean"; prop: string; label: string; /** Literal attribute emitted when true, e.g. icon={<Search />}. */ attr?: string }
  | { kind: "text"; prop: string; label: string; placeholder?: string }
  | { kind: "number"; prop: string; label: string; min?: number; max?: number; step?: number };

export interface PlaygroundSpec {
  /** Snippet kind: the wrapper is generated for you. */
  component: string;
  /** Initial prop values, kept in sync with the controls. */
  values: Record<string, string | boolean | number>;
  /** Which controls render, in order. */
  controls: PlaygroundControl[];
  /** Extra named imports the generated snippet needs, e.g. "IconSearch as Search". */
  imports?: string[];
  /**
   * Code injected between the imports and the demo function: sample
   * data constants that props like `data` reference. Real code, not a
   * placeholder - it compiles and renders in the sandbox.
   */
  prelude?: string;
  /**
   * Literal attributes appended verbatim to the generated element,
   * for props that are not user-facing controls, e.g. "data={data}"
   * referencing the prelude constant.
   */
  attrs?: string;
}

export interface RegistryEntry {
  slug: string;
  title: string;
  description: string;
  demos: Demo[];
  props?: PropRow[];
  /** Verified keyboard behaviour. Omitted for pointer-only components. */
  keyboard?: KeyboardRow[];
  /** When present, the embedded playground gets a live Props pane. */
  playground?: PlaygroundSpec;
}
