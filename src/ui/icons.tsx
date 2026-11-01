// Simple stroke icons (24×24). Color follows `currentColor`.
import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const IconToday = () => (
  <svg {...base}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const IconWeek = () => (
  <svg {...base}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2" /></svg>
);
export const IconCourses = () => (
  <svg {...base}><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z" /><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3" /></svg>
);
export const IconExams = () => (
  <svg {...base}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9 2h6" /></svg>
);
export const IconMore = () => (
  <svg {...base}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
// Arrows follow reading direction: in RTL, "next" points left.
export const IconPrev = () => (
  <svg {...base}><path d="M9 6l6 6-6 6" /></svg>
);
export const IconNext = () => (
  <svg {...base}><path d="M15 6l-6 6 6 6" /></svg>
);
