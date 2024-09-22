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
{% include case-study-context.html content=migration_insights %}

## Secretly committed secrets

{% capture secrets_overlooked %}
At Kravitz, accidentally committing one's credentials into company repositories was something so prevalent the Security Team has written down an entire procedure on how to remove and rotate the leaked credentials - but even then, when I did that mistake too and committed some test environment API key, there was no secret scanning in place. I had to realize I did, in fact, commit that API key and then self-report to the Security Team, who guided me through manual removal of the secret from the server's git history (sic!) and rotation of the credential. Unsurprisingly, when going through the history we even managed to find some other secrets committed and later reverted - and who knows if they ever got rotated anyway...
{% endcapture %}
{% include case-study-context.html content=secrets_overlooked %}

{% capture secrets_scanning %}
The story was entirely different with Turing Systems, though. There, Security Team rolled out automated secret scans for repositories - initially as an opt-in feature - ant sent out reports to the service owners about how many secrets were found in each repo. In case secrets were found, service owners would be urged to revoke and rotate all leaked credentials, and of course to remove the old credentials from the repository, but without rewriting the history. The company shared statistics on the progress of credentials removal on a regular basis, even. 
{% endcapture %}
{% include case-study-context.html content=secrets_scanning %}

Acknowledging that a company lags behind in terms of security is a hard pill to swallow, however it is a crucial first step towards improving the situation. In the world where companies, hospitals and government organizations fall victim to security breaches, data theft and ransomware attacks building security awareness within an organization is of utmost importance.



## We provision what we need, and quadruple that for a good measure

## This is not how our users behave