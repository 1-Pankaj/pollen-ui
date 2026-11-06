import { Children, useState, type ReactNode } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { radius, type PollenTheme } from "@pollen/tokens";
import { usePollenTheme, white } from "../lib/theme";
import { passthroughClassName } from "../lib/className";

export type AvatarStatus = "online" | "away" | "busy" | "offline";
export type AvatarVariant = "fill" | "accent" | "inverted";
export type AvatarShape = "circle" | "square";

export interface AvatarProps {
  /** Remote image source. */
  src?: string;
  /** Accessibility label for the image. */
  alt?: string;
  /** Shown when the image is missing or fails. Usually a name; initials are derived. */
  fallback?: string;
  /** Diameter in pixels. */
  size?: number;
  /** Presence dot in the lower right. Static, never animated. */
  status?: AvatarStatus;
  /**
   * Treatment of the initials fallback. "fill" is the quiet default,
   * "accent" puts the house accent behind white ink, "inverted" is
   * the high-contrast negative. Images ignore this.
   */
  variant?: AvatarVariant;
  /** "circle" (default) or "square" (rounded, card-style corners). */
  shape?: AvatarShape;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the wrapper. */
  className?: string;
}

const statusColor: Record<AvatarStatus, (theme: PollenTheme) => string> = {
  online: (t) => t.colors.success,
  away: (t) => t.colors.warning,
  busy: (t) => t.colors.danger,
  offline: (t) => t.colors.fgFaint,
};

/**
 * Avatar with an image, an initials fallback and a presence dot,
 * matching the web Avatar. Initials are derived the same way
 * (first two words, first grapheme of each, so names outside the
 * basic multilingual plane survive), the failure flag resets when
 * the source changes, and the status dot is static. Square shape
 * uses the control radius token, matching the web rounded-xl.
 */
export function Avatar({
  src,
  alt,
  fallback = "",
  size = 32,
  status,
  variant = "fill",
  shape = "circle",
  style,
  className,
}: AvatarProps) {
  const theme = usePollenTheme();
  const [failed, setFailed] = useState(false);
  // A new src is a new chance to load: reset the failure flag during
  // render when the source changes, or a swapped-in photo stays a
  // fallback forever.
  const [lastSrc, setLastSrc] = useState(src);
  if (src !== lastSrc) {
    setLastSrc(src);
    setFailed(false);
  }

  const showImage = src !== undefined && src.length > 0 && !failed;
  const dotSize = Math.min(14, Math.max(9, Math.round(size * 0.3)));
  const dotOffset = Math.max(1, Math.round(dotSize * 0.12));
  const shapeRadius = shape === "circle" ? radius.full : radius.control;

  const variantStyle = (): { bg: string; ink: string } => {
    if (variant === "accent") return { bg: theme.colors.accent, ink: white };
    if (variant === "inverted") return { bg: theme.colors.fg, ink: theme.colors.bg };
    return { bg: theme.colors.fill, ink: theme.colors.fgMuted };
  };
  const look = variantStyle();

  return (
    <View
      {...passthroughClassName(className)}
      accessible
      accessibilityLabel={alt ?? (status !== undefined ? status : undefined)}
      style={[styles.wrap, { width: size, height: size }, style]}
    >
      <View
        style={[
          styles.body,
          {
            borderRadius: shapeRadius,
            backgroundColor: look.bg,
          },
        ]}
      >
        {showImage ? (
          <Image
            source={{ uri: src }}
            style={styles.image}
            resizeMode="cover"
            fadeDuration={0}
            onError={() => setFailed(true)}
            accessible
            accessibilityLabel={alt ?? ""}
          />
        ) : (
          <Text
            style={[
              styles.initials,
              {
                color: look.ink,
                fontSize: Math.max(10, Math.round(size / 2.8)),
              },
            ]}
          >
            {initialsOf(fallback)}
          </Text>
        )}
      </View>
      {status !== undefined && (
        <View
          style={[
            styles.statusDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              right: -dotOffset,
              bottom: -dotOffset,
              borderColor: theme.colors.card,
              backgroundColor: statusColor[status](theme),
            },
          ]}
        />
      )}
    </View>
  );
}

export interface AvatarGroupProps {
  children: ReactNode;
  /** Collapse to this many avatars, showing +N for the rest. */
  max?: number;
  /** Diameter of the avatars and the +N overflow chip. */
  size?: number;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the row. */
  className?: string;
}

/**
 * Overlapping avatar row with a +N overflow chip. Each item carries a
 * ring of the card surface so overlaps stay legible, matching the web
 * AvatarGroup; override with the shared surface tokens when the row
 * sits on the page background.
 */
export function AvatarGroup({
  children,
  max,
  size = 32,
  style,
  className,
}: AvatarGroupProps) {
  const theme = usePollenTheme();
  const items = Children.toArray(children);
  const visible = max !== undefined ? items.slice(0, max) : items;
  const overflow = items.length - visible.length;

  return (
    <View {...passthroughClassName(className)} style={[styles.row, style]}>
      {visible.map((child, index) => (
        <View
          key={index}
          style={[
            styles.ring,
            {
              backgroundColor: theme.colors.card,
              marginLeft: index === 0 ? 0 : -12,
            },
          ]}
        >
          {child}
        </View>
      ))}
      {overflow > 0 && (
        <View
          style={[
            styles.ring,
            {
              backgroundColor: theme.colors.card,
              marginLeft: visible.length === 0 ? 0 : -12,
            },
          ]}
        >
          <View
            style={[
              styles.chip,
              {
                width: size,
                height: size,
                borderRadius: radius.full,
                backgroundColor: theme.colors.fill,
              },
            ]}
          >
            <Text
              style={[
                styles.initials,
                {
                  color: theme.colors.fgMuted,
                  fontSize: Math.max(10, Math.round(size / 2.8)),
                },
              ]}
            >
              +{overflow}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

/** First grapheme of each of the first two words, uppercase. */
function initialsOf(fallback: string) {
  const parts = fallback.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => Array.from(p)[0]?.toUpperCase() ?? "")
    .join("");
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontWeight: "500",
  },
  statusDot: {
    position: "absolute",
    borderWidth: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  ring: {
    padding: 2,
    borderRadius: radius.full,
  },
  chip: {
    alignItems: "center",
    justifyContent: "center",
  },
});

Avatar.displayName = "Avatar";
AvatarGroup.displayName = "AvatarGroup";
