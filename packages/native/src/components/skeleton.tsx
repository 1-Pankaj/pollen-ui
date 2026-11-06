import { useEffect } from "react";
import {
  StyleSheet,
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
  withTiming,
} from "react-native-reanimated";
import { radius, spacing } from "@pollen/tokens";
import { usePollenTheme } from "../lib/theme";
import { passthroughClassName } from "../lib/className";

export type SkeletonEffect = "pulse" | "none";
export type SkeletonShape = "rect" | "circle" | "text";

export interface SkeletonProps {
  /** The loading animation. Pulse breathes; none is a still block. */
  effect?: SkeletonEffect;
  /** rect is free-form, circle squares itself, text is a rounded bar. */
  shape?: SkeletonShape;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the block. */
  className?: string;
}

const LINE_HEIGHT = 14;

/**
 * Loading placeholder, matching the web Skeleton: a quiet
 * opacity pulse (the Tailwind 2s breathe, done with withRepeat)
 * that stops dead for reduced-motion users. Compose circles, lines
 * and blocks to sketch the layout that is coming; sizes come
 * through style.
 *
 * Divergence from the web library: the shimmer sweep is not carried
 * over - it needs a gradient band, which would pull in a gradient
 * dependency for one effect; the pulse is the Pollen default on
 * both platforms. The web rounded-md block corner becomes the
 * nearest field radius token.
 */
export function Skeleton({
  effect = "pulse",
  shape = "rect",
  style,
  className,
}: SkeletonProps) {
  const theme = usePollenTheme();
  const reduceMotion = useReducedMotion();
  const live = !reduceMotion && effect !== "none";
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (live) {
      opacity.value = withRepeat(
        withTiming(0.5, {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true,
      );
      return;
    }
    cancelAnimation(opacity);
    opacity.value = 1;
  }, [live, opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      {...passthroughClassName(className)}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.base,
        shape === "circle" && styles.circle,
        shape === "text" && styles.textBar,
        shape === "rect" && styles.rect,
        { backgroundColor: theme.colors.fill },
        pulseStyle,
        style,
      ]}
    />
  );
}

export interface SkeletonTextProps {
  /** How many lines to sketch. The last one renders 60% wide. */
  lines?: number;
  /** Animate the lines. */
  effect?: SkeletonEffect;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the paragraph block. */
  className?: string;
}

/**
 * A paragraph-shaped placeholder: n rounded bars with the last one
 * pulled short, the way real text raggedly ends. The whole block
 * pulses together, like the web SkeletonText.
 */
export function SkeletonText({
  lines = 3,
  effect = "pulse",
  style,
  className,
}: SkeletonTextProps) {
  const theme = usePollenTheme();
  const reduceMotion = useReducedMotion();
  const live = !reduceMotion && effect !== "none";
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (live) {
      opacity.value = withRepeat(
        withTiming(0.5, {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true,
      );
      return;
    }
    cancelAnimation(opacity);
    opacity.value = 1;
  }, [live, opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      {...passthroughClassName(className)}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.paragraph, pulseStyle, style]}
    >
      {Array.from({ length: lines }, (_, i) => (
        <View
          key={i}
          style={[
            styles.base,
            styles.textBar,
            { backgroundColor: theme.colors.fill },
            i === lines - 1 && lines > 1 ? styles.lastLine : null,
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
  },
  rect: {
    height: LINE_HEIGHT,
    borderRadius: radius.fieldSm,
  },
  circle: {
    borderRadius: 9999,
    aspectRatio: 1,
  },
  textBar: {
    height: LINE_HEIGHT,
    borderRadius: 9999,
  },
  paragraph: {
    width: "100%",
    gap: spacing.sm,
  },
  lastLine: {
    width: "60%",
  },
});

Skeleton.displayName = "Skeleton";
SkeletonText.displayName = "SkeletonText";
