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

For the sake of this case study, let us consider a company called Vanilla Solutions. It is already past its *Digital Transformation* phase, and is now exploring how it could leverage cloud computing and Internet of Things to build better products for their customers on top of a unified, company-wide cloud platform. Vanilla Solution hired me to help in the R&D department, looking after my past cloud experience.

## Cloud as an opposite of on-premise

{% capture infra_management %}
The organization has extensive on-premise infrastructure, however for its Cloud Transformation it decides to build its platform on top of third-party, public cloud, since it wants to be truly cloud-enabled. Unfortunately, this decision proves problematic since the company's cloud platform would be handling highly sensitive data on 3rd party infrastructure, and the organization is concerned this may have negative impact on their customers' trust in security. As a result, the organization takes questionable steps, such as committing significant resources to build a cloud platform while preventing the platform from achieving production readiness, or requiring numerous business units to build and manage their own cloud infrastructure and host their own instances of cloud platform there.
{% endcapture %}
{% include case-study-context.html content=infra_management %}

The misconception here is that in order to adopt cloud computing, you need to give up the physical control of underlying computing resources and migrate your - possibly sensitive - business operations or product to infrastructure controlled by a 3rd party. While it is certainly a valid option in some scenarios, it is crucial to acknowledge on-premise infrastructure can be, and has been leveraged by organizations to build their own, private cloud infrastructure.