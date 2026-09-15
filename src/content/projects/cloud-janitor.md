---
name: Cloud Janitor
tagline: An 11-agent AWS remediation system that turns unstructured findings into reviewable Terraform.
start: Jun 2026
end: Jul 2026
award: AWS × Kiro BuildFest 2026 — Most Practical Award
context: AWS × Kiro BuildFest 2026
repo: darthrevan030/Cloud-Janitor
order: 2
showcase: true
links:
  - label: GitHub
    url: https://github.com/darthrevan030/Cloud-Janitor
  - label: PyPI
    url: https://pypi.org/project/cloud-janitor/
tech:
  - Python
  - AWS
  - Terraform
  - FastMCP
  - Hypothesis
  - GitHub Actions
resumeBullets:
  - "Owned architecture and technical direction for an 11-agent AWS remediation system (FinOps Auditor, SecOps Guard, Remediation Architect + 8 specialized agents), coordinating with a collaborator on UI integration"
  - "Engineered the reasoning layer that interprets natural-language queries, detects cost/security anomalies and config drift, and converts unstructured AWS findings into executable Terraform HCL, with a dedicated validation check before human review"
  - "Built SecOps Guard to catch AWS misconfigurations (e.g., security groups open to 0.0.0.0/0) and generate fixes as reviewable Terraform, not silent auto-remediation"
  - "Set the non-negotiable design constraint: no agent-generated infra change executes without explicit human approval and a rollback plan generated pre-execution"
  - "Architected a provider-agnostic backend (AWS fully implemented, GCP/Azure interface-stubbed) with two entry points into the same core engine — a CLI (scan, approve, rollback, dashboard, mcp) and a 10-tool MCP server (FastMCP)"
  - "Ran spec-driven development in Kiro IDE end-to-end across multiple audit-remediation passes: authored and reviewed 6 specs, tracked 232 tasks to 100% completion"
  - "Set up CI/CD with OIDC trusted publishing (no long-lived secrets); published to PyPI (cloud-janitor v0.3.0), backed by 1,300+ tests including Hypothesis property-based tests"
---

## The design constraint that shaped everything

**No agent-generated infrastructure change executes without explicit human
approval and a rollback plan generated before execution.**

That constraint was set first and everything else followed from it. An agent
that can silently mutate production AWS infrastructure is a liability no matter
how good its reasoning is, so Cloud Janitor never applies a fix — it *proposes*
one, as reviewable Terraform HCL a human reads and approves.

## The eleven agents

Three named agents lead the system — **FinOps Auditor**, **SecOps Guard**, and
**Remediation Architect** — supported by eight specialised agents. Owned
architecture and technical direction for the full agent system, coordinating
with a collaborator who led UI integration.

The reasoning layer interprets natural-language queries, detects cost and
security anomalies and configuration drift, then converts unstructured AWS
findings into executable Terraform, passing a dedicated validation check before
anything reaches human review.

**SecOps Guard** catches misconfigurations like security groups open to
`0.0.0.0/0` and emits the fix as Terraform rather than silently remediating it.

## Two entry points, one engine

The backend is provider-agnostic — AWS fully implemented, GCP and Azure
interface-stubbed — with two front doors into the same core:

- a **CLI** (`scan`, `approve`, `rollback`, `dashboard`, `mcp`)
- a **10-tool MCP server** built on FastMCP

## Build process

Developed spec-first in Kiro IDE across multiple audit-remediation passes: six
specs authored and reviewed, 232 tasks tracked to completion. Shipped to PyPI as
`cloud-janitor` v0.3.0 via CI/CD with OIDC trusted publishing — no long-lived
secrets — behind 1,300+ tests including Hypothesis property-based tests.
