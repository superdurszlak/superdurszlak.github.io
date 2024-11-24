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
- In most cases, it is customary to put together a document - for instance, a [Confluence](https://www.atlassian.com/software/confluence) or [GitHub Docs](https://docs.github.com/en/get-started/writing-on-github) page - describing the scope and findings of a spike for future reference.
- Oftentimes, a spike is expected to include a Proof of Concept or at least documented examples of the solution being applied.
- The outputs of a spike are then used as and input for decision-making (see Architecture Decision Records) and/or to define the scope and/or constraints of work items that follow.

## Preparing for a spike

To make the best out of a spike, it is vital to be well prepared before carrying it out. One cannot just _do a spike_ without defining what is the goal of the spike, what needs to be done, and in what time frame.

### Knowledge base

Most of the organizations have at least ona destination for documentation and other reference resources. Some may have multiple - which may lead to confusion if it is not clear which should be used as the team's knowledge base. This may lead to undesirable consequences:
- Lost knowledge, as the team members struggle to find relevant documents,
- Overall confusion, as whenever a document is needed one needs to consider and/or consult which knowledge base should be referenced,
- Documents on related topic can be created independently, but never cross-referencing each other, leading to more confusion as future work could be based on either without taking the full context into consideration.

In general, it is typically practical for a team to keep a single knowledge base to serve as a destination for internal project documentation. This might mean a dedicated documentation repository, Confluence Space, a dedicated directory tree within a broader Confluence Space etc. In any case, the next step to improve structure of such knowledge base is to create a dedicated destination for spike results - oftentimes another sub-directory, nested in project knowledge base. Furthermore, to improve accessibility of such knowledge base - and spike repository - is to cross-reference it frequently, for instance to provide context for work items. This way, team members can more easily access pieces of documentation relevant to the task at hand.

### Clarify expectations

A well defined spike task includes the following elements:
- References to relevant other spikes, ADRs and documentation, to set the context for research,
- A problem statement for the spike to address,
- Expected scope, that is how broadly / deeply the research should go,
- Project constraints and evaluation criteria that need to be considered,
- Time box for this particular spike, typically expressed in days,
- Expected outputs, such as a piece of documentation, PoC, creation of action items or follow-up spikes, recommendations for the team etc.

With such inputs, a spike can be carried out efficiently, and bring tangible results that the team can action on later, or base the decisions on the research done.

### Establish the knowns and unknowns

Let us reference the famous [Rumsfeld Matrix](https://www.theuncertaintyproject.org/tools/rumsfeld-matrix) in the context of spikes and research:

|  Awareness  | Knowledge                              ||
|-------------|--------------------|--------------------|
|             | **Known**          | **Unknown**        |
| **Known**   | **Known Knowns**   | **Known Unknowns** \
|             |                    |                    \
|             | The facts and assumptions we are aware of. | The gaps we are aware of but don’t fully understand. |
| **Unknown** | **Unknown Knowns** | **Unknown Unknowns** \
|             |                    |                      \
|             | Things we don’t realize we know but could leverage. | The true surprises we don’t know exist. |

Most of the time, the goal of the spike is to improve the team's knowledge and/or awareness, especially by improving the knowledge gaps:
1. Improving awareness of _unknown unknowns_ so that they become _known unknowns_ - if the team has poor awareness with regard to the topic, it is usually more efficient to start with a spike to establish a basic understanding of the topic, establish what are the options and industry standards with regard to the subject.
2. Gathering knowledge and/or experience to turn _unknown knowns_ into _known knowns_ - once the team has built an awareness in the subject, and acknowledges its gaps, there is a room for a spike to explore a topic in-depth, gather available examples and/or prepare a PoC on how the subject could be addressed.

Generally speaking, I find spikes to be a good fit to address these two areas. With regard to _unknown knowns_, it is better handled with chores and housekeeping than with spikes, as it might indicate excessive tribal knowledge in the team and missing, outdated or poorly accessible project documentation. Addressing such issues with spikes may feel unwieldy, and may even make the situation worse if the results of the spike would suffer from accessibility issues.

In my experience, when one's starting point is in the _unknown unknowns_ quadrant, it is more practical to split the spike into stages, rather than expect to get to _known knows_ state with a single spike. Otherwise, the results may be disappointing:
- The spike may take unacceptable time to complete if the research is to be thorough.
- With time constraints, the research would be too narrow-scoped to gain a good understanding of the subject.
- The scope of such spike may be overwhelming for a person responsible for it.

Therefore, it may be a good idea to begin with a spike to provide broad research of the topic and available options, do a rough comparison, and pick the most promising candidate(s) for further research. Then, one or more spikes are needed to evaluate in depth the options picked in the first stage. The work can be split between multiple team members to improve knowledge sharing, promote inclusion and avoid overwhelming one person with all of the burden.

### Who should be responsible?

Though this is a highly opinionated statement, I firmly believe the responsibility for carrying out spikes should be shared across the team. There are multiple reasons for this:
- Being burdened with all of the project research can be exhausting. As a person who often contributed 50% or more of project-related spikes and documentation, I often felt overwhelmed after long streaks of research despite enjoying such activities.
- If only one, or very few persons are responsible for project research, it can lead to alignment issues within the team and ivory tower effects.
- It can lead to siloing, where one person builds up internal knowledge and assumptions they take for granted - and over time the documentation might miss important bits of information.
- All people are biased one way or another - if one person takes full responsibility for project research, their biases may affect the project direction in profound ways, as the person's research might become targeted at confirming the existing biases.

Having said that, it is up to the team to decide how the research work should be distributed, and whether it should be done in an organized or organic manner. The team may find it desirable to trust the most experienced team members with carrying out spikes, or use them as a growth opportunity for juniors. It is also a matter of the team's ways of working to determine if one person should pick up similar topics to become a team's [Subject Matter Expert](https://en.wikipedia.org/wiki/Subject-matter_expert), or related topics should be researched by multiple people to promote knowledge sharing.

## Carrying out a spike

Once the preparations for a spike are complete, and the spike task is picked up by somebody, the most critical part begins. There are multiple factors affecting the quality of the spike outcomes:
- How well structured and approachable the spike output is,
- How reliable the author was in terms of researching the topic,
- How insightful the outcomes are,
- Whether alternatives were taken into consideration,
- Whether the spike outputs are relevant to the spike task's scope,
- Whether the author was aware of his biases and acknowledged them,
- Whether the conclusions take both advantages and disadvantages into consideration, or are framed to promote the author's opinions.

Understandably, it is not always possible to not be opinionated beforehand about the subject, and there is always more that could be done about the research. However, it is vital to stay as neutral as feasible and let the findings drive the outcomes and conclusions, not vice versa.

### How to structure spike outcomes?

It is quite customary to write down a document covering the spike's findings, regardless of whether the spike was focused on exploring external resources, or carrying out a Proof of Concept. An approachable document structure improves readability, clarity and overall quality of the outcomes, and help maintain the flow of the document.

Over the years of carrying out spikes for various project, I have worked out a spike document structure that works well in this regard and often gets replicated as I introduce it:
1. Table of Contents,
2. Introduction, including:
  - Problem statement,
  - Objectives,
  - Constraints,
  - References to general internal and external literature.
3. Research section(s):
  - One sub-section per considered option or scenario,
  - References to specific, detailed internal and external literature,
  - References to PoC sources (if present),
  - Written description of the findings,
  - Diagrams and/or images (if relevant).
4. Conclusions:
  - Comparison of available options or considered scenarios (if present),
  - Summary of the findings,
  - Recommendations for decision-making (if needed),
  - A list of action items (if relevant).

While not fully exhaustive, this structure works reasonably well and can be applied quite flexibly to various spike subtypes. It's structure helps navigate through the document, and omit parts the reader is not interested in - not all readers have time or will to read the entire document, and thus may choose to skip the details. For a more thorough reader or reviewer, references to documentation can be helpful for a deep dive into the topic, while the document itself only summarizes each aspect.

### Introduction

Introduction sets the context for the entire spike document, providing the readers with the driving factors of a spike.

The _problem statement_ states what issue, challenge, requirement or incident led to this spike being carried out. It can describe the observations made beforehand that led to the conclusion a spike is needed. An example of a problem statement could be as follows:

> According to our metrics reports **\[dashboard link\]**, the application resource utilization has been increasing over the last 3 months, leading to more frequent crashes caused by exhausted memory. Increased frequency of crashes led to reduced availability of the application - from 99.97% in May to 99.62% in August, getting close to the agreed SLO of 99.5% weekly availability.

The _objectives_ describe what goals need to be achieved as a result of this spike, wWhat are the expected outputs, and what knowledge gaps should be filled. The objectives of a spike could be defined as follows:

> As a goal of this spike, we need to identify the root causes of increased memory utilization and come up with resolution to them, and/or with measures to prevent application availability from degrading any further.

The constraints focus what limitations does the team need to take into consideration. The spike constraints may include:
- Company policies at the time,
- Technical decisions already made,
- Project constraints such as limited headcount,
- Time constraints, such as a requirement that a resolution must be implemented within several weeks,
- Budget constraints, such as maximum licensing costs (if applicable).

In our example, the constraints could be described as:

> We estimate that at the current pace, the SLO would be breached in early October. For this reason, the resolution must be applicable within this time frame. Given the applications release schedule, the change must be ready for release before the end of September release cutoff. If root cause resolution cannot be delivered in this time frame, we need to come up with temporary measures first.

Finally, the _references_ included in the introduction part should point to resources relevant to the spike as whole, rather than specific solutions considered. Examples include:
- Links to policies,
- Cross-references to related spikes and ADRs,
- Links to relevant documentation,
- A link to the work item in the tracker that created this spike,
- Additional relevant links.

### Research section(s)

These is the part where the analytical aspect of the spike is most exposed. 

In case of a Proof of Concept, the research section would be committed to describing:
- How the PoC was set up, 
- Under what circumstances it was evaluated
- What outcomes were observed, 
- How do the outcomes compare to the baseline, if available.

In case of comparing various available options, there would be multiple sections or sub-sections dedicated to each option. In this case, the sections should include:
- References to internal and/or external documentation - ideally as close to original sources as possible,
- Brief summary of each option, describing its background and general information about it,
- Examples of how it can be applied - may include code snippets, links to external source code such as sample projects etc.

Moreover, regardless of the spike type, the research should include the following information:
- Sub-sections dedicated to how the option or PoC aligns with respective spike objectives and constraints,
- Advantages of applying the PoC or given option,
- Disadvantages of applying the PoC or given option.

The advantages and disadvantages can either be summarized in a separate sub-section, or broken up and outlined in relevant sub-sections. It is vital to consider _both_ the advantages and disadvantages of each solution - the Software Engineering industry is full of trade-offs, and the picture is almost never black-and-white. A reliable researcher should transparently and thoroughly document both pros and cons of each solution, regardless of their personal preferences and gut feelings. Otherwise, the spike outcomes could be considerably biased, and the document would raise red flags for readers and reviewers - and rightly so. 

### Conclusions

This is the closing section of a spike document, that should summarize the findings and provide guidance on the next steps.

In case of spikes exploring multiple options, it is useful to include a _comparison_ sub-section that would briefly compare the available options in each respective aspect, as well as overall. Such an information-dense summary can then be easily referenced without losing out too many details. While the format of such comparison is up to the team and/or author to decide, I find the tabular format to be particularly useful, for instance:

> Memory-related crash resolution alternatives:
>
> | Aspect / solution     | Carry out GC fine-tuning                 | Find and fix memory leaks         | Increase memory limits                             |
> |-----------------------|------------------------------------------|-----------------------------------|----------------------------------------------------|
> | Time to production    | \\+ should be doable within 1-2 weeks    | \\- likely time-consuming         | \\+ can be done in less than a day                 \
> |                       | \\- may run into unpredictable problems  | \\- difficult to estimate         | \\+ maintenance chore, can bypass release schedule |
> | Root cause resolution | \\+ improves memory management           | \\+ resolves suspected root cause | \\- does not solve the root cause                  \
> |                       | \\- does not solve suspected memory leak |                                   | \\- temporary measure only                         |

The next useful sub-section is a _summary_, briefly describing the author's conclusions considering the research findings. An example of such summary could be as follows:

> The research has shown the increase in memory utilization is likely caused by one or more memory leaks in the application, which must have been introduced shortly before May. A long-term solution would be to find and resolve such memory leaks, so that the memory utilization does not increase indefinitely. However, this activity may be time-consuming, therefore as a short-term solution it is worth considering to increase memory limits and/or fine-tune application's garbage collector.

If the spike is meant to be an input for decision-making, it is worth providing _recommendations_ for the person or team responsible for making the decision, for instance:

> Given the time constraints and possible gains, it is recommended to start with increasing memory limits by 10-25%, followed by GC fine-tuning. These efforts should secure the application's SLOs short-term. Meantime, we should investigate and resolve suspected memory limits as a long-term solution.

If the spike is expected to be followed with actions instead of input for decisions, such _action items_ should be listed, for instance:

> - [x] Increase memory limits by at least 10%;
> - [ ] Create a task to fine-tune GC to work around memory leak;
> - [ ] Create a task to find and fix memory leaks in the application;

Once the spike is concluded, these action items would often be used to create follow-up work items in a tracker, such as [Jira](https://marketplace.atlassian.com/product/jira) or [Asana](https://asana.com).

### Spike document structure example

This Markdown snippet roughly reflects the actual structure of documents I typically write down, although I find Confluence to be a more common option:

```markdown
# Spike title

* Auto-generated ToC items
* ...

# Introduction

## Problem statement

Describe what was the original problem that led to this spike

## Objectives

Describe what goals need to be achieved.

## Constraints

Describe the limitations that had to be considered in the spike.

## References

Links to relevant resources.

# Research

## Option A (B, C ...)

Include the following
* Links to resources relevant to the option
* Summary of the option

### Topic-specific subsection(s)

Describe how the option fits into the considered aspect in each sub-section.

### Advantages

Describe what are the advantages of the option.

### Disadvantages

Describe what are the disadvantages of the option.

### Examples / outcomes

If possible, provide examples of how the option can be applied, or if there is a PoC, the outcomes of it.

# Conclusions

## Comparison

Summarize the available options, their pros and cons in various aspects, e.g. in a table:

| Aspect   | Option A | Option B | ...
| -------- | -------- | -------- | ...
| Factor X | + pros   | + pros   | ...
|          | - cons   | - cons   | ...
| Factor Y | + pros   | + pros   | ...
|          | - cons   | - cons   | ...
|   ...    |   ...    |   ...    | ...

## Summary

Summarize the findings, such as:
* whether the PoC was successful 
* which options seem to be promising, and which seem to be dead ends.

## Recommendations

If needed, provide recommendations for the decision makers based on the findings.

## Action items

If needed, provide action items that should be taken as a follow up of the spike.

```

## What are the next steps?

When the active part of the spike is concluded, it is time for a spike review.

Similarly to code contributions and ADRs, spike outputs should be reviewed by the team to ensure consistent quality. Additionally, a review is a great opportunity for the team to get acknowledged with the findings. While knowledge bases rarely provide robust tooling for reviews, the generally available features should suffice, for instance:
- Inline and document comments in Confluence,
- Code review tools in case the document is checked into a git repository.

Lastly, once the spike is reviewed and closed, the spike results should actually be used by the team and decision-makers, for the commitment to be useful in the first place.

### Spike review

The primary goal of the review is to make sure the output meets the desired standards. When reviewing a spike document, or asking for a spike review, I generally expect following aspects to be considered and reviewed:
- Structure and stylistic correctness - while a spike document is not a work of art or a piece of poetry, it needs to be reasonably well written and structured for good readability, 
- Thoroughness of research - to ensure there are as few gaps and blind spots as possible,
- Relevancy of the PoC or research - it should be verified how well the analysis covers the objectives and constraints,
- Objectivity - the reviewers need to look out for biases, and call them out if they skew the outputs in a significant manner,
- Factual correctness - as mistakes, misunderstandings and human errors happen, the reviewers should proofread the outputs to look out for inconsistencies and factual errors,
- Cross-references - the document collecting spike outputs should cross-reference source documents and other relevant references, otherwise the context is partially lost, and the contents cannot be verified.

### Taking action

The value of a spike is in it's outputs usefulness for future work and decision-making. If a spike gets carried out, but then its outputs are never read or used later - it is essentially a wasted effort. Moreover, dismissing the spike outputs does not help foster a meritocratic and inclusive culture. After all, if the team's inputs are not even considered when making a decision, it says a lot about how the team's contributions are perceived and respected.

There are a few major ways the outputs of a spike can, and should be utilized:
- Creating follow-up action items, such as new development tasks, and more spikes if needed,
- Utilizing the findings as an input for decisions to be made by the team or decision-makers.

In case of follow-up action items, the outputs of the spike that created said action items should be linked to ensure the context is easily accessible. Likewise, if decisions are documented in an Architecture Decision Record, the spike that provided input for the decision should be cross-referenced for clarity and transparency.

## Summary

Spikes are a great utility to conduct research that helps drive projects to better results. If handled well by the team, they foster a more inclusive, meritocratic culture, while also improving knowledge sharing and team's alignment with decisions made. By adopting spikes and utilizing their outputs in decision-making processes, teams are able to make better informed decisions.