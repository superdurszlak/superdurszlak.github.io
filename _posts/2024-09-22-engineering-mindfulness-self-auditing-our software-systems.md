---
layout: post
title: "Engineering mindfulness: Self-auditing our software systems"
case_study: true
jargon_heavy: true
stock: metrics-screen
tags: 
  - "audit"
  - "infrastructure"
  - "case-study"
---

## Abstract

Time and again, we take each other and our future selves by surprise - by not collecting metrics, not documenting our software projects and APIs, or by forgetting that something important is running on that cobweb-covered server we are about to unplug.

We all learn from mistakes, though it is only as effective as our ability to spot them - and we should rather spot and correct them before they cause significant damage. In this post, we will see how various forms of self-auditing can help us avoid cost inefficiency, future outages and security incidents.

## Tis' but a migration

{% capture migration %}
Walnut Donuts offers their product suite as a SaaS, cloud-based offering for enterprise customers. At the onset of the journey, all production traffic from all over the world was hosted in a single AWS region, however for compliance with regulatory requirements we had to store and handle customer data from specific geographies within certain jurisdictions - which necessitated migrating to a multi-region infrastructure. Unfortunately, the engineering teams were the last to be informed about the migration, as it was expected the systems could be deployed as-is to new regions, and the data migrated there without much planning or software / infrastructure changes.
{% endcapture %}
{% include case-study-context.html content=migration %}

The rushed initiative to migrate from single-region to multi-region naturally raised concerns among Software Engineers, who were informed about the plan mere weeks before the deadline. Knowing that some of our software and infrastructure components may not be ready for such migration, we pressed the leadership to first conduct an audit of all components that could be affected by this migration, and at the very least perform dry-runs and drills to discover any possible challenges.

Luckily, the leadership took our concerns seriously and each component - microservices, through databases, CI/CD jobs, tenant provisioning pipelines etc. - was thoroughly reviewed for any issues with going multi-region. In fact, we did find a number of blockers that would prevent us from actually migrating anyone, and a few other issues of varying severity that could lead not only to outages, but also to irreversible data corruption. The drills, dry-runs and carrying out a few migrations of non-production tenants we had allowed us to prepare detailed runbooks for the support team, which would be directly involved in performing the migration.

All these efforts led to one of the most seamless migrations I have ever participated in - all critical edge cases were covered, and the support team knew exactly what to do to ensure smooth migration. They were provided with step-by-step instructions in our runbooks, so that they would not need to improvise in the most stressful moments, and all foreseeable side-effects were described, including advice whether a particular side-effect needs to be tended to, or if the support team should alert our on-calls. At the end of the day, the migration was a success, and we probably saved our customers' data, as well as our employer's reputation.

{% capture migration_insights %}
Even though the migration audit at Walnut Donuts was rushed due to tight deadlines imposed by the regulator and initial miscommunication, at the end of the day it allowed us to avert tremendous risks to the migration effort. 
{% endcapture %}
{% include key-takeaway.html content=migration_insights %}

## Secretly committed secrets

{% capture secrets_overlooked %}
At Shenanigans Ltd., accidentally committing one's credentials into company repositories was something so prevalent the Security Team has written down an entire procedure on how to remove and rotate the leaked credentials - but even then, when I did that mistake too and committed some test environment API key, there was no secret scanning in place. I had to realize I did, in fact, commit that API key and then self-report to the Security Team, who guided me through manual removal of the secret from the server's git history (sic!) and rotation of the credential. Unsurprisingly, when going through the history we even managed to find some other secrets committed and later reverted - and who knows if they ever got rotated anyway...
{% endcapture %}
{% include case-study-context.html content=secrets_overlooked %}

{% capture secrets_scanning %}
The story was entirely different with Turing Systems, though. There, Security Team rolled out automated secret scans for repositories - initially as an opt-in feature - ant sent out reports to the service owners about how many secrets were found in each repo. In case secrets were found, service owners would be urged to revoke and rotate all leaked credentials, and of course to remove the old credentials from the repository, but without rewriting the history. The company shared statistics on the progress of credentials removal on a regular basis, even. 
{% endcapture %}
{% include case-study-context.html content=secrets_scanning %}

Acknowledging that a company lags behind in terms of security is a hard pill to swallow, however it is a crucial first step towards improving the situation. In the world where companies, hospitals and government organizations fall victim to security breaches, data theft and ransomware attacks building security awareness within an organization is of utmost importance.

Shenanigans Ltd. might have had confidence that with all the procedures in place, they must be in a pretty good place in terms of security. What they did not seem to realize, though, was that the procedures actually discouraged Software Engineers from, following them - as the first step was for the Engineer to notice their mistakes, and then go through a laborious remediation that possibly wasn't even needed, given that the credentials would be rightly revoked and rotated as one of the remediation steps. This overconfidence can be dangerous - after all, a single leaked credential that went unnoticed is sometimes all that is needed for a severe security incident.

Turing Systems, on the other hand, were forced to accept the bitter truth that they lagged behind in terms of security. What is crucial, though, is that they were at least set out on a path to address their leaks and solve the problem systemically. With automated credential leaks detection and simpler procedures, Turing Systems are far more likely to succeed in securing their systems.

{% capture secrets_insights %}
Having <i>some</i> auditing and remediation procedures in place is simply not enough to make things run smoothly. In order for a procedure to be effective, it must also be enforceable - and should not be made more complex than necessary, otherwise it is doomed to be bypassed or outright ignored. Automating audits and measuring progress with clearly defined metrics are key to turn company-wide efforts into a journey towards a goal, rather than wandering helplessly in the dark.
{% endcapture %}
{% include key-takeaway.html content=secrets_insights %}

## We provision what we need, and quadruple that for a good measure

{% capture infrastructure %}
Bahama Estates served millions of individual customers around the world, and their systems were powered by over a hundred Java microservices running multiple instances for High Availability. For a long time, the costs of 3rd party cloud infrastructure were not considered a concern, and nobody asked questions about how we provision Kubernetes CPU and memory for our microservices. One day, DevOps Engineers approached me and asked if I am aware how much it costs the company to over-provision Kubernetes for our team. Since I did not know the answer, I resorted to building Grafana dashboards on top of resource utilization metrics to find an answer for us.
{% endcapture %}
{% include case-study-context.html content=infrastructure %}

What I found out was not only that we were quite wasteful as a team - over-provisioning memory and CPU by **well over 200%** each, taking our peak traffic utilization as a baseline. Even more alarming was that we were no outliers, in fact teams that provisioned adequate resources were few and far between, and the rest made similar mistakes as we did - requesting far more than their services would ever use, meaning that our Kubernetes clusters were excessively scaled out, perpetually. 

A brief audit had shown that in production and staging clusters, we could reduce over-provisioning by a staggering 300-400 vCPUs and 250-400 GB RAM each, if only the teams requested resources approximately matching their peak utilization, and probably more if requests would be closer to average utilization and the rest handled by resources limits. Depending on how exactly cloud computing resources were provisioned, these numbers could translate to 70-100 VMs with 4 vCPUs and at least 4GB RAM each, similar to AWS EC2 _\_\_\_.xlarge_ instances, or 35-50 more powerful ones at 8 vCPUs and no less than 8GB RAM, roughly equivalent to _\_\_\.2xlarge_ AWS EC2 VM. Depending on factors such as region, instance type, size and provisioning model, we can estimate the cost of 1vCPU + &ge;1GB RAM in [AWS](https://aws.amazon.com/ec2/pricing/on-demand/) as approximately $0.03-$0.07 per hour. Taking $0.05 as an average, and the over-provisioning as approximately 700 vCPUs and 700GB RAM total, we can estimate our wasteful approach cost the company ca. $35 per hour, $840 per day, **over $25k per month** or **over $300k per year** in compute resources alone.

With that knowledge, we set out with DevOps Team to inform other Engineering Teams about the need to optimize resource utilization. Soon after, we started cutting excessive provisioning, allowing to significantly reduce the costs of our Kubernetes clusters without affecting system performance or reliability.

{% capture infrastructure_insights %}
Collecting metrics about your system is one thing, and keeping an eye on them is another. A mindful Engineering Team should not only set up metrics and logs collection and call it a day, we also need to make use of the data we collect, as it can indicate issues such as inefficient resource management.
{% endcapture %}
{% include key-takeaway.html content=infrastructure_insights %}


## This is not how our users behave