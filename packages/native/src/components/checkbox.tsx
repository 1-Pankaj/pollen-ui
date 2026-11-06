import { useEffect, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { radius, spacing } from "@pollen/tokens";
import { usePollenTheme, white } from "../lib/theme";
import { springSnappyConfig } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

export type CheckboxColor = "accent" | "neutral" | "success";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Shows a dash instead of a check: some, not all, of a set. */
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Color of the checked box. */
  color?: CheckboxColor;
  /** Clickable text rendered next to the box. */
  children?: ReactNode;
  /** Second line under the label. */
  description?: ReactNode;
  /** Render the label and description inside a selectable card. */
  card?: boolean;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the row. */
  className?: string;
}

const BOX: Record<"sm" | "md" | "lg", number> = { sm: 18, md: 22, lg: 26 };

/**
 * Checkbox, matching the web: a box that fills with the
 * on color while the check pops through the shared snappy spring,
 * an indeterminate dash for "some of the set", and the same
 * label-plus-description rows the web version wires through
 * htmlFor. `card` draws the selectable surface the web version
 * paints with ring-offset.
 *
 * Divergence from the web library: the check is drawn with two
 * rotated bars instead of an SVG path (no SVG dependency on
 * native), and the indeterminate dash animates through the same
 * spring instead of a 150ms tween.
 */
export function Checkbox({
  checked: controlled,
  defaultChecked,
  indeterminate = false,
  onCheckedChange,
  disabled,
  color = "accent",
  children,
  description,
  card = false,
  style,
  className,
}: CheckboxProps) {
  const theme = usePollenTheme();
  const reduceMotion = useReducedMotion();
  const [uncontrolled, setUncontrolled] = useState(defaultChecked ?? false);
  const checked = controlled !== undefined ? controlled : uncontrolled;
  const locked = disabled === true;
  const box = 22;
  const active =
    color === "neutral"
      ? theme.colors.fg
      : color === "success"
        ? theme.colors.success
        : theme.colors.accent;

  // One progress value drives fill, check and dash together, the
  // same way the web box transitions its three layers as one.
  const progress = useSharedValue(checked || indeterminate ? 1 : 0);
  const press = useSharedValue(1);

  useEffect(() => {
    progress.value = reduceMotion
      ? checked || indeterminate
        ? 1
        : 0
      : withSpring(checked || indeterminate ? 1 : 0, springSnappyConfig);
  }, [checked, indeterminate, reduceMotion, progress]);

  const toggle = () => {
    if (locked) return;
    const next = !checked;
    if (controlled === undefined) setUncontrolled(next);
    onCheckedChange?.(next);
  };

  const boxAnimated = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ["transparent", active]),
    transform: [{ scale: press.value }],
  }));

  // The check is two bars of a white border, rotated into a tick.
  // It scales 0 -> 1 so it lands with the spring instead of fading.
  const checkAnimated = useAnimatedStyle(() => ({
    opacity: indeterminate ? 0 : progress.value,
    transform: [{ scale: indeterminate ? 0.4 : progress.value }],
  }));

  const dashAnimated = useAnimatedStyle(() => ({
    opacity: indeterminate ? 1 : 0,
    transform: [{ scaleX: indeterminate ? 1 : 0.4 }],
  }));

  const boxNode = (
    <Animated.View
      style={[
        styles.box,
        {
          width: box,
          height: box,
          borderRadius: radius.fieldSm,
          borderColor: checked || indeterminate ? active : theme.colors.borderStrong,
        },
        boxAnimated,
      ]}
    >
      <Animated.View
        style={[
          styles.checkRoot,
          { width: box * 0.5, height: box * 0.32 },
          checkAnimated,
        ]}
      >
        <View style={[styles.checkShort, { borderColor: white }]} />
        <View style={[styles.checkLong, { borderColor: white }]} />
      </Animated.View>
      <Animated.View
        style={[
          styles.dash,
          { backgroundColor: white, width: box * 0.5 },
          dashAnimated,
        ]}
      />
    </Animated.View>
  );

  return (
    <Pressable
      {...passthroughClassName(className)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: locked }}
      accessibilityLabel={typeof children === "string" ? children : undefined}
      disabled={locked}
      onPress={toggle}
      onPressIn={() => {
        press.value = withSpring(0.94, springSnappyConfig);
      }}
      onPressOut={() => {
        press.value = withSpring(1, springSnappyConfig);
      }}
      style={[
        card ? styles.cardRow : styles.row,
        card && {
          backgroundColor: theme.colors.card,
          borderRadius: radius.control,
          borderWidth: 1.5,
          borderColor: checked ? active : theme.colors.border,
          padding: spacing.md,
          gap: spacing.md,
        },
        style,
      ]}
    >
      {boxNode}
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
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  checkRoot: {
    position: "absolute",
    transform: [{ rotate: "-45deg" }],
  },
  // Two bars of the same border draw the tick: a short descending
  // stroke and a long ascending one, joined at the corner.
  checkShort: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "34%",
    height: "100%",
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderTopLeftRadius: 1,
  },
  checkLong: {
    position: "absolute",
    right: 0,
    bottom: "34%",
    width: "72%",
    height: "100%",
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderTopRightRadius: 1,
  },
  dash: {
    position: "absolute",
    height: 2,
    borderRadius: 1,
  },
  labelCol: {
    gap: 2,
    flexShrink: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  labelDisabled: {
    opacity: 0.5,
  },
});

Checkbox.displayName = "Checkbox";
