---
title: "Accurate transcription requires training the model on personal proper nouns and context"
created: 2025-10-09
visibility: "public"
summary: "Speech-to-text accuracy depends on teaching the system your specific vocabulary, names, and contexts"
tags: ["transcription", "training", "proper-nouns", "context"]
---

You need to train the model on proper nouns. When I mention Matt and Joel, I'm talking about my business partners. When I mentioned Matthew, that's the guy from Ireland. I should be able to track every time I mentioned them forever, locally.

Standard transcription models are trained on generic datasets. They know common names and places, but they don't know *your* specific vocabulary:
- Business partner names
- Project codenames  
- Industry-specific terminology
- Personal abbreviations and shortcuts
- Location names that matter to you

The solution requires [[Local systems require "Enhancement Dashboards" for user-in-the-loop model training]]. You need an interface to teach the system your specific context.

Training approach:
1. **Initial raw transcription**: Capture everything, even if imperfect
2. **Correction interface**: Mad Libs-style editing to fix errors
3. **Entity recognition**: Tag people, places, projects as you correct
4. **Context building**: Link entities to relationships and background information
5. **Continuous improvement**: System learns from corrections over time

This enables [[Deeply personalized AI can analyze relationships and optimize communication strategies]]. When the system accurately captures who you're talking about, it can provide meaningful relationship insights.

The payoff is massive: instead of spending time cleaning up transcripts, the system gets better at understanding your specific communication patterns and vocabulary.
