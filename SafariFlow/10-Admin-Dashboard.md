# SafariFlow
# 10 — Admin Dashboard

Version: 1.0

---

# Overview

SafariFlow includes a modern operations dashboard built using Next.js.

This dashboard replaces the need for staff to spend most of their time inside WordPress.

WordPress remains responsible for:

- Content
- Tours
- SEO
- Media

SafariFlow Dashboard manages:

- Bookings
- Customers
- Reports
- Pricing
- Availability
- Payments
- Operations

---

# Dashboard Goals

The dashboard should allow staff to complete daily work within minutes.

Primary goals

✓ View today's bookings

✓ Manage customers

✓ Confirm payments

✓ Monitor departures

✓ View reports

✓ Manage availability

✓ Generate invoices

✓ Respond to enquiries

---

# User Roles

Administrator

Booking Manager

Operations Manager

Marketing Manager

Content Manager

Finance

Guide

Each role only sees relevant modules.

---

# Dashboard Home

Display

Today's Bookings

Upcoming Departures

Pending Payments

New Enquiries

Recent Reviews

Revenue Summary

Low Availability Alerts

System Notifications

---

# Navigation

Dashboard

Bookings

Customers

Packages

Calendar

Payments

Reviews

Reports

Content

Settings

---

# Bookings Module

List View

Booking Number

Customer

Safari

Departure

Guests

Payment Status

Booking Status

Actions

---

# Booking Details

Booking Information

Customer Information

Travellers

Payment History

Invoice

Special Requests

Audit Log

Emails Sent

Notes

Timeline

---

# Booking Actions

Confirm Booking

Cancel Booking

Refund

Reschedule

Send Invoice

Send Reminder

Download PDF

Assign Guide

Assign Vehicle

---

# Calendar

Monthly

Weekly

Daily

Displays

Departures

Guide Assignments

Vehicle Assignments

Availability

Bookings

---

# Customer Module

Search

Email

Phone

Nationality

Bookings

Lifetime Spend

Upcoming Trips

Past Trips

Notes

---

# Customer Profile

Profile

Bookings

Payments

Documents

Invoices

Traveller Profiles

Support Tickets

Communication History

---

# Package Management

View Packages

Update Availability

Update Pricing

Manage Departures

Clone Package

Archive Package

---

# Departure Management

Each departure displays

Date

Package

Guide

Vehicle

Seats Available

Seats Sold

Status

---

# Guide Assignment

Assign guide to departure.

Display

Guide Photo

Languages

Experience

Availability

Upcoming Trips

---

# Vehicle Assignment

Assign

Land Cruiser

Safari Van

Open Jeep

Luxury SUV

Track

Capacity

Availability

Maintenance Status

---

# Payment Module

Display

Pending

Paid

Refunded

Failed

Overdue

Actions

Capture Payment

Issue Refund

Resend Invoice

Generate Receipt

---

# Reports

Revenue

Bookings

Top Packages

Top Destinations

Countries

Repeat Customers

Average Booking Value

Conversion Rate

Booking Sources

---

# Analytics

Daily Revenue

Monthly Revenue

Yearly Revenue

Occupancy

Departure Utilisation

Top Guides

Vehicle Usage

Booking Funnel

---

# Review Management

Approve

Reject

Reply

Feature

Flag

---

# Enquiries

Manage contact requests.

Assign staff.

Track status.

Convert enquiry into booking.

---

# Notifications

Low Seats

Failed Payments

New Reviews

System Updates

Upcoming Departures

Expiring Coupons

---

# Staff Notes

Internal notes only.

Customers never see them.

Each note records

Author

Timestamp

Related Entity

---

# Search

Global search

Supports

Booking Number

Customer

Package

Destination

Guide

Vehicle

Email

Phone

Invoice

---

# Filters

Booking Status

Payment Status

Departure Date

Country

Package

Guide

Vehicle

Sales Agent

---

# Bulk Actions

Confirm Bookings

Cancel

Email

Export

Assign Guide

Assign Vehicle

Generate PDFs

---

# Exports

CSV

Excel

PDF

Future

Google Sheets

Power BI

---

# Dashboard Widgets

Revenue

Bookings Today

Active Guides

Vehicle Availability

Recent Reviews

Occupancy

Weather (Future)

---

# Audit Logs

Track

Login

Booking Changes

Payment Changes

Price Changes

Refunds

Content Updates

Staff Actions

---

# Permissions

Every module supports

View

Create

Update

Delete

Export

Approve

Permissions managed through role-based access control.

---

# Accessibility

Keyboard Navigation

Screen Readers

Focus States

High Contrast

---

# Mobile Dashboard

Responsive.

Supports

Bookings

Payments

Calendar

Customer Search

Quick Actions

---

# Future Features

Real-time Notifications

Live Chat

CRM Integration

WhatsApp Messaging

AI Assistant

Voice Search

Offline Mode

Guide Mobile App

Driver Mobile App

Inventory Management

---

# Cursor Rules

Cursor should:

- Build the dashboard as a separate route group (`/(admin)`).
- Use server-rendered pages with client-side enhancements.
- Create reusable table, filter, and detail components.
- Keep modules independent and feature-based.
- Support optimistic updates where appropriate.
- Use TanStack Table for complex grids.
- Build reusable charts and KPI widgets.
- Implement role-based route protection.
- Design for desktop first while remaining responsive.

---

# Suggested Folder Structure

app/
  (admin)/
    dashboard/
    bookings/
    customers/
    departures/
    payments/
    reports/
    reviews/
    settings/

features/
  admin/
    dashboard/
    bookings/
    customers/
    payments/
    reports/
    calendar/
    analytics/

---

# Next Document

11-Frontend-Pages.md

Topics:

- Homepage
- Safari package page
- Destination pages
- Search experience
- Blog
- Gallery
- Contact
- Customer dashboard
- UX patterns
- Component composition