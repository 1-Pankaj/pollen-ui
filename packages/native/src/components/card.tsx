import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { fontSize, radius, spacing } from "@pollen/tokens";
import { usePollenTheme } from "../lib/theme";
import { mapShadow } from "../lib/shadows";
import { passthroughClassName } from "../lib/className";

export type CardDepth = "none" | "sm" | "md" | "lg";

export interface CardProps {
  children?: ReactNode;
  /** Elevation depth, mapped through the same shadow tokens as the web. */
  depth?: CardDepth;
  /** Quiet fill instead of the card surface, for cards on cards. */
  variant?: "card" | "fill";
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the surface. */
  className?: string;
}

/**
 * The card surface, matching the web: one rounded panel
 * that reads the theme's card color and elevation. The web Card
 * composes from CardHeader / CardTitle / CardContent / CardFooter
 * with margin utilities; the native kit ships the same four parts
 * with token spacing so the rhythm matches the web without
 * Tailwind.
 *
 * Divergence from the web library: borders are 1px hairlines in
 * both themes (the web relies on shadows alone in light mode;
 * native elevations render differently per platform, and the
 * hairline keeps surfaces legible on both).
 */
export function Card({
  children,
  depth = "md",
  variant = "card",
  style,
  className,
}: CardProps) {
  const theme = usePollenTheme();
  return (
    <View
      {...passthroughClassName(className)}
      style={[
        styles.card,
        {
          backgroundColor:
            variant === "fill" ? theme.colors.fill : theme.colors.card,
          borderColor: theme.colors.border,
        },
        depth !== "none" ? mapShadow(theme.shadows, depth) : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export interface CardSectionProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the section. */
  className?: string;
}

/** The top block: title, subtitle, meta. No bottom padding by design. */
export function CardHeader({ children, style, className }: CardSectionProps) {
  return (
    <View {...passthroughClassName(className)} style={[styles.header, style]}>
      {children}
    </View>
  );
}

export interface CardTitleProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the text. */
  className?: string;
}

/** The heading line. accessibilityRole="header" so the rotor lists it. */
export function CardTitle({ children, style, className }: CardTitleProps) {
  const theme = usePollenTheme();
  return (
    <Text
      {...passthroughClassName(className)}
      accessibilityRole="header"
      style={[styles.title, { color: theme.colors.fg }, style]}
    >
      {children}
    </Text>
  );
}

/** Quiet one-liner under the title. */
export function CardDescription({ children, style, className }: CardTitleProps) {
  const theme = usePollenTheme();
  return (
    <Text
      {...passthroughClassName(className)}
      style={[styles.description, { color: theme.colors.fgMuted }, style]}
    >
      {children}
    </Text>
  );
}

/** The body block. */
export function CardContent({ children, style, className }: CardSectionProps) {
  return (
    <View {...passthroughClassName(className)} style={[styles.content, style]}>
      {children}
    </View>
  );
}

/** The bottom block: actions, meta, footnotes. Pushed to the end. */
export function CardFooter({ children, style, className }: CardSectionProps) {
  return (
    <View {...passthroughClassName(className)} style={[styles.footer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.panel,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    alignSelf: "stretch",
  },
  header: {
    gap: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  description: {
    fontSize: fontSize.label,
    lineHeight: 18,
  },
  content: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
