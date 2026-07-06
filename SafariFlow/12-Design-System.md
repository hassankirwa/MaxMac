# SafariFlow
# 12 — Design System

Version: 1.0

---

# Design Philosophy

SafariFlow should communicate:

- Adventure
- Luxury
- Trust
- Simplicity
- Conservation
- Professionalism

The interface should never feel cluttered.

Whitespace is a feature.

Content should breathe.

---

# Design Principles

Every screen should prioritize:

✓ Readability

✓ Consistency

✓ Accessibility

✓ Performance

✓ Simplicity

✓ Emotional storytelling

---

# Brand Personality

Premium

Modern

Warm

Natural

Reliable

Elegant

Authentic

---

# Visual Inspiration

Avoid "template" aesthetics.

Aim for:

Large photography

Minimal chrome

Rounded corners

Soft shadows

Generous spacing

Strong typography

Natural colors

---

# Color System

Primary

Safari Green

Primary Dark

Forest Green

Secondary

Savannah Gold

Accent

Sunset Orange

Success

Emerald

Warning

Amber

Danger

Red

Info

Blue

Neutral

Stone Gray

Background

Warm Off-White

Surface

White

Dark Surface

Charcoal

---

# CSS Variables

Example

--color-primary

--color-secondary

--color-background

--color-surface

--radius

--shadow

--spacing

Never hardcode colors inside components.

---

# Typography

Primary Font

Geist Sans

Fallback

Inter

Headings

Bold

High contrast

Body

Comfortable reading width

Line height

1.6

Maximum line width

70 characters

---

# Font Scale

Display

Hero

H1

H2

H3

H4

Body Large

Body

Small

Caption

Use a consistent type scale.

---

# Spacing System

Base Unit

4px

Scale

4

8

12

16

24

32

48

64

80

96

128

Avoid arbitrary spacing values.

---

# Grid System

12-column grid.

Maximum content width:

1440px

Reading width:

768px

Cards should align consistently.

---

# Border Radius

Small

Medium

Large

Extra Large

Buttons and cards should share the same radius system.

---

# Shadows

Small

Medium

Large

Extra Large

Use shadows sparingly.

---

# Buttons

Variants

Primary

Secondary

Outline

Ghost

Link

Danger

Loading

Disabled

Sizes

Small

Medium

Large

Full Width

---

# Forms

Every form includes:

Label

Helper Text

Validation

Error State

Success State

Required Indicator

---

# Inputs

Text

Textarea

Select

Autocomplete

Calendar

Phone

Country

Checkbox

Radio

Switch

File Upload

---

# Cards

Package Card

Destination Card

Review Card

Blog Card

Gallery Card

Guide Card

Accommodation Card

Cards should have:

Consistent spacing

Image ratio

Hover effect

Accessible focus state

---

# Navigation

Desktop

Horizontal

Sticky

Transparent over hero

Solid on scroll

Mobile

Slide-over menu

Bottom CTA for booking

---

# Icons

Use Lucide React.

Maintain consistent stroke width.

Do not mix icon libraries.

---

# Photography

Photography is the primary design element.

Guidelines:

Large

High quality

Natural lighting

Authentic moments

Minimal overlays

Use WebP or AVIF formats where possible.

---

# Image Ratios

Hero

16:9

Card

4:3

Gallery

1:1

Guide

3:4

Logo

SVG

---

# Animations

Subtle only.

Use for:

Page transitions

Card hover

Accordion

Modal

Booking progress

Avoid excessive motion.

Respect reduced motion preferences.

---

# Motion Timing

Fast

150ms

Normal

250ms

Slow

400ms

Use easing consistently.

---

# Tables

Responsive

Sticky header

Searchable

Sortable

Pagination

Used primarily in the admin dashboard.

---

# Modals

Use for:

Confirmation

Image viewer

Quick preview

Small forms

Avoid placing complex workflows inside modals.

---

# Notifications

Toast

Inline

Banner

Modal

Each should have:

Success

Warning

Error

Info

---

# Empty States

Illustration

Helpful text

Primary action

Never show blank screens.

---

# Loading States

Skeletons

Progress indicators

Spinners only for very short operations.

---

# Error States

Friendly copy.

Recovery action.

Support link.

Avoid technical jargon.

---

# Accessibility

WCAG AA compliance.

Support:

Keyboard navigation

Screen readers

Visible focus

High contrast

Reduced motion

Semantic HTML

---

# Dark Mode

Future-ready.

All colors defined through design tokens.

No hardcoded theme values.

---

# Component Library

Shared components:

Button

Input

Card

Badge

Avatar

Modal

Drawer

Tabs

Accordion

Carousel

Table

Pagination

Breadcrumb

Tooltip

Popover

Calendar

Command Palette

---

# Design Tokens

Tokens for:

Colors

Spacing

Typography

Radius

Shadow

Opacity

Motion

Z-index

Use a single source of truth.

---

# Cursor Rules

Cursor should:

- Use design tokens throughout.
- Avoid hardcoded values.
- Build reusable components.
- Keep spacing consistent.
- Ensure accessibility.
- Prefer composition over duplication.
- Use Tailwind CSS utilities with semantic component wrappers.
- Maintain visual consistency across marketing pages, booking flow, and dashboard.

---

# Future Enhancements

Theme Editor

Brand Customization

Dark Mode

Seasonal Themes

High Contrast Mode

RTL Support

White-label Branding

---

# Next Document

13-Deployment.md

Topics:

- Infrastructure
- Vercel deployment
- WordPress hosting
- Cloudflare
- CDN
- Image optimization
- Monitoring
- Logging
- CI/CD
- Backup strategy
- Disaster recovery