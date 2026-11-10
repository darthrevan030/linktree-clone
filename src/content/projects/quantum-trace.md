---
name: QuantumTrace
tagline: A post-quantum cryptography scanner for Mojaloop that rates every algorithm it finds from CRITICAL to SAFE.
start: May 2026
context: Mojaloop Foundation
repo: darthrevan030/quantum-trace
order: 1
links:
  - label: GitHub
    url: https://github.com/darthrevan030/quantum-trace
tech:
  - Python
  - CycloneDX
  - SQLite
  - AWS
resumeBullets:
  - "Built post-quantum cryptography scanner targeting Mojaloop (open-source financial inclusion payments platform). Finds crypto usage in JS/TS, Python, Java and Go repos, rates each algorithm CRITICAL to SAFE against Shor/Grover per NIST FIPS 203/204/205 and SP 800-131A"
  - "Added Mojaloop-specific detection of JWS signing/validation (RS256/ES256)"
  - "Designed plugin-style pipeline: 81 detection rules in per-language JSON, one central rating catalog. New language needs one rule file plus a test"
  - "Extended beyond source code: npm lockfile transitive dependency tracing, TLS packet-capture analysis (ML-KEM hybrid aware), AWS KMS/ACM/load-balancer TLS policy ratings. Shipped CI-gating CLI, CycloneDX 1.7 CBOM export, SQLite dashboard, 166 unit tests"
---
