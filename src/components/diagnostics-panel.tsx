import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { dayKey, derivedMaalas, isBoundaryCross, crossedBelow } from '../domain/derived';

interface DiagnosticsPanelProps {
  currentScreen: string;
  activeCounterId?: string;
  activeCounterName?: string;
  cycleSize?: number;
  todayRaw?: number;
  todayDerivedMaalas?: number;
  hapticsEnabled?: boolean;
  onSimulateBoundaryCross: () => void;
  onSimulateBelowBoundary: () => void;
  onAddMaala: () => void;
  onRemoveMaala: () => void;
}

export function DiagnosticsPanel({
  currentScreen,
  activeCounterId,
  activeCounterName,
  cycleSize = 108,
  todayRaw = 0,
  todayDerivedMaalas = 0,
  hapticsEnabled = false,
  onSimulateBoundaryCross,
  onSimulateBelowBoundary,
  onAddMaala,
  onRemoveMaala,
}: DiagnosticsPanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-20 right-4 z-50 max-w-sm"
        >
          <Card className="bg-card/95 backdrop-blur-sm border-2 border-orange-500/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>🔧 Diagnostics</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsVisible(false)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Current State */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Current State</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Screen:</span>
                    <Badge variant="outline" className="ml-1 text-xs">
                      {currentScreen}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Haptics:</span>
                    <Badge 
                      variant={hapticsEnabled ? "default" : "secondary"} 
                      className="ml-1 text-xs"
                    >
                      {hapticsEnabled ? "ON" : "OFF"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Active Counter Info */}
              {activeCounterId && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Active Counter</div>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-muted-foreground">ID:</span> {activeCounterId.slice(-8)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Name:</span> {activeCounterName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cycle:</span> {cycleSize}
                    </div>
                  </div>
                </div>
              )}

              {/* Today's Stats */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Today ({dayKey()})</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Raw:</span> {todayRaw}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Maalas:</span> {todayDerivedMaalas}
                  </div>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Progress:</span> {Math.round((todayRaw % cycleSize) / cycleSize * 100)}%
                </div>
              </div>

              {/* Simulation Buttons */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Simulations</div>
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={onSimulateBoundaryCross}
                  >
                    Sim 107→108
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={onSimulateBelowBoundary}
                  >
                    Sim 110→107
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={onAddMaala}
                  >
                    +1 Maala
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={onRemoveMaala}
                  >
                    -1 Maala
                  </Button>
                </div>
              </div>

              {/* Boundary Detection */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Boundary Detection</div>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="text-muted-foreground">Next boundary:</span> {cycleSize - (todayRaw % cycleSize)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Would cross:</span> {isBoundaryCross(todayRaw, todayRaw + 1, cycleSize) ? "Yes" : "No"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Would cross below:</span> {crossedBelow(todayRaw + 1, todayRaw, cycleSize) ? "Yes" : "No"}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">
                Press ⌘+D to toggle
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
