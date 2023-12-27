---
sidebar_position: 1
---

# Initial details

First, we'll need a network on which to operate.

## The absolute basics
### Documentation
Yes, documentation is the very first thing.

Even if it's a Google Doc, start by writing down your thoughts as you go. They will be *incredibly* helpful on your labbing journey.

### Domain name
We'll get started by choosing a domain name for our lab to live on. Riff Labs has gone through a few domains over the years, but we finally settled on `riff.cc` for simplicity's sake. Since the purpose of the lab is essentially to be a research platform for the Riff.CC Project and also a fun place to experiment and learn (and push open source forward!) the name eventually stuck (it only took 3 years!)

A domain name is useful to make it easy to remember and navigate to the various parts of the lab, as well as for providing authenticity through things like TLS (which powers HTTPS - the happy green padlock/tuner icon you see around the web). It means you can have names like monitoring.riff.cc and inventory.riff.cc and dashboard.riff.cc, instead of things like `http://10.1.1.151/cmk`.

So - it's settled - **`riff.cc` it is**.

### Network range

Now for a network range. We should pick one that is flexible and will allow us to do everything we want to do, without being so flexible that it causes issues. Unfortunately this is where Riff Labs falls a little short - we chose the CIDR network range of `10.1.0.0/16`. This is a private IPv4 block of addresses that allows for 65535 different possible addresses - tons of room for activities! - but having a single range for everything with no division is not necessarily the right choice.

If you're building your own lab (and if IPv4 is still sadly relevant when you're reading this), we strongly suggest you start with a /24 network such as `10.20.30.0/24`, or even `192.168.1.0/24`. You can expand later by creating additional virtual networks called VLANs, as opposed to having a giant "flat" network. Riff Labs is in the process of transitioning away from having a single flat network.