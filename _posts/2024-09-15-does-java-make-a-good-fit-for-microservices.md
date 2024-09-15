---
layout: post
title: "Does Java make a good fit for microservices?"
jargon_heavy: true
tags: 
  - "java"
  - "efficiency"
  - "microservices"
---

## Abstract

In my experience, large companies tend to base their Cloud Transformation efforts on several foundations:
- Java applications as a go-to for backend systems,
- Building backend systems in microservices architecture - whether they are truly micro-, or rather macro- or nano- is another topic,
- Re-purposing their Java developers talent pool if available, or hiring new Java developers instead,
- Delegating system design to Software Architects and Software Engineers who might not necessarily have prior cloud or microservices experience.

In this article, I will attempt to answer the fundamental question - is Java and its ecosystem truly a good fit for microservices, and what could make it better at it? Let us take a look at various aspects of Java and see which act as advantages, and which could be considered its downsides in the context of building microservices architectures.

## Talent pool

I will start with the most obvious - and already mentioned - reason that makes Java an often default choice for building microservices-based applications. According to [2024 StackOverflow survey](https://survey.stackoverflow.co/2024/technology#most-popular-technologies-language-prof), Java remains one of the most popular programming languages, comparable to C#. 

While there are a few that outpaced Java quite significantly - most notably JavaScript, Python and TypeScript - they serve far more purposes in the industry than developing backend servers. Namely, JS and TS are popular with frontend and mobile applications, while Python is immensely popular in Data Science and Machine Learning domains. Meanwhile, Java was mostly phased out from mobile applications in favour of Kotlin, and backend systems appear to be its leading niche as of now.

Moreover, quite a few big, enterprise systems of the olden days had historically been written in Java, and it is not too difficult for companies running them to now adopt new architecture while retaining their leading language. On a more light-hearted note, it is also way easier to find throngs of Java developers with multiple years, if not decades already, of Java experience under their belts - which happens to make hiring easier.

{% capture talent_pool_insight %}
As one of the most popular programming languages for backend, Java comes with a numerous talent pool only matched by a few others.
{% endcapture %}
{% include key-takeaway.html content=talent_pool_insight %}

## Community support

Whether we like Java as a programming language or not - personally I do not, and I could go on ranting its design decisions - humongous Java community goes hand in hand with its large talent pool. As problematic and quirky as it sometimes gets, most problems you may run into when adopting Java microservices has probably been addressed by someone, somewhere, and it had been covered in a number of Github issues, StackOverflow threads, official project documentation or Medium articles.

Large community also means that the leading projects - be it Spring Boot, AWS integrations, Kafka integrations, and others - tend to be at least reasonably well documented, and attract enough attention to not be abandoned and forgotten randomly. If it takes a large company several years to make a strategic decision to pivot towards microservices and cloud, and then this Cloud Transformation is going to take another couple of years at the very best - this sense of stability is an important factor when making decisions.

{% capture community_support_insight %}
Large community and long-running, stable projects provide large organizations with a sense of stability that cannot be ensured by more niche tech stacks, regardless of their technical advantages.
{% endcapture %}
{% include key-takeaway.html content=community_support_insight %}

## Efficiency

This is where we start to tread on shaky ground. On one hand, there are research papers [on energy efficiency of programming languages](https://greenlab.di.uminho.pt/wp-content/uploads/2017/09/paperSLE.pdf) which indicate Java is among the most energy efficient programming languages out there, beaten only by a number of languages compiled to binary executables directly - unsurprisingly, the likes of C, Fortran and C++. On the other hand, however, there is a number of reasons why this way of comparing language efficiency may not be fully applicable to microservices:
- Most importantly, microservices are typically demanding in terms of I/O operations - most notably over the network - but not necessarily demanding in terms of computing power,
- The benchmarks seem to be mostly based on computational tasks, which allow to easily measure energy used to solve a task at hand, an approach that tends to strain the most power-hungry component of each computer - the CPU,
- Such algorithmic tasks rarely need to use much beyond the standard library, or perhaps a few optimized open-source libraries - on the other hand, Java backend applications typically run on IoC frameworks that generally tend to do a lot _under the hood_, and not always in an efficient manner,
- Being energy efficient in the sense of using few CPU cycles to get the job done is only one of the aspects, and the other is utilizing available resources evenly. A language such as Java may not abuse the CPU considerable when running backend servers, but on the other hand memory requirements are typically high.

That being said, let us focus on the most problematic aspects of Java backend applications - the memory usage and startup times.

### Excessive memory usage

Java, and especially Spring / Spring Boot applications are notorious for memory consumptions, to the point tinkering with JVM memory flags and ability to keep a Java application running and not crashing due to `OutOfMemoryError` can become a job for life by itself. And the most problematic aspect is that you can hardly avoid it when building Java backend applications with an IoC container - in my experience, a small Spring Boot microservice at the onset of its development can easily use 500MB of RAM, and this value only goes up as the microservice grows bigger in terms of both codebase and its dependencies - and soon enough its memory demands may easily grow to 700MB, then 1GB, then 1.5-2GB of RAM, depending on how big it gets and what kind of workloads it handles. By comparison, similarly loaded Micronaut microservices tended to utilize between 400-650MB of RAM.

The excessiveness of Java applications' memory requirements become even more apparent when compared with CPU utilization - which usually happens to be at the lower end. For services handling low traffic - on the order of 10-100 req/s - I already grew used to seeing CPU utilization at approximately 0.5-2% of a single CPU core, at least after application startup. The problem is, this is completely out of proportion if compared of what computer hardware typically has to offer - that is, between 1-8GB of RAM per CPU core. What it means is that the server running as a Kubernetes node and hosting a number of Java containers would start running out of memory long before its CPU becomes even moderately loaded!

To make matters worse, JVM defaults do not typically encourage utilizing available memory to their fullest - putting aside the intricacies of how exactly te default value depends on available hardware, the rule of thumb is [heap size is capped at 25% of available RAM](https://docs.oracle.com/en/java/javase/21/gctuning/ergonomics.html#GUID-DA88B6A6-AF89-4423-95A6-BBCBD9FAE781). This might have made sense when Java server applications ran on desktops or alongside other software on the same server or virtual machine, however it becomes problematic when used with containers. As you can imagine, if your containerized K8s Deployment has memory limits set at 2GB per pod, what it means that the Java application would allocate at most 500MB for its heap, if the default behavior is not explicitly overridden. As a result, one of the first things I do when containerizing a Java application is to add `-XX:MaxRAMPercentage=90.0` or similar line to the startup command.

### Startup times and inconsistent CPU usage

Application startup times are another problematic aspect of Java applications - to the point entire projects are devoted to improve on this, among other issues: [GraalVM Native Image as an example](https://blogs.oracle.com/javamagazine/post/pedal-to-the-metal-high-performance-java-with-graalvm-native-image). While this shows reasonable performance can be attained with Java, the typical Java Microservice reality is rather disappointing:
- You bootstrap a Spring Boot app, it starts within 5s, maybe 2s on a good day - after all, it has all the runtime context to set up.
- As your team keeps working on your microservice, the startup time grows to 10-20s - there is so much more runtime stuff to be set up by Spring...
- You notice the problem and start tinkering - to fine-tune embedded server or swap it with a more lightweight alternative, remove excessive dependencies and beans and such. After some time, you bring down the startup time to 5-10s.

The problem with this feat of Spring Boot microservices is at least twofold. It generates a tremendous CPU spike at the application start - it would easily consume a full 1 CPU core for a few seconds, compared to that mere 1-2% it otherwise needs. If you cut on CPU allocation, the startup time becomes longer, sometimes to the point it becomes problematic. I have seen cases where this led to infinite restarts as the Java server did not start serving traffic before Kubernetes killed the pod for not satisfying liveness probe for too long. What is worse, this problem can easily snowball in case of a major outage, when multiple pods need to restart around the same time. Another factor is that longer startup time slows down all the operations, including:
- Application deployments,
- Application (auto)scaling,
- Disaster recovery.

### Wasteful defaults

First of all, Spring / Spring Boot remains the most popular Java backend framework [according to JetBrains 2023 survey](https://www.jetbrains.com/lp/devecosystem-2023/java/) with 72% of responders reporting usage of Spring Boot alone. At the same time, the most popular _lightweight_ Java framework is Quarkus at merely 4%, while Micronaut is used by 2%. At the same time, Spring happens to have been benchmarked as one of the least efficient Java frameworks by [TechEmpower Web Framework Benchmarks 2023](https://www.techempower.com/benchmarks/#hw=ph&test=composite&section=data-r22&l=zik0vz-cn3), attaining a rather disappointing score of **18.6%** and earning 88th rank among all the benchmarked frameworks in all languages. To give a perspective, Micronaut and Quarkus performed significantly better - Micronaut ranked 40th at **44%**, and Quarkus beats it by a hair at 38th rank and a score of **45%** - both are approximately **2.5 times higher** than that of Spring. To add insult to injury, the most performant and at least somewhat recognizable (for an anglophone, at least) Java Framework turned out to be Vert.x at 7th rank and a score of **84.7%** - almost twice as high as Micronaut and Quarkus, and a staggering **4.6 times higher** than Spring.

What it means is that while Java (or JVM overall) microservices definitely *can* be made more efficient, most of the time they *don't*. Perhaps for similar reasons why companies chose Java in the first place, they then pick Spring / Spring Boot as their go-to microservices framework, and the more efficient ones remain a curiosity for most.

The efficiency problems are [gradually addressed with newer JDK versions](https://kstefanj.github.io/2023/12/13/jdk-21-the-gcs-keep-getting-better.html), and unfortunately the _industry default_ disappoints us again. As of 2023 Jetbrains survey, Java 8 remained as the most popular Java version, exceeding the popularity of other LTS versions available at the time - Java 17 released in 2021, and Java 11 released in 2018.

{% capture efficiency_insight %}
In general, while Java at its core is remarkably efficient for a language running on a virtual machine, the same cannot be said about the staple framework used for backend server development. Spring, due to its complexity and the tendency to do things at runtime rather than compile-time is simply too wasteful to build efficient microservices. It remains a go-to choice for the companies, however, most likely for reasons similar to why Java is being chosen in the first place.
{% endcapture %}
{% include key-takeaway.html content=efficiency_insight %}

## Developers mindset

Simply put, microservices architecture calls for certain ways of working to be able to deliver them reliably and efficiently:
- Agile development and delivering small, frequent increments rather than big chunks of changes,
- Being able to deliver microservices as _truly_ independent deployment units, with their deployments to be carried out arbitrarily,
- At this scale, human error is unavoidable, and manual tasks become a bottleneck, hence the processes need to be automated as much as feasible,
- Microservices landscape is inherently dynamic as new services are being onboarded and the deprecated ones decommissioned, and the system architecture needs to embrace this dynamism.

Chris Richardson wrote a great article on [Microservices adoption anti-patterns](https://microservices.io/microservices/antipatterns/-/the/series/2019/06/18/microservices-adoption-antipatterns.html) that I often refer to in technical discussions about how microservices should (not) be done.

Unfortunately, many Java Developers and Software Architects coming from the enterprise Java background come with an entirely different mindset:
- Deliverables are planned in terms of bi-weekly, monthly, if not quarterly release trains, and multiple changes piggyback on each train that leaves the station,
- Such big, combined changes releases at a fixed time lead to a plethora of mutual dependencies between microservices in the system, to the point they must be deployed in a very particular order to avoid the system from experiencing an outage,
- The SDLC relies heavily on manual labour, checks, processes and paperwork, with little room for automation,
- The architecture is often decided at the start of the project, and changing the design decisions may become difficult if not possible, not necessarily for technical reasons.

Even though this is gradually changing as more and more companies adopt microservices and (hopefully) learn from their mistakes, I consider it somewhat symptomatic that despite microservices are likely far beyond their _early adopters_ stage and should have reached their maturity, this enterprise, labour-intensive and inelastic mindset remains quite prevalent.

{% capture developers_mindset %}
In general, while Java at its core is remarkably efficient for a language running on a virtual machine, the same cannot be said about the staple framework used for backend server development. Spring, due to its complexity and the tendency to do things at runtime rather than compile-time is simply too wasteful to build efficient microservices. It remains a go-to choice for the companies, however, most likely for reasons similar to why Java is being chosen in the first place.
{% endcapture %}
{% include key-takeaway.html content=developers_mindset %}

## Summary

Long story short, immense popularity of Java, combined with its plentiful integrations and other resources, as well as noteworthy nominal performance could make it a great go-to solution for microservices. Unfortunately, other factors associated with Java ecosystem prove to be strongly disadvantageous in terms of microservices architecture - most notably, resource-intensive mainstream frameworks and inefficient ways of working carried over from previous generations of enterprise software and development processes.

In order to take full advantage of possible strenghts of Java - or JVM in broader terms - an organization would need to step out of its comfort zone and adopt rather niche technology stack that are not as extensively supported - such as Micronaut, Quarkus, Vert.x and/or GraalVM. This, in turn, makes the choice of a mainstream language for the sake of its sheer popularity rather questionable - as similar, if not better results could be attained with a mainstream framework of a less popular, better optimized language.