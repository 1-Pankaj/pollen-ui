import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { spacing } from "@pollen-ui/tokens";
import { usePollenTheme, white } from "../lib/theme";
import { mapShadow } from "../lib/shadows";
import { springSnappyConfig } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

const THUMB = 18;
const CORE_DOT = 6;

export interface SliderProps {
  /** Controlled value. Omit to manage it internally from defaultValue. */
  value?: number;
  /** Uncontrolled starting value. Default 0. */
  defaultValue?: number;
  min?: number;
  max?: number;
  /** Snap increment. Default 1. */
  step?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  /** Label for the adjustable thumb. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the outer wrapper. */
  className?: string;
}

/**
 * Range control with a single thumb, matching the web
 * Slider. Touching anywhere on the rail jumps the thumb to that
 * value with a short spring glide; dragging tracks the finger
 * one-to-one and snaps to the step, settling on the same spring on
 * release. The thumb exposes the "adjustable" role with
 * increment/decrement accessibility actions so assistive tech can
 * move it by one step.
 *
 * Divergence from the web library: the web two-thumb range mode,
 * vertical rail, tick marks and value bubble are not carried over;
 * the native control is the single-thumb 0..100 case the primitives
 * family needs. Keyboard operation is replaced by the adjustable
 * accessibility actions.
 */

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

export function Slider({
  value: controlled,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled,
  accessibilityLabel,
  style,
  className,
}: SliderProps) {
  const theme = usePollenTheme();
  const reduceMotion = useReducedMotion();
  const [inner, setInner] = useState(defaultValue);
  const [trackWidth, setTrackWidth] = useState(0);
  const [dragging, setDragging] = useState(false);

  const current = controlled ?? inner;
  const fraction = useSharedValue(
    max === min ? 0 : clamp((current - min) / (max - min), 0, 1),
  );

  /** Worklet-safe step snap, also callable from the JS thread. */
  const snapValue = (raw: number) => {
    "worklet";
    const stepped = Math.round((raw - min) / step) * step + min;
    return clamp(Number(stepped.toFixed(5)), min, max);
  };

  const toFraction = (v: number) => {
    "worklet";
    return max === min ? 0 : clamp((v - min) / (max - min), 0, 1);
  };

  const emit = useCallback(
    (next: number) => {
      if (controlled === undefined) setInner(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  /* Follow the outside value, but never fight an active drag. */
  useEffect(() => {
    if (dragging) return;
    fraction.value = reduceMotion
      ? toFraction(current)
      : withSpring(toFraction(current), springSnappyConfig);
  }, [current, dragging, reduceMotion, fraction, max, min]);

  const gesture = Gesture.Pan()
    .enabled(disabled !== true && trackWidth > 0)
    .onBegin((e) => {
      if (trackWidth <= 0) return;
      const ratio = clamp(e.x / trackWidth, 0, 1);
      const next = snapValue(min + ratio * (max - min));
      fraction.value = reduceMotion
        ? toFraction(next)
        : withSpring(toFraction(next), springSnappyConfig);
      runOnJS(emit)(next);
      runOnJS(setDragging)(true);
    })
    .onUpdate((e) => {
      if (trackWidth <= 0) return;
      const ratio = clamp(e.x / trackWidth, 0, 1);
      const next = snapValue(min + ratio * (max - min));
      fraction.value = toFraction(next);
      runOnJS(emit)(next);
    })
    .onFinalize(() => {
      fraction.value = reduceMotion
        ? fraction.value
        : withSpring(fraction.value, springSnappyConfig);
      runOnJS(setDragging)(false);
    });

  const adjust = (dir: 1 | -1) => {
    if (disabled) return;
    emit(snapValue(current + dir * step));
  };

  const onAccessibilityAction = (e: AccessibilityActionEvent) => {
    if (e.nativeEvent.actionName === "increment") adjust(1);
    if (e.nativeEvent.actionName === "decrement") adjust(-1);
  };

  const fillAnimated = useAnimatedStyle(() => ({
    width: Math.max(0, fraction.value * trackWidth),
  }));

  const thumbAnimated = useAnimatedStyle(() => ({
    transform: [{ translateX: fraction.value * trackWidth - THUMB / 2 }],
  }));

  return (
    <View
      {...passthroughClassName(className)}
      style={[styles.wrap, disabled && styles.disabled, style]}
    >
      <GestureDetector gesture={gesture}>
        <View
          style={styles.hitArea}
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        >
          <View
            style={[styles.rail, { backgroundColor: theme.colors.fillStrong }]}
          >
            <Animated.View
              style={[
                styles.fill,
                { backgroundColor: theme.colors.accent },
                fillAnimated,
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.thumb,
              mapShadow(theme.shadows, "sm"),
              { backgroundColor: white },
              thumbAnimated,
            ]}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={accessibilityLabel}
            accessibilityValue={{ min, max, now: current }}
            accessibilityActions={[
              { name: "increment" },
              { name: "decrement" },
            ]}
            onAccessibilityAction={onAccessibilityAction}
          >
            <View
              style={[
                styles.coreDot,
                {
                  backgroundColor: dragging
                    ? theme.colors.accent
                    : theme.colors.fillStrong,
                },
              ]}
            />
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  hitArea: {
    height: 20,
    justifyContent: "center",
    width: "100%",
  },
  rail: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    left: 0,
    top: "50%",
    marginTop: -THUMB / 2,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  coreDot: {
    width: CORE_DOT,
    height: CORE_DOT,
    borderRadius: CORE_DOT / 2,
  },
});

Slider.displayName = "Slider";
