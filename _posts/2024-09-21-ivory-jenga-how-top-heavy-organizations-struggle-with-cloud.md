---
layout: post
title: "Ivory Jenga - how organizations struggle with granularity"
case_study: true
jargon_heavy: true
stock: jenga
tags: 
  - "architecture"
  - "cloud"
  - "distributed-systems"
  - "microservices"
  - "case-study"
---

## Abstract

Building distributed systems is easier said than done. Putting aside the technical complexity and challenges that come with designing, developing and maintaining distributed systems, organizations need to figure out how to coordinate the efforts of their engineering teams, so that the results are delivered in finite time, at an acceptable cost, and make at least some sense for the business. This is easier said than done, and there is a reason why [Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law) is one of the more popular terms in the microservices world. Time and again, reality proves the outcomes of an organization's efforts reflect its internal structure's efficiency - or deficiency.

In this article, we will take a look at a few examples of how organizational structure and internal regulations affected how the distributed systems were being built by the engineering teams, and what effects it had on system maintainability, reliability, and efficiency.

## Department of DevOps, Division of Jenkins

{% capture departments %}
Round Plates made a strategic decision to gradually move away from on-premise delivery of their enterprise products to a SaaS platform, and even managed to onboard a number of customers to their cloud-based platform. Behind the scenes, however, the engineering teams struggled to communicate across areas of expertise, as separate departments were (officially) responsible for infrastructure and software development of the cloud platform services. As a result, a number of high-severity incidents occurred due to miscommunication between infrastructure and development, and it took weeks if not months to agree across departments on certain technical commitments. To add insult to injury, the infamous Shadow IT flourished, as it was often the only way for some teams to get their job done.
{% endcapture %}
{% include case-study-context.html content=departments %}

Anybody who has worked for a large organization with a headcount in the thousands, if not tens of thousands, has probably experienced this kind of org structure. Rather than gather the resources needed to get the job done, one needs to jump through hoops to be able to perform their tasks:
- Create a DBA ticket to provision a database for this new application,
- Spend a month's worth of e-mail threads and meetings with the Network Team to establish a connection between the new database and the servers you application is going to run on,
- Get stuck for a week because the CI/CD pipeline got misconfigured - DevOps Team misunderstood that they need to prepare a JavaScript pipeline, and now your Java application cannot be built as it needs Maven... but got NPM.

Sadly, this way of working is not only inefficient and frustrating, but also prevalent to the point it is taken for granted in the large organizations. Oftentimes, it is justified with statements such as:
> We have always worked this way

> This is a serious business, we cannot just get things done like a startup

Challenging status quo is difficult enough, and the privilege to do this is usually beyond the reach of common folks and the lower-to-middle level managers who get to experience these struggles first-hand. At the same time, the organization keeps accumulating inefficiencies:
- Everybody is perpetually stuck, with their tickets waiting in line to be handled by another division,
- Stretched feedback loops, leading to poor technical decisions not being corrected in a timely manner,
- Corporate power struggles and "big man" mindset can easily impair SDLC processes and impair delivery or maintenance of critical products.

{% capture departments_insights_siloing %}
Siloing the company's talent according to their technical specialty has tremendously negative impact on the company's logistics. If there is a single dedicated division owning a certain technical aspect of a system, be it CI/CD, databases, deployments or testing, others start lining up any time they need a certain job to be done, and this becomes a bottleneck. Moreover, power play and corporate politics start to have excessive impact on deliverables, as having good connections or being "the big man" can determine whether critical tasks will get done timely - including ours.
{% endcapture %}
{% include key-takeaway.html content=departments_insights_siloing %}

{% capture departments_insights_domains %}
As a rule of thumb, a more effective approach is to organize according to domain expertise while ensuring each domain team / department / division is as self-sufficient as feasible in the company's context. This allows to manage team capacity more effectively, as most of the communication overhead between departments can be avoided, and the communication channels that do get established between domain teams tend to be more direct and organic.
{% endcapture %}
{% include key-takeaway.html content=departments_insights_domains %}

{% capture departments_insights_platform %}
It is often helpful if an organization has a dedicated Platform Team, delivering technical enablers for domain teams - ideally on a self-service basis. This allows teams to focus on their key deliverables rather than solving common problems independently - without the need to line up with their tickets to provision a database.
{% endcapture %}
{% include key-takeaway.html content=departments_insights_platform %}