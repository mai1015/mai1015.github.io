---
layout: post
title: Recurrent Neural Networks
category: Note
published: true
hidden: false
tags: [AI, Math]
comments: true
---

$$
\begin{align*}
\frac{\partial\varepsilon}{\partial\theta}&=\sum_{1 \leq t \leq T} \frac{\partial\varepsilon_{t}}{\partial\theta}\\
\frac{\partial\varepsilon}{\partial\theta}&=\sum_{1 \leq k \leq t} (\frac{\partial\varepsilon_{t}}{\partial x_{t}}\frac{\partial x_{t}}{\partial x_{k}}\frac{\partial^{+}x_{k}}{\partial \theta})\\
\frac{\partial x_{t}}{\partial x_{k}}&=\amalg_{t \geq i > k} \frac{\partial x_{i}}{\partial x_{i-1}}=\amalg_{t \geq i > k} W_{rec}^{T} diag(\sigma^{'}(x_{i-1}))
\end{align*}
$$

$$W_{rec} \sim small (<1)$$ cause vanishing\\
$$W_{rec} \sim large (>1)$$ cause Exploding

### Solution to The Vanishing Gradient Problem.
- Exploding Gradient
  - Trucated Backpropagation
  - Penalties
  - Gradient Clipping
- Vanishing Gradient
  - Weight Initialization
  - Echo State Networks
  - Long Short-Term Memory Networks(LSTMs)

### LSTM
Set $$W_{rec}$$ to 1.
[This](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) is a good post about it. It basically saying that the tradictional neural network is hard to link between the context. However, they are good at linking it long-term. LSTMs is a way to solve it. It basically adds more action before the activation function, and that allows the 