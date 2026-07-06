# SafariFlow
# Brand & Design System

> Version: 1.0

---

# Brand Vision

SafariFlow is not simply another travel website.

It is designed to evoke the feeling of planning an unforgettable African safari.

Every page should inspire adventure, trust, luxury, and exploration.

The interface should feel modern, premium, elegant, and immersive while remaining simple enough for visitors of any age to use.

Users should immediately feel:

- Excitement
- Confidence
- Curiosity
- Wanderlust
- Trust

The design philosophy should resemble premium travel brands rather than traditional WordPress themes.

Inspirations include:

- Airbnb
- National Geographic Expeditions
- &Beyond
- Singita
- Discover Africa
- Wilderness
- Apple

---

# Brand Personality

SafariFlow should communicate:

## Professional

Visitors should immediately trust the company.

---

## Luxurious

Large photography

Minimal design

Elegant typography

Generous spacing

---

## Adventurous

Wildlife imagery

Natural colors

Landscape-inspired layouts

---

## Human

Friendly language

Warm interactions

Personal storytelling

---

# Design Principles

## Photography First

Photography sells safaris.

The UI should never compete with photography.

Instead:

- Large banners
- Full-width imagery
- Edge-to-edge galleries
- Minimal overlays

---

## Minimal UI

Avoid unnecessary borders.

Avoid excessive shadows.

Avoid visual clutter.

Whitespace should separate content.

---

## Premium Feel

Large typography

Rounded corners

Soft shadows

Subtle animations

Smooth scrolling

---

## Fast Experience

Animations must never reduce perceived performance.

Images should lazy load.

Everything should feel instant.

---

# Color Palette

## Primary

Safari Green

HEX

```
#1F5E3B
```

Purpose:

- Buttons
- Links
- Highlights
- Primary CTAs

---

## Secondary

Savannah Gold

```
#D4A017
```

Purpose

- Accents
- Ratings
- Icons
- Highlights

---

## Background

Warm Sand

```
#F8F6F2
```

---

## Surface

White

```
#FFFFFF
```

---

## Text Primary

```
#1A1A1A
```

---

## Text Secondary

```
#666666
```

---

## Success

```
#22C55E
```

---

## Error

```
#EF4444
```

---

## Warning

```
#F59E0B
```

---

# Dark Mode

Support dark mode.

Background

```
#111827
```

Surface

```
#1F2937
```

Primary Text

```
#F9FAFB
```

Secondary Text

```
#D1D5DB
```

---

# Typography

Primary Font

Geist

Fallback

```
Inter
System UI
```

Headings

Weight

700

Letter spacing

Slightly tight

Line height

110%

Body

16–18px

Weight

400

Comfortable reading

---

# Heading Scale

Hero

```
64px
```

H1

```
48px
```

H2

```
36px
```

H3

```
30px
```

H4

```
24px
```

H5

```
20px
```

Body

```
16px
```

Small

```
14px
```

---

# Spacing System

Use an 8px spacing grid.

Examples

```
4

8

16

24

32

40

48

64

80

96

128
```

Never invent arbitrary spacing values.

---

# Border Radius

Cards

```
16px
```

Buttons

```
12px
```

Inputs

```
12px
```

Modals

```
24px
```

Hero Images

```
24px
```

---

# Shadows

Cards

Soft

```
shadow-sm
```

Floating

```
shadow-lg
```

Hero

```
shadow-xl
```

Avoid overly dark shadows.

---

# Buttons

## Primary

Background

Safari Green

Text

White

Hover

Slightly darker

Active

Scale 98%

Transition

200ms

---

## Secondary

White background

Green border

Green text

Hover

Light green background

---

## Ghost

Transparent

Hover

Gray background

---

# Cards

Cards should feel premium.

Include

- Rounded corners

- Large imagery

- Soft shadows

- Spacious padding

Cards should never feel cramped.

---

# Forms

Inputs

Large

Comfortable

Accessible

Include:

- Label
- Placeholder
- Validation
- Helper text

Errors should appear beneath the field.

---

# Icons

Use

Lucide React

Avoid emoji icons.

Icons should be:

24px

Stroke width

2

---

# Images

Photography style

- High resolution
- Natural colors
- Wildlife
- Landscapes
- Authentic people
- No stock-looking photos

Image ratios

Hero

16:9

Package

4:3

Gallery

1:1

Destination

3:2

---

# Animations

Framer Motion

Duration

200ms–300ms

Examples

Fade

Slide

Scale

Opacity

Avoid:

Bounce

Spin

Elastic

Heavy motion

---

# Hover Effects

Cards

Lift

2–4px

Images

Scale

1.03

Buttons

Brightness increase

Navigation

Underline animation

---

# Responsive Breakpoints

Mobile

```
<640px
```

Tablet

```
640–1024px
```

Laptop

```
1024–1280px
```

Desktop

```
1280+
```

Ultra Wide

```
1536+
```

---

# Layout Width

Content

```
1280px
```

Hero

```
1600px
```

Reading Width

```
720px
```

---

# Component Library

Use:

shadcn/ui

Required components:

- Button
- Card
- Dialog
- Drawer
- Dropdown Menu
- Tooltip
- Popover
- Calendar
- Accordion
- Tabs
- Carousel
- Avatar
- Badge
- Command
- Input
- Textarea
- Select
- Sheet
- Breadcrumb
- Pagination
- Skeleton
- Toast

---

# Accessibility

Minimum touch target

44px

Keyboard navigation

Required

Focus rings

Always visible

ARIA labels

Required

Contrast ratio

WCAG AA

---

# Mobile UX

Bottom sheets instead of large modals

Sticky booking button

Large touch targets

One-column layouts

Optimized image loading

---

# Future Design Goals

The platform should feel polished enough that users compare it to:

- Airbnb
- Apple
- Booking.com
- National Geographic
- Luxury safari operators

The design should prioritize timeless elegance over trends.

---

# Cursor Implementation Notes

Cursor should:

- Use Tailwind CSS v4 exclusively.
- Use shadcn/ui as the component foundation.
- Build reusable components.
- Avoid inline styles.
- Prefer composition over duplication.
- Maintain strict TypeScript typing.
- Use semantic HTML.
- Ensure responsive layouts from the start.
- Optimize all images with `next/image`.
- Use Framer Motion sparingly for tasteful interactions.
- Keep components modular and easy to extend.

---

# Next Document

02-System-Architecture.md

This document defines the complete technical architecture, folder structure, application flow, API communication, caching strategy, rendering approach (SSR/ISR), security model, and deployment topology.