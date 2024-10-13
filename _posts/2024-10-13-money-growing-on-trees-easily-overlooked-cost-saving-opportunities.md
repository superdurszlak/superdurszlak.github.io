---
layout: post
title: "Money growing on trees: Easily overlooked cost-saving opportunities"
case_study: true
stock: money-on-tree
tags: 
  - "cost"
  - "saving"
  - "optimization"
  - "distributed-systems"
  - "microservices"
---

## Abstract

Distributed systems and especially microservices are often a go-to solution for organizations seeking modernity, scalability and growth opportunities. What is often overlooked, though, is that as the scale of our infrastructure keeps growing, so does the scale of any inefficiencies introduced along the way. While few would find it worth investigating whether service's upkeep could be cut from USD 200 down to USD 100 per month, the sum becomes non-trivial if we could cut the costs of running hundreds of microservices, several instances each.

In this post, we will explore a number of examples where teams or organizations realized (or not) they are over-spending on their infrastructure at scale.

## Over-provisioning of resources

{% capture over_provisioning_1 %}
At Baffled Waffles, we deployed plenty of Java microservices in Kubernetes clusters. Not quite educated on how to deploy them efficiently, Software Engineers often chose to set rather high resource requests rather than resource limits. As a result, the clusters had to scale out to excessive number of worker nodes just to handle deployments, even though true loads were often minuscule.
{% endcapture %}
{% include case-study-context.html content=over_provisioning_1 %}

{% capture over_provisioning_2 %}
While working for Coinworth, I realized our team deployed containerized Java applications on dedicated Virtual Machines using third-party cloud provider, similar to AWS ECS and Azure AppServices. It wouldn't be too bad but if not for the fact that in multiple cases, the VMs provisioned to run them were clearly overpowered. As the team deployed dozens of such over-powered VMs with multiple instances of our applications, it turned out we are spending thousands of USD per month on compute resources we do not really use.
{% endcapture %}
{% include case-study-context.html content=over_provisioning_2 %}

It is deceptively easy for Software Engineers to provision compute resources in the cloud. In fact, this is the very reason why I personally consider cloud computing superior to classic ways of managing infrastructure - more on this in [Cloud Transformation misconceptions](/posts/cloud-transformation-misconceptions/). In case of cloud infrastructure from third-party vendors, it is in their best interest to make provisioning of resources even easier, with dedicated dashboards, plentiful integrations, a wide range of compute resource types, usage-based billing and whatnot.

As helpful as it is, it also makes over-provisioning of resources exceptionally easy - after all, if something is so easy to do, few would think how much it actually costs to do so. Over-provisioning once is negligible and not worth investigation, however at scale it can - and does - incur excessive costs which cannot be overlooked.

{% capture over_provisioning_insight %}
When provisioning compute resources in the cloud, whether Virtual Machines or via Kubernetes resources allocations, be mindful to provision only what you need. Nobody gets hurt because of a few bucks of over-spending, however at scale the over-spending on infrastructure can become non-trivial, and impact the organization's competitiveness.
{% endcapture %}
{% include key-takeaway.html content=over_provisioning_insight %}

## Unshared cloud resources

## Excessive metrics cardinality

## Massive logs ingest

## Maintenance cost and overhead

## Resource-hungry tech stack

## Unrestricted scalability

## Barely used applications

## Summary

While by no means exhaustive, the examples of cost inefficiencies 