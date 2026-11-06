import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { fontSize, radius, spacing } from "@pollen-ui/tokens";
import { usePollenTheme, withAlpha } from "../lib/theme";
import { springSnappyConfig } from "../lib/motion";
import { passthroughClassName } from "../lib/className";

export type PinInputSize = "sm" | "md" | "lg";

export interface PinInputProps {
  /** Number of cells. Default 6. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once the last cell is filled. */
  onComplete?: (value: string) => void;
  /** Mask the cells as you type, like a password field. */
  secret?: boolean;
  /** Cell size. Default md. */
  size?: PinInputSize;
  disabled?: boolean;
  /** Tints the cells red - the code did not verify. */
  invalid?: boolean;
  /** Accessible name for the single field. Default "Verification code". */
  "aria-label"?: string;
  /** NativeWind passthrough, forwarded to the row of cells. */
  className?: string;
}

const cellSizes: Record<PinInputSize, { cell: number; fontSize: number; gap: number }> = {
  sm: { cell: 36, fontSize: fontSize.small, gap: spacing.xs },
  md: { cell: 44, fontSize: fontSize.body, gap: spacing.sm },
  lg: { cell: 52, fontSize: 20, gap: spacing.sm },
};

/**
 * A verification-code field, the way mobile apps actually ship it:
 * one real TextInput captures the code (so paste, autofill and the
 * system keyboard all work untouched - textContentType="oneTimeCode"
 * even picks up the SMS code) and the cells are a display of its
 * value. Separate TextInputs per cell are the classic native trap -
 * paste breaks, autofill breaks, focus bounces - so the kit does
 * what the platform does.
 *
 * Accessibility: one field, one label, "n of m digits filled" as
 * the value. No screen reader has to hop between six boxes.
 */
export function PinInput({
  length = 6,
  value: controlled,
  defaultValue = "",
  onValueChange,
  onComplete,
  secret = false,
  size = "md",
  disabled = false,
  invalid = false,
  "aria-label": ariaLabel = "Verification code",
  className,
}: PinInputProps) {
  const theme = usePollenTheme();
  const c = theme.colors;
  const s = cellSizes[size];
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue.slice(0, length),
  );
  const [focused, setFocused] = useState(false);

  const isControlled = controlled !== undefined;
  const current = (isControlled ? controlled : uncontrolled).slice(0, length);
  const filled = current.length;

  const update = (text: string) => {
    // Digits only; the paste path lands here too, so a six-digit
    // SMS code pasted into one field still fills every cell.
    const next = text.replace(/\D/g, "").slice(0, length);
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const cellColor = invalid
    ? c.danger
    : focused
      ? c.accent
      : c.borderStrong;

  return (
    <View
      {...passthroughClassName(className)}
      style={[styles.row, { gap: s.gap }]}
    >
      {Array.from({ length }, (_, i) => (
        <DigitCell
          key={i}
          digit={secret && i < filled ? "•" : (current[i] ?? "")}
          hasDigit={i < filled}
          active={focused && i === filled}
          width={s.cell}
          fontSize={s.fontSize}
          borderColor={i < filled || (focused && i === filled) ? cellColor : c.border}
          bgColor={i < filled ? c.card : c.fill}
          fg={c.fg}
          invalid={invalid}
          danger={c.danger}
        />
      ))}
      <TextInput
        accessibilityLabel={ariaLabel}
        accessibilityValue={{
          min: 0,
          max: length,
          now: filled,
          text: `${filled} of ${length} digits filled`,
        }}
        editable={!disabled}
        value={current}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={update}
        // The field is the source of truth; the cells are its face.
        style={styles.hidden}
      />
    </View>
  );
}

function DigitCell({
  digit,
  hasDigit,
  active,
  width,
  fontSize: fs,
  borderColor,
  bgColor,
  fg,
  invalid,
  danger,
}: {
  digit: string;
  hasDigit: boolean;
  active: boolean;
  width: number;
  fontSize: number;
  borderColor: string;
  bgColor: string;
  fg: string;
  invalid: boolean;
  danger: string;
}) {
  // The digit lands with a small overshoot: scale snaps to 1.35 the
  // moment a digit arrives, then springs home. Driven by hasDigit,
  // so every fill animates, not just the first.
  const scale = useSharedValue(hasDigit ? 1 : 0);
  useEffect(() => {
    if (hasDigit) {
      scale.value = 1.35;
      scale.value = withSpring(1, springSnappyConfig);
    } else {
      scale.value = 0;
    }
  }, [hasDigit, scale]);

  const digitAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <View
      style={[
        styles.cell,
        {
          width,
          height: width,
          borderRadius: radius.fieldMd,
          borderColor: invalid ? danger : borderColor,
          backgroundColor: invalid ? withAlpha(danger, 0.06) : bgColor,
        },
      ]}
    >
      {hasDigit ? (
        <Animated.Text
          style={[
            styles.digit,
            { fontSize: fs, color: invalid ? danger : fg },
            digitAnimated,
          ]}
        >
          {digit}
        </Animated.Text>
      ) : (
        <View
          style={[styles.caret, { backgroundColor: fg }, active && styles.caretOn]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  cell: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  digit: {
    fontWeight: "600",
  },
  caret: {
    width: 2,
    height: "45%",
    borderRadius: 1,
    opacity: 0,
  },
  caretOn: {
    opacity: 0.55,
  },
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});

PinInput.displayName = "PinInput";
