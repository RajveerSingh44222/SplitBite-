# SplitBite — Product Requirements Document (MVP)

> Collaborative food ordering with AI-powered automation for groups.

---

# Document Information

| Field | Value |
|--------|-------|
| Version | v1.0 |
| Status | Draft |
| Date | July 14, 2026 |
| Scope | MVP (Single-City Pilot - India) |
| Platforms | Web, iOS & Android |

---

# Product Overview

SplitBite is a collaborative food-ordering platform that helps groups order food without the usual back-and-forth in chats. A host creates an event, participants join through a shareable link, everyone builds their own order from a single restaurant, and if someone doesn't respond before the deadline, AI first reminds them to order and then automatically selects an order based on their preferences and previous orders if they remain inactive.

---

# Problem Statement

Current group food ordering is inefficient because:

- Conversations happen across messaging apps.
- Late responders delay the entire order.
- One person usually pays first and collects money later.
- Food preferences have to be asked every time.

---

# Solution

SplitBite provides:

- Shared collaborative ordering
- One restaurant per event
- AI-powered reminders before deadlines
- AI auto-order for inactive participants
- Automatic bill splitting
- Live event tracking
- Personalized recommendations using previous preferences and order history

---

# Target Personas

### Roommate Host
Orders frequently with the same small group and wants the fastest possible ordering experience.

### Office Organizer
Coordinates meals for larger teams, manages budgets, and needs minimal follow-up with participants.

### Event Planner
Organizes parties and gatherings where collaboration and user experience matter as much as the food.

---

# MVP Goals

- Simplify collaborative food ordering.
- Reduce ordering delays using AI.
- Validate repeat usage.
- Test freemium monetization.

---

# Success Metrics

| Tier | Metric | Target |
|------|--------|--------|
| **North Star** | Repeat events per active host | ≥ 1.5 |
| Supporting | Participant retention | ≥ 40% |
| Primary | Event completion rate | ≥ 70% |
| Primary | AI auto-order acceptance | ≥ 80% |
| Secondary | Average ordering time | < 25 min |
| Secondary | Free → Paid conversion | ≥ 15% |
| Guardrail | Payment failures | < 3% |

---

# MVP Features

## P0 — Authentication

- Email / OTP login
- User onboarding
- Cuisine & dietary preferences

**P1**

- Google Sign-In

---

## P0 — Event Management

- Create events
- Invite participants via link/code
- Set budget & deadline
- Live participant status
- Event lifecycle management
- Leave event before ordering

**P1**

- Edit event details after creation

---

## P0 — Collaboration

- Live activity feed
- Real-time updates
- Countdown timer
- Push notifications
- Host dashboard

---

## P0 — Restaurant & Menu

- Curated restaurant recommendations
- Budget & cuisine filtering
- Shared restaurant selection
- Individual carts
- Menu indicators (Veg, Bestseller, Spice Level)

---

## P0 — AI Features

- Restaurant recommendations based on group preferences.
- **Smart personalized reminders** before the deadline for participants who haven't ordered yet (e.g., reminding them about a favorite cuisine within budget).
- AI auto-order for inactive participants after the deadline.
- Personalized ordering using previous preferences and order history.
- Human-readable explanation for every AI-selected order.
- Optional AI auto-order toggle.

**P1**

- Improved AI explanations using LLMs.

---

## P0 — Payments

- Automatic bill splitting
- UPI, Cards & Wallets
- Real-time payment tracking
- Payment retry flow
- Freemium billing

---

## P0 — Dashboard & Profile

- Active & past events
- Saved payment methods
- AI preferences
- Order history

**P2**

- Notification preference settings

---

# Monetization

## Freemium Model

- First **5 completed orders per user** are free.
- Paid plans unlock unlimited usage.

Available plans:

- Monthly subscription
- One-time event packs

---

# Technical Overview

## Existing

- Next.js frontend prototype
- UI components
- Mock data

## To Build

- Backend APIs
- Authentication
- Real-time collaboration
- Payment integration
- AI service
- Push notifications

---

# Non-Functional Requirements

- Fast interactions (<1.5s)
- Live updates (<3s)
- 99.5% uptime
- Secure payment processing
- Encrypted user data
- Horizontally scalable architecture
- Accessible UI

---

# MVP Scope

## Included

- Event creation
- Group ordering
- AI recommendations
- Smart AI reminders
- AI auto-order
- Split payments
- Notifications
- Dashboard
- Profiles

## Excluded

- Multi-restaurant ordering
- Own delivery network
- Multi-city support
- Loyalty programs
- Restaurant dashboards

---

# Release Roadmap

| Phase | Focus |
|--------|-------|
| Phase 0 | Backend foundation |
| Phase 1 | MVP launch |
| Phase 2 | AI & product improvements |
| Phase 3 | Regional expansion |

---

# Key Risks

- Users may not trust AI ordering.
- Payment failures can disrupt the experience.
- Monetization may reduce retention.
- Delivery partner dependency.

---

# Assumptions

- Strong delivery partner coverage.
- Users already use UPI/cards.
- One restaurant per event is acceptable for MVP.

---

# North Star Metric

**Repeat Events per Active Host**

The primary success metric is how often users return to create new group ordering events. Participant retention is tracked as a supporting metric that validates long-term engagement.
