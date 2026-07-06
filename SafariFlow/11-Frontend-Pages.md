# SafariFlow
# 11 — Frontend Pages & User Experience

> Version: 1.0

---

# Overview

SafariFlow is a modern, headless safari booking platform built with Next.js.

Every page should:

- Load quickly
- Be SEO optimized
- Be mobile-first
- Tell a compelling story
- Encourage exploration
- Drive bookings

The experience should feel premium, trustworthy, and immersive.

---

# Global Layout

All public pages share:

- Announcement Bar
- Header
- Primary Navigation
- Search Shortcut
- Breadcrumbs (except homepage)
- Main Content
- Newsletter CTA
- Footer

Sticky header on scroll.

---

# Header

Contains:

- Logo
- Navigation
- Search
- Currency Selector
- Language Selector (future)
- Account Menu
- Book Now CTA

Responsive mobile menu.

---

# Footer

Sections:

Company

Destinations

Safari Types

Travel Information

Support

Legal

Newsletter

Social Links

Contact Details

Awards & Certifications

---

# Homepage

Purpose

Inspire visitors and guide them toward booking.

Sections

1. Hero Banner

- Full-screen image/video
- Headline
- Search Widget
- Primary CTA
- Secondary CTA

---

2. Trust Indicators

Display:

- Years of Experience
- Happy Travellers
- Countries Served
- Average Rating

---

3. Featured Safaris

Grid of featured packages.

Each card shows:

- Image
- Duration
- Price
- Rating
- Highlights
- CTA

---

4. Explore Destinations

Interactive destination cards.

Examples:

- Maasai Mara
- Amboseli
- Samburu
- Tsavo
- Serengeti
- Zanzibar

---

5. Why Travel With Us

Feature cards:

- Expert Guides
- Luxury Vehicles
- Best Price Guarantee
- 24/7 Support
- Flexible Payments
- Local Expertise

---

6. Safari Experiences

Examples:

- Big Five
- Luxury
- Family
- Honeymoon
- Photography
- Migration

---

7. Testimonials

Carousel with:

- Customer Photo
- Review
- Rating
- Country

---

8. Gallery Preview

Masonry grid.

CTA to full gallery.

---

9. Latest Articles

Travel tips

Wildlife guides

Destination highlights

---

10. Final CTA

Headline

Supporting text

Book Now button

Contact button

---

# Search Experience

Global search available from header.

Supports:

Packages

Destinations

Countries

Experiences

Blog

Autocomplete with grouped results.

---

# Search Results Page

Filters:

Country

Destination

Duration

Price

Month

Luxury Level

Travel Style

Activities

Sort:

Price

Duration

Popularity

Newest

Rating

Map/List toggle.

---

# Safari Package Page

Hero Section

- Image Carousel
- Package Title
- Duration
- Rating
- Starting Price
- Book Now CTA

---

Overview

- Summary
- Highlights
- Quick Facts

---

Interactive Itinerary

Accordion by day.

Maps.

Images.

Meals.

Accommodation.

---

Included / Excluded

Two-column comparison.

---

Accommodation

Cards with:

- Photos
- Amenities
- Room Types

---

Departure Dates

Calendar view.

Availability badges.

---

Pricing

Transparent pricing table.

Extras.

Taxes.

Deposit information.

---

Gallery

High-resolution photos.

Lightbox.

---

FAQs

Accordion.

---

Reviews

Verified customer reviews.

Average rating.

---

Related Packages

Recommendations based on:

Destination

Experience

Duration

---

Sticky Booking Card

Desktop:

Always visible.

Mobile:

Bottom sticky CTA.

---

# Destination Page

Hero

Overview

Map

Wildlife

Best Time to Visit

Top Safaris

Accommodation

Travel Tips

Gallery

Related Blog Posts

FAQs

CTA

---

# Country Page

Hero

Introduction

Destinations

Travel Information

Visa Requirements

Currency

Weather

Safari Packages

FAQs

---

# Blog

Listing

Categories

Featured Article

Search

Pagination

Sidebar

---

Blog Article

Hero Image

Author

Publish Date

Reading Time

Table of Contents

Content

Related Articles

Newsletter

Comments (future)

---

# Gallery

Grid

Filters:

Destination

Animal

Experience

Season

Photo/Video

Lightbox

Share

Download (optional)

---

# About Us

Hero

Our Story

Mission

Vision

Values

Meet the Team

Awards

Partners

Community Projects

Conservation

CTA

---

# Contact

Contact Form

WhatsApp CTA

Phone

Email

Map

Office Hours

Emergency Contact

FAQs

---

# Customer Dashboard

Overview

Upcoming Trips

Past Trips

Invoices

Saved Travellers

Saved Packages

Notifications

Profile

Security

---

# Booking Confirmation Page

Success animation.

Booking Number.

Summary.

Invoice Download.

Receipt.

Travel Checklist.

Support Contact.

---

# 404 Page

Friendly message.

Suggested links.

Popular packages.

Search.

---

# Empty States

No Search Results

No Bookings

No Reviews

No Gallery Images

Provide helpful actions.

---

# Loading States

Skeleton loaders for:

Cards

Tables

Images

Itinerary

Booking Summary

---

# Error States

Display:

Title

Description

Retry Action

Support Link

Never expose technical details.

---

# Reusable Content Blocks

Hero

CTA

Feature Grid

Stats

Testimonials

Gallery

FAQ

Timeline

Map

Pricing Table

Review List

Newsletter

Logos

Partners

Awards

---

# Responsive Design

Breakpoints

Mobile

Tablet

Laptop

Desktop

Wide

Optimize layouts for touch interactions.

---

# SEO

Every page includes:

Metadata

Canonical URL

Open Graph

Twitter Cards

JSON-LD

Breadcrumb Schema

Image Alt Text

---

# Accessibility

Keyboard Navigation

Visible Focus

Semantic HTML

ARIA Labels

Reduced Motion Support

Color Contrast Compliance

---

# Cursor Rules

Cursor should:

- Build pages from reusable content blocks.
- Keep components composable and configurable.
- Prefer Server Components for content-heavy pages.
- Use Client Components only for interactive sections.
- Optimize images with next/image.
- Include loading, error, and empty states for every page.
- Ensure all pages are responsive and accessible.
- Implement structured data for SEO.
- Maintain consistent spacing, typography, and visual hierarchy.

---

# Suggested Folder Structure

app/
  (marketing)/
    page.tsx
    about/
    contact/
    gallery/
    blog/
    destinations/
    countries/
    packages/
    search/

features/
  homepage/
  search/
  packages/
  destinations/
  blog/
  gallery/
  contact/

components/
  blocks/
    Hero/
    CTA/
    FeatureGrid/
    Stats/
    Gallery/
    FAQ/
    Testimonials/
    Timeline/
    PricingTable/
    Map/
    Newsletter/

---

# Next Document

12-Design-System.md

Topics:

- Brand identity
- Color palette
- Typography
- Spacing
- Icons
- Buttons
- Forms
- Cards
- Layout grids
- Animations
- Component standards
- Dark mode strategy