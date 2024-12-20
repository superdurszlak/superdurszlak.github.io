---
layout: post
title: "Money growing on trees - Easily overlooked cost-saving opportunities"
case_study: true
jargon_heavy: true
stock: money-on-tree
tags: 
  - "cost-saving"
  - "optimization"
  - "efficiency"
  - "distributed-systems"
  - "microservices"
---

Distributed systems, and especially microservices are often a go-to solution for organizations seeking modernity, scalability and growth opportunities. What is often overlooked, though, is that as the scale of our infrastructure keeps growing, so does the scale of any inefficiencies introduced along the way. While few would find it worth investigating whether service's upkeep could be cut from USD 200 down to USD 100 per month, the sum becomes non-trivial if we could cut the costs of running hundreds of microservices, several instances each.

Building distributed systems, including cloud-based microservices, is a challenging and rather expensive journey - even if done efficiently. If we overlook some of the major inefficiencies, however, the high cost may become simply prohibitive, necessitating a mindful approach. In this post, we will explore a number of examples where teams or organizations realized (or not) they are over-spending on their infrastructure at scale:
- Over-provisioning of resources,
- Unshared cloud resources,
- Excessive metrics cardinality,
- Massive logs ingest,
- Maintenance cost and overhead,
- Resource-hungry tech stack,
- Unrestricted scalability,
- Barely used applications.

## Over-provisioning of resources

{% capture over_provisioning %}
At Baffled Waffles, we deployed plenty of Java microservices in Kubernetes clusters. Not quite educated on how to deploy them efficiently, Software Engineers often chose to set rather high resource requests rather than resource limits. As a result, the clusters had to scale out to excessive number of worker nodes just to handle deployments, even though true loads were often minuscule.
{% endcapture %}
{% include case-study-context.html content=over_provisioning %}

It is deceptively easy for Software Engineers to provision compute resources in the cloud. In fact, this is the very reason why I personally consider cloud computing superior to classic ways of managing infrastructure - more on this in [Cloud Transformation misconceptions](/posts/cloud-transformation-misconceptions/). In case of cloud infrastructure from third-party vendors, it is in their best interest to make provisioning of resources even easier, with dedicated dashboards, plentiful integrations, a wide range of compute resource types, usage-based billing and whatnot.

As helpful as it is, it also makes over-provisioning of resources exceptionally easy - after all, if something is so easy to do, few would think how much it actually costs to do so. Individually, such over-provisioning might be negligible and not worth investigation, however at scale it often incurs excessive costs which cannot be overlooked.

{% capture over_provisioning_insight %}
When provisioning compute resources in the cloud, whether Virtual Machines or via Kubernetes resources allocations, be mindful to provision only what you need. Nobody gets hurt because of a few bucks of over-spending, however at scale the over-spending on infrastructure can become non-trivial, and impact the organization's competitiveness.
{% endcapture %}
{% include key-takeaway.html content=over_provisioning_insight %}

## Unshared cloud resources

{% capture unshared_resources %}
While working for Coinworth, I realized our team deployed containerized applications on dedicated Virtual Machines using third-party cloud provider, similar to AWS ECS and Azure AppServices. It wouldn't be too bad if the resources could be fully utilized, since the free resources could not even be shared with other applications, and there was no way to run several lightly loaded applications on shared infrastructure, like in Kubernetes. As the team deployed dozens of such over-powered VMs with multiple instances of our applications, it turned out we are spending thousands of USD per month on compute resources we do not really use.
{% endcapture %}
{% include case-study-context.html content=unshared_resources %}

The problem here is primarily that since each individual application had its own, dedicated compute resources, they were all deployed with _prepare for the worst_ mindset. Applications might be provisioned with plenty of CPU power simply because they are demanding at startup time. During runtime, though, they could barely use any of their assigned resources. As they would not share resources with each other, this would be done over and over again.

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

{% capture log_ingest %}
At Coinworth, we ran hundreds of microservices maintained by a plethora of individual teams. As it happens, each of these microservices had its own logging to instrument traffic handled by them. For some time, I was a member of one team owning only a handful of services, however they were dealing with massive traffic. Being at the center of the business as Tier 1 services, they produced equally massive amount of log data. In one case, the team's efforts to reduce costs included third-party log processing billing - by eliminating excessive logging, such as some uninformative _INFO_ level logs led to cutting the log processing costs by 20%, which translated to dozens, if not hundreds of thousands of USD in savings. 
{% endcapture %}
{% include case-study-context.html content=log_ingest %}

There are several reasons why excessive logging:
- From the costs perspective, it leads to over-spending on log processing provided by 3rd party vendor, or forces the organization to maintain more powerful log processing solution with more hardware resources, which also costs money. 
- On the other hand, applications churning out plenty of not-so-useful logs essentially generate noise that makes troubleshooting harder. Spending time on writing queries to filter out redundant logs - rather than irrelevant for a particular search - is a good indicator our logs might be of poor quality.
- Lastly, the sheer volume of logs may lead to running out of processing quotas with our vendor, or to running out of storage space, forcing us to cut down on logs retention. The volume also contributes to more time-consuming and costly logs processing. Worst case scenario is when after running out of quotas, the log server would simply drop new logs altogether, regardless of their criticality.

All in all, it is better to emit fewer logs providing more condensed, and well-formatted (for ease of processing) logs that to try to log everything, or log pieces of information we will not only find useless, but we will actively avoid as they prevent us from gathering useful insights.

{% capture log_ingest_insight %}
As Software Engineers, we need to balance the need for logging with cost effectiveness and physical limitations of our logging solutions. The logs should be relevant, information dense, easy to process, and the volume should be manageable. This helps us save money and our time, while also decreasing the likelihood of non-technical decision-makers introducing more drastic measures.
{% endcapture %}
{% include key-takeaway.html content=log_ingest_insight %}

## Maintenance cost and overhead

{% capture maintenance_overhead %}
Many of us will remember last weeks of 2021 forever, due to the infamous <a href="https://en.wikipedia.org/wiki/Log4Shell">Log4Shell</a> vulnerability that affected numerous companies around the world. At this time, I was working for Glennham Microsystems, yet another company operating on hundreds of Java microservices. When Log4shell came out at the onset of pre-Christmas code freeze, we were in serious trouble. Company policies would impose top-heavy approval process for each change deployed during code freeze, some services had some changes merged into deployment branches but not deployed before code freeze for one reason or another, and the sheer number of applications that required patching proved problematic, even if an individual patch was trivial. Subsequent releases and new vulnerabilities found in Log4j made the upgrades even more nervous.
{% endcapture %}
{% include case-study-context.html content=maintenance_overhead %}

In some aspects, microservices make it way easier to maintain extensive software - smaller applications are arguably easier to run, configure and work on if considered in isolation from other parts of the system. On the other hand, however, they can drastically increase the maintenance cost, and maintaining dependencies of each individual microservice often gets neglected. Another contributing factor is lack of proper tooling - without [Dependabot](https://github.com/dependabot) or other automated patching tools, it becomes especially painful to upgrade vulnerable dependencies across dozens, if not hundreds of applications.

{% capture maintenance_overhead_insight %}
Building excessively granular microservices is bound to increase maintenance overhead of a distributed system. This becomes especially apparent when large number of individual applications is combined with insufficient tooling or when urgent security patching is required. It often leads to neglect or hectic, risky moves - therefore, it is worth considering if such granularity is truly needed.
{% endcapture %}
{% include key-takeaway.html content=maintenance_overhead_insight %}

## Resource-hungry tech stack

{% capture resource_hungry_stack %}
In multiple companies, including Baffled Waffles, Coinworth and Glennham Microsystems, I have seen Java-based microservices implemented with Spring Boot framework. As it turns out, it is rather typical to run these services with at least one full, dedicated vCPU core to initialize the application in reasonable time, and then at least 1-2GB of RAM, depending on application size and traffic. Meanwhile, similar microservices with similar workloads, but written in NodeJS tended to utilize 0.1-0.2 worth of vCPU core quite consistently, and peaked at 300MB RAM.
{% endcapture %}
{% include case-study-context.html content=resource_hungry_stack %}

While Java by itself performs quite well, especially with all the optimizations that had been added to JRE over the years, it happens to be quite resource hungry when paired with massive, runtime-intensive frameworks such as Spring / Spring Boot. Once the application is fully started, it does not require much in terms of computing power, meaning that with shared vCPU resources it is possible to optimize CPU resource utilization. On the other hand, high usage of RAM is rather consistent, and makes it difficult to avoid over-provisioning of compute resources for the sake of fitting all the Java applications in.

You can read more on Java inefficiencies in cloud computing in [Does Java make a good fit for microservices?](/posts/does-java-make-a-good-fit-for-microservices/) - this is not to say, however, that Java is the only programming language. It is more related to some of it's Virtual Machine defaults, and resource-hungry frameworks such as Spring / Spring Boot. Simply avoiding a particular programming does not guarantee applications would magically become efficient.

{% capture resource_hungry_stack_insight %}
As Software Engineers, we should be mindful about the trade-offs of various technologies we consider for our distributed systems and microservices. In case of compute resource requirements being disadvantageous for a tech stack we decide on, we must find ways to balance these disadvantages, and take efforts to make the best out of particular technology's strengths while minimizing the impact of its deficiencies.
{% endcapture %}
{% include key-takeaway.html content=resource_hungry_stack_insight %}

## Unrestricted scalability

{% capture unrestricted_scalability %}
Baffled Waffles already had problems with Software Engineers over-provisioning Kubernetes resources for their microservices. This was made possible by the fact that the Kubernetes clusters would simply scale out endlessly - the more resources Software Engineers would request, the more our clusters would scale out. This means that this over-provisioning never became quite visible for Software Engineers, who would rarely if ever suffer from failures to provision requested resources or some throttling.
{% endcapture %}
{% include case-study-context.html content=unrestricted_scalability %}

Scalability is an immensely powerful feature of cloud-based microservices, as it allows organizations to adapt to changing demand for their services. It does not mean, however, that this scaling should be completely unrestricted - sometimes it simply makes sense to put a cap on how much an infrastructure or software components can scale up or out. Imposing some limits on resource utilization by the clients or Software Engineers can save us headache when invoices are sent.

In some cases, scalability is not even strictly needed. One example of such needless scaling could be situations where a microservice starts to choke, but the real problem is its underlying database's throughput rather than the application itself. In such cases, scaling out an application could even be counter-productive, as it could put even more strain on an already struggling database. It could also happen that the service's API is being abused by another application or some third party.

More practical solution to such issues would be to carry out an audit and act accordingly to the root cause:
- Introduce caching (if possible) to reduce needless processing,
- Impose rate limits to reduce the risk and scale of abuse,
- Address bottlenecks case-by-case:
  - If an application runs out of DB connection pool, increase the pool's size to allow serving more simultaneous requests by the same instance of application,
  - If an underlying database struggles, investigate its load and whether they way it is used could be optimized - for instance, by improving indexes,
  - If it is not feasible to further optimize a single database instance, consider replication to offload read-only transactions, or a database cluster for overall scalability improvement,
- Ultimately, when the application's capacity truly becomes a bottleneck, it is time to scale it out.

{% capture unrestricted_scalability_insight %}
There is a number of ways to increase a microservice's capacity to handle more traffic before having to resort to scaling out. If you consider increasing the number of instances as a solution for your application's struggles, explore if other options are available first, and whether scaling out would solve the problem in the first place. This approach, as opposed to scaling out blindly, will not only help you utilize resources more efficiently, but also give you confidence that whatever decision is made, it is well-grounded.
{% endcapture %}
{% include key-takeaway.html content=unrestricted_scalability_insight %}

## Barely used applications

{% capture barely_used_applications %}
One of the issues we suffered from at Coinsworth was that in some domains, the microservices became excessively granular. While the system in general would serve millions of customers every day, some serviced were so infrequently used, and so narrow in scope in fact, that 99% of the time they would simply idle. Nevertheless, they turned out to be given just as much dedicated compute resources as microservices that truly did the heavy lifting.
{% endcapture %}
{% include case-study-context.html content=barely_used_applications %}

The problem is that with dedicated resources reserved for a particular application, if they are not used by this particular application, nobody else can come and put them to a better use. Likewise, since they were already provisioned by the cloud vendor, they would be billed regardless of the extent to which they were truly utilized. 

Deploying minuscule, low-traffic applications with dedicated, powerful resources is a highly inefficient approach, and if it becomes widespread it can incur non-trivial costs for compute resources which cannot ever be fully utilized.

{% capture barely_used_applications_insight %}
One way to minimize the negative impact of running multiple applications with extremely low traffic and/or resource requirements is to run them on shared resources - for instance, by utilizing orchestration. This way, even if they do not require much in terms of compute resources, many such applications can run on a single, normal-sized node, ensuring more efficient utilization. Another approach is to opt for serverless / FaaS architecture in case of rarely used, small microservices - while function invocations can be expensive at scale, when traffic is low this may prove more economical in the long run.
{% endcapture %}
{% include key-takeaway.html content=barely_used_applications_insight %}

## Summary

While by no means exhaustive, these examples of cost inefficiencies should give an idea of how cost inefficiencies manifests themselves in distributed systems, most notably in cloud-based microservice architecture, and how they could be addressed.

Moreover, these particular case studies show that cost reduction does not necessarily mean giving up the quality - on the contrary, in case of distributed systems it is not uncommon for cost optimization and quality improvements to go hand in hand. If the root cause of cost inefficiency is over-engineering, over-provisioning or unsuitable architecture, addressing these issues can be in fact beneficial for Software Engineers building and maintaining these systems.