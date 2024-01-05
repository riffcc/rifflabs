---
sidebar_position: 1
---

# Robots
We'll be building some robots to operate the lab. These robots will be virtual machines, which we'll create using Proxmox. We just created the first one and logged into it.

## What is a robot?
A robot is a virtual machine which is used to perform specific lab tasks automatically and on a schedule, as well as a place for technicians to log into and perform tasks manually.

## What robots are we building?
robot01 is a general purpose machine which we'll set up to do the following tasks:

* Create a base Ansible playbook which can be used to configure any machines in the network - including itself.
* Run an Ansible Semaphore server - https://semui.co/ - with the above playbook included in it.
* Bootstrap some basic infrastructure using Tinkerbell.

## Ansible
Ansible is a tool for automating the configuration of machines. It's a very powerful tool, and we'll be using it to configure all of the machines in the lab. We'll be using it to configure robot01 itself, using itself.

### Getting Ansible installed
Let's start by installing the latest versions of `ansible`, `ansible-lint`, and `yamllint`. You'll essentially be following [this guide](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).

Log into your machine, then run the following:

```bash
sudo apt update
sudo apt install -y python3-pip pipx
pipx ensurepath
```

Log out, and then back in. Then:
```bash
pipx install ansible
pipx install ansible-lint
pipx install yamllint
```

```
riff@robot01:~$ pipx install ansible
  installed package ansible 9.1.0, installed using Python 3.11.2
  These apps are now globally available
    - ansible-community`
done! ✨ 🌟 ✨
```