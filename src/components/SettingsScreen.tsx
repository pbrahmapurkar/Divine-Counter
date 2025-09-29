import { Smartphone, Volume2, RotateCcw, Info, Shield, FileText, X, Mail, Instagram, Globe } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Header } from './Header';
import { HapticsTest } from './HapticsTest';
import { VolumeControlTest } from './VolumeControlTest';
import { useState } from "react";
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface SettingsScreenProps {
  hapticFeedback: boolean;
  onHapticFeedbackToggle: () => void;
  volumeKeyControl: boolean;
  onVolumeKeyControlToggle: () => void;
  onResetTutorial: () => void;
}

export function SettingsScreen({
  hapticFeedback,
  onHapticFeedbackToggle,
  volumeKeyControl,
  onVolumeKeyControlToggle,
  onResetTutorial
}: SettingsScreenProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const settingsGroups = [
    {
      title: "Appearance & Behavior",
      items: [
        {
          icon: Smartphone,
          label: "Haptic Feedback",
          subtitle: "Vibrate gently on every tap",
          type: "toggle" as const,
          value: hapticFeedback,
          onChange: onHapticFeedbackToggle
        },
        {
          icon: Volume2,
          label: "Volume Key Control",
          subtitle: "Use volume keys to count (Beta)",
          type: "toggle" as const,
          value: volumeKeyControl,
          onChange: onVolumeKeyControlToggle
        }
      ]
    },
    {
      title: "Info & Reset",
      items: [
        {
          icon: RotateCcw,
          label: "Reset Tutorial",
          subtitle: "Restart the onboarding flow",
          type: "action" as const,
          action: "resetTutorial"
        },
        {
          icon: Info,
          label: "About",
          subtitle: "App information",
          type: "action" as const,
          action: "about"
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          subtitle: "How we protect your data",
          type: "action" as const,
          action: "privacy"
        },
        {
          icon: FileText,
          label: "Terms of Service",
          subtitle: "Terms and conditions",
          type: "action" as const,
          action: "terms"
        }
      ]
    }
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case "resetTutorial":
        if (window.confirm("Reset Tutorial?\nThis will restart the onboarding guide on the next app launch.")) {
      onResetTutorial();
        }
        break;
      case "about":
        setIsAboutOpen(true);
        break;
      case "privacy":
        setIsPrivacyOpen(true);
        break;
      case "terms":
        setIsTermsOpen(true);
        break;
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header
        title="Settings"
        subtitle="Customize your experience"
      />
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto" style={{ paddingTop: '100px' }}>
        <div className="px-4 pb-24">
        
        <div className="space-y-6">
          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className="text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    
                    {item.type === "toggle" && (
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                      />
                    )}
                    
                    {item.type === "action" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction(item.action)}
                      >
                        {item.action === "resetTutorial" ? "Reset" : "View"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Haptics Test Component */}
        <HapticsTest hapticFeedback={hapticFeedback} />
        
        {/* Volume Control Test Component */}
        <VolumeControlTest volumeKeyControl={volumeKeyControl} />
      </div>

      {/* About Modal */}
      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent className="max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-[#D4AF37] mb-4">
              About Divine Counter
            </DialogTitle>
          </DialogHeader>
          
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAboutOpen(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-6 text-sm leading-relaxed">
            {/* Main Description */}
                <div>
              <p className="mb-4">
                Divine Counter is your modern companion for ancient practice.
                Created with simplicity and intention, the app offers a serene and distraction-free space to deepen meditation and mantra recitation.
              </p>
              
              <p className="mb-4">
                We believe technology should serve the soul, not overwhelm it. That's why Divine Counter focuses on the essentials—gentle counters, mindful progress tracking, and a space for reflection—helping you nurture consistency, clarity, and inner calm.
              </p>
              
              <p className="text-[#D4AF37] font-medium">
                Every tap is a step on your journey, and we're honored to walk beside you.
              </p>
            </div>

            {/* About the Creator */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-[#D4AF37] mb-2">About the Creator</h3>
              <p className="mb-4">
                Pratik Brahmapurkar is a developer, author, and yoga practitioner dedicated to blending mindfulness with modern design. With a passion for intuitive experiences and purposeful technology, he creates tools that inspire growth, discipline, and well-being.
              </p>
                </div>

            {/* Contact & Connect */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-[#D4AF37] mb-3">Contact & Connect</h3>
              <p className="mb-4 text-muted-foreground">
                We'd love to hear your reflections, suggestions, or stories from your practice.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#D4AF37]" />
                  <a 
                    href="mailto:pbrahmapurkar@gmail.com" 
                    className="text-blue-600 hover:underline"
                  >
                    pbrahmapurkar@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Instagram size={16} className="text-[#D4AF37]" />
                  <a 
                    href="https://instagram.com/mister.pb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @mister.pb
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-[#D4AF37]" />
                  <a 
                    href="https://misterpb.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    misterpb.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogContent className="max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-[#D4AF37] mb-4">
              Privacy Policy
            </DialogTitle>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Effective Date: September 28, 2025
            </p>
          </DialogHeader>
          
          {/* Additional Close Button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPrivacyOpen(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <p className="mb-4">
                At Divine Counter, your privacy is not just respected—it's central to how we design and operate the app. This policy explains what information we handle and how we protect it.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">1. Our Privacy Promise</h3>
              <p className="mb-4">
                Divine Counter is built as a private sanctuary for your spiritual practice. All your data stays on your device. We do not collect, track, or share any personal information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">2. Information We Handle</h3>
              <p className="mb-2">The app may store the following only on your device:</p>
              <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
                <li>Your name (if provided)</li>
                <li>Practice details (cycle counts, goals, icons, themes)</li>
                <li>Daily counts and progress history</li>
                <li>Personal journal reflections</li>
                <li>App settings (e.g., dark mode, haptic preferences)</li>
              </ul>
              <p className="mb-4">
                None of this information is sent to us or third parties. The app works fully offline.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">3. Data Storage</h3>
              <p className="mb-4">
                Your information is saved securely in your device's local storage. You are in complete control of it.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">4. Data Deletion</h3>
              <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
                <li>You may delete your data anytime through the app's settings.</li>
                <li>Uninstalling the app will also remove all associated data from your device.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">5. Children's Privacy</h3>
              <p className="mb-4">
                Divine Counter is not intended for children under 13. We do not knowingly collect data from children.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">6. Updates to This Policy</h3>
              <p className="mb-4">
                We may update this Privacy Policy as the app evolves. Changes will be posted within the app, and the effective date will be updated.
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-[#D4AF37] mb-2">7. Contact</h3>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please reach out:
              </p>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#D4AF37]" />
                <a 
                  href="mailto:pbrahmapurkar@gmail.com" 
                  className="text-blue-600 hover:underline"
                >
                  pbrahmapurkar@gmail.com
                </a>
              </div>
            </div>
          </div>
          
          {/* Close Button at Bottom */}
          <div className="flex justify-center mt-6 pt-4 border-t">
            <Button
              onClick={() => setIsPrivacyOpen(false)}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-8 py-2"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogContent className="max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-[#D4AF37] mb-4">
              Terms of Service
            </DialogTitle>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Effective Date: September 28, 2025
            </p>
          </DialogHeader>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <p className="mb-4">
                Please read these Terms carefully before using Divine Counter. By downloading or using the app, you agree to the following:
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">1. Agreement to Terms</h3>
              <p className="mb-4">
                Your use of Divine Counter is conditioned on your acceptance of these Terms. If you do not agree, please do not use the app.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">2. Purpose of the App</h3>
              <p className="mb-4">
                Divine Counter is a personal tool to support spiritual and meditation practices. You agree to use it only for lawful, intended purposes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">3. User Data</h3>
              <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
                <li>You own all content you create (practice data, counts, journal entries).</li>
                <li>All data is stored locally on your device.</li>
                <li>You are solely responsible for managing and backing up your data.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">4. Intellectual Property</h3>
              <p className="mb-4">
                The app's design, features, and content are the exclusive property of Pratik Brahmapurkar.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">5. Disclaimer of Warranties</h3>
              <p className="mb-4">
                The app is provided "as is" without guarantees of uninterrupted use or error-free performance. While we strive for reliability, we cannot be responsible for data loss. We recommend making regular backups via the export feature.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">6. Limitation of Liability</h3>
              <p className="mb-4">
                In no event shall the developer be liable for indirect or consequential damages, including but not limited to loss of data or interruptions to practice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">7. Changes to Terms</h3>
              <p className="mb-4">
                We may update these Terms from time to time. Updates will be reflected within the app, along with the effective date.
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-[#D4AF37] mb-3">8. Contact</h3>
              <p className="mb-4">
                For questions or feedback, please connect with us:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#D4AF37]" />
                  <a 
                    href="mailto:pbrahmapurkar@gmail.com" 
                    className="text-blue-600 hover:underline"
                  >
                    pbrahmapurkar@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Instagram size={16} className="text-[#D4AF37]" />
                  <a 
                    href="https://instagram.com/mister.pb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @mister.pb
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-[#D4AF37]" />
                  <a 
                    href="https://misterpb.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    misterpb.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
        </div>
  );
}
