---
title: The Star
created: 2025-10-16
visibility: public
status: live
tags: [commune, features, gamification]
aliases: ["star", "star-system", "star-feature"]
updated: 2025-10-16
summary: A Commune feature marking notes that anchor key ideas in your wiki—top 5% by backlinks, inspired by Skool's approach to recognizing contributors.
---

The Star is a [[Commune]] feature that marks notes in the top 5% by backlinks. When other notes link to something often, it anchors key ideas in your wiki. The star (⭐) makes that visible.

This isn't about popularity. It's about centrality. When your wiki shows which ideas carry weight across your thinking, you see patterns you'd miss otherwise. The system borrows from [[Skool]]'s approach: recognize top contributors with a visible badge. Here, the badge goes to ideas, not people.

Stars appear inline with the title—[[Titles are takeaways, not labels|Skool-style]], right next to the note name. Click the star and you get a modal that explains what it means. No underlines, no distractions. The star is a separate element because clicking it opens the explanation, not the note.

The ranking logic lives in a single config file. I want to experiment with this—maybe stars should factor in revisions, cross-theme links, or time decay. The system needs to stay tunable because [[Evergreen Notes]] evolve, and what counts as "important" might shift as the wiki grows.

Stars help readers discover high-value notes without AI summaries, which connects to [[Subscription unlocks depth into the mind]]. They support [[Build in Public]] by showing what ideas compound over time. The feature emerged from wanting [[Gamification drives self-discovery]]—surface the best work, make progress visible, keep people engaged.

For now, backlinks alone decide rankings. Top 5%, relative not absolute, to prevent gaming. Clean, simple, tunable.
