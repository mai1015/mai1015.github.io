---
layout: post
title: Arduino Intergrated Circuit Communication Note
category: Arduino
published: trye
tags: [Arduino,Hardware,MPU6050,Note]
comments: true
---
I am trying to build a step counter with MPU6050, and it is not so hard to do it. I learn a lot of stuff relative to how hardware like arduino and other parts communicating.

## Type of communication
I found three common type of communication protocals are widely used:
- I2C (Inter-Integrated Circuit Protocol)
- UART (Universal Asynchronous Receiver/Transmitter)
- SPI (Serial Peripheral Interface)

### I2C (Inter-Integrated Circuit)
This protocal is simple to use. It connects all part via *I2C Bus* which consist two lines are Serial Data Line (SDA) and Serial Clock Line (SCL).

A microcontroller act as master and other part act as slave takes controll from the master. The clock is controll by the master. Sameple schematic below, from [wikipedia](https://en.wikipedia.org/wiki/I²C#Arbitration_using_SDA).

![I2C Sample Schematic](/public/image/2019-02-05/1024px-I2C.png)

Each device have a unique address so thry can communicate. Basic communication is using transfers of 8 bytes. Each I2C slave have 7 bytes address. The bit 0 is signal to read or write to the device.

Communication is initialized by master device. In normal state, both lines SCL and SDA are high. Then *Start condition* is drop the SDA line. After that, ther master will start sending the address. Then follow by one bit of operation. If bit was 0, it means writing to slave. If bit was 1, then it will read from the slave. Once all bits are finish, it follows the *Stop condition*. Then the other device on the bus can use the bus. The image show how the device communicate, image from [here](https://i2c.info).

![I2C protocal](/public/image/2019-02-05/i2c-protocol.png)

### UART (Universal Asynchronous Receiver/Transmitter)
This is not really a kind of communication protocol like I2C. It is a standalone IC. It only use two wires (two Tx pin to Rx pin) to transmit data between devices. This transmit data asynchronously, because there is no clock needed. Instead, it adds start and stop bit to the packet (Image below from [here](http://www.circuitbasics.com/basics-uart-communication/)). So, it know when to start reading and end reading. They read byte at a specify frequency aka baud rate. Baud rate is the speed of data express in bit pre second (bps).

![Uart packet](/public/image/2019-02-05/Introduction-to-UART-Packet-Frame-and-Bits-2.png)

It works simple, however, you cannot connect multiple slave or mutiple master systems. Also, we need to adjuest the BPS to match the other part.

It's no compatible with the I2C.

### SPI (Serial Peripheral Interface)
I haven research about this. I have little knowledge of it. Thats how arduino and computer communicate. I will do some more research about it.