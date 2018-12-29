---
layout: post
title: Convolutional Neural Network
category: Note
tags: [AI, Math]
comments: true
---
## Concept

Basic neural network is pretty simple way to build and let computer learn from stuffs. It can actually become pretty smart after some time. However, it is hard to let it work with things like images.

We have Convolutional Neural Network to make it easier.

## Convolutional Neural Network
The basic concept are the same, but there are pre-processing for the image data.

### 1. Convolutional Operation
It takes the input image and apply Feature Detector via multiply each valuable value so respect to value to genertate Feature Map.

We will create multiple feature map with different Feature Detector to obtain first convolutional layer.

### 1b. ReLU Layer
Then we apply Rectifier Function to the Feature Map to break the linear because the image is not linear.
Detail: [Delving Deep into Rectifiers](https://arxiv.org/pdf/1502.01852.pdf)

### 2. Max Pooling
We then reduce the size of the Feature by doing a Max Pooling to generate a small Pooled Feature Map. It reducing the number of parameters going in to the network. Also, it is harder to get overfitting.

### 3. Flattening
It basically take the numbers row by row and put it in to long column. Then it can fit in to neural network for processing.

### 4. Full Connection
Rether than regular neural network, we have a fully connection network. It means the node is connected to all other nodes perivous layer.

## Softmax & Cross-Entropy
### Softmax
The result does not actually add up to one. so we apply a soft max to calculate the prectage.

$$
\begin{align*}
f_{i}(z)=\frac{e^{z_{j}}}{\sum_{k}e^{z_{k}}}
\end{align*}
$$


### Cross-Entropy
Loss function.

$$
\begin{align*}
L_{i}=-\log{\frac{e^{f_{yi}}}{\sum_{j}e^{f_{j}}}}
\end{align*}
$$

Repesentation, is easier to calculate.

$$
\begin{align*}
H(p,q)=-\sum p(x) \log q(x)
\end{align*}
$$


