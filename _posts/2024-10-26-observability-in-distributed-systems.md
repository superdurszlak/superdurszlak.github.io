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

Imagine a world where a pilot would have to fly an over 500-ton, 4-engined Airbus A380 with virtually no flight instruments, only a primitive joystick and maybe a headlight for night landings. Imagine a captain tasked with navigating a coral reef, full of underwater ridges, or sneaking underneath polar ice sheet, all the while commanding a submarine lacking a sonar and basic instruments, compass, depth indicator and a periscope. Imagine a construction equipment operator required to excavate a 400m long, 3m deep ditch - only the excavator they are manning only has a number of peepholes in solid metal cabin walls instead of proper windows.

Does any of this sound like an impossible, if not suicidal mission to you? Now, imagine we are talking not about a single airplane, a single submarine or a single piece of construction equipment - but rather a myriad of them. Tens, if not hundreds of individual airplanes, submarines and excavators working towards a common goal; All the while struggling to maintain situational awareness and get the job done without crashing into each other, or into the ground, and ideally without any collateral damage.

At this point, it might appear unimaginable, and rightly so. Unfortunately, this is more or less the reality of working with a distributed system lacking observability measures at all, or equipped with inadequate instruments. In this post, we will explore how distributed systems are commonly monitored, and how various parts of observability stack help Engineering Teams maintain situational awareness.

## What is observability?

According to [OpenTelemetry](https://opentelemetry.io/docs/concepts/observability-primer/#what-is-observability), _observability_ means an ability to gain insights about the state of a system without having to know its internal structure and details, or to analyze its internal states. In other words, any data deliberately emitted by a system could be considered part of _instrumentation_ enabling observability, when: 
* It contributes to a better understanding of how the system functions,
* The data can be accessed and processed with the purpose of analyzing the state of a system,
* It enables troubleshooting of a live system, even in the system of newly encountered problems.

The data, or signals, emitted by an instrumented system are typically divided into three distinct categories:
* Logs,
* Metrics,
* Traces.

### Logs

[Logs](https://opentelemetry.io/docs/concepts/signals/logs/) are text-based signals correlated with a timestamp at which they were emitted. They are primarily intended to be read by a human, either in raw form or after additional processing. Logs are typically written to two destinations:
* Dedicated log files,
* Standard output - `stdout` and sometimes `stderr`.

In their simplest, unstructured form, logs can be as simple as a Unix or ISO timestamp and text message:

```
[2024-10-26T09:11:34.000Z] Application starting...
[2024-10-26T09:11:34.042Z] Loading module A...
[2024-10-26T09:11:34.157Z] Module A loaded.
[2024-10-26T09:11:34.198Z] Loading module B...
[2024-10-26T09:11:34.411Z] Error: Encountered problem when loading module B: "file libfizzbuzz.so not found".
[2024-10-26T09:11:34.493Z] Error: Application failed to start.
```

This format is reasonably readable for a human, rudimentary search can be done against it e.g. with _grep_, and it generally suffices when running a single program. However, it bears very little context, depending entirely on the quality of individual log lines, and bearing no additional information. These traits could make it problematic when more sophisticated processing is required, especially when multiple threads, processes or programs are running and emitting _some_ logs, which might be related to each other. Comparing multiple unrelated log files on a single host is unwieldy enough, and doing so in a distributed system is just as frustrating as it is impractical.

Therefore, it is far more useful to use a certain log formatting approach that includes additional context to the log messages, and to enforce a certain way this context is structured for easier processing. A frequently used, though not exclusive log format is JSON log, where each individual line is a valid JSON object:

```
{ "timestamp": "2024-10-26T09:11:34.000Z", "msg": "Application starting", "level": "INFO", pid: "1253", "threadId": "main" }
{ "timestamp": "2024-10-26T09:11:34.042Z", "msg": "Loading module A", "level": "INFO", pid: "1253", "threadId": "main" }
{ "timestamp": "2024-10-26T09:11:34.157Z", "msg": "Module A loaded", "level": "INFO", pid: "1253", "threadId": "main" }
{ "timestamp": "2024-10-26T09:11:34.198Z", "msg": "Loading module B", "level": "INFO", pid: "1253", "threadId": "main" }
{ "timestamp": "2024-10-26T09:11:34.411Z", "msg": "Encountered problem when loading module B: \"file libfizzbuzz.so not found\"", "level": "ERROR", pid: "1253", "threadId": "main" }
{ "timestamp": "2024-10-26T09:11:34.493Z", "msg": "Application failed to start", "level": "INFO", pid: "ERROR", "threadId": "main" }
```

While it is far less readable for humans in a raw form, it makes bulk processing of logs, log analysis and correlation far easier - compared to unstructured logs. Enforcing a particular, consistent format makes parsing much easier, meaning that contextual information can be extracted programmatically with minimal risk of errors and mistakes. For readability reasons, it is not uncommon for distributed system components to have two modes of logging:
- Unformatted logs, used in local development to troubleshoot the component ad-hoc while running it on a local device,
- Formatted logs, to be collected and processed by dedicated log processing and analysis tools, such as Splunk or Logstash when application is deployed to environments.

