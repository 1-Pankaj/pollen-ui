/**
 * Pollen Icons
 *
 * A hand-drawn icon set that ships with the library. Every glyph is
 * drawn on a 24px grid with a 1.7px stroke, round joins, and a small
 * filled "grain" dot on select glyphs - the seed motif that ties the
 * set to the brand. No third-party icon fonts, no copies: if a glyph
 * is here, it was drawn for Pollen.
 */

import type { ReactNode, SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

function make(children: ReactNode) {
  return function Icon({ size = 24, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {children}
      </svg>
    );
  };
}

/** A filled grain dot, the Pollen signature. */
function Grain({ cx, cy, r = 1.5 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;
}

/* ---------- core UI glyphs ---------- */

export const IconCheck = make(<path d="M5 12.8 10.1 18 19 6.8" />);
export const IconClose = make(
  <g>
    <path d="M6.6 6.6 17.4 17.4" />
    <path d="M17.4 6.6 6.6 17.4" />
  </g>,
);
export const IconPlus = make(
  <g>
    <path d="M12 5.6v12.8" />
    <path d="M5.6 12h12.8" />
  </g>,
);
export const IconMinus = make(<path d="M5.6 12h12.8" />);
export const IconChevronDown = make(<path d="m7.2 10 4.8 4.9L16.8 10" />);
export const IconChevronUp = make(<path d="m7.2 14 4.8-4.9L16.8 14" />);
export const IconChevronLeft = make(<path d="M14 7.2 9.1 12l4.9 4.8" />);
export const IconChevronRight = make(<path d="m10 7.2 4.9 4.8-4.9 4.8" />);
export const IconSearch = make(
  <g>
    <circle cx="11" cy="11" r="6.1" />
    <path d="m15.7 15.7 4 4" />
    <Grain cx={9.2} cy={9.2} r={1.1} />
  </g>,
);
export const IconDots = make(
  <g>
    <Grain cx={5.4} cy={12} r={1.5} />
    <Grain cx={12} cy={12} r={1.5} />
    <Grain cx={18.6} cy={12} r={1.5} />
  </g>,
);
export const IconCopy = make(
  <g>
    <rect x="8.8" y="8.8" width="11.4" height="11.4" rx="3" />
    <path d="M5.5 15.2h-.2A2.3 2.3 0 0 1 3 12.9V5.3A2.3 2.3 0 0 1 5.3 3h7.6a2.3 2.3 0 0 1 2.3 2.3v.2" />
  </g>,
);
export const IconArrowRight = make(
  <g>
    <path d="M4.8 12h14" />
    <path d="m13.4 6.6 5.4 5.4-5.4 5.4" />
  </g>,
);
export const IconArrowLeft = make(
  <g>
    <path d="M19.2 12h-14" />
    <path d="M10.6 6.6 5.2 12l5.4 5.4" />
  </g>,
);
export const IconArrowUpRight = make(
  <g>
    <path d="M6.8 17.2 17.2 6.8" />
    <path d="M8.6 6.8h8.6v8.6" />
  </g>,
);
export const IconArrowDownRight = make(
  <g>
    <path d="M6.8 6.8l10.4 10.4" />
    <path d="M17.2 8.6v8.6H8.6" />
  </g>,
);
export const IconInfo = make(
  <g>
    <circle cx="12" cy="12" r="8.4" />
    <Grain cx={12} cy={8.3} r={1.2} />
    <path d="M12 11.4v4.8" />
  </g>,
);
/** Rounded warning triangle, drawn softer than the usual sharp one. */
export const IconAlert = make(
  <g>
    <path d="M10.4 4.5 3.9 15.6c-.8 1.4.2 3.2 1.8 3.2h12.6c1.6 0 2.6-1.8 1.8-3.2L13.6 4.5c-.8-1.3-2.4-1.3-3.2 0Z" />
    <path d="M12 9.4v3.6" />
    <Grain cx={12} cy={15.9} r={1.1} />
  </g>,
);
export const IconCircleCheck = make(
  <g>
    <circle cx="12" cy="12" r="8.4" />
    <path d="m8.4 12.3 2.5 2.5 4.9-5.2" />
  </g>,
);
export const IconCircleClose = make(
  <g>
    <circle cx="12" cy="12" r="8.4" />
    <path d="m9.4 9.4 5.2 5.2M14.6 9.4l-5.2 5.2" />
  </g>,
);
export const IconTrash = make(
  <g>
    <path d="M4.8 6.8h14.4" />
    <path d="M9.6 6.6V5.3c0-.7.6-1.3 1.3-1.3h2.2c.7 0 1.3.6 1.3 1.3v1.3" />
    <path d="m6.4 6.8.8 11.5a2 2 0 0 0 2 1.9h5.6a2 2 0 0 0 2-1.9l.8-11.5" />
    <path d="M10.1 11v5.2M13.9 11v5.2" />
  </g>,
);
export const IconRotate = make(
  <g>
    <path d="M20 12a8 8 0 1 1-2.7-6" />
    <path d="M20.3 3.6v4.2h-4.2" />
  </g>,
);
export const IconPlay = make(
  <path d="M9 6.6v10.8c0 .9 1 1.4 1.7.9l8.2-5.4c.7-.4.7-1.4 0-1.9L10.7 5.7c-.7-.5-1.7 0-1.7.9Z" />,
);
export const IconGrip = make(
  <g>
    <Grain cx={9} cy={6.4} r={1.4} />
    <Grain cx={15} cy={6.4} r={1.4} />
    <Grain cx={9} cy={12} r={1.4} />
    <Grain cx={15} cy={12} r={1.4} />
    <Grain cx={9} cy={17.6} r={1.4} />
    <Grain cx={15} cy={17.6} r={1.4} />
  </g>,
);
export const IconLoader = make(
  <g>
    <path d="M12 3.5v2.6" opacity={1} />
    <path d="M12 17.9v2.6" opacity={0.45} />
    <path d="M3.5 12h2.6" opacity={0.7} />
    <path d="M17.9 12h2.6" opacity={0.45} />
    <path d="m6 6 1.8 1.8" opacity={0.85} />
    <path d="M16.2 16.2 18 18" opacity={0.45} />
    <path d="m18 6-1.8 1.8" opacity={0.7} />
    <path d="M7.8 16.2 6 18" opacity={0.45} />
  </g>,
);
export const IconPercent = make(
  <g>
    <path d="M18.4 5.6 5.6 18.4" />
    <circle cx="7.6" cy="7.6" r="2.4" />
    <circle cx="16.4" cy="16.4" r="2.4" />
  </g>,
);
export const IconRepeat = make(
  <g>
    <path d="M4.5 10V9a4 4 0 0 1 4-4h10.3" />
    <path d="m16 2.6 2.8 2.4L16 7.4" />
    <path d="M19.5 14v1a4 4 0 0 1-4 4H5.2" />
    <path d="m8 21.4-2.8-2.4L8 16.6" />
  </g>,
);
export const IconHash = make(
  <g>
    <path d="M9.6 4.4 7.8 19.6M16.2 4.4l-1.8 15.2" />
    <path d="M4.8 9h15M4.2 15h15" />
  </g>,
);
export const IconEye = make(
  <g>
    <path d="M2.9 12C5.4 7.6 8.5 5.4 12 5.4s6.6 2.2 9.1 6.6c-2.5 4.4-5.6 6.6-9.1 6.6S5.4 16.4 2.9 12Z" />
    <circle cx="12" cy="12" r="2.6" />
  </g>,
);
export const IconEyeOff = make(
  <g>
    <path d="M4.5 8.2C3.9 9.2 3.4 10.4 2.9 12c2.5 4.4 5.6 6.6 9.1 6.6 1.5 0 2.9-.3 4.2-1M9.9 5.7A8.9 8.9 0 0 1 12 5.4c3.5 0 6.6 2.2 9.1 6.6-1 1.7-2 3.1-3.2 4.2" />
    <path d="M9.9 9.6a3 3 0 0 0 4.4 4.3" />
    <path d="m4 4 16 16" />
  </g>,
);
export const IconFilter = make(
  <g>
    <path d="M4.6 6.2h14.8" />
    <path d="M7.2 12h9.6" />
    <path d="M9.8 17.8h4.4" />
  </g>,
);
export const IconList = make(
  <g>
    <Grain cx={5.2} cy={6.6} r={1.2} />
    <Grain cx={5.2} cy={12} r={1.2} />
    <Grain cx={5.2} cy={17.4} r={1.2} />
    <path d="M9.4 6.6h10.4M9.4 12h10.4M9.4 17.4h10.4" />
  </g>,
);
export const IconListOrdered = make(
  <g>
    <path d="M9.6 6.6h10.2M9.6 12h10.2M9.6 17.4h10.2" />
    <path d="M4.1 4.9 5.6 4.2v4.4" strokeWidth={1.4} />
    <path d="M4.2 11.2c.2-.9 1.5-1.3 2.1-.6.5.6.2 1.3-.4 1.9l-1.7 1.7h2.4" strokeWidth={1.4} />
    <path d="M4.3 16.4c.2-.7 1.2-1 1.8-.5.5.4.4 1.1-.1 1.5l1.2 1v-2.3" strokeWidth={1.4} opacity={0} />
    <path d="M4.2 16.3c.3-.6 1.2-.9 1.8-.4.6.5.4 1.2-.2 1.6.7.2 1 .9.6 1.5-.4.6-1.4.6-1.9 0" strokeWidth={1.4} />
  </g>,
);
export const IconRoute = make(
  <g>
    <circle cx="6.3" cy="6.3" r="2.4" />
    <circle cx="17.7" cy="17.7" r="2.4" />
    <path d="M8.7 6.3h6.1a3.4 3.4 0 0 1 0 6.8H9.2a3.4 3.4 0 0 0 0 6.8h6.1" />
  </g>,
);
export const IconLayers = make(
  <g>
    <path d="m12 3.6 8.4 4.5L12 12.6 3.6 8.1Z" />
    <path d="m4.6 12.4 7.4 4 7.4-4" />
    <path d="m4.6 16.6 7.4 4 7.4-4" opacity={0.5} />
  </g>,
);
export const IconSplit = make(
  <g>
    <path d="M12 4.6v5.2" />
    <path d="M12 9.8c0 2.4-1.8 3.6-4.2 4.2-2 .5-3.3 1.6-3.3 3.4v1.4" />
    <path d="M12 9.8c0 2.4 1.8 3.6 4.2 4.2 2 .5 3.3 1.6 3.3 3.4v1.4" />
    <path d="m2.9 16.6 1.6 2.2 1.6-2.2M17.9 16.6l1.6 2.2 1.6-2.2" />
  </g>,
);
export const IconTrend = make(
  <g>
    <path d="m3.8 16.6 6-6.2 3.5 3.4 6.6-7" />
    <path d="M15.6 6.8h4.3v4.3" />
  </g>,
);
export const IconHistory = make(
  <g>
    <path d="M4.1 11.2a8 8 0 1 1 1.4 5.7" />
    <path d="M4 10.4l.3 3.2 3.1-.9" />
    <path d="M12 8.2V12l2.6 1.6" />
  </g>,
);
export const IconPackage = make(
  <g>
    <path d="M12 3.2 20.2 7.6v8.8L12 20.8 3.8 16.4V7.6Z" />
    <path d="M3.9 7.7 12 12l8.1-4.3" />
    <path d="M12 12v8.6" />
    <path d="M7.9 5.4l8.2 4.4v3.4" />
  </g>,
);
export const IconBox = make(
  <g>
    <path d="M12 3.4 19.8 7.7v8.6L12 20.6l-7.8-4.3V7.7Z" />
    <path d="m4.4 7.8 7.6 4.2 7.6-4.2" />
    <path d="M12 12v8.4" />
  </g>,
);
export const IconTag = make(
  <g>
    <path d="M4.4 5.9c0-.9.7-1.6 1.6-1.6h5.3c.5 0 1 .2 1.4.6l6.6 6.6a2 2 0 0 1 0 2.8l-4.9 4.9a2 2 0 0 1-2.8 0L4.9 12.5a2 2 0 0 1-.5-1.4Z" />
    <Grain cx={8.7} cy={8.7} r={1.3} />
  </g>,
);
export const IconTags = make(
  <g>
    <path d="M6.4 4.4h4.6c.5 0 1 .2 1.4.6l5.8 5.8a2 2 0 0 1 0 2.8l-4.2 4.2" />
    <path d="m3.6 8.4 5.6 5.6" opacity={0.55} />
    <path d="M3.4 9.9V6.2c0-.7.6-1.3 1.3-1.3h3.7" opacity={0.55} />
  </g>,
);
export const IconType = make(
  <g>
    <path d="M5.2 6.8V4.6h13.6v2.2" />
    <path d="M12 4.8v14.4" />
    <path d="M8.8 19.2h6.4" />
  </g>,
);
export const IconLetter = make(
  <g>
    <path d="M5.8 19.2 11.4 5l5.6 14.2" />
    <path d="M7.9 14h7" />
  </g>,
);
export const IconAlignLeft = make(
  <g>
    <path d="M4.4 6.2h15.2M4.4 12h10.8M4.4 17.8h13.4" />
  </g>,
);
export const IconTextCursor = make(
  <g>
    <path d="M3.8 7h8.4M3.8 12h5.4M3.8 17h7.4" />
    <path d="M16.4 8v8" />
    <path d="M14.6 8h3.6M14.6 16h3.6" />
  </g>,
);
export const IconTextSelect = make(
  <g>
    <path d="M12 5.4v13.2" />
    <path d="M9.4 5.4h5.2M9.4 18.6h5.2" />
    <path d="M4.6 9.2v5.6M19.4 9.2v5.6" opacity={0.5} />
  </g>,
);
export const IconCheckSquare = make(
  <g>
    <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="3.4" />
    <path d="m8.6 12.3 2.4 2.4 4.6-5" />
  </g>,
);
export const IconRadioDot = make(
  <g>
    <circle cx="12" cy="12" r="8.2" />
    <Grain cx={12} cy={12} r={3.1} />
  </g>,
);
export const IconToggle = make(
  <g>
    <rect x="3.4" y="7.6" width="17.2" height="8.8" rx="4.4" />
    <Grain cx={15.7} cy={12} r={2.6} />
  </g>,
);
export const IconSliders = make(
  <g>
    <path d="M4 7.4h5.2M13.6 7.4H20M4 16.6h9.2M17.6 16.6H20" />
    <Grain cx={11.4} cy={7.4} r={1.9} />
    <Grain cx={15.4} cy={16.6} r={1.9} />
  </g>,
);
export const IconWindow = make(
  <g>
    <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="3" />
    <Grain cx={7} cy={7.8} r={0.9} />
    <Grain cx={10.2} cy={7.8} r={0.9} />
    <path d="M3.4 11h17.2" opacity={0.55} />
  </g>,
);
export const IconPanelLeft = make(
  <g>
    <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="3" />
    <path d="M9.6 4.6v14.8" />
  </g>,
);
export const IconPanelBottom = make(
  <g>
    <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="3" />
    <path d="M3.4 14.4h17.2" />
  </g>,
);
export const IconPanels = make(
  <g>
    <rect x="3.8" y="3.8" width="7" height="7" rx="2" />
    <rect x="13.2" y="3.8" width="7" height="7" rx="2" />
    <rect x="3.8" y="13.2" width="7" height="7" rx="2" />
    <rect x="13.2" y="13.2" width="7" height="7" rx="2" />
  </g>,
);
export const IconChat = make(
  <g>
    <path d="M4.4 7A2.4 2.4 0 0 1 6.8 4.6h10.4A2.4 2.4 0 0 1 19.6 7v7a2.4 2.4 0 0 1-2.4 2.4H9.9l-4 3c-.5.4-1.5 0-1.5-.7Z" />
    <path d="M8.4 10.4h7.2" opacity={0.55} />
  </g>,
);
export const IconBell = make(
  <g>
    <path d="M6.4 10.2a5.6 5.6 0 0 1 11.2 0c0 3 .8 4.6 1.6 5.6.4.5 0 1.2-.7 1.2H5.5c-.7 0-1.1-.7-.7-1.2.8-1 1.6-2.6 1.6-5.6Z" />
    <path d="M10.2 19.8a2 2 0 0 0 3.6 0" />
  </g>,
);
export const IconKeyboard = make(
  <g>
    <rect x="2.8" y="6" width="18.4" height="12" rx="2.6" />
    <path d="M6.4 9.6h.01M9.8 9.6h.01M13.2 9.6h.01M16.6 9.6h.01M6.4 12.6h.01M9.8 12.6h.01M13.2 12.6h.01M16.6 12.6h.01" strokeWidth={2.1} />
    <path d="M8.4 15.4h7.2" />
  </g>,
);
export const IconTable = make(
  <g>
    <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2.8" />
    <path d="M3.4 10h17.2M10.2 10v9.4" />
  </g>,
);
export const IconCard = make(
  <g>
    <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="3" />
    <path d="M3.2 10h17.6" />
    <path d="M7 14.6h4" />
  </g>,
);
export const IconCode = make(
  <g>
    <path d="m8.8 8-4.2 4 4.2 4" />
    <path d="m15.2 8 4.2 4-4.2 4" />
  </g>,
);
export const IconFileCode = make(
  <g>
    <path d="M13.8 3.4H7.2a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h9.6a2 2 0 0 0 2-2V8.4Z" />
    <path d="M13.8 3.4v5h5" />
    <path d="m10.4 12-1.8 2 1.8 2M13.6 12l1.8 2-1.8 2" />
  </g>,
);
export const IconTerminal = make(
  <g>
    <path d="m5.4 7.6 4 3.4-4 3.4" />
    <path d="M11.8 15h6.8" />
  </g>,
);
export const IconTerminalSquare = make(
  <g>
    <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="3" />
    <path d="m7.2 9.4 3.2 2.8-3.2 2.8" />
    <path d="M12.8 15.2h4" />
  </g>,
);
export const IconUser = make(
  <g>
    <circle cx="12" cy="8.4" r="3.6" />
    <path d="M4.8 19.6c1.2-3.2 3.9-4.9 7.2-4.9s6 1.7 7.2 4.9" />
  </g>,
);
export const IconUserPlus = make(
  <g>
    <circle cx="10" cy="8.4" r="3.4" />
    <path d="M3.6 19.4c1.1-3 3.6-4.6 6.4-4.6 1.4 0 2.7.4 3.8 1.1" />
    <path d="M18.4 13.6v5.2M15.8 16.2H21" />
  </g>,
);
/** The command glyph, drawn with our round joins. */
export const IconCommand = make(
  <g>
    <path d="M9.2 9.2V6.4a2.3 2.3 0 1 0-2.3 2.3h2.3Zm0 0h5.6m-5.6 0v5.6m5.6-5.6V6.4a2.3 2.3 0 1 1 2.3 2.3h-2.3Zm0 5.6V9.2m0 5.6v2.8a2.3 2.3 0 1 0 2.3-2.3h-2.3Zm0 0H9.2m0 0v2.8a2.3 2.3 0 1 1-2.3-2.3h2.3Z" />
  </g>,
);
export const IconGauge = make(
  <g>
    <path d="M4.3 17.2a8.6 8.6 0 1 1 15.4 0" />
    <path d="m12 13.6 3.6-4.4" />
    <Grain cx={12} cy={14.6} r={1.4} />
  </g>,
);
export const IconOdometer = make(
  <g>
    <path d="M4.6 16.8a7.4 7.4 0 1 1 14.8 0Z" />
    <path d="m12 13.4 2.8-3.4" />
    <path d="M8.4 10.4l.5.7M12 9.2v.9M15.6 10.4l-.5.7" strokeWidth={1.5} />
    <path d="M5.6 19.4h12.8" />
  </g>,
);
export const IconFlask = make(
  <g>
    <path d="M9 3.6h6" />
    <path d="M10.2 3.8v5L5 18.1a1.9 1.9 0 0 0 1.7 2.8h10.6a1.9 1.9 0 0 0 1.7-2.8L13.8 8.8v-5" />
    <path d="M7.4 14.6h9.2" />
  </g>,
);
export const IconMail = make(
  <g>
    <rect x="3.4" y="5.4" width="17.2" height="13.2" rx="2.8" />
    <path d="m4.6 7.6 6.6 5a1.3 1.3 0 0 0 1.6 0l6.6-5" />
  </g>,
);
export const IconLock = make(
  <g>
    <rect x="5.2" y="10.4" width="13.6" height="9.8" rx="2.8" />
    <path d="M8.4 10.2V8a3.6 3.6 0 0 1 7.2 0v2.2" />
    <Grain cx={12} cy={15.2} r={1.2} />
  </g>,
);
export const IconSettings = make(
  <g>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M12 3.2v2.4M12 18.4v2.4M3.2 12h2.4M18.4 12h2.4M5.8 5.8l1.7 1.7M16.5 16.5l1.7 1.7M18.2 5.8l-1.7 1.7M7.5 16.5l-1.7 1.7" />
  </g>,
);
export const IconSun = make(
  <g>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
  </g>,
);
export const IconMoon = make(
  <path d="M19.8 14.3A8.2 8.2 0 1 1 9.7 4.2a6.8 6.8 0 0 0 10.1 10.1Z" />,
);
export const IconMonitor = make(
  <g>
    <rect x="3.2" y="4.6" width="17.6" height="12.2" rx="2.6" />
    <path d="M9.2 20.4h5.6M12 16.8v3.6" />
  </g>,
);
/** A seed petal, Pollen's answer to the rating glyph. */
export const IconPetal = make(
  <path d="M12 3.1c2.9 2.7 5.7 5.6 5.7 9.2 0 3.8-2.5 6.8-5.7 8.6-3.2-1.8-5.7-4.8-5.7-8.6 0-3.6 2.8-6.5 5.7-9.2Z" />,
);
export const IconSeed = make(
  <g>
    <path d="M14.6 9.4c2.2 2.2 2.4 5.6.6 7.9-2.5 3.2-7.6 3.3-9.9.6C3 14.9 4.6 9.7 8.2 8.1c2.3-1 4.9-.2 6.4 1.3Z" />
    <Grain cx={19.4} cy={5.4} r={1.1} />
    <Grain cx={21} cy={9.8} r={0.8} />
    <Grain cx={16.4} cy={3.6} r={0.7} />
  </g>,
);
export const IconMagnet = make(
  <g>
    <path d="M6.2 4.6h4.2v6.8a1.6 1.6 0 0 0 3.2 0V4.6h4.2v7a5.8 5.8 0 0 1-11.6 0Z" />
    <path d="M6.2 8h4.2M13.6 8h4.2" />
  </g>,
);
export const IconHeadline = make(
  <g>
    <path d="M10.4 5.4v13.2M16.4 5.4v13.2" />
    <path d="M10.4 12h6" />
    <path d="M3 8.2h3.4M3 12h2.2M3 15.8h3.4" opacity={0.55} />
  </g>,
);
export const IconScramble = make(
  <g>
    <path d="M3.4 7.4h5.4M14.8 16.6h5.8" />
    <path d="m6.4 4.8 2.6 2.6-2.6 2.6M17.6 14l2.6 2.6-2.6 2.6" />
    <path d="M16.4 7.4h-3a4 4 0 0 0-3.4 1.9M7.6 16.6h3a4 4 0 0 0 3.4-1.9" opacity={0.6} />
  </g>,
);
export const IconDock = make(
  <g>
    <rect x="2.8" y="14.2" width="18.4" height="6" rx="2.4" />
    <Grain cx={7.4} cy={17.2} r={1.2} />
    <Grain cx={12} cy={17.2} r={1.2} />
    <Grain cx={16.6} cy={17.2} r={1.2} />
    <path d="M12 10.4V3.8" opacity={0.55} />
  </g>,
);
export const IconTilt = make(
  <g>
    <rect x="4.4" y="5.6" width="13.6" height="13.6" rx="2.6" transform="rotate(-7 11.2 12.4)" />
    <path d="M8.2 10.6l4.6-1M9 14.2l4.6-1" opacity={0.55} />
  </g>,
);
export const IconRing = make(
  <g>
    <path d="M20 12a8 8 0 1 1-8-8" />
    <Grain cx={12} cy={4} r={1.4} />
    <circle cx={12} cy={12} r={1.1} fill="currentColor" stroke="none" opacity={0.5} />
  </g>,
);
/** Departures, not rockets: a tray with an arrow leaving it. */
export const IconDeploy = make(
  <g>
    <path d="M4.6 15.4v3.2a2 2 0 0 0 2 2h10.8a2 2 0 0 0 2-2v-3.2" />
    <path d="M12 14.6V4.2M8.2 7.8 12 4l3.8 3.8" />
  </g>,
);
export const IconCursorClick = make(
  <g>
    <path d="m9.9 9.9 9.3 3.7-4.1 1.4-1.4 4.1Z" />
    <path d="M9.2 4.4v2.2M4.4 9.2h2.2M5.6 5.6l1.5 1.5" />
  </g>,
);
export const IconPopover = make(
  <g>
    <rect x="8.2" y="3.6" width="12.2" height="9.4" rx="2.4" />
    <path d="M8.2 8.6H5.6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3.4" />
  </g>,
);
export const IconBars = make(
  <g>
    <path d="M6 19.4v-6M12 19.4V6.6M18 19.4v-8.8" strokeWidth={2.2} />
  </g>,
);
export const IconCube = make(
  <g>
    <path d="M12 3.4 19.8 7.7v8.6L12 20.6l-7.8-4.3V7.7Z" />
    <path d="m4.4 7.8 7.6 4.2 7.6-4.2" />
    <path d="M12 12v8.4" opacity={0.6} />
  </g>,
);
export const IconCircle = make(<circle cx="12" cy="12" r="8.2" />);

/* ---------- extended set ---------- */

export const IconArchive = make(
  <g>
    <rect x="3.4" y="4.2" width="17.2" height="4.4" rx="1.6" />
    <path d="M5.2 8.6v9a2 2 0 0 0 2 2h9.6a2 2 0 0 0 2-2v-9" />
    <path d="M10.2 12.4h3.6" />
  </g>,
);
export const IconBook = make(
  <g>
    <path d="M12 6.4c-1.6-1.4-3.8-2-6.2-2-1 0-2 .1-2.6.3v13.6c.6-.2 1.6-.3 2.6-.3 2.4 0 4.6.6 6.2 2 1.6-1.4 3.8-2 6.2-2 1 0 2 .1 2.6.3V4.7c-.6-.2-1.6-.3-2.6-.3-2.4 0-4.6.6-6.2 2Z" />
    <path d="M12 6.4v13.4" />
  </g>,
);
export const IconDatabase = make(
  <g>
    <ellipse cx="12" cy="5.8" rx="7.4" ry="2.6" />
    <path d="M4.6 5.8v12.4c0 1.4 3.3 2.6 7.4 2.6s7.4-1.2 7.4-2.6V5.8" />
    <path d="M4.6 12c0 1.4 3.3 2.6 7.4 2.6s7.4-1.2 7.4-2.6" />
  </g>,
);
export const IconDownload = make(
  <g>
    <path d="M12 4.2v10.2" />
    <path d="m8.2 11 3.8 3.8L15.8 11" />
    <path d="M4.6 15.6v2.4a2 2 0 0 0 2 2h10.8a2 2 0 0 0 2-2v-2.4" />
  </g>,
);
export const IconExternal = make(
  <g>
    <path d="M10.4 5.4H6.2a2 2 0 0 0-2 2v10.4a2 2 0 0 0 2 2h10.4a2 2 0 0 0 2-2v-4.2" />
    <path d="M13.6 3.8h6.6v6.6" />
    <path d="M20 4 12.2 11.8" />
  </g>,
);
export const IconGlobe = make(
  <g>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M3.6 12h16.8" />
    <path d="M12 3.6c2.2 2.2 3.4 5.1 3.4 8.4s-1.2 6.2-3.4 8.4c-2.2-2.2-3.4-5.1-3.4-8.4s1.2-6.2 3.4-8.4Z" />
  </g>,
);
export const IconMenu = make(
  <g>
    <path d="M4.4 7h15.2M4.4 12h15.2M4.4 17h9.6" />
  </g>,
);
export const IconPencil = make(
  <g>
    <path d="m14.2 5.4 4.4 4.4L8.2 20.2l-4.9.7.7-4.9Z" />
    <path d="m12.4 7.2 4.4 4.4" />
  </g>,
);
export const IconUsers = make(
  <g>
    <circle cx="9.4" cy="8.6" r="3.2" />
    <path d="M3.6 19.2c1.1-2.8 3.3-4.3 5.8-4.3s4.7 1.5 5.8 4.3" />
    <path d="M15.4 5.8a3.2 3.2 0 0 1 0 5.7" />
    <path d="M17.2 15.2c1.6.6 2.8 1.9 3.4 4" />
  </g>,
);
export const IconWind = make(
  <g>
    <path d="M3.6 8.6h9.6a2.5 2.5 0 1 0-2.4-3.2" />
    <path d="M3.6 12.6h13.8a2.5 2.5 0 1 1-2.4 3.2" />
    <path d="M3.6 16.6h6.2" opacity={0.6} />
  </g>,
);
export const IconBolt = make(
  <path d="M13.2 3.4 5.6 13.2h5l-1.4 7.4 8-10.2h-5.2Z" />,
);
export const IconHeart = make(
  <path d="M12 19.8C7.2 16.7 4 13.6 4 10a4.4 4.4 0 0 1 8-2.5A4.4 4.4 0 0 1 20 10c0 3.6-3.2 6.7-8 9.8Z" />,
);
export const IconSwatches = make(
  <g>
    <rect x="3.6" y="3.6" width="7.4" height="7.4" rx="2" />
    <rect x="13" y="3.6" width="7.4" height="7.4" rx="2" />
    <rect x="3.6" y="13" width="7.4" height="7.4" rx="2" />
    <Grain cx={16.7} cy={16.7} r={3.7} />
  </g>,
);
/** The GitHub mark, kept as the one brand glyph in the set. */
export const IconGithub = make(
  <path
    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
    strokeWidth={0}
    fill="currentColor"
    transform="scale(1.5) translate(0 0)"
  />,
);
export const IconTicket = make(
  <g>
    <path d="M3.6 8.2c0-1 .8-1.8 1.8-1.8h13.2c1 0 1.8.8 1.8 1.8v1.6a2.2 2.2 0 0 0 0 4.4v1.6c0 1-.8 1.8-1.8 1.8H5.4c-1 0-1.8-.8-1.8-1.8v-1.6a2.2 2.2 0 0 0 0-4.4Z" />
    <path d="M14.4 7.6v1.2M14.4 11.4v1.2M14.4 15.2v1.2" strokeDasharray="0.1 3.2" strokeWidth={1.9} />
  </g>,
);
