/**
 * React Native usage for the components that exist in @pollen/native.
 * Keyed by the web registry slug - the key exists only when the native
 * package really ships the component, and every import below is checked
 * against the real native index by scripts/generate-docs-data.mjs.
 * Every snippet compiles against the real package exports.
 */

export interface NativeUsage {
  /** A runnable RN example. */
  code: string;
}

export const nativeUsage: Record<string, NativeUsage> = {
  button: {
    code: `import { Button } from "@pollen/native";

export function Example() {
  return (
    <Button
      variant="primary"
      size="md"
      loadingText="Saving"
      loading={false}
      onPress={() => save()}
    >
      Save changes
    </Button>
  );
}`,
  },
  input: {
    code: `import { useState } from "react";
import { Input } from "@pollen/native";

export function Example() {
  const [email, setEmail] = useState("");
  return (
    <Input
      label="Email"
      size="md"
      helperText="We only use this for the receipt."
      value={email}
      placeholder="you@studio.com"
      onChangeText={setEmail}
    />
  );
}`,
  },
  badge: {
    code: `import { Badge } from "@pollen/native";

export function Example() {
  return (
    <Badge size="md" dot count={12} max={99}>
      Updates
    </Badge>
  );
}`,
  },
  avatar: {
    code: `import { Avatar, AvatarGroup } from "@pollen/native";

export function Example() {
  return (
    <AvatarGroup>
      {/* src accepts any reachable image URL; the name is the
          accessible label and initials appear if it fails. */}
      <Avatar fallback="Ada Lovelace" size={36} status="online" />
      <Avatar fallback="Grace Hopper" size={36} status="away" />
      <Avatar fallback="Alan Turing" size={36} shape="square" />
    </AvatarGroup>
  );
}`,
  },
  switch: {
    code: `import { Switch } from "@pollen/native";

export function Example() {
  const [on, setOn] = useState(true);
  return (
    <Switch
      checked={on}
      onCheckedChange={setOn}
      color="accent"
      size="md"
      description="New deploys notify the whole channel."
    >
      Deploy notifications
    </Switch>
  );
}`,
  },
  slider: {
    code: `import { Slider } from "@pollen/native";

export function Example() {
  const [volume, setVolume] = useState(40);
  return (
    <Slider
      value={volume}
      min={0}
      max={100}
      step={1}
      onValueChange={setVolume}
      accessibilityLabel="Volume"
    />
  );
}`,
  },
  progress: {
    code: `import { Progress } from "@pollen/native";

export function Example() {
  return <Progress value={62} max={100} size="md" showValue />;
}`,
  },
  skeleton: {
    code: `import { Skeleton, SkeletonText } from "@pollen/native";

export function LoadingProfile() {
  return (
    <>
      <Skeleton shape="circle" effect="pulse" style={{ width: 48, height: 48 }} />
      <SkeletonText lines={3} effect="pulse" />
    </>
  );
}`,
  },
  card: {
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@pollen/native";
import { Button } from "@pollen/native";

export function Example() {
  return (
    <Card depth="md">
      <CardHeader>
        <CardTitle>Deploy ready</CardTitle>
        <CardDescription>pollen-web built in 42 seconds.</CardDescription>
      </CardHeader>
      <CardContent>
        14 files changed, all checks green.
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm" onPress={() => promote()}>
          Promote
        </Button>
      </CardFooter>
    </Card>
  );
}`,
  },
  checkbox: {
    code: `import { useState } from "react";
import { Checkbox } from "@pollen/native";

export function Example() {
  const [agreed, setAgreed] = useState(false);
  return (
    <Checkbox
      checked={agreed}
      onCheckedChange={setAgreed}
      color="accent"
      description="Required for team accounts."
    >
      I agree to the workspace terms
    </Checkbox>
  );
}`,
  },
  "radio-group": {
    code: `import { RadioGroup, Radio } from "@pollen/native";

export function Example() {
  const [plan, setPlan] = useState("team");
  return (
    <RadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
      <Radio value="team">Team plan</Radio>
      <Radio value="org">Organization plan</Radio>
      <Radio value="personal" disabled>
        Personal plan
      </Radio>
    </RadioGroup>
  );
}`,
  },
  textarea: {
    code: `import { useState } from "react";
import { Textarea } from "@pollen/native";

export function Example() {
  const [notes, setNotes] = useState("");
  return (
    <Textarea
      label="Release notes"
      helperText="Shown to everyone in the workspace."
      minLines={4}
      maxLength={280}
      showCount
      value={notes}
      onChangeText={setNotes}
    />
  );
}`,
  },
  "segmented-control": {
    code: `import { useState } from "react";
import { SegmentedControl } from "@pollen/native";

export function Example() {
  const [range, setRange] = useState("week");
  return (
    <SegmentedControl
      aria-label="Range"
      shape="pill"
      fullWidth
      value={range}
      onValueChange={setRange}
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
    />
  );
}`,
  },
  "otp-input": {
    code: `import { PinInput } from "@pollen/native";

export function Example() {
  return (
    <PinInput
      length={6}
      secret={false}
      aria-label="Verification code"
      onComplete={(code) => verify(code)}
    />
  );
}`,
  },
  rating: {
    code: `import { Rating } from "@pollen/native";

export function Example() {
  const [score, setScore] = useState(0);
  return (
    <Rating
      max={5}
      value={score}
      onValueChange={setScore}
      labels={["Poor", "Fair", "Good", "Great", "Excellent"]}
      caption="1,204 reviews"
    />
  );
}`,
  },
  stepper: {
    code: `import { Stepper } from "@pollen/native";

export function Example() {
  const [seats, setSeats] = useState(3);
  return (
    <Stepper
      aria-label="Seats"
      min={1}
      max={20}
      step={1}
      value={seats}
      onValueChange={setSeats}
    />
  );
}`,
  },
};
