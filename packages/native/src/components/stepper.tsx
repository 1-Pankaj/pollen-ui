import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { radius, spacing } from "@pollen/tokens";
import { usePollenTheme, withAlpha } from "../lib/theme";
import { springSnappyConfig } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

export type StepperSize = "sm" | "md" | "lg";

export interface StepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Amount added or removed per press. Default 1. */
  step?: number;
  size?: StepperSize;
  /** Accessible name, announced with the value. Default "Stepper". */
  "aria-label"?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the control. */
  className?: string;
}

const sizeTable: Record<StepperSize, { height: number; width: number; fontSize: number }> = {
  sm: { height: 30, width: 30, fontSize: 13 },
  md: { height: 38, width: 38, fontSize: 15 },
  lg: { height: 46, width: 46, fontSize: 17 },
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * The plus/minus quantity control the platform trained every thumb
 * on, native-only in this library:
 * an inset track, two tappable ends, the value in the middle, and
 * ends that grey out at min and max instead of clicking emptily.
 * The count bumps with a tiny scale spring on every change so the
 * eye can track repeated taps.
 *
 * Accessibility: each end is role="button" ("Increase"/"Decrease"),
 * disabled states are announced, and the value carries a live
 * region so the new number is spoken after each press.
 */
export function Stepper({
  value: controlled,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 99,
  step = 1,
  size = "md",
  "aria-label": ariaLabel = "Stepper",
  disabled = false,
  style,
  className,
}: StepperProps) {
  const theme = usePollenTheme();
  const c = theme.colors;
  const s = sizeTable[size];
  const [uncontrolled, setUncontrolled] = useState(clamp(defaultValue, min, max));
  const value = controlled !== undefined ? clamp(controlled, min, max) : uncontrolled;
  const locked = disabled === true;

  const atMin = value <= min;
  const atMax = value >= max;

  const apply = (next: number) => {
    const clamped = clamp(next, min, max);
    if (clamped === value) return;
    if (controlled === undefined) setUncontrolled(clamped);
    onValueChange?.(clamped);
  };

  // The value bumps once per change, keyed by the number itself:
  // repeated taps each retrigger the spring.
  const bump = useSharedValue(1);
  useEffect(() => {
    bump.value = 0.86;
    bump.value = withSpring(1, springSnappyConfig);
  }, [value, bump]);

  const valueAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: bump.value }],
  }));

  const endStyle = (blocked: boolean) => ({
    backgroundColor: blocked ? c.fill : withAlpha(c.fg, 0.04),
    opacity: locked ? 0.5 : 1,
  });

  return (
    <View
      {...passthroughClassName(className)}
      accessibilityRole="adjustable"
      accessibilityLabel={ariaLabel}
      accessibilityValue={{ min, max, now: value, text: String(value) }}
      style={[
        styles.track,
        {
          height: s.height,
          borderRadius: radius.fieldLg,
          backgroundColor: c.fill,
          opacity: locked ? 0.55 : 1,
        },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${ariaLabel}`}
        accessibilityState={{ disabled: locked || atMin }}
        disabled={locked || atMin}
        onPress={() => apply(value - step)}
        style={[styles.end, { width: s.width, height: s.height }, endStyle(atMin)]}
      >
        <Text style={[styles.sign, { fontSize: s.fontSize, color: atMin ? c.fgFaint : c.fg }]}>
          −
        </Text>
      </Pressable>
      <View style={styles.valueSlot}>
        <Animated.Text
          style={[styles.value, { fontSize: s.fontSize, color: c.fg }, valueAnimated]}
        >
          {value}
        </Animated.Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${ariaLabel}`}
        accessibilityState={{ disabled: locked || atMax }}
        disabled={locked || atMax}
        onPress={() => apply(value + step)}
        style={[styles.end, { width: s.width, height: s.height }, endStyle(atMax)]}
      >
        <Text style={[styles.sign, { fontSize: s.fontSize, color: atMax ? c.fgFaint : c.fg }]}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  end: {
    alignItems: "center",
    justifyContent: "center",
  },
  sign: {
    fontWeight: "600",
  },
  valueSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    minWidth: 44,
  },
  value: {
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});

Stepper.displayName = "Stepper";
