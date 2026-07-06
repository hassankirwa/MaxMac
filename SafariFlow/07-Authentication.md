# SafariFlow
# 07 — Authentication & Authorization

> Version: 1.0

---

# Purpose

Authentication controls access to protected areas of SafariFlow.

The platform distinguishes between:

- Public visitors
- Customers
- Staff

WordPress authentication is used only for staff.

Customer authentication is managed by the Next.js application.

---

# Authentication Principles

The authentication system must be:

- Secure
- Fast
- Stateless where possible
- Mobile-friendly
- Extensible
- Independent of WordPress

---

# User Types

## Visitor

No login required.

Can:

- Browse packages
- Search destinations
- Read blogs
- Submit inquiries

---

## Customer

Authenticated.

Can:

- Book safaris
- View bookings
- Save favourites
- Manage profile
- Download invoices
- Leave reviews

---

## Staff

Authenticated via WordPress.

Can:

- Manage content
- Manage bookings
- Manage pricing
- View reports

---

# Architecture

Browser

↓

Next.js

↓

Authentication Service

↓

Customer Database

↓

JWT Session

↓

Protected Routes

WordPress authentication remains completely separate.

---

# Login Methods

Version 1

✓ Email + Password

Future

✓ Google

✓ Apple

✓ Facebook

✓ WhatsApp OTP

✓ Magic Link

---

# Registration

Collect

First Name

Last Name

Email

Phone

Country

Password

Marketing Consent

Terms Acceptance

---

# Password Rules

Minimum

12 characters

Require

Uppercase

Lowercase

Number

Special character

Passwords are hashed using a modern password hashing algorithm.

Passwords are never stored in plain text.

---

# Session Strategy

Authentication uses:

HTTP-only Cookies

Secure Cookies

SameSite=Lax

Short-lived access tokens

Rotating refresh tokens

Never store tokens in localStorage.

---

# JWT Claims

sub

email

role

customerId

issuedAt

expiresAt

sessionId

---

# Session Lifetime

Access Token

15 minutes

Refresh Token

30 days

Inactive sessions should expire automatically.

---

# Remember Me

Optional.

Extends refresh token lifetime.

Does not extend access token lifetime.

---

# Password Reset

Flow

Forgot Password

↓

Email Link

↓

Token Validation

↓

New Password

↓

Login

Reset tokens expire after 30 minutes.

---

# Email Verification

Required before:

Leaving reviews

Making bookings above a configurable threshold

Receiving marketing communications

---

# Multi-Factor Authentication

Future support.

Methods

Authenticator App

Email OTP

SMS OTP

Passkeys

---

# Protected Routes

Require authentication:

/dashboard

/bookings

/profile

/favourites

/invoices

/reviews/new

---

# Middleware

Protect routes using Next.js middleware.

If unauthenticated:

Redirect to login.

If authenticated:

Continue.

---

# Authorization

Role-based access.

Customer

- View own data
- Edit own profile

Staff

Managed entirely through WordPress roles.

---

# Customer Dashboard

Sections

Overview

Bookings

Invoices

Traveller Profiles

Saved Packages

Reviews

Account Settings

Security

Notifications

---

# Traveller Profiles

Customers can save traveller information.

Examples

Passport

Emergency Contact

Dietary Requirements

Medical Notes

This reduces data entry during future bookings.

---

# Favourite Packages

Customers can:

Save packages

Remove packages

Share packages

Receive price alerts (future)

---

# Notification Preferences

Customers control:

Booking emails

Marketing emails

SMS

WhatsApp

Newsletter

---

# Security

Rate-limit login attempts.

Lock accounts temporarily after repeated failures.

Log suspicious activity.

Require re-authentication for sensitive actions.

---

# Audit Log

Record

Login

Logout

Password Change

Email Change

Booking Creation

Payment Attempts

Security Events

---

# API Endpoints

POST

/auth/register

/auth/login

/auth/logout

/auth/refresh

/auth/forgot-password

/auth/reset-password

/auth/verify-email

GET

/auth/session

/profile

---

# Error Handling

Invalid Credentials

↓

Clear error message

↓

Retry

Expired Session

↓

Refresh Token

↓

Login if refresh fails

---

# Accessibility

Authentication flows must:

Support keyboard navigation

Announce errors to screen readers

Maintain focus correctly

Support password managers

---

# Future Enhancements

Passkeys

Magic Links

Single Sign-On

Corporate Accounts

Travel Agent Accounts

Organisation Accounts

Family Accounts

Delegated Booking Management

---

# Cursor Rules

Cursor should:

- Keep authentication isolated from WordPress.
- Use secure HTTP-only cookies.
- Avoid storing secrets in the browser.
- Build reusable authentication hooks and services.
- Protect routes with middleware.
- Keep authorization logic separate from UI.
- Design authentication to support future providers without major rewrites.

---

# Next Document

08-API.md

Topics

- Backend-for-Frontend architecture
- GraphQL integration
- REST endpoints
- Error handling
- Response formats
- Pagination
- Filtering
- Caching
- Rate limiting
- API versioning