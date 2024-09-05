---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: post
title: "On distributed systems"
tags: 
  - "distributed systems"
  - "cloud"
  - "microservices"
---

## What are these distributed systems, after all?

Briefly speaking, a software or computer system could be considered a [distributed system](https://dictionary.cambridge.org/dictionary/english/distributed-system) as long as parts of said system run on individual devices, and at least some of them need to communicate over a network rather than via local loopback, shared memory and / or data storage.

Distributed systems distinguish themselves from regular ones with below characteristics:
- Invariably, multiple processes are involved,
- Multiple physical or virtual machines are typically involved to run the distributed system processes,
- Data and messages between at least some parts of the system need to be exchanged over a network,
- Distributed systems are generally subject to network errors and failures,
- Processes constituting a distributed systems may fail individually, as a result of software or hardware faults, or human error.

The processes involved may be in fact running the same program to share the workload, or different programs to complete various tasks of the system, and frequently both approaches are applied in conjunction. The two quite extreme ends of "distributed systems" world could be a simple mobile application with a web backend, and a complex enterprise system with hundreds, if not thousands of microservices. Likewise, a monolithic server application with multiple instances running to ensure resilience, and backed with a replicated database is quite a common, yet sometimes overlooked example of a system that is already distributed.

### Mobile application example

In case of a mobile application, the system is distributed because the app communicates with its backend over a network. The backend server continues to serve traffic to other users even when one of them experiences an application crash, and it is not uncommon for mobile applications to offer limited functionality in offline mode or when the server is down.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype ortho

actor UserA as "User A"
agent AppA as "Mobile Application"
actor UserB as "User B"
node Server as "Backend Server"
agent AppB as "Mobile Application"

AppA --[dashed]-> Server : "gRPC request"
AppB --[#Red;dashed]-> Server : "failed gRPC request"
UserA -- AppA : "uses"
UserB -- AppB : "uses"
Server -[dashed]--> AppA : "response"
```

### Microservices example

A system in which hundreds of microservices are involved is rather self-explanatory. In such systems, each microservice is expected to have its distinct responsibility (though duplication happens) and typically has more than one instance running at a time to increase its availability. To further increase resilience and to ensure sufficient computing resources for such a system, they usually run on multiple servers and operating systems - either directly, on virtual machines or in an orchestrated environment, such as Kubernetes.

```plantuml!
!theme mono
skinparam linetype ortho

cloud "Kubernetes" {
  together {
    frame resources as "Resources" {
      frame namespaceA as "Namespace A" {
        collections microserviceA as "Microservice A"
        agent daemonA as "Service Mesh Daemon"
        database databaseA as "Database A"
        microserviceA <-r[dashed]-> daemonA
        microserviceA -d[dashed]-> databaseA
      }
      frame namespaceZ as "Namespace Z" {
        collections microserviceZ as "Microservice Z"
        agent daemonZ as "Service Mesh Daemon"
        database databaseZ as "Database Z"
        queue queueZ as "Queue Z"
        microserviceZ <-r[dashed]-> daemonZ
        microserviceZ <-d[dashed]- queueZ
        microserviceZ -d[dashed]-> databaseZ
      }
    }
    frame nodes as "Nodes" {
      node VM1 as "Worker Node"
      node VM2 as "Worker Node"
      node VM3 as "GPU Accelerated Worker Node"
      node CP as "Control Plane"
      VM1 -r[hidden] VM2
      VM2 -r[hidden] VM3
      VM3 -r[hidden] CP
    }
    resources --d[hidden]-- nodes
  }
}
```

### Replicated / sharded monolith example

When a monolithic application has multiple instances, its individual processes can only exchange information via shared state in a database (or distributed cache for that matter) or by exchanging messages (such as events via message broker, or HTTP requests, or RPC calls) which almost invariably are accessed over a network; Likewise, if a database is replicated, any changes made to one of its instances (leader in case of single- / multi-leader DBs, or node in case of leaderless ones) need to be propagated to the remaining instances before they become aware of the change.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype polyline

collections external as "External applications"

rectangle monolith as "Monolithic application" {
  node LB as "Reverse Proxy"
  together {
    collections appShardA as "Countries A-K"
    collections appShardB as "Countries L-R"
    collections appShardC as "Countries S-Z"
  }
  together {
    database dbShardA as "Countries A-K"
    database dbShardB as "Countries L-R"
    database dbShardC as "Countries S-Z"
  }
}

external <-d[dashed]-> monolith
appShardA -d[dashed]-> dbShardA
appShardB -d[dashed]-> dbShardB
appShardC -d[dashed]-> dbShardC
LB <-[dashed]-> appShardA
LB <-d[dashed]-> appShardB
LB <-[dashed]-> appShardC
```

## Why would anyone need them?

Distributed systems can be immensely useful in multiple scenarios, not necessarily limited to Big Tech companies serving millions of users at any time of the year:
- To improve reliability of your system,
- To better (i.e. faster) serve your customers across the globe,
- To hot-swap software and hardware components of your system without affecting the bulk of it,
- To distribute workload across more hardware resources,
- To loosen the coupling between software built by various teams in your organization,
- To handle tasks too large and complex for a single computer.

### Reliability improvements

One of the core strengths of a distributed system is that it can be made more tolerant to hard / catastrophic faults than a monolithic, single-process system, for a number of reasons:
- Typically, a distributed system runs on multiple physical devices connected over a network. Thanks to strategies such as replication, a system can be built so that it continues to operate even if a certain fraction of its resources are unavailable - for instance, due to a hardware failure or a blackout in a particular location,
- Since various software components of a system run as independent processes, if one of them runs out of memory and crashes or experiences a failed deployment, it is often possible for the healthy components to continue serving their purpose. This stands in contract to a system running in a single process - if that single process crashes, it invariably brings down the entire system,
- On top of these qualities, further improvements can be made to avoid escalation of faults experienced by the system - for example, by introducing asynchronous communication between processes, circuit breaking and retry semantics

### Serving your customers better

There is a number of customer experience improvements which, while not impossible to introduce without distributed systems, becomes arguably easier if one can run arbitrary number of software components and processes in a system:
- Zero-downtime maintenance - while not impossible to do when you simply run a program on a particular server, it is rather challenging to perform maintenance and upgrades without a maintenance window and shutting down your services in such scenario, often requiring your infrastructure team to invest in particular hardware, and your engineering department to develop the software in specific way, leading to tremendous organizational overheads and convoluted processes with paperback failsafe. For the same reasons why distributed systems can be made more fault-tolerant, with the right set of engineering choices they can also become maintenance-tolerant.
- If you run an online business and serve your customers from remote locations, or rely on particular back-office software that needs to be accessible from multiple offices, it becomes challenging to ensure similar Quality of Services across locations, as network latency across the ocean could become an issue. Setting up servers in all locations and running the software independently may be an option - but long-term it would become a maintenance nightmare to handle, and may prevent you from making the best use out of it. This is where connecting them to create a distributed system could shine - as it enables you to serve customers from a secondary location as a backup to the default one, and if done transparently - does not require your staff to reason about multiple systems when performing maintenance or creating reports for you, and so on.
- It becomes somewhat easier to perform an A/B test and see which version of a feature works best for your customers, if it boils down to simply running different versions of your software as separate processes, rather than implement the logic of routing a customer to a different variant of a software module every time you need to A/B test your features. Routing is one of the core concepts in networks, after all, and network is in turn the nervous system of every distributed system.

### Workload distribution

In some cases, your systems handle significant loads - perhaps serving thousands or millions of customers at any given time, or processing plenty of batch jobs for your back-office reporting and such - to the point they might grind to a halt, or the batch jobs would be scheduled weeks ahead, becoming a bottleneck for your organization. The workload may be fairly constant, or subject to substantial changes over time. The nature of distributed systems allows to address these situations:
- Leveraging replication and/or sharding to spread your workload across multiple servers - each individual instance would be dealing with a more manageable workload, leading to improved experience of your customers and/or staff.
- Scaling your system - if your system is capable of functioning properly with 3, 5, or 20 instances, why not adjust the exact number over time, responding to the workload changes? Depending on the dynamics of these changes, you may prefer to adjust the number of replicas in anticipation of your Christmas spike or make your system scale automatically, assuming you can provision hardware resources as needed - this is where cloud-based solutions and orchestration become invaluable. It is considerably easier to implement with replication than with sharding, yet even the latter is arguably more practical than upgrading / downgrading CPUs or swapping RAM dies in your servers every so often.
- Some individual tasks are simply too large to run on a single computer, as there is simply no CPU / GPU in existence to complete it in acceptable time, or there is not enough memory to fit all the data. An answer to this is proven divide-and-conquer - breaking the problem into smaller ones, solving them individually on separate devices, and aggregating the partial results. While rare in case of web applications, this use case is particularly common in the world of scientific research - if you run complex simulations of a physical process or protein folding, you would likely find yourself running it on dozens, if not thousands of server nodes.

### Loose coupling

If the dependencies between your teams boil down to binaries or lines of source code, it becomes painstaking to roll out changes, to synchronize them, and to prevent these changes from turning into one merge conflict after another. Big, complex, monolithic systems are notorious for having outdated dependencies and language versions, and applying even the simplest changes could easily take months of back-and-forth between dozens, if not hundreds of engineers.

While distributed systems do not solve the problem of dependencies between the teams as such, the fact software components communicate over the network rather than direct function / method invocations or shared memory makes it arguably easier for teams to operate on higher-level contracts, such as API definitions or event schemas. This way, the teams would be less likely to get in each other's way, and by less destructive means. On the other hand, solutions such as contract testing and schema registries can be leveraged as a failsafe in case of human error and breaking the contracts.


### Should you always go for a distributed system?

Same question could be applied to vehicles:
> Should you always go everywhere by train?

At this point, you might be thinking it's a ridiculous question. After all, it depends on multiple factors:
- What is your budget?
- How far is it?
- Do you need to make any stops in between?
- When do you want to get there?
- Who is traveling with you?
- Are you carrying any luggage or cargo? How much?
- Is there a railway in the first place?

Depending on these (and other factors), you may figure the train is the fact the optimal option. On the other hand, if your destination is thousands of kilometers away, it may be more beneficial to book a flight, and in some remote areas your only choices could be, say, a boat or an off-road vehicle.

This rule applies to distributed systems as well - despite their unique strengths, they are only practical as long as the benefits outweigh the drawbacks. To make the decision even more challenging, there is no single flavour or architecture for such systems - even in these few examples, we have seen quite diverse approach to building them, sometimes without even realizing the system is distributed. Making the right architecture choices when designing one can bring your software systems to another level of _best-in-class_ - while questionable, if not outright uninformed decisions may have devastating effects on your system.

## Why would anyone avoid them?

I am far from advertising this particular kind of software systems as a silver bullet or a cure to all diseases. While distributed systems may be immensely powerful in certain scenarios, there are countless way things can go wrong when you build one - and quite literally:
- Since there is not a single recipe for a successful distributed system, it is remarkably easy to make wrong choices and design decisions,
- Building reliable, distributed systems can be done, but it is difficult, both conceptually and organizationally, A company that struggles to establish efficient communication
- Running distributed systems can be costly - and in case of public cloud, sky is the limit,
- Their operation depends on network communication, which is notoriously unreliable,
- They introduce a whole new class of problems and faults not seen in non-distributed systems,
- In some scenarios, they are simply impractical.

### Ease of making mistakes

As an Engineering Director, Architect, or Software Engineer, you might not necessarily know what you are doing when first adopting distributed systems, such as when your organization decides to pivot towards the all-famous Cloud Transformation. Conversely, you may have solid prior experience and still run into wrong decisions due to outdated or inaccurate information - or even make decisions before gathering critical inputs which, as unthinkable as it seems, does happen. The consulting company you hired to walk you through your transformation may provide recommendations optimized for their revenue, rather than your needs. The infrastructure team may be to comfortable to their labour-intensive ways of working - it could have worked fine while they still maintained a number of servers in that infamous Room 503, Floor B, only to turn out to result in increasingly sluggish and error-prone processes as the infrastructure for your system grows. Your Software Engineers or Architects might insist on building an in-house solution for everything, rather than following industry standards and proven components.

The bitter truth is - any software architecture, distributed pattern or toolkit might work great for one class of problems, while proving detrimental for others. Every orchestration solution - or lack thereof - would have its evangelists and adversaries, and so does public cloud, private cloud, and running your systems on VMs or bare-metal. The key is to make well-informed decisions and evaluate the risks before it's too late.

### Difficulty of designing the system

Consider a classic, sequential algorithm or system. Unless it is based on (pseudo-) randomness, most of the time it is going to have plenty of useful characteristics:
- Its computational and memory complexity can be estimated and somewhat reliably expressed in terms of CPU, RAM, disk usage as a function of the input's size, and they are fairly constant once set up,
- Unless a cosmic ray flips a bit in your memory, or you plug off your computer, you can anticipate a finite number of edge cases, and either handle them or decide to abort,
- Even in case you did not test the software properly, it is still possible - and usually not too difficult - to attach a debugger to your software and reproduce the bug,
- As complex as your software program may get, you still need to only consider the complexity of the program itself, since the program you run is quite linear and is supplied with "some" computer to run on, big or small,
- All the storage media it is typically dealing with, be it RAM or disk space, can be considered fairly reliable, and in case they fail - most of the time you would know.

Unfortunately, the above does not necessarily hold true for distributed systems:
- Apart from computational or memory complexity, you need to consider communication complexity - which is expressed not only in terms of the number of messages exchanged, but also their size, which is not necessarily uniform, and is affected by characteristics of your network and system - throughput, reliability, topology to name a few,
- The number of ways things can go wrong is practically infinite - the message may get lost, or duplicated, or hijacked, or forged, or the recipient processes it - but their response is subject to the same risks the original message was. On top of that, the recipient might crash in the midst of processing the message for related or unrelated reasons. As you can see, attempting to handle all of the possible edge cases in a case-by-case manner is not even feasible,
- As you can probably imagine, reproducing bugs and debugging software that has multiple concurrent processes on various servers may be painstakingly difficult - even more so if the system is not tested properly,
- On top of the complexity of the software itself, you now need to consider aspects such as the layout of your infrastructure - running your systems on hundreds of low-end servers is a whole different story than having a few powerful ones at hand, even if nominally they have the same total computing power and memory available,
- You cannot always trust all the data you are seeing, since it may be out of sync if not outright corrupted - though, frankly, only some copies of it... There is a good reason why terms like _byzantine problems_ and _consensus_ are widespread in distributed systems world,
- Various servers may have their clocks out of sync and in different time zones, even with clock synchronization in place - remember, it all takes place over a network. Without a consistent time, you cannot even reliably tell what was the order of certain events that took place in your system - hence the terms like `causal ordering`, `total ordering`, `Lamport timestamps`, `logical clocks` etc. There is a whole [PACELC theorem](https://en.wikipedia.org/wiki/PACELC_theorem) on the possible behaviors and trade-offs in a distributed system in the face of network unreliability, and especially network partitioning.

### Costs

As you can imagine, if running an application once has a certain cost - monetary, operational or in terms of electricity usage - the cost of running it as multiple processes on multiple servers is likely going to cost more. This is particularly true when dealing with public vendors - on one hand, you do not need to provision your own infrastructure and manage data center(s), though on the other - the vendor is invariably going to add their margin for services and resources they provide to you.

It can become particularly harmful when combined with unlimited scalability and/or lack of a failsafe such as rate limiting - since the vendor does not really know whether your resource demands have exploded because your business is booming, or because you made a terrible software bug or misconfigured your cloud resources - if your resource usage grows beyond control, so do your bills.

### New classes of problems

As pointed out earlier, in classic programs - unless dealing with truly mission-critical programs, like ICBM, self-driving car or spacecraft firmware - you can reasonably assume the hardware it runs on is reliable given appropriate investment (e.g. in RAID disk matrices or ECC memory dies), so that you rarely need to address inconsistency. And even if you do, most of the time the program is sequential and linear, and there is a single source of truth - hence, inconsistencies tend to be... rather consistent.

The distributed systems world is entirely different, though. Regardless of how reliable individual software and hardware components are, network is inherently unreliable, and guarantees are given by network protocols on a best-effort basis. There be partial failures and intermittent errors manifesting themselves as odd glitches and bugs rather than full-fledged crashes and hard failures, temporarily or permanently. Your data may be kept in multiple copies on various devices, so you can no longer trust in a single source of truth, and keeping all of the data in sync invariably gives a headache. In simpler systems, where the `distributed` adjective applies simply because the server and the database run on separate hardware, this problem can be (mostly) addressed by transactions, however this will come at a cost - stronger consistency guarantees of a database tend to come with a throughput penalty, and opting for weaker guarantees might ensure data consistency within a transaction, but not necessarily between two independent transactions. If you are dealing with multiple sources of truth, you can no longer rely on enforcing consistency with database transactions - since every individual database is going to have its own one, committed independently in some particular order - assuming you only use databases, and only ones supporting ACID transactions, that is. With distributed systems, it is still possible to ensure at least the infamous `eventual consistency` or, better, `read-your-writes consistency`, which are significantly weaker guarantees and allow at least some intermittent inconsistencies in the system. Rather than transactions, however, you might expect to see terms such as `event sourcing`, `sagas`, `transactional outboxes` or perhaps `2-phase commit` - a great explanation can be found in [Thorben Janssen's article on dual write problem](https://thorben-janssen.com/dual-writes/).

### Using a sledgehammer to crack a nut

A special case of applying distributed systems in a detrimental manner, and a great example of over-engineering, is to build an excessively complex solution to deal with a rather simple problem - deciding to build microservices before even defining the non-functional requirements for a system is a hallmark sign, to the point it became a meme in my environment and has created quite a few of microservices' opponents.

This is not to say microservices or complex systems in general are a bad thing - the point is rather that in the world of distributed systems, over- and under-engineering can be equally destructive for the system and the organization behind it. Remember that system architecture resembles a living being more than a set of diagrams set in stone tablets. What works well today may need to change in two years, and what is likely to be a must-have in two years is likely not suitable just now - thus, it is more beneficial to think of the distributed system architecture as dynamic and evolving over time. Instead of investing in designs for grand architecture to handle it all, consider addressing these basic principles in your architecture:
- Focus on suitability for current circumstances - technical, organizational and business alike,
- Retain an ability to adapt, evolve and build on top of it as the needs change over time,
- Do not rush decisions that are not urgent, and could be difficult to undo if proven wrong.

### Can / Should they be avoided at all?

Well, yes and no. Given that these days most web applications, and a good part of mobile applications could be considered a distributed system, even if basic, your best bet would be to withdraw from any online activity.

Rather than taking an all-or-nothing approach or perceiving this question in black-and-white, it is best to apply common sense and do prior research:
- What benefits do we expect, if we consider building a distributed system?
- Do we have know-how required to build this kind of system?
- What kind of trade-offs can we afford, if needs be?
- Can we start small and build it gradually, or does it require us to make abrupt changes, rewrites and big-bang approach?
- What system architecture would best suit our needs? Do I really need to adopt these "Microservices"?
- Are our processes and communication streamlined enough to build software and infrastructure at a sufficient pace?
- Do we have tools at hand to build and maintain this kind of systems efficiently?
- Can my organization afford this financially?

## Summary

Distributed systems are an immensely diverse and powerful class of software systems, which come in countless flavours and may help you address a variety of business and technical challenges. That being said, they need to be designed and built with caution and in a way that leverages their strengths while diminishing drawbacks.
