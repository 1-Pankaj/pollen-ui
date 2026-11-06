import { useEffect, useState, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { fontSize, spacing } from "@pollen-ui/tokens";
import { usePollenTheme, white } from "../lib/theme";
import { mapShadow } from "../lib/shadows";
import { springSnappyConfig } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

export type SwitchSize = "sm" | "md" | "lg";

export type SwitchColor = "accent" | "neutral" | "success";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Color of the on state. */
  color?: SwitchColor;
  size?: SwitchSize;
  /** Clickable label rendered next to the switch. */
  children?: ReactNode;
  /** Second line under the label. */
  description?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the row. */
  className?: string;
}

const sizeTable: Record<
  SwitchSize,
  { width: number; height: number; thumb: number; pad: number }
> = {
  sm: { width: 32, height: 18, thumb: 14, pad: 2 },
  md: { width: 44, height: 24, thumb: 20, pad: 2 },
  lg: { width: 52, height: 28, thumb: 24, pad: 2 },
};

/**
 * On and off, matching the web Switch: a track that tints
 * toward the on color while the thumb travels on the shared snappy
 * spring, with label and description that toggle with it, exactly
 * like the web labels wired through htmlFor. Off state is the
 * fill-strong token, on state is the accent, ink, or success token
 * per the color prop.
 *
 * Divergence from the web library: the loading state and the
 * on/off state icons are web-only flourishes and are not carried
 * over; the colors animate through the same spring as the thumb
 * travel instead of a separate 200ms transition.
 */
export function Switch({
  checked: controlled,
  defaultChecked,
  onCheckedChange,
  disabled,
  color = "accent",
  size = "md",
  children,
  description,
  style,
  className,
}: SwitchProps) {
  const theme = usePollenTheme();
  const reduceMotion = useReducedMotion();
  const [uncontrolled, setUncontrolled] = useState(defaultChecked ?? false);
  const checked = controlled !== undefined ? controlled : uncontrolled;
  const locked = disabled === true;
  const s = sizeTable[size];
  const travel = s.width - s.thumb - s.pad * 2;

  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = reduceMotion
      ? checked
        ? 1
        : 0
      : withSpring(checked ? 1 : 0, springSnappyConfig);
  }, [checked, reduceMotion, progress]);

  const toggle = () => {
    if (locked) return;
    const next = !checked;
    if (controlled === undefined) setUncontrolled(next);
    onCheckedChange?.(next);
  };

  const onColor =
    color === "neutral"
      ? theme.colors.fg
      : color === "success"
        ? theme.colors.success
        : theme.colors.accent;
  const offColor = theme.colors.fillStrong;

  const trackAnimated = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [offColor, onColor]),
  }));

  const thumbAnimated = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, travel]) },
    ],
  }));

  return (
    <Pressable
      {...passthroughClassName(className)}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled: locked }}
      accessibilityLabel={
        typeof children === "string" ? children : undefined
      }
      disabled={locked}
      onPress={toggle}
      style={[styles.row, style]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: s.width,
            height: s.height,
            borderRadius: s.height / 2,
          },
          trackAnimated,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: s.thumb,
              height: s.thumb,
              borderRadius: s.thumb / 2,
              left: s.pad,
              top: s.pad,
            },
            mapShadow(theme.shadows, "sm"),
            thumbAnimated,
          ]}
        />
      </Animated.View>
      {(children !== undefined || description !== undefined) && (
        <View style={styles.labelCol}>
          {children != null && (
            <Text
              style={[
                styles.label,
                { color: theme.colors.fg },
                locked && styles.labelDisabled,
              ]}
            >
              {children}
            </Text>
          )}
          {description != null && (
            <Text
              style={[
                styles.description,
                { color: theme.colors.fgMuted },
                locked && styles.labelDisabled,
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    alignSelf: "flex-start",
  },
  track: {
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
    backgroundColor: white,
  },
  labelCol: {
    gap: 2,
    flexShrink: 1,
  },
  label: {
    fontSize: fontSize.small,
    fontWeight: "500",
    lineHeight: 20,
  },
  description: {
    fontSize: fontSize.label,
    lineHeight: 18,
  },
  labelDisabled: {
    opacity: 0.5,
  },
});

Switch.displayName = "Switch";
