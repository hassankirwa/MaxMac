# SafariFlow
# 03 — WordPress CMS Architecture

> Version: 1.0
>
> CMS: WordPress 6.8+
>
> Purpose:
>
> WordPress serves exclusively as the Headless CMS and Tour Management backend.
>
> Visitors NEVER interact with WordPress directly.
>
> All public pages are rendered by Next.js.

---

# CMS Philosophy

WordPress should NOT function as the frontend website.

Instead, it should act as a structured content management platform that powers the Next.js application.

Editors should never worry about HTML, layouts, or design.

Their only responsibility is creating and managing content.

The frontend controls:

- Layout
- Components
- SEO Rendering
- Performance
- User Experience
- Booking Experience

---

# Responsibilities

WordPress is responsible for:

✓ Safari Packages

✓ Destinations

✓ National Parks

✓ Countries

✓ Accommodation

✓ Safari Vehicles

✓ Tour Guides

✓ Testimonials

✓ Blog

✓ FAQ

✓ Gallery

✓ Hero Slides

✓ Company Information

✓ Contact Details

✓ Menus

✓ Media Library

✓ SEO Metadata

✓ Booking Data (WP Travel Engine)

Everything else belongs inside Next.js.

---

# Required Plugins

## WP Travel Engine

Purpose

Tour management

Booking engine

Availability

Pricing

Itinerary

Bookings

---

## Advanced Custom Fields Pro

Purpose

Structured content

Relationships

Flexible layouts

Metadata

---

## WPGraphQL

Purpose

Expose all content via GraphQL.

---

## WPGraphQL for ACF

Purpose

Expose ACF fields to GraphQL.

---

## Yoast SEO

Purpose

SEO Metadata

OpenGraph

Schema

Sitemap

---

## Safe SVG

Purpose

Allow SVG uploads safely.

---

## Redirection

Purpose

Manage redirects.

---

## Advanced Editor Tools

Purpose

Improve editor experience.

---

## WP Mail SMTP

Purpose

Reliable email delivery.

---

## UpdraftPlus

Purpose

Automatic backups.

---

## Cloudflare Plugin

Purpose

Cache purging.

---

# User Roles

## Administrator

Complete access.

---

## Content Manager

Can manage:

Pages

Tours

Media

Testimonials

FAQs

Blog

Cannot change:

Plugins

Themes

Users

---

## Booking Manager

Can:

Manage bookings

Update booking status

Communicate with customers

View reports

---

## Marketing Manager

Can:

Blog

Landing pages

SEO

Media

Testimonials

---

## Author

Blog only.

---

# Content Architecture

The CMS contains the following primary entities.

Country

↓

Destination

↓

National Park

↓

Safari Package

↓

Bookings

Additional entities:

Accommodation

Vehicle

Guide

Experience

Blog

Gallery

FAQ

Testimonial

---

# Custom Post Types

## Safari Packages

Slug

```
safaris
```

Purpose

Main product.

Examples

7-Day Maasai Mara Safari

Luxury Kenya Safari

Big Five Adventure

Migration Safari

Family Safari

---

## Destinations

Examples

Maasai Mara

Amboseli

Tsavo East

Tsavo West

Samburu

Diani

Zanzibar

Serengeti

Ngorongoro

Bwindi

---

## Countries

Examples

Kenya

Tanzania

Uganda

Rwanda

Botswana

Namibia

South Africa

---

## National Parks

Examples

Maasai Mara

Amboseli

Lake Nakuru

Tsavo East

Tsavo West

Hell's Gate

Serengeti

Ngorongoro

Tarangire

---

## Accommodation

Examples

Angama Mara

Sarova Mara

Ashnil Mara

Governors Camp

Elewana Collection

---

## Safari Vehicles

Examples

Land Cruiser

Land Rover Defender

Safari Van

Open Jeep

---

## Tour Guides

Each guide contains

Biography

Languages

Experience

Photo

Certifications

Specialties

---

## Gallery

Purpose

Reusable images.

Each gallery may belong to multiple packages.

---

## Testimonials

Contains

Customer Name

Country

Review

Rating

Photo

Related Safari

---

## FAQ

Reusable.

Can be attached to multiple safaris.

---

## Hero Slides

Homepage hero.

Contains

Headline

Subtitle

CTA

Background Image

---

## Travel Experiences

Examples

Big Five

Migration

Bird Watching

Photography

Honeymoon

Family

Luxury

Camping

Adventure

---

# Taxonomies

Countries

Destination Types

Safari Types

Travel Style

Activities

Luxury Level

Travel Month

Season

Accommodation Type

Vehicle Type

Languages

---

# ACF Field Groups

## Safari Package

Basic

Package Name

Short Description

Hero Image

Gallery

Price

Currency

Duration

Maximum Guests

Minimum Guests

Difficulty

Rating

Featured

---

Relationships

Country

Destination

National Parks

Accommodation

Vehicle

Guide

Experiences

FAQs

Testimonials

Related Packages

---

Pricing

Adult Price

Child Price

Single Supplement

Deposit

Discount

Offer Price

---

Included

Flexible repeater

Example

Park Fees

Meals

Accommodation

Transfers

Guide

Game Drives

---

Excluded

Flexible repeater

Flights

Visa

Insurance

Tips

Alcohol

Laundry

---

Itinerary

Flexible Content

Each day contains

Day Number

Title

Description

Accommodation

Meals

Images

GPS Coordinates

Map

---

Gallery

Unlimited images.

Video support.

360 Images.

---

SEO

Meta Title

Meta Description

Keywords

Canonical

OpenGraph Image

---

Booking

Booking Enabled

Availability

Departure Dates

Maximum Seats

Minimum Seats

Instant Confirmation

---

# Relationships

Country

↓

Destinations

↓

National Parks

↓

Safari Packages

↓

Accommodation

↓

Bookings

---

# Media Library Structure

Uploads

```
/countries

/destinations

/safaris

/accommodation

/guides

/blog

/gallery

/logos

/icons
```

Images should be organized consistently.

---

# Image Requirements

Hero

2400px

Destination

1800px

Package

1600px

Gallery

1200px

Guide

800px

Thumbnail

600px

Always upload WebP when possible.

---

# Editorial Workflow

Draft

↓

Review

↓

Approved

↓

Scheduled

↓

Published

↓

Archived

---

# Homepage Content

Homepage sections are editable.

Hero

Featured Safaris

Popular Destinations

Experiences

Testimonials

Statistics

Partners

Gallery

Latest Articles

CTA

Footer

Editors can reorder sections.

---

# Navigation Management

WordPress controls:

Main Menu

Footer Menu

Legal Menu

Social Links

---

# Company Settings

Global options page

Contains

Company Name

Address

Phone

WhatsApp

Email

Google Maps

Social Links

Business Hours

Emergency Contact

Logo

Favicon

Footer Copyright

---

# API Exposure

Everything must be accessible through GraphQL.

Examples

Countries

Destinations

Safaris

FAQs

Guides

Accommodation

Gallery

Testimonials

Menus

Settings

SEO

---

# Security

Disable:

Theme Editor

Plugin Editor

XML-RPC

Unused REST endpoints

Default comments

Unused widgets

Unused themes

Unused plugins

---

# Performance

Disable unnecessary plugins.

Use object cache.

Optimize images.

Limit revisions.

Lazy load media.

---

# Future Expansion

Architecture should support

Multiple companies

Multiple brands

Multiple currencies

Multiple languages

Franchise offices

Regional pricing

Travel agent portal

Affiliate portal

Marketplace

AI itinerary generation

---

# Cursor Instructions

Cursor should assume that:

- WordPress is a headless backend only.
- Every content type is consumed via GraphQL or a secure backend-for-frontend (BFF) in Next.js.
- All ACF field groups should be strongly typed in the frontend.
- Content relationships should be normalized to avoid duplication.
- Editors should never need to edit HTML or layout code.
- Media should be reusable across multiple entities.
- Every content type should expose stable slugs, featured images, SEO metadata, and relationship data.
- The CMS should be designed so additional countries, destinations, and safari packages can be added without code changes.

---

# Next Document

04-WP-Travel-Engine.md

This document will define:

- WP Travel Engine configuration
- Booking lifecycle
- Package pricing
- Seasonal pricing
- Availability
- Group bookings
- Custom checkout
- Payment gateways
- Booking synchronization
- API integration with Next.js