import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4: theme tokens live in `src/styles/globals.css` (`@theme inline`).
 * Use this file for content paths, plugins, and other JS-friendly options.
 */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
} satisfies Config;
