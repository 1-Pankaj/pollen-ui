/**
 * Starter templates for the playground. Each one uses only what
 * the playground scope provides: react, pollen-ui, lucide-react
 * and framer-motion.
 */

export interface PlaygroundExample {
  id: string;
  title: string;
  blurb: string;
  code: string;
}

export const examples: PlaygroundExample[] = [
  {
    id: "buttons",
    title: "Buttons",
    blurb: "Variants, sizes, loading",
    code: `import { Button } from "pollen-ui";
import {
  IconDeploy as Rocket,
  IconTrash as Trash2,
} from "pollen-ui";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-2.5">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
      </div>
      <div className="flex items-center gap-2.5">
        <Button size="sm">
          <Rocket className="h-3.5 w-3.5" /> Deploy
        </Button>
        <Button size="sm" loading>Deploying</Button>
        <Button size="sm" variant="outline">
          <Trash2 className="h-3.5 w-3.5" /> Discard
        </Button>
      </div>
    </div>
  );
}`,
  },  {
    id: "tpl-hero",
    title: "Hero template",
    blurb: "A launch hero from real components",
    code: `import { Badge, Button, Avatar, AvatarGroup } from "pollen-ui";
import { IconArrowRight as ArrowRight } from "pollen-ui";

export default function Demo() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <Badge variant="accent" dot>Introducing v4.0</Badge>
      <h1 className="mt-5 max-w-md text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em]">
        Ship your product, not your UI kit
      </h1>
      <p className="mt-4 max-w-sm text-balance text-[15px] leading-relaxed text-muted-foreground">
        One install gives your team every control, surface and
        motion curve it needs, in light and dark.
      </p>
      <div className="mt-6 flex items-center gap-2.5">
        <Button>
          Start building
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary">Live demo</Button>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <AvatarGroup max={4}>
          <Avatar size={26} fallback="MT" />
          <Avatar size={26} fallback="LP" />
          <Avatar size={26} fallback="AQ" />
          <Avatar size={26} fallback="BS" />
        </AvatarGroup>
        <p className="text-[13px] text-muted-foreground">
          Loved by <span className="font-medium text-foreground">12,400+</span> teams
        </p>
      </div>
    </div>
  );
}`,
  },
  {
    id: "tpl-shell",
    title: "App shell template",
    blurb: "Sidebar, top bar, and content",
    code: `import {
  Avatar, Badge, Button, Input, Kbd,
  IconWindow as Home, IconChat as Chat, IconBox as Box,
  IconGauge as Gauge, IconSearch as Search,
} from "pollen-ui";
import { cn } from "pollen-ui";

const sections = [
  { heading: "Workspace", items: [
    { icon: <Home className="h-4 w-4" />, label: "Overview", badge: 8 },
    { icon: <Chat className="h-4 w-4" />, label: "Threads" },
  ]},
  { heading: "Platform", items: [
    { icon: <Box className="h-4 w-4" />, label: "Apps" },
    { icon: <Gauge className="h-4 w-4" />, label: "Usage" },
  ]},
];

export default function Demo() {
  return (
    <div className="flex min-h-[360px] overflow-hidden rounded-2xl bg-background">
      <aside className="flex w-52 shrink-0 flex-col bg-card p-3 shadow-[var(--pollen-shadow-xs)]">
        <span className="flex items-center gap-2 px-2 py-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background text-[11px] font-bold">A</span>
          <span className="text-[13.5px] font-semibold">Atlas</span>
        </span>
        <div className="mt-2 flex h-8 items-center gap-2 rounded-lg bg-fill px-2.5 text-[12px] text-faint">
          <Search className="h-3.5 w-3.5" /> Search
          <Kbd className="ml-auto bg-card">⌘K</Kbd>
        </div>
        <nav className="mt-3 flex-1 space-y-3">
          {sections.map((s) => (
            <div key={s.heading}>
              <p className="px-2.5 pb-1 text-[10.5px] font-semibold uppercase tracking-wide text-faint">{s.heading}</p>
              {s.items.map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]",
                    item.label === "Overview"
                      ? "bg-fill font-medium text-foreground"
                      : "text-muted-foreground hover:bg-fill/60",
                  )}
                >
                  <span className={item.label === "Overview" ? "text-accent" : "text-faint"}>{item.icon}</span>
                  {item.label}
                  {item.badge && <Badge count={item.badge} size="sm" className="ml-auto" />}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 rounded-xl bg-fill/70 p-2.5">
          <Avatar size={28} fallback="JD" />
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium">Jordan Diaz</p>
            <p className="truncate text-[10.5px] text-faint">jordan@atlas.dev</p>
          </div>
        </div>
      </aside>
      <div className="flex-1 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-[-0.01em]">Overview</h2>
          <Button size="sm">New project</Button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {["Builds", "Deploys", "Uptime"].map((k, i) => (
            <div key={k} className="rounded-xl bg-card p-3.5 shadow-[var(--pollen-shadow-xs)]">
              <p className="text-[11.5px] text-muted-foreground">{k}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{[128, 42, "99.98%"][i]}</p>
            </div>
          ))}
        </div>
        <Input className="mt-4" placeholder="Filter projects" clearable />
      </div>
    </div>
  );
}`,
  },
  {
    id: "tpl-faq",
    title: "FAQ template",
    blurb: "Accordion variants in a section",
    code: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "pollen-ui";

const faqs = [
  { q: "Can I use Pollen commercially?", a: "Yes. MIT licensed, no attribution required." },
  { q: "Does it work with Tailwind v4?", a: "It targets v4 and ships tokens as CSS variables." },
  { q: "How do themes work?", a: "Light and dark are two token sets under .light and .dark." },
];

export default function Demo() {
  return (
    <div className="mx-auto max-w-md py-8">
      <h2 className="text-center text-2xl font-semibold tracking-[-0.02em]">
        Answers, before the email
      </h2>
      <div className="mt-6">
        <Accordion type="single" defaultValue={["faq-1"]} variant="card" icon="chevron">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={\"faq-\" + (i + 1)}>
              <AccordionTrigger value={\"faq-\" + (i + 1)}>{f.q}</AccordionTrigger>
              <AccordionContent value={\"faq-\" + (i + 1)}>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}`,
  },
  {
    id: "form",
    title: "Sign-up form",
    blurb: "Fields, validation, states",
    code: `import { useState } from "react";
import { Button, Checkbox, Input, Label } from "pollen-ui";
import {
  IconMail as Mail,
  IconLock as Lock,
} from "pollen-ui";

export default function Demo() {
  const [email, setEmail] = useState("");
  const invalid = email.length > 3 && !email.includes("@");

  return (
    <form
      className="w-full max-w-[320px] space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <Label htmlFor="pg-email">Work email</Label>
        <Input
          id="pg-email"
          className="mt-2"
          placeholder="you@company.com"
          icon={<Mail />}
          value={email}
          invalid={invalid}
          onChange={(e) => setEmail(e.target.value)}
        />
        {invalid && (
          <p className="mt-1.5 text-xs text-danger-ink">
            That does not look like an email address.
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="pg-pass">Password</Label>
        <Input id="pg-pass" type="password" className="mt-2" icon={<Lock />} placeholder="••••••••" />
      </div>
      <Checkbox defaultChecked>Send me the changelog</Checkbox>
      <Button className="w-full" disabled={invalid}>
        Create account
      </Button>
    </form>
  );
}`,
  },
  {
    id: "pricing",
    title: "Pricing card",
    blurb: "Card, badge, list, CTA",
    code: `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "pollen-ui";
import {
  IconCheck as Check,
} from "pollen-ui";

export default function Demo() {
  const features = ["Unlimited projects", "Edge deploys", "Preview URLs", "Analytics"];

  return (
    <Card className="w-full max-w-[320px] text-left">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pro</CardTitle>
          <Badge variant="accent">Popular</Badge>
        </div>
        <CardDescription>For teams shipping every week.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">
          $20<span className="text-sm font-normal text-muted-foreground"> / user / month</span>
        </p>
        <ul className="mt-4 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-foreground" /> {f}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Start free trial</Button>
      </CardFooter>
    </Card>
  );
}`,
  },
  {
    id: "toasts",
    title: "Toasts",
    blurb: "Variants, actions, promise",
    code: `import { Button, toast } from "pollen-ui";

export default function Demo() {
  const fire = (kind: string) => {
    if (kind === "success") {
      toast.success("Deployment complete", {
        description: "pollen-web is live on the edge network.",
      });
    } else if (kind === "error") {
      toast.error("Build failed", {
        description: "Type error in app/page.tsx, line 42.",
      });
    } else if (kind === "action") {
      toast("Invite sent", {
        description: "mira@pollen.dev will get an email shortly.",
        action: { label: "Undo", onClick: () => toast("Invite revoked") },
      });
    } else {
      toast.promise(
        new Promise((r) => setTimeout(r, 1400)),
        { loading: "Running checks…", success: "All checks passed" },
      );
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      <Button variant="secondary" onClick={() => fire("success")}>Success</Button>
      <Button variant="secondary" onClick={() => fire("error")}>Error</Button>
      <Button variant="secondary" onClick={() => fire("action")}>Action</Button>
      <Button variant="secondary" onClick={() => fire("promise")}>Promise</Button>
    </div>
  );
}`,
  },
  {
    id: "dashboard",
    title: "Dashboard bits",
    blurb: "Tabs, stat, progress, table",
    code: `import {
  Progress,
  SegmentedControl,
  Stat,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "pollen-ui";

export default function Demo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-[420px] text-left">
      <TabsList aria-label="Dashboard">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-5 pt-4">
        <div className="grid grid-cols-2 gap-5">
          <Stat value="48,201" label="Requests" delta={12.4} />
          <Stat value="99.98%" label="Uptime" delta={0.02} />
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span>Bandwidth</span><span>62%</span>
          </div>
          <Progress value={62} />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-fill p-3.5">
          <span className="text-sm font-medium">Auto deploy</span>
          <Switch defaultChecked aria-label="Auto deploy" />
        </div>
      </TabsContent>
      <TabsContent value="team" className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>Jo Chen</TableCell><TableCell>Owner</TableCell></TableRow>
            <TableRow><TableCell>Sam Ortiz</TableCell><TableCell>Developer</TableCell></TableRow>
            <TableRow><TableCell>Rae Kim</TableCell><TableCell>Viewer</TableCell></TableRow>
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}`,
  },
  {
    id: "motion",
    title: "Motion",
    blurb: "Reveal, springs, ticker",
    code: `import { NumberTicker, Reveal, TextReveal } from "pollen-ui";
import { motion } from "framer-motion";

export default function Demo() {
  return (
    <div className="space-y-8 text-center">
      <TextReveal text="Motion with intent" className="text-3xl font-semibold" />
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-fill text-2xl"
      >
        ✱
      </motion.div>
      <Reveal>
        <p className="text-4xl font-semibold">
          <NumberTicker value={23.4} decimals={1} suffix=" kB" />
        </p>
      </Reveal>
    </div>
  );
}`,
  },
  {
    id: "popover",
    title: "Popover + combobox",
    blurb: "Portaled overlays",
    code: `import { useState } from "react";
import { Button, Combobox, Input, Label, Popover } from "pollen-ui";

export default function Demo() {
  const [role, setRole] = useState("developer");

  return (
    <div className="flex items-center gap-3">
      <Popover trigger={<Button variant="outline">Add teammate</Button>}>
        <div className="w-64 text-left">
          <Label htmlFor="pg-name">Name</Label>
          <Input id="pg-name" placeholder="Mira Patel" className="mt-2" />
          <p className="mt-3 mb-2 text-[13px] font-medium">Role</p>
          <Combobox
            aria-label="Role"
            className="w-full"
            value={role}
            onValueChange={setRole}
            options={[
              { value: "developer", label: "Developer" },
              { value: "designer", label: "Designer" },
              { value: "viewer", label: "Viewer" },
            ]}
          />
          <Button size="sm" className="mt-4 w-full">Send invite</Button>
        </div>
      </Popover>
      <p className="text-sm text-muted-foreground">Role: {role}</p>
    </div>
  );
}`,
  },
];
