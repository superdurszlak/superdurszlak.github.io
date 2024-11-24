---
layout: post
title: "Research-driven - How spikes lay ground for projects"
highly_subjective: true
redirect_from:
  - "/intro/"
stock: library
tags: 
  - "spike"
  - "research"
  - "decision-making"
  - "system-design"
---

All but the most trivial software projects require at least some research to be done, and technical decisions to be made throughout the project's lifecycle - especially at its onset.

In some corporate cultures, technical decisions are made based on authority - the decision was made by _the big man_, such as a System Architect or a certain Manager, and thus is not to be challenged or asked about. Such decisions are frequently made in the privacy of an ivory tower, and the teams responsible for the projects rarely have a chance to learn about the _why_ part - let alone being able to speak up and bring their perspective to the table. Such authority-based arrangements often suffer from various issues:
- The decision-maker is often biased with his personal opinions, habits and prejudice, and the process gives little room for feedback, if any.
- The validity of a decision becomes tightly coupled with the decision-maker as a person, meaning that questioning a decision often hurts decision-makers ego, triggering unhealthy response to feedback.
- Since the team has not had a chance to participate in decision-making and give their input - at least openly and formally - it is quite natural for the team to be poorly aligned with the decision.
- Such arrangements create little room for innovation, inclusion and meritocracy - after all, a lower-ranking team member with relevant skills or experience probably would not get a chance to participate.

Therefore, I find it far more productive, healthy and inclusive to drive project-related decisions with thorough research, which in software engineering practice is often framed as a concept of [Spike](https://en.wikipedia.org/wiki/Spike_(software_development)). Such research helps make better-grounded decisions, while also turning decision-making into a more impersonal, team activity. In my experience, it helps with making objectively better decisions while also improving team alignment, since team members can feel included and can trace back the rationale of project decisions, especially if followed by an [Architecture Decision Record](https://adr.github.io/) referencing relevant spikes.

## What is a spike, then?

At a basic level, a spike is an activity within a software project aimed at providing input to action on later, rather than deliverables. While the details, definitions and ceremonies around spikes differ from methodology to methodology and from organization to organization, they usually aim at researching a topic, and delivering a document and/or PoC covering the research done. Following aspects are fairly typical for a spike regardless of particular software development methodology:
- Spikes tend to be time-boxed, in order to avoid getting stuck and researching indefinitely. Usually the time constraint spans from one day to several days, unless the problem at hand is critical and requires researching until resolution is found.
- In most cases, it is customary to put together a document - for instance, a Confluence or Markdown page - describing the scope and findings of a spike for future reference.
- Oftentimes, a spike is expected to include a Proof of Concept or at least documented examples of the solution being applied.
- The outputs of a spike are then used as and input for decision-making (see Architecture Decision Records) and/or to define the scope and/or constraints of work items that follow.

