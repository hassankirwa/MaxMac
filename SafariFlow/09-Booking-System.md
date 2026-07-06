# SafariFlow
# 09 — Booking System

> Version: 1.0

---

# Overview

The booking experience is the heart of SafariFlow.

It should feel premium, intuitive, and trustworthy.

The booking flow should guide users naturally through the process while providing complete pricing transparency and preserving progress if they leave and return.

---

# Design Principles

The booking system must be:

- Mobile-first
- Step-by-step
- Accessible
- Transparent
- Recoverable
- Fast
- Secure

Users should never lose progress because of a page refresh or browser crash.

---

# Booking State Machine

DRAFT

↓

PACKAGE_SELECTED

↓

DATE_SELECTED

↓

GUESTS_SELECTED

↓

ACCOMMODATION_SELECTED

↓

EXTRAS_SELECTED

↓

TRAVELLERS_COMPLETED

↓

REVIEW

↓

PAYMENT_PENDING

↓

CONFIRMED

↓

COMPLETED

↓

ARCHIVED

Every transition must be validated before moving to the next state.

---

# Booking Wizard

The booking wizard consists of eight steps.

Step 1

Select Departure

Step 2

Guests

Step 3

Accommodation

Step 4

Extras

Step 5

Traveller Information

Step 6

Special Requests

Step 7

Review Booking

Step 8

Payment

---

# Persistent Booking Summary

A sticky summary panel should always be visible on desktop.

Display:

- Safari Package
- Travel Date
- Number of Guests
- Accommodation
- Selected Extras
- Taxes
- Discounts
- Deposit
- Remaining Balance
- Total Price

On mobile, the summary should collapse into a bottom sheet.

---

# Step 1 — Departure Selection

Users choose from available departures.

Display:

- Date
- Remaining Seats
- Season
- Starting Price
- Availability Status

Statuses:

- Available
- Limited Availability
- Sold Out
- On Request

---

# Step 2 — Guest Selection

Capture:

Adults

Children

Infants

Automatically enforce:

Minimum Guests

Maximum Guests

Age restrictions

Occupancy limits

Update pricing instantly.

---

# Step 3 — Accommodation

Display accommodation cards.

Each card includes:

- Image
- Name
- Description
- Amenities
- Upgrade Price
- Availability

Room Types:

- Single
- Double
- Twin
- Triple
- Family
- Suite

---

# Step 4 — Extras

Optional add-ons:

Airport Pickup

Airport Drop-off

Hot Air Balloon Safari

Cultural Visit

Photography Guide

Night Game Drive

Travel Insurance

Extra Hotel Night

Each extra displays:

- Description
- Price
- Quantity Selector

---

# Step 5 — Traveller Information

Collect traveller details for each guest.

Required:

- First Name
- Last Name
- Date of Birth
- Nationality

Optional:

- Passport Number
- Dietary Requirements
- Medical Notes
- Emergency Contact

Returning customers can choose saved traveller profiles.

---

# Step 6 — Special Requests

Free-text area for:

- Accessibility requirements
- Dietary requests
- Celebration notes
- Custom itinerary requests

Character limit:

1000 characters

---

# Step 7 — Review

Display a complete summary.

Sections:

- Package
- Dates
- Guests
- Accommodation
- Extras
- Traveller Details
- Pricing Breakdown
- Terms & Conditions

Require agreement before continuing.

---

# Step 8 — Payment

Supported methods:

- Credit/Debit Card
- M-Pesa
- Flutterwave
- Pesapal
- PayPal
- Bank Transfer

Display:

Deposit Due

Balance Due

Cancellation Policy

---

# Pricing Engine

The pricing engine calculates:

Base Package

+

Seasonal Pricing

+

Accommodation Upgrades

+

Extras

+

Taxes

-

Discounts

=

Grand Total

Calculations occur server-side.

---

# Discounts

Support:

Promo Codes

Early Bird

Group Discounts

Returning Customer

Manual Admin Discounts

Only one promotional discount may be applied unless explicitly configured.

---

# Taxes & Fees

Display separately:

- Taxes
- Park Fees
- Service Fees
- Conservation Fees

No hidden charges.

---

# Deposits

Support:

- Full Payment
- Percentage Deposit
- Fixed Deposit

Display:

Deposit Today

Remaining Balance

Balance Due Date

---

# Availability

Availability checks occur:

- When package loads
- Before payment
- Immediately before confirmation

Prevent overbooking.

---

# Booking Confirmation

After successful payment:

Generate:

- Booking Number
- Invoice
- Receipt
- Confirmation Email

Redirect to confirmation page.

---

# Confirmation Page

Display:

Booking Number

Status

Travel Dates

Guests

Payment Status

Download Invoice

Download Receipt

Contact Support

Add to Calendar

---

# Customer Dashboard

Customers can:

View Upcoming Trips

View Past Trips

Download Documents

Manage Travellers

Pay Remaining Balance

Request Cancellation

Contact Support

---

# Booking Cancellation

Customer submits cancellation.

System:

↓

Validates policy

↓

Calculates refund

↓

Requests confirmation

↓

Updates booking

↓

Sends email

---

# Payment Recovery

If payment fails:

Preserve booking.

Allow retry.

Do not require re-entering traveller information.

---

# Email Automation

Automatically send:

Booking Confirmation

Payment Receipt

Invoice

Deposit Reminder

Balance Reminder

Travel Checklist

Departure Reminder

Thank You

Review Request

---

# Notifications

Admin receives:

New Booking

Payment Received

Cancellation

Refund Request

Low Availability Alert

---

# Offline Bookings

Staff may create bookings manually.

Manual bookings use the same domain model.

---

# Booking Audit Trail

Record:

Creation

Updates

Payments

Refunds

Status Changes

Emails Sent

Staff Actions

---

# Security

Validate every step.

Recalculate prices server-side.

Never trust browser totals.

Prevent duplicate submissions.

Use idempotency keys for payment requests.

---

# Accessibility

Wizard must:

Support keyboard navigation

Announce validation errors

Maintain focus

Support screen readers

---

# Analytics Events

Track:

Booking Started

Step Completed

Booking Abandoned

Coupon Applied

Payment Initiated

Payment Successful

Booking Confirmed

---

# Future Features

- Waitlists
- Gift Cards
- Installment Payments
- AI Itinerary Builder
- Dynamic Pricing
- Group Booking Portal
- Travel Agent Dashboard
- Corporate Accounts
- Loyalty Program
- Referral Program

---

# Cursor Implementation Rules

Cursor should:

- Build the booking flow as a finite state machine.
- Persist progress in secure storage between refreshes.
- Recalculate pricing server-side before confirmation.
- Use React Hook Form + Zod for every step.
- Separate pricing logic from UI.
- Implement optimistic UI only where safe.
- Ensure every booking step has loading, success, and error states.
- Design the wizard to support additional steps without refactoring.
- Keep booking logic independent of WP Travel Engine.

---

# Recommended Folder Structure

features/
  booking/
    components/
      BookingWizard.tsx
      BookingSummary.tsx
      DepartureSelector.tsx
      GuestSelector.tsx
      AccommodationSelector.tsx
      ExtrasSelector.tsx
      TravellerForm.tsx
      ReviewStep.tsx
      PaymentStep.tsx
    hooks/
      useBooking.ts
      usePricing.ts
    services/
      booking.service.ts
      pricing.service.ts
    state/
      booking-machine.ts
    schemas/
      booking.schema.ts
    types/
      booking.types.ts
    utils/
      booking-calculator.ts
      booking-validator.ts

---

# Next Document

10-Admin-Dashboard.md

Topics:

- Staff dashboard
- Booking management
- Customer management
- Calendar
- Pricing management
- Reports
- Analytics
- Content shortcuts
- Operational workflows