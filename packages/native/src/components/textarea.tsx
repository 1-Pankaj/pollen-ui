import { forwardRef, type ComponentRef, useState, type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { fontSize, radius, spacing } from "@pollen-ui/tokens";
import { usePollenTheme, withAlpha } from "../lib/theme";
import { fastTween } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

export type FieldSize = "sm" | "md" | "lg";

export interface TextareaProps
  extends Omit<TextInputProps, "multiline" | "editable"> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Quiet helper line under the field. Replaced by errorText when invalid. */
  helperText?: ReactNode;
  /** Red helper line under the field; pairs with `invalid`. */
  errorText?: ReactNode;
  /** Green helper line under the field; pairs with `valid`. */
  successText?: ReactNode;
  /** Tints the field red, colors the focus border red, swaps the helper for the error. */
  invalid?: boolean;
  /** Tints the field green and colors the focus border green. Ignored when invalid is set. */
  valid?: boolean;
  /** Control height. sm pairs with dense toolbars, lg with marketing pages. */
  size?: FieldSize;
  /** Minimum visible lines before the field grows. */
  minLines?: number;
  /** Show "n / maxLength" under the field when maxLength is set. */
  showCount?: boolean;
  disabled?: boolean;
  /** NativeWind passthrough, forwarded to the outer wrapper. */
  className?: string;
}

const fieldSizes: Record<
  FieldSize,
  { minHeight: number; paddingHorizontal: number; paddingVertical: number; fontSize: number; borderRadius: number }
> = {
  sm: {
    minHeight: 68,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: fontSize.small,
    borderRadius: radius.fieldSm,
  },
  md: {
    minHeight: 88,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: fontSize.body,
    borderRadius: radius.fieldMd,
  },
  lg: {
    minHeight: 108,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: fontSize.body,
    borderRadius: radius.fieldLg,
  },
};

/**
 * Multiline text field with the web Textarea's chrome: label above,
 * helper / error / success line below, invalid and valid tints, and
 * a live "n / maxLength" count. The field grows with its content
 * (minLines sets the resting height; the OS grows it from there).
 *
 * Deliberate divergence from the web library: the web textarea
 * offers resize handles and four visual variants. Native text
 * inputs have no resize affordance, so the kit ships the fill
 * treatment with the same constant-border focus translation the
 * native Input uses: transparent at rest, accent (or danger /
 * success) on focus.
 */
export const Textarea = forwardRef<
  ComponentRef<typeof TextInput>,
  TextareaProps
>(function Textarea(
  {
    label,
    helperText,
    errorText,
    successText,
    invalid,
    valid,
    size = "md",
    minLines = 3,
    showCount = false,
    disabled,
    value: controlledValue,
    defaultValue,
    maxLength,
    onChangeText,
    onFocus,
    onBlur,
    style,
    className,
    ...props
  },
  ref,
) {
  const theme = usePollenTheme();
  const c = theme.colors;
  const s = fieldSizes[size];

  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");

  const isControlled = controlledValue !== undefined;
  const current = isControlled ? (controlledValue ?? "") : uncontrolled;
  const locked = disabled === true;

  const update = (text: string) => {
    if (!isControlled) setUncontrolled(text);
    onChangeText?.(text);
  };

  const state = invalid ? "danger" : valid ? "success" : "neutral";
  const stateColor =
    state === "danger" ? c.danger : state === "success" ? c.success : c.accent;

  // Focus paints the border through the shared ease-out tween, the
  // native equivalent of the web focus ring. Driven straight from
  // the focus handlers, no render-state round trip.
  const focus = useSharedValue(0);

  const borderAnimated = useAnimatedStyle(() => ({
    borderColor:
      focus.value > 0.5
        ? stateColor
        : state === "danger"
          ? withAlpha(c.danger, 0.55)
          : state === "success"
            ? withAlpha(c.success, 0.55)
            : c.border,
    backgroundColor:
      focus.value > 0.5
        ? c.card
        : state === "danger"
          ? withAlpha(c.danger, 0.06)
          : state === "success"
            ? withAlpha(c.success, 0.06)
            : c.fill,
  }));

  const helper = invalid
    ? (errorText ?? helperText)
    : valid
      ? (successText ?? helperText)
      : helperText;
  const helperColor =
    state === "danger" ? c.danger : state === "success" ? c.success : c.fgMuted;

  return (
    <View {...passthroughClassName(className)} style={[styles.root, style]}>
      {label != null && (
        <Text
          style={[
            styles.label,
            { color: c.fg },
            locked && styles.textDisabled,
          ]}
        >
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.field,
          {
            borderRadius: s.borderRadius,
            minHeight: s.minHeight,
          },
          borderAnimated,
          locked && styles.fieldDisabled,
        ]}
      >
        <TextInput
          ref={ref}
          multiline
          editable={!locked}
          accessibilityLabel={
            props.accessibilityLabel ??
            (typeof label === "string" ? label : undefined)
          }
          value={isControlled ? current : undefined}
          defaultValue={isControlled ? undefined : current}
          maxLength={maxLength}
          onChangeText={update}
          onFocus={(e) => {
            focus.value = withTiming(1, fastTween());
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focus.value = withTiming(0, fastTween());
            onBlur?.(e);
          }}
          placeholderTextColor={c.fgFaint}
          style={[
            styles.input,
            {
              fontSize: s.fontSize,
              paddingHorizontal: s.paddingHorizontal,
              paddingVertical: s.paddingVertical,
              minHeight: minLines * Math.round(s.fontSize * 1.45),
              color: c.fg,
            },
          ]}
          {...props}
        />
        {showCount && maxLength !== undefined && (
          <Text
            style={[
              styles.count,
              { color: c.fgFaint, right: s.paddingHorizontal, bottom: 6 },
            ]}
          >
            {current.length} / {maxLength}
          </Text>
        )}
      </Animated.View>
      {helper != null && (
        <Text
          style={[
            styles.helper,
            { color: helperColor },
            locked && styles.textDisabled,
          ]}
        >
          {helper}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    alignSelf: "stretch",
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.small,
    fontWeight: "500",
    lineHeight: 20,
  },
  field: {
    borderWidth: 1,
  },
  input: {
    textAlignVertical: "top",
    flexShrink: 1,
  },
  count: {
    position: "absolute",
    fontSize: fontSize.caption,
    fontVariant: ["tabular-nums"],
    backgroundColor: "transparent",
  },
  helper: {
    fontSize: fontSize.caption,
    lineHeight: 17,
  },
  fieldDisabled: {
    opacity: 0.55,
  },
  textDisabled: {
    opacity: 0.5,
  },
});

Textarea.displayName = "Textarea";
