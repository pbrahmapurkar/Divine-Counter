import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Sparkles, User } from 'lucide-react';
import { DivineLogo } from './divine-logo';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
    userName: string;
    counter: Counter;
    settings: {
      theme: string;
    };
  }) => void;
  onSkip: () => void;
}

const colors = [
  { name: 'Saffron', value: '#F2994A' },
  { name: 'Blue', value: '#007AFF' },
  { name: 'Green', value: '#34C759' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Pink', value: '#FF2D92' },
  { name: 'Orange', value: '#FF6B35' }
];

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [cycleSize, setCycleSize] = useState(108);
  const [customCycleSize, setCustomCycleSize] = useState('');
  const [counter, setCounter] = useState<Partial<Counter>>({
    name: 'My Practice',
    color: '#F2994A',
    cycleSize: 108,
    target: 1
  });
  const [settings, setSettings] = useState({
    theme: 'spiritual'
  });

  const steps = [
    'Welcome',
    'Your Name',
    'Choose Your Cycle',
    'Create Your Counter',
    'Background',
    'Review'
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      // Update counter cycle size when moving from cycle step
      if (step === 2) {
        const finalCycleSize = cycleSize === 0 ? parseInt(customCycleSize) || 108 : cycleSize;
        setCounter(prev => ({ ...prev, cycleSize: finalCycleSize }));
      }
    } else {
      const finalCycleSize = cycleSize === 0 ? parseInt(customCycleSize) || 108 : cycleSize;
      onComplete({
        userName: userName || 'Friend',
        counter: {
          id: '1',
          name: counter.name || 'My Practice',
          color: counter.color || '#F2994A',
          cycleSize: finalCycleSize,
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Divine Counter</h1>
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
              <User size={48} className="mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Name</h2>
              <p className="text-muted-foreground">
                How would you like to be addressed?
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div>
                  <Label htmlFor="user-name">Name</Label>
                  <Input
                    id="user-name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="text-center text-lg"
                  />
                </div>
              </CardContent>
            </Card>
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
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Cycle</h2>
              <p className="text-muted-foreground">
                A maala completes at this count
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                { size: 108, label: '108', desc: 'Traditional full maala' },
                { size: 54, label: '54', desc: 'Half maala' }
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
              
              {/* Custom option */}
              <motion.div
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all",
                  cycleSize === 0 
                    ? "border-primary bg-primary/5" 
                    : "border-border bg-card hover:border-primary/50"
                )}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <button
                      className="font-semibold text-foreground text-left"
                      onClick={() => setCycleSize(0)}
                    >
                      Custom
                    </button>
                    <div className="text-sm text-muted-foreground">Enter your preferred count</div>
                  </div>
                  <div className="w-20">
                    {cycleSize === 0 && (
                      <Input
                        type="number"
                        value={customCycleSize}
                        onChange={(e) => setCustomCycleSize(e.target.value)}
                        placeholder="108"
                        className="text-center text-sm"
                        min="1"
                        max="1000"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
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
              <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Counter</h2>
              <p className="text-muted-foreground">
                Personalize your first counting practice
              </p>
            </div>

            <Card>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label htmlFor="counter-name">Mantra/Name</Label>
                  <Input
                    id="counter-name"
                    value={counter.name}
                    onChange={(e) => setCounter(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Practice"
                  />
                </div>

                <div>
                  <Label>Color/Icon</Label>
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
                  <Label htmlFor="daily-target">Daily Target (maalas)</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[1, 2, 3, 5].map((target) => (
                      <button
                        key={target}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all text-center",
                          counter.target === target 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setCounter(prev => ({ ...prev, target }))}
                      >
                        <div className="font-bold text-foreground">{target}</div>
                        <div className="text-xs text-muted-foreground">maala{target !== 1 ? 's' : ''}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="reminder">Reminder (optional)</Label>
                  <Input
                    id="reminder"
                    type="time"
                    defaultValue="09:00"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Preview Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: counter.color }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{counter.name || 'My Practice'}</div>
                    <div className="text-sm text-muted-foreground">
                      {cycleSize === 0 ? (customCycleSize || '108') : cycleSize} count cycle • {counter.target} maala{counter.target !== 1 ? 's' : ''} daily
                    </div>
                  </div>
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
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Background</h2>
              <p className="text-muted-foreground">
                Choose your preferred background style
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'plain', label: 'Plain', desc: 'Clean minimal background' },
                { id: 'gradient', label: 'Gradient', desc: 'Subtle color transitions' },
                { id: 'image', label: 'Image', desc: 'Nature-inspired backdrop' }
              ].map((option) => (
                <motion.button
                  key={option.id}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    "border-border bg-card hover:border-primary/50"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Legibility overlay will be applied automatically
            </div>
          </motion.div>
        );

      case 5:
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
              <h2 className="text-2xl font-bold text-foreground mb-2">Review</h2>
              <p className="text-muted-foreground">
                {userName ? `${userName}, ` : ''}your Divine Counter is ready for your spiritual practice
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{userName || 'Friend'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cycle:</span>
                <span className="font-medium">{cycleSize === 0 ? (customCycleSize || '108') : cycleSize} counts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Counter:</span>
                <span className="font-medium">{counter.name || 'My Practice'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Target:</span>
                <span className="font-medium">{counter.target} maala{counter.target !== 1 ? 's' : ''}</span>
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
          Skip
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
          disabled={
            (step === 1 && !userName.trim()) ||
            (step === 2 && cycleSize === 0 && (!customCycleSize || parseInt(customCycleSize) < 1))
          }
        >
          {step === 0 ? (
            <>
              Get Started
              <ChevronRight size={16} className="ml-1" />
            </>
          ) : step === steps.length - 1 ? (
            <>
              <Check size={16} className="mr-1" />
              Start Practice
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