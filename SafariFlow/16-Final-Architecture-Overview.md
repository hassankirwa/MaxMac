# SafariFlow
# 16 — Final Architecture Overview

Version: 1.0

---

# Purpose

This document provides the complete end-to-end architecture of SafariFlow.

It connects:

- Frontend (Next.js)
- Backend-for-Frontend (API Gateway)
- WordPress CMS
- WP Travel Engine
- Payment providers
- Email system
- Storage system
- Admin dashboard
- Booking system

into one unified system.

---

# System Philosophy

SafariFlow is built as:

Headless CMS + API Gateway + Domain Services + External Providers

NOT:

Monolithic WordPress site

NOT:

Direct frontend-to-plugin integration

---

# High-Level Architecture

```
                    ┌──────────────────────┐
                    │      Users           │
                    └─────────┬────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │   Next.js Frontend   │
                    │  (Marketing + UI)    │
                    └─────────┬────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │  API Gateway (BFF)   │
                    │   Next.js API Layer  │
                    └─────────┬────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐   ┌────────────────┐   ┌──────────────────┐
│ WordPress CMS │   │ Booking Engine │   │ Payment Services │
│ WP Travel     │   │ Business Logic │   │ Stripe/M-Pesa    │
└──────────────┘   └────────────────┘   └──────────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐   ┌────────────────┐   ┌──────────────────┐
│ Content DB    │   │ Booking DB     │   │ Transaction Logs │
└──────────────┘   └────────────────┘   └──────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ External Services    │
                    │ Email, Maps, CDN     │
                    └──────────────────────┘
```

---

# Core System Layers

## 1. Presentation Layer

Next.js Frontend:

- Marketing pages
- Package pages
- Destination pages
- Booking UI
- Customer dashboard
- Admin dashboard

---

## 2. API Gateway Layer (BFF)

Responsibilities:

- Aggregating data
- Enforcing validation
- Handling authentication
- Managing caching
- Abstracting WordPress

Never exposes raw backend responses.

---

## 3. Domain Services Layer

Core business logic:

- Booking Service
- Pricing Service
- Availability Service
- Customer Service
- Payment Service

Independent of external providers.

---

## 4. Provider Layer

Adapters:

- WordPress Adapter
- WP Travel Engine Adapter
- Stripe Adapter
- Flutterwave Adapter
- M-Pesa Adapter
- Email Adapter

Swap-able without rewriting core logic.

---

## 5. Data Layer

Storage:

- WordPress DB (CMS data)
- Booking DB (core transactions)
- Cache Layer (Redis / Edge cache)
- Object Storage (R2 / S3)

---

# End-to-End Booking Flow

```
User selects safari
        │
        ▼
Next.js Booking Wizard
        │
        ▼
API Gateway validates request
        │
        ▼
Pricing Service calculates total
        │
        ▼
Availability Service checks seats
        │
        ▼
Booking Service creates draft booking
        │
        ▼
Payment Service initializes transaction
        │
        ▼
User completes payment (M-Pesa/Card)
        │
        ▼
Webhook received
        │
        ▼
Booking confirmed
        │
        ▼
Email + Invoice + Notifications triggered
```

---

# Data Flow Principles

- Frontend never calculates pricing
- Backend never trusts client input
- Providers never expose internal logic
- All external data is normalized
- All responses follow unified schema

---

# WordPress Role in System

WordPress is ONLY responsible for:

- Safari content
- Blog posts
- Destination descriptions
- SEO content
- Media library

It is NOT:

- Booking engine
- Payment processor
- Pricing authority

---

# WP Travel Engine Role

Used only as:

- Reference data source
- Package structure
- Availability hints (optional)

Fully abstracted behind adapters.

---

# Admin Dashboard Flow

```
Admin User
    │
    ▼
Next.js Admin Dashboard
    │
    ▼
API Gateway
    │
    ▼
Domain Services
    │
    ├── Bookings
    ├── Customers
    ├── Payments
    ├── Reports
    └── Operations
```

---

# Deployment Architecture

```
Cloudflare (Edge)
        │
        ▼
Vercel (Next.js)
        │
        ▼
API Gateway
        │
        ▼
WordPress CMS (Cloudways / VPS)
        │
        ▼
Database + Storage + External APIs
```

---

# Scalability Model

Phase 1

Single region

Monolithic API Gateway

WordPress CMS

---

Phase 2

Caching layer (Redis)

Queue system (background jobs)

Separate booking service

---

Phase 3

Microservices:

Booking Service

Payment Service

Customer Service

Analytics Service

---

Phase 4

Multi-region deployment

Load balancing

Event-driven architecture

---

# Performance Strategy

- Edge caching (Cloudflare)
- Server caching (Next.js)
- API caching (selective)
- Image optimization (next/image)
- Lazy loading
- Code splitting

---

# Security Model (Summary)

- Cloudflare WAF at edge
- API Gateway validation
- Strict RBAC permissions
- Secure cookies
- Webhook verification
- Input sanitization
- No direct CMS exposure

---

# Observability Model

Monitored systems:

- Frontend performance
- API latency
- Booking success rate
- Payment success rate
- Error tracking
- Infrastructure uptime

---

# Failure Handling Strategy

If a service fails:

WordPress down → cached fallback content

Payment failure → retry + queue

Email failure → background retry

API failure → graceful degradation

---

# Future Evolution Path

SafariFlow is designed to evolve into:

- Full SaaS travel platform
- Multi-agency system
- Travel marketplace
- White-label booking engine
- Mobile app ecosystem
- AI itinerary generator

---

# Key Architectural Insight

The most important design decision:

> WordPress is NOT the system.
> It is just a content provider.

Everything else is owned by SafariFlow core architecture.

---

# Final Cursor Rules

Cursor must always:

- Respect domain boundaries
- Keep business logic in services
- Avoid direct WordPress coupling
- Enforce API Gateway usage
- Maintain provider abstraction
- Ensure booking system integrity
- Preserve pricing correctness
- Never bypass validation layers

---

# FINAL SYSTEM SUMMARY

SafariFlow =

Next.js Frontend
+
API Gateway (BFF)
+
Domain Services
+
Provider Adapters
+
WordPress CMS
+
External Services

---

# END OF ARCHITECTURE