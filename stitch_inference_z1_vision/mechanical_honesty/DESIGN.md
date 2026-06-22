---
name: Mechanical Honesty
colors:
  surface: '#121317'
  surface-dim: '#121317'
  surface-bright: '#38393d'
  surface-container-lowest: '#0d0e12'
  surface-container-low: '#1a1b1f'
  surface-container: '#1e1f23'
  surface-container-high: '#292a2e'
  surface-container-highest: '#343539'
  on-surface: '#e3e2e7'
  on-surface-variant: '#c1c7d3'
  inverse-surface: '#e3e2e7'
  inverse-on-surface: '#2f3034'
  outline: '#8b919d'
  outline-variant: '#414751'
  surface-tint: '#a4c9ff'
  primary: '#a4c9ff'
  on-primary: '#00315d'
  primary-container: '#4d93e5'
  on-primary-container: '#002a51'
  inverse-primary: '#0060ac'
  secondary: '#e8c347'
  on-secondary: '#3c2f00'
  secondary-container: '#ae8d0d'
  on-secondary-container: '#342800'
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
  secondary-fixed: '#ffe083'
  secondary-fixed-dim: '#e8c347'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#ffb953'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#121317'
  on-background: '#e3e2e7'
  surface-variant: '#343539'
typography:
  display-z1:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  display-inference:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.1em
  headline-md:
    fontFamily: Space Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  meta-mono:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar_width: 260px
  chat_max_width: 800px
  gutter: 1.5rem
  stack-xs: 0.25rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is built on the philosophy of "Mechanical Honesty"—a transparent, technical, and moody aesthetic tailored for local AI processing. It rejects the aggressive "hacker" tropes of the past in favor of a calm, sophisticated workspace that feels like a precision instrument.

The UI utilizes a **Minimalist** approach with a **Technical** edge. It prioritizes clarity and whitespace to reduce the cognitive load of interacting with complex models. Surface hierarchy is established through subtle tonal layering rather than physical shadows, creating a focused, "ambient" dark environment where the AI's output is the primary light source.

## Colors

The palette is anchored in a near-black base to provide maximum depth and minimize eye strain. 

- **Primary (Celestial Blue):** Used for active states, primary actions, and branding highlights. It represents the "intelligence" of the system.
- **Signal (Electric Yellow):** Reserved exclusively for the "Generating" state. This color indicates mechanical activity and the flow of data.
- **Neutral (Refined Gray):** A calibrated grayscale used for UI scaffolding. Borders use a low-contrast gray to define structure without cluttering the visual field.

## Typography

This design system uses a dual-font strategy to balance technical precision with reading comfort.

- **Headlines & Technical Data:** Utilizes **Space Mono** and **JetBrains Mono**. This reinforces the "mechanical" nature of local inference. Branding uses a specific hierarchy: "Inference" is small, muted, and all-caps, while "Z1" is bold and rendered in the primary accent color.
- **Body Content:** Utilizes **Geist** for chat messages and long-form text. It provides high legibility and a modern, clean feel that prevents the technical aesthetic from becoming fatiguing.
- **Metadata:** Performance metrics (tokens/sec, RAM usage) are always rendered in small-scale JetBrains Mono to signify they are system-level outputs.

## Layout & Spacing

The layout is structured around a fixed sidebar for session management and a centered, fluid chat thread. 

- **Sidebar:** A persistent left-hand column used for history and model selection.
- **Chat Container:** Constrained to a max-width of 800px to maintain optimal line lengths for reading. 
- **Rhythm:** An 8px grid system governs all spacing. Use `stack-lg` for separating major UI sections and `stack-sm` for internal component grouping.
- **Responsive Behavior:** On mobile, the sidebar collapses into a drawer, and chat horizontal margins reduce to 16px.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** rather than traditional shadows.

1. **Floor (Base):** `#0B0C0E` — The primary background for the entire application.
2. **Level 1 (Surfaces):** A slightly lighter tint (`#161719`) used for the sidebar and input area to create separation.
3. **Outlines:** Elements are defined by 1px solid borders (`#2D2E30`). 
4. **Active State:** Instead of a shadow, an active element (like a selected chat or focused input) is signaled by a Primary Blue border or a subtle inner glow.

## Shapes

The shape language is refined and intentional, echoing the build quality of premium modern hardware.

- **Standard Elements:** Buttons, input fields, and chat blocks use a `0.5rem` (8px) radius. 
- **Interactive Containers:** Larger cards or the main chat input bar use `rounded-lg` (16px) to appear more approachable.
- **Pills:** Status indicators and chips use a full pill shape to contrast against the more geometric UI layout.

## Components

- **Buttons:** 
  - *Primary:* Solid Celestial Blue with white or black text. 
  - *Secondary:* Ghost style with a `#2D2E30` border and subtle hover fill.
  - *CTA (Load Model):* Prominent centered button in empty states with a "plus" icon in monospace.
- **Chat Messages:** Avoid heavy bubbles. Use plain text blocks with a subtle vertical line on the left for AI responses to denote "system output." User messages are clean and right-aligned or slightly indented.
- **Generating State:** When the model is active, a thin Electric Yellow bar or "lightning arc" animation appears at the top of the chat input or as a pulse on the active message.
- **Performance Metadata:** Displayed in the footer of each AI message or a global status bar. Use `meta-mono` typography in a muted gray.
- **Input Field:** A large, multi-line text area with a fixed-height footer for secondary controls (model settings, temperature).
- **Sidebar Items:** High-contrast text for the active session, with a 2px vertical Celestial Blue indicator on the far left.