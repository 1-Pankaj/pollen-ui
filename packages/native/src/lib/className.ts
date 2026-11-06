/**
 * NativeWind passthrough helper.
 *
 * Components accept a `className` prop for consumers running
 * NativeWind. NativeWind v4 intercepts className at the JSX runtime
 * of the app (jsxImportSource), so forwarding the prop to the root
 * element is all that is needed. Without NativeWind installed the
 * prop is simply never set: the helper returns undefined for an
 * unset className, and spreading undefined is a no-op, so the
 * components stay fully functional on StyleSheet + tokens alone.
 *
 * The object is spread rather than assigned so TypeScript accepts it
 * on React Native core elements, whose props have no className
 * outside a NativeWind-typed project.
 */
export function passthroughClassName(
  className?: string,
): { className: string } | undefined {
  return className === undefined ? undefined : { className };
}
