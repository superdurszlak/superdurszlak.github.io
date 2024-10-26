---
layout: post
title: "Sensors and gauges - Observability in distributed systems"
jargon_heavy: true
stock: avionics
tags: 
  - "observability"
  - "monitoring"
  - "distributed-systems"
  - "microservices"
---

Imagine a world where a pilot would have to fly an over 500-ton, 4-engined Airbus A380 with virtually no avionics or flight instruments, only a primitive joystick and maybe a headlight for night landings. Imagine a captain tasked with navigating a coral reef, full of underwater ridges, or sneaking underneath polar ice sheet, all the while commanding a submarine lacking a sonar and basic instruments, compass, depth indicator and a periscope. Imagine a construction equipment operator required to excavate a 400m long, 3m deep ditch - only the excavator they are manning only has a number of peepholes in solid metal cabin walls instead of proper windows.

Does any of this sound like an impossible, if not suicidal mission to you? Now, imagine we are talking not about a single airplane, a single submarine or a single piece of construction equipment - but rather a myriad of them. Tens, if not hundreds of individual airplanes, submarines and excavators working towards a common goal; All the while struggling to maintain situational awareness and get the job done without crashing into each other, or into the ground, and ideally without any collateral damage.

At this point, it might appear unimaginable, and rightly so. Unfortunately, this is more or less the reality of working with a distributed system lacking observability measures at all, or equipped with inadequate instruments. In this post, we will explore how distributed systems are commonly monitored, and how various parts of observability stack help Engineering Teams maintain situational awareness.