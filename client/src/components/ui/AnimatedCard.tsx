"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds */
  delay?: number;
  /** Reduce motion: still renders children without animation */
  disableAnimation?: boolean;
  /** When false, only enter animation (child handles hover styles) */
  hoverLift?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">;

export function AnimatedCard({
  children,
  className,
  delay = 0,
  disableAnimation = false,
  hoverLift = true,
  ...motionProps
}: AnimatedCardProps) {
  if (disableAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 26,
        stiffness: 320,
        delay,
      }}
      whileHover={
        hoverLift
          ? {
              y: -3,
              transition: { type: "spring", stiffness: 400, damping: 22 },
            }
          : undefined
      }
      whileTap={{ scale: 0.98 }}
      className={cn(className)}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
