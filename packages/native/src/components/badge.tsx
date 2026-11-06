import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { usePollenTheme, white, withAlpha } from "../lib/theme";
import { passthroughClassName } from "../lib/className";

export type BadgeVariant =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "solid";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  /** Control height and type size. */
  size?: BadgeSize;
  /** Precedes the label with a small static status dot in the variant color. */
  dot?: boolean;
  /** Render as a notification counter with overflow, e.g. 99+. */
  count?: number;
  /** Where the counter switches to `${max}+`. Default 99. */
  max?: number;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the root view. */
  className?: string;
}

/**
 * Status label, matching the web Badge: tinted fill with a
 * darker ink per semantic variant, an optional leading status dot,
 * and the notification counter mode with overflow ("99+"), which is
 * the same View+Text bubble on native. Keep the copy to one or two
 * words.
 *
 * Divergence from the web library: the dismissible close button and
 * the hover light sweep are web-only (hover does not exist on touch)
 * and are not carried over.
 */

interface BadgeLook {
  bg: string;
  ink: string;
  dot: string;
}

const sizeStyles: Record<
  BadgeSize,
  {
    height: number;
    paddingHorizontal: number;
    fontSize: number;
    gap: number;
    dotSize: number;
  }
> = {
  sm: { height: 19, paddingHorizontal: 8, fontSize: 10.5, gap: 4, dotSize: 4 },
  md: { height: 22, paddingHorizontal: 10, fontSize: 12, gap: 6, dotSize: 5 },
  lg: { height: 26, paddingHorizontal: 12, fontSize: 13, gap: 8, dotSize: 6 },
};

const counterSizeStyles: Record<
  BadgeSize,
  { height: number; minWidth: number; paddingHorizontal: number; fontSize: number }
> = {
  sm: { height: 16, minWidth: 16, paddingHorizontal: 4, fontSize: 9.5 },
  md: { height: 18, minWidth: 18, paddingHorizontal: 4, fontSize: 10.5 },
  lg: { height: 20, minWidth: 20, paddingHorizontal: 6, fontSize: 11.5 },
};

export function Badge({
  variant = "neutral",
  size = "md",
  dot,
  count,
  max = 99,
  children,
  style,
  className,
}: BadgeProps) {
  const theme = usePollenTheme();
  const s = sizeStyles[size];
  const c = theme.colors;

  const looks: Record<BadgeVariant, BadgeLook> = {
    neutral: { bg: c.fill, ink: c.fgMuted, dot: withAlpha(c.fgMuted, 0.6) },
    accent: { bg: withAlpha(c.accent, 0.1), ink: c.accent, dot: c.accent },
    success: { bg: withAlpha(c.success, 0.1), ink: c.successInk, dot: c.success },
    warning: { bg: withAlpha(c.warning, 0.15), ink: c.warningInk, dot: c.warning },
    danger: { bg: withAlpha(c.danger, 0.1), ink: c.dangerInk, dot: c.danger },
    solid: { bg: c.fg, ink: c.bg, dot: c.bg },
  };
  const look = looks[variant];

  /* Counter mode: a compact numeric bubble, no room for labels. */
  if (count !== undefined) {
    const cs = counterSizeStyles[size];
    const label = count > max ? `${max}+` : String(count);
    return (
      <View
        {...passthroughClassName(className)}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${label} unread`}
        style={[
          styles.counter,
          {
            height: cs.height,
            minWidth: cs.minWidth,
            paddingHorizontal: cs.paddingHorizontal,
            backgroundColor: c.accent,
          },
          style,
        ]}
      >
        <Text
          style={{
            color: white,
            fontSize: cs.fontSize,
            fontWeight: "600",
            fontVariant: ["tabular-nums"],
          }}
        >
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View
      {...passthroughClassName(className)}
      style={[
        styles.badge,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          gap: s.gap,
          backgroundColor: look.bg,
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={{
            width: s.dotSize,
            height: s.dotSize,
            borderRadius: s.dotSize / 2,
            backgroundColor: look.dot,
          }}
        />
      )}
      <Text style={{ color: look.ink, fontSize: s.fontSize, fontWeight: "500" }}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 9999,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: 9999,
  },
});

Badge.displayName = "Badge";
