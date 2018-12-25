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

How do agent remember to go out the maze? It distingush the path by giving it a value. One example is increase the value of the path. However, we cannot assign same value to all the action we take. Then we will introduce Bellman equation.
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
Markov Decision process is a mathematical framework that helps decice thing with some random and under control.

Using Bellman Equation,
$$ V(s') $$ becomes the expected value of all possible action. Does not know which state we are going into.
$$
\begin{align*}
V(s)=\underset{\scriptstyle\text{a}}{max}(R(s,a) + \gamma \sum_{s'} P(s, a, s')V(s'))
\end{align*}
$$

p is the probability that the next step we take.
It gives probability to differnt movement to get close to the destination.

### Markov Property
A stochastic process has the Markov property if the conditional probability distribution of future states of the process (conditional on both past and present states) depends only upon the present state, not on the sequence of events that preceded it. A process with this property is called a Markov process. (From [wikipedia](https://en.wikipedia.org/wiki/Markov_property))

Interesting paper: [A survey of applications of markov decision processes](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=2ahUKEwjm9smw07nfAhWen4MKHYLSDdoQFjAAegQIChAC&url=http%3A%2F%2Fwww.cs.uml.edu%2Fecg%2Fuploads%2FAIfall14%2FMDPApplications3.pdf&usg=AOvVaw0pckXvWJBNr9T-yoDqBIRa)

### Living Penalty
When we have those calculation, we will habe better result. However, how do we encourage them to do it faster?

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
Simple Q learning is no longer suit for complicated environment. We can use deep learning to calculate Q. Therefore, it is not limited to one simple rule and formula.

Nural network will perdict the Q value.
How to adapt the TD in Q value. calcule error/loss using bp to update the weight.