# SafariFlow
# 15 — Security Architecture

Version: 1.0

---

# Purpose

This document defines the complete security model for SafariFlow.

It covers:

- Application security
- API security
- WordPress hardening
- Payment security
- Data protection
- Authentication security
- Infrastructure security
- Compliance requirements

---

# Security Philosophy

Security is built-in, not added later.

We assume:

- All external inputs are malicious
- APIs will be attacked
- Bots will attempt abuse
- Credentials will leak eventually

The system must remain safe under failure conditions.

---

# Security Layers

SafariFlow uses layered security:

1. Edge Security (Cloudflare)
2. Application Security (Next.js BFF)
3. API Security (Validation + Auth)
4. CMS Security (WordPress Hardening)
5. Database Security (Access Control)
6. Payment Security (Provider Isolation)

---

# Edge Security (Cloudflare)

Enable:

- WAF (Web Application Firewall)
- Bot Protection
- DDoS Protection
- Rate Limiting
- Geo-blocking (optional)
- Firewall Rules

---

# Application Security

All requests pass through:

Next.js API Gateway (BFF)

Rules:

- Never expose WordPress directly
- Never expose API keys to frontend
- Never trust client-side pricing
- Validate all inputs using Zod
- Sanitize all outputs

---

# Authentication Security

Use:

- HTTP-only cookies
- Secure cookies (HTTPS only)
- SameSite=Lax or Strict
- Short-lived access tokens
- Rotating refresh tokens

Never use:

- localStorage for tokens
- sessionStorage for sensitive data

---

# Password Security

Requirements:

- Minimum 12 characters
- Bcrypt or Argon2 hashing
- Salted passwords
- Password strength validation

Protect against:

- Brute force attacks
- Credential stuffing
- Dictionary attacks

---

# Login Protection

Implement:

- Rate limiting (5 attempts/minute)
- Account lockout after repeated failures
- CAPTCHA after suspicious activity
- IP monitoring

---

# API Security

All API endpoints must enforce:

Authentication (where required)

Authorization (role-based access)

Input validation

Rate limiting

Idempotency for payments

---

# Rate Limiting Rules

Authentication:

5 requests/minute

Booking:

20 requests/minute

Search:

100 requests/minute (cached)

Contact form:

5 requests/minute

Payment endpoints:

Strict protection

---

# Input Validation

All inputs must be validated using Zod:

- Booking data
- Traveller information
- Payment requests
- Contact forms
- Search queries

Reject invalid payloads immediately.

---

# Output Security

Prevent:

- XSS attacks
- HTML injection
- Script injection

Sanitize:

- User reviews
- Traveller notes
- Contact messages

---

# WordPress Security

WordPress is backend-only.

Hardening steps:

- Disable XML-RPC
- Disable file editing
- Hide wp-admin
- Limit login attempts
- Enforce strong passwords
- Two-factor authentication for staff
- Keep plugins minimal
- Auto-updates enabled

---

# Role Security

Strict RBAC (Role-Based Access Control)

Roles:

Admin

Booking Manager

Content Manager

Marketing Manager

Finance

Each role has:

- Explicit permissions
- No default admin access

---

# Payment Security

Important rule:

SafariFlow NEVER processes or stores raw card data.

All payments go through:

- Stripe
- Flutterwave
- M-Pesa
- Pesapal
- PayPal

Security measures:

- Webhook signature verification
- Idempotency keys
- Payment reconciliation logs
- Retry-safe payment handling

---

# Webhook Security

All webhooks must:

- Verify signature
- Validate origin
- Be idempotent
- Be logged
- Be retry-safe

Reject invalid requests immediately.

---

# Data Protection

Sensitive data includes:

- Passport numbers
- Phone numbers
- Email addresses
- Traveller medical notes
- Payment metadata

Rules:

- Encrypt sensitive fields at rest
- Minimize data collection
- Mask sensitive data in logs
- Restrict internal access

---

# Logging Security

Never log:

- Passwords
- Payment details
- Full passport numbers
- API secrets

Allowed logs:

- Event types
- Status changes
- Error codes
- Non-sensitive metadata

---

# Encryption

In transit:

- TLS 1.2+

At rest:

- Database encryption (if available)
- Encrypted storage for sensitive fields

---

# Session Security

Protect sessions with:

- Expiring tokens
- Refresh rotation
- Device tracking (future)
- Session invalidation on password change

---

# CSRF Protection

Protect all state-changing requests:

- Use secure cookies
- Validate origin headers
- Use CSRF tokens where needed

---

# XSS Protection

Prevent:

- Script injection in reviews
- Unsafe HTML rendering
- Malicious comments (future)

Use:

- Output escaping
- Content sanitization
- Strict CSP headers

---

# Content Security Policy (CSP)

Restrict:

- Script sources
- Image sources
- API sources
- Frame embedding

Prevent unauthorized script execution.

---

# Infrastructure Security

Server-level protections:

- Firewall rules
- SSH key authentication only
- No password-based SSH
- Regular patching
- Minimal open ports

---

# Database Security

Rules:

- No public DB access
- Role-based DB access
- Encrypted backups
- Read/write separation (future scale)

---

# Backup Security

Backups must be:

- Encrypted
- Offsite
- Automated
- Versioned

Protect against:

- Ransomware
- Accidental deletion
- Data corruption

---

# API Abuse Prevention

Prevent:

- Scraping
- Bot traffic
- Booking spam
- Coupon abuse

Use:

- Rate limiting
- IP throttling
- Behavioral detection (future)

---

# Fraud Prevention

Monitor:

- High-value bookings
- Repeated failed payments
- Suspicious IP patterns
- Multiple bookings from same identity

Flag for manual review.

---

# GDPR / Data Privacy

Support:

- Right to access data
- Right to delete data
- Data export
- Consent management

Minimize data retention.

---

# Audit Logging

Track:

- Logins
- Bookings
- Payments
- Refunds
- Admin actions
- Data changes

Logs must be immutable.

---

# Incident Response Plan

If breach occurs:

1. Isolate affected systems
2. Revoke sessions
3. Rotate credentials
4. Notify stakeholders
5. Restore from backups
6. Investigate logs
7. Patch vulnerability

---

# Monitoring Security Events

Alert on:

- Failed login spikes
- Payment anomalies
- API abuse
- Unauthorized access attempts
- Suspicious IP traffic

---

# Third-Party Security

All external services must:

- Use secure API keys
- Rotate keys periodically
- Be isolated via adapters
- Never be directly exposed to frontend

---

# Secure Development Rules (Cursor)

Cursor must:

- Validate all inputs with Zod
- Never expose secrets in frontend code
- Avoid direct WordPress calls from UI
- Always use API gateway
- Implement idempotent payment flows
- Enforce role-based access control
- Sanitize all user-generated content
- Prevent unsafe HTML rendering
- Ensure secure defaults for all endpoints

---

# Security Checklist (Pre-Launch)

✔ HTTPS everywhere  
✔ WAF enabled  
✔ Rate limiting active  
✔ Webhook verification enabled  
✔ Password hashing enforced  
✔ Session security configured  
✔ WordPress hardened  
✔ Backups enabled  
✔ Logs secured  
✔ CSP configured  
✔ API validation enforced  

---

# Next Document

16-Final-Architecture-Overview.md

Topics:

- Complete system architecture
- End-to-end data flow
- Component interaction map
- Deployment architecture summary
- Scalability blueprint
- Future evolution roadmap