import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { fontSize } from "@pollen/tokens";
import { usePollenTheme } from "../lib/theme";
import { springSoftConfig } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

export type ProgressColor =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export type ProgressSize = "xs" | "sm" | "md";

export interface ProgressProps {
  /** Current value. Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  size?: ProgressSize;
  color?: ProgressColor;
  /** Numeric readout after the bar, e.g. 62%. */
  showValue?: boolean;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the row. */
  className?: string;
}

const heights: Record<ProgressSize, number> = { xs: 4, sm: 6, md: 10 };

/**
 * Linear progress in five status colors and three heights,
 * matching the web Progress. The determinate fill glides to
 * its new width on the soft spring; an omitted value loops a
 * third-full bar forever, and reduced-motion users get the same
 * still third-full bar the web falls back to.
 *
 * Divergence from the web library: the animated diagonal stripes
 * overlay is not carried over (it needs a repeating pattern layer
 * that has no cheap native equivalent).
 */
export function Progress({
  value,
  max = 100,
  size = "sm",
  color = "accent",
  showValue,
  style,
  className,
}: ProgressProps) {
  const theme = usePollenTheme();
  const reduceMotion = useReducedMotion();
  const [trackWidth, setTrackWidth] = useState(0);

  const indeterminate = value === undefined;
  const pct = indeterminate
    ? 0
    : Math.min(100, Math.max(0, (value / max) * 100));

  const width = useSharedValue(indeterminate ? 0 : pct);
  const sweep = useSharedValue(-1.2); // measured in bar widths

  useEffect(() => {
    if (indeterminate) {
      cancelAnimation(width);
      if (reduceMotion) {
        // Reduced motion keeps a still third-full bar; the loop
        // itself is the thing being turned off.
        sweep.value = -0.6;
        return;
      }
      sweep.value = -1.2;
      sweep.value = withRepeat(
        withTiming(3.4, {
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        false,
      );
      return;
    }
    cancelAnimation(sweep);
    width.value = reduceMotion ? pct : withSpring(pct, springSoftConfig);
  }, [indeterminate, pct, reduceMotion, width, sweep]);

  const fillColor =
    color === "neutral"
      ? theme.colors.fg
      : color === "success"
        ? theme.colors.success
        : color === "warning"
          ? theme.colors.warning
          : color === "danger"
            ? theme.colors.danger
            : theme.colors.accent;

  const fillAnimated = useAnimatedStyle(() => {
    if (indeterminate) {
      const barWidth = trackWidth * 0.33;
      return {
        width: barWidth,
        transform: [{ translateX: sweep.value * barWidth }],
      };
    }
    return { width: `${width.value}%` };
  });

  return (
    <View
      {...passthroughClassName(className)}
      style={[styles.row, style]}
    >
      <View
        style={[
          styles.track,
          { height: heights[size], backgroundColor: theme.colors.fill },
        ]}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        accessibilityRole="progressbar"
        accessibilityValue={
          indeterminate ? { min: 0, max } : { min: 0, max, now: Math.round(pct) }
        }
      >
        <Animated.View
          style={[styles.fill, { backgroundColor: fillColor }, fillAnimated]}
        />
      </View>
      {showValue && !indeterminate && (
        <Text style={[styles.value, { color: theme.colors.fgMuted }]}>
          {Math.round(pct)}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  track: {
    flex: 1,
    borderRadius: 9999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 9999,
  },
  value: {
    fontSize: fontSize.caption,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  },
});

Progress.displayName = "Progress";
