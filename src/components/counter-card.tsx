import { motion } from 'motion/react';
import { MoreHorizontal, Edit, Trash2, Target } from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface Counter {
  id: string;
  name: string;
  color: string;
  cycleSize: number;
  target: number;
  todayCount: number;
  totalCount: number;
  maalasCompleted: number;
  todayMaalas: number;
}

interface CounterCardProps {
  counter: Counter;
  isActive?: boolean;
  onSelect: (counter: Counter) => void;
  onEdit: (counter: Counter) => void;
  onDelete: (counter: Counter) => void;
  className?: string;
}

export function CounterCard({ 
  counter, 
  isActive = false,
  onSelect, 
  onEdit, 
  onDelete,
  className 
}: CounterCardProps) {
  const progressPercent = (counter.todayMaalas / counter.target) * 100;
  
  return (
    <motion.div
      className={cn(
        "rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer",
        isActive 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm",
        className
      )}
      onClick={() => onSelect(counter)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Color indicator */}
          <div 
            className="w-4 h-4 rounded-full border border-border"
            style={{ backgroundColor: counter.color }}
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">
                {counter.name}
              </h3>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {counter.cycleSize} count cycle
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(counter);
            }}>
              <Edit size={14} className="mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(counter);
              }}
              className="text-destructive"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Progress towards daily target */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Today's Progress</span>
          <span>{counter.todayMaalas} / {counter.target} Maalas</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div 
            className="rounded-full h-2"
            style={{ backgroundColor: counter.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-bold text-foreground">
            {counter.todayCount}
          </div>
          <div className="text-xs text-muted-foreground">
            Today
          </div>
        </div>
        <div>
          <div className="font-bold" style={{ color: counter.color }}>
            {counter.maalasCompleted}
          </div>
          <div className="text-xs text-muted-foreground">
            Maalas
          </div>
        </div>
        <div>
          <div className="font-bold text-secondary">
            {counter.totalCount}
          </div>
          <div className="text-xs text-muted-foreground">
            Total
          </div>
        </div>
      </div>

      {/* Target indicator */}
      {counter.todayMaalas >= counter.target && (
        <motion.div 
          className="mt-3 flex items-center justify-center gap-2 text-xs text-success bg-success/10 rounded-lg py-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Target size={12} />
          Daily target reached!
        </motion.div>
      )}
    </motion.div>
  );
}