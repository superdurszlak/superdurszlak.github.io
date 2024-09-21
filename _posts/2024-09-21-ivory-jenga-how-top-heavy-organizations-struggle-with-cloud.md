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
Round Plates made a strategic decision to gradually move away from on-premise delivery of their enterprise products to a SaaS platform, and even managed to onboard a number of customers to their cloud-based platform. Behind the scenes, however, the engineering teams struggled to communicate across areas of expertise, as separate departments were (officially) responsible for infrastructure and software development of the cloud platform services. As a result, a number of high-severity incidents occurred due to miscommunication between infrastructure and development, and it took weeks if not months to agree across departments on certain technical commitments. To add insult to injury, the infamous Shadow IT flourished, as it was often the only way for some teams to get their job done - including ours. In one case delivery of a product to one of the major customers could get blocked for months, as the infrastructure team did not have capacity for us at all <b>in the next half year.</b> 
{% endcapture %}
{% include case-study-context.html content=departments %}

Anybody who has worked for a large organization with a headcount in the thousands, if not tens of thousands, has probably experienced this kind of org structure. Rather than gather the resources needed to get the job done, one needs to jump through hoops to be able to perform their tasks:
- Create a DBA ticket to provision a database for this new application,
- Spend a month's worth of e-mail threads and meetings with the Network Team to establish a connection between the new database and the servers you application is going to run on,
- Get stuck for a week because the CI/CD pipeline got misconfigured - DevOps Team misunderstood that they need to prepare a JavaScript pipeline, and now your Java application cannot be built as it needs Maven... but got NPM.

Sadly, this way of working is not only inefficient and frustrating, but also prevalent to the point it is taken for granted in the large organizations. Oftentimes, it is justified with statements such as:
> We have always worked this way, you have to get used to this

> This is a serious business, we cannot just get things done like a startup

Challenging status quo is difficult enough, and the privilege to do this is usually beyond the reach of common folks and the lower-to-middle level managers who get to experience these struggles first-hand. At the same time, the organization keeps accumulating inefficiencies:
- Everybody is perpetually stuck, with their tickets waiting in line to be handled by another division,
- Stretched feedback loops, leading to poor technical decisions not being corrected in a timely manner,
- Corporate power struggles and "big man" mindset can easily impair SDLC processes and impair delivery or maintenance of critical products,
- In extreme cases, customers can be lost due to dissatisfaction with the time-to-delivery and/or Quality of Service the organization is able to provide.

### Everyone is waiting for each other

The mutual dependencies between such tech-oriented departments tend to run in all directions:
- Development team needs QA team to sign off their changes for production deployments,
- DBA team reaches out to Development team to update database connections configuration, as they plan to migrate to a more scalable DB cluster and decomission the legacy one,
- QA team chases Development team as the latest changes slowed down the application significantly, and now Development team must sync with DBA team to improve indexes on tables,
- Security team approaches Development team to patch security updates, however this requires alignment with QA and DBA teams because other deliverables are already underway, and there is no easy way to roll out a simple library version bump with so much work already piled up.

{% capture departments_insights_siloing %}
Siloing the company's talent according to their technical specialty has tremendously negative impact on the company's logistics. If there is a single dedicated division owning a certain technical aspect of a system, be it CI/CD, databases, deployments or testing, others start lining up any time they need a certain job to be done, and this becomes a bottleneck. Moreover, power play and corporate politics start to have excessive impact on deliverables, as having good connections or being "the big man" can determine whether critical tasks will get done timely.
{% endcapture %}
{% include key-takeaway.html content=departments_insights_siloing %}

### Ineffective communication

Imagine a hierarchical, siloed org structure where a particular Development Team needs Infrastrucure Team to help:

```plantuml!
!theme mono
top to bottom direction
skinparam linetype polyline

agent DevTeam as "Development Team"
agent InfraTeam as "Infrastructure Team"

actor DevEM as "Line Manager"
actor DevMM as "Middle Manager"
actor DevDD as "Development Director"
actor Director as "Director of Engineering"

actor InfraEM as "Line Manager"
actor InfraMM as "Middle Manager"
actor InfraDD as "Infrastructure Director"

DevTeam -u-> DevEM: reports to
DevEM -u-> DevMM: reports to
DevMM -u-> DevDD: reports to
DevDD -u-> Director: reports to

InfraTeam -u-> InfraEM: reports to
InfraEM -u-> InfraMM: reports to
InfraMM -u-> InfraDD: reports to
InfraDD -u-> Director: reports to

DevTeam --r[dashed]--> InfraTeam: asks for help
```

Unfortunately for the Development Team, it is not the only one that reaches out to Infrastructure to get something done for them. There is a number of things, then, that often do happen in such scenario.

#### Scenario A: No capacity

In this scenario, Infrastructure Team simply rejects or postpones the request for help, as they are already too overwhelmed to handle yet another request, and everyone claims their request is __the__ most urgent.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype polyline

agent DevTeam as "Development Team"
agent InfraTeam as "Infrastructure Team"

DevTeam --r[dashed]--> InfraTeam : asks for help
InfraTeam --l[dashed,#red]--> DevTeam : rejected
```

Obviously, the Development Team is dissatisfied with the dismissal, as from their perspective this help may _really_ be critical, urgent, block their progress or even have a severe organization-wide impact. Meantime, the Infrastructure Team needs to spend considerable time triaging and responding to numerous requests. This often leads straight to the other two scenarios.

#### Scenario B: No response

Sometimes, this communication becomes so overwhelming that some teams stop responding to requests altogether - either due to requests being simply lost in the endless stream of tickets and emails, or because the team would be practically paralyzed if they replied to everyone.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype polyline

agent DevTeam as "Development Team"
agent InfraTeam as "Infrastructure Team"
agent DevNull as "/dev/null"

DevTeam --r[dashed]--> InfraTeam : asks for help
InfraTeam -d[#red,dashed]-> DevNull : no response
```

This situation is even more unhealthy than perpetual rejection - because in case of the latter, at least the team reaching out for help gets to know the other side acknowledged their request. If the recipient never responds to your tickets, emails and meeting invites, follow-ups and escalations ensue.

#### Scenario C: Escalation

Sometimes it is used as a last resort, and sometimes it is the default way of getting work done in an organization, as direct communication between individual teams is virtually impossible. The escalation can sometimes go up several levels before the situation gets addressed.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype polyline


together {
  agent DevTeam as "Development Team"
  actor DevEM as "Line Manager"
  actor DevMM as "Middle Manager"
  actor DevDD as "Development Director"
  DevTeam -u[dashed,#blue]-> DevEM : escalates
  DevEM -u[dashed,#blue]-> DevMM : escalates
  DevMM -u[dashed,#blue]-> DevDD : escalates
}

together {
  agent InfraTeam as "Infrastructure Team"
  actor InfraEM as "Line Manager"
  actor InfraMM as "Middle Manager"
  actor InfraDD as "Infrastructure Director"
  InfraDD -d[dashed,#blue]-> InfraMM : pass decision
  InfraMM -d[dashed,#blue]-> InfraEM : pass decision
  InfraEM -d[dashed,#blue]-> InfraTeam : pass decision
}

DevTeam ---r[dashed]---> InfraTeam : asks for help
InfraTeam ---l[dashed,#red]---> DevTeam : rejected

DevEM ---r[dashed]---> InfraEM : asks for help
InfraEM ---l[dashed,#red]---> DevEM : rejected

DevMM ---r[dashed]---> InfraMM : asks for help
InfraMM ---l[dashed,#red]---> DevMM : rejected

DevDD ---r[dashed]---> InfraDD: asks for help
```

Going through such escalation path not only takes time, but also creates needless tension and may exert excessive pressure on either party involved. Moreover, it gets multiple levels of management involved in fine-grained initiatives, stretching their own capacity, and possibly undermining trust in the team's competence and the ability to deliver results.

### Solution: Autonomous domain teams

As you can see from these few examples, such conundrums are not easily solved, especially when they compound. The problem would not exist if each team owning a particular domain mostly self-sufficient, having Software Engineers, QA Engineers, DBAs and Security Engineers on board, and could own their piece of cake end-to-end. Moreover, it would make it easier for an organization to see what kind value each individual team delivers. Frankly, this is not a new concept, as it dates back to at least 2003, when Eric Evans coined the term [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design). Over 20 years later, we are still wondering whether what we do is _proper DDD_ or where should we draw the lines between domains, though what is most important in DDD is its core concept - that instead of owning layers, organizational units should own particular areas of business as a bounded context.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype polyline

rectangle PlatesTeam as "Plates Team" {
  actor PlateEM as "Line Manager"
  actor PlateDev as "Developer"
  actor PlateInfra as "DevOps"
  actor PlateQA as "QA"

  PlateDev -u-> PlateEM : reports to
  PlateInfra -u-> PlateEM : reports to
  PlateQA -u-> PlateEM : reports to

  PlateDev -r[dashed]-> PlateInfra : asks for help
  PlateQA -r[dashed]-> PlateDev : requests action
}
rectangle PotsTeam as "Pots Team" {
  actor PotsEM as "Line Manager"
  actor PotsDev as "Developer"
  actor PotsInfra as "DevOps"
  actor PotsQA as "QA"
  actor PotsSec as "Security"

  PotsDev -u-> PotsEM : reports to
  PotsInfra -u-> PotsEM : reports to
  PotsQA -u-> PotsEM : reports to
  PotsSec -u-> PotsEM : reports to

  PotsSec -r[dashed]-> PotsDev : calls for action
}

actor CeramicsDirector as "Director of Ceramics"
actor TablewareDirector as "Director of Tableware"

PlateEM -u-> CeramicsDirector : reports to
PotsEM -u-> CeramicsDirector : reports to
CeramicsDirector -u-> TablewareDirector : reports to
```

In this setup, most of the time the teams are self-sufficient, and external interactions are required when concerns cross the boundaries of a single domain. Examples of such situations include:
- Architecture alignment initiatives,
- Organization infrastructure security hardening efforts,
- One domain interacting with another as part of higher-level customer journey.

{% capture departments_insights_domains %}
As a rule of thumb, a more effective approach is to organize according to domain expertise while ensuring each domain team / department / division is as self-sufficient as feasible in the company's context. This allows to manage team capacity more effectively, as most of the communication overhead between departments can be avoided, and the communication channels that do get established between domain teams tend to be more direct and organic.
{% endcapture %}
{% include key-takeaway.html content=departments_insights_domains %}

## We need it, we reinvent it

{% capture reinvention %}
When I joined Round Plates, each team solved the same problems on their own. To give just one example, we had around <b>seven</b> competing libraries for logging alone - and absurdly enough, almost all of them had <i>common</i> somewhere in their names. When we needed to provision a Kubernetes cluster for ourselves, we learned how to do this from scratch - and it in a rather inefficient manner, having to tinker a lot with AWS Route53, manage AWS EC2 instances serving as worker and control plane nodes, deal with duplication of Terraform code, and soon enough we ran out of our rather small private network's IP address pool.
{% endcapture %}
{% include case-study-context.html content=reinvention %}

This is an experience most Software Engineers can relate to. We start a project, we start running into challenges... if we are lucky enough, we get to know someone has already addressed this before in the company, otherwise we get our hands dirty and proudly solve problems nobody told us do not need solving. This indicates a number of problems:
- Lack of alignment across engineering teams, as all of them have their own, in-house solutions to address similar problems,
- Considerable efforts are committed by teams to address the same challenge independently,
- Individual solutions are of varying quality, as smaller audience and narrower scope mean fewer opportunities for feedback. Some teams may arrive at brilliant solutions, while others would not,
- Communication gaps, as most of the time the teams are unaware of each other's struggles, and thus cannot cooperate to arrive at a solution together.

### Solution: Chapters, Guilds and Communities of Practice

It doesn't really matter how exactly an organization names it, or what particular framework this is built around. The crucial aspect is to give room for engineering teams to gather and discuss particular topics of interest. It also creates an opportunity to showcase what kind of challenges the team ran into, and how they get addressed - this way, such solutions can spread and receive more substantial feedback, and it increases the chances the teams would re-use each other's solutions, rather than keep themselves busy reinventing the wheel.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype polyline

rectangle PlatesTeam as "Plates Team" {
  actor PlateEM as "Line Manager"
  actor PlateSecurity as "Security"
  actor PlateDev as "Developer"
  actor PlateInfra as "DevOps"
  actor PlateQA as "QA"

  PlateSecurity -r[hidden]- PlateDev
  PlateDev -r[hidden]- PlateInfra
  PlateInfra -r[hidden]- PlateQA

  PlateDev -u-> PlateEM : reports to
  PlateInfra -u-> PlateEM : reports to
  PlateQA -u-> PlateEM : reports to
  PlateSecurity -u-> PlateEM : reports to
}
agent CommunityEM as "Leadership group"
agent CommunityQA as "QA chapter"
agent CommunityArchitecture as "Architecture guild"
agent CommunitySecurity as "Security champions"

PlateEM -u[dotted]- CommunityEM
PlateDev -d[dotted]- CommunityArchitecture
PlateInfra -d[dotted]- CommunityArchitecture
PlateQA -r[dotted]- CommunityQA
PlateSecurity -l[dotted]- CommunitySecurity
```

The most successful solutions - ones that got the most traction, proved to be reliable and liked by the engineering teams - can be further refined and adopted company-wide. This can lead to gradual creation of _the_ company platform, maintained and owned by _the_ platform team(s) as enablers for domain teams. As an added benefit, in my experience the ability to participate in such initiatives enhances engagement, and helps build a sense of belonging to the organization.

{% capture reinvention_insights_community %}
Encouraging exchange of ideas and communication between the teams within themed groups - such as Security, Quality Assurance, Architecture - enables an organization to deliver more effectively and at a more consistent quality, while strengthening the internal community.
{% endcapture %}
{% include key-takeaway.html content=reinvention_insights_community %}

### Solution: Platform team catering to everyone

These kinds of problems got gradually addressed as the company invested in building a platform team delivering enablers for the rest of us - such as high-level Terraform modules to provision required resources, running dedicated Kubernetes clusters in AWS EKS to be used by domain teams, and delivering a high-level CLI that allowed to easier integrate local environment with cloud resources for easier management. While some of these platform solutions were not great - the microservices generator was almost universally contested as insanely impractical - in general having such team greatly increased our productivity and alignment across teams.

One of the most important aspects of this approach was that it was built with self-service in mind - rather than sending tickets over to the Platform Team to do the necessary work for us, the team delivered technical enablers that allowed us to manage the infrastructure on our own easier and faster, while adhering to company's security standards and keeping roughly uniform infrastructure.

{% capture reinvention_insights_platform %}
It is often helpful if an organization has a dedicated Platform Team, delivering technical enablers for domain teams - ideally on a self-service basis. This allows teams to focus on their key deliverables rather than solving common problems independently - without the need to line up with their tickets to provision a database.
{% endcapture %}
{% include key-takeaway.html content=reinvention_insights_platform %}

## Hierarchical structure, hierarchical outcomes

{% capture hierarchy %}
At Round Plates, some teams had dedicated Software Architects, while others did not. One team we worked with quite closely got tasked with designing and implementing a system to handle dynamic configurations for enterprise applications, which were supposed to have a rather complex lifecycle. A certain Software Architect, Jeff, was going to help them. As it turned out - Jeff had a <i>my way or highway</i> mindset, and was not particularly interested in seeking or accepting developers' feedback about his designs. 
{% endcapture %}
{% include case-study-context.html content=hierarchy %}
