# @pollen/native

The Pollen design language on iOS and Android. React Native primitives
that share their colors, shadows, spacing and springs with the web
library through `@pollen/tokens` — same achromatic palette, same single
blue accent, same layered elevation, same spring character.

Each primitive is implemented with platform APIs: press feedback
through Reanimated springs, shadows mapped to `shadowColor`/`elevation`
pairs per platform, gesture work through react-native-gesture-handler.

This package is part of the [Pollen UI monorepo](https://github.com/1-Pankaj/pollen-ui)
and is not published to npm — the TypeScript source in `packages/native/src`
is the distribution, which Metro and Expo compile directly.

## Components

| Component | Variants | Notes |
| --- | --- | --- |
| `Button` | primary, secondary, outline, ghost | sm/md/lg, loading state, left/right icon slots |
| `Badge` | neutral, accent, success, warning, danger, solid | sm/md/lg |
| `Input` | — | label, helper/error/success lines, password reveal, sm/md/lg |
| `Textarea` | — | label, helper/error/success lines, minLines growth, "n / max" count |
| `Switch` | accent, neutral, success | sm/md/lg, track color animates through the same spring as the thumb |
| `Checkbox` | accent, neutral, success | sm/md/lg default box, indeterminate dash, optional selectable card |
| `RadioGroup`, `Radio` | — | spring-filled dot, radiogroup + radio roles for VoiceOver/TalkBack |
| `Slider` | — | press-to-jump and drag, step snapping, adjustable accessibility actions |
| `Progress` | neutral, accent, success | xs/sm/md |
| `Skeleton`, `SkeletonText` | rect, circle, text | pulse respects reduced motion |
| `Avatar`, `AvatarGroup` | fill, accent, inverted | circle/square, online/away/busy/offline status dot, +N overflow chip |
| `Card` + Header/Title/Description/Content/Footer | card, fill | token spacing rhythm, depth mapped through the shared shadow tokens |
| `SegmentedControl` | rounded, pill | spring thumb, fraction-sized like UISegmentedControl, RTL-aware |
| `PinInput` | sm/md/lg | one real TextInput + display cells: paste, autofill and OTP all work |
| `Rating` | star, heart | role="adjustable" with increment/decrement actions |
| `Stepper` | sm/md/lg | plus/minus ends grey out at min/max, value bumps on a spring |

## Requirements

- React Native 0.74 or newer (tested against 0.88)
- react-native-reanimated 3.16 or newer
- react-native-gesture-handler 2.20 or newer (Slider)
- Optional: NativeWind 4 for the `className` passthrough

With Expo, install the peers with:

```bash
npx expo install react-native-reanimated react-native-gesture-handler
```

The package ships TypeScript source, which Metro and Expo compile
directly — no build step and no native module of its own.

## Usage

```tsx
import { View, ScrollView } from "react-native";
import { Button, Input, Switch, usePollenTheme } from "@pollen/native";

export default function SignIn() {
  const theme = usePollenTheme();

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: theme.colors.bg, padding: 24, gap: 16 }}>
      <Input label="Email" placeholder="you@studio.com" />
      <Input label="Password" type="password" passwordToggle />
      <Button fullWidth>Sign in</Button>
      <Switch defaultChecked>Stay signed in</Switch>
    </ScrollView>
  );
}
```

## Dark mode

Call `usePollenTheme()` wherever the theme is needed; combine it with
`useColorScheme()` from React Native and render with `dark` on your
root:

```tsx
import { useColorScheme } from "react-native";
import { dark, light, type PollenTheme } from "@pollen/tokens";
import { usePollenTheme } from "@pollen/native";

// A minimal provider: flip once at the root, read anywhere below.
export function useAppTheme(): PollenTheme {
  const scheme = useColorScheme();
  return scheme === "dark" ? dark : light;
}
```

Every component reads theme values on render, so a scheme change
re-renders them with the dark palette automatically.

## Design divergences from the web library

Where iOS and Android differ from the browser, the native package
follows the platform and documents it:

- Hover treatments do not apply; press feedback is a 0.97 scale on a
  snappy spring instead.
- The web Input's `underline` and `ghost` variants are not carried
  over; the native fields use the fill treatment with a focus border.
- The web Slider's two-thumb range, vertical rail, tick marks and value
  bubble are not carried over; the native control is the single-thumb
  case.
- The web Rating draws four SVG glyphs with fractional fill; native
  ships the two monochrome unicode glyphs (star, heart) with
  whole-star fill.
- The web SegmentedControl measures the DOM; the native thumb is sized
  as a fraction of the track, the way UISegmentedControl behaves.
- GSAP-era motion has no equivalent here; springs map to Reanimated
  spring configs from the shared tokens.

## License

MIT — see [LICENSE](LICENSE). Part of the
[Pollen UI](https://github.com/1-Pankaj/pollen-ui) monorepo.
