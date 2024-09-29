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

### Oblivious inconsistency

Consider this system:

```plantuml!
!theme mono
top to bottom direction
skinparam linetype polyline

cloud {
  agent orchestrator as "Synchronous Orchestrator"
  agent serviceA as "Service A"
  agent serviceB as "Service B"
  agent serviceC as "Service C"
  agent dots as "..."
  agent serviceJ as "Service J"

  orchestrator -d[dashed]-> serviceA
  orchestrator -d[dashed]-> serviceB
  orchestrator -d[dashed,#red]-> serviceC
  orchestrator -d[dashed]-> dots
  orchestrator -d[dashed]-> serviceJ
}
```

The orchestrator performs some business operation that coordinates multiple services, from A through J. Unfortunately, it was not design with network failures in mind, and the orchestrator only covers the happy path when all the interactions go smoothly, with no room for failure. If the failure does occur, forever - perhaps Service C malfunctions, or the server it ran broke down, or there was a random network timeout - the orchestrator ends up in an undefined state, incapable of either completing the distributed transaction, nor of undoing the work already done - since this is a _distributed_ transaction, there is no way to _rollback_ automatically as if it ran within a single DB transaction.

What can Software and Support Engineers do in such a situation?
- Undo the conundrum manually - if there is no compensation, rollback, or recovery mechanism in place, and the operation was not idempotent (which would at least allow to retry more easily) this is the only thing the broken state can be realistically fixed. However, it will take time and be labour intensive - not good from both the customer's and company's perspective.
- Pretend it was a one-off situation and will not occur again - unfortunately, this is quite a frequent strategy of "dealing" with unreliability: to assume it would not happen again, and even if it does, it would certainly be at such a small scale it can be fixed manually. Needless to say, a major outage is sometimes required to learn from mistakes.
- Try to "fix" the systems with workarounds, adding error-handling on top of the core business logic just to handle best known edge cases etc. - while better than pretending the problem does not exists, as it can sometimes reduce the likelihood of catastrophic failures short-term, it is not a sustainable approach and does not promote maintainability.
- Finally, we could - and should - acknowledge that our systems _are_ going to fail from time to time, and take a systemic approach. Anticipation of failure should push as to arrive at the most reasonable trade-offs on a case-by-case basis, and to follow industry best practices and patterns to attain required consistency guarantees. Examples of such practices include:
  - Incorporation of disaster recovery, retries and failover into the systems,
  - Building idempotent systems, which can support safely re-trying a failed transaction,
  - Leveraging compensation or similar strategies to automatically rollback a distributed transaction,
  - Removing direct and synchronous communication where feasible, enhancing fault tolerance in case some components are not available.

### Taking (dis)advantage of probability

In the example above, the fact that an orchestrator needs to coordinate communication with 10 different services only exacerbates the issue. Let us assume for a moment that the company behind this system mandates a 4-nines availability standard, meaning that _the system must be available 99.99% of the time_. Now, when do we consider this system to be available? With this architecture, all of the components must be available. From probability calculus, we can tell that if all conditions must be met for the outcome to be successful, then the probability of a successful outcome is a product of all partial probabilities. In our case, it's the probability that each component of a system is available:

$ P_{\text{system}} = \prod_{i=1}^{n} P_i $

In our case, we have a single API gateway and 10 upstream services, so we can assume `n=11`. Now, let us see what happens if all components of the system follow the mandated requirement of 99.99% availability to the letter. Let us find the predicted availability of the entire system:

$ P_{\text{system}} = \prod_{i=1}^{n} P_i = \prod_{i=1}^{11} 0.9999 = 0.9999^{11} \approx 0.9989 $

Despite each of the 11 components does meet the availability requirements, the entire system does not - at 99.89% availability, it is far from meeting 4-nines requirements, and even missed a 3-nines standard (99.9%) by a hair. If we are generous, we can round up and say it _is_ a 3-nines system, but realistically speaking it would be classified as 99.5%. In order for the entire system to meet the 4-nines requirement, translating to just under an hour of annual downtime, individual components would have to have an availability of _99.9995%_, meaning a mere 2.5 minutes of downtime _per year_.

However, probabilistic calculus can be taken to our advantage as well. Consider the following scenario:

```plantuml!
!theme mono
top to bottom direction
skinparam linetype polyline

rectangle service as "Service" {
  collections LB as "Load Balancer"
  agent serviceA as "Instance A"
  agent serviceB as "Instance B"
  agent serviceC as "Instance C"
  agent serviceD as "Instance D"
  agent serviceE as "Instance E"

  LB -d[dotted]-> serviceA
  LB -d[dashed,#red]-> serviceB
  LB -d[dashed,#darkgreen]-> serviceC
  LB -d[dotted]-> serviceD
  LB -d[dotted]-> serviceE
}
```

This time, let us assume we run multiple instances of our service, all of them behind a Load Balancer that routes the traffic to available instances. In order for this setup to be available, we require the following:
- The Load Balancer itself is available,
- At least one instance of the service is available.

For the sake of this example, let us assume the Load Balancer is already Highly Available with pre-configured failover to alternative LB instance, and guarantees a 99.99995% availability - a bit over 6-nines standard. Let us also assume our instances only meet a 2-nines standard individually, but we run 5 of them while expecting 1 to be sufficient to run the system.

In case of replication, probability is our asset. Since we only need one of the instances to be available at any time, we can derive availability from the likelihood that all the instances experience downtime simultaneously and independently:

$ P_{\text{replicas}} = 1 - P_{\text{failure}} = 1 - \prod_{i=1}^{n} P_{\text{i,failure}} = 1 - \prod_{i=1}^{n} (1 - P_i) $

At 99% availability, the results would be as follows:

$ P_{\text{replicas}} = 1 - P_{\text{failure}} = 1 - \prod_{i=1}^{5} P_{\text{i,failure}} = 1 - \prod_{i=1}^{5} (1 - 0.99) = 1 - 0.01^5 = 1 - 10^{\text{-10}} = 0.9999999999 $

That is correct - the likelihood that all the instances would go down _independently_, at random is just absurdly low, and should a failure occur - it is highly unlikely to be the reason. Combined with the availability of the Load Balancer, we get the following outcome:

$ P_{\text{system}} = P_{\text{instances}} \times P_{\text{LB}} = 0.9999999999 \times 0.9999995 \approx 0.99999949 $

As you can see, the service instances _and_ the Load Balancer can still meet the 6-nines standard, with room to spare. In practice, the availability would likely be further limited by other factors:
- Instance failures are often related, for instance due to misconfiguration or an uncaught software error. Testing is supposed to eliminate this, however it is not impossible to introduce critical bugs that would only become apparent in production,
- Under high loads, especially without proper rate limiting and circuit breaking, a failure of a small number of instances can trigger a cascade of failures, as the remaining ones cannot take the added load,
- In orchestrated cloud environments, misconfigured application deployment can lead to multiple instances of the same application running on a single worker node. In that case, node's availability is going to affect multiple instances at once.

{% capture unreliability_insight %}
Network unreliability is a severe design constraint that should never be overlooked - and with current technology, this trait of networks is going to stay with us for the foreseeable future. As long as distributed systems need to utilize unreliable networks for communication, their designs must take this trait into consideration and adapt. Otherwise, in an event of network errors the system could start to behave in unpredictable ways, or the customer data would be corrupted, or various parts of the system would strive to achieve mutually exclusive goals - preserving consistency or availability.
{% endcapture %}
{% include key-takeaway.html content=unreliability_insight %}

## Bandwidth and throughput

Historically speaking, networks are invariably, inherently slow. Surely enough, you can arrange a &ge;1 Gbps optic fibre connection with your ISP and even get close to this transfer on a good day, and in data centers around the world they probably have connections capable of 100 Gbps, if not more. On the other hand, a typical wired connection is going to be _much_ slower than that, and cellular networks are typically even slower. The reason is that even if you have the best LTE or 5G signal out there, it is useful as long as the BTS providing you the service is not too overwhelmed with nearby devices. In fact, my friend had plenty of base stations around when he lived in Karpacz, Poland, and yet when throngs of tourists came over to Karpacz, or when the [Economic Forum](https://www.forum-ekonomiczne.pl/en) was held there, the network would become hopelessly overwhelmed - to the point calling emergency numbers would often be impossible.

Compare all of this with what computers are capable of internally. Even disk storage has become significantly faster in the last decade or so, first with widespread adoption of [SSD](https://en.wikipedia.org/wiki/Solid-state_drive) - and more recently large-scale introduction of [NVMe and PCIe consumer disks](https://eu.crucial.com/articles/about-ssd/m2-with-pcie-or-sata). Read and write speeds in excess of 1 GB/s (&thickapprox; 8 Gbps) are the norm for NVMe / PCIe disks, and this performance is quite consistent as opposed to network, where your IPS usually operates on a best-effort basis. High-end SSDs have already surpassed 12 GB/s (&thickapprox; 100 Gbps), besting the fastest optic fibre networks I have heard of so far, which are not available for an average Joe like us anyway. RAM and GPU buses are even faster, anyway, and the transfer speeds there are already approaching, if they have not yet exceeded 100 GB/s (&thickapprox; 800 Gbps), and even then MOBO-mounted RAM access is slower than what CPUs and GPUs can pull off with SoC memory and caches.

What is more, the hardware resources in a PC, laptop, or Smart TV are there for almost exclusive use of the owner. They get utilized by OS, programs and services you run on them - consciously or not - meaning that you have at least rudimentary control of these resources. If there are a lot of files to copy from a USB stick to your hard disk or vice versa, or if you are rendering videos, you can simply turn off less needed programs that would compete for the same resources and are not immediately needed. In case of networks, however, the resources are shared - if not with your co-workers in an office, then with your family in case of home WiFi, or people nearby whenever you use cellular network. What is more, even if you live alone and access the Internet over the wire - the Quality of Service is limited by the infrastructure your ISP has in your are, then on how well is your town or district connected to other areas, then how well connected your country is with the rest of the world. If an entire neighborhood is connected via a 10 Gbps optic fibre, it is physically impossible that everyone could enjoy their 1 Gbps internet and push it to its limits, _simultaneously_.

### When is bandwidth a problem?

In my experience, there are several reasons why bandwidth could become a problem in distributed systems:
- When edge devices (e.g. mobile) need to operate in an environment with limited network availability,
- Since components of distributed systems need to be installed somehow, actually downloading them from all sorts of repositories or registries takes time,
- While not too frequent in the industries I have worked with so far, it is not impossible for server's network connection to be saturated with transfers.

To begin with, server-to-server communication is quite privileged - in the sense that network bandwidth is usually good enough to not to have to worry about it, at least initially. We have grown used to using rather bloated, text-based data formats to exchange information, such as [XML](https://www.w3.org/TR/1998/REC-xml-19980210/) and [JSON](https://datatracker.ietf.org/doc/html/rfc8259). Only recently we started appreciating binary formats again, and the likes of [Protocol Buffers](https://protobuf.dev/overview/) and communication based on [gRPC](https://grpc.io/) are all the rage. An end user using a limited, low-bandwidth cellular network is in a far more precarious position - with a throughput measured in low megabits or even hundreds of kilobits per second, and oftentimes with limits on transfer usage imposed by their provider. In their case, excessive bandwidth usage is visible from day one, rather than after attaining a certain scale.

In day-to-day Software Engineer's work, bandwidth can become problematic as various dependencies need to be downloaded on different occasions:
- When you are setting up your local development environment, and whenever dependencies require an update,
- When they cause build times in CI/CD pipelines to go up, as the pipeline is busy for seconds or minutes just downloading Java libraries or OCI base images,
- During deployments, when all the application artifacts need to be uploaded to their target environments before they can actually run there.

The best way to manage this problem is to be mindful about your project dependencies:
- Do not keep dependencies if they are not needed - as obvious as it sounds, almost every project has some overlooked dependencies that could be removed,
- Use lightweight alternatives - a hallmark example is using Alpine / Distro-less base images as opposed to full Linux images, which has the added benefit of being somewhat more secure than running a full-fledged distro with SSH and other services,
- Avoid needless re-downloading - it is often possible to limit the number of cases a dependency or artifact requires downloading by reasonable caching, and in case of OCI images intermediate images can be pre-built with dependencies required by final image.

Lastly, one needs to be considerate about bandwidth usage induced by the systems they are building. This may be difficult to notice at a lower scale, but as the traffic keeps growing sending large JSON or XML payloads back and forth between servers can become problematic. To give one example, if a server send and receives 10MB payloads for each request, it means approximately 80 Mbps throughput in each direction just to handle a single request per second! At 100 rps, the throughput would already be 8 Gbps. It is quite likely that network bandwidth would become problematic - therefore, one could consider limiting payloads size. This can be done by limiting redundancy, increasing granularity (if feasible), introducing a more information-dense format, such as binary, and finally by utilizing compression.

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
  agent snakeServerB as "Pythons Service"
  agent snakeServerC as "Snakes Service"
  agent snakeServerD as "Reptiles Service"
  database snakeDatabase as "Reptiles Database"

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

In Snake Systems, there is a rather prevalent architecture where network requests need to make their way through multiple layers of microservices before reaching the actual data sources. Each server responds to the caller after receiving a response from the upstream server or database. With 5 requests followed by 5 responses, any latencies present in the system compound quite significantly. For example, if all of them had a constant latency of 100ms, the total latency would already be a staggering _1000ms_.

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


  starfishServerA -d[dotted]-> starfishServerD: slow
  starfishServerD -[dotted]-> starfishServerA: slow

  starfishServerD -d[dotted]-> starfishDatabaseD: slow
  starfishDatabaseD -[dotted]-> starfishServerD: slow


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

In Starfish Systems, however, the architecture is entirely different - instead of going through layers and layers of servers, the architecture is pretty much flat with domain-specific services. In this scenario, let us imagine these services all need to be called by the API Gateway to respond to the caller, but since these services are queried independently, this can be done in parallel, and the gateway responds when the slowest service sends back a response. Now, let us assume that in this scenario, the latencies are also fixed at 100ms for each message, except for the _slow_ ones - we will raise the bar for Starfish System and introduce a _slow_ service and database, each experiencing latencies of _200ms_ instead. Even then, with this particular part slowing down the entire system - we can calculate that, again, it would take _1000ms_ for the initial caller to receive a response to their initial request.

### Topology matters

When we compare the systems from the example above, they both attained their total latency of _1000ms_, though in vastly different circumstances:
- In Snake Systems, traffic goes through multiple layers of servers, while Starfish Systems mostly fans out in parallel,
- Snake Systems had the advantage of lower latencies, while Starfish Systems were slowed down by a bottleneck - twice as slow as the rest of the system,
- Snake Systems have stretched logistics - the response took _1000ms_ not because of a single bottleneck as in the case of Starfish Systems, but because the cascade of requests and responses was unavoidable with such architecture,
- If not for the _slow_ actors, which I deliberately introduced, the Starfish Systems could in fact attain better latency despite having more moving parts. Without the bottleneck, the total latency would be around _600ms_, or 40% lower than that of Snake Systems,
- Starfish Systems matched Snake Systems in terms of latency only because it could actually parallelize its communication. If this couldn't be done for any reason, and the API Gateway had to communicate with its upstreams one at a time, the situation would be far worse - with the total latency in the vicinity of _2600ms_.

Real-life distributed systems are usually a mix of all three scenarios:
- Some layering is usually involved, at the very least by means of an API gateway as an entry point to the system for external callers - such as browser and mobile apps,
- Distributed systems often consist of some mostly independent components, which can process requests, events and messages independently, allowing for a degree of parallelism,
- For distributed transactions and to implement certain business processes or customer journeys, some orchestration is typically involved - that is, one service, or orchestrator, or API Gateway needs to communicate with more than one upstream in a coordinated manner.

If preserving low latency for end users is crucial regardless of internal complexity of the task, it is worth considering if any parts of the lengthy process can be done in the background - asynchronously, without the need to keep the user waiting seconds to receive any response from the system. It is better to provide with them with an incomplete, but still useful answer early on, and let them await for the process to complete while keeping them updated somehow. One example could be responding to an online shopper that their payment is being processed, and giving them a tracker URL or sending email notification. Even though the payment could still be rejected by the bank or card provider, it is still a better user experience than watching a blank screen or an animated spinner until the payment is accepted.

{% capture latency_insight %}
Distributed systems are inherently susceptible to the negative effects of high and variable network latency. Even in settings which generally enjoy negligible latencies, abuse of network communication result in dangerous compounding that could affect overall system performance. If there is no way to limit or streamline network communication to reduce compounding, or when the latencies are inherently high and cannot be immediately addressed, introduction of asynchronous processing can be helpful to improve user experience.
{% endcapture %}
{% include key-takeaway.html content=latency_insight %}

## Security



## Summary

