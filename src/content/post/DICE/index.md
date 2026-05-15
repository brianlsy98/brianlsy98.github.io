---
title: "Efficient Yet General Pretraining for Integrated Circuits"
description: "How transistor-level graph contrastive pretraining improves generalization for ICs."
publishDate: "2025-05-28"
tags: ["GNN", "Pretraining"]
showOnSite: true
---

## Pretrained LLMs

Large Language Models (LLMs) have reshaped our world at an unprecedented scale. They are increasingly general-purpose problem solvers, and as of 2026, systems such as ChatGPT, Gemini, and Claude can write code, solve math problems, and retrieve information better than many people can.

A standard pipeline for building production-ready LLMs has two stages: $$\textcolor{green}{\texttt{(1) pretrain}}$$ and $$\textcolor{green}{\texttt{(2) fine-tune}}$$ for specific tasks. Think of pretraining as learning broad patterns in text, and fine-tuning as specializing those patterns for specific problems such as math.

Because of this, a key goal of pretraining is to make models as ***"general"*** as possible, so they can transfer well across many tasks. Supervised training tends to specialize a model for particular objectives. For example, memorizing every word in the Oxford dictionary does not automatically make someone a good writer. For this reason, prior work has relied heavily on ***unsupervised learning***, which allows models to capture broad statistical patterns in text. This helps pretrained LLMs generalize across diverse language tasks.

## LLMs for Integrated Circuits: Is It Efficient?

LLMs are pretrained to generalize well across many "language processing" tasks. However, what if the fundamentals of our target tasks are not linguistic? In that case, we may not need the full capacity of large LLMs.

In this blog post, I will introduce one efficient way to pretrain models specifically for ***"Integrated Circuits (ICs)"***. If we look at how specialized IC designers design circuits, the process does not rely on the characteristics of language. Instead, it relies on graph abstractions of circuits and logical reasoning over these graphs.

Therefore, if we narrow our target domain to integrated circuits,
<blockquote style="text-align: center;">
  <strong>the fundamentals are in how the circuit components are connected.</strong>
</blockquote>

## What do we need?

Given this fundamental idea, how can we pretrain a general-purpose model for circuits?

First, we need the model to process circuits represented at the $$\textcolor{green}{\texttt{"transistor-level"}}$$. Depending on the signals they process, circuits are categorized as either analog or digital, and transistor-level graph abstraction is the only way to cover both categories. Mixed-signal circuits such as Analog-to-Digital Converters (ADCs) and Phase-Locked Loops (PLLs) are core components of modern Application-Specific Integrated Circuits (ASICs), but logic gate-level graph abstraction is not enough to represent these circuits on its own.

Second, we need a $$\textcolor{green}{\texttt{"large dataset with diverse structures"}}$$. Unlike the abundant data used for LLM pretraining, there is a lack of data containing diverse circuit topologies at the transistor level. Structural diversity is important because the model should learn the patterns of how different circuit elements are connected.

Third, we need $$\textcolor{green}{\texttt{"signal-agnostic pretraining"}}$$. Setting the input signal of a circuit immediately makes the data task-specific. For example, consider a simple circuit with a resistor and capacitor connected in series, where the capacitor is also connected to the ground node and the resistor is connected to the input signal node. Setting the input signal to either AC or DC changes the behavior of the circuit, particularly the voltage at the node between the resistor and the capacitor. However, we want a single useful embedding per circuit structure that remains useful under varying signal conditions.

## Main Challenge: "Data Augmentation"

Therefore, we need:

<div align="left">

(1) a large circuit dataset that contains diverse transistor-level graph structures, and
\
(2) a pretraining strategy that does not depend on electrical signals.

</div>

<blockquote style="text-align: center;">
  <strong>However, no prior work fully addresses these requirements.</strong>
</blockquote>

First, previous transistor-level circuit datasets are formed from an exponentially large number of ***"parameter combinations"***, rather than from diverse circuit structures. For example, let's say we have a circuit with 10 components, each with 5 possible parameter choices. In that case, the number of data points generated from this single circuit structure is $$5^{10}=9765625$$, which is huge.

Second, training transistor-level circuit models without signals has rarely been addressed in prior work. This is because the major focus has been on ***"solving specific tasks"***, which requires modeling how each circuit processes task-related electrical signals. Prior work has not focused on learning the structural patterns within each circuit.

So the main challenge is ***"how to expand circuit datasets with diverse transistor-level structures, and pretrain without signals"***. Since there is a limit to manual generation,

<blockquote style="text-align: center;">
  <strong>we need a "graph augmentation" strategy that is valid even without signals.</strong>
</blockquote>

## Key Intuition: "R + R = 2R"

How can we do this? For image data augmentation, transformations such as rotation and flipping can greatly change the data values while preserving similar semantics. Can we take a similar approach for transistor-level circuits?

Yes, we can. Here is our key intuition:

<blockquote style="text-align: center;">
  <strong>Any electrical component within a circuit can be approximated by two identical devices connected in series or in parallel.</strong>
</blockquote>

![Intuition](/post/DICE/figures/RR2R.svg)

For example, suppose a base circuit has a resistor with value R. We can substitute this resistor with two parallel resistors, each with value 2R. The two circuits are electrically equivalent at the graph abstraction level, but they have different topologies!

## Proposed Method

With this key intuition in mind, ***"Contrastive Learning"*** becomes a natural choice. Contrastive learning learns useful embeddings by clustering embeddings with similar semantics (i.e., positive pairs) and pushing away embeddings with different semantics (i.e., negative pairs). In our case, for transistor-level circuits, we found that the following augmentation rule can reasonably provide positive and negative semantics even without signal information:

![DataAugmentation](/post/DICE/figures/da.svg)

Here, our positive augmentation automatically forms positive pairs with different graph structures but related semantics, while negative augmentation further diversifies the circuit structures in the pretraining dataset. We term this novel method ***"dual graph augmentation"*** for transistor-level circuits.

With this augmentation and contrastive learning, we propose:

<blockquote style="text-align: center;">
  <strong>DICE: Device-level Integrated Circuits Encoder.</strong>
</blockquote>

For efficiency, we use a Graph Neural Network (GNN) as our model and pretrain it through contrastive learning tailored to the key intuition above. The learned embeddings are later used for several downstream circuit simulation tasks.

![Overview](/post/DICE/figures/dice.svg)

## Results

The following figure shows the t-SNE (t-Distributed Stochastic Neighbor Embedding) plot of the graph-level embeddings of DICE:

<img
  src="/post/DICE/figures/tsne_result.svg"
  alt="TSNE"
  style="display: block; width: 70%; max-width: 500px; margin: 1.5rem auto;"
/>

We can observe that the learned embeddings of the positive pairs are well clustered!

After learning these structural embeddings, we applied them to three downstream tasks:

<div align="left">

(1) Predicting which of two circuits is more similar to a given base circuit.
\
(2) Predicting the rise / fall delays of five delay-line circuits, given the input clock signal.
\
(3) Predicting the simulation results of five op-amp circuits.

</div>

![Downstream](/post/DICE/figures/downstream_result.svg)

The downstream task results indicate that embeddings obtained through DICE clearly improve downstream task performance.

If you're interested in the details, please check out our paper: [DICE](https://arxiv.org/abs/2502.08949) !!

## Takeaways

The key points to remember about DICE are:

- $$\textcolor{green}{\texttt{Efficient GNN Pretraining}}$$

  1. Captures ***Structural Connection Patterns*** within each circuit.
  2. Uses ***Dual graph augmentation + Contrastive Learning*** as the core method.

I hope you enjoyed this blog post!! 🤩

## Acknowledgments

Deep appreciation to Professor Pan and Professor Pingali. 🙏
