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

together {
  frame classicDC as "Non Cloud DC" {
  }
  frame cloudDC as "On-premise Cloud" {
  }
}
```
This is a perfectly good 

### What is a cloud, then?

The essence of *cloud computing* is that the computing resources - for example, servers - are abstracted away from software running on them. Rather than having to track which application runs on which servers (... in which server room, on which floor, in which office), cloud computing allows to allocate certain computing resources to a specific application from a pool of resources including these servers. Rather than micro-managing the infrastructure to ensure FizzBuzz Service runs on `192.168.244.112` for some arcane reason making it one of few suitable ones, those pooled computing resources are often orchestrated by a solution such as [Kubernetes](https://kubernetes.io/) or [Nomad](https://www.nomadproject.io/), and server nodes are labeled to ensure only resources meeting certain criteria can be used for a certain purpose:
- You might want to run a daemon process on every server you have,
- You may need to run 3 instances of your application for redundancy, and for extra confidence have each of them run on a separate device,
- You might have multiple data centers, and want to manage them in such a way that applications run in each independently, but can also serve as a standby in case the other experiences an outage.

### How can cloud computing complement on-premise?

As mentioned, *cloud computing* is an abstract, high-level approach to how computing resources are managed and how applications are ran - or scheduled - on them, and not at all about *where* these resources are located or *who* is managing them.

Conversely, *on-premise* is all about *who* and *where* runs and owns the infrastructure. In other words, *on-premise* implies that an organization has a strong ownership of its computing resources, regardless of how exactly these resources are being allocated for various purposes.

As you can see, both concepts are practically independent of each other, and there is no reason why *cloud computing* could not be leveraged to manage *on-premise* computing resources. In fact, as the *on-premise* infrastructure keeps growing, it becomes increasingly difficult and labor-intensive to efficiently manage all of the resources without introducing higher levels of abstraction, separation of concerns between applications and infrastructure - and, ideally, automation of infrastructure management.

### Then, is on-premise or third-party objectively better?

There is no straightforward answer for this as both have their strengths and limitations. The choice should also depend on whether the organization is already running its own data centres.

On-premise shines when confidence in controlling the infrastructure and data processed or stored on it is critical. While cloud vendors implement measures to ensure their solutions are secure, and infrastructure of their customers remains isolated and secured from unauthorized access, there might be scenarios where guarantees provided in a contract are not enough, and an organization would choose to run their own infrastructure. Additionally, *on-premise* may be actually cheaper to run in the long term, since apart from maintenance costs your organization does not contribute to a vendor's margin, which might be considerable. Especially if you already have your own data centres, building a private cloud on top of them is a great way to benefit from both being cloud-enabled and owning your infrastructure. On the other hand, building cloud infrastructure from the ground up can be highly challenging, and requires extensive expertise in infrastructure management. It may also require thoughtful, up-front decisions and substantial initial investments, taking into account variability in the computing resources demands, the organization's growth, and many other.

Conversely, leveraging third-party cloud infrastructure provided by a vendor can give your organization an edge if you need to become cloud-enabled fast and without up-front investments in on-premise infrastructure. It also takes the burden of actually handling the data centres off your shoulders, and may offer superior on-demand scalability if your demands are highly variable. However, it is a rather costly solution that may not be economical in the long run, and you need to be mindful about the implications of hosting applications and handling data on third party's infrastructure. It may also become problematic if the usage of resources spins out of control - it is not too difficult to quadruple the infrastructure costs due to misuses and inefficiencies.

{% capture infra_management_insight %}
In case of Vanilla Solutions, it would likely be reasonable to build its cloud platform on top of existing on-premise resources, given their extensive involvement in existing computing infrastructure and security concerns. On the other hand, if they were a start-up looking forward to establish presence globally without significant up-front investment in setting up their own data centres, relying on a third-party cloud vendor would likely be a more reasonable choice, at least until the organization builds capability to start on-premise data centres.
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

## Well-known problems call for in-house solutions

{% capture in_house_bias %}
It cannot be denied that Vanilla Solutions proved innovative in its own field, contributing to or even establishing standards and protocols to be followed by others. For its Cloud Transformation, however, despite not having even remotely as extensive experience as with their core business areas, Vanilla Solutions decided to establish its own, custom protocols for communication and cloud standards - long before gaining any substantial experience in the field. Moreover, the standards and protocols were mostly established by subject matter experts in its core areas of expertise, rather than in cloud computing. As a result, in one case an assembly of Software Architects loosely defined a communication protocol for cloud applications and Internet of Things, and while in principle it somewhat resembled Protocol Buffers, it was naturally unsupported by any cloud-based software, frameworks or infrastructure components in existence, and came with challenges already addressed by well-established protocols a long time ago, and the feedback loop for addressing challenges was not well established due to top-down decision making.
{% endcapture %}
{% include case-study-context.html content=in_house_bias %}
