import { motion } from 'motion/react';
import { cn } from './ui/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'today' | 'total' | 'streak';
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = 'default',
  className 
}: StatsCardProps) {
  const variants = {
    default: "bg-card border-border",
    today: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
    total: "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20",
    streak: "bg-gradient-to-br from-success/10 to-success/5 border-success/20"
  };

  return (
    <motion.div
      className={cn(
        "rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
        variants[variant],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && (
              <div className="text-muted-foreground">
                {icon}
              </div>
            )}
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}