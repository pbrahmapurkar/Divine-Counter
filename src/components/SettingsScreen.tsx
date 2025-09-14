import { motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { ColorRadio, ThemeKey } from './ui/color-radio';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { SectionCard } from '@/components/ui/section-card';
import { SettingRow } from '@/components/ui/setting-row';
import { PillButton } from '@/components/ui/pill-button';

export interface Settings {
  hapticsEnabled: boolean;
  dark: boolean;
  theme: ThemeKey;
  customColor?: string;
  defaultCounterId?: string;
  volumeButtonsEnabled?: boolean;
}

export interface Counter { id: string; name: string; }

type SettingsScreenProps = {
  version: string;
  settings: Settings;
  counters: Counter[];
  setTheme: (t: ThemeKey) => void;
  setCustomColor: (hex: string) => void;
  setDark: (on: boolean) => void;
  setHaptics: (on: boolean) => void;
  setVolumeButtonsEnabled?: (on: boolean) => void;
  setDefaultCounter: (id?: string) => void;
  resetOnboarding: () => void;
  goBack: () => void;
};

export function SettingsScreen(props: SettingsScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const { version, settings } = props;

  // TEMP: mount log for diagnosing re-mounts
  useEffect(() => {
    console.log('MOUNT <SettingsScreen>');
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="min-h-dvh max-w-md mx-auto relative bg-background"
    >
      <header className="sticky top-0 -mx-6 px-6 py-4 bg-background/90 backdrop-blur border-b flex items-center gap-2 z-40">
        <button onClick={props.goBack} aria-label="Back" className="h-9 w-9 rounded-full border flex items-center justify-center">‹</button>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </header>

      <main className="px-6 pt-4 pb-nav overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
        {/* Appearance */}
        <SectionCard icon={<span>🎨</span>} title="Appearance" className="mt-1">
          <SettingRow
            label="Theme"
            control={<ColorRadio value={settings.theme} onChange={props.setTheme} />}
          />
          <SettingRow
            label="Dark Mode"
            control={<Switch checked={settings.dark} onCheckedChange={props.setDark} />}
          />
        </SectionCard>

        {/* Reminders removed */}

        {/* Behavior */}
        <SectionCard icon={<span>🎛️</span>} title="Behavior" className="mt-4">
          <SettingRow
            label="Haptic feedback"
            hint="Vibrate on maala completion."
            control={<Switch checked={settings.hapticsEnabled} onCheckedChange={props.setHaptics} />}
          />
          {props.setVolumeButtonsEnabled && (
            <SettingRow
              label="Volume buttons (Beta)"
              hint="Use device volume keys to count when supported."
              control={<Switch checked={!!settings.volumeButtonsEnabled} onCheckedChange={props.setVolumeButtonsEnabled} />}
            />
          )}
          <SettingRow
            label="Default Counter"
            control={(
              <Select value={settings.defaultCounterId ?? 'none'} onValueChange={(v: string) => props.setDefaultCounter(v === 'none' ? undefined : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {props.counters.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </SectionCard>

        {/* Legal & Info */}
        <SectionCard icon={<span>📄</span>} title="Legal & Info" className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="about">
              <AccordionTrigger>About Us</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm opacity-70">
                  <em>Divine Counter</em> is a mindful mantra & mala counter designed for calm, focused practice. Count with a single tap, auto-track maalas at your chosen cycle (108 by default or custom), switch between multiple counters, and review progress and streaks. Haptics are optional and off by default. No accounts, no clutter—just your practice.
                </p>
                <p className="text-sm opacity-70 mt-2">
                  <strong>About the Author — Pratik Prakash Brahmapurkar</strong>
                  <br />
                  Pratik is a product strategist and <strong>TTC-200 Yoga Teacher (Rishikesh)</strong>, author of <em>Asanas in the Ganges</em>, and a traveler who blends mindful living with practical technology. Divine Counter reflects his mission to build calm, purposeful tools rooted in tradition.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="privacy">
              <AccordionTrigger>Privacy</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm opacity-70">Your data stays on your device (app/browser storage). We don’t collect personal identifiers, location, or analytics.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="terms">
              <AccordionTrigger>Terms</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm opacity-70">Divine Counter is a general wellness and devotional tool—not a medical device or religious authority. Personal, non-commercial use. Features may change without notice. To the maximum extent permitted by law, the author is not liable for indirect or consequential damages. Governed by the laws of India.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SectionCard>

        {/* Maintenance */}
        <SectionCard icon={<span>🛠️</span>} title="Maintenance" className="mt-4" subtitle="Reset onboarding and return to welcome flow.">
          {/* Red warning copy */}
          <p className="text-sm font-medium text-[var(--dc-red)] mb-3">
            ⚠️ Reset Onboarding clears your setup and returns you to the welcome flow.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {/* Yellow trigger button */}
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 bg-[var(--dc-gold)] text-[var(--dc-gold-ink)] font-semibold shadow-sm hover:bg-[var(--dc-gold-hover)] active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dc-gold)]"
              >
                Reset Onboarding
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[var(--dc-red)]">Reset Divine Counter?</AlertDialogTitle>
                <AlertDialogDescription className="text-[var(--dc-red-700)]">This clears your setup and returns to onboarding.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={props.resetOnboarding}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-[var(--dc-gold)] text-[var(--dc-gold-ink)] font-semibold shadow-sm hover:bg-[var(--dc-gold-hover)] active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dc-gold)]"
                >
                  Reset Onboarding
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Reset Counter button removed */}
        </SectionCard>

        {/* Footer meta (outside cards) */}
        <div className="py-5 text-center text-sm opacity-70">Version {version} • © {new Date().getFullYear()} Pratik Prakash Brahmapurkar</div>

        <div aria-hidden className="h-[calc(var(--dc-bottom-nav-h)+env(safe-area-inset-bottom,16px))]" />
      </main>
    </motion.div>
  );
}
