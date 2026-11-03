# Esoteric Language Models

Subham Sekhar Sahoo^{∗1} Zhihan Yang^{∗2} Yash Akhauri^{†1} Johnna Liu^{†1}
Deepansha Singh^{†1} Zhoujun Cheng^{†3} Zhengzhong Liu^{3} Eric Xing^{3}
John Thickstun^{2} Arash Vahdat^{4}
^{∗}Joint First Authors ^{†}Joint Second Authors
^{1} Cornell Tech ^{2} Cornell University ^{3}MBZUAI ^{4} NVIDIA
{ssahoo, zhihany}@cs.cornell.edu

###### Abstract

Diffusion-based language models offer a compelling alternative to autoregressive (AR) models by enabling parallel and controllable generation. Among this family of models, Masked Diffusion Models (MDMs) achieve the strongest performance but still underperform AR models in perplexity and lack key inference-time efficiency features—most notably, KV caching. In this work, we introduce Eso-LMs, a new family of models that fuses AR and MDM paradigms, enabling smooth interpolation between their perplexities while overcoming their respective limitations. Eso-LMs set a new state of the art on standard language modeling benchmarks. Crucially, we are the first to introduce KV caching for MDMs while preserving parallel generation, significantly improving inference efficiency. Combined with an optimized sampling schedule, our method achieves up to 65× faster inference than standard MDMs and 4× faster inference than prior semi-autoregressive approaches. We provide the code and model checkpoints on the project page:

https://s-sahoo.com/Eso-LMs

## 1 Introduction

We are at a pivotal moment in language modeling. A paradigm shift is underway—autoregressive (AR) language models, long considered the gold standard, are now being rivaled by diffusion language models for standard language generation. Recent works *[26, 29]* show that Masked Diffusion Models (MDMs) are closing the gap with AR models on small-scale language benchmarks, and even outperform them on tasks involving discrete structures, such as molecular generation *[28, 11]* and graph generation *[14]*. When scaled to larger sizes (e.g., 8B parameters), MDMs match models like LLaMA on challenging datasets in math, science, and tasks such as reverse poem completion *[18]*.

These results make MDMs a compelling alternative to AR models. However, they suffer from two key limitations: (1) Inference speed: Despite supporting parallel generation, MDMs are significantly slower than AR models in practice, largely due to the lack of KV caching—a crucial optimization for real-time applications like chat systems. (2) Generation quality: MDMs still show a noticeable likelihood gap on more complex language modeling tasks *[26]*.

Recently proposed BD3-LMs *[1]* address the speed issue by introducing a semi-autoregressive generation strategy. These models perform diffusion over fixed-length blocks of text sequentially. Because previously denoised blocks can be cached, BD3-LMs partially support KV caching and are faster than standard MDMs. However, we identify two key shortcomings in BD3-LMs: (1) Mode collapse at low sampling steps: When the number of denoising steps is reduced for faster inference, BD3-LMs exhibit severe degradation in sample quality—worse than both AR (at high Number of Function Evaluations (NFEs)) and diffusion models (at low NFEs) (Sec. 5.3). (2) Incomplete

---

![img-0.jpeg](img-0.jpeg)
Figure 1: Efficient generation of an example sequence with our flagship model Eso-LM (B). During Diffusion Phase, Eso-LMs denoise one or more, potentially non- neighboring mask tokens (M) per step. During Sequential Phase, Eso-LMs denoise the remaining mask tokens one at a time from left to right. Eso-LM (B) allows for KV caching in both phases using just a single unified KV cache: blue bounding boxes enclose transformer cells that are building their KV cache; a cell becomes blue once its KV cache is built. The sequences below the transformers depict tokens in their natural order.

caching: While KV caching is possible across blocks, intra-block diffusion still lacks KV support, limiting overall speed gains.

To address these challenges, we propose a new language modeling paradigm that fuses autoregressive and masked diffusion approaches. Our model is trained with a hybrid loss—a combination of AR and MDM objectives—which allows it to interpolate smoothly between the two paradigms in terms of perplexity. This requires two key innovations: (1) A revised attention mechanism in the denoising transformer to support both AR and MDM styles of generation. (2) A new training and sampling procedure that enables KV caching within the diffusion phase, a feature previously unavailable in MDMs. Due to the unconventional nature of this hybrid design, we name our method Esoteric Language Models (Eso-LMs).

Our method sets a new state of the art among diffusion models on language modeling benchmarks and enables fine-grained control over interpolation between AR and MDM perplexities. Unlike prior approaches, it supports KV caching during diffusion, yielding significantly faster inference. In summary, our contributions are as follows: (1) We propose a new framework for language modeling: one that fuses AR and MDM paradigms and outperforms the previous hybrid approach, BD3-LMs. (2) Ours is the first approach to enable KV caching for MDMs while preserving parallel generation, achieving up to  $65 \times$  faster inference than standard MDMs and  $3 - 4 \times$  faster inference than KV-cached semi-autoregressive baselines (Sec. 5.2). (3) We show that BD3-LMs degrade at low sampling steps, while our method remains competitive with MDMs in the low NFE regime and with AR in the high NFE regime (Sec. 5.3). (4) Our results establish a new state-of-the-art perplexity for discrete diffusion, narrowing the gap to autoregressive models (Sec. 5.1).

# 2 Background

Notation We represent scalar discrete random variables that can take  $K$  values as 'one-hot' column vectors and define  $\mathcal{V} \in \{\mathbf{x} \in \{0,1\}^K : \sum_{i=1}^K \mathbf{x}_i = 1\}$  as the set of all such vectors. Let  $\mathbf{m} \in \mathcal{V}$  be a special mask vector such that  $\mathbf{m}_K = 1$ . Define  $\mathrm{Cat}(\cdot; \pi)$  as the categorical distribution over  $K$  classes with probabilities given by  $\pi \in \Delta^K$ , where  $\Delta^K$  denotes the  $K$ -simplex. Additionally, let  $\langle \mathbf{a}, \mathbf{b} \rangle$  denote the dot product between vectors  $\mathbf{a}$  and  $\mathbf{b}$ . We use parentheses () to denote ordered sets (tuples) and curly brackets  $\{\}$  to denote unordered sets.  $|A|$  denotes the cardinality of the set  $A$ .

MDMs feature two salient orderings: the sequence order and the denoising order. We use a permutation  $\sigma$  to describe the relationship between these orderings. Let  $\mathcal{P}_L$  denote the set of all permutations of  $[L] = \{1, \dots, L\}$ .  $\sigma \in \mathcal{P}_L$  is an ordered set (tuple) and also serves as a bijective function:  $\sigma(l)$  is the item at the  $l^{\text{th}}$  position in  $\sigma$ , and  $\sigma^{-1}(i)$  is the position of the item  $i$  in  $\sigma$ . For example,  $(2, 4, 1, 3)$  denotes an ordering of  $\{1, 2, 3, 4\}$ , with  $\sigma(2) = 4$  mapping the position 2 to its corresponding item 4, and  $\sigma^{-1}(4) = 2$  mapping the item 4 to its corresponding position 2.

---

$\mathbf{x}\in\mathcal{V}^{L}$ denote a sequence of length $L$ with no mask tokens, and let $\mathbf{x}^{\ell}$ denote the $\ell^{\text{th}}$ entry in $\mathbf{x}$. We use the term ‘token index’ to refer to the position of a token in the original ordering, e.g., the token index for $\mathbf{x}^{l}$ is $l$. Let $(\mathbf{z}_{t})_{t\in[0,1]}\in\mathcal{V}^{L}$ denote a sequence of length $L$ that may contain mask tokens. Let $\mathcal{M}(\mathbf{z}_{t})=\{\ell\mid\mathbf{z}_{t}^{\ell}=\mathbf{m}\}$ denote token indices of mask tokens in $\mathbf{z}_{t}$ and $\mathcal{C}(\mathbf{z}_{t})=\{\ell\mid\mathbf{z}_{t}^{\ell}\neq\mathbf{m}\}$ denote token indices of clean tokens in $\mathbf{z}_{t}$.

Let $\oplus:\mathcal{V}^{m}\times\mathcal{V}^{n}\to\mathcal{V}^{m+n}$ denote a concatenation operator on two sequences $\mathbf{x}=(\mathbf{x}^{1},\mathbf{x}^{2},\ldots,\mathbf{x}^{m})$ and $\mathbf{z}=(\mathbf{z}^{1},\mathbf{z}^{2},\ldots,\mathbf{z}^{n})$ of length $m$ and $n$. When the concatenated sequence $\mathbf{x}\oplus\mathbf{z}$ is fed into the transformer, $\mathbf{x}$ and $\mathbf{z}$ carry the same positional embeddings as they would if they were fed into a transformer independently. Let $\odot:\mathcal{V}^{m}\times\mathcal{V}^{n}\to\mathcal{V}^{m}$ denote a substitution operator; for any $\mathbf{z}\in\mathcal{V}^{m}$ and $\mathbf{x}\in\mathcal{V}^{n}$ with $m>n$, the output $\mathbf{y}=\mathbf{z}\odot\mathbf{x}$ is given by: $\mathbf{y}^{1:n}=\mathbf{x}$ and $\mathbf{y}^{n+1:m}=\mathbf{z}^{n+1:m}$.

### 2.1 Autoregressive Models

Given a sequence $\mathbf{x}\sim q_{\text{data}}$ in $\mathcal{V}^{L}$, autoregressive (AR) models define the following factorization of the joint distribution: $\log p_{\theta}(\mathbf{x})=\sum_{t=1}^{L}\log p_{\theta}(\mathbf{x}^{\ell}\mid\mathbf{x}^{c\ell})$, where the model $p_{\theta}$ is usually parameterized by a causal transformer *[34]* model. Sampling takes $L$ steps but is efficient due to KV caching. AR models achieve the best likelihood and generation quality.

### 2.2 Masked Diffusion Models

Diffusion models learn to reverse a forward corruption process $q$, which transforms clean data $\mathbf{x}\sim q_{\text{data}}$ in $\mathcal{V}^{L}$ into a sequence of latent variables $\mathbf{z}_{t}$ for $t\in[0,1]$, each representing an increasingly noisy version of $\mathbf{x}$ *[31, 32, 8]*. In MDMs *[26, 30, 20]*, the forward masking process $q$ factors independently across the sequence $\mathbf{x}$, i.e., $q_{t}(.|\mathbf{x})=\Pi_{\ell}q_{t}(.|\mathbf{x}^{\ell})$ and each token $\mathbf{x}^{l}$ is progressively interpolated with a fixed target distribution $\text{Cat}(.;\mathbf{m})$. The marginal of $\mathbf{z}_{t}^{\ell}\sim q_{t}(.|\mathbf{x}^{\ell})$ at time $t$ is given by:

$q_{t}(.|\mathbf{x}^{\ell})=\text{Cat}(.;\alpha_{t}\mathbf{x}^{\ell}+(1-\alpha_{t})\mathbf{m}),$ (1)

where $\alpha_{t}\in[0,1]$ is a strictly decreasing function in $t$ with $\alpha_{0}\approx 1$ and $\alpha_{1}\approx 0$. *Sahoo et al. [26]* show that the reverse posterior $q_{s|t}(.|\mathbf{z}_{t}^{\ell},\mathbf{x}^{\ell})$ over $\mathbf{z}_{s}^{\ell}$ for $s<t$ is given by

\[ q_{s|t}(.|\mathbf{z}_{t}^{\ell},\mathbf{x}^{\ell})=\begin{cases}\text{Cat}(.;\mathbf{z}_{t}^{\ell})&\mathbf{z}_{t}^{\ell}\neq\mathbf{m},\\
\text{Cat}\left(:{\frac{(1-\alpha_{s})\mathbf{m}+({\alpha_{s}-\alpha_{t}})\mathbf{x}^{\ell}}{1-\alpha_{t}}}\right)&\mathbf{z}_{t}^{\ell}=\mathbf{m}.\end{cases} \] (2)

Given a denoising model $\mathbf{x}_{\theta}:\mathcal{V}^{L}\to(\Delta^{K})^{L}$, the reverse unmasking process $p_{\theta}(.|\mathbf{z}_{t})_{s|t}$ over the sequence $\mathbf{z}_{s}$ is parameterized by

$p_{\theta}(.|\mathbf{z}_{t})_{s|t}=\prod_{\ell}^{L}p_{\theta}^{\ell}(.|\mathbf{z}_{t})_{s|t}=\prod_{t}^{L}q_{s|t}^{\ell}(.|\mathbf{z}_{t}^{\ell},\mathbf{x}^{\ell}=\mathbf{x}_{\theta}^{\ell}(\mathbf{z}_{t})).$ (3)

*Sahoo et al. [26], Shi et al. [30], Ou et al. [20]* show that Negative Evidence Lower Bound (NELBO) for this method is

$\mathcal{L}_{\text{MDM}}(\mathbf{x})=\mathbb{E}_{q,t\sim[0,1]}\frac{\alpha_{t}^{\prime}}{1-\alpha_{t}}\sum_{\ell\in\mathcal{M}(\mathbf{z}_{t})}\log\langle\mathbf{x}_{\theta}^{\ell}(\mathbf{z}_{t}),\mathbf{x}^{\ell}\rangle,$ (4)

which is a weighted average of masked language modeling losses *[5]* computed only on the masked tokens $\mathcal{M}(\mathbf{z}_{t})$.

To generate a sequence of length $L$, the reverse diffusion process starts from $\mathbf{z}_{t=1}$, where $\mathbf{z}_{t=1}^{\ell}=\mathbf{m}$ for $\ell=1,\ldots,L$. It proceeds for $T$ steps, with each $\mathbf{z}_{s}^{\ell}$ independently sampled from $p_{\theta}(.|\mathbf{z}_{t})_{s|t}$ as defined in (3); once a position is unmasked, it remains fixed. Since multiple tokens can be denoised in parallel, the total number of network function evaluations (NFEs) can be less than $L$, enabling faster generation. However, each NFE is expensive due to the bidirectional transformer in $\mathbf{x}_{\theta}(\mathbf{z}_{t})$.

### 2.3 Block Denoising Diffusion Discrete Language Models

Block Denoising Diffusion Discrete Language Models (BD3-LMs) *[1]* autoregressively model blocks of tokens and perform masked diffusion modeling (Sec. 2.2) within each block. By changing the

---

size of blocks, BD3-LMs interpolate AR models and MDMs. BD3-LMs group tokens in $\mathbf{x}$ into $B$ blocks of $L^{\prime}$ consecutive tokens with $B=L/L^{\prime}$, where $B$ is assumed to be an integer. The likelihood over $\mathbf{x}$ factorizes autoregressively over blocks as $-\log p_{\theta}(\mathbf{x})=-\sum_{b=1}^{B}\log p_{\theta}(\mathbf{x}^{b}\mid\mathbf{x}^{<b})\leq\sum_{b=1}^{B}\mathcal{L}_{\text{MDM}}(\mathbf{x}^{b};\mathbf{x}^{<b})$, where $p_{\theta}(\mathbf{x}^{b}\mid\mathbf{x}^{<b})$ is a conditional MDM and $\mathcal{L}_{\text{MDM}}(\mathbf{x}^{b};\mathbf{x}^{<b})$ is the NELBO for MDLM as defined in (4), applied sequentially across the blocks.

## 3 Esoteric Language Models

We propose a new paradigm for language modeling: Esoteric Language Models (Eso-LMs), which form a symbiotic combination of AR models and MDMs. Our approach has two main components: (1) we introduce a family of models that supports both sequential (AR-style) and parallel (MDM-style) generation; and (2) in Sec. 4, we detail architectural changes to the transformer *[34]* to enable this hybrid generation.

While AR models currently lead in language modeling performance, they generate tokens sequentially, making them slow at inference. In contrast, MDMs generate multiple tokens in parallel and are more controllable *[29, 19]*, but they typically yield higher perplexity than AR models *[26, 27]*. The key question is: can we combine their strengths? We introduce a hybrid approach where some tokens are generated in parallel via MDMs and the rest sequentially in a left-to-right fashion. This raises two key questions. First, can we compute the likelihood of such a generative model? We show that Eso-LMs admit a principled bound on the true likelihood. Second, how can we adapt the attention mechanism in the transformer to support both styles of generation? During training, in AR models, causal attention is enforced on the clean sequence, whereas MDMs rely on bidirectional attention over both masked and unmasked tokens. In Sec. 4, we reconcile these two distinct architectures by designing custom attention mechanisms for the transformer. Additionally, we introduce sparsity into the attention matrix, enabling KV-caching for MDMs which significantly improves the generation speed for long-context generation.

### 3.1 Fusing Autoregressive Models and Masked Diffusion

Let $\mathbf{x}\sim q_{\text{data}}(\mathbf{x})$ in $\mathcal{V}^{L}$ be a sample from the data distribution, and let $p_{\theta}$ be our model distribution parameterized by $\theta$. Eso-LMs decompose $p_{\theta}$ into two components: an AR model $p_{\theta}^{\text{AR}}$ and an MDM $p_{\theta}^{\text{MDM}}$. The MDM generates a partially masked sequence $\mathbf{z}_{0}\in\mathcal{V}^{L}\sim p_{\theta}^{\text{MDM}}(\mathbf{z}_{0})$, and the AR model finishes the remaining unmasking steps in an auto-regressive left-to-right manner: $p_{\theta}^{\text{AR}}(\mathbf{x}|\mathbf{z}_{0})$. The marginal likelihood of such a hybrid generative process is:

$p_{\theta}(\mathbf{x})=\sum_{\mathbf{z}_{0}\in\mathcal{V}^{L}}p_{\theta}^{\text{AR}}(\mathbf{x}|\mathbf{z}_{0})p_{\theta}^{\text{MDM}}(\mathbf{z}_{0}).$ (5)

Although this sum is intractable, we can compute a variational bound on the true likelihood using a posterior $q(\mathbf{z}_{0}|\mathbf{x})$ *[10]*. Since $p_{\theta}^{\text{MDM}}$ models masked sequences, we choose $q$ to be a simple masking distribution. Specifically, we set $q$ to $q_{0}(\mathbf{z}_{0}|\mathbf{x})$ as defined in (1), which independently masks each token $(\mathbf{x}^{\ell})_{\ell\in[L]}$ with probability $1-\alpha_{0}$, where $\alpha_{0}\in[0,1]$. This leads to the following variational bound:

$-\log p_{\theta}(\mathbf{x})$ $\leq-\mathbb{E}_{\mathbf{z}_{0}\sim q_{0}(.|\mathbf{x})}[\log p_{\theta}^{\text{AR}}(\mathbf{x}|\mathbf{z}_{0})]+\text{D}_{\text{KL}}(q_{0}(\mathbf{z}_{0}|\mathbf{x})\|p_{\theta}^{\text{MDM}}(\mathbf{z}_{0}))$ (6)
$=-\mathbb{E}_{\mathbf{z}_{0}\sim q_{0}(.|\mathbf{x})}\left[\sum_{\ell\in\mathcal{M}(\mathbf{z}_{0})}\log p_{\theta}^{\text{AR}}(\mathbf{x}^{\ell}|\mathbf{z}_{0},\mathbf{x}^{<\ell})\right]+\text{D}_{\text{KL}}(q_{0}(\mathbf{z}_{0}|\mathbf{x})\|p_{\theta}^{\text{MDM}}(\mathbf{z}_{0})).$

Here, $p_{\theta}^{\text{AR}}(\mathbf{x}|\mathbf{z}_{0})$ is the joint AR likelihood over masked positions $\ell\in\mathcal{M}(\mathbf{z}_{0})$, conditioned on the clean tokens in $\mathbf{z}_{0}$. For AR, the denoising network $\mathbf{x}_{\theta}:\mathcal{V}^{L}\rightarrow(\Delta^{K})^{L}$ operates on the input $\mathbf{z}_{0}\odot\mathbf{x}^{<\ell}$, where the substitution operator $\odot$ replaces the first $l-1$ tokens in $\mathbf{z}_{0}$ with $\mathbf{x}^{<\ell}$. For each $\ell\in\mathcal{M}(\mathbf{z}_{0})$, $\mathbf{x}_{\theta}^{\ell}(\mathbf{z}_{0}\odot\mathbf{x}^{<\ell})$ approximates the distribution of the clean token $\mathbf{x}^{\ell}$ given $\mathbf{x}^{<\ell}$ and $\mathbf{z}_{0}$, which may include clean tokens beyond position $\ell$. In Suppl. B.1, we analyze the KL term and show that the NELBO is:

$\mathcal{L}_{\text{NELBO}}(\mathbf{x})=\mathbb{E}_{\mathbf{z}_{0}\sim q_{0}}\underbrace{\left[-\sum_{\ell\in\mathcal{M}(\mathbf{z}_{0})}\log\langle\mathbf{x}_{\theta}^{\ell}(\mathbf{z}_{0}\odot\mathbf{x}^{<\ell}),\mathbf{x}^{\ell}\rangle\right]}_{\text{AR loss}}+\underbrace{\int_{t=0}^{t=1}\frac{\alpha_{t}^{\prime}}{1-\alpha_{t}}\mathbb{E}_{\mathbf{z}_{t}\sim q_{t}}\left[\sum_{\ell\in\mathcal{M}(\mathbf{z}_{t})}\log\langle\mathbf{x}_{\theta}^{\ell}(\mathbf{z}_{t}),\mathbf{x}^{\ell}\rangle\right]}_{\text{MDM loss}}\text{dt}.$ (7)

###

---

#### Interpolating between AR and Diffusion

When $\alpha_{0}=1$, the posterior sample $\mathbf{z}_{0}=\mathbf{x}$, and all tokens are generated by the MDM; hence, the AR loss is zero in (7), and $\mathcal{L}_{\text{NELBO}}$ reduces to the MDM loss. Conversely, when $\alpha_{0}=0$, all tokens are masked, and the MDM loss vanishes, reducing $\mathcal{L}_{\text{NELBO}}$ to the AR loss. Thus, Eso-LMs interpolate between AR and MDM paradigms, controlled by the hyperparameter $\alpha_{0}$.

### 3.2 Sampling

We perform the two-stage sampling defined by (5): to sample from $p_{\theta}(\mathbf{x})$, we first draw a partially masked sequence $\mathbf{z}_{0}\sim p_{\theta}^{\text{MDM}}$ and then complete it using $p_{\theta}^{\text{AR}}$.

#### Diffusion Phase

Starting from a fully masked sequence $\mathbf{z}_{t=1}=\mathbf{m}^{1:L}$, standard ancestral sampling (Sec. 2.2) updates only a subset of masked tokens at each step while doing a forward pass over the full sequence—wasting FLOPs. To improve efficiency, we propose two key changes to the standard sampling and the training procedure. During sampling, we pre-compute the diffusion denoising schedule $\mathcal{S}^{\text{MDM}}=(S_{1},\ldots,S_{1/T})$, where $S_{t}$ is the set of mask token indices to be denoised at diffusion step $t$. Instead of processing the entire sequence, we perform a forward pass only over the subsequence $\{\mathbf{z}_{t}^{\ell}|\ell\in\mathcal{C}(\mathbf{z}_{t})\cup S_{t}\}$—i.e., the clean tokens and those scheduled for denoising—substantially reducing computation, especially on long sequences. To match this sampling scheme, the model must avoid bidirectional attention over mask tokens in training, as discussed in Sec. 4. This approach also enables efficient KV-caching during diffusion, as discussed in Sec. 4.2.

#### Sequential Phase

We initialize the final output $\tilde{\mathbf{x}}$ as $\mathbf{z}_{0}$. The AR model then fills in mask tokens left-to-right with the sequential denoising schedule $\mathcal{S}^{\text{AR}}=((i)|i\in\mathcal{M}(\mathbf{z}_{0}))$ for which we require the single-element sets to be sorted ascendingly by their only element. Unlike standard AR decoding, each $\tilde{\mathbf{x}}^{\ell}$ conditions on both its left context, which consists entirely of clean tokens, and rightward clean tokens in $\mathbf{z}_{0}$, enabling richer generation. We skip evaluation on rightward mask tokens, reducing unnecessary computation. The sequential phase naturally supports KV caching.

We denote the unified denoising schedule by $\mathcal{S}=\mathcal{S}^{\text{MDM}}\cup\mathcal{S}^{\text{AR}}$, which concatenates the two sampling schedules to partition $[L]$. When $\alpha_{0}=1$, all tokens are generated by diffusion, so $\mathcal{S}=\mathcal{S}^{\text{MDM}}$ and $\mathcal{S}^{\text{AR}}=\varnothing$ (null set); when $\alpha_{0}=0$, all tokens are generated sequentially, so $\mathcal{S}=\mathcal{S}^{\text{AR}}$ and $\mathcal{S}^{\text{MDM}}=\varnothing$. See Suppl. B.4 for the full sampling algorithm and an illustrative example.

## 4 Designing Attention Mechanisms for the Shared Denoising Transformer

In this section, we introduce a unified modeling framework that supports both sequential (AR) and parallel (MDM) generation modes using a shared transformer architecture. Our core technical contribution is a flexible attention mechanism that reconciles the architectural mismatch between AR models—which require causal attention and shift-by-one decoding—and MDMs—which rely on bidirectional attention. To achieve this, we introduce an attention bias matrix $A\in\{-\infty,0\}^{L^{\prime}\times L^{\prime}}$, where $L^{\prime}$ is the sequence length, that modulates the standard attention as:

$\textsc{Self-Attention}(Q,K,V,A)=\texttt{softmax}\left(\frac{QK^{\prime}}{\sqrt{d}}+A\right)V$

where $Q,K,V\in\mathbb{R}^{L^{\prime}\times d}$ denote the query, key, and value matrices. Entries of $A$ control information flow: $A_{i,j}=0$ “permits” and $A_{i,j}=-\infty$ “blocks” attention from token $i$ to $j$. This mechanism enables a single transformer to emulate both causal and bidirectional behaviors as needed.

Building on this unified attention scheme, we propose two variants: Eso-LM (A) and Eso-LM (B). Eso-LM (A) focuses on reducing computation by sparsifying attention and selectively applying the denoising transformer to subsets of mask tokens at each diffusion step. Eso-LM (B) further extends this idea by introducing causal masking not only over mask tokens but also over clean tokens, enabling KV-caching for even greater speedups—at the cost of a slight drop in perplexity. In the rest of this section, we describe the attention formulation that enables this unification and detail the differences between these two variants in both diffusion and sequential phases.

#### Diffusion Phase

Standard MDMs suffer from two inefficiencies during sampling: (i) full-sequence forward passes even for partial updates, and (ii) no KV caching across steps due to bidirectional

---

![img-1.jpeg](img-1.jpeg)
Figure 2: Comparison of attention biases for diffusion-phase training. Orange represents 0 (attention) and gray represents  $-\infty$  (no attention). The clean sequence is  $\mathbf{x} = (A, B, C, D, E, F)$ . After random masking, we obtain  $\mathbf{z}_t = (A, M, C, M, M, F)$ . The integers denote the position indices with  $\mathcal{M}(\mathbf{z}_t) = \{2, 4, 5\}$  and  $\mathcal{C}(\mathbf{z}_t) = \{1, 3, 6\}$ . The random ordering is  $\sigma = (3, 1, 6, 4, 5, 2) \sim \mathcal{P}_6$  with clean tokens before mask tokens. Red highlights differences between Eso-LM (A) and Eso-LM (B).

![img-2.jpeg](img-2.jpeg)

![img-3.jpeg](img-3.jpeg)

attention. As briefly discussed in Sec. 3.2, we address (i) by evaluating  $\mathbf{x}_R$  only on  $\{\mathbf{z}_t^i | i \in \mathcal{C}(\mathbf{z}_t) \cup S_t\}$  at step  $t$ . To unlock this possibility, we adopt a key idea from AO-ARMs [20]: mask tokens can be revealed in any order. Hence, during training, we sample random orderings  $\sigma \sim \mathcal{P}_L$  and enforce causal attention over the mask tokens  $\{\mathbf{z}_t^i | i \in \mathcal{M}(\mathbf{z}_t)\}$  per  $\sigma$ . Specifically, we enforce mask token  $(\mathbf{z}_t^i)_{i \in \mathcal{M}(\mathbf{z}_t)}$  to only attend to clean tokens and prior masked tokens per  $\sigma$ . Eso-LM (A) (Sec. 4.1) uses this strategy to significantly reduce computation during sampling while maintaining performance. Eso-LM (B) (Sec. 4.2) extends this by enforcing similar causal masks on clean tokens, enabling KV caching. Though slightly worse in perplexity, Eso-LM (B) offers major speed-ups (up to  $65 \times$ ) during sampling (Sec. 5.2).

Sequential Phase During sequential generation, the model needs to denoise mask tokens  $(\mathbf{z}_0^i)_{t\in \mathcal{M}(\mathbf{z}_0)}$  produced by  $\mathbf{z}_0\sim p_\theta^{\mathrm{MDM}}(.)$  from left to right. This is straightforward during generation but challenging during training. Unlike standard AR models where each token attends only to its left, each mask token  $\mathbf{z}_0^i$  must attend to (i) itself (for positional embedding), (ii) the clean left context  $\mathbf{x}^{&lt;  i}$  (assuming that all prior mask tokens in  $\mathbf{z}_0^{&lt;  i}$  have been filled), (iii) and clean tokens in the right context  $\{\mathbf{x}^j |j\in \mathcal{C}(\mathbf{z}_0),j &gt; i\}$  or equivalently  $\{\mathbf{z}_0^j |j\in \mathcal{C}(\mathbf{z}_0),j &gt; i\}$ . Handling (ii) during training is non-trivial because each mask token in  $\mathbf{z}_0$  assumes the tokens to its left are already denoised by  $p_\theta^{\mathrm{AR}}$ . To simulate this behavior, we feed the concatenated sequence  $\mathbf{z}_0\oplus \mathbf{x}$  into the transformer during training and construct a custom attention mask  $A$  that enforces the correct information flow for all mask tokens. The loss is computed only on the logits corresponding to the masked tokens in  $\mathbf{z}_0$  as per (7). During generation, this issue is naturally resolved, and no concatenation is required.

# 4.1 Eso-LM (A)

We introduce Eso-LM (A), which removes bidirectional attention over mask tokens in the denoising transformer during the diffusion phase. This modification enables the use of the sampling schedule described in Sec. 3.2, allowing for faster inference. Eso-LM (A) only supports KV caching during sequential sampling but performs significantly less computation than standard MDMs during diffusion sampling.

# 4.1.1 Training

Diffusion Phase The denoising transformer receives  $\mathbf{z}_t\sim q_t(.|\mathbf{x})$  as input, which contains the mask tokens to denoise, and  $\mathbf{x}$  as target. A random ordering  $\sigma \sim \mathcal{P}_L$  is sampled with the natural constraint that clean tokens in  $\mathbf{z}_t$  precede mask tokens in  $\mathbf{z}_t$  in  $\sigma$ . We define the  $L\times L$  attention bias by

$$
A _ {i, j} = \left\{ \begin{array}{l l} 0 &amp; \forall (i, j) \in \mathcal {C} \left(\mathbf {z} _ {t}\right) \times \mathcal {C} \left(\mathbf {z} _ {t}\right) \\ 0 &amp; \text {i f} \sigma^ {- 1} (i) \geq \sigma^ {- 1} (j) \forall (i, j) \in \mathcal {M} \left(\mathbf {z} _ {t}\right) \times [ L ] \\ - \infty &amp; \text {o t h e r w i s e .} \end{array} \right. \tag {10}
$$

Clean tokens  $\{\mathbf{z}_t^i | i \in \mathcal{C}(\mathbf{z}_t)\}$  have bidirectional attention among them (8), while a mask token  $(\mathbf{z}_t^i)_{i \in \mathcal{M}(\mathbf{z}_t)}$  attends to clean tokens, itself and prior mask tokens per  $\sigma$  (9). Note that we ignore the

---

ordering among clean tokens in  $\sigma$  and simply use of bidirectional attention among them. See Fig. 2 for an example. Interestingly,  $A$  becomes a Prefix-LM [25] attention bias if we sort the rows and columns of  $A$  by  $\sigma$  (Fig. 7); we exploit this property in our implementation (Suppl. B.5).

Sequential Phase The denoising transformer receives the concatenated sequence  $\mathbf{z}_0\oplus \mathbf{x}\in \mathcal{V}^{2L}$  as input, where  $\mathbf{z}_0\sim q_0(.|\mathbf{x})$  contains the mask tokens to denoise, and  $\mathbf{x}$  as target. We define the  $2L\times 2L$  attention bias by

|  Ai,j=0 | if i=j∀(i,j)∈M(z0)×M(z0) | (11)  |
| --- | --- | --- |
|  Ai,j+L=0 | ∀(i,j)∈M(z0)×C(z0) | (12)  |
|  Ai,j+L=0 | if i>j∀(i,j)∈M(z0)×M(z0) | (13)  |
|  Ai+L,j+L=0 | ∀(i,j)∈C(z0)×C(z0) | (14)  |
|  Ai+L,j+L=0 | ∀(i,j)∈M(z0)×C(z0) | (15)  |
|  Ai+L,j+L=0 | if i≥j∀(i,j)∈M(z0)×M(z0) | (16)  |
|  Ai,j=-∞ | otherwise. | (17)  |

The attention mechanism for tokens in the noisy context  $\mathbf{z}_0$  is described as follows. A mask token  $(\mathbf{z}_0^i)_{i\in \mathcal{M}(\mathbf{z}_0)}$  attends to (i) itself (11), (ii) the clean tokens  $\{\mathbf{x}^j |j\in \mathcal{C}(\mathbf{z}_0)\}$  (12) and (iii) the clean versions of mask tokens on its left  $\{\mathbf{x}^j |j\in \mathcal{M}(\mathbf{z}_0),i &gt; j\}$  (13). A clean token  $(\mathbf{z}_0^i)_{i\in \mathcal{C}(\mathbf{z}_0)}$  can attend to anything because no other token attends to them (17). The attention mechanism for tokens in the clean context  $\mathbf{x}_0$  is described as follows. Tokens  $\{\mathbf{x}^i |i\in \mathcal{C}(\mathbf{z}_0)\}$  have bidirectional attention (14). A clean token corresponding to a mask token,  $(\mathbf{x}^i)_{i\in \mathcal{M}(\mathbf{z}_0)}$ , attends to  $\{\mathbf{x}^j |j\in \mathcal{C}(\mathbf{z}_0)\}$  (15) and  $\{\mathbf{x}^j |j\in \mathcal{M}(\mathbf{z}_0),i\geq j\}$  (16).

See Fig. 6 for an example. Let  $\sigma$  be an ordering with two properties: (i) clean tokens in  $\mathbf{z}_0$  precede mask tokens in  $\mathbf{z}_0$  in  $\sigma$  and (ii) mask tokens in  $\mathbf{z}_0$  are in natural order in  $\sigma$ . Again, the ordering among clean tokens  $\{\mathbf{x}^i | i \in \mathcal{C}(\mathbf{z}_0)\}$  is ignored and we use bidirectional attention among them. When the rows and columns of each of the four  $L$ -by- $L$  blocks are sorted by  $\sigma$ ,  $A$  displays a sparse and patterned block structure (Fig. 8) that we exploit in our implementation (Suppl. B.5).

# 4.1.2 Sampling

During diffusion or sequential sampling, given a partially masked sequence  $\mathbf{z}_k$ , the denoising model is required to denoise the mask tokens  $\{\mathbf{z}_k^i | i \in S_k\}$  for  $S_k \in S = \{S_1, \ldots, S_K\}$  where  $K = |\mathcal{S}|$ . We perform a forward pass on the subset of tokens  $\{\mathbf{z}_k^i | i \in \mathcal{C}(\mathbf{z}_k) \cup S_k\}$ . It is crucial to note that while performing a forward pass on a subset of tokens, the positional embeddings of these tokens in the actual sequence are preserved. Below we discuss the attention bias used in the forward pass.

Let  $D_{k}^{\mathrm{MDM}}$  be the set of indices of tokens decoded in the diffusion phase prior to step  $k$  and  $D_{k}^{\mathrm{AR}}$  be that for the sequential phase. Let ordering  $\sigma$  be the order in which we denoise tokens defined by  $S$ . We define the  $L \times L$  attention bias at step  $k$  by

|  Ai,j= | 0 | ∀(i,j)∈DkMDM×DkMDM | (18)  |
| --- | --- | --- | --- |
|   |  0 | ∀(i,j)∈DkAR×DkMDM | (19)  |
|   |  0 | if i≥j∀(i,j)∈DkAR×DkAR | (20)  |
|   |  0 | ∀(i,j)∈Sk×(DkMDM∪DkAR) | (21)  |
|   |  0 | if σ-1(i)≥σ-1(j)∀(i,j)∈Sk×Sk | (22)  |
|   |  -∞ | otherwise. | (23)  |

Clean tokens decoded during diffusion  $\{\mathbf{z}_k^i | i \in D_k^{\mathrm{MDM}}\}$  have bidirectional attention among them (18). A clean token decoded sequentially  $(\mathbf{z}_k^i)_{i \in D_k^{\mathrm{AR}}}$  attends to clean tokens decoded during diffusion  $\{\mathbf{z}_k^j | j \in D_k^{\mathrm{MDM}}\}$  (19), itself, and prior clean tokens decoded sequentially  $\{\mathbf{z}_k^j | j \in D_k^{\mathrm{AR}}, i &gt; j\}$  (20). A mask token to denoise  $(\mathbf{z}_k^i)_{i \in S_k}$  attends to all decoded clean tokens  $\{\mathbf{z}_k^j | j \in D_k^{\mathrm{MDM}} \cup D_k^{\mathrm{AR}}\}$  (21), itself, and prior mask tokens to denoise per  $\sigma$ :  $\{\mathbf{z}_k^j | j \in S_k, \sigma^{-1}(i) &gt; \sigma^{-1}(j)\}$  (22). Mask tokens not scheduled to denoise  $(\mathbf{z}_k^i)_{i \in S_{&gt;k}}$  can attend to anything because no other token attends to them (23).

Since (i)  $(\mathbf{z}_k^i)_{i\in \mathcal{C}(\mathbf{z}_k)\cup S_k}$  does not attend to  $\{\mathbf{z}_k^i |i\in S_{&gt;k}\}$  and (ii) we only use the transformer output over  $\{\mathbf{z}_k^i |i\in S_k\}$  for sampling clean tokens, any computation over  $\{\mathbf{z}_k^i |i\in S_{&gt;k}\}$  can be avoided, leading to significantly less computation during the diffusion phase. Fig. 9 shows how this sampling procedure generates an example sequence, with KV caching during the sequential phase.

---

8

## 4.2 Eso-LM (B)

Eso-LM (A) can perform KV caching during sequential sampling but cannot do so during diffusion sampling because clean tokens have bidirectional attention among them. Hence, after a set of mask tokens is denoised, the KVs for all clean tokens, now including the newly denoised tokens, must be updated. To enable KV caching during diffusion sampling, we enforce causal attention among clean tokens, which leads to Eso-LM (B). We also enable a shared KV cache between the two phases.

## 4.2.1 Training

**Diffusion Phase** The denoising transformer receives $\mathbf{z}_t \sim q_t(.|\mathbf{x})$ as input, which contains the mask tokens to denoise, and $\mathbf{x}$ as target. We leverage the connection of MDMs with AO-ARMs [20], which establishes that not only can mask tokens $\{\mathbf{z}_t^i | i \in \mathcal{M}(\mathbf{z}_t)\}$ be generated in any random order (Sec. 4.1.1), clean tokens $\{\mathbf{z}_t^i | i \in \mathcal{C}(\mathbf{z}_t)\}$ also could have been generated in any random order. Hence, we sample a random ordering $\sigma \sim \mathcal{P}_L$ with the natural constraint that clean tokens in $\mathbf{z}_t$ precede mask tokens in $\mathbf{z}_t$ in $\sigma$. Unlike in Sec. 4.1.1, we now constrain a clean token $(\mathbf{z}_t^i)_{i \in \mathcal{C}(\mathbf{z}_t)}$ to only attend to itself and prior clean tokens per $\sigma$. Similarly and as in Sec. 4.1.1, a mask token $(\mathbf{z}_t^i)_{i \in \mathcal{M}(\mathbf{z}_t)}$ attends to clean tokens, itself, and prior mask tokens per $\sigma$. Hence we define the $L \times L$ attention bias by

$$
A_{i,j} = \begin{cases}
0 &amp; \text{if } \sigma^{-1}(i) \geq \sigma^{-1}(j) \ \forall (i,j) \in [L] \times [L] \\
-\infty &amp; \text{otherwise.}
\end{cases} \tag{24}
$$

See Fig. 2 for an example. Further, $A$ becomes a causal attention bias if we sort the rows and columns of $A$ by $\sigma$ (Fig. 7); we exploit this property in our implementation (Suppl. B.5).

**Sequential Phase** The denoising transformer receives the concatenated sequence $\mathbf{z}_0 \oplus \mathbf{x} \in \mathcal{V}^{2L}$ as input, where $\mathbf{z}_0 \sim q_0(.|\mathbf{x})$ contains the mask tokens to denoise, and $\mathbf{x}$ as target. During sampling, the clean context in $\mathbf{z}_0 \sim p_{\phi}^{\mathrm{MDM}}$, on which causal attention is applied and KV cache is built, is provided by the diffusion phase. To effectively use the KV cache built from the diffusion phase, we must enforce similar causal attention among clean tokens $\{\mathbf{x}^i | i \in \mathcal{C}(\mathbf{z}_0)\}$ during training for the sequential phase. To achieve this, we first sample $\sigma \sim \mathcal{P}_L$ with the constraints that (i) clean tokens in $\mathbf{z}_0$ precede mask tokens in $\mathbf{z}_0$ in $\sigma$ and (ii) mask tokens are in natural order in $\sigma$. Then, we reuse (11)-(17) but replace the bidirectional attention over $\{\mathbf{x}^i | i \in \mathcal{C}(\mathbf{z}_0)\}$ (14) with causal attention per $\sigma$ (29):

$$
A_{i,j} = 0 \quad \text{if } i = j \ \forall (i,j) \in \mathcal{M}(\mathbf{z}_0) \times \mathcal{M}(\mathbf{z}_0) \tag{26}
$$

$$
A_{i,j+L} = 0 \quad \forall (i,j) \in \mathcal{M}(\mathbf{z}_0) \times \mathcal{C}(\mathbf{z}_0) \tag{27}
$$

$$
A_{i,j+L} = 0 \quad \text{if } i &gt; j \ \forall (i,j) \in \mathcal{M}(\mathbf{z}_0) \times \mathcal{M}(\mathbf{z}_0) \tag{28}
$$

$$
A_{i+L,j+L} = 0 \quad \text{if } \sigma^{-1}(i) \geq \sigma^{-1}(j) \ \forall (i,j) \in \mathcal{C}(\mathbf{z}_0) \times \mathcal{C}(\mathbf{z}_0) \tag{29}
$$

$$
A_{i+L,j+L} = 0 \quad \forall (i,j) \in \mathcal{M}(\mathbf{z}_0) \times \mathcal{C}(\mathbf{z}_0) \tag{30}
$$

$$
A_{i+L,j+L} = 0 \quad \text{if } i \geq j \ \forall (i,j) \in \mathcal{M}(\mathbf{z}_0) \times \mathcal{M}(\mathbf{z}_0) \tag{31}
$$

$$
A_{i,j} = -\infty \quad \text{otherwise.} \tag{32}
$$

See Fig. 6 for an example. When the rows and columns of each of the four $L \times L$ blocks are sorted by $\sigma$, $A$ displays structures (Fig. 8) that we exploit in implementation (Suppl. B.5).

## 4.2.2 Sampling

Following the same setup and notation in Sec. 4.1.2, we reuse (18)-(23) but replace the bidirectional attention over $D_k^{\mathrm{MDM}}$ (18) with causal attention per $\sigma$, the denoising ordering (33):

$$
A_{i,j} = \begin{cases}
0 &amp; \text{if } \sigma^{-1}(i) \geq \sigma^{-1}(j) \ \forall (i,j) \in D_k^{\mathrm{MDM}} \times D_k^{\mathrm{MDM}} \\
0 &amp; \forall (i,j) \in D_k^{\mathrm{AR}} \times D_k^{\mathrm{MDM}} \\
0 &amp; \text{if } i \geq j \ \forall (i,j) \in D_k^{\mathrm{AR}} \times D_k^{\mathrm{AR}} \\
0 &amp; \forall (i,j) \in S_k \times (D_k^{\mathrm{MDM}} \cup D_k^{\mathrm{AR}}) \\
0 &amp; \text{if } \sigma^{-1}(i) \geq \sigma^{-1}(j) \ \forall (i,j) \in S_k \times S_k \\
-\infty &amp; \text{otherwise.}
\end{cases} \tag{38}
$$

**KV Caching in Both Phases** Here, as in Sec. 4.1.2, we do not perform computation over future mask tokens $\{\mathbf{z}_k^i | i \in S_{&gt;k}\}$. Further, since previously decoded tokens, regardless of whether they were decoded by diffusion or sequentially, have causal attention among them, newly generated tokens at step $k$ can be used to build the KV cache at step $k+1$ and have their cached KV values used starting at step $k+2$. Fig. 1 shows how this sampling procedure generates an example sequence.

---

5 Experiments

We evaluate Eso-LMs on two standard language modeling benchmarks: the One Billion Words dataset (LM1B) *[3]* and OpenWebText (OWT) *[6]*. For LM1B, we use the bert-base-uncased tokenizer *[5]* and a context length of 128, reporting perplexity on the test split. For OWT, which lacks a standard split, we follow *[26, 27, 1]* and reserve the last 100K documents for validation, using the GPT2 tokenizer *[24]* and a context length of 1024. All models use the transformer architecture from Lou et al. *[15]*, which builds on the diffusion transformer *[22]* with rotary embeddings *[33]*. Following Arriola et al. *[1]*, Austin et al. *[2]*, and unlike Sahoo et al. *[26]*, Lou et al. *[15]*, He et al. *[7]*, we apply sequence packing to LM1B, making our setup more challenging and resulting in higher perplexities given the same model (Table 1). Models are trained for 1M steps on LM1B and 250K steps on OWT, without timestep conditioning. Models are trained on H200 GPUs and benchmarked on A6000 GPUs. Full hyperparameters and training details are provided in Suppl. B.6.

### 5.1 Likelihood Evaluation

Our experiments show that Eso-LMs achieve state-of-the-art perplexities among diffusion models on LM1B and OWT, while providing finer-grained interpolation between MDM and AR perplexities (Table 1 and Table 2).

Experimental Setup We compare Eso-LMs against leading masked diffusion models—MDLM *[26]*, SEDD *[15]*, D3PM *[2]*, and DiffusionBERT *[7]*—as well as uniform state models DUO *[27]*, UDLM *[29]*, and specifically BD3-LMs *[1]*, which also interpolate between MDM and AR and support KV caching. All models are trained with batch_size=512, consistent with prior work. We split each batch evenly: half trained with the AR loss and half with the MDM loss (7). Refer to Table 5 for an ablation on the split proportion. Refer to Algo. 1 for the training procedure. Attention biases are configured as described in Sec. 4. When training Eso-LMs as a pure MDM ($\alpha_{0}=1$), the full batch is trained with the MDM loss. For this setting only, we replace the diffusion coefficient $\alpha_{t}^{\prime}/(1-\alpha_{t})$ with $-1$, which empirically reduced training variance and improved convergence.

Results For our method, PPL is computed using (7). On LM1B, we train Eso-LM (A) with $\alpha_{0}\in\{0.0625,0.125,0.25,0.5,1.0\}$, and Eso-LM (B) with $\alpha_{0}=1$. We find that Eso-LM (A) effectively interpolates between MDLM and AR perplexities. Surprisingly, Eso-LM (A), which modifies MDMs by replacing bidirectional attention over mask tokens with a causal mask, outperforms MDLM by $\approx 1$ PPL at $\alpha_{0}=1$. This improvement can be attributed to the low-variance training loss as described earlier. In contrast, Eso-LM (B) introduces causal dependencies among clean tokens, which degrades performance by $\approx 4$ PPL compared to Eso-LM (A) at $\alpha_{0}=1$. This is expected because bidirectional attention on the clean tokens in Eso-LM (A) is strictly more expressive than causal attention in Eso-LM (B). On OWT, Eso-LM (B) is particularly compelling as it is the only model—BD3-LMs included—that supports KV caching during the diffusion phase. Trained with $\alpha_{0}\in\{0.0625,0.125,0.25,0.5,1.0\}$, it shows smooth interpolation between AR and MDM perplexities (Table 2). As with LM1B, Eso-LM (A) remains competitive with MDLM on OWT.

### 5.2 Generation Speed

Our qualitative evaluation experiments show that Eso-LMs are $3-4\times$ faster than prior diffusion based methods that support KV caching and about up to $65\times$ faster than MDMs that don’t support KV caching.

Experimental Setup Diffusion models like MDLM do not support KV caching due to their use of bidirectional attention. Semi-autoregressive models such as BD3-LMs enable partial KV caching by generating blocks of tokens autoregressively and caching completed blocks, but they still lack caching for the current block under diffusion. In contrast, our method uniquely supports KV caching during the diffusion phase. We compare inference times of our method, Eso-LM (B), against MDLM and BD3-LMs with context lengths $L\in\{2048,8192\}$, using the first-hitting sampler *[37]*, and a batch size of 1. To simulate the worst-case scenario, we set $T\gg L$ to ensure all methods have approximately $L$ NFEs: $T$ = 1M for MDLM and Eso-LM (B), $T^{\prime}=5000$ (number of sampling steps per block) for BD3-LMs. We found that nucleus sampling yields a non-negligible overhead for all methods, and hence disable it to focus on the relation between sampling speed and sequence length.

---

Table 1: Test perplexities (PPL; ↓) on LM1B. *Reported in He et al. [7]. †Denotes the dataset didn't incorporate sentence packing. †Reported in Arriola et al. [1]. For diffusion models, we report the bound on the likelihood. ‡Reported in Sahoo et al. [27].

|   | PPL (↓)  |
| --- | --- |
|  Autoregressive  |   |
|  Transformer‡ | 22.83  |
|  Diffusion  |   |
|  D3PM Uniform [2] | 137.90$  |
|  D3PM Absorb [2] | 76.90$  |
|  Diffusion-LM* [12] | 118.62$  |
|  DiffusionBert [7] | 63.78  |
|  SEDD Absorb‡ [15] | 32.71$  |
|  SEDD Uniform$ [15] | 40.25$  |
|  MDLM‡ [26] | 31.78  |
|  UDLM‡ [29] | 36.71  |
|  DUO‡ [27] | 33.68  |
|  Interpolating diffusion and autoregressive  |   |
|  BD3-LMs† [1]  |   |
|  L' = 16 | 30.60  |
|  L' = 8 | 29.83  |
|  L' = 4 | 28.23  |
|  Eso-LM (B) (Ours)  |   |
|  α0 = 1.0 | 35.00  |
|  Eso-LM (A) (Ours)  |   |
|  α0 = 1.0 | 30.96  |
|  α0 = 0.5 | 30.51  |
|  α0 = 0.25 | 28.44  |
|  α0 = 0.125 | 25.97  |
|  α0 = 0.0625 | 24.51  |

Table 2: Test perplexities (PPL; ↓) on OWT for models trained for 250K. ‡ Reported in [1]. † Denotes retrained models. ‡ Intermediate checkpoints were provided by Sahoo et al. [26].

|   | PPL (↓)  |
| --- | --- |
|  Autoregressive  |   |
|  Transformer | 17.90$  |
|  Diffusion  |   |
|  SEDD Absorb [15] | 26.81$  |
|  MDLM [26] | 25.76$  |
|  UDLM [29] | 30.52$  |
|  DUO [27] | 27.14$  |
|  Interpolating diffusion and autoregressive  |   |
|  BD3-LMs [1]  |   |
|  L' = 16 | 23.57†  |
|  Eso-LM (A) (Ours)  |   |
|  α0 = 1 | 26.21  |
|  Eso-LM (B) (Ours)  |   |
|  α0 = 1 | 30.14  |
|  α0 = 0.5 | 27.85  |
|  α0 = 0.25 | 24.73  |
|  α0 = 0.125 | 21.87  |

Table 3: Sampling time  $(\downarrow)$  in seconds for sequence lengths  $L \in \{2048, 8192\}$  with NFEs set to  $L$  for all methods. Reported values are mean at over 5 runs.

|  Method | L = 2048 | L = 8192  |
| --- | --- | --- |
|  AR (Oracle) | 13.30.9 | 54.00.2  |
|  MDLM | 201.30.4 | 5438.33.3  |
|  BD3-LM (L' = 4) | 24.30.7 | 312.01.7  |
|  BD3-LM (L' = 16) | 21.30.1 | 268.11.2  |
|  Eso-LM (B) | 14.60.3 | 82.10.3  |

Results As shown in Table 3, as compared to MDLM which lacks KV caching, Eso-LM (B) is

$\sim 14 \times$  faster for  $L = 2048$ , and  $\sim 65 \times$  faster for  $L = 8192$ . Compared to BD3-LMs, which partially support caching, Eso-LM (B) is  $\sim 3.2 \times$  faster than BD3-LM ( $L' = 16$ ) and  $\sim 3.8 \times$  faster than BD3-LM ( $L' = 4$ ) at  $L = 8192$ . This speedup stems from KV-caching and the scheduler  $S$  that restricts the forward pass to the masked tokens that are supposed to be denoised and previously predicted tokens, avoiding redundant computation—a feature BD3-LMs lack. As we restrict the NFEs to  $L$ , our method is slower than AR models due to delayed KV reuse—only possible from the penultimate denoising step—its overall efficiency still surpasses prior diffusion-based baselines (see Sec. 4.2.2).

# 5.3 Generation Quality

Our sampling experiments show that (1) Eso-LMs establish a new SOTA on the Pareto frontier of sampling speed and quality (Fig. 4), (2) generate higher-quality samples than all previous diffusion models at high NFEs, and (3) don't suffer mode collapse at low NFEs unlike the previous interpolating diffusion method BD3-LMs (Fig. 3).

Experimental Setup We train Eso-LM (B) with  $\alpha_0^{\mathrm{train}} \in \{0.125, 0.25, 1\}$  and generate samples with varying  $(\alpha_0^{\mathrm{eval}}, T) \in \{0.0625, 0.25, 0.5, 1\} \times \{16, 128, 1024\}$  to control NFEs (NFEs =  $|S|$ ). MDLM and BD3-LMs use ancestral sampling as proposed in Sahoo et al. [26], with  $T \in \{16, 128, 256, 512, 1024, 4096\}$  for MDLM and  $T \in \{16, 128, 256, 512, 1024, 2048, 4096\}$  for BD3-LMs. All generations are  $L = 1024$  tokens long. BD3-LMs are evaluated with block sizes  $L' \in \{4, 8, 16\}$  and  $T' = T / (1024 / L')$ . Consequently,  $T = 128$  is not applicable to BD3-LMs with  $L' = 4$  and  $T = 16$  is not applicable to all BD3-LMs considered, since these would result in  $T'$  values

---

![img-4.jpeg](img-4.jpeg)
Figure 3: Gen. PPL vs. NFEs for models trained on OWT. Entropy values are in Tables (8, 9, 10).

![img-5.jpeg](img-5.jpeg)
Figure 4: Eso-LM (B) establishes SOTA on the Pareto frontier of sampling speed and quality.

less than 1. We measure Gen. Perplexity (via GPT-2 Large) for sample quality and average entropy for diversity [37], using nucleus sampling with  $p = 0.9$  [35].

Pareto frontier of Gen. PPL vs. NFEs As shown in Fig. 3, at high NFEs ( $\approx$  1024), Eso-LM (B) outperforms MDLM and BD3-LMs and nearly matches AR model quality. As NFEs decrease, BD3-LMs degrade significantly due to their teacher-forced training: the future blocks are conditioned on clean prior blocks during training but during evaluation, any errors in the prediction of prior blocks lead to a significant degradation in sample quality. Eso-LMs avoid this issue. As expected, in the low NFE regime, higher  $\alpha_0^{\mathrm{train}}$  ("more diffusion" during training) improves quality:  $\alpha_0^{\mathrm{train}} = 1$  performs best among  $\alpha_0^{\mathrm{train}} = \{0.125, 0.25, 1\}$ , while remaining competitive with MDLM. Overall, Eso-LM (B) is competitive with MDLM at low NFEs and with AR models at high NFEs—unlike BD3-LMs.

Pareto frontier of Gen. PPL vs. Speed To compare sampling efficiency, we record the median sampling duration in seconds (across 5 trials) taken by each method to generate a single sample and plot Gen. PPL vs. sampling duration in Fig. 4. At the limit of infinite trials, median sampling duration is an increasing function of NFEs, modulated by the method and sampling hyperparameters used. For each method, we construct a Pareto frontier over all its configurations: Eso-LM (B) (over  $\alpha_0^{\mathrm{train}}$ ,  $\alpha_0^{\mathrm{eval}}$ , and  $T$ ), BD3-LM (over  $L'$  and  $T$ ), and MDLM (over  $T$ ). We find that Eso-LM (B) establishes a new state of the art on the speed-quality Pareto frontier. Under low budgets on sampling time, models trained with  $\alpha_0^{\mathrm{train}} = 1$  are the best; given high budgets,  $\alpha_0^{\mathrm{train}} = 0.125$  models produce near-AR quality. Intermediate values (e.g.,  $\alpha_0^{\mathrm{train}} = \{0.25, 0.5\}$ ) offer the best trade-off between speed and quality.

# 6 Related Work, Discussion, and Conclusion

AR models AR models generate tokens left-to-right and remain state-of-the-art in quality, but suffer from slow, sequential inference and limited controllability. In contrast, Eso-LMs combines AR-like generation in a sequential phase with any-order, parallel generation in an initial diffusion phase. During diffusion, Eso-LM (B) supports KV caching [23], previously exclusive to AR models, matching their inference speed. Its quality approaches AR models as the sequential phase increases.

Masked diffusion MDMs [26, 30] generate multiple tokens per step but rely on expensive bidirectional attention. Eso-LMs improve their efficiency in two ways: Eso-LM (A) restricts attention to clean and scheduled-to-denoise tokens, and Eso-LM (B), uses the connection to AO-ARMs [20] for KV caching. Even without a sequential phase, Eso-LM (A) is competitive while being more efficient. Though Eso-LM (B) may initially underperform as a standalone diffusion model, adding a sequential phase lets it surpass MDMs in both quality and speed.

Block diffusion BD3-LMs [1] use AR over blocks of tokens and apply MDM within each. They interpolate between AR and MDMs by changing block size, whereas Eso-LMs interpolate by varying the proportion of diffusion generation  $\alpha_0$ . Both support KV caching differently: BD3-LMs cache block-level conditioning, while Eso-LM (B) caches clean-token KV values across denoising steps. BD3-LMs' short blocks ( $L' \leq 16$ ) increase token conflicts [13]; poor samples in one block also

---

severely affect the sample quality of subsequent blocks due to the use of teacher forcing during training. Eso-LMs do not suffer from this problem.

#### Conclusion

We introduce a new paradigm for language modeling that seamlessly fuses autoregressive (AR) models and masked diffusion models (MDMs), enabling effective interpolation between the two in both sample quality and generation speed. Our method is the first to enable KV caching in MDMs while preserving parallel generation, significantly accelerating inference. It outperforms block diffusion methods in both speed and accuracy, setting a new state of the art on language modeling benchmarks. Given we are working on language modeling, we carry the inherent risks and opportunities in this line of research.

## References

- [1] Marianne Arriola, Subham Sekhar Sahoo, Aaron Gokaslan, Zhihan Yang, Zhixuan Qi, Jiaqi Han, Justin T Chiu, and Volodymyr Kuleshov. Block diffusion: Interpolating between autoregressive and diffusion language models. In The Thirteenth International Conference on Learning Representations, 2025. URL https://openreview.net/forum?id=tyEyYT267x.
- [2] Jacob Austin, Daniel D Johnson, Jonathan Ho, Daniel Tarlow, and Rianne Van Den Berg. Structured denoising diffusion models in discrete state-spaces. Advances in Neural Information Processing Systems, 34:17981–17993, 2021.
- [3] Ciprian Chelba, Tomas Mikolov, Mike Schuster, Qi Ge, Thorsten Brants, Phillipp Koehn, and Tony Robinson. One billion word benchmark for measuring progress in statistical language modeling, 2014.
- [4] Arman Cohan, Franck Dernoncourt, Doo Soon Kim, Trung Bui, Seokhwan Kim, Walter Chang, and Nazli Goharian. A discourse-aware attention model for abstractive summarization of long documents. Proceedings of the 2018 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 2 (Short Papers), 2018. doi: 10.18653/v1/n18-2097. URL http://dx.doi.org/10.18653/v1/n18-2097.
- [5] Jacob Devlin, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova. Bert: Pre-training of deep bidirectional transformers for language understanding. arXiv preprint arXiv:1810.04805, 2018.
- [6] Aaron Gokaslan, Vanya Cohen, Ellie Pavlick, and Stefanie Tellex. Openwebtext corpus. http://Skylion007.github.io/OpenWebTextCorpus, 2019.
- [7] Zhengfu He, Tianxiang Sun, Kuanning Wang, Xuanjing Huang, and Xipeng Qiu. Diffusion-bert: Improving generative masked language models with diffusion models. arXiv preprint arXiv:2211.15029, 2022.
- [8] Jonathan Ho, Ajay Jain, and Pieter Abbeel. Denoising diffusion probabilistic models. Advances in neural information processing systems, 33:6840–6851, 2020.
- [9] Diederik Kingma, Tim Salimans, Ben Poole, and Jonathan Ho. Variational diffusion models. Advances in neural information processing systems, 34:21696–21707, 2021.
- [10] Diederik P Kingma and Max Welling. Auto-encoding variational {Bayes}. In ICLR, 2014.
- [11] Seul Lee, Karsten Kreis, Srimukh Prasad Veccham, Meng Liu, Danny Reidenbach, Yuxing Peng, Saee Paliwal, Weili Nie, and Arash Vahdat. Genmol: A drug discovery generalist with discrete diffusion. arXiv preprint arXiv:2501.06158, 2025.
- [12] Xiang Li, John Thickstun, Ishaan Gulrajani, Percy S Liang, and Tatsunori B Hashimoto. Diffusion-lm improves controllable text generation. Advances in Neural Information Processing Systems, 35:4328–4343, 2022.
- [13] Anji Liu, Oliver Broadrick, Mathias Niepert, and Guy Van den Broeck. Discrete copula diffusion.

---

[14] Chengyi Liu, Wenqi Fan, Yunqing Liu, Jiatong Li, Hang Li, Hui Liu, Jiliang Tang, and Qing Li. Generative diffusion models on graphs: Methods and applications. arXiv preprint arXiv:2302.02591, 2023.
- [15] Aaron Lou, Chenlin Meng, and Stefano Ermon. Discrete diffusion modeling by estimating the ratios of the data distribution. arXiv preprint arXiv:2310.16834, 2024.
- [16] Mitch Marcus, Beatrice Santorini, and Mary Ann Marcinkiewicz. Building a large annotated corpus of english: The penn treebank. Computational linguistics, 19(2):313–330, 1993.
- [17] Stephen Merity, Caiming Xiong, James Bradbury, and Richard Socher. Pointer sentinel mixture models, 2016.
- [18] Shen Nie, Fengqi Zhu, Zebin You, Xiaolu Zhang, Jingyang Ou, Jun Hu, Jun Zhou, Yankai Lin, Ji-Rong Wen, and Chongxuan Li. Large language diffusion models. arXiv preprint arXiv:2502.09992, 2025.
- [19] Hunter Nisonoff, Junhao Xiong, Stephan Allenspach, and Jennifer Listgarten. Unlocking guidance for discrete state-space diffusion and flow models. arXiv preprint arXiv:2406.01572, 2024.
- [20] Jingyang Ou, Shen Nie, Kaiwen Xue, Fengqi Zhu, Jiacheng Sun, Zhenguo Li, and Chongxuan Li. Your absorbing discrete diffusion secretly models the conditional distributions of clean data. In The Thirteenth International Conference on Learning Representations, 2025. URL https://openreview.net/forum?id=sMyXP8Tanm.
- [21] Denis Paperno, Germán Kruszewski, Angeliki Lazaridou, Ngoc Quan Pham, Raffaella Bernardi, Sandro Pezzelle, Marco Baroni, Gemma Boleda, and Raquel Fernandez. The LAMBADA dataset: Word prediction requiring a broad discourse context. In Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pp. 1525–1534, Berlin, Germany, August 2016. Association for Computational Linguistics. URL http://www.aclweb.org/anthology/P16-1144.
- [22] William Peebles and Saining Xie. Scalable diffusion models with transformers. In Proceedings of the IEEE/CVF International Conference on Computer Vision, pp. 4195–4205, 2023.
- [23] Reiner Pope, Sholto Douglas, Aakanksha Chowdhery, Jacob Devlin, James Bradbury, Anselm Levskaya, Jonathan Heek, Kefan Xiao, Shivani Agrawal, and Jeff Dean. Efficiently scaling transformer inference, 2022. URL https://arxiv.org/abs/2211.05102.
- [24] Alec Radford, Jeff Wu, Rewon Child, David Luan, Dario Amodei, and Ilya Sutskever. Language models are unsupervised multitask learners. 2019.
- [25] Colin Raffel, Noam Shazeer, Adam Roberts, Katherine Lee, Sharan Narang, Michael Matena, Yanqi Zhou, Wei Li, and Peter J Liu. Exploring the limits of transfer learning with a unified text-to-text transformer. Journal of machine learning research, 21(140):1–67, 2020.
- [26] Subham Sekhar Sahoo, Marianne Arriola, Aaron Gokaslan, Edgar Mariano Marroquin, Alexander M Rush, Yair Schiff, Justin T Chiu, and Volodymyr Kuleshov. Simple and effective masked diffusion language models. In The Thirty-eighth Annual Conference on Neural Information Processing Systems, 2024. URL https://openreview.net/forum?id=L4uaAR4ArM.
- [27] Subham Sekhar Sahoo, Justin Deschenaux, Aaron Gokaslan, Guanghan Wang, Justin T Chiu, and Volodymyr Kuleshov. The diffusion duality. In ICLR 2025 Workshop on Deep Generative Model in Machine Learning: Theory, Principle and Efficacy, 2025. URL https://openreview.net/forum?id=CB0Ub2yXjC.
- [28] Yair Schiff, Chia-Hsiang Kao, Aaron Gokaslan, Tri Dao, Albert Gu, and Volodymyr Kuleshov. Caduceus: Bi-directional equivariant long-range dna sequence modeling. arXiv preprint arXiv:2403.03234, 2024.

---

[29] Yair Schiff, Subham Sekhar Sahoo, Hao Phung, Guanghan Wang, Sam Boshar, Hugo Dallatorre, Bernardo P de Almeida, Alexander M Rush, Thomas PIERROT, and Volodymyr Kuleshov. Simple guidance mechanisms for discrete diffusion models. In The Thirteenth International Conference on Learning Representations, 2025. URL https://openreview.net/forum?id=i5MrJ6g5G1.
- [30] Jiaxin Shi, Kehang Han, Zhe Wang, Arnaud Doucet, and Michalis K. Titsias. Simplified and generalized masked diffusion for discrete data, 2025. URL https://arxiv.org/abs/2406.04329.
- [31] Jascha Sohl-Dickstein, Eric Weiss, Niru Maheswaranathan, and Surya Ganguli. Deep unsupervised learning using nonequilibrium thermodynamics. In International conference on machine learning, pp. 2256–2265. PMLR, 2015.
- [32] Yang Song and Stefano Ermon. Generative modeling by estimating gradients of the data distribution. Advances in neural information processing systems, 32, 2019.
- [33] Jianlin Su, Yu Lu, Shengfeng Pan, Ahmed Murtadha, Bo Wen, and Yunfeng Liu. Roformer: Enhanced transformer with rotary position embedding. arXiv preprint arXiv:2104.09864, 2021.
- [34] Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N Gomez, Łukasz Kaiser, and Illia Polosukhin. Attention is all you need. Advances in neural information processing systems, 30, 2017.
- [35] Guanghan Wang, Yair Schiff, Subham Sahoo, and Volodymyr Kuleshov. Remasking discrete diffusion models with inference-time scaling. arXiv preprint arXiv:2503.00307, 2025.
- [36] Xiang Zhang, Junbo Jake Zhao, and Yann LeCun. Character-level convolutional networks for text classification. In NIPS, 2015.
- [37] Kaiwen Zheng, Yongxin Chen, Hanzi Mao, Ming-Yu Liu, Jun Zhu, and Qinsheng Zhang. Masked diffusion models are secretly time-agnostic masked models and exploit inaccurate categorical sampling. arXiv preprint arXiv:2409.02908, 2024.

---

15

# Contents

1  Introduction  1
2  Background  2
2.1  Autoregressive Models  3
2.2  Masked Diffusion Models  3
2.3  Block Denoising Diffusion Discrete Language Models  3
3  Esoteric Language Models  4
3.1  Fusing Autoregressive Models and Masked Diffusion  4
3.2  Sampling  5
4  Designing Attention Mechanisms for the Shared Denoising Transformer  5
4.1  Eso-LM (A)  6
4.2  Eso-LM (B)  8
5  Experiments  9
5.1  Likelihood Evaluation  9
5.2  Generation Speed  9
5.3  Generation Quality  10
6  Related Work, Discussion, and Conclusion  11
Appendices  16
Appendix A  Background  16
A.1  BD3-LMs hyperparameter  $T^{\prime}$ nd num_tries  16
Appendix B  Esoteric Language Models  17
B.1  MDM loss  17
B.2  Training procedure  18
B.3  Attention biases for the sequential phase  18
B.4  Sampling schedule and sampler  18
B.5  Implementation details  19
B.6  Experimental details  20
Appendix C  Additional Experiments  22
C.1  Ablation study on split proportion  22
C.2  OWT Perplexity  22
C.3  Zero-Shot Likelihood Evaluation  22
C.4  Gen. Perplexities and Entropies of Generated Samples by Models Trained on OWT  23

---

# Appendices

# Appendix A Background

# A.1 BD3-LMs hyperparameter  $T^{\prime}$  nd num_tries

In the original codebase of BD3-LMs [1], the number of diffusion sampling steps  $T'$  for each block is set to 5000. This is an extremely high  $T'$  considering the fact that the number of tokens in each block  $L'$  is at most 16. Having  $L' \leq 16'$  and  $T' = 5000$  means that off-the-shelf BD3-LMs are not performing parallel generation because tokens are denoised one at a time.

Further, we found that BD3-LMs' codebase cherry-picks its samples. More specifically, to generate a single sample, the codebase keeps generating new samples (up to num_tries times) until one sample passes some quality-control test. By default, num_tries = 10 and the codebase reports sampling failure when the 10 tries are exhausted with no samples passing the test. Empirically, we found that sampling failures don't occur for  $T' = 5000$ .

To investigate the true performance of BD3-LMs for parallel generation, we set num_tries = 1, disable the quality-control test and evaluate samples from BD3-LMs across a wide range of  $T$  values (Figure 5). Here and in Figure 5,  $T$  means the sum of sampling steps across all blocks for BD3-LMs, e.g.,  $L' = 16$  and  $T = 4096$  means that  $T' = 4096 / (1024 / 16) = 64$  sampling steps is used per block. In contrast, BD3-LMs' codebase uses  $T' = 5000$  by default, which corresponds to  $T = \infty$  in Figure 5. For MDLM,  $T$  can be interpreted normally because it has no blocks.

As shown in Figure 5, as  $T$  is decreased to enable more parallel generation, both sample quality and sample diversity of BD3-LMs becomes significantly worse than MDLM. This drop in performance is due to the mode collapse issue as discussed in Section 6. We also found that increasing num_tries can somewhat improve the sample entropy of BD3-LMs (second row of Table 4) and mitigate mode collapse, but doing so provides less or no improvements for AR and MDLM.

![img-6.jpeg](img-6.jpeg)
Figure 5: Gen. Perplexity  $(\downarrow)$  with nucleus sampling  $(p = 0.9)$  against the number of sampling steps for AR, MDLM and BD3-LMs trained for 1 million steps. The number of sampling steps for AR is always 1024; we extend it to other values for easier comparison. The number next to each data point records its sample entropy  $(\uparrow)$ ; a value less than 5 usually indicates mode collapse.

---

Table 4: Gen. PPL (↓) and entropies (↑) (in parenethesis) for BD3-LMs  $L' = 16$ , MDLM, and AR with nucleus sampling  $p = 0.9$ . We observe that the num_tries parameter introduced in [1] for BD3-LMs selectively helps BD3-LMs but not the baselines. AR is not affected by  $T$ .

|   | BD3LM |   | MDLM |   | AR  |   |
| --- | --- | --- | --- | --- | --- | --- |
|  num_tries | 1 | 10 | 1 | 10 | 1 | 10  |
|  T = 1024 | 72.80 (5.35) | 77.71 (5.41) | 41.92 (5.36) | 41.79 (5.37) | 13.03 (5.26) | 13.76 (5.32)  |
|  T = 256 | 356.02 (5.11) | 440.69 (5.28) | 45.07 (5.40) | 44.57 (5.39) | 13.03 (5.26) | 13.76 (5.32)  |

# Appendix B Esoteric Language Models

# B.1 MDM loss

The NLL is given as:

$$
\begin{array}{l} - \log p _ {\theta} (\mathbf {x}) \leq - \mathbb {E} _ {\mathbf {z} _ {0} \sim q _ {0} (\cdot | \mathbf {x})} \log p _ {\theta} ^ {\mathrm {A R}} (\mathbf {x} | \mathbf {z} _ {0}) + \mathrm {D} _ {\mathrm {K L}} (q _ {0} (\mathbf {z} _ {0} | \mathbf {x}) \| p _ {\theta} ^ {\mathrm {M D M}} (\mathbf {z} _ {0})) \\ = - \mathbb {E} _ {\mathbf {z} _ {0} \sim q _ {0} (\cdot | \mathbf {x})} \left[ \sum_ {\ell \in \mathcal {M} (\mathbf {z} _ {0})} \log p _ {\theta} ^ {\mathrm {A R}} \left(\mathbf {x} ^ {\ell} \mid \mathbf {z} _ {0}, \mathbf {x} ^ {&lt;   \ell}\right) \right] + \mathrm {D} _ {\mathrm {K L}} \left(q _ {0} \left(\mathbf {z} _ {0} | \mathbf {x}\right) \| p _ {\theta} ^ {\mathrm {M D M}} \left(\mathbf {z} _ {0}\right)\right). \tag {39} \\ \end{array}
$$

Note that  $\mathbf{z}_0$  may contain clean tokens at indices exceeding the index  $\ell$ . As discussed in Sec. 3.1, the AR log-likelihood is given as:

$$
\sum_ {\ell \in \mathcal {M} \left(\mathbf {z} _ {0}\right)} \log p _ {\theta} ^ {\mathrm {A R}} \left(\mathbf {x} ^ {\ell} \mid \mathbf {z} _ {0}, \mathbf {x} ^ {&lt;   \ell}\right) = \sum_ {\ell \in \mathcal {M} \left(\mathbf {z} _ {0}\right)} \log \left(\mathbf {x} _ {\theta} ^ {\ell} \left(\mathbf {z} _ {0} \odot \mathbf {x} ^ {&lt;   \ell}\right), \mathbf {x} ^ {\ell}\right), \tag {40}
$$

where we compute the loss only at the masked indices  $\mathcal{M}(\mathbf{z}_0)$ .

To compute the KL term in (39), we define a masked diffusion process over  $\mathbf{z}_0$ . For this diffusion process, its forward marginal  $\mathbf{z}_t^\ell \sim q_t(\cdot |\mathbf{x}^\ell)$  at time  $t\in [0,1]$  is the same as (1) but uses a noise schedule with a scaled-down range  $(\alpha_{t})_{t\in [0,1]}\in [0,\alpha_{0}]$ , a strictly decreasing function in  $t$  with  $\alpha_{t = 0} = \alpha_0$  such that  $\mathbf{z}_{t = 0} = \mathbf{z}_0$  and  $\alpha_{t = 1} = 0$  such that  $\mathbf{z}_{t = 1} = \mathbf{m}^{1:L}$ . With  $T$  diffusion steps, we have:

$$
\begin{array}{l} \mathrm {D} _ {\mathrm {K L}} \left(q _ {0} (\mathbf {z} _ {0} | \mathbf {x}) \| p _ {\theta} ^ {\mathrm {M D M}} (\mathbf {z} _ {0})\right) = \mathbb {E} _ {\mathbf {z} _ {0}} \left[ \log \frac {q _ {0} (\mathbf {z} _ {0} | \mathbf {x})}{p _ {\theta} ^ {\mathrm {M D M}} (\mathbf {z} _ {0})} \right] \\ = \mathbb {E} _ {\mathbf {z} _ {0}} \left[ \log \mathbb {E} _ {\mathbf {z} _ {\frac {1}{T}: 1}} \left[ \frac {q (\mathbf {z} _ {0 : 1} | \mathbf {x})}{p _ {\theta} ^ {\mathrm {M D M}} (\mathbf {z} _ {0 : 1})} \right] \right] \\ \leq \mathbb {E} _ {\mathbf {z} _ {0: 1}} \left[ \log \frac {q (\mathbf {z} _ {0 : 1} | \mathbf {x})}{p _ {\theta} ^ {\mathrm {M D M}} (\mathbf {z} _ {0 : 1})} \right] \\ = \mathbb {E} _ {\mathbf {z} _ {0: 1}} \left[ \sum_ {t \in \left\{\frac {1}{T}, \frac {2}{T}, \dots , 1 \right\}} \log \frac {q \left(\mathbf {z} _ {t - \frac {1}{T}} \mid \mathbf {z} _ {t} , \mathbf {x}\right)}{p _ {\theta} ^ {\mathrm {M D M}} \left(\mathbf {z} _ {t - \frac {1}{T}} \mid \mathbf {z} _ {t}\right)} \right] \\ = \sum_ {t} \mathbb {E} _ {\mathbf {z} _ {t}} \left[ \mathrm {D} _ {\mathrm {K L}} \left(q \left(\mathbf {z} _ {t - \frac {1}{T}} \mid \mathbf {z} _ {t}, \mathbf {x}\right) \| p _ {\theta} ^ {\mathrm {M D M}} \left(\mathbf {z} _ {t - \frac {1}{T}} \mid \mathbf {z} _ {t}\right)\right) \right] \\ \end{array}
$$

Sahoo et al. [26] show that, as  $T \to \infty$ , the above simplifies to:

$$
= \mathbb {E} _ {t \sim \mathcal {U} [ 0, 1 ], \mathbf {z} _ {t} \sim q _ {t}} \left[ \frac {\alpha_ {t} ^ {\prime}}{1 - \alpha_ {t}} \sum_ {\ell \in \mathcal {M} (\mathbf {z} _ {t})} \log \left(\mathbf {x} _ {\theta} ^ {\ell} \left(\mathbf {z} _ {t}\right), \mathbf {x} ^ {\ell}\right) \right]. \tag {41}
$$

Finally, combining (40) and (41), we get the desired result:

$$
\begin{array}{l} \mathcal {L} _ {\mathrm {N E L B O}} (\mathbf {x}; \theta) \\ = \mathbb {E} _ {\mathbf {z} _ {0} \sim q _ {0}} \left[ - \underbrace {\sum_ {\ell \in \mathcal {M} \left(\mathbf {z} _ {0}\right)} \log \left(\mathbf {x} _ {\theta} ^ {\ell} \left(\mathbf {z} _ {0} \odot \mathbf {x} ^ {&lt;   \ell}\right) , \mathbf {x} ^ {\ell}\right)} _ {\text {A R l o s s}} \right] + \underbrace {\int_ {t = 0} ^ {t = 1} \frac {\alpha_ {t} ^ {\prime}}{1 - \alpha_ {t}} \mathbb {E} _ {\mathbf {z} _ {t} \sim q _ {t}} \left[ \sum_ {\ell \in \mathcal {M} \left(\mathbf {z} _ {t}\right)} \log \left(\mathbf {x} _ {\theta} ^ {\ell} \left(\mathbf {z} _ {t}\right) , \mathbf {x} ^ {\ell}\right) \right] d t} _ {\text {M D M l o s s}}. \tag {42} \\ \end{array}
$$

---

# B.2 Training procedure

Algo. 1 outlines the complete training procedure.

Algorithm 1 Eso-LMs Training
Input: dataset  $D$  , batch size bs, forward noise process  $q_{t}(\cdot |\mathbf{x})$  , model  $\mathbf{x}_{\theta}$  , learning rate  $\eta$
while not converged do
$\mathbf{x}_1,\mathbf{x}_2,\dots ,\mathbf{x}_{\mathrm{bs}}\sim D$
for  $i\gets 1$  to bs/2 do  $\triangleright$  If  $\alpha_0 = 1$  , loop through 1 to bs.
$\mathbf{z}_0\sim q_0(\cdot |\mathbf{x})$ $\sigma \sim \mathcal{P}_L$  with constraints Used to construct the attention bias  $A$  in  $\mathbf{x}_{\theta}$  (Sec. 4)
$\mathcal{L}_i\gets -\sum_{\ell \in \mathcal{M}(\mathbf{z}_0)}\log (\mathbf{x}_\theta^\ell (\mathbf{z}_0,\mathbf{x}^{&lt;  \ell}),\mathbf{x}_i^\ell)$  Estimator of Sequential Loss in (7)
end for
for  $i\gets \mathrm{bs} / 2 + 1$  to bs do  $\triangleright$  If  $\alpha_0 = 1$  , skip this loop.
Sample  $t\sim \mathcal{U}[0,1]$ $\mathbf{z}_t\sim q_t(\cdot |\mathbf{x})$ $\sigma \sim \mathcal{P}_L$  with constraints Used to construct the attention bias  $A$  in  $\mathbf{x}_{\theta}$  (Sec. 4)
$\mathcal{L}_i\gets \frac{\alpha_i'}{1 - \alpha_i}\sum_{\ell \in \mathcal{M}(\mathbf{z}_t)}\log (\mathbf{x}_\theta^\ell (\mathbf{z}_t),\mathbf{x}_i^\ell)$  Estimator of MDM Loss in (7)
end for
$\theta \gets \theta -\eta \nabla_{\theta}\sum_{i = 1}^{\mathrm{bs}}\mathcal{L}_i$
end while

# B.3 Attention biases for the sequential phase

Fig. 6 shows the comparison of attention biases for sequential-phase training.

![img-7.jpeg](img-7.jpeg)
Figure 6: Comparison of attention biases for sequential-phase training. Orange represents 0 (attention) and gray represents  $-\infty$  (no attention). The clean sequence is  $\mathbf{x} = (A, B, C, D, E, F)$  and hence  $L = 6$ . After random masking, we obtain  $\mathbf{z}_0 = (A, M, C, M, M, F)$ . The integers denote the position indices with  $\mathcal{M}(\mathbf{z}_0) = \{2, 4, 5\}$  and  $\mathcal{C}(\mathbf{z}_0) = \{1, 3, 6\}$ . The random ordering among  $\mathcal{C}(\mathbf{z}_0)$  is  $(3, 1, 6)$ . Red highlights the differences between Eso-LM (A) and Eso-LM (B).

# B.4 Sampling schedule and sampler

Eso-LMs perform two phases of sampling: the diffusion phase and the sequential phase. Within the diffusion phase, tokens are denoised in random order and potentially in parallel. Within the sequential phase, remaining mask tokens are denoised sequentially from left to right and one at a time.

First, to determine (i) the total number of tokens to denoise during the diffusion phase and (ii) the number of tokens to denoise per diffusion step, we run a modified version of the first-hitting algorithm proposed in [37]. Suppose the sequence to generate has length  $L$ , the number of discretization steps is  $T$ , and the noise schedule is  $\alpha$  (with  $\alpha_0 \geq 0$ ). Let  $dt = 1 / T$ . We iterate from  $t = 1$  to  $1 - dt$  (inclusive)

---

$T$ steps. For each step, we compute the number of tokens to denoise at time $t$ as

$n_{t}=\text{Binom}\left(n=n_{t}^{\text{remaining}},p=\frac{\alpha_{s}-\alpha_{t}}{1-\alpha_{t}}\right),$ (43)

where $s=t-dt$ and $n_{t}^{\text{remaining}}=L-\sum_{t^{\prime}>t}n_{t^{\prime}}$. When $T$ is large, some $n_{t}$’s could be zero. All the $n_{t}$’s produced by this algorithm are collected in an ordered list, except for the $n_{t}$’s that are zeros. We denote the sum of all $n_{t}$’s as $n^{\text{MDM}}$ and define $n^{\text{AR}}=L-n^{\text{MDM}}$.

We select $n^{\text{MDM}}$ token indices from $[L]$ to denoise by diffusion and use the complementing subset of token indices to denoise sequentially. For example, suppose $L=8$ and the token indices are $[1,2,\ldots,8]$. Suppose we obtained $n^{\text{MDM}}=5$ from the algorithm above. Then, the diffusion indices we may select are $(1,3,4,6,7)$ and the complementing sequential indices are $(2,5,8)$. We further randomly permute the diffusion indices to be, e.g., $(3,1,6,4,7)$, for random-order denoising.

Given the list of non-zero $n_{t}$’s and the permuted ordered set of diffusion indices, we create the sampling schedule for diffusion by partitioning the diffusion indices per the $n_{t}$’s. Suppose the list of non-zero $n_{t}$’s is $(2,1,2)$. Using it to partition the permuted set of diffusion indices $(3,1,6,4,7)$, we obtain the following sampling schedule for the diffusion phase: $\mathcal{S}^{\text{MDM}}=((3,1),(6),(4,7))$. The denoising schedule for the sequential phase is simply $\mathcal{S}^{\text{AR}}=((2),(5),(8))$. The unified sampling schedule $\mathcal{S}$ is the concatenation of $\mathcal{S}^{\text{MDM}}$ and $\mathcal{S}^{\text{AR}}$. In this example, $\mathcal{S}=(S_{1},S_{2},S_{3},S_{4},S_{5},S_{6})$ where $S_{1}=(3,1),S_{2}=(6),S_{3}=(4,7),S_{4}=(2),S_{5}=(5)$ and $S_{6}=(8)$. This corresponds to 6 NFEs. Finally, $\mathcal{S}$ is passed to Algo. 2, which handles the rest of the sampling procedure. Connecting back to the denoising ordering $\sigma$ discussed in Sec. 4.1.2 and Sec. 4.2.2, we have $\sigma=(3,1,6,4,7,2,5,8)$ in this example.

Input: sequence length $L$, unified sampling schedule $\mathcal{S}$
$\mathbf{z}=[\text{MASK\_INDEX},\ldots,\text{MASK\_INDEX}]$
$C=\{\}$ $\triangleright$ Indices of clean tokens
for $i\leftarrow 1$ to $|\mathcal{S}|$ do $\triangleright$ Sequential happens automatically when $|C|\geq n^{\text{MDM}}$
logits $\leftarrow\mathbf{x}_{\theta}(\mathbf{z}[C\cup S_{i}])$ $\triangleright$ See Remark
logits $\leftarrow$ select logits corresponding to $S_{i}$
$\mathbf{z}[S_{i}]\leftarrow\text{categorical\_sample(logits, dim=-1)}$ $\triangleright$ logits has shape $(|S_{i}|,|\mathcal{V}|)$
$C\leftarrow C\cup S_{i}$
end for
Return: $\mathbf{z}$
Remark. $\mathbf{z}[C\cup S_{i}]$ denotes the subset of the tokens in $\mathbf{z}$ that are fed into the denoising model $\mathbf{x}_{\theta}$. The position embeddings for a token $\mathbf{z}^{\ell}\in\mathbf{z}[C\cup S_{i}]$ is ensured to be the same as that in the original sequence $\mathbf{z}$. Refer to Sec. 4.1.2 and Sec. 4.2.2 for computing the sampling attention bias $A$ for Eso-LM (A) and Eso-LM (B) respectively. For Eso-LM (B), due to the use of causal attention, $\mathbf{x}_{\theta}$ is able to cache the KV-values of a clean token the first time it is processed.

Algorithm 2 Eso-LMs Sampling

### B.5 Implementation details

#### B.5.1 Training

##### Diffusion Phase

For both Eso-LM (A) and Eso-LM (B), we sort the input $\mathbf{z}_{t}$ as well as the rows and columns of $A$ by $\sigma$. This results in classic attention biases (Fig. 7) that can be efficiently implemented. We also sort the positional embeddings of $\mathbf{z}_{t}$ by $\sigma$ so tokens keep their original positional embeddings. When calculating loss, we additionally sort the target $\mathbf{x}$ by $\sigma$.

##### Sequential Phase

For both Eso-LM (A) and Eso-LM (B), we sort $\mathbf{z}_{0}$, $\mathbf{x}$ (before concatenating them as the input $\mathbf{z}_{0}\oplus\mathbf{x}$), and the rows and columns of each of the four $L\times L$ blocks in $A$ by $\sigma$. We further add specific extra attention connections for clean tokens in $\mathbf{z}_{0}$ – they don’t affect the transformer output because no other token attends to clean tokens in $\mathbf{z}_{0}$. These two transformations result in attention biases with sparse and patterned block structures (Fig. 8) that can be efficiently implemented. We also sort the positional embeddings of $\mathbf{z}_{0}$ and $\mathbf{x}$ by $\sigma$ so tokens keep their original positional embeddings. When calculating loss, we additionally sort the target $\mathbf{x}$ by $\sigma$.

####

---

![img-8.jpeg](img-8.jpeg)
Figure 7: Comparison of attention biases for diffusion-phase training, before and after sorting the rows and columns by  $\sigma$ . Orange represents 0 (attention) and gray represents  $-\infty$  (no attention). The clean sequence is  $\mathbf{x} = (A,B,C,D,E,F)$  and hence  $L = 6$ . After random masking, we obtain  $\mathbf{z}_t = (A,M,C,M,M,F)$ . The integers denote the position indices with  $\mathcal{M}(\mathbf{z}_t) = \{2,4,5\}$  and  $\mathcal{C}(\mathbf{z}_t) = \{1,3,6\}$ . The random ordering sampled is  $\sigma = (3,1,6,4,5,2) \sim \mathcal{P}_6$  with clean tokens before mask tokens. Red highlights the differences between Eso-LM (A) and Eso-LM (B).

![img-9.jpeg](img-9.jpeg)
Figure 8: Comparison of attention biases for sequential-phase training, before and after sorting the rows and columns of each of the four  $L \times L$  blocks by  $\sigma$ . Orange represents 0 (attention) and gray represents  $-\infty$  (no attention). The clean sequence is  $\mathbf{x} = (A, B, C, D, E, F)$  and hence  $L = 6$ . After random masking, we obtain  $\mathbf{z}_0 = (A, M, C, M, M, F)$ . The integers denote the position indices with  $\mathcal{M}(\mathbf{z}_0) = \{2, 4, 5\}$  and  $\mathcal{C}(\mathbf{z}_0) = \{1, 3, 6\}$ . The random ordering among  $\mathcal{C}(\mathbf{z}_0)$  is  $(3, 1, 6)$ . Red highlights the differences between Eso-LM (A) and Eso-LM (B). Green highlights the extra connections added for clean tokens in  $\mathbf{z}_0$  so that the attention biases display useful patterns after sorting – they don't affect the transformer output because no other token attends to clean tokens in  $\mathbf{z}_0$ .

# B.5.2 Sampling

Fig. 9 shows how the sampling procedure of Eso-LM (A) generates an example sequence. Fig. 10 shows how the sampling procedure of Eso-LM (B) generates an example sequence.

# B.6 Experimental details

# B.6.1 Low discrepancy sampler

To reduce variance during training we use a low-discrepancy sampler, similar to that proposed Kingma et al. [9]. Specifically, when processing a minibatch of  $N$  samples, instead of independently sampling  $N$  from a uniform distribution, we partition the unit interval and sample the time step for each sequence  $i \in \{1, \dots, N\}$  from a different portion of the interval  $t_i \sim U[\frac{i-1}{N}, \frac{i}{N}]$ . This ensures that our sampled timesteps are more evenly spaced across the interval  $[0, 1]$ , reducing the variance of the ELBO.

# B.6.2 Likelihood evaluation

We use a single monte-carlo estimate for  $t$  to evaluate the likelihood. We use a low discrepancy sampler [9] to reduce the variance of the estimate.

---

![img-10.jpeg](img-10.jpeg)
Figure 9: Efficient generation of an example sequence with Eso-LM (A). During Diffusion Phase, Eso-LMs denoise one or more, potentially non- neighboring mask tokens (M) per step. During Sequential Phase, Eso-LMs denoise the remaining mask tokens one at a time from left to right. Eso-LM (A) doesn't process mask tokens not scheduled for denoising and allows for KV caching in sequential phase: blue bounding boxes enclose transformer cells that are building their KV cache; a cell becomes blue once its KV cache is built. The sequences below the transformers depict tokens in their natural order.

![img-11.jpeg](img-11.jpeg)
Figure 10: (Copy of Fig. 1) Efficient generation of an example sequence with Eso-LM (B). During Diffusion Phase, Eso-LMs denoise one or more, potentially non- neighboring mask tokens (M) per step. During Sequential Phase, Eso-LMs denoise the remaining mask tokens one at a time from left to right. Eso-LM (B) allows for KV caching in both phases using just a single unified KV cache: blue bounding boxes enclose transformer cells that are building their KV cache; a cell becomes blue once its KV cache is built. The sequences below the transformers depict tokens in their natural order.

# B.6.3 Language modeling

We detokenize the One Billion Words dataset following [15, 26], whose code can be found here. We tokenize the One Billion Words dataset with the bert-base-uncased tokenizer, following Austin et al. [2], He et al. [7]. We concatenate and wrap sequences (also known as sequence packing) to a length of 128 [25]. When wrapping, we add the [CLS] token in-between concatenated sequences. The final preprocessed sequences also have the [CLS] token as their first and last token.

We tokenize OpenWebText with the GPT2 tokenizer. We concatenate and wrap them to a length of 1,024. When wrapping, we add the eos token in-between concatenated sequences. Unlike for One Billion Words, the final preprocessed sequences for OpenWebText do not have special tokens as their first and last token. Since OpenWebText does not have a validation split, we leave the last 100k docs as validation.

Eso-LMs shares the same parameterization as our autoregressive baselines, SEDD, MDLM, UDLM, and DUO: a modified diffusion transformer architecture [22] from Lou et al. [15], Sahoo et al. [26]. We use 12 layers, a hidden dimension of 768, 12 attention heads. Eso-LMs do not use timestep embedding used in uniform diffusion models (SEDD Uniform, UDLM, DUO). Word embeddings are not tied between the input and output. We train BD3-LMs using the original code provided by their authors.

---

We use the log-linear noise schedule  $\alpha_{t} = \alpha_{0}(1 - t)$ . We use the AdamW optimizer with a batch size of 512, constant learning rate warmup from 0 to a learning rate of 3e-4 for 2,500 steps. We use a constant learning rate for 1M steps on One Billion Words and for 250K steps for OpenWebText. We use a dropout rate of 0.1. We train models on H200 GPUs. On One Billon Words for 1M steps, training takes  $\sim 21$  hours when  $\alpha_{0} = 1$  and  $\sim 34$  hours when  $\alpha_{0} &lt; 1$ . On OpenWebText for 250K steps, training takes  $\sim 50$  hours when  $\alpha_{0} = 1$  and  $\sim 69$  hours when  $\alpha_{0} &lt; 1$ .

# Appendix C Additional Experiments

# C.1 Ablation study on split proportion

See Table 5.

Table 5: Test perplexities (↓) on LM1B for Eso-LMs (A) trained for 500K vs. the proportion of examples in each batch used for evaluating the MDM loss in (7) during training. Remaining examples in each batch are used for evaluating the AR loss in (7) during training.

|   | 0.75 | 0.5 | 0.25 | 0.125  |
| --- | --- | --- | --- | --- |
|  Eso-LM (A)  |   |   |   |   |
|  α0=0.5 | 32.25 | 31.53 | Diverged | Diverged  |
|  α0=0.25 | 30.49 | 29.33 | Diverged | Diverged  |
|  α0=0.125 | 27.76 | 26.73 | Diverged | Diverged  |
|  α0=0.0625 | 25.92 | 25.07 | Diverged | Diverged  |

# C.2 OWT Perplexity

See Table 6.

Table 6: Test perplexities (PPL; ↓) on OWT for models trained for 250K and 1M steps. We report bounds for diffusion models and interpolation methods.  $\ddagger$  Reported in [1].  $\dagger$  Denotes retrained models.  $\S$  Intermediate checkpoints were provided by Sahoo et al. [27], Arriola et al. [1].

|   | PPL 250K (↓) | PPL 1M (↓)  |
| --- | --- | --- |
|  Autoregressive  |   |   |
|  Transformer | 17.90$ | 17.54$  |
|  Diffusion  |   |   |
|  SEDD Absorb [15] | 26.81$ | 24.10$  |
|  MDLM [26] | 25.76$ | 22.98$  |
|  UDLM [29] | 30.52$ | 27.43  |
|  DUO [27] | 27.14$ | 25.20  |
|  Interpolating diffusion and autoregressive  |   |   |
|  BD3-LMs [1]  |   |   |
|  L' = 16 | 23.57† | 22.27‡  |
|  Eso-LM (A) (Ours)  |   |   |
|  α0 = 1 | 26.21 | -  |
|  Eso-LM (B) (Ours)  |   |   |
|  α0 = 1 | 30.14 | -  |
|  α0 = 0.5 | 27.85 | -  |
|  α0 = 0.25 | 24.73 | -  |
|  α0 = 0.125 | 21.87 | -  |

# C.3 Zero-Shot Likelihood Evaluation

We also explore models' ability to generalize by taking models trained on OWT and evaluating how well they model unseen datasets (Table 7). We compare the perplexities of our Eso-LMs with SEDD

---

[2], MDLM [26], BD3-LMs [1], and an AR Transformer language model. Our zero-shot datasets include the validation splits of Penn Tree Bank (PTB; [16]), Wikitext [17], LM1B, Lambada [21], AG News [36], and Scientific Papers (Pubmed and Arxiv subsets; [4]).

Table 7: Zero-shot perplexities (↓) of models trained for 250K steps on OWT. We report bounds for diffusion models and interpolation methods. Numbers for AR were taken from [1].

|   | PTB | Wikitext | LM1B | Lambada | AG News | Pubmed | Arxiv  |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  AR | 81.07 | 25.32 | 51.14 | 52.13 | 52.11 | 48.59 | 41.22  |
|  MDLM | 93.82 | 36.89 | 69.45 | 53.05 | 67.33 | 49.47 | 43.84  |
|  SEDD Absorb | 99.59 | 38.55 | 72.51 | 52.16 | 72.62 | 47.07 | 41.18  |
|  BD3-LM (L' = 16) | 90.63 | 33.14 | 64.88 | 53.09 | 62.5 | 43.25 | 39.82  |
|  Eso-LM (B) (Ours)  |   |   |   |   |   |   |   |
|  α0 = 1 | 126.29 | 45.08 | 82.01 | 61.37 | 98.22 | 62.37 | 55.76  |
|  α0 = 0.5 | 110.70 | 39.57 | 75.75 | 57.33 | 86.65 | 60.20 | 53.78  |
|  α0 = 0.25 | 105.19 | 37.32 | 67.69 | 60.15 | 75.74 | 62.45 | 55.31  |
|  α0 = 0.125 | 97.46 | 35.65 | 60.11 | 69.13 | 65.26 | 65.27 | 57.4  |

# C.4 Gen. Perplexities and Entropies of Generated Samples by Models Trained on OWT

In Fig. 3 we study how the sample quality changes by varying NFEs. The numerical values for Gen. PPL and entropy can be found in Table 8 (Eso-LMs), Table 9 (MDLM), and Table 10 (BD3-LMs).

Table 8: Gen. PPL (↓) and entropies (↑) of samples by Eso-LM (B) trained for 250K steps on OWT.

|  α0train | α0eval | T | NFE | Gen. PPL (↓) | Entropy (↑)  |
| --- | --- | --- | --- | --- | --- |
|  0.125 | 0.0625 | 16 | 977.18 | 23.15 | 5.37  |
|  0.125 | 0.0625 | 128 | 1011.37 | 25.51 | 5.41  |
|  0.125 | 0.0625 | 1024 | 1022.13 | 26.85 | 5.43  |
|  0.125 | 0.25 | 16 | 806.47 | 46.68 | 5.45  |
|  0.125 | 0.25 | 128 | 896.41 | 44.19 | 5.42  |
|  0.125 | 0.25 | 1024 | 999.24 | 49.55 | 5.47  |
|  0.125 | 1.0 | 16 | 16.0 | 279.63 | 5.54  |
|  0.125 | 1.0 | 128 | 127.96 | 151.77 | 5.4  |
|  0.125 | 1.0 | 1024 | 647.06 | 159.31 | 5.42  |
|  0.25 | 0.0625 | 16 | 977.18 | 23.95 | 5.36  |
|  0.25 | 0.0625 | 128 | 1011.37 | 26.13 | 5.39  |
|  0.25 | 0.0625 | 1024 | 1022.13 | 27.96 | 5.41  |
|  0.25 | 0.25 | 16 | 806.47 | 42.31 | 5.43  |
|  0.25 | 0.25 | 128 | 896.41 | 38.48 | 5.39  |
|  0.25 | 0.25 | 1024 | 999.24 | 43.71 | 5.44  |
|  0.25 | 1.0 | 16 | 16.0 | 152.16 | 5.55  |
|  0.25 | 1.0 | 128 | 127.96 | 72.74 | 5.4  |
|  0.25 | 1.0 | 1024 | 647.06 | 72.36 | 5.42  |
|  1.0 | 0.0625 | 16 | 977.18 | 31.33 | 5.21  |
|  1.0 | 0.0625 | 128 | 1011.37 | 30.9 | 5.19  |
|  1.0 | 0.0625 | 1024 | 1022.13 | 31.11 | 5.19  |
|  1.0 | 0.25 | 16 | 806.47 | 50.14 | 5.4  |
|  1.0 | 0.25 | 128 | 896.41 | 43.59 | 5.33  |
|  1.0 | 0.25 | 1024 | 999.24 | 43.6 | 5.32  |
|  1.0 | 1.0 | 16 | 16.0 | 118.92 | 5.53  |
|  1.0 | 1.0 | 128 | 127.96 | 54.36 | 5.37  |
|  1.0 | 1.0 | 1024 | 647.06 | 49.4 | 5.33  |

---

Table 9: Gen. PPL (↓) and entropies (↑) of samples by MDLM trained for 1M steps on OWT.

|  T | NFE | Gen. PPL (↓) | Entropy (↑)  |
| --- | --- | --- | --- |
|  16 | 16 | 148.08 | 5.61  |
|  128 | 127.96 | 48.66 | 5.43  |
|  256 | 251.35 | 45.07 | 5.4  |
|  512 | 442.87 | 42.58 | 5.37  |
|  1024 | 647.91 | 41.92 | 5.36  |
|  4096 | 906.32 | 41.53 | 5.36  |

Table 10: Gen. PPL (↓) and entropies (↑) of samples by BD3-LM trained for 1M steps on OWT.

|  Block size | T | NFE | Gen. PPL (↓) | Entropy (↑)  |
| --- | --- | --- | --- | --- |
|  4 | 4096 | 925.32 | 41.04 | 5.31  |
|  4 | 2048 | 830.93 | 88.4 | 5.19  |
|  4 | 1024 | 672.91 | 199.99 | 4.79  |
|  4 | 512 | 480.21 | 186.05 | 4.23  |
|  4 | 256 | 256.0 | 199.22 | 4.39  |
|  8 | 4096 | 915.14 | 39.88 | 5.33  |
|  8 | 2048 | 814.07 | 59.84 | 5.34  |
|  8 | 1024 | 646.69 | 137.99 | 5.24  |
|  8 | 512 | 439.32 | 258.95 | 4.92  |
|  8 | 256 | 254.9 | 278.57 | 4.39  |
|  8 | 128 | 128 | 466.1 | 4.91  |
|  16 | 4096 | 910.37 | 38.74 | 5.33  |
|  16 | 2048 | 811.01 | 47.02 | 5.34  |
|  16 | 1024 | 642.25 | 73.84 | 5.36  |
|  16 | 512 | 427.46 | 189.26 | 5.33  |
|  16 | 256 | 245.77 | 351.63 | 5.1  |
|  16 | 128 | 128 | 447.24 | 4.61  |