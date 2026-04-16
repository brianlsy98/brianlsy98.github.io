---
title: "[FAN] Efficiency vs. Expressivity in Offline Reinforcement Learning"
description: "How to efficiently leverage flow policies and distributional critics in offline reinforcement learning."
publishDate: "2026-03-09"
tags: ["RL", "GenerativeModels"]
showOnSite: true
---

## Online vs. Offline RL

Reinforcement learning (RL) is about learning through trial and error. An agent takes an action, observes the result, and receives a reward signal. Over time, a policy is learned to maximize reward. This setting is known as $$\textcolor{green}{\texttt{online RL}}$$, where the agent continuously interacts with the environment while learning. Online RL is flexible, but can be expensive, slow, or unsafe in real-world, e.g., deep-sea exploration or space environments.

In $$\textcolor{green}{\texttt{offline RL}}$$, the agent *does not* interact with the environment during training. Instead, it learns from a fixed pre-collected dataset. This setup is generally safer and more cost-effective, especially when real-world interaction is risky. However, it is also more challenging; the agent cannot gather new data to correct its errors and must generalize solely based on the dataset's support.

Therefore, the key challenge in offline RL is optimizing the learning policy while constraining it to the available dataset.
Actions not in the dataset may appear good during offline training, but can actually perform poorly online.
To tackle this challenge,
<blockquote style="text-align: center;">
  <strong>We need effective "policy", "constraint", "value" estimators</strong>.
</blockquote>

## Expressive Offline RL

How does prior work make these three components effective?
Given the use of neural networks, these function approximators should be ***"expressive"*** enough, just as in other fields of machine learning (ML).

### (1) Expressive Policy
Let's start with a simple yet expressive formulation of the policy. The agent's deterministic action $$a_\theta$$ can be sampled using the deterministic function $$f_\theta(s,\epsilon)$$, where $$s$$ is the state and $$\epsilon$$ is any vector modeling the stochasticity of the policy. One standard approach is to sample $$\epsilon$$ from a normal distribution, i.e., $$\epsilon\sim\mathcal{N}(0,I_d)$$, where $$d$$ is the dimension of the action space. Samples from $$a_\theta=f_\theta(s,\epsilon)$$ forms the learning policy distribution $$\pi_\theta$$, i.e., $$a_\theta\sim\pi_\theta(\cdot|s)$$. Here, the push-forward function $$f_\theta$$ maps the distribution of $$\epsilon$$ to the state-conditional distribution of actions, i.e., $$\pi_\theta(\cdot|s)$$. Even with deterministic outputs, our policy $$\pi_\theta$$ becomes stochastic thanks to the noise input $$\epsilon$$.

![Policy](/post/FAN/figures/P.svg)

This has been widely used since [DPG](https://proceedings.mlr.press/v32/silver14.pdf) and [DDPG](https://arxiv.org/pdf/1509.02971). Here, $$\pi_\theta$$ becomes more expressive than the standard Gaussian policies, since it can model all possible action distributions. Gaussian policies, i.e., $$\pi_\theta(\cdot|s)=\mathcal{N}(\mu_\theta,\sigma_\theta^2)$$, are limited to unimodal distributions.

### (2) Expressive Constraint
Now, we need $$\pi_\theta$$ not to deviate too much from the behavior of the dataset. Among various approaches, diffusion and flow models have proven highly effective for setting up such constraints. With these methods, we train a behavior policy $$\pi_\beta$$, which represents the policy that originally generated the offline dataset. This $$\pi_\beta$$ is then used as the policy constraint (e.g., $$D_{KL}(\pi_\theta||\pi_\beta)$$), forcing $$\pi_\theta$$ to output actions similar to the dataset. Learning $$\pi_\beta$$ is equivalent to a standard generative modeling problem, which explains why diffusion and flow matching are so successful here. Traditional Gaussian policies often assume a single mode and struggle to model $$\pi_\beta$$, whereas flow-based policies can easily capture complex, multimodal behaviors.

![Policy](/post/FAN/figures/C.svg)

[FQL](https://seohong.me/projects/fql/) is one good example. Their constraint is $$W_2(\pi_\theta,\pi_\beta)$$, the Wasserstein-2 distance between the learning policy $$\pi_\theta$$ and the behavior policy $$\pi_\beta$$ trained with flow matching.


### (3) Expressive Value
Next, is there a better way to estimate future returns other than with expectations? Yes, indeed. Distributional RL is one line of work that models more expressive values. Instead of simply estimating the expected sum of rewards, distributional critics estimate the full distribution of returns. Consider two scenarios: a guaranteed return of 0, versus a 50% chance of 100 with a 50% chance of -100. A standard critic evaluates these as equivalent (1$\cdot$0 = 0.5$\cdot$100 + 0.5$\cdot$(-100)), but a distributional critic captures the information of a higher potential maximum return in the second scenario.

A common way to represent these return distributions is by using finite discrete bins or quantiles that correspond to different levels of the cumulative distribution function (CDF). But, yeah... quite hard to understand... Let's walk through a simple example to get some sense. Consider the following environment:

![Simple MDP](/post/FAN/figures/SimpleMDP.svg)

Here, starting from the initial state $$S_0$$, the number on each edge represents the reward that the agent gets for each action (left or right).
Let's first estimate the expected return, given a fixed policy going left and right with the same probabilities:

![Expected Return](/post/FAN/figures/Q.svg)

In this case, the high sparse reward of +30 is not captured effectively. However, for the distributional critics:

![Distributional Return](/post/FAN/figures/Z.svg)

The highest possible return (+24) is captured through high $$\delta$$ values using distributional quantile critics. Here, $$\delta$$ determines the coefficient of the return CDF.

## Inefficiencies

While sampling actions from $$\pi_\theta$$ is highly effective and efficient, relying on the behavior flow policy ($$\pi_\beta$$) for constraints and using distributional critics is compute heavy.

$$\textcolor{green}{\texttt{(Policy) one-step }\pi_\theta\texttt{ sampling.}}$$ Great efficiency.

$$\textcolor{green}{\texttt{(Constraint) }\pi_\beta\texttt{ with Flow Matching.}}$$ Behavior flow policies typically ***require multiple forward iterations*** to generate a single dataset action. Consequently, the cost of setting up the constraint scales proportionally with the number of flow steps.

$$\textcolor{green}{\texttt{(Value) Distributional Critics.}}$$ These critics ***process multiple return samples*** (such as multiple bins or quantiles), which causes the critic's computational cost to scale linearly with the number of these samples.

## Key Observations

To summarize, higher performance in expressive offline RL comes with more computation:

<blockquote style="text-align: center;">
  <strong>Efficiency vs. Expressivity trade-off exists in offline RL.</strong>
</blockquote>

***However, can these expressive mechanisms be made more efficient?***
Since the expressive policy $$\pi_\theta$$ is already modeled very efficiently, let's focus on how to improve the efficiencies of *(1) the flow-based constraint* and *(2) the distributional value*.

### (Constraint) Is Flow Iteration Necessary?

Flow-based policy constraints require solving the ordinary differential equations (ODEs).

![Observation for the behavior flow policy](/post/FAN/figures/O1.svg)

For instance, [FQL](https://seohong.me/projects/fql/) directly compares action outcomes $$a_\beta$$ and $$a_\theta$$, which are sampled from the policy distributions $$\pi_\beta$$ and $$\pi_\theta$$, respectively. Therefore, during training, FQL must iterate over $$v_\beta$$ multiple times to obtain $$a_\beta$$, leading to more computation. But,

<p align="center"><em>What if we compare directions within the flow, rather than the action outputs directly?</em></p>

***Our intuition is that accurate sampling of $$a_\beta$$ is actually not a strict requirement for successful $$\pi_\theta$$ learning***. $$a_\beta$$ is merely used for "regularizing" $$a_\theta$$ to the dataset.

### (Value) Should we model CDFs?

There is actually an alternative way to model return distributions other than with CDFs.

![Observation for the distributional critic](/post/FAN/figures/O2.svg)

Consider the problem of generative modeling. The goal is to find a function that maps the prior distribution to the target distribution. This function can be viewed as the push-forward function $$f$$, forwarding the prior distribution (e.g., $$\mathcal{N}(0,I_d)$$) to our target distribution (e.g., $$p_\text{data}$$). 
The distribution is modeled through this push-forward function $$f$$, which is distinct from the CDF-based modeling.
Then, similarly,

<p align="center"><em>What if we model return distributions with push-forwards?</em></p>

***Our intuition is that if we use push-forwards, all distributional critic samples have a similar meaning (i.e., each is a possible return outcome sampled randomly). Consequently, using a single critic sample may be sufficient.*** In contrast, different samples from the distributional quantile critic have different meanings, since each sample models a different part of the return CDF.

Actually, [Value Flows](https://pd-perry.github.io/value-flows/) is one work that does exactly this. However, they solve ODEs for sampling the critic values, making it hard to say that efficiency has improved.

## Proposed Method

Based on these insights, we propose:

<blockquote style="text-align: center;">
  <strong>Flow Anchored Noise-conditioned Q-Learning (FAN)</strong>
</blockquote>

![FAN](/post/FAN/figures/Method.svg)

We use ***"Flow Anchoring"*** for expressive policy constraints, and apply ***"Noise-conditioned Q-Learning"*** for expressive values.

### Constraint using Single Flow Iteration

$$\textcolor{green}{\texttt{(1) Flow Anchoring.}}$$
For the behavior regularization part, we modify the prior objectives as follows:

<div align="left">

$$\texttt{(FQL) : }\mathbb{E}_{\substack{s\sim\mathcal{D} \\ \epsilon\sim\mathcal{N}(0,I_d)}} \left[ \lVert a_\theta - a_\beta \rVert_2^2 \right] \\ \texttt{(FAN) : }\mathbb{E}_{\substack{s\sim\mathcal{D} \\ \epsilon\sim\mathcal{N}(0,I_d) \\ t\sim\text{Unif}([0,1])}} \left[ \lVert (a_\theta - \epsilon) - v_\beta(s, t, a^t_{\theta}) \rVert_2^2 \right]$$

</div>

Here is the variable breakdown:
- $s \sim \mathcal{D}$ : Offline dataset state
- $\epsilon \sim \mathcal{N}(0,I_d)$ : Prior noise vector
- $t \sim \text{Unif}([0,1])$ : Random time step
- $a_\theta := f_\theta(s, \epsilon)$ : Learning policy action
- $a_\beta := \epsilon + \int_0^1\,v_\beta(s, \tau, a_\tau)\,d\tau$ : Dataset action ***(Iterative ODE)***
- $a^t_{\theta} := (1 - t)\,\epsilon + t\,a_\theta$ : Interpolated point at time $t$
- $a_\theta - \epsilon$ : Policy direction
- $v_\beta(s, t, a^t_{\theta})$ : Behavior flow velocity field ***(Single-step)***

Our work only requires a single flow step, and is guaranteed to minimize the Wasserstein-2 distance between $$\pi_\theta$$ and $$\pi_\beta$$!

### Distributional Critic with Push-Forwards

$$\textcolor{green}{\texttt{(2) Noise-conditioned Q-Learning.}}$$
For the distributional value estimates, we propose the following novel Bellman operator:

<div align="center">

$$(\mathcal{T}^{\pi}_{n} Q)(s, a, \epsilon') :\overset{d}{=} r + \gamma \operatorname{ess \sup}_{\epsilon \sim \mathcal{N}(0, I_d)} Q(s', \pi(s', \epsilon'), \epsilon)$$

</div>

Don't get afraid with the $\operatorname{ess \sup}$! It stands for "essential supremum", which is just taking the maximum value, ignoring rare, zero-probability edge cases.
With the simple environment example above, the critic values are calculated as follows:

![Observation for the Noise-conditioned Q-Learning](/post/FAN/figures/NoiseConditionedQ.svg)

Understand this as the distributional extension of Q-Learning!! i.e., $$(\mathcal{T}^\pi Q)(s, a) = r + \gamma \max_{a'} Q(s', a')$$. In Q-Learning, the maximum operation is taken over the "next" action, but we are doing it for $$\epsilon$$, which is highly related to the "next-next" action. In our case, the next action is tied to our value function input $$\epsilon'$$.

## Result

We tested FAN on numerous offline RL benchmarks such as [D4RL](https://sites.google.com/view/d4rl-anonymous/) and [OGBench](https://seohong.me/projects/ogbench/). Please check out our paper, FAN, for more details.

![FLOPs and Success Rates](/post/FAN/figures/FLOPvsPERF.svg)

To summarize, ***FAN achieves the best success rates on average with the highest computational efficiency***. Specifically, its computational efficiency is similar to that of highly efficient non-distributional offline RL algorithms (e.g., ReBRAC, FQL), while outperforming relatively inefficient distributional approaches (e.g., CODAC, Value Flows). 

## Takeaways

Just remember these about FAN:

- $$\textcolor{green}{\texttt{High Task Performance}}$$ through:

  1) Flow policy constraint
  2) Distributional critic

- $$\textcolor{green}{\texttt{High Efficiency}}$$ through:
  
  1) ***Flow Anchoring*** for the offline dataset constraint.
  2) ***Noise-conditioned Q-Learning*** for return distributions.

I hope you enjoyed this blog post!! 🤩

## Acknowledgments

Huge thanks to Professor Pingali and Eshan for organizing the content together for easier understanding. 🙏
