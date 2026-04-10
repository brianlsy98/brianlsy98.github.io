---
title: IQL vs. NQL
description: This note compares Implicit Q-Learning (IQL) and Noise-conditioned Q-Learning (NQL) through the limit relation from expectile to essential supremum. This note is related to our blog post on [FAN].
publishDate: "2026-04-09T15:30:00Z"
---



## Setup

Let $\gamma\in(0,1)$,
$Q:\mathcal S\times\mathcal A\to\mathbb R$,
$Q_n:\mathcal S\times\mathcal A\times\mathcal E\to\mathbb R$, and
$\pi:\mathcal S\times\mathcal E\to\mathcal A$.
We write one-step sampled transitions as $(s,a,r,s')$.
Let $\mu(a\mid s)$ denote the behavior/data action distribution.

## Expectile $\tau\to1 \Rightarrow \operatorname*{ess\,sup}$

For a random variable $Z$, define the expectile:

$$
\operatorname{Expectile}_\tau(Z)
:=\arg\min_v\;\mathbb E\!\left[\left|\tau-\mathbf 1(Z-v<0)\right|(Z-v)^2\right].
$$

As $\tau\to1$,

$$
\operatorname{Expectile}_\tau(Z)\to\operatorname*{ess\,sup} Z.
$$

Applied to actions at state $s'$ (with $a'\sim\mu(\cdot\mid s')$):

$$
\operatorname{Expectile}_\tau\!\big(Q(s',a')\big)
\to
\operatorname*{ess\,sup}_{a'\sim\mu(\cdot\mid s')} Q(s',a').
$$

## IQL

IQL value target:

$$
V_\tau(s')
:=\operatorname{Expectile}_\tau\!\big(Q(s',a')\big),\quad a'\sim\mu(\cdot\mid s').
$$

IQL Bellman update:

$$
(\mathcal T_{\mathrm{IQL}}^\tau Q)(s,a)
:= r(s,a)+\gamma V_\tau(s').
$$

In the limit $\tau\to1$:

$$
(\mathcal T_{\mathrm{IQL}}^\tau Q)(s,a)
\approx
r(s,a)+\gamma\,\operatorname*{ess\,sup}_{a'\sim\mu(\cdot\mid s')} Q(s',a').
$$

## NQL

NQL in [FAN](https://brianlsy98.github.io/posts/fan/) uses a noise-conditioned essential-supremum target:

$$
(\mathcal T_n^\pi Q_n)(s,a,\epsilon')
:= r(s,a)
+ \gamma\,\operatorname*{ess\,sup}_{\epsilon} Q_n(s',\pi(s',\epsilon'),\epsilon).
$$

## Connection Between IQL and NQL

Define fixed points:

$$
Q_{\mathrm{IQL}}^\tau
:= \mathcal T_{\mathrm{IQL}}^\tau Q_{\mathrm{IQL}}^\tau,
\qquad
Q_n^\pi
:= \mathcal T_n^\pi Q_n^\pi.
$$

At the target level:

$$
\text{IQL }(\tau\to1):\ \operatorname*{ess\,sup}_{a'\sim\mu(\cdot\mid s')}Q(s',a'),
\qquad
\text{NQL}:\ \operatorname*{ess\,sup}_{\epsilon}Q_n(s',\pi(s',\epsilon'),\epsilon).
$$

Therefore, when $\pi(s',\epsilon')$ is expressive enough to realize near-maximizing actions and the induced targets are aligned,
$$
\operatorname*{ess\,sup}_{\epsilon'}Q_n^\pi(s,a,\epsilon')\approx Q_{\mathrm{IQL}}^{\tau\to1}(s,a).
$$
