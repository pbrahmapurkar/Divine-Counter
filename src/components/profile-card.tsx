import { motion } from 'motion/react';
import { User, Edit, Trash2 } from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';

interface Profile {
  id: string;
  name: string;
  mantra: string;
  cycleSize: number;
  theme: string;
  totalCount: number;
  cyclesCompleted: number;
}

interface ProfileCardProps {
  profile: Profile;
  isActive?: boolean;
  onSelect: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
  className?: string;
}

export function ProfileCard({ 
  profile, 
  isActive = false,
  onSelect, 
  onEdit, 
  onDelete,
  className 
}: ProfileCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-xl border-2 p-4 transition-all duration-200",
        isActive 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => onSelect(profile)}
        >
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-muted-foreground" />
            <h3 className="font-semibold text-foreground">
              {profile.name}
            </h3>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {profile.mantra}
          </p>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(profile);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(profile);
            }}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div 
        className="grid grid-cols-3 gap-2 text-center cursor-pointer"
        onClick={() => onSelect(profile)}
      >
        <div>
          <div className="text-lg font-bold text-foreground">
            {profile.cycleSize}
          </div>
          <div className="text-xs text-muted-foreground">
            Cycle Size
          </div>
        </div>
        <div>
          <div className="text-lg font-bold text-primary">
            {profile.cyclesCompleted}
          </div>
          <div className="text-xs text-muted-foreground">
            Cycles
          </div>
        </div>
        <div>
          <div className="text-lg font-bold text-secondary">
            {profile.totalCount}
          </div>
          <div className="text-xs text-muted-foreground">
            Total
          </div>
        </div>
      </div>
    </motion.div>
  );
}