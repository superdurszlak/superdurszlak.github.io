---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: "Home"
---

{% assign about_page = site.pages | where: "path", "about.md" | first %}
{% assign intro_post = site.posts | where: "slug", "on-distributed-systems" | first %}

## Hello! Cześć! Tschüs!

I am happy to see you visit my website :smiley: As you can see, it looks rather dry and is not particularly content-rich - I hope to address the latter over time. As far as aesthetics go - I have nothing to do with front-end development after all, and there is not much I am able to do just yet, except for, say, picking a nicer Jekyll theme, or using a fancier diagramming tool than PlantUML :see_no_evil:

### Why do I work with distributed systems at all?

Long story short, I love problem solving, and this kind of software systems is ridden with problems to solve :scream:

At first, many years ago, I did not even realize there is such a thing as a "distributed system". In fact, I barely knew that all the programs are somehow written in a plethora of arcane programming languages, which I had no idea about back at the time. Luckily for me, this had changed gradually ever since I started learning to code sometime in mid - high school, and when I first learned about concurrency and parallel programming as a freshman, my fate was sealed.

Immediately, I found it quite fascinating just how much can be achieved by doing things concurrently one way or another - by running your programs on multiple threads, then on multiple processes, and ultimately on multiple computers. I also had multiple opportunities - often first-hand, sometimes from the lecturers or the books - to learn about peculiarities of all these parallel and distributed systems, when they can truly shine, and how a Software Engineer can play to their strengths while limiting the impact of their drawbacks. These first lessons were later supported with years of professional experience with all kinds of systems, big and small - and here I am, an awkward Software Engineer who does not get discouraged nor terrified by their inherent complexity :wink:

In fact, I dedicated my very first post to this particular topic: [{{ intro_post.title }}]({{ intro_post.url }})

### Learn more

Feel free to visit [{{ about_page.title }}]({{ about_page.url }}) if you would like to learn more about my background.

