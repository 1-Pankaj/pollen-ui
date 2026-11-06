/**
 * @pollen/native
 * The Pollen design language on iOS and Android. Sixteen primitives
 * that share their colors, shadows, spacing and springs with the
 * web library through @pollen/tokens.
 *
 * Requires react-native >= 0.74 and react-native-reanimated >= 3.16
 * (plus react-native-gesture-handler >= 2.20 for the Slider).
 * Under Expo, NativeWind 4 provides the className passthrough.
 */

// Primitives
export { Avatar, type AvatarProps } from "./components/avatar";
export {
  AvatarGroup,
  type AvatarGroupProps,
} from "./components/avatar";
export {
  Badge,
  type BadgeProps,
  type BadgeVariant,
  type BadgeSize,
} from "./components/badge";
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./components/button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardDepth,
} from "./components/card";
export {
  Checkbox,
  type CheckboxProps,
  type CheckboxColor,
} from "./components/checkbox";
export { Input, type InputProps, type FieldSize } from "./components/input";
export {
  PinInput,
  type PinInputProps,
  type PinInputSize,
} from "./components/pin-input";
export {
  Progress,
  type ProgressProps,
  type ProgressSize,
  type ProgressColor,
} from "./components/progress";
export {
  RadioGroup,
  Radio,
  type RadioGroupProps,
  type RadioProps,
} from "./components/radio-group";
export {
  Rating,
  type RatingProps,
  type RatingGlyph,
} from "./components/rating";
export {
  SegmentedControl,
  type SegmentedControlProps,
} from "./components/segmented-control";
export {
  Skeleton,
  type SkeletonProps,
  type SkeletonShape,
} from "./components/skeleton";
export {
  SkeletonText,
  type SkeletonTextProps,
  type SkeletonEffect,
} from "./components/skeleton";
export { Slider, type SliderProps } from "./components/slider";
export {
  Stepper,
  type StepperProps,
  type StepperSize,
} from "./components/stepper";
export {
  Switch,
  type SwitchProps,
  type SwitchSize,
  type SwitchColor,
} from "./components/switch";
export {
  Textarea,
  type TextareaProps,
} from "./components/textarea";

// Theme access
export {
  usePollenTheme,
  withAlpha,
  white,
} from "./lib/theme";
export {
  mapShadow,
  mapShadowString,
  type ShadowDepth,
  type ShadowStyle,
} from "./lib/shadows";
export type { PollenTheme } from "@pollen/tokens";
