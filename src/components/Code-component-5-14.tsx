import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Plus, Palette, Volume2, Vibrate, Sparkles } from 'lucide-react';
import { DivineLogo } from './divine-logo';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { cn } from './ui/utils';

interface Counter {
  id: string;
  name: string;
  color: string;
  cycleSize: number;
  target: number;
}

interface OnboardingProps {
  onComplete: (data: {
    counter: Counter;
    settings: {
      haptics: boolean;
      sound: boolean;
      theme: string;
    };
  }) => void;
  onSkip: () => void;
}

const colors = [
  { name: 'Saffron', value: '#FF9500' },
  { name: 'Blue', value: '#007AFF' },
  { name: 'Green', value: '#34C759' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Pink', value: '#FF2D92' },
  { name: 'Orange', value: '#FF6B35' }
];

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [cycleSize, setCycleSize] = useState(108);
  const [counter, setCounter] = useState<Partial<Counter>>({
    name: 'My Practice',
    color: '#FF9500',
    cycleSize: 108,
    target: 1
  });
  const [settings, setSettings] = useState({
    haptics: true,
    sound: true,
    theme: 'spiritual'
  });

  const steps = [
    'Welcome',
    'Cycle Size',
    'Create Counter',
    'Preferences',
    'Ready'
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        counter: {
          id: '1',
          name: counter.name || 'My Practice',
          color: counter.color || '#FF9500',
          cycleSize: cycleSize,
          target: counter.target || 1
        },
        settings
      });
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const ProgressDots = () => (
    <div className="flex justify-center gap-2 mb-8">
      {steps.map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            index <= step ? "bg-primary" : "bg-muted"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );

  const StepContent = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <DivineLogo size={120} animated className="mx-auto text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Divine Counter</h1>
              <p className="text-muted-foreground">
                A sacred space for your spiritual counting practice
              </p>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Track your maala cycles with precision</p>
              <p>• Create custom counters for different practices</p>
              <p>• Beautiful, distraction-free design</p>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Cycle</h2>
              <p className="text-muted-foreground">
                Select the traditional maala size for your practice
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                { size: 54, label: 'Half Maala', desc: 'Perfect for shorter sessions' },
                { size: 108, label: 'Full Maala', desc: 'Traditional complete cycle' },
                { size: 216, label: 'Double Maala', desc: 'Extended practice' }
              ].map((option) => (
                <motion.button
                  key={option.size}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    cycleSize === option.size 
                      ? "border-primary bg-primary/5" 
                      : "border-border bg-card hover:border-primary/50"
                  )}
                  onClick={() => setCycleSize(option.size)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{option.size}</div>
                      <div className="text-xs text-muted-foreground">counts</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Counter</h2>
              <p className="text-muted-foreground">
                Personalize your first counting practice
              </p>
            </div>

            <Card>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label htmlFor="counter-name">Counter Name</Label>
                  <Input
                    id="counter-name"
                    value={counter.name}
                    onChange={(e) => setCounter(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Practice"
                  />
                </div>

                <div>
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all",
                          counter.color === color.value 
                            ? "border-primary" 
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setCounter(prev => ({ ...prev, color: color.value }))}
                      >
                        <div 
                          className="w-6 h-6 rounded-full mx-auto mb-1"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="text-xs text-muted-foreground">{color.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="daily-target">Daily Target (Maalas)</Label>
                  <Select
                    value={counter.target?.toString()}
                    onValueChange={(value) => setCounter(prev => ({ ...prev, target: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Maala</SelectItem>
                      <SelectItem value="2">2 Maalas</SelectItem>
                      <SelectItem value="3">3 Maalas</SelectItem>
                      <SelectItem value="5">5 Maalas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Preferences</h2>
              <p className="text-muted-foreground">
                Customize your experience
              </p>
            </div>

            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Vibrate size={20} className="text-muted-foreground" />
                    <div>
                      <Label htmlFor="haptics">Haptic Feedback</Label>
                      <p className="text-xs text-muted-foreground">Feel each count</p>
                    </div>
                  </div>
                  <Switch
                    id="haptics"
                    checked={settings.haptics}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, haptics: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 size={20} className="text-muted-foreground" />
                    <div>
                      <Label htmlFor="sound">Sound Effects</Label>
                      <p className="text-xs text-muted-foreground">Audio cues for milestones</p>
                    </div>
                  </div>
                  <Switch
                    id="sound"
                    checked={settings.sound}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, sound: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles size={40} className="text-primary" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">You're All Set!</h2>
              <p className="text-muted-foreground">
                Your Divine Counter is ready for your spiritual practice
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Counter:</span>
                <span className="font-medium">{counter.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cycle Size:</span>
                <span className="font-medium">{cycleSize} counts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Target:</span>
                <span className="font-medium">{counter.target} Maala{counter.target !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSkip}
          className="text-muted-foreground"
        >
          Skip for now
        </Button>
        <span className="text-sm text-muted-foreground">
          {step + 1} of {steps.length}
        </span>
      </div>

      <ProgressDots />

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <StepContent />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={prevStep}
            className="flex-1"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </Button>
        )}
        
        <Button
          onClick={nextStep}
          className="flex-1"
        >
          {step === steps.length - 1 ? (
            <>
              <Check size={16} className="mr-1" />
              Start Counting
            </>
          ) : (
            <>
              Next
              <ChevronRight size={16} className="ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}