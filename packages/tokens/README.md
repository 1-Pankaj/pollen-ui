# @pollen-ui/tokens

The Pollen design language as plain data: colors, shadows, radii, spacing,
type sizes and motion presets, for whatever platform renders next.

> Published on npm as [`@pollen-ui/tokens`](https://www.npmjs.com/package/@pollen-ui/tokens).
> Web apps can also read the same values from `pollen-ui` itself:
> `import { light, dark, springSnappy } from "pollen-ui/tokens"`.

- **Zero dependencies.** Every value is a string or a number. Runs in the
  browser, in Node, and inside a React Native bundle.
- **One source of truth.** The web stylesheet
  `packages/pollen-ui/src/css/pollen.css` is canonical; this package mirrors
  it, and `scripts/check-tokens-sync.mjs` in the repository root fails when
  the two drift apart.
- **Framework-neutral motion.** The spring presets are plain
  stiffness/damping/mass objects — hand them to framer-motion as a
  `Transition`, or to react-native-reanimated as a `SpringConfig`.

```ts
import { light, dark, springSnappy } from "@pollen-ui/tokens";
import { useColorScheme } from "react-native";

const theme = useColorScheme() === "dark" ? dark : light;
theme.colors.card;   // "#161619" in dark, "#ffffff" in light
springSnappy;        // { stiffness: 400, damping: 32 }
```

Shadows are CSS box-shadow strings. React Native cannot read those directly;
`@pollen-ui/native` maps each depth to `shadowColor`/`shadowOffset`/
`shadowOpacity`/`elevation` in one place.

## License

MIT
