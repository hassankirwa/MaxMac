# SafariFlow
# 05 — Next.js Architecture

> Version: 1.0

---

# Purpose

Next.js is the presentation layer of SafariFlow.

It is responsible for:

- Rendering pages
- SEO
- Performance
- Search
- Booking experience
- Customer dashboard
- Authentication
- API gateway (BFF)
- Image optimization
- Analytics

WordPress is never exposed directly to visitors.

---

# Technology Stack

Framework

Next.js 15

Language

TypeScript

UI

shadcn/ui

CSS

Tailwind CSS v4

Forms

React Hook Form

Validation

Zod

State

TanStack Query

Animation

Framer Motion

Icons

Lucide React

Tables

TanStack Table

Charts

Recharts

Maps

Google Maps

Images

next/image

Emails

React Email

---

# Project Structure

app/
features/
components/
lib/
services/
types/
constants/
config/
hooks/
styles/
public/

The architecture is feature-first.

---

# App Directory

/app

Contains:

Layouts

Pages

Metadata

Route Handlers

Server Components

Examples

/

about

contact

gallery

blog

destinations

packages

dashboard

booking

api

---

# Features Folder

Each business feature owns its code.

Example

features/

booking/

components/

hooks/

services/

schemas/

types/

utils/

packages/

components/

services/

hooks/

search/

components/

hooks/

filters/

blog/

auth/

dashboard/

No feature should depend directly on another feature's internals.

Shared code belongs in `lib/` or `components/`.

---

# Components

Shared UI components live in:

components/

Examples:

Button

Card

Navbar

Footer

Gallery

Map

Modal

Carousel

Breadcrumb

Components must remain presentational.

Business logic belongs inside features or services.

---

# Route Groups

Use route groups to organize layouts.

Example

(app)

(marketing)

(booking)

(account)

(admin)

Each group can define its own layout.

---

# Layout Strategy

Root Layout

Provides:

Fonts

Theme

Navigation

Footer

Analytics

Providers

Booking Layout

Provides:

Progress Indicator

Booking Summary

Checkout Navigation

Account Layout

Provides:

Sidebar

Profile Navigation

Dashboard Layout

Provides:

Statistics

Quick Actions

Recent Bookings

---

# Rendering Strategy

Server Components

Default

Client Components

Only when necessary.

Use client components for:

Forms

Calendar

Maps

Filters

Search

Payment

Animations

Everything else should remain server-rendered.

---

# Data Fetching

Never fetch data inside UI components.

Pattern

Page

↓

Service

↓

API Client

↓

Backend

Example

Package Page

↓

getPackage()

↓

GraphQL

↓

Return Typed Object

---

# Backend-for-Frontend (BFF)

All client requests pass through Next.js.

Browser

↓

Next.js Route Handler

↓

WordPress

↓

Response

Benefits

Hide credentials

Rate limiting

Logging

Validation

Caching

Aggregation

---

# Route Handlers

Examples

/api/packages

/api/search

/api/bookings

/api/payment

/api/auth

/api/contact

These handlers communicate with WordPress and third-party services.

---

# Services

Business logic belongs here.

Examples

PackageService

BookingService

SearchService

PaymentService

DestinationService

GuideService

GalleryService

ReviewService

Services return typed objects.

---

# Validation

Every form uses:

React Hook Form

+

Zod

Validation occurs:

Client-side

Server-side

Never trust client input.

---

# State Management

Prefer:

Server Components

↓

URL State

↓

TanStack Query

↓

React Context

Avoid unnecessary global state.

Do not use Redux.

---

# URL State

Search filters

Pagination

Sort order

Booking steps

Should be reflected in the URL when appropriate.

This improves shareability and SEO.

---

# Caching

Use:

ISR

Next.js Cache

Cloudflare

Image Cache

Do not cache:

Bookings

Payments

Authentication

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

# Error Boundaries

Every major feature should have:

loading.tsx

error.tsx

not-found.tsx

Graceful fallbacks are required.

---

# Loading Experience

Use Skeleton components.

Never show blank pages.

Loading should feel intentional.

---

# Image Strategy

Always use:

next/image

Requirements

Lazy loading

Blur placeholders

Responsive sizes

WebP/AVIF

Priority loading only for above-the-fold images.

---

# SEO

Every route defines:

Title

Description

Open Graph

Twitter Cards

Canonical URL

JSON-LD

Breadcrumb Schema

---

# Analytics

Track:

Page Views

Searches

Bookings Started

Bookings Completed

Contact Form

Newsletter Signup

CTA Clicks

Downloads

Use a central analytics service.

---

# Accessibility

Every interactive element:

Keyboard accessible

Visible focus

ARIA labels where needed

Minimum touch target: 44px

---

# Styling Rules

Use Tailwind utility classes.

Avoid inline styles.

Prefer reusable design tokens.

Keep spacing consistent with the design system.

---

# Naming Conventions

Components

PascalCase

Hooks

useSomething

Files

kebab-case where appropriate

Types

PascalCase

Constants

UPPER_SNAKE_CASE

---

# Testing

Unit

Vitest

Component

React Testing Library

End-to-End

Playwright

Critical user journeys (search, booking, checkout) must have E2E coverage.

---

# Performance Goals

Initial Load

<2s

Search

<300ms

Package Page

<1s

Booking Step Transition

<200ms

Lighthouse

95+

---

# Deployment

Frontend

Vercel

Automatic Preview Deployments

Production Deployments from `main`

Environment variables managed through Vercel.

---

# Cursor Implementation Rules

Cursor should:

- Default to Server Components.
- Introduce Client Components only for interactivity.
- Keep business logic in feature services.
- Route all browser requests through the BFF.
- Use feature-first organization.
- Generate strict TypeScript types.
- Avoid duplicated code.
- Use composition over inheritance.
- Prefer async Server Components for page-level data fetching.
- Co-locate schemas, hooks, and services within each feature.
- Keep shared UI generic and reusable.
- Ensure every new feature includes loading, error, and empty states.

---

# Example Feature Structure

features/
  booking/
    components/
      BookingWizard.tsx
      BookingSummary.tsx
      GuestSelector.tsx
    hooks/
      useBooking.ts
    services/
      booking.service.ts
    schemas/
      booking.schema.ts
    types/
      booking.types.ts
    utils/
      price-calculator.ts

Each feature should be independently understandable and testable.

---

# Next Document

06-Database.md

This document will define:

- Data model
- Entity relationships
- Booking schema
- User schema
- Pricing model
- Content relationships
- Future extensibility
- ER diagrams
- Prisma compatibility (for future migration if WordPress is ever replaced)