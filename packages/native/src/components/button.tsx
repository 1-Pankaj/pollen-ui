import { forwardRef, type ComponentRef, type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { fontSize, radius, spacing, type PollenTheme } from "@pollen-ui/tokens";
import { usePollenTheme, white } from "../lib/theme";
import { mapShadow, type ShadowDepth } from "../lib/shadows";
import { springSnappyConfig } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<PressableProps, "children"> {
  /** Label content. A string or element; the web render-prop form is not carried over. */
  children?: ReactNode;
  /** Visual weight. Primary is the single high-contrast action on a view. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner in the ink color, keeps the label readable, and disables interaction. */
  loading?: boolean;
  /** Swaps the label while loading. Falls back to children when unset. */
  loadingText?: string;
  /** Content rendered before the label. Size it yourself; native has no icon slot sizing. */
  leftIcon?: ReactNode;
  /** Content rendered after the label. */
  rightIcon?: ReactNode;
  /** Stretches the button to fill its container width. */
  fullWidth?: boolean;
  /**
   * NativeWind passthrough, forwarded to the pressable root. The
   * component is fully styled without it (StyleSheet + tokens).
   */
  className?: string;
}

const sizeStyles: Record<
  ButtonSize,
  {
    height: number;
    paddingHorizontal: number;
    borderRadius: number;
    fontSize: number;
    gap: number;
  }
> = {
  sm: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radius.fieldSm,
    fontSize: fontSize.label,
    gap: spacing.xs,
  },
  md: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: radius.fieldMd,
    fontSize: fontSize.body,
    gap: spacing.sm,
  },
  lg: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: radius.fieldLg,
    fontSize: fontSize.body,
    gap: spacing.sm,
  },
};

interface VariantLook {
  bg: (theme: PollenTheme) => string;
  ink: (theme: PollenTheme) => string;
  shadow: ShadowDepth | null;
  border: ((theme: PollenTheme) => string) | null;
}

const variantLooks: Record<ButtonVariant, VariantLook> = {
  primary: {
    bg: (t) => t.colors.accent,
    ink: () => white,
    shadow: "xs",
    border: null,
  },
  secondary: {
    bg: (t) => t.colors.fill,
    ink: (t) => t.colors.fg,
    shadow: null,
    border: null,
  },
  outline: {
    bg: (t) => t.colors.card,
    ink: (t) => t.colors.fg,
    shadow: null,
    border: (t) => t.colors.border,
  },
  ghost: {
    bg: () => "transparent",
    ink: (t) => t.colors.fg,
    shadow: null,
    border: null,
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableRef = ComponentRef<typeof Pressable>;

/**
 * The primary way to trigger an action, matching the web
 * Button. Presses scale to 0.97 on a snappy spring so the button
 * visibly responds the moment it is touched, and settle to 80%
 * opacity while held. Loading replaces the leading slot with a
 * spinner in the ink color, like the web spinner does.
 *
 * Divergence from the web library: the native set carries the four
 * structural variants (primary is the accent-colored action, as on
 * the web "accent" variant); hover treatments do not apply on touch,
 * and press feedback is a scale rather than the web's active scale
 * on hover-capable pointers.
 */
export const Button = forwardRef<PressableRef, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth,
    disabled,
    onPressIn,
    onPressOut,
    children,
    className,
    ...props
  },
  ref,
) {
  const theme = usePollenTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const press = useSharedValue(0);

  const locked = disabled === true || loading === true;
  const look = variantLooks[variant];
  const s = sizeStyles[size];

  const setPressed = (down: boolean) => {
    if (reduceMotion) {
      scale.value = down ? 0.97 : 1;
      press.value = down ? 1 : 0;
      return;
    }
    scale.value = withSpring(down ? 0.97 : 1, springSnappyConfig);
    press.value = withSpring(down ? 1 : 0, springSnappyConfig);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(press.value, [0, 1], [1, 0.8]) * (locked ? 0.5 : 1),
  }));

  const label = loading && loadingText !== undefined ? loadingText : children;
  const ink = look.ink(theme);

  return (
    <AnimatedPressable
      ref={ref}
      {...props}
      {...passthroughClassName(className)}
      accessibilityRole="button"
      accessibilityState={{ disabled: locked, busy: loading || undefined }}
      disabled={locked}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      style={[
        styles.base,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.borderRadius,
          gap: s.gap,
          backgroundColor: look.bg(theme),
          borderColor: look.border ? look.border(theme) : "transparent",
        },
        look.border === null && styles.noBorder,
        look.shadow !== null && mapShadow(theme.shadows, look.shadow),
        fullWidth && styles.fullWidth,
        animatedStyle,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={ink} /> : leftIcon}
      {label != null && (
        <Text style={[styles.label, { color: ink, fontSize: s.fontSize }]}>
          {label}
        </Text>
      )}
      {rightIcon}
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  noBorder: {
    borderWidth: 0,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontWeight: "500",
  },
});

Button.displayName = "Button";
