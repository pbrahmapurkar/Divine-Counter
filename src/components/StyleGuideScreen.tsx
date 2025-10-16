import React, { useState } from 'react';
import { ArrowLeft, Heart, Zap, Eye, Palette, Smartphone } from 'lucide-react';
import { triggerHaptic, gentleHaptic, celebrationHaptic, warningHaptic } from '@/utils/haptics';

interface StyleGuideScreenProps {
  onBack: () => void;
}

export function StyleGuideScreen({ onBack }: StyleGuideScreenProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleHapticTest = async (type: 'gentle' | 'celebration' | 'warning') => {
    switch (type) {
      case 'gentle':
        await gentleHaptic();
        break;
      case 'celebration':
        await celebrationHaptic();
        break;
      case 'warning':
        await warningHaptic();
        break;
    }
  };

  const TypographySection = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-devotion text-foreground">Typography Scale</h3>
        <div className="space-y-6">
          <div className="p-6 bg-card rounded-lg border">
            <div className="text-whisper text-muted-foreground mb-2">Whisper - Gentle guidance</div>
            <div className="text-whisper">This is whisper text for subtle guidance and captions.</div>
          </div>
          
          <div className="p-6 bg-card rounded-lg border">
            <div className="text-body text-muted-foreground mb-2">Body - Foundation of communication</div>
            <div className="text-body">This is body text, the foundation of all spiritual communication in our app.</div>
          </div>
          
          <div className="p-6 bg-card rounded-lg border">
            <div className="text-mantra text-muted-foreground mb-2">Mantra - Spiritual weight</div>
            <div className="text-mantra">This is mantra text, carrying the weight of spiritual affirmations.</div>
          </div>
          
          <div className="p-6 bg-card rounded-lg border">
            <div className="text-devotion text-muted-foreground mb-2">Devotion - Shows dedication</div>
            <div className="text-devotion">This is devotion text for section headers and important messages.</div>
          </div>
          
          <div className="p-6 bg-card rounded-lg border">
            <div className="text-heading text-muted-foreground mb-2">Heading - Commands reverence</div>
            <div className="text-heading">This is heading text for main titles and spiritual milestones.</div>
          </div>
        </div>
      </div>
    </div>
  );

  const MotionSection = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-devotion text-foreground">Motion System</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg border text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full animate-meditation-breath flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="text-mantra mb-2">Meditation Breath</h4>
            <p className="text-whisper text-muted-foreground">4s gentle breathing animation</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg border text-center">
            <button 
              className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full hover:animate-quick-feedback flex items-center justify-center transition-colors"
              onClick={() => handleHapticTest('gentle')}
            >
              <Zap className="w-8 h-8 text-primary-foreground" />
            </button>
            <h4 className="text-mantra mb-2">Quick Feedback</h4>
            <p className="text-whisper text-muted-foreground">200ms button press animation</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg border text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full animate-sacred-transition flex items-center justify-center">
              <Eye className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="text-mantra mb-2">Sacred Transition</h4>
            <p className="text-whisper text-muted-foreground">800ms fade and slide animation</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ElevationSection = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-devotion text-foreground">Elevation (Glow) System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card rounded-lg border text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-primary rounded-lg inner-glow-active flex items-center justify-center">
              <div className="text-primary-foreground text-mantra">Active</div>
            </div>
            <h4 className="text-mantra mb-2">Inner Glow Active</h4>
            <p className="text-whisper text-muted-foreground">For selected and active states</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg border text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-card rounded-lg outer-glow-floating flex items-center justify-center">
              <div className="text-foreground text-mantra">Floating</div>
            </div>
            <h4 className="text-mantra mb-2">Outer Glow Floating</h4>
            <p className="text-whisper text-muted-foreground">For modals and floating elements</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ColorSection = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-devotion text-foreground">Sacred Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h4 className="text-mantra">Lotus Pink</h4>
            <div className="space-y-1">
              <div className="w-full h-12 bg-sacred-lotus-pink-300 rounded"></div>
              <div className="w-full h-12 bg-sacred-lotus-pink-400 rounded"></div>
              <div className="w-full h-12 bg-sacred-lotus-pink-500 rounded"></div>
            </div>
            <p className="text-whisper text-muted-foreground">Compassion & inner peace</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-mantra">Sky Blue</h4>
            <div className="space-y-1">
              <div className="w-full h-12 bg-sacred-sky-blue-300 rounded"></div>
              <div className="w-full h-12 bg-sacred-sky-blue-400 rounded"></div>
              <div className="w-full h-12 bg-sacred-sky-blue-500 rounded"></div>
            </div>
            <p className="text-whisper text-muted-foreground">Wisdom & clarity</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-mantra">Emerald Green</h4>
            <div className="space-y-1">
              <div className="w-full h-12 bg-sacred-emerald-green-300 rounded"></div>
              <div className="w-full h-12 bg-sacred-emerald-green-400 rounded"></div>
              <div className="w-full h-12 bg-sacred-emerald-green-500 rounded"></div>
            </div>
            <p className="text-whisper text-muted-foreground">Balance & renewal</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-mantra">Amethyst Purple</h4>
            <div className="space-y-1">
              <div className="w-full h-12 bg-sacred-amethyst-purple-300 rounded"></div>
              <div className="w-full h-12 bg-sacred-amethyst-purple-400 rounded"></div>
              <div className="w-full h-12 bg-sacred-amethyst-purple-500 rounded"></div>
            </div>
            <p className="text-whisper text-muted-foreground">Intuition & higher consciousness</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-mantra">Gradient Utilities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gradient-dawn rounded-lg flex items-center justify-center">
              <span className="text-white text-mantra font-semibold">Dawn Gradient</span>
            </div>
            <div className="h-24 bg-gradient-dusk rounded-lg flex items-center justify-center">
              <span className="text-white text-mantra font-semibold">Dusk Gradient</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const HapticSection = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-devotion text-foreground">Haptic Feedback System</h3>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-whisper text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Developer Note:</strong> Haptic feedback requires a physical device. 
            Web fallback uses vibration API when available.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg border text-center">
            <button 
              className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full hover:bg-primary/90 flex items-center justify-center transition-colors"
              onClick={() => handleHapticTest('gentle')}
            >
              <Smartphone className="w-8 h-8 text-primary-foreground" />
            </button>
            <h4 className="text-mantra mb-2">Gentle Haptic</h4>
            <p className="text-whisper text-muted-foreground mb-4">Light tap for gentle guidance</p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => handleHapticTest('gentle')}
            >
              Test Gentle
            </button>
          </div>
          
          <div className="p-6 bg-card rounded-lg border text-center">
            <button 
              className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full hover:bg-green-600 flex items-center justify-center transition-colors"
              onClick={() => handleHapticTest('celebration')}
            >
              <Heart className="w-8 h-8 text-white" />
            </button>
            <h4 className="text-mantra mb-2">Celebration Haptic</h4>
            <p className="text-whisper text-muted-foreground mb-4">Joyful pattern for achievements</p>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              onClick={() => handleHapticTest('celebration')}
            >
              Test Celebration
            </button>
          </div>
          
          <div className="p-6 bg-card rounded-lg border text-center">
            <button 
              className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full hover:bg-orange-600 flex items-center justify-center transition-colors"
              onClick={() => handleHapticTest('warning')}
            >
              <Zap className="w-8 h-8 text-white" />
            </button>
            <h4 className="text-mantra mb-2">Warning Haptic</h4>
            <p className="text-whisper text-muted-foreground mb-4">Attention for important actions</p>
            <button 
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              onClick={() => handleHapticTest('warning')}
            >
              Test Warning
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    { id: 'typography', title: 'Typography', icon: Palette, component: TypographySection },
    { id: 'motion', title: 'Motion', icon: Zap, component: MotionSection },
    { id: 'elevation', title: 'Elevation', icon: Eye, component: ElevationSection },
    { id: 'colors', title: 'Colors', icon: Palette, component: ColorSection },
    { id: 'haptics', title: 'Haptics', icon: Smartphone, component: HapticSection },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-body">Back to Settings</span>
            </button>
            <h1 className="text-heading text-foreground">Divine Design System</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-body whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.title}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeSection ? (
          <div className="animate-sacred-transition">
            {sections.find(s => s.id === activeSection)?.component()}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center animate-meditation-breath">
              <Heart className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="text-heading text-foreground mb-4">Sacred Simplicity</h2>
            <p className="text-body text-muted-foreground max-w-md mx-auto">
              Select a section above to explore the Divine Design System components, 
              each crafted with spiritual intention and mindful purpose.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

