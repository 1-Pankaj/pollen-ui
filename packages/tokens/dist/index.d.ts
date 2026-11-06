/**
 * @pollen/tokens — the Pollen design language as plain data.
 *
 * One vocabulary shared by the web library (pollen-ui) and the React
 * Native sibling (@pollen/native). There are no runtime dependencies
 * and no platform imports: every value is a string or a number, so the
 * same module runs in a browser, in Node, and inside a React Native
 * bundle.
 *
 * The web stylesheet packages/pollen-ui/src/css/pollen.css is the
 * visual source of truth. The values below mirror it, and
 * scripts/check-tokens-sync.mjs fails when the two drift apart.
 *
 * Shadows are CSS box-shadow strings. React Native cannot read those
 * directly; @pollen/native maps the depths to shadowColor/shadowOffset/
 * shadowOpacity/elevation in one place (src/lib/shadows.ts).
 */
/** Every color a surface can be painted with, in one theme. */
export interface PollenColors {
    /** Page background behind everything. */
    bg: string;
    /** Elevated card surface. */
    card: string;
    /** Quiet fill for inputs, hover states, tracks. */
    fill: string;
    /** One step louder than fill, for hover on filled surfaces. */
    fillStrong: string;
    /** Primary ink. */
    fg: string;
    /** Secondary ink for descriptions. */
    fgMuted: string;
    /** Faintest ink, for placeholders and watermarks. */
    fgFaint: string;
    /** Hairline separators, 7 percent ink. */
    separator: string;
    /** Border token, kept for custom themes that want outlines. */
    border: string;
    /** Louder border token for hoverable outlines. */
    borderStrong: string;
    /** The one accent, used like punctuation. */
    accent: string;
    success: string;
    successInk: string;
    warning: string;
    warningInk: string;
    danger: string;
    dangerInk: string;
    /** Code surfaces stay dark in both themes. */
    codeBg: string;
    codeFg: string;
    codeMuted: string;
}
/** Elevation depths. One tight contact layer, one wide depth layer. */
export interface PollenShadows {
    xs: string;
    sm: string;
    md: string;
    lg: string;
}
export interface PollenTheme {
    colors: PollenColors;
    shadows: PollenShadows;
}
export declare const light: PollenTheme;
export declare const dark: PollenTheme;
/**
 * Corner radii, in pixels, matching the values the web components use:
 * 9/10/11 are the three field sizes, 12 is the command-icon radius,
 * 16 is the panel radius.
 */
export declare const radius: {
    readonly fieldSm: 9;
    readonly fieldMd: 10;
    readonly fieldLg: 11;
    readonly control: 12;
    readonly panel: 16;
    readonly full: 9999;
};
/**
 * The spacing step used across the components, in pixels.
 * Tailwind's 4px grid.
 */
export declare const spacing: {
    readonly xxs: 2;
    readonly xs: 4;
    readonly sm: 8;
    readonly md: 12;
    readonly lg: 16;
    readonly xl: 20;
    readonly xxl: 24;
};
/**
 * Type sizes the field and display components use, in pixels:
 * captions (helper lines), labels, small controls, and body text.
 */
export declare const fontSize: {
    readonly caption: 12.5;
    readonly label: 13;
    readonly small: 14;
    readonly body: 15;
};
/**
 * Motion presets. Springs are plain stiffness/damping/mass objects:
 * framer-motion accepts them as Transition, react-native-reanimated
 * accepts them as SpringConfig. Entrances are ease-out and never
 * longer than max.
 */
export declare const springSoft: {
    stiffness: number;
    damping: number;
    mass: number;
};
export declare const springSnappy: {
    stiffness: number;
    damping: number;
};
export declare const springGentle: {
    stiffness: number;
    damping: number;
};
export declare const easeOut: readonly [0.21, 0.47, 0.32, 0.98];
export declare const durations: {
    readonly fast: 0.15;
    readonly entrance: 0.3;
};
/** Every token under one object for quick passthrough. */
export declare const pollen: {
    readonly light: PollenTheme;
    readonly dark: PollenTheme;
    readonly radius: {
        readonly fieldSm: 9;
        readonly fieldMd: 10;
        readonly fieldLg: 11;
        readonly control: 12;
        readonly panel: 16;
        readonly full: 9999;
    };
    readonly spacing: {
        readonly xxs: 2;
        readonly xs: 4;
        readonly sm: 8;
        readonly md: 12;
        readonly lg: 16;
        readonly xl: 20;
        readonly xxl: 24;
    };
    readonly fontSize: {
        readonly caption: 12.5;
        readonly label: 13;
        readonly small: 14;
        readonly body: 15;
    };
    readonly springSoft: {
        stiffness: number;
        damping: number;
        mass: number;
    };
    readonly springSnappy: {
        stiffness: number;
        damping: number;
    };
    readonly springGentle: {
        stiffness: number;
        damping: number;
    };
    readonly easeOut: readonly [0.21, 0.47, 0.32, 0.98];
    readonly durations: {
        readonly fast: 0.15;
        readonly entrance: 0.3;
    };
};
