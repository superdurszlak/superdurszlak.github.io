---
layout: page
title: About
permalink: /about/
---

{% assign about_page = site.pages | where: "path", "about.md" | first %}
{% assign intro_post = site.posts | where: "slug", "on-distributed-systems" | first %}

## Hello! Cześć! Hallo!

I am happy to see you visit my website :smiley: As you can see, it looks rather dry and is not particularly content-rich - I hope to address the latter over time. As far as aesthetics go - I have nothing to do with front-end development after all, and there is not much I am able to do just yet, except for, say, picking a nicer Jekyll theme, or using a fancier diagramming tool than PlantUML :see_no_evil:

### Why do I work with distributed systems at all?

Long story short, I love problem solving, and this kind of software systems is ridden with problems to solve :scream:

At first, many years ago, I did not even realize there is such a thing as a "distributed system". In fact, I barely knew that all the programs are somehow written in a plethora of arcane programming languages, which I had no idea about back at the time. Luckily for me, this had changed gradually ever since I started learning to code sometime in mid - high school, and when I first learned about concurrency and parallel programming as a freshman, my fate was sealed.

Immediately, I found it quite fascinating just how much can be achieved by doing things concurrently one way or another - by running your programs on multiple threads, then on multiple processes, and ultimately on multiple computers. I also had multiple opportunities - often first-hand, sometimes from the lecturers or the books - to learn about peculiarities of all these parallel and distributed systems, when they can truly shine, and how a Software Engineer can play to their strengths while limiting the impact of their drawbacks. These first lessons were later supported with years of professional experience with all kinds of systems, big and small - and here I am, an awkward Software Engineer who does not get discouraged nor terrified by their inherent complexity :wink:

In fact, I dedicated my very first post to this particular topic: [{{ intro_post.title }}]({{ intro_post.url }})

## Goals

As a Software Engineer, I focus primarily on designing, implementing and deploying distributed systems as well as SDLC processes around them - which I see as an umbrella term for any kind of software systems, where multiple components or processes run simultaneously, usually on a number of devices connected via network, to complete the task at hand. Most importantly, I aim to build systems in a way that ensures their resiliency, ease of maintenance and security, all the while automating the bulk of time-consuming activities around them to save the time of our future selves.

I value work environments where meritocracy, proactivity and open communication are valued - being a direct communicator and an individual with a strong focus on problem-solving and deliverables, I find it far more important to arrive at an optimal solution based on analytical and factual inputs, rather than to preserve the status quo or protect anyone's ego - including mine. It is not uncommon for me to hold strong opinions and get into heated discussions, however I am also able to pivot and support an idea I initially disagreed with in face of facts and evidence.

## Professional experience

My first professional experiences date back to mid-2016, and I have been continuously present on the job market since mid-2017, initially as a working student. The first projects I participated in were exceptionally diverse - from simple REST APIs, through data science to working with compilers - and required me to learn new technology stacks from the ground up - be it Assembly language for an exotic architecture, Python, Java/Kotlin. This ability to adapt to various technologies and languages shaped my mindset as a Software Engineer, seeing frameworks and languages as tools meant to accomplish a task at hand and which can be learnt, rather than something to be used for the sake of using it, and committing oneself to only one of them.

Since mid-2019, I have been able to work with a plethora of distributed systems architectures, synchronous and asynchronous alike, such as:
- Microservices in a number of flavours, from ones granular beyond practicality to monoliths in disguise, 
- Distributed sharded monoliths,
- Serverless apps.

In my experience, almost invariably the system design and infrastructure turned out to be critical for the success or demise of a distributed system, and hence these areas became my focus over the years. When dealing with such complex software systems, where things can go wrong in unexpected ways regardless of code quality, I learned that most problems can be solved more efficiently by improving the design, infrastructure and/or SDLC processes rather than by throwing new code changes at the problem. More often than not, the latter approach only made it harder to reproduce and address the problem when it came back at us.

## Education

I have a MSc degree in Applied Computer Science, attained in 2019 at AGH University of Science and Technology in Kraków, Poland. I graduated from the Faculty of Metals Engineering and Industrial Computer Science - while the combination of CS and metallurgy, solid/fluid mechanics and numerical modelling may seem rather unusual, our curriculum had quite a strong focus on parallel and distributed computing, as well as computer simulations of various physical / mechanical processes - which provided me with strong foundations for future work with distributed systems.

## Trivia

- Many times I had been asked what made me choose this odd `superdurszlak` nickname. The story is rather simple - I was looking for a username for my Gmail account and `name.surname@gmail.com` was already taken. Not being a fan of email addresses including digits, I typed the first thing that came to my mind and had similar initials to mine - and it was free!
- Even though my nickname includes a reference to a sieve - `durszlak` in Polish - I am not affiliated with Flying Spaghetti Monster followers in any way :wink:
- I have been diagnosed with Autism Spectrum Disorder / Asperger's Syndrome, and the most visible symptom is that I find it challenging to navigate work environments where direct communication is to be avoided, and a lot of things should be read between the lines. In such circumstances, it is almost guaranteed I would commit one faux pas after another and not even realize it.
- Yes, I am aware of the [rather embarrassing meaning](https://en.wiktionary.org/wiki/%D0%B4%D1%83%D1%80%D0%B0%D0%BA) of my last name - and haven't changed it regardless. 

