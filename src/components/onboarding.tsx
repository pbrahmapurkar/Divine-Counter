import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Sparkles, User } from 'lucide-react';
import { DivineLogo } from './divine-logo';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { StableInput } from './ui/stable-input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// removed dialog usage from this screen
import { NumberField } from './ui/number-field';
import { CyclePicker } from './counter-cycle/CyclePicker';
import { cn } from './ui/utils';
import Step4CreateCounter from './onboarding/steps/Step4CreateCounter';

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
  const [nameError, setNameError] = useState<string | null>(null);
  const [cycleError, setCycleError] = useState<string | null>(null);
  const [targetError, setTargetError] = useState<string | null>(null);
  const [counter, setCounter] = useState<Partial<Counter>>({
    name: 'My Practice',
    color: '#34C759',
    cycleSize: 108,
    target: 1
  });
  const [settings, setSettings] = useState({
    theme: 'spiritual'
  });
  const [counterNameError, setCounterNameError] = useState<string | null>(null);
  // removed modal-based custom target; using direct number entry
  // Reminder frequency: daily or weekly, and selected days for weekly
  // reminders removed
  const nameInputRef = useRef<HTMLInputElement>(null);
  const colorGroupRef = useRef<HTMLDivElement>(null);

  const steps = [
    'Welcome',
    'Your Name',
    'Choose Your Cycle',
    'Create Your Counter',
    'Review'
  ];

  // TEMP: mount log to detect unwanted remounts while typing/tapping
  useEffect(() => { console.log('MOUNT <Onboarding>'); }, []);

  const validateName = () => {
    const n = (userName || '').trim();
    if (n.length < 1) return 'Please enter your name (1–40 characters).';
    if (n.length > 40) return 'Name should be at most 40 characters.';
    return null;
  };

  const validateCycle = () => {
    if (cycleSize === 0) {
      const v = parseInt(customCycleSize || '');
      if (!customCycleSize) return 'Enter a custom cycle count.';
      if (!Number.isFinite(v) || v < 1) return 'Cycle must be a number ≥ 1.';
    }
    return null;
  };

  const validateTarget = () => {
    const t = Number(counter.target ?? 0);
    if (!Number.isFinite(t) || t < 0) return 'Daily target must be ≥ 0.';
    return null;
  };

  const nextStep = () => {
    // Per-step validation before proceeding
    if (step === 1) {
      const err = validateName();
      setNameError(err);
      if (err) return;
    }
    if (step === 2) {
      const err = validateCycle();
      setCycleError(err);
      if (err) return;
    }
    if (step === 3) {
      const errN = (counter.name || '').trim().length === 0 ? 'Counter name is required.' : null;
      const errT = validateTarget();
      setTargetError(errT || errN);
      if (errN || errT) return;
    }

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
          name: (counter.name || 'My Practice').trim().slice(0,40),
          color: counter.color || '#F2994A',
          cycleSize: finalCycleSize,
          target: Math.max(0, Number(counter.target) || 0)
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
            "progress-dot",
            index < step && "completed",
            index === step && "active"
          )}
          initial={false}
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
            initial={false}
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
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <User size={48} className="mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-1">Your Name</h2>
              <p className="text-sm text-muted-foreground">
                How would you like to be addressed?
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="user-name" className="sr-only">Your Name</Label>
                  <StableInput
                    id="user-name"
                    aria-label="Your name"
                    aria-describedby="user-name-help"
                    value={userName}
                    onChange={(v) => {
                      setUserName(v);
                      if (nameError) setNameError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const err = validateName();
                        setNameError(err);
                        if (!err) nextStep();
                      }
                    }}
                    placeholder="e.g., Arjun"
                    className="text-center text-lg h-12"
                    inputMode="text"
                    autoCapitalize="words"
                    autoComplete="name"
                    spellCheck={false}
                    autoFocus
                    aria-invalid={!!nameError}
                    maxLength={40}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span id="user-name-help" className="text-muted-foreground">1–40 characters</span>
                    <span className={cn("", (userName || '').trim().length === 40 ? 'text-primary' : 'text-muted-foreground')}>
                      {(userName || '').trim().length}/40
                    </span>
                  </div>
                  {nameError && (
                    <p className="mt-1 text-xs text-destructive" role="alert" aria-live="polite">{nameError}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Cycle</h2>
              <p className="text-sm text-muted-foreground">A maala completes at this count</p>
            </div>
            <CyclePicker
              selected={cycleSize === 0 ? (customCycleSize ? Number(customCycleSize) : null) : cycleSize}
              onChange={(v) => {
                const presetValues = [108,54,27,21];
                if (presetValues.includes(v)) {
                  setCycleSize(v);
                  setCustomCycleSize('');
                } else {
                  setCycleSize(0);
                  setCustomCycleSize(String(v));
                }
                if (cycleError) setCycleError(null);
              }}
              min={1}
              max={1000}
            />
          </motion.div>
        );

      case 3:
        return (
          <Step4CreateCounter
            data={{
              counterName: String(counter.name || ''),
              color: String(counter.color || '#34C759'),
              customColor: undefined,
              cycleSize: (cycleSize === 0 ? (parseInt(customCycleSize||'108')||108) : cycleSize),
              target: Number(counter.target ?? 1),
            }}
            update={(patch)=>{
              if (patch.counterName!=null) setCounter(prev=> ({...prev, name: patch.counterName!}));
              if (patch.color!=null) setCounter(prev=> ({...prev, color: patch.color!}));
              if (patch.target!=null) setCounter(prev=> ({...prev, target: patch.target!}));
            }}
            next={({ counterName, target })=>{
              setCounter(prev=> ({...prev, name: counterName, target }));
              nextStep();
            }}
            back={prevStep}
          />
        );

      case 4:
        return (
          <motion.div
            initial={false}
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

      {step !== 3 && (
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
          variant={step === 0 || step === steps.length - 1 ? 'primaryGradient' : undefined}
          size="lg"
          disabled={
            (step === 1 && !userName.trim()) ||
            (step === 2 && ((cycleSize === 0 && (!customCycleSize || parseInt(customCycleSize) < 1)) || (cycleSize !== 0 && cycleSize < 1))) ||
            (step === 3 && !((counter.name || '').trim().length >= 1 && (counter.name || '').trim().length <= 32))
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
      )}
    </div>
  );
}
