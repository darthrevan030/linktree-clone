---
name: IPMS
tagline: Java CLI managing internship placements across three user roles, built on four design patterns.
start: Oct 2025
context: SC2002, NTU
repo: darthrevan030/TUI-Internship-Placement-Management-System
order: 7
showcase: true
links:
  - label: GitHub
    url: https://github.com/darthrevan030/TUI-Internship-Placement-Management-System
tech:
  - Java
  - OOP Design Patterns
  - Java Serialization
  - CSV parsing
resumeBullets:
  - "Designed and built a Java CLI application managing internship placements across three user roles (students, company representatives, career center staff) with full CRUD operations and data persistence"
  - "Implemented four design patterns — Singleton (managers), Strategy (filtering), Composite (combined filters), and Inheritance/Polymorphism (user hierarchy) — following clean layered architecture (boundary/control/entity)"
  - "Built role-based access control and business rules engine enforcing constraints such as application limits, eligibility by year level, and multi-stage approval workflows"
---

## Three roles, one CLI

A text-based Java application managing internship placements across three
distinct user roles — **students**, **company representatives**, and
**career center staff** — each with full CRUD operations against data
persisted via Java serialization and CSV parsing.

## Four patterns, deliberately

Built on a layered **boundary/control/entity** architecture, with four design
patterns applied where the problem actually called for them, not as an
exercise:

- **Singleton** for the manager classes coordinating shared state
- **Strategy** for filtering logic that varies by role and query
- **Composite** for combining multiple filters into one
- **Inheritance/Polymorphism** for the user hierarchy across the three roles

## Access control and business rules

Role-based access control gates what each of the three roles can see and do,
backed by a business rules engine enforcing constraints that mirror how a
real placement system works — per-student application limits, eligibility by
year level, and multi-stage approval workflows between student, company, and
career center.
