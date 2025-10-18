import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Smartphone,
  RotateCcw,
  Info,
  Shield,
  FileText,
  Heart,
  Compass,
  ChevronRight,
  Sparkles,
  Coffee
} from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Header } from "./Header";
import { SafeAreaView } from "./SafeAreaView";

type InfoSheetKey = "about" | "support" | "privacy" | "terms";

interface SettingsScreenProps {
  hapticsEnabled: boolean;
  onHapticsToggle: () => void;
  onResetTutorial: () => void;
  onOpenInfoPage: (page: InfoSheetKey) => void;
}

interface SettingsItemBase {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  subtitle: string;
}

interface SettingsToggleItem extends SettingsItemBase {
  type: "toggle";
  value: boolean;
  onChange: () => void;
}

interface SettingsActionItem extends SettingsItemBase {
  type: "action";
  action: "resetTutorial" | InfoSheetKey;
}

interface SettingsComingSoonItem extends SettingsItemBase {
  type: "comingSoon";
}

type SettingsItem = SettingsToggleItem | SettingsActionItem | SettingsComingSoonItem;

interface SettingsCardConfig {
  key: string;
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description?: string;
  items: SettingsItem[];
}

export function SettingsScreen({
  hapticsEnabled,
  onHapticsToggle,
  onResetTutorial,
  onOpenInfoPage
}: SettingsScreenProps) {
  const contentPaddingTop = "calc(env(safe-area-inset-top, 0px) + 112px)";
  const [isResetModalOpen, setResetModalOpen] = useState(false);

  const settingsCards: SettingsCardConfig[] = useMemo(
    () => [
      {
        key: "practice-feedback",
        icon: Heart,
        title: "Practice Feedback",
        description: "Tune how the app gently responds during each session.",
        items: [
          {
            icon: Smartphone,
            label: "Haptic Feedback",
            subtitle: "Vibrate gently on every tap",
            type: "toggle",
            value: hapticsEnabled,
            onChange: onHapticsToggle
          },
          {
            icon: Smartphone,
            label: "Volume Button Control",
            subtitle: "Use Volume Up/Down to count (Android only)",
            type: "comingSoon"
          }
        ]
      },
      {
        key: "info-reset",
        icon: Compass,
        title: "Info & Reset",
        description: "Learn more about Divine Counter or start fresh when needed.",
        items: [
          {
            icon: RotateCcw,
            label: "RESET",
            subtitle: "Restart the onboarding flow",
            type: "action",
            action: "resetTutorial"
          },
          {
            icon: Info,
            label: "About",
            subtitle: "App information and philosophy",
            type: "action",
            action: "about"
          }
        ]
      },
      {
        key: "support",
        icon: Sparkles,
        title: "Support the Project",
        description: "Help Divine Counter keep growing with a small gesture.",
        items: [
          {
            icon: Coffee,
            label: "Support the Project",
            subtitle: "Chip in via Buy Me a Coffee or PayPal.",
            type: "action",
            action: "support"
          }
        ]
      },
      {
        key: "policies",
        icon: Shield,
        title: "Privacy & Terms",
        description: "Understand how we protect your data and commitments.",
        items: [
          {
            icon: Shield,
            label: "Privacy Policy",
            subtitle: "How we protect your data",
            type: "action",
            action: "privacy"
          },
          {
            icon: FileText,
            label: "Terms of Service",
            subtitle: "Guidelines and commitments",
            type: "action",
            action: "terms"
          }
        ]
      }
    ],
    [hapticsEnabled, onHapticsToggle]
  );

  const handleAction = (action: SettingsActionItem["action"]) => {
    if (action === "resetTutorial") {
      setResetModalOpen(true);
      return;
    }

    onOpenInfoPage(action);
  };

  return (
    <SafeAreaView className="relative flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/10">
      <Header title="Settings" subtitle="Customize your experience" />

      <main className="flex flex-1 flex-col" style={{ paddingTop: contentPaddingTop }}>
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 pb-32 pt-4">
            <div className="space-y-6 sm:space-y-8">
              {settingsCards.map((card) => {
                const CardIcon = card.icon;

                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="rounded-2xl border border-border/20 bg-card/90 p-4 sm:p-6 shadow-sm shadow-gray-100/50 backdrop-blur-sm dark:shadow-gray-900/20"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                        <CardIcon size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground">{card.title}</h2>
                        {card.description && (
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {card.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isAction = item.type === "action";
                        const isComingSoon = item.type === "comingSoon";
                        const RowComponent = (isAction ? "button" : "div") as
                          | "button"
                          | "div";

                        return (
                          <RowComponent
                            key={item.label}
                            type={isAction ? "button" : undefined}
                            onClick={
                              isAction
                                ? () => handleAction(item.action)
                                : undefined
                            }
                            className={`group flex w-full items-center justify-between rounded-xl border border-border/10 bg-muted/10 px-3 sm:px-4 py-3 sm:py-4 text-left transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 dark:bg-zinc-900/20 dark:hover:bg-zinc-900/40 min-h-[60px] touch-manipulation ${
                              isComingSoon ? "opacity-50 pointer-events-none hover:border-border/10 hover:bg-muted/10" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex-shrink-0">
                                <ItemIcon size={16} />
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base font-medium text-foreground">
                                  {item.label}
                                </p>
                                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="ml-2 flex items-center flex-shrink-0">
                              {item.type === "toggle" ? (
                                <Switch
                                  checked={item.value}
                                  onCheckedChange={item.onChange}
                                  aria-label={item.label}
                                />
                              ) : item.type === "comingSoon" ? (
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Coming Soon
                                </span>
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:text-[#D4AF37]" />
                              )}
                            </div>
                          </RowComponent>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Version Information - Fixed at bottom of scrollable area */}
          <div className="px-4 sm:px-6 pb-6">
            <div className="rounded-xl border border-border/10 bg-muted/5 px-3 sm:px-4 py-3 text-center">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Divine Counter v1.0.7
              </p>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        open={isResetModalOpen}
        title="Are you sure?"
        description="This will permanently delete all your data, including your name, practices, history, and settings. You will return to the welcome screen."
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onCancel={() => setResetModalOpen(false)}
        onConfirm={() => {
          onResetTutorial();
          setResetModalOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-card/95 p-6 shadow-[0_30px_70px_-20px_rgba(212,175,55,0.4)] backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] shadow-inner shadow-[#D4AF37]/30">
                <Sparkles size={20} />
              </span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="rounded-xl border border-border/20 bg-muted/20 py-2.5 text-sm font-medium hover:bg-muted/30"
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                className="rounded-xl bg-[#D4AF37] py-2.5 text-sm font-semibold text-black shadow-[0_14px_28px_-12px_rgba(212,175,55,0.6)] transition hover:bg-[#caa634]"
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
