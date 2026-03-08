---
title: "Efficiency vs. Expressivity in Offline Reinforcement Learning"
description: "How to efficiently leverage flow policies and distributional critics in offline reinforcement learning."
publishDate: "2026-03-09"
tags: ["RL", "GenerativeModels"]
showOnSite: true
---

## Online vs. Offline RL

Reinforcement learning (RL) is about learning through trial and error. An agent takes an action, observes the result, and receives a reward signal. Over time, it learns a policy that aims to maximize reward. This setting is called online RL, where the agent continues interacting with the environment while learning. Online RL is flexible, but it can be expensive, slow, or unsafe in real-world systems (e.g., in deep-sea or space environments).

In offline RL, the agent does not interact with the environment during training. Instead, it learns from a fixed dataset collected in advance. This setup is often safer and cheaper, especially when real-world interaction is risky or expensive. However, it is also more challenging because the agent cannot gather new data to correct errors and must generalize only from what is available in the dataset.
Therefore, the key challenge is to optimize the learning policy while constraining it to the dataset support. To do this well, we need expressive methods for modeling the constraint, the policy, and the value.

## Expressive Offline RL

There are two major expressive directions in prior work.

First, flow matching is very effective for learning the behavior policy (i.e., the policy that generated the offline dataset). Because the behavior distribution is fixed for a given dataset, learning this policy is closely related to a standard generative modeling problem. Traditional Gaussian policies often assume a single mode and are therefore limited, while flow-based policies can better capture complex, multimodal behavior patterns.

Second, distributional critics can model the full return distribution more expressively. For example, compare two cases: (1) a guaranteed return of 0, and (2) a 50% chance of 100 with a 50% chance of -100. A standard critic that models only the expected return treats them as equivalent (1$\cdot$0 = 0.5$\cdot$100 + 0.5$\cdot$(-100)). However, a distributional critic can distinguish them, since the second case has a higher possible maximum return. A common way to represent return distributions is with finite discrete bins or quantiles, which correspond to different levels of the cumulative distribution function.

## Inefficiencies

However, behavior flow policies and distributional critics are often computationally expensive. First, flow policies usually require multiple forward iterations to generate a single action, so policy cost grows roughly in proportion to the number of flow steps. Second, distributional critics also process multiple return samples (e.g., multiple bins or quantiles), which makes critic cost scale linearly with the number of samples.

## Key Idea

TODO

## Proposing Method

TODO

## Results

TODO

## Takeaway

TODO