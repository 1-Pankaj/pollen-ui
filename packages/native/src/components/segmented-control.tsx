import { useEffect, useState } from "react";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { radius, spacing } from "@pollen-ui/tokens";
import { usePollenTheme } from "../lib/theme";
import { springSnappyConfig } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

export interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  /** Stretch to fill the container, thumbs sized by fraction. */
  fullWidth?: boolean;
  /** Pill-shaped container instead of the inset square. */
  shape?: "rounded" | "pill";
  /** Accessible name for the control. */
  "aria-label"?: string;
  /** NativeWind passthrough, forwarded to the container. */
  className?: string;
}

const sizeTable: Record<
  "sm" | "md" | "lg",
  { height: number; fontSize: number; pad: number }
> = {
  sm: { height: 30, fontSize: 12.5, pad: 2 },
  md: { height: 36, fontSize: 13.5, pad: 3 },
  lg: { height: 42, fontSize: 15, pad: 3 },
};

/**
 * The segmented control - the one control in this set that is more
 * at home on native than on the web. Options sit in an inset track
 * and a thumb glides under the selected label on the shared snappy
 * spring, so choosing a segment feels like the platform's own
 * control while reading the Pollen tokens.
 *
 * Divergence from the web library: the web thumb measures the DOM
 * with a ref; native measures nothing - the thumb is sized as a
 * fraction of the track (100 / options.length percent) and moved
 * by index, which is exactly how UISegmentedControl behaves and
 * keeps RTL mirroring automatic through I18nManager.
 */
export function SegmentedControl({
  options,
  value: controlled,
  defaultValue,
  onValueChange,
  size = "md",
  fullWidth = false,
  shape = "rounded",
  "aria-label": ariaLabel,
  className,
}: SegmentedControlProps) {
  const theme = usePollenTheme();
  const rtl = I18nManager.isRTL;
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const value = controlled !== undefined ? controlled : uncontrolled;
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  const s = sizeTable[size];
  const fraction = 100 / Math.max(options.length, 1);
  const isPill = shape === "pill";

  // Measured on the track ref so fraction and pixel travel agree
  // even when fullWidth stretches or labels wrap the track width.
  const [trackWidth, setTrackWidth] = useState(0);

  const x = useSharedValue(0);

  useEffect(() => {
    const seg = trackWidth / Math.max(options.length, 1);
    const target = rtl ? (options.length - 1 - index) * seg : index * seg;
    x.value = withSpring(target, springSnappyConfig);
  }, [index, trackWidth, options.length, rtl, x]);

  const thumbAnimated = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const select = (next: string) => {
    if (controlled === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <View
      {...passthroughClassName(className)}
      accessibilityRole="radiogroup"
      accessibilityLabel={ariaLabel}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width - s.pad * 2)}
      style={[
        styles.track,
        {
          height: s.height,
          padding: s.pad,
          borderRadius: isPill ? radius.full : radius.control,
          backgroundColor: theme.colors.fill,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
      ]}
    >
      {trackWidth > 0 && (
        <Animated.View
          style={[
            styles.thumb,
            {
              width: `${fraction}%`,
              height: s.height - s.pad * 2,
              borderRadius: isPill ? radius.full : radius.fieldMd - s.pad,
              backgroundColor: theme.colors.card,
              left: s.pad,
              top: s.pad,
            },
            theme.shadows.xs ? { elevation: 1 } : null,
            thumbAnimated,
          ]}
        />
      )}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            disabled={selected && options.length === 1}
            onPress={() => select(option.value)}
            style={[
              styles.segment,
              { height: s.height - s.pad * 2 },
              fullWidth && { flexBasis: `${fraction}%` },
            ]}
          >
            <AnimatedSegmentLabel
              label={option.label}
              selected={selected}
              fontSize={s.fontSize}
              fg={theme.colors.fg}
              fgMuted={theme.colors.fgMuted}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * The label crossfades ink color as the thumb arrives - a plain
 * Text with a conditional color would snap, and the snap is
 * visible because the thumb takes 200ms+ to get there.
 */
function AnimatedSegmentLabel({
  label,
  selected,
  fontSize: fs,
  fg,
  fgMuted,
}: {
  label: string;
  selected: boolean;
  fontSize: number;
  fg: string;
  fgMuted: string;
}) {
  const progress = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    progress.value = withSpring(selected ? 1 : 0, springSnappyConfig);
  }, [selected, progress]);

  const labelAnimated = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [fgMuted, fg]),
  }));

  return (
    <Animated.Text
      selectable={false}
      style={[styles.label, { fontSize: fs }, labelAnimated]}
    >
      {label}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    overflow: "hidden",
  },
  thumb: {
    position: "absolute",
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  label: {
    fontWeight: "500",
  },
});

SegmentedControl.displayName = "SegmentedControl";
