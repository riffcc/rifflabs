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
* Run an Ansible playbook to configure itself and the rest of the lab.
* Bootstrap some basic infrastructure using The Foreman.

## Ansible
Ansible is a tool for automating the configuration of machines. It's a very powerful tool, and we'll be using it to configure all of the machines in the lab. We'll be using it to configure robot01 itself, using itself.

### Getting Ansible installed
Let's start by installing the latest versions of `ansible`, `ansible-lint`, and `yamllint`. You'll essentially be following [this guide](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).

On your own workstation, run the following:

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

In this example, we've installed Ansible on the new `robot01` machine, since it will also need to be able to run Ansible at some point.

```
riff@robot01:~$ pipx install ansible
  installed package ansible 9.1.0, installed using Python 3.11.2
  These apps are now globally available
    - ansible-community`
done! ✨ 🌟 ✨
```

Once you've installed Ansible on your workstation, you're ready to start using it.

### Ansible Playbooks
An Ansible "playbook" is a bundle of code, manifests, templates and more that allows you to configure machines or sets of machines. We'll be using playbooks to configure all of the machines in the lab.

Let's check out the `rifflab-infrastructure` repository.

:::note

You can use your own path instead of `~/projects` below, but we suggest you use `~/projects` to keep things consistent with our examples.

:::

```bash
mkdir -p ~/projects/ && cd ~/projects/
git clone git@github.com:riffcc/rifflabs-infrastructure.git
cd rifflabs-infrastructure
cd playbooks/base-playbook
```

We've entered a directory containing a basic Ansible playbook. Let's have a look at what it looks like so far:

*playbooks/base-playbook/deploy.yml*
```yaml
---
- name: Apply basic configuration
  hosts: all
  become: true

  roles:
    - dns
```

*playbooks/base-playbook/ansible.cfg*
```ini
---
[defaults]
inventory = inventory
pipelining = True

[ssh_connection]
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
```

*playbooks/base-playbook/tasks/main.yml*
```yaml
---
- name: Ensure systemd-resolved is installed
  package:
    name: systemd-resolved
    state: present

- name: Ensure systemd-resolved is configured with the local DNS servers
  community.general.ini_file:
    path: /etc/systemd/resolved.conf
    section: Resolve
    option: DNS
    values: "{{ dns_servers }}"
    mode: '0600'
    state: present
  notify: Restart systemd-resolved
```

We have a very basic structure, common for Ansible playbooks. If you want to learn more about Ansible, you should make your own playbook to build your developer workstation and install everything you normally need on your machine.

```
wings@blackberry:~/projects/rifflabs-infrastructure/playbooks/base-playbook$ tree
.
├── ansible.cfg
├── deploy.yml
└── roles
    └── dns
        ├── defaults
        │   └── main.yml
        ├── handlers
        │   └── main.yml
        └── tasks
            └── main.yml
```

There's a great book by Jeff Geerling called [Ansible for DevOps](https://www.ansiblefordevops.com/), which we highly recommend. The book is now totally free and open source, too!
