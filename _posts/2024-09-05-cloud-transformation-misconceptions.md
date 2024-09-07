---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: post
title: "Cloud Transformation misconceptions"
case_study: true
tags: 
  - "cloud transformation"
  - "cloud"
  - "infrastructure"
  - "transformation"
  - "case study"
---

## Abstract

Whether your organization is a tech company or not, you have probably heard of *Cloud Transformation*, if not participated in one. In this article, I will cover a number of examples on how misunderstandings led the companies adopting cloud-based computing to struggle. Hopefully, awareness of such pitfalls could help you navigate your own efforts.

In a nutshell, *Cloud Transformation* is an organization's strategic effort to adopt cloud computing for its external or internal operations and can be considered another stage of modernization, similar to and often following *Digital Transformation*. While, principally, such efforts should be taken with certain practical benefits in mind, it is not unheard of companies committing to *Cloud Transformation* simply to be perceived as modern and cutting-edge by the customers and/or shareholders.

For the sake of this case study, let us consider a company called Vanilla Solutions. It is already past its *Digital Transformation* phase, and is now exploring how it could leverage cloud computing and Internet of Things to build better products for their customers on top of a unified, company-wide cloud platform. Vanilla Solutions hired me to contribute with my cloud experience in their R&D department.

## Cloud as an opposite of on-premise

{% capture infra_management %}
The organization has extensive on-premise infrastructure, however for its Cloud Transformation it decides to build its platform on top of a third-party, public cloud - desiring to be truly cloud-enabled. Unfortunately, this decision proves problematic - the company's cloud platform would be handling highly sensitive data on 3rd party infrastructure, and the organization is concerned this may have negative impact on their customers' trust in security. As a result, the organization takes questionable steps, such as committing significant resources to build a cloud platform while preventing the platform from achieving production readiness, or requiring numerous business units to build and manage their own cloud infrastructure and host their own instances of cloud platform there.
{% endcapture %}
{% include case-study-context.html content=infra_management %}

The misconception here is that in order to adopt cloud computing, you need to give up the physical control of underlying computing resources and migrate your - possibly sensitive - business operations or product to infrastructure controlled by a 3rd party. While it is certainly a valid option in some scenarios, it is crucial to acknowledge on-premise infrastructure can be, and has been successfully leveraged by organizations to build their own, private cloud infrastructure.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype ortho

actor devopsEngineer as "DevOps Engineer"
note left of devopsEngineer
  Needs to deploy billing-service:
  - at least 1 vCPU core per instance
  - at least 1GB vRAM per instance
  - Windows host
  - reachable at https://api.vanilla.com/billing
  - 3 instances for HA
  - load balanced
end note

actor softwareEngineer as "Software Engineer"
note right of softwareEngineer
  Needs to know the base URL of billing-service
end note

rectangle cloudDC as "On-premise data center" {
  
  cloud cloud as "Private Cloud" {
    agent appDeploy as "Deploy application"
    agent appDNS as "Service discovery"

    together {
      node nodeDNS as "DNS"
      node appScheduler as "Control Plane / Scheduler"
    }

    frame billingServiceFrame as "Billing Service" {
      agent loadBalancer [
        <<Load Balancer>>
      ]
      collections billingService [
        <<instances>>
      ]
      loadBalancer -r- billingService
    }

    note right of billingServiceFrame
      baseUrl: https://api.vanilla.com/billing
      service: billing-service
      hosts:
      - dc-virtual-001-001
      instances: 3
    end note

    frame nodes as "Nodes" {
      node vm1 [
        id: dc-virtual-001-001
        ====
        IPv4: 10.117.34.51
        vCPU: 4 cores
        vRAM: 4GB
        vDisk: 50G
        OS: Windows Server 2016
      ]
      node vm2 [
        id: dc-virtual-001-002
        ====
        IPv4: 10.117.34.53
        vCPU: 4 cores
        vRAM: 8GB
        vDisk: 100G
        OS: Ubuntu Server 22.04 LTS
      ]
      vm1 -d[hidden]- vm2
    }

    nodes -r- appScheduler
  }

  billingServiceFrame -d[dotted]- vm1

  appScheduler <-d[dotted]-> nodeDNS
  appDNS -d[dashed]-> appScheduler
  appDeploy -d[dashed]-> appScheduler

  devopsEngineer -[dashed]-> appDeploy
  softwareEngineer -[dashed]-> appDNS
}

```

This is a simplified example of private cloud infrastructure. Despite the fact it is operating in an on-premise data center, we can rather confidently say it is a private cloud since the real computing resources are abstracted away from the actors accessing them.

### What is a cloud, then?

The essence of *cloud computing* is that the computing resources - for example, servers - are abstracted away from software running on them. Rather than having to track which application runs on which servers (... in which server room, on which floor, in which office), cloud computing allows to allocate certain computing resources to a specific application from a pool of resources including these servers. Rather than micro-managing the infrastructure to ensure FizzBuzz Service runs on `192.168.244.112` for some arcane reason making it one of few suitable ones, those pooled computing resources are often orchestrated by a solution such as [Kubernetes](https://kubernetes.io/) or [HashiCorp Nomad](https://www.nomadproject.io/), and server nodes are labeled to ensure only resources meeting certain criteria can be used for a certain purpose:
- You might want to run a daemon process on every server you have,
- You may need to run 3 instances of your application for redundancy, and for extra confidence have each of them run on a separate device,
- You might have multiple data centers, and want to manage them in such a way that applications run in each independently, but can also serve as a standby in case the other experiences an outage.

### How can cloud computing complement on-premise?

As mentioned, *cloud computing* is an abstract, high-level approach to how computing resources are managed and how applications are ran - or scheduled - on them, and not at all about *where* these resources are located or *who* is managing them.

Conversely, *on-premise* is all about *who* and *where* runs and owns the infrastructure. In other words, *on-premise* implies that an organization has a strong ownership of its computing resources, regardless of how exactly these resources are being allocated for various purposes.

As you can see, both concepts are practically independent of each other, and there is no reason why *cloud computing* could not be leveraged to manage *on-premise* computing resources. In fact, as the *on-premise* infrastructure keeps growing, it becomes increasingly difficult and labor-intensive to efficiently manage all of the resources without introducing higher levels of abstraction, separation of concerns between applications and infrastructure - and, ideally, automation of infrastructure management.

### Then, is on-premise or third-party objectively better?

There is no straightforward answer for this as both have their strengths and limitations. The choice should also depend on whether the organization is already running its own data centers.

On-premise shines when confidence in controlling the infrastructure and data processed or stored on it is critical. While cloud vendors implement measures to ensure their solutions are secure, and infrastructure of their customers remains isolated and secured from unauthorized access, there might be scenarios where guarantees provided in a contract are not enough, and an organization would choose to run their own infrastructure. Additionally, *on-premise* may be actually cheaper to run in the long term, since apart from maintenance costs your organization does not contribute to a vendor's margin, which might be considerable. Especially if you already have your own data centers, building a private cloud on top of them is a great way to benefit from both being cloud-enabled and owning your infrastructure. On the other hand, building cloud infrastructure from the ground up can be highly challenging, and requires extensive expertise in infrastructure management. It may also require thoughtful, up-front decisions and substantial initial investments, taking into account variability in the computing resources demands, the organization's growth, and many other.

Conversely, leveraging third-party cloud infrastructure provided by a vendor can give your organization an edge if you need to become cloud-enabled fast and without up-front investments in on-premise infrastructure. It also takes the burden of actually handling the data centers off your shoulders, and may offer superior on-demand scalability if your demands are highly variable. However, it is a rather costly solution that may not be economical in the long run, and you need to be mindful about the implications of hosting applications and handling data on third party's infrastructure. It may also become problematic if the usage of resources spins out of control - it is not too difficult to quadruple the infrastructure costs due to misuses and inefficiencies.

{% capture infra_management_insight %}
In case of Vanilla Solutions, it would likely be reasonable to build its cloud platform on top of existing on-premise resources, given their extensive involvement in existing computing infrastructure and security concerns. On the other hand, if they were a start-up looking forward to establish presence globally without significant up-front investment in setting up their own data centers, relying on a third-party cloud vendor would likely be a more reasonable choice, at least until the organization builds capability to start on-premise data centers.
{% endcapture %}
{% include case-study-insight.html content=infra_management_insight %}

## Modernizing the infrastructure without modernizing the processes

{% capture legacy_infrastructure %}
Vanilla Solutions had a tendency to micro-manage the infrastructure resources, at least in some departments. The servers were configured and set up for applications manually, and so was done the maintenance. When the organization started building applications in the third-party cloud, the ways of working were preserved - leading to hand-crafting the low-level infrastructure components, and even though rudimentary Terraform scripts were in place, they were ridden with "magic IP addresses", excessively bloated codebase and similar problems. In one instance, it took two months and thousands of lines of Terraform code for Cloud IT team to deploy a third-party test reporting software, which did not even have enough dependencies to justify the timeline and challenges encountered.
{% endcapture %}
{% include case-study-context.html content=legacy_infrastructure %}

The problem in this case is that Vanilla Solutions made investments to become cloud-enabled, however the engineering decisions - or lack of them - prevented the organization from leveraging the benefits of cloud computing. It was also a missed opportunity to modernize and streamline existing processes, which would only allow for more efficient cloud operations, but also could be transferred back to non-cloud infrastructure to some extent.

```plantuml!
!theme mono
top to bottom direction
skinparam linetype ortho

together {
  frame nonCloud as "Non Cloud infra" {
    node nonCloudNodeB as "10.117.91.43" {
      agent nonCloudAppB as "Billing Service"
      database nonCloudDBA as "Billing Database"
      nonCloudAppB -[dashed]-> nonCloudDBA
    }
    node nonCloudNodeA as "10.117.47.222" {
      agent nonCloudAppA as "Website"
      agent nonCloudPrometheusA as "Prometheus Agent"
      nonCloudPrometheusA -l[dotted]- nonCloudAppA
      nonCloudAppA -l[dashed]-> nonCloudAppB
    }
    node nonCloudNodeC as "10.117.85.106" {
      agent nonCloudAppC as "Prometheus Server"
    }
    nonCloudPrometheusA -r[dotted]-> nonCloudAppC
  }
  cloud cloud as "Cloud infra" {
    node cloudNodeB as "10.98.21.99" {
      agent cloudAppB as "Billing Service"
      database cloudDBA as "Billing Database"
      cloudAppB -[dashed]-> cloudDBA
    }
    node cloudNodeA as "10.98.100.58" {
      agent cloudAppA as "Website"
      agent cloudPrometheusA as "Prometheus Agent"
      cloudPrometheusA -l[dotted]- cloudAppA
      cloudAppA -l[dashed]-> cloudAppB
    }
    node cloudNodeC as "10.98.32.236" {
      agent cloudAppC as "Prometheus Server"
    }
    cloudPrometheusA -r[dotted]-> cloudAppC
  }
}
```

If you struggle to see any fundamental difference between *Non Cloud infra* and *Cloud infra* in the diagram above - worry not, this is because both infrastructures are essentially the same, and neither is cloud-enabled, regardless of where it is hosted or whether it had been set up with Terraform, from command line, or with shell scripts.

### Why is that an issue?

There is a number of problems caused by fine-grained control of cloud computing resources:
- Unsuitability of cloud / infrastructure management tools,
- Complexity for end users, resulting in labor-intensiveness, error-proneness and excessive cognitive load when controlling extensive infrastructure.
  
### Tools unsuitability 

Infrastructure-as-Code tools are in fact optimized to work with high-level abstractions, and to build higher-level components out of more basic ones. An example of this philosophy is Terraform's ability to define reusable module and variables, so that the user can compose complex resources out of basic building blocks, or leverage off-the-shelf modules provided either by Terraform, or open-source community, or other infrastructure engineers contributing in the organization.

In order to exert such fine-grained control, to the point I tend to call it *infrastructure micro-management*, IaC user needs not only to give up all the benefits these tools and high-level abstractions provide, but also to go the extra mile to force end results to be exactly as intended.

### High complexity 

To give an analogy, consider driving a number of vehicles:
- A custom built 1930s automobile having dozens of knobs and buttons on its dashboard, and the gearbox is non-synchronized so you must match the revs to be able to change gears,
- A simple, old-fashioned family car manufactured in 1980s-1990s. The operation is manual but not too complicated: A few dials, a clutch, brake and gas pedals, and the gearbox is a synchromesh so the operation is by far easier,
- A modern hybrid with automatic, continuously variable gearbox that does not even require the driver to select gears anymore.

From the perspective of technical complexity, the 1930s automobile is likely the simplest since it does not have any advanced features - the gearbox is basic, and so is the rest of its equipment. That being said, it is by far the most complex to operate for a driver - instead of focusing on the surroundings and getting from point A to B in a safe manner, the driver must keep an eye on numerous dials, watch the revs closely while switching gears, operate all the knobs and valves, not to mention having to stop every 50km or so to add more cooling water.

On the other extreme, we have a hybrid car which is by far the most complex mechanically - with hybrid combustion / electric drivetrain, most likely with a computer onboard controlling everything that is going on under the hood to optimize for performance and fuel economy as needed. The CVT gearbox may have inferior longevity compared to a well maintained synchromesh. On the other hand, it is by far the easiest car to operate - the driver does not need to get distracted by changing gears at all, and all the fine-grained controls are taken care of by the computer. Moreover, the car has plenty of ingenious safety systems which were not invented yet, or available only for premium cars in 1980s.

The analogy here is that all of the high-level, modern infrastructure tools are often highly complex by themselves, as they need to be robust enough to reliably handle infrastructure changes. At the same time, they make best efforts to keep fine-grained knob switching away from the end user of the infrastructure, in this case the engineering team building systems to run in the cloud. While doing this in an old-fashioned way certainly has its advocates and may be not too overwhelming at a smaller scale, it should be kept in mind that with growing infrastructure the difficulty would also ramp up significantly.

The implications of resorting to a highly complex solution - from end users perspective - are manifold:
- Labor-intensiveness, stemming from the fact that in order to achieve a high-level result, the user needs to complete multiple tasks, or apply many fine-grained changes,
- Error-proneness, caused by lack of proper abstractions, as well as human's natural tendency to make mistakes from time to time - the more work there is to do and the less comprehensible the abstractions, the higher the risk that a routine task would result in an incident,
- Cognitive load resulting from the sheer amount of information to process at a time - be it configurations, source code, or mental model of how human-unfriendly values map to desired properties of various infrastructure components. Higher cognitive load leads to outcomes of both inferior quality and quantity, contributing to both labor-intensiveness and error-proneness of the solution.

{% capture legacy_infrastructure_insight %}
In case of Vanilla Solutions, introduction of cloud computing did not help streamline infrastructure management, in fact the result was opposite. The key reason is that the crucial part of Cloud Transformation was omitted - Vanilla Solutions architects and engineers did not introduce higher levels of abstraction to describe and handle the infrastructure, and the way infrastructure was managed was labor-intensive. The time invested to hand-craft and troubleshoot all the "magic IP" mappings and low-level components could have been better spent on improving and automating on-premise infrastructure management.
{% endcapture %}
{% include case-study-insight.html content=legacy_infrastructure_insight %}

## Well-known problems call for in-house solutions

{% capture in_house_bias %}
It cannot be denied that Vanilla Solutions proved innovative in its own field, contributing to or even establishing standards and protocols to be followed by others. For its Cloud Transformation, however, despite not having even remotely as extensive experience as with their core business areas, Vanilla Solutions decided to establish its own, custom protocols for communication and cloud standards - long before gaining any substantial experience in the field. Moreover, the standards and protocols were mostly established by subject matter experts in its core areas of expertise, rather than in cloud computing. As a result, in one case an assembly of Software Architects loosely defined a communication protocol for cloud applications and Internet of Things, and while in principle it somewhat resembled Protocol Buffers, it was naturally unsupported by any cloud-based software, frameworks or infrastructure components in existence, and came with challenges already addressed by well-established protocols a long time ago, and the feedback loop for addressing challenges was not well established due to top-down decision making.
{% endcapture %}
{% include case-study-context.html content=in_house_bias %}

It is unclear why Vanilla Solutions was inclined to basically re-invent the cloud from the ground up, especially if the cloud platform was to be hosted on a vendor's infrastructure and the company was hiring engineering talent with prior cloud experience. It might have been done as an odd habit, stemming from how the organization operates in its core business, on the other hand this kind of behavior resembles [not-invented-here syndrome](https://dictionary.cambridge.org/dictionary/english/not-invented-here-syndrome), and argumentation provided would align with NIHS.

### Why is this an issue?

Even more alarming was the fact that while the in-house solutions closely resembled existing standards, in this particular case Protocol Buffers, the organization was not willing to at least take inspiration from established industry standards, leveraging their strengths while keeping in mind specific requirements for the new protocol. The radical commitment to in-house solutions, combined with refusal to follow industry best practices, led to a number of issues:
- The development of the new protocol was slowed down by the fact that new edge cases were discovered on a regular basis,
- The delivery of the cloud platform was essentially blocked until the protocol design was finalized, and libraries, SDKs or at least reference implementations would be provided,.
- The new protocol would naturally be unsupported by third-party components such as existing cloud libraries, SDKs, network components and so forth, leading to chain reaction of one in-house solution necessitating another.

### Can in-house solutions and industry standards co-exist?

In principle, they can and do on a regular basis. However, as a rule of thumb it is far easier and more practical to take off-the-shelf products - such as open source network components - and build higher-level in-house solutions on top of them. With this approach, organizations can leverage the best of both worlds:
- Highly customized, custom components and deliverables can be created, according to organization-specific needs,
- Following industry standards ensures that the solution will be easier to onboard to for new joiners to the organization,
- Well-maintained, industry-standard solutions are usually (though not always) well optimized for the task, in terms of performance and developer experience alike,
- The bulk of edge cases is addressed by creators of third-party solutions, and for the remainder there is likely community support - oftentimes, someone has already run into a similar problem,
- Without the need to invent low-level components, solutions can be built more rapidly and with more room for experimentation and prototyping,
- The organization can focus on building the intended systems and delivering value, rather than creating enablers first.

### Isn't third-party software risky?

Naturally, any third-party software to be adopted by an organization should be thoroughly reviewed, especially for security and licensing issues. 

Luckily, there are public databases of open source vulnerabilities maintained and kept up-to-date by well-recognized entities, such as [CVE](https://www.cve.org/) and [NVD](https://nvd.nist.gov/vuln), allowing to not only audit a library or component *before* adopting it, but also to monitor it and respond to vulnerabilities discovered *after* adoption. It is a best practice to incorporate at least an [OSA / SCA scan](https://owasp.org/www-community/Component_Analysis) into software's CI pipelines to ensure regular vulnerability scanning.

That being said, open source software is not the only susceptible to vulnerabilities. In-house solutions can also suffer from security issues, especially if created without sufficient expertise, in a high-pressure environment and without relevant quality gates - CVE and NVD databases are full of open- and closed-source software vulnerabilities alike.

As for licensing of software, most digital companies already have policies regarding allowed and prohibited licenses in third-party dependencies. Examples of commonly used licenses typically considered *safe* include [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0) and [MIT License](https://opensource.org/license/mit), while copyleft licenses such as [GPL](https://www.gnu.org/licenses/gpl-3.0.en.html) are typically avoided due to the legal implications.

{% capture in_house_bias_insight %}
For Vanilla Solutions, it would likely be more beneficial to focus on delivery of an MVP cloud platform - even with limited functionality and room for improvement in terms of performance and other aspect. A practical approach would be to start with initial assessment of available solutions for a task, for instance communication protocols, and choose one that most closely addresses concerns anticipated by an organization. This would allow to shorted the time to first deliverables, allowing in turn to gather more practical experience and validate the design. With this knowledge, solutions could be further evaluated, and if needs arise, specific components could be strategically substituted with tailored, in-house solutions.
{% endcapture %}
{% include case-study-insight.html content=in_house_bias_insight %}

## Cloud infrastructure requires implementing new, dedicated applications

{% capture cloud_software_bias %}
When I joined Vanilla Solutions, the very first assignment I got was to develop "some cloud service" and "run it in the cloud". As this task seemed rather unclear confusing and unclear for me, I started asking questions to clarify what exactly am I expected to deliver - and it turned out my managers wanted me to implement just about any "Hello World" application and "somehow" run it in the cloud, in order to prove it is possible. I tried to argue that from my experience, the most difficult part of cloud computing is infrastructure management, rather than writing dedicated software, and in fact as a PoC we could deploy an existing application on cloud computing resources and focus on smooth deployment and meeting certain expectations. Sadly, it turned out cloud computing was severely misunderstood in the organization, to the point existing software would likely be rewritten for the sake of "making it tun in the cloud", and the company expected that "cloud applications" would be written for the cloud platform, but later each division or business unit would have to build and maintain their own infrastructure to run instances of the software, in their own way - at best following my "reference" implementation. As a result, I organized basic training sessions for the team to establish at least minimal understanding of what cloud computing actually is.
{% endcapture %}
{% include case-study-context.html content=cloud_software_bias %}

The misunderstanding here was the assumption that the most difficult and labor-intensive part of building cloud applications is implementing the applications themselves, and that cloud computing resources are special in some undefined, vague way, to the point regular software would not even run there.

### Are "cloud" applications that special?

The short answer is **no**. In cloud computing, countless programs, applications and operating systems are used, which were created long before the "cloud" term was first coined. Most notable examples include:
- Linux and Windows OS families,
- Common Linux/Unix utilities such as `cURL`, `grep`, `bash`,
- Most mainstream programming languages, including C and Java.

### Why is that bias damaging?

