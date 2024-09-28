---
layout: post
title: "Communication challenges in distributed systems"
jargon_heavy: true
stock: night-traffic
tags: 
  - "communication"
  - "network"
  - "distributed-systems"
  - "microservices"
---

## Abstract

As already discussed in [On distributed systems](/on-distributed-systems/), one of the hallmark characteristics of a distributed system is that it requires at least occasional network communication to get the job done. 

The ability to perform computational (or any other, really) tasks in a distributed, but mostly coordinated and orderly manner is what makes distributed systems stand out, and what allows them to accomplish feats simply impossible for a single physical computer. This is a double-edged sword, however, and in this post we will explore how networking can sometimes scar the very masterpiece created with its powers.

## The Four Horsemen of network communication

Unfortunately, networks have a number of traits that are less than desirable. More often than not, they make networking a liability just as much as a feature:
- Questionable reliability,
- Transfer speeds,
- Latency and jitter,
- Security challenges.

### Unreliability

Networks can, and do go down at the least appropriate time and without notice. Loss of cellular network, having poor Wi-Fi signal or having your Bluetooth headphones disconnect whenever you wander too far away from your desk are great everyday examples, but wired network can also experience partial or full outages due to software and hardware errors, loss of power, damaged wires or simply being too overwhelmed by the traffic.

A full-fledged outage, where no network communication can effectively take place, is only one of many possible symptoms of network unreliability. Due to its absolute nature, it is likely one of the easiest to reason about and address in distributed systems. Far more frequent, yet rather subtle are partial outages and intermittent problems, where the network is mostly functional, but experiences all sorts of _glitches_ - seemingly random and difficult to pin down:
- Lost packets,
- Packets arriving out of order,
- Packets getting duplicated along the way,
- DNS entries that happen to be outdated or outright wrong,
- Two DHCP servers struggling to have the upper hand within the same network, due to broken network setup or a misconfigured Wi-Fi router being plugged into the network.

All of this can be quite annoying when you are playing online multiplayer games, catching up with your favorite TikTokers or just want to sit back on your sofa and have an all-nighter with Netflix. After all, instead of entertainment you are getting the stream hanging up, having lags in an FPS where every tick matters, or losing a match due to key player getting thrown back to lobby in a critical moment. 

However, if you are building distributed systems, network unreliability takes problems and annoyances to a whole new level:
- You are getting bug reports which can hardly be reproduced anywhere,
- Even if they can be reproduced, it happens at random or requires very specific coincidences,
- One of the API calls fails in the middle of a distributed transaction, and now you need to figure out how to arrive at a reasonable outcome,
- To your dismay, you discover you cannot have _both_ strong consistency and full availability - [PACELC theorem](https://en.wikipedia.org/wiki/PACELC_theorem#Database_PACELC_ratings) _will_ force you to choose,
- That database cluster node that went offline two hours ago is now online, and now it needs to be synced with the rest of the cluster. Even worse if it has processed some transactions before going offline and now needs to propagate them to the remaining nodes.

Some Software Engineers and Architects simply choose to pretend the problem does not exist, or that it is too unlikely to be taken seriously. Some genuinely believe that they can escape the grim reality of _consistency vs availability_ dilemma by throwing enough hacks, workarounds and hotfixes at the problem, or by simply paying a hardware / software / cloud vendor who would solve the problem for them. Sadly, such wishful thinking only leads to systems that may not be too reliable, but at least they are expensive and nearly impossible to maintain.

### Transfer speeds

Historically speaking, networks are invariably, inherently slow. Surely enough, you can arrange a &ge;1 Gbps optic fibre connection with your ISP, and in data centers around the world they probably have connections capable of 100 Gbps, if not more. On the other hand, a typical wired connection is going to be _much_ slower than that, and cellular networks are typically even slower.