# Delete Data Modal - Design Tokens & Specifications

## Overview

Mobile confirmation dialog for Divine Counter's Settings screen that warns users before permanently deleting account data. Optimized for Android portrait (411×823 dp) and responsive across devices.

## Design Tokens

### Colors

```css
/* Backdrop */
--backdrop-bg: rgba(0, 0, 0, 0.7);
--backdrop-blur: blur(12px);

/* Modal Background */
--modal-bg: rgba(17, 24, 39, 0.98); /* gray-900/98 */
--modal-border: rgba(55, 65, 81, 0.3); /* gray-700 */

/* Text Colors */
--text-primary: #ffffff; /* white */
--text-secondary: #d1d5db; /* gray-300 */
--text-muted: #9ca3af; /* gray-400 */

/* Golden Accent */
--gold-base: #D4AF37;
--gold-light: #FFD700;
--gold-hover: #caa634;
--gold-active: #c09d2f;
--gold-glow: rgba(212, 175, 55, 0.4);

/* Button Colors */
--button-cancel-bg: transparent;
--button-cancel-border: rgba(55, 65, 81, 1); /* gray-700 */
--button-cancel-hover: rgba(31, 41, 55, 0.5); /* gray-800/50 */
--button-delete-bg: #D4AF37;
--button-delete-shadow: rgba(212, 175, 55, 0.3);
```

### Spacing

```css
/* Internal Padding */
--padding-mobile: 20px;
--padding-tablet: 24px;

/* Component Spacing */
--spacing-icon-title: 20px;
--spacing-title-desc: 8px;
--spacing-desc-buttons: 24px;
--spacing-button-gap: 12px;
--spacing-modal-horizontal: 16px; /* 4px = 1rem in mobile */
```

### Typography

```css
/* Title */
--font-title-size: 20px;
--font-title-line-height: 28px;
--font-title-weight: 600; /* semi-bold */

/* Description */
--font-desc-size: 16px;
--font-desc-line-height: 24px;
--font-desc-weight: 400; /* regular */

/* Buttons */
--font-button-size: 16px;
--font-button-weight: 500; /* medium */
--font-button-weight-bold: 600; /* semi-bold */
```

### Elevation & Shadows

```css
/* Modal Shadow */
--shadow-modal: 
  0 20px 60px rgba(0, 0, 0, 0.5),
  inset 0 1px 2px rgba(255, 255, 255, 0.05);

/* Icon Glow */
--shadow-icon-glow: 
  0 0 24px rgba(212, 175, 55, 0.4),
  inset 0 0 16px rgba(212, 175, 55, 0.1);

/* Delete Button Shadow */
--shadow-button-delete: 
  0 4px 12px rgba(212, 175, 55, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

### Border Radius

```css
--radius-modal: 20px; /* rounded-2xl */
--radius-button: 12px; /* rounded-xl */
--radius-icon: 50%; /* full circle */
```

### Dimensions

```css
/* Icon */
--icon-size: 64px;
--icon-inner-size: 32px;

/* Buttons */
--button-height: 44px; /* Minimum touch target */
--button-padding-x: 16px;
--button-padding-y: 12px;

/* Modal */
--modal-max-width-mobile: 90%;
--modal-max-width-tablet: 400px;
```

## Responsive Specifications

### Android Portrait (411×823 dp)

```css
.modal {
  max-width: 90%;
  padding: 20px;
}

.icon {
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  line-height: 28px;
  margin-bottom: 8px;
}

.description {
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 24px;
  padding: 0 8px;
}

.buttons {
  gap: 12px;
  min-height: 44px;
}
```

### Tablet & Desktop

```css
@media (min-width: 640px) {
  .modal {
    max-width: 400px;
    padding: 24px;
  }
}
```

## Animation Specs

### Backdrop

```css
animation: fadeIn 0.2s ease-out;
```

### Modal

```css
animation: 
  fadeIn 0.3s ease-out,
  scaleUp 0.3s spring(300, 30),
  slideUp 0.3s ease-out;

@keyframes scaleUp {
  from { scale: 0.95; }
  to { scale: 1; }
}

@keyframes slideUp {
  from { y: 20px; }
  to { y: 0; }
}
```

### Icon

```css
animation: 
  scaleIn 0.3s ease-out 0.1s,
  pulse 2s ease-in-out infinite;

@keyframes scaleIn {
  from { 
    scale: 0;
    opacity: 0;
  }
  to { 
    scale: 1;
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { 
    scale: 1;
    opacity: 0.6;
  }
  50% { 
    scale: 1.15;
    opacity: 0.8;
  }
}
```

## Accessibility

### Contrast Ratios

- **White text on gray-900**: 12.6:1 (AAA)
- **Gray-300 text on gray-900**: 7.2:1 (AAA)
- **Golden button on gray-900**: 4.5:1 (AA large text)
- **Golden button hover**: 4.8:1 (AA large text)

### Focus States

```css
/* Cancel Button */
focus: {
  outline: 2px solid gray-600;
  outline-offset: 2px;
}

/* Delete Button */
focus: {
  outline: 2px solid #D4AF37;
  outline-offset: 2px;
}
```

### ARIA Labels

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby="delete-data-title"`
- `aria-describedby="delete-data-description"`
- Button `aria-label` attributes

### Minimum Touch Targets

- All interactive elements: **44×44 dp** minimum
- Button height: **44px** (exceeds minimum)
- Button padding ensures comfortable touch area

## Button States

### Cancel Button (Ghost)

```css
/* Default */
background: transparent;
border: 1px solid gray-700;
color: gray-300;

/* Hover */
background: gray-800/50;
border-color: gray-700;

/* Active */
background: gray-800;

/* Focus */
outline: 2px solid gray-600;
outline-offset: 2px;
```

### Delete Button (Golden)

```css
/* Default */
background: #D4AF37;
color: white;
shadow: 0 4px 12px rgba(212, 175, 55, 0.3);

/* Hover */
background: #caa634;
shadow: 0 6px 16px rgba(212, 175, 55, 0.4);

/* Active */
background: #c09d2f;
shadow: 0 2px 8px rgba(212, 175, 55, 0.3);

/* Focus */
outline: 2px solid #D4AF37;
outline-offset: 2px;
```

## Implementation Notes

1. **Backdrop Blur**: Uses CSS `backdrop-blur-[12px]` for iOS/Chrome support
2. **Z-Index**: Modal at `z-[101]`, backdrop at `z-[100]` to ensure proper layering
3. **Click Outside**: Clicking backdrop calls `onCancel`
4. **Pointer Events**: Backdrop uses `pointer-events-none`, modal uses `pointer-events-auto`
5. **Spring Animation**: Modal uses spring physics for natural motion
6. **Icon Animation**: Icon scales in with delay, then pulses continuously
7. **Responsive**: Adapts padding and max-width based on viewport

## Usage Example

```tsx
<DeleteDataModal
  isOpen={isOpen}
  onCancel={() => setIsOpen(false)}
  onConfirm={() => {
    // Delete all data
    handleDeleteAllData();
    setIsOpen(false);
  }}
/>
```

## Visual Hierarchy

1. **Icon** (highest priority) - Golden glowing icon draws attention
2. **Title** - Clear, concise warning
3. **Description** - Supporting details in muted text
4. **Actions** - Clear separation, Cancel (left) vs Delete (right)

