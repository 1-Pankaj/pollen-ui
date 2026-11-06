import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { spacing } from "@pollen-ui/tokens";
import { usePollenTheme } from "../lib/theme";
import { springSnappyConfig } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the group. */
  className?: string;
  /** Accessible name for the group. */
  "aria-label"?: string;
}

interface RadioGroupContextValue {
  value: string;
  onSelect: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/**
 * One selection out of a set, matching the web RadioGroup:
 * the group owns the value, each Radio reads it through context,
 * and the circle fills through the shared snappy spring. The group
 * carries accessibilityRole="radiogroup", each Radio
 * accessibilityRole="radio", so iOS and Android announce the set
 * and the selection the way VoiceOver and TalkBack expect.
 *
 * Divergence from the web library: the web moves focus with arrow
 * keys and roving tabindex; on native the OS rotor handles group
 * navigation, so the code is a plain list of pressables with the
 * correct roles and states instead of a focus manager.
 */
export function RadioGroup({
  value: controlled,
  defaultValue = "",
  onValueChange,
  children,
  style,
  className,
  "aria-label": ariaLabel,
}: RadioGroupProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled !== undefined ? controlled : uncontrolled;

  const onSelect = (next: string) => {
    if (controlled === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <RadioGroupContext.Provider value={{ value, onSelect }}>
      <View
        {...passthroughClassName(className)}
        accessibilityRole="radiogroup"
        accessibilityLabel={ariaLabel}
        style={[styles.group, style]}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps {
  value: string;
  /** Clickable text rendered next to the circle. */
  children?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the row. */
  className?: string;
}

const SIZE = 20;
const DOT = 8;

export function Radio({ value, children, disabled, style, className }: RadioProps) {
  const ctx = useContext(RadioGroupContext);
  const theme = usePollenTheme();
  const reduceMotion = useReducedMotion();
  const checked = ctx?.value === value;
  const locked = disabled === true || ctx === null;

  const fill = useSharedValue(checked ? 1 : 0);
  const press = useSharedValue(1);

  useEffect(() => {
    fill.value = reduceMotion
      ? checked
        ? 1
        : 0
      : withSpring(checked ? 1 : 0, springSnappyConfig);
  }, [checked, reduceMotion, fill]);

  const ringAnimated = useAnimatedStyle(() => ({
    borderColor: checked ? theme.colors.accent : theme.colors.borderStrong,
  }));

  const dotAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: fill.value }],
    opacity: fill.value,
  }));

  const select = () => {
    if (locked) return;
    ctx?.onSelect(value);
  };

  return (
    <Pressable
      {...passthroughClassName(className)}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled: locked }}
      accessibilityLabel={typeof children === "string" ? children : value}
      disabled={locked}
      onPress={select}
      onPressIn={() => {
        press.value = withSpring(0.94, springSnappyConfig);
      }}
      onPressOut={() => {
        press.value = withSpring(1, springSnappyConfig);
      }}
      style={[styles.row, style]}
    >
      <Animated.View
        style={[
          styles.circle,
          { width: SIZE, height: SIZE, borderRadius: SIZE / 2 },
          ringAnimated,
          { transform: [{ scale: press.value }] },
        ]}
      >
        <Animated.View
          style={[
            styles.dot,
            {
              width: DOT,
              height: DOT,
              borderRadius: DOT / 2,
              backgroundColor: theme.colors.accent,
            },
            dotAnimated,
          ]}
        />
      </Animated.View>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    alignSelf: "flex-start",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  dot: {
    // A plain flex child: the circle centers it, the spring scales it.
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  labelDisabled: {
    opacity: 0.5,
  },
});

RadioGroup.displayName = "RadioGroup";
Radio.displayName = "Radio";
