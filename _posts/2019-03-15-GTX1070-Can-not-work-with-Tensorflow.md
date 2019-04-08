---
layout: post
title: GTX1070 cannot work with Tensorflow
category: Deeplearning
published: true
tags: [AI]
comments: true
---
I was trying to set up Deep learning on my Windows PC. However, after installing Anaconda, I cannot use my GPU to do my training. It shows
```
E tensorflow/stream_executor/cuda/cuda_blas.cc:461] failed to run cuBLAS routine cublasSgemm_v2: CUBLAS_STATUS_EXECUTION_FAILED
```    
I search for many sources trying to solve this problem. I tried to set up with [this](https://towardsdatascience.com/tensorflow-gpu-installation-made-easy-use-conda-instead-of-pip-52e5249374bc) guide, and then I found [this](https://www.pugetsystems.com/labs/hpc/The-Best-Way-to-Install-TensorFlow-with-GPU-Support-on-Windows-10-Without-Installing-CUDA-1187/) one with detailed. The setup was smooth, but I still cannot run the training because of the error.

It is definitely a nightmare to solve the issue. Then I found it on [stackoverflow](https://stackoverflow.com/questions/38303974/tensorflow-running-error-with-cublas). 

The solution is
```python
add to the top of your code under import tensorflow as tf
config = tf.ConfigProto()
config.gpu_options.allow_growth = True
session = tf.Session(config=config...)
```

It works well when I modify the config "allow_growth" to true. Then it can use GPU to train the networked lighting fast.

UPDATE 2019-04-05:
It was working well for some time. However, I found some serious problem with the graphic card. My GTX1070 crash everything if the memory usage exceed 3 GB. I found it when I was playing BF5. Now, I have sent the graphic card to repaired. So, if you run into some problem like this, you should try to check if your graphic card is working in a good condition.