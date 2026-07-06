# SafariFlow
# 02 — System Architecture

> Version: 1.0

---

# Overview

SafariFlow follows a **Headless CMS Architecture**.

WordPress is responsible for content management and tour management, while Next.js is responsible for rendering the frontend, booking experience, SEO, and performance.

The two systems communicate via secure APIs.

This separation provides:

- Better performance
- Better scalability
- Better SEO
- Easier maintenance
- Modern developer experience
- Freedom to redesign the frontend without affecting content

---

# High-Level Architecture

                    Internet
                        │
                        ▼
               ┌─────────────────┐
               │     Next.js      │
               │  (Frontend SSR)  │
               └────────┬─────────┘
                        │
          REST API / GraphQL API
                        │
        ┌───────────────┴────────────────┐
        │                                │
        ▼                                ▼
┌────────────────────┐         ┌──────────────────┐
│    WordPress CMS   │         │ WP Travel Engine │
│  Pages, Blog, SEO  │         │ Tours & Bookings │
└────────────────────┘         └──────────────────┘

---

# Technology Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- TanStack Query

---

## Backend

- WordPress
- WP Travel Engine
- WPGraphQL
- ACF Pro

---

## Infrastructure

Frontend

- Vercel

Backend

- VPS
- Nginx
- PHP 8.3
- MariaDB

Storage

- WordPress Media Library

CDN

- Cloudflare

Email

- Resend

Analytics

- Google Analytics 4
- Google Search Console

---

# Rendering Strategy

SafariFlow should use multiple rendering methods depending on the page.

## Static Generation (SSG)

Use for:

- Homepage
- About
- Contact
- Destinations
- Blog
- Guides
- FAQ

These pages change infrequently.

---

## Incremental Static Regeneration (ISR)

Use for:

- Safari Packages
- Destination Pages
- Blog Articles

Recommended revalidation:

```
60 seconds
```

---

## Server Components

Default to React Server Components.

Advantages:

- Smaller bundles
- Better SEO
- Faster rendering

Only use Client Components when interaction is required.

---

## Client Components

Only for:

- Booking form
- Search
- Filters
- Calendar
- Favorites
- Authentication
- Payment
- Maps
- Carousels

---

# Folder Structure

/app
    /(marketing)
    /(booking)
    /(dashboard)

    about/
    contact/
    safaris/
    destinations/
    gallery/
    blog/
    faq/

    api/

    layout.tsx
    page.tsx

/components

    ui/
    booking/
    cards/
    forms/
    hero/
    navigation/
    footer/
    gallery/
    search/

    common/

    layout/

/lib

    api/
    wordpress/
    travel-engine/
    auth/
    seo/
    validations/
    utils/

/hooks

/services

/types

/constants

/styles

/public

---

# Component Philosophy

Components must be:

Reusable

Composable

Typed

Independent

Never duplicate logic.

Instead:

Compose small components.

Example

PackageCard

↓

Image

↓

Price

↓

Duration

↓

Rating

↓

Book Button

---

# State Management

Avoid unnecessary global state.

Use:

Server Components

↓

TanStack Query

↓

React Context (small amounts)

Avoid Redux.

---

# Data Flow

Visitor

↓

Next.js Page

↓

API Layer

↓

WordPress

↓

Response

↓

Server Component

↓

HTML

↓

Browser

---

# API Layer

Never fetch directly inside UI components.

Instead:

Page

↓

Service

↓

API Client

↓

WordPress

---

Example

/services/packages.ts

↓

fetchPackages()

↓

GraphQL

↓

Return typed object

---

# API Clients

Separate clients.

lib/api/

wordpress.ts

travel-engine.ts

auth.ts

payments.ts

analytics.ts

Never mix concerns.

---

# Environment Variables

Required

NEXT_PUBLIC_SITE_URL

NEXT_PUBLIC_API_URL

WORDPRESS_API_URL

GRAPHQL_ENDPOINT

RESEND_API_KEY

GOOGLE_MAPS_KEY

STRIPE_SECRET_KEY

MPESA_KEY

FLUTTERWAVE_KEY

PESAPAL_KEY

GOOGLE_ANALYTICS_ID

---

# Caching Strategy

Use:

Next.js Cache

ISR

Cloudflare CDN

Image Optimization

Browser Cache

Do NOT cache:

Bookings

Payments

Authentication

---

# Error Handling

Every request should return:

Loading State

↓

Success

↓

Error

↓

Retry

Never display white screens.

---

# Logging

Log:

API failures

Payment failures

Booking failures

Authentication failures

Do not expose internal errors to users.

---

# Security

Always

HTTPS

Sanitize inputs

Validate forms

Escape output

Use CSRF protection

Use secure cookies

Never trust client input.

---

# Authentication

Customer

JWT

Admin

WordPress Login

Future

Google

Apple

Facebook

---

# Media Handling

Images remain inside WordPress.

Next.js loads them using

next/image

Requirements

Lazy loading

Responsive images

Blur placeholders

WebP

AVIF

---

# Search Architecture

Search should support:

Keyword

Destination

Country

Price

Duration

Luxury Level

Travel Month

Activity

Search must be instant.

---

# Booking Flow

Landing Page

↓

Package

↓

Choose Date

↓

Guests

↓

Accommodation

↓

Extras

↓

Checkout

↓

Payment

↓

Confirmation

↓

Email

---

# Performance Goals

Lighthouse

95+

SEO

98+

Accessibility

95+

Best Practices

95+

---

# Core Web Vitals

LCP

<2.5 seconds

CLS

<0.1

INP

<200ms

---

# Deployment

Frontend

Vercel

↓

Automatic Deploy

↓

Production

Backend

VPS

↓

Nginx

↓

PHP

↓

MariaDB

↓

Cloudflare

---

# CI/CD

GitHub

↓

Pull Request

↓

Preview Deployment

↓

Production

Every merge to main should trigger deployment.

---

# Code Standards

Use:

ESLint

Prettier

Strict TypeScript

No `any`

No duplicated code

No inline CSS

No magic numbers

Prefer constants.

---

# Naming Conventions

Components

PascalCase

PackageCard.tsx

Hooks

camelCase

usePackages.ts

Constants

UPPER_SNAKE_CASE

Routes

kebab-case

safari-packages

---

# Testing Strategy

Unit

Vitest

Integration

React Testing Library

E2E

Playwright

---

# Accessibility

Every page must pass:

WCAG AA

Keyboard navigation

Screen readers

Visible focus

Semantic HTML

---

# Future Scalability

Architecture should support:

Multi-language

Multiple companies

Multiple currencies

Agent portal

Customer dashboard

Vendor marketplace

Native mobile app

AI itinerary generation

Dynamic pricing

CRM integration

---

# Development Rules

Cursor should:

- Prefer Server Components over Client Components.
- Keep API logic outside UI components.
- Write reusable, typed services.
- Create feature-based folders where appropriate.
- Separate presentation from business logic.
- Use composition instead of inheritance.
- Keep components small and focused.
- Never duplicate fetching logic.
- Prefer GraphQL for content and REST endpoints where WP Travel Engine exposes booking functionality.
- Design every feature to be extensible.

---

# Architecture Decisions

| Concern | Decision |
|----------|----------|
| Frontend | Next.js App Router |
| CMS | WordPress Headless |
| Tours | WP Travel Engine |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui |
| Forms | React Hook Form + Zod |
| Data Fetching | Server Components + TanStack Query |
| Images | next/image |
| Deployment | Vercel + VPS |
| CDN | Cloudflare |
| Analytics | GA4 |
| Email | Resend |

---

# Next Document

03-WordPress-CMS.md

This document will define:

- WordPress installation
- Required plugins
- Custom Post Types
- Taxonomies
- ACF field groups
- Media organization
- Editorial workflow
- WPGraphQL configuration
- Content modeling
- SEO strategy within WordPress