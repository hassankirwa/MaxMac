# SafariFlow
# 13 — Deployment & Infrastructure

Version: 1.0

---

# Purpose

This document defines the production infrastructure for SafariFlow.

Goals:

- High availability
- Fast global performance
- Secure deployments
- Automated releases
- Reliable backups
- Easy scaling

---

# Production Architecture

Frontend

Next.js

Hosted on:

Vercel

---

Backend CMS

WordPress

Hosted separately.

Recommended:

Cloudways

RunCloud

Ploi

DigitalOcean

Hetzner

---

Media Storage

Do not store uploads permanently on the web server.

Recommended:

Cloudflare R2

Future:

AWS S3

---

DNS

Cloudflare

Responsibilities:

DNS

CDN

Caching

Firewall

Rate Limiting

SSL

Bot Protection

---

Image Delivery

Images served via CDN.

Use:

next/image

Responsive sizes

WebP

AVIF

Automatic optimization

---

Environment Strategy

Development

Local

↓

Staging

↓

Production

Every environment has:

Own database

Own media

Own API keys

---

Environment Variables

Frontend

NEXT_PUBLIC_SITE_URL

GRAPHQL_ENDPOINT

MAPS_API_KEY

ANALYTICS_KEY

Backend

DATABASE_URL

JWT_SECRET

SMTP_KEY

RESEND_KEY

STRIPE_SECRET

FLUTTERWAVE_SECRET

MPESA_SECRET

Never commit secrets.

---

Deployment Workflow

Developer

↓

GitHub

↓

Pull Request

↓

Preview Deployment

↓

Review

↓

Merge

↓

Production Deployment

---

Git Branches

main

Production

develop

Integration

feature/*

New Features

hotfix/*

Urgent Fixes

release/*

Release Preparation

---

CI Pipeline

Run automatically:

Lint

Type Check

Unit Tests

Build

E2E Tests

Accessibility Checks

Deploy Preview

---

CD Pipeline

Automatic deployment:

Main

↓

Production

Develop

↓

Staging

---

Database Backups

Automatic

Daily

Weekly

Monthly

Retain:

30 days

Store offsite.

---

Media Backups

Back up:

Images

Documents

Invoices

Daily synchronization.

---

Disaster Recovery

If WordPress fails:

Restore latest backup.

Reconnect media.

Invalidate CDN.

Verify APIs.

Resume traffic.

Recovery target:

Under 2 hours.

---

SSL

HTTPS everywhere.

HSTS enabled.

Automatic renewal.

---

Caching Strategy

Cloudflare Edge Cache

↓

Vercel Cache

↓

Next.js Cache

↓

WordPress Object Cache

Never cache:

Bookings

Payments

Authentication

---

CDN

Serve:

Images

Fonts

JavaScript

CSS

Static assets

Globally.

---

Monitoring

Monitor:

Frontend

Backend

API

Database

Payments

Emails

Storage

---

Performance Targets

Homepage

<2s

Package Page

<1.5s

Booking

<2s

API

<300ms

Lighthouse

95+

---

Logging

Capture:

Errors

Warnings

Slow Queries

Failed Payments

Authentication Failures

Booking Failures

Never log secrets.

---

Health Checks

Monitor:

WordPress

Database

API Gateway

Payment Providers

Email Provider

Storage

---

Email Infrastructure

Recommended:

Resend

Future:

SES

Mailgun

Fallback:

SMTP

---

Payment Infrastructure

Support:

Stripe

Flutterwave

Pesapal

M-Pesa

PayPal

Monitor webhook failures.

Retry automatically.

---

Security

Cloudflare WAF

Rate Limiting

Bot Protection

DDoS Protection

HTTPS

Secure Cookies

Security Headers

Content Security Policy

---

WordPress Security

Disable XML-RPC.

Disable Theme Editor.

Disable Plugin Editor.

Limit Login Attempts.

Two-Factor Authentication for staff.

Regular plugin updates.

Minimal plugin usage.

---

Observability

Metrics:

API latency

Booking success rate

Payment success rate

Search latency

Conversion rate

System uptime

---

Alerting

Notify on:

Server Down

Payment Failures

Backup Failure

High Error Rate

High Response Time

Storage Limits

---

Recommended Services

Frontend

Vercel

CMS

Cloudways

DNS

Cloudflare

Storage

Cloudflare R2

Monitoring

Better Stack

Error Tracking

Sentry

Email

Resend

Analytics

Plausible

---

Scalability

Future support:

Multi-region

Read Replicas

Load Balancers

Queue Workers

Background Jobs

Microservices

---

Cursor Rules

Cursor should:

- Assume Vercel for Next.js deployment.
- Assume WordPress is independently hosted.
- Build environment-aware configuration.
- Never hardcode environment values.
- Generate health check endpoints.
- Prepare for horizontal scaling.
- Keep deployment scripts reproducible.
- Ensure zero-downtime deployments where possible.

---

Infrastructure Diagram

Internet

↓

Cloudflare

↓

Vercel

↓

Next.js

↓

API Gateway

↓

WordPress

↓

Database

↓

Cloudflare R2

↓

Resend

↓

Payment Providers

---

Next Document

14-Testing.md

Topics:

- Unit testing
- Integration testing
- End-to-end testing
- Accessibility testing
- Performance testing
- Security testing
- Test data
- CI quality gates