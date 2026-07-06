# SafariFlow
# 08 — API Architecture

Version 1.0

---

# Purpose

SafariFlow uses a Backend-for-Frontend (BFF) architecture.

The frontend NEVER communicates directly with:

- WordPress
- WP Travel Engine
- Payment providers
- Email providers
- Maps providers

Instead every request passes through the Next.js API Gateway.

This provides:

- Security
- Caching
- Validation
- Logging
- Better developer experience
- Stable contracts

---

# High Level Architecture

Browser

↓

Next.js

↓

Route Handler

↓

Business Service

↓

Provider Adapter

↓

External Service

---

Example

User

↓

GET /api/packages

↓

PackageService

↓

WordPress Adapter

↓

WPGraphQL

↓

Mapped Domain Model

↓

JSON Response

---

# API Design Principles

Every endpoint should be:

RESTful

Versioned

Predictable

Typed

Documented

Secure

Fast

---

# URL Structure

/api/v1

Future versions

/api/v2

Never introduce breaking changes inside a version.

---

# Response Format

Every endpoint returns the same shape.

Success

{
  success: true,
  data: {},
  meta: {},
  error: null
}

Failure

{
  success: false,
  data: null,
  meta: null,
  error: {
      code,
      message
  }
}

Never return raw WordPress responses.

---

# API Modules

Packages

Destinations

Countries

Search

Bookings

Payments

Authentication

Reviews

Gallery

Blog

Contact

Company

Analytics

---

# Package Endpoints

GET

/packages

GET

/packages/:slug

GET

/packages/featured

GET

/packages/popular

GET

/packages/recommended

---

# Destination Endpoints

GET

/destinations

GET

/destinations/:slug

GET

/destinations/featured

---

# Country Endpoints

GET

/countries

GET

/countries/:slug

---

# Booking Endpoints

POST

/bookings

GET

/bookings/:id

PATCH

/bookings/:id

DELETE

/bookings/:id

---

# Availability

GET

/packages/:slug/availability

Returns

Departure Dates

Seats

Pricing

Status

---

# Pricing

GET

/packages/:slug/pricing

Includes

Adult

Child

Extras

Season

Discounts

Taxes

Deposit

---

# Search

GET

/search

Parameters

query

country

destination

duration

price

month

experience

luxury

groupSize

sort

page

limit

---

# Review Endpoints

GET

/reviews

POST

/reviews

PATCH

/reviews/:id

DELETE

/reviews/:id

Only verified customers may submit reviews.

---

# Contact

POST

/contact

Creates

Email

CRM Event (future)

Spam protection

---

# Authentication

POST

/login

/logout

/register

/refresh

/password/reset

---

# Payment

POST

/payment/create

/payment/webhook

/payment/verify

/refund

---

# API Layer

Each module contains

Route Handler

↓

Service

↓

Adapter

↓

Provider

Example

PackageService

↓

WordPressPackageAdapter

↓

WPGraphQL

---

# Adapters

Adapters isolate providers.

Examples

WordPressAdapter

TravelEngineAdapter

StripeAdapter

FlutterwaveAdapter

ResendAdapter

GoogleMapsAdapter

Never let providers leak into business logic.

---

# Validation

Every request validated with

Zod

Request

↓

Validate

↓

Execute

↓

Respond

---

# Pagination

Standard

page

limit

Response

items

page

limit

total

totalPages

---

# Sorting

Support

Newest

Oldest

Price

Duration

Popularity

Rating

Alphabetical

---

# Filtering

Support

Country

Destination

Price

Duration

Experience

Accommodation

Travel Month

Luxury

Guide

Availability

---

# Error Codes

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation

429

Rate Limit

500

Internal

---

# Logging

Log

Slow Requests

Payment Errors

Booking Errors

Authentication Failures

Validation Errors

Never log passwords.

---

# Rate Limiting

Authentication

5/minute

Bookings

20/minute

Contact

5/minute

Search

Unlimited with caching

---

# Caching

Cache

Packages

Destinations

Blog

Countries

Do NOT Cache

Bookings

Payments

Authentication

---

# Webhooks

Support

Stripe

Flutterwave

Pesapal

Resend

Every webhook

Signature Validation

↓

Processing

↓

Logging

↓

Retry

---

# API Security

HTTPS

Rate Limiting

Input Validation

Output Encoding

CSRF Protection

Secure Cookies

CORS

Never trust client input.

---

# API Documentation

Every endpoint documented.

Include

Description

Request

Response

Errors

Authentication

Examples

---

# Future APIs

Mobile App

Partner API

Travel Agent API

Affiliate API

AI API

CRM API

ERP API

Marketplace API

---

# Cursor Rules

Cursor should:

- Generate typed API clients.
- Create provider adapters.
- Never expose WordPress responses.
- Use Zod validation.
- Return consistent response objects.
- Keep business logic outside route handlers.
- Implement centralized error handling.
- Use structured logging.
- Support future provider replacement.

---

# Example Folder Structure

app/api/v1

packages/

route.ts

bookings/

route.ts

search/

route.ts

payment/

route.ts

---

lib/

api/

client.ts

response.ts

errors.ts

pagination.ts

validators.ts

---

services/

package.service.ts

booking.service.ts

payment.service.ts

---

adapters/

wordpress/

travel-engine/

stripe/

flutterwave/

resend/

---

# Next Document

09-Booking-System.md

Topics

- Complete booking wizard
- Pricing engine
- Availability engine
- Guest management
- Booking state
- Checkout
- Payment orchestration
- Confirmation flow
- Email automation