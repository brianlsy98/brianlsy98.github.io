---
title: "Efficient Yet General Pretraining for Integrated Circuits"
description: "How transistor-level graph contrastive pretraining improves generalization for ICs."
publishDate: "2025-05-28"
tags: ["GraphML", "Pretraining"]
showOnSite: true
---

## Pretrained LLMs

Large Language Models (LLMs) have clearly reshaped our world at an unprecedented scale. They are increasingly general-purpose problem solvers, and as of 2026, systems like ChatGPT, Gemini, and Claude can write code, solve math problems, and retrieve information better than most people.

A standard pipeline for building production-ready LLMs has two stages: $$\textcolor{green}{\texttt{(1) pretrain}}$$ and $$\textcolor{green}{\texttt{(2) fine-tune}}$$ for specific tasks. Think of pretraining as learning the patterns of text, and fine-tuning as specializing in specific problems such as math.

Because of this, the core of model pretraining is making models as ***"general"*** as possible, so that they can transfer well across many tasks. Supervised training tends to specialize a model for particular objectives. For example, memorizing every word in the Oxford dictionary does not automatically make someone a good writer. For this reason, prior work has relied heavily on ***unsupervised learning*** so models can capture broad statistical patterns in text. This helps pretrained LLMs generalize across diverse language tasks.

## LLMs for Integrated Circuits: Is It Efficient?

LLMs are pretrained to generalize well on many "language processing" tasks. However, what if the fundamentals of our target tasks are not in the language itself? We may not need the full capacity of large-sized LLMs.

In this blog post, I will introduce one efficient way to pretrain models specifically for ***"Integrated Circuits (ICs)"***. If we observe how specialized IC designers design circuits, the process does not rely on the characteristics of language, but rather on graph abstractions of circuits and logical reasoning over these graphs.

Therefore, if we narrow down our target domain to Integrated Circuits,
<blockquote style="text-align: center;">
  <strong>the fundamentals are in how the circuit components are connected.</strong>
</blockquote>

## Requirements

Given this fundamental idea, how can we pretrain a general-purpose model for circuits?

First, we need the model to process circuits represented at the $$\textcolor{green}{\texttt{"transistor-level"}}$$. Based on the processed signals, circuits are categorized as either analog or digital, and transistor-level graph abstraction is the only way to cover both categories. Mixed-signal circuits such as Analog-to-Digital Converters (ADCs) and Phase-Locked Loops (PLLs) are core components of modern Application-Specific Integrated Circuits (ASICs), but logic gate-level graph abstraction is not enough to represent these circuits on its own.

Second, we need a $$\textcolor{green}{\texttt{"large dataset with diverse structures"}}$$. Unlike the abundant data used for LLM pretraining, there is a lack of data containing diverse circuit topologies at the transistor-level. Structural diversity is important because the model should learn the patterns of how different circuit elements are connected.

Third, we need $$\textcolor{green}{\texttt{"signal-agnostic pretraining"}}$$. This is because setting the input signal to the circuit immediately makes the data task-specific. For example, consider a simple circuit with a resistor and capacitor connected in series, where the capacitor is also connected to the ground node and the resistor is connected to the input signal node. Setting the input signal to either AC or DC changes the behavior of the circuit, particularly the voltage node between the resistor and the capacitor. However, we want a single useful embedding per circuit structure that remains useful even with varying signals.


## Challenge

TODO

## Key Idea

TODO

## Proposed Method

TODO

## Results

TODO

## Takeaway

TODO
