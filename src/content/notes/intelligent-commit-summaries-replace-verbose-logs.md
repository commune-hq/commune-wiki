---
title: Intelligent commit summaries replace verbose logs
created: 2025-10-17
visibility: public
status: live
tags: [commune, ai, discovery, git]
aliases: ["commit history analysis", "smart summaries", "ai commit analysis"]
updated: 2025-10-17
summary: AI analyzes git commits daily and generates smart summaries of what you're working on. Clusters by theme, weighs by significance. No verbose logs.
---

Following someone's GitHub commits is painful. Too much noise. "Fixed typo" commits mixed with meaningful changes.

I want an AI that analyzes my commit history every day and tells people what I'm actually working on. Not every single edit. The themes.

A cron job runs daily. It looks at all commits since it last ran. Uses an LLM to cluster by theme and topic. Weighs by significance. If I edit 100 notes one day and 2 the next, those days aren't equal.

The output is smart summaries. "Working on subscription model this week (4 notes created, 2 updated)." Links to the specific notes. You can expand for more detail.

This becomes the discovery mechanism for [[Commune]]. Shows what I'm working on without the dopamine loops of social feeds. Just actual work with clear reasons.

The free version shows recent summaries on [[Homepage cards triage discovery]]. The full changelog with every detail is paywalled. [[See what I'm working on]] explains the concept.

This is how you follow someone's thinking without getting addicted to checking for updates.
