---
name: Home Lab
tagline: Self-hosted NAS, network-wide DNS sinkhole, and container-level network isolation.
start: Ongoing
context: Ongoing
order: 8
showcase: true
links: []
tech:
  - Docker
  - Linux
  - Pi-hole
  - macvlan
  - DNS
  - TCP/IP
resumeBullets:
  - "Configured and deployed a personal NAS with Docker containerisation, managing storage, backups, and self-hosted services on a home network"
  - "Implemented Pi-hole as a network-wide DNS sinkhole for ad blocking and DNS query logging, gaining hands-on experience with DNS resolution, filtering rules, and traffic analysis"
  - "Set up macvlan networking in Docker to assign dedicated IP addresses to containers, isolating services at the network layer and deepening understanding of L2/L3 networking, subnetting, and VLAN concepts"
---

An ongoing infrastructure playground, not a finished product — three pieces
that stay running and keep getting extended.

## NAS and containers

A personal NAS deployed with Docker containerisation, handling storage,
backups, and a growing set of self-hosted services on the home network.

## Pi-hole as a network-wide sinkhole

Pi-hole sits in front of every device on the network as a DNS sinkhole,
blocking ads at the DNS layer and logging queries — the point wasn't just ad
blocking, but hands-on time with DNS resolution, filtering rules, and traffic
analysis.

## Network-layer isolation with macvlan

Docker's macvlan networking gives containers their own dedicated IP addresses
on the LAN, isolating services at the network layer rather than trusting
container boundaries alone — the part of the lab that forced real
understanding of L2/L3 networking, subnetting, and VLANs instead of just
reading about them.
