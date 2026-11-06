import { useEffect, useState } from "react";
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

export type RatingGlyph = "star" | "heart";

export interface RatingProps {
  /** Maximum rating, default 5. */
  max?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Read only, for showing aggregate scores. */
  readOnly?: boolean;
  /** Hide the numeric value next to the glyphs. */
  hideValue?: boolean;
  /** Which glyph to draw. Star is the review standard. */
  glyph?: RatingGlyph;
  /** Word for the current value, e.g. ["Poor", "Great"]. */
  labels?: string[];
  /** Extra caption under the control, e.g. "1,204 reviews". */
  caption?: string;
  style?: StyleProp<ViewStyle>;
  /** NativeWind passthrough, forwarded to the control. */
  className?: string;
}

const GLYPHS: Record<RatingGlyph, string> = {
  star: "\u2605",
  heart: "\u2665",
};

const STAR = 26;

/**
 * Star rating, matching the web: filled and empty glyphs,
 * the selected one popping through the shared snappy spring, an
 * optional word ("Great") and caption ("1,204 reviews") under it.
 *
 * Accessibility: the control is role="adjustable" - VoiceOver and
 * TalkBack swipe up and down to change the rating, and the value is
 * announced as "3 of 5" plus the label word. That is the platform
 * equivalent of the web arrow-key slider pattern.
 *
 * Divergence from the web library: the web draws four SVG glyphs
 * (star, heart, thumbs, petal) with fractional fill for read-only
 * aggregates. Native has no SVG runtime in core, so the kit ships
 * the two monochrome unicode glyphs that follow the theme ink
 * exactly, whole-star fill, and no hover preview (touchscreens
 * have no hover). The exact value still appears in the readout.
 */
export function Rating({
  max = 5,
  value: controlled,
  defaultValue = 0,
  onValueChange,
  readOnly = false,
  hideValue = false,
  glyph = "star",
  labels,
  caption,
  style,
  className,
}: RatingProps) {
  const theme = usePollenTheme();
  const reduceMotion = useReducedMotion();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled !== undefined ? controlled : uncontrolled;
  const locked = readOnly === true;

  const set = (next: number) => {
    if (locked) return;
    const clamped = Math.min(max, Math.max(0, Math.round(next)));
    if (controlled === undefined) setUncontrolled(clamped);
    onValueChange?.(clamped);
  };

  const label =
    labels && value > 0
      ? labels[Math.min(labels.length - 1, value - 1)]
      : undefined;

  return (
    <View
      {...passthroughClassName(className)}
      accessibilityRole="adjustable"
      accessibilityLabel={label ? `Rating, ${label}` : "Rating"}
      accessibilityValue={{ min: 0, max, now: value, text: `${value} of ${max}` }}
      // Swipe up / down changes the rating for assistive tech,
      // the native counterpart of the web's arrow keys.
      accessibilityActions={[
        { name: "increment", label: "Increase rating" },
        { name: "decrement", label: "Decrease rating" },
      ]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === "increment") set(value + 1);
        if (e.nativeEvent.actionName === "decrement") set(value - 1);
      }}
      style={[styles.root, style]}
    >
      <View style={styles.stars}>
        {Array.from({ length: max }, (_, i) => (
          <Glyph
            key={i}
            char={GLYPHS[glyph]}
            filled={i < value}
            size={STAR}
            fillColor={theme.colors.accent}
            emptyColor={theme.colors.fillStrong}
            disabled={locked}
            reduceMotion={reduceMotion === true}
            onPress={() => set(i + 1)}
          />
        ))}
      </View>
      {!hideValue && (
        <Text style={[styles.value, { color: theme.colors.fgMuted }]}>
          {`${value} / ${max}`}
          {label ? ` \u00B7 ${label}` : ""}
        </Text>
      )}
      {caption != null && (
        <Text style={[styles.caption, { color: theme.colors.fgFaint }]}>
          {caption}
        </Text>
      )}
    </View>
  );
}

function Glyph({
  char,
  filled,
  size,
  fillColor,
  emptyColor,
  disabled,
  reduceMotion,
  onPress,
}: {
  char: string;
  filled: boolean;
  size: number;
  fillColor: string;
  emptyColor: string;
  disabled: boolean;
  reduceMotion: boolean;
  onPress: () => void;
}) {
  const pop = useSharedValue(filled ? 1 : 0);
  useEffect(() => {
    pop.value = reduceMotion
      ? filled
        ? 1
        : 0
      : withSpring(filled ? 1 : 0, springSnappyConfig);
  }, [filled, reduceMotion, pop]);

  const glyphAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value * 0.18 + 1 }],
    opacity: filled ? 1 : 0.6,
  }));

  return (
    <Pressable
      accessibilityLabel={`${filled ? "Filled" : "Empty"} ${char === GLYPHS.star ? "star" : "heart"}`}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={styles.starSlot}
    >
      <Animated.Text
        selectable={false}
        style={[
          styles.glyph,
          { fontSize: size, lineHeight: Math.round(size * 1.15), color: filled ? fillColor : emptyColor },
          glyphAnimated,
        ]}
      >
        {char}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "flex-start",
    gap: spacing.xs,
    alignSelf: "flex-start",
  },
  stars: {
    flexDirection: "row",
    gap: spacing.xxs,
  },
  starSlot: {
    padding: spacing.xxs,
  },
  glyph: {
    fontWeight: "400",
  },
  value: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  caption: {
    fontSize: 12.5,
    lineHeight: 17,
  },
});

Rating.displayName = "Rating";
