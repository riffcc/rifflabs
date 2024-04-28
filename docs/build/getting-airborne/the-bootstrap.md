---
sidebar_position: 3
---

# The Bootstrap
We have a problem.

We have three or more Proxmox nodes, capable of hosting VMs, but we have only a single VM.

We need to be able to create more VMs, and we need to be able to do it quickly and easily.

Enter [The Foreman](https://theforeman.org/).

## What is Foreman?
Foreman is a bare metal machine provisioning system. It allows you to provision hosts with an operating system automatically.

## The plan
We'll first setup Foreman within a VM, and then use it to provision the rest of our VMs. Later, once all of our VMs have been setup, we'll lay a Kubernetes cluster over the top of them, spawn a highly available PostgreSQL cluster, and then make Foreman highly available too.

Once this is done, interestingly, we'll be able to use Foreman to re-provision and reinstall any machine in the lab, including the machines that are running Foreman itself.

![Boots within boots](assets/bootsception.png)

## Setting up Foreman
We'll be taking a somewhat unconventional approach to setting up Foreman - setting it up normally, then building Kubernetes, then using Kubernetes to host Foreman's database. Finally, we'll set up a highly available set of HAProxy nodes to service Kubernetes and Foreman.

Once that's all complete, we'll use Foreman's Smart Proxy system to deploy a satellite node on each VLAN that we wish to deploy machines to, allowing us to automate installation of any part of Riff Labs.

### Creating a new VM
We'll create a new node, which we'll call `foreman01`, which will host our initial Foreman installation. Technically, you can install multiple services or groups of software on the same machine, but keeping things separate results in systems that are more predictable, sane and easy to manage.

Create a new VM called `foreman01` with 4 vCPUs, 80GiB of disk and 8192MiB of RAM and install Debian on it as before. Note: Foreman currently requires Debian ***11***, not 12, so make sure you use Debian Bullseye instead of Bookworm.

:::tip

You can provide a VM with less RAM while allowing it to use more RAM when necessary. This is very useful if you have processes that use RAM only some of the time.

:::

Once your VM has been created and is ready to go, grab its IP address (which should be visible in Proxmox) and set it as a static DHCP lease in Gravity (our DNS + DHCP service from earlier), and ensure there is a DNS entry for it.

### Installing Foreman
Follow the Foreman install guide [here](https://theforeman.org/manuals/3.10/quickstart_guide.html), then proceed to install Foreman.

You'll need to replace the values with sane values for your cluster.

```
sudo foreman-installer \
--enable-foreman-proxy \
--foreman-proxy-tftp=true \
--foreman-proxy-tftp-servername=foreman.riff.cc \
--foreman-proxy-dhcp=true \
--foreman-proxy-dhcp-interface=enp6s18 \
--foreman-proxy-dhcp-gateway=10.1.1.1 \
--foreman-proxy-dhcp-nameservers="10.1.1.151,10.1.1.152,10.1.1.153"
```

You may see an issue about a missing locale (`en_US.utf8`). If this is the case, run `dpkg-reconfigure locales`, enable the missing locale, reboot, and then re-run the installer.

### Configuring Foreman
#### Subnets
Log in with the credentials provided, then go to Infrastructure -> Subnets

Create a subnet as follows (replacing all the details as needed):

```
Name: RiffLabs Legacy
Description: Legacy network for RiffLabs
Protocol: IPv4
Network Address: 10.1.0.0
Network Prefix: 16
Network Mask: 255.255.0.0
Gateway Address: 10.1.1.1
Primary DNS Server: 10.1.1.151
Secondary DNS Server: 10.1.1.152
IPAM: None
Vlan Id: 1
MTU: 1500
Boot Mode: static
```

Click Domains and associate the domain you selected earlier

Click Proxies and select the default in the dropdowns for each.

#### Location and Organisation
Go to Administer -> Locations and rename the default location, then to Organizations and rename the default Organization.
