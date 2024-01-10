---
sidebar_position: 3
---

# The Tinkerbell Bootstrap
We have a problem.

We have three or more Proxmox nodes, capable of hosting VMs, but we have only a single VM.

We need to be able to create more VMs, and we need to be able to do it quickly and easily.

Enter [Tinkerbell](https://tinkerbell.org).

## What is Tinkerbell?
Tinkerbell is a bare metal machine provisioning system. It allows you to define a machine's configuration in a declarative way, and then provision it with an operating system automatically.

## The plan
We'll first setup Tinkerbell within a VM, and then use it to provision the rest of our VMs. Later, once all of our VMs have been setup, we'll lay a Kubernetes cluster over the top of them, and then install a permanent Tinkerbell installation on top.

Once this is done, interestingly, we'll be able to use Tinkerbell to re-provision and reinstall any machine in the lab, including the machines that are running Tinkerbell itself.

![Boots within boots](assets/bootsception.png)

## Enabling nested virtualization
We're going to enable a feature called Nested Virtualisation. If you're building a modern platform (see [TODO: Hardware]) and Proxmox VE, you'll likely already have this enabled. Either way, check out [this guide](https://pve.proxmox.com/wiki/Nested_Virtualization) for information on how to verify that it's available in your environment. In particular, you should go to your VM and check if it has "Host" as the CPU type.

