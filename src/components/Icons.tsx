// Inline stroke icons (Lucide geometry, ISC license). Decorative by default.
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export const IconBag = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 7h12l1 13H5L6 7Z" />
    <path d="M9 7V6a3 3 0 0 1 6 0v1" />
  </svg>
);
export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconArrow = (p: P) => (
  <svg {...base({ className: "arrow", ...p })}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const IconPlus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconMinus = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconTruck = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);
export const IconCamera = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h3l2-2.5h6L17 8h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconLeaf = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
    <path d="M5 19c3-4 6-6 10-8" />
  </svg>
);
export const IconFlower = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="9" r="2.2" />
    <path d="M12 6.8C12 4 10.5 3 9.5 3S7 4.5 8.5 6.5M12 6.8C12 4 13.5 3 14.5 3S17 4.5 15.5 6.5M14.2 9c2.8 0 3.8-1.5 3.8-2.5S16.5 4 14.5 5.5M9.8 9C7 9 6 7.5 6 6.5S7.5 4 9.5 5.5M12 11.2c0 2.8 1.5 3.8 2.5 3.8s2.5-1.5 1-3.5M12 11.2c0 2.8-1.5 3.8-2.5 3.8S7 13.5 8.5 11.5" />
    <path d="M12 15v6M12 19c-2-2.5-4-3-6-2.5M12 18c1.5-2 3.5-2.5 5-2" />
  </svg>
);
export const IconGift = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" />
    <path d="M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" />
  </svg>
);
export const IconCalendar = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="1" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 4h3.5l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
  </svg>
);
export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </svg>
);
export const IconStar = (p: P) => (
  <svg {...base({ strokeWidth: 1, ...p })}>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </svg>
);
export const IconLock = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="11" width="14" height="9" rx="1" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const IconHeart = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20s-8-4.7-8-10.3A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.7C20 15.3 12 20 12 20Z" />
  </svg>
);
export const IconSparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />
    <path d="M19 15c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5Z" />
  </svg>
);
export const IconRepeat = (p: P) => (
  <svg {...base(p)}>
    <path d="M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4" />
  </svg>
);
export const IconAlert = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </svg>
);
export const IconInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);
