---
layout: post
title: "Money growing on trees: Easily overlooked cost-saving opportunities"
case_study: true
jargon_heavy: true
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

{% capture over_provisioning %}
At Baffled Waffles, we deployed plenty of Java microservices in Kubernetes clusters. Not quite educated on how to deploy them efficiently, Software Engineers often chose to set rather high resource requests rather than resource limits. As a result, the clusters had to scale out to excessive number of worker nodes just to handle deployments, even though true loads were often minuscule.
{% endcapture %}
{% include case-study-context.html content=over_provisioning %}

It is deceptively easy for Software Engineers to provision compute resources in the cloud. In fact, this is the very reason why I personally consider cloud computing superior to classic ways of managing infrastructure - more on this in [Cloud Transformation misconceptions](/posts/cloud-transformation-misconceptions/). In case of cloud infrastructure from third-party vendors, it is in their best interest to make provisioning of resources even easier, with dedicated dashboards, plentiful integrations, a wide range of compute resource types, usage-based billing and whatnot.

As helpful as it is, it also makes over-provisioning of resources exceptionally easy - after all, if something is so easy to do, few would think how much it actually costs to do so. Over-provisioning once is negligible and not worth investigation, however at scale it can - and does - incur excessive costs which cannot be overlooked.

{% capture over_provisioning_insight %}
When provisioning compute resources in the cloud, whether Virtual Machines or via Kubernetes resources allocations, be mindful to provision only what you need. Nobody gets hurt because of a few bucks of over-spending, however at scale the over-spending on infrastructure can become non-trivial, and impact the organization's competitiveness.
{% endcapture %}
{% include key-takeaway.html content=over_provisioning_insight %}

## Unshared cloud resources

{% capture unshared_resources %}
While working for Coinworth, I realized our team deployed containerized applications on dedicated Virtual Machines using third-party cloud provider, similar to AWS ECS and Azure AppServices. It wouldn't be too bad if the resources could be fully utilized, since the free resources could not even be shared with other applications, and there was no way to run several lightly loaded applications on shared infrastructure, like in Kubernetes. As the team deployed dozens of such over-powered VMs with multiple instances of our applications, it turned out we are spending thousands of USD per month on compute resources we do not really use.
{% endcapture %}
{% include case-study-context.html content=unshared_resources %}

The problem here is primarily that since each individual application had its own, dedicated compute resources, they were all deployed with _prepare for the worst_ mindset. If they need a lot of CPU power at startup time, each would be given a relatively powerful CPU. During runtime, though, they would barely use any of their assigned resources. As they would not share resources with each other, this would be done over and over again.

There are two primary ways to avoid this conundrum:
- Orchestrate your containers on shared compute infrastructure - with Kubernetes, Nomad or similar,
- Attempt to replace expensive, overpowered infrastructure with more cost-efficient alternatives, at the expense of lower stability and/or longer startup times.

{% capture unshared_resources_insight %}
Writing software that would fully utilize their compute resources before running into other bottlenecks is a difficult task, especially with tech stacks that suffer from imbalanced resource utilization. It is often more cost-efficient to accept the overhead of orchestration, while leveraging the ability to share compute resources between various containers.
{% endcapture %}
{% include key-takeaway.html content=unshared_resources_insight %}

## Excessive metrics cardinality

{% capture metrics_cardinality %}
Another cost inefficiency we spotted at Baffled Waffles were metrics cardinality. We were exploring the possibility to use SaaS metrics server rather than self-hosted one, since in the latter case we found tuning the server for scalability challenging. As it turned out, metrics server vendor would bill us by the number of data series, and this value was dependent on cardinality - essentially, how many possible combinations of various label values were there.
{% endcapture %}
{% include case-study-context.html content=metrics_cardinality %}

Our investigation with the SRE team has shown that due to generous labelling, the cardinality of our metrics reached hundreds of thousands, if not millions already. When we started investigating actual metrics-based dashboards and queries we actually used for monitoring, it turned out the cardinality we truly needed was a fraction of this - maybe several thousand.

What this meant was that without cutting on cardinality of ingested data, we would be spending considerable sums on series which we would never use directly - only aggregated with other, similar series. This also meant additional, needless processing, possibly impacting performance. Filtering out unused label dimensions in metrics collectors helped us cut down on the numbers significantly.

{% capture metrics_cardinality_insight %}
Excessive cardinality is another example where organizations are paying for features they never use. Cutting on cardinality costs can help reduce costs in case on series-based billing, while also reducing computational cost of metrics processing - so it should also be beneficial in case of self-hosted metrics servers. Similar measures could also be applied to other observability data where cardinality matters - such as labelled logs processing and distributed tracing.
{% endcapture %}
{% include key-takeaway.html content=metrics_cardinality_insight %}

## Massive logs ingest

## Maintenance cost and overhead

## Resource-hungry tech stack

## Unrestricted scalability

## Barely used applications

## Summary

While by no means exhaustive, the examples of cost inefficiencies 