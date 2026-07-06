# SafariFlow
# 04 — WP Travel Engine Integration

> Version: 1.0

---

# Purpose

WP Travel Engine serves as the transactional engine for SafariFlow.

It is responsible for:

- Tour inventory
- Pricing
- Availability
- Booking management
- Checkout data
- Coupons
- Payments
- Booking status
- Customer booking records

The public booking experience is completely custom and built using Next.js.

---

# System Responsibilities

## WordPress

Manages:

- Tours
- Pricing
- Availability
- Booking records

---

## Next.js

Manages:

- User interface
- Search
- Filters
- Booking wizard
- Checkout
- Customer dashboard

---

## BFF (Backend for Frontend)

Responsible for:

Authentication

API aggregation

Caching

Validation

Rate limiting

Error handling

Never expose WordPress directly to browsers.

---

# Booking Philosophy

Booking a safari is significantly more complex than buying a product.

The system must support:

- Multiple departure dates
- Private safaris
- Scheduled departures
- Family pricing
- Child pricing
- Single supplements
- Optional activities
- Airport transfers
- Hotel upgrades
- Custom requests

The booking flow should adapt to different tour types.

---

# Safari Package Structure

Each package consists of:

Basic Information

↓

Pricing

↓

Availability

↓

Accommodation

↓

Itinerary

↓

Included

↓

Excluded

↓

Extras

↓

Booking Rules

↓

Reviews

↓

FAQs

---

# Booking Workflow

Visitor

↓

Select Package

↓

Choose Departure Date

↓

Select Number of Guests

↓

Choose Room Type

↓

Select Optional Extras

↓

Provide Traveler Details

↓

Review Summary

↓

Checkout

↓

Payment

↓

Booking Confirmation

↓

Email Notifications

↓

Admin Dashboard

---

# Booking States

Draft

↓

Pending

↓

Payment Pending

↓

Confirmed

↓

Completed

↓

Cancelled

↓

Refunded

Every booking should have a complete audit trail.

---

# Package Types

Support:

Shared Safari

Private Safari

Luxury Safari

Camping Safari

Family Safari

Photography Safari

Honeymoon Safari

Custom Safari

Day Trip

Beach Extension

Mountain Trek

---

# Pricing Model

Each package supports:

Base Price

Adult Price

Child Price

Infant Price

Single Supplement

Seasonal Pricing

Weekend Pricing

Holiday Pricing

Discounts

Coupons

---

# Seasonal Pricing

Example

Low Season

April

May

November

Mid Season

June

October

High Season

July

August

September

Holiday Season

December

January

Each season may define independent pricing.

---

# Group Pricing

Support:

1 Traveler

2 Travelers

4 Travelers

6 Travelers

8 Travelers

10+

Each tier may have different prices.

---

# Accommodation Options

Standard

Luxury

Premium Luxury

Tent

Camping

Custom Lodge

Each accommodation affects price.

---

# Room Types

Single

Double

Twin

Triple

Family

Suite

---

# Extras

Examples

Airport Pickup

Airport Drop-off

Hot Air Balloon

Cultural Village

Boat Safari

Night Game Drive

Photography Guide

Travel Insurance

Extra Hotel Night

Each extra includes:

Name

Price

Description

Maximum Quantity

---

# Departure Dates

Each package supports multiple departures.

Each departure stores:

Date

Seats Available

Status

Price Override

Guide Assignment

Vehicle Assignment

---

# Availability Rules

Maximum Guests

Minimum Guests

Cut-off Date

Instant Confirmation

Request Booking

Waiting List

---

# Booking Form

Step 1

Travel Date

Step 2

Guests

Adults

Children

Infants

Step 3

Accommodation

Step 4

Extras

Step 5

Traveler Details

Step 6

Special Requests

Step 7

Review

Step 8

Payment

---

# Traveler Details

Collect:

Full Name

Nationality

Passport Number (optional)

Email

Phone

Emergency Contact

Dietary Requirements

Medical Notes

Arrival Flight

Departure Flight

Hotel Before Safari

Hotel After Safari

---

# Booking Summary

Display

Tour

Travel Date

Guests

Accommodation

Extras

Taxes

Discount

Deposit

Balance

Grand Total

---

# Payment Strategy

Support:

Stripe

Flutterwave

Pesapal

M-Pesa

PayPal

Bank Transfer

Future providers should be pluggable.

---

# Deposit Rules

Support:

100%

50%

30%

Custom Percentage

Balance Due Date

---

# Coupon System

Percentage Discount

Fixed Discount

Early Bird

Group Discount

Returning Customer

Travel Agent

Promo Code

---

# Cancellation Rules

Flexible

Moderate

Strict

Custom

Cancellation policy is displayed before payment.

---

# Notifications

Customer receives:

Booking Confirmation

Invoice

Payment Receipt

Reminder

Final Travel Instructions

Thank You

---

# Admin Notifications

New Booking

Payment Received

Booking Cancelled

Refund Requested

Availability Warning

---

# Customer Dashboard

Customers can:

View Bookings

Download Invoice

Update Traveler Details

View Payment Status

Contact Support

Cancel Booking

---

# Booking API

Next.js communicates only with the BFF.

Example

Client

↓

Next.js API Route

↓

WordPress

↓

WP Travel Engine

↓

Response

---

# API Endpoints

GET

/packages

/package/:slug

/availability

/pricing

/bookings

POST

/create-booking

/update-booking

/cancel-booking

/apply-coupon

/payment

GET responses should be cacheable where appropriate.

Booking and payment endpoints must never be cached.

---

# Error Handling

Booking Failed

↓

Explain Reason

↓

Retry

Payment Failed

↓

Retry

↓

Alternative Payment

Never lose customer-entered data.

---

# Security

Validate every request.

Rate limit booking endpoints.

Use CSRF protection where applicable.

Sanitize all traveler information.

Never expose internal IDs.

Encrypt sensitive customer data at rest where possible.

---

# Performance

Booking pages should load in under:

2 seconds

Availability requests:

<500ms

Checkout:

<1 second

---

# Future Features

Reserve Now, Pay Later

Live Seat Availability

Group Booking Portal

Travel Agent Dashboard

Gift Vouchers

Dynamic Pricing

Multi-currency

Multi-language

Waitlists

AI Trip Recommendations

Loyalty Program

Referral Rewards

---

# Cursor Implementation Rules

Cursor should:

- Treat WP Travel Engine as the booking engine only.
- Never use WP Travel Engine templates.
- Build a custom booking wizard using React Server Components and Client Components where appropriate.
- Keep booking state isolated from presentation.
- Validate all forms with React Hook Form + Zod.
- Use optimistic UI where safe.
- Preserve booking progress if the user refreshes the page.
- Display clear pricing breakdowns.
- Ensure every booking step is accessible and mobile-friendly.
- Route all booking requests through the BFF rather than exposing WordPress directly.
- Design the booking flow to support future features without major rewrites.

---

# Next Document

05-NextJS-Architecture.md

Topics:

- App Router structure
- Server Components
- Client Components
- Route groups
- Layouts
- Data fetching
- BFF implementation
- Authentication
- Middleware
- Caching
- State management
- Project folder organization
- Coding standards