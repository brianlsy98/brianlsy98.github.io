---
title: "Efficiency vs. Expressivity in Offline Reinforcement Learning"
description: "How to efficiently leverage flow policies and distributional critics in offline reinforcement learning."
publishDate: "2026-03-09"
tags: ["RL", "GenerativeModels"]
showOnSite: true
---

## Online vs. Offline RL

Reinforcement learning (RL) is fundamentally about learning through trial and error. An agent takes an action, observes the result, and receives a reward signal. Over time, it learns a policy that aims to maximize this reward. This setting is known as $$\textcolor{green}{\texttt{online RL}}$$, where the agent continuously interacts with the environment while learning. While online RL is flexible, it can be expensive, slow, or unsafe to implement in real-world systems (e.g., deep-sea exploration or space environments).

In $$\textcolor{green}{\texttt{offline RL}}$$, the agent does not interact with the environment during training.  Instead, it learns from a fixed dataset collected in advance. This setup is generally safer and more cost-effective, especially when real-world interaction is risky. However, it is also more challenging; the agent cannot gather new data to correct its errors and must generalize solely based on the dataset's support.

Therefore, the key challenge in offline RL is optimizing the learning policy while constraining it to the available dataset.
This is because actions not in the dataset may appear good during offline training, but actually perform poorly online.
To tackle this challenge effectively, we need effective estimators for:
<blockquote style="text-align: center;">
  <strong>(1) the Policy, (2) the Constraint, and (3) the Value</strong>.
</blockquote>

## Expressive Offline RL

How does prior work make these three components effective?
Considering the use of neural networks, these function approximators should be "expressive" enough as in the other fields in machine learning (ML).

### (1) Expressive Policy
Let's start with a simple yet expressive formulation of the policy. The agent's deterministic action $$a_\omega$$ can be sampled using the learning policy $$\pi_\omega$$, formulated as $$a_\omega=\pi_\omega(s,\epsilon)$$, where $$s$$ is the state and $$\epsilon$$ is any vector modeling the stochasticity of the policy. Here, $$\pi_\omega$$ maps the distribution of $$\epsilon$$ to the state-conditional distribution of actions. One standard approach is to sample $$\epsilon$$ from a normal distribution, i.e., $$\epsilon\sim\mathcal{N}(0,I_d)$$, where $$d$$ is the dimension of the action space.
Even with deterministic outputs, $$\pi_\omega$$ becomes stochastic thanks to our noise input $$\epsilon$$.

![Policy](./P.svg)

This approach has been widely used since the introduction of [DPG](https://proceedings.mlr.press/v32/silver14.pdf) and [DDPG](https://arxiv.org/pdf/1509.02971). With this formulation, $$\pi_\omega$$ becomes more expressive than the standard Gaussian policies (i.e. $$\pi_\theta(\cdot|s)\sim\mathcal{N}(\mu_\theta,\sigma_\theta^2)$$), since it can model all possible action distributions. Gaussin policies can only model unimodal distributions.

### (2) Expressive Constraint
Now, we need our expressive policy $$\pi_\omega$$ not to deviate too much from the behavior of the dataset. Among various approaches, diffusion and flow models have proven highly effective for setting up such constraint. With these methods, we train a behavior policy $$\pi_\beta$$, which represents the policy that originally generated the offline dataset. This $$\pi_\beta$$ is then used as the policy constraint (e.g., $$D_{KL}(\pi_\beta||\pi_\omega)$$), forcing $$\pi_\omega$$ to output actions similar to the dataset. Learning $$\pi_\beta$$ is equivalent to a standard generative modeling problem, which explains why diffusion and flow matching are so successful here. Traditional Gaussian policies often assume a single mode and struggle to model $$\pi_\beta$$, whereas flow-based policies can easily capture complex, multimodal behaviors.

![Policy](./C.svg)

[FQL](https://seohong.me/projects/fql/) is one good example. Their constraint is $$W_2(\pi_\omega,\pi_\beta)$$, a Wasserstein-2 distance between the learning policy $$\pi_\omega$$ and the behavior policy $$\pi_\beta$$. They model $$\pi_\beta$$ with flow matching.


### (3) Expressive Value
Is there a better way to estimate future returns other than with expectations? Yes, indeed. Distributional RL is one line of work modeling the value estimate more expressive. Instead of simply estimating the expected sum of rewards, distributional critics estimate the full distribution of returns. Consider two scenarios: a guaranteed return of 0, versus a 50% chance of 100 with a 50% chance of -100. A standard critic evaluates these as equivalent (1$\cdot$0 = 0.5$\cdot$100 + 0.5$\cdot$(-100)), but a distributional critic captures the information of a higher potential maximum return in the second scenario.

A common way to represent these return distributions is by using finite discrete bins or quantiles that correspond to different levels of the cumulative distribution function (CDF). But, yeah... not so intuitive, isn't it? Let's get through some simple example to get some sense. Consider the following environment:

![Simple MDP](./SimpleMDP.svg)

Here, starting from the initial state $$S_0$$, the number in each edge represents the reward that the agent gets for each action (left or right).
Let's first estimate the expected return, given the fixed policy going left and right with same probabilities:

![Expected Return](./Q.svg)

In this case, the high sparse reward of +30 is not captured effectively. However, for the distributional critics:

![Distributional Return](./Z.svg)

The highest possible return (+24) is captured through high $$\delta$$ values using distributional quantile critics. Here, $$\delta$$ determines the coefficient of the return CDF.

## Inefficiencies

While sampling actions from $$\pi_\omega$$ is highly effective and efficient, relying on the behavior flow policy ($$\pi_\beta$$) for constraints and using distributional critics introduces significant computational expense.

$$\textcolor{green}{\texttt{(1) Policy: one-step }\pi_\omega\texttt{ sampling.}}$$ Great efficiency.

$$\textcolor{green}{\texttt{(2) Constraint: }\pi_\beta\texttt{ with Flow Matching.}}$$ Behavior flow policies typically ***require multiple forward iterations*** to generate a single dataset action. Consequently, the cost of setting up the constraint scales proportionally with the number of flow steps.

$$\textcolor{green}{\texttt{(3) Value: Distributional Critics.}}$$ Distributional critics ***process multiple return samples*** (such as multiple bins or quantiles), which causes the critic's computational cost to scale linearly with the number of these samples.

## Key Observations

To summarize, higher performance in expressive offline RL algorithms comes at the cost of increased computation:

<blockquote style="text-align: center;">
  <strong>Efficiency vs. Expressivity trade-off exists in offline RL</strong>
</blockquote>

***However, can these expressive mechanisms be made more efficient?***
Since the expressive policy $$\pi_\omega$$ is already modeled very efficiently, let's focus on how to improve the efficiencies of the flow-based constraint and the distributional value.

### (Constraint) Is Flow Iteration Necessary?

TODO

### (Value) Should we model CDFs?

TODO

## Proposing Method

TODO

## Results

TODO

## Takeaway

TODO
