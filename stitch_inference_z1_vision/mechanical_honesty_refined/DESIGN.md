---
name: 'Mechanical Honesty: Refined'
colors:
  surface: '#121315'
  surface-dim: '#121315'
  surface-bright: '#38393b'
  surface-container-lowest: '#0d0e10'
  surface-container-low: '#1b1c1e'
  surface-container: '#1f2022'
  surface-container-high: '#292a2c'
  surface-container-highest: '#343537'
  on-surface: '#e3e2e5'
  on-surface-variant: '#c1c7d3'
  inverse-surface: '#e3e2e5'
  inverse-on-surface: '#303033'
  outline: '#8b919d'
  outline-variant: '#414751'
  surface-tint: '#a4c9ff'
  primary: '#a4c9ff'
  on-primary: '#00315d'
  primary-container: '#4d93e5'
  on-primary-container: '#002a51'
  inverse-primary: '#0060ac'
  secondary: '#b1c8ed'
  on-secondary: '#19314f'
  secondary-container: '#314867'
  on-secondary-container: '#9fb7db'
  tertiary: '#ffb953'
  on-tertiary: '#452b00'
  tertiary-container: '#c58305'
  on-tertiary-container: '#3c2500'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a4c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#b1c8ed'
  on-secondary-fixed: '#001c39'
  on-secondary-fixed-variant: '#314867'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#ffb953'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#121315'
  on-background: '#e3e2e5'
  surface-variant: '#343537'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  tech-code:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.6'
  tech-stat:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin: 32px
  container-max: 1280px
---

## Brand & Style
This design system embodies a philosophy of technical clarity and emotional stillness. It targets a sophisticated user base—developers, researchers, and engineers—who require a high-focus environment devoid of visual noise. The aesthetic is a fusion of **Minimalism** and **Modern Corporate**, leaning heavily into "Mechanical Honesty" by exposing functional data without decorative clutter.

The emotional response should be one of quiet confidence and precision. By stripping away non-essential vibrant accents and embracing high-contrast utility, the UI acts as a silent partner to the user's workflow. Visual interest is generated through perfect alignment, intentional whitespace, and the rhythmic application of monospaced data against a restrained, dark canvas.

## Colors
The palette is rooted in a "Deep Space" foundation. The primary background is a near-black (#0B0C0E), providing maximum depth. **Celestial Blue (#4A90E2)** is the sole signature accent, used sparingly for primary actions, active states, and focus indicators to maintain a calm atmosphere.

Secondary and tertiary accents (Purple, Yellow) are strictly demoted to status-only roles (e.g., a 6px dot for a warning or a system notification). Surface colors use subtle shifts in gray to define hierarchy. Text relies on **Warm White (#F9FAFB)** for high-contrast readability against the dark backdrop, while secondary metadata uses muted grays to recede into the layout.

## Typography
Typography is split between human-centric communication and machine-centric data. **Inter** handles all interface elements, navigation, and long-form reading, providing a neutral and highly legible experience. 

**Space Mono** is reserved strictly for "genuine technical content." This includes code snippets, file paths, and performance metrics (e.g., tokens/sec). This distinction ensures the user instantly recognizes when they are looking at raw data versus system guidance. Use tight tracking for labels to evoke a "labels on a machine" feel, while keeping body text open for readability.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop to maintain a sense of structured "mechanical" containers, switching to a fluid model for mobile. A 12-column grid is used with generous 24px gutters to prevent information density from feeling overwhelming.

Whitespace is treated as a functional element. High margins between distinct modules (32px+) reinforce the focused nature of the design. On mobile, margins reduce to 16px, and complex technical data tables should transition to horizontally scrollable "technical cards" to preserve the integrity of the monospaced data.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows. This maintains the "flat" mechanical feel. 

- **Level 0 (Background):** #0B0C0E.
- **Level 1 (Cards/Panels):** #16181D with a subtle 1px border of #2D3139.
- **Level 2 (Popovers/Modals):** #1F2229 with a slightly brighter border (#374151).

Shadows, if used for extreme elevation (like a floating command palette), should be sharp and high-offset, mimicking a physical light source directly above the interface with minimal blur (e.g., `0px 4px 12px rgba(0,0,0,0.5)`).

## Shapes
The shape language is "Soft" (0.25rem), providing just enough radius to feel modern and professional without appearing "bubbly" or overly consumer-focused. This restrained rounding maintains the geometric discipline required for a technical tool. Large containers like cards use `rounded-lg` (0.5rem), while buttons and input fields stay at the base `rounded` (0.25rem).

## Components
- **Buttons:** Primary buttons use a solid Celestial Blue (#4A90E2) with white text. Secondary buttons are "Ghost" style—transparent with a #374151 border and white text.
- **Input Fields:** Use a dark fill (#16181D) with a subtle border. On focus, the border transitions to Celestial Blue with a 1px glow.
- **Chips/Tags:** For technical metadata, use Space Mono at a small scale. For category tags, use Inter. Backgrounds should be low-contrast (e.g., 10% opacity of the text color).
- **Cards:** Defined by a 1px border and no shadow. Headers within cards should have a subtle bottom divider to separate titles from technical content.
- **Technical Stats:** Elements like "ms" or "t/s" should be paired with Space Mono and placed in the top-right of containers as "Machine Readouts."
- **Scrollbars:** Custom-styled to be thin (6px) and dark gray, appearing only on hover to reduce visual clutter.