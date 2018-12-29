---
layout: post
title: Reinforcement Learning
category: Note
tags: [AI, Math]
comments: true
---
## Concept

- s - state
- a - action
- R - reward
- $$ \gamma $$ - Discount

Let AI know what they can do, and just let them know the things they can do.

such as a maze, tell AI agent to move around. Give a reward (Reinforcement Learning) to the agent.

How does agent remember to go out the maze? It distinguishes the path by giving it a value. One example is increasing the value of the path. However, we cannot assign the same value to all the action we take. Then we will introduce the Bellman equation.
## Bellman Equation
$$
\begin{align*}
V(s)=\underset{\scriptstyle\text{a}}{max}(R(s,a) + \gamma V(s'))
\end{align*}
$$

- s = current state
- $$ s' $$ = next state
- R is reward while the game.

calculate the max reward, take the optimal state. $$ \gamma $$ eliminate the same value in the path. Inspire the agent to go on the right path.

It basically builds a map.

Additional: [Original Paper](https://www.rand.org/pubs/papers/P550.html)

## Markov Decision Process
Markov Decision process is a mathematical framework that helps decide thing with some random and under control.

Using Bellman Equation,
$$ V(s') $$ becomes the expected value of all possible action. Does not know which state we are going into.
$$
\begin{align*}
V(s)=\underset{\scriptstyle\text{a}}{max}(R(s,a) + \gamma \sum_{s'} P(s, a, s')V(s'))
\end{align*}
$$

p is the probability that the next step we take.
It gives probability to a different movement to get close to the destination.

### Markov Property
A stochastic process has the Markov property if the conditional probability distribution of future states of the process (conditional on both past and present states) depends only upon the present state, not on the sequence of events that preceded it. A process with this property is called a Markov process. (From [wikipedia](https://en.wikipedia.org/wiki/Markov_property))

Interesting paper: [A survey of applications of Markov decision processes](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=2ahUKEwjm9smw07nfAhWen4MKHYLSDdoQFjAAegQIChAC&url=http%3A%2F%2Fwww.cs.uml.edu%2Fecg%2Fuploads%2FAIfall14%2FMDPApplications3.pdf&usg=AOvVaw0pckXvWJBNr9T-yoDqBIRa)

### Living Penalty
When we have that calculation, we will have a better result. However, how do we encourage them to do it faster?

We can use punishment. For each movement, there will be a penalty. That way, it will try to go faster with less action.

## Q-Learning Intuition

### What is Q
Replace Q instead of V.
$$
\begin{align*}
V(s)&=\underset{\scriptstyle\text{a}}{max}(Q(s,a))\\
Q(s, a)&=R(s,a)+\gamma\sum_{s'} (P(s, a, s')V(s'))\\
Q(s, a)&=R(s,a)+\gamma\sum_{s'} (P(s, a, s')\underset{a'}{max}(Q(s', a')))
\end{align*}
$$

V takes the maximum value. Q leaning takes all the possible action.

In short: $$ Q(s, a)=R(s,a)+\gamma \:\underset{a'}{max}(Q(s', a'))) $$

Detail: [Markov Decision Processes: Concepts and Algorithms](https://pdfs.semanticscholar.org/968b/ab782e52faf0f7957ca0f38b9e9078454afe.pdf)

### Temporal Difference
$$
\begin{align*}
TD(a, s) = R(s,a)+\gamma\:\underset{a'}{max}(Q(s', a'))-Q(s,a)
\end{align*}
$$

different in time. $$ Q(s, a)$$ action previously, new $$Q(s',a')$$ now.

Want to change small amount
$$
\begin{align*}
TD(a, s) = R(s,a)+\gamma\:\underset{a'}{max}(Q(s', a'))-Q_{t-1}(s,a)\\
Q_{t}(s,a)=Q_{t-1}(s,a)+\alpha TD_{t}(a,s)
\end{align*}
$$

$$\alpha$$ is the learning rate.

Get TD() as close as possible to 0. Come up the optimal action.
$$
\begin{align*}
Q_{t}(s,a)=Q_{t-1}(s,a)+\alpha (R(s,a)+\gamma\:\underset{a'}{max}(Q(s', a'))-Q_{t-1}(s,a))
\end{align*}
$$

Additional Reading: [Learning to predict by the methods of temporal differences](https://link.springer.com/article/10.1007/BF00115009)


## Deep Q-Learning Intuition
Simple Q learning is no longer suited for the complicated environment. We can use deep learning to calculate Q. Therefore, it is not limited to one simple rule and formula.

The neural network will predict the Q value.
How to adapt the TD in Q value. calculate error/loss using bp to update the weight.

Resource: [Simple Reinforcement Learning with Tensorflow Part 4: Deep Q-Networks and Beyond](https://medium.com/@awjuliani/simple-reinforcement-learning-with-tensorflow-part-4-deep-q-networks-and-beyond-8438a3e2b8df)


### Experience Replay
In some environment, there is a different condition that will help AI to learn. Such as a self-driven car, it learns how to drive a car. Each movement is necessary to go through the network. However, it cannot learn will by one piece. Therefore, it will remember a sequence of action as a batch. When it has enough information, it started to learn by viewing the batch. It can enchant the learning process. It will reduce the number of time to practice.

### Action Selection Policies
When the network output the percentage of an action. How does the machine choose which action to take? There are many action selection policies. One example is "softmax" decide the action we take.

In exploration, it will take as probability how often the action will take. Just randomly selecting the action.

Resource: [Adaptive ε-greedy Exploration in Reinforcement Learning Based on Value Differences](http://tokic.com/www/tokicm/publikationen/papers/AdaptiveEpsilonGreedyExploration.pdf)