# SafariFlow
# 06 — Domain Model & Database Architecture

> Version: 1.0
>
> Purpose:
>
> This document defines the canonical business data model for SafariFlow.
>
> It is intentionally independent of WordPress.
>
> WordPress, WP Travel Engine, or any future backend (PostgreSQL, Prisma, Supabase, etc.) must conform to this domain model.

---

# Database Philosophy

The platform is built around relationships.

Everything connects.

Example

Country

↓

Destination

↓

National Park

↓

Safari

↓

Departure

↓

Booking

↓

Customer

This creates a scalable travel platform.

---

# Core Entities

The platform consists of the following entities.

Customer

Booking

Safari Package

Departure

Destination

Country

National Park

Accommodation

Room Type

Vehicle

Guide

Experience

Gallery

Image

Review

FAQ

Coupon

Payment

Invoice

Blog

Tag

Category

Company Settings

---

# Entity Relationship Diagram

Country
│
├── Destination
│      │
│      ├── National Park
│      │      │
│      │      └── Safari Package
│      │              │
│      │              ├── Departure
│      │              ├── Accommodation
│      │              ├── Guide
│      │              ├── Vehicle
│      │              ├── Gallery
│      │              ├── FAQ
│      │              ├── Review
│      │              └── Booking
│      │
│      └── Experiences

---

# Customer

Stores traveler information.

Fields

id

uuid

firstName

lastName

email

phone

nationality

passportNumber

dateOfBirth

emergencyContact

dietaryRequirements

medicalNotes

marketingConsent

createdAt

updatedAt

---

# Safari Package

Fields

id

slug

title

summary

description

featuredImage

gallery

durationDays

durationNights

difficulty

featured

minimumGuests

maximumGuests

rating

status

createdAt

updatedAt

---

Relationships

Country

Destination

National Parks

Accommodation

Vehicles

Guides

FAQs

Reviews

Experiences

Gallery

Departures

Bookings

---

# Destination

Fields

id

name

slug

country

description

heroImage

gallery

latitude

longitude

bestSeason

featured

---

# Country

Fields

id

name

slug

currency

flag

visaRequired

description

---

# National Park

Fields

id

name

country

destination

area

description

animals

heroImage

gallery

---

# Accommodation

Fields

id

name

type

stars

description

amenities

location

gallery

latitude

longitude

---

Accommodation Types

Luxury Lodge

Mid-range Lodge

Budget Lodge

Tented Camp

Camping

Hotel

Beach Resort

---

# Room Types

Single

Double

Twin

Triple

Family

Suite

---

# Vehicle

Fields

id

name

capacity

type

airConditioning

wifi

chargingPorts

images

---

Vehicle Types

Safari Van

Land Cruiser

Land Rover

Open Jeep

Luxury SUV

---

# Guide

Fields

id

name

photo

experienceYears

languages

certifications

specialties

rating

bio

---

# Departure

One safari may have many departures.

Fields

id

packageId

date

availableSeats

bookedSeats

status

guideId

vehicleId

priceOverride

---

Departure Status

Open

Almost Full

Sold Out

Cancelled

---

# Booking

Most important entity.

Fields

id

bookingNumber

customerId

packageId

departureId

status

totalGuests

adults

children

infants

roomType

specialRequests

subtotal

discount

taxes

deposit

balance

grandTotal

currency

createdAt

updatedAt

---

Booking Status

Draft

Pending

Confirmed

Completed

Cancelled

Refunded

---

# Traveler

One booking may contain multiple travelers.

Fields

id

bookingId

firstName

lastName

passport

nationality

dateOfBirth

dietaryRequirements

medicalNotes

---

# Extras

Examples

Airport Pickup

Balloon Safari

Night Drive

Boat Safari

Photography Guide

Travel Insurance

Each extra stores

price

quantity

subtotal

---

# Payment

Fields

id

bookingId

provider

transactionReference

amount

currency

status

paidAt

---

Payment Providers

Stripe

Flutterwave

Pesapal

M-Pesa

PayPal

Bank Transfer

---

Payment Status

Pending

Processing

Paid

Failed

Refunded

Cancelled

---

# Invoice

Fields

id

bookingId

invoiceNumber

issueDate

dueDate

subtotal

tax

discount

total

pdf

---

# Coupon

Fields

code

type

value

maximumUses

expiresAt

minimumBookingValue

---

Coupon Types

Percentage

Fixed Amount

Free Upgrade

Free Extra

---

# Review

Fields

id

customer

rating

title

review

images

approved

publishedAt

---

# FAQ

Fields

question

answer

category

displayOrder

---

# Experience

Examples

Big Five

Migration

Luxury

Camping

Family

Photography

Bird Watching

Beach

Adventure

---

# Gallery

Fields

id

title

images

featuredImage

---

# Image

Fields

id

url

width

height

alt

caption

copyright

photographer

---

# Blog

Fields

id

title

slug

excerpt

content

featuredImage

seo

publishedAt

author

---

# Company Settings

Contains

Business Name

Email

Phone

WhatsApp

Address

Social Links

Currencies

Time Zone

Google Maps

Emergency Contacts

---

# Relationships

Country

1:N

Destination

Destination

1:N

Safari Package

Safari Package

1:N

Departure

Safari Package

1:N

Booking

Booking

1:N

Traveler

Booking

1:1

Payment

Booking

1:1

Invoice

Safari Package

N:N

Guide

Safari Package

N:N

Accommodation

Safari Package

N:N

Gallery

Safari Package

N:N

Experience

Safari Package

N:N

FAQ

---

# Search Index

Searchable

Packages

Destinations

Parks

Experiences

Guides

Blog

Autocomplete should support

Destination

Package

Park

Country

Experience

---

# Audit Fields

Every entity contains

createdAt

updatedAt

createdBy

updatedBy

deletedAt

This enables soft deletes and change tracking.

---

# UUID Strategy

Every primary key uses UUID.

Never expose database IDs publicly.

Public URLs use slugs.

---

# Future Compatibility

The schema should support

Multi-company

Multi-country

Multi-currency

Multi-language

Marketplace

Affiliate system

Travel agents

CRM

ERP

AI recommendations

Dynamic pricing

Loyalty program

Gift cards

Subscriptions

---

# Cursor Rules

Cursor should:

- Treat this document as the canonical domain model.
- Keep domain entities independent of WordPress.
- Create shared TypeScript interfaces for every entity.
- Generate Zod schemas matching the interfaces.
- Avoid embedding business rules inside UI components.
- Build services around domain entities rather than CMS responses.
- Ensure relationships are represented consistently across the application.
- Prefer UUIDs and slugs over numeric identifiers.

---

# Next Document

07-Authentication.md

Topics

- Customer authentication
- JWT
- Session management
- Social login
- Password reset
- Protected routes
- Middleware
- Role-based access control
- Customer dashboard permissions
- Future SSO support