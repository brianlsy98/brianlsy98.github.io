export interface Publication {
	title: string;
	authors: string;
	venue: string;
	summary: string;
	figure?: string;
	paperUrl: string;
	codeUrl?: string;
	blogUrl?: string;
}

export const researchPapers: Publication[] = [
	{
		title:
			"Towards Efficient and Expressive Offline RL via Flow Anchored Noise-conditioned Q-Learning",
		authors:
			"Sungyoung Lee, Dohyeong Kim, Eshan Balachandar, Zelal Su Mustafaoglu, Keshav K. Pingali",
		venue: "ICML 2026",
		summary:
			"TL;DR: Offline distributional RL that achieves SOTA robotics task success rates with efficient training and inference.",
		figure: "/post/FAN/figures/FLOPvsPERF.svg",
		paperUrl: "https://arxiv.org/abs/2605.01663v1",
		codeUrl: "https://github.com/brianlsy98/FAN",
		blogUrl: "https://brianlsy98.github.io/posts/fan/",
	},
	{
		title:
			"AnalogCoder-Pro: Unifying Analog Circuit Generation and Optimization via Multi-modal LLMs",
		authors:
			"Yao Lai, Souradip Poddar, Sungyoung Lee, Guojin Chen, Mengkang Hu, Bei Yu, Ping Luo, David Z. Pan",
		venue: "TCAD 2026",
		summary:
			"TL;DR: First training-free multimodal LLM framework for end-to-end analog design, unifying topology generation and sizing with waveform/log feedback.",
		paperUrl: "https://arxiv.org/abs/2508.02518",
		codeUrl: "https://github.com/laiyao1/AnalogCoderPro",
	},
	{
		title: "PPAAS: PVT and Pareto Aware Analog Sizing via Goal-conditioned Reinforcement Learning",
		authors:
			"Seunggeun Kim, Ziyi Wang, Sungyoung Lee, Youngmin Oh, Hanqing Zhu, Doyun Kim, David Z. Pan",
		venue: "ICCAD 2025",
		summary:
			"TL;DR: Performs Pareto-aware analog sizing with goal-conditioned reinforcement learning for robust trade-offs across process and operating conditions.",
		paperUrl: "https://arxiv.org/abs/2507.17003",
		codeUrl: "https://github.com/SeunggeunKimkr/PPAAS",
	},
	{
		title: "DICE: Device-level Integrated Circuits Encoder with Graph Contrastive Pretraining",
		authors: "Sungyoung Lee, Yao Lai, Ziyi Wang, Seunggeun Kim, Taekyun Lee, David Z. Pan",
		venue: "arXiv 2026",
		summary:
			"TL;DR: First self-supervised pretraining for transistor-level circuits, using simulation-free graph data augmentation.",
		figure: "/post/DICE/figures/dice.svg",
		paperUrl: "https://arxiv.org/abs/2502.08949",
		codeUrl: "https://github.com/brianlsy98/DICE",
		blogUrl: "https://brianlsy98.github.io/posts/dice/",
	},
	{
		title: "AnalogCoder: Analog Circuit Design via Training-Free Code Generation",
		authors:
			"Yao Lai, Sungyoung Lee, Guojin Chen, Souradip Poddar, Mengkang Hu, David Z. Pan, Ping Luo",
		venue: "AAAI 2025 (Oral)",
		summary:
			"TL;DR: Training-free LLM agent for analog circuit design using feedback prompts plus a circuit library; high success rate and 25 designed circuits, outperforming GPT-4o.",
		paperUrl: "https://arxiv.org/abs/2405.14918",
		codeUrl: "https://github.com/laiyao1/AnalogCoder",
	},
	{
		title: "Analog Transistor Placement Optimization Considering Nonlinear Spatial Variations",
		authors: "Supriyo Maji, Sungyoung Lee, David Z. Pan",
		venue: "DATE 2024",
		summary:
			"TL;DR: Simulated annealing transistor placement handles nonlinear spatial variation in analog circuits, beats prior methods, satisfies layout constraints, and improves optimization control.",
		paperUrl: "https://ieeexplore.ieee.org/abstract/document/10546584",
	},
	{
		title: "A 10-to-12-GHz Dual Loop Quadrature Clock Corrector in 28-nm CMOS Technology",
		authors: "Jung-Woo Sull, Sungyoung Lee, Deog-Kyoon Jeong",
		venue: "ITC-CSCC 2022",
		summary: "TL;DR: Dual-loop quadrature clock corrector in Samsung 28-nm CMOS.",
		paperUrl: "https://ieeexplore.ieee.org/abstract/document/9895092",
	},
];
