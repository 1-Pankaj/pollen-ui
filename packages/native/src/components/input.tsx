import { forwardRef, type ComponentRef, useState, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { fontSize, radius, spacing } from "@pollen/tokens";
import { usePollenTheme, withAlpha } from "../lib/theme";
import { passthroughClassName } from "../lib/className";

export type FieldSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<TextInputProps, "editable" | "secureTextEntry"> {
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
  /** Only "text" and "password" are modeled; password enables the reveal toggle when passwordToggle is set. */
  type?: "text" | "password";
  /** With type="password", adds a Show/Hide toggle that reveals the value. */
  passwordToggle?: boolean;
  disabled?: boolean;
  /** NativeWind passthrough, forwarded to the outer wrapper. */
  className?: string;
}

const fieldSizes: Record<
  FieldSize,
  { height: number; paddingHorizontal: number; fontSize: number; borderRadius: number }
> = {
  sm: {
    height: 36,
    paddingHorizontal: 12,
    fontSize: fontSize.small,
    borderRadius: radius.fieldSm,
  },
  md: {
    height: 44,
    paddingHorizontal: 14,
    fontSize: fontSize.body,
    borderRadius: radius.fieldMd,
  },
  lg: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: fontSize.body,
    borderRadius: radius.fieldLg,
  },
};

/**
 * Single-line text field with the web Input's chrome: a label
 * above, a helper / error / success line below, invalid and valid
 * tints, and a Show/Hide reveal for passwords. Controlled and
 * uncontrolled values both work (value + onChangeText, or
 * defaultValue alone).
 *
 * Deliberate divergence from the web library: the web "fill"
 * variant has no border and signals focus with a soft ring. React
 * Native has no focus ring, so the field carries a constant 1px
 * border that is transparent at rest and turns accent on focus
 * (danger when invalid, success when valid). That hairline is the
 * native equivalent of the web focus ring; everything
 * else (fill to card background shift on focus) matches the web.
 */
export const Input = forwardRef<
  ComponentRef<typeof TextInput>,
  InputProps
>(function Input(
  {
    label,
    helperText,
    errorText,
    successText,
    invalid,
    valid,
    size = "md",
    type,
    passwordToggle,
    disabled,
    value: controlledValue,
    defaultValue,
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

  const [focused, setFocused] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const [revealed, setRevealed] = useState(false);

  const isControlled = controlledValue !== undefined;
  const current = isControlled ? (controlledValue ?? "") : uncontrolled;
  const isPassword = type === "password";
  const showToggle = isPassword && passwordToggle === true && disabled !== true;
  const locked = disabled === true;

  const update = (text: string) => {
    if (!isControlled) setUncontrolled(text);
    onChangeText?.(text);
  };

  const fieldBackground = invalid
    ? withAlpha(c.danger, 0.08)
    : valid
      ? withAlpha(c.success, 0.08)
      : focused
        ? c.card
        : c.fill;
  const borderColor = invalid
    ? c.danger
    : valid
      ? c.success
      : focused
        ? c.accent
        : "transparent";

  const desc =
    invalid && errorText !== undefined ? (
      { text: errorText, color: c.danger }
    ) : valid && !invalid && successText !== undefined ? (
      { text: successText, color: c.successInk }
    ) : helperText !== undefined ? (
      { text: helperText, color: c.fgMuted }
    ) : null;

  return (
    <View
      {...passthroughClassName(className)}
      style={[styles.wrap, locked && styles.disabled]}
    >
      {label != null && (
        <Text style={[styles.label, { color: c.fg }]}>{label}</Text>
      )}
      <View
        style={[
          styles.field,
          {
            height: s.height,
            paddingHorizontal: s.paddingHorizontal,
            borderRadius: s.borderRadius,
            backgroundColor: fieldBackground,
            borderColor,
          },
        ]}
      >
        <TextInput
          ref={ref}
          {...props}
          value={isControlled ? current : undefined}
          defaultValue={isControlled ? undefined : current}
          onChangeText={update}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          editable={!locked}
          secureTextEntry={isPassword && !revealed}
          placeholderTextColor={c.fgFaint}
          selectionColor={c.accent}
          underlineColorAndroid="transparent"
          accessibilityLabel={
            props.accessibilityLabel ??
            (typeof label === "string" ? label : undefined)
          }
          style={[styles.input, style, { fontSize: s.fontSize, color: c.fg }]}
        />
        {showToggle && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? "Hide password" : "Show password"}
            accessibilityState={{ selected: revealed }}
            hitSlop={spacing.xs}
            onPress={() => setRevealed((r) => !r)}
            style={styles.toggle}
          >
            <Text style={[styles.toggleText, { color: c.fgMuted }]}>
              {revealed ? "Hide" : "Show"}
            </Text>
          </Pressable>
        )}
      </View>
      {desc !== null && (
        <Text style={[styles.desc, { color: desc.color }]}>{desc.text}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: fontSize.label,
    fontWeight: "500",
    marginBottom: 6,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    padding: 0,
    textAlignVertical: "center",
  },
  toggle: {
    marginLeft: spacing.sm,
  },
  toggleText: {
    fontSize: fontSize.caption,
    fontWeight: "500",
  },
  desc: {
    fontSize: fontSize.caption,
    lineHeight: 18,
    marginTop: 6,
  },
});

Input.displayName = "Input";
