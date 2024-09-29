---
layout: post
title: "The Four Horsemen of network communication"
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

The ability to perform computational (or any other, really) tasks in a distributed, but mostly coordinated and orderly manner is what makes distributed systems stand out, and what allows them to accomplish feats simply impossible for a single physical computer. This is a double-edged sword, however, and in this post we will explore how networking can sometimes scar the very masterpiece created with its powers. Unfortunately, networks have a number of traits that are less than desirable. More often than not, they make networking a liability just as much as a feature:
- Questionable reliability,
- Bandwidth and throughput limitations,
- Latency and jitter,
- Security challenges.

## Unreliability

Networks can, and do go down at the least appropriate time and without notice. Loss of cellular network, having poor Wi-Fi signal or your Bluetooth headphones disconnecting whenever you wander too far away from your desk are great everyday examples, but wired network can also experience partial or full outages due to software and hardware errors, loss of power, damaged wires or simply being too overwhelmed by the traffic.

A full-fledged outage, where no network communication can effectively take place, is only one of many possible symptoms of network unreliability. Due to its absolute nature, it is likely one of the easiest to reason about and address in distributed systems. Far more frequent, yet rather subtle are partial outages and intermittent problems, where the network is mostly functional, but experiences all sorts of _glitches_ - seemingly random and difficult to pin down:
- Lost packets,
- Packets arriving out of order,
- Packets getting duplicated along the way,
- DNS entries that happen to be outdated or outright wrong,
- Two DHCP servers struggling to have the upper hand within the same network, due to broken network setup or a misconfigured Wi-Fi router being plugged into the network.

All of this can be quite annoying when you are playing online multiplayer games, catching up with your favorite TikTokers or if just want to sit back on your sofa and have an all-nighter with Netflix. After all, instead of entertainment you see stream hanging up, have lags in an FPS where every tick matters, or lose a match due to key player being thrown back to lobby in a critical moment. 

However, if you are building distributed systems, network unreliability takes problems and annoyances to a whole new level:
- You are getting bug reports which can hardly be reproduced anywhere,
- Even if they can be reproduced, it happens at random or requires very specific coincidences,
- One of the API calls fails in the middle of a distributed transaction, and now you need to figure out how to arrive at a reasonable outcome,
- To your dismay, you discover you cannot have _both_ strong consistency and full availability - [PACELC theorem](https://en.wikipedia.org/wiki/PACELC_theorem#Database_PACELC_ratings) _will_ force you to choose,
- That database cluster node that went offline two hours ago is now online, and now it needs to be synced with the rest of the cluster. Even worse if it has processed some transactions before going offline and now needs to propagate them to the remaining nodes.

Some Software Engineers and Architects simply choose to pretend the problem does not exist, or that it is too unlikely to be taken seriously. Some genuinely believe that they can escape the grim reality of _consistency vs availability_ dilemma by throwing enough hacks, workarounds and hotfixes at the problem, or by simply paying a hardware / software / cloud vendor who would solve the problem for them. Sadly, such wishful thinking only leads to systems that may not be too reliable, but at least they are expensive and nearly impossible to maintain.

{% capture unreliability_insight %}
Network unreliability is a severe design constraint that should never be overlooked - and with current technology, this trait of networks is going to stay with us for the foreseeable future. As long as distributed systems need to utilize unreliable networks for communication, their designs must take this trait into consideration and adapt. Otherwise, in an event of network errors the system could start to behave in unpredictable ways, or the customer data would be corrupted, or various parts of the system would strive to achieve mutually exclusive goals - preserving consistency or availability.
{% endcapture %}
{% include key-takeaway.html content=unreliability_insight %}

## Bandwidth and throughput

Historically speaking, networks are invariably, inherently slow. Surely enough, you can arrange a &ge;1 Gbps optic fibre connection with your ISP and even get close to this transfer on a good day, and in data centers around the world they probably have connections capable of 100 Gbps, if not more. On the other hand, a typical wired connection is going to be _much_ slower than that, and cellular networks are typically even slower. The reason is that even if you have the best LTE or 5G signal out there, it is useful as long as the BTS providing you the service is not too overwhelmed with nearby devices. In fact, my friend who lived in Karpacz, Poland had plenty of base stations around, and yet when throngs of tourists came over to Karpacz, or when the [Economic Forum](https://www.forum-ekonomiczne.pl/en) was held there, the network became hopelessly overwhelmed, to the point calling emergency numbers would often be impossible.

Compare all of this with what computers are capable of internally. Even disk storage has become significantly faster in the last decade or so, first with widespread adoption of [SSD](https://en.wikipedia.org/wiki/Solid-state_drive) - and more recently large-scale introduction of [NVMe and PCIe consumer disks](https://eu.crucial.com/articles/about-ssd/m2-with-pcie-or-sata). Read and write speeds in excess of 1 GB/s (&thickapprox; 8 Gbps) are the norm for NVMe / PCIe disks, and this performance is quite consistent as opposed to network, where your IPS usually operates on a best-effort basis. High-end SSDs have already surpassed 12 GB/s (&thickapprox; 100 Gbps), besting the fastest optic fibre networks I have heard of so far, which are not available for an average Joe like us anyway. RAM and GPU buses are even faster, anyway, and the transfer speeds there are already approaching, if they have not yet exceeded 100 GB/s (&thickapprox; 800 Gbps), and even then MOBO-mounted RAM access is slower than what CPUs and GPUs can pull off with SoC memory and caches.

What is more, the hardware resources in a PC, laptop, or Smart TV are there for almost exclusive use of the owner. They get utilized by OS, programs and services you run on them - consciously or not - meaning that you have at least rudimentary control of these resources. If there are a lot of files to copy from a USB stick to your hard disk or vice versa, or if you are rendering videos, you can simply turn off less needed programs that would compete for the same resources and are not immediately needed. In case of networks, however, the resources are shared - if not with your co-workers in an office, then with your family in case of home WiFi, or people nearby whenever you use cellular network. What is more, even if you live alone and access the Internet over the wire - the Quality of Service is limited by the infrastructure your ISP has in your are, then on how well is your town or district connected to other areas, then how well connected your country is with the rest of the world. If an entire neighborhood is connected via a 10 Gbps optic fibre, it is physically impossible that everyone could enjoy their 1 Gbps internet and push it to its limits, _simultaneously_.

{% capture throughput_insight %}
Networks can approach SSD drive transfers on a good day, though they will usually struggle to keep up for extended periods, and they are orders of magnitude slower than other media in a typical personal computer or server. This means that whenever large amounts of data need to be transferred from one destination to another, network is going to be the limiting factor. What is more, network infrastructure is shared with multiple participants, and overall usage of available bandwidth has significant impact on throughput attainable by individual participants.
{% endcapture %}
{% include key-takeaway.html content=throughput_insight %}

## Latency and jitter

Putting aside the sheer speed at which data can be transferred across a network, another limiting factor is how long it takes before a message of any kind reaches its recipient. This message can be as little as an ACK during SSL handshake, or as much as a SOAP response with 20 MB worth of XML payload - nevertheless, there is always a delay involved in network communication. In fact, it becomes more visible with growing frequency, not size of the messages involved - with multiple messages being exchanged between the participants, the delays can build up significantly before the communication is concluded.

The reasons for existence of such delays are at least twofold:
- Most importantly, the speed at which information can travel is physically limited by its carrier. Just as much as physical mail cannot travel any faster than the postman, post wagon or post aircraft carrying them, digital information cannot travel faster than electrical signals in a copper wire, or photons in an optic fiber. At least until quantum teleportation becomes a viable medium for long-distance communication, we must live with the fact that our signals will have a latency of, say, 20-50ms within one continent, and often in excess of 100-150ms if it needs to travel across the ocean.
- As a message, or more generally TCP/IP packet travels through the network, it will be generally transmitted from sender to recipient through a number of intermediate devices, responsible for ensuring packets reach their intended destinations. Examples of such network devices acting as intermediates include your personal Wi-Fi access point, routers at your ISP's premises, and many others. In general, depending on how far (physically and/or topologically) sender and recipient are from each other, the number of intermediates vary, and the fact they need to process and retransmit the packets contributes to the overall delay.

If you look closely at any professional latency report, you will notice these values are by no means _absolute_ or _definitive_ - instead, they are expressed in terms of _latency at given percentile_. The reason for this is _jitter_ - because each individual latency is a result of a multitude factors, some of them rather volatile, the latency is subject to changes. Ten packets sent from the same sender to the same recipient may arrive after varying delays, not to mention packets sent from multiple senders or to multiple recipients. Because of this, we frequently read statements such as:

> We observed a latency of 120ms at p50 and 200ms at p99 over the last 2 days.

What it means is that within the specified period, 50% of the time (_p50_) the latency was measured at 120ms or lower, while 99% of the time (_p99_) it would not exceed 200ms. We can also say that this connection - whatever it is - has a jitter that is not really that bad. It is not uncommon to see _p99_ latencies being many times higher than the median (_p50_)

### Example - traceroute

As an exercise, let us see what output would we see when running `traceroute` command to trace packets sent to various hosts:

First, `google.com`:

```bash
~ traceroute google.com
traceroute to google.com (142.250.186.206), 30 hops max, 60 byte packets
 1  _gateway (192.168.0.1)  0.395 ms  0.485 ms  0.560 ms
 2  kra-bng2.neo.tpnet.pl (83.1.4.240)  6.608 ms  6.648 ms  6.683 ms
 3-12 (...)
13  209.85.252.117 (209.85.252.117)  23.511 ms 209.85.255.35 (209.85.255.35)  24.598 ms 142.250.239.81 (142.250.239.81)  23.634 ms
14  142.250.239.81 (142.250.239.81)  24.546 ms waw07s05-in-f14.1e100.net (142.250.186.206)  24.665 ms  24.620 ms
```
This host must be located not too far from Kraków - `waw[...]` prefix would even suggest it may be somewhere in Warsaw.

Then, let us try to hit a more remote server - I found out there is a Brazilian newspaper _O Globo_ hosted on `oglobo.globo.com`:

```bash
~ traceroute oglobo.globo.com       
traceroute to oglobo.globo.com (201.7.177.244), 30 hops max, 60 byte packets
 1  _gateway (192.168.0.1)  0.422 ms  0.531 ms  0.617 ms
 2  kra-bng2.neo.tpnet.pl (83.1.4.240)  3.377 ms  3.417 ms  3.494 ms
3-9 (...)
10  boca-b3-link.ip.twelve99.net (62.115.123.29)  137.755 ms  137.776 ms  137.793 ms
11-29  * * *
30  * * *
```

Apparently, this server must be too far to trace its route, or perhaps behind some firewall preventing this information from reaching me. Even then, we can clearly see these packets were sent much further - the 10th hop took place after nearly 140ms, and there were 20 more before `traceroute` gave up.

Now, with that knowledge we can imagine what happens when two servers exchange messages, or when a user from Alaska has a video chat with friends from Germany - there is always a delay involved between the moment one device sends a packet, and the other receives it, and there is no way to escape this. Even in my vicinity, I can see it takes 4-7ms before a packet sent from my PC reaches the first server on my ISP's side! Looking at [AWS Latency Monitoring](https://www.cloudping.co/grid/p_50/timeframe/1Y), this more or less coincides with what latency can be expected when operating within a single AWS region.

### What does latency mean for distributed systems? 

First of all, the more distributed they are in the geographical sense, the further distances their messages need to cover, contributing to greater latencies of the system. Furthermore, by co-locating components that need to communicate with each other we can significantly improve the systems performance - rather than hosting backend servers in the USA and databases in the UK, it is probably more efficient to have a few instances of each resource in each individual region or area of operation. It also happens to make compliance with all sorts of regulations easier, and allows you to provide customers with better user experience as everything they need is close to them - see `google.com` example above.

Moreover, even with minimal latencies - say, 3-5ms within a single AWS region or 1-2ms within data center premises - they still can, and do compound. Imagine these two systems:

```plantuml!
!theme mono
top to bottom direction
skinparam linetype ortho

rectangle snake as "Snake Systems" {
  actor snakeUser as "User"
  agent snakeServerA as "API Gateway"
  agent snakeServerB as "Reptiles Service"
  agent snakeServerC as "Snakes Service"
  agent snakeServerD as "Pythons Service"
  database snakeDatabase as "Pythons Database"

  snakeUser -d[dotted]-> snakeServerA
  snakeServerA -[dotted]-> snakeUser

  snakeServerA -d[dotted]-> snakeServerB
  snakeServerB -[dotted]-> snakeServerA

  snakeServerB -d[dotted]-> snakeServerC
  snakeServerC -[dotted]-> snakeServerB

  snakeServerC -d[dotted]-> snakeServerD
  snakeServerD -[dotted]-> snakeServerC

  snakeServerD -d[dotted]-> snakeDatabase
  snakeDatabase -[dotted]-> snakeServerD
}
```

In Snake Systems, there is a rather prevalent architecture where network requests need to make their way through multiple layers of microservices before reaching the actual data sources. Each server responds to the caller after receiving a response from the upstream server or database. With 5 requests followed by 5 responses, any latencies present in the system compound quite significantly - for example, if all of them had a constant, 100ms, the total latency would already be a staggering _1000ms_.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype ortho

rectangle starfish as "Starfish Systems" {
  actor starfishUser as "User"
  agent starfishServerA as "API Gateway"
  agent starfishServerB as "Arm One Service"
  agent starfishServerC as "Arm Two Service"
  agent starfishServerD as "Arm Three Service"
  agent starfishServerE as "Arm Four Service"
  agent starfishServerF as "Arm Five Service"
  database starfishDatabaseB as "Arm One Database"
  database starfishDatabaseC as "Arm Two Database"
  database starfishDatabaseD as "Arm Three Database"
  database starfishDatabaseE as "Arm Four Database"
  database starfishDatabaseF as "Arm Five Database"

  starfishUser -d[dotted]-> starfishServerA
  starfishServerA -[dotted]-> starfishUser


  starfishServerA -d[dotted]-> starfishServerB
  starfishServerB -[dotted]-> starfishServerA

  starfishServerB -d[dotted]-> starfishDatabaseB
  starfishDatabaseB -[dotted]-> starfishServerB


  starfishServerA -d[dotted]-> starfishServerC
  starfishServerC -[dotted]-> starfishServerA

  starfishServerC -d[dotted]-> starfishDatabaseC
  starfishDatabaseC -[dotted]-> starfishServerC


  starfishServerA -d[dotted]-> starfishServerD
  starfishServerD -[dotted]-> starfishServerA

  starfishServerD -d[dotted]-> starfishDatabaseD
  starfishDatabaseD -[dotted]-> starfishServerD


  starfishServerA -d[dotted]-> starfishServerE
  starfishServerE -[dotted]-> starfishServerA

  starfishServerE -d[dotted]-> starfishDatabaseE
  starfishDatabaseE -[dotted]-> starfishServerE


  starfishServerA -d[dotted]-> starfishServerF
  starfishServerF -[dotted]-> starfishServerA

  starfishServerF -d[dotted]-> starfishDatabaseF
  starfishDatabaseF -[dotted]-> starfishServerF
}
```

In Starfish Systems, however, the architecture is entirely different - instead of going through layers and layers of servers, the architecture is pretty much flat with domain-specific services. In this scenario, let us imagine these services all need to be called by the API Gateway to repond to the caller, but since these services are queried independently, this can be done in parallel, and the gateway responds when the slowest service sends back a response.

## Security



## Summary

