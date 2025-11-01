# Divine Design System

> *"Sacred Simplicity" - A design system that embodies calm, minimalist, spiritually resonant principles for the Divine Counter app.*

## Philosophy

The Divine Design System follows the Sacred Simplicity philosophy, creating interfaces that are:
- **Calm**: Gentle, non-overwhelming visual and tactile experiences
- **Minimalist**: Clean, purposeful design without unnecessary elements
- **Spiritually Resonant**: Every design choice reflects the app's spiritual purpose

## Typography System

### Sacred Typography Scale

Our typography system uses spiritually themed semantic names that reflect the app's purpose:

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-whisper` | 12px | 18px | 400 | Subtle text, captions, fine print - embodies gentle guidance |
| `text-body` | 16px | 24px | 400 | Standard reading text - the foundation of spiritual communication |
| `text-mantra` | 20px | 28px | 600 | Emphasized text, affirmations - carries spiritual weight |
| `text-devotion` | 24px | 32px | 600 | Section headers, important messages - shows dedication |
| `text-heading` | 32px | 40px | 700 | Main titles, spiritual milestones - commands reverence |

### Usage Guidelines

- **Whisper**: Use for subtle guidance text, captions, and fine print
- **Body**: Default text for all reading content
- **Mantra**: For affirmations, important quotes, and emphasized content
- **Devotion**: Section headers and important announcements
- **Heading**: Main page titles and spiritual milestones

### Implementation

```css
/* CSS Custom Properties */
--text-whisper: .75rem;
--text-whisper--line-height: 1.5;
--text-whisper--letter-spacing: -.01em;

/* Utility Classes */
.text-whisper { /* ... */ }
.text-body { /* ... */ }
.text-mantra { /* ... */ }
.text-devotion { /* ... */ }
.text-heading { /* ... */ }
```

## Motion System

### Sacred Motion Tokens

Our motion system provides gentle, spiritually resonant animations:

| Token | Duration | Easing | Behavior | Usage |
|-------|----------|--------|----------|-------|
| `animate-meditation-breath` | 4s | ease-in-out | Scale 98% → 102% with opacity modulation | Breathing animations, calm states |
| `animate-quick-feedback` | 200ms | ease-out | Scale 100% → 96% → 100% with shadow | Button presses, immediate feedback |
| `animate-sacred-transition` | 800ms | ease-in-out | Fade + translate Y 12px → 0 | Modal reveals, page transitions |

### Usage Guidelines

- **Meditation Breath**: Use for breathing exercises, calm loading states, or meditative elements
- **Quick Feedback**: For button presses, form interactions, and immediate user feedback
- **Sacred Transition**: For modal reveals, page transitions, and important state changes

### Implementation

```css
/* Keyframes */
@keyframes meditation-breath {
  0%, 100% { transform: scale(0.98); opacity: 0.9; }
  50% { transform: scale(1.02); opacity: 1; }
}

/* Utility Classes */
.animate-meditation-breath { animation: meditation-breath 4s ease-in-out infinite; }
.animate-quick-feedback { animation: quick-feedback 200ms ease-out; }
.animate-sacred-transition { animation: sacred-transition 800ms ease-in-out; }
```

## Elevation (Glow) System

### Sacred Glow Utilities

Our elevation system uses gentle glows instead of harsh shadows:

| Token | Type | Effect | Usage |
|-------|------|--------|-------|
| `inner-glow-active` | Inset Shadow | Soft inner glow with primary color | Active states, selected elements |
| `outer-glow-floating` | Drop Shadow | Soft outer glow for floating elements | Modals, cards, floating UI |

### Usage Guidelines

- **Inner Glow Active**: Use for selected states, active buttons, and focused elements
- **Outer Glow Floating**: Use for modals, floating cards, and elevated UI elements

### Implementation

```css
.inner-glow-active {
  --tw-inset-shadow: inset 0 0 12px rgba(var(--primary-rgb, 59, 130, 246), 0.35);
  box-shadow: var(--tw-inset-shadow), /* ... other shadows */;
}

.outer-glow-floating {
  --tw-shadow: 0 16px 40px rgba(var(--primary-rgb, 59, 130, 246), 0.25);
  box-shadow: /* ... other shadows */, var(--tw-shadow);
}
```

## Color System

### Sacred Color Palette

Our color system uses spiritually meaningful colors with semantic naming:

| Color | Token | Usage | Meaning |
|-------|-------|-------|---------|
| Lotus Pink | `sacred-lotus-pink-{300,400,500}` | Backgrounds, borders, text | Compassion and inner peace |
| Sky Blue | `sacred-sky-blue-{300,400,500}` | Accents, highlights | Wisdom and clarity |
| Emerald Green | `sacred-emerald-green-{300,400,500}` | Success states, growth | Balance and renewal |
| Amethyst Purple | `sacred-amethyst-purple-{300,400,500}` | Spiritual elements | Intuition and higher consciousness |

### Gradient Utilities

| Token | Colors | Usage |
|-------|--------|-------|
| `bg-gradient-dawn` | Lotus Pink → Sky Blue | Morning themes, new beginnings |
| `bg-gradient-dusk` | Emerald Green → Amethyst Purple | Evening themes, reflection |

### Implementation

```css
/* Color Tokens */
--color-sacred-lotus-pink-400: oklch(.78 .18 340);
--color-sacred-sky-blue-400: oklch(.82 .15 220);
--color-sacred-emerald-green-400: oklch(.78 .18 150);
--color-sacred-amethyst-purple-400: oklch(.78 .18 280);

/* Gradient Utilities */
.bg-gradient-dawn {
  background-image: linear-gradient(135deg, 
    var(--color-sacred-lotus-pink-400) 0%, 
    var(--color-sacred-sky-blue-400) 100%);
}
```

## Haptic Feedback System

### Sacred Haptic Types

Our haptic system provides gentle, spiritually resonant tactile feedback:

| Type | Pattern | Usage | Meaning |
|------|---------|-------|---------|
| `gentle` | Light impact (50ms) | Taps, selections | Gentle guidance |
| `celebration` | Success notification | Achievements, completions | Joyful recognition |
| `warning` | Medium impact (200ms) | Errors, important actions | Attention and care |

### Usage Guidelines

- **Gentle**: Use for every tap, selection, and gentle interaction
- **Celebration**: Use for cycle completions, achievements, and milestones
- **Warning**: Use for errors, important confirmations, and critical actions

### Implementation

```typescript
import { triggerHaptic, gentleHaptic, celebrationHaptic, warningHaptic } from '@/utils/haptics';

// Direct usage
await triggerHaptic('gentle');
await triggerHaptic('celebration');
await triggerHaptic('warning');

// Convenience functions
gentleHaptic();
celebrationHaptic();
warningHaptic();
```

## Accessibility Considerations

### Contrast Targets

All colors meet WCAG AA contrast requirements:
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **Interactive elements**: 3:1 contrast ratio minimum

### Motion Preferences

Respect user motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-meditation-breath,
  .animate-quick-feedback,
  .animate-sacred-transition {
    animation: none;
  }
}
```

### Haptic Accessibility

- Haptic feedback is always optional and can be disabled
- Web fallback uses vibration API when available
- Graceful degradation when haptics are not supported

## Code References

- **Typography**: `src/index.css` lines 135-158 (CSS variables), 2305-2333 (utilities)
- **Motion**: `src/index.css` lines 4233-4269 (keyframes), 1085-1096 (utilities)
- **Elevation**: `src/index.css` lines 2642-2651 (utilities)
- **Colors**: `src/index.css` lines 132-151 (CSS variables), 1711-1726 (gradients)
- **Haptics**: `src/utils/haptics.ts` (complete implementation)

## Style Guide

A live style guide is available in the app at `/style-guide` (hidden from main navigation). Access it through:
1. Settings → About → Long press the app version
2. Or add `?style-guide=true` to the URL

The style guide showcases all design system tokens in action with interactive examples.








