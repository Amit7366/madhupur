/**
 * Shared UI primitives — uses CSS variables from `src/styles/globals.css`.
 * Government-style: clear focus rings, consistent interactive states.
 */

/** Visible keyboard focus (2px ring + offset). */
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Interactive control (buttons, icon buttons) — includes hover border lift. */
export const focusRingControl = `${focusRing} transition-colors duration-200`;

/** Text / ghost links inside body copy. */
export const linkAccent =
  "font-medium text-indigo-700 underline decoration-indigo-700/30 underline-offset-4 transition-colors hover:text-indigo-800 hover:decoration-indigo-700/60 dark:text-indigo-400 dark:decoration-indigo-400/35 dark:hover:text-indigo-300";
