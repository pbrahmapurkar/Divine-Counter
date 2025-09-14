import { cn } from "./utils";
import { motion } from "motion/react";

type TileProps = {
  active?: boolean;
  error?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Tile({ active, error, className, children, ...rest }: TileProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      animate={{ scale: active ? 1.02 : 1 }}
      transition={{ duration: 0.12 }}
      className={cn(
        "rounded-2xl border p-4 text-left transition-colors",
        "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
        active && "border-primary ring-2 ring-primary/30 bg-primary/5 shadow-elevated-lg",
        error && "border-[#EF4444] ring-2 ring-[#EF4444]/20",
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
